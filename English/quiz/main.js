// ========= App State Variables ==========
let currentPage = 'home';
let currentStory = null;
let stories = []; // Will be loaded from external file
let selectedColor = localStorage.getItem('selectedColor') || '#4f46e5';

// Add Stories variables (ADDED)
let userStories = JSON.parse(localStorage.getItem('userStories')) || [];
let userDictionaries = JSON.parse(localStorage.getItem('userDictionaries')) || {};
let currentEditIndex = -1; // For editing stories

// Add Quiz variables
let currentQuiz = null;
let userAnswers = {};
let currentQuestionIndex = 0;
let score = 0;
let quizData = [];
let quizzes = [];

// ========= DOM Elements ==========
const pages = document.querySelectorAll('.page');
const navLinks = document.querySelectorAll('.nav-link');
const levelBtns = document.querySelectorAll('.level-btn');
const storiesGrid = document.getElementById('storiesGrid');
const toggleNav = document.getElementById("toggle-nav");
const more = document.getElementById("more");
const themeToggle = document.getElementById('themeToggle');
const settingsButton = document.getElementById("settings-button");
const settingsPage = document.getElementById("settings-page");
const closeSettings = document.getElementById("close-settings");
const settingsOverlay = document.getElementById("settings-overlay");
const searchForm = document.getElementById('search-form');
const searchInput = searchForm ? searchForm.querySelector('.search-input') : null;

// Quiz elements (will be created dynamically)
let quizContainer = null;
let questionContainer = null;
let optionsContainer = null;
let nextBtn = null;
let prevBtn = null;
let submitBtn = null;
let resultsContainer = null;

// Color variables
const defaultColors = [
    { name: 'indigo', value: '#4f46e5' },
    { name: 'blue', value: '#4a6cf7' },
    { name: 'purple', value: '#7c4dff' },
    { name: 'green', value: '#008638' },
    { name: 'orange', value: '#ff5722' },
    { name: 'pink', value: '#e91e63' },
    { name: 'teal', value: '#009688' }
];

// ========= Core Functions ==========

// Function to scroll to top of page
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Initialize the app
function init() {
    console.log('App initialization started...');
    
    // Auto lazy load ALL images
    document.querySelectorAll('img').forEach(img => img.setAttribute('loading', 'lazy'));
    
    // Load stories from external file
    if (typeof window.storiesData !== 'undefined') {
        stories = window.storiesData.stories || window.storiesData;
        console.log('Loaded stories from external file:', stories.length);
    } else {
        // Fallback if external file fails
        stories = [
            {
                id: 1,
                title: "The Mysterious Island",
                level: "beginner",
                cover: "🏝️",
                coverType: "emoji",
                wordCount: 350,
                content: ["This is a sample story. Click on words like village or journey to see the dictionary."]
            }
        ];
        console.log('Using fallback stories');
    }

    // Load quizzes from external file
    if (typeof window.quizData !== 'undefined') {
        quizzes = window.quizData.quizzes || [];
        console.log('Loaded quizzes from external file:', quizzes.length);
        
        // Check the select element to see if we should show quizzes
        const selectElement = document.getElementById('Select');
        if (selectElement && selectElement.value.includes('quiz')) {
            renderQuizzes();
        } else {
            renderStories();
        }
    } else {
        // Fallback quiz data
        quizzes = [
            {
                id: "fallback-quiz",
                title: "Basic Vocabulary Quiz",
                description: "Test your basic vocabulary knowledge",
                level: "beginner",
                type: "vocab",
                author: "IStories",
                createdAt: "2024-01-16",
                questions: [
                    {
                        id: 1,
                        type: "multiple_choice",
                        question: "What is the translation of 'hello'?",
                        choices: [
                            { value: "مرحبا", correct: true },
                            { value: "شكرا", correct: false },
                            { value: "مع السلامة", correct: false },
                            { value: "صباح الخير", correct: false }
                        ],
                        explanation: "'مرحبا' means hello in Arabic."
                    },
                    {
                        id: 2,
                        type: "multiple_choice",
                        question: "What does 'book' mean in Arabic?",
                        choices: [
                            { value: "قلم", correct: false },
                            { value: "كتاب", correct: true },
                            { value: "مدرسة", correct: false },
                            { value: "بيت", correct: false }
                        ],
                        explanation: "'كتاب' means book in Arabic."
                    }
                ]
            }
        ];
        console.log('Using fallback quizzes');
        
        // Check the select element
        const selectElement = document.getElementById('Select');
        if (selectElement && selectElement.value.includes('quiz')) {
            renderQuizzes();
        } else {
            renderStories();
        }
    }

    // Load user stories from localStorage
    try {
        const storedStories = localStorage.getItem('userStories');
        const storedDictionaries = localStorage.getItem('userDictionaries');

        if (storedStories) {
            userStories = JSON.parse(storedStories);
        }

        if (storedDictionaries) {
            userDictionaries = JSON.parse(storedDictionaries);
        }
    } catch (error) {
        console.error('Error loading user stories:', error);
        userStories = [];
        userDictionaries = {};
    }

    // STEP 1: Apply saved theme FIRST
    console.log('Step 1: Applying theme...');
    applyTheme();

    // STEP 2: Apply saved primary color immediately
    console.log('Step 2: Applying saved color:', selectedColor);
    if (selectedColor) {
        applyPrimaryColor(selectedColor);
    }

    // STEP 3: Initialize color selector
    console.log('Step 3: Initializing color selector...');
    setTimeout(() => {
        initColorSelector();
    }, 50);

    // STEP 4: Setup search
    console.log('Step 4: Setting up search...');
    setupSearch();

    // STEP 5: Set up navigation and event listeners
    console.log('Step 5: Setting up navigation and event listeners...');
    setupNavToggle();
    setupEventListeners();
    setupSettings();

    // STEP 6: Add scroll to top button
    addScrollToTopButton();

    console.log('App initialization complete!');
}

