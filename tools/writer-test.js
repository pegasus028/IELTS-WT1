#!/usr/bin/env node
/* ===========================================================================
   QUILLMOOR OBSERVATORY — tools/writer-test.js
   Node checks for the Scriptorium's rule-based checkers (writer.js) and the
   levelled example lines (example-levels.js). Oct 2026, upgrade round 1
   (WP9, WP11, WP13).

     node tools/writer-test.js            run every check, exit 1 on failure
     node tools/writer-test.js --table    also print the pass table for the
                                          free-text items (A1–C1 personas)

   What it checks
     1  The 48 model answers run through Writer.preflight: the prep ward
        (preposition with a figure) has ZERO hits on the models, and the
        compare / sequence ward is never red on a model.
     2  The 11 free-text items (overview / claimnum / para) with the keyed
        persona answers from the harness (A2, B1, B2, C1 — written to pass)
        all pass checkOverview / checkClaim / checkPara; the A1 answers are
        reported (table) and the ones that SHOULD pass (no figures in an
        overview, the right length, the main features named in plain words)
        are asserted.
     3  WP11 prep ward: "rose in 2010", "fell in 2020 to 5%", "stayed at
        roughly the same level" are not hits; "rose at 40%" still is.
     4  WP13 overview groups: "went up / goes up / an increase / growth /
        higher" satisfy a rise group; "went down / a decrease / drop / lower"
        a fall group; the note names the feature in plain words.
     5  example-levels.js: every mode has at least two source prompts; every
        source prompt exists and has the mode; every box has A2, B1 and B2
        (plan boxes also C1); every figure in a line exists in the prompt's
        data (values, years, label numbers, thousand / million expansions);
        big-picture lines carry no figures; overview lines begin "Overall";
        Writer.examples never returns the prompt's own model or its own lines.
   =========================================================================== */
'use strict';
var fs = require('fs'), path = require('path'), vm = require('vm');
var ROOT = path.resolve(__dirname, '..');
var TABLE = process.argv.indexOf('--table') >= 0;
var HARNESS = process.env.WT1_HARNESS || '/home/claude/wt1-harness';

var ctx = { console: console, localStorage: { getItem: function () { return null; }, setItem: function () {} } };
ctx.window = ctx; vm.createContext(ctx);
function load(f) { var fp = path.join(ROOT, f); if (!fs.existsSync(fp)) return false; vm.runInContext(fs.readFileSync(fp, 'utf8'), ctx, { filename: f }); return true; }
['content.js', 'prompts.js', 'prompts-2.js', 'prompts-3.js', 'models.js', 'models-2.js'].forEach(load);
for (var i = 0; i < 15; i++) load('topic-' + String(i).padStart(2, '0') + '.js');
load('charts.js'); var hasEx = load('example-levels.js'); load('writer.js'); load('bootcamp.js');
var C = ctx.CONTENT, W = ctx.Writer;
var errors = [], infos = [];
function err(m) { errors.push(m); }
function info(m) { infos.push(m); }
function promptById(id) { return C.PROMPTS.filter(function (p) { return p.id === id; })[0] || null; }
function modelOf(pid) { return C.MODELS.filter(function (m) { return m.promptId === pid; })[0] || null; }
function modelText(m) { return m.paragraphs.map(function (q) { return q.text; }).join('\n\n'); }

/* ------------------------------------------------ 1 models: prep ward */
var prepHits = 0;
C.MODELS.forEach(function (m) {
  var p = promptById(m.promptId); if (!p) return;
  var pre = W.preflight(modelText(m), p);
  pre.rows.forEach(function (r) {
    if (r.id === 'prep') { prepHits++; err(m.id + ': prep ward hit on a model — ' + r.label); }
    if ((r.id === 'compare' || r.id === 'sequence') && r.status === 'bad') err(m.id + ': ' + r.id + ' ward red on a model — ' + r.label);
  });
});
info('prep ward hits on the 48 models: ' + prepHits);

