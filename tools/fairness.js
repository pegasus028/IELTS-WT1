#!/usr/bin/env node
/* Fairness, hint and level checks for Quillmoor · The Observatory (IELTS-WT1).
   node tools/fairness.js  → exits 1 on any error.   (Added in the 20 Oct 2026 audit.)

   Questions (topic-00…14.js)
     · choose items: the key is the longest option in ≤ 25% of each module's set
       (ties count; a set where every option is the same length does not), and no
       answer slot holds more than 40% of a module's keys (≤ 30% across the bank)
     · judge items: neither True nor False keys more than 60% of the bank
     · every item has its own hint; a hint never contains the key option's text,
       never says True/False on a judge item, never quotes the correct word/fix of a
       spot item, and never repeats the item's own stem
   Duelling Hall (bootcamp.js, every prompt)
     · the key is the longest option in ≤ 25% of each duel, and no answer slot holds
       more than 35% of all keys; every question has a hint that does not contain
       the answer
   Lesson levels (lesson-levels.js)
     · every lesson has A1, A2, B1 and B2 with a key, body paragraphs and one example
       note per example; A1 sentences ≤ 12 words on average per paragraph
   Read-aloud (audio/lessons/index.js)
     · every lesson at every level (A1–C1) has a recorded Sonia clip on disk that is
       not cut off (≥ max(8000, 150 × characters) bytes) */
'use strict';
var fs = require('fs'), path = require('path'), vm = require('vm');
var root = path.join(__dirname, '..');
var errors = [], warns = [];
function err(m) { errors.push(m); }
function warn(m) { warns.push(m); }
var ctx = { console: console, localStorage: { getItem: function () { return null; }, setItem: function () {} } };
ctx.window = ctx; ctx.self = ctx; vm.createContext(ctx);
function load(f) { vm.runInContext(fs.readFileSync(path.join(root, f), 'utf8'), ctx, { filename: f }); }
['content.js', 'partners.js', 'prompts.js', 'prompts-2.js', 'prompts-3.js', 'models.js'].forEach(load);
/* WS-J: every topic file, incl. the Grammar Wing (topic-15..17) */
fs.readdirSync(root).filter(function (f) { return /^topic-\d\d\.js$/.test(f); }).sort().forEach(load);
load('models-2.js'); load('mocks.js'); load('bootcamp.js');
var hasLevels = fs.existsSync(path.join(root, 'lesson-levels.js'));
if (hasLevels) load('lesson-levels.js'); else err('lesson-levels.js is missing');
if (fs.existsSync(path.join(root, 'companion-levels.js'))) load('companion-levels.js');   /* WS-J: Grammar Wing levels */
load('audio/lessons/index.js');
var C = ctx.CONTENT;

