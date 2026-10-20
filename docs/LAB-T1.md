# The Task 1 Spellbook — My Spellbook + Spellbook Workshop

Owner: Opus B. Task 1 port of the Task 2 Template Lab (IELTS-WT2 `lab.js`, `template.js`, `Lab.gs`).
A student builds **one spellbook page per mode** (TREND · COMPARE · SEQUENCE · SPACE) in her own words,
then **casts** it on charts from the bank: every figure, year and name she puts in a slot is checked
against the chart's data by rule, offline and free.

## Files

| file | what it is |
|---|---|
| `template.js` | `window.Template`: the data checker (`Template.Data`), the store, **My Spellbook** view (`Template.mount`), the Scriptorium API (`framesFor`, `fill`) |
| `lab-content.js` | `window.LabContent`: the four mode blueprints (variables, lines with B1/B2/C1 examples, class drafts A1–A4), shares, levels, points, ranks, keepsakes, register rules |
| `lab-scenario.js` | `window.LabScenario`: the four Thai Test Drive charts (Lamphun, Chiang Rai, coconut sugar, Ban Khlong — the A1–A4 data sets) with fills |
| `lab-examples.js` | GENERATED from `examples-t1/*.json` by `tools/lab-build-examples.js`: Ploy (A2, 60%), Nam (B1, 60%) and Fah (B2, 40%), one page per mode |
| `lab-samples.js` | `window.LabSamples`: one whole filled-in sample line per Design line at A2 and B1 (4 modes × 8–9 lines × 2), each set on one bank chart with a full set of slot values; shown under "Show an example" on the line card. Hand-written; every value is checked by `lab-validate.js` §6 |
| `lab.js` | `window.Lab`: the Spellbook Workshop (Design · Cast it on a chart · Spellbook record · Examples) |
| `lab.css` | styles for both views (uses theme tokens only) |
| `Lab.gs` | Apps Script back end: `lab.status/list/saveTemplate/saveAttempt/deleteTemplate/deleteAttempt/coach/rate` |
| `examples-t1/` | example sources + `populations.json` (an automatic fill of every variable for every bank prompt, written by `lab-validate.js --write`) |
| `tools/lab-*.js`, `tools/template-test.js`, `tools/lab-smoke.py`, `tools/lab-harness.py` | tests (below) |

## Integration

### index.html
```html
<!-- head, after theme.css -->
<link rel="stylesheet" href="lab.css?v=20261012">

<!-- main, with the other views -->
<section id="view-template" class="hidden"></section>
<section id="view-lab" class="hidden"></section>
```
Script order (as in the spec; `models-2.js` and `prompts-3.js` where they belong):
```html
<script src="prompts.js"></script><script src="prompts-2.js"></script><script src="prompts-3.js"></script>
<script src="template.js"></script>
<script src="lab-content.js"></script>
<script src="lab-examples.js"></script>
<script src="lab-samples.js"></script>
<script src="lab-scenario.js"></script>
<script src="models.js"></script><script src="models-2.js"></script>
…
<script src="charts.js"></script><script src="writer.js"></script> … <script src="engine.js"></script><script src="api.js"></script>
<script src="lab.js"></script>
```
`template.js` and `lab-content.js` only touch `CONTENT`/`Charts`/`Writer` when they are called, so their early place is safe.
`lab.js` must load after `charts.js`, `writer.js`, `engine.js` and `api.js`.

### student.js
```js
// in show(v):
if (v !== 'lab' && window.Lab) window.Lab.leave();          // pauses a cast clock, keeps a typed line
if (v === 'template') Template.mount($('#view-template'), window.PCHost);
if (v === 'lab' && window.Lab) window.Lab.mount($('#view-lab'), window.PCHost);
```
Both views render inside the element they are given; nothing else in the page is touched (except
`#modal-slot` through `host.modal`, and `document.querySelector('.bar')` to dock the cast clock under the header).

**PCHost members used** (all optional except `p`):