// Function to initialize color selector
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

                showNotification(`Primary color changed to ${option.title || 'custom'}`, 'success');
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

            showNotification('Custom primary color applied', 'success');
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

    // Force apply the color one more time to ensure it's set
    setTimeout(() => {
        applyPrimaryColor(selectedColor);
        console.log('Final color applied:', selectedColor);
    }, 100);
}

// Function to apply ONLY the primary color
function applyPrimaryColor(color) {
    // Calculate darker shade for --primary-dark
    const darkerColor = adjustColor(color, -20);

    // Update ONLY the primary color variables in CSS
    const root = document.documentElement;
    root.style.setProperty('--primary', color);
    root.style.setProperty('--primary-dark', darkerColor);
}

// Helper function to adjust color brightness (for --primary-dark)
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

let theme = localStorage.getItem('theme') || 'light';

// Toggle theme
function toggleTheme() {
    const currentTheme = localStorage.getItem('theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';

    // Save new theme
    localStorage.setItem('theme', newTheme);

    // Apply the new theme
    applyTheme();

    showNotification(`Switched to ${newTheme} mode`, 'success');
}

// Secondary color variables
let selectedSecondaryColor = localStorage.getItem('selectedSecondaryColor') || '#f59e0b';

// Function to initialize secondary color selector
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

                showNotification(`Secondary color changed to ${option.title || 'custom'}`, 'success');
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

            showNotification('Custom secondary color applied', 'success');
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

    // Force apply the secondary color one more time to ensure it's set
    setTimeout(() => {
        applySecondaryColor(selectedSecondaryColor);
        console.log('Final secondary color applied:', selectedSecondaryColor);
    }, 100);
}

// Function to apply ONLY the secondary color
function applySecondaryColor(color) {
    // Calculate darker and lighter shades for --secondary-dark and --secondary-light
    const darkerColor = adjustColor(color, -20);
    const lighterColor = adjustColor(color, 20);

    // Update ONLY the secondary color variables in CSS
    const root = document.documentElement;
    root.style.setProperty('--secondary', color);
    root.style.setProperty('--secondary-dark', darkerColor);
    root.style.setProperty('--secondary-light', lighterColor);
}

// Update your DOMContentLoaded event listener:
document.addEventListener('DOMContentLoaded', function () {
    init();

    // Initialize primary color selector
    if (typeof initColorSelector === 'function') {
        initColorSelector();
    }

    // Initialize secondary color selector
    if (typeof initSecondaryColorSelector === 'function') {
        initSecondaryColorSelector();
    }
});

// Update your applyTheme function to also apply secondary color:
function applyTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';

    // Apply theme to body class
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }

    // Update theme toggle icon
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        const themeIcon = themeToggle.querySelector('i');
        if (themeIcon) {
            themeIcon.className = savedTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
    }

    // Re-apply both colors to ensure they work with new theme
    if (selectedColor) {
        applyPrimaryColor(selectedColor);
    }
    if (selectedSecondaryColor) {
        applySecondaryColor(selectedSecondaryColor);
    }
}

// ========= Quiz Functions ==========

