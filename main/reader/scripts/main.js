// App state
let savedWords = JSON.parse(localStorage.getItem('savedWords')) || [];
// IndexedDB is async: refresh this once storage is ready (before DOMContentLoaded init runs).
if (window.IStoriesStorage) IStoriesStorage.whenReady(function () {
    savedWords = JSON.parse(localStorage.getItem('savedWords')) || [];
});
let theme = localStorage.getItem('theme') || 'light';
let fontSize = 1.2; // rem
let lineHeight = 1.8;
let isAudioPlaying = false;
let fontFamily = localStorage.getItem('fontFamily') || 'sans-serif'; // Add this line
let currentStory = null;
let currentWordData = null;
let dictionary = {};
// Phrase-level translations live beside the word dictionary so a text
// selection like “au revoir” can be translated as one unit.
let phraseDictionary = {};
// One centralized dictionary shared by every story. Per-story legacy
// dictionaries are loaded afterwards and still override these entries.
const SHARED_DICTIONARY_PATH = '../../database/Dictionarys/shared.json';
// Global variables for paragraph translation
let paragraphTranslationEnabled = false;
let translationSettings = {
    autoDetectLanguage: true,
    targetLanguage: 'ar',
    showBothLanguages: false,
    translationProvider: 'google' // 'google' or 'deepl' or 'libretranslate'
};

// DOM elements
const storyTitle = document.getElementById('storyTitle');
const storyText = document.getElementById('storyText');
const descriptionTitle = document.getElementById('descriptionTitle');
const descriptionMeta = document.getElementById('descriptionMeta');
const descriptionText = document.getElementById('descriptionText');
const dictionaryPopup = document.getElementById('dictionaryPopup');
const themeToggle = document.getElementById('themeToggle');
const fontSmaller = document.getElementById('fontSmaller');
const fontNormal = document.getElementById('fontNormal');
const fontLarger = document.getElementById('fontLarger');
const lineSpacingBtn = document.getElementById('lineSpacing');
const listenBtn = document.getElementById('listenBtn');
const saveWordBtn = document.getElementById('saveWordBtn');
const closePopup = document.getElementById('closePopup');
const modalOverlay = document.getElementById('modalOverlay');
const popupWord = document.getElementById('popupWord');
const popupTranslation = document.getElementById('popupTranslation');
const readingProgressBar = document.getElementById('readingProgressBar');
const backToHome = document.getElementById('backToHome');
const exportVocabularyBtn = document.getElementById('exportVocabulary');
const navTabs = document.querySelectorAll('.nav-tab');
const pages = document.querySelectorAll('.page');
const googleSearchBtn = document.getElementById('googleSearchBtn');
const listenWordBtn = document.getElementById('listenWordBtn');
const removebtn = document.getElementById("removebtn");
const sound = document.getElementById("sound");
const lvl = document.getElementById("lvl");
const lvlcefr = document.getElementById("lvlcefr");
const lvlLang = document.getElementById("lvlLang");
const fontFamilySelect = document.getElementById('fontFamily'); // Add this line
const googleTranslateBtn = document.getElementById('googleTranslateBtn');

// ----------------------------------------------------
// 📚 وظائف القواميس والتوحيد
// ----------------------------------------------------

// Get story ID from URL
function getStoryIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    const isUserStory = urlParams.get('userStory') === 'true';
    const external = urlParams.get('external') === 'true';
    const activeId = (currentStory && currentStory.id !== undefined &&
        currentStory.id !== null && currentStory.id !== '')
        ? String(currentStory.id)
        : '1';

    return {
        id: id || activeId,
        isUserStory: isUserStory,
        external: external
    };
}

/**
 * 🚨 تعديل: هذه الدالة الآن لا تقوم بتوحيد الفاصلة العلوية، بل تعيد الكلمة كما هي.
 */
function normalizeApostrophe(word) {
    // ترك الفاصلة العلوية كما هي (مثل ' و ’)
    return word;
}

