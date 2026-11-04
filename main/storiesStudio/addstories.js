// Stories Studio (add stories) page functionality
let userStories = JSON.parse(localStorage.getItem('userStories')) || [];
let userDictionaries = JSON.parse(localStorage.getItem('userDictionaries')) || {};
// IndexedDB is async: refresh these once storage is ready (before DOMContentLoaded init runs).
if (window.IStoriesStorage) IStoriesStorage.whenReady(function () {
    userStories = JSON.parse(localStorage.getItem('userStories')) || [];
    userDictionaries = JSON.parse(localStorage.getItem('userDictionaries')) || {};
});
let currentEditIndex = -1; // Track which story is being edited

/**
 * Persist the two user-data collections through the shared IndexedDB helper.
 * `IStoriesStorage` updates its synchronous mirror instantly, so the rest of
 * this page can keep reading `localStorage` as before.
 */
function saveUserData() {
    if (window.IStoriesUserData) {
        return IStoriesUserData.saveUserData({
            stories: userStories,
            dictionaries: userDictionaries
        });
    }
    localStorage.setItem('userStories', JSON.stringify(userStories));
    localStorage.setItem('userDictionaries', JSON.stringify(userDictionaries));
    return Promise.resolve();
}

// Initialize Add Stories page
function initAddStories() {
    // Add event listeners
    setupAddStoriesListeners();

    // Load existing user stories
    loadUserStories();
}

// Setup event listeners for Add Stories page
function setupAddStoriesListeners() {
    // File upload elements
    const browseBtn = document.getElementById('browseBtn');
    const storyFileInput = document.getElementById('storyFileInput');
    const uploadArea = document.getElementById('uploadArea');
    const removeFileBtn = document.getElementById('removeFile');
    const uploadBtn = document.getElementById('uploadBtn');

    // Form elements
    const storyForm = document.getElementById('storyForm');
    const previewBtn = document.getElementById('previewBtn');
    const downloadTemplateBtn = document.getElementById('downloadTemplateBtn');
    const copyJsonBtn = document.getElementById('copyJsonBtn');
    const loadExampleTranslationsBtn = document.getElementById('loadExampleTranslations');

    // Preview modal elements
    const closePreviewBtn = document.getElementById('closePreviewBtn');
    const closePreview = document.getElementById('closePreview');
    const saveFromPreviewBtn = document.getElementById('saveFromPreviewBtn');

    // Edit modal elements
    const closeEditModalBtn = document.getElementById('closeEditModalBtn');
    const closeEditModalBtn2 = document.getElementById('closeEditModalBtn2');
    const editStoryForm = document.getElementById('editStoryForm');
    const editStoryCoverType = document.getElementById('editStoryCoverType');
    const editStoryModal = document.getElementById('editStoryModal');

    // Export button
    const exportStoriesBtn = document.getElementById('exportStoriesBtn');

    // File upload functionality
    if (browseBtn && storyFileInput) {
        browseBtn.addEventListener('click', () => storyFileInput.click());
    }

    if (storyFileInput) {
        storyFileInput.addEventListener('change', handleFileSelect);
    }

    if (uploadArea) {
        // Drag and drop functionality
        uploadArea.addEventListener('dragover', handleDragOver);
        uploadArea.addEventListener('dragleave', handleDragLeave);
        uploadArea.addEventListener('drop', handleFileDrop);
        uploadArea.addEventListener('click', () => storyFileInput.click());
    }

    if (removeFileBtn) {
        removeFileBtn.addEventListener('click', clearSelectedFile);
    }

    if (uploadBtn) {
        uploadBtn.addEventListener('click', uploadStoryFile);
    }

    // Form functionality
    if (storyForm) {
        storyForm.addEventListener('submit', handleFormSubmit);
    }

    if (previewBtn) {
        previewBtn.addEventListener('click', showStoryPreview);
    }

    if (downloadTemplateBtn) {
        downloadTemplateBtn.addEventListener('click', downloadStoryTemplate);
    }

    if (copyJsonBtn) {
        copyJsonBtn.addEventListener('click', copyJsonExample);
    }

    if (loadExampleTranslationsBtn) {
        loadExampleTranslationsBtn.addEventListener('click', loadExampleTranslations);
    }

    // Preview modal functionality
    if (closePreviewBtn) {
        closePreviewBtn.addEventListener('click', closePreviewModal);
    }

    if (closePreview) {
        closePreview.addEventListener('click', closePreviewModal);
    }

    if (saveFromPreviewBtn) {
        saveFromPreviewBtn.addEventListener('click', saveStoryFromPreview);
    }

    // Edit modal functionality
    if (closeEditModalBtn) {
        closeEditModalBtn.addEventListener('click', closeEditModal);
    }

    if (closeEditModalBtn2) {
        closeEditModalBtn2.addEventListener('click', closeEditModal);
    }

    if (editStoryForm) {
        editStoryForm.addEventListener('submit', handleEditStorySubmit);
    }

    if (editStoryCoverType) {
        editStoryCoverType.addEventListener('change', updateEditCoverLabel);
    }

    // Export button functionality
    if (exportStoriesBtn) {
        exportStoriesBtn.addEventListener('click', exportUserStories);
    }

    // Close modals when clicking outside
    const previewModal = document.getElementById('previewModal');
    if (previewModal) {
        previewModal.addEventListener('click', (e) => {
            if (e.target === previewModal) {
                closePreviewModal();
            }
        });
    }

    if (editStoryModal) {
        editStoryModal.addEventListener('click', (e) => {
            if (e.target === editStoryModal) {
                closeEditModal();
            }
        });
    }
}

// Load user stories from localStorage
function loadUserStories() {
    const userStoriesList = document.getElementById('userStoriesList');
    if (!userStoriesList) return;

    userStoriesList.innerHTML = '';

    if (userStories.length === 0) {
        userStoriesList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-book-open"></i>
                <p>No stories uploaded yet</p>
            </div>
        `;
        return;
    }

    userStories.forEach((story, index) => {
        const storyItem = document.createElement('div');
        storyItem.className = 'story-item';

        const translationBadge = story.hasTranslations
            ? '<span class="translation-badge" title="Has custom translations"><i class="fas fa-language"></i></span>'
            : '';

        // Determine if it's an image cover
        const isImageCover = story.coverType === 'image' ||
            (story.cover && (story.cover.startsWith('http://') || story.cover.startsWith('https://')));

        // Create icon/emoji/image display
        let coverDisplay = '';
        if (isImageCover) {
            // For image covers, show a small thumbnail
            coverDisplay = `<div class="story-image-small" style="background-image: url('${story.cover}')"></div>`;
        } else if (story.coverType === 'icon') {
            coverDisplay = `<i class="${story.cover || 'fas fa-book'}"></i>`;
        } else {
            // Default to emoji
            coverDisplay = `<div class="story-emoji-small">${story.cover || '📚'}</div>`;
        }

        storyItem.innerHTML = `
        <div class="imtitle">
         <div class="story-icon">
                ${coverDisplay}
                ${translationBadge}
            </div>
            <div class="story-item-info">
                <span class="story-item-title">${story.title}</span>
                <span class="story-item-meta">
                    ${story.level} • ${story.wordCount || 'Unknown'} words • 
                    ${new Date(story.uploadDate).toLocaleDateString()}
                </span>
            </div>
        </div>
           
            <div class="story-item-actions">
                <button class="story-action-btn read-story-btn" title="Read Story" data-index="${index}">
                    <i class="fas fa-book-reader"></i>
                </button>
                <button class="story-action-btn share-story-btn" title="Share as JSON" data-index="${index}">
                    <i class="fas fa-share-alt"></i>
                </button>
                <button class="story-action-btn edit-story-btn" title="Edit Story" data-index="${index}">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="story-action-btn delete-story-btn" title="Delete Story" data-index="${index}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;

        userStoriesList.appendChild(storyItem);
    });

    // Add event listeners to buttons
    document.querySelectorAll('.read-story-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = parseInt(e.currentTarget.dataset.index);
            openUserStoryInReader(userStories[index].id);
        });
    });

    document.querySelectorAll('.share-story-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = parseInt(e.currentTarget.dataset.index);
            shareStoryAsJson(index);
        });
    });

    document.querySelectorAll('.edit-story-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = parseInt(e.currentTarget.dataset.index);
            openEditStoryModal(index);
        });
    });

    document.querySelectorAll('.delete-story-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = parseInt(e.currentTarget.dataset.index);
            deleteUserStory(index);
        });
    });
}

