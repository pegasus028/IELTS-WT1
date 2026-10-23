#!/usr/bin/env node
/* WS-J · The Grammar Wing — companion test.
   node tools/companion-test.js [--static]
   Static (vm): Modules 15–17 exist, every item has a unique id in the mNNsNqN / mNNckqN
   shape, a `src` naming its source-app item, a hint, a valid tag and level, a chart that
   exists, and exactly one defensible answer for its type (MCQ answer in range with unique
   options; judge 0–2; spot answer + fix; sort bins non-empty and every card's bin real;
   build solution and alts use every tile once; order ≥ 3; pick answer in range; select
   answers = k). Story missions that name companion lessons point at real subs.
   Render (Chromium): a harness page loads the engine + companion-engine and mounts every
   companion item; each must render its controls, start with no response, and mark the
   authored key as correct when it is chosen. Skipped with --static or when Chromium is
   not found (then it says so and exits 0 on the static checks alone). */
'use strict';
var fs = require('fs'), path = require('path'), vm = require('vm'), os = require('os');
var ROOT = path.join(__dirname, '..');
var errors = [], notes = [];
function err(m) { errors.push(m); }

/* ------------------------------------------------------------- static */
var ctx = { console: console, localStorage: { getItem: function () { return null; }, setItem: function () {} } };
ctx.window = ctx; vm.createContext(ctx);
function load(f) { vm.runInContext(fs.readFileSync(path.join(ROOT, f), 'utf8'), ctx, { filename: f }); }
['content.js', 'prompts.js', 'prompts-2.js', 'prompts-3.js'].forEach(load);
fs.readdirSync(ROOT).filter(function (f) { return /^topic-\d\d\.js$/.test(f); }).sort().forEach(load);
['story-content.js', 'lesson-levels.js', 'companion-levels.js', 'media.js', 'companion-engine.js'].forEach(load);
var C = ctx.CONTENT, REM = C.REMEDIATION, PIDS = {};
C.PROMPTS.forEach(function (p) { PIDS[p.id] = 1; });
var Companion = ctx.Companion;
if (!Companion) err('companion-engine.js did not define window.Companion');
var WING = ['m15', 'm16', 'm17'];
var mods = C.TOPICS.filter(function (t) { return WING.indexOf(t.id) >= 0; });
if (mods.length !== 3) err('expected modules m15, m16, m17; found ' + mods.map(function (t) { return t.id; }).join(','));
var ids = {}, allIds = {}, counts = {}, bySrc = {}, items = [];
C.TOPICS.forEach(function (t) { t.levels.forEach(function (lv) { lv.subs.forEach(function (s) { s.items.forEach(function (it) { allIds[it.id] = (allIds[it.id] || 0) + 1; }); }); lv.check.items.forEach(function (it) { allIds[it.id] = (allIds[it.id] || 0) + 1; }); }); });
Object.keys(allIds).forEach(function (id) { if (allIds[id] > 1) err('duplicate item id in the bank: ' + id); });