// دالة لإزالة علامات التشكيل
function removeAccents(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

/**
 * المفتاح القياسي للبحث (Standard Lookup Key):
 * يحول إلى أحرف صغيرة ويحافظ على الفاصلة (سواء ' أو ’) والتشكيل.
 * مثال: L’océan -> l’océan
 */
function getStandardKey(word) {
    let key = word.toLowerCase();
    // تم إزالة استدعاء normalizeApostrophe لترك الفاصلة الأصلية
    return key.trim();
}

/**
 * المفتاح الموحد للبحث (Normalized Lookup Key):
 * يحول إلى أحرف صغيرة، يحافظ على الفاصلة، ويزيل التشكيل.
 * مثال: L’océan -> l’ocean
 */
function getNormalizedKey(word) {
    let key = getStandardKey(word); // l’océan
    key = removeAccents(key);       // l’ocean
    return key.trim();
}

/**
 * المفتاح الموحد الأقصى (Aggressive Key): 
 * يحول إلى أحرف صغيرة، يحافظ على الفاصلة، يزيل التشكيل والواصلات.
 */
function getAggressiveKey(word) {
    let key = word.toLowerCase();
    key = removeAccents(key);
    key = key.replace(/-/g, '');
    // ترك الفاصلة العلوية
    return key.trim();
}

// Get user stories from localStorage
function getUserStories() {
    try {
        const userStories = JSON.parse(localStorage.getItem('userStories')) || [];
        return userStories;
    } catch (error) {
        console.error('Error loading user stories:', error);
        return [];
    }
}

/** Normalize a story language code to its base (en-US → en). */
function storyLanguage(story) {
    const raw = (story && (story.lang || story.language)) ||
        document.documentElement.getAttribute('data-story-lang') || 'en';
    return String(raw).toLowerCase().split('-')[0];
}

/** Turn a phrase key into a stable lookup form. */
function normalizePhraseKey(value) {
    return String(value == null ? '' : value)
        .replace(/\s+/g, ' ')
        .trim()
        .toLowerCase();
}

/**
 * Extract the language-specific word map (and phrase map) from the
 * centralized shared.json payload. Legacy flat dictionaries are returned
 * unchanged so old story databases keep working.
 */
function extractDictionaryEntries(payload, lang, storyId) {
    if (!payload || typeof payload !== 'object' ||
        !payload.languages || typeof payload.languages !== 'object') {
        return { words: payload || {}, phrases: {} };
    }

    const languages = payload.languages;
    const languageKey = languages[lang] ? lang : (languages.en ? 'en' : Object.keys(languages)[0]);
    let words = languageKey ? { ...(languages[languageKey] || {}) } : {};

    // Story-specific overrides bundled in the shared file.
    const storyOverrides = payload.stories && payload.stories[String(storyId)];
    if (storyOverrides) {
        const overrideWords = storyOverrides[languageKey] || storyOverrides.en || {};
        words = { ...words, ...overrideWords };
    }

    const phrases = (payload.phrases && (payload.phrases[languageKey] || payload.phrases[lang])) || {};
    return { words, phrases };
}

/**
 * True when a dictionary value is already an in-memory dictionary object,
 * rather than a path to a JSON file.
 */
function isInlineDictionary(value) {
    return !!value && typeof value === 'object' && !Array.isArray(value);
}

/**
 * Load dictionaries from JSON file(s) or from inline dictionary objects.
 * Accepts both legacy flat dictionaries ({ word: { translation } }) and the
 * structured shared dictionary ({ languages, phrases, stories }).
 * يتضمن تنظيف مفاتيح القاموس من الفراغات الزائدة أثناء التحميل.
 */
async function loadDictionary(dictionaryPaths) {
    if (!Array.isArray(dictionaryPaths)) {
        dictionaryPaths = dictionaryPaths ? [dictionaryPaths] : [];
    }

    dictionary = {};
    phraseDictionary = {};

    if (dictionaryPaths.length === 0) {
        console.log('No dictionary paths provided.');
        return;
    }

    try {
        const lang = storyLanguage(currentStory);
        const storyId = currentStory ? currentStory.id : null;

        const loadPromises = dictionaryPaths.map(async (source) => {
            if (!source) return null;

            try {
                let dictContent;
                let label;

                if (isInlineDictionary(source)) {
                    dictContent = source;
                    label = 'inline story dictionary';
                } else {
                    const path = String(source);
                    const response = await fetch(path);
                    if (!response.ok) {
                        throw new Error(`Failed to load dictionary: ${response.status} from ${path}`);
                    }
                    dictContent = await response.json();
                    label = path;
                }

                const extracted = extractDictionaryEntries(dictContent, lang, storyId);

                console.log(`Loaded ${Object.keys(extracted.words).length} words from: ${label}`);

                // Multi-word legacy keys are phrase translations too.
                for (const key in extracted.words) {
                    if (key.indexOf(' ') !== -1) {
                        phraseDictionary[normalizePhraseKey(key)] = extracted.words[key];
                    }
                }
                Object.assign(phraseDictionary, extracted.phrases || {});

                return extracted.words;

            } catch (error) {
                console.error(`Error loading dictionary from ${isInlineDictionary(source) ? 'inline object' : source}:`, error);
                return {};
            }
        });

        const allDictionaries = await Promise.all(loadPromises);

        // دمج جميع القواميس وتجريد المفاتيح من الفراغات الزائدة
        dictionary = allDictionaries.reduce((mergedDict, currentDict) => {
            if (!currentDict) return mergedDict;
            const trimmedDict = {};
            for (const key in currentDict) {
                if (currentDict.hasOwnProperty(key)) {
                    // إزالة الفراغات من المفتاح أثناء التحميل
                    const trimmedKey = key.trim();
                    trimmedDict[trimmedKey] = currentDict[key];
                }
            }
            return { ...mergedDict, ...trimmedDict };
        }, {});

        console.log(`Final merged dictionary size: ${Object.keys(dictionary).length} words.`);

    } catch (error) {
        console.error('Error during dictionary loading process:', error);
    }

    if (Object.keys(dictionary).length === 0) {
        console.warn('No dictionaries loaded, using empty dictionary');
        dictionary = {};
    }
}

// Merge a { word: translation } object into the active dictionary. Used for
// translations saved with a user story and for embedded source-story
// translations carried by `currentReadingStory`.
function mergeTranslationsIntoDictionary(customDictionary) {
    if (!customDictionary || typeof customDictionary !== 'object') return 0;

    let loadedCount = 0;

    for (const [word, data] of Object.entries(customDictionary)) {
        const standardKey = getStandardKey(word);

        if (typeof data === 'string') {
            dictionary[standardKey] = {
                translation: data,
                pos: "unknown",
                definition: `Custom translation from user story`,
                example: `From "${currentStory?.title || 'user story'}"`,
                source: 'user_story'
            };
            loadedCount++;
        } else if (data && typeof data === 'object') {
            dictionary[standardKey] = {
                translation: data.translation || "No translation",
                pos: data.pos || "unknown",
                definition: data.definition || `Custom translation from user story`,
                example: data.example || `From "${currentStory?.title || 'user story'}"`,
                source: 'user_story'
            };
            loadedCount++;
        }
    }

    return loadedCount;
}

function loadUserTranslations(storyId) {
    try {
        // Get user dictionaries from localStorage (IndexedDB facade)
        const userDictionaries = JSON.parse(localStorage.getItem('userDictionaries')) || {};
        const customDictionary = userDictionaries[storyId];

        if (customDictionary) {
            const loadedCount = mergeTranslationsIntoDictionary(customDictionary);
            console.log(`Successfully loaded ${loadedCount} custom translations for story ${storyId}`);
            return loadedCount > 0;
        }
    } catch (error) {
        console.error('Error loading user translations:', error);
    }
    return false;
}

// Load translations embedded in a source story (or cached in
// currentReadingStory) without requiring the story to be saved first.
function loadEmbeddedTranslations(story) {
    if (!story || !story.translations) return false;
    const loadedCount = mergeTranslationsIntoDictionary(story.translations);
    if (loadedCount > 0) {
        console.log(`Successfully loaded ${loadedCount} embedded translations for "${story.title || 'story'}"`);
    }
    return loadedCount > 0;
}

// ----------------------------------------------------
// 🎨 وظيفة إضافة شارة الترجمة المخصصة
// ----------------------------------------------------
function addTranslationBadge() {
    const badge = document.createElement('div');
    badge.className = 'translation-badge';
    badge.innerHTML = `
            <i class="fas fa-user-edit"></i> Custom Translations Available
        `;
    badge.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: var(--primary);
            color: white;
            padding: 10px 15px;
            border-radius: 8px;
            font-size: 0.9rem;
            font-weight: 600;
            z-index: 999;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            display: flex;
            align-items: center;
            gap: 8px;
            animation: slideIn 0.3s ease;
        `;

    document.body.appendChild(badge);

    // Remove after 5 seconds
    setTimeout(() => {
        if (badge.parentNode) {
            badge.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (badge.parentNode) {
                    document.body.removeChild(badge);
                }
            }, 300);
        }
    }, 5000);
}
// Function to get all available database files
async function getDatabaseFiles() {
    // Fallback list used only if database/reader.json can't be loaded.
    const defaultFiles = [
        '../../database/database/main.js',
        '../../database/database/A1/more.js',
        '../../database/database/more.js'
    ];

    // The story source the user selected in the library goes FIRST, so the exact
    // story they clicked is the one loaded. This matters because different source
    // files can reuse the same ids (e.g. more.js and A1/more.js both use 11-15).
    const files = [];

    try {
        const selected = localStorage.getItem('selectedStoriesFile');
        if (selected) {
            // The library stores this path relative to /main/. Resolve it against
            // /main/ into an absolute URL so the reader — one level deeper in
            // /main/reader/ — loads the very same file the library was showing.
            const libraryBase = new URL('../', window.location.href); // .../main/
            files.push(new URL(selected, libraryBase).href);
        }
    } catch (e) {
        console.log('No selected story source found in storage');
    }

    // The editable list of sources the reader can open (database/reader.json).
    // Entries are full paths under database/database/ (root-relative), so they
    // resolve correctly no matter how deep the current page is.
    let loadedList = false;
    try {
        const response = await fetch('../../database/reader.json');
        if (response.ok) {
            const list = await response.json();
            const entries = Array.isArray(list) ? list : (list.files || []);
            entries.forEach(function (entry) {
                const path = typeof entry === 'string' ? entry : (entry && (entry.file || entry.path));
                if (path && files.indexOf(path) === -1) files.push(path);
            });
            loadedList = true;
        }
    } catch (error) {
        console.log('No database/reader.json found, using default files');
    }

    // Fallback if reader.json couldn't be loaded
    if (!loadedList) {
        defaultFiles.forEach(f => { if (files.indexOf(f) === -1) files.push(f); });
    }

    return files;
}
// Add this helper function to debug database loading
async function debugDatabaseFiles() {
    console.log("=== DEBUG DATABASE FILES ===");

    const databaseFiles = await getDatabaseFiles();
    console.log("Database files to check:", databaseFiles);

    for (const dbFile of databaseFiles) {
        try {
            console.log(`\n--- Checking: ${dbFile} ---`);
            const response = await fetch(dbFile);

            if (!response.ok) {
                console.log(`❌ File not accessible: HTTP ${response.status}`);
                continue;
            }

            const content = await response.text();
            console.log(`✅ File accessible, size: ${content.length} chars`);

            // Check for common patterns
            const hasWindowAssignment = content.includes('window.storiesData');
            const hasStoriesArray = content.includes('stories = [') || content.includes('const stories') || content.includes('let stories');

            console.log(`Has window.storiesData: ${hasWindowAssignment}`);
            console.log(`Has stories array: ${hasStoriesArray}`);

            // Try to extract first 500 chars for inspection
            console.log("First 500 chars:", content.substring(0, 500));

        } catch (error) {
            console.log(`❌ Error checking ${dbFile}:`, error.message);
        }
    }
    console.log("=== END DEBUG ===");
}
// Pick the dictionaries for a story. A story can carry an inline dictionary
// object (all-in-one database files), point to legacy JSON files, or use the
// shared dictionary. When an inline dictionary exists, it replaces the shared
// file so a self-contained story database never needs another file.
function storyDictionaryPaths(story) {
    const candidates = [
        story && story.dictionaries,
        story && story.dictionary
    ];

    const inlineDictionaries = [];
    const filePaths = [];

    for (const candidate of candidates) {
        const list = Array.isArray(candidate) ? candidate :
            (candidate === undefined || candidate === null || candidate === '' ? [] : [candidate]);

        for (const entry of list) {
            if (isInlineDictionary(entry)) {
                inlineDictionaries.push(entry);
                continue;
            }
            if (typeof entry !== 'string' || !entry.trim()) continue;
            // Repair the historical "main.json." typo found in old story data.
            const cleaned = entry.trim().replace(/main\.json\.$/, 'main.json');
            if (filePaths.indexOf(cleaned) === -1) filePaths.push(cleaned);
        }
    }

    if (inlineDictionaries.length > 0) {
        return inlineDictionaries.concat(filePaths);
    }
    return [SHARED_DICTIONARY_PATH].concat(filePaths);
}

// A database file may keep one dictionary at the top and reuse it for every
// story. Attach that inline dictionary to the story being opened.
function withFileDictionary(story, data) {
    if (!story || !data || typeof data !== 'object' || Array.isArray(data)) {
        return story;
    }

    const inline = isInlineDictionary(data.dictionary) ? data.dictionary :
        (isInlineDictionary(data.sharedDictionary) ? data.sharedDictionary : null);
    if (!inline) return story;
    if (isInlineDictionary(story.dictionary)) return story;

    return Object.assign({}, story, { dictionary: inline });
}

// Load story from database files by ID or user stories
async function loadStory() {
    let storyId = '1';
    try {
        storyTitle.textContent = 'Loading...';
        storyText.innerHTML = '<div class="loading" style="text-align: center; padding: 40px; color: var(--text-light);">Loading story...</div>';

        const storyInfo = getStoryIdFromUrl();
        storyId = storyInfo.id;
        const isUserStory = storyInfo.isUserStory;
        const fallbackId = 1;

        // Clear dictionary before loading new story
        dictionary = {};

        // Story cards open the reader without an id: the clicked story is
        // stored in currentReadingStory and replaces any previous one.
        if (!new URLSearchParams(window.location.search).has('id')) {
            let pendingStory = null;
            try {
                pendingStory = JSON.parse(localStorage.getItem('currentReadingStory')) || null;
            } catch (error) {
                console.warn('Could not read currentReadingStory:', error);
            }

            if (pendingStory && Array.isArray(pendingStory.content) &&
                pendingStory.content.length > 0) {
                currentStory = pendingStory;
                await loadDictionary(storyDictionaryPaths(currentStory));

                const pendingStoryId = pendingStory.id != null ? String(pendingStory.id) : '';
                const hasSavedTranslations = pendingStoryId
                    ? loadUserTranslations(pendingStoryId)
                    : false;
                const hasEmbeddedTranslations = loadEmbeddedTranslations(currentStory);

                if (hasSavedTranslations || hasEmbeddedTranslations) {
                    setTimeout(addTranslationBadge, 1000);
                }

                displayStory(currentStory);
                return;
            }
        }

        // A source story opened from the Studio without being saved first. The
        // studio stores the full payload in currentReadingStory so the reader
        // does not need a matching record in userStories or a database file.
        if (storyInfo.external) {
            let pendingStory = null;
            try {
                pendingStory = JSON.parse(localStorage.getItem('currentReadingStory')) || null;
            } catch (error) {
                console.warn('Could not read currentReadingStory:', error);
            }

            if (pendingStory && String(pendingStory.id) === String(storyId) &&
                Array.isArray(pendingStory.content) && pendingStory.content.length > 0) {
                currentStory = pendingStory;
                await loadDictionary(storyDictionaryPaths(currentStory));

                const hasSavedTranslations = loadUserTranslations(storyId);
                const hasEmbeddedTranslations = loadEmbeddedTranslations(currentStory);

                if (hasSavedTranslations || hasEmbeddedTranslations) {
                    setTimeout(addTranslationBadge, 1000);
                }

                displayStory(currentStory);
                return;
            }
        }

        // Check if it's a user story first
        if (isUserStory) {
            const userStories = getUserStories();
            currentStory = userStories.find(s => s.id === storyId);

            if (currentStory) {
                // Load the shared dictionary first, then merge the per-story
                // translations on top (loadDictionary resets the dictionary).
                await loadDictionary(storyDictionaryPaths(currentStory));

                const hasCustomTranslations = loadUserTranslations(storyId);

                // Show translation badge if custom translations exist
                if (hasCustomTranslations) {
                    setTimeout(addTranslationBadge, 1000);
                }

                displayStory(currentStory);
                return;
            }
        }

        // If not a user story or user story not found, try regular stories
        // First check if stories are already loaded in window.storiesData
        if (typeof window.storiesData !== 'undefined') {
            const storiesPayload = window.storiesData;
            const allStories = storiesPayload.stories || storiesPayload;
            currentStory = withFileDictionary(allStories.find(s => s.id == storyId), storiesPayload);
            if (currentStory) {
                await loadDictionary(storyDictionaryPaths(currentStory));
                displayStory(currentStory);
                return;
            }
        }

        // Get all database files to check
        const databaseFiles = await getDatabaseFiles();
        let storyFound = false;

        // Try loading from all database files
        for (const dbFile of databaseFiles) {
            try {
                console.log(`Trying to load story from: ${dbFile}`);
                const response = await fetch(dbFile);

                if (!response.ok) {
                    console.log(`Skipping ${dbFile}: HTTP ${response.status}`);
                    continue;
                }

                const fileContent = await response.text();

                // Execute the JavaScript file to load window.storiesData
                try {
                    // Create a script element and execute it
                    const script = document.createElement('script');
                    script.textContent = fileContent;
                    document.head.appendChild(script);

                    // Wait a moment for execution
                    await new Promise(resolve => setTimeout(resolve, 10));

                    // Check if window.storiesData was set
                    if (typeof window.storiesData !== 'undefined') {
                        const storiesPayload = window.storiesData;
                        const allStories = storiesPayload.stories || storiesPayload;

                        if (Array.isArray(allStories)) {
                            console.log(`Found ${allStories.length} stories in ${dbFile}`);

                            // Try to find the story by ID
                            currentStory = withFileDictionary(allStories.find(s => s.id == storyId), storiesPayload);

                            if (currentStory) {
                                console.log(`🎉 Story found in ${dbFile}!`);

                                // Load the shared dictionary plus any per-story
                                // dictionaries (shared entries are the base).
                                await loadDictionary(storyDictionaryPaths(currentStory));

                                displayStory(currentStory);
                                storyFound = true;

                                // Clean up script
                                document.head.removeChild(script);
                                break; // Stop searching
                            } else {
                                console.log(`Story ID ${storyId} not found in ${dbFile}`);
                            }
                        }
                    }

                    // Clean up script if story not found
                    if (!storyFound && script.parentNode) {
                        document.head.removeChild(script);
                    }

                } catch (execError) {
                    console.error(`Error executing ${dbFile}:`, execError);
                }

            } catch (error) {
                console.error(`Error loading from ${dbFile}:`, error);
            }
        }

        if (storyFound) {
            return;
        }

        // If story not found in any database file, try direct story file
        console.log(`Story ID ${storyId} not found in database files, trying direct story load...`);

        try {
            const storyResponse = await fetch(`../../database/database/story_${storyId}.js`);
            if (storyResponse.ok) {
                const storyContent = await storyResponse.text();

                // Execute the script
                const script = document.createElement('script');
                script.textContent = storyContent;
                document.head.appendChild(script);

                await new Promise(resolve => setTimeout(resolve, 10));

                // Check if window.currentStory or window.story was set
                if (typeof window.currentStory !== 'undefined') {
                    currentStory = window.currentStory;
                } else if (typeof window.story !== 'undefined') {
                    currentStory = window.story;
                }

                if (currentStory) {
                    await loadDictionary(storyDictionaryPaths(currentStory));
                    displayStory(currentStory);
                    document.head.removeChild(script);
                    console.log(`Story loaded from story_${storyId}.js`);
                    return;
                }

                document.head.removeChild(script);
            }
        } catch (error) {
            console.log(`No story_${storyId}.js file found:`, error);
        }

        // Fallback story
        console.log(`Using fallback story for ID ${storyId}`);
        currentStory = getFallbackStory(storyId);
        if (currentStory.dictionaries || currentStory.dictionary) {
            await loadDictionary(currentStory.dictionaries || currentStory.dictionary);
        }
        displayStory(currentStory);
        showNotification(`Story ID ${storyId} not found in any database. Showing fallback.`, 'warning');

    } catch (error) {
        console.error('Error loading story:', error);
        showNotification('Failed to load story. Using fallback story.', 'error');
        currentStory = getFallbackStory(storyId);
        displayStory(currentStory);
    }
}
// Call this during initialization if needed
// debugDatabaseFiles();

// ----------------------------------------------------
// 🧭 وظائف حفظ واستعادة موقع القراءة
// ----------------------------------------------------
function saveReadingPosition() {
    if (currentStory && window.scrollY > 0) {
        const positionData = {
            id: currentStory.id,
            scrollPosition: window.scrollY,
            isUserStory: currentStory.isUserStory || false
        };
        localStorage.setItem('readingPosition', JSON.stringify(positionData));
    }
}

function restoreReadingPosition() {
    const savedPosition = JSON.parse(localStorage.getItem('readingPosition'));
    const storyInfo = getStoryIdFromUrl();
    const activeStoryId = currentStory && currentStory.id != null
        ? currentStory.id
        : storyInfo.id;
    const activeIsUserStory = currentStory
        ? !!currentStory.isUserStory
        : storyInfo.isUserStory;

    if (savedPosition &&
        savedPosition.id == activeStoryId &&
        savedPosition.isUserStory === activeIsUserStory) {

        const checkContentLoaded = () => {
            if (document.readyState === 'complete' && storyText.innerHTML && !storyText.innerHTML.includes('loading')) {
                window.scrollTo(0, savedPosition.scrollPosition);
                console.log(`Restored scroll position for story ${storyInfo.id} to ${savedPosition.scrollPosition}px.`);
            } else {
                setTimeout(checkContentLoaded, 100);
            }
        };
        checkContentLoaded();
    }
}

// ----------------------------------------------------
// 📝 وظائف عرض القصة والقائمة الاحتياطية
// ----------------------------------------------------

function getFallbackStory(storyId) {
    const fallbackStories = {
        1: {
            id: 1,
            title: "The Mysterious Island",
            level: "beginner",
            wordCount: 350,
            dictionaries: ["../../database/Dictionarys/main.json"],
            content: [
                "In the middle of the ocean, there was a small island. No one knew about this island because it was always hidden by fog. One day, a brave explorer named Leo discovered the island during his long journey.",
                "The island had beautiful white beaches and tall palm trees. In the center of the island, there was an ancient temple. The temple walls were covered with mysterious symbols that told the story of the people who lived there long ago.",
                "Leo explored the temple carefully. He found a secret room behind a large stone door. Inside the room, there was an old map showing the location of a hidden treasure. The treasure was hidden deep in the forest on the other side of the island.",
                "With the map in his hand, Leo walked through the dense forest. He saw colorful birds and heard strange animal sounds. After hours of walking, he found a cave exactly where the map showed.",
                "Inside the cave, Leo discovered the treasure: a chest full of gold coins and precious jewels. But more importantly, he found a diary written by the island's last king. The diary told about the island's history and wisdom.",
                "Leo realized that the real treasure was not the gold, but the knowledge he gained. He decided to share this knowledge with the world. He returned to his village with stories of adventure and friendship."
            ]
        },
        2: {
            id: 2,
            title: "The Lost City",
            level: "intermediate",
            wordCount: 500,
            dictionaries: ["../../database/Dictionarys/main.json"],
            content: [
                "Deep in the Amazon rainforest, legends spoke of a lost city made of gold. For centuries, explorers searched for this mythical place, but none returned to tell the tale.",
                "Her journey began in a small village at the edge of the jungle. The villagers warned her about the dangers that lay ahead: poisonous snakes, treacherous rivers, and tribes that had never seen outsiders.",
                "For weeks, she navigated through dense vegetation. She crossed rivers filled with piranhas and climbed steep mountains. One night, while studying her maps by torchlight, she noticed a pattern in the stars.",
                "Following the celestial guidance, she discovered a hidden path behind a waterfall. The path led to a massive stone gateway covered in vines. As she cleared the vegetation, intricate carvings appeared.",
                "Beyond the gateway lay the lost city, just as magnificent as the legends described. Golden temples reflected the sunlight, and stone pathways connected elaborate plazas. But the city was empty, silent except for the sounds of the jungle reclaiming its territory."
            ]
        }
    };

    // Handle both string and number IDs
    return fallbackStories[storyId] || fallbackStories[parseInt(storyId)] || fallbackStories[1];
}
// Direction of the whole story, based on its explicit metadata, its text, or
// the language metadata as a fallback.
function resolveStoryDirection(story) {
    const explicit = String((story && story.dir) || '').toLowerCase();
    if (explicit === 'rtl' || explicit === 'ltr') return explicit;

    const content = story && Array.isArray(story.content)
        ? story.content
        : [story && story.content ? story.content : ''];
    const sample = [story && story.title ? story.title : ''].concat(content).join(' ');

    if (typeof detectTextDirection === 'function') {
        return detectTextDirection(sample, story && story.lang);
    }
    return (typeof isRtlLang === 'function' && isRtlLang(story && story.lang)) ? 'rtl' : 'ltr';
}

// Translate a reader string, falling back to English when i18n is unavailable.
function readerText(key, vars, fallback) {
    if (window.IStoriesI18n && typeof window.IStoriesI18n.t === 'function') {
        const value = window.IStoriesI18n.t(key, vars);
        if (value && value !== key) return value;
    }
    return fallback;
}

// Read the single description field. It contains the description text and,
// for lessons that have one, the YouTube iframe markup.
function getStoryDescription(story) {
    const text = story && (story.description || story['description-en']);
    return { text: text || '', lang: (story && story.lang) || 'en' };
}

// Render description text as paragraphs; raw HTML is never injected as-is.
function appendDescriptionText(container, text) {
    String(text || '').split(/\n{2,}/).forEach(part => {
        const value = part.trim();
        if (!value) return;
        const paragraph = document.createElement('p');
        paragraph.textContent = value;
        container.appendChild(paragraph);
    });
}

// Turn an <iframe> found inside the description into a responsive embed.
function appendDescriptionIframe(container, tag, fallbackTitle) {
    const srcMatch = tag.match(/\bsrc\s*=\s*["']([^"']+)["']/i);
    const titleMatch = tag.match(/\btitle\s*=\s*["']([^"']*)["']/i);
    const videoMatch = srcMatch && srcMatch[1].match(
        /(?:youtube(?:-nocookie)?\.com\/embed\/|youtu\.be\/|[?&]v=)([A-Za-z0-9_-]{11})/
    );
    if (!videoMatch) return;

    const iframe = document.createElement('iframe');
    iframe.src = 'https://www.youtube.com/embed/' + videoMatch[1] + '?rel=0';
    iframe.title = (titleMatch && titleMatch[1]) || fallbackTitle ||
        readerText('reader.lessonVideo', null, 'Lesson video');
    iframe.loading = 'lazy';
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    iframe.setAttribute('allowfullscreen', '');
    container.appendChild(iframe);
}

// Split the description around any iframe markup it contains.
function renderDescriptionContent(container, raw, fallbackTitle) {
    const iframePattern = /<iframe\b[^>]*\/?>(?:[\s\S]*?<\/iframe>)?/gi;
    let lastIndex = 0;
    let match;

    while ((match = iframePattern.exec(raw))) {
        appendDescriptionText(container, raw.slice(lastIndex, match.index));
        appendDescriptionIframe(container, match[0], fallbackTitle);
        lastIndex = match.index + match[0].length;
    }

    appendDescriptionText(container, raw.slice(lastIndex));
}

function renderDescription(story) {
    if (!descriptionTitle || !descriptionText) return;

    story = story || currentStory;
    if (!story) {
        descriptionTitle.textContent = readerText('common.description', null, 'Description');
        descriptionMeta.textContent = '';
        descriptionText.innerHTML = '';
        return;
    }

    const storyLang = (story.lang || 'en').toLowerCase();
    const storyDir = resolveStoryDirection(story);

    descriptionTitle.textContent = story.title || readerText('common.description', null, 'Description');
    descriptionTitle.setAttribute('dir', storyDir);
    descriptionTitle.setAttribute('lang', storyLang);

    const meta = [];
    if (story.author) meta.push(story.author);
    if (story.level) {
        const level = String(story.level);
        meta.push(level.charAt(0).toUpperCase() + level.slice(1));
    }
    if (story.levelcefr) meta.push(String(story.levelcefr).toUpperCase());
    descriptionMeta.textContent = meta.join(' · ');
    descriptionMeta.setAttribute('dir', storyDir);

    const description = getStoryDescription(story);
    const plainText = description.text.replace(/<[^>]*>/g, ' ');
    const descriptionDir = typeof detectTextDirection === 'function'
        ? detectTextDirection(plainText, description.lang, 'ltr')
        : (description.lang === 'ar' ? 'rtl' : 'ltr');

    descriptionText.innerHTML = '';
    descriptionText.setAttribute('dir', descriptionDir);
    descriptionText.setAttribute('lang', description.lang);

    if (description.text && description.text.trim()) {
        renderDescriptionContent(descriptionText, description.text, story.title);
    } else {
        const paragraph = document.createElement('p');
        paragraph.className = 'description-empty';
        paragraph.textContent = readerText('reader.noDescription', null,
            'No description available for this story.');
        descriptionText.appendChild(paragraph);
    }
}

function displayStory(story) {
    storyTitle.textContent = story.title;
    currentStory = story; // Make sure currentStory is set

    // Expose the story (and its language) to the rest of the app.
    window.IStoriesCurrentStory = story;
    const storyLang = (story.lang || 'en').toLowerCase();
    const storyDir = resolveStoryDirection(story);
    document.documentElement.setAttribute('data-story-lang', storyLang);
    document.documentElement.setAttribute('data-story-dir', storyDir);

    // Story title follows the story language, not the UI language.
    storyTitle.setAttribute('dir', storyDir);
    storyTitle.setAttribute('lang', storyLang);
    storyTitle.setAttribute('data-dir-auto', '');

    if (story.author && story.author.trim() !== "") {
        const badge = document.createElement('span');
        badge.className = 'user-story-badge';
        badge.innerHTML = `<i class="fas fa-user"></i> ${story.author}`;
        badge.style.cssText = `
                display: inline-block;
                margin-inline-start: 10px;
                background: var(--primary);
                color: white;
                padding: 4px 10px;
                border-radius: 12px;
                font-size: 0.8rem;
                font-weight: 600;
            `;
        if (typeof applyTextDirection === 'function') {
            applyTextDirection(badge, story.author, storyLang);
        }
        storyTitle.appendChild(badge);
    }

    // التحكم في الصوت حسب وجود src أو لا
    if (sound) {
        if (story.sound && story.sound.trim() !== "") {
            sound.src = story.sound;
            sound.style.display = "block";
        } else {
            sound.removeAttribute("src");
            sound.style.display = "none";
        }
    }

    // Display difficulty level
    if (lvl && story.level) {
        const level = story.level.toLowerCase();
        lvl.textContent = level.charAt(0).toUpperCase() + level.slice(1);
        lvl.classList.remove('beginner', 'intermediate', 'advanced');

        if (level === 'beginner') {
            lvl.classList.add('beginner');
        } else if (level === 'intermediate') {
            lvl.classList.add('intermediate');
        } else if (level === 'advanced') {
            lvl.classList.add('advanced');
        }
    }

    // Display CEFR level
    if (lvlcefr && story.levelcefr && story.levelcefr.trim() !== "") {
        lvlcefr.classList.remove('A1', 'A2', 'B1', 'B2', 'C1', 'C2');
        lvlcefr.textContent = story.levelcefr.toUpperCase();
        const cefrLevel = story.levelcefr.toUpperCase();
        lvlcefr.classList.add(cefrLevel);
    } else if (lvlcefr) {
        lvlcefr.style.display = 'none';
    }

    // Display the story language
    if (lvlLang) {
        const langName = langDisplayName(storyLang);
        lvlLang.innerHTML = `<i class="fas fa-globe"></i> ${langName}`;
        lvlLang.style.display = '';
    }

    storyText.innerHTML = '';
    storyText.setAttribute('dir', storyDir);
    storyText.setAttribute('lang', storyLang);

    const paragraphs = Array.isArray(story.content) ? story.content : [String(story.content || '')];
    paragraphs.forEach(paragraph => {
        const p = document.createElement('div');
        p.className = 'paragraph';

        // Per-paragraph detection keeps mixed-language stories readable while
        // inheriting the story direction for normal paragraphs.
        const paragraphDir = typeof detectTextDirection === 'function'
            ? detectTextDirection(paragraph, storyLang, storyDir)
            : storyDir;
        p.setAttribute('dir', paragraphDir);
        p.setAttribute('lang', storyLang);

        p.innerHTML = makeWordsClickable(paragraph, { debug: false, lang: storyLang });
        storyText.appendChild(p);
    });

    setupWordInteractions();
    updateReadingProgress();

    // Populate the Description tab from the story payload (description,
    // video id and metadata), so it works for every loading path.
    renderDescription(story);

    // ADD THIS LINE - Add translation buttons if enabled
    if (localStorage.getItem('paragraphTranslationEnabled') === 'true') {
        setTimeout(() => {
            if (typeof window.addTranslationButtons === 'function') {
                window.addTranslationButtons();
            }
        }, 500);
    }

}
/**
 * Function makeWordsClickable(htmlString, options = {})
 * تستخدم المفتاح الأساسي للبحث (الذي يحافظ على الفاصلة العلوية الأصلية والتشكيل)
 */
function makeWordsClickable(htmlString, options = {}) {
    if (typeof dictionary === 'undefined') {
        console.error("Error: The 'dictionary' object is not defined. Cannot proceed.");
        return htmlString;
    }

    const debug = !!options.debug;

    // لغة القصة المعروضة (تحدد طريقة تقسيم الكلمات)
    const storyLang = String(
        options.lang || document.documentElement.getAttribute('data-story-lang') || 'en'
    ).toLowerCase().split('-')[0];

    // نمط كلمات يونيكود: يعمل مع كل الحروف التي يدعمها التطبيق (لاتيني، يوناني،
    // سيريلي، عبري، عربي، فارسي، أردو، هندي/ديفاناغري، كوري…).
    // علامات التشكيل (\p{M}) تبقى داخل الكلمة (تشكيل عربي/عبري وحركات هندية).
    // بالنسبة للغات اللاتينية حدود الكلمات مطابقة للنمط القديم تماماً.
    const wordPattern = /[\p{L}\p{N}\p{M}]+(?:[’'\-][\p{L}\p{N}\p{M}]+)*/gu;

    // الصينية واليابانية بلا مسافات، لذا نستخدم مُقطّع الكلمات الأصلي في المتصفح
    // (Intl.Segmenter) إن توفر، وإلا نغلّف كل حرف CJK على حدة.
    const NO_SPACE_LANGS = new Set(['zh', 'ja']);
    let cjkSegmenter = null;
    if (NO_SPACE_LANGS.has(storyLang) &&
        typeof Intl !== 'undefined' && typeof Intl.Segmenter === 'function') {
        try {
            cjkSegmenter = new Intl.Segmenter(storyLang, { granularity: 'word' });
        } catch (error) {
            cjkSegmenter = null;
        }
    }
    const cjkFallbackPattern = /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff]|[\p{L}\p{N}\p{M}]+(?:[’'\-][\p{L}\p{N}\p{M}]+)*/gu;

    const container = document.createElement('div');
    container.innerHTML = htmlString;

    const skipTags = new Set(['SCRIPT', 'STYLE', 'CODE', 'PRE', 'TEXTAREA']);


    /**
     * دالة للتحقق مما إذا كانت الكلمة لديها ترجمة في القاموس.
     */
    // Update the hasTranslation function inside makeWordsClickable
    function hasTranslation(word) {

        // 1. المفتاح القياسي (يحافظ على الفاصلة الأصلية والتشكيل)
        const standardKey = getStandardKey(word);

        // 2. المفتاح الموحد (يحافظ على الفاصلة الأصلية ويزيل التشكيل)
        const normalizedKey = getNormalizedKey(word);

        if (debug) console.log(`--- Checking: ${word} (Standard Key: ${standardKey}, Normalized Key: ${normalizedKey}) ---`);

        // --- أ. البحث بالمفتاح القياسي (الأولوية الأولى: l'océan) ---
        if (dictionary[standardKey]) {
            if (debug) console.log(`SUCCESS: Found match with STANDARD KEY: ${standardKey}`);
            return true;
        }

        // --- ب. البحث بالمفتاح الموحد (الأولوية الثانية: l'ocean) ---
        if (standardKey !== normalizedKey && dictionary[normalizedKey]) {
            if (debug) console.log(`SUCCESS: Found match with NORMALIZED KEY: ${normalizedKey}`);
            return true;
        }

        // --- ج. البحث في القواميس المخصصة ---
        const storyInfo = getStoryIdFromUrl();
        const userDictionaries = JSON.parse(localStorage.getItem('userDictionaries')) || {};
        const customDictionary = userDictionaries[storyInfo.id];

        if (customDictionary) {
            // البحث في القاموس المخصص بالمفتاح القياسي
            for (const [customWord, customData] of Object.entries(customDictionary)) {
                if (getStandardKey(customWord) === standardKey) {
                    if (debug) console.log(`SUCCESS: Found match in CUSTOM DICTIONARY with STANDARD KEY: ${standardKey}`);
                    return true;
                }
            }

            // البحث في القاموس المخصص بالمفتاح الموحد
            for (const [customWord, customData] of Object.entries(customDictionary)) {
                if (getNormalizedKey(customWord) === normalizedKey) {
                    if (debug) console.log(`SUCCESS: Found match in CUSTOM DICTIONARY with NORMALIZED KEY: ${normalizedKey}`);
                    return true;
                }
            }
        }

        // --- ت. معالجة صيغة الجمع/المفرد ---

        const aggressiveKey = getAggressiveKey(word);

        // الكلمة بدون 'es'
        if (aggressiveKey.endsWith('es') && aggressiveKey.length > 2) {
            const singularAggressive = aggressiveKey.slice(0, -2);
            if (dictionary[singularAggressive]) {
                if (debug) console.log(`SUCCESS: Found singular match (aggressive - es): ${singularAggressive}`);
                return true;
            }
        }
        // الكلمة بدون 's'
        if (aggressiveKey.endsWith('s') && aggressiveKey.length > 1) {
            const singularAggressive = aggressiveKey.slice(0, -1);
            if (dictionary[singularAggressive]) {
                if (debug) console.log(`SUCCESS: Found singular match (aggressive - s): ${singularAggressive}`);
                return true;
            }
        }

        if (debug) console.log(`FAILURE: No translation found for ${word}`);
        return false;
    }

    // دالة تغليف كلمات النص بروابط قابلة للنقر (نفس شكل الـ HTML السابق).
    function buildWrappedText(text) {
        const makeSpan = (match) => {

            // جرد الكلمة المجلوبة من القصة مباشرة
            const trimmedMatch = match.trim();

            // نستخدم الكلمة المجرّدة (trimmedMatch) في البحث
            const translationFound = hasTranslation(trimmedMatch);

            const className = translationFound ? 'word clickable-word' : 'word no-translation';

            // تخزين المفتاح القياسي للكلمة المجرّدة (يحافظ على الفاصلة الأصلية)
            const keyToSave = getStandardKey(trimmedMatch);

            const safeMatch = keyToSave
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;');

            // نستخدم match الأصلية (غير المجرّدة) في النص للعرض
            return `<span class="${className}" data-word="${safeMatch}">${match}</span>`;
        };

        // اللغات بلا مسافات (الصينية/اليابانية): التقطيع عبر Intl.Segmenter
        if (cjkSegmenter) {
            let result = '';
            let lastIndex = 0;
            for (const segment of cjkSegmenter.segment(text)) {
                if (!segment.isWordLike) continue;
                result += text.slice(lastIndex, segment.index) + makeSpan(segment.segment);
                lastIndex = segment.index + segment.segment.length;
            }
            return result + text.slice(lastIndex);
        }

        // النمط العادي (أو نمط احتياطي حرف-بحرف للصينية/اليابانية)
        const pattern = NO_SPACE_LANGS.has(storyLang) ? cjkFallbackPattern : wordPattern;
        return text.replace(pattern, makeSpan);
    }

    // دالة المعالجة الرئيسية (تستخدم Pre-order Traversal)
    function traverseAndWrap(node) {
        if (skipTags.has(node.nodeName)) {
            return;
        }

        if (node.nodeType === Node.TEXT_NODE) {
            const text = node.nodeValue;

            const wrappedText = buildWrappedText(text);

            if (wrappedText !== text) {
                const fragment = document.createDocumentFragment();
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = wrappedText;

                while (tempDiv.firstChild) {
                    fragment.appendChild(tempDiv.firstChild);
                }

                node.parentNode.replaceChild(fragment, node);
            }
        } else {
            let child = node.firstChild;
            while (child) {
                const nextChild = child.nextSibling;
                traverseAndWrap(child);
                child = nextChild;
            }
        }
    }

    traverseAndWrap(container);
    return container.innerHTML;
}

// ----------------------------------------------------------------------------------

// Setup word click interactions
function setupWordInteractions() {
    document.querySelectorAll('.word').forEach(word => {
        const dataWord = word.dataset.word;

        // Check if this word is already saved and apply the saved class
        if (savedWords.some(w => w.word === dataWord)) {
            word.classList.add('saved');
            word.classList.remove('no-translation');
        }

        word.addEventListener('click', (e) => {
            // A multi-word text selection is handled as a phrase by the
            // mouseup listener below; don't overwrite it with one word.
            const selection = window.getSelection();
            const selectedText = selection ? selection.toString().trim() : '';
            if (selectedText && selectedText.split(/\s+/).length > 1) return;

            e.stopPropagation();
            showDictionary(dataWord, word);
        });
    });
}

// Phrase-level lookup: selecting “au revoir”, “bonne nuit”, etc. shows the
// translation stored in the shared dictionary's `phrases` map.
if (storyText) {
    storyText.addEventListener('mouseup', function () {
        setTimeout(function () {
            const selection = window.getSelection();
            if (!selection || selection.rangeCount === 0) return;
            const selectedText = selection.toString().replace(/\s+/g, ' ').trim();
            if (!selectedText || selectedText.split(' ').length < 2) return;
            if (!storyText.contains(selection.anchorNode)) return;
            showDictionary(selectedText, null, true);
        }, 0);
    });
}

// Validate word data
function validateWordData(wordData) {
    if (!wordData || typeof wordData !== 'object') return false;
    return wordData.word && wordData.translation;
}

// Show dictionary popup
function showDictionary(word, element, isTextSelection = false) {
    if (!word) return;

    // First, check if we have user translations for this story
    const storyInfo = getStoryIdFromUrl();
    const userDictionaries = JSON.parse(localStorage.getItem('userDictionaries')) || {};
    const customDictionary = userDictionaries[storyInfo.id];

    let wordData = null;
    let originalWordText = '';
    let wordElement = null;

    // Handle different input types
    if (isTextSelection) {
        // Called from text selection
        originalWordText = word;
        wordElement = document.createElement('span');
        wordElement.textContent = originalWordText;
        wordElement.className = 'word';

        // Try to find the clicked word element in the DOM
        const clickedElements = document.querySelectorAll('.word');
        clickedElements.forEach(el => {
            if (el.textContent.trim() === originalWordText.trim()) {
                wordElement = el;
            }
        });
    } else {
        // Called from word click
        originalWordText = element.innerText;
        wordElement = element;
    }

    // Check custom dictionary first (if it exists)
    if (customDictionary) {
        // Try to find the word in custom dictionary
        const customKeys = Object.keys(customDictionary);

        // Try exact match first
        for (const key of customKeys) {
            if (getStandardKey(key) === getStandardKey(word)) {
                const customData = customDictionary[key];
                wordData = {
                    translation: typeof customData === 'string' ? customData : (customData.translation || "No translation"),
                    pos: (typeof customData === 'object' && customData.pos) || "unknown",
                    definition: (typeof customData === 'object' && customData.definition) || `Custom translation from user story`,
                    example: (typeof customData === 'object' && customData.example) || `From "${currentStory?.title || 'user story'}"`,
                    source: 'user_story'
                };
                break;
            }
        }

        // If not found in custom dictionary, try normalized key
        if (!wordData) {
            const normalizedWord = getNormalizedKey(word);
            for (const key of customKeys) {
                if (getNormalizedKey(key) === normalizedWord) {
                    const customData = customDictionary[key];
                    wordData = {
                        translation: typeof customData === 'string' ? customData : (customData.translation || "No translation"),
                        pos: (typeof customData === 'object' && customData.pos) || "unknown",
                        definition: (typeof customData === 'object' && customData.definition) || `Custom translation from user story`,
                        example: (typeof customData === 'object' && customData.example) || `From "${currentStory?.title || 'user story'}"`,
                        source: 'user_story'
                    };
                    break;
                }
            }
        }
    }

    // Phrase-level translation (multi-word selection or a multi-word key).
    if (!wordData) {
        const phraseKey = normalizePhraseKey(word);
        const phraseData = phraseDictionary[phraseKey] ||
            phraseDictionary[normalizePhraseKey(originalWordText)];
        if (phraseData) {
            wordData = typeof phraseData === 'string'
                ? { translation: phraseData, source: 'phrase' }
                : phraseData;
        }
    }

    // If not found in custom dictionary, check main dictionary
    if (!wordData) {
        wordData = dictionary[word] || dictionary[getNormalizedKey(word)];
    }

    popupWord.textContent = originalWordText;
    if (typeof applyTextDirection === 'function') {
        applyTextDirection(popupWord, originalWordText, currentStory && currentStory.lang);
    }

    if (listenWordBtn) {
        listenWordBtn.style.display = 'speechSynthesis' in window ? 'inline-block' : 'none';
    }

    if (wordData) {
        popupTranslation.textContent = wordData.translation;
        if (typeof applyTextDirection === 'function') {
            // Translations are often in a different language than the story.
            applyTextDirection(popupTranslation, wordData.translation);
        }

        // Add source indicator if it's a custom translation
        if (wordData.source === 'user_story') {
            var customLabel = window.IStoriesI18n
                ? window.IStoriesI18n.t('reader.custom')
                : 'Custom';
            popupTranslation.innerHTML += ' <span style="font-size: 0.8rem; color: var(--primary); font-weight: 600;"><i class="fas fa-user-edit"></i> ' + customLabel + '</span>';
        }

        const isSaved = savedWords.some(w => w.word === word || w.originalWord === originalWordText);
        saveWordBtn.innerHTML = isSaved
            ? '<i class="fas fa-check"></i> Already Saved'
            : '<i class="fas fa-bookmark"></i> Save Word';
        saveWordBtn.disabled = isSaved;
        saveWordBtn.classList.toggle('disabled', isSaved);
        saveWordBtn.classList.remove('no-translation-btn');
    } else {
        popupTranslation.textContent = window.IStoriesI18n
            ? window.IStoriesI18n.t('reader.noTranslation')
            : "لا توجد ترجمة متاحة";
        if (typeof applyTextDirection === 'function') {
            applyTextDirection(popupTranslation, popupTranslation.textContent);
        }

        saveWordBtn.innerHTML = '<i class="fas fa-bookmark"></i> Save Word (No Translation)';
        saveWordBtn.disabled = false;
        saveWordBtn.classList.add('no-translation-btn');
    }

    if (!validateWordData({ word: word, translation: wordData?.translation || "No translation" })) {
        console.warn('Invalid word data for:', word);
    }

    currentWordData = {
        word: word,
        element: wordElement,
        hasTranslation: !!wordData,
        wordData: wordData,
        isCustomTranslation: wordData?.source === 'user_story'
    };

    // Refresh the horizontal photo page for the selected word.
    if (window.IStoriesDictionaryPhoto) {
        window.IStoriesDictionaryPhoto.show(
            originalWordText,
            wordData && wordData.translation
        );
    }

    // Position the popup based on selection or click
    let rect;
    if (isTextSelection) {
        // Get selection position
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
            rect = selection.getRangeAt(0).getBoundingClientRect();
        } else {
            // Fallback to cursor position
            rect = { bottom: window.innerHeight / 2, left: window.innerWidth / 2 };
        }
    } else {
        // Get clicked element position
        rect = wordElement.getBoundingClientRect();
    }

    // إعادة فتح النافذة: نبدّل display حتى يلتقط مراقب settings.js التغيير في
    // كل نقرة (على الشاشات الكبيرة تكون اللوحة مثبتة والقيمة لا تتغير أبداً).
    dictionaryPopup.style.display = 'none';
    dictionaryPopup.style.display = 'block';
    if (window.IStoriesDictionaryPhoto) {
        window.IStoriesDictionaryPhoto.refresh();
    }
    const popupWidth = dictionaryPopup.offsetWidth || 350;

    // إبقاء النافذة داخل حدود الشاشة حتى لا تخرج عنها.
    const viewportWidth = document.documentElement.clientWidth;
    let popupLeft = Math.max(10, rect.left + window.scrollX - 150);
    const maxLeft = window.scrollX + viewportWidth - popupWidth - 10;
    if (popupLeft > maxLeft) {
        popupLeft = Math.max(10, maxLeft);
    }

    dictionaryPopup.style.top = `${rect.bottom + window.scrollY + 10}px`;
    dictionaryPopup.style.left = `${popupLeft}px`;

    // Highlight the word element
    if (wordElement && wordElement.classList) {
        wordElement.classList.add('selected');
        setTimeout(() => {
            if (wordElement.classList) {
                wordElement.classList.remove('selected');
            }
        }, 1000);
    }
}

// True on wide screens, where the dictionary is a permanently docked panel
// (see the desktop rules in styles/main.css) that never hides.
function isDockedDictionary() {
    return window.matchMedia('(min-width: 1024px)').matches;
}

// After a rotation or a window resize, an open mobile popup can keep an
// inline left value from the old viewport. Pull it back into view.
window.addEventListener('resize', function () {
    if (!dictionaryPopup || dictionaryPopup.style.display !== 'block') return;
    if (isDockedDictionary()) return;

    const popupWidth = dictionaryPopup.offsetWidth || 350;
    const viewportWidth = document.documentElement.clientWidth;
    const minLeft = window.scrollX + 10;
    const maxLeft = window.scrollX + viewportWidth - popupWidth - 10;
    const currentLeft = parseFloat(dictionaryPopup.style.left);

    if (!Number.isFinite(currentLeft)) return;
    if (currentLeft > maxLeft) {
        dictionaryPopup.style.left = `${Math.max(minLeft, maxLeft)}px`;
    } else if (currentLeft < minLeft) {
        dictionaryPopup.style.left = `${minLeft}px`;
    }
});

// Hide dictionary popup
function hideDictionary() {
    // Desktop: the panel is always visible, so leave it exactly as it is.
    if (isDockedDictionary()) return;
    dictionaryPopup.style.display = 'none';
    currentWordData = null;
    if (window.IStoriesDictionaryPhoto) {
        window.IStoriesDictionaryPhoto.hide();
    }
}


// ----------------------------------------------------
// 📖 وظائف المفردات والإحصائيات
// ----------------------------------------------------

// Add a flag to prevent multiple saves
let isSavingWord = false;

// Modified saveCurrentWord function to auto-translate using Google Translate
async function saveCurrentWord() {
    // Prevent multiple simultaneous saves
    if (isSavingWord) {
        console.log('Save already in progress');
        return;
    }

    if (!currentWordData) {
        showNotification('No word selected', 'error');
        return;
    }

    try {
        isSavingWord = true;

        const { word, element, hasTranslation, wordData, isCustomTranslation } = currentWordData;
        const originalWord = element.innerText.trim();

        // Check if word already exists
        if (savedWords.some(w => w.word === word || w.originalWord === originalWord)) {
            showNotification('Word already saved!', 'info');
            return;
        }

        const storyTitle = currentStory ? currentStory.title : 'Unknown Story';
        const isUserStory = currentStory ? currentStory.isUserStory : false;

        // Create new word object
        const newWord = {
            word: word,
            originalWord: originalWord,
            status: 'saved',
            added: new Date().toISOString(),
            nextReview: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            story: storyTitle,
            hasTranslation: hasTranslation,
            fromUserStory: isUserStory || false,
            isCustomTranslation: isCustomTranslation || false,
            language: (currentStory && currentStory.lang) || 'en'
        };

        // If word has translation in dictionary, use it
        if (hasTranslation && wordData) {
            newWord.translation = wordData.translation;
            newWord.definition = wordData.definition || "Check back later for definition";
            newWord.example = wordData.example || "Check back later for example";
            newWord.pos = wordData.pos || "unknown";

            // Save and show notification
            saveWordToStorage(newWord, element);

        } else {
            // Word has no translation - try to auto-translate using Google Translate
            showNotification(`Translating "${originalWord}"...`, 'info');

            // Disable save button while translating
            if (saveWordBtn) {
                saveWordBtn.disabled = true;
                saveWordBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Translating...';
            }

            try {
                // Get the saved translation language from settings
                const targetLanguage = getCurrentTranslationLanguage ? getCurrentTranslationLanguage() : 'ar';

                // Use Google Translate API
                const googleTranslation = await translateWordWithGoogle(originalWord, targetLanguage);

                if (googleTranslation) {
                    // Update word with Google translation
                    newWord.translation = googleTranslation;
                    newWord.definition = `Auto-translated using Google Translate (to ${getLanguageName ? getLanguageName(targetLanguage) : 'Arabic'})`;
                    newWord.example = `Word from "${storyTitle}"`;
                    newWord.pos = "auto_translated";
                    newWord.autoTranslated = true;
                    newWord.translationSource = 'google_translate';
                    newWord.targetLanguage = targetLanguage;

                    // Save and show notification
                    saveWordToStorage(newWord, element);

                } else {
                    // Google translation failed
                    newWord.translation = "Translation unavailable";
                    newWord.definition = "Could not auto-translate this word";
                    newWord.example = "Word from story";
                    newWord.pos = "unknown";

                    // Save anyway (without translation)
                    saveWordToStorage(newWord, element);
                    showNotification(`"${originalWord}" saved (no translation available)`, 'warning');
                }

            } catch (error) {
                console.error('Auto-translation error:', error);

                // Save word without translation
                newWord.translation = "Translation failed";
                newWord.definition = "Auto-translation failed. Try manual translation.";
                newWord.example = "Word from story";
                newWord.pos = "unknown";
                newWord.translationError = error.message;

                saveWordToStorage(newWord, element);
                showNotification(`"${originalWord}" saved (translation failed)`, 'error');

            } finally {
                // Re-enable save button
                if (saveWordBtn) {
                    saveWordBtn.disabled = false;
                    const isSaved = savedWords.some(w => w.word === word || w.originalWord === originalWord);
                    saveWordBtn.innerHTML = isSaved ?
                        '<i class="fas fa-check"></i> Already Saved' :
                        '<i class="fas fa-bookmark"></i> Save Word';
                    saveWordBtn.disabled = isSaved;
                }
            }
        }

    } finally {
        isSavingWord = false;
    }
}

// Helper function to save word to storage
function saveWordToStorage(wordObject, element) {
    savedWords.push(wordObject);
    localStorage.setItem('savedWords', JSON.stringify(savedWords));

    hideDictionary();

    if (element) {
        element.classList.add('saved');
        element.classList.remove('no-translation');
    }

    // Update UI if needed
    if (document.querySelector('.nav-tab.active[data-page="vocabulary"]')) {
        renderVocabulary();
        updateVocabularyStats();
    }
}

// Translate a word using the Google Translate API.
async function translateWordWithGoogle(word, targetLang = 'ar') {
    // Use the shared translator (tries multiple Google endpoints).
    if (typeof translateWordToLanguage === 'function') {
        try {
            return await translateWordToLanguage(word, targetLang);
        } catch (error) {
            console.error('Google Translate error:', error);
            return null;
        }
    }

    try {
        // Google Translate API endpoint
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(word)}`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();

        // Parse the response (Google returns nested arrays)
        if (data && data[0] && data[0][0] && data[0][0][0]) {
            return data[0][0][0];
        } else {
            throw new Error('Invalid translation response');
        }

    } catch (error) {
        console.error('Google Translate error:', error);
        return null;
    }
}

