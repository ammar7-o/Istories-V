// ========= Quiz Creation Variables ==========
let userQuizzes = JSON.parse(localStorage.getItem('userQuizzes')) || [];
let currentEditQuizIndex = -1; // Track which quiz is being edited

// ========= Quiz Creation Functions ==========

// Initialize Add Quizzes page
function initAddQuizzes() {
    // Add event listeners
    setupAddQuizzesListeners();

    // Load existing user quizzes
    loadUserQuizzes();
}

// Setup event listeners for Add Quizzes page
function setupAddQuizzesListeners() {
    // File upload elements
    const quizBrowseBtn = document.getElementById('quizBrowseBtn');
    const quizFileInput = document.getElementById('quizFileInput');
    const quizUploadArea = document.getElementById('quizUploadArea');
    const quizRemoveFileBtn = document.getElementById('quizRemoveFile');
    const quizUploadBtn = document.getElementById('quizUploadBtn');

    // Text import elements
    const quizJsonTextArea = document.getElementById('quizJsonTextArea');
    const clearQuizJsonBtn = document.getElementById('clearQuizJsonBtn');
    const importQuizJsonBtn = document.getElementById('importQuizJsonBtn');

    // Template and export elements
    const downloadQuizTemplateBtn = document.getElementById('downloadQuizTemplateBtn');
    const exportQuizzesBtn = document.getElementById('exportQuizzesBtn');
    const copyQuizJsonBtn = document.getElementById('copyQuizJsonBtn');

    // Edit modal elements
    const closeEditQuizModalBtn = document.getElementById('closeEditQuizModalBtn');
    const closeEditQuizModalBtn2 = document.getElementById('closeEditQuizModalBtn2');
    const editQuizForm = document.getElementById('editQuizForm');
    const editQuizModal = document.getElementById('editQuizModal');
    const previewQuizBtn = document.getElementById('previewQuizBtn');
    const testQuizBtn = document.getElementById('testQuizBtn');

    // File upload functionality
    if (quizBrowseBtn && quizFileInput) {
        quizBrowseBtn.addEventListener('click', () => quizFileInput.click());
    }

    if (quizFileInput) {
        quizFileInput.addEventListener('change', handleQuizFileSelect);
    }

    if (quizUploadArea) {
        // Drag and drop functionality
        quizUploadArea.addEventListener('dragover', handleQuizDragOver);
        quizUploadArea.addEventListener('dragleave', handleQuizDragLeave);
        quizUploadArea.addEventListener('drop', handleQuizFileDrop);
        quizUploadArea.addEventListener('click', () => quizFileInput.click());
    }

    if (quizRemoveFileBtn) {
        quizRemoveFileBtn.addEventListener('click', clearQuizSelectedFile);
    }

    if (quizUploadBtn) {
        quizUploadBtn.addEventListener('click', uploadQuizFile);
    }

    // Text import functionality
    if (quizJsonTextArea) {
        quizJsonTextArea.addEventListener('input', validateQuizJsonInput);
        quizJsonTextArea.addEventListener('input', function() {
            autoResizeTextarea(this);
        });
    }

    if (clearQuizJsonBtn) {
        clearQuizJsonBtn.addEventListener('click', clearQuizJsonTextArea);
    }

    if (importQuizJsonBtn) {
        importQuizJsonBtn.addEventListener('click', importQuizFromText);
    }

    // Template and export functionality
    if (downloadQuizTemplateBtn) {
        downloadQuizTemplateBtn.addEventListener('click', downloadQuizTemplate);
    }

    if (exportQuizzesBtn) {
        exportQuizzesBtn.addEventListener('click', exportUserQuizzes);
    }

    if (copyQuizJsonBtn) {
        copyQuizJsonBtn.addEventListener('click', copyQuizJsonExample);
    }

    // Edit modal functionality
    if (closeEditQuizModalBtn) {
        closeEditQuizModalBtn.addEventListener('click', closeEditQuizModal);
    }

    if (closeEditQuizModalBtn2) {
        closeEditQuizModalBtn2.addEventListener('click', closeEditQuizModal);
    }

    if (editQuizForm) {
        editQuizForm.addEventListener('submit', handleEditQuizSubmit);
    }

    if (previewQuizBtn) {
        previewQuizBtn.addEventListener('click', previewQuizFromEdit);
    }

    if (testQuizBtn) {
        testQuizBtn.addEventListener('click', testQuizFromEdit);
    }

    // Close modal when clicking outside
    if (editQuizModal) {
        editQuizModal.addEventListener('click', (e) => {
            if (e.target === editQuizModal) {
                closeEditQuizModal();
            }
        });
    }
}

