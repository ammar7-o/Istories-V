


// App state
let currentPage = 'home';
let currentStory = null;
let savedWords = JSON.parse(localStorage.getItem('savedWords')) || [];
// IndexedDB is async; refresh this once storage is ready (before DOMContentLoaded init runs).
if (window.IStoriesStorage) IStoriesStorage.whenReady(function () {
    savedWords = JSON.parse(localStorage.getItem('savedWords')) || [];
});
let fontSize = 1.2; // rem
let lineHeight = 1.8;
let stories = []; // Will be loaded from external file
let showUserStories = localStorage.getItem('showUserStories') !== 'false'; // Default: true
// Store current word for saving
let currentWordData = null;

// Dictionary fallback
let dictionary = window.dictionary || {};

// DOM elements
const pages = document.querySelectorAll('.page');
// The main page has no .nav-link elements of its own, but switchPage()
// (storiesStudio/addstories.js) expects this list to exist. Keeping it here mirrors the
// vocabulary/flashcard/quiz pages and prevents a ReferenceError.
const navLinks = document.querySelectorAll('.nav-link');

const levelBtns = document.querySelectorAll('.level-btn');
const storiesGrid = document.getElementById('storiesGrid');

// Current library filters (level + language). Kept in one place so offers like
// "shuffle"/re-render keep the user's selection.
let currentLevel = 'all';
let currentLang = 'all';
const storyText = document.getElementById('storyText');
const dictionaryPopup = document.getElementById('dictionaryPopup');
const backToStories = document.getElementById('backToStories');
const fontSmaller = document.getElementById('fontSmaller');
const fontNormal = document.getElementById('fontNormal');
const fontLarger = document.getElementById('fontLarger');
const lineSpacingBtn = document.getElementById('lineSpacing');
const listenBtn = document.getElementById('listenBtn');
const saveWordBtn = document.getElementById('saveWordBtn');
const closePopup = document.getElementById('closePopup');


// Initialize the app
function init() {
    console.log('App initialization started...');
    // Auto lazy load ALL images
    // document.querySelectorAll('img').forEach(img => img.setAttribute('loading', 'lazy'));
    // Wait for stories to be loaded from external file
    if (typeof window.storiesData !== 'undefined') {
        stories = window.storiesData.stories || window.storiesData;
        console.log('Loaded stories from external file:', stories.length);
    } else {
        // Fallback if external file fails
        stories = [
            {
                id: 1,
                title: "The Mysterious Island",
                level: "beginner",
                cover: "🏝️",
                coverType: "emoji",
                wordCount: 350,
                content: ["This is a sample story. Click on words like village or journey to see the dictionary."]
            }
        ];
        console.log('Using fallback stories');
    }

    // Load user stories from localStorage
    try {
        const storedUserStories = JSON.parse(localStorage.getItem('userStories')) || [];
        userStories = storedUserStories;

        // Add user stories to main stories array
        userStories.forEach(userStory => {
            if (!stories.some(s => s.id === userStory.id)) {
                stories.push(userStory);
            }
        });
        console.log('Loaded user stories:', userStories.length);
    } catch (error) {
        console.error('Error loading user stories:', error);
        userStories = [];
    }

    // STEP 1: Apply saved theme FIRST
    console.log('Step 1: Applying theme...');
    applyTheme();

    // STEP 2: Apply saved primary color immediately
    console.log('Step 2: Applying saved primary color:', selectedColor);
    if (selectedColor) {
        applyPrimaryColor(selectedColor);
    }

    // STEP 3: Apply saved secondary color immediately
    console.log('Step 2.5: Applying saved secondary color:', selectedSecondaryColor);
    if (selectedSecondaryColor) {
        applySecondaryColor(selectedSecondaryColor);
    }

    // Initialize user stats
    initUserStats();
    // ADD THIS: Initialize user stories setting toggle
    console.log('Step 7.5: Initializing user stories setting...');
    initUserStoriesSetting();
    // Check for daily bonus
    checkDailyBonus();
    // STEP 4: Initialize color selectors
    console.log('Step 3: Initializing color selectors...');
    setTimeout(() => {
        initColorSelector();
        initSecondaryColorSelector(); // Add this line
    }, 50);

    // STEP 5: Render stories and other UI elements
    console.log('Step 4: Rendering UI...');
    renderStories();
    setupSearch();

    // Story library filters (level + language). Must run AFTER stories are
    // loaded above, otherwise the language list would be empty.
    setupLibraryFilters();


    // STEP 7: Set up event listeners
    console.log('Step 6: Setting up event listeners...');
    setupEventListeners();


    // STEP 9: Verify everything is set up correctly
    console.log('Step 8: Final verification...');
    setTimeout(() => {
        verifyColorSetup();
    }, 200);

    console.log('App initialization complete!');
}

