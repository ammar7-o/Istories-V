// ========= App State Variables ==========
let currentPage = 'home';
let currentStory = null;
let savedWords = JSON.parse(localStorage.getItem('savedWords')) || [];
let stories = []; // Will be loaded from external file
let selectedColor = localStorage.getItem('selectedColor') || '#4f46e5';

// Store current word for saving
let currentWordData = null;

// Dictionary fallback
let dictionary = window.dictionary || {};

// ========= DOM Elements ==========
const pages = document.querySelectorAll('.page');
const navLinks = document.querySelectorAll('.nav-link');
const levelBtns = document.querySelectorAll('.level-btn');
const storiesGrid = document.getElementById('storiesGrid');
const storyText = document.getElementById('storyText');
const dictionaryPopup = document.getElementById('dictionaryPopup');
const vocabularyList = document.getElementById('vocabularyList');
const backToStories = document.getElementById('backToStories');
const fontSmaller = document.getElementById('fontSmaller');
const fontNormal = document.getElementById('fontNormal');
const fontLarger = document.getElementById('fontLarger');
const lineSpacingBtn = document.getElementById('lineSpacing');
const listenBtn = document.getElementById('listenBtn');
const saveWordBtn = document.getElementById('saveWordBtn');
const closePopup = document.getElementById('closePopup');
const searchForm = document.getElementById('search-form');
const searchInput = searchForm ? searchForm.querySelector('.search-input') : null;
const searchBtn = document.getElementById('search-btn');
const toggleNav = document.getElementById("toggle-nav");
const more = document.getElementById("more");
let isMenuOpen = false;
const themeToggle = document.getElementById('themeToggle');
const settingsButton = document.getElementById("settings-button");
const settingsPage = document.getElementById("settings-page");
const closeSettings = document.getElementById("close-settings");
const settingsOverlay = document.getElementById("settings-overlay");

// Color variables
const defaultColors = [
    { name: 'indigo', value: '#4f46e5' },
    { name: 'blue', value: '#4a6cf7' },
    { name: 'purple', value: '#7c4dff' },
    { name: 'green', value: '#008638' },
    { name: 'orange', value: '#ff5722' },
    { name: 'pink', value: '#e91e63' },
    { name: 'teal', value: '#009688' }
];

// ========= Core Functions ==========

// Function to scroll to top of page
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Initialize the app
function init() {
    console.log('App initialization started...');

    // Load stories from external file
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


    // STEP 1: Apply saved theme FIRST
    console.log('Step 1: Applying theme...');
    applyTheme();

    // STEP 2: Apply saved primary color immediately
    console.log('Step 2: Applying saved color:', selectedColor);
    if (selectedColor) {
        applyPrimaryColor(selectedColor);
    }

    // STEP 3: Initialize color selector
    console.log('Step 3: Initializing color selector...');
    setTimeout(() => {
        initColorSelector();
    }, 50);

    // STEP 4: Render stories and other UI elements
    console.log('Step 4: Rendering UI...');
    renderStories();
    setupSearch();
    
    if (typeof renderVocabulary === 'function') {
        renderVocabulary();
    }
    
    if (typeof updateStats === 'function') {
        updateStats();
    }

    // STEP 5: Initialize flashcards
    console.log('Step 5: Initializing flashcards...');
    if (typeof initFlashcards === 'function') {
        initFlashcards();
    }

    // STEP 6: Set up event listeners
    console.log('Step 6: Setting up event listeners...');
    setupEventListeners();
    setupNavToggle();
    setupSettings();

    // STEP 7: Verify everything is set up correctly
    console.log('Step 8: Final verification...');
    setTimeout(() => {
        verifyColorSetup();
    }, 200);

    console.log('App initialization complete!');
}

