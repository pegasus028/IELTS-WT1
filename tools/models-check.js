#!/usr/bin/env node
/* ===========================================================================
   CHART CONTROL — tools/models-check.js
   Checks every model answer against its prompt, so that no student copies
   the shape of a model with a wrong figure in it.

     node tools/models-check.js            all models
     node tools/models-check.js m-line-ev  one or more model ids (substring)
     node tools/models-check.js --verbose  also print amber rows and info

   Loads content.js, every prompts*.js and models*.js file, charts.js,
   writer.js and bootcamp.js in a plain Node vm with a window shim (no jsdom).
   For each model it checks:
     1  promptId exists; id unique; patterns are S1–S8 (≥3, incl. S1, S2);
        3–5 notes
     2  four paragraphs with roles intro / overview / detail / detail;
        the overview begins "Overall,"
     3  word count (Writer.words on the four paragraphs) is 160–190 and
        equals the `words` field
     4  overview: no digits except years and numbers that are part of a
        label, category, series or column name
     5  every number in the intro and the detail paragraphs exists in the
        prompt data, allowing: unit conversion (420 → 420,000 when units are
        thousands; 29.9 → 29.9 million when units are millions), differences
        and sums within one series / row / column / chart / x-value,
        percentage changes (approximate only), approximations within half a
        gridline (line/bar) or 5% (printed values) after around / about /
        just over / nearly / roughly …, and thresholds after over / under /
        passing / below / above … (a data value must lie on that side)
     6  every detail sentence carries a figure or names a label / stage /
        feature
     7  every label of the prompt is mentioned (Writer's own matcher);
        SEQUENCE: every stage named (amber if only its detail words appear);
        SPACE: map features never named are listed as info
     8  no run of 8+ words copied from the rubric
     9  a 7→8 add-on is present (relative clause, participle clause,
        with + noun + -ing, or a fronted time phrase)
    10  Writer.preflight(text, prompt): every red row is an error; amber
        rows are listed with --verbose
   Also: every prompt has a model; a prompt's modelId points to a model;
   Bootcamp.build and Charts.describe run on every prompt without throwing.
   Exit code 1 if any error.
   =========================================================================== */
'use strict';
var fs = require('fs'), path = require('path'), vm = require('vm');
var ROOT = path.resolve(__dirname, '..');
var argv = process.argv.slice(2);
var VERBOSE = argv.indexOf('--verbose') >= 0;
var ONLY = argv.filter(function (a) { return a.indexOf('--') !== 0; });

/* ------------------------------------------------------------- load */
var ctx = { console: console };
ctx.window = ctx;
vm.createContext(ctx);
function load(f) {
  var fp = path.join(ROOT, f);
  if (!fs.existsSync(fp)) return false;
  vm.runInContext(fs.readFileSync(fp, 'utf8'), ctx, { filename: f });
  return true;
}
var files = fs.readdirSync(ROOT);
function series(prefix) {
  return files.filter(function (f) { return new RegExp('^' + prefix + '(-\\d+)?\\.js$').test(f); })
    .sort(function (a, b) { var na = +(a.match(/-(\d+)\.js$/) || [0, 1])[1], nb = +(b.match(/-(\d+)\.js$/) || [0, 1])[1]; return na - nb; });
}
load('content.js');
var promptFiles = series('prompts'), modelFiles = series('models');
promptFiles.forEach(load); modelFiles.forEach(load);
if (process.env.MODELS_EXTRA) vm.runInContext(fs.readFileSync(process.env.MODELS_EXTRA, 'utf8'), ctx, { filename: process.env.MODELS_EXTRA });   /* test hook */
load('charts.js'); load('writer.js'); load('bootcamp.js');
var C = ctx.CONTENT, W = ctx.Writer;
var PROMPTS = C.PROMPTS, MODELS = C.MODELS;
function promptById(id) { for (var i = 0; i < PROMPTS.length; i++) if (PROMPTS[i].id === id) return PROMPTS[i]; return null; }

