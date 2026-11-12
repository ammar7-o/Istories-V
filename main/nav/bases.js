/* ==========================================================================
   bases.js — shared story-base helpers
   ==========================================================================
   The library, the base-manager page and the reading history all need the
   same answer to "where does this base come from?".

   Two kinds of user bases exist:

   • Local bases — a .js file the user picked from their device. The text is
     kept in `localStorySources` (IndexedDB through nav/storage.js) because a
     browser cannot re-open a file path after a reload. Local bases are
     referenced by a stable `localbase:<id>` value in `selectedStoriesFile`,
     reading history, and `?story=` links.

   • Online bases — the existing `customStorySources` list of { url, label }
     entries.

   Base JavaScript is evaluated inside a Web Worker so a database cannot
   touch the page. Only its `window.storiesData` payload is returned.
   ========================================================================== */
(function () {
    'use strict';

    var LOCAL_KEY = 'localStorySources';
    var ONLINE_KEY = 'customStorySources';
    var LOCAL_PREFIX = 'localbase:';
    var WORKER_TIMEOUT_MS = 20000;

    function readJsonArray(key) {
        try {
            var value = JSON.parse(localStorage.getItem(key) || '[]');
            return Array.isArray(value) ? value : [];
        } catch (error) {
            return [];
        }
    }

    function writeJsonArray(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.warn('[bases] Could not save ' + key + ':', error);
            return false;
        }
    }

    function normalizeUrl(value) {
        try {
            var parsed = new URL(String(value || '').trim(), window.location.href);
            if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return null;
            return parsed.href;
        } catch (error) {
            return null;
        }
    }

    function sameUrl(first, second) {
        var a = normalizeUrl(first);
        var b = normalizeUrl(second);
        return !!a && !!b && a === b;
    }

    function makeId() {
        return 'local_' + Date.now().toString(36) + '_' +
            Math.random().toString(36).slice(2, 9);
    }

    function localRef(id) {
        return LOCAL_PREFIX + String(id || '');
    }

    function isLocalRef(value) {
        return String(value || '').indexOf(LOCAL_PREFIX) === 0;
    }

    function localRefId(value) {
        return isLocalRef(value) ? String(value).slice(LOCAL_PREFIX.length) : '';
    }

    function getLocalBases() {
        return readJsonArray(LOCAL_KEY).filter(function (entry) {
            return entry && typeof entry === 'object' &&
                typeof entry.id === 'string' && entry.id &&
                typeof entry.content === 'string' && entry.content;
        });
    }

    function getLocalBase(id) {
        var wanted = String(id || '');
        var bases = getLocalBases();
        for (var i = 0; i < bases.length; i++) {
            if (String(bases[i].id) === wanted) return bases[i];
        }
        return null;
    }

    function uniqueLabel(label, excludeId) {
        var base = String(label || '').trim() || 'Local base';
        var used = getLocalBases().filter(function (entry) {
            return String(entry.id) !== String(excludeId || '');
        }).map(function (entry) {
            return String(entry.label || '').toLowerCase();
        });
        if (used.indexOf(base.toLowerCase()) === -1) return base;
        var index = 2;
        while (used.indexOf((base + ' (' + index + ')').toLowerCase()) !== -1) index++;
        return base + ' (' + index + ')';
    }

    function addLocalBase(options) {
        options = options || {};
        var content = String(options.content || '');
        if (!content.trim()) throw new Error('That base file is empty.');

        var fileName = String(options.fileName || 'base.js').trim() || 'base.js';
        var label = uniqueLabel(options.label || fileName.replace(/\.(?:m?js|json)$/i, ''));
        var entry = {
            id: makeId(),
            label: label,
            fileName: fileName,
            content: content,
            storyCount: Number(options.storyCount) || 0,
            importedAt: new Date().toISOString(),
            size: content.length
        };

        var bases = getLocalBases();
        bases.push(entry);
        if (!writeJsonArray(LOCAL_KEY, bases)) {
            throw new Error('The browser could not save this base. Storage may be full.');
        }
        return entry;
    }

    function removeLocalBase(id) {
        var wanted = String(id || '');
        var bases = getLocalBases();
        var next = bases.filter(function (entry) { return String(entry.id) !== wanted; });
        if (next.length === bases.length) return false;
        return writeJsonArray(LOCAL_KEY, next);
    }

    function getOnlineBases() {
        return readJsonArray(ONLINE_KEY).filter(function (entry) {
            return entry && typeof entry.url === 'string' && normalizeUrl(entry.url);
        }).map(function (entry) {
            return { url: entry.url, label: entry.label || '' };
        });
    }

    function addOnlineBase(url, label) {
        var normalized = normalizeUrl(url);
        if (!normalized) throw new Error('Enter a valid http(s) file URL.');

        var sources = getOnlineBases();
        var existing = null;
        sources.forEach(function (entry) {
            if (!existing && sameUrl(entry.url, normalized)) existing = entry;
        });

        if (existing) {
            if (label && String(label).trim()) existing.label = String(label).trim();
        } else {
            sources.push({
                url: normalized,
                label: String(label || '').trim()
            });
        }
        if (!writeJsonArray(ONLINE_KEY, sources)) {
            throw new Error('The browser could not save this base.');
        }
        return existing || sources[sources.length - 1];
    }

    function removeOnlineBase(url) {
        var sources = getOnlineBases();
        var next = sources.filter(function (entry) { return !sameUrl(entry.url, url); });
        if (next.length === sources.length) return false;
        return writeJsonArray(ONLINE_KEY, next);
    }

    function normalizeStories(data) {
        var list = [];
        if (Array.isArray(data)) {
            list = data;
        } else if (data && typeof data === 'object') {
            if (Array.isArray(data.stories)) list = data.stories;
            else if (Array.isArray(data.story)) list = data.story;
            else if (data.title && data.content) list = [data];
        }
        return list.filter(function (story) {
            return story && typeof story === 'object' && !Array.isArray(story);
        });
    }

    function workerSource() {
        return [
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
            '  catch (error) { self.postMessage({ ok: false, data: null, error: "Could not copy the base out of the sandbox: " + error.message }); }',
            '};'
        ].join('\n');
    }

    function parseInWorker(source) {
        return new Promise(function (resolve, reject) {
            var blobUrl = URL.createObjectURL(new Blob([workerSource()], {
                type: 'text/javascript'
            }));
            var worker;
            var settled = false;
            var timeout;

            function finish(callback, value) {
                if (settled) return;
                settled = true;
                clearTimeout(timeout);
                try { worker.terminate(); } catch (error) { /* ignore */ }
                URL.revokeObjectURL(blobUrl);
                callback(value);
            }

            try {
                worker = new Worker(blobUrl);
            } catch (error) {
                URL.revokeObjectURL(blobUrl);
                reject(error);
                return;
            }

            timeout = setTimeout(function () {
                finish(reject, new Error('The base took too long to load.'));
            }, WORKER_TIMEOUT_MS);

            worker.onmessage = function (event) {
                var payload = event.data || {};
                if (!payload.ok) {
                    finish(reject, new Error(payload.error || 'The base JavaScript could not be read.'));
                    return;
                }
                finish(resolve, payload.data);
            };

            worker.onerror = function (event) {
                finish(reject, new Error(event.message || 'The base could not be read.'));
            };

            worker.postMessage(String(source));
        });
    }

    function parseInMainThread(source) {
        var sandbox = {};
        // Passing these names as parameters means `window.storiesData = …`
        // writes into the sandbox instead of the live page.
        var fn = new Function('window', 'self', 'globalThis',
            String(source) + '\n;return (self && self.storiesData) || (window && window.storiesData);');
        var data = fn(sandbox, sandbox, sandbox);
        if (!data && sandbox.stories) data = sandbox.stories;
        if (!data && sandbox.story) data = sandbox.story;
        return data;
    }

    /**
     * Evaluate a .js base and return { data, stories }.
     * Rejects when the file is empty, throws, or contains no stories.
     */
    function parseBaseText(text) {
        var source = String(text || '');
        if (!source.trim()) return Promise.reject(new Error('That base file is empty.'));

        return parseInWorker(source).catch(function (workerError) {
            // Workers can be unavailable in some file:// or hardened contexts.
            // Fall back to a function-scoped sandbox before giving up.
            try {
                return parseInMainThread(source);
            } catch (error) {
                throw workerError || error;
            }
        }).then(function (data) {
            var stories = normalizeStories(data);
            if (!stories.length) {
                throw new Error('No stories were found. Make sure the file sets window.storiesData.');
            }
            return { data: data, stories: stories };
        });
    }

    window.IStoriesBases = {
        localKey: LOCAL_KEY,
        onlineKey: ONLINE_KEY,
        prefix: LOCAL_PREFIX,
        getLocalBases: getLocalBases,
        getLocalBase: getLocalBase,
        addLocalBase: addLocalBase,
        removeLocalBase: removeLocalBase,
        localRef: localRef,
        isLocalRef: isLocalRef,
        localRefId: localRefId,
        getOnlineBases: getOnlineBases,
        addOnlineBase: addOnlineBase,
        removeOnlineBase: removeOnlineBase,
        normalizeUrl: normalizeUrl,
        sameUrl: sameUrl,
        normalizeStories: normalizeStories,
        parseBaseText: parseBaseText
    };
})();
