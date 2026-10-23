/* Runs Code.gs + Lab.gs in Node against an in-memory Google Sheet and a fake
   Claude API, to check the access rules (ported from Quillmoor Task 2), the
   House Cup (`houses`), story orders, and Chart Control's AI band estimates
   (CC_tick / markReport '*') before deploying. The Spellbook Workshop back
   end (Lab.gs) has its own test: node tools/lab-gs-test.js
   node tools/gs-test.js                                                   */
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.join(__dirname, '..');

/* ---------------------------------------------------- in-memory sheets */
function Sheet(name) { this.name = name; this.rows = []; }
Sheet.prototype.appendRow = function (r) { this.rows.push(r.slice()); };
Sheet.prototype.setFrozenRows = function () {};
Sheet.prototype.copyTo = function (book) { const c = new Sheet(this.name + ' copy'); c.rows = this.rows.map((r) => r.slice()); c.setName = (n) => { c.name = n; (book.sheets || {})[n] = c; return c; }; return c; };
Sheet.prototype.getLastRow = function () { return this.rows.length; };
Sheet.prototype.getName = function () { return this.name; };
Sheet.prototype.deleteRow = function (r) { this.rows.splice(r - 1, 1); };
Sheet.prototype.deleteRows = function (r, n) { this.rows.splice(r - 1, n); };
Sheet.prototype.getRange = function (r, c, nr, nc) {
  const sh = this; nr = nr || 1; nc = nc || 1;
  if (typeof r === 'string') { r = 1; c = 1; nr = sh.rows.length; nc = 1; }
  return {
    getValues() { const out = []; for (let i = 0; i < nr; i++) { const row = sh.rows[r - 1 + i] || []; const o = []; for (let j = 0; j < nc; j++) o.push(row[c - 1 + j] == null ? '' : row[c - 1 + j]); out.push(o); } return out; },
    clearContent() { for (let i = 0; i < nr; i++) { const row = sh.rows[r - 1 + i]; if (row) for (let j = 0; j < nc; j++) row[c - 1 + j] = ''; } return this; },
    getValue() { const row = sh.rows[r - 1] || []; return row[c - 1] == null ? '' : row[c - 1]; },
    setNumberFormat(f) { sh.formats = sh.formats || []; sh.formats.push([r, c, nr, nc, f]); return this; },
    setValues(v) { for (let i = 0; i < v.length; i++) { const row = sh.rows[r - 1 + i] || (sh.rows[r - 1 + i] = []); for (let j = 0; j < v[i].length; j++) row[c - 1 + j] = v[i][j]; } },
    createTextFinder(t) { return { matchEntireCell() { return this; }, findNext() {
      for (let i = 0; i < nr; i++) { const row = sh.rows[r - 1 + i] || []; for (let j = 0; j < nc; j++) if (String(row[c - 1 + j]) === String(t)) return { getRow: () => r + i }; }
      return null; } }; }
  };
};
const book = { sheets: {}, getSheetByName(n) { return this.sheets[n] || null; }, insertSheet(n) { return (this.sheets[n] = new Sheet(n)); }, getName() { return 'Test sheet'; } };