/* ------------------------------------------------------------ helpers */
function niceMax(m) {
  if (m <= 0) return 1;
  var p = Math.pow(10, Math.floor(Math.log10(m))), f = m / p;
  var n = f <= 1 ? 1 : f <= 2 ? 2 : f <= 2.5 ? 2.5 : f <= 5 ? 5 : 10;
  return n * p;
}
function lower(s) { return String(s || '').toLowerCase(); }
function sentences(t) { return String(t || '').split(/(?<=[.!?])\s+/).map(function (s) { return s.trim(); }).filter(Boolean); }
function numsInString(s) {
  var out = [], m, re = /(?<![A-Za-z0-9.])(\d{1,3}(?:,\d{3})+|\d+)(?:\.(\d+))?/g;
  s = String(s == null ? '' : s);
  while ((m = re.exec(s))) out.push(parseFloat(m[1].replace(/,/g, '') + (m[2] ? '.' + m[2] : '')));
  return out;
}
function near(a, b, tol) { return Math.abs(a - b) <= (tol || 1e-6) + 1e-9; }

/* Writer's own label matcher, reached through preflight's coverage row. */
function mentions(text, label, mode) {
  var r = W.preflight(text, { mode: mode || 'TREND', labels: [label], data: {} });
  var row = r.rows.filter(function (x) { return x.id === 'coverage'; })[0];
  return row && row.status === 'ok';
}

/* Numeric "families": groups whose members may be compared, subtracted or
   added. Each value carries the tolerance for approximation. */
