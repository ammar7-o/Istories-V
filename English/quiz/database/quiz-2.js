window.quizData = {
  meta: {
    app: "IStories",
    version: "1.0.0",
    lastUpdated: "2024-01-16",
    language: "ar",
    totalQuizzes: 15,
    totalQuestions: 85
  },

  quizzes: [
    {
      id: "verbs-1",
      title: "Basic Verbs",
      description: "Learn common Arabic verbs",
      level: "beginner",
      type: "grammar",
      author: "IStories",
      createdAt: "2024-01-11",
      questions: 5,
      estimatedTime: 3,
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
        },
        {
          id: 3,
          type: "multiple_choice",
          question: "Which verb means 'to sleep'?",
          choices: [
            { value: "يأكل", correct: false },
            { value: "يشرب", correct: false },
            { value: "ينام", correct: true },
            { value: "يقرأ", correct: false }
          ],
          explanation: "'ينام' means to sleep in Arabic."
        },
        {
          id: 4,
          type: "multiple_choice",
          question: "What is the translation of 'to work'?",
          choices: [
            { value: "يلعب", correct: false },
            { value: "يعمل", correct: true },
            { value: "يكتب", correct: false },
            { value: "يذهب", correct: false }
          ],
          explanation: "'يعمل' means to work in Arabic."
        },
        {
          id: 5,
          type: "multiple_choice",
          question: "Which verb means 'to read'?",
          choices: [
            { value: "يقرأ", correct: true },
            { value: "يكتب", correct: false },
            { value: "يتكلم", correct: false },
            { value: "يسمع", correct: false }
          ],
          explanation: "'يقرأ' means to read in Arabic."
        }
      ]
    },

    {
      id: "vocab-1",
      title: "Everyday Vocabulary",
      description: "Basic Arabic vocabulary for daily life",
      level: "beginner",
      type: "vocab",
      author: "IStories",
      createdAt: "2024-01-12",
      questions: 5,
      estimatedTime: 3,
      questions: [
        {
          id: 1,
          type: "multiple_choice",
          question: "What does 'كتاب' mean?",
          choices: [
            { value: "Book", correct: true },
            { value: "Pen", correct: false },
            { value: "Table", correct: false },
            { value: "Chair", correct: false }
          ],
          explanation: "'كتاب' means book in Arabic."
        },
        {
          id: 2,
          type: "multiple_choice",
          question: "What is the Arabic word for 'house'?",
          choices: [
            { value: "مدرسة", correct: false },
            { value: "بيت", correct: true },
            { value: "سيارة", correct: false },
            { value: "شجرة", correct: false }
          ],
          explanation: "'بيت' means house in Arabic."
        },
        {
          id: 3,
          type: "multiple_choice",
          question: "What does 'ماء' mean?",
          choices: [
            { value: "Fire", correct: false },
            { value: "Water", correct: true },
            { value: "Air", correct: false },
            { value: "Earth", correct: false }
          ],
          explanation: "'ماء' means water in Arabic."
        },
        {
          id: 4,
          type: "multiple_choice",
          question: "Which word means 'food'?",
          choices: [
            { value: "شراب", correct: false },
            { value: "طعام", correct: true },
            { value: "ملابس", correct: false },
            { value: "أثاث", correct: false }
          ],
          explanation: "'طعام' means food in Arabic."
        },
        {
          id: 5,
          type: "multiple_choice",
          question: "What is the translation of 'friend'?",
          choices: [
            { value: "صديق", correct: true },
            { value: "أخ", correct: false },
            { value: "جار", correct: false },
            { value: "زميل", correct: false }
          ],
          explanation: "'صديق' means friend in Arabic."
        }
      ]
    },

    {
      id: "greetings-1",
      title: "Greetings & Introductions",
      description: "Learn common Arabic greetings",
      level: "beginner",
      type: "conversation",
      author: "IStories",
      createdAt: "2024-01-13",
      questions: 5,
      estimatedTime: 3,
      questions: [
        {
          id: 1,
          type: "multiple_choice",
          question: "How do you say 'Hello' in Arabic?",
          choices: [
            { value: "مرحبا", correct: true },
            { value: "شكرا", correct: false },
            { value: "مع السلامة", correct: false },
            { value: "صباح الخير", correct: false }
          ],
          explanation: "'مرحبا' is a common greeting in Arabic."
        },
        {
          id: 2,
          type: "multiple_choice",
          question: "What does 'صباح الخير' mean?",
          choices: [
            { value: "Good evening", correct: false },
            { value: "Good morning", correct: true },
            { value: "Good night", correct: false },
            { value: "Good afternoon", correct: false }
          ],
          explanation: "'صباح الخير' means Good morning."
        },
        {
          id: 3,
          type: "multiple_choice",
          question: "How do you say 'Thank you'?",
          choices: [
            { value: "من فضلك", correct: false },
            { value: "عفوا", correct: false },
            { value: "شكرا", correct: true },
            { value: "لو سمحت", correct: false }
          ],
          explanation: "'شكرا' means Thank you in Arabic."
        },
        {
          id: 4,
          type: "multiple_choice",
          question: "What is the response to 'شكرا'?",
          choices: [
            { value: "عفوا", correct: true },
            { value: "من فضلك", correct: false },
            { value: "مع السلامة", correct: false },
            { value: "أهلا وسهلا", correct: false }
          ],
          explanation: "'عفوا' is the common response to Thank you."
        },
        {
          id: 5,
          type: "multiple_choice",
          question: "How do you say 'Goodbye'?",
          choices: [
            { value: "أهلا", correct: false },
            { value: "مع السلامة", correct: true },
            { value: "مرحبا", correct: false },
            { value: "صباح الخير", correct: false }
          ],
          explanation: "'مع السلامة' means Goodbye in Arabic."
        }
      ]
    },

    {
      id: "grammar-1",
      title: "Basic Grammar",
      description: "Introduction to Arabic grammar rules",
      level: "beginner",
      type: "grammar",
      author: "IStories",
      createdAt: "2024-01-14",
      questions: 5,
      estimatedTime: 4,
      questions: [
        {
          id: 1,
          type: "multiple_choice",
          question: "Which word is masculine?",
          choices: [
            { value: "كتاب", correct: true },
            { value: "سيارة", correct: false },
            { value: "شجرة", correct: false },
            { value: "وردة", correct: false }
          ],
          explanation: "'كتاب' (book) is masculine in Arabic."
        },
        {
          id: 2,
          type: "multiple_choice",
          question: "Which word is feminine?",
          choices: [
            { value: "قلم", correct: false },
            { value: "منزل", correct: false },
            { value: "مدرسة", correct: true },
            { value: "كرسي", correct: false }
          ],
          explanation: "'مدرسة' (school) is feminine in Arabic."
        },
        {
          id: 3,
          type: "multiple_choice",
          question: "How do you make a word definite in Arabic?",
          choices: [
            { value: "Add 'ال' at the beginning", correct: true },
            { value: "Add 'ة' at the end", correct: false },
            { value: "Add 'ون' at the end", correct: false },
            { value: "Add 'ي' at the beginning", correct: false }
          ],
          explanation: "The definite article 'ال' makes a word definite."
        },
        {
          id: 4,
          type: "multiple_choice",
          question: "Which is the plural of 'كتاب'?",
          choices: [
            { value: "كتب", correct: true },
            { value: "كتابات", correct: false },
            { value: "كتوب", correct: false },
            { value: "كتيبات", correct: false }
          ],
          explanation: "'كتب' is the plural of 'كتاب'."
        },
        {
          id: 5,
          type: "multiple_choice",
          question: "What is the dual form in Arabic used for?",
          choices: [
            { value: "Exactly two things", correct: true },
            { value: "More than two things", correct: false },
            { value: "One thing", correct: false },
            { value: "Uncountable things", correct: false }
          ],
          explanation: "Arabic has a special dual form for exactly two items."
        }
      ]
    },

    {
      id: "numbers-1",
      title: "Numbers 1-20",
      description: "Learn Arabic numbers from 1 to 20",
      level: "beginner",
      type: "vocab",
      author: "IStories",
      createdAt: "2024-01-15",
      questions: 5,
      estimatedTime: 3,
      questions: [
        {
          id: 1,
          type: "multiple_choice",
          question: "What is the Arabic word for 'one'?",
          choices: [
            { value: "واحد", correct: true },
            { value: "اثنان", correct: false },
            { value: "ثلاثة", correct: false },
            { value: "أربعة", correct: false }
          ],
          explanation: "'واحد' means one in Arabic."
        },
        {
          id: 2,
          type: "multiple_choice",
          question: "How do you say 'five' in Arabic?",
          choices: [
            { value: "ثلاثة", correct: false },
            { value: "أربعة", correct: false },
            { value: "خمسة", correct: true },
            { value: "ستة", correct: false }
          ],
          explanation: "'خمسة' means five in Arabic."
        },
        {
          id: 3,
          type: "multiple_choice",
          question: "What does 'عشرة' mean?",
          choices: [
            { value: "Seven", correct: false },
            { value: "Eight", correct: false },
            { value: "Nine", correct: false },
            { value: "Ten", correct: true }
          ],
          explanation: "'عشرة' means ten in Arabic."
        },
        {
          id: 4,
          type: "multiple_choice",
          question: "Which number is 'خمسة عشر'?",
          choices: [
            { value: "12", correct: false },
            { value: "13", correct: false },
            { value: "15", correct: true },
            { value: "16", correct: false }
          ],
          explanation: "'خمسة عشر' means fifteen."
        },
        {
          id: 5,
          type: "multiple_choice",
          question: "What is the Arabic for 'twenty'?",
          choices: [
            { value: "عشرون", correct: true },
            { value: "تسعة عشر", correct: false },
            { value: "ثمانية عشر", correct: false },
            { value: "سبعة عشر", correct: false }
          ],
          explanation: "'عشرون' means twenty in Arabic."
        }
      ]
    },

    {
      id: "intermediate-verbs",
      title: "Intermediate Verbs",
      description: "More complex Arabic verb conjugations",
      level: "intermediate",
      type: "grammar",
      author: "IStories",
      createdAt: "2024-01-16",
      questions: 6,
      estimatedTime: 5,
      questions: [
        {
          id: 1,
          type: "multiple_choice",
          question: "What is the past tense of 'يذهب' (to go)?",
          choices: [
            { value: "ذهب", correct: true },
            { value: "يذهب", correct: false },
            { value: "سيذهب", correct: false },
            { value: "اذهب", correct: false }
          ],
          explanation: "'ذهب' is the past tense of to go."
        },
        {
          id: 2,
          type: "multiple_choice",
          question: "Which is the future tense of 'يكتب'?",
          choices: [
            { value: "كتب", correct: false },
            { value: "يكتب", correct: false },
            { value: "سيكتب", correct: true },
            { value: "اكتب", correct: false }
          ],
          explanation: "'سيكتب' means he will write."
        },
        {
          id: 3,
          type: "multiple_choice",
          question: "What is the command form of 'يسمع'?",
          choices: [
            { value: "سمع", correct: false },
            { value: "يسمع", correct: false },
            { value: "اسمع", correct: true },
            { value: "سيسمع", correct: false }
          ],
          explanation: "'اسمع' means listen! (command form)."
        },
        {
          id: 4,
          type: "multiple_choice",
          question: "Which verb form indicates continuous action?",
          choices: [
            { value: "Past tense", correct: false },
            { value: "Present tense", correct: true },
            { value: "Future tense", correct: false },
            { value: "Command form", correct: false }
          ],
          explanation: "Present tense verbs indicate ongoing or habitual actions."
        },
        {
          id: 5,
          type: "multiple_choice",
          question: "How do you say 'they (f) wrote'?",
          choices: [
            { value: "كتبن", correct: true },
            { value: "كتبوا", correct: false },
            { value: "كتب", correct: false },
            { value: "كتبت", correct: false }
          ],
          explanation: "'كتبن' is the past tense for feminine plural."
        },
        {
          id: 6,
          type: "multiple_choice",
          question: "What does 'سأذهب' mean?",
          choices: [
            { value: "I went", correct: false },
            { value: "I go", correct: false },
            { value: "I will go", correct: true },
            { value: "Go!", correct: false }
          ],
          explanation: "'سأذهب' means I will go."
        }
      ]
    },

    {
      id: "food-vocab",
      title: "Food & Dining",
      description: "Arabic vocabulary related to food and restaurants",
      level: "intermediate",
      type: "vocab",
      author: "IStories",
      createdAt: "2024-01-17",
      questions: 6,
      estimatedTime: 4,
      questions: [
        {
          id: 1,
          type: "multiple_choice",
          question: "What does 'مطعم' mean?",
          choices: [
            { value: "Restaurant", correct: true },
            { value: "Kitchen", correct: false },
            { value: "Market", correct: false },
            { value: "Hotel", correct: false }
          ],
          explanation: "'مطعم' means restaurant."
        },
        {
          id: 2,
          type: "multiple_choice",
          question: "What is 'لحم'?",
          choices: [
            { value: "Vegetable", correct: false },
            { value: "Fruit", correct: false },
            { value: "Meat", correct: true },
            { value: "Bread", correct: false }
          ],
          explanation: "'لحم' means meat."
        },
        {
          id: 3,
          type: "multiple_choice",
          question: "Which word means 'vegetables'?",
          choices: [
            { value: "فواكه", correct: false },
            { value: "خضروات", correct: true },
            { value: "حلويات", correct: false },
            { value: "مشروبات", correct: false }
          ],
          explanation: "'خضروات' means vegetables."
        },
        {
          id: 4,
          type: "multiple_choice",
          question: "What does 'فاتورة' mean?",
          choices: [
            { value: "Menu", correct: false },
            { value: "Bill", correct: true },
            { value: "Table", correct: false },
            { value: "Order", correct: false }
          ],
          explanation: "'فاتورة' means bill or invoice."
        },
        {
          id: 5,
          type: "multiple_choice",
          question: "How do you say 'I'm hungry'?",
          choices: [
            { value: "أنا عطشان", correct: false },
            { value: "أنا جائع", correct: true },
            { value: "أنا متعب", correct: false },
            { value: "أنا سعيد", correct: false }
          ],
          explanation: "'أنا جائع' means I'm hungry."
        },
        {
          id: 6,
          type: "multiple_choice",
          question: "What is 'ماء معدني'?",
          choices: [
            { value: "Mineral water", correct: true },
            { value: "Fresh water", correct: false },
            { value: "Hot water", correct: false },
            { value: "Cold water", correct: false }
          ],
          explanation: "'ماء معدني' means mineral water."
        }
      ]
    },

    {
      id: "family-vocab",
      title: "Family & Relationships",
      description: "Arabic terms for family members and relationships",
      level: "intermediate",
      type: "vocab",
      author: "IStories",
      createdAt: "2024-01-18",
      questions: 6,
      estimatedTime: 4,
      questions: [
        {
          id: 1,
          type: "multiple_choice",
          question: "What does 'أب' mean?",
          choices: [
            { value: "Mother", correct: false },
            { value: "Father", correct: true },
            { value: "Brother", correct: false },
            { value: "Sister", correct: false }
          ],
          explanation: "'أب' means father."
        },
        {
          id: 2,
          type: "multiple_choice",
          question: "What is the Arabic word for 'mother'?",
          choices: [
            { value: "أم", correct: true },
            { value: "ابن", correct: false },
            { value: "بنت", correct: false },
            { value: "زوج", correct: false }
          ],
          explanation: "'أم' means mother."
        },
        {
          id: 3,
          type: "multiple_choice",
          question: "How do you say 'brother'?",
          choices: [
            { value: "أخت", correct: false },
            { value: "أخ", correct: true },
            { value: "ابن", correct: false },
            { value: "عم", correct: false }
          ],
          explanation: "'أخ' means brother."
        },
        {
          id: 4,
          type: "multiple_choice",
          question: "What does 'زوج' mean?",
          choices: [
            { value: "Husband", correct: true },
            { value: "Wife", correct: false },
            { value: "Son", correct: false },
            { value: "Daughter", correct: false }
          ],
          explanation: "'زوج' means husband."
        },
        {
          id: 5,
          type: "multiple_choice",
          question: "Which word means 'grandfather'?",
          choices: [
            { value: "جد", correct: true },
            { value: "جدة", correct: false },
            { value: "حفيد", correct: false },
            { value: "عم", correct: false }
          ],
          explanation: "'جد' means grandfather."
        },
        {
          id: 6,
          type: "multiple_choice",
          question: "What is 'عائلة'?",
          choices: [
            { value: "Family", correct: true },
            { value: "Friend", correct: false },
            { value: "House", correct: false },
            { value: "Country", correct: false }
          ],
          explanation: "'عائلة' means family."
        }
      ]
    },

    {
      id: "advanced-grammar",
      title: "Advanced Grammar",
      description: "Complex Arabic grammar structures and rules",
      level: "advanced",
      type: "grammar",
      author: "IStories",
      createdAt: "2024-01-19",
      questions: 7,
      estimatedTime: 6,
      questions: [
        {
          id: 1,
          type: "multiple_choice",
          question: "What is the الاسم الموصول (relative pronoun)?",
          choices: [
            { value: "الذي، التي، اللذان...", correct: true },
            { value: "هذا، هذه، هؤلاء", correct: false },
            { value: "أنا، أنت، هو", correct: false },
            { value: "في، على، من", correct: false }
          ],
          explanation: "الاسم الموصول includes الذي، التي، اللذان for relative clauses."
        },
        {
          id: 2,
          type: "multiple_choice",
          question: "What is الإضافة (genitive construction)?",
          choices: [
            { value: "Possessive relationship between two nouns", correct: true },
            { value: "Verb conjugation", correct: false },
            { value: "Sentence negation", correct: false },
            { value: "Question formation", correct: false }
          ],
          explanation: "الإضافة shows possession between nouns (كتاب الطالب)."
        },
        {
          id: 3,
          type: "multiple_choice",
          question: "What is المبتدأ والخبر?",
          choices: [
            { value: "Subject and predicate in nominal sentence", correct: true },
            { value: "Verb and object", correct: false },
            { value: "Question and answer", correct: false },
            { value: "Main and subordinate clause", correct: false }
          ],
          explanation: "المبتدأ is subject, الخبر is predicate in nominal sentences."
        },
        {
          id: 4,
          type: "multiple_choice",
          question: "What is الفاعل?",
          choices: [
            { value: "Subject of a verbal sentence", correct: true },
            { value: "Object of a verb", correct: false },
            { value: "Time expression", correct: false },
            { value: "Location expression", correct: false }
          ],
          explanation: "الفاعل is the doer of the action in verbal sentences."
        },
        {
          id: 5,
          type: "multiple_choice",
          question: "What does مجرور mean?",
          choices: [
            { value: "Noun in genitive case after preposition", correct: true },
            { value: "Verb in past tense", correct: false },
            { value: "Adjective describing noun", correct: false },
            { value: "Question word", correct: false }
          ],
          explanation: "مجرور nouns take kasra after prepositions."
        },
        {
          id: 6,
          type: "multiple_choice",
          question: "What is نعت?",
          choices: [
            { value: "Adjective that follows and describes a noun", correct: true },
            { value: "Verb that follows another verb", correct: false },
            { value: "Noun that follows a preposition", correct: false },
            { value: "Adverb modifying a verb", correct: false }
          ],
          explanation: "نعت is an adjective that agrees with the noun it describes."
        },
        {
          id: 7,
          type: "multiple_choice",
          question: "What is الحال?",
          choices: [
            { value: "Circumstantial accusative describing action", correct: true },
            { value: "Direct object of verb", correct: false },
            { value: "Subject of sentence", correct: false },
            { value: "Time expression", correct: false }
          ],
          explanation: "الحال describes the circumstance of an action (جاء راكبا)."
        }
      ]
    },

    {
      id: "business-arabic",
      title: "Business Arabic",
      description: "Vocabulary for business and professional contexts",
      level: "advanced",
      type: "vocab",
      author: "IStories",
      createdAt: "2024-01-20",
      questions: 7,
      estimatedTime: 6,
      questions: [
        {
          id: 1,
          type: "multiple_choice",
          question: "What does 'شركة' mean?",
          choices: [
            { value: "Company", correct: true },
            { value: "Market", correct: false },
            { value: "Product", correct: false },
            { value: "Service", correct: false }
          ],
          explanation: "'شركة' means company or corporation."
        },
        {
          id: 2,
          type: "multiple_choice",
          question: "What is 'استثمار'?",
          choices: [
            { value: "Investment", correct: true },
            { value: "Loan", correct: false },
            { value: "Profit", correct: false },
            { value: "Loss", correct: false }
          ],
          explanation: "'استثمار' means investment."
        },
        {
          id: 3,
          type: "multiple_choice",
          question: "How do you say 'contract' in Arabic?",
          choices: [
            { value: "عقد", correct: true },
            { value: "وثيقة", correct: false },
            { value: "اتفاق", correct: false },
            { value: "صفقة", correct: false }
          ],
          explanation: "'عقد' means contract."
        },
        {
          id: 4,
          type: "multiple_choice",
          question: "What does 'توقيع' mean?",
          choices: [
            { value: "Signature", correct: true },
            { value: "Meeting", correct: false },
            { value: "Agreement", correct: false },
            { value: "Payment", correct: false }
          ],
          explanation: "'توقيع' means signature."
        },
        {
          id: 5,
          type: "multiple_choice",
          question: "Which word means 'negotiation'?",
          choices: [
            { value: "مفاوضة", correct: true },
            { value: "مناقشة", correct: false },
            { value: "محادثة", correct: false },
            { value: "مراسلة", correct: false }
          ],
          explanation: "'مفاوضة' means negotiation."
        },
        {
          id: 6,
          type: "multiple_choice",
          question: "What is 'رأس مال'?",
          choices: [
            { value: "Capital", correct: true },
            { value: "Profit", correct: false },
            { value: "Revenue", correct: false },
            { value: "Expense", correct: false }
          ],
          explanation: "'رأس مال' means capital or investment capital."
        },
        {
          id: 7,
          type: "multiple_choice",
          question: "How do you say 'marketing'?",
          choices: [
            { value: "تسويق", correct: true },
            { value: "إعلان", correct: false },
            { value: "بيع", correct: false },
            { value: "شراء", correct: false }
          ],
          explanation: "'تسويق' means marketing."
        }
      ]
    },

    {
      id: "media-vocab",
      title: "Media & Technology",
      description: "Modern Arabic vocabulary for media and tech",
      level: "advanced",
      type: "vocab",
      author: "IStories",
      createdAt: "2024-01-21",
      questions: 7,
      estimatedTime: 6,
      questions: [
        {
          id: 1,
          type: "multiple_choice",
          question: "What does 'إنترنت' mean?",
          choices: [
            { value: "Internet", correct: true },
            { value: "Computer", correct: false },
            { value: "Network", correct: false },
            { value: "Website", correct: false }
          ],
          explanation: "'إنترنت' is the Arabic transliteration for Internet."
        },
        {
          id: 2,
          type: "multiple_choice",
          question: "How do you say 'smartphone' in Arabic?",
          choices: [
            { value: "هاتف ذكي", correct: true },
            { value: "حاسوب", correct: false },
            { value: "لوحي", correct: false },
            { value: "جوال", correct: false }
          ],
          explanation: "'هاتف ذكي' literally means smart phone."
        },
        {
          id: 3,
          type: "multiple_choice",
          question: "What is 'تطبيق'?",
          choices: [
            { value: "Application (app)", correct: true },
            { value: "Program", correct: false },
            { value: "Software", correct: false },
            { value: "System", correct: false }
          ],
          explanation: "'تطبيق' means application or app."
        },
        {
          id: 4,
          type: "multiple_choice",
          question: "What does 'وسائل التواصل الاجتماعي' mean?",
          choices: [
            { value: "Social media", correct: true },
            { value: "Traditional media", correct: false },
            { value: "Mass media", correct: false },
            { value: "Digital media", correct: false }
          ],
          explanation: "This phrase literally means 'means of social communication'."
        },
        {
          id: 5,
          type: "multiple_choice",
          question: "How do you say 'website'?",
          choices: [
            { value: "موقع إلكتروني", correct: true },
            { value: "صفحة ويب", correct: false },
            { value: "شبكة", correct: false },
            { value: "منصة", correct: false }
          ],
          explanation: "'موقع إلكتروني' means electronic site/website."
        },
        {
          id: 6,
          type: "multiple_choice",
          question: "What is 'بريد إلكتروني'?",
          choices: [
            { value: "Email", correct: true },
            { value: "Text message", correct: false },
            { value: "Chat", correct: false },
            { value: "Voicemail", correct: false }
          ],
          explanation: "'بريد إلكتروني' means electronic mail/email."
        },
        {
          id: 7,
          type: "multiple_choice",
          question: "What does 'حوسبة سحابية' mean?",
          choices: [
            { value: "Cloud computing", correct: true },
            { value: "Data storage", correct: false },
            { value: "Networking", correct: false },
            { value: "Programming", correct: false }
          ],
          explanation: "This is the translation for cloud computing."
        }
      ]
    },

    {
      id: "idioms-1",
      title: "Arabic Idioms",
      description: "Common Arabic idioms and expressions",
      level: "advanced",
      type: "culture",
      author: "IStories",
      createdAt: "2024-01-22",
      questions: 7,
      estimatedTime: 6,
      questions: [
        {
          id: 1,
          type: "multiple_choice",
          question: "What does 'رمى بيضة اليوم ونسي البيضة أمبارح' mean?",
          choices: [
            { value: "He acts as if he's new to this", correct: true },
            { value: "He's very experienced", correct: false },
            { value: "He's forgetful", correct: false },
            { value: "He's honest", correct: false }
          ],
          explanation: "Literally: 'He threw an egg today and forgot yesterday's egg' - pretending to be new."
        },
        {
          id: 2,
          type: "multiple_choice",
          question: "What is the meaning of 'ماء الوجه'?",
          choices: [
            { value: "Face/dignity/honor", correct: true },
            { value: "Tears", correct: false },
            { value: "Sweat", correct: false },
            { value: "Makeup", correct: false }
          ],
          explanation: "Literally 'water of the face' means dignity or honor."
        },
        {
          id: 3,
          type: "multiple_choice",
          question: "What does 'طلع من المصفاة زي الفل' mean?",
          choices: [
            { value: "Came out perfectly", correct: true },
            { value: "Made a mess", correct: false },
            { value: "Was filtered", correct: false },
            { value: "Disappeared", correct: false }
          ],
          explanation: "Literally: 'Came out of the sieve like jasmine' - perfect result."
        },
        {
          id: 4,
          type: "multiple_choice",
          question: "What is 'يقطع الليل بالنهار'?",
          choices: [
            { value: "Works day and night", correct: true },
            { value: "Confuses time", correct: false },
            { value: "Sleeps all day", correct: false },
            { value: "Travels constantly", correct: false }
          ],
          explanation: "Literally: 'Cuts night with day' - works tirelessly."
        },
        {
          id: 5,
          type: "multiple_choice",
          question: "What does 'زي ما تدين تدان' mean?",
          choices: [
            { value: "As you sow, so shall you reap", correct: true },
            { value: "Time is money", correct: false },
            { value: "Practice makes perfect", correct: false },
            { value: "Actions speak louder than words", correct: false }
          ],
          explanation: "Similar to 'what goes around comes around'."
        },
        {
          id: 6,
          type: "multiple_choice",
          question: "What is 'الوقت كالسيف إن لم تقطعه قطعك'?",
          choices: [
            { value: "Time is like a sword - if you don't cut it, it cuts you", correct: true },
            { value: "Time heals all wounds", correct: false },
            { value: "Time flies", correct: false },
            { value: "Better late than never", correct: false }
          ],
          explanation: "Means if you don't use time productively, it will harm you."
        },
        {
          id: 7,
          type: "multiple_choice",
          question: "What does 'سكتنا لما سكت الدهر' mean?",
          choices: [
            { value: "We remained silent when time was silent", correct: true },
            { value: "We speak when necessary", correct: false },
            { value: "Silence is golden", correct: false },
            { value: "Time waits for no one", correct: false }
          ],
          explanation: "We remained patient during difficult times."
        }
      ]
    },

    {
      id: "literature-1",
      title: "Arabic Literature",
      description: "Classical and modern Arabic literature terms",
      level: "advanced",
      type: "culture",
      author: "IStories",
      createdAt: "2024-01-23",
      questions: 7,
      estimatedTime: 6,
      questions: [
        {
          id: 1,
          type: "multiple_choice",
          question: "What is 'شعر'?",
          choices: [
            { value: "Poetry", correct: true },
            { value: "Prose", correct: false },
            { value: "Drama", correct: false },
            { value: "Novel", correct: false }
          ],
          explanation: "'شعر' means poetry."
        },
        {
          id: 2,
          type: "multiple_choice",
          question: "What does 'نثر' mean?",
          choices: [
            { value: "Prose", correct: true },
            { value: "Poetry", correct: false },
            { value: "Rhyme", correct: false },
            { value: "Meter", correct: false }
          ],
          explanation: "'نثر' means prose (non-poetic writing)."
        },
        {
          id: 3,
          type: "multiple_choice",
          question: "What is 'بيت شعر'?",
          choices: [
            { value: "A verse of poetry", correct: true },
            { value: "A house of literature", correct: false },
            { value: "A poetry book", correct: false },
            { value: "A poet's home", correct: false }
          ],
          explanation: "Literally 'house of poetry' means a single verse."
        },
        {
          id: 4,
          type: "multiple_choice",
          question: "What does 'قافية' mean?",
          choices: [
            { value: "Rhyme", correct: true },
            { value: "Meter", correct: false },
            { value: "Theme", correct: false },
            { value: "Imagery", correct: false }
          ],
          explanation: "'قافية' means rhyme in poetry."
        },
        {
          id: 5,
          type: "multiple_choice",
          question: "What is 'بحور الشعر'?",
          choices: [
            { value: "Poetry meters", correct: true },
            { value: "Poetry books", correct: false },
            { value: "Poetry schools", correct: false },
            { value: "Poetry themes", correct: false }
          ],
          explanation: "Literally 'seas of poetry' refers to the meters."
        },
        {
          id: 6,
          type: "multiple_choice",
          question: "What does 'رواية' mean?",
          choices: [
            { value: "Novel", correct: true },
            { value: "Short story", correct: false },
            { value: "Play", correct: false },
            { value: "Poem", correct: false }
          ],
          explanation: "'رواية' means novel."
        },
        {
          id: 7,
          type: "multiple_choice",
          question: "What is 'أدب'?",
          choices: [
            { value: "Literature", correct: true },
            { value: "Language", correct: false },
            { value: "Culture", correct: false },
            { value: "History", correct: false }
          ],
          explanation: "'أدب' means literature."
        }
      ]
    },

    {
      id: "dialects-1",
      title: "Arabic Dialects",
      description: "Variations in Arabic dialects across regions",
      level: "advanced",
      type: "culture",
      author: "IStories",
      createdAt: "2024-01-24",
      questions: 7,
      estimatedTime: 6,
      questions: [
        {
          id: 1,
          type: "multiple_choice",
          question: "How do Egyptians say 'I want'?",
          choices: [
            { value: "عايز", correct: true },
            { value: "بدي", correct: false },
            { value: "ابغي", correct: false },
            { value: "أريد", correct: false }
          ],
          explanation: "'عايز' is Egyptian dialect for 'I want'."
        },
        {
          id: 2,
          type: "multiple_choice",
          question: "How do Lebanese say 'how are you'?",
          choices: [
            { value: "كيفك", correct: true },
            { value: "كيف حالك", correct: false },
            { value: "شلونك", correct: false },
            { value: "أخبارك إيه", correct: false }
          ],
          explanation: "'كيفك' is common in Levantine dialects."
        },
        {
          id: 3,
          type: "multiple_choice",
          question: "What does 'شلون' mean in Gulf Arabic?",
          choices: [
            { value: "How", correct: true },
            { value: "What", correct: false },
            { value: "Why", correct: false },
            { value: "When", correct: false }
          ],
          explanation: "'شلون' means 'how' in Gulf dialects."
        },
        {
          id: 4,
          type: "multiple_choice",
          question: "How do Moroccans say 'no'?",
          choices: [
            { value: "لا", correct: true },
            { value: "مش", correct: false },
            { value: "مو", correct: false },
            { value: "ما", correct: false }
          ],
          explanation: "'لا' is used, but pronunciation differs."
        },
        {
          id: 5,
          type: "multiple_choice",
          question: "What is 'والله' used for in dialects?",
          choices: [
            { value: "Emphasis/swearing by God", correct: true },
            { value: "Greeting", correct: false },
            { value: "Farewell", correct: false },
            { value: "Question", correct: false }
          ],
          explanation: "'والله' is used for emphasis in many dialects."
        },
        {
          id: 6,
          type: "multiple_choice",
          question: "How do Syrians say 'now'?",
          choices: [
            { value: "هلا", correct: true },
            { value: "دلوقتي", correct: false },
            { value: "الحين", correct: false },
            { value: "الآن", correct: false }
          ],
          explanation: "'هلا' means 'now' in Syrian dialect."
        },
        {
          id: 7,
          type: "multiple_choice",
          question: "What does 'ياه' mean in Egyptian Arabic?",
          choices: [
            { value: "Oh/my (exclamation)", correct: true },
            { value: "Yes", correct: false },
            { value: "No", correct: false },
            { value: "Maybe", correct: false }
          ],
          explanation: "'ياه' is an exclamation in Egyptian dialect."
        }
      ]
    },

    {
      id: "islamic-terms",
      title: "Islamic Terms",
      description: "Arabic terms related to Islam and religion",
      level: "advanced",
      type: "culture",
      author: "IStories",
      createdAt: "2024-01-25",
      questions: 7,
      estimatedTime: 6,
      questions: [
        {
          id: 1,
          type: "multiple_choice",
          question: "What does 'الله' mean?",
          choices: [
            { value: "God", correct: true },
            { value: "Prayer", correct: false },
            { value: "Faith", correct: false },
            { value: "Prophet", correct: false }
          ],
          explanation: "'الله' is the Arabic word for God."
        },
        {
          id: 2,
          type: "multiple_choice",
          question: "What is 'صلاة'?",
          choices: [
            { value: "Prayer", correct: true },
            { value: "Fasting", correct: false },
            { value: "Charity", correct: false },
            { value: "Pilgrimage", correct: false }
          ],
          explanation: "'صلاة' means prayer in Islam."
        },
        {
          id: 3,
          type: "multiple_choice",
          question: "What does 'قرآن' mean?",
          choices: [
            { value: "Quran (Islamic holy book)", correct: true },
            { value: "Mosque", correct: false },
            { value: "Imam", correct: false },
            { value: "Faith", correct: false }
          ],
          explanation: "'قرآن' is the Quran, the holy book of Islam."
        },
        {
          id: 4,
          type: "multiple_choice",
          question: "What is 'مسجد'?",
          choices: [
            { value: "Mosque", correct: true },
            { value: "Church", correct: false },
            { value: "Temple", correct: false },
            { value: "Synagogue", correct: false }
          ],
          explanation: "'مسجد' means mosque."
        },
        {
          id: 5,
          type: "multiple_choice",
          question: "What does 'رمضان' mean?",
          choices: [
            { value: "Islamic month of fasting", correct: true },
            { value: "Eid celebration", correct: false },
            { value: "Friday prayer", correct: false },
            { value: "Islamic year", correct: false }
          ],
          explanation: "'رمضان' is the month of fasting in Islam."
        },
        {
          id: 6,
          type: "multiple_choice",
          question: "What is 'حج'?",
          choices: [
            { value: "Pilgrimage to Mecca", correct: true },
            { value: "Islamic law", correct: false },
            { value: "Islamic tax", correct: false },
            { value: "Islamic greeting", correct: false }
          ],
          explanation: "'حج' means pilgrimage, one of the Five Pillars."
        },
        {
          id: 7,
          type: "multiple_choice",
          question: "What does 'إسلام' mean?",
          choices: [
            { value: "Submission (to God)", correct: true },
            { value: "Peace", correct: false },
            { value: "Faith", correct: false },
            { value: "Religion", correct: false }
          ],
          explanation: "'إسلام' literally means submission to God's will."
        }
      ]
    }
  ]
};