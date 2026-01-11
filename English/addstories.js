// Add Stories Page functionality
let userStories = JSON.parse(localStorage.getItem('userStories')) || [];
let userDictionaries = JSON.parse(localStorage.getItem('userDictionaries')) || {};
let currentEditIndex = -1; // Track which story is being edited

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
        uploadDate: new Date().toISOString() // Update upload date
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

    // Save to localStorage
    localStorage.setItem('userStories', JSON.stringify(userStories));
    localStorage.setItem('userDictionaries', JSON.stringify(userDictionaries));

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

// Process story data - UPDATED to handle multiple stories
function processStoryData(storyData, fileName) {
    let processedStories = [];
    let totalImported = 0;
    let skippedDuplicates = 0;
    
    // Check if it's a single story or array of stories
    if (Array.isArray(storyData)) {
        // Multiple stories in an array
        for (const story of storyData) {
            const result = processSingleStory(story, fileName);
            if (result.success) {
                processedStories.push(result.story);
                totalImported++;
            } else {
                skippedDuplicates++;
            }
        }
    } else if (storyData.stories && Array.isArray(storyData.stories)) {
        // Stories inside a "stories" property (like window.storiesData format)
        for (const story of storyData.stories) {
            const result = processSingleStory(story, fileName);
            if (result.success) {
                processedStories.push(result.story);
                totalImported++;
            } else {
                skippedDuplicates++;
            }
        }
    } else {
        // Single story object
        const result = processSingleStory(storyData, fileName);
        if (result.success) {
            processedStories.push(result.story);
            totalImported++;
        } else {
            showNotification('Story already exists or invalid format.', 'error');
            return;
        }
    }

    // Save all imported stories to localStorage
    if (processedStories.length > 0) {
        // Add all new stories to userStories array
        userStories.push(...processedStories);
        localStorage.setItem('userStories', JSON.stringify(userStories));
        
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

    // Show success message
    let message = '';
    if (totalImported > 0) {
        message = `${totalImported} story${totalImported !== 1 ? 's' : ''} imported successfully!`;
        if (skippedDuplicates > 0) {
            message += ` ${skippedDuplicates} duplicate${skippedDuplicates !== 1 ? 's' : ''} skipped.`;
        }
        showNotification(message, 'success');
    } else {
        showNotification('No stories were imported. They may already exist or have invalid format.', 'warning');
    }

    // Clear file selection
    clearSelectedFile();

    // Open the first imported story in reader if only one was imported
    if (totalImported === 1 && processedStories.length > 0) {
        openUserStoryInReader(processedStories[0].id);
    }
}

// Helper function to process a single story
function processSingleStory(storyData, fileName) {
    // Validate story structure
    if (!validateStory(storyData)) {
        return { success: false, reason: 'Invalid format' };
    }

    // Check if story already exists (by title and content)
    const existingStory = userStories.find(story => 
        story.title === storyData.title && 
        JSON.stringify(story.content) === JSON.stringify(storyData.content)
    );

    if (existingStory) {
        return { success: false, reason: 'Duplicate' };
    }

    // Process translations if they exist
    let translations = {};
    if (storyData.translations) {
        try {
            translations = storyData.translations;
        } catch (error) {
            console.error('Error parsing translations:', error);
            translations = {};
        }
    }

    // Generate unique ID
    const storyId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);

    // Prepare story object
    const userStory = {
        ...storyData,
        id: storyId,
        isUserStory: true,
        fileName: fileName,
        uploadDate: new Date().toISOString(),
        wordCount: calculateWordCount(storyData.content),
        hasTranslations: Object.keys(translations).length > 0
    };

    // Remove translations from story object to keep it clean
    delete userStory.translations;

    // Save translations separately if they exist
    if (Object.keys(translations).length > 0) {
        userDictionaries[storyId] = translations;
        localStorage.setItem('userDictionaries', JSON.stringify(userDictionaries));
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

    // Store story data in localStorage for the reader
    localStorage.setItem('currentReadingStory', JSON.stringify({
        id: story.id,
        title: story.title,
        level: story.level,
        content: story.content,
        isUserStory: true,
        cover: story.cover,
        coverType: story.coverType,
        author: story.author || '',
        translations: translations,
        // Include optional fields
        ...(story.levelcefr && { levelcefr: story.levelcefr }),
        ...(story.sound && { sound: story.sound }),
        ...(story.dictionaries && { dictionaries: story.dictionaries }),
        ...(story.audio && { audio: story.audio })
    }));

    // Redirect to reader page
    const storyPage = 'reader/index.html?id=' + storyId + '&userStory=true';
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

        // Update localStorage
        localStorage.setItem('userStories', JSON.stringify(userStories));
        localStorage.setItem('userDictionaries', JSON.stringify(userDictionaries));

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

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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
    document.getElementById('storyLevelCefr').value = '';
    document.getElementById('storySound').value = '';
    document.getElementById('storyDictionaries').value = '';
}

function showStoryPreview() {
    const title = document.getElementById('storyTitle').value.trim();
    const level = document.getElementById('storyLevel').value;
    const levelcefr = document.getElementById('storyLevelCefr').value;
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
                "level": "intermediate",
                "levelcefr": "A2",
                "cover": "🏝️",
                "coverType": "emoji",
                "sound": "../sounds/story1.mp3",
                "dictionaries": [
                    "../Dictionarys/story4.json",
                    "../Dictionarys/main.json"
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

function copyJsonExample() {
    const jsonExample = document.getElementById('jsonExample').textContent;
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
});

// Update the switchPage function to handle the new page
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

    // Load user stories when switching to addStories page
    if (page === 'addStories') {
        loadUserStories();
    }
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
        userStories = [];

        // 3. Clear user dictionaries
        userDictionaries = {};

        // 4. Update localStorage
        localStorage.removeItem('userStories');
        localStorage.removeItem('userDictionaries');

        // 5. Update UI
        if (currentPage === 'home' || currentPage === 'addStories') {
            renderStories();
        }

        // 6. Update user stories list
        loadUserStories();

        // 7. Show success message
        showNotification(`✅ All ${userStories.length} user stories deleted successfully!`, 'success');

        console.log('🗑️ All user stories deleted successfully');
        
    } catch (error) {
        console.error('❌ Error deleting all user stories:', error);
        showNotification('❌ Failed to delete user stories. Please try again.', 'error');
    }
}
// Optional: Show a nice success notification
function showExportSuccess(count, filename) {
    // Check if we already have a notification
    const existingNotification = document.getElementById('export-notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.id = 'export-notification';
    notification.innerHTML = `
        <div style="
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%);
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            z-index: 10000;
            max-width: 300px;
            animation: slideIn 0.3s ease-out;
        ">
            <div style="font-weight: bold; margin-bottom: 5px;">
                ✅ Export Successful!
            </div>
            <div style="font-size: 14px;">
                Exported ${count} story${count !== 1 ? 's' : ''}
            </div>
            <div style="font-size: 12px; opacity: 0.8; margin-top: 5px;">
                File: ${filename}
            </div>
        </div>
    `;
    
    // Add CSS animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out forwards';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
            if (style.parentNode) {
                style.remove();
            }
        }, 300);
    }, 3000);
}