/* ---------------------------------------------------------- fake Claude */
const calls = [];
let failModel = null;
function fakeFetch(url, opts) {
  const body = JSON.parse(opts.payload);
  calls.push(body);
  if (!opts.headers['x-api-key']) throw new Error('no key header');
  if (body.model === failModel) return { getResponseCode: () => 404, getContentText: () => '{"error":"not_found"}' };
  if (!body.tool_choice) { /* report marking (Code.gs markWithModel): plain text with a JSON object */
    return { getResponseCode: () => 200, getContentText: () => JSON.stringify({ content: [{ type: 'text', text: 'Here: {"ta":6.5,"cc":6,"lr":6,"gra":5.5,"overall":9,"cefr":"C2","ceilings":["no overview → TA max 5"],"errors":[{"quote":"rise","tag":"gra-tense","fix":"rose"}],"nextGate":"Write an overview.","comment":"Ploy, great!"}' }] }) };
  }
  const name = body.tool_choice.name;
  let input;
  if (name === 'coach_line') input = { errors: [{ original: 'recieve', correction: 'receive', type: 'spelling', explain: 'i before e.' }, { original: 'same', correction: 'same', type: 'grammar', explain: 'bogus' }],
    fn: { verdict: 'meets', comment: 'Does the job.' }, generic: { ok: true, note: '' }, slotForm: 'noun phrase', cefr: 'C1', band: 7.74, praise: 'x', tip: 'y' };
  if (name === 'coach_variable') input = { errors: [], fn: { verdict: 'partly', comment: 'Too general.' }, relevance: { ok: true, note: '' }, fit: { ok: false, note: 'agreement' }, reword: { ok: true, note: '' }, cefr: 'B2', band: 6.5, praise: 'p', tip: 't' };
  if (name === 'rate_essay') input = { tr: 7.2, cc: 7, lr: 6.5, gra: 7, cefr: 'C1', summary: 's', strengths: ['a', 'b', 'c', 'd'], priorities: [{ crit: 'LR', text: 'x' }], frameNote: 'f' };
  return { getResponseCode: () => 200, getContentText: () => JSON.stringify({ content: [{ type: 'tool_use', name, input }] }) };
}

/* ------------------------------------------------------- Apps Script API */
const props = { TEACHER_PIN: '4821', ANTHROPIC_API_KEY: 'sk-test', LAB_STUDENT_DAILY: '5' };
const cacheStore = {};
const ctx = {
  console,
  SpreadsheetApp: { getActive: () => book },
  LockService: { getScriptLock: () => ({ waitLock() {}, releaseLock() {} }) },
  PropertiesService: { getScriptProperties: () => ({ getProperty: (k) => props[k] || null, setProperty: (k, v) => { props[k] = v; } }) },
  CacheService: { getScriptCache: () => ({ get: (k) => cacheStore[k] || null, put: (k, v) => { cacheStore[k] = v; }, remove: (k) => { delete cacheStore[k]; } }) },
  UrlFetchApp: { fetch: fakeFetch },
  Utilities: {
    computeDigest: (alg, s) => Array.from(require('crypto').createHash('sha256').update(s).digest()).map((b) => (b > 127 ? b - 256 : b)),
    DigestAlgorithm: { SHA_256: 'sha256' }, getUuid: () => require('crypto').randomUUID(), sleep() {},
    formatDate: () => '20260925'
  },
  ContentService: { createTextOutput: (t) => ({ t, setMimeType() { return this; } }), MimeType: { JSON: 'json' } }
};
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(ROOT, 'Code.gs'), 'utf8') + '\n' + fs.readFileSync(path.join(ROOT, 'Lab.gs'), 'utf8'), ctx);
function post(action, payload) { const r = ctx.doPost({ postData: { contents: JSON.stringify({ action, payload }) } }); return JSON.parse(r.t); }

let fails = 0;
function check(label, cond, extra) { console.log((cond ? '  ok   ' : '  FAIL ') + label + (cond ? '' : ' ' + JSON.stringify(extra))); if (!cond) fails++; }

/* ------------------------------------------------------------------ run */
const reg = post('register', { id: 'ploy', pw: 'pw1234', name: 'Ploy' });
check('register', reg.ok && reg.token, reg);
const tok = reg.token;
post('register', { id: 'mint', pw: 'pw9999', name: 'Mint' });

const mintTok = post('login', { id: 'mint', pw: 'pw9999' }).token;
check('ping', post('ping', {}).ok === true);

