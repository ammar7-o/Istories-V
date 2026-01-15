
// Flashcard statistics elements
const dueCards = document.getElementById('dueCards');
const totalCards = document.getElementById('totalCards');
const masteredCards = document.getElementById('masteredCards');
const learningCards = document.getElementById('learningCards');

// Navigation elements
const pages = document.querySelectorAll('.page');
const navLinks = document.querySelectorAll('.nav-link');

// Settings elements
const settingsButton = document.getElementById("settings-button");
const settingsPage = document.getElementById("settings-page");
const closeSettings = document.getElementById("close-settings");
const settingsOverlay = document.getElementById("settings-overlay");
const themeToggle = document.getElementById('themeToggle');

// App state
let currentPage = 'home';
let savedWords = JSON.parse(localStorage.getItem('savedWords')) || [];

// Color settings
let selectedColor = localStorage.getItem('selectedColor') || '#4f46e5';
let selectedSecondaryColor = localStorage.getItem('selectedSecondaryColor') || '#10b981';

// Flashcard system variables
let currentCards = [];
let currentCardIndex = 0;
let cardsReviewed = 0;
let sessionCards = [];
// Navigation menu elements
const toggleNav = document.getElementById("toggle-nav");
const more = document.getElementById("more");

// Navigation menu state
let isMenuOpen = false;

// =============== NAVIGATION MENU FUNCTIONS ===============
function setupNavToggle() {
    if (!toggleNav || !more) return;

    console.log('Setting up navigation menu toggle...');

    // Toggle menu
    toggleNav.addEventListener("click", function (e) {
        e.stopPropagation();
        isMenuOpen = !isMenuOpen;
        more.classList.toggle("open");
        console.log('Menu toggled, isOpen:', isMenuOpen);
    });

    // Close menu when clicking anywhere
    document.addEventListener("click", function () {
        if (isMenuOpen) {
            more.classList.remove("open");
            isMenuOpen = false;
            console.log('Menu closed by clicking outside');
        }
    });

    // Prevent closing when clicking inside the menu
    more.addEventListener("click", function (e) {
        e.stopPropagation();
    });

    // Close menu on Escape key
    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && isMenuOpen) {
            more.classList.remove("open");
            isMenuOpen = false;
            console.log('Menu closed by Escape key');
        }
    });

    // Close menu when clicking on any <a> inside the menu
    const links = more.querySelectorAll("a");
    links.forEach(link => {
        link.addEventListener("click", function () {
            more.classList.remove("open");
            isMenuOpen = false;
            console.log('Menu closed by clicking link');
        });
    });

    console.log('Navigation menu toggle setup complete');
}
// =============== THEME & COLOR FUNCTIONS ===============
// Theme functions using .dark-mode class on body (matches your CSS)

function toggleTheme() {
    const isDarkMode = document.body.classList.contains('dark-mode');
    const newTheme = isDarkMode ? 'light' : 'dark';

    console.log('Toggling theme from', isDarkMode ? 'dark' : 'light', 'to', newTheme);

    // Update body class
    if (newTheme === 'dark') {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }

    // Save to localStorage
    localStorage.setItem('theme', newTheme);
    console.log('Theme saved to localStorage:', newTheme);

    // Update theme toggle icon
    if (themeToggle) {
        const icon = themeToggle.querySelector('i');
        if (icon) {
            icon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
    }

    // Re-apply colors for the new theme
    applyPrimaryColor(selectedColor);
    applySecondaryColor(selectedSecondaryColor);

    // Show notification
    showNotification(`Switched to ${newTheme} mode`, 'success');
}

function applyTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    console.log('Applying theme from localStorage:', savedTheme);

    // Apply to body class
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        console.log('Added dark-mode class to body');
    } else {
        document.body.classList.remove('dark-mode');
        console.log('Removed dark-mode class from body');
    }

    // Update theme toggle icon
    if (themeToggle) {
        const icon = themeToggle.querySelector('i');
        if (icon) {
            icon.className = savedTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
            console.log('Updated theme icon to:', icon.className);
        }
    }
}

