/**
 * chat.js
 * Responsibility: Chat widget — open/close, language switch, message handling,
 * knowledge-base loading (fetch from data/qa-knowledge-base.txt), advanced
 * bilingual NLP matching, draggable positioning with localStorage persistence,
 * and viewport-boundary clamping.
 *
 * Architecture:
 *  - KB is loaded once via fetch() at DOMContentLoaded.
 *  - findBestAnswer() uses: normalize → synonym map → filler removal →
 *    weighted TF scoring → Levenshtein fuzzy matching → small-talk fast-path
 *    → minimum score threshold.
 *  - toggleChat() uses simple fixed anchor: window always opens ABOVE the
 *    toggle button (items-end, flex-col, mb-4). No dynamic anchor-flip.
 *  - Drag is fully disabled on mobile (≤640px); CSS keeps the toggle button
 *    fixed at bottom-right on mobile.
 *  - body.chat-open-mobile is toggled to prevent background scroll on mobile.
 */

/* =========================================================
   State
   ========================================================= */
let currentLang = 'en';
let isChatOpen  = false;
let userName    = localStorage.getItem('chatUserName') || '';
let askingName  = false;

/* =========================================================
   Knowledge Base — loaded from file via fetch()
   ========================================================= */
let kbEntries = [];   // Array of { q, en, hi }
let kbLoaded  = false;

/**
 * Parse the raw text of qa-knowledge-base.txt into structured entries.
 * Each block is separated by a blank line and has:
 *   Q: <question>
 *   A_EN: <english answer>
 *   A_HI: <hindi answer>
 */
function parseKnowledgeBase(text) {
    const blocks = text.split(/\r?\n\r?\n/);   // split on blank lines
    const entries = [];
    for (const block of blocks) {
        const lines = block.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
        let q = '', en = '', hi = '';
        for (const line of lines) {
            if (line.startsWith('Q:'))    q  = line.slice(2).trim();
            if (line.startsWith('A_EN:')) en = line.slice(5).trim();
            if (line.startsWith('A_HI:')) hi = line.slice(5).trim();
        }
        if (q && (en || hi)) entries.push({ q, en, hi });
    }
    return entries;
}

async function loadKnowledgeBase() {
    try {
        const res  = await fetch('data/qa-knowledge-base.txt');
        const text = await res.text();
        kbEntries  = parseKnowledgeBase(text);
        kbLoaded   = true;
    } catch (err) {
        console.warn('[QuickBot] Could not load knowledge base:', err);
        kbLoaded = false;
    }
}

/* =========================================================
   NLP — Text Normalisation & Matching
   ========================================================= */

/**
 * Synonym / contraction map.
 * Keys are word-forms to replace, values are canonical forms.
 * Applied AFTER lowercasing and punctuation removal.
 */
const SYNONYM_MAP = {
    // English contractions & abbreviations
    "ur":    "your",
    "u":     "you",
    "r":     "are",
    "whats": "what is",
    "hows":  "how is",
    "dont":  "do not",
    "cant":  "can not",
    "wont":  "will not",
    "isnt":  "is not",
    "doesnt":"does not",
    "ive":   "i have",
    "im":    "i am",
    "id":    "i would",
    "ill":   "i will",
    "thats": "that is",
    "info":  "information",
    "reg":   "registration",

    // Hindi transliterations → English equivalents
    "tumhara":    "your",
    "aapka":      "your",
    "apka":       "your",
    "mera":       "my",
    "meri":       "my",
    "naam":       "name",
    "kya":        "what",
    "kaun":       "who",
    "kaise":      "how",
    "kahan":      "where",
    "kab":        "when",
    "kyun":       "why",
    "kitna":      "how much",
    "kitni":      "how much",
    "batao":      "tell",
    "bata":       "tell",
    "bataye":     "tell",
    "chahiye":    "need",
    "karo":       "do",
    "karna":      "do",
    "chahta":     "want",
    "chahti":     "want",
    "milega":     "get",
    "milegi":     "get",
    "sewa":       "service",
    "seva":       "service",
    "madad":      "help",
    "sampark":    "contact",
    "pata":       "address",
    "daftar":     "office",
    "dakiya":     "email",
    "price":      "price",
    "daam":       "price",
    "kitne":      "how much",
    "lagega":     "cost",
    "lagegi":     "cost",
    "shuru":      "start",
    "company":    "company",
    "register":   "register",
    "registration":"registration",
    "nahi":       "not",
    "nahin":      "not",
    "haan":       "yes",
    "ji":         "yes",
};

