export type Question = {
  id: number;
  text: string;
  options: { key: string; label: string }[];
  correctOption: string;
};

export const EXAM_DURATION_SECONDS = 120; // 2 minutes countdown timer

export const QUESTIONS: Question[] = [
  {
    id: 1,
    text: "Which of the following is not a primitive data type in JavaScript?",
    options: [
      { key: "A", label: "String" },
      { key: "B", label: "Number" },
      { key: "C", label: "Object" },
      { key: "D", label: "Boolean" },
    ],
    correctOption: "C",
  },
  {
    id: 2,
    text: "What does CSS stand for?",
    options: [
      { key: "A", label: "Creative Style Sheets" },
      { key: "B", label: "Cascading Style Sheets" },
      { key: "C", label: "Computer Style Sheets" },
      { key: "D", label: "Colorful Style Sheets" },
    ],
    correctOption: "B",
  },
  {
    id: 3,
    text: "Which React hook is used to handle side effects?",
    options: [
      { key: "A", label: "useState" },
      { key: "B", label: "useContext" },
      { key: "C", label: "useMemo" },
      { key: "D", label: "useEffect" },
    ],
    correctOption: "D",
  },
];