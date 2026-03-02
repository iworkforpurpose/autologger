# Antigravity Orchestration & Tool Routing

## Tool Strategy (The Tri-Force)
1. **Gemini CLI (Terminal)**: Use for raw scaffolding, generating mock data (seeds), rapid boilerplate generation, and basic CLI operational tasks.
2. **Antigravity (Base Agent)**: Use for standard component wiring, React/Vite layout, Express routing, and general file orchestration.
3. **Codex (via Antigravity)**: STRICTLY reserved for high-complexity tasks. Trigger Codex ONLY for: complex SQLite/SQL queries, intricate state management, deep debugging of failing code, or advanced server-side validation logic. Do not waste Codex on CSS or boilerplate.

## Workflow Orchestration

### 1. Plan Mode Default
* Enter plan mode for ANY non-trivial task (3+ steps or architectural decisions).
* If something goes sideways, STOP and re-plan immediately - don't keep pushing blindly.
* Use plan mode for verification steps, not just building.
* Write detailed specs upfront to reduce ambiguity before generating code.

### 2. Execution Strategy
* Keep the main context window clean by handling one specific task at a time.
* If a problem requires heavy logic (e.g., recursive data formatting, complex regex), explicitly switch to Codex.
* If a problem is purely structural (e.g., creating 5 files with basic React boilerplate), use Gemini CLI or Base Antigravity.

### 3. Self-Improvement Loop
* After ANY correction from the user: update `tasks/lessons.md` with the pattern.
* Write rules for yourself that prevent the same mistake.
* Ruthlessly iterate on these lessons until the mistake rate drops.
* Review lessons at session start for relevant project context.

### 4. Verification Before Done
* Never mark a task complete without proving it works.
* Diff behavior between main and your changes when relevant.
* Ask yourself: "Would a staff engineer approve this?"
* Check terminal logs, network tabs, and demonstrate correctness before moving to the next phase.

### 5. Elegance (Balanced)
* For non-trivial changes: pause and ask "is there a more elegant way?"
* If a fix feels hacky: "Knowing everything I know now, implement the elegant solution."
* Skip this for simple, obvious fixes - don't over-engineer. The goal is a working, clean prototype.
* Challenge your own work before presenting it.

### 6. Autonomous Bug Fixing
* When given a bug report: just fix it. Don't ask for hand-holding.
* Point at logs, errors, or failing network requests - then resolve them.
* Zero context switching required from the user.
* Fix failing logic without being told exactly *how* to do it.

## Task Management

* **Plan First**: Write the plan to `tasks/todo.md` with checkable items based on the current Phase.
* **Verify Plan**: Check in before starting implementation.
* **Track Progress**: Mark items complete as you go.
* **Explain Changes**: Provide a high-level summary at each step.
* **Document Results**: Add a review section upon completion.
* **Capture Lessons**: Update `tasks/lessons.md` after any manual corrections.

## Core Principles

* **Simplicity First**: Make every change as simple as possible. Keep file sizes small and logic straightforward.
* **No Laziness**: Find root causes. No temporary fixes. Uphold senior developer standards.
* **Minimal Impact**: Changes should only touch what's necessary. Avoid introducing regressions in previously working features.