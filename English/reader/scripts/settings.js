
let fontSize = 1.2; // rem
let lineHeight = 1.8;

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
// Close settings on Escape key
document.addEventListener("keydown", function (e) {
    if (e.key === 'Escape' && settingsPage.classList.contains("open")) {
        settingsPage.classList.remove("open");
        settingsOverlay.classList.remove("active");
    }
});
settingsOverlay.addEventListener("click", function () {
    settingsPage.classList.remove("open");
    settingsOverlay.classList.remove("active");
});

const ttsBtn = document.getElementById("tts-toggle");
const sound = document.getElementById("sound");
let active = false; // Start with TTS disabled

ttsBtn.addEventListener("click", function () {
    if (active === false) {
        // Enable TTS
        sound.classList.add("tts-open");
        ttsBtn.classList.add("tts-active");
        ttsBtn.innerHTML = `<i class="fas fa-volume-up"></i> Disable`;
        active = true;
    } else {
        // Disable TTS
        sound.classList.remove("tts-open");
        ttsBtn.classList.remove("tts-active");
        ttsBtn.innerHTML = `<i class="fas fa-volume-up"></i> Enable`;
        active = false;
    }
});

// Function to change font family
function changeFontFamily(family) {
    fontFamily = family;

    // Apply to story text
    if (storyText) {
        storyText.style.fontFamily = family;
    }


    // Save to localStorage
    localStorage.setItem('fontFamily', family);

    // Show notification
    showNotification(`Font changed to ${family}`, 'success');
}

// Adjust font size and save
function adjustFontSize(change) {
    fontSize += change;
    fontSize = Math.max(1, Math.min(2, fontSize));

    if (storyText) {
        storyText.style.fontSize = `${fontSize}rem`;
    }

    // Save to localStorage
    localStorage.setItem('fontSize', fontSize);

    // Update button states
    if (fontSmaller && fontNormal && fontLarger) {
        fontSmaller.classList.toggle('active', fontSize < 1.2);
        fontNormal.classList.toggle('active', fontSize === 1.2);
        fontLarger.classList.toggle('active', fontSize > 1.2);
    }

    console.log('Font size adjusted to:', fontSize);
}

// Reset font size and save
function resetFontSize() {
    fontSize = 1.2;

    if (storyText) {
        storyText.style.fontSize = `${fontSize}rem`;
    }

    // Save to localStorage
    localStorage.setItem('fontSize', fontSize);

    // Update button states
    if (fontSmaller && fontNormal && fontLarger) {
        fontSmaller.classList.remove('active');
        fontNormal.classList.add('active');
        fontLarger.classList.remove('active');
    }

    console.log('Font size reset to default');
}
// Toggle line spacing and save
function toggleLineSpacing() {
    lineHeight = lineHeight === 1.8 ? 2.2 : 1.8;

    if (storyText) {
        storyText.style.lineHeight = lineHeight;
    }

    // Save to localStorage
    localStorage.setItem('lineHeight', lineHeight);

    // Update button state
    if (lineSpacingBtn) {
        lineSpacingBtn.classList.toggle('active', lineHeight === 2.2);
    }

    console.log('Line spacing changed to:', lineHeight);
}




// Custom CSS functionality
const customCSSModal = document.getElementById('customCSSModal');
const cssModalOverlay = document.getElementById('cssModalOverlay');
const showCustomCSSBtn = document.getElementById('showCustomCSS');
const closeCustomCSSBtn = document.getElementById('closeCustomCSS');
const customCSSInput = document.getElementById('customCSSInput');
const saveCustomCSSBtn = document.getElementById('saveCustomCSS');
const clearCustomCSSBtn = document.getElementById('clearCustomCSS');
const previewCSSBtn = document.getElementById('previewCSS');
const resetAllSettingsBtn = document.getElementById('resetAllSettings');
// Function to load all font settings
function loadFontSettings() {
    // Load font size
    const savedFontSize = localStorage.getItem('fontSize');
    if (savedFontSize) {
        fontSize = parseFloat(savedFontSize);
        if (storyText) {
            storyText.style.fontSize = `${fontSize}rem`;
        }

        // Update button states
        if (fontSmaller && fontNormal && fontLarger) {
            fontSmaller.classList.toggle('active', fontSize < 1.2);
            fontNormal.classList.toggle('active', fontSize === 1.2);
            fontLarger.classList.toggle('active', fontSize > 1.2);
        }
    }

    // Load line height
    const savedLineHeight = localStorage.getItem('lineHeight');
    if (savedLineHeight) {
        lineHeight = parseFloat(savedLineHeight);
        if (storyText) {
            storyText.style.lineHeight = lineHeight;
        }

        // Update button state
        if (lineSpacingBtn) {
            lineSpacingBtn.classList.toggle('active', lineHeight === 2.2);
        }
    }

    // Load font family
    const savedFontFamily = localStorage.getItem('fontFamily');
    if (savedFontFamily && storyText) {
        storyText.style.fontFamily = savedFontFamily;
    }

    console.log('Font settings loaded:', { fontSize, lineHeight, savedFontFamily });
}

