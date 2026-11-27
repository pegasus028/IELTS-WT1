#!/usr/bin/env node
/* ===========================================================================
   QUILLMOOR · THE OBSERVATORY — tools/orrery-test.js  (26 Nov 2026)
   Runs the Orrery program (orrery-engine.js) on every chart it fits, at
   Band 6, 7 and 8, and checks what it writes.

     node tools/orrery-test.js              checks, one line per chart × band
     node tools/orrery-test.js --print      also print the 13 values + report
     node tools/orrery-test.js p-line-ev    only charts whose id contains this
     node tools/orrery-test.js --groups     the grouping each chart gets vs the
                                            prompt's own groupings (info)

   Checks per chart × band
     1  all 13 variables filled; no "undefined", "NaN", "Infinity"
     2  Template.Data.check (the Spellbook's own data checker) gives no "bad"
        on any variable (visual, what, years, groups, figures)
     3  trend phrases: Orrery.checkMove accepts its own moveA / moveB
     4  the overview variables (moveA, moveB, feature) carry no figure
     5  [What It Shows] shares no run of 8+ words with the task sentence
     6  the compiled report: four paragraphs, 150–200 words (target
        160–190 is reported), Writer.preflight has no red row
     7  every figure in the report is in the chart data (exact, or within
        half a gridline after an approximation word) — Template.Data.numbers
     8  Band 8 report has a 7→8 add-on (relative / participle clause, or a
        fronted time phrase); Band 6 has none of the Band 8 multiples
   Exit code 1 on any error.
   =========================================================================== */
'use strict';
var fs = require('fs'), path = require('path'), vm = require('vm');
var ROOT = path.resolve(__dirname, '..');
var argv = process.argv.slice(2);
var PRINT = argv.indexOf('--print') >= 0, GROUPS = argv.indexOf('--groups') >= 0;
var ONLY = argv.filter(function (a) { return a.indexOf('--') !== 0; });

var ctx = { console: console };
ctx.window = ctx;
vm.createContext(ctx);
function load(f) { vm.runInContext(fs.readFileSync(path.join(ROOT, f), 'utf8'), ctx, { filename: f }); }
['content.js', 'prompts.js', 'prompts-2.js', 'prompts-3.js', 'template.js', 'lab-content.js', 'charts.js', 'writer.js', 'orrery-content.js', 'orrery-engine.js'].forEach(load);
var O = ctx.Orrery, TD = ctx.Template.Data, W = ctx.Writer, LAB = ctx.LabContent;
var P = ctx.CONTENT.PROMPTS;
function byId(id) { return P.filter(function (p) { return p.id === id; })[0]; }
var defs = {}; LAB.MODES.TREND.vars.forEach(function (d) { defs[d.key] = d; });

var errors = 0, warns = 0, lines = [];
function err(id, b, m) { errors++; lines.push('  ✗ ' + id + ' B' + b + ': ' + m); }
function warn(id, b, m) { warns++; lines.push('  ! ' + id + ' B' + b + ': ' + m); }

function words(s) { return String(s).toLowerCase().replace(/[^a-z0-9% ]+/g, ' ').split(/\s+/).filter(Boolean); }
function longestRun(a, b) {
  var A = words(a), B = words(b), best = 0;
  for (var i = 0; i < A.length; i++) for (var j = 0; j < B.length; j++) { var k = 0; while (A[i + k] && A[i + k] === B[j + k]) k++; if (k > best) best = k; }
  return best;
}

