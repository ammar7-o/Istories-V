// Flashcard DOM elements
const flashcard = document.getElementById('flashcard');
const flashcardWord = document.getElementById('flashcardWord');
const flashcardTranslation = document.getElementById('flashcardTranslation');
const flashcardStory = document.getElementById('flashcardStory');
const flashcardLangBadge = document.getElementById('flashcardLangBadge');
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
// IndexedDB is async: refresh this once storage is ready (before DOMContentLoaded init runs).
if (window.IStoriesStorage) IStoriesStorage.whenReady(function () {
    savedWords = JSON.parse(localStorage.getItem('savedWords')) || [];
});
let speechEnabled = localStorage.getItem('speechEnabled') !== 'false'; // Default enabled (true)

// Color settings
let selectedColor = localStorage.getItem('selectedColor') || '#09d9ba';
let selectedSecondaryColor = localStorage.getItem('selectedSecondaryColor') || '#007ce1';

// Flashcard system variables
let currentCards = [];
let currentCardIndex = 0;
let cardsReviewed = 0;
let sessionCards = [];

// Language filter state (which language deck to practise)
let currentCardLang = 'all';
let flashcardLangSignature = null;
// Navigation menu elements
const toggleNav = document.getElementById("toggle-nav");
const more = document.getElementById("more");

// Navigation menu state
let isMenuOpen = false;

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

    // // Show notification
    // showNotification(`Switched to ${newTheme} mode`, 'success');
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

                // showNotification('Secondary color updated!', 'success');
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

// =============== SETTINGS FUNCTIONS ===============
function setupSettings() {
    // The in-page settings drawer was removed: settings now live on the central
    // Settings page and the header gear links there. Nothing to wire unless the
    // drawer markup is actually present.
    if (!settingsPage || !closeSettings || !settingsOverlay) return;

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
    setupFlashcardLangFilter();
    loadFlashcards();
}

// =============== LANGUAGE FILTER ===============

// Language code for a saved word / card (shared helper from nav/common.js).
function cardLang(word) {
    if (typeof wordLang === 'function') return wordLang(word);
    return (word && word.language) ? String(word.language).toLowerCase().split('-')[0] : 'en';
}

function cardLangOrder(code) {
    const i = (typeof IST_LANGUAGE_ORDER !== 'undefined') ? IST_LANGUAGE_ORDER.indexOf(code) : -1;
    return i === -1 ? 999 : i;
}

// (Re)build the language <option> list from the languages actually saved.
function populateFlashcardLangFilter() {
    const sel = document.getElementById('flashcardLangFilter');
    if (!sel) return;

    const counts = {};
    savedWords.forEach(w => {
        const code = cardLang(w);
        counts[code] = (counts[code] || 0) + 1;
    });

    const codes = Object.keys(counts).sort((a, b) => cardLangOrder(a) - cardLangOrder(b));
    const signature = codes.map(c => c + ':' + counts[c]).join(',') + '|' + savedWords.length;

    let html = `<option value="all">🌍 All languages (${savedWords.length})</option>`;
    codes.forEach(code => {
        html += `<option value="${code}">${langFlag(code)} ${langDisplayName(code)} (${counts[code]})</option>`;
    });

    if (signature !== flashcardLangSignature) {
        flashcardLangSignature = signature;
        sel.innerHTML = html;
        if (currentCardLang === 'all' || codes.indexOf(currentCardLang) !== -1) {
            sel.value = currentCardLang;
        } else {
            currentCardLang = 'all';
            sel.value = 'all';
        }
    }

    updateFlashcardLangIndicator(counts, codes);
}

function updateFlashcardLangIndicator(counts, codes) {
    const el = document.getElementById('flashcardLangIndicator');
    if (!el) return;
    if (!savedWords.length) { el.textContent = ''; return; }

    counts = counts || {};
    codes = codes || Object.keys(counts);
    const due = sessionCards.length;

    if (currentCardLang === 'all') {
        el.innerHTML = `<i class="fas fa-layer-group"></i> ${due} card${due === 1 ? '' : 's'} · ${codes.length} language${codes.length === 1 ? '' : 's'}`;
    } else {
        el.innerHTML = `${langFlag(currentCardLang)} ${langDisplayName(currentCardLang)} · ${due} card${due === 1 ? '' : 's'}`;
    }
}

