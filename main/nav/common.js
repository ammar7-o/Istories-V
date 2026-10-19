/* ==========================================================================
   common.js — Shared helpers used across all IStories pages.
   Loaded as a classic script (in <head>) so every page can use these globals.
   Keep this file page-independent: it must not rely on variables that only
   exist on a single page (except the ones resolved lazily at call time).
   ========================================================================== */

/* --------------------------------------------------------------------------
   Toast notifications
   --------------------------------------------------------------------------
   Styling is injected once (id="ist-toast-styles") so the toasts look the same
   on every page and no longer depend on a page defining @keyframes
   slideIn/slideOut. Toasts stack in the top-right corner, show an icon + a
   draining progress bar, and dismiss as soon as the user taps/clicks them.
   -------------------------------------------------------------------------- */

// How long a toast stays before it auto-hides (ms).
const IST_TOAST_MS = 4200;

const IST_TOAST_META = {
    success: { icon: 'fas fa-circle-check', label: 'Success' },
    error: { icon: 'fas fa-exclamation-circle', label: 'Error' },
    warning: { icon: 'fas fa-warning', label: 'Warning' },
    info: { icon: 'fas fa-info-circle', label: 'Information' }
};

/** Inject the shared toast stylesheet exactly once. */
function istToastEnsureStyles() {
    if (document.getElementById('ist-toast-styles')) return;

    const style = document.createElement('style');
    style.id = 'ist-toast-styles';
    style.textContent = `
        #ist-toast-container {
            position: fixed;
            top: 18px;
            right: 18px;
            z-index: 12000;
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            gap: 12px;
            max-width: min(92vw, 420px);
            pointer-events: none;
        }
        .ist-toast {
            --ist-toast-accent: var(--primary, #09d9ba);
            position: relative;
            display: flex;
            align-items: flex-start;
            gap: 12px;
            width: 100%;
            padding: 13px 40px 13px 14px;
            border-radius: 14px;
            background: var(--card-bg, #868686);
            color: var(--text, #1f2937);
            border: 1px solid var(--border, #e5e7eb);
            border-left: 5px solid var(--ist-toast-accent);
            box-shadow: 0 14px 32px -12px rgba(0, 0, 0, .4), 0 2px 8px rgba(0, 0, 0, .08);
            pointer-events: auto;
            cursor: pointer;
            overflow: hidden;
            animation: istToastIn .32s cubic-bezier(.2, .8, .25, 1) both;
        }
        .ist-toast--success { --ist-toast-accent: var(--success, #10b981); }
        .ist-toast--error   { --ist-toast-accent: var(--danger, #ef4444); }
        .ist-toast--warning { --ist-toast-accent: var(--warning, #f59e0b); }
        .ist-toast--info    { --ist-toast-accent: var(--primary, #3b82f6); }
        .ist-toast.is-leaving { animation: istToastOut .28s ease forwards; }
        .ist-toast__icon {
            flex: 0 0 auto;
            width: 30px;
            height: 30px;
            display: grid;
            place-items: center;
            border-radius: 9px;
            font-size: 15px;
            color: #ffffff;
            background: var(--ist-toast-accent);
            margin-top: 1px;
        }
        .ist-toast__msg {
            margin: 0;
            font-size: .95rem;
            font-weight: 500;
            line-height: 1.45;
            word-break: break-word;
        }
        .ist-toast__close {
            position: absolute;
            top: 7px;
            right: 7px;
            width: 26px;
            height: 26px;
            display: grid;
            place-items: center;
            border: 0;
            border-radius: 8px;
            background: transparent;
            color: var(--text-light, #6b7280);
            font-size: 12px;
            cursor: pointer;
            transition: background-color .2s, color .2s;
        }
        .ist-toast__close:hover { background: var(--hover, rgba(0, 0, 0, .06)); color: var(--text, #1f2937); }
        .ist-toast__bar {
            position: absolute;
            left: 0;
            bottom: 0;
            height: 3px;
            width: 100%;
            background: var(--ist-toast-accent);
            transform-origin: left center;
            animation: istToastBar linear forwards;
        }
        @keyframes istToastIn {
            from { opacity: 0; transform: translateX(110%) scale(.98); }
            to   { opacity: 1; transform: none; }
        }
        @keyframes istToastOut {
            to { opacity: 0; transform: translateX(110%) scale(.98); }
        }
        @keyframes istToastBar {
            from { transform: scaleX(1); }
            to   { transform: scaleX(0); }
        }
        @media (prefers-reduced-motion: reduce) {
            .ist-toast, .ist-toast.is-leaving, .ist-toast__bar {
                animation-duration: .001ms !important;
            }
        }
    `;
    document.head.appendChild(style);
}

