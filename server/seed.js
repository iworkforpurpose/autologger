const importedDb = require("./db");

const db = importedDb.default || importedDb;

const sampleIssues = [
  {
    title: "Client portal login intermittently fails after MFA redirect",
    description:
      "Users are returned to the login screen after completing Okta MFA in peak traffic windows. Reproduced on production using SSO accounts tied to enterprise clients.",
    project: "Alpha",
    priority: "Critical",
    assignee: "Alice Johnson",
    status: "Open",
    comments: [
      "Support has logged 12 tickets from two clients since Friday.",
      "Likely related to stale session tokens in the reverse proxy layer.",
    ],
  },
  {
    title: "Add billable-hours summary widget to consulting dashboard",
    description:
      "Account managers need a weekly summary of billable vs non-billable hours by engagement to improve invoice readiness before month-end.",
    project: "Beta",
    priority: "High",
    assignee: "Bob Smith",
    status: "In Progress",
    comments: ["Design approved by operations; waiting on API field mapping."],
  },
  {
    title: "PDF export clips right-side table columns in project health report",
    description:
      "Generated reports truncate KPI columns when the account has more than eight active workstreams. Seen in both Chrome and Edge print pipelines.",
    project: "Gamma",
    priority: "Medium",
    assignee: "Carol White",
    status: "Resolved",
    comments: ["Fixed by switching to landscape mode and dynamic column widths."],
  },
  {
    title: "Deprecated webhook endpoint should return migration guidance",
    description:
      "Legacy endpoint currently returns a generic 404, causing partner confusion. Replace with structured error response and migration link to v2 webhook API.",
    project: "Delta",
    priority: "Low",
    assignee: "David Lee",
    status: "Closed",
    comments: ["Docs and response payload updated in release 2.14."],
  },
  {
    title: "SLA breach alerts missing for overnight incidents",
    description:
      "Critical incidents created between 12:00 AM and 4:00 AM local time are not triggering escalation emails to on-call consultants.",
    project: "Alpha",
    priority: "High",
    assignee: "Eva Martinez",
    status: "Open",
    comments: ["Timezone conversion in scheduler may be skipping UTC offsets."],
  },
  {
    title: "Implement client-level feature flags for phased rollouts",
    description:
      "Consulting leads need feature flags scoped by client account to pilot custom workflow automation before global release.",
    project: "Beta",
    priority: "Critical",
    assignee: "Alice Johnson",
    status: "In Progress",
    comments: ["Schema drafted; integration with admin UI in progress."],
  },
  {
    title: "Data import wizard does not validate duplicate contract IDs",
    description:
      "CSV imports with duplicate contract IDs silently overwrite previous records, causing billing inconsistencies in migrated projects.",
    project: "Gamma",
    priority: "Low",
    assignee: "Bob Smith",
    status: "Resolved",
    comments: ["Added duplicate detection and row-level error reporting."],
  },
  {
    title: "Archive completed tasks automatically after 90 days",
    description:
      "Reduce clutter in long-running client workspaces by auto-archiving resolved tasks older than 90 days while preserving audit history.",
    project: "Delta",
    priority: "Medium",
    assignee: "Carol White",
    status: "Closed",
    comments: ["Background job deployed and verified in staging and prod."],
  },
  {
    title: "Kanban board drag-and-drop freezes on large enterprise projects",
    description:
      "Boards with 500+ cards become unresponsive during cross-column drag operations, affecting PM teams managing multiple streams.",
    project: "Alpha",
    priority: "Medium",
    assignee: "David Lee",
    status: "Open",
    comments: ["Performance profiling points to excessive DOM re-renders."],
  },
  {
    title: "Expose utilization trends endpoint for BI integration",
    description:
      "Finance team requires a secure API endpoint that returns monthly consultant utilization trends for Power BI reporting.",
    project: "Beta",
    priority: "Low",
    assignee: "Eva Martinez",
    status: "In Progress",
    comments: ["Endpoint contract reviewed with finance analytics team."],
  },
  {
    title: "Calendar sync duplicates milestones in Microsoft Outlook",
    description:
      "Project milestones are duplicated when users reconnect Outlook calendars after OAuth token refresh failures.",
    project: "Gamma",
    priority: "High",
    assignee: "Alice Johnson",
    status: "Resolved",
    comments: ["Added idempotency keys on external calendar writes."],
  },
  {
    title: "Audit log retention policy enforcement for regulated clients",
    description:
      "Need configurable retention periods per client to satisfy healthcare and fintech compliance contracts without manual database maintenance.",
    project: "Delta",
    priority: "Critical",
    assignee: "Bob Smith",
    status: "Closed",
    comments: ["Compliance signoff received after retention tests passed."],
  },
  {
    title: "Inline editing for statement-of-work milestones",
    description:
      "Consultants want to update milestone dates and owner notes directly from the timeline view to reduce context switching.",
    project: "Alpha",
    priority: "Low",
    assignee: "Carol White",
    status: "Open",
    comments: ["Prototype approved; keyboard accessibility still pending."],
  },
  {
    title: "Role-based access: restrict budget view for contractor accounts",
    description:
      "External contractors should not see client budget and margin fields in engagement dashboards while retaining task-level access.",
    project: "Beta",
    priority: "Medium",
    assignee: "David Lee",
    status: "In Progress",
    comments: ["RBAC matrix updated and QA scenarios documented."],
  },
  {
    title: "Bulk close stale service desk tickets with confirmation preview",
    description:
      "Service leads need a safe bulk action to close stale tickets older than 45 days with a review step before execution.",
    project: "Delta",
    priority: "High",
    assignee: "Eva Martinez",
    status: "Resolved",
    comments: ["Preview modal and rollback log completed in sprint 18."],
  },
];

const insertIssue = db.prepare(`
  INSERT INTO issues (title, description, project, priority, assignee, status)
  VALUES (@title, @description, @project, @priority, @assignee, @status)
`);

const insertComment = db.prepare(`
  INSERT INTO comments (issue_id, text)
  VALUES (?, ?)
`);

const seed = db.transaction(() => {
  db.exec(`
    DELETE FROM comments;
    DELETE FROM issues;
    DELETE FROM sqlite_sequence WHERE name IN ('issues', 'comments');
  `);

  for (const issue of sampleIssues) {
    const result = insertIssue.run(issue);
    for (const comment of issue.comments) {
      insertComment.run(result.lastInsertRowid, comment);
    }
  }
});

seed();

console.log(`Seeded ${sampleIssues.length} issues into ./data/issues.db`);
