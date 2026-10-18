/* ==========================================================================
   settings-panel.js — shared "Custom CSS" settings-panel logic.
   --------------------------------------------------------------------------
   Classic script (plain <script> tag). Each page keeps its own modal markup
   (#customCSSModal ...) and configures behaviour with data-* attributes on
   the modal element, so the JavaScript is written once for every page:

       <div class="custom-css-modal" id="customCSSModal"
            data-storage-key="customCSSHome"
            data-important="simple"
            data-reset-confirm="Do you want to reset all style?"
            data-reset-font="false"> ... </div>

   data-storage-key  localStorage key that stores the custom CSS
                     (default: "customCSS")
   data-important    how !important is added: "simple" | "rule" | "reader"
                     (default: "simple")
   data-reset-confirm text shown by confirm() in "Reset all settings"
                     (default: "Do you want to reset all style?")
   data-reset-font   "true" to also reset reader font/TTS settings on reset
                     (default: "false")
   ========================================================================== */

function istSettingsModal() {
    return document.getElementById('customCSSModal');
}

function istSettingsInput() {
    return document.getElementById('customCSSInput');
}

function istSettingsConfig() {
    const modal = istSettingsModal();
    const data = (modal && modal.dataset) || {};
    // When the in-page modal has been removed, the page can still declare its
    // custom-CSS key/mode on <body> so the saved CSS keeps being applied.
    const body = (document.body && document.body.dataset) || {};
    return {
        storageKey: data.storageKey || body.cssKey || 'customCSS',
        important: data.important || body.cssImportant || 'simple',
        resetConfirm: data.resetConfirm || 'Do you want to reset all style?',
        resetFont: data.resetFont === 'true'
    };
}

// Whether this page should apply a custom-CSS sheet at all.
function istHasCustomCSS() {
    if (istSettingsModal()) return true;
    return !!(document.body && document.body.dataset && document.body.dataset.cssKey);
}

// Append !important to every CSS declaration, using the strategy the page uses.
function istAddImportant(css, mode) {
    if (mode === 'rule') {
        // Quiz editor: process rule by rule.
        return css.replace(/([^{]+)\{([^}]+)\}/g, function (match, selector, properties) {
            properties = properties.replace(
                /([a-zA-Z-]+)\s*:\s*([^;!}]+)(?![!important])/gi,
                '$1: $2 !important'
            );
            return selector + '{' + properties + '}';
        });
    }
    if (mode === 'reader') {
        // Reader: var()-aware variant.
        return css.replace(
            /([a-zA-Z\-]+)\s*:\s*([^;!}]+(?:var\([^)]+\)[^;!}]*)*)(?![!important])\s*(;|})/gi,
            '$1: $2 !important$3'
        );
    }
    // Default (main / vocabulary).
    return css.replace(/([a-zA-Z\-]+)\s*:\s*([^;!}]+)(?![!important])/gi, '$1: $2 !important');
}

// Apply custom CSS to page
function applyCustomCSS(css) {
    const existingStyle = document.getElementById('custom-css-style');
    if (existingStyle) {
        existingStyle.remove();
    }

    if (css && css.trim()) {
        const styleElement = document.createElement('style');
        styleElement.id = 'custom-css-style';
        styleElement.textContent = istAddImportant(css, istSettingsConfig().important);
        document.head.appendChild(styleElement);
        console.log('Custom CSS applied with !important on all properties');
    }
}

// Load saved custom CSS
function loadCustomCSS() {
    const savedCSS = localStorage.getItem(istSettingsConfig().storageKey) || '';
    const input = istSettingsInput();
    if (input) input.value = savedCSS;
    applyCustomCSS(savedCSS);
}

// Preview CSS without saving
function previewCustomCSS() {
    const input = istSettingsInput();
    const css = input ? input.value.trim() : '';
    applyCustomCSS(css);

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
    const input = istSettingsInput();
    if (!input) return;
    const css = input.value.trim();
    localStorage.setItem(istSettingsConfig().storageKey, css);
    applyCustomCSS(css);
    showNotification('Custom CSS saved successfully!', 'success');
    closeCustomCSSModal();
}

// Clear custom CSS
function clearCustomCSS() {
    if (confirm('Are you sure you want to clear all custom CSS?')) {
        const input = istSettingsInput();
        if (input) input.value = '';
        localStorage.removeItem(istSettingsConfig().storageKey);

        const existingStyle = document.getElementById('custom-css-style');
        if (existingStyle) {
            existingStyle.remove();
        }

        showNotification('Custom CSS cleared!', 'success');
    }
}

// Open custom CSS modal
function openCustomCSSModal() {
    const modal = istSettingsModal();
    const overlay = document.getElementById('cssModalOverlay');
    if (!modal) return;
    modal.classList.add('active');
    if (overlay) overlay.classList.add('active');
    document.body.style.overflow = 'hidden';

    const input = istSettingsInput();
    setTimeout(() => {
        if (input) input.focus();
    }, 300);
}