function families(type, data, units) {
  var fams = [], base = [];
  function push(vals, tol) { vals = vals.filter(function (v) { return typeof v === 'number' && isFinite(v); }); if (vals.length) { fams.push({ vals: vals, tol: tol }); base = base.concat(vals.map(function (v) { return { v: v, tol: tol }; })); } }
  if (type === 'line' || type === 'bar') {
    var all = []; data.series.forEach(function (s) { all = all.concat(s.values); });
    var tol = niceMax(Math.max.apply(null, all) * 1.08) / 5 / 2;
    if (type === 'bar') tol = Math.max(tol / 4, 0.05);           /* bars carry printed data labels */
    if (type === 'bar' && data.series.length > 3) tol = niceMax(Math.max.apply(null, all) * 1.08) / 5 / 2;
    data.series.forEach(function (s) { push(s.values, tol); });
    var xs = data.x || data.categories;
    xs.forEach(function (x, i) { push(data.series.map(function (s) { return s.values[i]; }), tol); });
  } else if (type === 'pie') {
    data.charts.forEach(function (c) { push(c.slices.map(function (s) { return s.value; }), 0.5); });
    var names = []; data.charts.forEach(function (c) { c.slices.forEach(function (s) { if (names.indexOf(s.name) < 0) names.push(s.name); }); });
    names.forEach(function (n) { push(data.charts.map(function (c) { var s = c.slices.filter(function (x) { return x.name === n; })[0]; return s ? s.value : null; }), 0.5); });
  } else if (type === 'table') {
    data.rows.forEach(function (r) { push(r.slice(1), null); });
    for (var c = 1; c < data.cols.length; c++) push(data.rows.map(function (r) { return r[c]; }), null);
  } else if (type === 'process') {
    var pv = []; data.stages.forEach(function (s) { pv = pv.concat(numsInString(s.label + ' ' + (s.detail || ''))); }); push(pv, null);
  } else if (type === 'map') {
    var mv = []; data.panels.forEach(function (pn) { mv = mv.concat(numsInString(pn.title)); pn.features.forEach(function (f) { mv = mv.concat(numsInString(f.name + ' ' + (f.note || ''))); }); }); push(mv, null);
  } else if (type === 'mixed') {
    data.parts.forEach(function (part) { var r = families(part.type, part.data, part.units || ''); fams = fams.concat(r.fams.map(function (f) { f.units = part.units || ''; return f; })); base = base.concat(r.base.map(function (b) { b.units = part.units || ''; return b; })); });
  }
  fams.forEach(function (f) { if (f.units == null) f.units = units; });
  base.forEach(function (b) { if (b.units == null) b.units = units; });
  return { fams: fams, base: base };
}
function scales(units) {
  var u = lower(units), s = [1];
  if (/thousand/.test(u)) s.push(1000);
  if (/million/.test(u)) s.push(1e6);
  if (/billion/.test(u)) s.push(1e9);
  return s;
}
function candidates(p) {
  var f = families(p.type, p.data, p.units || ''), exact = [], derived = [], approxOnly = [];
  function relTol(v, tol) { return tol != null ? tol : Math.max(0.5, Math.abs(v) * 0.05); }
  f.base.forEach(function (b) { scales(b.units).forEach(function (k) { exact.push({ v: b.v * k, tol: relTol(b.v, b.tol) * k, why: 'data' }); }); });
  f.fams.forEach(function (fam) {
    var v = fam.vals, ks = scales(fam.units);
    for (var i = 0; i < v.length; i++) for (var j = 0; j < v.length; j++) {
      if (i === j) continue;
      ks.forEach(function (k) {
        if (i < j) derived.push({ v: Math.abs(v[i] - v[j]) * k, tol: relTol(Math.abs(v[i] - v[j]), fam.tol) * k, why: 'difference' });
        if (i < j) derived.push({ v: (v[i] + v[j]) * k, tol: relTol(v[i] + v[j], fam.tol) * k, why: 'sum', sum: true });
      });
      if (v[i]) approxOnly.push({ v: Math.abs((v[j] - v[i]) / v[i] * 100), tol: 2.5, why: 'percentage change' });
    }
    /* sums of any three or more members (totals, "the remaining X%") */
    if (v.length <= 9) for (var mask = 1; mask < (1 << v.length); mask++) {
      var cnt = 0, sum = 0;
      for (var bit = 0; bit < v.length; bit++) if (mask & (1 << bit)) { cnt++; sum += v[bit]; }
      if (cnt < 3) continue;
      ks.forEach(function (k) { derived.push({ v: sum * k, tol: relTol(sum, fam.tol) * k, why: 'sum of ' + cnt, sum: true }); });
    }
  });
  /* numbers printed in the rubric, title, units, labels, columns, categories */
  var meta = [p.rubric, p.title, p.units].concat(p.labels || []);
  (function walk(t, d) {
    if (!d) return;
    if (d.cols) meta = meta.concat(d.cols);
    if (d.categories) meta = meta.concat(d.categories.map(String));
    if (d.x) meta = meta.concat(d.x.map(String));
    if (d.series) meta = meta.concat(d.series.map(function (s) { return s.name; }));
    if (d.charts) d.charts.forEach(function (c) { meta.push(c.title); c.slices.forEach(function (s) { meta.push(s.name); }); });
    if (d.rows) d.rows.forEach(function (r) { meta.push(String(r[0])); });
    if (d.parts) d.parts.forEach(function (pt) { meta.push(pt.title, pt.units); walk(pt.type, pt.data); });
  })(p.type, p.data);
  var metaNums = []; meta.forEach(function (s) { metaNums = metaNums.concat(numsInString(s)); });
  metaNums.forEach(function (v) { exact.push({ v: v, tol: 0, why: 'label/rubric' }); });
  return { exact: exact, derived: derived, approxOnly: approxOnly, metaNums: metaNums };
}

var APPROX = /(around|about|approximately|roughly|nearly|almost|just over|just under|just below|just above|close to|some|in the region of|an estimated|approaching)\s+(\$)?$/i;
var OVER = /(over|more than|above|exceed(?:ed|ing)?|passing|passed|surpass(?:ed|ing)?|topp(?:ed|ing)|beyond|well over|in excess of|at least)\s+(\$)?$/i;
var UNDER = /(under|less than|fewer than|below|well under|well below|no more than|at most|up to)\s+(\$)?$/i;