function translateOnGoogle() {
    if (!currentWordData || !currentWordData.element) return;

    const wordToTranslate = currentWordData.element.innerText.trim();

    // Get the saved translation language from localStorage
    const savedLanguage = localStorage.getItem('defaultTranslateLanguage') || 'ar';

    // Use the saved language instead of hardcoded 'ar'
    const translateUrl = `https://translate.google.com/?sl=auto&tl=${savedLanguage}&text=${encodeURIComponent(wordToTranslate)}&op=translate`;

    window.open(translateUrl, '_blank');
}


// Save word to vocabulary
function saveWord(word, translation, story = '', hasTranslation = true) {
    // Check if word already exists
    const existingIndex = savedWords.findIndex(w =>
        w.word.toLowerCase() === word.toLowerCase() ||
        w.originalWord?.toLowerCase() === word.toLowerCase()
    );

    if (existingIndex === -1) {
        // Add new word at the BEGINNING of the array (newest first)
        savedWords.unshift({
            word: word,
            originalWord: word,
            translation: translation,
            story: story,
            hasTranslation: hasTranslation,
            added: new Date().toISOString(),
            addedDate: new Date().toISOString(),
            status: 'saved',
            language: (currentStory && currentStory.lang) || 'en'
        });
    } else {
        // Update existing word
        savedWords[existingIndex] = {
            ...savedWords[existingIndex],
            translation: translation || savedWords[existingIndex].translation,
            story: story || savedWords[existingIndex].story,
            hasTranslation: hasTranslation
        };
    }

    localStorage.setItem('savedWords', JSON.stringify(savedWords));
    renderVocabulary();
    updateStats();

    showNotification('Word saved to vocabulary!', 'success');
}

