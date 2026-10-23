# QA report — Quillmoor · The Observatory (IELTS-WT1)

## WS-G hardening + roster, 23 October 2026 (Claude Fable 5.1, branch WS-G from 49ddfcf) — Variety of Writing 2 phase 1

Scope: docs/HANDOVER-2026-10-21.md items 1–8 verified and their acceptance checks completed; the M4.1 roster aligned to the class register for L1 (Fri 30 Oct); a teacher "Reset password". **Code.gs changed (new action `resetPassword`, reset state in `login`) — T.Chris: Deploy → Manage deployments → pencil → New version** (the 21 Oct version he deployed on 23 Oct does not have it; until then the Reset button answers "Unknown action"). Then run `dedupeAttempts` once from the editor and archive the test accounts.

### Reset password (Code.gs, api.js, teacher.js) — a forgotten password
| What | Before | After |
|---|---|---|
| A student forgets her password | no way back except editing the Sheet | Staff Room student panel → "Reset password" (beside "Archive this student"), confirm → toast "Reset. Next time she signs in, the password she types becomes her new one." |
| Server | — | `resetPassword` (teacher token) sets `pw` to `''`, retires the token (no device stays signed in), clears the 5-wrong-passwords lock, logs it. `login()` in that reset state takes any password of 4+ characters (the register rule), stores its v2 hash and signs her in; the old password is then rejected. Progress untouched |
| Tests | — | gs-test: token needed · unknown id · locked-out student reset → lock cleared · pw empty + token retired · old token cannot save · 3-character password refused · new password ok and stored as v2 · old password rejected · second login needs the new one · progress kept. smoke.py: button beside Archive, toast, offline local store emptied, Aeh signs back in with a new password, old password "Wrong password". ws-g-test: the three files wired |

