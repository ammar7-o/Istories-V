// App state
let savedWords = JSON.parse(localStorage.getItem('savedWords')) || [];
let theme = localStorage.getItem('theme') || 'light';
let fontSize = 1.2; // rem
let lineHeight = 1.8;
let isAudioPlaying = false;
let fontFamily = localStorage.getItem('fontFamily') || 'sans-serif'; // Add this line
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
// Function to get all available database files
async function getDatabaseFiles() {
    // Default files
    const defaultFiles = [
        '../database/main.js',
        '../database/more.js',
        '../database/stories1.js',
        '../database/stories2.js',
        '../database/stories3.js',
        '../database/adventure.js',
        '../database/romance.js',
        '../database/scifi.js',
        '../database/mystery.js',
        '../database/fantasy.js',
        '../database/horror.js'
    ];

    // Try to get dynamic list from server
    try {
        const response = await fetch('../database/db-list.json');
        if (response.ok) {
            const fileList = await response.json();
            return fileList.files || defaultFiles;
        }
    } catch (error) {
        console.log('No db-list.json found, using default files');
    }

    return defaultFiles;
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
        // First check if stories are already loaded in window.storiesData
        if (typeof window.storiesData !== 'undefined') {
            const allStories = window.storiesData.stories || window.storiesData;
            currentStory = allStories.find(s => s.id == storyId);
            if (currentStory) {
                await loadDictionary(currentStory.dictionaries);
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
                        const allStories = window.storiesData.stories || window.storiesData;

                        if (Array.isArray(allStories)) {
                            console.log(`Found ${allStories.length} stories in ${dbFile}`);

                            // Try to find the story by ID
                            currentStory = allStories.find(s => s.id == storyId);

                            if (currentStory) {
                                console.log(`🎉 Story found in ${dbFile}!`);

                                // Load dictionary if specified
                                if (currentStory.dictionaries) {
                                    await loadDictionary(currentStory.dictionaries);
                                }

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
            const storyResponse = await fetch(`../database/story_${storyId}.js`);
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
                    if (currentStory.dictionaries) {
                        await loadDictionary(currentStory.dictionaries);
                    }
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
// Show dictionary popup - updated to handle both clicks and text selection
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

    // If not found in custom dictionary, check main dictionary
    if (!wordData) {
        wordData = dictionary[word] || dictionary[getNormalizedKey(word)];
    }

    popupWord.textContent = originalWordText;

    if (listenWordBtn) {
        listenWordBtn.style.display = 'speechSynthesis' in window ? 'inline-block' : 'none';
    }

    if (wordData) {
        popupTranslation.textContent = wordData.translation;

        // Add source indicator if it's a custom translation
        if (wordData.source === 'user_story') {
            popupTranslation.innerHTML += ' <span style="font-size: 0.8rem; color: var(--primary); font-weight: 600;"><i class="fas fa-user-edit"></i> Custom</span>';
        }

        const isSaved = savedWords.some(w => w.word === word || w.originalWord === originalWordText);
        saveWordBtn.innerHTML = isSaved
            ? '<i class="fas fa-check"></i> Already Saved'
            : '<i class="fas fa-bookmark"></i> Save Word';
        saveWordBtn.disabled = isSaved;
        saveWordBtn.classList.toggle('disabled', isSaved);
        saveWordBtn.classList.remove('no-translation-btn');
    } else {
        popupTranslation.textContent = "لا توجد ترجمة متاحة";

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

    dictionaryPopup.style.top = `${rect.bottom + window.scrollY + 10}px`;
    dictionaryPopup.style.left = `${Math.max(10, rect.left + window.scrollX - 150)}px`;
    dictionaryPopup.style.display = 'block';

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

// Hide dictionary popup
function hideDictionary() {
    dictionaryPopup.style.display = 'none';
    currentWordData = null;
}
document.addEventListener('pointerdown', (e) => {
    if (!dictionaryPopup.contains(e.target)) {
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
            isCustomTranslation: isCustomTranslation || false
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

                // Use Google Translate API with timeout
                const translationPromise = translateWordWithGoogle(originalWord, targetLanguage);
                const timeoutPromise = new Promise((_, reject) => 
                    setTimeout(() => reject(new Error('Translation timeout')), 10000)
                );

                const googleTranslation = await Promise.race([translationPromise, timeoutPromise]);

                if (googleTranslation && googleTranslation !== originalWord) {
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
                    showNotification(`"${originalWord}" saved with translation`, 'success');

                } else {
                    // Google translation failed or returned same word
                    newWord.translation = "Translation unavailable";
                    newWord.definition = "Could not auto-translate this word";
                    newWord.example = "Word from story";
                    newWord.pos = "unknown";

                    // Save anyway (without translation)
                    saveWordToStorage(newWord, element);
                    showNotification(`"${originalWord}" saved (translation failed)`, 'warning');
                }

            } catch (error) {
                console.error('Auto-translation error:', error);

                // Save word without translation
                newWord.translation = "Translation failed: " + error.message;
                newWord.definition = "Auto-translation failed. Try manual translation.";
                newWord.example = "Word from story";
                newWord.pos = "unknown";
                newWord.translationError = error.message;

                saveWordToStorage(newWord, element);
                showNotification(`"${originalWord}" saved (translation error)`, 'error');

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

    } catch (error) {
        console.error('Save word error:', error);
        showNotification('Failed to save word', 'error');
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

// Function to translate word using Google Translate API
// Function to translate word using Google Translate API with retry logic
async function translateWordWithGoogle(word, targetLang = 'ar') {
    // Cache key for storing/retrieving translations
    const cacheKey = `translation_${word}_${targetLang}`;
    const cacheTimeKey = `translation_time_${word}_${targetLang}`;
    
    // Check cache first (cache for 24 hours)
    const cached = localStorage.getItem(cacheKey);
    const cacheTime = localStorage.getItem(cacheTimeKey);
    const now = Date.now();
    
    if (cached && cacheTime && (now - parseInt(cacheTime)) < 24 * 60 * 60 * 1000) {
        console.log('Using cached translation for:', word);
        return cached;
    }
    
    try {
        // Use multiple API endpoints - try them in order
        const apiEndpoints = [
            // Primary endpoint
            `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(word)}`,
            // Alternative endpoint 1
            `https://clients5.google.com/translate_a/t?client=dict-chrome-ex&sl=auto&tl=${targetLang}&q=${encodeURIComponent(word)}`,
            // Alternative endpoint 2
            `https://translate.google.com/translate_a/single?client=gtx&dt=t&sl=auto&tl=${targetLang}&q=${encodeURIComponent(word)}&ie=UTF-8&oe=UTF-8`
        ];

        let translation = null;
        
        // Try each endpoint until one works
        for (let i = 0; i < apiEndpoints.length; i++) {
            try {
                console.log(`Trying Google Translate endpoint ${i + 1} for: ${word}`);
                
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 8000);
                
                const response = await fetch(apiEndpoints[i], {
                    signal: controller.signal,
                    headers: {
                        'Accept': 'application/json',
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                    }
                });
                
                clearTimeout(timeoutId);
                
                if (!response.ok) {
                    console.log(`Endpoint ${i + 1} failed: HTTP ${response.status}`);
                    continue; // Try next endpoint
                }
                
                const data = await response.json();
                
                // Parse different response formats
                if (data && Array.isArray(data) && data[0] && data[0][0] && data[0][0][0]) {
                    translation = data[0][0][0];
                    console.log(`Successfully translated via endpoint ${i + 1}:`, translation);
                    break;
                } else if (data && data.sentences && Array.isArray(data.sentences)) {
                    translation = data.sentences[0].trans || data.sentences[0].translit;
                    console.log(`Successfully translated via endpoint ${i + 1}:`, translation);
                    break;
                } else if (data && typeof data === 'string') {
                    translation = data;
                    console.log(`Successfully translated via endpoint ${i + 1}:`, translation);
                    break;
                }
                
            } catch (endpointError) {
                console.log(`Endpoint ${i + 1} error:`, endpointError.message);
                continue; // Try next endpoint
            }
        }
        
        if (translation) {
            // Cache successful translation
            localStorage.setItem(cacheKey, translation);
            localStorage.setItem(cacheTimeKey, now.toString());
            return translation;
        } else {
            throw new Error('All translation endpoints failed');
        }

    } catch (error) {
        console.error('Google Translate error:', error);
        
        // Return cached value even if expired (better than nothing)
        if (cached) {
            console.log('Using expired cached translation for:', word);
            return cached + ' (cached)';
        }
        
        // Fallback to alternative translation service
        return await fallbackTranslation(word, targetLang);
    }
}

// Fallback translation service
async function fallbackTranslation(word, targetLang) {
    console.log('Trying fallback translation for:', word);
    
    try {
        // Try MyMemory Translation API
        const myMemoryUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(word)}&langpair=en|${targetLang}`;
        
        const response = await fetch(myMemoryUrl, { timeout: 5000 });
        
        if (response.ok) {
            const data = await response.json();
            if (data.responseData && data.responseData.translatedText) {
                console.log('Fallback translation successful via MyMemory');
                return data.responseData.translatedText + ' (fallback)';
            }
        }
    } catch (fallbackError) {
        console.error('Fallback translation error:', fallbackError);
    }
    
    // Return the original word if all else fails
    return word;
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














function setupMobileSelectionDetection() {
    let lastSelectedText = '';

    document.addEventListener('selectionchange', () => {
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) return;

        const selectedText = selection.toString().trim();
        if (!selectedText || selectedText.length > 90) return;

        // منع التكرار
        if (selectedText === lastSelectedText) return;
        lastSelectedText = selectedText;

        const range = selection.getRangeAt(0);

        if (storyText && storyText.contains(range.commonAncestorContainer)) {
            setTimeout(() => {
                handleTextSelection(selectedText, selection);
            }, 150);
        }
    });
}

// Function to detect text selection
function setupTextSelectionDetection() {
    let selectionTimeout;
    let mouseDownTime = 0;
    let mouseDownX = 0;
    let mouseDownY = 0;

    // Track when mouse is pressed down
    document.addEventListener('mousedown', function (e) {
        mouseDownTime = Date.now();
        mouseDownX = e.clientX;
        mouseDownY = e.clientY;
        clearTimeout(selectionTimeout);
    });

    // Listen for text selection
    document.addEventListener('mouseup', function (e) {
        const mouseUpTime = Date.now();
        const mouseUpX = e.clientX;
        const mouseUpY = e.clientY;
        const timeDiff = mouseUpTime - mouseDownTime;
        const distance = Math.sqrt(Math.pow(mouseUpX - mouseDownX, 2) + Math.pow(mouseUpY - mouseDownY, 2));

        // Get the selected text
        const selection = window.getSelection();
        const selectedText = selection.toString().trim();

        // Only proceed if:
        // 1. There's actually selected text
        // 2. It's a short selection (likely a word)
        // 3. User dragged mouse (not just clicked)
        if (selectedText && selectedText.length < 90 && selectedText.length > 0) {
            if (timeDiff > 100 || distance > 5) { // User dragged, not clicked
                // Check if selection is within story text
                if (storyText && storyText.contains(selection.anchorNode)) {
                    // Wait a bit to see if it's a double-click
                    selectionTimeout = setTimeout(() => {
                        handleTextSelection(selectedText, selection);
                    }, 200);
                }
            }
        }
    });

    // Double-click detection (separate from drag selection)
    document.addEventListener('dblclick', function (e) {
        clearTimeout(selectionTimeout);

        const selection = window.getSelection();
        const selectedText = selection.toString().trim();

        if (selectedText && storyText && storyText.contains(e.target)) {
            handleTextSelection(selectedText, selection);
        }
    });

    // Hide dictionary when clicking outside
    document.addEventListener('click', function (e) {
        // Only hide if clicking on non-word, non-popup elements
        if (dictionaryPopup.style.display === 'block' &&
            !dictionaryPopup.contains(e.target) &&
            !e.target.classList.contains('word') &&
            !e.target.closest('.word')) {

            hideDictionary();

            // Also clear any selection
            if (window.getSelection) {
                window.getSelection().removeAllRanges();
            }
        }
    });
}
// Handle text selection and show dictionary
function handleTextSelection(selectedText, selection) {
    // Get the exact position of the selection
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    // Check if the word exists in our clickable words
    const allWords = document.querySelectorAll('.word');
    let foundWordElement = null;

    // First, try to find an exact match among clickable words
    allWords.forEach(word => {
        if (word.textContent.trim() === selectedText) {
            foundWordElement = word;
        }
    });

    if (foundWordElement) {
        // Use the existing word's data
        const dataWord = foundWordElement.dataset.word;
        showDictionary(dataWord, foundWordElement, true);
    } else {
        // If no exact clickable word found, try to look it up in dictionary
        lookupAndShowSelectedWord(selectedText, rect);
    }

    // DO NOT clear selection here - let user see what they selected
    // selection.removeAllRanges();

    // Instead, add a visual highlight that fades out
    highlightSelection(selection);

}

function highlightSelection(selection) {
    const range = selection.getRangeAt(0);
    const rects = range.getClientRects();

    [...rects].forEach(rect => {
        const highlight = document.createElement('div');
        highlight.className = 'text-selection-highlight';
        highlight.style.cssText = `
            position: absolute;
            top: ${rect.top + window.scrollY}px;
            left: ${rect.left + window.scrollX}px;
            width: ${rect.width}px;
            height: ${rect.height}px;
            background-color: rgba(0, 123, 255, 0.05);
            border-radius: 3px;
            pointer-events: none;
            z-index: 999;
            transition: opacity 1s ease;
        `;

        document.body.appendChild(highlight);

        setTimeout(() => {
            highlight.style.opacity = '0';
            setTimeout(() => highlight.remove(), 1000);
        }, 1200);
    });
}


// Lookup a selected word and show dictionary popup
function lookupAndShowSelectedWord(word, rect) {
    const trimmedWord = word.trim();

    // Try to find the word in dictionary
    const standardKey = getStandardKey(trimmedWord);
    const normalizedKey = getNormalizedKey(trimmedWord);

    let wordData = null;
    let foundKey = null;

    // Check main dictionary
    if (dictionary[standardKey]) {
        wordData = dictionary[standardKey];
        foundKey = standardKey;
    } else if (dictionary[normalizedKey]) {
        wordData = dictionary[normalizedKey];
        foundKey = normalizedKey;
    }

    // Check custom dictionary
    if (!wordData) {
        const storyInfo = getStoryIdFromUrl();
        const userDictionaries = JSON.parse(localStorage.getItem('userDictionaries')) || {};
        const customDictionary = userDictionaries[storyInfo.id];

        if (customDictionary) {
            // Try to find in custom dictionary
            for (const [key, data] of Object.entries(customDictionary)) {
                if (getStandardKey(key) === standardKey || getNormalizedKey(key) === normalizedKey) {
                    wordData = typeof data === 'string' ? { translation: data } : data;
                    foundKey = key;
                    break;
                }
            }
        }
    }

    // Show the dictionary popup
    showDictionary(foundKey || standardKey, trimmedWord, true);
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
        window.selectedColor = localStorage.getItem('selectedColor') || '#4f46e5';
        window.selectedSecondaryColor = localStorage.getItem('selectedSecondaryColor') || '#10b981';

        // ====== NEW STEP: Load custom CSS FIRST ======
        console.log('Step 0.5: Loading custom CSS...');
        const savedCSS = localStorage.getItem('customCSS') || '';
        if (savedCSS.trim()) {
            applyCustomCSS(savedCSS);
            console.log('Custom CSS loaded from localStorage');
        }
        // ============================================

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

        // STEP 3: Initialize color selectors
        console.log('Step 3: Initializing color selectors...');
        // Wait for color selector script to be loaded
        setTimeout(() => {
            if (window.initColorSelector && window.initSecondaryColorSelector) {
                initColorSelector();
                initSecondaryColorSelector();
            }
        }, 100);

        // STEP 4: Setup text selection detection (NEW)
        console.log('Step 4: Setting up text selection detection...');
        const isMobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

        if (isMobile) {
            setupMobileSelectionDetection();
        } else {
            setupTextSelectionDetection();
        }


        // STEP 5: Setup event listeners
        console.log('Step 5: Setting up event listeners...');
        setupEventListeners();

        // Apply saved font family
        applyFontFamily();

        // Load story
        await loadStory();

        // Update stats and render vocabulary
        updateVocabularyStats();

        // Restore reading position
        setTimeout(() => {
            restoreReadingPosition();
        }, 200);

        // Auto lazy load images
        document.querySelectorAll('img').forEach(img => img.setAttribute('loading', 'lazy'));


    } catch (error) {
        console.error('Error during initialization:', error);
        showNotification('Failed to initialize application', 'error');
    }
}
document.addEventListener('DOMContentLoaded', init);