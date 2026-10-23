# WS-I — Phase-1 integration (Variety of Writing 2), 23 October 2026

Branch `WS-I` from main 49ddfcf; merged in order WS-G (3 commits) → WS-J → WS-C → WS-B, then the reconciliations below. Nothing pushed by WS-I; the coordinator pushes after T.Chris's go-ahead.

## 1. Conflicts and how they were resolved
Only `index.html`, `teacher.html` and `QA-REPORT.md` conflicted, and only on `?v=` strings and report sections. Script tags were merged by union (every workstream's tag kept once, in the order its contract asks for), then **one version `?v=20261027a`** was set on every tag whose file differs from main, in `index.html`, `teacher.html` and `podcasts.html` (`media.js`). QA-REPORT keeps one section per workstream under the "Phase-1 integration" heading.

Final load order (index.html): roster · content · partners · prompts · prompts-2 · prompts-3 · **vw2-prompts** (WS-B/WS-D) · template · lab-* · models · mocks · topic-00…14 · **topic-15…17** (WS-J) · lesson-levels · **companion-levels** · media · charts · example-* · writer · bootcamp · engine · **companion-engine** · api · lab · story-content · audio indexes · sorting · story-words · story · **tickets-content · tickets** (WS-C) · **assembly-content · assembly** (WS-B) · student. CSS: theme · lab · story · writer · **companion** · **assembly**. teacher.html follows the same order without the student-only files.

## 2. Contract reconciliations

### (a) Code.gs — additive lines (redeploy needed)
In `doPost`, straight after the LAB-HOOK line:
```js
  /* TICKETS-HOOK — lesson tickets + Participation ledger (Tickets.gs). Reads run outside the lock. */
  if (String(req.action || '').indexOf('tickets.') === 0) return out(TICKETS_handle(req.action, req.payload || {}));
  /* ASM-HOOK — the Assembly's team points (Assembly.gs). Same pattern as the LAB-HOOK. */
  if (String(req.action || '').indexOf('asm.') === 0) return out(ASM_handle(req.action, req.payload || {}));
```
In `houses()`, before the `return`:
```js
  try { var asm = ASM_houseTotals(want); HOUSE_IDS.forEach(function (h) { totals[h] += asm[h] || 0; }); } catch (e) {}
```
WS-G's `resetPassword` action and reset-state `login` are in the same file. `Tickets.gs` and `Assembly.gs` must be pasted as new script files in the Apps Script project. `tools/gs-test.js`, `tickets-test.js` and `assembly-gs-test.js` load the real `Code.gs` and report the hooks present.

### (b) Teams sheet — one sheet, two row shapes, one reader
| | WS-C expected | WS-B writes (`Assembly.gs`, kept) |
|---|---|---|
| header | `ts, cohort, team, kind, studentId, points, game, round, json` | `ts, round, game, lesson, team, studentId, points, by` |
| membership | `kind = 'member'` rows | implicit: the row's `team` + `studentId` |
| points | `kind = 'points'` rows per TEAM, shared ÷ members | one row per STUDENT per posted round, carrying the team's round points |
| half | `ts` ≤ 2026-12-18 = H1 | same rule works (`ts` is the posting time); `lesson` also available |

Decision: change the **reader** (smaller: two functions in `tickets.js`), keep the writer. `teamOf()` treats a row without `kind` as a membership row; the points loop adds a kind-less row to the student's own total (`mine[sid]`) and to the team total. When any student-level rows exist, a student's share = her own sum (absent students earn nothing for that round, which is what "team missions" should mean); WS-C's `kind: 'points'` team rows still work as before. `Tickets.gs` `TK_teams_()` reads by header name, so no change there. Covered by `tools/tickets-test.js` ("Assembly.gs rows" checks).

### (c) Team ids (Groups tab → roster.js)
`tools/assembly-sync.js` `ALIAS` is now `{ airin: 'm41-ai', lilil: 'm41-lillil', donut: 'm41-donut' }`; `assembly-content.js` regenerated from WS-D's `vw2-games.json` (version 2026-10-23): 30 team ids, all present in `roster.js`. `tut-donut` stays the tutee's separate account. WS-C's default teams (`tickets-content.js`, by display name) already match WS-G's names Airin / Lilil / Donut. Added: the Assembly join card preselects the signed-in student's own team (`assembly.js` `paintLive`).

### (d) Load order and cache
See §1. `vw2-prompts.js` after `prompts-3.js`; `companion-engine.js` after `engine.js` and before `student.js`; tickets then assembly files before `student.js` / `teacher.js`; `media.js` bumped in `podcasts.html`.

## 3. Coordinator decisions applied
- **Grammar Wing and ranks.** `engine.js`: `CORE_LEVELS` = levels of topics without `wing: 'grammar'`; `Bank.coreLevels()`; `Progress.checksCleared(p)` counts core gates only (RANKS ladder tops out at 15, `director` badge needs the 15 core gates); `Progress.checksClearedAll(p)` counts every gate and is what `Story.housePoints` uses, so Grammar Wing gates still earn house points. Every "n/N classes" figure in `student.js` and `teacher.js` uses `coreLevels().length` (15). `content.js` Graduate badge: "Pass all 15 examiners' gates (the Grammar Wing is extra)."
- **Story ring.** `Story.missions(pr, ch, withOptional)`: without the flag (chapter ring on the map card, `nextMission`) optional rows are skipped; `paintChapter` passes `true` and labels them "Grammar Wing, optional". `tools/story-validate.js` checks both lists.
- **Launch quizzes** stay out of the 15 participation points (`ticketsSet` keeps `kind === 'E'`): confirmed as the current behaviour, nothing changed.

## 4. Tests on the merged tree
Node: validate · fairness · story-validate · gs-test · lab-gs-test · lab-check-test · lab-validate · template-test · models-check · examples-check · writer-test · save-order-test · ws-g-test · companion-test · tickets-test · assembly-test · assembly-gs-test — all green. Browser (`CHROME=/opt/pw-browsers/chromium-1243/chrome-linux64/chrome`): `smoke.py`, `lab-smoke.py`, `tickets-smoke.py`, `assembly-smoke.py` — all green, 0 console errors, 0 local 404s. The pre-push line in `docs/HANDOVER-2026-10-21.md` §1 should gain `ws-g-test`, `companion-test`, `tickets-test`, `assembly-test`, `assembly-gs-test` and the two new smokes.

## 5. For the next phase
- New modules (phase-2 Grammar Wing or Observatory classes): set `wing: 'grammar'` on a topic to keep it out of the ranks; omit it to count.
- New Assembly games write the same Teams rows; the ledger needs no change. If a game ever posts team-level rows, use `kind: 'points'`.
- Story missions that should not count toward a chapter: `optional: true`.
