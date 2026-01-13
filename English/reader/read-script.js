// App state
let savedWords = JSON.parse(localStorage.getItem('savedWords')) || [];
let theme = localStorage.getItem('theme') || 'light';
let fontSize = 1.2; // rem
let lineHeight = 1.8;
let isAudioPlaying = false;
let currentStory = null;
let currentWordData = null;
let dictionary = {};

// DOM elements
const storyTitle = document.getElementById('storyTitle');
const storyText = document.getElementById('storyText');
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
const popupPos = document.getElementById('popupPos');
const popupDefinition = document.getElementById('popupDefinition');
const popupExample = document.getElementById('popupExample');
const popupTranslation = document.getElementById('popupTranslation');
const readingProgressBar = document.getElementById('readingProgressBar');
const backToHome = document.getElementById('backToHome');
const exportVocabularyBtn = document.getElementById('exportVocabulary');
const vocabularyList = document.getElementById('vocabularyList');
const navTabs = document.querySelectorAll('.nav-tab');
const pages = document.querySelectorAll('.page');
const googleSearchBtn = document.getElementById('googleSearchBtn');
const listenWordBtn = document.getElementById('listenWordBtn');
const removebtn = document.getElementById("removebtn");
const sound = document.getElementById("sound");
const lvl = document.getElementById("lvl");
const lvlcefr = document.getElementById("lvlcefr");

const googleTranslateBtn = document.getElementById('googleTranslateBtn');

// ----------------------------------------------------
// 📚 وظائف القواميس والتوحيد
// ----------------------------------------------------