function renderQuizzes() {
    if (!storiesGrid) return;

    storiesGrid.innerHTML = '';
    storiesGrid.classList.add('quizzes-grid');

    if (quizzes.length === 0) {
        storiesGrid.innerHTML = `
            <div class="no-quizzes-message">
                <i class="fas fa-brain fa-3x"></i>
                <h3>No quizzes available</h3>
                <p>Check back soon for new quizzes!</p>
            </div>
        `;
        return;
    }

    quizzes.forEach(quiz => {
        const quizCard = document.createElement('div');
        quizCard.className = 'quiz-card';
        quizCard.dataset.quizId = quiz.id;

        const questionCount = quiz.questions ? quiz.questions.length : 0;
        const timeEstimate = Math.ceil(questionCount * 0.5); // 30 seconds per question

        quizCard.innerHTML = `
            <div class="quiz-header">
                <div class="quiz-icon">
                    <i class="fas ${getQuizIcon(quiz.type)}"></i>
                </div>
                <div class="quiz-info">
                    <span class="quiz-level ${quiz.level}">${quiz.level.charAt(0).toUpperCase() + quiz.level.slice(1)}</span>
                    <span class="quiz-type">${quiz.type}</span>
                </div>
            </div>
            
            <div class="quiz-content">
                <h3 class="quiz-title">${quiz.title}</h3>
                <p class="quiz-description">${quiz.description || 'Test your knowledge'}</p>
                
                <div class="quiz-meta">
                    <span><i class="fas fa-question-circle"></i> ${questionCount} questions</span>
                    <span><i class="fas fa-clock"></i> ${timeEstimate} min</span>
                </div>
            </div>
            
            <div class="quiz-actions">
                <button class="quiz-start-btn" data-quiz-id="${quiz.id}">
                    <i class="fas fa-play"></i> Start Quiz
                </button>
                <button class="quiz-preview-btn" data-quiz-id="${quiz.id}">
                    <i class="fas fa-eye"></i> Preview
                </button>
            </div>
        `;

        // Add event listeners
        const startBtn = quizCard.querySelector('.quiz-start-btn');
        const previewBtn = quizCard.querySelector('.quiz-preview-btn');

        startBtn.addEventListener('click', () => startQuiz(quiz.id));
        previewBtn.addEventListener('click', () => previewQuiz(quiz.id));

        storiesGrid.appendChild(quizCard);
    });
}

function getQuizIcon(quizType) {
    const icons = {
        'grammar': 'fa-language',
        'vocab': 'fa-book',
        'listening': 'fa-headphones',
        'reading': 'fa-book-reader',
        'writing': 'fa-edit'
    };
    return icons[quizType] || 'fa-brain';
}

function startQuiz(quizId) {
    currentQuiz = quizzes.find(q => q.id === quizId);
    if (!currentQuiz) {
        showNotification('Quiz not found!', 'error');
        return;
    }

    // Reset quiz state
    userAnswers = {};
    currentQuestionIndex = 0;
    score = 0;

    // Hide stories grid and show quiz container
    storiesGrid.style.display = 'none';
    
    // Create quiz container if it doesn't exist
    if (!quizContainer) {
        createQuizContainer();
    }
    
    quizContainer.style.display = 'block';
    
    // Display first question
    displayQuestion(currentQuestionIndex);
    
    // Update quiz header
    document.getElementById('quizTitle').textContent = currentQuiz.title;
    document.getElementById('quizProgress').textContent = `Question 1 of ${currentQuiz.questions.length}`;
    
    // Scroll to quiz
    quizContainer.scrollIntoView({ behavior: 'smooth' });
}

function createQuizContainer() {
    quizContainer = document.createElement('div');
    quizContainer.className = 'quiz-container';
  

    quizContainer.innerHTML = `
        <div class="quiz-header2">
            <div class="quiz-header-top">
                <button class="back-to-quizzes-btn" id="backToQuizzes">
                    <i class="fas fa-arrow-left"></i> Back to Quizzes
                </button>
                <div class="quiz-stats">
                    <span id="quizTitle"></span>
                    <span class="quiz-progress" id="quizProgress"></span>
                </div>
            </div>
            <div class="quiz-progress-bar">
                <div class="progress-fill" id="progressFill"></div>
            </div>
        </div>
        
        <div class="question-container" id="questionContainer"></div>
        
        <div class="quiz-navigation">
            <button class="quiz-nav-btn" id="prevBtn" disabled>
                <i class="fas fa-arrow-left"></i> Previous
            </button>
            <button class="quiz-nav-btn" id="nextBtn">
                Next <i class="fas fa-arrow-right"></i>
            </button>
            <button class="quiz-nav-btn submit-btn" id="submitQuiz" style="display: none;">
                <i class="fas fa-check-circle"></i> Submit Quiz
            </button>
        </div>
        
        <div class="results-container" id="resultsContainer" style="display: none;"></div>
    `;

    // Insert after stories grid
    storiesGrid.parentNode.insertBefore(quizContainer, storiesGrid.nextSibling);

    // Add event listeners
    document.getElementById('backToQuizzes').addEventListener('click', backToQuizzes);
    document.getElementById('prevBtn').addEventListener('click', previousQuestion);
    document.getElementById('nextBtn').addEventListener('click', nextQuestion);
    document.getElementById('submitQuiz').addEventListener('click', submitQuiz);
}

