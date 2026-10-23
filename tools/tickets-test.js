#!/usr/bin/env node
/* WS-C · tickets-test.js — the Tickets module and Participation ledger without a browser.
   node tools/tickets-test.js  → exits 1 on any failure.
   1. Content: every set code parses (Qnn = 8 items, Enn = 5), every id resolves (tickets-content first, then the
      topic banks), tags are REMEDIATION ids, charts exist (after tickets.js pushes the WS-D prompts), one answer in
      range, hints never contain the answer text, no duplicate ids, exit tickets carry 1 judge item.
   2. Ledger maths on synthetic students: modules set by date and by override, dynamic module list (a 16th module),
      exit tickets set by date or by opening, team share → 5 pts, totals, halves.
   3. Tickets.gs in a vm with an in-memory Sheet: auth rules, open/close, done, results, live tail, config, teams. */
'use strict';
var fs = require('fs'), path = require('path'), vm = require('vm');
var ROOT = path.join(__dirname, '..');
var fails = 0;
function check(label, cond, extra) { console.log((cond ? '  ok   ' : '  FAIL ') + label + (cond ? '' : ' ' + JSON.stringify(extra))); if (!cond) fails++; }

/* ------------------------------------------------------------ 1. content */
var ctx = { console: console, localStorage: { getItem: function () { return null; }, setItem: function () {} }, Date: Date, Math: Math, JSON: JSON };
ctx.window = ctx; vm.createContext(ctx);
function load(f) { vm.runInContext(fs.readFileSync(path.join(ROOT, f), 'utf8'), ctx, { filename: f }); }
['content.js', 'partners.js', 'prompts.js', 'prompts-2.js', 'prompts-3.js', 'models.js'].forEach(load);
for (var i = 0; i < 15; i++) load('topic-' + String(i).padStart(2, '0') + '.js');
load('models-2.js'); load('mocks.js'); load('media.js'); load('engine.js'); load('tickets-content.js'); load('tickets.js');
var C = ctx.CONTENT, TK = ctx.Tickets, TC = ctx.TICKETS_CONTENT, E = ctx.Engine;
console.log('Content (tickets-content.js ' + TC.version + ')');
var codes = TK.codes();
check('sets present: ' + codes.map(function (c) { return c.code; }).join(' '), codes.length >= 7);
var PIDS = {}; C.PROMPTS.forEach(function (p) { PIDS[p.id] = 1; });
TC.prompts.forEach(function (p) { check('WS-D prompt ' + p.id + ' pushed onto CONTENT.PROMPTS once', C.PROMPTS.filter(function (q) { return q.id === p.id; }).length === 1); });
var seen = {}, dupes = [];
TC.items.forEach(function (it) { if (seen[it.id] || E.Bank.item(it.id)) dupes.push(it.id); seen[it.id] = 1; });
check('no duplicate item ids (within tickets-content or against the banks)', !dupes.length, dupes);
function stripTags(s) { return String(s || '').replace(/<[^>]+>/g, ''); }
codes.forEach(function (c) {
  var set = TK.setOf(c.code);
  check(c.code + ': ' + c.kindName + ' · ' + c.lesson + ' · ' + set.items.length + ' items, 0 missing', set.items.length === c.n && !set.missing.length, { n: set.items.length, missing: set.missing });
  var judges = 0;
  set.items.forEach(function (it) {
    if (!C.REMEDIATION[it.tag]) check(it.id + ': tag ' + it.tag + ' in REMEDIATION', false);
    if (!it.why) check(it.id + ': has why', false);
    if (!it.hint) check(it.id + ': has hint (first wrong answer shows it)', false);
    if (it.chart && !PIDS[it.chart] && !C.PROMPTS.some(function (p) { return p.id === it.chart; })) check(it.id + ': chart ' + it.chart + ' exists', false);
    if (it.type === 'choose') {
      if (!(it.answer >= 0 && it.answer < it.options.length)) check(it.id + ': answer in range', false);
      var key = stripTags(it.options[it.answer]).toLowerCase().trim();
      if (key.length > 3 && stripTags(it.hint).toLowerCase().indexOf(key) >= 0) check(it.id + ': hint does not contain the answer "' + key + '"', false);
      var opts = {}; it.options.forEach(function (o) { opts[stripTags(o).toLowerCase()] = 1; });
      if (Object.keys(opts).length !== it.options.length) check(it.id + ': options unique', false);
    }
    if (it.type === 'judge') { judges++; if (!it.given || !(it.answer === 0 || it.answer === 1 || it.answer === 2)) check(it.id + ': judge shape', false); }
    if (it.type === 'spot' && !(it.words && it.answer >= 0 && it.answer < it.words.length && it.fix)) check(it.id + ': spot shape', false);
    if (['A2', 'B1', 'B2', 'C1'].indexOf(it.level) < 0) check(it.id + ': level', false, it.level);
    if (TK.attemptId(it).indexOf('vw2-') !== 0) check(it.id + ': attempt id prefixed vw2-', false);
  });
  if (c.kind === 'E') check(c.code + ': carries a judge item', judges >= 1, judges);
});
check('a bank item referenced by id resolves from the topic banks', TK.resolve('m03s1q1') && TK.attemptId(TK.resolve('m03s1q1')) === 'vw2-m03s1q1');
check('codeInfo: Q02 → 8 items / 4 min / L2 / H1; E06 → L6 / H2', (function () { var q = TK.codeInfo('q02'), e = TK.codeInfo('E06'); return q.n === 8 && q.minutes === 4 && q.lesson === 'L2' && q.half === 'H1' && e.lesson === 'L6' && e.half === 'H2' && e.n === 5 && e.minutes === 3; })());
check('bad codes rejected', !TK.codeInfo('X01') && !TK.codeInfo('E1') && !TK.setOf('E99'));