/* ------------------------------------------------- access (Oct 2026) */
const sub = (id, sid, tk) => post('submitReport', { token: tk, report: { id, studentId: sid, text: 'essay ' + id, words: 260, preflight: {} } });
check('student submits her own report', sub('R1', 'ploy', tok).ok);
check('student cannot submit as another student', sub('R2', 'mint', tok).ok === false);
check('no token: submit refused', sub('R3', 'ploy', undefined).ok === false);
check('roster refused without teacher token', post('roster', {}).ok === false);
check('detail refused without teacher token', post('detail', { id: 'ploy' }).ok === false);
check('all reports refused without teacher token', post('reports', { studentId: '' }).ok === false);
check('student cannot read another student\'s reports', post('reports', { studentId: 'ploy', token: mintTok }).ok === false);
check('student reads her own reports', post('reports', { studentId: 'ploy', token: tok }).reports.length === 1);
check('markReport refused without teacher token', post('markReport', { id: 'R1', mark: { released: true, teacher: { bands: { overall: 9 } } } }).ok === false);
check('student cannot mark her own essay', post('markReport', { id: 'R1', token: tok, mark: { released: true } }).ok === false);
check('assignment set refused for a student', post('assignments', { kind: 'set', token: tok, row: { id: 'A9' } }).ok === false);
check('projector clear refused for a student', post('projector', { kind: 'clear', token: tok }).ok === false);
check('student can list assignments', post('assignments', { kind: 'list', token: tok }).ok === true);
check('student posts to the projector as herself', post('projector', { kind: 'post', token: tok, row: { kind: 'post', studentId: 'ploy', round: 'r1' } }).ok === true);
check('student cannot post as another student', post('projector', { kind: 'post', token: tok, row: { kind: 'post', studentId: 'mint', round: 'r1' } }).ok === false);
const save0 = post('save', { progress: { studentId: 'ploy' }, attempts: [] });
check('save refused with no token', save0.ok === false);
check('save refused with another student\'s token', post('save', { token: mintTok, progress: { studentId: 'ploy' }, attempts: [] }).ok === false);
check('wrong PIN refused', post('teacherLogin', { pin: '0000' }).ok === false);
const tl = post('teacherLogin', { pin: '4821' });
check('teacher login returns a token', tl.ok && tl.tt);
check('teacher reads roster', post('roster', { tt: tl.tt }).ok === true);
check('teacher reads all reports, unstripped', post('reports', { studentId: '', tt: tl.tt }).reports.length === 1);
check('teacher marks and releases', post('markReport', { tt: tl.tt, id: 'R1', mark: { released: true, status: 'released', teacher: { bands: { overall: 7 } } } }).ok === true);
check('markReport refuses unknown fields', post('markReport', { tt: tl.tt, id: 'R1', mark: { studentId: 'mint' } }).ok === false);
check('a forged teacher token is refused', post('roster', { tt: 'forged' }).ok === false);
for (let i = 0; i < 5; i++) post('teacherLogin', { pin: 'x' + i });
check('PIN locks after five misses', /Too many/.test(post('teacherLogin', { pin: '4821' }).error || ''));
for (const k of Object.keys(cacheStore)) if (k.indexOf('lock:') === 0) delete cacheStore[k];
delete props.TEACHER_PIN;
check('no PIN set: console refuses (no 1234 default)', post('teacherLogin', { pin: '1234' }).ok === false);
props.TEACHER_PIN = '4821';
const st = book.sheets.Students.rows.find((r) => r[0] === 'ploy');
check('new passwords are salted (v2)', /^v2\$/.test(st[2]));
const legacyHash = Array.from(require('crypto').createHash('sha256').update('old1|chart-control').digest()).map((b) => ('0' + b.toString(16)).slice(-2)).join('');
book.sheets.Students.rows.push(['legacy', 'Legacy', legacyHash, '', '', 'tok-legacy', '{}']);
const lg = post('login', { id: 'legacy', pw: 'old1' });
check('legacy password still logs in, keeps its token', lg.ok && lg.token === 'tok-legacy');
check('legacy password upgraded to v2 on login', /^v2\$/.test(book.sheets.Students.rows.find((r) => r[0] === 'legacy')[2]));
check('second login keeps the same token (two devices)', post('login', { id: 'ploy', pw: 'pw1234' }).token === tok);
for (let i = 0; i < 5; i++) post('login', { id: 'mint', pw: 'bad' + i });
check('five wrong passwords lock the account', /Too many/.test(post('login', { id: 'mint', pw: 'pw9999' }).error || ''));
check('teacher can unlock it', post('unlock', { tt: tl.tt, id: 'mint' }).ok && post('login', { id: 'mint', pw: 'pw9999' }).ok);
check('a student cannot unlock', post('unlock', { token: tok, id: 'mint' }).ok === false);
check('student projector list needs a round', post('projector', { kind: 'list', token: tok, row: {} }).ok === false);
const pr2 = post('projector', { kind: 'post', token: tok, row: { kind: 'post', studentId: 'ploy', round: 'r2', text: 'x'.repeat(2000), win: true } });
check('student posts are trimmed and whitelisted', pr2.ok && pr2.posts.slice(-1)[0].text.length === 900 && pr2.posts.slice(-1)[0].win === undefined);
const lo = post('logout', { token: tok });
check('logout retires the token', lo.ok && post('reports', { studentId: 'ploy', token: tok }).ok === false);
props.JOIN_CODE = 'swep41';
check('join code required when set', post('register', { id: 'nok', pw: 'pw12' }).ok === false && post('register', { id: 'yes1', pw: 'pw12', code: 'SWEP41' }).ok === true);
delete props.JOIN_CODE;