/** Filler words to strip (Hindi grammatical particles + common English fillers) */
const FILLERS = new Set([
    'hai', 'ho', 'ka', 'ki', 'ke', 'ko', 'se', 'me', 'mein',
    'aur', 'bhi', 'toh', 'to', 'ab', 'ek', 'yeh', 'woh', 'par',
    'the', 'a', 'an', 'is', 'of', 'in', 'on', 'at', 'do', 'i',
    'and', 'or', 'for', 'with', 'my', 'me', 'can', 'you', 'we',
    'please', 'help', 'want', 'need',
]);

/**
 * Normalize a string:
 *  1. Lowercase
 *  2. Remove punctuation (preserve Devanagari and Latin characters + spaces)
 *  3. Apply synonym map (word by word)
 *  4. Re-split and remove filler words
 * Returns an array of meaningful tokens.
 */
function normalizeTokens(str) {
    // Step 1: lowercase
    let s = str.toLowerCase();
    // Step 2: remove punctuation (keep letters, digits, spaces, Devanagari range)
    s = s.replace(/[^\w\s\u0900-\u097F]/g, ' ');
    // Step 3: tokenize and apply synonym map
    let tokens = s.split(/\s+/).filter(Boolean);
    tokens = tokens.map(t => SYNONYM_MAP[t] || t);
    // Re-split in case synonym expanded to multiple words (e.g. "whats" → "what is")
    tokens = tokens.flatMap(t => t.split(/\s+/));
    // Step 4: remove fillers
    tokens = tokens.filter(t => t.length > 0 && !FILLERS.has(t));
    return tokens;
}

/**
 * Levenshtein distance between two strings.
 * Used for fuzzy single-word matching.
 */
function levenshtein(a, b) {
    const m = a.length, n = b.length;
    const dp = Array.from({ length: m + 1 }, (_, i) => Array.from({ length: n + 1 }, (_, j) => i === 0 ? j : j === 0 ? i : 0));
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (a[i-1] === b[j-1]) dp[i][j] = dp[i-1][j-1];
            else dp[i][j] = 1 + Math.min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]);
        }
    }
    return dp[m][n];
}

/**
 * Fuzzy match a query token against a set of question tokens.
 * Returns the weight of the best match found (0 if none).
 * Tolerance: distance ≤ 1 for words ≥5 chars, distance ≤ 2 for words ≥8 chars.
 */
function fuzzyTokenMatch(qToken, questionTokens) {
    const qLen = qToken.length;
    // Direct match (most common fast path)
    if (questionTokens.has(qToken)) return 1.0;
    // Short tokens: require exact match only
    if (qLen < 4) return 0;
    // Fuzzy tolerance
    const maxDist = qLen >= 8 ? 2 : 1;
    for (const t of questionTokens) {
        if (Math.abs(t.length - qLen) > maxDist) continue;
        if (levenshtein(qToken, t) <= maxDist) return 0.8;
    }
    return 0;
}

/**
 * Weight for a token based on its length.
 * Short tokens like "tax" or "gst" still matter — we only penalise 1-2 char tokens.
 */
function tokenWeight(token) {
    if (token.length <= 2) return 0.3;
    if (token.length === 3) return 0.7;
    return 1.0;
}

/* Small-talk fast-path intents */
const SMALL_TALK = {
    en: {
        greet:   'Hello! How can I help you today?',
        thanks:  "You're welcome! Let us know if you need anything else.",
        bye:     'Goodbye! Feel free to reach out anytime via WhatsApp or call.',
        bot:     "I'm QuickBot, an automated assistant for Quick Consulting Services. For detailed queries, our human team is happy to help via WhatsApp or call.",
        name:    "I'm QuickBot, the virtual assistant for Quick Consulting Services!",
    },
    hi: {
        greet:   'नमस्ते! आज मैं आपकी कैसे मदद कर सकता हूँ?',
        thanks:  'आपका स्वागत है! अगर आपको कुछ और चाहिए तो हमें बताएं।',
        bye:     'अलविदा! किसी भी समय WhatsApp या कॉल के ज़रिए संपर्क करने में संकोच न करें।',
        bot:     'मैं QuickBot हूँ, Quick Consulting Services का स्वचालित सहायक। विस्तृत प्रश्नों के लिए, हमारी टीम WhatsApp या कॉल पर मदद करने में खुश होगी।',
        name:    'मैं QuickBot हूँ, Quick Consulting Services का वर्चुअल असिस्टेंट!',
    },
};

