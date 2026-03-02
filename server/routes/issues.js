const express = require("express");
const importedDb = require("../db");

const db = importedDb.default || importedDb;
const router = express.Router();

const PROJECTS = ["Alpha", "Beta", "Gamma", "Delta"];
const PRIORITIES = ["Low", "Medium", "High", "Critical"];
const ASSIGNEES = [
  "Alice Johnson",
  "Bob Smith",
  "Carol White",
  "David Lee",
  "Eva Martinez",
];
const STATUSES = ["Open", "In Progress", "Resolved", "Closed"];

function escapeCsvValue(value) {
  if (value === null || value === undefined) {
    return "";
  }

  const text = String(value);
  if (/[",\n\r]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

function readIssueById(id) {
  return db.prepare("SELECT * FROM issues WHERE id = ?").get(id);
}

function validateIssueFields(payload, { partial }) {
  const errors = {};

  if (!partial || Object.prototype.hasOwnProperty.call(payload, "title")) {
    if (!payload.title || typeof payload.title !== "string" || !payload.title.trim()) {
      errors.title = "Title is required.";
    } else if (payload.title.trim().length > 150) {
      errors.title = "Title must be at most 150 characters.";
    }
  }

  if (!partial || Object.prototype.hasOwnProperty.call(payload, "description")) {
    if (!payload.description || typeof payload.description !== "string" || !payload.description.trim()) {
      errors.description = "Description is required.";
    }
  }

  if (!partial || Object.prototype.hasOwnProperty.call(payload, "project")) {
    if (!PROJECTS.includes(payload.project)) {
      errors.project = "Project must be one of Alpha, Beta, Gamma, or Delta.";
    }
  }

  if (!partial || Object.prototype.hasOwnProperty.call(payload, "priority")) {
    if (!PRIORITIES.includes(payload.priority)) {
      errors.priority = "Priority must be one of Low, Medium, High, or Critical.";
    }
  }

  if (!partial || Object.prototype.hasOwnProperty.call(payload, "assignee")) {
    if (!ASSIGNEES.includes(payload.assignee)) {
      errors.assignee =
        "Assignee must be one of Alice Johnson, Bob Smith, Carol White, David Lee, or Eva Martinez.";
    }
  }

  if (!partial || Object.prototype.hasOwnProperty.call(payload, "status")) {
    if (!STATUSES.includes(payload.status)) {
      errors.status = "Status must be one of Open, In Progress, Resolved, or Closed.";
    }
  }

  return errors;
}

function parseIssueId(rawId) {
  const issueId = Number(rawId);
  if (!Number.isInteger(issueId) || issueId <= 0) {
    return null;
  }
  return issueId;
}

router.get("/", (req, res) => {
  const filters = [];
  const params = [];

  if (req.query.project) {
    filters.push("project = ?");
    params.push(req.query.project);
  }
  if (req.query.priority) {
    filters.push("priority = ?");
    params.push(req.query.priority);
  }
  if (req.query.status) {
    filters.push("status = ?");
    params.push(req.query.status);
  }
  if (req.query.assignee) {
    filters.push("assignee = ?");
    params.push(req.query.assignee);
  }
  if (req.query.search) {
    filters.push("(LOWER(title) LIKE ? OR LOWER(description) LIKE ?)");
    const term = `%${String(req.query.search).toLowerCase()}%`;
    params.push(term, term);
  }

  const whereClause = filters.length ? `WHERE ${filters.join(" AND ")}` : "";
  const sql = `SELECT * FROM issues ${whereClause} ORDER BY id DESC`;
  const rows = db.prepare(sql).all(...params);

  return res.json(rows);
});

router.post("/", (req, res) => {
  const body = req.body || {};
  const errors = validateIssueFields(body, { partial: false });

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }

  const insert = db.prepare(`
    INSERT INTO issues (title, description, project, priority, assignee, status)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const result = insert.run(
    body.title.trim(),
    body.description.trim(),
    body.project,
    body.priority,
    body.assignee,
    body.status
  );

  const issue = readIssueById(result.lastInsertRowid);
  return res.status(201).json(issue);
});

router.get("/export/csv", (_req, res) => {
  const issues = db.prepare("SELECT * FROM issues ORDER BY id ASC").all();
  const headers = [
    "id",
    "title",
    "description",
    "project",
    "priority",
    "assignee",
    "status",
    "created_at",
    "updated_at",
  ];

  const csvRows = [headers.join(",")];
  for (const issue of issues) {
    const row = headers.map((key) => escapeCsvValue(issue[key]));
    csvRows.push(row.join(","));
  }

  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader("Content-Disposition", 'attachment; filename="issues.csv"');
  return res.send(csvRows.join("\n"));
});

router.get("/:id", (req, res) => {
  const issueId = parseIssueId(req.params.id);
  if (!issueId) {
    return res.status(404).json({ error: "Issue not found." });
  }

  const issue = readIssueById(issueId);
  if (!issue) {
    return res.status(404).json({ error: "Issue not found." });
  }

  const comments = db
    .prepare("SELECT * FROM comments WHERE issue_id = ? ORDER BY id ASC")
    .all(issueId);

  return res.json({ ...issue, comments });
});

router.patch("/:id", (req, res) => {
  const issueId = parseIssueId(req.params.id);
  if (!issueId) {
    return res.status(404).json({ error: "Issue not found." });
  }

  const issue = readIssueById(issueId);
  if (!issue) {
    return res.status(404).json({ error: "Issue not found." });
  }

  const body = req.body || {};
  const allowedFields = ["title", "description", "project", "priority", "assignee", "status"];
  const providedFields = allowedFields.filter((field) =>
    Object.prototype.hasOwnProperty.call(body, field)
  );

  if (providedFields.length === 0) {
    return res.status(400).json({ errors: { fields: "At least one updatable field is required." } });
  }

  const errors = validateIssueFields(body, { partial: true });
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }

  const updates = [];
  const params = [];

  for (const field of providedFields) {
    updates.push(`${field} = ?`);
    const value = typeof body[field] === "string" ? body[field].trim() : body[field];
    params.push(value);
  }

  updates.push("updated_at = CURRENT_TIMESTAMP");
  params.push(issueId);

  const sql = `UPDATE issues SET ${updates.join(", ")} WHERE id = ?`;
  db.prepare(sql).run(...params);

  const updatedIssue = readIssueById(issueId);
  return res.json(updatedIssue);
});

router.delete("/:id", (req, res) => {
  const issueId = parseIssueId(req.params.id);
  if (!issueId) {
    return res.status(404).json({ error: "Issue not found." });
  }

  const result = db.prepare("DELETE FROM issues WHERE id = ?").run(issueId);
  if (result.changes === 0) {
    return res.status(404).json({ error: "Issue not found." });
  }

  return res.status(204).send();
});

module.exports = router;
