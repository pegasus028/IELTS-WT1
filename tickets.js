/* ===========================================================================
   QUILLMOOR ACADEMY · THE OBSERVATORY — tickets.js  (WS-C, Oct 2026)
   Lesson tickets for EN31208 Variety of Writing 2 (M4.1, Fridays period 3):
     · the LAUNCH QUIZ  (code Qnn: 8 items in 4 minutes, start of a lesson)
     · the EXIT TICKET  (code Enn: 5 items in 3 minutes, end of a lesson)
   and the PARTICIPATION LEDGER (15 pts per half = module mastery 5 + exit
   tickets 5 + team missions 5; cut-offs 18 Dec 2026 and 12 Feb 2027).

   Student side (index.html): window.Tickets.mount(host, PCHost) paints the
   Tickets room — enter the code on the slide, answer the timed set, see the
   result. Items are the app's own item types rendered by Engine.mount; a
   wrong first answer shows the hint and allows one more try; every item posts
   one attempt row (itemId vw2-…, mode 'ticket', topic = the set code) and
   updates stats.byTag, so the Staff Room heat maps see ticket answers too.
   Staff side (teacher.html): window.Tickets.staff.mount(host, ctx) paints the
   Tickets panel (open / close a code, completion, live grid, heat map by tag)
   and the Participation ledger (per cohort, per student, CSV).
   Pure helpers (set resolution, the ledger maths) have no DOM so that
   tools/tickets-test.js can run them in Node.

   Content: window.TICKETS_CONTENT (tickets-content.js, generated from WS-D's
   vw2-items.json by tools/tickets-build.js). A set may name an existing bank
   item by id: resolved from tickets-content first, then Engine.Bank.
   Backend: Tickets.gs (actions tickets.*), reached by the TICKETS-HOOK line in
   Code.gs doPost. Without a server (demo / smoke) a local store in
   localStorage cc.tickets.v1 answers the same actions.
   ES5 only (no arrows, let/const, template literals).
   =========================================================================== */
