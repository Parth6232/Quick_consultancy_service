/**
 * api/chat.js — Vercel Serverless Function
 *
 * Proxies user messages to Google Gemini API server-side,
 * keeping the API key safe in Vercel environment variables.
 *
 * POST /api/chat
 * Body: { message: string, lang: 'en' | 'hi' }
 * Returns: { in_scope: boolean, reply: string }
 *
 * NOTE on API key stability:
 * The GEMINI_API_KEY environment variable authenticates against your Google
 * AI Studio project and remains valid regardless of which model name is used.
 * When Google deprecates a model, only the model NAME string in the request
 * URL needs to change — the key itself does not. The fallback chain below
 * handles model name changes automatically.
 */

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ---------------------------------------------------------------------------
// Model fallback chain
//
// List candidate free-tier Flash models from most-preferred to least-preferred.
// callGeminiWithFallback() tries each in order, skipping any that return a
// "model not found" / 404-style error, so the chatbot keeps working even when
// Google deprecates the top model without requiring a manual redeploy.
//
// ⚠️  Review and update this list periodically (every ~3–6 months) by checking:
//     https://ai.google.dev/gemini-api/docs/models/gemini
// The live-model-check cache below also helps prefer currently-available models
// automatically between manual updates.
// ---------------------------------------------------------------------------
const MODEL_FALLBACK_CHAIN = [
    'gemini-2.5-flash',
    'gemini-2.5-flash-lite',
    'gemini-2.0-flash',
    'gemini-2.0-flash-lite',
    'gemini-1.5-flash',
    'gemini-1.5-flash-8b',
];

// ---------------------------------------------------------------------------
// Live model list cache (Requirement 2)
//
// Queried from Google's ListModels endpoint and cached for 1 hour per warm
// serverless instance. Cold starts simply re-fetch (this is fine — the
// ListModels call is cheap and takes ~200ms).
//
// If the live check fails for any reason, we silently fall through to the
// static MODEL_FALLBACK_CHAIN above.
// ---------------------------------------------------------------------------
let _modelCacheTime = 0;
let _cachedBestModel = null;   // string | null
const MODEL_CACHE_TTL = 60 * 60 * 1000; // 1 hour in ms

/**
 * Queries the Gemini ListModels API and returns the name of the best available
 * Flash model that supports generateContent, or null if the check fails.
 * Result is cached in memory for MODEL_CACHE_TTL ms.
 */
