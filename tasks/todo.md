# Issue Tracker - Execution Plan

## Phase 0: Setup (0:00 - 0:10)
- [ ] Initialize Git repository
- [ ] Scaffold `server` directory (Node.js, Express, better-sqlite3)
- [ ] Scaffold `client` directory (React, Vite, TailwindCSS)
- [ ] Commit: `chore: initial project scaffold`

## Phase 1: Database & API (0:10 - 0:40)
- [ ] Create `server/db.js` with SQLite tables (issues, comments)
- [ ] Create `server/seed.js` with 12-15 sample issues
- [ ] Create REST API routes `server/routes/issues.js` (GET, POST, PATCH, DELETE) with server-side validation
- [ ] Create REST API routes `server/routes/comments.js`
- [ ] Wire up `server/index.js`
- [ ] Test API via cURL
- [ ] Commit: `feat: database schema and seed data`
- [ ] Commit: `feat: issues REST API with validation`