function displayQuestion(index) {
    if (!currentQuiz || !currentQuiz.questions[index]) return;

    const question = currentQuiz.questions[index];
    const questionContainer = document.getElementById('questionContainer');
    
    let optionsHtml = '';
    
    if (question.type === 'multiple_choice') {
        question.choices.forEach((choice, i) => {
            const isSelected = userAnswers[index] === choice.value;
            optionsHtml += `
                <div class="option ${isSelected ? 'selected' : ''}" data-value="${choice.value}">
                    <div class="option-radio">
                        <div class="radio-circle ${isSelected ? 'selected' : ''}"></div>
                    </div>
                    <div class="option-text">${choice.value}</div>
                </div>
            `;
        });
    }
    
    questionContainer.innerHTML = `
        <div class="question">
            <h3>${index + 1}. ${question.question}</h3>
        </div>
        <div class="options-container">
            ${optionsHtml}
        </div>
        ${question.explanation && userAnswers[index] ? `
            <div class="explanation">
                <strong>Explanation:</strong> ${question.explanation}
            </div>
        ` : ''}
    `;

    // Add event listeners to options
    document.querySelectorAll('.option').forEach(option => {
        option.addEventListener('click', () => selectOption(option.dataset.value, index));
    });

    // Update navigation buttons
    updateNavigationButtons();
    updateProgressBar();
}

function selectOption(value, questionIndex) {
    userAnswers[questionIndex] = value;
    
    // Update UI
    document.querySelectorAll('.option').forEach(option => {
        if (option.dataset.value === value) {
            option.classList.add('selected');
            option.querySelector('.radio-circle').classList.add('selected');
        } else {
            option.classList.remove('selected');
            option.querySelector('.radio-circle').classList.remove('selected');
        }
    });

    // Show explanation if available
    const question = currentQuiz.questions[questionIndex];
    if (question.explanation) {
        const explanationDiv = document.querySelector('.explanation');
        if (explanationDiv) {
            explanationDiv.style.display = 'block';
            explanationDiv.innerHTML = `<strong>Explanation:</strong> ${question.explanation}`;
        }
    }
}

function updateNavigationButtons() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const submitBtn = document.getElementById('submitQuiz');

    prevBtn.disabled = currentQuestionIndex === 0;
    
    if (currentQuestionIndex === currentQuiz.questions.length - 1) {
        nextBtn.style.display = 'none';
        submitBtn.style.display = 'block';
    } else {
        nextBtn.style.display = 'block';
        submitBtn.style.display = 'none';
    }
}

function updateProgressBar() {
    const progressFill = document.getElementById('progressFill');
    const progress = ((currentQuestionIndex + 1) / currentQuiz.questions.length) * 100;
    progressFill.style.width = `${progress}%`;
    
    document.getElementById('quizProgress').textContent = 
        `Question ${currentQuestionIndex + 1} of ${currentQuiz.questions.length}`;
}

function nextQuestion() {
    if (currentQuestionIndex < currentQuiz.questions.length - 1) {
        currentQuestionIndex++;
        displayQuestion(currentQuestionIndex);
    }
}

function previousQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        displayQuestion(currentQuestionIndex);
    }
}

function submitQuiz() {
    // Calculate score
    score = 0;
    currentQuiz.questions.forEach((question, index) => {
        const userAnswer = userAnswers[index];
        const correctChoice = question.choices.find(choice => choice.correct);
        
        if (correctChoice && userAnswer === correctChoice.value) {
            score++;
        }
    });

    // Display results
    showResults();
}