function initColorSelector() {
    const colorOptions = document.querySelectorAll('.color-option:not(.custom-color)');
    const customColorPicker = document.getElementById('customColorPicker');

    console.log('Initializing color selector...');
    console.log('Found color options:', colorOptions.length);

    // Remove active class from all options first
    colorOptions.forEach(opt => opt.classList.remove('active'));

    // Set active color based on saved preference
    if (colorOptions.length > 0) {
        colorOptions.forEach(option => {
            // Check if this option matches the saved color
            if (option.dataset.color === selectedColor) {
                option.classList.add('active');
                console.log('Setting active color option:', selectedColor);
            }

            option.addEventListener('click', () => {
                console.log('Color option clicked:', option.dataset.color);

                // Remove active class from all options
                colorOptions.forEach(opt => opt.classList.remove('active'));

                // Add active class to clicked option
                option.classList.add('active');

                // Get selected color
                const color = option.dataset.color;

                // Apply ONLY the primary color
                applyPrimaryColor(color);

                // Save to localStorage
                localStorage.setItem('selectedColor', color);
                selectedColor = color;

                // Update custom color picker
                if (customColorPicker) {
                    customColorPicker.value = color;
                }

                showNotification('Primary color updated!', 'success');
            });
        });
    }

    // Custom color picker
    if (customColorPicker) {
        console.log('Custom color picker found');

        // Set initial value from saved color
        customColorPicker.value = selectedColor;

        customColorPicker.addEventListener('input', (e) => {
            const color = e.target.value;
            console.log('Custom color input:', color);

            // Remove active class from preset colors
            colorOptions.forEach(opt => opt.classList.remove('active'));

            // Apply ONLY the primary color
            applyPrimaryColor(color);

            // Save to localStorage
            localStorage.setItem('selectedColor', color);
            selectedColor = color;
        });

        customColorPicker.addEventListener('change', (e) => {
            const color = e.target.value;

            // Remove active class from preset colors
            colorOptions.forEach(opt => opt.classList.remove('active'));

            // Apply ONLY the primary color
            applyPrimaryColor(color);

            // Save to localStorage
            localStorage.setItem('selectedColor', color);
            selectedColor = color;

            showNotification('Custom primary color saved', 'success');
        });

        // Also trigger change on custom color picker click
        customColorPicker.parentElement.addEventListener('click', (e) => {
            if (e.target !== customColorPicker) {
                customColorPicker.click();
            }
        });
    }
}

function initSecondaryColorSelector() {
    const secondaryColorOptions = document.querySelectorAll('.secondary-color:not(.custom-color)');
    const customSecondaryColorPicker = document.getElementById('customSecondaryColorPicker');

    console.log('Initializing secondary color selector...');
    console.log('Found secondary color options:', secondaryColorOptions.length);

    // Remove active class from all secondary options first
    secondaryColorOptions.forEach(opt => opt.classList.remove('active'));

    // Set active secondary color based on saved preference
    if (secondaryColorOptions.length > 0) {
        secondaryColorOptions.forEach(option => {
            // Check if this option matches the saved secondary color
            if (option.dataset.color === selectedSecondaryColor) {
                option.classList.add('active');
                console.log('Setting active secondary color option:', selectedSecondaryColor);
            }

            option.addEventListener('click', () => {
                console.log('Secondary color option clicked:', option.dataset.color);

                // Remove active class from all secondary options
                secondaryColorOptions.forEach(opt => opt.classList.remove('active'));

                // Add active class to clicked option
                option.classList.add('active');

                // Get selected secondary color
                const color = option.dataset.color;

                // Apply ONLY the secondary color
                applySecondaryColor(color);

                // Save to localStorage
                localStorage.setItem('selectedSecondaryColor', color);
                selectedSecondaryColor = color;

                // Update custom secondary color picker
                if (customSecondaryColorPicker) {
                    customSecondaryColorPicker.value = color;
                }

                showNotification('Secondary color updated!', 'success');
            });
        });
    }

    // Custom secondary color picker
    if (customSecondaryColorPicker) {
        console.log('Custom secondary color picker found');

        // Set initial value from saved secondary color
        customSecondaryColorPicker.value = selectedSecondaryColor;

        customSecondaryColorPicker.addEventListener('input', (e) => {
            const color = e.target.value;
            console.log('Custom secondary color input:', color);

            // Remove active class from preset secondary colors
            secondaryColorOptions.forEach(opt => opt.classList.remove('active'));

            // Apply ONLY the secondary color
            applySecondaryColor(color);

            // Save to localStorage
            localStorage.setItem('selectedSecondaryColor', color);
            selectedSecondaryColor = color;
        });

        customSecondaryColorPicker.addEventListener('change', (e) => {
            const color = e.target.value;

            // Remove active class from preset secondary colors
            secondaryColorOptions.forEach(opt => opt.classList.remove('active'));

            // Apply ONLY the secondary color
            applySecondaryColor(color);

            // Save to localStorage
            localStorage.setItem('selectedSecondaryColor', color);
            selectedSecondaryColor = color;

            showNotification('Custom secondary color saved', 'success');
        });

        // Also trigger change on custom color picker click
        customSecondaryColorPicker.parentElement.addEventListener('click', (e) => {
            if (e.target !== customSecondaryColorPicker) {
                customSecondaryColorPicker.click();
            }
        });
    }
}

