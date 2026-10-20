/* P1 (20 Oct 2026): a passed lesson vanished from p.subs (B2 bot: m08s1, m08s2, m08s3 passed;
   later p.subs had m08s1 and m08s3 only). Saves reached Code.gs out of order; an older one got a
   'stale' reply whose stored copy was from just before m08s2, and authCheck swapped it in for S.p.
   This test runs the real api.js, the real authCheck (cut out of student.js) and the real Code.gs
   in Node, with a network that delivers requests in the order the test chooses.
   node tools/save-order-test.js            (ROOT=<checkout> to test another copy)              */
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm'), crypto = require('crypto');
const ROOT = process.env.ROOT || path.join(__dirname, '..');

/* ------------------------------------------------------------ Code.gs */
function Sheet(name) { this.name = name; this.rows = []; }
Sheet.prototype.appendRow = function (r) { this.rows.push(r.slice()); };
Sheet.prototype.setFrozenRows = function () {};
Sheet.prototype.getLastRow = function () { return this.rows.length; };
Sheet.prototype.getName = function () { return this.name; };
Sheet.prototype.getRange = function (r, c, nr, nc) {
  const sh = this; nr = nr || 1; nc = nc || 1;
  return {
    getValues() { const out = []; for (let i = 0; i < nr; i++) { const row = sh.rows[r - 1 + i] || []; const o = []; for (let j = 0; j < nc; j++) o.push(row[c - 1 + j] == null ? '' : row[c - 1 + j]); out.push(o); } return out; },
    setValues(v) { for (let i = 0; i < v.length; i++) { const row = sh.rows[r - 1 + i] || (sh.rows[r - 1 + i] = []); for (let j = 0; j < v[i].length; j++) row[c - 1 + j] = v[i][j]; } }
  };
};
function server() {
  const book = { sheets: {}, getSheetByName(n) { return this.sheets[n] || null; }, insertSheet(n) { return (this.sheets[n] = new Sheet(n)); }, getName() { return 'Test sheet'; } };
  const cacheStore = {}, props = { TEACHER_PIN: '4821' };
  const ctx = {
    console,
    SpreadsheetApp: { getActive: () => book },
    LockService: { getScriptLock: () => ({ waitLock() {}, releaseLock() {} }) },
    PropertiesService: { getScriptProperties: () => ({ getProperty: (k) => props[k] || null, setProperty: (k, v) => { props[k] = v; } }) },
    CacheService: { getScriptCache: () => ({ get: (k) => cacheStore[k] || null, put: (k, v) => { cacheStore[k] = v; }, remove: (k) => { delete cacheStore[k]; } }) },
    UrlFetchApp: { fetch() { throw new Error('no AI in this test'); } },
    Utilities: { computeDigest: (alg, s) => Array.from(crypto.createHash('sha256').update(s).digest()).map((b) => (b > 127 ? b - 256 : b)), DigestAlgorithm: { SHA_256: 'sha256' }, getUuid: () => crypto.randomUUID(), sleep() {}, formatDate: () => '20261020' },
    ContentService: { createTextOutput: (t) => ({ t, setMimeType() { return this; } }), MimeType: { JSON: 'json' } }
  };
  vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(path.join(ROOT, 'Code.gs'), 'utf8') + '\n' + fs.readFileSync(path.join(ROOT, 'Lab.gs'), 'utf8'), ctx);
  const handle = (text) => ctx.doPost({ postData: { contents: text } }).t;
  const stored = (id) => JSON.parse(book.sheets.Students.rows.find((r) => r[0] === id)[6]);
  return { handle, stored, post: (action, payload) => JSON.parse(handle(JSON.stringify({ action, payload }))) };
}