function updateVocabularyStats() {
    const totalWords = document.getElementById('totalWords');
    const masteredWords = document.getElementById('masteredWords');
    const practiceDue = document.getElementById('practiceDue');
    const readingStreak = document.getElementById('readingStreak');

    if (totalWords) totalWords.textContent = savedWords.length;
    if (masteredWords) masteredWords.textContent = savedWords.filter(w => w.status === 'mastered' || w.status === 'known').length;

    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    const dueCount = savedWords.filter(w => new Date(w.added || w.date) > threeDaysAgo).length;
    if (practiceDue) practiceDue.textContent = dueCount;

    const streak = Math.min(30, savedWords.length);
    if (readingStreak) readingStreak.textContent = streak;
}

// copy button
const copyBtn = document.getElementById("copy");
if (copyBtn) {
    copyBtn.addEventListener("click", copyStoryFast);
}
// print buutons button
const PrintBtn = document.querySelectorAll(".print");

PrintBtn.forEach(btn => {
    btn.addEventListener("click", printPage);
});

function printPage() {
    window.print();
}
function copyStoryFast() {
    try {
        // 1) نحاول جمع النص المعروض فعلاً داخل العنصر storyText
        // هذا يأخذ فقط النص المرئي (بدون الوسوم HTML)
        let text = "";

        if (storyText) {
            // أفضل: نأخذ كل فقرة مرئية (.paragraph) إن وُجدت لأنها تحافظ على الفقرات
            const paras = storyText.querySelectorAll ? storyText.querySelectorAll('.paragraph') : null;

            if (paras && paras.length) {
                text = Array.from(paras).map(p => p.innerText.trim()).filter(Boolean).join('\n\n');
            } else {
                // fallback: نستخدم innerText الكامل من storyText
                text = (storyText.innerText || storyText.textContent || "").trim();
            }
        }

        // 2) إذا النص فارغ، ننبّه المستخدم
        if (!text) {
            showNotification('No story to copy', 'error');
            return;
        }

        // 3) نسخ باستخدام navigator.clipboard (أفضل)، مع fallback للمتصفحات القديمة
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(text).then(() => {
                flashCopyUI();
                showNotification('Story copied!', 'success');
            }).catch(err => {
                // إذا فشل، نجرّب fallback
                fallbackCopyText(text);
            });
        } else {
            fallbackCopyText(text);
        }

    } catch (err) {
        console.error('copyStoryFast error:', err);
        showNotification('Copy failed', 'error');
    }
}

