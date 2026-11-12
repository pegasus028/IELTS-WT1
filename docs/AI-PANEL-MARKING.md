# The examiners' panel: live AI marking of Scriptorium reports (12 Nov 2026)

Asked by T.Chris: when a student sends a report from the Scriptorium (first met in the
chapter mission "Your first guided report"), an AI report is produced automatically and
waits in the Staff Room beside her submission. He reviews it, edits it if needed, and
returns the marks and feedback to her. Two independent expert examiners mark every
report; a third is brought in when they disagree.

Built by two models. **Fable 5.2**: this contract, `Code.gs` (prompts, panel, trigger),
`tools/gs-test.js`, final review of the UI, push and deploy. **Opus 5.5**: the Staff Room
review screen and the student's Report Card (`teacher.js`, `teacher.html`, `student.js`,
`theme.css`, a UI test), and the independent review of `Code.gs`. Neither reviews its own part.

## 1. Flow

1. Student presses send. `submitReport` appends the Reports row (as before) and calls
   `aiKick()`: a one-off time trigger (`CC_kick`, about a minute) unless one is already pending.
2. `CC_kick` → `aiRun()` → for each report with no `rep.ai`: **Examiner A** and **Examiner B**
   are called in the same moment (`UrlFetchApp.fetchAll`), each alone, neither seeing the other.
3. If any criterion differs by **1.0 band or more**, **Examiner C** (senior examiner) marks the
   report with both sets of bands and reasons in front of her. Final band per criterion = the
   **median of the three**; each criterion's feedback comes from an examiner who gave that band
   (C first). With no such gap, **one examiner's whole set of marks and feedback is kept: the more
   cautious one** (lower overall, then lower total, then A). This was changed after the independent
   review: a criterion-by-criterion minimum could put the overall below what both examiners gave
   and mixed two examiners' feedback. If C does not answer, the cautious mark is kept and
   `panel.thirdFailed` is set.
4. The result is written to `rep.ai` (status `ai`) under the script lock, model calls outside it.
5. Staff Room → Marking: the report shows "AI report ready". T.Chris edits bands and text,
   then "Return to student". The edited copy is saved as `rep.teacher` with `released: true`.
6. The student sees `rep.teacher` on her Report Card. She never sees `rep.ai` unless
   `aiVisible` is ticked (unchanged rule; `reports()` strips it server-side).

Every report kind is panel-marked (practice, assignment, mock), not only the first one: the
mission accepts any chart, and a report does not record which mission it was written for.

## 2. `rep.ai` version 2 (written by Code.gs; every v1 field kept)

```js
rep.ai = {
  v: 2,
  bands: { ta: 6, cc: 6, lr: 5.5, gra: 5.5, overall: 6 },   // final panel bands, half steps
  cefr: 'B2',
  ceilings: ['…'],                       // from the examiner(s) whose TA band was kept
  criteria: {                            // one block per criterion, text addressed to the student ("you")
    ta:  { band: 6, met: '…', notMet: '…', toNext: '…', next: 7 },
    cc:  { … }, lr: { … }, gra: { … }
  },
  //  met     what the report does that earns this band, with her own words in single quotes
  //  notMet  the requirement of the next band that is not met, and where in her report
  //  toNext  the change that would lift this criterion to `next`
  //  next    the band `toNext` is aiming at (band + 1 for whole bands, the next whole band for x.5; 9 → 9)
  strengths:    [{ point: '…', quote: '…' }],              // 2–3
  improvements: [{ point: '…', quote: '…', fix: '…' }],    // 2–3
  errors:       [{ quote: '…', tag: 'gra-tense', fix: '…' }],   // 3–5, tags from TAGS
  nextGate: '…',                         // the ONE change that unlocks the next overall band
  comment: '…',                          // 100–150 words, T.Chris's voice, level sentence filled by code
  panel: {
    examiners: [                         // A and B always; C only when called
      { id: 'A', bands: { ta, cc, lr, gra, overall }, why: { ta: '…', cc: '…', lr: '…', gra: '…' }, model: '…' },
      { id: 'B', … }, { id: 'C', … }
    ],
    disagreed: ['ta'],                   // criteria where A and B were 1.0+ apart ([] if none)
    third: false,                        // true when Examiner C marked
    method: 'agreed' | 'lower' | 'median' | 'single',   // identical · within half a band (cautious examiner kept) · third examiner · one examiner answered
    kept: 'B',                           // whose marks were kept when there was no third examiner
    thirdFailed: false,                  // a third examiner was needed and did not answer
    spread: 0.5,                         // largest A–B gap on any criterion
    single: false                        // true if only one examiner answered (the other call failed twice)
  },
  quotesDropped: 0,                      // quotes the model gave that are not in the report (removed)
  model: '…', at: 'ISO'
};
```

A quote that does not occur in the report text (after normalising spaces, quote marks and case)
is removed: an `errors` / `improvements` entry without a real quote is dropped, a `strengths`
entry keeps its point and loses the quote. `quotesDropped` counts them.

Reports marked before this build have a v1 `rep.ai` (no `v`, no `criteria`, maybe `second`).
Both screens must still render them.

## 3. `rep.teacher` after review (written by teacher.js; read by student.js)

```js
rep.teacher = {
  bands: { ta, cc, lr, gra, overall }, cefr, comment, at,       // as before
  criteria: { ta: { band, met, notMet, toNext, next }, … },     // edited copy; band = the select's value
  strengths: [{ point, quote }], improvements: [{ point, quote, fix }],
  errors: [{ quote, tag, fix }], nextGate: '…',
  fromAi: true                                                  // started from the panel's report
};
```
`markReport(id, { teacher, released, status, aiVisible })` is unchanged. A mark saved without
the new fields (old data) still renders as before.

