/* ==========================================================================
   import-studio.js — story-database and PDF import tools for Stories Studio.

   • Opens built-in .js/.json story databases (database/data.json +
     database/reader.json) or a local file.
   • Parses JavaScript databases inside a Web Worker so `window.storiesData`
     can be read without letting the file touch the Studio DOM.
   • Lets the reader pick individual source stories to read (without saving)
     or save into userStories.
   • Extracts text from 1–10 PDF pages (PDF.js, vendored locally) and turns it
     into a normal user story.

   Depends on: nav/storage.js, nav/userdata.js, addstories.js,
               nav/vendor/pdfjs/pdf.min.js
   ========================================================================== */
(function () {
    'use strict';

    var MAX_PDF_PAGES = 10;
    var CUSTOM_SOURCES_KEY = 'customStorySources';
    var ui = window.IStoriesUserData;

    var sourceState = {
        stories: [],
        fileName: '',
        sourceFile: '',
        sourceType: 'js',
        sourceLabel: '',
        selected: new Set(),
        savedSignatures: new Set(),
        filter: ''
    };

    var pdfState = {
        file: null,
        doc: null,
        pageCount: 0,
        selected: new Set(),
        extracting: false
    };

    /* ----------------------------------------------------------------------
       Small helpers
       ---------------------------------------------------------------------- */

    function $(id) {
        return document.getElementById(id);
    }

    function notify(message, type) {
        if (typeof showNotification === 'function') {
            showNotification(message, type || 'info');
        } else {
            console[(type === 'error' ? 'error' : 'log')](message);
        }
    }

    function escapeHtml(value) {
        return ui ? ui.escapeHtml(value) : String(value === null || value === undefined ? '' : value);
    }

    function coverMarkup(story) {
        var cover = String(story && story.cover || '').trim() || '📚';
        var looksLikeImage = story && story.coverType === 'image' ||
            /^(https?:|data:image\/|blob:|\.{0,2}\/)/i.test(cover);

        if (!looksLikeImage) {
            return '<span class="source-story-cover">' + escapeHtml(cover) + '</span>';
        }

        var src = ui ? ui.resolveAssetUrl(cover) : cover;
        return '<span class="source-story-cover source-story-cover--image">' +
            '<span class="source-story-cover-fallback" aria-hidden="true">📚</span>' +
            '<img class="source-story-cover-img" src="' + escapeHtml(src) + '" alt="" loading="lazy" onerror="this.remove()">' +
        '</span>';
    }

    function extension(name) {
        var match = String(name || '').toLowerCase().match(/\.([a-z0-9]+)(?:[?#].*)?$/);
        return match ? match[1] : '';
    }

    function wordCount(content) {
        return ui ? ui.wordCount(content) : String((content || []).join(' ')).split(/\s+/).filter(Boolean).length;
    }

    function storySignature(story) {
        return ui ? ui.storySignature(story) : String(story && story.title || '');
    }

    function levelLabel(level) {
        return String(level || '').charAt(0).toUpperCase() + String(level || '').slice(1);
    }

    function langLabel(code) {
        if (typeof langFlag === 'function' && typeof langDisplayName === 'function') {
            var flag = langFlag(code);
            return (flag ? flag + ' ' : '') + langDisplayName(code);
        }
        return String(code || 'en').toUpperCase();
    }

    function readFileAsText(file) {
        return new Promise(function (resolve, reject) {
            var reader = new FileReader();
            reader.onload = function (event) { resolve(String(event.target.result || '')); };
            reader.onerror = function () { reject(reader.error || new Error('Could not read the file.')); };
            reader.readAsText(file);
        });
    }

    /* Custom database URLs are shared with the library source picker, which
       stores them under the same `customStorySources` key. */

    function sourceName(url) {
        try {
            var parsed = new URL(url, document.baseURI);
            var name = decodeURIComponent((parsed.pathname.split('/').pop() || '').trim());
            return name || parsed.hostname || String(url);
        } catch (error) {
            return String(url || '').split('/').pop();
        }
    }

    function customSourceEntries() {
        try {
            var stored = JSON.parse(localStorage.getItem(CUSTOM_SOURCES_KEY)) || [];
            if (!Array.isArray(stored)) return [];
            return stored.filter(function (entry) {
                return entry && typeof entry.url === 'string' && entry.url.trim();
            });
        } catch (error) {
            return [];
        }
    }

    function saveCustomSource(url, label) {
        var sources = customSourceEntries();
        var exists = sources.some(function (entry) { return entry.url === url; });
        if (exists) return;
        sources.push({ url: url, label: label || sourceName(url) });
        try {
            localStorage.setItem(CUSTOM_SOURCES_KEY, JSON.stringify(sources));
        } catch (error) {
            console.warn('[Studio] could not save custom source:', error);
        }
    }

    function addSourceOption(select, url, label) {
        if (!select) return;
        var exists = Array.prototype.some.call(select.options, function (option) {
            return option.value === url;
        });
        if (exists) return;
        var option = document.createElement('option');
        option.value = url;
        option.textContent = label || sourceName(url);
        option.dataset.customSource = 'true';
        select.appendChild(option);
    }

    function setStatus(id, message, tone) {
        var el = $(id);
        if (!el) return;
        el.textContent = message || '';
        el.className = 'import-status' + (tone ? ' import-status--' + tone : '');
    }

    /**
     * Make sure the Studio's in-memory collections reflect IndexedDB before an
     * import writes them back. Without this a very fast click after page load
     * could write an empty/stale userStories array over the saved one.
     */
    async function ensureUserCollections() {
        if (!ui) return;
        await ui.ready();
        userStories = ui.getUserStoriesSync();
        userDictionaries = ui.getUserDictionariesSync();
    }

    /* ----------------------------------------------------------------------
       Source catalogue (built-in databases)
       ---------------------------------------------------------------------- */

    function resolveDataEntry(entry) {
        var raw = String(entry && (entry.file || entry.value) || '').trim();
        if (!raw) return null;
        if (/^(https?:)?\/\//i.test(raw) || /^data:/i.test(raw)) {
            return { url: raw, label: entry.label || raw.split('/').pop() };
        }
        var url = new URL('../../database/database/' + raw.replace(/^\/+/, ''), document.baseURI).href;
        return { url: url, label: entry.label || raw.split('/').pop() };
    }

    function resolveReaderEntry(entry) {
        var raw = typeof entry === 'string' ? entry : (entry && (entry.file || entry.path));
        if (!raw) return null;
        raw = String(raw).trim();
        if (/^(https?:)?\/\//i.test(raw) || /^data:/i.test(raw)) {
            return { url: raw, label: (entry && entry.label) || raw.split('/').pop() };
        }
        var root = new URL('../../', document.baseURI);
        var url = new URL(raw.replace(/^\/+/, ''), root).href;
        return { url: url, label: (entry && entry.label) || raw.split('/').pop() };
    }

    async function loadSourceCatalog() {
        var select = $('sourceDbSelect');
        if (!select) return;

        var entries = new Map();
        function add(entry) {
            if (!entry || !entry.url) return;
            if (!entries.has(entry.url)) entries.set(entry.url, entry.label);
        }

        try {
            var dataResponse = await fetch('../../database/data.json', { cache: 'no-store' });
            if (dataResponse.ok) {
                var dataList = await dataResponse.json();
                (Array.isArray(dataList) ? dataList : []).forEach(function (entry) {
                    add(resolveDataEntry(entry));
                });
            }
        } catch (error) {
            console.warn('[Studio] database/data.json unavailable:', error);
        }

        try {
            var readerResponse = await fetch('../../database/reader.json', { cache: 'no-store' });
            if (readerResponse.ok) {
                var readerList = await readerResponse.json();
                var readerEntries = Array.isArray(readerList) ? readerList : (readerList.files || []);
                readerEntries.forEach(function (entry) {
                    add(resolveReaderEntry(entry));
                });
            }
        } catch (error) {
            console.warn('[Studio] database/reader.json unavailable:', error);
        }

        // Always keep the two bundled databases available, even if the lists
        // are missing or malformed.
        add({ url: new URL('../../database/database/main.js', document.baseURI).href, label: 'Base stories' });
        add({ url: new URL('../../database/database/more/more.js', document.baseURI).href, label: 'A1 / More stories' });

        // Database URLs saved by this page or by the library source picker.
        // Relative paths saved by the library are resolved against the library
        // page (main/index.html), which is one level above this folder.
        customSourceEntries().forEach(function (entry) {
            var resolved = entry.url;
            try {
                resolved = new URL(entry.url, new URL('../index.html', document.baseURI)).href;
            } catch (error) {
                /* keep the raw value */
            }
            add({ url: resolved, label: entry.label || sourceName(entry.url) });
        });

        select.innerHTML = '';
        Array.from(entries.entries()).forEach(function (pair) {
            var option = document.createElement('option');
            option.value = pair[0];
            option.textContent = pair[1];
            select.appendChild(option);
        });

        if (entries.size === 0) {
            select.innerHTML = '<option value="">No built-in databases found</option>';
        }
    }

    /* ----------------------------------------------------------------------
       JavaScript database parser (sandboxed Web Worker)
       ---------------------------------------------------------------------- */

    function extractStoryArray(data) {
        if (Array.isArray(data)) return data;
        if (!data || typeof data !== 'object') return [];
        if (Array.isArray(data.stories)) return data.stories;
        if (Array.isArray(data.story)) return data.story;
        if (data.title && data.content) return [data];
        return [];
    }

    function inlineDictionaryFromData(data) {
        if (!data || typeof data !== 'object' || Array.isArray(data)) return null;
        var value = data.dictionary;
        if (!value) value = data.sharedDictionary;
        return value && typeof value === 'object' && !Array.isArray(value) ? value : null;
    }

    function parseJavaScriptInWorker(source) {
        return new Promise(function (resolve, reject) {
            var workerCode = [
                'self.onmessage = function (event) {',
                '  var result = { ok: false, data: null, error: "" };',
                '  try {',
                '    self.window = self;',
                '    self.storiesData = undefined;',
                '    (0, eval)(event.data);',
                '    result.data = self.storiesData;',
                '    if (!result.data && self.stories) result.data = self.stories;',
                '    if (!result.data && self.story) result.data = self.story;',
                '    result.ok = true;',
                '  } catch (error) {',
                '    result.error = String(error && error.message ? error.message : error);',
                '  }',
                '  try { self.postMessage(result); }',
                '  catch (error) { self.postMessage({ ok: false, data: null, error: "Could not copy stories out of the sandbox: " + error.message }); }',
                '};'
            ].join('\n');

            var blobUrl = URL.createObjectURL(new Blob([workerCode], { type: 'text/javascript' }));
            var worker;
            var settled = false;

            function finish(callback, value) {
                if (settled) return;
                settled = true;
                clearTimeout(timeout);
                try { worker.terminate(); } catch (error) { /* ignore */ }
                URL.revokeObjectURL(blobUrl);
                callback(value);
            }

            var timeout = setTimeout(function () {
                finish(reject, new Error('The database took too long to load.'));
            }, 15000);

            try {
                worker = new Worker(blobUrl);
            } catch (error) {
                URL.revokeObjectURL(blobUrl);
                clearTimeout(timeout);
                reject(error);
                return;
            }

            worker.onmessage = function (event) {
                var payload = event.data || {};
                if (!payload.ok) {
                    finish(reject, new Error(payload.error || 'The JavaScript database could not be evaluated.'));
                    return;
                }
                finish(resolve, payload.data);
            };

            worker.onerror = function (event) {
                finish(reject, new Error(event.message || 'The database worker failed.'));
            };

            worker.postMessage(String(source));
        });
    }

    function parseJsonText(text) {
        var clean = String(text || '').replace(/^\uFEFF/, '');
        try {
            return JSON.parse(clean);
        } catch (firstError) {
            if (typeof stripJsonComments === 'function') {
                try {
                    return JSON.parse(stripJsonComments(clean));
                } catch (secondError) {
                    /* fall through to JavaScript evaluation */
                }
            }
        }
        return null;
    }

    async function parseStoriesText(text, fileName) {
        var json = parseJsonText(text);
        if (json !== null) return json;

        // JavaScript databases are evaluated in a Worker; it has no DOM access.
        return parseJavaScriptInWorker(text);
    }

    /* ----------------------------------------------------------------------
       Source story modal
       ---------------------------------------------------------------------- */

    function normalizeSourceStories(data, fileName, sourceType) {
        var list = extractStoryArray(data);
        var fileDictionary = inlineDictionaryFromData(data);
        return list.map(function (story, index) {
            if (!story || typeof story !== 'object') return null;

            var content = ui ? ui.normalizeContent(story.content) : (story.content || []);
            var candidate = Object.assign({}, story, { content: content });
            // A database can keep one dictionary at the top of the file and
            // share it with every story. Carry it into each imported story so
            // the saved copy stays self-contained.
            if (fileDictionary &&
                !(candidate.dictionary && typeof candidate.dictionary === 'object' && !Array.isArray(candidate.dictionary))) {
                candidate.dictionary = fileDictionary;
            }
            if (!ui || !ui.isValidStory(candidate)) return null;

            return {
                story: candidate,
                index: index,
                key: storySignature(candidate),
                wordCount: wordCount(content)
            };
        }).filter(Boolean);
    }

    async function openSourceText(text, fileName, sourceType, sourceLabel, sourceFile) {
        try {
            var data = await parseStoriesText(text, fileName);
            var stories = normalizeSourceStories(data, fileName, sourceType);

            if (stories.length === 0) {
                setStatus('sourceStatus', 'No valid stories were found in that file.', 'error');
                notify('No valid stories found in the selected database.', 'error');
                return;
            }

            var existingStories = ui ? await ui.getUserStories() : [];
            if (ui) {
                userStories = existingStories;
                userDictionaries = ui.getUserDictionariesSync();
            }
            var saved = new Set(existingStories.map(storySignature));

            sourceState = {
                stories: stories,
                fileName: fileName,
                sourceFile: sourceFile || fileName,
                sourceType: sourceType || (extension(fileName) === 'json' ? 'json' : 'js'),
                sourceLabel: sourceLabel || (sourceType === 'json' ? 'JSON file · ' : 'Story database · ') + fileName,
                selected: new Set(),
                savedSignatures: saved,
                filter: ''
            };

            setStatus('sourceStatus',
                'Loaded ' + stories.length + ' stories from ' + fileName + '. Choose one to read or save.',
                'success');
            openSourceModal();
        } catch (error) {
            console.error('[Studio] database parse failed:', error);
            setStatus('sourceStatus', 'Could not open that database: ' + error.message, 'error');
            notify('Could not open that database: ' + error.message, 'error');
        }
    }

    async function openSourceUrl(url, label) {
        setStatus('sourceStatus', 'Loading ' + (label || url) + '…');
        try {
            var response = await fetch(url, { cache: 'no-store' });
            if (!response.ok) throw new Error('HTTP ' + response.status);
            var text = await response.text();
            var fileName = label || (ui ? ui.baseName(url) : url.split('/').pop());
            var type = extension(url) === 'json' ? 'json' : 'js';
            await openSourceText(text, fileName, type,
                (type === 'json' ? 'JSON file · ' : 'Story database · ') + fileName, url);
        } catch (error) {
            console.error('[Studio] fetch source failed:', error);
            setStatus('sourceStatus', 'Could not load the source: ' + error.message, 'error');
            notify('Could not load the story database: ' + error.message, 'error');
        }
    }

    function openSourceModal() {
        var modal = $('sourceStoriesModal');
        if (!modal) return;
        modal.classList.add('show');
        modal.setAttribute('aria-hidden', 'false');
        renderSourceStories();
    }

    function closeSourceModal() {
        var modal = $('sourceStoriesModal');
        if (!modal) return;
        modal.classList.remove('show');
        modal.setAttribute('aria-hidden', 'true');
    }

    function visibleSourceStories() {
        var needle = sourceState.filter.trim().toLowerCase();
        if (!needle) return sourceState.stories;

        return sourceState.stories.filter(function (entry) {
            var story = entry.story;
            var haystack = [
                story.title,
                story.author,
                story.id,
                story.level,
                story.levelcefr,
                ui ? ui.normalizeTags(story.tags).join(' ') : (story.tags || []).join(' ')
            ].join(' ').toLowerCase();
            return haystack.indexOf(needle) !== -1;
        });
    }

    function renderSourceStories() {
        var list = $('sourceStoriesList');
        var title = $('sourceStoriesTitle');
        var count = $('sourceStoryCount');

        if (!list) return;

        if (title) {
            title.textContent = sourceState.fileName
                ? sourceState.fileName + ' — ' + sourceState.stories.length +
                  (sourceState.stories.length === 1 ? ' story' : ' stories')
                : 'Source stories';
        }

        var visible = visibleSourceStories();
        if (count) count.textContent = visible.length + ' of ' + sourceState.stories.length + ' shown';

        if (visible.length === 0) {
            list.innerHTML = '<div class="empty-state"><i class="fas fa-search"></i><p>No stories match your search.</p></div>';
        } else {
            list.innerHTML = visible.map(function (entry) {
                var story = entry.story;
                var checked = sourceState.selected.has(entry.index) ? ' checked' : '';
                var saved = sourceState.savedSignatures.has(entry.key);
                var lang = langLabel(story.lang || 'en');
                var tags = ui ? ui.normalizeTags(story.tags) : (story.tags || []);
                var meta = [
                    story.id !== undefined && story.id !== null ? '#' + story.id : '',
                    levelLabel(story.level),
                    story.levelcefr || '',
                    entry.wordCount + ' words',
                    lang
                ].filter(Boolean).join(' • ');

                var titleAttrs = typeof textDirectionAttributes === 'function'
                    ? textDirectionAttributes(story.title || 'Untitled story', story.lang)
                    : '';
                var authorAttrs = typeof textDirectionAttributes === 'function'
                    ? textDirectionAttributes(story.author || '', story.lang)
                    : '';

                return '' +
                    '<div class="source-story-row' + (saved ? ' is-saved' : '') + '" data-index="' + entry.index + '">' +
                        '<label class="source-story-check">' +
                            '<input type="checkbox" class="source-story-checkbox" data-index="' + entry.index + '"' + checked + '>' +
                            coverMarkup(story) +
                        '</label>' +
                        '<div class="source-story-info">' +
                            '<div class="source-story-title"' + titleAttrs + '>' + escapeHtml(story.title || 'Untitled story') + '</div>' +
                            '<div class="source-story-meta">' + escapeHtml(meta) + '</div>' +
                            (story.author ? '<div class="source-story-author"' + authorAttrs + '><i class="fas fa-user"></i> ' + escapeHtml(story.author) + '</div>' : '') +
                            (tags.length ? '<div class="source-story-tags">' + tags.slice(0, 5).map(function (tag) {
                                var tagAttrs = typeof textDirectionAttributes === 'function'
                                    ? textDirectionAttributes(tag, story.lang)
                                    : '';
                                return '<span class="source-tag"' + tagAttrs + '>' + escapeHtml(tag) + '</span>';
                            }).join('') + '</div>' : '') +
                        '</div>' +
                        '<div class="source-story-actions">' +
                            '<button type="button" class="mini-btn source-read-btn" data-index="' + entry.index + '" title="Read without saving">' +
                                '<i class="fas fa-book-reader"></i> Read' +
                            '</button>' +
                            (saved
                                ? '<span class="source-saved-badge"><i class="fas fa-check"></i> Saved</span>'
                                : '<button type="button" class="mini-btn mini-btn--primary source-save-btn" data-index="' + entry.index + '" title="Save to My Stories">' +
                                    '<i class="fas fa-bookmark"></i> Save' +
                                  '</button>') +
                        '</div>' +
                    '</div>';
            }).join('');
        }

        updateSourceSelectionUi();
        updateSourceSelectAllState();
    }

    function updateSourceSelectAllState() {
        var selectAll = $('sourceSelectAll');
        if (!selectAll) return;
        var visible = visibleSourceStories();
        var visibleSelected = visible.filter(function (entry) {
            return sourceState.selected.has(entry.index);
        }).length;
        selectAll.checked = visible.length > 0 && visibleSelected === visible.length;
        selectAll.indeterminate = visibleSelected > 0 && visibleSelected < visible.length;
    }

    function updateSourceSelectionUi() {
        var info = $('sourceSelectionInfo');
        var button = $('saveSelectedSourceBtn');
        var count = sourceState.selected.size;
        if (info) info.textContent = count + ' selected';
        if (button) {
            button.disabled = count === 0;
            button.innerHTML = count > 0
                ? '<i class="fas fa-save"></i> Save ' + count + ' selected'
                : '<i class="fas fa-save"></i> Save selected';
        }
    }

    function toggleSourceSelection(index, checked, notifyLimit) {
        index = Number(index);
        if (checked) {
            sourceState.selected.add(index);
        } else {
            sourceState.selected.delete(index);
        }
        updateSourceSelectionUi();
        return true;
    }

    function setSourceSelectionFromVisible(checked) {
        visibleSourceStories().forEach(function (entry) {
            if (checked) sourceState.selected.add(entry.index);
            else sourceState.selected.delete(entry.index);
        });
        renderSourceStories();
    }

    function sourceEntryByIndex(index) {
        return sourceState.stories.find(function (entry) {
            return entry.index === Number(index);
        });
    }

    async function readSourceStory(index) {
        var entry = sourceEntryByIndex(index);
        if (!entry) return;
        var story = entry.story;

        if (!ui) {
            notify('Storage helper is not available on this page.', 'error');
            return;
        }

        // Source stories are read from currentReadingStory — they are not saved
        // first and do not require a database lookup in the reader.
        await ui.openStoryInReader(story, {
            external: true,
            isUserStory: false,
            translations: story.translations || {},
            sourceType: sourceState.sourceType,
            sourceFile: sourceState.sourceFile || sourceState.fileName,
            sourceLabel: sourceState.sourceLabel
        });
    }

    async function saveSourceStories(indices) {
        var selected = indices.map(sourceEntryByIndex).filter(Boolean);
        if (selected.length === 0) return;

        if (typeof processStoryData !== 'function') {
            notify('The Studio import code is not ready yet. Reload the page and try again.', 'error');
            return;
        }

        await ensureUserCollections();

        var result = processStoryData(selected.map(function (entry) { return entry.story; }), sourceState.sourceFile || sourceState.fileName, {
            sourceType: sourceState.sourceType,
            sourceFile: sourceState.sourceFile || sourceState.fileName,
            sourceLabel: sourceState.sourceLabel,
            tags: sourceState.sourceType === 'json' ? ['json'] : ['database'],
            autoOpen: false,
            notify: false,
            clearFile: false
        });

        if (ui) await ui.flush();

        result.stories.forEach(function (story) {
            sourceState.savedSignatures.add(storySignature(story));
        });
        sourceState.selected.clear();
        renderSourceStories();

        if (result.imported > 0) {
            notify(result.imported + ' ' + (result.imported === 1 ? 'story' : 'stories') +
                ' saved to My Stories.' +
                (result.skipped > 0 ? ' ' + result.skipped + ' duplicate(s) skipped.' : ''),
                'success');
        } else if (result.skipped > 0) {
            notify('Those stories are already saved in My Stories.', 'info');
        } else {
            notify('No valid stories could be saved.', 'error');
        }
    }

    /* ----------------------------------------------------------------------
       PDF import
       ---------------------------------------------------------------------- */

    function configurePdfWorker() {
        if (!window.pdfjsLib) return false;
        try {
            pdfjsLib.GlobalWorkerOptions.workerSrc =
                new URL('../nav/vendor/pdfjs/pdf.worker.min.js', document.baseURI).href;
        } catch (error) {
            console.warn('[Studio] could not configure the PDF worker:', error);
        }
        return true;
    }

    function populatePdfLanguages() {
        var select = $('pdfLanguage');
        if (!select || select.options.length > 0) return;

        var order = (typeof IST_LANGUAGE_ORDER !== 'undefined')
            ? IST_LANGUAGE_ORDER
            : ['en', 'fr', 'es', 'de', 'it', 'pt', 'ru', 'tr', 'ar', 'fa', 'ur', 'he', 'zh', 'ja', 'ko', 'hi', 'nl', 'pl', 'sv', 'el'];

        select.innerHTML = order.map(function (code) {
            return '<option value="' + code + '">' + escapeHtml(langLabel(code)) + '</option>';
        }).join('');
        select.value = 'en';
    }

    function defaultPdfTitle(fileName) {
        return String(fileName || 'PDF story')
            .replace(/\.[^.]+$/, '')
            .replace(/[_-]+/g, ' ')
            .replace(/\s+/g, ' ')
            .trim() || 'PDF story';
    }

    async function loadPdfFile(file) {
        if (!file) return;
        if (extension(file.name) !== 'pdf' && file.type !== 'application/pdf') {
            notify('Please choose a PDF file.', 'error');
            return;
        }
        if (!configurePdfWorker()) {
            notify('PDF support is not available. The PDF.js library did not load.', 'error');
            return;
        }

        pdfState.file = file;
        pdfState.selected.clear();
        pdfState.pageCount = 0;
        pdfState.saved = false;

        var nameEl = $('pdfFileName');
        if (nameEl) nameEl.textContent = file.name + ' — ' + (typeof formatFileSize === 'function'
            ? formatFileSize(file.size)
            : Math.round(file.size / 1024) + ' KB');

        setStatus('pdfStatus', 'Loading PDF…');

        try {
            if (pdfState.doc) {
                try { await pdfState.doc.destroy(); } catch (error) { /* ignore */ }
                pdfState.doc = null;
            }

            var buffer = await file.arrayBuffer();
            pdfState.doc = await pdfjsLib.getDocument({ data: new Uint8Array(buffer) }).promise;
            pdfState.pageCount = pdfState.doc.numPages;

            var panel = $('pdfPagesPanel');
            var extractPanel = $('pdfExtractPanel');
            if (panel) panel.hidden = false;
            if (extractPanel) extractPanel.hidden = false;

            var titleInput = $('pdfTitle');
            if (titleInput && !titleInput.value.trim()) titleInput.value = defaultPdfTitle(file.name);

            var pageCountEl = $('pdfPageCount');
            if (pageCountEl) pageCountEl.textContent = '(' + pdfState.pageCount + ' pages)';

            renderPdfPages();
            resetPdfExtraction();
            setStatus('pdfStatus', 'PDF loaded. Select up to ' + MAX_PDF_PAGES + ' pages, then extract their text.', 'success');
        } catch (error) {
            console.error('[Studio] PDF load failed:', error);
            setStatus('pdfStatus', 'Could not open this PDF: ' + error.message, 'error');
            notify('Could not open this PDF: ' + error.message, 'error');
        }
    }

    function renderPdfPages() {
        var grid = $('pdfPageGrid');
        if (!grid) return;

        var fragment = document.createDocumentFragment();
        for (var page = 1; page <= pdfState.pageCount; page++) {
            var label = document.createElement('label');
            label.className = 'pdf-page-chip';

            var checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = String(page);
            checkbox.className = 'pdf-page-checkbox';
            checkbox.checked = pdfState.selected.has(page);

            var span = document.createElement('span');
            span.textContent = String(page);

            label.appendChild(checkbox);
            label.appendChild(span);
            fragment.appendChild(label);
        }

        grid.innerHTML = '';
        grid.appendChild(fragment);
        updatePdfSelectionSummary();
    }

    function updatePdfSelectionSummary() {
        var summary = $('pdfSelectionSummary');
        var extractBtn = $('pdfExtractBtn');
        var count = pdfState.selected.size;

        if (summary) {
            summary.textContent = count + '/' + MAX_PDF_PAGES + ' pages selected';
            summary.className = 'pdf-selection-summary' + (count > 0 ? ' has-selection' : '');
        }
        if (extractBtn) extractBtn.disabled = count === 0 || pdfState.extracting;

        // Keep the checkboxes in sync with the model (range select, clear, …).
        document.querySelectorAll('.pdf-page-checkbox').forEach(function (checkbox) {
            checkbox.checked = pdfState.selected.has(Number(checkbox.value));
        });
    }

    function resetPdfExtraction() {
        var text = $('pdfText');
        var saveBtn = $('pdfSaveBtn');
        var saveReadBtn = $('pdfSaveReadBtn');
        if (text) text.value = '';
        if (saveBtn) saveBtn.disabled = true;
        if (saveReadBtn) saveReadBtn.disabled = true;
    }

    function togglePdfPage(page, checked) {
        page = Number(page);

        if (checked && !pdfState.selected.has(page) && pdfState.selected.size >= MAX_PDF_PAGES) {
            var checkbox = document.querySelector('.pdf-page-checkbox[value="' + page + '"]');
            if (checkbox) checkbox.checked = false;
            notify('You can select a maximum of ' + MAX_PDF_PAGES + ' pages per import.', 'warning');
            return false;
        }

        if (checked) pdfState.selected.add(page);
        else pdfState.selected.delete(page);

        updatePdfSelectionSummary();
        return true;
    }

    function parsePageRange(value) {
        var text = String(value || '').trim();
        if (!text) throw new Error('Type a page range first, for example 1-3, 5.');

        var pages = new Set();
        text.split(/[,;]+/).forEach(function (part) {
            part = part.trim();
            if (!part) return;

            var match = part.match(/^(\d+)\s*[-–—]\s*(\d+)$/);
            if (match) {
                var start = Number(match[1]);
                var end = Number(match[2]);
                if (start > end) {
                    var swap = start;
                    start = end;
                    end = swap;
                }
                for (var page = start; page <= end; page++) pages.add(page);
                return;
            }

            if (/^\d+$/.test(part)) {
                pages.add(Number(part));
                return;
            }

            throw new Error('"' + part + '" is not a valid page or range.');
        });

        var sorted = Array.from(pages).sort(function (a, b) { return a - b; });

        if (sorted.length === 0) throw new Error('No pages were found in that range.');
        if (sorted[0] < 1 || sorted[sorted.length - 1] > pdfState.pageCount) {
            throw new Error('Pages must be between 1 and ' + pdfState.pageCount + '.');
        }
        if (sorted.length > MAX_PDF_PAGES) {
            throw new Error('That range contains ' + sorted.length + ' pages. The limit is ' + MAX_PDF_PAGES + '.');
        }

        return sorted;
    }

    function applyPdfRange() {
        var input = $('pdfRangeInput');
        try {
            var pages = parsePageRange(input && input.value);
            pdfState.selected = new Set(pages);
            updatePdfSelectionSummary();
            setStatus('pdfStatus', pages.length + ' page(s) selected.', 'success');
        } catch (error) {
            notify(error.message, 'error');
        }
    }

    function selectAllPdfPages() {
        pdfState.selected.clear();
        var limit = Math.min(pdfState.pageCount, MAX_PDF_PAGES);
        for (var page = 1; page <= limit; page++) pdfState.selected.add(page);
        updatePdfSelectionSummary();
        if (pdfState.pageCount > MAX_PDF_PAGES) {
            notify('The first ' + MAX_PDF_PAGES + ' pages were selected. Use a range for other pages.', 'info');
        }
    }

    function clearPdfPages() {
        pdfState.selected.clear();
        updatePdfSelectionSummary();
    }

    /**
     * Rebuild text lines while respecting the vertical position of each item.
     * PDF text items often arrive as one item per word, so blindly joining with
     * spaces loses line breaks; joining with newlines creates one word per line.
     */
    function pageTextContent(content) {
        var items = (content && content.items) || [];
        var lines = [];
        var current = [];
        var lastY = null;

        items.forEach(function (item) {
            var text = String(item.str || '');
            if (!text) {
                if (item.hasEOL && current.length) {
                    lines.push(current.join(' '));
                    current = [];
                    lastY = null;
                }
                return;
            }

            var y = item.transform ? item.transform[5] : null;
            if (lastY !== null && y !== null && Math.abs(y - lastY) > 4 && current.length) {
                lines.push(current.join(' '));
                current = [];
            }

            current.push(text);
            lastY = y;

            if (item.hasEOL) {
                lines.push(current.join(' '));
                current = [];
                lastY = null;
            }
        });

        if (current.length) lines.push(current.join(' '));
        return lines.join('\n');
    }

    function cleanPdfText(raw) {
        var lines = String(raw || '')
            .replace(/\r\n?/g, '\n')
            .replace(/\u00a0/g, ' ')
            .split('\n')
            .map(function (line) { return line.replace(/[ \t]+/g, ' ').trim(); });

        var blocks = [];
        var current = '';

        lines.forEach(function (line) {
            if (!line) {
                if (current) {
                    blocks.push(current);
                    current = '';
                }
                return;
            }

            if (!current) {
                current = line;
            } else if (/-$/.test(current) && /^[a-zà-ÿ]/.test(line)) {
                // Join words split across a line break: "conver-" + "sation".
                current = current.slice(0, -1) + line;
            } else {
                current += ' ' + line;
            }
        });

        if (current) blocks.push(current);
        return blocks.join('\n\n');
    }

    async function extractPdfPages() {
        if (!pdfState.doc || pdfState.selected.size === 0 || pdfState.extracting) return;

        var pages = Array.from(pdfState.selected).sort(function (a, b) { return a - b; });
        if (pages.length > MAX_PDF_PAGES) {
            notify('Select at most ' + MAX_PDF_PAGES + ' pages.', 'error');
            return;
        }

        pdfState.extracting = true;
        var extractBtn = $('pdfExtractBtn');
        if (extractBtn) {
            extractBtn.disabled = true;
            extractBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Extracting…';
        }
        setStatus('pdfStatus', 'Extracting text from ' + pages.length + ' page(s)…');

        try {
            var chunks = [];
            for (var i = 0; i < pages.length; i++) {
                var page = await pdfState.doc.getPage(pages[i]);
                var content = await page.getTextContent();
                var pageText = cleanPdfText(pageTextContent(content));
                if (pageText.trim()) chunks.push(pageText.trim());
            }

            var text = chunks.join('\n\n').trim();
            var textArea = $('pdfText');
            if (textArea) textArea.value = text;

            var saveBtn = $('pdfSaveBtn');
            var saveReadBtn = $('pdfSaveReadBtn');
            if (saveBtn) saveBtn.disabled = text.length === 0;
            if (saveReadBtn) saveReadBtn.disabled = text.length === 0;

            if (!text) {
                setStatus('pdfStatus', 'No selectable text was found on those pages. Try other pages or a text-based PDF.', 'warning');
                notify('No text was found on the selected pages.', 'warning');
            } else {
                var words = text.split(/\s+/).filter(Boolean).length;
                setStatus('pdfStatus', 'Extracted ' + words + ' words from ' + pages.length + ' page(s). Edit the text, then save.', 'success');
            }
        } catch (error) {
            console.error('[Studio] PDF extraction failed:', error);
            setStatus('pdfStatus', 'Could not extract the selected pages: ' + error.message, 'error');
            notify('PDF extraction failed: ' + error.message, 'error');
        } finally {
            pdfState.extracting = false;
            if (extractBtn) {
                extractBtn.disabled = pdfState.selected.size === 0;
                extractBtn.innerHTML = '<i class="fas fa-wand-magic-sparkles"></i> Extract selected pages';
            }
        }
    }

    function textToParagraphs(text) {
        var value = String(text || '').trim();
        if (!value) return [];

        var blocks = value.split(/\n\s*\n/).map(function (block) {
            return block.replace(/\s*\n\s*/g, ' ').replace(/\s+/g, ' ').trim();
        }).filter(Boolean);

        if (blocks.length <= 1) {
            return value.split(/\n+/).map(function (line) {
                return line.replace(/\s+/g, ' ').trim();
            }).filter(Boolean);
        }

        return blocks;
    }

    async function savePdfStory(openAfter) {
        if (!pdfState.file || pdfState.selected.size === 0) {
            notify('Choose at least one PDF page first.', 'error');
            return;
        }

        var text = ($('pdfText') && $('pdfText').value || '').trim();
        if (!text) {
            notify('Extract the selected pages before saving.', 'error');
            return;
        }

        var title = ($('pdfTitle') && $('pdfTitle').value || '').trim();
        var lang = ($('pdfLanguage') && $('pdfLanguage').value) || 'en';
        var level = ($('pdfLevel') && $('pdfLevel').value) || 'intermediate';
        var levelcefr = ($('pdfLevelCefr') && $('pdfLevelCefr').value) || '';
        var author = ($('pdfAuthor') && $('pdfAuthor').value || '').trim();
        var tags = ($('pdfTags') && $('pdfTags').value || '')
            .split(',').map(function (tag) { return tag.trim(); }).filter(Boolean);

        if (!title) {
            notify('Please give the PDF story a title.', 'error');
            return;
        }

        var pages = Array.from(pdfState.selected).sort(function (a, b) { return a - b; });
        var paragraphs = textToParagraphs(text);

        if (paragraphs.length === 0) {
            notify('The extracted text is empty.', 'error');
            return;
        }

        if (tags.indexOf('pdf') === -1) tags.push('pdf');

        var story = {
            title: title,
            lang: lang,
            level: level,
            levelcefr: levelcefr || undefined,
            author: author,
            cover: '📄',
            coverType: 'emoji',
            tags: tags,
            content: paragraphs,
            sourceType: 'pdf',
            pdfMeta: {
                fileName: pdfState.file.name,
                fileSize: pdfState.file.size,
                totalPages: pdfState.pageCount,
                pages: pages,
                extractedAt: new Date().toISOString()
            }
        };

        if (typeof processStoryData !== 'function') {
            notify('The Studio import code is not ready yet. Reload the page and try again.', 'error');
            return;
        }

        await ensureUserCollections();

        var result = processStoryData([story], pdfState.file.name, {
            sourceType: 'pdf',
            sourceFile: pdfState.file.name,
            sourceLabel: 'PDF import · ' + pdfState.file.name,
            tags: tags,
            pdfMeta: story.pdfMeta,
            autoOpen: false,
            notify: false,
            clearFile: false
        });

        if (ui) await ui.flush();

        if (result.imported === 0) {
            notify(result.skipped > 0
                ? 'This PDF story is already saved in My Stories.'
                : 'The PDF story could not be saved. Check the title and content.', 'warning');
            return;
        }

        var savedStory = result.stories[0];
        setStatus('pdfStatus', 'Saved "' + savedStory.title + '" to My Stories.', 'success');
        notify('PDF story saved to My Stories.', 'success');

        if (openAfter && ui) {
            await ui.openStoryInReader(savedStory, {
                isUserStory: true,
                sourceType: 'pdf',
                sourceFile: pdfState.file.name,
                sourceLabel: 'PDF import · ' + pdfState.file.name
            });
        }
    }

    /* ----------------------------------------------------------------------
       Wiring
       ---------------------------------------------------------------------- */

    function setupSourceTools() {
        var loadBtn = $('loadSourceDbBtn');
        var localBtn = $('sourceLocalBtn');
        var input = $('sourceFileInput');
        var select = $('sourceDbSelect');

        if (loadBtn && select) {
            loadBtn.addEventListener('click', function () {
                var url = select.value;
                if (!url) {
                    notify('Choose a built-in story source first.', 'warning');
                    return;
                }
                var label = select.options[select.selectedIndex] && select.options[select.selectedIndex].textContent;
                openSourceUrl(url, label);
            });
        }

        var urlBtn = $('loadSourceUrlBtn');
        var urlInput = $('sourceUrlInput');

        function openDatabaseFromUrl() {
            var raw = urlInput && urlInput.value.trim();
            if (!raw) {
                setStatus('sourceStatus', 'Enter a database URL first.', 'error');
                if (urlInput) urlInput.focus();
                return;
            }

            var resolved;
            try {
                resolved = new URL(raw, document.baseURI);
            } catch (error) {
                setStatus('sourceStatus', 'Enter a valid database URL.', 'error');
                if (urlInput) urlInput.focus();
                return;
            }

            if (resolved.protocol !== 'http:' && resolved.protocol !== 'https:') {
                setStatus('sourceStatus', 'Enter a valid http(s) database URL.', 'error');
                if (urlInput) urlInput.focus();
                return;
            }

            var label = sourceName(resolved.href);
            saveCustomSource(resolved.href, label);
            addSourceOption(select, resolved.href, label);
            if (select) select.value = resolved.href;
            if (urlInput) urlInput.value = '';
            openSourceUrl(resolved.href, label);
        }

        if (urlBtn) {
            urlBtn.addEventListener('click', openDatabaseFromUrl);
        }

        if (urlInput) {
            urlInput.addEventListener('keydown', function (event) {
                if (event.key === 'Enter') {
                    event.preventDefault();
                    openDatabaseFromUrl();
                }
            });
        }

        if (localBtn && input) {
            localBtn.addEventListener('click', function () { input.click(); });
        }

        if (input) {
            input.addEventListener('change', async function () {
                var file = input.files && input.files[0];
                if (!file) return;
                try {
                    setStatus('sourceStatus', 'Reading ' + file.name + '…');
                    var text = await readFileAsText(file);
                    var type = extension(file.name) === 'json' ? 'json' : 'js';
                    await openSourceText(text, file.name, type,
                        (type === 'json' ? 'JSON file · ' : 'Story database · ') + file.name);
                } catch (error) {
                    setStatus('sourceStatus', 'Could not read that file: ' + error.message, 'error');
                    notify('Could not read that file: ' + error.message, 'error');
                } finally {
                    input.value = '';
                }
            });
        }

        var closeBtn = $('closeSourceStoriesBtn');
        var closeBtn2 = $('closeSourceStoriesBtn2');
        var modal = $('sourceStoriesModal');
        var search = $('sourceStorySearch');
        var selectAll = $('sourceSelectAll');
        var list = $('sourceStoriesList');
        var saveSelected = $('saveSelectedSourceBtn');

        if (closeBtn) closeBtn.addEventListener('click', closeSourceModal);
        if (closeBtn2) closeBtn2.addEventListener('click', closeSourceModal);
        if (modal) {
            modal.addEventListener('click', function (event) {
                if (event.target === modal) closeSourceModal();
            });
        }

        if (search) {
            search.addEventListener('input', function () {
                sourceState.filter = search.value || '';
                renderSourceStories();
            });
        }

        if (selectAll) {
            selectAll.addEventListener('change', function () {
                setSourceSelectionFromVisible(selectAll.checked);
            });
        }

        if (list) {
            list.addEventListener('change', function (event) {
                var checkbox = event.target.closest('.source-story-checkbox');
                if (!checkbox) return;
                toggleSourceSelection(checkbox.dataset.index, checkbox.checked, true);
                var row = checkbox.closest('.source-story-row');
                if (row) row.classList.toggle('is-selected', checkbox.checked);
                // Only the select-all state changes; re-rendering the list here
                // would reset scroll and invalidate the clicked element.
                updateSourceSelectAllState();
            });

            list.addEventListener('click', function (event) {
                var readBtn = event.target.closest('.source-read-btn');
                if (readBtn) {
                    readSourceStory(readBtn.dataset.index);
                    return;
                }

                var saveBtn = event.target.closest('.source-save-btn');
                if (saveBtn) {
                    saveSourceStories([Number(saveBtn.dataset.index)]);
                }
            });
        }

        if (saveSelected) {
            saveSelected.addEventListener('click', function () {
                saveSourceStories(Array.from(sourceState.selected));
            });
        }
    }

    function setupPdfTools() {
        var browseBtn = $('pdfBrowseBtn');
        var input = $('pdfFileInput');
        var grid = $('pdfPageGrid');

        populatePdfLanguages();

        if (browseBtn && input) {
            browseBtn.addEventListener('click', function () { input.click(); });
        }

        if (input) {
            input.addEventListener('change', function () {
                var file = input.files && input.files[0];
                if (file) loadPdfFile(file);
                input.value = '';
            });
        }

        if (grid) {
            grid.addEventListener('change', function (event) {
                var checkbox = event.target.closest('.pdf-page-checkbox');
                if (!checkbox) return;
                togglePdfPage(checkbox.value, checkbox.checked);
            });
        }

        var selectAllBtn = $('pdfSelectAllBtn');
        var clearBtn = $('pdfClearPagesBtn');
        var rangeBtn = $('pdfApplyRangeBtn');
        var extractBtn = $('pdfExtractBtn');
        var saveBtn = $('pdfSaveBtn');
        var saveReadBtn = $('pdfSaveReadBtn');
        var text = $('pdfText');

        if (selectAllBtn) selectAllBtn.addEventListener('click', selectAllPdfPages);
        if (clearBtn) clearBtn.addEventListener('click', clearPdfPages);
        if (rangeBtn) rangeBtn.addEventListener('click', applyPdfRange);

        var rangeInput = $('pdfRangeInput');
        if (rangeInput) {
            rangeInput.addEventListener('keydown', function (event) {
                if (event.key === 'Enter') {
                    event.preventDefault();
                    applyPdfRange();
                }
            });
        }

        if (extractBtn) extractBtn.addEventListener('click', extractPdfPages);
        if (saveBtn) saveBtn.addEventListener('click', function () { savePdfStory(false); });
        if (saveReadBtn) saveReadBtn.addEventListener('click', function () { savePdfStory(true); });

        if (text) {
            text.addEventListener('input', function () {
                var hasText = text.value.trim().length > 0;
                if (saveBtn) saveBtn.disabled = !hasText;
                if (saveReadBtn) saveReadBtn.disabled = !hasText;
            });
        }
    }

    document.addEventListener('DOMContentLoaded', function () {
        loadSourceCatalog();
        setupSourceTools();
        setupPdfTools();
    });
})();
