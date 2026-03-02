### Claude Planner:
Here in the problem statement, and I want you to help me build this within 2 hours, I will be vibe coding using antigravity, codex in antigravity and gemini cli from the terminal

break down the problem statement, readd all the requirements properly, I need to create a workflow of vibe coding where it automatically loads my prompts and the results achieved in a .md file

Output: 
5 files to drop into your repo root:
FilePurposeVIBE_CODING_CHEATSHEET.mdYour main weapon — copy-paste prompts for each phase, per AI toolBREAKDOWN.mdFull requirements breakdown, data models, API endpoints, 2-hour timelineARCHITECTURE.mdPre-filled template — just fill in as you build, ready to commitPROMPTS.mdStarter template for your AI prompt log (required deliverable)prompt-logger.shAuto-logger script — run from terminal to append entries to PROMPTS.md


### Gemini: 
I have attached a problem statement and also some of the files which are according to my reresearch, now I need you to become a project manager to complete the task in 2 hours time frame, focus on the prototype fast building and deploying of the product thats it
create a realisting timeline for google sheets.

#### MAIN prompt:

just like the claude code setup
I need it for my own setup where I will be using 
antigravity, codex in antigravity, and gemini cli through terminal, codex is limited plan so, we will use it only for complex tasks

just like claude code used this CLAUDE.md
I want it for antigravity to use the same only if it genuinely helps and increases the speed.

## Workflow Orchestration
### 1. Plan Node Default

﻿﻿Enter plan mode for ANY non-trivial task (3+ steps or architectural decisions)
﻿﻿If something goes sideways, STOP and re-plan immediately - don't keep pushing
﻿﻿Use plan mode for verification steps, not just building
﻿﻿Write detailed specs upfront to reduce ambiguity
### 2.
Subagent Strategy

﻿﻿Use subagents liberally to keep main context window clean
﻿﻿Offload research, exploration, and parallel analysis to subagents
﻿﻿For complex problems,
throw more compute at it via subagents
- One tack per subagent for focused execution
### 3.
Self-Improvement Loop

﻿﻿After ANY correction from the user: update tasks/lessons. md with the pattern
﻿﻿Write rules for yourself that prevent the same mistake
﻿﻿Ruthlessly iterate on these lessons until mistake rate drops
﻿﻿Review lessons at session start for relevant project
### 4.
Verification Before
Done

﻿﻿Never mark a task complete without proving it works
﻿﻿Diff behavior between main and your changes when relevant
﻿﻿Ask yourself:
"Would a staff engineer approve this?"
﻿﻿Run tests, check logs, demonstrate correctness
Elegance (Balanced)
﻿﻿For non-trivial changes: pause and ask "is there a more elegant way?"
﻿﻿If a fix feels hacky: "Knowing everything I know now, implement the elegant solution"
﻿﻿Skip this for simple, obvious fixes - don't over-engineer
﻿﻿Challenge your own work before presenting it
6. Autonomous Bug Fizing

﻿﻿When given a bug report: just fix it. Don't ask for hand-holding
﻿﻿Point at logs, errors, failing tests - then resolve them
﻿﻿Zero context switching required from the user
﻿﻿Go fix failing CI tests without being told how
## Task Management

﻿﻿﻿**Plan First**: Write plan to "tasks/todo.md" with checkable items
﻿﻿﻿**Verify Plan**: Check in before starting implementation
﻿﻿﻿**Track Progress**: Mark items complete as you go
﻿﻿﻿**Explain Changes**: High-level summary at each step
﻿﻿﻿**Document Results**: Add review section to
﻿﻿﻿**Capture Lessons**: Update "tasks/lessons.md"
after corrections
## Core Principles

﻿﻿**Simplicity First**: Make every change as simple as possible. Impact minimal code.
﻿﻿**No Laziness**: Find root causes. No temporary fixes. Senior developer standards.
﻿﻿**Minimat Impact**: Changes should only touch what's necessary. Avoid introducing bugs.

when you give me .md files then give me in a code editor so its easy to copy paste
and turn your PM HAT on I need you to guide me throughout the project