### Handover items 1–8: state at 49ddfcf, re-verified on this build
| Item | Acceptance check | Result |
|---|---|---|
| 1 outbox kept on a refused/lost beacon, retry after 15 s | save-order-test cases 5–8 | green (8 cases) |
| 2 write-once Attempts rows, `dedupeAttempts` | gs-test write-once / cache-miss / dedupe cases | green |
| 3 COMPARE claim words and category reach | lab-check-test (C1's three lines come out ≈), lab-validate §7, template-test `capped` | green (1044 / 35 cases) |
| 4 tablet width 780 × 1024 | smoke.py and lab-smoke.py: `scrollWidth <= innerWidth` on every tab (map, lab, writer, bootcamp, story, lesson, duel, archive), tab strip not scrolling, charts in their boxes | green |
| 5 readiness split + Archive | smoke.py: "Mean class readiness" / "Mean examiners' verdict" stats, Class work + Examiners' verdict columns, archive → row gone, Show archived, restore; **CSV export check added** (header has "Archived", archived row still exported) | green |
| 6 Report Card first paint | smoke.py: 46 ms with the API held 5 s (limit 300) | green |
| 7 owl wording after a send | writer-test item 7; **smoke.py assertion added**: the result card after Send never says "before you submit" | green |
| 8 copy nits | smoke.py: 70 % / 50 % hall line, 120-word track wording on the chapter-8 gate, AI-off badge, map place lines | green |

### Roster (roster.js, student.js) — for L1
- 4.1 Fast Access = the **30** nicknames of `M4-1-Roster.xlsx`, in register (class-number) order: Donut, Lookchin, Baiplu, Sun, Mint, Proud, Airin, Oly, Noyny, Ob-oon, Pasta, Premier, Nicha, Nene, Punnee, Vernier, Rak, Min, Panghom, Carrot, Chicha, Wongree, Moquette, Pin, Lilil, Thinn, Ren, Khaofang, Gam, Mon.
- Added `m41-donut`; `tut-donut` kept (Donut is also a tutee: two accounts, two programmes). Display names `Ai` → `Airin`, `Lillil` → `Lilil`; ids `m41-ai`, `m41-lillil` unchanged so any account already created still matches.
- `fillRoster` no longer sorts alphabetically (a student finds herself by class number); duplicate-name disambiguation unchanged.
- Code.gs needs no roster action (accounts are made on first sign-in; cohort stamped from the Fast Access group).

### Band 8 example on the screen-time chart (example-real.js)
The p-bar-screentime paragraphs (COMPARE, no time axis) used trend verbs: "fell steeply with age", "fell to 11 hours", "declined even more sharply". Reworded to comparison language with the same figures: "the young spent far more time on social media and gaming than the older groups"; "it was far lower among the older groups, at 11 hours for those aged 30–49 and only 6 hours for the over-50s. The contrast in gaming was even sharper: 12 hours a week for teenagers against just 1 hour for the oldest group." Figures re-verified against prompts.js (21/18/11/6 and 12/8/3/1). examples-check.js green (51 examples, 256 showings never on their own chart).

### Tests
- New `tools/ws-g-test.js`: the 30 names in order, unique ids, Donut in both groups, the two kept ids, no trend verb in the screen-time COMPARE example and its figures present.
- `tools/smoke.py`: Fast Access list asserted (30 names, order; Donut also in the tutees tab); owl wording after Send; CSV export after Archive. `tools/smoke.py` and `tools/lab-smoke.py` locate chromium by glob under `/opt/pw-browsers` (chromium-1243 now).
- Full line green: validate · fairness · story-validate · gs-test · lab-gs-test · lab-check-test · lab-validate · template-test · models-check · examples-check · writer-test · save-order-test · ws-g-test; smoke.py (0 local 404s, 0 console errors) and lab-smoke.py passed.

Cache version: `roster.js`, `api.js` `?v=20261027a` (index.html, teacher.html); `student.js`, `example-real.js` `?v=20261027a` (index.html); `teacher.js?v=20261027a` (teacher.html). Contracts for WS-I: docs/cross-group/WS-G.md.

## WS-J, 23 October 2026 (Claude Fable 5.1) — The Grammar Wing: three companion classes imported from the grammar apps

Source: the Variety of Writing 2 phase-1 brief (WS-J). T.Chris's Departure Board (comparatives), Postcards & Plans (tenses) and Voice Control (passive) now live inside the Observatory as Modules 15–17 instead of external links. No Code.gs change (no new tag ids).

- **New files:** `topic-15.js` Comparing (30 items from Departure Board Gates 2–4 + one Gate 8.3 item), `topic-16.js` Tense by the Dates (31 items from Postcards & Plans Legs 2.1, 3.1–3.2, 7.2–7.3, 1.2 and one from 4.1; two new Task-1 judge items marked `src:'ws-j:new'`), `topic-17.js` Active or Passive (30 items from Voice Control Stages 1, 2, 3 and 4.2); `companion-engine.js` (wraps `Engine.mount` for the renderers the Observatory lacked: `pick`, the typed `gap`, `spot` with `also`; adds TYPE_LABEL entries; `window.Companion` registry); `companion-levels.js` (A1/A2/B1/B2 for the nine lessons, merged into `QM_LESSON_LEVELS`); `companion.css`; `tools/companion-test.js`.
- **Marked `/* WS-J */` blocks:** content.js (header, MODULE_GATES m15–m17, Graduate badge wording "every examiner's gate"), media.js (m15–m17 rows, empty podcast/video), story-content.js (nine `optional: true, wing: true` sub missions: ch 4 m16s1 m16s2 m17s2 · ch 5 m15s1–s3 · ch 6 m16s3 m17s1 m17s3; no gate line changed, so every keepsake is earned exactly as before), student.js (wing header on the Classes screen before Module 15, a "Companion classes" card in the Map Room after the examiners' gate list, and the Voice Control lesson tabs ภาษาไทย · the exam trap · an analogy on Module 17 lessons), index.html/teacher.html (script and style tags, `?v=20261027a` on changed tags). teacher.js counts modules from C.TOPICS, so "Classes passed" reads n/18 and the heat map gains the new columns without a change.
- **Lesson levels:** Simple English → A2 (and, expanded, B1); Explain → B2 (and C1 = the topic file). The Thai tab is kept (collapsible on the lesson page; not read aloud and not levelled). Mind map, Story, Chant and Moves tabs were not ported (listed in out/WS-J/REPORT.md).
- **Audio:** 45 Sonia clips recorded for the nine lessons × five levels (`tools/build-lesson-audio.py`, now loads every topic file and companion-levels.js); manifest `audio/lessons/index.js` rebuilt (265 files, 270 texts — five identical B2/C1 texts share a clip).
- **Tools:** validate.js, fairness.js, writer-test.js, examples-check.js and build-lesson-audio.py load every `topic-NN.js` instead of a hard-coded 15; validate.js expects one module per topic file (≥ 15). smoke.py gains a Grammar Wing pass at 390 px (header, Module 17 open, a lesson with the three tabs, a companion run, a pick card and a typed gap mounted through the wrapped engine, the Map Room card directly after `.examiners`).
- **Results:** validate OK (18 modules · 526 items · 43 tags) · fairness OK (0 errors; 23 word-count warnings, all on the shorter A1/A2 bodies) · story-validate OK · gs-test, lab-gs-test, lab-check-test, lab-validate, template-test, models-check, writer-test, save-order-test, examples-check all green · companion-test OK (91 items rendered and keyed in Chromium) · smoke.py 0 errors, 0 local 404s · lab-smoke passed.


## Handover item 9, 21 October 2026 (Claude Opus 5.5) — a Band 8 student's examples in the app

Source: docs/HANDOVER-2026-10-21.md item 9; material: tools/walkthrough/live/good-examples-for-app.json (C1-Student's writing from the 20 Oct walkthrough, every figure verified). No Code.gs change.

- **example-real.js** (new, ES5): 20 Scriptorium paragraph boxes (intro, overview, detail A, detail B on five charts) and 31 Workshop design lines (her frame + the frame filled in on her chart). The three COMPARE lines whose claim words were false when cast (c-ov-ext, c-a, c-b) are not included.
- **Scriptorium** (writer.js): the four paragraph boxes' "Show an example" gain a level button **Band 8** next to A2–C1, labelled "From a Band 8 student, another chart"; an example written on the chart the student is writing about is never shown.
- **Workshop** (lab.js): at level C1, "Show an example" on a design line shows her page line and the same line cast on her chart, with a "Take care" tip where the walkthrough note asked for one; never on the chart in the Test Drive. Her lines also count in the "too close to an example" check, so a student cannot copy one as her own page.
- **Care applied from the notes:** glass detail A/B — the crushing stage moved to the second phase, as her overview groups it; phones t-b-end "a near-identical margin" → "a similar margin" (the fall of 75 points is smaller than the rise of 85) plus a tip that "It" fits one group only; glass s-ov-ends "refilled bottles" → "new bottles"; s-1 "by the public" dropped (not on the diagram); Thai town m-ov-same now names the river as well as the temple; m-conv recast on the wet market so the "which" clause is true; t-ov-a tip to use a subject that can rise.
- **Found by the new check:** her phones detail B paragraph failed the Scriptorium's own detail check (a first sentence with no figure, no comparison word), so a student copying its shape would be marked down; rewritten with her figures ("… half its starting level … whereas 95% owned a smartphone").
- **tools/examples-check.js** (new): every source chart exists and matches the mode; every figure is on that chart (an approximation like "just over 400 thousand" within 10 %); overviews start "Overall," and pass checkOverview, details pass checkPara, intros do not copy the rubric; across all 48 prompts × 4 boxes (256 showings) no example appears on its own chart; the Workshop picker filters its own chart; the three excluded lines stay out. Her two COMPARE lines with claim words (c-top "by some distance", c-bottom "only") are already cast in lab-check-test.js.
- Smoke: the Band 8 button on the overview box, not showing the museum chart's own example; lab-smoke: the C1 sample is hers and is withheld on its own chart.

Cache version: example-real.js, writer.js, lab.js, lab.css `?v=20261021h`.

## Handover items 5–8, 21 October 2026 (Claude Opus 5.5) — Staff Room readiness and Archive; Report Card first paint; owl wording; copy nits

Source: docs/HANDOVER-2026-10-21.md items 5–8. **Code.gs changed (new action `archiveStudent`, new Students column `archived`) — T.Chris: Deploy → Manage deployments → pencil → New version.** Until then the Archive button answers "Unknown action"; everything else works with the current backend.

### Item 5 — roster readiness split and Archive (teacher.js, engine.js, Code.gs, api.js, teacher.html)
| What | Before | After |
|---|---|---|
| Header stat | "Mean gate readiness": one blended figure over every account, ~50 % with the four test accounts | "Mean class readiness" (class work only, over students who have passed at least one class) and "Mean examiners' verdict" (marked reports only; — until a mark exists) side by side |
| Roster | one "TA · CC · LR · GRA" column (blended) | "Class work · TA CC LR GRA" (bars + %) and "Examiners' verdict" (% from the last three marked reports, per-criterion tooltip; "no marks yet") |
| Test accounts | in every mean and the House Cup | "Archive this student" on the student panel: the account leaves the roster, the means, the heat maps and the House Cup (Staff Room and the student-facing `houses` action); nothing is deleted; "Show N archived" lists them again with "Restore to the roster" |
| CSV | blended TA/CC/LR/GRA only | adds Class readiness %, Examiners' verdict %, Archived; cells starting = + - @ are prefixed with ' (formula injection) |

`Engine.Progress.classReadiness` / `verdictReadiness` are the two halves of `gateReadiness`, which is unchanged (the student header still uses it). With the five walkthrough accounts the class-readiness mean is their header figures' mean (83–95 %, about 88 %); the four test accounts can now be archived.

### Item 6 — Report Card first paint (student.js, api.js)
The list paints at once from this device's copy (report summaries on the progress object plus anything still in `cc.repbox.v1`, marked "waiting to send"), with a small "Checking for marks…" line; the server's list replaces it when it arrives. Smoke: 23–30 ms first paint with the API held for 5 s.

### Item 7 — owl wording after a send (writer.js, student.js)
`Writer.preflight(text, p, {sent:true})` and a new `sentSummary`: "N red rows to fix next time." The owl's result (always after a send) uses it; the Wards before sending still say "to fix before you submit".

### Item 8 — copy and guidance
- Workshop Design screen: "AI coach off — quick checks only" badge when the AI is switched off in Your Trunk (`#lab-aioff`).
- Already in place, now under test: the Duelling Hall landing says "Win a duel at 70%; answering every question at 50% or more completes the chapter mission"; the chapter-8 gate, its writing mission and the tournament task say "120 words on your Band 6 track (the exam wants 150)" on the B1 track.
- Map Room: a long place line (chapter 1) wraps inside the map instead of running off its edge (found by the item 4 builder).

Also: the Staff Room's error tally counts a capped amber coverage row (item 3) as a missing category, and the flag is kept when the report is saved. `tools/smoke.py` ignores console messages logged inside third-party frames (the YouTube embeds in the Memory Basin log a browser policy message when the network lets them load).

Independent review (auth change): no blocking defects; four low points fixed — the verdict column now uses every released mark the Staff Room holds (the student's own copy lags until the next time the app is opened); the CSV guard also covers a payload starting with a minus sign, a tab or a return; the archived date is read back in the script's time zone; the module bars refresh after Archive / Restore.

Tests: gs-test archive cases (teacher token, header column, roster flag, House Cup, a save keeps the flag, restore); writer-test item-7 case; smoke: stats and column labels, archive/restore, first paint ≤ 300 ms, duel landing line, track wording, AI-off badge, map lines inside the map.

Cache version: api.js, engine.js, lab.js, story.js, student.js, teacher.js, writer.js `?v=20261021g`.

## Handover items 3–4, 21 October 2026 (Claude Opus 5.5, two builders in parallel worktrees + independent review) — COMPARE pages that tell the truth; tablet width

Source: docs/HANDOVER-2026-10-21.md items 3 and 4. No Code.gs / Lab.gs change.

### Item 3 — COMPARE frames (template.js, lab.js, writer.js, lab-content.js)

| What | Before | After |
|---|---|---|
| Claim words built into a frame | not checked: C1-Student's approved lines "by far the most prominent" (56 h v 54 h), "followed closely behind" (12 h v 21 h), "similarly modest" (streaming, the leading activity for 30+) all cast as ✓ | the cast data check reads the claim word against the filled figures and marks the line ≈ with "The frame's claim word does not fit these figures — reword or drop it" |
| Thresholds (template.js, next to APPROX) | — | "by far / by some distance" ≥ 1.5× the next; "by a clear margin" ≥ 1.2×; "closely / close behind / not far behind / similar(ly)" within 15 %; "barely / a mere" ≤ ½ of the leader; "only" (straight before a figure) and "far / well behind" ≤ ¾ of the leader. [Largest] is compared with the second category, [Smallest] with the next-smallest (the test is turned round for "by far the smallest"), [Group A] with [Largest], [Group B] with [Group A]. Grouped bars use sums unless the line's figure names one group; tables and mixed charts use the column or part the line's figure (or measure name) comes from; no verdict when that cannot be found |
| Words used in another sense | — | no verdict for "not only … but also", "the only exception", "only in 2020", "a similar pattern / trend", "barely varied", "so far", "far more" |
| A page that cannot name every category | Design approved it; the report's coverage ward then went red | Design warns "This page names at most N of the M categories — add a slot or a 'the remaining …' line" and lists them; [Largest] / [Smallest] are credited to the chart's real extremes, [Exception] counts one but names none |
| Coverage ward on a report from that page | red for a category the page had no slot for | amber (flagged `capped`) only for categories no slot — not even [Exception] — could hold; the note still says one missing category caps Task Achievement at 6. A category the page could name stays red. The Staff Room's error tally counts the capped amber row as a missing category |
| Shipped examples that the new check showed false on some charts | c-ov-ext C1 "ranked first by a clear margin"; c-a C1 "Not far behind were …", "Similarly high figures …"; c-bottom C1 "registered a mere"; c-b B2 "the figure was only" | reworded (e.g. "headed the ranking", "came last, at", "the figure came to"); two first replacements for c-a made a ranking claim of their own and were made rank-neutral ("Turning to {groupA}, the figure reached {figA}." / "{groupA}, meanwhile, stood at {figA}.") |

Independent review of the merged build found one high and four medium defects in the first version (extremes credited by label order, so the ward could go amber for a category the page could name; "only"/"similar"/"barely" read as size claims in other senses; lead words attaching to [Smallest]; tables judged on the first column). All fixed in a9ee1e2; the re-check closed all of them and found one new false positive (a "by far" on [Largest] turned round by a later "lowest" in the next clause), fixed and under test.

Tests: `lab-check-test.js` 125 → 1044 cases (C1's three lines come out ≈; c-top "by some distance" and c-bottom "only" stay ✓; every reviewer sentence; a sweep of every shipped COMPARE example on every COMPARE prompt); `template-test.js` 23 → 35 (reach on pie, grouped bar, table and mixed; the `capped` flag); `lab-validate.js` §7 (Design warning; {top}/{bottom}-only pages on seven charts).

Judgement calls for T.Chris: "only" / "far behind" use ¾ of the leader rather than the brief's ½, because the [Bottom Figure] tip teaches "only 4%"; LabSamples B1 "by far" and Fah's "lagged well behind" are true on their own charts and are only shown with them, so they were left.

### Item 4 — tablet width (theme.css, charts.js)

- Tab strip: wraps onto two rows above 640 px (13 tabs need ~1,460 px, so it overflowed even on a laptop); tabs ≥ 44 px; the phone bottom bar with More (≤ 640 px) unchanged.
- Charts: line and bar charts are drawn at their box width (300–640 px) and redrawn on a debounced resize / orientationchange; a chart in a closed `<details>` fits when opened; the picked value and its highlight survive the redraw. Drawing fixes: end-of-line values no longer clipped ("760" showed as "76"), crowded x labels thin out, long bar names wrap, and the bar chart no longer inherits the sticky header `.bar` style (an old bug).
- `tools/smoke.py` and `tools/lab-smoke.py`: a 780 × 1024 pass on every tab, story, lesson, Scriptorium (chart width = box), Duelling Hall and the Workshop cast chart; resize redraws and keeps the pick.
- Left: the Staff Room roster scrolls 12 px inside its own box at 780 px (table `min-width:700px`), no page overflow.

Cache version: template.js `?v=20261021f`; lab.js, writer.js, lab-content.js, charts.js `?v=20261021e`; theme.css `?v=20261021b`.

## Handover items 1–2, 21 October 2026 (Claude Opus 5.5) — saves that cannot drop answers

Source: docs/HANDOVER-2026-10-21.md items 1 and 2. **Code.gs changed — T.Chris: Deploy → Manage deployments → pencil → New version.**

| What | Before | After |
|---|---|---|
| A save that times out or finds no network (class server set) | `call()` fell back to `localSave`, which answered ok, so `sendSave` removed the rows from `cc.outbox.v1`; the answers reached only this device's local copy and never the Sheet | the fallback keeps the progress on the device but answers `{ok:false, offline:true}`; the rows stay queued and one retry runs 15 s later (up to 3 in a row; the 15-second loop in student.js keeps trying while rows wait) |
| `flushBeacon` on page hide / close | emptied the outbox as soon as the browser queued the beacon, though the server could still refuse it (stale rev, expired sign-in, lock timeout) | the rows stay in the outbox marked `beaconed:<ts>`; the next save sends them again |
| A row reaching Code.gs twice | written twice (the duplicate rows from B2's m08s2 and A1/A2 gates) | `saveAttempts` writes each row once per ts (to the second) + studentId + itemId + given; the ts and given cells are written as plain text so a key rebuilt from the sheet equals a resent row's key ("True" is not turned into TRUE, "25%" not into 0.25, the timestamp not into a local date); recent keys kept as 12-character hashes in CacheService (6 h); after a cache miss one scan of four columns of the last 3000 rows refills the cache for every student in it (thirty cold sign-ins cost one read); `save` now answers `{ok:true, added:n}` |
| A scheduled retry's reply | — | goes through student.js `sync()` (`api.onRetry`), so a stale reply is merged and an expired sign-in opens the password box |
| Sign-in refusals ("Not signed in.") | — | never retried automatically (the re-sign-in modal handles them); the rows wait |

**Clean-up of the existing duplicates (T.Chris's call):** after the New version, open the Apps Script editor, choose `dedupeAttempts` in the function list and press Run. It takes the script lock, first copies the sheet to a tab "Attempts backup <date>", keeps the first copy of each row in place, removes the repeats, and writes one line to the Log sheet ("Attempts: N rows checked, M duplicates removed."). Running it twice is safe.

Independent review (a subagent that had not seen the change) found six points — typed cells breaking the sheet-rebuilt keys, a failed cache write leaving an older list, a 3000×15 read under the script lock on every cold save, the retry bypassing `authCheck`, a non-atomic clean-up, and the retry counter not resetting on a stale reply; all six are fixed above and covered by tests.

New checks: `tools/save-order-test.js` cases 5–8 (beacon accepted by the browser but never taken by the server → rows still queued and sent by the next save; beacon taken + the same outbox saved twice → each row once; offline save → rows kept and sent by the scheduled retry with no user action; a "Not signed in" refusal is not retried). `tools/gs-test.js`: write-once rows, a repeat found on the sheet after the cache is cleared, another student's identical row still written, `dedupeAttempts` keeps a backup tab, removes planted duplicates and is idempotent; a resent "True" matches the boolean a sheet stored with a cold cache; ts/given written as text; cache holds hashes. save-order case 7 also checks that the retry runs through the page's sync. The new save-order cases fail on the previous api.js.

Cache version: `api.js?v=20261021a` (index.html, teacher.html), `student.js?v=20261021a` (index.html).

## Five-student walkthrough, 20 October 2026 (Claude Fable 5.1, with Opus 5.5 for P1 and the example bank)

Five persona bots (tools/walkthrough) completed every room on the live site in the built-in browser, writing to the live Sheet through the real UI only. Full report: the "Five students through the Observatory" doc (Claude Docs, shared with T.Chris). Per-student logs: tools/walkthrough/live/*-summary.json; C1 screenshots: tools/walkthrough/live/shots; good/weak pairs: tools/walkthrough/live/example-bank.json.

| Student | Build | Sim. hours / days | Keepsakes | Duels won | Notes |
|---|---|---|---|---|---|
| A1 | 55b0371 (before upgrades) | 56.4 / 39 | 3 of 7 | 0 | stuck at the chapter-4 150-word gate; 3–5 tries per examiner's gate |
| A2 | upgraded | 41.4 / 32 | 7 | — | 50 % completes the first-duel mission (WP14); 120-word track gate (WP24) |
| B1 | upgraded | 25.8 / 25 | 7 | 5 | Workshop AI on: 107 calls, 5 casts |
| B2 | upgraded | 18.4 / 19 | 7 | — | lost lesson m08s2 to the save race (P1, fixed 4022e95), retook it |
| C1 | upgraded | 14.0 / 15 | 7 | all | every gate and duel first time; 29 screenshots |

Shipped on main between A1 and C1: WP1–25, WP27–30 (see docs/cross-group and UPGRADE-BRIEF.md in tools/walkthrough), P1 serialised saves with `progress.rev` and a server rev guard (api.js, Code.gs — **Code.gs needs redeploying**). Dropped: WP26 (the "returning" flag was WT2 progress on the same device). Staff Room check at the end: five rows 15/15, readiness 83–95 %, candles = simulated days, heatmap A1 dark → C1 white; 45 reports unmarked until the redeploy; cohort means diluted by four test accounts.

Open: outbox retry on timeout; COMPARE frame coverage; roster readiness split; Report Card first paint; owl wording after exam send; ~780 px overflow; four placeholder images.

## Audit, 20 October 2026 (Claude Opus 5.5)

Brief from T.Chris: the correct answer is the longest option only ~25% of the time and the answer positions are even; hints never give the answer away and belong to their own question; A1–C1 lesson explanations and Sonia read-aloud, as in IELTS-WT2.

### Headline

| Area | Before | After |
|---|---|---|
| Choose items: key is the longest option (ties counted) | 56 / 178 (31%); m05 3/6, m02 5/12, m12 6/14 | 30 / 178 (17%); every module ≤ 25% |
| Choose items: key position A / B / C / D | 41 / 46 / 47 / 43 | unchanged (already even) |
| True/False keys | 29 True / 53 False | 44 True / 39 False |
| Items with their own hint | 0 of 435 (the Hint button showed the tag's general principle, usually about something else) | 435 of 435, each about its own question |
| Duelling Hall: key is the longest option | 49% (split, select, ovwhere, compare, prep, ck3, ck4 always longest) | 13% overall, ≤ 22% in every duel |
| Duelling Hall: answer slot | the same slot on every chart (time always C, split always B, detail always A …) | rotates through each duel; A 21%, B 24%, C 23%, D 23%, E 9% (five-option questions) |
| Duelling Hall hints that gave the answer | 17 of 24 | 0 |
| Lesson explanations | C1 + an old "simpler" version | A1, A2, B1, B2, C1 for all 45 lessons (picker on every lesson page and in Your Trunk) |
| Read-aloud | Sonia, 2 versions per lesson | Sonia (en-GB-SoniaNeural, −8%), 5 levels × 45 lessons; Sonia-first browser fallback |
| Lesson text giving away item answers | ~60 places (examples were item sentences with their fixes; bodies quoted judge statements with verdicts and build solutions) | 131 example sentences rewritten on fresh mini-charts, 99 text edits; rescan clean |

### Fairness fixes (P1)
- **bootcamp.js** — `q()` placed the answer by a seed that depended only on the question id, so every duel used the same slot per question. The slot now rotates through the duel from a start taken from the prompt id. When a distractor pool is trimmed, a distractor at least as long as the key is kept. Option sets vary by chart so that "never the longest" is not a clue either. Counts are words ("Five"), not digits, so length means nothing.
- **26 choose items** rewritten so the key is not the longest (mostly a longer near-miss distractor): m00s2q4, m01s3q2, m02s1q6, m02s2q3, m02ckq8, m03s2q7, m04s2q1, m04s2q7, m04s3q1, m05s1q4, m05s3q4, m05ckq6, m06ckq4, m07s3q1, m07ckq3, m08s2q3, m08s3q4, m09s1q1, m10s1q1, m10s2q3, m12s1q2, m12s2q3, m12s2q4, m12s2q6, m13ckq8, m14s1q3.
- **13 True/False items** reframed so the statement is true, testing the same point: m00s1q3, m00s1q7, m01s1q4, m02s1q4, m04s1q1, m08s2q7, m12s2q5, m13s1q2, m13s1q3, m13s1q4, m14s1q4, m14s2q1, m14s2q2.

### Hints (P2)
- Every item now has `hint`. Written per item, then read by two independent reviewers who replaced 200 of 435 (they stated the deciding rule, ruled out all options but one, leaned to True/False, named the faulty chunk or a chip's box, or gave the build order).
- Duelling Hall: 17 hints rewritten (e.g. prep "from = start point, to = end point …" → "One gap needs the starting value and the other needs the end value. Which pair of small words marks a start and an end?").

### Item fixes (P1/P2)
| Item | Problem | Fix |
|---|---|---|
| m03ckq5 | fix/why said Maths and Science had the most homework in every year group; Science only ties English in M3/M4 | "Maths had the most and Thai the least" |
| m00s2q1 | "a strong rise" offered as a bad collocation (it is acceptable) | "a high rise" |
| m09s2q4 | stem said the park is "much larger"; on the map it is ~10% bigger | "so it now stretches further east" |
| m07ckq7 | chip "respectively" fits TREND too | "the highest of the four" |
| m13s2q7 | stem said two options are false; only one is | stem reworded; Osaka "until the late 2020s" |
| m08s2q6 | natural-cycle sentence in the passive, against the lesson's rule | "the adult frog lays its eggs" |
| m04ckq1, m04s1q3 | decision: a sentence with a figure, a date or a label meets the requirement | keyed True; m04s1q3 is now a judge item |
| m04s3q1, m07s2q1, m07s2q3, m07s2q4, m13ckq3, m14s2q7 | decision: 38% is quoted exactly, never as a fraction | fraction items moved to 22% / 30% / 35%; 38% quoted |
| m05s2q6, m07s3q6, m12s1q7, m12ckq6, m14s3q1, m14s3q3 | explanations overclaimed, unfinished or unsourced | corrected |

### Lesson text (C1) corrections
- m04s3: "21 cups against 5 is just over four times" was the answer to m04ckq5 → 16 against 5.
- m02s1: word budget now points at 160–190 (skill target).
- m07s1: S6 names both forms (multiple and share), as in the skill.
- m12s3: "one per paragraph"; these structures lift a Band 7 report towards 8 (was "the 6→7 gate").
- m00s3 + m00ckq6: the unsourced quote "No Conclusion is needed for Task 1." replaced by IDP's "A conclusion is not necessary for Academic Task 1"; notes the official ielts.org Band 6 sample whose final summary paragraph was counted as the overview.
- m04s1: "a figure, a date or a label from the chart" stated as the requirement; "names and years help, but the number is the proof" at every level.
- The level writers listed many rules the items test that the C1 bodies never teach (e.g. four criteria at 25% each, compass directions on maps, *extended / relocated / pedestrianised*, "a twenty-year period"). Every A1–B2 version teaches them; the C1 text is unchanged apart from the corrections above.

### Independent reviews
- Hints: two reviewers who had not written them replaced 200 of 435.
- Level texts: two reviewers read every A1–B2 version against its lesson's items, the C1 text and the skill, and fixed 43 problems (8 items not answerable at a level, 10 false or misquoted statements — e.g. "a rise by 10 percentage points", GRA Band 7 quoted as "frequent error-free sentences" (also in the C1 m11s1 text; the descriptor says "error-free sentences are frequent"), "Band 5" stated as a band rather than a TA ceiling — and 25 sentences or keys above the level's length).
- Rendering: level example notes containing <em>/<strong> showed the tags as text; they now render (only those two tags are allowed).

### New checks
- `tools/fairness.js`: key-longest ≤ 25% per module and per duel; key slots; True/False balance; a hint on every item that does not contain the key, the fix or a correct pick, and does not say True/False; duel hints; lesson levels complete (example notes match); every lesson × level has a Sonia clip that is not cut off.
- `tools/smoke.py`: clicks A1→C1 on a lesson page and checks the level is shown and saved.
- `tools/build-lesson-audio.py`: records A1–C1 for every lesson; size floor and speaking-speed check; failed clips are left out of the manifest (browser fallback).

### Judgement calls for T.Chris
- m12s3 house rule now says one add-on per paragraph (your decision; matches the skill's language bank).
- The Duelling Hall's rotating answer slots change which letter is right on a replay; saved duel scores are unaffected.

### For T.Chris to do
- Nothing on the backend: Code.gs and Lab.gs are unchanged, so no Apps Script redeploy is needed.
- Note: m04s1's A1 and A2 texts are slightly above the word guide (178 and 231 words) because they now carry the figure/date/label requirement; fairness.js shows this as a warning.

---

## Earlier review — October 2026
See `docs/QA-T1.md`.
