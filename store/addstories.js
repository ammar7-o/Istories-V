// Add Stories Page functionality
let userStories = JSON.parse(localStorage.getItem('userStories')) || [];
let userDictionaries = JSON.parse(localStorage.getItem('userDictionaries')) || {};
let currentEditIndex = -1; // Track which story is being edited

// Initialize Add Stories page
function initAddStories() {
    // Add event listeners
    setupAddStoriesListeners();

    // Load stories (both external and user)
    loadAllStories();
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

// Load all stories (external + user stories)
function loadAllStories() {
    const userStoriesList = document.getElementById('userStoriesList');
    if (!userStoriesList) return;

    userStoriesList.innerHTML = '';

    // Get all stories: external + user stories
    const allStories = getAllStories();

    if (allStories.length === 0) {
        userStoriesList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-book-open"></i>
                <p>No stories available</p>
            </div>
        `;
        return;
    }

    allStories.forEach((story, index) => {
        const storyItem = document.createElement('div');
        storyItem.className = 'story-item';

        // Check if story has translations/dictionaries
        const hasTranslations = story.hasTranslations || 
                               (story.dictionaries && story.dictionaries.length > 0) ||
                               (story.id && userDictionaries[story.id]);
        
        const translationBadge = hasTranslations
            ? '<span class="translation-badge" title="Has translations"><i class="fas fa-language"></i></span>'
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

        // Determine display date
        let displayDate = '';
        if (story.uploadDate) {
            displayDate = new Date(story.uploadDate).toLocaleDateString();
        } else {
            displayDate = story.author || 'Unknown author';
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
                        ${displayDate}
                    </span>
                </div>
            </div>
           
            <div class="story-item-actions">
                <button class="story-action-btn read-story-btn" title="Read Story" data-id="${story.id}" data-type="${story.isUserStory ? 'user' : 'external'}">
                    <i class="fas fa-book-reader"></i>
                </button>
                <button class="story-action-btn share-story-btn" title="Share as JSON" data-index="${index}" data-type="${story.isUserStory ? 'user' : 'external'}">
                    <i class="fas fa-share-alt"></i>
                </button>
                ${story.isUserStory ? `
                <button class="story-action-btn edit-story-btn" title="Edit Story" data-index="${index}" data-type="user">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="story-action-btn delete-story-btn" title="Delete Story" data-index="${index}" data-type="user">
                    <i class="fas fa-trash"></i>
                </button>
                ` : `
                <button class="story-action-btn edit-story-btn" title="Edit Story" data-index="${index}" data-type="external">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="story-action-btn delete-story-btn" title="Delete Story" data-index="${index}" data-type="external">
                    <i class="fas fa-trash"></i>
                </button>
                `}
            </div>
        `;

        userStoriesList.appendChild(storyItem);
    });

    // Add event listeners to buttons
    document.querySelectorAll('.read-story-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const storyId = e.currentTarget.dataset.id;
            openUserStoryInReader(storyId);
        });
    });

    document.querySelectorAll('.share-story-btn[data-type="user"]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = parseInt(e.currentTarget.dataset.index);
            shareUserStoryAsJson(index);
        });
    });

    document.querySelectorAll('.share-story-btn[data-type="external"]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = parseInt(e.currentTarget.dataset.index);
            shareExternalStoryAsJson(index);
        });
    });

    document.querySelectorAll('.edit-story-btn[data-type="user"]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = parseInt(e.currentTarget.dataset.index);
            openEditUserStoryModal(index);
        });
    });

    document.querySelectorAll('.edit-story-btn[data-type="external"]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = parseInt(e.currentTarget.dataset.index);
            openEditExternalStoryModal(index);
        });
    });

    document.querySelectorAll('.delete-story-btn[data-type="user"]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = parseInt(e.currentTarget.dataset.index);
            deleteUserStory(index);
        });
    });

    document.querySelectorAll('.delete-story-btn[data-type="external"]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = parseInt(e.currentTarget.dataset.index);
            deleteExternalStory(index);
        });
    });
}

// Get all stories (external + user)
function getAllStories() {
    const allStories = [];
    
    // Add external stories from stories.js
    if (window.storiesData && window.storiesData.stories) {
        window.storiesData.stories.forEach((story, index) => {
            // Generate an ID for external stories if they don't have one
            const storyId = story.id || `external_${index}_${Date.now()}`;
            allStories.push({
                ...story,
                id: storyId,
                isUserStory: false
            });
        });
    }
    
    // Add user stories
    allStories.push(...userStories);
    
    return allStories;
}

// Your original openUserStoryInReader function (works for both types)
function openUserStoryInReader(storyId) {
    // Find the story in all available sources
    let story = null;
    let translations = {};
    
    // First check user stories
    story = userStories.find(s => s.id === storyId);
    if (story) {
        // Get translations for user story
        translations = userDictionaries[storyId] || {};
    } else {
        // Check external stories
        if (window.storiesData && window.storiesData.stories) {
            // Find external story by ID
            const externalIndex = window.storiesData.stories.findIndex(s => {
                const extId = s.id || `external_${window.storiesData.stories.indexOf(s)}_${Date.now()}`;
                return extId === storyId;
            });
            
            if (externalIndex !== -1) {
                story = window.storiesData.stories[externalIndex];
                story.id = storyId; // Ensure ID is set
                story.isUserStory = false;
                
                // External stories use dictionaries array
                if (story.dictionaries && story.dictionaries.length > 0) {
                    // Convert dictionaries to translations format if needed
                    translations = { dictionaries: story.dictionaries };
                }
            }
        }
    }

    if (!story) {
        showNotification('Story not found.', 'error');
        return;
    }

    // Store story data in localStorage for the reader
    localStorage.setItem('currentReadingStory', JSON.stringify({
        id: story.id,
        title: story.title,
        level: story.level,
        content: story.content,
        isUserStory: story.isUserStory || false,
        cover: story.cover,
        coverType: story.coverType,
        author: story.author || '',
        translations: translations,
        dictionaries: story.dictionaries || [],
        sound: story.sound || null,
        wordCount: story.wordCount || 0
    }));

    // Redirect to reader page
    const storyPage = '../English/reader/index.html?id=' + storyId + 
                     '&userStory=' + (story.isUserStory ? 'true' : 'false');
    window.location.href = storyPage;
}

