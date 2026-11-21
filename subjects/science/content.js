window.SUBJECT_CONTENT = {
  subjectId: "science",
  subjectName: "Science",
  icon: "🔬",
  accentColor: "#0d9488",
  description: "Scientific definitions, labeled diagrams, clear explanations, and Q&A.",
  status: "Available",
  chapters: [
    {
      title: "Chapter 2: Cellular Organisation of Plants and Animals",
      topics: [
        {
          title: "Topic 1: Structure of a Plant Cell",
          titleBn: "উদ্ভিদ কোষের গঠন",
          definitions: [
            {
              term: "Cell (কোষ)",
              en: "The structural and functional unit of all living organisms.",
              bn: "জীবদেহের গঠন ও কাজের একককে কোষ বলে।"
            },
            {
              term: "Chloroplast (ক্লোরোপ্লাস্ট)",
              en: "A green plastid found in plant cells that helps make food through photosynthesis.",
              bn: "উদ্ভিদ কোষে অবস্থিত সবুজ প্লাস্টিড যা সালোকসংশ্লেষণের মাধ্যমে খাদ্য তৈরিতে সাহায্য করে।"
            }
          ],
          diagrams: [
            {
              src: "../../assets/images/plant-cell-diagram.svg",
              alt: "Labeled diagram of a typical plant cell showing cell wall, nucleus, vacuole, and chloroplasts",
              caption: "Figure 2.1: Main parts of a typical plant cell.",
              captionBn: "চিত্র ২.১: একটি আদর্শ উদ্ভিদ কোষের প্রধান অংশসমূহ।"
            }
          ],
          explanations: [
            {
              heading: "Why Plant Cells Have a Cell Wall",
              en: "Unlike animal cells, plant cells have a rigid outer cell wall made of cellulose that gives the plant cell a fixed shape and protection.",
              bn: "প্রাণিকোষের মতো নয়, উদ্ভিদ কোষের বাইরে সেলুলোজ নির্মিত একটি দৃঢ় কোষ প্রাচীর থাকে যা কোষকে নির্দিষ্ট আকৃতি ও সুরক্ষা দেয়।"
            }
          ],
          summary: {
            en: "Plant cells contain a cell wall, cell membrane, cytoplasm, nucleus, large vacuole, and chloroplasts.",
            bn: "উদ্ভিদ কোষে কোষ প্রাচীর, কোষ ঝিল্লি, সাইটোপ্লাজম, নিউক্লিয়াস, বড় কোষগহ্বর ও ক্লোরোপ্লাস্ট থাকে।"
          },
          qa: [
            {
              question: "Which organelle helps plant cells perform photosynthesis?",
              questionBn: "কোন অঙ্গাণু উদ্ভিদ কোষকে সালোকসংশ্লেষণে সাহায্য করে?",
              answer: "Chloroplast.",
              answerBn: "ক্লোরোপ্লাস্ট।"
            }
          ],
          practice: [
            {
              question: "Which part is present in a plant cell but absent in an animal cell?",
              options: ["Nucleus", "Cell Wall", "Cell Membrane"],
              correctIndex: 1,
              explanation: "Animal cells do not have a cell wall."
            }
          ]
        }
      ]
    }
  ]
};
