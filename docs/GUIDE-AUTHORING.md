# Writing a High / Medium guidance script for one chart

Standard for `guide/<promptId>.js` and `tools/guide-cases/<promptId>.json` (13 Nov 2026). The model to copy is `guide/p-line-museums.js` with `tools/guide-cases/p-line-museums.json`: read both in full before you write anything. Engine: `guide.js`. Contract: `docs/GUIDANCE-LEVELS.md`. Test: `node tools/guide-test.js <promptId> --essay`.

## 1. What the script is for

Students: Thai, 13–17, CEFR B1/B2 (a few A2, a few C1), girls and boys, learning IELTS Academic Writing Task 1 with T.Chris. Target: Band 7–8.

In the Scriptorium a student opens a chart at **High guidance** (every decision is a multiple-choice question with exactly one right answer; a wrong option is greyed out and its hint appears; she chooses again) or **Medium guidance** (the same decisions as free text; a rule check, then an AI check; hints; she may keep her own answer). Each right answer adds a piece of text to one of four panes (introduction, overview, detail A, detail B). When every step is done, the panes hold a complete report.

So a script is **one model report cut into its decisions**. Write the report first, then cut it.

## 2. Files and limits

- You write exactly two files per chart: `guide/<promptId>.js` and `tools/guide-cases/<promptId>.json`. Do not edit any other file (not `guide.js`, not the tests, not the prompts, not `guide-index.js` by hand). Do not run git commands that change anything.
- `node tools/guide-test.js --index` rewrites `guide-index.js` from the folder; run it once after creating your files (other writers run it too; that is fine).
- ES5 only: `var`, `function`, string concatenation. No arrow functions, `let` / `const`, template literals. Strings in single quotes; use double quotes for a string that contains an apostrophe.
- The file wrapper is the model's: `(function (global) { 'use strict'; var G = global.GUIDE_SCRIPTS = global.GUIDE_SCRIPTS || {}; G['<promptId>'] = { promptId: '<promptId>', version: 1, proper: [...], sections: [...] }; })(typeof window !== 'undefined' ? window : this);`
- Put `askFree` and `ai: true` inside each step (the model file sets them from two maps at the end; do not copy that, write them inline).

## 3. Sources of truth

- The chart: `prompts.js`, `prompts-2.js`, `prompts-3.js` (find your id). Use only its data, its `rubric` (the task sentence), `units`, `labels`, `keyFeatures`, `groupings`. Never invent a figure, a place name or a reason.
- The chart's own model answer in `models.js` / `models-2.js` (`promptId` = your id): a checked Band 8 report. Use it for facts, grouping and vocabulary. Your report may follow it closely, but it must cut cleanly into steps, so you will usually simplify and re-order it.
- `Charts.describe(prompt)` (charts.js) prints the data as text if you want to see what the student sees.
- House rules (below) win over habit.

## 4. House rules for the report (T.Chris's Task 1 rules)