function applyPrimaryColor(color) {
    // Calculate darker shade for --primary-dark
    const darkerColor = adjustColor(color, -20);

    // Update ONLY the primary color variables in CSS
    const root = document.documentElement;
    root.style.setProperty('--primary', color);
    root.style.setProperty('--primary-dark', darkerColor);

    console.log('Applied primary color:', color, 'Dark variant:', darkerColor);
}

function applySecondaryColor(color) {
    // Calculate darker and lighter shades
    const darkerColor = adjustColor(color, -20);
    const lighterColor = adjustColor(color, 20);

    // Update ONLY the secondary color variables in CSS
    const root = document.documentElement;
    root.style.setProperty('--secondary', color);
    root.style.setProperty('--secondary-dark', darkerColor);
    root.style.setProperty('--secondary-light', lighterColor);

    console.log('Applied secondary color:', color, 'Dark variant:', darkerColor, 'Light variant:', lighterColor);
}

function adjustColor(color, percent) {
    const num = parseInt(color.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;

    return '#' + (
        0x1000000 +
        (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
        (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
        (B < 255 ? B < 1 ? 0 : B : 255)
    ).toString(16).slice(1);
}
// =============== QUIZ SYSTEM ===============

// Add these variables at the top
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
    totalQuestions: 0
};

// Quiz data structure
let availableQuizzes = [];

// Load available quizzes from your specific directory
async function loadAvailableQuizzes() {
    try {
        // Load from your specific path
        const response = await fetch('/home/ammar/Desktop/IStories-V2/English/quiz/quizzes.json');
        if (!response.ok) {
            // Try alternative path (relative to your website)
            const altResponse = await fetch('English/quiz/quizzes.json');
            if (!altResponse.ok) {
                throw new Error('Failed to load quizzes from both paths');
            }
            const quizzesData = await altResponse.json();
            availableQuizzes = quizzesData.quizzes || [];
        } else {
            const quizzesData = await response.json();
            availableQuizzes = quizzesData.quizzes || [];
        }
        
        // Populate quiz select dropdown
        populateQuizSelect();
        
        console.log('Loaded quizzes from directory:', availableQuizzes.length);
        
        // If no quizzes found, add default
        if (availableQuizzes.length === 0) {
            availableQuizzes = [{
                id: 'vocabulary',
                title: 'Vocabulary Practice',
                description: 'Quiz based on your saved words',
                questions: [],
                type: 'vocabulary'
            }];
            populateQuizSelect();
        }
        
    } catch (error) {
        console.error('Error loading quizzes:', error);
        showNotification('Could not load quizzes from directory. Using default quiz.', 'warning');
        
        // Fallback to vocabulary-based quiz
        availableQuizzes = [{
            id: 'vocabulary',
            title: 'Vocabulary Practice',
            description: 'Quiz based on your saved words',
            questions: [],
            type: 'vocabulary'
        }];
        
        populateQuizSelect();
    }
}

function populateQuizSelect() {
    const quizSelect = document.getElementById('quizSelect');
    if (!quizSelect) return;
    
    quizSelect.innerHTML = '<option value="">Select a Quiz...</option>';
    
    availableQuizzes.forEach(quiz => {
        const option = document.createElement('option');
        option.value = quiz.id;
        option.textContent = quiz.title;
        option.title = quiz.description || '';
        quizSelect.appendChild(option);
    });
}

// Initialize quiz
function initQuiz() {
    const startQuizBtn = document.getElementById('startQuiz');
    const nextQuestionBtn = document.getElementById('nextQuestion');
    const endQuizBtn = document.getElementById('endQuiz');
    const quizSelect = document.getElementById('quizSelect');

    if (startQuizBtn) {
        startQuizBtn.addEventListener('click', startQuiz);
    }

    if (nextQuestionBtn) {
        nextQuestionBtn.addEventListener('click', nextQuestion);
    }

    if (endQuizBtn) {
        endQuizBtn.addEventListener('click', endQuiz);
    }

    if (quizSelect) {
        quizSelect.addEventListener('change', function() {
            const selectedId = this.value;
            const quiz = availableQuizzes.find(q => q.id === selectedId);
            
            if (quiz) {
                currentQuiz.selectedQuiz = quiz;
                document.getElementById('startQuiz').disabled = false;
                document.getElementById('startQuiz').innerHTML = 
                    `<i class="fas fa-play"></i> Start "${quiz.title}"`;
            } else {
                document.getElementById('startQuiz').disabled = true;
            }
        });
    }

    // Load available quizzes
    loadAvailableQuizzes();
}

async function startQuiz() {
    if (!currentQuiz.selectedQuiz) {
        showNotification('Please select a quiz first!', 'warning');
        return;
    }

    // Reset quiz state
    currentQuiz = {
        active: true,
        currentQuestionIndex: 0,
        score: 0,
        streak: 0,
        questions: [],
        answered: false,
        startTime: new Date(),
        timer: null,
        selectedQuiz: currentQuiz.selectedQuiz,
        correctAnswers: 0,
        totalQuestions: 0
    };

    // Load questions for the selected quiz
    await loadQuizQuestions();

    if (currentQuiz.questions.length === 0) {
        showNotification('No questions available for this quiz!', 'error');
        return;
    }

    // Update UI
    document.getElementById('quizSelect').disabled = true;
    document.getElementById('startQuiz').style.display = 'none';
    document.getElementById('quizActions').style.display = 'flex';
    document.getElementById('quizSelect').parentElement.style.display = 'none';

    // Load first question
    loadQuestion();
    updateQuizStats();
    startTimer();
}
async function loadQuizQuestions() {
    try {
        const quiz = currentQuiz.selectedQuiz;
        
        if (quiz.type === 'vocabulary') {
            // Generate questions from vocabulary
            currentQuiz.questions = generateVocabularyQuestions(10);
        } else if (quiz.questions && quiz.questions.length > 0) {
            // Use questions from quiz definition
            currentQuiz.questions = quiz.questions;
        } else if (quiz.questionsFile) {
            try {
                // Try loading from your specific path first
                const response = await fetch(`/home/ammar/Desktop/IStories-V2/English/quiz/${quiz.questionsFile}`);
                if (!response.ok) {
                    // Try relative path as fallback
                    const altResponse = await fetch(`English/quiz/${quiz.questionsFile}`);
                    if (!altResponse.ok) {
                        throw new Error('Failed to load questions file');
                    }
                    const questionsData = await altResponse.json();
                    currentQuiz.questions = questionsData.questions || [];
                } else {
                    const questionsData = await response.json();
                    currentQuiz.questions = questionsData.questions || [];
                }
            } catch (fileError) {
                console.error('Error loading questions file:', fileError);
                throw new Error('Failed to load questions file');
            }
        } else {
            currentQuiz.questions = [];
        }
        
        // Shuffle questions
        currentQuiz.questions = shuffleArray(currentQuiz.questions);
        currentQuiz.totalQuestions = currentQuiz.questions.length;
        
    } catch (error) {
        console.error('Error loading quiz questions:', error);
        showNotification('Failed to load quiz questions from file', 'error');
        currentQuiz.questions = [];
    }
}
function generateVocabularyQuestions(count) {
    const questions = [];
    const wordPool = [...savedWords].filter(word => word.translation && word.translation !== word.word);

    if (wordPool.length < 4) {
        showNotification('Need more words with translations for a quiz!', 'warning');
        return [];
    }

    for (let i = 0; i < Math.min(count, wordPool.length); i++) {
        const correctWord = wordPool[Math.floor(Math.random() * wordPool.length)];
        const incorrectWords = [];

        // Get 3 incorrect choices
        while (incorrectWords.length < 3) {
            const randomWord = wordPool[Math.floor(Math.random() * wordPool.length)];
            if (randomWord !== correctWord && !incorrectWords.includes(randomWord)) {
                incorrectWords.push(randomWord);
            }
        }

        // Randomly decide question type
        const isForward = Math.random() > 0.5;
        const questionType = Math.random() > 0.5 ? 'multiple_choice' : 'translation';

        if (questionType === 'multiple_choice') {
            questions.push({
                type: 'multiple_choice',
                question: isForward ? `What is the translation of "${correctWord.word}"?` 
                                   : `What word means "${correctWord.translation}"?`,
                correctAnswer: isForward ? correctWord.translation : correctWord.word,
                choices: shuffleArray([
                    isForward ? correctWord.translation : correctWord.word,
                    ...incorrectWords.map(w => isForward ? w.translation : w.word)
                ]),
                word: correctWord
            });
        } else {
            questions.push({
                type: 'translation',
                question: `Translate: "${correctWord.word}"`,
                correctAnswer: correctWord.translation,
                word: correctWord
            });
        }
    }

    return questions;
}

function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function loadQuestion() {
    const quizContainer = document.getElementById('quizContainer');
    if (!quizContainer || !currentQuiz.active) return;

    const question = currentQuiz.questions[currentQuiz.currentQuestionIndex];
    const letters = ['A', 'B', 'C', 'D'];

    let questionHTML = '';

    if (question.type === 'multiple_choice') {
        questionHTML = `
            <div class="question-card">
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
                    <div class="progress-fill" style="width: ${((currentQuiz.currentQuestionIndex + 1) / currentQuiz.totalQuestions) * 100}%"></div>
                </div>
            </div>
        `;
    } else if (question.type === 'translation') {
        questionHTML = `
            <div class="question-card">
                <div class="question-text">
                    ${question.question}
                </div>
                <div class="translation-input">
                    <input type="text" id="translationAnswer" placeholder="Type your translation..." autocomplete="off">
                    <button id="submitTranslation" class="btn btn-primary">
                        <i class="fas fa-check"></i> Submit
                    </button>
                </div>
                <div id="questionFeedback" class="feedback"></div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${((currentQuiz.currentQuestionIndex + 1) / currentQuiz.totalQuestions) * 100}%"></div>
                </div>
            </div>
        `;
    }

    quizContainer.innerHTML = questionHTML;

    // Add event listeners based on question type
    if (question.type === 'multiple_choice') {
        document.querySelectorAll('.choice-btn').forEach(button => {
            button.addEventListener('click', () => handleAnswer(button.dataset.choice));
        });
    } else if (question.type === 'translation') {
        document.getElementById('submitTranslation').addEventListener('click', () => {
            const answer = document.getElementById('translationAnswer').value.trim();
            if (answer) {
                handleAnswer(answer);
            }
        });
        
        document.getElementById('translationAnswer').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const answer = document.getElementById('translationAnswer').value.trim();
                if (answer) {
                    handleAnswer(answer);
                }
            }
        });
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

    // Show feedback
    if (isCorrect) {
        feedback.innerHTML = `
            <i class="fas fa-check-circle"></i> Correct! 
            <strong>${question.correctAnswer}</strong> is the right answer.
        `;
        feedback.className = 'feedback correct';
        
        // Update score
        currentQuiz.score += 10;
        currentQuiz.streak++;
        currentQuiz.correctAnswers++;
        
        // Add XP for correct answer
        addXP(10, 'Correct quiz answer');
    } else {
        feedback.innerHTML = `
            <i class="fas fa-times-circle"></i> Incorrect. 
            The correct answer is <strong>${question.correctAnswer}</strong>.
            ${selectedAnswer ? `You answered: ${selectedAnswer}` : ''}
        `;
        feedback.className = 'feedback incorrect';
        
        // Reset streak
        currentQuiz.streak = 0;
    }

    currentQuiz.answered = true;
    updateQuizStats();

    // Mark word as practiced if it's from vocabulary
    if (question.word) {
        const wordIndex = savedWords.findIndex(w => w.word === question.word.word);
        if (wordIndex !== -1) {
            savedWords[wordIndex].lastPracticed = new Date().toISOString();
            savedWords[wordIndex].practiceCount = (savedWords[wordIndex].practiceCount || 0) + 1;
            localStorage.setItem('savedWords', JSON.stringify(savedWords));
        }
    }
}

