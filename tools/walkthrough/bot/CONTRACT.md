# QB persona bot — contract for room drivers (IELTS-WT1, Quillmoor · The Observatory)

Harness dir: `/home/claude/wt1-harness`. App source (scratch copy of the repo, do NOT edit): `app-src/`. Real repo (read only for you): `/home/claude/ielts-wt1`.

## Files
- `bot/bot-core.js` — QB core (read it first): virtual clock (`QB.spend(sec)` moves simulated time; `QB.wait(ms)` is a REAL wait for the DOM), utils (`QB.$`, `QB.$$`, `QB.click`, `QB.setVal`, `QB.select`, `QB.type(el, text)` which spends time per word, `QB.waitFor(fn, ms)`, `QB.logLine`, `QB.show(view)`), accuracy model (`QB.willAnswerRight(item)` → bool, `QB.chance(p)`), `QB.p()` = progress object, `QB.E()` = Engine, `QB.ST()` = Story, `QB.persona` = persona params, `QB.data` = full persona data file.
- `bot/plan.js` — builds the plan from the story chapters. Each step is `{ room, args }`; `QB.rooms[room](args)` must return a Promise resolving to a small result object (counts, score, words…).
- `bot/rooms-<yours>.js` — YOUR file. Register drivers as `QB.rooms.<name> = async function (args) { … }`. Modern JS is fine (the page runs in Chromium). Never touch other agents' files.
- `personas/<lv>-base.json` — persona params (`persona.acc` by item level, `hintP`, `secPerItem`, `readWpm`, `wpm`, `duelAcc`, `explainLevel`, `tier`, `words.report/mock`, `noAI`). `persona.level` ∈ A1 A2 B1 B2 C1.
- `personas/parts/<lv>-<yours>.json` — YOUR persona data part (one per level, a1…c1). Top-level keys are merged into the persona file by `node merge-personas.js`, so use a unique top-level key (e.g. `items`, `writing`, `spellbook`).
- `dryrun.js` — `node dryrun.js personas/<lv>.json <planName> --port <port> [--steps N] [--headed]`. planName `all` builds the full plan; a room name runs just that room with `QB.smokeArgs[room]` (set it in your rooms file). Each agent uses its OWN port range (given in your brief) so mock servers don't collide. Output in `out/`.
- `mock-server.js` — real Code.gs/Lab.gs in a vm with an in-memory Sheet, fake Claude (MOCK_AI=0 when persona.noAI). `curl http://127.0.0.1:<port>/__state` shows the sheets.

## Hard rules
1. Drive the REAL UI only: click the app's buttons, set inputs, choose selects. Read app state (`QB.p()`, `Engine.Bank`, `Story`, `Writer`, `Lab`, `Template`, `Bootcamp`) to decide what to click. NEVER write to `QB.p()` or localStorage progress keys, never call engine functions that record progress. The only exception is reading.
2. Every wait that represents student time is `QB.spend(seconds, 'why')`; keep REAL waits (`QB.wait`) short (≤ 400 ms) and only for the DOM/timers to settle.
3. Stop fast when `QB.stopNow` is true (QB.click throws 'STOP').
4. Be level-faithful: use `QB.willAnswerRight(item)` for MCQ-type decisions; for duels use `persona.duelAcc` (±0.05 per level of the chart vs persona); when wrong, pick a plausible wrong option (not always the first). Hints: `QB.chance(persona.hintP)` on a wrong-bound item.
5. The persona's own typed text (reports, spellbook frames, cast values, free-text answers, workshop lines) comes from YOUR data part, written in her voice and level (A1 ≈ A1 English with typical errors; C1 ≈ near Band 8). Text is NEVER generated at run time by the bot from the model answers.
6. Log one line per meaningful action with `QB.logLine`. Record extra stats in `QB.stats.extra[...]`.
7. Robustness: tolerate a modal/celebration (`#modal-slot .modal [data-close]`) popping up at any point — close it (`QB.closeModals()` helper you may add to your file; check `document.querySelector('#modal-slot .modal')`). Tolerate the app re-rendering.
8. Test with `dryrun.js` on your own ports until your rooms run clean for a1, b1 and c1 (at least). Report any app BUG you hit (with file/line and the exact symptom) in your final message — bugs found are a deliverable, not a blocker: work around them in the bot if a real student could.
9. Do not push anything to GitHub. Do not edit `app-src/`.

## Result object conventions
lesson → `{subId, score, passed, tries, hints}`; gate → `{levelId, score, passed, tries}`; duel → `{promptId, pct, passed, points}`; report → `{promptId, words, seconds, bad, warn, kind}`; mock → same; spellbookDesign → `{mode, saved: true}`; cast → `{promptId, mode, ok, approx, bad}`; storyChapter/storyGate/storyEvent → `{n or event, pages}`; mend → `{mended, due}`; models → `{opened}`; record → `{reports}`.