// Load user quizzes from localStorage
function loadUserQuizzes() {
    const userQuizzesList = document.getElementById('userQuizzesList');
    if (!userQuizzesList) return;

    userQuizzesList.innerHTML = '';

    if (userQuizzes.length === 0) {
        userQuizzesList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-brain"></i>
                <p>No quizzes created yet</p>
                <small>Create your first quiz using the text area or file upload!</small>
            </div>
        `;
        return;
    }

    userQuizzes.forEach((quiz, index) => {
        const quizItem = document.createElement('div');
        quizItem.className = 'story-item'; // Reusing story-item CSS class
        
        // Get quiz history
        const history = quizHistory[quiz.id];
        const hasHistory = history && history.lastScore !== undefined;
        const lastScore = hasHistory ? history.lastScore : null;
        const bestScore = hasHistory ? history.bestScore : null;
        const attempts = hasHistory ? history.attempts : 0;

        quizItem.innerHTML = `
            <div class="imtitle">
                <div class="story-icon">
                    <i class="fas ${getQuizIcon(quiz.type)}"></i>
                </div>
                <div class="story-item-info">
                    <span class="story-item-title">${quiz.title}</span>
                    <span class="story-item-meta">
                        ${quiz.level} • ${quiz.type} • 
                        ${quiz.questions ? quiz.questions.length : 0} questions •
                        ${new Date(quiz.createdAt || quiz.uploadDate).toLocaleDateString()}
                    </span>
                    ${hasHistory ? `
                        <div class="quiz-item-stats">
                            <span class="quiz-stat"><i class="fas fa-chart-line"></i> Best: ${bestScore}%</span>
                            <span class="quiz-stat"><i class="fas fa-history"></i> ${attempts} attempt${attempts !== 1 ? 's' : ''}</span>
                        </div>
                    ` : ''}
                </div>
            </div>
            
            <div class="story-item-actions">
                <button class="story-action-btn preview-quiz-btn" title="Preview Quiz" data-index="${index}">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="story-action-btn start-quiz-btn" title="Start Quiz" data-index="${index}">
                    <i class="fas fa-play"></i>
                </button>
                <button class="story-action-btn share-quiz-btn" title="Share as JSON" data-index="${index}">
                    <i class="fas fa-share-alt"></i>
                </button>
                <button class="story-action-btn edit-quiz-btn" title="Edit Quiz" data-index="${index}">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="story-action-btn delete-quiz-btn" title="Delete Quiz" data-index="${index}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;

        userQuizzesList.appendChild(quizItem);
    });

    // Add event listeners to buttons
    document.querySelectorAll('.preview-quiz-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = parseInt(e.currentTarget.dataset.index);
            previewQuiz(userQuizzes[index].id);
        });
    });

    document.querySelectorAll('.start-quiz-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = parseInt(e.currentTarget.dataset.index);
            startQuiz(userQuizzes[index].id);
        });
    });

    document.querySelectorAll('.share-quiz-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = parseInt(e.currentTarget.dataset.index);
            shareQuizAsJson(index);
        });
    });

    document.querySelectorAll('.edit-quiz-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = parseInt(e.currentTarget.dataset.index);
            openEditQuizModal(index);
        });
    });

    document.querySelectorAll('.delete-quiz-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = parseInt(e.currentTarget.dataset.index);
            deleteUserQuiz(index);
        });
    });
}