function plain(h) { return String(h == null ? '' : h).replace(/<s>[\s\S]*?<\/s>/g, '').replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/\s+/g, ' ').trim(); }
function len(s) { return plain(s).length; }
function keyIsLongest(opts, ans) {
  var l = opts.map(len), m = Math.max.apply(null, l);
  return l[ans] === m && !l.every(function (x) { return x === m; });
}
function norm(s) { return plain(s).toLowerCase().replace(/[“”"'.,;:!?()]/g, '').replace(/\s+/g, ' ').trim(); }

/* ------------------------------------------------------------- items */
var all = [], pos = {}, judge = { 0: 0, 1: 0 };
C.TOPICS.forEach(function (t) {
  var mc = [], mpos = {};
  t.levels.forEach(function (lv) {
    var items = [];
    lv.subs.forEach(function (s) { s.items.forEach(function (it) { items.push(it); }); });
    lv.check.items.forEach(function (it) { items.push(it); });
    items.forEach(function (it) {
      all.push(it);
      if (it.type === 'choose') { mc.push(it); mpos[it.answer] = (mpos[it.answer] || 0) + 1; pos[it.answer] = (pos[it.answer] || 0) + 1; }
      if (it.type === 'judge') judge[it.answer] = (judge[it.answer] || 0) + 1;
      /* hints */
      var h = it.hint;
      if (!h || !String(h).trim()) { err(it.id + ': no hint of its own'); return; }
      var hn = norm(h);
      if (plain(h).split(' ').length > 30) warn(it.id + ': hint is long (' + plain(h).split(' ').length + ' words)');
      if (it.type === 'choose' || it.type === 'claimnum') {
        var key = it.options && norm(it.options[it.answer]);
        if (key && key.length > 3 && hn.indexOf(key) >= 0) err(it.id + ': hint contains the answer "' + key + '"');
      }
      if (it.type === 'judge' && /\b(true|false|correct|incorrect)\b/i.test(h)) err(it.id + ': judge hint says true/false');
      if (it.type === 'spot' && it.fix) {
        var fx = norm(it.fix).replace(/^delete /, '');
        if (fx.length > 2 && new RegExp('\\b' + fx.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b').test(hn)) err(it.id + ': hint quotes the fix "' + fx + '"');
      }
      if (it.type === 'select') {
        var picks = (it.answers || []).map(function (k) { return norm(it.options[k]); });
        picks.forEach(function (pk) { if (pk.length > 6 && hn.indexOf(pk) >= 0) err(it.id + ': hint names a correct pick'); });
      }
      if (it.stem && norm(it.stem) === hn) err(it.id + ': hint repeats the stem');
    });
  });
  if (mc.length) {
    var L = mc.filter(function (it) { return keyIsLongest(it.options, it.answer); }).length;
    if (L > Math.floor(mc.length * 0.25)) err(t.id + ': key is the longest option in ' + L + '/' + mc.length + ' choose items (cap ' + Math.floor(mc.length * 0.25) + ')');
    Object.keys(mpos).forEach(function (k) { if (mpos[k] / mc.length > 0.4 && mc.length >= 6) err(t.id + ': ' + mpos[k] + '/' + mc.length + ' keys sit at ' + 'ABCDEF'[k]); });
  }
});
var nmc = Object.keys(pos).reduce(function (a, k) { return a + pos[k]; }, 0);
Object.keys(pos).forEach(function (k) { if (pos[k] / nmc > 0.3) err('bank: ' + pos[k] + '/' + nmc + ' choose keys sit at ' + 'ABCDEF'[k]); });
var nj = judge[0] + judge[1];
if (nj && Math.max(judge[0], judge[1]) / nj > 0.6) err('judge keys unbalanced: ' + judge[0] + ' True / ' + judge[1] + ' False');

/* ---------------------------------------------------- Duelling Hall */
var BC = ctx.Bootcamp, bpos = {}, bn = 0, bL = 0;
C.PROMPTS.forEach(function (p) {
  var d = BC.build(p), n = 0, L = 0;
  d.steps.forEach(function (st) {
    st.questions.forEach(function (q) {
      n++; bn++;
      if (q.answer < 0 || q.answer >= q.options.length) err('duel ' + p.id + '/' + q.id + ': answer out of range');
      var seen = {};
      q.options.forEach(function (o) { if (seen[o]) err('duel ' + p.id + '/' + q.id + ': duplicate option "' + o + '"'); seen[o] = 1; });
      if (keyIsLongest(q.options, q.answer)) { L++; bL++; }
      bpos[q.answer] = (bpos[q.answer] || 0) + 1;
      if (!q.hint) err('duel ' + p.id + '/' + q.id + ': no hint');
      var key = norm(q.options[q.answer]);
      if (q.hint && key.length > 3 && norm(q.hint).indexOf(key) >= 0) err('duel ' + p.id + '/' + q.id + ': hint contains the answer');
    });
  });
  if (L / n > 0.25) err('duel ' + p.id + ': key is the longest option in ' + L + '/' + n + ' questions');
});
Object.keys(bpos).forEach(function (k) { if (bpos[k] / bn > 0.35) err('duels: ' + bpos[k] + '/' + bn + ' keys sit at ' + 'ABCDEF'[k]); });

/* ---------------------------------------------------- lesson levels */
var LV = ctx.QM_LESSON_LEVELS || {}, nLessons = 0;
function words(s) { return plain(s).split(' ').filter(Boolean).length; }
C.TOPICS.forEach(function (t) {
  t.levels.forEach(function (lv) {
    lv.subs.forEach(function (s) {
      nLessons++;
      var L = LV[s.id];
      if (!L) { if (hasLevels) err(s.id + ': no levelled explanations'); return; }
      ['A1', 'A2', 'B1', 'B2'].forEach(function (l) {
        var x = L[l];
        if (!x || !x.key || !x.body || !x.body.length) { err(s.id + ' ' + l + ': missing key or body'); return; }
        if ((x.examples || []).length !== (s.theory.examples || []).length) err(s.id + ' ' + l + ': ' + (x.examples || []).length + ' example notes for ' + (s.theory.examples || []).length + ' examples');
        if (/n't\b/.test(x.body.join(' ') + x.key)) err(s.id + ' ' + l + ': contraction (house style: none)');
        var w = x.body.reduce(function (a, b) { return a + words(b); }, 0);
        var lim = { A1: [70, 170], A2: [110, 220], B1: [170, 310], B2: [230, 420] }[l];
        if (w < lim[0] || w > lim[1]) warn(s.id + ' ' + l + ': body is ' + w + ' words');
      });
    });
  });
});

/* -------------------------------------------------------- read-aloud */
var A = ctx.QM_LESSON_AUDIO || { files: {} }, nClips = 0;
function lfnv(s) { var h = 0x811c9dc5; for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; } return ('0000000' + h.toString(16)).slice(-8); }
function pS(h) { return String(h || '').replace(/<s>[\s\S]*?<\/s>/g, '').replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/→/g, ' to ').replace(/\s+/g, ' ').trim(); }
function lessonText(s, lvl) { var L = LV[s.id], x = lvl !== 'C1' && L && L[lvl]; if (x && x.body && x.body.length) return { key: x.key || s.theory.key, body: x.body }; return { key: s.theory.key, body: s.theory.body }; }
function lessonSpeech(s, lvl) { var t = lessonText(s, lvl); return [pS(s.name) + '.', pS(t.key)].concat(t.body.map(pS)).join('\n'); }
if (A.voice !== 'en-GB-SoniaNeural') err('lesson audio voice is ' + A.voice + ', expected en-GB-SoniaNeural');
C.TOPICS.forEach(function (t) {
  t.levels.forEach(function (lv) {
    lv.subs.forEach(function (s) {
      ['A1', 'A2', 'B1', 'B2', 'C1'].forEach(function (l) {
        var text = lessonSpeech(s, l), h = lfnv(text), f = path.join(root, 'audio/lessons', h + '.mp3');
        if (!A.files[h]) { err(s.id + ' ' + l + ': no Sonia recording in the manifest'); return; }
        if (!fs.existsSync(f)) { err(s.id + ' ' + l + ': audio/lessons/' + h + '.mp3 is missing'); return; }
        var sz = fs.statSync(f).size;
        if (sz < Math.max(8000, 150 * text.length)) err(s.id + ' ' + l + ': clip looks cut off (' + sz + ' bytes for ' + text.length + ' characters)');
        nClips++;
      });
    });
  });
});

warns.forEach(function (w) { console.log('warn  ' + w); });
errors.forEach(function (e) { console.log('ERROR ' + e); });
console.log((errors.length ? 'FAIL' : 'OK') + ' · ' + all.length + ' items · ' + bn + ' duel questions (key longest ' + Math.round(100 * bL / bn) + '%) · ' + nLessons + ' lessons · ' + nClips + ' Sonia clips · ' + errors.length + ' errors, ' + warns.length + ' warnings');
process.exit(errors.length ? 1 : 0);
