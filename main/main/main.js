


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

// Stories are rendered 20 at a time. Search results share the same page size.
const STORIES_PAGE_SIZE = 20;
let libraryRenderState = { items: [], shown: 0, options: {} };
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

    // User-created stories have their own page (My Stories) and are not merged
    // into the library feed.

    // Some story databases (e.g. the American English lessons) do not give
    // their stories an id. Without one, every click would resolve to the first
    // story, so give each story a stable local id.
    stories.forEach(function (story) {
        if (story && (story.id === undefined || story.id === null || story.id === '')) {
            story.id = makeStoryStorageId(story);
        }
    });

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

    // Allow links like main/index.html?search=village to open the library
    // with that search already applied.
    if (typeof getUrlParameter === 'function' &&
        typeof searchInput !== 'undefined' && searchInput) {
        const searchFromUrl = getUrlParameter('search');
        if (searchFromUrl) {
            searchInput.value = searchFromUrl;
            performSearch();
        }
    }

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

function setupEventListeners() {
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

    var randomStoryBtn = document.getElementById("randomStory");
    if (randomStoryBtn) {
        randomStoryBtn.addEventListener('click', () => {
            if (stories.length > 0) {
                // Generate a random index from 0 to stories.length - 1
                var randomIndex = Math.floor(Math.random() * stories.length);

                // Get the random story using the random index
                var randomStory = stories[randomIndex];

                // Open the random story
                openStoryInNewPage(randomStory);
            }
        });
    }
}


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

// Build a stable id for source stories that do not provide one.
function makeStoryStorageId(story) {
    const raw = [
        (story && story.lang) || 'en',
        (story && story.title) || '',
        Array.isArray(story && story.content) ? story.content.join('\n') : ''
    ].join('|');

    let hash = 5381;
    for (let index = 0; index < raw.length; index++) {
        hash = ((hash << 5) + hash) ^ raw.charCodeAt(index);
    }
    return 'local_' + (hash >>> 0).toString(36);
}