// Load saved custom CSS
function loadCustomCSS() {
    const savedCSS = localStorage.getItem('customCSS') || '';
    customCSSInput.value = savedCSS;
    applyCustomCSS(savedCSS);
}

// Apply custom CSS to page
function applyCustomCSS(css) {
    const existingStyle = document.getElementById('custom-css-style');
    if (existingStyle) {
        existingStyle.remove();
    }

    if (css.trim()) {
        const styleElement = document.createElement('style');
        styleElement.id = 'custom-css-style';

        // Improved regex that handles CSS variables
        let processedCSS = css.replace(
            /([a-zA-Z\-]+)\s*:\s*([^;!}]+(?:var\([^)]+\)[^;!}]*)*)(?![!important])\s*(;|})/gi,
            '$1: $2 !important$3'
        );

        styleElement.textContent = processedCSS;
        document.head.appendChild(styleElement);

        console.log('Custom CSS applied with !important on all properties');
    }
}
// Preview CSS without saving
function previewCustomCSS() {
    const css = customCSSInput.value.trim();
    applyCustomCSS(css);

    // Temporary notification
    const tempNotification = document.createElement('div');
    tempNotification.textContent = 'CSS Preview Applied';
    tempNotification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: var(--primary);
        color: white;
        padding: 10px 20px;
        border-radius: 8px;
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    document.body.appendChild(tempNotification);

    setTimeout(() => {
        tempNotification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => tempNotification.remove(), 300);
    }, 2000);
}

// Save custom CSS
function saveCustomCSS() {
    const css = customCSSInput.value.trim();
    localStorage.setItem('customCSS', css);
    applyCustomCSS(css);
    showNotification('Custom CSS saved successfully!', 'success');
    closeCustomCSSModal();
}

// Clear custom CSS
function clearCustomCSS() {
    if (confirm('Are you sure you want to clear all custom CSS?')) {
        customCSSInput.value = '';
        localStorage.removeItem('customCSS');

        // Remove custom style element
        const existingStyle = document.getElementById('custom-css-style');
        if (existingStyle) {
            existingStyle.remove();
        }

        showNotification('Custom CSS cleared!', 'success');
    }
}

// Open custom CSS modal
function openCustomCSSModal() {
    customCSSModal.classList.add('active');
    cssModalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Focus on textarea
    setTimeout(() => {
        customCSSInput.focus();
    }, 300);
}

