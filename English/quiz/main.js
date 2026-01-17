// ========= App State Variables ==========

let currentPage = 'home';
let currentStory = null;
let stories = []; // Will be loaded from external file
let selectedColor = localStorage.getItem('selectedColor') || '#4f46e5';

// Add Stories variables (ADDED)
let userStories = JSON.parse(localStorage.getItem('userStories')) || [];
let userDictionaries = JSON.parse(localStorage.getItem('userDictionaries')) || {};
let currentEditIndex = -1; // For editing stories

// ========= DOM Elements ==========
const pages = document.querySelectorAll('.page');
const navLinks = document.querySelectorAll('.nav-link');
const levelBtns = document.querySelectorAll('.level-btn');
const storiesGrid = document.getElementById('storiesGrid');
const toggleNav = document.getElementById("toggle-nav");
const more = document.getElementById("more");
const themeToggle = document.getElementById('themeToggle');
const settingsButton = document.getElementById("settings-button");
const settingsPage = document.getElementById("settings-page");
const closeSettings = document.getElementById("close-settings");
const settingsOverlay = document.getElementById("settings-overlay");
const searchForm = document.getElementById('search-form');
const searchInput = searchForm ? searchForm.querySelector('.search-input') : null;

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
    // Auto lazy load ALL images
    document.querySelectorAll('img').forEach(img => img.setAttribute('loading', 'lazy'));
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

    // Load user stories from localStorage
    try {
        const storedStories = localStorage.getItem('userStories');
        const storedDictionaries = localStorage.getItem('userDictionaries');

        if (storedStories) {
            userStories = JSON.parse(storedStories);
        }

        if (storedDictionaries) {
            userDictionaries = JSON.parse(storedDictionaries);
        }
    } catch (error) {
        console.error('Error loading user stories:', error);
        userStories = [];
        userDictionaries = {};
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

    // STEP 5: Initialize Add Stories if on that page
    if (document.getElementById('addStories')) {
        console.log('Step 5: Initializing Add Stories page...');
        initAddStories();
    }

    // STEP 6: Set up navigation and event listeners
    console.log('Step 6: Setting up navigation and event listeners...');

    setupNavToggle();

    setupEventListeners();
    setupSettings();

    // STEP 7: Verify everything is set up correctly
    console.log('Step 7: Final verification...');
    setTimeout(() => {
        verifyColorSetup();
    }, 200);

    console.log('App initialization complete!');
}

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
let selectedSecondaryColor = localStorage.getItem('selectedSecondaryColor') || '#f59e0b';

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