/** Get (or create) the fixed container that holds the toast stack. */
function istToastContainer() {
    let container = document.getElementById('ist-toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'ist-toast-container';
        document.body.appendChild(container);
    }
    return container;
}

/** Play the exit animation and then remove the toast. */
function istDismissToast(toast) {
    if (!toast || toast.classList.contains('is-leaving')) return;
    toast.classList.add('is-leaving');
    const remove = () => { if (toast.parentNode) toast.remove(); };
    toast.addEventListener('animationend', remove, { once: true });
    setTimeout(remove, 420); // safety net if the animation never fires
}

/**
 * Show a temporary toast notification at the top-right of the screen.
 * The toast hides as soon as the user taps or clicks it.
 * @param {string} message - Text to display
 * @param {'success'|'error'|'warning'|'info'} [type='info'] - Notification style
 * @param {{duration?: number}} [options] - Optional overrides
 * @returns {HTMLElement} the toast element
 */
function showNotification(message, type = 'info', options = {}) {
    istToastEnsureStyles();

    const key = IST_TOAST_META[type] ? type : 'info';
    const meta = IST_TOAST_META[key];
    const duration = Number(options && options.duration) > 0
        ? Number(options.duration)
        : IST_TOAST_MS;

    const toast = document.createElement('div');
    toast.className = 'ist-toast ist-toast--' + key;
    toast.setAttribute('role', key === 'error' ? 'alert' : 'status');
    toast.setAttribute('aria-live', key === 'error' ? 'assertive' : 'polite');
    toast.title = 'Tap to dismiss';
    toast.innerHTML =
        '<span class="ist-toast__icon"><i class="' + meta.icon + '"></i></span>' +
        '<p class="ist-toast__msg"></p>' +
        '<button type="button" class="ist-toast__close" aria-label="Dismiss notification">' +
        '<i class="fas fa-xmark"></i></button>' +
        '<span class="ist-toast__bar" style="animation-duration:' + duration + 'ms"></span>';
    toast.querySelector('.ist-toast__msg').textContent = message;

    const container = istToastContainer();
    container.appendChild(toast);

    // Keep the stack short: drop the oldest toast once there are too many.
    const all = container.querySelectorAll('.ist-toast');
    if (all.length > 4) istDismissToast(all[0]);

    // Dismiss on the × button…
    toast.querySelector('.ist-toast__close').addEventListener('click', function (e) {
        e.stopPropagation();
        istDismissToast(toast);
    });

    // …and on any tap/click on the toast itself ("hide if touched by user").
    toast.addEventListener('click', function () { istDismissToast(toast); });
    toast.addEventListener('touchstart', function () { istDismissToast(toast); }, { passive: true });

    // Auto-hide.
    if (duration > 0) {
        setTimeout(function () { istDismissToast(toast); }, duration);
    }

    return toast;
}

/* ==========================================================================
   Language helpers (story `lang`) + text-to-speech
   ========================================================================== */

// Short story lang code -> BCP-47 locale used by speech synthesis.
const IST_LOCALES = {
    en: 'en-US', fr: 'fr-FR', es: 'es-ES', de: 'de-DE', it: 'it-IT',
    pt: 'pt-PT', ru: 'ru-RU', tr: 'tr-TR', ar: 'ar-SA', fa: 'fa-IR',
    ur: 'ur-PK', zh: 'zh-CN', ja: 'ja-JP', ko: 'ko-KR', hi: 'hi-IN',
    nl: 'nl-NL', pl: 'pl-PL', sv: 'sv-SE', el: 'el-GR', he: 'he-IL'
};

// Languages that are written right-to-left.
const IST_RTL_LANGS = ['ar', 'fa', 'ur', 'he'];

// Human readable names for story languages.
const IST_LANG_NAMES = {
    en: 'English', fr: 'French', es: 'Spanish', de: 'German', it: 'Italian',
    pt: 'Portuguese', ru: 'Russian', tr: 'Turkish', ar: 'Arabic', fa: 'Persian',
    ur: 'Urdu', zh: 'Chinese', ja: 'Japanese', ko: 'Korean', hi: 'Hindi',
    nl: 'Dutch', pl: 'Polish', sv: 'Swedish', el: 'Greek', he: 'Hebrew'
};

