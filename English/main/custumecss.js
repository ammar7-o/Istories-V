



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

// Load saved custom CSS
function loadCustomCSS() {
    const savedCSS = localStorage.getItem('customCSSHome') || '';
    customCSSInput.value = savedCSS;
    applyCustomCSS(savedCSS);
}

// Apply custom CSS to page
function applyCustomCSS(css) {
    // Remove existing custom style element
    const existingStyle = document.getElementById('custom-css-style');
    if (existingStyle) {
        existingStyle.remove();
    }

    if (css.trim()) {
        // Create new style element
        const styleElement = document.createElement('style');
        styleElement.id = 'custom-css-style';
        
        // Automatically add !important to ALL CSS properties
        let processedCSS = css;
        
        // Pattern to match ALL CSS declarations without !important
        // This matches: property: value (without !important)
        const cssDeclarationPattern = /([a-zA-Z\-]+)\s*:\s*([^;!}]+)(?![!important])/gi;
        
        processedCSS = processedCSS.replace(cssDeclarationPattern, '$1: $2 !important');
        
        styleElement.textContent = processedCSS;
        
        // Insert at the END of head to override other styles
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
    localStorage.setItem('customCSSHome', css);
    applyCustomCSS(css);
    showNotification('Custom CSS saved successfully!', 'success');
    closeCustomCSSModal();
}

// Clear custom CSS
function clearCustomCSS() {
    if (confirm('Are you sure you want to clear all custom CSS?')) {
        customCSSInput.value = '';
        localStorage.removeItem('customCSSHome');

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

// Perform the actual reset
function performFullReset() {
    // Ask about vocabulary
    const keepVocabulary = confirm('Do you want to reset all style?');

    // Reset all localStorage items
    const defaultSettings = {
        // Theme
        theme: 'light',
        selectedColor: '#4a6cf7',
        selectedSecondaryColor: '#10b981',


        // Other
        customCSS: '',
        ttsEnabled: false
    };

    // Apply default settings
    localStorage.setItem('theme', defaultSettings.theme);
    localStorage.setItem('selectedColor', defaultSettings.selectedColor);
    localStorage.setItem('selectedSecondaryColor', defaultSettings.selectedSecondaryColor);
    localStorage.setItem('customCSSHome', defaultSettings.customCSS);

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