function numbersInText(s) {
  var out = [], m, re = /(?<![A-Za-z0-9.])(\$)?(\d{1,3}(?:,\d{3})+|\d+)(?:\.(\d+))?(\s?%)?(?:\s(million|billion|thousand)\b)?/g;
  while ((m = re.exec(s))) {
    var v = parseFloat(m[2].replace(/,/g, '') + (m[3] ? '.' + m[3] : ''));
    var mult = m[5] === 'million' ? 1e6 : m[5] === 'billion' ? 1e9 : m[5] === 'thousand' ? 1e3 : 1;
    var before = s.slice(Math.max(0, m.index - 40), m.index);
    out.push({ raw: m[0].trim(), v: v, abs: v * mult, before: before });
  }
  return out;
}
var SUMCTX = /\b(together|combined|total|in all|altogether|remaining|remainder|the rest|between them|sum|overall)\b/i;
function checkNumber(n, cand, sentence) {
  var vals = [n.v]; if (n.abs !== n.v) vals.push(n.abs);
  var sumsOk = SUMCTX.test(sentence || '');
  cand = { exact: cand.exact, metaNums: cand.metaNums, approxOnly: cand.approxOnly,
    derived: cand.derived.filter(function (d) { return !d.sum || sumsOk; }) };
  if (/\b(19|20)\d\d$/.test(n.raw) && cand.metaNums.indexOf(n.v) >= 0) return 'year';
  var approx = APPROX.test(n.before), over = OVER.test(n.before), under = UNDER.test(n.before);
  var i, k;
  for (k = 0; k < vals.length; k++) {
    for (i = 0; i < cand.exact.length; i++) if (near(vals[k], cand.exact[i].v)) return cand.exact[i].why;
    for (i = 0; i < cand.derived.length; i++) if (near(vals[k], cand.derived[i].v)) return cand.derived[i].why;
  }
  if (approx) for (k = 0; k < vals.length; k++) {
    for (i = 0; i < cand.exact.length; i++) if (cand.exact[i].tol && near(vals[k], cand.exact[i].v, cand.exact[i].tol)) return 'approx ' + cand.exact[i].why;
    for (i = 0; i < cand.derived.length; i++) if (cand.derived[i].tol && near(vals[k], cand.derived[i].v, cand.derived[i].tol)) return 'approx ' + cand.derived[i].why;
    for (i = 0; i < cand.approxOnly.length; i++) if (near(vals[k], cand.approxOnly[i].v, cand.approxOnly[i].tol)) return 'approx ' + cand.approxOnly[i].why;
  }
  if (over || under) for (k = 0; k < vals.length; k++) {
    var x = vals[k];
    var pool = cand.exact.concat(cand.derived);
    for (i = 0; i < pool.length; i++) {
      var d = pool[i].v;
      if (over && d > x && d <= x * 1.35 + 1) return 'threshold';
      if (under && d < x && d >= x * 0.6) return 'threshold';
    }
  }
  return null;
}

/* Entities: the named things a number can belong to (a series, a year, a
   slice, a row, a column). A number in a sentence must belong to an entity
   named in that sentence, in the sentence before it, or in the first
   sentence of its paragraph — this catches a real figure attached to the
   wrong category ("the History Museum … 420,000"). */