// Share story as JSON file - Add this new function
function shareStoryAsJson(index) {
    if (index < 0 || index >= userStories.length) {
        showNotification('Story not found.', 'error');
        return;
    }

    const story = userStories[index];
    const storyId = story.id;

    // Get translations for this story
    const translations = userDictionaries[storyId] || {};

    // Prepare the complete story object for export
    const exportStory = {
        title: story.title,
        lang: story.lang || 'en',
        level: story.level,
        cover: story.cover,
        coverType: story.coverType,
        content: story.content,
        author: story.author || '',
        uploadDate: story.uploadDate,
        wordCount: story.wordCount,
        // Include translations if they exist
        ...(Object.keys(translations).length > 0 && { translations: translations }),
        // Include optional fields
        ...(story.levelcefr && { levelcefr: story.levelcefr }),
        ...(story.sound && { sound: story.sound }),
        ...(story.dictionaries && { dictionaries: story.dictionaries }),
        ...(story.audio && { audio: story.audio })
    };

    // Convert to JSON string with nice formatting
    const jsonString = JSON.stringify(exportStory, null, 2);

    // Create a Blob with the JSON data
    const blob = new Blob([jsonString], { type: 'application/json' });

    // Create download URL
    const url = URL.createObjectURL(blob);

    // Create download link
    const a = document.createElement('a');
    a.href = url;

    // Create filename from story title (sanitize for filename)
    const sanitizedTitle = story.title
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '') // Remove special characters
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .substring(0, 50); // Limit length

    const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    a.download = `${sanitizedTitle}-${date}.json`;

    // Trigger download
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // Clean up
    URL.revokeObjectURL(url);

    // Show notification
    showNotification(`"${story.title}" exported as JSON file!`, 'success');
}

// Function to open edit modal
function openEditStoryModal(index) {
    currentEditIndex = index;
    const story = userStories[index];

    // Fill form with story data
    document.getElementById('editStoryTitle').value = story.title || '';
    document.getElementById('editStoryLevel').value = story.level || 'intermediate';
    const editStoryLanguage = document.getElementById('editStoryLanguage');
    if (editStoryLanguage) {
        editStoryLanguage.value = story.lang || 'en';
        // If the story uses a language that isn't in the list yet, add it so we
        // don't silently change the story's language when saving.
        if (editStoryLanguage.value !== (story.lang || 'en')) {
            const existingOpt = Array.from(editStoryLanguage.options).some(o => o.value === story.lang);
            if (!existingOpt) {
                const opt = document.createElement('option');
                opt.value = story.lang;
                opt.textContent = story.lang;
                editStoryLanguage.appendChild(opt);
            }
            editStoryLanguage.value = story.lang;
        }
        editStoryLanguage.dispatchEvent(new Event('change'));
    }
    document.getElementById('editStoryLevelCefr').value = story.levelcefr || '';
    document.getElementById('editStoryAuthor').value = story.author || '';
    document.getElementById('editStoryCoverType').value = story.coverType || 'emoji';
    document.getElementById('editStorySound').value = story.sound || '';
    document.getElementById('editStoryDictionaries').value = story.dictionaries ? story.dictionaries.join('\n') : '';

    // Set cover input based on type
    const editStoryCover = document.getElementById('editStoryCover');
    if (editStoryCover) {
        editStoryCover.value = story.cover || '📚';
        updateEditCoverLabel();
    }

    // Fill content
    const editStoryContent = document.getElementById('editStoryContent');
    if (editStoryContent) {
        editStoryContent.value = Array.isArray(story.content) ? story.content.join('\n') : story.content || '';
    }

    // Fill translations
    const editStoryTranslations = document.getElementById('editStoryTranslations');
    if (editStoryTranslations) {
        const storyId = story.id;
        if (userDictionaries[storyId]) {
            editStoryTranslations.value = JSON.stringify(userDictionaries[storyId], null, 2);
        } else {
            editStoryTranslations.value = '';
        }
    }

    // Show modal
    const editStoryModal = document.getElementById('editStoryModal');
    if (editStoryModal) {
        editStoryModal.classList.add('show');
    }
}

// Update cover label for edit modal
function updateEditCoverLabel() {
    const editStoryCoverType = document.getElementById('editStoryCoverType');
    const editCoverLabel = document.getElementById('editCoverLabel');
    const editStoryCover = document.getElementById('editStoryCover');

    if (editStoryCoverType && editCoverLabel && editStoryCover) {
        const coverType = editStoryCoverType.value;

        if (coverType === 'emoji') {
            editCoverLabel.textContent = 'Emoji';
            editStoryCover.placeholder = '📚';
        } else if (coverType === 'icon') {
            editCoverLabel.textContent = 'Font Awesome Icon';
            editStoryCover.placeholder = 'fas fa-book';
        } else if (coverType === 'image') {
            editCoverLabel.textContent = 'Image URL';
            editStoryCover.placeholder = 'https://example.com/image.jpg';
        }
    }
}

