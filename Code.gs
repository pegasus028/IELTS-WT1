/* ===========================================================================
   CHART CONTROL — Code.gs
   Google Apps Script Web App behind index.html and teacher.html.

   SET-UP (once)
   1. Create a Google Sheet. Extensions → Apps Script. Paste this file.
   2. Project Settings → Script properties:
        TEACHER_PIN        e.g. 4821            (teacher console PIN)
        ANTHROPIC_API_KEY  sk-ant-…             (optional — AI marking)
        CC_MODEL           claude-sonnet-4-6,claude-haiku-4-5-20251001   (optional chain)
        DAILY_MODEL_BUDGET 200                  (optional, calls per day)
   3. Deploy → New deployment → Web app · Execute as: Me · Access: Anyone.
      Paste the /exec URL into window.CC_API_URL in index.html and teacher.html.
   4. AFTER EVERY EDIT: Deploy → Manage deployments → pencil → New version → Deploy.
      Saving alone does not update the live /exec endpoint.
   5. Optional: run installTick() once to create the CC_tick trigger that marks
      queued reports in the background every 10 minutes.

   Requests are POST with Content-Type text/plain (a "simple request", so no
   CORS preflight), body {action, payload}. Every reply is JSON {ok, …}.
   =========================================================================== */

var SHEETS = {
  Students: ['id', 'name', 'pw', 'created', 'cohort', 'token', 'progress'],
  Attempts: ['ts', 'studentId', 'itemId', 'topic', 'level', 'type', 'tag', 'cefr', 'correct', 'ms', 'hinted', 'fast', 'mode', 'given', 'expected'],
  Sessions: ['sessionId', 'studentId', 'loginTs', 'logoutTs', 'durationSec', 'items', 'correct'],
  Reports: ['id', 'ts', 'studentId', 'name', 'cohort', 'promptId', 'type', 'mode', 'kind', 'uiMode', 'words', 'seconds', 'bad', 'warn', 'status', 'released', 'aiVisible', 'overall', 'json'],
  Assignments: ['id', 'ts', 'json'],
  Projector: ['ts', 'round', 'kind', 'json'],
  Log: ['ts', 'what']
};

function doGet() { return out({ ok: true, app: 'Chart Control', sheet: SpreadsheetApp.getActive().getName() }); }

function doPost(e) {
  var req;
  try { req = JSON.parse(e.postData.contents || '{}'); } catch (err) { return out({ ok: false, error: 'Bad JSON' }); }
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000);
    return out(handle(req.action, req.payload || {}));
  } catch (err) {
    log('ERR ' + req.action + ' ' + err);
    return out({ ok: false, error: String(err) });
  } finally { lock.releaseLock(); }
}
function out(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }

