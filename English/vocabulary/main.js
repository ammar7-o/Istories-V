// Navigation elements
const pages = document.querySelectorAll('.page');
const navLinks = document.querySelectorAll('.nav-link');

// Settings elements
const settingsButton = document.getElementById("settings-button");
const settingsPage = document.getElementById("settings-page");
const closeSettings = document.getElementById("close-settings");
const settingsOverlay = document.getElementById("settings-overlay");
const themeToggle = document.getElementById('themeToggle');

// Vocabulary elements
const vocabularyList = document.getElementById('vocabularyList');

// App state
let currentPage = 'home';
let savedWords = JSON.parse(localStorage.getItem('savedWords')) || [];

// Color settings
let selectedColor = localStorage.getItem('selectedColor') || '#4f46e5';
let selectedSecondaryColor = localStorage.getItem('selectedSecondaryColor') || '#10b981';

// Navigation menu elements
const toggleNav = document.getElementById("toggle-nav");
const more = document.getElementById("more");

// Navigation menu state
let isMenuOpen = false;

// Search variables
let searchTimeout = null;

// User stats variables
let userStats = JSON.parse(localStorage.getItem('userStats')) || {
    xp: 0,
    wordsLearned: 0,
    readingTime: 0, // in minutes
    streakDays: 0,
    lastActiveDate: null,
    totalXP: 0
};

// =============== VOCABULARY SEARCH FUNCTIONALITY ===============

// =============== VOCABULARY SEARCH FUNCTIONALITY ===============

// Improved utility function to normalize strings for search
function normalizeForSearch(text) {
    if (!text) return '';

    // Convert to lowercase
    let normalized = text.toLowerCase();

    // Remove accents/diacritics for better matching
    normalized = normalized.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    // Handle specific French characters
    normalized = normalized
        .replace(/œ/g, 'oe')
        .replace(/æ/g, 'ae');

    // Keep apostrophes for French (l'eau, d'avoir, etc.)
    // Remove other punctuation
    normalized = normalized.replace(/[.,!?;:()\[\]{}\-–—]/g, ' ');

    // Replace multiple spaces with single space
    normalized = normalized.replace(/\s+/g, ' ').trim();

    return normalized;
}

// Improved function to escape regex special characters
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function highlightSearchMatch(text, query) {
    if (!query || !text) return text;

    // For very short queries, just return the text without highlighting
    if (query.length < 2) return text;

    try {
        // Normalize query for highlighting
        const normalizedQuery = normalizeForSearch(query);
        const normalizedText = normalizeForSearch(text);

        // Find matches in normalized text
        const escapedQuery = escapeRegExp(normalizedQuery);
        const regex = new RegExp(`(${escapedQuery})`, 'gi');
        const matches = normalizedText.match(regex);

        if (!matches) return text;

        // Highlight the original text, not normalized version
        let highlightedText = text;

        // For each match, find and highlight in original text
        matches.forEach(match => {
            // Create a regex that matches the original characters (including accents)
            const originalMatchRegex = new RegExp(`(${text.match(new RegExp(match, 'i'))?.[0] || match})`, 'gi');
            highlightedText = highlightedText.replace(
                originalMatchRegex,
                '<span class="search-highlight">$1</span>'
            );
        });

        return highlightedText;
    } catch (error) {
        console.error('Error in highlightSearchMatch:', error);
        return text;
    }
}

