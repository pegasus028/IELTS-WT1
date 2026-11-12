/* ===========================================================================
   QUILLMOOR ACADEMY · THE OBSERVATORY (Chart Control, IELTS Writing Task 1) — Code.gs
   Google Apps Script Web App behind index.html and teacher.html (Staff Room).

   SET-UP (once)
   1. Create a Google Sheet. Extensions → Apps Script. Paste this file.
      Add a second script file named "Lab" and paste Lab.gs (the Spellbook Workshop).
   2. Project Settings → Script properties:
        TEACHER_PIN        e.g. 4821            (teacher console PIN; required —
                                                 the Staff Room refuses to open without it)
        ANTHROPIC_API_KEY  sk-ant-…             (optional — AI band estimates on reports
                                                 and AI coaching in the Spellbook Workshop)
        CC_MODEL           claude-sonnet-4-6,claude-haiku-4-5-20251001   (optional chain)
        CC_MARK_MODEL      optional: a model chain for the examiners' panel only (else CC_MODEL)
        DAILY_MODEL_BUDGET 200                  (optional, report-marking calls per day;
                                                 each report costs 2, or 3 with a third examiner)
        JOIN_CODE          optional: a class code new accounts must type
   3. Deploy → New deployment → Web app · Execute as: Me · Access: Anyone.
      Paste the /exec URL into window.CC_API_URL in index.html and teacher.html.
   4. AFTER EVERY EDIT: Deploy → Manage deployments → pencil → New version → Deploy.
      Saving alone does not update the live /exec endpoint.
   5. Optional: run installTick() once to create the CC_tick trigger that marks
      queued reports in the background every 10 minutes.

   ACCESS (Oct 2026, ported from Quillmoor Task 2). Teacher actions (roster,
   detail, all reports, marking, setting assignments, running the projector)
   need the short-lived teacher token that teacherLogin returns. Student actions
   need the student's own token, and touch only that student's rows. Five wrong
   PINs or passwords in a row lock that door for a while. Passwords are salted
   and hashed 200 times; accounts made before Oct 2026 are upgraded at their
   next login.

   HOUSE CUP. `houses` needs no sign-in: it returns only the four house totals
   and member counts for one cohort, never a name or an id. Chapter unlocks and
   re-sorts from the Staff Room travel as ordinary Assignments rows
   ({kind:'unlock'} / {kind:'resort'}); no new sheet column is needed.

   Requests are POST with Content-Type text/plain (a "simple request", so no
   CORS preflight), body {action, payload}. Every reply is JSON {ok, …}.
   =========================================================================== */

var SHEETS = {
  Students: ['id', 'name', 'pw', 'created', 'cohort', 'token', 'progress', 'archived'],
  Attempts: ['ts', 'studentId', 'itemId', 'topic', 'level', 'type', 'tag', 'cefr', 'correct', 'ms', 'hinted', 'fast', 'mode', 'given', 'expected'],
  Sessions: ['sessionId', 'studentId', 'loginTs', 'logoutTs', 'durationSec', 'items', 'correct'],
  Reports: ['id', 'ts', 'studentId', 'name', 'cohort', 'promptId', 'type', 'mode', 'kind', 'uiMode', 'words', 'seconds', 'bad', 'warn', 'status', 'released', 'aiVisible', 'overall', 'json'],
  Assignments: ['id', 'ts', 'json'],
  Projector: ['ts', 'round', 'kind', 'json'],
  Log: ['ts', 'what']
};

function doGet() { return out({ ok: true, app: 'Quillmoor Academy · The Observatory (Task 1)', sheet: SpreadsheetApp.getActive().getName() }); }

function doPost(e) {
  var req;
  try { req = JSON.parse(e.postData.contents || '{}'); } catch (err) { return out({ ok: false, error: 'Bad JSON' }); }
  /* LAB-HOOK — Spellbook Workshop (Lab.gs). Runs outside the lock below so AI coaching does not queue the class. */
  if (String(req.action || '').indexOf('lab.') === 0) return out(LAB_handle(req.action, req.payload || {}));
  /* TICKETS-HOOK — lesson tickets + Participation ledger (Tickets.gs). Reads run outside the lock. */
  if (String(req.action || '').indexOf('tickets.') === 0) return out(TICKETS_handle(req.action, req.payload || {}));
  /* ASM-HOOK — the Assembly's team points (Assembly.gs). Same pattern as the LAB-HOOK. */
  if (String(req.action || '').indexOf('asm.') === 0) return out(ASM_handle(req.action, req.payload || {}));
  /* LOGIN-FAST (30 Oct 2026): sign-in only reads the Students sheet, so it no longer queues behind
     every save for the script lock (a jam of saves on 30 Oct made sign-ins time out). login() takes
     the lock itself, briefly, only when it must write a new password hash or token. */
  if (req.action === 'login') {
    try { return out(login(req.payload || {}, true)); }
    catch (err) { log('ERR login ' + err); return out({ ok: false, error: String(err) }); }
  }
  /* NO-LOCK (12 Nov 2026): the Staff Room sign-in failed with "Lock timeout: another process was holding
     the lock for too long" because every action queued for the one script lock while AI marking held it
     for minutes (see aiTick). Actions that write nothing to the Sheet now run without the lock: the PIN
     check and the read-only lists. Reads see whole rows, so they need no lock (the LAB-HOOK does the same). */
  var p0 = req.payload || {};
  if (NO_LOCK[req.action] || (req.action === 'assignments' && p0.kind !== 'set' && p0.kind !== 'remove')) {
    try { return out(handle(req.action, p0)); }
    catch (err) { log('ERR ' + req.action + ' ' + err); return out({ ok: false, error: String(err) }); }
  }
  /* "AI estimate all": the model calls run outside the lock; each result is written under it (aiTick). */
  if (req.action === 'markReport' && p0.id === '*' && p0.mark && p0.mark.requestAi) {
    try {
      if (!isTeacher(p0)) return out(denied());
      return out({ ok: !!prop('ANTHROPIC_API_KEY'), marked: aiRun(12) });
    } catch (err) { log('ERR markReport * ' + err); return out({ ok: false, error: String(err) }); }
  }
  var lock = LockService.getScriptLock(), held = false;
  try {
    lock.waitLock(20000); held = true;
    return out(handle(req.action, p0));
  } catch (err) {
    log('ERR ' + req.action + ' ' + err);
    return out({ ok: false, busy: !held, error: held ? String(err) : 'The class server is busy. Wait a few seconds and try again.' });
  } finally { if (held) lock.releaseLock(); }
}
var NO_LOCK = { ping: 1, teacherLogin: 1, aiStatus: 1, roster: 1, detail: 1, reports: 1, houses: 1 };
function out(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }

/* ---------------------------------------------------------------- router */
function handle(action, p) {
  var T = isTeacher(p);
  switch (action) {
    case 'ping': return { ok: true, sheet: SpreadsheetApp.getActive().getName(), students: sheet('Students').getLastRow() - 1 };
    case 'register': return register(p);
    case 'login': return login(p);
    case 'save': return save(p);
    case 'session': return session(p);
    case 'teacherLogin': return teacherLogin(p);
    case 'logout': return logout(p);
    case 'unlock': return T ? unlock(p.id) : denied();
    case 'roster': return T ? roster() : denied();
    case 'detail': return T ? detail(p.id) : denied();
    case 'submitReport': return submitReport(p);
    case 'reports': return reports(p, T);
    case 'markReport': return T ? markReport(p.id, p.mark, T) : denied();
    case 'aiStatus': if (!T) return denied(); var aw = aiWaiting(); return { ok: true, enabled: !!prop('ANTHROPIC_API_KEY'), budgetLeft: budgetLeft(), waiting: aw.waiting, failed: aw.failed };
    case 'assignments': return assignments(p, T);
    case 'projector': return projector(p, T);
    case 'assign': return T ? { ok: true } : denied();
    case 'archiveStudent': return T ? archiveStudent(p) : denied();
    case 'resetPassword': return T ? resetPassword(p) : denied();
    case 'houses': return houses(p);
  }
  return { ok: false, error: 'Unknown action ' + action };
}

/* ---------------------------------------------------------------- sheets */
function sheet(name) {
  var ss = SpreadsheetApp.getActive(), sh = ss.getSheetByName(name);
  if (!sh) { sh = ss.insertSheet(name); sh.appendRow(SHEETS[name]); sh.setFrozenRows(1); }
  return sh;
}
function rows(name) {
  var sh = sheet(name), n = sh.getLastRow();
  if (n < 2) return [];
  var head = SHEETS[name], data = sh.getRange(2, 1, n - 1, head.length).getValues();
  return data.map(function (r, i) { var o = { _row: i + 2 }; head.forEach(function (h, j) { o[h] = r[j]; }); return o; });
}
function append(name, obj) { var head = SHEETS[name]; sheet(name).appendRow(head.map(function (h) { return obj[h] == null ? '' : obj[h]; })); }
function update(name, rowIdx, obj) {
  var head = SHEETS[name], sh = sheet(name);
  var cur = sh.getRange(rowIdx, 1, 1, head.length).getValues()[0];
  head.forEach(function (h, j) { if (obj[h] !== undefined) cur[j] = obj[h]; });
  sh.getRange(rowIdx, 1, 1, head.length).setValues([cur]);
}
/* Writes only the named cells of one row (update() rewrites the whole row from a fresh read). */
function updateCells(name, rowIdx, obj) {
  var head = SHEETS[name], sh = sheet(name);
  head.forEach(function (h, j) { if (obj[h] !== undefined) sh.getRange(rowIdx, j + 1, 1, 1).setValues([[obj[h]]]); });
}
function prop(k) { return PropertiesService.getScriptProperties().getProperty(k) || ''; }