// Share quiz as JSON file
function shareQuizAsJson(index) {
    if (index < 0 || index >= userQuizzes.length) {
        showNotification('Quiz not found.', 'error');
        return;
    }

    const quiz = userQuizzes[index];
    
    // Create a clean copy without internal properties
    const exportQuiz = {
        id: quiz.id,
        title: quiz.title,
        description: quiz.description,
        level: quiz.level,
        type: quiz.type,
        author: quiz.author || '',
        createdAt: quiz.createdAt || quiz.uploadDate,
        questions: quiz.questions || []
    };

    // Convert to JSON string with nice formatting
    const jsonString = JSON.stringify(exportQuiz, null, 2);

    // Create download
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;

    // Create filename from quiz title
    const sanitizedTitle = quiz.title
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
    URL.revokeObjectURL(url);

    showNotification(`"${quiz.title}" exported as JSON file!`, 'success');
}

// Open edit quiz modal
function openEditQuizModal(index) {
    currentEditQuizIndex = index;
    const quiz = userQuizzes[index];

    // Fill form with quiz data
    document.getElementById('editQuizTitle').value = quiz.title || '';
    document.getElementById('editQuizDescription').value = quiz.description || '';
    document.getElementById('editQuizLevel').value = quiz.level || 'beginner';
    document.getElementById('editQuizType').value = quiz.type || 'vocab';
    document.getElementById('editQuizAuthor').value = quiz.author || '';
    
    // Fill questions
    const editQuizQuestions = document.getElementById('editQuizQuestions');
    if (editQuizQuestions && quiz.questions) {
        editQuizQuestions.value = JSON.stringify(quiz.questions, null, 2);
    }

    // Show modal
    const editQuizModal = document.getElementById('editQuizModal');
    if (editQuizModal) {
        editQuizModal.classList.add('show');
    }
}

// Handle edit quiz form submission
function handleEditQuizSubmit(e) {
    e.preventDefault();

    if (currentEditQuizIndex === -1) {
        showNotification('No quiz selected for editing.', 'error');
        return;
    }

    const quiz = userQuizzes[currentEditQuizIndex];

    // Get form values
    const title = document.getElementById('editQuizTitle').value.trim();
    const description = document.getElementById('editQuizDescription').value.trim();
    const level = document.getElementById('editQuizLevel').value;
    const type = document.getElementById('editQuizType').value;
    const author = document.getElementById('editQuizAuthor').value.trim();
    const questionsText = document.getElementById('editQuizQuestions').value.trim();

    // Validation
    if (!title || !description || !level || !type || !questionsText) {
        showNotification('Please fill in all required fields.', 'error');
        return;
    }

    // Parse questions
    let questions;
    try {
        questions = JSON.parse(questionsText);
        if (!Array.isArray(questions)) {
            throw new Error('Questions must be an array');
        }
        
        // Validate each question
        questions.forEach((q, i) => {
            if (!validateQuestion(q)) {
                throw new Error(`Invalid question at index ${i}`);
            }
        });
    } catch (error) {
        showNotification(`Error parsing questions: ${error.message}`, 'error');
        return;
    }

    // Update quiz
    userQuizzes[currentEditQuizIndex] = {
        ...quiz,
        title,
        description,
        level,
        type,
        author: author || '',
        questions,
        uploadDate: new Date().toISOString()
    };

    // Update in main quizzes array
    const quizIndex = quizzes.findIndex(q => q.id === quiz.id);
    if (quizIndex !== -1) {
        quizzes[quizIndex] = { ...userQuizzes[currentEditQuizIndex] };
    }

    // Save to localStorage
    localStorage.setItem('userQuizzes', JSON.stringify(userQuizzes));

    // Update UI
    loadUserQuizzes();
    updateQuizCardsWithScores();

    // Close modal
    closeEditQuizModal();

    // Show success message
    showNotification('Quiz updated successfully!', 'success');
}