/* ------------------------------------------- api.js + authCheck, on a held network */
function client(srv, token) {
  const net = [];        // requests the page has sent: { body, processed, text, resolve }
  const ls = { 'cc.token': token };
  const win = {
    CC_API_URL: 'https://example.invalid/exec',
    localStorage: { getItem: (k) => (k in ls ? ls[k] : null), setItem: (k, v) => { ls[k] = String(v); }, removeItem: (k) => { delete ls[k]; } },
    navigator: {}, setTimeout, clearTimeout, Promise, JSON, Math, Date, String, Number, Object, Array, Error, console
  };
  win.window = win;
  win.fetch = function (url, opts) {
    return new Promise((resolve) => { net.push({ body: opts.body, processed: false, text: null, resolve }); });
  };
  vm.createContext(win);
  vm.runInContext(fs.readFileSync(path.join(ROOT, 'api.js'), 'utf8'), win);
  const src = fs.readFileSync(path.join(ROOT, 'student.js'), 'utf8');
  const at = src.indexOf('function authCheck(r) {');
  let i = src.indexOf('{', at), depth = 0;
  for (; i < src.length; i++) { if (src[i] === '{') depth++; else if (src[i] === '}' && --depth === 0) break; }
  const page = { S: { p: null, run: null, write: null }, api: win.API, ST: null, toasts: [], shown: [], syncs: 0 };
  page.fn = new Function('S', 'api', 'ST', 'toast', 'paintHeader', 'show', 'location', 'syncSoon', 'modal', '$', 'reauthOpen',
    src.slice(at, i + 1) + '\nreturn authCheck;')(page.S, win.API, null, (m) => page.toasts.push(m), () => {}, (v) => page.shown.push(v), { hash: '#plan' }, () => { page.syncs++; }, () => {}, () => null, false);
  page.sync = () => win.API.save(page.S.p).then((r) => { page.fn(r); return r; });
  page.process = (k) => { const q = net[k]; q.text = srv.handle(q.body); q.processed = true; return JSON.parse(q.text); };
  page.respond = (k) => { const q = net[k]; q.resolve({ ok: true, json: () => Promise.resolve(JSON.parse(q.text)) }); };
  page.net = net;
  return page;
}
const tick = () => new Promise((r) => setImmediate(r));
async function settle(page) { for (let n = 0; n < 50; n++) { await tick(); const q = page.net.find((x) => !x.processed); if (!q) continue; page.process(page.net.indexOf(q)); page.respond(page.net.indexOf(q)); } }
function pass(p, sub, best, xp) { const r = p.subs[sub] || (p.subs[sub] = { best: 0, attempts: 0 }); r.attempts++; if (best > r.best) r.best = best; r.last = best; p.xp += xp; }

let fails = 0;
function check(label, cond, extra) { console.log((cond ? '  ok   ' : '  FAIL ') + label + (cond ? '' : ' ' + JSON.stringify(extra))); if (!cond) fails++; }

