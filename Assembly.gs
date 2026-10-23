/* ===========================================================================
   QUILLMOOR ACADEMY · THE OBSERVATORY — Assembly.gs  (WS-B, Assembly v2)
   Back end of the in-class team games (assembly.js). Add this as a THIRD
   script file in the same Apps Script project as Code.gs and Lab.gs
   (File → + → Script → "Assembly"). Additive: Code.gs and Lab.gs are untouched
   except for the ONE dispatch line below.

   SET-UP (once)
   1. Paste this file as Assembly.gs.
   2. In Code.gs, inside doPost, add ONE line straight after the LAB-HOOK line
      (before the lock) — the ASM-HOOK:
        if (String(req.action || '').indexOf('asm.') === 0) return out(ASM_handle(req.action, req.payload || {}));
      It sends every action that starts with "asm." here. Assembly.gs uses
      isTeacher(), student(), findStudent(), rows(), parse(), denied() and
      log() from Code.gs.
   3. Optional (House Cup): in Code.gs `houses()`, before `return { ok: true, cohort …`, add
        try { var asm = ASM_houseTotals(want); HOUSE_IDS.forEach(function (h) { totals[h] += asm[h] || 0; }); } catch (e) {}
      so the students' House Cup shows the Assembly team points too. Without it the
      Staff Room still shows them as a separate line under the cup.
   4. Deploy → Manage deployments → pencil → New version → Deploy.
      Saving alone does not update the live /exec endpoint.

   SHEET  Teams (created on first use): one row per student per posted round
     ts · round (code) · game (gameId) · lesson (L1…) · team · studentId · points · by
   The round posts themselves stay in the existing Projector sheet (the
   `projector` action in Code.gs); this file only banks the points.

   ACTIONS
     asm.ping    → { ok, sheet, rows }
     asm.points  teacher · { rows:[{ts, round, game, lesson, team, studentId, points}] } → { ok, n }
                 Rows are de-duplicated on round + studentId + game: posting a round twice does not double the points.
     asm.tally   teacher · {} → { ok, rows, byStudent, byTeam, byGame, total }
                 student · { studentId, token } → { ok, rows (hers), mine, byGame (hers) }
     asm.houses  anyone · { cohort } → { ok, totals:{compass,bridge,lexicon,loom}, rows }  (totals only, no names)
   =========================================================================== */

var ASM_SHEETS = { Teams: ['ts', 'round', 'game', 'lesson', 'team', 'studentId', 'points', 'by'] };
var ASM_MAX_ROWS = 400;   /* rows per asm.points call */

function ASM_handle(action, p) {
  try {
    p = p || {};
    if (action === 'asm.ping') return { ok: true, sheet: 'Teams', rows: Math.max(0, ASM_sheet_('Teams').getLastRow() - 1) };
    var T = isTeacher(p);
    switch (action) {
      case 'asm.points': return T ? ASM_points_(p) : denied();
      case 'asm.tally': return ASM_tally_(p, T);
      case 'asm.houses': return { ok: true, cohort: String(p.cohort || ''), totals: ASM_houseTotals(String(p.cohort || '')), rows: Math.max(0, ASM_sheet_('Teams').getLastRow() - 1) };
    }
    return { ok: false, error: 'Unknown action ' + action };
  } catch (err) {
    try { log('ASM ERR ' + action + ' ' + err); } catch (e) {}
    return { ok: false, error: String(err) };
  }
}

function ASM_sheet_(name) {
  var ss = SpreadsheetApp.getActive(), sh = ss.getSheetByName(name);
  if (!sh) { sh = ss.insertSheet(name); sh.appendRow(ASM_SHEETS[name]); sh.setFrozenRows(1); }
  return sh;
}
function ASM_rows_(name) {
  var sh = ASM_sheet_(name), n = sh.getLastRow();
  if (n < 2) return [];
  var head = ASM_SHEETS[name], data = sh.getRange(2, 1, n - 1, head.length).getValues();
  return data.map(function (r, i) { var o = { _row: i + 2 }; head.forEach(function (h, j) { o[h] = r[j]; }); return o; });
}
function ASM_num_(v) { var n = Number(v); return isFinite(n) ? n : 0; }