// Close edit modal
function closeEditQuizModal() {
    const editQuizModal = document.getElementById('editQuizModal');
    if (editQuizModal) {
        editQuizModal.classList.remove('show');
    }
    currentEditQuizIndex = -1;

    // Reset form
    const editQuizForm = document.getElementById('editQuizForm');
    if (editQuizForm) {
        editQuizForm.reset();
    }
}

// Preview quiz from edit modal
function previewQuizFromEdit() {
    const quiz = userQuizzes[currentEditQuizIndex];
    if (quiz) {
        closeEditQuizModal();
        previewQuiz(quiz.id);
    }
}

// Test quiz from edit modal
function testQuizFromEdit() {
    const quiz = userQuizzes[currentEditQuizIndex];
    if (quiz) {
        closeEditQuizModal();
        startQuiz(quiz.id);
    }
}

// Validate a question object
function validateQuestion(question) {
    const requiredFields = ['id', 'type', 'question'];
    
    for (const field of requiredFields) {
        if (!question[field]) {
            return false;
        }
    }

    // Validate based on question type
    switch (question.type) {
        case 'multiple_choice':
        case 'true_false':
            if (!question.choices || !Array.isArray(question.choices)) return false;
            if (question.choices.length === 0) return false;
            // Check if at least one choice is correct
            if (!question.choices.some(choice => choice.correct)) return false;
            break;
            
        case 'fill_in_blank':
            if (!question.correctAnswers || !Array.isArray(question.correctAnswers)) return false;
            if (question.correctAnswers.length === 0) return false;
            break;
            
        case 'matching':
            if (!question.matches || !Array.isArray(question.matches)) return false;
            if (question.matches.length === 0) return false;
            if (!question.correctMatches || typeof question.correctMatches !== 'object') return false;
            break;
            
        case 'drag_drop':
            if (!question.scrambledWords || !Array.isArray(question.scrambledWords)) return false;
            if (question.scrambledWords.length === 0) return false;
            if (!question.correctOrder || !Array.isArray(question.correctOrder)) return false;
            if (question.correctOrder.length !== question.scrambledWords.length) return false;
            break;
            
        case 'short_answer':
            // Short answer questions just need question text
            break;
            
        default:
            return false; // Invalid question type
    }
    
    return true;
}

// Validate quiz structure
function validateQuiz(quiz) {
    const requiredFields = ['title', 'description', 'level', 'type', 'questions'];
    
    for (const field of requiredFields) {
        if (!quiz[field]) {
            return false;
        }
    }

    // Check questions array
    if (!Array.isArray(quiz.questions) || quiz.questions.length === 0) {
        return false;
    }

    // Check level is valid
    const validLevels = ['beginner', 'intermediate', 'advanced'];
    if (!validLevels.includes(quiz.level)) {
        return false;
    }

    // Check type is valid
    const validTypes = ['vocab', 'grammar', 'reading', 'listening', 'writing', 'mixed'];
    if (!validTypes.includes(quiz.type)) {
        return false;
    }

    // Validate each question
    for (const question of quiz.questions) {
        if (!validateQuestion(question)) {
            return false;
        }
    }

    return true;
}