function fallbackCopyText(text) {
    try {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        // ensure offscreen and not focusable
        textarea.style.position = 'fixed';
        textarea.style.left = '-9999px';
        textarea.style.top = '0';
        textarea.setAttribute('aria-hidden', 'true');
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();

        const ok = document.execCommand('copy');
        document.body.removeChild(textarea);

        if (ok) {
            flashCopyUI();
            showNotification('Story copied!', 'success');
        } else {
            throw new Error('execCommand returned false');
        }
    } catch (e) {
        console.error('fallbackCopyText failed', e);
        showNotification('Copy failed', 'error');
    }
}

// تلميح بصري للزر بعد النسخ
function flashCopyUI() {
    const btn = document.getElementById('copy');
    if (!btn) return;
    const originalHTML = btn.innerHTML;
    const originalTitle = btn.title;
    btn.innerHTML = '<i class="fas fa-check"></i>';
    btn.title = 'Copied!';
    btn.style.color = 'rgb(13, 167, 116)';
    setTimeout(() => {
        btn.innerHTML = originalHTML;
        btn.title = originalTitle;
        btn.style.color = '';
    }, 1400);
}


// ----------------------------------------------------
// 🎨 وظائف التخصيص
// ----------------------------------------------------

function toggleTheme() {
    theme = theme === 'light' ? 'dark' : 'light';
    applyTheme();
    localStorage.setItem('theme', theme);
}