// Handle edit story form submission
function handleEditStorySubmit(e) {
    e.preventDefault();

    if (currentEditIndex === -1) {
        showNotification('No story selected for editing.', 'error');
        return;
    }

    const story = userStories[currentEditIndex];
    const storyId = story.id;

    // Get form values
    const title = document.getElementById('editStoryTitle').value.trim();
    const level = document.getElementById('editStoryLevel').value;
    const lang = (document.getElementById('editStoryLanguage') || {}).value || story.lang || 'en';
    const levelcefr = document.getElementById('editStoryLevelCefr').value;
    const author = document.getElementById('editStoryAuthor').value.trim();
    const coverType = document.getElementById('editStoryCoverType').value;
    const cover = document.getElementById('editStoryCover').value.trim();
    const sound = document.getElementById('editStorySound').value.trim();
    const dictionariesText = document.getElementById('editStoryDictionaries').value.trim();
    const contentText = document.getElementById('editStoryContent').value.trim();
    const translationsText = document.getElementById('editStoryTranslations').value.trim();

    // Validation
    if (!title || !level || !contentText) {
        showNotification('Please fill in all required fields.', 'error');
        return;
    }

    // Process content
    const content = contentText.split('\n').filter(line => line.trim() !== '');
    const wordCount = calculateWordCount(content);

    // Process dictionaries
    let dictionaries = undefined;
    if (dictionariesText) {
        dictionaries = dictionariesText.split('\n')
            .map(line => line.trim())
            .filter(line => line !== '');
    }

    // Update story in userStories array
    userStories[currentEditIndex] = {
        ...story,
        title,
        lang,
        level,
        levelcefr: levelcefr || undefined,
        author: author || '',
        coverType,
        cover: cover || (coverType === 'emoji' ? '📚' : 'fas fa-book'),
        sound: sound || undefined,
        dictionaries: dictionaries,
        content,
        wordCount,
        hasTranslations: translationsText.trim() !== '',
        // Editing is not a new import: keep the original added date.
        uploadDate: story.uploadDate || new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    // Update in main stories array
    const storyIndex = stories.findIndex(s => s.id === storyId);
    if (storyIndex !== -1) {
        stories[storyIndex] = { ...userStories[currentEditIndex] };
    }

    // Update translations if provided
    if (translationsText) {
        try {
            const translations = JSON.parse(translationsText);
            userDictionaries[storyId] = translations;
            showNotification(`${Object.keys(translations).length} translations saved.`, 'success');
        } catch (error) {
            showNotification('Invalid translations format. Translations not updated.', 'error');
        }
    } else {
        // Remove translations if cleared
        delete userDictionaries[storyId];
    }

    // Save to IndexedDB (through the shared user-data helper)
    saveUserData();

    // Update UI
    loadUserStories();
    if (currentPage === 'home' || currentPage === 'addStories') {
        renderStories();
    }

    // Close modal
    closeEditModal();

    // Show success message
    showNotification('Story updated successfully!', 'success');
}

// Close edit modal
function closeEditModal() {
    const editStoryModal = document.getElementById('editStoryModal');
    if (editStoryModal) {
        editStoryModal.classList.remove('show');
    }
    currentEditIndex = -1;

    // Reset form
    const editStoryForm = document.getElementById('editStoryForm');
    if (editStoryForm) {
        editStoryForm.reset();
    }
}

// Process story data - handles single stories, arrays and { stories: [...] }
// Returns { imported, skipped, invalid, stories } so callers (PDF/source picker)
// can react without parsing notifications.
function processStoryData(storyData, fileName, options) {
    options = options || {};

    let processedStories = [];
    let totalImported = 0;
    let skippedDuplicates = 0;
    let invalidStories = 0;

    const sourceFileName = options.sourceFile || fileName || '';
    const helper = window.IStoriesUserData;

    function storySignature(story) {
        if (helper) return helper.storySignature(story);
        return String(story && story.title || '').toLowerCase() + '|' +
            JSON.stringify(story && story.content || []);
    }

    // Include stories already saved *and* stories earlier in this same batch,
    // so a database that repeats a story cannot import it twice.
    const seenSignatures = new Set(userStories.map(storySignature));

    function handleOne(story) {
        const result = processSingleStory(story, sourceFileName, options);
        if (result.success) {
            const signature = storySignature(result.story);
            if (seenSignatures.has(signature)) {
                skippedDuplicates++;
                return;
            }
            seenSignatures.add(signature);
            processedStories.push(result.story);
            totalImported++;
        } else if (result.reason === 'Duplicate') {
            skippedDuplicates++;
        } else {
            invalidStories++;
        }
    }

    if (Array.isArray(storyData)) {
        storyData.forEach(handleOne);
    } else if (storyData && Array.isArray(storyData.stories)) {
        storyData.stories.forEach(handleOne);
    } else if (storyData && typeof storyData === 'object') {
        handleOne(storyData);
    } else {
        invalidStories++;
    }

    // Save all imported stories to IndexedDB
    if (processedStories.length > 0) {
        userStories.push(...processedStories);
        saveUserData();

        // Add all new stories to main stories array
        processedStories.forEach(story => {
            if (!stories.some(s => s.id === story.id)) {
                stories.push(story);
            }
        });
    }

    // Update UI
    loadUserStories();
    if (currentPage === 'home' || currentPage === 'addStories') {
        renderStories();
    }

    // Show success message unless the caller renders its own status
    if (options.notify !== false) {
        let message = '';
        if (totalImported > 0) {
            message = `${totalImported} story${totalImported !== 1 ? 's' : ''} imported successfully!`;
            if (skippedDuplicates > 0) {
                message += ` ${skippedDuplicates} duplicate${skippedDuplicates !== 1 ? 's' : ''} skipped.`;
            }
            showNotification(message, 'success');
        } else if (invalidStories > 0) {
            showNotification('No stories were imported. They may already exist or have invalid format.', 'warning');
        } else {
            showNotification('No stories were imported. They may already exist.', 'warning');
        }
    }

    // Clear file selection when this came from the JSON upload card
    if (options.clearFile !== false) {
        clearSelectedFile();
    }

    // Open the first imported story in reader if only one was imported
    if (options.autoOpen !== false && totalImported === 1 && processedStories.length > 0) {
        openUserStoryInReader(processedStories[0].id);
    }

    return {
        imported: totalImported,
        skipped: skippedDuplicates,
        invalid: invalidStories,
        stories: processedStories
    };
}

// Helper function to process a single story
function processSingleStory(storyData, fileName, options) {
    options = options || {};
    const helper = window.IStoriesUserData;

    // Normalise content first so a string is accepted as well as an array
    const content = helper
        ? helper.normalizeContent(storyData && storyData.content)
        : (Array.isArray(storyData && storyData.content) ? storyData.content : []);

    if (!storyData || !validateStory({ ...storyData, content })) {
        return { success: false, reason: 'Invalid format' };
    }

    // Check if story already exists (by a stable language+title+content signature)
    const signature = helper ? helper.storySignature({ ...storyData, content }) : '';
    const existingStory = userStories.find(story => {
        if (helper) return helper.storySignature(story) === signature;
        return story.title === storyData.title &&
            JSON.stringify(story.content) === JSON.stringify(storyData.content);
    });

    if (existingStory) {
        return { success: false, reason: 'Duplicate' };
    }

    // Process translations if they exist
    let translations = {};
    if (storyData.translations && typeof storyData.translations === 'object') {
        translations = storyData.translations;
    }

    // Generate unique ID
    const storyId = 'user_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 11);

    const fileNameResolved = options.sourceFile || fileName || storyData.fileName || '';
    const sourceType = options.sourceType ||
        storyData.sourceType ||
        (helper ? helper.inferSourceType({ ...storyData, fileName: fileNameResolved, sourceFile: fileNameResolved }) : 'unknown');

    const tags = helper
        ? helper.normalizeTags(storyData.tags)
        : (Array.isArray(storyData.tags) ? storyData.tags.slice() : []);

    // Prepare story object
    const userStory = {
        ...storyData,
        id: storyId,
        lang: storyData.lang || 'en',
        content,
        tags,
        isUserStory: true,
        fileName: fileNameResolved,
        sourceType,
        sourceFile: options.sourceFile || storyData.sourceFile || fileNameResolved,
        sourceLabel: options.sourceLabel ||
            (helper ? helper.sourceLabel({ sourceType, sourceFile: fileNameResolved, fileName: fileNameResolved }) : ''),
        importedAt: options.importedAt || new Date().toISOString(),
        uploadDate: new Date().toISOString(),
        wordCount: calculateWordCount(content),
        hasTranslations: Object.keys(translations).length > 0
    };

    if (options.pdfMeta || storyData.pdfMeta) {
        userStory.pdfMeta = { ...(storyData.pdfMeta || {}), ...(options.pdfMeta || {}) };
    }
    if (options.sourceName) userStory.sourceName = options.sourceName;
    if (options.tags && options.tags.length) {
        const extraTags = helper ? helper.normalizeTags(options.tags) : options.tags;
        extraTags.forEach(tag => {
            if (!userStory.tags.some(existing => String(existing).toLowerCase() === String(tag).toLowerCase())) {
                userStory.tags.push(tag);
            }
        });
    }

    // Keep translations out of the story object
    delete userStory.translations;

    // Save translations separately if they exist
    if (Object.keys(translations).length > 0) {
        userDictionaries[storyId] = translations;
    }

    return { success: true, story: userStory };
}

// Open user story in reader - Updated to include translations
function openUserStoryInReader(storyId) {
    // Find the story
    const story = userStories.find(s => s.id === storyId) ||
        stories.find(s => s.id === storyId);

    if (!story) {
        showNotification('Story not found.', 'error');
        return;
    }

    // Get translations for this story
    const translations = userDictionaries[storyId] || {};

    // Store story data in IndexedDB for the reader and redirect once it is committed.
    if (window.IStoriesUserData) {
        IStoriesUserData.openStoryInReader(story, {
            isUserStory: true,
            translations: translations,
            sourceType: IStoriesUserData.inferSourceType(story),
            sourceFile: story.sourceFile || story.fileName || ''
        });
        return;
    }

    // Fallback for pages that did not load userdata.js
    localStorage.setItem('currentReadingStory', JSON.stringify({
        id: story.id,
        title: story.title,
        lang: story.lang || 'en',
        level: story.level,
        content: story.content,
        isUserStory: true,
        cover: story.cover,
        coverType: story.coverType,
        author: story.author || '',
        translations: translations,
        ...(story.levelcefr && { levelcefr: story.levelcefr }),
        ...(story.sound && { sound: story.sound }),
        ...(story.dictionaries && { dictionaries: story.dictionaries }),
        ...(story.audio && { audio: story.audio })
    }));

    const storyPage = '../reader/index.html?id=' + storyId + '&userStory=true';
    window.location.href = storyPage;
}

// Delete user story
function deleteUserStory(index) {
    if (confirm('Are you sure you want to delete this story? This will also delete all associated translations. This action cannot be undone.')) {
        const storyId = userStories[index].id;

        // Remove from userStories array
        userStories.splice(index, 1);

        // Remove from stories array
        const storyIndex = stories.findIndex(s => s.id === storyId);
        if (storyIndex !== -1) {
            stories.splice(storyIndex, 1);
        }

        // Remove translations
        delete userDictionaries[storyId];

        // Update IndexedDB
        saveUserData();

        // Update UI
        loadUserStories();
        if (currentPage === 'home' || currentPage === 'addStories') {
            renderStories();
        }

        showNotification('Story and translations deleted successfully.', 'success');
    }
}

// Helper functions (keep all your existing ones):
function loadExampleTranslations() {
    const exampleTranslations = {
        "hello": { "translation": "مرحبا" },
        "world": { "translation": "عالم" },
        "book": { "translation": "كتاب" }
    };

    document.getElementById('storyTranslations').value = JSON.stringify(exampleTranslations, null, 2);
    showNotification('Example translations loaded!', 'success');
}

function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file && file.type === 'application/json') {
        displaySelectedFile(file);
    } else {
        showNotification('Please select a valid JSON file.', 'error');
    }
}

function handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    const uploadArea = document.getElementById('uploadArea');
    if (uploadArea) {
        uploadArea.style.borderColor = 'var(--primary-dark)';
        uploadArea.style.background = 'rgba(255, 255, 255, 0.3)';
    }
}

function handleDragLeave(e) {
    e.preventDefault();
    e.stopPropagation();
    const uploadArea = document.getElementById('uploadArea');
    if (uploadArea) {
        uploadArea.style.borderColor = 'var(--primary)';
        uploadArea.style.background = 'rgba(255, 255, 255, 0.1)';
    }
}

function handleFileDrop(e) {
    e.preventDefault();
    e.stopPropagation();

    const uploadArea = document.getElementById('uploadArea');
    if (uploadArea) {
        uploadArea.style.borderColor = 'var(--primary)';
        uploadArea.style.background = 'rgba(255, 255, 255, 0.1)';
    }

    const files = e.dataTransfer.files;
    if (files.length > 0) {
        const file = files[0];
        if (file.type === 'application/json') {
            displaySelectedFile(file);
        } else {
            showNotification('Please drop a valid JSON file.', 'error');
        }
    }
}

function displaySelectedFile(file) {
    const selectedFileInfo = document.getElementById('selectedFileInfo');
    const fileName = document.getElementById('fileName');
    const fileSize = document.getElementById('fileSize');
    const uploadBtn = document.getElementById('uploadBtn');

    if (selectedFileInfo && fileName && fileSize && uploadBtn) {
        fileName.textContent = file.name;
        fileSize.textContent = formatFileSize(file.size);
        selectedFileInfo.style.display = 'block';
        uploadBtn.disabled = false;
    }
}

function clearSelectedFile() {
    const storyFileInput = document.getElementById('storyFileInput');
    const selectedFileInfo = document.getElementById('selectedFileInfo');
    const uploadBtn = document.getElementById('uploadBtn');

    if (storyFileInput && selectedFileInfo && uploadBtn) {
        storyFileInput.value = '';
        selectedFileInfo.style.display = 'none';
        uploadBtn.disabled = true;
    }
}

function uploadStoryFile() {
    const storyFileInput = document.getElementById('storyFileInput');
    if (!storyFileInput || !storyFileInput.files[0]) return;

    const file = storyFileInput.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
        try {
            const storyData = JSON.parse(e.target.result);
            processStoryData(storyData, file.name);
        } catch (error) {
            showNotification('Error parsing JSON file: ' + error.message, 'error');
        }
    };

    reader.onerror = function () {
        showNotification('Error reading file.', 'error');
    };

    reader.readAsText(file);
}