function showResults() {
    const resultsContainer = document.getElementById('resultsContainer');
    const questionContainer = document.getElementById('questionContainer');
    const navigation = document.querySelector('.quiz-navigation');
    
    questionContainer.style.display = 'none';
    navigation.style.display = 'none';
    resultsContainer.style.display = 'block';

    const percentage = Math.round((score / currentQuiz.questions.length) * 100);
    let message = '';
    let icon = '';

    if (percentage >= 80) {
        message = 'Excellent! You mastered this quiz!';
        icon = 'fa-trophy';
    } else if (percentage >= 60) {
        message = 'Good job! You did well!';
        icon = 'fa-star';
    } else if (percentage >= 40) {
        message = 'Not bad! Keep practicing!';
        icon = 'fa-thumbs-up';
    } else {
        message = 'Keep learning! You can do better!';
        icon = 'fa-redo';
    }

    resultsContainer.innerHTML = `
        <div class="results-header">
            <i class="fas ${icon} fa-3x"></i>
            <h2>Quiz Complete!</h2>
            <p class="results-message">${message}</p>
        </div>
        
        <div class="score-display">
            <div class="score-circle">
                <span class="score-percentage">${percentage}%</span>
                <span class="score-text">Score</span>
            </div>
            <div class="score-details">
                <p><strong>${score}</strong> out of <strong>${currentQuiz.questions.length}</strong> correct</p>
            </div>
        </div>
        
        <div class="answers-review">
            <h3>Review Answers</h3>
            ${currentQuiz.questions.map((question, index) => {
                const userAnswer = userAnswers[index];
                const correctChoice = question.choices.find(choice => choice.correct);
                const isCorrect = correctChoice && userAnswer === correctChoice.value;
                
                return `
                    <div class="answer-item ${isCorrect ? 'correct' : 'incorrect'}">
                        <div class="answer-question">
                            <strong>Q${index + 1}:</strong> ${question.question}
                        </div>
                        <div class="answer-details">
                            <span class="your-answer">
                                <strong>Your answer:</strong> ${userAnswer || 'Not answered'}
                                ${isCorrect ? '<i class="fas fa-check correct-icon"></i>' : '<i class="fas fa-times incorrect-icon"></i>'}
                            </span>
                            ${!isCorrect ? `
                                <span class="correct-answer">
                                    <strong>Correct answer:</strong> ${correctChoice ? correctChoice.value : 'N/A'}
                                </span>
                            ` : ''}
                        </div>
                        ${question.explanation ? `
                            <div class="answer-explanation">
                                <strong>Explanation:</strong> ${question.explanation}
                            </div>
                        ` : ''}
                    </div>
                `;
            }).join('')}
        </div>
        
        <div class="results-actions">
            <button class="retry-quiz-btn" id="retryQuiz">
                <i class="fas fa-redo"></i> Retry Quiz
            </button>
            <button class="back-to-quizzes-btn" id="backToQuizzesFromResults">
                <i class="fas fa-list"></i> Back to Quizzes
            </button>
        </div>
    `;

    // Add event listeners for results buttons
    document.getElementById('retryQuiz').addEventListener('click', () => {
        startQuiz(currentQuiz.id);
    });
    
    document.getElementById('backToQuizzesFromResults').addEventListener('click', backToQuizzes);
}

function backToQuizzes() {
    if (quizContainer) {
        quizContainer.style.display = 'none';
    }
    storiesGrid.style.display = 'grid';
    storiesGrid.scrollIntoView({ behavior: 'smooth' });
}

function previewQuiz(quizId) {
    const quiz = quizzes.find(q => q.id === quizId);
    if (!quiz) return;

    // Create preview modal
    const modal = document.createElement('div');
    modal.className = 'quiz-preview-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2000;
        padding: 20px;
    `;

    const previewContent = `
        <div class="preview-content" >
            <div class="preview-header" >
                <h2 style="color: var(--primary); margin: 0;">${quiz.title}</h2>
                <button class="close-preview" style="background: none; border: none; font-size: 30px; cursor: pointer; color: #666;">&times;</button>
            </div>
            
            <div style="margin-bottom: 20px;">
                <p><strong>Description:</strong> ${quiz.description || 'No description'}</p>
                <p><strong>Level:</strong> ${quiz.level}</p>
                <p><strong>Type:</strong> ${quiz.type}</p>
                <p><strong>Questions:</strong> ${quiz.questions.length}</p>
            </div>
            
            <div>
                <h3 style="color: var(--primary); margin-bottom: 15px;">Sample Questions:</h3>
                ${quiz.questions.slice(0, 3).map((q, i) => `
                    <div class=".cqa">
                        <p><strong>Q${i + 1}:</strong> ${q.question}</p>
                        ${q.type === 'multiple_choice' ? `
                            <div style="margin-top: 10px;">
                                ${q.choices.slice(0, 2).map((choice, j) => `
                                    <div .response-quiz">
                                        ${String.fromCharCode(65 + j)}. ${choice.value}
                                        ${choice.correct ? ' ✓' : ''}
                                    </div>
                                `).join('')}
                            </div>
                        ` : ''}
                    </div>
                `).join('')}
            </div>
            
            <div style="margin-top: 20px; display: flex; gap: 10px;">
                <button class="start-from-preview" style="flex: 1; padding: 12px; background: var(--primary); color: white; border: none; border-radius: 5px; cursor: pointer;">
                    <i class="fas fa-play"></i> Start Quiz
                </button>
                <button class="close-btn" style="flex: 1; padding: 12px; background: #666; color: white; border: none; border-radius: 5px; cursor: pointer;">
                    Close
                </button>
            </div>
        </div>
    `;

    modal.innerHTML = previewContent;
    document.body.appendChild(modal);

    // Add event listeners
    modal.querySelector('.close-preview').addEventListener('click', () => modal.remove());
    modal.querySelector('.close-btn').addEventListener('click', () => modal.remove());
    modal.querySelector('.start-from-preview').addEventListener('click', () => {
        modal.remove();
        startQuiz(quizId);
    });

    // Close on click outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// ========= Add Scroll to Top Button ==========
function addScrollToTopButton() {
    const button = document.createElement('button');
    button.id = 'scrollToTopBtn';
    button.innerHTML = '<i class="fas fa-arrow-up"></i>';
    button.title = 'Scroll to top';

    button.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: var(--primary);
        color: white;
        border: none;
        border-radius: 50%;
        font-size: 1.2rem;
        cursor: pointer;
        display: none;
        z-index: 1000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        transition: all 0.3s ease;
    `;

    button.addEventListener('mouseover', () => {
        button.style.transform = 'scale(1.1)';
        button.style.boxShadow = '0 6px 16px rgba(0,0,0,0.3)';
    });

    button.addEventListener('mouseout', () => {
        button.style.transform = 'scale(1)';
        button.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
    });

    button.addEventListener('click', scrollToTop);

    document.body.appendChild(button);

    // Show/hide button based on scroll position
    window.addEventListener('scroll', toggleScrollToTopButton);
}