function entities(type, data, units) {
  var out = [];
  function add(name, vals, u, tol) { vals = vals.filter(function (v) { return typeof v === 'number' && isFinite(v); }); if (vals.length) out.push({ name: String(name), vals: vals, units: u, tol: tol }); }
  if (type === 'line' || type === 'bar') {
    var all = []; data.series.forEach(function (s) { all = all.concat(s.values); });
    var tol = niceMax(Math.max.apply(null, all) * 1.08) / 5 / 2;
    if (type === 'bar' && data.series.length <= 3) tol = Math.max(tol / 4, 0.05);
    var xs = data.x || data.categories;
    if (data.series.length > 1) {
      data.series.forEach(function (s) { add(s.name, s.values, units, tol); });
      xs.forEach(function (x, i) { add(x, data.series.map(function (s) { return s.values[i]; }), units, tol); });
    } else {
      /* one series: sentences say "two years later", so its values are always in reach */
      add('', data.series[0].values, units, tol); out[out.length - 1].free = true;
    }
  } else if (type === 'pie') {
    var names = []; data.charts.forEach(function (c) { c.slices.forEach(function (s) { if (names.indexOf(s.name) < 0) names.push(s.name); }); });
    names.forEach(function (n) { add(n, data.charts.map(function (c) { var s = c.slices.filter(function (x) { return x.name === n; })[0]; return s ? s.value : null; }), units, 0.5); });
    if (data.charts.length > 1) data.charts.forEach(function (c) { add(c.title, c.slices.map(function (s) { return s.value; }), units, 0.5); });
  } else if (type === 'table') {
    data.rows.forEach(function (r) { add(r[0], r.slice(1), units, null); });
    for (var c = 1; c < data.cols.length; c++) add(data.cols[c].replace(/\s*\(.*?\)\s*/g, ' '), data.rows.map(function (r) { return r[c]; }), units, null);
  } else if (type === 'mixed') {
    data.parts.forEach(function (part) { out = out.concat(entities(part.type, part.data, part.units || '')); });
  }
  return out;
}
function boundCandidates(ents) {
  var exact = [], derived = [], approxOnly = [], pool = [];
  function relTol(v, tol) { return tol != null ? tol : Math.max(0.5, Math.abs(v) * 0.05); }
  ents.forEach(function (e) {
    var ks = scales(e.units);
    e.vals.forEach(function (v) { pool.push({ v: v, e: e }); ks.forEach(function (k) { exact.push({ v: v * k, tol: relTol(v, e.tol) * k, why: 'data (' + e.name + ')' }); }); });
    if (e.vals.length <= 9) for (var mask = 1; mask < (1 << e.vals.length); mask++) {
      var cnt = 0, sum = 0;
      for (var bit = 0; bit < e.vals.length; bit++) if (mask & (1 << bit)) { cnt++; sum += e.vals[bit]; }
      if (cnt >= 2) ks.forEach(function (k) { derived.push({ v: sum * k, tol: relTol(sum, e.tol) * k, why: 'sum', sum: true }); });
    }
  });
  for (var i = 0; i < pool.length; i++) for (var j = 0; j < pool.length; j++) {
    if (i === j) continue;
    var a = pool[i], b = pool[j], ks = scales(a.e.units);
    if (a.e.units !== b.e.units) continue;
    ks.forEach(function (k) {
      if (i < j) derived.push({ v: Math.abs(a.v - b.v) * k, tol: relTol(Math.abs(a.v - b.v), a.e.tol) * k, why: 'difference' });
      if (i < j) derived.push({ v: (a.v + b.v) * k, tol: relTol(a.v + b.v, a.e.tol) * k, why: 'sum', sum: true });
    });
    if (a.v) approxOnly.push({ v: Math.abs((b.v - a.v) / a.v * 100), tol: 2.5, why: 'percentage change' });
  }
  return { exact: exact, derived: derived, approxOnly: approxOnly };
}
var ALIAS = { finland: ['finn'], italy: ['italian'], brazil: ['brazilian'], japan: ['japanese'], thailand: ['thai'], korea: ['korean'],
  germany: ['german'], australia: ['australian'], norway: ['norwegian'], china: ['chinese'], india: ['indian'], vietnam: ['vietnamese'],
  sweden: ['swedish', 'swede'], kenya: ['kenyan'], usa: ['american', 'the us '], singapore: ['singaporean'], 'south-east asia': ['south-east asian'] };
function named(sentence, ents, mode) {
  var ls = lower(sentence);
  return ents.filter(function (e) {
    if (e.free) return true;
    if (mentions(sentence, e.name, mode)) return true;
    return (ALIAS[lower(e.name)] || []).some(function (a) { return ls.indexOf(a) >= 0; });
  });
}

