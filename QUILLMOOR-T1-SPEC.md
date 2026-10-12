# Quillmoor Academy — The Observatory (Task 1) · build contract

Chart Control (this repo, IELTS Academic Writing **Task 1** self-study app, https://pegasus028.github.io/IELTS-WT1/) is
being upgraded to the feature set of its Task 2 sibling, Quillmoor Academy (https://pegasus028.github.io/IELTS-WT2/,
local copy `/root/work/IELTS-WT2`, read its `QUILLMOOR-SPEC.md` and `README.md`). The story continues the **same
world** (Quillmoor Academy) in a new part of the castle: **the Observatory**, where students learn to write factual
reports on charts, graphs, tables, processes and maps. Read this file fully before writing anything. It is the binding
contract between the parallel builders. Orchestrator: Fable 5.1. Builders: Opus 5.5 (story; Spellbook Workshop).

## Goal and audience
Overarching goal (T.Chris): help 13–17-year-old Thai students at CEFR B1/B2 reach **Band 7.5+ in IELTS Academic Writing
Task 1**. Method: each student **builds a personalised template** (her/his "spellbook", one page per mode) and practises
populating its variables from real visuals in a self-study app. Two cohorts:

| Cohort (roster `cohort`) | Who | Story history | Pace |
|---|---|---|---|
| `Tutoring` (**returning**) | 6 private tutees: Aeh, JingJing, Pear, Mikii, Donut, Soda | Already started Quillmoor (Task 2 app): know the castle, the four houses, Penhallow, Juno, Felix, Celeste, the Gossip Quill, the spellbook idea, the Ten Wards. Sorted into a house there (except possibly Soda). | 2 h/week online + 1–2 h homework |
| `M4.1` (**new**) | 30 students of class M4.1 (Satriwithaya, all girls, 15–16) | Have never seen the story. Did Task 2 essays in class last semester, not in the app. | course EN31208, one 50-min period/week, 29 Oct 2026 – 12 Feb 2027, app = homework (~40–60 min/week) |

Note: Soda is a boy (M2). Story text addresses the reader as "you" and must stay **gender-neutral for "you"** (no "girl",
"she" for the reader, no skirt/braid mentions in text). The existing pictures show a girl heroine; that is accepted.

## Hard rules (all builders)
1. **IP (level C):** no Harry Potter names anywhere in the app (Hogwarts, Gryffindor…, Quidditch, Muggle, Patronus,
   Platform 9¾, Diagon Alley, Dumbledore, Snape, Trelawney, spell words, Sorting *Hat*, floating candles, red steam train,
   Divination). Original Quillmoor world only. See `/mnt/skills/plugins/harry-potter/SKILL.md` §1, §8, §9.
2. **Truth:** every claim about IELTS Task 1 must be literally true (see `/mnt/skills/plugins/ielts-writing-task-1/SKILL.md`):
   20 minutes recommended, at least 150 words (aim 160–190), one examiner, four criteria TA (Task **Achievement**), CC, LR,
   GRA, equally weighted; Task 2 counts twice as much as Task 1 in the Writing band; the overview is the gate (no overview →
   TA capped at 5); no opinions, reasons, conclusions; every body sentence carries data; at least two comparisons; group the
   data into two; S1–S8 sentence patterns; E1–E7 error families; four modes TREND / COMPARE / SEQUENCE / SPACE; the 10-point
   check. Story-only devices ("four examiners", "the Almanac seal") must be presented as story, never as test facts.
   CEFR only via the official map (5.5–6.5 ≈ B2, 7–8 ≈ C1, 4–5 ≈ B1). Band 7.5 = e.g. two criteria at 8 and two at 7.
3. **Do not change** `cc.*` localStorage keys, API action names/payloads, sheet columns, item/sub/level/check ids, prompt ids.
4. UK spelling. Story text at B1: average ≤ 15 words per sentence, present tense, second person. Spoken lines use spoken
   connectors (so, but, because, anyway, after all); formal connectors (moreover, consequently…) only inside written things
   in the story (letters, newspaper, exam papers, report extracts), and every connector must fit its logical relation.
5. Mixed cast is fine. Scenes do not stand for a Satriwithaya classroom; no Thai school uniform.
6. **Do not `git commit` or `git push`.** Edit only the files you own (ownership table). Report integration needs in your final message.
7. Content files are **ES5** (no arrow functions, no let/const, no template literals) — they run on old school iPads.

## World (fixed)
Everything in `/root/work/IELTS-WT2/QUILLMOOR-SPEC.md` "World" still holds (academy, motto *Verba vincunt*, houses,
cast, places, tram, Sorting Lantern, the Gossip Quill and *The Whisper*, *The Quillmoor Lantern*). New for this term:
- **The Observatory**: a tall round tower on the east side of the castle. Its top room holds the **living charts**: lines,
  bars, pies, tables, process wheels and moor maps that hang in the air and move. Students who write reports on them are
  **chartwrights**. A new teacher keeps it (Opus A names and describes them: original, no HP likeness, not a divination/
  fortune-telling figure; a practical scientist-archivist).
- **Houses for Task 1:** same four houses and colours. Criterion of Compass becomes **TA (Task Achievement)** for Task 1
  ("in Task 2 it was Task Response"). Bridge CC, Lexicon LR, Loom GRA.
- **The villain's new trick:** the Gossip Quill now prints fake chart reports in *The Whisper*: invented numbers, opinions
  and reasons ("because people love…"), a conclusion, no overview, one block of text, copied task sentences, year-by-year
  listing. Students defeat it by reporting only what the chart shows, with numbers, grouped, compared.
- **Felix's catch-phrase** this term: "Where's the number?" **Juno**: "Group them!" **Celeste** (returning readers know her
  arc: she built her own spellbook last term) helps new readers believe that personal templates beat memorised ones.