function setupFlashcardLangFilter() {
    const sel = document.getElementById('flashcardLangFilter');
    if (!sel || sel.dataset.bound === 'true') return;
    sel.dataset.bound = 'true';
    sel.addEventListener('change', function () {
        currentCardLang = sel.value;
        loadFlashcards();
    });
}

function loadFlashcards() {
    // Only words that are due for review...
    currentCards = savedWords.filter(word => {
        // ...unless no nextReview date, then it's due
        if (word.nextReview && new Date(word.nextReview) > new Date()) return false;
        return true;
    });

    // ...and, if a language is selected, only words in that language.
    if (currentCardLang !== 'all') {
        currentCards = currentCards.filter(word => cardLang(word) === currentCardLang);
    }

    // Initialize session
    sessionCards = [...currentCards];
    currentCardIndex = 0;
    cardsReviewed = 0;

    populateFlashcardLangFilter();

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

    // Language indicator for this card
    if (flashcardLangBadge) {
        const code = cardLang(card);
        flashcardLangBadge.textContent = `${langFlag(code)} ${langDisplayName(code)}`;
        flashcardLangBadge.hidden = false;
    }

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

    // Add speech button after card loads
    setTimeout(() => {
        addSpeechButtonToCard();
    }, 50);
}

function showNoCardsMessage() {
    flashcardWord.textContent = "No cards available";
    if (currentCardLang !== 'all') {
        flashcardTranslation.textContent = `No ${langDisplayName(currentCardLang)} cards`;
        flashcardStory.textContent = `You don't have any ${langDisplayName(currentCardLang)} words to practise yet`;
    } else {
        flashcardTranslation.textContent = "Add words to practice";
        flashcardStory.textContent = "Save words to practice them here";
    }

    if (flashcardLangBadge) flashcardLangBadge.hidden = true;

    progressText.textContent = "0/0";
    progressFill.style.width = "0%";

    updateFlashcardLangIndicator();
}