/* ------------------------------------------- House Cup (Quillmoor, Oct 2026) */
const hcs = [['hc1', 'Tutoring', 'compass', 120], ['hc2', 'Tutoring', 'bridge', 40], ['hc3', 'Tutoring', 'compass', 30],
  ['hc4', 'M4.1', 'compass', 999], ['hc5', 'Tutoring', null, 50], ['hc6', 'Tutoring', 'loom', 'abc'], ['hc7', 'Tutoring', 'lexicon', -5]];
hcs.forEach(([id, coh, house, hp]) => {
  const r = post('register', { id, pw: 'pw12', name: 'Name-' + id });
  post('save', { token: r.token, progress: { studentId: id, displayName: 'Name-' + id, cohort: coh, story: { house, hp, chapter: 2 } }, attempts: [] });
});
const hc = post('houses', { cohort: 'Tutoring' });
check('houses needs no sign-in', hc.ok === true, hc);
check('houses sums story.hp per house for the cohort', hc.totals && hc.totals.compass === 150 && hc.totals.bridge === 40 && hc.totals.loom === 0 && hc.totals.lexicon === 0, hc.totals);
check('houses counts members (bad or negative hp counts as 0)', hc.members && hc.members.compass === 2 && hc.members.bridge === 1 && hc.members.loom === 1 && hc.members.lexicon === 1, hc.members);
check('houses ignores other cohorts and unsorted students', hc.totals.compass === 150 && Object.values(hc.members).reduce((a, b) => a + b, 0) === 5);
check('houses returns no names or ids', !/hc\d|Name-|ploy|mint/.test(JSON.stringify(hc)), hc);
check('houses: cohort match ignores case', post('houses', { cohort: 'tutoring' }).totals.compass === 150);
check('houses: other cohort', post('houses', { cohort: 'M4.1' }).totals.compass === 999);
check('houses: an unknown cohort gives zeros', Object.values(post('houses', { cohort: 'Nobody' }).totals).every((v) => v === 0));
const ul = post('assignments', { kind: 'set', tt: tl.tt, row: { id: 'U1', ts: '2026-10-11T00:00:00Z', kind: 'unlock', cohort: 'Tutoring', chapter: 7 } });
check('teacher stores a chapter-unlock row through assignments', ul.ok && ul.assignments.some((a) => a.kind === 'unlock' && a.chapter === 7));
const rs = post('assignments', { kind: 'set', tt: tl.tt, row: { id: 'U2', ts: '2026-10-11T00:00:00Z', kind: 'resort', studentId: 'hc1' } });
check('teacher stores a re-sort row through assignments', rs.ok && rs.assignments.some((a) => a.kind === 'resort' && a.studentId === 'hc1'));

