
// Function to save showUserQuizzes setting
function saveShowUserQuizzesSetting(value) {
    showUserQuizzes = value;
    localStorage.setItem('showUserQuizzes', value);
    
    // Show notification
    showNotification(
        value ? 'User quizzes enabled' : 'User quizzes disabled',
        'success'
    );
    
    // Refresh the current view
    refreshCurrentView();
}

// Function to refresh the current view based on settings
function refreshCurrentView() {
    const selectElement = document.getElementById('Select');
    const isQuizMode = selectElement && selectElement.value.includes('quiz');
    const activeLevelBtn = document.querySelector('.level-btn.active');
    const currentLevel = activeLevelBtn ? activeLevelBtn.dataset.level : 'all';
    
    if (isQuizMode) {
        if (typeof filterQuizzesByLevel === 'function') {
            filterQuizzesByLevel(currentLevel);
        } else if (typeof renderQuizzes === 'function') {
            renderQuizzes(currentLevel);
        }
    } else if (typeof renderStories === 'function') {
        renderStories();
    }
}

// Also update your state variable initialization to use localStorage
// Add this to your App State Variables section (if not already there):
// let showUserQuizzes = localStorage.getItem('showUserQuizzes') !== 'false'; // Default: true

// And update your init() function to call initUserQuizzesSetting():
// In your init() function, add this line:
// initUserQuizzesSetting();