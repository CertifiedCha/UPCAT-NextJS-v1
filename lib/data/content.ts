export type ContentType = "text" | "video" | "image" | "pdf" | "interactive";

export interface LessonContent {
  type: ContentType;
  data: Record<string, unknown>;
}

export interface Lesson {
  id: string;
  title: string;
  subtitle?: string;
  duration: number; // minutes
  xp: number;
  content: LessonContent[];
  quizId?: string;
}

export interface Chapter {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
  chapterQuizId?: string;
  icon: string;
}

export interface Subject {
  id: string;
  title: string;
  description: string;
  color: string;
  bgColor: string;
  icon: string;
  totalLessons: number;
  totalQuizzes: number;
  chapters: Chapter[];
}

export const subjects: Subject[] = [
  {
    id: "math",
    title: "Mathematics",
    description: "From arithmetic foundations to advanced algebra, geometry, and trigonometry.",
    color: "#7F77DD",
    bgColor: "rgba(127,119,221,0.1)",
    icon: "calculate",
    totalLessons: 24,
    totalQuizzes: 8,
    chapters: [
      {
        id: "math-ch1",
        title: "Chapter 1: Arithmetic",
        description: "The backbone of all mathematics — numbers, operations, and their properties.",
        icon: "tag",
        lessons: [
          {
            id: "math-ch1-l1",
            title: "Addition & Its Properties",
            subtitle: "Commutative, Associative, Identity",
            duration: 15,
            xp: 50,
            content: [
              {
                type: "text",
                data: {
                  heading: "What is Addition?",
                  body: "Addition is the most fundamental arithmetic operation — combining two or more quantities into a single sum. But beyond just 'adding numbers,' there are elegant properties that govern how addition behaves.",
                  sections: [
                    {
                      title: "The Commutative Property",
                      body: "The order doesn't matter. a + b = b + a. Whether you add 3 + 5 or 5 + 3, you always get 8. This seems obvious, but it's a formal mathematical law.",
                      formula: "a + b = b + a",
                    },
                    {
                      title: "The Associative Property",
                      body: "Grouping doesn't matter. (a + b) + c = a + (b + c). When adding three or more numbers, you can change the parentheses without changing the result.",
                      formula: "(a + b) + c = a + (b + c)",
                    },
                    {
                      title: "The Identity Property",
                      body: "Adding zero doesn't change a number. a + 0 = a. Zero is the additive identity — it's the 'neutral' element of addition.",
                      formula: "a + 0 = a",
                    },
                  ],
                },
              },
              {
                type: "image",
                data: {
                  src: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&q=80",
                  alt: "Mathematical equations on blackboard",
                  caption: "Properties of addition visualized on a number line",
                },
              },
            ],
            quizId: "quiz-math-ch1-l1",
          },
          {
            id: "math-ch1-l2",
            title: "Multiplication & Its Properties",
            subtitle: "Commutative, Distributive, Zero & Identity",
            duration: 20,
            xp: 50,
            content: [
              {
                type: "text",
                data: {
                  heading: "Multiplication Unlocked",
                  body: "Multiplication is repeated addition — but it has its own rich set of properties that make it powerful.",
                  sections: [
                    {
                      title: "Distributive Property",
                      body: "This is the bridge between multiplication and addition. It says that multiplying a sum is the same as multiplying each addend separately.",
                      formula: "a × (b + c) = (a × b) + (a × c)",
                    },
                    {
                      title: "Zero Property",
                      body: "Any number multiplied by zero equals zero. This is non-negotiable.",
                      formula: "a × 0 = 0",
                    },
                  ],
                },
              },
            ],
            quizId: "quiz-math-ch1-l2",
          },
          {
            id: "math-ch1-l3",
            title: "PEMDAS / Order of Operations",
            subtitle: "The universal rulebook for math expressions",
            duration: 25,
            xp: 75,
            content: [
              {
                type: "text",
                data: {
                  heading: "Why Order Matters",
                  body: "Without a standard order of operations, 2 + 3 × 4 could equal either 20 or 14 depending on who solves it. PEMDAS is the universal agreement that prevents chaos.",
                  sections: [
                    {
                      title: "P — Parentheses",
                      body: "Always solve what's inside parentheses (or brackets) first. They override everything.",
                    },
                    {
                      title: "E — Exponents",
                      body: "Powers and roots come next. 2³ = 8 before you do anything else.",
                    },
                    {
                      title: "MD — Multiplication & Division",
                      body: "Left to right. These two have equal priority — don't always do multiplication before division.",
                    },
                    {
                      title: "AS — Addition & Subtraction",
                      body: "Finally, left to right. Again, equal priority.",
                    },
                  ],
                },
              },
              {
                type: "video",
                data: {
                  url: "https://www.youtube.com/embed/dAyDi1aa40E",
                  title: "PEMDAS Explained",
                  duration: "8:24",
                },
              },
            ],
            quizId: "quiz-math-ch1-l3",
          },
        ],
        chapterQuizId: "quiz-math-ch1-final",
      },
      {
        id: "math-ch2",
        title: "Chapter 2: Algebra",
        description: "Variables, expressions, equations — the language of mathematics.",
        icon: "functions",
        lessons: [
          {
            id: "math-ch2-l1",
            title: "Variables & Expressions",
            subtitle: "The building blocks of algebraic thinking",
            duration: 20,
            xp: 60,
            content: [
              {
                type: "text",
                data: {
                  heading: "What is a Variable?",
                  body: "A variable is a letter that represents an unknown or changing quantity. They're not 'x' just for confusion — they're placeholders for values we don't know yet, or values that can change.",
                  sections: [
                    {
                      title: "Expressions vs. Equations",
                      body: "An expression is a math phrase with no equals sign: 3x + 2. An equation has an equals sign and makes a claim: 3x + 2 = 14.",
                    },
                    {
                      title: "Like Terms",
                      body: "Terms with the same variable and exponent can be combined. 3x + 5x = 8x. But 3x + 5x² cannot be combined — different powers.",
                    },
                  ],
                },
              },
            ],
            quizId: "quiz-math-ch2-l1",
          },
          {
            id: "math-ch2-l2",
            title: "Solving Linear Equations",
            subtitle: "Isolate the variable, find the truth",
            duration: 30,
            xp: 75,
            content: [
              {
                type: "text",
                data: {
                  heading: "The Golden Rule of Equations",
                  body: "Whatever you do to one side of an equation, you MUST do to the other. The equals sign is a balance — keep it balanced.",
                  sections: [
                    {
                      title: "Step-by-Step Strategy",
                      body: "1. Simplify both sides (distribute, combine like terms). 2. Move variables to one side. 3. Move constants to the other. 4. Divide to isolate the variable.",
                    },
                  ],
                },
              },
            ],
            quizId: "quiz-math-ch2-l2",
          },
        ],
        chapterQuizId: "quiz-math-ch2-final",
      },
      {
        id: "math-ch3",
        title: "Chapter 3: Geometry",
        description: "Shapes, angles, areas, volumes — mathematics made visual.",
        icon: "pentagon",
        lessons: [
          {
            id: "math-ch3-l1",
            title: "Angles & Their Relationships",
            subtitle: "Complementary, supplementary, vertical, and more",
            duration: 25,
            xp: 60,
            content: [
              {
                type: "text",
                data: {
                  heading: "Angles Are Everywhere",
                  body: "An angle is formed when two rays share an endpoint. They're measured in degrees, and understanding their relationships is key to geometry.",
                  sections: [
                    {
                      title: "Types of Angles",
                      body: "Acute: less than 90°. Right: exactly 90°. Obtuse: 90°–180°. Straight: exactly 180°. Reflex: more than 180°.",
                    },
                    {
                      title: "Complementary & Supplementary",
                      body: "Complementary angles sum to 90°. Supplementary angles sum to 180°. These relationships appear constantly in geometry proofs.",
                    },
                  ],
                },
              },
            ],
            quizId: "quiz-math-ch3-l1",
          },
        ],
        chapterQuizId: "quiz-math-ch3-final",
      },
    ],
  },
  {
    id: "science",
    title: "Science",
    description: "Biology, Chemistry, Physics — the laws and life of the natural world.",
    color: "#1D9E75",
    bgColor: "rgba(29,158,117,0.1)",
    icon: "science",
    totalLessons: 22,
    totalQuizzes: 7,
    chapters: [
      {
        id: "sci-ch1",
        title: "Chapter 1: Biology — The Cell",
        description: "The fundamental unit of life and all its remarkable machinery.",
        icon: "biotech",
        lessons: [
          {
            id: "sci-ch1-l1",
            title: "Cell Theory",
            subtitle: "The three pillars of modern biology",
            duration: 20,
            xp: 50,
            content: [
              {
                type: "text",
                data: {
                  heading: "All Life is Cellular",
                  body: "Cell theory is one of the most important unifying principles in biology. It took centuries of observation to formulate — and it fundamentally changed how we understand life.",
                  sections: [
                    {
                      title: "The Three Tenets",
                      body: "1. All living things are made of cells. 2. The cell is the basic unit of life. 3. All cells come from pre-existing cells (Omnis cellula e cellula).",
                    },
                    {
                      title: "Prokaryotes vs. Eukaryotes",
                      body: "Prokaryotes (bacteria, archaea) have no membrane-bound nucleus. Eukaryotes (plants, animals, fungi, protists) do. This is one of the most fundamental distinctions in biology.",
                    },
                  ],
                },
              },
              {
                type: "image",
                data: {
                  src: "https://images.unsplash.com/photo-1576086213369-97a306d36557?w=800&q=80",
                  alt: "Cell structure under microscope",
                  caption: "Eukaryotic cell with visible organelles",
                },
              },
            ],
            quizId: "quiz-sci-ch1-l1",
          },
          {
            id: "sci-ch1-l2",
            title: "Cell Organelles",
            subtitle: "The specialized structures inside a eukaryotic cell",
            duration: 30,
            xp: 75,
            content: [
              {
                type: "text",
                data: {
                  heading: "The City Inside a Cell",
                  body: "Think of a eukaryotic cell as a city. Each organelle has a specific job, and the city only functions when everyone does their part.",
                  sections: [
                    {
                      title: "The Nucleus",
                      body: "The control center. Contains DNA (the city's constitution). The nuclear envelope controls what enters and exits.",
                    },
                    {
                      title: "Mitochondria",
                      body: "The powerhouse. Generates ATP through cellular respiration. Has its own DNA — evidence it was once a free-living bacterium (endosymbiotic theory).",
                    },
                    {
                      title: "Ribosomes",
                      body: "The factories. Build proteins by reading mRNA. Found free in cytoplasm or attached to rough ER.",
                    },
                    {
                      title: "Golgi Apparatus",
                      body: "The post office. Receives, modifies, packages, and ships proteins from the ER to their final destinations.",
                    },
                  ],
                },
              },
            ],
            quizId: "quiz-sci-ch1-l2",
          },
        ],
        chapterQuizId: "quiz-sci-ch1-final",
      },
      {
        id: "sci-ch2",
        title: "Chapter 2: Chemistry — Atoms & Bonding",
        description: "The structure of matter and the forces that hold it together.",
        icon: "bubble_chart",
        lessons: [
          {
            id: "sci-ch2-l1",
            title: "Atomic Structure",
            subtitle: "Protons, neutrons, electrons, and the periodic table",
            duration: 25,
            xp: 60,
            content: [
              {
                type: "text",
                data: {
                  heading: "Everything is Made of Atoms",
                  body: "The atom is the smallest unit of an element that retains the element's chemical properties. Understanding atomic structure is the key to understanding all chemistry.",
                  sections: [
                    {
                      title: "Subatomic Particles",
                      body: "Protons (+, in nucleus), Neutrons (neutral, in nucleus), Electrons (-, orbit nucleus in shells). Atomic number = number of protons. Determines the element.",
                    },
                    {
                      title: "Electron Configuration",
                      body: "Electrons fill shells from innermost outward: 2, 8, 8, 18... The outermost shell (valence shell) determines chemical behavior.",
                    },
                  ],
                },
              },
              {
                type: "video",
                data: {
                  url: "https://www.youtube.com/embed/W7DnSw-9Mvk",
                  title: "Atomic Structure Explained",
                  duration: "10:15",
                },
              },
            ],
            quizId: "quiz-sci-ch2-l1",
          },
        ],
        chapterQuizId: "quiz-sci-ch2-final",
      },
    ],
  },
  {
    id: "language",
    title: "Language Proficiency",
    description: "Grammar, vocabulary, sentence structure, and the mechanics of English.",
    color: "#D85A30",
    bgColor: "rgba(216,90,48,0.1)",
    icon: "translate",
    totalLessons: 20,
    totalQuizzes: 6,
    chapters: [
      {
        id: "lang-ch1",
        title: "Chapter 1: Grammar Foundations",
        description: "Parts of speech, sentence structure, and grammatical rules.",
        icon: "spellcheck",
        lessons: [
          {
            id: "lang-ch1-l1",
            title: "Parts of Speech",
            subtitle: "Nouns, verbs, adjectives, adverbs, and beyond",
            duration: 20,
            xp: 50,
            content: [
              {
                type: "text",
                data: {
                  heading: "The Building Blocks of Language",
                  body: "Every word in the English language plays a role in a sentence. Understanding these roles — the parts of speech — gives you the tools to construct and analyze any sentence.",
                  sections: [
                    {
                      title: "Nouns",
                      body: "A noun names a person, place, thing, or idea. Proper nouns name specific things (Manila, Jose Rizal). Common nouns name general things (city, hero).",
                    },
                    {
                      title: "Verbs",
                      body: "Verbs express action (run, write) or state of being (is, seem, become). Every complete sentence needs a verb.",
                    },
                    {
                      title: "Adjectives & Adverbs",
                      body: "Adjectives modify nouns (the red book). Adverbs modify verbs, adjectives, or other adverbs (he runs quickly, very fast).",
                    },
                  ],
                },
              },
            ],
            quizId: "quiz-lang-ch1-l1",
          },
          {
            id: "lang-ch1-l2",
            title: "Subject-Verb Agreement",
            subtitle: "Making sure your subjects and verbs match",
            duration: 25,
            xp: 60,
            content: [
              {
                type: "text",
                data: {
                  heading: "The Agreement Rule",
                  body: "A singular subject takes a singular verb. A plural subject takes a plural verb. Sounds simple — but tricky cases trip up even native speakers.",
                  sections: [
                    {
                      title: "Collective Nouns",
                      body: "Words like 'team,' 'class,' 'committee' are singular when acting as one unit. 'The team is winning' not 'The team are winning.'",
                    },
                    {
                      title: "Intervening Phrases",
                      body: "The verb agrees with the subject, not with a noun in an intervening phrase. 'The box of chocolates IS on the table' — 'box' is the subject, not 'chocolates.'",
                    },
                  ],
                },
              },
            ],
            quizId: "quiz-lang-ch1-l2",
          },
        ],
        chapterQuizId: "quiz-lang-ch1-final",
      },
    ],
  },
  {
    id: "reading",
    title: "Reading Comprehension",
    description: "Critical reading, inference, main idea, and literary analysis.",
    color: "#BA7517",
    bgColor: "rgba(186,117,23,0.1)",
    icon: "menu_book",
    totalLessons: 18,
    totalQuizzes: 5,
    chapters: [
      {
        id: "read-ch1",
        title: "Chapter 1: Finding the Main Idea",
        description: "Identifying what a text is really about, beyond its surface.",
        icon: "center_focus_strong",
        lessons: [
          {
            id: "read-ch1-l1",
            title: "Topic vs. Main Idea",
            subtitle: "These are not the same thing — here's the difference",
            duration: 15,
            xp: 50,
            content: [
              {
                type: "text",
                data: {
                  heading: "A Critical Distinction",
                  body: "Students consistently confuse topic and main idea. Getting this right is foundational to all reading comprehension.",
                  sections: [
                    {
                      title: "The Topic",
                      body: "The topic is what the passage is about — usually answerable in 1-3 words. 'Climate change.' 'The French Revolution.' 'Photosynthesis.'",
                    },
                    {
                      title: "The Main Idea",
                      body: "The main idea is the author's central message or claim about the topic. It's a complete thought. 'Climate change is accelerating due to human industrial activity.' Topic + the author's point.",
                    },
                    {
                      title: "The Thesis Sentence",
                      body: "In well-structured passages, the main idea is stated explicitly in a thesis sentence — often the first or last sentence of the first paragraph. Look there first.",
                    },
                  ],
                },
              },
            ],
            quizId: "quiz-read-ch1-l1",
          },
          {
            id: "read-ch1-l2",
            title: "Making Inferences",
            subtitle: "Reading between the lines",
            duration: 20,
            xp: 65,
            content: [
              {
                type: "text",
                data: {
                  heading: "What the Author Doesn't Say",
                  body: "An inference is a logical conclusion you draw from evidence in the text — something the author implies but doesn't state directly. UPCAT loves inference questions.",
                  sections: [
                    {
                      title: "The Evidence + Reasoning Formula",
                      body: "A good inference = textual evidence + logical reasoning. You're not guessing. You're concluding based on clues in the passage.",
                    },
                    {
                      title: "What to Avoid",
                      body: "Don't use outside knowledge. Don't over-infer. The answer must be supported by the passage. 'The most likely' answer is always the most directly supported one.",
                    },
                  ],
                },
              },
            ],
            quizId: "quiz-read-ch1-l2",
          },
        ],
        chapterQuizId: "quiz-read-ch1-final",
      },
    ],
  },
];