- **Four paragraphs, no conclusion, 160–190 words**: P1 introduction ≈30 words, P2 overview ≈45, P3 detail group A ≈50–60, P4 detail group B ≈50–60.
- **P1** paraphrases the task: visual + verb + what + where + when + units (those that exist for this chart). Never 8 words in a row from the task sentence (the test fails at 8; the examiner discounts 10+). "shows" → illustrates / compares / gives information about; "the number of" → how many; "between X and Y" → over the N years from X to Y. A paraphrase must stay true: do not narrow or widen the place, the dates or what is measured.
- **P2** begins "Overall," and gives two or three general truths (what rose / fell / was largest / smallest / stayed the same; for a process: how many stages, where it begins and ends; for maps: the character of the change). **No data value in the overview**, not even approximated. Allowed there: years, category names, numbers that are part of a label ("the 15–24 age group"), counts of categories or stages ("all three", "eight stages"), multiples in words ("almost doubled").
- **P3 / P4**: two groups decided by the story, not by the order of the legend. **Every body sentence carries a figure, a date or a label** from the chart (TREND / COMPARE: a figure in every sentence), and a figure gets a meaning: a rank, a comparison or a change. At least two explicit comparisons in the report (a process: at least three sequencers). Every category / stage / main feature of the chart is named at least once.
- **Modes.** TREND (a time axis or two dates): past simple for past dates; "is projected to / will" only for future dates; trend verbs are active (rose, never "was risen"). COMPARE (categories at one time): comparatives, superlatives, multiples, "respectively"; **no trend verbs at all**, also not across ordered categories such as age groups or year groups (not "fell with age" but "was far higher among teenagers than among the over-50s"); past simple if the chart is dated in the past, present simple if it has no date. SEQUENCE (a process): present simple; passive for a man-made process, active for a natural one; sequencers (First, Next, Once …, after which, before being …, Finally); count the stages; name the start material and the end product. SPACE (maps / plans): compass points (never "left / right / top / bottom"); change verbs in the passive (was demolished, was converted into, has been extended, will be built); tense from the map titles (two past dates → past simple; past and now → past simple + present perfect; a plan → future passive; one map → present simple). Two pies or two tables for two years: TREND + COMPARE, organised by category. Two different visuals (mixed): triage each, one overview headline for each, detail A = the first visual, detail B = the second; never combine figures that measure different things.
- **Sentence patterns** S1 intro · S2 overview ("Overall, [general claim], while / whereas [contrasting claim].") · S3 change verb ("[Subject] rose / fell [adverb] from [X] in [Y1] to [Y] in [Y2].") · S4 change noun ("There was a [adjective] rise in [subject], from [X] to [Y].") · S5 compare ("[A] was far / slightly higher than [B], at [X] and [Y] respectively.") · S6 multiple / share ("[A] was twice as high as [B]." / "[A] accounted for [fraction] of [total].") · S7 sequence ("At the [nth] stage, [material] is [past participle] in / by [equipment] before being [past participle].") · S8 space ("[Feature] was demolished / converted into [X] / extended to the [direction] of [landmark]."). Use at least three, plus one "7→8 add-on" (a relative clause, a participle clause, "with + noun + -ing", or a fronted time phrase); the test checks for the add-on.
- **Prepositions with figures**: rose **to** 70% (end point) · rose **by** 10 percentage points (size) · **from** 60% **to** 70% · peaked / stood **at** · a rise **of** 5 · **in** 2010. A move from 20% to 30% is "10 percentage points", never "10%". number of (countable) / amount of (uncountable) / proportion or percentage of (either). fewer (countable) / less (uncountable).
- **Accuracy**: quote the exact value when the data gives it. An approximation word (around, about, just over, nearly, almost) only when you round, and then within half a gridline step. Differences, sums and multiples must be worked out and true ("almost double" needs a ratio of about 1.8–1.99).
- **Register**: impersonal; no I / we / you; no contractions; no opinion or evaluation ("surprisingly", "good"); no reasons ("because people …"); no exclamation marks. These make excellent wrong options.
- Thousands: "420 thousand", "5 million": the number word never takes -s after a number; "in thousands" does.

## 5. How to cut the report into steps

Five sections, in this order, with these ids and panes:

| section id | pane | what its steps decide |
|---|---|---|
| `triage` | `null` (adds nothing to the report; shown as her plan) | mode, tense (and voice), units, group A, group B, and one more planning fact (the exception, the number of stages, the time frame of the maps …) |
| `intro` | `0` | the pieces of the P1 sentence, left to right |
| `overview` | `1` | "Overall" + the general claim + the linker + the contrasting claim + one or two more general truths |
| `detailA` | `2` | group A, piece by piece |
| `detailB` | `3` | group B, piece by piece |