function applyTheme() {
    if (theme === 'dark') {
        document.body.classList.add('dark-mode');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';

        // In dark mode, we need to re-apply colors with !important
        if (window.selectedColor) {
            applyPrimaryColor(window.selectedColor);
        }
        if (window.selectedSecondaryColor) {
            applySecondaryColor(window.selectedSecondaryColor);
        }
    } else {
        document.body.classList.remove('dark-mode');
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';

        // In light mode, also re-apply colors
        if (window.selectedColor) {
            applyPrimaryColor(window.selectedColor);
        }
        if (window.selectedSecondaryColor) {
            applySecondaryColor(window.selectedSecondaryColor);
        }
    }

    console.log('Theme applied:', theme, 'Colors:', window.selectedColor, window.selectedSecondaryColor);
}
// function adjustFontSize(change) {
//     fontSize += change;
//     fontSize = Math.max(1, Math.min(2, fontSize));
//     storyText.style.fontSize = `${fontSize}rem`;

//     fontSmaller.classList.toggle('active', fontSize < 1.2);
//     fontNormal.classList.toggle('active', fontSize === 1.2);
//     fontLarger.classList.toggle('active', fontSize > 1.2);
// }

// function resetFontSize() {
//     fontSize = 1.2;
//     storyText.style.fontSize = `${fontSize}rem`;

