

// Update the loadStory function to include user translations
async function loadStory() {
    try {
        storyTitle.textContent = 'Loading...';
        storyText.innerHTML = '<div class="loading" style="text-align: center; padding: 40px; color: var(--text-light);">Loading story...</div>';
        
        const storyInfo = getStoryIdFromUrl();
        const storyId = storyInfo.id;
        const isUserStory = storyInfo.isUserStory;
        const fallbackId = 1;

        // Clear dictionary before loading new story
        dictionary = {};

        // Check if it's a user story first
        if (isUserStory) {
            const userStories = getUserStories();
            currentStory = userStories.find(s => s.id === storyId);
            
            if (currentStory) {
                // First load custom translations if they exist
                const hasCustomTranslations = loadUserTranslations(storyId);
                
                // Then load default dictionary
                await loadDictionary(currentStory.dictionaries || ["../dictionarys/main.json"]);
                
                // Show translation badge if custom translations exist
                if (hasCustomTranslations) {
                    addTranslationBadge();
                }
                
                displayStory(currentStory);
                return;
            }
        }

        // If not a user story or user story not found, try regular stories
        if (typeof window.storiesData !== 'undefined') {
            const allStories = window.storiesData.stories || window.storiesData;
            currentStory = allStories.find(s => s.id == storyId); // Use == instead of === to handle string vs number
            if (currentStory) {
                await loadDictionary(currentStory.dictionaries);
                displayStory(currentStory);
                return;
            }
        }

        // Try loading from main.js
        try {
            const mainResponse = await fetch('../database/main.js');
            if (mainResponse.ok) {
                const mainText = await mainResponse.text();
                const mainMatch = mainText.match(/window\.storiesData\s*=\s*({[\s\S]*?});/);
                if (mainMatch) {
                    try {
                        const jsonStr = mainMatch[1].replace(/window\.storiesData\s*=\s*/, '');
                        window.storiesData = JSON.parse(jsonStr);
                    } catch (e) {
                        eval(mainMatch[0]);
                    }
                    
                    const allStories = window.storiesData.stories || window.storiesData;
                    currentStory = allStories.find(s => s.id == storyId);
                    if (currentStory) {
                        await loadDictionary(currentStory.dictionaries);
                        displayStory(currentStory);
                        return;
                    }
                }
            }
        } catch (error) {
            console.log('Could not load main.js:', error);
        }

        // Try loading from more.js
        try {
            const moreResponse = await fetch('../database/more.js');
            if (moreResponse.ok) {
                const moreText = await moreResponse.text();
                const moreMatch = moreText.match(/window\.storiesData\s*=\s*({[\s\S]*?});/);
                if (moreMatch) {
                    try {
                        const jsonStr = moreMatch[1].replace(/window\.storiesData\s*=\s*/, '');
                        window.storiesData = JSON.parse(jsonStr);
                    } catch (e) {
                        eval(moreMatch[0]);
                    }
                    
                    const allStories = window.storiesData.stories || window.storiesData;
                    currentStory = allStories.find(s => s.id == storyId);
                    if (currentStory) {
                        await loadDictionary(currentStory.dictionaries);
                        displayStory(currentStory);
                        return;
                    }
                }
            }
        } catch (error) {
            console.log('Could not load more.js:', error);
        }

        // Fallback story
        currentStory = getFallbackStory(storyId);
        if (currentStory.dictionaries || currentStory.dictionary) {
            await loadDictionary(currentStory.dictionaries || currentStory.dictionary);
        }
        displayStory(currentStory);

    } catch (error) {
        console.error('Error loading story:', error);
        showNotification('Failed to load story. Using fallback story.', 'error');
        currentStory = getFallbackStory(fallbackId);
        displayStory(currentStory);
    }
}

// Add translation badge to show custom translations are loaded
function addTranslationBadge() {
    const badge = document.createElement('span');
    badge.className = 'custom-translation-badge';
    badge.innerHTML = '<i class="fas fa-language"></i> Custom Translations';
    badge.style.cssText = `
        display: inline-block;
        margin-left: 10px;
        background: linear-gradient(135deg, #8B5CF6, #6366F1);
        color: white;
        padding: 4px 10px;
        border-radius: 12px;
        font-size: 0.8rem;
        font-weight: 600;
        vertical-align: middle;
    `;
    storyTitle.appendChild(badge);
}

