# Cross-group contracts from WS-C (Tickets module + Participation ledger)

Branch `WS-C`, 23 Oct 2026. New files: `tickets.js`, `tickets-content.js` (generated), `Tickets.gs`, `tools/tickets-build.js`, `tools/tickets-test.js`, `tools/tickets-smoke.py`. Marked `/* WS-C */ … /* /WS-C */` (or `<!-- WS-C -->`) blocks only in `student.js`, `teacher.js`, `index.html`, `teacher.html`. No other file changed.

## 1. For WS-I (the integrator)

### 1a. Code.gs — the ONE dispatch line (TICKETS-HOOK)
In `Code.gs` → `doPost`, straight after the LAB-HOOK line and before `var lock = …`, add:
```js
  /* TICKETS-HOOK — lesson tickets + Participation ledger (Tickets.gs). Reads run outside the lock. */
  if (String(req.action || '').indexOf('tickets.') === 0) return out(TICKETS_handle(req.action, req.payload || {}));
```
`tools/tickets-test.js` emulates this line when Code.gs does not carry it yet, and reports "TICKETS-HOOK line is in place" either way, so the test is green before and after the merge. Tickets.gs uses `SHEETS`, `sheet()`, `isTeacher()`, `findStudent()`, `denied()`, `log()`, `parse()` from Code.gs — none of them changed.

**Redeploy needed.** After `Tickets.gs` is added and the hook line is in: **T.Chris: Deploy → Manage deployments → pencil → New version.** Until then the student Tickets room runs un-gated ("offline" note: answers still reach the Attempts sheet through the ordinary save) and the Staff Room panel shows "server has no Tickets.gs yet: local state only".

### 1b. Script tags (already in place on this branch, `?v=20261027a`)
- `index.html`: `tickets-content.js` then `tickets.js`, after `story.js`, before `student.js`; `student.js?v=20261027a`.
- `teacher.html`: the same two tags after `story-content.js`, before `teacher.js`; `teacher.js?v=20261027a`.
- New nav button `data-view="tickets"` and `<section id="view-tickets">` on both pages.
If WS-B / WS-I add WS-D's `vw2-prompts.js` to either page, keep it: `tickets.js` pushes only the three WS-D charts a ticket needs (`p-vw2-line-electives`, `p-vw2-bar-books`, `p-vw2-table-cafes`) and only when the id is still missing from `CONTENT.PROMPTS`, so no duplicate either way.

### 1c. Tests to add to the pre-push line
`node tools/tickets-test.js` (content, ledger maths, Tickets.gs in a vm) and `python3 tools/tickets-smoke.py` (Tickets room end to end, Staff panels, 390 / 780 px; `CHROME=/opt/pw-browsers/chromium-1243/chrome-linux64/chrome`).

### 1d. Merge notes
- `student.js` blocks: `VIEWS.push('tickets')`; `visibleViews()` appends `tickets`; `PRIMARY.splice(1,0,'tickets')`; `show()` calls `Tickets.leave()` / `Tickets.mount()`; nav click confirms leaving a running ticket; `startAssignment()` handles `kind:'template'` (see §3).
- `teacher.js` blocks: a wrapper on `api.teacherLogin` passes the teacher token `tt` to `Tickets.staff.setToken` (tickets.js posts `tickets.*` itself, outside api.js); `ticketsCtx()`; `showView()` toggles `#view-tickets`; `load()` and the cohort buttons re-mount the panel; `paintAssign()` gains the Kind / Spellbook-page row and the `a-set` handler sets `kind/mode/uiMode`.
- WS-G owns `teacher.js` item 5 (roster readiness) and `student.js` item 6 (Report Card): the WS-C blocks touch neither function.

### 1e. New selectors (for the walkthrough harness and UPGRADE-BRIEF)
Student: `.nav button[data-view=tickets]`, `#view-tickets`, `#tk-code`, `#tk-go`, `#tk-msg`, `#tk-clock`, `#tk-host` (the mounted item, same `.opt` / `.seg` as the lesson runner), `#tk-fb`, `#tk-check`, `#tk-quit`, `#tk-done`, `#tk-more`, `.tk-code-line`. Staff: `.tnav button[data-view=tickets]`, `#view-tickets`, `[data-tk-toggle=CODE]`, `[data-tk-view=CODE]`, `#tk-live`, `#tk-live-close`, `#tk-ledger`, `[data-tk-half=H1|H2]`, `[data-tk-mod=mNN]`, `[data-tk-stu=id]`, `#tk-csv`; Assignments: `#a-kind`, `#a-tmode`.
Storage keys: `cc.tickets.v1` (offline store: sets / results / config), `cc.ledger.cfg.v1` (ledger overrides cache). Progress field: `p.tickets[CODE] = { score, n, at, seconds, hinted, tags[], timeUp }`.