(function (global) {
  'use strict';
  var TC = global.TICKETS_CONTENT || { version: '', sets: {}, items: [], prompts: [], teams: [] };
  var LS_STORE = 'cc.tickets.v1', LS_CFG = 'cc.ledger.cfg.v1';

  /* ------------------------------------------------------------ calendar
     Lesson dates and the week each module is set as homework (Homework & app
     map tab, 23 Oct 2026). "Set to date" = set date <= today, unless T.Chris
     ticks or unticks the module in the ledger panel. New modules (m15+) have
     no date here and count only when ticked. */
  var LESSON_DATES = { L1: '2026-10-30', L2: '2026-11-13', L3: '2026-11-27', L4: '2026-12-04', L5: '2026-12-18', L6: '2027-01-08', L7: '2027-01-15', L8: '2027-01-22', L9: '2027-01-29', L10: '2027-02-05', L11: '2027-02-12' };
  var MODULE_SET = { m00: '2026-10-30', m01: '2026-10-30', m02: '2026-11-13', m03: '2026-11-13', m04: '2026-11-20', m05: '2026-11-20', m06: '2026-11-27', m07: '2026-12-04', m08: '2027-01-08', m09: '2027-01-15', m10: '2027-01-22', m11: '2027-01-22', m12: '2027-01-29', m13: '2027-02-05', m14: '2027-02-05' };
  var HALVES = { H1: { from: '2026-10-01', to: '2026-12-18', label: 'Half 1 · to 18 Dec' }, H2: { from: '2026-12-19', to: '2027-02-12', label: 'Half 2 · to 12 Feb' } };
  var RULES = { Q: { minutes: 4, n: 8, name: 'Launch quiz' }, E: { minutes: 3, n: 5, name: 'Exit ticket' } };
  var PASS_CHECK = 0.75;
  var TZ_MS = 7 * 3600000;
  function today() { return new Date(Date.now() + TZ_MS).toISOString().slice(0, 10); }
  function halfOf(date) { if (!date) return ''; if (date <= HALVES.H1.to) return 'H1'; if (date <= HALVES.H2.to) return 'H2'; return ''; }
  function currentHalf(d) { return (d || today()) <= HALVES.H1.to ? 'H1' : 'H2'; }

  /* --------------------------------------------------------------- items */
  var ITEMS = {};
  (TC.items || []).forEach(function (it) { ITEMS[it.id] = it; });
  /* The WS-D charts a ticket needs that prompts*.js does not hold yet. Pushed once, only if missing. */
  function ensurePrompts() {
    var C = global.CONTENT; if (!C || !C.PROMPTS) return;
    (TC.prompts || []).forEach(function (p) { if (!C.PROMPTS.some(function (q) { return q.id === p.id; })) C.PROMPTS.push(p); });
  }
  ensurePrompts();
  function resolve(id) {
    if (ITEMS[id]) return ITEMS[id];
    var E = global.Engine; return E && E.Bank && E.Bank.item(id) || null;
  }
  function codeInfo(code) {
    code = String(code || '').toUpperCase().replace(/\s+/g, '');
    var m = code.match(/^([QE])(\d{2})$/); if (!m) return null;
    var kind = m[1], lesson = 'L' + parseInt(m[2], 10), r = RULES[kind];
    return { code: code, kind: kind, kindName: r.name, lesson: lesson, n: r.n, minutes: r.minutes, date: LESSON_DATES[lesson] || '', half: halfOf(LESSON_DATES[lesson] || '') };
  }
  function setOf(code) {
    var info = codeInfo(code); if (!info || !TC.sets[info.code]) return null;
    var items = [], missing = [];
    TC.sets[info.code].forEach(function (id) { var it = resolve(id); if (it) items.push(it); else missing.push(id); });
    return { info: info, items: items, missing: missing };
  }
  function codes() {
    return Object.keys(TC.sets).map(codeInfo).filter(Boolean).sort(function (a, b) {
      var la = parseInt(a.lesson.slice(1), 10), lb = parseInt(b.lesson.slice(1), 10);
      return la - lb || (a.kind === 'Q' ? -1 : 1);
    });
  }
  function attemptId(item) { return /^vw2-/.test(item.id) ? item.id : 'vw2-' + item.id; }
  function remName(tag) { var C = global.CONTENT; return (C && C.REMEDIATION && C.REMEDIATION[tag] && C.REMEDIATION[tag].name) || tag || ''; }

  /* --------------------------------------------------------------- ledger
     ledger(students, opts) → { half, modulesSet, ticketsSet, rows, teamNote }
       students: [{ id, name, cohort, progress }] (the Staff Room's visible list)
       opts: { half: 'H1'|'H2', today, config: {H1:{on:[],off:[]},H2:{…}}, topics: CONTENT.TOPICS,
               sets: {code:{state,openedAt}}, results: [TicketResults rows], teams: [Teams sheet rows] }
     Module mastery 5 = module gates passed (check best >= 75 %) of the modules set in the half.
     Exit tickets 5 = exit tickets completed (p.tickets[code] or a TicketResults row) of those set in the half
       (set = lesson date reached, or opened by T.Chris).
     Team missions 5 = the student's equal share of her team's points in the half (Teams sheet, WS-B),
       scaled so the best share in the cohort = 5. No Teams rows → 0 and a note. */
  function modulesSet(topics, half, cfg, day) {
    var h = (cfg && cfg[half]) || { on: [], off: [] }, H = HALVES[half];
    return (topics || []).filter(function (t) {
      if ((h.off || []).indexOf(t.id) >= 0) return false;
      if ((h.on || []).indexOf(t.id) >= 0) return true;
      var d = MODULE_SET[t.id]; if (!d) return false;
      return d <= day && d >= H.from && d <= H.to;
    }).map(function (t) { return t.id; });
  }
  function ticketsSet(half, sets, day) {
    var H = HALVES[half];
    return codes().filter(function (c) {
      if (c.kind !== 'E') return false;
      var opened = sets && sets[c.code] && sets[c.code].openedAt;
      if (c.date && (c.date < H.from || c.date > H.to)) return false;
      return !!(opened || (c.date && c.date <= day));
    }).map(function (c) { return c.code; });
  }
  function modulePassed(p, t) {
    var lv = t.levels && t.levels[0], ck = lv && lv.check && p && p.checks && p.checks[lv.check.id];
    return !!(ck && ck.best >= PASS_CHECK);
  }
  function teamOf(s, teamRows, defaults) {
    var sid = String(s.id || '').toLowerCase(), hit = null;
    (teamRows || []).forEach(function (r) {
      var k = String(r.kind || '');
      /* WS-C shape: kind 'member'. WS-B shape (Assembly.gs): no kind, one row per student per posted round. */
      if ((k === 'member' || (!k && r.studentId && r.team)) && String(r.studentId || '').toLowerCase() === sid) hit = String(r.team || '');
    });
    if (hit) return hit;
    var nm = String((s.progress && s.progress.displayName) || s.name || '').toLowerCase().trim();
    for (var i = 0; i < (defaults || []).length; i++) {
      var mm = defaults[i].members.map(function (x) { return String(x).toLowerCase(); });
      if (mm.indexOf(nm) >= 0) return defaults[i].team;
    }
    return '';
  }
  function ledger(students, opts) {
    opts = opts || {};
    var half = opts.half || currentHalf(opts.today), day = opts.today || today(), H = HALVES[half];
    var topics = opts.topics || (global.CONTENT && global.CONTENT.TOPICS) || [];
    var mods = modulesSet(topics, half, opts.config, day), tks = ticketsSet(half, opts.sets, day);
    var byId = {}; topics.forEach(function (t) { byId[t.id] = t; });
    var done = {};
    (opts.results || []).forEach(function (r) { done[String(r.studentId || '').toLowerCase() + '|' + r.code] = r; });
    var teamRows = opts.teams || [], totals = {}, members = {}, anyPoints = false, mine = {}, anyMine = false;
    var rows = students.map(function (s) {
      var p = s.progress || {}, tm = teamOf(s, teamRows, TC.teams);
      if (tm) members[tm] = (members[tm] || 0) + 1;
      var passed = mods.filter(function (id) { return modulePassed(p, byId[id]); });
      var completed = tks.filter(function (code) { return !!((p.tickets && p.tickets[code]) || done[String(s.id).toLowerCase() + '|' + code]); });
      return { id: s.id, name: p.displayName || s.name || s.id, cohort: s.cohort || p.cohort || '', team: tm,
        modulesPassed: passed, modulesN: mods.length, modulesPts: mods.length ? Math.round(50 * passed.length / mods.length) / 10 : 0,
        ticketsDone: completed, ticketsN: tks.length, ticketsPts: tks.length ? Math.round(50 * completed.length / tks.length) / 10 : 0,
        share: 0, teamPts: 0, total: 0 };
    });
    /* Two row shapes (docs/cross-group/WS-I.md §b):
       WS-C: kind 'points' = points for a TEAM in the half, shared equally among its members.
       WS-B (Assembly.gs, the shape actually written): no kind, ts · round · game · lesson · team · studentId · points
       = that round's team points credited to each member who was there, so a student's share is her own sum. */
    teamRows.forEach(function (r) {
      var k = String(r.kind || ''), pts = Number(r.points) || 0;
      var d = String(r.ts || r.date || '').slice(0, 10); if (d && (d < H.from || d > H.to)) return;
      if (!pts) return;
      if (k === 'points') { anyPoints = true; totals[String(r.team || '')] = (totals[String(r.team || '')] || 0) + pts; return; }
      if (!k && r.studentId) {
        var sid = String(r.studentId).toLowerCase();
        anyPoints = true; anyMine = true; mine[sid] = (mine[sid] || 0) + pts;
        totals[String(r.team || '')] = (totals[String(r.team || '')] || 0) + pts;
      }
    });
    var best = 0;
    rows.forEach(function (r) {
      var sh = 0;
      if (anyMine) sh = mine[String(r.id).toLowerCase()] || 0;
      else if (r.team && totals[r.team]) sh = totals[r.team] / Math.max(1, members[r.team] || 1);
      r.share = Math.round(10 * sh) / 10; best = Math.max(best, r.share);
    });
    rows.forEach(function (r) { r.teamPts = best ? Math.round(50 * r.share / best) / 10 : 0; r.total = Math.round(10 * (r.modulesPts + r.ticketsPts + r.teamPts)) / 10; });
    return { half: half, label: H.label, modulesSet: mods, ticketsSet: tks, rows: rows, teamTotals: totals, teamMembers: members,
      teamNote: anyPoints ? '' : (teamRows.length ? 'The Teams sheet has members but no points yet: team missions count 0 for now.' : 'No Teams sheet yet (WS-B writes it after the first Assembly round): team missions count 0 for now.') };
  }

  /* ----------------------------------------------------------- server
     Cloud: POST {action:'tickets.*', payload} to the class server (Tickets.gs), the student's token or the
     teacher token added here. Demo / offline: the same actions answered from localStorage cc.tickets.v1. */
  var TIMEOUT = 12000, teacherToken = null;
  function api() { return global.API || null; }
  function online() { var a = api(); return !!(a && a.url && a.mode === 'cloud'); }
  function store() { try { return JSON.parse(localStorage.getItem(LS_STORE)) || { sets: {}, results: [], config: null }; } catch (e) { return { sets: {}, results: [], config: null }; } }
  function saveStore(d) { try { localStorage.setItem(LS_STORE, JSON.stringify(d)); } catch (e) {} }
  function localDb() { try { return JSON.parse(localStorage.getItem('cc.local.v1')) || {}; } catch (e) { return {}; } }
  function localAnswer(action, p) {
    var d = store(), code = String(p.code || '').toUpperCase();
    switch (action) {
      case 'tickets.status': return { ok: true, sets: d.sets, local: true };
      case 'tickets.open': d.sets[code] = { code: code, lesson: p.lesson || '', state: 'open', openedAt: (d.sets[code] || {}).openedAt || new Date().toISOString(), closedAt: '' }; saveStore(d); return { ok: true, sets: d.sets };
      case 'tickets.close': if (d.sets[code]) { d.sets[code].state = 'closed'; d.sets[code].closedAt = new Date().toISOString(); } saveStore(d); return { ok: true, sets: d.sets };
      case 'tickets.done': d.results = d.results.filter(function (r) { return !(r.studentId === p.studentId && r.code === code); }); d.results.push({ ts: new Date().toISOString(), code: code, lesson: p.lesson || '', studentId: p.studentId, name: p.name || '', cohort: p.cohort || '', score: p.score, n: p.n, seconds: p.seconds, hinted: p.hinted, tags: (p.tags || []).join(' ') }); saveStore(d); return { ok: true };
      case 'tickets.results': return { ok: true, results: d.results };
      case 'tickets.live': return { ok: true, rows: ((localDb().attempts) || []).filter(function (a) { return a && a.mode === 'ticket' && a.topic === code; }) };
      case 'tickets.config': if (p.set) { d.config = p.config; saveStore(d); } return { ok: true, config: d.config };
      case 'tickets.teams': return { ok: true, rows: [], sheet: false };
    }
    return { ok: false, error: 'Unknown action ' + action };
  }
  function server(action, payload, sid) {
    payload = payload || {};
    if (!online()) return Promise.resolve(localAnswer(action, payload));
    var a = api();
    if (sid) { payload.studentId = sid; try { payload.token = localStorage.getItem('cc.token') || ''; } catch (e) {} }
    if (teacherToken) payload.tt = teacherToken;
    var ctrl = typeof AbortController !== 'undefined' ? new AbortController() : null, timer;
    var req = fetch(a.url, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify({ action: action, payload: payload }), redirect: 'follow', signal: ctrl ? ctrl.signal : undefined })
      .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); });
    var guard = new Promise(function (_, reject) { timer = setTimeout(function () { if (ctrl) { try { ctrl.abort(); } catch (e) {} } reject(new Error('The class server took too long.')); }, TIMEOUT); });
    return Promise.race([req, guard]).then(function (j) { clearTimeout(timer); return j || { ok: false, error: 'Empty reply' }; }, function (e) { clearTimeout(timer); return { ok: false, error: String(e && e.message || e), unreachable: true }; });
  }
  /* A server without Tickets.gs (or not yet redeployed) answers "Unknown action": treated as "no gate". */
  function noBackend(r) { return !r || r.unreachable || /Unknown action|Bad JSON|missing/i.test(String(r.error || '')); }

  /* =============================================================== STUDENT */
  var st = { host: null, pc: null, run: null, clock: null };
  function $(s, root) { return (root || document).querySelector(s); }
  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function mmss(sec) { sec = Math.max(0, Math.round(sec)); var m = Math.floor(sec / 60), s = sec % 60; return m + ':' + (s < 10 ? '0' : '') + s; }
  function pct(a, b) { return b ? Math.round(100 * a / b) : 0; }
  function stopClock() { if (st.clock) { clearInterval(st.clock); st.clock = null; } }
  function leave() { stopClock(); if (st.run && st.run.cleanup) { try { st.run.cleanup(); } catch (e) {} } st.run = null; }

  function mount(host, pc) {
    st.host = host; st.pc = pc; leave();
    paintEntry('');
  }
  function paintEntry(msg, bad) {
    var p = st.pc.p, mine = (p && p.tickets) || {}, had = Object.keys(mine).sort();
    var h = '<div class="sect-h"><div><h2>Tickets</h2><p>At the start of a lesson the launch quiz (8 questions, 4 minutes); at the end, the exit ticket (5 questions, 3 minutes). T.Chris shows the code on the slide. Enter it here and answer at IELTS speed: a wrong first answer shows a hint and gives you one more try.</p></div></div>';
    h += '<div class="card settings tk-entry"><div class="field"><label for="tk-code">Ticket code</label><input id="tk-code" type="text" inputmode="text" autocapitalize="characters" autocomplete="off" spellcheck="false" placeholder="e.g. E01" maxlength="4" style="text-transform:uppercase;font-family:var(--f-mono);font-size:1.3rem;letter-spacing:.15em;max-width:180px"></div>' +
      '<div id="tk-msg" class="msg ' + (bad ? 'bad' : 'info') + (msg ? '' : ' hidden') + '">' + esc(msg) + '</div><button class="btn primary" id="tk-go">Start</button></div>';
    if (had.length) {
      h += '<div class="card settings" style="margin-top:12px"><p class="kicker">Your tickets</p><div class="tk-mine">' + had.map(function (c) {
        var r = mine[c], info = codeInfo(c) || { kindName: 'Ticket', lesson: '' };
        return '<div class="tk-row"><b>' + esc(c) + '</b><span>' + esc(info.kindName + ' · ' + info.lesson) + '</span><span class="tk-score">' + r.score + '/' + r.n + '</span><span class="tiny">' + esc(String(r.at || '').slice(0, 10)) + '</span></div>';
      }).join('') + '</div><p class="tiny">Completing each exit ticket counts toward your participation mark; the score itself is not graded.</p></div>';
    }
    st.host.innerHTML = h;
    var inp = $('#tk-code', st.host), go = $('#tk-go', st.host);
    go.addEventListener('click', function () { tryStart(inp.value); });
    inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') tryStart(inp.value); });
    inp.focus();
  }
  function tryStart(raw) {
    var info = codeInfo(raw), p = st.pc.p;
    if (!info) return paintEntry('A code is one letter and two digits, like E01 or Q02.', true);
    var set = setOf(info.code);
    if (!set || !set.items.length) return paintEntry('No ticket with the code ' + info.code + ' yet. Check the slide.', true);
    if (p.tickets && p.tickets[info.code]) return paintEntry('You completed ' + info.code + ' on ' + String(p.tickets[info.code].at || '').slice(0, 10) + ' (' + p.tickets[info.code].score + '/' + p.tickets[info.code].n + '). One sitting per ticket.', true);
    var go = $('#tk-go', st.host); if (go) { go.disabled = true; go.textContent = 'Checking…'; }
    server('tickets.status', {}, p.studentId).then(function (r) {
      if (st.host.querySelector('#tk-go') == null) return;
      var rec = r && r.ok && r.sets && r.sets[info.code];
      /* the class server (or, offline, the local store the Staff Room writes) says whether the code is open;
         a server without Tickets.gs, or one that does not answer, is no gate (the lesson goes on) */
      if (r && r.ok && (!rec || rec.state !== 'open')) return paintEntry(info.code + (rec ? ' is closed.' : ' is not open yet. Wait for T.Chris to open it.'), true);
      startRun(set, noBackend(r) ? 'offline' : '');
    });
  }
  function startRun(set, note) {
    var secs = set.info.minutes * 60;
    st.run = { set: set, items: set.items.slice(), i: 0, results: [], t0: Date.now(), end: Date.now() + secs * 1000, secs: secs, note: note, hints: 0, cleanup: null, timeUp: false };
    renderQ();
    stopClock();
    st.clock = setInterval(function () {
      var r = st.run; if (!r) return stopClock();
      var left = Math.round((r.end - Date.now()) / 1000), c = $('#tk-clock', st.host);
      if (c) { c.textContent = mmss(left); c.classList.toggle('low', left <= 30); }
      if (left <= 0) { stopClock(); timeUp(); }
    }, 250);
  }
  function renderQ() {
    var r = st.run, item = r.items[r.i], E = global.Engine, P = E.Progress, p = st.pc.p;
    if (r.cleanup) { r.cleanup(); r.cleanup = null; }
    var prog = Math.round(100 * r.i / r.items.length);
    st.host.innerHTML = '<div class="play tk-play"><div class="play-top"><button class="btn ghost sm" id="tk-quit" title="Leave the ticket">✕</button><div class="bar-line thin"><span style="width:' + prog + '%"></span></div><span class="qcount">' + (r.i + 1) + ' / ' + r.items.length + '</span><span class="tk-clock" id="tk-clock">' + mmss((r.end - Date.now()) / 1000) + '</span></div>' +
      '<p class="kicker tk-code-line">' + esc(r.set.info.code + ' · ' + r.set.info.kindName) + (r.note === 'offline' ? ' · offline: answers are kept on this device' : '') + '</p>' +
      '<div class="card qcard"><div class="qtype"><span>' + esc(E.TYPE_LABEL[item.type] || 'Question') + '</span><span class="lv">' + esc(item.level || '') + '</span></div><div id="tk-host"></div><div id="tk-fb" role="status" aria-live="polite"></div>' +
      '<div class="qfoot"><span class="grow"></span><button class="btn primary" id="tk-check" disabled>Check</button></div></div></div>';
    var host = $('#tk-host', st.host), view = E.mount(item, host), btn = $('#tk-check', st.host);
    var t0 = Date.now(), answered = false, retry = false, first = null;
    host.addEventListener('respond', function () { if (!answered) btn.disabled = !view.hasResponse(); });
    $('#tk-quit', st.host).addEventListener('click', function () {
      if (!confirm('Leave this ticket? It will not count as completed.')) return;
      leave(); paintEntry('');
    });
    function settle(out, correct) {
      answered = true;
      var ms = Date.now() - t0, hinted = retry;
      var row = P.recordAttempt(p, item, correct, ms, hinted, false);
      if (!E.Bank.item(item.id) && p.review) delete p.review[item.id];
      row.itemId = attemptId(item); row.topic = r.set.info.code; row.level = r.set.info.lesson; row.mode = 'ticket';
      row.given = String(first != null ? first : out.givenText).slice(0, 200) + (retry ? ' → ' + String(out.givenText).slice(0, 190) : ''); row.expected = String(out.expectedText).slice(0, 300);
      if (api()) api().enqueue([row]);
      r.results.push({ item: item, correct: correct, hinted: hinted, given: out.givenText });
      $('#tk-fb', st.host).innerHTML = '<div class="verdict ' + (correct ? 'ok' : 'no') + '"><div class="verdict-h">' + (correct ? '✓ Correct' + (hinted ? ' (second try)' : '') : '✕ Not quite') + '</div>' +
        (correct ? '' : '<div class="verdict-exp">You chose: ' + esc(out.givenText) + '<br>Answer: ' + esc(out.expectedText) + '</div>') + '<div class="verdict-w">' + (item.why || '') + '</div></div>';
      btn.textContent = r.i + 1 >= r.items.length ? 'See your result' : 'Next →'; btn.disabled = false;
      if (st.pc.paintHeader) st.pc.paintHeader(); if (st.pc.syncSoon) st.pc.syncSoon();
    }
    btn.addEventListener('click', function () {
      if (answered) return next();
      var out = view.check();
      if (out.correct) { view.lock({}); return settle(out, true); }
      if (!retry && item.hint) {
        /* first wrong answer: the hint appears and she gets one more try on a fresh copy of the item */
        retry = true; r.hints++; first = out.givenText;
        $('#tk-fb', st.host).innerHTML = '<div class="verdict tk-hint"><div class="verdict-h">Hint · one more try</div><div class="verdict-w">' + esc(item.hint) + '</div></div>';
        view = E.mount(item, host); btn.disabled = true;
        return;
      }
      view.lock({}); settle(out, false);
    });
    function next() { r.i++; if (r.i >= r.items.length) finish(); else renderQ(); }
    function onKey(e) { if (e.key !== 'Enter' || e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return; if (btn && !btn.disabled) { e.preventDefault(); btn.click(); } }
    document.addEventListener('keydown', onKey);
    r.cleanup = function () { document.removeEventListener('keydown', onKey); };
    r.current = { lock: function () { try { view.lock({}); } catch (e) {} }, settleNoAnswer: function () {
      if (answered) return;
      answered = true;
      var out; try { out = view.check(); } catch (e) { out = { givenText: '(no answer)', expectedText: '' }; }
      var row = { ts: new Date().toISOString(), studentId: p.studentId, itemId: attemptId(item), topic: r.set.info.code, level: r.set.info.lesson, type: item.type, tag: item.tag, cefr: item.level, correct: 0, ms: Date.now() - t0, hinted: retry ? 1 : 0, fast: 0, mode: 'ticket', given: '(time out) ' + String(out.givenText || '').slice(0, 180), expected: String(out.expectedText || '').slice(0, 300) };
      if (api()) api().enqueue([row]);
      r.results.push({ item: item, correct: false, hinted: retry, given: '(time out)', timeout: true });
    } };
  }
  function timeUp() {
    var r = st.run; if (!r) return;
    r.timeUp = true;
    if (r.current) { r.current.settleNoAnswer(); r.current.lock(); }
    for (var k = r.i + 1; k < r.items.length; k++) {
      var it = r.items[k], p = st.pc.p;
      var row = { ts: new Date().toISOString(), studentId: p.studentId, itemId: attemptId(it), topic: r.set.info.code, level: r.set.info.lesson, type: it.type, tag: it.tag, cefr: it.level, correct: 0, ms: 0, hinted: 0, fast: 0, mode: 'ticket', given: '(time out)', expected: '' };
      if (api()) api().enqueue([row]);
      r.results.push({ item: it, correct: false, hinted: false, given: '(time out)', timeout: true });
    }
    finish();
  }
  function finish() {
    var r = st.run, p = st.pc.p; stopClock();
    if (r.cleanup) { r.cleanup(); r.cleanup = null; }
    var correct = r.results.filter(function (x) { return x.correct; }).length, n = r.items.length, secs = Math.min(r.secs, Math.round((Date.now() - r.t0) / 1000));
    var misses = r.results.filter(function (x) { return !x.correct; }), tags = [];
    misses.forEach(function (m) { if (m.item.tag && tags.indexOf(m.item.tag) < 0) tags.push(m.item.tag); });
    p.tickets = p.tickets || {};
    p.tickets[r.set.info.code] = { score: correct, n: n, at: new Date().toISOString(), seconds: secs, hinted: r.hints, tags: tags, timeUp: r.timeUp };
    if (st.pc.sync) st.pc.sync();
    server('tickets.done', { code: r.set.info.code, lesson: r.set.info.lesson, score: correct, n: n, seconds: secs, hinted: r.hints, tags: tags, name: p.displayName || '', cohort: p.cohort || '' }, p.studentId);
    var head = r.timeUp ? 'Time is up' : correct === n ? 'A clean ticket' : correct >= n * 0.6 ? 'Ticket done' : 'Ticket done — read the misses';
    var h = '<div class="play"><div class="card result"><div class="score-ring" style="--p:' + pct(correct, n) + '"><i>' + correct + '/' + n + '</i></div><h3>' + esc(head) + '</h3><p>' + esc(r.set.info.code + ' · ' + r.set.info.kindName + ' · ' + mmss(secs) + (r.hints ? ' · ' + r.hints + (r.hints === 1 ? ' hint' : ' hints') : '')) + '</p>';
    if (tags.length) h += '<p class="tiny">Rules to look at: ' + tags.map(function (t) { return '<span class="pill">' + esc(remName(t)) + '</span>'; }).join(' ') + '</p>';
    if (misses.length) h += '<div class="misslist">' + misses.map(function (m) { return '<div class="miss"><b>' + esc(remName(m.item.tag)) + (m.timeout ? ' · not answered' : '') + '</b>' + (m.item.why || '') + '</div>'; }).join('') + '</div>';
    h += '<p class="tiny">Your answers are saved' + (r.note === 'offline' ? ' on this device and will be sent when the class server answers' : '') + '. Anything you missed is explained above; T.Chris sees the class heat map.</p>';
    h += '<div style="display:flex;gap:10px;flex-wrap:wrap;justify-content:center"><button class="btn primary" id="tk-done">Back to the Map Room</button><button class="btn" id="tk-more">Tickets</button></div></div></div>';
    st.host.innerHTML = h; st.run = null;
    $('#tk-done', st.host).addEventListener('click', function () { st.pc.show('plan'); });
    $('#tk-more', st.host).addEventListener('click', function () { paintEntry(''); });
    if (st.pc.paintHeader) st.pc.paintHeader();
  }

  /* ================================================================ STAFF */
  var ss = { host: null, ctx: null, sets: {}, results: [], config: null, teams: [], teamsSheet: null, half: null, code: null, live: null, liveRows: [], tick: null, sel: null, loaded: false };
  function cfg() { if (ss.config) return ss.config; try { ss.config = JSON.parse(localStorage.getItem(LS_CFG)) || null; } catch (e) {} return ss.config || { H1: { on: [], off: [] }, H2: { on: [], off: [] } }; }
  function saveCfg(c) { ss.config = c; try { localStorage.setItem(LS_CFG, JSON.stringify(c)); } catch (e) {} server('tickets.config', { set: true, config: c }); }
  function csvText(rows) { return rows.map(function (r) { return r.map(function (c) { var s = String(c == null ? '' : c); if (/^[=+\-@\t\r]/.test(s) && !/^-?\d+(\.\d+)?$/.test(s)) s = "'" + s; return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; }).join(','); }).join('\n'); }
  function download(name, text) { var a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([text], { type: 'text/csv' })); a.download = name; a.click(); }
  function stopLive() { if (ss.tick) { clearInterval(ss.tick); ss.tick = null; } }
  function staffLeave() { stopLive(); }
  function staffMount(host, ctx) {
    ss.host = host; ss.ctx = ctx; if (!ss.half) ss.half = currentHalf();
    host.innerHTML = '<div class="panel-h"><h2>Tickets · Participation</h2><span class="tiny">loading…</span></div>';
    var done = 0, need = 4;
    function one() { if (++done >= need) { ss.loaded = true; paintStaff(); } }
    server('tickets.status', {}).then(function (r) { if (r && r.ok) ss.sets = r.sets || {}; ss.backend = !noBackend(r); one(); });
    server('tickets.results', {}).then(function (r) { if (r && r.ok) ss.results = r.results || []; one(); });
    server('tickets.config', {}).then(function (r) { if (r && r.ok && r.config) { ss.config = r.config; try { localStorage.setItem(LS_CFG, JSON.stringify(r.config)); } catch (e) {} } one(); });
    server('tickets.teams', {}).then(function (r) { if (r && r.ok) { ss.teams = r.rows || []; ss.teamsSheet = !!r.sheet; } one(); });
  }
  function visibleStudents() { return (ss.ctx.roster && ss.ctx.roster()) || []; }
  function resultsFor(code, list) {
    var ids = {}; list.forEach(function (s) { ids[String(s.id).toLowerCase()] = 1; });
    var last = {};
    ss.results.forEach(function (r) { if (r.code === code && ids[String(r.studentId).toLowerCase()]) last[String(r.studentId).toLowerCase()] = r; });
    list.forEach(function (s) { var t = s.progress && s.progress.tickets && s.progress.tickets[code]; if (t && !last[String(s.id).toLowerCase()]) last[String(s.id).toLowerCase()] = { studentId: s.id, code: code, score: t.score, n: t.n, seconds: t.seconds, hinted: t.hinted, tags: (t.tags || []).join(' '), ts: t.at, fromProgress: true }; });
    return Object.keys(last).map(function (k) { return last[k]; });
  }
  function paintStaff() {
    var host = ss.host, list = visibleStudents(), cohortLabel = ss.ctx.cohort ? ss.ctx.cohort() : 'all';
    var h = '<div class="panel-h"><div><h2>Tickets</h2><span class="kicker">launch quizzes and exit tickets · ' + esc(cohortLabel === 'all' ? 'all cohorts' : cohortLabel) + ' · ' + list.length + (list.length === 1 ? ' student' : ' students') + (ss.backend === false ? ' · <b>server has no Tickets.gs yet: local state only</b>' : '') + '</span></div><span class="tiny">Open a code before you show it; close it after the lesson. Students enter it in the Tickets room (index.html#tickets).</span></div>';
    h += '<div class="card panel" style="margin-bottom:16px"><div class="tk-table-wrap"><table class="roster tk-sets"><thead><tr><th>Lesson</th><th>Code</th><th>Set</th><th>Items</th><th>State</th><th>Done</th><th>Mean</th><th></th></tr></thead><tbody>';
    codes().forEach(function (c) {
      var set = setOf(c.code), rec = ss.sets[c.code], open = rec && rec.state === 'open', rs = resultsFor(c.code, list);
      var mean = rs.length ? Math.round(100 * rs.reduce(function (a, r) { return a + (Number(r.score) || 0) / Math.max(1, Number(r.n) || c.n); }, 0) / rs.length) : null;
      h += '<tr class="' + (ss.code === c.code ? 'sel' : '') + '"><td>' + esc(c.lesson) + ' <span class="tiny">' + esc(c.date) + '</span></td><td><b class="tk-codecell">' + esc(c.code) + '</b></td><td>' + esc(c.kindName) + '</td><td>' + set.items.length + (set.missing.length ? ' <span class="pill bad" title="' + esc(set.missing.join(' ')) + '">' + set.missing.length + ' missing</span>' : '') + '</td>' +
        '<td><span class="pill ' + (open ? 'good' : '') + '">' + (open ? 'open' : rec ? 'closed' : 'not opened') + '</span></td><td>' + rs.length + '/' + list.length + (list.length ? ' <span class="tiny">' + pct(rs.length, list.length) + '%</span>' : '') + '</td><td>' + (mean == null ? '—' : mean + '%') + '</td>' +
        '<td style="white-space:nowrap"><button class="btn sm ' + (open ? 'ghost' : 'primary') + '" data-tk-toggle="' + esc(c.code) + '" data-lesson="' + esc(c.lesson) + '">' + (open ? 'Close' : 'Open') + '</button> <button class="btn sm" data-tk-view="' + esc(c.code) + '">' + (open ? 'Live' : 'Results') + '</button></td></tr>';
    });
    h += '</tbody></table></div><div id="tk-live"></div></div>';
    h += ledgerHtml(list);
    host.innerHTML = h;
    host.querySelectorAll('[data-tk-toggle]').forEach(function (b) { b.addEventListener('click', function () {
      var code = b.dataset.tkToggle, open = ss.sets[code] && ss.sets[code].state === 'open';
      server(open ? 'tickets.close' : 'tickets.open', { code: code, lesson: b.dataset.lesson }).then(function (r) {
        if (!r || !r.ok) { ss.ctx.toast('Could not ' + (open ? 'close' : 'open') + ' ' + code + ': ' + ((r && r.error) || 'try again')); return; }
        ss.sets = r.sets || ss.sets; ss.ctx.toast(code + (open ? ' closed.' : ' is open — show the code.')); if (!open) ss.code = code; paintStaff();
      });
    }); });
    host.querySelectorAll('[data-tk-view]').forEach(function (b) { b.addEventListener('click', function () { ss.code = ss.code === b.dataset.tkView ? null : b.dataset.tkView; paintStaff(); }); });
    if (ss.code) paintLive(); else stopLive();
    bindLedger(list);
  }
  function paintLive() {
    var code = ss.code, set = setOf(code), list = visibleStudents(), box = $('#tk-live', ss.host); if (!set || !box) return;
    var open = ss.sets[code] && ss.sets[code].state === 'open';
    function draw() {
      var rows = ss.liveRows.filter(function (a) { return a.topic === code; }), byS = {}, byI = {}, byTag = {}, ids = {};
      list.forEach(function (s) { ids[String(s.id).toLowerCase()] = s; });
      rows.forEach(function (a) {
        var sid = String(a.studentId).toLowerCase(); if (!ids[sid]) return;
        var k = sid + '|' + a.itemId; if (byS[k] && byS[k].ts > a.ts) return; byS[k] = a;
      });
      Object.keys(byS).forEach(function (k) {
        var a = byS[k], ok = Number(a.correct) === 1;
        var i = byI[a.itemId] || (byI[a.itemId] = { a: 0, w: 0 }); i.a++; if (!ok) i.w++;
        if (a.tag) { var t = byTag[a.tag] || (byTag[a.tag] = { a: 0, w: 0 }); t.a++; if (!ok) t.w++; }
      });
      var rs = resultsFor(code, list), doneIds = {}; rs.forEach(function (r) { doneIds[String(r.studentId).toLowerCase()] = r; });
      var h = '<div class="panel-h" style="margin-top:14px"><div><h2 style="font-size:1rem">' + esc(code + ' · ' + set.info.kindName + ' · ' + set.info.lesson) + (open ? ' · live' : '') + '</h2><span class="kicker">' + rs.length + ' of ' + list.length + ' finished' + (open ? ' · refreshing every 6 s' : '') + '</span></div><button class="btn sm ghost" id="tk-live-close">Hide</button></div>';
      h += '<div class="tk-table-wrap"><table class="roster tk-grid"><thead><tr><th>Student</th>' + set.items.map(function (it, i) { return '<th title="' + esc((it.stem || '').replace(/<[^>]+>/g, '')) + '">' + (i + 1) + '</th>'; }).join('') + '<th>Score</th></tr></thead><tbody>';
      list.slice().sort(function (a, b) { return String((a.progress || {}).displayName || a.name || a.id).toLowerCase() < String((b.progress || {}).displayName || b.name || b.id).toLowerCase() ? -1 : 1; }).forEach(function (s) {
        var sid = String(s.id).toLowerCase(), d = doneIds[sid], any = false;
        h += '<tr><td class="n">' + esc((s.progress || {}).displayName || s.name || s.id) + '</td>' + set.items.map(function (it) {
          var a = byS[sid + '|' + attemptId(it)]; if (a) any = true;
          return '<td class="tk-cell ' + (!a ? '' : Number(a.correct) === 1 ? 'ok' : 'no') + '">' + (!a ? '·' : Number(a.correct) === 1 ? (Number(a.hinted) ? '✓h' : '✓') : '✕') + '</td>';
        }).join('') + '<td>' + (d ? d.score + '/' + d.n : any ? '…' : '') + '</td></tr>';
      });
      h += '</tbody></table></div>';
      var worst = set.items.map(function (it, i) { var x = byI[attemptId(it)] || { a: 0, w: 0 }; return { i: i, it: it, a: x.a, w: x.w, rate: x.a ? x.w / x.a : 0 }; }).filter(function (x) { return x.a; }).sort(function (a, b) { return b.rate - a.rate || b.w - a.w; });
      h += '<div class="grid" style="margin-top:12px"><div><div class="panel-h"><h2 style="font-size:.98rem">Most missed · ask "what did the slot need?"</h2></div>' + (worst.length ? worst.slice(0, 3).map(function (x) { return '<div class="tk-worst"><b>' + (x.i + 1) + '</b> <span>' + esc((x.it.stem || '').replace(/<[^>]+>/g, '')) + '</span><span class="tiny">' + x.w + '/' + x.a + ' wrong · ' + esc(remName(x.it.tag)) + '</span></div>'; }).join('') : '<p class="tiny">No answers yet.</p>') + '</div>';
      var tags = Object.keys(byTag).map(function (t) { return { tag: t, a: byTag[t].a, rate: byTag[t].w / byTag[t].a }; }).sort(function (a, b) { return b.rate - a.rate; });
      h += '<div><div class="panel-h"><h2 style="font-size:.98rem">Heat map by tag · this set</h2></div><div class="heat">' + (tags.length ? tags.map(function (t) { return '<div class="heat-row"><span>' + esc(remName(t.tag)) + ' <span class="tiny">(' + t.a + ')</span></span><span class="heat-bar"><i style="width:' + Math.round(100 * t.rate) + '%"></i></span><span class="heat-n">' + Math.round(100 * t.rate) + '%</span></div>'; }).join('') : '<p class="tiny">No answers yet.</p>') + '</div></div></div>';
      box.innerHTML = h;
      $('#tk-live-close', ss.host).addEventListener('click', function () { ss.code = null; stopLive(); paintStaff(); });
    }
    function poll() { server('tickets.live', { code: code }).then(function (r) { if (!ss.host || ss.code !== code) return; if (r && r.ok) ss.liveRows = r.rows || []; draw(); }); }
    draw(); poll(); stopLive();
    if (open) ss.tick = setInterval(poll, 6000);
  }
  /* ---------------------------------------------------------- the ledger */
  function ledgerData(list) {
    return ledger(list, { half: ss.half, config: cfg(), sets: ss.sets, results: ss.results, teams: ss.teams, topics: (global.CONTENT && global.CONTENT.TOPICS) || [] });
  }
  function ledgerHtml(list) {
    var L = ledgerData(list), topics = (global.CONTENT && global.CONTENT.TOPICS) || [], c = cfg()[ss.half] || { on: [], off: [] }, day = today();
    var h = '<div class="card panel" id="tk-ledger"><div class="panel-h"><div><h2>Participation ledger</h2><span class="kicker">15 pts per half = module mastery 5 · exit tickets 5 · team missions 5</span></div><div class="filters" style="margin:0">' + ['H1', 'H2'].map(function (k) { return '<button data-tk-half="' + k + '"' + (ss.half === k ? ' class="on"' : '') + '>' + esc(HALVES[k].label) + '</button>'; }).join('') + '<button id="tk-csv">Export CSV</button></div></div>';
    h += '<details class="disc"><summary>Modules set to date<span class="count">' + L.modulesSet.length + ' of ' + topics.length + '</span></summary><div class="disc-body" style="padding-top:10px"><p class="tiny">Ticked = counts in the denominator for this half. Modules tick themselves on the week the Homework map sets them (today ' + day + '); tick or untick to override. New modules appear here automatically.</p><div class="tk-mods">' +
      topics.map(function (t) { var on = L.modulesSet.indexOf(t.id) >= 0, auto = MODULE_SET[t.id] || ''; return '<label class="tk-mod' + (on ? ' on' : '') + '"><input type="checkbox" data-tk-mod="' + esc(t.id) + '"' + (on ? ' checked' : '') + '> <b>' + esc(t.code) + '</b> ' + esc(t.name) + '<span class="tiny">' + (auto ? 'set ' + auto : 'no date') + ((c.on || []).indexOf(t.id) >= 0 || (c.off || []).indexOf(t.id) >= 0 ? ' · overridden' : '') + '</span></label>'; }).join('') + '</div></div></details>';
    h += '<p class="tiny" style="margin:8px 0">Exit tickets set in this half: ' + (L.ticketsSet.length ? L.ticketsSet.map(function (k) { return '<b>' + esc(k) + '</b>'; }).join(', ') : 'none yet') + ' (a ticket is set once its lesson date is reached or you have opened it). ' + (L.teamNote ? esc(L.teamNote) : 'Team missions from the Teams sheet: ' + Object.keys(L.teamTotals).map(function (t) { return esc(t) + ' ' + L.teamTotals[t]; }).join(' · ')) + '</p>';
    h += '<div class="tk-table-wrap"><table class="roster tk-ledger-t"><thead><tr><th>Student</th><th>Team</th><th>Modules</th><th>pts</th><th>Exit tickets</th><th>pts</th><th>Team share</th><th>pts</th><th>Total /15</th></tr></thead><tbody>';
    L.rows.slice().sort(function (a, b) { return b.total - a.total || (a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1); }).forEach(function (r) {
      h += '<tr class="r" data-tk-stu="' + esc(r.id) + '"><td class="n">' + esc(r.name) + '</td><td>' + esc(r.team || '—') + '</td><td>' + r.modulesPassed.length + '/' + r.modulesN + '</td><td><b>' + r.modulesPts + '</b></td><td>' + r.ticketsDone.length + '/' + r.ticketsN + '</td><td><b>' + r.ticketsPts + '</b></td><td>' + (r.share || '—') + '</td><td><b>' + r.teamPts + '</b></td><td><b>' + r.total + '</b></td></tr>';
      if (ss.sel === r.id) h += '<tr class="tk-detail"><td colspan="9"><div class="tiny"><b>Modules passed:</b> ' + (r.modulesPassed.length ? r.modulesPassed.join(', ') : 'none') + ' · <b>still to pass:</b> ' + (L.modulesSet.filter(function (m) { return r.modulesPassed.indexOf(m) < 0; }).join(', ') || 'none') + '<br><b>Exit tickets done:</b> ' + (r.ticketsDone.join(', ') || 'none') + ' · <b>missing:</b> ' + (L.ticketsSet.filter(function (k) { return r.ticketsDone.indexOf(k) < 0; }).join(', ') || 'none') + (r.team ? '<br><b>' + esc(r.team) + '</b>: ' + (L.teamTotals[r.team] || 0) + ' pts ÷ ' + (L.teamMembers[r.team] || 1) + ' members = ' + r.share : '') + '</div></td></tr>';
    });
    h += '</tbody></table></div><p class="tiny">Module mastery = gates passed (75 %) of the modules set; exit tickets = completed of those set; team missions = her equal share of her team\'s Assembly points in the half, the best share in the cohort scoring 5. Export the CSV on the cut-off day (18 Dec, 12 Feb); the ledger shows the current state, not a snapshot.</p></div>';
    return h;
  }
  function bindLedger(list) {
    var host = ss.host;
    host.querySelectorAll('[data-tk-half]').forEach(function (b) { b.addEventListener('click', function () { ss.half = b.dataset.tkHalf; paintStaff(); }); });
    host.querySelectorAll('[data-tk-mod]').forEach(function (cb) { cb.addEventListener('change', function () {
      var c = cfg(), h = c[ss.half] || (c[ss.half] = { on: [], off: [] }), id = cb.dataset.tkMod, auto = MODULE_SET[id] && MODULE_SET[id] <= today() && halfOf(MODULE_SET[id]) === ss.half;
      h.on = (h.on || []).filter(function (x) { return x !== id; }); h.off = (h.off || []).filter(function (x) { return x !== id; });
      if (cb.checked && !auto) h.on.push(id); if (!cb.checked && auto) h.off.push(id);
      saveCfg(c); paintStaff();
    }); });
    host.querySelectorAll('[data-tk-stu]').forEach(function (tr) { tr.addEventListener('click', function () { ss.sel = ss.sel === tr.dataset.tkStu ? null : tr.dataset.tkStu; paintStaff(); }); });
    var csvBtn = $('#tk-csv', host); if (csvBtn) csvBtn.addEventListener('click', function () {
      var L = ledgerData(list), rows = [['Half', 'Student ID', 'Name', 'Cohort', 'Team', 'Modules passed', 'Modules set', 'Module mastery /5', 'Exit tickets done', 'Exit tickets set', 'Exit tickets /5', 'Team share', 'Team missions /5', 'Participation /15', 'Modules passed (ids)', 'Tickets done (codes)']];
      L.rows.forEach(function (r) { rows.push([L.half, r.id, r.name, r.cohort, r.team, r.modulesPassed.length, r.modulesN, r.modulesPts, r.ticketsDone.length, r.ticketsN, r.ticketsPts, r.share, r.teamPts, r.total, r.modulesPassed.join(' '), r.ticketsDone.join(' ')]); });
      rows.push([]); rows.push(['Modules set (' + L.half + ')', L.modulesSet.join(' ')]); rows.push(['Exit tickets set (' + L.half + ')', L.ticketsSet.join(' ')]);
      rows.push([]); rows.push(['Ticket', 'Student ID', 'Score', 'Of', 'Seconds', 'Hints', 'Tags missed', 'When']);
      codes().forEach(function (c) { resultsFor(c.code, list).forEach(function (r) { rows.push([c.code, r.studentId, r.score, r.n, r.seconds, r.hinted, r.tags, String(r.ts || '').slice(0, 16)]); }); });
      download('observatory-participation-' + L.half + '-' + today() + '.csv', csvText(rows));
      ss.ctx.toast('Ledger exported.');
    });
  }

  /* ------------------------------------------------------------------ css */
  var CSS = '.tk-entry .field{margin-bottom:10px}.tk-mine{display:flex;flex-direction:column;gap:6px}.tk-row{display:grid;grid-template-columns:52px 1fr auto auto;gap:10px;align-items:center;font-size:.9rem}.tk-score{font-family:var(--f-mono);font-weight:600}' +
    '.tk-clock{font-family:var(--f-mono);font-weight:600;font-size:1.05rem;padding:4px 10px;border-radius:99px;background:var(--surface-3);margin-left:8px}.tk-clock.low{background:var(--no);color:#fff}.tk-code-line{margin:6px 0 8px}' +
    '.tk-hint{background:var(--gold-soft);border:1px solid var(--gold)}.tk-hint .verdict-h{color:var(--gold)}' +
    '.tk-table-wrap{overflow-x:auto;max-width:100%}.tk-sets td,.tk-grid td,.tk-ledger-t td{padding:6px 8px;font-size:.85rem;vertical-align:middle}.tk-sets th,.tk-grid th,.tk-ledger-t th{text-align:left;padding:6px 8px}.tk-codecell{font-family:var(--f-mono);letter-spacing:.1em}tr.sel td{background:var(--accent-soft)}' +
    '.tk-grid td.tk-cell{text-align:center;font-family:var(--f-mono);width:30px}.tk-grid td.ok{color:var(--ok,#2a7a4b);font-weight:700}.tk-grid td.no{color:var(--no);font-weight:700}.tk-worst{display:grid;grid-template-columns:24px 1fr;gap:4px 8px;padding:6px 0;border-bottom:1px solid var(--rule-soft);font-size:.85rem}.tk-worst .tiny{grid-column:2}' +
    '.tk-mods{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:6px}.tk-mod{display:grid;grid-template-columns:auto 1fr;gap:2px 8px;align-items:center;padding:6px 8px;border:1px solid var(--rule-soft);border-radius:var(--r-m);font-size:.85rem}.tk-mod.on{border-color:var(--accent)}.tk-mod .tiny{grid-column:2}.tk-mod b{font-family:var(--f-mono);font-size:.75rem}' +
    '.tk-ledger-t tr.r{cursor:pointer}.tk-detail td{background:var(--surface-2,var(--surface-3))}';
  function injectCss() { if (typeof document === 'undefined' || document.getElementById('tk-css')) return; var s = document.createElement('style'); s.id = 'tk-css'; s.textContent = CSS; document.head.appendChild(s); }
  injectCss();

  global.Tickets = {
    version: TC.version, codes: codes, codeInfo: codeInfo, setOf: setOf, resolve: resolve, attemptId: attemptId,
    ledger: ledger, modulesSet: modulesSet, ticketsSet: ticketsSet, HALVES: HALVES, LESSON_DATES: LESSON_DATES, MODULE_SET: MODULE_SET, RULES: RULES,
    mount: mount, leave: leave, running: function () { return !!st.run; },
    staff: { mount: staffMount, leave: staffLeave, setToken: function (tt) { teacherToken = tt || null; } }
  };
})(typeof window !== 'undefined' ? window : this);