// Process quiz data
function processQuizData(quizData, fileName) {
    let processedQuizzes = [];
    let totalImported = 0;
    let skippedDuplicates = 0;

    // Check if it's a single quiz or array of quizzes
    if (Array.isArray(quizData)) {
        // Multiple quizzes in an array
        for (const quiz of quizData) {
            const result = processSingleQuiz(quiz, fileName);
            if (result.success) {
                processedQuizzes.push(result.quiz);
                totalImported++;
            } else {
                skippedDuplicates++;
            }
        }
    } else if (quizData.quizzes && Array.isArray(quizData.quizzes)) {
        // Quizzes inside a "quizzes" property
        for (const quiz of quizData.quizzes) {
            const result = processSingleQuiz(quiz, fileName);
            if (result.success) {
                processedQuizzes.push(result.quiz);
                totalImported++;
            } else {
                skippedDuplicates++;
            }
        }
    } else {
        // Single quiz object
        const result = processSingleQuiz(quizData, fileName);
        if (result.success) {
            processedQuizzes.push(result.quiz);
            totalImported++;
        } else {
            showNotification('Quiz already exists or invalid format.', 'error');
            return;
        }
    }

    // Save all imported quizzes
    if (processedQuizzes.length > 0) {
        // Add to user quizzes
        userQuizzes.push(...processedQuizzes);
        localStorage.setItem('userQuizzes', JSON.stringify(userQuizzes));

        // Add to main quizzes array
        processedQuizzes.forEach(quiz => {
            if (!quizzes.some(q => q.id === quiz.id)) {
                quizzes.push(quiz);
            }
        });
    }

    // Update UI
    loadUserQuizzes();
    updateQuizCardsWithScores();

    // Show success message
    let message = '';
    if (totalImported > 0) {
        message = `${totalImported} quiz${totalImported !== 1 ? 'zes' : ''} imported successfully!`;
        if (skippedDuplicates > 0) {
            message += ` ${skippedDuplicates} duplicate${skippedDuplicates !== 1 ? 's' : ''} skipped.`;
        }
        showNotification(message, 'success');
    } else {
        showNotification('No quizzes were imported. They may already exist or have invalid format.', 'warning');
    }

    // Clear file selection
    clearQuizSelectedFile();

    // Preview the first imported quiz
    if (totalImported === 1 && processedQuizzes.length > 0) {
        previewQuiz(processedQuizzes[0].id);
    }
}

// Helper function to process a single quiz
function processSingleQuiz(quizData, fileName) {
    // Validate quiz structure
    if (!validateQuiz(quizData)) {
        return { success: false, reason: 'Invalid format' };
    }

    // Check if quiz already exists (by title and questions)
    const existingQuiz = userQuizzes.find(quiz =>
        quiz.title === quizData.title &&
        JSON.stringify(quiz.questions) === JSON.stringify(quizData.questions)
    );

    if (existingQuiz) {
        return { success: false, reason: 'Duplicate' };
    }

    // Generate unique ID if not provided
    const quizId = quizData.id || 'user_quiz_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);

    // Prepare quiz object
    const userQuiz = {
        ...quizData,
        id: quizId,
        isUserQuiz: true,
        fileName: fileName,
        uploadDate: new Date().toISOString(),
        author: quizData.author || 'User'
    };

    return { success: true, quiz: userQuiz };
}

// Delete user quiz
function deleteUserQuiz(index) {
    if (confirm('Are you sure you want to delete this quiz? This action cannot be undone.')) {
        const quizId = userQuizzes[index].id;

        // Remove from userQuizzes array
        userQuizzes.splice(index, 1);

        // Remove from main quizzes array
        const quizIndex = quizzes.findIndex(q => q.id === quizId);
        if (quizIndex !== -1) {
            quizzes.splice(quizIndex, 1);
        }

        // Remove from quiz history
        delete quizHistory[quizId];
        localStorage.setItem('quizHistory', JSON.stringify(quizHistory));

        // Update localStorage
        localStorage.setItem('userQuizzes', JSON.stringify(userQuizzes));

        // Update UI
        loadUserQuizzes();
        updateQuizCardsWithScores();

        showNotification('Quiz deleted successfully.', 'success');
    }
}

// File upload handlers for quizzes
function handleQuizFileSelect(e) {
    const file = e.target.files[0];
    if (file && file.type === 'application/json') {
        displayQuizSelectedFile(file);
    } else {
        showNotification('Please select a valid JSON file.', 'error');
    }
}

function handleQuizDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    const uploadArea = document.getElementById('quizUploadArea');
    if (uploadArea) {
        uploadArea.style.borderColor = 'var(--primary-dark)';
        uploadArea.style.background = 'rgba(255, 255, 255, 0.3)';
    }
}

function handleQuizDragLeave(e) {
    e.preventDefault();
    e.stopPropagation();
    const uploadArea = document.getElementById('quizUploadArea');
    if (uploadArea) {
        uploadArea.style.borderColor = 'var(--primary)';
        uploadArea.style.background = 'rgba(255, 255, 255, 0.1)';
    }
}

