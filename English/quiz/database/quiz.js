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
          correctMatches: { 0: 0, 1: 1, 2: 2, 3: 3 }, // left index: right index
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
          correctMatches: { 0: 0, 1: 1, 2: 2, 3: 3 },
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
    },

    {
      id: "intro-story-1",
      title: "IStories Introduction - Comprehension Quiz",
      description: "Test your understanding of the IStories introduction story",
      level: "beginner",
      type: "comprehension",
      author: "IStories",
      createdAt: "2024-01-19",
      questions: [
        // 1. MULTIPLE CHOICE
        {
          id: 1,
          type: "multiple_choice",
          question: "Who created the IStories website?",
          choices: [
            { value: "Ammar Chacal", correct: true },
            { value: "A group of teachers", correct: false },
            { value: "A language school", correct: false },
            { value: "An educational company", correct: false }
          ],
          explanation: "The website was created by Ammar Chacal to help people learn languages."
        },

        // 2. TRUE/FALSE
        {
          id: 2,
          type: "true_false",
          question: "IStories has stories for only two learning levels.",
          choices: [
            { value: "true", correct: false },
            { value: "false", correct: true }
          ],
          explanation: "False. IStories has stories for three learning levels: beginner, intermediate, and advanced."
        },

        // 3. FILL IN THE BLANK
        {
          id: 3,
          type: "fill_in_blank",
          question: "IStories helps you learn new vocabulary in _____, which is more effective than memorizing word lists.",
          correctAnswers: ["context", "sentence", "stories", "paragraphs"],
          explanation: "Learning vocabulary in context is much more effective than memorizing word lists."
        },

        // 4. MULTIPLE CHOICE
        {
          id: 4,
          type: "multiple_choice",
          question: "What happens when you click on a word in IStories?",
          choices: [
            { value: "You see its translation and definition", correct: true },
            { value: "The word gets bigger", correct: false },
            { value: "You hear its pronunciation", correct: false },
            { value: "The story stops", correct: false }
          ],
          explanation: "You can click on any word to see its translation and definition."
        },

        // 5. TRUE/FALSE
        {
          id: 5,
          type: "true_false",
          question: "You need to understand every single word when you first read a story.",
          choices: [
            { value: "true", correct: false },
            { value: "false", correct: true }
          ],
          explanation: "False. Don't worry if you don't understand every word at first. Try to understand the general meaning."
        },

        // 6. SHORT ANSWER
        {
          id: 6,
          type: "short_answer",
          question: "What is recommended for making progress in language learning?",
          explanation: "Consistent practice is recommended. Reading one story each day and reviewing vocabulary helps."
        },

        // 7. MULTIPLE CHOICE
        {
          id: 7,
          type: "multiple_choice",
          question: "What is one of the best ways to improve language skills according to the story?",
          choices: [
            { value: "Reading regularly", correct: true },
            { value: "Watching TV shows", correct: false },
            { value: "Taking grammar tests", correct: false },
            { value: "Memorizing dictionaries", correct: false }
          ],
          explanation: "Reading regularly is one of the best ways to improve your language skills."
        },

        // 8. MATCHING
        {
          id: 8,
          type: "matching",
          question: "Match the story features with their benefits:",
          matches: [
            { left: "Click-to-translate feature", right: "Helps learn vocabulary in context" },
            { left: "Different story genres", right: "Encounters different vocabulary types" },
            { left: "Three learning levels", right: "Suitable for all learners" },
            { left: "Daily reading recommendation", right: "Builds consistent practice" }
          ],
          correctMatches: { 0: 0, 1: 1, 2: 2, 3: 3 },
          explanation: "Each feature has a specific benefit for language learning."
        },

        // 9. TRUE/FALSE
        {
          id: 9,
          type: "true_false",
          question: "The stories cover only adventure genres.",
          choices: [
            { value: "true", correct: false },
            { value: "false", correct: true }
          ],
          explanation: "False. The stories cover various topics and genres, from everyday situations to exciting adventures."
        },

        // 10. MULTIPLE CHOICE
        {
          id: 10,
          type: "multiple_choice",
          question: "What should you focus on first when reading a story?",
          choices: [
            { value: "The general meaning of each paragraph", correct: true },
            { value: "Every grammar rule", correct: false },
            { value: "Perfect pronunciation", correct: false },
            { value: "Translating every word", correct: false }
          ],
          explanation: "Focus on understanding the general meaning first, not every single word or grammar rule."
        }
      ]
    },
    {
      id: "intro-vocab-1",
      title: "IStories Introduction - Vocabulary Quiz",
      description: "Test vocabulary from the IStories introduction story",
      level: "beginner",
      type: "vocab",
      author: "IStories",
      createdAt: "2024-01-19",
      questions: [
        // 1. MULTIPLE CHOICE
        {
          id: 1,
          type: "multiple_choice",
          question: "What does 'interactive' mean in the context of IStories?",
          choices: [
            { value: "You can click on words and interact with the story", correct: true },
            { value: "The stories have pictures", correct: false },
            { value: "You can write your own stories", correct: false },
            { value: "The stories have sound", correct: false }
          ],
          explanation: "'Interactive' means you can click on words to see translations and definitions."
        },

        // 2. FILL IN THE BLANK
        {
          id: 2,
          type: "fill_in_blank",
          question: "Reading _____ is one of the best ways to improve language skills.",
          correctAnswers: ["regularly", "daily", "often", "frequently"],
          explanation: "Reading regularly helps build consistent practice and improve skills."
        },

        // 3. TRUE/FALSE
        {
          id: 3,
          type: "true_false",
          question: "'Engaging' means boring and uninteresting.",
          choices: [
            { value: "true", correct: false },
            { value: "false", correct: true }
          ],
          explanation: "False. 'Engaging' means interesting and enjoyable, holding your attention."
        },

        // 4. MULTIPLE CHOICE
        {
          id: 4,
          type: "multiple_choice",
          question: "What does 'comprehension' mean?",
          choices: [
            { value: "Understanding", correct: true },
            { value: "Reading", correct: false },
            { value: "Writing", correct: false },
            { value: "Speaking", correct: false }
          ],
          explanation: "'Comprehension' means understanding or the ability to understand something."
        },

        // 5. SHORT ANSWER
        {
          id: 5,
          type: "short_answer",
          question: "What is the meaning of 'narratives'?",
          explanation: "'Narratives' means stories or accounts of events. In IStories, it refers to the stories you read."
        },

        // 6. MATCHING
        {
          id: 6,
          type: "matching",
          question: "Match the vocabulary words with their meanings:",
          matches: [
            { left: "Vocabulary", right: "Words used in a language" },
            { left: "Journey", right: "A long process of learning" },
            { left: "Progress", right: "Improvement or development" },
            { left: "Structure", right: "The way something is organized" }
          ],
          correctMatches: { 0: 0, 1: 1, 2: 2, 3: 3 },
          explanation: "These words are important for understanding language learning concepts."
        },

        // 7. MULTIPLE CHOICE
        {
          id: 7,
          type: "multiple_choice",
          question: "What does 'genre' mean?",
          choices: [
            { value: "A category or type of story", correct: true },
            { value: "A language level", correct: false },
            { value: "A learning method", correct: false },
            { value: "A vocabulary list", correct: false }
          ],
          explanation: "'Genre' means a category or type, like adventure stories, everyday situations, etc."
        },

        // 8. TRUE/FALSE
        {
          id: 8,
          type: "true_false",
          question: "'Consistent' means doing something only when you feel like it.",
          choices: [
            { value: "true", correct: false },
            { value: "false", correct: true }
          ],
          explanation: "False. 'Consistent' means doing something regularly and steadily over time."
        },

        // 9. FILL IN THE BLANK
        {
          id: 9,
          type: "fill_in_blank",
          question: "Learning a language takes time and _____.",
          correctAnswers: ["patience"],
          explanation: "You need patience when learning a language because it doesn't happen overnight."
        },

        // 10. MULTIPLE CHOICE
        {
          id: 10,
          type: "multiple_choice",
          question: "What does 'feature' mean in the context of IStories?",
          choices: [
            { value: "A special characteristic or function", correct: true },
            { value: "A story character", correct: false },
            { value: "A language level", correct: false },
            { value: "A grammar rule", correct: false }
          ],
          explanation: "'Feature' refers to special characteristics like click-to-translate or different levels."
        }
      ]
    },
    {
      id: "intro-grammar-1",
      title: "IStories Introduction - Simple Grammar",
      description: "Practice simple grammar from the introduction story",
      level: "beginner",
      type: "grammar",
      author: "IStories",
      createdAt: "2024-01-19",
      questions: [
        // 1. MULTIPLE CHOICE - Simple present tense
        {
          id: 1,
          type: "multiple_choice",
          question: "Which sentence uses the simple present tense correctly?",
          choices: [
            { value: "IStories helps people learn languages", correct: true },
            { value: "IStories helped people learn languages", correct: false },
            { value: "IStories will help people learn languages", correct: false },
            { value: "IStories helping people learn languages", correct: false }
          ],
          explanation: "'helps' is simple present tense, showing a current, ongoing fact."
        },

        // 2. TRUE/FALSE - Article usage
        {
          id: 2,
          type: "true_false",
          question: "We should say: 'This is website for learning languages.'",
          choices: [
            { value: "true", correct: false },
            { value: "false", correct: true }
          ],
          explanation: "False. It should be: 'This is a website for learning languages.' We need the article 'a'."
        },

        // 3. FILL IN THE BLANK - Prepositions
        {
          id: 3,
          type: "fill_in_blank",
          question: "The website was created _____ Ammar Chacal.",
          correctAnswers: ["by"],
          explanation: "We use 'by' to show who created or did something."
        },

        // 4. MULTIPLE CHOICE - Plural forms
        {
          id: 4,
          type: "multiple_choice",
          question: "What is the correct plural form?",
          choices: [
            { value: "Different learning levels", correct: true },
            { value: "Different learnings levels", correct: false },
            { value: "Different learning level", correct: false },
            { value: "Different learn level", correct: false }
          ],
          explanation: "'levels' is the plural of 'level'. 'Learning' is an adjective here, so it doesn't change."
        },

        // 5. TRUE/FALSE - Sentence structure
        {
          id: 5,
          type: "true_false",
          question: "This is a correct sentence: 'Reading regularly is one of the best ways improve your language skills.'",
          choices: [
            { value: "true", correct: false },
            { value: "false", correct: true }
          ],
          explanation: "False. It should be: 'to improve' or 'for improving'. We need 'to' before the verb."
        },

        // 6. MATCHING - Word forms
        {
          id: 6,
          type: "matching",
          question: "Match the base word with its correct form:",
          matches: [
            { left: "learn", right: "learning" },
            { left: "read", right: "reading" },
            { left: "understand", right: "understanding" },
            { left: "practice", right: "practice" }
          ],
          correctMatches: { 0: 0, 1: 1, 2: 2, 3: 3 },
          explanation: "These are the -ing forms (gerunds) used in the story, except 'practice' which can be both verb and noun."
        },

        // 7. SHORT ANSWER - Simple sentence
        {
          id: 7,
          type: "short_answer",
          question: "Complete this simple sentence: 'Each story _____ designed for different levels.'",
          explanation: "The correct word is 'is'. 'Each story is designed for different levels.'"
        },

        // 8. MULTIPLE CHOICE - Adjective position
        {
          id: 8,
          type: "multiple_choice",
          question: "Which is the correct adjective position?",
          choices: [
            { value: "Simple words and short sentences", correct: true },
            { value: "Words simple and sentences short", correct: false },
            { value: "Simple words and sentences short", correct: false },
            { value: "Words and sentences simple short", correct: false }
          ],
          explanation: "In English, adjectives usually come before the noun they describe."
        },

        // 9. TRUE/FALSE - Verb agreement
        {
          id: 9,
          type: "true_false",
          question: "This is correct: 'The stories covers various topics.'",
          choices: [
            { value: "true", correct: false },
            { value: "false", correct: true }
          ],
          explanation: "False. It should be: 'The stories cover various topics.' 'Cover' agrees with plural 'stories'."
        },

        // 10. FILL IN THE BLANK - Conjunction
        {
          id: 10,
          type: "fill_in_blank",
          question: "Don't worry _____ you don't understand every word.",
          correctAnswers: ["if", "when"],
          explanation: "We use 'if' or 'when' to connect these ideas. Both are correct in this context."
        }
      ]
    }

  ]
};