/* ===========================================================================
   QUILLMOOR ACADEMY · THE OBSERVATORY — guide.js  (12 Nov 2026)
   The Scriptorium's High and Medium guidance: one question per decision
   (triage, introduction, overview, detail A, detail B), and the report is
   built in four panes as she answers. Scripts: guide-content.js. Contract:
   docs/GUIDANCE-LEVELS.md.

   HIGH    every step is multiple choice with one right answer. A wrong option
           is greyed out and its hint appears (never the answer); she chooses
           again until she is right.
   MEDIUM  the same steps as free text with a Commit button. A rule check runs
           first, then the AI check (cfg.check → the guideCheck action). A
           "revise" verdict shows a hint; she edits and commits again, or keeps
           her answer unchanged (an override).

   Levels (19 Nov 2026, T.Chris): a chart can have a script at B1, B2 and C1. The original scripts (guide/<id>.js,
   key <id>) are the BASE level (C1: their reports read at Band 8); the others live in guide/<id>.b1.js and
   guide/<id>.b2.js (keys <id>.b1, <id>.b2). window.GUIDE_BASE_CEFR overrides the base level.
   Guide.has(promptId, cefr)      → is there a script for this chart at this level? (no cefr: the base level)
   Guide.hasAny(promptId)         → a script at any level
   Guide.ready(promptId, cefr)    → is it loaded?   Guide.load(promptId, cefr, done)  (load(id, done) still works)
   Guide.script(promptId, cefr)   → the script
   Guide.steps(script)            → flat [{ step, section, first, n, of }] in order
   Guide.essay(script, answers)   → { panes:[4], text }   answers = { stepId: text }
   Guide.key(script)              → { stepId: the right option } (tests, High)
   Guide.options(step, script)    → the four options; the right one's place is balanced over the script (each of the
                                    four places holds it equally often, ±1; never the same place twice in a row)
   Guide.localCheck(step, entry)  → { verdict:'accept'|'revise'|'unsure', hint }
   Guide.mount(host, cfg)         → { stop, text }
        cfg = { prompt, level:'high'|'medium', cefr:'B1'|'B2'|'C1', studentId, check(payload)→Promise, onSubmit(res), onQuit(), onResume() }
   Layout (19 Nov 2026, T.Chris): a floating bar at the top with the task, a phase countdown (Triage / Writing / Review),
   a 20-minute countdown for the whole report and the running count of wrong answers; on the left the plan and the
   report as they are built; on the right the chart and the question, beside the part being built.
   ES5 only (old iPads).
   =========================================================================== */
