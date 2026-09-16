export interface TokenPayload {
  accessToken: string;
  refreshToken: string;
}

export type PhoneVerificationPurpose = "signup" | "login" | "password_reset";

export interface RequestPhoneCodeInput {
  phone: string;
  purpose: PhoneVerificationPurpose;
}

export interface VerifyPhoneCodeInput {
  phone: string;
  code: string;
}

export interface VerifyPhoneCodePayload {
  existingUser: boolean;
  phoneVerificationToken?: string;
  tokenPayload?: TokenPayload;
}

export interface CompletePhoneSignupInput {
  phoneVerificationToken: string;
  email: string;
  password: string;
}

export interface CompleteKakaoPhoneSignupInput {
  phoneVerificationToken: string;
  kakaoPhoneVerificationToken: string;
}

export interface ExamPaperPayload {
  examPaperId: string;
  title: string;
  round: string | null;
  subject: string;
  year: number | null;
  coverImageUrl: string | null;
  timeLimitSec: number;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface QuestionPayload {
  questionId: string;
  examPaperId: string;
  number: number;
  passageImageUrl?: string;
  prompt: string;
  choices: string[];
}

export type QuizType = "ox" | "cloze" | "word" | "history";
export type QuizDirection = "en-ko" | "ko-en";

export interface QuizPayload {
  quizId: string;
  type: QuizType;
  prompt: string;
  choices: string[];
  direction?: QuizDirection;
}

export type SessionStatusPayload = "idle" | "grading" | "graded" | "aborted";

export interface ExamSessionPayload {
  examSessionId: string;
  userId: string;
  examPaperId: string;
  status: SessionStatusPayload;
  deadlineAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface AnswerPayload {
  answerId: string;
  examSessionId: string;
  questionId: string;
  choice: string;
  gradeRunId: string | null;
  correct: boolean | null;
  createdAt: string;
  updatedAt: string;
}

export interface StrokePointPayload {
  x: number;
  y: number;
}

export interface StrokePayload {
  strokeId: string;
  examSessionId: string;
  questionId: string;
  points: StrokePointPayload[];
  createdAt: string;
}

export interface ExamSessionDetailPayload extends ExamSessionPayload {
  answers: AnswerPayload[];
  strokes: StrokePayload[];
}

export interface QuizSessionPayload {
  quizSessionId: string;
  userId: string;
  quizIds: string[];
  status: SessionStatusPayload;
  createdAt: string;
  updatedAt: string;
}

export interface SaveAnswerInput {
  questionId: string;
  choice: string;
}

export interface SaveStrokeDraftInput {
  questionId: string;
  points: StrokePointPayload[];
}

export interface StartExamSessionInput {
  examPaperId: string;
}

export interface StartQuizSessionInput {
  quizIds: string[];
}

export interface GradeAnswerInput {
  examSessionId: string;
  questionId: string;
  choice: string;
}

export interface GradeQuizAnswerInput {
  quizSessionId: string;
  quizId: string;
  choice: string;
}

export interface GradeResultPayload {
  runId: string;
  correct: boolean;
}

export interface MePayload {
  email: string;
}