/* ---------------------------------------------------------------- access */
var LOCK_AFTER = 5, LOCK_SECONDS = 300, PIN_LOCK_SECONDS = 60, TEACHER_SECONDS = 21600;
function cache() { return CacheService.getScriptCache(); }
function denied() { return { ok: false, auth: 'teacher', error: 'Teacher sign-in needed: reload the console and enter the PIN.' }; }
function locked(key) { return Number(cache().get(key) || 0) >= LOCK_AFTER; }
function failed(key, secs) { var c = cache(); c.put(key, String(Number(c.get(key) || 0) + 1), secs || LOCK_SECONDS); }
function teacherLogin(p) {
  var want = prop('TEACHER_PIN');
  if (!want) return { ok: false, error: 'No teacher PIN is set. In Apps Script: Project Settings → Script properties → add TEACHER_PIN.' };
  if (locked('lock:teacher')) return { ok: false, error: 'Too many wrong PINs. Wait a minute, then try again.' };
  if (String(p.pin || '') !== want) { failed('lock:teacher', PIN_LOCK_SECONDS); return { ok: false, error: 'Wrong teacher PIN.' }; }
  cache().remove('lock:teacher');
  var t = token();
  cache().put('tt:' + t, '1', TEACHER_SECONDS);
  return { ok: true, tt: t };
}
function isTeacher(p) {
  if (!p || !p.tt) return false;
  try { return cache().get('tt:' + String(p.tt)) === '1'; } catch (e) { return false; }
}
/* The signed-in student whose token this is — and, when an id is given, only if it is that student. */
function student(p, id) {
  if (!p || !p.token) return null;
  var tok = String(p.token), want = id == null ? null : String(id).toLowerCase(), all = rows('Students');
  for (var i = 0; i < all.length; i++) {
    if (all[i].token && String(all[i].token) === tok) return (want === null || String(all[i].id).toLowerCase() === want) ? all[i] : null;
  }
  return null;
}
function log(w) { try { append('Log', { ts: new Date().toISOString(), what: String(w).slice(0, 500) }); } catch (e) {} }
function hash(s) {
  var raw = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, String(s) + '|chart-control');
  return raw.map(function (b) { return ('0' + (b & 255).toString(16)).slice(-2); }).join('');
}
function token() { return Utilities.getUuid().replace(/-/g, ''); }
/* Passwords: a per-student salt and 200 rounds of SHA-256 ("v2$salt$hash").
   Accounts made before Oct 2026 hold the old single-round hash; they are
   upgraded the next time the student logs in. */
function hashPw(pw, salt) {
  salt = salt || token().slice(0, 16);
  var h = salt + '|' + String(pw);
  for (var i = 0; i < 200; i++) {
    h = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, h + '|' + salt)
      .map(function (b) { return ('0' + (b & 255).toString(16)).slice(-2); }).join('');
  }
  return 'v2$' + salt + '$' + h;
}
function checkPw(s, pw) {
  var st = String(s.pw || '');
  if (st.indexOf('v2$') === 0) return hashPw(pw, st.split('$')[1]) === st;
  return st === hash(pw);
}
function findStudent(id) {
  id = String(id || '').toLowerCase();
  var all = rows('Students');
  for (var i = 0; i < all.length; i++) if (String(all[i].id).toLowerCase() === id) return all[i];
  return null;
}
function parse(j, dflt) { try { return j ? JSON.parse(j) : dflt; } catch (e) { return dflt; } }

/* -------------------------------------------------------------- students */
function register(p) {
  var id = String(p.id || '').toLowerCase().trim();
  if (!/^[a-z0-9._-]{3,24}$/.test(id)) return { ok: false, error: 'Bad student ID.' };
  if (findStudent(id)) return { ok: false, error: 'That student ID is already taken. Try logging in instead.' };
  var t = token();
  var progress = { studentId: id, displayName: p.name || id, cohort: p.cohort || '', xp: 0, streak: 0, longestStreak: 0, lastActiveDate: null, sessions: 0, runBest: 0, run: 0, reclaimed: 0, speedBonuses: 0, subs: {}, checks: {}, mocks: {}, plans: {}, badges: [], review: {}, stats: { seen: 0, correct: 0, byTag: {} }, reports: [], modes: {}, tier: 'B2', assignment: null, created: new Date().toISOString() };
  if (prop('JOIN_CODE') && String(p.code || '').trim().toLowerCase() !== prop('JOIN_CODE').trim().toLowerCase()) return { ok: false, error: 'Ask T.Chris for the class code.' };
  if (String(p.pw || '').length < 4) return { ok: false, error: 'Choose a password of at least 4 characters.' };
  append('Students', { id: id, name: p.name || id, pw: hashPw(p.pw), created: new Date().toISOString(), cohort: p.cohort || '', token: t, progress: JSON.stringify(progress) });
  return { ok: true, token: t, progress: progress };
}
/* lockWrites: true when called outside doPost's lock (LOGIN-FAST); handle() calls it already locked. */
function login(p, lockWrites) {
  var lid = String(p.id || '').toLowerCase().trim();
  if (!/^[a-z0-9._-]{3,24}$/.test(lid)) return { ok: false, error: 'No account with that ID. Create one first.' };
  var s = findStudent(lid);
  if (!s) return { ok: false, error: 'No account with that ID. Create one first.' };
  var key = 'lock:pw:' + lid;
  if (locked(key)) return { ok: false, error: 'Too many wrong passwords. Wait 5 minutes, then try again, or ask T.Chris to unlock you.' };
  /* Oct 2026 (WS-G): after a teacher's resetPassword the row's pw is '' (reset state). The next sign-in
     takes whatever the student types (4+ characters, the register rule), stores its hash and continues,
     so she simply picks a new password. */
  var reset = String(s.pw || '') === '';
  if (reset) {
    if (String(p.pw || '').length < 4) return { ok: false, error: 'Your password was reset. Choose a new password of at least 4 characters.' };
  } else if (!checkPw(s, p.pw)) { failed(key); return { ok: false, error: 'Wrong password.' }; }
  cache().remove(key);
  /* One token per student, kept across logins, so an iPad and a phone can both stay signed in.
     30 Oct 2026: write only what changed (a first token, a new or upgraded password hash), and only
     those cells, so a sign-in never rewrites the progress cell a save may be writing. The usual
     sign-in writes nothing and so never waits for the lock. */
  var t = s.token || token(), upd = {};
  if (!s.token) upd.token = t;
  if (reset || String(s.pw || '').indexOf('v2$') !== 0) upd.pw = hashPw(p.pw);
  if (Object.keys(upd).length) {
    var write = function () { var now = findStudent(lid); if (now) { if (now.token && upd.token) { t = String(now.token); delete upd.token; } updateCells('Students', now._row, upd); } };
    if (lockWrites) { var lk = LockService.getScriptLock(); lk.waitLock(20000); try { write(); } finally { lk.releaseLock(); } }
    else write();
  }
  if (reset) log('password set after reset ' + lid);
  return { ok: true, token: t, progress: parse(s.progress, {}) };
}
function auth(p) { return student(p, p.progress && p.progress.studentId); }
/* Logging out retires the token, so a shared iPad keeps no working sign-in. */
function logout(p) {
  var s = student(p);
  if (s) update('Students', s._row, { token: token() });
  return { ok: true };
}
function unlock(id) { cache().remove('lock:pw:' + String(id || '').toLowerCase().trim()); return { ok: true }; }
function save(p) {
  var s = auth(p);
  if (!s) return { ok: false, error: 'Not signed in.' };
  var prog = p.progress;
  if (!prog || typeof prog !== 'object') return { ok: false, error: 'Bad progress.' };
  /* Oct 2026 (review): never let an older or blank copy overwrite newer progress. Merits only grow,
     so a save far below the stored merits comes from a stale device or a blank offline account. */
  var cur = parse(s.progress, null);
  /* Oct 2026 (P1, lost lesson): saves can reach this function out of order (a slow or timed-out request
     is still run after a newer one). Clients now stamp progress.rev, one higher on every save; an older
     rev is refused, and the reply carries the stored copy for the client to MERGE (never replace). */
  var hasRev = prog.rev != null && prog.rev !== '' && isFinite(Number(prog.rev));
  if (cur && hasRev && Number(cur.rev) > Number(prog.rev)) return { ok: false, stale: true, error: 'This device has an older copy of your progress.', progress: cur };
  if (cur && !hasRev && Number(cur.xp) > 0 && (Number(prog.xp) || 0) + 200 < Number(cur.xp)) return { ok: false, stale: true, error: 'This device has an older copy of your progress.', progress: cur };
  /* Passed lessons, gates, mocks and keepsakes only ever grow: whatever the stored copy has, the new one keeps. */
  if (cur) keepRecords(prog, cur);
  if (prog.cohort && !s.cohort) update('Students', s._row, { cohort: prog.cohort });
  update('Students', s._row, { progress: JSON.stringify(prog), name: prog.displayName || s.name });
  var added = saveAttempts(s.id, p.attempts || []);
  return { ok: true, added: added };
}

