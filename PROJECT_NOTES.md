# IStories — Project Notes

Session memory for the `IStories-V` app. Keep this file up to date when the
architecture, data schema, or offline-translation stack changes.

---

## 1. What this project is

IStories is a **static, no-build web app** for learning languages by reading
interactive stories. You click a word to see its translation/definition, build
a vocabulary list, take quizzes, and use flashcards. There is no bundler, no
package manager, and no backend: it is plain HTML/CSS/JS served as files, and
all user data lives in `localStorage`.

- **Entry point:** `index.html` (landing page)
- **Main library:** `English/index.html`
- **Story reader:** `English/reader/index.html`
- **Serving:** any static file server (e.g. `python3 -m http.server`). A
  service worker (`sw.js`) provides offline shell + asset caching.

### Directory layout

```
index.html                 Landing page (sidebar + service worker registration)
sw.js                      Service worker (cache-first, scope-relative)
manifest.json              PWA manifest
nav/                       Shared sidebar (sidebar.js + sidebar.css)
translate/                 Offline neural translation engine (ES module)
scripts/                   fetch_offline_assets.py (vendor downloader)
vendor/                    Transformers.js + ONNX Runtime WASM + models (offline)
English/
  index.html               Story library (Add/Edit story forms live here)
  database/                Built-in story data: main.js, more.js
  main/                    Library logic: main.js, addstories.js, other.js, custumecss.js
  reader/                  Reader: index.html + scripts/{main,settings,thems,offline-translation}.js
  vocabulary/              Saved-words page
  flashcard/               Flashcard page
  quiz/                    Quiz page (+ database/, scripts/)
  Dictionarys/             Per-story dictionary JSON
  sounds/                  Story audio (mp3)
store/                     Community "story store" (stories.js, stories2.js, main.js)
tools/                     Extra tools, incl. All-tools/local-translator.html (offline MT demo)
fonts/, font-awesome/, imges/   Static assets
hh.js                      Orphaned scratch file — see Known issues
```

---

## 2. Story data schema

Stories are plain objects. Built-in stories live in
`English/database/main.js` (`window.storiesData`) and `English/database/more.js`;
store stories live in `store/stories.js` and `store/stories2.js`.

```js
{
  id: 1,
  language: "en",              // ISO-639-1 (optionally with region, e.g. "ar-SA")
  title: "The Beginning of Everything",
  level: "beginner",           // beginner | intermediate | advanced
  levelcefr: "A2",             // CEFR label (may be null)
  cover: "../imges/story1.jpg",// image path OR an emoji string
  coverType: "image",          // "image" | "emoji"
  sound: "../sounds/story1.mp3",
  author: "Istories",
  dictionaries: ["../Dictionarys/story1.json"],
  content: [                    // array of HTML paragraph strings
    "Hello and welcome to <span class='mark'>IStories!</span> ...",
  ],
  wordCount: 230,
  audio: null                   // optional
}
```

### The `language` field (added this session)

`language` records the **source language of the story text** and drives which
offline translation direction is possible.

- Added to **all 28 built-in + store stories**:
  `English/database/main.js` (9), `English/database/more.js` (5),
  `store/stories.js` (13), `store/stories2.js` (1).
- Values are `"en"` for everything except **`"Le Début de Tout"`** and
  **`"la polygamie"`**, which are `"fr"`.
- Defaults to `"en"` everywhere it is written (form submit, edits, exports,
  store save/download, fallback story).
- Wired through:
  - `English/main/addstories.js` — form submit, edit fill/save,
    `validateStory` (regex `^[a-z]{2}(-[A-Za-z]{2,4})?$`), `processSingleStory`,
    template, export-all.
  - `English/main/main.js` — `openStoryInNewPage` copies it into the reading
    payload.
  - `store/main.js` — save, download, fallback story.
  - `English/index.html` — Add form `#storyLanguage`, Edit form
    `#editStoryLanguage` (both `<select>`).
- The reader sets `window.IStoriesCurrentStory`, `data-story-language` on the
  root, and shows a small language badge (`#lvlLang`). It tolerates a
  non-array `content`.

---

## 3. Storage keys (`localStorage`)

All state is client-side. Frequently used keys:

