/* ===========================================================================
   CHART CONTROL — content.js  (core)
   IELTS Academic Writing Task 1 · Satriwithaya School EP (M4.1) and tutoring
   ---------------------------------------------------------------------------
   This file holds everything that is NOT question content: the module
   registry, the rank ladder, the awards, and the error-tag dictionary that
   drives hints, the pre-flight checker and the teacher report.

   The questions live in the topic files, loaded after this one, which push
   onto CONTENT.TOPICS:

     topic-00.js   Module 00  The Test
     topic-01.js   Module 01  Triage
     topic-02.js   Module 02  Flight Plan (skeleton + intro)
     topic-03.js   Module 03  The Overview
     topic-04.js   Module 04  Claim + Number
     topic-05.js   Module 05  Grouping
     topic-06.js   Module 06  TREND mode
     topic-07.js   Module 07  COMPARE mode
     topic-08.js   Module 08  SEQUENCE mode
     topic-09.js   Module 09  SPACE mode
     topic-10.js   Module 10  Two Visuals
     topic-11.js   Module 11  Accuracy
     topic-12.js   Module 12  Cohesion
     topic-13.js   Module 13  Selection
     topic-14.js   Module 14  Exam Day
     topic-15.js   Module 15  Comparing            (The Grammar Wing, WS-J: from Departure Board)
     topic-16.js   Module 16  Tense by the Dates   (The Grammar Wing, WS-J: from Postcards & Plans)
     topic-17.js   Module 17  Active or Passive    (The Grammar Wing, WS-J: from Voice Control)
     prompts.js    The Task 1 prompt bank (data-defined charts)
     models.js     Model answers with dissect labels
     mocks.js      Three timed mocks (exam mode)

   ---------------------------------------------------------------------------
   SHAPE OF A MODULE (one topic, one level, three sub-levels, one check)

   {
     id:'m03', n:3, code:'Module 03', name:'The Overview', art:'signal',
     cefr:'A2–B2', gates:['TA'],
     blurb:'One sentence a student reads before opening it.',
     levels:[{ id:'m03l1', n:1, name:'The Overview', cefr:'A2–B2', blurb:'…',
       subs:[
         { id:'m03s1', name:'…', cefr:'B1',
           theory:{ key:'One sentence that is the whole idea.',
                    body:['<p-worth of html>', …],
                    simple:['same idea, plainer English', …],
                    examples:[{s:'…', g:'…'}] },
           items:[ … ] }, …three subs…
       ],
       check:{ id:'m03ck', name:'Systems Check', items:[ … ] } }]
   }

   ITEM TYPES  (engine.js renders and marks these)
     choose    {stem, options[], answer}                 multiple choice
     judge     {given, stem, answer}                     True / False / Can't tell (0/1/2)
     spot      {stem, words[], answer, fix}              tap the wrong word
     sort      {stem, bins[{key,label,hint}], items[{text,bin}]}   drop into boxes
     build     {stem, tiles[], solution, alt[]}          assemble a sentence
     order     {stem, items[] IN CORRECT ORDER}          reorder (shuffled)
     select    {stem, options[], answers[] , k}          tick exactly k options
     overview  {stem, chart, must[], minWords, maxWords} write an overview (rule-checked)
     claimnum  {stem, chart, labels[], verbs[]}          write one claim+number sentence
     para      {stem, chart, mode, minWords, maxWords}   write one detail paragraph (checked)

   Any item may carry `chart:'<prompt id>'` (from prompts.js) or an inline
   chart object {type:'line'|'bar'|'pie'|'table'|'process'|'map', …} and the
   chart is drawn above the question.

   Every item carries: id · type · tag (must exist in REMEDIATION) · level
   (A2 | B1 | B2 | C1) · why (the diagnosis a student reads after answering).

   Nothing in this app may reproduce a real past IELTS paper. Prompts are
   original and data-generated. See VERIFY.md.
   =========================================================================== */

var CEFR = ['A2', 'B1', 'B2', 'C1'];

