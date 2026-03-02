const fs = require("node:fs");
const path = require("node:path");
const Database = require("better-sqlite3");

const dataDir = path.resolve(__dirname, "data");
const dbPath = path.join(dataDir, "issues.db");

fs.mkdirSync(dataDir, { recursive: true });

const db = new Database(dbPath);

db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

db.exec(`
  CREATE TABLE IF NOT EXISTS issues (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    project TEXT NOT NULL CHECK (project IN ('Alpha', 'Beta', 'Gamma', 'Delta')),
    priority TEXT NOT NULL CHECK (priority IN ('Low', 'Medium', 'High', 'Critical')),
    assignee TEXT NOT NULL CHECK (assignee IN (
      'Alice Johnson',
      'Bob Smith',
      'Carol White',
      'David Lee',
      'Eva Martinez'
    )),
    status TEXT NOT NULL DEFAULT 'Open' CHECK (status IN ('Open', 'In Progress', 'Resolved', 'Closed')),
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    issue_id INTEGER NOT NULL,
    text TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (issue_id) REFERENCES issues(id) ON DELETE CASCADE
  );

  CREATE TRIGGER IF NOT EXISTS issues_updated_at_trigger
  AFTER UPDATE ON issues
  FOR EACH ROW
  WHEN NEW.updated_at = OLD.updated_at
  BEGIN
    UPDATE issues
    SET updated_at = CURRENT_TIMESTAMP
    WHERE id = NEW.id;
  END;
`);

module.exports = db;
module.exports.default = db;