function normalizeAnswer(answer) {
    return answer.toLowerCase().trim().replace(/[.,!?;:]/g, '');
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

function startTimer() {
    if (currentQuiz.timer) clearInterval(currentQuiz.timer);
    
    currentQuiz.timer = setInterval(() => {
        if (currentQuiz.active) {
            const elapsed = Math.floor((new Date() - currentQuiz.startTime) / 1000);
            const minutes = Math.floor(elapsed / 60).toString().padStart(2, '0');
            const seconds = (elapsed % 60).toString().padStart(2, '0');
            document.getElementById('quizTime').textContent = `${minutes}:${seconds}`;
        }
    }, 1000);
}

function showQuizResults() {
    clearInterval(currentQuiz.timer);
    
    const quizContainer = document.getElementById('quizContainer');
    const percentage = Math.round((currentQuiz.correctAnswers / currentQuiz.totalQuestions) * 100);
    const elapsed = Math.floor((new Date() - currentQuiz.startTime) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    
    let message = '';
    let icon = '';

    if (percentage >= 90) {
        message = 'Excellent! Perfect score!';
        icon = 'fas fa-trophy';
        addXP(100, 'Perfect quiz score');
    } else if (percentage >= 75) {
        message = 'Great job! Keep practicing!';
        icon = 'fas fa-star';
        addXP(60, 'Great quiz score');
    } else if (percentage >= 60) {
        message = 'Good effort! Try again to improve.';
        icon = 'fas fa-thumbs-up';
        addXP(30, 'Good quiz score');
    } else {
        message = 'Keep practicing! You\'ll get better!';
        icon = 'fas fa-redo';
        addXP(10, 'Quiz completion');
    }

    quizContainer.innerHTML = `
        <div class="quiz-complete">
            <h3>${currentQuiz.selectedQuiz.title} - Complete!</h3>
            <div class="score-display">${currentQuiz.correctAnswers}/${currentQuiz.totalQuestions}</div>
            <p>Score: ${percentage}%</p>
            <p>Time: ${minutes}m ${seconds}s</p>
            <p>Best Streak: ${currentQuiz.streak}</p>
            <p><i class="${icon}"></i> ${message}</p>
            <div style="margin-top: 30px;">
                <button id="restartQuiz" class="btn btn-primary">
                    <i class="fas fa-redo"></i> Try Again
                </button>
                <button id="newQuiz" class="btn btn-secondary">
                    <i class="fas fa-list"></i> Choose Another Quiz
                </button>
            </div>
        </div>
    `;

    // Add event listeners
    document.getElementById('restartQuiz').addEventListener('click', startQuiz);
    document.getElementById('newQuiz').addEventListener('click', endQuiz);

    currentQuiz.active = false;
}

function endQuiz() {
    clearInterval(currentQuiz.timer);
    
    if (currentQuiz.active && currentQuiz.currentQuestionIndex < currentQuiz.questions.length) {
        if (!confirm('Are you sure you want to end the quiz? Your progress will be lost.')) {
            return;
        }
    }

    currentQuiz.active = false;
    
    // Reset UI
    document.getElementById('quizSelect').disabled = false;
    document.getElementById('startQuiz').style.display = 'inline-block';
    document.getElementById('quizActions').style.display = 'none';
    document.getElementById('quizSelect').parentElement.style.display = 'block';
    document.getElementById('quizSelect').value = '';
    
    // Clear quiz container
    const quizContainer = document.getElementById('quizContainer');
    quizContainer.innerHTML = `
        <div style="text-align: center; padding: 40px; color: var(--text-light);">
            <i class="fas fa-brain" style="font-size: 3rem; margin-bottom: 20px; opacity: 0.5;"></i>
            <h3>Vocabulary Quiz</h3>
            <p>Select a quiz from the dropdown and click Start!</p>
            <p>Test your knowledge with multiple choice and translation questions.</p>
        </div>
    `;
    
    // Reset stats
    resetQuizStats();
}

function resetQuizStats() {
    document.getElementById('quizScore').textContent = '0';
    document.getElementById('quizStreak').textContent = '0';
    document.getElementById('quizProgress').textContent = '0/0';
    document.getElementById('quizTime').textContent = '00:00';
}

function updateQuizStats() {
    if (!currentQuiz.active) return;

    document.getElementById('quizScore').textContent = currentQuiz.score;
    document.getElementById('quizStreak').textContent = currentQuiz.streak;
    document.getElementById('quizProgress').textContent = 
        `${currentQuiz.currentQuestionIndex + 1}/${currentQuiz.totalQuestions}`;
}

// =============== UPDATE INIT FUNCTION ===============
function init() {
    console.log('App initialization started...');

    // Apply saved theme
    applyTheme();

    // Apply saved colors
    applyPrimaryColor(selectedColor);
    applySecondaryColor(selectedSecondaryColor);

    // Set up navigation
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            switchPage(link.dataset.page);
        });
    });

    // Set up settings
    setupSettings();

    // Set up navigation menu toggle
    setupNavToggle();

    // Initialize color selectors
    setTimeout(() => {
        initColorSelector();
        initSecondaryColorSelector();
    }, 50);

    // Initialize quiz
    initQuiz();

    console.log('App initialization complete!');
}
// =============== NAVIGATION FUNCTIONS ===============
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

    // Scroll to top when switching pages
    scrollToTop();
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// =============== SETTINGS FUNCTIONS ===============
function setupSettings() {
    // Settings toggle
    if (settingsButton) {
        settingsButton.addEventListener("click", function () {
            settingsPage.classList.toggle("open");
            settingsOverlay.classList.add("active");
        });
    }

    if (closeSettings) {
        closeSettings.addEventListener("click", function () {
            settingsPage.classList.remove("open");
            settingsOverlay.classList.remove("active");
        });
    }

    if (settingsOverlay) {
        settingsOverlay.addEventListener("click", function () {
            settingsPage.classList.remove("open");
            settingsOverlay.classList.remove("active");
        });
    }

    // Close settings on Escape key
    document.addEventListener("keydown", function (e) {
        if (e.key === 'Escape' && settingsPage.classList.contains("open")) {
            settingsPage.classList.remove("open");
            settingsOverlay.classList.remove("active");
        }
    });

    // Theme toggle listener
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
}