// Initialize vocabulary search on the existing search bar
function initVocabularySearch() {
    const searchInput = document.getElementById('storySearch');
    const searchForm = document.getElementById('search-form');

    if (!searchInput) {
        console.log('Search input not found');
        return;
    }

    console.log('Initializing vocabulary search on storySearch input...');

    // Prevent form submission
    if (searchForm) {
        searchForm.addEventListener('submit', function (e) {
            e.preventDefault();
            performVocabularySearch(searchInput.value.trim());
        });
    }

    // Optimized real-time search
    let searchTimeout;
    let lastQuery = '';

    searchInput.addEventListener('input', function (e) {
        const query = e.target.value.trim();

        // Don't search for the same query twice
        if (query === lastQuery) return;

        clearTimeout(searchTimeout);

        const delay = savedWords.length > 500 ? 400 : 300;

        searchTimeout = setTimeout(() => {
            if (query !== lastQuery) {
                lastQuery = query;
                performVocabularySearch(query);
            }
        }, delay);
    });

    // Clear search
    searchInput.addEventListener('change', function (e) {
        if (!e.target.value.trim()) {
            renderVocabulary();
        }
    });

    // Escape key to clear search
    searchInput.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            searchInput.value = '';
            lastQuery = '';
            renderVocabulary();
            searchInput.focus();
        }
    });

    console.log('Vocabulary search initialized');
}

// Perform the vocabulary search
function performVocabularySearch(query) {
    console.log('Searching vocabulary for:', query);

    if (!query) {
        renderVocabulary();
        return;
    }

    // Early return for very short queries (show all)
    if (query.length < 2) {
        renderVocabulary();
        return;
    }

    // Normalize the search query
    const normalizedQuery = normalizeForSearch(query);

    // Cache results for common queries
    const cacheKey = `search_${normalizedQuery}`;
    if (window.searchCache && window.searchCache[cacheKey]) {
        console.log('Using cached search results');
        renderFilteredVocabulary(window.searchCache[cacheKey], query);
        return;
    }

    // Start timing
    const startTime = performance.now();

    // Optimized filtering for large datasets
    let filteredWords;

    if (savedWords.length > 300) {
        // For large datasets
        filteredWords = [];
        for (let i = 0; i < savedWords.length; i++) {
            const word = savedWords[i];

            // Normalize all text fields for comparison
            const wordText = normalizeForSearch(word.word || '');
            const originalWord = normalizeForSearch(word.originalWord || '');
            const translation = normalizeForSearch(word.translation || '');

            let matches = wordText.includes(normalizedQuery) ||
                originalWord.includes(normalizedQuery) ||
                translation.includes(normalizedQuery);

            // Check story only if needed
            if (!matches && word.story) {
                const story = normalizeForSearch(word.story || '');
                matches = story.includes(normalizedQuery);
            }

            if (matches) {
                filteredWords.push(word);

                // Early exit if we found enough results
                if (filteredWords.length > 50 && normalizedQuery.length > 3) {
                    break;
                }
            }
        }
    } else {
        // For small datasets
        filteredWords = savedWords.filter(word => {
            // Normalize all text fields
            const wordText = normalizeForSearch(word.word || '');
            const originalWord = normalizeForSearch(word.originalWord || '');
            const translation = normalizeForSearch(word.translation || '');
            const story = normalizeForSearch(word.story || '');

            const matchesWord = wordText.includes(normalizedQuery) ||
                originalWord.includes(normalizedQuery);
            const matchesTranslation = translation.includes(normalizedQuery);
            const matchesStory = story.includes(normalizedQuery);

            // Check language type
            const containsArabic = /[\u0600-\u06FF]/.test(query);
            const containsLatin = /[a-zA-Z]/.test(query);

            if (containsArabic) {
                // For Arabic search, prioritize translation
                return matchesTranslation || matchesWord || matchesStory;
            } else if (containsLatin) {
                // For Latin-based languages (French, English, etc.)
                return matchesWord || matchesTranslation || matchesStory;
            } else {
                // For other searches
                return matchesWord || matchesTranslation || matchesStory;
            }
        });
    }

    const endTime = performance.now();
    console.log(`Search took ${(endTime - startTime).toFixed(2)}ms for ${savedWords.length} words`);

    // Cache the results
    if (!window.searchCache) window.searchCache = {};
    window.searchCache[cacheKey] = filteredWords;

    // Limit cache size
    const cacheKeys = Object.keys(window.searchCache);
    if (cacheKeys.length > 10) {
        delete window.searchCache[cacheKeys[0]];
    }

    // Render filtered results
    renderFilteredVocabulary(filteredWords, query);
}

