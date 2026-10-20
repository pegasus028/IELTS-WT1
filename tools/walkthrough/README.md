# Student walkthrough harness (persona bots)

Simulated students (A1–C1) drive the real UI of the app, so every Sheet write is one a student's clicks would cause.
Method: the `student-walkthrough` skill. Built 20 Oct 2026.

- `bot/` — in-page bot: `bot-core.js` (virtual clock, utils, accuracy model), `rooms-items.js` (story, lessons, gates, mending, models, record), `rooms-writing.js` (Duelling Hall, Scriptorium reports, mocks), `rooms-spellbook.js` (Workshop design, casts, My Spellbook), `plan.js` (plan from the story chapters). `CONTRACT.md` is the builder brief.
- `personas/<lv>.json` — persona parameters + her own written work (reports, mocks, spellbook lines, cast values, free-text answers), merged from `parts/`.
- `mock-server.js` — Code.gs + Lab.gs in a Node vm with an in-memory Sheet and a fake Claude, serving a scratch copy of the app (`APPDIR`, `STATEFILE`, `PORT`). Never point it at the live Sheet.
- `dryrun.js` — Playwright dry run: `node dryrun.js personas/b1.json all --port 8850` (needs `npm i playwright` and Chromium; `CHROME=` to point at a binary).
- `bundle.min.js` — the bot as one file for the live page (loaded into the page from this path by `watcher.js` after T.Chris signs the student in). `build-bundle.js` rebuilds it (`npx terser`).
- `UPGRADE-BRIEF.md`, `FINDINGS-prebuild.md` — what the runs found and the work packages.