// Quiz data
export interface QuizQuestion {
  id: string;
  type: "mcq" | "truefalse" | "fillinblank" | "matching" | "ordering";
  question: string;
  options?: string[];
  correct: string | string[];
  explanation: string;
  pairs?: { left: string; right: string }[];
  items?: string[];
}

export interface Quiz {
  id: string;
  title: string;
  subject: string;
  duration?: number; // minutes, undefined = untimed
  xp: number;
  questions: QuizQuestion[];
}

export const quizzes: Quiz[] = [
  {
    id: "quiz-math-ch1-l1",
    title: "Addition Properties Check",
    subject: "math",
    xp: 100,
    questions: [
      {
        id: "q1",
        type: "mcq",
        question: "Which property states that a + b = b + a?",
        options: ["Associative", "Commutative", "Identity", "Distributive"],
        correct: "Commutative",
        explanation: "The Commutative Property of Addition states that changing the order of addends does not change the sum.",
      },
      {
        id: "q2",
        type: "truefalse",
        question: "(3 + 4) + 5 = 3 + (4 + 5) is an example of the Associative Property.",
        options: ["True", "False"],
        correct: "True",
        explanation: "Yes! The Associative Property says grouping doesn't matter. Both sides equal 12.",
      },
      {
        id: "q3",
        type: "fillinblank",
        question: "According to the Identity Property of Addition, any number plus ___ equals itself.",
        correct: "0",
        explanation: "Zero is the additive identity. Adding zero to any number leaves it unchanged.",
      },
      {
        id: "q4",
        type: "matching",
        question: "Match each property with its correct formula.",
        pairs: [
          { left: "Commutative", right: "a + b = b + a" },
          { left: "Associative", right: "(a + b) + c = a + (b + c)" },
          { left: "Identity", right: "a + 0 = a" },
        ],
        correct: ["Commutative|a + b = b + a", "Associative|(a + b) + c = a + (b + c)", "Identity|a + 0 = a"],
        explanation: "These three properties are the foundational rules of addition.",
      },
      {
        id: "q5",
        type: "ordering",
        question: "Order these steps to solve: What is 15 + (3 + 7)?",
        items: ["Add 3 + 7 = 10 (parentheses first)", "Identify the expression: 15 + (3 + 7)", "Apply Associative Property", "Add 15 + 10 = 25"],
        correct: ["Identify the expression: 15 + (3 + 7)", "Add 3 + 7 = 10 (parentheses first)", "Apply Associative Property", "Add 15 + 10 = 25"],
        explanation: "Always resolve parentheses first, then apply the remaining operations.",
      },
    ],
  },
  {
    id: "quiz-math-ch1-final",
    title: "Chapter 1: Arithmetic — Final Quiz",
    subject: "math",
    duration: 20,
    xp: 250,
    questions: [
      {
        id: "q1",
        type: "mcq",
        question: "Solve: 2 + 3 × 4 − 1",
        options: ["13", "19", "15", "11"],
        correct: "13",
        explanation: "PEMDAS: multiplication first (3×4=12), then left to right: 2+12−1 = 13.",
      },
      {
        id: "q2",
        type: "mcq",
        question: "Which of the following demonstrates the Distributive Property?",
        options: [
          "3 × (4 + 2) = (3 × 4) + (3 × 2)",
          "3 × 4 = 4 × 3",
          "(3 × 4) × 2 = 3 × (4 × 2)",
          "3 × 1 = 3",
        ],
        correct: "3 × (4 + 2) = (3 × 4) + (3 × 2)",
        explanation: "The Distributive Property: a(b+c) = ab + ac. Distributing 3 across (4+2).",
      },
      {
        id: "q3",
        type: "truefalse",
        question: "5 × 0 = 5 according to the Zero Property of Multiplication.",
        options: ["True", "False"],
        correct: "False",
        explanation: "The Zero Property states any number times zero equals ZERO, not the original number. 5 × 0 = 0.",
      },
      {
        id: "q4",
        type: "fillinblank",
        question: "In PEMDAS, MD stands for ___ and Division.",
        correct: "Multiplication",
        explanation: "PEMDAS: Parentheses, Exponents, Multiplication, Division, Addition, Subtraction.",
      },
      {
        id: "q5",
        type: "mcq",
        question: "What is the result of: (8 + 2) × 3 − 4 ÷ 2?",
        options: ["28", "29", "32", "14"],
        correct: "28",
        explanation: "Step 1: (8+2) = 10. Step 2: 10 × 3 = 30. Step 3: 4 ÷ 2 = 2. Step 4: 30 − 2 = 28.",
      },
    ],
  },
  {
    id: "quiz-sci-ch1-l1",
    title: "Cell Theory Check",
    subject: "science",
    xp: 100,
    questions: [
      {
        id: "q1",
        type: "mcq",
        question: "Which scientist is credited with first using the word 'cell'?",
        options: ["Louis Pasteur", "Robert Hooke", "Antonie van Leeuwenhoek", "Matthias Schleiden"],
        correct: "Robert Hooke",
        explanation: "Robert Hooke coined the term 'cell' in 1665 after observing cork cells under a microscope.",
      },
      {
        id: "q2",
        type: "truefalse",
        question: "Prokaryotic cells have a membrane-bound nucleus.",
        options: ["True", "False"],
        correct: "False",
        explanation: "Prokaryotes LACK a membrane-bound nucleus. This is one of their defining characteristics.",
      },
      {
        id: "q3",
        type: "ordering",
        question: "Order these from simplest to most complex:",
        items: ["Organ", "Organism", "Cell", "Tissue"],
        correct: ["Cell", "Tissue", "Organ", "Organism"],
        explanation: "The hierarchy of biological organization: Cell → Tissue → Organ → Organism.",
      },
    ],
  },
  {
    id: "quiz-lang-ch1-l1",
    title: "Parts of Speech Check",
    subject: "language",
    xp: 100,
    questions: [
      {
        id: "q1",
        type: "mcq",
        question: "In the sentence 'She runs quickly to school,' what part of speech is 'quickly'?",
        options: ["Adjective", "Noun", "Adverb", "Verb"],
        correct: "Adverb",
        explanation: "'Quickly' modifies the verb 'runs' — it tells us HOW she runs. That makes it an adverb.",
      },
      {
        id: "q2",
        type: "matching",
        question: "Match the word to its part of speech.",
        pairs: [
          { left: "beautiful", right: "Adjective" },
          { left: "Manila", right: "Proper Noun" },
          { left: "swiftly", right: "Adverb" },
          { left: "devour", right: "Verb" },
        ],
        correct: ["beautiful|Adjective", "Manila|Proper Noun", "swiftly|Adverb", "devour|Verb"],
        explanation: "Adjectives modify nouns, proper nouns name specific things, adverbs modify verbs, and verbs express action.",
      },
      {
        id: "q3",
        type: "truefalse",
        question: "'Justice' is an example of an abstract noun.",
        options: ["True", "False"],
        correct: "True",
        explanation: "Abstract nouns name ideas, concepts, or qualities that can't be physically touched. Justice, freedom, love are all abstract nouns.",
      },
    ],
  },
  {
    id: "quiz-read-ch1-l1",
    title: "Main Idea Check",
    subject: "reading",
    xp: 100,
    questions: [
      {
        id: "q1",
        type: "mcq",
        question: "Read this: 'Despite their small size, ants can carry objects 50 times their own body weight. Their colonies are highly organized, with distinct roles for workers, soldiers, and queens. Scientists study ants to understand collective intelligence.' What is the MAIN IDEA?",
        options: [
          "Ants are small insects",
          "Ants are remarkable creatures that exhibit impressive strength and social organization",
          "Scientists study insects",
          "Ant queens control the colony",
        ],
        correct: "Ants are remarkable creatures that exhibit impressive strength and social organization",
        explanation: "The main idea encompasses all three points: strength, social structure, and scientific interest. The other options are too narrow.",
      },
      {
        id: "q2",
        type: "truefalse",
        question: "The topic of a passage and its main idea are always the same thing.",
        options: ["True", "False"],
        correct: "False",
        explanation: "The topic is WHAT the passage is about (a noun phrase). The main idea is the author's POINT about the topic (a complete statement).",
      },
    ],
  },
];

// Suggestions logic
export function getSuggestedLessons(
  weakSubjects: string[],
  completedLessons: string[],
  limit = 3
) {
  const suggestions: (Lesson & { subject: Subject; chapter: Chapter })[] = [];

  // Prioritize weak subjects
  const orderedSubjects = [
    ...subjects.filter((s) => weakSubjects.includes(s.id)),
    ...subjects.filter((s) => !weakSubjects.includes(s.id)),
  ];

  for (const subject of orderedSubjects) {
    for (const chapter of subject.chapters) {
      for (const lesson of chapter.lessons) {
        if (!completedLessons.includes(lesson.id)) {
          suggestions.push({ ...lesson, subject, chapter });
          if (suggestions.length >= limit) return suggestions;
        }
      }
    }
  }
  return suggestions;
}