#### Gemini : The Project Manager cum Prompt engineer (executed by codex/antigravity/gemini cli)
prompt 1:
Create a Node.js file `server/db.js` using better-sqlite3 that:
1. Opens/creates a SQLite database at ./data/issues.db
2. Creates two tables on startup if they don't exist:
   - issues: id, title, description, project (enum: Alpha/Beta/Gamma/Delta), 
     priority (enum: Low/Medium/High/Critical), 
     assignee (enum: Alice Johnson/Bob Smith/Carol White/David Lee/Eva Martinez),
     status (enum: Open/In Progress/Resolved/Closed, default Open), 
     created_at, updated_at
   - comments: id, issue_id (FK → issues with CASCADE), text, created_at
3. Also create server/seed.js that inserts 15 realistic sample issues spread
   across all 4 projects, all priorities, all statuses, and all assignees.
   Use realistic bug/feature descriptions for a software consulting firm.
Export the db instance as default.

prompt 2:
Create `server/routes/issues.js` using Express Router and the better-sqlite3 
db from ../db.js. Implement:

GET /api/issues — return all issues. Support query params: project, priority, 
status, assignee, search (searches title AND description case-insensitively).
Build the WHERE clause dynamically.

POST /api/issues — validate all fields server-side:
- title: required, max 150 chars
- description: required
- project: must be one of Alpha/Beta/Gamma/Delta
- priority: must be one of Low/Medium/High/Critical
- assignee: must be one of Alice Johnson/Bob Smith/Carol White/David Lee/Eva Martinez
- status: must be one of Open/In Progress/Resolved/Closed
Return 400 with { errors: { field: "message" } } if invalid. Return 201 on success.

GET /api/issues/:id — return issue by id with its comments array. Return 404 if not found.

PATCH /api/issues/:id — partial update, same server-side validation for provided fields.
Update updated_at to current timestamp. Return 404 if not found.

DELETE /api/issues/:id — delete issue (comments cascade). Return 404 if not found.

GET /api/issues/export/csv — return all issues as CSV download with proper Content-Type header.

prompt 3:
Create `server/routes/comments.js` with Express Router:
POST /api/issues/:id/comments — validate text is non-empty, insert comment with 
current timestamp, return 201 with the new comment. Return 404 if issue doesn't exist.
GET /api/issues/:id/comments — return all comments for an issue ordered by created_at.

prompt 4:
Create `server/index.js`:
- Express app with cors() and express.json() middleware
- Mount routes: /api/issues from ./routes/issues.js, /api/issues from ./routes/comments.js
- Import db from ./db.js (this triggers table creation)
- Listen on PORT env var or 3001
- Add a global error handler that returns 500 with { error: "Internal server error" }

ALL prompts during the build:

Create `client/src/api.js` with axios. Base URL from env VITE_API_URL or 
fallback to http://localhost:3001/api. Export these async functions:
- getIssues(filters) — GET /issues with filters as query params
- createIssue(data) — POST /issues
- getIssue(id) — GET /issues/:id
- updateIssue(id, data) — PATCH /issues/:id
- addComment(issueId, text) — POST /issues/:id/comments
- exportCSV() — GET /issues/export/csv, trigger download
Each function should throw errors with the response data attached.

Create `client/src/main.jsx` with React Router v6 BrowserRouter.
Routes:
- / → Dashboard component (lazy import from ./pages/Dashboard)
- /issues/new → NewIssue component  
- /issues/:id → IssueDetail component
Add a simple top nav with: "Issue Tracker" title linking to /, and a 
"New Issue" button linking to /issues/new. Style with Tailwind.
Note: Create placeholder functional components for Dashboard, NewIssue, and IssueDetail in the `client/src/pages/` directory just returning a simple <h1> so the router doesn't crash.

Update `client/src/pages/Dashboard.jsx` to be a fully functional React component.

It should:
1. Fetch issues from getIssues(filters) (from ../api.js) on mount and whenever filters change.
2. Show 4 status count chips at the top: Open / In Progress / Resolved / Closed, dynamically calculated from the fetched data.
3. Show a filter bar with dropdowns for: Project (Alpha/Beta/Gamma/Delta/All),
   Priority (Low/Medium/High/Critical/All), Status (Open/In Progress/Resolved/Closed/All),
   Assignee (Alice Johnson/Bob Smith/Carol White/David Lee/Eva Martinez/All).
