#!/usr/bin/env node
/* Content validator for Quillmoor · The Observatory (Chart Control, Task 1).
   node tools/validate.js  → exits 1 on any error.
   Checks: every module has 3 sub-levels + a check; item ids unique; every
   item tag is a REMEDIATION key; chart refs exist; MCQ answers in range;
   prompts carry the fields Bootcamp and the Spellbook need; every prompt has
   a model; Code.gs TAGS mirrors REMEDIATION; browser files parse as ES5-ish
   (no arrow functions, let/const or template literals). */
'use strict';
var fs = require('fs'), path = require('path'), vm = require('vm');
var root = path.join(__dirname, '..');
var errors = [], warns = [];
function err(m) { errors.push(m); }
function warn(m) { warns.push(m); }
var ctx = { console: console, localStorage: { getItem: function () { return null; }, setItem: function () {} } };
ctx.window = ctx; vm.createContext(ctx);
function load(f) { vm.runInContext(fs.readFileSync(path.join(root, f), 'utf8'), ctx, { filename: f }); }
['content.js', 'partners.js', 'prompts.js', 'prompts-2.js', 'prompts-3.js', 'models.js'].forEach(load);
for (var i = 0; i < 15; i++) load('topic-' + String(i).padStart(2, '0') + '.js');
load('models-2.js'); load('mocks.js'); load('media.js');
var C = ctx.CONTENT, REM = C.REMEDIATION, ids = {}, nItems = 0;
var PIDS = {}; C.PROMPTS.forEach(function (p) { if (PIDS[p.id]) err('duplicate prompt id ' + p.id); PIDS[p.id] = p; });

if (C.TOPICS.length !== 15) err('expected 15 modules, found ' + C.TOPICS.length);
C.TOPICS.forEach(function (t) {
  if (!ctx.MEDIA || !ctx.MEDIA[t.id]) warn(t.id + ' has no media.js row');
  t.levels.forEach(function (lv) {
    if (lv.subs.length !== 3) err(lv.id + ' should have 3 sub-levels');
    var all = [];
    lv.subs.forEach(function (s) { s.items.forEach(function (it) { all.push(it); }); });
    lv.check.items.forEach(function (it) { all.push(it); });
    all.forEach(function (it) {
      nItems++;
      if (ids[it.id]) err('duplicate item id ' + it.id); ids[it.id] = 1;
      if (!REM[it.tag]) err(it.id + ': tag "' + it.tag + '" is not in REMEDIATION');
      if (!it.why) err(it.id + ': missing why');
      if (it.chart && typeof it.chart === 'string' && !PIDS[it.chart]) err(it.id + ': chart ' + it.chart + ' not in the prompt bank');
      if ((it.type === 'choose') && !(it.answer >= 0 && it.answer < (it.options || []).length)) err(it.id + ': answer out of range');
      if (it.type === 'select' && (it.answers || []).length !== it.k) err(it.id + ': k does not match answers');
    });
  });
});
C.PROMPTS.forEach(function (p) {
  ['id', 'type', 'mode', 'level', 'title', 'rubric', 'data', 'labels', 'keyFeatures', 'distractorFeatures'].forEach(function (k) { if (!p[k]) err(p.id + ': missing ' + k); });
  if (['TREND', 'COMPARE', 'SEQUENCE', 'SPACE'].indexOf(p.mode) < 0) err(p.id + ': bad mode ' + p.mode);
  if (!C.MODELS.some(function (m) { return m.promptId === p.id; })) err(p.id + ': no model answer');
});
C.MODELS.forEach(function (m) { if (!PIDS[m.promptId]) err(m.id + ': prompt ' + m.promptId + ' not found'); (m.patterns || []).forEach(function (x) { if (!/^S[1-8]$/.test(x)) err(m.id + ': pattern label ' + x + ' (use S1–S8)'); }); });
(C.MOCKS || []).forEach(function (m) { if (!PIDS[m.promptId]) err('mock ' + m.id + ': prompt not found'); });
Object.keys(C.MODULE_GATES || {}).forEach(function (k) { C.MODULE_GATES[k].forEach(function (g) { if (['TA', 'CC', 'LR', 'GRA'].indexOf(g) < 0) err('MODULE_GATES ' + k + ': bad gate ' + g); }); });
(C.PARTNERS || []).forEach(function (a) { a.tags.forEach(function (t) { if (!REM[t]) err('partner ' + a.id + ': tag ' + t + ' not in REMEDIATION'); }); });

/* Code.gs TAGS must mirror REMEDIATION (the AI marker may only use these). */
var gs = fs.readFileSync(path.join(root, 'Code.gs'), 'utf8'), m = gs.match(/var TAGS = (\[[^\]]*\])/);
if (!m) err('Code.gs: TAGS not found');
else {
  var tags = JSON.parse(m[1].replace(/'/g, '"'));
  Object.keys(REM).forEach(function (t) { if (tags.indexOf(t) < 0) err('Code.gs TAGS is missing ' + t); });
  tags.forEach(function (t) { if (!REM[t]) err('Code.gs TAGS has ' + t + ', not in REMEDIATION'); });
}
if (!/LAB_handle/.test(gs)) err('Code.gs: LAB-HOOK missing');

/* ES5 guard for browser files (old school iPads). */
fs.readdirSync(root).filter(function (f) { return /\.js$/.test(f); }).forEach(function (f) {
  var src = fs.readFileSync(path.join(root, f), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:'"\\])\/\/.*$/gm, '$1');
  if (/=>/.test(src.replace(/'[^'\n]*'|"[^"\n]*"/g, "''"))) err(f + ': arrow function (not ES5)');
  if (/(^|[;{}\s])(let|const)\s+[A-Za-z_$]/m.test(src.replace(/'[^'\n]*'|"[^"\n]*"/g, "''"))) err(f + ': let/const (not ES5)');
  if (/`/.test(src.replace(/'[^'\n]*'|"[^"\n]*"/g, "''"))) err(f + ': template literal (not ES5)');
  if (/\(\?<[=!]/.test(src)) err(f + ': regex lookbehind (old Safari cannot run it)');
});

warns.forEach(function (w) { console.log('  warn ' + w); });
errors.forEach(function (e) { console.log('  ERROR ' + e); });
console.log((errors.length ? errors.length + ' error(s)' : 'OK') + ' · ' + C.TOPICS.length + ' modules · ' + nItems + ' items · ' + C.PROMPTS.length + ' prompts · ' + C.MODELS.length + ' models · ' + Object.keys(REM).length + ' tags');
process.exit(errors.length ? 1 : 0);
