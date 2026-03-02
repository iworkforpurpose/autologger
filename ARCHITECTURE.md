# Architecture

## Why This Stack?

### Frontend — React + Vite + Tailwind CSS v4

| Choice | Rationale |
|---|---|
| **React 19** | Industry-standard UI library with a massive ecosystem, component-based architecture, and excellent developer tooling. React's lazy loading (`React.lazy`) and `Suspense` give us code-splitting for free. |
| **Vite 7** | Near-instant HMR, native ESM-based dev server, and significantly faster builds compared to Webpack. PostCSS integration is seamless. |
| **Tailwind CSS v4** | Utility-first CSS with the new CSS-based configuration (`@import "tailwindcss"` + `@custom-variant`). Eliminates dead CSS, enforces consistency, and supports class-based dark mode out of the box. |
| **React Router v7** | Declarative routing with nested `<Route>` + `<Outlet>` layout pattern, enabling a shared `Layout` component without prop-drilling. |
| **Recharts** | Composable charting library built on React + D3. Lightweight, declarative API that integrates naturally with React state. |
| **Axios** | Promise-based HTTP client with interceptors, automatic JSON parsing, and cleaner error handling than `fetch`. |
| **Lucide React** | Tree-shakeable icon library — only icons used are bundled. Consistent design language across the UI. |
| **Framer Motion** | Declarative animation library for React, providing smooth micro-animations and transitions. |

### Backend — Express + SQLite

| Choice | Rationale |
|---|---|
| **Node.js + Express 5** | Minimal, unopinionated HTTP framework. Perfect for a focused REST API with clear routing. Express 5 adds native async error handling. |
| **SQLite (better-sqlite3)** | Zero-config embedded database — no separate server process needed. Synchronous API provides simpler code and better performance for single-server workloads. Ideal for development and small-to-medium deployments. |
| **CommonJS modules** | The server uses `require()` / `module.exports` for compatibility with `better-sqlite3` native bindings. |

### Why Not...?

- **PostgreSQL/MySQL**: Overkill for a single-user or small-team issue tracker. SQLite removes operational overhead entirely.
- **TypeScript**: Would add type safety, but this project prioritizes rapid iteration. A natural next step for hardening.
- **Next.js**: Full-stack framework is unnecessary when backend and frontend have separate concerns and deployment targets.

---

## Database Schema

SQLite database stored at `server/data/issues.db`.

### `issues` table

| Column | Type | Constraints |
|---|---|---|
| `id` | `INTEGER` | `PRIMARY KEY AUTOINCREMENT` |
| `title` | `TEXT` | `NOT NULL` |
| `description` | `TEXT` | `NOT NULL` |
| `project` | `TEXT` | `NOT NULL`, `CHECK IN ('Alpha', 'Beta', 'Gamma', 'Delta')` |
| `priority` | `TEXT` | `NOT NULL`, `CHECK IN ('Low', 'Medium', 'High', 'Critical')` |
| `assignee` | `TEXT` | `NOT NULL`, `CHECK IN ('Alice Johnson', 'Bob Smith', 'Carol White', 'David Lee', 'Eva Martinez')` |
| `status` | `TEXT` | `NOT NULL DEFAULT 'Open'`, `CHECK IN ('Open', 'In Progress', 'Resolved', 'Closed')` |
| `created_at` | `TEXT` | `NOT NULL DEFAULT CURRENT_TIMESTAMP` (UTC) |
| `updated_at` | `TEXT` | `NOT NULL DEFAULT CURRENT_TIMESTAMP` (UTC) |

### `comments` table

| Column | Type | Constraints |
|---|---|---|
| `id` | `INTEGER` | `PRIMARY KEY AUTOINCREMENT` |
| `issue_id` | `INTEGER` | `NOT NULL`, `FOREIGN KEY → issues(id) ON DELETE CASCADE` |
| `text` | `TEXT` | `NOT NULL` |
| `created_at` | `TEXT` | `NOT NULL DEFAULT CURRENT_TIMESTAMP` (UTC) |

### Trigger