/* ------------------------------------------------ 2 free-text items */
var FREE = [];
C.TOPICS.forEach(function (t) { t.levels.forEach(function (lv) {
  lv.subs.forEach(function (s) { s.items.forEach(function (it) { if (/^(overview|claimnum|para)$/.test(it.type)) FREE.push(it); }); });
  lv.check.items.forEach(function (it) { if (/^(overview|claimnum|para)$/.test(it.type)) FREE.push(it); });
}); });
if (FREE.length !== 11) err('expected 11 free-text items, found ' + FREE.length);
function check(it, text) {
  return it.type === 'overview' ? W.checkOverview(text, it) : it.type === 'claimnum' ? W.checkClaim(text, it) : W.checkPara(text, it);
}
/* "keyed" = the perfect student's answers (tools-agent-items/perfect.json), written to pass every checker;
   a1–c1 are the simulated personas: they carry deliberate faults, so only the table reports them. */
var PERSONAS = ['keyed', 'a1', 'a2', 'b1', 'b2', 'c1'], answers = {};
PERSONAS.forEach(function (lv) {
  var f = lv === 'keyed' ? path.join(HARNESS, 'tools-agent-items', 'perfect.json') : path.join(HARNESS, 'personas', 'parts', lv + '-items.json');
  if (!fs.existsSync(f)) { info('no persona file ' + f + ' (skipped)'); return; }
  answers[lv] = JSON.parse(fs.readFileSync(f, 'utf8')).items || {};
});
/* A1 answers that the checkers should accept once plain words count (WP13):
   an honest A1 attempt is not wrong when it says "go up" for "rose". */
var A1_SHOULD_PASS = { m03s3q5: 1, m08s3q7: 1, m09s3q7: 1, m04s3q5: 1, m04ckq8: 1 };
var table = [];
FREE.forEach(function (it) {
  var row = { id: it.id, type: it.type };
  PERSONAS.forEach(function (lv) {
    if (!answers[lv]) { row[lv] = '-'; return; }
    var a = answers[lv][it.id]; if (typeof a !== 'string') { row[lv] = '-'; return; }
    var r = check(it, a); row[lv] = r.ok ? 'pass' : 'FAIL'; row[lv + 'notes'] = r.notes;
    if (lv === 'keyed' && !r.ok) err(it.id + ' keyed answer fails: ' + r.notes.join(' | '));
    if (lv === 'a1' && A1_SHOULD_PASS[it.id] && !r.ok) err(it.id + ' A1 answer should pass now: ' + r.notes.join(' | '));
  });
  table.push(row);
});
if (TABLE) {
  console.log('\nitem        type      keyed A1    A2    B1    B2    C1');
  table.forEach(function (r) { console.log([r.id.padEnd(11), r.type.padEnd(9)].concat(PERSONAS.map(function (lv) { return String(r[lv]).padEnd(5); })).join(' ')); });
  table.forEach(function (r) { if (r.a1 === 'FAIL') console.log('  A1 ' + r.id + ': ' + r.a1notes.join(' | ')); });
  console.log('');
}

/* ------------------------------------------------ 3 WP11 prep ward */
function prepRow(text) { return W.preflight(text, { mode: 'TREND', data: {}, labels: [] }).rows.filter(function (r) { return r.id === 'prep'; })[0] || null; }
['Sales rose in 2010 and then fell in 2020 to 5%.', 'The figure stayed at roughly the same level.', 'Unemployment fell in 2015, from 8% to 5%.', 'Output remained at about the same level throughout.'].forEach(function (t) {
  if (prepRow(t)) err('WP11: prep ward should ignore: "' + t + '" — ' + prepRow(t).label);
});
['The figure rose at 40% in 2010.', 'Sales increased in 20 million.', 'The number fell of 15%.'].forEach(function (t) {
  if (!prepRow(t)) err('WP11: prep ward should still catch: "' + t + '"');
});