// Emoji flag used in language pickers/filters.
const IST_LANG_FLAGS = {
    en: '🇬🇧', fr: '🇫🇷', es: '🇪🇸', de: '🇩🇪', it: '🇮🇹', pt: '🇵🇹',
    ru: '🇷🇺', tr: '🇹🇷', ar: '🇸🇦', fa: '🇮🇷', ur: '🇵🇰', zh: '🇨🇳',
    ja: '🇯🇵', ko: '🇰🇷', hi: '🇮🇳', nl: '🇳🇱', pl: '🇵🇱', sv: '🇸🇪',
    el: '🇬🇷', he: '🇮'
};

// Preferred display order for language pickers/filters.
const IST_LANGUAGE_ORDER = [
    'en', 'fr', 'es', 'de', 'it', 'pt', 'ru', 'tr',
    'ar', 'fa', 'ur', 'he', 'zh', 'ja', 'ko', 'hi',
    'nl', 'pl', 'sv', 'el'
];

/**
 * Emoji flag for a story lang code (empty string when unknown).
 */
function langFlag(lang) {
    if (!lang) return '';
    const code = String(lang).toLowerCase().split('-')[0];
    return IST_LANG_FLAGS[code] || '';
}

/**
 * Human readable name for a story lang code (falls back to upper-case code).
 */
function langDisplayName(lang) {
    if (!lang) return 'English';
    const code = String(lang).toLowerCase().split('-')[0];
    return IST_LANG_NAMES[code] || String(lang).toUpperCase();
}

/**
 * Convert a short story lang code (e.g. "ar") to a BCP-47 locale ("ar-SA").
 */
function langToLocale(lang) {
    if (!lang) return 'en-US';
    const code = String(lang).toLowerCase();
    if (IST_LOCALES[code]) return IST_LOCALES[code];
    return code; // already a full locale such as "en-US"
}

/**
 * Whether a language is written right-to-left.
 */
function isRtlLang(lang) {
    if (!lang) return false;
    return IST_RTL_LANGS.indexOf(String(lang).toLowerCase().split('-')[0]) !== -1;
}

/**
 * Best-effort language code for a saved word / card.
 * Prefers the language recorded when the word was saved, then falls back to
 * script/accent detection so older entries still get a sensible code.
 * @param {{language?:string, lang?:string, word?:string, originalWord?:string}} word
 * @param {string} [fallback='en']
 * @returns {string} short code such as "fr", "ar", "en"
 */
function wordLang(word, fallback) {
    fallback = fallback || 'en';
    if (!word) return fallback;

    const stored = word.language || word.lang;
    if (stored) return String(stored).toLowerCase().split('-')[0];

    const text = word.originalWord || word.word || '';
    if (!text) return fallback;

    if (/[\u0600-\u06FF]/.test(text)) return 'ar';
    if (/[\u0400-\u04FF]/.test(text)) return 'ru';
    if (/[\u4e00-\u9fff]/.test(text)) return 'zh';
    if (/[\u3040-\u30ff]/.test(text)) return 'ja';
    if (/[\uac00-\ud7af]/.test(text)) return 'ko';
    if (/[\u0590-\u05ff]/.test(text)) return 'he';
    // Latin script: look for the most common accent markers.
    if (/[àâçéèêëîïôûùüÿœ]/i.test(text)) return 'fr';
    if (/[ñ¿¡]/i.test(text)) return 'es';
    if (/[äöüß]/i.test(text)) return 'de';
    return fallback;
}

/**
 * Pick the best matching installed voice for a locale, if any.
 */
function pickVoiceForLocale(locale, voices) {
    voices = voices || (window.speechSynthesis ? speechSynthesis.getVoices() : []) || [];
    const target = String(locale || '').toLowerCase();
    const base = target.split('-')[0];
    const norm = v => (v.lang || '').replace('_', '-').toLowerCase();
    return voices.find(v => v.lang && norm(v) === target) ||
        voices.find(v => v.lang && norm(v).split('-')[0] === base) ||
        null;
}

/**
 * Speak text with the browser's speech synthesis, honouring a story lang code.
 * @param {string} text
 * @param {string} [lang] - short code ("ar") or full locale ("ar-SA")
 * @param {{rate?:number,pitch?:number,volume?:number,onend?:Function,onerror?:Function}} [options]
 * @returns {SpeechSynthesisUtterance|null}
 */