const GREET_TOKENS  = new Set(['hello','hi','hey','namaste','namaskar','hola','howdy']);
const THANKS_TOKENS = new Set(['thanks','thank','thankyou','shukriya','dhanyawad','shukriyaa','thx','ty']);
const BYE_TOKENS    = new Set(['bye','goodbye','alvida','tata','see','later','cya']);
const BOT_TOKENS    = new Set(['bot','robot','automated','real','person','human','ai','quickbot']);
const NAME_TOKENS   = new Set(['name','naam']);

/**
 * Fast-path check for small-talk intents.
 * Returns `{ en, hi }` if matched, else null.
 */
function checkSmallTalk(tokens) {
    const tSet = new Set(tokens);
    if ([...tSet].some(t => GREET_TOKENS.has(t)))  return { en: SMALL_TALK.en.greet,  hi: SMALL_TALK.hi.greet  };
    if ([...tSet].some(t => THANKS_TOKENS.has(t))) return { en: SMALL_TALK.en.thanks, hi: SMALL_TALK.hi.thanks };
    if ([...tSet].some(t => BYE_TOKENS.has(t)))    return { en: SMALL_TALK.en.bye,    hi: SMALL_TALK.hi.bye    };
    if ([...tSet].some(t => BOT_TOKENS.has(t)))    return { en: SMALL_TALK.en.bot,    hi: SMALL_TALK.hi.bot    };
    // "your name", "naam kya", "tumhara naam" etc.
    if ([...tSet].some(t => NAME_TOKENS.has(t)) && [...tSet].some(t => ['your','what','who','tumhara','aapka','kya','batao'].includes(t) || t.startsWith('wh')))
        return { en: SMALL_TALK.en.name, hi: SMALL_TALK.hi.name };
    return null;
}

/** Minimum normalised score to accept a match (below this → fallback) */
const MIN_SCORE_THRESHOLD = 0.15;

/**
 * findBestAnswer(rawQuery) → { en, hi } | null
 *
 * Scoring:
 *  score += tokenWeight(qToken) * fuzzyMatch(qToken, questionTokenSet)
 *  Normalise by total possible weight of query tokens.
 *  Boost: if query tokens are fully contained in question (or vice versa).
 */
function findBestAnswer(rawQuery) {
    // 1. Small-talk fast path
    const tokens = normalizeTokens(rawQuery);
    if (tokens.length === 0) return null;

    const smallTalk = checkSmallTalk(tokens);
    if (smallTalk) return smallTalk;

    if (!kbLoaded || kbEntries.length === 0) return null;

    let bestScore = 0;
    let bestEntry = null;

    // Total weight of query tokens (denominator for normalisation)
    const totalQueryWeight = tokens.reduce((sum, t) => sum + tokenWeight(t), 0);
    if (totalQueryWeight === 0) return null;

    for (const entry of kbEntries) {
        // Normalise the question text in the KB
        const qTokens      = normalizeTokens(entry.q);
        const qTokenSet    = new Set(qTokens);
        const totalQWeight = qTokens.reduce((sum, t) => sum + tokenWeight(t), 0);

        if (qTokens.length === 0) continue;

        // Score: how well do query tokens match question tokens?
        let score = 0;
        for (const tok of tokens) {
            score += tokenWeight(tok) * fuzzyTokenMatch(tok, qTokenSet);
        }
        // Also score in reverse: how well do question tokens match query?
        let reverseScore = 0;
        const queryTokenSet = new Set(tokens);
        for (const tok of qTokens) {
            reverseScore += tokenWeight(tok) * fuzzyTokenMatch(tok, queryTokenSet);
        }

        // Normalise both sides and take the geometric mean to balance
        const normFwd = score        / totalQueryWeight;
        const normRev = reverseScore / (totalQWeight || 1);
        const combined = Math.sqrt(normFwd * normRev) * (normFwd + normRev) / 2;

        if (combined > bestScore) {
            bestScore = combined;
            bestEntry = entry;
        }
    }

    if (bestScore >= MIN_SCORE_THRESHOLD && bestEntry) {
        return { en: bestEntry.en, hi: bestEntry.hi };
    }
    return null;
}