| member | used for |
|---|---|
| `p` (getter) | the progress object: `studentId`, `xp` (Merits), `badges`, `lab` (summary written here), `cohort` |
| `toast(msg)` | saved / offline / version messages |
| `modal(html)` | "Time is up" in a 20-minute cast (`[data-close]` closes it) |
| `sync()`, `syncSoon()` | after points and keepsakes |
| `paintHeader()` | Merits changed |
| `celebrate(badge, rest)` | a Workshop keepsake was earned |
| `show(view)` | My Spellbook → "Design it in the Workshop" (`show('lab')`) |
| `openWriter(promptId, text)` | **new**: "Open in the Scriptorium" on a cast report — open the Writer on that prompt with the report text loaded. Without it the report is copied and a toast says so. |
| `tier()` | optional: default target level for a new page (`'B1'|'B2'|'C1'`); a B1-track student whose `p.explainLevel` is A1/A2 starts at the A2 setup level |
| `labMode(mode)` | sets `window.LAB_START_MODE`; on the next `Lab.mount` the Workshop opens Design for that mode (setup preselected, a draft continued, or home when the page exists) and clears the flag |

**Scriptorium (writer):** `Template.framesFor(p, mode)` → `{ mode, name, pct, level, version, templateId, paraKeys:['intro','overview','groupA','groupB'], paragraphs:['… {visual} …', …], slots:[{id,label,shape,job}] }` or `null` (no saved page for that mode → show the generic flight-plan guide).
`Template.fill(frames, {key:'text' | {text, text2}})` → the report text (second mention uses `text2`; empty slots stay as `[Label]`).
`Template.fill('frame text', values, {html:true, labels:Template.labels(mode)})` → one string with slot spans.
The page "in use" per mode is the student's choice (Workshop "Put in My Spellbook", or the picker in My Spellbook); otherwise the latest complete page.

### Code.gs — LAB-HOOK
Add `Lab.gs` as a second script file, then this ONE line in `doPost`, straight after the JSON parse and before the lock:
```js
if (String(req.action || '').indexOf('lab.') === 0) return out(LAB_handle(req.action, req.payload || {}));
```
Lab.gs relies on `findStudent(id)` (returns the row with `.id` and `.token`) and `log(msg)` from Code.gs — both exist in this repo's Code.gs. Script properties: `ANTHROPIC_API_KEY` (required for AI), optional `LAB_COACH_MODELS`, `LAB_RATE_MODELS`, `LAB_STUDENT_DAILY` (250), `LAB_DAILY` (4000). Run `testLabAI` once in the editor to see which model answers.
Sheets created on first use: `LabTemplates` (…, `mode`, `json`) and `LabAttempts` (…, `mode`, `accuracy`, `json`). The client sends `studentId` + `localStorage['cc.token']` with every call; base URL is `API.url`.

### Story gates and events
```js
Lab.designed(p, 'TREND')        // true once a complete TREND page is saved (gate extra {id:'lab-design', mode})
Lab.casts(p, { timing: '1min', full: true })   // number of finished casts (tournament task 'tour-cast'; also mode/since filters)
```
`Lab.designed` reads `p.lab.modesDesigned` (synced with progress) and falls back to the local store.
`p.lab` (written by the Workshop) = `{ points, templatesComplete, modesDesigned:{TREND,COMPARE,SEQUENCE,SPACE}, cleanTemplates, runs, bestBand, accuracy, byShare:{'60':{n,best,sum,rated,acc}…}, byMode:{TREND:{n,best,acc}…}, fullPcts, perfectCasts, cleanCasts, timedCasts, clockClean, beatBest, maxVersion }`.

### Keepsakes
`LabContent.BADGES` (pushed into `CONTENT.BADGES` by lab.js, each with `test(p)`): `lab-first`, `lab-four`, `lab-true`, `lab-wards`, `lab-lean`, `lab-clock`, `lab-beat`. The current engine's `checkBadges` uses `BADGE_TESTS` by id; lab.js also runs these `test` functions itself after every milestone, so they work either way.
A quarter of Workshop points goes to Merits (`p.xp`). Workshop ranks: Apprentice Chartwright (0) · Chartwright (300) · Spellwright (900) · Enchanter (2000) · Master Chartwright (4000).

