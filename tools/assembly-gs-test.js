/* Runs Code.gs + Assembly.gs in Node against an in-memory Sheet: the asm.* actions
   (team points, tally, house totals), their access rules and the de-duplication of a
   round posted twice. Also checks the ASM-HOOK: when Code.gs does not carry the
   dispatch line yet, asm.* is called directly (the hook is WS-I's one-line job).
   node tools/assembly-gs-test.js                                                 */
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.join(__dirname, '..');

function Sheet(name) { this.name = name; this.rows = []; }
Sheet.prototype.appendRow = function (r) { this.rows.push(r.slice()); };
Sheet.prototype.setFrozenRows = function () {};
Sheet.prototype.getLastRow = function () { return this.rows.length; };
Sheet.prototype.getName = function () { return this.name; };
Sheet.prototype.deleteRow = function (r) { this.rows.splice(r - 1, 1); };
Sheet.prototype.deleteRows = function (r, n) { this.rows.splice(r - 1, n); };
Sheet.prototype.getRange = function (r, c, nr, nc) {
  const sh = this; nr = nr || 1; nc = nc || 1;
  return {
    getValues() { const out = []; for (let i = 0; i < nr; i++) { const row = sh.rows[r - 1 + i] || []; const o = []; for (let j = 0; j < nc; j++) o.push(row[c - 1 + j] == null ? '' : row[c - 1 + j]); out.push(o); } return out; },
    getValue() { const row = sh.rows[r - 1] || []; return row[c - 1] == null ? '' : row[c - 1]; },
    setValues(v) { for (let i = 0; i < v.length; i++) { const row = sh.rows[r - 1 + i] || (sh.rows[r - 1 + i] = []); for (let j = 0; j < v[i].length; j++) row[c - 1 + j] = v[i][j]; } },
    setNumberFormat() { return this; }, clearContent() { return this; },
    createTextFinder(t) { return { matchEntireCell() { return this; }, findNext() { for (let i = 0; i < nr; i++) { const row = sh.rows[r - 1 + i] || []; for (let j = 0; j < nc; j++) if (String(row[c - 1 + j]) === String(t)) return { getRow: () => r + i }; } return null; } }; }
  };
};
const book = { sheets: {}, getSheetByName(n) { return this.sheets[n] || null; }, insertSheet(n) { return (this.sheets[n] = new Sheet(n)); }, getName() { return 'Test sheet'; } };
const props = { TEACHER_PIN: '4821' };
const cacheStore = {};
const ctx = {
  console,
  SpreadsheetApp: { getActive: () => book },
  LockService: { getScriptLock: () => ({ waitLock() {}, releaseLock() {}, tryLock() { return true; } }) },
  PropertiesService: { getScriptProperties: () => ({ getProperty: (k) => props[k] || null, setProperty: (k, v) => { props[k] = v; } }) },
  CacheService: { getScriptCache: () => ({ get: (k) => cacheStore[k] || null, put: (k, v) => { cacheStore[k] = v; }, remove: (k) => { delete cacheStore[k]; } }) },
  UrlFetchApp: { fetch() { throw new Error('no network in this test'); } },
  ScriptApp: { getProjectTriggers: () => [], newTrigger: () => ({ timeBased: () => ({ everyMinutes: () => ({ create() {} }) }) }) },
  Utilities: { computeDigest: (alg, s) => Array.from(require('crypto').createHash('sha256').update(s).digest()).map((b) => (b > 127 ? b - 256 : b)), DigestAlgorithm: { SHA_256: 'sha256' }, getUuid: () => require('crypto').randomUUID(), sleep() {}, formatDate: () => '20261030' },
  ContentService: { createTextOutput: (t) => ({ t, setMimeType() { return this; } }), MimeType: { JSON: 'json' } }
};
vm.createContext(ctx);
const code = fs.readFileSync(path.join(ROOT, 'Code.gs'), 'utf8');
vm.runInContext(code + '\n' + fs.readFileSync(path.join(ROOT, 'Assembly.gs'), 'utf8'), ctx);
const hooked = /ASM_handle\(/.test(code);
function post(action, payload) {
  if (String(action).indexOf('asm.') === 0 && !hooked) return JSON.parse(JSON.stringify(ctx.ASM_handle(action, payload || {})));
  const r = ctx.doPost({ postData: { contents: JSON.stringify({ action, payload }) } }); return JSON.parse(r.t);
}
let fails = 0;
function check(label, cond, extra) { console.log((cond ? '  ok   ' : '  FAIL ') + label + (cond ? '' : ' ' + JSON.stringify(extra))); if (!cond) fails++; }
console.log('Code.gs ' + (hooked ? 'has' : 'does not have yet') + ' the ASM-HOOK; asm.* actions go to ASM_handle');

/* students and a teacher */
const proud = post('register', { id: 'm41-proud', pw: 'pw1234', name: 'Proud' }); check('register Proud', proud.ok && proud.token, proud);
const mint = post('register', { id: 'm41-mint', pw: 'pw1234', name: 'Mint' });
post('register', { id: 'm41-sun', pw: 'pw1234', name: 'Sun' });
/* give them houses and a cohort, the way the student app saves progress */
const sheet = book.sheets.Students, H = sheet.rows[0];
function setProg(id, cohort, house) { const row = sheet.rows.find((r) => r[H.indexOf('id')] === id); row[H.indexOf('progress')] = JSON.stringify({ studentId: id, cohort: cohort, story: { house: house, hp: 10 }, xp: 0, rev: 1 }); }
setProg('m41-proud', 'M4.1', 'compass'); setProg('m41-mint', 'M4.1', 'loom'); setProg('m41-sun', 'M4.1', 'loom');
const tt = post('teacherLogin', { pin: '4821' }).tt; check('teacher login', !!tt);

check('asm.ping', post('asm.ping', {}).ok);
const rows = [
  { ts: '2026-10-30T03:10:00Z', round: 'LAB12', game: 'mode-sort', lesson: 'L1', team: 'Team 1', studentId: 'm41-sun', points: 7 },
  { ts: '2026-10-30T03:10:00Z', round: 'LAB12', game: 'mode-sort', lesson: 'L1', team: 'Team 1', studentId: 'm41-mint', points: 7 },
  { ts: '2026-10-30T03:10:00Z', round: 'LAB12', game: 'mode-sort', lesson: 'L1', team: 'Team 2', studentId: 'm41-proud', points: 4 },
  { ts: '2026-10-30T03:10:00Z', round: 'LAB12', game: 'mode-sort', lesson: 'L1', team: 'Team 2', studentId: 'm41-airin', points: 4 }
];
check('asm.points refused without the teacher token', post('asm.points', { rows }).ok === false);
check('asm.points refused with a student token', post('asm.points', { rows, token: proud.token }).ok === false);
const pt = post('asm.points', { rows, tt });
check('asm.points writes 4 rows', pt.ok && pt.n === 4, pt);
check('Teams sheet created with the header', book.sheets.Teams && book.sheets.Teams.rows[0][0] === 'ts' && book.sheets.Teams.rows.length === 5);
const again = post('asm.points', { rows, tt });
check('posting the same round again adds nothing', again.ok && again.n === 0 && again.skipped === 4, again);
const r2 = post('asm.points', { rows: [{ ts: 'x', round: 'LAB12', game: 'group-them', lesson: 'L3', team: 'Team 1', studentId: 'm41-sun', points: 2 }, { round: 'LAB12', game: 'group-them', studentId: 'm41-mint', team: 'Team 1', points: 999 }], tt });
check('a second game in the same round code is new; points clamped to ±50', r2.ok && r2.n === 2 && book.sheets.Teams.rows[6][6] === 50, r2);

const tal = post('asm.tally', { tt });
check('teacher tally: by student, team, game', tal.ok && tal.byStudent['m41-sun'] === 9 && tal.byTeam['Team 2'] === 8 && tal.byGame['mode-sort'] === 22 && tal.total === 74, tal);
const mine = post('asm.tally', { studentId: 'm41-sun', token: post('login', { id: 'm41-sun', pw: 'pw1234' }).token });
check('student tally: own rows and total only', mine.ok && mine.mine === 9 && mine.rows.length === 2 && mine.byStudent == null, mine);
check('student tally refused with a wrong token', post('asm.tally', { studentId: 'm41-sun', token: 'nope' }).ok === false);
const hs = post('asm.houses', { cohort: 'M4.1' });
check('house totals: Loom = Sun 9 + Mint 57, Compass = Proud 4, unknown students ignored', hs.ok && hs.totals.loom === 66 && hs.totals.compass === 4 && hs.totals.bridge === 0, hs);
check('house totals for another cohort are zero', post('asm.houses', { cohort: 'Tutoring' }).totals.loom === 0);
check('unknown asm action', post('asm.nothing', {}).ok === false);
check('ASM_houseTotals is available to Code.gs houses()', typeof ctx.ASM_houseTotals === 'function');

console.log(fails ? 'assembly-gs-test: ' + fails + ' FAILED' : 'assembly-gs-test: all green');
process.exit(fails ? 1 : 0);
