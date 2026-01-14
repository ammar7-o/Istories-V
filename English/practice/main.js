// Flashcard DOM elements
const flashcard = document.getElementById('flashcard');
const flashcardWord = document.getElementById('flashcardWord');
const flashcardTranslation = document.getElementById('flashcardTranslation');
const flashcardStory = document.getElementById('flashcardStory');
const cardAgain = document.getElementById('cardAgain');
const cardHard = document.getElementById('cardHard');
const cardGood = document.getElementById('cardGood');
const cardEasy = document.getElementById('cardEasy');
const shuffleCards = document.getElementById('shuffleCards');
const resetProgress = document.getElementById('resetProgress');
const progressText = document.getElementById('progressText');
const progressFill = document.getElementById('progressFill');

// Flashcard statistics elements
const dueCards = document.getElementById('dueCards');
const totalCards = document.getElementById('totalCards');
const masteredCards = document.getElementById('masteredCards');
const learningCards = document.getElementById('learningCards');

// Navigation elements
const pages = document.querySelectorAll('.page');
const navLinks = document.querySelectorAll('.nav-link');

// Settings elements
const settingsButton = document.getElementById("settings-button");
const settingsPage = document.getElementById("settings-page");
const closeSettings = document.getElementById("close-settings");
const settingsOverlay = document.getElementById("settings-overlay");
const themeToggle = document.getElementById('themeToggle');

// App state
let currentPage = 'home';
let savedWords = JSON.parse(localStorage.getItem('savedWords')) || [];

// Color settings
let selectedColor = localStorage.getItem('selectedColor') || '#4f46e5';
let selectedSecondaryColor = localStorage.getItem('selectedSecondaryColor') || '#10b981';

// Flashcard system variables
let currentCards = [];
let currentCardIndex = 0;
let cardsReviewed = 0;
let sessionCards = [];
 // Navigation menu elements
const toggleNav = document.getElementById("toggle-nav");
const more = document.getElementById("more");

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
// =============== THEME & COLOR FUNCTIONS ===============
// Theme functions using .dark-mode class on body (matches your CSS)

function toggleTheme() {
    const isDarkMode = document.body.classList.contains('dark-mode');
    const newTheme = isDarkMode ? 'light' : 'dark';
    
    console.log('Toggling theme from', isDarkMode ? 'dark' : 'light', 'to', newTheme);
    
    // Update body class
    if (newTheme === 'dark') {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }
    
    // Save to localStorage
    localStorage.setItem('theme', newTheme);
    console.log('Theme saved to localStorage:', newTheme);
    
    // Update theme toggle icon
    if (themeToggle) {
        const icon = themeToggle.querySelector('i');
        if (icon) {
            icon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
    }
    
    // Re-apply colors for the new theme
    applyPrimaryColor(selectedColor);
    applySecondaryColor(selectedSecondaryColor);
    
    // Show notification
    showNotification(`Switched to ${newTheme} mode`, 'success');
}

function applyTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    console.log('Applying theme from localStorage:', savedTheme);
    
    // Apply to body class
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        console.log('Added dark-mode class to body');
    } else {
        document.body.classList.remove('dark-mode');
        console.log('Removed dark-mode class from body');
    }
    
    // Update theme toggle icon
    if (themeToggle) {
        const icon = themeToggle.querySelector('i');
        if (icon) {
            icon.className = savedTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
            console.log('Updated theme icon to:', icon.className);
        }
    }
}