(function (global) {
  'use strict';

  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function scripts() { return global.GUIDE_SCRIPTS || {}; }
  /* A script lives in guide/<promptId>.js and is fetched the first time it is needed (about 45 KB each; 48 charts).
     guide-index.js lists the charts that have one. has() = there is a script; ready() = it is loaded. */
  function index() { return global.GUIDE_INDEX || []; }
  var CEFRS = ['B1', 'B2', 'C1'];
  function base() { var b = String(global.GUIDE_BASE_CEFR || 'C1').toUpperCase(); return CEFRS.indexOf(b) >= 0 ? b : 'C1'; }
  function lvl(c) { c = String(c || base()).toUpperCase(); return CEFRS.indexOf(c) >= 0 ? c : base(); }
  function keyOf(id, cefr) { var c = lvl(cefr); return c === base() ? id : id + '.' + c.toLowerCase(); }
  function ready(id, cefr) { return !!(id && scripts()[keyOf(id, cefr)]); }
  function has(id, cefr) { return ready(id, cefr) || index().indexOf(keyOf(id, cefr)) >= 0; }
  function hasAny(id) { for (var i = 0; i < CEFRS.length; i++) if (has(id, CEFRS[i])) return true; return false; }
  var loading = {};
  function load(id, cefr, done) {
    if (typeof cefr === 'function') { done = cefr; cefr = base(); }
    var k = keyOf(id, cefr);
    if (ready(id, cefr)) { done(true); return; }
    if (!has(id, cefr) || !global.document) { done(false); return; }
    if (loading[k]) { loading[k].push(done); return; }
    loading[k] = [done];
    var s = global.document.createElement('script'), fin = function (ok) { var q = loading[k] || []; delete loading[k]; q.forEach(function (f) { try { f(ok && ready(id, cefr)); } catch (e) {} }); };
    s.src = 'guide/' + k + '.js?v=' + (global.GUIDE_VERSION || '1'); s.async = true;
    s.onload = function () { fin(true); }; s.onerror = function () { fin(false); };
    global.document.head.appendChild(s);
  }
  function script(id, cefr) { return scripts()[keyOf(id, cefr)] || null; }
  function hashStr(x) { var h = 7; x = String(x); for (var i = 0; i < x.length; i++) h = (h * 31 + x.charCodeAt(i)) % 1000003; return h; }
  function mmss(s) { var m = Math.floor(s / 60), x = s % 60; return m + ':' + (x < 10 ? '0' : '') + x; }
  function wordsOf(t) { var m = String(t || '').trim().match(/[A-Za-z0-9][A-Za-z0-9'’.,%$-]*/g); return m ? m.length : 0; }

  function steps(sc) {
    var out = [];
    (sc.sections || []).forEach(function (sec) {
      (sec.steps || []).forEach(function (st, i) { out.push({ step: st, section: sec, first: i === 0, n: i + 1, of: sec.steps.length }); });
    });
    return out;
  }
  function key(sc) { var k = {}; steps(sc).forEach(function (x) { k[x.step.id] = x.step.ok; }); return k; }

  /* Where the right option sits, step by step (T.Chris, 19 Nov 2026: "evenly balance the placement of the correct
     answer"): blocks of four steps each use the four places once, in an order fixed by the script (a reload does not
     move them), so every place holds the right answer equally often (±1) and never twice in a row. */
  var posCache = {};
  function placeOf(st, sc) {
    if (!sc) return null;
    var k = (sc.promptId || '') + '·' + (sc.tier || '') + '·' + (sc.version || 1), m = posCache[k];
    if (!m) {
      m = posCache[k] = {}; var fl = steps(sc), perms = [], prev = -1;
      for (var b = 0; b * 4 < fl.length; b++) {
        var pool = [0, 1, 2, 3], perm = [], h = hashStr(k + '·block' + b);
        while (pool.length) { perm.push(pool.splice(h % pool.length, 1)[0]); h = Math.floor(h / 3) + 7; }
        if (perm[0] === prev) perm.push(perm.shift());
        prev = perm[3]; perms = perms.concat(perm);
      }
      fl.forEach(function (x, i) { m[x.step.id] = perms[i]; });
    }
    return m[st.id] == null ? null : m[st.id];
  }
  function options(st, sc) {
    var wrongs = (st.wrong || []).map(function (w) { return { t: w[0], hint: w[1] }; }), h = hashStr(st.id + '·order'), out = [];
    while (wrongs.length) { out.push(wrongs.splice(h % wrongs.length, 1)[0]); h = Math.floor(h / 3) + hashStr(st.id + out.length); }
    var at = placeOf(st, sc);
    if (at == null) at = hashStr(st.id + '·right') % 4;
    out.splice(Math.min(at, out.length), 0, { t: st.ok, ok: true });
    return out;
  }

  /* ----------------------------------------------------------- the essay */
  function cap(t) { return t.replace(/^(\s*[:;.,]?\s*)([a-z])/, function (m, a, b) { return a + b.toUpperCase(); }); }
  /* What she typed, made ready for its place: no doubled punctuation, no stray spaces. */
  function tidy(st, raw) {
    var t = String(raw == null ? '' : raw).replace(/\s+/g, ' ').replace(/[“”]/g, '"').replace(/[‘’]/g, "'").trim();
    var pre = st.pre == null ? ' ' : st.pre, post = st.post || '';
    if (/,/.test(pre)) t = t.replace(/^[,;]\s*/, '');
    if (/\./.test(pre)) t = t.replace(/^\.\s*/, '');
    /* the engine supplies every sentence end (post '.', or the next step's pre '. '), so her own closing marks go */
    if (post) { while (t && '.,;:!?'.indexOf(t.charAt(t.length - 1)) >= 0) t = t.slice(0, -1).trim(); }
    else t = t.replace(/[,;.!?]+$/, '').trim();
    t = t.replace(/^([.:;])\s*/, '$1 ');
    return t;
  }
  function essay(sc, answers) {
    var panes = ['', '', '', ''];
    (sc.sections || []).forEach(function (sec) {
      if (sec.pane == null) return;
      var out = '';
      (sec.steps || []).forEach(function (st) {
        var a = answers[st.id]; if (a == null || a === '') return;
        var t = tidy(st, a), pre = st.pre == null ? ' ' : st.pre;
        if (!out) pre = '';
        /* she typed her own full stop (". Its figure"): no space before it */
        if (/^[.:;,]/.test(t)) pre = '';
        if (!out || /[.!?]\s*$/.test(out + pre) || /^[.]\s*/.test(t)) t = cap(t);
        out += pre + t + (st.post || '');
      });
      panes[sec.pane] = out.replace(/\s+([,.;:])/g, '$1').replace(/([,.;:])\1+/g, '$1').replace(/,\./g, '.').replace(/\s{2,}/g, ' ').trim();
    });
    return { panes: panes, text: panes.filter(Boolean).join('\n\n') };
  }
  /* The pane as it stands before this step (the sentence so far). */
  function soFar(sc, answers, stepId) {
    var cut = {}, hit = false, pane = null;
    steps(sc).forEach(function (x) { if (x.step.id === stepId) { hit = true; pane = x.section.pane; } if (!hit && answers[x.step.id] != null) cut[x.step.id] = answers[x.step.id]; });
    return pane == null ? '' : essay(sc, cut).panes[pane];
  }

  /* --------------------------------------------- Medium: the rule check */
  function norm(t) { return String(t || '').toLowerCase().replace(/[“”]/g, '"').replace(/[‘’]/g, "'").replace(/\s+/g, ' ').replace(/^\s+|\s+$/g, '').replace(/[.,;!]+$/, '').trim(); }
  function rx(src) { try { return new RegExp(src, 'i'); } catch (e) { return null; } }
  /* accept: every rule passes and no known slip → 'accept' (st.ai asks the AI for a second opinion on grammar);
     a known slip → 'revise' with its own hint; anything else → 'unsure' (the AI decides, or the step hint is shown). */
  function localCheck(st, entry, sc) {
    var t = norm(entry);
    if (!t) return { verdict: 'revise', hint: 'Write your answer first.', empty: true };
    /* a name typed without its capitals */
    var proper = (sc && sc.proper) || [], raw = String(entry || '');
    for (var pi = 0; pi < proper.length; pi++) {
      /* whole words only: "US" must not catch "much" or "bus" */
      var pq = proper[pi].replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      if (new RegExp('(^|[^a-z0-9])' + pq.toLowerCase() + '([^a-z0-9]|$)').test(t) && !new RegExp('(^|[^A-Za-z0-9])' + pq + '([^A-Za-z0-9]|$)').test(raw)) return { verdict: 'revise', hint: 'Check the capital letters: names keep them.', known: true };
    }
    if (t === norm(st.ok)) return { verdict: 'accept', exact: true };
    var rj = st.reject || [];
    for (var i = 0; i < rj.length; i++) { var r = rx(rj[i].re); if (r && r.test(t)) return { verdict: 'revise', hint: rj[i].hint, known: true }; }
    var groups = st.accept || [];
    var all = groups.length > 0 && groups.every(function (g) { return g.some(function (alt) { var r2 = rx(alt); return r2 && r2.test(t); }); });
    return all ? { verdict: 'accept' } : { verdict: 'unsure', hint: st.hint || 'Not yet. Read the question again and compare your answer with the chart.' };
  }
  /* A hint must not hand over the answer: used on what the AI sends back. */
  function leaks(st, hint) {
    var a = norm(st.ok).replace(/^[:;.,]\s*/, ''), h = norm(hint);
    if (!a) return false;
    if (a.length >= 4) return h.indexOf(a) >= 0;
    /* a short answer (a preposition, a figure): only when the hint quotes it or it is a number */
    var q = a.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return /^\d+$/.test(a) ? new RegExp('(^|[^0-9])' + q + '([^0-9]|$)').test(h) : new RegExp('["\'“‘]' + q + '["\'”’]').test(h);
  }

  /* ---------------------------------------------------------------- UI */
  var LEVEL_NAME = { high: 'High guidance', medium: 'Medium guidance' };
  var PANE_NAME = ['Introduction', 'Overview', 'Detail A', 'Detail B'], PANE_TARGET = [30, 45, 60, 60];
  var BAND = { B1: 'Band 4.0–5.0', B2: 'Band 5.5–6.5', C1: 'Band 7.0–8.0' };
  var TYPE_NAME = { line: 'Line graph', bar: 'Bar chart', pie: 'Pie charts', table: 'Table', mixed: 'Two visuals', process: 'Process diagram', map: 'Maps' };
  /* The two clocks (T.Chris, 19 Nov 2026): a countdown for the phase she is in and one for the whole report.
     PHASES = [id, label, seconds]; GUIDE_PHASE_BY 'activity' (default: the phase follows where she is: the triage
     steps, the four paragraphs, the finished report) or 'clock' (the phase changes at fixed times). Past zero a clock
     shows red overtime ("+1:20") and never stops her. */
  function phases() { return global.GUIDE_PHASES || [['triage', 'Triage', 240], ['writing', 'Writing', 780], ['review', 'Review', 180]]; }
  function totalSecs() { var t = 0; phases().forEach(function (p) { t += p[2]; }); return t; }
  var NARROW = 720;

  function mount(host, cfg) {
    var W = global.Writer, p = global.Charts.prompt(cfg.prompt), level = cfg.level === 'medium' ? 'medium' : 'high';
    var cefr = lvl(cfg.cefr), sc = script(p.id, cefr);
    if (!sc) { cefr = base(); sc = script(p.id, cefr); }
    var flat = steps(sc), high = level === 'high', PH = phases(), TOTAL = totalSecs(), byClock = global.GUIDE_PHASE_BY === 'clock';
    /* the base level keeps the old key, so runs saved before the levels came back */
    var saveKey = 'cc.guide.v1.' + String(cfg.studentId || 'me').toLowerCase() + '.' + p.id + '.' + level + (cefr === base() ? '' : '.' + cefr);
    var state = { i: 0, answers: {}, tries: {}, hints: {}, over: {}, ai: {}, off: {}, t0: Date.now(), carried: 0, done: false, tick: null, busy: false, last: null, polished: false, lastHint: {}, lastEntry: {}, draft: {}, wrong: 0, ph: [0, 0, 0], lastTick: Date.now() };

    /* a run that was left half-way (a reload, a closed tab) comes back */
    try {
      var sv = JSON.parse(localStorage.getItem(saveKey) || 'null');
      if (sv && sv.version === (sc.version || 1) && sv.i > 0 && sv.i <= flat.length) {
        state.i = sv.i; state.answers = sv.answers || {}; state.tries = sv.tries || {}; state.hints = sv.hints || {}; state.over = sv.over || {}; state.ai = sv.ai || {}; state.off = sv.off || {}; state.lastHint = sv.lastHint || {}; state.polishText = sv.polish || null; state.carried = sv.seconds || 0; state.wrong = sv.wrong || 0; state.ph = sv.ph && sv.ph.length === 3 ? sv.ph : [0, 0, 0]; state.resumed = true;
      }
    } catch (e) {}
    function seconds() { return state.carried + Math.round((Date.now() - state.t0) / 1000); }
    function persist() {
      try { localStorage.setItem(saveKey, JSON.stringify({ version: sc.version || 1, i: state.i, answers: state.answers, tries: state.tries, hints: state.hints, over: state.over, ai: state.ai, off: state.off, lastHint: state.lastHint, polish: state.polished ? paneTexts() : null, seconds: seconds(), wrong: state.wrong, ph: state.ph })); } catch (e) {}
    }
    function forget() { try { localStorage.removeItem(saveKey); } catch (e) {} }

    /* 19 Nov 2026 (T.Chris, second request): four panes. Top: the plan (two columns) and the four paragraphs, each
       scrolling under its title in four rows, with the clocks and an Expand button. Left: the chart with its task, title,
       type and level. Right: the question. Bottom: the whole report, shown when it is finished or when Expand is pressed;
       whenever it opens, the page scrolls so that it fills the screen. */
    host.innerHTML = '<div class="wr gd gd-' + level + '">' +
      '<div class="gd-top" id="gd-top">' +
        '<div class="gd-topbar">' +
          '<button class="btn ghost sm" id="wr-quit" aria-label="Leave">✕</button>' +
          '<div class="wr-phases" id="gd-secs">' + sc.sections.map(function (s, i) { return '<span data-s="' + i + '">' + esc(s.title.split(' · ')[0]) + '</span>'; }).join('') + '</div>' +
          '<span class="wr-words" id="wr-words">0 words</span>' +
          '<span class="gd-timer gd-tphase" id="gd-tphase" title="Time left for this part. The recommended split is ' + PH.map(function (x) { return x[1] + ' ' + Math.round(x[2] / 60) + ' min'; }).join(', ') + '."><small id="gd-tphase-l">' + esc(PH[0][1]) + '</small><b id="gd-tphase-n">' + mmss(PH[0][2]) + '</b></span>' +
          '<span class="gd-timer gd-ttotal" id="gd-ttotal" title="Time left for the whole report (' + Math.round(TOTAL / 60) + ' minutes). Past zero it counts on; it never stops you."><small>Total</small><b id="wr-clock">' + mmss(TOTAL) + '</b></span>' +
          '<span class="gd-wrong" id="gd-wrong" title="Wrong answers so far">✗ <b id="gd-wrong-n">0</b><span class="gd-wl"> wrong</span></span>' +
          '<button type="button" class="btn sm gd-expand" id="gd-expand" aria-expanded="false" aria-controls="gd-full">Expand ▾</button>' +
        '</div>' +
        '<div class="gd-bar" aria-hidden="true"><i id="gd-bar"></i></div>' +
        '<div class="gd-strip" id="gd-strip">' +
          '<section class="gd-col gd-plan" id="gd-triage"><h4 class="gd-colh"><b>Plan</b><span class="tiny">not counted</span></h4><ul class="gd-sbody" id="gd-tlist"></ul></section>' +
          [0, 1, 2, 3].map(function (i) {
            return '<section class="gd-col" id="gd-sc' + i + '"><h4 class="gd-colh"><b>' + PANE_NAME[i] + '</b><span class="tiny"><i id="gd-sw' + i + '">0</i> / ~' + PANE_TARGET[i] + '</span></h4><div class="gd-sbody" id="gd-s' + i + '"></div></section>';
          }).join('') +
        '</div>' +
      '</div>' +
      '<div class="gd-grid" id="gd-grid">' +
        '<div class="gd-fig card" id="gd-fig">' +
          '<div class="gd-prompt" id="gd-prompt"><p class="gd-pmeta"><b>' + esc(LEVEL_NAME[level]) + '</b> · ' + esc(cefr) + ' (' + BAND[cefr] + ') · ' + esc(TYPE_NAME[p.type] || p.type) + ' · ' + esc(p.mode || '') + '</p>' +
            '<p class="gd-ptext" id="gd-ptext">' + esc(p.rubric || p.title || '') + '</p><button type="button" class="linky gd-pmore" id="gd-pmore" aria-expanded="false">Show the whole task</button></div>' +
          '<div class="gd-chartbox" id="gd-chartbox"><div id="wr-chart"></div></div>' +
        '</div>' +
        '<div class="gd-side" id="gd-side">' +
          '<div class="card gd-q" id="gd-q" aria-live="polite"></div>' +
          '<div class="gd-qdone hidden" id="gd-qdone"><p>Your report is built. It is in the pane below.</p><button type="button" class="btn primary" id="gd-tofull">Go to your report ↓</button></div>' +
          '<p class="tiny gd-lead">' + (high
            ? 'One decision at a time. Each right choice writes the next piece of your plan or report in the top pane. A wrong choice is greyed out and you get a hint, then you choose again.'
            : 'One decision at a time, in your own words. Press Commit and your answer is checked. If the check asks you to look again, you can change your answer or keep it as it is.') + ' Tap a point on the chart to read its exact value. Expand shows the whole report.</p>' +
        '</div>' +
      '</div>' +
      '<section class="gd-full hidden" id="gd-full" aria-label="Your report">' +
        '<div class="gd-fullh"><b>Your report</b><span class="tiny" id="gd-report-w"></span><span class="grow"></span><button type="button" class="btn ghost sm" id="gd-collapse">Back to the question ▴</button></div>' +
        '<div class="gd-fullgrid">' +
          '<div class="gd-build" id="gd-build">' +
            [0, 1, 2, 3].map(function (i) {
              return '<div class="wr-box gd-pane" id="gd-box' + i + '"><div class="wr-boxh"><b>' + PANE_NAME[i] + '</b><span class="tiny">~' + PANE_TARGET[i] + ' words · <i id="gd-w' + i + '">0</i></span></div><div class="gd-text" id="gd-p' + i + '"></div></div>';
            }).join('') +
          '</div>' +
          '<div class="gd-fullend" id="gd-fullend"><div class="card gd-fplan"><div class="wr-boxh"><b>Your plan</b><span class="tiny">not counted as words</span></div><ul id="gd-fplist"></ul></div><div id="wr-panel"></div></div>' +
        '</div>' +
      '</section>' +
    '</div>';

    function drawChart() { global.Charts.render(host.querySelector('#wr-chart'), p, { readout: true, showRubric: false, showTitle: true, onPick: function () {} }); }
    drawChart();
    var q = host.querySelector('#gd-q'), full = host.querySelector('#gd-full'), xb = host.querySelector('#gd-expand');
    state.expanded = false;
    function narrow() { return (global.innerWidth || 1024) < NARROW; }
    function fullOpen() { return state.done || state.expanded; }
    /* the app's own bars stay at the top (the ribbon always; the header when it shows): the task bar sticks just below them */
    function stickTop() {
      try {
        var t = 0;
        ['.ribbon', 'header.bar'].forEach(function (sel) {
          var el = global.document.querySelector(sel); if (!el || !el.offsetHeight) return;
          var cs = global.getComputedStyle(el); if (cs.display === 'none' || (cs.position !== 'sticky' && cs.position !== 'fixed')) return;
          t = Math.max(t, (parseFloat(cs.top) || 0) + el.offsetHeight);
        });
        var top = host.querySelector('#gd-top'), gd = host.querySelector('.gd');
        top.style.top = t + 'px';
        /* on a phone only the bar sticks; the strip scrolls with the page */
        var sticky = top.offsetHeight;
        gd.style.setProperty('--gd-stick', (t + sticky + (narrow() ? 8 : 10)) + 'px');
        gd.style.setProperty('--gd-bar', (t + host.querySelector('.gd-topbar').offsetHeight + 12) + 'px');
      } catch (e) {}
    }
    /* the chart fills what the left pane has left after the task text, so the chart and the question fit one screen */
    function fitChart() {
      try {
        var box = host.querySelector('#gd-chartbox'), fig = host.querySelector('#gd-fig');
        if (narrow()) { box.style.removeProperty('--gd-chart-h'); fig.style.maxHeight = ''; return; }
        /* the left pane starts where the grid starts at the top of the page (a little lower than where it sticks later) */
        var gtop = Math.max(parseFloat(getComputedStyle(host.querySelector('.gd')).getPropertyValue('--gd-stick')) || 0, host.querySelector('#gd-grid').getBoundingClientRect().top + (global.pageYOffset || 0));
        var avail = (global.innerHeight || 800) - gtop - 10;
        fig.style.maxHeight = avail + 'px';
        var svgs = box.querySelectorAll('svg.cc-chart'), sh = 0;
        Array.prototype.forEach.call(svgs, function (s) { sh += s.getBoundingClientRect().height; });
        /* everything in the left pane that is not a drawn chart (task text, titles, a table, the readout) keeps its size */
        var rest = fig.scrollHeight - sh, n = svgs.length || 1;
        box.style.setProperty('--gd-chart-h', Math.max(n > 1 ? 160 : 200, Math.round((avail - rest - 4) / n)) + 'px');
      } catch (e) {}
    }
    /* the strip shows the newest words: each column scrolls to its end, and on a phone the strip scrolls to the part being built */
    function stripFollow() {
      var x = flat[state.i], on = state.done ? null : (!x || x.section.pane == null ? 'gd-triage' : 'gd-sc' + x.section.pane);
      Array.prototype.forEach.call(host.querySelectorAll('.gd-col'), function (c) {
        c.classList.toggle('on', c.id === on);
        var b = c.querySelector('.gd-sbody'); if (b) b.scrollTop = b.scrollHeight;
      });
      var strip = host.querySelector('#gd-strip'), col = on && host.querySelector('#' + on);
      if (narrow() && col && strip) { try { strip.scrollTo({ left: col.offsetLeft - strip.offsetLeft - 6, behavior: 'smooth' }); } catch (e) { strip.scrollLeft = col.offsetLeft; } }
    }
    function scrollToFull() {
      try {
        var r = full.getBoundingClientRect(), bar = parseFloat(getComputedStyle(host.querySelector('.gd')).getPropertyValue('--gd-bar')) || 100;
        global.scrollBy({ top: r.top - bar, behavior: 'smooth' });
      } catch (e) {}
    }
    /* the bottom pane: shown when the report is finished or while Expand is on; it takes the screen */
    function paintFull(scroll) {
      var open = fullOpen();
      full.classList.toggle('hidden', !open);
      host.querySelector('.gd').classList.toggle('gd-fullon', open);
      host.querySelector('#gd-collapse').classList.toggle('hidden', state.done);
      xb.setAttribute('aria-expanded', open ? 'true' : 'false');
      xb.textContent = state.done ? 'Report ▾' : open ? 'Collapse ▴' : 'Expand ▾';
      host.querySelector('#gd-qdone').classList.toggle('hidden', !state.done);
      q.classList.toggle('hidden', false);
      /* the finished card (with the Wards button) moves into the bottom pane, above the Wards */
      var end = host.querySelector('#gd-fullend'), side = host.querySelector('#gd-side');
      if (state.done && q.parentNode !== end) end.insertBefore(q, end.firstChild);
      if (!state.done && q.parentNode !== side) side.insertBefore(q, side.firstChild);
      stickTop();
      if (open && scroll) setTimeout(scrollToFull, 30);
    }
    function placeStrip() {
      var strip = host.querySelector('#gd-strip'), top = host.querySelector('#gd-top');
      if (narrow()) { if (strip.parentNode === top) top.parentNode.insertBefore(strip, top.nextSibling); }
      else if (strip.parentNode !== top) top.appendChild(strip);
    }
    function relayout() { placeStrip(); stickTop(); fitChart(); stripFollow(); }
    placeStrip(); stickTop(); global.addEventListener('resize', relayout);
    xb.addEventListener('click', function () {
      if (state.done) { scrollToFull(); return; }
      state.expanded = !state.expanded; paintFull(state.expanded);
      if (!state.expanded) { try { global.scrollTo({ top: 0, behavior: 'smooth' }); } catch (e) {} relayout(); }
    });
    host.querySelector('#gd-collapse').addEventListener('click', function () { state.expanded = false; paintFull(false); try { global.scrollTo({ top: 0, behavior: 'smooth' }); } catch (e) {} relayout(); });
    host.querySelector('#gd-tofull').addEventListener('click', scrollToFull);
    var pm = host.querySelector('#gd-pmore');
    pm.addEventListener('click', function () { var on = host.querySelector('#gd-prompt').classList.toggle('open'); pm.setAttribute('aria-expanded', on ? 'true' : 'false'); pm.textContent = on ? 'Show less' : 'Show the whole task'; fitChart(); });
    function paintWrong() { var n = host.querySelector('#gd-wrong-n'); if (n) n.textContent = state.wrong; host.querySelector('#gd-wrong').classList.toggle('some', state.wrong > 0); }
    function bumpWrong() { state.wrong++; paintWrong(); }
    paintWrong();

    /* ------------------------------------------------------- the clocks */
    function phaseNow() {
      if (byClock) { var el = seconds(), acc = 0; for (var k = 0; k < PH.length; k++) { acc += PH[k][2]; if (el < acc) return k; } return PH.length - 1; }
      if (state.done) return 2;
      var x = flat[state.i]; return !x || x.section.pane == null ? 0 : 1;
    }
    function clockText(rem) { return rem >= 0 ? mmss(rem) : '+' + mmss(-rem); }
    function paintClocks() {
      var k = phaseNow(), rem;
      if (byClock) { var acc = 0; for (var j = 0; j <= k; j++) acc += PH[j][2]; rem = acc - seconds(); if (k < PH.length - 1) rem = Math.max(0, rem); }
      else rem = PH[k][2] - Math.round(state.ph[k] / 1000);
      var tp = host.querySelector('#gd-tphase'), tt = host.querySelector('#gd-ttotal'), tot = TOTAL - seconds();
      if (!tp || !tt) return;
      host.querySelector('#gd-tphase-l').textContent = PH[k][1];
      host.querySelector('#gd-tphase-n').textContent = clockText(rem);
      tp.classList.toggle('over', rem < 0); tp.classList.toggle('low', rem >= 0 && rem <= 30);
      tp.setAttribute('data-phase', PH[k][0]);
      host.querySelector('#wr-clock').textContent = clockText(tot);
      tt.classList.toggle('over', tot < 0); tt.classList.toggle('low', tot >= 0 && tot <= 60);
    }
    function tickPhase() { var now = Date.now(); state.ph[phaseNow()] += Math.min(now - state.lastTick, 5000); state.lastTick = now; }

    function paneTexts() {
      if (state.polished) return [0, 1, 2, 3].map(function (i) { var ta = host.querySelector('#gd-ta' + i); return ta ? ta.value.trim() : ''; });
      return essay(sc, state.answers).panes;
    }
    function text() { return paneTexts().filter(Boolean).join('\n\n'); }

    function paintPanes() {
      if (state.polished) { paintCount(); return; }
      var panes = essay(sc, state.answers).panes, before = state.last ? soFar(sc, state.answers, state.last) : null, lastPane = null;
      if (state.last) flat.forEach(function (x) { if (x.step.id === state.last) lastPane = x.section.pane; });
      [0, 1, 2, 3].forEach(function (i) {
        var el = host.querySelector('#gd-p' + i), t = panes[i], h;
        if (!t) h = '<span class="gd-empty">' + (i === 0 ? 'Your introduction appears here.' : i === 1 ? 'Your overview appears here.' : 'This paragraph appears here.') + '</span>';
        else if (i === lastPane && before != null && t.indexOf(before) === 0 && before.length < t.length) h = esc(before) + '<mark class="gd-new">' + esc(t.slice(before.length)) + '</mark>';
        else h = esc(t);
        el.innerHTML = h; host.querySelector('#gd-s' + i).innerHTML = h;
        host.querySelector('#gd-box' + i).classList.toggle('on', !state.done && flat[state.i] && flat[state.i].section.pane === i);
      });
      /* the plan: the triage answers, two columns of up to four rows */
      var tl = host.querySelector('#gd-tlist'), rows = [];
      flat.forEach(function (x) { if (x.section.pane == null && state.answers[x.step.id] != null) rows.push('<li title="' + esc(x.step.label + ': ' + state.answers[x.step.id]) + '"><span>' + esc(x.step.label) + '</span><b>' + esc(state.answers[x.step.id]) + '</b></li>'); });
      tl.innerHTML = rows.join('') || '<li class="gd-empty">Mode, tense, units and your two groups appear here as you answer.</li>';
      host.querySelector('#gd-fplist').innerHTML = tl.innerHTML;
      paintCount(); stripFollow();
    }
    function paintCount() {
      var ps = paneTexts(), n = wordsOf(ps.join(' '));
      ps.forEach(function (t, i) {
        var w = host.querySelector('#gd-w' + i), sw = host.querySelector('#gd-sw' + i), wn = wordsOf(t);
        if (w) w.textContent = wn; if (sw) sw.textContent = wn;
        /* Medium polish: the strip follows what she types below */
        if (state.polished) host.querySelector('#gd-s' + i).textContent = t;
      });
      host.querySelector('#wr-words').textContent = n + ' words';
      host.querySelector('#gd-report-w').textContent = n + (state.done ? ' words' : ' words so far');
      host.querySelector('#gd-bar').style.width = Math.round(100 * Math.min(state.i, flat.length) / flat.length) + '%';
      var cur = state.done ? sc.sections.length : sc.sections.indexOf((flat[state.i] || {}).section);
      Array.prototype.forEach.call(host.querySelectorAll('#gd-secs span'), function (s, i) { s.classList.toggle('on', i === cur); s.classList.toggle('past', i < cur); });
    }

    function contextLine(x) {
      if (x.section.pane == null) return '';
      var sf = soFar(sc, state.answers, x.step.id), pre = x.step.pre == null ? ' ' : x.step.pre;
      if (!sf) pre = '';
      var tail = sf.length > 150 ? '… ' + sf.slice(sf.length - 150).replace(/^\S*\s/, '') : sf;
      return '<p class="gd-ctx"><span class="tiny">Your ' + esc(PANE_NAME[x.section.pane].toLowerCase()) + ' so far</span>' + esc(tail) + esc(pre) + '<span class="gd-gap">' + (high ? '?' : 'your words') + '</span>' + esc(x.step.post || '') + '</p>';
    }

    function paintStep() {
      var x = flat[state.i];
      if (!x) { finishCard(); return; }
      var st = x.step, off = state.off[st.id] || {};
      var h = '<p class="kicker">' + esc(x.section.title) + ' · step ' + x.n + ' of ' + x.of + ' · ' + esc(st.label) + '</p>' +
        (x.first && x.section.note ? '<p class="gd-note">' + esc(x.section.note) + '</p>' : '') +
        contextLine(x) + '<h3 class="gd-ask">' + esc(high ? st.ask : (st.askFree || st.ask)) + '</h3>';
      if (high) {
        h += '<div class="gd-opts" role="group" aria-label="Choose one">' + options(st, sc).map(function (o, i) {
          return '<button type="button" class="gd-opt' + (off[o.t] ? ' off' : '') + '" data-o="' + i + '"' + (off[o.t] ? ' disabled aria-disabled="true"' : '') + '>' + esc(o.t) + '</button>';
        }).join('') + '</div>';
      } else {
        h += '<p class="tiny gd-shape">Type: ' + esc(st.shape || 'your answer') + '</p>' +
          '<div class="gd-free"><input type="text" id="gd-in" autocomplete="off" autocapitalize="off" spellcheck="false" maxlength="300" value="' + esc(state.draft[st.id] || '') + '" aria-label="' + esc(st.label) + '">' +
          '<button type="button" class="btn primary" id="gd-commit">Commit</button></div>';
      }
      h += '<div class="gd-hint hidden" id="gd-hint" role="status"></div>' +
        '<p class="tiny gd-foot">Step ' + (state.i + 1) + ' of ' + flat.length + (state.i > 0 ? ' · <button type="button" class="linky" id="gd-restart">start again</button>' : '') + '</p>';
      q.innerHTML = h;
      if (state.lastHint[st.id]) showHint(st, state.lastHint[st.id], !high);
      if (!high) { var inp = q.querySelector('#gd-in'); if (inp && !state.resumedPaint) { try { inp.focus({ preventScroll: true }); } catch (e) { } } }
      state.resumedPaint = false;
    }

    function showHint(st, hint, withKeep, note) {
      var hb = q.querySelector('#gd-hint'); if (!hb) return;
      state.lastHint[st.id] = hint;
      hb.classList.remove('hidden');
      hb.innerHTML = '<b>Hint</b><span>' + esc(hint) + '</span>' + (note ? '<em class="tiny">' + esc(note) + '</em>' : '') +
        (withKeep ? '<div class="gd-keep"><span class="tiny">Change your answer and press Commit again, or</span> <button type="button" class="linky" id="gd-keep">keep my answer as it is</button></div>' : '');
    }

    function accept(st, value, how) {
      state.answers[st.id] = value; state.last = st.id;
      if (how === 'override') state.over[st.id] = 1;
      delete state.lastHint[st.id]; delete state.draft[st.id];
      state.i++; persist(); paintPanes();
      paintStep();
      /* keep the question in view (Expand stays open if she opened it: the report is what she is reading) */
      if (!state.expanded && !state.done) try {
        var top = parseFloat(getComputedStyle(host.querySelector('.gd')).getPropertyValue('--gd-stick')) || 120, r = q.getBoundingClientRect(), vh = global.innerHeight || 800;
        if (narrow() ? (r.top < top || r.top > vh * 0.55) : (r.top < top - 4 || r.bottom > vh + 40)) global.scrollBy({ top: r.top - top - 6, behavior: 'smooth' });
      } catch (e) {}
      var fo = q.querySelector(high ? '.gd-opt:not([disabled])' : '#gd-in'); if (fo && high) { try { fo.focus({ preventScroll: true }); } catch (e2) {} }
    }

    /* ------------------------------------------------ High: the options */
    q.addEventListener('click', function (ev) {
      var b = ev.target && ev.target.closest ? ev.target.closest('button') : null; if (!b || state.busy) return;
      var x = flat[state.i]; if (!x) return; var st = x.step;
      if (b.dataset.o != null && high) {
        var o = options(st, sc)[parseInt(b.dataset.o, 10)]; if (!o) return;
        state.tries[st.id] = (state.tries[st.id] || 0) + 1;
        if (o.ok) {
          b.classList.add('right'); state.busy = true;
          setTimeout(function () { state.busy = false; accept(st, st.ok, 'choice'); }, 380);
        } else {
          (state.off[st.id] = state.off[st.id] || {})[o.t] = 1; state.hints[st.id] = (state.hints[st.id] || 0) + 1; bumpWrong();
          b.classList.add('off'); b.disabled = true; b.setAttribute('aria-disabled', 'true');
          showHint(st, o.hint || 'Not this one. Look at the chart again.');
          persist();
        }
      } else if (b.id === 'gd-commit') { commit(st, false); }
      else if (b.id === 'gd-keep') { commit(st, true); }
      else if (b.id === 'gd-restart') {
        if (!global.confirm('Start this report again from the first step? Your answers so far will be cleared.')) return;
        forget(); state.polishText = null; state.wrong = 0; state.ph = [0, 0, 0]; paintWrong(); state.i = 0; state.answers = {}; state.tries = {}; state.hints = {}; state.over = {}; state.ai = {}; state.off = {}; state.lastHint = {}; state.draft = {}; state.last = null; state.carried = 0; state.t0 = Date.now();
        paintPanes(); paintStep();
      }
    });
    q.addEventListener('keydown', function (ev) { if (ev.key === 'Enter' && ev.target && ev.target.id === 'gd-in') { ev.preventDefault(); var x = flat[state.i]; if (x && !state.busy) commit(x.step, false); } });
    q.addEventListener('input', function (ev) { if (ev.target && ev.target.id === 'gd-in') { var x = flat[state.i]; if (x) state.draft[x.step.id] = ev.target.value; } });

    /* ---------------------------------------------- Medium: the commit */
    function commit(st, keep) {
      var inp = q.querySelector('#gd-in'); if (!inp) return;
      var entry = inp.value.replace(/\s+/g, ' ').trim();
      if (!entry) { showHint(st, 'Write your answer first.'); return; }
      if (keep) { accept(st, entry, 'override'); return; }
      state.tries[st.id] = (state.tries[st.id] || 0) + 1;
      var lc = localCheck(st, entry, sc), nth = state.tries[st.id];
      function revise(hint, note) {
        state.hints[st.id] = (state.hints[st.id] || 0) + 1; state.lastEntry[st.id] = entry; bumpWrong();
        showHint(st, hint || st.hint || 'Not yet. Read the question again and compare your answer with the chart.', true, note); persist();
      }
      if (lc.verdict === 'revise') { revise(nth >= 3 && st.hint2 ? st.hint2 : lc.hint); return; }
      if (lc.verdict === 'accept' && (lc.exact || !st.ai || !cfg.check)) { accept(st, entry, 'rule'); return; }
      if (!cfg.check) { revise(nth >= 2 && st.hint2 ? st.hint2 : lc.hint); return; }
      /* the AI check: a second reader for wording the rules do not know */
      var btn = q.querySelector('#gd-commit'), was = state.i;
      state.busy = true; btn.disabled = true; btn.textContent = 'Checking…'; inp.readOnly = true;
      var payload = { promptId: p.id, stepId: st.id, section: (flat[state.i].section.title || '').split(' · ')[0], ask: st.askFree || st.ask, expect: st.expect || st.ok, entry: entry, soFar: soFar(sc, state.answers, st.id) };
      var settled = false;
      var settle = function (r) {
        if (settled || state.quit) return; settled = true;
        if (state.i !== was || state.done || !q.querySelector('#gd-in')) return;
        state.busy = false; btn.disabled = false; btn.textContent = 'Commit'; inp.readOnly = false;
        if (r && r.ok && r.verdict === 'accept') { state.ai[st.id] = 'accept'; accept(st, entry, 'ai'); return; }
        if (r && r.ok && r.verdict === 'revise') {
          state.ai[st.id] = 'revise';
          var hint = r.hint && !leaks(st, r.hint) ? r.hint : (nth >= 2 && st.hint2 ? st.hint2 : st.hint);
          revise(hint, 'From the AI check. If you are sure of your answer, you may keep it.'); return;
        }
        /* no AI (offline, old server, budget spent): the rules decide */
        if (lc.verdict === 'accept') { accept(st, entry, 'rule'); return; }
        revise(nth >= 2 && st.hint2 ? st.hint2 : lc.hint);
      };
      var pr;
      try { pr = cfg.check(payload); } catch (e) { pr = null; }
      if (!pr || typeof pr.then !== 'function') { settle(null); return; }
      /* a slow server must not hold her up: after twelve seconds the rules decide */
      setTimeout(function () { settle(null); }, 12000);
      pr.then(settle, function () { settle(null); });
    }

    /* ------------------------------------------------------ the finish */
    function tally() {
      var first = 0, missTags = {}, over = Object.keys(state.over).length;
      flat.forEach(function (x) {
        var id = x.step.id;
        if ((state.tries[id] || 0) <= 1 && !state.over[id] && !state.hints[id]) first++;
        else if (x.step.tag) missTags[x.step.tag] = (missTags[x.step.tag] || 0) + 1;
      });
      return { level: level, cefr: cefr, wrong: state.wrong, phaseSeconds: state.ph.map(function (m) { return Math.round(m / 1000); }), steps: flat.length, firstTry: first, overrides: over, overridden: Object.keys(state.over), missTags: missTags, version: sc.version || 1,
        tries: state.tries, ai: state.ai };
    }
    function finishCard() {
      state.done = true; state.last = null; state.expanded = false; paintClocks();
      var t = tally();
      /* Medium: the four panes open for a last polish */
      if (!high && !state.polished) {
        var panes = state.polishText && state.polishText.length === 4 ? state.polishText : essay(sc, state.answers).panes;
        [0, 1, 2, 3].forEach(function (i) {
          var el = host.querySelector('#gd-p' + i);
          el.outerHTML = '<textarea class="gd-ta" id="gd-ta' + i + '" rows="' + (i < 2 ? 4 : 6) + '" spellcheck="false" aria-label="' + PANE_NAME[i] + '">' + esc(panes[i]) + '</textarea>';
        });
        state.polished = true;
        host.querySelectorAll('.gd-ta').forEach(function (ta) { ta.addEventListener('input', function () { paintCount(); persist(); }); });
      }
      paintPanes();
      host.querySelectorAll('.gd-pane').forEach(function (b) { b.classList.remove('on'); });
      q.innerHTML = '<p class="kicker">' + LEVEL_NAME[level] + ' · finished</p><h3 class="gd-ask">Your report is built.</h3>' +
        '<p class="gd-note"><b>' + t.firstTry + ' of ' + t.steps + '</b> decisions right the first time, <b>' + t.wrong + '</b> wrong answer' + (t.wrong === 1 ? '' : 's') + ' in all' + (t.overrides ? ', and you kept your own answer ' + t.overrides + ' time' + (t.overrides > 1 ? 's' : '') : '') + '.</p>' +
        (high ? '<p class="tiny">Read the four paragraphs as one report: introduction, overview and the two detail paragraphs. Notice how each detail sentence is tied to the chart by a figure, a date or a label.</p>'
          : '<p class="tiny">The four paragraphs are yours to polish now: read them aloud once, fix any join that sounds wrong, then run the Wards.</p>') +
        '<button type="button" class="btn primary wide" id="gd-wards">The Ten Wards →</button>';
      q.querySelector('#gd-wards').addEventListener('click', wards);
      paintFull(!state.resumedPaint);
      persist();
    }
    function wards() {
      var t = text(), pre = W.preflight(t, p), pn = host.querySelector('#wr-panel');
      pn.innerHTML = '<div class="card preflight"><div class="pf-h"><b>The Ten Wards</b><span class="pill ' + (pre.bad ? 'bad' : pre.warn ? 'gold' : 'good') + '">' + esc(pre.summary) + '</span></div>' +
        pre.rows.map(function (r) { return '<div class="pf-row ' + r.status + '"><span class="pf-dot"></span><div><b>' + esc(r.label) + '</b><p>' + esc(r.note) + '</p></div></div>'; }).join('') +
        '<p class="tiny" style="margin-top:10px">' + (high ? 'This report was built from your choices, so T.Chris sees it but the examiners do not give it a band. Next, write this chart at Medium guidance in your own words.' : 'Checks, not marks: the Wards look at structure only.') + '</p>' +
        '<div class="qfoot" style="margin-top:12px"><span class="grow"></span><button class="btn primary" id="wr-submit">Send the report</button></div></div>';
      try { pn.scrollIntoView({ behavior: 'smooth', block: 'start' }); } catch (e) {}
      pn.querySelector('#wr-submit').addEventListener('click', function () { send(pre); });
    }
    function send(pre) {
      if (state.sent) return; state.sent = true; stop();
      var t = text(), g = tally();
      pre = W.preflight(t, p);
      var plan = { mode: state.answers['t-mode'] || p.mode, big: '', groupA: state.answers['t-groupA'] || '', groupB: state.answers['t-groupB'] || '', picks: [], guide: g };
      forget();
      if (cfg.onSubmit) cfg.onSubmit({ promptId: p.id, mode: level, cefr: cefr, wrong: state.wrong, text: t, words: W.words(t), seconds: seconds(), timedOut: false,
        preflight: pre, revision: 0, firstText: '', firstPreflight: null, plan: plan, landing: null, guide: g });
    }

    state.tick = setInterval(function () {
      if (!host.querySelector('#wr-clock')) { stop(); return; }
      tickPhase(); paintClocks();
    }, 1000);
    function stop() { clearInterval(state.tick); global.removeEventListener('resize', relayout); }
    host.querySelector('#wr-quit').addEventListener('click', function () {
      state.quit = true; persist(); stop();
      if (cfg.onQuit) cfg.onQuit(state.i > 0 && !state.sent ? { saved: true, step: state.i, of: flat.length } : null);
    });

    state.resumedPaint = true;
    paintPanes(); paintStep(); paintClocks(); if (!state.done) paintFull(false);
    /* fonts and the chart can change heights after the first paint */
    setTimeout(relayout, 60); setTimeout(relayout, 600);
    if (state.resumed && cfg.onResume) cfg.onResume(state.i, flat.length);
    return { stop: stop, text: text, restart: function () { forget(); } };
  }

  global.Guide = { CEFRS: CEFRS, base: base, keyOf: keyOf, has: has, hasAny: hasAny, ready: ready, placeOf: placeOf, load: load, script: script, steps: steps, key: key, options: options, essay: essay, soFar: soFar, tidy: tidy, localCheck: localCheck, leaks: leaks, mount: mount, LEVEL_NAME: LEVEL_NAME, BAND: BAND, phases: phases };
})(typeof window !== 'undefined' ? window : this);