function longestRun(text, rubric) {
  var a = lower(text).replace(/[^a-z0-9 ]/g, ' ').split(/\s+/).filter(Boolean);
  var b = lower(rubric).replace(/[^a-z0-9 ]/g, ' ').split(/\s+/).filter(Boolean);
  var best = 0, run = '';
  for (var i = 0; i < a.length; i++) for (var j = 0; j < b.length; j++) {
    var k = 0; while (i + k < a.length && j + k < b.length && a[i + k] === b[j + k]) k++;
    if (k > best) { best = k; run = a.slice(i, i + k).join(' '); }
  }
  return { n: best, run: run };
}
var ADDON = [
  { name: 'relative clause', re: /, (which|who|whose|where)\b/i },
  { name: 'participle clause', re: /(^|[.;]\s+|, )(having \w+|[A-Z]?\w+ing\b[^,.]{0,60},)|, (reaching|rising|falling|climbing|dropping|making|leaving|overtaking|passing|accounting|finishing|ending|ranging|placing|peaking|leaving|followed|led|helped|driven|replaced|located|situated|surrounded|linked|connected)\b/ },
  { name: 'with + noun + -ing', re: /\bwith\s+(\w+\s+){1,5}\w+ing\b/i },
  { name: 'fronted time phrase', re: /(^|[.]\s+)(By|In|Over|From|Between|After|Before|During|Throughout|Until|Since|At the|Once|Later)\b[^,.]{0,40},/ }
];