## 4. Backend actions

- `submitReport` — unchanged reply; also kicks the panel.
- `markReport(id, { requestAi: true })` with a real id (teacher only): clears `rep.ai` and
  `rep.aiFailed`, sets status `submitted`, kicks. Reply `{ ok: true, queued: true }`. Refused with
  `{ ok: false, error }` once the report is released. `id: '*'` works as before ("mark all waiting").
- `aiStatus` — now also returns `waiting` (reports with no AI report yet and fewer than 2 failures)
  and `failed` (2 failures: needs "Mark again").
- `rep.aiFailed` (number) and `rep.aiNote` (why: no task data, daily limit, could not be saved…)
  are visible to the teacher in `reports`, never to the student.
- `submitReport` discards `ai`, `teacher`, `released`, `aiVisible`, `aiFailed` sent by the app,
  counts the words itself, caps the text at 8,000 characters, and sends at most
  `AI_PER_STUDENT_DAY` (6) reports per student per day to the examiners (the rest are stored and
  wait for "Mark again").
- When `aiVisible` is on, the student's copy of `rep.ai` has no `panel`, `model` or `quotesDropped`.
- A run marks for about 90 s, then the next trigger carries on; a report whose run was killed
  twice, or whose result cannot be saved, is marked failed with a note instead of being retried.

**Third examiner's model (T.Chris, 12 Nov 2026).** Examiners A and B use the panel's model. Examiner C,
called only for a dispute, is a different model: `CC_MARK_MODEL_C`, default `claude-opus-4-8`, never the
panel's first model. If it cannot answer, the panel's model does and `panel.thirdSameModel` is true.

**Daily budget (T.Chris, 12 Nov 2026).** The marking day is the Bangkok day. A report is started only when
3 calls are left (two examiners and room for a third). When the budget is reached, the reports still
waiting stay queued (no failure, no note) and one trigger (`CC_tomorrow`) is set for 00:05 Bangkok time;
it marks them from the new day's budget. `aiStatus.queuedForTomorrow` tells the Staff Room, which shows
"queued for tomorrow (daily AI budget reached)". The per-student limit of 6 a day is separate: those
reports wait for "Mark again".

**Counted ceilings (12 Nov 2026).** The server counts words and paragraphs, states the result in the prompt and
holds each examiner's band to it: ≤20 words Band 1 everywhere; <100 TA ≤4; <150 TA ≤5; one block CC ≤5;
two paragraphs CC ≤6. The criterion's `notMet` / `toNext` then carry the reason; `ceilings` lists it first.

Script properties: `CC_MARK_MODEL` (optional chain for the panel; falls back to `CC_MODEL`),
`CC_MARK_MODEL_B` (optional: a different model for Examiner B, for a more independent second
opinion), `DAILY_MODEL_BUDGET` (each report costs 2 calls, 3 with a third examiner; a retry after
a failed call costs one more each and stops when the budget is spent).

## 5. Staff Room (Opus 5.5)

Marking list: status text per report — `waiting for the examiners` (no ai, aiFailed < 2) ·
`AI report ready` (ai, no teacher) · `AI report ready · third examiner` (panel.third) ·
`examiners could not mark (Mark again)` (aiFailed ≥ 2) · `marked` · `returned`.
While the Marking tab is open and any listed report is waiting, re-read `api.reports()` every 30 s
and repaint the list; never repaint the detail pane while T.Chris has changed any field in it.

Detail pane, in this order: header and chart (as now) → her report → **The examiners' panel**
(a compact table: Examiner A / B / (C) / Final per criterion and overall; disagreed criteria
marked; one line saying how the final was reached; each examiner's one-line reason per criterion
behind a disclosure) → **Marks and feedback to return** (all editable, pre-filled from
`rep.teacher` if it exists, else from `rep.ai`):
- per criterion: the band select (ids `#mk-ta`, `#mk-cc`, `#mk-lr`, `#mk-gra` kept) and three
  textareas: "What earned this band", "Where the next band was not met", "To reach Band N"
  (N follows the select);
- strengths and improvements (one row each, editable, removable, "Add");
- quoted errors (editable fix, removable); next gate; the comment (`#mk-comment` kept);
- buttons: `#mk-save` "Save draft", `#mk-release` "Return to student", `#mk-unrelease`,
  `#mk-remark` "Mark again" (confirm first; calls `markReport(id, {requestAi:true})`),
  `#mk-copyprompt` kept. `#mk-aivis` kept inside the panel block.
- Ten Wards, plan and first draft disclosures stay, below the feedback.
A v1 `rep.ai` (no `criteria`) shows the old estimate block and empty criterion textareas.
If T.Chris changes a band select away from the panel's band, leave the text alone and show a
small note beside that criterion: "Band changed: check the text still fits."

## 6. Report Card (Opus 5.5)

`openReport` in student.js: when the shown mark (released `rep.teacher`, or `rep.ai` when
`aiVisible`) has `criteria`, show after the bands: one card per criterion (name in full, band,
"What you did", "Why not Band N yet", "To reach Band N"), then "Your strengths" and "To improve"
with her words quoted, then the quoted errors (as now, with `partnerLink`), next gate, comment.
Empty fields are skipped. Plain text only (`esc` everything). Phone width 390 px: no sideways scroll.
The owl screen after sending says the examiners are marking now and the marks appear on the
Report Card when T.Chris returns them (no band is promised there).

## 7. Rules that hold everywhere

ES5 in browser files. No id, `cc.*` key, API action or Sheet column removed or renamed.
`?v=20261112a` on every changed script and stylesheet in `index.html` and `teacher.html`.
Never type a password or the PIN. Error tags only from `ielts-task1-expert` §3 (Code.gs `TAGS`).
