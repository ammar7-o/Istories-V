/* ==========================================================================
   My Stories — browse, filter and manage every saved user story.

   Data lives in IndexedDB (through nav/storage.js + nav/userdata.js); this
   page never writes large collections to native localStorage.
   ========================================================================== */
(function () {
    'use strict';

    var ui = window.IStoriesUserData;

    var state = {
        stories: [],
        dictionaries: {},
        filtered: []
    };

    var els = {};

    /* ----------------------------------------------------------------------
       Utilities
       ---------------------------------------------------------------------- */

    function $(id) {
        return document.getElementById(id);
    }

    function escapeHtml(value) {
        if (ui) return ui.escapeHtml(value);
        return String(value === null || value === undefined ? '' : value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function notify(message, type) {
        if (typeof showNotification === 'function') showNotification(message, type || 'info');
    }

    function sourceType(story) {
        return ui ? ui.inferSourceType(story) : 'unknown';
    }

    function sourceLabel(story) {
        return ui ? ui.sourceLabel(story) : 'User story';
    }

    function sourceIcon(story) {
        return ui ? ui.sourceIcon(story) : 'fa-solid fa-book';
    }

    function storyWords(story) {
        if (Number(story.wordCount) > 0) return Number(story.wordCount);
        return ui ? ui.wordCount(story.content) : 0;
    }

    function storyTags(story) {
        return ui ? ui.normalizeTags(story.tags) : (Array.isArray(story.tags) ? story.tags : []);
    }

    function storyLang(story) {
        return String(story.lang || 'en').toLowerCase().split('-')[0];
    }

    function langName(code) {
        if (typeof langFlag === 'function' && typeof langDisplayName === 'function') {
            var flag = langFlag(code);
            return (flag ? flag + ' ' : '') + langDisplayName(code);
        }
        return String(code || 'en').toUpperCase();
    }

    function levelName(level) {
        return String(level || '').charAt(0).toUpperCase() + String(level || '').slice(1);
    }

    function storyTime(story) {
        var value = story.uploadDate || story.importedAt;
        var time = Date.parse(value);
        return isNaN(time) ? 0 : time;
    }

    function formatDate(value) {
        var time = Date.parse(value);
        if (isNaN(time)) return 'Unknown date';
        try {
            return new Date(time).toLocaleDateString(undefined, {
                year: 'numeric', month: 'short', day: 'numeric'
            });
        } catch (error) {
            return new Date(time).toLocaleDateString();
        }
    }

    function formatNumber(value) {
        return Number(value || 0).toLocaleString();
    }

    function wordCount(content) {
        if (ui) return ui.wordCount(content);
        return String((content || []).join(' ')).split(/\s+/).filter(Boolean).length;
    }

    function hasTranslations(story) {
        return Boolean(story.hasTranslations) ||
            Boolean(state.dictionaries[story.id] && Object.keys(state.dictionaries[story.id]).length);
    }

    function currentValue(id) {
        var el = $(id);
        return el ? el.value : '';
    }

    function currentChecked(id) {
        var el = $(id);
        return !!(el && el.checked);
    }

    /* ----------------------------------------------------------------------
       Data loading
       ---------------------------------------------------------------------- */

    async function loadData() {
        if (!ui) {
            renderFatal('Storage helper not available. Reload the page and try again.');
            return;
        }

        try {
            var result = await Promise.all([ui.getUserStories(), ui.getUserDictionaries()]);
            state.stories = Array.isArray(result[0]) ? result[0] : [];
            state.dictionaries = result[1] || {};
            populateFilterOptions();
            updateStats();
            render();
        } catch (error) {
            console.error('[My Stories] could not load stories:', error);
            renderFatal('Could not load your stories from IndexedDB.');
        }
    }

    function renderFatal(message) {
        if (els.resultCount) els.resultCount.textContent = message;
        if (els.empty) {
            els.empty.hidden = false;
            if (els.emptyTitle) els.emptyTitle.textContent = 'Something went wrong';
            if (els.emptyText) els.emptyText.textContent = message;
            if (els.emptyStudio) els.emptyStudio.hidden = true;
        }
    }

    function populateFilterOptions() {
        var languages = [];
        var tags = [];

        state.stories.forEach(function (story) {
            var lang = storyLang(story);
            if (languages.indexOf(lang) === -1) languages.push(lang);
            storyTags(story).forEach(function (tag) {
                if (tags.indexOf(tag) === -1) tags.push(tag);
            });
        });

        var preferred = (typeof IST_LANGUAGE_ORDER !== 'undefined') ? IST_LANGUAGE_ORDER : [];
        languages.sort(function (a, b) {
            var ai = preferred.indexOf(a);
            var bi = preferred.indexOf(b);
            if (ai === -1) ai = 999;
            if (bi === -1) bi = 999;
            return ai - bi || a.localeCompare(b);
        });
        tags.sort(function (a, b) { return a.localeCompare(b); });

        var langSelect = els.language;
        if (langSelect) {
            var previous = langSelect.value || 'all';
            langSelect.innerHTML = '<option value="all">All languages</option>' + languages.map(function (code) {
                return '<option value="' + escapeHtml(code) + '">' + escapeHtml(langName(code)) + '</option>';
            }).join('');
            langSelect.value = languages.indexOf(previous) !== -1 ? previous : 'all';
        }

        var tagSelect = els.tag;
        if (tagSelect) {
            var previousTag = tagSelect.value || 'all';
            tagSelect.innerHTML = '<option value="all">Any tag</option>' + tags.map(function (tag) {
                return '<option value="' + escapeHtml(tag) + '">' + escapeHtml(tag) + '</option>';
            }).join('');
            tagSelect.value = tags.indexOf(previousTag) !== -1 ? previousTag : 'all';
        }
    }

    function updateStats() {
        var pdfCount = 0;
        var words = 0;
        var translationCount = 0;

        state.stories.forEach(function (story) {
            if (sourceType(story) === 'pdf') pdfCount++;
            words += storyWords(story);
            if (hasTranslations(story)) translationCount++;
        });

        if (els.statTotal) els.statTotal.textContent = formatNumber(state.stories.length);
        if (els.statPdf) els.statPdf.textContent = formatNumber(pdfCount);
        if (els.statWords) els.statWords.textContent = formatNumber(words);
        if (els.statTranslations) els.statTranslations.textContent = formatNumber(translationCount);
    }

    /* ----------------------------------------------------------------------
       Filtering / sorting
       ---------------------------------------------------------------------- */

    function readFilters() {
        return {
            search: String(currentValue('msSearch') || '').trim().toLowerCase(),
            source: currentValue('msSource') || 'all',
            language: currentValue('msLanguage') || 'all',
            level: currentValue('msLevel') || 'all',
            cefr: currentValue('msCefr') || 'all',
            tag: currentValue('msTag') || 'all',
            hasTranslations: currentChecked('msHasTranslations'),
            hasAudio: currentChecked('msHasAudio'),
            wordsMin: Number(currentValue('msWordsMin')) || 0,
            wordsMax: Number(currentValue('msWordsMax')) || 0,
            dateFrom: currentValue('msDateFrom'),
            dateTo: currentValue('msDateTo')
        };
    }

    function matchesFilters(story, filters) {
        if (filters.source !== 'all' && sourceType(story) !== filters.source) return false;

        if (filters.language !== 'all' && storyLang(story) !== filters.language) return false;
        if (filters.level !== 'all' && story.level !== filters.level) return false;

        if (filters.cefr !== 'all') {
            if (filters.cefr === 'none') {
                if (story.levelcefr) return false;
            } else if (story.levelcefr !== filters.cefr) {
                return false;
            }
        }

        if (filters.tag !== 'all') {
            var tags = storyTags(story).map(function (tag) { return tag.toLowerCase(); });
            if (tags.indexOf(String(filters.tag).toLowerCase()) === -1) return false;
        }

        if (filters.hasTranslations && !hasTranslations(story)) return false;
        if (filters.hasAudio && !String(story.sound || '').trim()) return false;

        var words = storyWords(story);
        if (filters.wordsMin > 0 && words < filters.wordsMin) return false;
        if (filters.wordsMax > 0 && words > filters.wordsMax) return false;

        if (filters.dateFrom || filters.dateTo) {
            var time = storyTime(story);
            if (!time) return false;
            if (filters.dateFrom) {
                var from = Date.parse(filters.dateFrom + 'T00:00:00');
                if (!isNaN(from) && time < from) return false;
            }
            if (filters.dateTo) {
                var to = Date.parse(filters.dateTo + 'T23:59:59');
                if (!isNaN(to) && time > to) return false;
            }
        }

        if (filters.search) {
            var haystack = [
                story.title,
                story.author,
                story.level,
                story.levelcefr,
                story.lang,
                story.sourceLabel,
                story.sourceFile,
                storyTags(story).join(' '),
                (Array.isArray(story.content) ? story.content.join(' ') : String(story.content || ''))
            ].join(' ').replace(/<[^>]*>/g, ' ').toLowerCase();

            if (haystack.indexOf(filters.search) === -1) return false;
        }

        return true;
    }

    function sortStories(stories, sort) {
        var copy = stories.slice();
        var levelOrder = { beginner: 0, intermediate: 1, advanced: 2 };

        copy.sort(function (a, b) {
            switch (sort) {
                case 'oldest':
                    return storyTime(a) - storyTime(b);
                case 'title':
                    return String(a.title || '').localeCompare(String(b.title || ''));
                case 'words-desc':
                    return storyWords(b) - storyWords(a);
                case 'words-asc':
                    return storyWords(a) - storyWords(b);
                case 'level':
                    return (levelOrder[a.level] === undefined ? 9 : levelOrder[a.level]) -
                        (levelOrder[b.level] === undefined ? 9 : levelOrder[b.level]) ||
                        String(a.title || '').localeCompare(String(b.title || ''));
                case 'newest':
                default:
                    return storyTime(b) - storyTime(a);
            }
        });

        return copy;
    }

    function render() {
        if (!els.grid) return;

        var filters = readFilters();
        state.filtered = sortStories(
            state.stories.filter(function (story) { return matchesFilters(story, filters); }),
            currentValue('msSort') || 'newest'
        );

        if (els.resultCount) {
            els.resultCount.textContent = state.stories.length === 0
                ? 'No saved stories yet'
                : state.filtered.length + ' of ' + state.stories.length +
                  (state.stories.length === 1 ? ' story' : ' stories');
        }

        if (els.exportAll) els.exportAll.hidden = state.filtered.length === 0;

        renderActiveFilters(filters);
        renderGrid();
    }

    function renderGrid() {
        if (!els.grid) return;

        if (state.filtered.length === 0) {
            els.grid.innerHTML = '';
            if (els.empty) {
                els.empty.hidden = false;
                var noStories = state.stories.length === 0;
                if (els.emptyTitle) {
                    els.emptyTitle.textContent = noStories ? 'No stories yet' : 'No stories match these filters';
                }
                if (els.emptyText) {
                    els.emptyText.textContent = noStories
                        ? 'Save a story from Stories Studio — from a PDF, a JavaScript database, a JSON file or the quick-add form.'
                        : 'Try clearing the search or one of the advanced filters.';
                }
                if (els.emptyStudio) els.emptyStudio.hidden = !noStories;
                if (els.emptyReset) els.emptyReset.hidden = noStories;
            }
            return;
        }

        if (els.empty) els.empty.hidden = true;

        els.grid.innerHTML = state.filtered.map(function (story) {
            var type = sourceType(story);
            var tags = storyTags(story);
            var words = storyWords(story);
            var cover = story.cover || '📚';
            var isImage = story.coverType === 'image' ||
                /^(https?:|data:image\/|blob:|\.{0,2}\/)/i.test(String(cover));
            var coverUrl = isImage && ui ? ui.resolveAssetUrl(cover) : cover;

            var coverHtml = isImage
                ? '<div class="ms-card__cover-image" style="background-image: url(&quot;' + escapeHtml(coverUrl) + '&quot;)"></div>'
                : (story.coverType === 'icon'
                    ? '<i class="' + escapeHtml(cover) + '"></i>'
                    : '<span class="ms-card__emoji">' + escapeHtml(cover) + '</span>');

            var translationBadge = hasTranslations(story)
                ? '<span class="ms-badge ms-badge--translations" title="Has custom translations"><i class="fas fa-language"></i> Translations</span>'
                : '';
            var audioBadge = String(story.sound || '').trim()
                ? '<span class="ms-badge ms-badge--audio" title="Has audio"><i class="fas fa-volume-up"></i> Audio</span>'
                : '';

            return '' +
                '<article class="ms-card">' +
                    '<div class="ms-card__cover ms-card__cover--' + escapeHtml(type) + '">' +
                        coverHtml +
                        '<span class="ms-card__source source-pill source-pill--' + escapeHtml(type) + '">' +
                            '<i class="' + escapeHtml(sourceIcon(story)) + '"></i> ' + escapeHtml(sourceLabel(story)) +
                        '</span>' +
                    '</div>' +
                    '<div class="ms-card__body">' +
                        '<div class="ms-card__badges">' +
                            '<span class="ms-badge ms-badge--level ' + escapeHtml(story.level || '') + '">' +
                                escapeHtml(levelName(story.level)) +
                            '</span>' +
                            (story.levelcefr ? '<span class="ms-badge ms-badge--cefr">' + escapeHtml(story.levelcefr) + '</span>' : '') +
                            '<span class="ms-badge ms-badge--lang">' + escapeHtml(langName(storyLang(story))) + '</span>' +
                            translationBadge +
                            audioBadge +
                        '</div>' +
                        '<h2 class="ms-card__title">' + escapeHtml(story.title || 'Untitled story') + '</h2>' +
                        (story.author ? '<p class="ms-card__author"><i class="fas fa-user"></i> ' + escapeHtml(story.author) + '</p>' : '') +
                        '<p class="ms-card__meta">' +
                            '<span><i class="fas fa-font"></i> ' + formatNumber(words) + ' words</span>' +
                            '<span><i class="fas fa-calendar"></i> ' + escapeHtml(formatDate(story.uploadDate || story.importedAt)) + '</span>' +
                        '</p>' +
                        (tags.length
                            ? '<div class="ms-card__tags">' + tags.slice(0, 4).map(function (tag) {
                                return '<span>#' + escapeHtml(tag) + '</span>';
                            }).join('') + (tags.length > 4 ? '<span>+' + (tags.length - 4) + '</span>' : '') + '</div>'
                            : '') +
                        '<div class="ms-card__actions">' +
                            '<button type="button" class="ms-action ms-action--primary" data-action="read" data-id="' + escapeHtml(story.id) + '">' +
                                '<i class="fas fa-book-reader"></i> Read' +
                            '</button>' +
                            '<button type="button" class="ms-action" data-action="edit" data-id="' + escapeHtml(story.id) + '" title="Edit in Stories Studio">' +
                                '<i class="fas fa-edit"></i> Edit' +
                            '</button>' +
                            '<button type="button" class="ms-action ms-action--icon" data-action="export" data-id="' + escapeHtml(story.id) + '" title="Export as JSON">' +
                                '<i class="fas fa-file-export"></i><span class="sr-only">Export</span>' +
                            '</button>' +
                            '<button type="button" class="ms-action ms-action--icon ms-action--danger" data-action="delete" data-id="' + escapeHtml(story.id) + '" title="Delete story">' +
                                '<i class="fas fa-trash"></i><span class="sr-only">Delete</span>' +
                            '</button>' +
                        '</div>' +
                    '</div>' +
                '</article>';
        }).join('');
    }

    function activeFilterChips(filters) {
        var chips = [];

        if (filters.search) chips.push({ key: 'search', label: 'Search: ' + filters.search });
        if (filters.source !== 'all') {
            chips.push({ key: 'source', label: 'Source: ' + (ui ? (ui.sourceLabels[filters.source] || filters.source) : filters.source) });
        }
        if (filters.language !== 'all') chips.push({ key: 'language', label: 'Language: ' + langName(filters.language) });
        if (filters.level !== 'all') chips.push({ key: 'level', label: 'Level: ' + levelName(filters.level) });
        if (filters.cefr !== 'all') chips.push({ key: 'cefr', label: 'CEFR: ' + (filters.cefr === 'none' ? 'Not set' : filters.cefr) });
        if (filters.tag !== 'all') chips.push({ key: 'tag', label: 'Tag: ' + filters.tag });
        if (filters.hasTranslations) chips.push({ key: 'hasTranslations', label: 'Has translations' });
        if (filters.hasAudio) chips.push({ key: 'hasAudio', label: 'Has audio' });
        if (filters.wordsMin) chips.push({ key: 'wordsMin', label: filters.wordsMin + '+ words' });
        if (filters.wordsMax) chips.push({ key: 'wordsMax', label: 'Up to ' + filters.wordsMax + ' words' });
        if (filters.dateFrom) chips.push({ key: 'dateFrom', label: 'From ' + filters.dateFrom });
        if (filters.dateTo) chips.push({ key: 'dateTo', label: 'To ' + filters.dateTo });

        return chips;
    }

    function renderActiveFilters(filters) {
        if (!els.activeFilters) return;

        var chips = activeFilterChips(filters);
        if (chips.length === 0) {
            els.activeFilters.hidden = true;
            els.activeFilters.innerHTML = '';
            if (els.filterCount) els.filterCount.hidden = true;
            return;
        }

        els.activeFilters.hidden = false;
        els.activeFilters.innerHTML = chips.map(function (chip) {
            return '<button type="button" class="ms-chip" data-reset="' + escapeHtml(chip.key) + '">' +
                escapeHtml(chip.label) + ' <i class="fas fa-times"></i></button>';
        }).join('') +
            '<button type="button" class="ms-chip ms-chip--clear" data-reset="all"><i class="fas fa-eraser"></i> Clear all</button>';

        if (els.filterCount) {
            els.filterCount.hidden = false;
            els.filterCount.textContent = String(chips.length);
        }
    }

    function resetFilter(name) {
        switch (name) {
            case 'all':
                resetAllFilters();
                return;
            case 'search':
                if (els.search) els.search.value = '';
                if (els.clearSearch) els.clearSearch.hidden = true;
                break;
            case 'hasTranslations':
            case 'hasAudio':
                if (els[name]) els[name].checked = false;
                break;
            case 'wordsMin':
            case 'wordsMax':
                if (els[name]) els[name].value = '';
                break;
            case 'dateFrom':
            case 'dateTo':
                if (els[name]) els[name].value = '';
                break;
            case 'source':
            case 'language':
            case 'level':
            case 'cefr':
            case 'tag':
                if (els[name]) els[name].value = 'all';
                break;
            default:
                break;
        }
        render();
    }

    function resetAllFilters() {
        if (els.search) els.search.value = '';
        if (els.clearSearch) els.clearSearch.hidden = true;
        ['source', 'language', 'level', 'cefr', 'tag'].forEach(function (key) {
            if (els[key]) els[key].value = 'all';
        });
        ['hasTranslations', 'hasAudio'].forEach(function (key) {
            if (els[key]) els[key].checked = false;
        });
        ['wordsMin', 'wordsMax', 'dateFrom', 'dateTo'].forEach(function (key) {
            if (els[key]) els[key].value = '';
        });
        if (els.sort) els.sort.value = 'newest';
        render();
    }

    /* ----------------------------------------------------------------------
       Actions
       ---------------------------------------------------------------------- */

    function findStory(id) {
        return state.stories.find(function (story) {
            return String(story.id) === String(id);
        });
    }

    function readStory(id) {
        var story = findStory(id);
        if (!story) {
            notify('That story could not be found.', 'error');
            return;
        }

        var translations = state.dictionaries[story.id] || story.translations || {};

        if (ui) {
            ui.openStoryInReader(story, {
                isUserStory: true,
                translations: translations,
                sourceType: sourceType(story),
                sourceFile: story.sourceFile || story.fileName || ''
            });
            return;
        }

        localStorage.setItem('currentReadingStory', JSON.stringify({
            id: story.id,
            title: story.title,
            lang: story.lang || 'en',
            level: story.level,
            content: story.content,
            isUserStory: true,
            cover: story.cover,
            coverType: story.coverType,
            author: story.author || '',
            translations: translations
        }));
        window.location.href = '../reader/index.html?id=' + encodeURIComponent(story.id) + '&userStory=true';
    }

    function editStory(id) {
        window.location.href = '../storiesStudio/index.html?edit=' + encodeURIComponent(id);
    }

    function exportPayload(stories) {
        return {
            stories: stories.map(function (story) {
                var translations = state.dictionaries[story.id] || {};
                var payload = {
                    title: story.title || 'Untitled Story',
                    lang: story.lang || 'en',
                    level: story.level || 'beginner',
                    cover: story.cover || '',
                    coverType: story.coverType || 'emoji',
                    content: Array.isArray(story.content) ? story.content : [String(story.content || '')],
                    author: story.author || 'Anonymous',
                    uploadDate: story.uploadDate || new Date().toISOString(),
                    wordCount: storyWordCount(story),
                    tags: storyTags(story),
                    sourceType: sourceType(story),
                    sourceFile: story.sourceFile || story.fileName || ''
                };

                if (story.levelcefr) payload.levelcefr = story.levelcefr;
                if (story.sound) payload.sound = story.sound;
                if (story.dictionaries) payload.dictionaries = story.dictionaries;
                if (story.audio !== undefined) payload.audio = story.audio;
                if (story.pdfMeta) payload.pdfMeta = story.pdfMeta;
                if (Object.keys(translations).length > 0) payload.translations = translations;

                return payload;
            })
        };
    }

    function storyWordCount(story) {
        if (Number(story.wordCount) > 0) return Number(story.wordCount);
        return wordCount(story.content);
    }

    function downloadJson(data, filename) {
        var blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        var url = URL.createObjectURL(blob);
        var link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    function exportStories(stories) {
        if (!stories.length) return;
        var date = new Date().toISOString().split('T')[0];
        downloadJson(exportPayload(stories), 'my-stories-' + date + '.json');
        notify(stories.length + ' ' + (stories.length === 1 ? 'story' : 'stories') + ' exported as JSON.', 'success');
    }

    async function deleteStory(id) {
        var story = findStory(id);
        if (!story) return;

        var confirmed = window.confirm(
            'Delete "' + (story.title || 'this story') + '"?\n\n' +
            'This removes the story and its custom translations from My Stories. This cannot be undone.'
        );
        if (!confirmed) return;

        try {
            if (ui) {
                await ui.deleteStory(story.id);
            } else {
                state.stories = state.stories.filter(function (item) { return String(item.id) !== String(id); });
                delete state.dictionaries[story.id];
                localStorage.setItem('userStories', JSON.stringify(state.stories));
                localStorage.setItem('userDictionaries', JSON.stringify(state.dictionaries));
            }

            state.stories = state.stories.filter(function (item) { return String(item.id) !== String(id); });
            delete state.dictionaries[story.id];
            populateFilterOptions();
            updateStats();
            render();
            notify('Story deleted.', 'success');
        } catch (error) {
            console.error('[My Stories] delete failed:', error);
            notify('Could not delete the story: ' + error.message, 'error');
        }
    }

    /* ----------------------------------------------------------------------
       Wiring
       ---------------------------------------------------------------------- */

    function cacheElements() {
        els = {
            search: $('msSearch'),
            clearSearch: $('msClearSearch'),
            source: $('msSource'),
            language: $('msLanguage'),
            level: $('msLevel'),
            cefr: $('msCefr'),
            tag: $('msTag'),
            hasTranslations: $('msHasTranslations'),
            hasAudio: $('msHasAudio'),
            wordsMin: $('msWordsMin'),
            wordsMax: $('msWordsMax'),
            dateFrom: $('msDateFrom'),
            dateTo: $('msDateTo'),
            sort: $('msSort'),
            grid: $('msStoriesGrid'),
            empty: $('msEmpty'),
            emptyTitle: $('msEmptyTitle'),
            emptyText: $('msEmptyText'),
            emptyStudio: $('msEmptyStudio'),
            emptyReset: $('msEmptyReset'),
            resultCount: $('msResultCount'),
            activeFilters: $('msActiveFilters'),
            filterCount: $('msFilterCount'),
            filterToggle: $('msFilterToggle'),
            filters: $('msFilters'),
            exportAll: $('msExportAll'),
            statTotal: $('statTotal'),
            statPdf: $('statPdf'),
            statWords: $('statWords'),
            statTranslations: $('statTranslations')
        };
    }

    function setupListeners() {
        var changeInputs = [
            els.source, els.language, els.level, els.cefr, els.tag, els.sort,
            els.dateFrom, els.dateTo, els.hasTranslations, els.hasAudio
        ];

        changeInputs.forEach(function (el) {
            if (el) el.addEventListener('change', render);
        });

        if (els.wordsMin) els.wordsMin.addEventListener('input', debounce(render, 260));
        if (els.wordsMax) els.wordsMax.addEventListener('input', debounce(render, 260));
        if (els.search) {
            els.search.addEventListener('input', function () {
                if (els.clearSearch) els.clearSearch.hidden = !els.search.value;
                debounce(render, 180)();
            });
        }

        if (els.clearSearch) {
            els.clearSearch.addEventListener('click', function () {
                els.search.value = '';
                els.clearSearch.hidden = true;
                render();
            });
        }

        if (els.emptyReset) els.emptyReset.addEventListener('click', resetAllFilters);
        $('msResetFilters') && $('msResetFilters').addEventListener('click', resetAllFilters);

        if (els.filterToggle && els.filters) {
            els.filterToggle.addEventListener('click', function () {
                var open = els.filters.classList.toggle('is-open');
                els.filterToggle.setAttribute('aria-expanded', String(open));
            });
            els.filters.classList.add('is-open');
        }

        if (els.activeFilters) {
            els.activeFilters.addEventListener('click', function (event) {
                var chip = event.target.closest('[data-reset]');
                if (!chip) return;
                resetFilter(chip.dataset.reset);
            });
        }

        if (els.grid) {
            els.grid.addEventListener('click', function (event) {
                var button = event.target.closest('[data-action]');
                if (!button) return;

                var id = button.dataset.id;
                switch (button.dataset.action) {
                    case 'read':
                        readStory(id);
                        break;
                    case 'edit':
                        editStory(id);
                        break;
                    case 'export':
                        exportStories([findStory(id)].filter(Boolean));
                        break;
                    case 'delete':
                        deleteStory(id);
                        break;
                    default:
                        break;
                }
            });
        }

        if (els.exportAll) {
            els.exportAll.addEventListener('click', function () {
                exportStories(state.filtered);
            });
        }
    }

    var debounceTimers = new WeakMap();
    function debounce(fn, delay) {
        return function () {
            var args = arguments;
            var context = this;
            var existing = debounceTimers.get(fn);
            if (existing) clearTimeout(existing);
            var timer = setTimeout(function () {
                debounceTimers.delete(fn);
                fn.apply(context, args);
            }, delay || 200);
            debounceTimers.set(fn, timer);
        };
    }

    document.addEventListener('DOMContentLoaded', function () {
        cacheElements();
        setupListeners();
        loadData();
    });
})();
