const express = require("express");
const importedDb = require("../db");

const db = importedDb.default || importedDb;
const router = express.Router();

function parseIssueId(rawId) {
  const issueId = Number(rawId);
  if (!Number.isInteger(issueId) || issueId <= 0) {
    return null;
  }
  return issueId;
}

function issueExists(issueId) {
  return Boolean(db.prepare("SELECT 1 FROM issues WHERE id = ?").get(issueId));
}

router.post("/:id/comments", (req, res) => {
  const issueId = parseIssueId(req.params.id);
  if (!issueId || !issueExists(issueId)) {
    return res.status(404).json({ error: "Issue not found." });
  }

  const text = typeof req.body?.text === "string" ? req.body.text.trim() : "";
  if (!text) {
    return res.status(400).json({ errors: { text: "Text is required." } });
  }

  const result = db
    .prepare(
      "INSERT INTO comments (issue_id, text, created_at) VALUES (?, ?, CURRENT_TIMESTAMP)"
    )
    .run(issueId, text);

  const comment = db.prepare("SELECT * FROM comments WHERE id = ?").get(result.lastInsertRowid);
  return res.status(201).json(comment);
});

router.get("/:id/comments", (req, res) => {
  const issueId = parseIssueId(req.params.id);
  if (!issueId) {
    return res.json([]);
  }

  const comments = db
    .prepare("SELECT * FROM comments WHERE issue_id = ? ORDER BY datetime(created_at) ASC, id ASC")
    .all(issueId);

  return res.json(comments);
});

module.exports = router;
