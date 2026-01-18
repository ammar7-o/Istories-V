window.quizData = {
  meta: {
    app: "IStories",
    version: "1.0.0",
    lastUpdated: "2024-01-16",
    language: "ar"
  },

  quizzes: [
    {
      id: "verbs-1",
      title: "Basic Verbs - All Question Types",
      description: "Test your Arabic verbs knowledge with different question types",
      level: "beginner", // beginner | intermediate | advanced
      type: "grammar",   // grammar | vocab | listening
      author: "IStories",
      createdAt: "2024-01-16",

      questions: [
        // 1. MULTIPLE CHOICE
        {
          id: 1,
          type: "multiple_choice",
          question: "What is the translation of 'to eat' in Arabic?",
          choices: [
            { value: "يأكل", correct: true },
            { value: "يشرب", correct: false },
            { value: "ينام", correct: false },
            { value: "يعمل", correct: false }
          ],
          explanation: "'يأكل' means 'to eat' in Arabic. The verb is used for consuming food."
        },

        // 2. TRUE/FALSE
        {
          id: 2,
          type: "true_false",
          question: "'يشرب' means 'to work' in Arabic.",
          choices: [
            { value: "true", correct: false },
            { value: "false", correct: true }
          ],
          explanation: "Incorrect. 'يشرب' actually means 'to drink'. 'يعمل' means 'to work'."
        },

        // 3. FILL IN THE BLANK
        {
          id: 3,
          type: "fill_in_blank",
          question: "To say 'I read' in Arabic, you say: أنا ___.",
          correctAnswers: ["أقرأ", "اقرأ", "أقْرَأُ", "اقْرَأْ"],
          explanation: "'أقرأ' is the correct conjugation for 'I read' in Arabic. It's from the root ق-ر-أ (q-r-')."
        },

        // 4. SHORT ANSWER
        {
          id: 4,
          type: "short_answer",
          question: "What does the Arabic verb 'يكتب' mean in English?",
          explanation: "'يكتب' means 'he writes' or 'to write' in Arabic. It's from the root ك-ت-ب (k-t-b)."
        },

        // 5. MATCHING
        {
          id: 5,
          type: "matching",
          question: "Match the Arabic verbs with their English translations:",
          matches: [
            { left: "يذهب", right: "To go" },
            { left: "يجلس", right: "To sit" },
            { left: "يقف", right: "To stand" },
            { left: "يسير", right: "To walk" }
          ],
          correctMatches: {0: 0, 1: 1, 2: 2, 3: 3}, // left index: right index
          explanation: "يذهب = To go, يجلس = To sit, يقف = To stand, يسير = To walk"
        },

        // 6. MULTIPLE CHOICE (with image/audio support example)
        {
          id: 6,
          type: "multiple_choice",
          question: "Which Arabic verb means 'to speak'?",
          choices: [
            { value: "يتكلم", correct: true },
            { value: "يسمع", correct: false },
            { value: "يتعلم", correct: false },
            { value: "يغني", correct: false }
          ],
          explanation: "'يتكلم' means 'to speak'. 'يسمع' = to hear, 'يتعلم' = to learn, 'يغني' = to sing."
        },

        // 7. TRUE/FALSE (with context)
        {
          id: 7,
          type: "true_false",
          question: "In Arabic, the verbs 'يأكل' and 'يشرب' can be used interchangeably.",
          choices: [
            { value: "true", correct: false },
            { value: "false", correct: true }
          ],
          explanation: "False! 'يأكل' means 'to eat' and 'يشرب' means 'to drink'. They are not interchangeable."
        },

        // 8. FILL IN THE BLANK (with multiple blanks example)
        {
          id: 8,
          type: "fill_in_blank",
          question: "The verb 'to understand' in Arabic is ___, and 'to know' is ___.",
          correctAnswers: ["يفهم", "يعرف"],
          explanation: "'يفهم' = to understand, 'يعرف' = to know. Both are common verbs in Arabic."
        },

        // 9. SHORT ANSWER (with specific expected answer)
        {
          id: 9,
          type: "short_answer",
          question: "What is the Arabic verb for 'to see'?",
          explanation: "'يرى' is the verb for 'to see'. The root is ر-ء-ي (r-'-y)."
        },

        // 10. ORDERING QUESTION TYPE (if you want to add this later)
        {
          id: 10,
          type: "multiple_choice",
          question: "Which verb form is used for the present tense 'he eats'?",
          choices: [
            { value: "يأكل", correct: true },
            { value: "أكل", correct: false },
            { value: "سيأكل", correct: false },
            { value: "أكلت", correct: false }
          ],
          explanation: "'يأكل' is the present tense form meaning 'he eats'. 'أكل' is past tense, 'سيأكل' is future, 'أكلت' is 'she ate'."
        }
      ]
    },

    // ADDITIONAL QUIZ WITH DIFFERENT TYPES
    {
      id: "vocab-basics",
      title: "Basic Vocabulary Mix",
      description: "Test basic Arabic vocabulary with various question formats",
      level: "beginner",
      type: "vocab",
      author: "IStories",
      createdAt: "2024-01-16",

      questions: [
        // Multiple Choice
        {
          id: 1,
          type: "multiple_choice",
          question: "How do you say 'house' in Arabic?",
          choices: [
            { value: "بيت", correct: true },
            { value: "سيارة", correct: false },
            { value: "كتاب", correct: false },
            { value: "مدرسة", correct: false }
          ],
          explanation: "'بيت' means house. 'سيارة' = car, 'كتاب' = book, 'مدرسة' = school."
        },

        // True/False
        {
          id: 2,
          type: "true_false",
          question: "'كتاب' means 'pen' in Arabic.",
          choices: [
            { value: "true", correct: false },
            { value: "false", correct: true }
          ],
          explanation: "False. 'كتاب' means 'book'. 'قلم' means 'pen'."
        },

        // Fill in the Blank
        {
          id: 3,
          type: "fill_in_blank",
          question: "The Arabic word for 'water' is ___.",
          correctAnswers: ["ماء", "مياه"],
          explanation: "'ماء' or 'مياه' both mean water in Arabic."
        }
      ]
    },

    // ANOTHER QUIZ FOR ADVANCED LEVEL
    {
      id: "advanced-verbs",
      title: "Advanced Verb Conjugations",
      description: "Test your knowledge of Arabic verb forms and conjugations",
      level: "advanced",
      type: "grammar",
      author: "IStories",
      createdAt: "2024-01-16",

      questions: [
        // Multiple Choice
        {
          id: 1,
          type: "multiple_choice",
          question: "What is the Form II (فعّل) verb for 'to teach' derived from 'علم'?",
          choices: [
            { value: "علّم", correct: true },
            { value: "تعلم", correct: false },
            { value: "أعلم", correct: false },
            { value: "استعلم", correct: false }
          ],
          explanation: "'علّم' is Form II meaning 'to teach'. Form II often gives a causative meaning."
        },

        // True/False
        {
          id: 2,
          type: "true_false",
          question: "Form V (تفعّل) verbs are always reflexive.",
          choices: [
            { value: "true", correct: true },
            { value: "false", correct: false }
          ],
          explanation: "True. Form V verbs (تفعّل) typically have a reflexive or passive meaning."
        },

        // Matching
        {
          id: 3,
          type: "matching",
          question: "Match the verb forms with their typical meanings:",
          matches: [
            { left: "Form I (فعل)", right: "Basic meaning" },
            { left: "Form II (فعّل)", right: "Causative/Intensive" },
            { left: "Form IV (أفعل)", right: "Causative" },
            { left: "Form VII (انفعل)", right: "Reflexive/Passive" }
          ],
          correctMatches: {0: 0, 1: 1, 2: 2, 3: 3},
          explanation: "Form I = basic, Form II = causative/intensive, Form IV = causative, Form VII = reflexive/passive."
        },

        // Short Answer
        {
          id: 4,
          type: "short_answer",
          question: "What is the Form X (استفعل) verb meaning 'to ask'?",
          explanation: "'استعلم' is the Form X verb meaning 'to ask' or 'to inquire'. Form X often has a requestive meaning."
        }
      ]
    }
  ]
};