/* ------------------------------------------- Archive (handover item 5, Oct 2026) */
check('archiveStudent needs the teacher token', post('archiveStudent', { id: 'hc3', archived: true }).ok === false);
const ar = post('archiveStudent', { tt: tl.tt, id: 'hc3', archived: true });
check('teacher archives a student (date stored)', ar.ok === true && /^\d{4}-\d\d-\d\d$/.test(ar.archived), ar);
check('the Students header gains an "archived" column', book.sheets.Students.rows[0][7] === 'archived', book.sheets.Students.rows[0]);
check('roster carries the archived flag', post('roster', { tt: tl.tt }).students.find((x) => x.id === 'hc3').archived === ar.archived);
const hcA = post('houses', { cohort: 'Tutoring' });
check('an archived student leaves the House Cup', hcA.totals.compass === 120 && hcA.members.compass === 1, hcA);
check('a save after archiving keeps the flag', (post('save', { token: post('login', { id: 'hc3', pw: 'pw12' }).token, progress: { studentId: 'hc3', displayName: 'Name-hc3', cohort: 'Tutoring', story: { house: 'compass', hp: 35, chapter: 2 } }, attempts: [] }).ok && post('roster', { tt: tl.tt }).students.find((x) => x.id === 'hc3').archived) === ar.archived);
check('teacher restores the student', post('archiveStudent', { tt: tl.tt, id: 'hc3', archived: false }).ok && post('roster', { tt: tl.tt }).students.find((x) => x.id === 'hc3').archived === '');
check('… and the House Cup counts them again', post('houses', { cohort: 'Tutoring' }).members.compass === 2);

/* ------------------------------------------- Reset password (WS-G, Oct 2026) */
check('resetPassword needs the teacher token', post('resetPassword', { id: 'hc3' }).ok === false);
check('resetPassword: unknown id', post('resetPassword', { tt: tl.tt, id: 'nobody-here' }).ok === false);
const oldTok = post('login', { id: 'hc3', pw: 'pw12' }).token;
for (let i = 0; i < 5; i++) post('login', { id: 'hc3', pw: 'wrong' });
check('hc3 is locked out before the reset', /Too many/.test(post('login', { id: 'hc3', pw: 'pw12' }).error || ''));
const rp = post('resetPassword', { tt: tl.tt, id: 'hc3' });
check('teacher resets the password', rp.ok === true && rp.id === 'hc3', rp);
check('the row\'s pw is empty and the token retired', (() => { const r = book.sheets.Students.rows.find((x) => x[0] === 'hc3'); return r[2] === '' && r[5] !== oldTok; })(), book.sheets.Students.rows.find((x) => x[0] === 'hc3'));
check('the old token no longer saves', post('save', { token: oldTok, progress: { studentId: 'hc3' }, attempts: [] }).ok === false);
check('a 3-character password is refused in the reset state', /at least 4/.test(post('login', { id: 'hc3', pw: 'abc' }).error || ''));
const nl = post('login', { id: 'hc3', pw: 'newpw99' });
check('login with a new password succeeds after the reset (lock cleared)', nl.ok === true && nl.token, nl);
check('… and stores a v2 hash', /^v2\$/.test(book.sheets.Students.rows.find((x) => x[0] === 'hc3')[2]));
check('the old password is rejected', post('login', { id: 'hc3', pw: 'pw12' }).ok === false);
check('the second login must use the new password', post('login', { id: 'hc3', pw: 'newpw99' }).ok === true && post('login', { id: 'hc3', pw: 'anything' }).ok === false);
check('progress survived the reset', (post('login', { id: 'hc3', pw: 'newpw99' }).progress || {}).displayName === 'Name-hc3');
const hcTok = post('login', { id: 'hc1', pw: 'pw12' }).token;
check('a student sees unlock rows in the assignments list', post('assignments', { kind: 'list', token: hcTok }).assignments.some((a) => a.id === 'U1'));
check('a student cannot set an unlock row', post('assignments', { kind: 'set', token: hcTok, row: { id: 'U3', kind: 'unlock', studentId: 'hc1', chapter: 7 } }).ok === false);

