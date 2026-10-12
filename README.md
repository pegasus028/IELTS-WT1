# Quillmoor Academy · The Observatory — IELTS Academic Writing Task 1

Self-study app for Thai students aged 13–17 (CEFR B1/B2) working towards **Band 7.5+ in Academic Writing Task 1**, with a Staff Room for the teacher. It is the Task 1 sibling of the Task 2 app (https://pegasus028.github.io/IELTS-WT2/): same architecture, story world (Quillmoor), offline-first API client and teacher tools, re-targeted at charts, tables, processes and maps.

Live: https://pegasus028.github.io/IELTS-WT1/ · Staff Room: `teacher.html`

## The method in one line
Every student builds a **personal Spellbook** (her own template, one page per mode: TREND, COMPARE, SEQUENCE, SPACE), practises **casting** it onto real charts (filling the variables with figures that the app checks against the data), then writes timed reports in the Scriptorium with the **Ten Wards** (the 10-point check) and teacher/AI marking on the gate ladder.

## Two cohorts, one story
| Cohort | Who | Story experience |
|---|---|---|
| Returning readers | Tutoring group: Aeh, JingJing, Pear, Mikii, Donut, Soda (`tut-*`) | Already know Quillmoor from Task 2. They keep their house (picked on first sign-in), skip the welcome, and get "welcome back" titles, blurbs and map intro. |
| New readers | M4.1 (29 listed from the Task 2 scans, `m41-*`; anyone missing uses "Create account") | Full introduction: arrival, Sorting, the house tour, then the chapters. |

`p.story.returning` is set from the roster cohort (Tutoring), from Task 2 progress on the same device, or by the student in **Your Trunk** (toggle).

## The eight chapters (The Observatory and the silent weathercock)
Each chapter unlocks after real work (module checks, Spellbook pages, casts, Duelling Hall, full reports of 150+ words, mocks). Keepsakes: key, charm, spyglass, clasp, scales, vial, press, seal. Only **teacher-released marks** count towards the final seal; an AI estimate never does. Chapter content: `story-content.js`; engine: `story.js`; pictures: `story/` (57 reused Task 2 storybook pictures, see `docs/IMAGE-CATALOGUE.md`).

## Main areas (student)
- **Classes** — 15 modules (435+ items), "The examiner's gate" readiness (TA/CC/LR/GRA).
- **My Spellbook / Spellbook Workshop** (`template.js`, `lab.js`) — design pages at 60/50/40/30 % template share, Test Drive on Thai scenarios, cast onto 48 bank prompts with a rule-based data check (✓ / ≈ / ✗), record by mode, AI-simulated worked examples (Nam B1, Fah B2).
- **Scriptorium** (`writer.js`) — spellbook / guided / exam modes; timed phases (triage 0:30, plan to 4:00, write to 17:00, check to 20:00); the Ten Wards: overview without figures, every category, comparisons, no opinion/conclusion, copied rubric (10+ words = red and not counted), unfilled `[Slot]`s, length tiers.
- **Duelling Hall** (`bootcamp.js`) — the whole plan on one prompt as a guided mission.
- **Exemplar Archive** — 48 Band 8+ models with dissect mode and "Mine vs model".
- **Reading Room / word cards** — 597 cards (`story-words.js`), sorting games (`sorting.js`).
- **Your Trunk** — settings, track (B1 / B2 / C1), returning toggle.

## Staff Room (teacher)
Class stats by cohort, heat maps by error tag, student diagnosis, story progress, Spellbook panel by mode, marking queue with AI estimate (ceilings, next gate) and "AI estimate all", release of marks, assignments (including spellbook mode), House Cup, projector games, CSV and printable report card.

## Files
| File | Role |
|---|---|
| `index.html` · `student.js` | Student app |
| `teacher.html` · `teacher.js` | Staff Room |
| `theme.css` · `story.css` · `lab.css` | Styles |
| `api.js` | Apps Script client, `cc.*` keys, outbox and report queue (`cc.repbox.v1`) |
| `engine.js` | Items, progress, XP, badges, gates |
| `charts.js` | SVG charts from prompt data (line, bar, pie, table, process, map, mixed) |
| `writer.js` · `bootcamp.js` | Scriptorium and Duelling Hall |
| `template.js` · `lab*.js` | Spellbook and Workshop |
| `story.js` · `story-content.js` · `sorting.js` · `story-words.js` | Story layer |
| `content.js` · `partners.js` · `topic-00..14.js` | Modules, ranks, badges, error tags |
| `prompts.js` · `prompts-2.js` · `prompts-3.js` | 48 prompts |
| `models.js` · `models-2.js` · `mocks.js` | 48 models, mocks |
| `roster.js` | Class lists (M4.1, Tutoring) |
| `media.js` · `podcasts.html` · `audio/` | Media slots (empty until recorded) |
| `Code.gs` · `Lab.gs` | Apps Script backend |
| `QUILLMOOR-T1-SPEC.md` · `docs/` | Build spec, Lab notes, QA log, Reading Room notes |

## Tests
```
node tools/validate.js          # content, ES5 guard, TAGS mirror
node tools/story-validate.js    # story chapters, gates, pictures
node tools/gs-test.js           # Code.gs in Node (auth, stale-save guard, AI marking)
node tools/lab-gs-test.js       # Lab.gs
node tools/lab-check-test.js    # Spellbook data checks
node tools/lab-validate.js
node tools/template-test.js
node tools/models-check.js
python3 tools/smoke.py          # Playwright: both cohorts, Staff Room, phone width
```

## Deploy
1. GitHub Pages serves this repo; no build step.
2. In the Google Sheet's Apps Script project: **replace `Code.gs`** with this version and **add `Lab.gs`** as a new file. Script properties: `TEACHER_PIN` (required), optional `ANTHROPIC_API_KEY`, `CC_MODEL`, `DAILY_MODEL_BUDGET`.
3. Deploy → Manage deployments → pencil → **New version** → Deploy. Saving alone does not update the live endpoint.
4. Optional: run `installTick()` once to AI-estimate queued reports every ten minutes.
5. `window.CC_API_URL` is set in `index.html` and `teacher.html`. With it empty the app runs fully offline (demo mode).
6. Narration: `tools/build-narration.py` and `tools/build-lesson-audio.py` (need network access to edge-tts); until then the app uses the browser voice.