function toggleScrollToTopButton() {
    const button = document.getElementById('scrollToTopBtn');
    if (!button) return;

    if (window.scrollY > 300) {
        button.style.display = 'flex';
        button.style.alignItems = 'center';
        button.style.justifyContent = 'center';
    } else {
        button.style.display = 'none';
    }
}

// ========= Search Functions ==========
function setupSearch() {
    if (!searchForm || !searchInput) return;

    // Search when form is submitted
    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        performSearch();
    });

    // Search while typing
    searchInput.addEventListener('input', (e) => {
        performSearch();
    });

    // Clear on Escape
    searchInput.addEventListener('keyup', (e) => {
        if (e.key === 'Escape') {
            searchInput.value = '';
            performSearch();
        }
    });
}

function performSearch() {
    const query = searchInput.value.trim();
    
    // Check if we're in quiz mode
    const selectElement = document.getElementById('Select');
    const isQuizMode = selectElement && selectElement.value.includes('quiz');
    
    if (isQuizMode) {
        filterQuizzesBySearch(query);
    } else {
        // Original story search logic
        const filteredStories = filterStoriesBySearch(query);
        displayFilteredStories(filteredStories, query);
    }
    
    if (query) {
        levelBtns.forEach(btn => btn.classList.remove('active'));
        if (levelBtns.length > 0) {
            levelBtns[0].classList.add('active');
        }
    }
}

function filterQuizzesBySearch(query) {
    if (!query || query.trim() === '') {
        renderQuizzes();
        return;
    }

    query = query.toLowerCase().trim();
    const filteredQuizzes = quizzes.filter(quiz => {
        const titleMatch = quiz.title.toLowerCase().includes(query);
        const descriptionMatch = quiz.description?.toLowerCase().includes(query) || false;
        const levelMatch = quiz.level.toLowerCase().includes(query);
        const typeMatch = quiz.type.toLowerCase().includes(query);
        
        return titleMatch || descriptionMatch || levelMatch || typeMatch;
    });

    displayFilteredQuizzes(filteredQuizzes, query);
}

