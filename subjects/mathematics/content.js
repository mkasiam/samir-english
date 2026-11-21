window.SUBJECT_CONTENT = {
  subjectId: "mathematics",
  subjectName: "Mathematics",
  icon: "📐",
  accentColor: "#7c3aed",
  description: "Algebraic formulas, worked examples, step-by-step solutions, and practice problems.",
  status: "Available",
  chapters: [
    {
      title: "Chapter 5: Algebraic Formulae and Applications",
      topics: [
        {
          title: "Topic 1: Square of a Binomial",
          titleBn: "দ্বিপদী রাশির বর্গ",
          explanations: [
            {
              heading: "Core Concept",
              en: "When we multiply a binomial (a + b) by itself, we get the square of the sum of two terms.",
              bn: "যখন আমরা একটি দ্বিপদী রাশি (a + b)-কে সেই রাশি দিয়েই গুণ করি, তখন দুটি পদের সমষ্টির বর্গ পাওয়া যায়।"
            }
          ],
          formulas: [
            {
              name: "Square of Sum Formula",
              expression: "(a + b)^2 = a^2 + 2ab + b^2",
              explanation: "Used to expand the square of the sum of two terms a and b.",
              explanationBn: "দুটি পদের যোগফলের বর্গ নির্ণয়ে এই সূত্র ব্যবহৃত হয়।"
            },
            {
              name: "Square of Difference Formula",
              expression: "(a - b)^2 = a^2 - 2ab + b^2",
              explanation: "Used to expand the square of the difference of two terms a and b.",
              explanationBn: "দুটি পদের বিয়োগফলের বর্গ নির্ণয়ে এই সূত্র ব্যবহৃত হয়।"
            }
          ],
          stepByStepSolutions: [
            {
              problem: "Find the square of (2x + 3y).",
              problemBn: "(2x + 3y) এর বর্গ নির্ণয় করো।",
              steps: [
                "Let a = 2x and b = 3y.",
                "Apply the formula: (a + b)^2 = a^2 + 2ab + b^2.",
                "Substitute values: (2x)^2 + 2(2x)(3y) + (3y)^2.",
                "Simplify each term: 4x^2 + 12xy + 9y^2."
              ],
              answer: "4x^2 + 12xy + 9y^2"
            }
          ],
          importantPoints: [
            {
              en: "Always square the coefficients as well as the variables: (2x)^2 = 4x^2.",
              bn: "চলকের পাশাপাশি সহগেরও বর্গ করতে হবে: (2x)^2 = 4x^2।"
            }
          ],
          practice: [
            {
              question: "What is the expansion of (x + 5)^2?",
              options: ["x^2 + 25", "x^2 + 10x + 25", "x^2 + 5x + 25"],
              correctIndex: 1,
              explanation: "(x)^2 + 2(x)(5) + (5)^2 = x^2 + 10x + 25."
            }
          ]
        }
      ]
    }
  ]
};