/* ------------------------------------------------ 4 WP13 overview groups */
var ovItem = { type: 'overview', chart: 'p-line-museums', must: [['science'], ['art', 'history'], ['rose', 'increased'], ['fell', 'declined']], minWords: 20, maxWords: 70 };
[['Overall, the Science Museum went up a lot over the period, while the Art Gallery and the History Museum went down at the same time.', true],
 ['Overall, there was growth for the Science Museum over the ten years, whereas the Art Gallery and the History Museum saw a decrease in visitors.', true],
 ['Overall, the number for the Science Museum was higher at the end, while the Art Gallery and the History Museum had a drop over the period.', true],
 ['Overall, the Science Museum goes up every year, and the Art Gallery and the History Museum go down every year over the whole period.', true],
 ['Overall, the Science Museum was popular and the Art Gallery and the History Museum were also popular over the whole period of ten years.', false]
].forEach(function (c) {
  var r = W.checkOverview(c[0], ovItem);
  if (r.ok !== c[1]) err('WP13: expected ' + (c[1] ? 'pass' : 'fail') + ' for "' + c[0].slice(0, 60) + '…": ' + r.notes.join(' | '));
});
var miss = W.checkOverview('Overall, the Science Museum was popular and the Art Gallery and the History Museum were also popular over the whole period of ten years.', ovItem);
if (!miss.notes.some(function (n) { return /say what rose \(went up/.test(n); })) err('WP13: the missing-feature note should read "say what rose (went up …)": ' + miss.notes.join(' | '));

/* ------------------------------------------------ 5 example-levels.js */
var EX = ctx.EXAMPLE_LEVELS;
if (!hasEx || !EX) err('example-levels.js missing or window.EXAMPLE_LEVELS not set');
function allowedNumbers(p) {
  var out = {};
  function add(v) { if (v == null || v === '') return; String(v).split(/[^0-9.]+/).forEach(function (s) { if (s && /\d/.test(s)) out[s.replace(/\.0+$/, '')] = 1; }); }
  function addVal(v) {
    if (typeof v !== 'number') { add(v); return; }
    add(v); add(v * 1000); add(v * 1000000); add(Math.round(v * 10) / 10);
    out[v.toLocaleString('en-US')] = 1; out[(v * 1000).toLocaleString('en-US')] = 1; out[(v * 1000000).toLocaleString('en-US')] = 1;
  }
  var d = p.data || {};
  (d.x || []).forEach(add); (d.categories || []).forEach(add); (d.cols || []).forEach(add);
  (d.series || []).forEach(function (s) { add(s.name); s.values.forEach(addVal); });
  (d.rows || []).forEach(function (r) { add(r[0]); r.slice(1).forEach(addVal); });
  (d.charts || []).forEach(function (c) { add(c.title); c.slices.forEach(function (s) { add(s.name); addVal(s.value); }); });
  (d.stages || []).forEach(function (s) { add(s.n); add(s.label); add(s.detail); });
  (d.panels || []).forEach(function (pn) { add(pn.title); pn.features.forEach(function (f) { add(f.name); add(f.note); }); });
  (d.parts || []).forEach(function (pt) { add(pt.title); var dd = pt.data || {}; (dd.categories || []).forEach(add); (dd.x || []).forEach(add); (dd.cols || []).forEach(add); (dd.series || []).forEach(function (s) { add(s.name); s.values.forEach(addVal); }); (dd.rows || []).forEach(function (r) { add(r[0]); r.slice(1).forEach(addVal); }); });
  add(p.rubric); (p.labels || []).forEach(add);
  return out;
}
function numsIn(text) { var m = String(text).match(/\d[\d,]*(?:\.\d+)?/g) || []; return m.map(function (s) { return s.replace(/,/g, ''); }); }
var PLAN_KEYS = ['big', 'groupA', 'groupB'], PARA_KEYS = ['intro', 'overview', 'detailA', 'detailB'];
if (EX) Object.keys(EX).forEach(function (mode) {
  var srcs = Object.keys(EX[mode]);
  if (srcs.length < 2) err('example-levels ' + mode + ': needs at least two source prompts, has ' + srcs.length);
  srcs.forEach(function (pid) {
    var p = promptById(pid), lines = EX[mode][pid];
    if (!p) { err('example-levels ' + mode + ': prompt ' + pid + ' not in the bank'); return; }
    if (p.mode !== mode) err('example-levels: ' + pid + ' is ' + p.mode + ', filed under ' + mode);
    var ok = allowedNumbers(p);
    PLAN_KEYS.concat(PARA_KEYS).forEach(function (key) {
      var box = lines[key]; if (!box) { err('example-levels ' + pid + ': no ' + key); return; }
      (PLAN_KEYS.indexOf(key) >= 0 ? ['A2', 'B1', 'B2', 'C1'] : ['A2', 'B1', 'B2']).forEach(function (lv) {
        var t = box[lv];
        if (!t) { err('example-levels ' + pid + ' ' + key + ': no ' + lv); return; }
        var nums = numsIn(t).filter(function (n) { return !/^(19|20)\d\d$/.test(n); });
        if (key === 'big') { var bc = W.checkOverview('Overall, ' + t, { chart: pid, must: [], minWords: 1, maxWords: 200 }); if (bc.notes.some(function (n) { return /No figures/.test(n); })) err('example-levels ' + pid + ' big ' + lv + ' carries a figure'); }
        if (key === 'overview') {
          if (!/^Overall,/.test(t)) err('example-levels ' + pid + ' overview ' + lv + ' must begin "Overall,"');
          var wn = W.words(t); if (wn < 20 || wn > 70) err('example-levels ' + pid + ' overview ' + lv + ': ' + wn + ' words (20–70)');
          var oc = W.checkOverview(t, { chart: pid, must: [], minWords: 20, maxWords: 70 });
          if (!oc.ok) err('example-levels ' + pid + ' overview ' + lv + ' fails checkOverview: ' + oc.notes.join(' | '));
        }
        nums.forEach(function (n) { if (!ok[n]) err('example-levels ' + pid + ' ' + key + ' ' + lv + ': figure ' + n + ' is not in the prompt data'); });
        if (key === 'detailA' || key === 'detailB') {
          var c = W.checkPara(t, { chart: pid, mode: mode, minWords: 25, maxWords: 95 });
          if (!c.ok) err('example-levels ' + pid + ' ' + key + ' ' + lv + ' fails checkPara: ' + c.notes.join(' | '));
        }
        if (key === 'intro') { var r = W.preflight(t, p).rows.filter(function (x) { return x.id === 'rubric'; })[0]; if (r && r.status === 'bad') err('example-levels ' + pid + ' intro ' + lv + ' copies the rubric'); }
      });
    });
  });
});
/* Writer.examples never hands back the prompt's own words. */
if (W.examples) C.PROMPTS.forEach(function (p) {
  var own = modelOf(p.id), ownTexts = own ? own.paragraphs.map(function (q) { return q.text; }) : [];
  var mine = EX && EX[p.mode] && EX[p.mode][p.id];
  PLAN_KEYS.concat(PARA_KEYS).forEach(function (key) {
    ['A2', 'B1', 'B2', 'C1'].forEach(function (lv) {
      var list = W.examples(key, lv, p);
      if (!list.length) err('Writer.examples(' + key + ', ' + lv + ', ' + p.id + ') is empty');
      list.forEach(function (e) {
        if (e.from === p.id) err('Writer.examples(' + key + ', ' + lv + ', ' + p.id + ') returned its own prompt');
        if (ownTexts.indexOf(e.text) >= 0) err('Writer.examples(' + key + ', ' + lv + ', ' + p.id + ') returned its own model text');
        if (mine && mine[key] && mine[key][lv] === e.text) err('Writer.examples(' + key + ', ' + lv + ', ' + p.id + ') returned its own levelled line');
      });
    });
  });
});

/* ------------------------------------------- handover item 7: wording after the report is sent */
(function () {
  var Wr = ctx.Writer, pid = C.PROMPTS[0].id;
  var short = 'The chart shows things. It is interesting.';
  var a = Wr.preflight(short, pid), b = Wr.preflight(short, pid, { sent: true });
  if (!(a.bad > 0 && /before you submit/.test(a.summary))) err('item 7: an unsent report should say "to fix before you submit" (' + a.summary + ')');
  if (!/next time/.test(b.summary) || /before you submit/.test(b.summary)) err('item 7: a sent report must say "to fix next time" (' + b.summary + ')');
  if (!/next time/.test(a.sentSummary)) err('item 7: sentSummary must say "to fix next time" (' + a.sentSummary + ')');
  var src = fs.readFileSync(path.join(ROOT, 'student.js'), 'utf8');
  if (src.indexOf('res.preflight.sentSummary') < 0) err('item 7: the owl result (student.js) must show sentSummary');
  info('item 7: sent wording "' + b.summary + '"');
})();

/* ------------------------------------------------------------ report */
infos.forEach(function (m) { console.log('info  ' + m); });
errors.forEach(function (m) { console.log('ERROR ' + m); });
console.log(errors.length ? errors.length + ' error(s)' : 'OK · writer-test: models clean of prep hits, ' + FREE.length + ' free-text items, example lines verified');
process.exit(errors.length ? 1 : 0);
