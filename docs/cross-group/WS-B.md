# WS-B · Assembly v2 — contracts other workstreams and WS-I depend on

Written 23 Oct 2026 (branch `WS-B`, phase-1 build for Variety of Writing 2). Everything here is additive; `Code.gs`, `Lab.gs`, `api.js` and the WS-G/WS-C files are untouched except the marked blocks listed in §4.

## 1. Code.gs — the ONE line WS-I must add (ASM-HOOK)

In `Code.gs`, inside `doPost`, straight after the LAB-HOOK line (before `var lock = LockService…`):

```js
  /* ASM-HOOK — the Assembly's team points (Assembly.gs). Same pattern as the LAB-HOOK. */
  if (String(req.action || '').indexOf('asm.') === 0) return out(ASM_handle(req.action, req.payload || {}));
```

Then paste `Assembly.gs` as a third script file in the Apps Script project. **T.Chris: Deploy → Manage deployments → pencil → New version.**

Until the hook is live: rounds, posts, auto-marks, scoreboard and the reveal all work (they use the existing `projector` action), and "Post points → House Cup" answers "Assembly.gs is not wired yet" without losing the round — T.Chris can note the totals from the board and post again later.

Optional second line (students' House Cup counts the Assembly points too). In `Code.gs` `houses()`, just before `return { ok: true, cohort: … }`:

```js
  try { var asm = ASM_houseTotals(want); HOUSE_IDS.forEach(function (h) { totals[h] += asm[h] || 0; }); } catch (e) {}
```

Without it the Staff Room still shows the Assembly points per house as a line under the cup (`#asm-cup`, via `asm.houses`).

`tools/assembly-gs-test.js` detects whether the hook is present and tests both ways; `tools/lab-gs-test.js` does the same for the LAB-HOOK.

## 2. New sheet and actions (Assembly.gs)

Sheet **Teams** (created on first use): `ts · round · game · lesson · team · studentId · points · by`. One row per student per posted round; a round+game+student already posted is skipped (idempotent). Points clamped to ±50.

| Action | Who | Payload → reply |
|---|---|---|
| `asm.ping` | anyone | → `{ ok, sheet:'Teams', rows }` |
| `asm.points` | teacher (`tt`) | `{ rows:[{ts, round, game, lesson, team, studentId, points}] }` → `{ ok, n, skipped }` |
| `asm.tally` | teacher → all rows, `byStudent`, `byTeam`, `byGame`, `total` · student (`studentId`+`token`) → her rows, `mine`, `byGame` |
| `asm.houses` | anyone | `{ cohort }` → `{ ok, totals:{compass,bridge,lexicon,loom}, rows }` — totals only, no names |

**WS-C (participation ledger):** the team-mission 5 points per half come from `asm.tally` (teacher) — `byStudent[id]` is the student's total Assembly points; pro-rata against the class maximum is WS-C's call. `rows[].lesson` (`L1`…) splits the halves. The teacher token is the same `tt` as every other teacher action.

## 3. Wire protocol on the existing Projector sheet (`projector` action, unchanged)

| kind | who | shape |
|---|---|---|
| `round` | teacher | `{ round, game: gameId, promptId, minutes, ts, asm:{ v:1, gameId, ri, type, promptId, seconds, flash, answer, title, phase, t0 } }` |
| `state` | teacher | `{ round, phase:'lobby'|'run'|'reveal'|'closed', t0 (ms epoch), marks:{postId:{pattern,wrong}}, adj:{team:n}, ts }` — latest `ts` wins |
| `post` | student | `{ id, round, team, studentId, text, ts }` — Code.gs keeps only these fields for a student, so structured answers travel inside `text` as JSON: `{"asm":"choice",card,picks,late,ms}` · `{"asm":"bid",bid}` · `{"asm":"check",script,ticks[10]}`; plain text otherwise |

Game types: `choice` (Mode Sort, Overview or Not), `post` (Group Them!, Paraphrase Relay with relay checks, free rounds, Fix the Band 6), `datapost` (Number Hunt, Slice It, Table Detective), `bid` (Twice As Much), `checklist` (Examiner's Chair). Phase-2 types register in `Assembly.TYPES` (`mark`, `score` per type) and in `rounds()`.

## 4. Files and marked blocks

New: `assembly.js`, `assembly-content.js` (generated), `assembly.css`, `Assembly.gs`, `vw2-prompts.js` (WS-D's file, copied verbatim), `tools/assembly-sync.js`, `tools/assembly-test.js`, `tools/assembly-gs-test.js`, `tools/assembly-smoke.py`.

Marked `/* WS-B */ … /* /WS-B */` blocks: `student.js` (`paintLive` delegates to `Assembly.mountLive`; `show()` unmounts), `teacher.js` (`paintProjectorHome` delegates to `Assembly.paintHome`; `api.teacherLogin` wrapped to hand the token to `Assembly.setTeacherToken`; `paintHouseCup` adds `#asm-cup`), `index.html` / `teacher.html` (`<!-- WS-B -->` tags). The old text-only Assembly/projector code stays as the fallback if `assembly.js` is not loaded.

**Load order (both HTML files):** `vw2-prompts.js` straight AFTER `prompts-3.js` (Mode Sort cards 9, 11, 12 reference prompts-2/3.js ids; the p-vw2-* prompts are pushed onto `window.CONTENT.PROMPTS` before template/charts index them); `assembly-content.js` then `assembly.js` immediately BEFORE `student.js` / `teacher.js` (they need Engine, Charts, Writer, Template, API).

`?v=20261027a` on: assembly.css, vw2-prompts.js, assembly-content.js, assembly.js, student.js, teacher.js.

## 5. Content contract with WS-D

`tools/assembly-sync.js` copies `out/WS-D/content/vw2-games.json` → `assembly-content.js` and `vw2-prompts.js` → repo root, and resolves the Groups-tab teams to roster ids. Re-run it (then bump `?v=`) when WS-D changes a set. Shapes consumed: `mode-sort.cards[] {promptId, mode, acceptAlso?, unit, unitOptions[4], trap, trapNote, tense}`; `overview-or-not.cards[] {text, label, borderline, why}` + `labels`, `labelsThai`; `paraphrase-relay.rounds[] {promptId, taskSentence, elementKeywords, modelP1, c1Twist?}` + `key.copiedRunRed`; `number-hunt {promptId, sampleSentences}`; `group-them.key`; `twice-as-much.rounds[] {pattern, frame, rule, models}`; `slice-it.key`, `table-detective.key`; `examiners-chair {check[10], scripts[] {label, shape, paragraphs, key[10], keyNotes, ceiling, nextGate}, key.agreementTarget}`; `data-dictation` (roundType `paper`) is listed for the slides only, never offered as a round.

## 6. Roster note for WS-G

The Groups tab lists **Airin** (Team 2); `roster.js` has **Ai** and no Airin. The sync tool maps her to `m41-airin` (not in roster.js) — if Ai = Airin, rename in roster.js or in the tool's `TEAMS` table (WS-B's file). **Lilil** → `m41-lillil`, **Donut** → `tut-donut` (a tutee in Team 1 as the Groups tab says).