// =============== FLASHCARD FUNCTIONS ===============

// =============== UTILITY FUNCTIONS ===============
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;

    // Set background color based on notification type
    let bgColor = '';

    if (type === 'success') {
        bgColor = 'var(--primary)';
    } else if (type === 'error') {
        bgColor = '#ff4444';
    } else if (type === 'warning') {
        bgColor = '#ff9900';
    } else if (type === 'info') {
        bgColor = '#2196F3';
    }

    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${bgColor};
        color: white;
        padding: 12px 20px;
        border-radius: var(--radius);
        box-shadow: var(--shadow);
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

// Add CSS animations
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
`;
document.head.appendChild(style);
// Add XP function
function addXP(amount, reason = '') {
    // Get user stats from localStorage
    let userStats = JSON.parse(localStorage.getItem('userStats')) || {
        xp: 0,
        wordsLearned: 0,
        lvl: 1,
        streakDays: 0,
        lastActiveDate: null,
        totalXP: 0
    };

    // Add XP
    userStats.xp += amount;
    userStats.totalXP += amount;

    // Check for level up (every 100 XP = 1 level)
    const oldLevel = Math.floor((userStats.totalXP - amount) / 100) + 1;
    const newLevel = Math.floor(userStats.totalXP / 100) + 1;
    if (newLevel > oldLevel) {
        showNotification(`🎉 Level Up! You reached level ${newLevel}!`, 'success');
    }

    // Save to localStorage
    localStorage.setItem('userStats', JSON.stringify(userStats));


    console.log(`Added ${amount} XP${reason ? ' for: ' + reason : ''}`);
}
// =============== INITIALIZATION ===============
function init() {
    console.log('App initialization started...');

    // Apply saved theme
    applyTheme();

    // Apply saved colors
    applyPrimaryColor(selectedColor);
    applySecondaryColor(selectedSecondaryColor);

    // Set up navigation
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            switchPage(link.dataset.page);
        });
    });
    // Set up navigation menu toggle
    setupNavToggle();
    // Set up settings
    setupSettings();

    // Initialize color selectors
    setTimeout(() => {
        initColorSelector();
        initSecondaryColorSelector();
    }, 50);

   
    console.log('App initialization complete!');
    console.log('Current localStorage theme:', localStorage.getItem('theme'));
    console.log('Current localStorage primary color:', localStorage.getItem('selectedColor'));
    console.log('Current localStorage secondary color:', localStorage.getItem('selectedSecondaryColor'));
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);