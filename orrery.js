/* ===========================================================================
   QUILLMOOR ACADEMY · THE OBSERVATORY — orrery.js  (26 Nov 2026)
   The Orrery room: a student runs the "program" (orrery-engine.js) by hand.
   For one TREND chart and a band target (6 / 7 / 8) she fills the 13
   variables of the TREND page, one decision at a time:
     ASK (the card title) · LOOK (the part of the chart that lights up) ·
     THINK (a rule step: which signal fires) · WRITE (the value)
   Guidance levels, as in the Scriptorium:
     High    every step is multiple choice; a wrong option greys out and
             shows its hint; rule and signal are shown before she answers
     Medium  THINK steps multiple choice; WRITE steps typed, Commit, checked
             by rule (Orrery.checkValue); hint, then the signal, then
             "Show the program's answer"; "Keep mine" after a near miss
     Low     all 13 slots on one page with LOOK and the signal for each;
             "Run the program" checks them all; fix and run again
     Exam    13 blank slots, no signals, a soft 6-minute clock, one run
   At the end: her 13 values beside the program's, the report the program
   compiles at Band 6, 7 and 8 (the band tabs show what changes), and a
   button to write her own report in the Scriptorium.
   Merits on the first finish at ≥ 60 %: High 25, Medium 50, Low 60,
   Exam 80 (High earns half, as in the Scriptorium). Saved in p.orrery.
   Plain ES5.
   =========================================================================== */