function handleQuizFileDrop(e) {
    e.preventDefault();
    e.stopPropagation();

    const uploadArea = document.getElementById('quizUploadArea');
    if (uploadArea) {
        uploadArea.style.borderColor = 'var(--primary)';
        uploadArea.style.background = 'rgba(255, 255, 255, 0.1)';
    }

    const files = e.dataTransfer.files;
    if (files.length > 0) {
        const file = files[0];
        if (file.type === 'application/json') {
            displayQuizSelectedFile(file);
        } else {
            showNotification('Please drop a valid JSON file.', 'error');
        }
    }
}

function displayQuizSelectedFile(file) {
    const selectedFileInfo = document.getElementById('quizSelectedFileInfo');
    const fileName = document.getElementById('quizFileName');
    const fileSize = document.getElementById('quizFileSize');
    const uploadBtn = document.getElementById('quizUploadBtn');

    if (selectedFileInfo && fileName && fileSize && uploadBtn) {
        fileName.textContent = file.name;
        fileSize.textContent = formatFileSize(file.size);
        selectedFileInfo.style.display = 'block';
        uploadBtn.disabled = false;
    }
}

function clearQuizSelectedFile() {
    const quizFileInput = document.getElementById('quizFileInput');
    const selectedFileInfo = document.getElementById('quizSelectedFileInfo');
    const uploadBtn = document.getElementById('quizUploadBtn');

    if (quizFileInput && selectedFileInfo && uploadBtn) {
        quizFileInput.value = '';
        selectedFileInfo.style.display = 'none';
        uploadBtn.disabled = true;
    }
}

function uploadQuizFile() {
    const quizFileInput = document.getElementById('quizFileInput');
    if (!quizFileInput || !quizFileInput.files[0]) return;

    const file = quizFileInput.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
        try {
            const quizData = JSON.parse(e.target.result);
            processQuizData(quizData, file.name);
        } catch (error) {
            showNotification('Error parsing JSON file: ' + error.message, 'error');
        }
    };

    reader.onerror = function () {
        showNotification('Error reading file.', 'error');
    };

    reader.readAsText(file);
}

// JSON validation for quizzes
let quizJsonImportValidationTimer = null;

function validateQuizJsonInput() {
    const textArea = document.getElementById('quizJsonTextArea');
    const importBtn = document.getElementById('importQuizJsonBtn');
    const validationDiv = document.getElementById('quizJsonValidation');
    const validationMessage = document.getElementById('quizValidationMessage');

    if (!textArea || textArea.value.trim() === '') {
        if (validationDiv) validationDiv.style.display = 'none';
        if (importBtn) importBtn.disabled = true;
        return;
    }

    // Debounce validation
    clearTimeout(quizJsonImportValidationTimer);
    quizJsonImportValidationTimer = setTimeout(() => {
        try {
            const jsonData = JSON.parse(textArea.value);

            // Check if it's a valid quiz structure
            if (validateQuiz(jsonData)) {
                if (validationDiv) {
                    validationDiv.className = 'json-validation valid';
                    validationMessage.textContent = '✓ Valid quiz format';
                }
                if (importBtn) importBtn.disabled = false;
            } else if (Array.isArray(jsonData)) {
                // Check if it's an array of quizzes
                const validCount = jsonData.filter(validateQuiz).length;
                if (validCount > 0) {
                    if (validationDiv) {
                        validationDiv.className = 'json-validation valid';
                        validationMessage.textContent = `✓ Valid format (${validCount} quiz${validCount !== 1 ? 'zes' : ''} found)`;
                    }
                    if (importBtn) importBtn.disabled = false;
                } else {
                    if (validationDiv) {
                        validationDiv.className = 'json-validation invalid';
                        validationMessage.textContent = '✗ Array contains invalid quizzes';
                    }
                    if (importBtn) importBtn.disabled = true;
                }
            } else if (jsonData.quizzes && Array.isArray(jsonData.quizzes)) {
                // Check if it's an object with quizzes array
                const validCount = jsonData.quizzes.filter(validateQuiz).length;
                if (validCount > 0) {
                    if (validationDiv) {
                        validationDiv.className = 'json-validation valid';
                        validationMessage.textContent = `✓ Valid format (${validCount} quiz${validCount !== 1 ? 'zes' : ''} found)`;
                    }
                    if (importBtn) importBtn.disabled = false;
                } else {
                    if (validationDiv) {
                        validationDiv.className = 'json-validation invalid';
                        validationMessage.textContent = '✗ Invalid quizzes format';
                    }
                    if (importBtn) importBtn.disabled = true;
                }
            } else {
                if (validationDiv) {
                    validationDiv.className = 'json-validation invalid';
                    validationMessage.textContent = '✗ Invalid quiz structure';
                }
                if (importBtn) importBtn.disabled = true;
            }
        } catch (error) {
            if (validationDiv) {
                validationDiv.className = 'json-validation invalid';
                validationMessage.textContent = `✗ Invalid JSON: ${error.message}`;
            }
            if (importBtn) importBtn.disabled = true;
        }

        if (validationDiv) validationDiv.style.display = 'block';
    }, 500);
}