// Close custom CSS modal
function closeCustomCSSModal() {
    customCSSModal.classList.remove('active');
    cssModalOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

// Reset all settings function
function resetAllSettings() {
    // Create confirmation modal
    const confirmModal = document.createElement('div');
    confirmModal.className = 'reset-confirm-modal';
    confirmModal.innerHTML = `
       <div class="reset-modal-header">
            <h3><i class="fas fa-exclamation-triangle"></i> Reset All Settings</h3>
        </div>
        <div class="reset-modal-body">
            <div class="reset-warning">
                <i class="fas fa-exclamation-circle"></i>
                <span>This action cannot be undone!</span>
            </div>
            <p style="color:white;">Are you sure you want to reset ALL settings to default? This will reset:</p>
            <ul style="margin-left: 20px; margin-bottom: 20px; color: white;">
                <li>Theme and colors</li>
                <li>Font settings</li>
                <li>Custom CSS</li>
                <li>Reading preferences</li>
                <li>Vocabulary (optional)</li>
            </ul>
            <div class="reset-modal-actions">
                <button class="btn btn-secondary" id="cancelReset">Cancel</button>
                <button class="btn btn-danger" id="confirmReset">Reset Everything</button>
            </div>
        </div>
    `;

    document.body.appendChild(confirmModal);

    // Show modal with animation
    setTimeout(() => confirmModal.classList.add('active'), 10);

    // Add overlay
    const overlay = document.createElement('div');
    overlay.className = 'css-modal-overlay active';
    document.body.appendChild(overlay);

    // Event listeners for modal
    document.getElementById('cancelReset')?.addEventListener('click', () => {
        confirmModal.classList.remove('active');
        overlay.classList.remove('active');
        setTimeout(() => {
            confirmModal.remove();
            overlay.remove();
        }, 300);
    });

    document.getElementById('confirmReset')?.addEventListener('click', () => {
        performFullReset();
        confirmModal.classList.remove('active');
        overlay.classList.remove('active');
        setTimeout(() => {
            confirmModal.remove();
            overlay.remove();
        }, 300);
    });

    // Close on overlay click
    overlay.addEventListener('click', () => {
        confirmModal.classList.remove('active');
        overlay.classList.remove('active');
        setTimeout(() => {
            confirmModal.remove();
            overlay.remove();
        }, 300);
    });
}
function Refresh() {
    window.location.reload()
}
// Perform the actual reset
function performFullReset() {
    // Ask about vocabulary
    const keepVocabulary = confirm('Do you want to keep your vocabulary words?');

    // Reset all localStorage items
    const defaultSettings = {
        // Theme
        theme: 'light',
        selectedColor: '#4a6cf7',
        selectedSecondaryColor: '#10b981',

        // Font
        fontFamily: 'sans-serif',
        fontSize: 1.2,
        lineHeight: 1.8,

        // Other
        customCSS: '',
        ttsEnabled: false
    };

    // Apply default settings
    localStorage.setItem('theme', defaultSettings.theme);
    localStorage.setItem('selectedColor', defaultSettings.selectedColor);
    localStorage.setItem('selectedSecondaryColor', defaultSettings.selectedSecondaryColor);
    localStorage.setItem('fontFamily', defaultSettings.fontFamily);
    localStorage.setItem('customCSS', defaultSettings.customCSS);
    localStorage.setItem('ttsEnabled', defaultSettings.ttsEnabled);

    // Remove reading position
    localStorage.removeItem('readingPosition');

    // Clear vocabulary if requested
    if (!keepVocabulary) {
        localStorage.removeItem('savedWords');
        savedWords = [];
        renderVocabulary();
        updateVocabularyStats();
    }

    // Remove custom CSS
    const customStyle = document.getElementById('custom-css-style');
    if (customStyle) {
        customStyle.remove();
    }

    // Apply theme reset
    theme = 'light';
    applyTheme();

    // Apply font reset
    if (storyText) {
        storyText.style.fontSize = '1.2rem';
        storyText.style.lineHeight = '1.8';
        storyText.style.fontFamily = 'sans-serif';
    }

    // Reset font size buttons
    fontSmaller?.classList.remove('active');
    fontNormal?.classList.add('active');
    fontLarger?.classList.remove('active');
    lineSpacingBtn?.classList.remove('active');

    // Reset TTS button
    if (ttsBtn) {
        sound?.classList.remove("tts-open");
        ttsBtn.classList.remove("tts-active");
        ttsBtn.innerHTML = `<i class="fas fa-volume-up"></i> Enable`;
        active = false;
    }

    // Reset font family select
    if (fontFamilySelect) {
        fontFamilySelect.value = 'sans-serif';
    }

    // Show success message
    showNotification('All settings have been reset to default!', 'success');

    // Reload page after a short delay to apply all changes
    setTimeout(() => {
        location.reload();
    }, 1500);
}

// Event Listeners for Custom CSS
if (showCustomCSSBtn) {
    showCustomCSSBtn.addEventListener('click', openCustomCSSModal);
}

if (closeCustomCSSBtn) {
    closeCustomCSSBtn.addEventListener('click', closeCustomCSSModal);
}

if (cssModalOverlay) {
    cssModalOverlay.addEventListener('click', closeCustomCSSModal);
}

if (saveCustomCSSBtn) {
    saveCustomCSSBtn.addEventListener('click', saveCustomCSS);
}

if (clearCustomCSSBtn) {
    clearCustomCSSBtn.addEventListener('click', clearCustomCSS);
}

if (previewCSSBtn) {
    previewCSSBtn.addEventListener('click', previewCustomCSS);
}

if (resetAllSettingsBtn) {
    resetAllSettingsBtn.addEventListener('click', resetAllSettings);
}

// Close modal on Escape key
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
        if (customCSSModal.classList.contains('active')) {
            closeCustomCSSModal();
        }
    }
});

