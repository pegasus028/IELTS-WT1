/* ===========================================================================
   QUILLMOOR ACADEMY · THE OBSERVATORY (Chart Control, Task 1) — lab-content.js
   Content for the Spellbook Workshop (lab.js): one spellbook page per mode
   (TREND · COMPARE · SEQUENCE · SPACE). Each page is a four-paragraph
   blueprint (P1 intro ≈30 words · P2 overview ≈45 · P3 group A ≈60 · P4
   group B ≈60 · no conclusion · 160–190 words). The student rewrites every
   line in her own words; the [slots] are the variables she fills from the
   chart in the exam.

   Per mode:
     vars[]   key · label (shown as [Label]) · job · shape · check (the data
              rule, see template.js Template.Data.check) · weight (share of
              the variable words) · tip · eg (from the Lamphun / Chiang Rai /
              coconut sugar / Ban Khlong scenario, lab-scenario.js)
     lines[]  id · para · name · fn · why · tip · crit · slots · weight ·
              examples {B1:[3], B2:[3], C1:[3]} in the S1–S8 patterns
     classDraft  the class assignment (EN31208 A1–A4) adapted to these
              slots: a starting draft that is longer than 60% and must be
              trimmed into the student's own words.
   Overview lines never carry a figure slot. Plain ES5.
   =========================================================================== */
