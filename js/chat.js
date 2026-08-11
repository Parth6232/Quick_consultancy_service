/**
 * chat.js
 * Responsibility: Chat widget — open/close, language switch, message handling,
 * bilingual knowledge base, draggable positioning with localStorage persistence,
 * and viewport-boundary clamping.
 *
 * Drag behaviour:
 *  - Desktop: entire #chat-widget is draggable by its header bar (.chat-drag-handle)
 *    when the window is open, OR by the toggle button when the window is closed.
 *  - Mobile (viewport ≤ 640 px): only the toggle button is draggable (the chat
 *    window is a full-screen bottom sheet on mobile so dragging it makes no sense).
 */

/* =========================================================
   Knowledge base
   ========================================================= */
const chatKB = {
    en: {
        services: 'We offer Tax & Compliance, Business Registration, Accounting, IT, AI & Automation, and Web Development. What do you need help with?',
        price:    'Pricing depends on the service. Please click "Get a Quote" or contact us on WhatsApp for exact details.',
        quote:    'Pricing depends on the service. Please click "Get a Quote" or contact us on WhatsApp for exact details.',
        location: 'We are located at M9, Bapat Road, Near Brilliant Aura, Vijay Nagar, Indore.',
        contact:  'You can reach us at +91 81091 01811 or via WhatsApp.',
        book:     'To book a consultation, simply call us or send a message on WhatsApp!',
        hello:    'Hello! How can I help you today?',
        hi:       'Hi there! How can I assist your business?',
        fallback: "I'm not sure about that. Please contact our team directly for detailed assistance.",
    },
    hi: {
        services: 'हम टैक्स और कंप्लायंस, बिज़नेस रजिस्ट्रेशन, अकाउंटिंग, IT, AI और वेब डेवलपमेंट जैसी सेवाएं देते हैं। आपको किसमें मदद चाहिए?',
        price:    'कीमत सेवा पर निर्भर करती है। कृपया सही जानकारी के लिए "कोटेशन लें" पर क्लिक करें या व्हाट्सएप पर संपर्क करें।',
        quote:    'कीमत सेवा पर निर्भर करती है। कृपया सही जानकारी के लिए "कोटेशन लें" पर क्लिक करें या व्हाट्सएप पर संपर्क करें।',
        location: 'हमारा ऑफिस M9, बापट रोड, ब्रिलियंट ऑरा के पास, विजय नगर, इंदौर में है।',
        contact:  'आप हमें +91 81091 01811 पर कॉल कर सकते हैं या व्हाट्सएप कर सकते हैं।',
        book:     'परामर्श बुक करने के लिए, बस हमें कॉल करें या व्हाट्सएप पर संदेश भेजें!',
        hello:    'नमस्ते! आज मैं आपकी कैसे मदद कर सकता हूँ?',
        hi:       'नमस्ते! मैं आपके व्यवसाय में कैसे सहायता कर सकता हूँ?',
        fallback: 'मुझे इसके बारे में पक्का नहीं पता। कृपया विस्तृत सहायता के लिए सीधे हमारी टीम से संपर्क करें।',
    },
};

/* =========================================================
   State
   ========================================================= */
let currentLang  = 'en';
let isChatOpen   = false;
let userName     = localStorage.getItem('chatUserName') || '';
let askingName   = false;

/* =========================================================
   Open / close
   ========================================================= */