// Add this verification function
function verifyColorSetup() {
    const root = document.documentElement;
    const currentPrimary = getComputedStyle(root).getPropertyValue('--primary').trim();
    const currentPrimaryDark = getComputedStyle(root).getPropertyValue('--primary-dark').trim();

    console.log('=== COLOR VERIFICATION ===');
    console.log('Selected color in localStorage:', localStorage.getItem('selectedColor'));
    console.log('Selected color variable:', selectedColor);
    console.log('CSS --primary:', currentPrimary);
    console.log('CSS --primary-dark:', currentPrimaryDark);
    console.log('Theme:', localStorage.getItem('theme'));

    // Check if colors match
    if (selectedColor && selectedColor.toLowerCase() === currentPrimary.toLowerCase()) {
        console.log('✅ Colors match correctly!');
    } else {
        console.log('⚠️ Colors might not match:', { selectedColor, currentPrimary });
    }

    // Add visual indicator for debugging (remove in production)
    const debugIndicator = document.createElement('div');
    debugIndicator.id = 'color-debug-indicator';
    debugIndicator.style.cssText = `
        position: fixed;
        top: 10px;
        left: 10px;
        background: var(--primary);
        color: white;
        padding: 5px 10px;
        border-radius: 5px;
        font-size: 12px;
        z-index: 9999;
        opacity: 0.8;
        display: none; /* Change to 'block' to see it */
    `;
    debugIndicator.innerHTML = `Primary: ${currentPrimary}`;
    document.body.appendChild(debugIndicator);
}

// Also update your initColorSelector function to prevent multiple calls:
let colorSelectorInitialized = false;


    levelBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            levelBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderStories(btn.dataset.level, currentLang);
        });
    });

    // Level <select> / language <select> wiring lives in setupLibraryFilters()
    // (called from init() once stories are loaded).

    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }

    document.getElementById("randomStory").addEventListener('click', () => {
        if (stories.length > 0) {
            // Generate a random index from 0 to stories.length - 1
            var randomIndex = Math.floor(Math.random() * stories.length);

            // Get the random story using the random index
            var randomStory = stories[randomIndex];

            // Open the random story
            openStoryInNewPage(randomStory.id);
        }
    });


// Touch handling for mobile
let touchTimer;
let touchTarget;

function handleTouchStart(e) {
    if (e.target.classList.contains('word')) {
        touchTarget = e.target;
        touchTimer = setTimeout(() => {
            showSentenceTranslation(e.target);
        }, 500);
    }
}

function handleTouchEnd() {
    clearTimeout(touchTimer);
}