/* ------------------------------------------------------------- 2. ledger */
console.log('Ledger');
var topics = C.TOPICS.concat([{ id: 'm15', code: 'Module 15', name: 'Comparing (new)', levels: [{ id: 'm15l1', check: { id: 'm15ck' }, subs: [] }] }]);
function stu(id, name, passed, tickets) {
  var checks = {}; passed.forEach(function (m) { var t = topics.filter(function (x) { return x.id === m; })[0]; checks[t.levels[0].check.id] = { best: 0.8 }; });
  var tk = {}; (tickets || []).forEach(function (c) { tk[c] = { score: 4, n: 5, at: '2026-11-13T10:00:00Z' }; });
  return { id: id, name: name, cohort: 'M4.1', progress: { displayName: name, checks: checks, tickets: tk } };
}
var students = [stu('m41-proud', 'Proud', ['m00', 'm01', 'm02', 'm03'], ['E01', 'E02']), stu('m41-mint', 'Mint', ['m00'], ['E01']), stu('m41-pasta', 'Pasta', [], [])];
var L = TK.ledger(students, { half: 'H1', today: '2026-11-14', topics: topics, config: null, sets: {}, results: [], teams: [] });
check('modules set by 14 Nov (H1) = m00 m01 m02 m03', L.modulesSet.join(' ') === 'm00 m01 m02 m03', L.modulesSet);
check('exit tickets set by 14 Nov = E01 E02 (lesson dates reached)', L.ticketsSet.join(' ') === 'E01 E02', L.ticketsSet);
var proud = L.rows.filter(function (r) { return r.id === 'm41-proud'; })[0], mint = L.rows.filter(function (r) { return r.id === 'm41-mint'; })[0];
check('Proud: 4/4 modules → 5 pts, 2/2 tickets → 5 pts, team 0 → total 10', proud.modulesPts === 5 && proud.ticketsPts === 5 && proud.teamPts === 0 && proud.total === 10, proud);
check('Mint: 1/4 → 1.3 pts, 1/2 → 2.5 pts', mint.modulesPts === 1.3 && mint.ticketsPts === 2.5, mint);
check('teams from the Groups tab by nickname: Proud → Team 2, Mint → Team 1', proud.team === 'Team 2' && mint.team === 'Team 1', [proud.team, mint.team]);
check('no Teams sheet → note', /No Teams sheet/.test(L.teamNote));
var L2 = TK.ledger(students, { half: 'H1', today: '2026-11-14', topics: topics, config: { H1: { on: ['m15'], off: ['m03'] } }, sets: { E03: { state: 'open', openedAt: '2026-11-14T02:00:00Z' } }, results: [{ studentId: 'M41-PASTA', code: 'E03', score: 5, n: 5 }],
  teams: [{ ts: '2026-11-13T03:00:00Z', cohort: 'M4.1', team: 'Team 1', kind: 'points', points: 30 }, { ts: '2026-11-13T03:00:00Z', team: 'Team 2', kind: 'points', points: 10 }, { ts: '2026-12-20T03:00:00Z', team: 'Team 2', kind: 'points', points: 500 }, { kind: 'member', team: 'Team 3', studentId: 'm41-pasta' }] });
