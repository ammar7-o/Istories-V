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
    addXP(5); // Adds 5 XP
}

// Delete word from vocabulary
function deleteWord(index) {
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

                // Update savedWords array
                savedWords = mergedWords;

                // Update UI if functions exist
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

// ============== End vocabulary functions =================


// User stats variables
let userStats = JSON.parse(localStorage.getItem('userStats')) || {
    xp: 0,
    wordsLearned: 0,
    readingTime: 0, // in minutes
    streakDays: 0,
    lastActiveDate: null,
    totalXP: 0
};
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

    // Update display
    updateUserStatsDisplay();

    console.log(`Added ${amount} XP${reason ? ' for: ' + reason : ''}`);
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

    // Set up settings
    setupSettings();

    // Set up navigation menu toggle
    setupNavToggle();

    // Initialize color selectors
    setTimeout(() => {
        initColorSelector();
        initSecondaryColorSelector();
    }, 50);

    // Render vocabulary if on vocabulary page
    if (currentPage === 'home' && typeof renderVocabulary === 'function') {
        renderVocabulary();
        updateStats();
    }

    console.log('App initialization complete!');
    console.log('Current localStorage theme:', localStorage.getItem('theme'));
    console.log('Current localStorage primary color:', localStorage.getItem('selectedColor'));
    console.log('Current localStorage secondary color:', localStorage.getItem('selectedSecondaryColor'));
}
// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);