import { Effect } from "effect";

import { isNotFoundError } from "@hanjang/api";

import { hanjangApi } from "@/shared/api-client";

import type { ExamPaperPayload, QuestionPayload } from "@hanjang/api";

import type { ExamDetail, ExamPaper, Question } from "./types";

export interface ExamClient {
  listPapers: () => Effect.Effect<ExamPaper[], unknown>;
  listPapersPage: (page: number) => Effect.Effect<ExamPaper[], unknown>;
  getExam: (examId: string) => Effect.Effect<ExamDetail | null, unknown>;
}

const toExamPaper = (paper: ExamPaperPayload): ExamPaper => ({
  examId: paper.examPaperId,
  year: paper.year,
  title: paper.title,
  subject: paper.subject,
  round: paper.round ?? undefined,
  coverImageUrl: paper.coverImageUrl ?? undefined,
  timeLimitSec: paper.timeLimitSec,
  publishedAt: paper.publishedAt,
});

const toQuestion = (question: QuestionPayload): Question => ({
  questionId: question.questionId,
  number: question.number,
  passage: "",
  passageImageUrl: question.passageImageUrl,
  prompt: question.prompt,
  choices: question.choices.map((text, index) => ({
    choiceId: text,
    label: String(index + 1),
    text,
  })),
});

export const createRemoteExamClient = (): ExamClient => {
  const listPapers = () =>
    hanjangApi!.exams.list().pipe(Effect.map((papers) => papers.map(toExamPaper)));
  return {
    listPapers,
    listPapersPage: (page) => (page === 0 ? listPapers() : Effect.succeed([])),
    getExam: (examId) =>
      Effect.all([
        hanjangApi!.exams.detail(examId),
        hanjangApi!.exams.questions(examId),
      ]).pipe(
        Effect.map(([paper, questions]) => ({
          paper: { ...toExamPaper(paper), questionCount: questions.length },
          questions: questions
            .map(toQuestion)
            .sort((a, b) => a.number - b.number),
        })),
        Effect.catchIf(isNotFoundError, () => Effect.succeed(null)),
      ),
  };
};
