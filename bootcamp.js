/* ===========================================================================
   QUILLMOOR ACADEMY · THE OBSERVATORY (Chart Control) — bootcamp.js
   The Duelling Hall (was Bootcamp). A guided duel: the whole four-paragraph plan applied to one prompt, step by
   step, thinking first and writing second. Every question is a drop-down
   with four or more options. Points: 10 for a clean first choice, 6 for a
   correct second choice (WP14, 20 Oct 2026: two tries on everything = 60%),
   minus 3 if the hint was consulted. A duel is WON at 70%; a duel COMPLETED
   (every question answered) at 50% or more counts for the story's first-duel
   mission and the Duelling Champion badge (onDone passes `completed` and the
   percentage; student.js stores m.completed and m.best). Bootcamp rank rises
   with cumulative points.

   Bootcamp.build(prompt)  → { steps:[{ id, title, brief, questions:[{ id, stem, options, answer, hint, why, tag }] }] }
   Bootcamp.mount(host, { prompt, progress, onDone, onQuit, onAnswer })
   Bootcamp.RANKS, Bootcamp.CHECKLIST
   =========================================================================== */
(function (global) {
  'use strict';
  var C = global.CONTENT;

  var CHECKLIST = [
    'Four paragraphs, and the overview begins "Overall,"',
    'The overview is general: no figures, 2–3 true statements',
    'Every body sentence has a number, a date or a label',
    'At least two explicit comparisons (than / as … as / whereas / respectively); a process: three sequencers',
    'Tense matches the dates (past for past years, present for a process)',
    '"Number of" for countable, "amount of" for uncountable; plural -s in place',
    'Prepositions with figures: to / by / from … to / at',
    'No opinion, no reason, no conclusion, no "I", no contractions, no exclamation marks',
    'Rubric not copied word for word; every category or stage mentioned',
    '150–190 words'
  ];
  var RANKS = [
    { min: 0, name: 'Novice' }, { min: 100, name: 'Apprentice' }, { min: 250, name: 'Duellist' },
    { min: 450, name: 'Adept' }, { min: 700, name: 'Master Duellist' }, { min: 1000, name: 'Champion' }
  ];
  var POINTS = { first: 10, second: 6, hint: 3, pass: 0.7, complete: 0.5 };

  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function lc(s) { s = String(s || ''); return s.charAt(0).toLowerCase() + s.slice(1); }
  function cap(s) { s = String(s || ''); return s.charAt(0).toUpperCase() + s.slice(1); }
  function fmt(v) { if (typeof v !== 'number') return String(v); return Math.abs(v) >= 1000 ? v.toLocaleString('en-US') : String(Math.round(v * 100) / 100); }
  function typeName(t) { return { line: 'a line graph', bar: 'a bar chart', pie: 'a pie chart (or pie charts)', table: 'a table', process: 'a process diagram', map: 'a map (or maps)', mixed: 'two different visuals' }[t] || t; }
  function typeNoun(t) { return { line: 'line graph', bar: 'bar chart', pie: 'pie chart', table: 'table', process: 'diagram', map: 'maps', mixed: 'bar chart and table' }[t] || t; }
  function shuffled(arr, seed) {
    var a = arr.slice(), s = seed || 7;
    for (var i = a.length - 1; i > 0; i--) { s = (s * 9301 + 49297) % 233280; var j = Math.floor(s / 233280 * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }
  /* Build a question from [correct] + distractors.
     Fairness (audit 20 Oct 2026): the old seed depended only on the question
     id, so every duel put the answer in the same slot (the time question was
     always C, the split always B). Now the answer slot rotates through the
     duel from a start point taken from the prompt id, so within one duel the
     answers are spread over A–D, and the same question lands in a different
     slot on a different chart. When a pool has more distractors than fit,
     at least one distractor as long as the answer is kept, so the longest
     option is not a clue. */
  var qseq = 0, qbase = 0;
  var FILLERS = ['Write it any way that feels natural — the examiner does not check this', 'Skip this step to save time for Task 2', 'Ask the examiner during the test', 'It does not matter as long as the report is over 150 words'];
  function hashStr(s) { var h = 7; s = String(s); for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 1000003; return h; }
  function plainLen(s) { return String(s).replace(/<[^>]+>/g, '').length; }
  function q(id, stem, correct, distractors, hint, why, tag, maxD) {
    var seen = {}; seen[correct] = 1;
    var ds = distractors.filter(function (d) { if (!d || seen[d]) return false; seen[d] = 1; return true; });
    for (var f = 0; ds.length < 3 && f < FILLERS.length; f++) if (!seen[FILLERS[f]]) { ds.push(FILLERS[f]); seen[FILLERS[f]] = 1; }
    var max = maxD || 5;
    if (ds.length > max) {
      var cl = plainLen(correct), li = -1;
      for (var k = 0; k < ds.length; k++) if (plainLen(ds[k]) > cl) { li = k; break; }
      if (li < 0) for (k = 0; k < ds.length; k++) if (plainLen(ds[k]) >= cl) { li = k; break; }
      if (li >= max && !ds.slice(0, max).some(function (d) { return plainLen(d) > cl; })) { var keep = ds.splice(li, 1)[0]; ds.splice(max - 1, 0, keep); }
      ds = ds.slice(0, max);
    }
    var mixed = shuffled(ds, qbase * 3 + qseq * 7 + id.length * 13 + 1);
    var at = (qbase + qseq) % (mixed.length + 1); qseq++;
    var opts = mixed.slice(0, at).concat([correct], mixed.slice(at));
    return { id: id, stem: stem, options: opts, answer: at, hint: hint, why: why, tag: tag || 'kn-test-facts' };
  }
  var NUMWORD = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen'];
  function numWord(n) { return NUMWORD[n] || String(n); }

  /* ---------------------------------------------------- data helpers */
  function seriesOf(p) {
    var d = p.data;
    if (p.type === 'line') return { xs: d.x, series: d.series, timed: true };
    if (p.type === 'bar') return { xs: d.categories, series: d.series, timed: p.mode === 'TREND' && d.series.length === 1 };
    if (p.type === 'table') {
      var yearCols = d.cols.slice(1).every(function (c) { return /^\d{4}$/.test(String(c)); });
      return { xs: d.cols.slice(1), series: d.rows.map(function (r) { return { name: r[0], values: r.slice(1) }; }), timed: yearCols };
    }
    if (p.type === 'pie') {
      var ch = d.charts;
      if (ch.length >= 2) { var names = ch[0].slices.map(function (s) { return s.name; }); return { xs: ch.map(function (c) { return c.title; }), series: names.map(function (n) { return { name: n, values: ch.map(function (c) { var s = c.slices.filter(function (x) { return x.name === n; })[0]; return s ? s.value : 0; }) }; }), timed: true, pct: true }; }
      return { xs: [ch[0].title], series: ch[0].slices.map(function (s) { return { name: s.name, values: [s.value] }; }), timed: false, pct: true };
    }
    if (p.type === 'mixed') { var part = d.parts[0]; return seriesOf({ type: part.type, mode: p.mode, data: part.data }); }
    return null;
  }
  function countOf(p) { return p.type === 'process' ? p.data.stages.length : p.type === 'map' ? p.data.panels.length : p.type === 'mixed' ? p.data.parts.length : (p.data.charts ? p.data.charts.length : 1); }
  function unit(p, v, sd) { return fmt(v) + (sd && sd.pct ? '%' : (p.units && !/^%/.test(p.units) && p.units.length < 22 ? ' ' + p.units.replace(/^thousand /, 'thousand ') : '')); }
  function firstYearInRubric(p) { var m = String(p.rubric).match(/\b(19|20)\d\d\b/); return m ? m[0] : null; }
  function tenseFor(p) {
    if (p.mode === 'SEQUENCE') return 'Present simple (and the passive for a man-made process)';
    if (p.mode === 'SPACE' && (p.data.panels || []).length < 2) return 'Present simple (one map, a layout as it is now)';
    if (p.mode === 'SPACE') return /plan|propos|future|will/i.test(p.rubric + ' ' + (p.data.panels || []).map(function (x) { return x.title; }).join(' ')) ? 'Present simple for now, future forms (will be built / is to be) for the plan' : 'Past simple for the old map, present simple and present perfect passive for now';
    if (p.type === 'line' && p.data.projectedFrom) return 'Past simple for past years, future forms (is projected to / will reach) after the projection line';
    if (p.mode === 'TREND') return 'Past simple (the dates are in the past)';
    return firstYearInRubric(p) ? 'Past simple (the chart gives a past year)' : 'Present simple (no dates are given)';
  }
  var TENSE_OPTS = ['Past simple (the dates are in the past)', 'Present simple (no dates are given)', 'Present simple (and the passive for a man-made process)', 'Present continuous, because the chart shows change', 'Present perfect throughout, because the data is recent', 'Past simple for the old map, present simple and present perfect passive for now', 'Present simple for now, future forms (will be built / is to be) for the plan', 'Past simple for past years, future forms (is projected to / will reach) after the projection line', 'Past simple (the chart gives a past year)'];

  /* -------------------------------------------------- sentence makers */
  function introFor(p) {
    var r = p.rubric.replace(/^The (\w+( \w+)?) (below )?(shows?|illustrates?|gives? information about|compares?) /i, '');
    r = r.replace(/\.$/, '');
    var np = (p.data.panels || []).length;
    var verb = p.type === 'table' ? 'gives information about' : p.type === 'process' ? 'illustrates' : p.type === 'map' ? (np === 1 ? 'illustrates' : 'illustrate') : 'compares';
    var subj = { line: 'The line graph', bar: 'The bar chart', pie: p.data.charts && p.data.charts.length > 1 ? 'The pie charts' : 'The pie chart', table: 'The table', process: 'The diagram', map: np === 1 ? 'The map' : np === 3 ? 'The three maps' : 'The two maps', mixed: 'The chart and the table' }[p.type];
    var body = r.replace(/^the (number|percentage|proportion|amount) of /i, function (m, w) { return { number: 'how many ', percentage: 'what percentage of ', proportion: 'what share of ', amount: 'how much ' }[w.toLowerCase()]; })
      .replace(/ between (\d{4}) and (\d{4})/, function (m, a, b) { return ' over the ' + (parseInt(b, 10) - parseInt(a, 10)) + '-year period from ' + a + ' to ' + b; });
    var correct = subj + ' ' + verb + ' ' + body + '.';
    if (correct.length > 260) correct = subj + ' ' + verb + ' ' + r + '.';
    return { correct: correct, copied: p.rubric, opinion: subj + ' shows ' + r + ', and I think it is very interesting.', wrongType: (p.type === 'line' ? 'The pie chart' : 'The line graph') + ' shows ' + r + '.', informal: 'As we can see, this ' + typeNoun(p.type) + ' talks about ' + r + '.' };
  }
  function overviewFor(p) {
    var kf = p.keyFeatures, sd = seriesOf(p);
    var correct = 'Overall, ' + lc(kf[0]).replace(/\.$/, '') + '. ' + cap(kf[1]).replace(/\.$/, '') + '.';
    var num = sd ? unit(p, sd.series[0].values[sd.series[0].values.length - 1], sd) : (p.data.stages ? p.data.stages.length + ' stages' : '');
    var withFig = 'Overall, ' + lc(kf[0]).replace(/\.$/, '') + (sd ? ', reaching ' + num + ' for ' + lc(sd.series[0].name) : ', with ' + num) + '. ' + cap(kf[1]).replace(/\.$/, '') + '.';
    var vague = 'Overall, there were some differences between the categories and the figures changed over the period.';
    var concl = 'In conclusion, ' + lc(kf[0]).replace(/\.$/, '') + ', which is good for the country.';
    var detail = sd ? cap(sd.series[0].name) + ' ' + (sd.timed ? 'stood at ' + unit(p, sd.series[0].values[0], sd) + ' at the start' : 'recorded ' + unit(p, sd.series[0].values[0], sd)) + '.' : 'At the first stage, the process begins.';
    return { correct: correct, withFig: withFig, vague: vague, concl: concl, detail: detail };
  }
  function trendWord(a, b) { var d = (b - a) / (Math.abs(a) || 1); if (Math.abs(d) < 0.03) return 'remained stable at around'; return d > 0 ? (d > 0.5 ? 'rose sharply from' : 'rose from') : (d < -0.5 ? 'fell sharply from' : 'fell from'); }
  function detailFor(p) {
    var sd = seriesOf(p);
    if (sd && sd.timed && sd.xs.length >= 2) {
      var s = sd.series[0], a = s.values[0], b = s.values[s.values.length - 1], x0 = sd.xs[0], x1 = sd.xs[sd.xs.length - 1];
      var tw = trendWord(a, b);
      var correct = tw.indexOf('stable') >= 0 ? cap(s.name) + ' remained stable at around ' + unit(p, a, sd) + ' between ' + x0 + ' and ' + x1 + '.' : cap(s.name) + ' ' + tw + ' ' + unit(p, a, sd) + ' in ' + x0 + ' to ' + unit(p, b, sd) + ' in ' + x1 + '.';
      var wrongDir = cap(s.name) + ' ' + (b > a ? 'fell' : 'rose') + ' from ' + unit(p, a, sd) + ' in ' + x0 + ' to ' + unit(p, b, sd) + ' in ' + x1 + '.';
      var noNum = cap(s.name) + ' ' + (b > a ? 'rose' : 'fell') + ' a lot over the period.';
      var prep = cap(s.name) + ' ' + (b > a ? 'rose' : 'fell') + ' in ' + unit(p, a, sd) + ' at ' + unit(p, b, sd) + ' between ' + x0 + ' and ' + x1 + '.';
      var reason = correct.replace(/\.$/, '') + ', because people changed their habits.';
      return { correct: correct, d: [wrongDir, noNum, prep, reason], why: 'Claim + number: the category, the direction, both figures and both dates, with from … to.' };
    }
    if (sd && !sd.timed) {
      var ss = sd.series.slice().sort(function (u, v) { return v.values[0] - u.values[0]; });
      var top = ss[0], bot = ss[ss.length - 1];
      var mult = top.values[0] / (bot.values[0] || 1);
      var correct2 = cap(top.name) + ' was the highest, at ' + unit(p, top.values[0], sd) + ', while ' + lc(bot.name) + ' was the lowest, at ' + unit(p, bot.values[0], sd) + '.';
      return { correct: correct2, d: [cap(bot.name) + ' was the highest, at ' + unit(p, top.values[0], sd) + '.', cap(top.name) + ' was the highest and ' + lc(bot.name) + ' was the lowest.', cap(top.name) + ' increased to ' + unit(p, top.values[0], sd) + ', the highest figure.', cap(top.name) + ' was the most popular because everybody likes it, at ' + unit(p, top.values[0], sd) + '.'], why: 'COMPARE mode: superlatives with the figures, no trend verbs (nothing changes over time here).', extra: mult >= 1.8 ? cap(top.name) + ' was ' + (Math.round(mult) >= 2 ? (Math.round(mult) === 2 ? 'twice' : Math.round(mult) + ' times') + ' as high as ' : 'far higher than ') + lc(bot.name) + '.' : null };
    }
    if (p.type === 'process') {
      var st = p.data.stages, n = st.length;
      var s0 = lc(st[0].label) + (st[0].detail ? ' (' + st[0].detail + ')' : ''), sN = lc(st[n - 1].label) + (st[n - 1].detail ? ' (' + st[n - 1].detail + ')' : '');
      var c3 = 'The process begins at the ' + s0 + ' stage and ends with ' + sN + ', passing through ' + (n - 2) + ' stages in between.';
      return { correct: c3, d: ['The process began at the ' + s0 + ' stage and ended with ' + sN + ' last year.', 'The process has ' + (n + 2) + ' stages, from ' + lc(st[0].label) + ' to ' + lc(st[n - 1].label) + '.', 'I think the process is quite simple and easy to understand.', 'First ' + lc(st[0].label) + ', then ' + lc(st[1].label) + ', then ' + lc(st[2].label) + ', then the rest.'], why: 'Present simple, the right number of stages, start and end named — the shape of a process report.' };
    }
    if (p.type === 'map') {
      var pn = p.data.panels;
      if (!pn || pn.length < 2) return null; /* a single layout has no changes to describe */
      var pLast = pn[pn.length - 1], norm = function (n2) { return String(n2).toLowerCase().replace(/\s*\(.*?\)\s*/g, '').trim(); };
      var solid = function (f) { return f.kind !== 'road' && f.kind !== 'water'; };
      var f1 = pn[0].features.filter(solid), f2 = pLast.features.filter(solid);
      var names2 = f2.map(function (f) { return norm(f.name); }), names1 = f1.map(function (f) { return norm(f.name); });
      var goneF = f1.filter(function (f) { return names2.indexOf(norm(f.name)) < 0; }), addedF = f2.filter(function (f) { return names1.indexOf(norm(f.name)) < 0; });
      var overlap = function (a, b) { return a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h; };
      var pair = null;
      goneF.forEach(function (g2) { if (pair) return; addedF.forEach(function (a2) { if (!pair && overlap(g2, a2)) pair = [g2, a2]; }); });
      var gone = pair ? pair[0].name : (goneF[0] || f1[0]).name, added = pair ? pair[1].name : (addedF[0] || f2[0]).name;
      var future = /plan|propos/i.test(pLast.title);
      var art = function (n2) { return (/[^s]s$/i.test(n2) ? '' : /^[aeiou]/i.test(n2) ? 'an ' : 'a ') + lc(n2); };
      var pl = function (n2) { return /[^s]s$/i.test(n2); }, was = pl(gone) ? 'were' : 'was', isA = pl(added) ? 'are' : 'is', wasA = pl(added) ? 'were' : 'was';
      var c4 = pair
        ? (future ? 'The ' + lc(gone) + ' will be demolished and replaced by ' + art(added) + '.' : 'The ' + lc(gone) + ' ' + was + ' demolished and replaced by ' + art(added) + '.')
        : (future ? 'The ' + lc(gone) + ' will be removed, and ' + art(added) + ' ' + isA + ' to be built.' : 'The ' + lc(gone) + ' ' + was + ' removed, while ' + art(added) + ' ' + wasA + ' added by ' + pLast.title + '.');
      return { correct: c4, d: ['The ' + lc(gone) + ' is demolished and ' + art(added) + ' is built yesterday.', 'There were some changes to the ' + lc(gone) + ' area.', 'The ' + lc(gone) + ' was demolished because the town needed more space.', 'On the left there was a ' + lc(gone) + ' and on the right there is ' + art(added) + '.'], why: 'SPACE mode: a change verb in the right tense (demolished, replaced by, built), the feature named, and where it is — never left/right.' };
    }
    return null;
  }
  function comparisonFor(p) {
    var sd = seriesOf(p);
    if (!sd || sd.series.length < 2) return null;
    var last = sd.xs.length - 1, s = sd.series.slice().sort(function (u, v) { return v.values[last] - u.values[last]; });
    var A = s[0], B = s[1], when = sd.timed ? ' in ' + sd.xs[last] : '';
    var correct = cap(A.name) + ' was higher than ' + lc(B.name) + when + ', at ' + unit(p, A.values[last], sd) + ' and ' + unit(p, B.values[last], sd) + ' respectively.';
    return { correct: correct, d: [cap(B.name) + ' was higher than ' + lc(A.name) + when + ', at ' + unit(p, B.values[last], sd) + ' and ' + unit(p, A.values[last], sd) + ' respectively.', cap(A.name) + ' was more higher than ' + lc(B.name) + when + '.', cap(A.name) + ' was higher than ' + lc(B.name) + when + ', at ' + unit(p, B.values[last], sd) + ' and ' + unit(p, A.values[last], sd) + ' respectively.', cap(A.name) + ' was ' + unit(p, A.values[last], sd) + '. ' + cap(B.name) + ' was ' + unit(p, B.values[last], sd) + '.', correct.replace(/\.$/, '') + ', which was a surprising result.'], why: '"Respectively" lists the items first, then the figures in the same order. One sentence, two things compared.' };
  }
  function groupingFor(p) {
    var g = p.groupings && p.groupings.length === 2 && Array.isArray(p.groupings[0]) ? p.groupings : null;
    if (!g) return null;
    var lab = p.type === 'process' ? function (x) { return 'stages ' + x.join(', '); } : function (x) { return x.join(' and '); };
    var correct = 'Group A: ' + lab(g[0]) + ' · Group B: ' + lab(g[1]);
    var all = p.type === 'process' ? p.data.stages.map(function (s) { return String(s.n); }) : g[0].concat(g[1]);
    var swapped = all.length >= 4 ? 'Group A: ' + lab([all[0], all[all.length - 1]]) + ' · Group B: ' + lab(all.slice(1, -1)) : 'Group A: ' + lab([all[0]]) + ' · Group B: ' + lab(all.slice(1));
    return { correct: correct, d: ['One paragraph for each category, in the order they appear (' + all.length + ' paragraphs)', p.mode === 'TREND' ? 'One paragraph for each year shown, from the first year to the last, with every figure in it' : 'One paragraph for each number, from the largest figure in the chart down to the smallest one', swapped], why: 'Group by the story the data tells (rising vs falling, large vs small, early vs late stages), one group per paragraph.' };
  }

  /* ------------------------------------------------------------ build */
  function build(p) {
    qseq = 0; qbase = hashStr(p.id) % 997;
    var steps = [], sd = seriesOf(p);
    var otherUnits = C.PROMPTS.filter(function (x) { return x.units && x.units !== p.units; }).map(function (x) { return x.units; }).filter(function (u, i, a) { return a.indexOf(u) === i; }).slice(0, 5);

    steps.push({ id: 'time', title: 'Before you read the chart', brief: 'The exam gives Task 1 and Task 2 together in 60 minutes. The first decisions are about time and length, not about the chart.', questions: [
      q('time', 'How much time do I have for Task 1?', 'About 20 minutes (Task 2 gets 40)', ['About 10 minutes, then move on', 'About 30 minutes, half the paper', 'As long as I need — there is no split'], 'Think about which task is worth more of your Writing score, and let the 60 minutes follow that.', 'Twenty minutes. Task 2 is worth double, so it gets the other forty.', 'kn-test-facts'),
      q('split', 'How should I split those 20 minutes?', '0:30 triage · 2:00 big picture · 1:30 group and select · 13:00 write · 3:00 check', ['0:00 triage · 0:00 big picture · 0:00 group and select · 20:00 write · check only if time is left', '3:00 triage · 4:00 big picture · 3:00 group and select · 10:00 write · 0:00 check', '5:00 read the chart · 15:00 write · no plan and no check'], 'Look for a plan that keeps some minutes before writing and some after it. Which one leaves time for both?', 'Triage, big picture, group and select, then write to the skeleton, then three minutes for the ten-point check.', 'struct-time'),
      q('words', 'What is my word target?', 'At least 150; aim for 160–190', ['Exactly 150 — no more', 'At least 250, like Task 2', 'No minimum, as long as the overview is there'], 'Read the last line of the task sentence for the minimum, then think how many extra words you can still check in three minutes.', 'At least 150 words. 160–190 gives enough evidence without wasting time.', 'struct-length')
    ] });

    steps.push({ id: 'triage', title: 'Triage: 30 seconds', brief: 'Look at the visual, not the numbers. Type, mode, what is measured and the time frame decide every verb and tense you will use.', questions: [
      q('type', 'What chart type is this?', typeName(p.type), ['a line graph', 'a bar chart', 'a pie chart (or pie charts)', 'a table', 'a process diagram', 'a map (or maps)', 'two different visuals'].filter(function (x) { return x !== typeName(p.type); }).slice(0, 4), 'Read the task sentence and look at the shape of the visual.', 'This is ' + typeName(p.type) + '. The type is the first word of your introduction.', 'kn-triage-mode'),
      q('mode', 'Which operating mode does it need?', p.mode + ' — ' + C.MODES[p.mode].kit, Object.keys(C.MODES).filter(function (k) { return k !== p.mode; }).map(function (k) { return k + ' — ' + C.MODES[k].kit; }), 'Look at the horizontal axis, the column headings or the labels: are they years, stages, places or just names of things?', p.mode + ' mode. ' + C.MODES[p.mode].kit + '.', 'kn-triage-mode'),
      p.units ? q('units', 'What is being measured — what are the units?', p.units, otherUnits.length >= 3 ? otherUnits.slice(0, 3) : otherUnits.concat(['number of countries', 'minutes per day']).slice(0, 3), 'Read the axis label or the task sentence for the unit.', 'Units: ' + p.units + '. A wrong unit makes every figure in the report wrong.', 'kn-triage-units')
        : q('count', p.type === 'process' ? 'How many stages does the diagram show?' : p.type === 'map' ? 'How many maps or panels are there?' : 'How many visuals must the report cover?', numWord(countOf(p)), [countOf(p) - 1, countOf(p) + 1, countOf(p) + 2].filter(function (n) { return n > 0; }).concat([countOf(p) + 3]).slice(0, 3).map(numWord), 'Count them before you write — the overview needs the number.', 'Counting first protects you from missing a stage, a panel or a visual.', 'ta-missing-category'),
      q('tense', 'Which tense will carry the report?', tenseFor(p), TENSE_OPTS.filter(function (t) { return t !== tenseFor(p); }), 'Find every date in the task sentence and on the visual. Are they in the past, in the future, or are there none?', tenseFor(p) + '.', 'gra-tense', 4)
    ] });

    /* Option sets vary from chart to chart so that "never the longest" does not become a clue either. */
    var alt = qbase % 2 === 1, rare = qbase % 4 === 0, rare2 = qbase % 4 === 2, rare3 = qbase % 4 === 3;
    var kf = p.keyFeatures, df = p.distractorFeatures || [];
    var plainKf = function (x) { return String(x).replace(/\.$/, ''); };
    var kfReason = plainKf(kf[0]) + (p.mode === 'SEQUENCE' ? ', which makes it an efficient way to do the job' : p.mode === 'SPACE' ? ', which was a good decision for local people' : ', probably because people changed their habits');
    var kfOpinion = plainKf(kf[1]) + (p.mode === 'SEQUENCE' ? ', which I think is the most interesting part' : ', which I think is a worrying sign for the future');
    steps.push({ id: 'bigpicture', title: 'Big picture: 2 minutes', brief: 'What is important to bring out? Not every figure — the two or three truths a newspaper headline would report. Key features are general, true and about the whole chart.', questions: [
      q('kf1', 'Which of these is a KEY feature worth the overview?', kf[0], alt ? [kfReason].concat(df.slice(0, 2)) : df.slice(0, 3), 'Cover the numbers. Which statement is still true of the whole chart, and does nothing but report it?', kf[0] + ' — general and true of the whole chart. The others are single figures, opinions or reasons (a guess about why is not in the chart).', 'ta-selection'),
      q('kf2', 'And which of these is another key feature?', kf[1], !alt ? [kfOpinion].concat(df.slice(1, 4).concat(df.slice(0, 1)).slice(0, 2)) : df.slice(1, 4).concat(df.slice(0, 1)).slice(0, 3), 'Look for the second story: what fell while the first rose, what stayed the same, the odd one out.', kf[1] + '. Only report what the chart shows: an opinion added to a true feature still does not belong.', 'ta-selection'),
      q('kf3', 'Which of these should NOT be in the overview?', df[0], [kf[2] || kf[0], kf[1], kf[0]].slice(0, 3), 'Three of these describe the chart as a whole. Find the one that does not.', df[0] + ' is ' + (/\d/.test(df[0]) ? 'a single figure — detail-paragraph material' : 'an opinion, a reason or a triviality') + '.', 'ta-overview-figures')
    ] });

    var gr = groupingFor(p);
    if (gr) steps.push({ id: 'group', title: 'Group and select: 90 seconds', brief: 'Sort the data into two groups that share a story. One group becomes Detail A, the other Detail B. Then choose three to five figures per group — first, last, extreme, one comparison — and leave the rest out on purpose.', questions: [
      q('grouping', 'How should the details be grouped into two paragraphs?', gr.correct, gr.d, 'Group by the story: rising vs falling, large vs small, early vs late stages, north vs south.', gr.why, 'cc-grouping'),
      q('select', 'Which figures survive into the report?', 'First and last values, the extremes and one comparison per group', (rare ? ['Every value, in order', 'Only the largest number', 'No figures at all'] : ['Every value in the chart, in order, so that the examiner sees that nothing is missed', 'Only the largest number', 'No figures at all, because the overview has already said what happened']), 'Band 8 reports use fewer figures than Band 5 reports and choose them better.', 'First, last, extreme, one comparison. Everything else is left out on purpose.', 'ta-mechanical')
    ] });

    var intro = introFor(p);
    steps.push({ id: 'intro', title: 'Paragraph 1: the introduction', brief: 'One or two sentences that paraphrase the task: the visual, what it measures, where, when, units. Copied rubric is not counted.', questions: [
      q('intro', 'Which introduction is best?', intro.correct, [intro.copied, intro.opinion, intro.informal, intro.wrongType], 'Put each option next to the task sentence. Which one says the same thing in new words, and adds nothing of its own?', 'Paraphrased, correct type, no opinion, no "we can see".', 'lr-copied-rubric')
    ] });

    var ov = overviewFor(p);
    steps.push({ id: 'overview', title: 'Paragraph 2: the overview', brief: 'The most valuable forty words in the test. "Overall," then two or three general truths. No figures — names and dates only. Write it second so it is on the page even if time runs out.', questions: [
      q('overview', 'Which overview is best?', ov.correct, [ov.withFig, ov.vague, ov.concl, ov.detail], 'Cover the numbers on the chart. Which option still says something true and useful about the whole chart?', 'General, two main features, no figures. That is what unlocks Band 6 and 7 for Task Achievement.', 'ta-no-overview'),
      q('ovwhere', 'Where does the overview go?', 'Second paragraph, straight after the introduction', (rare2 ? ['At the very end, as a conclusion', 'Inside the introduction', 'Nowhere — Task 1 does not need one'] : ['At the very end, as a conclusion that sums up the whole report', 'Inside the introduction, together with the most important figures', 'Nowhere — Task 1 does not need one']), 'Think about what happens to the most valuable paragraph if the clock runs out before you finish.', 'Paragraph two. It is the band-gating element, so it goes on the page early.', 'ta-no-overview')
    ] });

    var dt = detailFor(p), cmp = comparisonFor(p);
    var dq = [];
    if (dt) dq.push(q('detail', 'Which sentence belongs in Detail A?', dt.correct, dt.d, 'Every detail sentence carries a figure, a date or a label, in the right tense, with the right preposition.', dt.why, 'ta-no-data'));
    if (cmp) dq.push(q('compare', 'Which comparison sentence is correct?', cmp.correct, cmp.d, 'Read both values at the last point on the chart, then check the order of the names and the figures in each option.', cmp.why, 'ta-no-comparison', 4));
    if (dt && dt.extra) dq.push(q('multiple', 'Which sentence uses a multiple correctly?', dt.extra, [dt.extra.replace(' as high as ', ' as high than ').replace('far higher than', 'far more higher than'), dt.extra.replace(/was .* as high as/, 'was as much than').replace('far higher than', 'more high that'), 'The figures were very different from each other.'], 'Check the small words around "high" and "higher" in each option, and check that the figures really support the claim.', 'Multiples add range to COMPARE mode, but only when the data really supports them.', 'lr-compare-vocab'));
    dq.push(q('prep', 'Complete: "The figure rose ___ 40% in 2010 ___ 70% in 2020."', 'from … to', ['by … to', 'in … at', 'from … by', 'between … and'], 'One gap needs the starting value and the other needs the end value. Which pair of small words marks a start and an end?', 'rose FROM the start value TO the end value. "By" is for the size of the change.', 'gra-prep-figure'));
    steps.push({ id: 'details', title: 'Paragraphs 3 and 4: the details', brief: 'Claim + number in every sentence. Compare, do not narrate. Group A in paragraph three, Group B in paragraph four.', questions: dq });

    var chk = [];
    chk.push(q('ck1', 'This sentence fails which check? "' + ov.withFig.slice(0, 120) + (ov.withFig.length > 120 ? '…' : '') + '"', CHECKLIST[1], [CHECKLIST[0], CHECKLIST[4], CHECKLIST[7], CHECKLIST[9]], 'Which paragraph is this sentence from, and what is that paragraph not allowed to contain?', 'The overview must be general. Move the figure to the detail paragraphs.', 'ta-overview-figures'));
    chk.push(q('ck2', 'This sentence fails which check? "' + (sd ? cap(sd.series[0].name) + ' changed a great deal over the period.' : 'The first stage is very important and takes a long time.') + '"', CHECKLIST[2], [CHECKLIST[1], CHECKLIST[3], CHECKLIST[6], CHECKLIST[8]], 'Ask what a reader would need in order to check this sentence against the chart.', 'A detail sentence without data is an opinion. Add the figures.', 'ta-no-data'));
    chk.push(q('ck3', 'This ending fails which check? "In conclusion, this shows that ' + lc(kf[0]).replace(/\.$/, '') + ', which is a positive trend."', CHECKLIST[7], [CHECKLIST[0], CHECKLIST[3], CHECKLIST[5], CHECKLIST[8]], 'Look at how the sentence begins and at its last few words. What would an examiner say about each part?', 'No conclusion, no opinion. The overview already did the summarising.', 'ta-conclusion'));
    chk.push(q('ck4', 'Your report is 138 words with three minutes left. What now?', 'Add a comparison sentence with figures to a detail paragraph, then run the checklist', (rare3 ? ['Write a conclusion paragraph to reach 150', 'Add an opinion about why the trend happened', 'Submit now — 138 is close enough'] : ['Write a short conclusion paragraph that repeats the overview, just to get past 150 words', 'Add a sentence explaining why the trend happened, using what you know about the topic', 'Submit now — 138 is close enough']), 'You need more words, and they must also earn credit for Task Achievement. Which choice does both?', 'A supported comparison adds words and TA credit at the same time. A conclusion adds neither.', 'struct-length'));
    steps.push({ id: 'check', title: 'The Ten Wards: the last 3 minutes', brief: 'Ten checks, in order, every time. ' + CHECKLIST.map(function (c, i) { return (i + 1) + '. ' + c; }).join('  '), questions: chk, checklist: true });

    return { steps: steps, total: steps.reduce(function (a, s) { return a + s.questions.length * POINTS.first; }, 0) };
  }

  /* --------------------------------------------------------------- UI */
  function rankFor(points) { var r = RANKS[0]; RANKS.forEach(function (x) { if (points >= x.min) r = x; }); return r; }
  function nextRank(points) { for (var i = 0; i < RANKS.length; i++) if (RANKS[i].min > points) return RANKS[i]; return null; }

  function mount(host, cfg) {
    var p = typeof cfg.prompt === 'string' ? global.Charts.prompt(cfg.prompt) : cfg.prompt;
    var mission = build(p), st = { i: 0, points: 0, answered: {}, log: [] };
    var total = mission.total;
    function paint() {
      var step = mission.steps[st.i];
      var nDone = step.questions.filter(function (qq) { return (st.answered[qq.id] || {}).done; }).length, allDone = nDone === step.questions.length;
      var html = '<div class="wr"><div class="wr-top"><button class="btn ghost sm" id="bc-quit">✕</button>' +
        '<div class="wr-phases">' + mission.steps.map(function (s, i) { return '<span class="' + (i === st.i ? 'on' : i < st.i ? 'past' : '') + '">' + (i + 1) + '</span>'; }).join('') + '</div>' +
        '<span class="wr-words">' + st.points + ' / ' + total + ' pts</span><span class="bc-passnote">You need ' + Math.round(POINTS.pass * 100) + '% to win; ' + Math.round(POINTS.complete * 100) + '% completes the chapter mission.</span></div>' +
        '<div class="wr-grid"><div class="wr-left"><div id="bc-chart"></div></div><div class="wr-right">' +
        '<div class="card theory" style="gap:10px"><p class="kicker">Step ' + (st.i + 1) + ' of ' + mission.steps.length + '</p><h3>' + esc(step.title) + '</h3>' +
        (step.checklist ? '<ol class="bc-list">' + CHECKLIST.map(function (c) { return '<li>' + esc(c) + '</li>'; }).join('') + '</ol>' : '<p class="key" style="font-weight:500">' + esc(step.brief) + '</p>') +
        step.questions.map(function (qq, qi) {
          var a = st.answered[qq.id] || {};
          return '<div class="bc-q' + (a.done ? (a.correct ? ' ok' : ' no') : '') + '" data-q="' + qq.id + '"><p class="bc-stem">' + esc(qq.stem) + '</p>' +
            '<select class="bc-sel" ' + (a.done ? 'disabled' : '') + '><option value="">Choose…</option>' + qq.options.map(function (o, oi) { return '<option value="' + oi + '"' + (a.wrongFirst === oi && !a.done ? ' disabled' : '') + (a.chosen === oi ? ' selected' : '') + '>' + esc(o) + (a.wrongFirst === oi ? ' ✕' : (a.done && oi === qq.answer ? ' ✓' : '')) + '</option>'; }).join('') + '</select>' +
            '<div class="bc-acts">' + (a.done ? '' : '<button class="btn sm" data-hint="' + qq.id + '"' + (a.hinted ? ' disabled' : '') + '>Hint (−' + POINTS.hint + ')</button><button class="btn primary sm" data-check="' + qq.id + '">' + (a.wrongFirst != null ? 'Try second choice (' + POINTS.second + ' pts)' : 'Check (' + POINTS.first + ' pts)') + '</button>') + '</div>' +
            (a.hinted && !a.done ? '<div class="bc-hint">' + esc(qq.hint) + '</div>' : '') +
            (a.wrongFirst != null && !a.done ? '<div class="bc-hint no">Not that one. Choose again — a correct second choice earns ' + POINTS.second + ' points.</div>' : '') +
            (a.done ? '<div class="bc-why ' + (a.correct ? 'ok' : 'no') + '"><b>' + (a.correct ? '✓ +' + a.gain : '✕ 0') + '</b> ' + (a.correct ? '' : 'Answer: ' + esc(qq.options[qq.answer]) + '. ') + esc(qq.why) + '</div>' : '') + '</div>';
        }).join('') +
        '<div class="qfoot"><span class="tiny">' + nDone + ' of ' + step.questions.length + ' answered</span><span class="grow"></span>' +
        '<span class="bc-nextmsg' + (allDone ? ' hidden' : '') + '" id="bc-nextmsg" role="status">Answer all ' + step.questions.length + ' question' + (step.questions.length === 1 ? '' : 's') + ' first</span>' +
        '<button class="btn primary" id="bc-next"' + (allDone ? '' : ' disabled') + '>' + (st.i + 1 >= mission.steps.length ? 'Finish mission' : 'Next step →') + '</button></div></div></div></div></div>';
      host.innerHTML = html;
      global.Charts.render(host.querySelector('#bc-chart'), p, { compact: true, readout: true });
      host.querySelector('#bc-quit').addEventListener('click', function () { if (cfg.onQuit) cfg.onQuit(); });
      host.querySelectorAll('[data-hint]').forEach(function (b) { b.addEventListener('click', function () { var a = st.answered[b.dataset.hint] || (st.answered[b.dataset.hint] = {}); a.hinted = true; paint(); }); });
      host.querySelectorAll('[data-check]').forEach(function (b) { b.addEventListener('click', function () {
        var id = b.dataset.check, qq = step.questions.filter(function (x) { return x.id === id; })[0];
        var sel = host.querySelector('[data-q="' + id + '"] .bc-sel'); var v = sel.value; if (v === '') return;
        var a = st.answered[id] || (st.answered[id] = {}); var oi = parseInt(v, 10); a.chosen = oi;
        if (oi === qq.answer) { a.done = true; a.correct = true; a.gain = Math.max(0, (a.wrongFirst != null ? POINTS.second : POINTS.first) - (a.hinted ? POINTS.hint : 0)); st.points += a.gain; }
        else if (a.wrongFirst == null) { a.wrongFirst = oi; }
        else { a.done = true; a.correct = false; a.gain = 0; }
        if (a.done) { st.log.push({ id: id, tag: qq.tag, correct: a.correct, hinted: !!a.hinted, second: a.wrongFirst != null }); if (cfg.onAnswer) cfg.onAnswer({ promptId: p.id, id: id, tag: qq.tag, correct: a.correct, hinted: !!a.hinted, second: a.wrongFirst != null, gain: a.gain }); }
        paint();
        var el = host.querySelector('[data-q="' + id + '"]'); if (el) el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }); });
      host.querySelector('#bc-next').addEventListener('click', function () {
        if (st.i + 1 >= mission.steps.length) {
          var pct = total ? st.points / total : 0;
          /* completed = every question of every step answered (Finish is only enabled when the last step is done, and each Next needed its step done) */
          if (cfg.onDone) cfg.onDone({ promptId: p.id, points: st.points, total: total, passed: pct >= POINTS.pass, completed: true, pct: Math.round(100 * pct), counts: pct >= POINTS.complete, log: st.log });
          return;
        }
        st.i++; paint(); window.scrollTo({ top: 0 });
      });
    }
    paint();
    return { state: st };
  }

  global.Bootcamp = { build: build, mount: mount, RANKS: RANKS, CHECKLIST: CHECKLIST, POINTS: POINTS, rankFor: rankFor, nextRank: nextRank };
})(window);