// ========= Color Selector Functions ==========
function initColorSelector() {
    const colorOptions = document.querySelectorAll('.color-option:not(.custom-color)');
    const customColorPicker = document.getElementById('customColorPicker');

    // Remove active class from all options first
    colorOptions.forEach(opt => opt.classList.remove('active'));

    // Set active color based on saved preference
    if (colorOptions.length > 0) {
        colorOptions.forEach(option => {
            if (option.dataset.color === selectedColor) {
                option.classList.add('active');
            }

            option.addEventListener('click', () => {
                // Remove active class from all options
                colorOptions.forEach(opt => opt.classList.remove('active'));

                // Add active class to clicked option
                option.classList.add('active');

                // Get selected color
                const color = option.dataset.color;

                // Apply ONLY the primary color
                applyPrimaryColor(color);

                // Save to localStorage
                localStorage.setItem('selectedColor', color);
                selectedColor = color;

                // Update custom color picker
                if (customColorPicker) {
                    customColorPicker.value = color;
                }
            });
        });
    }

    // Custom color picker
    if (customColorPicker) {
        // Set initial value from saved color
        customColorPicker.value = selectedColor;

        customColorPicker.addEventListener('input', (e) => {
            const color = e.target.value;

            // Remove active class from preset colors
            colorOptions.forEach(opt => opt.classList.remove('active'));

            // Apply ONLY the primary color
            applyPrimaryColor(color);

            // Save to localStorage
            localStorage.setItem('selectedColor', color);
            selectedColor = color;

            showNotification('Custom primary color applied', 'success');
        });

        customColorPicker.addEventListener('change', (e) => {
            const color = e.target.value;

            // Remove active class from preset colors
            colorOptions.forEach(opt => opt.classList.remove('active'));

            // Apply ONLY the primary color
            applyPrimaryColor(color);

            // Save to localStorage
            localStorage.setItem('selectedColor', color);
            selectedColor = color;

            showNotification('Custom primary color saved', 'success');
        });

        // Also trigger change on custom color picker click
        customColorPicker.parentElement.addEventListener('click', (e) => {
            if (e.target !== customColorPicker) {
                customColorPicker.click();
            }
        });
    }

    // Force apply the color one more time to ensure it's set
    setTimeout(() => {
        applyPrimaryColor(selectedColor);
    }, 100);
}

function applyPrimaryColor(color) {
    // Calculate darker shade for --primary-dark
    const darkerColor = adjustColor(color, -20);

    // Update ONLY the primary color variables in CSS
    const root = document.documentElement;
    root.style.setProperty('--primary', color);
    root.style.setProperty('--primary-dark', darkerColor);
}