// Update the showDictionary function to indicate custom translations
function showDictionary(word, element) {
    if (!word) return;
    
    // البحث بالمفتاح القياسي (word)
    const wordData = dictionary[word];

    popupWord.textContent = element.innerText; 

    if (listenWordBtn) {
        listenWordBtn.style.display = 'speechSynthesis' in window ? 'inline-block' : 'none';
    }

    if (wordData) {
        popupTranslation.textContent = wordData.translation;
        popupPos.style.display = 'none';
        popupDefinition.style.display = 'none';
        popupExample.style.display = 'none';
        
        // Add source indicator if it's a custom translation
        if (wordData.source === 'user_story') {
            popupTranslation.innerHTML += ' <span style="font-size: 0.8rem; color: var(--primary); font-weight: 600;"><i class="fas fa-user-edit"></i> Custom</span>';
        }

        const isSaved = savedWords.some(w => w.word === word);
        saveWordBtn.innerHTML = isSaved
            ? '<i class="fas fa-check"></i> Already Saved'
            : '<i class="fas fa-bookmark"></i> Save Word';
        saveWordBtn.disabled = isSaved;
        saveWordBtn.classList.toggle('disabled', isSaved);
        saveWordBtn.classList.remove('no-translation-btn');
    } else {
        popupTranslation.textContent = "لا توجد ترجمة متاحة";
        popupPos.style.display = 'none';
        popupDefinition.style.display = 'none';
        popupExample.style.display = 'none';

        saveWordBtn.innerHTML = '<i class="fas fa-bookmark"></i> Save Word (No Translation)';
        saveWordBtn.disabled = false;
        saveWordBtn.classList.add('no-translation-btn');
    }

    if (!validateWordData({ word: word, translation: wordData?.translation || "No translation" })) {
        console.warn('Invalid word data for:', word);
    }

    currentWordData = {
        word: word,
        element: element,
        hasTranslation: !!wordData,
        wordData: wordData,
        isCustomTranslation: wordData?.source === 'user_story'
    };

    const rect = element.getBoundingClientRect();
    dictionaryPopup.style.top = `${rect.bottom + window.scrollY + 10}px`;
    dictionaryPopup.style.left = `${Math.max(10, rect.left + window.scrollX - 150)}px`;
    dictionaryPopup.style.display = 'block';
}

// Update the saveCurrentWord function to mark custom translations
function saveCurrentWord() {
    if (!currentWordData) {
        showNotification('No word selected', 'error');
        return;
    }

    const { word, element, hasTranslation, wordData, isCustomTranslation } = currentWordData;

    if (savedWords.some(w => w.word === word)) {
        showNotification('Word already saved!', 'info');
        return;
    }

    const storyTitle = currentStory ? currentStory.title : 'Unknown Story';
    const isUserStory = currentStory ? currentStory.isUserStory : false;

    const newWord = {
        word: word, 
        originalWord: element.innerText, 
        status: 'saved',
        added: new Date().toISOString(),
        nextReview: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), 
        story: storyTitle,
        hasTranslation: hasTranslation,
        fromUserStory: isUserStory || false,
        isCustomTranslation: isCustomTranslation || false
    };

    if (hasTranslation && wordData) {
        newWord.translation = wordData.translation;
        newWord.definition = wordData.definition || "Check back later for definition";
        newWord.example = wordData.example || "Check back later for example";
        newWord.pos = wordData.pos || "unknown";
    } else {
        newWord.translation = "No translation available";
        newWord.definition = "This word is not yet in our dictionary";
        newWord.example = "We're working on adding more words to our database";
        newWord.pos = "unknown";
    }

    savedWords.push(newWord);
    localStorage.setItem('savedWords', JSON.stringify(savedWords));

    hideDictionary();

    if (element) {
        element.classList.add('saved');
        element.classList.remove('no-translation');
    }

    if (document.querySelector('.nav-tab.active[data-page="vocabulary"]')) {
        renderVocabulary();
        updateVocabularyStats();
    }

    const translationSource = isCustomTranslation ? "custom translation" : "dictionary";
    const message = hasTranslation
        ? `"${element.innerText}" saved to vocabulary from "${storyTitle}" (${translationSource})!`
        : `"${element.innerText}" saved to vocabulary from "${storyTitle}" (translation will be added later)`;

    showNotification(message, hasTranslation ? 'success' : 'warning');
}

// Update CSS styles to include custom translation badge
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
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
    }
    .word.saved {
        animation: fadeIn 0.3s ease;
    }
    .no-translation-btn {
        opacity: 0.7;
    }
    .no-translation-btn:hover {
        opacity: 1;
    }
    button.disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
    .loading {
        animation: pulse 1.5s infinite;
    }
    @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
    }
    .user-story-badge {
        display: inline-block;
        background: var(--primary);
        color: white;
        padding: 4px 10px;
        border-radius: 12px;
        font-size: 0.8rem;
        font-weight: 600;
        margin-left: 10px;
        vertical-align: middle;
    }
    .user-story-badge i {
        margin-right: 5px;
    }
    .user-story-badge-small {
        display: inline-block;
        background: var(--primary);
        color: white;
        padding: 2px 6px;
        border-radius: 4px;
        font-size: 0.7rem;
        margin-left: 8px;
        vertical-align: middle;
    }
    .word.from-user-story {
        border-left: 3px solid var(--primary);
    }
    .custom-translation-badge {
        display: inline-block;
        background: linear-gradient(135deg, #8B5CF6, #6366F1);
        color: white;
        padding: 4px 10px;
        border-radius: 12px;
        font-size: 0.8rem;
        font-weight: 600;
        margin-left: 10px;
        vertical-align: middle;
        animation: pulse 2s infinite;
    }
    .custom-translation-badge i {
        margin-right: 5px;
    }
    .word.custom-translation {
        background: linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.1), transparent);
        border-left: 3px