/* ------------------------------------------------------------ check */
var errors = 0, warnings = 0, report = [];
var seenIds = {};
function checkModel(m) {
  var E = [], A = [], I = [];
  var p = promptById(m.promptId);
  if (seenIds[m.id]) E.push('duplicate model id'); seenIds[m.id] = 1;
  if (!p) { E.push('promptId "' + m.promptId + '" does not exist'); return { E: E, A: A, I: I }; }
  /* 1 fields */
  var pats = m.patterns || [];
  if (!pats.every(function (x) { return /^S[1-8]$/.test(x); })) E.push('patterns must be S1–S8: ' + pats.join(','));
  if (pats.length < 3) E.push('fewer than three sentence patterns listed');
  if (pats.indexOf('S1') < 0 || pats.indexOf('S2') < 0) E.push('patterns should include S1 and S2');
  if (!m.notes || m.notes.length < 3 || m.notes.length > 5) E.push('notes: need 3–5, found ' + (m.notes || []).length);
  /* 2 paragraphs */
  var roles = (m.paragraphs || []).map(function (x) { return x.role; }).join(',');
  if (roles !== 'intro,overview,detail,detail') E.push('paragraph roles are ' + roles);
  var paras = (m.paragraphs || []).map(function (x) { return x.text; });
  var text = paras.join('\n\n');
  if (paras[1] && !/^Overall,/.test(paras[1])) E.push('overview does not begin "Overall,"');
  /* 3 words */
  var n = W.words(text);
  if (n < 160 || n > 190) E.push('word count ' + n + ' outside 160–190');
  if (n !== m.words) E.push('words field ' + m.words + ' but text has ' + n);
  /* 4 overview digits */
  var cand = candidates(p);
  if (paras[1]) {
    var ov = paras[1].replace(/\b(19|20)\d\d\b/g, ' ');
    var bad = numsInString(ov).filter(function (v) { return cand.metaNums.indexOf(v) < 0 || /%/.test(ov); });
    var labelOnly = numsInString(ov).filter(function (v) { return cand.metaNums.indexOf(v) >= 0; });
    if (bad.length) E.push('overview contains data values: ' + bad.join(', '));
    else if (labelOnly.length) I.push('overview numbers treated as label numbers: ' + labelOnly.join(', '));
  }
  /* 5 numbers */
  var ents = entities(p.type, p.data, p.units || '');
  [0, 2, 3].forEach(function (pi) {
    if (!paras[pi]) return;
    var ss = sentences(paras[pi]), first = ss.length ? named(ss[0], ents, p.mode) : [];
    ss.forEach(function (s, si) {
      var here = named(s, ents, p.mode), prev = si > 0 ? named(ss[si - 1], ents, p.mode) : [];
      var allowed = here.concat(prev, first).filter(function (e, i, arr) { return arr.indexOf(e) === i; });
      var bc = allowed.length ? boundCandidates(allowed) : null;
      if (bc) { bc.metaNums = cand.metaNums; }
      numbersInText(s).forEach(function (nm) {
        var ok = checkNumber(nm, cand, s);
        var where = ' in P' + (pi + 1) + ' — "' + s.slice(0, 110) + (s.length > 110 ? '…' : '') + '"';
        if (!ok) { E.push('number not in the data: "' + nm.raw + '"' + where); return; }
        if (bc && ok !== 'year' && ok !== 'label/rubric' && !/sum/.test(ok) && allowed.some(function (e) { return !e.free; })) {
          var ok2 = checkNumber(nm, bc, s);
          if (!ok2) { E.push('"' + nm.raw + '" is in the data, but not for ' + allowed.map(function (e) { return e.name; }).join(' / ') + where); return; }
          if (VERBOSE) I.push('"' + nm.raw + '" accepted as ' + ok2);
        } else if (VERBOSE && ok !== 'data' && ok !== 'year' && ok !== 'label/rubric') I.push('"' + nm.raw + '" accepted as ' + ok + ' (no entity named)');
      });
    });
  });
  /* 6 every detail sentence carries data or a label */
  var labs = (p.labels || []).slice();
  if (p.type === 'process') p.data.stages.forEach(function (s) { labs.push(s.label); });
  if (p.type === 'map') p.data.panels.forEach(function (pn) { pn.features.forEach(function (f) { labs.push(f.name.replace(/\s*\(.*?\)\s*/g, '')); }); });
  [2, 3].forEach(function (pi) {
    if (!paras[pi]) return;
    sentences(paras[pi]).forEach(function (s) {
      var has = /\d/.test(s) || labs.some(function (l) { return mentions(s, l, p.mode); });
      if (!has) E.push('detail sentence without a figure or label: "' + s.slice(0, 100) + '"');
    });
  });
  /* 7 coverage */
  (p.labels || []).forEach(function (l) { if (!mentions(text, l, p.mode)) E.push('label not mentioned: ' + l); });
  if (p.type === 'process') p.data.stages.forEach(function (s) {
    if (mentions(text, s.label, p.mode)) return;
    var stem = lower(s.label).replace(/([b-df-hj-np-tv-z])\1ing\b/g, '$1').replace(/ing\b/g, '').replace(/(ion|ment)\b/g, '');
    if (stem !== lower(s.label) && mentions(text, stem, p.mode)) return;
    var dw = lower(s.detail).replace(/[^a-z ]/g, ' ').split(/\s+/).filter(function (w) { return w.length >= 5 && ['about', 'after', 'their', 'there', 'which', 'water'].indexOf(w) < 0; });
    if (dw.some(function (w) { return lower(text).indexOf(w) >= 0; })) A.push('stage ' + s.n + ' "' + s.label + '" covered by its detail words only');
    else E.push('stage ' + s.n + ' "' + s.label + '" not described');
  });
  if (p.type === 'map') {
    var miss = [];
    p.data.panels.forEach(function (pn) { pn.features.forEach(function (f) { var nm = f.name.replace(/\s*\(.*?\)\s*/g, ''); if (miss.indexOf(nm) < 0 && !mentions(text, nm, p.mode)) miss.push(nm); }); });
    if (miss.length) I.push('map features never named: ' + miss.join(', '));
  }
  /* 8 rubric copying */
  if (p.rubric) { var lr = longestRun(text, p.rubric); if (lr.n >= 8) E.push('copied run of ' + lr.n + ' words from the rubric: "' + lr.run + '"'); else if (VERBOSE) I.push('longest rubric run ' + lr.n + ': "' + lr.run + '"'); }
  /* 9 add-on */
  var details = (paras[2] || '') + ' ' + (paras[3] || '');
  var addons = ADDON.filter(function (a) { return a.re.test(details); }).map(function (a) { return a.name; });
  if (!addons.length) E.push('no 7→8 add-on found in the detail paragraphs');
  else if (VERBOSE) I.push('add-ons: ' + addons.join(', '));
  /* 10 Writer.preflight */
  var pre = W.preflight(text, p);
  pre.rows.forEach(function (r) {
    if (r.status === 'bad') E.push('preflight red: ' + r.label);
    else if (r.status === 'warn') A.push('preflight amber: ' + r.label);
  });
  ['compare', 'sequence'].forEach(function (id) {
    var r = pre.rows.filter(function (x) { return x.id === id; })[0];
    if (r && r.status !== 'ok') E.push(r.label + ' (need ' + (id === 'sequence' ? '3 sequencers' : '2 comparisons') + ')');
  });
  return { E: E, A: A, I: I };
}

