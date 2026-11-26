# The Orrery — IELTS Task 1 as a program (27 Nov 2026)

T.Chris's brief (26 Nov 2026): *"Imagine that you are writing a computer program to populate the 13 variables of the IELTS Writing Task 1 template to achieve certain IELTS band targets (6–8). What input parameters would you look for from the prompt/chart? Where would you look? How would you process the info and what logic would you apply? What text would you output to create a coherent response? Work through several examples at different band targets. Develop a way to teach the methodology through exercises in the app, with guidance levels like the Scriptorium. Develop an animated slide deck that explains the methodology with a decision tree / signal / indicator approach."*

The program is real code: `orrery-engine.js` (logic), `orrery-content.js` (the few inputs that are language, not arithmetic), `orrery.js` + `orrery.css` (the student room), tests `tools/orrery-test.js` and `tools/orrery-smoke.py`. It runs on the 19 TREND charts of the bank (line graphs, bar charts over years, tables with year columns, pie charts for two or three years). The 13 variables are the TREND page of the Spellbook (`lab-content.js`): visual · what · y1 · y2 · groupA · groupB · moveA · moveB · feature · figA1 · figA2 · figB1 · figB2.

## 1. The shape of the program

```
INPUT     task sentence · title · bottom axis · side axis · legend · data points
   ↓  LOOK
SIGNALS   numbers the program measures (no words yet)
   ↓  THINK
RULES     four decision trees: groups · trend words · key feature · figures
   ↓  WRITE
13 VARIABLES, worded for the band target (6, 7 or 8)
   ↓
OUTPUT    P1 introduction · P2 overview · P3 group A · P4 group B (160–190 words)
```