function toggleChat() {
    isChatOpen = !isChatOpen;
    const win     = document.getElementById('chat-window');
    const btnIcon = document.getElementById('chat-btn-icon');
    const widget  = document.getElementById('chat-widget');

    if (isChatOpen) {
        // Dynamic opening anchor based on screen position
        if (widget) {
            const rect = widget.getBoundingClientRect();
            const toggleBtn = document.getElementById('chat-toggle-btn');

            // Horizontal anchoring — window expands toward center of screen
            if (rect.left < window.innerWidth / 2) {
                // Widget is on LEFT side → expand window to the right
                // Button stays on the LEFT of the window (default DOM order: window first, btn second with flex-col)
                widget.classList.remove('items-end');
                widget.classList.add('items-start');
                if (toggleBtn) { toggleBtn.style.order = ''; }   // btn after window in DOM = bottom/right
            } else {
                // Widget is on RIGHT side → expand window to the left
                widget.classList.remove('items-start');
                widget.classList.add('items-end');
                if (toggleBtn) { toggleBtn.style.order = ''; }
            }

            // Vertical anchoring — window expands toward center of screen
            if (rect.top < window.innerHeight / 2) {
                // Widget is near TOP → window expands downward (btn above window)
                widget.classList.remove('flex-col');
                widget.classList.add('flex-col-reverse');
                win.classList.remove('mb-4');
                win.classList.add('mt-4');
                // btn is first in DOM; flex-col-reverse makes it appear BELOW the window
                // We want the btn at the TOP (above window), so put it visually first → order:-1
                if (toggleBtn) { toggleBtn.style.order = '-1'; }
            } else {
                // Widget is near BOTTOM → window expands upward (btn below window, default)
                widget.classList.remove('flex-col-reverse');
                widget.classList.add('flex-col');
                win.classList.remove('mt-4');
                win.classList.add('mb-4');
                if (toggleBtn) { toggleBtn.style.order = ''; }
            }
        }

        win.classList.add('open');
        btnIcon.classList.replace('fa-comment-dots', 'fa-xmark');
        // Show welcome message only on first open
        const msgs = document.getElementById('chat-messages');
        if (msgs && msgs.children.length === 0) {
            if (!userName) {
                askingName = true;
                addMessage('Hi! What\'s your name? / नमस्ते! आपका नाम क्या है?', 'bot');
            } else {
                addMessage(`Nice to meet you again, ${userName}! How can I help your business today? / आपसे दोबारा मिलकर अच्छा लगा, ${userName}! मैं आपके व्यवसाय में कैसे सहायता कर सकता हूँ?`, 'bot');
            }
        }
    } else {
        win.classList.remove('open');
        btnIcon.classList.replace('fa-xmark', 'fa-comment-dots');
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
   Messaging
   ========================================================= */
function handleQuickReply(keyword) {
    if (askingName) return;
    const btnEl = document.getElementById('qr-' + keyword);
    if (!btnEl) return;
    addMessage(btnEl.textContent.trim(), 'user');
    setTimeout(() => {
        addMessage(chatKB[currentLang][keyword] || chatKB[currentLang].fallback, 'bot');
    }, 480);
}

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
            addMessage(`Nice to meet you, ${userName}! How can I help your business today? / आपसे मिलकर अच्छा लगा, ${userName}! मैं आपके व्यवसाय में कैसे सहायता कर सकता हूँ?`, 'bot');
        }, 480);
    } else {
        setTimeout(() => processUserMessage(text.toLowerCase()), 480);
    }
}

function processUserMessage(msg) {
    const keywords = ['services', 'price', 'quote', 'location', 'contact', 'book', 'hello', 'hi'];
    let matched = null;

    for (const kw of keywords) {
        if (msg.includes(kw) ||
            (kw === 'price'    && (msg.includes('cost') || msg.includes('rate'))) ||
            (kw === 'services' && msg.includes('सेवा')) ||
            (kw === 'hello'    && msg.includes('नमस्ते')) ||
            (kw === 'location' && (msg.includes('address') || msg.includes('office') || msg.includes('पता')))) {
            matched = kw;
            break;
        }
    }

    if (matched) {
        addMessage(chatKB[currentLang][matched], 'bot');
    } else {
        addMessage(chatKB[currentLang].fallback, 'bot');
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
}

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
   Draggable widget
   ========================================================= */
function initChatDrag() {
    const widget = document.getElementById('chat-widget');
    if (!widget) return;

    // Restore saved position
    const saved = _loadWidgetPos();
    if (saved) {
        _applyWidgetPos(widget, saved.x, saved.y);
    }

    // We allow dragging from the toggle button at all times,
    // and from the chat-window header when the window is open.
    const dragHandles = [
        document.getElementById('chat-toggle-btn'),      // toggle button
        document.querySelector('.chat-drag-handle'),      // header bar
    ].filter(Boolean);

    dragHandles.forEach(handle => {
        handle.addEventListener('pointerdown', _onDragStart);
    });
}

let _dragging    = false;
let _dragOffsetX = 0;
let _dragOffsetY = 0;
let _dragWidget  = null;
let _hasMoved    = false;  // distinguish click vs drag on toggle button

function _onDragStart(e) {
    // Mobile: only allow drag on the toggle button, not the chat header sheet
    const isMobile = window.innerWidth <= 640;
    const isHeaderHandle = e.currentTarget.classList.contains('chat-drag-handle');
    if (isMobile && isHeaderHandle) return;

    _dragging    = true;
    _hasMoved    = false;
    _dragWidget  = document.getElementById('chat-widget');

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

    // Clamp to viewport
    let W = _dragWidget.offsetWidth;
    let H = _dragWidget.offsetHeight;
    
    let minX = 0, minY = 0;
    let maxX = window.innerWidth - W;
    let maxY = window.innerHeight - H;

    if (!isChatOpen) {
        const toggleBtn = document.getElementById('chat-toggle-btn');
        if (toggleBtn) {
            const btnW = toggleBtn.offsetWidth;
            const btnH = toggleBtn.offsetHeight;
            const extraW = W - btnW;
            const extraH = H - btnH;
            
            minX = -extraW;
            minY = -extraH;
            maxX = window.innerWidth - btnW - extraW;
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
