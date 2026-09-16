import { Effect } from "effect";

import { hanjangApi } from "@/shared/api-client";

import type { ExamSessionDetailPayload, ExamSessionPayload } from "@hanjang/api";

import type { StrokePoint } from "./types";

export interface RemoteSession {
  remoteId: string;
  examId: string;
  deadlineAt: number;
  status: string;
}

export interface RemoteSessionDetail extends RemoteSession {
  answers: Record<string, string>;
  grades: Record<
    string,
    { runId: string; questionId: string; choiceId: string; correct: boolean }
  >;
  inkDraft: { points: StrokePoint[] }[];
}

export interface SessionClient {
  createSession: (
    examId: string,
  ) => Effect.Effect<RemoteSession, unknown>;
  saveAnswer: (
    remoteId: string,
    questionId: string,
    choice: string,
  ) => Effect.Effect<void, unknown>;
  saveStroke: (
    remoteId: string,
    questionId: string,
    points: StrokePoint[],
  ) => Effect.Effect<void, unknown>;
  submit: (remoteId: string) => Effect.Effect<void, unknown>;
  listSessions: () => Effect.Effect<RemoteSession[], unknown>;
  detail: (
    remoteId: string,
  ) => Effect.Effect<RemoteSessionDetail | null, unknown>;
}

const toRemote = (session: ExamSessionPayload): RemoteSession => ({
  remoteId: session.examSessionId,
  examId: session.examPaperId,
  deadlineAt: Date.parse(session.deadlineAt),
  status: session.status,
});

const toDetail = (detail: ExamSessionDetailPayload): RemoteSessionDetail => ({
  ...toRemote(detail),
  answers: Object.fromEntries(
    detail.answers.map((answer) => [answer.questionId, answer.choice]),
  ),
  grades: Object.fromEntries(
    detail.answers
      .filter((answer) => answer.correct !== null)
      .map((answer) => [
        answer.questionId,
        {
          runId: answer.gradeRunId ?? "",
          questionId: answer.questionId,
          choiceId: answer.choice,
          correct: answer.correct === true,
        },
      ]),
  ),
  inkDraft: detail.strokes.map((stroke) => ({ points: stroke.points })),
});

export const createRemoteSessionClient = (): SessionClient => ({
  createSession: (examId) =>
    hanjangApi!.sessions.start({ examPaperId: examId }).pipe(Effect.map(toRemote)),
  saveAnswer: (remoteId, questionId, choice) =>
    hanjangApi!.sessions
      .saveAnswer(remoteId, { questionId, choice })
      .pipe(Effect.asVoid),
  saveStroke: (remoteId, questionId, points) =>
    hanjangApi!.sessions
      .saveStroke(remoteId, { questionId, points })
      .pipe(Effect.asVoid),
  submit: (remoteId) =>
    hanjangApi!.sessions.submit(remoteId).pipe(Effect.asVoid),
  listSessions: () =>
    hanjangApi!.sessions.list().pipe(
      Effect.map((sessions) => sessions.map(toRemote)),
    ),
  detail: (remoteId) =>
    hanjangApi!.sessions.detail(remoteId).pipe(
      Effect.map((detail) => (detail ? toDetail(detail) : null)),
    ),
});