- 30–52 steps in all (the model has 46). Required step ids: `t-mode`, `t-tense`, `t-groupA`, `t-groupB`. Every id starts with its section's letter and a hyphen: `t-`, `i-`, `o-`, `a-`, `b-`.
- `t-mode`: the four options are TREND, COMPARE, SEQUENCE, SPACE and the right one is the prompt's `mode`.
- **One decision per step**, the kinds T.Chris asked for: a time phrase or other "categorisation" · the subject / claim · the verb (tense, voice) · the figure · the unit · the meaning of the figure (rank / comparison / change) · a preposition · a linker · a reference word (Its, This figure, the former) · punctuation that joins two clauses · a sequencer · a compass phrase. Mix small steps (one preposition) with larger ones (a whole comparison clause). Do not make every step a whole sentence, and do not chop so finely that a step has no real decision.
- Per mode, the detail steps lean on: TREND → S3 / S4, to / by / from … to / at, adverbs of degree, first / last / peak / low points; COMPARE → S5 / S6, far / slightly, twice as … as, accounted for, respectively, the highest / the lowest, whereas / by contrast; SEQUENCE → sequencers, is + past participle vs active, before being / after which, into / through / by; SPACE → compass phrases, was demolished / replaced by / converted into / extended, to the north of / in the south-east, while … remained unchanged.
- **The pieces must join into the report with nothing left over.** The engine builds each pane as: for every step in order, `pre` + her text + `post`.
  - `pre` defaults to one space. Use `''` for the first step of a pane and before punctuation the option itself begins with (`': its figure'`); `', '` when a comma must come first; `'. '` when the step starts a new sentence and the step before it has no `post: '.'`.
  - `post` is `','`, `'.'`, `':'`, `';'` or nothing.
  - The engine capitalises the first letter of a pane and after a full stop, so write a sentence-initial option with its capital and let Medium students type it in lower case.
  - An option never ends with punctuation that `post` supplies, and never begins with the word the step before it ended on (a "to to" join).
- `ok` is both the right option and the text that goes into the pane.

## 6. Options and hints (High guidance)

- Exactly **one** option is defensible. Check each wrong option against the chart and against the sentence built so far: if a careful teacher could accept it, change it. A wrong option is wrong for one clear reason:
  - a fact: the figure of the next point, of another line, of another year; the wrong direction; the wrong rank; a wrong multiple (work it out);
  - grammar: tense, voice ("was risen"), agreement, plural ("thousands visitors"), article, adjective for adverb ("rose steady"), number / amount, fewer / less, comparative for superlative, a wrong preposition, "despite" + clause, a comma splice, its / it's;
  - a house rule: an opinion, a reason, a data value in the overview, the task's own words (say so honestly in the hint: "correct English, but it is the task's own phrase"), a trend verb in COMPARE, "left / right" on a map, a past tense in a process.
- The three wrong options are in the **same form** as the right one (same part of speech, about the same length). The right option is the longest in at most a third of the steps; the test checks it.
- Each wrong option has **its own hint**: one or two short sentences in B1 English that say what kind of thing is wrong and where to look ("Tap the 2016 point and read its year." "Three things are compared. Which form do you need for three or more?"). A hint must be true of its option.
- **A hint never gives the answer**: not the right option's words, not the figure, not its first letter, not a description that leaves no thinking ("two dots, one above the other"). It may quote other figures of the chart. The test rejects a hint or a `shape` that contains the right option.
- `label`: the decision in one to three words (≤ 24 characters): "Verb", "Figure + date", "Meaning", "Linker".
- `ask`: the question, B1 English, one or two sentences. It may point at the chart ("Tap the last point of the Science Museum line.") and name the pattern ("Pattern S3."). It must not contain the answer or the answer to a later step.
- `tag`: the fault a miss is counted under, one of: kn-test-facts, kn-criteria, kn-triage-mode, kn-triage-units, ta-no-overview, ta-overview-figures, ta-overview-vague, ta-no-data, ta-no-comparison, ta-mechanical, ta-opinion, ta-conclusion, ta-missing-category, ta-inaccurate, ta-selection, cc-paragraphing, cc-grouping, cc-linking-overuse, cc-reference, cc-sequencers, lr-copied-rubric, lr-register, lr-trend-vocab, lr-degree, lr-compare-vocab, lr-proportion, lr-approx, lr-number-amount, lr-process-vocab, lr-map-vocab, lr-collocation, lr-spelling, gra-tense, gra-prep-figure, gra-article, gra-plural, gra-punctuation, gra-complex, gra-passive, gra-pattern, gra-agreement.