var list = MODELS.filter(function (m) { return !ONLY.length || ONLY.some(function (o) { return m.id.indexOf(o) >= 0 || m.promptId.indexOf(o) >= 0; }); });
list.forEach(function (m) {
  var r = checkModel(m);
  errors += r.E.length; warnings += r.A.length;
  var head = (r.E.length ? 'FAIL ' : r.A.length ? 'amber' : 'ok   ') + ' ' + m.id + ' (' + m.words + ' w)';
  console.log(head);
  r.E.forEach(function (x) { console.log('   ✗ ' + x); });
  if (VERBOSE || r.E.length) r.A.forEach(function (x) { console.log('   · ' + x); });
  if (VERBOSE) r.I.forEach(function (x) { console.log('   i ' + x); });
});

/* bank-level checks */
if (!ONLY.length) {
  var byPrompt = {};
  MODELS.forEach(function (m) { (byPrompt[m.promptId] = byPrompt[m.promptId] || []).push(m.id); });
  var ids = {}; MODELS.forEach(function (m) { ids[m.id] = 1; });
  var noModel = PROMPTS.filter(function (p) { return !byPrompt[p.id]; }).map(function (p) { return p.id; });
  var badRef = PROMPTS.filter(function (p) { return p.modelId && !ids[p.modelId]; }).map(function (p) { return p.id + ' → ' + p.modelId; });
  var noRef = PROMPTS.filter(function (p) { return !p.modelId && byPrompt[p.id]; }).map(function (p) { return p.id; });
  var pid = {}, dupP = []; PROMPTS.forEach(function (p) { if (pid[p.id]) dupP.push(p.id); pid[p.id] = 1; });
  console.log('\nBank: ' + PROMPTS.length + ' prompts (' + promptFiles.join(', ') + '), ' + MODELS.length + ' models (' + modelFiles.join(', ') + ')');
  if (dupP.length) { errors += dupP.length; console.log('   ✗ duplicate prompt ids: ' + dupP.join(', ')); }
  if (noModel.length) { errors += noModel.length; console.log('   ✗ prompts without a model: ' + noModel.join(', ')); }
  if (badRef.length) { errors += badRef.length; console.log('   ✗ modelId points nowhere: ' + badRef.join(', ')); }
  if (noRef.length) console.log('   i prompts with a model but no modelId field (the app finds models by promptId): ' + noRef.join(', '));
  var bcFail = [];
  PROMPTS.forEach(function (p) {
    try { ctx.Charts.describe(p); } catch (e) { bcFail.push(p.id + ' Charts.describe: ' + e.message); }
    try {
      var b = ctx.Bootcamp.build(p);
      b.steps.forEach(function (st) { st.questions.forEach(function (q) { if (q.options.some(function (o) { return o == null || /undefined|NaN/.test(String(o)); })) bcFail.push(p.id + ' bootcamp ' + q.id + ': option contains undefined/NaN'); }); });
    } catch (e) { bcFail.push(p.id + ' Bootcamp.build: ' + e.message); }
  });
  if (bcFail.length) { console.log('   ! engine problems (not model faults):'); bcFail.forEach(function (x) { console.log('     ' + x); }); }
}
console.log('\n' + (errors ? errors + ' error(s)' : 'OK — no errors') + (warnings ? ', ' + warnings + ' amber row(s)' : '') + ' across ' + list.length + ' model(s).');
process.exit(errors ? 1 : 0);