function speakText(text, lang, options) {
    if (!('speechSynthesis' in window) || !text) return null;
    options = options || {};

    const locale = langToLocale(lang);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = locale;

    const voice = pickVoiceForLocale(locale);
    if (voice) utterance.voice = voice;

    if (options.rate != null) utterance.rate = options.rate;
    if (options.pitch != null) utterance.pitch = options.pitch;
    if (options.volume != null) utterance.volume = options.volume;
    if (options.onend) utterance.onend = options.onend;
    if (options.onerror) utterance.onerror = options.onerror;

    speechSynthesis.speak(utterance);
    return utterance;
}

/**
 * Escape a string so it can be safely used inside a RegExp.
 */
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Format a byte count into a human readable string (KB/MB/GB).
 */
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Smooth-scroll the window back to the top.
 */
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

/**
 * Create the floating "scroll to top" button and wire up its events.
 */
function addScrollToTopButton() {
    const button = document.createElement('button');
    button.id = 'scrollToTopBtn';
    button.innerHTML = '<i class="fas fa-arrow-up"></i>';
    button.title = 'Scroll to top';

    button.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: var(--primary);
        color: white;
        border: none;
        border-radius: 50%;
        font-size: 1.2rem;
        cursor: pointer;
        display: none; /* Hidden by default */
        z-index: 1000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        transition: all 0.3s ease;
    `;

    button.addEventListener('mouseover', () => {
        button.style.transform = 'scale(1.1)';
        button.style.boxShadow = '0 6px 16px rgba(0,0,0,0.3)';
    });

    button.addEventListener('mouseout', () => {
        button.style.transform = 'scale(1)';
        button.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
    });

    button.addEventListener('click', scrollToTop);

    document.body.appendChild(button);

    // Show/hide button based on scroll position
    window.addEventListener('scroll', toggleScrollToTopButton);
}

/**
 * Show or hide the "scroll to top" button depending on scroll position.
 */
function toggleScrollToTopButton() {
    const button = document.getElementById('scrollToTopBtn');
    if (!button) return;

    if (window.scrollY > 300) {
        button.style.display = 'flex';
        button.style.alignItems = 'center';
        button.style.justifyContent = 'center';
    } else {
        button.style.display = 'none';
    }
}

/**
 * Mark a color option as active inside a color selector.
 * @param {string} color - The color value of the active option
 * @param {boolean} [isSecondary=false] - Whether this is the secondary color selector
 */
function updateActiveColor(color, isSecondary = false) {
    const selector = isSecondary ? '.secondary-color:not(.custom-color)' : '.color-option:not(.custom-color):not(.secondary-color)';
    const options = document.querySelectorAll(selector);

    options.forEach(option => {
        option.classList.remove('active');
        if (option.dataset.color === color) {
            option.classList.add('active');
        }
    });
}

/**
 * Grow a textarea to fit its content (capped at 400px).
 */
function autoResizeTextarea(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 400) + 'px';
}

/**
 * Wire the search form/input to the page's performSearch() function.
 * Relies on the page defining searchForm, searchInput and performSearch.
 */
function setupSearch() {
    if (!searchForm || !searchInput) return;

    // Search when form is submitted
    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        performSearch();
    });

    // Search while typing
    searchInput.addEventListener('input', (e) => {
        performSearch(); // Remove condition to make search immediate
    });

    // Clear button
    searchInput.addEventListener('keyup', (e) => {
        if (e.key === 'Escape') {
            searchInput.value = '';
            performSearch();
        }
    });
}

/**
 * Wire the "more" navigation menu toggle.
 * Relies on the page defining toggleNav, more and isMenuOpen.
 */
function setupNavToggle() {
    if (!toggleNav || !more) return;

    // Toggle menu
    toggleNav.addEventListener("click", function (e) {
        e.stopPropagation();
        isMenuOpen = !isMenuOpen;
        more.classList.toggle("open");
    });

    // Close menu when clicking anywhere
    document.addEventListener("click", function () {
        if (isMenuOpen) {
            more.classList.remove("open");
            isMenuOpen = false;
        }
    });

    // Prevent closing when clicking inside the menu
    more.addEventListener("click", function (e) {
        e.stopPropagation();
    });

    // Close menu on Escape key
    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && isMenuOpen) {
            more.classList.remove("open");
            isMenuOpen = false;
        }
    });

    // Close menu when clicking on any <a> inside the menu
    const links = more.querySelectorAll("a");
    links.forEach(link => {
        link.addEventListener("click", function () {
            more.classList.remove("open");
            isMenuOpen = false;
        });
    });
}
