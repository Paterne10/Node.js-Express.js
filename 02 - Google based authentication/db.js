import Database from "better-sqlite3";
import path from "path";

const db = new Database(path.join(import.meta.dirname, "data.db"));

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    mail TEXT UNIQUE,
    password TEXT,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP
  )
`);

export default db;