// UPDATED validateStory to handle optional fields
function validateStory(story) {
    const requiredFields = ['title', 'level', 'content'];

    // Check required fields
    for (const field of requiredFields) {
        if (!story[field]) {
            return false;
        }
    }

    // Check content is array
    if (!Array.isArray(story.content) || story.content.length === 0) {
        return false;
    }

    // Check level is valid
    const validLevels = ['beginner', 'intermediate', 'advanced'];
    if (!validLevels.includes(story.level)) {
        return false;
    }

    // Check language is a valid, known code when present
    if (story.lang && !/^[a-z]{2}(-[A-Za-z]{2,4})?$/.test(story.lang)) {
        return false;
    }

    // Check optional fields if they exist
    if (story.coverType && !['emoji', 'icon', 'image'].includes(story.coverType)) {
        return false;
    }

    if (story.levelcefr && !['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].includes(story.levelcefr)) {
        return false;
    }

    return true;
}

function calculateWordCount(content) {
    return content.join(' ').split(/\s+/).length;
}

function handleFormSubmit(e) {
    e.preventDefault();

    const title = document.getElementById('storyTitle').value.trim();
    const level = document.getElementById('storyLevel').value;
    const lang = (document.getElementById('storyLanguage') || {}).value || 'en';
    const levelcefr = document.getElementById('storyLevelCefr').value;
    const cover = document.getElementById('storyCover').value.trim() || '📚';
    const coverType = document.getElementById('storyCoverType').value;
    const sound = document.getElementById('storySound').value.trim();
    const dictionariesText = document.getElementById('storyDictionaries').value.trim();
    const contentText = document.getElementById('storyContent').value.trim();
    const author = document.getElementById('storyAuthor').value.trim();
    const translationsText = document.getElementById('storyTranslations').value.trim();

    if (!title || !level || !contentText) {
        showNotification('Please fill in all required fields.', 'error');
        return;
    }

    // Split content into paragraphs
    const content = contentText.split('\n').filter(line => line.trim() !== '');

    // Process dictionaries
    let dictionaries = undefined;
    if (dictionariesText) {
        dictionaries = dictionariesText.split('\n')
            .map(line => line.trim())
            .filter(line => line !== '');
    }

    // Create story object
    const storyData = {
        title: title,
        lang: lang,
        level: level,
        cover: cover,
        coverType: coverType,
        content: content,
        author: author || '',
        tags: ['custom']
    };

    // Add optional fields if they exist
    if (levelcefr) storyData.levelcefr = levelcefr;
    if (sound) storyData.sound = sound;
    if (dictionaries && dictionaries.length > 0) storyData.dictionaries = dictionaries;

    // Add translations if provided
    if (translationsText) {
        try {
            const translations = JSON.parse(translationsText);
            storyData.translations = translations;
        } catch (error) {
            showNotification('Invalid translations format. Please check the JSON syntax.', 'error');
            return;
        }
    }

    // Process the story
    processStoryData(storyData, 'manual_entry.json');

    // Reset form
    e.target.reset();
    document.getElementById('storyCover').value = '📚';
    document.getElementById('storyLanguage').value = 'en';
    document.getElementById('storyLevelCefr').value = '';
    document.getElementById('storySound').value = '';
    document.getElementById('storyDictionaries').value = '';

    // Keep the language hint in sync with the programmatic reset above
    const langSelectAfterReset = document.getElementById('storyLanguage');
    if (langSelectAfterReset) langSelectAfterReset.dispatchEvent(new Event('change'));
}

function showStoryPreview() {
    const title = document.getElementById('storyTitle').value.trim();
    const level = document.getElementById('storyLevel').value;
    const levelcefr = document.getElementById('storyLevelCefr').value;
    const lang = (document.getElementById('storyLanguage') || {}).value || 'en';
    const cover = document.getElementById('storyCover').value.trim() || '📚';
    const coverType = document.getElementById('storyCoverType').value;
    const sound = document.getElementById('storySound').value.trim();
    const dictionariesText = document.getElementById('storyDictionaries').value.trim();
    const contentText = document.getElementById('storyContent').value.trim();
    const author = document.getElementById('storyAuthor').value.trim();
    const translationsText = document.getElementById('storyTranslations').value.trim();

    if (!title || !level || !contentText) {
        showNotification('Please fill in all required fields to preview.', 'error');
        return;
    }

    // Update preview modal
    document.getElementById('previewTitle').textContent = title;
    document.getElementById('previewLevel').textContent = level;
    document.getElementById('previewLevel').className = `preview-level ${level}`;

    // Update language badge (depends on the story lang)
    const previewLang = document.getElementById('previewLang');
    if (previewLang) {
        previewLang.innerHTML = `<i class="fas fa-globe"></i> ${langDisplayName(lang)}`;
        previewLang.className = 'preview-lang story-lang-badge' + (isRtlLang(lang) ? ' rtl' : '');
    }

    // Update CEFR level if provided
    const previewCefr = document.getElementById('previewCefr');
    if (previewCefr) {
        if (levelcefr) {
            previewCefr.textContent = levelcefr;
            previewCefr.style.display = 'inline-block';
        } else {
            previewCefr.style.display = 'none';
        }
    }

    // Update cover display
    if (coverType === 'emoji') {
        document.getElementById('previewCoverDisplay').textContent = cover;
        document.getElementById('previewCoverDisplay').innerHTML = cover;
    } else if (coverType === 'icon') {
        document.getElementById('previewCoverDisplay').innerHTML = `<i class="${cover}"></i>`;
    } else {
        document.getElementById('previewCoverDisplay').innerHTML = `<div class="story-image-small" style="background-image: url('${cover}')"></div>`;
    }

    // Update audio badge if sound is provided
    const previewAudioBadge = document.getElementById('previewAudioBadge');
    if (previewAudioBadge) {
        if (sound) {
            previewAudioBadge.style.display = 'inline-block';
        } else {
            previewAudioBadge.style.display = 'none';
        }
    }

    // Show dictionaries badge if provided
    const previewDictionariesBadge = document.createElement('span');
    previewDictionariesBadge.id = 'previewDictionariesBadge';
    if (dictionariesText) {
        const dictionariesCount = dictionariesText.split('\n').filter(line => line.trim() !== '').length;
        previewDictionariesBadge.innerHTML = `<i class="fas fa-book"></i> ${dictionariesCount} dictionary${dictionariesCount !== 1 ? 's' : ''}`;
        previewDictionariesBadge.style.display = 'inline-block';
        previewDictionariesBadge.style.marginLeft = '10px';
    } else {
        previewDictionariesBadge.style.display = 'none';
    }

    // Add dictionaries badge to preview meta if not already there
    const previewMeta = document.querySelector('.preview-meta');
    if (previewMeta && !document.getElementById('previewDictionariesBadge')) {
        previewMeta.appendChild(previewDictionariesBadge);
    }

    // Calculate word count
    const content = contentText.split('\n').filter(line => line.trim() !== '');
    const wordCount = calculateWordCount(content);
    document.getElementById('previewWordCount').textContent = wordCount;

    // Display author
    document.getElementById('previewAuthor').textContent = author || 'Anonymous';

    // Display content
    const previewText = document.getElementById('previewText');
    previewText.innerHTML = content.map(para => `<p>${para}</p>`).join('');

    // Display translations if any
    const translationsSection = document.getElementById('previewTranslationsSection');
    const translationsList = document.getElementById('previewTranslationsList');

    if (translationsText) {
        try {
            const translations = JSON.parse(translationsText);
            const translationCount = Object.keys(translations).length;

            translationsList.innerHTML = '';
            for (const [word, data] of Object.entries(translations)) {
                const translation = typeof data === 'string' ? data : (data.translation || 'No translation');
                const item = document.createElement('div');
                item.className = 'translation-item';
                item.innerHTML = `
                    <span class="translation-word">${word}</span>
                    <span class="translation-meaning">${translation}</span>
                `;
                translationsList.appendChild(item);
            }

            const countElement = document.createElement('div');
            countElement.className = 'translation-count';
            countElement.textContent = `${translationCount} custom translation${translationCount !== 1 ? 's' : ''}`;
            translationsList.appendChild(countElement);

            translationsSection.style.display = 'block';
        } catch (error) {
            translationsSection.style.display = 'none';
        }
    } else {
        translationsSection.style.display = 'none';
    }

    // Show modal
    document.getElementById('previewModal').classList.add('show');
}

function closePreviewModal() {
    document.getElementById('previewModal').classList.remove('show');
}

function saveStoryFromPreview() {
    handleFormSubmit(new Event('submit'));
    closePreviewModal();
}

function downloadStoryTemplate() {
    const template = {
        "stories": [
            {
                "title": "The Adventure Begins",
                "lang": "en",
                "level": "intermediate",
                "levelcefr": "A2",
                "cover": "🏝️",
                "coverType": "emoji",
                "sound": "../sounds/story1.mp3",
                "dictionaries": [
                    "../../database/Dictionarys/story4.json",
                    "../../database/Dictionarys/main.json"
                ],
                "content": [
                    "Once upon a time, in a small village nestled between mountains...",
                    "The young hero set out on a journey filled with challenges and discoveries.",
                    "Each step brought new lessons and unforgettable experiences."
                ],
                "author": "Your Name",
                "translations": {
                    "village": { "translation": "قرية" },
                    "journey": { "translation": "رحلة" },
                    "mountains": { "translation": "جبال" },
                    "hero": { "translation": "بطل" },
                    "challenges": { "translation": "تحديات" },
                    "discoveries": { "translation": "اكتشافات" },
                    "lessons": { "translation": "دروس" },
                    "experiences": { "translation": "تجارب" }
                }
            },
            {
                "title": "My Custom Story",
                "lang": "en",
                "level": "beginner",
                "levelcefr": "A1",
                "cover": "📚",
                "coverType": "emoji",
                "content": [
                    "Hello and welcome to <span class='mark'>IStories!</span> This website was created to help people learn languages in a fun way.",
                    "Each story is designed for different learning levels - beginner, intermediate, and advanced."
                ],
                "author": "Another Author",
                "translations": {
                    "hello": { "translation": "مرحبا" },
                    "world": { "translation": "عالم" },
                    "book": { "translation": "كتاب" }
                }
            }
        ]
    };

    const templateStr = JSON.stringify(template, null, 2);
    const blob = new Blob([templateStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'stories-template.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showNotification('Template downloaded successfully!', 'success');
}

/**
 * Strip `//` line comments and block comments from JSON-ish text so the
 * annotated examples on this page can still be parsed. Comment markers that
 * appear inside a string (e.g. "https://example.com") are left untouched.
 */
function stripJsonComments(text) {
    let out = '';
    let inString = false;
    let escaped = false;

    for (let i = 0; i < text.length; i++) {
        const ch = text[i];

        if (inString) {
            out += ch;
            if (escaped) escaped = false;
            else if (ch === '\\') escaped = true;
            else if (ch === '"') inString = false;
            continue;
        }

        if (ch === '"') {
            inString = true;
            out += ch;
            continue;
        }

        // Line comment — skip to the end of the line.
        if (ch === '/' && text[i + 1] === '/') {
            while (i < text.length && text[i] !== '\n') i++;
            continue;
        }

        // Block comment — skip to the closing marker.
        if (ch === '/' && text[i + 1] === '*') {
            i += 2;
            while (i < text.length && !(text[i] === '*' && text[i + 1] === '/')) i++;
            i++;
            continue;
        }

        out += ch;
    }

    return out;
}

function copyJsonExample() {
    // The on-screen example carries `// #hashtag` notes; strip them so what we
    // hand to the user is plain, valid JSON.
    const jsonExample = stripJsonComments(document.getElementById('jsonExample').textContent);
    navigator.clipboard.writeText(jsonExample)
        .then(() => showNotification('JSON example copied to clipboard!', 'success'))
        .catch(err => showNotification('Failed to copy: ' + err, 'error'));
}

// Initialize Add Stories page when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    // Load user dictionaries
    try {
        const storedDictionaries = localStorage.getItem('userDictionaries');
        if (storedDictionaries) {
            userDictionaries = JSON.parse(storedDictionaries);
        }
    } catch (error) {
        console.error('Error loading user dictionaries:', error);
        userDictionaries = {};
    }

    // Initialize Add Stories
    initAddStories();

    // Language pickers: live helper text under the dropdown
    setupLanguagePickers();

    // Deep link from My Stories: ?edit=<storyId> opens the edit modal.
    const editId = new URLSearchParams(window.location.search).get('edit');
    if (editId) {
        const openRequestedStory = function (list) {
            const index = list.findIndex(story => String(story.id) === String(editId));
            if (index !== -1) {
                userStories = list;
                // Let the page finish its initial render before opening the modal.
                setTimeout(() => openEditStoryModal(index), 60);
            } else {
                showNotification('That story could not be found. It may have been deleted.', 'warning');
            }
        };

        if (window.IStoriesUserData) {
            IStoriesUserData.getUserStories().then(openRequestedStory);
        } else {
            openRequestedStory(userStories);
        }
    }
});

// Keep the little hint under the language <select> in sync with the choice.
function setupLanguagePickers() {
    const pairs = [
        { select: 'storyLanguage', hint: 'storyLanguageHint' },
        { select: 'editStoryLanguage', hint: 'editStoryLanguageHint' }
    ];

    pairs.forEach(({ select: selectId, hint: hintId }) => {
        const select = document.getElementById(selectId);
        const hint = document.getElementById(hintId);
        if (!select || !hint) return;

        const update = () => {
            const code = select.value || 'en';
            const isRtl = (typeof isRtlLang === 'function' && isRtlLang(code));
            const name = (typeof langDisplayName === 'function') ? langDisplayName(code) : code;
            const i18n = window.IStoriesI18n;
            const dir = i18n
                ? i18n.t(isRtl ? 'studio.direction.rtl' : 'studio.direction.ltr')
                : (isRtl ? 'right-to-left' : 'left-to-right');
            const text = i18n
                ? i18n.t('studio.langHint', { name: name, direction: dir })
                : `${name} · ${dir} · read with a ${name} voice`;
            hint.textContent = `${langFlag(code) ? langFlag(code) + '  ' : ''}${text}`;
        };

        // Refresh the hint when the interface language changes too.
        document.addEventListener('ist-language-change', update);

        select.addEventListener('change', update);
        update();
    });
}


// Function to export all user stories from localStorage
function exportUserStories() {
    try {
        // 1. Get user stories from localStorage
        const storedUserStories = JSON.parse(localStorage.getItem('userStories')) || [];

        // 2. Check if there are any stories to export
        if (storedUserStories.length === 0) {
            alert('⚠️ No user stories found to export!');
            return;
        }

        // 3. Format each story to match the exact structure
        const formattedStories = storedUserStories.map(story => {
            // Get translations for this story
            const storyTranslations = userDictionaries[story.id] || {};

            // Create base story object with all required fields
            const formattedStory = {
                "title": story.title || "Untitled Story",
                "lang": story.lang || "en",
                "level": story.level || "beginner",
                "cover": story.cover || "",
                "coverType": story.coverType || "emoji",
                "content": story.content || [""],
                "author": story.author || "Anonymous",
                "uploadDate": story.uploadDate || new Date().toISOString(),
                "wordCount": story.wordCount || 0
            };

            // Add translations if they exist
            if (Object.keys(storyTranslations).length > 0) {
                formattedStory.translations = storyTranslations;
            }

            // Add optional fields ONLY if they exist in the original story
            if (story.levelcefr) formattedStory.levelcefr = story.levelcefr;
            if (story.sound) formattedStory.sound = story.sound;
            if (story.dictionaries) formattedStory.dictionaries = story.dictionaries;
            if (story.audio !== undefined) formattedStory.audio = story.audio;
            // Add any other optional fields that might exist
            if (story.id !== undefined) formattedStory.id = story.id;

            return formattedStory;
        });

        // 4. Create the final export structure
        const exportData = {
            "stories": formattedStories
        };

        // 5. Convert to JSON string with proper formatting (4 spaces indentation)
        const jsonString = JSON.stringify(exportData, null, 4);

        // 6. Create a blob (file-like object)
        const blob = new Blob([jsonString], {
            type: 'application/json'
        });

        // 7. Create a temporary URL for the blob
        const url = URL.createObjectURL(blob);

        // 8. Create an invisible download link
        const downloadLink = document.createElement('a');
        downloadLink.href = url;

        // 9. Set the filename
        const date = new Date();
        const dateString = date.toISOString().split('T')[0]; // YYYY-MM-DD
        const timeString = date.getHours().toString().padStart(2, '0') +
            date.getMinutes().toString().padStart(2, '0');
        downloadLink.download = `stories-export-${dateString}-${timeString}.json`;

        // 10. Add link to page, click it, then remove it
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);

        // 11. Clean up the temporary URL
        URL.revokeObjectURL(url);

        // 12. Show success message
        console.log(`✅ Successfully exported ${storedUserStories.length} user stories`);

        // Show notification
        showExportSuccess(storedUserStories.length, downloadLink.download);

    } catch (error) {
        // 13. Handle any errors
        console.error('❌ Error exporting user stories:', error);
        alert('❌ Failed to export user stories. Error: ' + error.message);
    }
}
// Function to delete all user stories
function deleteAllUserStories() {
    if (userStories.length === 0) {
        alert('⚠️ No user stories found to delete!');
        return;
    }

    // Show confirmation dialog
    const confirmed = confirm(`⚠️ WARNING: Are you sure you want to delete ALL ${userStories.length} user stories?\n\nThis will delete all uploaded stories and custom translations. This action cannot be undone!`);

    if (!confirmed) {
        return;
    }

    try {
        // 1. Remove user stories from main stories array
        userStories.forEach(userStory => {
            const index = stories.findIndex(s => s.id === userStory.id);
            if (index !== -1) {
                stories.splice(index, 1);
            }
        });

        // 2. Clear user stories array
        const deletedCount = userStories.length;
        userStories = [];

        // 3. Clear user dictionaries
        userDictionaries = {};

        // 4. Update IndexedDB
        if (window.IStoriesUserData) {
            IStoriesUserData.clearUserData();
        } else {
            localStorage.removeItem('userStories');
            localStorage.removeItem('userDictionaries');
        }

        // 5. Update UI
        if (currentPage === 'home' || currentPage === 'addStories') {
            renderStories();
        }

        // 6. Update user stories list
        loadUserStories();

        // 7. Show success message
        showNotification(`✅ All ${deletedCount} user stories deleted successfully!`, 'success');

        console.log('🗑️ All user stories deleted successfully');

    } catch (error) {
        console.error('❌ Error deleting all user stories:', error);
        showNotification('❌ Failed to delete user stories. Please try again.', 'error');
    }
}
// Add this to your existing variables
let jsonImportValidationTimer = null;