/* =========================================================
   Fallback answers
   ========================================================= */
const FALLBACK = {
    en: "I'm not sure about that. Please contact our team directly for detailed assistance.",
    hi: 'मुझे इसके बारे में पक्का नहीं पता। कृपया विस्तृत सहायता के लिए सीधे हमारी टीम से संपर्क करें।',
};

/* =========================================================
   Open / close  (FIX #4/#5: no more anchor-flip logic)
   ========================================================= */
function toggleChat() {
    isChatOpen = !isChatOpen;
    const win     = document.getElementById('chat-window');
    const btnIcon = document.getElementById('chat-btn-icon');
    const isMobile = window.innerWidth <= 640;

    if (isChatOpen) {
        win.classList.add('open');
        btnIcon.classList.replace('fa-comment-dots', 'fa-xmark');
        // Lock background scroll on mobile (FIX #1 / #2)
        if (isMobile) document.body.classList.add('chat-open-mobile');
        // Show welcome message only on first open
        const msgs = document.getElementById('chat-messages');
        if (msgs && msgs.children.length === 0) {
            if (!userName) {
                askingName = true;
                addMessage("Hi! What's your name? / नमस्ते! आपका नाम क्या है?", 'bot');
            } else {
                addMessage(
                    `Nice to meet you again, ${userName}! How can I help your business today? / ` +
                    `आपसे दोबारा मिलकर अच्छा लगा, ${userName}! मैं आपके व्यवसाय में कैसे सहायता कर सकता हूँ?`,
                    'bot'
                );
            }
        }
    } else {
        win.classList.remove('open');
        btnIcon.classList.replace('fa-xmark', 'fa-comment-dots');
        // Restore background scroll (FIX #1 / #2)
        document.body.classList.remove('chat-open-mobile');
    }
}

/* =========================================================
   Language switch
   ========================================================= */
function switchLanguage(lang) {
    currentLang = lang;
    const enBtn = document.getElementById('lang-en');
    const hiBtn = document.getElementById('lang-hi');

    [enBtn, hiBtn].forEach(btn => {
        btn.classList.remove('font-bold', 'text-blue-600', 'dark:text-blue-400', 'bg-white', 'dark:bg-slate-800');
        btn.classList.add('text-white', 'hover:bg-white/20');
    });

    const activeBtn = lang === 'en' ? enBtn : hiBtn;
    activeBtn.classList.remove('text-white', 'hover:bg-white/20');
    activeBtn.classList.add('font-bold', 'text-blue-600', 'bg-white', 'dark:bg-slate-800', 'dark:text-blue-400');

    document.getElementById('qr-services').textContent = lang === 'en' ? 'Our Services'  : 'हमारी सेवाएं';
    document.getElementById('qr-contact').textContent  = lang === 'en' ? 'Contact Us'     : 'संपर्क करें';
    document.getElementById('qr-quote').textContent    = lang === 'en' ? 'Get a Quote'    : 'कोटेशन लें';
    document.getElementById('chat-input').placeholder  = lang === 'en' ? 'Type a message…': 'संदेश लिखें…';
}

/* =========================================================
   Quick-reply buttons (use KB lookup too)
   ========================================================= */
function handleQuickReply(keyword) {
    if (askingName) return;
    const btnEl = document.getElementById('qr-' + keyword);
    if (!btnEl) return;
    const userText = btnEl.textContent.trim();
    addMessage(userText, 'user');
    setTimeout(() => {
        const result = findBestAnswer(keyword);  // keyword is always English
        const answer = result
            ? (currentLang === 'hi' ? result.hi : result.en)
            : (currentLang === 'hi' ? FALLBACK.hi : FALLBACK.en);
        addMessage(answer, 'bot');
    }, 480);
}

/* =========================================================
   User message processing
   ========================================================= */