/* ---------------------------------------------------------------- router */
function handle(action, p) {
  switch (action) {
    case 'ping': return { ok: true, sheet: SpreadsheetApp.getActive().getName(), students: sheet('Students').getLastRow() - 1 };
    case 'register': return register(p);
    case 'login': return login(p);
    case 'save': return save(p);
    case 'session': return session(p);
    case 'teacherLogin': return { ok: pin(p.pin), error: pin(p.pin) ? '' : 'Wrong teacher PIN.' };
    case 'roster': return roster();
    case 'detail': return detail(p.id);
    case 'submitReport': return submitReport(p.report);
    case 'reports': return reports(p.studentId);
    case 'markReport': return markReport(p.id, p.mark);
    case 'assignments': return assignments(p.kind, p.row);
    case 'projector': return projector(p.kind, p.row);
    case 'aiStatus': return { ok: true, enabled: !!prop('ANTHROPIC_API_KEY'), budgetLeft: budgetLeft() };
    case 'assign': return { ok: true };
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
function prop(k) { return PropertiesService.getScriptProperties().getProperty(k) || ''; }
function pin(x) { return String(x) === (prop('TEACHER_PIN') || '1234'); }
function log(w) { try { append('Log', { ts: new Date().toISOString(), what: String(w).slice(0, 500) }); } catch (e) {} }
function hash(s) {
  var raw = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, String(s) + '|chart-control');
  return raw.map(function (b) { return ('0' + (b & 255).toString(16)).slice(-2); }).join('');
}
function token() { return Utilities.getUuid().replace(/-/g, ''); }
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
  var progress = { studentId: id, displayName: p.name || id, cohort: p.cohort || '', xp: 0, streak: 0, longestStreak: 0, lastActiveDate: null, sessions: 0, runBest: 0, run: 0, reclaimed: 0, speedBonuses: 0, subs: {}, checks: {}, mocks: {}, plans: {}, badges: [], review: {}, stats: { seen: 0, correct: 0, byTag: {} }, reports: [], modes: {}, assignment: null, created: new Date().toISOString() };
  append('Students', { id: id, name: p.name || id, pw: hash(p.pw), created: new Date().toISOString(), cohort: p.cohort || '', token: t, progress: JSON.stringify(progress) });
  return { ok: true, token: t, progress: progress };
}
function login(p) {
  var s = findStudent(p.id);
  if (!s) return { ok: false, error: 'No account with that ID. Create one first.' };
  if (s.pw !== hash(p.pw)) return { ok: false, error: 'Wrong password.' };
  var t = token();
  update('Students', s._row, { token: t });
  return { ok: true, token: t, progress: parse(s.progress, {}) };
}
function auth(p) {
  var s = p.progress && findStudent(p.progress.studentId);
  if (!s) return null;
  if (p.token && s.token && p.token !== s.token) return null;
  return s;
}
function save(p) {
  var s = auth(p);
  if (!s) return { ok: false, error: 'Not signed in.' };
  var prog = p.progress;
  if (prog.cohort && !s.cohort) update('Students', s._row, { cohort: prog.cohort });
  update('Students', s._row, { progress: JSON.stringify(prog), name: prog.displayName || s.name });
  var head = SHEETS.Attempts, sh = sheet('Attempts'), batch = [];
  (p.attempts || []).forEach(function (a) { if (a && a.itemId) batch.push(head.map(function (h) { return a[h] == null ? '' : a[h]; })); });
  if (batch.length) sh.getRange(sh.getLastRow() + 1, 1, batch.length, head.length).setValues(batch);
  return { ok: true };
}
function session(p) {
  var r = p.row || {};
  if (p.kind === 'start') append('Sessions', r);
  else {
    var all = rows('Sessions');
    for (var i = all.length - 1; i >= 0; i--) if (all[i].sessionId === r.sessionId) { update('Sessions', all[i]._row, { logoutTs: r.logoutTs, durationSec: r.durationSec, items: r.items, correct: r.correct }); break; }
  }
  return { ok: true };
}

/* --------------------------------------------------------------- teacher */
function roster() {
  return { ok: true, students: rows('Students').map(function (s) { return { id: s.id, name: s.name, created: s.created, cohort: s.cohort, progress: parse(s.progress, null) }; }) };
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
  return { id: rep.id, ts: rep.ts, studentId: rep.studentId, name: rep.name, cohort: rep.cohort || '', promptId: rep.promptId, type: rep.type, mode: rep.mode, kind: rep.kind, uiMode: rep.uiMode,
    words: rep.words, seconds: rep.seconds, bad: (rep.preflight || {}).bad || 0, warn: (rep.preflight || {}).warn || 0, status: rep.status || 'submitted', released: rep.released ? 1 : 0, aiVisible: rep.aiVisible ? 1 : 0,
    overall: rep.teacher && rep.teacher.bands ? rep.teacher.bands.overall : (rep.ai && rep.ai.bands ? rep.ai.bands.overall : ''), json: JSON.stringify(rep) };
}
function submitReport(rep) {
  if (!rep || !rep.id || !rep.studentId) return { ok: false, error: 'Bad report' };
  var all = rows('Reports');
  for (var i = 0; i < all.length; i++) if (all[i].id === rep.id) return { ok: true, id: rep.id };
  append('Reports', reportRow(rep));
  return { ok: true, id: rep.id };
}
function reports(studentId) {
  var sid = String(studentId || '').toLowerCase();
  var list = rows('Reports').filter(function (r) { return !sid || String(r.studentId).toLowerCase() === sid; }).map(function (r) {
    var rep = parse(r.json, {});
    if (sid) { /* the student never sees an unreleased teacher mark or a hidden AI estimate */
      if (!rep.released) delete rep.teacher;
      if (!rep.aiVisible) delete rep.ai;
    }
    return rep;
  });
  return { ok: true, reports: list };
}
function markReport(id, mark) {
  if (id === '*' && mark && mark.requestAi) { var n = aiTick(12); return { ok: !!prop('ANTHROPIC_API_KEY'), marked: n }; }
  var all = rows('Reports');
  for (var i = 0; i < all.length; i++) if (all[i].id === id) {
    var rep = parse(all[i].json, {});
    Object.keys(mark || {}).forEach(function (k) { rep[k] = mark[k]; });
    update('Reports', all[i]._row, reportRow(rep));
    return { ok: true };
  }
  return { ok: false, error: 'Not found' };
}

