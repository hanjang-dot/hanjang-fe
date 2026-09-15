export interface ExamPaper {
  examId: string;
  year: number;
  title: string;
  subject: string;
  timeLimitSec: number;
  publishedAt: string;
}

export interface QuestionChoice {
  choiceId: string;
  label: string;
  text: string;
}

export interface Question {
  questionId: string;
  number: number;
  passage: string;
  passageImageHeight?: number;
  prompt: string;
  choices: QuestionChoice[];
  correctChoiceId: string;
}

export interface ExamDetail {
  paper: ExamPaper;
  questions: Question[];
}
