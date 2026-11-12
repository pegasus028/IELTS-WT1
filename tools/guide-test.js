#!/usr/bin/env node
/* ===========================================================================
   QUILLMOOR OBSERVATORY — tools/guide-test.js  (12 Nov 2026)
   Checks for the Scriptorium's High and Medium guidance (guide.js and
   guide-content.js). Contract: docs/GUIDANCE-LEVELS.md.

     node tools/guide-test.js           run every check, exit 1 on failure
     node tools/guide-test.js --essay   also print the essay each script builds

   For every script:
     1  shape: the five sections, unique step ids, a label, a question, one right
        option and three wrong ones (all different), a hint on every wrong
        option, a tag that exists in REMEDIATION, Medium fields (shape, expect,
        accept, hint, hint2); every regular expression compiles.
     2  hints never give the answer: no hint (option, reject, hint, hint2)
        contains the right option (5+ characters) or, for a figure, the figure.
     3  options: the right one is not the longest in more than a third of the
        steps, and its position is spread over the four places.
     4  the essay built from the right options: four paragraphs, 160–190 words,
        every figure with its year matches the chart, every label named, no
        10-word run from the task, and Writer.preflight has NO red and NO
        amber row.
     5  Medium rule check: the right option of every step is accepted; every
        wrong option of every step is NOT accepted outright (revise or unsure);
        every "also accepted" wording listed in the table below is accepted
        and every listed slip is sent back.
     6  Guide.tidy / Guide.essay: free text with stray punctuation or lower
        case still joins into clean sentences.
   =========================================================================== */
'use strict';
var fs = require('fs'), path = require('path'), vm = require('vm');
var ROOT = path.resolve(__dirname, '..'), SHOW = process.argv.indexOf('--essay') >= 0;
var ctx = { console: console, localStorage: { getItem: function () { return null; }, setItem: function () {}, removeItem: function () {} } };
ctx.window = ctx; vm.createContext(ctx);
['content.js', 'prompts.js', 'prompts-2.js', 'prompts-3.js', 'models.js', 'models-2.js', 'charts.js', 'example-levels.js', 'writer.js', 'guide-content.js', 'guide.js'].forEach(function (f) {
  vm.runInContext(fs.readFileSync(path.join(ROOT, f), 'utf8'), ctx, { filename: f });
});
var G = ctx.Guide, W = ctx.Writer, C = ctx.CONTENT, S = ctx.GUIDE_SCRIPTS;
var fails = 0, oks = 0;
function ok(c, msg) { if (c) oks++; else { fails++; console.log('  FAIL  ' + msg); } }
function norm(t) { return String(t).toLowerCase().replace(/\s+/g, ' ').trim(); }
function words(t) { return W.words(t); }

