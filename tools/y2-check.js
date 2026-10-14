#!/usr/bin/env node
/* Second-year story check (docs/SECOND-YEAR-BRIEF.md).
   Usage: node tools/y2-check.js [old-story-content.js]   (default /tmp/old-story-content.js)
   Checks story-content.js: ES5 only; every page / ending / tournament page / finale has
   img, alt, text, rare, prompt; the rare word is marked [[…|C1]] in that text; no
   duplicate rare words; 40–100 words per text; avg ≤15 words/sentence (warn); banned
   names absent; keywords have 3 or 4 segments; mission / gate / opens / keepsake /
   event / tournament ids identical to the old file; image names follow y2- naming.
   Exits 1 on any error. */
var fs = require('fs'), path = require('path'), vm = require('vm');
var root = path.join(__dirname, '..');
var oldPath = process.argv[2] || '/tmp/old-story-content.js';
var file = path.join(root, 'story-content.js');
var src = fs.readFileSync(file, 'utf8');
var errors = [], warnings = [];
function err(m) { errors.push(m); } function warn(m) { warnings.push(m); }

/* ES5 */
var code = src.replace(/\/\*[\s\S]*?\*\//g, '');
if (/=>/.test(code)) err('ES5: "=>" found');
if (/(^|[^\w.'"])let\s/m.test(code)) err('ES5: "let " found');
if (/(^|[^\w.'"])const\s/m.test(code)) err('ES5: "const " found');
if (/`/.test(src)) err('ES5: backtick found');

function load(p) { var c = {}; c.window = c; vm.createContext(c); vm.runInContext(fs.readFileSync(p, 'utf8'), c, { filename: p }); return c.STORY; }
var S = load(file), O = fs.existsSync(oldPath) ? load(oldPath) : null;
if (!O) warn('old file not found at ' + oldPath + ': id comparison skipped');

var BANNED = ['Hogwarts', 'Gryffindor', 'Hufflepuff', 'Ravenclaw', 'Slytherin', 'Quidditch', 'Muggle', 'Horcrux', 'Patronus', 'Dumbledore', 'Snape', 'Expelliarmus', 'Lumos', 'Accio', 'Wingardium', 'Sorting Hat', 'Platform 9', 'Hogsmeade', 'Diagon',
  'basilisk', 'phoenix', 'Fawkes', 'house-elf', 'Dobby', 'Polyjuice', 'Riddle', 'Voldemort', 'Parseltongue', 'Lockhart', 'Hagrid', 'Ginny', 'Weasley', 'Hermione', 'Potter', 'Myrtle', 'Gilderoy', 'Mudblood', 'Chamber of Secrets', 'Fang', 'Aragog', 'Norris', 'Filch', 'Malfoy', 'kneazle', 'petrif', 'wand'];
BANNED.forEach(function (w) {
  var re = new RegExp('\\b' + w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
  if (re.test(src)) err('banned name/word "' + w + '" present');
});

var KW = /\[\[([^\[\]]*)\]\]/g, rareSeen = {}, imgs = {}, pagesChecked = 0;
function plain(t) { return String(t).replace(KW, function (x, p) { return p.split('|')[0]; }); }
function checkText(o, where, imgRe) {
  pagesChecked++;
  ['img', 'alt', 'text', 'rare', 'prompt'].forEach(function (k) { if (!o[k]) err(where + ': missing ' + k); });
  if (o.img) { imgs[o.img] = (imgs[o.img] || 0) + 1; if (imgRe && !imgRe.test(o.img)) err(where + ': img name ' + o.img + ' does not match ' + imgRe); }
  var t = String(o.text || ''), m, c1 = [];
  if ((t.match(/\[\[/g) || []).length !== (t.match(/\]\]/g) || []).length) err(where + ': unbalanced [[ ]]');
  KW.lastIndex = 0;
  while ((m = KW.exec(t))) {
    var parts = m[1].split('|');
    if (parts.length !== 3 && parts.length !== 4) err(where + ': keyword with ' + parts.length + ' segments: ' + m[0]);
    if (parts.length === 4) { if (parts[3] !== 'C1') err(where + ': 4th segment must be C1: ' + m[0]); c1.push(parts[0].trim()); }
    if (!/[฀-๿]/.test(parts[2] || '')) err(where + ': Thai gloss missing in ' + m[0]);
  }
  if (o.rare) {
    var r = o.rare;
    ['w', 'g', 't', 'pos', 'ex'].forEach(function (k) { if (!r[k]) err(where + ': rare.' + k + ' missing'); });
    var key = String(r.w).toLowerCase();
    if (rareSeen[key]) err(where + ': rare word "' + r.w + '" already used at ' + rareSeen[key]); else rareSeen[key] = where;
    if (c1.length !== 1) err(where + ': expected exactly one |C1 keyword, found ' + c1.length);
    else {
      var stem = key.replace(/e$/, '').slice(0, Math.max(4, key.length - 3));
      if (c1[0].toLowerCase().indexOf(stem) !== 0) err(where + ': |C1 word "' + c1[0] + '" does not match rare.w "' + r.w + '"');
    }
    if (r.ex && r.ex.toLowerCase().indexOf(key.slice(0, Math.max(4, key.length - 3))) < 0) warn(where + ': rare.ex does not contain the word');
  }
  var p = plain(t), words = p.split(/\s+/).filter(Boolean).length;
  if (words < 40 || words > 100) err(where + ': ' + words + ' words (40–100)');
  var sents = p.split(/[.!?]+(?:['"’]?\s|['"’]?$)/).map(function (x) { return x.trim(); }).filter(Boolean);
  var avg = words / Math.max(1, sents.length);
  if (avg > 15) warn(where + ': average ' + avg.toFixed(1) + ' words per sentence');
  if (o.prompt && /\b(girl|she|her)\b/i.test(t.replace(/'[^']*'/g, '')) && false) warn(where);
  return { words: words, avg: avg };
}

var stats = [], totalWords = 0, totalSents = 0;
S.chapters.forEach(function (ch) {
  var nNew = 0, nRet = 0, nShared = 0;
  ch.pages.forEach(function (pg, i) {
    var w = ch.id + ' page ' + (i + 1);
    checkText(pg, w, new RegExp('^story/y2-' + ch.id + '-\\d\\d\\.webp$'));
    if (pg.only === 'new') nNew++; else if (pg.only === 'returning') nRet++; else nShared++;
  });
  checkText(ch.ending, ch.id + ' ending', new RegExp('^story/y2-' + ch.id + '-end\\.webp$'));
  if (ch.endingReturning) checkText(ch.endingReturning, ch.id + ' endingReturning');
  stats.push(ch.id + ': ' + ch.pages.length + ' pages (new-only ' + nNew + ', returning-only ' + nRet + ', shared ' + nShared + ') → new readers ' + (nNew + nShared) + ', returning ' + (nRet + nShared) + ' + ending');
});
S.events.tournament.pages.forEach(function (pg, i) { checkText(pg, 'tournament page ' + (i + 1), /^story\/y2-ev-tournament-\d\d\.webp$/); });
checkText(S.finale, 'finale', /^story\/y2-finale\.webp$/);
Object.keys(imgs).forEach(function (k) { if (imgs[k] > 1) err('img used ' + imgs[k] + ' times: ' + k); });

/* ids identical to the old file */
function idsOf(st) {
  return {
    chapters: st.chapters.map(function (ch) {
      return { id: ch.id, n: ch.n, keepsake: ch.keepsake.id, opens: ch.opens,
        missions: ch.missions.map(function (m) { var x = {}; Object.keys(m).forEach(function (k) { if (k !== 'label' && k !== 'note') x[k] = m[k]; }); return x; }),
        gate: { checks: ch.gate.checks, checkIds: ch.gate.checkIds, extra: (ch.gate.extra || []).map(function (e) { var x = {}; Object.keys(e).forEach(function (k) { if (k !== 'label' && k !== 'note') x[k] = e[k]; }); return x; }) },
        events: ch.pages.filter(function (p) { return p.event; }).map(function (p) { return p.event + ':' + (p.only || ''); }) };
    }),
    events: Object.keys(st.events), tasks: st.events.tournament.tasks.map(function (t) { return t.id + ':' + t.view; }),
    houses: st.houses.map(function (h) { return [h.id, h.crit, h.critName, h.main, h.accent, h.head, h.name, h.emblem].join('|'); })
  };
}
if (O) {
  var a = idsOf(S), b = idsOf(O);
  ['events', 'tasks', 'houses'].forEach(function (k) { if (JSON.stringify(a[k]) !== JSON.stringify(b[k])) err('ids differ in ' + k + ': ' + JSON.stringify(a[k]) + ' vs ' + JSON.stringify(b[k])); });
  if (a.chapters.length !== b.chapters.length) err('chapter count differs');
  a.chapters.forEach(function (c, i) { var o = b.chapters[i]; ['id', 'n', 'keepsake', 'opens', 'missions', 'gate', 'events'].forEach(function (k) { if (JSON.stringify(c[k]) !== JSON.stringify(o[k])) err(c.id + ': ' + k + ' differs from the old file'); }); });
}
if (S.version !== '2026-10-15') err('version should be 2026-10-15');
if (S.term !== 'The Observatory · Second Year') err('term should be "The Observatory · Second Year"');

/* report */
stats.forEach(function (s) { console.log(s); });
console.log('tournament: ' + S.events.tournament.pages.length + ' pages · finale: 1');
console.log('texts checked: ' + pagesChecked + ' · distinct pictures: ' + Object.keys(imgs).length + ' · rare words: ' + Object.keys(rareSeen).length);
console.log('rare words: ' + Object.keys(rareSeen).join(', '));
warnings.forEach(function (w) { console.log('warn  ' + w); });
errors.forEach(function (e) { console.log('ERROR ' + e); });
console.log((errors.length ? 'FAILED: ' : 'OK: ') + errors.length + ' errors, ' + warnings.length + ' warnings');
process.exit(errors.length ? 1 : 0);
