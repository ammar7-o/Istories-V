


// Call this in your init() function
addScrollToTopButton();

// ========= Start search functions ==========
// Add these variables to DOM elements section
const searchForm = document.getElementById('search-form');
const searchInput = searchForm ? searchForm.querySelector('.search-input') : null;
const searchBtn = document.getElementById('search-btn');

function filterStoriesBySearch(query) {
    // Language filter is shared with the library toolbar (defined in main.js).
    const langFilter = (typeof currentLang === 'string') ? currentLang : 'all';
    const matchesLang = (story) => {
        if (!langFilter || langFilter === 'all') return true;
        const code = String(story.lang || 'en').toLowerCase().split('-')[0];
        return code === String(langFilter).toLowerCase();
    };

    if (!query || query.trim() === '') {
        // If no query, return all stories (respecting the user stories setting)
        let filteredStories = [...stories.filter(story => !story.isUserStory)];

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

        return filteredStories.filter(matchesLang);
    }

    query = query.toLowerCase().trim();

    // Start with regular stories (non-user stories)
    let filteredStories = [...stories.filter(story => !story.isUserStory)];

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

    // Now filter by search query
    return filteredStories.filter(story => {
        if (!matchesLang(story)) return false;

        const titleMatch = story.title.toLowerCase().includes(query);
        const contentMatch = story.content.some(paragraph =>
            paragraph.toLowerCase().includes(query)
        );
        const levelMatch = story.level.toLowerCase().includes(query);
        const tagsMatch = story.tags?.some(tag =>
            tag.toLowerCase().includes(query)
        ) || false;
        const authorMatch = story.author?.toLowerCase().includes(query) || false;

        return titleMatch || contentMatch || levelMatch || tagsMatch || authorMatch;
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
                ${!showUserStories ? '<p><em>Note: User stories are currently disabled in settings</em></p>' : ''}
            </div>
        `;
        return;
    }

    filteredStories.forEach(story => {
        const storyCard = document.createElement('div');
        storyCard.className = 'story-card';
        storyCard.dataset.storyId = story.id;

        // Use the corrected function
        const highlightedTitle = highlightSearchMatch(story.title, query);

        // Only show author if it exists and is not empty
        const authorHTML = story.author && story.author.trim() !== ""
            ? `<div class="author"><i class="fas fa-user"></i> ${story.author}</div>`
            : '';

        // Add user story indicator only if user stories are enabled
        const userStoryBadge = (story.isUserStory && showUserStories)
            ? '<span class="user-story-badge" title="User-added story"><i class="fas fa-user-plus"></i></span>'
            : '';

        // Get CEFR level with fallback
        const cefrLevel = story.levelcefr || '';

        // Language badge (depends on the story lang). Kept identical to the
        // library/store cards so search results don't lose it.
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
                <h3 class="story-title">${highlightedTitle}</h3>
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

function highlightSearchMatch(text, query) {
    if (!query) return text;

    try {
        // Use function to escape special characters
        const escapedQuery = escapeRegExp(query);
        const regex = new RegExp(`(${escapedQuery})`, 'gi');
        return text.replace(regex, '<span class="search-highlight">$1</span>');
    } catch (error) {
        console.error('Error in highlightSearchMatch:', error);
        return text; // In case of error, return original text
    }
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

// ========= End search functions ==========


// Close menu when clicking anywhere
// NOTE: `isMenuOpen` and `more` were referenced below but never declared anywhere
// in this file, so every document click/keydown threw a ReferenceError. Declare
// them here so the (currently inert) menu-close behaviour is safe.
let isMenuOpen = false;
const more = document.getElementById('more');

document.addEventListener("click", function () {
    if (isMenuOpen && more) {
        more.classList.remove("open");
        isMenuOpen = false;
    }
});


// Close menu on Escape key
document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && isMenuOpen && more) {
        more.classList.remove("open");
        isMenuOpen = false;
    }
});


//=========Color selector============
// Add to your existing JavaScript

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

// Load saved color or use default
let selectedColor = localStorage.getItem('selectedColor') || '#09d9ba';

// Function to initialize color selector
//=========COLOR SELECTOR FUNCTIONS============
// Function to initialize color selector
function initColorSelector() {
    const colorOptions = document.querySelectorAll('.color-option:not(.custom-color)');
    const customColorPicker = document.getElementById('customColorPicker');

    console.log('Initializing color selector...'); // Debug log
    console.log('Found color options:', colorOptions.length); // Debug log

    // Remove active class from all options first
    colorOptions.forEach(opt => opt.classList.remove('active'));

    // Set active color based on saved preference
    if (colorOptions.length > 0) {
        colorOptions.forEach(option => {
            // Check if this option matches the saved color
            if (option.dataset.color === selectedColor) {
                option.classList.add('active');
                console.log('Setting active color option:', selectedColor); // Debug
            }

            option.addEventListener('click', () => {
                console.log('Color option clicked:', option.dataset.color); // Debug log

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

                // showNotification(`Primary color changed to ${option.title || 'custom'}`, 'success');
            });
        });
    }

    // Custom color picker
    if (customColorPicker) {
        console.log('Custom color picker found'); // Debug log

        // Set initial value from saved color
        customColorPicker.value = selectedColor;

        customColorPicker.addEventListener('input', (e) => {
            const color = e.target.value;
            console.log('Custom color input:', color); // Debug log

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
        console.log('Final color applied:', selectedColor);

        // Verify CSS variables are set
        const root = document.documentElement;
        console.log('CSS Variables:', {
            '--primary': getComputedStyle(root).getPropertyValue('--primary').trim(),
            '--primary-dark': getComputedStyle(root).getPropertyValue('--primary-dark').trim()
        });
    }, 100);
}
// Function to apply ONLY the primary color
function applyPrimaryColor(color) {
    // Calculate darker shade for --primary-dark
    const darkerColor = adjustColor(color, -20);

    // Update ONLY the primary color variables in CSS
    const root = document.documentElement;
    root.style.setProperty('--primary', color);
    root.style.setProperty('--primary-dark', darkerColor);

    // DO NOT update other elements - let CSS handle it
}

// Helper function to adjust color brightness (for --primary-dark)
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


const themeToggle = document.getElementById('themeToggle');
let theme = localStorage.getItem('theme') || 'light';

// Toggle theme
function toggleTheme() {
    const currentTheme = localStorage.getItem('theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';

    // Save new theme
    localStorage.setItem('theme', newTheme);

    // Apply the new theme
    applyTheme();

    // Show notification
    // showNotification(`Switched to ${newTheme} mode`, 'success');
}


// Secondary color variables
let selectedSecondaryColor = localStorage.getItem('selectedSecondaryColor') || '#007ce1';

// Function to initialize secondary color selector
function initSecondaryColorSelector() {
    const secondaryColorOptions = document.querySelectorAll('.secondary-color:not(.custom-color)');
    const customSecondaryColorPicker = document.getElementById('customSecondaryColorPicker');

    console.log('Initializing secondary color selector...');
    console.log('Found secondary color options:', secondaryColorOptions.length);

    // Remove active class from all secondary options first
    secondaryColorOptions.forEach(opt => opt.classList.remove('active'));

    // Set active secondary color based on saved preference
    if (secondaryColorOptions.length > 0) {
        secondaryColorOptions.forEach(option => {
            // Check if this option matches the saved secondary color
            if (option.dataset.color === selectedSecondaryColor) {
                option.classList.add('active');
                console.log('Setting active secondary color option:', selectedSecondaryColor);
            }

            option.addEventListener('click', () => {
                console.log('Secondary color option clicked:', option.dataset.color);

                // Remove active class from all secondary options
                secondaryColorOptions.forEach(opt => opt.classList.remove('active'));

                // Add active class to clicked option
                option.classList.add('active');

                // Get selected secondary color
                const color = option.dataset.color;

                // Apply ONLY the secondary color
                applySecondaryColor(color);

                // Save to localStorage
                localStorage.setItem('selectedSecondaryColor', color);
                selectedSecondaryColor = color;

                // Update custom secondary color picker
                if (customSecondaryColorPicker) {
                    customSecondaryColorPicker.value = color;
                }

                showNotification(`Secondary color changed to ${option.title || 'custom'}`, 'success');
            });
        });
    }

    // Custom secondary color picker
    if (customSecondaryColorPicker) {
        console.log('Custom secondary color picker found');

        // Set initial value from saved secondary color
        customSecondaryColorPicker.value = selectedSecondaryColor;

        customSecondaryColorPicker.addEventListener('input', (e) => {
            const color = e.target.value;
            console.log('Custom secondary color input:', color);

            // Remove active class from preset secondary colors
            secondaryColorOptions.forEach(opt => opt.classList.remove('active'));

            // Apply ONLY the secondary color
            applySecondaryColor(color);

            // Save to localStorage
            localStorage.setItem('selectedSecondaryColor', color);
            selectedSecondaryColor = color;

            showNotification('Custom secondary color applied', 'success');
        });

        customSecondaryColorPicker.addEventListener('change', (e) => {
            const color = e.target.value;

            // Remove active class from preset secondary colors
            secondaryColorOptions.forEach(opt => opt.classList.remove('active'));

            // Apply ONLY the secondary color
            applySecondaryColor(color);

            // Save to localStorage
            localStorage.setItem('selectedSecondaryColor', color);
            selectedSecondaryColor = color;

            showNotification('Custom secondary color saved', 'success');
        });

        // Also trigger change on custom color picker click
        customSecondaryColorPicker.parentElement.addEventListener('click', (e) => {
            if (e.target !== customSecondaryColorPicker) {
                customSecondaryColorPicker.click();
            }
        });
    }

    // Force apply the secondary color one more time to ensure it's set
    setTimeout(() => {
        applySecondaryColor(selectedSecondaryColor);
        console.log('Final secondary color applied:', selectedSecondaryColor);
    }, 100);
}

// Function to apply ONLY the secondary color
function applySecondaryColor(color) {
    // Calculate darker and lighter shades for --secondary-dark and --secondary-light
    const darkerColor = adjustColor(color, -20);
    const lighterColor = adjustColor(color, 20);

    // Update ONLY the secondary color variables in CSS
    const root = document.documentElement;
    root.style.setProperty('--secondary', color);
    root.style.setProperty('--secondary-dark', darkerColor);
    root.style.setProperty('--secondary-light', lighterColor);
}

// Add init function
function init() {
    console.log('App initialization started...');

    // Load saved words
    savedWords = JSON.parse(localStorage.getItem('savedWords')) || [];

    // Apply theme
    applyTheme();

    // Apply colors
    if (selectedColor) {
        applyPrimaryColor(selectedColor);
    }
    if (selectedSecondaryColor) {
        applySecondaryColor(selectedSecondaryColor);
    }

    console.log('App initialization complete!');
}

// Update your DOMContentLoaded event listener:
document.addEventListener('DOMContentLoaded', function () {
    init();

    // Initialize primary color selector
    if (typeof initColorSelector === 'function') {
        initColorSelector();
    }

    // Initialize secondary color selector
    if (typeof initSecondaryColorSelector === 'function') {
        initSecondaryColorSelector();
    }
});

// Update your applyTheme function to also apply secondary color:
function applyTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';

    // Apply theme to body class
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }

    // Update theme toggle icon
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        const themeIcon = themeToggle.querySelector('i');
        if (themeIcon) {
            themeIcon.className = savedTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
    }

    // Re-apply both colors to ensure they work with new theme
    if (selectedColor) {
        applyPrimaryColor(selectedColor);
    }
    if (selectedSecondaryColor) {
        applySecondaryColor(selectedSecondaryColor);
    }
}


// ============ READING HISTORY FUNCTIONS ============

// Get reading history from localStorage
function getReadingHistory() {
    try {
        const history = JSON.parse(localStorage.getItem('readingHistory')) || [];
        return history.slice(0, 10); // Return only last 10 items
    } catch (error) {
        console.error('Error reading history:', error);
        return [];
    }
}

// Add story to reading history
function addToReadingHistory(story) {
    try {
        let history = getReadingHistory();

        // Remove if already exists (to avoid duplicates)
        history = history.filter(item => item.id !== story.id);

        // Add to beginning of array
        history.unshift({
            id: story.id,
            title: story.title,
            level: story.level,
            cover: story.cover,
            coverType: story.coverType,
            timestamp: new Date().toISOString(),
            isUserStory: story.isUserStory || false
        });

        // Keep only last 10 entries
        if (history.length > 10) {
            history = history.slice(0, 10);
        }

        localStorage.setItem('readingHistory', JSON.stringify(history));
    } catch (error) {
        console.error('Error saving reading history:', error);
    }
}

// Format time ago
function formatTimeAgo(timestamp) {
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now - time;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
        return `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`;
    } else if (diffHours < 24) {
        return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
    } else if (diffDays < 7) {
        return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
    } else {
        return new Date(timestamp).toLocaleDateString();
    }
}

// Show reading history modal - SHOWS 7 STORIES NOW
// Show reading history modal - SHOWS 7 STORIES NOW
function showRecentStories() {
    const history = getReadingHistory();

    // If no history, show notification
    if (history.length === 0) {
        showNotification('No recent stories found. Start reading to build your history!');
        return;
    }

    // Create modal - REMOVED THE ONCLICK FROM OVERLAY
    const modalHTML = `
        <div class="modal-overlay" id="recentStoriesModal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3><i class="fas fa-history"></i> Recent Stories</h3>
                    <button class="modal-close" onclick="closeRecentStoriesModal()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="recent-stories-list">
                        ${history.slice(0, 7).map((story, index) => {
        // Create a click handler that works for all stories
        const clickHandler = story.isUserStory
            ? `openUserStoryFromHistory('${story.id}')`
            : `openStoryInNewPage(${story.id})`;

        return `
                            <div class="recent-story-item" onclick="${clickHandler}; closeRecentStoriesModal();">
                                <div class="recent-story-rank">${index + 1}</div>
                                <div class="recent-story-cover">
                                    ${story.coverType === 'emoji' ?
                `<div class="story-emoji-recent">${story.cover}</div>` :
                story.coverType === 'icon' ?
                    `<i class="${story.cover && story.cover.trim() !== '' ? story.cover : 'fas fa-book'}"></i>` :
                    story.cover && story.cover.startsWith('http') ?
                        `<img src="${story.cover}" alt="${story.title}" style="width: 40px; height: 40px; border-radius: 8px;">` :
                        `<img src="${story.cover}" alt="${story.title}" style="width: 40px; height: 40px; border-radius: 8px;">`

            }
                                </div>
                                <div class="recent-story-info">
                                    <h4>${story.title || 'Unknown Story'}</h4>
                                    <div class="recent-story-meta">
                                        <span class="story-level-badge ${story.level}">${story.level}</span>
                                        <span class="recent-story-time">${formatTimeAgo(story.timestamp)}</span>
                                        ${story.isUserStory ? '<span class="user-story-tag"><i class="fas fa-user"></i></span>' : ''}
                                    </div>
                                </div>
                                <div class="recent-story-action">
                                    <i class="fas fa-play"></i>
                                </div>
                            </div>
                        `;
    }).join('')}
                    </div>
                    ${history.length > 7 ? `
                        <div class="recent-stories-footer">
                            <p>Showing 7 of ${history.length} recent stories</p>
                        </div>
                    ` : ''}
                </div>
                <div class="modal-footer">
                 
                    <button class="btn-primary" onclick="clearReadingHistory()">
                        <i class="fas fa-trash"></i> Clear History
                    </button>
                </div>
            </div>
        </div>
    `;

    // Add to page
    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = modalHTML;
    document.body.appendChild(modalContainer);

    // Add click outside functionality
    setTimeout(() => {
        const modal = document.getElementById('recentStoriesModal');
        if (modal) {
            // Add event listener to document to detect clicks outside modal
            const outsideClickHandler = (e) => {
                // Check if modal exists and if click is outside modal
                const modal = document.getElementById('recentStoriesModal');
                if (!modal) {
                    document.removeEventListener('click', outsideClickHandler);
                    return;
                }

                // Check if click is outside the entire modal overlay
                if (!modal.contains(e.target)) {
                    closeRecentStoriesModal();
                    document.removeEventListener('click', outsideClickHandler);
                }
            };

            // Add the event listener
            document.addEventListener('click', outsideClickHandler);
        }
    }, 10);

    // Add Escape key support
    setTimeout(() => {
        const escapeHandler = (e) => {
            if (e.key === 'Escape') {
                closeRecentStoriesModal();
                document.removeEventListener('keydown', escapeHandler);
            }
        };
        document.addEventListener('keydown', escapeHandler);
    }, 10);
}
// Close the modal - SINGLE FUNCTION (removed duplicate)
function closeRecentStoriesModal() {
    const modal = document.getElementById('recentStoriesModal');
    if (modal) {
        modal.remove();
    }
}

// Clear reading history
function clearReadingHistory() {
    if (confirm("Clear all reading history? This action cannot be undone.")) {
        localStorage.removeItem('readingHistory');
        showNotification('Reading history cleared!');
        closeRecentStoriesModal();
    }
}

// Function to open user stories from history
function openUserStoryFromHistory(storyId) {
    try {
        // First, check if story exists in current stories array
        const existingStory = stories.find(s => s.id == storyId);

        if (existingStory) {
            // Story exists in memory, open it normally
            openStoryInNewPage(storyId);
            return;
        }

        // If not in memory, try to load from localStorage
        const userStories = JSON.parse(localStorage.getItem('userStories')) || [];
        const userStory = userStories.find(s => s.id == storyId);

        if (userStory) {
            // Add to stories array temporarily
            if (!stories.some(s => s.id == storyId)) {
                stories.push(userStory);
            }

            // Open the story
            openStoryInNewPage(storyId);
        } else {
            // Story not found
            showNotification('Story not found. It may have been deleted.');

            // Remove from history
            let history = getReadingHistory();
            history = history.filter(item => item.id != storyId);
            localStorage.setItem('readingHistory', JSON.stringify(history));

            // Close modal and refresh
            closeRecentStoriesModal();
            setTimeout(() => {
                showRecentStories(); // Refresh the modal
            }, 100);
        }
    } catch (error) {
        console.error('Error opening user story:', error);
        showNotification('Error opening story. Please try again.');
    }
}

// ============ END READING HISTORY FUNCTIONS ============
// User stats variables
let userStats = JSON.parse(localStorage.getItem('userStats')) || {
    xp: 0,
    wordsLearned: 0,
    lvl: 1, // Level starts at 1
    streakDays: 0,
    lastActiveDate: null,
    totalXP: 0
};

// =============== USER STATS FUNCTIONS ===============
function initUserStats() {
    console.log('Initializing user stats...');

    // Sync word count from savedWords on init
    const savedWords = JSON.parse(localStorage.getItem('savedWords')) || [];
    userStats.wordsLearned = savedWords.length;

    // Calculate current level from total XP (CORRECT CALCULATION)
    userStats.lvl = Math.floor(userStats.totalXP / 170) + 1;

    // Check and update streak
    updateStreak();

    // Update displayed stats
    updateUserStatsDisplay();

    // Save initial stats if they don't exist
    localStorage.setItem('userStats', JSON.stringify(userStats));

    console.log('Initialized: Level', userStats.lvl, '| XP:', userStats.totalXP, '| Words:', userStats.wordsLearned);
}

function updateStreak() {
    const today = new Date().toDateString(); // Get today's date as string
    const lastActive = userStats.lastActiveDate;

    if (!lastActive) {
        // First time user
        userStats.streakDays = 1;
        userStats.lastActiveDate = today;
        console.log('First time user, streak set to 1');
        return;
    }

    const lastActiveDate = new Date(lastActive);
    const currentDate = new Date();

    // Calculate days difference
    const timeDiff = currentDate.getTime() - lastActiveDate.getTime();
    const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));

    if (daysDiff === 0) {
        // Same day, no change
        console.log('User active today, streak unchanged');
    } else if (daysDiff === 1) {
        // Consecutive day - increment streak
        userStats.streakDays++;
        userStats.lastActiveDate = today;
        console.log('Consecutive day, streak increased to:', userStats.streakDays);

        // Award XP for maintaining streak
        addXP(10, 'Daily streak');
    } else if (daysDiff > 1) {
        // Streak broken - reset to 1
        userStats.streakDays = 1;
        userStats.lastActiveDate = today;
        console.log('Streak broken, reset to 1');
    }

    // Save updated streak
    localStorage.setItem('userStats', JSON.stringify(userStats));
}

function addXP(amount, reason = '') {
    userStats.xp += amount;
    userStats.totalXP += amount;

    // Calculate OLD level BEFORE adding XP
    const oldLevel = Math.floor((userStats.totalXP - amount) / 170) + 1;

    // Calculate NEW level AFTER adding XP
    const newLevel = Math.floor(userStats.totalXP / 170) + 1;

    if (newLevel > oldLevel) {
        userStats.lvl = newLevel; // Update level in stats
        showNotification(`🎉 Level Up! You reached level ${newLevel}!`, 'success');
    }

    // Save to localStorage
    localStorage.setItem('userStats', JSON.stringify(userStats));

    // Update display
    updateUserStatsDisplay();

    console.log(`Added ${amount} XP${reason ? ' for: ' + reason : ''}. Level: ${userStats.lvl}, Total XP: ${userStats.totalXP}`);
}

function addWordToStats() {
    // Get savedWords from localStorage
    const savedWords = JSON.parse(localStorage.getItem('savedWords')) || [];

    // Update word count
    userStats.wordsLearned = savedWords.length;

    // Add XP for learning new words
    addXP(5, 'Learning new word');

    // Save to localStorage
    localStorage.setItem('userStats', JSON.stringify(userStats));

    // Update display
    updateUserStatsDisplay();

    console.log('Word count updated:', userStats.wordsLearned, 'words found in savedWords');
}

function updateUserStatsDisplay() {
    // Update XP
    const xpElement = document.getElementById('xp');
    if (xpElement) {
        xpElement.textContent = userStats.xp;
    }

    // Update words learned
    const wordsElement = document.getElementById('words-learned');
    if (wordsElement) {
        wordsElement.textContent = userStats.wordsLearned;
    }

    // Update LEVEL
    const levelElement = document.getElementById('level') ||
        document.getElementById('lvl') ||
        document.getElementById('user-level');

    if (levelElement) {
        levelElement.textContent = userStats.lvl;
    }

    // Update streak
    const streakElement = document.getElementById('streak-count');
    if (streakElement) {
        streakElement.textContent = userStats.streakDays;
    }

    // Optional: Show progress to next level
    const progressElement = document.getElementById('level-progress');
    if (progressElement) {
        const progressPercent = getLevelProgress();
        progressElement.textContent = `${progressPercent}%`;
    }

    // Optional: Update progress bar
    const progressBar = document.getElementById('level-progress-bar');
    if (progressBar) {
        const progressPercent = getLevelProgress();
        progressBar.style.width = `${progressPercent}%`;
    }

    // Optional: Show XP to next level
    const xpToNextElement = document.getElementById('xp-to-next');
    if (xpToNextElement) {
        const xpToNext = getXPForNextLevel();
        xpToNextElement.textContent = `${xpToNext} XP to next level`;
    }
}

// Function to calculate level progress (0-100%)
function getLevelProgress() {
    const currentXP = userStats.totalXP;
    const currentLevel = userStats.lvl - 1; // Level 1 = 0-99 XP
    const xpForCurrentLevel = currentLevel * 100;
    const xpInCurrentLevel = currentXP - xpForCurrentLevel;

    return Math.min(100, Math.floor((xpInCurrentLevel / 100) * 100));
}

// Function to get current level
function getCurrentLevel() {
    return Math.floor(userStats.totalXP / 100) + 1;
}

// Function to get XP needed for next level
function getXPForNextLevel() {
    const currentLevel = getCurrentLevel();
    const xpForNextLevel = currentLevel * 100;
    return xpForNextLevel - userStats.totalXP;
}

// Function to get XP in current level
function getXPInCurrentLevel() {
    const currentLevel = getCurrentLevel();
    const xpForCurrentLevel = (currentLevel - 1) * 100;
    return userStats.totalXP - xpForCurrentLevel;
}

// Add daily login bonus
function checkDailyBonus() {
    const today = new Date().toDateString();
    const lastBonusDate = localStorage.getItem('lastBonusDate');

    if (lastBonusDate !== today) {
        // Award daily bonus
        addXP(25, 'Daily login bonus');
        localStorage.setItem('lastBonusDate', today);

        // Show notification for first login of the day
        setTimeout(() => {
            showNotification('🎁 Daily bonus! +25 XP for logging in today!', 'success');
        }, 1000);
    }
}

// Function to sync word count
function syncWordCountFromStorage() {
    const savedWords = JSON.parse(localStorage.getItem('savedWords')) || [];
    const previousCount = userStats.wordsLearned;
    userStats.wordsLearned = savedWords.length;

    // If words were added or removed elsewhere, update XP
    if (userStats.wordsLearned > previousCount) {
        const newWords = userStats.wordsLearned - previousCount;
        addXP(newWords * 5, `Sync: ${newWords} new words found`);
    }

    localStorage.setItem('userStats', JSON.stringify(userStats));
    updateUserStatsDisplay();

    console.log(`Synced word count: ${previousCount} → ${userStats.wordsLearned}`);
}

// Function to add XP for reading activity
function addReadingActivity(minutes) {
    // Add XP for reading (1 XP per minute, max 10 XP per session)
    const xpToAdd = Math.min(minutes, 10);
    addXP(xpToAdd, 'Reading practice');
    console.log(`Added ${xpToAdd} XP for ${minutes} minutes of reading`);
}

// Function to get user stats summary
function getUserStatsSummary() {
    return {
        level: userStats.lvl,
        xp: userStats.xp,
        totalXP: userStats.totalXP,
        wordsLearned: userStats.wordsLearned,
        streakDays: userStats.streakDays,
        nextLevelXP: getXPForNextLevel(),
        progress: getLevelProgress()
    };
}

// Initialize user stats when page loads
document.addEventListener('DOMContentLoaded', function () {
    initUserStats();
    checkDailyBonus();
});


// Data management (backup / restore / delete) now lives on the central
// Settings page (settings/index.html).

// ============ Display saved profile in the home header card ============
// The profile *editor* now lives on its own page (main/profile/index.html), but this
// page still shows the profile photo/name, so keep them in sync with storage.
document.addEventListener('DOMContentLoaded', function () {
    const pic = document.getElementById('profile-pic');
    const nameEl = document.getElementById('profile-name');
    const savedName = localStorage.getItem('profileName');
    const savedPhoto = localStorage.getItem('profilePhoto');

    if (nameEl) {
        nameEl.textContent = savedName || 'Your name';
    }
    if (pic && savedPhoto) {
        pic.src = savedPhoto;
    }
});