4. Show a search input (debounced 300ms) that filters by title/description.
5. Render issues in a table or card list showing: title, project, priority (colored badge),
   status (colored badge), assignee, and created_at.
6. Clicking a row/card should navigate to /issues/:id.
7. Handle 3 states cleanly: loading (spinner/skeleton), empty ("No issues found. Create one →"), 
   and error ("Could not connect to server. Please try again.").

Use Tailwind for styling. Priority colors: Low=gray, Medium=blue, High=orange, Critical=red.
Status colors: Open=blue, In Progress=yellow, Resolved=green, Closed=gray.

Update `client/src/pages/NewIssue.jsx` to be a functional React component.
Build a form with 6 fields: 
- title (text input)
- description (textarea)
- project (select: Alpha/Beta/Gamma/Delta)
- priority (select: Low/Medium/High/Critical)
- assignee (select: Alice Johnson/Bob Smith/Carol White/David Lee/Eva Martinez)
- status (select: Open/In Progress/Resolved/Closed, default Open)

Requirements:
1. Client-side validation before submit (must match server rules: title required max 150, description required, etc.).
2. Show inline red error messages under each invalid field.
3. On submit: call createIssue(data) from api.js.
4. Show a loading state (spinner or disabled text) on the submit button while the API request is pending.
5. On success: navigate back to the Dashboard (/).
6. On API error (400 Bad Request): capture the response and display the server's field errors appropriately.
7. Include a "Cancel" button that navigates back to /.
8. Use clean Tailwind styling for the layout, inputs, and buttons.

Update `client/src/pages/IssueDetail.jsx` to be a functional React component.

Requirements:
1. Fetch the issue by `id` (using useParams) via `getIssue(id)` on mount.
2. Show all issue fields (title, description, project, priority, assignee) in a clean, readable layout.
3. Render the Status field as a <select> dropdown. On change, immediately call `updateIssue(id, {status})` to PATCH the server, and update the UI (optimistic UI update).
4. Create a Comments section below the issue details.
5. List existing comments showing the `text` and a formatted `created_at` timestamp.
6. Add a "New Comment" form: a simple textarea and an "Add Comment" button. On submit, call `addComment(id, text)`, clear the textarea, and append the new comment to the list.
7. Include a "Back to Dashboard" button that navigates to `/`.
8. Handle states properly: loading (spinner), error (404 "Issue not found" or 500 "Failed to load"), and the actual data view.
9. Use Tailwind CSS for a polished, responsive layout.

