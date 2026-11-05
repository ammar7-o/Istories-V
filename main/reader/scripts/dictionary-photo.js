/* ==========================================================================
   dictionary-photo.js — two-page dictionary popup: dictionary and images
   ==========================================================================
   The popup has two horizontal pages. Page one is the dictionary translation
   and its actions; page two is an image preview. On phones the pages are
   swiped left/right, while tabs and page dots are provided for mouse users.

   Images come from the Pixabay API (photos, illustrations, vectors and
   icons) and are shown in their own scroll-snap strip, also swipeable, with
   arrows and dots. Results tagged with women/girls are filtered out. The
   feature is deliberately optional: when the reader is offline, the API is
   unreachable, or no result is found, a small inline placeholder is shown.
   ========================================================================== */
(function () {
    'use strict';

    // NOTE: a key in client-side code is visible to anyone. Prefer proxying
    // requests through your own backend.
    var API_KEY = '58430811-e22c8fca303661c772d3dc7b9';
    var API_URL = 'https://pixabay.com/api/';

    // 'all' = photos + illustrations + vectors.
    // Or: 'photo' | 'illustration' | 'vector'
    var IMAGE_TYPE = 'all';

    // Also search Pixabay's "icons" category and reserve some slots for it.
    var INCLUDE_ICONS = true;
    var ICON_SLOTS = 2;

    // Ask for more than we show, because filtering removes some results.
    var PER_PAGE = 40;
    var MAX_PHOTOS = 6;

    var REQUEST_TIMEOUT = 8000;
    var CACHE_LIMIT = 40;

    // Results whose tags contain any of these words are hidden.
    var BLOCKED_TAGS = [
        'woman', 'women', 'girl', 'girls', 'female', 'females', 'lady',
        'ladies', 'mother', 'mom', 'mum', 'bride', 'wife', 'actress',
        'feminine', 'bikini', 'lingerie', 'schoolgirl', 'businesswoman',
        'sportswoman', 'waitress', 'princess', 'queen'
    ];
    var BLOCKED_RE = new RegExp('\\b(?:' + BLOCKED_TAGS.join('|') + ')\\b', 'i');

    var STOP_WORDS = {
        a: 1, an: 1, the: 1, of: 1, to: 1, and: 1, or: 1, in: 1, on: 1,
        at: 1, is: 1, are: 1, was: 1, were: 1, be: 1, been: 1, being: 1,
        this: 1, that: 1, these: 1, those: 1, it: 1, its: 1, his: 1, her: 1,
        their: 1, our: 1, your: 1, my: 1, i: 1, you: 1, he: 1, she: 1,
        we: 1, they: 1, as: 1, with: 1, for: 1, from: 1, by: 1, but: 1,
        not: 1, no: 1, yes: 1, some: 1, any: 1
    };

    var els = {
        section: document.getElementById('dictionaryPhoto'),
        track: document.getElementById('dictionaryPhotoTrack'),
        frame: document.querySelector('#dictionaryPhoto .dictionary-photo-frame'),
        status: document.getElementById('dictionaryPhotoStatus'),
        statusIcon: document.getElementById('dictionaryPhotoStatusIcon'),
        statusText: document.getElementById('dictionaryPhotoStatusText'),
        prev: document.getElementById('dictionaryPhotoPrev'),
        next: document.getElementById('dictionaryPhotoNext'),
        dots: document.getElementById('dictionaryPhotoDots'),
        tabs: document.querySelectorAll('.dictionary-tab'),
        pager: document.getElementById('dictionaryPager'),
        pagerTrack: document.getElementById('dictionaryPagerTrack'),
        pages: document.querySelectorAll('.dictionary-page'),
        pagerDots: document.querySelectorAll('.dictionary-pager-dot')
    };

    if (!els.section || !els.track || !els.frame) return;

    var state = {
        word: '',
        term: '',
        slides: [],
        index: 0,
        pageIndex: 0,
        status: 'idle',
        statusKey: 'reader.photoSelectWord',
        statusFallback: 'Select a word to see photos.'
    };
    var photoCache = Object.create(null);
    var cacheOrder = [];
    var activeController = null;
    var requestToken = 0;
    var scrollFrame = 0;
    var pageScrollTimer = 0;
    var heightFrame = 0;
    var resizeFrame = 0;
    var lastViewportWidth = window.innerWidth;

    function translate(key, fallback, vars) {
        var value = window.IStoriesI18n && typeof window.IStoriesI18n.t === 'function'
            ? window.IStoriesI18n.t(key, vars)
            : key;
        if (!value || value === key) return fallback;
        return value;
    }

    function stripHtml(value) {
        if (!value) return '';
        try {
            var doc = new DOMParser().parseFromString(String(value), 'text/html');
            return (doc.body.textContent || '').replace(/\s+/g, ' ').trim();
        } catch (error) {
            return String(value).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
        }
    }

    function cleanText(value) {
        return stripHtml(value)
            .replace(/[\u064B-\u065F\u0670]/g, '')
            .replace(/^[\s"'“”«».,;:!?()[\]{}]+|[\s"'“”«».,;:!?()[\]{}]+$/g, '')
            .replace(/\s+/g, ' ')
            .trim();
    }

    function isLatin(text) {
        return /[A-Za-z\u00C0-\u024F]/.test(text);
    }

    function withoutStopWords(text) {
        var tokens = text.split(/\s+/).filter(Boolean);
        var kept = tokens.filter(function (token) {
            return !STOP_WORDS[token.toLowerCase().replace(/[^\w'-]/g, '')];
        });
        return (kept.length ? kept : tokens).slice(0, 4).join(' ');
    }

    /* Translations often hold several meanings ("dog, hound; canine").
       Use only the first one for the image search. */
    function firstSense(text) {
        return cleanText(String(text || '').split(/[,;/،؛|\n]/)[0]);
    }

    /* Pixabay's keyword search works best with English / Latin-script words:
       prefer the Latin side (word or translation), otherwise whatever exists. */
    function pickSearchTerm(word, translation) {
        var w = firstSense(word);
        var t = firstSense(translation);
        var chosen = isLatin(w) ? w : (isLatin(t) ? t : (w || t));
        return withoutStopWords(chosen).slice(0, 100); // Pixabay: q max 100 chars
    }

    function remember(term, slides) {
        if (!term) return;
        if (!photoCache[term]) cacheOrder.push(term);
        photoCache[term] = slides;
        while (cacheOrder.length > CACHE_LIMIT) {
            var oldest = cacheOrder.shift();
            delete photoCache[oldest];
        }
    }

    /* --- Two-page pager: dictionary page and image page ------------------ */
    function pageCount() {
        return els.pages ? els.pages.length : 0;
    }

    function syncPagerHeight() {
        if (!els.pagerTrack || !pageCount()) return;
        // The popup can be display:none while closed; measuring then would
        // collapse the pager to zero height.
        if (!els.pagerTrack.clientWidth) return;

        var page = els.pages[state.pageIndex];
        if (!page) return;
        var height = page.offsetHeight;
        if (!height) return;
        els.pagerTrack.style.height = height + 'px';
    }

    function schedulePagerHeight() {
        if (heightFrame) return;
        heightFrame = window.requestAnimationFrame(function () {
            heightFrame = 0;
            syncPagerHeight();
        });
    }

    function updatePageUi() {
        Array.prototype.forEach.call(els.tabs, function (tab, index) {
            var active = index === state.pageIndex;
            tab.classList.toggle('is-active', active);
            tab.setAttribute('aria-selected', active ? 'true' : 'false');
        });

        Array.prototype.forEach.call(els.pagerDots, function (dot, index) {
            var active = index === state.pageIndex;
            dot.classList.toggle('is-active', active);
            if (active) {
                dot.setAttribute('aria-current', 'true');
            } else {
                dot.removeAttribute('aria-current');
            }
        });

        Array.prototype.forEach.call(els.pages, function (page, index) {
            var active = index === state.pageIndex;
            if ('inert' in page) page.inert = !active;
            if (active) {
                page.removeAttribute('aria-hidden');
            } else {
                page.setAttribute('aria-hidden', 'true');
            }
        });
    }

    function setPage(index, options) {
        var count = pageCount();
        if (!count) return;
        options = options || {};
        index = Math.max(0, Math.min(count - 1, index));
        state.pageIndex = index;
        updatePageUi();
        schedulePagerHeight();

        if (!options.fromScroll && els.pagerTrack) {
            els.pagerTrack.scrollTo({
                left: index * els.pagerTrack.clientWidth,
                behavior: options.instant ? 'auto' : 'smooth'
            });
        }
    }

    function bindPageControl(control) {
        if (!control) return;
        control.addEventListener('click', function () {
            setPage(Number(this.dataset.dictionaryPage) || 0);
        });
    }

    function syncPageFromScroll() {
        if (!els.pagerTrack) return;
        var width = els.pagerTrack.clientWidth;
        if (!width) return;
        var index = Math.round(els.pagerTrack.scrollLeft / width);
        index = Math.max(0, Math.min(pageCount() - 1, index));
        if (index !== state.pageIndex) {
            setPage(index, { fromScroll: true, instant: true });
        }
    }

    function schedulePageFromScroll() {
        if (pageScrollTimer) window.clearTimeout(pageScrollTimer);
        pageScrollTimer = window.setTimeout(function () {
            pageScrollTimer = 0;
            syncPageFromScroll();
        }, 90);
    }

    function handleTabKeydown(event) {
        if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return;
        var key = event.key;
        if (key !== 'ArrowLeft' && key !== 'ArrowRight' && key !== 'Home' && key !== 'End') return;

        var tabs = Array.prototype.slice.call(els.tabs);
        var current = tabs.indexOf(document.activeElement);
        if (current < 0) current = state.pageIndex;

        var next;
        if (key === 'Home') next = 0;
        else if (key === 'End') next = tabs.length - 1;
        else next = (current + (key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;

        setPage(next);
        if (tabs[next]) tabs[next].focus();
        event.preventDefault();
    }

    function handlePagerKeydown(event) {
        if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return;
        if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;

        var target = event.target;
        if (target && target.closest && target.closest('button, a, input, textarea, select')) return;

        setPage(state.pageIndex + (event.key === 'ArrowRight' ? 1 : -1));
        event.preventDefault();
    }

    function handleResize() {
        if (window.innerWidth === lastViewportWidth) return;
        lastViewportWidth = window.innerWidth;
        if (resizeFrame) return;

        resizeFrame = window.requestAnimationFrame(function () {
            resizeFrame = 0;
            updateNav();
            if (els.pagerTrack) {
                els.pagerTrack.scrollLeft = state.pageIndex * els.pagerTrack.clientWidth;
            }
            if (els.track) {
                els.track.scrollLeft = state.index * els.track.clientWidth;
            }
            syncPagerHeight();
        });
    }

    function setStatus(kind, key, fallback) {
        state.status = kind;
        state.statusKey = key;
        state.statusFallback = fallback;

        if (els.status) {
            els.status.hidden = kind === 'ready';
            els.status.className = 'dictionary-photo-status is-' + kind;
        }
        if (els.statusText) {
            els.statusText.textContent = translate(key, fallback);
        }
        if (els.statusIcon) {
            var icon = kind === 'loading' ? 'fa-image' :
                (kind === 'offline' ? 'fa-wifi' :
                    (kind === 'error' ? 'fa-triangle-exclamation' : 'fa-image'));
            els.statusIcon.className = 'fas ' + icon;
        }
        schedulePagerHeight();
    }

    /* --- Pixabay ---------------------------------------------------------- */
    function imageUrlIsSafe(url) {
        return typeof url === 'string' && /^https:\/\/[^/]+\//i.test(url);
    }

    function isBlocked(item) {
        return BLOCKED_RE.test(String(item.tags || ''));
    }

    /* Convert API hits to slides. Hits tagged with a blocked word are dropped. */
    function parsePhotos(payload) {
        var hits = payload && payload.hits;
        if (!Array.isArray(hits)) return [];

        return hits
            .map(function (item) {
                if (!item || isBlocked(item)) return null;

                var src = item.webformatURL || item.previewURL;
                if (!imageUrlIsSafe(src)) return null;

                var fallback = item.largeImageURL || item.previewURL || '';
                if (fallback === src || !imageUrlIsSafe(fallback)) fallback = '';

                return {
                    id: item.id,
                    src: src,
                    fallback: fallback,
                    caption: cleanText(item.tags).slice(0, 140),
                    credit: cleanText(item.user).slice(0, 100),
                    license: 'Pixabay'
                };
            })
            .filter(Boolean);
    }

    function buildUrl(term, extra) {
        var params = {
            key: API_KEY,
            q: term,
            image_type: IMAGE_TYPE,
            safesearch: 'true',
            per_page: String(PER_PAGE)
        };
        for (var name in extra) {
            if (Object.prototype.hasOwnProperty.call(extra, name)) params[name] = extra[name];
        }
        return API_URL + '?' + new URLSearchParams(params).toString();
    }

    /* Fetch JSON with a timeout and one retry on network error, 429 or 5xx. */
    function fetchJson(url, token) {
        function attempt(remaining) {
            if (activeController) activeController.abort();
            var controller = typeof AbortController === 'function' ? new AbortController() : null;
            activeController = controller;

            var options = { credentials: 'omit' };
            var timeout = 0;
            if (controller) {
                options.signal = controller.signal;
                timeout = window.setTimeout(function () {
                    controller.abort();
                }, REQUEST_TIMEOUT);
            }

            return fetch(url, options)
                .then(function (response) {
                    if (!response.ok) {
                        var error = new Error('Photo request failed: ' + response.status);
                        error.status = response.status;
                        throw error;
                    }
                    return response.json();
                })
                .catch(function (error) {
                    var retryable = !error.status || error.status === 429 || error.status >= 500;
                    if (remaining > 0 && retryable && token === requestToken) {
                        return new Promise(function (resolve) {
                            window.setTimeout(resolve, 1200);
                        }).then(function () {
                            // The reader may have picked another word while
                            // waiting; do not abort that newer request.
                            if (token !== requestToken) {
                                throw new Error('Photo request cancelled');
                            }
                            return attempt(remaining - 1);
                        });
                    }
                    throw error;
                })
                .finally(function () {
                    if (timeout) window.clearTimeout(timeout);
                });
        }
        return attempt(1);
    }

    function containsId(list, id) {
        return list.some(function (item) { return item.id === id; });
    }

    /* Main search (all types) + optional icons search, merged so a few slots
       are always icons when any exist. */
    function requestPhotos(term, token) {
        return fetchJson(buildUrl(term, {}), token)
            .then(parsePhotos)
            .then(function (main) {
                if (!INCLUDE_ICONS || token !== requestToken) {
                    return main.slice(0, MAX_PHOTOS);
                }

                // Icons are a bonus: if this request fails, keep the main results.
                return fetchJson(buildUrl(term, { category: 'icons' }), token)
                    .then(parsePhotos)
                    .catch(function () { return []; })
                    .then(function (icons) {
                        var reserved = Math.min(ICON_SLOTS, MAX_PHOTOS - 1);
                        var result = main.slice(0, MAX_PHOTOS - reserved);

                        var added = 0;
                        icons.forEach(function (icon) {
                            if (added < reserved && !containsId(result, icon.id)) {
                                result.push(icon);
                                added += 1;
                            }
                        });

                        // Fill any remaining slots with more of the main results.
                        main.forEach(function (item) {
                            if (result.length < MAX_PHOTOS && !containsId(result, item.id)) {
                                result.push(item);
                            }
                        });
                        return result;
                    });
            });
    }

    /* --- Image strip ------------------------------------------------------ */
    function resetNav() {
        if (els.frame) els.frame.classList.remove('has-multiple');
        if (els.dots) {
            els.dots.textContent = '';
            els.dots.classList.remove('has-dots');
        }
        if (els.prev) els.prev.disabled = true;
        if (els.next) els.next.disabled = true;
    }

    function updateNav() {
        var count = els.track.querySelectorAll('.dictionary-photo-slide').length;
        var multiple = count > 1;

        if (els.frame) els.frame.classList.toggle('has-multiple', multiple);
        if (els.prev) els.prev.disabled = state.index <= 0;
        if (els.next) els.next.disabled = state.index >= count - 1;

        if (!els.dots) return;
        if (!multiple) {
            els.dots.textContent = '';
            els.dots.classList.remove('has-dots');
            return;
        }

        els.dots.classList.add('has-dots');
        if (els.dots.childElementCount !== count) {
            els.dots.textContent = '';
            for (var i = 0; i < count; i += 1) {
                var dot = document.createElement('button');
                dot.type = 'button';
                dot.className = 'dictionary-photo-dot';
                dot.dataset.index = String(i);
                dot.setAttribute('aria-label', translate('reader.photoNumber', 'Photo {number}', { number: i + 1 }));
                dot.addEventListener('click', function () {
                    goTo(Number(this.dataset.index));
                });
                els.dots.appendChild(dot);
            }
        }
        Array.prototype.forEach.call(els.dots.children, function (dot, index) {
            if (index === state.index) {
                dot.setAttribute('aria-current', 'true');
            } else {
                dot.removeAttribute('aria-current');
            }
            dot.setAttribute('aria-label', translate('reader.photoNumber', 'Photo {number}', { number: index + 1 }));
        });
    }

    function goTo(index) {
        var count = els.track.querySelectorAll('.dictionary-photo-slide').length;
        if (!count) return;
        state.index = Math.max(0, Math.min(count - 1, index));
        els.track.scrollTo({
            left: state.index * els.track.clientWidth,
            behavior: 'smooth'
        });
        updateNav();
    }

    function removeBrokenSlide(slide) {
        if (!slide || !slide.parentNode) return;
        slide.parentNode.removeChild(slide);
        var count = els.track.querySelectorAll('.dictionary-photo-slide').length;
        if (!count) {
            state.slides = [];
            state.index = 0;
            resetNav();
            setStatus('empty', 'reader.photoEmpty', 'No photo found for this word.');
            return;
        }
        state.index = Math.min(state.index, count - 1);
        updateNav();
    }

    function renderSlides(slides) {
        els.track.textContent = '';
        state.slides = slides || [];
        state.index = 0;
        resetNav();

        if (!slides || !slides.length) {
            setStatus('empty', 'reader.photoEmpty', 'No photo found for this word.');
            return;
        }

        var token = requestToken;
        slides.forEach(function (photo, index) {
            var figure = document.createElement('figure');
            figure.className = 'dictionary-photo-slide';
            figure.dataset.index = String(index);

            var img = document.createElement('img');
            img.src = photo.src;
            img.alt = photo.caption || state.word || 'Photo';
            img.loading = index === 0 ? 'eager' : 'lazy';
            img.decoding = 'async';
            img.draggable = false;
            img.addEventListener('error', function () {
                if (token !== requestToken) return;
                if (photo.fallback && img.dataset.fallbackTried !== '1') {
                    img.dataset.fallbackTried = '1';
                    img.src = photo.fallback;
                    return;
                }
                removeBrokenSlide(figure);
            });

            var caption = document.createElement('figcaption');
            caption.className = 'dictionary-photo-caption';
            if (typeof window.detectTextDirection === 'function') {
                caption.dir = window.detectTextDirection(photo.caption, 'en');
            }

            var title = document.createElement('strong');
            title.textContent = photo.caption || state.word;
            caption.appendChild(title);

            if (photo.credit || photo.license) {
                var credit = document.createElement('span');
                credit.className = 'dictionary-photo-credit';
                credit.textContent = [photo.credit, photo.license].filter(Boolean).join(' · ');
                caption.appendChild(credit);
            }

            figure.appendChild(img);
            figure.appendChild(caption);
            els.track.appendChild(figure);
        });

        els.track.scrollLeft = 0;
        setStatus('ready', 'reader.photoPreview', 'Photo preview');
        updateNav();
        schedulePagerHeight();
    }

    function stopRequest() {
        requestToken += 1;
        if (activeController) {
            activeController.abort();
            activeController = null;
        }
    }

    function show(word, translation) {
        if (!els.section) return;
        var term = pickSearchTerm(word, translation);
        if (!term) {
            hide();
            return;
        }

        els.section.hidden = false;
        state.word = cleanText(word);
        state.status = 'idle';

        if (state.term === term && state.slides.length) {
            setStatus('ready', 'reader.photoPreview', 'Photo preview');
            updateNav();
            schedulePagerHeight();
            return;
        }

        stopRequest();
        state.term = term;
        els.track.textContent = '';
        state.slides = [];
        state.index = 0;
        resetNav();
        setStatus('loading', 'reader.photoFinding', 'Finding a photo…');

        if (photoCache[term]) {
            renderSlides(photoCache[term]);
            return;
        }

        if (navigator.onLine === false) {
            setStatus('offline', 'reader.photoOffline', 'Photos need an internet connection.');
            return;
        }

        var token = requestToken;
        requestPhotos(term, token)
            .then(function (slides) {
                if (token !== requestToken) return;
                remember(term, slides);
                renderSlides(slides);
            })
            .catch(function (error) {
                if (token !== requestToken) return;
                if (error && error.name === 'AbortError' && requestToken !== token) return;
                console.error('Pixabay error:', error);
                if (navigator.onLine === false) {
                    setStatus('offline', 'reader.photoOffline', 'Photos need an internet connection.');
                } else {
                    setStatus('error', 'reader.photoError', 'Photo unavailable right now.');
                }
            });
    }

    function hide() {
        stopRequest();
        state.word = '';
        state.term = '';
        state.slides = [];
        state.index = 0;
        els.track.textContent = '';
        resetNav();
        setStatus('idle', 'reader.photoSelectWord', 'Select a word to see photos.');
        setPage(0, { instant: true });
    }

    /* --- Wiring ----------------------------------------------------------- */
    if (els.track) {
        els.track.addEventListener('scroll', function () {
            if (scrollFrame) return;
            scrollFrame = window.requestAnimationFrame(function () {
                scrollFrame = 0;
                var width = els.track.clientWidth;
                if (!width) return;
                var index = Math.round(els.track.scrollLeft / width);
                var count = els.track.querySelectorAll('.dictionary-photo-slide').length;
                index = Math.max(0, Math.min(count - 1, index));
                if (index !== state.index) {
                    state.index = index;
                    updateNav();
                }
            });
        }, { passive: true });
    }

    if (els.prev) {
        els.prev.addEventListener('click', function () { goTo(state.index - 1); });
    }
    if (els.next) {
        els.next.addEventListener('click', function () { goTo(state.index + 1); });
    }

    Array.prototype.forEach.call(els.tabs, function (tab) {
        bindPageControl(tab);
        tab.addEventListener('keydown', handleTabKeydown);
    });
    Array.prototype.forEach.call(els.pagerDots, bindPageControl);

    if (els.pager) {
        els.pager.addEventListener('keydown', handlePagerKeydown);
    }
    if (els.pagerTrack) {
        els.pagerTrack.addEventListener('scroll', schedulePageFromScroll, { passive: true });
    }

    if (typeof ResizeObserver === 'function' && pageCount()) {
        var pageObserver = new ResizeObserver(function () {
            schedulePagerHeight();
        });
        Array.prototype.forEach.call(els.pages, function (page) {
            pageObserver.observe(page);
        });
    }

    window.addEventListener('resize', handleResize);

    setPage(0, { instant: true });
    setStatus('idle', 'reader.photoSelectWord', 'Select a word to see photos.');

    document.addEventListener('ist-language-change', function () {
        if (state.status !== 'ready') {
            setStatus(state.status, state.statusKey, state.statusFallback);
        }
        updateNav();
        schedulePagerHeight();
    });

    window.IStoriesDictionaryPhoto = {
        show: show,
        hide: hide,
        refresh: function () {
            if (els.pagerTrack) {
                els.pagerTrack.scrollLeft = state.pageIndex * els.pagerTrack.clientWidth;
            }
            syncPagerHeight();
            schedulePagerHeight();
            updateNav();
        }
    };
}());