# Handover — Scriptorium B1 / B2 / C1 scripts, pilot then the other 47 charts (IELTS-WT1)

Written 19 Nov 2026 by Claude (Opus 5.5). For the chat that continues the Scriptorium levels work in T.Chris's Task 1 app (Quillmoor Academy · The Observatory, repo `pegasus028/IELTS-WT1`, live https://pegasus028.github.io/IELTS-WT1/). What is already built, and why: the build notes (`IELTS-WT1/scriptorium-levels/BUILD-NOTES.md` in the claude.ai Project "IELTS Writing Task 1"; `docs/BUILD-NOTES-SCRIPTORIUM-LEVELS.md` in the repo). This file does not repeat it. It replaces the earlier `HANDOVER-WT1-SCRIPTORIUM-LEVELS.md` (19 Nov, morning).

## 1. Read first, in this order
1. Skills: `task-router`, then `ielts-writing-task-1`, `ielts-task1-expert` (§1d = this work), `en31208-vow2`; `built-in-browser` for the live check.
2. The build notes (what is live and how it works).
3. In the repo (`git clone https://github.com/pegasus028/IELTS-WT1`): `docs/GUIDE-AUTHORING.md` (all, §11 above all), `guide/p-line-museums.js` + `tools/guide-cases/p-line-museums.json` (the model script), `guide.js`, `tools/guide-test.js`, `docs/GUIDANCE-LEVELS.md` (last section), `QA-REPORT.md` (19 Nov).
4. For reference only (the same change in Task 2): `pegasus028/IELTS-WT2` `docs/GUIDE-AUTHORING-T2.md` §12 and `docs/GUIDE-FINDINGS-2026-11-15.md` (what level writers reported there: B1 sets that were really B2, over-ornate C1 wording, near-misses that were fair answers).

## 2. Decisions already made
- Engine, layout, level radios, two clocks, wrong count, balanced positions: **built and live** (main `6400ab5`). Do not rebuild them.
- Scripts are hand-written per chart and level; the engine places the right option; writers never do.
- Every level keeps the Task 1 report rules: four paragraphs, 160–190 words (recommended; see Q5), overview with no data, a figure in every TREND/COMPARE body sentence, every category named, ≥ 2 comparisons, a 7→8 add-on, every figure checked by models-check.
- Hints never contain the right option's words or its figure. Mock and weekly-exam charts never get a script. Student-facing text is gender-neutral. ES5 only.
- Model split (T.Chris: "co-ordinate with Fable 5.2 where appropriate"): Fable writes what everything else copies and does the final review; Opus does the parallel bulk; **nothing is reviewed by the model that made it** (see §4).

## 3. Ask T.Chris before any script content (unless he has already answered in the earlier chat; ask him)
The ten questions went to him on 19 Nov at 13:50 and were **not answered** in that chat. Ask once, in one message, recommendations marked; then go.
1. **Which level are the existing 48 scripts?** Their reports read at Band 8; their questions are B1 English. *Rec.: C1* (keep `guide/<id>.js` as C1, give their questions and hints a C1 wording pass, write new B1 and B2). Built that way already; if he says B2, set `GUIDE_BASE_CEFR = 'B2'` (guide.js reads it), `BASE` in `tools/guide-test.js` and `BASE_CEFR` in `tools/guide-smoke-all.py`, and new files become `.b1` / `.c1`.
2. **Chart placement.** Answered by his four-pane request (19 Nov, evening): chart in the left pane, question right, plan and paragraphs in the top strip, report in the bottom pane. Do not ask.
3. **Default level** = her Track, choice remembered. *Rec. (built).*
4. **"Spine" → "template":** the Task 1 app never says "Spine". *Rec.: skip.*
5. **Report length** 160–190 at every level. *Rec.: yes.*
6. **Timer split.** He wrote 5/30/5 (the Task 2 split of 40 min) with a 20-min total. *Rec. (built):* Triage 4 / Writing 13 / Review 3. Alternative: 2:30 / 15:00 / 2:30. Change = `GUIDE_PHASES` default in guide.js.
7. **What the phase clock follows.** *Rec. (built):* where she is, red overtime, no stop. Alternative: fixed times (`GUIDE_PHASE_BY = 'clock'`).
8. **Low and Exam clocks.** *Rec.:* keep them on Low/Exam (they already count down 20 min) and relabel writer.js `PHASES` from Triage / Plan / Write / Check to Triage / Writing / Review at 4 / 13 / 3. **Not built** — do it if he agrees (writer.js ~line 585; check `tools/writer-test.js` and `tools/smoke.py` for the old labels).
9. **Header hidden** while a report is open, all modes. *Rec. (built).*
10. **Band labels** exactly as in Task 2. *Rec. (built).*

## 4. Workstreams, models and order

| # | Workstream | Builds | Reviews | Depends on |
|---|---|---|---|---|
| W1 | Pilot: `p-line-museums.b1.js` + cases | Fable 5.2 | Opus (lead) | Q1, Q5 |
| W2 | Pilot: `p-line-museums.b2.js` + cases | Fable 5.2 | Opus (lead) | Q1, Q5 |
| W3 | Pilot: C1 wording pass on `p-line-museums.js` (questions, hints, wrong options at C1; report unchanged unless wrong) | Fable 5.2 | Opus (lead) | Q1 |
| W4 | Send T.Chris the three reports + screenshots at each level; **wait for his review** | lead | T.Chris | W1–W3 |
| W5 | Fold his review into `docs/GUIDE-AUTHORING.md` §11 and the brief | lead | — | W4 |
| W6 | The other 47 charts at B1 and B2 (94 scripts) + C1 wording pass on 47: e.g. 12 groups of ~4 charts; each Opus writer does B1 + B2 + the C1 pass for its group | Opus 5.5 writers in parallel | Fable 5.2 (final review per batch) | W5 |
| W7 | Findings file (`docs/GUIDE-FINDINGS-2026-11-xx.md`): bank errors the writers report, not fixed | lead | — | W6 |
| W8 | Final: full test line, guide-smoke-all on every key in the background (~30 min), phone check, live check, docs, skill notes | lead | Fable 5.2 (independent review of a sample) | W6 |

