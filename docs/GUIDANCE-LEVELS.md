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
- `guide-content.js` — `window.GUIDE_SCRIPTS[promptId]`: the hand-written script per prompt (museum visitors first).
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