## 2. Backend contract (Tickets.gs) — sheets and actions
Sheets (created on first use): `TicketSets` `[code, lesson, state, openedAt, closedAt, by, json]` (row `_LEDGER` = ledger config JSON) · `TicketResults` `[ts, code, lesson, studentId, name, cohort, score, n, seconds, hinted, tags, json]`.
Ticket answers are ordinary **Attempts** rows: `mode = 'ticket'`, `topic = the code (E01…)`, `level = the lesson (L1…)`, `itemId = vw2-…` (bank items referenced by a set get the `vw2-` prefix too), written by Code.gs `save()` as before. The live grid reads the last 900 Attempts rows.
Actions: `tickets.status` (student or teacher) · `tickets.open` / `tickets.close` / `tickets.results` / `tickets.live` / `tickets.config` / `tickets.teams` (teacher `tt`) · `tickets.done` (student token). Full table in the header of `Tickets.gs`.

## 3. Owl post: new assignment kind `template` (additive)
Row shape (Assignments sheet JSON, set from the Staff Room "Kind" select): `{ id, ts, cohort | studentId, kind: 'template', mode: 'TREND'|'COMPARE'|'SEQUENCE'|'SPACE', promptId, uiMode: 'spellbook', timed, minutes, due, title, note }`. Rows without `kind` behave exactly as before. Student side: if `Story.labDesigned(p, mode)` is false the owl opens the Workshop on that mode (`PCHost.labMode`); otherwise the Scriptorium in spellbook mode on `promptId`; the report's `assignmentId` marks the owl done as before. The Staff Room lists it as "Spellbook page (MODE) + report". WS-F: the A1–A4 owl text goes in `note`.

## 4. For WS-B — the Teams sheet the ledger reads (what WS-C EXPECTS)
Sheet name **`Teams`**, header row (any order; read by header name, extra columns pass through):
`ts | cohort | team | kind | studentId | points | game | round | json`
- `kind = 'member'` rows: `team` + `studentId` (lower-case roster id, e.g. `m41-proud`) — one row per member. Until these exist the ledger uses the six fixed teams from the Groups tab (nicknames matched to the roster display name, in `tickets-content.js` → `teams`).
- `kind = 'points'` rows: `team`, `points` (number, may be negative), `ts` (ISO; decides the half: ≤ 2026-12-18 = half 1, else half 2), `game`, `round` for the audit trail. Append one row per scored round (or per correction); never overwrite.
- `cohort` = `M4.1` (the ledger filters students by the Staff Room cohort; team names need not be unique across cohorts if `cohort` is set).
Team missions (5 pts) = the student's equal share of her team's points in the half (team points ÷ members), scaled so the best share in the cohort = 5. If WS-B provides something different, write it in `docs/cross-group/WS-B.md`; WS-I reconciles — the only code to change is `teamOf()` / the `points` loop in `Tickets.ledger` (tickets.js) and `TK_teams_` reads whatever the header says.

## 5. For WS-J (Grammar Wing modules m15–m17) and the ledger denominator
The module list is read from `CONTENT.TOPICS` at run time — nothing is hard-coded to 15. A module counts in "modules set to date" when (a) the Homework-map week for it has arrived (`MODULE_SET` in tickets.js: m00–m14 by lesson date) or (b) T.Chris ticks it in the ledger panel; unticking removes a dated one. Overrides are per half, saved to the `_LEDGER` row (and cached in `cc.ledger.cfg.v1`). New modules appear unticked with "no date"; add a date to `MODULE_SET` when the Homework map sets them. Mastery per module = that module's gate (`levels[0].check.id`) at `best >= 0.75` in `p.checks`.

## 6. For WS-A (slides)
Codes to print on the slides: L1 end → **E01**; L2 start **Q02**, end **E02**; L3 **Q03 / E03**; L4 **Q04 / E04**. Students open the **Tickets** tab (or `index.html#tickets`), type the code, press Start. Launch quiz = 8 items / 4:00; exit ticket = 5 items / 3:00; a wrong first answer shows the hint and allows one more try. The result card lists the rules missed.

## 7. For WS-D (phase 2 sets Q05–Q10, E05–E10)
Drop the new ids into `vw2-items.json` `sets` (and `items`), then `node tools/tickets-build.js` regenerates `tickets-content.js`; `node tools/tickets-test.js` checks counts (8 / 5), tags, charts, hints without the answer, a judge item per exit ticket. Half 2 codes (E06+) become "set" in the ledger when their lesson date arrives or when opened.