### Levels and shares
`LabContent.LEVELS`: A2 (band 4.5–5.5, shows the B1 examples, `budgetScale` 0.68 and a tight `budgetSpread` so a 60% TREND intro is 9–14 page words) · B1 · B2 · C1. Default level from the track (`PCHost.tier`), default share by level: A2/B1 60, B2 50, C1 40. The A2 level's note and the pointers from the Design hero and the setup name the three example students: "See how Ploy (A2), Nam (B1) and Fah (B2) built theirs →".

### Upgrade round 1 (WP16–23) — behaviour the harness bot relies on
- Design, offline (`st.ai === false`): the line button reads **Check line →** (`#lab-coach`); a clean line (no errors, no warnings) moves straight to the next line — `st.build.idx` advances, `#lab-fb` shows a one-line banner (`.lab-fb-prev`), `#lab-next` is not needed. A line with something to fix stays, as before.
- 1-minute cast: a **Start card** (`#lab-startcard`, button `#lab-rstart`) comes before the first variable; the clock is not running while the chart is studied. 60 s per card, 90 s for the intro paraphrase slot (check type `what`).
- "Show an example" toggles: Design line card `#lab-bsample` → `#lab-sample`; cast variable card `#lab-veg` → `#lab-vegbox` (VAR.eg / eg2, "from another chart").
- Examples pointer `[data-exgo]` (Design hero, setup); mission note `#lab-missionnote` in the setup.

### The Examples tab (lab-examples.js, WP30)
Three AI-simulated students, one page per mode, each cast on one bank chart. Sources are `examples-t1/<student>-<mode>.json` (`id, student, mode, level, pct, promptId, lines` with `[Slot Label]`s, `vars` `{text, text2}`, `coaching` first → flagged → fixed, `rating` TA/CC/LR/GRA/overall/cefr/summary/strength/priority); `examples-t1/students.json` holds the picker (`E.students`, in picker order) and the note. `node tools/lab-build-examples.js` rebuilds the file; Nam's and Fah's sets come out byte-identical.

| student | level · target | share | charts (TREND · COMPARE · SEQUENCE · SPACE) | reports |
|---|---|---|---|---|
| Ploy | A2 · Band 5 (rated 4.5, B1) | 60% at the A2 budget (60–66 page words) | p-table-schools · p-bar-homework · p-proc-silkworm · p-map-thai-town | 122–144 words, 1–2 A2 slips each (in the casts, never in the frames) |
| Nam | B1 · Band 5.5–6 | 60% | p-line-museums · p-bar-activities · p-proc-noodles · p-map-riverside | 161–175 words |
| Fah | B2 · Band 6.5–7 | 40% | p-line-cities · p-table-salaries · p-proc-turtle · p-map-lake | 158–167 words |

Ploy's frames are the shortest that do the job (intro lines 7–11 page words, every line inside the A2 budget `LEVELS.A2.budgetScale`/`budgetSpread`); overview frames carry no figure slot and no number; every detail sentence carries a figure, a year or a chart label. Her reports are 120–145 words on purpose: the Ten Wards' length row stays red (under 150 caps Task Achievement at 5), and the note above the picker says so. The pointer `[data-exgo]` and a fresh mount open the example student at the student's level (A2 → Ploy, B1 → Nam, B2/C1 → Fah; `exStudentFor` in lab.js).

`lab-validate.js` §4 checks every set: page in own words (no copy of a line example), every value ✓ against its chart (`Template.Data.check`), quick-check errors on frames and values, no number or figure slot in an overview frame, share within 20 points of the page, Ten Wards with no red row, overall = rounded mean, CEFR by the official map. On top, for an A2 set: every line within the A2 page-word budget, intro lines 12 page words at most, the whole page within the A2 60% page, second mentions (`text2`) ✓ too, 120–145 words (the length row may be red, nothing else), every detail sentence with a figure, a year or a label. `lab-smoke.py` opens all twelve sets and checks the same in the browser.
- My Spellbook, Exam fade: the slot list hides behind `[data-peek=MODE]`; the memory check reports words recalled AND word pairs in order (`Template._recallDetail` → `{words, order}`; verdict needs 60% of pairs).
- Data checker (`Template.Data.check`): a label named in another clause of a value no longer switches the series; number words one–twelve before a unit are figures; the near-miss note names the year slip; a change statement in a START/END figure slot is still ✗ but says "This slot wants the END figure (e.g. 90%), not the change".

