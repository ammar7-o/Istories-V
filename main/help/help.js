/* ==========================================================================
   Help & Guide page behaviour
   ==========================================================================
   1. Marks the guide as seen (the inline script also does this before paint).
   2. Shows a short welcome banner when a new user is redirected from the
      Story Library (`?from=library`).
   3. Keeps the table of contents in sync and draws a reading-progress bar.
   4. Switches the video captions with the interface language.
   5. Wires the "Print / save as PDF" action.
   ========================================================================== */
(function () {
    'use strict';

    var SEEN_KEY = 'istories_guide_seen_v1';

    function rememberSeen() {
        try { localStorage.setItem(SEEN_KEY, 'true'); } catch (error) { /* ignore */ }
        try { sessionStorage.setItem(SEEN_KEY, 'true'); } catch (error) { /* ignore */ }
    }

    function params() {
        try { return new URLSearchParams(location.search); } catch (error) { return null; }
    }

    /* ----------------------------------------------------------------------
       New-user banner
       ---------------------------------------------------------------------- */
    function setupWelcome() {
        var banner = document.getElementById('guideNew');
        if (!banner) return;

        var query = params();
        if (!query || query.get('from') !== 'library') return;

        banner.hidden = false;
        rememberSeen();

        var dismiss = banner.querySelector('[data-guide-dismiss]');
        if (!dismiss) return;

        dismiss.addEventListener('click', function () {
            banner.hidden = true;
            rememberSeen();
            try {
                var url = new URL(location.href);
                url.searchParams.delete('from');
                history.replaceState(null, '', url);
            } catch (error) { /* ignore */ }
        });
    }

    /* ----------------------------------------------------------------------
       Print
       ---------------------------------------------------------------------- */
    function setupPrint() {
        var buttons = document.querySelectorAll('[data-guide-print]');
        Array.prototype.forEach.call(buttons, function (button) {
            button.addEventListener('click', function () {
                rememberSeen();
                window.print();
            });
        });
    }

    /* ----------------------------------------------------------------------
       Reading progress + active section
       ---------------------------------------------------------------------- */
    function setupProgress() {
        var bar = document.getElementById('guideProgress');
        var links = Array.prototype.slice.call(document.querySelectorAll('.guide-toc__grid a[href^="#"]'));
        var sections = links.map(function (link) {
            return document.getElementById(link.getAttribute('href').slice(1));
        }).filter(Boolean);

        if (!bar && !links.length) return;

        var ticking = false;

        function update() {
            ticking = false;
            var doc = document.documentElement;
            var max = Math.max(0, doc.scrollHeight - window.innerHeight);
            var progress = max ? Math.min(100, Math.max(0, (window.scrollY / max) * 100)) : 0;
            if (bar) bar.style.width = progress.toFixed(2) + '%';

            if (!links.length) return;
            var marker = window.scrollY + Math.max(120, window.innerHeight * 0.22);
            var active = null;
            sections.forEach(function (section, index) {
                if (section.offsetTop <= marker) active = index;
            });
            // At the very bottom, select the last section even if its top is
            // below the marker.
            if (max && window.scrollY >= max - 4) active = sections.length - 1;

            links.forEach(function (link, index) {
                var on = index === active;
                link.classList.toggle('is-active', on);
                if (on) link.setAttribute('aria-current', 'true');
                else link.removeAttribute('aria-current');
            });
        }

        function requestUpdate() {
            if (ticking) return;
            ticking = true;
            window.requestAnimationFrame(update);
        }

        window.addEventListener('scroll', requestUpdate, { passive: true });
        window.addEventListener('resize', requestUpdate);
        update();
    }

    /* ----------------------------------------------------------------------
       Video captions follow the interface language
       ---------------------------------------------------------------------- */
    function setupCaptions() {
        var video = document.querySelector('.guide-video video');
        if (!video || !video.textTracks) return;

        function sync() {
            var lang = (window.IStoriesI18n && window.IStoriesI18n.language === 'ar') ? 'ar' : 'en';
            Array.prototype.forEach.call(video.textTracks, function (track) {
                if (track.kind !== 'captions') return;
                track.mode = (track.language || '').toLowerCase().indexOf(lang) === 0 ? 'showing' : 'disabled';
            });
        }

        video.addEventListener('loadedmetadata', sync);
        document.addEventListener('ist-language-change', sync);
        sync();
    }

    /* ----------------------------------------------------------------------
       Init
       ---------------------------------------------------------------------- */
    function init() {
        rememberSeen();
        setupWelcome();
        setupPrint();
        setupProgress();
        setupCaptions();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