// Add event listener in setupAddStoriesListeners() function:
function setupAddStoriesListeners() {
    // File upload elements
    const browseBtn = document.getElementById('browseBtn');
    const storyFileInput = document.getElementById('storyFileInput');
    const uploadArea = document.getElementById('uploadArea');
    const removeFileBtn = document.getElementById('removeFile');
    const uploadBtn = document.getElementById('uploadBtn');

    // Form elements
    const storyForm = document.getElementById('storyForm');
    const previewBtn = document.getElementById('previewBtn');
    const downloadTemplateBtn = document.getElementById('downloadTemplateBtn');
    const copyJsonBtn = document.getElementById('copyJsonBtn');
    const loadExampleTranslationsBtn = document.getElementById('loadExampleTranslations');

    // Preview modal elements
    const closePreviewBtn = document.getElementById('closePreviewBtn');
    const closePreview = document.getElementById('closePreview');
    const saveFromPreviewBtn = document.getElementById('saveFromPreviewBtn');

    // Edit modal elements
    const closeEditModalBtn = document.getElementById('closeEditModalBtn');
    const closeEditModalBtn2 = document.getElementById('closeEditModalBtn2');
    const editStoryForm = document.getElementById('editStoryForm');
    const editStoryCoverType = document.getElementById('editStoryCoverType');
    const editStoryModal = document.getElementById('editStoryModal');

    // Export button
    const exportStoriesBtn = document.getElementById('exportStoriesBtn');

    // Text import functionality
    const jsonTextArea = document.getElementById('jsonTextArea');
    const clearJsonBtn = document.getElementById('clearJsonBtn');
    const importJsonBtn = document.getElementById('importJsonBtn');

    // File upload functionality
    if (browseBtn && storyFileInput) {
        browseBtn.addEventListener('click', () => storyFileInput.click());
    }

    if (storyFileInput) {
        storyFileInput.addEventListener('change', handleFileSelect);
    }

    if (uploadArea) {
        // Drag and drop functionality
        uploadArea.addEventListener('dragover', handleDragOver);
        uploadArea.addEventListener('dragleave', handleDragLeave);
        uploadArea.addEventListener('drop', handleFileDrop);
        uploadArea.addEventListener('click', () => storyFileInput.click());
    }

    if (removeFileBtn) {
        removeFileBtn.addEventListener('click', clearSelectedFile);
    }

    if (uploadBtn) {
        uploadBtn.addEventListener('click', uploadStoryFile);
    }

    // Form functionality
    if (storyForm) {
        storyForm.addEventListener('submit', handleFormSubmit);
    }

    if (previewBtn) {
        previewBtn.addEventListener('click', showStoryPreview);
    }

    if (downloadTemplateBtn) {
        downloadTemplateBtn.addEventListener('click', downloadStoryTemplate);
    }

    if (copyJsonBtn) {
        copyJsonBtn.addEventListener('click', copyJsonExample);
    }

    if (loadExampleTranslationsBtn) {
        loadExampleTranslationsBtn.addEventListener('click', loadExampleTranslations);
    }

    // Preview modal functionality
    if (closePreviewBtn) {
        closePreviewBtn.addEventListener('click', closePreviewModal);
    }

    if (closePreview) {
        closePreview.addEventListener('click', closePreviewModal);
    }

    if (saveFromPreviewBtn) {
        saveFromPreviewBtn.addEventListener('click', saveStoryFromPreview);
    }

    // Edit modal functionality - FIXED WITH DEBUGGING
    if (closeEditModalBtn) {
        console.log('Adding event listener to closeEditModalBtn'); // Debug
        closeEditModalBtn.addEventListener('click', function(e) {
            console.log('closeEditModalBtn clicked'); // Debug
            closeEditModal();
        });
    } else {
        console.error('closeEditModalBtn NOT FOUND!'); // Debug
    }

    if (closeEditModalBtn2) {
        console.log('Adding event listener to closeEditModalBtn2'); // Debug
        closeEditModalBtn2.addEventListener('click', function(e) {
            console.log('closeEditModalBtn2 clicked'); // Debug
            closeEditModal();
        });
    } else {
        console.error('closeEditModalBtn2 NOT FOUND!'); // Debug
    }

    if (editStoryForm) {
        editStoryForm.addEventListener('submit', handleEditStorySubmit);
    }

    if (editStoryCoverType) {
        editStoryCoverType.addEventListener('change', updateEditCoverLabel);
    }

    // Export button functionality
    if (exportStoriesBtn) {
        exportStoriesBtn.addEventListener('click', exportUserStories);
    }

    // Text import functionality
    if (jsonTextArea) {
        jsonTextArea.addEventListener('input', validateJsonInput);
    }

    if (clearJsonBtn) {
        clearJsonBtn.addEventListener('click', clearJsonTextArea);
    }

    if (importJsonBtn) {
        importJsonBtn.addEventListener('click', importFromText);
    }

    // Close modals when clicking outside
    const previewModal = document.getElementById('previewModal');
    if (previewModal) {
        previewModal.addEventListener('click', (e) => {
            if (e.target === previewModal) {
                closePreviewModal();
            }
        });
    }

    if (editStoryModal) {
        editStoryModal.addEventListener('click', (e) => {
            if (e.target === editStoryModal) {
                console.log('Clicked outside edit modal, closing...'); // Debug
                closeEditModal();
            }
        });
    }
}

