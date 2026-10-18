window.quizData = {
    meta: {
        app: "IStories",
        version: "1.0.0",
        lastUpdated: "2024-01-20",
        language: "ar"
    },

    quizzes: [
        {
            id: "verbs-2",
            title: "Arabic Verbs - Interactive Practice",
            description: "Practice Arabic verbs with interactive question types",
            level: "beginner",
            type: "grammar",
            author: "IStories",
            createdAt: "2024-01-18",

            questions: [
                // 1. DRAG & DROP - Build a sentence
                {
                    id: 1,
                    type: "drag_drop",
                    question: "Arrange the words to form a correct Arabic sentence:",
                    scrambledWords: ["الولد", "يأكل", "التفاحة", "في", "المدرسة"],
                    correctOrder: [1, 2, 3, 4, 5], // "الولد يأكل التفاحة في المدرسة"
                    hint: "Subject + verb + object + preposition + place",
                    explanation: "The correct sentence is: 'الولد يأكل التفاحة في المدرسة' (The boy eats the apple at school)."
                },

                // 2. DRAG & DROP - Question formation
                {
                    id: 2,
                    type: "drag_drop",
                    question: "Arrange the words to form a question in Arabic:",
                    scrambledWords: ["هل", "تذهب", "إلى", "المدرسة", "أنت"],
                    correctOrder: [1, 5, 2, 3, 4], // "هل أنت تذهب إلى المدرسة؟"
                    hint: "Questions often start with 'هل' followed by the subject",
                    explanation: "The correct question is: 'هل أنت تذهب إلى المدرسة؟' (Do you go to school?)."
                },

                // 3. MULTIPLE CHOICE (Changed from multiple_select)
                {
                    id: 3,
                    type: "multiple_choice",
                    question: "Which verb is in the present tense form?",
                    choices: [
                        { value: "يأكل", correct: true },
                        { value: "أكل", correct: false },
                        { value: "سأكل", correct: false },
                        { value: "أكلت", correct: false }
                    ],
                    explanation: "'يأكل' is present tense (he eats). 'أكل' is past tense, 'سأكل' is future, 'أكلت' is she ate."
                },

                // 4. MATCHING (Changed from sequence_ordering)
                {
                    id: 4,
                    type: "matching",
                    question: "Match the daily routine actions with their correct order:",
                    matches: [
                        { left: "First action", right: "أستيقظ في الصباح" },
                        { left: "Second action", right: "أغسل وجهي" },
                        { left: "Third action", right: "أتناول الفطور" },
                        { left: "Fourth action", right: "أذهب إلى المدرسة" }
                    ],
                    correctMatches: {0: 0, 1: 1, 2: 2, 3: 3},
                    explanation: "Daily routine: 1. Wake up, 2. Wash face, 3. Eat breakfast, 4. Go to school."
                },

                // 5. MULTIPLE CHOICE (Changed from audio_question)
                {
                    id: 5,
                    type: "multiple_choice",
                    question: "What does the Arabic verb 'يكتب' mean in English?",
                    choices: [
                        { value: "To write", correct: true },
                        { value: "To read", correct: false },
                        { value: "To speak", correct: false },
                        { value: "To listen", correct: false }
                    ],
                    explanation: "'يكتب' means 'to write'. The root is ك-ت-ب (k-t-b)."
                },

                // 6. DRAG & DROP - Verb conjugation
                {
                    id: 6,
                    type: "drag_drop",
                    question: "Drag the correct pronoun to complete the verb conjugation:",
                    scrambledWords: ["هو", "هي", "أنت", "أنا"],
                    targetSentence: "___ أقرأ الكتاب",
                    correctOrder: [4], // Only "أنا" is correct
                    hint: "The verb 'أقرأ' is conjugated for the first person singular",
                    explanation: "'أقرأ' is conjugated for 'أنا' (I). So the correct sentence is: 'أنا أقرأ الكتاب' (I read the book)."
                },

                // 7. MATCHING (Changed from image_matching)
                {
                    id: 7,
                    type: "matching",
                    question: "Match the Arabic verbs with their English meanings:",
                    matches: [
                        { left: "يأكل", right: "To eat" },
                        { left: "يشرب", right: "To drink" },
                        { left: "ينام", right: "To sleep" },
                        { left: "يقرأ", right: "To read" }
                    ],
                    correctMatches: {0: 0, 1: 1, 2: 2, 3: 3},
                    explanation: "يأكل = to eat, يشرب = to drink, ينام = to sleep, يقرأ = to read."
                },

                // 8. FILL IN THE BLANK (Changed from sentence_correction)
                {
                    id: 8,
                    type: "fill_in_blank",
                    question: "Complete the sentence: هي ___ التفاحة (تأكل/يأكل/يأكلون/تأكلون)",
                    correctAnswers: ["تأكل"],
                    explanation: "The correct sentence is: 'هي تأكل التفاحة' (She eats the apple). Verbs must agree with their subjects in gender and number."
                },

                // 9. DRAG & DROP - Root letters
                {
                    id: 9,
                    type: "drag_drop",
                    question: "Identify the root letters of the verb 'يكتب' by dragging them into order:",
                    scrambledWords: ["ك", "ت", "ب"],
                    correctOrder: [1, 2, 3], // ك ت ب
                    hint: "The root of 'يكتب' (he writes) is ك-ت-ب",
                    explanation: "The root letters of 'يكتب' are ك-ت-ب (k-t-b). Most Arabic verbs are based on three-letter roots."
                },

                // 10. MULTIPLE CHOICE
                {
                    id: 10,
                    type: "multiple_choice",
                    question: "Which sentence correctly uses the verb 'يذهب'?",
                    choices: [
                        { value: "أنا أذهب إلى العمل", correct: true },
                        { value: "هو تذهب إلى المدرسة", correct: false },
                        { value: "أنت يذهب إلى البيت", correct: false },
                        { value: "هم أذهب إلى الحديقة", correct: false }
                    ],
                    explanation: "'أنا أذهب إلى العمل' is correct. Verbs must match their subjects: أنا أذهب, هو يذهب, أنت تذهب, هم يذهبون."
                }
            ]
        },
        
        // ADDITIONAL SIMPLE QUIZ WITH ONLY BASIC TYPES
        {
            id: "basic-vocab-1",
            title: "Basic Vocabulary Quiz",
            description: "Test your basic Arabic vocabulary",
            level: "beginner",
            type: "vocab",
            author: "IStories",
            createdAt: "2024-01-20",
            
            questions: [
                // 1. MULTIPLE CHOICE
                {
                    id: 1,
                    type: "multiple_choice",
                    question: "What is the Arabic word for 'house'?",
                    choices: [
                        { value: "بيت", correct: true },
                        { value: "كتاب", correct: false },
                        { value: "مدرسة", correct: false },
                        { value: "سيارة", correct: false }
                    ],
                    explanation: "'بيت' means house. 'كتاب' = book, 'مدرسة' = school, 'سيارة' = car."
                },
                
                // 2. TRUE/FALSE
                {
                    id: 2,
                    type: "true_false",
                    question: "'ماء' means 'food' in Arabic.",
                    choices: [
                        { value: "true", correct: false },
                        { value: "false", correct: true }
                    ],
                    explanation: "False. 'ماء' means 'water'. 'طعام' means 'food'."
                },
                
                // 3. FILL IN THE BLANK
                {
                    id: 3,
                    type: "fill_in_blank",
                    question: "The Arabic word for 'book' is ___.",
                    correctAnswers: ["كتاب"],
                    explanation: "'كتاب' means book. Remember this common word!"
                },
                
                // 4. SHORT ANSWER
                {
                    id: 4,
                    type: "short_answer",
                    question: "What does 'مدرسة' mean in English?",
                    explanation: "'مدرسة' means 'school'. It's where students go to learn."
                },
                
                // 5. MATCHING
                {
                    id: 5,
                    type: "matching",
                    question: "Match the Arabic words with their English translations:",
                    matches: [
                        { left: "قلم", right: "Teacher" },
                        { left: "ورقة", right: "Paper" },
                        { left: "طالب", right: "Student" },
                        { left: "معلم", right: "Pen" }
                    ],
                    correctMatches: {0: 3, 1: 1, 2: 2, 3: 0},
                    explanation: "قلم = pen, ورقة = paper, طالب = student, معلم = teacher."
                },
                
                // 6. DRAG & DROP - Simple sentence
                {
                    id: 6,
                    type: "drag_drop",
                    question: "Arrange the words to make a simple sentence:",
                    scrambledWords: ["الطالب", "يقرأ", "الكتاب"],
                    correctOrder: [1, 2, 3], // "الطالب يقرأ الكتاب"
                    hint: "Subject + verb + object",
                    explanation: "The correct sentence is: 'الطالب يقرأ الكتاب' (The student reads the book)."
                },
                
                // 7. MULTIPLE CHOICE
                {
                    id: 7,
                    type: "multiple_choice",
                    question: "Which word means 'friend' in Arabic?",
                    choices: [
                        { value: "صديق", correct: true },
                        { value: "أخ", correct: false },
                        { value: "أب", correct: false },
                        { value: "جار", correct: false }
                    ],
                    explanation: "'صديق' means friend. 'أخ' = brother, 'أب' = father, 'جار' = neighbor."
                },
                
                // 8. TRUE/FALSE
                {
                    id: 8,
                    type: "true_false",
                    question: "'أخت' means 'sister' in Arabic.",
                    choices: [
                        { value: "true", correct: true },
                        { value: "false", correct: false }
                    ],
                    explanation: "True. 'أخت' means sister. 'أخ' means brother."
                },
                
                // 9. FILL IN THE BLANK
                {
                    id: 9,
                    type: "fill_in_blank",
                    question: "The plural of 'كتاب' (book) is ___.",
                    correctAnswers: ["كتب"],
                    explanation: "'كتب' is the plural of 'كتاب'. It means 'books'."
                },
                
                // 10. SHORT ANSWER
                {
                    id: 10,
                    type: "short_answer",
                    question: "What is the Arabic word for 'family'?",
                    explanation: "'عائلة' or 'أسرة' both mean family in Arabic."
                }
            ]
        }

    ]
};