// Initialize custom CSS on page load
document.addEventListener('DOMContentLoaded', function () {
    loadCustomCSS();
});

// Add to your existing notification function or create a simple one
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        font-weight: 500;
        animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}










// ========= PERSISTENT TRANSLATION LANGUAGE SETTINGS =========

// Initialize translation language settings
function initTranslationSettings() {
    const languageSelect = document.getElementById('defaultTranslateLanguage');

    if (!languageSelect) {
        console.warn('Language select element not found');
        return;
    }

    // Load saved language from localStorage
    const savedLanguage = localStorage.getItem('defaultTranslateLanguage') || 'ar';
    languageSelect.value = savedLanguage;

    // Save language when changed
    languageSelect.addEventListener('change', function () {
        const selectedLanguage = this.value;
        localStorage.setItem('defaultTranslateLanguage', selectedLanguage);

        // Show confirmation
        showNotification(`Default translation language set to: ${getLanguageName(selectedLanguage)}`, 'success');

        // If dictionary popup is open, update it
        updateOpenDictionaryTranslation();
    });



    console.log('Translation settings initialized with language:', savedLanguage);
}

// Get language name from code
function getLanguageName(code) {
    const languages = {
        'ar': 'Arabic',
        'fr': 'French',
        'es': 'Spanish',
        'de': 'German',
        'ru': 'Russian',
        'zh-CN': 'Chinese',
        'ja': 'Japanese',
        'ko': 'Korean',
        'pt': 'Portuguese',
        'it': 'Italian',
        'hi': 'Hindi',
        'tr': 'Turkish',
        'fa': 'Persian',
        'ur': 'Urdu',
        'en': 'English'
    };
    return languages[code] || code.toUpperCase();
}




// Get the current translation language
function getCurrentTranslationLanguage() {
    return localStorage.getItem('defaultTranslateLanguage') || 'ar';
}

// ========= TRANSLATE POPUP WORD WITH SETTINGS =========

// Translate word to specific language
async function translateWordToLanguage(word, targetLang = null) {
    if (!targetLang) {
        targetLang = getCurrentTranslationLanguage();
    }

    try {
        const response = await fetch(
            `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(word)}`
        );

        if (!response.ok) {
            throw new Error('Translation API error');
        }

        const data = await response.json();

        if (data && data[0] && data[0][0] && data[0][0][0]) {
            return data[0][0][0];
        } else {
            throw new Error('Invalid translation response');
        }
    } catch (error) {
        console.error('Translation error:', error);
        throw error;
    }
}

// Show translation in popup
function showTranslationInPopup(originalWord, translation, targetLanguage) {
    const popupTranslation = document.getElementById('popupTranslation');
    if (!popupTranslation) return;

    // Generate a unique ID for this translation instance
    const translationId = 'translation-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);

    // Create translation display
    const translationDiv = document.createElement('div');
    translationDiv.className = 'word-translation-persistent';
    translationDiv.dataset.translationId = translationId;

    const languageName = getLanguageName(targetLanguage);

    translationDiv.innerHTML = `
        <div class="translation-popup-header">
            <div class="translation-popup-language-info">
                <i class="fas fa-language translation-popup-icon"></i>
               
            </div>
            <div class="translation-popup-actions">
                <button class="translation-popup-btn retranslate-btn" 
                        data-translation-id="${translationId}" 
                        data-original-word="${originalWord}"
                        data-target-language="${targetLanguage}"
                        title="Translate again">
                    <i class="fas fa-sync-alt"></i>
                </button>
                <button class="translation-popup-btn close-translation-popup-btn" 
                        title="Remove translation">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        </div>
        <div class="translation-popup-content">
            ${translation}
        </div>
        <div class="translation-popup-footer">
            Using ${languageName} (${targetLanguage.toUpperCase()})
        </div>
    `;

    // Remove existing translation
    const existingTranslation = popupTranslation.querySelector('.word-translation-persistent');
    if (existingTranslation) {
        existingTranslation.remove();
    }

    // Add new translation
    popupTranslation.appendChild(translationDiv);

    // Add event listeners
    const closeBtn = translationDiv.querySelector('.close-translation-popup-btn');
    if (closeBtn) {
        closeBtn.addEventListener('click', function () {
            translationDiv.remove();
        });
    }

    // REMOVED the direct event listener here - let event delegation handle it
}