/* The four operating modes. Everything in the language kit hangs off one. */
var MODES = {
  TREND:    { name: 'TREND',    tint: 'accent', q: 'Is there a time axis or two dates?',      kit: 'change verbs · past simple · from…to · peaked at' },
  COMPARE:  { name: 'COMPARE',  tint: 'gold',   q: 'No time — just categories?',              kit: 'higher than · twice as … as · respectively · accounted for' },
  SEQUENCE: { name: 'SEQUENCE', tint: 'ok',     q: 'Is it a diagram of stages?',              kit: 'present simple · passive · first / next / finally' },
  SPACE:    { name: 'SPACE',    tint: 'no',     q: 'Is it a map or a plan?',                  kit: 'to the north of · was demolished · converted into' }
};

/* --------------------------------------------------------------------------
   RANKS — one rung per band of module checks cleared (15 in total).
   -------------------------------------------------------------------------- */
var RANKS = [
  { min: 0,  name: 'Newcomer',    note: 'Your key is in your hand. No gates passed yet.' },
  { min: 1,  name: 'First-year',  note: 'Your first class is passed.' },
  { min: 3,  name: 'Second-year', note: 'You can read a chart and name its mode.' },
  { min: 5,  name: 'Third-year',  note: 'Overview, numbers, groups: the four paragraphs hold.' },
  { min: 8,  name: 'Fourth-year', note: 'Two modes under control, and a spellbook of your own.' },
  { min: 10, name: 'Fifth-year',  note: 'Every kind of chart, on the clock.' },
  { min: 12, name: 'Prefect',     note: 'Accurate, cohesive, selective.' },
  { min: 15, name: 'Graduate',    note: 'Every class passed. Ready for the Almanac Examination.' }
];

/* --------------------------------------------------------------------------
   AWARDS
   -------------------------------------------------------------------------- */
var BADGES = [
  { id: 'poweron',   name: 'First Spark',        perk: 'Your wand is awake.',                     how: 'Finish your first class.' },
  { id: 'streak3',   name: 'Three Candles',      perk: 'Habit is a kind of magic.',               how: 'Study 3 days in a row.' },
  { id: 'streak7',   name: 'A Week of Candles',  perk: 'Seven candles, none blown out.',          how: 'Study 7 days in a row.' },
  { id: 'allgreen',  name: 'Flawless Gate',      perk: 'A perfect examiner\'s gate.',             how: 'Score 100% on any examiner\'s gate.' },
  { id: 'nohelp',    name: 'No Wand Needed',     perk: 'No hints, no help.',                      how: 'Pass an examiner\'s gate without using a hint.' },
  { id: 'recovered', name: 'Mended',             perk: 'You mended what you broke.',              how: 'Fix 5 questions in the Mending Room.' },
  { id: 'run10',     name: 'Ten Clean Spells',   perk: 'Ten in a row.',                           how: 'Answer 10 questions correctly in a row.' },
  { id: 'overview',  name: 'Overview Ace',       perk: 'The most valuable 40 words.',             how: 'Write 10 overviews that pass every rule.' },
  { id: 'preflight', name: 'All Ten Wards',      perk: 'Nothing red in the wards.',               how: 'Submit a report with zero red rows on the Ten Wards.' },
  { id: 'fourmodes', name: 'Four Modes',         perk: 'TREND, COMPARE, SEQUENCE, SPACE.',        how: 'Submit a passing report in each of the four modes.' },
  { id: 'twenty',    name: 'Twenty Minutes',     perk: 'On the clock and on time.',               how: 'Submit a timed report inside 20 minutes with 150+ words.' },
  { id: 'bandup',    name: 'Band Up',            perk: 'Half a band higher than your best.',      how: 'Get a band half a band above your previous best.' },
  { id: 'mock1',     name: 'First Mock',         perk: 'You have seen the whole task.',           how: 'Finish any timed mock.' },
  { id: 'bootcamp',  name: 'Duelling Champion',  perk: 'The whole plan, three times over.',       how: 'Complete three duels in the Duelling Hall (50% or more).' },
  { id: 'director',  name: 'Graduate',           perk: 'Every class passed.',                     how: 'Pass all 15 examiners\' gates (the Grammar Wing is extra).' } /* WS-I: the 15 core gates; m15–m17 are optional */
];