(async () => {
  /* 1. The live run, replayed on the real code paths */
  {
    const srv = server();
    const reg = srv.post('register', { id: 'b2-student', pw: 'pw1234', name: 'B2' });
    const page = client(srv, reg.token);
    page.S.p = reg.progress; page.S.p.xp = 2000; page.S.p.subs = { m07s3: { best: 1, attempts: 1 } };
    const s0 = page.sync(); await settle(page); await s0;                         // in step with the server
    pass(page.S.p, 'm08s1', 0.86, 110);
    const a = page.sync();                                                        // A: sent after m08s1 (09:40)
    await tick();
    page.S.p.xp += 250;                                                           // a gate, speed bonuses, a keepsake …
    const b = page.sync();                                                        // B: before m08s2 is finished
    await tick();
    const sent = page.net.filter((q) => !q.processed).length;
    /* Apps Script runs the newer request first; the older one reaches save() afterwards */
    const order = page.net.map((q, k) => k).filter((k) => !page.net[k].processed).reverse();
    order.forEach((k) => page.process(k));
    pass(page.S.p, 'm08s2', 5 / 7, 110);                                          // m08s2 passed (09:49) …
    check('the bot reads p.subs.m08s2.best right after finishRun', Math.abs(page.S.p.subs.m08s2.best - 0.714) < 0.01);
    order.slice().reverse().forEach((k) => page.respond(k));                     // … then the replies arrive
    await settle(page);
    pass(page.S.p, 'm08s3', 1, 110);                                              // m08s3 (10:01)
    const s3 = page.sync(); await settle(page); await s3; await a; await b;
    const kept = Object.keys(page.S.p.subs).sort().join(',');
    check('one save in flight at a time (requests in flight together: ' + sent + ')', sent === 1);
    check('m08s1, m08s2 and m08s3 all stay in p.subs on the device', kept === 'm07s3,m08s1,m08s2,m08s3', kept);
    const sv = Object.keys(srv.stored('b2-student').subs).sort().join(',');
    check('… and on the server', sv === 'm07s3,m08s1,m08s2,m08s3', sv);
  }

  /* 2. A request that timed out in the browser still runs at Apps Script after a newer one */
  {
    const srv = server();
    const reg = srv.post('register', { id: 'late', pw: 'pw1234', name: 'Late' });
    const p = reg.progress; p.subs = { m01s1: { best: 1, attempts: 1 } }; p.xp = 300; p.rev = 6;
    const older = JSON.parse(JSON.stringify(p));
    p.subs.m01s2 = { best: 0.8, attempts: 1 }; p.xp = 410; p.rev = 7;
    check('newer save (rev 7) accepted', srv.post('save', { token: reg.token, progress: p, attempts: [] }).ok === true);
    const r = srv.post('save', { token: reg.token, progress: older, attempts: [] });
    check('older save (rev 6, only 110 XP behind) is refused', r.ok === false && r.stale === true, r);
    check('the stored copy keeps m01s2', !!srv.stored('late').subs.m01s2);
    const again = srv.post('login', { id: 'late', pw: 'pw1234' });
    check('signing in again loads m01s2', !!(again.progress.subs || {}).m01s2);
  }

  /* 3. A stale reply that is OLDER than the device (the server copy lacks this device's newest lesson) */
  {
    const srv = server();
    const reg = srv.post('register', { id: 'merge', pw: 'pw1234', name: 'M' });
    const page = client(srv, reg.token);
    page.S.p = reg.progress; page.S.p.rev = 9; page.S.p.xp = 900;
    page.S.p.subs = { m02s1: { best: 1, attempts: 1 }, m02s2: { best: 0.71, attempts: 1 } };
    const theirs = { studentId: 'merge', xp: 1200, rev: 8, subs: { m02s1: { best: 1, attempts: 2 }, m09s1: { best: 0.9, attempts: 1 } }, badges: ['poweron'], story: { chapter: 9 } };
    const pp = page.S.p;
    page.fn({ ok: false, stale: true, progress: theirs });
    check('S.p stays the same object', page.S.p === pp);
    check('this device\'s newest lesson survives a stale reply', !!page.S.p.subs.m02s2, page.S.p.subs);
    check('the other copy\'s lesson is added', !!page.S.p.subs.m09s1);
    check('merits never go down', page.S.p.xp === 1200, page.S.p.xp);
    check('a merge is saved again', page.syncs === 1);
    check('no jump to the map in the middle of a lesson', (page.S.run = {}, page.fn({ ok: false, stale: true, progress: { studentId: 'merge', rev: 3, subs: { m10s1: { best: 1, attempts: 1 } } } }), page.shown.length === 1));
  }

  /* 4. Old browsers (no rev) and the existing guard */
  {
    const srv = server();
    const reg = srv.post('register', { id: 'old', pw: 'pw1234', name: 'O' });
    const p = { studentId: 'old', displayName: 'O', xp: 500, subs: { m03s1: { best: 1, attempts: 1 }, m03s2: { best: 1, attempts: 1 } } };
    srv.post('save', { token: reg.token, progress: p, attempts: [] });
    const older = { studentId: 'old', displayName: 'O', xp: 420, subs: { m03s1: { best: 1, attempts: 1 } } };
    check('an old browser\'s save within 200 XP is still taken', srv.post('save', { token: reg.token, progress: older, attempts: [] }).ok === true);
    check('… but it cannot drop a passed lesson', !!srv.stored('old').subs.m03s2 && srv.stored('old').xp === 500, srv.stored('old'));
    check('a blank copy is still refused', srv.post('save', { token: reg.token, progress: { studentId: 'old', xp: 0 }, attempts: [] }).stale === true);
  }

  console.log(fails ? fails + ' failure(s)' : 'all save-order checks passed');
  process.exit(fails ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
