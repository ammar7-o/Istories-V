// ========= App State Variables ==========
let currentPage = 'home';
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
// Add these to your App State Variables section:
let isReviewMode = false;
let showExplanations = {}; // Track which explanations are shown per question
// Add quiz history storage
let quizHistory = JSON.parse(localStorage.getItem('quizHistory')) || {};

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

                // showNotification(`Primary color changed to ${option.title || 'custom'}`, 'success');
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

    // showNotification(`Switched to ${newTheme} mode`, 'success');
}

// Secondary color variables
let selectedSecondaryColor = localStorage.getItem('selectedSecondaryColor') || '#10b981';

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

                // showNotification(`Secondary color changed to ${option.title || 'custom'}`, 'success');
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


// Also update the renderQuizzes function to call this
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
        const timeEstimate = Math.ceil(questionCount * 0.5);

        // Get quiz history
        const history = quizHistory[quiz.id];
        const hasHistory = history && history.lastScore !== undefined;
        const lastScore = hasHistory ? history.lastScore : null;
        const bestScore = hasHistory ? history.bestScore : null;
        const attempts = hasHistory ? history.attempts : 0;

        // Format date for last attempt
        let lastAttemptDate = '';
        if (hasHistory && history.lastDate) {
            const date = new Date(history.lastDate);
            lastAttemptDate = date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });
        }

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
                    ${attempts > 0 ?
                `<span><i class="fas fa-history"></i> ${attempts} attempt${attempts !== 1 ? 's' : ''}</span>` :
                ''
            }
                </div>
                
                ${hasHistory ? `
                    <div class="quiz-progress-section">
                        <div class="quiz-score-display">
                            <div class="score-progress-bar">
                                <div class="score-progress-fill" style="width: ${lastScore}%; 
                                    background: ${getScoreColor(lastScore)};"></div>
                            </div>
                            <div class="score-details">
                                <span class="last-score">Last: <strong>${lastScore}%</strong></span>
                                ${bestScore !== lastScore ?
                    `<span class="best-score">Best: <strong>${bestScore}%</strong></span>` :
                    ''
                }
                            </div>
                        </div>
                        ${lastAttemptDate ?
                    `<p class="last-attempt-date"><i class="far fa-calendar"></i> ${lastAttemptDate}</p>` :
                    ''
                }
                    </div>
                ` : `
                    <div class="quiz-progress-section">
                        <p class="no-attempts"><i class="far fa-star"></i> Not attempted yet</p>
                    </div>
                `}
            </div>
            
            <div class="quiz-actions">
                <button class="quiz-start-btn" data-quiz-id="${quiz.id}">
                    <i class="fas fa-play"></i> ${hasHistory ? 'Retry Quiz' : 'Start Quiz'}
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
function getScoreColor(score) {
    if (score >= 80) return '#4CAF50'; // Green
    if (score >= 60) return '#FF9800'; // Orange
    if (score >= 40) return '#FFC107'; // Yellow
    return '#F44336'; // Red
}
function getQuizIcon(quizType) {
    const icons = {
        'grammar': 'fa-language',
        'vocab': 'fa-book',
        'listening': 'fa-headphones',
        'reading': 'fa-book-reader',
        'writing': 'fa-edit',
        'multiple_choice': 'fa-check-circle',
        'true_false': 'fa-check-square',
        'fill_in_blank': 'fa-keyboard',
        'matching': 'fa-random',
        'short_answer': 'fa-pen',
        'drag_drop': 'fa-arrows-alt'  // NEW
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
    isReviewMode = false;
    showExplanations = {}; // Reset all explanation toggles

    // Hide stories grid and show quiz container
    storiesGrid.style.display = 'none';

    // Create quiz container if it doesn't exist
    if (!quizContainer) {
        createQuizContainer();
    }

    quizContainer.style.display = 'block';

    // Display first question
    displayQuestion(currentQuestionIndex);

    // Update progress bar
    updateProgressBar();

    // Scroll to quiz
    quizContainer.scrollIntoView({ behavior: 'smooth' });
}
function createQuizContainer() {
    quizContainer = document.createElement('div');
    quizContainer.className = 'quiz-container';
    quizContainer.id = 'quizContainer'; // Add ID for easy access

    quizContainer.innerHTML = `
        <div class="quiz-header2">
            <div class="quiz-header-top">
                <button class="back-to-quizzes-btn" id="backToQuizzes">
                    <i class="fas fa-arrow-left"></i>
                </button>
                <div class="quiz-stats">
                    <div class="progress-quiz duolingo-green with-glow">
                        <span id="progressFillBar" style="width: 0%;"></span>
                    </div>
                    <span class="quiz-progress" id="quizProgress">0/0</span>
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
// Helper function to shuffle array (Fisher-Yates algorithm)
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}
// Helper function to get question type label
function getQuestionTypeLabel(type) {
    const labels = {
        'multiple_choice': 'Multiple Choice',
        'true_false': 'True or False',
        'fill_in_blank': 'Fill in the Blank',
        'short_answer': 'Short Answer',
        'matching': 'Matching',
        'drag_drop': 'Drag & Drop'  // NEW
    };
    return labels[type] || 'Question';
}
function generateDragDropHTML(question, index) {
    const userAnswer = userAnswers[index] || [];

    // Shuffle words if it's a new attempt
    let scrambledWords = [...question.scrambledWords];
    if (!userAnswer.length) {
        scrambledWords = shuffleArray([...scrambledWords]);
    }

    return `
        <div class="drag-drop-container">
            <div class="drag-instructions">
                <i class="fas fa-arrows-alt"></i>
                <span>Drag words from the top area into the sentence area below to form a correct sentence.</span>
            </div>
            
            <div class="scrambled-words-container" id="scrambledWords_${index}">
                ${scrambledWords.map((word, i) => `
                    <div class="scrambled-word" draggable="true" data-word="${word}" data-index="${i}">
                        ${word}
                    </div>
                `).join('')}
            </div>
            
            <div class="sentence-container" id="sentenceContainer_${index}">
                ${userAnswer.length > 0 ?
            userAnswer.map(word => `
                        <div class="word-in-slot" draggable="true" data-word="${word}">
                            <span>${word}</span>
                            <button type="button" class="remove-btn" onclick="removeFromSentence(${index}, '${word}')">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                    `).join('') :
            '<div class="sentence-slot empty" style="width: 100%; text-align: center; color: var(--text-muted);">Drop words here to build your sentence</div>'
        }
            </div>
            
            ${question.hint ? `
                <div class="drag-drop-hint">
                    <i class="fas fa-lightbulb"></i>
                    <strong>Hint:</strong> ${question.hint}
                </div>
            ` : ''}
            
            <button type="button" class="reset-drag-btn" onclick="resetDragDropQuestion(${index})">
                <i class="fas fa-redo"></i> Reset Words
            </button>
            
            <div class="drag-drop-feedback" id="feedback_${index}"></div>
            
            <!-- Hidden input to store the answer -->
            <input type="hidden" id="dragDropAnswer_${index}" value="${JSON.stringify(userAnswer)}">
        </div>
    `;
}
// Generate HTML for multiple choice questions
function generateMultipleChoiceHTML(question, index) {
    const isSelected = userAnswers[index] ? true : false;

    return question.choices.map((choice, i) => {
        const isSelectedAnswer = userAnswers[index] === choice.value;
        return `
            <div class="option ${isSelectedAnswer ? 'selected' : ''}" data-value="${choice.value}">
                <div class="option-radio">
                    <div class="radio-circle ${isSelectedAnswer ? 'selected' : ''}"></div>
                </div>
                <div class="option-text">${choice.value}</div>
            </div>
        `;
    }).join('');
}
// Generate HTML for true/false questions
function generateTrueFalseHTML(question, index) {
    const isSelected = userAnswers[index] ? true : false;

    return `
        <div class="true-false-options">
            <div class="option true-option ${userAnswers[index] === 'true' ? 'selected' : ''}" data-value="true">
                <div class="option-radio">
                    <div class="radio-circle ${userAnswers[index] === 'true' ? 'selected' : ''}"></div>
                </div>
                <div class="option-text">
                    <i class="fas fa-check-circle"></i> True
                </div>
            </div>
            <div class="option false-option ${userAnswers[index] === 'false' ? 'selected' : ''}" data-value="false">
                <div class="option-radio">
                    <div class="radio-circle ${userAnswers[index] === 'false' ? 'selected' : ''}"></div>
                </div>
                <div class="option-text">
                    <i class="fas fa-times-circle"></i> False
                </div>
            </div>
        </div>
    `;
}

// Generate HTML for fill in the blank questions
function generateFillInBlankHTML(question, index) {
    // question.question should contain the sentence with ___ for blanks
    const questionText = question.question.replace(/___/g,
        `<input type="text" class="fill-blank-input" data-blank-index="${question.question.split('___').length - 1}" 
         value="${userAnswers[index] || ''}" placeholder="Type answer here">`
    );

    return `
        <div class="fill-blank-question">
            <p class="sentence">${questionText}</p>
        </div>
    `;
}

// Generate HTML for short answer questions
function generateShortAnswerHTML(question, index) {
    return `
        <div class="short-answer-container">
            <textarea class="short-answer-input" 
                      placeholder="Type your answer here..."
                      rows="3">${userAnswers[index] || ''}</textarea>
        </div>
    `;
}

// Generate HTML for matching questions
function generateMatchingHTML(question, index) {
    // question.matches should be an array of {left: '', right: ''} pairs
    if (!question.matches) return '<p>No matches available</p>';

    const matches = question.matches;
    const userMatches = userAnswers[index] || {};

    return `
        <div class="matching-container">
            ${matches.map((match, i) => `
                <div class="match-item">
                    <div class="match-left">${match.left}</div>
                    <select class="match-select" data-match-index="${i}">
                        <option value="">Select match...</option>
                        ${matches.map((m, j) =>
        `<option value="${j}" ${userMatches[i] === j ? 'selected' : ''}>${m.right}</option>`
    ).join('')}
                    </select>
                </div>
            `).join('')}
        </div>
    `;
}
// Add event listeners based on question type
function addQuestionTypeEventListeners(type, index) {
    switch (type) {
        case 'multiple_choice':
        case 'true_false':
            document.querySelectorAll('.option').forEach(option => {
                option.addEventListener('click', () => selectOption(option.dataset.value, index));
            });
            break;

        case 'fill_in_blank':
            document.querySelectorAll('.fill-blank-input').forEach(input => {
                input.addEventListener('input', (e) => {
                    userAnswers[index] = e.target.value;
                });
            });
            break;

        case 'short_answer':
            const textarea = document.querySelector('.short-answer-input');
            if (textarea) {
                textarea.addEventListener('input', (e) => {
                    userAnswers[index] = e.target.value;
                });
            }
            break;

        case 'matching':
            document.querySelectorAll('.match-select').forEach(select => {
                select.addEventListener('change', (e) => {
                    const matchIndex = parseInt(e.target.dataset.matchIndex);
                    const selectedIndex = parseInt(e.target.value);

                    if (!userAnswers[index]) {
                        userAnswers[index] = {};
                    }
                    userAnswers[index][matchIndex] = selectedIndex;
                });
            });
            break;

        case 'drag_drop':  // NEW
            setTimeout(() => {
                initDragDrop(index);
            }, 100);
            break;

    }
}

// Update the displayQuestion function to remove explanations entirely:
function displayQuestion(index) {
    if (!currentQuiz || !currentQuiz.questions[index]) return;

    const question = currentQuiz.questions[index];
    const questionContainer = document.getElementById('questionContainer');

    let optionsHtml = '';

    // Handle different question types
    switch (question.type) {
        case 'multiple_choice':
            optionsHtml = generateMultipleChoiceHTML(question, index);
            break;

        case 'true_false':
            optionsHtml = generateTrueFalseHTML(question, index);
            break;

        case 'fill_in_blank':
            optionsHtml = generateFillInBlankHTML(question, index);
            break;

        case 'short_answer':
            optionsHtml = generateShortAnswerHTML(question, index);
            break;

        case 'matching':
            optionsHtml = generateMatchingHTML(question, index);
            break;

        case 'drag_drop':
            optionsHtml = generateDragDropHTML(question, index);
            break;

        default:
            optionsHtml = generateMultipleChoiceHTML(question, index);
    }

    questionContainer.innerHTML = `
        <div class="question">
            <div class="question-type-badge">${getQuestionTypeLabel(question.type)}</div>
            <h3>${index + 1}. ${question.question}</h3>
        </div>
        <div class="options-container" data-question-type="${question.type}">
            ${optionsHtml}
        </div>
    `;

    // Add event listeners based on question type
    addQuestionTypeEventListeners(question.type, index);

    // Update navigation buttons
    updateNavigationButtons();
    updateProgressBar();
}



// Update selectOption to handle different types


function selectOption(value, questionIndex) {
    const question = currentQuiz.questions[questionIndex];

    if (question.type === 'true_false') {
        userAnswers[questionIndex] = value;

        document.querySelectorAll('.option').forEach(option => {
            if (option.dataset.value === value) {
                option.classList.add('selected');
                option.querySelector('.radio-circle').classList.add('selected');
            } else {
                option.classList.remove('selected');
                option.querySelector('.radio-circle').classList.remove('selected');
            }
        });
    } else {
        userAnswers[questionIndex] = value;

        document.querySelectorAll('.option').forEach(option => {
            if (option.dataset.value === value) {
                option.classList.add('selected');
                option.querySelector('.radio-circle').classList.add('selected');
            } else {
                option.classList.remove('selected');
                option.querySelector('.radio-circle').classList.remove('selected');
            }
        });
    }

    // Remove explanation logic
    updateProgressBar();
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
    if (!currentQuiz || !currentQuiz.questions) return;

    const totalQuestions = currentQuiz.questions.length;
    const currentQuestionNum = currentQuestionIndex + 1;

    // Calculate progress percentage
    const progressPercentage = (currentQuestionNum / totalQuestions) * 100;

    // Update both progress bars
    const progressFill = document.getElementById('progressFill');
    const progressFillBar = document.getElementById('progressFillBar');
    const quizProgressText = document.getElementById('quizProgress');

    if (progressFill) {
        progressFill.style.width = `${progressPercentage}%`;
    }

    if (progressFillBar) {
        progressFillBar.style.width = `${progressPercentage}%`;
    }

    if (quizProgressText) {
        quizProgressText.textContent = `${currentQuestionNum}/${totalQuestions}`;
    }
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

        switch (question.type) {
            case 'multiple_choice':
            case 'true_false':
                const correctChoice = question.choices?.find(choice => choice.correct);
                if (correctChoice && userAnswer === correctChoice.value) {
                    score++;
                }
                break;

            case 'fill_in_blank':
                const correctAnswers = question.correctAnswers || [];
                if (userAnswer && correctAnswers.some(correct =>
                    userAnswer.toLowerCase().trim() === correct.toLowerCase().trim())) {
                    score++;
                }
                break;

            case 'short_answer':
                if (userAnswer && userAnswer.trim().length > 0) {
                    score += 0.5;
                }
                break;

            case 'matching':
                if (userAnswer && question.correctMatches) {
                    let correctMatches = 0;
                    Object.keys(userAnswer).forEach(key => {
                        if (userAnswer[key] === question.correctMatches[key]) {
                            correctMatches++;
                        }
                    });
                    score += (correctMatches / Object.keys(question.correctMatches).length);
                }
                break;

            case 'drag_drop':  // NEW
                if (userAnswer && question.correctOrder) {
                    // Compare word order
                    const isCorrect = JSON.stringify(userAnswer) === JSON.stringify(
                        question.correctOrder.map(idx => question.scrambledWords[idx - 1])
                    );
                    if (isCorrect) {
                        score++;
                    }
                }
                break;
        }
    });

    // Round score to 1 decimal place for display
    score = Math.round(score * 10) / 10;

    // Display results
    showResults();
}
// Initialize drag & drop functionality
function initDragDrop(questionIndex) {
    const scrambledContainer = document.getElementById(`scrambledWords_${questionIndex}`);
    const sentenceContainer = document.getElementById(`sentenceContainer_${questionIndex}`);
    const feedbackDiv = document.getElementById(`feedback_${questionIndex}`);

    if (!scrambledContainer || !sentenceContainer) return;

    // Get all draggable words
    const draggables = document.querySelectorAll(`#scrambledWords_${questionIndex} .scrambled-word, #sentenceContainer_${questionIndex} .word-in-slot`);

    draggables.forEach(draggable => {
        draggable.addEventListener('dragstart', handleDragStart);
        draggable.addEventListener('dragend', handleDragEnd);
    });

    // Sentence container drop zone
    sentenceContainer.addEventListener('dragover', handleDragOver);
    sentenceContainer.addEventListener('dragleave', handleDragLeave);
    sentenceContainer.addEventListener('drop', (e) => handleDrop(e, questionIndex, 'sentence'));

    // Scrambled words container drop zone (for moving back)
    scrambledContainer.addEventListener('dragover', handleDragOver);
    scrambledContainer.addEventListener('dragleave', handleDragLeave);
    scrambledContainer.addEventListener('drop', (e) => handleDrop(e, questionIndex, 'scrambled'));

    // Store the current state
    updateDragDropAnswer(questionIndex);
}
// Drag & Drop event handlers
function handleDragStart(e) {
    e.dataTransfer.setData('text/plain', e.target.dataset.word || e.target.textContent);
    e.target.classList.add('dragging');

    // Visual feedback
    if (e.target.classList.contains('scrambled-word')) {
        e.dataTransfer.setData('source', 'scrambled');
    } else if (e.target.classList.contains('word-in-slot')) {
        e.dataTransfer.setData('source', 'sentence');
    }
}


function handleDragEnd(e) {
    e.target.classList.remove('dragging');
}

function handleDragOver(e) {
    e.preventDefault();
    e.currentTarget.classList.add('active-drop');
}

function handleDragLeave(e) {
    e.currentTarget.classList.remove('active-drop');
}

function handleDrop(e, questionIndex, targetArea) {
    e.preventDefault();
    e.currentTarget.classList.remove('active-drop');

    const word = e.dataTransfer.getData('text/plain');
    const sourceArea = e.dataTransfer.getData('source');

    // If dragging from scrambled to sentence
    if (sourceArea === 'scrambled' && targetArea === 'sentence') {
        addToSentence(questionIndex, word);
    }
    // If dragging from sentence to scrambled (removing)
    else if (sourceArea === 'sentence' && targetArea === 'scrambled') {
        removeFromSentence(questionIndex, word);
    }
    // If reordering within sentence (not implemented in basic version)
    // You could add this for advanced functionality

    updateDragDropAnswer(questionIndex);
}
// Add word to sentence
function addToSentence(questionIndex, word) {
    const sentenceContainer = document.getElementById(`sentenceContainer_${questionIndex}`);
    const scrambledContainer = document.getElementById(`scrambledWords_${questionIndex}`);

    // Remove from scrambled words
    const scrambledWord = scrambledContainer.querySelector(`[data-word="${word}"]`);
    if (scrambledWord) {
        scrambledWord.remove();
    }

    // Add to sentence
    const wordElement = document.createElement('div');
    wordElement.className = 'word-in-slot';
    wordElement.draggable = true;
    wordElement.dataset.word = word;
    wordElement.innerHTML = `
        <span>${word}</span>
        <button type="button" class="remove-btn" onclick="removeFromSentence(${questionIndex}, '${word}')">
            <i class="fas fa-times"></i>
        </button>
    `;

    // Remove placeholder if exists
    const placeholder = sentenceContainer.querySelector('.sentence-slot.empty');
    if (placeholder) {
        placeholder.remove();
    }

    sentenceContainer.appendChild(wordElement);

    // Add drag events to new element
    wordElement.addEventListener('dragstart', handleDragStart);
    wordElement.addEventListener('dragend', handleDragEnd);

    // Provide visual feedback
    wordElement.classList.add('correct-place');
    setTimeout(() => {
        wordElement.classList.remove('correct-place');
    }, 500);

    // Update answer
    updateDragDropAnswer(questionIndex);
}


// Remove word from sentence
function removeFromSentence(questionIndex, word) {
    const sentenceContainer = document.getElementById(`sentenceContainer_${questionIndex}`);
    const scrambledContainer = document.getElementById(`scrambledWords_${questionIndex}`);

    // Remove from sentence
    const wordElement = sentenceContainer.querySelector(`[data-word="${word}"]`);
    if (wordElement) {
        wordElement.remove();
    }

    // Add back to scrambled words
    const scrambledWord = document.createElement('div');
    scrambledWord.className = 'scrambled-word';
    scrambledWord.draggable = true;
    scrambledWord.dataset.word = word;
    scrambledWord.textContent = word;

    scrambledContainer.appendChild(scrambledWord);

    // Add drag events
    scrambledWord.addEventListener('dragstart', handleDragStart);
    scrambledWord.addEventListener('dragend', handleDragEnd);

    // If sentence is empty, show placeholder
    if (sentenceContainer.children.length === 0) {
        const placeholder = document.createElement('div');
        placeholder.className = 'sentence-slot empty';
        placeholder.style.cssText = 'width: 100%; text-align: center; color: var(--text-muted);';
        placeholder.textContent = 'Drop words here to build your sentence';
        sentenceContainer.appendChild(placeholder);
    }

    // Update answer
    updateDragDropAnswer(questionIndex);
}

// Reset drag & drop question
function resetDragDropQuestion(questionIndex) {
    const question = currentQuiz.questions[questionIndex];
    const userAnswer = [];

    // Clear user answer
    userAnswers[questionIndex] = userAnswer;

    // Update UI
    displayQuestion(questionIndex);

    // Show feedback
    showNotification('Words have been reset. Try again!', 'info');
}

// Update the hidden answer field
function updateDragDropAnswer(questionIndex) {
    const sentenceContainer = document.getElementById(`sentenceContainer_${questionIndex}`);
    const answerInput = document.getElementById(`dragDropAnswer_${questionIndex}`);

    if (!sentenceContainer || !answerInput) return;

    // Get current words in sentence
    const wordElements = sentenceContainer.querySelectorAll('.word-in-slot');
    const currentAnswer = Array.from(wordElements).map(el => el.dataset.word);

    // Store in userAnswers
    userAnswers[questionIndex] = currentAnswer;

    // Update hidden input
    answerInput.value = JSON.stringify(currentAnswer);
}
// Helper function to save quiz results
function saveQuizResult(quizId, score, totalQuestions) {
    const percentage = Math.round((score / totalQuestions) * 100);
    const quizResult = {
        score: score,
        total: totalQuestions,
        percentage: percentage,
        date: new Date().toISOString(),
        attempts: (quizHistory[quizId]?.attempts || 0) + 1
    };

    // Update quiz history
    if (!quizHistory[quizId]) {
        quizHistory[quizId] = {
            bestScore: percentage,
            lastScore: percentage,
            lastDate: quizResult.date,
            attempts: 1,
            history: []
        };
    } else {
        quizHistory[quizId].bestScore = Math.max(quizHistory[quizId].bestScore, percentage);
        quizHistory[quizId].lastScore = percentage;
        quizHistory[quizId].lastDate = quizResult.date;
        quizHistory[quizId].attempts += 1;
    }

    // Add to history array
    quizHistory[quizId].history.unshift(quizResult);

    // Keep only last 10 attempts
    if (quizHistory[quizId].history.length > 10) {
        quizHistory[quizId].history = quizHistory[quizId].history.slice(0, 10);
    }

    // Save to localStorage
    localStorage.setItem('quizHistory', JSON.stringify(quizHistory));

    // Update quiz cards if they're visible
    updateQuizCardsWithScores();
}
// Function to update quiz cards with scores (when viewing quiz list)
function updateQuizCardsWithScores() {
    // Check if we're in quiz mode
    const selectElement = document.getElementById('Select');
    const isQuizMode = selectElement && selectElement.value.includes('quiz');

    if (isQuizMode && storiesGrid) {
        // Find all quiz cards and update their scores
        document.querySelectorAll('.quiz-card').forEach(card => {
            const quizId = card.dataset.quizId;
            const history = quizHistory[quizId];
            const hasHistory = history && history.lastScore !== undefined;

            if (hasHistory) {
                // Update the score display in the card
                const progressSection = card.querySelector('.quiz-progress-section');
                if (progressSection) {
                    const lastScore = history.lastScore;
                    const bestScore = history.bestScore;
                    const attempts = history.attempts;

                    let lastAttemptDate = '';
                    if (history.lastDate) {
                        const date = new Date(history.lastDate);
                        lastAttemptDate = date.toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                        });
                    }

                    progressSection.innerHTML = `
                        <div class="quiz-score-display">
                            <div class="score-progress-bar">
                                <div class="score-progress-fill" style="width: ${lastScore}%; 
                                    background: ${getScoreColor(lastScore)};"></div>
                            </div>
                            <div class="score-details">
                                <span class="last-score">Last: <strong>${lastScore}%</strong></span>
                                ${bestScore !== lastScore ?
                            `<span class="best-score">Best: <strong>${bestScore}%</strong></span>` :
                            ''
                        }
                            </div>
                        </div>
                        ${lastAttemptDate ?
                            `<p class="last-attempt-date"><i class="far fa-calendar"></i> ${lastAttemptDate}</p>` :
                            ''
                        }
                    `;
                }

                // Update the start button text
                const startBtn = card.querySelector('.quiz-start-btn');
                if (startBtn) {
                    startBtn.innerHTML = '<i class="fas fa-play"></i> Retry Quiz';
                }
            }
        });
    }
}
function showResults() {
    const resultsContainer = document.getElementById('resultsContainer');
    const questionContainer = document.getElementById('questionContainer');
    const navigation = document.querySelector('.quiz-navigation');

    questionContainer.style.display = 'none';
    navigation.style.display = 'none';
    resultsContainer.style.display = 'block';

    // Enable review mode
    isReviewMode = true;

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

    // Save quiz result to history
    saveQuizResult(currentQuiz.id, score, currentQuiz.questions.length);

    // Generate answer review for each question (WITH explanations always shown)
    const answersReview = currentQuiz.questions.map((question, index) => {
        const userAnswer = userAnswers[index];
        let isCorrect = false;
        let correctAnswerText = '';
        let userAnswerText = '';

        // Check correctness based on question type
        switch (question.type) {
            case 'multiple_choice':
            case 'true_false':
                const correctChoice = question.choices?.find(choice => choice.correct);
                isCorrect = correctChoice && userAnswer === correctChoice.value;
                correctAnswerText = correctChoice ? correctChoice.value : 'N/A';
                userAnswerText = userAnswer || 'Not answered';
                break;

            case 'fill_in_blank':
                const correctAnswers = question.correctAnswers || [];
                isCorrect = userAnswer && correctAnswers.some(correct =>
                    userAnswer.toLowerCase().trim() === correct.toLowerCase().trim()
                );
                correctAnswerText = correctAnswers.join(' or ');
                userAnswerText = userAnswer || 'Not answered';
                break;

            case 'short_answer':
                isCorrect = userAnswer && userAnswer.trim().length > 0;
                correctAnswerText = 'Answer provided';
                userAnswerText = userAnswer || 'Not answered';
                break;

            case 'matching':
                if (userAnswer && question.correctMatches) {
                    let correctMatches = 0;
                    Object.keys(userAnswer).forEach(key => {
                        if (userAnswer[key] === question.correctMatches[key]) {
                            correctMatches++;
                        }
                    });
                    isCorrect = correctMatches === Object.keys(question.correctMatches).length;
                    correctAnswerText = 'All matches correct';
                    userAnswerText = `${correctMatches}/${Object.keys(question.correctMatches).length} correct`;
                } else {
                    isCorrect = false;
                    correctAnswerText = 'All matches required';
                    userAnswerText = 'Not completed';
                }
                break;

            case 'drag_drop':
                if (userAnswer && question.correctOrder) {
                    const correctAnswer = question.correctOrder.map(idx => question.scrambledWords[idx - 1]);
                    isCorrect = JSON.stringify(userAnswer) === JSON.stringify(correctAnswer);
                    correctAnswerText = correctAnswer.join(' ');
                    userAnswerText = userAnswer.join(' ') || 'Not answered';
                } else {
                    isCorrect = false;
                    correctAnswerText = question.correctOrder ?
                        question.correctOrder.map(idx => question.scrambledWords[idx - 1]).join(' ') : 'N/A';
                    userAnswerText = 'Not answered';
                }
                break;
        }

        return `
            <div class="answer-item ${isCorrect ? 'correct' : 'incorrect'}">
                <div class="answer-question">
                    <span class="question-type-badge">${getQuestionTypeLabel(question.type)}</span>
                    <strong>Q${index + 1}:</strong> ${question.question}
                </div>
                <div class="answer-details">
                    <div class="your-answer">
                        <strong>Your answer:</strong> ${userAnswerText}
                        ${isCorrect ?
                '<i class="fas fa-check correct-icon"></i>' :
                '<i class="fas fa-times incorrect-icon"></i>'
            }
                    </div>
                    ${!isCorrect && correctAnswerText ? `
                        <div class="correct-answer">
                            <strong>Correct answer:</strong> ${correctAnswerText}
                        </div>
                    ` : ''}
                </div>
                
                ${question.explanation ? `
                    <div class="explanation-section">
                        <div class="explanation-content">
                            <div class="explanation-header">
                                <i class="fas fa-lightbulb"></i>
                                <strong>Explanation</strong>
                            </div>
                            <div class="explanation-text">${question.explanation}</div>
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
    }).join('');

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
                <p><strong>${score.toFixed(1)}</strong> out of <strong>${currentQuiz.questions.length}</strong> correct</p>
                <p>${currentQuiz.questions.length} questions total</p>
                ${quizHistory[currentQuiz.id]?.attempts > 1 ?
            `<p class="history-info"><i class="fas fa-history"></i> Attempt ${quizHistory[currentQuiz.id].attempts} | Best: ${quizHistory[currentQuiz.id].bestScore}%</p>` :
            ''
        }
            </div>
        </div>
        
        <div class="answers-review">
            <h3>Review Answers</h3>
            ${answersReview}
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
        // Hide results and show quiz questions again
        resultsContainer.style.display = 'none';
        questionContainer.style.display = 'block';
        navigation.style.display = 'flex';

        // Reset quiz state for retry
        userAnswers = {};
        currentQuestionIndex = 0;
        score = 0;
        isReviewMode = false;

        // Display first question
        displayQuestion(currentQuestionIndex);

        // Update navigation buttons
        updateNavigationButtons();

        // Update progress bar
        updateProgressBar();
    });

    document.getElementById('backToQuizzesFromResults').addEventListener('click', backToQuizzes);
}