//     fontSmaller.classList.remove('active');
//     fontNormal.classList.add('active');
//     fontLarger.classList.remove('active');
// }

// function toggleLineSpacing() {
//     lineHeight = lineHeight === 1.8 ? 2.2 : 1.8;
//     storyText.style.lineHeight = lineHeight;
//     lineSpacingBtn.classList.toggle('active', lineHeight === 2.2);
// }

// ----------------------------------------------------
// 🔊 وظائف الصوت
// ----------------------------------------------------
// Helper: count total words in story content array
function countWords(contentArray) {
    if (!Array.isArray(contentArray)) return 0;
    return contentArray.reduce((total, paragraph) => {
        const words = (paragraph || '').trim().split(/\s+/).filter(Boolean);
        return total + words.length;
    }, 0);
}

// Helper: extract unique words from story content array
function extractStoryWords(contentArray) {
    if (!Array.isArray(contentArray)) return [];
    const wordPattern = /[A-Za-zÀ-ÖØ-öø-ÿ]+(?:[''\-][A-Za-zÀ-ÖØ-öø-ÿ]+)*/g;
    const seen = new Set();
    const words = [];
    contentArray.forEach(paragraph => {
        const matches = (paragraph || '').match(wordPattern) || [];
        matches.forEach(word => {
            const key = word.toLowerCase();
            if (!seen.has(key)) {
                seen.add(key);
                words.push(word);
            }
        });
    });
    return words;
}