check('override: m15 ticked (no date) counts, m03 unticked does not; list is dynamic (16 modules offered)', L2.modulesSet.join(' ') === 'm00 m01 m02 m15', L2.modulesSet);
check('an opened code is set before its lesson date (E03 opened 14 Nov)', L2.ticketsSet.join(' ') === 'E01 E02 E03', L2.ticketsSet);
var pasta2 = L2.rows.filter(function (r) { return r.id === 'm41-pasta'; })[0], proud2 = L2.rows.filter(function (r) { return r.id === 'm41-proud'; })[0], mint2 = L2.rows.filter(function (r) { return r.id === 'm41-mint'; })[0];
check('a TicketResults row counts as completed (case-insensitive id): Pasta 1/3 tickets → 1.7', pasta2.ticketsDone.join('') === 'E03' && pasta2.ticketsPts === 1.7, pasta2);
check('Teams member row overrides the Groups default (Pasta → Team 3)', pasta2.team === 'Team 3');
check('team share: Team 1 30 pts ÷ 1 member = 30 → 5 pts; Team 2 10 ÷ 1 = 10 → 1.7; H2 points ignored in H1', mint2.share === 30 && mint2.teamPts === 5 && proud2.share === 10 && proud2.teamPts === 1.7, [mint2.share, mint2.teamPts, proud2.share, proud2.teamPts]);
check('Proud total = 3/4 modules 3.8 + 2/3 tickets 3.3 + team 1.7 = 8.8', proud2.modulesPts === 3.8 && proud2.ticketsPts === 3.3 && proud2.total === 8.8, proud2.total);
/* WS-I: the shape Assembly.gs really writes — no kind, one row per student per posted round (team points credited to each member). */
var L5 = TK.ledger(students, { half: 'H1', today: '2026-11-14', topics: topics, config: null, sets: {}, results: [],
  teams: [{ ts: '2026-10-30T03:10:00Z', round: 'AB1', game: 'mode-sort', lesson: 'L1', team: 'Team 2', studentId: 'm41-proud', points: 20, by: 'teacher' },
          { ts: '2026-10-30T03:10:00Z', round: 'AB1', game: 'mode-sort', lesson: 'L1', team: 'Team 1', studentId: 'm41-mint', points: 10, by: 'teacher' },
          { ts: '2026-11-13T03:10:00Z', round: 'AB2', game: 'overview-or-not', lesson: 'L2', team: 'Team 1', studentId: 'm41-mint', points: 15, by: 'teacher' },
          { ts: '2026-11-13T03:10:00Z', round: 'AB2', game: 'overview-or-not', lesson: 'L2', team: 'Team 1', studentId: 'M41-PASTA', points: 15, by: 'teacher' },
          { ts: '2026-12-20T03:10:00Z', round: 'AB3', game: 'slice-it', lesson: 'L6', team: 'Team 2', studentId: 'm41-proud', points: 500, by: 'teacher' }] });
var proud5 = L5.rows.filter(function (r) { return r.id === 'm41-proud'; })[0], mint5 = L5.rows.filter(function (r) { return r.id === 'm41-mint'; })[0], pasta5 = L5.rows.filter(function (r) { return r.id === 'm41-pasta'; })[0];
check('Assembly.gs rows: a student\'s share is her own sum (Mint 25 → 5, Proud 20 → 4, Pasta 15 → 3); H2 rows ignored; team from the row (Pasta → Team 1)',
  mint5.share === 25 && mint5.teamPts === 5 && proud5.share === 20 && proud5.teamPts === 4 && pasta5.share === 15 && pasta5.teamPts === 3 && pasta5.team === 'Team 1' && !L5.teamNote, [mint5.share, mint5.teamPts, proud5.share, proud5.teamPts, pasta5.share, pasta5.teamPts, pasta5.team, L5.teamNote]);