- **Final**: **the Almanac Examination** — one visual, twenty minutes, a report at the Band 7.5 standard earns the
  **Almanac seal** (story). In real IELTS the report is marked by one examiner on four criteria.
- **Feature names** (Task 2 names reused so returning students feel at home):

| view id / feature | label shown |
|---|---|
| plan | Map Room · map | Classes · bootcamp | Duelling Hall · writer/write | Scriptorium · template | My Spellbook · lab | Spellbook Workshop (Design · Cast it on a chart · Spellbook record) · models | Exemplar Archive · vids | Memory Basin · pods | Castle Wireless · faults | Mending Room · record | Report Card · settings | Your Trunk · live | Assembly |
Systems check → examiner's gate · XP → Merits · streak → Candles · badges → Keepsakes · assignments → Owl post ·
the 10-point pre-flight check → **the Ten Wards** · planning checklist → **Plan Wards** · Flight Deck → Staff Room ·
partner apps → Elective classes · gate readiness TA/CC/LR/GRA → the four examiners' verdicts (North, Brigg, Liang, Weaver) ·
"report" (keep the word report: a Task 1 answer is a report, not an essay) · "Send to the examiners" = submit a report for marking.
Ranks: Newcomer, First-year, Second-year, Third-year, Fourth-year, Fifth-year, Prefect, Graduate (thresholds 0,1,3,5,8,10,12,15 checks).
Duelling Hall ranks: Novice, Apprentice, Duellist, Adept, Master Duellist, Champion (0,100,250,450,700,1000).

## The chapters (engine reads `window.STORY.chapters`)

| ch | id | title | place | missions (existing ids) | gate | opens | keepsake | EN31208 weeks |
|---|---|---|---|---|---|---|---|---|
| 1 | ch1 | The Letter (new) / A New Term (returning) | Hall of Lanterns → the Observatory | event `sorting` (new) or `house` (returning); m00s1–3, m00l1; m01s1–3, m01l1 | m00l1 + m01l1 | plan, map, pods, vids, record, settings | `key` (the Observatory key) | 1 |
| 2 | ch2 | The Four-Part Charm | the Observatory | m02s1–3, m02l1; writing: a first guided report in the Scriptorium | m02l1 | writer | `charm` | 2 |
| 3 | ch3 | The Watchtower | top of the Observatory (the whole moor below = the big picture) | m03s1–3, m03l1; m04s1–3, m04l1; view bootcamp "Duelling Hall: steps 1–4" | m03l1 + m04l1 | bootcamp | `spyglass` | 3–4 |
| 4 | ch4 | The Tide Clock | Spellbook Workshop + the Tide Clock (a clock of rising/falling water = TREND) | m05s1–3, m05l1; m06s1–3, m06l1; view lab "Design your TREND page"; writing: one report sent | m05l1 + m06l1 + extra `lab-design`{mode:'TREND'} + `report-sent`{min:1} | template, lab, models | `clasp` | 5 |
| 5 | ch5 | The Hall of Scales | hall of brass scales (COMPARE) | m07s1–3, m07l1; view lab "Design your COMPARE page"; view faults | m07l1 + `lab-design`{mode:'COMPARE'} | faults | `scales` | 6–7 |
| — | — | Midwinter Tournament (optional event after ch5) | Examination Hall | timed Duelling Hall run; one chart cast with the spellbook at 1 min per variable; one 20-minute report | — | — | `token` | 8 (midterm) |
| 6 | ch6 | The Cellars and the Moor Maps | Brewing Cellars (SEQUENCE: a brewing process) + Map Room (SPACE) | m08s1–3, m08l1; m09s1–3, m09l1; view lab SEQUENCE and SPACE pages | m08l1 + m09l1 + `lab-design`{mode:'SEQUENCE'} + `lab-design`{mode:'SPACE'} | — | `vial` | 9–10 |
| 7 | ch7 | The Library and the Newsroom | Long Library + the Lantern office | m10, m11, m12 subs and checks; view faults "fewer than 5 faults due" | m10l1 + m11l1 + m12l1 + `faults-under-5` | — | `press` | 11–12 |
| 8 | ch8 | The Almanac Examination | Examination Hall | m13, m14 subs and checks; view models; writing: three mock examinations | m13l1 + m14l1 + `report-sent`{min:3, kind:'mock'} + `best-band`{min:7.5} | — | `seal` | 13–14, then ongoing |