/* ------------------------------------------- AI band estimates (Task 1) */
check('aiStatus refused for a student', post('aiStatus', { token: hcTok }).ok === false);
const ais = post('aiStatus', { tt: tl.tt });
check('aiStatus for the teacher', ais.ok && ais.enabled === true, ais);
check('a student cannot trigger AI marking of everything', post('markReport', { id: '*', token: hcTok, mark: { requestAi: true } }).ok === false);
const hcSub = post('submitReport', { token: hcTok, report: { id: 'R9', studentId: 'hc1', name: 'Name-hc1', text: 'The line graph shows sales.\n\nSales rise.', words: 170, kind: 'mock', mode: 'TREND', promptDesc: 'A line graph…', preflight: { rows: [] } } });
check('report with a mode column', hcSub.ok && book.sheets.Reports.rows[0].indexOf('mode') > 0);
const before = calls.length;
const am = post('markReport', { id: '*', tt: tl.tt, mark: { requestAi: true } });
check('teacher triggers AI marking', am.ok && am.marked >= 1, am);
const r9 = JSON.parse(book.sheets.Reports.rows.find((r) => r[0] === 'R9').slice(-1)[0]);
check('overall is recomputed from the four bands, not trusted', r9.ai && r9.ai.bands.overall === 6, r9.ai && r9.ai.bands);
check('CEFR from the official map, not the model', r9.ai.cefr === 'B2', r9.ai.cefr);
check('ceilings and next gate kept', r9.ai.ceilings.length === 1 && /overview/.test(r9.ai.nextGate));
check('a mock gets a second independent pass', r9.ai.second && calls.length - before >= 2);
const mp = calls[calls.length - 1].messages[0].content;
check('marking prompt uses ceilings, not deductions', /CEILINGS/.test(mp) && !/−1|-1 TA/.test(mp));
check('marking prompt has the official CEFR map and rounding', /5\.5-6\.5 = B2/.test(mp) && /\.25 rounds up/.test(mp));
check('student never sees the hidden AI estimate', !post('reports', { studentId: 'hc1', token: hcTok }).reports.find((r) => r.id === 'R9').ai);

/* ------------------------------------------- stale or blank saves (review, Oct 2026) */
post('save', { token: hcTok, progress: { studentId: 'hc1', displayName: 'Name-hc1', xp: 900, story: { house: 'compass', hp: 120 } }, attempts: [] });
const blank = post('save', { token: hcTok, progress: { studentId: 'hc1', displayName: 'Name-hc1', xp: 0 }, attempts: [] });
check('a blank copy cannot overwrite newer progress', blank.ok === false && blank.stale === true && blank.progress.xp === 900, blank);
check('normal saves still work', post('save', { token: hcTok, progress: { studentId: 'hc1', displayName: 'Name-hc1', xp: 950 }, attempts: [] }).ok === true);

