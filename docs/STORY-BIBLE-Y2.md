# Quillmoor Academy · The Observatory · Second Year — Story Bible

Writer: Opus 5.5 · 15 Oct 2026 · source of truth: `story-content.js` (version `2026-10-15`, term `The Observatory · Second Year`).
Brief: `docs/SECOND-YEAR-BRIEF.md`. Contract: `QUILLMOOR-T1-SPEC.md`. Art: `docs/ART-BIBLE-Y2.md`. Cards: `tools/words/cards-y2.json`.
Check: `node tools/y2-check.js` (ES5, page fields, C1 markup, word counts, banned names, ids unchanged against the old file).

IP level C. Book 2 of the canon series supplies the **shape of the plot only**. Every name, object, creature and place is an original
Quillmoor equivalent; none of the canon names, spells or creatures appear in the app (the checker greps for them).

## The year in one paragraph
A torn almanac page warns "Do not open the Sealed Archive". The tram breaks down; Mr Fenwick rows the new class across the black lake.
A vain new teacher, Professor Bartholomew Quist, teaches by memorised "Perfect Reports", invented figures, hyperbole and conclusions.
Dr Halima Strand quietly teaches the truth. Only the reader hears a whisper in the Observatory pipes: "fell… fell… west… west" —
numbers read back to front. The **Frost** begins: reports go grey, figures go blank, and first Marmalade the cat, then Felix, then Juno
freeze grey. The castle suspects the reader. A first-year, Ploy, writes every night to the **Blank Almanac**, which answers her, feeds the
Gossip Quill, and shows the reader a memory of 1976: Orrin Vane opening the Archive and blaming young Fenwick. Fenwick is sent away;
Dr Hale is suspended. An old map shows that the Tide Clock case was a staircase in 1976. Juno's last clue ("LABELS FIRST · MIRROR")
names the **Reflector**, a brass copying mirror on a clockwork arm that copies charts back to front and breathes grey frost. Quist's book
proves to be copied from Strand's old ledgers. Ploy vanishes; the reader opens the Tide Clock (the hands were back to front; read the
labels first), goes down, survives Quist's own memorised report rebounding on him, receives Strand's brass ruler from Nutmeg, and turns an
authentic spellbook page to the mirror: it cannot copy what is not copied. Moor ink drains the almanac; the Frost lifts; everyone wakes.
Quist leaves by tram; Fenwick returns; the Almanac Examination goes ahead; the Hall of Lanterns.

## Beat table (Chamber-of-Secrets shape → Quillmoor, with pages)
Page refs are `chapter-page` as in story-content.js (1-based, counting every page in the array; `N` = new only, `R` = returning only).