// Optimized render function
function renderFilteredVocabulary(filteredWords, query) {
    if (!vocabularyList) return;

    // Clear previous content
    vocabularyList.innerHTML = '';

    if (filteredWords.length === 0) {
        vocabularyList.innerHTML = `
            <div style="text-align: center; padding: 40px; color: var(--text-light);">
                <i class="fas fa-search" style="font-size: 2rem; margin-bottom: 10px; opacity: 0.5;"></i>
                <p style="margin-bottom: 5px;">No words found for "${query}"</p>
                <p style="font-size: 0.9rem; opacity: 0.7;">
                    Try searching in French, English, or Arabic
                </p>
            </div>
        `;
        return;
    }

    // Create document fragment
    const fragment = document.createDocumentFragment();

    // Sort filtered results by date (newest first)
    const sortedWords = [...filteredWords].sort((a, b) => {
        const dateA = new Date(a.addedDate || a.added || a.date || 0);
        const dateB = new Date(b.addedDate || b.added || b.date || 0);
        return dateB - dateA; // Newest first
    });

    // Limit display for large result sets
    const displayLimit = 100;
    const wordsToDisplay = sortedWords.length > displayLimit ?
        sortedWords.slice(0, displayLimit) : sortedWords;

    wordsToDisplay.forEach((word) => {
        const item = document.createElement('div');
        item.className = 'vocabulary-item';

        // Get word data
        const displayWord = word.originalWord || word.word || '';
        const translation = word.translation || '';
        const story = word.story || '';
        const addedDate = getVocabularyDate(word);
        const hasTranslation = translation && translation !== displayWord;
        const status = word.status || 'saved';
        const fromUserStory = word.fromUserStory || false;

        // Highlight search terms
        const highlightedWord = highlightSearchMatch(displayWord, query);
        const highlightedTranslation = highlightSearchMatch(translation, query);
        const highlightedStory = story ? highlightSearchMatch(story, query) : '';

        // Create badges
        const translationBadge = !hasTranslation ?
            `<span class="no-translation-badge">No Translation</span>` : '';

        const masteredBadge = status === 'mastered' ?
            `<span class="mastered-badge">Mastered</span>` : '';

        const userStoryBadge = fromUserStory ?
            `<span class="user-story-badge-small">Your Story</span>` : '';

        // Find original index
        const originalIndex = savedWords.indexOf(word);

        item.innerHTML = `
            <div class="word-info">
                <div class="word-main">
                    <span class="word-text">${highlightedWord}</span>
                    <span class="word-translation">${highlightedTranslation || 'No translation available'}</span>
                    ${translationBadge}
                    ${masteredBadge}
                    ${userStoryBadge}
                </div>
                ${story ? `<div class="word-story">From: ${highlightedStory}</div>` : ''}
                <div class="word-date">
                    Added: ${formatDateForDisplay(addedDate)}
                </div>
            </div>
            <div class="word-actions">
                <button title="Mark as mastered" data-index="${originalIndex}">
                    <i class="fas fa-check"></i>
                </button>
                <button title="Delete" data-index="${originalIndex}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;

        fragment.appendChild(item);
    });

    // Add result count message if limited
    if (sortedWords.length > displayLimit) {
        const message = document.createElement('div');
        message.className = 'search-limit-message';
        message.style.cssText = `
            text-align: center;
            padding: 15px;
            color: var(--text-light);
            font-size: 0.9rem;
            border-top: 1px solid var(--border-color);
            margin-top: 10px;
        `;
        message.innerHTML = `
            Showing ${displayLimit} of ${sortedWords.length} results. 
            <button onclick="showAllSearchResults()" style="
                background: var(--primary);
                color: white;
                border: none;
                padding: 5px 12px;
                border-radius: 4px;
                cursor: pointer;
                margin-left: 10px;
                font-size: 0.8rem;
            ">Show All</button>
        `;
        fragment.appendChild(message);
    }

    // Append all at once
    vocabularyList.appendChild(fragment);

    // Add event listeners
    document.querySelectorAll('.word-actions button').forEach(button => {
        button.addEventListener('click', (e) => {
            const index = parseInt(e.currentTarget.dataset.index);
            if (index >= 0) {
                if (e.currentTarget.querySelector('.fa-check')) {
                    markAsMastered(index);
                } else if (e.currentTarget.querySelector('.fa-trash')) {
                    deleteWord(index);
                }
            }
        });
    });
}

// Test examples to verify French support:
// These will work with the improved search:
// 1. "l'eau" will match "l'eau", "L'EAU", "l'eau"
// 2. "être" will match "être", "etre", "ÊTRE"
// 3. "d'avoir" will match "d'avoir", "d'Avoir"
// 4. "naïve" will match "naïve", "naive"
// 5. "François" will match "François", "Francois"
// 6. "œuf" will match "œuf", "oeuf"
// 7. "été" will match "été", "ete"
// 8. "çà" will match "çà", "ca"
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

                // IMPORTANT: Preserve original order from imported file
                // Create a new array with imported words FIRST (to maintain their order)
                const mergedWords = [];
                let addedCount = 0;

                // 1. Add imported words FIRST to preserve their original order
                importedWords.forEach(newWord => {
                    // Check if word already exists in current words (case-insensitive)
                    const existsInCurrent = currentWords.some(existingWord =>
                        existingWord.word.toLowerCase() === newWord.word.toLowerCase()
                    );
                    
                    // Check if word already exists in merged words (for duplicates in import file)
                    const existsInMerged = mergedWords.some(mergedWord =>
                        mergedWord.word.toLowerCase() === newWord.word.toLowerCase()
                    );

                    if (!existsInCurrent && !existsInMerged) {
                        // Add imported word with preserved date if available
                        mergedWords.push({
                            word: newWord.word || '',
                            originalWord: newWord.originalWord || newWord.word || '',
                            translation: newWord.translation || newWord.word || '',
                            story: newWord.story || '',
                            hasTranslation: !!(newWord.translation && newWord.translation !== newWord.word),
                            added: newWord.added || newWord.addedDate || new Date().toISOString(),
                            addedDate: newWord.addedDate || newWord.added || new Date().toISOString(),
                            status: newWord.status || 'saved',
                            fromUserStory: newWord.fromUserStory || false
                        });
                        addedCount++;
                    }
                });

                // 2. Then add existing current words (these will appear after imported words)
                currentWords.forEach(existingWord => {
                    // Check if this word was already imported (shouldn't happen due to earlier check)
                    const wasImported = mergedWords.some(mergedWord =>
                        mergedWord.word.toLowerCase() === existingWord.word.toLowerCase()
                    );
                    
                    if (!wasImported) {
                        mergedWords.push(existingWord);
                    }
                });

                // Save back to localStorage
                localStorage.setItem('savedWords', JSON.stringify(mergedWords));
                
                // Update the global savedWords array
                savedWords = mergedWords;

                // Update UI
                if (typeof renderVocabulary === 'function') {
                    renderVocabulary();
                    updateStats();
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

    // Process each data row in order
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
            originalWord: rowObj.originalword || rowObj.word || rowObj.english || '',
            translation: rowObj.translation || rowObj.arabic || rowObj.meaning || '',
            status: rowObj.status || 'saved',
            story: rowObj.story || rowObj.title || '',
            added: rowObj.added || rowObj.addeddate || new Date().toISOString(),
            addedDate: rowObj.addeddate || rowObj.added || new Date().toISOString(),
            hasTranslation: !!(rowObj.translation && rowObj.translation !== (rowObj.word || rowObj.english))
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

// ============== VOCABULARY FUNCTIONS =================

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

    // Create a copy to avoid mutating original array
    const wordsToDisplay = [...savedWords];

    // Sort by date (newest first) - if you want explicit sorting
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
                <button title="Mark as mastered" data-index="${originalIndex}">
                    <i class="fas fa-check"></i>
                </button>
                <button title="Delete" data-index="${originalIndex}">
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

// Save word to vocabulary
function saveWord(word, translation, story = '', hasTranslation = true) {
    // Check if word already exists
    const existingIndex = savedWords.findIndex(w =>
        w.word.toLowerCase() === word.toLowerCase() ||
        w.originalWord?.toLowerCase() === word.toLowerCase()
    );

    if (existingIndex === -1) {
        // Add new word at the BEGINNING of the array (newest first)
        savedWords.unshift({
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

    // Check if it's already mastered BEFORE changing it
    const wasAlreadyMastered = savedWords[index].status === 'mastered';

    // Save the word for notification
    const word = savedWords[index].originalWord || savedWords[index].word;

    // Mark as mastered
    savedWords[index].status = 'mastered';
    savedWords[index].masteredDate = new Date().toISOString();
    localStorage.setItem('savedWords', JSON.stringify(savedWords));

    updateVocabularyStats();
    renderVocabulary();

    // Only add XP if it wasn't already mastered
    if (!wasAlreadyMastered) {
        addXP(3, 'Mastering word');
    } else {
        // Already mastered, just show message without XP
        showNotification(`"${word}" is already mastered!`, 'info');
    }
}

// Delete word from vocabulary
function deleteWord(index) {
    if (index < 0 || index >= savedWords.length) return;

    const word = savedWords[index].word;
    savedWords.splice(index, 1);
    localStorage.setItem('savedWords', JSON.stringify(savedWords));
    renderVocabulary();
    updateStats();

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
    updateStats();
}

// Update vocabulary statistics
function updateStats() {
    const totalWordsElem = document.getElementById('totalWords');
    const masteredWordsElem = document.getElementById('masteredWords');
    const practiceDueElem = document.getElementById('practiceDue');
    const readingStreakElem = document.getElementById('readingStreak');

    if (totalWordsElem) totalWordsElem.textContent = savedWords.length;
    if (masteredWordsElem) masteredWordsElem.textContent = savedWords.filter(w => w.status === 'mastered' || w.status === 'known').length;

    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    const dueCount = savedWords.filter(w => new Date(w.added || w.date) > threeDaysAgo).length;
    if (practiceDueElem) practiceDueElem.textContent = dueCount;

    const streak = Math.min(30, savedWords.length);
    if (readingStreakElem) readingStreakElem.textContent = streak;
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

// Add XP function
function addXP(amount, reason = '') {
    userStats.xp += amount;
    userStats.totalXP += amount;

    // Check for level up (every 100 XP = 1 level)
    const oldLevel = Math.floor((userStats.totalXP - amount) / 100);
    const newLevel = Math.floor(userStats.totalXP / 100);

    if (newLevel > oldLevel) {
        showNotification(`🎉 Level Up! You reached level ${newLevel}!`, 'success');
    }

    // Save to localStorage
    localStorage.setItem('userStats', JSON.stringify(userStats));

    console.log(`Added ${amount} XP${reason ? ' for: ' + reason : ''}`);
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

    // Set up settings
    setupSettings();

    // Set up navigation menu toggle
    setupNavToggle();

    // Initialize color selectors
    setTimeout(() => {
        initColorSelector();
        initSecondaryColorSelector();
    }, 50);

    // Initialize vocabulary search
    setTimeout(() => {
        initVocabularySearch();
    }, 100);

    // Render vocabulary if on vocabulary page
    if (currentPage === 'home' && typeof renderVocabulary === 'function') {
        renderVocabulary();
        updateStats();
    }

    console.log('App initialization complete!');
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);