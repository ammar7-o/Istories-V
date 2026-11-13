/* ==========================================================================
   shortcuts.js — user-configurable keyboard shortcuts for IStories
   ==========================================================================
   Loaded on every page (classic script, no build step). It defines a small
   catalogue of app actions, reads the user's key bindings from localStorage
   and performs the matching action on keydown. The Settings page
   (`main/settings/index.html`) uses the public API to let people record their
   own bindings.

   Storage
   -------
   istories_shortcuts_v1   JSON object: { actionId: "ctrl+alt+1", … }
   istories_shortcuts_enabled
                           "false" disables the global handler.

   Public API (window.IStoriesShortcuts)
   -------------------------------------
   actions, defaults, get(id), getAll(), set(id, combo), reset(id),
   resetAll(), format(combo), formatHtml(combo), comboFromEvent(event),
   isAllowed(combo), isEnabled(), setEnabled(bool), reload()
   ========================================================================== */
(function () {
    'use strict';

    var scriptEl = document.currentScript || (function () {
        var all = document.getElementsByTagName('script');
        return all[all.length - 1];
    })();

    // nav/shortcuts.js lives at <root>/main/nav/, so ../../ is the site root.
    var rootUrl;
    try {
        rootUrl = new URL('../../', new URL(scriptEl.src, document.baseURI));
    } catch (error) {
        rootUrl = new URL('./', document.baseURI);
    }

    function url(relative) {
        return new URL(relative, rootUrl).href;
    }

    var STORE_KEY = 'istories_shortcuts_v1';
    var ENABLED_KEY = 'istories_shortcuts_enabled';

    var ACTIONS = [
        { id: 'home', label: 'Home', i18n: 'nav.home', icon: 'fa-house', path: 'index.html' },
        { id: 'library', label: 'Story Library', i18n: 'nav.stories', icon: 'fa-book-open', path: 'main/index.html' },
        { id: 'myStories', label: 'My Stories', i18n: 'nav.myStories', icon: 'fa-book-bookmark', path: 'main/myStories/index.html' },
        { id: 'bases', label: 'Story Bases', i18n: 'nav.bases', icon: 'fa-database', path: 'main/bases/index.html' },
        { id: 'vocabulary', label: 'Vocabulary', i18n: 'nav.vocabulary', icon: 'fa-language', path: 'main/vocabulary/index.html' },
        { id: 'flashcards', label: 'Flashcards', i18n: 'nav.flashcards', icon: 'fa-layer-group', path: 'main/flashcard/index.html' },
        { id: 'quiz', label: 'Quiz', i18n: 'nav.quiz', icon: 'fa-brain', path: 'main/quiz/index.html' },
        { id: 'studio', label: 'Stories Studio', i18n: 'nav.studio', icon: 'fa-circle-plus', path: 'main/storiesStudio/index.html' },
        { id: 'profile', label: 'Profile', i18n: 'nav.profile', icon: 'fa-user', path: 'main/profile/index.html' },
        { id: 'settings', label: 'Settings', i18n: 'nav.settings', icon: 'fa-gear', path: 'main/settings/index.html' },
        { id: 'help', label: 'Help & guide', i18n: 'nav.help', icon: 'fa-circle-question', path: 'main/help/index.html' },
        { id: 'theme', label: 'Toggle theme', i18n: 'shortcuts.themeAction', icon: 'fa-moon', action: 'theme' },
        { id: 'search', label: 'Focus search', i18n: 'shortcuts.searchAction', icon: 'fa-magnifying-glass', action: 'search' },
        { id: 'random', label: 'Open a random story', i18n: 'shortcuts.randomAction', icon: 'fa-shuffle', action: 'random' },
        { id: 'top', label: 'Back to top', i18n: 'shortcuts.topAction', icon: 'fa-arrow-up', action: 'top' }
    ];

    var DEFAULTS = {
        home: 'ctrl+alt+shift+h',
        library: 'ctrl+alt+1',
        myStories: 'ctrl+alt+2',
        bases: 'ctrl+alt+3',
        vocabulary: 'ctrl+alt+4',
        flashcards: 'ctrl+alt+5',
        quiz: 'ctrl+alt+6',
        studio: 'ctrl+alt+7',
        profile: 'ctrl+alt+8',
        settings: 'ctrl+alt+9',
        help: 'ctrl+alt+0',
        theme: 'ctrl+alt+shift+d',
        search: 'ctrl+alt+k',
        random: 'ctrl+alt+r',
        top: 'ctrl+alt+shift+u'
    };

    var MODIFIERS = { ctrl: true, alt: true, shift: true, meta: true };
    var KEY_FROM_CODE = {
        Semicolon: 'semicolon', Quote: 'quote', Comma: 'comma', Period: 'period',
        Slash: 'slash', Backslash: 'backslash', BracketLeft: 'bracketleft',
        BracketRight: 'bracketright', Minus: 'minus', Equal: 'equal',
        Backquote: 'backquote', Space: 'space', Enter: 'enter',
        NumpadAdd: 'numpadplus', NumpadSubtract: 'numpadminus',
        NumpadMultiply: 'numpadmultiply', NumpadDivide: 'numpaddivide',
        NumpadDecimal: 'numpaddecimal', NumpadEnter: 'numpadenter'
    };
    var KEY_LABELS = {
        semicolon: ';', quote: "'", comma: ',', period: '.', slash: '/',
        backslash: '\\', bracketleft: '[', bracketright: ']', minus: '-',
        equal: '=', backquote: '`', space: 'Space', enter: 'Enter',
        ctrl: 'Ctrl', alt: 'Alt', shift: 'Shift', meta: 'Meta',
        numpadplus: 'Num +', numpadminus: 'Num −', numpadmultiply: 'Num *',
        numpaddivide: 'Num /', numpaddecimal: 'Num .', numpadenter: 'Num Enter'
    };
    var SPECIAL_KEYS = {
        ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right',
        Escape: 'escape', Backspace: 'backspace', Delete: 'delete',
        Home: 'home', End: 'end', PageUp: 'pageup', PageDown: 'pagedown',
        Tab: 'tab', Insert: 'insert'
    };

    function warn() {
        if (window.console && console.warn) {
            console.warn.apply(console, ['[IStories shortcuts]'].concat([].slice.call(arguments)));
        }
    }

    function readOverrides() {
        try {
            var raw = localStorage.getItem(STORE_KEY);
            var parsed = raw ? JSON.parse(raw) : {};
            return (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) ? parsed : {};
        } catch (error) {
            return {};
        }
    }

    function writeOverrides(map) {
        try {
            localStorage.setItem(STORE_KEY, JSON.stringify(map));
        } catch (error) {
            warn('could not save shortcuts', error);
        }
    }

    function hasOwn(object, key) {
        return Object.prototype.hasOwnProperty.call(object, key);
    }

    function findAction(id) {
        for (var i = 0; i < ACTIONS.length; i += 1) {
            if (ACTIONS[i].id === id) return ACTIONS[i];
        }
        return null;
    }

    function resolve(overrides, id) {
        if (hasOwn(overrides, id)) return overrides[id] || '';
        return DEFAULTS[id] || '';
    }

    function get(id) {
        return resolve(readOverrides(), id);
    }

    function getAll() {
        var overrides = readOverrides();
        var map = {};
        ACTIONS.forEach(function (action) { map[action.id] = resolve(overrides, action.id); });
        return map;
    }

    /* ----------------------------------------------------------------------
       Combo helpers
       ---------------------------------------------------------------------- */

    function keyFromEvent(event) {
        var code = event.code || '';
        if (/^Key[A-Z]$/.test(code)) return code.slice(3).toLowerCase();
        if (/^Digit[0-9]$/.test(code)) return code.slice(5);
        if (/^Numpad[0-9]$/.test(code)) return 'numpad' + code.slice(6);
        if (KEY_FROM_CODE[code]) return KEY_FROM_CODE[code];

        var key = String(event.key || '').toLowerCase();
        if (SPECIAL_KEYS[event.key]) return SPECIAL_KEYS[event.key];
        if (key === ' ' || key === 'spacebar') return 'space';
        if (key === 'esc') return 'escape';
        if (key === 'del') return 'delete';
        if (key === 'control' || key === 'alt' || key === 'shift' ||
            key === 'meta' || key === 'os' || key === 'hyper') return '';
        if (key === '+') return 'plus';
        if (key.length === 1) return key;
        return key;
    }

    function comboFromEvent(event) {
        var key = keyFromEvent(event);
        if (!key) return '';
        var parts = [];
        if (event.ctrlKey) parts.push('ctrl');
        if (event.altKey) parts.push('alt');
        if (event.shiftKey) parts.push('shift');
        if (event.metaKey) parts.push('meta');
        parts.push(key);
        return parts.join('+');
    }

    function isAllowed(combo) {
        if (!combo) return true;
        var parts = String(combo).split('+');
        var key = parts.pop();
        if (!key) return false;
        if (key === 'escape' || key === 'tab') return false;
        var hasModifier = parts.indexOf('ctrl') !== -1 ||
            parts.indexOf('alt') !== -1 ||
            parts.indexOf('meta') !== -1;
        if (hasModifier) return true;
        return /^f(?:[1-9]|1[0-2])$/.test(key);
    }

    function format(combo) {
        if (!combo) return '';
        return String(combo).split('+').map(function (part) {
            if (KEY_LABELS[part]) return KEY_LABELS[part];
            if (part === 'numpad0' || part === 'numpad1' || part === 'numpad2' ||
                part === 'numpad3' || part === 'numpad4' || part === 'numpad5' ||
                part === 'numpad6' || part === 'numpad7' || part === 'numpad8' ||
                part === 'numpad9') {
                return 'Num ' + part.slice(6);
            }
            return part.charAt(0).toUpperCase() + part.slice(1);
        }).join(' + ');
    }

    function escapeHtml(value) {
        return String(value == null ? '' : value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function formatHtml(combo) {
        if (!combo) return '';
        return String(combo).split('+').map(function (part) {
            return '<kbd>' + escapeHtml(format(part)) + '</kbd>';
        }).join('<span class="shortcut-plus" aria-hidden="true">+</span>');
    }

    function set(id, combo) {
        if (!findAction(id)) return { ok: false, error: 'unknown' };
        combo = String(combo || '').toLowerCase();
        if (combo && !isAllowed(combo)) return { ok: false, error: 'invalid' };

        var overrides = readOverrides();
        if (combo) {
            for (var i = 0; i < ACTIONS.length; i += 1) {
                var other = ACTIONS[i];
                if (other.id !== id && resolve(overrides, other.id) === combo) {
                    return { ok: false, error: 'conflict', conflict: other.id };
                }
            }
        }

        overrides[id] = combo;
        writeOverrides(overrides);
        notifyChange();
        return { ok: true };
    }

    function reset(id) {
        var overrides = readOverrides();
        if (!hasOwn(overrides, id)) return { ok: true };
        delete overrides[id];
        writeOverrides(overrides);
        notifyChange();
        return { ok: true };
    }

    function resetAll() {
        writeOverrides({});
        notifyChange();
        return { ok: true };
    }

    function isEnabled() {
        try { return localStorage.getItem(ENABLED_KEY) !== 'false'; }
        catch (error) { return true; }
    }

    function setEnabled(enabled) {
        try { localStorage.setItem(ENABLED_KEY, enabled ? 'true' : 'false'); }
        catch (error) { warn('could not save enabled state', error); }
        notifyChange();
    }

    function notifyChange() {
        document.dispatchEvent(new CustomEvent('ist-shortcuts-change'));
    }

    /* ----------------------------------------------------------------------
       Actions
       ---------------------------------------------------------------------- */

    function isEditable(target) {
        if (!target || !target.closest) return false;
        var el = target.closest('input, textarea, select, [contenteditable="true"]');
        return !!el;
    }

    function focusSearch() {
        var selectors = [
            '#storySearch', '.ist-header__search input', '#searchInput',
            '#search', 'input[type="search"]', '.search-input'
        ];
        for (var i = 0; i < selectors.length; i += 1) {
            var inputs = document.querySelectorAll(selectors[i]);
            for (var j = 0; j < inputs.length; j += 1) {
                var input = inputs[j];
                if (input.disabled || input.hidden) continue;
                if (input.offsetParent === null && getComputedStyle(input).position !== 'fixed') continue;
                input.focus();
                try { input.select(); } catch (error) { /* ignore */ }
                return true;
            }
        }
        return false;
    }

    function toggleTheme() {
        var btn = document.getElementById('themeToggle');
        if (btn) {
            btn.click();
            return;
        }
        var dark = document.body.classList.toggle('dark-mode');
        try { localStorage.setItem('theme', dark ? 'dark' : 'light'); } catch (error) { /* ignore */ }
    }

    function openRandomStory() {
        var btn = document.getElementById('randomStory');
        if (btn) {
            btn.click();
            return;
        }
        location.href = url('main/index.html?ist-intent=random');
    }

    function goTop() {
        try {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (error) {
            window.scrollTo(0, 0);
        }
    }

    function run(action) {
        if (action.path) {
            var target = url(action.path);
            if (new URL(target).pathname === location.pathname) {
                goTop();
            } else {
                location.href = target;
            }
            return;
        }
        if (action.action === 'theme') toggleTheme();
        else if (action.action === 'search') {
            if (!focusSearch()) location.href = url('main/index.html?ist-intent=search');
        } else if (action.action === 'random') openRandomStory();
        else if (action.action === 'top') goTop();
    }

    /* ----------------------------------------------------------------------
       Global key handler
       ---------------------------------------------------------------------- */

    function onKeyDown(event) {
        if (!isEnabled()) return;
        if (document.documentElement.hasAttribute('data-shortcut-capture')) return;
        if (event.defaultPrevented) return;

        var combo = comboFromEvent(event);
        if (!combo) return;

        var overrides = readOverrides();
        var action = null;
        for (var i = 0; i < ACTIONS.length; i += 1) {
            if (resolve(overrides, ACTIONS[i].id) === combo) { action = ACTIONS[i]; break; }
        }
        if (!action) return;

        // A bare function key can still be used while typing; everything else
        // is only active outside form fields (the modifier-combos are safe).
        var hasModifier = event.ctrlKey || event.altKey || event.metaKey;
        if (!hasModifier && isEditable(event.target)) return;

        event.preventDefault();
        event.stopPropagation();
        run(action);
    }

    /* ----------------------------------------------------------------------
       Deep-link intents (used when a shortcut needs another page)
       ---------------------------------------------------------------------- */

    function handleIntent() {
        var params;
        try { params = new URLSearchParams(location.search); }
        catch (error) { return; }
        var intent = params.get('ist-intent');
        if (!intent) return;

        function cleanUrl() {
            try {
                var next = new URL(location.href);
                next.searchParams.delete('ist-intent');
                history.replaceState(null, '', next);
            } catch (error) { /* ignore */ }
        }

        if (intent === 'search') {
            cleanUrl();
            setTimeout(function () { focusSearch(); }, 350);
            return;
        }

        if (intent === 'random') {
            cleanUrl();
            var tries = 0;
            var timer = setInterval(function () {
                var btn = document.getElementById('randomStory');
                tries += 1;
                if (btn) {
                    clearInterval(timer);
                    btn.click();
                } else if (tries > 40) {
                    clearInterval(timer);
                }
            }, 250);
        }
    }

    function init() {
        document.addEventListener('keydown', onKeyDown, true);
        handleIntent();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    window.IStoriesShortcuts = {
        actions: ACTIONS,
        defaults: DEFAULTS,
        get: get,
        getAll: getAll,
        set: set,
        reset: reset,
        resetAll: resetAll,
        format: format,
        formatHtml: formatHtml,
        comboFromEvent: comboFromEvent,
        isAllowed: isAllowed,
        isEnabled: isEnabled,
        setEnabled: setEnabled,
        reload: function () { /* bindings are read on demand */ },
        run: function (id) {
            var action = findAction(id);
            if (action) run(action);
        }
    };
})();
