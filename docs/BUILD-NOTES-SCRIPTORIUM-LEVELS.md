# Build notes — Scriptorium B1 / B2 / C1 levels, three panes, two clocks (IELTS-WT1)

Written 19 Nov 2026 by Claude (Opus 5.5) at the end of batch 1. What was built, how, and why. The next steps are in the handover: `IELTS-WT1/scriptorium-levels/HANDOVER.md` in the claude.ai Project "IELTS Writing Task 1", `docs/HANDOVER-SCRIPTORIUM-LEVELS.md` in the repo.

## 1. The request (T.Chris, 19 Nov 2026)

"Add B1 / B2 / C1 levels and the three-pane layout to the Scriptorium of my IELTS Writing Task 1 app … the same way you did for the Task 2 app (done 15 Nov 2026)." For Task 1, read "essay" as "report" and "prompt" as "chart". His Task 2 request, which this one copies:

> Please add 3 different CEFR selections (B1: Band 4.0-5.0, B2: Band 5.5–6.5, C1: Band 7.0-8.0) in the scriptorium landing screen under the level of guidance selection. The wording of the questions and the options presented for all prompts should be appropriate to the CEFR level selected. Please change wherever it appears "spine" or "spine words" to "template". Change the display when responding to each prompt to have 3 panes: 1) prompt pane placed horizontally as a floating pane at the top 2) construction pane on the left 3) Questions pane on the right. … Please count the number of times that a student answers incorrectly as a running total next to the countdown timer. Please evenly balance the placement of the correct answer within the 4 option positions. Please double check that the questions and answers sound natural. Finished essay should be CEFR level appropriate.

Added for Task 1, in his words:
- "please hide the 2 header panes i.e. 'User name, course progress...' and 'Map room, classes...' so that it displays better."
- "please have two timers, a countdown timer based on recommended time splits 5/30/5min with label i.e. triage/writing/review and a second countdown timer for the total time for the prompt 20min"
- "please co-ordinate with Fable 5.2 where appropriate."
- Test on p-line-museums at all three levels first and wait for his review before the other charts; push to GitHub as each batch passes its tests.

## 2. What is live (main `6400ab5`, `?v=20261119b` on guide.js and writer.css, `20261119a` on the rest)

| Commit | What |
|---|---|
| `0635bff` | Engine, level choice, three-pane layout, two clocks, wrong count, balanced positions, tests, docs |
| `6400ab5` | Layout fit: chart without task sentence and title beside the question; tighter card on short screens; no empty chart box on phones |

**Nothing in the script content has changed yet.** No B1 or B2 script exists; every chart opens at C1 (the original scripts) with a toast when B1 or B2 is chosen.

### Files changed
- `guide.js` — levels, `placeOf` / `options(step, script)`, the new mount (layout, clocks, wrong count), `Guide.CEFRS / base / keyOf / hasAny / placeOf / BAND / phases` exported.
- `student.js` — `scrCefr()`; the B1/B2/C1 radios in `paintWriter`; `startWrite` passes `cefr`, loads the level, falls back to C1 with a toast; `show()` toggles `body.writing`.
- `writer.js` — `mount` hands High/Medium to the guide when a script exists at the chosen level or the base level, passing `cefr`.
- `writer.css` — the three-pane rules at the end (`body.writing`, `.gd-top`, `.gd-timer`, `.gd-grid`, `.gd-side`, phone rules under 720 px, short-screen rules at `max-height:900px`).
- `tools/guide-test.js` — level files; new `tools/guide-smoke-all.py`.
- `docs/GUIDE-AUTHORING.md` §11 (levels standard for writers), `docs/GUIDANCE-LEVELS.md` (last section), `QA-REPORT.md` (19 Nov section).
- `index.html`, `teacher.html` — `?v=` bumps, `GUIDE_VERSION`.

## 3. How it works