check('Assembly.gs rows: team totals still shown (Team 1 = 40, Team 2 = 20)', L5.teamTotals['Team 1'] === 40 && L5.teamTotals['Team 2'] === 20, L5.teamTotals);
var L3 = TK.ledger(students, { half: 'H2', today: '2027-01-16', topics: topics, config: null, sets: {}, results: [], teams: [] });
check('H2 on 16 Jan: modules m08 m09 set; no H2 ticket sets exist yet (phase 2) so 0 set; H1 work not counted', L3.modulesSet.join(' ') === 'm08 m09' && L3.ticketsSet.length === 0 && L3.rows[0].modulesN === 2 && L3.rows[0].ticketsDone.length === 0 && L3.rows[0].modulesPassed.length === 0, [L3.modulesSet, L3.ticketsSet]);
var L4 = TK.ledger(students, { half: 'H1', today: '2026-10-29', topics: topics, config: null, sets: {}, results: [], teams: [] });
check('before L1 nothing is set: every student 0/0 → 0 pts, no division by zero', L4.modulesSet.length === 0 && L4.ticketsSet.length === 0 && L4.rows.every(function (r) { return r.total === 0; }));

/* ---------------------------------------------------------- 3. Tickets.gs */
console.log('Tickets.gs');
function Sheet(name) { this.name = name; this.rows = []; }
Sheet.prototype.appendRow = function (r) { this.rows.push(r.slice()); };
Sheet.prototype.setFrozenRows = function () {};
Sheet.prototype.getLastRow = function () { return this.rows.length; };
Sheet.prototype.getLastColumn = function () { return this.rows.length ? this.rows[0].length : 0; };
Sheet.prototype.getName = function () { return this.name; };
Sheet.prototype.deleteRow = function (r) { this.rows.splice(r - 1, 1); };
Sheet.prototype.getRange = function (r, c, nr, nc) {
  var sh = this; nr = nr || 1; nc = nc || 1;
  return {
    getValues: function () { var out = []; for (var i = 0; i < nr; i++) { var row = sh.rows[r - 1 + i] || [], o = []; for (var j = 0; j < nc; j++) o.push(row[c - 1 + j] == null ? '' : row[c - 1 + j]); out.push(o); } return out; },
    getValue: function () { var row = sh.rows[r - 1] || []; return row[c - 1] == null ? '' : row[c - 1]; },
    setValue: function (v) { var row = sh.rows[r - 1] || (sh.rows[r - 1] = []); row[c - 1] = v; return this; },
    setNumberFormat: function () { return this; },
    setValues: function (v) { for (var i = 0; i < v.length; i++) { var row = sh.rows[r - 1 + i] || (sh.rows[r - 1 + i] = []); for (var j = 0; j < v[i].length; j++) row[c - 1 + j] = v[i][j]; } },
    createTextFinder: function (t) { return { matchEntireCell: function () { return this; }, findNext: function () { for (var i = 0; i < nr; i++) { var row = sh.rows[r - 1 + i] || []; for (var j = 0; j < nc; j++) if (String(row[c - 1 + j]) === String(t)) return { getRow: function () { return r + i; } }; } return null; } }; }
  };
};
var book = { sheets: {}, getSheetByName: function (n) { return this.sheets[n] || null; }, insertSheet: function (n) { return (this.sheets[n] = new Sheet(n)); }, getName: function () { return 'Test sheet'; } };
var props = { TEACHER_PIN: '4821' }, cacheStore = {};
var gctx = {
  console: console,
  SpreadsheetApp: { getActive: function () { return book; } },
  LockService: { getScriptLock: function () { return { waitLock: function () {}, tryLock: function () { return true; }, releaseLock: function () {} }; } },
  PropertiesService: { getScriptProperties: function () { return { getProperty: function (k) { return props[k] || null; }, setProperty: function (k, v) { props[k] = v; } }; } },
  CacheService: { getScriptCache: function () { return { get: function (k) { return cacheStore[k] || null; }, put: function (k, v) { cacheStore[k] = v; }, remove: function (k) { delete cacheStore[k]; }, putAll: function (o) { Object.keys(o).forEach(function (k) { cacheStore[k] = o[k]; }); } }; } },
  UrlFetchApp: { fetch: function () { throw new Error('no network in test'); } },
  Utilities: { computeDigest: function (alg, s) { return Array.from(require('crypto').createHash('sha256').update(s).digest()).map(function (b) { return b > 127 ? b - 256 : b; }); }, DigestAlgorithm: { SHA_256: 'sha256' }, getUuid: function () { return require('crypto').randomUUID(); }, sleep: function () {}, formatDate: function () { return '20261030'; } },
  ContentService: { createTextOutput: function (t) { return { t: t, setMimeType: function () { return this; } }; }, MimeType: { JSON: 'json' } }
};
vm.createContext(gctx);
var codeGs = fs.readFileSync(path.join(ROOT, 'Code.gs'), 'utf8');
/* The TICKETS-HOOK as WS-I will add it to doPost (docs/cross-group/WS-C.md): emulated here if Code.gs does not carry it yet. */
var HOOK = "if (String(req.action || '').indexOf('tickets.') === 0) return out(TICKETS_handle(req.action, req.payload || {}));";
if (codeGs.indexOf('TICKETS_handle') < 0) codeGs = codeGs.replace("if (String(req.action || '').indexOf('lab.') === 0) return out(LAB_handle(req.action, req.payload || {}));", function (m) { return m + '\n  ' + HOOK; });
check('TICKETS-HOOK line is in place for the test', codeGs.indexOf('TICKETS_handle(req.action') > 0);
vm.runInContext(codeGs + '\n' + fs.readFileSync(path.join(ROOT, 'Lab.gs'), 'utf8') + '\n' + fs.readFileSync(path.join(ROOT, 'Tickets.gs'), 'utf8'), gctx);
function post(action, payload) { var r = gctx.doPost({ postData: { contents: JSON.stringify({ action: action, payload: payload }) } }); return JSON.parse(r.t); }
var reg = post('register', { id: 'm41-proud', pw: 'secret12', name: 'Proud' }); check('student registered', reg.ok && reg.token, reg);
var tok = reg.token, tt = post('teacherLogin', { pin: '4821' }).tt; check('teacher signed in', !!tt);
check('no auth → refused', post('tickets.status', {}).ok === false);
check('wrong student token → refused', post('tickets.status', { studentId: 'm41-proud', token: 'nope' }).ok === false);
check('student may read status', post('tickets.status', { studentId: 'm41-proud', token: tok }).ok === true);
check('student may not open a code', post('tickets.open', { studentId: 'm41-proud', token: tok, code: 'E01' }).auth === 'teacher');
var op = post('tickets.open', { tt: tt, code: 'e01', lesson: 'L1' });
check('teacher opens E01 (code upper-cased)', op.ok && op.sets.E01 && op.sets.E01.state === 'open' && op.sets.E01.openedAt, op);
check('bad code refused', post('tickets.open', { tt: tt, code: 'X9' }).ok === false);
var cl = post('tickets.close', { tt: tt, code: 'E01' });
check('teacher closes E01; openedAt kept', cl.sets.E01.state === 'closed' && cl.sets.E01.closedAt && cl.sets.E01.openedAt === op.sets.E01.openedAt, cl.sets.E01);
check('re-open keeps one row per code', post('tickets.open', { tt: tt, code: 'E01' }).ok && book.sheets.TicketSets.rows.length === 2);
var dn = post('tickets.done', { studentId: 'm41-proud', token: tok, code: 'E01', lesson: 'L1', score: 4, n: 5, seconds: 150, hinted: 1, tags: ['kn-triage-mode'], name: 'Proud', cohort: 'M4.1' });
check('student posts a result', dn.ok === true, dn);
check('teacher cannot post a result; student cannot read results', post('tickets.done', { tt: tt, code: 'E01' }).auth === 'teacher' && post('tickets.results', { studentId: 'm41-proud', token: tok }).auth === 'teacher');
var rs = post('tickets.results', { tt: tt });
check('results row: Proud E01 4/5, tags as text', rs.ok && rs.results.length === 1 && rs.results[0].studentId === 'm41-proud' && rs.results[0].score === 4 && rs.results[0].tags === 'kn-triage-mode', rs);
/* ticket attempts travel in the ordinary save(): the live grid reads the Attempts tail */
var login = post('login', { id: 'm41-proud', pw: 'secret12' }); var prog = login.progress; prog.rev = 1;
var sv = post('save', { token: login.token, progress: prog, attempts: [
  { ts: '2026-10-30T03:01:00Z', studentId: 'm41-proud', itemId: 'vw2-e01-01', topic: 'E01', level: 'L1', type: 'choose', tag: 'kn-triage-mode', cefr: 'A2', correct: 1, ms: 4000, hinted: 0, fast: 0, mode: 'ticket', given: 'TREND', expected: 'TREND' },
  { ts: '2026-10-30T03:01:20Z', studentId: 'm41-proud', itemId: 'vw2-e01-02', topic: 'E01', level: 'L1', type: 'choose', tag: 'kn-triage-mode', cefr: 'A2', correct: 0, ms: 9000, hinted: 1, fast: 0, mode: 'ticket', given: 'SPACE → SEQUENCE', expected: 'SEQUENCE' },
  { ts: '2026-10-30T03:02:00Z', studentId: 'm41-proud', itemId: 'm03s1q1', topic: 'm03', level: 'm03l1', type: 'choose', tag: 'ta-no-overview', cefr: 'A2', correct: 1, ms: 3000, hinted: 0, fast: 1, mode: 'module', given: 'Overall,', expected: 'Overall,' }
] });
check('save accepted the attempts', sv.ok === true, sv);
var lv = post('tickets.live', { tt: tt, code: 'E01' });
check('live tail: 2 ticket rows for E01, the module row left out, given/expected stripped', lv.ok && lv.rows.length === 2 && lv.rows.every(function (r) { return r.mode === 'ticket' && r.given === undefined; }) && lv.rows[1].hinted === 1, lv);
check('live for an unopened code → empty', post('tickets.live', { tt: tt, code: 'Q02' }).rows.length === 0);
var cf = post('tickets.config', { tt: tt, set: true, config: { H1: { on: ['m15'], off: [] }, H2: { on: [], off: [] } } });
check('config saved and read back; _LEDGER row hidden from status', cf.ok && post('tickets.config', { tt: tt }).config.H1.on[0] === 'm15' && !post('tickets.status', { tt: tt }).sets._LEDGER);
check('config overwrite keeps one row', post('tickets.config', { tt: tt, set: true, config: { H1: { on: [], off: ['m03'] } } }).ok && book.sheets.TicketSets.rows.filter(function (r) { return r[0] === '_LEDGER'; }).length === 1);
var tm0 = post('tickets.teams', { tt: tt }); check('no Teams sheet → sheet:false, rows []', tm0.ok && tm0.sheet === false && tm0.rows.length === 0, tm0);
var teams = book.insertSheet('Teams'); teams.appendRow(['ts', 'cohort', 'team', 'kind', 'studentId', 'points', 'game', 'round', 'json']); teams.appendRow(['2026-11-13T03:00:00Z', 'M4.1', 'Team 1', 'points', '', 30, 'mode-sort', 'R1', '']); teams.appendRow(['', 'M4.1', 'Team 3', 'member', 'm41-pasta', '', '', '', '']);
var tm = post('tickets.teams', { tt: tt });
check('Teams sheet read by header: 2 rows, points numeric', tm.sheet === true && tm.rows.length === 2 && tm.rows[0].points === 30 && tm.rows[1].kind === 'member', tm);
check('unknown tickets.* action', /Unknown action/.test(post('tickets.nope', { tt: tt }).error));
check('Code.gs still answers its own actions after the hook', post('ping', {}).ok === true);

console.log(fails ? '\n' + fails + ' FAILED' : '\nall green');
process.exit(fails ? 1 : 0);