function displayFilteredQuizzes(filteredQuizzes, query) {
    if (!storiesGrid) return;

    storiesGrid.innerHTML = '';

    if (filteredQuizzes.length === 0) {
        storiesGrid.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search fa-2x"></i>
                <h3>No quizzes found for "${query}"</h3>
                <p>Try different keywords or browse all quizzes</p>
            </div>
        `;
        return;
    }

    filteredQuizzes.forEach(quiz => {
        const quizCard = document.createElement('div');
        quizCard.className = 'quiz-card';
        quizCard.dataset.quizId = quiz.id;

        const questionCount = quiz.questions ? quiz.questions.length : 0;
        const timeEstimate = Math.ceil(questionCount * 0.5);

        // Highlight search matches in title
        const highlightedTitle = highlightSearchMatch(quiz.title, query);

        quizCard.innerHTML = `
            <div class="quiz-header">
                <div class="quiz-icon">
                    <i class="fas ${getQuizIcon(quiz.type)}"></i>
                </div>
                <div class="quiz-info">
                    <span class="quiz-level ${quiz.level}">${quiz.level.charAt(0).toUpperCase() + quiz.level.slice(1)}</span>
                    <span class="quiz-type">${quiz.type}</span>
                </div>
            </div>
            
            <div class="quiz-content">
                <h3 class="quiz-title">${highlightedTitle}</h3>
                <p class="quiz-description">${quiz.description || 'Test your knowledge'}</p>
                
                <div class="quiz-meta">
                    <span><i class="fas fa-question-circle"></i> ${questionCount} questions</span>
                    <span><i class="fas fa-clock"></i> ${timeEstimate} min</span>
                </div>
            </div>
            
            <div class="quiz-actions">
                <button class="quiz-start-btn" data-quiz-id="${quiz.id}">
                    <i class="fas fa-play"></i> Start Quiz
                </button>
                <button class="quiz-preview-btn" data-quiz-id="${quiz.id}">
                    <i class="fas fa-eye"></i> Preview
                </button>
            </div>
        `;

        // Add event listeners
        const startBtn = quizCard.querySelector('.quiz-start-btn');
        const previewBtn = quizCard.querySelector('.quiz-preview-btn');

        startBtn.addEventListener('click', () => startQuiz(quiz.id));
        previewBtn.addEventListener('click', () => previewQuiz(quiz.id));

        storiesGrid.appendChild(quizCard);
    });
}

function filterStoriesBySearch(query) {
    if (!query || query.trim() === '') {
        return stories;
    }

    query = query.toLowerCase().trim();

    return stories.filter(story => {
        const titleMatch = story.title.toLowerCase().includes(query);
        const contentMatch = story.content.some(paragraph =>
            paragraph.toLowerCase().includes(query)
        );
        const levelMatch = story.level.toLowerCase().includes(query);
        const tagsMatch = story.tags?.some(tag =>
            tag.toLowerCase().includes(query)
        ) || false;

        return titleMatch || contentMatch || levelMatch || tagsMatch;
    });
}

function displayFilteredStories(filteredStories, query) {
    if (!storiesGrid) return;

    storiesGrid.innerHTML = '';

    if (filteredStories.length === 0) {
        storiesGrid.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search fa-2x"></i>
                <h3>No stories found for "${query}"</h3>
                <p>Try different keywords or browse all stories</p>
            </div>
        `;
        return;
    }

    filteredStories.forEach(story => {
        const storyCard = document.createElement('div');
        storyCard.className = 'story-card';
        storyCard.dataset.storyTitle = story.title;

        const highlightedTitle = highlightSearchMatch(story.title, query);

        storyCard.innerHTML = `
            <div class="story-image">
                ${renderStoryCover(story)}
            </div>
            <div class="story-content">
                <div class="story-header">
                    <span class="story-level ${story.level}">${story.level}</span>
                </div>
                <h3 class="story-title">${highlightedTitle}</h3>
                <div class="story-meta">
                    <span><i class="fas fa-font"></i> ${story.wordCount || 'N/A'} words</span>
                    <span><i class="fas fa-clock"></i> ${Math.ceil((story.wordCount || 100) / 200)} min read</span>
                </div>
            </div>
        `;

        storiesGrid.appendChild(storyCard);
    });
}

function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function highlightSearchMatch(text, query) {
    if (!query) return text;

    try {
        const escapedQuery = escapeRegExp(query);
        const regex = new RegExp(`(${escapedQuery})`, 'gi');
        return text.replace(regex, '<span class="search-highlight">$1</span>');
    } catch (error) {
        console.error('Error in highlightSearchMatch:', error);
        return text;
    }
}

// ========= Navigation Functions ==========
function switchPage(page) {
    currentPage = page;
    pages.forEach(p => p.classList.remove('active'));

    // Show the requested page
    const pageElement = document.getElementById(page);
    if (pageElement) {
        pageElement.classList.add('active');
    }

    navLinks.forEach(link => {
        if (link.dataset.page === page) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Navigation menu state
let isMenuOpen = false;

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

// ========= Settings Functions ==========
function setupSettings() {
    console.log('Setting up settings...');

    // Check if elements exist
    if (!settingsButton || !settingsPage || !closeSettings || !settingsOverlay) {
        console.error('Settings elements not found!');
        return;
    }

    console.log('Settings elements found, setting up listeners...');

    settingsButton.addEventListener("click", function (e) {
        e.stopPropagation();
        e.preventDefault();
        settingsPage.classList.add("open");
        settingsOverlay.classList.add("active");
    });

    closeSettings.addEventListener("click", function (e) {
        e.stopPropagation();
        e.preventDefault();
        settingsPage.classList.remove("open");
        settingsOverlay.classList.remove("active");
    });

    settingsOverlay.addEventListener("click", function () {
        settingsPage.classList.remove("open");
        settingsOverlay.classList.remove("active");
    });

    // Close settings with Escape key
    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && settingsPage.classList.contains("open")) {
            settingsPage.classList.remove("open");
            settingsOverlay.classList.remove("active");
        }
    });
}

// ========= Event Listeners Setup ==========
function setupEventListeners() {
    // Navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            switchPage(link.dataset.page);
            scrollToTop();
        });
    });

    // Level filter buttons
    levelBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            levelBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Check if we're in quiz mode
            const selectElement = document.getElementById('Select');
            const isQuizMode = selectElement && selectElement.value.includes('quiz');
            
            if (isQuizMode) {
                filterQuizzesByLevel(btn.dataset.level);
            } else {
                renderStories(btn.dataset.level);
            }
        });
    });

    // Theme toggle
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }

    // File selector change
    const selectElement = document.getElementById('Select');
    if (selectElement) {
        selectElement.addEventListener('change', function() {
            if (this.value.includes('quiz')) {
                storiesGrid.classList.add('quizzes-grid');
                renderQuizzes();
            } else {
                storiesGrid.classList.remove('quizzes-grid');
                renderStories();
            }
        });
    }
}

