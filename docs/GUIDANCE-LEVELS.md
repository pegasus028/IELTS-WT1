# Scriptorium guidance levels (12 Nov 2026) — build contract

Asked by T.Chris: replace Spellbook / Guided / Exam with four guidance levels, tested first on `p-line-museums`.

| uiMode | Name | Left side | Right side |
|---|---|---|---|
| `high` | High guidance | one multiple-choice question per decision, one right answer, wrong option greyed + hint, repeat until right | four panes built from the chosen fragments (read-only) |
| `medium` | Medium guidance | the same questions as free text, a Commit button each, AI check against the expected value, hints, "Commit unchanged" override | four panes built from her committed text (editable at the end) |
| `low` | Low guidance | the old Guided mode + introduction prompts in the plan (visual, verb, what, units, where, when) | four boxes she types in |
| `exam` | Exam | chart only | one blank page |

Old values: `guided` → `low`. `spellbook` is no longer offered in the Scriptorium; it still runs for a template assignment (owl) so the A1–A4 coursework keeps working.

## Files
- `guide.js` — the engine: `Guide.has(promptId)`, `Guide.script(promptId)`, `Guide.essay(script, answers)`, `Guide.localCheck(step, entry)`, `Guide.mount(host, cfg)`.
- `guide/<promptId>.js` — `window.GUIDE_SCRIPTS[promptId]`: one hand-written script per chart (all 48 since 13 Nov 2026), fetched on demand; `guide-index.js` lists them. Standard: `docs/GUIDE-AUTHORING.md`. Medium cases: `tools/guide-cases/<promptId>.json`.
- `writer.js` — `mount()` hands `high` / `medium` to `Guide.mount`; `low` adds the introduction prompts.
- `Code.gs` — action `guideCheck` (below); reports with `uiMode: 'high'` are not sent to the examiners' panel.
- `tools/guide-test.js`, `tools/guide-smoke.py`.

## Script shape (as built; full field notes at the top of guide-content.js)
```
GUIDE_SCRIPTS['p-line-museums'] = { promptId, version, proper: [names that keep their capitals],
  sections: [ { id:'triage'|'intro'|'overview'|'detailA'|'detailB', title, note, pane: null|0|1|2|3,
    steps: [ { id, label, ask, askFree,        // ask = High wording; askFree = the same decision as a writing task (Medium)
               ok,                             // the right option = the text that goes into the pane
               wrong: [[option, hint] x3],     // each wrong option has its own hint
               pre, post,                      // what the engine puts before (default ' ') and after (',' '.') the text
               shape, expect,                  // Medium: what to type; the expected value sent to the AI check
               accept: [[alt, alt], ...],      // Medium rule check: every group needs one alternative (regex, case-insensitive)
               reject: [{ re, hint }],         // Medium rule check: known slips with their own hint (no AI call)
               hint, hint2, ai, tag } ] } ] }  // ai:true = the AI also reads an entry the rules accept
```
A hint never contains the right option's words, and never spells it out (first letter, "two dots" and so on).

Medium, in order: capitals of names -> known slip (`reject`) -> rules satisfied (`accept`) -> AI check (only when the rules are unsure, or the step is `ai:true`) -> her choice: edit and Commit again, or "keep my answer as it is" (the override). With no AI (offline, old deployment, budget spent, slower than 12 s) the rules decide alone.
A run is kept on the device (`cc.guide.v1.<student>.<prompt>.<level>`: answers, greyed options, hints, polished text) until the report is sent.

## Server action `guideCheck`
Request (student token, as every student action): `{ action:'guideCheck', token, promptId, stepId, section, ask, expect, entry, soFar }`
- `ask` the question, `expect` the expected value in words, `entry` her text (cut to 300 characters), `soFar` the pane text before this step (cut to 600).
Response: `{ ok:true, verdict:'accept'|'revise', hint:'…', source:'ai'|'cache' }` or `{ ok:false, error:'…' }` (no key, budget spent, unknown student). The client falls back to its own rule-based check on any `ok:false` or network failure, so an old deployment still works.
Rules for the server:
- no script lock around the model call; a small, fast model (script property `CC_GUIDE_MODEL`); own daily budget (`GUIDE_DAILY_BUDGET`, default 1500) and a per-student daily cap (`GUIDE_STUDENT_CAP`, default 200), separate from the marking budget;
- accept when her entry means the same as `expect`, is accurate for the chart and is correct English for its place in the sentence, even if worded differently; a spelling or grammar slip is sent back and the hint names the kind of slip;
- `hint`: one or two short sentences at B1 level that say what kind of thing is wrong; it must not contain the expected words (the server blanks a hint that does and sends a neutral one);
- entry, ask, expect and soFar are fenced as material, never instructions;
- cache by (promptId, stepId, normalised entry) for six hours.

## CEFR levels, the four-pane layout and the two clocks (T.Chris, 19 Nov 2026)

Ported from the Task 2 app (IELTS-WT2, 15 Nov 2026) with Task 1 changes. Handover: `HANDOVER-WT1-SCRIPTORIUM-LEVELS.md`.