function adjustColor(color, percent) {
    const num = parseInt(color.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;

    return '#' + (
        0x1000000 +
        (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
        (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
        (B < 255 ? B < 1 ? 0 : B : 255)
    ).toString(16).slice(1);
}

function verifyColorSetup() {
    const root = document.documentElement;
    const currentPrimary = getComputedStyle(root).getPropertyValue('--primary').trim();
    const currentPrimaryDark = getComputedStyle(root).getPropertyValue('--primary-dark').trim();

    // Check if colors match
    if (selectedColor && selectedColor.toLowerCase() === currentPrimary.toLowerCase()) {
        console.log('✅ Colors match correctly!');
    } else {
        console.log('⚠️ Colors might not match:', { selectedColor, currentPrimary });
    }
}

// ========= Theme Functions ==========
function toggleTheme() {
    const currentTheme = localStorage.getItem('theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';

    // Save new theme
    localStorage.setItem('theme', newTheme);

    // Apply the new theme
    applyTheme();
}

function applyTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';

    // Apply theme to body class
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }

    // Update theme toggle icon
    if (themeToggle) {
        const themeIcon = themeToggle.querySelector('i');
        if (themeIcon) {
            themeIcon.className = savedTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
    }

    // Re-apply primary color to ensure it works with new theme
    if (selectedColor) {
        applyPrimaryColor(selectedColor);
    }
}

// ========= Story Display Functions ==========
function renderStories(level = 'all') {
    storiesGrid.innerHTML = '';

    let filteredStories;

    if (level === 'all') {
        filteredStories = stories;
    } else {
        // Filter by level (beginner, intermediate, advanced)
        filteredStories = stories.filter(story => story.level === level);
    }

    if (filteredStories.length === 0) {
        storiesGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 40px;">
                <p>No stories found for this ${level === 'user' ? 'category' : 'level'}.</p>
                ${level === 'user' ? '<p><a href="add-stories.html" style="color: var(--primary); text-decoration: underline;">Add your first story</a></p>' : ''}
            </div>
        `;
        return;
    }

    filteredStories.forEach(story => {
        const storyCard = document.createElement('div');
        storyCard.className = 'story-card';
        storyCard.dataset.storyId = story.id;

       

        // Create author HTML conditionally
        const authorHTML = story.author && story.author.trim() !== ""
            ? `<div class="author"><i class="fas fa-user"></i> ${story.author}</div>`
            : '';

        storyCard.innerHTML = `
            <div class="story-image">
                ${authorHTML}
                ${renderStoryCover(story)}
            </div>
            <div class="story-content">
                <div class="story-header">
                    <span class="story-level ${story.level}">${story.level.charAt(0).toUpperCase() + story.level.slice(1)}</span>
                    
                </div>
                <h3 class="story-title">${story.title}</h3>
                <div class="story-meta">
                    <span><i class="fas fa-font"></i> ${story.wordCount || 'N/A'} words</span>
                    <span><i class="fas fa-clock"></i> ${Math.ceil((story.wordCount || 100) / 200)} min read</span>
                </div>
                
                <!-- Action Buttons -->
                <div class="story-actions">
                    <button class="story-action-btn open-btn" data-story-id="${story.id}">
                        <i class="fas fa-book-open"></i> Open
                    </button>
                    <button class="story-action-btn download-btn" data-story-id="${story.id}">
                        <i class="fas fa-download"></i> Download
                    </button>
                </div>
            </div>
        `;

        // Add event listeners for buttons
        const openBtn = storyCard.querySelector('.open-btn');
        const downloadBtn = storyCard.querySelector('.download-btn');

        if (openBtn) {
            openBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                openStoryInNewPage(story.id);
            });
        }

        if (downloadBtn) {
            downloadBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                downloadStory(story.id);
            });
        }

        // Keep card clickable for opening story
        storyCard.addEventListener('click', () => {
            openStoryInNewPage(story.id);
        });

        storiesGrid.appendChild(storyCard);
    });
}

function getStoryExcerpt(story) {
    if (Array.isArray(story.content) && story.content.length > 0) {
        const firstPara = story.content[0];
        // Remove HTML tags if any
        const cleanText = firstPara.replace(/<[^>]*>/g, '');
        return cleanText.substring(0, 150) + (cleanText.length > 150 ? '...' : '');
    }
    return story.description || 'Read this interesting story...';
}

function renderStoryCover(story) {
    if (!story.cover) {
        // Default book icon if no cover specified
        return '<i class="fas fa-book"></i>';
    }

    if (story.coverType === 'emoji') {
        return `<div class="story-emoji">${story.cover}</div>`;
    } else if (story.coverType === 'image') {
        return `<img src="${story.cover}" alt="${story.title}" class="story-image">`;
    } else if (story.coverType === 'icon') {
        return `<i class="${story.cover}"></i>`;
    } else {
        // Default to emoji if type not specified
        return `<div class="story-emoji">${story.cover}</div>`;
    }
}

// ========= Download Functions ==========
function downloadStory(storyId) {
    // Find the story
    const story = stories.find(s => s.id == storyId);
    
    if (!story) {
        showNotification('Story not found!', 'error');
        return;
    }

    // Find the download button
    const downloadBtn = document.querySelector(`.download-btn[data-story-id="${storyId}"]`);
    const originalText = downloadBtn ? downloadBtn.innerHTML : '';
    
    // Add loading state
    if (downloadBtn) {
        downloadBtn.classList.add('loading');
        downloadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Downloading...';
        downloadBtn.disabled = true;
    }

    try {
        // Prepare the story object for download
        const storyForDownload = {
            id: story.id,
            title: story.title,
            level: story.level,
            cover: story.cover,
            coverType: story.coverType,
            content: story.content,
            author: story.author || '',
            wordCount: story.wordCount || calculateWordCount(story.content),
            // Include dictionaries if available
            ...(story.dictionaries && { dictionaries: story.dictionaries }),
            // Include sound file if available
            ...(story.sound && { sound: story.sound }),
            // Include tags if available
            ...(story.tags && { tags: story.tags }),
            // Metadata
            exportedDate: new Date().toISOString(),
            exportedFrom: "IStories",
            version: "1.0"
        };

        // Convert to JSON string
        const jsonString = JSON.stringify(storyForDownload, null, 2);
        
        // Create a Blob with the JSON data
        const blob = new Blob([jsonString], { type: 'application/json' });
        
        // Create download URL
        const url = URL.createObjectURL(blob);
        
        // Create download link
        const a = document.createElement('a');
        a.href = url;
        
        // Create filename from story title
        const sanitizedTitle = story.title
            .toLowerCase()
            .replace(/[^a-z0-9\s\-_]/g, '')
            .replace(/\s+/g, '-')
            .trim();
        
        const date = new Date().toISOString().split('T')[0];
        a.download = `istories-${sanitizedTitle}-${date}.json`;
        
        // Trigger download
        document.body.appendChild(a);
        a.click();
        
        // Clean up
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 100);
        
        // Show success notification
        showNotification(`"${story.title}" downloaded successfully!`, 'success');
        
        // Track download
        trackDownload(storyId);
        
    } catch (error) {
        console.error('Error downloading story:', error);
        showNotification('Failed to download story. Please try again.', 'error');
    } finally {
        // Reset button state
        if (downloadBtn) {
            setTimeout(() => {
                downloadBtn.classList.remove('loading');
                downloadBtn.innerHTML = originalText;
                downloadBtn.disabled = false;
            }, 500);
        }
    }
}

function calculateWordCount(content) {
    if (!content || !Array.isArray(content)) return 0;
    return content.join(' ').split(/\s+/).length;
}

function trackDownload(storyId) {
    try {
        const downloadStats = JSON.parse(localStorage.getItem('downloadStats')) || {
            totalDownloads: 0,
            downloads: {}
        };
        
        downloadStats.totalDownloads = (downloadStats.totalDownloads || 0) + 1;
        
        // Track per story
        if (!downloadStats.downloads[storyId]) {
            downloadStats.downloads[storyId] = 0;
        }
        downloadStats.downloads[storyId]++;
        
        // Save last download date
        downloadStats.lastDownload = new Date().toISOString();
        
        localStorage.setItem('downloadStats', JSON.stringify(downloadStats));
    } catch (error) {
        console.error('Error tracking download:', error);
    }
}

// ========= Search Functions ==========
function filterStoriesBySearch(query) {
    if (!query || query.trim() === '') {
        return stories;
    }

    query = query.toLowerCase().trim();

    return stories.filter(story => {
        const titleMatch = story.title.toLowerCase().includes(query);
        const contentMatch = story.content.some(paragraph =>
            paragraph.toLowerCase().includes(query)
        );
        const levelMatch = story.level.toLowerCase().includes(query);
        const tagsMatch = story.tags?.some(tag =>
            tag.toLowerCase().includes(query)
        ) || false;

        return titleMatch || contentMatch || levelMatch || tagsMatch;
    });
}

function displayFilteredStories(filteredStories, query) {
    storiesGrid.innerHTML = '';

    if (filteredStories.length === 0) {
        storiesGrid.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search fa-2x"></i>
                <h3>No stories found for "${query}"</h3>
                <p>Try different keywords or browse all stories</p>
            </div>
        `;
        return;
    }

   filteredStories.forEach(story => {
    const storyCard = document.createElement('div');
    storyCard.className = 'story-card';
    storyCard.dataset.storyId = story.id;

    const highlightedTitle = highlightSearchMatch(story.title, query);

    const authorHTML = story.author && story.author.trim() !== "" 
        ? `<div class="author"><i class="fas fa-user"></i> ${story.author}</div>`
        : '';

    storyCard.innerHTML = `
        <div class="story-image">
            ${authorHTML}
            ${renderStoryCover(story)}
        </div>
        <div class="story-content">
            <span class="story-level ${story.level}">${story.level}</span>
            <h3 class="story-title">${highlightedTitle}</h3>
            <p class="story-excerpt">${getStoryExcerpt(story)}</p>
            <div class="story-meta">
                <span><i class="fas fa-font"></i> ${story.wordCount} words</span>
                <span><i class="fas fa-clock"></i> ${Math.ceil(story.wordCount / 200)} min read</span>
            </div>
            
            <!-- Action Buttons for search results -->
            <div class="story-actions">
                <button class="story-action-btn open-btn" data-story-id="${story.id}">
                    <i class="fas fa-book-open"></i> Open
                </button>
                <button class="story-action-btn download-btn" data-story-id="${story.id}">
                    <i class="fas fa-download"></i> Download
                </button>
            </div>
        </div>
    `;

    // Add event listeners for buttons in search results
    const openBtn = storyCard.querySelector('.open-btn');
    const downloadBtn = storyCard.querySelector('.download-btn');

    if (openBtn) {
        openBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            openStoryInNewPage(story.id);
        });
    }

    if (downloadBtn) {
        downloadBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            downloadStory(story.id);
        });
    }

    storyCard.addEventListener('click', () => {
        openStoryInNewPage(story.id);
    });

    storiesGrid.appendChild(storyCard);
});
}