// Main function to trigger translation from anywhere
function translateCurrentWord() {
    const popupWord = document.getElementById('popupWord');
    if (!popupWord) return;

    const word = popupWord.textContent.trim();
    if (!word) return;

    // Get saved language from settings
    const targetLanguage = getCurrentTranslationLanguage();

    // Show loading on any translate button that might exist
    const translateButtons = document.querySelectorAll('.translate-btn, .retranslate-btn, [data-action="translate"]');
    translateButtons.forEach(btn => {
        const originalHTML = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        btn.disabled = true;

        // Reset after 3 seconds if something goes wrong
        setTimeout(() => {
            btn.innerHTML = originalHTML;
            btn.disabled = false;
        }, 3000);
    });

    // Translate the word using saved language
    translateWordToLanguage(word, targetLanguage).then(translation => {
        showTranslationInPopup(word, translation, targetLanguage);
    }).catch(error => {
        console.error('Translation error:', error);
        // showNotification('Failed to translate word', 'error');
    }).finally(() => {
        // Reset all translate buttons
        translateButtons.forEach(btn => {
            btn.innerHTML = '<i class="fas fa-sync-alt"></i>';
            btn.disabled = false;
        });
    });
}

// Update open dictionary with new language setting
function updateOpenDictionaryTranslation() {
    const dictionaryPopup = document.getElementById('dictionaryPopup');
    if (!dictionaryPopup || dictionaryPopup.style.display !== 'block') {
        return; // Dictionary not open
    }

    const popupWord = document.getElementById('popupWord');
    if (!popupWord) return;

    const word = popupWord.textContent.trim();
    if (!word) return;

    const currentLanguage = getCurrentTranslationLanguage();
    const existingTranslation = document.querySelector('.word-translation-persistent');

    if (existingTranslation) {
        // Update existing translation with new language
        const reTranslateBtn = existingTranslation.querySelector('.retranslate-btn');
        if (reTranslateBtn) {
            reTranslateBtn.dataset.targetLanguage = currentLanguage;
            // Don't auto-click - let user decide to retranslate
            showNotification(`Language changed to ${getLanguageName(currentLanguage)}. Click the refresh button to retranslate.`, 'info');
        }
    }


}

// Auto-translate word when dictionary opens
function autoTranslateOnDictionaryOpen() {
    const autoTranslateEnabled = localStorage.getItem('autoTranslateEnabled') === 'true';

    if (autoTranslateEnabled) {
        setTimeout(() => {
            const popupWord = document.getElementById('popupWord');
            if (popupWord && popupWord.textContent.trim()) {
                // Auto-translate after a short delay
                setTimeout(() => {
                    translateCurrentWord();
                }, 500);
            }
        }, 200);
    }
}

// Add auto-translate toggle to settings
function addAutoTranslateToggle() {
    const settingsContent = document.querySelector('.settings-content');
    if (!settingsContent) return;

    // Check if toggle already exists
    if (document.getElementById('autoTranslateToggle')) return;

    const toggleHTML = `
        <div class="setting-item">
            <div class="setting-info">
                <span class="setting-label">Auto-translate Words</span>
                <span class="setting-desc">Automatically translate words when dictionary opens. Need Internet</span>
            </div>
            <label class="switch">
                <input type="checkbox" id="autoTranslateToggle">
                <span class="slider"></span>
            </label>
        </div>
    `;

    // Find language select and insert after it
    const languageSelect = document.getElementById('defaultTranslateLanguage');
    if (languageSelect && languageSelect.parentNode) {
        languageSelect.parentNode.parentNode.insertAdjacentHTML('afterend', toggleHTML);

        // Set default to TRUE (enabled)
        // Only set if not already saved by user
        if (localStorage.getItem('autoTranslateEnabled') === null) {
            localStorage.setItem('autoTranslateEnabled', 'true');
        }

        // Load saved preference (or default)
        const autoTranslateEnabled = localStorage.getItem('autoTranslateEnabled') === 'true';
        document.getElementById('autoTranslateToggle').checked = autoTranslateEnabled;

        // Add change listener
        document.getElementById('autoTranslateToggle').addEventListener('change', function (e) {
            localStorage.setItem('autoTranslateEnabled', e.target.checked);
            showNotification(
                e.target.checked ? 'Auto-translate enabled' : 'Auto-translate disabled',
                'success'
            );
        });
    }
}