- **Level choice.** Under the guidance level the Scriptorium shows B1 (Band 4.0–5.0), B2 (Band 5.5–6.5) and C1 (Band 7.0–8.0) (`input[name=cefr]`). It starts at her Track (`S.p.tier`) and her own choice is saved as `S.p.scrCefr` with the whole progress. High and Medium load `guide/<id>.js` (C1, the original 48 scripts: their reports read at Band 8), `guide/<id>.b1.js` or `guide/<id>.b2.js` (keys `<id>`, `<id>.b1`, `<id>.b2` in `guide-index.js`). If the chosen level has no script yet the chart opens at C1 with a toast. Low and Exam do not use the level. `window.GUIDE_BASE_CEFR` would change the base level in one place.
- **Saved runs.** The key gains the level: `cc.guide.v1.<student>.<prompt>.<level>.<cefr>`; C1 keeps the old key, so runs saved before 19 Nov come back.
- **Layout (High and Medium), four panes (T.Chris, 19 Nov 2026, second request; replaces the three panes).** The app's header (name, Classes passed, Candles, Merits) and the room menu are hidden while a report is open (`body.writing`) and come back on ✕ or send; the writing view widens to 1360 px.
  - **Top** (`#gd-top`, sticky under the ribbon): the bar (✕, section pills, word count, **phase clock** `#gd-tphase`, **total clock** `#wr-clock`, **wrong count** `#gd-wrong`, **Expand ▾** `#gd-expand`), the progress line, and the strip `#gd-strip`: the Plan (`#gd-triage` > `#gd-tlist`, triage answers in two columns) and the four paragraphs (`#gd-sc0–3` > `#gd-s0–3`, word count `#gd-sw0–3`), each body four text rows high, scrolling, kept at its newest words; the column being built is outlined in gold.
  - **Left** (`#gd-fig`): the level, CEFR band, chart type and mode (`#gd-prompt .gd-pmeta`), the task sentence (`#gd-ptext`), the chart with its title and units (`#wr-chart`; tap a point to read it). The chart is sized so that the pane fits the screen under the top (`fitChart()`); a chart and a table together scroll inside the pane as a last resort.
  - **Right** (`#gd-side`): the question card `#gd-q` and a short how-to line.
  - **Bottom** (`#gd-full`): the whole report (`#gd-box0–3` > `#gd-p0–3`; Medium's polish textareas `#gd-ta0–3` at the end), the plan, and, once finished, the finish card (`#gd-q` moves here) and the Ten Wards (`#wr-panel`). Shown only when the report is finished or while Expand is on; whenever it opens the strip folds away and the page scrolls so the pane fills the screen under the bar (`paintFull()`, `scrollToFull()`). "Collapse ▴" / "Back to the question ▴" closes it mid-run; once finished the button reads "Report ▾" and scrolls back to it.
  - **720–899 px (iPad portrait):** the section pills and word count leave the bar; the strip scrolls sideways about three columns at a time (it follows the part being built); the chart sits above the question; the finish card comes before the report.
  - **Under 720 px, or a screen under 560 px high (phones, phone landscape):** only the bar sticks; the strip sits under it and scrolls sideways one column at a time; the chart (task sentence clamped to two lines with "Show the whole task") sits above the question. After each answer the page scrolls so the whole question card shows, keeping as much chart above it as fits.
  - Expand mid-run: answering a step with the question on screen, or scrolling back up until the report is off the screen, folds the report away and brings the strip back. A finished run reopened scrolls straight to the report. Medium's polish boxes grow to their text.
- **The two clocks.** `GUIDE_PHASES` (default Triage 4:00 · Writing 13:00 · Review 3:00, total 20:00). By default the phase follows where she is (the triage steps; the four paragraphs; the finished report and the Wards), each phase counting down its own time; `window.GUIDE_PHASE_BY = 'clock'` switches to fixed times. Past zero both clocks show red overtime ("+1:20"); nothing stops her. Seconds per phase are saved with the run and sent in `plan.guide.phaseSeconds`.
- **Wrong count.** Every greyed option at High and every send-back at Medium adds one (`state.wrong`, saved with the run); the finish card and `plan.guide` (`wrong`, `cefr`) carry it. No Sheet column changes.
- **Answer positions.** `Guide.options(step, script)` places the right option by `Guide.placeOf()`: blocks of four permutations per script, never the same place twice in a row (tested: max − min ≤ 1 per script). All 48 C1 scripts pass.
- **"Spine" → "template":** nothing to change; the Task 1 app never says "Spine".
- Tests: `tools/guide-test.js` (every level file; tier = file level; bare promptId; B1 question ≤ 22 words, hint ≤ 30; balance), `tools/guide-smoke.py` (the full flow on p-line-museums), `tools/guide-smoke-all.py [key …]` (every script at its level in the browser; ~30 min for all levels: run it in the background). Writers' standard: `docs/GUIDE-AUTHORING.md` §11.