function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function highlightSearchMatch(text, query) {
    if (!query) return text;

    try {
        const escapedQuery = escapeRegExp(query);
        const regex = new RegExp(`(${escapedQuery})`, 'gi');
        return text.replace(regex, '<span class="search-highlight">$1</span>');
    } catch (error) {
        console.error('Error in highlightSearchMatch:', error);
        return text;
    }
}

function setupSearch() {
    if (!searchForm || !searchInput) return;

    // Search when form is submitted
    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        performSearch();
    });

    // Search while typing
    searchInput.addEventListener('input', (e) => {
        performSearch();
    });

    // Clear on Escape
    searchInput.addEventListener('keyup', (e) => {
        if (e.key === 'Escape') {
            searchInput.value = '';
            performSearch();
        }
    });
}

function performSearch() {
    const query = searchInput.value.trim();
    const filteredStories = filterStoriesBySearch(query);
    displayFilteredStories(filteredStories, query);

    if (query) {
        levelBtns.forEach(btn => btn.classList.remove('active'));
        if (levelBtns.length > 0) {
            levelBtns[0].classList.add('active');
        }
    }
}

// ========= Navigation Functions ==========
function switchPage(page) {
    currentPage = page;
    pages.forEach(p => p.classList.remove('active'));
    
    // Show the requested page
    const pageElement = document.getElementById(page);
    if (pageElement) {
        pageElement.classList.add('active');
    }

    navLinks.forEach(link => {
        if (link.dataset.page === page) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // Refresh flashcards when switching to flashcards page
    if (page === 'flashcards') {
        if (typeof loadFlashcards === 'function') {
            loadFlashcards();
        }
    }
}

function openStoryInNewPage(storyId) {
    const story = stories.find(s => s.id == storyId);

    if (story) {
        // Store the story data in localStorage before redirecting
        localStorage.setItem('currentReadingStory', JSON.stringify({
            id: story.id,
            title: story.title,
            level: story.level,
            content: story.content,
            isUserStory: story.isUserStory || false,
            cover: story.cover,
            coverType: story.coverType,
            translations: story.isUserStory ? (userDictionaries[story.id] || {}) : null
        }));

        // Create a new page URL with the story ID
        const storyPage = '../English/reader/index.html?id=' + storyId + (story.isUserStory ? '&userStory=true' : '');
        window.location.href = storyPage;
    }
}

// ========= Navigation Toggle ==========
function setupNavToggle() {
    if (!toggleNav || !more) return;

    // Toggle menu
    toggleNav.addEventListener("click", function (e) {
        e.stopPropagation();
        isMenuOpen = !isMenuOpen;
        more.classList.toggle("open");
    });

    // Close menu when clicking anywhere
    document.addEventListener("click", function () {
        if (isMenuOpen) {
            more.classList.remove("open");
            isMenuOpen = false;
        }
    });

    // Prevent closing when clicking inside the menu
    more.addEventListener("click", function (e) {
        e.stopPropagation();
    });

    // Close menu on Escape key
    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && isMenuOpen) {
            more.classList.remove("open");
            isMenuOpen = false;
        }
    });

    // Close menu when clicking on any <a> inside the menu
    const links = more.querySelectorAll("a");
    links.forEach(link => {
        link.addEventListener("click", function () {
            more.classList.remove("open");
            isMenuOpen = false;
        });
    });
}

