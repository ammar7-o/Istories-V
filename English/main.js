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

// Flashcard system variables
let currentCards = [];
let currentCardIndex = 0;
let cardsReviewed = 0;
let sessionCards = [];

// =============== FLASHCARD FUNCTIONS ===============

// Initialize flashcards
function initFlashcards() {
    updateFlashcardStats();
    setupFlashcardListeners();
    // Don't load cards immediately, wait until page is shown
}

// Load flashcards from saved words
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

// Load card data
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

    const addedDate = formatDate(card.added);

    // Front side (word) with date
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
                    ${card.added ? `
                        <div class="date-item">
                            <div style="font-size: 0.75rem; color: var(--text-light); margin-bottom: 2px;">
                                <i class="far fa-calendar-plus"></i> Added
                            </div>
                            <div style="font-size: 0.85rem; font-weight: 500;">
                                ${addedDate}
                            </div>
                        </div>
                    ` : ''}
                </div>
            </div>
        </div>
    `;

    // Reset card to front side
    flashcard.classList.remove('flipped');

    // Add event listener for edit button
    setTimeout(() => {
        const editBtn = flashcardStory.querySelector('.edit-dates');
        if (editBtn) {
            editBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const cardIndex = parseInt(e.currentTarget.dataset.cardIndex);
                openFlashcardDatePicker(cardIndex);
            });
        }
    }, 100);

    // Update progress
    updateProgress();
}

// Check if review is due
function isReviewDue(dateString) {
    if (!dateString) return false;
    const reviewDate = new Date(dateString);
    const today = new Date();
    return reviewDate < today;
}

// Show no cards message
function showNoCardsMessage() {
    flashcardWord.textContent = "No cards available";
    flashcardTranslation.textContent = "Add words from stories to practice";
    flashcardStory.textContent = "Read stories and save words to practice them here";

    progressText.textContent = "0/0";
    progressFill.style.width = "0%";
}

// Show session complete message
function showSessionComplete() {
    flashcardWord.textContent = "Session Complete! 🎉";
    flashcardTranslation.textContent = "Great job!";
    flashcardStory.textContent = `You reviewed ${cardsReviewed} cards`;

    progressText.textContent = `${cardsReviewed}/${cardsReviewed}`;
    progressFill.style.width = "100%";

    enableCardButtons(false);
}

// Update progress display
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

// Update flashcard statistics
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

// Set up flashcard event listeners
// Set up flashcard event listeners
function setupFlashcardListeners() {
    console.log('Setting up flashcard listeners...');
    
    // Flip card on click
    if (flashcard) {
        console.log('Adding click listener to flashcard...');
        flashcard.addEventListener('click', function(e) {
            e.stopPropagation();
            console.log('Flashcard clicked!');
            
            if (sessionCards.length > 0) {
                this.classList.toggle('flipped');
                console.log('Flashcard flipped state:', this.classList.contains('flipped') ? 'Flipped' : 'Not flipped');
            } else {
                console.log('No cards in session');
            }
        });
    } else {
        console.error('Flashcard element not found!');
    }

    // Card review buttons - add stopPropagation to prevent flipping when clicking buttons
    if (cardAgain) {
        cardAgain.addEventListener('click', function(e) {
            e.stopPropagation();
            reviewCard(1);
        });
    }
    
    if (cardHard) {
        cardHard.addEventListener('click', function(e) {
            e.stopPropagation();
            reviewCard(3);
        });
    }
    
    if (cardGood) {
        cardGood.addEventListener('click', function(e) {
            e.stopPropagation();
            reviewCard(7);
        });
    }
    
    if (cardEasy) {
        cardEasy.addEventListener('click', function(e) {
            e.stopPropagation();
            reviewCard(14);
        });
    }

    // Control buttons
    if (shuffleCards) {
        shuffleCards.addEventListener('click', function(e) {
            e.stopPropagation();
            shuffleFlashcards();
        });
    }
    
    if (resetProgress) {
        resetProgress.addEventListener('click', function(e) {
            e.stopPropagation();
            resetCardProgress();
        });
    }
    
    console.log('Flashcard listeners set up');
}

// Review a card with spaced repetition
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
    updateStats(); // Update main stats too
}

// Enable/disable card buttons
function enableCardButtons(enabled) {
    const buttons = [cardAgain, cardHard, cardGood, cardEasy];
    buttons.forEach(btn => {
        if (btn) btn.disabled = !enabled;
    });
}

// Shuffle flashcards
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

// Reset all card progress
function resetCardProgress() {
    const confirmed = confirm("Reset all card progress? This will set all words back to 'due' status.");

    if (confirmed) {
        savedWords.forEach(word => {
            word.nextReview = new Date().toISOString();
            word.status = 'saved';
            delete word.mastered;
        });

        localStorage.setItem('savedWords', JSON.stringify(savedWords));

        loadFlashcards();
        updateFlashcardStats();
        updateStats();

        showNotification('Card progress reset!');
    }
}

// =============== END FLASHCARD FUNCTIONS ===============

// ============== Start vocabulary functions =================

// Render vocabulary list
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

        const displayWord = word.originalWord || word.word;

        const translationBadge = !word.hasTranslation
            ? `<span class="no-translation-badge" style="background: #f59e0b; color: white; padding: 2px 6px; border-radius: 4px; font-size: 0.7rem; margin-left: 8px;">No Translation</span>`
            : '';

        const masteredBadge = word.status === 'mastered'
            ? `<span class="mastered-badge" style="background: rgb(13, 167, 116); color: white; padding: 2px 6px; border-radius: 4px; font-size: 0.7rem; margin-left: 8px;">Mastered</span>`
            : '';

        const userStoryBadge = word.fromUserStory
            ? `<span class="user-story-badge-small" style="background: var(--primary); color: white; padding: 2px 6px; border-radius: 4px; font-size: 0.7rem; margin-left: 8px;">Your Story</span>`
            : '';

        item.innerHTML = `
            <div class="word-info">
                <div class="word-main">
                    <span class="word-text">${displayWord}</span>
                    <span class="word-translation">${word.translation}</span>
                    ${translationBadge}
                    ${masteredBadge}
                    ${userStoryBadge}
                </div>
                ${word.story ? `<div class="word-story" style="font-size: 0.8rem; color: var(--text-light); margin-top: 5px;">From: ${word.story}</div>` : ''}
                <div class="word-date" style="font-size: 0.7rem; color: var(--text-lighter); margin-top: 3px;">
                    Added: ${new Date(word.added || word.date).toLocaleDateString()}
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