Gate `checks` list **level ids** (`mXXl1`); also give `checkIds` (`mXXck`) like WT2. Owl post and Assembly always open.

### Cohort variants
- Every page/ending/gate line may carry `only: 'new'` or `only: 'returning'`; pages without `only` are shown to both.
  A chapter may have `endingReturning` (optional) used instead of `ending` for returning readers.
- `p.story.returning` is decided by the engine: true if the student's roster cohort is `Tutoring`, or Quillmoor (Task 2)
  progress exists on this device (`pc.local.v1` / `pc.session`), or she says so in Your Trunk; false otherwise.
- Chapter 1 for **new** readers: the letter arrives (owl), the tram, the Hall of Lanterns, the Sorting Lantern (event
  `sorting`: 12 **Task 1** questions → house), breakfast with *The Whisper*'s fake chart report, the Observatory.
- Chapter 1 for **returning** readers: second term begins; back on the tram; the house is already theirs (event `house`:
  the engine imports the house from Quillmoor progress on this device, or asks her to pick her house or take the Sorting);
  Penhallow explains what changes in Task 1 (**the habits that won last term now lose marks**: no position, no opinion, no
  conclusion, 20 minutes, 150+ words, facts only, the overview instead of the thesis); the Observatory.
- Chapters 2–8: shared text; at most one or two `only` lines per chapter (a returning nod such as "like the Ten Wards last
  term").

## Data contracts

### `story-content.js` (owner: Opus A)
Same shape as `/root/work/IELTS-WT2/story-content.js` (read it: houses, chapters, pages, missions, gate, ending, newsroom,
events, mapIntro, finale), plus:
```js
window.STORY = {
  version: '2026-10-12', term: 'The Observatory',
  houses: [ { id:'compass', name:'Compass', crit:'TA', critName:'Task Achievement', values:'…', main:'#1F3A5F', accent:'#C0C7D1',
              emblem:'compass rose', head:'Professor Rhea North', motto:'…', welcome:'…(new)', welcomeBack:'…(returning, Task 1 twist)',
              challengeLine:'…' }, …bridge CC, lexicon LR, loom GRA… ],
  chapters: [ { id:'ch1', n:1, title:'The Letter', titleReturning:'A New Term', place:'…', blurb:'…', blurbReturning:'…',
      keepsake:{ id:'key', name:'…', desc:'…' }, opens:[…],
      pages:[ { img:'story/ch1-03.webp', alt:'describes the picture exactly', text:'40–90 words, B1, [[keyword|English gloss|คำไทย]]',
                only:'new'|'returning' /*optional*/, event:'sorting'|'house' /*optional*/, choice:{…} /*optional*/,
                artWish:'optional: the picture this page really needs, for a later art run' } ],
      missions:[ {kind:'event', event:'sorting', label, note, only:'new'}, {kind:'event', event:'house', label, note, only:'returning'},
                 {kind:'sub', id:'m00s1'}, {kind:'check', id:'m00l1'},
                 {kind:'view', view:'lab', mode:'TREND', label, note}, {kind:'view', view:'bootcamp', label, note},
                 {kind:'writing', label, note, min:1, kind2:'report'|'mock'} ],
      gate:{ checks:['m00l1','m01l1'], checkIds:['m00ck','m01ck'], extra:[{id:'lab-design', mode:'TREND', label, note}, …],
             intro:'…', pass:'…' },
      ending:{ img, alt, text }, endingReturning:{…optional}, newsroom:'…' } ],
  events:{ tournament:{ title, pages:[…], tasks:[{id:'tour-duel',label,view:'bootcamp',note},{id:'tour-cast',label,view:'lab',note},{id:'tour-report',label,view:'writer',note}] } },
  mapIntro:'…', mapIntroReturning:'…', finale:{ text:'…' }
};
```
- 5–6 pages per chapter + ending (chapter 1 may have up to 9 pages counting both variants). 6–10 keywords per chapter
  (Task 1 vocabulary useful for that chapter's skill: overview, trend, fluctuate, proportion, respectively, stage, demolished…).
- **Pictures:** reuse the 57 existing Quillmoor pictures (copied into `story/` with their WT2 names; catalogue in
  `docs/IMAGE-CATALOGUE.md`). Choose the closest picture for each page; the `alt` must describe what that picture actually
  shows (you may reword the WT2 alt; never claim the picture shows a chart it does not show). Where the fit is poor, keep the
  closest picture and add `artWish`. Avoid using the same picture twice in one chapter; reuse across chapters is fine.
- The story teaches *with* the method: overview first and no numbers in it; every body sentence has a number; two groups;
  compare; mode triage; personal spellbook pages filled with prompt-specific variables (never a memorised answer); the 10
  Ten Wards; reference and substitution over linker soup.

### `sorting.js` (owner: Opus A)
Same shape as WT2 `sorting.js` but `crit` ∈ `TA|CC|LR|GRA`; 12 items, 3 per criterion; Task 1 English (stems may describe
a small chart or table in words). T.Chris's six-point check: natural stem; one unambiguous answer; key is the longest option
≤ 3 times out of 12; answer positions 3/3/3/3; one near-miss distractor per item; `why` ≤ 35 words. Mixed B1/B2 (6 each).
TA: overview vs detail, opinion/conclusion in a report, missing category; CC: grouping, reference ("the latter", "this
figure"), paragraph order; LR: trend/compare collocation, precision ("percentage points"), register; GRA: tense by time frame,
prepositions with figures (to/by/from…to/at), agreement, passive in a process.

### Word cards (owner: Opus A)
`tools/words/cards-t1.json` — same entry shape as `/root/work/IELTS-WT2/tools/words/cards.json`, only for story keywords
(and their syn/ant words) that are **not** already in the WT2 file. Icons are Lucide names (lucide-static). The orchestrator
merges both files and builds `story-words.js`.

### Story state (engine, owner: Fable)
`p.story = { house, sort:{TA,CC,LR,GRA,at}, chapter, unlockedTo, seen, flags, keepsakes, hp, tournament, visited, words, returning }`.
House points derived (no drift): 5 × lessons passed + 20 × gates + 2 × faults mended (max 100) + 15 × reports sent
+ 25 × reports marked ≥ 7.5 + 10 × tournament tasks. Teacher unlock/resort rows exactly as in WT2.

### Spellbook (owner: Opus B) — see the brief in `docs/LAB-T1-BRIEF.md`
- Progress summary on `p.lab = { points, templatesComplete, modesDesigned:{TREND:bool,COMPARE:bool,SEQUENCE:bool,SPACE:bool}, runs, bestBand, byShare:{…} }`.
- Local store key `cc.lab.v1.<lowercased id>`; share dial `cc.share.<id>`.
- `window.Lab = { mount(el, host), leave(), designed(p, mode) }`; `window.Template = { framesFor(p, mode) , … }` used by the Scriptorium.
- Lab API actions `lab.*` go through Code.gs's LAB-HOOK to `Lab.gs` (same as WT2).

## File ownership
| owner | files |
|---|---|
| Opus A (story) | `story-content.js`, `sorting.js`, `tools/words/cards-t1.json`, `docs/READING-ROOM-T1.md` |
| Opus B (Spellbook) | `template.js`, `lab.js`, `lab-content.js`, `lab-scenario.js`, `lab-examples.js`, `lab.css`, `Lab.gs`, `examples-t1/`, `tools/lab-*.js`, `tools/template-test.js`, `docs/LAB-T1.md` |
| Fable (orchestrator) | everything else: `index.html`, `teacher.html`, `student.js`, `teacher.js`, `story.js`, `story.css`, `theme.css`, `api.js`, `engine.js`, `writer.js`, `bootcamp.js`, `content.js`, `charts.js`, `Code.gs`, `media.js`, `partners.js`, `roster.js`, `story/`, `audio/`, `podcasts.html`, `tools/validate.js`, `tools/smoke.py`, `tools/story-validate.js`, `tools/gs-test.js`, README |
Script order in index.html: roster, content, partners, prompts, prompts-2, template, lab-content, lab-examples, lab-scenario,
models, mocks, topics, media, charts, writer, bootcamp, engine, api, lab, story-content, sorting, story-words, story, student.