function Refresh() {
    window.location.reload()
}
// Open story in a new page WITH story title
function openStoryInNewPage(storyId) {
    // Find the story in all available sources
    let story = stories.find(s => s.id == storyId);

    // If not found in main stories, check user stories
    if (!story) {
        const userStories = JSON.parse(localStorage.getItem('userStories')) || [];
        story = userStories.find(s => s.id == storyId);

        if (story && !stories.some(s => s.id == storyId)) {
            stories.push(story); // Add to stories array for this session
        }
    }

    if (story) {
        // Add to reading history
        if (typeof addToReadingHistory === 'function') {
            addToReadingHistory(story);
        }

        // Prepare story data for reader page
        const storyData = {
            id: story.id,
            title: story.title,
            lang: story.lang || 'en',
            level: story.level,
            levelcefr: story.levelcefr || '',
            author: story.author || '',
            content: story.content,
            isUserStory: story.isUserStory || false,
            cover: story.cover,
            coverType: story.coverType,
            sound: story.sound || null,
            dictionaries: story.dictionaries || [],
            translations: story.isUserStory ? (story.translations || {}) : null
        };

        // Store in localStorage for reader page
        localStorage.setItem('currentReadingStory', JSON.stringify(storyData));

        // Redirect to reader page
        const storyPage = 'reader/index.html?id=' + storyId +
            (story.isUserStory ? '&userStory=true' : '');
        window.location.href = storyPage;
    } else {
        showNotification('Story not found!');
    }
}
// Function to render cover images with fallback to book icon
function renderStoryCover(story) {
    if (!story.cover) {
        // Default book icon if no cover specified
        return '<i class="fas fa-book"></i>';
    }

    if (story.coverType === 'emoji') {
        return `<div class="story-emoji">${story.cover}</div>`;
    } else if (story.coverType === 'image') {
        // Create image with error handling
        return `
                <img 
                    src="${story.cover}" 
                    alt="${story.title}" 
                    class="story-image"
                    loading="lazy"
                    onerror="this.onerror=null; this.style.display='none'; this.parentElement.querySelector('.fallback-icon').style.display='block';"
                >
                <div class="fallback-icon" style="display: none;">
                    <i class="fas fa-book"></i>
                </div>
        `;
    } else if (story.coverType === 'icon') {
        return `<i class="${story.cover}"></i>`;
    } else {
        // Default to emoji if type not specified
        return `<div class="story-emoji">${story.cover}</div>`;
    }
}


// Wire the story-library toolbar: level <select> + language <select>.
// Called from init() after `stories` has been loaded.
let libraryFiltersBound = false;
function setupLibraryFilters() {
    populateLanguageFilter();

    if (libraryFiltersBound) return;
    libraryFiltersBound = true;

    const levelFilter = document.getElementById('levelFilter');
    if (levelFilter) {
        levelFilter.addEventListener('change', () => {
            renderStories(levelFilter.value, currentLang);
        });
    }

    const langFilter = document.getElementById('langFilter');
    if (langFilter) {
        langFilter.addEventListener('change', () => {
            renderStories(currentLevel, langFilter.value);
        });
    }
}

// Build the language <select> options from the languages actually present in
// the library (plus any language already selected), so the list never shows an
// empty category.
function populateLanguageFilter() {
    const select = document.getElementById('langFilter');
    if (!select) return;

    const present = new Set();
    const collect = (list) => (list || []).forEach(s => {
        if (s && s.lang) present.add(String(s.lang).toLowerCase().split('-')[0]);
    });
    collect(stories);
    if (showUserStories) {
        try { collect(JSON.parse(localStorage.getItem('userStories')) || []); } catch (e) { /* ignore */ }
    }
    if (currentLang && currentLang !== 'all') present.add(String(currentLang).toLowerCase());

    const codes = IST_LANGUAGE_ORDER.filter(c => present.has(c));
    // Keep any language we don't know about yet (e.g. uploaded stories).
    present.forEach(c => { if (codes.indexOf(c) === -1) codes.push(c); });

    const previous = select.value || currentLang || 'all';
    select.innerHTML = '<option value="all">🌍 All languages</option>' + codes.map(code =>
        `<option value="${code}">${langFlag(code) ? langFlag(code) + ' ' : ''}${langDisplayName(code)}</option>`
    ).join('');
    select.value = (previous && (previous === 'all' || codes.indexOf(previous) !== -1)) ? previous : 'all';
}