function sendChatMessage() {
    const input = document.getElementById('chat-input');
    const text  = input.value.trim();
    if (!text) return;
    addMessage(text, 'user');
    input.value = '';

    if (askingName) {
        setTimeout(() => {
            userName = text;
            try { localStorage.setItem('chatUserName', userName); } catch(e) {}
            askingName = false;
            addMessage(
                `Nice to meet you, ${userName}! How can I help your business today? / ` +
                `आपसे मिलकर अच्छा लगा, ${userName}! मैं आपके व्यवसाय में कैसे सहायता कर सकता हूँ?`,
                'bot'
            );
        }, 480);
    } else {
        setTimeout(() => processUserMessage(text), 480);
    }
}

function processUserMessage(rawText) {
    // --- Typing indicator ---
    const typingEl = _createMsgEl('bot');
    typingEl.innerHTML = '<span class="typing-dots">●&nbsp;●&nbsp;●</span>';
    typingEl.dataset.typing = 'true';
    _appendMsg(typingEl);

    // Helper: remove the typing indicator bubble
    function removeTyping() {
        if (typingEl.parentNode) typingEl.parentNode.removeChild(typingEl);
    }

    // Helper: show WhatsApp + Call action buttons
    function showContactButtons() {
        addMessageHTML(`
            <div class="mt-2 flex flex-col gap-2">
                <a href="https://wa.me/918109101811" target="_blank"
                   class="bg-emerald-500 text-white text-xs py-1.5 px-3 rounded text-center">
                    <i class="fa-brands fa-whatsapp"></i> WhatsApp
                </a>
                <a href="tel:+918109101811"
                   class="bg-blue-600 text-white text-xs py-1.5 px-3 rounded text-center">
                    <i class="fa-solid fa-phone"></i> Call
                </a>
            </div>`, 'bot');
    }

    // Helper: local KB fallback
    function localFallback() {
        if (!kbLoaded) {
            addMessage(
                currentLang === 'hi'
                    ? 'ज्ञान आधार लोड हो रहा है, कृपया एक क्षण बाद पुनः प्रयास करें।'
                    : 'Knowledge base is loading, please try again in a moment.',
                'bot'
            );
            return;
        }
        const result = findBestAnswer(rawText);
        if (result) {
            addMessage(currentLang === 'hi' ? result.hi : result.en, 'bot');
        } else {
            addMessage(currentLang === 'hi' ? FALLBACK.hi : FALLBACK.en, 'bot');
            showContactButtons();
        }
    }

    // --- Call /api/chat ---
    fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: rawText, lang: currentLang })
    })
    .then(res => {
        if (!res.ok) throw new Error('API responded with status ' + res.status);
        return res.json();
    })
    .then(result => {
        removeTyping();
        if (result && typeof result.reply === 'string' && result.reply.trim()) {
            addMessage(result.reply.trim(), 'bot');
            // If out-of-scope, show contact buttons as well
            if (result.in_scope === false) {
                showContactButtons();
            }
        } else {
            // Malformed response — fall back to local KB
            localFallback();
        }
    })
    .catch(err => {
        console.warn('[QuickBot] /api/chat failed, falling back to local KB:', err.message);
        removeTyping();
        localFallback();
    });
}


/* =========================================================
   DOM helpers
   ========================================================= */
function addMessage(text, sender) {
    const el = _createMsgEl(sender);
    el.textContent = text;
    _appendMsg(el);
}

function addMessageHTML(html, sender) {
    const el = _createMsgEl(sender);
    el.innerHTML = html;
    _appendMsg(el);
}

function _createMsgEl(sender) {
    const div = document.createElement('div');
    div.className = [
        'max-w-[85%] p-2.5 rounded-lg text-sm mb-3 shadow-sm',
        sender === 'user'
            ? 'bg-blue-600 text-white self-end rounded-tr-none ml-auto'
            : 'bg-gray-100 dark:bg-slate-700 text-slate-800 dark:text-slate-100 self-start rounded-tl-none mr-auto',
    ].join(' ');
    return div;
}

function _appendMsg(el) {
    const msgs = document.getElementById('chat-messages');
    msgs.appendChild(el);
    msgs.scrollTop = msgs.scrollHeight;
}

/* =========================================================
   Draggable widget  (FIX #3: drag fully disabled on mobile)
   ========================================================= */
