# Chart Control — content authoring schema

Chart Control is a self-study web app for IELTS Academic Writing **Task 1** (describing line graphs, bar charts, pie charts, tables, process diagrams and maps). Students are Thai teenagers aged 12–17 at CEFR A2–B2 aiming for Band 7.5–8. Read `content.js` for the tag dictionary (`REMEDIATION`) and `prompts.js` for the prompt bank before writing anything.

## File you write

`topic-XX.js` (XX = two-digit module number). Plain ES5, no template literals, no arrow functions, no trailing commas. The file pushes exactly one module object onto `window.CONTENT.TOPICS`:

```js
/* CHART CONTROL — topic-03.js · Module 03 The Overview */
(function () {
  var T = window.CONTENT.TOPICS;
  T.push({
    id: 'm03', n: 3, code: 'Module 03', name: 'The Overview', art: 'signal', cefr: 'A2–B2',
    blurb: 'The most valuable forty words in the test.',
    levels: [{
      id: 'm03l1', n: 1, name: 'The Overview', cefr: 'A2–B2', blurb: 'Same as module blurb or shorter.',
      subs: [
        { id: 'm03s1', name: 'What an overview is', cefr: 'A2',
          theory: {
            key: 'One sentence that is the whole idea.',
            body: ['<p-worth of HTML, may use <em>, <strong>, <u>>', '…2–4 paragraphs…'],
            simple: ['Same idea in plainer A2 English, 2–3 short paragraphs'],
            examples: [{ s: 'An example sentence (may use <s>struck</s> for wrong bits)', g: 'gloss: what it shows' }]
          },
          items: [ /* 7 items */ ] },
        { id: 'm03s2', /* … */ },
        { id: 'm03s3', /* … */ }
      ],
      check: { id: 'm03ck', name: 'Systems Check', items: [ /* 8 items */ ] }
    }]
  });
})();
```

`art` is one of: chip, layers, stack, clock, signal, grid, lexicon, scope, sim (pick any; it is decorative).

## Item shapes (engine.js renders and marks these)

Every item has: `id` (module + sub + q, e.g. `m03s1q4`, checks `m03ckq4`), `type`, `tag` (a key of `REMEDIATION` in content.js — no other values), `level` ('A2' | 'B1' | 'B2' | 'C1'), `why` (the one- or two-sentence diagnosis shown after answering, in B1 English, HTML allowed). Optional `chart`: a prompt id string from prompts.js (e.g. `'p-line-museums'`) — the chart is drawn above the question. Use a chart wherever the question is about a specific visual.