// Validate JSON input as user types
function validateJsonInput() {
    const textArea = document.getElementById('jsonTextArea');
    const importBtn = document.getElementById('importJsonBtn');
    const validationDiv = document.getElementById('jsonValidation');
    const validationMessage = document.getElementById('validationMessage');

    if (!textArea || textArea.value.trim() === '') {
        validationDiv.style.display = 'none';
        importBtn.disabled = true;
        return;
    }

    // Debounce validation
    clearTimeout(jsonImportValidationTimer);
    jsonImportValidationTimer = setTimeout(() => {
        try {
            const jsonData = JSON.parse(stripJsonComments(textArea.value));

            // Check if it's a valid story structure
            if (validateStory(jsonData)) {
                validationDiv.className = 'json-validation valid';
                validationMessage.textContent = '✓ Valid story format';
                importBtn.disabled = false;
            } else if (Array.isArray(jsonData)) {
                // Check if it's an array of stories
                const validCount = jsonData.filter(validateStory).length;
                if (validCount > 0) {
                    validationDiv.className = 'json-validation valid';
                    validationMessage.textContent = `✓ Valid format (${validCount} story${validCount !== 1 ? 's' : ''} found)`;
                    importBtn.disabled = false;
                } else {
                    validationDiv.className = 'json-validation invalid';
                    validationMessage.textContent = '✗ Array contains invalid stories';
                    importBtn.disabled = true;
                }
            } else if (jsonData.stories && Array.isArray(jsonData.stories)) {
                // Check if it's an object with stories array
                const validCount = jsonData.stories.filter(validateStory).length;
                if (validCount > 0) {
                    validationDiv.className = 'json-validation valid';
                    validationMessage.textContent = `✓ Valid format (${validCount} story${validCount !== 1 ? 's' : ''} found)`;
                    importBtn.disabled = false;
                } else {
                    validationDiv.className = 'json-validation invalid';
                    validationMessage.textContent = '✗ Invalid stories format';
                    importBtn.disabled = true;
                }
            } else {
                validationDiv.className = 'json-validation invalid';
                validationMessage.textContent = '✗ Invalid story structure';
                importBtn.disabled = true;
            }
        } catch (error) {
            validationDiv.className = 'json-validation invalid';
            validationMessage.textContent = `✗ Invalid JSON: ${error.message}`;
            importBtn.disabled = true;
        }

        validationDiv.style.display = 'block';
    }, 500); // 500ms debounce
}