function initChatDrag() {
    const widget = document.getElementById('chat-widget');
    if (!widget) return;

    // Restore saved position (desktop only)
    if (window.innerWidth > 640) {
        const saved = _loadWidgetPos();
        if (saved) _applyWidgetPos(widget, saved.x, saved.y);
    }

    // Drag handles: toggle button (always) + chat header bar (when open)
    const dragHandles = [
        document.getElementById('chat-toggle-btn'),
        document.querySelector('.chat-drag-handle'),
    ].filter(Boolean);

    dragHandles.forEach(handle => {
        handle.addEventListener('pointerdown', _onDragStart);
    });
}

let _dragging    = false;
let _dragOffsetX = 0;
let _dragOffsetY = 0;
let _dragWidget  = null;
let _hasMoved    = false;   // distinguish click vs drag on toggle button

function _onDragStart(e) {
    // FIX #3: Fully disable drag on mobile — button stays CSS-fixed bottom-right
    if (window.innerWidth <= 640) return;

    _dragging   = true;
    _hasMoved   = false;
    _dragWidget = document.getElementById('chat-widget');

    const rect   = _dragWidget.getBoundingClientRect();
    _dragOffsetX = e.clientX - rect.left;
    _dragOffsetY = e.clientY - rect.top;

    _dragWidget.style.transition = 'none';
    document.documentElement.style.userSelect = 'none';

    e.preventDefault(); // prevent text selection during drag

    window.addEventListener('pointermove', _onDragMove);
    window.addEventListener('pointerup',   _onDragEnd);
}

function _onDragMove(e) {
    if (!_dragging || !_dragWidget) return;
    _hasMoved = true;

    let x = e.clientX - _dragOffsetX;
    let y = e.clientY - _dragOffsetY;

    // Clamp to viewport bounds
    const W = _dragWidget.offsetWidth;
    const H = _dragWidget.offsetHeight;

    let minX = 0, minY = 0;
    let maxX = window.innerWidth  - W;
    let maxY = window.innerHeight - H;

    if (!isChatOpen) {
        const toggleBtn = document.getElementById('chat-toggle-btn');
        if (toggleBtn) {
            const btnW   = toggleBtn.offsetWidth;
            const btnH   = toggleBtn.offsetHeight;
            const extraW = W - btnW;
            const extraH = H - btnH;
            minX = -extraW;
            minY = -extraH;
            maxX = window.innerWidth  - btnW - extraW;
            maxY = window.innerHeight - btnH - extraH;
        }
    }

    x = Math.max(minX, Math.min(x, maxX));
    y = Math.max(minY, Math.min(y, maxY));

    _applyWidgetPos(_dragWidget, x, y);
}

function _onDragEnd() {
    if (!_dragging || !_dragWidget) return;
    _dragging = false;
    _dragWidget.style.transition = '';
    document.documentElement.style.userSelect = '';

    if (_hasMoved) {
        const rect = _dragWidget.getBoundingClientRect();
        _saveWidgetPos(rect.left, rect.top);
    }

    window.removeEventListener('pointermove', _onDragMove);
    window.removeEventListener('pointerup',   _onDragEnd);
    _dragWidget = null;
}

function _applyWidgetPos(widget, x, y) {
    // Switch from bottom/right anchor to fixed top/left
    widget.style.bottom = 'auto';
    widget.style.right  = 'auto';
    widget.style.left   = x + 'px';
    widget.style.top    = y + 'px';
}

function _saveWidgetPos(x, y) {
    try { localStorage.setItem('chatWidgetPos', JSON.stringify({ x, y })); } catch (_) {}
}

function _loadWidgetPos() {
    try {
        const raw = localStorage.getItem('chatWidgetPos');
        return raw ? JSON.parse(raw) : null;
    } catch (_) { return null; }
}

/* =========================================================
   Enter-key shortcut
   ========================================================= */
function initChatEnterKey() {
    const input = document.getElementById('chat-input');
    if (!input) return;
    input.addEventListener('keypress', e => {
        if (e.key === 'Enter') sendChatMessage();
    });
}

/* =========================================================
   Initialisation
   ========================================================= */
document.addEventListener('DOMContentLoaded', () => {
    loadKnowledgeBase();   // async — non-blocking
    initChatDrag();
    initChatEnterKey();
});