/* --------------------------------------------------------------------------
   ERROR TAGS
   Every item and every pre-flight rule names one. `principle` is what a
   student sees if they press Hint (and beside a red row on the panel).
   `reteach` and `activities` appear only in the teacher console.
   Prefix = the criterion it costs: ta / cc / lr / gra / (kn = knowledge).
   -------------------------------------------------------------------------- */
var REMEDIATION = {

  /* ---------------------------------------- knowledge of the test */
  'kn-test-facts': {
    name: 'The facts of the task',
    gate: 'TA',
    principle: 'Task 1: about 20 minutes, at least 150 words, one-third of the Writing score. Four criteria, 25% each. Summarise, select, compare. No opinion, no conclusion.',
    reteach: 'Students who do not know the weighting spend 30 minutes on Task 1 and lose Task 2. Students who do not know the criteria write a story. Ten minutes on the facts saves a band.',
    activities: ['Quiz race on the numbers: 20, 150, 4, 25, twice.', 'Rubric autopsy: underline the three verbs — summarise, select, compare.']
  },
  'kn-criteria': {
    name: 'What each criterion rewards',
    gate: 'TA',
    principle: 'TA = did you select, report and compare the main features with an overview and data? CC = is it organised in paragraphs that flow? LR = is the vocabulary precise? GRA = are the sentences varied and correct?',
    reteach: 'Map every piece of feedback onto one of the four criteria so students see that "no overview" is a TA problem and "rose by 10%" vs "rose to 10%" is GRA. The criterion names the fix.',
    activities: ['Sort feedback comments into the four criteria.', 'Band ladder walk: read Band 5, 6, 7 for one criterion and name the difference.']
  },
  'kn-triage-mode': {
    name: 'Choosing the operating mode',
    gate: 'GRA',
    principle: 'Time axis or two dates → TREND. No time, just categories → COMPARE. Stages → SEQUENCE. Map or plan → SPACE. Decide before you read a single number.',
    reteach: 'Mode decides tense, verbs and connectors. A student who writes "increased" about a chart with no time axis has not triaged. Flash visuals for five seconds and demand the mode.',
    activities: ['Mode Sort with coloured cards, 16 visuals in 3 minutes.', 'Trap round: bar charts with years vs bar charts with countries.']
  },
  'kn-triage-units': {
    name: 'Reading units, axes and labels',
    gate: 'TA',
    principle: 'Read the title, both axes, the units and the legend before anything else. "Thousands", "%", "per person" and "millions" change every sentence you write.',
    reteach: 'Most "inaccurate data" marks come from a unit misread, not a number misread. Make reading the y-axis label aloud a ritual.',
    activities: ['Units hunt: five charts, write the unit for each in ten seconds.', 'Rewrite a sentence when the unit changes from thousands to millions.']
  },

  /* ---------------------------------------- Task Achievement */
  'ta-no-overview': {
    name: 'No overview',
    gate: 'TA',
    principle: 'Every report needs a paragraph that begins "Overall," and states the two or three biggest general truths. Without it the examiner cannot give more than Band 5 for Task Achievement.',
    reteach: 'The overview is the single cheapest band in IELTS. Make it paragraph two, always, so it is on the page even if time runs out. Students who "leave it for the end" never write it.',
    activities: ['Newspaper headline: "if this chart were a news story, what is the headline?"', 'Overview-only sprints: five charts, overview only, two minutes each.']
  },
  'ta-overview-figures': {
    name: 'Figures in the overview',
    gate: 'TA',
    principle: 'The overview is general. Dates and category names are fine; numbers, percentages and amounts belong in the detail paragraphs.',
    reteach: 'A student who puts figures in the overview has written a third detail paragraph and has no overview. The test: cover the numbers — does the paragraph still say something?',
    activities: ['Strip the numbers: rewrite an overview with figures into one without.', 'Overview or Not sorting cards.']
  },
  'ta-overview-vague': {
    name: 'Overview too vague',
    gate: 'TA',
    principle: '"There were some differences between the groups" says nothing. Name the trend or the difference: what rose, what fell, what was largest, what stayed the same.',
    reteach: 'Band 7 needs "a clear overview" in which "main trends or differences are identified". Vague = Band 6 at best. Push for the content word: rose, fell, largest, smallest, doubled.',
    activities: ['Vagueness auction: bid to fix the vaguest overview.', 'Two truths: every overview must contain two content claims.']
  },
  'ta-no-data': {
    name: 'No data to support the claim',
    gate: 'TA',
    principle: 'Every sentence in a detail paragraph carries a figure, a date or a label from the chart. A claim without a number is an opinion.',
    reteach: 'Band 5 TA says "there may be no data to support the description". This is a habit, not a concept: students circle the figure in each sentence when they check.',
    activities: ['Number Hunt: four minutes, as many correct claim+number sentences as possible.', 'Data Dictation: reconstruct the chart from a Band 8 paragraph.']
  },
  'ta-no-comparison': {
    name: 'No comparison',
    gate: 'TA',
    principle: 'The rubric says "make comparisons where relevant". Use than, as … as, whereas, while, compared with, respectively — at least twice in the report.',
    reteach: 'Narrating each line separately is what "mechanical" means in the Band 5 descriptor. Teach students to write about two things in one sentence.',
    activities: ['Twice As Much: comparison sentences from a bar chart, one pattern per round.', 'Merge two narration sentences into one comparison.']
  },
  'ta-mechanical': {
    name: 'Mechanical listing',
    gate: 'TA',
    principle: 'Do not list every year or every category. Select the first, the last, the extreme and one comparison. Leave the rest out on purpose.',
    reteach: 'Listing feels safe to a nervous writer. Show that a Band 8 uses fewer figures than a Band 5 and chooses them better.',
    activities: ['Cut it down: a 12-figure paragraph must become a 5-figure paragraph.', 'Select the four: which figures would you keep and why?']
  },
  'ta-opinion': {
    name: 'Opinion or reason added',
    gate: 'TA',
    principle: 'Report what the chart shows, never why it happened or what you think about it. No "because people became richer", no "this is surprising".',
    reteach: 'Task 1 is a factual report. Reasons and opinions are "irrelevant material" and lower TA. Students transfer the Task 2 habit; name it and ban it.',
    activities: ['Register police: spot the opinion sentence in a paragraph.', 'Fact or guess sorting.']
  },
  'ta-conclusion': {
    name: 'Conclusion written',
    gate: 'TA',
    principle: 'Task 1 has no conclusion. The overview does the summarising. "In conclusion" repeats information and wastes time.',
    reteach: 'A conclusion in Task 1 is repetition (CC) and sometimes opinion (TA). If a student has both an overview and a conclusion, delete the conclusion.',
    activities: ['Delete the last paragraph: does anything change? No.', 'Rename: turn a conclusion into an overview and move it to paragraph two.']
  },
  'ta-missing-category': {
    name: 'A category or stage missing',
    gate: 'TA',
    principle: 'Mention every category in the chart at least once, and every stage in a process. An examiner notices what is missing.',
    reteach: 'Official examiner comments name missing categories explicitly. For processes a missing stage is an accuracy fault. Tick the legend as you write.',
    activities: ['Legend tick: cross off each category as it is used.', 'Which stage is missing? Passive Chain with a deliberate gap.']
  },
  'ta-inaccurate': {
    name: 'Inaccurate figure or trend',
    gate: 'TA',
    principle: 'Read the value from the axis, not from memory. "Rose" must actually rise. If you cannot read the exact figure, use "approximately" or "just under".',
    reteach: 'Approximation language is the safe route for A2–B2 writers: it protects accuracy without a precise read. Drill "around, roughly, just over, just under".',
    activities: ['True or false about the chart: 10 fast statements.', 'Approximation swap: replace every exact guess with an approximate phrase.']
  },
  'ta-selection': {
    name: 'Key features poorly selected',
    gate: 'TA',
    principle: 'Choose the 3–4 features that best summarise the chart: the overall direction, the largest and smallest, the biggest change or gap, the exception. Not the trivial ones.',
    reteach: 'Band 8 TA says key features are "skilfully selected". This is the last gate and the one that separates 7 from 8. Compare the student\'s choice with yours, out loud.',
    activities: ['Select the four: eight candidate features, choose four and justify.', 'Headline test: would a newspaper report this figure?']
  },

  /* ---------------------------------------- Coherence and Cohesion */
  'cc-paragraphing': {
    name: 'Paragraphing',
    gate: 'CC',
    principle: 'Four paragraphs: introduction, overview, detail group A, detail group B. One group of features per paragraph. Never one long block.',
    reteach: 'Paragraphing is the visible half of grouping. If the groups were decided before writing, the paragraphs write themselves.',
    activities: ['Cut the block: divide a one-paragraph report into four.', 'Skeleton race: label the four paragraphs of a model in 30 seconds.']
  },
  'cc-grouping': {
    name: 'Grouping the data',
    gate: 'CC',
    principle: 'Sort the categories into two groups that share a story before you write: rising vs falling, large vs small, early vs late stages, north vs south. One group = one paragraph.',
    reteach: 'Grouping earns TA 7 ("data appropriately categorised") and CC 7 ("logically organised") at once. It is the core thinking skill and students never discover it alone.',
    activities: ['Sort the Lines: five-line graph, teams propose groupings and defend them.', 'Name the group: every group must have a name before the paragraph is written.']
  },
  'cc-linking-overuse': {
    name: 'Linking words overused or mechanical',
    gate: 'CC',
    principle: 'Not every sentence needs "Firstly", "Moreover", "In addition". Link with meaning: "In contrast", "over the same period", "the former", "this figure".',
    reteach: 'Band 6 CC: cohesion "mechanical due to overuse". Show a paragraph with a connector on every sentence and one with two; ask which reads more easily.',
    activities: ['Connector diet: rewrite with at most two connectors.', 'Invisible links: join sentences with reference words instead.']
  },
  'cc-reference': {
    name: 'Reference and substitution',
    gate: 'CC',
    principle: 'Refer back instead of repeating: "this figure", "the latter", "the same period", "both", "respectively". Band 7 CC rewards flexible reference and substitution.',
    reteach: 'Repetition of the category name in every sentence is the Band 6 signature. Teach four reference tools and require two per report.',
    activities: ['Repeat hunt: circle every repeated noun, replace half.', 'The former / the latter drill.']
  },
  'cc-sequencers': {
    name: 'Sequencing a process',
    gate: 'CC',
    principle: 'Move through a process with sequencers: at the first stage, next, following this, once … has been …, after which, before being …, finally.',
    reteach: 'Processes reward clear progression. Vary the sequencers — "then, then, then" is mechanical; "once", "after which" and "before being" show range.',
    activities: ['Passive Chain around the team.', 'Sequencer swap: replace every "then" with a different device.']
  },

  /* ---------------------------------------- Lexical Resource */
  'lr-copied-rubric': {
    name: 'Rubric copied',
    gate: 'LR',
    principle: 'Paraphrase the task sentence: shows → illustrates / compares; the number of → how many; between 2010 and 2020 → over a ten-year period. Copied words are not counted.',
    reteach: '"Any copied rubric must be discounted." Students who copy the intro lose words and evidence. Teach three swaps and a change of sentence shape.',
    activities: ['Paraphrase Relay: rewrite the rubric three ways in two minutes.', 'Swap table: shows / illustrates / compares / gives information about.']
  },
  'lr-register': {
    name: 'Informal or personal language',
    gate: 'LR',
    principle: 'No I, we, you; no contractions; no "as we can see"; no idioms; no exclamation marks. Neutral, impersonal, academic.',
    reteach: 'Register lapses are the fastest way to lose LR and TA (format). Give students a banned list and let them police each other.',
    activities: ['Register police: find the five informal items in a paragraph.', 'Formalise: rewrite "you can see that" and "it\'s".']
  },
  'lr-trend-vocab': {
    name: 'Trend vocabulary',
    gate: 'LR',
    principle: 'Up: rose, increased, grew, climbed. Down: fell, decreased, dropped, declined. Stable: remained stable, levelled off, plateaued. Fluctuated, peaked at, hit a low of.',
    reteach: 'A closed set of trend verbs used correctly beats a wide set used wrongly. Drill verb and noun forms together: rise / a rise, fall / a fall.',
    activities: ['Trend Charades: draw the line, partner describes it in one sentence.', 'Verb–noun pairs Blooket.']
  },
  'lr-degree': {
    name: 'Adverbs and adjectives of degree',
    gate: 'LR',
    principle: 'Verb + adverb: rose sharply / fell slightly. Adjective + noun: a sharp rise / a slight fall. Match the size: dramatic for big, marginal for tiny.',
    reteach: 'Degree words are where students show precision (LR 7). Teach them in pairs and insist the degree matches the data.',
    activities: ['Size it: match five changes to five degree words.', 'Adverb–adjective pairs Blooket.']
  },
  'lr-compare-vocab': {
    name: 'Comparison vocabulary',
    gate: 'LR',
    principle: 'far higher than, slightly lower than, twice as many as, three times as high as, roughly equal, the majority, whereas, compared with, respectively.',
    reteach: 'COMPARE mode has its own kit. Students at A2 default to "more than" for everything; add multiples and degree words.',
    activities: ['Twice As Much game.', 'Ranking language: by far the highest, came second, at the other end of the scale.']
  },
  'lr-proportion': {
    name: 'Proportion and fractions',
    gate: 'LR',
    principle: 'accounted for, made up, represented, a quarter, a third, half, two-thirds, just over / just under, the remaining X%.',
    reteach: 'Pie charts need proportion verbs, not trend verbs. Convert percentages to fractions to add range.',
    activities: ['Slice It: convert 24%, 51%, 76% into fraction phrases.', 'Accounted for / made up substitution.']
  },
  'lr-approx': {
    name: 'Approximation',
    gate: 'LR',
    principle: 'approximately, around, about, roughly, nearly, almost, just over, just under, close to. Use them when the exact value cannot be read.',
    reteach: 'Approximation protects accuracy and adds range. It is the lower-level writer\'s best friend.',
    activities: ['Read the axis: values between gridlines must take an approximation word.', 'Over/under: is 48% "just under half" or "nearly half"? Both.']
  },
  'lr-number-amount': {
    name: 'Number / amount / proportion',
    gate: 'LR',
    principle: 'the number of (countable: cars, people, visitors); the amount of (uncountable: money, energy, time); the proportion / percentage of (either).',
    reteach: 'One of the seven high-frequency errors. Drill with the nouns that actually appear in charts.',
    activities: ['Countable or not: 20 chart nouns.', 'Fix the phrase: "the amount of visitors".']
  },
  'lr-process-vocab': {
    name: 'Process vocabulary',
    gate: 'LR',
    principle: 'stage, step, phase; raw material, end product; is collected, heated, mixed, filtered, compressed, transferred, packaged, delivered; undergoes; cycle.',
    reteach: 'Process diagrams supply the nouns on the picture; the verbs must come from the student. Build a verb bank per diagram.',
    activities: ['Verb harvest: list 10 process verbs in the passive.', 'Describe the diagram with the labels covered.']
  },
  'lr-map-vocab': {
    name: 'Map vocabulary',
    gate: 'LR',
    principle: 'to the north / south-east of, adjacent to, opposite, along; was built, demolished, converted into, extended, replaced by, relocated, pedestrianised; remains unchanged.',
    reteach: 'Maps have a small, learnable kit. Compass points, change verbs, and one phrase for what stayed the same.',
    activities: ['Before/After: list changes by compass point against the clock.', 'Change-verb bingo.']
  },
  'lr-collocation': {
    name: 'Collocation and word choice',
    gate: 'LR',
    principle: 'Words go with their partners: a sharp rise (not a strong rise), reached a peak (not made a peak), accounted for (not took), the figure for (not the number for).',
    reteach: 'LR 7 needs "an awareness of style and collocation". Collect the student\'s own miscollocations and drill the correct pairs.',
    activities: ['Partner match: verbs and nouns that belong together.', 'Odd one out: three collocations, one is wrong.']
  },
  'lr-spelling': {
    name: 'Spelling and word formation',
    gate: 'LR',
    principle: 'Spell the core kit correctly: percentage, significantly, approximately, fluctuated, decreased, proportion, whereas. Watch word forms: increase (verb/noun), increasingly.',
    reteach: 'Spelling errors in the core kit are visible and cheap to fix. Keep a personal list of ten.',
    activities: ['Dictation of ten kit words.', 'Word-family table: rise / rising / a rise.']
  },

  /* ---------------------------------------- Grammar */
  'gra-tense': {
    name: 'Tense and the time frame',
    gate: 'GRA',
    principle: 'Past dates → past simple. Up to now → present perfect. Future years → is expected to / will. No dates or a process → present simple. Maps: past for the old map, present for now, "will be" for plans.',
    reteach: 'Tense follows the triage. Students who write "increases" about 1990 have not looked at the dates. Make the time frame the first thing they say aloud.',
    activities: ['Tense from the time frame Blooket.', 'Same sentence, three time frames.']
  },
  'gra-prep-figure': {
    name: 'Prepositions with figures',
    gate: 'GRA',
    principle: 'rose TO 70% (end point) · rose BY 10 percentage points (size of change) · rose FROM 60% TO 70% · peaked AT 80 · stood AT 3 million · a rise IN sales OF 5%.',
    reteach: 'The highest-frequency grammar error in Task 1. "Increased to 10%" and "increased by 10%" mean different things. Drill to / by / from…to / at until automatic.',
    activities: ['Preposition Sprint: 20 gaps in 3 minutes.', 'To or by? Say what happened with real numbers.']
  },
  'gra-article': {
    name: 'Articles',
    gate: 'GRA',
    principle: 'THE line graph, THE number of, THE figure for, THE UK. A rise / a fall / a peak (first mention). No article before plural categories in general: visitors, cars.',
    reteach: 'Article errors rarely impede meaning but they cap GRA at 6 when frequent. Focus on the fixed phrases of the kit: the figure for, a sharp rise.',
    activities: ['Article gaps in a model paragraph.', 'The or nothing: 15 chart nouns.']
  },
  'gra-plural': {
    name: 'Plurals and countability',
    gate: 'GRA',
    principle: 'Plural -s on plural nouns (three museums, both countries, 25 percent of households). Count words: the number of / few / many with plurals; the amount of / little / much with uncountables.',
    reteach: 'Subject–verb agreement with "the number of" is a classic. Teach the head noun rule.',
    activities: ['Find the head noun, choose the verb.', 'Spot the missing -s.']
  },
  'gra-agreement': {
    name: 'Subject–verb agreement',
    gate: 'GRA',
    principle: 'Find the head noun, then choose the verb: "The number of visitors WAS", "The figures WERE", "Each of the countries HAS", "The proportion of students who walk ROSE".',
    reteach: 'Error family E3. Thai has no agreement, so it fails under pressure in long subjects. Teach the head-noun rule with "the number of", "the proportion of", "each of", and with a relative clause between the subject and the verb.',
    activities: ['Underline the head noun, then pick the verb (12 chart sentences).', 'Lengthen the subject: add "of …" and "who …" and keep the verb right.']
  },
  'gra-punctuation': {
    name: 'Punctuation',
    gate: 'GRA',
    principle: 'Comma after an opening phrase (In 2010, …; Overall, …). Comma before "whereas/while" contrasts. No comma splice: two full sentences need a full stop or a linking word.',
    reteach: 'Comma splices and missing commas after openers are the two visible faults. Long complex sentences need comma discipline.',
    activities: ['Punctuate a stripped model paragraph.', 'Splice hunt.']
  },
  'gra-complex': {
    name: 'Complex sentences',
    gate: 'GRA',
    principle: 'Band 7 needs a variety of complex structures used accurately: while/whereas contrasts, relative clauses (which …), participle clauses (having peaked …), "with + noun + -ing".',
    reteach: 'Add one relative clause and one participle clause per paragraph, no more. Accuracy first: a faulty complex sentence scores below a correct simple one.',
    activities: ['Join two simple sentences three different ways.', 'One upgrade per paragraph.']
  },
  'gra-passive': {
    name: 'The passive for processes and maps',
    gate: 'GRA',
    principle: 'Man-made processes and map changes use the passive: the clay is heated; the bottles are collected; the factory was demolished; the park has been extended.',
    reteach: 'The passive is the natural voice when the agent is unknown or unimportant, which is every process and every map. Drill be + past participle in three tenses.',
    activities: ['Active → passive relay.', 'Was / has been / will be: match the map tense.']
  },
  'gra-pattern': {
    name: 'The eight sentence patterns',
    gate: 'GRA',
    principle: 'S1 intro · S2 overview · S3 rose/fell from X to Y · S4 there was a sharp rise in · S5 A was higher than B, at X and Y respectively · S6 twice as … as / accounted for · S7 is heated before being … · S8 was converted into. (P1–P4 are the four paragraphs.)',
    reteach: 'A closed set of eight patterns drilled to zero errors is the road to GRA 7 for A2–B2 writers. Each pattern has a lexical slot for LR.',
    activities: ['Pattern of the day: ten sentences, one pattern, zero errors.', 'Build the sentence tiles.']
  },

  /* ---------------------------------------- structure (pre-flight only) */
  'struct-length': {
    name: 'Length',
    gate: 'TA',
    principle: 'At least 150 words; aim for 160–190. Under 150 caps Task Achievement (100–149 at Band 5); 201–250 costs time you need for checking and Task 2; over 250 usually means too many details were chosen.',
    reteach: 'Length is evidence. Too short and there is nothing to mark; too long and errors multiply.',
    activities: ['Word budget: 30 / 45 / 60 / 60.', 'Cut a 240-word report to 180 without losing a key feature.']
  },
  'struct-time': {
    name: 'Time management',
    gate: 'TA',
    principle: '0:30 triage · plan until 4:00 (big picture, group and select) · write until 17:00 · check until 20:00. Overview straight after the intro. Hard stop at 20 minutes.',
    reteach: 'The exam is a 20-minute sprint. Students who plan for four minutes write better and faster than students who start writing immediately.',
    activities: ['Timed planning only: four minutes, no writing.', 'Full timed report with the phase timer.']
  }
};