// Close custom CSS modal
function closeCustomCSSModal() {
    const modal = istSettingsModal();
    const overlay = document.getElementById('cssModalOverlay');
    if (modal) modal.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = '';
}

// Reset all settings: confirmation modal
function resetAllSettings() {
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
    setTimeout(() => confirmModal.classList.add('active'), 10);

    const overlay = document.createElement('div');
    overlay.className = 'css-modal-overlay active';
    document.body.appendChild(overlay);

    const dismiss = () => {
        confirmModal.classList.remove('active');
        overlay.classList.remove('active');
        setTimeout(() => {
            confirmModal.remove();
            overlay.remove();
        }, 300);
    };

    const cancelReset = document.getElementById('cancelReset');
    if (cancelReset) cancelReset.addEventListener('click', dismiss);

    const confirmReset = document.getElementById('confirmReset');
    if (confirmReset) {
        confirmReset.addEventListener('click', () => {
            performFullReset();
            dismiss();
        });
    }

    overlay.addEventListener('click', dismiss);
}

// Perform the actual reset
function performFullReset() {
    const config = istSettingsConfig();

    // Preserve the original wording/behaviour per page.
    const keepVocabulary = confirm(config.resetConfirm);

    localStorage.setItem('theme', 'light');
    localStorage.setItem('selectedColor', '#243d34');
    localStorage.setItem('selectedSecondaryColor', '#d38d70');
    localStorage.setItem(config.storageKey, '');

    if (config.resetFont) {
        localStorage.setItem('fontFamily', 'sans-serif');
        localStorage.setItem('ttsEnabled', false);
    }

    localStorage.removeItem('readingPosition');

    // Clear vocabulary if requested (only where the page supports it).
    if (!keepVocabulary && typeof renderVocabulary === 'function') {
        localStorage.removeItem('savedWords');
        try { savedWords = []; } catch (e) { /* not declared on this page */ }
        renderVocabulary();
        if (typeof updateVocabularyStats === 'function') updateVocabularyStats();
    }

    // Remove custom CSS
    const customStyle = document.getElementById('custom-css-style');
    if (customStyle) customStyle.remove();

    // Apply theme reset
    if (typeof applyTheme === 'function') {
        try { theme = 'light'; } catch (e) { /* ignore */ }
        applyTheme();
    }

    // Apply font reset (reader only)
    if (typeof storyText !== 'undefined' && storyText) {
        storyText.style.fontSize = '1.2rem';
        storyText.style.lineHeight = '1.8';
        storyText.style.fontFamily = 'sans-serif';
    }

    if (typeof fontSmaller !== 'undefined' && fontSmaller) fontSmaller.classList.remove('active');
    if (typeof fontNormal !== 'undefined' && fontNormal) fontNormal.classList.add('active');
    if (typeof fontLarger !== 'undefined' && fontLarger) fontLarger.classList.remove('active');
    if (typeof lineSpacingBtn !== 'undefined' && lineSpacingBtn) lineSpacingBtn.classList.remove('active');

    if (typeof ttsBtn !== 'undefined' && ttsBtn) {
        if (typeof sound !== 'undefined' && sound) sound.classList.remove('tts-open');
        ttsBtn.classList.remove('tts-active');
        ttsBtn.innerHTML = '<i class="fas fa-volume-up"></i> Enable';
        try { active = false; } catch (e) { /* ignore */ }
    }

    if (typeof fontFamilySelect !== 'undefined' && fontFamilySelect) {
        fontFamilySelect.value = 'sans-serif';
    }

    showNotification('All settings have been reset to default!', 'success');

    setTimeout(() => {
        location.reload();
    }, 1500);
}

// --- Wiring ------------------------------------------------------------- //
function istWireSettingsPanel() {
    const pairs = [
        ['showCustomCSS', openCustomCSSModal],
        ['closeCustomCSS', closeCustomCSSModal],
        ['saveCustomCSS', saveCustomCSS],
        ['clearCustomCSS', clearCustomCSS],
        ['previewCSS', previewCustomCSS],
        ['resetAllSettings', resetAllSettings]
    ];
    pairs.forEach(function (pair) {
        const node = document.getElementById(pair[0]);
        if (node) node.addEventListener('click', pair[1]);
    });

    const overlay = document.getElementById('cssModalOverlay');
    if (overlay) overlay.addEventListener('click', closeCustomCSSModal);

    document.addEventListener('keydown', function (e) {
        const modal = istSettingsModal();
        if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
            closeCustomCSSModal();
        }
    });
}

function istInitSettingsPanel() {
    istWireSettingsPanel();
    if (istHasCustomCSS()) loadCustomCSS();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', istInitSettingsPanel);
} else {
    istInitSettingsPanel();
}