// Open story in a new page WITH story title. Accepts the story object (preferred,
// so stories without an id still open correctly) or an id for older callers.
function openStoryInNewPage(storyOrId) {
    const isStoryObject = storyOrId && typeof storyOrId === 'object';
    let story = isStoryObject ? storyOrId : stories.find(s => s.id == storyOrId);

    // If not found in the library, check the user's own stories. This keeps
    // Recent Stories working for user stories without adding them to the
    // library feed.
    if (!story && !isStoryObject) {
        const userStories = JSON.parse(localStorage.getItem('userStories')) || [];
        const userStory = userStories.find(s => s.id == storyOrId);
        if (userStory) {
            story = Object.assign({}, userStory, { isUserStory: true });
        }
    }

    if (story) {
        if (story.id === undefined || story.id === null || story.id === '') {
            story.id = makeStoryStorageId(story);
        }

        // Add to reading history
        if (typeof addToReadingHistory === 'function') {
            addToReadingHistory(story);
        }

        // Keep the complete story — including inline dictionaries,
        // translations and source metadata — so the reader can open it from
        // storage alone. Every new click replaces the previous payload.
        const storyData = Object.assign({}, story, {
            id: story.id,
            lang: story.lang || 'en',
            isUserStory: story.isUserStory || false
        });

        if (storyData.translations == null) {
            if (story.isUserStory) {
                try {
                    const userDictionaries = JSON.parse(localStorage.getItem('userDictionaries')) || {};
                    storyData.translations = userDictionaries[story.id] || {};
                } catch (error) {
                    storyData.translations = {};
                }
            } else {
                storyData.translations = null;
            }
        }

        // Store in localStorage for reader page
        localStorage.setItem('currentReadingStory', JSON.stringify(storyData));

        // The reader loads this payload; no story id is needed in the URL.
        // Wait for the write-through storage queue before navigating so the
        // saved story is committed before the reader page reads it.
        const openReader = function () {
            window.location.href = 'reader/index.html';
        };
        if (window.IStoriesStorage && typeof window.IStoriesStorage.flush === 'function') {
            window.IStoriesStorage.flush().then(openReader, openReader);
        } else {
            openReader();
        }
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

// Translate a UI string, falling back to English when i18n is unavailable.
function istText(key, vars, fallback) {
    if (window.IStoriesI18n && typeof window.IStoriesI18n.t === 'function') {
        const value = window.IStoriesI18n.t(key, vars);
        if (value && value !== key) return value;
    }
    return fallback;
}

// Build one story card. `options.query` highlights search matches.
function createStoryCard(story, options = {}) {
    const storyCard = document.createElement('div');
    storyCard.className = 'story-card';
    storyCard.dataset.storyId = story.id;

    // Create author HTML conditionally
    const authorHTML = story.author && story.author.trim() !== ""
        ? `<div class="author"><i class="fas fa-user"></i> ${story.author}</div>`
        : '';

    // Get CEFR level with fallback
    const cefrLevel = story.levelcefr || '';
    const levelValue = String(story.level || 'beginner').toLowerCase();

    // Language badge (depends on the story lang)
    const langBadge = story.lang
        ? `<span class="story-lang-badge" title="` + istText('library.storyLanguage', null, 'Story language') +
          `"><i class="fas fa-globe"></i> ${langDisplayName(story.lang)}</span>`
        : '';

    const titleHtml = options.query && typeof highlightSearchMatch === 'function'
        ? highlightSearchMatch(story.title, options.query)
        : story.title;

    const firstParagraph = (story.content && story.content[0]) ? story.content[0] : '';
    const wordsText = story.wordCount
        ? istText('library.wordsCount', { count: story.wordCount }, `${story.wordCount} words`)
        : 'N/A words';
    const minutesText = istText('library.minRead', { count: Math.ceil((story.wordCount || 100) / 200) },
        `${Math.ceil((story.wordCount || 100) / 200)} min read`);
    const levelText = istText('library.' + levelValue, null,
        levelValue.charAt(0).toUpperCase() + levelValue.slice(1));

    storyCard.innerHTML = `
        <div class="story-image">
            ${authorHTML}
            ${renderStoryCover(story)}
        </div>
        <div class="story-content">
            <div class="story-header">
                <div>
                    <span class="story-level ${levelValue}">${levelText}</span>
                    <span class="story-level ${cefrLevel.toUpperCase()}">${cefrLevel.toUpperCase()}</span>
                    ${langBadge}
                </div>
            </div>
            <h3 class="story-title">${titleHtml}</h3>
            <p>${firstParagraph.substring(0, 100)}...</p>
            <div class="story-meta">
                <span><i class="fas fa-font"></i> ${wordsText}</span>
                <span><i class="fas fa-clock"></i> ${minutesText}</span>
            </div>
        </div>
    `;

    // Titles, excerpts and author names keep the direction of the story's
    // own language, even when the interface is in another language.
    if (typeof applyTextDirection === 'function') {
        applyTextDirection(storyCard.querySelector('.story-title'), story.title, story.lang);
        applyTextDirection(storyCard.querySelector('.story-content > p'), firstParagraph, story.lang);
        const authorEl = storyCard.querySelector('.author');
        if (authorEl) applyTextDirection(authorEl, story.author, story.lang);
    }

    storyCard.addEventListener('click', () => {
        // Pass the story itself: databases without ids must still open the
        // exact card the user clicked.
        openStoryInNewPage(story);
    });

    return storyCard;
}

// Append a slice of stories without re-rendering the whole grid.
function appendStoryBatch(container, items, start, end, options = {}) {
    for (let index = start; index < end; index++) {
        container.appendChild(createStoryCard(items[index], options));
    }
}

// "Load 20 more stories" control shared by the library and search results.
function createLoadMoreControl(total, shown, onMore) {
    const wrap = document.createElement('div');
    wrap.className = 'ist-load-more-wrap';

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'ist-load-more';
    button.innerHTML = '<i class="fas fa-plus" aria-hidden="true"></i><span>' +
        istText('action.loadMore', null, 'Load 20 more stories') + '</span>';
    button.addEventListener('click', onMore);

    const hint = document.createElement('span');
    hint.className = 'ist-load-more__hint';
    hint.textContent = istText('library.showing', { shown: shown, total: total },
        `Showing ${shown} of ${total} stories`);

    wrap.appendChild(button);
    wrap.appendChild(hint);
    return wrap;
}

// Render the next page of a filtered list (20 by default).
function renderStoryBatch(state, container) {
    if (!state || !container) return;

    const start = state.shown || 0;
    const end = Math.min(start + STORIES_PAGE_SIZE, state.items.length);
    appendStoryBatch(container, state.items, start, end, state.options || {});
    state.shown = end;

    const oldControl = container.querySelector('.ist-load-more-wrap');
    if (oldControl) oldControl.remove();

    if (state.shown < state.items.length) {
        container.appendChild(createLoadMoreControl(state.items.length, state.shown, function () {
            renderStoryBatch(state, container);
        }));
    }

    if (window.IStoriesI18n && typeof window.IStoriesI18n.refresh === 'function') {
        window.IStoriesI18n.refresh();
    }
}

// Render stories grid with clickable cards (20 at a time).
function renderStories(level = currentLevel, lang = currentLang) {
    if (!storiesGrid) return;

    currentLevel = level || 'all';
    currentLang = lang || 'all';

    storiesGrid.innerHTML = '';

    // The library only shows database stories. User-created stories live on
    // the separate My Stories page and are never merged into this feed.
    const libraryStories = stories.filter(story => !story.isUserStory);
    let filteredStories = level === 'all'
        ? [...libraryStories]
        : libraryStories.filter(story => story.level === level);

    // Apply the language filter on top of the level filter.
    if (currentLang && currentLang !== 'all') {
        const want = String(currentLang).toLowerCase();
        filteredStories = filteredStories.filter(story => {
            const code = String(story.lang || 'en').toLowerCase().split('-')[0];
            return code === want;
        });
    }

    if (filteredStories.length === 0) {
        let message;
        if (currentLang !== 'all') {
            message = istText('library.noStoriesLevelLang', { language: langDisplayName(currentLang) },
                `No stories found for this level in ${langDisplayName(currentLang)}`);
        } else {
            message = istText('library.noStoriesLevel', null, 'No stories found for this level');
        }

        let detail = '';
        if (currentLang !== 'all') {
            detail = '<p>' + istText('library.tryLanguage', null, 'Try another language or level.') + '</p>';
        } else {
            detail = '<p>' + istText('library.tryLevel', null, 'Try a different level!') + '</p>';
        }

        storiesGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 40px;">
                <p>${message}</p>
                ${detail}
            </div>
        `;
        return;
    }

    libraryRenderState = {
        items: filteredStories,
        shown: 0,
        options: {}
    };
    renderStoryBatch(libraryRenderState, storiesGrid);
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

// Card metadata (level, word count, language, read time) is generated in JS,
// so rebuild the visible cards when the interface language changes. The
// number of already-loaded stories is preserved.
document.addEventListener('ist-language-change', function () {
    if (!storiesGrid) return;

    var query = (typeof searchInput !== 'undefined' && searchInput)
        ? searchInput.value.trim()
        : '';

    if (query && typeof filterStoriesBySearch === 'function' && typeof displayFilteredStories === 'function') {
        var shownSearch = (typeof searchRenderState !== 'undefined' && searchRenderState.shown) || 0;
        displayFilteredStories(filterStoriesBySearch(query), query);
        while (typeof searchRenderState !== 'undefined' &&
            searchRenderState.shown < shownSearch &&
            searchRenderState.shown < searchRenderState.items.length) {
            renderStoryBatch(searchRenderState, storiesGrid);
        }
        return;
    }

    if (!libraryRenderState.items.length) return;
    var shownLibrary = libraryRenderState.shown || 0;
    renderStories(currentLevel, currentLang);
    while (libraryRenderState.shown < shownLibrary &&
        libraryRenderState.shown < libraryRenderState.items.length) {
        renderStoryBatch(libraryRenderState, storiesGrid);
    }
});

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);