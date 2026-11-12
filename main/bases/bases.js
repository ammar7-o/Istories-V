/* Story Bases page — add, open, export and delete the library's story bases. */
(function () {
    'use strict';

    var DEFAULT_SOURCE = '../database/database/main.js';
    var builtins = [];
    var builtinsLoaded = false;
    var pendingFile = null;

    function t(key, vars, fallback) {
        var text = fallback || key;
        if (window.IStoriesI18n && typeof window.IStoriesI18n.t === 'function') {
            var value = window.IStoriesI18n.t(key, vars);
            if (value && value !== key) return value;
        }
        if (vars) {
            Object.keys(vars).forEach(function (name) {
                text = text.replace(new RegExp('\\{' + name + '\\}', 'g'), String(vars[name]));
            });
        }
        return text;
    }

    function notify(message, type) {
        if (typeof showNotification === 'function') {
            showNotification(message, type || 'info');
        }
    }

    function el(tag, className, text) {
        var node = document.createElement(tag);
        if (className) node.className = className;
        if (text !== undefined && text !== null) node.textContent = text;
        return node;
    }

    function icon(name, className) {
        var node = document.createElement('i');
        node.className = 'fas ' + name;
        node.setAttribute('aria-hidden', 'true');
        if (className) node.classList.add(className);
        return node;
    }

    function libraryBase() {
        return new URL('../', window.location.href);
    }

    function absoluteRef(ref) {
        var value = String(ref || '');
        if (window.IStoriesBases && window.IStoriesBases.isLocalRef(value)) return value;
        try {
            return new URL(value, libraryBase()).href;
        } catch (error) {
            return value;
        }
    }

    function sameRef(first, second) {
        var a = String(first || '');
        var b = String(second || '');
        if (!a || !b) return false;
        if (a === b) return true;
        if (window.IStoriesBases && window.IStoriesBases.isLocalRef(a) &&
            window.IStoriesBases.isLocalRef(b)) {
            return a === b;
        }
        return absoluteRef(a) === absoluteRef(b);
    }

    function isSelected(ref) {
        var selected = localStorage.getItem('selectedStoriesFile') || '';
        return !!selected && sameRef(ref, selected);
    }

    function setSelected(ref) {
        try {
            localStorage.setItem('selectedStoriesFile', ref);
        } catch (error) {
            console.warn('[bases] Could not save the selected base:', error);
        }
    }

    function fallbackBuiltins() {
        return [
            { kind: 'builtin', ref: '../database/database/main.js', label: 'English-1', fileName: 'main.js', storyCount: 0 },
            { kind: 'builtin', ref: '../database/database/more/more.js', label: 'English-2', fileName: 'more.js', storyCount: 0 }
        ];
    }

    function normalizeBuiltin(entry) {
        if (!entry) return null;
        var file = entry.file || entry.value;
        if (!file) return null;
        var raw = String(file).trim();
        if (!raw) return null;

        var ref = /^(https?:)?\/\//i.test(raw)
            ? raw
            : '../database/database/' + raw.replace(/^\/+/, '');
        var fileName = raw.split('/').filter(Boolean).pop() || raw;

        return {
            kind: 'builtin',
            ref: ref,
            label: entry.label || fileName,
            fileName: fileName,
            storyCount: 0
        };
    }

    function loadBuiltins() {
        return fetch('../../database/data.json', { cache: 'no-store' })
            .then(function (response) {
                if (!response.ok) throw new Error('HTTP ' + response.status);
                return response.json();
            })
            .then(function (entries) {
                if (!Array.isArray(entries)) return;
                var seen = {};
                entries.forEach(function (entry) {
                    var item = normalizeBuiltin(entry);
                    if (!item) return;
                    var key = absoluteRef(item.ref);
                    if (seen[key]) return;
                    seen[key] = true;
                    builtins.push(item);
                });
            })
            .catch(function (error) {
                console.warn('[bases] Could not load database/data.json:', error);
                builtins = fallbackBuiltins();
            })
            .then(function () {
                if (!builtins.length) builtins = fallbackBuiltins();
                builtinsLoaded = true;
            });
    }

    function localEntries() {
        if (!window.IStoriesBases) return [];
        return window.IStoriesBases.getLocalBases().map(function (entry) {
            return {
                kind: 'local',
                id: entry.id,
                ref: window.IStoriesBases.localRef(entry.id),
                label: entry.label || entry.fileName || 'Local base',
                fileName: entry.fileName || '',
                storyCount: Number(entry.storyCount) || 0,
                size: Number(entry.size) || (entry.content ? entry.content.length : 0),
                content: entry.content || ''
            };
        });
    }

    function onlineEntries() {
        if (!window.IStoriesBases) return [];
        return window.IStoriesBases.getOnlineBases().map(function (entry) {
            var parsed = null;
            try { parsed = new URL(entry.url); } catch (error) { /* ignore */ }
            var fileName = '';
            try {
                fileName = decodeURIComponent(parsed.pathname.split('/').filter(Boolean).pop() || '');
            } catch (error) {
                fileName = '';
            }
            return {
                kind: 'online',
                ref: entry.url,
                url: entry.url,
                label: entry.label || fileName || (parsed && parsed.hostname) || entry.url,
                fileName: fileName || entry.url,
                host: parsed ? parsed.hostname : '',
                storyCount: 0
            };
        });
    }

    function formatSize(bytes) {
        if (!bytes) return '';
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    }

    function kindLabel(entry) {
        if (entry.kind === 'local') return t('bases.local', null, 'Local file');
        if (entry.kind === 'online') return t('bases.online', null, 'Online');
        return t('bases.builtIn', null, 'Built-in');
    }

    function metaText(entry) {
        var parts = [kindLabel(entry)];

        if (entry.kind === 'local') {
            if (entry.fileName) parts.push(entry.fileName);
            if (entry.storyCount) {
                parts.push(t('bases.storyCount', { count: entry.storyCount }, '{count} stories'));
            }
            var size = formatSize(entry.size);
            if (size) parts.push(size);
        } else if (entry.kind === 'online') {
            if (entry.host) parts.push(entry.host);
            if (entry.fileName && entry.fileName !== entry.host) parts.push(entry.fileName);
        } else {
            parts.push(entry.fileName);
        }

        return parts.filter(Boolean).join(' · ');
    }

    function buildRow(entry) {
        var row = el('article', 'base-row');
        if (isSelected(entry.ref)) row.classList.add('is-active');

        var rowIcon = el('span', 'base-row__icon');
        rowIcon.appendChild(icon(entry.kind === 'local' ? 'fa-file-code' :
            (entry.kind === 'online' ? 'fa-cloud' : 'fa-database')));
        row.appendChild(rowIcon);

        var body = el('div', 'base-row__body');
        var titleLine = el('div', 'base-row__title-line');
        var title = el('h3', 'base-row__title', entry.label);
        title.dir = 'auto';
        titleLine.appendChild(title);

        var kind = el('span', 'base-kind base-kind--' + entry.kind,
            entry.kind === 'local' ? t('bases.local', null, 'Local file') :
                (entry.kind === 'online' ? t('bases.online', null, 'Online') :
                    t('bases.builtIn', null, 'Built-in')));
        titleLine.appendChild(kind);
        body.appendChild(titleLine);

        var meta = el('p', 'base-row__meta', metaText(entry));
        meta.dir = 'auto';
        body.appendChild(meta);
        row.appendChild(body);

        var actions = el('div', 'base-row__actions');

        var open = el('a', 'base-btn base-btn--ghost base-btn--small');
        open.href = '../index.html?story=' + encodeURIComponent(entry.ref);
        open.appendChild(icon('fa-book-open'));
        open.appendChild(el('span', null, t('bases.openLibrary', null, 'Open in library')));
        if (isSelected(entry.ref)) open.setAttribute('aria-current', 'true');
        actions.appendChild(open);

        var exportButton = el('button', 'base-btn base-btn--ghost base-btn--small');
        exportButton.type = 'button';
        exportButton.appendChild(icon('fa-download'));
        exportButton.appendChild(el('span', null, t('bases.export', null, 'Export')));
        exportButton.addEventListener('click', function () {
            exportBase(entry, exportButton);
        });
        actions.appendChild(exportButton);

        if (entry.kind !== 'builtin') {
            var deleteButton = el('button', 'base-btn base-btn--danger base-btn--small');
            deleteButton.type = 'button';
            deleteButton.appendChild(icon('fa-trash'));
            deleteButton.appendChild(el('span', null, t('bases.delete', null, 'Delete')));
            deleteButton.addEventListener('click', function () {
                deleteBase(entry);
            });
            actions.appendChild(deleteButton);
        }

        row.appendChild(actions);
        return row;
    }

    function render() {
        var loading = document.getElementById('basesLoading');
        var list = document.getElementById('basesList');
        var empty = document.getElementById('basesEmpty');
        if (!list) return;

        if (!builtinsLoaded) {
            if (loading) loading.hidden = false;
            return;
        }
        if (loading) loading.hidden = true;

        var locals = localEntries();
        var onlines = onlineEntries();
        var rows = builtins.concat(locals).concat(onlines);

        list.innerHTML = '';
        rows.forEach(function (entry) {
            list.appendChild(buildRow(entry));
        });
        list.hidden = rows.length === 0;

        if (empty) {
            empty.hidden = rows.length > 0 && (locals.length + onlines.length) > 0;
            if (rows.length === 0) empty.hidden = false;
        }

        var statBases = document.getElementById('statBases');
        var statLocal = document.getElementById('statLocal');
        var statOnline = document.getElementById('statOnline');
        var statStories = document.getElementById('statStories');
        if (statBases) statBases.textContent = String(rows.length);
        if (statLocal) statLocal.textContent = String(locals.length);
        if (statOnline) statOnline.textContent = String(onlines.length);
        if (statStories) {
            statStories.textContent = String(locals.reduce(function (total, entry) {
                return total + (entry.storyCount || 0);
            }, 0));
        }
    }

    function downloadText(filename, text) {
        var blob = new Blob([text], { type: 'text/javascript;charset=utf-8' });
        var url = URL.createObjectURL(blob);
        var link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        link.remove();
        setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
    }

    function safeFileName(name, fallback) {
        var value = String(name || '')
            .replace(/[\\/:*?"<>|]+/g, '-')
            .replace(/\s+/g, ' ')
            .trim();
        if (!value) value = fallback;
        if (!/\.js$/i.test(value)) value += '.js';
        return value;
    }

    function exportBase(entry, button) {
        var original = button ? button.innerHTML : '';
        if (button) {
            button.disabled = true;
        }

        var finish = function () {
            if (button) {
                button.disabled = false;
                button.innerHTML = original;
            }
        };

        if (entry.kind === 'local') {
            downloadText(safeFileName(entry.fileName || entry.label, 'local-base.js'), entry.content);
            notify(t('bases.exported', { name: entry.label }, 'Exported "{name}".'), 'success');
            finish();
            return;
        }

        fetch(absoluteRef(entry.ref), { cache: 'no-store' })
            .then(function (response) {
                if (!response.ok) throw new Error('HTTP ' + response.status);
                return response.text();
            })
            .then(function (text) {
                downloadText(safeFileName(entry.fileName || entry.label, 'story-base.js'), text);
                notify(t('bases.exported', { name: entry.label }, 'Exported "{name}".'), 'success');
            })
            .catch(function (error) {
                console.warn('[bases] Export failed:', error);
                notify(t('bases.exportFailed', null,
                    'Could not export this base. Open its URL instead.'), 'error');
            })
            .then(finish, finish);
    }

    function deleteBase(entry) {
        if (!window.IStoriesBases) return;

        var message = entry.kind === 'local'
            ? t('bases.deleteLocalConfirm', { name: entry.label },
                'Delete the local base "{name}"? The file will be removed from this browser.')
            : t('bases.deleteOnlineConfirm', { name: entry.label },
                'Remove the online base "{name}" from this list?');

        if (!window.confirm(message)) return;

        if (entry.kind === 'local') {
            window.IStoriesBases.removeLocalBase(entry.id);
        } else {
            window.IStoriesBases.removeOnlineBase(entry.url);
        }

        if (isSelected(entry.ref)) setSelected(DEFAULT_SOURCE);

        notify(t('bases.deleted', null, 'Base deleted.'), 'success');
        render();
    }

    function readFileText(file) {
        if (file && typeof file.text === 'function') return file.text();
        return new Promise(function (resolve, reject) {
            var reader = new FileReader();
            reader.onload = function () { resolve(String(reader.result || '')); };
            reader.onerror = function () { reject(reader.error || new Error('Could not read the file.')); };
            reader.readAsText(file);
        });
    }

    function showError(id, message) {
        var element = document.getElementById(id);
        if (!element) return;
        element.textContent = message || '';
        element.hidden = !message;
    }

    function resetLocalForm() {
        var form = document.getElementById('localBaseForm');
        var fileInput = document.getElementById('localBaseFile');
        var fileName = document.getElementById('localBaseFileName');
        pendingFile = null;
        if (form) form.reset();
        if (fileInput) fileInput.value = '';
        if (fileName) fileName.textContent = t('bases.noFile', null, 'No file chosen yet');
    }

    function setupLocalForm() {
        var form = document.getElementById('localBaseForm');
        var fileInput = document.getElementById('localBaseFile');
        var choose = document.getElementById('localBaseChoose');
        var fileName = document.getElementById('localBaseFileName');
        var nameInput = document.getElementById('localBaseName');
        var submit = document.getElementById('localBaseSubmit');
        if (!form || !fileInput || !choose) return;

        choose.addEventListener('click', function () {
            showError('localBaseError', '');
            fileInput.click();
        });

        fileInput.addEventListener('change', function () {
            pendingFile = fileInput.files && fileInput.files[0] || null;
            if (fileName) {
                fileName.textContent = pendingFile
                    ? pendingFile.name
                    : t('bases.noFile', null, 'No file chosen yet');
            }
            showError('localBaseError', '');
            if (pendingFile && nameInput && !nameInput.value.trim()) {
                nameInput.value = pendingFile.name.replace(/\.(?:m?js|json)$/i, '');
            }
        });

        form.addEventListener('submit', function (event) {
            event.preventDefault();
            showError('localBaseError', '');

            if (!pendingFile) {
                showError('localBaseError', t('bases.noFile', null, 'No file chosen yet'));
                fileInput.click();
                return;
            }
            if (!window.IStoriesBases) {
                showError('localBaseError', t('bases.importFailed', null, 'Could not import that file.'));
                return;
            }

            var labelSpan = submit ? submit.querySelector('span') : null;
            var submitLabel = labelSpan ? labelSpan.textContent : '';
            if (submit) submit.disabled = true;
            if (labelSpan) labelSpan.textContent = t('bases.importing', null, 'Reading the base…');

            var file = pendingFile;
            readFileText(file)
                .then(function (text) {
                    return window.IStoriesBases.parseBaseText(text).then(function (parsed) {
                        return window.IStoriesBases.addLocalBase({
                            label: nameInput && nameInput.value.trim(),
                            fileName: file.name,
                            content: text,
                            storyCount: parsed.stories.length
                        });
                    });
                })
                .then(function (entry) {
                    notify(t('bases.importedOk', { name: entry.label, count: entry.storyCount },
                        'Added "{name}" with {count} stories.'), 'success');
                    resetLocalForm();
                    render();
                })
                .catch(function (error) {
                    var reason = error && error.message ? ' ' + error.message : '';
                    showError('localBaseError',
                        t('bases.importFailed', null, 'Could not import that file.') + reason);
                })
                .then(function () {
                    if (submit) submit.disabled = false;
                    if (labelSpan) labelSpan.textContent = submitLabel;
                });
        });
    }

    function setupOnlineForm() {
        var form = document.getElementById('onlineBaseForm');
        var urlInput = document.getElementById('onlineBaseUrl');
        var labelInput = document.getElementById('onlineBaseLabel');
        var submit = document.getElementById('onlineBaseSubmit');
        if (!form || !urlInput) return;

        form.addEventListener('submit', function (event) {
            event.preventDefault();
            showError('onlineBaseError', '');

            if (!window.IStoriesBases) {
                showError('onlineBaseError', t('bases.invalidUrl', null,
                    'Enter a valid http(s) file URL.'));
                return;
            }

            var url = urlInput.value.trim();
            var existed = window.IStoriesBases.getOnlineBases().some(function (entry) {
                return window.IStoriesBases.sameUrl(entry.url, url);
            });

            try {
                window.IStoriesBases.addOnlineBase(url, labelInput ? labelInput.value : '');
                notify(t(existed ? 'bases.onlineExists' : 'bases.onlineAdded', null,
                    existed ? 'That online base is already saved.' : 'Online base saved.'),
                    existed ? 'info' : 'success');
                form.reset();
                render();
            } catch (error) {
                var reason = error && error.message ? ' ' + error.message : '';
                showError('onlineBaseError',
                    t('bases.invalidUrl', null, 'Enter a valid http(s) file URL.') + reason);
            }
        });

        if (submit) {
            submit.addEventListener('click', function () { showError('onlineBaseError', ''); });
        }
    }

    function init() {
        setupLocalForm();
        setupOnlineForm();
        render();

        loadBuiltins().then(render);

        document.addEventListener('ist-language-change', render);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
