export type ExamPaper = {
  id: string;
  round: string;
  subject: string;
  year: number;
  coverImageUrl: string;
  timeLimitMinutes: number;
  published: boolean;
};

export type ExamPaperInput = {
  round: string;
  subject: string;
  year: number;
  coverImageUrl: string;
  timeLimitMinutes: number;
};
