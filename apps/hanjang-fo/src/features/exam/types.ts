export interface ExamPaper {
  examId: string;
  year: number | null;
  title: string;
  subject: string;
  round?: string;
  coverImageUrl?: string;
  timeLimitSec: number;
  questionCount?: number;
  publishedAt: string | null;
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
  passageImageUrl?: string;
  passageImageHeight?: number;
  prompt: string;
  choices: QuestionChoice[];
  correctChoiceId?: string;
}

export interface ExamDetail {
  paper: ExamPaper;
  questions: Question[];
}
