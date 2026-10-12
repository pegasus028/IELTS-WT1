/* ===========================================================================
   QUILLMOOR ACADEMY · THE OBSERVATORY — partners.js  (IELTS Writing Task 1)
   T.Chris's grammar and vocabulary apps that the Observatory points to, shown
   to students as "Elective classes". The app names are the real names of the
   sites they open, so they are not re-themed.
   Edit this file to change a link or what an app is used for; no code change
   is needed. `tags` are REMEDIATION tags (content.js): when a student's
   Mending Room holds one of them, the app offers the partner next to it.
   C.LADDER is the band ladder shown in the Map Room.
   =========================================================================== */
(function (global) {
  'use strict';
  var C = global.CONTENT = global.CONTENT || {};

  C.PARTNERS = [
    { id: 'comparatives', name: 'Departure Board', topic: 'Comparatives and superlatives', format: 'Self-study',
      url: 'https://pegasus028.github.io/Comp-Superlatives/',
      use: 'The COMPARE toolkit: "far higher than", "twice as many as", "the largest share", "respectively".',
      tags: ['ta-no-comparison', 'lr-compare-vocab', 'lr-degree', 'lr-proportion'] },
    { id: 'tenses', name: 'Postcards & Plans', topic: 'Tenses', format: 'Self-study',
      url: 'https://pegasus028.github.io/TensesPortal/',
      use: 'Tense by mode: past simple for past dates, present perfect when the data runs to now, "is projected to" for forecasts.',
      tags: ['gra-tense', 'gra-agreement', 'gra-pattern'] },
    { id: 'passive', name: 'Voice Control', topic: 'Passive voice', format: 'Self-study',
      url: 'https://pegasus028.github.io/Passive-Voice/',
      use: 'Processes and maps: "the leaves are dried", "a car park was built", "the school has been extended".',
      tags: ['gra-passive', 'lr-process-vocab', 'lr-map-vocab', 'cc-sequencers'] },
    { id: 'nominal', name: 'Nominalization Arena', topic: 'Nominalisation', format: 'Game',
      url: 'https://pegasus028.github.io/Nominalization/',
      use: 'From "sales rose sharply" to "a sharp rise in sales": the noun phrases behind S4 and Band 8 density.',
      tags: ['gra-complex', 'lr-trend-vocab', 'lr-collocation'] }
  ];

  /* The band ladder for Task 1 (Map Room). Gates follow the May 2023 public
     descriptors read as a ladder (ielts-writing-task-1 skill, §4); CEFR as
     ielts.org aligns it: 4–5 ≈ B1, 5.5–6.5 ≈ B2, 7–8 ≈ C1, 8.5+ ≈ C2.
     A half band is an average of the four criteria (7.5 = e.g. TA 8, CC 7, LR 8, GRA 7). */
  C.LADDER = [
    { band: '5', cefr: 'B1', gate: 'Details are reported but there is no overview, or the data is listed year by year; few comparisons.', lang: 'Articles, plurals, number vs amount, past simple with past dates.', apps: ['tenses'] },
    { band: '5.5–6', cefr: 'B2', gate: '"A relevant overview is attempted"; most body sentences carry a figure; four paragraphs; a mix of simple and complex sentences.', lang: 'S1–S5 drilled to zero errors; prepositions with figures (to / by / from…to / at).', apps: ['tenses', 'comparatives'] },
    { band: '6.5', cefr: 'B2', gate: 'The overview names the main trends correctly, the data is grouped into two, and error-free sentences start to appear.', lang: 'Comparatives and multiples, passive for processes and maps, "respectively".', apps: ['comparatives', 'passive'] },
    { band: '7', cefr: 'C1', gate: '"A clear overview … main trends or differences are identified"; "the data are appropriately categorised"; "error-free sentences are frequent".', lang: 'S6–S8; reference and substitution ("the latter", "this figure") instead of repeating nouns.', apps: ['comparatives', 'passive'] },
    { band: '7.5', cefr: 'C1', gate: 'An average of the four criteria, for example two at Band 8 and two at Band 7 (one 8 and three 7s also rounds to 7.5). Key features chosen, nothing missing, every figure accurate.', lang: 'One 7→8 add-on per paragraph: a relative clause, a participle clause, "with + noun + -ing", a fronted time phrase.', apps: ['nominal', 'comparatives'] },
    { band: '8', cefr: 'C1', gate: '"Key features skilfully selected and illustrated"; "followed with ease"; "the majority of sentences are error-free".', lang: 'Precision over rarity: the right trend verb and degree adverb, accurate approximations.', apps: ['nominal'] },
    { band: '8.5–9', cefr: 'C2', gate: 'Fully satisfies the task; cohesion the reader does not notice; rare, slip-like errors.', lang: 'Wide, natural, precise English built over years of reading and writing.', apps: [] }
  ];

  C.partnerFor = function (tag) {
    return (C.PARTNERS || []).filter(function (p) { return p.tags.indexOf(tag) >= 0; });
  };
  C.partner = function (id) { return (C.PARTNERS || []).filter(function (p) { return p.id === id; })[0] || null; };
})(typeof window !== 'undefined' ? window : this);