async function fetchBestAvailableModel(apiKey) {
    const now = Date.now();
    if (_cachedBestModel && (now - _modelCacheTime) < MODEL_CACHE_TTL) {
        return _cachedBestModel;
    }

    try {
        const listUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
        const res = await fetch(listUrl, { signal: AbortSignal.timeout(5000) });
        if (!res.ok) {
            console.warn('[Gemini] ListModels returned non-OK status:', res.status);
            return null;
        }
        const data = await res.json();
        const models = data.models || [];

        // Filter: must contain "flash" in the name (case-insensitive), must
        // support generateContent, and must NOT be explicitly marked deprecated.
        const flashModels = models.filter(m => {
            const name = (m.name || '').toLowerCase();
            const methods = m.supportedGenerationMethods || [];
            return (
                name.includes('flash') &&
                methods.includes('generateContent') &&
                !m.description?.toLowerCase().includes('deprecated')
            );
        });

        if (flashModels.length === 0) {
            console.warn('[Gemini] ListModels: no suitable Flash model found in live list.');
            return null;
        }

        // Sort by version number heuristic: prefer higher version numbers.
        // Model names look like "models/gemini-2.5-flash" — extract the first
        // float-like version segment for sorting.
        flashModels.sort((a, b) => {
            const ver = m => {
                const match = (m.name || '').match(/gemini-(\d+(?:\.\d+)?)/);
                return match ? parseFloat(match[1]) : 0;
            };
            return ver(b) - ver(a); // descending
        });

        // Strip the "models/" prefix Gemini returns — we construct the URL ourselves
        const best = flashModels[0].name.replace(/^models\//, '');
        console.log('[Gemini] Live model check selected:', best);

        _cachedBestModel = best;
        _modelCacheTime = now;
        return best;

    } catch (err) {
        console.warn('[Gemini] Live model check failed (will use static chain):', err.message);
        return null;
    }
}

// ---------------------------------------------------------------------------
// Error classification helpers
// ---------------------------------------------------------------------------

/**
 * Returns true if the HTTP status / error body indicates the MODEL itself is
 * unavailable / not found / deprecated — i.e., safe to retry with next model.
 * Returns false for errors that should NOT trigger a model switch
 * (rate limits, quota, bad request payload, network errors, etc.)
 */
function isModelNotFoundError(status, bodyText) {
    if (status === 404) return true;
    if (status === 400) {
        const lower = (bodyText || '').toLowerCase();
        return (
            lower.includes('model not found') ||
            lower.includes('invalid model') ||
            lower.includes('does not exist') ||
            lower.includes('deprecated') ||
            lower.includes('not supported')
        );
    }
    return false;
}

/**
 * Returns true if the HTTP status indicates a transient/overload error
 * (server-side issue on Google's end, not specific to the request or key).
 * These are also safe to retry with the next model in the fallback chain,
 * since a different model is served by different backend capacity.
 */
function isRetriableAcrossModels(status) {
    return status === 500 || status === 502 || status === 503;
}

// ---------------------------------------------------------------------------
// Core Gemini caller with per-model fallback (Requirement 1)
// ---------------------------------------------------------------------------

/**
 * Calls the Gemini generateContent endpoint, trying each model in the
 * resolved candidate list until one succeeds.
 *
 * @param {object}   payload   - The full generateContent request body
 * @param {string}   apiKey    - Gemini API key from env
 * @returns {object}           - Parsed Gemini response JSON
 * @throws  {Error}            - With .code set to 'RATE_LIMIT', 'NETWORK',
 *                               'ALL_MODELS_FAILED', or 'UPSTREAM' for callers
 *                               to handle differently.
 */
async function callGeminiWithFallback(payload, apiKey) {
    // Step 1: build the candidate model list.
    // Prepend the live-checked best model (if available) so it's tried first.
    const liveModel = await fetchBestAvailableModel(apiKey);

    let candidates = [...MODEL_FALLBACK_CHAIN];
    if (liveModel && !candidates.includes(liveModel)) {
        candidates.unshift(liveModel);
    } else if (liveModel) {
        // Move the live-selected model to the front
        candidates = [liveModel, ...candidates.filter(m => m !== liveModel)];
    }

    let lastModelNotFoundCount = 0;

    for (const model of candidates) {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

        let geminiRes;
        try {
            geminiRes = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
                signal: AbortSignal.timeout(15000),  // 15s per attempt
            });
        } catch (networkErr) {
            // Network-level failure — not a model-specific issue; abort chain
            const err = new Error('Network error: ' + networkErr.message);
            err.code = 'NETWORK';
            throw err;
        }

        if (geminiRes.ok) {
            const data = await geminiRes.json();
            console.log(`[Gemini] Request succeeded using model: ${model}`);
            return data;
        }

        // Not OK — decide whether to try the next model or abort
        const status = geminiRes.status;
        const bodyText = await geminiRes.text().catch(() => '');

        if (isModelNotFoundError(status, bodyText)) {
            console.warn(`[Gemini] Model "${model}" not available (${status}) — trying next in chain.`);
            lastModelNotFoundCount++;
            continue;   // try the next model
        }

        if (isRetriableAcrossModels(status)) {
            console.warn(`[Gemini] Model "${model}" temporarily overloaded (${status}) — trying next in chain.`);
            lastModelNotFoundCount++;
            continue;   // try the next model
        }

        // Rate limit / quota exceeded → don't waste attempts on other models
        if (status === 429) {
            console.warn('[Gemini] Rate limit hit on model:', model);
            const err = new Error('Rate limit exceeded.');
            err.code = 'RATE_LIMIT';
            throw err;
        }

        // Any other error (bad request, auth, server error) → abort chain
        console.error(`[Gemini] Non-retriable error on model "${model}": ${status}`, bodyText.slice(0, 300));
        const err = new Error(`Gemini API error ${status}`);
        err.code = 'UPSTREAM';
        err.status = status;
        throw err;
    }

    // All models were tried and failed with "not found" / overload errors
    console.error(
        '[Gemini] All models in fallback chain are unavailable — ' +
        'update MODEL_FALLBACK_CHAIN in api/chat.js. ' +
        `(${lastModelNotFoundCount} models tried, all returned not-found/overload errors.)`
    );
    const err = new Error('All Gemini models unavailable.');
    err.code = 'ALL_MODELS_FAILED';
    throw err;
}

