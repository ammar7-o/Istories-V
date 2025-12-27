// Add Stories Page functionality
let userStories = JSON.parse(localStorage.getItem('userStories')) || [];
let userDictionaries = JSON.parse(localStorage.getItem('userDictionaries')) || {};

// Initialize Add Stories page
function initAddStories() {
    // Add event listeners
    setupAddStoriesListeners();

    // Load existing user stories
    loadUserStories();

    // Add Add Stories link to navigation
    addAddStoriesNavLink();
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

    // Close modal when clicking outside
    const previewModal = document.getElementById('previewModal');
    if (previewModal) {
        previewModal.addEventListener('click', (e) => {
            if (e.target === previewModal) {
                closePreviewModal();
            }
        });
    }
}

// Load example translations
function loadExampleTranslations() {
    const exampleTranslations = {
        "hello": { "translation": "مرحبا" },
        "world": { "translation": "عالم" },
        "book": { "translation": "كتاب" }
    };

    document.getElementById('storyTranslations').value = JSON.stringify(exampleTranslations, null, 2);
    showNotification('Example translations loaded!', 'success');
}

// Handle file selection
function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file && file.type === 'application/json') {
        displaySelectedFile(file);
    } else {
        showNotification('Please select a valid JSON file.', 'error');
    }
}

// Handle drag over
function handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    const uploadArea = document.getElementById('uploadArea');
    if (uploadArea) {
        uploadArea.style.borderColor = 'var(--primary-dark)';
        uploadArea.style.background = 'rgba(255, 255, 255, 0.3)';
    }
}

// Handle drag leave
function handleDragLeave(e) {
    e.preventDefault();
    e.stopPropagation();
    const uploadArea = document.getElementById('uploadArea');
    if (uploadArea) {
        uploadArea.style.borderColor = 'var(--primary)';
        uploadArea.style.background = 'rgba(255, 255, 255, 0.1)';
    }
}

// Handle file drop
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

// Display selected file info
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

// Format file size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Clear selected file
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

// Upload story file
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
    if (currentPage === 'home') {
        renderStories();
    }

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

// Validate story structure
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

// Calculate word count
function calculateWordCount(content) {
    return content.join(' ').split(/\s+/).length;
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

        storyItem.innerHTML = `
            <div class="story-icon">
                ${story.coverType === 'icon' ?
                `<i class="${story.cover}"></i>` :
                `<div class="story-emoji-small">${story.cover || '📚'}</div>`
            }
                ${translationBadge}
            </div>
            <div class="story-item-info">
                <span class="story-item-title">${story.title}</span>
                <span class="story-item-meta">
                    ${story.level} • ${story.wordCount || 'Unknown'} words • 
                    ${new Date(story.uploadDate).toLocaleDateString()}
                </span>
            </div>
            <div class="story-item-actions">
                <button class="story-action-btn read-story-btn" title="Read Story" data-index="${index}">
                    <i class="fas fa-book-reader"></i>
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

    document.querySelectorAll('.delete-story-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = parseInt(e.currentTarget.dataset.index);
            deleteUserStory(index);
        });
    });
}

// Open user story in reader
function openUserStoryInReader(storyId) {
    // Find the story
    const story = userStories.find(s => s.id === storyId) ||
        stories.find(s => s.id === storyId);

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
        isUserStory: true,
        cover: story.cover,
        coverType: story.coverType
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
        if (currentPage === 'home') {
            renderStories();
        }

        showNotification('Story and translations deleted successfully.', 'success');
    }
}

// Handle form submission
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
        author: author || 'Your Name',
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

// Show story preview
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

// Close preview modal
function closePreviewModal() {
    document.getElementById('previewModal').classList.remove('show');
}

// Save story from preview
function saveStoryFromPreview() {
    handleFormSubmit(new Event('submit'));
    closePreviewModal();
}

// Download story template
function downloadStoryTemplate() {
    const template = {
        "title": "My Custom Story",
        "level": "intermediate",
        "cover": "📚",
        "coverType": "emoji",
        "content": [
            "Hello and welcome to <span class='mark'>IStories!</span> This website was created by Ammar Chacal to help people learn languages in a fun and engaging way <img src='../../imges/cover.jpg' alt='Example' >  Through these interactive stories, you can improve your vocabulary and comprehension skills naturally.",
            "Each story is designed for different learning levels - beginner, intermediate, and advanced. The beginner stories use simple words and short sentences, perfect for those just starting their language learning journey.",
            "As you read, you can click on any word to see its translation and definition. This feature helps you learn new vocabulary in context, which is much more effective than memorizing word lists.",
            "The stories cover various topics and genres, from everyday situations to exciting adventures. This variety ensures that you encounter different types of vocabulary and sentence structures.",
            "Reading regularly is one of the best ways to improve your language skills. With IStories, you can practice reading comprehension while enjoying interesting narratives.",
            "Remember that learning a language takes time and patience. Don't worry if you don't understand every word at first. Use the click-to-translate feature and try to understand the general meaning of each paragraph.",
            "We recommend reading one story each day and reviewing the vocabulary you learn. Consistent practice is the key to making progress in any language.",
            "Thank you for choosing IStories for your language learning journey. We hope you enjoy these stories and find them helpful in achieving your language goals."
        ],
        "author": "Istories",
        "translations": {
            "hello": { "translation": "مرحبا" },
            "world": { "translation": "عالم" },
            "book": { "translation": "كتاب" }
        },
        "description": "A short description of your story",
        "tags": ["custom", "learning"]
    };

    const templateStr = JSON.stringify(template, null, 2);
    const blob = new Blob([templateStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'story-template.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showNotification('Template downloaded successfully!', 'success');
}

// Copy JSON example
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

// Also need to update the switchPage function to handle the new page
// Add this to your existing switchPage function:
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