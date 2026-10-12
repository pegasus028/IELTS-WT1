/* Runs Lab.gs (the Spellbook Workshop back end) in Node against an in-memory
   Google Sheet and a fake Claude API, with this repo's Code.gs as the source of
   the helpers Lab.gs relies on (findStudent, log, register, login). The LAB-HOOK
   in doPost is emulated: every "lab." action goes straight to LAB_handle, as
   the one-line hook does.        node tools/lab-gs-test.js                  */
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.join(__dirname, '..');

/* ---------------------------------------------------- in-memory sheets */
function Sheet(name) { this.name = name; this.rows = []; }
Sheet.prototype.appendRow = function (r) { this.rows.push(r.slice()); };
Sheet.prototype.setFrozenRows = function () {};
Sheet.prototype.getLastRow = function () { return this.rows.length; };
Sheet.prototype.getName = function () { return this.name; };
Sheet.prototype.deleteRow = function (r) { this.rows.splice(r - 1, 1); };
Sheet.prototype.deleteRows = function (r, n) { this.rows.splice(r - 1, n); };
Sheet.prototype.getRange = function (r, c, nr, nc) {
  const sh = this; nr = nr || 1; nc = nc || 1;
  if (typeof r === 'string') { r = 1; c = 1; nr = sh.rows.length; nc = 1; }
  return {
    getValues() { const out = []; for (let i = 0; i < nr; i++) { const row = sh.rows[r - 1 + i] || []; const o = []; for (let j = 0; j < nc; j++) o.push(row[c - 1 + j] == null ? '' : row[c - 1 + j]); out.push(o); } return out; },
    getValue() { const row = sh.rows[r - 1] || []; return row[c - 1] == null ? '' : row[c - 1]; },
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
  const name = body.tool_choice.name;
  let input;
  if (name === 'coach_line') input = { errors: [{ original: 'recieve', correction: 'receive', type: 'spelling', explain: 'i before e.' }, { original: 'same', correction: 'same', type: 'grammar', explain: 'bogus' }],
    fn: { verdict: 'meets', comment: 'Does the job.' }, generic: { ok: false, note: 'rose is a direction' }, slotForm: 'noun phrase', cefr: 'C1', band: 7.74, praise: 'x', tip: 'y' };
  if (name === 'coach_variable') input = { errors: [], fn: { verdict: 'partly', comment: 'Too general.' }, accuracy: { ok: false, note: 'It was 420 thousand.' }, fit: { ok: false, note: 'agreement' }, cefr: 'B2', band: 6.5, praise: 'p', tip: 't' };
  if (name === 'rate_report') input = { ta: 7.2, cc: 7, lr: 6.4, gra: 6, ceilings: [], cefr: 'B2', summary: 's', strengths: ['a', 'b', 'c', 'd'], priorities: [{ crit: 'LR', text: 'x' }], frameNote: 'f' };
  return { getResponseCode: () => 200, getContentText: () => JSON.stringify({ content: [{ type: 'tool_use', name, input }] }) };
}

/* ------------------------------------------------------- Apps Script API */
const props = { TEACHER_PIN: '4821', ANTHROPIC_API_KEY: 'sk-test', LAB_STUDENT_DAILY: '5' };
const cacheStore = {};
const ctx = {
  console,
  SpreadsheetApp: { getActive: () => book },
  LockService: { getScriptLock: () => ({ waitLock() {}, releaseLock() {} }) },
  PropertiesService: { getScriptProperties: () => ({ getProperty: (k) => props[k] || null }) },
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
let code = fs.readFileSync(path.join(ROOT, 'Code.gs'), 'utf8');
if (!/function findStudent\(/.test(code)) code = fs.readFileSync(path.join(ROOT, '..', 'IELTS-WT2', 'Code.gs'), 'utf8');
vm.runInContext(code + '\n' + fs.readFileSync(path.join(ROOT, 'Lab.gs'), 'utf8'), ctx);
const hooked = /LAB_handle\(/.test(code);
function post(action, payload) {
  if (String(action).indexOf('lab.') === 0 && !hooked) return JSON.parse(JSON.stringify(ctx.LAB_handle(action, payload || {})));
  const r = ctx.doPost({ postData: { contents: JSON.stringify({ action, payload }) } }); return JSON.parse(r.t);
}

let fails = 0;
function check(label, cond, extra) { console.log((cond ? '  ok   ' : '  FAIL ') + label + (cond ? '' : ' ' + JSON.stringify(extra))); if (!cond) fails++; }
console.log('Code.gs ' + (hooked ? 'has' : 'does not have yet') + ' the LAB-HOOK; lab.* actions go to LAB_handle');

const reg = post('register', { id: 'ploy', pw: 'pw1234', name: 'Ploy' });
check('register', reg.ok && reg.token, reg);
const tok = reg.token;
post('register', { id: 'mint', pw: 'pw9999', name: 'Mint' });

const stt = post('lab.status', {});
check('lab.status reports AI and task 1', stt.ai === true && stt.task === 1, stt);
check('lab.list refuses a wrong token', post('lab.list', { studentId: 'ploy', token: 'nope' }).ok === false);
check('lab.list refuses an unknown student', post('lab.list', { studentId: 'ghost', token: tok }).ok === false);

const tpl = { id: 'T1', mode: 'TREND', name: 'TREND · 40% · B2', version: 1, pct: 40, level: 'B2', status: 'draft', lines: { 't-what': { text: 'This {visual} sets out {what}.', last: { points: 30, errors: 0, errorList: [], rows: [] } } }, updatedAt: '2026-10-12T01:00:00Z' };
check('saveTemplate (new row)', post('lab.saveTemplate', { studentId: 'ploy', token: tok, template: tpl }).ok);
tpl.status = 'complete'; tpl.score = 300; tpl.updatedAt = '2026-10-12T02:00:00Z';
check('saveTemplate (update same row)', post('lab.saveTemplate', { studentId: 'ploy', token: tok, template: tpl }).ok);
const TH = book.sheets.LabTemplates.rows[0];
check('one row, updated in place, mode column filled', book.sheets.LabTemplates.rows.length === 2 && book.sheets.LabTemplates.rows[1][TH.indexOf('status')] === 'complete' && book.sheets.LabTemplates.rows[1][TH.indexOf('mode')] === 'TREND', book.sheets.LabTemplates.rows);
const mintTok = post('login', { id: 'mint', pw: 'pw9999' }).token;
check('another student cannot overwrite it', post('lab.saveTemplate', { studentId: 'mint', token: mintTok, template: tpl }).ok === false);
check('another student cannot delete it', post('lab.deleteTemplate', { studentId: 'mint', token: mintTok, id: 'T1' }).ok === false);

const big = { id: 'A1', mode: 'TREND', templateId: 'T1', pct: 40, level: 'B2', promptId: 'p-line-museums', timing: 'none', version: 1, status: 'complete', words: 172, share: 0.3214,
  accuracy: { ok: 12, near: 1, bad: 0, n: 13, rows: new Array(13).fill({ key: 'figA1', status: 'ok', note: 'n'.repeat(200) }) }, wards: { bad: 0, warn: 1, rows: [] },
  rating: { overall: 7 }, points: { total: 500 }, seconds: 900, vars: {}, report: 'r'.repeat(1000), parasHtml: ['x'.repeat(20000), 'y'.repeat(20000)] };
for (let i = 0; i < 13; i++) big.vars['v' + i] = { text: 'z'.repeat(300), last: { points: 30, data: { status: 'ok', note: 'd'.repeat(200) }, errorList: new Array(8).fill({ original: 'a'.repeat(80), correction: 'b'.repeat(80), type: 'grammar', explain: 'c'.repeat(160) }), rows: new Array(8).fill(['row', 5]), issues: new Array(8).fill({ kind: 'warn', msg: 'm'.repeat(240) }) } };
check('saveAttempt with oversized JSON', post('lab.saveAttempt', { studentId: 'ploy', token: tok, attempt: big }).ok);
const AH = book.sheets.LabAttempts.rows[0], arow = book.sheets.LabAttempts.rows[1], cell = arow[AH.indexOf('json')];
check('JSON cell kept under 50,000 characters and still parses', cell.length < 50000 && JSON.parse(cell).id === 'A1', cell.length);
check('mode and data accuracy columns', arow[AH.indexOf('mode')] === 'TREND' && Math.abs(arow[AH.indexOf('accuracy')] - 0.923) < 0.001, arow);
const list = post('lab.list', { studentId: 'ploy', token: tok });
check('lab.list returns own items only', list.ok && list.templates.length === 1 && list.attempts.length === 1 && post('lab.list', { studentId: 'mint', token: mintTok }).templates.length === 0);

const fr = post('lab.coach', { studentId: 'ploy', token: tok, kind: 'frame', task: 1, mode: 'TREND', level: 'B2', band: '6.5–7', pct: 40, component: { name: 'Group A: the change', fn: 'f', why: 'w', slots: ['Trend A (what group A did)'], paragraph: 'P3' }, line: 'It then rose to [End Figure A].', words: 4, budget: { lo: 3, hi: 8 } });
check('coach frame ok', fr.ok && fr.coach.fn.verdict === 'meets' && fr.coach.generic.ok === false, fr);
check('band rounded to a half band', fr.coach.band === 7.5, fr.coach.band);
check('no-op "errors" dropped', fr.coach.errors.length === 1, fr.coach.errors);
let lastCall = calls[calls.length - 1];
check('uses tool_choice + the coach model', lastCall.tool_choice.name === 'coach_line' && lastCall.model === 'claude-haiku-5-5', lastCall.model);
check('prompt is Task 1, names the mode and asks for reusability', /Task 1/.test(lastCall.messages[0].content) && /TREND/.test(lastCall.messages[0].content) && /direction or size claim/.test(lastCall.messages[0].content));
check('system prompt is Task 1', /Task 1/.test(lastCall.system) && !/Task 2/.test(lastCall.system));

const va = post('lab.coach', { studentId: 'ploy', token: tok, kind: 'variable', task: 1, mode: 'TREND', level: 'B2', band: '6.5–7', pct: 40,
  prompt: { id: 'p-line-museums', rubric: 'The line graph shows…', type: 'line', mode: 'TREND', data: 'Science Museum: 2010=420, 2012=470' },
  variable: { key: 'figA1', label: 'Start Figure A', does: 'd', form: 'f' }, value: '470 thousand', value2: null, words: 2, budget: { lo: 2, hi: 6 },
  dataCheck: { status: 'near', note: 'not the figure for 2010' }, inContext: ['p'], filled: [] });
check('coach variable ok, accuracy note kept', va.ok && va.coach.accuracy.ok === false && /420/.test(va.coach.accuracy.note) && va.coach.fit.ok === false, va);
lastCall = calls[calls.length - 1];
check('variable prompt carries the chart data and the app data check', /2010=420/.test(lastCall.messages[0].content) && /not the figure for 2010/.test(lastCall.messages[0].content));

failModel = 'claude-sonnet-5-5';
const rt = post('lab.rate', { studentId: 'ploy', token: tok, task: 1, mode: 'TREND', level: 'B2', band: '6.5–7', pct: 40, prompt: { rubric: 'x', type: 'line', mode: 'TREND', data: 'd', keyFeatures: ['k'] }, report: 'e'.repeat(900), words: 172, share: 0.3, wards: [], dataChecks: [], frame: ['a', 'b', 'c', 'd'] });
check('rate falls back to the next model when one is unavailable', rt.ok && calls[calls.length - 1].model === 'claude-sonnet-4-6', calls.slice(-2).map((c) => c.model));
check('bands rounded, overall = mean to the nearest half, strengths capped at 3', rt.rating.ta === 7 && rt.rating.lr === 6 && rt.rating.overall === 6.5 && rt.rating.strengths.length === 3, rt.rating);
check('CEFR from the official map (6.5 → B2), not the model', rt.rating.cefr === 'B2', rt.rating.cefr);
check('rating prompt has the ladder and the ceilings', /CEILINGS/.test(calls[calls.length - 1].messages[0].content) && /no overview -> TA max 5/.test(calls[calls.length - 1].messages[0].content));
failModel = null;

let blocked = null;
for (let i = 0; i < 6; i++) { const r = post('lab.coach', { studentId: 'ploy', token: tok, kind: 'frame', component: {}, line: 'x', budget: {} }); if (!r.ok) { blocked = r; break; } }
check('daily quota per student enforced', blocked && /today/.test(blocked.error), blocked);
props.ANTHROPIC_API_KEY = '';
const nk = post('lab.saveAttempt', { studentId: 'ploy', token: tok, attempt: { id: 'A2', status: 'draft', vars: {} } });
check('saving still works without an AI key', nk.ok);
check('coaching without a key says so', /No AI key/.test(post('lab.coach', { studentId: 'mint', token: mintTok, kind: 'frame', component: {}, line: 'x', budget: {} }).error || ''));
check('lab.status without a key: ai false', post('lab.status', {}).ai === false);

console.log(fails ? fails + ' check(s) FAILED' : 'All Lab.gs checks passed');
process.exit(fails ? 1 : 0);
