/* ===========================================================================
   QUILLMOOR ACADEMY · THE OBSERVATORY (Chart Control, Task 1) — api.js
   One client for both consoles (the student app and the Staff Room).

   CLOUD MODE   Talks to the Google Apps Script Web App in Code.gs.
                Requests are POST with Content-Type: text/plain so the browser
                treats them as "simple requests" and skips the CORS preflight
                that Apps Script cannot answer. Do not change that header.

   OFFLINE      If the network fails mid-session, everything keeps working
                against localStorage and the answers queue until it is back.
   =========================================================================== */
(function (global) {
  'use strict';

  /* ---- WHERE THE SERVER ADDRESS COMES FROM -------------------------------
     1. A student's own override, saved under Settings (localStorage)
     2. window.CC_API_URL — set in index.html and teacher.html.            */
  var API_URL = (typeof window !== 'undefined' && window.CC_API_URL) || '';

  var LS_URL = 'cc.apiUrl';
  var LS_LOCAL = 'cc.local.v1';
  var LS_SESSION = 'cc.session';
  var LS_OUTBOX = 'cc.outbox.v1';
  var LS_TOKEN = 'cc.token';

  /* A stored address overrides the one built into the page. The sentinel
     'off' means "no server at all" — that is how the teacher console's empty
     address field, and the test harness, ask for the local store instead of
     the class sheet. Without it, clearing the field would simply fall back to
     the built-in URL and there would be no way to reach local data. */
  try {
    var stored = localStorage.getItem(LS_URL);
    if (stored === 'off') API_URL = '';
    else if (stored) API_URL = stored;
  } catch (e) {}

  var state = {
    mode: API_URL ? 'cloud' : 'demo',
    url: API_URL,
    sessionId: null,
    sessionStart: 0,
    token: null,
    tt: null,          /* teacher token: memory only, gone when the console reloads */
    lastError: null
  };
  try { state.token = localStorage.getItem(LS_TOKEN) || null; } catch (e) {}

  /* ------------------------------------------------------------- outbox
     Answers are queued the moment they happen and only cleared once the
     server acknowledges them. Because the queue lives in localStorage it
     survives a reload, a closed lid and a flat battery — which is what lets
     the app stay quiet about a dropped connection instead of alarming a
     sixteen-year-old in the middle of a mock paper. */
  function outbox() {
    try { return JSON.parse(localStorage.getItem(LS_OUTBOX)) || []; } catch (e) { return []; }
  }
  function setOutbox(rows) {
    try { localStorage.setItem(LS_OUTBOX, JSON.stringify(rows.slice(-4000))); } catch (e) {}
  }

  /* -------------------------------------------------------------- storage */
  function db() {
    try { return JSON.parse(localStorage.getItem(LS_LOCAL)) || { students: {}, attempts: [], sessions: [], mocks: [], reports: [], assignments: [], projector: [] }; }
    catch (e) { return { students: {}, attempts: [], sessions: [], mocks: [], reports: [], assignments: [], projector: [] }; }
  }
  function saveDb(d) {
    try { localStorage.setItem(LS_LOCAL, JSON.stringify(d)); } catch (e) {}
  }
  function hash(s) {
    var h = 5381;
    for (var i = 0; i < s.length; i++) { h = ((h << 5) + h + s.charCodeAt(i)) >>> 0; }
    return 'h' + h.toString(36);
  }

  /* ---------------------------------------------------------------- cloud */
  var TIMEOUT_MS = 14000;

  function post(action, payload, keep) {
    if (state.token) payload.token = state.token;
    if (state.tt) payload.tt = state.tt;
    var ctrl = typeof AbortController !== 'undefined' ? new AbortController() : null;
    var timer;
    var req = fetch(state.url, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ action: action, payload: payload || {} }),
      redirect: 'follow',
      keepalive: !!keep,
      signal: ctrl ? ctrl.signal : undefined
    }).then(function (r) {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    });
    var guard = new Promise(function (_, reject) {
      timer = setTimeout(function () {
        if (ctrl) { try { ctrl.abort(); } catch (e) {} }
        reject(new Error('Timed out after ' + (TIMEOUT_MS / 1000) + 's'));
      }, TIMEOUT_MS);
    });
    return Promise.race([req, guard]).then(
      function (v) { clearTimeout(timer); return v; },
      function (e) { clearTimeout(timer); throw e; }
    );
  }

  function call(action, payload, localFn) {
    if (state.mode !== 'cloud') return Promise.resolve(localFn());
    return post(action, payload).then(function (r) {
      /* The teacher token expired or was dropped: ask for the PIN again. */
      if (r && r.auth === 'teacher') { state.tt = null; if (global.API && typeof global.API.onTeacherAuth === 'function') global.API.onTeacherAuth(); }
      return r;
    }, function (err) {
      state.lastError = String(err.message || err);
      state.mode = 'demo';
      if (global.API && typeof global.API.onModeChange === 'function') global.API.onModeChange('demo', state.lastError);
      return localFn();
    });
  }

  /* ------------------------------------------------------------- students */
  function localRegister(id, pw, name) {
    var d = db();
    if (d.students[id]) return { ok: false, error: 'That student ID is already taken. Try logging in instead.' };
    d.students[id] = { id: id, name: name || id, pw: hash(pw), created: new Date().toISOString() };
    d.students[id].progress = global.Engine.Progress.blank(id, name || id);
    saveDb(d);
    return { ok: true, progress: d.students[id].progress };
  }
  function localLogin(id, pw) {
    var d = db();
    var s = d.students[id];
    if (!s) return { ok: false, error: 'No account with that ID. Create one first.' };
    if (s.pw !== hash(pw)) return { ok: false, error: 'Wrong password.' };
    return { ok: true, progress: s.progress };
  }
  function localSave(progress, attempts) {
    var d = db();
    if (!d.students[progress.studentId]) {
      d.students[progress.studentId] = {
        id: progress.studentId, name: progress.displayName,
        pw: hash('offline'), created: new Date().toISOString()
      };
    }
    d.students[progress.studentId].progress = progress;
    d.students[progress.studentId].name = progress.displayName;
    /* A finished simulation arrives as one summary row among the answers. The
       sheet puts it on its own tab; offline we keep the same separation, or the
       teacher console would read it as an unanswered question. */
    if (!d.mocks) d.mocks = [];
    (attempts || []).forEach(function (a) {
      if (a && a.kind === 'mock') d.mocks.push(a); else d.attempts.push(a);
    });
    if (d.attempts.length > 8000) d.attempts = d.attempts.slice(-8000);
    if (d.mocks.length > 2000) d.mocks = d.mocks.slice(-2000);
    saveDb(d);
    return { ok: true };
  }
  function localRoster() {
    var d = db();
    return {
      ok: true,
      students: Object.keys(d.students).map(function (k) {
        var s = d.students[k];
        return { id: s.id, name: s.name, created: s.created, progress: s.progress };
      })
    };
  }
  function localDetail(id) {
    var d = db();
    var s = d.students[id];
    if (!s) return { ok: false, error: 'Not found' };
    return {
      ok: true, student: { id: s.id, name: s.name, created: s.created }, progress: s.progress,
      attempts: d.attempts.filter(function (a) { return a.studentId === id; }),
      sessions: d.sessions.filter(function (x) { return x.studentId === id; }),
      mocks: (d.mocks || []).filter(function (x) { return x.studentId === id; })
    };
  }
  function localSession(kind, row) {
    var d = db();
    if (kind === 'start') { d.sessions.push(row); }
    else {
      for (var i = d.sessions.length - 1; i >= 0; i--) {
        if (d.sessions[i].sessionId === row.sessionId) {
          d.sessions[i].logoutTs = row.logoutTs;
          d.sessions[i].durationSec = row.durationSec;
          d.sessions[i].items = row.items;
          d.sessions[i].correct = row.correct;
          break;
        }
      }
    }
    if (d.sessions.length > 3000) d.sessions = d.sessions.slice(-3000);
    saveDb(d);
    return { ok: true };
  }
  function localAssign(id, paper) {
    var d = db();
    if (!d.students[id]) return { ok: false, error: 'Not found' };
    d.students[id].progress.assignment = paper;
    saveDb(d);
    return { ok: true };
  }

  /* --------------------------------------------------------------- reports */
  function localSubmitReport(rep) {
    var d = db();
    if (!d.reports) d.reports = [];
    d.reports.push(rep);
    if (d.reports.length > 3000) d.reports = d.reports.slice(-3000);
    saveDb(d);
    return { ok: true, id: rep.id };
  }
  function localReports(studentId) {
    var d = db();
    return { ok: true, reports: (d.reports || []).filter(function (r) { return !studentId || r.studentId === studentId; }) };
  }
  function localMarkReport(id, mark) {
    var d = db();
    (d.reports || []).forEach(function (r) { if (r.id === id) { Object.keys(mark).forEach(function (k) { r[k] = mark[k]; }); } });
    saveDb(d);
    return { ok: true };
  }
  function localAssignments(kind, row) {
    var d = db();
    if (!d.assignments) d.assignments = [];
    if (kind === 'set') d.assignments.push(row);
    if (kind === 'remove') d.assignments = d.assignments.filter(function (a) { return a.id !== row.id; });
    saveDb(d);
    return { ok: true, assignments: d.assignments };
  }
  function localProjector(kind, row) {
    var d = db();
    if (!d.projector) d.projector = [];
    if (kind === 'post') { d.projector.push(row); if (d.projector.length > 400) d.projector = d.projector.slice(-400); }
    if (kind === 'clear') d.projector = [];
    saveDb(d);
    return { ok: true, posts: (d.projector || []).filter(function (x) { return !row || !row.round || x.round === row.round; }) };
  }

  /* ------------------------------------------------------------ house cup
     The same sums as the `houses` action in Code.gs: story.hp per house and
     the member count, for one cohort (all when none is given). No names. */
  var HOUSE_IDS = ['compass', 'bridge', 'lexicon', 'loom'];
  function cohortFor(s) {
    var c = (s.progress && s.progress.cohort) || s.cohort || '';
    if (!c && typeof ROSTER !== 'undefined') {
      var r = ROSTER.filter(function (x) { return String(x.id).toLowerCase() === String(s.id).toLowerCase(); })[0];
      if (r) c = r.cohort;
    }
    return String(c || '').trim().toLowerCase();
  }
  function localHouses(cohort) {
    var d = db(), want = String(cohort || '').trim().toLowerCase(), totals = {}, members = {};
    HOUSE_IDS.forEach(function (h) { totals[h] = 0; members[h] = 0; });
    Object.keys(d.students).forEach(function (k) {
      var s = d.students[k], prog = s && s.progress;
      if (!prog || typeof prog !== 'object') return;
      if (want && cohortFor(s) !== want) return;
      var st = prog.story || {}, h = String(st.house || '').toLowerCase();
      if (HOUSE_IDS.indexOf(h) < 0) return;
      var hp = Number(st.hp);
      if (!isFinite(hp) || hp < 0) hp = 0;
      members[h] += 1;
      totals[h] += Math.min(Math.round(hp), 100000);
    });
    return { ok: true, cohort: cohort || '', totals: totals, members: members };
  }

  /* ------------------------------------------------------------ saving */
  var saving = null, queued = null, waiters = [];
  function sendSave(progress) {
    progress.rev = (Number(progress.rev) || 0) + 1;
    var rows = outbox();
    var n = rows.length;
    saving = call('save', { progress: progress, attempts: rows },
      function () { return localSave(progress, rows); })
      .then(function (r) {
        if (r && r.ok) setOutbox(outbox().slice(n));
        return r;
      }, function (e) { return { ok: false, error: String((e && e.message) || e) }; });
    return saving.then(function (r) {
      saving = null;
      if (queued) {
        var next = queued, w = waiters;
        queued = null; waiters = [];
        sendSave(next).then(function (r2) { w.forEach(function (f) { f(r2); }); });
      }
      return r;
    });
  }

  /* ------------------------------------------------------------ merging
     Passed lessons, gates, mocks, keepsakes and report summaries only ever grow, so two copies of
     one student's progress are combined, never swapped. The same rule runs in Code.gs (keepRecords). */
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
  /* Adds from's records to into (in place); returns the number of lesson/gate/mock records that changed. */
  function mergeRecords(into, from) {
    var changed = 0;
    if (!into || !from || typeof from !== 'object') return 0;
    ['subs', 'checks', 'mocks'].forEach(function (m) {
      var src = from[m]; if (!src || typeof src !== 'object') return;
      var dst = into[m] && typeof into[m] === 'object' ? into[m] : (into[m] = {});
      Object.keys(src).forEach(function (id) {
        var before = dst[id] ? JSON.stringify(dst[id]) : '';
        dst[id] = betterRec(dst[id], src[id]);
        if (JSON.stringify(dst[id]) !== before) changed++;
      });
    });
    if (from.badges && from.badges.length) {
      if (!into.badges) into.badges = [];
      from.badges.forEach(function (b) { if (into.badges.indexOf(b) < 0) { into.badges.push(b); changed++; } });
    }
    if (from.reports && from.reports.length) {
      if (!into.reports) into.reports = [];
      var have = {};
      into.reports.forEach(function (r) { if (r && r.id) have[r.id] = 1; });
      from.reports.forEach(function (r) { if (r && r.id && !have[r.id]) { into.reports.push(r); changed++; } });
      into.reports.sort(function (x, y) { return String(x.ts || '') < String(y.ts || '') ? -1 : 1; });
      if (into.reports.length > 40) into.reports = into.reports.slice(-40);
    }
    if ((Number(from.xp) || 0) > (Number(into.xp) || 0)) into.xp = Number(from.xp);
    if (from.rev != null && (into.rev == null || Number(from.rev) > Number(into.rev))) into.rev = Number(from.rev);
    return changed;
  }
  /* mine ← theirs, in place (mine stays the same object, so every module holding it sees the result).
     If theirs carries the higher rev it is the newer copy: its other fields (story, review, streak …)
     are taken. Either way the records of both are kept. Returns the number of records theirs added. */
  function mergeProgress(mine, theirs) {
    if (!mine || !theirs || typeof theirs !== 'object') return 0;
    var keep = { subs: 1, checks: 1, mocks: 1, badges: 1, reports: 1, xp: 1, rev: 1, studentId: 1 };
    if ((Number(theirs.rev) || 0) > (Number(mine.rev) || 0)) {
      Object.keys(theirs).forEach(function (k) { if (!keep[k]) mine[k] = theirs[k]; });
    }
    return mergeRecords(mine, theirs);
  }

  /* ------------------------------------------------------------------ API */
  var API = {
    get mode() { return state.mode; },
    get url() { return state.url; },
    get lastError() { return state.lastError; },
    onModeChange: null,

    retryCloud: function () {
      if (state.url && state.mode !== 'cloud') { state.mode = 'cloud'; return true; }
      return false;
    },
    setUrl: function (u) {
      state.url = (u || '').trim();
      state.mode = state.url ? 'cloud' : 'demo';
      try { localStorage.setItem(LS_URL, state.url || 'off'); } catch (e) {}
      return state.mode;
    },
    ping: function () {
      if (state.mode !== 'cloud') return Promise.resolve({ ok: false, mode: 'demo' });
      return post('ping', {}).then(function (r) { return { ok: !!r.ok, mode: 'cloud', sheet: r.sheet, students: r.students }; })
        .catch(function (e) { return { ok: false, mode: 'cloud', error: String(e.message || e) }; });
    },

    register: function (id, pw, name, code) {
      return call('register', { id: id, pw: pw, name: name, code: code || '' }, function () { return localRegister(id, pw, name); })
        .then(keepToken);
    },
    login: function (id, pw) {
      return call('login', { id: id, pw: pw }, function () { return localLogin(id, pw); })
        .then(keepToken);
    },

    enqueue: function (rows) {
      if (!rows || !rows.length) return;
      setOutbox(outbox().concat(rows));
    },
    pendingCount: function () { return outbox().length; },
    /* Oct 2026 (P1, lost lesson): one save at a time. A save asked for while one is in flight waits
       and is sent once, with the newest progress, when the first returns (so an older snapshot can
       never be written after a newer one from this tab, and the outbox is not sent twice). Every
       save stamps progress.rev one higher; Code.gs refuses a lower rev than it holds. */
    save: function (progress) {
      if (saving) {
        queued = progress;
        return new Promise(function (res) { waiters.push(res); });
      }
      return sendSave(progress);
    },
    mergeRecords: mergeRecords,
    mergeProgress: mergeProgress,

    /* fetch() is cancelled on unload; sendBeacon is not. */
    flushBeacon: function (progress) {
      var rows = outbox();
      if (!state.url || state.mode !== 'cloud' || !navigator.sendBeacon) return false;
      try {
        progress.rev = (Number(progress.rev) || 0) + 1;
        var body = new Blob([JSON.stringify({
          action: 'save', payload: { progress: progress, attempts: rows, token: state.token }
        })], { type: 'text/plain;charset=utf-8' });
        var ok = navigator.sendBeacon(state.url, body);
        if (ok) setOutbox([]);
        return ok;
      } catch (e) { return false; }
    },

    startSession: function (studentId) {
      state.sessionId = 'S' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
      state.sessionStart = Date.now();
      var row = { sessionId: state.sessionId, studentId: studentId, loginTs: new Date().toISOString(), logoutTs: '', durationSec: 0, items: 0, correct: 0 };
      try { localStorage.setItem(LS_SESSION, JSON.stringify(row)); } catch (e) {}
      return call('session', { kind: 'start', row: row }, function () { return localSession('start', row); });
    },
    endSession: function (studentId, items, correct) {
      if (!state.sessionId) return Promise.resolve({ ok: true });
      var row = {
        sessionId: state.sessionId, studentId: studentId,
        logoutTs: new Date().toISOString(),
        durationSec: Math.round((Date.now() - state.sessionStart) / 1000),
        items: items || 0, correct: correct || 0
      };
      state.sessionId = null;
      try { localStorage.removeItem(LS_SESSION); } catch (e) {}
      return call('session', { kind: 'end', row: row }, function () { return localSession('end', row); });
    },

    /* teacher */
    teacherLogin: function (pin) {
      return call('teacherLogin', { pin: pin }, function () {
        var d = db();
        if (state.url) return { ok: false, error: 'The class server did not answer. Try again in a moment.' };
        var want = d.teacherPin || '1234';
        return want === String(pin) ? { ok: true } : { ok: false, error: state.url ? 'The class server did not answer. Try again in a moment.' : 'Wrong teacher PIN.' };
      }).then(function (r) { if (r && r.ok && r.tt) state.tt = r.tt; return r; });
    },
    roster: function () { return call('roster', {}, localRoster); },
    detail: function (id) { return call('detail', { id: id }, function () { return localDetail(id); }); },
    assign: function (id, paper) { return call('assign', { id: id, paper: paper }, function () { return localAssign(id, paper); }); },

    /* reports */
    /* Oct 2026 (review): a report that did not reach the class server (offline, or the sign-in had
       expired) waits in cc.repbox.v1 and is sent again by flushReports(); it is never only "local"
       when a class server is set. */
    submitReport: function (rep) {
      if (state.url && state.mode !== 'cloud') { queueReport(rep); localSubmitReport(rep); return Promise.resolve({ ok: false, queued: true }); }
      return call('submitReport', { report: rep }, function () { queueReport(rep); return localSubmitReport(rep); })
        .then(function (r) { if (state.url && (!r || !r.ok) && !(r && r.queued)) queueReport(rep); return r; });
    },
    flushReports: function () {
      var box = repbox(); if (!box.length || state.mode !== 'cloud' || !state.token) return Promise.resolve({ ok: true, sent: 0 });
      var rep = box[0];
      return post('submitReport', { report: rep }).then(function (r) {
        if (r && r.ok) { setRepbox(repbox().filter(function (x) { return x.id !== rep.id; })); return API.flushReports(); }
        return r;
      }, function () { return { ok: false }; });
    },
    pendingReports: function () { return repbox().length; },
    intendsCloud: function () { return !!state.url; },
    reports: function (studentId) { return call('reports', { studentId: studentId }, function () { return localReports(studentId); }); },
    markReport: function (id, mark) { return call('markReport', { id: id, mark: mark }, function () { return localMarkReport(id, mark); }); },
    /* assignments: kind = 'list' | 'set' | 'remove' */
    assignments: function (kind, row) { return call('assignments', { kind: kind, row: row }, function () { return localAssignments(kind, row); }); },
    /* projector: kind = 'post' | 'list' | 'clear' */
    projector: function (kind, row) { return call('projector', { kind: kind, row: row }, function () { return localProjector(kind, row); }); },
    /* House Cup: { ok, cohort, totals:{compass,bridge,lexicon,loom}, members:{…} } — totals only, no names. */
    /* AI marking status (teacher): { ok, enabled, budgetLeft } */
    aiStatus: function () { return call('aiStatus', {}, function () { return { ok: true, enabled: false }; }); },
    houses: function (cohort) { return call('houses', { cohort: cohort || '' }, function () { return localHouses(cohort); }); },

    localCount: function () { return Object.keys(db().students).length; }
  };

  var LS_REPBOX = 'cc.repbox.v1';
  function repbox() { try { return JSON.parse(localStorage.getItem(LS_REPBOX)) || []; } catch (e) { return []; } }
  function setRepbox(b) { try { localStorage.setItem(LS_REPBOX, JSON.stringify(b.slice(-30))); } catch (e) {} }
  function queueReport(rep) { var b = repbox().filter(function (x) { return x.id !== rep.id; }); b.push(rep); setRepbox(b); }
  function keepToken(r) {
    if (r && r.ok && r.token) {
      state.token = r.token;
      try { localStorage.setItem(LS_TOKEN, r.token); } catch (e) {}
    }
    return r;
  }
  API.clearToken = function () {
    if (state.mode === 'cloud' && state.token) { try { post('logout', {}, true).catch(function () {}); } catch (e) {} }
    state.token = null;
    try { localStorage.removeItem(LS_TOKEN); } catch (e) {}
  };

  global.API = API;
})(window);
