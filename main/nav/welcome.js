/* ==========================================================================
   welcome.js — first-visit welcome guide
   ==========================================================================
   What it does
   ------------
   1. Shows an accessible welcome dialog on the FIRST visit to the homepage
      only. The completed flag is stored in IndexedDB via localForage under
      `istories_welcome_completed_v1` (with a localStorage mirror as a fallback
      when IndexedDB is unavailable).
   2. Never opens automatically on other pages. It can be reopened at any time
      from the sidebar "Help & guide" action, `window.IStoriesWelcome.open()`,
      the `ist-welcome-open` event, `?welcome=1`, or `#welcome`.
   3. Supports keyboard navigation (Escape closes, Tab stays in the dialog),
      restores focus, and is fully translated through the shared i18n engine.

   Include (after i18n.js and localforage):
       <link rel="stylesheet" href="<rel>/nav/welcome.css">
       <script src="<rel>/nav/welcome.js" defer></script>
   ========================================================================== */
(function () {
    'use strict';

    var STORAGE_KEY = 'istories_welcome_completed_v1';
    var scriptEl = document.currentScript || (function () {
        var all = document.getElementsByTagName('script');
        return all[all.length - 1];
    })();

    // welcome.js lives in <root>/nav/, so the site root is two levels up.
    var rootUrl = new URL('../../', new URL(scriptEl.src, document.baseURI));

    function rootPath() {
        var path = rootUrl.pathname.replace(/\/+$/, '/');
        return path || '/';
    }

    function currentPath() {
        return location.pathname.replace(/\/index\.html?$/i, '/');
    }

    function isHomepage() {
        var here = currentPath().replace(/\/+$/, '/');
        return here === rootPath();
    }

    /* ----------------------------------------------------------------------
       Persistence (localForage first, localStorage mirror as fallback)
       ---------------------------------------------------------------------- */
    var store = null;
    try {
        if (window.localforage && typeof window.localforage.createInstance === 'function') {
            store = window.localforage.createInstance({
                name: 'IStoriesDB',
                storeName: 'istories'
            });
        }
    } catch (error) {
        store = null;
    }

    function fallbackRead() {
        try {
            return localStorage.getItem(STORAGE_KEY) === 'true';
        } catch (error) {
            return false;
        }
    }

    function fallbackWrite() {
        try {
            localStorage.setItem(STORAGE_KEY, 'true');
        } catch (error) { /* private mode — ignore */ }
    }

    function readCompleted() {
        if (!store) return Promise.resolve(fallbackRead());
        return new Promise(function (resolve) {
            var settled = false;
            var timer = setTimeout(function () {
                if (settled) return;
                settled = true;
                resolve(fallbackRead());
            }, 1200);
            store.getItem(STORAGE_KEY).then(function (value) {
                if (settled) return;
                settled = true;
                clearTimeout(timer);
                if (value === true || value === 'true') resolve(true);
                else if (value === false || value === 'false') resolve(false);
                else resolve(fallbackRead());
            }).catch(function () {
                if (settled) return;
                settled = true;
                clearTimeout(timer);
                resolve(fallbackRead());
            });
        });
    }

    function markCompleted() {
        fallbackWrite();
        if (store) {
            try {
                store.setItem(STORAGE_KEY, true).catch(function () { /* ignore */ });
            } catch (error) { /* ignore */ }
        }
    }

    /* ----------------------------------------------------------------------
       Dialog
       ---------------------------------------------------------------------- */
    var overlay = null;
    var dialog = null;
    var lastFocused = null;
    var built = false;

    function build() {
        if (built) return;
        built = true;

        overlay = document.createElement('div');
        overlay.className = 'ist-welcome';
        overlay.id = 'ist-welcome';
        overlay.hidden = true;

        overlay.innerHTML =
            '<div class="ist-welcome__backdrop" data-welcome-close></div>' +
            '<div class="ist-welcome__dialog" role="dialog" aria-modal="true" ' +
            '     aria-labelledby="ist-welcome-title" aria-describedby="ist-welcome-subtitle">' +
            '  <button type="button" class="ist-welcome__close" data-welcome-close ' +
            '          data-i18n-aria-label="welcome.close" aria-label="Close welcome guide">' +
            '    <i class="fa-solid fa-xmark" aria-hidden="true"></i>' +
            '  </button>' +
            '  <div class="ist-welcome__head">' +
            '    <span class="ist-welcome__logo">' +
            '      <img src="' + new URL('icon.svg', rootUrl).href + '" alt="">' +
            '      <span>IStories</span>' +
            '    </span>' +
            '    <span class="ist-welcome__eyebrow" data-i18n="welcome.eyebrow">Welcome to IStories</span>' +
            '    <h2 class="ist-welcome__title" id="ist-welcome-title" data-i18n="welcome.title">Learn a language, one story at a time</h2>' +
            '    <p class="ist-welcome__subtitle" id="ist-welcome-subtitle" data-i18n="welcome.subtitle">IStories turns reading into real language practice. Open a story, tap any word for an instant translation, listen to the narration, and save new vocabulary as you go.</p>' +
            '  </div>' +
            '  <div class="ist-welcome__pages">' +
            '    <article class="ist-welcome__card">' +
            '      <span class="ist-welcome__card-icon"><i class="fa-solid fa-book-open" aria-hidden="true"></i></span>' +
            '      <div><h3 class="ist-welcome__card-title" data-i18n="welcome.libraryTitle">Story Library</h3>' +
            '      <p class="ist-welcome__card-text" data-i18n="welcome.libraryText">Browse stories by level and language, then read with tap-to-translate words and audio.</p></div>' +
            '    </article>' +
            '    <article class="ist-welcome__card">' +
            '      <span class="ist-welcome__card-icon"><i class="fa-solid fa-book-bookmark" aria-hidden="true"></i></span>' +
            '      <div><h3 class="ist-welcome__card-title" data-i18n="welcome.myStoriesTitle">My Stories</h3>' +
            '      <p class="ist-welcome__card-text" data-i18n="welcome.myStoriesText">Find the stories you saved, import PDFs, and keep your own library organised.</p></div>' +
            '    </article>' +
            '    <article class="ist-welcome__card">' +
            '      <span class="ist-welcome__card-icon"><i class="fa-solid fa-circle-plus" aria-hidden="true"></i></span>' +
            '      <div><h3 class="ist-welcome__card-title" data-i18n="welcome.studioTitle">Stories Studio</h3>' +
            '      <p class="ist-welcome__card-text" data-i18n="welcome.studioText">Create stories manually, import a JS/JSON database, or turn a PDF into a story.</p></div>' +
            '    </article>' +
            '    <article class="ist-welcome__card">' +
            '      <span class="ist-welcome__card-icon"><i class="fa-solid fa-layer-group" aria-hidden="true"></i></span>' +
            '      <div><h3 class="ist-welcome__card-title" data-i18n="welcome.vocabTitle">Vocabulary &amp; Flashcards</h3>' +
            '      <p class="ist-welcome__card-text" data-i18n="welcome.vocabText">Review saved words with flashcards and quizzes, and track your learning progress.</p></div>' +
            '    </article>' +
            '  </div>' +
            '  <p class="ist-welcome__tip" data-i18n="welcome.tip">Tip: use the globe button in the menu to switch between English and Arabic at any time.</p>' +
            '  <div class="ist-welcome__foot">' +
            '    <label class="ist-welcome__remember">' +
            '      <input type="checkbox" id="ist-welcome-remember">' +
            '      <span data-i18n="welcome.dontShow">Don\'t show this again</span>' +
            '    </label>' +
            '    <button type="button" class="ist-welcome__start" id="ist-welcome-start">' +
            '      <span data-i18n="welcome.getStarted">Get Started</span>' +
            '      <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>' +
            '    </button>' +
            '  </div>' +
            '</div>';

        document.body.appendChild(overlay);
        dialog = overlay.querySelector('.ist-welcome__dialog');

        overlay.addEventListener('click', function (event) {
            if (event.target.closest('[data-welcome-close]')) {
                close();
            }
        });

        var startBtn = overlay.querySelector('#ist-welcome-start');
        if (startBtn) {
            startBtn.addEventListener('click', function () {
                close();
            });
        }

        var remember = overlay.querySelector('#ist-welcome-remember');
        if (remember) {
            remember.addEventListener('change', function () {
                if (remember.checked) markCompleted();
            });
        }

        document.addEventListener('keydown', onKeydown, true);
        document.addEventListener('ist-language-change', refreshTranslations);
    }

    function refreshTranslations() {
        if (window.IStoriesI18n && typeof window.IStoriesI18n.refresh === 'function') {
            window.IStoriesI18n.refresh();
        }
    }

    function focusables() {
        if (!dialog) return [];
        return Array.prototype.slice.call(
            dialog.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
        ).filter(function (node) {
            return !node.disabled && node.offsetParent !== null;
        });
    }

    function onKeydown(event) {
        if (!overlay || overlay.hidden) return;
        if (event.key === 'Escape') {
            event.preventDefault();
            close();
            return;
        }
        if (event.key !== 'Tab') return;
        var nodes = focusables();
        if (!nodes.length) return;
        var first = nodes[0];
        var last = nodes[nodes.length - 1];
        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
        }
    }

    function open(options) {
        options = options || {};
        build();

        lastFocused = document.activeElement;
        overlay.hidden = false;
        document.body.classList.add('ist-welcome-open');

        var remember = overlay.querySelector('#ist-welcome-remember');
        if (remember) remember.checked = false;

        refreshTranslations();

        // Let the browser paint once so the entry animation can play.
        requestAnimationFrame(function () {
            overlay.classList.add('is-open');
            var start = overlay.querySelector('#ist-welcome-start');
            if (start) start.focus();
            else if (dialog) dialog.focus();
        });

        if (options.remember === false) return;
    }

    function close(options) {
        if (!overlay || overlay.hidden) return;
        options = options || {};
        overlay.classList.remove('is-open');
        overlay.hidden = true;
        document.body.classList.remove('ist-welcome-open');
        markCompleted();
        if (lastFocused && typeof lastFocused.focus === 'function') {
            try { lastFocused.focus(); } catch (error) { /* ignore */ }
        }
        lastFocused = null;
        if (options.silent !== true) {
            document.dispatchEvent(new CustomEvent('ist-welcome-closed'));
        }
    }

    function reset() {
        try { localStorage.removeItem(STORAGE_KEY); } catch (error) { /* ignore */ }
        if (store) {
            try { store.removeItem(STORAGE_KEY).catch(function () { /* ignore */ }); } catch (error) { /* ignore */ }
        }
    }

    /* ----------------------------------------------------------------------
       Open triggers
       ---------------------------------------------------------------------- */
    function wireTriggers() {
        document.addEventListener('ist-welcome-open', function () {
            open();
        });

        document.addEventListener('click', function (event) {
            var trigger = event.target.closest && event.target.closest('[data-welcome-open]');
            if (trigger) {
                event.preventDefault();
                open();
            }
        });

        var params;
        try {
            params = new URLSearchParams(location.search);
        } catch (error) {
            params = null;
        }

        if (params && params.get('welcome') === '1') {
            open();
            return;
        }

        if (location.hash === '#welcome') {
            open();
            return;
        }

        // Automatic first-visit tour: homepage only.
        if (!isHomepage()) return;
        if (params && params.get('welcome') === '0') return;

        readCompleted().then(function (completed) {
            if (!completed) open();
        });
    }

    window.IStoriesWelcome = {
        open: open,
        close: close,
        reset: reset,
        isHomepage: isHomepage,
        storageKey: STORAGE_KEY
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', wireTriggers);
    } else {
        wireTriggers();
    }
})();
