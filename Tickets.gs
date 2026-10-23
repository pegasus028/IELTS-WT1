/* ===========================================================================
   QUILLMOOR ACADEMY · THE OBSERVATORY — Tickets.gs  (WS-C, Oct 2026)
   Back end of the Tickets room (tickets.js): launch quizzes and exit tickets
   for EN31208 Variety of Writing 2, and the Participation ledger's reads.
   Add this file to the same Apps Script project as Code.gs and Lab.gs
   (File → + → Script → "Tickets"). ADDITIVE: nothing in Code.gs changes
   except ONE hook line.

   SET-UP (once)
   1. Paste this file as Tickets.gs.
   2. In Code.gs, inside doPost, straight after the LAB-HOOK line (before the
      lock), add the TICKETS-HOOK:
        if (String(req.action || '').indexOf('tickets.') === 0) return out(TICKETS_handle(req.action, req.payload || {}));
      Ticket reads run outside the global lock (a class of thirty polling a
      live grid must not queue the saves); the two writes take a short lock
      of their own.
   3. Deploy → Manage deployments → pencil → New version → Deploy.
      Saving alone does not update the live /exec endpoint.

   Sheets created on first use:
     TicketSets    — one row per code ever opened: code, lesson, state (open|closed), openedAt, closedAt, by, json.
                     The row with code '_LEDGER' holds the Participation ledger's module overrides (json).
     TicketResults — one row per finished ticket: ts, code, lesson, studentId, name, cohort, score, n, seconds,
                     hinted, tags, json. A student who sits a code twice (a reload mid-quiz) adds a row; the
                     Staff Room reads the latest per student + code.
   Ticket answers themselves are ordinary Attempts rows (mode 'ticket',
   topic = the code, itemId vw2-…), written by Code.gs save(); the live grid
   reads the tail of Attempts.
   Teams sheet (written by WS-B's Assembly, read here for team missions):
     header  ts | cohort | team | kind | studentId | points | game | round | json
     kind 'member' rows name a team's students; kind 'points' rows add points
     to a team (ts inside the half). Any extra columns are passed through.

   Actions (all answer {ok, …}):
     tickets.status   student token or teacher  → { sets: { CODE: {code, lesson, state, openedAt, closedAt} } }
     tickets.open     teacher  {code, lesson}     → { sets }
     tickets.close    teacher  {code}             → { sets }
     tickets.done     student  {code, lesson, score, n, seconds, hinted, tags[], name, cohort} → { ok }
     tickets.results  teacher                     → { results: [rows] }
     tickets.live     teacher  {code}             → { rows: [Attempts rows with mode 'ticket' and topic code] }
     tickets.config   teacher  {set?, config}     → { config }   (ledger module overrides)
     tickets.teams    teacher                     → { sheet: bool, rows: [Teams rows as objects] }
   Uses from Code.gs: SHEETS, sheet(), isTeacher(), findStudent(), denied(), log(), parse().
   =========================================================================== */

var TK_SHEETS = {
  TicketSets: ['code', 'lesson', 'state', 'openedAt', 'closedAt', 'by', 'json'],
  TicketResults: ['ts', 'code', 'lesson', 'studentId', 'name', 'cohort', 'score', 'n', 'seconds', 'hinted', 'tags', 'json']
};
var TK_LIVE_TAIL = 900;   /* Attempts rows read for a live grid (30 students × 8 items × a margin) */

function TICKETS_handle(action, p) {
  try {
    p = p || {};
    var T = isTeacher(p), s = T ? null : TK_student_(p);
    if (!T && !s) return { ok: false, error: 'Not signed in. Log out and in again.' };
    switch (action) {
      case 'tickets.status': return { ok: true, sets: TK_sets_() };
      case 'tickets.open': return T ? TK_setState_(p.code, 'open', p.lesson) : denied();
      case 'tickets.close': return T ? TK_setState_(p.code, 'closed', p.lesson) : denied();
      case 'tickets.done': return s ? TK_done_(s, p) : denied();
      case 'tickets.results': return T ? { ok: true, results: TK_rows_('TicketResults') } : denied();
      case 'tickets.live': return T ? { ok: true, rows: TK_live_(p.code) } : denied();
      case 'tickets.config': return T ? TK_config_(p) : denied();
      case 'tickets.teams': return T ? TK_teams_() : denied();
    }
    return { ok: false, error: 'Unknown action ' + action };
  } catch (err) {
    try { log('TICKETS ' + action + ' ' + err); } catch (e) {}
    return { ok: false, error: String(err && err.message || err) };
  }
}

