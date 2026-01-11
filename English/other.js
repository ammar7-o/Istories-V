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

    // Format dates - FIXED: Handle both 'added' and 'addedDate'
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

    // FIXED: Get date from correct field
    const dateValue = card.addedDate || card.added || card.date || new Date().toISOString();
    const addedDate = formatDate(dateValue);

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
let flashcardListenersAdded = false;

function setupFlashcardListeners() {
    if (flashcardListenersAdded) return;
    flashcardListenersAdded = true;

    console.log('Setting up flashcard listeners...');

    // Flip card (only if click is NOT on a button)
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

    console.log('Flashcard listeners set up ✅');
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

// Render vocabulary list - compatible with both formats
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

        // Handle different field names from different sources
        const displayWord = word.originalWord || word.word || '';
        const translation = word.translation || '';
        const story = word.story || '';

        // FIXED: Get the date with better fallback
        const addedDate = getVocabularyDate(word);

        // Check if translation exists (imported data always has translation)
        const hasTranslation = translation && translation !== displayWord;

        // Check status
        const status = word.status || 'saved';

        // Check if from user story
        const fromUserStory = word.fromUserStory || false;

        const translationBadge = !hasTranslation
            ? `<span class="no-translation-badge" style="background: #f59e0b; color: white; padding: 2px 6px; border-radius: 4px; font-size: 0.7rem; margin-left: 8px;">No Translation</span>`
            : '';

        const masteredBadge = status === 'mastered'
            ? `<span class="mastered-badge" style="background: rgb(13, 167, 116); color: white; padding: 2px 6px; border-radius: 4px; font-size: 0.7rem; margin-left: 8px;">Mastered</span>`
            : '';

        const userStoryBadge = fromUserStory
            ? `<span class="user-story-badge-small" style="background: var(--primary); color: white; padding: 2px 6px; border-radius: 4px; font-size: 0.7rem; margin-left: 8px;">Your Story</span>`
            : '';

        item.innerHTML = `
            <div class="word-info">
                <div class="word-main">
                    <span class="word-text">${displayWord}</span>
                    <span class="word-translation">${translation || 'No translation available'}</span>
                    ${translationBadge}
                    ${masteredBadge}
                    ${userStoryBadge}
                </div>
                ${story ? `<div class="word-story" style="font-size: 0.8rem; color: var(--text-light); margin-top: 5px;">From: ${story}</div>` : ''}
                <div class="word-date" style="font-size: 0.7rem; color: var(--text-lighter); margin-top: 3px;">
                    Added: ${formatDateForDisplay(addedDate)}
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

// Helper function to extract date from word object
function getVocabularyDate(word) {
    // Try all possible date field names in order of priority
    if (word.addedDate) return word.addedDate;
    if (word.dateAdded) return word.dateAdded;
    if (word.added) return word.added;
    if (word.date) return word.date;

    // If no date field exists, create one
    const newDate = new Date().toISOString();

    // Update the word object with the new date
    word.addedDate = newDate;

    // Save back to localStorage if needed
    setTimeout(() => {
        localStorage.setItem('savedWords', JSON.stringify(savedWords));
    }, 100);

    return newDate;
}

// Format date for display - SIMPLER VERSION
// Simple date formatter that always works
function formatDateForDisplay(dateString) {
    if (!dateString) return 'Unknown date';

    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            // Try to extract just the date part from ISO string
            const dateMatch = dateString.match(/(\d{4}-\d{2}-\d{2})/);
            if (dateMatch) {
                const simpleDate = new Date(dateMatch[1]);
                if (!isNaN(simpleDate.getTime())) {
                    return simpleDate.toLocaleDateString();
                }
            }
            return 'Invalid date';
        }
        return date.toLocaleDateString();
    } catch (error) {
        return 'Date error';
    }
}
// Alternative: Very simple date formatter
function simpleFormatDate(dateString) {
    if (!dateString) return '';

    try {
        const date = new Date(dateString);
        return date.toLocaleDateString(); // "1/10/2026" format
    } catch (e) {
        return dateString; // Return raw string if can't parse
    }
}

// Helper function to format date properly
function formatVocabularyDate(dateValue) {
    if (!dateValue) return 'Unknown date';

    try {
        const date = new Date(dateValue);
        if (isNaN(date.getTime())) {
            return 'Invalid date';
        }
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    } catch (error) {
        return 'Invalid date';
    }
}

// Also update your saveWord function to handle both formats
function saveWord(word, translation, story = '', hasTranslation = true) {
    // Check if word already exists
    const existingIndex = savedWords.findIndex(w =>
        w.word.toLowerCase() === word.toLowerCase() ||
        w.originalWord?.toLowerCase() === word.toLowerCase()
    );

    if (existingIndex === -1) {
        // Add new word with both field names for compatibility
        savedWords.push({
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
function importVocabulary() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.csv,.json';
    fileInput.style.display = 'none';

    fileInput.onchange = function (e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function (event) {
            try {
                const content = event.target.result;

                // Parse the file based on extension
                let importedWords = [];

                if (file.name.toLowerCase().endsWith('.json')) {
                    // Handle JSON - exactly like your localStorage format
                    const parsed = JSON.parse(content);

                    if (Array.isArray(parsed)) {
                        importedWords = parsed;
                    } else if (parsed.savedWords && Array.isArray(parsed.savedWords)) {
                        importedWords = parsed.savedWords;
                    } else {
                        // Try to extract any array from the object
                        const keys = Object.keys(parsed);
                        for (let key of keys) {
                            if (Array.isArray(parsed[key])) {
                                importedWords = parsed[key];
                                break;
                            }
                        }
                    }
                } else if (file.name.toLowerCase().endsWith('.csv')) {
                    // Handle CSV - convert to your exact format
                    importedWords = parseCSVToExactFormat(content);
                }

                if (!Array.isArray(importedWords) || importedWords.length === 0) {
                    throw new Error('No valid vocabulary data found in file');
                }

                // Get current words
                const currentWords = JSON.parse(localStorage.getItem('savedWords') || '[]');

                // Merge without modifying dates
                const mergedWords = [...currentWords];
                let addedCount = 0;

                importedWords.forEach(newWord => {
                    // Check if word already exists (case-insensitive)
                    const exists = mergedWords.some(existingWord =>
                        existingWord.word.toLowerCase() === newWord.word.toLowerCase()
                    );

                    if (!exists) {
                        // Preserve the exact structure including dates
                        mergedWords.push({
                            word: newWord.word || '',
                            translation: newWord.translation || newWord.word || '',
                            status: newWord.status || 'saved',
                            story: newWord.story || '',
                            addedDate: newWord.addedDate || new Date().toISOString()
                            // Don't add any extra fields
                        });
                        addedCount++;
                    }
                });

                // Save back to localStorage EXACTLY as before
                localStorage.setItem('savedWords', JSON.stringify(mergedWords));

                // Update UI if functions exist
                if (typeof renderVocabulary === 'function') {
                    renderVocabulary();
                    updateStats(); // Fixed: was updateVocabularyStats()
                    
                }

                // Show success message
                const message = `Imported ${addedCount} new vocabulary words. Total: ${mergedWords.length}`;

                if (typeof showNotification === 'function') {
                    showNotification(message, 'success');
                } else {
                    alert(message);
                }

                console.log('Import successful. New total:', mergedWords.length);

            } catch (error) {
                console.error('Import error:', error);
                const errorMsg = `Import failed: ${error.message}`;

                if (typeof showNotification === 'function') {
                    showNotification(errorMsg, 'error');
                } else {
                    alert(errorMsg);
                }
            }
        };

        reader.readAsText(file, 'UTF-8');
    };

    document.body.appendChild(fileInput);
    fileInput.click();
    setTimeout(() => {
        if (fileInput.parentNode) {
            document.body.removeChild(fileInput);
        }
    }, 1000);
}

// CSV parser that creates EXACT same format as your localStorage
function parseCSVToExactFormat(csvText) {
    const words = [];
    const lines = csvText.split(/\r?\n/).filter(line => line.trim() !== '');

    if (lines.length < 2) return words;

    // Get headers from first line
    const headers = lines[0].split(',').map(h =>
        h.trim().replace(/"/g, '').toLowerCase()
    );

    // Process each data row
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        if (!line.trim()) continue;

        // Parse CSV row with quotes
        const row = parseCSVRow(line);

        // Create object from headers and row values
        const rowObj = {};
        headers.forEach((header, index) => {
            if (index < row.length) {
                rowObj[header] = row[index].replace(/"/g, '').trim();
            }
        });

        // Convert to your exact format
        const word = {
            word: rowObj.word || rowObj.english || '',
            translation: rowObj.translation || rowObj.arabic || rowObj.meaning || '',
            status: rowObj.status || 'saved',
            story: rowObj.story || rowObj.title || '',
            addedDate: new Date().toISOString() // Use current date for imports
        };

        if (word.word) {
            words.push(word);
        }
    }

    return words;
}

// Helper to parse CSV row with quotes
function parseCSVRow(line) {
    const result = [];
    let inQuotes = false;
    let currentField = '';

    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        const nextChar = i < line.length - 1 ? line[i + 1] : '';

        if (char === '"') {
            if (inQuotes && nextChar === '"') {
                // Escaped quote
                currentField += '"';
                i++; // Skip next quote
            } else {
                // Toggle quotes
                inQuotes = !inQuotes;
            }
        } else if (char === ',' && !inQuotes) {
            // End of field
            result.push(currentField);
            currentField = '';
        } else {
            // Normal character
            currentField += char;
        }
    }

    // Add last field
    result.push(currentField);
    return result;
}

// Alternative simple CSV parser for your exact format
function parseCSVSimple(csvText) {
    const words = [];
    const lines = csvText.split(/\r?\n/);

    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        // Match: "word","translation","status","story","date"
        const match = line.match(/"([^"]+)","([^"]+)","([^"]+)","([^"]+)","([^"]+)"/);

        if (match) {
            words.push({
                word: match[1],
                translation: match[2],
                status: match[3],
                story: match[4],
                addedDate: new Date().toISOString()
            });
        }
    }

    return words;
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