| Book 2 beat | Quillmoor equivalent | Pages |
|---|---|---|
| Warning before term | Nutmeg brings a torn almanac page: "Do not open the Sealed Archive." New readers also get the acceptance letter | 1-1 N, 1-2 N, 1-3 R |
| Missing the train | Tram breaks down on the moor road; Mr Fenwick rows the heroine, Juno and Felix across the black lake at dusk | 1-4 N, 1-5 R |
| Celebrity fraud teacher | Professor Bartholomew Quist, *Quist's Quick Charts*: memorised Perfect Report, hyperbole, invented figures, conclusions, no overview | 1-8, 2-1, 2-2, 2-7, 3-3, 4-2, 4-5, 5-2, 6-2, 6-4 |
| The voice in the walls | Only the heroine hears "fell… fell… west… west" in the Observatory pipes | 1-end, 2-end, 3-7, 7-1 |
| Suspicion on the hero | Students mutter; "the new second-year was by the clock"; "that second-year was here last night too" | 2-5, 2-end, 3-1, 4-7, 4-end |
| Petrifications | **The Frost**: Marmalade (2-end), Felix and his camera (4-end), Juno holding "LABELS FIRST · MIRROR" (6-end) | 2-end, 4-end, 6-end, 7-1 |
| Message on the wall | Grey ink above the Tide Clock: "THE ARCHIVE IS AWAKE. EVERY OVERVIEW WILL FADE." Later: "THE FIRST-YEAR IS BELOW. HER WORDS BELONG TO THE MIRROR NOW." (reworded in review to keep clear of the canon wall messages) | 2-end, 7-end |
| The diary | **The Blank Almanac**: Ploy writes to it (3-end), throws it away (5-5), the heroine writes to it (5-6, 5-7 R), it shows 1976 (5-end), it is stolen back (6-1, 8-3) | 3-end, 5-5, 5-6, 5-7, 5-end, 6-1, 8-3 |
| Memory of the framing | 1976: Orrin Vane by the open Tide Clock blames young Fenwick, "They're his keys" | 5-end |
| Hagrid framed / headmaster removed | Governors suspend Fenwick (keys) and Dr Hale; Quist boasts he will solve it; Fenwick whispers "Look at the old maps" | 6-4 |
| Finding the way in | Map Room: after 1976 the north staircase was repurposed as the back of the Tide Clock case (SPACE lesson) | 6-5, 6-6, 6-7 R |
| Hermione's clue | Juno's scrap "LABELS FIRST · MIRROR"; old library record names the Reflector | 6-end, 7-1 |
| Fraud exposed | The Lantern: Quist's book copied line by line from Strand's ledgers | 7-5, 7-6, 7-7 R |
| Ginny taken | Ploy missing; grey writing; teachers turn to Quist, who packs; the heroine reads the labels first, turns the back-to-front hands, the case opens | 7-end |
| Lockhart's memory charm backfires | Quist recites his Perfect Report at the frost; it rebounds and wipes the report from his head | 8-1 |
| The Chamber and the monster | **The Reflector**: brass mirror on a clockwork arm, grey frost, shelves of blank reports; Ploy cold on the floor | 8-2 |
| Riddle from the diary | Orrin Vane's shape rises from the almanac's handwriting | 8-3 |
| Fawkes and the sword | Nutmeg brings Strand's brass ruler (the one true scale) from the Sorting Lantern | 8-4 |
| Monster defeated | The heroine turns her own TREND page, own words, real figures, to the mirror: it cannot copy what is not copied | 8-5 |
| Diary destroyed, Ginny saved | Moor ink (the ch6 vial) writes a true report into the almanac; its handwriting drains; Frost lifts | 8-6 |
| Dobby freed / Lockhart gone / Hagrid back | Quist leaves on the morning tram with his portraits; Fenwick exonerated, Marmalade and keys back; Hale returns | 8-7 |
| End-of-year feast | Almanac Examination (the real test is the point); Hall of Lanterns | 8-8 … 8-12, 8-end, finale |

## Chapter synopses

**Ch1 The Letter / A New Term.** *New:* rain in Bangkok, Nutmeg with a letter and a torn warning (1-1); the letter defines a report (1-2);
the broken tram, Juno, Felix (editor of The Lantern), Fenwick's boat (1-4); the Hall of Lanterns and the Sorting Lantern (1-6, event
`sorting`). *Returning:* a year later, older Nutmeg, second-year pin, last year's spellbook, the warning (1-3); the tram, Juno's copper
ribbon, Felix's press badge, "Priya has graduated" (1-5); the Lantern shines in your house colours; Celeste is now a friend (1-7, event
`house`); Penhallow: "the habits that won last year now lose marks" (1-9). *Shared:* Quist's feast speech, Ploy, Strand's "Source?" (1-8);
the Observatory and triage: mode, axis, units, years (1-10). Ending: the whisper in the pipes.

**Ch2 The Four-Part Charm.** Quist's portrait room and his Perfect Report (copied task sentence, no number); Celeste: no conclusion, no
opinion, no reason; Strand's four boxes (30/45/55/55, 160–190); paraphrase and the discounted rubric; The Whisper's fake 300% (it was
50%) and the first mutters; *R*: Celeste on the Quill's resurgence; the first guided report, Quist claims credit. Ending: Marmalade frozen,
the writing on the wall, everyone staring at you.

**Ch3 The Watchtower.** Rumours; the overview from the top of the tower (second, "Overall", TA ≤5 without it); Quist's overview full of
figures, Penhallow's correction, Juno's model overview; Felix "Where's the number?"; Weaver's to/by/from/at and percentage points;
*R*: Celeste's new overview frame and approximately/just over; a Whisper listing every year, the pipe whispers again. Ending: Ploy's
almanac writes back.

**Ch4 The Tide Clock.** TREND: past simple, projection "is expected to"; Quist's "skyrocketed" for 50→52 vs Liang's degree words; Juno
groups five lines into two; select 3–5 figures per group, not a list; the TREND spellbook page with variables (a copied page goes grey);
*R*: last year's spellbook beside this year's; the first report flies; Felix will photograph the whisperer. Ending: Felix frozen.

**Ch5 The Hall of Scales.** COMPARE: no time axis, no trend verbs, disparity and exception in the overview; Mina, "twice as many…
respectively", Quist's "rose" for one year; pie shares, accounted for, negligible slices still named; tables by row and column, the
exception; COMPARE page and the Mending Room; Ploy throws the almanac away; the heroine writes in it; *R*: it is like the Quill. Ending:
1976 — Orrin Vane blames young Fenwick.

