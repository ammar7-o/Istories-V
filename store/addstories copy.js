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
        ...(Object.keys(translations).length > 0 && { translations: translations })
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
    document.getElementById('editStoryAuthor').value = story.author || '';
    document.getElementById('editStoryCoverType').value = story.coverType || 'emoji';

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





// Process story data
function processStoryData(storyData, fileName) {
    // Validate story structure
    if (!validateStory(storyData)) {
        showNotification('Invalid story format. Please check the template.', 'error');
        return;
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
    const storyId = 'user_' + Date.now();

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

    // Add to user stories
    userStories.push(userStory);

    // Save to localStorage
    localStorage.setItem('userStories', JSON.stringify(userStories));

    // Save translations separately if they exist
    if (Object.keys(translations).length > 0) {
        userDictionaries[storyId] = translations;
        localStorage.setItem('userDictionaries', JSON.stringify(userDictionaries));
    }

    // Update stories array and render
    stories.push(userStory);

    // ALWAYS render stories regardless of current page
    renderStories();

    // Show success message
    const translationCount = Object.keys(translations).length;
    const message = translationCount > 0
        ? `Story uploaded successfully with ${translationCount} custom translation${translationCount !== 1 ? 's' : ''}!`
        : 'Story uploaded successfully!';

    showNotification(message, 'success');

    // Clear file selection
    clearSelectedFile();

    // Update user stories list
    loadUserStories();

    // Open the story in reader
    openUserStoryInReader(storyId);
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
        translations: translations
    }));

    // Redirect to reader page
    const storyPage = '../English/reader/index.html?id=' + storyId + '&userStory=true';
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

    return true;
}

function calculateWordCount(content) {
    return content.join(' ').split(/\s+/).length;
}

function handleFormSubmit(e) {
    e.preventDefault();

    const title = document.getElementById('storyTitle').value.trim();
    const level = document.getElementById('storyLevel').value;
    const cover = document.getElementById('storyCover').value.trim() || '📚';
    const coverType = document.getElementById('storyCoverType').value;
    const contentText = document.getElementById('storyContent').value.trim();
    const author = document.getElementById('storyAuthor').value.trim();
    const translationsText = document.getElementById('storyTranslations').value.trim();

    if (!title || !level || !contentText) {
        showNotification('Please fill in all required fields.', 'error');
        return;
    }

    // Split content into paragraphs
    const content = contentText.split('\n').filter(line => line.trim() !== '');

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
}

function showStoryPreview() {
    const title = document.getElementById('storyTitle').value.trim();
    const level = document.getElementById('storyLevel').value;
    const cover = document.getElementById('storyCover').value.trim() || '📚';
    const coverType = document.getElementById('storyCoverType').value;
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

    if (coverType === 'emoji') {
        document.getElementById('previewCoverDisplay').textContent = cover;
        document.getElementById('previewCoverDisplay').innerHTML = cover;
    } else {
        document.getElementById('previewCoverDisplay').innerHTML = `<i class="${cover}"></i>`;
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