// Download current story as JSON
function downloadCurrentStory() {
    if (!currentStory) {
        showNotification(
            window.IStoriesI18n
                ? window.IStoriesI18n.t('reader.noStoryDownload')
                : 'No story loaded to download',
            'warning'
        );
        return;
    }

    try {
        const storyDir = resolveStoryDirection(currentStory);

        // Keep the full story payload (content-tr, tags, translations, source
        // metadata, …) so a reader export can be re-imported without losing
        // anything. Runtime-only flags are stripped below.
        const storyForExport = Object.assign({}, currentStory, {
            id: currentStory.id || 'story_' + Date.now(),
            title: currentStory.title || 'Untitled Story',
            lang: currentStory.lang || 'en',
            dir: storyDir,
            level: currentStory.level || 'intermediate',
            levelcefr: currentStory.levelcefr || 'B1',
            cover: currentStory.cover || '',
            coverType: currentStory.coverType || 'image',
            content: Array.isArray(currentStory.content)
                ? currentStory.content.slice()
                : [String(currentStory.content || '')],
            author: currentStory.author || 'Unknown',
            wordCount: currentStory.wordCount || countWords(currentStory.content),
            exportedDate: new Date().toISOString(),
            exportedFrom: 'IStories',
            version: '1.0',
            source: currentStory.source || 'uploaded'
        });

        delete storyForExport.isUserStory;

        // Add dictionary translations without overwriting translations that
        // were already embedded in the story file.
        if (Object.keys(dictionary).length > 0) {
            const storyWords = extractStoryWords(currentStory.content);
            const translations = Object.assign({}, storyForExport.translations || {});

            storyWords.forEach(word => {
                const standardKey = getStandardKey(word);
                if (dictionary[standardKey] && !translations[word]) {
                    translations[word] = {
                        translation: dictionary[standardKey].translation || '',
                        pos: dictionary[standardKey].pos || 'unknown',
                        definition: dictionary[standardKey].definition || '',
                        example: dictionary[standardKey].example || ''
                    };
                }
            });

            if (Object.keys(translations).length > 0) {
                storyForExport.translations = translations;
            }
        }

        // Convert to JSON string with pretty formatting
        const jsonString = JSON.stringify(storyForExport, null, 2);

        // Unicode-safe filename: keep Arabic/other letters, drop only characters
        // that are invalid in file names.
        const safeTitle = String(storyForExport.title || 'story')
            .replace(/[\\/:*?"<>|\u0000-\u001f]/g, '_')
            .replace(/\s+/g, '_')
            .replace(/^[._]+|[._]+$/g, '')
            .slice(0, 80) || 'story';
        const filename = `${safeTitle}_${Date.now()}.json`;

        // Create download link
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;

        // Trigger download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Clean up
        URL.revokeObjectURL(url);

        showNotification(
            window.IStoriesI18n
                ? window.IStoriesI18n.t('reader.downloadedAs', { filename: filename })
                : `Story downloaded as ${filename}`,
            'success'
        );

    } catch (error) {
        console.error('Error downloading story:', error);
        showNotification(
            (window.IStoriesI18n
                ? window.IStoriesI18n.t('reader.downloadError')
                : 'Error downloading story: ') + error.message,
            'error'
        );
    }
}
function toggleAudio() {
    if (!currentStory) return;

    if (isAudioPlaying) {
        stopAudio();
        listenBtn.classList.remove('active');
    } else {
        startAudio();
        listenBtn.classList.add('active');
    }
}

function startAudio() {
    if (!('speechSynthesis' in window)) {
        showNotification('Text-to-speech is not supported in your browser.', 'error');
        return;
    }
    if (!currentStory) return;

    const utterance = speakText(currentStory.content.join(' '), currentStory.lang || 'en', {
        rate: 0.9,
        pitch: 1,
        volume: 1,
        onend: () => {
            isAudioPlaying = false;
            listenBtn.classList.remove('active');
        },
        onerror: () => {
            isAudioPlaying = false;
            listenBtn.classList.remove('active');
            showNotification('Error playing audio.', 'error');
        }
    });

    if (utterance) isAudioPlaying = true;
}

function stopAudio() {
    if ('speechSynthesis' in window) {
        speechSynthesis.cancel();
        isAudioPlaying = false;
    }
}

function listenToWord() {
    if (!currentWordData || !currentWordData.element) return;

    if ('speechSynthesis' in window) {
        speechSynthesis.cancel();
    }

    const wordToSpeak = currentWordData.element.innerText.trim();
    speakText(wordToSpeak, (currentStory && currentStory.lang) || 'en', { rate: 0.8 });
}

// ----------------------------------------------------
// 🌐 وظائف البحث
// ----------------------------------------------------

function searchOnGoogle() {
    if (!currentWordData || !currentWordData.element) return;

    const wordToSearch = currentWordData.element.innerText.trim();
    const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(wordToSearch)}+meaning`;

    window.open(googleSearchUrl, '_blank');
    hideDictionary();
}

// ----------------------------------------------------
// 📊 وظائف التقدم
// ----------------------------------------------------

function updateReadingProgress() {
    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        if (readingProgressBar) {
            readingProgressBar.style.width = scrolled + '%';
        }
    });
}

// ----------------------------------------------------
// 🔄 وظائف التنقل
// ----------------------------------------------------

function switchPage(page) {
    pages.forEach(p => p.classList.remove('active'));
    const pageElement = document.getElementById(page + 'Page');
    if (pageElement) pageElement.classList.add('active');

    navTabs.forEach(tab => tab.classList.remove('active'));
    document.querySelector(`.nav-tab[data-page="${page}"]`).classList.add('active');

    if (page === 'vocabulary') {
        renderVocabulary();
        updateVocabularyStats();
    }

    if (page === 'description') {
        renderDescription(currentStory);
    }
}

// User stats variables
let userStats = JSON.parse(localStorage.getItem('userStats')) || {
    xp: 0,
    wordsLearned: 0,
    readingTime: 0, // in minutes
    streakDays: 0,
    lastActiveDate: null,
    totalXP: 0
};
function addXP(amount, reason = '') {
    userStats.xp += amount;
    userStats.totalXP += amount;

    // Check for level up (every 100 XP = 1 level)
    const oldLevel = Math.floor((userStats.totalXP - amount) / 170);
    const newLevel = Math.floor(userStats.totalXP / 170);

    if (newLevel > oldLevel) {
        showNotification(`🎉 Level Up! You reached level ${newLevel}!`, 'success');
    }

    // Save to localStorage
    localStorage.setItem('userStats', JSON.stringify(userStats));

    // Update display
    updateUserStatsDisplay();

    console.log(`Added ${amount} XP${reason ? ' for: ' + reason : ''}`);
}
// ----------------------------------------------------
// 🛠️ وظائف التنظيف والإدارة
// ----------------------------------------------------

function cleanup() {
    window.removeEventListener('scroll', saveReadingPosition);
    window.removeEventListener('beforeunload', saveReadingPosition);

    if ('speechSynthesis' in window) {
        speechSynthesis.cancel();
    }

    document.removeEventListener('click', hideDictionary);
}

// ----------------------------------------------------
// 🎯 إعداد Event Listeners
// ----------------------------------------------------
function setupEventListeners() {
    // Remove existing listeners first to prevent duplicates
    if (saveWordBtn) {
        saveWordBtn.replaceWith(saveWordBtn.cloneNode(true));
        // Get fresh reference
        const freshSaveBtn = document.getElementById('saveWordBtn');

        freshSaveBtn.addEventListener('click', async function (e) {
            e.preventDefault();
            e.stopPropagation();

            // Call the save function
            await saveCurrentWord();

            // Add XP
            addXP(3, 'Saving word');
        });
    }
    // Close dictionary when clicking outside
    document.addEventListener('click', (e) => {
        const dictionaryPopup = document.getElementById('dictionaryPopup');
        const modalOverlay = document.getElementById('modalOverlay');

        // If dictionary is visible and click is outside of it
        if (dictionaryPopup && dictionaryPopup.style.display === 'block') {
            // Check if click is on the dictionary popup itself or its children
            const isClickInsidePopup = dictionaryPopup.contains(e.target);
            // Check if click is on the modal overlay
            const isClickOnOverlay = modalOverlay && modalOverlay.contains(e.target);

            if (!isClickInsidePopup && !isClickOnOverlay) {
                hideDictionary();
            }
        }
    });
    // Other event listeners...
    if (themeToggle) themeToggle.addEventListener('click', toggleTheme);
    if (fontSmaller) fontSmaller.addEventListener('click', () => adjustFontSize(-0.1));
    if (fontNormal) fontNormal.addEventListener('click', resetFontSize);
    if (fontLarger) fontLarger.addEventListener('click', () => adjustFontSize(0.1));
    if (lineSpacingBtn) lineSpacingBtn.addEventListener('click', toggleLineSpacing);
    if (listenBtn) listenBtn.addEventListener('click', toggleAudio);

    // Font family listener
    if (fontFamilySelect) {
        fontFamilySelect.addEventListener('change', function () {
            changeFontFamily(this.value);
        });
    }

    if (closePopup) closePopup.addEventListener('click', hideDictionary);
    if (modalOverlay) modalOverlay.addEventListener('click', hideDictionary);
    if (backToHome) backToHome.addEventListener('click', () => window.location.href = '../index.html');
    if (exportVocabularyBtn) exportVocabularyBtn.addEventListener('click', exportVocabulary);
    if (googleSearchBtn) googleSearchBtn.addEventListener('click', searchOnGoogle);
    if (listenWordBtn) listenWordBtn.addEventListener('click', listenToWord);
    if (googleTranslateBtn) googleTranslateBtn.addEventListener('click', translateOnGoogle);

    navTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            switchPage(tab.dataset.page);
        });
    });
    const downloadStoryBtn = document.querySelector('.download-story');
    if (downloadStoryBtn) {
        downloadStoryBtn.addEventListener('click', downloadCurrentStory);
    }
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            hideDictionary();
            if ('speechSynthesis' in window) {
                speechSynthesis.cancel();
            }
        }
    });

    window.addEventListener('scroll', saveReadingPosition);
    window.addEventListener('beforeunload', saveReadingPosition);

    window.addEventListener('beforeunload', () => {
        if (isAudioPlaying && 'speechSynthesis' in window) {
            speechSynthesis.cancel();
        }
    });

    window.addEventListener('beforeunload', cleanup);
}
// ----------------------------------------------------
// 🎨 إضافة CSS animations
// ----------------------------------------------------

const style = document.createElement('style');
style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .word.saved {
            animation: fadeIn 0.3s ease;
        }
        .no-translation-btn {
            opacity: 0.7;
        }
        .no-translation-btn:hover {
            opacity: 1;
        }
        button.disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }
        .loading {
            animation: pulse 1.5s infinite;
        }
        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }
        .user-story-badge {
            display: inline-block;
            background: var(--primary);
            color: white;
            padding: 4px 10px;
            border-radius: 12px;
            font-size: 0.8rem;
            font-weight: 600;
            margin-left: 10px;
            vertical-align: middle;
        }
        .user-story-badge i {
            margin-right: 5px;
        }
        .user-story-badge-small {
            display: inline-block;
            background: var(--primary);
            color: white;
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 0.7rem;
            margin-left: 8px;
            vertical-align: middle;
        }
        .word.from-user-story {
            border-left: 3px solid var(--primary);
        }
        .translation-badge {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: var(--primary);
            color: white;
            padding: 10px 15px;
            border-radius: 8px;
            font-size: 0.9rem;
            font-weight: 600;
            z-index: 999;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            display: flex;
            align-items: center;
            gap: 8px;
            animation: slideIn 0.3s ease;
        }
    `;
document.head.appendChild(style);

// ----------------------------------------------------
// The dictionary popup's own placeholder text is excluded from automatic
// translation (story words/translations live there), so localize it here only
// while no real word is being shown.
function localizeDictionaryPlaceholders() {
    var i18n = window.IStoriesI18n;
    if (!i18n) return;

    var popupOpen = dictionaryPopup && dictionaryPopup.style.display === 'block';

    if (popupWord) {
        var currentWord = popupWord.textContent.trim();
        if (!popupOpen || !currentWord ||
            currentWord === 'Dictionary' || currentWord === 'قاموس') {
            popupWord.textContent = i18n.t('reader.dictionary');
            if (typeof applyTextDirection === 'function') {
                applyTextDirection(popupWord, popupWord.textContent);
            }
        }
    }

    if (!popupTranslation) return;
    if (popupTranslation.querySelector('.word-translation-persistent')) return;

    if (popupOpen && currentWordData) {
        if (!currentWordData.hasTranslation) {
            popupTranslation.textContent = i18n.t('reader.noTranslation');
            if (typeof applyTextDirection === 'function') {
                applyTextDirection(popupTranslation, popupTranslation.textContent);
            }
        }
        return;
    }

    popupTranslation.textContent = i18n.t('reader.selectWord');
    if (typeof applyTextDirection === 'function') {
        applyTextDirection(popupTranslation, popupTranslation.textContent);
    }
}

// 🚀 دالة التهيئة (Initialization)
// ----------------------------------------------------
// Function to apply saved font family
function applyFontFamily() {
    if (storyText && fontFamily) {
        storyText.style.fontFamily = fontFamily;
    }

    // Set the select value
    if (fontFamilySelect) {
        fontFamilySelect.value = fontFamily;
    }
}
async function init() {
    try {
        // STEP 0: Set global color variables
        window.selectedColor = localStorage.getItem('selectedColor') || '#09d9ba';
        window.selectedSecondaryColor = localStorage.getItem('selectedSecondaryColor') || '#007ce1';

        // STEP 1: Apply saved theme FIRST
        console.log('Step 1: Applying theme...');
        applyTheme();

        // STEP 2: Apply saved colors immediately
        console.log('Step 2: Applying saved colors...');
        console.log('Primary color:', window.selectedColor);
        console.log('Secondary color:', window.selectedSecondaryColor);

        if (window.selectedColor) {
            applyPrimaryColor(window.selectedColor);
        }
        if (window.selectedSecondaryColor) {
            applySecondaryColor(window.selectedSecondaryColor);
        }

        loadFontSettings();
        localizeDictionaryPlaceholders();

        // STEP 3: Initialize color selectors
        console.log('Step 3: Initializing color selectors...');
        setTimeout(() => {
            if (window.initColorSelector && window.initSecondaryColorSelector) {
                initColorSelector();
                initSecondaryColorSelector();
            }
        }, 100);

        // STEP 5: Setup event listeners
        console.log('Step 5: Setting up event listeners...');
        setupEventListeners();

        // Apply saved font family
        applyFontFamily();

        // Load story
        await loadStory();
        // Wait a bit for DOM to fully render, then restore position


        // Update stats and render vocabulary
        updateVocabularyStats();
        setTimeout(() => {
            restoreReadingPosition();
        }, 200);
        // Auto lazy load images
        document.querySelectorAll('img').forEach(img => img.setAttribute('loading', 'lazy'));

        // FINAL STEP: Apply custom CSS
        console.log('Final Step: Applying custom CSS...');
        const savedCSS = localStorage.getItem('customCSS') || '';
        if (savedCSS.trim()) {
            applyCustomCSS(savedCSS);
            console.log('Custom CSS loaded from localStorage');
        }

    } catch (error) {
        console.error('Error during initialization:', error);
        showNotification('Failed to initialize application', 'error');
    }
}
document.addEventListener('ist-language-change', function () {
    localizeDictionaryPlaceholders();
    if (currentStory) renderDescription(currentStory);
});
document.addEventListener('DOMContentLoaded', init);