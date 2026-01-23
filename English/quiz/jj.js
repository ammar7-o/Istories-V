// Update the previewQuiz function to handle both quizId and quiz object
function previewQuiz(quizIdOrQuiz) {
    let quiz;
    let quizId;
    
    // Check if parameter is a quiz object or quiz ID
    if (typeof quizIdOrQuiz === 'object') {
        quiz = quizIdOrQuiz;
        quizId = quiz.id;
    } else {
        quizId = quizIdOrQuiz;
        quiz = quizzes.find(q => q.id === quizId);
        
        // If not found in main quizzes, check user quizzes
        if (!quiz) {
            quiz = userQuizzes.find(q => q.id === quizId);
        }
    }
    
    if (!quiz) {
        showNotification('Quiz not found!', 'error');
        return;
    }

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
        backdrop-filter: blur(5px);
    `;

    const previewContent = `
        <div class="preview-content" style="background: var(--bg); padding: 30px; border-radius: 12px; max-width: 600px; width: 100%; max-height: 80vh; overflow-y: auto; box-shadow: 0 20px 60px rgba(0,0,0,0.3);">
            <div class="preview-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h2 style="color: var(--primary); margin: 0; font-size: 1.4rem; display: flex; align-items: center; gap: 10px;">
                    <i class="fas ${getQuizIcon(quiz.type)}"></i>
                    ${quiz.title}
                </h2>
                <button class="close-preview" style="background: none; border: none; font-size: 30px; cursor: pointer; color: #666;">&times;</button>
            </div>
            
            <div style="margin-bottom: 20px;">
                <p><strong>Description:</strong> ${quiz.description || 'No description provided'}</p>
                <div style="display: flex; flex-wrap: wrap; gap: 10px; margin: 10px 0;">
                    <span class="quiz-level ${quiz.level}" style="padding: 4px 12px; border-radius: 20px; font-size: 0.8rem; font-weight: 600;">
                        ${quiz.level.charAt(0).toUpperCase() + quiz.level.slice(1)}
                    </span>
                    <span style="padding: 4px 12px; background: var(--border); border-radius: 20px; font-size: 0.8rem;">
                        ${quiz.type.charAt(0).toUpperCase() + quiz.type.slice(1)}
                    </span>
                    ${quiz.isUserQuiz ? `
                        <span style="padding: 4px 12px; background: var(--primary); color: white; border-radius: 20px; font-size: 0.8rem; display: flex; align-items: center; gap: 5px;">
                            <i class="fas fa-user-edit"></i> Your Quiz
                        </span>
                    ` : ''}
                </div>
                <p><strong>Questions:</strong> ${quiz.questions ? quiz.questions.length : 0}</p>
                
                ${quiz.author ? `<p><strong>Author:</strong> ${quiz.author}</p>` : ''}
                
                ${hasHistory ? `
                    <div class="history-grade-preview" style="margin-top: 15px; padding: 15px; background: var(--bg-secondary); border-radius: 8px;">
                        <p style="margin: 0 0 10px 0; font-weight: 600;">Your Progress:</p>
                        <p style="margin: 5px 0; display: flex; align-items: center; gap: 8px;">
                            <i class="fas fa-chart-line" style="color: var(--primary);"></i> 
                            Last Score: <strong>${history.lastScore}%</strong>
                        </p>
                        ${history.bestScore !== history.lastScore ?
                `<p style="margin: 5px 0; display: flex; align-items: center; gap: 8px;">
                                <i class="fas fa-trophy" style="color: #FFD700;"></i> 
                                Best Score: <strong>${history.bestScore}%</strong>
                            </p>` :
                ''
            }
                        <p style="margin: 5px 0; display: flex; align-items: center; gap: 8px;">
                            <i class="fas fa-redo" style="color: var(--text-light);"></i> 
                            Attempts: <strong>${history.attempts}</strong>
                        </p>
                    </div>
                ` : `
                    <div class="history-grade-preview" style="margin-top: 15px; padding: 15px; background: var(--bg-secondary); border-radius: 8px;">
                        <p style="margin: 0; display: flex; align-items: center; gap: 8px;">
                            <i class="far fa-star" style="color: var(--text-light);"></i> 
                            <strong>Not attempted yet</strong>
                        </p>
                        <p style="margin: 5px 0 0 0; font-size: 0.9rem; color: var(--text-light);">
                            Start this quiz to track your progress!
                        </p>
                    </div>
                `}
            </div>
            
            <div>
                <h3 style="color: var(--primary); margin-bottom: 15px; font-size: 1.1rem; display: flex; align-items: center; gap: 8px;">
                    <i class="fas fa-eye"></i> Sample Questions:
                </h3>
                ${quiz.questions ? quiz.questions.slice(0, 3).map((q, i) => `
                    <div class="cqa" style="margin-bottom: 15px; padding: 15px; background: var(--bg-secondary); border-left: 3px solid var(--primary); border-radius: 0 8px 8px 0;">
                        <p style="margin: 0 0 10px 0; font-weight: 600;">Q${i + 1}: ${q.question}</p>
                        ${q.type === 'multiple_choice' ? `
                            <div style="margin-top: 10px;">
                                ${q.choices ? q.choices.slice(0, 3).map((choice, j) => `
                                    <div class="response-quiz" style="margin: 5px 0; padding: 8px 12px; background: ${choice.correct ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)'}; border-radius: 6px; border-left: 3px solid ${choice.correct ? '#10b981' : '#ef4444'};">
                                        ${String.fromCharCode(65 + j)}. ${choice.value}
                                        ${choice.correct ? ' <i class="fas fa-check" style="color: #10b981;"></i>' : ''}
                                    </div>
                                `).join('') : '<p style="color: var(--text-light); font-style: italic;">No choices available</p>'}
                            </div>
                        ` : q.type === 'true_false' ? `
                            <div style="margin-top: 10px;">
                                <div style="display: flex; gap: 10px;">
                                    <span style="padding: 8px 12px; background: ${q.choices && q.choices[0] && q.choices[0].correct ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)'}; border-radius: 6px; border: 1px solid ${q.choices && q.choices[0] && q.choices[0].correct ? '#10b981' : '#ef4444'}; color: ${q.choices && q.choices[0] && q.choices[0].correct ? '#10b981' : '#ef4444'};">
                                        True ${q.choices && q.choices[0] && q.choices[0].correct ? ' <i class="fas fa-check"></i>' : ''}
                                    </span>
                                    <span style="padding: 8px 12px; background: ${q.choices && q.choices[1] && q.choices[1].correct ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)'}; border-radius: 6px; border: 1px solid ${q.choices && q.choices[1] && q.choices[1].correct ? '#10b981' : '#ef4444'}; color: ${q.choices && q.choices[1] && q.choices[1].correct ? '#10b981' : '#ef4444'};">
                                        False ${q.choices && q.choices[1] && q.choices[1].correct ? ' <i class="fas fa-check"></i>' : ''}
                                    </span>
                                </div>
                            </div>
                        ` : q.type === 'fill_in_blank' ? `
                            <div style="margin-top: 10px;">
                                <p style="font-style: italic; color: var(--text-light);">
                                    Fill in the blank question
                                </p>
                                ${q.correctAnswers ? `
                                    <p style="margin-top: 5px; font-size: 0.9rem;">
                                        <strong>Correct answer:</strong> ${q.correctAnswers[0]}
                                    </p>
                                ` : ''}
                            </div>
                        ` : q.type === 'drag_drop' ? `
                            <div style="margin-top: 10px;">
                                <p style="font-style: italic; color: var(--text-light);">
                                    Drag & Drop question
                                </p>
                                ${q.scrambledWords ? `
                                    <p style="margin-top: 5px; font-size: 0.9rem;">
                                        <strong>Words:</strong> ${q.scrambledWords.join(', ')}
                                    </p>
                                ` : ''}
                            </div>
                        ` : `
                            <div style="margin-top: 10px;">
                                <p style="font-style: italic; color: var(--text-light);">
                                    ${q.type.replace('_', ' ').charAt(0).toUpperCase() + q.type.replace('_', ' ').slice(1)} question
                                </p>
                            </div>
                        `}
                    </div>
                `).join('') : '<p style="color: var(--text-light); font-style: italic;">No questions available</p>'}
            </div>
            
            <div style="margin-top: 20px; display: flex; gap: 10px;">
                <button class="start-from-preview" style="flex: 1; padding: 12px; background: var(--primary); color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 8px;">
                    <i class="fas fa-play"></i> ${hasHistory ? 'Retry Quiz' : 'Start Quiz'}
                </button>
                <button class="close-btn" style="flex: 1; padding: 12px; background: var(--border); color: var(--text); border: none; border-radius: 8px; cursor: pointer; font-weight: 600;">
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

// Also update the previewQuiz function call in loadUserQuizzes:
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
        quizItem.className = 'story-item';

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
                <button class="story-action-btn preview-quiz-btn" title="Preview Quiz" data-quiz-id="${quiz.id}">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="story-action-btn start-quiz-btn" title="Start Quiz" data-quiz-id="${quiz.id}">
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

    // Update event listeners to pass quiz ID
    document.querySelectorAll('.preview-quiz-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const quizId = e.currentTarget.dataset.quizId;
            previewQuiz(quizId);
        });
    });

    document.querySelectorAll('.start-quiz-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const quizId = e.currentTarget.dataset.quizId;
            
            // Switch to home page first
            switchPage('home');

            // Wait for page to switch, then start the quiz
            setTimeout(() => {
                startQuizFromAddQuizzes(quizId);
            }, 100);
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

// Update the previewQuizById function to be simpler
function previewQuizById(quizId) {
    previewQuiz(quizId);
}

// Update previewQuizFromEdit function
function previewQuizFromEdit() {
    const quiz = userQuizzes[currentEditQuizIndex];
    if (quiz) {
        closeEditQuizModal();
        previewQuiz(quiz.id); // Pass quiz ID instead of quiz object
    }
}