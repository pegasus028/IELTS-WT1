/* Mock backend + static server for dry runs of the student bot on IELTS-WT1.
   Serves a scratch copy of the app (env APPDIR) with CC_API_URL rewritten to
   this server's /api, and runs the real Code.gs + Lab.gs in a Node vm against
   an in-memory Sheet (persisted to env STATEFILE) with a fake Claude.
   node mock-server.js   (env APPDIR, STATEFILE, PORT=8790)                      */
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm'), http = require('http'), crypto = require('crypto');
const APPDIR = process.env.APPDIR, STATEFILE = process.env.STATEFILE || '/tmp/wt1-mock-state.json', PORT = +(process.env.PORT || 8790);
if (!APPDIR) throw new Error('APPDIR required');
const API = 'http://127.0.0.1:' + PORT + '/api';
for (const f of ['index.html', 'teacher.html']) {
  const p = path.join(APPDIR, f); let s = fs.readFileSync(p, 'utf8');
  s = s.replace(/window\.CC_API_URL = '[^']*'/, "window.CC_API_URL = '" + API + "'"); fs.writeFileSync(p, s);
}
if (fs.readFileSync(path.join(APPDIR, 'index.html'), 'utf8').indexOf('AKfycb') >= 0) throw new Error('live URL still present');

/* ---------------------------------------------------- in-memory sheets */
function Sheet(name, rows) { this.name = name; this.rows = rows || []; }
Sheet.prototype.appendRow = function (r) { this.rows.push(r.slice()); };
Sheet.prototype.setFrozenRows = function () {};
Sheet.prototype.getLastRow = function () { return this.rows.length; };
Sheet.prototype.getLastColumn = function () { return Math.max.apply(null, [1].concat(this.rows.map(r => r.length))); };
Sheet.prototype.getName = function () { return this.name; };
Sheet.prototype.deleteRow = function (r) { this.rows.splice(r - 1, 1); };
Sheet.prototype.deleteRows = function (r, n) { this.rows.splice(r - 1, n); };
Sheet.prototype.getDataRange = function () { return this.getRange(1, 1, this.rows.length || 1, this.getLastColumn()); };
Sheet.prototype.getRange = function (r, c, nr, nc) {
  const sh = this; nr = nr || 1; nc = nc || 1;
  if (typeof r === 'string') { r = 1; c = 1; nr = sh.rows.length; nc = 1; }
  return {
    getValues() { const out = []; for (let i = 0; i < nr; i++) { const row = sh.rows[r - 1 + i] || []; const o = []; for (let j = 0; j < nc; j++) o.push(row[c - 1 + j] == null ? '' : row[c - 1 + j]); out.push(o); } return out; },
    getValue() { const row = sh.rows[r - 1] || []; return row[c - 1] == null ? '' : row[c - 1]; },
    setValue(v) { const row = sh.rows[r - 1] || (sh.rows[r - 1] = []); row[c - 1] = v; },
    setValues(v) { for (let i = 0; i < v.length; i++) { const row = sh.rows[r - 1 + i] || (sh.rows[r - 1 + i] = []); for (let j = 0; j < v[i].length; j++) row[c - 1 + j] = v[i][j]; } },
    createTextFinder(t) { return { matchEntireCell() { return this; }, findNext() {
      for (let i = 0; i < nr; i++) { const row = sh.rows[r - 1 + i] || []; for (let j = 0; j < nc; j++) if (String(row[c - 1 + j]) === String(t)) return { getRow: () => r + i }; }
      return null; } }; }
  };
};
const book = { sheets: {}, getSheetByName(n) { return this.sheets[n] || null; }, insertSheet(n) { return (this.sheets[n] = new Sheet(n)); }, getName() { return 'Mock sheet'; }, getSheets() { return Object.values(this.sheets); } };
try { const st = JSON.parse(fs.readFileSync(STATEFILE, 'utf8')); for (const k in st) book.sheets[k] = new Sheet(k, st[k]); console.log('state loaded', Object.keys(st)); } catch (e) {}
function persist() { const o = {}; for (const k in book.sheets) o[k] = book.sheets[k].rows; fs.writeFileSync(STATEFILE, JSON.stringify(o)); }