| Key | Purpose |
| --- | --- |
| `userStories` | User-authored stories (array) |
| `userDictionaries` | Per-story user dictionaries (object) |
| `currentReadingStory` | Story payload handed to the reader |
| `defaultTranslateLanguage` | Target language for translation (**default `'ar'`**) |
| `offlineTranslationEnabled` | Use the on-device model (**default `'true'`**) |
| `paragraphTranslationEnabled` | Translate whole paragraphs |
| `autoTranslateEnabled` | Auto-translate on word click |
| `noTranslatedWords` | Hide/skip certain words |
| `savedWords` | Vocabulary list (array) |
| `theme`, `selectedColor`, `selectedSecondaryColor` | Appearance |
| `fontFamily`, `fontSize`, `lineHeight` | Reader typography |
| `customCSS`, `customCSSHome`, `customCSSquiz` | Per-area custom CSS |
| `ttsEnabled`, `speechEnabled` | Text-to-speech |
| `readingPosition`, `readingHistory` | Progress |
| `profileName`, `profilePhoto` | Profile |
| `userStats`, `lastBonusDate` | Gamification |
| `userQuizzes`, `quizzes`, `quizHistory` | Quiz data |
| `showUserStories`, `showUserQuizzes`, `showVoiceButtons` | Toggles |

---

## 4. Sidebar navigation (replaces the old dropdown)

Before: every page duplicated a dropdown menu (`#more`) with its own link list
and stylesheet. Now there is **one shared sidebar**.

- **Files:** `nav/sidebar.css` + `nav/sidebar.js` (classic scripts, no build).
- **Include once per page:**
  ```html
  <link rel="stylesheet" href="<rel>/nav/sidebar.css">
  <script src="<rel>/nav/sidebar.js" defer></script>
  ```
  Included in: root `index.html`, `English/index.html`,
  `English/{reader,vocabulary,flashcard,quiz}/index.html`, `store/index.html`,
  `tools/index.html`, and the three `tools/All-tools/*.html` pages.
- **Behaviour:**
  - Hides the legacy `#more` dropdown (`.ist-legacy-hidden`).
  - Reuses the page's existing `#toggle-nav` as the trigger and injects a
    burger (`.ist-burger`) only on pages that lack one (root/reader). Because
    some pages put `id="toggle-nav"` on both an `<li>` and its inner `<a>`,
    `findTriggers()` keeps only the outermost element to avoid double-toggling.
  - Computes every link relative to the site root via `new URL('../', script.src)`,
    so the same file works at any base path / sub-folder.
  - Marks the current page active; supports "action" items
    (`Add Stories`, `Profile`) that click `[data-page="..."]` inside
    `English/index.html`, plus footer actions (`#theme`, `#top`).
  - Overlay, Esc-to-close, focus restore, deep links
    (`English/index.html#addStories`).
- **Per-page override:** set `window.ISTORIES_SIDEBAR = { items: [...] }`
  before the script runs.
- **Programmatic API:** `window.IStoriesSidebar.{open,close,toggle,isOpen,config}`.

---

## 5. Offline (on-device) Arabic translation

Goal: translate the story/word to Arabic **without any network**, using a real
neural MT model — not a bundled dictionary. "Offline first, Google fallback."

### Stack

- **Runtime:** Transformers.js `3.7.5` browser bundle + ONNX Runtime Web WASM.
- **Model:** `Xenova/nllb-200-distilled-600M` — Meta's **NLLB-200** (distilled,
  600M) quantized to `dtype: 'q8'`. It is **one multilingual model** that
  serves every declared pair; each `MODELS` key just carries the FLORES-200
  `srcLang`/`tgtLang` codes the tokenizer needs:

  | key | direction | `srcLang` | `tgtLang` |
  | --- | --- | --- | --- |
  | `en-ar` | English → Arabic | `eng_Latn` | `arb_Arab` |
  | `fr-ar` | French → Arabic | `fra_Latn` | `arb_Arab` |
  | `ar-en` | Arabic → English | `arb_Arab` | `eng_Latn` |

  Because the weights are shared, the engine caches **one pipeline per model
  id** (not per pair) and passes `src_lang`/`tgt_lang` on every call.
- Everything is **vendored under `vendor/`** so runtime never touches a CDN.

### Vendored assets & the fetch script

```
vendor/transformers/transformers.min.js                       (Transformers.js)
vendor/transformers/ort.bundle.min.mjs                        (ONNX Runtime)
vendor/transformers/ort-wasm-simd-threaded.jsep.mjs           (ORT WASM glue)
vendor/transformers/ort-wasm-simd-threaded.jsep.wasm          (~21.6 MB)
vendor/models/Xenova/nllb-200-distilled-600M/                 (tokenizer + onnx/)
    sentencepiece.bpe.model                                    (~4.6 MB)
    tokenizer.json                                             (~16.5 MB)
    onnx/encoder_model_quantized.onnx                          (~400 MB)
    onnx/decoder_model_merged_quantized.onnx                   (~453 MB)
```