/* --------------------------------------------------------------------------
   The registry the topic files push into. The order here is the order on the
   Modules screen and in the Flight plan.
   -------------------------------------------------------------------------- */
var TOPICS = [];
var MOCKS = [];
var PROMPTS = [];
var MODELS = [];

/* --------------------------------------------------------------------------
   Which gate each module mainly serves — used for the four readiness bars.
   -------------------------------------------------------------------------- */
var MODULE_GATES = {
  m00: ['TA'], m01: ['GRA', 'TA'], m02: ['TA', 'CC'], m03: ['TA'], m04: ['TA', 'LR', 'GRA'],
  m05: ['TA', 'CC'], m06: ['GRA', 'LR'], m07: ['GRA', 'LR'], m08: ['TA', 'GRA', 'CC'], m09: ['TA', 'GRA', 'LR'],
  m10: ['TA', 'CC'], m11: ['GRA'], m12: ['CC', 'GRA'], m13: ['TA'], m14: ['TA', 'CC', 'LR', 'GRA'],
  /* WS-J */ m15: ['GRA', 'LR'], m16: ['GRA'], m17: ['GRA'] /* /WS-J */
};

window.CONTENT = {
  CEFR: CEFR, MODES: MODES, RANKS: RANKS, BADGES: BADGES, REMEDIATION: REMEDIATION,
  TOPICS: TOPICS, MOCKS: MOCKS, PROMPTS: PROMPTS, MODELS: MODELS, MODULE_GATES: MODULE_GATES
};