/* Teacher posts a round's points: one row per student. Same round + game + student = already posted. */
function ASM_points_(p) {
  var rows = (p.rows || []).slice(0, ASM_MAX_ROWS), have = {}, n = 0, skipped = 0;
  if (!rows.length) return { ok: false, error: 'No rows.' };
  ASM_rows_('Teams').forEach(function (r) { have[String(r.round) + '|' + String(r.game) + '|' + String(r.studentId).toLowerCase()] = 1; });
  var sh = ASM_sheet_('Teams'), out = [];
  rows.forEach(function (r) {
    if (!r || !r.studentId || !r.round) return;
    var key = String(r.round).slice(0, 20) + '|' + String(r.game || '').slice(0, 40) + '|' + String(r.studentId).toLowerCase().slice(0, 40);
    if (have[key]) { skipped++; return; }
    have[key] = 1;
    var pts = Math.max(-50, Math.min(50, Math.round(ASM_num_(r.points))));
    out.push([String(r.ts || new Date().toISOString()).slice(0, 40), String(r.round).slice(0, 20), String(r.game || '').slice(0, 40), String(r.lesson || '').slice(0, 10), String(r.team || '').slice(0, 40), String(r.studentId).toLowerCase().slice(0, 40), pts, 'teacher']);
    n++;
  });
  if (out.length) sh.getRange(sh.getLastRow() + 1, 1, out.length, ASM_SHEETS.Teams.length).setValues(out);
  log('asm.points ' + n + ' rows' + (skipped ? ' (' + skipped + ' already posted)' : ''));
  return { ok: true, n: n, skipped: skipped };
}

function ASM_tally_(p, T) {
  var all = ASM_rows_('Teams'), sid = null;
  if (!T) {
    var s = student(p);
    if (!s) return { ok: false, error: 'Not signed in.' };
    sid = String(s.id).toLowerCase();
    all = all.filter(function (r) { return String(r.studentId).toLowerCase() === sid; });
  }
  var byStudent = {}, byTeam = {}, byGame = {}, total = 0;
  all.forEach(function (r) {
    var pts = ASM_num_(r.points), id = String(r.studentId).toLowerCase();
    byStudent[id] = (byStudent[id] || 0) + pts; byTeam[r.team] = (byTeam[r.team] || 0) + pts; byGame[r.game] = (byGame[r.game] || 0) + pts; total += pts;
  });
  var rows = all.map(function (r) { return { ts: r.ts, round: r.round, game: r.game, lesson: r.lesson, team: r.team, studentId: r.studentId, points: ASM_num_(r.points) }; });
  if (!T) return { ok: true, rows: rows, mine: byStudent[sid] || 0, byGame: byGame };
  return { ok: true, rows: rows, byStudent: byStudent, byTeam: byTeam, byGame: byGame, total: total };
}

/* Assembly points per house for one cohort (all when none): the student's house comes from
   her progress (story.house), as `houses()` in Code.gs reads it. Totals only, never names. */
function ASM_houseTotals(cohort) {
  var want = String(cohort || '').trim().toLowerCase(), houseOf = {}, totals = { compass: 0, bridge: 0, lexicon: 0, loom: 0 };
  rows('Students').forEach(function (s) {
    var prog = parse(s.progress, null);
    if (!prog || typeof prog !== 'object' || s.archived) return;
    var coh = String(prog.cohort || s.cohort || '').trim().toLowerCase();
    if (want && coh !== want) return;
    var h = String((prog.story || {}).house || '').toLowerCase();
    if (totals.hasOwnProperty(h)) houseOf[String(s.id).toLowerCase()] = h;
  });
  ASM_rows_('Teams').forEach(function (r) { var h = houseOf[String(r.studentId).toLowerCase()]; if (h) totals[h] += ASM_num_(r.points); });
  return totals;
}