/* wordings a Medium student may well type: [stepId, entry, 'accept' | 'revise' | 'not-accept'] */
var MEDIUM = { 'p-line-museums': [
  ['t-mode', 'Trend', 'accept'], ['t-mode', 'compare', 'not-accept'],
  ['t-tense', 'past simple', 'accept'], ['t-tense', 'Past tense', 'accept'], ['t-tense', 'present perfect', 'revise'], ['t-tense', 'present simple', 'not-accept'],
  ['t-units', '420,000 visitors', 'accept'], ['t-units', '420 thousand people', 'accept'], ['t-units', '420 million', 'revise'], ['t-units', '420 visitors', 'not-accept'],
  ['t-groupA', 'Science Museum', 'accept'], ['t-groupA', 'science and art', 'revise'],
  ['t-groupB', 'Art Gallery and History Museum', 'accept'], ['t-groupB', 'the art gallery', 'not-accept'], ['t-groupB', 'science and history', 'revise'],
  ['t-exception', 'the Art Gallery rose a little in 2016', 'accept'], ['t-exception', 'no exception', 'not-accept'],
  ['i-visual', 'The line graph', 'accept'], ['i-visual', 'the graph', 'accept'], ['i-visual', 'The bar chart', 'revise'],
  ['i-verb', 'compares', 'accept'], ['i-verb', 'shows', 'revise'], ['i-verb', 'illustrate', 'revise'], ['i-verb', 'is showing', 'revise'],
  ['i-what', 'the number of people who visited three museums', 'accept'], ['i-what', 'visitor numbers at three museums', 'accept'], ['i-what', 'the number of visitors to three museums', 'revise'], ['i-what', 'the amount of people visiting three museums', 'revise'],
  ['i-where', 'in a European city', 'accept'], ['i-where', 'in a city in Europe', 'accept'], ['i-where', 'in an european city', 'revise'], ['i-where', 'in a European country', 'revise'], ['i-where', 'in Europe', 'not-accept'],
  ['i-when', 'from 2010 to 2020', 'accept'], ['i-when', 'over a ten-year period from 2010 to 2020', 'accept'], ['i-when', 'between 2010 and 2020', 'revise'], ['i-when', 'since 2010 to 2020', 'revise'], ['i-when', 'in 2010', 'not-accept'],
  ['i-units', 'measured in thousands', 'accept'], ['i-units', 'with figures given in thousand', 'revise'], ['i-units', 'in millions', 'revise'],
  ['o-open', 'overall', 'accept'], ['o-open', 'In general,', 'accept'], ['o-open', 'In conclusion', 'revise'],
  ['o-claim', 'the number of people visiting the Science Museum increased strongly', 'accept'], ['o-claim', 'the Science Museum rose to 760 thousand', 'revise'], ['o-claim', 'the Science Museum rises', 'revise'], ['o-claim', 'the science museum was risen', 'revise'], ['o-claim', 'the Art Gallery fell', 'not-accept'],
  ['o-link', 'while', 'accept'], ['o-link', 'but', 'revise'], ['o-link', 'because', 'revise'], ['o-link', 'However', 'revise'],
  ['o-contrast', 'the other two museums saw a decline', 'accept'], ['o-contrast', 'the Art Gallery and the History Museum fell', 'accept'], ['o-contrast', 'the art gallery fell to 520', 'revise'], ['o-contrast', 'the History Museum fell', 'not-accept'],
  ['o-second', 'The Science Museum passed the Art Gallery in 2014', 'accept'], ['o-second', 'the Science Museum became the most popular museum', 'accept'], ['o-second', 'the Science Museum overtook the History Museum', 'revise'], ['o-second', 'The Science Museum overtook the Art Gallery at 570 thousand', 'revise'],
  ['o-third', 'while the History Museum was the least visited in every year', 'accept'], ['o-third', 'while the History Museum was the less popular', 'revise'], ['o-third', 'while the Art Gallery fell', 'not-accept'],
  ['a-time', 'in 2010', 'accept'], ['a-time', 'At the start of the period', 'accept'], ['a-time', 'at 2010', 'revise'], ['a-time', 'In 2020', 'revise'],
  ['a-subject', 'the Science Museum', 'accept'], ['a-subject', 'Science Museum', 'revise'], ['a-subject', 'the Art Gallery', 'revise'],
  ['a-verb', 'attracted', 'accept'], ['a-verb', 'had', 'accept'], ['a-verb', 'was received', 'revise'], ['a-verb', 'receives', 'revise'], ['a-verb', 'recieved', 'revise'],
  ['a-figure', '420', 'accept'], ['a-figure', 'around 420', 'accept'], ['a-figure', '470', 'revise'], ['a-figure', '420,000', 'revise'],
  ['a-unit', 'thousand visitors', 'accept'], ['a-unit', 'thousands visitors', 'revise'], ['a-unit', 'visitors', 'revise'], ['a-unit', 'thousand visitor', 'revise'],
  ['a-meaning1', "considerably fewer than the Art Gallery's 610 thousand", 'accept'], ['a-meaning1', 'well below the 610 thousand at the Art Gallery', 'accept'], ['a-meaning1', "far less than the Art Gallery's 610 thousand", 'revise'], ['a-meaning1', "slightly fewer than the Art Gallery's 610 thousand", 'revise'], ['a-meaning1', 'which was low', 'not-accept'],
  ['a-ref', 'Its attendance', 'accept'], ['a-ref', 'its visitor numbers', 'accept'], ['a-ref', "It's attendance", 'revise'], ['a-ref', 'Their attendance', 'revise'],
  ['a-trend', 'then rose steadily', 'accept'], ['a-trend', 'increased steadily', 'accept'], ['a-trend', 'then rises steadily', 'revise'], ['a-trend', 'then rose steady', 'revise'], ['a-trend', 'was risen steadily', 'revise'], ['a-trend', 'then rose sharply', 'revise'], ['a-trend', 'then raised steadily', 'revise'],
  ['a-prep1', 'to', 'accept'], ['a-prep1', 'by', 'revise'], ['a-prep1', 'at', 'revise'],
  ['a-fig2', '570 thousand in 2014', 'accept'], ['a-fig2', '570,000 in 2014', 'accept'], ['a-fig2', '570 thousand in 2016', 'revise'], ['a-fig2', '560 thousand in 2014', 'revise'], ['a-fig2', '570 thousands in 2014', 'revise'],
  ['a-meaning2', 'when it passed the Art Gallery', 'accept'], ['a-meaning2', 'overtaking the Art Gallery', 'accept'], ['a-meaning2', 'when the Art Gallery overtook it', 'revise'], ['a-meaning2', 'because science became popular', 'revise'], ['a-meaning2', 'when it overtook the History Museum', 'revise'],
  ['a-peak', 'and peaked', 'accept'], ['a-peak', 'and reached a peak', 'accept'], ['a-peak', 'and was peaked', 'revise'], ['a-peak', 'and peaks', 'revise'],
  ['a-prep2', 'at', 'accept'], ['a-prep2', 'to', 'revise'], ['a-prep2', 'by', 'revise'],
  ['a-fig3', '760 thousand in 2020', 'accept'], ['a-fig3', '710 thousand in 2020', 'revise'], ['a-fig3', '760 thousand in 2018', 'revise'],
  ['a-meaning3', 'nearly twice its 2010 figure', 'accept'], ['a-meaning3', 'almost double the starting figure', 'accept'], ['a-meaning3', 'double its starting figure', 'revise'], ['a-meaning3', 'three times its starting figure', 'revise'],
  ['b-link', 'In contrast', 'accept'], ['b-link', 'However,', 'accept'], ['b-link', 'Similarly', 'revise'], ['b-link', 'whereas', 'revise'],
  ['b-subject', 'visitor numbers at the Art Gallery', 'accept'], ['b-subject', 'the number of visitors to the Art Gallery', 'accept'], ['b-subject', 'the amount of visitors to the Art Gallery', 'revise'], ['b-subject', 'visit to the Art Gallery', 'revise'], ['b-subject', 'visits to the Science Museum', 'revise'],
  ['b-trend', 'declined slowly', 'accept'], ['b-trend', 'fell gradually', 'accept'], ['b-trend', 'fell sharply', 'revise'], ['b-trend', 'were fallen gradually', 'revise'], ['b-trend', 'felt gradually', 'revise'], ['b-trend', 'fell gradual', 'revise'],
  ['b-fromto', 'from 610 thousand to 520 thousand', 'accept'], ['b-fromto', 'from 610,000 to 520,000', 'accept'], ['b-fromto', 'from 520 thousand to 610 thousand', 'revise'], ['b-fromto', 'from 610 thousand to 540 thousand', 'revise'],
  ['b-period', 'over the period', 'accept'], ['b-period', 'during the decade', 'accept'], ['b-period', 'over the century', 'revise'], ['b-period', 'between 2010 and 2020', 'revise'],
  ['b-exception1', 'despite a small rise to 570 thousand in 2016', 'accept'], ['b-exception1', 'although it recovered slightly to 570 thousand in 2016', 'accept'], ['b-exception1', 'despite it recovered to 570 thousand in 2016', 'revise'], ['b-exception1', 'despite a sharp recovery to 570 thousand in 2016', 'revise'], ['b-exception1', 'despite a slight recovery to 570 thousand in 2014', 'revise'],
  ['b-rank', 'The History Museum had the fewest visitors throughout', 'accept'], ['b-rank', 'The History Museum was the less visited', 'revise'], ['b-rank', 'The History Museum is the least visited', 'revise'], ['b-rank', 'The Art Gallery was popular', 'not-accept'],
  ['b-ref', ': its figure', 'accept'], ['b-ref', '. Its figure', 'accept'], ['b-ref', ', its figure', 'revise'], ['b-ref', ": it's figure", 'revise'], ['b-ref', 'its figure', 'revise'],
  ['b-verb', 'fell', 'accept'], ['b-verb', 'declined', 'accept'], ['b-verb', 'was dropped', 'revise'], ['b-verb', 'droped', 'revise'], ['b-verb', 'drops', 'revise'],
  ['b-fig1', 'from 380 thousand in 2010', 'accept'], ['b-fig1', '380 thousand in 2010', 'revise'], ['b-fig1', 'from 350 thousand in 2010', 'revise'],
  ['b-fig2', 'to 290 thousand in 2016', 'accept'], ['b-fig2', 'by 290 thousand in 2016', 'revise'], ['b-fig2', 'to 290 thousand in 2018', 'revise'],
  ['b-exception2', 'and, after a slight recovery in 2018', 'accept'], ['b-exception2', 'and, after a small rise in 2018,', 'accept'], ['b-exception2', 'and, after a sharp rise in 2018', 'revise'], ['b-exception2', 'and, after a small fall in 2018', 'revise'], ['b-exception2', 'and, after a small rise in 2014', 'revise'],
  ['b-end', 'finished at a low of 260 thousand', 'accept'], ['b-end', 'fell to a low of 260 thousand in 2020', 'accept'], ['b-end', 'ended at a peak of 260 thousand', 'revise'], ['b-end', 'ended by a low of 260 thousand', 'revise'], ['b-end', 'ended at a low of 300 thousand', 'revise']
] };