function plain(h) { return String(h == null ? '' : h).replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').trim(); }
function checkItem(it, where, mod) {
  items.push(it);
  counts[mod.id] = (counts[mod.id] || 0) + 1;
  var app = (it.src || '').split(':')[0] || '(none)'; bySrc[app] = (bySrc[app] || 0) + 1;
  if (!/^m1[5-7](s[1-3]q\d+|ckq\d+)$/.test(it.id)) err(where + ': id ' + it.id + ' is not in the mNNsNqN / mNNckqN shape');
  if (ids[it.id]) err('duplicate companion id ' + it.id); ids[it.id] = 1;
  if (!it.src) err(it.id + ': no src');
  if (!it.hint || !plain(it.hint)) err(it.id + ': no hint');
  if (!it.why) err(it.id + ': no why');
  if (!REM[it.tag]) err(it.id + ': tag ' + it.tag + ' not in REMEDIATION');
  if (['A2', 'B1', 'B2', 'C1'].indexOf(it.level) < 0) err(it.id + ': level ' + it.level);
  if (it.chart && typeof it.chart === 'string' && !PIDS[it.chart]) err(it.id + ': chart ' + it.chart + ' not in the prompt bank');
  var T = it.type;
  if (['choose', 'equiv', 'table', 'cloze'].indexOf(T) >= 0 || (T === 'gap' && it.options)) {
    if (!it.options || it.options.length < 3) err(it.id + ': fewer than 3 options');
    else {
      if (!(it.answer >= 0 && it.answer < it.options.length)) err(it.id + ': answer out of range');
      var seen = {}; it.options.forEach(function (o) { var k = plain(o).toLowerCase(); if (seen[k]) err(it.id + ': duplicate option "' + o + '"'); seen[k] = 1; });
    }
    if ((T === 'gap') && !it.lines) err(it.id + ': gap item without dialogue lines');
    if (T === 'equiv' && !it.given) err(it.id + ': equiv item without given');
  } else if (T === 'gap') {
    if (!it.accept || !it.accept.length) err(it.id + ': typed gap without accept[]');
  } else if (T === 'judge') {
    if (!(it.answer >= 0 && it.answer <= 2)) err(it.id + ': judge answer must be 0, 1 or 2');
    if (!it.given) err(it.id + ': judge without given');
  } else if (T === 'spot') {
    if (!it.words || it.words.length < 3) err(it.id + ': spot needs words[]');
    else if (!(it.answer >= 0 && it.answer < it.words.length)) err(it.id + ': spot answer out of range');
    if (!it.fix) err(it.id + ': spot without fix');
    (it.also || []).forEach(function (a) { if (!(a >= 0 && a < it.words.length) || a === it.answer) err(it.id + ': also index ' + a + ' invalid'); });
  } else if (T === 'sort') {
    var keys = {}; (it.bins || []).forEach(function (b) { keys[b.key] = 0; });
    if (Object.keys(keys).length < 2) err(it.id + ': sort needs 2+ bins');
    (it.items || []).forEach(function (c) { if (!(c.bin in keys)) err(it.id + ': card "' + plain(c.text) + '" names bin ' + c.bin); else keys[c.bin]++; });
    Object.keys(keys).forEach(function (k) { if (!keys[k]) err(it.id + ': bin ' + k + ' is empty'); });
  } else if (T === 'build') {
    if (!it.tiles || it.tiles.length < 4) err(it.id + ': build needs 4+ tiles');
    var norm = function (s) { return String(s).toLowerCase().replace(/[.,!?;:]/g, '').replace(/\s+/g, ' ').trim(); };
    var multiset = function (s) { return norm(s).split(' ').sort().join(' '); };
    var tilesMS = multiset((it.tiles || []).join(' '));
    [it.solution].concat(it.alt || []).forEach(function (sol, i) {
      if (!sol) { err(it.id + ': build without solution'); return; }
      if (multiset(sol) !== tilesMS) err(it.id + ': ' + (i ? 'alt ' + i : 'solution') + ' does not use every tile exactly once');
    });
  } else if (T === 'order') {
    if (!it.items || it.items.length < 3) err(it.id + ': order needs 3+ items');
  } else if (T === 'pick') {
    if (!it.items || it.items.length < 3) err(it.id + ': pick needs 3+ cards');
    else if (!(it.answer >= 0 && it.answer < it.items.length)) err(it.id + ': pick answer out of range');
  } else if (T === 'select') {
    if ((it.answers || []).length !== it.k) err(it.id + ': k does not match answers');
  } else err(it.id + ': unknown type ' + T);
}
mods.forEach(function (t) {
  if (!ctx.MEDIA || !ctx.MEDIA[t.id]) err(t.id + ': no media.js row');
  if (!C.MODULE_GATES[t.id]) err(t.id + ': no MODULE_GATES entry');
  if (!t.source || !t.source.app) err(t.id + ': no source app');
  t.levels.forEach(function (lv) {
    if (lv.subs.length !== 3) err(lv.id + ': expected 3 sub-levels');
    lv.subs.forEach(function (s) {
      if (s.items.length < 5) err(s.id + ': only ' + s.items.length + ' items');
      var L = ctx.QM_LESSON_LEVELS && ctx.QM_LESSON_LEVELS[s.id];
      ['A1', 'A2', 'B1', 'B2'].forEach(function (l) { if (!L || !L[l] || !L[l].body) err(s.id + ': no ' + l + ' explanation in companion-levels.js'); });
      s.items.forEach(function (it) { checkItem(it, s.id, t); });
    });
    if (lv.check.items.length !== 8) err(lv.check.id + ': expected 8 items, found ' + lv.check.items.length);
    lv.check.items.forEach(function (it) { checkItem(it, lv.check.id, t); });
  });
});
/* Voice Control lesson tabs on Module 17 */
var m17 = mods.filter(function (t) { return t.id === 'm17'; })[0];
if (m17) m17.levels[0].subs.forEach(function (s) { ['thai', 'trap', 'analogy'].forEach(function (k) { if (!s.theory[k]) err(s.id + ': theory.' + k + ' (Voice Control lesson tab) missing'); }); });
/* story missions naming companion lessons */
var SUBS = {}; C.TOPICS.forEach(function (t) { t.levels.forEach(function (lv) { lv.subs.forEach(function (s) { SUBS[s.id] = t.id; }); }); });
var wingMissions = 0, perChapter = {};
(ctx.STORY.chapters || []).forEach(function (ch) {
  (ch.missions || []).forEach(function (m) {
    if (m.kind === 'sub' && WING.indexOf(SUBS[m.id]) >= 0) {
      wingMissions++; perChapter[ch.n] = (perChapter[ch.n] || 0) + 1;
      if (!m.optional) err('chapter ' + ch.n + ': companion mission ' + m.id + ' should be optional');
    }
  });
  (ch.gate.checks || []).forEach(function (id) { if (/^m1[5-7]/.test(id)) err('chapter ' + ch.n + ': a Grammar Wing gate (' + id + ') blocks the keepsake'); });
});
if (wingMissions !== 9) err('expected 9 companion missions in the story, found ' + wingMissions);
notes.push('story missions per chapter: ' + JSON.stringify(perChapter));

/* ------------------------------------------------------------- render */
function findChrome() {
  if (process.env.CHROME && fs.existsSync(process.env.CHROME)) return process.env.CHROME;
  var base = '/opt/pw-browsers';
  try {
    var out = [];
    (function walk(d, depth) { if (depth > 4) return; fs.readdirSync(d).forEach(function (n) { var p = path.join(d, n); var st; try { st = fs.statSync(p); } catch (e) { return; } if (st.isDirectory()) walk(p, depth + 1); else if (n === 'chrome') out.push(p); }); })(base, 0);
    return out.sort()[out.length - 1] || null;
  } catch (e) { return null; }
}
function finish(rendered) {
  notes.forEach(function (n) { console.log('  note ' + n); });
  errors.forEach(function (e) { console.log('  ERROR ' + e); });
  console.log((errors.length ? errors.length + ' error(s)' : 'OK') + ' · companion items: ' + items.length + ' (' + Object.keys(counts).map(function (k) { return k + ' ' + counts[k]; }).join(', ') + ') · by source: ' + Object.keys(bySrc).map(function (k) { return k + ' ' + bySrc[k]; }).join(', ') + (rendered == null ? ' · render check skipped' : ' · ' + rendered + ' rendered and keyed'));
  process.exit(errors.length ? 1 : 0);
}
if (process.argv.indexOf('--static') >= 0) finish(null);
else {
  var pw = null;
  try { pw = require(path.join(require('child_process').execSync('npm root -g').toString().trim(), 'playwright')); } catch (e) { try { pw = require('playwright'); } catch (e2) {} }
  var exe = findChrome();
  if (!pw || !exe) { notes.push('render check skipped: ' + (!pw ? 'playwright not found' : 'no Chromium under /opt/pw-browsers')); finish(null); }
  else {
    var scripts = ['content.js', 'partners.js', 'prompts.js', 'prompts-2.js', 'prompts-3.js', 'template.js', 'lab-content.js', 'models.js', 'models-2.js', 'mocks.js']
      .concat(fs.readdirSync(ROOT).filter(function (f) { return /^topic-\d\d\.js$/.test(f); }).sort())
      .concat(['lesson-levels.js', 'companion-levels.js', 'media.js', 'charts.js', 'example-levels.js', 'example-real.js', 'writer.js', 'bootcamp.js', 'engine.js', 'companion-engine.js']);
    var html = '<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="' + ROOT + '/theme.css"><link rel="stylesheet" href="' + ROOT + '/companion.css"></head><body><div id="host"></div>' +
      scripts.map(function (f) { return '<script src="file://' + path.join(ROOT, f) + '"></script>'; }).join('') + '</body></html>';
    var tmp = path.join(os.tmpdir(), 'ws-j-companion-harness.html'); fs.writeFileSync(tmp, html);
    var itemIds = items.map(function (it) { return it.id; });
    (async function () {
      var browser = await pw.chromium.launch({ executablePath: exe });
      var page = await browser.newPage();
      var perr = [];
      page.on('pageerror', function (e) { perr.push(String(e)); });
      page.on('console', function (m) { if (m.type() === 'error') perr.push(m.text()); });
      await page.goto('file://' + tmp);
      await page.waitForTimeout(300);
      var res = await page.evaluate(function (idList) {
        var out = [], E = window.Engine, B = E.Bank;
        if (!window.Companion || !window.Companion.wrapped) return [{ id: '*', err: 'Companion did not wrap Engine.mount' }];
        function textOf(el) { return (el.textContent || '').replace(/\s+/g, ' ').trim(); }
        idList.forEach(function (id) {
          var it = B.item(id), host = document.getElementById('host'), r = { id: id, type: it.type };
          try {
            var v = E.mount(it, host);
            if (!v || typeof v.check !== 'function' || typeof v.lock !== 'function') { r.err = 'no view'; out.push(r); return; }
            if (v.hasResponse()) { r.err = 'has a response before any click'; out.push(r); return; }
            var T = it.type, btns;
            if (T === 'judge') { host.querySelectorAll('.opt')[it.answer].click(); }
            else if (T === 'pick') { btns = host.querySelectorAll('.goods'); if (btns.length !== it.items.length) r.err = 'cards ' + btns.length; host.querySelector('.goods[data-i="' + it.answer + '"]').click(); }
            else if (T === 'gap' && !it.options) { var inp = host.querySelector('input.typed'); if (!inp) { r.err = 'no typed input'; } else { inp.value = it.accept[0]; inp.dispatchEvent(new Event('input')); } }
            else if (T === 'spot') { btns = host.querySelectorAll('.seg'); if (btns.length !== it.words.length) r.err = 'segs ' + btns.length; btns[it.answer].click(); }
            else if (T === 'sort') {
              var chips = host.querySelectorAll('.sort-pool .chip-i'), bins = host.querySelectorAll('.sort-bin');
              it.items.forEach(function (card, i) {
                var chip = Array.prototype.filter.call(chips, function (c) { return textOf(c) === textOf((function () { var d = document.createElement('div'); d.innerHTML = card.text; return d; })()); })[0];
                var binIdx = it.bins.map(function (b) { return b.key; }).indexOf(card.bin);
                if (!chip) { r.err = 'chip not found: ' + card.text; return; }
                chip.click(); bins[binIdx].click();
              });
            }
            else if (T === 'build') {
              var pool = host.querySelector('.tiles');
              it.solution.split(' ').length; /* tiles may be multi-word: click in solution order by matching tile text */
              var remaining = it.tiles.slice(), sol = it.solution;
              var order = [];
              while (remaining.length) {
                var hit = -1;
                for (var k = 0; k < remaining.length; k++) { if (remaining[k] !== null && sol.indexOf(remaining[k]) === 0) { hit = k; break; } }
                if (hit < 0) { r.err = 'solution does not start with a tile: "' + sol + '"'; break; }
                order.push(remaining[hit]); sol = sol.slice(remaining[hit].length).replace(/^\s+/, ''); remaining[hit] = null;
                if (remaining.every(function (x) { return x === null; })) break;
              }
              order.forEach(function (tt) { var b = Array.prototype.filter.call(pool.querySelectorAll('.tile'), function (x) { return !x.disabled && x.textContent === tt; })[0]; if (b) b.click(); else r.err = 'tile not clickable: ' + tt; });
            }
            else if (T === 'order') {
              var ranks = host.querySelectorAll('.rank-pool .rank');
              it.items.forEach(function (txt) { var b = Array.prototype.filter.call(ranks, function (x) { return textOf(x) === txt.replace(/\s+/g, ' ').trim(); })[0]; if (b) b.click(); else r.err = 'rank not found: ' + txt; });
            }
            else if (T === 'select') { it.answers.forEach(function (a) { host.querySelectorAll('.opt')[a].click(); }); }
            else { btns = host.querySelectorAll('.opt'); if (btns.length !== it.options.length) r.err = 'options ' + btns.length; btns[it.answer].click(); }
            if (!r.err) {
              if (!v.hasResponse()) r.err = 'no response after choosing the key';
              else { var c = v.check(); if (!c.correct) r.err = 'the authored key is not marked correct (' + c.givenText + ' vs ' + c.expectedText + ')'; }
              v.lock({});
            }
          } catch (e) { r.err = 'threw: ' + (e && e.message); }
          out.push(r);
        });
        return out;
      }, itemIds);
      await browser.close();
      perr.forEach(function (e) { err('page error: ' + e); });
      var ok = 0;
      res.forEach(function (r) { if (r.err) err(r.id + ' (' + r.type + '): ' + r.err); else ok++; });
      finish(ok);
    })().catch(function (e) { err('render check failed: ' + e.message); finish(null); });
  }
}