**Ch6 The Cellars and the Moor Maps.** The almanac is stolen back; SEQUENCE: count stages, sequencers, present simple, passive for human
steps (Quist's "I lovingly heated it" = wrong tense + a reason); the overview of a process (stage count, linear/cyclical, start, end); the
vial of moor ink; the governors' notice (formal connectors, written) and Fenwick's whisper; SPACE: compass points, the 1976 map;
demolished/extended/converted/remained unchanged, future for plans; the staircase became the clock case; *R*: the Map Room's keys from
last year. Ending: Juno frozen holding the scrap.

**Ch7 The Library and the Newsroom.** "LABELS FIRST · MIRROR" and the Reflector; two visuals in one report, never combine figures; the error
auction (E1–E7 by name), Juno's empty chair; reference (this figure, the former, the latter) over linker soup; the Locked Stacks: Quist
copied Strand; The Lantern article (formal connectors, written); *R*: Celeste and the Lantern office after Priya. Ending: Ploy missing,
Quist packing, the hands turned, the clock opens.

**Ch8 The Almanac Examination.** Quist's report rebounds; the Reflector; Orrin Vane; Nutmeg and the ruler; the authentic page; moor ink
drains the almanac; everyone wakes, Quist leaves, Fenwick returns; Penhallow on one examiner, four equal criteria, 7.5, Task 2 counts
twice; the Ten Wards (*N* and *R* versions); the Exemplar Archive (read for shape and for what is left out); the 4/13/3 protocol. Ending:
Hall of Lanterns. Finale on the castle steps.

**Midwinter Tournament (after ch5).** Felix's frozen camera on his empty desk; three timed tasks unchanged; Celeste reads the wrong axis;
Quist complains he was not asked to judge; tokens.

## Returning-reader signals that a year has passed
Second-year pin and longer braid in pictures; Nutmeg older with paler feathers (1-3); Juno's copper ribbon (1-5); Felix runs The Lantern,
"Priya has graduated" (1-5, 7-7); Celeste's bob grown to the chin, now a friend who saves you a seat (1-7); Penhallow "habits that won
last year now lose marks" (1-9, mapIntroReturning, house `welcomeBack`); the Quill's resurgence (2-6); Celeste's thesis frame crossed out
(3-6); last year's spellbook beside this year's (4-6); the almanac is like last year's Quill (5-7); the Map Room's brass keys (6-7);
Priya's photo in the Lantern office (7-7); last year's Ten Wards vs this year's (8-10). Every *R* page is optional for the plot.

## IELTS truth notes (what each lesson claims, all literally true)
- Task 1 is a factual report: 20 minutes recommended, at least 150 words (house aim 160–190), no opinion, reason or conclusion.
- Four paragraphs (house plan): intro ≈30, overview ≈45, Detail A ≈55, Detail B ≈55. Copied rubric is discounted (official).
- Overview: paragraph 2, "Overall,", no data values; names, years, label numbers and "doubled" are allowed; no overview → TA capped at 5
  (house rule resting on the TA 5 descriptor).
- Every detail sentence carries a figure (teaching target); to/by/from…to/at; a rise from 20% to 30% is 10 percentage points.
- Values between gridlines: "approximately / just over".
- TREND: past simple for past years, "is expected to" for projections; group into two; 3–5 figures per group; a year-by-year list is
  "mechanical". Degree words fit the size of the change (Quist's "skyrocketed" for 50→52 is the error).
- COMPARE: no trend verbs for one year; respectively; twice as…as; accounted for; tables by row and column; the exception.
- SEQUENCE: count stages; sequencers; present simple; passive for human steps, active for natural ones; overview = number of stages,
  linear/cyclical, start, end.
- SPACE: compass points, never left/right; demolished / extended / converted / remained unchanged; future for plans.
- Two visuals: one intro, one overview headline each, one paragraph each; never combine figures that measure different things.
- E1–E7 named in 7-3 as: articles, plurals, agreement, tense, prepositions, punctuation, word form (E7 also covers collocation and spelling).
- Real test: **one examiner**, four criteria (TA, CC, LR, GRA) **equally weighted**; Task 2 counts twice as much. "Four examiners" and
  "the Almanac seal" are story devices and are always framed as "Here at Quillmoor". Band 7.5 = e.g. two 8s and two 7s.
- Ten Wards in the skill's order; protocol 4 min plan / 13 write / 3 check.
- Quist's lines are always presented as wrong and corrected on the page (no conclusion, no figures in the overview, no hyperbole, no
  trend verb for one year, no reasons in a process, no linker soup, no memorised report).

## Cast ageing notes
See `docs/ART-BIBLE-Y2.md` for the fixed blocks. Text cues: Juno's copper ribbon; Felix's press badge and editorship; Celeste's
chin-length bob, own brown spellbook, friend; Nutmeg older, paler feathers; the heroine's second-year pin and brass key on the satchel
strap (the key is the ch1 keepsake). New: Quist (comic, vain, never cruel), Ploy (12, first-year, Compass), Orrin Vane (seen only in
memory and as a misty shape), the Reflector, the Blank Almanac.

## Page-by-page lesson and rare word

| picture key | cohort | rare word | lesson the page carries |
|---|---|---|---|
| y2-ch1-01 | new | `illegible` | Story: the warning arrives (no lesson beyond setting). |
| y2-ch1-02 | new | `succinct` | What Task 1 is: a report on a chart/table/process/map; summarise and compare; no opinions; 20 minutes, 150+ words. |
| y2-ch1-03 | returning | `provenance` | Returning: a year has passed; the warning. |
| y2-ch1-04 | new | `imperceptibly` | Felix's "Where's the number?" set up; story. |
| y2-ch1-05 | returning | `unprecedented` | Returning: Felix editor, Priya graduated, Juno's copper ribbon. |
| y2-ch1-06 | new | `predominant` | The four criteria as houses (TA, CC, LR, GRA); Sorting. |
| y2-ch1-07 | returning | `conspicuous` | Returning: house kept; Celeste now a friend. |
| y2-ch1-08 | both | `hyperbole` | Trap: hyperbole, invented figures and reasons (Quist); Strand: "Source?" |
| y2-ch1-09 | returning | `verifiable` | Returning: Task 2 habits lose marks (no position/opinion/reasons/conclusion; 20 min; 150+; overview instead of thesis); facts must be verifiable. |
| y2-ch1-10 | both | `meticulous` | Triage: mode, axis, units, years before writing. |
| y2-ch1-end | both | `abruptly` | Mystery: the whisper reads numbers back to front. |
| y2-ch2-01 | both | `verbatim` | Trap: a memorised one-size report; copied task sentence; no number. |
| y2-ch2-02 | both | `superfluous` | No conclusion, no opinion, no reason; report stops when the data stops. |
| y2-ch2-03 | both | `proportionate` | Four-Part Charm: intro ≈30, overview ≈45, two detail paragraphs ≈55; 160–190 words. |
| y2-ch2-04 | both | `ostensibly` | Paraphrase the rubric (visual, what, where, time frame, units); copied rubric is discounted. |
| y2-ch2-05 | both | `fabricated` | Invented figures and one block of text; a 20,000→30,000 rise is 50%, not 300%. |
| y2-ch2-06 | returning | `resurgence` | Returning: the Quill is back; this year it feeds on copied reports and invented figures. |
| y2-ch2-07 | both | `generic` | Own frames with gaps beat a generic memorised report; four parts, no conclusion. |
| y2-ch2-end | both | `ominous` | Story: the Frost begins; the writing on the wall; suspicion. |
| y2-ch3-01 | both | `exponentially` | Story: rumour and evidence (Juno: "They have no evidence"). |
| y2-ch3-02 | both | `indispensable` | The overview: second paragraph, "Overall", without it TA cannot go above 5. |
| y2-ch3-03 | both | `distinctly` | No figures in the overview; names, years and "doubled" allowed; model overview. |
| y2-ch3-04 | both | `unsubstantiated` | Every detail sentence carries a figure; claim + number. |
| y2-ch3-05 | both | `trivial` | to / by / from…to / at; percentage points vs percent. |
| y2-ch3-06 | returning | `concise` | Returning: overview frame with no number gap; approximately / just over between gridlines. |
| y2-ch3-07 | both | `systematic` | Year-by-year listing with no overview; invented values vs approximation. |
| y2-ch3-end | both | `enthralled` | Story: the almanac writes back. |
| y2-ch4-01 | both | `trajectory` | TREND mode: time axis; past simple for past years; projection "is expected to". |
| y2-ch4-02 | both | `commensurate` | Degree words fit the size of change (sharply, slightly, steadily); noun/verb pairs; trap: hyperbole. |
| y2-ch4-03 | both | `in tandem` | Group the categories into two; one paragraph each; every category goes somewhere. |
| y2-ch4-04 | both | `exhaustive` | Select 3–5 figures per group (first, last, highest, one comparison); a list is mechanical. |
| y2-ch4-05 | both | `bespoke` | Spellbook TREND page: own frames with variables; a copied page goes blank. |
| y2-ch4-06 | returning | `analogous` | Returning: last year's gaps held ideas; this year's hold figures from the chart. |
| y2-ch4-07 | both | `vindicated` | Cast the page, write, check, send one report. |
| y2-ch4-end | both | `inert` | Story: Felix frozen; suspicion. |
| y2-ch5-01 | both | `disparity` | COMPARE mode: no time axis, no trend verbs; disparity and exception in the overview. |
| y2-ch5-02 | both | `nonplussed` | "Twice as many … as", "respectively"; trap: "rose" for a single year. |
| y2-ch5-03 | both | `negligible` | Pie charts: shares, fractions, "accounted for"; one pie = one year; name even tiny slices. |
| y2-ch5-04 | both | `uniformly` | Tables: read by row and column; biggest and smallest first; the exception. |
| y2-ch5-05 | both | `distraught` | COMPARE spellbook page; the Mending Room fixes a trend verb + reason on a pie. |
| y2-ch5-06 | both | `ingratiating` | Story: the almanac flatters copying. |
| y2-ch5-07 | returning | `reminiscent` | Returning: the almanac is like last year's Quill. |
| y2-ch5-end | both | `unmistakable` | Story: 1976 memory. |
| y2-ch6-01 | both | `successive` | SEQUENCE mode: count the stages; varied sequencers. |
| y2-ch6-02 | both | `extraneous` | Present simple; passive for human steps, active for natural ones; no reasons. |
| y2-ch6-03 | both | `commence` | Process overview: number of stages, linear or cyclical, start, end; no figures. |
| y2-ch6-04 | both | `unfounded` | Story: Fenwick sent away (formal connectors only in the written notice). |
| y2-ch6-05 | both | `adjacent` | SPACE mode: compass points, never left/right. |
| y2-ch6-06 | both | `repurposed` | Change verbs: demolished, extended, converted, remained unchanged; unchanged features in the overview; future for plans. |
| y2-ch6-07 | returning | `juxtapose` | Returning: the Map Room's old keys; juxtapose two maps. |
| y2-ch6-end | both | `desolate` | Story: Juno frozen with the clue. |
| y2-ch7-01 | both | `discrepancy` | Back-to-front reading = the Whisper's systematic discrepancy (rises become falls, east becomes west). |
| y2-ch7-02 | both | `disparate` | Two visuals: one intro, one overview headline each, one paragraph each; never combine figures. |
| y2-ch7-03 | both | `erroneous` | E1–E7 error families by name; agreement, plural, tense in one sentence. |
| y2-ch7-04 | both | `redundant` | Reference (this figure, the former, the latter, over the same period) over mechanical linkers. |
| y2-ch7-05 | both | `plagiarised` | Story: Quist's book was copied (plagiarism costs). |
| y2-ch7-06 | both | `corroborate` | A written article: formal connectors in writing; check every figure against its chart. |
| y2-ch7-07 | returning | `interim` | Returning: Priya gone, Felix's paper, Celeste a friend. |
| y2-ch7-end | both | `precipitously` | Read the labels first (the hands were back to front). |
| y2-ch8-01 | both | `evaporate` | A memorised report rebounds (story mirror of the memorised-chunks ceiling). |
| y2-ch8-02 | both | `pivot` | Story: the Reflector. |
| y2-ch8-03 | both | `insidious` | Copying feeds the Frost (story). |
| y2-ch8-04 | both | `recede` | "We measure": figures from the chart's scale. |
| y2-ch8-05 | both | `inimitable` | Own words + real figures cannot be copied: the spellbook method. |
| y2-ch8-06 | both | `impeccable` | A true report: real figures, overview without numbers, two groups; mistakes are how you learn. |
| y2-ch8-07 | both | `exonerate` | Story: resolution. |
| y2-ch8-08 | both | `transparent` | Real test: one examiner, four equal criteria, Band 7.5 = e.g. two 8s + two 7s; Task 2 counts twice. |
| y2-ch8-09 | new | `invariable` | The Ten Wards in order. |
| y2-ch8-10 | returning | `scrupulously` | Returning: the Ten Wards, new rules, same habit. |
| y2-ch8-11 | both | `selective` | Exemplar reading: for shape and for what is left out; key features; illustrate, don't list. |
| y2-ch8-12 | both | `steadfast` | 20-minute protocol: 4 plan / 13 write / 3 check; about 170 words; no conclusion. |
| y2-ch8-end | both | `palpable` | Story: Hall of Lanterns; same 20 minutes, same four criteria. |
| y2-ev-tournament-01 | both | `benchmark` | Three timed tasks; no house points lost. |
| y2-ev-tournament-02 | both | `cumulative` | Triage under time; read the labels/axis first. |
| y2-ev-tournament-03 | both | `auspicious` | 20 minutes; overview second; stop at 17 and check. |
| y2-finale | both | `irreplaceable` | Recap: 20 minutes, 150+ words, own words. |

## Rare-word list (76 words, one per page, ending, tournament page and finale; no repeats)

| word | pos | gloss | Thai | page | example |
|---|---|---|---|---|---|
| illegible | adjective | impossible to read | อ่านไม่ออก | y2-ch1-01 | Two labels on the old chart were illegible, so the student checked the key instead. |
| succinct | adjective | short and clear, with no extra words | กระชับ | y2-ch1-02 | A succinct overview names the two main trends in two sentences. |
| provenance | noun | where something comes from | ที่มา | y2-ch1-03 | Before you trust a figure, check its provenance: which chart, which year, which unit? |
| imperceptibly | adverb | so slowly or slightly that you can hardly notice it | อย่างแทบสังเกตไม่ได้ | y2-ch1-04 | The price rose imperceptibly, from 4.0 to 4.1 dollars over ten years. |
| unprecedented | adjective | never having happened before | ไม่เคยเกิดขึ้นมาก่อน | y2-ch1-05 | Exports reached an unprecedented level in 2020, higher than in any earlier year. |
| predominant | adjective | strongest, largest or most important | โดดเด่นที่สุด | y2-ch1-06 | Coal was the predominant source of electricity until 2015. |
| conspicuous | adjective | very easy to notice | เห็นได้ชัด | y2-ch1-07 | The most conspicuous feature of the graph is the sudden drop in 2009. |
| hyperbole | noun | saying that something is much bigger or better than it is | การพูดเกินจริง | y2-ch1-08 | "Sales exploded" is hyperbole; "sales rose sharply" is a report. |
| verifiable | adjective | able to be checked and shown to be true | ตรวจสอบได้ | y2-ch1-09 | Every figure in a report must be verifiable on the chart. |
| meticulous | adjective | very careful about every small detail | พิถีพิถัน | y2-ch1-10 | A meticulous writer checks every figure against the chart before sending the report. |
| abruptly | adverb | suddenly and unexpectedly | อย่างกะทันหัน | y2-ch1-end | Sales rose for five years and then fell abruptly in 2008. |
| verbatim | adverb | in exactly the same words | คำต่อคำ | y2-ch2-01 | Never copy the task sentence verbatim; paraphrase it in your own words. |
| superfluous | adjective | not needed; more than is wanted | เกินความจำเป็น | y2-ch2-02 | A conclusion is superfluous in Task 1: the overview has already given the main points. |
| proportionate | adjective | the right size compared with something else | ได้สัดส่วน | y2-ch2-03 | Keep your paragraphs proportionate: a short introduction and two longer detail paragraphs. |
| ostensibly | adverb | as it seems, but perhaps not really | ดูเหมือนว่า | y2-ch2-04 | The report is ostensibly 170 words, but 25 of them are copied from the task. |
| fabricated | adjective | invented and presented as true | ปั้นขึ้นมา | y2-ch2-05 | An examiner can spot a fabricated figure that is not on the chart. |
| resurgence | noun | a return after a period of being weak or gone | การกลับมาอีกครั้ง | y2-ch2-06 | After a fall in the 1990s, cinema visits saw a resurgence from 2005. |
| generic | adjective | general, not made for one particular case | ทั่วไปเกินไป ไม่เฉพาะเจาะจง | y2-ch2-07 | A generic overview such as "There are many changes" earns little credit. |
| ominous | adjective | suggesting that something bad will happen | เป็นลางร้าย | y2-ch2-end | The ominous grey cloud on the chart marked the start of the frost. |
| exponentially | adverb | faster and faster as it grows | แบบทวีคูณ | y2-ch3-01 | Online sales grew exponentially, doubling every two years. |
| indispensable | adjective | absolutely necessary | ขาดไม่ได้ | y2-ch3-02 | An overview is indispensable: without it, Task Achievement stays at Band 5 or below. |
| distinctly | adverb | clearly; in a way that is easy to notice | อย่างชัดเจน | y2-ch3-03 | Rail travel was distinctly more popular than air travel in both years. |
| unsubstantiated | adjective | not supported by facts or figures | ไม่มีหลักฐานรองรับ | y2-ch3-04 | An unsubstantiated detail sentence such as "Sales grew a lot" needs a figure. |
| trivial | adjective | small and not important | เล็กน้อยไม่สำคัญ | y2-ch3-05 | The gap between 10% and 10 percentage points is not trivial: it changes the meaning. |
| concise | adjective | giving information clearly in few words | กระชับรัดกุม | y2-ch3-06 | A concise introduction needs only about 30 words. |
| systematic | adjective | following a fixed pattern; not random | เป็นระบบ | y2-ch3-07 | A systematic check of each figure catches errors before you send the report. |
| enthralled | adjective | so interested that you cannot look away | หลงใหล | y2-ch3-end | The class was enthralled by the living chart as its lines moved. |
| trajectory | noun | the path something follows as it moves or changes | เส้นทางการเคลื่อนที่ | y2-ch4-01 | The trajectory of car sales was upward until 2015, then flat. |
| commensurate | adjective | matching in size or degree | เหมาะสมกับขนาด | y2-ch4-02 | Choose an adverb commensurate with the change: slightly for 2%, sharply for 40%. |
| in tandem | phrase | together, at the same time | ไปพร้อมกัน | y2-ch4-03 | Prices and wages rose in tandem between 2000 and 2010. |
| exhaustive | adjective | including every single part or detail | ครบถ้วนทุกรายละเอียด | y2-ch4-04 | An exhaustive list of every year is not a report; select the key figures. |
| bespoke | adjective | made specially for one person or purpose | ทำขึ้นเฉพาะบุคคล | y2-ch4-05 | A bespoke spellbook page uses your own frames, not a memorised model. |
| analogous | adjective | similar in some way | คล้ายคลึงกัน | y2-ch4-06 | A TREND page is analogous to a COMPARE page: both have an overview frame with no figures. |
| vindicated | adjective | proved to be right or innocent | ได้รับการพิสูจน์ว่าบริสุทธิ์ | y2-ch4-07 | Her careful estimate was vindicated when the final figures came out. |
| inert | adjective | not moving; without action | นิ่งไม่เคลื่อนไหว | y2-ch4-end | The market stayed inert for a decade, with sales flat at about 2 million. |
| disparity | noun | a large difference between two things | ความเหลื่อมล้ำ | y2-ch5-01 | There was a wide disparity between urban and rural internet use. |
| nonplussed | adjective | so surprised that you do not know what to say or do | งงงวย | y2-ch5-02 | Students are often nonplussed by a chart with no time axis until they name its mode. |
| negligible | adjective | so small that it hardly matters | น้อยมากจนไม่สำคัญ | y2-ch5-03 | Spending on transport was negligible, at just 2% of the total. |
| uniformly | adverb | in the same way in every case | อย่างสม่ำเสมอเหมือนกัน | y2-ch5-04 | Prices rose uniformly across all five cities, by about 10%. |
| distraught | adjective | very upset and worried | ทุกข์ใจอย่างมาก | y2-ch5-05 | The distraught student had forgotten to write an overview. |
| ingratiating | adjective | trying too hard to please someone | ประจบประแจง | y2-ch5-06 | An ingratiating opening such as "Dear examiner" does not belong in a report. |
| reminiscent | adjective | making you think of something similar | ชวนให้นึกถึง | y2-ch5-07 | The 2020 figures are reminiscent of the peak in 2008. |
| unmistakable | adjective | impossible to confuse with anything else | ไม่มีทางผิดตัว | y2-ch5-end | The upward trend in solar power is unmistakable. |
| successive | adjective | following one after another | ต่อเนื่องกัน | y2-ch6-01 | Exports fell for three successive years before recovering in 2015. |
| extraneous | adjective | not relevant to the subject | ไม่เกี่ยวข้อง | y2-ch6-02 | Reasons are extraneous in a process report: describe only the stages. |
| commence | verb | begin; start (formal) | เริ่มต้น | y2-ch6-03 | The process commences with the collection of raw clay. |
| unfounded | adjective | not based on facts | ไม่มีมูลความจริง | y2-ch6-04 | A claim that "people love parks" is unfounded if the chart shows only visitor numbers. |
| adjacent | adjective | next to; beside | อยู่ติดกัน | y2-ch6-05 | A car park was built on the land adjacent to the station. |
| repurposed | verb (past participle) | given a new use | นำไปใช้ในจุดประสงค์ใหม่ | y2-ch6-06 | The old factory was repurposed as a museum in 2005. |
| juxtapose | verb | place side by side to compare | นำมาวางเทียบกัน | y2-ch6-07 | Juxtapose the two maps and list what was added, removed and kept. |
| desolate | adjective | empty, sad and lonely | อ้างว้าง | y2-ch6-end | By 2020 the old harbour area on the map was desolate, with every warehouse demolished. |
| discrepancy | noun | a difference between things that should be the same | ความไม่ตรงกัน | y2-ch7-01 | Check for any discrepancy between your figures and the chart. |
| disparate | adjective | completely different; not able to be compared directly | แตกต่างกันโดยสิ้นเชิง | y2-ch7-02 | The two charts use disparate units, tonnes and dollars, so never add them together. |
| erroneous | adjective | wrong; containing a mistake | ผิดพลาด | y2-ch7-03 | An erroneous preposition, "rose to 10" for "rose by 10", changes the figure. |
| redundant | adjective | not needed because it adds nothing | ซ้ำซ้อนไม่จำเป็น | y2-ch7-04 | "Firstly" before every paragraph is redundant; link with "this figure" instead. |
| plagiarised | adjective | copied from someone else's work and called your own | ลอกเลียนผลงาน | y2-ch7-05 | A plagiarised model answer does not show your own English and earns no credit. |
| corroborate | verb | support or confirm with evidence | ยืนยันด้วยหลักฐาน | y2-ch7-06 | The figures in the table corroborate the trend shown in the line graph. |
| interim | adjective | for a short time, until something else happens | ชั่วคราว | y2-ch7-07 | The interim figures for 2025 are expected to change when the full data arrive. |
| precipitously | adverb | very steeply and suddenly | อย่างดิ่งชัน | y2-ch7-end | Sales fell precipitously in 2009, from 80,000 to 20,000. |
| evaporate | verb | disappear slowly into nothing | ระเหยหายไป | y2-ch8-01 | Support for the plan evaporated after 2015, falling to almost zero. |
| pivot | verb | turn on a fixed point | หมุนรอบแกน | y2-ch8-02 | The process pivots on stage four, where the waste is sorted. |
| insidious | adjective | harmful in a slow, hidden way | ร้ายกาจอย่างแนบเนียน | y2-ch8-03 | Copying is an insidious habit: each copied line makes the next one easier. |
| recede | verb | move back; become smaller or weaker | ถอยกลับ | y2-ch8-04 | Floodwater receded steadily after the peak in March. |
| inimitable | adjective | impossible to copy | ไม่มีใครลอกเลียนได้ | y2-ch8-05 | A report built from your own frames and the real figures is inimitable: no model answer can copy it. |
| impeccable | adjective | perfect, with no mistakes at all | ไร้ที่ติ | y2-ch8-06 | Impeccable grammar is rare even at Band 8; aim for most sentences to be error-free. |
| exonerate | verb | officially show that someone is not guilty | พ้นผิด | y2-ch8-07 | The new data exonerated the factory: pollution came from another source. |
| transparent | adjective | clear and easy to understand; nothing hidden | โปร่งใส | y2-ch8-08 | The marking criteria are transparent: anyone can read the public band descriptors. |
| invariable | adjective | never changing | ไม่เปลี่ยนแปลง (ตายตัว) | y2-ch8-09 | Follow an invariable checking order so that nothing is missed. |
| scrupulously | adverb | very carefully and honestly | อย่างละเอียดรอบคอบ | y2-ch8-10 | Check every figure scrupulously against the chart before you send the report. |
| selective | adjective | choosing carefully what to include | คัดสรรอย่างรอบคอบ | y2-ch8-11 | Be selective: three to five figures per group are enough. |
| steadfast | adjective | firm and not changing | มั่นคง | y2-ch8-12 | Demand remained steadfast at about 40% throughout the period. |
| palpable | adjective | so strong that you can almost touch it | จับต้องได้ | y2-ch8-end | The difference between the two groups was palpable: 80% against 15%. |
| benchmark | noun | a standard used to measure progress | เกณฑ์มาตรฐานสำหรับเปรียบเทียบ | y2-ev-tournament-01 | Use your first mock as a benchmark and compare each later report with it. |
| cumulative | adjective | growing bit by bit as more is added | สะสมเพิ่มขึ้น | y2-ev-tournament-02 | The graph shows cumulative sales, so the line can never fall. |
| auspicious | adjective | showing signs of future success | เป็นมงคล | y2-ev-tournament-03 | An auspicious start: sales doubled in the first month. |
| irreplaceable | adjective | too special or important to be replaced | ไม่มีสิ่งใดแทนที่ได้ | y2-finale | Your own frames are irreplaceable: no memorised report can fit every chart. |