function markAsMastered(index) {
    if (index < 0 || index >= savedWords.length) return;

    savedWords[index].status = 'mastered';
    savedWords[index].masteredDate = new Date().toISOString();
    localStorage.setItem('savedWords', JSON.stringify(savedWords));

    updateVocabularyStats();
    showNotification(`"${savedWords[index].originalWord || savedWords[index].word}" marked as mastered!`, 'success');
    renderVocabulary();
}

// Delete word from vocabulary
function deleteWord(index) {
    const word = savedWords[index].word;
    savedWords.splice(index, 1);
    localStorage.setItem('savedWords', JSON.stringify(savedWords));
    renderVocabulary();
    updateStats();
    updateFlashcardStats(); // Also update flashcard stats

    // Show deletion confirmation
    showNotification(`"${word}" removed from vocabulary`);
}

function removeAll() {
    const confirmed = window.confirm("Are you sure you want to remove all saved words? This action cannot be undone.");

    if (!confirmed) return; // user canceled

    // Clear localStorage
    localStorage.setItem('savedWords', JSON.stringify([]));

    // Clear in-memory array
    savedWords = [];

    // Show notification
    showNotification(`All saved words removed successfully! (${savedWords.length} words)`);

    // Update UI
    renderVocabulary();
    updateStats(); // Fixed: was updateVocabularyStats()
    // Update current page
    // window.location.reload();
}

// Update vocabulary statistics
function updateStats() {
    document.getElementById('totalWords').textContent = savedWords.length;
    document.getElementById('masteredWords').textContent = savedWords.filter(w => w.status === 'known').length;

    const dueForReview = savedWords.filter(w => {
        if (!w.nextReview) return false;
        return new Date(w.nextReview) <= new Date();
    }).length;

    document.getElementById('practiceDue').textContent = dueForReview;

    // Simple streak calculation (for demo)
    const streak = Math.min(7, savedWords.length);
    document.getElementById('readingStreak').textContent = streak;
}

// Export vocabulary as CSV file
function exportVocabulary() {
    if (savedWords.length === 0) {
        showNotification('No vocabulary to export!');
        return;
    }

    // Create CSV content with headers
    const headers = ['Word', 'Translation', 'Status', 'Story', 'Date Added'];

    // Create CSV rows
    const csvRows = [
        headers.join(','), // Add headers first
        ...savedWords.map(word => {
            return [
                `"${word.word || ''}"`,
                `"${(word.translation || '').replace(/"/g, '""')}"`, // Escape quotes in CSV
                `"${word.status || ''}"`,
                `"${(word.story || '').replace(/"/g, '""')}"`,
                `"${word.added ? new Date(word.added).toLocaleDateString('en-US') : ''}"`
            ].join(',');
        })
    ];

    // Join rows with newlines
    const csvString = csvRows.join('\n');

    // Create a Blob (file-like object)
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });

    // Create download URL
    const url = URL.createObjectURL(blob);

    // Create invisible download link
    const link = document.createElement('a');
    link.setAttribute('href', url);

    // Create filename with current date
    const date = new Date();
    const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    link.setAttribute('download', `my_vocabulary_${formattedDate}.csv`);

    // Hide the link and trigger download
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();

    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    // Show success message
    showNotification(`Vocabulary exported successfully! (${savedWords.length} words)`);
}

