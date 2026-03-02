const express = require("express");
const cors = require("cors");

const importedDb = require("./db");
const issuesRouter = require("./routes/issues");
const commentsRouter = require("./routes/comments");

const db = importedDb.default || importedDb;

// Auto-seed if the database is empty (useful for fresh deployments)
const issueCount = db.prepare("SELECT COUNT(*) as count FROM issues").get();
if (issueCount.count === 0) {
  console.log("Empty database detected — auto-seeding sample data...");
  require("./seed");
}

const app = express();

// CORS — restrict to frontend origin in production
const corsOrigin = process.env.CORS_ORIGIN;
app.use(
  cors(
    corsOrigin
      ? {
        origin: corsOrigin.split(",").map((o) => o.trim()),
        methods: ["GET", "POST", "PATCH", "DELETE"],
      }
      : undefined
  )
);
app.use(express.json());

app.use("/api/issues", issuesRouter);
app.use("/api/issues", commentsRouter);

// Health check
app.get("/", (_req, res) => {
  res.json({ status: "ok", api: "/api/issues" });
});

app.use((err, _req, res, _next) => {
  console.error(err);
  return res.status(500).json({ error: "Internal server error" });
});

const port = Number(process.env.PORT) || 3001;
const host = process.env.HOST || "0.0.0.0";
app.listen(port, host, () => {
  console.log(`Server listening on ${host}:${port}`);
});

module.exports = app;