// Get story ID from URL
function getStoryIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    const isUserStory = urlParams.get('userStory') === 'true';

    return {
        id: id || '1',
        isUserStory: isUserStory
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

/**
 * Load dictionaries from JSON file(s).
 * يتضمن تنظيف مفاتيح القاموس من الفراغات الزائدة أثناء التحميل.
 */
async function loadDictionary(dictionaryPaths) {
    if (!Array.isArray(dictionaryPaths)) {
        dictionaryPaths = dictionaryPaths ? [dictionaryPaths] : [];
    }

    dictionary = {};

    if (dictionaryPaths.length === 0) {
        console.log('No dictionary paths provided.');
        return;
    }

    try {
        const loadPromises = dictionaryPaths.map(async (path) => {
            if (!path) return {};

            try {
                const response = await fetch(path);
                if (!response.ok) {
                    throw new Error(`Failed to load dictionary: ${response.status} from ${path}`);
                }
                const dictContent = await response.json();

                console.log(`Loaded ${Object.keys(dictContent).length} words from: ${path}`);
                return dictContent;

            } catch (error) {
                console.error(`Error loading dictionary from ${path}:`, error);
                return {};
            }
        });

        const allDictionaries = await Promise.all(loadPromises);

        // دمج جميع القواميس وتجريد المفاتيح من الفراغات الزائدة
        dictionary = allDictionaries.reduce((mergedDict, currentDict) => {
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

// Add this function to load user translations
// Update the loadUserTranslations function
function loadUserTranslations(storyId) {
    try {
        // Get user dictionaries from localStorage
        const userDictionaries = JSON.parse(localStorage.getItem('userDictionaries')) || {};

        // Check if this story has custom translations
        const customDictionary = userDictionaries[storyId];

        if (customDictionary) {
            console.log(`Loading ${Object.keys(customDictionary).length} custom translations for story ${storyId}`);

            let loadedCount = 0;

            // Merge custom translations into main dictionary
            for (const [word, data] of Object.entries(customDictionary)) {
                const standardKey = getStandardKey(word);
                const normalizedKey = getNormalizedKey(word);

                if (typeof data === 'string') {
                    // If data is just a string translation
                    dictionary[standardKey] = {
                        translation: data,
                        pos: "unknown",
                        definition: `Custom translation from user story`,
                        example: `From "${currentStory?.title || 'user story'}"`,
                        source: 'user_story'
                    };
                    loadedCount++;
                } else if (data && typeof data === 'object') {
                    // If data is an object with translation properties
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

            console.log(`Successfully loaded ${loadedCount} custom translations for story ${storyId}`);
            return loadedCount > 0;
        }
    } catch (error) {
        console.error('Error loading user translations:', error);
    }
    return false;
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

// Load story from database files by ID or user stories
async function loadStory() {
    try {
        storyTitle.textContent = 'Loading...';
        storyText.innerHTML = '<div class="loading" style="text-align: center; padding: 40px; color: var(--text-light);">Loading story...</div>';

        const storyInfo = getStoryIdFromUrl();
        const storyId = storyInfo.id;
        const isUserStory = storyInfo.isUserStory;
        const fallbackId = 1;

        // Clear dictionary before loading new story
        dictionary = {};

        // Check if it's a user story first
        if (isUserStory) {
            const userStories = getUserStories();
            currentStory = userStories.find(s => s.id === storyId);

            if (currentStory) {
                // First load custom translations if they exist
                const hasCustomTranslations = loadUserTranslations(storyId);

                // Then load default dictionary
                await loadDictionary(currentStory.dictionaries || ["../dictionarys/main.json"]);

                // Show translation badge if custom translations exist
                if (hasCustomTranslations) {
                    setTimeout(addTranslationBadge, 1000);
                }

                displayStory(currentStory);
                return;
            }
        }

        // If not a user story or user story not found, try regular stories
        if (typeof window.storiesData !== 'undefined') {
            const allStories = window.storiesData.stories || window.storiesData;
            currentStory = allStories.find(s => s.id == storyId); // Use == instead of === to handle string vs number
            if (currentStory) {
                await loadDictionary(currentStory.dictionaries);
                displayStory(currentStory);
                return;
            }
        }

        // Try loading from main.js
        try {
            const mainResponse = await fetch('../database/main.js');
            if (mainResponse.ok) {
                const mainText = await mainResponse.text();
                const mainMatch = mainText.match(/window\.storiesData\s*=\s*({[\s\S]*?});/);
                if (mainMatch) {
                    try {
                        const jsonStr = mainMatch[1].replace(/window\.storiesData\s*=\s*/, '');
                        window.storiesData = JSON.parse(jsonStr);
                    } catch (e) {
                        eval(mainMatch[0]);
                    }

                    const allStories = window.storiesData.stories || window.storiesData;
                    currentStory = allStories.find(s => s.id == storyId);
                    if (currentStory) {
                        await loadDictionary(currentStory.dictionaries);
                        displayStory(currentStory);
                        return;
                    }
                }
            }
        } catch (error) {
            console.log('Could not load main.js:', error);
        }

        // Try loading from more.js
        try {
            const moreResponse = await fetch('../database/more.js');
            if (moreResponse.ok) {
                const moreText = await moreResponse.text();
                const moreMatch = moreText.match(/window\.storiesData\s*=\s*({[\s\S]*?});/);
                if (moreMatch) {
                    try {
                        const jsonStr = moreMatch[1].replace(/window\.storiesData\s*=\s*/, '');
                        window.storiesData = JSON.parse(jsonStr);
                    } catch (e) {
                        eval(moreMatch[0]);
                    }

                    const allStories = window.storiesData.stories || window.storiesData;
                    currentStory = allStories.find(s => s.id == storyId);
                    if (currentStory) {
                        await loadDictionary(currentStory.dictionaries);
                        displayStory(currentStory);
                        return;
                    }
                }
            }
        } catch (error) {
            console.log('Could not load more.js:', error);
        }

        // Fallback story
        currentStory = getFallbackStory(storyId);
        if (currentStory.dictionaries || currentStory.dictionary) {
            await loadDictionary(currentStory.dictionaries || currentStory.dictionary);
        }
        displayStory(currentStory);

    } catch (error) {
        console.error('Error loading story:', error);
        showNotification('Failed to load story. Using fallback story.', 'error');
        currentStory = getFallbackStory(fallbackId);
        displayStory(currentStory);
    }
}

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

    if (savedPosition &&
        savedPosition.id == storyInfo.id &&
        savedPosition.isUserStory === storyInfo.isUserStory) {

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
            dictionaries: ["../dictionarys/main.json"],
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
            dictionaries: ["../dictionarys/main.json"],
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
function displayStory(story) {
    storyTitle.textContent = story.title;

    if (story.author && story.author.trim() !== "") {
        const badge = document.createElement('span');
        badge.className = 'user-story-badge';
        badge.innerHTML = `<i class="fas fa-user"></i> ${story.author}`;
        badge.style.cssText = `
            display: inline-block;
            margin-left: 10px;
            background: var(--primary);
            color: white;
            padding: 4px 10px;
            border-radius: 12px;
            font-size: 0.8rem;
            font-weight: 600;
        `;
        storyTitle.appendChild(badge);
    }

    // التحكم في الصوت حسب وجود src أو لا
    if (sound) {
        if (story.sound && story.sound.trim() !== "") {
            sound.src = story.sound;
            sound.style.display = "block";      // إظهار الصوت
        } else {
            sound.removeAttribute("src");
            sound.style.display = "none";       // إخفاؤه إذا لا توجد قراءة
        }
    }

    // Display difficulty level
    if (lvl && story.level) {
        const level = story.level.toLowerCase(); // normalize value

        // Capitalize first letter for display
        lvl.textContent = level.charAt(0).toUpperCase() + level.slice(1);

        // Remove old level classes (important)
        lvl.classList.remove('beginner', 'intermediate', 'advanced');

        // Add class based on level
        if (level === 'beginner') {
            lvl.classList.add('beginner');
        } else if (level === 'intermediate') {
            lvl.classList.add('intermediate');
        } else if (level === 'advanced') {
            lvl.classList.add('advanced');
        }
    }

    // Display CEFR level - FIXED
    if (lvlcefr && story.levelcefr && story.levelcefr.trim() !== "") {
        // Remove any old CEFR classes
        lvlcefr.classList.remove('A1', 'A2', 'B1', 'B2', 'C1', 'C2');

        // Set text content
        lvlcefr.textContent = story.levelcefr.toUpperCase();

        // Add appropriate CEFR class for styling
        const cefrLevel = story.levelcefr.toUpperCase();
        lvlcefr.classList.add(cefrLevel);
    } else if (lvlcefr) {
        // If no CEFR level, hide the element
        lvlcefr.style.display = 'none';
    }

    storyText.innerHTML = '';

    story.content.forEach(paragraph => {
        const p = document.createElement('div');
        p.className = 'paragraph';
        p.innerHTML = makeWordsClickable(paragraph, { debug: false });
        storyText.appendChild(p);
    });

    setupWordInteractions();
    updateReadingProgress();
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
    // regex لكلمة فرنسية/انجليزية مع دعم apostrophes والواصلات.
    const wordPattern = /[A-Za-zÀ-ÖØ-öø-ÿ0-9’']+(?:[’'\-][A-Za-zÀ-ÖØ-öø-ÿ0-9]+)*/g;

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

    // دالة المعالجة الرئيسية (تستخدم Pre-order Traversal)
    function traverseAndWrap(node) {
        if (skipTags.has(node.nodeName)) {
            return;
        }

        if (node.nodeType === Node.TEXT_NODE) {
            const text = node.nodeValue;

            const wrappedText = text.replace(wordPattern, (match) => {

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
            });

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
            e.stopPropagation();
            showDictionary(dataWord, word);
        });
    });
}

// Validate word data
function validateWordData(wordData) {
    if (!wordData || typeof wordData !== 'object') return false;
    return wordData.word && wordData.translation;
}

// Show dictionary popup
// Update the showDictionary function to properly merge custom translations
function showDictionary(word, element) {
    if (!word) return;

    // First, check if we have user translations for this story
    const storyInfo = getStoryIdFromUrl();
    const userDictionaries = JSON.parse(localStorage.getItem('userDictionaries')) || {};
    const customDictionary = userDictionaries[storyInfo.id];

    let wordData = null;

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

    // If not found in custom dictionary, check main dictionary
    if (!wordData) {
        wordData = dictionary[word] || dictionary[getNormalizedKey(word)];
    }

    popupWord.textContent = element.innerText;

    if (listenWordBtn) {
        listenWordBtn.style.display = 'speechSynthesis' in window ? 'inline-block' : 'none';
    }

    if (wordData) {
        popupTranslation.textContent = wordData.translation;
        popupPos.style.display = 'none';
        popupDefinition.style.display = 'none';
        popupExample.style.display = 'none';

        // Add source indicator if it's a custom translation
        if (wordData.source === 'user_story') {
            popupTranslation.innerHTML += ' <span style="font-size: 0.8rem; color: var(--primary); font-weight: 600;"><i class="fas fa-user-edit"></i> Custom</span>';
        }

        const isSaved = savedWords.some(w => w.word === word);
        saveWordBtn.innerHTML = isSaved
            ? '<i class="fas fa-check"></i> Already Saved'
            : '<i class="fas fa-bookmark"></i> Save Word';
        saveWordBtn.disabled = isSaved;
        saveWordBtn.classList.toggle('disabled', isSaved);
        saveWordBtn.classList.remove('no-translation-btn');
    } else {
        popupTranslation.textContent = "لا توجد ترجمة متاحة";
        popupPos.style.display = 'none';
        popupDefinition.style.display = 'none';
        popupExample.style.display = 'none';

        saveWordBtn.innerHTML = '<i class="fas fa-bookmark"></i> Save Word (No Translation)';
        saveWordBtn.disabled = false;
        saveWordBtn.classList.add('no-translation-btn');
    }

    if (!validateWordData({ word: word, translation: wordData?.translation || "No translation" })) {
        console.warn('Invalid word data for:', word);
    }

    currentWordData = {
        word: word,
        element: element,
        hasTranslation: !!wordData,
        wordData: wordData,
        isCustomTranslation: wordData?.source === 'user_story'
    };

    const rect = element.getBoundingClientRect();
    dictionaryPopup.style.top = `${rect.bottom + window.scrollY + 10}px`;
    dictionaryPopup.style.left = `${Math.max(10, rect.left + window.scrollX - 150)}px`;
    dictionaryPopup.style.display = 'block';
}

// Hide dictionary popup
function hideDictionary() {
    dictionaryPopup.style.display = 'none';
    currentWordData = null;
}

document.addEventListener('click', (e) => {
    if (dictionaryPopup && !dictionaryPopup.contains(e.target) && !e.target.classList.contains('word')) {
        hideDictionary();
    }
});

// ----------------------------------------------------
// 📖 وظائف المفردات والإحصائيات
// ----------------------------------------------------

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    const colors = {
        success: 'rgb(13, 167, 116)',
        warning: '#f59e0b',
        error: '#ef4444',
        info: '#3b82f6'
    };

    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${colors[type] || colors.success};
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        font-weight: 500;
        animation: slideIn 0.3s ease;
        max-width: 400px;
        word-wrap: break-word;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

function saveCurrentWord() {
    if (!currentWordData) {
        showNotification('No word selected', 'error');
        return;
    }

    const { word, element, hasTranslation, wordData, isCustomTranslation } = currentWordData;

    if (savedWords.some(w => w.word === word)) {
        showNotification('Word already saved!', 'info');
        return;
    }

    const storyTitle = currentStory ? currentStory.title : 'Unknown Story';
    const isUserStory = currentStory ? currentStory.isUserStory : false;

    const newWord = {
        word: word,
        originalWord: element.innerText,
        status: 'saved',
        added: new Date().toISOString(),
        nextReview: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        story: storyTitle,
        hasTranslation: hasTranslation,
        fromUserStory: isUserStory || false,
        isCustomTranslation: isCustomTranslation || false
    };

    if (hasTranslation && wordData) {
        newWord.translation = wordData.translation;
        newWord.definition = wordData.definition || "Check back later for definition";
        newWord.example = wordData.example || "Check back later for example";
        newWord.pos = wordData.pos || "unknown";
    } else {
        newWord.translation = "No translation available";
        newWord.definition = "This word is not yet in our dictionary";
        newWord.example = "We're working on adding more words to our database";
        newWord.pos = "unknown";
    }

    savedWords.push(newWord);
    localStorage.setItem('savedWords', JSON.stringify(savedWords));

    hideDictionary();

    if (element) {
        element.classList.add('saved');
        element.classList.remove('no-translation');
    }

    if (document.querySelector('.nav-tab.active[data-page="vocabulary"]')) {
        renderVocabulary();
        updateVocabularyStats();
    }

    const translationSource = isCustomTranslation ? "custom translation" : "dictionary";
    const message = hasTranslation
        ? `"${element.innerText}" saved to vocabulary from "${storyTitle}" (${translationSource})!`
        : `"${element.innerText}" saved to vocabulary from "${storyTitle}" (translation will be added later)`;

    // showNotification(message, hasTranslation ? 'success' : 'warning');
}

function translateOnGoogle() {
    if (!currentWordData || !currentWordData.element) return;
    const wordToTranslate = currentWordData.element.innerText.trim();
    const translateUrl = `https://translate.google.com/?sl=auto&tl=ar&text=${encodeURIComponent(wordToTranslate)}&op=translate`;
    window.open(translateUrl, '_blank');
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

// Render vocabulary list - compatible with both formats
function renderVocabulary() {
    if (!vocabularyList) return;

    vocabularyList.innerHTML = '';

    if (savedWords.length === 0) {
        vocabularyList.innerHTML = `
            <div style="text-align: center; padding: 40px; color: var(--text-light);">
                <p>No words saved yet. Click on words in stories to add them to your vocabulary.</p>
            </div>
        `;
        return;
    }

    savedWords.forEach((word, index) => {
        const item = document.createElement('div');
        item.className = 'vocabulary-item';

        // Handle different field names from different sources
        const displayWord = word.originalWord || word.word || '';
        const translation = word.translation || '';
        const story = word.story || '';

        // Handle date field - imported data uses 'addedDate', existing uses 'added' or 'date'
        const addedDate = word.addedDate || word.added || word.date || new Date().toISOString();

        // Check if translation exists (imported data always has translation)
        const hasTranslation = translation && translation !== displayWord;

        // Check status
        const status = word.status || 'saved';

        // Check if from user story
        const fromUserStory = word.fromUserStory || false;

        const translationBadge = !hasTranslation
            ? `<span class="no-translation-badge" style="background: #f59e0b; color: white; padding: 2px 6px; border-radius: 4px; font-size: 0.7rem; margin-left: 8px;">No Translation</span>`
            : '';

        const masteredBadge = status === 'mastered'
            ? `<span class="mastered-badge" style="background: rgb(13, 167, 116); color: white; padding: 2px 6px; border-radius: 4px; font-size: 0.7rem; margin-left: 8px;">Mastered</span>`
            : '';

        const userStoryBadge = fromUserStory
            ? `<span class="user-story-badge-small" style="background: var(--primary); color: white; padding: 2px 6px; border-radius: 4px; font-size: 0.7rem; margin-left: 8px;">Your Story</span>`
            : '';

        item.innerHTML = `
            <div class="word-info">
                <div class="word-main">
                    <span class="word-text">${displayWord}</span>
                    <span class="word-translation">${translation || 'No translation available'}</span>
                    ${translationBadge}
                    ${masteredBadge}
                    ${userStoryBadge}
                </div>
                ${story ? `<div class="word-story" style="font-size: 0.8rem; color: var(--text-light); margin-top: 5px;">From: ${story}</div>` : ''}
                <div class="word-date" style="font-size: 0.7rem; color: var(--text-lighter); margin-top: 3px;">
                    Added: ${formatVocabularyDate(addedDate)}
                </div>
            </div>
            <div class="word-actions">
                <button title="Mark as mastered" data-index="${index}">
                    <i class="fas fa-check"></i>
                </button>
                <button title="Delete" data-index="${index}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;

        vocabularyList.appendChild(item);
    });

    document.querySelectorAll('.word-actions button').forEach(button => {
        button.addEventListener('click', (e) => {
            const index = parseInt(e.currentTarget.dataset.index);
            if (e.currentTarget.querySelector('.fa-check')) {
                markAsMastered(index);
            } else if (e.currentTarget.querySelector('.fa-trash')) {
                deleteWord(index);
            }
        });
    });
}

// Helper function to format date properly
function formatVocabularyDate(dateValue) {
    if (!dateValue) return 'Unknown date';

    try {
        const date = new Date(dateValue);
        if (isNaN(date.getTime())) {
            return 'Invalid date';
        }
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    } catch (error) {
        return 'Invalid date';
    }
}

// Also update your saveWord function to handle both formats
function saveWord(word, translation, story = '', hasTranslation = true) {
    // Check if word already exists
    const existingIndex = savedWords.findIndex(w =>
        w.word.toLowerCase() === word.toLowerCase() ||
        w.originalWord?.toLowerCase() === word.toLowerCase()
    );

    if (existingIndex === -1) {
        // Add new word with both field names for compatibility
        savedWords.push({
            word: word,
            originalWord: word,
            translation: translation,
            story: story,
            hasTranslation: hasTranslation,
            added: new Date().toISOString(),
            addedDate: new Date().toISOString(),
            status: 'saved'
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
function markAsMastered(index) {
    if (index < 0 || index >= savedWords.length) return;

    savedWords[index].status = 'mastered';
    savedWords[index].masteredDate = new Date().toISOString();
    localStorage.setItem('savedWords', JSON.stringify(savedWords));

    updateVocabularyStats();
    showNotification(`"${savedWords[index].originalWord || savedWords[index].word}" marked as mastered!`, 'success');
    renderVocabulary();
}

function deleteWord(index) {
    if (index < 0 || index >= savedWords.length) return;

    const word = savedWords[index].originalWord || savedWords[index].word;

    // Remove the word immediately without confirmation
    savedWords.splice(index, 1);
    localStorage.setItem('savedWords', JSON.stringify(savedWords));
    updateVocabularyStats();
    renderVocabulary();
    showNotification(`"${word}" removed from vocabulary`);
}

// copy button
const copyBtn = document.getElementById("copy");
if (copyBtn) {
    copyBtn.addEventListener("click", copyStoryFast);
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

function removeAll() {
    if (savedWords.length === 0) {
        showNotification('No words to remove!', 'info');
        return;
    }

    const confirmed = window.confirm(`Are you sure you want to remove all ${savedWords.length} saved words? This action cannot be undone.`);

    if (!confirmed) return;

    localStorage.setItem('savedWords', JSON.stringify([]));
    savedWords = [];

    showNotification(`All saved words removed successfully!`, 'success');

    renderVocabulary();
    updateVocabularyStats();
}

function exportVocabulary() {
    if (savedWords.length === 0) {
        showNotification('No vocabulary to export!');
        return;
    }

    const headers = ['Word', 'Original Word (if different)', 'Translation', 'Status', 'Story', 'Date Added', 'From User Story'];

    const csvRows = [
        headers.join(','),
        ...savedWords.map(word => {
            return [
                `"${word.word || ''}"`,
                `"${(word.originalWord || '').replace(/"/g, '""')}"`,
                `"${(word.translation || '').replace(/"/g, '""')}"`,
                `"${word.status || ''}"`,
                `"${(word.story || '').replace(/"/g, '""')}"`,
                `"${word.added ? new Date(word.added).toLocaleDateString('en-US') : ''}"`,
                `"${word.fromUserStory ? 'Yes' : 'No'}"`
            ].join(',');
        })
    ];

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);

    const date = new Date();
    const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    link.setAttribute('download', `my_vocabulary_${formattedDate}.csv`);

    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showNotification(`Vocabulary exported successfully! (${savedWords.length} words)`);
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
    } else {
        document.body.classList.remove('dark-mode');
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    }
}

function adjustFontSize(change) {
    fontSize += change;
    fontSize = Math.max(1, Math.min(2, fontSize));
    storyText.style.fontSize = `${fontSize}rem`;

    fontSmaller.classList.toggle('active', fontSize < 1.2);
    fontNormal.classList.toggle('active', fontSize === 1.2);
    fontLarger.classList.toggle('active', fontSize > 1.2);
}

function resetFontSize() {
    fontSize = 1.2;
    storyText.style.fontSize = `${fontSize}rem`;

    fontSmaller.classList.remove('active');
    fontNormal.classList.add('active');
    fontLarger.classList.remove('active');
}

function toggleLineSpacing() {
    lineHeight = lineHeight === 1.8 ? 2.2 : 1.8;
    storyText.style.lineHeight = lineHeight;
    lineSpacingBtn.classList.toggle('active', lineHeight === 2.2);
}

// ----------------------------------------------------
// 🔊 وظائف الصوت
// ----------------------------------------------------

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
    if ('speechSynthesis' in window && currentStory) {
        const utterance = new SpeechSynthesisUtterance();
        utterance.text = currentStory.content.join(' ');
        utterance.rate = 0.9;
        utterance.pitch = 1;
        utterance.volume = 1;

        speechSynthesis.speak(utterance);
        isAudioPlaying = true;

        utterance.onend = () => {
            isAudioPlaying = false;
            listenBtn.classList.remove('active');
        };

        utterance.onerror = () => {
            isAudioPlaying = false;
            listenBtn.classList.remove('active');
            showNotification('Error playing audio.', 'error');
        };
    } else {
        showNotification('Text-to-speech is not supported in your browser.', 'error');
    }
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
    const utterance = new SpeechSynthesisUtterance(wordToSpeak);

    utterance.rate = 0.8;

    speechSynthesis.speak(utterance);
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
    if (themeToggle) themeToggle.addEventListener('click', toggleTheme);
    if (fontSmaller) fontSmaller.addEventListener('click', () => adjustFontSize(-0.1));
    if (fontNormal) fontNormal.addEventListener('click', resetFontSize);
    if (fontLarger) fontLarger.addEventListener('click', () => adjustFontSize(0.1));
    if (lineSpacingBtn) lineSpacingBtn.addEventListener('click', toggleLineSpacing);
    if (listenBtn) listenBtn.addEventListener('click', toggleAudio);
    if (saveWordBtn) saveWordBtn.addEventListener('click', saveCurrentWord);
    if (closePopup) closePopup.addEventListener('click', hideDictionary);
    if (modalOverlay) modalOverlay.addEventListener('click', hideDictionary);
    if (backToHome) backToHome.addEventListener('click', () => window.location.href = '../index.html');
    if (exportVocabularyBtn) exportVocabularyBtn.addEventListener('click', exportVocabulary);

    if (googleSearchBtn) googleSearchBtn.addEventListener('click', searchOnGoogle);
    if (listenWordBtn) listenWordBtn.addEventListener('click', listenToWord);
    if (removebtn) removebtn.addEventListener("click", removeAll);
    if (googleTranslateBtn) googleTranslateBtn.addEventListener('click', translateOnGoogle);

    navTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            switchPage(tab.dataset.page);
        });
    });

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
// 🚀 دالة التهيئة (Initialization)
// ----------------------------------------------------