| type | fields | notes |
|---|---|---|
| `choose` | `stem`, `options[]` (3–4), `answer` (index) | Standard MCQ. Options may contain HTML. |
| `judge` | `given`, `stem`, `answer` (0 True, 1 False, 2 Can't tell) | Given is a sentence/claim; stem asks whether it is true of the chart etc. |
| `spot` | `stem`, `words[]`, `answer` (index of the wrong chunk), `fix` (the correction) | Tap the wrong word. Split the sentence into 5–9 chunks. |
| `sort` | `stem`, `bins[{key,label,hint}]` (2–3 bins), `items[{text,bin}]` (4–8 cards) | Drop cards into boxes. |
| `build` | `stem`, `tiles[]` (5–9 tiles), `solution` (tiles joined by single spaces, exact), `alt[]` (other acceptable orders) | Assemble a sentence. Tiles are words or short chunks. |
| `order` | `stem`, `items[]` IN CORRECT ORDER (3–5) | Shuffled on screen. |
| `select` | `stem`, `options[]` (6–8), `answers[]` (indices), `k` (how many to tick, = answers.length) | Tick exactly k. Use for "choose the key features". |
| `overview` | `stem`, `chart`, `must[]` (2–4 groups of synonyms; each group is an array of lowercase strings, at least one from each group must appear), `minWords` (20), `maxWords` (70) | Free-text overview, rule-checked: starts with "Overall"/"In general"/"It is clear", no digits except years, word range, `must` coverage. |
| `claimnum` | `stem`, `chart`, `labels[]` (lowercase category words, one must appear), `verbs[]` (lowercase trend/compare words, one must appear) | Free-text single sentence: must contain a digit or %, one label, one verb. |
| `para` | `stem`, `chart`, `mode` ('TREND'/'COMPARE'/'SEQUENCE'/'SPACE'), `minWords` (40), `maxWords` (90) | Free-text paragraph: checked for data ratio, comparison markers, banned register, length. |

Free-text items (`overview`, `claimnum`, `para`) are marked by rules, not by a key, so put at most 1–2 per sub-level and 1 per check; the rest are objective.

## Item-writing rules (non-negotiable)

1. Exactly one defensible answer. Distractors are grammatically correct but wrong for the context, same part of speech, plausible — never absurd or childish. For MCQs on vocabulary, one distractor is drawn from the taught list (a near-miss).
2. Stems ≤ 25 words. Options ≤ 15 words. B1/B2 English in stems; the target language may be higher.
3. Do not make the correct option the longest more than ~25% of the time. Spread the correct index across positions 0–3 evenly across the file.
4. Original data only. Never reproduce a real IELTS past paper, Cambridge book task or a published model answer. Sentences about charts must be true of the referenced prompt data in prompts.js (check the numbers).
5. `why` explains the principle, not just "the answer is B". It may quote the relevant band-descriptor idea in plain words.
6. Tags: use the most specific tag; each sub-level should use 2–4 different tags across its items, all listed under the module's focus below. Check items mix the module's tags.
7. Levels: in each sub-level, mix levels — sub 1 mostly A2/B1, sub 2 B1/B2, sub 3 B2 (some C1 allowed in modules 12–13). Checks mirror the module.
8. Register: neutral, encouraging, never condescending. Students are intellectually serious learners.
9. Counts: 3 sub-levels × 7 items + check of 8 items = 29 items per module.

## Module outlines (write the module(s) assigned to you)

**m00 The Test** (tags: kn-test-facts, kn-criteria, ta-opinion, ta-conclusion) · s1 "The facts" (time, words, weighting, rubric verbs) · s2 "The four criteria" (what TA/CC/LR/GRA reward; gates 5→6→7) · s3 "What the examiner punishes" (no overview, no data, opinion, conclusion, copying) · check.

**m01 Triage** (tags: kn-triage-mode, kn-triage-units, gra-tense) · s1 "Four operating modes" (TREND/COMPARE/SEQUENCE/SPACE from a description or a chart; use `chart:` refs to prompts) · s2 "Units, axes and labels" (what is measured, thousands vs millions, %, per person) · s3 "Time frame and tense" (past dates → past simple; projections; no dates → present) · check.

**m02 Flight Plan** (tags: cc-paragraphing, lr-copied-rubric, gra-article, lr-number-amount) · s1 "Four paragraphs" (order, purpose, word budget 30/45/60/60, no conclusion) · s2 "P1: the introduction" (pattern: The [visual] shows [what] in [where] between [Y1] and [Y2]; units) · s3 "Paraphrase, don't copy" (shows/illustrates/compares; the number of/how many; between/over the period; `build` items) · check.

**m03 The Overview** (tags: ta-no-overview, ta-overview-figures, ta-overview-vague, ta-no-comparison) · s1 "What an overview is" (Overall + 2–3 general truths; where it goes; why it gates TA) · s2 "Good, vague, figures, opinion" (sort candidate overviews; judge items) · s3 "Write the overview" (headline method; P2 pattern Overall … whereas …; `overview` free-text items on p-line-museums, p-pie-energy, p-bar-screentime) · check.

**m04 Claim + Number** (tags: ta-no-data, gra-prep-figure, lr-approx, lr-number-amount, ta-inaccurate) · s1 "Every sentence carries a figure" (judge/spot items) · s2 "Prepositions with figures" (to/by/from…to/at/in…of; spot and choose) · s3 "Approximation and units" (around, just over, roughly; number/amount; `claimnum` items) · check.

**m05 Grouping** (tags: cc-grouping, cc-paragraphing, ta-mechanical, ta-selection) · s1 "Sort before you write" (`sort` items grouping categories of prompts into two named bins) · s2 "One group, one paragraph" (which sentences belong to which paragraph; order items) · s3 "Leave things out" (select the figures that survive; select items) · check.

**m06 TREND mode** (tags: lr-trend-vocab, lr-degree, gra-tense, gra-prep-figure, gra-pattern) · s1 "Trend verbs and nouns" (rise/rose/a rise; fall; fluctuate; peak; plateau; level off) · s2 "Degree and pace" (adverb/adjective pairs matched to the size of change; build items P3/P4) · s3 "Peaks, troughs, projections" (peaked at, hit a low of, is expected to; `para` item on p-line-museums or p-line-cities) · check.

**m07 COMPARE mode** (tags: lr-compare-vocab, lr-proportion, gra-pattern, gra-plural, kn-triage-mode) · s1 "Bar charts: higher, highest, twice as" (comparatives, superlatives, multiples, respectively; P5/P6) · s2 "Pie charts: shares and fractions" (accounted for, a third, just under half; p-pie-budget, p-pie-energy) · s3 "Tables: rows and columns" (biggest number in each row/column; compare whole rows; p-table-salaries, p-table-rice; `para` item) · check.

**m08 SEQUENCE mode** (tags: gra-passive, cc-sequencers, lr-process-vocab, ta-missing-category, gra-tense) · s1 "Present simple and the passive" (is heated, are collected; natural = active) · s2 "Sequencers" (at the first stage, once, after which, before being; order items) · s3 "The overview of a process" (stages count, linear/cyclical, start/end; p-proc-glass, p-proc-frog; `overview` item) · check.

**m09 SPACE mode** (tags: lr-map-vocab, gra-passive, gra-tense, ta-no-overview, cc-grouping) · s1 "Compass and position" (to the north of, adjacent to; not left/right) · s2 "Change verbs and tenses" (was demolished, has been converted, will be built; p-map-riverside) · s3 "The overview of a map" (overall character of change, what stayed; `overview` item on p-map-riverside) · check.

**m10 Two Visuals** (tags: cc-paragraphing, ta-no-overview, ta-mechanical, cc-reference) · s1 "One intro for two" (build items for the double intro) · s2 "One overview, two headlines" (judge/choose; p-mixed-coffee) · s3 "One paragraph each" (order/sort sentences into the right paragraph; `para` on p-mixed-coffee) · check.

**m11 Accuracy** (tags: gra-article, gra-plural, lr-number-amount, gra-punctuation, gra-tense, gra-prep-figure, lr-spelling) · s1 "Articles and plurals" (spot items) · s2 "Agreement, punctuation, spelling" (spot; the number of … was; comma after openers; kit spellings) · s3 "Error auction" (mixed spot items where the student must find the single error among the seven families) · check.

**m12 Cohesion** (tags: cc-reference, cc-linking-overuse, gra-complex, gra-punctuation) · s1 "Reference and substitution" (this figure, the former/the latter, both, respectively; choose/build) · s2 "Fewer connectors, better links" (spot overuse; choose the natural link) · s3 "Relative and participle clauses" (join two sentences; build items; C1 allowed) · check.

**m13 Selection** (tags: ta-selection, ta-mechanical, ta-overview-vague, ta-inaccurate) · s1 "What is a key feature?" (judge: key or trivial?) · s2 "Choose four" (`select` items using keyFeatures/distractorFeatures of prompts) · s3 "Illustrate, don't list" (choose the better paragraph; which figures illustrate the feature) · check.

**m14 Exam Day** (tags: struct-time, struct-length, kn-test-facts, ta-conclusion, lr-register) · s1 "The 20-minute protocol" (order the phases; timings) · s2 "The pre-flight check" (10-point list; judge items about sample paragraphs) · s3 "On paper and on computer" (word count, task order, what to do if time runs out) · check.

## Prompt ids available for `chart:` (see prompts.js)

p-line-museums (TREND, 3 lines 2010–2020) · p-line-internet (TREND, 4 countries 2005–2025) · p-line-cities (TREND with projection) · p-bar-screentime (COMPARE, grouped) · p-bar-tourists (TREND, single series with collapse) · p-bar-homework (COMPARE, grouped, A2) · p-pie-energy (two pies 2000/2020) · p-pie-budget (one pie) · p-table-salaries (COMPARE) · p-table-rice (TREND) · p-proc-glass (cyclical, man-made, 8 stages) · p-proc-frog (cyclical, natural, 5 stages) · p-map-riverside (past/present) · p-mixed-coffee (bar + table).

Read the data in prompts.js and make every claim true of it.