Run W1–W3 as three background Fable agents, each in its own scratch copy (`cp -r` the repo to `/tmp/w-<tag>`). The lead (Opus) reviews: reads every question, option and hint aloud; checks the level (B1 short and plain, C1 precise), the report at its level, and that each wrong option has exactly one planned error.

## 5. Working rules (from the Task 2 build and this one)
- Each writer works in its own scratch copy, never in the main clone, and lists **every** file it changed. The lead copies only those files across, runs `node tools/guide-test.js --index`, tests, commits.
- A level file copied from the model must rename **every** `G['p-line-museums']` (the model sets `askFree` / `ai` from two maps at the end).
- A fix to a shared tool goes to every running writer by SendMessage ("copy it, don't patch it").
- Push batches to main as they pass: usually only `guide/`, `tools/guide-cases/`, `guide-index.js?v=` and `GUIDE_VERSION` change (bump both in `index.html`).
- Before telling T.Chris what is left, count it from the files (`ls guide/*.b1.js | wc -l` …).
- Never write to the live Sheet; browser tests use the mock backend (`localStorage cc.apiUrl = 'off'`, as the smoke scripts do).
- No backend change is needed. Only if the AI check should know the level (`cefr` passed to `guideCheck` in Code.gs) does Code.gs change; then redeploy as a **new version of the existing deployment** with `apps-script-deploy`, never New deployment.
- Push access: `add_repo` (push), clone to or symlink `/home/claude/ielts-wt1` for `register_repo_root`; "This repository moved" on push is harmless.

**Writer brief** (give each writer this, plus its chart ids, level(s) and scratch path):
> You are writing High / Medium guidance scripts for T.Chris's IELTS Writing Task 1 app. Students: Thai, 15–16, mostly B1/B2; text gender-neutral. The existing `guide/<id>.js` scripts are C1. New levels: `guide/<id>.b1.js` (key `<id>.b1`, `tier: 'B1'`) and `guide/<id>.b2.js` (key `<id>.b2`, `tier: 'B2'`), cases `tools/guide-cases/<key>.json`; `promptId` stays the bare id. Read in full first: `docs/GUIDE-AUTHORING.md` (§11 above all), `guide/p-line-museums*.js` and their cases (the approved pilot), your chart in `prompts*.js` and its model in `models*.js`. Work only in your scratch copy; write only your level files (and, for a C1 wording pass, `guide/<id>.js` and its cases); no git commands that change anything; ES5 only. Test with `node tools/guide-test.js --index && node tools/guide-test.js <key> --essay` until all checks pass. Read every question, option and hint aloud before you finish. Never fix the chart data or its model; list what looks wrong. Report: every file you changed (full paths); per script the step count, word count, printed report, long-word % and words per question; three sample steps per level; anything that looked wrong.

## 6. Acceptance checks
- `node tools/guide-test.js` all green for every key; `guide-index.js` lists 144 keys when done (48 × 3).
- `python3 tools/guide-smoke-all.py` (no args, background) passes every key; `tools/guide-smoke.py` passes.
- The full test line in `ielts-task1-expert` §1 passes; 390 px: no sideways overflow, no console errors.
- Per level, a spot check by the lead (pilot) or Fable (bulk): B1 reports short sentences and core verbs, ~4–8 % long words; B1 questions ≤ 22 words, hints ≤ 30; C1 questions may name the function; every wrong option has one planned error; nothing sounds unnatural.
- Live: the level radios, one chart at each level, the bar under the ribbon, the clocks and the wrong count (built-in browser; signing in to a test account is T.Chris's to do, or check by JavaScript without signing in).
- Docs: `QA-REPORT.md` dated section per batch, `docs/GUIDANCE-LEVELS.md`, the findings file; offer T.Chris the skill-note update (`ielts-task1-expert` §1d).

## 7. Status (19 Nov 2026, 16:15)

| Item | State |
|---|---|
| Engine, clocks, wrong count, balance, level radios | live, main `6400ab5` |
| Four-pane layout (replaces three panes) | live (19 Nov evening) |
| Tests (guide-test level files, guide-smoke-all) | live, piloted on a throwaway B1 copy |
| Authoring standard §11 (levels) | written; update after the pilot review |
| The ten questions | sent 19 Nov, **unanswered** |
| Pilot p-line-museums B1 / B2 / C1 pass | **not started** (waits for Q1) |
| Low/Exam clock relabel (Q8) | not started |
| Other 47 charts | not started (waits for the pilot review) |

## 8. Opening message for the new chat
> Please continue the B1 / B2 / C1 levels for the Scriptorium of my IELTS Writing Task 1 app (repo pegasus028/IELTS-WT1). The engine and three-pane layout are already live. Read `IELTS-WT1/scriptorium-levels/HANDOVER.md` and `BUILD-NOTES.md` in this Project (also in the repo's `docs/`), load the skills it names, and ask me the questions in its §3 that I have not answered yet, in one message. Then build the pilot on p-line-museums at B1, B2 and C1 with Fable 5.2 writing and Opus reviewing, send me the three reports with screenshots, and wait for my review before the other charts. Push to GitHub as each batch passes its tests.