/* ---------------------------------------------------------- fake Claude */
function fakeFetch(url, opts) {
  const body = JSON.parse(opts.payload);
  if (!body.tool_choice) {
    return { getResponseCode: () => 200, getContentText: () => JSON.stringify({ content: [{ type: 'text', text: '{"ta":6,"cc":6,"lr":6,"gra":6,"overall":6,"cefr":"B2","ceilings":[],"errors":[{"quote":"rise","tag":"gra-tense","fix":"rose"}],"nextGate":"Add two comparisons.","comment":"Mock estimate."}' }] }) };
  }
  const name = body.tool_choice.name; let input;
  if (name === 'coach_line') input = { errors: [], fn: { verdict: 'meets', comment: 'Does the job (mock).' }, generic: { ok: true, note: '' }, slotForm: 'noun phrase', cefr: 'B1', band: 6, praise: 'Clear.', tip: 'Add a figure slot.' };
  if (name === 'coach_variable') input = { errors: [], fn: { verdict: 'meets', comment: 'Fits (mock).' }, relevance: { ok: true, note: '' }, fit: { ok: true, note: '' }, reword: { ok: true, note: '' }, cefr: 'B1', band: 6, praise: 'p', tip: 't' };
  if (name === 'rate_essay' || name === 'rate_report') input = { ta: 6, tr: 6, cc: 6, lr: 6, gra: 6, cefr: 'B2', summary: 'mock', strengths: ['a', 'b'], priorities: [{ crit: 'LR', text: 'x' }], frameNote: 'f' };
  return { getResponseCode: () => 200, getContentText: () => JSON.stringify({ content: [{ type: 'tool_use', name, input }] }) };
}
const props = { TEACHER_PIN: '4821', ANTHROPIC_API_KEY: process.env.MOCK_AI === '0' ? '' : 'sk-test' };
const cacheStore = {};
const ctx = {
  console,
  SpreadsheetApp: { getActive: () => book },
  LockService: { getScriptLock: () => ({ waitLock() {}, releaseLock() {} }) },
  PropertiesService: { getScriptProperties: () => ({ getProperty: (k) => props[k] || null, setProperty: (k, v) => { props[k] = v; } }) },
  CacheService: { getScriptCache: () => ({ get: (k) => cacheStore[k] || null, put: (k, v) => { cacheStore[k] = v; }, remove: (k) => { delete cacheStore[k]; } }) },
  UrlFetchApp: { fetch: fakeFetch },
  Utilities: {
    computeDigest: (alg, s) => Array.from(crypto.createHash('sha256').update(s).digest()).map((b) => (b > 127 ? b - 256 : b)),
    DigestAlgorithm: { SHA_256: 'sha256' }, getUuid: () => crypto.randomUUID(), sleep() {}, formatDate: () => '20261020'
  },
  ContentService: { createTextOutput: (t) => ({ t, setMimeType() { return this; } }), MimeType: { JSON: 'json' } }
};
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(APPDIR, 'Code.gs'), 'utf8') + '\n' + fs.readFileSync(path.join(APPDIR, 'Lab.gs'), 'utf8'), ctx);
const calls = [];
function apiCall(bodyText) {
  let req; try { req = JSON.parse(bodyText); } catch (e) { return '{"ok":false,"error":"Bad JSON"}'; }
  calls.push({ t: Date.now(), action: req.action });
  const r = ctx.doPost({ postData: { contents: bodyText } });
  persist();
  return r.t;
}

const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.mp3': 'audio/mpeg', '.svg': 'image/svg+xml', '.woff2': 'font/woff2' };
http.createServer((req, res) => {
  const u = new URL(req.url, 'http://x');
  if (u.pathname === '/api') {
    let b = ''; req.on('data', d => b += d); req.on('end', () => { const t = apiCall(b); res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }); res.end(t); });
    return;
  }
  if (u.pathname === '/__state') { res.writeHead(200, { 'Content-Type': 'application/json' }); const o = {}; for (const k in book.sheets) o[k] = book.sheets[k].rows; res.end(JSON.stringify({ sheets: o, calls: calls.length })); return; }
  let p = path.join(APPDIR, decodeURIComponent(u.pathname === '/' ? '/index.html' : u.pathname));
  if (!p.startsWith(APPDIR)) { res.writeHead(403); res.end(); return; }
  fs.readFile(p, (e, d) => { if (e) { res.writeHead(404); res.end('nf'); return; } res.writeHead(200, { 'Content-Type': MIME[path.extname(p)] || 'application/octet-stream', 'Cache-Control': 'no-store' }); res.end(d); });
}).listen(PORT, '127.0.0.1', () => console.log('mock on http://127.0.0.1:' + PORT + '/  api=' + API));