/* ---------------------------------------------------- attempt rows, written once
   Oct 2026 (handover items 1–2): the browser keeps answers in its outbox until a save is
   acknowledged, so the same rows can arrive twice (a beacon the server took after the page
   closed, then the next save; a save that ran here after the browser had timed out). A row
   whose ts + studentId + itemId + given is already on the sheet for this student is skipped.
   - The ts and given cells are written as plain text, so the sheet keeps exactly what the
     browser sent ("True" stays "True", "25%" stays "25%", the timestamp is not turned into a
     date in the spreadsheet's time zone) and a key rebuilt from the sheet equals the key of
     a resent row. attKey also normalises older rows (booleans, case, Date cells).
   - Recent keys are kept in CacheService as 12-character hashes (6 h). After a cache miss ONE
     scan of the last ATT_SCAN rows (four columns only) refills the cache for every student
     in it, so thirty cold sign-ins at the start of a lesson cost one read, not thirty. */
var ATT_SCAN = 3000, ATT_KEEP = 600, ATT_CACHE_SECONDS = 21600;
var ATT_COL = { ts: 1, studentId: 2, itemId: 3, given: 14 };
function attKey(a, sid) {
  var t = a.ts, d = t instanceof Date ? t : new Date(String(t == null ? '' : t));
  var ts = isNaN(d.getTime()) ? String(t == null ? '' : t) : String(Math.floor(d.getTime() / 1000));
  var g = a.given; g = g === true ? 'true' : g === false ? 'false' : String(g == null ? '' : g);
  var raw = [ts, String(sid || a.studentId || '').toLowerCase(), String(a.itemId == null ? '' : a.itemId), g.toLowerCase().replace(/\s+/g, ' ').trim().slice(0, 60)].join('|');
  return Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, raw).slice(0, 6)
    .map(function (b) { return ('0' + (b & 255).toString(16)).slice(-2); }).join('');
}
function attCacheKey(sid) { return 'att:' + String(sid).toLowerCase(); }
function putAttKeys(sid, keys) {
  var k = attCacheKey(sid);
  try { cache().put(k, keys.slice(-ATT_KEEP).join(','), ATT_CACHE_SECONDS); }
  catch (e) { try { cache().remove(k); } catch (e2) {} }   /* never leave an older list behind */
}
/* One read of the four key columns of the last ATT_SCAN rows; fills the cache for every student found. */
function scanAttKeys(sh) {
  var n = sh.getLastRow(), by = {};
  if (n < 2) return by;
  var from = Math.max(2, n - ATT_SCAN + 1), cnt = n - from + 1;
  var abc = sh.getRange(from, ATT_COL.ts, cnt, 3).getValues(), giv = sh.getRange(from, ATT_COL.given, cnt, 1).getValues();
  for (var i = 0; i < cnt; i++) {
    var sid = String(abc[i][1]).toLowerCase(); if (!sid) continue;
    (by[sid] || (by[sid] = [])).push(attKey({ ts: abc[i][0], itemId: abc[i][2], given: giv[i][0] }, sid));
  }
  var put = {};
  Object.keys(by).forEach(function (sid) { put[attCacheKey(sid)] = by[sid].slice(-ATT_KEEP).join(','); });
  try { if (cache().putAll) cache().putAll(put, ATT_CACHE_SECONDS); else Object.keys(put).forEach(function (k) { cache().put(k, put[k], ATT_CACHE_SECONDS); }); } catch (e) {}
  return by;
}
function recentAttKeys(sid, sh) {
  var hit = null;
  try { hit = cache().get(attCacheKey(sid)); } catch (e) {}
  if (hit != null) return hit ? String(hit).split(',') : [];
  return scanAttKeys(sh)[String(sid).toLowerCase()] || [];
}
function saveAttempts(sid, list) {
  var head = SHEETS.Attempts, sh = sheet('Attempts'), batch = [], seen = {}, keys;
  list = (list || []).filter(function (a) { return a && a.itemId; });
  if (!list.length) return 0;
  keys = recentAttKeys(sid, sh);
  keys.forEach(function (k) { seen[k] = 1; });
  list.forEach(function (a) {
    var k = attKey(a, sid);
    if (seen[k]) return;
    seen[k] = 1; keys.push(k);
    a.studentId = sid;
    batch.push(head.map(function (h) { return a[h] == null ? '' : a[h]; }));
  });
  if (batch.length) {
    var top = sh.getLastRow() + 1;
    try {
      sh.getRange(top, ATT_COL.ts, batch.length, 1).setNumberFormat('@');
      sh.getRange(top, ATT_COL.given, batch.length, 1).setNumberFormat('@');
    } catch (e) {}
    sh.getRange(top, 1, batch.length, head.length).setValues(batch);
  }
  putAttKeys(sid, keys);
  return batch.length;
}
/* One-off clean-up, run by hand from the Apps Script editor (select dedupeAttempts → Run): removes
   rows of Attempts that repeat an earlier row's ts + studentId + itemId + given (the duplicates left by
   overlapping saves before Oct 2026). It first copies the sheet to "Attempts backup <date>", keeps the
   first copy of each row in order, then clears only the rows left over at the bottom. Safe to run twice. */
function dedupeAttempts() {
  var lock = LockService.getScriptLock();
  lock.waitLock(30000);                       /* no student save can append while the sheet is rewritten */
  try { return dedupeAttemptsLocked(); } finally { lock.releaseLock(); }
}
function dedupeAttemptsLocked() {
  var head = SHEETS.Attempts, sh = sheet('Attempts'), n = sh.getLastRow();
  if (n < 3) return 'Nothing to check.';
  var data = sh.getRange(2, 1, n - 1, head.length).getValues(), seen = {}, keep = [];
  data.forEach(function (r) {
    var o = {}; head.forEach(function (h, j) { o[h] = r[j]; });
    var k = attKey(o, o.studentId);
    if (seen[k]) return;
    seen[k] = 1; keep.push(r);
  });
  var removed = data.length - keep.length, backup = '';
  if (removed) {
    if (typeof sh.copyTo === 'function') {
      backup = 'Attempts backup ' + new Date().toISOString().slice(0, 16).replace('T', ' ');
      sh.copyTo(SpreadsheetApp.getActive()).setName(backup);
    }
    sh.getRange(2, 1, keep.length, head.length).setValues(keep);
    sh.getRange(keep.length + 2, 1, removed, head.length).clearContent();
    if (typeof sh.deleteRows === 'function') sh.deleteRows(keep.length + 2, removed);
  }
  var msg = 'Attempts: ' + data.length + ' rows checked, ' + removed + ' duplicate' + (removed === 1 ? '' : 's') + ' removed' + (backup ? ' (copy kept as "' + backup + '")' : '') + '.';
  log(msg);
  return msg;
}
/* Union of the grow-only records of `from` into `into` (same rule as API.mergeRecords in api.js):
   per lesson/gate/mock the better record (higher best, then more attempts) with the larger attempt count;
   keepsakes and report summaries are unions; merits never go down; rev is the higher one. */
function betterRec(a, b) {
  if (!a) return b; if (!b) return a;
  var ab = Number(a.best) || 0, bb = Number(b.best) || 0;
  var w = bb > ab || (bb === ab && (Number(b.attempts) || 0) > (Number(a.attempts) || 0)) ? b : a;
  var o = {}, k;
  for (k in a) o[k] = a[k];
  for (k in b) if (o[k] === undefined) o[k] = b[k];
  for (k in w) o[k] = w[k];
  ['perfect', 'noHint', 'comeback', 'failedOnce'].forEach(function (f) { if (a[f] || b[f]) o[f] = true; });
  o.attempts = Math.max(Number(a.attempts) || 0, Number(b.attempts) || 0);
  return o;
}
function keepRecords(into, from) {
  if (!into || !from || typeof from !== 'object') return into;
  ['subs', 'checks', 'mocks'].forEach(function (m) {
    var src = from[m]; if (!src || typeof src !== 'object') return;
    var dst = into[m] && typeof into[m] === 'object' ? into[m] : (into[m] = {});
    Object.keys(src).forEach(function (id) { dst[id] = betterRec(dst[id], src[id]); });
  });
  if (from.badges && from.badges.length) {
    into.badges = into.badges && into.badges.length ? into.badges : [];
    from.badges.forEach(function (b) { if (into.badges.indexOf(b) < 0) into.badges.push(b); });
  }
  if (from.reports && from.reports.length) {
    into.reports = into.reports && into.reports.length ? into.reports : [];
    var have = {}; into.reports.forEach(function (r) { if (r && r.id) have[r.id] = 1; });
    from.reports.forEach(function (r) { if (r && r.id && !have[r.id]) into.reports.push(r); });
    into.reports.sort(function (x, y) { return String(x.ts || '') < String(y.ts || '') ? -1 : 1; });
    if (into.reports.length > 40) into.reports = into.reports.slice(-40);
  }
  if ((Number(from.xp) || 0) > (Number(into.xp) || 0)) into.xp = Number(from.xp);
  if (from.rev != null && (into.rev == null || Number(from.rev) > Number(into.rev))) into.rev = Number(from.rev);
  return into;
}
function session(p) {
  var r = p.row || {};
  if (!student(p, r.studentId)) return { ok: false, error: 'Not signed in.' };
  if (p.kind === 'start') append('Sessions', r);
  else {
    var all = rows('Sessions');
    for (var i = all.length - 1; i >= 0; i--) if (all[i].sessionId === r.sessionId && String(all[i].studentId).toLowerCase() === String(r.studentId).toLowerCase()) { update('Sessions', all[i]._row, { logoutTs: r.logoutTs, durationSec: r.durationSec, items: r.items, correct: r.correct }); break; }
  }
  return { ok: true };
}

