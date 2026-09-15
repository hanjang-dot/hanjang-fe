export type QuizType = "ox" | "cloze" | "word" | "history";

export type QuizDirection = "en-ko" | "ko-en";

export interface Quiz {
  quizId: string;
  type: QuizType;
  prompt: string;
  choices: string[];
  answerIndex: number;
  direction?: QuizDirection;
}

export interface QuizSet {
  quizSetId: string;
  quizzes: Quiz[];
}