- **`issues_updated_at_trigger`** — Automatically sets `updated_at = CURRENT_TIMESTAMP` on any `UPDATE` to the `issues` table (when `updated_at` hasn't been explicitly changed).

### Seeding

`node server/seed.js` populates 15 realistic sample issues with comments, clearing existing data first.

---

## API Endpoints

Base URL: `http://localhost:3001/api`

### Issues

| Method | Endpoint | Description | Request Body | Response |
|---|---|---|---|---|
| `GET` | `/issues` | List all issues (with optional filters) | — | `200` Array of issues |
| `GET` | `/issues/:id` | Get single issue with comments | — | `200` Issue + comments array |
| `POST` | `/issues` | Create a new issue | `{ title, description, project, priority, assignee, status }` | `201` Created issue |
| `PATCH` | `/issues/:id` | Partially update an issue | Any subset of issue fields | `200` Updated issue |
| `DELETE` | `/issues/:id` | Delete an issue (cascades to comments) | — | `204` No content |
| `GET` | `/issues/export/csv` | Export all issues as CSV download | — | CSV file |

**Query parameters for `GET /issues`:**
- `project` — Filter by project name
- `priority` — Filter by priority level
- `status` — Filter by status
- `assignee` — Filter by assignee name
- `search` — Full-text search across title and description (case-insensitive)

### Comments

| Method | Endpoint | Description | Request Body | Response |
|---|---|---|---|---|
| `POST` | `/issues/:id/comments` | Add a comment to an issue | `{ text }` | `201` Created comment |
| `GET` | `/issues/:id/comments` | List comments for an issue | — | `200` Array of comments |

### Validation

All endpoints return `400` with `{ errors: { field: "message" } }` for invalid input. The server validates enum fields (`project`, `priority`, `assignee`, `status`) against allowed values and checks required fields.

---

## Component Structure

```
client/src/
├── main.jsx                    # App entry point, React Router setup, Suspense wrapper
├── index.css                   # Global styles, Tailwind v4 import, dark mode base styles
├── App.css                     # (Cleared — previously Vite boilerplate)
├── api.js                      # Axios client with all API functions
│
├── components/
│   ├── Layout.jsx              # Global layout: sticky nav, theme toggle, <Outlet />
│   └── ui/
│       └── glowing-effect.jsx  # Reusable glowing UI effect component
│
├── lib/
│   └── utils.js                # Shared utilities (clsx + tailwind-merge)
│
├── pages/
│   ├── Dashboard.jsx           # Issues list with status metrics, bar chart, filter bar
│   ├── NewIssue.jsx            # Issue creation form with validation
│   └── IssueDetail.jsx         # Single issue view with status update + comments
│
└── assets/
    └── react.svg               # Static assets
```

### Routing

| Path | Component | Description |
|---|---|---|
| `/` | `Dashboard` | Main view — metrics, chart, filters, issue cards |
| `/issues/new` | `NewIssue` | Creation form |
| `/issues/:id` | `IssueDetail` | Detail view with status management and comments |

All routes are wrapped in `<Layout>` via React Router's nested route pattern (`<Route element={<Layout />}>`), providing consistent navigation and theme management.

### Key Architectural Patterns

- **Layout + Outlet** — Single layout component manages nav, theme toggle, and page container. Page components render inside `<Outlet />`.
- **Lazy loading** — All page components use `React.lazy()` + `Suspense` for automatic code splitting.
- **Class-based dark mode** — Theme state lives in `Layout`, toggles `.dark` on `<html>`, persists to `localStorage`.
- **Debounced search** — Dashboard search input uses a 300ms debounce before triggering API calls.
- **Optimistic UI** — Status updates in `IssueDetail` apply instantly and revert on error.

---

## What I'd Improve With More Time

### Architecture

- **TypeScript everywhere** — Add strict types to both client and server. Type-safe API contracts with shared type definitions or a tool like `zod` for runtime validation + type inference.
- **State management** — Replace prop threading and local `useState` with React Query (TanStack Query) for server state. This would give us caching, background refetching, optimistic mutations, and deduplication for free.
- **Environment-based config** — Centralize all configuration (API URLs, feature flags, allowed enums) into environment files with validation at startup.
- **Authentication & authorization** — Add JWT or session-based auth. Role-based access so only certain users can delete or reassign issues.

### Database & Backend

- **Migrations system** — Replace raw `CREATE TABLE IF NOT EXISTS` with a proper migration tool (e.g., `better-sqlite3-migrations` or `knex`). Track schema versions and support rollbacks.
- **Pagination** — The current API returns all issues at once. Add cursor-based or offset pagination with `LIMIT` / `OFFSET` for large datasets.
- **Full-text search** — Replace `LIKE %term%` with SQLite's FTS5 extension for dramatically faster and more relevant search results.
- **PostgreSQL option** — For multi-user production deployments, swap to PostgreSQL with connection pooling. The current synchronous SQLite API doesn't scale under concurrent writes.
- **ISO 8601 timestamps** — Store timestamps with timezone suffixes (e.g., `2026-03-02T09:30:37Z`) to eliminate client-side UTC guessing.

### Frontend

- **Testing** — Add Vitest for unit tests, React Testing Library for component tests, and Playwright for E2E tests covering critical flows (create issue, update status, add comment).
- **Responsive design audit** — The current responsive breakpoints are functional but not optimized for mobile. The filter bar and chart layout need mobile-first refinement.
- **Accessibility** — Audit with axe-core. Add proper `aria-*` labels, keyboard navigation for the issue cards, and focus management after mutations.
- **Error boundaries** — Wrap page components in `ErrorBoundary` to gracefully handle render errors without crashing the entire app.
- **Toast notifications** — Replace silent error handling with a toast system (e.g., react-hot-toast) for user feedback on create/update/delete actions.
- **Advanced charting** — Add more dashboard visualizations: issues over time (line chart), priority distribution (donut chart), assignee workload (stacked bar).

### DevOps

- **CI/CD pipeline** — GitHub Actions for lint, test, build on every PR. Auto-deploy to a staging environment.
- **Docker** — Containerize both client and server for consistent dev/prod environments.
- **Monitoring** — Add structured logging (pino) and error tracking (Sentry) for production observability.