/* --------------------------------------------------------------- teacher */
function roster() {
  return { ok: true, students: rows('Students').map(function (s) { return { id: s.id, name: s.name, created: s.created, cohort: s.cohort, archived: archivedText(s.archived), pwReset: String(s.pw || '') === '' ? 1 : 0, progress: parse(s.progress, null) }; }) };
}
/* Oct 2026 (handover item 5): the Staff Room's Archive / Restore button. Writes the date (or clears it) in the
   Students sheet's `archived` column, added at the end of the header; nothing else about the student changes.
   Archived students are left out of the roster means and the House Cup (here and in teacher.js). */
/* Sheets may turn '2026-10-21' into a Date at local midnight: read it back in the script's time zone, not UTC. */
function archivedText(v) {
  if (!v) return '';
  if (v instanceof Date) { try { return Utilities.formatDate(v, Session.getScriptTimeZone(), 'yyyy-MM-dd'); } catch (e) { return 'yes'; } }
  return String(v);
}
function archiveStudent(p) {
  var s = findStudent(p.id);
  if (!s) return { ok: false, error: 'Not found' };
  ensureHeader('Students');
  var v = p.archived ? new Date().toISOString().slice(0, 10) : '';
  update('Students', s._row, { archived: v });
  log((v ? 'archived ' : 'restored ') + s.id);
  return { ok: true, id: s.id, archived: v };
}
/* Oct 2026 (WS-G): a forgotten password. Teacher only. The row's pw becomes '' (reset state, see login),
   the lockout is cleared and the token retired, so no device stays signed in on the old password.
   Nothing else about the student changes; the next sign-in sets the new password. */
/* Nov 2026: the Staff Room's Passwords tab resets several students at once (`ids`), and the teacher may
   set the new password herself (`pw`, 4+ characters, the register rule) instead of leaving the reset state,
   so nobody else can claim the account before the student signs in. `id` alone works as before. */
function resetPassword(p) {
  var ids = p.ids && p.ids.length ? p.ids : [p.id], pw = p.pw == null ? '' : String(p.pw);
  if (pw && pw.length < 4) return { ok: false, error: 'A new password needs at least 4 characters.' };
  var done = [], missing = [];
  ids.forEach(function (one) {
    var s = findStudent(one);
    if (!s) { missing.push(String(one)); return; }
    update('Students', s._row, { pw: pw ? hashPw(pw) : '', token: token() });
    cache().remove('lock:pw:' + String(s.id).toLowerCase());
    log('password reset ' + s.id + (pw ? ' (set by teacher)' : ''));
    done.push(s.id);
  });
  if (!done.length) return { ok: false, error: 'Not found', missing: missing };
  return { ok: true, id: done[0], done: done, missing: missing, set: !!pw };
}
/* A sheet made before a column was added keeps its old header row; label the new columns in place. */
function ensureHeader(name) {
  var sh = sheet(name), head = SHEETS[name], cur = sh.getRange(1, 1, 1, head.length).getValues()[0], changed = false;
  head.forEach(function (h, j) { if (cur[j] === '' || cur[j] == null) { cur[j] = h; changed = true; } });
  if (changed) sh.getRange(1, 1, 1, head.length).setValues([cur]);
}
function detail(id) {
  var s = findStudent(id);
  if (!s) return { ok: false, error: 'Not found' };
  var lid = String(id).toLowerCase();
  return { ok: true, student: { id: s.id, name: s.name, created: s.created, cohort: s.cohort }, progress: parse(s.progress, {}),
    attempts: rows('Attempts').filter(function (a) { return String(a.studentId).toLowerCase() === lid; }).slice(-600),
    sessions: rows('Sessions').filter(function (x) { return String(x.studentId).toLowerCase() === lid; }).slice(-100) };
}

/* --------------------------------------------------------------- reports */
function reportRow(rep) {
  /* a Sheet cell holds 50,000 characters: if a very long report is near that, the examiners' one-line reasons go first */
  if (rep.ai && rep.ai.panel && JSON.stringify(rep).length > 46000) (rep.ai.panel.examiners || []).forEach(function (x) { delete x.why; });
  return { id: rep.id, ts: rep.ts, studentId: rep.studentId, name: rep.name, cohort: rep.cohort || '', promptId: rep.promptId, type: rep.type, mode: rep.mode || '', kind: rep.kind, uiMode: rep.uiMode,
    words: rep.words, seconds: rep.seconds, bad: (rep.preflight || {}).bad || 0, warn: (rep.preflight || {}).warn || 0, status: rep.status || 'submitted', released: rep.released ? 1 : 0, aiVisible: rep.aiVisible ? 1 : 0,
    overall: rep.teacher && rep.teacher.bands ? rep.teacher.bands.overall : (rep.ai && rep.ai.bands ? rep.ai.bands.overall : ''), json: JSON.stringify(rep) };
}
function submitReport(p) {
  var rep = p.report;
  if (!rep || !rep.id || !rep.studentId) return { ok: false, error: 'Bad report' };
  if (!student(p, rep.studentId)) return { ok: false, error: 'Not signed in.' };
  var all = rows('Reports');
  for (var i = 0; i < all.length; i++) if (all[i].id === rep.id) return { ok: true, id: rep.id };
  append('Reports', reportRow(rep));
  try { aiKick(); } catch (e) {}      /* live marking: the examiners' panel starts within about a minute */
  return { ok: true, id: rep.id };
}
function reports(p, T) {
  var sid = String(p.studentId || '').toLowerCase();
  if (!T && (!sid || !student(p, sid))) return { ok: false, error: 'Not signed in.' };
  var list = rows('Reports').filter(function (r) { return !sid || String(r.studentId).toLowerCase() === sid; }).map(function (r) {
    var rep = parse(r.json, {});
    if (!T) { /* the student never sees an unreleased teacher mark or a hidden AI estimate */
      if (!rep.released) delete rep.teacher;
      if (!rep.aiVisible) delete rep.ai;
    }
    return rep;
  });
  return { ok: true, reports: list };
}
var MARK_FIELDS = ['teacher', 'released', 'aiVisible', 'status', 'ai'];
function markReport(id, mark, T) {
  if (id === '*' && mark && mark.requestAi) return { ok: !!prop('ANTHROPIC_API_KEY'), marked: aiRun(12) };   /* doPost answers this before the lock */
  if (mark && mark.requestAi) return remarkReport(id);
  var keys = Object.keys(mark || {});
  if (keys.some(function (k) { return MARK_FIELDS.indexOf(k) < 0; })) return { ok: false, error: 'Unknown field in mark' };
  var all = rows('Reports');
  for (var i = 0; i < all.length; i++) if (all[i].id === id) {
    var rep = parse(all[i].json, {});
    Object.keys(mark || {}).forEach(function (k) { rep[k] = mark[k]; });
    update('Reports', all[i]._row, reportRow(rep));
    return { ok: true };
  }
  return { ok: false, error: 'Not found' };
}

/* "Mark again" (teacher only, checked by the router): the old AI report is thrown away and the panel marks afresh. */
function remarkReport(id) {
  var all = rows('Reports');
  for (var i = 0; i < all.length; i++) if (all[i].id === id) {
    var rep = parse(all[i].json, {});
    if (rep.released) return { ok: false, error: 'This report has been returned to the student. Withdraw it first, then mark again.' };
    if (!prop('ANTHROPIC_API_KEY')) return { ok: false, error: 'AI marking is not switched on (no API key in the script properties).' };
    delete rep.ai; delete rep.aiFailed; if (!rep.teacher) rep.status = 'submitted';
    update('Reports', all[i]._row, reportRow(rep));
    try { cache().remove('ai:idle'); } catch (e) {}
    aiKick();
    return { ok: true, queued: true };
  }
  return { ok: false, error: 'Not found' };
}

/* ----------------------------------------------------------- assignments */
function assignments(p, T) {
  var kind = p.kind, row = p.row;
  if (kind === 'set' || kind === 'remove') { if (!T) return denied(); }
  else if (!T && !student(p)) return { ok: false, error: 'Not signed in.' };
  if (kind === 'set' && row && row.id) append('Assignments', { id: row.id, ts: row.ts || new Date().toISOString(), json: JSON.stringify(row) });
  if (kind === 'remove' && row && row.id) { var all = rows('Assignments'); for (var i = 0; i < all.length; i++) if (all[i].id === row.id) { sheet('Assignments').deleteRow(all[i]._row); break; } }
  return { ok: true, assignments: rows('Assignments').map(function (a) { return parse(a.json, null); }).filter(Boolean) };
}