// Helper function to format date
function formatDateForExport(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// ============== End vocabulary functions =================


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

        storyCard.innerHTML = `
            <div class="story-image">
                ${renderStoryCover(story)}
            </div>
            <div class="story-content">
                <span class="story-level ${story.level}">${story.level}</span>
                <h3 class="story-title">${highlightedTitle}</h3>
                <p>${story.content[0].substring(0, 100)}...</p>
                <div class="story-meta">
                    <span><i class="fas fa-font"></i> ${story.wordCount} words</span>
                    <span><i class="fas fa-clock"></i> ${Math.ceil(story.wordCount / 200)} min read</span>
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
    { name: 'green', value: '#10b981' },
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
                
                showNotification(`Primary color changed to ${option.title || 'custom'}`, 'success');
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

// Add to your existing init function
document.addEventListener('DOMContentLoaded', function() {
    init();
    
    // Initialize color selector
    if (typeof initColorSelector === 'function') {
        initColorSelector();
    }
});





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
    showNotification(`Switched to ${newTheme} mode`, 'success');
}


// Apply current theme
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
    
    // Re-apply primary color to ensure it works with new theme
    if (selectedColor) {
        applyPrimaryColor(selectedColor);
    }
}














// Initialize flashcards
function initFlashcards() {
    console.log('Initializing flashcards...');
    console.log('Flashcard element:', flashcard ? 'Found' : 'Not found');
    console.log('Flashcard word element:', flashcardWord ? 'Found' : 'Not found');
    console.log('Flashcard translation element:', flashcardTranslation ? 'Found' : 'Not found');
    console.log('Flashcard story element:', flashcardStory ? 'Found' : 'Not found');
    
    updateFlashcardStats();
    setupFlashcardListeners();
    // Don't load cards immediately, wait until page is shown
}

// App state
let currentPage = 'home';
let currentStory = null;
let savedWords = JSON.parse(localStorage.getItem('savedWords')) || [];

let fontSize = 1.2; // rem
let lineHeight = 1.8;
let stories = []; // Will be loaded from external file

// Store current word for saving
let currentWordData = null;

// Dictionary fallback
let dictionary = window.dictionary || {};

// DOM elements
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
    
    // STEP 4: Render stories and other UI elements
    console.log('Step 4: Rendering UI...');
    renderStories();
    setupSearch();
    renderVocabulary();
    updateStats();
    
    // STEP 5: Initialize flashcards
    console.log('Step 5: Initializing flashcards...');
    if (typeof initFlashcards === 'function') {
        initFlashcards();
    }
    
    // STEP 6: Set up event listeners
    console.log('Step 6: Setting up event listeners...');
    setupEventListeners();
    
    // STEP 7: Set up navigation toggle if elements exist
    console.log('Step 7: Setting up navigation...');
    if (document.getElementById("toggle-nav") && document.getElementById("more")) {
        setupNavToggle();
    }
    
    // STEP 8: Verify everything is set up correctly
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



// Set up all event listeners
function setupEventListeners() {
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            switchPage(link.dataset.page);
            // Scroll to top when switching pages
            scrollToTop();
        });
    });

    levelBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            levelBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderStories(btn.dataset.level);
        });
    });

    themeToggle.addEventListener('click', toggleTheme);

    // CTA button
    document.querySelector('.cta-button').addEventListener('click', () => {
        if (stories.length > 0) {
            openStoryInNewPage(stories[0].id);
        }
    });
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

// Page navigation
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
}

// Open story in a new page WITH story title
// Open story in a new page WITH story title
function openStoryInNewPage(storyId) {
    // Find the story in the stories array
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
            // Include translations for user stories
            translations: story.isUserStory ? (userDictionaries[story.id] || {}) : null
        }));

        // Create a new page URL with the story ID
        const storyPage = 'reader/index.html?id=' + storyId + (story.isUserStory ? '&userStory=true' : '');
        window.location.href = storyPage;
    }
}

// Function to render cover images
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

// Render stories grid with clickable cards
// Render stories grid with clickable cards
function renderStories(level = 'all') {
    storiesGrid.innerHTML = '';

    let filteredStories;
    
    if (level === 'all') {
        filteredStories = stories;
    } else if (level === 'user') {
        // Filter for user stories only
        filteredStories = stories.filter(story => story.isUserStory);
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
        storyCard.dataset.storyId = story.id; // Add story ID as data attribute
        
        // Add user story indicator
        const userStoryBadge = story.isUserStory 
            ? '<span class="user-story-badge" title="User-added story"><i class="fas fa-user-plus"></i></span>' 
            : '';
        
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
const settingsButton = document.getElementById("settings-button");
const settingsPage = document.getElementById("settings-page");
const closeSettings = document.getElementById("close-settings");
const settingsOverlay = document.getElementById("settings-overlay");

settingsButton.addEventListener("click", function () {
    settingsPage.classList.toggle("open");
    settingsOverlay.classList.add("active");
});

closeSettings.addEventListener("click", function () {
    settingsPage.classList.remove("open");
    settingsOverlay.classList.remove("active");
});

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

// Show temporary notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--secondary);
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

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);