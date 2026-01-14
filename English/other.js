
// Add this to your JavaScript
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Create and add the button to the page
function addScrollToTopButton() {
    const button = document.createElement('button');
    button.id = 'scrollToTopBtn';
    button.innerHTML = '<i class="fas fa-arrow-up"></i>';
    button.title = 'Scroll to top';

    button.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: var(--primary);
        color: white;
        border: none;
        border-radius: 50%;
        font-size: 1.2rem;
        cursor: pointer;
        display: none; /* Hidden by default */
        z-index: 1000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        transition: all 0.3s ease;
    `;

    button.addEventListener('mouseover', () => {
        button.style.transform = 'scale(1.1)';
        button.style.boxShadow = '0 6px 16px rgba(0,0,0,0.3)';
    });

    button.addEventListener('mouseout', () => {
        button.style.transform = 'scale(1)';
        button.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
    });

    button.addEventListener('click', scrollToTop);

    document.body.appendChild(button);

    // Show/hide button based on scroll position
    window.addEventListener('scroll', toggleScrollToTopButton);
}

function toggleScrollToTopButton() {
    const button = document.getElementById('scrollToTopBtn');
    if (!button) return;

    if (window.scrollY > 300) {
        button.style.display = 'flex';
        button.style.alignItems = 'center';
        button.style.justifyContent = 'center';
    } else {
        button.style.display = 'none';
    }
}

// Call this in your init() function
addScrollToTopButton();
// ========= Start search functions ==========
// Add these variables to DOM elements section
const searchForm = document.getElementById('search-form');
const searchInput = searchForm ? searchForm.querySelector('.search-input') : null;
const searchBtn = document.getElementById('search-btn');

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

        // Use the corrected function
        const highlightedTitle = highlightSearchMatch(story.title, query);

        // Only show author if it exists and is not empty
        const authorHTML = story.author && story.author.trim() !== ""
            ? `<div class="author"><i class="fas fa-user"></i> ${story.author}</div>`
            : '';

        // Add user story indicator
        const userStoryBadge = story.isUserStory
            ? '<span class="user-story-badge" title="User-added story"><i class="fas fa-user-plus"></i></span>'
            : '';

        // Get CEFR level with fallback
        const cefrLevel = story.levelcefr || '';

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
// Correction here! Add function to escape special characters
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
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

function setupSearch() {
    if (!searchForm || !searchInput) return;

    // Search when form is submitted
    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        performSearch();
    });

    // Search while typing
    searchInput.addEventListener('input', (e) => {
        performSearch(); // Remove condition to make search immediate
    });

    // Clear button
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

// ========= End search functions ==========



// ============ TOGGLE NAVIGATION ============
const toggleNav = document.getElementById("toggle-nav");
const more = document.getElementById("more");
let isMenuOpen = false;

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
let selectedColor = localStorage.getItem('selectedColor') || '#4f46e5';

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




// Update showNotification to use selected color for success messages
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;

    // Set background color based on notification type
    let bgColor = '';

    if (type === 'success') {
        bgColor = 'var(--primary)'; // Use the CSS variable
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
let selectedSecondaryColor = localStorage.getItem('selectedSecondaryColor') || '#10b981';

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

// Helper function to update active color (rename your existing one if needed)
function updateActiveColor(color, isSecondary = false) {
    const selector = isSecondary ? '.secondary-color:not(.custom-color)' : '.color-option:not(.custom-color):not(.secondary-color)';
    const options = document.querySelectorAll(selector);

    options.forEach(option => {
        option.classList.remove('active');
        if (option.dataset.color === color) {
            option.classList.add('active');
        }
    });
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
                    <button class="btn-secondary" onclick="closeRecentStoriesModal()">
                        <i class="fas fa-times"></i> Close
                    </button>
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
// ============profile setting===================
// DOM Elements
const profilePhoto = document.getElementById('profile-photo');
const changePhotoBtn = document.getElementById('change-photo-btn');
const photoInput = document.getElementById('photo-input');
const nameInput = document.getElementById('profile-name-input');
const nameCharCount = document.getElementById('name-char-count');
const nameValidIcon = document.getElementById('name-valid-icon');
const cancelBtn = document.getElementById('cancel-btn');
const saveBtn = document.getElementById('save-btn');
const profilePic = document.getElementById('profile-pic');
const profileName = document.getElementById('profile-name');

// Update character counter
function updateCharCounter() {
    const currentLength = nameInput.value.length;
    nameCharCount.textContent = currentLength;

    // Change color based on length
    if (currentLength === 0) {
        nameCharCount.style.color = 'var(--text-tertiary)';
    } else if (currentLength > 40) {
        nameCharCount.style.color = 'var(--warning-color)';
    } else {
        nameCharCount.style.color = 'var(--success-color)';
    }
}

// Update displayed profile name in real-time
function updateDisplayedName() {
    if (profileName && nameInput) {
        const name = nameInput.value.trim();
        profileName.textContent = name || 'Your name ';
    }
}

// Load saved data from localStorage
function loadProfileData() {
    const savedName = localStorage.getItem('profileName');
    const savedPhoto = localStorage.getItem('profilePhoto');

    if (savedName) {
        nameInput.value = savedName;
        if (profileName) {
            profileName.textContent = savedName;
        }
    } else {
        if (profileName) {
            profileName.textContent = 'Ammar Chacal';
        }
    }

    if (savedPhoto) {
        profilePhoto.src = savedPhoto;
        if (profilePic) {
            profilePic.src = savedPhoto;
        }
    }

    updateCharCounter();
}

// Save profile data
function saveProfileData() {
    const name = nameInput.value.trim();
    const photo = profilePhoto.src;

    localStorage.setItem('profileName', name);
    localStorage.setItem('profilePhoto', photo);

    // Update displayed profile
    if (profileName) {
        profileName.textContent = name || 'Ammar Chacal';
    }

    if (profilePic) {
        profilePic.src = photo;
    }

    // Show success message
    showNotification('Profile updated successfully!', 'success');
}

// Handle photo upload
function handlePhotoUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
        showNotification('File size must be less than 5MB', 'error');
        return;
    }

    // Check file type
    if (!file.type.match('image.*')) {
        showNotification('Please select an image file', 'error');
        return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
        // Update both profile photo elements
        profilePhoto.src = e.target.result;
        if (profilePic) {
            profilePic.src = e.target.result;
        }
    };
    reader.readAsDataURL(file);
}

// Initialize
document.addEventListener('DOMContentLoaded', function () {
    // Load saved data
    loadProfileData();

    // Event listeners
    changePhotoBtn.addEventListener('click', () => photoInput.click());
    photoInput.addEventListener('change', handlePhotoUpload);

    // Update both counter and displayed name on input
    nameInput.addEventListener('input', function () {
        updateCharCounter();
        updateDisplayedName();
    });

    cancelBtn.addEventListener('click', function () {
        if (confirm('Discard changes?')) {
            loadProfileData(); // Reload original data
            showNotification('Changes discarded', 'info');
        }
    });

    saveBtn.addEventListener('click', function () {
        if (!nameInput.value.trim()) {
            showNotification('Please enter your name', 'error');
            nameInput.focus();
            return;
        }

        saveProfileData();
    });

    // Save on Enter key
    nameInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            saveBtn.click();
        }
    });
});

// Optional: Add drag and drop for photo
document.addEventListener('DOMContentLoaded', function () {
    const photoWrapper = document.querySelector('.photo-wrapper');

    if (photoWrapper) {
        photoWrapper.addEventListener('dragover', function (e) {
            e.preventDefault();
            this.style.borderColor = 'var(--primary-color)';
        });

        photoWrapper.addEventListener('dragleave', function (e) {
            e.preventDefault();
            this.style.borderColor = 'var(--border-color)';
        });

        photoWrapper.addEventListener('drop', function (e) {
            e.preventDefault();
            this.style.borderColor = 'var(--border-color)';

            const files = e.dataTransfer.files;
            if (files.length > 0) {
                const event = { target: { files: files } };
                handlePhotoUpload(event);
            }
        });
    }
});

// Notification function (add this if not already exists)
function showNotification(message, type = 'info') {
    // Check if notification function exists, otherwise create it
    console.log(`${type}: ${message}`);
    alert(message); // Simple fallback
}

//===================end profile settings===================
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
    userStats.lvl = Math.floor(userStats.totalXP / 100) + 1;

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
    const oldLevel = Math.floor((userStats.totalXP - amount) / 100) + 1;
    
    // Calculate NEW level AFTER adding XP
    const newLevel = Math.floor(userStats.totalXP / 100) + 1;

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