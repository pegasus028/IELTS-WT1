# Cross-group needs from builder B (writer.js, bootcamp.js, example-levels.js, writer.css)

## Integrator (index.html — builder A owns the ?v= bumps)
1. Add the stylesheet after story.css:
   `<link rel="stylesheet" href="writer.css?v=…">`
2. Add the new script BEFORE writer.js (writer.js reads `window.EXAMPLE_LEVELS` at run time, so order is not fatal, but keep it before):
   `<script src="example-levels.js?v=…"></script>`
3. Fresh ?v= on writer.js, bootcamp.js, student.js, writer.css, example-levels.js.
4. teacher.html does not load writer.js's UI; no change needed there (Code.gs marking prompt unchanged).
5. Add `node tools/writer-test.js` to the pre-push test list (needs the harness at /home/claude/wt1-harness or `WT1_HARNESS=<path>` for the persona answers; it skips a missing persona file with an info line).

## Builder A
- **story.js** first-duel mission / `viewMissionDone` for `bootcamp`: accept `m.completed && m.best >= 50` as well as `m.passed` (student.js onDone now sets `m.completed = true` on every finished duel; `m.best` is the best percentage). Field names: `p.bootcamp.missions[promptId] = { best, attempts, passed, completed, at }`.
- **engine.js:1127** `bootcamp` badge (Duelling Champion, "three duels"): per WP14 count a mission when `m.passed || (m.completed && m.best >= 50)`.
- **student.js paintBootcamp** (not in my ownership): the hall header paragraph already reads POINTS.second (now 6); please add the sentence "You need 70% to win; 50% completes the chapter mission." after "Win a duel at 70%." (the duel screen itself and the result card already say it).
- **engine.js WP2** ("Show an example" for module free-text items): `Writer.examples(key, level, promptOrId)` is available — `key` ∈ `intro | overview | detailA | detailB | big | groupA | groupB`, `level` A1–C1 (A1 maps to A2), returns `[{ text, from, title, level, hand }]` never from the given prompt. For an overview item use `Writer.examples('overview', lvl, item.chart)`; for a claimnum item take a sentence of `Writer.examples('detailA', lvl, item.chart)[0].text` (first sentence via `Writer.sentences`). `Writer.shapeSay(key, mode)` gives the `[shortName, explanation]` shape line.