// ========= Story Display Functions ==========
function renderStories(level = 'all') {
    if (!storiesGrid) return;

    storiesGrid.innerHTML = '';

    let filteredStories;

    if (level === 'all') {
        filteredStories = stories;
    } else if (level === 'user') {
        filteredStories = userStories; // Show only user stories
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
        storyCard.dataset.storyTitle = story.title;

        // Check if story is already saved (only for non-user stories)
        const isSaved = !story.isUserStory && userStories.some(savedStory =>
            savedStory.title.toLowerCase() === story.title.toLowerCase()
        );

        // Create author HTML conditionally
        const authorHTML = story.author && story.author.trim() !== ""
            ? `<div class="author"><i class="fas fa-user"></i> ${story.author}</div>`
            : '';

        // Check if it's a user story
        const isUserStory = story.isUserStory;

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
        
                    ${isUserStory ? '<span class="user-story-badge">Your Story</span>' : ''}
                </div>
                <h3 class="story-title">${story.title}</h3>
                <div class="story-meta">
                    <span><i class="fas fa-font"></i> ${story.wordCount || 'N/A'} words</span>
                    <span><i class="fas fa-clock"></i> ${Math.ceil((story.wordCount || 100) / 200)} min read</span>
                </div>
                
                <!-- Action Buttons - Save button and Download button -->
                <div class="story-actions">
                    ${!isUserStory ? `
                        <button class="story-action-btn save-story-btn" data-story-title="${story.title}" ${isSaved ? 'disabled' : ''}>
                            <i class="fas ${isSaved ? 'fa-check' : 'fa-bookmark'}"></i> ${isSaved ? 'Saved' : 'Save Story'}
                        </button>
                    ` : ''}
                    <button class="story-action-btn download-btn" data-story-title="${story.title}">
                        <i class="fas fa-download"></i> Download
                    </button>
                </div>
            </div>
        `;

        // Add event listeners for buttons
        const saveBtn = storyCard.querySelector('.save-story-btn');
        const downloadBtn = storyCard.querySelector('.download-btn');

        if (saveBtn && !isSaved) {
            saveBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                e.preventDefault();
                saveStoryToUserStories(story);
            });
        }

        if (downloadBtn) {
            downloadBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                e.preventDefault();
                downloadStory(story.title, isUserStory);
            });
        }

        storiesGrid.appendChild(storyCard);
    });
}
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
// Function to save story to user stories
function saveStoryToUserStories(story) {
    // Check if story already exists in user stories
    const alreadyExists = userStories.some(savedStory =>
        savedStory.title.toLowerCase() === story.title.toLowerCase()
    );

    if (alreadyExists) {
        showNotification('This story is already saved!', 'warning');
        return;
    }

    // Create a copy of the story for user stories
    const storyToSave = {
        ...story,
        id: `saved_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        isUserStory: true,
        savedDate: new Date().toISOString(),
        originalSource: story.isUserStory ? 'user' : 'external'
    };

    // Add to user stories
    userStories.push(storyToSave);

    // If the story has translations, save them to userDictionaries
    if (story.translations && Object.keys(story.translations).length > 0) {
        userDictionaries[storyToSave.id] = story.translations;
        // Save userDictionaries to localStorage
        localStorage.setItem('userDictionaries', JSON.stringify(userDictionaries));
        console.log(`Saved ${Object.keys(story.translations).length} translations for story: ${story.title}`);
    }

    // Save to localStorage
    localStorage.setItem('userStories', JSON.stringify(userStories));

    // Update UI
    renderStories();

    // Show success notification
    const translationCount = story.translations ? Object.keys(story.translations).length : 0;
    if (translationCount > 0) {
        showNotification(`"${story.title}" saved to your stories with ${translationCount} translation${translationCount !== 1 ? 's' : ''}!`, 'success');
    } else {
        showNotification(`"${story.title}" saved to your stories!`, 'success');
    }
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
function downloadStory(storyTitle, isUserStory = false) {
    console.log('Downloading story with title:', storyTitle);

    let story;

    if (isUserStory) {
        // Find in userStories
        story = userStories.find(s => s.title.toLowerCase() === storyTitle.toLowerCase());
    } else {
        // Find in main stories array
        story = stories.find(s => s.title.toLowerCase() === storyTitle.toLowerCase());
    }

    if (!story) {
        console.error('Story not found! Title:', storyTitle);
        showNotification('Story not found!', 'error');
        return;
    }

    console.log('Found story:', story.title);

    // Find the download button
    const downloadBtn = document.querySelector(`.download-btn[data-story-title="${story.title}"]`);
    const originalText = downloadBtn ? downloadBtn.innerHTML : '';

    // Add loading state
    if (downloadBtn) {
        downloadBtn.classList.add('loading');
        downloadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Downloading...';
        downloadBtn.disabled = true;
    }

    try {
        // Get translations for this story
        let translations = {};
        if (isUserStory && userDictionaries[story.id]) {
            translations = userDictionaries[story.id];
        } else if (story.translations) {
            translations = story.translations;
        }

        // Prepare the story object for download
        const storyForDownload = {
            // Generate a unique ID if none exists
            id: story.id || `story_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            title: story.title,
            level: story.level,
            cover: story.cover,
            coverType: story.coverType,
            content: story.content,
            author: story.author || '',
            wordCount: story.wordCount || calculateWordCount(story.content),
            // Include translations if they exist
            ...(Object.keys(translations).length > 0 && { translations: translations }),
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
        const translationCount = Object.keys(translations).length;
        if (translationCount > 0) {
            showNotification(`"${story.title}" downloaded with ${translationCount} translation${translationCount !== 1 ? 's' : ''}!`, 'success');
        } else {
            showNotification(`"${story.title}" downloaded successfully!`, 'success');
        }

        // Track download
        trackDownload(story.title);

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
    if (!storiesGrid) return;

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
        storyCard.dataset.storyTitle = story.title;

        // Check if story is already saved (only for non-user stories)
        const isSaved = !story.isUserStory && userStories.some(savedStory =>
            savedStory.title.toLowerCase() === story.title.toLowerCase()
        );

        const highlightedTitle = highlightSearchMatch(story.title, query);

        const authorHTML = story.author && story.author.trim() !== ""
            ? `<div class="author"><i class="fas fa-user"></i> ${story.author}</div>`
            : '';

        const isUserStory = story.isUserStory;
        // Get CEFR level with fallback
        const cefrLevel = story.levelcefr || '';

        storyCard.innerHTML = `
            <div class="story-image">
                ${authorHTML}
                ${renderStoryCover(story)}
            </div>
            <div class="story-content">
            <div>
              <span class="story-level ${story.level}">${story.level}</span>
              <span class="story-level ${cefrLevel.toUpperCase()}">${cefrLevel.toUpperCase()}</span>
            </div>
              

                ${isUserStory ? '<span class="user-story-badge">Your Story</span>' : ''}
                <h3 class="story-title">${highlightedTitle}</h3>
                <div class="story-meta">
                    <span><i class="fas fa-font"></i> ${story.wordCount || 'N/A'} words</span>
                    <span><i class="fas fa-clock"></i> ${Math.ceil((story.wordCount || 100) / 200)} min read</span>
                </div>
                
                <!-- Action Buttons for search results -->
                <div class="story-actions">
                    ${!isUserStory ? `
                        <button class="story-action-btn save-story-btn" data-story-title="${story.title}" ${isSaved ? 'disabled' : ''}>
                            <i class="fas ${isSaved ? 'fa-check' : 'fa-bookmark'}"></i> ${isSaved ? 'Saved' : 'Save Story'}
                        </button>
                    ` : ''}
                    <button class="story-action-btn download-btn" data-story-title="${story.title}">
                        <i class="fas fa-download"></i> Download
                    </button>
                </div>
            </div>
        `;

        // Add event listeners for buttons in search results
        const saveBtn = storyCard.querySelector('.save-story-btn');
        const downloadBtn = storyCard.querySelector('.download-btn');

        if (saveBtn && !isSaved) {
            saveBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                e.preventDefault();
                saveStoryToUserStories(story);
            });
        }

        if (downloadBtn) {
            downloadBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                e.preventDefault();
                downloadStory(story.title, isUserStory);
            });
        }

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

    // Load user stories when switching to addStories page
    if (page === 'addStories') {
        loadUserStories();
    }
}

// Navigation menu state
let isMenuOpen = false;

// =============== NAVIGATION MENU FUNCTIONS ===============
function setupNavToggle() {
    if (!toggleNav || !more) return;

    console.log('Setting up navigation menu toggle...');

    // Toggle menu
    toggleNav.addEventListener("click", function (e) {
        e.stopPropagation();
        isMenuOpen = !isMenuOpen;
        more.classList.toggle("open");
        console.log('Menu toggled, isOpen:', isMenuOpen);
    });

    // Close menu when clicking anywhere
    document.addEventListener("click", function () {
        if (isMenuOpen) {
            more.classList.remove("open");
            isMenuOpen = false;
            console.log('Menu closed by clicking outside');
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
            console.log('Menu closed by Escape key');
        }
    });

    // Close menu when clicking on any <a> inside the menu
    const links = more.querySelectorAll("a");
    links.forEach(link => {
        link.addEventListener("click", function () {
            more.classList.remove("open");
            isMenuOpen = false;
            console.log('Menu closed by clicking link');
        });
    });

    console.log('Navigation menu toggle setup complete');
}
// ========= Settings Functions ==========
function setupSettings() {
    console.log('Setting up settings...');

    // Check if elements exist
    if (!settingsButton || !settingsPage || !closeSettings || !settingsOverlay) {
        console.error('Settings elements not found!');
        return;
    }

    console.log('Settings elements found, setting up listeners...');

    settingsButton.addEventListener("click", function (e) {
        e.stopPropagation();
        e.preventDefault();
        settingsPage.classList.add("open");
        settingsOverlay.classList.add("active");
    });

    closeSettings.addEventListener("click", function (e) {
        e.stopPropagation();
        e.preventDefault();
        settingsPage.classList.remove("open");
        settingsOverlay.classList.remove("active");
    });

    settingsOverlay.addEventListener("click", function () {
        settingsPage.classList.remove("open");
        settingsOverlay.classList.remove("active");
    });
    // Close settings when clicking on overlay
    settingsOverlay.addEventListener("click", function (e) {
        e.stopPropagation();
        e.preventDefault();
        settingsPage.classList.remove("open");
        settingsOverlay.classList.remove("active");
    });

    // Close settings with Escape key
    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && settingsPage.classList.contains("open")) {
            settingsPage.classList.remove("open");
            settingsOverlay.classList.remove("active");
        }
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
}

// ========= Add Stories Functions (INTEGRATED) ==========
function initAddStories() {
    // Add event listeners
    setupAddStoriesListeners();

    // Load existing user stories
    loadUserStories();
}

function setupAddStoriesListeners() {
    // File upload elements
    const browseBtn = document.getElementById('browseBtn');
    const storyFileInput = document.getElementById('storyFileInput');
    const uploadArea = document.getElementById('uploadArea');
    const removeFileBtn = document.getElementById('removeFile');
    const uploadBtn = document.getElementById('uploadBtn');

    // Form elements
    const storyForm = document.getElementById('storyForm');
    const previewBtn = document.getElementById('previewBtn');
    const downloadTemplateBtn = document.getElementById('downloadTemplateBtn');
    const copyJsonBtn = document.getElementById('copyJsonBtn');
    const loadExampleTranslationsBtn = document.getElementById('loadExampleTranslations');

    // Preview modal elements
    const closePreviewBtn = document.getElementById('closePreviewBtn');
    const closePreview = document.getElementById('closePreview');
    const saveFromPreviewBtn = document.getElementById('saveFromPreviewBtn');

    // Edit modal elements
    const closeEditModalBtn = document.getElementById('closeEditModalBtn');
    const closeEditModalBtn2 = document.getElementById('closeEditModalBtn2');
    const editStoryForm = document.getElementById('editStoryForm');
    const editStoryCoverType = document.getElementById('editStoryCoverType');
    const editStoryModal = document.getElementById('editStoryModal');

    // File upload functionality
    if (browseBtn && storyFileInput) {
        browseBtn.addEventListener('click', () => storyFileInput.click());
    }

    if (storyFileInput) {
        storyFileInput.addEventListener('change', handleFileSelect);
    }

    if (uploadArea) {
        // Drag and drop functionality
        uploadArea.addEventListener('dragover', handleDragOver);
        uploadArea.addEventListener('dragleave', handleDragLeave);
        uploadArea.addEventListener('drop', handleFileDrop);
        uploadArea.addEventListener('click', () => storyFileInput.click());
    }

    if (removeFileBtn) {
        removeFileBtn.addEventListener('click', clearSelectedFile);
    }

    if (uploadBtn) {
        uploadBtn.addEventListener('click', uploadStoryFile);
    }

    // Form functionality
    if (storyForm) {
        storyForm.addEventListener('submit', handleFormSubmit);
    }

    if (previewBtn) {
        previewBtn.addEventListener('click', showStoryPreview);
    }

    if (downloadTemplateBtn) {
        downloadTemplateBtn.addEventListener('click', downloadStoryTemplate);
    }

    if (copyJsonBtn) {
        copyJsonBtn.addEventListener('click', copyJsonExample);
    }

    if (loadExampleTranslationsBtn) {
        loadExampleTranslationsBtn.addEventListener('click', loadExampleTranslations);
    }

    // Preview modal functionality
    if (closePreviewBtn) {
        closePreviewBtn.addEventListener('click', closePreviewModal);
    }

    if (closePreview) {
        closePreview.addEventListener('click', closePreviewModal);
    }

    if (saveFromPreviewBtn) {
        saveFromPreviewBtn.addEventListener('click', saveStoryFromPreview);
    }

    // Edit modal functionality
    if (closeEditModalBtn) {
        closeEditModalBtn.addEventListener('click', closeEditModal);
    }

    if (closeEditModalBtn2) {
        closeEditModalBtn2.addEventListener('click', closeEditModal);
    }

    if (editStoryForm) {
        editStoryForm.addEventListener('submit', handleEditStorySubmit);
    }

    if (editStoryCoverType) {
        editStoryCoverType.addEventListener('change', updateEditCoverLabel);
    }

    // Close modals when clicking outside
    const previewModal = document.getElementById('previewModal');
    if (previewModal) {
        previewModal.addEventListener('click', (e) => {
            if (e.target === previewModal) {
                closePreviewModal();
            }
        });
    }

    if (editStoryModal) {
        editStoryModal.addEventListener('click', (e) => {
            if (e.target === editStoryModal) {
                closeEditModal();
            }
        });
    }
}

function loadUserStories() {
    const userStoriesList = document.getElementById('userStoriesList');
    if (!userStoriesList) return;

    userStoriesList.innerHTML = '';

    if (userStories.length === 0) {
        userStoriesList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-book-open"></i>
                <p>No stories saved yet</p>
            </div>
        `;
        return;
    }

    userStories.forEach((story, index) => {
        const storyItem = document.createElement('div');
        storyItem.className = 'story-item';

        // Check if this story has translations in userDictionaries
        const hasTranslations = userDictionaries[story.id] && Object.keys(userDictionaries[story.id]).length > 0;

        const translationBadge = hasTranslations
            ? '<span class="translation-badge" title="Has custom translations"><i class="fas fa-language"></i></span>'
            : '';

        // Determine if it's an image cover
        const isImageCover = story.coverType === 'image' ||
            (story.cover && (story.cover.startsWith('http://') || story.cover.startsWith('https://')));

        // Create icon/emoji/image display
        let coverDisplay = '';
        if (isImageCover) {
            // For image covers, show a small thumbnail
            coverDisplay = `<div class="story-image-small" style="background-image: url('${story.cover}')"></div>`;
        } else if (story.coverType === 'icon') {
            coverDisplay = `<i class="${story.cover || 'fas fa-book'}"></i>`;
        } else {
            // Default to emoji
            coverDisplay = `<div class="story-emoji-small">${story.cover || '📚'}</div>`;
        }

        storyItem.innerHTML = `
        <div class="imtitle">
         <div class="story-icon">
                ${coverDisplay}
                ${translationBadge}
            </div>
            <div class="story-item-info">
                <span class="story-item-title">${story.title}</span>
                <span class="story-item-meta">
                    ${story.level} • ${story.wordCount || 'Unknown'} words • 
                    ${new Date(story.savedDate || story.uploadDate).toLocaleDateString()}
                </span>
            </div>
        </div>
           
            <div class="story-item-actions">
                <button class="story-action-btn read-story-btn" title="Read Story" data-index="${index}">
                    <i class="fas fa-book-reader"></i>
                </button>
                <button class="story-action-btn share-story-btn" title="Share as JSON" data-index="${index}">
                    <i class="fas fa-share-alt"></i>
                </button>
                <button class="story-action-btn edit-story-btn" title="Edit Story" data-index="${index}">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="story-action-btn delete-story-btn" title="Delete Story" data-index="${index}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;

        userStoriesList.appendChild(storyItem);
    });

    // Add event listeners to buttons
    document.querySelectorAll('.read-story-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = parseInt(e.currentTarget.dataset.index);
            openUserStoryInReader(userStories[index].id);
        });
    });

    document.querySelectorAll('.share-story-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = parseInt(e.currentTarget.dataset.index);
            shareStoryAsJson(index);
        });
    });

    document.querySelectorAll('.edit-story-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = parseInt(e.currentTarget.dataset.index);
            openEditStoryModal(index);
        });
    });

    document.querySelectorAll('.delete-story-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = parseInt(e.currentTarget.dataset.index);
            deleteUserStory(index);
        });
    });
}

// ========= Helper Functions for Add Stories ==========
function openUserStoryInReader(storyId) {
    // Find the story
    const story = userStories.find(s => s.id === storyId);

    if (!story) {
        showNotification('Story not found.', 'error');
        return;
    }

    // Get translations for this story from userDictionaries
    const translations = userDictionaries[storyId] || {};

    // Store story data in localStorage for the reader
    localStorage.setItem('currentReadingStory', JSON.stringify({
        id: story.id,
        title: story.title,
        level: story.level,
        content: story.content,
        isUserStory: true,
        cover: story.cover,
        coverType: story.coverType,
        author: story.author || '',
        translations: translations
    }));

    // Redirect to reader page
    const storyPage = '../English/reader/index.html?id=' + storyId + '&userStory=true';
    window.location.href = storyPage;
}

function shareStoryAsJson(index) {
    if (index < 0 || index >= userStories.length) {
        showNotification('Story not found.', 'error');
        return;
    }

    const story = userStories[index];
    const storyId = story.id;

    // Get translations for this story from userDictionaries
    const translations = userDictionaries[storyId] || {};

    // Prepare the complete story object for export
    const exportStory = {
        title: story.title,
        level: story.level,
        cover: story.cover,
        coverType: story.coverType,
        content: story.content,
        author: story.author || '',
        uploadDate: story.uploadDate || story.savedDate,
        wordCount: story.wordCount,
        // Include translations if they exist
        ...(Object.keys(translations).length > 0 && { translations: translations })
    };

    // Convert to JSON string with nice formatting
    const jsonString = JSON.stringify(exportStory, null, 2);

    // Create a Blob with the JSON data
    const blob = new Blob([jsonString], { type: 'application/json' });

    // Create download URL
    const url = URL.createObjectURL(blob);

    // Create download link
    const a = document.createElement('a');
    a.href = url;

    // Create filename from story title (sanitize for filename)
    const sanitizedTitle = story.title
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, '-')
        .substring(0, 50);

    const date = new Date().toISOString().split('T')[0];
    a.download = `${sanitizedTitle}-${date}.json`;

    // Trigger download
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // Clean up
    URL.revokeObjectURL(url);

    // Show notification
    const translationCount = Object.keys(translations).length;
    if (translationCount > 0) {
        showNotification(`"${story.title}" exported with ${translationCount} translation${translationCount !== 1 ? 's' : ''}!`, 'success');
    } else {
        showNotification(`"${story.title}" exported as JSON file!`, 'success');
    }
}

function openEditStoryModal(index) {
    currentEditIndex = index;
    const story = userStories[index];

    // Fill form with story data
    document.getElementById('editStoryTitle').value = story.title || '';
    document.getElementById('editStoryLevel').value = story.level || 'intermediate';
    document.getElementById('editStoryAuthor').value = story.author || '';
    document.getElementById('editStoryCoverType').value = story.coverType || 'emoji';

    // Set cover input based on type
    const editStoryCover = document.getElementById('editStoryCover');
    if (editStoryCover) {
        editStoryCover.value = story.cover || '📚';
        updateEditCoverLabel();
    }

    // Fill content
    const editStoryContent = document.getElementById('editStoryContent');
    if (editStoryContent) {
        editStoryContent.value = Array.isArray(story.content) ? story.content.join('\n') : story.content || '';
    }

    // Fill translations from userDictionaries
    const editStoryTranslations = document.getElementById('editStoryTranslations');
    if (editStoryTranslations) {
        const storyId = story.id;
        if (userDictionaries[storyId]) {
            editStoryTranslations.value = JSON.stringify(userDictionaries[storyId], null, 2);
        } else {
            editStoryTranslations.value = '';
        }
    }

    // Show modal
    const editStoryModal = document.getElementById('editStoryModal');
    if (editStoryModal) {
        editStoryModal.classList.add('show');
    }
}

function updateEditCoverLabel() {
    const editStoryCoverType = document.getElementById('editStoryCoverType');
    const editCoverLabel = document.getElementById('editCoverLabel');
    const editStoryCover = document.getElementById('editStoryCover');

    if (editStoryCoverType && editCoverLabel && editStoryCover) {
        const coverType = editStoryCoverType.value;

        if (coverType === 'emoji') {
            editCoverLabel.textContent = 'Emoji';
            editStoryCover.placeholder = '📚';
        } else if (coverType === 'icon') {
            editCoverLabel.textContent = 'Font Awesome Icon';
            editStoryCover.placeholder = 'fas fa-book';
        } else if (coverType === 'image') {
            editCoverLabel.textContent = 'Image URL';
            editStoryCover.placeholder = 'https://example.com/image.jpg';
        }
    }
}

function handleEditStorySubmit(e) {
    e.preventDefault();

    if (currentEditIndex === -1) {
        showNotification('No story selected for editing.', 'error');
        return;
    }

    const story = userStories[currentEditIndex];
    const storyId = story.id;

    // Get form values
    const title = document.getElementById('editStoryTitle').value.trim();
    const level = document.getElementById('editStoryLevel').value;
    const author = document.getElementById('editStoryAuthor').value.trim();
    const coverType = document.getElementById('editStoryCoverType').value;
    const cover = document.getElementById('editStoryCover').value.trim();
    const contentText = document.getElementById('editStoryContent').value.trim();
    const translationsText = document.getElementById('editStoryTranslations').value.trim();

    // Validation
    if (!title || !level || !contentText) {
        showNotification('Please fill in all required fields.', 'error');
        return;
    }

    // Process content
    const content = contentText.split('\n').filter(line => line.trim() !== '');
    const wordCount = calculateWordCount(content);

    // Update story in userStories array
    userStories[currentEditIndex] = {
        ...story,
        title,
        level,
        author: author || '',
        coverType,
        cover: cover || (coverType === 'emoji' ? '📚' : 'fas fa-book'),
        content,
        wordCount,
        uploadDate: new Date().toISOString()
    };

    // Update translations in userDictionaries if provided
    if (translationsText) {
        try {
            const translations = JSON.parse(translationsText);
            userDictionaries[storyId] = translations;
            // Save userDictionaries to localStorage
            localStorage.setItem('userDictionaries', JSON.stringify(userDictionaries));
            showNotification(`${Object.keys(translations).length} translations saved.`, 'success');
        } catch (error) {
            showNotification('Invalid translations format. Translations not updated.', 'error');
        }
    } else {
        // Remove translations if cleared
        delete userDictionaries[storyId];
        localStorage.setItem('userDictionaries', JSON.stringify(userDictionaries));
    }

    // Save userStories to localStorage
    localStorage.setItem('userStories', JSON.stringify(userStories));

    // Update UI
    loadUserStories();
    if (currentPage === 'home' || currentPage === 'addStories') {
        renderStories();
    }

    // Close modal
    closeEditModal();

    // Show success message
    showNotification('Story updated successfully!', 'success');
}

function closeEditModal() {
    const editStoryModal = document.getElementById('editStoryModal');
    if (editStoryModal) {
        editStoryModal.classList.remove('show');
    }
    currentEditIndex = -1;

    // Reset form
    const editStoryForm = document.getElementById('editStoryForm');
    if (editStoryForm) {
        editStoryForm.reset();
    }
}

function processStoryData(storyData, fileName) {
    // Validate story structure
    if (!validateStory(storyData)) {
        showNotification('Invalid story format. Please check the template.', 'error');
        return;
    }

    // Process translations if they exist
    let translations = {};
    if (storyData.translations) {
        try {
            translations = storyData.translations;
        } catch (error) {
            console.error('Error parsing translations:', error);
            translations = {};
        }
    }

    // Generate unique ID
    const storyId = 'user_' + Date.now();

    // Prepare story object
    const userStory = {
        ...storyData,
        id: storyId,
        isUserStory: true,
        fileName: fileName,
        uploadDate: new Date().toISOString(),
        wordCount: calculateWordCount(storyData.content)
    };

    // Remove translations from story object to keep it clean
    delete userStory.translations;

    // Add to user stories
    userStories.push(userStory);

    // Save translations separately if they exist
    if (Object.keys(translations).length > 0) {
        userDictionaries[storyId] = translations;
    }

    // Save to localStorage
    localStorage.setItem('userStories', JSON.stringify(userStories));
    localStorage.setItem('userDictionaries', JSON.stringify(userDictionaries));

    // Update stories array and render
    stories.push(userStory);

    // ALWAYS render stories regardless of current page
    renderStories();

    // Show success message
    const translationCount = Object.keys(translations).length;
    const message = translationCount > 0
        ? `Story uploaded successfully with ${translationCount} custom translation${translationCount !== 1 ? 's' : ''}!`
        : 'Story uploaded successfully!';

    showNotification(message, 'success');

    // Clear file selection
    clearSelectedFile();

    // Update user stories list
    loadUserStories();

    // Open the story in reader
    openUserStoryInReader(storyId);
}
function Refresh() {
    window.location.reload()
}
function deleteUserStory(index) {
    if (confirm('Are you sure you want to delete this story? This will also delete all associated translations. This action cannot be undone.')) {
        const storyId = userStories[index].id;

        // Remove from userStories array
        userStories.splice(index, 1);

        // Remove from stories array
        const storyIndex = stories.findIndex(s => s.id === storyId);
        if (storyIndex !== -1) {
            stories.splice(storyIndex, 1);
        }

        // Remove translations from userDictionaries
        delete userDictionaries[storyId];

        // Update localStorage
        localStorage.setItem('userStories', JSON.stringify(userStories));
        localStorage.setItem('userDictionaries', JSON.stringify(userDictionaries));

        // Update UI
        loadUserStories();
        if (currentPage === 'home' || currentPage === 'addStories') {
            renderStories();
        }

        showNotification('Story and translations deleted successfully.', 'success');
    }
}

function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file && file.type === 'application/json') {
        displaySelectedFile(file);
    } else {
        showNotification('Please select a valid JSON file.', 'error');
    }
}

function handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    const uploadArea = document.getElementById('uploadArea');
    if (uploadArea) {
        uploadArea.style.borderColor = 'var(--primary-dark)';
        uploadArea.style.background = 'rgba(255, 255, 255, 0.3)';
    }
}

function handleDragLeave(e) {
    e.preventDefault();
    e.stopPropagation();
    const uploadArea = document.getElementById('uploadArea');
    if (uploadArea) {
        uploadArea.style.borderColor = 'var(--primary)';
        uploadArea.style.background = 'rgba(255, 255, 255, 0.1)';
    }
}

function handleFileDrop(e) {
    e.preventDefault();
    e.stopPropagation();

    const uploadArea = document.getElementById('uploadArea');
    if (uploadArea) {
        uploadArea.style.borderColor = 'var(--primary)';
        uploadArea.style.background = 'rgba(255, 255, 255, 0.1)';
    }

    const files = e.dataTransfer.files;
    if (files.length > 0) {
        const file = files[0];
        if (file.type === 'application/json') {
            displaySelectedFile(file);
        } else {
            showNotification('Please drop a valid JSON file.', 'error');
        }
    }
}

function displaySelectedFile(file) {
    const selectedFileInfo = document.getElementById('selectedFileInfo');
    const fileName = document.getElementById('fileName');
    const fileSize = document.getElementById('fileSize');
    const uploadBtn = document.getElementById('uploadBtn');

    if (selectedFileInfo && fileName && fileSize && uploadBtn) {
        fileName.textContent = file.name;
        fileSize.textContent = formatFileSize(file.size);
        selectedFileInfo.style.display = 'block';
        uploadBtn.disabled = false;
    }
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function clearSelectedFile() {
    const storyFileInput = document.getElementById('storyFileInput');
    const selectedFileInfo = document.getElementById('selectedFileInfo');
    const uploadBtn = document.getElementById('uploadBtn');

    if (storyFileInput && selectedFileInfo && uploadBtn) {
        storyFileInput.value = '';
        selectedFileInfo.style.display = 'none';
        uploadBtn.disabled = true;
    }
}

function uploadStoryFile() {
    const storyFileInput = document.getElementById('storyFileInput');
    if (!storyFileInput || !storyFileInput.files[0]) return;

    const file = storyFileInput.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
        try {
            const storyData = JSON.parse(e.target.result);
            processStoryData(storyData, file.name);
        } catch (error) {
            showNotification('Error parsing JSON file: ' + error.message, 'error');
        }
    };

    reader.onerror = function () {
        showNotification('Error reading file.', 'error');
    };

    reader.readAsText(file);
}

function validateStory(story) {
    const requiredFields = ['title', 'level', 'content'];

    // Check required fields
    for (const field of requiredFields) {
        if (!story[field]) {
            return false;
        }
    }

    // Check content is array
    if (!Array.isArray(story.content) || story.content.length === 0) {
        return false;
    }

    // Check level is valid
    const validLevels = ['beginner', 'intermediate', 'advanced'];
    if (!validLevels.includes(story.level)) {
        return false;
    }

    return true;
}

function handleFormSubmit(e) {
    e.preventDefault();

    const title = document.getElementById('storyTitle').value.trim();
    const level = document.getElementById('storyLevel').value;
    const cover = document.getElementById('storyCover').value.trim() || '📚';
    const coverType = document.getElementById('storyCoverType').value;
    const contentText = document.getElementById('storyContent').value.trim();
    const author = document.getElementById('storyAuthor').value.trim();
    const translationsText = document.getElementById('storyTranslations').value.trim();

    if (!title || !level || !contentText) {
        showNotification('Please fill in all required fields.', 'error');
        return;
    }

    // Split content into paragraphs
    const content = contentText.split('\n').filter(line => line.trim() !== '');

    // Create story object
    const storyData = {
        title: title,
        level: level,
        cover: cover,
        coverType: coverType,
        content: content,
        author: author || '',
        tags: ['custom']
    };

    // Add translations if provided
    if (translationsText) {
        try {
            const translations = JSON.parse(translationsText);
            storyData.translations = translations;
        } catch (error) {
            showNotification('Invalid translations format. Please check the JSON syntax.', 'error');
            return;
        }
    }

    // Process the story
    processStoryData(storyData, 'manual_entry.json');

    // Reset form
    e.target.reset();
    document.getElementById('storyCover').value = '📚';
}

function showStoryPreview() {
    const title = document.getElementById('storyTitle').value.trim();
    const level = document.getElementById('storyLevel').value;
    const cover = document.getElementById('storyCover').value.trim() || '📚';
    const coverType = document.getElementById('storyCoverType').value;
    const contentText = document.getElementById('storyContent').value.trim();
    const author = document.getElementById('storyAuthor').value.trim();
    const translationsText = document.getElementById('storyTranslations').value.trim();

    if (!title || !level || !contentText) {
        showNotification('Please fill in all required fields to preview.', 'error');
        return;
    }

    // Update preview modal
    document.getElementById('previewTitle').textContent = title;
    document.getElementById('previewLevel').textContent = level;
    document.getElementById('previewLevel').className = `preview-level ${level}`;

    if (coverType === 'emoji') {
        document.getElementById('previewCoverDisplay').textContent = cover;
        document.getElementById('previewCoverDisplay').innerHTML = cover;
    } else {
        document.getElementById('previewCoverDisplay').innerHTML = `<i class="${cover}"></i>`;
    }

    // Calculate word count
    const content = contentText.split('\n').filter(line => line.trim() !== '');
    const wordCount = calculateWordCount(content);
    document.getElementById('previewWordCount').textContent = wordCount;

    // Display author
    document.getElementById('previewAuthor').textContent = author || 'Anonymous';

    // Display content
    const previewText = document.getElementById('previewText');
    previewText.innerHTML = content.map(para => `<p>${para}</p>`).join('');

    // Display translations if any
    const translationsSection = document.getElementById('previewTranslationsSection');
    const translationsList = document.getElementById('previewTranslationsList');

    if (translationsText) {
        try {
            const translations = JSON.parse(translationsText);
            const translationCount = Object.keys(translations).length;

            translationsList.innerHTML = '';
            for (const [word, data] of Object.entries(translations)) {
                const translation = typeof data === 'string' ? data : (data.translation || 'No translation');
                const item = document.createElement('div');
                item.className = 'translation-item';
                item.innerHTML = `
                    <span class="translation-word">${word}</span>
                    <span class="translation-meaning">${translation}</span>
                `;
                translationsList.appendChild(item);
            }

            const countElement = document.createElement('div');
            countElement.className = 'translation-count';
            countElement.textContent = `${translationCount} custom translation${translationCount !== 1 ? 's' : ''}`;
            translationsList.appendChild(countElement);

            translationsSection.style.display = 'block';
        } catch (error) {
            translationsSection.style.display = 'none';
        }
    } else {
        translationsSection.style.display = 'none';
    }

    // Show modal
    document.getElementById('previewModal').classList.add('show');
}

function closePreviewModal() {
    document.getElementById('previewModal').classList.remove('show');
}

function saveStoryFromPreview() {
    handleFormSubmit(new Event('submit'));
    closePreviewModal();
}

function downloadStoryTemplate() {
    const template = {
        "title": "My Custom Story",
        "level": "intermediate",
        "cover": "📚",
        "coverType": "emoji",
        "content": [
            "Hello and welcome to <span class='mark'>IStories!</span> This website was created by Ammar Chacal to help people learn languages in a fun and engaging way <img src='../../imges/cover.jpg' alt='Example' >  Through these interactive stories, you can improve your vocabulary and comprehension skills naturally.",
            "Each story is designed for different learning levels - beginner, intermediate, and advanced. The beginner stories use simple words and short sentences, perfect for those just starting their language learning journey.",
            "As you read, you can click on any word to see its translation and definition. This feature helps you learn new vocabulary in context, which is much more effective than memorizing word lists.",
            "The stories cover various topics and genres, from everyday situations to exciting adventures. This variety ensures that you encounter different types of vocabulary and sentence structures.",
            "Reading regularly is one of the best ways to improve your language skills. With IStories, you can practice reading comprehension while enjoying interesting narratives.",
            "Remember that learning a language takes time and patience. Don't worry if you don't understand every word at first. Use the click-to-translate feature and try to understand the general meaning of each paragraph.",
            "We recommend reading one story each day and reviewing the vocabulary you learn. Consistent practice is the key to making progress in any language.",
            "Thank you for choosing IStories for your language learning journey. We hope you enjoy these stories and find them helpful in achieving your language goals."
        ],
        "author": "Istories",
        "translations": {
            "hello": { "translation": "مرحبا" },
            "world": { "translation": "عالم" },
            "book": { "translation": "كتاب" }
        },
        "description": "A short description of your story",
        "tags": ["custom", "learning"]
    };

    const templateStr = JSON.stringify(template, null, 2);
    const blob = new Blob([templateStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'story-template.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showNotification('Template downloaded successfully!', 'success');
}

function copyJsonExample() {
    const jsonExample = document.getElementById('jsonExample').textContent;
    navigator.clipboard.writeText(jsonExample)
        .then(() => showNotification('JSON example copied to clipboard!', 'success'))
        .catch(err => showNotification('Failed to copy: ' + err, 'error'));
}

function loadExampleTranslations() {
    const exampleTranslations = {
        "hello": { "translation": "مرحبا" },
        "world": { "translation": "عالم" },
        "book": { "translation": "كتاب" }
    };

    document.getElementById('storyTranslations').value = JSON.stringify(exampleTranslations, null, 2);
    showNotification('Example translations loaded!', 'success');
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
    
    /* Story card button styles */
    .story-actions {
        display: flex;
        gap: 10px;
        margin-top: 15px;
    }
    
    .story-action-btn {
        flex: 1;
        padding: 10px;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-size: 0.9rem;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        transition: all 0.2s ease;
    }
    
    .save-story-btn {
        background: var(--primary);
        color: white;
    }
    
    .save-story-btn:hover:not(:disabled) {
        background: var(--primary-dark);
    }
    
    .save-story-btn:disabled {
        background: #4CAF50;
        cursor: not-allowed;
        opacity: 0.8;
    }
    
    .download-btn {
        background: var(--secondary);
        color: white;
    }
    
    .download-btn:hover {
        background: var(--secondary-dark);
    }
    
    .story-action-btn.loading {
        opacity: 0.7;
        cursor: wait;
    }
    
    .story-action-btn i {
        font-size: 0.9rem;
    }
    
    .user-story-badge {
        background: #ff9800;
        color: white;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 0.8rem;
        margin-left: 8px;
    }
`;
document.head.appendChild(style);

// ========= Initialize App ==========
document.addEventListener('DOMContentLoaded', function () {
    init();
});