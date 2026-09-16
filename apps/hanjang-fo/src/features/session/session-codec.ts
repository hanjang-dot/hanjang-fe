import type { ExamSession, SessionStatus } from "./types";

export interface SessionRow {
  session_id: string;
  remote_id: string | null;
  exam_id: string;
  deadline_at: number;
  answers: string;
  ink_draft: string;
  schema_version: number;
  status: string;
}

export const sessionToRow = (session: ExamSession): SessionRow => ({
  session_id: session.sessionId,
  remote_id: session.remoteId ?? null,
  exam_id: session.examId,
  deadline_at: session.deadlineAt,
  answers: JSON.stringify(session.answers),
  ink_draft: JSON.stringify(session.inkDraft),
  schema_version: session.schemaVersion,
  status: session.status,
});

export const rowToSession = (row: SessionRow): ExamSession => ({
  sessionId: row.session_id,
  ...(row.remote_id ? { remoteId: row.remote_id } : {}),
  examId: row.exam_id,
  deadlineAt: row.deadline_at,
  answers: JSON.parse(row.answers),
  inkDraft: JSON.parse(row.ink_draft),
  schemaVersion: row.schema_version,
  status: row.status as SessionStatus,
});

export const remainingMs = (deadlineAt: number, now: number): number =>
  deadlineAt - now;