// Clear text area
function clearJsonTextArea() {
    const textArea = document.getElementById('jsonTextArea');
    const validationDiv = document.getElementById('jsonValidation');
    const importBtn = document.getElementById('importJsonBtn');

    if (textArea) {
        textArea.value = '';
        textArea.style.height = 'auto';
    }

    if (validationDiv) {
        validationDiv.style.display = 'none';
    }

    if (importBtn) {
        importBtn.disabled = true;
    }

    showNotification('Text area cleared', 'info');
}

// Import stories from text area
function importFromText() {
    const textArea = document.getElementById('jsonTextArea');
    if (!textArea || textArea.value.trim() === '') {
        showNotification('Please enter JSON text first', 'error');
        return;
    }

    try {
        const jsonData = JSON.parse(stripJsonComments(textArea.value));
        const fileName = 'text_import_' + new Date().toISOString().replace(/[:.]/g, '-') + '.json';

        // Process the story data
        processStoryData(jsonData, fileName);

        // Clear text area after successful import
        clearJsonTextArea();

    } catch (error) {
        showNotification(`Error parsing JSON: ${error.message}`, 'error');
    }
}

// Add auto-resize for textarea (optional but nice)

// Add this to your initialization
document.addEventListener('DOMContentLoaded', function () {
    // ... existing code ...

    // Add auto-resize to textarea
    const jsonTextArea = document.getElementById('jsonTextArea');
    if (jsonTextArea) {
        jsonTextArea.addEventListener('input', function () {
            autoResizeTextarea(this);
        });
    }
});
// Show a success toast using the shared, dismissible notification system.
function showExportSuccess(count, filename) {
    const label = count === 1 ? '1 story' : count + ' stories';
    const suffix = filename ? ' — ' + filename : '';
    showNotification('Export successful: ' + label + suffix, 'success');
}