var ids = O.charts().filter(function (id) { return !ONLY.length || ONLY.some(function (o) { return id.indexOf(o) >= 0; }); });
var agree = 0;
ids.forEach(function (id) {
  var p = byId(id), sig = O.signals(p);
  if (GROUPS) {
    var g = sig.groups, A = g.A.map(function (i) { return sig.series[i].label; }), B = g.B.map(function (i) { return sig.series[i].label; });
    var cur = (p.groupings || []).map(function (x) { return x.slice().sort().join('+'); }).sort().join(' | ');
    var mine = g.rule === 'phases' ? (p.groupings || []).map(function (x) { return x.slice().sort().join('+'); }).sort().join(' | ') : [A.slice().sort().join('+'), B.slice().sort().join('+')].sort().join(' | ');
    if (g.rule === 'phases') mine = [sig.x.slice(g.phase.A[0], g.phase.A[1] + 1).join('+'), sig.x.slice(g.phase.B[0], g.phase.B[1] + 1).join('+')].map(function (s) { return s.split('+').sort().join('+'); }).sort().join(' | ');
    var same = mine === cur; if (same) agree++;
    console.log((same ? '= ' : '≠ ') + id + '  ' + g.q + ' ' + g.rule + '\n    program: ' + mine + '\n    prompt:  ' + cur);
    sig.series.forEach(function (s) { console.log('      ' + s.label + ': ' + s.cls + ' deg ' + s.deg + ' share ' + Math.round(s.share * 100) + '% range ' + Math.round(s.range * 100) + '% rel ' + (isFinite(s.rel) ? Math.round(s.rel * 100) + '%' : '∞')); });
    return;
  }
  O.BANDS.forEach(function (b) {
    var D = O.derive(p, b), v = D.vars;
    /* 1 */
    O.VARS.forEach(function (d) { var x = v[d.key]; if (!x || /undefined|NaN|Infinity/.test(x)) err(id, b, d.key + ' empty or broken: "' + x + '"'); });
    /* 2 */
    O.VARS.forEach(function (d) {
      if (d.key === 'moveA' || d.key === 'moveB') return;
      var r = TD.check(defs[d.key], v[d.key], p, { vars: v });
      if (r.status === 'bad') err(id, b, d.key + ' "' + v[d.key] + '" → ' + r.note);
      else if (r.status === 'near') warn(id, b, d.key + ' "' + v[d.key] + '" → ' + r.note);
    });
    /* 3 */
    if (D.groups.rule !== 'phases') {
      [['moveA', D.groups.A], ['moveB', D.groups.B]].forEach(function (m) {
        var r = O.checkMove(p, m[1], v[m[0]], b);
        if (r.status === 'bad') err(id, b, m[0] + ' "' + v[m[0]] + '" fails its own check: ' + r.note);
        else if (r.status === 'near') warn(id, b, m[0] + ' "' + v[m[0]] + '": ' + r.note);
      });
    }
    /* 4 */
    ['moveA', 'moveB', 'feature'].forEach(function (k) { if (/\d/.test(String(v[k]).replace(/\b(18|19|20)\d\d\b/g, ''))) err(id, b, k + ' carries a figure: ' + v[k]); });
    /* 5 */
    var run = longestRun(v.what, p.rubric); if (run >= 8) err(id, b, 'what copies ' + run + ' words of the task sentence'); else if (run >= 7) warn(id, b, 'what shares ' + run + ' words with the task sentence');
    /* 6 */
    var R = O.compile(p, b), n = R.words;
    if (R.paras.length !== 4) err(id, b, 'report has ' + R.paras.length + ' paragraphs');
    if (n < 150 || n > 215) err(id, b, 'report is ' + n + ' words'); else if (n < 160 || n > 190) warn(id, b, 'report is ' + n + ' words (target 160–190)');
    var pf = W.preflight(R.text, p);
    pf.rows.forEach(function (r) { if (r.status === 'bad' || r.status === 'red') err(id, b, 'Ward ' + r.id + ': ' + (r.note || r.msg || '')); else if (r.status === 'warn' || r.status === 'amber') warn(id, b, 'Ward ' + r.id + ': ' + (r.note || r.msg || '')); });
    /* 7 */
    var sents = R.paras.slice(2).join(' ').split(/(?<=\.)\s+/);
    sents.forEach(function (s) {
      TD.numbers(s, p).forEach(function (o) {
        if (o.year != null || o.frac) return;
        var at = s.indexOf(o.raw), before = s.slice(0, at), m = before.match(/((?:just |well |far )?(?:about|around|roughly|nearly|almost|over|under|above|below|more than|less than|approximately)\s+)$/i);
        var ctx15 = before.slice(-14).replace(/^[^ ]* /, '');
        if (!/\b(gap|difference|rise|fall|increase|decrease) of\b|\b(by a further|rose by|fell by)\b/.test(ctx15)) ctx15 = '';
        var r = TD.check({ check: { type: 'figure' } }, (ctx15 && !m ? ctx15 : (m ? m[1] : '')) + o.raw + (/^\s*(thousand|million|billion)/.test(s.slice(at + o.raw.length)) ? s.slice(at + o.raw.length).match(/^\s*(thousand|million|billion)/)[0] : ''), p, {});
        if (r.status === 'bad') err(id, b, 'figure "' + o.raw + '" in "' + s + '" → ' + r.note);
      });
    });
    /* 8 */
    if (b === 8 && !/, which |, when |, overtaking |, falling below |^(Having|Overtaking|Falling below|By \d{4})|\. (Having|Overtaking|Falling below)|which overtook/.test(R.text)) warn(id, b, 'no 7→8 add-on found');
    if (b === 6 && /doubling|tripling|fold/.test(R.text)) err(id, b, 'Band 6 uses a Band 8 multiple');
    /* 9 the exercise: every step has three distinct wrong options and a hint
       that does not give the answer; the Medium check accepts the right value */
    var E = O.exercise(p, b);
    if (E.steps.length < 13) err(id, b, 'exercise has ' + E.steps.length + ' steps');
    E.steps.forEach(function (st) {
      if (!st.ok || st.wrong.length !== 3) err(id, b, 'step ' + st.id + ' has ' + st.wrong.length + ' wrong options');
      var seen = {}; [st.ok].concat(st.wrong.map(function (w) { return w[0]; })).forEach(function (t) { var k = String(t).toLowerCase(); if (seen[k]) err(id, b, 'step ' + st.id + ' repeats an option: ' + t); seen[k] = 1; });
      st.wrong.forEach(function (w) { if (!w[1] || w[1].length < 12) err(id, b, 'step ' + st.id + ' option "' + w[0] + '" has no hint'); if (String(st.ok).length >= 6 && w[1].toLowerCase().indexOf(String(st.ok).toLowerCase()) >= 0) err(id, b, 'step ' + st.id + ' hint gives the answer'); });
      if (st.kind === 'write') { var r = O.checkValue(p, b, st.var, st.ok, D.vars); if (r.status === 'bad') err(id, b, 'Medium check rejects the right value of ' + st.var + ': ' + r.note); else if (r.status === 'near') warn(id, b, 'Medium check: ' + st.var + ' right value only near: ' + r.note); }
    });
    console.log((lines.length ? '' : '') + id + ' B' + b + '  ' + n + ' words · groups ' + D.groups.q + ' ' + D.groups.rule + ' · feature ' + D.feature.kind);
    if (PRINT) {
      O.VARS.forEach(function (d) { console.log('    ' + (d.label + '               ').slice(0, 16) + v[d.key]); });
      console.log('');
      R.paras.forEach(function (x) { console.log('    ' + x); });
      console.log('');
    }
    lines.forEach(function (l) { console.log(l); }); lines = [];
  });
});
if (GROUPS) { console.log('\nPrograms agrees with the prompt groupings on ' + agree + ' of ' + ids.length + ' charts.'); process.exit(0); }
console.log('\n' + ids.length + ' charts × 3 bands · ' + errors + ' errors · ' + warns + ' warnings');
process.exit(errors ? 1 : 0);