## 7. The Medium fields

- `askFree`: the same decision as a writing task ("Write the verb in the right form.", "Start with 'while'."). No "choose", no "which option".
- `shape`: what to type, in a few words ("a preposition + figure + unit + in + year", "a linker of contrast"). It must not contain the answer or the very words that are the answer.
- `expect`: the expected value for the AI check: the right option, then in brackets what else is acceptable and anything the AI must know ("(also accepted: fell, declined; must be past simple, active)").
- `accept`: the rule check. An array of groups; **every group** must match one of its alternatives (regular-expression source, case-insensitive). The entry is lower-cased, spaces collapsed and a final `. , ; !` removed before matching, so write patterns in lower case with no final punctuation.
  - Short answers are anchored: `['^at$']`, `['^the line (graph|chart)$']`.
  - Figures get word boundaries (`'\\b570\\b'`), a year gets its preposition and the end of the entry (`'in 2014$'`), a start gets `'^from'`.
  - A verb alternative must not match a wrong form inside it: `'\\brose\\b'`, not `'rose'` (which matches "rosed").
  - The right option must pass, and so must the alternatives you list in `expect`.
- `reject`: known slips, each `{ re, hint }`, checked **before** `accept`. A reject pattern must never match the right option or an accepted alternative. Cover: the wrong tense, a passive trend verb, the plural "thousands" after a number, figures and years of neighbouring points, the wrong preposition before a year ("on 2014"), an entry that already contains the next step's preposition (`'\\b(to|by|at|from)$'` → "Stop after the adverb: the next step adds the preposition."), an entry that begins with the previous step's word, opinions and reasons, a data value in an overview step (`'\\b\\d{2,3}\\b'` with care for years), irregular past forms ("rosed", "felled", "growed"), its / it's.
- `ai: true` on every step where she writes a clause or phrase of her own (claims, meanings, comparisons, exceptions, whole stages). For those steps add **fact rejects** too, so that a false statement is sent back even when the AI is off (the wrong museum overtaking, the wrong year, "slightly" for a large gap).
- `hint`: the first hint (what the piece needs). `hint2`: a stronger one (how to find it). Neither gives the answer.
- `proper`: at script level, the names that keep their capitals (`['Science Museum', 'Art Gallery', 'European']`). List those in your report and those in the alternatives you accept. The engine sends back an entry that has such a name in lower case.

## 8. The cases file

`tools/guide-cases/<promptId>.json`: a JSON array of `["step-id", "what a student might type", "accept" | "revise" | "not-accept"]`. `revise` = a known slip caught by `reject` (or the capitals rule); `not-accept` = anything that must not pass outright (it may be `revise` or left to the AI). At least three rows per step, better four to six: one accepted wording that is not the right option itself (where `expect` lists one), the typical Thai-learner slips for that step, and a wrong fact. Realistic entries only.

## 9. Check, then check again

1. `node tools/guide-test.js --index && node tools/guide-test.js <promptId> --essay` until it prints "all … checks passed". It checks the shape, that no hint leaks, option length and position, the report (160–190 words, clean joins, every Ward green, no 8-word copied run), every number against the chart through `tools/models-check.js`, and your cases.
   - "models-check · number N not in the data" means a figure in the report is not a value of the chart (or needs an approximation word). Fix the report, do not hide the number.
   - "ward … is warn/bad": read the label; the Wards are in `writer.js` (`preflight`).
2. Read the printed report aloud once as an examiner. Is it natural? Does any join jar? Does a pronoun point at the wrong noun? Is any word repeated three times? Fix the steps, not the test.
3. Read every step once more as a student who knows the chart but not the answer: is exactly one option right? Does any hint give it away?

## 10. What to report back

For each chart: the step count, the word count, the printed report, anything in the chart or its model answer that looked wrong, and any rule in this document you could not follow (with the reason).