(function (global) {
  'use strict';

  var LAB = {};

  /* The report every budget is calculated against: 160–190 words. */
  LAB.REPORT_WORDS = 175;

  LAB.PARAS = [
    { key: 'intro', name: 'P1 · Introduction', short: 'P1', target: 30, job: 'Paraphrase the task: what the visual shows, where, when, in what unit.' },
    { key: 'overview', name: 'P2 · Overview', short: 'P2', target: 45, job: 'Start with "Overall,": two or three big truths, no figures.' },
    { key: 'groupA', name: 'P3 · Group A', short: 'P3', target: 60, job: 'The first group, with figures in every sentence.' },
    { key: 'groupB', name: 'P4 · Group B', short: 'P4', target: 60, job: 'The second group, with figures and a comparison.' }
  ];

  /* ---------------------------------------------------- template shares
     The share of the report that is the student's fixed frame. In Task 1
     the chart supplies the figures and names, so even a 60% page leaves the
     data to the student; the lower shares put more of the language in her
     own hands, which is where LR and GRA marks come from.               */
  LAB.PCTS = [
    { pct: 60, name: 'Training page', short: '60%',
      blurb: 'Six words in ten come from your page. Quick to build, quick to use.',
      research: 'Good for learning the four paragraphs. In the exam, a frame this long can sound learnt by heart, and examiners notice wording that does not fit the chart.',
      suits: 'First pages, B1' },
    { pct: 50, name: 'Guided page', short: '50%',
      blurb: 'Half your page, half the chart\'s figures and your own words.',
      research: 'A safe middle: the frame keeps the order, your words carry the trends and comparisons.',
      suits: 'Band 5.5–6.5 practice' },
    { pct: 40, name: 'Lean page', short: '40%',
      blurb: 'Short signposts. The data and your comparisons carry the report.',
      research: 'Your own words carry most of the report, so your vocabulary and grammar can show their range.',
      suits: 'Band 6.5–7' },
    { pct: 30, name: 'Exam-ready page', short: '30%',
      blurb: 'One short signpost per sentence. Almost everything the examiner reads is yours.',
      research: 'Recommended for a Band 7.5 target: the frame only keeps the order; the precise trend words, figures and comparisons are all yours.',
      suits: 'Band 7–7.5+' }
  ];

  /* ------------------------------------------------------ target levels
     Official IELTS–CEFR alignment: Bands 4–5 ≈ B1, 5.5–6.5 ≈ B2, 7–8 ≈ C1. */
  LAB.LEVELS = [
    { id: 'B1', band: '5.5–6', bandLo: 5.5, bandHi: 6, tier: 'B1', name: 'From B1 · aim for Band 5.5–6', note: 'Short, accurate sentences. Correct figures, units and past simple every time.' },
    { id: 'B2', band: '6.5–7', bandLo: 6.5, bandHi: 7, tier: 'B2', name: 'From B2 · aim for Band 6.5–7', note: 'Clear groups, two or more comparisons, few errors.' },
    { id: 'C1', band: '7.5–8', bandLo: 7.5, bandHi: 8, tier: 'C1', name: 'From C1 · aim for Band 7.5–8', note: 'Precise trend words, relative and participle clauses, almost no errors.' }
  ];
  LAB.CEFR_ORDER = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
  LAB.MODE_ORDER = ['TREND', 'COMPARE', 'SEQUENCE', 'SPACE'];

  /* ======================================================== THE MODES */
  LAB.MODES = {};

  /* ---------------------------------------------------------- TREND */
  LAB.MODES.TREND = {
    id: 'TREND', name: 'TREND', classId: 'A1', page: 'The Tide Clock page',
    blurb: 'A time axis or two dates: line graphs, bar charts over years, two pies for two years, tables with year columns.',
    tense: 'Past simple for past years (rose, fell, remained). For projections: "is projected to", "is expected to".',
    grouping: 'Group A = the lines that move one way (for example the ones that rise); group B = the others. One bar over time? Group the years into two phases.',
    vars: [
      { key: 'visual', label: 'Visual', weight: 0.4, job: 'The kind of visual.', shape: 'a noun: line graph · bar chart · two pie charts · table', check: { type: 'visual' },
        tip: 'Two pies or two visuals? Name both, in the plural.', eg: 'line graph' },
      { key: 'what', label: 'What It Shows', weight: 1.8, job: 'What is measured, who or where, and the unit, in your own words.', shape: 'a noun phrase', check: { type: 'what' },
        tip: 'Change the task words (the number of → how many) and keep the unit.', eg: 'how many people, in thousands, visited three attractions in Lamphun' },
      { key: 'y1', label: 'First Year', weight: 0.3, job: 'The first year on the chart.', shape: 'a year', check: { type: 'year', role: 'first' }, tip: 'Read it off the axis.', eg: '2012' },
      { key: 'y2', label: 'Last Year', weight: 0.3, job: 'The last year on the chart (or the last real year before the projections).', shape: 'a year', check: { type: 'year', role: 'last' }, tip: 'Projections after it? Say so in the overview.', eg: '2022' },
      { key: 'groupA', label: 'Group A', weight: 1.0, job: 'The categories in your first group: the lines, bars or slices that move the same way.', shape: 'names from the chart: the Night Market · Sweden and Japan', check: { type: 'group' },
        tip: 'Use the names on the chart. One bar over time? Write a phase: "arrivals from 2015 to 2019".', eg: 'the Night Market' },
      { key: 'groupB', label: 'Group B', weight: 1.0, job: 'The categories in your second group.', shape: 'names from the chart', check: { type: 'group' },
        tip: 'Group B is not "the rest of my ideas": it is the categories that move differently.', eg: 'the Royal Museum' },
      { key: 'moveA', label: 'Trend A', weight: 0.8, job: 'What group A did over the whole period, in words.', shape: 'a verb phrase in the past simple: rose steadily · fell sharply · remained stable', check: { type: 'move', cat: 'groupA' },
        tip: 'No figures: this word goes in your overview first.', eg: 'rose steadily', eg2: 'climbed' },
      { key: 'moveB', label: 'Trend B', weight: 0.8, job: 'What group B did over the whole period.', shape: 'a verb phrase in the past simple', check: { type: 'move', cat: 'groupB' },
        tip: 'Group B usually moves the other way, or less.', eg: 'fell gradually', eg2: 'declined' },
      { key: 'feature', label: 'Key Feature', weight: 1.5, job: 'One more big-picture truth: a crossover, the highest at the end, a peak, a projection. No figures.', shape: 'a full clause', check: { type: 'nofig' },
        tip: 'The examiner reads this as part of your overview. Years and names are fine; figures are not.', eg: 'the Night Market overtook the Royal Museum around 2016 and ended the period as the most visited attraction' },
      { key: 'figA1', label: 'Start Figure A', weight: 1.1, job: 'The figure for group A in the first year, with its unit.', shape: 'a figure + unit: 20 thousand · 70% · $1,450', check: { type: 'figure', cat: 'groupA', at: 'y1' },
        tip: 'Two categories? Give both and add "respectively".', eg: '20 thousand visitors' },
      { key: 'figA2', label: 'End Figure A', weight: 1.3, job: 'The figure for group A at the end (or its peak), with the year if it is not the last one.', shape: 'a figure + unit (+ year)', check: { type: 'figure', cat: 'groupA', at: 'y2' },
        tip: 'Between two gridlines? Use "about", "just over", "nearly".', eg: '65 thousand in 2022' },
      { key: 'figB1', label: 'Start Figure B', weight: 1.1, job: 'The figure for group B in the first year.', shape: 'a figure + unit', check: { type: 'figure', cat: 'groupB', at: 'y1' },
        tip: 'Compare it with group A if you can: "well above the Night Market".', eg: '50 thousand' },
      { key: 'figB2', label: 'End Figure B', weight: 1.3, job: 'The figure for group B at the end.', shape: 'a figure + unit (+ year)', check: { type: 'figure', cat: 'groupB', at: 'y2' },
        tip: 'A change in a percentage is "percentage points", not "%".', eg: '30 thousand by 2022' }
    ],
    lines: [
      { id: 't-what', para: 'intro', name: 'What the visual shows', slots: ['visual', 'what'], weight: 1.4, crit: ['TA', 'LR'],
        fn: 'Names the visual and what it measures, in new words (S1).', why: 'The examiner checks that you have read the task. Copied task words are not counted, so paraphrase.',
        tip: 'Use a verb like shows / illustrates / gives information about. Never copy eight words from the task.',
        examples: {
          B1: ['The {visual} shows {what}.', 'This {visual} gives information about {what}.', 'The {visual} presents {what}.'],
          B2: ['The {visual} illustrates {what}.', 'The {visual} provides data on {what}.', 'Information about {what} is presented in the {visual}.'],
          C1: ['The {visual} charts {what}.', 'Shown in the {visual} is {what}.', 'The {visual} tracks {what}.'] } },
      { id: 't-when', para: 'intro', name: 'The time frame', slots: ['y1', 'y2'], weight: 0.8, crit: ['TA'],
        fn: 'Gives the time frame of the data.', why: 'Every TREND report needs its period: it tells the reader which tense comes next.',
        tip: 'from … to … or between … and …: both are correct.',
        examples: {
          B1: ['The data cover the years from {y1} to {y2}.', 'The period is from {y1} to {y2}.', 'It covers the years between {y1} and {y2}.'],
          B2: ['The figures span the period from {y1} to {y2}.', 'The data run from {y1} to {y2}.', 'The time frame is {y1} to {y2}.'],
          C1: ['The period under review runs from {y1} to {y2}.', 'The figures cover a span from {y1} to {y2}.', 'Data are given for {y1} through to {y2}.'] } },
      { id: 't-ov-a', para: 'overview', name: 'Overview: group A', slots: ['groupA', 'moveA'], weight: 0.8, crit: ['TA', 'CC'],
        fn: 'Opens the overview with "Overall," and the main trend of group A (S2).', why: 'The overview is the gate: no overview keeps Task Achievement at Band 5. Trends in words, no figures.',
        tip: 'Start with "Overall,". No numbers here, not even "about 50%".',
        examples: {
          B1: ['Overall, {groupA} {moveA}.', 'Overall, the figures for {groupA} {moveA}.', 'In general, {groupA} {moveA}.'],
          B2: ['Overall, it is clear that {groupA} {moveA}.', 'Overall, {groupA} {moveA} over the period.', 'Overall, the figure for {groupA} {moveA}.'],
          C1: ['Overall, {groupA} {moveA} across the period.', 'It is evident that {groupA} {moveA}.', 'Overall, the most notable trend is that {groupA} {moveA}.'] } },
      { id: 't-ov-b', para: 'overview', name: 'Overview: the contrast', slots: ['groupB', 'moveB'], weight: 0.7, crit: ['TA', 'CC'],
        fn: 'Gives the contrasting trend of group B.', why: 'Main trends AND differences make the overview clear (Band 7 Task Achievement).',
        tip: 'A contrast word helps: whereas, by contrast, however.',
        examples: {
          B1: ['However, {groupB} {moveB}.', 'By contrast, {groupB} {moveB}.', 'On the other hand, {groupB} {moveB}.'],
          B2: ['By contrast, {groupB} {moveB}.', '{groupB}, however, {moveB}.', 'In contrast, {groupB} {moveB}.'],
          C1: ['{groupB}, by contrast, {moveB}.', 'Conversely, {groupB} {moveB}.', 'The opposite was true of {groupB}, which {moveB}.'] } },
      { id: 't-ov-key', para: 'overview', name: 'Overview: the key feature', slots: ['feature'], weight: 0.6, crit: ['TA'],
        fn: 'Adds one more big-picture truth: a crossover, the leader at the end, a projection.', why: 'Two or three general truths make a full overview.',
        tip: 'Still no figures. Names and years are fine.',
        examples: {
          B1: ['Also, {feature}.', 'Another main point is that {feature}.', 'One more main point is that {feature}.'],
          B2: ['It is also noticeable that {feature}.', 'A further key feature is that {feature}.', 'In addition, {feature}.'],
          C1: ['Also striking is that {feature}.', 'Notably, {feature}.', 'What stands out, moreover, is that {feature}.'] } },
      { id: 't-a-start', para: 'groupA', name: 'Group A: the starting point', slots: ['groupA', 'y1', 'figA1'], weight: 1.0, crit: ['TA', 'GRA'],
        fn: 'Opens paragraph 3 with group A and its first figure (S3).', why: 'Every detail sentence carries a figure, a date or a name. Without data the examiner reads an opinion.',
        tip: 'stood at / was at + figure. Two categories? "…stood at 70% and 60% respectively."',
        examples: {
          B1: ['In {y1}, {groupA} was at {figA1}.', 'In {y1}, the figure for {groupA} was {figA1}.', '{groupA} started at {figA1} in {y1}.'],
          B2: ['In {y1}, {groupA} stood at {figA1}.', '{groupA} began the period at {figA1} in {y1}.', 'At the start, in {y1}, {groupA} recorded {figA1}.'],
          C1: ['{groupA} opened the period at {figA1} in {y1}.', 'Starting from {figA1} in {y1}, {groupA} set the pattern.', 'In {y1}, {groupA} registered {figA1}.'] } },
      { id: 't-a-end', para: 'groupA', name: 'Group A: the change', slots: ['moveA', 'figA2'], weight: 1.0, crit: ['TA', 'GRA'],
        fn: 'Says how group A changed and where it ended (S3/S4).', why: 'A figure at the start and at the end shows the size of the change: that is the data the overview promised.',
        tip: 'This is the second time you use [Trend A]: reword it (climbed, increased).',
        examples: {
          B1: ['After that, it {moveA} to {figA2}.', 'Then it {moveA} and reached {figA2}.', 'It {moveA} to {figA2}.'],
          B2: ['It then {moveA}, reaching {figA2}.', 'Over the following years it {moveA}, ending at {figA2}.', 'From there it {moveA} to {figA2}.'],
          C1: ['Thereafter it {moveA}, reaching {figA2}.', 'It subsequently {moveA}, finishing at {figA2}.', 'It went on to {moveA}, peaking at {figA2}.'] } },
      { id: 't-b-start', para: 'groupB', name: 'Group B: the starting point', slots: ['groupB', 'figB1'], weight: 1.0, crit: ['TA', 'CC'],
        fn: 'Opens paragraph 4 with group B and its first figure, compared with group A.', why: 'A comparison word here gives you the second explicit comparison the report needs.',
        tip: 'By contrast / whereas / higher than: one comparison per paragraph.',
        examples: {
          B1: ['By contrast, {groupB} started at {figB1}.', '{groupB} began at {figB1}, which was higher.', 'On the other hand, {groupB} was at {figB1} at first.'],
          B2: ['{groupB}, by contrast, began at {figB1}.', 'In contrast, {groupB} started the period at {figB1}.', 'The figure for {groupB} was initially {figB1}, a different starting point.'],
          C1: ['{groupB}, meanwhile, began at {figB1}.', 'A different picture emerged for {groupB}, which started at {figB1}.', 'By comparison, {groupB} stood at {figB1} at the outset.'] } },
      { id: 't-b-end', para: 'groupB', name: 'Group B: the change', slots: ['moveB', 'figB2'], weight: 1.0, crit: ['TA', 'GRA'],
        fn: 'Says how group B changed and where it ended.', why: 'The end figure lets the reader compare the two groups at the end of the period.',
        tip: 'Second use of [Trend B]: reword it.',
        examples: {
          B1: ['It {moveB} to {figB2}.', 'After that, it {moveB} to {figB2}.', 'Then it {moveB} and finished at {figB2}.'],
          B2: ['It then {moveB}, ending the period at {figB2}.', 'Over the period it {moveB}, finishing at {figB2}.', 'It {moveB}, reaching {figB2}.'],
          C1: ['It subsequently {moveB}, closing at {figB2}.', 'From then on it {moveB}, to finish at {figB2}.', 'It {moveB} thereafter, settling at {figB2}.'] } }
    ],
    classDraft: {
      't-what': 'The [Visual] shows [What It Shows], and it gives the figures for each of the categories in the data.',
      't-when': 'The data cover the whole period from [First Year] to [Last Year].',
      't-ov-a': 'Overall, it is clear that [Group A] [Trend A] over the period as a whole.',
      't-ov-b': 'By contrast, [Group B] [Trend B], so it moved in a different way from the first group.',
      't-ov-key': 'Another important feature of the graph that the reader can notice is that [Key Feature].',
      't-a-start': 'At the start of the period, in [First Year], the figure for [Group A] stood at [Start Figure A].',
      't-a-end': 'After that, it [Trend A] over the following years, and it reached [End Figure A] by the end of the period.',
      't-b-start': 'By contrast, [Group B] moved in the opposite direction, and at the start it stood at [Start Figure B].',
      't-b-end': 'After that, it [Trend B] over the rest of the period, and it finished at [End Figure B].'
    }
  };

  /* -------------------------------------------------------- COMPARE */
  LAB.MODES.COMPARE = {
    id: 'COMPARE', name: 'COMPARE', classId: 'A2', page: 'The Hall of Scales page',
    blurb: 'No time axis, only categories: bar charts, one pie, tables, two visuals about one year.',
    tense: 'Past simple for a past year, present simple when there is no date. No trend verbs (rose, fell): compare instead.',
    grouping: 'Group A = the higher categories (or one group of people); group B = the lower ones. Keep the largest and the smallest for the overview.',
    vars: [
      { key: 'visual', label: 'Visual', weight: 0.4, job: 'The kind of visual.', shape: 'a noun: bar chart · pie chart · table · bar chart and table', check: { type: 'visual' }, tip: 'Two visuals? Name both.', eg: 'bar chart' },
      { key: 'what', label: 'What It Compares', weight: 2.0, job: 'What is compared, for whom, where, when, and the unit.', shape: 'a noun phrase', check: { type: 'what' },
        tip: 'Paraphrase: the percentage of → the proportion of; in 2024 → in the year 2024.', eg: 'the proportion of men and women in Chiang Rai who used five kinds of transport to get to work in 2024' },
      { key: 'top', label: 'Largest', weight: 0.7, job: 'The largest category (the biggest bar, slice or figure).', shape: 'a name from the chart', check: { type: 'label', role: 'top' },
        tip: 'Several series? Choose the category that is largest for most of them.', eg: 'the motorbike' },
      { key: 'bottom', label: 'Smallest', weight: 0.7, job: 'The smallest category.', shape: 'a name from the chart', check: { type: 'label', role: 'bottom' }, tip: 'Read the shortest bar or the smallest slice.', eg: 'the bicycle' },
      { key: 'groupA', label: 'Group A', weight: 0.9, job: 'The categories you describe in paragraph 3 (often the higher ones, or one group of people).', shape: 'names from the chart', check: { type: 'group' }, tip: 'Two or three names.', eg: 'men' },
      { key: 'groupB', label: 'Group B', weight: 0.9, job: 'The categories you describe in paragraph 4.', shape: 'names from the chart', check: { type: 'group' }, tip: 'Every category must appear somewhere in the report.', eg: 'women' },
      { key: 'contrast', label: 'Main Difference', weight: 1.6, job: 'The biggest difference between the groups, in words. No figures.', shape: 'a full clause', check: { type: 'nofig', needsLabel: true },
        tip: 'Use a comparative: higher than, more popular than, far fewer.', eg: 'men used every form of transport more than women, except the bus' },
      { key: 'topFig', label: 'Top Figure', weight: 1.2, job: 'The figure(s) for the largest category.', shape: 'a figure + unit (+ who)', check: { type: 'figure', cat: 'top' },
        tip: 'Two groups? "46% of men and 38% of women".', eg: '46% of men and 38% of women' },
      { key: 'bottomFig', label: 'Bottom Figure', weight: 1.1, job: 'The figure(s) for the smallest category.', shape: 'a figure + unit', check: { type: 'figure', cat: 'bottom' }, tip: 'Small numbers: "just 5%", "only 4%".', eg: '5% and 4% respectively' },
      { key: 'figA', label: 'Figure A', weight: 1.2, job: 'A figure from group A, ideally with a comparison.', shape: 'a figure + unit (+ comparison)', check: { type: 'figure', cat: 'groupA' },
        tip: 'twice as high as · far more than · compared with', eg: '25% for the car, compared with 20% of women' },
      { key: 'figB', label: 'Figure B', weight: 1.2, job: 'A figure from group B.', shape: 'a figure + unit', check: { type: 'figure', cat: 'groupB' }, tip: 'Give the figure, then the comparison.', eg: '20% for the car' },
      { key: 'exception', label: 'Exception', weight: 1.4, job: 'One category that breaks the pattern, named, with its figure.', shape: 'a name + figure', check: { type: 'labelfig' },
        tip: 'Exceptions are key features: the examiner looks for them.', eg: 'the bus, which 27% of women used compared with only 12% of men' }
    ],
    lines: [
      { id: 'c-what', para: 'intro', name: 'What the visual compares', slots: ['visual', 'what'], weight: 1.4, crit: ['TA', 'LR'],
        fn: 'Names the visual and what it compares, in new words (S1).', why: 'Copied task words are not counted, so paraphrase.',
        tip: 'compares / shows / gives a breakdown of.',
        examples: {
          B1: ['The {visual} shows {what}.', 'This {visual} compares {what}.', 'The {visual} gives information about {what}.'],
          B2: ['The {visual} compares {what}.', 'The {visual} illustrates {what}.', 'Data on {what} are given in the {visual}.'],
          C1: ['The {visual} offers a breakdown of {what}.', 'The {visual} sets out {what}.', 'Presented in the {visual} is a comparison of {what}.'] } },
      { id: 'c-ov-ext', para: 'overview', name: 'Overview: largest and smallest', slots: ['top', 'bottom'], weight: 1.0, crit: ['TA'],
        fn: 'Opens the overview with the biggest and the smallest category (S2).', why: 'The largest and smallest are the most common key features of a static chart.',
        tip: 'Start with "Overall,". Superlatives, not numbers.',
        examples: {
          B1: ['Overall, {top} was the largest, while {bottom} was the smallest.', 'Overall, {top} had the highest figure and {bottom} had the lowest.', 'Overall, {top} was the biggest category and {bottom} was the smallest one.'],
          B2: ['Overall, {top} was the most common, whereas {bottom} was the least common.', 'Overall, {top} recorded the highest figures, while {bottom} recorded the lowest.', 'It is clear that {top} was the leading category and {bottom} the smallest.'],
          C1: ['Overall, {top} dominated, while {bottom} accounted for the smallest share.', 'Overall, {top} ranked first by a clear margin, with {bottom} at the bottom of the scale.', 'It is evident that {top} led, whereas {bottom} trailed behind every other category.'] } },
      { id: 'c-ov-diff', para: 'overview', name: 'Overview: the main difference', slots: ['contrast'], weight: 0.6, crit: ['TA', 'CC'],
        fn: 'Gives the main difference between the groups, in words.', why: 'The differences are what a comparison chart is about (Band 7 Task Achievement).',
        tip: 'No figures. Use a comparative.',
        examples: {
          B1: ['Also, {contrast}.', 'In general, {contrast}.', 'Another main point is that {contrast}.'],
          B2: ['In general, {contrast}.', 'It is also clear that {contrast}.', 'Broadly speaking, {contrast}.'],
          C1: ['More broadly, {contrast}.', 'The wider pattern is that {contrast}.', 'Taken as a whole, the data show that {contrast}.'] } },
      { id: 'c-top', para: 'groupA', name: 'Group A: the largest', slots: ['top', 'topFig'], weight: 1.0, crit: ['TA'],
        fn: 'Gives the figure for the largest category (S5).', why: 'The key features need figures in the body: claim + number.',
        tip: 'at + figure, or accounted for + figure.',
        examples: {
          B1: ['{top} was the most popular, at {topFig}.', 'The figure for {top} was {topFig}.', '{top} had {topFig}.'],
          B2: ['{top} was clearly the most common, at {topFig}.', '{top} led the chart with {topFig}.', 'The highest figure was for {top}, at {topFig}.'],
          C1: ['{top} accounted for the largest share, at {topFig}.', 'Leading the chart was {top}, at {topFig}.', '{top} came first, with {topFig}.'] } },
      { id: 'c-a', para: 'groupA', name: 'Group A: one more figure', slots: ['groupA', 'figA'], weight: 1.0, crit: ['TA', 'CC'],
        fn: 'Adds a figure from group A, with a comparison (S5/S6).', why: 'Two explicit comparisons in the report are a must.',
        tip: 'than / compared with / twice as … as.',
        examples: {
          B1: ['For {groupA}, the figure was {figA}.', '{groupA} also had a high figure: {figA}.', 'The number for {groupA} was {figA}.'],
          B2: ['{groupA} also recorded high figures, with {figA}.', 'As for {groupA}, the figure was {figA}.', 'In the case of {groupA}, the figure stood at {figA}.'],
          C1: ['{groupA} followed, with {figA}.', 'Not far behind were {groupA}, at {figA}.', 'Similarly high figures were seen for {groupA}, at {figA}.'] } },
      { id: 'c-bottom', para: 'groupB', name: 'Group B: the smallest', slots: ['bottom', 'bottomFig'], weight: 1.0, crit: ['TA'],
        fn: 'Opens paragraph 4 with the smallest category and its figure.', why: 'Low figures are part of the picture too.',
        tip: 'just / only + figure for a small value.',
        examples: {
          B1: ['{bottom} was the least popular, at {bottomFig}.', 'The lowest figure was for {bottom}: {bottomFig}.', '{bottom} had only {bottomFig}.'],
          B2: ['At the other end of the scale, {bottom} stood at just {bottomFig}.', '{bottom}, by contrast, recorded only {bottomFig}.', 'The lowest figure belonged to {bottom}, at {bottomFig}.'],
          C1: ['{bottom}, meanwhile, registered a mere {bottomFig}.', 'At the opposite end lay {bottom}, at only {bottomFig}.', 'Trailing far behind was {bottom}, with {bottomFig}.'] } },
      { id: 'c-b', para: 'groupB', name: 'Group B: one more figure', slots: ['groupB', 'figB'], weight: 1.0, crit: ['TA', 'CC'],
        fn: 'Adds a figure from group B.', why: 'Every category needs at least one mention.',
        tip: 'lower than / far fewer / compared with.',
        examples: {
          B1: ['{groupB} had lower figures, such as {figB}.', 'For {groupB}, the figure was {figB}.', '{groupB} were lower, at {figB}.'],
          B2: ['{groupB} recorded lower figures, at {figB}.', 'Figures for {groupB} were lower, at {figB}.', 'As for {groupB}, the figure was only {figB}.'],
          C1: ['{groupB} lagged behind, at {figB}.', 'Lower down came {groupB}, with {figB}.', 'Figures for {groupB} were more modest, at {figB}.'] } },
      { id: 'c-exc', para: 'groupB', name: 'The exception', slots: ['exception'], weight: 0.8, crit: ['TA'],
        fn: 'Names the one category that breaks the pattern, with its figure.', why: 'Spotting the exception is "key features skilfully selected" (Band 8 Task Achievement).',
        tip: 'If there is no exception, use this line for the second-largest category.',
        examples: {
          B1: ['One exception was {exception}.', 'There was one exception: {exception}.', 'But {exception} was different.'],
          B2: ['The one exception was {exception}.', 'The pattern was different for {exception}.', 'A clear exception was {exception}.'],
          C1: ['The sole exception was {exception}.', 'Bucking this pattern was {exception}.', 'The only reversal came with {exception}.'] } }
    ],
    classDraft: {
      'c-what': 'The [Visual] compares [What It Compares], and it shows the figures for every one of the categories in the data so that they can be compared.',
      'c-ov-ext': 'Overall, [Largest] was the largest category for both groups, while [Smallest] was clearly the smallest category of all.',
      'c-ov-diff': 'In general, it is clear from the data in the chart that [Main Difference], with one clear exception.',
      'c-top': '[Largest] was clearly the most common choice of all the categories, and it was chosen by [Top Figure].',
      'c-a': 'In the case of [Group A], the figures were also fairly high in comparison with the others, and the figure was [Figure A].',
      'c-bottom': 'At the other end of the scale, [Smallest] was the least common category, at just [Bottom Figure].',
      'c-b': 'The figures for [Group B] were lower than the figures for the first group that was described above, at [Figure B].',
      'c-exc': 'The pattern was not the same in every category, however, and the only exception was [Exception].'
    }
  };

  /* ------------------------------------------------------- SEQUENCE */
  LAB.MODES.SEQUENCE = {
    id: 'SEQUENCE', name: 'SEQUENCE', classId: 'A3', page: 'The Brewing Cellars page',
    blurb: 'A process or a life cycle: stages in order, no figures to compare.',
    tense: 'Present simple. Passive for a man-made process (is collected, are heated); active for a natural cycle (the eggs hatch).',
    grouping: 'Two phases: P3 = the first half of the stages, P4 = the second half. Count the stages before you start.',
    vars: [
      { key: 'visual', label: 'Visual', weight: 0.4, job: 'The kind of visual.', shape: 'a noun: diagram · flow chart', check: { type: 'visual' }, tip: 'Most processes are "diagrams".', eg: 'diagram' },
      { key: 'product', label: 'What It Shows', weight: 1.6, job: 'What the process makes or what the cycle is, in your own words.', shape: 'a noun phrase or a "how" clause', check: { type: 'what' },
        tip: 'how coconut sugar is produced · the life cycle of the frog', eg: 'how coconut sugar is produced from the sap of the coconut palm' },
      { key: 'count', label: 'Number of Stages', weight: 0.3, job: 'How many stages there are.', shape: 'a number word: seven', check: { type: 'count' }, tip: 'Count the boxes or pictures twice.', eg: 'seven' },
      { key: 'shape', label: 'Linear or Cyclical', weight: 0.4, job: 'Whether the process has a clear end (linear) or starts again (cyclical).', shape: 'an adjective: linear · cyclical', check: { type: 'shape' },
        tip: 'An arrow from the last stage back to the first = cyclical.', eg: 'linear' },
      { key: 'start', label: 'Starting Point', weight: 0.8, job: 'The raw material or the first stage.', shape: 'a noun phrase', check: { type: 'stage', role: 'first' }, tip: 'Use the word on the diagram.', eg: 'the collection of sap from coconut flowers' },
      { key: 'end', label: 'End Product', weight: 0.8, job: 'The final product or the last stage.', shape: 'a noun phrase', check: { type: 'stage', role: 'last' }, tip: 'Cyclical? The last stage before it starts again.', eg: 'blocks of sugar packed for the market' },
      { key: 'st1', label: 'Stage 1', weight: 1.2, job: 'The first stage, as your line needs it.', shape: 'a clause (the sap is collected …) or a past participle phrase (collected …)', check: { type: 'stage', slot: 1, of: 6 },
        tip: 'Man-made: passive. Natural: active.', eg: 'the sap is collected from the flowers of the coconut palm' },
      { key: 'st2', label: 'Stage 2', weight: 1.2, job: 'The next stage.', shape: 'a clause or a participle phrase', check: { type: 'stage', slot: 2, of: 6 }, tip: 'Name the equipment if the diagram shows it.', eg: 'it is filtered through a cloth to remove any dirt' },
      { key: 'st3', label: 'Stage 3', weight: 1.2, job: 'The stage that ends the first phase.', shape: 'a clause or a participle phrase', check: { type: 'stage', slot: 3, of: 6 }, tip: 'More stages than slots? Join two in one clause with "and".', eg: 'it is boiled in a large pan and stirred until it becomes thick' },
      { key: 'mid', label: 'Middle Point', weight: 0.7, job: 'What the material is called halfway, or the stage that opens the second phase.', shape: 'a noun phrase', check: { type: 'stage', role: 'mid' }, tip: 'the thick syrup · the tadpole', eg: 'the thick syrup' },
      { key: 'st4', label: 'Stage 4', weight: 1.2, job: 'The first stage of the second phase.', shape: 'a verb phrase that follows [Middle Point]: is poured into moulds', check: { type: 'stage', slot: 4, of: 6 }, tip: 'Check that it joins [Middle Point] into one sentence.', eg: 'is poured into small round moulds' },
      { key: 'st5', label: 'Stage 5', weight: 1.2, job: 'The next stage.', shape: 'a clause or a participle phrase', check: { type: 'stage', slot: 5, of: 6 }, tip: 'Use a sequencer in your frame: following this, once…', eg: 'the syrup is left to cool and harden' },
      { key: 'st6', label: 'Stage 6', weight: 1.2, job: 'The last stage.', shape: 'a clause or a participle phrase', check: { type: 'stage', slot: 6, of: 6 }, tip: 'Cyclical? Say that the cycle begins again.', eg: 'the blocks of sugar are packed and taken to local markets' }
    ],
    lines: [
      { id: 's-what', para: 'intro', name: 'What the diagram shows', slots: ['visual', 'product'], weight: 1.4, crit: ['TA', 'LR'],
        fn: 'Names the diagram and the process (S1).', why: 'Paraphrase the task: copied words are not counted.',
        tip: 'illustrates how … is made · shows the stages in …',
        examples: {
          B1: ['The {visual} shows {product}.', 'This {visual} explains {product}.', 'The {visual} is about {product}.'],
          B2: ['The {visual} illustrates {product}.', 'The {visual} sets out the stages of {product}.', 'The {visual} explains {product}.'],
          C1: ['The {visual} outlines {product}.', 'Depicted in the {visual} is {product}.', 'The {visual} traces {product}.'] } },
      { id: 's-ov-count', para: 'overview', name: 'Overview: stages and shape', slots: ['count', 'shape'], weight: 1.0, crit: ['TA'],
        fn: 'Opens the overview with the number of stages and the kind of process.', why: 'Counting the stages and naming the shape is the big picture of a process.',
        tip: 'Start with "Overall,".',
        examples: {
          B1: ['Overall, there are {count} stages and the process is {shape}.', 'Overall, the process has {count} main stages and it is {shape}.', 'Overall, it is a {shape} process with {count} stages.'],
          B2: ['Overall, the process is {shape} and consists of {count} distinct stages.', 'Overall, this is a {shape} process made up of {count} main stages.', 'It is clear that the process is {shape}, with {count} stages in total.'],
          C1: ['Overall, the process is {shape}, comprising {count} distinct stages.', 'Overall, what is shown is a {shape} sequence of {count} stages.', 'It is evident that this {shape} process unfolds in {count} stages.'] } },
      { id: 's-ov-ends', para: 'overview', name: 'Overview: start and end', slots: ['start', 'end'], weight: 0.8, crit: ['TA'],
        fn: 'Names the start and the end of the process.', why: 'The raw material and the end product complete the big picture.',
        tip: 'begins with … and ends with …',
        examples: {
          B1: ['It begins with {start} and ends with {end}.', 'The first stage is {start} and the last is {end}.', 'It starts with {start} and finishes with {end}.'],
          B2: ['It begins with {start} and ends with {end}.', 'The process starts with {start} and finishes with {end}.', 'It moves from {start} to {end}.'],
          C1: ['It runs from {start} through to {end}.', 'Beginning with {start}, it culminates in {end}.', 'It opens with {start} and concludes with {end}.'] } },
      { id: 's-1', para: 'groupA', name: 'Stage 1', slots: ['st1'], weight: 0.7, crit: ['CC', 'GRA'],
        fn: 'The first stage, with a sequencer (S7).', why: 'Sequencers let the reader follow the order (Coherence and Cohesion).',
        tip: 'At the first stage / First, …',
        examples: {
          B1: ['First, {st1}.', 'At the beginning, {st1}.', 'In the first step, {st1}.'],
          B2: ['At the first stage, {st1}.', 'The process begins when {st1}.', 'To begin with, {st1}.'],
          C1: ['In the initial stage, {st1}.', 'The sequence opens as {st1}.', 'At the outset, {st1}.'] } },
      { id: 's-2', para: 'groupA', name: 'Stage 2', slots: ['st2'], weight: 0.6, crit: ['CC', 'GRA'],
        fn: 'The next stage, with a sequencer.', why: 'A different sequencer each time avoids a mechanical list.',
        tip: 'Next / After that / Once …',
        examples: {
          B1: ['Next, {st2}.', 'After that, {st2}.', 'Then, {st2}.'],
          B2: ['Next, {st2}.', 'Following this, {st2}.', 'After this, {st2}.'],
          C1: ['Subsequently, {st2}.', 'This is followed by a stage in which {st2}.', 'Once this is done, {st2}.'] } },
      { id: 's-3', para: 'groupA', name: 'Stage 3', slots: ['st3'], weight: 0.6, crit: ['CC', 'GRA'],
        fn: 'The stage that ends the first phase.', why: 'Grouping the stages into two phases earns both TA and CC.',
        tip: 'After that / At the third stage …',
        examples: {
          B1: ['After that, {st3}.', 'Then, {st3}.', 'In the third step, {st3}.'],
          B2: ['After this, {st3}.', 'At the third stage, {st3}.', 'The first phase ends when {st3}.'],
          C1: ['The first phase closes as {st3}.', 'Thereafter, {st3}.', 'This phase concludes when {st3}.'] } },
      { id: 's-4', para: 'groupB', name: 'Middle point and stage 4', slots: ['mid', 'st4'], weight: 1.0, crit: ['CC', 'GRA'],
        fn: 'Opens the second phase with the material (or creature) at that point.', why: 'Naming the material again keeps the reader on track: reference and substitution.',
        tip: '[Middle Point] is the subject; [Stage 4] is its verb phrase.',
        examples: {
          B1: ['In the second part, {mid} {st4}.', 'Then {mid} {st4}.', 'Next, {mid} {st4}.'],
          B2: ['In the second phase, {mid} {st4}.', 'Once ready, {mid} {st4}.', 'Moving to the second phase, {mid} {st4}.'],
          C1: ['In the second phase, {mid} {st4}.', 'At this point, {mid} {st4}.', 'The second phase begins as {mid} {st4}.'] } },
      { id: 's-5', para: 'groupB', name: 'Stage 5', slots: ['st5'], weight: 0.6, crit: ['CC', 'GRA'],
        fn: 'The next stage of the second phase.', why: 'A sequencer per stage keeps the order clear.',
        tip: 'Following this / Subsequently …',
        examples: {
          B1: ['After this, {st5}.', 'Then, {st5}.', 'Next, {st5}.'],
          B2: ['Following this, {st5}.', 'Subsequently, {st5}.', 'At the next stage, {st5}.'],
          C1: ['This is followed by a stage in which {st5}.', 'Thereafter, {st5}.', 'In the penultimate stage, {st5}.'] } },
      { id: 's-6', para: 'groupB', name: 'The final stage', slots: ['st6'], weight: 0.7, crit: ['CC', 'GRA'],
        fn: 'The last stage, which closes the process.', why: 'A clear ending shows the whole process is covered: no stage missing.',
        tip: 'Finally / In the final stage …',
        examples: {
          B1: ['Finally, {st6}.', 'At the end, {st6}.', 'In the last step, {st6}.'],
          B2: ['Finally, {st6}.', 'In the final stage, {st6}.', 'The process ends when {st6}.'],
          C1: ['In the final stage, {st6}.', 'The sequence is completed when {st6}.', 'Lastly, {st6}.'] } }
    ],
    classDraft: {
      's-what': 'The [Visual] illustrates the whole process of [What It Shows], step by step, from the very first stage to the very last stage of the process.',
      's-ov-count': 'Overall, the process consists of [Number of Stages] main stages, and it is a [Linear or Cyclical] process.',
      's-ov-ends': 'It begins with [Starting Point] and it ends with [End Product], and it can be divided into two main phases: an early phase in which the material is prepared, and a later phase in which the product is finished.',
      's-1': 'At the first stage of the early phase of the process, which is where everything begins, [Stage 1].',
      's-2': 'Next, at the second stage of the early phase of the process, [Stage 2].',
      's-3': 'After this, at the third stage of the process, [Stage 3].',
      's-4': 'Moving on to the second phase of the whole process, [Middle Point] [Stage 4].',
      's-5': 'Subsequently, at the next stage of the later phase of the process, [Stage 5].',
      's-6': 'At the final stage, which is the stage that completes the whole process, [Stage 6].'
    }
  };

  /* ---------------------------------------------------------- SPACE */
  LAB.MODES.SPACE = {
    id: 'SPACE', name: 'SPACE', classId: 'A4', page: 'The Map Room page',
    blurb: 'Two maps or plans of one place: what was removed, added, extended, converted or kept.',
    tense: 'Two past maps: past simple or present perfect passive (was built, has been converted). A plan: future passive (will be built).',
    grouping: 'P3 = the biggest changes (removed and new); P4 = the other changes (extended, converted) and what stayed.',
    vars: [
      { key: 'place', label: 'Place', weight: 1.6, job: 'The area the maps show, in your own words.', shape: 'a noun phrase', check: { type: 'what' }, tip: 'the seaside village of … · a school campus', eg: 'the seaside village of Ban Khlong' },
      { key: 'y1', label: 'First Map', weight: 0.4, job: 'When the first map is from, as a time phrase.', shape: 'in 1995 · at present', check: { type: 'panel', role: 'first' }, tip: 'Read the title of the first map.', eg: 'in 1995' },
      { key: 'y2', label: 'Second Map', weight: 0.4, job: 'When the second map is from.', shape: 'in 2020 · after the planned changes', check: { type: 'panel', role: 'last' }, tip: 'A plan? Then the changes have not happened yet.', eg: 'in 2020' },
      { key: 'change', label: 'Overall Change', weight: 1.6, job: 'The character of the whole change, in words.', shape: 'a verb phrase: became far more built-up · was turned from a fishing village into a resort', check: { type: 'nofig' },
        tip: 'Past maps: past simple. A plan: "will become".', eg: 'changed from a small fishing village into a busy tourist resort' },
      { key: 'same', label: 'Unchanged Feature', weight: 0.7, job: 'One feature that stayed the same, in the same place.', shape: 'a map label', check: { type: 'feature', role: 'same' }, tip: 'Look for a label on both maps in the same spot.', eg: 'the temple in the centre' },
      { key: 'gone', label: 'Removed Feature', weight: 0.7, job: 'A feature that was knocked down or removed.', shape: 'a map label', check: { type: 'feature', role: 'gone' }, tip: 'It is on the first map but not on the second.', eg: 'a row of fishing huts' },
      { key: 'where1', label: 'Location 1', weight: 0.6, job: 'Where the removed feature was.', shape: 'a compass point (+ landmark)', check: { type: 'compass', of: 'gone', panel: 'first' }, tip: 'Use the compass: north is at the top.', eg: 'south, along the beach' },
      { key: 'newA', label: 'New Feature A', weight: 0.7, job: 'What was built in its place, or the biggest new feature.', shape: 'a map label', check: { type: 'feature', role: 'new' }, tip: 'It is only on the second map.', eg: 'a large hotel' },
      { key: 'newB', label: 'New Feature B', weight: 0.7, job: 'Another new feature.', shape: 'a map label', check: { type: 'feature', role: 'new' }, tip: 'Choose a different area of the map.', eg: 'a car park' },
      { key: 'where2', label: 'Location 2', weight: 0.6, job: 'Where [New Feature B] is.', shape: 'a compass point (+ landmark)', check: { type: 'compass', of: 'newB', panel: 'last' }, tip: 'north of the village · in the south-east corner', eg: 'north of the village' },
      { key: 'extended', label: 'Extended Feature', weight: 1.5, job: 'A feature that grew, shrank or moved, as a full clause.', shape: 'a clause with a passive verb: the main road was extended to the east', check: { type: 'clause' },
        tip: 'Check whether it got bigger or smaller.', eg: 'the main road was extended east as far as the river' },
      { key: 'converted', label: 'Converted Feature', weight: 0.7, job: 'A feature that was given a new use.', shape: 'a map label from the first map', check: { type: 'feature', role: 'old' }, tip: 'Same place, new name on the second map.', eg: 'the rice fields in the west' },
      { key: 'into', label: 'New Use', weight: 0.7, job: 'What [Converted Feature] became.', shape: 'a map label from the second map', check: { type: 'feature', role: 'new' }, tip: 'converted into · turned into · replaced by', eg: 'a housing estate' }
    ],
    lines: [
      { id: 'm-what', para: 'intro', name: 'What the maps show', slots: ['place', 'y1', 'y2'], weight: 1.4, crit: ['TA', 'LR'],
        fn: 'Names the place and the two times (S1).', why: 'The reader needs to know the place and the two dates before any change.',
        tip: 'The time slots carry their own preposition: "in 1995", "at present".',
        examples: {
          B1: ['The maps show {place} {y1} and {y2}.', 'These two maps show {place} {y1} and {y2}.', 'The two maps compare {place} {y1} and {y2}.'],
          B2: ['The maps illustrate the changes to {place} between its layout {y1} and {y2}.', 'The two maps compare {place} {y1} and {y2}.', 'The maps show how {place} looked {y1} and {y2}.'],
          C1: ['The maps chart the development of {place}, as it was {y1} and {y2}.', 'Shown in the two maps is {place}, {y1} and {y2}.', 'The maps contrast the layout of {place} {y1} with that {y2}.'] } },
      { id: 'm-ov-change', para: 'overview', name: 'Overview: the main change', slots: ['change'], weight: 1.0, crit: ['TA'],
        fn: 'Opens the overview with the character of the change (S2).', why: 'The overall change is the big picture of a map.',
        tip: 'Start with "Overall,". No figures, no details yet.',
        examples: {
          B1: ['Overall, the area {change}.', 'Overall, the place {change}.', 'In general, the area {change}.'],
          B2: ['Overall, the area {change}.', 'Overall, it is clear that the area {change}.', 'It is clear that the area {change}.'],
          C1: ['Overall, the area {change}.', 'It is evident that the area {change}.', 'Overall, the most striking development is that the area {change}.'] } },
      { id: 'm-ov-same', para: 'overview', name: 'Overview: what stayed', slots: ['same'], weight: 0.7, crit: ['TA'],
        fn: 'Names what did not change.', why: 'What stayed the same is a key feature too.',
        tip: 'Plan maps: "will remain".',
        examples: {
          B1: ['But {same} stayed the same.', 'Only {same} did not change.', 'However, {same} was not changed.'],
          B2: ['However, {same} remained unchanged.', '{same}, however, stayed as it was.', 'The only feature left untouched was {same}.'],
          C1: ['{same}, by contrast, was left intact.', 'Only {same} remained untouched.', 'The one constant was {same}.'] } },
      { id: 'm-gone', para: 'groupA', name: 'What was removed, and where', slots: ['where1', 'gone'], weight: 0.9, crit: ['TA', 'GRA'],
        fn: 'Opens paragraph 3 with the biggest removal and its place (S8).', why: 'Compass points + passive change verbs are the language of maps.',
        tip: 'was demolished / was knocked down / was removed.',
        examples: {
          B1: ['In the {where1}, {gone} was knocked down.', 'In the {where1}, {gone} was removed.', '{gone} in the {where1} was knocked down.'],
          B2: ['In the {where1}, {gone} was demolished.', 'The biggest change was in the {where1}, where {gone} was demolished.', '{gone} in the {where1} was cleared away.'],
          C1: ['In the {where1}, {gone} was demolished.', 'The most significant change came in the {where1}, where {gone} was removed.', 'Gone from the {where1} was {gone}.'] } },
      { id: 'm-newA', para: 'groupA', name: 'What replaced it', slots: ['newA'], weight: 0.6, crit: ['TA', 'GRA'],
        fn: 'Says what was built in its place.', why: 'Linking the removal to the replacement is reference and substitution: "in its place".',
        tip: 'in its place / on the same site.',
        examples: {
          B1: ['{newA} was built there.', '{newA} was built in its place.', '{newA} took its place.'],
          B2: ['{newA} was built in its place.', 'It was replaced by {newA}.', 'On the same site, {newA} was constructed.'],
          C1: ['Its place was taken by {newA}.', 'It made way for {newA}.', 'Its site was taken over by {newA}.'] } },
      { id: 'm-newB', para: 'groupA', name: 'Another new feature', slots: ['newB', 'where2'], weight: 0.8, crit: ['TA', 'GRA'],
        fn: 'Adds a second new feature with its place.', why: 'Every area of the map should be covered.',
        tip: 'was built / was added / was constructed + in the north …',
        examples: {
          B1: ['{newB} was also built in the {where2}.', '{newB} was added in the {where2}.', 'There was also {newB} in the {where2}.'],
          B2: ['In addition, {newB} was built in the {where2}.', '{newB} was also added, in the {where2}.', 'A further addition was {newB} in the {where2}.'],
          C1: ['{newB} was added in the {where2}.', 'Elsewhere, {newB} appeared in the {where2}.', 'The {where2} gained {newB}.'] } },
      { id: 'm-ext', para: 'groupB', name: 'What grew or shrank', slots: ['extended'], weight: 0.6, crit: ['TA', 'GRA'],
        fn: 'Opens paragraph 4 with a feature that was extended, reduced or moved.', why: 'Changes of size are often missed: they are key features.',
        tip: 'Your [Extended Feature] is a full clause.',
        examples: {
          B1: ['Also, {extended}.', 'Another change is that {extended}.', 'In another part of the map, {extended}.'],
          B2: ['Elsewhere, {extended}.', 'In addition, {extended}.', 'Another notable change was that {extended}.'],
          C1: ['Elsewhere, {extended}.', 'Further changes saw that {extended}.', 'Beyond this, {extended}.'] } },
      { id: 'm-conv', para: 'groupB', name: 'What changed its use', slots: ['converted', 'into'], weight: 0.9, crit: ['TA', 'GRA'],
        fn: 'Says which feature was converted, and into what (S8).', why: 'converted into / turned into is precise map vocabulary (Lexical Resource).',
        tip: 'was converted into / was turned into.',
        examples: {
          B1: ['{converted} was changed into {into}.', '{converted} became {into}.', '{converted} was turned into {into}.'],
          B2: ['Furthermore, {converted} was converted into {into}.', '{converted} was turned into {into}.', '{converted}, meanwhile, made way for {into}.'],
          C1: ['{converted} was converted into {into}.', '{converted} gave way to {into}.', 'Meanwhile, {converted} was redeveloped as {into}.'] } }
    ],
    classDraft: {
      'm-what': 'The two maps show [Place] [First Map] and [Second Map], and the changes that took place over this period.',
      'm-ov-change': 'Overall, the area [Overall Change], and several features were removed or replaced while new ones were built.',
      'm-ov-same': 'Despite all of these developments, however, [Unchanged Feature] remained unchanged in the same place on both of the maps.',
      'm-gone': 'The most significant change was in the [Location 1], where [Removed Feature] was demolished.',
      'm-newA': 'In its place, on the same site, [New Feature A] was built.',
      'm-newB': 'In addition, [New Feature B] was built in the [Location 2], on land that had been empty before.',
      'm-ext': 'Elsewhere on the map, there was one more important change, which was that [Extended Feature].',
      'm-conv': 'Furthermore, in another part of the area, [Converted Feature] was converted into [New Use].'
    }
  };

  /* Slot labels and aliases per mode ([Visual] → {visual}). */
  LAB.MODE_ORDER.forEach(function (m) {
    var M = LAB.MODES[m];
    M.SLOT_LABEL = {}; M.SLOT_ALIASES = {}; M.VAR = {};
    M.vars.forEach(function (v, i) {
      v.order = i + 1;
      M.SLOT_LABEL[v.key] = v.label; M.VAR[v.key] = v;
      M.SLOT_ALIASES[v.label.toLowerCase()] = v.key;
      M.SLOT_ALIASES[v.key.toLowerCase()] = v.key;
      var short = v.label.toLowerCase().replace(/^the /, '');
      M.SLOT_ALIASES[short] = v.key;
    });
    M.lines.forEach(function (c, i) { c.n = i + 1; });
  });
  /* A few extra spellings students type inside the brackets. */
  LAB.MODES.TREND.SLOT_ALIASES['visual type'] = 'visual'; LAB.MODES.TREND.SLOT_ALIASES['year 1'] = 'y1'; LAB.MODES.TREND.SLOT_ALIASES['year 2'] = 'y2';
  LAB.MODES.TREND.SLOT_ALIASES['trend a'] = 'moveA'; LAB.MODES.TREND.SLOT_ALIASES['trend b'] = 'moveB';
  LAB.MODES.COMPARE.SLOT_ALIASES['largest category'] = 'top'; LAB.MODES.COMPARE.SLOT_ALIASES['smallest category'] = 'bottom';
  LAB.MODES.SEQUENCE.SLOT_ALIASES['stages'] = 'count'; LAB.MODES.SEQUENCE.SLOT_ALIASES['raw material'] = 'start'; LAB.MODES.SEQUENCE.SLOT_ALIASES['final product'] = 'end';
  LAB.MODES.SPACE.SLOT_ALIASES['first year'] = 'y1'; LAB.MODES.SPACE.SLOT_ALIASES['second year'] = 'y2';

  /* ------------------------------------------------------------- timing */
  LAB.TIMINGS = [
    { id: 'none', name: 'No time limit', blurb: 'Take as long as you need. Up to three checks per variable.' },
    { id: '20', name: '20 minutes total', blurb: 'The real Task 1 time for the whole report. Finish in time for +30.' },
    { id: '1min', name: '1 minute per variable', blurb: 'One try each; the card checks itself at 0:00. Time left earns a speed bonus.' }
  ];

  /* ------------------------------------------------------------- points */
  LAB.POINTS = {
    submit: 5, functionMet: 10, functionPartly: 5, errorFree: 10, oneError: 4, budget: 5, ownWords: 5, level: 5,
    dataOk: 10, dataNear: 4, reworded: 3, speedPer10s: 1, speedMax: 5,
    onTime20: 30, complete: 20, wardsClean: 15, bandMultiplier: 10, beatBest: 25,
    lineMax: 40, blueprint: 50, revisionComplete: 10, revisionBandPerHalf: 20
  };

  /* -------------------------------------------------------------- ranks */
  LAB.RANKS = [
    { min: 0, name: 'Apprentice Chartwright' },
    { min: 300, name: 'Chartwright' },
    { min: 900, name: 'Spellwright' },
    { min: 2000, name: 'Enchanter' },
    { min: 4000, name: 'Master Chartwright' }
  ];

  /* -------------------------------------------------- keepsakes (awards)
     Added to CONTENT.BADGES by lab.js; each carries its own test on the
     progress object's `lab` summary (engine: BADGES[i].test).           */
  function lab(p) { return (p && p.lab) || {}; }
  LAB.BADGES = [
    { id: 'lab-first', name: 'First Page', perk: 'A spellbook page in your own words.', how: 'Save your first complete spellbook page in the Spellbook Workshop.',
      test: function (p) { return (lab(p).templatesComplete || 0) >= 1; } },
    { id: 'lab-four', name: 'Four Pages', perk: 'TREND, COMPARE, SEQUENCE, SPACE: a page for each.', how: 'Save a complete page for each of the four modes.',
      test: function (p) { var m = lab(p).modesDesigned || {}; return !!(m.TREND && m.COMPARE && m.SEQUENCE && m.SPACE); } },
    { id: 'lab-true', name: 'True to the Chart', perk: 'Every figure, year and name matched the data.', how: 'Cast a page on a chart with every data check green.',
      test: function (p) { return (lab(p).perfectCasts || 0) >= 1; } },
    { id: 'lab-wards', name: 'Clean Wards', perk: 'No red rows on the Ten Wards.', how: 'Cast a page into a report with no red rows on the Ten Wards.',
      test: function (p) { return (lab(p).cleanCasts || 0) >= 1; } },
    { id: 'lab-lean', name: 'Lean Page', perk: 'Seven words in ten are yours.', how: 'Cast a 30% page on a chart with every variable filled.',
      test: function (p) { return ((lab(p).fullPcts || {})['30'] || 0) >= 1; } },
    { id: 'lab-clock', name: 'Beat the Clock', perk: 'One minute a variable, no timeouts.', how: 'Finish a 1-minute-per-variable cast without a card timing out.',
      test: function (p) { return (lab(p).clockClean || 0) >= 1; } },
    { id: 'lab-beat', name: 'Beat Your Best', perk: 'Your own record, broken.', how: 'Beat your best band at the same share.',
      test: function (p) { return (lab(p).beatBest || 0) >= 1; } }
  ];

  /* ------------------------------------------------- offline quick checks
     The register rules of a Task 1 report (as the Ten Wards in writer.js). */
  LAB.REGISTER = [
    { re: /\b(i think|in my opinion|i believe|personally|we can see|as we can see|you can see|as you can see|it is obvious that)\b/i, msg: 'Personal or informal phrase: keep a report impersonal (no I / we / you).' },
    { re: /\b(i|we|you|my|our|your)\b/i, msg: 'No I / we / you in a report.' },
    { re: /\b(because|due to the fact|the reason|this is because)\b/i, msg: 'A reason. A report says what the chart shows, never why.' },
    { re: /\b(in conclusion|to conclude|to sum up|in summary|all in all)\b/i, msg: 'A conclusion. Task 1 has no conclusion: the overview does the summing up.' },
    { re: /\b(surprisingly|unfortunately|sadly|luckily|interestingly|good|bad|shocking|amazing|should|must)\b/i, msg: 'An opinion or judgement word. A report gives facts only.' },
    { re: /!/, msg: 'No exclamation marks in a report.' }
  ];
  LAB.CLICHE = [/\bnowadays\b/i, /\bin this modern (era|world)\b/i, /\bas (is )?shown (clearly )?in the (graph|chart) above\b/i, /\bthe given (graph|chart|diagram)\b/i];
  /* Common misspellings in Thai students' Task 1 reports. The AI coach does
     the real proofreading; this list only runs when it is offline.        */
  LAB.MISSPELL = {
    accomodate: 'accommodate', acheive: 'achieve', approximatly: 'approximately', aproximately: 'approximately', arround: 'around', begining: 'beginning',
    catagory: 'category', catagories: 'categories', comparision: 'comparison', comparation: 'comparison', consumtion: 'consumption', countrys: 'countries',
    decresed: 'decreased', decreace: 'decrease', diffrent: 'different', dramaticaly: 'dramatically', enviroment: 'environment', fluctated: 'fluctuated',
    fluctuatted: 'fluctuated', goverment: 'government', gradualy: 'gradually', higest: 'highest', increace: 'increase', increse: 'increase', increesed: 'increased',
    infomation: 'information', lenght: 'length', millon: 'million', milion: 'million', noticable: 'noticeable', occured: 'occurred', perid: 'period',
    peroid: 'period', persentage: 'percentage', porportion: 'proportion', propotion: 'proportion', proccess: 'process', recieve: 'receive', recieved: 'received',
    respectivly: 'respectively', respectivelly: 'respectively', seperate: 'separate', signifcant: 'significant', significent: 'significant', similiar: 'similar',
    slighly: 'slightly', steadly: 'steadily', sucessful: 'successful', teh: 'the', thousend: 'thousand', througout: 'throughout', untill: 'until', wich: 'which',
    tempurature: 'temperature', visiter: 'visitor', visiters: 'visitors', pecentage: 'percentage', procent: 'per cent', fourty: 'forty', ninty: 'ninety'
  };
  LAB.UNCOUNTABLE = { informations: 'information', equipments: 'equipment', researches: 'research', evidences: 'evidence', advices: 'advice', traffics: 'traffic', datas: 'data' };

  /* Fixed formula for template-share arithmetic. */
  LAB.modeOf = function (id) { return LAB.MODES[id] || null; };

  global.LabContent = LAB;
})(window);