// Render stories grid with clickable cards
function renderStories(level = currentLevel, lang = currentLang) {
    if (!storiesGrid) return;

    currentLevel = level || 'all';
    currentLang = lang || 'all';

    storiesGrid.innerHTML = '';

    let filteredStories;

    if (level === 'all') {
        // Start with regular stories (non-user stories)
        filteredStories = [...stories.filter(story => !story.isUserStory)];

        // Add user stories only if setting is enabled
        if (showUserStories) {
            const userStories = JSON.parse(localStorage.getItem('userStories')) || [];
            userStories.forEach(userStory => {
                const exists = filteredStories.some(s => s.id === userStory.id);
                if (!exists) {
                    filteredStories.push({
                        ...userStory,
                        isUserStory: true
                    });
                }
            });
        }
    } else if (level === 'user') {
        // Show only user stories (if enabled)
        if (showUserStories) {
            const userStories = JSON.parse(localStorage.getItem('userStories')) || [];
            filteredStories = userStories.map(story => ({
                ...story,
                isUserStory: true
            }));
        } else {
            filteredStories = [];
        }
    } else {
        // Filter by level (beginner, intermediate, advanced)
        // Start with regular stories (non-user stories) of this level
        filteredStories = stories.filter(story =>
            story.level === level && !story.isUserStory
        );

        // Add user stories of the same level if setting is enabled
        if (showUserStories) {
            const userStories = JSON.parse(localStorage.getItem('userStories')) || [];
            userStories.forEach(userStory => {
                if (userStory.level === level) {
                    const exists = filteredStories.some(s => s.id === userStory.id);
                    if (!exists) {
                        filteredStories.push({
                            ...userStory,
                            isUserStory: true
                        });
                    }
                }
            });
        }
    }

    // Apply the language filter on top of the level filter.
    if (currentLang && currentLang !== 'all') {
        const want = String(currentLang).toLowerCase();
        filteredStories = filteredStories.filter(story => {
            const code = String(story.lang || 'en').toLowerCase().split('-')[0];
            return code === want;
        });
    }

    if (filteredStories.length === 0) {
        storiesGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 40px;">
                <p>No stories found for this ${level === 'user' ? 'category' : 'level'}${currentLang !== 'all' ? ' in ' + langDisplayName(currentLang) : ''}</p>
                ${level === 'user' && !showUserStories ?
                '<p><em>User stories are currently disabled in settings</em></p>' :
                level === 'user' ?
                    '<p>Go to Add stories page to create your first story!</p>' :
                    currentLang !== 'all' ?
                        '<p>Try another language or level.</p>' :
                        'Try a different level!'
            }
            </div>
        `;
        return;
    }

    filteredStories.forEach(story => {
        const storyCard = document.createElement('div');
        storyCard.className = 'story-card';
        storyCard.dataset.storyId = story.id;

        // Add user story indicator (only show if user stories are enabled)
        const userStoryBadge = (story.isUserStory && showUserStories)
            ? '<span class="user-story-badge" title="User-added story"><i class="fas fa-user-plus"></i></span>'
            : '';

        // Create author HTML conditionally
        const authorHTML = story.author && story.author.trim() !== ""
            ? `<div class="author"><i class="fas fa-user"></i> ${story.author}</div>`
            : '';

        // Get CEFR level with fallback
        const cefrLevel = story.levelcefr || '';

        // Language badge (depends on the story lang)
        const langBadge = story.lang
            ? `<span class="story-lang-badge" title="Story language"><i class="fas fa-globe"></i> ${langDisplayName(story.lang)}</span>`
            : '';

        storyCard.innerHTML = `
            <div class="story-image">
                ${authorHTML}
                ${renderStoryCover(story)}
            </div>
            <div class="story-content">
                <div class="story-header">
                    <div>
                        <span class="story-level ${story.level}">${story.level.charAt(0).toUpperCase() + story.level.slice(1)}</span>
                        <span class="story-level ${cefrLevel.toUpperCase()}">${cefrLevel.toUpperCase()}</span>
                        ${langBadge}
                    </div>
                    ${userStoryBadge}
                </div>
                <h3 class="story-title">${story.title}</h3>
                <p>${story.content[0].substring(0, 100)}...</p>
                <div class="story-meta">
                    <span><i class="fas fa-font"></i> ${story.wordCount || 'N/A'} words</span>
                    <span><i class="fas fa-clock"></i> ${Math.ceil((story.wordCount || 100) / 200)} min read</span>
                </div>
            </div>
        `;

        storyCard.addEventListener('click', () => {
            openStoryInNewPage(story.id);
        });

        storiesGrid.appendChild(storyCard);
    });
}
// settings
// The in-page settings drawer was removed: settings now live on the central
// Settings page and the header gear (#settings-button) links there. Only wire
// the drawer controls when the drawer markup is actually present.
const settingsButton = document.getElementById("settings-button");
const settingsPage = document.getElementById("settings-page");
const closeSettings = document.getElementById("close-settings");
const settingsOverlay = document.getElementById("settings-overlay");

if (settingsButton && settingsPage && closeSettings && settingsOverlay) {
    settingsButton.addEventListener("click", function () {
        settingsPage.classList.toggle("open");
        settingsOverlay.classList.add("active");
    });

    closeSettings.addEventListener("click", function () {
        settingsPage.classList.remove("open");
        settingsOverlay.classList.remove("active");
    });
    // Close settings on Escape key
    document.addEventListener("keydown", function (e) {
        if (e.key === 'Escape' && settingsPage.classList.contains("open")) {
            settingsPage.classList.remove("open");
            settingsOverlay.classList.remove("active");
        }
    });
    settingsOverlay.addEventListener("click", function () {
        settingsPage.classList.remove("open");
        settingsOverlay.classList.remove("active");
    });
}
// This function is for backward compatibility (not used with new page approach)
function openStory(story) {
    currentStory = story;
    document.getElementById('storyTitle').textContent = story.title;

    // Render story content with interactive words
    storyText.innerHTML = '';
    story.content.forEach(paragraph => {
        const p = document.createElement('div');
        p.className = 'paragraph';

        // Process text to make ALL words clickable
        const words = paragraph.split(' ');
        const processedWords = words.map(word => {
            const cleanWord = word.replace(/[.,!?;:"]/g, '').toLowerCase();
            const isSaved = savedWords.some(w => w.word === cleanWord);

            let className = 'word';
            if (isSaved) className += ' saved';
            if (!dictionary[cleanWord]) className += ' no-translation';

            return `<span class="${className}" data-word="${cleanWord}">${word}</span>`;
        });

        p.innerHTML += processedWords.join(' ');
        storyText.appendChild(p);
    });

    // Add word click listeners
    setupWordInteractions();

    switchPage('stories');

    // Scroll to top after page transition
    setTimeout(() => {
        scrollToTop();
    }, 100);
}
// Function to initialize user stories setting toggle
function initUserStoriesSetting() {
    const toggleSwitch = document.getElementById('showUserStoriesToggle');

    if (!toggleSwitch) {
        console.log('User stories toggle switch not found');
        return;
    }

    // Set initial state
    toggleSwitch.checked = showUserStories;

    // Add event listener
    toggleSwitch.addEventListener('change', function () {
        saveShowUserStoriesSetting(this.checked);
    });
}
// Function to save showUserStories setting
function saveShowUserStoriesSetting(value) {
    showUserStories = value;
    localStorage.setItem('showUserStories', value);

    // Refresh the current view
    refreshCurrentView();

    showNotification(`User stories ${value ? 'enabled' : 'disabled'}`, 'success');
}
// Function to refresh the current view based on settings
function refreshCurrentView() {
    const levelSelect = document.getElementById('levelFilter');
    const activeLevelBtn = document.querySelector('.level-btn.active');
    const level = levelSelect ? levelSelect.value
        : (activeLevelBtn ? activeLevelBtn.dataset.level : currentLevel);

    // Get current search query
    const currentSearch = searchInput ? searchInput.value.trim() : '';

    if (currentSearch) {
        // If there's a search query, perform search
        performSearch();
    } else {
        // Otherwise filter by level + language
        renderStories(level, currentLang);
    }

    showNotification(`User stories ${showUserStories ? 'enabled' : 'disabled'}`, 'success');
}

// Switch the active in-page section (kept here now that addstories.js moved
// to its own page). Story library and reader open as separate pages.
function switchPage(page) {
    currentPage = page;

    const target = document.getElementById(page);
    if (target) {
        pages.forEach(p => p.classList.remove('active'));
        target.classList.add('active');
    }

    const links = (typeof navLinks !== 'undefined' && navLinks) ? navLinks : [];
    links.forEach(link => {
        if (link.dataset.page === page) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Add CSS animations
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
`;
document.head.appendChild(style);

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);