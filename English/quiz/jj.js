

// Also update the renderStories function to use the same structure:
function renderStories(level = 'all') {
    if (!storiesGrid) return;

    storiesGrid.innerHTML = '';

    let filteredStories;

    if (level === 'all') {
        filteredStories = stories;
    } else if (level === 'user') {
        filteredStories = userStories;
    } else {
        filteredStories = stories.filter(story => story.level === level);
    }

    if (filteredStories.length === 0) {
        storiesGrid.innerHTML = `
            <div class="no-stories-message">
                <i class="fas fa-book fa-3x"></i>
                <h3>No ${level === 'user' ? 'user' : level} stories available</h3>
                <p>${level === 'user' ? 'Create your own stories to see them here!' : 'Try a different level or check back soon!'}</p>
            </div>
        `;
        return;
    }

    filteredStories.forEach(story => {
        const storyCard = document.createElement('div');
        storyCard.className = 'story-card';
        storyCard.dataset.storyTitle = story.title;
        storyCard.dataset.storyId = story.id || story.title.toLowerCase().replace(/\s+/g, '-');

        // Get story history if available
        const storyHistory = quizHistory[`story-${story.id}`] || {};
        const hasHistory = storyHistory.lastReadDate !== undefined;
        
        // Format last read date if available
        let lastReadDate = '';
        if (hasHistory && storyHistory.lastReadDate) {
            const date = new Date(storyHistory.lastReadDate);
            lastReadDate = date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });
        }

        const wordCount = story.wordCount || 'N/A';
        const readTime = Math.ceil((wordCount !== 'N/A' ? wordCount : 100) / 200);

        storyCard.innerHTML = `
            <div class="story-header">
                <div class="story-icon">
                    ${renderStoryCover(story)}
                </div>
                <div class="story-info">
                    <span class="story-level ${story.level}">${story.level.charAt(0).toUpperCase() + story.level.slice(1)}</span>
                    ${story.category ? `<span class="story-category">${story.category}</span>` : ''}
                </div>
            </div>
            
            <div class="story-content">
                <h3 class="story-title">${story.title}</h3>
                <p class="story-description">${story.description || 'Read this interesting story to improve your language skills.'}</p>
                
                <div class="story-meta">
                    <span><i class="fas fa-font"></i> ${wordCount} words</span>
                    <span><i class="fas fa-clock"></i> ${readTime} min read</span>
                    ${story.chapters ? `<span><i class="fas fa-book"></i> ${story.chapters} chapters</span>` : ''}
                </div>
                
                ${hasHistory ? `
                    <div class="story-progress-section">
                        <div class="story-progress-display">
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${storyHistory.completionPercentage || 0}%; 
                                    background: ${storyHistory.completionPercentage >= 100 ? '#4CAF50' : '#FF9800'};"></div>
                            </div>
                            <div class="progress-details">
                                <span class="completion-rate">
                                    <i class="fas fa-percentage"></i> ${storyHistory.completionPercentage || 0}% complete
                                </span>
                            </div>
                        </div>
                        ${lastReadDate ?
                            `<p class="last-read-date"><i class="far fa-calendar"></i> Last read: ${lastReadDate}</p>` :
                            ''
                        }
                    </div>
                ` : `
                    <div class="story-progress-section">
                        <p class="no-history"><i class="far fa-star"></i> Not read yet</p>
                    </div>
                `}
            </div>
            
            <div class="story-actions">
                <button class="story-read-btn" data-story-id="${story.id || story.title.toLowerCase().replace(/\s+/g, '-')}">
                    <i class="fas fa-book-open"></i> Read Story
                </button>
                <button class="story-preview-btn" data-story-id="${story.id || story.title.toLowerCase().replace(/\s+/g, '-')}">
                    <i class="fas fa-eye"></i> Preview
                </button>
            </div>
        `;

        // Add event listeners
        const readBtn = storyCard.querySelector('.story-read-btn');
        const previewBtn = storyCard.querySelector('.story-preview-btn');

        readBtn.addEventListener('click', () => readStory(story.id || story.title));
        previewBtn.addEventListener('click', () => previewStory(story.id || story.title));

        storiesGrid.appendChild(storyCard);
    });
}

// Update the renderStoryCover function if needed:
function renderStoryCover(story) {
    if (!story.cover) {
        return '<i class="fas fa-book story-icon-default"></i>';
    }

    if (story.coverType === 'emoji') {
        return `<div class="story-emoji">${story.cover}</div>`;
    } else if (story.coverType === 'image') {
        return `<img src="${story.cover}" alt="${story.title}" class="story-image" loading="lazy">`;
    } else if (story.coverType === 'icon') {
        return `<i class="${story.cover} story-icon"></i>`;
    } else {
        return `<div class="story-emoji">${story.cover}</div>`;
    }
}

// Add placeholder functions for story actions:
function readStory(storyId) {
    console.log('Reading story:', storyId);
    // Implement your story reading functionality here
    showNotification('Story reading functionality coming soon!', 'info');
}

function previewStory(storyId) {
    console.log('Previewing story:', storyId);
    // Implement your story preview functionality here
    showNotification('Story preview functionality coming soon!', 'info');
}