**Levels.** `guide/<id>.js` (key `<id>`) is the **base level, C1** (the 48 original scripts read at Band 8). New levels: `guide/<id>.b1.js` and `guide/<id>.b2.js` (keys `<id>.b1`, `<id>.b2`, `tier: 'B1'|'B2'`, `promptId` = the bare id), cases `tools/guide-cases/<key>.json`; `node tools/guide-test.js --index` lists every key in `guide-index.js`. `window.GUIDE_BASE_CEFR` changes the base level in one place (if T.Chris says the existing scripts are B2, set it to `'B2'` and new files become `.b1` / `.c1`; `tools/guide-test.js` `BASE` and `tools/guide-smoke-all.py` `BASE_CEFR` must change with it, and the file regex already accepts `.c1`).
- API: `Guide.has(id, cefr)`, `ready`, `load(id, cefr, done)` (the old `load(id, done)` still works), `script(id, cefr)`, `hasAny(id)`, `keyOf`.
- Landing: `input[name=cefr]` under the guidance radios (B1 Band 4.0–5.0 · B2 Band 5.5–6.5 · C1 Band 7.0–8.0). Default = her Track (`S.p.tier`: Band 6 track = B1, Band 7 = B2, Band 7.5+ = C1); her choice is saved as `S.p.scrCefr` with the whole progress (`sync()`). The "step by step" pill and the note reflect the chosen level.
- Saved run key `cc.guide.v1.<student>.<prompt>.<level>[.<cefr>]`; C1 keeps the old key so runs saved before 19 Nov come back.
- `plan.guide` (stored in the report's existing JSON) gains `cefr`, `wrong`, `phaseSeconds`. No Sheet column, no Code.gs change, no redeploy needed.

**Answer positions.** `placeOf(step, script)`: per script, blocks of four steps each use a hashed permutation of the four places; a block never starts on the place the last one ended on. Result: each place holds the right answer equally often (±1), never twice in a row. All 48 scripts pass max − min ≤ 1 (museums was 11 / 9 / 11 / 15 before).

**Layout (High and Medium only; Low and Exam unchanged). Four panes since the evening of 19 Nov (his second request); the morning's three panes, `placeQ()`, `#gd-sidein`, `#gd-chartslot` and "Chart ▾" are gone.** Full description: `docs/GUIDANCE-LEVELS.md, last section`.
- `body.writing` hides `header.bar` while `#view-write` is shown; the writing view widens to 1360 px (`.wrap:has(.gd)`).
- Top `#gd-top` (sticky): bar (✕, `#gd-secs`, `#wr-words`, `#gd-tphase`, `#wr-clock`, `#gd-wrong`, `#gd-expand`) + `#gd-strip` (plan `#gd-tlist` two columns; `#gd-s0–3` four rows each, scrolling). Left `#gd-fig` (meta, task, chart with title; `fitChart()`). Right `#gd-side` > `#gd-q`. Bottom `#gd-full` (report `#gd-p0–3`, plan, finish card, `#wr-panel`): `paintFull()` / `scrollToFull()`.
- `narrow()` = width < 720 or height < 560 (phone mode: only the bar sticks); `stacked()` = width < 900 (chart above question).
- Kept every id the tests and harness use: `#gd-q`, `.gd-opt`, `#gd-hint`, `#gd-p0–3`, `#gd-box0–3`, `#gd-wards`, `#wr-quit`, `#wr-clock`, `#wr-words`, `#wr-panel`, `#gd-in`, `#gd-commit`, `#gd-keep`, `.gd-ta`, `#gd-prompt .gd-pmeta`, `#gd-tphase-l`, `#gd-wrong-n`.

**Two clocks.** `GUIDE_PHASES` default `[['triage','Triage',240],['writing','Writing',780],['review','Review',180]]`, total 20:00. Default mode follows activity: Triage while she answers triage steps, Writing from the first introduction step, Review from the finished card (Wards, Send); each phase counts down its own time from `state.ph` (ms per phase, saved with the run, capped at 5 s per tick so a sleeping tab does not jump). `window.GUIDE_PHASE_BY = 'clock'` switches to fixed times. Past zero: red "+m:ss", nothing stops her. Amber when ≤ 30 s (phase) / ≤ 60 s (total).

**Wrong count.** `bumpWrong()` on each greyed High option and each Medium send-back (`revise()`); saved with the run; shown on the finish card ("2 wrong answers in all") and sent in `plan.guide.wrong`. "Start again" resets it.

## 4. Decisions taken on T.Chris's behalf (recommendations sent 19 Nov, not yet answered)

The ten questions went to him in one message; batch 1 uses the recommendations. Each is a small change if he chooses otherwise:
1. Existing 48 scripts = **C1** (base level). → `GUIDE_BASE_CEFR`.
2. Chart placement: **superseded** by his four-pane request (evening, 19 Nov): chart in the left pane.
3. Default level = Track; choice saved as `scrCefr`.
4. "Spine" → "template": nothing to change (no "Spine" anywhere in WT1).
5. 160–190 words at every level.
6. **His 5/30/5 is the Task 2 split (40 min).** Used Triage 4 / Writing 13 / Review 3 = 20 min (the app's flight plan 0:30 / 4:00 / 17:00 / 20:00). → `GUIDE_PHASES`. The alternative he may pick: 2:30 / 15:00 / 2:30.
7. Phase follows activity, red overtime, never stops. → `GUIDE_PHASE_BY`.
8. Two clocks on High and Medium only; Low/Exam already have a 20-min countdown (writer.js `PHASES` Triage/Plan/Write/Check) — recommended relabel to Triage / Writing / Review **not done yet** (waits for his answer).
9. Header hidden while a report is open, all four modes (it is done via `show('write')`, so Low and Exam hide it too).
10. Band labels exactly as his Task 2 ones.

## 5. Things learned while building

- The right column must fit iPad landscape (1180×820): with the chart (~265 px) and the card (~450 px) the fourth option fell below the screen. Fix: chart drawn with `showRubric: false, showTitle: false`, svg height `clamp(170px, 100vh − stick − 470px, 260px)`, tighter card at `max-height:900px`, `sidein.scrollTop = 0` each step. The chart's labels are small there; the tap readout gives exact values.
- `Charts.render` draws at the host's width and redraws only on resize, so `drawChart()` runs again whenever the chart element moves between the side and the phone slot.
- Playwright `inner_text` returns CSS-uppercased text ("REVIEW"); use `text_content` for the clock label.
- A level file copied from `p-line-museums.js` must rename every `G['p-line-museums']` (the file sets `askFree` / `ai` from two maps at the end), or it fails to run. The test was piloted this way on a throwaway B1 copy in `/tmp`: it ran, found the B1 hint-length limits, and models-check ran on `g-p-line-museums.b1`.
- Push: the session's `register_repo_root` accepts only `/home/claude/ielts-wt1` (a symlink to an existing clone works); "This repository moved" on push is harmless (real name `IELTS-WT1`).
- Live check without signing in: built-in browser, `index.html?v=<new>`, check `GUIDE_VERSION`, `Guide.hasAny`, `Guide.phases()` and the console with JavaScript. Pages took about 2 minutes; the first load served the old files.
- The Duelling Hall (`bootcamp.js`) does not use guide scripts, so the levels have no duel answer sets to match (unlike Task 2).

## 6. Test status at `6400ab5`

All green: validate, fairness, story-validate, gs-test, lab-gs-test, lab-check-test, lab-validate, template-test, models-check, examples-check, writer-test, save-order-test, ws-g-test, companion-test, tickets-test, assembly-test, assembly-gs-test, guide-test (120,529 checks · 48 scripts), smoke.py, lab-smoke.py, tickets-smoke.py, assembly-smoke.py, guide-smoke.py, guide-smoke-all.py (p-line-museums, p-bar-homework, p-map-park). 390 px: no sideways overflow, no console errors. Live site: new version served, no console errors.
