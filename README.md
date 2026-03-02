# Issue Tracker

A full-stack issue tracking application built with React and Express. Track bugs, feature requests, and tasks across projects with real-time filtering, status management, and visual analytics.

### 🚀 [Live Demo → autologger-eight.vercel.app](https://autologger-eight.vercel.app/)

![Light Mode Dashboard](https://img.shields.io/badge/theme-light-f8fafc?style=flat-square) ![Dark Mode](https://img.shields.io/badge/theme-dark-0f172a?style=flat-square) ![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)

---

## Features

- **Dashboard** — View all issues in a responsive card grid with project, priority, and status badges
- **Status Metrics** — Real-time 4-card summary showing Open, In Progress, Resolved, and Closed counts
- **Issues by Project Chart** — Color-coded bar chart (Recharts) showing issue distribution across projects
- **Filtering & Search** — Filter by project, status, priority, assignee, or full-text search with 300ms debounce
- **Issue Detail** — View full issue details, update status with optimistic UI, and manage comments
- **Create Issue** — Form with client-side and server-side validation for all fields
- **CSV Export** — One-click download of all issues as a CSV file
- **Dark Mode** — Class-based theme toggle with localStorage persistence and smooth transitions
- **Responsive** — Mobile-first layout with adaptive breakpoints (1-col → 2-col → 3/4-col grids)

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, Vite 7, Tailwind CSS v4, React Router v7, Recharts, Axios, Lucide Icons |
| **Backend** | Node.js, Express 5 |
| **Database** | SQLite via better-sqlite3 |
| **Animations** | Framer Motion |

> For a deep dive into architecture decisions, database schema, API docs, and improvement roadmap, see [ARCHITECTURE.md](./ARCHITECTURE.md).

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9

### 1. Clone the repository

```bash
git clone https://github.com/iworkforpurpose/autologger.git
cd autologger
```

### 2. Install dependencies

```bash
# Server
cd server
npm install

# Client
cd ../client
npm install
```

### 3. Seed the database (optional)

Populates the database with 15 realistic sample issues and comments:

```bash
cd server
node seed.js
```

> The SQLite database is auto-created at `server/data/issues.db` on first server start.

### 4. Start the development servers

Open two terminal windows:

```bash
# Terminal 1 — Backend (port 3001)
cd server
node index.js
```

```bash
# Terminal 2 — Frontend (port 5173)
cd client
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Project Structure

```
issue-tracker/
├── client/                     # React frontend (Vite)
│   ├── src/
│   │   ├── components/
│   │   │   └── Layout.jsx      # Global layout with nav + theme toggle
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx   # Main view: metrics, chart, filters, cards
│   │   │   ├── NewIssue.jsx    # Issue creation form
│   │   │   └── IssueDetail.jsx # Issue detail + comments
│   │   ├── api.js              # Axios API client
│   │   ├── main.jsx            # App entry point + routing
│   │   └── index.css           # Global styles + Tailwind v4
│   ├── postcss.config.js
│   └── package.json
│
├── server/                     # Express backend
│   ├── routes/
│   │   ├── issues.js           # CRUD + CSV export endpoints
│   │   └── comments.js         # Comment endpoints
│   ├── db.js                   # SQLite setup + schema
│   ├── seed.js                 # Sample data seeder
│   ├── index.js                # Express app entry point
│   └── package.json
│
├── ARCHITECTURE.md             # Detailed architecture documentation
└── README.md                   # This file
```

---

## API Overview

Base URL: `http://localhost:3001/api`

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/issues` | List issues (supports `?project=`, `?status=`, `?priority=`, `?assignee=`, `?search=`) |
| `POST` | `/issues` | Create issue |
| `GET` | `/issues/:id` | Get issue with comments |
| `PATCH` | `/issues/:id` | Update issue fields |
| `DELETE` | `/issues/:id` | Delete issue + comments |
| `GET` | `/issues/export/csv` | Download all issues as CSV |
| `POST` | `/issues/:id/comments` | Add comment |
| `GET` | `/issues/:id/comments` | List comments |

> Full request/response details in [ARCHITECTURE.md](./ARCHITECTURE.md#api-endpoints).

---

## Scripts

### Client

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server on port 5173 |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |

### Server

| Command | Description |
|---|---|
| `node index.js` | Start Express server on port 3001 |
| `node seed.js` | Seed database with sample data |

---

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `PORT` | `3001` | Server port |
| `VITE_API_URL` | `http://localhost:3001/api` | API base URL for the client |

---

## License

MIT