Every variable is one *decision*, and every decision runs Ask → Look → Think → Write (T.Chris's framing of a Task 1 response as "a computer program in everyday language").

## 2. Inputs: what to look for, and where

| Variable | Ask | Look | Signal the program reads |
|---|---|---|---|
| Visual | What kind of visual? | the shape (lines, bars, rows and columns, circles) + the first words of the task | type, number of pies |
| What It Shows | What, where, what unit? | the task sentence and the title | the noun phrase, the unit in brackets |
| First Year / Last Year | What is the time frame? | the bottom axis (first and last label; a table's year columns; the pie titles) | the years; where a dotted projection starts |
| Group A / Group B | Which lines tell the same story? | the legend and where each line starts and ends | each line's class and size (below) |
| Trend A / Trend B | What did each group do overall? | first point, last point, the shape in between | class + size + pace |
| Key Feature | What is the one other big truth? | crossings, the line on top, a collapse or peak, the dotted part | crossovers you can see, leader, collapse, projection |
| Four figures | What were the figures at the start and the end? | the side axis and any printed values | printed or read off the axis |

## 3. Signals (what the program measures)

- **Size** of a change, from what the eye can see:
  - line and bar charts: the change as a share of the largest value on the chart — tiny <5% · small <15% · medium <40% · big;
  - tables: the change as a share of the first figure (the same cut-offs);
  - pies: the change in percentage points — <3 · <8 · <15 · 15 or more.
- **Pace** ("steadily", "gradually"): only with three or more points, every step the same way, and no step more than twice the middle-sized step. Two points (most pie pairs) give size words only.
- **Class** of a line: up · down · flat (barely moves: less than a tenth of the highest value on the chart, and less than a fifth of its own start) · low (hugs the bottom of the chart) · peak · dip (trough) · fluctuating (it turns three times, or its biggest backward step is as big as its whole change).
- **Crossovers you can see**: two lines swap order and stay swapped; neither line hugs the bottom; the crossing is above a tenth of the scale. The subject is the line that moved more ("Beijing fell below Bangkok", not "Bangkok overtook Beijing").
- **Leader** (top at every point; "far ahead" when its lowest point is 1.5× everyone else's highest), **collapse** (a drop to half or less between two points), **projection** (years after the dotted line).
- **Printed vs read**: tables, pies and bar charts with up to three series print their values (copy them exactly); a line graph prints only each line's last value. Everything else is read off the side axis to the reading step (a fifth of a gridline, rounded to a nice number: 50 on a 200 axis), with an approximation word; below the first mark it is "less than …".

## 4. The four decision trees (rules)

**A. Groups** — ask in order, the first YES wins:
1. One line only? → two time phases: split just before the biggest jump or drop, or (if it never turns back) where the pace changes.
2. One group always far above the other (1.5× at every point), each group telling one story? → the high lines / the low lines.
3. Any line flat, or back where it began? → the lines that move / the rest.
4. Lines going opposite ways? → up / down (group A = the side with the biggest change).
5. All the same way → the high lines / the low lines.

Then the check: *can each group take one true verb?* If group A's lines go opposite ways, [Trend A] becomes a clause: "the share of coal fell steeply, while the figures for wind and solar power and natural gas both climbed". On the 19 charts the tree agrees with the hand-made groupings on 16; the other three (clubs, languages, university) are defensible alternatives (see §7).

**B. Trend words** — verb + one size word; Band 7 and 8 add pace only when the pace signal is on. SIZE (how much) and SPEED (one jump or many steady steps) are separate: a big change made in steady steps takes a size word with no speed in it (significantly · substantially · climbed steadily); sharply · dramatically · surged · plunged are kept for a big change that comes in one or two jumps (Fable review, 27 Nov 2026). Pace ignores a wobble under 2% of the top value.

| | small | medium | big | steady pace | shape |
|---|---|---|---|---|---|
| Band 6 | rose / fell slightly | rose / fell considerably | steady: rose / fell significantly · jumpy: rose / fell sharply | — | rose and then fell · fell and then recovered · went up and down |
| Band 7 | increased slightly | increased considerably | steady: increased / decreased substantially · jumpy: increased dramatically | rose gradually / steadily | rose to a peak in 2014 before falling · fluctuated but ended slightly higher |
| Band 8 | edged up / slipped | climbed steadily | steady: climbed / fell steadily · jumpy: surged / plunged | — | peaked in 2014 and then fell away · + a multiple: "almost doubling", "ending at less than a third of its starting level" |

A group whose lines move by different sizes takes a plain verb plus who moved most (Band 7 "both decreased, the History Museum more sharply"; Band 8 "more markedly", or "far more markedly" / "by far the most" only when one change is at least twice the others). Lines that hug the bottom: "remained very low throughout"; a line growing from almost nothing: "grew from a very low level".

**C. Key feature** — no figures in it.
- Band 6: the simplest true fact (the top line throughout, or the highest at the end).
- Band 7: in this order — a change of leader · the leader far ahead · a peak or collapse · another crossover you can see · the top line · the biggest change; a projection is added as a second clause.
- Band 8: the Band 7 choice plus what follows from it ("overtook the Art Gallery around 2014 and ended the period with the highest figure").

**D. Figures** — printed → exact; read → the nearest reading step (a fifth of a gridline rounded to a nice number; 50 on the museums axis): Band 6 "about", Band 7 "around", Band 8 "just over / just under" (or "around" on the mark); below the first mark "less than …". Two or more lines: the figures in the order of the names, then "respectively".

**[What It Shows]** (Rule P, hand-written per chart in `orrery-content.js`): Band 6 changes one part of the noun phrase and says the unit; Band 7 changes the noun phrase and the verb inside it; Band 8 builds a new structure. Never eight task words in a row.

## 5. Output: how the report is compiled

- P1: visual + verb (never the task's own verb) + [What It Shows] + a time phrase that differs from the task's ("between … and" ↔ "from … to"; pies: "in 2000 and 2020") + projections.
- P2: "Overall," + the measure of group A ("visitor numbers at the Science Museum", not "the Science Museum") + [Trend A] + contrast word + group B + [Trend B]; then the key feature (Band 6 "Also,", Band 7 "It is also clear that", Band 8 "Notably,").
- P3/P4: the start figures, each line's move to its end figure (crossovers at the last point said as ", overtaking …"), the middle event as an extra; P4 ends with one comparison (Band 6 "much higher than", Band 7 "far higher than … respectively", Band 8 a multiple: "almost three times that for").
- Length control: ranked extra sentences until 165 words, never past 190; over 190, optional parts are trimmed. Band 8 always carries a 7→8 add-on (a participle or relative clause).

## 6. Worked examples (Museum visitors, p-line-museums)

| Variable | Band 6 | Band 7 | Band 8 |
|---|---|---|---|
| What It Shows | the number of people, in thousands, who visited three museums in a European city | how many people, in thousands, went to three museums in a European city | visitor numbers, in thousands, at three museums in one European city |
| Group A / B | the Science Museum / the History Museum and the Art Gallery | (same) | (same) |
| Trend A | rose significantly | increased substantially | climbed steadily, almost doubling |
| Trend B | fell | both decreased, the History Museum more sharply | both declined, the History Museum more markedly |
| Key Feature | the Science Museum had the highest figure in 2020 | the Science Museum overtook the Art Gallery around 2014 | … around 2014 and ended the period with the highest figure |
| Start Figure A | about 400,000 visitors | around 400,000 visitors | just over 400,000 visitors |

Band 8 report the program compiles (190 words): *The line graph charts visitor numbers, in thousands, at three museums in one European city over the period from 2010 to 2020. / Overall, visitor numbers at the Science Museum climbed steadily, almost doubling, whereas visitor numbers at the History Museum and the Art Gallery both declined, the History Museum more markedly. Notably, the Science Museum overtook the Art Gallery around 2014 and ended the period with the highest figure. / Visitor numbers at the Science Museum opened the period at just over 400,000 visitors in 2010. Overtaking those for the Art Gallery around 2014, they reached just over 550,000 visitors. By 2020, they had reached 760,000 visitors, almost twice their starting level. / Meanwhile, in 2010, visitor numbers at the History Museum and the Art Gallery stood at just under 400,000 and just over 600,000 visitors respectively. Visitor numbers at the History Museum fell steadily to 260,000 visitors in 2020, about two thirds of their starting level. The figure for the Art Gallery dropped slightly to 520,000 visitors in 2020. By 2020, the figure for the Science Museum was almost three times that for the History Museum (760,000 visitors against 260,000 visitors).*

All 57 reports (19 charts × 3 bands) with their 13 values: `node tools/orrery-test.js --print`.

## 7. Review and refinement (co-ordinated with Fable 5.2)

Fable 5.2 audited the first version (19 charts × 3 bands, verified by running) and found 27 issues; all are fixed in this version:
- truth: crossover year and figure from different points; multiples from a loose ladder ("five times" for 7.75); "This was higher than …" after a multi-figure sentence; "steadily" for jumpy lines; "rose sharply" forced on mixed groups; "the lowest throughout" ignoring an "Other" slice; "the gap widened" for lines that crossed; unreadable read-offs ("about 0.1%");
- rules: vague overviews for mixed groups (now a clause), no materiality test for crossovers (now: you must be able to see it), flat and peak tests that failed on tables and pies (now relative), phase B worded without the drop between the phases (now worded from the turning point), Medium checks that rejected the teacher key's own answers;
- English: entity-as-subject ("Beijing decreased" → "PM2.5 levels in Beijing"), "the Lakeside School", capitals mid-sentence, double "ending", duplicated end sentences, ambiguous lists ("coal, wind and solar power, and natural gas").

Fable's band estimates of the first version: Band 6 targets ≈ 6.0, Band 7 ≈ 6.5–7.0, Band 8 ≈ 7.0–7.5. The fixes target exactly the faults that pulled Band 7 and 8 down; a second review of this version is in the QA report.

## 8. The app room (The Orrery)

Pick a chart (19), a band target (6/7/8) and a guidance level:
- **High** — every step multiple choice (13 WRITE steps + 4–6 THINK steps: the grouping question, each group's story, the key-feature rule); the rule and the signal are on the card; a wrong option greys out with a hint that names the kind of error; the LOOK part of the chart lights up.
- **Medium** — THINK steps multiple choice; WRITE steps typed, checked by rule (`Orrery.checkValue`: the Spellbook data checker for figures, years, names and the unit; the trend check; truth checks on the key feature); hint, then the rule, then the signal, then "Show the program's answer"; "Keep mine" after a near miss.
- **Low** — all 13 slots on one page with LOOK and the signal for each; "Run the program"; fix and run again.
- **Exam** — 13 empty slots, no signals, a soft six-minute clock, one run.

At the end: her 13 values beside the program's, the report the program compiles at Band 6, 7 and 8 (tabs), a table of what the band changes on that chart, and "Write it yourself in the Scriptorium". Merits once per chart × band × level at ≥ 60%: High 25 (half), Medium 50, Low 60, Exam 80; saved in `p.orrery`. The room opens with the Scriptorium (chapter 2).

## 9. Limits

- TREND charts only (the 13-variable page). COMPARE (12), SEQUENCE (13) and SPACE (13) pages need their own signals: largest/smallest and the main difference; stage count and start/end material; added/removed/unchanged by compass point.
- Two-visual charts are left to the Scriptorium.
- The compiled report is a model of the program's thinking, not a Band 9 model: it is built from frames, so some sentences are plainer than the Exemplar Archive's.
- Medium/Low/Exam checks are rule-based (no AI); a well-phrased answer the rules do not know can be marked "near" — "Keep mine" lets her go on.


## 10. Second Fable review (27 Nov 2026)
Fixed: size vs speed adverbs (above); "they was" / "than it began"; "stood at both less than …" → "… each"; "most sharply" with two lines → "more sharply"; "by far" only at 2× or more; fractions ("about two fifths", nearest fraction above with "less than"); "a further" double count and dangling "they" in one-series reports; "Over the next four years" after a mid-year sentence → "Between 2015 and 2019"; "X was the highest" → "X had the highest figure"; repeated flat-line sentences at Band 8; "overtook those for …" after a measure subject; "both of them" for two. Room: Low no longer shows figure values in the Signal line; toasts cleared on a new run; on phones only the current slot shows above the chart; the landing card no longer says "% change". Open: unit noun repeated after a measure subject ("visitor numbers … 400,000 visitors"); seven reports sit just outside 160–190 (153–197).
