/* ==========================================================================
   userdata.js — shared helpers for user stories and user dictionaries.

   All large user data (userStories, userDictionaries, currentReadingStory,
   ...) lives in IndexedDB through localForage (see nav/storage.js).  Pages can
   keep using the synchronous localStorage facade, but new code should prefer
   this module because it:
     • waits for IndexedDB hydration before reading,
     • resolves after the write has actually been committed (`flush()`),
     • keeps story source metadata (PDF / JS database / JSON / manual) in one
       place so the library, studio and reader agree on it,
     • deduplicates stories by a content signature rather than only by title.

   Load order on every page that uses it:

       <script src="nav/vendor/localforage.min.js"></script>
       <script src="nav/storage.js"></script>
       <script src="nav/userdata.js"></script>

   Classic script — exposes `window.IStoriesUserData`.
   ========================================================================== */
(function (global) {
    'use strict';

    var STORIES_KEY = 'userStories';
    var DICTIONARIES_KEY = 'userDictionaries';
    var READING_KEY = 'currentReadingStory';

    var scriptEl = document.currentScript;
    var READER_URL = scriptEl
        ? new URL('../reader/index.html', scriptEl.src).href
        : new URL('../reader/index.html', document.baseURI).href;

    var writeChain = Promise.resolve();

    /* ----------------------------------------------------------------------
       Low-level storage access
       ---------------------------------------------------------------------- */

    function storage() {
        return global.IStoriesStorage || null;
    }

    function readRaw(key) {
        var store = storage();
        try {
            if (store && typeof store.getItemSync === 'function') {
                return store.getItemSync(key);
            }
            return global.localStorage.getItem(key);
        } catch (error) {
            return null;
        }
    }

    function parseJson(raw, fallback) {
        if (raw === null || raw === undefined || raw === '') return fallback;
        try {
            var value = JSON.parse(raw);
            return value === null || value === undefined ? fallback : value;
        } catch (error) {
            console.warn('[IStories userdata] could not parse stored data:', error);
            return fallback;
        }
    }

    function readSync(key, fallback) {
        return parseJson(readRaw(key), fallback);
    }

    function writeRaw(key, value) {
        var store = storage();
        if (store) return store.setItem(key, value);
        try {
            global.localStorage.setItem(key, value);
        } catch (error) {
            console.warn('[IStories userdata] localStorage write failed:', error);
        }
        return Promise.resolve();
    }

    function removeRaw(key) {
        var store = storage();
        if (store) return store.removeItem(key);
        try {
            global.localStorage.removeItem(key);
        } catch (error) {
            console.warn('[IStories userdata] localStorage remove failed:', error);
        }
        return Promise.resolve();
    }

    function ready() {
        var store = storage();
        return store && store.ready ? store.ready : Promise.resolve();
    }

    function flush() {
        writeChain = writeChain.then(function () {
            var store = storage();
            return store && typeof store.flush === 'function' ? store.flush() : undefined;
        }).catch(function (error) {
            console.warn('[IStories userdata] flush failed:', error);
        });
        return writeChain;
    }

    /* ----------------------------------------------------------------------
       Generic helpers
       ---------------------------------------------------------------------- */

    function asArray(value) {
        if (Array.isArray(value)) return value;
        if (value === null || value === undefined) return [];
        return [value];
    }

    function trimText(value) {
        return String(value === null || value === undefined ? '' : value).trim();
    }

    function wordCount(content) {
        var text = Array.isArray(content) ? content.join(' ') : String(content || '');
        var words = text.replace(/<[^>]*>/g, ' ').trim().split(/\s+/).filter(Boolean);
        return words.length;
    }

    function normalizeContent(content) {
        if (Array.isArray(content)) {
            return content.map(function (paragraph) {
                return String(paragraph === null || paragraph === undefined ? '' : paragraph);
            }).filter(function (paragraph) {
                return trimText(paragraph) !== '';
            });
        }
        if (typeof content === 'string') {
            return content.split(/\r?\n+/).map(trimText).filter(Boolean);
        }
        return [];
    }

    function escapeHtml(value) {
        return String(value === null || value === undefined ? '' : value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function normalizeTags(tags) {
        if (Array.isArray(tags)) {
            return tags.map(trimText).filter(Boolean);
        }
        if (typeof tags === 'string') {
            return tags.split(',').map(trimText).filter(Boolean);
        }
        return [];
    }

    function mergeTags(a, b) {
        var seen = Object.create(null);
        return normalizeTags(a).concat(normalizeTags(b)).filter(function (tag) {
            var key = tag.toLowerCase();
            if (seen[key]) return false;
            seen[key] = true;
            return true;
        });
    }

    function fileExtension(name) {
        var match = String(name || '').toLowerCase().match(/\.([a-z0-9]+)(?:[?#].*)?$/);
        return match ? match[1] : '';
    }

    function baseName(path) {
        var clean = String(path || '').split(/[?#]/)[0];
        var parts = clean.split('/');
        return parts[parts.length - 1] || clean;
    }

    /**
     * Resolve a story asset (cover, audio, …) to a URL the current page can load.
     * Built-in database stories store paths relative to the main library page
     * (`main/index.html`), not relative to the Studio/reader pages that also
     * display them. Absolute/data/blob URLs pass through unchanged.
     */
    function resolveAssetUrl(path) {
        var raw = trimText(path);
        if (!raw) return '';
        if (/^(https?:|data:|blob:)/i.test(raw)) return raw;
        try {
            return new URL(raw, new URL('../index.html', document.baseURI)).href;
        } catch (error) {
            return raw;
        }
    }

    /* ----------------------------------------------------------------------
       Source metadata
       ---------------------------------------------------------------------- */

    var SOURCE_LABELS = {
        pdf: 'PDF import',
        js: 'Story database',
        json: 'JSON file',
        manual: 'Written in Studio',
        text: 'Pasted text',
        unknown: 'User story'
    };

    var SOURCE_ICONS = {
        pdf: 'fa-solid fa-file-pdf',
        js: 'fa-solid fa-database',
        json: 'fa-solid fa-file-code',
        manual: 'fa-solid fa-pen',
        text: 'fa-solid fa-keyboard',
        unknown: 'fa-solid fa-book'
    };

    /**
     * Best-effort source type for stories created before source metadata existed.
     * @returns {'pdf'|'js'|'json'|'manual'|'text'|'unknown'}
     */
    function inferSourceType(story) {
        if (!story || typeof story !== 'object') return 'unknown';

        var explicit = trimText(story.sourceType).toLowerCase();
        if (explicit) {
            if (explicit === 'javascript') return 'js';
            if (SOURCE_LABELS[explicit]) return explicit;
        }

        var sourceFile = trimText(story.sourceFile);
        var fileName = trimText(story.fileName);
        var candidate = sourceFile || fileName;
        var ext = fileExtension(candidate);
        var lowerName = baseName(fileName).toLowerCase();

        if (story.pdfMeta || story.pdfPages || ext === 'pdf') return 'pdf';

        // These two names are written by the Studio itself, so they identify
        // the *origin* more accurately than their .json extension does.
        if (lowerName === 'manual_entry.json') return 'manual';
        if (lowerName.indexOf('text_import_') === 0) return 'text';

        if (ext === 'js' || ext === 'mjs') return 'js';
        if (ext === 'json') return 'json';
        if (ext === 'txt' || ext === 'md') return 'text';

        var tags = normalizeTags(story.tags).map(function (tag) { return tag.toLowerCase(); });
        if (tags.indexOf('pdf') !== -1) return 'pdf';
        if (tags.indexOf('custom') !== -1 || tags.indexOf('manual') !== -1) return 'manual';
        if (tags.indexOf('js') !== -1 || tags.indexOf('database') !== -1) return 'js';

        return 'unknown';
    }

    function sourceLabel(story) {
        var explicit = trimText(story && story.sourceLabel);
        if (explicit) return explicit;
        var type = inferSourceType(story);
        var file = trimText(story && (story.sourceFile || story.fileName));
        if (file) return SOURCE_LABELS[type] + ' · ' + baseName(file);
        return SOURCE_LABELS[type] || SOURCE_LABELS.unknown;
    }

    function sourceIcon(story) {
        return SOURCE_ICONS[inferSourceType(story)] || SOURCE_ICONS.unknown;
    }

    /* ----------------------------------------------------------------------
       Story signatures / validation / construction
       ---------------------------------------------------------------------- */

    function storySignature(story) {
        if (!story) return '';
        var title = trimText(story.title).toLowerCase().replace(/\s+/g, ' ');
        var content = normalizeContent(story.content)
            .join(' ')
            .replace(/<[^>]*>/g, ' ')
            .replace(/\s+/g, ' ')
            .trim()
            .toLowerCase();
        var lang = trimText(story.lang || 'en').toLowerCase();
        return lang + '|' + title + '|' + content;
    }

    function isValidStory(story) {
        if (!story || typeof story !== 'object') return false;
        if (!trimText(story.title)) return false;
        if (['beginner', 'intermediate', 'advanced'].indexOf(story.level) === -1) return false;
        if (normalizeContent(story.content).length === 0) return false;
        if (story.lang && !/^[a-z]{2}(-[A-Za-z]{2,4})?$/.test(story.lang)) return false;
        if (story.levelcefr && ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].indexOf(story.levelcefr) === -1) return false;
        if (story.coverType && ['emoji', 'icon', 'image'].indexOf(story.coverType) === -1) return false;
        return true;
    }

    function newStoryId() {
        return 'user_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 11);
    }

    /**
     * Turn a source story (database / PDF / JSON / manual) into a user story.
     * Does not write anything.
     */
    function buildUserStory(source, options) {
        options = options || {};
        var story = Object.assign({}, source || {});
        var translations = story.translations || options.translations || {};
        var type = options.sourceType || inferSourceType(story);
        var fileName = options.fileName || story.fileName || options.sourceFile || story.sourceFile || '';
        var sourceFile = options.sourceFile || story.sourceFile || fileName;
        var tags = mergeTags(story.tags, options.tags);

        if (type === 'pdf' && tags.indexOf('pdf') === -1) tags.push('pdf');

        var existingId = String(story.id || '');
        var storyId = options.id || (existingId.indexOf('user_') === 0 ? existingId : newStoryId());

        var userStory = Object.assign({}, story, {
            id: storyId,
            lang: story.lang || options.lang || 'en',
            level: story.level || options.level || 'intermediate',
            content: normalizeContent(story.content),
            tags: tags,
            isUserStory: true,
            fileName: fileName,
            sourceType: type,
            sourceFile: sourceFile,
            sourceLabel: options.sourceLabel || sourceLabel({ sourceType: type, sourceFile: sourceFile, fileName: fileName }),
            importedAt: options.importedAt || new Date().toISOString(),
            uploadDate: story.uploadDate || new Date().toISOString(),
            wordCount: Number(story.wordCount) || wordCount(story.content),
            hasTranslations: Object.keys(translations || {}).length > 0
        });

        delete userStory.translations;

        if (options.pdfMeta || story.pdfMeta) {
            userStory.pdfMeta = Object.assign({}, story.pdfMeta || {}, options.pdfMeta || {});
        }
        if (options.sourceName) userStory.sourceName = options.sourceName;

        return userStory;
    }

    /* ----------------------------------------------------------------------
       Public read / write API
       ---------------------------------------------------------------------- */

    function getUserStoriesSync() {
        return asArray(readSync(STORIES_KEY, []));
    }

    function getUserDictionariesSync() {
        return readSync(DICTIONARIES_KEY, {}) || {};
    }

    function getCurrentReadingStorySync() {
        return readSync(READING_KEY, null);
    }

    function getUserStories() {
        return ready().then(function () {
            return getUserStoriesSync();
        });
    }

    function getUserDictionaries() {
        return ready().then(function () {
            return getUserDictionariesSync();
        });
    }

    function getCurrentReadingStory() {
        return ready().then(function () {
            return getCurrentReadingStorySync();
        });
    }

    function saveStories(stories) {
        return Promise.resolve(writeRaw(STORIES_KEY, JSON.stringify(asArray(stories)))).then(flush);
    }

    function saveDictionaries(dictionaries) {
        return Promise.resolve(writeRaw(DICTIONARIES_KEY, JSON.stringify(dictionaries || {}))).then(flush);
    }

    function saveUserData(data) {
        data = data || {};
        var stories = data.stories === undefined ? getUserStoriesSync() : asArray(data.stories);
        var dictionaries = data.dictionaries === undefined ? getUserDictionariesSync() : (data.dictionaries || {});
        writeRaw(STORIES_KEY, JSON.stringify(stories));
        writeRaw(DICTIONARIES_KEY, JSON.stringify(dictionaries));
        return flush();
    }

    function clearUserData() {
        removeRaw(STORIES_KEY);
        removeRaw(DICTIONARIES_KEY);
        return flush();
    }

    function setCurrentReadingStory(story, options) {
        options = options || {};
        var storyId = story.id;
        if (storyId === undefined || storyId === null || storyId === '') {
            // Source stories loaded from JSON/PDF may not have an id yet; the
            // reader still needs a stable key to match the pending payload.
            storyId = (options.external ? 'external_' : 'user_') +
                Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 9);
        }
        var pending = {
            id: storyId,
            title: story.title,
            lang: story.lang || 'en',
            level: story.level,
            levelcefr: story.levelcefr || '',
            author: story.author || '',
            content: normalizeContent(story.content),
            isUserStory: options.isUserStory === true,
            external: options.external === true,
            cover: story.cover || '',
            coverType: story.coverType || 'emoji',
            description: story.description || '',
            sound: story.sound || null,
            dictionaries: story.dictionaries || [],
            tags: story.tags || [],
            sourceType: options.sourceType || inferSourceType(story),
            sourceFile: options.sourceFile || story.sourceFile || story.fileName || '',
            sourceLabel: options.sourceLabel || sourceLabel(story),
            pdfMeta: story.pdfMeta || null,
            translations: options.translations || story.translations || {}
        };

        // Keep embedded paragraph translations and an all-in-one dictionary
        // when a Studio source story is opened without saving it first.
        if (Array.isArray(story['content-tr'])) {
            pending['content-tr'] = story['content-tr'];
        }
        if (story.dictionary && typeof story.dictionary === 'object' && !Array.isArray(story.dictionary)) {
            pending.dictionary = story.dictionary;
        }
        writeRaw(READING_KEY, JSON.stringify(pending));
        return flush().then(function () { return pending; });
    }

    /**
     * Open an existing user story, or a source story that has not been saved.
     * Resolves after IndexedDB has committed, then navigates.
     */
    function openStoryInReader(story, options) {
        options = options || {};
        return setCurrentReadingStory(story, options).then(function (pending) {
            var params = new URLSearchParams();
            params.set('id', String(pending.id));
            if (options.external) {
                params.set('external', 'true');
            } else if (options.isUserStory !== false) {
                params.set('userStory', 'true');
            }
            global.location.href = READER_URL + '?' + params.toString();
        });
    }

    /**
     * Import one or more source stories into userStories.
     *
     * @param {Array|Object} rawStories story or stories
     * @param {Object} [options] { sourceType, sourceFile, sourceLabel, tags,
     *                             pdfMeta, translations, fileName }
     * @returns {Promise<{added: Array, skipped: number, duplicates: number,
     *                    invalid: number, stories: Array}>}
     */
    function importStories(rawStories, options) {
        options = options || {};
        var incoming = Array.isArray(rawStories)
            ? rawStories
            : (rawStories && Array.isArray(rawStories.stories) ? rawStories.stories : [rawStories]);

        return Promise.all([getUserStories(), getUserDictionaries()]).then(function (result) {
            var stories = result[0];
            var dictionaries = result[1];
            var signatures = Object.create(null);
            stories.forEach(function (story) {
                signatures[storySignature(story)] = true;
            });

            var added = [];
            var skipped = 0;
            var duplicates = 0;
            var invalid = 0;

            incoming.forEach(function (rawStory) {
                if (!isValidStory(rawStory)) {
                    invalid++;
                    return;
                }

                var translations = rawStory.translations || options.translations || {};
                var signature = storySignature(rawStory);
                if (signatures[signature]) {
                    duplicates++;
                    skipped++;
                    return;
                }

                var userStory = buildUserStory(rawStory, options);
                signatures[signature] = true;
                signatures[storySignature(userStory)] = true;
                added.push(userStory);

                if (Object.keys(translations).length > 0) {
                    dictionaries[userStory.id] = translations;
                }
            });

            if (added.length === 0) {
                return {
                    added: added,
                    skipped: skipped,
                    duplicates: duplicates,
                    invalid: invalid,
                    stories: []
                };
            }

            stories = stories.concat(added);
            return saveUserData({ stories: stories, dictionaries: dictionaries }).then(function () {
                return {
                    added: added,
                    skipped: skipped,
                    duplicates: duplicates,
                    invalid: invalid,
                    stories: added
                };
            });
        });
    }

    function updateStory(storyId, patch) {
        return getUserStories().then(function (stories) {
            var index = stories.findIndex(function (story) {
                return String(story.id) === String(storyId);
            });
            if (index === -1) return false;
            stories[index] = Object.assign({}, stories[index], patch || {});
            return saveStories(stories).then(function () { return true; });
        });
    }

    function deleteStory(storyId) {
        return Promise.all([getUserStories(), getUserDictionaries()]).then(function (result) {
            var stories = result[0];
            var dictionaries = result[1];
            var next = stories.filter(function (story) {
                return String(story.id) !== String(storyId);
            });
            delete dictionaries[storyId];
            return saveUserData({ stories: next, dictionaries: dictionaries }).then(function () {
                return next.length !== stories.length;
            });
        });
    }

    global.IStoriesUserData = {
        STORIES_KEY: STORIES_KEY,
        DICTIONARIES_KEY: DICTIONARIES_KEY,
        READING_KEY: READING_KEY,
        READER_URL: READER_URL,

        ready: ready,
        flush: flush,

        getUserStories: getUserStories,
        getUserDictionaries: getUserDictionaries,
        getCurrentReadingStory: getCurrentReadingStory,
        getUserStoriesSync: getUserStoriesSync,
        getUserDictionariesSync: getUserDictionariesSync,
        getCurrentReadingStorySync: getCurrentReadingStorySync,

        saveStories: saveStories,
        saveDictionaries: saveDictionaries,
        saveUserData: saveUserData,
        clearUserData: clearUserData,
        setCurrentReadingStory: setCurrentReadingStory,
        openStoryInReader: openStoryInReader,

        importStories: importStories,
        updateStory: updateStory,
        deleteStory: deleteStory,

        inferSourceType: inferSourceType,
        sourceLabel: sourceLabel,
        sourceIcon: sourceIcon,
        sourceLabels: SOURCE_LABELS,
        storySignature: storySignature,
        isValidStory: isValidStory,
        buildUserStory: buildUserStory,
        normalizeContent: normalizeContent,
        normalizeTags: normalizeTags,
        wordCount: wordCount,
        escapeHtml: escapeHtml,
        baseName: baseName,
        resolveAssetUrl: resolveAssetUrl
    };
})(window);