/* ----------------------------------------------------------- assignments */
function assignments(kind, row) {
  if (kind === 'set' && row && row.id) append('Assignments', { id: row.id, ts: row.ts || new Date().toISOString(), json: JSON.stringify(row) });
  if (kind === 'remove' && row && row.id) { var all = rows('Assignments'); for (var i = 0; i < all.length; i++) if (all[i].id === row.id) { sheet('Assignments').deleteRow(all[i]._row); break; } }
  return { ok: true, assignments: rows('Assignments').map(function (a) { return parse(a.json, null); }).filter(Boolean) };
}

/* ------------------------------------------------------------- projector */
function projector(kind, row) {
  var sh = sheet('Projector');
  if (kind === 'clear') { if (sh.getLastRow() > 1) sh.deleteRows(2, sh.getLastRow() - 1); return { ok: true, posts: [] }; }
  if (kind === 'post' && row) append('Projector', { ts: row.ts || new Date().toISOString(), round: row.round || '', kind: row.kind || 'post', json: JSON.stringify(row) });
  var posts = rows('Projector').filter(function (r) { return !row || !row.round || r.round === row.round; }).map(function (r) { return parse(r.json, null); }).filter(Boolean);
  return { ok: true, posts: posts.slice(-300) };
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
function CC_tick() { var lock = LockService.getScriptLock(); if (!lock.tryLock(5000)) return; try { aiTick(6); } finally { lock.releaseLock(); } }
function budgetLeft() {
  var cap = parseInt(prop('DAILY_MODEL_BUDGET') || '200', 10), key = 'used-' + new Date().toISOString().slice(0, 10);
  return cap - parseInt(PropertiesService.getScriptProperties().getProperty(key) || '0', 10);
}
function spend() { var key = 'used-' + new Date().toISOString().slice(0, 10), ps = PropertiesService.getScriptProperties(); ps.setProperty(key, String(parseInt(ps.getProperty(key) || '0', 10) + 1)); }
function aiTick(max) {
  if (!prop('ANTHROPIC_API_KEY')) return 0;
  var all = rows('Reports'), n = 0;
  for (var i = 0; i < all.length && n < max; i++) {
    var rep = parse(all[i].json, {});
    if (rep.ai || rep.aiFailed >= 2) continue;
    if (budgetLeft() <= 0) break;
    try {
      var res = markWithModel(rep);
      rep.ai = res; rep.status = rep.teacher ? rep.status : 'ai';
      update('Reports', all[i]._row, reportRow(rep));
      n++;
    } catch (err) { rep.aiFailed = (rep.aiFailed || 0) + 1; update('Reports', all[i]._row, reportRow(rep)); log('AI fail ' + rep.id + ' ' + err); }
  }
  return n;
}
var TAGS = ['kn-test-facts', 'kn-criteria', 'kn-triage-mode', 'kn-triage-units', 'ta-no-overview', 'ta-overview-figures', 'ta-overview-vague', 'ta-no-data', 'ta-no-comparison', 'ta-mechanical', 'ta-opinion', 'ta-conclusion', 'ta-missing-category', 'ta-inaccurate', 'ta-selection', 'cc-paragraphing', 'cc-grouping', 'cc-linking-overuse', 'cc-reference', 'cc-sequencers', 'lr-copied-rubric', 'lr-register', 'lr-trend-vocab', 'lr-degree', 'lr-compare-vocab', 'lr-proportion', 'lr-approx', 'lr-number-amount', 'lr-process-vocab', 'lr-map-vocab', 'lr-collocation', 'lr-spelling', 'gra-tense', 'gra-prep-figure', 'gra-article', 'gra-plural', 'gra-punctuation', 'gra-complex', 'gra-passive', 'gra-pattern', 'struct-length', 'struct-time'];
function markingPrompt(rep) {
  var gates = [
    'Task Achievement gates: 5→6 overview attempted + details supported with figures; 6→7 overview clear, data categorised, main trends/differences identified, accurate; 7→8 key features skilfully selected and illustrated.',
    'Coherence & Cohesion: 5→6 clear overall progression; 6→7 logical organisation with flexible reference/substitution; 7→8 followed with ease, cohesion invisible, paragraphing apt.',
    'Lexical Resource: 5→6 adequate range; 6→7 some flexibility and precision, collocation awareness, some less common items; 7→8 wide, precise, skilful.',
    'Grammatical Range & Accuracy: 5→6 mix of simple and complex, errors do not impede; 6→7 variety of complex structures, error-free sentences frequent; 7→8 wide range, majority error-free, punctuation controlled.',
    'Deductions: opinion, reasons, conclusion, copied rubric or a missing category → −1 TA; under 150 words → cap TA at 5.'];
  var pre = ((rep.preflight || {}).rows || []).map(function (r) { return '- [' + r.status + '] ' + r.label; }).join('\n');
  return 'You are an IELTS Academic Writing Task 1 examiner and a warm English teacher (T.Chris) at a Thai secondary school. Mark the student report below against the public band descriptors. Walk each criterion up its gates and stop at the first unmet gate.\n\n' +
    gates.join('\n') + '\n\nTHE TASK\n' + (rep.promptDesc || rep.promptId) + '\n\nSTRUCTURAL CHECK (rule-based, for reference)\n' + pre +
    '\n\nSTUDENT REPORT (' + rep.words + ' words, written by ' + (rep.name || 'the student') + ')\n' + rep.text +
    '\n\nReturn ONLY JSON: {"ta":6.0,"cc":6.0,"lr":6.0,"gra":6.0,"overall":6.0,"cefr":"B2","errors":[{"quote":"…","tag":"gra-tense","fix":"…"}],"comment":"…"}. Bands in half steps. "errors": up to five, each quoting the student\'s words, a tag from [' + TAGS.join(', ') + '] and a concrete fix. "comment": 100–150 words in T.Chris\'s voice: open with the student\'s nickname (' + (rep.name || 'the student') + '), a comma, then one specific praise ending with an exclamation mark; quote the student\'s own words in single quotes; state the level plainly ("Your writing is around B1 level"); name error types by grammatical label; give replacement words; pivot with "However," / "Just ensure" / "Also look at" / "Finally,"; frame improvement as the next gate; close warmly. No markdown.';
}
function markWithModel(rep) {
  var models = (prop('CC_MODEL') || 'claude-sonnet-4-6,claude-haiku-4-5-20251001').split(',').map(function (m) { return m.trim(); }).filter(Boolean);
  var first = callClaudeWithRetry(models, markingPrompt(rep));
  var parsed = parseBands(first);
  var res = { bands: { ta: parsed.ta, cc: parsed.cc, lr: parsed.lr, gra: parsed.gra, overall: parsed.overall }, cefr: parsed.cefr, errors: parsed.errors || [], comment: parsed.comment || '', model: models[0], at: new Date().toISOString() };
  if (rep.kind === 'mock') { /* double-marked with moderation: a second independent pass; the teacher sees divergence > 0.5 */
    try { var second = parseBands(callClaudeWithRetry(models, markingPrompt(rep))); res.second = { ta: second.ta, cc: second.cc, lr: second.lr, gra: second.gra, overall: second.overall }; } catch (e) {}
  }
  return res;
}
function parseBands(text) {
  var m = String(text).match(/\{[\s\S]*\}/);
  if (!m) throw new Error('No JSON in model reply');
  var o = JSON.parse(m[0]);
  ['ta', 'cc', 'lr', 'gra'].forEach(function (k) { o[k] = Math.round(parseFloat(o[k]) * 2) / 2; if (isNaN(o[k])) throw new Error('Bad band ' + k); });
  o.overall = Math.round((o.ta + o.cc + o.lr + o.gra) / 4 * 2) / 2;
  return o;
}
function callClaudeWithRetry(models, prompt) {
  var key = prop('ANTHROPIC_API_KEY'), lastErr = null;
  for (var mi = 0; mi < models.length; mi++) {
    for (var attempt = 0; attempt < 2; attempt++) {
      try {
        spend();
        var resp = UrlFetchApp.fetch('https://api.anthropic.com/v1/messages', {
          method: 'post', contentType: 'application/json', muteHttpExceptions: true,
          headers: { 'x-api-key': key, 'anthropic-version': '2023-06-01' },
          payload: JSON.stringify({ model: models[mi], max_tokens: 1200, temperature: 0.2, messages: [{ role: 'user', content: prompt }] })
        });
        var code = resp.getResponseCode(), body = JSON.parse(resp.getContentText() || '{}');
        if (code === 200) return (body.content || []).map(function (c) { return c.text || ''; }).join('');
        lastErr = new Error('HTTP ' + code + ' ' + (body.error && body.error.message));
        if (code === 429 || code >= 500) Utilities.sleep(1500 * (attempt + 1)); else break;
      } catch (e) { lastErr = e; Utilities.sleep(1000); }
    }
  }
  throw lastErr || new Error('Model call failed');
}