function showSessionComplete() {
    flashcardWord.textContent = "Session Complete! 🎉";
    flashcardTranslation.textContent = "Great job!";

    if (flashcardLangBadge) flashcardLangBadge.hidden = true;

    // Calculate bonus XP based on cards reviewed
    const bonusXP = Math.min(cardsReviewed * 2, 15); // 2 XP per card, max 15
    addXP(bonusXP, 'Session completion');

    flashcardStory.textContent = `You reviewed ${cardsReviewed} cards (+${bonusXP} XP bonus)`;

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
    // Flip card - Improved click handling
    if (flashcard) {
        flashcard.addEventListener('click', function (e) {
            // Don't flip if clicking on any button element
            if (e.target.tagName === 'BUTTON' ||
                e.target.closest('button') ||
                e.target.closest('.flashcard-speech-btn') ||
                e.target.classList.contains('fa-volume-up') ||
                e.target.classList.contains('fa-spinner')) {
                return;
            }
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

    // Award XP based on difficulty
    let xpAmount = 0;
    switch (daysToAdd) {
        case 1: // Again
            xpAmount = 0;
            break;
        case 3: // Hard
            xpAmount = 1;
            break;
        case 7: // Good
            xpAmount = 2;
            break;
        case 14: // Easy
            xpAmount = 3;
            break;
    }

    // Add XP for reviewing the card
    addXP(xpAmount, 'Flashcard review');

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
// Add XP function
function addXP(amount, reason = '') {
    // Get user stats from localStorage
    let userStats = JSON.parse(localStorage.getItem('userStats')) || {
        xp: 0,
        wordsLearned: 0,
        lvl: 1,
        streakDays: 0,
        lastActiveDate: null,
        totalXP: 0
    };

    // Add XP
    userStats.xp += amount;
    userStats.totalXP += amount;

    // Check for level up (every 100 XP = 1 level)
    const oldLevel = Math.floor((userStats.totalXP - amount) / 170) + 1;
    const newLevel = Math.floor(userStats.totalXP / 170) + 1;
    if (newLevel > oldLevel) {
        showNotification(`🎉 Level Up! You reached level ${newLevel}!`, 'success');
    }

    // Save to localStorage
    localStorage.setItem('userStats', JSON.stringify(userStats));


    console.log(`Added ${amount} XP${reason ? ' for: ' + reason : ''}`);
}
// ==============speach ==========================
// Initialize speech
function initSpeech() {
    // Setup speech toggle
    setupSpeechToggle();
}

// Setup speech toggle button
function setupSpeechToggle() {
    const speechToggle = document.getElementById('speechToggle');
    if (!speechToggle) return;

    // Set initial state
    updateSpeechToggle();

    // Add click event
    speechToggle.addEventListener('click', toggleSpeech);
}


// Update speech toggle button
function updateSpeechToggle() {
    const speechToggle = document.getElementById('speechToggle');
    if (!speechToggle) return;

    const icon = speechToggle.querySelector('i');
    if (speechEnabled) {
        speechToggle.classList.add('active');
        if (icon) icon.className = 'fas fa-volume-up';
    } else {
        speechToggle.classList.remove('active');
        if (icon) icon.className = 'fas fa-volume-mute';
    }
}


// Toggle speech on/off
function toggleSpeech() {
    speechEnabled = !speechEnabled;

    // Save to localStorage
    localStorage.setItem('speechEnabled', speechEnabled);

    // Update UI
    updateSpeechToggle();

    // Show notification
    showNotification(speechEnabled ?
        'Text-to-speech enabled' :
        'Text-to-speech disabled'
    );

    // Update flashcard if on that page
    if (currentPage === 'home') {
        addSpeechButtonToCard();
    }
}
function resetTTSButton() {
    const ttsBtn = document.getElementById('flashcardSpeechBtn');
    if (ttsBtn) {
        const icon = ttsBtn.querySelector('i');
        if (icon) {
            icon.className = 'fas fa-volume-up';
        }
        ttsBtn.disabled = false;
    }
}

function useNativeSpeechSynthesis(text, language = 'en-US') {
    if (!('speechSynthesis' in window)) return false;

    speechSynthesis.cancel();

    // Short codes ("fr") -> BCP-47 ("fr-FR") so a matching voice can be found.
    const locale = (typeof langToLocale === 'function') ? langToLocale(language) : language;
    const base = String(locale).split('-')[0].toLowerCase();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = locale;
    utterance.rate = 0.95;
    utterance.pitch = 1.05;
    utterance.volume = 1;

    const voices = speechSynthesis.getVoices();
    if (voices.length) {
        const voice =
            voices.find(v => v.lang === locale && /google/i.test(v.name)) ||
            voices.find(v => v.lang.replace('_', '-').toLowerCase() === locale.toLowerCase()) ||
            voices.find(v => v.lang.replace('_', '-').toLowerCase().startsWith(base + '-')) ||
            voices.find(v => v.lang.replace('_', '-').toLowerCase() === base) ||
            null;
        // Never fall back to voices[0]: that is usually English and would read
        // French/Spanish/etc. text with English pronunciation.
        if (voice) utterance.voice = voice;
    }

    utterance.onend = resetTTSButton;
    utterance.onerror = resetTTSButton;

    speechSynthesis.speak(utterance);
    return true;
}
// Load available voices
function loadVoices() {
    if (!('speechSynthesis' in window)) return;

    let voices = window.speechSynthesis.getVoices();
    if (voices.length === 0) {
        window.speechSynthesis.onvoiceschanged = () => {
            voices = window.speechSynthesis.getVoices();
            console.log('Voices loaded:', voices.length);
        };
    }
}
function playGoogleVoice(word, language = 'en') {
    if (!word || word.trim() === '') {
        showNotification('No word to speak', 'error');
        return;
    }

    const text = word.trim();

    // Show loading indicator - LOOK FOR FLASHCARD BUTTON
    const ttsBtn = document.getElementById('flashcardSpeechBtn');
    if (ttsBtn) {
        const icon = ttsBtn.querySelector('i');
        if (icon) {
            // Store original icon class for restoration
            icon.setAttribute('data-original-icon', icon.className);
            icon.className = 'fas fa-spinner fa-spin';
        }
        ttsBtn.disabled = true;
    }

    try {
        // Original Google TTS URL
        const googleTTSUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=${language}&client=tw-ob`;

        // Use YOUR Cloudflare Worker proxy
        const myProxyUrl = `https://muddy-sun-2d2f.zasmimaz.workers.dev/?url=${encodeURIComponent(googleTTSUrl)}`;

        // Create audio element and play
        const audio = new Audio(myProxyUrl);
        audio.crossOrigin = "anonymous"; // Important for CORS

        // Play the audio
        audio.play()
            .then(() => {
                console.log(`Playing TTS for: ${text} in ${language} via Cloudflare proxy`);
            })
            .catch(error => {
                console.error('TTS play failed:', error);

                // Fallback: Try browser's native speech synthesis
                if (useNativeSpeechSynthesis(text, language)) {
                    showNotification(`Using offline voice`, 'info');
                } else {
                    showNotification('This function needs Internet.', 'error');
                }
            });

        // Reset button when audio ends
        audio.onended = () => {
            resetTTSButton();
        };

        // Reset button on error
        audio.onerror = () => {
            console.error('Audio element error');
            resetTTSButton();
            showNotification('TTS playback failed', 'error');
        };

    } catch (error) {
        console.error('TTS error:', error);
        showNotification('Failed to play audio', 'error');
        resetTTSButton();
    }
}
// Note: `speakText` is provided by nav/common.js (signature: text, lang, options).
// This page previously declared its own English-only copy which shadowed that
// shared helper, so the language handed to it was ignored.

// Speak current flashcard word
function speakCurrentCard() {
    if (!speechEnabled) return;

    const currentCard = sessionCards[currentCardIndex];
    if (currentCard && currentCard.word) {
        playGoogleVoice(currentCard.word, currentCard.language || 'en');
    }
}


// Add speech button to flashcard
function addSpeechButtonToCard() {
    // Remove existing button
    const existingBtn = document.getElementById('flashcardSpeechBtn');
    if (existingBtn) existingBtn.remove();

    // Add button if speech is enabled
    if (speechEnabled && sessionCards.length > 0) {
        const speechBtn = document.createElement('button');
        speechBtn.className = 'flashcard-speech-btn';
        speechBtn.id = 'flashcardSpeechBtn';
        speechBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
        speechBtn.title = 'Speak word';

        // Add click event
        speechBtn.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            speakCurrentCard();
        });

        // Add to flashcard container (outside the card faces)
        const flashcardContainer = document.querySelector('.flashcard-container');
        if (flashcardContainer) {
            flashcardContainer.style.position = 'relative';
            flashcardContainer.appendChild(speechBtn);

            // Position the button relative to the flashcard
            const flashcard = document.querySelector('.flashcard');
            if (flashcard) {
                const cardRect = flashcard.getBoundingClientRect();
                const containerRect = flashcardContainer.getBoundingClientRect();

                // Position button at top-right of the card
                speechBtn.style.position = 'absolute';
                speechBtn.style.top = '15px';
                speechBtn.style.right = '15px';
                speechBtn.style.zIndex = '1000';
            }
        }

        // Auto-speak new card
        if (currentCardIndex < sessionCards.length) {
            setTimeout(() => speakCurrentCard(), 300);
        }
    }
}
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
    initSpeech();
    console.log('App initialization complete!');
    console.log('Current localStorage theme:', localStorage.getItem('theme'));
    console.log('Current localStorage primary color:', localStorage.getItem('selectedColor'));
    console.log('Current localStorage secondary color:', localStorage.getItem('selectedSecondaryColor'));
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);