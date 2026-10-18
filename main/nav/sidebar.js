/**
 * IStories — shared sidebar navigation
 * ====================================
 *
 * Classic script (works with a plain <script> tag, no bundler). Include it once
 * per page:
 *
 *     <link rel="stylesheet" href="<rel>/nav/sidebar.css">
 *     <script src="<rel>/nav/sidebar.js" defer></script>
 *
 * What it does
 * ------------
 * 1. Removes the per-page dropdown menu (`#more`) that used to be duplicated in
 *    every stylesheet, and renders one consistent, accessible sidebar instead.
 * 2. Reuses the page's existing `#toggle-nav` button as the sidebar trigger.
 *    Pages without one (root landing page, reader) get an injected burger.
 * 3. Computes every link relative to the site root, so the same file works on
 *    every page without per-page link lists.
 * 4. Marks the current page as active and supports "action" items
 *    (Theme / Top) as well as real page links (Stories Studio, Profile).
 *
 * The item list can be customised per page before this script runs:
 *
 *     <script>window.ISTORIES_SIDEBAR = { items: [...] };</script>
 */
(function () {
    'use strict';

    var scriptEl = document.currentScript || (function () {
        var all = document.getElementsByTagName('script');
        return all[all.length - 1];
    })();

    // nav/sidebar.js lives at <root>/nav/, so the parent directory is the root.
    var rootUrl = new URL('../../', new URL(scriptEl.src, document.baseURI));
    function url(relative) {
        return new URL(relative, rootUrl).href;
    }

    var DEFAULT_CONFIG = {
        brand: { label: 'IStories', logo: 'icon.svg', href: '' },
        sections: [
            {
                title: null,
                items: [
                    { key: 'home', label: 'Home', icon: 'fa-solid fa-house', path: '' }
                ]
            },
            {
                title: 'Learn',
                items: [
                    { key: 'stories', label: 'Story Library', icon: 'fa-solid fa-book-open', path: 'main/index.html' },
                    { key: 'vocabulary', label: 'Vocabulary', icon: 'fa-solid fa-language', path: 'main/vocabulary/index.html' },
                    { key: 'flashcard', label: 'Flashcards', icon: 'fa-solid fa-layer-group', path: 'main/flashcard/index.html' },
                    { key: 'quiz', label: 'Quiz', icon: 'fa-solid fa-brain', path: 'main/quiz/index.html' }
                ]
            },
            {
                title: 'Create',
                items: [
                    { key: 'addStories', label: 'Stories Studio', icon: 'fa-solid fa-circle-plus', path: 'main/storiesStudio/index.html' },
                    { key: 'profile', label: 'Profile', icon: 'fa-solid fa-user', path: 'main/profile/index.html' }
                ]
            },
            {
                title: 'Discover',
                items: [
                    { key: 'store', label: 'Story Store', icon: 'fa-solid fa-store', path: 'store/index.html' },
                    { key: 'tools', label: 'Tools', icon: 'fa-solid fa-screwdriver-wrench', path: 'tools/index.html' }
                ]
            },
            {
                title: 'Translation',
                items: [
                    { key: 'csvTranslator', label: 'CSV → Dictionary', icon: 'fa-solid fa-right-left', path: 'tools/All-tools/translator.html' },
                    { key: 'analyzer', label: 'Text Analyzer', icon: 'fa-solid fa-magnifying-glass-chart', path: 'tools/All-tools/Analyzer.html' }
                ]
            },
            {
                title: 'System',
                items: [
                    { key: 'settings', label: 'Settings', icon: 'fa-solid fa-gear', path: 'main/settings/index.html' }
                ]
            }
        ],
        footer: [
            { key: 'theme', label: 'Theme', icon: 'fa-solid fa-moon', action: '#theme' },
            { key: 'top', label: 'Top', icon: 'fa-solid fa-arrow-up', action: '#top' }
        ]
    };

    function mergeConfig(base, override) {
        if (!override) return base;
        var merged = Object.assign({}, base, override);
        // Shallow merge the pieces people are most likely to override.
        merged.brand = Object.assign({}, base.brand, override.brand);
        return merged;
    }

    function icon(name) {
        return '<i class="' + name + '" aria-hidden="true"></i>';
    }

    // --- Active detection ------------------------------------------------- //
    function normalize(path) {
        return String(path || '')
            .replace(/\/index\.html$/, '')
            .replace(/\/+$/, '');
    }

    function currentPath() {
        return normalize(location.pathname);
    }

    function hrefPath(href) {
        try {
            return normalize(new URL(href, document.baseURI).pathname);
        } catch (error) {
            return '';
        }
    }

    function isActive(item, config) {
        if (item.action) {
            return location.hash === '#' + item.action;
        }
        var target = hrefPath(resolveHref(item, config));
        var here = currentPath();
        if (!item.path) {
            // "Home" is the site root.
            return here === target;
        }
        return here === target;
    }

    // --- Link resolution -------------------------------------------------- //
    function resolveHref(item, config) {
        if (item.href) return item.href;
        if (item.action) return url('main/index.html') + '#' + item.action;
        if (item.path) return url(item.path);
        return url('');
    }

    // --- DOM building ----------------------------------------------------- //
    var sidebar;
    var overlay;
    var lastFocused = null;

    function buildSidebar(config) {
        overlay = document.createElement('div');
        overlay.className = 'ist-overlay';
        overlay.setAttribute('tabindex', '-1');

        sidebar = document.createElement('aside');
        sidebar.className = 'ist-sidebar';
        sidebar.id = 'istories-sidebar';
        sidebar.setAttribute('aria-hidden', 'true');
        sidebar.setAttribute('aria-label', 'Main navigation');

        var sectionsHtml = '';
        config.sections.forEach(function (section) {
            if (section.title) {
                sectionsHtml += '<div class="ist-sidebar__section">' + escapeHtml(section.title) + '</div>';
            }
            section.items.forEach(function (item) {
                sectionsHtml += renderLink(item, config);
            });
        });

        var footerHtml = '';
        if (config.footer && config.footer.length) {
            footerHtml = '<div class="ist-sidebar__foot">' + config.footer.map(function (item) {
                return '<button type="button" class="ist-sidebar__action" title="' + escapeHtml(item.label) +
                    '" data-ist-action="' +
                    escapeHtml(item.action || '') + '">' + icon(item.icon) +
                    '<span>' + escapeHtml(item.label) + '</span></button>';
            }).join('') + '</div>';
        }

        sidebar.innerHTML =
            '<div class="ist-sidebar__head">' +
            '  <a class="ist-sidebar__brand" href="' + resolveHref(config.brand, config) + '" title="' + escapeHtml(config.brand.label) + '">' +
            '    <img src="' + url(config.brand.logo) + '" alt="">' +
            '    <span>' + escapeHtml(config.brand.label) + '</span>' +
            '  </a>' +
            '  <button type="button" class="ist-sidebar__collapse" data-ist-collapse ' +
            '    aria-label="Collapse navigation" aria-expanded="true" aria-controls="istories-sidebar" title="Collapse navigation">' +
            '    <i class="fa-solid fa-ellipsis-vertical"></i>' +
            '  </button>' +
            '  <button type="button" class="ist-sidebar__close" data-ist-close aria-label="Close navigation">' +
            '    <i class="fa-solid fa-xmark"></i>' +
            '  </button>' +
            '</div>' +
            '<nav class="ist-sidebar__nav">' + sectionsHtml + '</nav>' +
            footerHtml;

        document.body.appendChild(overlay);
        document.body.appendChild(sidebar);
    }

    function renderLink(item, config) {
        var href = resolveHref(item, config);
        var active = isActive(item, config);
        var classes = 'ist-sidebar__link' + (item.child ? ' is-child' : '') +
            (active ? ' is-active' : '');
        return '<a class="' + classes + '" href="' + href + '"' +
            (item.action ? ' data-ist-action="' + escapeHtml(item.action) + '"' : '') +
            ' title="' + escapeHtml(item.label) + '"' +
            (active ? ' aria-current="page"' : '') + '>' +
            icon(item.icon) + '<span>' + escapeHtml(item.label) + '</span></a>';
    }

    function escapeHtml(value) {
        return String(value == null ? '' : value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    // --- Triggers --------------------------------------------------------- //
    function findTriggers() {
        var nodes = Array.prototype.slice.call(
            document.querySelectorAll('#toggle-nav, .ist-burger')
        );
        // Some pages mark both a <li> and its inner <a> with id="toggle-nav".
        // Keep only the outermost element so a click cannot toggle twice
        // (open on the <a>, then close again while bubbling to the <li>).
        return nodes.filter(function (node) {
            var parent = node.parentElement;
            while (parent) {
                if (parent.matches && parent.matches('#toggle-nav, .ist-burger')) return false;
                parent = parent.parentElement;
            }
            return true;
        });
    }

    function injectBurger() {
        var burger = document.createElement('button');
        burger.type = 'button';
        burger.className = 'ist-burger';
        burger.setAttribute('aria-label', 'Open navigation');
        burger.setAttribute('aria-controls', 'istories-sidebar');
        burger.innerHTML = '<i class="fa-solid fa-bars"></i>';

        var host = document.querySelector('.ist-header__inner') ||
            document.querySelector('header .header-actions') ||
            document.querySelector('header .header-content') ||
            document.querySelector('header');
        if (host) {
            host.insertBefore(burger, host.firstChild);
        } else {
            burger.classList.add('ist-burger--floating');
            document.body.appendChild(burger);
        }
        return burger;
    }

    // --- Desktop docking & collapse -------------------------------------- //
    var DOCK_QUERY = '(min-width: 900px)';
    var COLLAPSE_KEY = 'sidebarCollapsed';
    var mql = window.matchMedia ? window.matchMedia(DOCK_QUERY) : null;

    function isDocked() {
        return mql ? mql.matches : (window.innerWidth >= 900);
    }

    function isCollapsed() {
        return document.body.classList.contains('ist-collapsed');
    }

    function updateCollapseHandle() {
        var btn = sidebar && sidebar.querySelector('[data-ist-collapse]');
        if (!btn) return;
        var collapsed = isCollapsed();
        btn.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
        var label = collapsed ? 'Expand navigation' : 'Collapse navigation';
        btn.setAttribute('aria-label', label);
        btn.setAttribute('title', label);
    }

    function setCollapsed(collapsed, persist) {
        document.body.classList.toggle('ist-collapsed', !!collapsed);
        updateCollapseHandle();
        if (persist) {
            try {
                localStorage.setItem(COLLAPSE_KEY, collapsed ? 'true' : 'false');
            } catch (error) { /* private mode — ignore */ }
        }
    }

    function storedCollapsed() {
        try {
            return localStorage.getItem(COLLAPSE_KEY) === 'true';
        } catch (error) {
            return false;
        }
    }

    // --- Open / close (mobile drawer only) ------------------------------- //
    function open() {
        if (!sidebar || isDocked()) return;
        lastFocused = document.activeElement;
        sidebar.classList.add('ist-open');
        overlay.classList.add('ist-open');
        sidebar.setAttribute('aria-hidden', 'false');
        document.body.classList.add('ist-sidebar-open');
        var closeBtn = sidebar.querySelector('[data-ist-close]');
        if (closeBtn) closeBtn.focus();
    }

    function close() {
        if (!sidebar || isDocked()) return;
        sidebar.classList.remove('ist-open');
        overlay.classList.remove('ist-open');
        sidebar.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('ist-sidebar-open');
        if (lastFocused && lastFocused.focus) lastFocused.focus();
    }

    function toggle() {
        // Docked: the handle collapses to the icon rail instead.
        if (isDocked()) {
            setCollapsed(!isCollapsed(), true);
            return;
        }
        if (sidebar.classList.contains('ist-open')) close();
        else open();
    }

    function isOpen() {
        return !!sidebar && sidebar.classList.contains('ist-open');
    }

    // --- Dock (desktop) vs. drawer (mobile) ------------------------------ //
    var modeInitialised = false;
    var lastDocked = null;

    function applyMode() {
        if (!sidebar) return;
        var docked = isDocked();
        document.body.classList.toggle('ist-docked', docked);

        // Only reset state when the mode actually changes, so resizing within
        // the same mode never clobbers the user's collapse choice.
        if (modeInitialised && docked === lastDocked) return;
        modeInitialised = true;
        lastDocked = docked;

        // Drop any lingering drawer state either way.
        document.body.classList.remove('ist-sidebar-open');
        sidebar.classList.remove('ist-open');
        overlay.classList.remove('ist-open');

        if (docked) {
            sidebar.setAttribute('aria-hidden', 'false');
            setCollapsed(storedCollapsed(), false);
        } else {
            document.body.classList.remove('ist-collapsed');
            sidebar.setAttribute('aria-hidden', 'true');
            updateCollapseHandle();
        }
    }

    // --- Action items ----------------------------------------------------- //
    function runAction(action) {
        if (action === '#theme') {
            var themeBtn = document.getElementById('themeToggle');
            if (themeBtn) {
                themeBtn.click();
            } else {
                var dark = document.body.classList.toggle('dark-mode');
                localStorage.setItem('theme', dark ? 'dark' : 'light');
            }
            return true;
        }
        if (action === '#top') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return true;
        }
        // Legacy in-app page actions (kept for pages that still use them).
        // Stories Studio / Profile are real pages, so they are plain links.
        if (typeof window.switchPage === 'function' && document.getElementById(action)) {
            window.switchPage(action);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return true;
        }
        // data-page actions inside the current page.
        var target = document.querySelector('[data-page="' + action + '"]');
        if (target) {
            target.click();
            return true;
        }
        return false;
    }

    // --- Wiring ----------------------------------------------------------- //
    function wire(config) {
        // Retire the old dropdown menu.
        var legacy = document.getElementById('more');
        if (legacy) legacy.classList.add('ist-legacy-hidden');

        var triggers = findTriggers();
        if (!triggers.length) {
            triggers = [injectBurger()];
        }
        triggers.forEach(function (trigger) {
            trigger.classList.add('ist-burger');
            trigger.setAttribute('aria-controls', 'istories-sidebar');
            trigger.addEventListener('click', function (event) {
                event.preventDefault();
                event.stopPropagation();
                toggle();
            });
        });

        overlay.addEventListener('click', close);
        sidebar.querySelector('[data-ist-close]').addEventListener('click', close);

        // The "⋯" handle collapses/expands the docked sidebar.
        var collapseBtn = sidebar.querySelector('[data-ist-collapse]');
        if (collapseBtn) {
            collapseBtn.addEventListener('click', function () {
                setCollapsed(!isCollapsed(), true);
            });
        }

        // Close when a link is followed.
        sidebar.querySelectorAll('a.ist-sidebar__link').forEach(function (link) {
            link.addEventListener('click', function (event) {
                var action = link.getAttribute('data-ist-action');
                if (action && runAction(action)) {
                    event.preventDefault();
                }
                close();
            });
        });

        sidebar.querySelectorAll('[data-ist-action]').forEach(function (node) {
            if (node.tagName === 'A') return; // handled above
            node.addEventListener('click', function () {
                runAction(node.getAttribute('data-ist-action'));
                close();
            });
        });

        document.addEventListener('keydown', function (event) {
            if (event.key === 'Escape' && isOpen()) close();
        });

        // Legacy deep links (main/index.html#addStories / #profile-settings) now
        // point at the standalone pages.
        if (location.hash) {
            var hash = location.hash.slice(1);
            if (hash === 'addStories') {
                location.replace(url('main/storiesStudio/index.html'));
                return;
            }
            if (hash === 'profile-settings') {
                location.replace(url('main/profile/index.html'));
                return;
            }
        }
    }

    function init() {
        var config = mergeConfig(DEFAULT_CONFIG, window.ISTORIES_SIDEBAR);
        buildSidebar(config);
        wire(config);
        applyMode();

        if (mql) {
            if (mql.addEventListener) mql.addEventListener('change', applyMode);
            else if (mql.addListener) mql.addListener(applyMode);
        }
        window.addEventListener('resize', applyMode);

        window.IStoriesSidebar = {
            open: open,
            close: close,
            toggle: toggle,
            isOpen: isOpen,
            isDocked: isDocked,
            isCollapsed: isCollapsed,
            setCollapsed: setCollapsed,
            applyMode: applyMode,
            config: config,
        };
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
