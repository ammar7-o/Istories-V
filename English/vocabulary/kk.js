// =============== SPEECH SETTINGS ===============
let showVoiceButtons = localStorage.getItem('showVoiceButtons') !== 'false'; // Default: true

// Initialize voice button setting
function initVoiceButtonSetting() {
    const toggleSwitch = document.getElementById('listenToWord');
    if (!toggleSwitch) return;

    // Set initial state
    toggleSwitch.checked = showVoiceButtons;

    // Add event listener
    toggleSwitch.addEventListener('change', function() {
        saveVoiceButtonSetting(this.checked);
    });
}

// Save voice button setting
function saveVoiceButtonSetting(value) {
    showVoiceButtons = value;
    localStorage.setItem('showVoiceButtons', value);
    
    // Update the vocabulary list to show/hide voice buttons
    renderVocabulary();
    
    showNotification(`Voice buttons ${value ? 'enabled' : 'disabled'}`, 'success');
}

// Add voice button to vocabulary items
function addVoiceButtonToVocabularyItem(item, word, translation) {
    if (!showVoiceButtons) return;
    
    // Create voice button
    const voiceBtn = document.createElement('button');
    voiceBtn.className = 'vocabulary-voice-btn';
    voiceBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
    voiceBtn.title = 'Listen to pronunciation';
    
    // Add click event
    voiceBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        e.preventDefault();
        speakVocabularyWord(word, translation);
    });
    
    // Add to word actions
    const wordActions = item.querySelector('.word-actions');
    if (wordActions) {
        // Insert voice button before other buttons
        wordActions.insertBefore(voiceBtn, wordActions.firstChild);
    }
}

// Speak vocabulary word
function speakVocabularyWord(word, translation) {
    if (!word) return;
    
    // Try to speak the word in its original language
    // Determine language based on the word
    let language = 'en'; // Default to English
    
    // Check if the word contains Arabic characters
    const arabicRegex = /[\u0600-\u06FF]/;
    if (arabicRegex.test(word)) {
        language = 'ar';
    } else if (arabicRegex.test(translation)) {
        // If translation is Arabic, speak the word in English
        language = 'en';
    } else {
        // For non-Arabic words, try to detect language
        // Check for French characters/accents
        const frenchRegex = /[éèêëàâäôöûüçœæ]/i;
        if (frenchRegex.test(word)) {
            language = 'fr';
        } else if (/^[a-zA-Z\s]+$/.test(word)) {
            // Only English/French characters
            language = 'en';
        }
    }
    
    // Speak the word
    playGoogleVoice(word, language);
}

// Update your renderVocabulary function to include voice buttons
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

    // Create a copy to avoid mutating original array
    const wordsToDisplay = [...savedWords];

    // Sort by date (newest first)
    wordsToDisplay.sort((a, b) => {
        const dateA = new Date(a.addedDate || a.added || a.date || 0);
        const dateB = new Date(b.addedDate || b.added || b.date || 0);
        return dateB - dateA; // Newest first
    });

    wordsToDisplay.forEach((word, displayIndex) => {
        const item = document.createElement('div');
        item.className = 'vocabulary-item';

        // Handle different field names from different sources
        const displayWord = word.originalWord || word.word || '';
        const translation = word.translation || '';
        const story = word.story || '';

        // Get the date with better fallback
        const addedDate = getVocabularyDate(word);

        // Check if translation exists
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

        // Find the original index in savedWords array
        const originalIndex = savedWords.findIndex(w =>
            (w.word === word.word && w.translation === word.translation) ||
            (w.originalWord === word.originalWord && w.translation === word.translation)
        );

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
                <button title="Delete" data-index="${originalIndex}">
                    <i class="fas fa-trash"></i>
                </button>
                <button title="Mark as mastered" data-index="${originalIndex}">
                    <i class="fas fa-check"></i>
                </button>
            </div>
        `;

        vocabularyList.appendChild(item);
        
        // Add voice button if setting is enabled
        addVoiceButtonToVocabularyItem(item, displayWord, translation);
    });

    // Add event listeners for delete and mark as mastered buttons
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

// Update your init function to include voice button initialization
function init() {
    console.log('App initialization started...');

    // Apply saved theme
    applyTheme();

    // Apply saved colors
    if (selectedColor) {
        applyPrimaryColor(selectedColor);
    }
    if (selectedSecondaryColor) {
        applySecondaryColor(selectedSecondaryColor);
    }

    // Set up navigation menu toggle
    setupNavToggle();

    // Set up settings
    setupSettings();

    // Initialize voice button setting
    initVoiceButtonSetting();

    // Initialize color selectors
    setTimeout(() => {
        if (document.querySelector('.color-option')) {
            initColorSelector();
        }
        if (document.querySelector('.secondary-color')) {
            initSecondaryColorSelector();
        }
    }, 50);

    // Initialize vocabulary search
    setTimeout(() => {
        initVocabularySearch();
    }, 100);

    // Initialize refresh app button
    const refreshBtn = document.getElementById('refresh-app');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', function() {
            location.reload();
        });
    }

    // Initialize vocabulary actions buttons
    const exportBtn = document.getElementById('exportBtn');
    const removeAllBtn = document.querySelector('.v-btn:nth-child(3)'); // The "Remove all" button
    
    if (exportBtn) {
        exportBtn.addEventListener('click', exportVocabulary);
    }
    
    if (removeAllBtn) {
        removeAllBtn.addEventListener('click', removeAll);
    }

    // Render vocabulary list
    renderVocabulary();
    
    // Update statistics
    updateStats();

    console.log('Vocabulary page initialization complete!');
}

// Add CSS for the voice button
const voiceButtonCSS = document.createElement('style');
voiceButtonCSS.textContent = `
.vocabulary-voice-btn {
    background: var(--secondary);
    color: white;
    border: none;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 8px;
    transition: all 0.2s ease;
    font-size: 14px;
}

.vocabulary-voice-btn:hover {
    background: var(--secondary-dark);
    transform: scale(1.1);
}

.vocabulary-voice-btn:active {
    transform: scale(0.95);
}

.vocabulary-voice-btn i {
    font-size: 14px;
}

.word-actions {
    display: flex;
    gap: 5px;
    align-items: center;
}

/* Adjust existing button styles */
.word-actions button {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: none;
    background: var(--bg-light);
    color: var(--text);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    font-size: 12px;
}

.word-actions button:hover {
    background: var(--primary);
    color: white;
}

.word-actions button[title="Delete"]:hover {
    background: #ef4444;
}

.word-actions button[title="Mark as mastered"]:hover {
    background: #10b981;
}
`;

// Add the CSS to the document head
document.head.appendChild(voiceButtonCSS);

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);