function clearQuizJsonTextArea() {
    const textArea = document.getElementById('quizJsonTextArea');
    const validationDiv = document.getElementById('quizJsonValidation');
    const importBtn = document.getElementById('importQuizJsonBtn');

    if (textArea) {
        textArea.value = '';
        textArea.style.height = 'auto';
    }

    if (validationDiv) {
        validationDiv.style.display = 'none';
    }

    if (importBtn) {
        importBtn.disabled = true;
    }

    showNotification('Text area cleared', 'info');
}

function importQuizFromText() {
    const textArea = document.getElementById('quizJsonTextArea');
    if (!textArea || textArea.value.trim() === '') {
        showNotification('Please enter JSON text first', 'error');
        return;
    }

    try {
        const jsonData = JSON.parse(textArea.value);
        const fileName = 'quiz_text_import_' + new Date().toISOString().replace(/[:.]/g, '-') + '.json';

        // Process the quiz data
        processQuizData(jsonData, fileName);

        // Clear text area after successful import
        clearQuizJsonTextArea();

    } catch (error) {
        showNotification(`Error parsing JSON: ${error.message}`, 'error');
    }
}

// Download quiz template
function downloadQuizTemplate() {
    const template = {
        "quizzes": [
            {
                "id": "my-custom-quiz",
                "title": "Basic Arabic Vocabulary Quiz",
                "description": "Test your basic Arabic vocabulary knowledge",
                "level": "beginner",
                "type": "vocab",
                "author": "Your Name",
                "createdAt": "2024-01-01",
                "questions": [
                    {
                        "id": 1,
                        "type": "multiple_choice",
                        "question": "What is the Arabic word for 'hello'?",
                        "choices": [
                            {"value": "مرحبا", "correct": true},
                            {"value": "شكرا", "correct": false},
                            {"value": "مع السلامة", "correct": false},
                            {"value": "صباح الخير", "correct": false}
                        ],
                        "explanation": "'مرحبا' means hello in Arabic."
                    },
                    {
                        "id": 2,
                        "type": "true_false",
                        "question": "'كتاب' means 'pen' in Arabic.",
                        "choices": [
                            {"value": "true", "correct": false},
                            {"value": "false", "correct": true}
                        ],
                        "explanation": "'كتاب' means 'book', not 'pen'."
                    },
                    {
                        "id": 3,
                        "type": "fill_in_blank",
                        "question": "The Arabic word for water is ___.",
                        "correctAnswers": ["ماء"],
                        "explanation": "'ماء' means water in Arabic."
                    }
                ]
            }
        ]
    };

    const templateStr = JSON.stringify(template, null, 2);
    const blob = new Blob([templateStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'quizzes-template.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showNotification('Quiz template downloaded successfully!', 'success');
}

function copyQuizJsonExample() {
    const jsonExample = document.getElementById('quizJsonExample').textContent;
    navigator.clipboard.writeText(jsonExample)
        .then(() => showNotification('Quiz JSON example copied to clipboard!', 'success'))
        .catch(err => showNotification('Failed to copy: ' + err, 'error'));
}

// Export all user quizzes
function exportUserQuizzes() {
    try {
        if (userQuizzes.length === 0) {
            alert('⚠️ No user quizzes found to export!');
            return;
        }

        // Create the final export structure
        const exportData = {
            "quizzes": userQuizzes.map(quiz => {
                // Create a clean copy without internal properties
                return {
                    id: quiz.id,
                    title: quiz.title,
                    description: quiz.description,
                    level: quiz.level,
                    type: quiz.type,
                    author: quiz.author || '',
                    createdAt: quiz.createdAt || quiz.uploadDate,
                    questions: quiz.questions || []
                };
            })
        };

        // Convert to JSON
        const jsonString = JSON.stringify(exportData, null, 4);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        // Create download link
        const downloadLink = document.createElement('a');
        downloadLink.href = url;
        const date = new Date();
        const dateString = date.toISOString().split('T')[0];
        const timeString = date.getHours().toString().padStart(2, '0') +
            date.getMinutes().toString().padStart(2, '0');
        downloadLink.download = `quizzes-export-${dateString}-${timeString}.json`;

        // Trigger download
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        URL.revokeObjectURL(url);

        // Show success message
        console.log(`✅ Successfully exported ${userQuizzes.length} user quizzes`);
        showNotification(`✅ Exported ${userQuizzes.length} quiz${userQuizzes.length !== 1 ? 'zes' : ''} successfully!`, 'success');

    } catch (error) {
        console.error('❌ Error exporting user quizzes:', error);
        alert('❌ Failed to export user quizzes. Error: ' + error.message);
    }
}

// Delete all user quizzes
function deleteAllUserQuizzes() {
    if (userQuizzes.length === 0) {
        alert('⚠️ No user quizzes found to delete!');
        return;
    }

    const confirmed = confirm(`⚠️ WARNING: Are you sure you want to delete ALL ${userQuizzes.length} user quizzes?\n\nThis will delete all uploaded quizzes and quiz history. This action cannot be undone!`);

    if (!confirmed) {
        return;
    }

    try {
        // Remove from main quizzes array
        userQuizzes.forEach(userQuiz => {
            const index = quizzes.findIndex(q => q.id === userQuiz.id);
            if (index !== -1) {
                quizzes.splice(index, 1);
            }
            // Remove from history
            delete quizHistory[userQuiz.id];
        });

        // Clear arrays
        userQuizzes = [];

        // Update localStorage
        localStorage.removeItem('userQuizzes');
        localStorage.setItem('quizHistory', JSON.stringify(quizHistory));

        // Update UI
        loadUserQuizzes();
        updateQuizCardsWithScores();

        showNotification(`✅ All ${userQuizzes.length} user quizzes deleted successfully!`, 'success');

    } catch (error) {
        console.error('❌ Error deleting all user quizzes:', error);
        showNotification('❌ Failed to delete user quizzes. Please try again.', 'error');
    }
}

// Auto-resize textarea
function autoResizeTextarea(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 400) + 'px';
}

// Initialize Add Quizzes page when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    // Load user quizzes
    try {
        const storedQuizzes = localStorage.getItem('userQuizzes');
        if (storedQuizzes) {
            userQuizzes = JSON.parse(storedQuizzes);
        }
    } catch (error) {
        console.error('Error loading user quizzes:', error);
        userQuizzes = [];
    }

    // Initialize Add Quizzes if on that page
    if (document.getElementById('addquiz')) {
        initAddQuizzes();
    }
});

// Update switchPage to handle quiz page
function switchPage(page) {
    currentPage = page;
    pages.forEach(p => p.classList.remove('active'));
    
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

    // Handle quiz-specific actions
    if (page === 'addquiz') {
        loadUserQuizzes();
    }
}