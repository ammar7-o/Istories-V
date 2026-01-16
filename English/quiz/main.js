// Quiz data - will be loaded from selected JSON file
let quizDatabase = null;
let availableQuizzes = [];

// App state
let currentPage = 'home';
let savedWords = JSON.parse(localStorage.getItem('savedWords')) || [];

// Quiz state
let currentQuiz = {
    active: false,
    currentQuestionIndex: 0,
    score: 0,
    streak: 0,
    questions: [],
    answered: false,
    startTime: null,
    timer: null,
    selectedQuiz: null,
    correctAnswers: 0,
    totalQuestions: 0,
    bestStreak: 0
};

// DOM Elements
const quizFileSelect = document.getElementById('quizfile'); // Your dropdown
const quizInfo = document.getElementById('quizInfo');
const quizContainer = document.getElementById('quizContainer');
const startQuizBtn = document.getElementById('startQuiz');
const nextQuestionBtn = document.getElementById('nextQuestion');
const endQuizBtn = document.getElementById('endQuiz');
const quizActions = document.getElementById('quizActions');
const quizScore = document.getElementById('quizScore');
const quizStreak = document.getElementById('quizStreak');
const quizProgress = document.getElementById('quizProgress');
const quizTime = document.getElementById('quizTime');
const settingsButton = document.getElementById("settings-button");
const settingsPage = document.getElementById("settings-page");
const closeSettings = document.getElementById("close-settings");
const settingsOverlay = document.getElementById("settings-overlay");
const themeToggle = document.getElementById('themeToggle');

// Get quiz ID from URL
const urlParams = new URLSearchParams(window.location.search);
const quizIdFromUrl = urlParams.get('id');

// =============== QUIZ DATABASE LOADING ===============