(function (global) {
  'use strict';
  var O = global.Orrery;
  if (!O) return;
  var H = null, EL = null, R = null, clock = null;
  var XP = { high: 25, medium: 50, low: 60, exam: 80 };
  var LEVELS = [
    { id: 'high', name: 'High', note: 'Every step is a choice. A wrong choice greys out and shows a hint. The rule and the signal are on the card.' },
    { id: 'medium', name: 'Medium', note: 'You choose the rule, then type each value. The program checks it; hints come one at a time.' },
    { id: 'low', name: 'Low', note: 'All 13 slots on one page, with where to look and the signal for each. Run the program, fix, run again.' },
    { id: 'exam', name: 'Exam', note: '13 empty slots, no signals, six minutes. One run.' }
  ];
  var LOOKNAME = { type: 'the shape of the visual', task: 'the task sentence and the title', xaxis: 'the bottom axis', yaxis: 'the side axis and the printed values', legend: 'the legend: the names of the lines', lines: 'the lines: where each one starts, ends and turns' };

  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function C() { return global.CONTENT || {}; }
  function prompt(id) { var P = C().PROMPTS || []; for (var i = 0; i < P.length; i++) if (P[i].id === id) return P[i]; return null; }
  function prof() { return H && H.p; }
  function bandOfTier() { var t = (prof() && (prof().tier || '')) || ''; return /C1|C2/.test(t) ? 8 : /B2/.test(t) ? 7 : 6; }
  function saved() { var p = prof(); if (!p) return {}; p.orrery = p.orrery || { runs: {}, pick: null }; return p.orrery; }
  function seed(str) { var h = 2166136261; for (var i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = (h * 16777619) >>> 0; } return h; }
  /* the right option goes to a different place on each step, decided by the step id (stable on reload) */
  function arrange(st) {
    var opts = [{ t: st.ok, ok: true }].concat(st.wrong.map(function (w) { return { t: w[0], hint: w[1] }; }));
    var place = seed(R.pid + '|' + R.band + '|' + st.id) % opts.length, right = opts.shift();
    var rest = opts.sort(function (a, b) { return seed(a.t) - seed(b.t); });
    rest.splice(place, 0, right);
    return rest;
  }

  /* ------------------------------------------------------------ landing */
  function landing() {
    stopClock();
    var o = saved(), pick = o.pick || {}, ids = O.charts();
    var band = pick.band || bandOfTier(), lvl = pick.level || 'high', pid = pick.pid && ids.indexOf(pick.pid) >= 0 ? pick.pid : ids[0];
    var byType = {}; ids.forEach(function (id) { var p = prompt(id); (byType[p.type] = byType[p.type] || []).push(p); });
    var TN = { line: 'Line graphs', bar: 'Bar charts over years', table: 'Tables with year columns', pie: 'Pie charts for two or more years' };
    var h = '<div class="sect-h"><div><h2>The Orrery</h2><p>A Task 1 report is a program written in everyday English. The Orrery reads the chart, measures its <b>signals</b>, runs the <b>rules</b> and fills the <b>13 variables</b> of your TREND page for the band you aim at. Then it compiles the report. Here you run the program yourself: <b>Ask → Look → Think → Write</b>, one variable at a time.</p></div></div>';
    h += '<div class="card orr-how" aria-label="How the program works"><div class="orr-flow">' +
      ['<b>Input</b><span>task sentence · title · bottom axis · side axis · legend · data</span>', '<b>Signals</b><span>size of each change · % change · flat? peak? dip? · crossings · top line · projection</span>', '<b>Rules</b><span>four decision trees: groups · trend words · key feature · figures</span>', '<b>13 variables</b><span>visual · what · years · groups · trends · key feature · four figures</span>', '<b>Output</b><span>four paragraphs at Band 6, 7 or 8</span>'].map(function (x, i) { return '<div class="orr-node n' + i + '">' + x + '</div>'; }).join('<i aria-hidden="true">→</i>') + '</div></div>';
    h += '<div class="card orr-pick"><h3>1 · Choose a chart</h3>';
    Object.keys(TN).forEach(function (t) {
      if (!byType[t]) return;
      h += '<p class="kicker">' + TN[t] + '</p><div class="orr-charts">' + byType[t].map(function (p) {
        var runs = o.runs || {}, done = Object.keys(runs).filter(function (k) { return k.indexOf(p.id + '|') === 0; }).length;
        return '<button type="button" class="orr-chart' + (p.id === pid ? ' on' : '') + '" data-pid="' + p.id + '"><b>' + esc(p.title) + '</b><small>' + esc(p.level || '') + (done ? ' · ' + done + ' run' + (done > 1 ? 's' : '') : '') + '</small></button>';
      }).join('') + '</div>';
    });
    h += '</div><div class="orr-two"><div class="card"><h3>2 · Your band target</h3>' + [6, 7, 8].map(function (b) {
      var I = O.BAND_INFO[b];
      return '<label class="orr-radio"><input type="radio" name="orr-band" value="' + b + '"' + (b === band ? ' checked' : '') + '><span><b>' + I.name + ' · ' + I.short + '</b><small>' + esc(I.note) + '</small></span></label>';
    }).join('') + '</div><div class="card"><h3>3 · Guidance</h3>' + LEVELS.map(function (l) {
      return '<label class="orr-radio"><input type="radio" name="orr-level" value="' + l.id + '"' + (l.id === lvl ? ' checked' : '') + '><span><b>' + l.name + (l.id === 'high' ? ' · half merits' : '') + '</b><small>' + esc(l.note) + '</small></span></label>';
    }).join('') + '</div></div><div class="orr-go"><button type="button" class="btn primary" id="orr-start">Run the program →</button></div>';
    EL.innerHTML = '<div class="orr-land">' + h + '</div>';
    $$('.orr-chart', EL).forEach(function (b) { b.addEventListener('click', function () { $$('.orr-chart', EL).forEach(function (x) { x.classList.remove('on'); }); b.classList.add('on'); pid = b.dataset.pid; }); });
    $('#orr-start', EL).addEventListener('click', function () {
      band = +($('input[name=orr-band]:checked', EL) || {}).value || 7; lvl = ($('input[name=orr-level]:checked', EL) || {}).value || 'high';
      var oo = saved(); oo.pick = { pid: pid, band: band, level: lvl };
      start(pid, band, lvl);
    });
  }

  /* ---------------------------------------------------------------- run */
  function start(pid, band, level) {
    var p = prompt(pid), E = O.exercise(p, band);
    R = { pid: pid, p: p, band: band, level: level, E: E, steps: E.steps, i: 0, wrong: 0, first: 0, asked: 0, vars: {}, status: {}, tries: {}, off: {}, t0: Date.now(), runs: 0, done: false };
    if (level === 'low' || level === 'exam') return sheet();
    frame();
    step();
  }
  function header() {
    var lv = LEVELS.filter(function (l) { return l.id === R.level; })[0].name;
    return '<div class="orr-top"><button type="button" class="orr-x" id="orr-leave" aria-label="Leave">✕</button><b>' + esc(R.p.title) + '</b><span class="pill">Band ' + R.band + ' target</span><span class="pill">' + lv + ' guidance</span>' +
      '<span class="orr-prog" id="orr-prog"></span><span class="orr-wrong" id="orr-wrong" title="Wrong choices">✗ 0</span><span class="orr-clock" id="orr-clock">0:00</span></div>';
  }
  function register(editable) {
    var cols = [['P1 · Introduction', ['visual', 'what', 'y1', 'y2']], ['P2 · Overview', ['groupA', 'moveA', 'groupB', 'moveB', 'feature']], ['P3 · Group A', ['figA1', 'figA2']], ['P4 · Group B', ['figB1', 'figB2']]];
    var D = R.E.derive, lab = {}; D.steps.forEach(function (s) { lab[s.key] = s; });
    return '<div class="orr-reg" id="orr-reg">' + cols.map(function (c) {
      return '<div class="orr-col"><p class="kicker">' + c[0] + '</p>' + c[1].map(function (k) {
        var s = lab[k];
        if (editable) {
          return '<div class="orr-cell slot" data-k="' + k + '"><label for="orr-in-' + k + '"><b>[' + esc(s.label) + ']</b>' + (R.level === 'low' ? '<em>' + esc(s.ask) + '</em>' : '') + '</label>' +
            (R.level === 'low' ? '<div class="orr-mini"><span class="orr-lk">Look</span> ' + esc(s.look) + (s.signal ? '<br><span class="orr-sg">Signal</span> ' + esc(s.signal) : '') + '</div>' : '') +
            '<input id="orr-in-' + k + '" type="text" autocomplete="off" spellcheck="false" value="' + esc(R.vars[k] || '') + '"><div class="orr-note" id="orr-note-' + k + '"></div></div>';
        }
        return '<div class="orr-cell" data-k="' + k + '"><b>[' + esc(s.label) + ']</b><span id="orr-v-' + k + '">' + (R.vars[k] ? esc(R.vars[k]) : '—') + '</span></div>';
      }).join('') + '</div>';
    }).join('') + '</div>';
  }
  function frame() {
    EL.innerHTML = '<div class="orr">' + header() + register(false) +
      '<div class="orr-main"><div class="orr-fig card" id="orr-fig"><div class="orr-look" id="orr-look"></div><div id="orr-chart"></div></div><div class="orr-side"><div class="gd-q orr-q" id="orr-q"></div></div></div></div>';
    global.Charts.render($('#orr-chart', EL), R.p, {});
    wireTop();
  }
  function wireTop() {
    $('#orr-leave', EL).addEventListener('click', function () { if (!R.done && !confirm('Leave the program? This run will not be saved.')) return; R = null; landing(); });
    startClock();
  }
  function startClock() {
    stopClock();
    clock = setInterval(function () {
      if (!R || !EL) return stopClock();
      var el = $('#orr-clock', EL); if (!el) return;
      var s = Math.floor((Date.now() - R.t0) / 1000);
      if (R.level === 'exam') { var left = 360 - s; el.textContent = (left < 0 ? '+' : '') + Math.floor(Math.abs(left) / 60) + ':' + ('0' + Math.abs(left) % 60).slice(-2); el.classList.toggle('over', left < 0); }
      else el.textContent = Math.floor(s / 60) + ':' + ('0' + s % 60).slice(-2);
    }, 1000);
  }
  function stopClock() { if (clock) clearInterval(clock); clock = null; }
  function setLook(at) {
    var f = $('#orr-fig', EL); if (!f) return;
    f.setAttribute('data-look', at || '');
    var l = $('#orr-look', EL); if (l) l.innerHTML = at ? '<span class="orr-lk">Look</span> ' + esc(LOOKNAME[at] || at) : '';
  }
  function paintReg() {
    O.VARS.forEach(function (d) { var el = $('#orr-v-' + d.key, EL); if (el) el.textContent = R.vars[d.key] || '—'; });
    $$('.orr-cell', EL).forEach(function (c) { c.classList.toggle('now', R.steps[R.i] && R.steps[R.i].var === c.dataset.k); c.classList.toggle('done', !!R.vars[c.dataset.k]); });
    var cur = $('.orr-cell.now', EL);
    if (cur && cur.scrollIntoView && global.innerWidth < 900) try { cur.scrollIntoView({ block: 'nearest', inline: 'center' }); } catch (e) {}
    var n = Object.keys(R.vars).length;
    var pg = $('#orr-prog', EL); if (pg) pg.textContent = n + ' of 13 variables';
    var w = $('#orr-wrong', EL); if (w) w.textContent = '✗ ' + R.wrong;
  }
  function step() {
    if (R.i >= R.steps.length) return finish();
    var st = R.steps[R.i], q = $('#orr-q', EL), high = R.level === 'high', typed = R.level === 'medium' && st.kind === 'write';
    setLook(st.lookAt); paintReg();
    var kind = st.kind === 'think' ? 'THINK' : 'WRITE';
    var h = '<p class="kicker"><span class="orr-k ' + st.kind + '">' + kind + '</span> ' + esc(st.label) + ' · ' + esc(st.para) + '</p><h3 class="gd-ask">' + esc(st.ask) + '</h3>';
    var showRule = high || st.kind === 'think';
    if (showRule) h += '<div class="orr-rule"><span class="orr-th">Rule</span> ' + esc(st.think) + '</div>';
    if (st.signal && (high || st.kind === 'think')) h += '<div class="orr-sig"><span class="orr-sg">Signal</span> ' + esc(st.signal) + '</div>';
    if (!typed) {
      h += '<div class="gd-opts" role="group" aria-label="Choose one">' + arrange(st).map(function (o, i) { return '<button type="button" class="gd-opt" data-i="' + i + '">' + esc(o.t) + '</button>'; }).join('') + '</div>';
    } else {
      h += '<label class="orr-shape" for="orr-in">Type: ' + esc(st.shape || 'the value') + '</label><input id="orr-in" class="orr-in" type="text" autocomplete="off" spellcheck="false"><div class="orr-btns"><button type="button" class="btn primary" id="orr-commit">Commit</button><button type="button" class="btn ghost hidden" id="orr-keep">Keep mine</button><button type="button" class="btn ghost hidden" id="orr-show">Show the program\'s answer</button></div>';
    }
    h += '<div class="gd-hint hidden" id="orr-hint" role="status"></div>';
    q.innerHTML = h;
    R.asked++;
    var misses = 0;
    if (!typed) {
      var opts = arrange(st);
      $$('.gd-opt', q).forEach(function (b) {
        b.addEventListener('click', function () {
          var o = opts[+b.dataset.i];
          if (o.ok) {
            b.classList.add('right'); $$('.gd-opt', q).forEach(function (x) { x.disabled = true; });
            if (!misses) R.first++;
            if (st.kind === 'write') R.vars[st.var] = st.ok;
            hint(q, '', '');
            setTimeout(function () { R.i++; step(); }, 650);
          } else {
            misses++; R.wrong++; b.classList.add('off'); b.disabled = true;
            hint(q, 'Not this one', o.hint);
            paintReg();
          }
        });
      });
      var first = $('.gd-opt', q); if (first && global.innerWidth > 720) try { first.focus({ preventScroll: true }); } catch (e) {}
    } else {
      var inp = $('#orr-in', q);
      try { inp.focus({ preventScroll: true }); } catch (e) {}
      var commit = function () {
        var val = inp.value.trim(); if (!val) return;
        var r = O.checkValue(R.p, R.band, st.var, val, R.vars);
        if (r.status === 'ok' || r.status === 'none') {
          if (!misses) R.first++;
          R.vars[st.var] = val; R.status[st.var] = 'ok';
          hint(q, 'Accepted', r.note || 'Right.', true);
          setTimeout(function () { R.i++; step(); }, 900);
          return;
        }
        misses++; R.wrong++; paintReg();
        var msg = r.note + (misses === 1 ? '' : '<br><em>Rule: ' + esc(st.think) + '</em>') + (misses >= 2 && st.signal ? '<br><em>Signal: ' + esc(st.signal) + '</em>' : '');
        hint(q, r.status === 'near' ? 'Nearly' : 'Not yet', msg, false, true);
        if (r.status === 'near') $('#orr-keep', q).classList.remove('hidden');
        if (misses >= 2) $('#orr-show', q).classList.remove('hidden');
      };
      $('#orr-commit', q).addEventListener('click', commit);
      inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') commit(); });
      $('#orr-keep', q).addEventListener('click', function () { R.vars[st.var] = inp.value.trim(); R.status[st.var] = 'near'; R.i++; step(); });
      $('#orr-show', q).addEventListener('click', function () { inp.value = st.ok; R.vars[st.var] = st.ok; R.status[st.var] = 'shown'; hint(q, 'The program wrote', esc(st.ok), true); setTimeout(function () { R.i++; step(); }, 1400); });
    }
  }
  function hint(q, title, text, good, raw) {
    var hb = $('#orr-hint', q); if (!hb) return;
    if (!text) { hb.classList.add('hidden'); return; }
    hb.className = 'gd-hint' + (good ? ' orr-good' : '');
    hb.innerHTML = '<b>' + esc(title) + '</b><span>' + (raw || good ? text : esc(text)) + '</span>';
    if (hb.scrollIntoView && global.innerWidth < 900) try { hb.scrollIntoView({ block: 'nearest' }); } catch (e) {}
  }

  /* ------------------------------------------------- Low / Exam: one sheet */
  function sheet() {
    EL.innerHTML = '<div class="orr">' + header() +
      '<div class="orr-main sheet"><div class="orr-fig card" id="orr-fig"><div id="orr-chart"></div></div><div class="orr-side"><div class="card orr-sheet"><h3>' + (R.level === 'exam' ? 'Fill all 13 variables. One run, no hints.' : 'Fill the 13 variables, then run the program.') + '</h3>' + register(true) +
      '<div class="orr-btns"><button type="button" class="btn primary" id="orr-run">Run the program</button>' + (R.level === 'low' ? '<button type="button" class="btn ghost hidden" id="orr-fin">Finish</button>' : '') + '</div><div class="gd-hint hidden" id="orr-hint" role="status"></div></div></div></div></div>';
    global.Charts.render($('#orr-chart', EL), R.p, {});
    wireTop();
    $('#orr-prog', EL).textContent = '13 variables';
    $$('.slot input', EL).forEach(function (inp) { inp.addEventListener('focus', function () { var k = inp.id.replace('orr-in-', ''), d = O.VARS.filter(function (x) { return x.key === k; })[0]; if (R.level === 'low') setLookSheet(d.look); }); });
    $('#orr-run', EL).addEventListener('click', runSheet);
    var fin = $('#orr-fin', EL); if (fin) fin.addEventListener('click', finish);
  }
  function setLookSheet(at) { var f = $('#orr-fig', EL); if (f) f.setAttribute('data-look', at || ''); }
  function runSheet() {
    R.runs++;
    O.VARS.forEach(function (d) { R.vars[d.key] = ($('#orr-in-' + d.key, EL) || {}).value ? $('#orr-in-' + d.key, EL).value.trim() : ''; });
    var okN = 0;
    O.VARS.forEach(function (d) {
      var r = R.vars[d.key] ? O.checkValue(R.p, R.band, d.key, R.vars[d.key], R.vars) : { status: 'bad', note: 'Empty.' };
      R.status[d.key] = r.status === 'none' ? 'ok' : r.status;
      if (R.status[d.key] === 'ok') okN++;
      var n = $('#orr-note-' + d.key, EL), cell = $('.orr-cell[data-k="' + d.key + '"]', EL);
      cell.classList.remove('ok', 'near', 'bad'); cell.classList.add(R.status[d.key] === 'ok' ? 'ok' : R.status[d.key] === 'near' ? 'near' : 'bad');
      if (n) n.textContent = R.level === 'exam' ? '' : (R.status[d.key] === 'ok' ? '✓ ' : R.status[d.key] === 'near' ? '≈ ' : '✗ ') + (r.note || '');
    });
    if (R.runs === 1) R.first = okN;
    if (R.level === 'exam') return finish();
    var q = $('.orr-sheet', EL);
    hint(q, okN === 13 ? 'All 13 pass' : okN + ' of 13 pass', okN === 13 ? 'The program compiles. Press Finish.' : 'Fix the ✗ and ≈ slots and run again. The notes say what kind of thing is wrong.', okN === 13);
    $('#orr-fin', EL).classList.remove('hidden');
  }

  /* ------------------------------------------------------------- finish */
  function finish() {
    stopClock();
    R.done = true;
    var total = R.level === 'low' || R.level === 'exam' ? 13 : R.asked;
    var pct = total ? Math.round(100 * R.first / total) : 0;
    var key = R.pid + '|' + R.band + '|' + R.level, o = saved(), prev = (o.runs || {})[key], gain = 0;
    o.runs = o.runs || {};
    if (!prev && pct >= 60) gain = XP[R.level] || 0;
    o.runs[key] = { best: Math.max(pct, prev ? prev.best : 0), n: (prev ? prev.n : 0) + 1, at: new Date().toISOString(), secs: Math.round((Date.now() - R.t0) / 1000) };
    var p = prof();
    if (p && gain) { p.xp = (p.xp || 0) + gain; }
    try { if (H.paintHeader) H.paintHeader(); if (H.syncSoon) H.syncSoon(); } catch (e) {}
    var D = R.E.derive, prog = D.vars;
    var rows = O.VARS.map(function (d) {
      var mine = R.vars[d.key] || '', st = R.level === 'low' || R.level === 'exam' ? R.status[d.key] : (R.status[d.key] || (mine ? 'ok' : 'bad'));
      return '<tr class="' + (st || '') + '"><th>[' + esc(d.label) + ']</th><td>' + esc(mine || '—') + '</td><td>' + esc(prog[d.key]) + '</td><td class="orr-mk">' + (st === 'ok' ? '✓' : st === 'near' ? '≈' : st === 'shown' ? '○' : '✗') + '</td></tr>';
    }).join('');
    var h = '<div class="orr">' + header() + '<div class="card result orr-res"><div class="score-ring" style="--p:' + pct + '"><i>' + pct + '%</i></div><h3>' + (pct >= 60 ? 'The program runs' : 'Run it again') + '</h3><p>' + (R.level === 'low' || R.level === 'exam' ? R.first + ' of 13 variables right on the first run' : R.first + ' of ' + total + ' decisions right first time') + ' · ' + R.wrong + ' wrong choice' + (R.wrong === 1 ? '' : 's') + (gain ? ' · +' + gain + ' merits' : prev ? ' · merits are earned once per chart, band and guidance' : '') + '.</p></div>';
    h += '<div class="card"><h3>Your 13 variables and the program\'s (Band ' + R.band + ')</h3><div class="orr-tw"><table class="orr-tab"><thead><tr><th>Variable</th><th>You</th><th>The program</th><th></th></tr></thead><tbody>' + rows + '</tbody></table></div></div>';
    h += '<div class="card"><h3>The report the program compiles</h3><p class="tiny">Switch the band to see what changes. The numbers and the structure stay; the words, the precision and the key feature grow.</p><div class="orr-bands" role="tablist">' + [6, 7, 8].map(function (b) { return '<button type="button" role="tab" class="pill' + (b === R.band ? ' on' : '') + '" data-b="' + b + '">Band ' + b + '</button>'; }).join('') + '</div><div id="orr-rep" class="orr-rep"></div></div>';
    h += '<div class="card"><h3>What the band changes on this chart</h3><div class="orr-tw"><table class="orr-tab orr-diff"><thead><tr><th>Variable</th><th>Band 6</th><th>Band 7</th><th>Band 8</th></tr></thead><tbody>' + bandDiff() + '</tbody></table></div></div>';
    h += '<div class="orr-go"><button type="button" class="btn primary" id="orr-write">Write it yourself in the Scriptorium →</button><button type="button" class="btn ghost" id="orr-again">Another run</button></div></div>';
    EL.innerHTML = h;
    $('#orr-leave', EL).addEventListener('click', function () { R = null; landing(); });
    $('#orr-clock', EL).textContent = fmtSecs(o.runs[key].secs);
    $('#orr-prog', EL).textContent = 'Finished';
    $('#orr-wrong', EL).textContent = '✗ ' + R.wrong;
    showRep(R.band);
    $$('.orr-bands button', EL).forEach(function (b) { b.addEventListener('click', function () { $$('.orr-bands button', EL).forEach(function (x) { x.classList.toggle('on', x === b); }); showRep(+b.dataset.b); }); });
    $('#orr-write', EL).addEventListener('click', function () { var pid = R.pid; R = null; if (H.openWriterAt) H.openWriterAt(pid, 'low'); });
    $('#orr-again', EL).addEventListener('click', function () { R = null; landing(); });
    if (gain && H.toast) H.toast('+' + gain + ' merits: the program runs on ' + prompt(key.split('|')[0]).title + '.');
  }
  function fmtSecs(s) { return Math.floor(s / 60) + ':' + ('0' + s % 60).slice(-2); }
  function showRep(b) {
    var C1 = O.compile(R.p, b);
    $('#orr-rep', EL).innerHTML = C1.paras.map(function (t, i) { return '<p><span class="orr-pn">P' + (i + 1) + '</span>' + esc(t) + '</p>'; }).join('') + '<p class="tiny">' + C1.words + ' words · compiled by the Orrery from the chart data. Use it to see how the program thinks, then write your own.</p>';
  }
  function bandDiff() {
    var d = {}; [6, 7, 8].forEach(function (b) { d[b] = O.derive(R.p, b).vars; });
    return O.VARS.map(function (v) {
      var same = d[6][v.key] === d[7][v.key] && d[7][v.key] === d[8][v.key];
      return '<tr' + (same ? ' class="same"' : '') + '><th>[' + esc(v.label) + ']</th>' + [6, 7, 8].map(function (b) { return '<td>' + esc(d[b][v.key]) + '</td>'; }).join('') + '</tr>';
    }).join('');
  }

  O.mount = function (el, host) {
    EL = el; H = host;
    if (R && !R.done) return;
    R = null;
    landing();
  };
  O.leave = function () { stopClock(); };
  O.running = function () { return !!(R && !R.done); };
})(typeof window !== 'undefined' ? window : this);
