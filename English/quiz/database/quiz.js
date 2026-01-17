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
      title: "Basic Verbs",
      description: "Learn common Arabic verbs",
      level: "beginner", // beginner | intermediate | advanced
      type: "grammar",   // grammar | vocab | listening
      author: "IStories",
      createdAt: "2024-01-11",

      questions: [
        {
          id: 1,
          type: "multiple_choice",
          question: "What is the translation of 'to eat'?",
          choices: [
            { value: "يأكل", correct: true },
            { value: "يشرب", correct: false },
            { value: "ينام", correct: false },
            { value: "يعمل", correct: false }
          ],
          explanation: "'يأكل' means to eat in Arabic."
        },

        {
          id: 2,
          type: "multiple_choice",
          question: "What does 'يشرب' mean?",
          choices: [
            { value: "To eat", correct: false },
            { value: "To drink", correct: true },
            { value: "To sleep", correct: false },
            { value: "To work", correct: false }
          ],
          explanation: "'يشرب' is to drink in Arabic."
        }
      ]
    }
  ]
};