## Storage
`localStorage['cc.lab.v1.<lower-case id>'] = { templates:[…], attempts:[…], dirty:{id:kind}, inUse:{MODE:templateId} }`; `cc.share.<id>` = last share chosen. No `pc.*` keys.

## The pages (lab-content.js)
Four paragraphs: P1 intro ≈30 · P2 overview ≈45 (starts "Overall,", no figure slots) · P3 group A ≈60 · P4 group B ≈60 · no conclusion · 175-word budget.

| mode | variables | lines | class draft |
|---|---|---|---|
| TREND | Visual, What It Shows, First/Last Year, Group A/B, Trend A/B, Key Feature, Start/End Figure A/B (13) | 9 | A1 |
| COMPARE | Visual, What It Compares, Largest, Smallest, Group A/B, Main Difference, Top/Bottom Figure, Figure A/B, Exception (12) | 8 | A2 |
| SEQUENCE | Visual, What It Shows, Number of Stages, Linear or Cyclical, Starting Point, End Product, Stage 1–6, Middle Point (13) | 9 | A3 |
| SPACE | Place, First/Second Map, Overall Change, Unchanged/Removed Feature, Location 1/2, New Feature A/B, Extended/Converted Feature, New Use (13) | 8 | A4 |

Fewer lines than Task 2 (8–9, not 14) because a Task 1 report is 160–190 words; directions ("rose") live in the Trend slots, never in the frame (the quick check warns), so one TREND page works for rising and falling charts. Every variable can be filled for every bank prompt of its mode (checked by `lab-validate.js`), except the single-plan map `p-map-park` (one panel: a layout, not changes), which the Cast list leaves out with a note.

## The data checker (template.js `Template.Data.check`)
figure (exact; approximation words within half a gridline — pies ±2.5 points, tables ±5%; "just over / nearly" sides; "by" = a difference; percentage points vs %; relative % on non-% charts; thousands/millions/dollars; a bare "420" on a thousands chart = unit missing; totals of two values; the figure's line/bar/row and year from the context slots) · year (in range, first/last, on the axis; projections) · group/label (case, article, plural, apostrophes, labels with numbers like "18–29", "Alpha 12") · top/bottom · trend direction from the data · no figures in overview slots · visual type · paraphrase + unit · stage order and count, linear/cyclical · map features (on which map, moved or changed), compass point from the map coordinates, extended vs reduced · tense by mode (past simple, projections, present simple for processes, future for a plan). ✓ = ok, ≈ = nearly (approximation/unit/% sign), ✗ = not what the chart shows (including a value read from the wrong line or year).

## Tests
```
node tools/lab-check-test.js        # 125 data-check cases + the models' figures as a corpus
node tools/lab-validate.js          # content, scenario, every variable × every bank prompt, examples, sample lines, ES5, UK spelling
node tools/lab-validate.js --write  #   … and rewrite examples-t1/populations.json
node tools/lab-build-examples.js    # rebuild lab-examples.js after editing examples-t1/*.json
node tools/template-test.js         # framesFor / fill / store / memory check
node tools/lab-gs-test.js           # Lab.gs in Node: fake sheet + fake Claude (emulates the LAB-HOOK if Code.gs lacks it)
python3 tools/lab-smoke.py          # Playwright, offline: design → cast → report → record → examples → My Spellbook → 390 px (CHROME=<path> picks the browser)
python3 tools/lab-smoke.py --mock   # same against a mocked Apps Script (AI coaching + rating)
python3 tools/lab-harness.py        # serve the stand-alone harness at http://127.0.0.1:8777/__lab.html
```
Screenshots land in `tools/shots/lab-*.png` (not committed).
