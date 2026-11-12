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

## Script shape
```
GUIDE_SCRIPTS['p-line-museums'] = {
  sections: [ { id:'triage'|'intro'|'overview'|'detailA'|'detailB', title, note, pane: null|0|1|2|3,
    steps: [ { id, label, ask,                 // label = short name of the decision; ask = the question
               opts: [ { t, ok:true } | { t, hint } ],   // exactly one ok; every wrong option has its own hint
               frag,                           // text this step adds to the pane (defaults to the ok option's t); '' for triage
               join,                           // how frag attaches to what came before: ' ' (default) | '' | ', ' | '. ' | '\n'
               expect,                         // the expected value, in words, for the AI check (medium)
               accept: [ [alt, alt], … ],      // local check: every group needs one alternative (regex source, case-insensitive)
               reject: [ { re, hint } ],       // local check: known wrong answers with their hint
               hint,                           // medium: first hint; hint2: second, stronger hint. Never the answer.
               tag } ] } ] }
```
A hint never contains the right option's words.

## Server action `guideCheck`
Request (student token, as every student action): `{ action:'guideCheck', token, promptId, stepId, section, ask, expect, entry, soFar }`
- `ask` the question, `expect` the expected value in words, `entry` her text (cut to 300 characters), `soFar` the pane text before this step (cut to 600).
Response: `{ ok:true, verdict:'accept'|'revise', hint:'…', source:'ai'|'cache' }` or `{ ok:false, error:'…' }` (no key, budget spent, unknown student). The client falls back to its own rule-based check on any `ok:false` or network failure, so an old deployment still works.
Rules for the server:
- no script lock around the model call; a small, fast model (script property `CC_GUIDE_MODEL`); own daily budget (`GUIDE_DAILY_BUDGET`, default 1500) and a per-student daily cap (default 200), separate from the marking budget;
- accept when her entry means the same as `expect` and is accurate for the chart, even if worded differently; small spelling slips are named in the hint but accepted only if the meaning is unmistakable;
- `hint`: one or two short sentences at B1 level that say what kind of thing is wrong; it must not contain the expected words (the server blanks a hint that does and sends a neutral one);
- entry, ask, expect and soFar are fenced as material, never instructions;
- cache by (promptId, stepId, normalised entry) for six hours.
