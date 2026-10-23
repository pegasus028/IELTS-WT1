/* ===========================================================================
   QUILLMOOR ACADEMY · THE OBSERVATORY (Chart Control, Task 1) — teacher.js
   (the Staff Room, formerly the Flight Deck). Ported from the Task 2 Staff
   Room in Oct 2026 and re-targeted: charts, TA/CC/LR/GRA, eight chapters,
   the returning (Tutoring) vs new (M4.1) story, the Spellbook summary per
   mode, and Chart Control's AI band estimates (Code.gs CC_tick).
   Class view (stats, House Cup, roster by cohort with chapter and house,
   heat map, module bars, student detail with diagnosis, reports and story
   controls), the marking queue, assignments (owl post) and projector mode.

   Story orders (Oct 2026). "Unlock up to chapter N", "Unlock all chapters"
   and "Re-sort" are stored as ordinary assignment rows through the existing
   `assignments` action, so the back end needed no change:
     { id, ts, kind:'unlock', studentId | cohort, chapter }
     { id, ts, kind:'resort', studentId }
   The student console applies them and never lists them as owl post; this
   console keeps them in their own list, apart from the essays it sets.
   =========================================================================== */
(function () {
  'use strict';
  var C = window.CONTENT, E = window.Engine, P = E.Progress, api = window.API, W = window.Writer, CH = window.Charts;
  var $ = function (s) { return document.querySelector(s); };
  var esc = E.esc;
  var T = { roster: [], reports: [], assignments: [], sel: null, detail: null, q: '', sort: 'ready', dir: -1, cohort: 'all', view: 'class', markSel: null, markFilter: 'queue', proj: null };

  function toast(m) {
    $('#toast-slot').innerHTML = '<div style="position:fixed;left:50%;bottom:22px;transform:translateX(-50%);z-index:100;background:var(--ink);color:var(--ground);padding:11px 18px;border-radius:99px;font-size:.9rem;font-weight:600;box-shadow:var(--shadow-l)">' + esc(m) + '</div>';
    clearTimeout(toast._t); toast._t = setTimeout(function () { $('#toast-slot').innerHTML = ''; }, 2600);
  }
  function pct(x) { return Math.round((x || 0) * 100); }
  function ago(iso) { if (!iso) return '—'; var d = Math.floor((Date.now() - new Date(iso)) / 86400000); return d <= 0 ? 'today' : d === 1 ? 'yesterday' : d < 30 ? d + 'd ago' : new Date(iso).toLocaleDateString(); }
  function mmss(sec) { var m = Math.floor(sec / 60), s = sec % 60; return m + ':' + (s < 10 ? '0' : '') + s; }
  function fmtBand(b) { return b == null ? '—' : (Math.round(b * 2) / 2).toFixed(1); }
  function typeName(t) { return { line: 'Line graph', bar: 'Bar chart', pie: 'Pie chart', table: 'Table', process: 'Process', map: 'Map', mixed: 'Two visuals' }[t] || t; }
  function bandKey(b, k) { return b[k] != null ? b[k] : (k === 'ta' ? b.tr : undefined); }
  function markOf(r) { return r.released && r.teacher && r.teacher.bands ? r.teacher : (r.ai && r.ai.bands ? r.ai : null); }
  function bandsOf(r) { var m = markOf(r); return m ? m.bands : null; }
  /* ielts.org CEFR alignment: 4–5 ≈ B1, 5.5–6.5 ≈ B2, 7–8 ≈ C1, 8.5+ ≈ C2 ("around", never "is"). */
  function cefrOf(b) { return b >= 8.5 ? 'C2' : b >= 7 ? 'C1' : b >= 5.5 ? 'B2' : b >= 4 ? 'B1' : 'below B1'; }

  /* ------------------------------------------------------------ story layer
     House names and colours come from story-content.js when it is loaded;
     the fallback keeps the console working without it. */
  var HOUSES0 = [
    { id: 'compass', name: 'Compass', crit: 'TA', main: '#1F3A5F', accent: '#C0C7D1' },
    { id: 'bridge', name: 'Bridge', crit: 'CC', main: '#1F6F6B', accent: '#B8733A' },
    { id: 'lexicon', name: 'Lexicon', crit: 'LR', main: '#5B2A5E', accent: '#C9A227' },
    { id: 'loom', name: 'Loom', crit: 'GRA', main: '#8E1B2C', accent: '#F1E6CC' }
  ];
  var CHAPTERS0 = ['The Letter', 'The Four-Part Charm', 'The Watchtower', 'The Tide Clock', 'The Hall of Scales', 'The Cellars and the Moor Maps', 'The Library and the Newsroom', 'The Almanac Examination'];
  var NCH = (window.STORY && window.STORY.chapters && window.STORY.chapters.length) || 8;
  function houses() { return (window.STORY && window.STORY.houses && window.STORY.houses.length) ? window.STORY.houses : HOUSES0; }
  function houseOf(id) { return houses().filter(function (h) { return h.id === id; })[0] || null; }
  function chapterTitle(n) { var c = window.STORY && window.STORY.chapters ? window.STORY.chapters.filter(function (x) { return x.n === n; })[0] : null; return c ? c.title : (CHAPTERS0[n - 1] || ''); }
  function storyOf(p) { return (p && p.story) || {}; }
  function houseChip(id) {
    var h = houseOf(id);
    if (!h) return '<span class="hchip none">unsorted</span>';
    return '<span class="hchip" style="background:' + esc(h.main) + ';border-color:' + esc(h.accent) + '">' + esc(h.name) + '</span>';
  }
  function isOrder(a) { return !!a && (a.kind === 'unlock' || a.kind === 'resort'); }
  function orderLabel(a) {
    var who = a.studentId ? 'for ' + a.studentId : a.cohort ? 'for the whole ' + a.cohort + ' cohort' : 'for everyone';
    if (a.kind === 'resort') return 'Re-sort · ' + who + ' · she meets the Sorting Lantern again on her next visit';
    var n = Number(a.chapter) || 0;
    return 'Chapter unlock · up to chapter ' + n + (chapterTitle(n) ? ' (' + chapterTitle(n) + ')' : '') + ' · ' + who;
  }
  function uidO() { return 'U' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5); }
  /* Store a story order through the assignments API (same path as an essay). */
  function sendOrder(row, msg) {
    api.assignments('set', row).then(function (r) {
      if (!r || !r.ok) { toast('Could not save: ' + ((r && r.error) || 'try again')); return; }
      T.assignments = (r && r.assignments) || T.assignments.concat([row]);
      toast(msg);
      paintHouseCup();
      if (T.view === 'assign') paintAssign();
      if (T.sel && row.studentId && row.studentId === T.sel) openStudent(T.sel);
    });
  }
  /* House Cup: house points (story.hp) summed by house, and members, for one cohort. Same sums as the `houses` action. */
  function cupFor(list) {
    var out = { totals: {}, members: {}, unsorted: 0 };
    houses().forEach(function (h) { out.totals[h.id] = 0; out.members[h.id] = 0; });
    list.forEach(function (s) {
      var st = storyOf(s.progress), h = st.house;
      if (!h || out.totals[h] == null) { out.unsorted++; return; }
      var hp = Number(st.hp); if (!isFinite(hp) || hp < 0) hp = 0;
      out.totals[h] += Math.round(hp); out.members[h] += 1;
    });
    return out;
  }

  /* ------------------------------------------------------------- sign in */
  /* WS-B */ /* Assembly.gs (asm.* actions: team points) needs the teacher token; api.js keeps it private, so the
     Assembly reads it from the login reply. */
  if (window.Assembly && window.Assembly.setTeacherToken) { (function () { var tl = api.teacherLogin; api.teacherLogin = function (pin) { return tl.call(api, pin).then(function (r) { if (r && r.ok && r.tt) window.Assembly.setTeacherToken(r.tt); return r; }); }; })(); }
  /* /WS-B */
  try { $('#url').value = api.url || ''; } catch (e) {}
  function enter() {
    var pin = $('#pin').value.trim(), url = $('#url').value.trim();
    if (url !== (api.url || '')) api.setUrl(url);
    api.teacherLogin(pin).then(function (r) {
      if (!r || !r.ok) { var m = $('#gate-msg'); m.classList.remove('hidden'); m.textContent = (r && r.error) || 'Wrong PIN.'; return; }
      $('#gate').classList.add('hidden'); $('#app').classList.remove('hidden');
      paintMode(); load(); checkLink();
    });
  }
  $('#gate-go').addEventListener('click', enter);
  /* Oct 2026: the server asks for the PIN again when the teacher token has expired. */
  api.onTeacherAuth = function () {
    $('#app').classList.add('hidden'); $('#gate').classList.remove('hidden');
    var m = $('#gate-msg'); m.classList.remove('hidden'); m.textContent = 'Your session has ended. Enter the PIN again.';
  };
  $('#pin').addEventListener('keydown', function (e) { if (e.key === 'Enter') enter(); });
  $('#t-out').addEventListener('click', function () { location.reload(); });
  $('#t-refresh').addEventListener('click', function () { load(); toast('Refreshed.'); });
  $('#q').addEventListener('input', function () { T.q = $('#q').value.trim(); paintRoster(); });
  document.querySelectorAll('.tnav button').forEach(function (b) { b.addEventListener('click', function () { showView(b.dataset.view); }); });
  function showView(v) {
    T.view = v;
    ['class', 'marking', 'assign', 'projector'].forEach(function (x) { $('#view-' + x).classList.toggle('hidden', x !== v); });
    document.querySelectorAll('.tnav button').forEach(function (b) { b.classList.toggle('on', b.dataset.view === v); });
    if (v === 'marking') paintMarking();
    if (v === 'assign') paintAssign();
    if (v === 'projector') paintProjectorHome();
  }
  function checkLink() {
    if (!api.url) return;
    api.ping().then(function (r) {
      if (r.ok) { $('#top-sub').textContent = 'Connected · ' + (r.sheet || 'class sheet'); toast('Connected to ' + (r.sheet || 'the class sheet') + '.'); }
      else {
        $('#top-sub').textContent = 'Server not answering — showing local data';
        $('#modebar-slot').innerHTML = '<div class="wrap"><div class="modebar"><span><b>Not connected</b> &nbsp;The class server did not answer, so this is local data only. Check the Apps Script deployment is <em>Execute as: Me</em> and <em>Access: Anyone</em>, and that you deployed a <em>new version</em> after your last edit.' + (r.error ? ' &nbsp;(' + esc(r.error) + ')' : '') + '</span></div></div>';
      }
    });
  }
  function paintMode() {
    $('#top-sub').textContent = api.mode === 'cloud' ? 'Connected to the class sheet' : 'Local data, this browser only';
    $('#modebar-slot').innerHTML = api.mode === 'cloud' ? '' : '<div class="wrap"><div class="modebar"><span><b>Offline</b> &nbsp;Showing data saved in this browser. Add your Apps Script URL on the sign-in screen to read the real class sheet.</span></div></div>';
  }

  /* ---------------------------------------------------------------- load */
  function load() {
    api.roster().then(function (r) {
      T.roster = (r && r.students) || [];
      return api.reports('');
    }).then(function (r) {
      T.reports = ((r && r.reports) || []).slice().sort(function (a, b) { return a.ts < b.ts ? 1 : -1; });
      return api.assignments('list');
    }).then(function (r) {
      T.assignments = (r && r.assignments) || [];
      paintStats(); paintCohorts(); paintHouseCup(); paintRoster(); paintHeat(); paintHeatmap(); paintSystems();
      var q = T.reports.filter(function (x) { return !x.released; }).length;
      $('#nav-queue').textContent = q ? ' (' + q + ')' : '';
      if (T.sel) openStudent(T.sel);
      if (T.view === 'marking') paintMarking();
      if (T.view === 'assign') paintAssign();
    });
  }
  function cohortOf(s) { return (s.progress && s.progress.cohort) || s.cohort || (function () { var r = (typeof ROSTER !== 'undefined' ? ROSTER : []).filter(function (x) { return String(x.id).toLowerCase() === String(s.id).toLowerCase(); })[0]; return r ? r.cohort : ''; })() || 'Other'; }
  /* Oct 2026 (handover item 5): an archived student (test accounts, leavers) is left out of the roster,
     the means and the House Cup. "Show archived" lists them again so they can be restored. */
  function isArchived(s) { return !!(s && s.archived); }
  /* The examiners' verdict from every released mark the Staff Room holds (T.reports), not only the marks
     the student's own device has picked up since (her progress copy lags until she next opens the app). */
  function verdictOf(s) {
    var p = s.progress || P.blank(s.id), reps = [], have = {};
    (p.reports || []).forEach(function (r) { var o = {}, k; for (k in r) o[k] = r[k]; reps.push(o); have[o.id] = o; });
    reportsOf(s.id).filter(function (r) { return r.released && r.teacher && r.teacher.bands; }).forEach(function (r) {
      if (have[r.id]) have[r.id].bands = r.teacher.bands; else reps.push({ id: r.id, ts: r.ts, bands: r.teacher.bands });
    });
    reps.sort(function (a, b) { return String(a.ts || '') < String(b.ts || '') ? -1 : 1; });
    return P.verdictReadiness({ reports: reps });
  }
  function inCohort(s) { return T.cohort === 'all' || cohortOf(s) === T.cohort; }
  function visible() { return T.roster.filter(function (s) { return inCohort(s) && !isArchived(s); }); }
  function archivedList() { return T.roster.filter(function (s) { return inCohort(s) && isArchived(s); }); }
  function reportsOf(id) { return T.reports.filter(function (r) { return r.studentId === id; }); }
  function lastBand(id) { var rs = reportsOf(id).filter(function (r) { return bandsOf(r); }); return rs.length ? bandsOf(rs[0]).overall : null; }

  function paintStats() {
    var list = visible(), n = list.length;
    var active = list.filter(function (s) { return s.progress && s.progress.lastActiveDate && E.daysBetween(s.progress.lastActiveDate, E.today()) <= 7; }).length;
    /* Class readiness: class work only, and only over students who have passed at least one class
       (an account that has not started would pull the mean down without telling you anything). */
    var started = list.filter(function (s) { return P.checksCleared(s.progress || P.blank(s.id)) > 0; });
    var ready = started.length ? Math.round(started.reduce(function (a, s) { return a + P.classReadiness(s.progress || P.blank(s.id)).all; }, 0) / started.length) : 0;
    var judged = list.map(verdictOf).filter(function (v) { return v; });
    var verdict = judged.length ? Math.round(judged.reduce(function (a, v) { return a + v.all; }, 0) / judged.length) : null;
    var ids = {}; list.forEach(function (s) { ids[s.id] = 1; });
    var reps = T.reports.filter(function (r) { return ids[r.studentId]; });
    var marked = reps.filter(function (r) { return bandsOf(r); });
    var mean = marked.length ? marked.reduce(function (a, r) { return a + bandsOf(r).overall; }, 0) / marked.length : 0;
    var queue = reps.filter(function (r) { return !r.released; }).length;
    $('#stats').innerHTML = '<div class="stat"><b>' + n + '</b><span>Students</span></div><div class="stat"><b>' + active + '</b><span>Active this week</span></div><div class="stat" title="Class work only, over the ' + started.length + ' student' + (started.length === 1 ? '' : 's') + ' who have passed at least one class"><b>' + (started.length ? ready + '%' : '—') + '</b><span>Mean class readiness</span></div><div class="stat" title="From marked reports only (band 4 = 0 %, band 8 = 100 %), over ' + judged.length + ' student' + (judged.length === 1 ? '' : 's') + '"><b>' + (verdict == null ? '—' : verdict + '%') + '</b><span>Mean examiners\' verdict</span></div><div class="stat"><b>' + reps.length + '</b><span>Reports written</span></div><div class="stat"><b>' + (marked.length ? fmtBand(mean) : '—') + '</b><span>Mean band' + (queue ? ' · ' + queue + ' to mark' : '') + '</span></div>';
  }
  function paintCohorts() {
    var set = {}; T.roster.forEach(function (s) { set[cohortOf(s)] = 1; });
    var keys = ['all'].concat(Object.keys(set).sort());
    $('#cohorts').innerHTML = keys.map(function (k) { return '<button data-c="' + esc(k) + '"' + (T.cohort === k ? ' class="on"' : '') + '>' + (k === 'all' ? 'All cohorts' : esc(k)) + '</button>'; }).join('');
    $('#cohorts').querySelectorAll('button').forEach(function (b) { b.addEventListener('click', function () { T.cohort = b.dataset.c; paintStats(); paintCohorts(); paintHouseCup(); paintRoster(); paintHeat(); paintHeatmap(); paintSystems(); }); });
  }
  function paintHouseCup() {
    var host = $('#housecup'); if (!host) return;
    var by = {}; T.roster.forEach(function (s) { if (isArchived(s)) return; var c = cohortOf(s); (by[c] || (by[c] = [])).push(s); });
    var keys = T.cohort === 'all' ? Object.keys(by).sort() : [T.cohort];
    if (!keys.length || !Object.keys(by).length) { host.innerHTML = '<p class="tiny">No students yet.</p>'; return; }
    host.innerHTML = keys.map(function (c) {
      var list = by[c] || [], cup = cupFor(list), max = 1;
      houses().forEach(function (h) { max = Math.max(max, cup.totals[h.id]); });
      var order = houses().slice().sort(function (a, b) { return cup.totals[b.id] - cup.totals[a.id]; });
      var canUnlock = c !== 'Other';
      return '<div class="cup"><div class="cup-h"><b>' + esc(c) + '</b><span class="tiny">' + list.length + ' student' + (list.length === 1 ? '' : 's') + (cup.unsorted ? ' · ' + cup.unsorted + ' not sorted yet' : '') + '</span>' +
        (canUnlock ? '<button class="btn sm" data-unlockall="' + esc(c) + '" title="Opens every chapter for every student in this cohort">Unlock all chapters</button>' : '<span class="tiny">No cohort set: unlock these students one at a time.</span>') + '</div>' +
        order.map(function (h) {
          return '<div class="cup-row"><span class="cup-n">' + houseChip(h.id) + '</span><span class="cup-bar"><i style="width:' + Math.round(cup.totals[h.id] / max * 100) + '%;background:' + esc(h.main) + '"></i></span><span class="cup-pts">' + cup.totals[h.id] + ' pts</span><span class="cup-m">' + cup.members[h.id] + ' member' + (cup.members[h.id] === 1 ? '' : 's') + '</span></div>';
        }).join('') + '</div>';
    }).join('') + '<p class="tiny" style="margin-top:6px">House points are worked out from each student\'s progress: 5 per lesson passed, 20 per examiner\'s gate, 2 per fault mended (max 100), 15 per report sent, 25 per report marked at 7.5 or above, 10 per tournament task. Students see only these totals, never names.</p>' +
      /* WS-B */ '<p class="tiny" id="asm-cup"></p>' /* /WS-B */;
    /* WS-B */ /* Assembly team points (Teams sheet) by house, added under the cup; the `houses` action itself is
       untouched until WS-I adds the ASM_houseTotals line to Code.gs (docs/cross-group/WS-B.md). */
    if (window.Assembly && window.Assembly.server) window.Assembly.server('asm.houses', { cohort: T.cohort === 'all' ? '' : T.cohort }).then(function (r) {
      var el = $('#asm-cup'); if (!el || !r || !r.ok || r.local) return; var tot = r.totals || {};
      el.textContent = 'Assembly team points (the Teams sheet), by house: ' + houses().map(function (h) { return h.name + ' ' + (tot[h.id] || 0); }).join(' · ') + (r.rows != null ? ' · ' + r.rows + ' rows' : '') + '.';
    });
    /* /WS-B */
    host.querySelectorAll('[data-unlockall]').forEach(function (b) { b.addEventListener('click', function () {
      var c = b.dataset.unlockall;
      if (!confirm('Unlock all ' + NCH + ' chapters for every student in ' + c + '? The story can then be read in any order.')) return;
      sendOrder({ id: uidO(), ts: new Date().toISOString(), kind: 'unlock', cohort: c, chapter: NCH }, 'All chapters unlocked for ' + c + '.');
    }); });
  }
  var COLS = [{ k: 'name', t: 'Student' }, { k: 'rank', t: 'Classes' }, { k: 'ready', t: 'Class work · TA CC LR GRA' }, { k: 'verdict', t: 'Examiners\' verdict' }, { k: 'chapter', t: 'Chapter' }, { k: 'house', t: 'House' }, { k: 'band', t: 'Last band' }, { k: 'reps', t: 'Reports' }, { k: 'faults', t: 'Faults' }, { k: 'streak', t: 'Candles' }, { k: 'seen2', t: 'Last seen' }, { k: null, t: '' }];
  function paintRoster() {
    var list = T.showArchived ? visible().concat(archivedList()) : visible(), nArch = archivedList().length;
    $('#roster-n').innerHTML = esc(visible().length + ' enrolled') + (nArch ? ' · <button class="linkbtn" id="r-arch">' + (T.showArchived ? 'Hide' : 'Show') + ' ' + nArch + ' archived</button>' : '');
    var ab = $('#r-arch'); if (ab) ab.addEventListener('click', function () { T.showArchived = !T.showArchived; paintRoster(); });
    if (!list.length) { $('#roster').innerHTML = '<tbody><tr><td><div class="empty">No students yet. They appear here as soon as they create an account.</div></td></tr></tbody>'; return; }
    var rows = list.map(function (s) {
      var p = s.progress || P.blank(s.id, s.name), g = P.classReadiness(p), v = verdictOf(s);
      var stale = p.lastActiveDate ? E.daysBetween(p.lastActiveDate, E.today()) : 999, cleared = P.checksCleared(p);
      var flag = (!p.stats || p.stats.seen < 5) ? '<span class="flag new">new</span>' : stale > 7 ? '<span class="flag stall">stalled</span>' : cleared >= 11 ? '<span class="flag fly">soaring</span>' : '';
      var st = storyOf(p);
      return { s: s, p: p, g: g, ready: g.all, v: v, verdict: v ? v.all : -1, arch: isArchived(s), rank: cleared, chapter: Number(st.chapter) || 0, unlockedTo: Number(st.unlockedTo) || 0, house: st.house || '', hp: Number(st.hp) || 0, band: lastBand(s.id) || 0, reps: reportsOf(s.id).length, faults: P.dueReview(p).length, flag: flag, stale: stale };
    });
    if (T.q) { var q = T.q.toLowerCase(); rows = rows.filter(function (r) { return (r.p.displayName || '').toLowerCase().indexOf(q) >= 0 || r.s.id.toLowerCase().indexOf(q) >= 0; }); }
    var key = T.sort, dir = T.dir;
    rows.sort(function (a, b) {
      if (key === 'name') { var x = (a.p.displayName || a.s.id).toLowerCase(), y = (b.p.displayName || b.s.id).toLowerCase(); return x < y ? -dir : x > y ? dir : 0; }
      if (key === 'house') { var hx = a.house || '~', hy = b.house || '~'; return hx < hy ? -dir : hx > hy ? dir : (a.hp - b.hp) * dir; }
      var xv = key === 'seen2' ? -a.stale : key === 'streak' ? (a.p.streak || 0) : a[key] || 0, yv = key === 'seen2' ? -b.stale : key === 'streak' ? (b.p.streak || 0) : b[key] || 0;
      return (xv - yv) * dir;
    });
    var html = '<thead><tr>' + COLS.map(function (c) { if (!c.k) return '<th></th>'; var on = T.sort === c.k; return '<th class="' + (on ? 'on' : '') + '" data-sort="' + c.k + '">' + esc(c.t) + (on ? (dir < 0 ? ' ↓' : ' ↑') : '') + '</th>'; }).join('') + '</tr></thead><tbody>';
    rows.forEach(function (r) {
      html += '<tr class="r' + (T.sel === r.s.id ? ' sel' : '') + (r.arch ? ' arch' : '') + '" data-id="' + esc(r.s.id) + '"><td><div class="who2"><b>' + esc(r.p.displayName || r.s.name) + (r.arch ? ' <span class="flag stall">archived</span>' : '') + '</b><span>' + esc(r.s.id) + ' · ' + esc(cohortOf(r.s)) + '</span></div></td>' +
        '<td>' + r.rank + '/' + C.TOPICS.length + ' <span style="color:var(--ink-3);font-family:var(--f-mono);font-size:.75rem">' + esc(P.rank(r.p).name) + '</span></td>' +
        '<td>' + ['TA', 'CC', 'LR', 'GRA'].map(function (k) { return '<span class="mini' + (k === 'TA' ? ' gold' : '') + '" title="' + k + ' ' + r.g[k] + '%"><i style="width:' + r.g[k] + '%"></i></span>'; }).join('') + ' <span style="font-family:var(--f-mono);font-size:.78rem">' + r.ready + '%</span></td>' +
        '<td>' + (r.v ? '<span title="TA ' + r.v.TA + '% · CC ' + r.v.CC + '% · LR ' + r.v.LR + '% · GRA ' + r.v.GRA + '% (last three marked reports)" style="font-family:var(--f-mono);font-size:.78rem">' + r.v.all + '%</span>' : '<span class="tiny">no marks yet</span>') + '</td>' +
        '<td>' + (r.chapter ? '<span title="' + esc(chapterTitle(r.chapter)) + '">Ch ' + r.chapter + '</span>' + (r.unlockedTo > r.chapter ? ' <span class="tiny">· open to ' + r.unlockedTo + '</span>' : '') : '<span class="tiny">not started</span>') + '</td>' +
        '<td>' + houseChip(r.house) + (r.house ? ' <span class="tiny">' + r.hp + ' pts</span>' : '') + '</td>' +
        '<td class="num">' + (r.band ? fmtBand(r.band) : '—') + '</td><td class="num">' + r.reps + '</td><td class="num">' + r.faults + '</td><td class="num">' + (r.p.streak || 0) + '</td><td>' + esc(ago(r.p.lastActiveDate ? r.p.lastActiveDate + 'T12:00:00' : null)) + '</td><td>' + r.flag + '</td></tr>';
    });
    $('#roster').innerHTML = html + '</tbody>';
    $('#roster').querySelectorAll('tr.r').forEach(function (tr) { tr.addEventListener('click', function () { T.sel = tr.dataset.id; paintRoster(); openStudent(tr.dataset.id); }); });
    $('#roster').querySelectorAll('th[data-sort]').forEach(function (th) { th.addEventListener('click', function () { var k = th.dataset.sort; if (T.sort === k) T.dir = -T.dir; else { T.sort = k; T.dir = k === 'name' || k === 'house' ? 1 : -1; } paintRoster(); }); });
  }
  function tagAgg(list) {
    var agg = {};
    list.forEach(function (s) {
      var by = ((s.progress || {}).stats || {}).byTag || {};
      Object.keys(by).forEach(function (t) { var a = agg[t] || (agg[t] = { a: 0, c: 0 }); a.a += by[t].a; a.c += by[t].c; });
      /* pre-flight reds from reports count as errors too */
      reportsOf(s.id).forEach(function (r) { ((r.preflight || {}).rows || []).forEach(function (row) { if ((row.status === 'bad' || row.capped) && row.tag) { var a2 = agg[row.tag] || (agg[row.tag] = { a: 0, c: 0 }); a2.a += 1; } }); });
    });
    return agg;
  }
  function paintHeat() {
    var agg = tagAgg(visible());
    var rows = Object.keys(agg).map(function (t) { var x = agg[t]; return { tag: t, attempts: x.a, rate: x.a ? 1 - x.c / x.a : 0, name: (C.REMEDIATION[t] || {}).name || t }; }).filter(function (r) { return r.attempts >= 3; });
    rows.sort(function (a, b) { return b.rate - a.rate; }); rows = rows.slice(0, 8);
    if (!rows.length) { $('#heat').innerHTML = '<p class="tiny">Not enough answers yet to show a pattern.</p>'; return; }
    $('#heat').innerHTML = rows.map(function (r) { return '<div class="heat-row"><span>' + esc(r.name) + '</span><span class="heat-bar"><i style="width:' + Math.round(r.rate * 100) + '%"></i></span><span class="heat-n">' + Math.round(r.rate * 100) + '%</span></div>'; }).join('') + '<p class="tiny" style="margin-top:8px">Error rate across the cohort (class answers plus red rows in the Ten Wards), tags with three or more attempts. The top row is the candidate for Monday\'s whole-class lesson.</p>';
  }
  function paintHeatmap() {
    var list = visible().slice(0, 40);
    if (!list.length) { $('#heatmap').innerHTML = ''; return; }
    var tags = Object.keys(C.REMEDIATION).filter(function (t) { return list.some(function (s) { return (((s.progress || {}).stats || {}).byTag || {})[t]; }); });
    if (!tags.length) { $('#heatmap').innerHTML = '<p class="tiny">No answers yet.</p>'; return; }
    var html = '<table><thead><tr><th></th>' + tags.map(function (t) { return '<th class="rot" title="' + esc((C.REMEDIATION[t] || {}).name || t) + '">' + esc((C.REMEDIATION[t] || {}).name || t).slice(0, 26) + '</th>'; }).join('') + '</tr></thead><tbody>';
    list.forEach(function (s) {
      var by = ((s.progress || {}).stats || {}).byTag || {};
      html += '<tr><td class="n">' + esc((s.progress || {}).displayName || s.name || s.id) + '</td>' + tags.map(function (t) {
        var x = by[t]; if (!x || !x.a) return '<td style="background:var(--surface-2)"></td>';
        var rate = 1 - x.c / x.a, a = Math.min(0.85, rate).toFixed(2);
        return '<td style="background:rgba(174,58,34,' + a + ');color:' + (rate > 0.5 ? '#fff' : 'var(--ink)') + '" title="' + esc((C.REMEDIATION[t] || {}).name || t) + ': ' + (x.a - x.c) + ' wrong of ' + x.a + '">' + Math.round(rate * 100) + '</td>';
      }).join('') + '</tr>';
    });
    $('#heatmap').innerHTML = html + '</tbody></table><p class="tiny" style="margin-top:6px">Each cell is that student\'s error rate on that tag. Darker is worse. Empty means not yet attempted.</p>';
  }
  function paintSystems() {
    var list = visible();
    if (!list.length) { $('#sysbars').innerHTML = '<p class="tiny">No data yet.</p>'; return; }
    var rows = C.TOPICS.map(function (t) { return { name: t.code + ' · ' + t.name, pct: Math.round(list.reduce(function (a, s) { return a + P.topicPct(s.progress || P.blank(s.id), t); }, 0) / list.length) }; });
    $('#sysbars').innerHTML = rows.map(function (r) { return '<div class="sysbar"><span>' + esc(r.name) + '</span><span class="sysbar-b"><i style="width:' + r.pct + '%"></i></span><span class="sysbar-n">' + r.pct + '%</span></div>'; }).join('');
  }

  /* ------------------------------------------------------------- student */
  function openStudent(id) {
    api.detail(id).then(function (d) {
      if (!d || !d.ok) { $('#detail').innerHTML = '<div class="empty">Could not load that student.</div>'; return; }
      T.detail = d;
      var p = d.progress || P.blank(id), g = P.gateReadiness(p), weak = P.weakTags(p, 4), strong = P.strongTags(p, 4);
      var reps = reportsOf(id);
      var h = '<div class="panel-h"><div><h2>' + esc(p.displayName || id) + '</h2><span class="kicker">' + esc(id) + ' · ' + esc(P.rank(p).name) + ' · ' + P.checksCleared(p) + '/' + C.TOPICS.length + ' classes · ' + esc(p.cohort || cohortOf({ id: id })) + '</span></div><span class="pill' + (P.accuracy(p) >= 80 ? ' good' : P.accuracy(p) >= 60 ? '' : ' bad') + '">' + P.accuracy(p) + '% accurate</span></div>';
      h += '<div class="gates">' + ['TA', 'CC', 'LR', 'GRA'].map(function (k) { return '<div class="gate"><span>' + k + '</span><b>' + g[k] + '%</b></div>'; }).join('') + '</div>';
      /* Quillmoor story: house, chapter, keepsakes, and the teacher's story orders */
      var sto = storyOf(p), chN = Number(sto.chapter) || 0, unl = Number(sto.unlockedTo) || 0, srt = sto.sort || {};
      var myOrders = T.assignments.filter(function (a) { return isOrder(a) && a.studentId && String(a.studentId).toLowerCase() === String(id).toLowerCase(); });
      var ordered = myOrders.reduce(function (m, a) { return a.kind === 'unlock' ? Math.max(m, Number(a.chapter) || 0) : m; }, 0);
      var defN = Math.min(NCH, Math.max(chN + 1, unl + 1, ordered + 1, 2));
      h += '<details class="disc" open><summary>Quillmoor story<span class="count">' + (sto.house ? esc((houseOf(sto.house) || {}).name || sto.house) + ' · ' : 'unsorted · ') + (chN ? 'chapter ' + chN : 'not started') + ' · ' + (Number(sto.hp) || 0) + ' house pts</span></summary><div class="disc-body" style="padding-top:10px">' +
        '<p class="tiny" style="margin-bottom:8px">' + houseChip(sto.house) + ' &nbsp;' + (chN ? 'Chapter ' + chN + ': ' + esc(chapterTitle(chN)) : 'Has not opened the story yet') + (unl > chN ? ' · unlocked up to chapter ' + unl : '') +
        (sto.returning ? ' · returning (second term)' : ' · new to Quillmoor') + (srt.TA != null ? ' · Sorting: TA ' + srt.TA + ' · CC ' + srt.CC + ' · LR ' + srt.LR + ' · GRA ' + srt.GRA : srt.carried ? ' · house carried over from Task 2' : '') + ((sto.keepsakes || []).length ? ' · keepsakes: ' + esc(sto.keepsakes.join(', ')) : '') + '</p>' +
        '<div class="story-acts"><select id="d-unl-n">' + CHAPTERS0.slice(0, NCH).map(function (x, i) { return i + 1; }).map(function (n) { return '<option value="' + n + '"' + (n === defN ? ' selected' : '') + '>' + n + ' · ' + esc(chapterTitle(n)) + '</option>'; }).join('') + '</select>' +
        '<button class="btn sm" id="d-unl">Unlock up to chapter ' + defN + '</button><button class="btn sm ghost" id="d-resort" title="She meets the Sorting Lantern again on her next visit">Re-sort</button></div>' +
        (myOrders.length ? '<div style="margin-top:8px">' + myOrders.map(function (a) { return '<div class="assignrow order"><div class="grow tiny">' + esc(orderLabel(a)) + ' · set ' + esc(String(a.ts || '').slice(0, 10)) + '</div><button class="btn sm ghost" data-orm="' + esc(a.id) + '">Remove</button></div>'; }).join('') + '</div>' : '') +
        '<p class="tiny" style="margin-top:8px">Unlocks open chapters early; they never lock one. Her progress still decides which gates she has passed.</p></div></details>';
      /* reports */
      h += '<details class="disc" open><summary>Reports<span class="count">' + reps.length + ' written · ' + reps.filter(function (r) { return !r.released; }).length + ' unreleased</span></summary><div class="disc-body" style="padding-top:10px">';
      h += reps.length ? '<div class="replist">' + reps.map(function (r) { var pr = CH.prompt(r.promptId) || {}, b = bandsOf(r); return '<button class="rep" data-open="' + esc(r.id) + '"><span class="rep-t"><span class="rep-n">' + esc(pr.title || r.promptId) + '</span><span class="rep-s">' + esc(String(r.ts).slice(0, 10) + ' · ' + typeName(r.type) + ' · ' + r.words + ' w · ' + mmss(r.seconds || 0) + ' · ' + (r.mode || pr.mode || '') + ' · ' + (r.uiMode || '') + ' · ' + (r.kind || 'practice') + ' · ' + ((r.preflight || {}).bad || 0) + ' red · ' + (r.released ? 'released' : r.teacher ? 'marked, not released' : r.ai ? 'AI estimate' : 'unmarked')) + '</span></span><span class="rep-b">' + (b ? fmtBand(b.overall) : '—') + '</span></button>'; }).join('') + '</div>' : '<p class="tiny">No reports yet.</p>';
      h += '<div style="margin-top:10px"><button class="btn sm" id="d-assign">Set a report for ' + esc(p.displayName || id) + '</button> <button class="btn sm" id="d-print">Print report card</button> <button class="btn sm ghost" id="d-archive" title="Archived students are left out of the roster, the class means and the House Cup. Their data stays on the Sheet.">' + (isArchived(T.roster.filter(function (x) { return String(x.id).toLowerCase() === String(id).toLowerCase(); })[0]) ? 'Restore to the roster' : 'Archive this student') + '</button></div></div></details>';
      /* Spellbook Workshop: lab.js keeps a summary on the progress object; the full
         pages, casts and coaching are in the LabTemplates / LabAttempts tabs. */
      var lab = p.lab;
      if (lab && (lab.points || lab.runs || lab.templatesComplete)) {
        var bys = lab.byShare || {}, bym = lab.byMode || {}, md = lab.modesDesigned || {};
        h += '<details class="disc"><summary>Spellbook Workshop<span class="count">' + (lab.points || 0) + ' pts · ' + (lab.runs || 0) + ' casts · pages: ' + (['TREND', 'COMPARE', 'SEQUENCE', 'SPACE'].filter(function (m) { return md[m]; }).join(', ') || 'none yet') + '</span></summary><div class="disc-body" style="padding-top:10px">' +
          '<table class="roster" style="min-width:0"><thead><tr><th>Mode</th><th>Page saved</th><th>Casts</th><th>Best band</th><th>Data accuracy</th></tr></thead><tbody>' +
          ['TREND', 'COMPARE', 'SEQUENCE', 'SPACE'].map(function (m) { var x = bym[m] || {}; return '<tr><td>' + m + '</td><td>' + (md[m] ? '✓' : '—') + '</td><td>' + (x.n || 0) + '</td><td>' + (x.best != null ? fmtBand(x.best) : '—') + '</td><td>' + (x.acc != null ? Math.round(x.acc * (x.acc <= 1 ? 100 : 1)) + '%' : '—') + '</td></tr>'; }).join('') +
          '</tbody></table><table class="roster" style="min-width:0;margin-top:8px"><thead><tr><th>Template share</th><th>Casts</th><th>Average band</th><th>Best band</th></tr></thead><tbody>' +
          ['60', '50', '40', '30'].map(function (k) { var x = bys[k] || {}; return '<tr><td>' + k + '%</td><td>' + (x.n || 0) + '</td><td>' + (x.rated ? fmtBand(x.sum / x.rated) : '—') + '</td><td>' + (x.best != null ? fmtBand(x.best) : '—') + '</td></tr>'; }).join('') +
          '</tbody></table><p class="tiny" style="margin-top:8px">' + (lab.templatesComplete || 0) + ' page(s) saved. Every line, cast and piece of coaching is in the LabTemplates and LabAttempts tabs of the class sheet.</p></div></details>';
      }
      /* diagnosis */
      h += '<details class="disc" open><summary>Teaching focus<span class="count">' + weak.length + ' areas</span></summary><div class="disc-body">';
      if (!weak.length) h += '<p class="tiny" style="padding-top:10px">No error pattern yet. Once this student has answered twenty or so questions, the weak areas appear here with reteach notes and activities.</p>';
      else {
        h += '<p class="tiny" style="padding:10px 0 14px">Ranked by how much trouble each is actually causing — error rate weighted by frequency.</p>';
        weak.forEach(function (w, i) { var info = w.info; h += '<div class="rep-block"><div class="rep-h"><h4>' + (i + 1) + '. ' + esc(info.name || w.tag) + '</h4><span class="rep-rate">' + w.wrong + ' wrong of ' + w.attempts + ' · ' + Math.round(w.rate * 100) + '% error · gate ' + esc(info.gate || '') + '</span></div><p class="rep-p">' + esc(info.principle || '') + '</p>' + (info.reteach ? '<div class="rep-teach"><b>Say this at the board</b>' + esc(info.reteach) + '</div>' : '') + (info.activities ? '<ul class="rep-acts">' + info.activities.map(function (a) { return '<li>' + esc(a) + '</li>'; }).join('') + '</ul>' : '') + '</div>'; });
      }
      if (strong.length) h += '<div class="rep-block good"><div class="rep-h"><h4>Secure</h4></div><p class="rep-p">' + strong.map(function (s) { return esc(s.info.name || s.tag) + ' (' + Math.round(s.rate * 100) + '%)'; }).join(' · ') + '</p></div>';
      h += '</div></details>';
      /* modules */
      /* Podcasts and videos: who has listened to or watched what (media.js). */
      var withMedia = C.TOPICS.filter(function (x) { return x.podcast || x.video; });
      if (withMedia.length) {
        var md = p.media || {};
        var heard = withMedia.filter(function (x) { var r = md[x.id]; return r && (r.plays || r.videoOpens); }).length;
        h += '<details class="disc"><summary>Castle Wireless &amp; Memory Basin (podcasts and videos)<span class="count">' + heard + ' of ' + withMedia.length + ' opened</span></summary><div class="disc-body" style="padding-top:10px;overflow:auto"><table class="roster" style="min-width:0"><thead><tr><th>Module</th><th>Podcast</th><th>Listened</th><th>Video</th><th>Last</th></tr></thead><tbody>' +
          withMedia.map(function (x) {
            var r = md[x.id] || {}, none = !r.plays && !r.videoOpens;
            return '<tr' + (none ? ' style="background:var(--no-soft)"' : '') + '><td>' + esc(x.code) + ' · ' + esc(x.name) + '</td>' +
              '<td>' + (x.podcast ? (r.done ? '✓ finished' : (r.plays || 0) + ' play' + (r.plays === 1 ? '' : 's')) : '—') + '</td>' +
              '<td>' + (r.seconds ? Math.round(r.seconds / 60) + ' min' : '—') + '</td>' +
              '<td>' + (x.video ? (r.videoOpens ? r.videoOpens + ' open' + (r.videoOpens === 1 ? '' : 's') : '0') : '—') + '</td>' +
              '<td>' + (r.last ? esc(String(r.last).slice(0, 10)) : '—') + '</td></tr>';
          }).join('') + '</tbody></table><p class="tiny" style="margin-top:8px">Rows in red have never been opened. A student stuck on a module who never played its introduction is a different teaching problem from one who did.</p></div></details>';
      }
      h += '<details class="disc"><summary>Classes (modules)<span class="count">' + P.checksCleared(p) + ' passed</span></summary><div class="disc-body" style="padding-top:10px"><div class="sysbars">' + P.systemScores(p).map(function (r) { return '<div class="sysbar"><span>' + esc(r.code) + ' · ' + esc(r.name) + '</span><span class="sysbar-b"><i style="width:' + r.pct + '%"></i></span><span class="sysbar-n">' + r.pct + '%</span></div>'; }).join('') + '</div></div></details>';
      /* log */
      var attempts = (d.attempts || []).filter(function (a) { return a && a.itemId; }).slice().reverse().slice(0, 60);
      h += '<details class="disc"><summary>Answer log<span class="count">' + (d.attempts || []).length + '</span></summary><div class="disc-body" style="padding-top:10px;max-height:340px;overflow:auto"><table class="roster" style="min-width:0"><thead><tr><th>When</th><th>Item</th><th>Tag</th><th>Result</th></tr></thead><tbody>' + attempts.map(function (a) { return '<tr' + (a.correct ? '' : ' style="background:var(--no-soft)"') + '><td>' + esc(String(a.ts).slice(0, 16).replace('T', ' ')) + '</td><td>' + esc(a.itemId) + '</td><td>' + esc((C.REMEDIATION[a.tag] || {}).name || a.tag) + '</td><td>' + (a.correct ? '✓' : '✕ ' + esc(String(a.given || '').slice(0, 60))) + '</td></tr>'; }).join('') + '</tbody></table></div></details>';
      $('#detail').innerHTML = h;
      $('#detail').querySelectorAll('[data-open]').forEach(function (b) { b.addEventListener('click', function () { T.markSel = b.dataset.open; showView('marking'); }); });
      $('#d-assign').addEventListener('click', function () { showView('assign'); $('#a-student').value = id; });
      $('#d-print').addEventListener('click', function () { printCard(id); });
      $('#d-archive').addEventListener('click', function () {
        var row = T.roster.filter(function (x) { return String(x.id).toLowerCase() === String(id).toLowerCase(); })[0];
        var on = !isArchived(row), nm = p.displayName || id;
        if (on && !confirm('Archive ' + nm + '? The account is left out of the roster, the class means and the House Cup. Nothing is deleted, and "Show archived" on the roster brings it back.')) return;
        api.archiveStudent(id, on).then(function (r) {
          if (!r || !r.ok) { toast((r && r.error) || 'Not saved. Try again.'); return; }
          if (row) row.archived = on ? (r.archived || 'yes') : '';
          if (on) { T.sel = null; $('#detail').innerHTML = '<div class="empty">' + esc(nm) + ' is archived. "Show archived" on the roster lists the account again.</div>'; }
          toast(on ? nm + ' archived.' : nm + ' is back on the roster.');
          paintStats(); paintHouseCup(); paintRoster(); paintHeat(); paintHeatmap(); paintSystems();
          if (!on) openStudent(id);
        });
      });
      var nameOf = p.displayName || id;
      $('#d-unl-n').addEventListener('change', function () { $('#d-unl').textContent = 'Unlock up to chapter ' + $('#d-unl-n').value; });
      $('#d-unl').addEventListener('click', function () {
        var n = parseInt($('#d-unl-n').value, 10) || 1;
        sendOrder({ id: uidO(), ts: new Date().toISOString(), kind: 'unlock', studentId: id, chapter: n }, 'Chapters up to ' + n + ' unlocked for ' + nameOf + '.');
      });
      $('#d-resort').addEventListener('click', function () {
        if (!confirm('Re-sort ' + nameOf + '? She will take the Sorting again on her next visit and may join a different house.')) return;
        sendOrder({ id: uidO(), ts: new Date().toISOString(), kind: 'resort', studentId: id }, nameOf + ' will be re-sorted on her next visit.');
      });
      $('#detail').querySelectorAll('[data-orm]').forEach(function (b) { b.addEventListener('click', function () { removeOrder(b.dataset.orm); }); });
    });
  }

  /* ------------------------------------------------------------- marking */
  function paintMarking() {
    var list = T.reports.filter(function (r) { return T.markFilter === 'all' || (T.markFilter === 'queue' ? !r.released : r.released); });
    if (T.cohort !== 'all') { var ids = {}; visible().forEach(function (s) { ids[s.id] = 1; }); list = list.filter(function (r) { return ids[r.studentId]; }); }
    var html = '<div class="panel-h"><h2>Marking</h2><div class="filters" style="margin:0">' + ['queue', 'released', 'all'].map(function (k) { return '<button data-mf="' + k + '"' + (T.markFilter === k ? ' class="on"' : '') + '>' + k + '</button>'; }).join('') + '<button id="mk-ai-all" title="Ask the server to run the AI estimate on every unmarked report">AI estimate all</button></div></div>';
    html += '<div class="mark"><div class="card panel"><div class="replist">' + (list.length ? list.map(function (r) { var pr = CH.prompt(r.promptId) || {}, b = bandsOf(r); return '<button class="rep' + (T.markSel === r.id ? ' sel' : '') + '" data-mk="' + esc(r.id) + '"><span class="rep-t"><span class="rep-n">' + esc(r.name || r.studentId) + ' — ' + esc(pr.title || r.promptId) + '</span><span class="rep-s">' + esc(String(r.ts).slice(0, 10) + ' · ' + typeName(r.type) + ' · ' + r.words + ' w · ' + ((r.preflight || {}).bad || 0) + ' red · ' + (r.kind || 'practice') + ' · ' + (r.released ? 'released' : r.teacher ? 'marked' : r.ai ? 'AI estimate' : 'unmarked')) + '</span></span><span class="rep-b">' + (b ? fmtBand(b.overall) : '—') + '</span></button>'; }).join('') : '<div class="empty">Nothing here.</div>') + '</div></div><div class="card panel" id="mk-detail"><div class="empty">Pick a report.</div></div></div>';
    $('#view-marking').innerHTML = html;
    $('#view-marking').querySelectorAll('[data-mf]').forEach(function (b) { b.addEventListener('click', function () { T.markFilter = b.dataset.mf; paintMarking(); }); });
    $('#view-marking').querySelectorAll('[data-mk]').forEach(function (b) { b.addEventListener('click', function () { T.markSel = b.dataset.mk; paintMarking(); }); });
    $('#mk-ai-all').addEventListener('click', function () { api.markReport('*', { requestAi: true }).then(function (r) { toast(r && r.ok ? 'AI marking queued on the server. Refresh in a minute.' : 'The server did not accept that (AI marking needs the Apps Script backend with an API key, redeployed as a new version).'); }); });
    if (T.markSel) paintMarkDetail(T.markSel);
  }
  function paintMarkDetail(id) {
    var r = T.reports.filter(function (x) { return x.id === id; })[0];
    if (!r) return;
    var pr = CH.prompt(r.promptId) || {}, host = $('#mk-detail');
    var pre = r.preflight || {};
    var tb = (r.teacher && r.teacher.bands) || (r.ai && r.ai.bands) || {};
    var opts = function (v) { var o = ''; for (var b = 4; b <= 9; b += 0.5) o += '<option value="' + b + '"' + (Math.abs((v || 0) - b) < 0.01 ? ' selected' : '') + '>' + b.toFixed(1) + '</option>'; return '<option value="">—</option>' + o; };
    var h = '<div class="panel-h"><div><h2>' + esc(r.name || r.studentId) + '</h2><span class="kicker">' + esc(pr.title || r.promptId) + ' · ' + esc(String(r.ts).slice(0, 16).replace('T', ' ')) + ' · ' + r.words + ' words in ' + mmss(r.seconds || 0) + (r.timedOut ? ' (time out)' : '') + ' · ' + (r.uiMode || '') + (r.revision ? ' · revised once' : '') + '</span></div><span class="pill ' + (pre.bad ? 'bad' : 'good') + '">' + (pre.bad || 0) + ' red · ' + (pre.warn || 0) + ' amber</span></div>';
    h += '<div id="mk-chart"></div>';
    h += W.paragraphs(r.text).map(function (t) { return '<div class="mpara">' + esc(t).replace(/\b(\d[\d,.]*%?)/g, '<span class="num">$1</span>') + '</div>'; }).join('');
    if (r.firstText) h += '<details class="disc"><summary>First draft (before revision)</summary><div class="disc-body" style="padding-top:10px">' + W.paragraphs(r.firstText).map(function (t) { return '<div class="mpara">' + esc(t) + '</div>'; }).join('') + '</div></details>';
    h += '<details class="disc"><summary>The Ten Wards (structure rows)<span class="count">' + ((pre.rows || []).length) + '</span></summary><div class="disc-body" style="padding-top:10px">' + (pre.rows || []).map(function (row) { return '<div class="pf-row ' + row.status + '">' + esc(row.label) + '</div>'; }).join('') + '</div></details>';
    if (r.plan && (r.plan.mode || r.plan.groupA || r.plan.big || (r.plan.picks || []).length || r.plan.spellbook)) {
      var pl = r.plan, cal = pl.calibration;
      h += '<details class="disc"><summary>The plan<span class="count">' + (pl.mode ? 'mode ' + esc(pl.mode) + (pl.mode === pr.mode ? ' ✓' : ' ✕ (' + esc(pr.mode) + ')') : 'no mode named') + (cal ? ' · Landing Check ' + cal.agree + '/' + cal.of + ' honest' : '') + '</span></summary><div class="disc-body" style="padding-top:10px"><ul class="bc-list">' +
        (pl.spellbook ? '<li><b>Written from her spellbook page</b> — ' + esc(pl.spellbook.mode) + (pl.spellbook.version ? ' v' + esc(pl.spellbook.version) : '') + '</li>' : '') +
        (pl.big ? '<li><b>Big picture</b> — ' + esc(pl.big) + '</li>' : '') + (pl.groupA ? '<li><b>Group A</b> — ' + esc(pl.groupA) + '</li>' : '') + (pl.groupB ? '<li><b>Group B</b> — ' + esc(pl.groupB) + '</li>' : '') +
        ((pl.picks || []).length ? '<li><b>Figures picked</b> — ' + esc(pl.picks.join(' · ')) + '</li>' : '') + '</ul></div></details>';
    }
    if (r.ai) h += '<details class="disc" open><summary>AI estimate<span class="count">' + (r.ai.bands ? fmtBand(r.ai.bands.overall) + ' · TA ' + fmtBand(bandKey(r.ai.bands, 'ta')) + ' · CC ' + fmtBand(r.ai.bands.cc) + ' · LR ' + fmtBand(r.ai.bands.lr) + ' · GRA ' + fmtBand(r.ai.bands.gra) : '—') + (r.ai.second ? ' · second pass ' + fmtBand(r.ai.second.overall) + (Math.abs(r.ai.second.overall - r.ai.bands.overall) > 0.5 ? ' ⚠ divergent' : '') : '') + '</span></summary><div class="disc-body" style="padding-top:10px">' + ((r.ai.ceilings || []).length ? '<p class="tiny"><b>Ceilings applied:</b> ' + esc(r.ai.ceilings.join('; ')) + '</p>' : '') + (r.ai.nextGate ? '<p class="tiny"><b>Next gate:</b> ' + esc(r.ai.nextGate) + '</p>' : '') + (r.ai.comment ? '<div class="aibox">' + esc(r.ai.comment) + '</div>' : '') + (r.ai.errors ? '<div class="errs">' + r.ai.errors.map(function (e) { var rem = C.REMEDIATION[e.tag] || {}; return '<div class="err"><b>' + esc(rem.name || e.tag) + '</b><q>' + esc(e.quote) + '</q> → ' + esc(e.fix) + '</div>'; }).join('') + '</div>' : '') + '<p class="tiny" style="margin-top:8px"><label><input type="checkbox" id="mk-aivis"' + (r.aiVisible ? ' checked' : '') + '> Let the student see this estimate before I release my mark</label></p></div></details>';
    h += '<div class="panel-h" style="margin-top:14px"><h2>Your mark</h2><span class="tiny">Half bands. Overall = average of the four.</span></div><div class="bands">' + ['ta', 'cc', 'lr', 'gra'].map(function (k) { return '<div class="band"><select id="mk-' + k + '">' + opts(bandKey(tb, k)) + '</select><span>' + k.toUpperCase() + '</span></div>'; }).join('') + '<div class="band"><b id="mk-overall">' + (tb.overall ? fmtBand(tb.overall) : '—') + '</b><span>Overall · <i id="mk-cefr">' + (tb.overall ? cefrOf(tb.overall) : '') + '</i></span></div></div>';
    h += '<textarea class="comment" id="mk-comment" placeholder="Nickname, then one specific praise! Quote their words in single quotes. State the level plainly (Your writing is around B1 level.). Name the error types. However, … Just ensure … Also look at … Finally, … the next band. Warm close.">' + esc((r.teacher && r.teacher.comment) || (r.ai && r.ai.comment) || '') + '</textarea>';
    h += '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:10px"><button class="btn" id="mk-save">Save mark</button><button class="btn primary" id="mk-release">Save and release to student</button>' + (r.released ? '<button class="btn ghost" id="mk-unrelease">Withdraw</button>' : '') + '<button class="btn ghost" id="mk-copyprompt" title="Copy the marking prompt to paste into Claude">Copy AI prompt</button></div>';
    host.innerHTML = h;
    function bands() {
      var out = {}, sum = 0, n = 0;
      ['ta', 'cc', 'lr', 'gra'].forEach(function (k) { var v = parseFloat($('#mk-' + k).value); if (!isNaN(v)) { out[k] = v; sum += v; n++; } });
      if (n === 4) { out.overall = Math.round(sum / 4 * 2) / 2; $('#mk-overall').textContent = fmtBand(out.overall); $('#mk-cefr').textContent = cefrOf(out.overall); }
      return n === 4 ? out : null;
    }
    ['ta', 'cc', 'lr', 'gra'].forEach(function (k) { $('#mk-' + k).addEventListener('change', bands); });
    CH.render($('#mk-chart'), pr, { compact: true });
    function save(release) {
      var b = bands();
      if (!b) { toast('Set all four bands first.'); return; }
      var mark = { teacher: { bands: b, cefr: cefrOf(b.overall), comment: $('#mk-comment').value.trim(), at: new Date().toISOString() }, released: !!release, status: release ? 'released' : 'marked' };
      var vis = $('#mk-aivis'); if (vis) mark.aiVisible = vis.checked;
      api.markReport(id, mark).then(function (res) {
        if (!res || !res.ok) { toast('Could not save.'); return; }
        Object.keys(mark).forEach(function (k) { r[k] = mark[k]; });
        toast(release ? 'Released. The student will see it in her Report Card.' : 'Saved.'); paintMarking(); paintStats();
      });
    }
    $('#mk-save').addEventListener('click', function () { save(false); });
    $('#mk-release').addEventListener('click', function () { save(true); });
    var un = $('#mk-unrelease'); if (un) un.addEventListener('click', function () { api.markReport(id, { released: false, status: 'marked' }).then(function (res) { if (!res || !res.ok) { toast('Could not withdraw: ' + ((res && res.error) || 'try again')); return; } r.released = false; toast('Withdrawn.'); paintMarking(); }); });
    $('#mk-copyprompt').addEventListener('click', function () {
      var txt = W.markingPrompt(pr, r.text, { rows: (pre.rows || []).map(function (x) { return { status: x.status, label: x.label }; }) }, r.name);
      try { navigator.clipboard.writeText(txt); toast('Marking prompt copied — paste it into Claude.'); } catch (e) { prompt('Copy this prompt', txt); }
    });
    var vis2 = $('#mk-aivis'); if (vis2) vis2.addEventListener('change', function () { api.markReport(id, { aiVisible: vis2.checked }).then(function (res) { if (!res || !res.ok) { toast('Could not save: ' + ((res && res.error) || 'try again')); vis2.checked = !vis2.checked; return; } r.aiVisible = vis2.checked; toast(vis2.checked ? 'Estimate visible to the student.' : 'Estimate hidden.'); }); });
  }

  /* --------------------------------------------------------- assignments */
  function paintAssign() {
    var cohorts = {}; T.roster.forEach(function (s) { cohorts[cohortOf(s)] = 1; });
    var essays = T.assignments.filter(function (a) { return !isOrder(a); }), orders = T.assignments.filter(isOrder);
    var h = '<div class="panel-h"><h2>Assignments (owl post)</h2></div><div class="grid"><div class="card panel form">' +
      '<div class="row"><div><label>Who</label><select id="a-cohort"><option value="all">Everyone</option>' + Object.keys(cohorts).sort().map(function (c) { return '<option value="' + esc(c) + '">' + esc(c) + '</option>'; }).join('') + '</select></div><div><label>Or one student</label><select id="a-student"><option value="">—</option>' + T.roster.map(function (s) { return '<option value="' + esc(s.id) + '">' + esc((s.progress || {}).displayName || s.name || s.id) + '</option>'; }).join('') + '</select></div></div>' +
      '<div class="row"><div><label>Chart</label><select id="a-prompt"><option value="random">Random of the kind below</option>' + C.PROMPTS.map(function (p) { return '<option value="' + p.id + '">' + esc(p.title) + ' · ' + typeName(p.type) + ' · ' + p.mode + ' · ' + p.level + '</option>'; }).join('') + '</select></div><div><label>Mode (for random)</label><select id="a-type"><option value="any">Any</option>' + ['TREND', 'COMPARE', 'SEQUENCE', 'SPACE'].map(function (t) { return '<option value="' + t + '">' + t + '</option>'; }).join('') + '</select></div><div><label>Level (for random)</label><select id="a-level"><option value="any">Any</option><option>A2</option><option>B1</option><option>B2</option><option>C1</option></select></div></div>' +
      '<div class="row"><div><label>Mode</label><select id="a-ui"><option value="spellbook">Spellbook (her own page, slots to fill)</option><option value="guided">Guided (boxes + pattern cards)</option><option value="exam">Exam (blank page)</option></select></div><div><label>Timer</label><select id="a-timed"><option value="20">20 minutes</option><option value="25">25 minutes</option><option value="30">30 minutes</option><option value="0">Untimed</option></select></div><div><label>Due</label><input type="date" id="a-due"></div></div>' +
      '<div><label>Title</label><input type="text" id="a-title" placeholder="e.g. Week 8 — timed pie charts, exam mode" style="width:100%"></div><div><label>Note to the student</label><input type="text" id="a-note" placeholder="Optional" style="width:100%"></div>' +
      '<div><button class="btn primary" id="a-set">Set assignment</button></div></div>' +
      '<div class="card panel"><div class="panel-h"><h2>Open assignments</h2><span class="tiny">students see these as owl post</span></div><div id="a-list">' + (essays.length ? essays.slice().reverse().map(function (a) {
        var pr = CH.prompt(a.promptId) || {}; var done = T.reports.filter(function (r) { return r.assignmentId === a.id; }).length;
        return '<div class="assignrow"><div class="grow"><b>' + esc(a.title || pr.title || a.id) + '</b><div class="tiny">' + esc((a.studentId ? 'for ' + a.studentId : a.cohort === 'all' ? 'everyone' : a.cohort) + ' · ' + (pr.title || '') + ' · ' + (a.uiMode || 'guided') + ' · ' + (a.timed === false ? 'untimed' : (a.minutes || 20) + ' min') + (a.due ? ' · due ' + a.due : '') + ' · ' + done + ' submitted') + '</div></div><button class="btn sm" data-rm="' + esc(a.id) + '">Remove</button></div>';
      }).join('') : '<p class="tiny">None yet.</p>') + '</div>' +
      '<div class="panel-h" style="margin-top:16px"><h2>Story orders</h2><span class="tiny">chapter unlocks and re-sorts · applied quietly, never shown as owl post</span></div><div id="o-list">' + (orders.length ? orders.slice().reverse().map(function (a) {
        return '<div class="assignrow order"><div class="grow"><b>' + (a.kind === 'resort' ? 'Re-sort' : 'Chapter unlock') + '</b><div class="tiny">' + esc(orderLabel(a)) + ' · set ' + esc(String(a.ts || '').slice(0, 10)) + '</div></div><button class="btn sm" data-orm="' + esc(a.id) + '">Remove</button></div>';
      }).join('') : '<p class="tiny">None. Use the Quillmoor story panel of a student, or "Unlock all chapters" in the House Cup.</p>') + '</div></div></div>';
    $('#view-assign').innerHTML = h;
    $('#a-set').addEventListener('click', function () {
      var pid = $('#a-prompt').value;
      if (pid === 'random') {
        var pool = C.PROMPTS.filter(function (p) { return ($('#a-type').value === 'any' || p.mode === $('#a-type').value) && ($('#a-level').value === 'any' || p.level === $('#a-level').value); });
        if (!pool.length) { toast('No prompt matches.'); return; }
        pid = pool[Math.floor(Math.random() * pool.length)].id;
      }
      var mins = parseInt($('#a-timed').value, 10);
      var row = { id: 'A' + Date.now().toString(36), ts: new Date().toISOString(), cohort: $('#a-cohort').value, studentId: $('#a-student').value, promptId: pid, uiMode: $('#a-ui').value, timed: mins > 0, minutes: mins || 0, due: $('#a-due').value, title: $('#a-title').value.trim(), note: $('#a-note').value.trim() };
      api.assignments('set', row).then(function (r) { T.assignments = (r && r.assignments) || T.assignments.concat([row]); toast('Assignment set.'); paintAssign(); });
    });
    $('#view-assign').querySelectorAll('[data-orm]').forEach(function (b) { b.addEventListener('click', function () { removeOrder(b.dataset.orm); }); });
    $('#view-assign').querySelectorAll('[data-rm]').forEach(function (b) { b.addEventListener('click', function () { api.assignments('remove', { id: b.dataset.rm }).then(function (r) { T.assignments = (r && r.assignments) || T.assignments.filter(function (a) { return a.id !== b.dataset.rm; }); paintAssign(); }); }); });
  }

  /* A removed unlock stops applying to students who have not yet opened the
     app since it was set; one already applied stays applied on their side. */
  function removeOrder(oid) {
    api.assignments('remove', { id: oid }).then(function (r) {
      T.assignments = (r && r.assignments) || T.assignments.filter(function (a) { return a.id !== oid; });
      toast('Order removed.');
      paintHouseCup(); if (T.view === 'assign') paintAssign(); if (T.sel) openStudent(T.sel);
    });
  }

  /* ----------------------------------------------------------- projector */
  var GAMES = [
    { id: 'overview', name: 'Overview or Not', blurb: 'Teams write an overview for the chart in 3 minutes. Judge each one: general? two or three truths? no figures?' },
    { id: 'numbers', name: 'Number Hunt', blurb: 'Four minutes: as many correct claim + number sentences as possible. One point each; a wrong figure loses the point.' },
    { id: 'twice', name: 'Twice As Much', blurb: 'Comparison sentences only: than, as … as, times, respectively. One pattern per round.' },
    { id: 'group', name: 'Group Them!', blurb: 'Teams post the two groups for the body paragraphs and one sentence on why. Juno\'s rule: group, then describe.' },
    { id: 'passive', name: 'Passive Chain', blurb: 'Each team posts the next stage of the process in the passive. Break the chain on an error.' },
    { id: 'fix', name: 'Fix the Band 6', blurb: 'Show the Band 6 contrast script; teams post the upgraded overview, then the upgraded detail paragraph.' }
  ];
  function paintProjectorHome() {
    /* WS-B */ /* Assembly v2: game → round → chart, timed rounds, auto-marks, team points (assembly.js). The old
       text-only projector below stays as the fallback when assembly.js is not loaded. */
    if (window.Assembly && window.Assembly.paintHome) { window.Assembly.paintHome($('#view-projector'), { api: api, host: $('#projector'), say: toast }); return; }
    /* /WS-B */
    $('#view-projector').innerHTML = '<div class="panel-h"><h2>Projector mode</h2><span class="tiny">Full screen for the classroom. Students post from their console at <b>index.html#live</b> with the round code.</span></div>' +
      '<div class="card panel form"><div class="row"><div><label>Game</label><select id="pj-game">' + GAMES.map(function (g) { return '<option value="' + g.id + '">' + esc(g.name) + '</option>'; }).join('') + '</select></div><div><label>Prompt</label><select id="pj-prompt">' + C.PROMPTS.map(function (p) { return '<option value="' + p.id + '">' + esc(p.title) + ' · ' + typeName(p.type) + ' · ' + p.mode + '</option>'; }).join('') + '</select></div><div><label>Minutes</label><input type="number" id="pj-min" value="3" min="1" max="20" style="width:80px"></div></div><div><button class="btn primary" id="pj-go">Open projector</button></div>' +
      '<div style="margin-top:10px">' + GAMES.map(function (g) { return '<div class="tiny"><b>' + esc(g.name) + '</b> — ' + esc(g.blurb) + '</div>'; }).join('') + '</div></div>';
    $('#pj-go').addEventListener('click', function () { openProjector($('#pj-game').value, $('#pj-prompt').value, parseInt($('#pj-min').value, 10) || 3); });
  }
  function openProjector(gameId, promptId, minutes) {
    var g = GAMES.filter(function (x) { return x.id === gameId; })[0], pr = CH.prompt(promptId);
    var round = { round: 'L' + Math.random().toString(36).slice(2, 6).toUpperCase(), game: gameId, promptId: promptId, t0: Date.now(), minutes: minutes };
    T.proj = { round: round, posts: [], scores: {}, tick: null };
    api.projector('clear', {}).then(function () { api.projector('post', { kind: 'round', round: round.round, game: gameId, promptId: promptId, minutes: minutes, ts: new Date().toISOString() }); });
    var host = $('#projector'); host.classList.remove('hidden');
    host.innerHTML = '<div class="proj-top"><h1>' + esc(g.name) + '</h1><span class="projcode" title="Students enter this code">' + round.round + '</span><span class="tiny">' + esc(g.blurb) + '</span><span class="proj-clock" id="pj-clock">' + mmss(minutes * 60) + '</span><button class="btn" id="pj-close">Close</button></div>' +
      '<div class="proj-grid"><div><div id="pj-chart"></div>' + (gameId === 'fix' ? '<div class="card panel" id="pj-script"></div>' : '') + '<div class="card panel"><h2 style="font-size:1rem;margin-bottom:8px">Scoreboard</h2><ul class="board" id="pj-board"><li class="tiny">No points yet.</li></ul></div></div><div><h2 style="font-size:1rem;margin-bottom:8px">Posts <span class="tiny" id="pj-n"></span></h2><div class="proj-posts" id="pj-posts"><div class="empty">Waiting for teams…</div></div></div></div>';
    CH.render($('#pj-chart'), pr, { compact: false });
    if (gameId === 'fix') { var m = C.MODELS.filter(function (x) { return x.contrast && x.promptId === promptId; })[0] || C.MODELS.filter(function (x) { return x.contrast; })[0]; if (m) $('#pj-script').innerHTML = '<p class="kicker">The Band ' + esc(m.contrast.band) + ' script</p>' + m.contrast.paragraphs.map(function (pg) { return '<div class="mpara">' + esc(pg.text) + '</div>'; }).join(''); }
    $('#pj-close').addEventListener('click', function () { clearInterval(T.proj.tick); host.classList.add('hidden'); T.proj = null; });
    var end = Date.now() + minutes * 60000;
    T.proj.tick = setInterval(function () {
      var left = Math.max(0, Math.round((end - Date.now()) / 1000));
      var c = $('#pj-clock'); if (c) { c.textContent = mmss(left); c.classList.toggle('low', left <= 30); }
      if (Date.now() % 4000 < 1000) pollPosts();
    }, 1000);
    pollPosts();
  }
  function pollPosts() {
    if (!T.proj) return;
    api.projector('list', { round: T.proj.round.round }).then(function (r) {
      if (!T.proj) return;
      var posts = ((r && r.posts) || []).filter(function (p) { return p.kind === 'post' && p.round === T.proj.round.round; });
      var seen = {}; T.proj.posts.forEach(function (p) { seen[p.id] = 1; });
      posts.forEach(function (p) { if (!seen[p.id]) T.proj.posts.push(p); });
      paintPosts();
    });
  }
  function paintPosts() {
    var host = $('#pj-posts'); if (!host) return;
    var posts = T.proj.posts;
    $('#pj-n').textContent = posts.length ? posts.length + ' posted' : '';
    host.innerHTML = posts.length ? posts.slice().reverse().map(function (p, i) {
      return '<div class="post' + (p.win ? ' win' : '') + '" data-id="' + esc(p.id) + '"><span class="pn">#' + (posts.length - i) + (p.revealed ? ' ' + esc(p.team) : '') + '</span><span class="grow">' + esc(p.text) + '</span><span class="vote"><button class="btn sm" data-pt="' + esc(p.id) + '" data-v="1">+1</button><button class="btn sm ghost" data-pt="' + esc(p.id) + '" data-v="-1">−1</button><button class="btn sm ghost" data-rv="' + esc(p.id) + '">who?</button></span></div>';
    }).join('') : '<div class="empty">Waiting for teams…</div>';
    host.querySelectorAll('[data-pt]').forEach(function (b) { b.addEventListener('click', function () {
      var p = posts.filter(function (x) { return x.id === b.dataset.pt; })[0]; if (!p) return;
      T.proj.scores[p.team] = (T.proj.scores[p.team] || 0) + parseInt(b.dataset.v, 10); if (b.dataset.v === '1') p.win = true; paintBoard(); paintPosts();
    }); });
    host.querySelectorAll('[data-rv]').forEach(function (b) { b.addEventListener('click', function () { var p = posts.filter(function (x) { return x.id === b.dataset.rv; })[0]; if (p) { p.revealed = true; paintPosts(); } }); });
  }
  function paintBoard() {
    var s = T.proj.scores, keys = Object.keys(s).sort(function (a, b) { return s[b] - s[a]; });
    $('#pj-board').innerHTML = keys.length ? keys.map(function (k, i) { return '<li><span>' + (i + 1) + '. ' + esc(k) + '</span><b>' + s[k] + '</b></li>'; }).join('') : '<li class="tiny">No points yet.</li>';
  }

  /* ------------------------------------------------------------ exports */
  function csv(rows) { return rows.map(function (r) { return r.map(function (c) { var s = String(c == null ? '' : c); if (/^[=+\-@\t\r]/.test(s) && !/^-?\d+(\.\d+)?$/.test(s)) s = "'" + s; return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; }).join(','); }).join('\n'); }
  function download(name, text) { var a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([text], { type: 'text/csv' })); a.download = name; a.click(); }
  $('#t-csv').addEventListener('click', function () {
    var rows = [['Student ID', 'Name', 'Cohort', 'Classes passed', 'TA', 'CC', 'LR', 'GRA', 'Class readiness %', 'Examiners\' verdict %', 'Archived', 'Accuracy %', 'Reports', 'Last band', 'Best band', 'Candles (streak)', 'Last active', 'House', 'Chapter', 'House points', 'Returning', 'Spellbook pages']];
    T.roster.forEach(function (s) { var p = s.progress || P.blank(s.id), g = P.gateReadiness(p), cr = P.classReadiness(p), vr = verdictOf(s), st = storyOf(p), md = (p.lab && p.lab.modesDesigned) || {}; rows.push([s.id, p.displayName || s.name, cohortOf(s), P.checksCleared(p), g.TA, g.CC, g.LR, g.GRA, cr.all, vr ? vr.all : '', isArchived(s) ? 'yes' : '', P.accuracy(p), reportsOf(s.id).length, lastBand(s.id) || '', p.bestBand || '', p.streak || 0, p.lastActiveDate || '', st.house || '', st.chapter || '', st.hp || 0, st.returning ? 'yes' : 'no', Object.keys(md).filter(function (k) { return md[k]; }).join(' ')]); });
    rows.push([]); rows.push(['Report ID', 'Student', 'Date', 'Chart', 'Type', 'Mode', 'Writer mode', 'Kind', 'Words', 'Seconds', 'Red', 'Amber', 'TA', 'CC', 'LR', 'GRA', 'Overall', 'CEFR', 'Released', 'Comment']);
    T.reports.forEach(function (r) { var b = bandsOf(r) || {}, m = markOf(r) || {}; rows.push([r.id, r.studentId, String(r.ts).slice(0, 10), r.promptId, r.type, r.mode || '', r.uiMode || '', r.kind, r.words, r.seconds, (r.preflight || {}).bad, (r.preflight || {}).warn, bandKey(b, 'ta'), b.cc, b.lr, b.gra, b.overall, b.overall ? cefrOf(b.overall) : '', r.released ? 'yes' : 'no', m.comment || '']); });
    download('observatory-task1-' + E.today() + '.csv', csv(rows));
  });
  /* Blooket import: Question, Answer 1-4, Time, Correct answers */
  $('#t-blooket').addEventListener('click', function () {
    var rows = [['Question Text', 'Answer 1', 'Answer 2', 'Answer 3', 'Answer 4', 'Time Limit (sec) (Max: 300 seconds)', 'Correct Answer(s) (Only include Answer #)']];
    C.TOPICS.forEach(function (t) { t.levels[0].subs.forEach(function (s) { s.items.forEach(function (it) {
      if (it.type !== 'choose' || it.chart || !it.options || it.options.length < 3) return;
      var opts = it.options.map(function (o) { return E.stripTags(o); }).slice(0, 4);
      while (opts.length < 4) opts.push('');
      rows.push([E.stripTags(it.stem), opts[0], opts[1], opts[2], opts[3], 20, it.answer + 1]);
    }); }); });
    download('observatory-task1-blooket.csv', csv(rows));
    toast(rows.length - 1 + ' questions exported for Blooket import.');
  });
  function printCard(id) {
    var s = T.roster.filter(function (x) { return x.id === id; })[0]; if (!s) return;
    var p = s.progress || P.blank(id), g = P.gateReadiness(p), reps = reportsOf(id).filter(function (r) { return r.released && r.teacher; });
    var h = '<div class="pg"><h2>Quillmoor Academy · The Observatory — IELTS Writing Task 1 report card</h2><div class="meta">' + esc(p.displayName || id) + ' · ' + esc(id) + ' · ' + esc(cohortOf(s)) + ' · ' + E.today() + '</div>' +
      '<table><tr><th>Classes passed</th><th>TA</th><th>CC</th><th>LR</th><th>GRA</th><th>Best band</th></tr><tr><td>' + P.checksCleared(p) + '/' + C.TOPICS.length + '</td><td>' + g.TA + '%</td><td>' + g.CC + '%</td><td>' + g.LR + '%</td><td>' + g.GRA + '%</td><td>' + (p.bestBand ? fmtBand(p.bestBand) : '—') + '</td></tr></table>';
    reps.forEach(function (r) { var pr = CH.prompt(r.promptId) || {}, b = r.teacher.bands; h += '<h2 style="font-size:13pt">' + esc(pr.title) + ' · ' + esc(String(r.ts).slice(0, 10)) + '</h2><table><tr><th>TA</th><th>CC</th><th>LR</th><th>GRA</th><th>Overall</th><th>CEFR</th></tr><tr><td>' + fmtBand(bandKey(b, 'ta')) + '</td><td>' + fmtBand(b.cc) + '</td><td>' + fmtBand(b.lr) + '</td><td>' + fmtBand(b.gra) + '</td><td>' + fmtBand(b.overall) + '</td><td>' + esc(r.teacher.cefr || '') + '</td></tr></table><p>' + esc(r.teacher.comment || '') + '</p>'; });
    $('#printable').innerHTML = h + '</div>';
    window.print();
  }
})();