/* ------------------------------------------------------------ helpers */
/* Same rule as Lab.gs: the student must exist and send her own token. */
function TK_student_(p) {
  if (!p || !p.studentId) return null;
  var s = findStudent(p.studentId);
  if (!s || !p.token || !s.token || String(p.token) !== String(s.token)) return null;
  return s;
}
function TK_sheet_(name) {
  var ss = SpreadsheetApp.getActive(), sh = ss.getSheetByName(name);
  if (!sh) { sh = ss.insertSheet(name); sh.appendRow(TK_SHEETS[name]); sh.setFrozenRows(1); }
  return sh;
}
function TK_rows_(name) {
  var sh = TK_sheet_(name), n = sh.getLastRow(), head = TK_SHEETS[name];
  if (n < 2) return [];
  return sh.getRange(2, 1, n - 1, head.length).getValues().map(function (r, i) { var o = { _row: i + 2 }; head.forEach(function (h, j) { o[h] = r[j]; }); return o; });
}
function TK_code_(c) { c = String(c || '').toUpperCase().replace(/\s+/g, ''); return /^[QE]\d{2}$/.test(c) ? c : ''; }
function TK_sets_() {
  var out = {};
  TK_rows_('TicketSets').forEach(function (r) { if (r.code && String(r.code).charAt(0) !== '_') out[r.code] = { code: r.code, lesson: r.lesson, state: r.state, openedAt: r.openedAt, closedAt: r.closedAt }; });
  return out;
}
function TK_findRow_(sh, code) {
  if (sh.getLastRow() < 2) return 0;
  var hit = sh.getRange(2, 1, sh.getLastRow() - 1, 1).createTextFinder(String(code)).matchEntireCell(true).findNext();
  return hit ? hit.getRow() : 0;
}
function TK_lock_(fn) {
  var lock = LockService.getScriptLock();
  lock.waitLock(8000);
  try { return fn(); } finally { lock.releaseLock(); }
}
function TK_setState_(code, state, lesson) {
  code = TK_code_(code);
  if (!code) return { ok: false, error: 'A code is one letter and two digits, like E01.' };
  var now = new Date().toISOString();
  TK_lock_(function () {
    var sh = TK_sheet_('TicketSets'), row = TK_findRow_(sh, code);
    if (!row) { sh.appendRow([code, String(lesson || ''), state, state === 'open' ? now : '', state === 'closed' ? now : '', 'teacher', '']); return; }
    var head = TK_SHEETS.TicketSets, cur = sh.getRange(row, 1, 1, head.length).getValues()[0];
    cur[2] = state;
    if (state === 'open') { cur[3] = cur[3] || now; cur[4] = ''; }
    if (state === 'closed') cur[4] = now;
    if (lesson) cur[1] = String(lesson);
    sh.getRange(row, 1, 1, head.length).setValues([cur]);
  });
  return { ok: true, sets: TK_sets_() };
}
function TK_done_(s, p) {
  var code = TK_code_(p.code);
  if (!code) return { ok: false, error: 'Code needed.' };
  var row = { ts: new Date().toISOString(), code: code, lesson: String(p.lesson || '').slice(0, 4), studentId: s.id, name: String(p.name || s.name || '').slice(0, 60), cohort: String(p.cohort || s.cohort || '').slice(0, 30),
    score: Number(p.score) || 0, n: Number(p.n) || 0, seconds: Number(p.seconds) || 0, hinted: Number(p.hinted) || 0, tags: (p.tags || []).slice(0, 12).map(String).join(' '), json: '' };
  row.json = JSON.stringify({ timeUp: !!p.timeUp, tags: (p.tags || []).slice(0, 12) });
  TK_lock_(function () { var sh = TK_sheet_('TicketResults'); sh.appendRow(TK_SHEETS.TicketResults.map(function (h) { return row[h] == null ? '' : row[h]; })); });
  return { ok: true };
}
/* The tail of Attempts, ticket rows for one code only. Reads only; no lock. */
function TK_live_(code) {
  code = TK_code_(code); if (!code) return [];
  var sh = sheet('Attempts'), head = SHEETS.Attempts, n = sh.getLastRow();
  if (n < 2) return [];
  var start = Math.max(2, n - TK_LIVE_TAIL + 1), data = sh.getRange(start, 1, n - start + 1, head.length).getValues(), out = [];
  var iMode = head.indexOf('mode'), iTopic = head.indexOf('topic');
  data.forEach(function (r) {
    if (String(r[iMode]) !== 'ticket' || String(r[iTopic]) !== code) return;
    var o = {}; head.forEach(function (h, j) { o[h] = r[j]; });
    delete o.given; delete o.expected;
    out.push(o);
  });
  return out;
}
function TK_config_(p) {
  var sh = TK_sheet_('TicketSets'), head = TK_SHEETS.TicketSets;
  if (p.set) {
    var json = JSON.stringify(p.config || {}).slice(0, 20000);
    TK_lock_(function () {
      var row = TK_findRow_(sh, '_LEDGER');
      if (!row) sh.appendRow(['_LEDGER', '', 'config', '', '', 'teacher', json]);
      else sh.getRange(row, head.length).setValue(json);
    });
    return { ok: true, config: p.config || {} };
  }
  var row = TK_findRow_(sh, '_LEDGER');
  return { ok: true, config: row ? parse(sh.getRange(row, head.length).getValue(), null) : null };
}
/* WS-B's Teams sheet, read generically by its header row so extra columns pass through. */
function TK_teams_() {
  var sh = SpreadsheetApp.getActive().getSheetByName('Teams');
  if (!sh || sh.getLastRow() < 1) return { ok: true, sheet: !!sh, rows: [] };
  var head = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0].map(String), n = sh.getLastRow();
  if (n < 2) return { ok: true, sheet: true, rows: [] };
  var rows = sh.getRange(2, 1, n - 1, head.length).getValues().map(function (r) { var o = {}; head.forEach(function (h, j) { if (h) o[h] = r[j]; }); return o; });
  return { ok: true, sheet: true, rows: rows.slice(-2000) };
}