async function init() {
    try {

        // STEP 1: Apply saved theme FIRST (this sets dark/light mode)
        console.log('Step 1: Applying theme...');
        applyTheme();

        // STEP 2: Apply saved primary color immediately
        console.log('Step 2: Applying saved color:', selectedColor);
        if (selectedColor) {
            // Apply immediately without delay
            applyPrimaryColor(selectedColor);
        }

        // STEP 3: Initialize color selector (this sets up click handlers)
        console.log('Step 3: Initializing color selector...');
        // Add a small delay to ensure DOM is fully loaded
        setTimeout(() => {
            initColorSelector();
        }, 50);

        // Setup event listeners after DOM is ready
        setTimeout(() => {
            setupEventListeners();
        }, 100);

        // Load story
        await loadStory();

        // Update stats and render vocabulary
        updateVocabularyStats();
        renderVocabulary();

        // Restore reading position after a short delay
        setTimeout(() => {
            restoreReadingPosition();
        }, 200);
        // Auto lazy load ALL images
        document.querySelectorAll('img').forEach(img => img.setAttribute('loading', 'lazy'));

    } catch (error) {
        console.error('Error during initialization:', error);
        showNotification('Failed to initialize application', 'error');
    }
}

document.addEventListener('DOMContentLoaded', init);