/* ------------------------------------------------------------- projector */
function projector(p, T) {
  var kind = p.kind, row = p.row, sh = sheet('Projector');
  if (!T) {
    var s = student(p);
    if (!s || kind === 'clear') return kind === 'clear' ? denied() : { ok: false, error: 'Not signed in.' };
    if (kind === 'post' && (!row || row.kind === 'round' || String(row.studentId || '').toLowerCase() !== String(s.id).toLowerCase())) return denied();
    if (!row || !row.round) return { ok: false, error: 'Round code needed.' };
    if (kind === 'post') row = { kind: 'post', id: String(row.id || '').slice(0, 40), round: String(row.round).slice(0, 20), team: String(row.team || '').slice(0, 40), studentId: s.id, text: String(row.text || '').slice(0, 900), ts: row.ts || new Date().toISOString() };
  }
  if (kind === 'clear') { if (sh.getLastRow() > 1) sh.deleteRows(2, sh.getLastRow() - 1); return { ok: true, posts: [] }; }
  if (kind === 'post' && row) append('Projector', { ts: row.ts || new Date().toISOString(), round: row.round || '', kind: row.kind || 'post', json: JSON.stringify(row) });
  var posts = rows('Projector').filter(function (r) { return !row || !row.round || r.round === row.round; }).map(function (r) { return parse(r.json, null); }).filter(Boolean);
  return { ok: true, posts: posts.slice(-300) };
}

/* ------------------------------------------------------------- house cup */
var HOUSE_IDS = ['compass', 'bridge', 'lexicon', 'loom'];
/* Totals of story.hp per house, and how many students are in each, for one
   cohort (all cohorts when none is given). Names and ids never leave here. */
function houses(p) {
  var want = String((p && p.cohort) || '').trim().toLowerCase();
  var totals = {}, members = {};
  HOUSE_IDS.forEach(function (h) { totals[h] = 0; members[h] = 0; });
  rows('Students').forEach(function (s) {
    var prog = parse(s.progress, null);
    if (!prog || typeof prog !== 'object' || s.archived) return;
    var coh = String(prog.cohort || s.cohort || '').trim().toLowerCase();
    if (want && coh !== want) return;
    var st = prog.story || {}, h = String(st.house || '').toLowerCase();
    if (HOUSE_IDS.indexOf(h) < 0) return;
    var hp = Number(st.hp);
    if (!isFinite(hp) || hp < 0) hp = 0;
    members[h] += 1;
    totals[h] += Math.min(Math.round(hp), 100000);
  });
  /* WS-B: the Assembly's team points count toward the House Cup too (Assembly.gs; optional). */
  try { var asm = ASM_houseTotals(want); HOUSE_IDS.forEach(function (h) { totals[h] += asm[h] || 0; }); } catch (e) {}
  return { ok: true, cohort: (p && p.cohort) || '', totals: totals, members: members };
}

/* ------------------------------------------------------------ AI marking
   Runs in the background (CC_tick) or on demand from the Flight Deck. Each
   unmarked report is sent to the model with the same gate rubric the app
   shows; the reply is stored under rep.ai and is invisible to the student
   until the teacher releases a mark or ticks "let the student see this".
   ------------------------------------------------------------------------- */
function installTick() {
  ScriptApp.getProjectTriggers().forEach(function (t) { if (t.getHandlerFunction() === 'CC_tick') ScriptApp.deleteTrigger(t); });
  ScriptApp.newTrigger('CC_tick').timeBased().everyMinutes(10).create();
}
/* 12 Nov 2026: the tick used to hold the script lock for its whole run (up to 6 model calls, a minute or
   more, every 10 minutes), so saves and the teacher's sign-in timed out behind it. It now holds the lock
   only for the moment each result is written; a cache flag stops two runs marking the same reports. */
function CC_tick() { aiRun(6); }
function aiRun(max) {
  var c = cache();
  try { if (c.get('ai:busy')) return 0; c.put('ai:busy', '1', 330); } catch (e) {}
  try { return aiTick(max); } finally { try { c.remove('ai:busy'); } catch (e) {} }
}
/* LIVE MARKING (12 Nov 2026, docs/AI-PANEL-MARKING.md). A report is marked as soon as it is sent:
   submitReport calls aiKick(), which sets ONE one-off trigger about a minute ahead (a cache flag stops a
   class sending together from creating thirty). CC_kick marks what is waiting, outside the lock like the
   tick, and sets itself again while reports are still waiting. It gives up after 5 runs that marked
   nothing (no key, no budget, the model down), so it can never loop for ever. */
function aiKick() {
  if (!prop('ANTHROPIC_API_KEY')) return false;
  var c = cache();
  try { if (c.get('ai:kick')) return false; c.put('ai:kick', '1', 90); } catch (e) {}
  try { ScriptApp.newTrigger('CC_kick').timeBased().after(1000).create(); return true; }
  catch (e) { log('AI kick failed ' + e); return false; }
}
function CC_kick() {
  try { ScriptApp.getProjectTriggers().forEach(function (t) { if (t.getHandlerFunction() === 'CC_kick') ScriptApp.deleteTrigger(t); }); } catch (e) {}
  var c = cache();
  try { c.remove('ai:kick'); } catch (e) {}
  var n = aiRun(8), idle = 0;
  try { idle = n ? 0 : Number(c.get('ai:idle') || 0) + 1; c.put('ai:idle', String(idle), 3600); } catch (e) {}
  if (aiWaiting().waiting > 0 && budgetLeft() >= 2 && idle < 5) aiKick();
}
function needsAi(rep) { return !!rep && !!rep.id && !rep.ai && !rep.released && !(rep.aiFailed >= 2) && !!String(rep.text || '').trim(); }
function aiWaiting() {
  var w = 0, f = 0;
  rows('Reports').forEach(function (r) { var rep = parse(r.json, {}); if (needsAi(rep)) w++; else if (!rep.ai && !rep.released && rep.aiFailed >= 2) f++; });
  return { waiting: w, failed: f };
}
function budgetLeft() {
  var cap = parseInt(prop('DAILY_MODEL_BUDGET') || '200', 10), key = 'used-' + new Date().toISOString().slice(0, 10);
  return cap - parseInt(PropertiesService.getScriptProperties().getProperty(key) || '0', 10);
}
function spend() { var key = 'used-' + new Date().toISOString().slice(0, 10), ps = PropertiesService.getScriptProperties(); ps.setProperty(key, String(parseInt(ps.getProperty(key) || '0', 10) + 1)); }
function aiTick(max) {
  if (!prop('ANTHROPIC_API_KEY')) return 0;
  var all = rows('Reports'), n = 0, t0 = Date.now();
  /* newest first: the report a student has just sent is not kept waiting behind an old backlog */
  all.sort(function (x, y) { return String(x.ts || '') < String(y.ts || '') ? 1 : String(x.ts || '') > String(y.ts || '') ? -1 : y._row - x._row; });
  for (var i = 0; i < all.length && n < max; i++) {
    var rep = parse(all[i].json, {});
    if (!needsAi(rep)) continue;
    if (budgetLeft() < 2) break;                  /* a report needs two examiners */
    if (Date.now() - t0 > AI_RUN_MS) break;       /* stay inside the Apps Script run limit; the next run goes on */
    var res = null, bad = null;
    try { res = markWithModel(rep); } catch (err) { bad = err; }   /* slow part: no lock held */
    if (aiWrite(all[i].id, res)) { if (res) n++; }
    if (bad) log('AI fail ' + rep.id + ' ' + bad);
  }
  return n;
}
var AI_RUN_MS = 240000;
/* Writes one AI result under the lock, onto the row as it is NOW (found again by id), so a mark the
   teacher saved while the model was thinking is kept. res null = a failed call: count it. */
function aiWrite(id, res) {
  var lock = LockService.getScriptLock();
  try { lock.waitLock(20000); } catch (e) { return false; }   /* busy: the report stays unmarked for the next tick */
  try {
    var all = rows('Reports');
    for (var i = 0; i < all.length; i++) if (all[i].id === id) {
      var cur = parse(all[i].json, {});
      if (res) { if (cur.ai) return false; cur.ai = res; delete cur.aiFailed; if (!cur.teacher) cur.status = 'ai'; }
      else cur.aiFailed = (cur.aiFailed || 0) + 1;
      update('Reports', all[i]._row, reportRow(cur));
      return true;
    }
    return false;
  } finally { lock.releaseLock(); }
}
var TAGS = ['kn-test-facts', 'kn-criteria', 'kn-triage-mode', 'kn-triage-units', 'ta-no-overview', 'ta-overview-figures', 'ta-overview-vague', 'ta-no-data', 'ta-no-comparison', 'ta-mechanical', 'ta-opinion', 'ta-conclusion', 'ta-missing-category', 'ta-inaccurate', 'ta-selection', 'cc-paragraphing', 'cc-grouping', 'cc-linking-overuse', 'cc-reference', 'cc-sequencers', 'lr-copied-rubric', 'lr-register', 'lr-trend-vocab', 'lr-degree', 'lr-compare-vocab', 'lr-proportion', 'lr-approx', 'lr-number-amount', 'lr-process-vocab', 'lr-map-vocab', 'lr-collocation', 'lr-spelling', 'gra-tense', 'gra-prep-figure', 'gra-article', 'gra-plural', 'gra-punctuation', 'gra-complex', 'gra-passive', 'gra-pattern', 'gra-agreement', 'struct-length', 'struct-time'];