Re-download (only Python standard library needed; resumable, skips complete files):

```bash
python3 scripts/fetch_offline_assets.py --all          # lib + default model
python3 scripts/fetch_offline_assets.py --lib          # runtime only
python3 scripts/fetch_offline_assets.py --model Xenova/nllb-200-distilled-600M
python3 scripts/fetch_offline_assets.py --list
```

### Module map

| File | Role |
| --- | --- |
| `translate/offline-translator.js` | **ES module.** `LocalTranslator`, `localTranslator` singleton, `MODELS`, `toPlainText`, `isRtl`, `languageName`, error classes. Lazily imported. |
| `English/reader/scripts/offline-translation.js` | **Classic script bridge.** Exposes `window.IStoriesMT` and wires the reader settings UI. |
| `English/reader/scripts/settings.js` | `translateOfflineFirst()` helper; word (`translateWordToLanguage`) and paragraph paths prefer offline. |
| `English/reader/scripts/main.js` | `translateWordWithGoogle` tries offline first, then Google. |
| `tools/All-tools/local-translator.html` | Standalone page to test the local model. |

### `window.IStoriesMT` API

```
isEnabled() / setEnabled(bool)
sourceLanguage()                 // from current story's `language`
targetLanguage()                 // defaultTranslateLanguage (default "ar")
supports(from, to)               // is a local model shipped for this pair?
translate(text, {from,to})       -> Promise<string>
translateSmart(text, {from,to})  -> Promise<{text,engine,from,to}|null>
preload({from,to,onProgress})    -> Promise<void>
status()
subscribe(fn)
isRtl(code)
```

Callers use `const r = await IStoriesMT.translateSmart(...); if (r && r.text) ...`
and otherwise fall through to Google Translate.

### How the "no CDN" guarantee works

Inside the transformers bundle (`backends/onnx.js`):