/* ------------------------------------------- attempt rows are written once (handover item 2, Oct 2026) */
{
  const A = () => (book.sheets.Attempts ? book.sheets.Attempts.rows.slice(1).filter((r) => String(r[1]) === 'hc1') : []);
  const before = A().length;
  const r1 = { ts: '2026-10-21T06:00:01.000Z', itemId: 'm05s1q1', topic: 'm05', correct: 1, given: 'b' };
  const r2 = { ts: '2026-10-21T06:00:07.000Z', itemId: 'm05s1q2', topic: 'm05', correct: 0, given: 'c' };
  const s1 = post('save', { token: hcTok, progress: { studentId: 'hc1', displayName: 'Name-hc1', xp: 960 }, attempts: [r1, r2] });
  check('a save writes its attempt rows', s1.ok === true && s1.added === 2 && A().length === before + 2, s1);
  const s2 = post('save', { token: hcTok, progress: { studentId: 'hc1', displayName: 'Name-hc1', xp: 960 }, attempts: [r1, r2, Object.assign({}, r2, { beaconed: 123 })] });
  check('the same outbox sent again adds no rows', s2.ok === true && s2.added === 0 && A().length === before + 2, s2);
  const r3 = Object.assign({}, r1, { given: 'd' });
  check('same item and second, different answer → a new row', post('save', { token: hcTok, progress: { studentId: 'hc1', displayName: 'Name-hc1', xp: 960 }, attempts: [r3] }).added === 1);
  Object.keys(cacheStore).filter((k) => k.indexOf('att:') === 0).forEach((k) => delete cacheStore[k]);
  const s4 = post('save', { token: hcTok, progress: { studentId: 'hc1', displayName: 'Name-hc1', xp: 960 }, attempts: [r1, r2, r3] });
  check('after the cache is gone, repeats are still found on the sheet', s4.added === 0 && A().length === before + 3, s4);
  const other = post('register', { id: 'hc9', pw: 'pw1234', name: 'Nine' });
  check('another student\'s identical row is still written', post('save', { token: other.token, progress: { studentId: 'hc9', displayName: 'Nine', xp: 10 }, attempts: [r1] }).added === 1);
  /* the clean-up for the duplicates already on the live sheet */
  const sh = book.sheets.Attempts, head = ctx.SHEETS.Attempts;
  const dupe = head.map((h) => ({ ts: r1.ts, studentId: 'hc1', itemId: r1.itemId, topic: 'm05', correct: 1, given: 'b' }[h] == null ? '' : { ts: r1.ts, studentId: 'hc1', itemId: r1.itemId, topic: 'm05', correct: 1, given: 'b' }[h]));
  sh.rows.push(dupe.slice(), dupe.slice());
  const total = sh.rows.length;
  const msg = ctx.dedupeAttempts();
  check('dedupeAttempts removes the two planted duplicates', /2 duplicates removed/.test(msg) && sh.rows.length === total - 2, msg);
  check('… keeping the first copy in place', A().filter((r) => r[2] === 'm05s1q1' && r[13] === 'b').length === 1);
  check('… and a second run finds nothing', /0 duplicates removed/.test(ctx.dedupeAttempts()));
  check('dedupeAttempts keeps a backup copy of the sheet first', Object.keys(book.sheets).some((n) => /^Attempts backup /.test(n)));
  /* review finding 1: Sheets stores "True" as a boolean and a timestamp may come back as a Date */
  const tsT = '2026-10-21T07:00:05.000Z';
  const typed = head.map((h) => ({ ts: new Date(tsT), studentId: 'hc1', itemId: 'm06s1q2', topic: 'm06', correct: 1, given: true }[h] ?? ''));
  sh.rows.push(typed);
  Object.keys(cacheStore).filter((k) => k.indexOf('att:') === 0).forEach((k) => delete cacheStore[k]);
  const s5 = post('save', { token: hcTok, progress: { studentId: 'hc1', displayName: 'Name-hc1', xp: 960 }, attempts: [{ ts: tsT, itemId: 'm06s1q2', topic: 'm06', correct: 1, given: 'True' }] });
  check('a resent "True" matches the boolean the sheet stored (cache cold)', s5.added === 0, s5);
  const fm = (sh.formats || []).filter((f) => f[4] === '@').map((f) => f[1]).sort().join(',');
  check('ts and given are written as plain text', /\b1\b/.test(fm) && /14/.test(fm), sh.formats);
  check('the cache holds short hashes, not raw text', Object.keys(cacheStore).filter((k) => k.indexOf('att:') === 0).every((k) => /^[0-9a-f]{12}(,[0-9a-f]{12})*$/.test(cacheStore[k])));
}

console.log(fails ? fails + ' failure(s)' : 'all Code.gs checks passed');
process.exit(fails ? 1 : 0);
