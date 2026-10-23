#!/usr/bin/env node
/* WS-G (Variety of Writing 2, phase 1) — roster and example checks.
   1. roster.js: the 4.1 Fast Access list is the 30 nicknames of the class register
      (roster/M4-1-Roster.xlsx, Oct 2026) in register order; ids unique; Donut is
      both m41-donut (M4.1) and tut-donut (tutee); m41-ai and m41-lillil keep their ids.
   2. example-real.js: the p-bar-screentime (COMPARE) paragraphs use comparison
      language, not trend verbs (a COMPARE chart has no time axis).
   Run: node tools/ws-g-test.js */
var vm = require('vm'), fs = require('fs'), path = require('path');
var ROOT = path.join(__dirname, '..');
var ctx = { console: console }; ctx.window = ctx; vm.createContext(ctx);
['roster.js', 'example-real.js'].forEach(function (f) { vm.runInContext(fs.readFileSync(path.join(ROOT, f), 'utf8'), ctx, { filename: f }); });
var fails = 0;
function check(name, ok, extra) { console.log((ok ? '  ok   ' : '  FAIL ') + name + (ok || extra === undefined ? '' : ' — ' + JSON.stringify(extra))); if (!ok) fails++; }

/* 1. roster */
var M41 = ['Donut', 'Lookchin', 'Baiplu', 'Sun', 'Mint', 'Proud', 'Airin', 'Oly', 'Noyny', 'Ob-oon', 'Pasta', 'Premier', 'Nicha', 'Nene', 'Punnee',
  'Vernier', 'Rak', 'Min', 'Panghom', 'Carrot', 'Chicha', 'Wongree', 'Moquette', 'Pin', 'Lilil', 'Thinn', 'Ren', 'Khaofang', 'Gam', 'Mon'];
var g = ctx.ROSTER_GROUPS.filter(function (x) { return x.key === 'm41'; })[0];
var names = g.students.map(function (s) { return s.name; });
check('4.1 Fast Access has 30 students', names.length === 30, names.length);
check('… the register names in register order', JSON.stringify(names) === JSON.stringify(M41), names);
var ids = {}, dup = [];
ctx.ROSTER.forEach(function (s) { if (ids[s.id]) dup.push(s.id); ids[s.id] = 1; });
check('no duplicate ids across groups', dup.length === 0, dup);
check('every id is lower-case m41-/tut- with no spaces', ctx.ROSTER.every(function (s) { return /^(m41|tut)-[a-z0-9]+$/.test(s.id); }), ctx.ROSTER.map(function (s) { return s.id; }).filter(function (i) { return !/^(m41|tut)-[a-z0-9]+$/.test(i); }));
check('Donut is m41-donut in M4.1 and tut-donut in Tutoring', ids['m41-donut'] && ids['tut-donut']);
var byId = {}; ctx.ROSTER.forEach(function (s) { byId[s.id] = s; });
check('m41-ai keeps its id and shows as Airin', byId['m41-ai'] && byId['m41-ai'].name === 'Airin');
check('m41-lillil keeps its id and shows as Lilil', byId['m41-lillil'] && byId['m41-lillil'].name === 'Lilil');
check('M4.1 cohort label unchanged', g.cohort === 'M4.1' && g.label === '4.1 Fast Access');

/* 2. screentime example in COMPARE language */
var R = ctx.EXAMPLE_REAL || ctx.ExampleReal || ctx.EXAMPLES_REAL;
if (!R) { Object.keys(ctx).forEach(function (k) { if (ctx[k] && ctx[k].paras && ctx[k].lines) R = ctx[k]; }); }
check('example-real.js loaded', !!(R && R.paras));
if (R && R.paras) {
  var TREND = /\b(fell|rose|declined|increased|decreased|dropped|climbed|grew|plummeted|soared|dipped)\b/i;
  R.paras.filter(function (x) { return x.from === 'p-bar-screentime'; }).forEach(function (x) {
    var m = x.text.match(TREND);
    check('screentime ' + x.box + ' has no trend verb', !m, m && m[0]);
  });
  var det = R.paras.filter(function (x) { return x.from === 'p-bar-screentime' && x.box === 'detailA'; })[0];
  check('screentime detail A still carries its figures (21, 18, 11, 6, 12, 1 hours)', det && ['21 hours', '18 hours', '11 hours', '6 hours', '12 hours', '1 hour'].every(function (f) { return det.text.indexOf(f) >= 0; }), det && det.text);
}

/* 3. resetPassword is wired end to end (Code.gs action, api.js call, teacher.js button) */
var gs = fs.readFileSync(path.join(ROOT, 'Code.gs'), 'utf8'), apiSrc = fs.readFileSync(path.join(ROOT, 'api.js'), 'utf8'), tSrc = fs.readFileSync(path.join(ROOT, 'teacher.js'), 'utf8');
check('Code.gs dispatches resetPassword behind the teacher token', /case 'resetPassword': return T \? resetPassword\(p\) : denied\(\);/.test(gs));
check('Code.gs login accepts a 4+ character password when pw is empty (reset state)', /var reset = String\(s\.pw \|\| ''\) === '';/.test(gs) && /at least 4 characters/.test(gs));
check('resetPassword empties pw, retires the token, clears the lock and logs', /update\('Students', s\._row, \{ pw: '', token: token\(\) \}\);\s*cache\(\)\.remove\('lock:pw:'/.test(gs) && /log\('password reset ' \+ s\.id\)/.test(gs));
check('api.js exposes resetPassword(id) next to archiveStudent', /resetPassword: function \(id\) \{\s*return call\('resetPassword', \{ id: id \}/.test(apiSrc) && apiSrc.indexOf('resetPassword:') > apiSrc.indexOf('archiveStudent:'));
check('api.js offline login honours the reset state', /s\.pw === ''/.test(apiSrc));
check('teacher.js has the Reset password button beside Archive, with confirm and toast', /id="d-reset"/.test(tSrc) && /Reset password<\/button>/.test(tSrc) && /confirm\('Reset the password for/.test(tSrc) && /toast\('Reset\. Next time she signs in, the password she types becomes her new one\.'/.test(tSrc));

console.log(fails ? fails + ' WS-G check(s) failed' : 'all WS-G checks passed');
process.exit(fails ? 1 : 0);