Add a dark mode toggle to the top navigation bar.
1. Use a simple button (text like "🌙 Dark" / "☀️ Light" is fine if you don't have icon libraries installed) that toggles a `dark` class on the `document.documentElement`.
2. Persist the user's preference to `localStorage`.
3. Add Tailwind `dark:` variants across the app (Dashboard, NewIssue, IssueDetail) to ensure it looks good in dark mode. Specifically update:
   - Main backgrounds (`dark:bg-gray-900`)
   - Text colors (`dark:text-white`, `dark:text-gray-300`)
   - Card/Table backgrounds (`dark:bg-gray-800`, `dark:border-gray-700`)
   - Inputs and dropdowns (`dark:bg-gray-700`, `dark:border-gray-600`)
   - Ensure the Status and Priority badges still look legible.

Execute a UI enhancement for `client/src/pages/Dashboard.jsx`. We need to add a dynamic 4-column Status Summary metrics section at the very top of the Dashboard, right below the page title and above the filter bar. 

Execute the following steps:

1. Import the following icons from `lucide-react` at the top of the file: `CircleDot, Clock, CheckCircle2, XCircle`.
2. Inside the Dashboard component, before the return statement, calculate the status counts dynamically from the `issues` state array. Create an object or variables holding the counts for 'Open', 'In Progress', 'Resolved', and 'Closed'.
3. In the JSX, right below the "Issues Dashboard" header and before the Filters Bar, create a CSS Grid container: `<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">`.
4. Inside this grid, build four status cards matching this exact structure and styling:
   - Card Wrapper: `bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex items-center gap-4`
   - Left side (Icon container):
     - Open: `<CircleDot className="w-8 h-8 text-blue-500" strokeWidth={2.5} />`
     - In Progress: `<Clock className="w-8 h-8 text-amber-500" strokeWidth={2.5} />`
     - Resolved: `<CheckCircle2 className="w-8 h-8 text-emerald-500" strokeWidth={2.5} />`
     - Closed: `<XCircle className="w-8 h-8 text-slate-500" strokeWidth={2.5} />`
   - Right side (Text container): A flex-col div containing the number and label.
     - Number: `<span className="text-3xl font-extrabold text-slate-900 leading-none">` (Inject the dynamic count here)
     - Label: `<span className="text-sm font-medium text-slate-500 mt-1">` (e.g., "Open", "In Progress")

Do not change the rest of the Dashboard layout. Just insert this grid immediately above the filters.

Execute Phase 6: Bonus Chart Integration. We need to add a bar chart showing "Issues by Project" to the Dashboard. 

Execute the following steps sequentially:

### Step 1: Install Dependency
Run this command in the `client` directory: `npm install recharts`

### Step 2: Update Dashboard Imports
In `client/src/pages/Dashboard.jsx`, add the following import at the top:
`import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';`

### Step 3: Process the Chart Data
Inside the `Dashboard` component (before the return statement), calculate the number of issues per project. Create an array called `chartData` mapped to our exact project names and specific hex colors:
- Alpha: count from data, color: '#3b82f6' (Blue)
- Beta: count from data, color: '#8b5cf6' (Purple)
- Gamma: count from data, color: '#22c55e' (Green)
- Delta: count from data, color: '#f59e0b' (Orange)

### Step 4: Render the Chart
In the JSX, right below the 4-column Status metrics grid and *above* the Filters bar, insert a new card for the chart:
1. Create a container: `<div className="bg-white p-5 border border-slate-200 rounded-xl shadow-sm mb-8">`
2. Add the title: `<h2 className="text-lg font-bold text-slate-900 mb-4">Issues by Project</h2>`
3. Add a wrapper div with a fixed height: `<div className="h-64 w-full md:w-1/2">` (Make it responsive, half width on desktop so it doesn't stretch too wide).
4. Inside, use `<ResponsiveContainer width="100%" height="100%">` wrapping a `<BarChart data={chartData}>`.
5. Configure the chart components to look clean: 
   - `<CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />`
   - `<XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dy={10} />`
   - `<YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dx={-10} />`
   - `<Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />`
   - `<Bar dataKey="count" radius={[4, 4, 0, 0]}>`
6. Inside the `<Bar>`, map over `chartData` to render a `<Cell key={index} fill={entry.color} />` so each bar gets its specific color.

Prompt 1: Setup Tailwind & Global CSS

"Execute Phase 7, Step 1: Dark Mode Setup. First, modify client/tailwind.config.js to explicitly enable class-based dark mode by adding the property darkMode: 'class' to the configuration object. Second, update the global index.css. Keep the current light theme defaults on the body, but add a specific selector for html.dark body that applies bg-slate-900 and text-slate-50. Ensure there is a smooth transition-colors duration-200 on the body so the theme switch doesn't flash jarringly."

Prompt 2: Theme Toggle Logic & Navigation Button

"Execute Phase 7, Step 2: Theme Toggle Logic. In the main navigation/layout component, implement a working theme toggle. Use a useEffect to read the user's theme preference from localStorage on mount, defaulting to light mode. Create a toggle function that updates localStorage and toggles the dark class directly on document.documentElement. Add a button to the right side of the top navigation, next to the 'New Issue' button. This button must display a Moon icon from lucide-react when in light mode, and a Sun icon when in dark mode. Style the button with subtle background hover states that adapt to the current theme."

Prompt 3: Apply Dark Mode Classes to the UI

"Execute Phase 7, Step 3: Dark Mode UI Application. Traverse Dashboard.jsx, NewIssue.jsx, IssueDetail.jsx, and any reusable UI primitives. Apply specific dark: prefix utility classes to ensure the UI looks premium in dark mode.

For all Card backgrounds, the filter bar, and the metric boxes, apply dark:bg-slate-800.

For all borders, apply dark:border-slate-700.

For typography, ensure main headings are dark:text-white and descriptions/labels are dark:text-slate-400.

For form inputs and dropdowns, apply dark:bg-slate-900 and dark:text-white.

For the Recharts <CartesianGrid>, pass a dynamic stroke color so it uses #334155 in dark mode to remain subtle."