// Flag to prevent multiple translations
let isTranslating = false;

// Setup event delegation for retranslate buttons
function setupEventDelegation() {
    // Use event delegation for dynamically created retranslate buttons
    document.addEventListener('click', function (e) {
        // Check if a retranslate button was clicked
        const retranslateBtn = e.target.closest('.retranslate-btn') ||
            e.target.closest('[data-action="retranslate"]');

        if (retranslateBtn && !isTranslating) {
            e.preventDefault();
            e.stopPropagation();

            const button = retranslateBtn;
            const translationDiv = button.closest('.word-translation-persistent');

            if (translationDiv) {
                const originalWord = button.dataset.originalWord ||
                    translationDiv.querySelector('.translation-popup-header')?.dataset?.originalWord;
                const targetLanguage = button.dataset.targetLanguage || getCurrentTranslationLanguage();

                if (originalWord) {
                    // Prevent multiple translations
                    isTranslating = true;

                    // Call retranslate function
                    handleRetranslate(button, originalWord, targetLanguage, translationDiv).finally(() => {
                        isTranslating = false;
                    });
                }
            }
        }
    });
}

// Handle retranslate action
async function handleRetranslate(button, originalWord, targetLanguage, translationDiv) {
    // Show loading on re-translate button
    const icon = button.querySelector('i');
    if (icon) icon.className = 'fas fa-spinner fa-spin';
    button.disabled = true;

    try {
        const newTranslation = await translateWordToLanguage(originalWord, targetLanguage);

        // Update translation text
        const translationText = translationDiv.querySelector('.translation-popup-content');
        if (translationText) {
            translationText.textContent = newTranslation;
            showNotification('Translation refreshed', 'success');
        }
    } catch (error) {
        console.error('Re-translation error:', error);
        showNotification('Failed to refresh translation', 'error');
    } finally {
        if (icon) icon.className = 'fas fa-sync-alt';
        button.disabled = false;
    }
}

// ========= INITIALIZATION =========

// Initialize everything when DOM loads
document.addEventListener('DOMContentLoaded', function () {
    // Initialize translation settings
    initTranslationSettings();

    // Add auto-translate toggle
    addAutoTranslateToggle();

    // Setup event delegation for dynamic buttons
    setupEventDelegation();

    // Track if auto-translate has already been triggered
    let autoTranslateTriggered = false;

    // Enhance dictionary when it opens
    const observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            if (mutation.target.id === 'dictionaryPopup' &&
                mutation.target.style.display === 'block') {
                // Dictionary opened


                // Only auto-translate if not already triggered
                if (!autoTranslateTriggered) {
                    autoTranslateTriggered = true;
                    autoTranslateOnDictionaryOpen();

                    // Reset flag after 2 seconds
                    setTimeout(() => {
                        autoTranslateTriggered = false;
                    }, 2000);
                }
            }
        });
    });

    // Start observing dictionary popup
    setTimeout(() => {
        const dictionaryPopup = document.getElementById('dictionaryPopup');
        if (dictionaryPopup) {
            observer.observe(dictionaryPopup, {
                attributes: true,
                attributeFilter: ['style']
            });
        }
    }, 1000);
});

