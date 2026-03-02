const express = require("express");
const cors = require("cors");

const importedDb = require("./db");
const issuesRouter = require("./routes/issues");
const commentsRouter = require("./routes/comments");

const db = importedDb.default || importedDb;
void db;

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