```js
c = <ORT module>;  // browser branch: the bundled ORT namespace
const M = c?.env;
M?.wasm && (M.wasm.wasmPaths || (M.wasm.wasmPaths = `https://cdn.jsdelivr.net/...`), M.wasm.proxy = false);
s.env.backends.onnx = M;
```

The library only sets the CDN default when `wasmPaths` is falsy, and it uses a
**string prefix** (must end in `/`). `LocalTranslator._configureOrt()` sets
`env.backends.onnx.wasm.wasmPaths = <vendor/transformers/>` (trailing slash),
`proxy = false`, and `numThreads` (1 unless `crossOriginIsolated`).

To be robust against builds that attach the backend **lazily**,
`_trapOnnxBackend()` redefines `env.backends.onnx` as a getter/setter so the
config is (re)applied whenever the library assigns it — overriding the CDN
default. `load()` also calls the trap again just before `pipeline()`.

> Verified: the browser build attaches `env.backends.onnx` at import time, so
> the post-import override suffices; the trap covers the lazy path too.

Other env config: `allowLocalModels = true`, `allowRemoteModels = false`
(opt in with `allowRemote`), `localModelPath = vendor/models/`,
`useBrowserCache = true`.

### Limitations / caveats

- **Offline pairs are fixed:** `en→ar`, `fr→ar`, `ar→en`. Any other target
  falls back to Google Translate (needs network).
- **First run loads ~875 MB** from disk (cached by the SW afterwards). The
  settings panel has an "prepare model" button with a progress bar.
- **`makeWordsClickable()` in the reader uses a Latin-only regex**, so Arabic
  output is not tokenized for click-to-translate. Relevant for future RTL work.
- Rendering of RTL targets is handled ad-hoc (`isRtl`, `dir` attributes); the
  `manifest.json` stays `lang:"en"` / `dir:"ltr"` because the app UI is English.

---

## 6. Service worker (`sw.js`)

Rewritten this session (cache name `istories-shell-v6`). Key points:

- **Scope-relative paths** (`./...`) so it works at `/`, `/Istories-V/`, or any
  sub-folder. The old version hard-coded `/Istories-V`, which broke elsewhere.
- Pre-caches a small **app shell** (HTML pages, sidebar, reader scripts, story
  data) at install; tolerates individual 404s.
- **Runtime-caches** code/data and, separately, `vendor/` assets
  (`istories-runtime-*`, self-trimming at 80 entries) so a used model stays
  offline **without** triggering a ~875 MB download during install.
- Skips `Range` requests (audio/video seeking) and cross-origin requests.
- Falls back to the cached `index.html` shell for offline navigations.
- `activate` deletes old cache versions; `message: SKIP_WAITING` supported.
- Registration in `index.html` was fixed (removed an undefined `BASE` variable).

---

## 7. Known issues / follow-ups

- `hh.js` (root) has a **pre-existing syntax error** and is orphaned
  (unreferenced by any page). Safe to ignore or delete.
- The old `sw.js` referenced a non-existent `French/` folder; the rewrite
  dropped it. There is now no `French/` directory.
- `manifest.json` `shortcuts`/`file_handlers`/`share_target` point at routes
  (`/stories`, `/open`, `/share`) that this static app does not implement.
- Optional polish: a short `translate/README.md`; RTL tokenization for Arabic.

## 8. Conventions

- Plain `<script>` tags (classic scripts) for pages; ES modules only for
  `translate/offline-translator.js`, imported dynamically.
- Keep paths **relative** (works from sub-folders and any base path).
- Anything user-facing that persists goes through `localStorage`.
- Comments/docs follow the existing `/** ... */` banner style.

---

## 9. Update log

### 2026-10-16 — folder rename `English/` → `main/`

The whole app tree was renamed from `English/` to `main/`, so **every
`English/...` path in this document now means `main/...`**. Current layout:

```
index.html                 Landing page (sidebar + SW registration)
main/index.html            Story library / home app
main/{vocabulary,flashcard,quiz,reader}/index.html
main/main/*.js             main.js, addstories.js, other.js, custumecss.js
main/{database,Dictionarys,sounds}/...
store/  tools/  nav/  translate/  vendor/  font-awesome/
```

The sidebar `DEFAULT_CONFIG` in `nav/sidebar.js` already uses `main/...`
paths, which are correct for this layout.

### 2026-10-16 — sidebar fixes

1. **Include paths on nested pages were wrong (sidebar missing).**
   `main/vocabulary|flashcard|quiz|reader/index.html` are two levels deep
   but used `../nav/sidebar.css|js`, which resolved to the non-existent
   `main/nav/` (404) — so the sidebar never loaded there.
   Fixed to `../../nav/sidebar.css|js`.
   *Rule:* a page inside `main/<sub>/` needs `../../nav/`; a page directly
   in `main/`, `store/`, `tools/`, `font-awesome/` needs `../nav/`.

2. **`switchPage()` threw on the main page (`navLinks` undefined).**
   `main/main/addstories.js#switchPage` used `navLinks`, but only
   `flashcard/quiz/vocabulary/reader` declared it. Added
   `const navLinks = document.querySelectorAll('.nav-link')` to
   `main/main/main.js`, and hardened `switchPage` to guard a missing
   target id / `navLinks` / `loadFlashcards` / `loadUserStories`.
   (Previously `switchPage('stories')` also threw — there is no `#stories`
   page; the three real pages are `#home`, `#profile-settings`,
   `#addStories`.)

3. **Sidebar `Add Stories` / `Profile` actions now work.**
   `nav/sidebar.js#runAction` first tries `window.switchPage(id)` when the
   page element exists (main page), then falls back to `[data-page=...]`.
   Action items resolve to `main/index.html#addStories` /
   `main/index.html#profile-settings`; the `location.hash` deep-link handler
   in `wire()` triggers them on load from other pages.

   Verified in a real (headless) browser: the sidebar renders docked on
   `main/{vocabulary,quiz,flashcard,reader}/index.html`, and clicking the
   sidebar **Add Stories** / **Profile** links toggles
   `#addStories` / `#profile-settings` `.active` on `main/index.html`.

> Note: do not `pkill firefox`/`firefox-bin` while the user has a browser
> open — verify with an isolated instance instead
> (`firefox --headless --no-remote --new-instance --profile <tmpdir> URL`).

### 2026-10-16 — "forest & cream" visual theme

New file **`nav/theme.css`**, linked **last** in `<head>` on all 13 pages.
It only re-maps the existing colour tokens (no layout changes).

Palette (sampled from the reference design):

| token | value | use |
| --- | --- | --- |
| forest | `#243d34` | sidebar bg, primary, headings |
| forest-soft | `#3b4f44` | sidebar hover / active pill |
| cream | `#f9f7f0` | page background |
| sand | `#edeae3` | cards / panels (`--bg`, `--card-bg`) |
| sand-deep | `#e2ddcf` | borders |
| peach | `#d38d70` | secondary / accent |
| peach-light | `#edb995` | sidebar active text/icon |
| muted | `#67756c` | secondary text |

Key points:

- Page = cream, surfaces = sand. `.story-card` etc. already use `var(--bg)`,
  so `--bg` is set to sand and `body`/`.container` are pinned to cream.
- Sidebar: the `--ist-sidebar-*` vars are re-declared on `.ist-sidebar`
  (forest bg, cream text, peach accent) so they beat `sidebar.css`'s
  `:root` defaults regardless of load order. Width stays **288px**.
- Every page's colour picker (`applyPrimaryColor`) sets `--primary`
  **inline** from `localStorage.selectedColor`, which beats stylesheets.
  So the fallback defaults were changed from `#4f46e5`/`#10b981` to
  `#243d34`/`#d38d70` in: `index.html` (inline script), `store/main.js`,
  `tools/main.js`, `main/{main/other.js,flashcard/main.js,vocabulary/main.js,
  quiz/scripts/main.js,reader/scripts/main.js,reader/scripts/thems.js}`, and
  the "reset defaults" objects in the four `custumecss.js`/`settings.js`.
- The first colour-swatch in `main/index.html` was changed to the forest
  green (title "Forest") and the first secondary swatch to peach.
- Dark mode (`body.dark-mode`) is untouched: all overrides are guarded with
  `body:not(.dark-mode)`. `tools/hh.html` (standalone "Dark Text Analyzer",
  unlinked) therefore stays dark.

Verified by reading computed styles in a headless browser: `bodyBg`
`rgb(249,247,240)`, `sidebarBg` `rgb(36,61,52)`, `--primary #243d34`,
`--bg #edeae3`, `.story-card` `rgb(237,234,227)`, hero = forest gradient.

### 2026-10-16 — offline MT model swap: OPUS-MT → NLLB-200

The old `Xenova/opus-mt-en-ar` (and its `fr-ar`/`ar-en` siblings) translated
poorly. Replaced with Meta's **NLLB-200 distilled 600M**
(`Xenova/nllb-200-distilled-600M`), a single multilingual model (~875 MB,
`q8`) that covers all three pairs and is a large quality jump for Arabic.
Only the translation model changed — no UI or theme changes.

- `translate/offline-translator.js`: `MODELS` now points all three keys at the
  NLLB repo and adds `srcLang`/`tgtLang` (FLORES-200) per pair; `translate()`
  passes `src_lang`/`tgt_lang` to the pipeline (required by the NLLB
  tokenizer's `_build_translation_inputs`). Pipelines are now cached **by
  model id** (shared across pairs) instead of by pair, so the ~875 MB weights
  load once. `isReady()`/`status()` updated to match.
- `scripts/fetch_offline_assets.py`: per-architecture file lists
  (`OPUS_MODEL_FILES` vs `NLLB_MODEL_FILES` — NLLB ships
  `sentencepiece.bpe.model`, no `vocab.json`/`source.spm`/`target.spm`);
  `DEFAULT_MODEL = Xenova/nllb-200-distilled-600M`; `--all`/`--default-model`
  and the docstring updated. Legacy opus ids remain installable.
- `sw.js`: bumped `CACHE_VERSION` `v5 → v6` so the cache-first service worker
  serves the *new* engine (otherwise returning users keep the old one).
- Docs/UI: `translate/README.md`, `tools/All-tools/local-translator.html`
  ("Marian (OPUS-MT)" → "NLLB-200"), and this file.

Vendored with `python3 scripts/fetch_offline_assets.py --model
Xenova/nllb-200-distilled-600M`. The old `vendor/models/Xenova/opus-mt-en-ar/`
folder is left on disk but is no longer referenced by `MODELS`.


### 2026-10-17 — Profile page, Stories Studio, notifications, home hero

Four UI/UX requests handled in one pass. All changes are uncommitted (this is
not a git repo).

**1. Home hero (root `index.html`) — book artwork → IStories icon.**
The SVG open-book group was replaced with a rounded white app-icon tile
(`188x188`, `rx=46`) containing `<image href="icon.png">`, plus a soft halo and
shadow. The group class was renamed `.ist-book` → `.ist-logo` (including in the
`prefers-reduced-motion` list), the now-unused `istPage` gradient def was
removed, and the illustration's `aria-label` now reads "The IStories app icon
with words in many languages floating around it". The "IStories" wordmark,
5 `.ist-bubble` and 4 `.ist-spark` elements are unchanged.

**2. Notification UI + dismiss on tap (`nav/common.js`).**
`showNotification(message, type, options)` was rewritten as a self-contained
toast system. It injects an `ist-toast-styles` block once (it no longer relies
on page-level `slideIn`/`slideOut` keyframes), stacks up to 4 toasts in
`#ist-toast-container` (top-right), and uses Font Awesome icons
(`fa-circle-check`, `fa-exclamation-circle`, `fa-warning`, `fa-info-circle`,
`fa-xmark`). Each toast has a progress bar, a close button, auto-hides after
`IST_TOAST_MS = 4200`, and dismisses on **click** and **touchstart**. Colors use
`var(--danger/--success/--warning/--primary, <fallback>)` so they also work on
the root landing page (which does not load `main/main/style.css`). Helper
functions: `istToastEnsureStyles`, `istToastContainer`, `istDismissToast`,
`IST_TOAST_META`. `showExportSuccess()` in `main/main/addstories.js` now
delegates to this toast.

**3. Profile page (`main/profile/`) — rebuilt.**
`index.html`, `style.css` and `script.js` were rewritten as a page header + card
with a gradient banner, an overlapping circular avatar (hover overlay
`#change-photo-btn` + always-visible camera `<label for="photo-input">` badge),
a name field with `.is-valid`/`.is-invalid` states and a char counter, Reset/Save
buttons that stay disabled until the form is "dirty", a status line, and a
"Use default photo" button (`#remove-photo-btn`). The hardcoded
`value="Ammar Chacal"` was removed. All IDs a probe relies on were kept
(`profile-settings`, `profile-photo`, `change-photo-btn`, `photo-input`,
`profile-name-input`, `name-char-count`, `name-valid-icon`, `cancel-btn`,
`save-btn`).
`style.css` gained a `:root` block of **legacy-token aliases**
(`--primary-color`→`--primary`, `--text-color`→`--text`,
`--text-secondary`→`--text-light`, `--text-tertiary`→`--text-lighter`,
`--border-color`→`--border`, `--success-color`, `--warning-color`,
`--danger-color`), and `rgba(var(--primary-rgb), …)` was replaced with
`color-mix(in srgb, var(--primary) …)` (`--primary-rgb` cannot be aliased via
`var()` because it is used inside `rgba()`).

**4. Stories Studio (`main/addstories.html` + `main/main/addStories.css`).**
- The stylesheet referenced ~12 custom properties that were **never defined**
  anywhere (`--text-primary` 13×, `--border-color` 18×, `--text-secondary` 17×,
  `--background`, `--bg-color`, `--primary-light`, `--error`, `--danger-light`,
  `--disabled`, `--shadow-lg`, `--text-muted`, …), so those declarations were
  silently invalid (cards had no borders, `.info-card` had *no* background).
  A **scoped** shim (`#addStories { --text-primary: var(--text); … }`) maps the
  legacy names onto the real tokens. It is scoped to `#addStories` because
  `addStories.css` is also loaded by `main/index.html`, which has no such
  element — so the shared page is untouched. The six
  `rgba(var(--*-rgb), n)` uses became `color-mix(...)`.
- A "UI/UX polish" section was appended (page header with gradient icon chip,
  card borders/shadows, form-control focus rings, button radii/focus-visible +
  a real `.btn-primary:disabled` state, upload/resize touches, a two-column
  layout at ≥992px, small-screen stacking). The heading icon changed
  `fa-book-medical` → `fa-wand-magic-sparkles`.
- **JSON Format Example** (`#jsonExample`) was rewritten to document only real
  schema fields (`title`, `lang`, `level`, `levelcefr`, `cover`, `coverType`,
  `content`, `author`, `sound`, `tags`, `dictionaries`, `translations`) — the
  bogus `description`/`coverImage`/`audio`/`words` were removed — and every
  parameter now carries a `// #hashtag` note listing all accepted values
  (20 language codes; `#beginner #intermediate #advanced`; `#A1`–`#C2`;
  `#emoji #image #icon`; POS list; long/short translation forms). A
  `.code-note` under the block explains the convention.
  Because the example is parsed live, `stripJsonComments(text)` (string-aware)
  was added to `main/main/addstories.js` and is used by `validateJsonInput`,
  `importFromText` and `copyJsonExample` (so pasting the annotated example
  works, and **Copy** yields clean JSON).

**5. Pre-existing bug fixed:** `main/main/other.js` referenced `isMenuOpen`
and `more` in its document click/keydown handlers without ever declaring them,
so **every click** on `main/index.html` threw a `ReferenceError`. Both are now
declared (`let isMenuOpen = false; const more = document.getElementById('more');`)
and the handlers are null-safe, which keeps the (inert) close-menu behaviour
from throwing.

**Verification.** No `node` is available, so JS was checked by brace-balance
plus a headless-Firefox beacon harness (`/tmp/opencode/{serve.py,runprobe.sh,runhome.sh}`,
`sendBeacon` → `POST /__report`). Two harness bugs were found and fixed along
the way: Firefox was serving **cached** HTML/JS (so each run now uses a fresh
`mktemp` profile) and a stale `.parentlock` could block new instances. A probe
"FAIL" for the disabled button turned out to be a measurement artifact — the
pre-existing `transition: all .3s ease` meant opacity was still animating, so
the probe now disables the transition before reading. Result: **178 PASS / 1
FAIL → 0 FAIL**; the only remaining console errors are the two known
pre-existing ones (`setupEventListeners is not defined @ main/main/main.js:128`,
`verifyColorSetup is not defined @ store/main.js:128`).

**Not done / notes.** `PROJECT_NOTES.md` was previously stale (the entries above
predate this work). The old `.notification` CSS and page-level `slideIn`/
`slideOut` keyframes are now unused but were left in place. The `firefox` PID
2759 (the user's own browser) was never touched; only isolated headless
instances were used.

---

## Large user data moved to IndexedDB (localForage)

**Goal.** Move the *large* user-data collections out of localStorage (the
~5 MB cap) into IndexedDB via localForage, on every page that stores user data.
Small, synchronous settings (theme, colours, font size, feature flags, …) stay
in localStorage so they can still be read before first paint. Pre-existing
localStorage data is migrated into IndexedDB on first run.

**IndexedDB keys (9):** `userStories`, `savedWords`, `userQuizzes`, `quizzes`,
`quizHistory`, `userDictionaries`, `readingHistory`, `currentReadingStory`,
`profilePhoto`.

**Deliberately still in localStorage:** `userStats`, `downloadStats`, the
`customCSS*` variants, and every preference (`theme`, `selectedColor`,
`selectedSecondaryColor`, `fontSize`, `lineHeight`, `profileName`,
`showVoiceButtons`, `showUserStories`, `showUserQuizzes`, `speechEnabled`,
`fontFamily`, `selectedStoriesFile`, …).

**How it stays backwards compatible.** `nav/storage.js` patches
`Storage.prototype.getItem/setItem/removeItem/clear`: the 9 data keys are served
from an in-memory mirror hydrated from IndexedDB (localForage instance
`IStoriesDB`, store `istories`) and written straight through to it; every other
key falls through to the real localStorage. Writes issued before hydration are
buffered and replayed in order. Because the mirror cannot exist at parse time,
storage.js also wraps `document.addEventListener` so all `DOMContentLoaded`
handlers run only after `IStoriesStorage.ready`; pages that seed a global from a
data key at parse time (`let savedWords = JSON.parse(localStorage.getItem(...))`)
re-run that line through `IStoriesStorage.whenReady(...)`. Existing localStorage
data is migrated into IndexedDB and removed from localStorage on first run.

Public API: `IStoriesStorage.{ready, dataKeys, isDataKey, getItemSync, getItem,
setItem, removeItem, flush, whenReady, entries}` plus an `ist-storage-ready`
event. Load order on every page (in `<head>`, before page scripts):
`nav/vendor/localforage.min.js` (vendored localForage 1.10.0) then
`nav/storage.js`.

**Files.** New: `nav/storage.js`, `nav/vendor/localforage.min.js`. Changed:
`sw.js` (`CACHE_VERSION` v7 → v8; shell assets += `nav/common.js`,
`nav/storage.js`, `nav/vendor/localforage.min.js`). The 9 pages with data,
`main/index.html`, `main/flashcard/index.html`, `main/addstories.html`,
`main/quiz/index.html`, `main/reader/index.html`, `main/vocabulary/index.html`,
`main/profile/index.html`, `store/index.html`, `tools/index.html`, each load the
two scripts first in `<head>`. Parse-time re-reads were added in
`main/main/main.js`, `main/main/addstories.js`, `main/reader/scripts/main.js`,
`main/flashcard/main.js`, `main/vocabulary/main.js`, `main/quiz/scripts/main.js`,
`main/quiz/scripts/creat-quiz.js`, `store/main.js`, `tools/main.js`, and in the
inline scripts of `main/index.html`, `store/index.html`, `main/quiz/index.html`
(whose `init` is now invoked via `whenReady(function () { init(); })` so it is
resolved after all page scripts have parsed). Backup export/import and the
full-reset in `main/main/other.js` now merge IndexedDB data and `flush()` before
reloading.

**Not migrated:** the small settings above, and the orphaned `hh.js` (referenced
by no page; has a pre-existing syntax error).

**Verification.** Headless-Firefox beacon harness. A new IndexedDB probe (which
seeds native localStorage *before* storage.js to exercise the migration) was run
on all 8 pages: **296 PASS / 0 FAIL** — key classification, first-run migration,
write-through persistence, settings excluded from IndexedDB, `removeItem` /
`clear()` propagation, and the readiness gate. The existing regression suite:
**179 PASS / 0 FAIL**. The only console errors left are the two known
pre-existing ones (`setupEventListeners is not defined @ main/main/main.js`,
`verifyColorSetup is not defined @ store/main.js`); the first now surfaces as a
caught `console.warn` because the readiness gate wraps `DOMContentLoaded`
handlers.

**Harness note.** The dev-only test server (`/tmp/opencode/serve.py`) now sends
`charset=utf-8`; without it, test scripts injected before `<meta charset>` made
Firefox re-parse the document and abort in-flight scripts.

---

## Centralized Settings page (`settings/index.html`)

The **single home for every preference**. It writes the *same* `localStorage`
keys the pages read on load, so changes made here are picked up the next time a
page loads.

As of the "consolidate settings" pass, the per-page settings drawers were
**removed from every page except the reader** (which keeps its page-specific
Reading controls). On the other pages the header gear is now a plain link to
this page, and Data Management (previously buried in the Story Library's
drawer) lives here too. The accent / secondary colour pickers are likewise
**central-only** — no page has its own colour selector any more.

- **File:** `settings/index.html` (self-contained: own `<style>` + inline
  script; loads `nav/sidebar.{css,js}`, `nav/theme.css`, `nav/common.js`, and
  the localForage + `nav/storage.js` pair for consistency).
- **Sidebar:** `nav/sidebar.js` `DEFAULT_CONFIG` gained a `System → Settings`
  section (`fa-solid fa-gear`, `settings/index.html`) — visible on every page,
  marked active on the settings page.
- **Sections & keys written:**
  - Appearance — `theme`, `selectedColor`, `selectedSecondaryColor`
    (swatches incl. the app defaults Forest `#243d34` / Peach `#d38d70`, plus a
    custom colour picker; live-applies `--primary*` / `--secondary*`).
  - Reading — `fontFamily`, `fontSize` (1.0–2.0 rem), `lineHeight` (1.8 / 2.2).
  - Translation — `defaultTranslateLanguage`, `autoTranslateEnabled`,
    `paragraphTranslationEnabled`, `noTranslatedWords`.
  - Library & Quizzes — `showUserStories`, `showUserQuizzes`.
  - Vocabulary & Speech — `showVoiceButtons`, `speechEnabled`.
  - Data Management — export my stories / delete them, backup all data, restore
    a backup, delete everything (number-code confirm). Uses `IStoriesStorage`
    (`getItemSync` / `removeItem` / `flush`) so the IndexedDB collections are
    included, mirroring the logic that used to live in `main/main/other.js` and
    `main/main/addstories.js`.
  - Custom CSS — tabbed editor for all four keys: `customCSSHome` (Story
    Library, `simple`), `customCSS` (Reader, `reader`), `customCSSVo`
    (Vocabulary, `simple`), `customCSSquiz` (Quiz, `rule`); preview mirrors the
    in-page `!important` strategy.
  - About & reset — link to the Profile page, reload, and a **preferences-only**
    reset (never touches `userStories` / `savedWords` / `userQuizzes`).
- **Service worker:** `./settings/index.html` added to `SHELL_ASSETS`;
  `CACHE_VERSION` bumped `v9 → v10`.

**Verification.** Headless-Firefox beacon harness (rebuilt in
`/tmp/opencode/`). The settings page itself: defaults, theme/colour/font/
line-height/language persistence, all seven feature toggles, the four
Custom-CSS tabs + save/preview/clear, the new Data Management actions
(export/backup each produced a download without throwing), and the sidebar
link all pass. Consolidation pass: each affected page (Story Library,
flashcard, quiz, vocabulary, store, tools, and the two `tools/All-tools`
sub-pages) probes clean — no drawer/overlay/modal left, the header gear
resolves to an `<a>` pointing at `settings/index.html`, shared header + main
content present, and (where applicable) custom CSS still applies via the
`<body>` data-attribute fallback. Only the documented pre-existing
`setupEventListeners is not defined` warning on the main library and a
pre-existing, unrelated `verifyColorSetup is not defined` on the store page
remain. **The reader is untouched** — it keeps its own drawer + Custom-CSS
modal.