// Add CSS animations
const translationAnimationStyle = document.createElement('style');
translationAnimationStyle.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-5px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    .word-translation-persistent {
        animation: fadeIn 0.3s ease;
    }
    
    /* Switch styling for auto-translate toggle */
    .switch {
        position: relative;
        display: inline-block;
        width: 50px;
        height: 24px;
        margin-left: 14px;
    }
    
    .switch input {
        opacity: 0;
        width: 0;
        height: 0;
    }
    
    .slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: var(--border);
        transition: .4s;
        border-radius: 34px;
    }
    
    .slider:before {
        position: absolute;
        content: "";
        height: 16px;
        width: 16px;
        left: 4px;
        bottom: 4px;
        background-color: white;
        transition: .4s;
        border-radius: 50%;
    }
    
    input:checked + .slider {
        background-color: var(--primary);
    }
    
    input:checked + .slider:before {
        transform: translateX(26px);
    }
    
    /* Translation button styles */
    .retranslate-btn {
        background: var(--primary);
        color: white;
        border: none;
        border-radius: 4px;
        padding: 4px 8px;
        font-size: 11px;
        cursor: pointer;
        transition: all 0.2s ease;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .retranslate-btn:hover {
        background: var(--primary-dark);
        transform: translateY(-1px);
    }
    
    .retranslate-btn:active {
        transform: translateY(0);
    }
    
    .retranslate-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
`;
document.head.appendChild(translationAnimationStyle);




// =============google tts =================
// Fixed TTS function with CORS proxy
function playGoogleVoice(word, language = 'en') {
    if (!word || word.trim() === '') {
        showNotification('No word to speak', 'error');
        return;
    }

    const text = word.trim();

    // Show loading indicator
    const ttsBtn = document.getElementById('googleTTSBtn');
    if (ttsBtn) {
        const icon = ttsBtn.querySelector('i');
        if (icon) {
            icon.className = 'fas fa-spinner fa-spin';
        }
        ttsBtn.disabled = true;
    }

    try {
        // Original Google TTS URL
        const googleTTSUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=${language}&client=tw-ob`;

        // Use a CORS proxy to bypass restrictions
        // Option 1: cors-anywhere (requires temporary access for localhost)
        // const proxyUrl = 'https://cors-anywhere.herokuapp.com/';

        // Option 2: corsproxy.io (more reliable)
        const proxyUrl = 'https://corsproxy.io/?';

        // Option 3: allorigins.win
        // const proxyUrl = 'https://api.allorigins.win/raw?url=';

        // Construct the proxied URL
        const proxiedUrl = proxyUrl + encodeURIComponent(googleTTSUrl);

        // Create audio element and play
        const audio = new Audio(proxiedUrl);

        // Play the audio
        audio.play()
            .then(() => {
                console.log(`Playing TTS for: ${text} in ${language}`);
            })
            .catch(error => {
                console.error('TTS play failed:', error);

                // Fallback: Try browser's native speech synthesis
                if (useNativeSpeechSynthesis(text, language)) {
                    showNotification(`No internet`, 'info');
                } else {
                    showNotification('This function need Internet.', 'error');
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

// Helper function to reset TTS button
function resetTTSButton() {
    const ttsBtn = document.getElementById('googleTTSBtn');
    if (ttsBtn) {
        const icon = ttsBtn.querySelector('i');
        if (icon) {
            icon.className = 'fas fa-volume-up';
        }
        ttsBtn.disabled = false;
    }
}

// Fallback: Use browser's native speech synthesis
function useNativeSpeechSynthesis(text, language = 'en-US') {
    if (!('speechSynthesis' in window)) return false;

    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language;
    utterance.rate = 0.95;
    utterance.pitch = 1.05;
    utterance.volume = 1;

    const voices = speechSynthesis.getVoices();
    if (voices.length) {
        utterance.voice =
            voices.find(v => v.lang === language && v.name.includes('Google')) ||
            voices.find(v => v.lang.startsWith(language.split('-')[0])) ||
            voices[0];
    }

    utterance.onend = resetTTSButton;
    utterance.onerror = resetTTSButton;

    speechSynthesis.speak(utterance);
    return true;
}


// Add event listener to your TTS button
// In the DOMContentLoaded event listener, change the language to 'en'
document.addEventListener('DOMContentLoaded', function () {
    const ttsBtn = document.getElementById('googleTTSBtn');
    if (ttsBtn) {
        ttsBtn.addEventListener('click', function () {
            const popupWord = document.getElementById('popupWord');
            if (popupWord) {
                // Get the word text
                const wordText = popupWord.textContent || popupWord.innerText;

                // ALWAYS use English for TTS when reading English words
                const language = 'en'; // Force English

                // Call the TTS function
                playGoogleVoice(wordText, language);
            }
        });
    }
});