async function loadQuizDatabase(filePath = null) {
    console.log('Loading quiz database...');
    
    // Determine which file to load
    let fileToLoad = filePath;
    if (!fileToLoad && quizFileSelect) {
        fileToLoad = quizFileSelect.value || 'main.json';
    } else if (!fileToLoad) {
        fileToLoad = 'main.json';
    }
    
    try {
        // Load the selected JSON file
        const response = await fetch(fileToLoad);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status} for ${fileToLoad}`);
        }
        
        quizDatabase = await response.json();
        
        console.log(`Successfully loaded ${fileToLoad}:`, quizDatabase);
        
        if (quizDatabase && quizDatabase.quizzes) {
            availableQuizzes = quizDatabase.quizzes;
            
            // Update UI with loaded quizzes
            displayAvailableQuizzes();
            
            // Check if there's a quiz ID in the URL
            if (quizIdFromUrl) {
                const quiz = availableQuizzes.find(q => q.id === quizIdFromUrl);
                if (quiz) {
                    // Auto-select this quiz
                    setTimeout(() => {
                        selectQuiz(quiz.id);
                        showNotification(`Loaded quiz: ${quiz.title}`, 'success');
                    }, 500);
                } else {
                    showNotification(`Quiz with ID "${quizIdFromUrl}" not found in ${fileToLoad}`, 'error');
                }
            }
            
            // If no quizzes in file, show warning
            if (availableQuizzes.length === 0) {
                showNotification(`No quizzes found in ${fileToLoad}`, 'warning');
            }
            
        } else {
            throw new Error(`Invalid quiz database format in ${fileToLoad} - missing "quizzes" array`);
        }
        
    } catch (error) {
        console.error('Error loading quiz database:', error);
        showNotification(`Could not load ${fileToLoad}. Using default quizzes.`, 'error');
        
        // Fallback to default quizzes
        availableQuizzes = getDefaultQuizzes();
        displayAvailableQuizzes();
    }
}

function getDefaultQuizzes() {
    return [
        {
            id: 'vocabulary-practice',
            title: 'Vocabulary Practice',
            description: 'Quiz based on your saved words',
            level: 'beginner',
            type: 'vocabulary',
            questionCount: 10,
            author: 'System',
            createdAt: new Date().toISOString(),
            tags: ['vocabulary', 'adaptive', 'practice']
        }
    ];
}

function displayAvailableQuizzes() {
    // Clear previous quizzes display
    const quizzesContainer = document.getElementById('quizzesContainer');
    if (quizzesContainer) {
        quizzesContainer.remove();
    }
    
    // Create container for quizzes
    const container = document.createElement('div');
    container.id = 'quizzesContainer';
    container.className = 'quizzes-container';
    
    // Add heading
    const heading = document.createElement('h3');
    heading.textContent = 'Available Quizzes';
    heading.style.marginTop = '20px';
    heading.style.marginBottom = '15px';
    container.appendChild(heading);
    
    if (availableQuizzes.length === 0) {
        const noQuizzes = document.createElement('div');
        noQuizzes.className = 'no-quizzes';
        noQuizzes.innerHTML = `
            <p>No quizzes found in the selected file.</p>
            <p>Create a quiz in your JSON file with this format:</p>
            <pre>
{
  "version": "1.0.0",
  "quizzes": [
    {
      "id": "quiz-id",
      "title": "Quiz Title",
      "description": "Quiz description",
      "level": "beginner",
      "questions": [...]
    }
  ]
}</pre>
        `;
        container.appendChild(noQuizzes);
    } else {
        // Display each quiz
        availableQuizzes.forEach(quiz => {
            const quizCard = createQuizCard(quiz);
            container.appendChild(quizCard);
        });
    }
    
    // Insert after the file selector
    if (quizFileSelect && quizFileSelect.parentNode) {
        quizFileSelect.parentNode.appendChild(container);
    } else if (quizContainer) {
        quizContainer.parentNode.insertBefore(container, quizContainer);
    }
}

function createQuizCard(quiz) {
    const card = document.createElement('div');
    card.className = 'quiz-card';
    card.dataset.quizId = quiz.id;
    
    const levelBadge = quiz.level === 'beginner' ? '🟢 Beginner' : 
                      quiz.level === 'intermediate' ? '🟡 Intermediate' : 
                      quiz.level === 'advanced' ? '🔴 Advanced' : '⚪ All Levels';
    
    // Determine question count
    let questionCount = quiz.questionCount;
    if (!questionCount && quiz.questions) {
        questionCount = quiz.questions.length;
    }
    if (!questionCount) {
        questionCount = 'Variable';
    }
    
    card.innerHTML = `
        <div class="quiz-card-header">
            <h4>${quiz.title}</h4>
            <span class="level-badge ${quiz.level}">${levelBadge}</span>
        </div>
        <div class="quiz-card-body">
            <p class="quiz-description">${quiz.description || 'No description available.'}</p>
            <div class="quiz-card-meta">
                <span><i class="fas fa-question-circle"></i> ${questionCount} questions</span>
                <span><i class="fas fa-user"></i> ${quiz.author || 'Unknown'}</span>
                ${quiz.tags && quiz.tags.length > 0 ? 
                    `<span><i class="fas fa-tags"></i> ${quiz.tags.slice(0, 2).join(', ')}</span>` : ''}
            </div>
            ${quiz.instructions ? `<div class="quiz-instructions"><strong>Instructions:</strong> ${quiz.instructions}</div>` : ''}
        </div>
        <div class="quiz-card-footer">
            <button class="btn btn-primary select-quiz-btn" data-quiz-id="${quiz.id}">
                <i class="fas fa-play"></i> Select Quiz
            </button>
            ${quizIdFromUrl === quiz.id ? '<span class="from-url-badge">From URL</span>' : ''}
        </div>
    `;
    
    // Add click event to select button
    const selectBtn = card.querySelector('.select-quiz-btn');
    selectBtn.addEventListener('click', () => selectQuiz(quiz.id));
    
    // Make entire card clickable
    card.addEventListener('click', (e) => {
        if (!e.target.closest('.select-quiz-btn')) {
            selectQuiz(quiz.id);
        }
    });
    
    return card;
}

function selectQuiz(quizId) {
    const quiz = availableQuizzes.find(q => q.id === quizId);
    if (!quiz) {
        showNotification('Quiz not found!', 'error');
        return;
    }
    
    // Update selected quiz UI
    document.querySelectorAll('.quiz-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    const selectedCard = document.querySelector(`.quiz-card[data-quiz-id="${quizId}"]`);
    if (selectedCard) {
        selectedCard.classList.add('selected');
    }
    
    // Update quiz info
    if (quizInfo) {
        quizInfo.innerHTML = `
            <div class="selected-quiz-info">
                <h3>Selected Quiz: ${quiz.title}</h3>
                <p><strong>Description:</strong> ${quiz.description || 'No description'}</p>
                <p><strong>Level:</strong> ${quiz.level}</p>
                <p><strong>Questions:</strong> ${quiz.questionCount || (quiz.questions ? quiz.questions.length : 'Variable')}</p>
                <p><strong>Author:</strong> ${quiz.author || 'Unknown'}</p>
                ${quiz.instructions ? `<p><strong>Instructions:</strong> ${quiz.instructions}</p>` : ''}
            </div>
        `;
    }
    
    // Enable start button
    if (startQuizBtn) {
        startQuizBtn.disabled = false;
        startQuizBtn.innerHTML = `<i class="fas fa-play"></i> Start "${quiz.title}"`;
        startQuizBtn.dataset.selectedQuizId = quizId;
    }
    
    // Update URL
    updateUrlWithQuizId(quizId);
    
    showNotification(`Selected quiz: ${quiz.title}`, 'success');
}

function updateUrlWithQuizId(quizId) {
    const url = new URL(window.location);
    if (quizId) {
        url.searchParams.set('id', quizId);
    } else {
        url.searchParams.delete('id');
    }
    
    // Update URL without reloading the page
    window.history.replaceState({}, '', url);
}

// =============== QUIZ FUNCTIONS ===============

async function startQuiz() {
    if (!startQuizBtn || startQuizBtn.disabled) {
        showNotification('Please select a quiz first!', 'warning');
        return;
    }
    
    const quizId = startQuizBtn.dataset.selectedQuizId;
    if (!quizId) {
        showNotification('No quiz selected!', 'error');
        return;
    }
    
    const quiz = availableQuizzes.find(q => q.id === quizId);
    if (!quiz) {
        showNotification('Selected quiz not found!', 'error');
        return;
    }
    
    // Load questions
    let questions = [];
    
    if (quiz.questions && quiz.questions.length > 0) {
        questions = [...quiz.questions];
    } else {
        // Fallback to vocabulary questions
        questions = generateVocabularyQuestions(10);
    }
    
    if (questions.length === 0) {
        showNotification('No questions available for this quiz!', 'error');
        return;
    }
    
    // Reset quiz state
    currentQuiz = {
        active: true,
        currentQuestionIndex: 0,
        score: 0,
        streak: 0,
        questions: shuffleArray(questions),
        answered: false,
        startTime: new Date(),
        timer: null,
        selectedQuiz: quiz,
        correctAnswers: 0,
        totalQuestions: questions.length,
        bestStreak: 0
    };
    
    // Update UI
    if (quizFileSelect) quizFileSelect.disabled = true;
    if (startQuizBtn) {
        startQuizBtn.style.display = 'none';
    }
    
    // Hide quizzes container
    const quizzesContainer = document.getElementById('quizzesContainer');
    if (quizzesContainer) {
        quizzesContainer.style.display = 'none';
    }
    
    if (quizInfo) {
        quizInfo.style.display = 'none';
    }
    
    if (quizActions) {
        quizActions.style.display = 'flex';
    }
    
    // Load first question
    loadQuestion();
    updateQuizStats();
    startTimer();
    
    showNotification(`Started "${quiz.title}"! Good luck!`, 'success');
}

function generateVocabularyQuestions(count) {
    const questions = [];
    const wordPool = [...savedWords].filter(word => 
        word.translation && 
        word.translation !== word.word && 
        word.translation.trim() !== ''
    );
    
    if (wordPool.length < 4) {
        showNotification('Need at least 4 words with translations for a quiz!', 'warning');
        return [];
    }
    
    const questionCount = Math.min(count, Math.floor(wordPool.length / 2));
    
    for (let i = 0; i < questionCount; i++) {
        const correctWord = wordPool[Math.floor(Math.random() * wordPool.length)];
        const incorrectWords = [];
        
        // Get 3 incorrect choices from different words
        while (incorrectWords.length < 3) {
            const randomWord = wordPool[Math.floor(Math.random() * wordPool.length)];
            if (randomWord !== correctWord && 
                !incorrectWords.includes(randomWord) &&
                randomWord.translation !== correctWord.translation) {
                incorrectWords.push(randomWord);
            }
        }
        
        // Create multiple choice question
        questions.push({
            type: 'multiple_choice',
            question: `What is the translation of "${correctWord.word}"?`,
            correctAnswer: correctWord.translation,
            choices: shuffleArray([
                correctWord.translation,
                ...incorrectWords.map(w => w.translation)
            ]),
            word: correctWord,
            explanation: `"${correctWord.word}" means "${correctWord.translation}" in Arabic.`
        });
    }
    
    return questions;
}

function loadQuestion() {
    if (!currentQuiz.active || !quizContainer) return;
    
    const question = currentQuiz.questions[currentQuiz.currentQuestionIndex];
    const letters = ['A', 'B', 'C', 'D'];
    
    let questionHTML = '';
    
    if (question.type === 'multiple_choice') {
        questionHTML = `
            <div class="question-card">
                <div class="question-header">
                    <span class="question-number">Question ${currentQuiz.currentQuestionIndex + 1} of ${currentQuiz.totalQuestions}</span>
                    <span class="quiz-title">${currentQuiz.selectedQuiz.title}</span>
                </div>
                <div class="question-text">
                    ${question.question}
                </div>
                <div class="choices-container">
                    ${question.choices.map((choice, index) => `
                        <button class="choice-btn" data-choice="${choice}">
                            <span class="choice-letter">${letters[index]}</span>
                            <span class="choice-text">${choice}</span>
                        </button>
                    `).join('')}
                </div>
                <div id="questionFeedback" class="feedback"></div>
                <div class="progress-bar">
                    <div class="progress-fill" 
                         style="width: ${((currentQuiz.currentQuestionIndex + 1) / currentQuiz.totalQuestions) * 100}%">
                    </div>
                </div>
            </div>
        `;
    } else if (question.type === 'translation') {
        questionHTML = `
            <div class="question-card">
                <div class="question-header">
                    <span class="question-number">Question ${currentQuiz.currentQuestionIndex + 1} of ${currentQuiz.totalQuestions}</span>
                    <span class="quiz-title">${currentQuiz.selectedQuiz.title}</span>
                </div>
                <div class="question-text">
                    ${question.question}
                </div>
                <div class="translation-input">
                    <input type="text" id="translationAnswer" 
                           placeholder="Type your translation..." 
                           autocomplete="off"
                           autofocus>
                    <button id="submitTranslation" class="btn btn-primary">
                        <i class="fas fa-check"></i> Submit
                    </button>
                </div>
                <div id="questionFeedback" class="feedback"></div>
                <div class="progress-bar">
                    <div class="progress-fill" 
                         style="width: ${((currentQuiz.currentQuestionIndex + 1) / currentQuiz.totalQuestions) * 100}%">
                    </div>
                </div>
            </div>
        `;
    }
    
    quizContainer.innerHTML = questionHTML;
    
    // Add event listeners
    if (question.type === 'multiple_choice') {
        document.querySelectorAll('.choice-btn').forEach(button => {
            button.addEventListener('click', () => handleAnswer(button.dataset.choice));
        });
    } else if (question.type === 'translation') {
        const submitBtn = document.getElementById('submitTranslation');
        const answerInput = document.getElementById('translationAnswer');
        
        if (submitBtn) {
            submitBtn.addEventListener('click', () => {
                const answer = answerInput.value.trim();
                if (answer) {
                    handleAnswer(answer);
                } else {
                    answerInput.focus();
                }
            });
        }
        
        if (answerInput) {
            answerInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    const answer = answerInput.value.trim();
                    if (answer) {
                        handleAnswer(answer);
                    } else {
                        answerInput.focus();
                    }
                }
            });
            
            // Auto-focus input
            answerInput.focus();
        }
    }
    
    currentQuiz.answered = false;
}

function handleAnswer(selectedAnswer) {
    if (currentQuiz.answered || !currentQuiz.active) return;
    
    const question = currentQuiz.questions[currentQuiz.currentQuestionIndex];
    const isCorrect = normalizeAnswer(selectedAnswer) === normalizeAnswer(question.correctAnswer);
    const feedback = document.getElementById('questionFeedback');
    
    // Handle different question types
    if (question.type === 'multiple_choice') {
        const choiceButtons = document.querySelectorAll('.choice-btn');
        
        // Mark correct/incorrect choices
        choiceButtons.forEach(button => {
            button.classList.add('disabled');
            if (normalizeAnswer(button.dataset.choice) === normalizeAnswer(question.correctAnswer)) {
                button.classList.add('correct');
            } else if (normalizeAnswer(button.dataset.choice) === normalizeAnswer(selectedAnswer) && !isCorrect) {
                button.classList.add('incorrect');
            }
        });
    }
    
    // Show feedback with explanation
    const explanation = question.explanation || '';
    
    if (isCorrect) {
        if (feedback) {
            feedback.innerHTML = `
                <div class="feedback-content">
                    <i class="fas fa-check-circle"></i> 
                    <div>
                        <strong>Correct!</strong> ${question.correctAnswer} is the right answer.
                        ${explanation ? `<p class="explanation">${explanation}</p>` : ''}
                    </div>
                </div>
            `;
            feedback.className = 'feedback correct';
        }
        
        // Update score
        currentQuiz.score += 10;
        currentQuiz.streak++;
        currentQuiz.correctAnswers++;
        
        // Update best streak
        if (currentQuiz.streak > currentQuiz.bestStreak) {
            currentQuiz.bestStreak = currentQuiz.streak;
        }
        
    } else {
        if (feedback) {
            feedback.innerHTML = `
                <div class="feedback-content">
                    <i class="fas fa-times-circle"></i> 
                    <div>
                        <strong>Incorrect.</strong> The correct answer is ${question.correctAnswer}.
                        ${selectedAnswer ? `<p>You answered: ${selectedAnswer}</p>` : ''}
                        ${explanation ? `<p class="explanation">${explanation}</p>` : ''}
                    </div>
                </div>
            `;
            feedback.className = 'feedback incorrect';
        }
        
        // Reset streak
        currentQuiz.streak = 0;
    }
    
    currentQuiz.answered = true;
    updateQuizStats();
}

function nextQuestion() {
    if (!currentQuiz.answered) {
        showNotification('Please answer the current question first!', 'warning');
        return;
    }
    
    currentQuiz.currentQuestionIndex++;
    
    if (currentQuiz.currentQuestionIndex < currentQuiz.questions.length) {
        loadQuestion();
    } else {
        showQuizResults();
    }
    
    updateQuizStats();
}

function endQuiz() {
    if (currentQuiz.active && currentQuiz.currentQuestionIndex < currentQuiz.questions.length) {
        if (!confirm('Are you sure you want to end the quiz? Your progress will be lost.')) {
            return;
        }
    }
    
    if (currentQuiz.timer) {
        clearInterval(currentQuiz.timer);
    }
    currentQuiz.active = false;
    
    // Reset UI
    if (quizFileSelect) quizFileSelect.disabled = false;
    if (startQuizBtn) {
        startQuizBtn.style.display = 'inline-block';
        startQuizBtn.disabled = true;
        startQuizBtn.innerHTML = '<i class="fas fa-play"></i> Start Quiz';
        delete startQuizBtn.dataset.selectedQuizId;
    }
    
    // Show quizzes container
    const quizzesContainer = document.getElementById('quizzesContainer');
    if (quizzesContainer) {
        quizzesContainer.style.display = 'block';
    }
    
    if (quizInfo) {
        quizInfo.style.display = 'block';
        quizInfo.innerHTML = '<p>Select a quiz from the list above.</p>';
    }
    
    if (quizActions) {
        quizActions.style.display = 'none';
    }
    
    // Clear quiz container
    if (quizContainer) {
        quizContainer.innerHTML = `
            <div class="quiz-welcome">
                <div class="welcome-icon">
                    <i class="fas fa-brain"></i>
                </div>
                <h3>Quiz Ended</h3>
                <p>Select a quiz from the list above to start a new quiz!</p>
            </div>
        `;
    }
    
    // Reset stats
    resetQuizStats();
    
    showNotification('Quiz ended', 'info');
}

function showQuizResults() {
    if (currentQuiz.timer) {
        clearInterval(currentQuiz.timer);
    }
    currentQuiz.active = false;
    
    const percentage = Math.round((currentQuiz.correctAnswers / currentQuiz.totalQuestions) * 100);
    const elapsed = Math.floor((new Date() - currentQuiz.startTime) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    
    let message = '';
    let icon = '';
    
    if (percentage >= 90) {
        message = 'Excellent! Perfect score! 🏆';
        icon = 'fas fa-trophy';
    } else if (percentage >= 75) {
        message = 'Great job! Keep practicing! ⭐';
        icon = 'fas fa-star';
    } else if (percentage >= 60) {
        message = 'Good effort! Try again to improve. 👍';
        icon = 'fas fa-thumbs-up';
    } else {
        message = 'Keep practicing! You\'ll get better! 💪';
        icon = 'fas fa-redo';
    }
    
    if (quizContainer) {
        quizContainer.innerHTML = `
            <div class="quiz-complete">
                <div class="completion-icon">
                    <i class="${icon}"></i>
                </div>
                <h3>${currentQuiz.selectedQuiz.title}</h3>
                <div class="score-display">${percentage}%</div>
                <div class="result-details">
                    <p><strong>Correct Answers:</strong> ${currentQuiz.correctAnswers}/${currentQuiz.totalQuestions}</p>
                    <p><strong>Time:</strong> ${minutes}m ${seconds}s</p>
                    <p><strong>Best Streak:</strong> ${currentQuiz.bestStreak}</p>
                    <p><strong>Total Score:</strong> ${currentQuiz.score} points</p>
                    <p class="result-message">${message}</p>
                </div>
                
                <div class="quiz-complete-actions">
                    <button id="restartQuiz" class="btn btn-primary">
                        <i class="fas fa-redo"></i> Try Again
                    </button>
                    <button id="newQuiz" class="btn btn-secondary">
                        <i class="fas fa-list"></i> New Quiz
                    </button>
                </div>
            </div>
        `;
        
        // Add event listeners
        const restartBtn = document.getElementById('restartQuiz');
        const newQuizBtn = document.getElementById('newQuiz');
        
        if (restartBtn) restartBtn.addEventListener('click', startQuiz);
        if (newQuizBtn) newQuizBtn.addEventListener('click', endQuiz);
    }
}

function startTimer() {
    if (currentQuiz.timer) clearInterval(currentQuiz.timer);
    
    currentQuiz.timer = setInterval(() => {
        if (currentQuiz.active) {
            const elapsed = Math.floor((new Date() - currentQuiz.startTime) / 1000);
            const minutes = Math.floor(elapsed / 60).toString().padStart(2, '0');
            const seconds = (elapsed % 60).toString().padStart(2, '0');
            if (quizTime) {
                quizTime.textContent = `${minutes}:${seconds}`;
            }
        }
    }, 1000);
}

function updateQuizStats() {
    if (!currentQuiz.active) return;
    
    if (quizScore) quizScore.textContent = currentQuiz.score;
    if (quizStreak) quizStreak.textContent = currentQuiz.streak;
    if (quizProgress) quizProgress.textContent = `${currentQuiz.currentQuestionIndex + 1}/${currentQuiz.totalQuestions}`;
}

function resetQuizStats() {
    if (quizScore) quizScore.textContent = '0';
    if (quizStreak) quizStreak.textContent = '0';
    if (quizProgress) quizProgress.textContent = '0/0';
    if (quizTime) quizTime.textContent = '00:00';
}

// =============== UTILITY FUNCTIONS ===============

function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function normalizeAnswer(answer) {
    return answer.toString().toLowerCase().trim().replace(/[.,!?;:]/g, '');
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    // Set background color based on type
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#3b82f6'
    };
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${colors[type] || colors.info};
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        font-weight: 500;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// =============== SETUP FUNCTIONS ===============

function setupEventListeners() {
    // File selection change
    if (quizFileSelect) {
        quizFileSelect.addEventListener('change', async function() {
            console.log(`Switching to quiz file: ${this.value}`);
            
            // Show loading
            const quizzesContainer = document.getElementById('quizzesContainer');
            if (quizzesContainer) {
                quizzesContainer.innerHTML = '<div class="loading">Loading quizzes...</div>';
            }
            
            if (startQuizBtn) {
                startQuizBtn.disabled = true;
                startQuizBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
            }
            
            // Load the new database
            await loadQuizDatabase(this.value);
            
            showNotification(`Loaded ${this.value} successfully!`, 'success');
        });
    }
    
    // Quiz controls
    if (startQuizBtn) {
        startQuizBtn.addEventListener('click', startQuiz);
    }
    
    if (nextQuestionBtn) {
        nextQuestionBtn.addEventListener('click', nextQuestion);
    }
    
    if (endQuizBtn) {
        endQuizBtn.addEventListener('click', endQuiz);
    }
    
    // Settings
    if (settingsButton) {
        settingsButton.addEventListener('click', () => {
            if (settingsPage) settingsPage.classList.toggle('open');
            if (settingsOverlay) settingsOverlay.classList.add('active');
        });
    }
    
    if (closeSettings) {
        closeSettings.addEventListener('click', () => {
            if (settingsPage) settingsPage.classList.remove('open');
            if (settingsOverlay) settingsOverlay.classList.remove('active');
        });
    }
    
    if (settingsOverlay) {
        settingsOverlay.addEventListener('click', () => {
            if (settingsPage) settingsPage.classList.remove('open');
            if (settingsOverlay) settingsOverlay.classList.remove('active');
        });
    }
    
    // Escape key to close settings
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (settingsPage && settingsPage.classList.contains('open')) {
                settingsPage.classList.remove('open');
                if (settingsOverlay) settingsOverlay.classList.remove('active');
            }
        }
    });
}

// =============== INITIALIZATION ===============

async function init() {
    console.log('Initializing Quiz App...');
    
    // Load saved words
    try {
        savedWords = JSON.parse(localStorage.getItem('savedWords')) || [];
        console.log(`Loaded ${savedWords.length} saved words`);
    } catch (error) {
        console.error('Error loading saved words:', error);
        savedWords = [];
    }
    
    // Setup event listeners
    setupEventListeners();
    
    // Load initial quiz database
    await loadQuizDatabase();
    
    // Initialize quiz system
    resetQuizStats();
    
    console.log('Quiz App initialized successfully!');
    
    // Log URL parameters
    if (quizIdFromUrl) {
        console.log('Quiz ID from URL:', quizIdFromUrl);
    }
}

// Add CSS styles
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
    
    /* Quizzes container */
    .quizzes-container {
        margin: 20px 0;
        padding: 20px;
        background: var(--bg-secondary);
        border-radius: 10px;
        border: 1px solid var(--border);
    }
    
    .quizzes-container h3 {
        margin: 0 0 15px 0;
        color: var(--text-primary);
        font-size: 1.2rem;
    }
    
    /* Quiz cards */
    .quiz-card {
        background: var(--bg-primary);
        border-radius: 8px;
        padding: 15px;
        margin-bottom: 15px;
        border: 2px solid transparent;
        transition: all 0.3s ease;
        cursor: pointer;
    }
    
    .quiz-card:hover {
        border-color: var(--primary);
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }
    
    .quiz-card.selected {
        border-color: var(--primary);
        background: rgba(74, 108, 247, 0.1);
    }
    
    .quiz-card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
    }
    
    .quiz-card-header h4 {
        margin: 0;
        font-size: 1.1rem;
        color: var(--text-primary);
    }
    
    .level-badge {
        font-size: 0.8rem;
        padding: 4px 8px;
        border-radius: 4px;
        font-weight: 600;
    }
    
    .level-badge.beginner { 
        color: #10b981;
        background: rgba(16, 185, 129, 0.1);
    }
    .level-badge.intermediate { 
        color: #f59e0b;
        background: rgba(245, 158, 11, 0.1);
    }
    .level-badge.advanced { 
        color: #ef4444;
        background: rgba(239, 68, 68, 0.1);
    }
    
    .quiz-card-body {
        margin-bottom: 15px;
    }
    
    .quiz-description {
        margin: 0 0 10px 0;
        color: var(--text-light);
        font-size: 0.95rem;
        line-height: 1.4;
    }
    
    .quiz-card-meta {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        font-size: 0.85rem;
        color: var(--text-light);
    }
    
    .quiz-card-meta span {
        display: flex;
        align-items: center;
        gap: 5px;
    }
    
    .quiz-card-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    
    .select-quiz-btn {
        padding: 8px 16px;
        font-size: 0.9rem;
    }
    
    .from-url-badge {
        background: #3b82f6;
        color: white;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 0.8rem;
        font-weight: 600;
    }
    
    /* Selected quiz info */
    .selected-quiz-info {
        background: var(--bg-secondary);
        padding: 15px;
        border-radius: 8px;
        margin: 15px 0;
        border-left: 4px solid var(--primary);
    }
    
    .selected-quiz-info h3 {
        margin: 0 0 10px 0;
        color: var(--text-primary);
    }
    
    .selected-quiz-info p {
        margin: 5px 0;
        color: var(--text-light);
    }
    
    /* Quiz container */
    .quiz-welcome {
        text-align: center;
        padding: 40px 20px;
        color: var(--text-light);
    }
    
    .welcome-icon {
        font-size: 48px;
        color: var(--primary);
        margin-bottom: 20px;
        opacity: 0.7;
    }
    
    .question-card {
        background: var(--bg-primary);
        border-radius: 10px;
        padding: 20px;
        margin-bottom: 20px;
        border: 1px solid var(--border);
    }
    
    .question-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        padding-bottom: 10px;
        border-bottom: 1px solid var(--border);
    }
    
    .question-number {
        color: var(--text-light);
        font-weight: 500;
    }
    
    .quiz-title {
        color: var(--primary);
        font-weight: 600;
        font-size: 0.9rem;
    }
    
    .question-text {
        font-size: 1.2rem;
        margin-bottom: 20px;
        color: var(--text-primary);
        line-height: 1.4;
    }
    
    .choices-container {
        display: flex;
        flex-direction: column;
        gap: 10px;
        margin-bottom: 20px;
    }
    
    .choice-btn {
        background: var(--bg-secondary);
        border: 2px solid var(--border);
        border-radius: 8px;
        padding: 15px;
        text-align: left;
        cursor: pointer;
        transition: all 0.2s ease;
        display: flex;
        align-items: center;
        gap: 15px;
    }
    
    .choice-btn:hover:not(.disabled) {
        background: var(--bg-hover);
        border-color: var(--primary);
    }
    
    .choice-btn.correct {
        background: rgba(16, 185, 129, 0.2);
        border-color: #10b981;
        color: #10b981;
    }
    
    .choice-btn.incorrect {
        background: rgba(239, 68, 68, 0.2);
        border-color: #ef4444;
        color: #ef4444;
    }
    
    .choice-btn.disabled {
        cursor: not-allowed;
        opacity: 0.8;
    }
    
    .choice-letter {
        width: 30px;
        height: 30px;
        background: var(--bg-primary);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 600;
    }
    
    .choice-text {
        flex: 1;
        font-size: 1rem;
    }
    
    /* Quiz results */
    .quiz-complete {
        text-align: center;
        padding: 30px 20px;
    }
    
    .completion-icon {
        font-size: 64px;
        color: var(--primary);
        margin-bottom: 20px;
        opacity: 0.8;
    }
    
    .score-display {
        font-size: 48px;
        font-weight: 800;
        color: var(--primary);
        margin: 20px 0;
        line-height: 1;
    }
    
    .result-details {
        background: var(--bg-secondary);
        padding: 20px;
        border-radius: 10px;
        margin: 20px 0;
        text-align: left;
    }
    
    .result-details p {
        margin: 8px 0;
        color: var(--text-primary);
    }
    
    .result-message {
        margin-top: 15px !important;
        padding-top: 15px;
        border-top: 1px solid var(--border);
        font-size: 18px;
        font-weight: 600;
    }
    
    .quiz-complete-actions {
        display: flex;
        gap: 10px;
        margin-top: 30px;
        justify-content: center;
        flex-wrap: wrap;
    }
    
    /* Loading state */
    .loading {
        text-align: center;
        padding: 20px;
        color: var(--text-light);
    }
    
    /* Responsive */
    @media (max-width: 768px) {
        .quiz-card-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 5px;
        }
        
        .quiz-card-footer {
            flex-direction: column;
            gap: 10px;
            align-items: flex-start;
        }
        
        .quiz-complete-actions {
            flex-direction: column;
        }
        
        .quiz-complete-actions .btn {
            width: 100%;
        }
    }
`;
document.head.appendChild(style);

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}