Object.keys(S).forEach(function (pid) {
  var sc = S[pid], p = ctx.Charts.prompt(pid), flat = G.steps(sc);
  console.log(pid + ' · ' + flat.length + ' steps');
  ok(!!p, pid + ': the prompt exists');
  ok(sc.sections.map(function (s) { return s.id; }).join() === 'triage,intro,overview,detailA,detailB', pid + ': five sections in order');
  ok(sc.sections.map(function (s) { return String(s.pane); }).join() === 'null,0,1,2,3', pid + ': panes null,0,1,2,3');
  var ids = {}, longest = 0, pos = [0, 0, 0, 0];
  flat.forEach(function (x) {
    var st = x.step, tag = pid + ' ' + st.id + ': ';
    ok(!ids[st.id], tag + 'unique id'); ids[st.id] = 1;
    ok(st.label && st.ask && st.ok, tag + 'label, ask and ok');
    ok(st.wrong && st.wrong.length === 3, tag + 'three wrong options');
    var all = [st.ok].concat((st.wrong || []).map(function (w) { return w[0]; }));
    ok(all.filter(function (t, i) { return all.map(norm).indexOf(norm(t)) === i; }).length === 4, tag + 'four different options');
    (st.wrong || []).forEach(function (w) { ok(w[1] && w[1].length > 20, tag + 'a hint on "' + w[0] + '"'); });
    ok(C.REMEDIATION[st.tag], tag + 'tag ' + st.tag + ' is in REMEDIATION');
    ok(st.shape && st.expect && st.accept && st.accept.length && st.hint && st.hint2, tag + 'Medium fields');
    (st.accept || []).forEach(function (g) { g.forEach(function (a) { try { new RegExp(a, 'i'); } catch (e) { ok(false, tag + 'accept regex ' + a); } }); });
    (st.reject || []).forEach(function (r) { try { new RegExp(r.re, 'i'); } catch (e) { ok(false, tag + 'reject regex ' + r.re); } ok(r.hint, tag + 'reject hint'); });
    /* 2 hints never give the answer */
    var hints = (st.wrong || []).map(function (w) { return w[1]; }).concat([st.hint, st.hint2], (st.reject || []).map(function (r) { return r.hint; }));
    var a = norm(st.ok).replace(/^[:,.] /, '');
    hints.forEach(function (h) {
      if (a.length >= 5) ok(norm(h).indexOf(a) < 0, tag + 'a hint contains the answer: ' + h);
      if (/^\d+$/.test(a)) ok(norm(h).indexOf(a) < 0, tag + 'a hint contains the figure: ' + h);
    });
    /* 3 */
    var lens = all.map(function (t) { return t.length; });
    if (lens[0] > Math.max.apply(null, lens.slice(1))) longest++;
    var order = G.options(st); ok(order.length === 4 && order.filter(function (o) { return o.ok; }).length === 1, tag + 'options(): four, one right');
    order.forEach(function (o, i) { if (o.ok) pos[i]++; });
    /* 5 */
    ok(G.localCheck(st, st.ok).verdict === 'accept', tag + 'the right option passes the rule check');
    (st.wrong || []).forEach(function (w) { ok(G.localCheck(st, w[0]).verdict !== 'accept', tag + 'wrong option accepted by the rule check: ' + w[0]); });
  });
  ok(longest <= flat.length / 3, pid + ': the right option is the longest in ' + longest + ' of ' + flat.length + ' steps (max a third)');
  ok(Math.min.apply(null, pos) >= flat.length / 8, pid + ': positions of the right option ' + pos.join(' / '));
  console.log('  right option longest in ' + longest + ' steps · positions ' + pos.join(' / '));

  /* 4 the essay */
  var es = G.essay(sc, G.key(sc)), n = words(es.text);
  if (SHOW) console.log('\n' + es.text + '\n(' + n + ' words)\n');
  ok(es.panes.every(function (t) { return t.length > 40; }), pid + ': four paragraphs');
  ok(n >= 160 && n <= 190, pid + ': ' + n + ' words (160–190)');
  ok(!/\s[,.;:]|,,|\.\.|  |,\./.test(es.text), pid + ': no broken joins');
  es.panes.forEach(function (t, i) { ok(/^[A-Z]/.test(t) && /\.$/.test(t), pid + ': paragraph ' + (i + 1) + ' starts with a capital and ends with a full stop'); W.sentences(t).forEach(function (s) { ok(/^[A-Z]/.test(s), pid + ': sentence starts with a capital: ' + s.slice(0, 30)); }); });
  var pre = W.preflight(es.text, p);
  pre.rows.forEach(function (r) { ok(r.status === 'ok', pid + ': ward ' + r.id + ' is ' + r.status + ' (' + r.label + ')'); });
  ok(!/\d/.test(es.panes[1].replace(/\b(19|20)\d\d\b/g, '')), pid + ': no figure in the overview');
  /* every "NNN thousand" in the essay is a value of the chart; with a year in the same clause, the value of that year */
  if (p.data && p.data.series) {
    var vals = {}; p.data.series.forEach(function (s) { s.values.forEach(function (v, i) { vals[v] = vals[v] || []; vals[v].push({ name: s.name, year: p.data.x[i] }); }); });
    var m, re = /(\d{3}) thousand(?: visitors)?(?: in (\d{4}))?/g, body = es.panes[2] + ' ' + es.panes[3], count = 0;
    while ((m = re.exec(body))) { count++; ok(vals[m[1]], pid + ': figure ' + m[1] + ' is on the chart'); if (m[2] && vals[m[1]]) ok(vals[m[1]].some(function (v) { return String(v.year) === m[2]; }), pid + ': ' + m[1] + ' belongs to ' + m[2]); }
    ok(count >= 8, pid + ': ' + count + ' figures in the detail paragraphs');
    W.sentences(body).forEach(function (s) { ok(/\d/.test(s), pid + ': a body sentence without a figure: ' + s); });
  }

  /* 5 the Medium table */
  (MEDIUM[pid] || []).forEach(function (row) {
    var st = flat.filter(function (x) { return x.step.id === row[0]; })[0]; if (!st) { ok(false, pid + ': no step ' + row[0]); return; }
    var v = G.localCheck(st.step, row[1]).verdict;
    ok(row[2] === 'not-accept' ? v !== 'accept' : v === row[2], pid + ' ' + row[0] + ' "' + row[1] + '" → ' + v + ' (want ' + row[2] + ')');
  });
  flat.forEach(function (x) { ok((MEDIUM[pid] || []).some(function (r) { return r[0] === x.step.id; }), pid + ' ' + x.step.id + ': has Medium rows in the test table'); });

  /* 6 free text joins cleanly */
  var typed = {}, k = G.key(sc);
  flat.forEach(function (x) { var t = k[x.step.id]; typed[x.step.id] = (x.step.post ? t.toLowerCase() + x.step.post + ' ' : '  ' + t.toLowerCase() + ' ').replace(/the (science|art|history) (museum|gallery)/g, function (m0) { return m0.replace(/\b[a-z]/g, function (c0, i0) { return i0 ? c0.toUpperCase() : c0; }); }); });
  var es2 = G.essay(sc, typed);
  ok(norm(es2.text) === norm(es.text), pid + ': lower-case answers with stray punctuation build the same sentences');
  ok(es2.panes.every(function (t) { return /^[A-Z]/.test(t) && !/\s[,.;:]|,,|\.\./.test(t); }), pid + ': capitals and joins are repaired');
});
console.log(fails ? '\nguide-test: ' + fails + ' FAILED, ' + oks + ' ok' : '\nguide-test: all ' + oks + ' checks passed');
process.exit(fails ? 1 : 0);
