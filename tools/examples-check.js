/* ===========================================================================
   tools/examples-check.js — handover item 9 (21 Oct 2026)
   The Band 8 student's examples in example-real.js:
     1  every `from` chart exists, and the example's mode is that chart's mode;
     2  every figure in a paragraph or a filled line is in that chart's data;
     3  overviews start "Overall," and carry no data values (checkOverview);
        detail paragraphs pass checkPara; intros do not copy the rubric;
     4  Writer.examples(box, 'S8', prompt) and the Workshop's C1 sample never
        return an example written on the prompt they are shown on — tried for
        every prompt in the bank and every box / line;
     5  the three COMPARE lines excluded after the walkthrough (c-ov-ext, c-a,
        c-b) are absent. The two Band 8 COMPARE lines with claim words (c-top
        "by some distance", c-bottom "only") are cast and checked in
        tools/lab-check-test.js (C1 c-top / C1 c-bottom cases).
   node tools/examples-check.js
   =========================================================================== */
'use strict';
var fs = require('fs'), path = require('path'), vm = require('vm');
var ROOT = path.resolve(__dirname, '..');
var store = {};
var ctx = { console: console, localStorage: { getItem: function (k) { return store[k] || null; }, setItem: function (k, v) { store[k] = String(v); }, removeItem: function (k) { delete store[k]; } }, navigator: {}, setTimeout: setTimeout, clearTimeout: clearTimeout };
ctx.window = ctx; vm.createContext(ctx);
function load(f) { var fp = path.join(ROOT, f); if (!fs.existsSync(fp)) return false; vm.runInContext(fs.readFileSync(fp, 'utf8'), ctx, { filename: f }); return true; }
['content.js', 'prompts.js', 'prompts-2.js', 'prompts-3.js', 'models.js', 'models-2.js'].forEach(load);
for (var i = 0; i < 15; i++) load('topic-' + String(i).padStart(2, '0') + '.js');
['charts.js', 'template.js', 'example-levels.js', 'example-real.js', 'writer.js'].forEach(load);
var C = ctx.CONTENT, W = ctx.Writer, R = ctx.EXAMPLE_REAL, errors = [], n = 0;
function err(m) { errors.push(m); }
function promptById(id) { return C.PROMPTS.filter(function (p) { return p.id === id; })[0] || null; }
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

if (!R || !R.paras || !R.lines) { console.log('example-real.js missing'); process.exit(1); }
/* 1–3 */
R.paras.concat(R.lines).forEach(function (x) {
  n++;
  var p = promptById(x.from), what = (x.box || x.line) + ' (' + x.from + ')';
  if (!p) { err(what + ': chart not in the bank'); return; }
  if (p.mode !== x.mode) err(what + ': filed under ' + x.mode + ' but the chart is ' + p.mode);
  var ok = allowedNumbers(p), t = x.text || x.example || '';
  /* a figure is exact, or an approximation ("just over 400 thousand" for 420) within 10 % of a value on the chart */
  var vals = Object.keys(ok).map(Number).filter(function (v) { return isFinite(v) && v > 0; });
  (String(t).match(/(?:(?:just |slightly |a little )?(?:over|under|about|around|nearly|almost|approximately|roughly|close to|more than|less than)\s+)?\d[\d,]*(?:\.\d+)?/gi) || []).forEach(function (raw) {
    var v = raw.replace(/^[^\d]*/, '').replace(/,/g, ''), approx = /^\D/.test(raw);
    if (/^(19|20)\d\d$/.test(v) || ok[v]) return;
    if (approx && vals.some(function (d) { return Math.abs(d - Number(v)) <= d * 0.1; })) return;
    err(what + ': figure ' + raw.trim() + ' is not in the chart data');
  });
  if (x.line && !/\[[^\]]+\]/.test(x.frame || '')) err(what + ': the frame has no [Slot]');
  if (x.line && /\d/.test(String(x.frame || '').replace(/\[[^\]]*\]/g, ''))) err(what + ': a number in the frame');
  if (x.box === 'overview') {
    if (!/^Overall,/.test(t)) err(what + ': overview must begin "Overall,"');
    var oc = W.checkOverview(t, { chart: x.from, must: [], minWords: 20, maxWords: 70 });
    if (!oc.ok) err(what + ': overview fails checkOverview: ' + oc.notes.join(' | '));
  }
  if (x.box === 'detailA' || x.box === 'detailB') {
    var c = W.checkPara(t, { chart: x.from, mode: x.mode, minWords: 25, maxWords: 95 });
    if (!c.ok) err(what + ': fails checkPara: ' + c.notes.join(' | '));
  }
  if (x.box === 'intro') { var r = W.preflight(t, p).rows.filter(function (q) { return q.id === 'rubric'; })[0]; if (r && r.status === 'bad') err(what + ': copies the rubric'); }
});
/* 4 */
var shown = 0;
C.PROMPTS.forEach(function (p) {
  ['intro', 'overview', 'detailA', 'detailB'].forEach(function (key) {
    W.examples(key, 'S8', p).forEach(function (e) { shown++; if (e.from === p.id) err('Scriptorium ' + key + ' on ' + p.id + ' shows its own chart'); if (!e.real) err('S8 example not marked real'); });
  });
});
if (!shown) err('Writer.examples(…, "S8", …) never returned a Band 8 example');
/* the Workshop sample picker: lab.js needs a DOM, so check its source guards the chart */
var labSrc = fs.readFileSync(path.join(ROOT, 'lab.js'), 'utf8');
if (!/x\.from !== avoid/.test(labSrc)) err('lab.js sampleFor: the Band 8 line is not filtered by the chart in use (avoid)');
var html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
if (html.indexOf('example-real.js') < 0 || html.indexOf('example-real.js') > html.indexOf('writer.js?') || html.indexOf('example-real.js') > html.indexOf('lab.js?')) err('index.html must load example-real.js before writer.js and lab.js');
/* 5 */
['c-ov-ext', 'c-a', 'c-b'].forEach(function (id) { if (R.lines.some(function (x) { return x.line === id; })) err('excluded COMPARE line ' + id + ' is back in example-real.js'); });

errors.forEach(function (m) { console.log('ERROR ' + m); });
console.log(errors.length ? errors.length + ' error(s)' : 'OK · examples-check: ' + n + ' Band 8 examples verified, ' + shown + ' Scriptorium showings never on their own chart');
process.exit(errors.length ? 1 : 0);