/* ---------------------------------------------------------------------------
   THE EXAMINERS' PANEL (12 Nov 2026). Every report is marked by two examiners
   who never see each other's work (Examiner A and Examiner B, called in the
   same moment). If they are a whole band or more apart on any criterion, a
   third, senior examiner (C) marks the report with both sets of bands and
   reasons in front of her, and each final band is the middle of the three.
   Otherwise the lower of the two bands is kept: "A script must fully fit the
   positive features of the descriptor at a particular level."
   The verbatim descriptors below are the public version (updated May 2023).
   --------------------------------------------------------------------------- */
var CRIT = ['ta', 'cc', 'lr', 'gra'];
var CRIT_NAME = { ta: 'Task Achievement', cc: 'Coherence and Cohesion', lr: 'Lexical Resource', gra: 'Grammatical Range and Accuracy' };
var DESCRIPTORS = [
  'TASK ACHIEVEMENT',
  '9: All the requirements of the task are fully and appropriately satisfied. There may be extremely rare lapses in content.',
  '8: The response covers all the requirements of the task appropriately, relevantly and sufficiently. Key features are skilfully selected, and clearly presented, highlighted and illustrated. There may be occasional omissions or lapses in content.',
  '7: The response covers the requirements of the task. The content is relevant and accurate – there may be a few omissions or lapses. The format is appropriate. Key features which are selected are covered and clearly highlighted but could be more fully or more appropriately illustrated or extended. It presents a clear overview, the data are appropriately categorised, and main trends or differences are identified.',
  '6: The response focuses on the requirements of the task and an appropriate format is used. Key features which are selected are covered and adequately highlighted. A relevant overview is attempted. Information is appropriately selected and supported using figures/data. Some irrelevant, inappropriate or inaccurate information may occur in areas of detail or when illustrating or extending the main points. Some details may be missing (or excessive) and further extension or illustration may be needed.',
  '5: The response generally addresses the requirements of the task. The format may be inappropriate in places. Key features which are selected are not adequately covered. The recounting of detail is mainly mechanical. There may be no data to support the description. There may be a tendency to focus on details (without referring to the bigger picture). The inclusion of irrelevant, inappropriate or inaccurate material in key areas detracts from the task achievement. There is limited detail when extending and illustrating the main points.',
  '4: The response is an attempt to address the task. Few key features have been selected. The format may be inappropriate. Key features which are presented may be irrelevant, repetitive, inaccurate or inappropriate.',
  '3: The response does not address the requirements of the task (possibly because of misunderstanding of the data/diagram/situation). 1: Responses of 20 words or fewer are rated at Band 1. Any copied rubric must be discounted.',
  'COHERENCE AND COHESION',
  '9: The message can be followed effortlessly. Cohesion is used in such a way that it very rarely attracts attention. Any lapses in coherence or cohesion are minimal. Paragraphing is skilfully managed.',
  '8: The message can be followed with ease. Information and ideas are logically sequenced, and cohesion is well managed. Occasional lapses in coherence and cohesion may occur. Paragraphing is used sufficiently and appropriately.',
  '7: Information and ideas are logically organised, and there is a clear progression throughout the response. (A few lapses may occur, but these are minor.) A range of cohesive devices including reference and substitution is used flexibly but with some inaccuracies or some over/under use. Paragraphing is generally used effectively to support overall coherence, and the sequencing of ideas within a paragraph is generally logical.',
  '6: Information and ideas are generally arranged coherently and there is a clear overall progression. Cohesive devices are used to some good effect but cohesion within and/or between sentences may be faulty or mechanical due to misuse, overuse or omission. The use of reference and substitution may lack flexibility or clarity and result in some repetition or error. Paragraphing may not always be logical and/or the central topic may not always be clear.',
  '5: Organisation is evident but is not wholly logical and there may be a lack of overall progression. Nevertheless, there is a sense of underlying coherence to the response. The relationship of ideas can be followed but the sentences are not fluently linked to each other. There may be limited/overuse of cohesive devices with some inaccuracy. The writing may be repetitive due to inadequate and/or inaccurate use of reference and substitution. Paragraphing may be inadequate or missing.',
  '4: Information and ideas are evident but not arranged coherently and there is no clear progression within the response. Relationships between ideas can be unclear and/or inadequately marked. There is some use of basic cohesive devices, which may be inaccurate or repetitive. There is inaccurate use or a lack of substitution or referencing. There may be no paragraphing and/or no clear main topic within paragraphs.',
  'LEXICAL RESOURCE',
  '9: Full flexibility and precise use are evident within the scope of the task. A wide range of vocabulary is used accurately and appropriately with very natural and sophisticated control of lexical features. Minor errors in spelling and word formation are extremely rare and have minimal impact on communication.',
  '8: A wide resource is fluently and flexibly used to convey precise meanings within the scope of the task. There is skilful use of uncommon and/or idiomatic items when appropriate, despite occasional inaccuracies in word choice and collocation. Occasional errors in spelling and/or word formation may occur, but have minimal impact on communication.',
  '7: The resource is sufficient to allow some flexibility and precision. There is some ability to use less common and/or idiomatic items. An awareness of style and collocation is evident, though inappropriacies occur. There are only a few errors in spelling and/or word formation, and they do not detract from overall clarity.',
  '6: The resource is generally adequate and appropriate for the task. The meaning is generally clear in spite of a rather restricted range or a lack of precision in word choice. If the writer is a risk-taker, there will be a wider range of vocabulary used but higher degrees of inaccuracy or inappropriacy. There are some errors in spelling and/or word formation, but these do not impede communication.',
  '5: The resource is limited but minimally adequate for the task. Simple vocabulary may be used accurately but the range does not permit much variation in expression. There may be frequent lapses in the appropriacy of word choice, and a lack of flexibility is apparent in frequent simplifications and/or repetitions. Errors in spelling and/or word formation may be noticeable and may cause some difficulty for the reader.',
  '4: The resource is limited and inadequate for or unrelated to the task. Vocabulary is basic and may be used repetitively. There may be inappropriate use of lexical chunks (e.g. memorised phrases, formulaic language and/or language from the input material). Inappropriate word choice and/or errors in word formation and/or in spelling may impede meaning.',
  '3: The resource is inadequate (which may be due to the response being significantly underlength). Possible over-dependence on input material or memorised language.',
  'GRAMMATICAL RANGE AND ACCURACY',
  '9: A wide range of structures within the scope of the task is used with full flexibility and control. Punctuation and grammar are used appropriately throughout. Minor errors are extremely rare and have minimal impact on communication.',
  '8: A wide range of structures within the scope of the task is flexibly and accurately used. The majority of sentences are error-free, and punctuation is well managed. Occasional, non-systematic errors and inappropriacies occur, but have minimal impact on communication.',
  '7: A variety of complex structures is used with some flexibility and accuracy. Grammar and punctuation are generally well controlled, and error-free sentences are frequent. A few errors in grammar may persist, but these do not impede communication.',
  '6: A mix of simple and complex sentence forms is used but flexibility is limited. Examples of more complex structures are not marked by the same level of accuracy as in simple structures. Errors in grammar and punctuation occur, but rarely impede communication.',
  '5: The range of structures is limited and rather repetitive. Although complex sentences are attempted, they tend to be faulty, and the greatest accuracy is achieved on simple sentences. Grammatical errors may be frequent and cause some difficulty for the reader. Punctuation may be faulty.',
  '4: A very limited range of structures is used. Subordinate clauses are rare and simple sentences predominate. Some structures are produced accurately but grammatical errors are frequent and may impede meaning. Punctuation is often faulty or inadequate.'];
var EXAMINER_WAY = {
  A: 'You are Examiner A. Read the task and its data, then read the whole script once before you rate anything. Rate Task Achievement first, then Coherence and Cohesion, Lexical Resource, and Grammatical Range and Accuracy, each one on its own evidence.',
  B: 'You are Examiner B. Before you rate anything: check every figure, date and label the candidate gives against the data, find the overview (or note that there is none), and count how many sentences are free of grammar and punctuation errors. Then rate the four criteria from that evidence.',
  C: 'You are Examiner C, the senior examiner called in because two examiners disagree about this script. Their bands and reasons are given below the script. Mark the whole script yourself, from the script and the descriptors. On each disputed criterion decide which reading the script itself supports. Do not average the two marks and do not split the difference to be fair to both.' };