function filterQuizzesByLevel(level) {
    if (level === 'all') {
        renderQuizzes();
        return;
    }

    const filteredQuizzes = quizzes.filter(quiz => quiz.level === level);
    
    if (!storiesGrid) return;
    storiesGrid.innerHTML = '';

    if (filteredQuizzes.length === 0) {
        storiesGrid.innerHTML = `
            <div class="no-quizzes-message">
                <i class="fas fa-brain fa-3x"></i>
                <h3>No ${level} quizzes available</h3>
                <p>Try a different level or check back soon!</p>
            </div>
        `;
        return;
    }

    filteredQuizzes.forEach(quiz => {
        const quizCard = document.createElement('div');
        quizCard.className = 'quiz-card';
        quizCard.dataset.quizId = quiz.id;

        const questionCount = quiz.questions ? quiz.questions.length : 0;
        const timeEstimate = Math.ceil(questionCount * 0.5);

        quizCard.innerHTML = `
            <div class="quiz-header">
                <div class="quiz-icon">
                    <i class="fas ${getQuizIcon(quiz.type)}"></i>
                </div>
                <div class="quiz-info">
                    <span class="quiz-level ${quiz.level}">${quiz.level.charAt(0).toUpperCase() + quiz.level.slice(1)}</span>
                    <span class="quiz-type">${quiz.type}</span>
                </div>
            </div>
            
            <div class="quiz-content">
                <h3 class="quiz-title">${quiz.title}</h3>
                <p class="quiz-description">${quiz.description || 'Test your knowledge'}</p>
                
                <div class="quiz-meta">
                    <span><i class="fas fa-question-circle"></i> ${questionCount} questions</span>
                    <span><i class="fas fa-clock"></i> ${timeEstimate} min</span>
                </div>
            </div>
            
            <div class="quiz-actions">
                <button class="quiz-start-btn" data-quiz-id="${quiz.id}">
                    <i class="fas fa-play"></i> Start Quiz
                </button>
                <button class="quiz-preview-btn" data-quiz-id="${quiz.id}">
                    <i class="fas fa-eye"></i> Preview
                </button>
            </div>
        `;

        const startBtn = quizCard.querySelector('.quiz-start-btn');
        const previewBtn = quizCard.querySelector('.quiz-preview-btn');

        startBtn.addEventListener('click', () => startQuiz(quiz.id));
        previewBtn.addEventListener('click', () => previewQuiz(quiz.id));

        storiesGrid.appendChild(quizCard);
    });
}

// ========= Story Display Functions (Kept for compatibility) ==========
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
            <div style="grid-column: 1 / -1; text-align: center; padding: 40px;">
                <p>No stories found for this ${level === 'user' ? 'category' : 'level'}.</p>
            </div>
        `;
        return;
    }

    filteredStories.forEach(story => {
        const storyCard = document.createElement('div');
        storyCard.className = 'story-card';
        storyCard.dataset.storyTitle = story.title;

        storyCard.innerHTML = `
            <div class="story-image">
                ${renderStoryCover(story)}
            </div>
            <div class="story-content">
                <div class="story-header">
                    <span class="story-level ${story.level}">${story.level.charAt(0).toUpperCase() + story.level.slice(1)}</span>
                </div>
                <h3 class="story-title">${story.title}</h3>
                <div class="story-meta">
                    <span><i class="fas fa-font"></i> ${story.wordCount || 'N/A'} words</span>
                    <span><i class="fas fa-clock"></i> ${Math.ceil((story.wordCount || 100) / 200)} min read</span>
                </div>
            </div>
        `;

        storiesGrid.appendChild(storyCard);
    });
}

function renderStoryCover(story) {
    if (!story.cover) {
        return '<i class="fas fa-book"></i>';
    }

    if (story.coverType === 'emoji') {
        return `<div class="story-emoji">${story.cover}</div>`;
    } else if (story.coverType === 'image') {
        return `<img src="${story.cover}" alt="${story.title}" class="story-image">`;
    } else if (story.coverType === 'icon') {
        return `<i class="${story.cover}"></i>`;
    } else {
        return `<div class="story-emoji">${story.cover}</div>`;
    }
}



// ========= Refresh Function ==========
function Refresh() {
    window.location.reload();
}

// ========= Initialize App ==========
document.addEventListener('DOMContentLoaded', function () {
    init();
});