// ========= Settings Functions ==========
function setupSettings() {
    if (!settingsButton || !settingsPage || !closeSettings || !settingsOverlay) return;

    settingsButton.addEventListener("click", function () {
        settingsPage.classList.toggle("open");
        settingsOverlay.classList.add("active");
    });

    closeSettings.addEventListener("click", function () {
        settingsPage.classList.remove("open");
        settingsOverlay.classList.remove("active");
    });
}

// ========= Notification Function ==========
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;

    // Set background color based on notification type
    let bgColor = '';

    if (type === 'success') {
        bgColor = 'var(--primary)';
    } else if (type === 'error') {
        bgColor = '#ff4444';
    } else if (type === 'warning') {
        bgColor = '#ff9900';
    } else if (type === 'info') {
        bgColor = '#2196F3';
    }

    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${bgColor};
        color: white;
        padding: 12px 20px;
        border-radius: var(--radius);
        box-shadow: var(--shadow);
        z-index: 1000;
        font-weight: 500;
        animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// ========= Event Listeners Setup ==========
function setupEventListeners() {
    // Navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            switchPage(link.dataset.page);
            scrollToTop();
        });
    });

    // Level filter buttons
    levelBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            levelBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderStories(btn.dataset.level);
        });
    });

    // Theme toggle
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }

    // Touch handling for mobile
    let touchTimer;
    let touchTarget;

    document.addEventListener('touchstart', function(e) {
        if (e.target.classList.contains('word')) {
            touchTarget = e.target;
            touchTimer = setTimeout(() => {
                if (typeof showSentenceTranslation === 'function') {
                    showSentenceTranslation(e.target);
                }
            }, 500);
        }
    });

    document.addEventListener('touchend', function() {
        clearTimeout(touchTimer);
    });
}

// ========= Add CSS Animations ==========
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
    @keyframes spin {
        to { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);

// ========= Initialize App ==========
document.addEventListener('DOMContentLoaded', function () {
    init();
});