function backToQuizzes() {
    // Reset review mode
    isReviewMode = false;
    showExplanations = {};

    // Hide quiz container and show stories grid
    if (quizContainer) {
        quizContainer.style.display = 'none';
    }

    // Remove quiz container from DOM to avoid duplicate elements
    if (quizContainer && quizContainer.parentNode) {
        quizContainer.parentNode.removeChild(quizContainer);
        quizContainer = null; // Reset variable
    }

    storiesGrid.style.display = 'grid';
    storiesGrid.scrollIntoView({ behavior: 'smooth' });
}

// Helper function to check if user has answered
function checkUserHasAnswered(userAnswer, questionType) {
    if (!userAnswer) return false;

    switch (questionType) {
        case 'multiple_choice':
        case 'true_false':
        case 'short_answer':
        case 'sentence_correction':
        case 'fill_in_blank':
            return typeof userAnswer === 'string' && userAnswer.trim() !== '';

        case 'matching':
            return userAnswer && typeof userAnswer === 'object' &&
                Object.keys(userAnswer).length > 0;

        case 'drag_drop':
            return Array.isArray(userAnswer) && userAnswer.length > 0;

        default:
            return userAnswer !== undefined && userAnswer !== null;
    }
}
function previewQuiz(quizId) {
    const quiz = quizzes.find(q => q.id === quizId);
    if (!quiz) return;

    const history = quizHistory[quizId];
    const hasHistory = history && history.lastScore !== undefined;

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
        <div class="preview-content">
            <div class="preview-header">
                <h2 style="color: var(--primary); margin: 0;">${quiz.title}</h2>
                <button class="close-preview" style="background: none; border: none; font-size: 30px; cursor: pointer; color: #666;">&times;</button>
            </div>
            
            <div style="margin-bottom: 20px;">
                <p><strong>Description:</strong> ${quiz.description || 'No description'}</p>
                <p><strong>Level:</strong> ${quiz.level}</p>
                <p><strong>Type:</strong> ${quiz.type}</p>
                <p><strong>Questions:</strong> ${quiz.questions.length}</p>
                
                ${hasHistory ? `
                    <div class="history-grade-preview">
                        <p><strong>Your Progress:</strong></p>
                        <p><i class="fas fa-chart-line"></i> Last Score: <strong>${history.lastScore}%</strong></p>
                        ${history.bestScore !== history.lastScore ?
                `<p><i class="fas fa-trophy"></i> Best Score: <strong>${history.bestScore}%</strong></p>` :
                ''
            }
                        <p><i class="fas fa-redo"></i> Attempts: <strong>${history.attempts}</strong></p>
                    </div>
                ` : `
                    <div class="history-grade-preview"">
                        <p><i class="far fa-star"></i> <strong>Not attempted yet</strong></p>
                        <p style="font-size: 0.9rem; color: #666;">Start this quiz to track your progress!</p>
                    </div>
                `}
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
                    <i class="fas fa-play"></i> ${hasHistory ? 'Retry Quiz' : 'Start Quiz'}
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

        // Get quiz history (moved inside the forEach loop)
        const history = quizHistory[quiz.id];
        const hasHistory = history && history.lastScore !== undefined;
        const lastScore = hasHistory ? history.lastScore : null;
        const bestScore = hasHistory ? history.bestScore : null;
        const attempts = hasHistory ? history.attempts : 0;

        // Format date for last attempt
        let lastAttemptDate = '';
        if (hasHistory && history.lastDate) {
            const date = new Date(history.lastDate);
            lastAttemptDate = date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });
        }

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
                    ${attempts > 0 ?
                `<span><i class="fas fa-history"></i> ${attempts} attempt${attempts !== 1 ? 's' : ''}</span>` :
                ''
            }
                </div>
                
                ${hasHistory ? `
                    <div class="quiz-progress-section">
                        <div class="quiz-score-display">
                            <div class="score-progress-bar">
                                <div class="score-progress-fill" style="width: ${lastScore}%; 
                                    background: ${getScoreColor(lastScore)};"></div>
                            </div>
                            <div class="score-details">
                                <span class="last-score">Last: <strong>${lastScore}%</strong></span>
                                ${bestScore !== lastScore ?
                    `<span class="best-score">Best: <strong>${bestScore}%</strong></span>` :
                    ''
                }
                            </div>
                        </div>
                        ${lastAttemptDate ?
                    `<p class="last-attempt-date"><i class="far fa-calendar"></i> ${lastAttemptDate}</p>` :
                    ''
                }
                    </div>
                ` : `
                    <div class="quiz-progress-section">
                        <p class="no-attempts"><i class="far fa-star"></i> Not attempted yet</p>
                    </div>
                `}
            </div>
            
            <div class="quiz-actions">
                <button class="quiz-start-btn" data-quiz-id="${quiz.id}">
                    <i class="fas fa-play"></i> ${hasHistory ? 'Retry Quiz' : 'Start Quiz'}
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

        // Highlight search matches
        const highlightedTitle = highlightSearchMatch(story.title, query);
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
                <h3 class="story-title">${highlightedTitle}</h3>
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
        selectElement.addEventListener('change', function () {
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

        // Get quiz history (add this part)
        const history = quizHistory[quiz.id];
        const hasHistory = history && history.lastScore !== undefined;
        const lastScore = hasHistory ? history.lastScore : null;
        const bestScore = hasHistory ? history.bestScore : null;
        const attempts = hasHistory ? history.attempts : 0;

        // Format date for last attempt
        let lastAttemptDate = '';
        if (hasHistory && history.lastDate) {
            const date = new Date(history.lastDate);
            lastAttemptDate = date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });
        }

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
                    ${attempts > 0 ?
                `<span><i class="fas fa-history"></i> ${attempts} attempt${attempts !== 1 ? 's' : ''}</span>` :
                ''
            }
                </div>
                
                ${hasHistory ? `
                    <div class="quiz-progress-section">
                        <div class="quiz-score-display">
                            <div class="score-progress-bar">
                                <div class="score-progress-fill" style="width: ${lastScore}%; 
                                    background: ${getScoreColor(lastScore)};"></div>
                            </div>
                            <div class="score-details">
                                <span class="last-score">Last: <strong>${lastScore}%</strong></span>
                                ${bestScore !== lastScore ?
                    `<span class="best-score">Best: <strong>${bestScore}%</strong></span>` :
                    ''
                }
                            </div>
                        </div>
                        ${lastAttemptDate ?
                    `<p class="last-attempt-date"><i class="far fa-calendar"></i> ${lastAttemptDate}</p>` :
                    ''
                }
                    </div>
                ` : `
                    <div class="quiz-progress-section">
                        <p class="no-attempts"><i class="far fa-star"></i> Not attempted yet</p>
                    </div>
                `}
            </div>
            
            <div class="quiz-actions">
                <button class="quiz-start-btn" data-quiz-id="${quiz.id}">
                    <i class="fas fa-play"></i> ${hasHistory ? 'Retry Quiz' : 'Start Quiz'}
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





// ========= Refresh Function ==========
function Refresh() {
    window.location.reload();
}

// ========= Initialize App ==========
document.addEventListener('DOMContentLoaded', function () {
    init();
});