// ---------------------------------------------------------------------------
// Load knowledge base at cold-start (bundled with the serverless function)
// ---------------------------------------------------------------------------
let KB_CONTENT = '';
try {
    KB_CONTENT = readFileSync(join(__dirname, '../data/qa-knowledge-base.txt'), 'utf-8');
} catch (err) {
    console.warn('[api/chat] Could not load knowledge base file:', err.message);
    KB_CONTENT = '(Knowledge base unavailable — answer using general company information below.)';
}

// ---------------------------------------------------------------------------
// System prompt — injected with company info + full KB as reference
// ---------------------------------------------------------------------------
const SYSTEM_INSTRUCTION = `
You are QuickBot, the official automated chat assistant for Quick Consulting Services — a business consultancy firm based in Indore, India.

COMPANY INFORMATION:
- Name: Quick Consulting Services
- Location: M9, Bapat Road, Near Brilliant Aura, Above Mapple Kitchens, Vijay Nagar, Indore, MP 452010
- Phone: +91 81091 01811
- Email: indore@quickconsulting.in
- WhatsApp: https://wa.me/918109101811
- Website: www.quickconsulting.in
- Tagline: "Find the Problem. Fix the Problem. Grow the Business."

SERVICES OFFERED (7 categories):
1. Tax & Compliance — ITR Filing, GST Registration & Returns, TDS Filing, Tax Planning, Income Tax Notices
2. Business Registration — Proprietorship, Partnership, LLP, Private Limited Company, Startup India, MSME/Udyam, PAN/TAN/DSC
3. Accounting & Finance — Bookkeeping, Payroll Processing, Financial Statements, Internal Audit, Virtual CFO
4. IT Consulting — ERP & SAP, Power BI & Business Intelligence, Data Analytics, Cloud & Digital Transformation
5. AI & Automation — AI Voice Agents, WhatsApp Business Automation, Chatbot Development, Workflow Automation & GenAI
6. Web & Digital — Website Design & Development, E-commerce, SEO & Google Business Profile, Digital Marketing & Social Media
7. Business Consulting — Startup Strategy, Business Process Improvement, Project Management, Government Schemes & Subsidies

KNOWLEDGE BASE (Q&A reference — use this for accurate answers):
${KB_CONTENT}

STRICT RULES YOU MUST FOLLOW:
1. ONLY answer questions that are directly related to Quick Consulting Services: our services, pricing, process, contact details, team, or how to engage us.
2. If the user asks anything outside this scope — general knowledge questions, trivia, coding help, personal advice, politics, current events, math problems, questions about other companies, or anything unrelated to our business — do NOT attempt to answer. Instead, politely say it is outside what you can help with and suggest they contact our human team via WhatsApp (+91 81091 01811) or phone.
3. Keep every response concise: 2 to 4 sentences maximum.
4. Always reply in the language indicated by the lang field ('en' for English, 'hi' for Hindi/Roman Hindi/Devanagari). If the user wrote in Hindi or used Hindi words, reply in Hindi.
5. Be warm, professional, and helpful.
6. Set "in_scope" to true if you answered a relevant business question, or false if you redirected due to being out of scope.
`;

