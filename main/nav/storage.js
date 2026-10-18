/* ==========================================================================
   storage.js — IndexedDB storage for IStories' large data collections.

   Why this exists
   ---------------
   localStorage is capped at ~5 MB and only stores strings, so the growing
   collections — uploaded stories, saved words, user quizzes, dictionaries,
   reading history, the currently-open story and a base64 profile photo — can
   blow the quota. Those keys now live in IndexedDB through localForage
   (vendored in nav/vendor/localforage.min.js). Small, synchronous settings
   (theme, colour swatches, font size, feature flags, …) stay in localStorage
   so they can still be read synchronously before first paint.

   How it stays backwards compatible
   ---------------------------------
   Everything (including the large keys) is still read/written through the
   ordinary `localStorage.getItem/setItem/removeItem/clear` calls. This file
   patches the Storage prototype so that, for the DATA_KEYS below, those calls
   are transparently served from an in-memory mirror that is hydrated from
   IndexedDB and written back to it (write-through). Non-data keys fall
   straight through to the real localStorage, unchanged.

   Readiness
   ---------
   IndexedDB is asynchronous, so the mirror cannot be ready the instant the
   parser reaches a page's own <script>. To keep the existing synchronous code
   working, this file also wraps `document.addEventListener` so that any
   `DOMContentLoaded` handler — where pages do their initialisation — runs only
   after the mirror has hydrated. Pages that seed a global from a data key at
   parse time (e.g. `let savedWords = JSON.parse(localStorage.getItem(...))`)
   re-run that same line via `IStoriesStorage.whenReady(...)` so the global is
   refreshed before init uses it.

   Any write that happens before hydration finishes is buffered and flushed in
   order, so nothing is lost regardless of timing.

   Load order (every page that stores user data): this file must be included
   before any page script, right after localforage:

       <script src="…/nav/vendor/localforage.min.js"></script>
       <script src="…/nav/storage.js"></script>
   ========================================================================== */