function examinerSystem(role) {
  return 'You are a senior IELTS examiner who has marked Academic Writing Task 1 scripts for many years and now trains other examiners. You mark exactly as in a live marking session: you rate what is on the page against the public band descriptors, criterion by criterion, and you award the band whose descriptor the script fits in full. You do not reward effort, length or ambition, and you are neither kinder nor harder because the candidate is a secondary-school student in Thailand. ' +
    'You never invent evidence: every word you quote is copied exactly, letter for letter, from the script. ' + EXAMINER_WAY[role] +
    ' You mark alone and you reply with one JSON object and nothing else.';
}
function markingPrompt(rep, role, others) {
  /* Kept in step with Writer.markingPrompt in writer.js and the ielts-writing-task-1 rules (May 2023 public descriptors). */
  var gates = [
    'Walk each criterion up its gates (5→6→7→8) and stop at the first band whose positive features are not ALL present. Award x.5 only when band x is fully met and about half of band x+1 is present.',
    'Task Achievement: 5→6 an overview is attempted and most body sentences are supported with figures/data; 6→7 a clear overview with the main trends or differences, data appropriately categorised (grouped, not listed), accurate; 7→8 key features skilfully selected and illustrated, occasional lapses at most.',
    'Coherence & Cohesion: 5→6 clear overall progression, some paragraphing, devices used; 6→7 logical organisation, paragraphing generally effective (four paragraphs, or three with a findable overview), reference and substitution used; 7→8 followed with ease, cohesion well managed, paragraphing sufficient and appropriate.',
    'Lexical Resource: 5→6 adequate range, meaning clear; 6→7 some flexibility and precision, less common items, awareness of collocation; 7→8 wide resource used precisely, skilful use of uncommon items, occasional slips only.',
    'Grammatical Range & Accuracy: 5→6 mix of simple and complex sentences, errors rarely impede; 6→7 a variety of complex structures, error-free sentences are frequent (more than half); 7→8 a wide range, the majority of sentences error-free (about three quarters), punctuation well managed.',
    'CEILINGS (the lowest applicable one wins; they never stack and never cross criteria; there are no "-1" deductions): no overview → TA max 5; a vague or wrong overview → TA max 6; data values (figures) inside the overview are a fault to name but not a ceiling by themselves; fewer than 30% of body sentences with data → TA max 5; opinion, reasons or a conclusion in a detail paragraph → TA max 6, in the overview or dominating → TA max 5; one category, stage or feature missing → TA max 6, two or more → TA max 5; a factual error in a main trend → TA max 6, several → TA max 5 (one minor slip still allows 7); bullet points or notes → TA max 5; letter-style opening → TA max 7; one block of text → CC max 5; two paragraphs → CC max 6; memorised chunks that do not fit → LR max 4.',
    'COPIED RUBRIC: 10 or more identical consecutive words from the task sentence are discounted from the evidence and the word count (not a band subtraction). LENGTH: 20 words or fewer = Band 1; 21-99 → TA max 4; 100-149 → TA max 5 and say the language evidence is thin.',
    'ACCURACY: values between gridlines may use approximation words (around, just over, nearly); an exact figure off by more than half a gridline interval is a factual error. Years, category labels that contain numbers, counts of categories and multiples written as words are allowed in the overview.',
    'OVERALL = the mean of the four bands rounded to the nearest half band (.25 rounds up to .5, .75 rounds up to the next whole band). CEFR (official ielts.org alignment only): 4.0-5.0 = B1, 5.5-6.5 = B2, 7.0-8.0 = C1, 8.5-9.0 = C2, below 4.0 = "below B1".'];
  var pre = ((rep.preflight || {}).rows || []).map(function (r) { return '- [' + r.status + '] ' + r.label; }).join('\n');
  var name = rep.name || 'the student';
  var disputed = '';
  if (others && others.length) {
    disputed = '\n\nTHE TWO EARLIER MARKS\n' + others.map(function (o) {
      return 'Examiner ' + o.id + ': ' + CRIT.map(function (k) { return k.toUpperCase() + ' ' + o.bands[k] + ' (' + (o.why[k] || 'no reason given') + ')'; }).join(' · ');
    }).join('\n') + '\nThey are a whole band or more apart on: ' + CRIT.filter(function (k) { return Math.abs(others[0].bands[k] - others[1].bands[k]) >= 1; }).map(function (k) { return CRIT_NAME[k]; }).join(', ') + '.';
  }
  return 'Mark the IELTS Academic Writing Task 1 report below against the public band descriptors (updated May 2023).\n\n' +
    'THE PUBLIC BAND DESCRIPTORS (verbatim)\n' + DESCRIPTORS.join('\n') + '\n\nHOW TO APPLY THEM\n' +
    gates.join('\n') +
    '\nBelow Band 5 use the Band 4 and Band 3 descriptors above in the same way. An under-length script is still rated on all four criteria. COMPARE tasks (categories with no time axis, including age groups and year groups) are not penalised for the absence of trend language; trend verbs used across categories are a lexical fault to name.' +
    '\n\nTHE TASK AND ITS DATA\n' + (rep.promptDesc || rep.promptId) + '\n\nSTRUCTURAL CHECK (rule-based, for reference only; trust the script over it)\n' + pre +
    '\n\nCANDIDATE SCRIPT (' + rep.words + ' words, written by ' + name + ')\n<<<\n' + rep.text + '\n>>>' + disputed +
    '\n\nReturn ONLY one JSON object, no markdown, in exactly this shape:\n' +
    '{"ta":{"band":6.0,"met":"…","notMet":"…","toNext":"…"},"cc":{"band":6.0,"met":"…","notMet":"…","toNext":"…"},"lr":{"band":6.0,"met":"…","notMet":"…","toNext":"…"},"gra":{"band":6.0,"met":"…","notMet":"…","toNext":"…"},' +
    '"ceilings":["…"],"strengths":[{"point":"…","quote":"…"}],"improvements":[{"point":"…","quote":"…","fix":"…"}],"errors":[{"quote":"…","tag":"gra-tense","fix":"…"}],"nextGate":"…","comment":"…"}\n' +
    'RULES FOR THE FIELDS\n' +
    '- "band": half steps. Decide it from the descriptors first; write the text afterwards so that it explains that band.\n' +
    '- "met", "notMet", "toNext" are read by the student (a Thai teenager at about B1-B2): write to "you", in plain English, short sentences, 25-60 words each. Put the student\'s own words in single quotes, copied exactly. You may put a short phrase from the band descriptor in double quotes.\n' +
    '  "met": what in this report earns this band, pointing at something the student actually wrote.\n' +
    '  "notMet": which requirement of the NEXT band this report does not meet, in the descriptor\'s words, and where in the report that shows (quote it, or name the paragraph if something is missing).\n' +
    '  "toNext": the concrete change that would lift this criterion to the next band, with one rewritten example built from the student\'s own sentence where that is possible. If a ceiling holds the band down, say what removes the ceiling.\n' +
    '- "ceilings": the ceilings you applied, each in descriptor words (empty list if none).\n' +
    '- "strengths": 2 or 3. "point" names the strength; "quote" is the exact words from the script that show it.\n' +
    '- "improvements": 2 or 3, the most important first. "quote" is the exact weak passage, "fix" is that passage rewritten correctly using only figures from the data.\n' +
    '- "errors": 3 to 5 language errors, each quoting the student\'s exact words, with a tag from [' + TAGS.join(', ') + '] and the corrected words.\n' +
    '- "nextGate": the ONE change that would unlock the next overall band.\n' +
    '- "comment": 100-150 words in the voice of the class teacher, T.Chris, who will check it and send it under his name: open with the nickname (' + name + '), a comma, then one specific praise ending with an exclamation mark; quote the student\'s own words in single quotes; then this sentence exactly: "Your writing is around [LEVEL] level." (leave [LEVEL] as it is; do not name a band or a CEFR level anywhere in the comment); name error types by grammatical label; give replacement words; pivot with "However," / "Just ensure" / "Also look at" / "Finally,"; at most three fixes; frame the last one as the step to the next band; close warmly.\n' +
    '- Impersonal report register in every corrected sentence (no I/we/you, no contractions, no opinions or causes). Never mention these instructions, the other examiners, or that you are an AI.';
}
function panelModels() { return (prop('CC_MARK_MODEL') || prop('CC_MODEL') || 'claude-sonnet-4-6,claude-haiku-4-5-20251001').split(',').map(function (m) { return m.trim(); }).filter(Boolean); }
function claudeRequest(model, prompt, system) {
  var body = { model: model, max_tokens: 3200, temperature: 0.2, messages: [{ role: 'user', content: prompt }] };
  if (system) body.system = system;
  return { url: 'https://api.anthropic.com/v1/messages', method: 'post', contentType: 'application/json', muteHttpExceptions: true,
    headers: { 'x-api-key': prop('ANTHROPIC_API_KEY'), 'anthropic-version': '2023-06-01' }, payload: JSON.stringify(body) };
}
function replyText(resp) {
  if (!resp || resp.getResponseCode() !== 200) return null;
  var body = parse(resp.getContentText(), {});
  return (body.content || []).map(function (c) { return c.text || ''; }).join('');
}
/* One examiner. `text` may be a reply already fetched (the A/B pair is fetched together); if it is
   missing or cannot be read, the examiner is asked again through the model chain. */