function initColorSelector() {
    const colorOptions = document.querySelectorAll('.color-option:not(.custom-color)');
    const customColorPicker = document.getElementById('customColorPicker');

    console.log('Initializing color selector...');
    console.log('Found color options:', colorOptions.length);

    // Remove active class from all options first
    colorOptions.forEach(opt => opt.classList.remove('active'));

    // Set active color based on saved preference
    if (colorOptions.length > 0) {
        colorOptions.forEach(option => {
            // Check if this option matches the saved color
            if (option.dataset.color === selectedColor) {
                option.classList.add('active');
                console.log('Setting active color option:', selectedColor);
            }

            option.addEventListener('click', () => {
                console.log('Color option clicked:', option.dataset.color);

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
                
                showNotification('Primary color updated!', 'success');
            });
        });
    }

    // Custom color picker
    if (customColorPicker) {
        console.log('Custom color picker found');

        // Set initial value from saved color
        customColorPicker.value = selectedColor;

        customColorPicker.addEventListener('input', (e) => {
            const color = e.target.value;
            console.log('Custom color input:', color);

            // Remove active class from preset colors
            colorOptions.forEach(opt => opt.classList.remove('active'));

            // Apply ONLY the primary color
            applyPrimaryColor(color);

            // Save to localStorage
            localStorage.setItem('selectedColor', color);
            selectedColor = color;
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
}

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
                
                showNotification('Secondary color updated!', 'success');
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
}

function applyPrimaryColor(color) {
    // Calculate darker shade for --primary-dark
    const darkerColor = adjustColor(color, -20);

    // Update ONLY the primary color variables in CSS
    const root = document.documentElement;
    root.style.setProperty('--primary', color);
    root.style.setProperty('--primary-dark', darkerColor);
    
    console.log('Applied primary color:', color, 'Dark variant:', darkerColor);
}

function applySecondaryColor(color) {
    // Calculate darker and lighter shades
    const darkerColor = adjustColor(color, -20);
    const lighterColor = adjustColor(color, 20);

    // Update ONLY the secondary color variables in CSS
    const root = document.documentElement;
    root.style.setProperty('--secondary', color);
    root.style.setProperty('--secondary-dark', darkerColor);
    root.style.setProperty('--secondary-light', lighterColor);
    
    console.log('Applied secondary color:', color, 'Dark variant:', darkerColor, 'Light variant:', lighterColor);
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

// =============== NAVIGATION FUNCTIONS ===============
function switchPage(page) {
    currentPage = page;
    pages.forEach(p => p.classList.remove('active'));
    document.getElementById(page).classList.add('active');

    navLinks.forEach(link => {
        if (link.dataset.page === page) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // Refresh flashcards when switching to flashcards page
    if (page === 'flashcards') {
        loadFlashcards();
    }
    
    // Scroll to top when switching pages
    scrollToTop();
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// =============== SETTINGS FUNCTIONS ===============
function setupSettings() {
    // Settings toggle
    if (settingsButton) {
        settingsButton.addEventListener("click", function () {
            settingsPage.classList.toggle("open");
            settingsOverlay.classList.add("active");
        });
    }

    if (closeSettings) {
        closeSettings.addEventListener("click", function () {
            settingsPage.classList.remove("open");
            settingsOverlay.classList.remove("active");
        });
    }

    if (settingsOverlay) {
        settingsOverlay.addEventListener("click", function () {
            settingsPage.classList.remove("open");
            settingsOverlay.classList.remove("active");
        });
    }

    // Close settings on Escape key
    document.addEventListener("keydown", function (e) {
        if (e.key === 'Escape' && settingsPage.classList.contains("open")) {
            settingsPage.classList.remove("open");
            settingsOverlay.classList.remove("active");
        }
    });

    // Theme toggle listener
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
}

// =============== FLASHCARD FUNCTIONS ===============
function initFlashcards() {
    updateFlashcardStats();
    setupFlashcardListeners();
}

function loadFlashcards() {
    // Filter words that need review
    currentCards = savedWords.filter(word => {
        // If no nextReview date, it's due
        if (!word.nextReview) return true;

        // Check if review is due
        return new Date(word.nextReview) <= new Date();
    });

    // Initialize session
    sessionCards = [...currentCards];
    currentCardIndex = 0;
    cardsReviewed = 0;

    if (sessionCards.length > 0) {
        loadCard(0);
        enableCardButtons(true);
    } else {
        showNoCardsMessage();
        enableCardButtons(false);
    }

    updateProgress();
    updateFlashcardStats();
}

function loadCard(index) {
    if (index >= sessionCards.length) {
        showSessionComplete();
        return;
    }

    const card = sessionCards[index];

    // Format dates
    const formatDate = (dateString, short = false) => {
        if (!dateString) return 'Not set';
        const date = new Date(dateString);
        if (short) {
            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
            });
        }
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const dateValue = card.addedDate || card.added || card.date || new Date().toISOString();
    const addedDate = formatDate(dateValue);

    // Front side (word)
    flashcardWord.textContent = card.word;
    flashcardTranslation.textContent = card.translation || "No translation available";

    // Back side details with dates
    flashcardStory.innerHTML = `
        <div class="card-dates">
            <div style="margin-bottom: 10px;">
                <div style="font-weight: 600; color: var(--text-color); margin-bottom: 5px;">
                    <i class="fas fa-book" style="margin-right: 8px;"></i>
                    ${card.story ? `From: ${card.story}` : "Unknown Story"}
                </div>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 10px; margin-top: 10px;">
                    ${dateValue ? `
                        <div class="date-item">
                            <div style="font-size: 0.75rem; color: var(--text-light); margin-bottom: 2px;">
                                <i class="far fa-calendar-plus"></i> Added
                            </div>
                            <div style="font-size: 0.85rem; font-weight: 500;">
                                ${addedDate}
                            </div>
                        </div>
                    ` : ''}
                    
                    ${card.lastViewed ? `
                        <div class="date-item">
                            <div style="font-size: 0.75rem; color: var(--text-light); margin-bottom: 2px;">
                                <i class="far fa-eye"></i> Last Viewed
                            </div>
                            <div style="font-size: 0.85rem; font-weight: 500;">
                                ${formatDate(card.lastViewed, true)}
                            </div>
                        </div>
                    ` : ''}
                    
                    ${card.timesViewed ? `
                        <div class="date-item">
                            <div style="font-size: 0.75rem; color: var(--text-light); margin-bottom: 2px;">
                                <i class="fas fa-history"></i> Views
                            </div>
                            <div style="font-size: 0.85rem; font-weight: 500;">
                                ${card.timesViewed} times
                            </div>
                        </div>
                    ` : ''}
                </div>
            </div>
        </div>
    `;

    // Reset card to front side
    flashcard.classList.remove('flipped');
    updateProgress();
}

function showNoCardsMessage() {
    flashcardWord.textContent = "No cards available";
    flashcardTranslation.textContent = "Add words to practice";
    flashcardStory.textContent = "Save words to practice them here";

    progressText.textContent = "0/0";
    progressFill.style.width = "0%";
}

function showSessionComplete() {
    flashcardWord.textContent = "Session Complete! 🎉";
    flashcardTranslation.textContent = "Great job!";
    flashcardStory.textContent = `You reviewed ${cardsReviewed} cards`;

    progressText.textContent = `${cardsReviewed}/${cardsReviewed}`;
    progressFill.style.width = "100%";

    enableCardButtons(false);
}

function updateProgress() {
    const total = sessionCards.length;
    const reviewed = cardsReviewed;

    progressText.textContent = `${reviewed}/${total}`;

    if (total > 0) {
        const percentage = (reviewed / total) * 100;
        progressFill.style.width = `${percentage}%`;
    } else {
        progressFill.style.width = "0%";
    }
}

function updateFlashcardStats() {
    const total = savedWords.length;
    const due = savedWords.filter(word => {
        if (!word.nextReview) return true;
        return new Date(word.nextReview) <= new Date();
    }).length;

    const mastered = savedWords.filter(word => word.status === 'known').length;
    const learning = savedWords.filter(word => word.status === 'saved').length;

    dueCards.textContent = due;
    totalCards.textContent = total;
    masteredCards.textContent = mastered;
    learningCards.textContent = learning;
}

function setupFlashcardListeners() {
    // Flip card
    if (flashcard) {
        flashcard.addEventListener('click', function (e) {
            if (e.target.closest('button')) return;
            if (sessionCards.length === 0) return;

            flashcard.classList.toggle('flipped');
        });
    }

    // Review buttons
    if (cardAgain) {
        cardAgain.addEventListener('click', (e) => {
            e.stopPropagation();
            reviewCard(1);
        });
    }

    if (cardHard) {
        cardHard.addEventListener('click', (e) => {
            e.stopPropagation();
            reviewCard(3);
        });
    }

    if (cardGood) {
        cardGood.addEventListener('click', (e) => {
            e.stopPropagation();
            reviewCard(7);
        });
    }

    if (cardEasy) {
        cardEasy.addEventListener('click', (e) => {
            e.stopPropagation();
            reviewCard(14);
        });
    }

    // Control buttons
    if (shuffleCards) {
        shuffleCards.addEventListener('click', (e) => {
            e.stopPropagation();
            shuffleFlashcards();
        });
    }

    if (resetProgress) {
        resetProgress.addEventListener('click', (e) => {
            e.stopPropagation();
            resetCardProgress();
        });
    }
}

function reviewCard(daysToAdd) {
    if (currentCardIndex >= sessionCards.length) return;

    const card = sessionCards[currentCardIndex];

    // Update card in savedWords
    const wordIndex = savedWords.findIndex(w => w.word === card.word);
    if (wordIndex !== -1) {
        // Calculate next review date
        const nextReviewDate = new Date();
        nextReviewDate.setDate(nextReviewDate.getDate() + daysToAdd);

        savedWords[wordIndex].nextReview = nextReviewDate.toISOString();

        // If marked "Again", reset to learning
        if (daysToAdd === 1) {
            savedWords[wordIndex].status = 'saved';
        }
        // If marked "Easy", mark as mastered
        else if (daysToAdd === 14) {
            savedWords[wordIndex].status = 'known';
            savedWords[wordIndex].mastered = new Date().toISOString();
        }

        // Save to localStorage
        localStorage.setItem('savedWords', JSON.stringify(savedWords));
        console.log('Saved word review to localStorage');
    }

    // Move to next card
    cardsReviewed++;
    currentCardIndex++;

    if (currentCardIndex < sessionCards.length) {
        loadCard(currentCardIndex);
    } else {
        showSessionComplete();
    }

    // Update stats
    updateFlashcardStats();
}

function enableCardButtons(enabled) {
    const buttons = [cardAgain, cardHard, cardGood, cardEasy];
    buttons.forEach(btn => {
        if (btn) btn.disabled = !enabled;
    });
}

function shuffleFlashcards() {
    if (sessionCards.length > 0) {
        // Fisher-Yates shuffle algorithm
        for (let i = sessionCards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [sessionCards[i], sessionCards[j]] = [sessionCards[j], sessionCards[i]];
        }

        currentCardIndex = 0;
        cardsReviewed = 0;
        loadCard(currentCardIndex);

        showNotification('Cards shuffled!');
    }
}

function resetCardProgress() {
    const confirmed = confirm("Reset all card progress? This will set all words back to 'due' status.");

    if (confirmed) {
        savedWords.forEach(word => {
            word.nextReview = new Date().toISOString();
            word.status = 'saved';
            delete word.mastered;
        });

        localStorage.setItem('savedWords', JSON.stringify(savedWords));
        console.log('Reset card progress in localStorage');

        loadFlashcards();
        updateFlashcardStats();
        showNotification('Card progress reset!');
    }
}

// =============== UTILITY FUNCTIONS ===============
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

// =============== INITIALIZATION ===============
function init() {
    console.log('App initialization started...');
    
    // Apply saved theme
    applyTheme();
    
    // Apply saved colors
    applyPrimaryColor(selectedColor);
    applySecondaryColor(selectedSecondaryColor);
    
    // Set up navigation
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            switchPage(link.dataset.page);
        });
    });
    // Set up navigation menu toggle
    setupNavToggle();
    // Set up settings
    setupSettings();
    
    // Initialize color selectors
    setTimeout(() => {
        initColorSelector();
        initSecondaryColorSelector();
    }, 50);
    
    // Initialize flashcards
    if (typeof initFlashcards === 'function') {
        initFlashcards();
    }
    
    console.log('App initialization complete!');
    console.log('Current localStorage theme:', localStorage.getItem('theme'));
    console.log('Current localStorage primary color:', localStorage.getItem('selectedColor'));
    console.log('Current localStorage secondary color:', localStorage.getItem('selectedSecondaryColor'));
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);