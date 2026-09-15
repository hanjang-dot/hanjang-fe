import * as SQLite from "expo-sqlite";

import { rowToSession, sessionToRow } from "./session-codec";

import type { SessionRow } from "./session-codec";
import type { ExamSession } from "./types";

const DATABASE_NAME = "hanjang.db";

let db: SQLite.SQLiteDatabase | null = null;

const getDb = () => {
  db ??= SQLite.openDatabaseSync(DATABASE_NAME);
  return db;
};

export const initSessionTable = () => {
  getDb().execSync(
    `CREATE TABLE IF NOT EXISTS exam_session (
      session_id TEXT PRIMARY KEY,
      exam_id TEXT NOT NULL,
      deadline_at INTEGER NOT NULL,
      answers TEXT NOT NULL,
      ink_draft TEXT NOT NULL,
      schema_version INTEGER NOT NULL,
      status TEXT NOT NULL
    )`,
  );
};

export const saveSession = (session: ExamSession) => {
  const row = sessionToRow(session);
  getDb().runSync(
    `INSERT OR REPLACE INTO exam_session
      (session_id, exam_id, deadline_at, answers, ink_draft, schema_version, status)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      row.session_id,
      row.exam_id,
      row.deadline_at,
      row.answers,
      row.ink_draft,
      row.schema_version,
      row.status,
    ],
  );
};

export const loadSessions = (): ExamSession[] =>
  getDb()
    .getAllSync<SessionRow>(`SELECT * FROM exam_session`)
    .map(rowToSession);