// ---------------------------------------------------------------------------
// Handler
// ---------------------------------------------------------------------------
export default async function handler(req, res) {
    // Only accept POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { message, lang } = req.body || {};

    // Input validation
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
        return res.status(400).json({ error: 'Message is required.' });
    }
    if (message.trim().length > 500) {
        return res.status(400).json({ error: 'Message too long. Maximum 500 characters.' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error('[api/chat] GEMINI_API_KEY is not set in environment variables.');
        return res.status(500).json({ error: 'Server configuration error.' });
    }

    const language = lang === 'hi' ? 'hi' : 'en';
    const languageInstruction = language === 'hi'
        ? 'Reply in Hindi (use Devanagari script or Roman Hindi, whichever the user used).'
        : 'Reply in English.';

    const requestBody = {
        system_instruction: {
            parts: [{ text: SYSTEM_INSTRUCTION + '\n\n' + languageInstruction }]
        },
        contents: [
            {
                role: 'user',
                parts: [{ text: message.trim() }]
            }
        ],
        generationConfig: {
            responseMimeType: 'application/json',
            responseSchema: {
                type: 'OBJECT',
                properties: {
                    in_scope: { type: 'BOOLEAN' },
                    reply: { type: 'STRING' }
                },
                required: ['in_scope', 'reply']
            },
            temperature: 0.3,
            maxOutputTokens: 500
        }
    };

    try {
        const geminiData = await callGeminiWithFallback(requestBody, apiKey);

        // Extract the text from Gemini's response
        const rawText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!rawText) {
            console.error('[api/chat] Unexpected Gemini response shape:', JSON.stringify(geminiData));
            return res.status(502).json({ error: 'Unexpected response from AI.' });
        }

        // Parse the structured JSON the model returned.
        // Some models (especially older fallback ones) wrap JSON output in
        // markdown code fences even when responseMimeType is 'application/json',
        // so strip those defensively before parsing.
        let parsed;
        try {
            const cleanedText = rawText
                .trim()
                .replace(/^```json\s*/i, '')
                .replace(/^```\s*/, '')
                .replace(/```\s*$/, '')
                .trim();
            parsed = JSON.parse(cleanedText);
        } catch (parseErr) {
            console.error('[api/chat] Could not parse model JSON output:', rawText);
            return res.status(502).json({ error: 'Could not parse AI response.' });
        }

        // Validate and sanitize output — never expose anything extra
        const result = {
            in_scope: Boolean(parsed.in_scope),
            reply: String(parsed.reply || '').trim()
        };

        if (!result.reply) {
            return res.status(502).json({ error: 'Empty reply from AI.' });
        }

        return res.status(200).json(result);

    } catch (err) {
        // Handle specific error codes thrown by callGeminiWithFallback
        if (err.code === 'RATE_LIMIT') {
            // Return 429 — frontend chat.js will fall back to local KB
            return res.status(429).json({ error: 'Too many requests. Please try again shortly.' });
        }
        if (err.code === 'ALL_MODELS_FAILED') {
            // All models exhausted — return 503 so frontend falls back to local KB gracefully
            return res.status(503).json({ error: 'AI service temporarily unavailable.' });
        }
        if (err.code === 'NETWORK') {
            console.error('[api/chat] Network error reaching Gemini:', err.message);
            return res.status(502).json({ error: 'Failed to reach AI service.' });
        }
        // UPSTREAM or unknown
        console.error('[api/chat] Unhandled error:', err.message);
        return res.status(502).json({ error: 'Upstream API error.' });
    }
}