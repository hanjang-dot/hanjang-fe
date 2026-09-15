import type { Effect } from "effect";

export type SessionStatus = "idle" | "restoring" | "graded" | "aborted";

export type GradeVariant = "idle" | "grading" | "graded" | "aborted" | "error";

export interface StrokePoint {
  x: number;
  y: number;
}

export interface Stroke {
  points: StrokePoint[];
}

export interface ExamSession {
  sessionId: string;
  examId: string;
  deadlineAt: number;
  answers: Record<string, string>;
  inkDraft: Stroke[];
  schemaVersion: number;
  status: SessionStatus;
}

export interface GradeResult {
  runId: string;
  questionId: string;
  choiceId: string;
  correct: boolean;
}

export interface GradeRequest {
  runId: string;
  questionId: string;
  choiceId: string;
  correctChoiceId: string;
}

export interface GradeClient {
  grade: (request: GradeRequest) => Effect.Effect<GradeResult, unknown>;
}