(function () {
    'use strict';

    /* ----------------------------------------------------------------------
       Configuration
       ---------------------------------------------------------------------- */

    // Keys that belong in IndexedDB: large / unbounded user data. Preferences
    // (theme, colours, font, flags) deliberately stay in localStorage.
    var DATA_KEYS = [
        'userStories',
        'savedWords',
        'userQuizzes',
        'quizzes',
        'quizHistory',
        'userDictionaries',
        'readingHistory',
        'currentReadingStory',
        'profilePhoto'
    ];

    var DB_NAME = 'IStoriesDB';
    var STORE_NAME = 'istories';

    // Safety net: never let a stuck IndexedDB block a page forever.
    var HYDRATION_TIMEOUT_MS = 6000;

    var DATA_SET = Object.create(null);
    DATA_KEYS.forEach(function (key) { DATA_SET[key] = true; });

    /* ----------------------------------------------------------------------
       State
       ---------------------------------------------------------------------- */

    var db = null;                          // localForage instance
    var cache = Object.create(null);        // synchronous mirror: key -> string
    var dirty = Object.create(null);        // keys written before hydration
    var pending = [];                       // buffered mutations before hydration
    var writeChain = Promise.resolve();     // serialises writes (keeps order)
    var hydrated = false;

    var readyResolve;
    var readyPromise = new Promise(function (resolve) { readyResolve = resolve; });

    var nativeLS = null;
    try { nativeLS = window.localStorage; } catch (error) { nativeLS = null; }

    // The real Storage methods, captured before installFacade() patches the
    // prototype. Internal code (e.g. migration) must use these to touch the
    // *actual* localStorage rather than the facade.
    var StorageProto = window.Storage && window.Storage.prototype;
    var nativeGetItem = StorageProto ? StorageProto.getItem : null;
    var nativeSetItem = StorageProto ? StorageProto.setItem : null;
    var nativeRemoveItem = StorageProto ? StorageProto.removeItem : null;
    var nativeClear = StorageProto ? StorageProto.clear : null;

    function warn() {
        if (window.console && console.warn) {
            console.warn.apply(console, ['[IStories storage]'].concat([].slice.call(arguments)));
        }
    }

    function isDataKey(key) { return DATA_SET[String(key)] === true; }

    /* ----------------------------------------------------------------------
       Synchronous mirror
       ---------------------------------------------------------------------- */

    function getSync(key) {
        var value = cache[String(key)];
        return value === undefined ? null : value;
    }

    function setSync(key, value) {
        key = String(key);
        value = String(value);
        cache[key] = value;

        if (!hydrated) {
            dirty[key] = true;
            pending.push({ type: 'set', key: key, value: value });
            return;
        }
        enqueueWrite(function (instance) { return instance.setItem(key, value); });
    }

    function removeSync(key) {
        key = String(key);
        delete cache[key];

        if (!hydrated) {
            dirty[key] = true;
            pending.push({ type: 'remove', key: key });
            return;
        }
        enqueueWrite(function (instance) { return instance.removeItem(key); });
    }

    // Serialise writes so concurrent set/remove calls keep their relative order.
    function enqueueWrite(fn) {
        writeChain = writeChain
            .then(function () { return db ? fn(db) : null; })
            .catch(warn);
        return writeChain;
    }

    function flushPending() {
        var ops = pending;
        pending = [];
        ops.forEach(function (op) {
            if (op.type === 'set') {
                enqueueWrite(function (instance) { return instance.setItem(op.key, op.value); });
            } else {
                enqueueWrite(function (instance) { return instance.removeItem(op.key); });
            }
        });
    }

    function finishHydration(ok) {
        if (hydrated) return;
        hydrated = true;
        flushPending();
        readyResolve(ok);
        window.dispatchEvent(new CustomEvent('ist-storage-ready', { detail: { ok: ok } }));
    }

    /* ----------------------------------------------------------------------
       Hydration + one-time migration of existing localStorage data
       ---------------------------------------------------------------------- */

    function migrateFromLocalStorage() {
        if (!nativeLS || !nativeGetItem || !nativeRemoveItem) return Promise.resolve();
        var jobs = [];
        DATA_KEYS.forEach(function (key) {
            var raw = null;
            try { raw = nativeGetItem.call(nativeLS, key); } catch (error) { raw = null; }
            if (raw === null) return;

            // Prefer the IndexedDB copy; otherwise adopt the localStorage one.
            if (cache[key] === undefined && !dirty[key]) {
                cache[key] = raw;
                jobs.push(db.setItem(key, raw));
            }
            // Remove the native copy through the ORIGINAL method, otherwise the
            // patched prototype would route this back into the mirror/IndexedDB.
            try { nativeRemoveItem.call(nativeLS, key); } catch (error) { /* ignore */ }
        });
        return Promise.all(jobs);
    }

    function hydrate() {
        if (typeof localforage === 'undefined') {
            warn('localforage not found; large data will not be persisted to IndexedDB.');
            finishHydration(false);
            return;
        }

        db = localforage.createInstance({ name: DB_NAME, storeName: STORE_NAME });

        db.setDriver([localforage.INDEXEDDB, localforage.WEBSQL, localforage.LOCALSTORAGE])
            .catch(function () { /* keep whatever driver localforage picked */ })
            .then(function () {
                return db.iterate(function (value, key) {
                    if (!dirty[key]) cache[key] = value;   // pre-hydration writes win
                });
            })
            .then(migrateFromLocalStorage)
            .then(function () { finishHydration(true); })
            .catch(function (error) {
                warn('IndexedDB initialisation failed:', error);
                finishHydration(false);
            });

        setTimeout(function () {
            if (!hydrated) warn('hydration timed out; continuing without waiting.');
            finishHydration(false);
        }, HYDRATION_TIMEOUT_MS);
    }

    /* ----------------------------------------------------------------------
       Transparent localStorage facade (patches the Storage prototype)
       ---------------------------------------------------------------------- */

    function installFacade() {
        if (!StorageProto || !nativeGetItem) return;

        function isLocal(target) { return nativeLS !== null && target === nativeLS; }

        try {
            Object.defineProperty(StorageProto, 'getItem', {
                configurable: true, writable: true,
                value: function (key) {
                    if (isLocal(this) && isDataKey(key)) return getSync(key);
                    return nativeGetItem.apply(this, arguments);
                }
            });
            Object.defineProperty(StorageProto, 'setItem', {
                configurable: true, writable: true,
                value: function (key, value) {
                    if (isLocal(this) && isDataKey(key)) return setSync(key, value);
                    return nativeSetItem.apply(this, arguments);
                }
            });
            Object.defineProperty(StorageProto, 'removeItem', {
                configurable: true, writable: true,
                value: function (key) {
                    if (isLocal(this) && isDataKey(key)) return removeSync(key);
                    return nativeRemoveItem.apply(this, arguments);
                }
            });
            Object.defineProperty(StorageProto, 'clear', {
                configurable: true, writable: true,
                value: function () {
                    if (isLocal(this)) DATA_KEYS.forEach(function (key) { removeSync(key); });
                    return nativeClear.apply(this, arguments);
                }
            });
        } catch (error) {
            warn('could not install the localStorage facade:', error);
        }
    }

    // Defer every DOMContentLoaded handler until the mirror is hydrated, so
    // pages that touch a data key during initialisation see the real values.
    function installReadyGate() {
        var originalAdd = document.addEventListener;
        if (typeof originalAdd !== 'function') return;

        document.addEventListener = function (type, listener, options) {
            if (type === 'DOMContentLoaded' && typeof listener === 'function') {
                return originalAdd.call(document, type, function (event) {
                    readyPromise.then(function () {
                        try { listener.call(document, event); }
                        catch (error) { warn('DOMContentLoaded handler failed:', error); }
                    });
                }, options);
            }
            return originalAdd.apply(document, arguments);
        };
    }

    /* ----------------------------------------------------------------------
       Public API
       ---------------------------------------------------------------------- */

    window.IStoriesStorage = {
        /** Resolves (true when IndexedDB is in use) once the mirror is ready. */
        ready: readyPromise,

        /** Keys stored in IndexedDB. */
        dataKeys: DATA_KEYS.slice(),

        isDataKey: isDataKey,

        /** Synchronous read from the mirror (null until hydration completes). */
        getItemSync: getSync,

        /** Promise-based read, resolved after hydration. */
        getItem: function (key) {
            return readyPromise.then(function () { return getSync(key); });
        },

        /** Write-through helpers for call sites that prefer an explicit API. */
        setItem: function (key, value) { setSync(key, value); return readyPromise; },

        removeItem: function (key) { removeSync(key); return readyPromise; },

        /** Resolves once every queued IndexedDB write has been committed. */
        flush: function () { return writeChain.then(function () { return undefined; }); },

        /** Run `fn` once the mirror is hydrated (immediately if already ready). */
        whenReady: function (fn) {
            return readyPromise.then(function () {
                try { return fn(); } catch (error) { warn('whenReady callback failed:', error); }
            });
        },

        /** Key/value snapshot of everything in IndexedDB (after hydration). */
        entries: function () {
            return readyPromise.then(function () {
                var out = Object.create(null);
                Object.keys(cache).forEach(function (key) { out[key] = cache[key]; });
                return out;
            });
        }
    };

    installFacade();
    installReadyGate();
    hydrate();
})();
