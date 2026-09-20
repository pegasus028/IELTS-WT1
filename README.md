# Chart Control — IELTS Academic Writing Task 1

Self-study portal for students and a Flight Deck for the teacher. Live class server: `https://script.google.com/macros/s/AKfycbyDoAkDFHBmUFErLHV5Bm3Mbw_H6qnLZ74aUuh2NmBdSQ3-k0RRWhL-V6RjlYbeDMKr1Q/exec` (already set in both HTML files). A sibling of Mission Control (same architecture, theme, offline-first API client, mastery/XP/Fault-List engine and Flight Deck patterns), re-targeted at Task 1: fifteen modules, four operating modes (TREND / COMPARE / SEQUENCE / SPACE), a 40-prompt bank of data-defined charts, a timed Writer with a rule-based pre-flight check, model answers with dissect/rebuild modes, teacher marking with optional AI estimates, assignments and projector games.

## Files

| File | Role |
|---|---|
| `index.html` · `student.js` | Student console: sign-in, Flight plan, Modules, Writer, Models, Fault list, Record, Settings, Live mission |
| `teacher.html` · `teacher.js` | Flight Deck: class stats, roster by cohort, heat maps, student diagnosis, marking queue, assignments, projector, CSV/Blooket export, printable report card |
| `theme.css` | Shared design tokens (verbatim from Mission Control) |
| `api.js` | Apps Script client with localStorage outbox and offline fallback (`cc.*` keys) |
| `engine.js` | Item renderer and marking, progress, Fault List, XP, badges, gate readiness, report record |
| `charts.js` | Dependency-free SVG renderers: line, bar, pie, table, process, map, mixed — from prompt data; theme-aware; tap-to-read values |
| `writer.js` | Timed editor (guided / exam) and the pre-flight structural checker; rule checks for free-text items; AI marking prompt |
| `bootcamp.js` | Bootcamp: the whole flight plan applied to one prompt as a guided, points-based, drop-down mission (8 steps, ~22 questions, hints and second choices, ranks Recruit → Ace, the 10-point pre-flight checklist) |
| `content.js` | Module registry, modes, ranks, badges, the error-tag dictionary (`REMEDIATION`) |
| `topic-00.js … topic-14.js` | The fifteen modules: theory, 435 items, systems checks |
| `prompts.js` · `prompts-2.js` | 40 original prompts with data, key features, groupings |
| `models.js` | 11 Band 8+ model answers (+ one Band 6 contrast) with dissect labels |
| `mocks.js` | Three exam-mode mocks |
| `roster.js` | Fast-access class lists (edit for M4.1 and the tutees) |
| `Code.gs` | Apps Script backend: Students, Attempts, Sessions, Reports, Assignments, Projector sheets; optional AI marking with `CC_tick` |
| `CONTENT-SCHEMA.md` | How to write more modules, prompts and models |
| `tools/validate.js` | Content validator (`node tools/validate.js`) |
| `tools/test-preflight.js` | Runs the pre-flight checker over every model answer |
| `tools/smoke.py` | Headless end-to-end test with screenshots (Playwright) |

## Deploy

1. Push the folder to a GitHub Pages repo (e.g. `pegasus028.github.io/Chart-Control/`). No build step.
2. Create a Google Sheet → Extensions → Apps Script → paste `Code.gs`. Set Script properties `TEACHER_PIN` (and optionally `ANTHROPIC_API_KEY`, `CC_MODEL`, `DAILY_MODEL_BUDGET`). Deploy as a Web app, *Execute as: Me*, *Access: Anyone*.
3. Paste the `/exec` URL into `window.CC_API_URL` in **both** `index.html` and `teacher.html` (or enter it on the Flight Deck sign-in / student Settings).
4. After every edit to `Code.gs`: Deploy → Manage deployments → pencil → **New version** → Deploy. Saving alone does not update the live endpoint.
5. Optional: run `installTick()` once in the Apps Script editor to mark queued reports in the background every ten minutes.
6. Edit `roster.js` with the real class lists.

With `CC_API_URL` empty, both consoles run entirely in the browser (demo/offline mode; teacher PIN 1234).

## How it fits the teaching plan

Modules 00–10 are the M4.1 course (weeks 1–12); 11–14 are the tutoring Phases 3–4 and exam day. The pre-flight check enforces the seven high-value findings (overview, figures in every body sentence, comparisons, no opinion/conclusion, no copied rubric, every category mentioned, 150–190 words). Gate readiness (TA/CC/LR/GRA) blends module mastery with the last three marked reports. Error tags are shared between module items, the pre-flight rows, the AI marker and the teacher heat map, so class data and tutoring data read the same way.