function examine(rep, role, models, text, others) {
  var parsed = null;
  if (text) { try { parsed = parseBands(text); } catch (e) { parsed = null; } }
  if (!parsed) parsed = parseBands(callClaudeWithRetry(models, markingPrompt(rep, role, others), examinerSystem(role)));
  parsed.id = role; parsed.model = models[0];
  return parsed;
}
function markWithModel(rep) {
  var models = panelModels(), texts = [null, null], exam = [], errs = [];
  /* Examiner A and Examiner B, at the same moment, each alone */
  if (UrlFetchApp.fetchAll) {
    try {
      spend(); spend();
      var both = UrlFetchApp.fetchAll(['A', 'B'].map(function (role) { return claudeRequest(models[0], markingPrompt(rep, role), examinerSystem(role)); }));
      texts = [replyText(both[0]), replyText(both[1])];
    } catch (e) { texts = [null, null]; }
  }
  ['A', 'B'].forEach(function (role, i) { try { exam.push(examine(rep, role, models, texts[i])); } catch (e) { errs.push(e); } });
  if (!exam.length) throw errs[0] || new Error('No examiner answered');
  var disagreed = [], spread = 0;
  if (exam.length === 2) CRIT.forEach(function (k) { var d = Math.abs(exam[0][k] - exam[1][k]); if (d > spread) spread = d; if (d >= 1) disagreed.push(k); });
  var third = null;
  if (disagreed.length && budgetLeft() > 0) {
    try { third = examine(rep, 'C', models, null, exam.map(function (x) { return { id: x.id, bands: bandsOf4(x), why: whyOf(x) }; })); } catch (e) { log('AI third examiner failed ' + rep.id + ' ' + e); }
  }
  return panelResult(rep, exam, third, disagreed, spread);
}
function bandsOf4(x) { var b = {}; CRIT.forEach(function (k) { b[k] = x[k]; }); b.overall = Math.round((b.ta + b.cc + b.lr + b.gra) / 4 * 2) / 2; return b; }
function whyOf(x) { var w = {}; CRIT.forEach(function (k) { var c = (x.crit || {})[k] || {}; w[k] = clip(c.notMet || c.met || '', 260); }); return w; }
function clip(s, n) { s = String(s == null ? '' : s).replace(/\s+/g, ' ').trim(); return s.length > n ? s.slice(0, n - 1) + '…' : s; }
function nextBand(b) { return b >= 9 ? 9 : Math.floor(b) + 1; }
/* Is this quotation really in the script? Spaces, case and curly quote marks are ignored; a quotation
   with "…" in the middle must have every part present. */
function normQ(s) { return String(s == null ? '' : s).toLowerCase().replace(/[‘’‛′]/g, "'").replace(/[“”″]/g, '"').replace(/\s+/g, ' ').trim(); }
function quoted(text, q) {
  var t = normQ(text), parts = normQ(q).replace(/^["'\s]+|["'\s.]+$/g, '').split(/\s*(?:…|\.\.\.)\s*/).filter(function (x) { return x.length; });
  if (!parts.length) return false;
  return parts.every(function (part) { return part.length >= 2 && t.indexOf(part) >= 0; });
}
/* Builds rep.ai (version 2) from the examiners' marks. See docs/AI-PANEL-MARKING.md §2. */
function panelResult(rep, exam, third, disagreed, spread) {
  var all = third ? exam.concat([third]) : exam, single = exam.length < 2;
  var bands = {}, criteria = {}, src = {};
  CRIT.forEach(function (k) {
    var vals = all.map(function (x) { return x[k]; }).sort(function (a, b) { return a - b; });
    var fin = third && vals.length === 3 ? vals[1] : vals[0];            /* the middle of three, else the lower of two */
    bands[k] = fin;
    var order = third ? [third].concat(exam) : exam, from = order.filter(function (x) { return x[k] === fin; })[0] || order[0];
    src[k] = from.id;
    var c = (from.crit || {})[k] || {};
    criteria[k] = { band: fin, met: clip(c.met, 700), notMet: clip(c.notMet, 700), toNext: clip(c.toNext, 700), next: nextBand(fin) };
  });
  bands.overall = Math.round((bands.ta + bands.cc + bands.lr + bands.gra) / 4 * 2) / 2;
  var cefr = cefrOf(bands.overall);
  /* whose words: the third examiner if there is one, else the examiner nearer the final overall band */
  var lead = third || exam.slice().sort(function (a, b) { return Math.abs(bandsOf4(a).overall - bands.overall) - Math.abs(bandsOf4(b).overall - bands.overall); })[0];
  var rest = all.filter(function (x) { return x !== lead; }), dropped = 0;
  function gather(field, min, max, need) {
    var out = [], seen = {};
    [lead].concat(rest).forEach(function (x, xi) {
      if (xi > 0 && out.length >= min) return;                            /* the others only top up a short list */
      (x[field] || []).forEach(function (it) {
        if (!it || out.length >= max) return;
        var o = {}; Object.keys(it).forEach(function (f) { o[f] = clip(it[f], 400); });
        var ok = o.quote && quoted(rep.text, o.quote);
        if (!ok) { if (o.quote) dropped++; if (need) return; delete o.quote; if (!o.point) return; }
        var key = normQ(o.quote || o.point); if (seen[key]) return; seen[key] = 1;
        out.push(o);
      });
    });
    return out;
  }
  var errors = gather('errors', 3, 5, true).filter(function (e) { return e.fix; }).map(function (e) { return { quote: e.quote, tag: TAGS.indexOf(e.tag) >= 0 ? e.tag : 'gra-pattern', fix: e.fix }; });
  var strengths = gather('strengths', 2, 3, false).map(function (s) { var o = { point: s.point || '' }; if (s.quote) o.quote = s.quote; return o; });
  var improvements = gather('improvements', 2, 3, true).map(function (s) { return { point: s.point || '', quote: s.quote, fix: s.fix || '' }; });
  var level = cefr === 'below B1' ? 'Your writing is just below B1 level.' : 'Your writing is around ' + cefr + ' level.';
  var comment = String(lead.comment || '').replace(/Your writing is around \[LEVEL\] level\.?/i, level).replace(/\[LEVEL\]/g, cefr).trim();
  var taFrom = all.filter(function (x) { return x.id === src.ta; })[0] || lead;
  return { v: 2, bands: bands, cefr: cefr, ceilings: (taFrom.ceilings || []).map(function (c) { return clip(c, 240); }).filter(Boolean).slice(0, 6),
    criteria: criteria, strengths: strengths, improvements: improvements, errors: errors, nextGate: clip(lead.nextGate, 500), comment: comment,
    panel: { examiners: all.map(function (x) { return { id: x.id, bands: bandsOf4(x), why: whyOf(x), model: x.model }; }),
      disagreed: disagreed, third: !!third, method: third ? 'median' : (single || spread === 0 ? 'agreed' : 'lower'), spread: spread, single: single },
    quotesDropped: dropped, model: lead.model, at: new Date().toISOString() };
}
/* Reads one examiner's reply. Each criterion is {band, met, notMet, toNext}; a bare number is still
   accepted (the reply shape before 12 Nov 2026). The overall band is never taken from the model. */
function parseBands(text) {
  var m = String(text).match(/\{[\s\S]*\}/);
  if (!m) throw new Error('No JSON in model reply');
  var o = JSON.parse(m[0]);
  o.crit = {};
  CRIT.forEach(function (k) {
    var raw = o[k], c = raw && typeof raw === 'object' ? raw : { band: raw };
    var b = Math.round(parseFloat(c.band) * 2) / 2;
    if (isNaN(b)) throw new Error('Bad band ' + k);
    b = Math.max(0, Math.min(9, b));
    o.crit[k] = { band: b, met: c.met || '', notMet: c.notMet || '', toNext: c.toNext || '' };
    o[k] = b;
  });
  o.overall = Math.round((o.ta + o.cc + o.lr + o.gra) / 4 * 2) / 2;
  ['ceilings', 'strengths', 'improvements', 'errors'].forEach(function (f) { if (Object.prototype.toString.call(o[f]) !== '[object Array]') o[f] = []; });
  return o;
}
/* Official ielts.org CEFR alignment only (no finer splits). */
function cefrOf(b) { b = Number(b) || 0; return b >= 8.5 ? 'C2' : b >= 7 ? 'C1' : b >= 5.5 ? 'B2' : b >= 4 ? 'B1' : 'below B1'; }
function callClaudeWithRetry(models, prompt, system) {
  var lastErr = null;
  for (var mi = 0; mi < models.length; mi++) {
    for (var attempt = 0; attempt < 2; attempt++) {
      try {
        spend();
        var rq = claudeRequest(models[mi], prompt, system), resp = UrlFetchApp.fetch(rq.url, rq);
        var code = resp.getResponseCode(), body = JSON.parse(resp.getContentText() || '{}');
        if (code === 200) return (body.content || []).map(function (c) { return c.text || ''; }).join('');
        lastErr = new Error('HTTP ' + code + ' ' + (body.error && body.error.message));
        if (code === 429 || code >= 500) Utilities.sleep(1500 * (attempt + 1)); else break;
      } catch (e) { lastErr = e; Utilities.sleep(1000); }
    }
  }
  throw lastErr || new Error('Model call failed');
}
