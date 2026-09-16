import * as SQLite from "expo-sqlite";

import type { StateStorage } from "zustand/middleware";

const DATABASE_NAME = "hanjang.db";

let db: SQLite.SQLiteDatabase | null = null;

const getDb = () => {
  db ??= SQLite.openDatabaseSync(DATABASE_NAME);
  db.execSync(
    `CREATE TABLE IF NOT EXISTS kv_store (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    )`,
  );
  return db;
};

export const experimentStorage: StateStorage = {
  getItem: (name) =>
    getDb().getFirstSync<{ value: string }>(
      `SELECT value FROM kv_store WHERE key = ?`,
      [name],
    )?.value ?? null,
  setItem: (name, value) => {
    getDb().runSync(
      `INSERT OR REPLACE INTO kv_store (key, value) VALUES (?, ?)`,
      [name, value],
    );
  },
  removeItem: (name) => {
    getDb().runSync(`DELETE FROM kv_store WHERE key = ?`, [name]);
  },
};