// Share user story as JSON file
function shareUserStoryAsJson(index) {
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

    // Create filename from story title
    const sanitizedTitle = story.title
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, '-')
        .substring(0, 50);

    const date = new Date().toISOString().split('T')[0];
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

// Share external story as JSON
function shareExternalStoryAsJson(index) {
    if (!window.storiesData || !window.storiesData.stories || index >= window.storiesData.stories.length) {
        showNotification('Story not found.', 'error');
        return;
    }

    const story = window.storiesData.stories[index];

    // Prepare the complete story object for export
    const exportStory = {
        title: story.title,
        level: story.level,
        cover: story.cover,
        coverType: story.coverType,
        content: story.content,
        author: story.author || '',
        dictionaries: story.dictionaries || [],
        sound: story.sound || '',
        wordCount: story.wordCount || 0
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

    // Create filename from story title
    const sanitizedTitle = story.title
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, '-')
        .substring(0, 50);

    const date = new Date().toISOString().split('T')[0];
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

// Function to open edit modal for user stories
function openEditUserStoryModal(index) {
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

    // Add a hidden input to track that this is a user story
    const editStoryType = document.getElementById('editStoryType') || document.createElement('input');
    editStoryType.id = 'editStoryType';
    editStoryType.type = 'hidden';
    editStoryType.value = 'user';
    if (!document.getElementById('editStoryType')) {
        editStoryForm.appendChild(editStoryType);
    } else {
        document.getElementById('editStoryType').value = 'user';
    }

    // Show modal
    const editStoryModal = document.getElementById('editStoryModal');
    if (editStoryModal) {
        editStoryModal.classList.add('show');
    }
}

// Edit external story modal
function openEditExternalStoryModal(index) {
    if (!window.storiesData || !window.storiesData.stories || index >= window.storiesData.stories.length) {
        showNotification('Story not found.', 'error');
        return;
    }

    const story = window.storiesData.stories[index];
    currentEditIndex = index;

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

    // Fill dictionaries if they exist
    const editStoryTranslations = document.getElementById('editStoryTranslations');
    if (editStoryTranslations) {
        if (story.dictionaries && story.dictionaries.length > 0) {
            editStoryTranslations.value = JSON.stringify({ dictionaries: story.dictionaries }, null, 2);
        } else {
            editStoryTranslations.value = '';
        }
    }

    // Add a hidden input to track that this is an external story
    const editStoryType = document.getElementById('editStoryType') || document.createElement('input');
    editStoryType.id = 'editStoryType';
    editStoryType.type = 'hidden';
    editStoryType.value = 'external';
    if (!document.getElementById('editStoryType')) {
        editStoryForm.appendChild(editStoryType);
    } else {
        document.getElementById('editStoryType').value = 'external';
    }

    // Show modal
    const editStoryModal = document.getElementById('editStoryModal');
    if (editStoryModal) {
        editStoryModal.classList.add('show');
    }
}

// Delete user story
function deleteUserStory(index) {
    if (confirm('Are you sure you want to delete this story? This will also delete all associated translations. This action cannot be undone.')) {
        const storyId = userStories[index].id;

        // Remove from userStories array
        userStories.splice(index, 1);

        // Remove from stories array if it exists there
        if (typeof stories !== 'undefined') {
            const storyIndex = stories.findIndex(s => s.id === storyId);
            if (storyIndex !== -1) {
                stories.splice(storyIndex, 1);
            }
        }

        // Remove translations
        delete userDictionaries[storyId];

        // Update localStorage
        localStorage.setItem('userStories', JSON.stringify(userStories));
        localStorage.setItem('userDictionaries', JSON.stringify(userDictionaries));

        // Update UI
        loadAllStories();
        if (currentPage === 'home' || currentPage === 'addStories') {
            if (typeof renderStories !== 'undefined') {
                renderStories();
            }
        }

        showNotification('Story and translations deleted successfully.', 'success');
    }
}

// Delete external story (temporary removal)
function deleteExternalStory(index) {
    if (confirm('Are you sure you want to remove this story from view? This will only hide it from the current session.')) {
        if (!window.storiesData || !window.storiesData.stories) {
            showNotification('Stories data not loaded.', 'error');
            return;
        }
        
        // Remove from the array (temporary)
        window.storiesData.stories.splice(index, 1);
        
        // Update UI
        loadAllStories();
        
        showNotification('Story removed from view.', 'success');
    }
}

// Rest of your code remains the same (processStoryData, helper functions, etc.)
// ... [Keep all your existing helper functions as they are] ...

// Initialize Add Stories page when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    // Check if stories.js is loaded
    if (!window.storiesData) {
        console.warn('stories.js not loaded yet.');
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

    // Load all stories when switching to addStories page
    if (page === 'addStories') {
        loadAllStories();
    }
}