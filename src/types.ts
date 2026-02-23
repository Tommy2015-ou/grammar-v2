export enum Difficulty {
  BEGINNER = "初级",
  INTERMEDIATE = "中级",
  ADVANCED = "高级"
}

export interface GrammarQuestion {
  id: string;
  sentence: string; // e.g. "______ tired, she still finished the report."
  options: string[]; // e.g. ["Being", "Been", "To be", "Be"]
  correctAnswer: string;
  explanation: {
    rule: string;
    example: string;
    commonMistakes: string;
  };
  category: string;
  difficulty: Difficulty;
}

export interface UserAnswer {
  questionId: string;
  selectedOption: string;
  isCorrect: boolean;
}
