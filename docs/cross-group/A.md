# Cross-group notes from builder A (branch upA)

## WP14 contract (builder B → student.js Duelling Hall `onDone`, ~line 1281)
story.js now reads, per `p.bootcamp.missions[promptId]`:
- `m.completed` (boolean) — set `m.completed = true` when every step of the duel was answered;
- `m.best` (0–100) — unchanged.
`Story.viewMissionDone` (first-duel mission) and the tournament `tour-duel` accept `(m.completed || m.passed) && m.best >= 50`.
The mission note in story-content.js now says "Answer every question: 50% completes this mission (70% wins the duel)."

## Integrator
- `tools/smoke.py` now fails on any local 404 (listener on `page.on('response')`) and reads `CHROME` from the environment.
- The harness 404 after login was `story/map-bg.webp`: `wt1-harness/app-src` predates commit 55b0371; refresh app-src from the merged build.
- `?v=` bumps needed on: story.js, story-content.js, student.js, engine.js, theme.css (index.html); engine.js/theme.css also in teacher.html if it loads them.
