/* ===========================================================================
   QUILLMOOR ACADEMY · THE OBSERVATORY — orrery-engine.js  (26 Nov 2026)
   The Orrery: a Task 1 report written as a computer program.

     INPUT    the chart (prompts*.js): task sentence, title, bottom axis,
              side axis, legend, data points
     PROCESS  signals (numbers the program measures) → rules (decision
              questions, cheapest first) → the 13 variables of the TREND
              Spellbook page, worded for a band target (6, 7 or 8)
     OUTPUT   the 13 values, the reason for each (Ask · Look · Think ·
              Write), and a four-paragraph report compiled from them

   API
     Orrery.charts()                  ids of the charts the program can run
     Orrery.signals(p)                every measured signal (see SIGNALS)
     Orrery.derive(p, band)           { vars, steps[13], groups, feature, sig }
     Orrery.compile(p, band, vars?)   { paras[4], text, words }
     Orrery.moveOf(p, members, band)  the trend phrase for some lines
     Orrery.checkMove(p, members, phrase, band)  { status, note } (Medium)
     Orrery.VARS                      the 13 variables in program order

   Band targets (official CEFR alignment: 5.5–6.5 B2, 7–8 C1):
     6  safe and accurate: core verbs (rose, fell, stayed), one degree
        word, exact or "about" figures, the simplest true key feature
     7  precise: degree matched to the size of the change, the strongest
        key feature (a crossover, a collapse, a projection), comparison
     8  skilful: shape and multiples ("almost doubling", "peaked in 2014
        and then fell away"), sided approximations ("just over"), the key
        feature illustrated with a second clause, one 7→8 add-on
   Plain ES5: runs on old school iPads.
   =========================================================================== */
(function (global) {
  'use strict';

  var O = {};
  var NOW = (new Date()).getFullYear();

  /* The 13 variables in the order the program fills them (the TREND page,
     lab-content.js). gate = the triage gate that decides it. */
  O.VARS = [
    { key: 'visual', label: 'Visual', para: 'P1', gate: 'TYPE', look: 'type', ask: 'What kind of visual is it?' },
    { key: 'what', label: 'What It Shows', para: 'P1', gate: 'TITLE', look: 'task', ask: 'What is measured, where, and in what unit?' },
    { key: 'y1', label: 'First Year', para: 'P1', gate: 'AXES', look: 'xaxis', ask: 'What is the first year?' },
    { key: 'y2', label: 'Last Year', para: 'P1', gate: 'AXES', look: 'xaxis', ask: 'What is the last real year (before any projection)?' },
    { key: 'groupA', label: 'Group A', para: 'P2 P3', gate: 'GROUPS', look: 'legend', ask: 'Which lines tell the first story?' },
    { key: 'groupB', label: 'Group B', para: 'P2 P4', gate: 'GROUPS', look: 'legend', ask: 'Which lines tell the second story?' },
    { key: 'moveA', label: 'Trend A', para: 'P2 P3', gate: 'MODE', look: 'lines', ask: 'What did group A do over the whole period?' },
    { key: 'moveB', label: 'Trend B', para: 'P2 P4', gate: 'MODE', look: 'lines', ask: 'What did group B do over the whole period?' },
    { key: 'feature', label: 'Key Feature', para: 'P2', gate: 'KEY', look: 'lines', ask: 'What is the one other big-picture truth?' },
    { key: 'figA1', label: 'Start Figure A', para: 'P3', gate: 'AXES', look: 'yaxis', ask: 'What was group A\'s figure in the first year?' },
    { key: 'figA2', label: 'End Figure A', para: 'P3', gate: 'AXES', look: 'yaxis', ask: 'What was group A\'s figure at the end?' },
    { key: 'figB1', label: 'Start Figure B', para: 'P4', gate: 'AXES', look: 'yaxis', ask: 'What was group B\'s figure in the first year?' },
    { key: 'figB2', label: 'End Figure B', para: 'P4', gate: 'AXES', look: 'yaxis', ask: 'What was group B\'s figure at the end?' }
  ];
  O.BANDS = [6, 7, 8];
  O.BAND_INFO = {
    6: { cefr: 'B2', name: 'Band 6', short: 'Safe and accurate', note: 'Core verbs, one degree word, exact or "about" figures, the simplest true key feature.' },
    7: { cefr: 'C1', name: 'Band 7', short: 'Precise', note: 'Degree matched to the size of the change, the strongest key feature, clear comparisons.' },
    8: { cefr: 'C1', name: 'Band 8', short: 'Skilful', note: 'Shape and multiples, sided approximations, the key feature illustrated, one 7→8 add-on.' }
  };

  function C() { return global.CONTENT || {}; }
  function ext(a, b) { for (var k in b) if (b.hasOwnProperty(k)) a[k] = b[k]; return a; }
  function sentencesOf(t) { return String(t).replace(/\.\s+/g, '.\u0001').split('\u0001'); }
  function TD() { return global.Template && global.Template.Data; }
  function content(p) { return (global.ORRERY_CONTENT || {})[p.id] || {}; }
  function namesMap(p) { return (global.ORRERY_NAMES || {})[p.id] || {}; }

  /* ------------------------------------------------------------ helpers */
  function niceMax(m) {
    if (m <= 0) return 1;
    var e = Math.pow(10, Math.floor(Math.log(m) / Math.LN10)), f = m / e;
    var n = f <= 1 ? 1 : f <= 2 ? 2 : f <= 2.5 ? 2.5 : f <= 5 ? 5 : 10;
    return n * e;
  }
  function niceStep(t) {
    var e = Math.pow(10, Math.floor(Math.log(t) / Math.LN10)), f = t / e;
    var c = [1, 2, 5, 10], best = 1;
    c.forEach(function (n) { if (Math.abs(n - f) < Math.abs(best - f)) best = n; });
    return best * e;
  }
  function round(v, d) { var k = Math.pow(10, d || 0); return Math.round(v * k) / k; }
  function fmt(v) {
    var s = String(round(v, 2));
    var parts = s.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  }
  function cap(s) { s = String(s || ''); return s.charAt(0).toUpperCase() + s.slice(1); }
  function sgn(x, eps) { return x > eps ? 1 : x < -eps ? -1 : 0; }
  function isYear(x) { return /^(18|19|20)\d\d$/.test(String(x)); }
  function list(names) {
    if (names.length <= 1) return names.join('');
    return names.slice(0, -1).join(', ') + ' and ' + names[names.length - 1];
  }
  function promptById(id) {
    var P = C().PROMPTS || [];
    for (var i = 0; i < P.length; i++) if (P[i].id === id) return P[i];
    return null;
  }

  /* Which charts the program runs on: every TREND chart with numbers
     (line, bar over years, table with year columns, pies for two or more
     years). Two-visual charts are left to the Scriptorium. */
  O.fits = function (p) {
    if (!p || p.mode !== 'TREND') return false;
    if (['line', 'bar', 'table', 'pie'].indexOf(p.type) < 0) return false;
    return !!global.ORRERY_CONTENT && !!global.ORRERY_CONTENT[p.id];
  };
  O.charts = function () { return (C().PROMPTS || []).filter(O.fits).map(function (p) { return p.id; }); };

  /* ------------------------------------------------------ normalise data
     Every TREND shape becomes { x: [years], series: [{ name, values }] }. */
  function normalise(p) {
    var d = p.data || {}, xs = [], series = [];
    if (p.type === 'line' || p.type === 'bar') {
      xs = (d.x || d.categories || []).map(Number);
      series = (d.series || []).map(function (s) { return { name: s.name, values: s.values.slice() }; });
    } else if (p.type === 'table') {
      var cols = d.cols || [];
      var yc = []; cols.forEach(function (c, j) { if (j > 0 && isYear(c)) yc.push(j); });
      xs = yc.map(function (j) { return +cols[j]; });
      series = (d.rows || []).map(function (r) { return { name: String(r[0]), values: yc.map(function (j) { return +r[j]; }) }; });
    } else if (p.type === 'pie') {
      var charts = d.charts || [], names = [];
      xs = charts.map(function (ch) { var m = String(ch.title || '').match(/(18|19|20)\d\d/); return m ? +m[0] : NaN; });
      charts.forEach(function (ch) { ch.slices.forEach(function (sl) { if (names.indexOf(sl.name) < 0) names.push(sl.name); }); });
      series = names.map(function (nm) {
        return { name: nm, values: charts.map(function (ch) { var hit = ch.slices.filter(function (sl) { return sl.name === nm; })[0]; return hit ? hit.value : 0; }) };
      });
    }
    return { x: xs, series: series, projectedFrom: d.projectedFrom || null };
  }

  /* ------------------------------------------------------------- units */
  function unitOf(p) {
    var u = String(p.units || '').toLowerCase(), cn = content(p);
    var o = { text: p.units || '', pct: /%|per ?cent/.test(u) || p.type === 'pie', mult: /billion/.test(u) ? 1e9 : /million/.test(u) ? 1e6 : /thousand/.test(u) ? 1e3 : 1, money: /dollar|\$/.test(u), noun: cn.noun || '' };
    if (/micrograms/.test(u)) o.noun = 'micrograms';
    return o;
  }
  /* A figure in words: 760 (thousand visitors) → "760,000 visitors" */
  function figText(p, v, opts) {
    var u = unitOf(p), noun = opts && opts.noNoun ? '' : u.noun;
    if (u.pct) return fmt(v) + '%';
    var core;
    if (u.money) {
      core = '$' + (u.mult === 1e6 ? fmt(v) + ' million' : u.mult === 1e3 ? fmt(v * 1000) : fmt(v));
      return core;
    }
    if (u.mult === 1e3) core = v >= 1 && v === Math.round(v) ? fmt(v * 1000) : fmt(v) + ' thousand';
    else if (u.mult === 1e6) core = fmt(v) + ' million';
    else if (u.mult === 1e9) core = fmt(v) + ' billion';
    else core = fmt(v);
    return core + (noun ? ' ' + noun : '');
  }

  /* How a label is written in a sentence: "the" only before Museum and
     Gallery names; chart-specific forms in orrery-content.js. */
  function nameOf(p, label) {
    var m = namesMap(p);
    if (m[label]) return m[label];
    if (/\b(Museum|Gallery)\b/.test(label)) return 'the ' + label;
    return label;
  }
  /* The measure frame: "visitor numbers at {x}", "rents in {x}". A trend
     verb takes the measure as its subject, not the place. */
  function measure(p, names, count) {
    var c = content(p), many = count > 1;
    var f = many && c.measurePl ? c.measurePl : c.measure;
    return f ? f.replace('{x}', names) : names;
  }
  function isPl(name) { name = String(name); return (/^[a-z].*s$|CDs$/.test(name) && !/(ss|gas|us|is)$/.test(name)) && !/^the number of/.test(name) || /^(?:[a-z]+ )*(numbers|levels|rents|sales|arrivals|figures)\b/.test(name); }
  function plSubj(p, names, count) { var c = content(p); if (!c.measure) return count > 1 || isPl(names); return (count > 1 && !!c.measurePl) || /\b(numbers|levels|rents|figures)\b/.test(c.measure.split('{x}')[0]); }

  /* ============================================================ SIGNALS
     The numbers the program measures before it writes a word.
       x, y1, y2 (last real year), yLast, projectedFrom, tense
       axisTop, step (one gridline), scale (largest value on the chart)
       per line: first, last, delta, rel (change ÷ first), ratio, share
         (|change| ÷ scale), size (0–3, see SIZE), cls (up · down · flat ·
         low · peak · trough · fluct), steady (the pace signal), peak and
         low points, growsFromLow
       crossovers (only ones you can see), leader, lowest, collapse
     SIZE comes from what the eye can see:
       line and bar charts  the change as a share of the largest value
                            (<5% tiny · <15% small · <40% medium · big)
       tables               the change as a share of the first figure
                            (<5% · <15% · <40% · more)
       pies                 the change in percentage points
                            (<3 · <8 · <15 · 15 or more)
     PACE ("steadily", "gradually") needs 3+ points, every step the same
     way and no step more than twice the middle-sized step.
     ================================================================== */
  function sizeOf(sig, s, a, b) {
    var d = b - a;
    if (sig.type === 'pie') { var pp = Math.abs(d); return pp < 3 ? 0 : pp < 8 ? 1 : pp < 15 ? 2 : 3; }
    if (sig.type === 'table') { var r = a ? Math.abs(d / a) : 1; return r < 0.05 ? 0 : r < 0.15 ? 1 : r < 0.40 ? 2 : 3; }
    var sh = Math.abs(d) / sig.scale; return sh < 0.05 ? 0 : sh < 0.15 ? 1 : sh < 0.40 ? 2 : 3;
  }
  function steadyOf(v, a, b, eps) {
    if (b - a < 2) return false;
    var st = []; for (var i = a + 1; i <= b; i++) st.push(v[i] - v[i - 1]);
    var sg = st.map(function (d) { return sgn(d, eps); });
    var nz = sg.filter(function (x) { return x !== 0; });
    if (!nz.length || nz.some(function (x) { return x !== nz[0]; })) return false;
    var ab = st.map(Math.abs).sort(function (x, y) { return x - y; }), med = ab[Math.floor(ab.length / 2)];
    return ab[ab.length - 1] <= 2 * Math.max(med, eps);
  }
  O.signals = function (p) {
    if (!p) return null;
    if (p.__orrerySig) return p.__orrerySig;
    var N = normalise(p), xs = N.x, n = xs.length;
    var iEnd = n - 1;
    if (N.projectedFrom) for (var k = 0; k < n; k++) if (xs[k] === N.projectedFrom) iEnd = k;
    var all = []; N.series.forEach(function (s) { all = all.concat(s.values); });
    var scale = Math.max.apply(null, all);
    var u = unitOf(p);
    var axisTop = null, step = null;
    if (p.type === 'line' || p.type === 'bar') {
      axisTop = niceMax(scale * 1.08);
      if (u.pct && scale <= 100 && axisTop > 100) axisTop = 100;
      step = axisTop / 5;
    }
    var sig = { p: p, type: p.type, x: xs, n: n, iEnd: iEnd, y1: xs[0], y2: xs[iEnd], yLast: xs[n - 1], projectedFrom: N.projectedFrom,
      scale: scale, axisTop: axisTop, step: step, unit: u, series: [] };
    sig.tense = xs[iEnd] <= NOW ? (N.projectedFrom ? 'past+projection' : 'past') : 'future';
    var eps = 0.02 * scale;
    N.series.forEach(function (s, si) {
      var v = s.values, real = v.slice(0, iEnd + 1);
      var first = v[0], last = v[iEnd], delta = last - first;
      var mx = Math.max.apply(null, v), mn = Math.min.apply(null, v);
      var rmx = Math.max.apply(null, real), rmn = Math.min.apply(null, real);
      var o = { i: si, label: s.name, name: nameOf(p, s.name), values: v, first: first, last: last, lastAll: v[n - 1], delta: delta,
        rel: first ? delta / first : (delta > 0 ? Infinity : 0), ratio: first ? last / first : Infinity,
        share: Math.abs(delta) / scale, range: (mx - mn) / scale, max: rmx, min: rmn,
        pk: real.indexOf(rmx), tr: real.indexOf(rmn) };
      o.mean = real.reduce(function (a, b) { return a + b; }, 0) / real.length;
      o.residual = /^other\b/i.test(s.name) && N.series.length > 2;   /* an "Other" slice or row: named once, never grouped */
      var steps = []; for (var i = 1; i <= iEnd; i++) steps.push(v[i] - v[i - 1]);
      o.steps = steps;
      o.steady = steadyOf(v, 0, iEnd, eps);
      o.monotone = steps.length > 0 && steps.every(function (d) { return delta >= 0 ? d >= -eps : d <= eps; });
      var signs = steps.map(function (d) { return sgn(d, eps); }).filter(function (x) { return x !== 0; });
      var changes = 0; for (var j = 1; j < signs.length; j++) if (signs[j] !== signs[j - 1]) changes++;
      var counter = steps.filter(function (d) { return delta > 0 ? d < -eps : delta < 0 ? d > eps : Math.abs(d) > eps; }).map(Math.abs);
      var maxCounter = counter.length ? Math.max.apply(null, counter) : 0;
      /* a peak or a low point must be visible: 5% of the scale at least, and
         10% of the scale or a quarter of the starting figure on both sides */
      var big = p.type === 'table' || p.type === 'pie' ? Math.max(p.type === 'pie' ? 3 : 0, 0.2 * Math.abs(first)) : Math.max(0.05 * scale, Math.min(0.1 * scale, 0.25 * Math.abs(first)));
      var isPeak = o.pk > 0 && o.pk < iEnd && rmx - last >= big && rmx - first >= big;
      var isTrough = o.tr > 0 && o.tr < iEnd && first - rmn >= big && last - rmn >= big;
      var flat;
      if (p.type === 'pie') flat = (mx - mn) <= 2;
      else if (p.type === 'table') flat = o.mean > 0 && (mx - mn) / o.mean < 0.10;
      else flat = (mx - mn) / scale < 0.10 && Math.abs(o.rel) < 0.20;
      var low = !flat && step && mx < 0.10 * scale;
      o.cls = flat ? 'flat' : low ? 'low' : isPeak ? 'peak' : isTrough ? 'trough' : (changes >= 3 || (!o.steady && maxCounter >= Math.abs(delta) && signs.length >= 2)) ? 'fluct' : delta > 0 ? 'up' : delta < 0 ? 'down' : 'flat';
      o.deg = sizeOf(sig, o, first, last);
      o.visibleBase = p.type !== 'line' && p.type !== 'bar' ? true : first >= 0.05 * scale;
      o.growsFromLow = o.cls === 'up' && !o.visibleBase && o.ratio >= 3 && o.share >= 0.05;
      var bj = 0, bjAt = 1; steps.forEach(function (d, t) { if (Math.abs(d) > Math.abs(bj)) { bj = d; bjAt = t + 1; } });
      o.bigStep = { d: bj, at: bjAt };
      sig.series.push(o);
    });
    var S = sig.series.filter(function (x) { return !x.residual; });
    sig.residual = sig.series.filter(function (x) { return x.residual; });
    /* leader / lowest at every real point (an "Other" row cannot be named as either, and blocks the claim) */
    function rankAt(i) { return sig.series.slice().sort(function (a, b) { return b.values[i] - a.values[i]; }); }
    var lead = rankAt(0)[0], low = rankAt(0)[sig.series.length - 1], leadAll = true, lowAll = true;
    for (var q = 0; q <= iEnd; q++) { if (rankAt(q)[0] !== lead) leadAll = false; if (rankAt(q)[sig.series.length - 1] !== low) lowAll = false; }
    sig.leader = S.length > 1 && leadAll && !lead.residual ? lead : null;
    sig.lowest = S.length > 1 && lowAll && !low.residual ? low : null;
    function rankS(i) { return S.slice().sort(function (a, b) { return b.values[i] - a.values[i]; }); }
    sig.endLeader = rankS(iEnd)[0];
    sig.startLeader = rankS(0)[0];
    if (sig.leader) { var others = S.filter(function (s) { return s !== sig.leader; }); sig.leaderFar = others.length && Math.min.apply(null, sig.leader.values.slice(0, iEnd + 1)) >= 1.5 * Math.max.apply(null, others.map(function (s) { return s.max; })); }
    /* crossovers you can see: the order of two lines flips and stays flipped,
       neither line hugs the bottom, and the crossing is above a tenth of the scale */
    var lineLike = p.type === 'line';
    sig.crossovers = [];
    for (var a = 0; a < S.length; a++) for (var b = 0; b < S.length; b++) {
      if (a === b) continue;
      var A = S[a], B = S[b];
      if (!(A.values[0] < B.values[0])) continue;      /* A starts below B */
      if (A.cls === 'low' || B.cls === 'low') continue;
      var kk = -1;
      for (var t = 1; t < n; t++) if (A.values[t] > B.values[t]) { var stays = true; for (var t2 = t; t2 < n; t2++) if (!(A.values[t2] > B.values[t2])) stays = false; if (stays) { kk = t; break; } }
      if (kk < 0) continue;
      if (Math.max(A.values[kk], B.values[kk]) < 0.1 * scale) continue;
      var dPrev = Math.abs(A.values[kk - 1] - B.values[kk - 1]), dNow = Math.abs(A.values[kk] - B.values[kk]);
      var when, whenYear = xs[kk], fig = kk;
      if (n === 2 || kk >= iEnd || kk > iEnd) when = 'by ' + xs[kk];
      else if (xs[kk] - xs[kk - 1] === 1) when = 'in ' + xs[kk];
      else if (lineLike && dNow <= 0.25 * dPrev) when = 'around ' + xs[kk];
      else when = 'between ' + xs[kk - 1] + ' and ' + xs[kk];
      /* the subject is the line that moved more */
      var mover = Math.abs(B.delta) > Math.abs(A.delta) ? B : A;
      sig.crossovers.push({ a: A, b: B, k: kk, fig: fig, when: when, year: whenYear, projected: kk > iEnd, gap: dPrev + dNow, mover: mover });
    }
    /* collapse: a drop of half or more between two points (one line) */
    sig.collapse = null;
    S.forEach(function (s) {
      for (var i = 1; i <= iEnd; i++) if (s.values[i - 1] > 0 && s.values[i] <= 0.5 * s.values[i - 1] && s.values[i - 1] - s.values[i] >= 0.2 * scale && !sig.collapse) sig.collapse = { s: s, at: i };
    });
    sig.biggest = S.slice().sort(function (a, b) { return Math.abs(b.delta) - Math.abs(a.delta); })[0];
    sig.groups = groupsOf(sig);
    try { Object.defineProperty(p, '__orrerySig', { value: sig, enumerable: false, configurable: true }); } catch (e) {}
    return sig;
  };
  /* How a crossover is said: the mover is the subject. */
  function crossText(c, proj) {
    var A = c.a, B = c.b, pl = isPl(c.mover.name);
    if (proj) return c.mover === A ? A.name + (pl ? ' are' : ' is') + ' projected to overtake ' + B.name + ' ' + c.when : B.name + (pl ? ' are' : ' is') + ' projected to fall below ' + A.name + ' ' + c.when;
    return c.mover === A ? A.name + ' overtook ' + B.name + ' ' + c.when : B.name + ' fell below ' + A.name + ' ' + c.when;
  }

  /* ============================================================ GROUPS
     The grouping decision tree, cheapest question first:
       Q1 One line only?            → two time phases, split at the turn
       Q2 One group always far above the other (1.5 × at every point),
          each group telling one story?  → A = the high, B = the low
       Q3 Any line flat, or back where it started?
                                    → A = the lines that move, B = the rest
       Q4 Lines going opposite ways? → A = the side with the biggest change
       Q5 All the same way          → A = the high lines, B = the low ones
     Then the check: can each group take ONE true verb? If group A's lines
     go opposite ways, [Trend A] is written as a clause ("X fell, while Y
     rose") instead of one verb.
     ================================================================== */
  function netFlat(s) { return (s.cls === 'peak' || s.cls === 'trough' || s.cls === 'fluct') && Math.abs(s.rel) < 0.10; }
  function groupsOf(sig) {
    var S = sig.series.filter(function (x) { return !x.residual; }), iEnd = sig.iEnd;
    if (S.length === 1) {
      var s = S[0], t;
      if (!s.monotone) t = s.bigStep.at - 1;        /* it turns: split just before the biggest jump or drop */
      else {
        var avg = Math.abs(s.delta) / Math.max(1, iEnd), accel = Math.abs(s.steps[s.steps.length - 1]) > Math.abs(s.steps[0]);
        t = Math.floor(iEnd / 2);
        for (var j = 0; j < s.steps.length; j++) { var bg = Math.abs(s.steps[j]) >= 0.9 * avg; if (accel ? bg : !bg) { t = j; break; } }
        if (t < 1) t = 1;
      }
      if (t >= iEnd) t = iEnd - 1;
      return { q: 'Q1', rule: 'phases', why: 'One line only, so the report splits it into two time phases ' + (!s.monotone ? 'just before the biggest ' + (s.bigStep.d < 0 ? 'drop' : 'jump') + ' (after ' + sig.x[t] + ')' : 'where the pace changes (after ' + sig.x[t] + ')') + '.',
        A: [S[0].i], B: [S[0].i], phase: { A: [0, t], B: [t + 1, iEnd] } };
    }
    function ids(arr) { return arr.slice().sort(function (a, b) { return Math.abs(b.delta) - Math.abs(a.delta); }).map(function (x) { return x.i; }); }
    function oneStory(arr) {
      var mv = arr.filter(function (x) { return x.cls !== 'flat' && x.cls !== 'low'; });
      return !(mv.some(function (x) { return x.delta > 0; }) && mv.some(function (x) { return x.delta < 0; }));
    }
    var byMean = S.slice().sort(function (a, b) { return b.mean - a.mean; });
    var best = null;
    for (var k = 1; k < byMean.length; k++) {
      var up = byMean.slice(0, k), lo = byMean.slice(k);
      var minUp = Math.min.apply(null, up.map(function (x) { return Math.min.apply(null, x.values); }));
      var maxLo = Math.max.apply(null, lo.map(function (x) { return Math.max.apply(null, x.values); }));
      if (maxLo > 0 && minUp >= 1.5 * maxLo && oneStory(up) && oneStory(lo) && (!best || minUp / maxLo > best.r)) best = { r: minUp / maxLo, up: up, lo: lo };
    }
    if (best) return { q: 'Q2', rule: 'level', why: 'One group is always far above the other (its lowest point is ' + round(best.r, 1) + ' times the other group\'s highest), and each group tells one story.', A: ids(best.up), B: ids(best.lo) };
    var still = S.filter(function (x) { return x.cls === 'flat' || x.cls === 'low' || netFlat(x); }), movers = S.filter(function (x) { return still.indexOf(x) < 0; });
    if (still.length && movers.length) return { q: 'Q3', rule: 'flat', why: list(still.map(function (x) { return x.name; })) + (still.length > 1 ? ' hardly move or end' : ' hardly moves or ends') + ' where ' + (still.length > 1 ? 'they' : 'it') + ' began, so ' + (still.length > 1 ? 'they make' : 'it makes') + ' group B; the lines that move make group A.', A: ids(movers), B: ids(still) };
    var ups = S.filter(function (x) { return x.delta > 0; }), downs = S.filter(function (x) { return x.delta <= 0; });
    if (ups.length && downs.length) {
      var bigUp = Math.max.apply(null, ups.map(function (x) { return Math.abs(x.delta); })), bigDown = Math.max.apply(null, downs.map(function (x) { return Math.abs(x.delta); }));
      var Aup = bigUp >= bigDown;
      return { q: 'Q4', rule: 'direction', why: list(ups.map(function (x) { return x.name; })) + ' end higher and ' + list(downs.map(function (x) { return x.name; })) + ' end lower, so each direction is one group. Group A is the side with the biggest change.', A: ids(Aup ? ups : downs), B: ids(Aup ? downs : ups) };
    }
    var gap = -1, cut = 1;
    for (var gi = 1; gi < byMean.length; gi++) { var d = byMean[gi - 1].mean - byMean[gi].mean; if (d > gap) { gap = d; cut = gi; } }
    return { q: 'Q5', rule: 'highlow', why: 'Every line ends ' + (S[0].delta >= 0 ? 'higher' : 'lower') + ' than it began, so the groups are the high lines and the low lines (the biggest gap between them).', A: ids(byMean.slice(0, cut)), B: ids(byMean.slice(cut)) };
  }

  /* ============================================================ WORDS
     A trend phrase = a verb + one SIZE word; Band 7 and 8 add PACE
     (steadily, gradually) only when the pace signal is on.            */
  var SIZEW = { 6: ['slightly', 'slightly', 'considerably', 'sharply'], 7: ['marginally', 'slightly', 'considerably', 'dramatically'], 8: ['marginally', 'slightly', 'considerably', 'steeply'] };
  function verbUp(b) { return b === 6 ? 'rose' : b === 7 ? 'increased' : 'climbed'; }
  function verbDown(b) { return b === 6 ? 'fell' : b === 7 ? 'decreased' : 'declined'; }
  /* one shared ladder for multiples and fractions */
  function timesOf(r) {
    if (r >= 10.5) return 'more than ten times';
    if (r >= 3) { var n = Math.floor(r), f = r - n, W = ['', '', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten']; if (f >= 0.75) return 'almost ' + W[n + 1] + ' times'; if (f < 0.15) return 'about ' + W[n] + ' times'; return 'more than ' + W[n] + ' times'; }
    if (r >= 2.8) return 'almost three times';
    if (r >= 2.1) return 'more than twice';
    if (r >= 1.9) return 'roughly twice';
    if (r >= 1.75) return 'almost twice';
    if (r >= 1.6) return 'more than one and a half times';
    if (r >= 1.4) return 'around one and a half times';
    return '';
  }
  function shareOf(r) {
    var T = [[0.1, 'a tenth'], [0.2, 'a fifth'], [0.25, 'a quarter'], [1 / 3, 'a third'], [0.4, 'two fifths'], [0.5, 'half'], [2 / 3, 'two thirds'], [0.75, 'three quarters']];
    if (r < 0.08) return 'a small fraction of';
    var best = T[0]; T.forEach(function (t) { if (Math.abs(t[0] - r) < Math.abs(best[0] - r)) best = t; });
    if (r > 0.85) return '';
    var ofOf = function (t) { return t[1] + (t[1] === 'half' ? '' : ' of'); };
    if (Math.abs(best[0] - r) <= 0.03) return 'about ' + ofOf(best);
    if (r < best[0]) return 'less than ' + ofOf(best);
    var nx = T[T.indexOf(best) + 1];
    return nx ? 'less than ' + ofOf(nx) : 'more than ' + ofOf(best);
  }
  function multipleClause(sig, s) {
    if (!s.visibleBase || !(s.first > 0)) return '';
    var r = s.ratio;
    if (s.delta > 0) return r >= 3.8 ? 'ending at ' + timesOf(r) + ' its starting level' : r >= 3.2 ? 'more than tripling' : r >= 2.8 ? 'roughly tripling' : r >= 2.1 ? 'more than doubling' : r >= 1.9 ? 'roughly doubling' : r >= 1.75 ? 'almost doubling' : '';
    var sh = shareOf(r);
    return sh ? 'ending at ' + sh + ' its starting level' : '';
  }
  function one(sig, s, band, noMult) {
    var b = band, x = sig.x, d = s.deg, sw = SIZEW[b][d];
    switch (s.cls) {
      case 'flat': return b === 6 ? 'stayed about the same' : b === 7 ? 'remained broadly stable' : (s.range === 0 ? 'remained unchanged' : s.range < 0.03 ? 'remained virtually unchanged' : 'saw little change');
      case 'low': return b === 6 ? 'stayed very low' : b === 7 ? 'remained very low throughout' : 'remained at very low levels throughout';
      case 'peak': return b === 6 ? 'rose and then fell' : b === 7 ? 'rose to a peak in ' + x[s.pk] + ' before falling' : 'peaked in ' + x[s.pk] + ' and then fell away' + (s.last < s.first && !noMult ? ', ending below its starting level' : '');
      case 'trough': return b === 6 ? 'fell and then recovered' : b === 7 ? 'fell to a low in ' + x[s.tr] + ' before recovering' : 'dipped to a low in ' + x[s.tr] + ' before recovering' + (s.last >= 0.9 * s.first ? ' almost fully' : '');
      case 'fluct': return b === 6 ? 'went up and down' : b === 7 ? 'fluctuated' + (s.delta > 0 ? ' but ended slightly higher' : s.delta < 0 ? ' but ended slightly lower' : '') : 'fluctuated' + (s.delta > 0 ? ', ending slightly higher than at the start' : s.delta < 0 ? ', ending slightly lower than at the start' : '');
      case 'up': {
        if (s.growsFromLow) return b === 6 ? 'rose from a very low level' : 'grew from a very low level';
        var w = verbUp(b) + ' ' + sw;
        if (b === 7 && s.steady && d <= 2) w = d <= 1 ? 'rose gradually' : 'rose steadily';
        if (b === 8 && s.steady && d === 2) w = 'climbed steadily';
        if (d === 3 && s.steady) w = b === 6 ? 'rose significantly' : b === 7 ? 'increased substantially' : 'climbed steadily';
        else if (b === 8 && d === 3) w = 'surged';
        if (b === 8 && !noMult) { var m = d >= 2 ? multipleClause(sig, s) : ''; if (m) w += ', ' + m; }
        return w;
      }
      case 'down': {
        var w2 = verbDown(b) + ' ' + sw;
        if (b === 7 && s.steady && d <= 2) w2 = d <= 1 ? 'declined gradually' : 'declined steadily';
        if (b === 8 && s.steady && d === 2) w2 = 'fell steadily';
        if (d === 3 && s.steady) w2 = b === 6 ? 'fell significantly' : b === 7 ? 'decreased substantially' : 'fell steadily';
        else if (b === 8 && d === 3) w2 = 'plunged';
        if (b === 8 && !noMult) { var m2 = d >= 2 ? multipleClause(sig, s) : ''; if (m2) w2 += ', ' + m2; }
        return w2;
      }
    }
    return 'changed';
  }
  /* The phrase for a group of lines. A group whose lines go opposite ways
     gets a clause with names (clause: true). */
  O.moveOf = function (p, members, band, rule) {
    return groupMove(O.signals(p), members, band, rule).text;
  };
  function groupMove(sig, members, band, rule) {
    var p = sig.p, S = members.map(function (i) { return sig.series[i]; });
    if (S.length === 1) return { text: one(sig, S[0], band) };
    var cls = S.map(function (s) { return s.cls; });
    var both = S.length === 2 ? 'both ' : 'all ';
    var same = cls.every(function (c) { return c === cls[0]; });
    if (same && (cls[0] === 'up' || cls[0] === 'down')) {
      var degs = S.map(function (s) { return s.deg; }), dmin = Math.min.apply(null, degs), dmax = Math.max.apply(null, degs);
      var verb = cls[0] === 'up' ? verbUp(band) : verbDown(band);
      if (dmax !== dmin) {
        var most = S.slice().sort(function (a, b) { return b.deg - a.deg || Math.abs(b.delta) - Math.abs(a.delta); })[0];
        var two = S.length === 2, rest = S.filter(function (x) { return x !== most; }).map(function (x) { return Math.abs(x.delta); }), far = Math.abs(most.delta) >= 2 * Math.max.apply(null, rest);
        return { text: band === 6 ? verb : both + verb + ', ' + most.name + ' ' + (band === 7 ? (two ? 'by more' : 'by the most') : (far ? (two ? 'far more markedly' : 'by far the most') : (two ? 'more markedly' : 'most markedly'))) };
      }
      var w = one(sig, { cls: cls[0], deg: dmin, steady: S.every(function (s) { return s.steady; }), first: 0, visibleBase: false, growsFromLow: false, ratio: 1, range: 1, delta: S[0].delta, last: 0 }, band, true);
      return { text: (band === 8 ? both : '') + w };
    }
    if (same && (cls[0] === 'flat' || cls[0] === 'low')) return { text: (band === 8 ? both : '') + one(sig, S[0], band) };
    if (rule === 'level') {
      var others = sig.series.filter(function (x) { return members.indexOf(x.i) < 0 && !x.residual; });
      var high = S[0].mean >= others.reduce(function (a, x) { return Math.max(a, x.mean); }, 0);
      return { text: high ? (band === 6 ? 'stayed much higher than the others' : band === 7 ? 'remained well above the others throughout' : 'stayed far ahead of the others throughout')
        : (band === 6 ? 'stayed much lower than the others' : band === 7 ? 'remained well below the others throughout' : 'stayed far behind the others throughout') };
    }
    /* everything that ends where it began (flat lines and dips that recover) */
    if (S.every(function (s) { return s.cls === 'flat' || netFlat(s); })) return { text: band === 6 ? 'ended at about the same level as they began' : band === 7 ? 'ended close to their starting levels' : 'finished close to where they began' };
    var ups = S.filter(function (s) { return s.delta > 0; }), downs = S.filter(function (s) { return s.delta < 0; });
    if (ups.length && downs.length) {
      /* one verb cannot be true of every line: a clause with names */
      var first = Math.abs(ups[0].delta) >= Math.abs(downs[0].delta) ? ups : downs, secondG = first === ups ? downs : ups;
      var part = function (arr, lead) { var nmz = list(arr.map(function (s) { return s.name; })); return (lead ? measure(p, nmz, arr.length) : (arr.length > 1 ? 'the figures for ' : 'the figure for ') + nmz) + ' ' + groupMove(sig, arr.map(function (s) { return s.i; }), band, '').text; };
      return { text: part(first, true) + ', while ' + part(secondG, false), clause: true };
    }
    var sgnAll = S.map(function (s) { return s.delta > 0 ? 1 : s.delta < 0 ? -1 : 0; });
    if (sgnAll.every(function (x) { return x === sgnAll[0]; }) && sgnAll[0] !== 0) return { text: (band === 8 ? both : '') + (sgnAll[0] > 0 ? verbUp(band) : verbDown(band)) + ' overall' };
    return { text: band === 6 ? 'changed considerably' : band === 7 ? 'changed significantly' : 'underwent the biggest changes' };
  }

  /* Medium check of a trend phrase the student types for some lines. */
  var UP = /\b(rose|rise[sn]?|rising|increas\w*|grew|grow\w*|climb\w*|went up|doubl\w*|tripl\w*|soar\w*|surg\w*|jump\w*|gain\w*|edged up|recover\w*|higher)\b/i;
  var DOWN = /\b(fell|fall\w*|declin\w*|decreas\w*|dropp?\w*|went down|halv\w*|plummet\w*|plung\w*|shr[aiu]nk\w*|collaps\w*|dipp?\w*|slipp?\w*|los[st]\w*|lower)\b/i;
  var FLAT = /\b(stable|steady|unchanged|constant|remained|stayed|little change|changed (very )?little|level|flat|the same|barely changed|hardly changed|close to (where|their|its))\b/i;
  var STRONG = /\b(sharp\w*|dramatic\w*|steep\w*|significant\w*|considerabl\w*|substantial\w*|strong\w*|rapid\w*|doubl\w*|tripl\w*|surg\w*|soar\w*|plummet\w*|plung\w*|collaps\w*|fold|half|halv\w*|third)\b/i;
  var WEAK = /\b(slight\w*|gradual\w*|modest\w*|marginal\w*|a little|edged|slipp?\w*|gentl\w*|slow\w*)\b/i;
  O.checkMove = function (p, members, phrase, band) {
    var v = String(phrase || '').trim(), sig = O.signals(p);
    if (!v) return { status: 'none', note: '' };
    if (/\d/.test(v.replace(/\b(18|19|20)\d\d\b/g, ''))) return { status: 'bad', note: 'No figures in a trend phrase: it goes into the overview first.' };
    if (/\b(rises|falls|grows|increases|decreases|declines|drops|remains|stays|fluctuates)\b/i.test(v) && sig.tense !== 'future') return { status: 'bad', note: 'Tense: the years are finished, so use the past simple (rose, fell, remained).' };
    if (/\b(did not|didn't|never|no longer)\b/i.test(v)) return { status: 'near', note: 'Say what the line did, not what it did not do.' };
    var S = members.map(function (i) { return sig.series[i]; });
    var vv = v.replace(/\bsteadily\b|\bsteady (rise|fall|increase|decrease|decline|growth)\b/gi, ' ');
    var fl = /fluctuat|up and down|zigzag|no clear trend/i.test(v);
    var up = UP.test(vv), down = DOWN.test(vv), flat = FLAT.test(vv);
    var said = fl ? 'fluct' : (up && down) ? 'both' : up ? 'up' : down ? 'down' : flat ? 'flat' : /opposite|different|changed|change/i.test(v) ? 'mixed' : '';
    if (!said) return { status: 'near', note: 'Use a trend word: rose, fell, remained stable, fluctuated, peaked.' };
    var need = S.length === 1 ? S[0].cls : (function () {
      var c = S.map(function (s) { return s.cls; });
      if (c.every(function (x) { return x === c[0]; })) return c[0];
      if (S.every(function (s) { return s.cls === 'flat' || netFlat(s); })) return 'netflat';
      var sg = S.map(function (s) { return s.delta > 0 ? 1 : s.delta < 0 ? -1 : 0; });
      if (sg.every(function (x) { return x === sg[0]; }) && c.every(function (x) { return x === 'up' || x === 'down' || x === 'fluct' || x === 'low' || x === 'peak' || x === 'trough'; })) return sg[0] > 0 ? 'up' : 'down';
      return 'mixed';
    })();
    var table = sig.type === 'table' || sig.type === 'pie';
    var ok = false, hint = '';
    if (need === 'up') { ok = said === 'up' || (said === 'flat' && /low/i.test(v) && S.some(function (s) { return s.cls === 'low'; })); hint = 'Compare the first and the last figure: is the end higher or lower?'; }
    else if (need === 'down') { ok = said === 'down'; hint = 'Compare the first and the last figure: is the end higher or lower?'; }
    else if (need === 'flat' || need === 'netflat') { ok = said === 'flat' || (need === 'netflat' && (said === 'both' || /began|start/i.test(v))); hint = table ? 'Compare the numbers in the row: do they change by less than a tenth?' : 'Does the line move by less than a tenth of the highest value on the chart?'; }
    else if (need === 'low') { ok = said === 'flat' || /low/i.test(v) || said === 'up'; hint = 'Where is this line on the chart: near the bottom the whole time?'; }
    else if (need === 'peak') { ok = said === 'both' || (/peak|high point|highest/i.test(v) && (down || /then|before/i.test(v))); hint = 'The line goes up and then down. Say both movements (… and then …).'; }
    else if (need === 'trough') { ok = said === 'both' || /low|recover/i.test(v); hint = 'The line goes down and then comes back. Say both movements.'; }
    else if (need === 'fluct') { ok = said === 'fluct' || said === 'both'; hint = 'The line goes up and down several times. Which verb says that?'; }
    else { ok = said === 'mixed' || said === 'both' || /level|ahead|above|below|behind|higher|lower|while|whereas/i.test(v); hint = 'These lines do not all move the same way. Say what each side did (X fell, while Y rose), or what they share.'; }
    /* a level group: "stayed far ahead of / below the others" is true if the group is above (below) the rest at every point */
    if (!ok && /\b(higher|lower|above|below|ahead|behind)\b/i.test(v) && /\b(others|rest|other two|other cities|other countries)\b/i.test(v)) {
      var rest = sig.series.filter(function (x) { return members.indexOf(x.i) < 0 && !x.residual; });
      var hiAll = S.every(function (s) { return rest.every(function (r) { return s.values.every(function (val, i) { return val > r.values[i]; }); }); });
      var loAll = S.every(function (s) { return rest.every(function (r) { return s.values.every(function (val, i) { return val < r.values[i]; }); }); });
      var saysHi = /\b(higher|above|ahead)\b/i.test(v);
      if ((saysHi && hiAll) || (!saysHi && loAll)) return { status: 'ok', note: 'Right: this group is ' + (saysHi ? 'above' : 'below') + ' the others at every point.' };
    }
    if (!ok) return { status: 'bad', note: hint };
    /* size, for one line going one way */
    if (S.length === 1 && (need === 'up' || need === 'down') && !/very low level|almost nothing/i.test(v)) {
      var d = S[0].deg;
      if (d === 3 && WEAK.test(v) && !STRONG.test(v)) return { status: 'near', note: 'Right direction, but this is a big change: "slightly" or "gradually" is too weak.' };
      if (d <= 1 && STRONG.test(v)) return { status: 'near', note: 'Right direction, but this is a small change: "sharply" or "dramatically" is too strong.' };
      if (/steadily|gradually/i.test(v) && !S[0].steady) return { status: 'near', note: 'Right direction, but the pace was not steady: one step is much bigger than the others. Use a size word (slightly, considerably, sharply) instead.' };
      if (band >= 7 && !STRONG.test(v) && !WEAK.test(v) && !/steady|steadily/i.test(v)) return { status: 'near', note: 'Right direction. For Band ' + band + ', add one size word that fits: slightly, considerably, sharply…' };
    }
    return { status: 'ok', note: 'Right: ' + (need === 'mixed' ? 'these lines move in different ways.' : need === 'low' ? 'it stays low.' : need === 'netflat' ? 'they end close to where they began.' : 'the movement is ' + need + '.') };
  };

  /* ====================================================== KEY FEATURE
     Order (Band 7): a change of leader · the leader far ahead throughout ·
     a collapse or a peak · another crossover · the leader throughout · the
     biggest change; a projection is added as a second clause.
     Band 6: the simplest true fact. Band 8: the feature plus what follows.  */
  function featureOf(sig, band, grp) {
    var S = sig.series.filter(function (x) { return !x.residual; }), p = sig.p, x = sig.x;
    var subj = content(p).subject || (S[0] && S[0].name);
    if (S.length === 1) {
      var s = S[0], pl = isPl(subj), wr = pl ? 'were' : 'was';
      if (sig.collapse) {
        var lowI = s.tr, rec = s.last >= 0.85 * s.max;
        if (band === 6) return { kind: 'low', text: subj + ' ' + wr + ' lowest in ' + x[lowI] };
        if (band === 7) return { kind: 'collapse', text: 'the lowest point came in ' + x[lowI] };
        return { kind: 'collapse', text: 'by ' + sig.y2 + ' ' + subj + ' had ' + (rec ? 'almost returned to ' : 'recovered only part of the way to ') + (pl ? 'their ' : 'its ') + x[s.pk] + ' peak' };
      }
      if (s.pk > 0 && s.pk < sig.iEnd) {
        var endShare = s.last / s.max;
        if (band === 6) return { kind: 'peak', text: subj + ' ' + wr + ' highest in ' + x[s.pk] };
        if (band === 7) return { kind: 'peak', text: subj + ' peaked in ' + x[s.pk] + ' before falling sharply' };
        var sh = shareOf(endShare);
        return { kind: 'peak', text: subj + ' peaked in ' + x[s.pk] + ' and then fell to ' + (sh ? sh + ' that level' : 'well below that level') + ' by ' + sig.y2 };
      }
      if (band === 6) return { kind: 'end', text: subj + ' ' + wr + ' ' + (s.delta >= 0 ? 'highest' : 'lowest') + ' in ' + sig.y2 };
      var pb = grp.phase.B[0], accel = Math.abs(s.steps[s.steps.length - 1]) > Math.abs(s.steps[0]);
      var growth = s.delta >= 0 ? 'growth' : 'the decline';
      if (band === 7) return { kind: 'pace', text: growth + ' was ' + (accel ? 'slow at first but much faster from ' : 'fast at first but much slower from ') + x[pb] };
      var bs = s.bigStep;
      return { kind: 'pace', text: growth + (accel ? ' accelerated sharply from ' : ' slowed markedly from ') + x[pb] + (accel ? ', with the largest ' + (s.delta >= 0 ? 'increase' : 'fall') + ' in ' + (bs.at === sig.iEnd ? 'the final year' : x[bs.at]) : '') };
    }
    var real = sig.crossovers.filter(function (c) { return !c.projected; }), proj = sig.crossovers.filter(function (c) { return c.projected; });
    var change = real.filter(function (c) { return c.a === sig.endLeader && c.b === sig.startLeader; })[0];
    var otherCross = real.slice().sort(function (a, b) { return b.gap - a.gap; })[0];
    var peakLine = S.filter(function (s) { return (s.cls === 'peak' || s.cls === 'trough') && Math.abs(s.max - s.min) >= 0.2 * sig.scale; })[0];
    function projClause() {
      var pc = proj.slice().sort(function (a, b) { return b.gap - a.gap; })[0];
      if (pc) return crossText(pc, true);
      var big = S.slice().sort(function (a, b) { return Math.abs(b.lastAll - b.last) - Math.abs(a.lastAll - a.last); })[0];
      return big.name + (isPl(big.name) ? ' are' : ' is') + ' expected to keep ' + (big.lastAll > big.last ? 'rising' : 'falling') + ' until ' + sig.yLast;
    }
    if (band === 6) {
      if (sig.leader) return { kind: 'leader', text: sig.leader.name + ' ' + had(sig.leader.name) + ' the highest figure throughout' };
      return { kind: 'end', text: sig.endLeader.name + ' had the highest figure in ' + sig.y2 };
    }
    var main;
    if (change) main = { kind: 'cross', text: crossText(change) + (band === 8 ? (change.mover === change.a ? ' and ended the period with the highest figure' : ' and lost ' + its(change.b.name) + ' place at the top') : '') };
    else if (sig.leader && sig.leaderFar) main = { kind: 'leader', text: sig.leader.name + ' ' + (band === 8 ? 'had by far the highest figure throughout' : was(sig.leader.name) + ' far ahead of the others throughout') };
    else if (peakLine) main = { kind: 'peak', text: peakLine.name + ' ' + (peakLine.cls === 'peak' ? 'peaked in ' + x[peakLine.pk] : 'hit a low in ' + x[peakLine.tr]) + (band === 8 ? (peakLine.cls === 'peak' ? ' and then lost most of its gains' : ' and then recovered') : '') };
    else if (otherCross) main = { kind: 'cross', text: crossText(otherCross) };
    else if (sig.leader) main = { kind: 'leader', text: sig.leader.name + ' ' + (band === 8 ? was(sig.leader.name) + ' ahead of the others throughout' : 'had the highest figure throughout') };
    else main = { kind: 'biggest', text: sig.biggest.name + ' saw the ' + (band === 8 ? 'most dramatic' : 'largest') + ' change' };
    if (sig.projectedFrom) main = { kind: main.kind + '+proj', text: main.text + ', and ' + projClause() };
    return main;
  }
  function was(name) { return isPl(name) ? 'were' : 'was'; }
  function had() { return 'had'; }
  function its(name) { return isPl(name) ? 'their' : 'its'; }
  function itP(name) { return isPl(name) ? 'they' : 'it'; }

  /* =========================================================== FIGURES
     Printed on the chart → the exact figure. Read off the side axis →
     the nearest fifth of a gridline (a "nice" step), with "about" or
     "around" (Band 6–7) or "just over / just under" (Band 8) when the
     point is not on the mark. Below the first mark: "less than …".     */
  function printed(sig, si, i) {
    if (sig.type === 'table' || sig.type === 'pie') return true;
    if (sig.type === 'bar') return sig.series.length <= 3;
    return i === sig.n - 1;
  }
  function readStep(sig) { return niceStep(sig.step / 5); }
  function figure(sig, si, i, band, opt) {
    var v = sig.series[si].values[i], p = sig.p;
    if (printed(sig, si, i) || !sig.step) return { text: figText(p, v, opt), exact: true, v: v, read: v };
    if (Math.abs(v / sig.step - Math.round(v / sig.step)) < 1e-9) return { text: figText(p, v, opt), exact: true, v: v, read: v };
    var q = readStep(sig);
    if (v < q * 0.75) return { text: 'less than ' + figText(p, q, opt), exact: false, v: v, read: q / 2, word: 'less than', below: true };
    var r = round(Math.round(v / q) * q, 6);
    var off = Math.abs(v - r) >= 0.2 * q;
    var word = band === 8 ? (!off ? 'around ' : v > r ? 'just over ' : 'just under ') : (band === 7 ? 'around ' : 'about ');
    return { text: word + figText(p, r, opt), exact: false, v: v, read: r, word: word.trim() };
  }
  function oxford(names) { return names.some(function (n) { return / and /.test(n); }) && names.length > 2 ? names.slice(0, -1).join(', ') + ', and ' + names[names.length - 1] : list(names); }
  function figsFor(sig, members, i, band) {
    var f = members.map(function (si) { return figure(sig, si, i, band); });
    if (f.length === 1) return f[0].text;
    var u = unitOf(sig.p);
    if (f.every(function (x) { return x.text === f[0].text; })) return f[0].text + ' each';
    var parts = members.map(function (si, k) { return figure(sig, si, i, band, { noNoun: u.noun && !u.pct && k < members.length - 1 }).text; });
    return list(parts) + ' respectively';
  }

  /* ============================================================ DERIVE */
  O.derive = function (p, band) {
    band = +band || 7;
    var sig = O.signals(p), g = sig.groups, S = sig.series, x = sig.x, cn = content(p);
    var v = {}, why = {};
    var single = g.rule === 'phases';
    var nCharts = p.type === 'pie' ? (p.data.charts || []).length : 1;
    v.visual = p.type === 'line' ? 'line graph' : p.type === 'bar' ? 'bar chart' : p.type === 'table' ? 'table' : (nCharts === 2 ? 'two pie charts' : nCharts === 3 ? 'three pie charts' : 'pie charts');
    why.visual = { look: 'The shape of the visual (and the first words of the task sentence).', think: 'Lines → line graph · bars → bar chart · rows and columns → table · circles → pie chart(s); two or more pies are named in the plural.', signal: p.type + (nCharts > 1 ? ' × ' + nCharts : '') };
    v.what = (cn.what || {})[band] || '';
    why.what = { look: 'The task sentence and the chart title: what is counted, who or where, and the unit (' + (p.units || 'no unit') + ').', think: band === 6 ? 'Rule P, Band 6: change one part of the noun phrase (the number of → how many) and say the unit, so no run of eight task words is copied.' : band === 7 ? 'Rule P, Band 7: change the noun phrase and the verb inside it, and say the unit.' : 'Rule P, Band 8: build a new noun phrase (a compound noun or a "how" clause) and keep the unit.', signal: p.rubric };
    v.y1 = String(sig.y1); v.y2 = String(sig.y2);
    why.y1 = { look: 'The first label on the bottom axis' + (p.type === 'table' ? ' (the first year column)' : p.type === 'pie' ? ' (the title of the first pie)' : '') + '.', think: 'The first year opens the time frame in P1 and the start figures in P3–P4.', signal: String(sig.y1) };
    why.y2 = { look: sig.projectedFrom ? 'The last year before the dotted (projected) part of the axis.' : 'The last label on the bottom axis.', think: sig.projectedFrom ? 'Years after ' + sig.projectedFrom + ' are projections: they go into the overview with "is expected to", not into the time frame.' : 'The last year closes the time frame. It is already in the past, so the tense is the past simple.', signal: String(sig.y2) + (sig.projectedFrom ? ' (projections to ' + sig.yLast + ')' : '') };
    var names = function (ids) { return oxford(ids.map(function (i) { return S[i].name; })); };
    if (single) {
      var subj = cn.subject || S[0].name;
      v.groupA = subj + ' between ' + x[g.phase.A[0]] + ' and ' + x[g.phase.A[1]];
      v.groupB = subj + ' between ' + x[g.phase.B[0]] + ' and ' + x[g.phase.B[1]];
    } else { v.groupA = names(g.A); v.groupB = names(g.B); }
    var gsig = single ? 'one line' : S.filter(function (s) { return !s.residual; }).map(function (s) { return s.label + ': ' + STORYW[s.cls] + (s.cls === 'flat' || s.cls === 'low' ? '' : ' (' + (s.delta > 0 ? '+' : '') + fmt(round(s.delta, 2)) + ')'); }).join(' · ');
    why.groupA = { look: 'The legend (the names of the lines, bars, rows or slices) and where each one starts and ends.', think: g.q + ' · ' + g.why, signal: gsig };
    why.groupB = { look: why.groupA.look, think: 'Group B is everything not in group A, so every category is named in the report' + (sig.residual.length ? ' (an "Other" category gets one sentence of its own)' : '') + '.', signal: gsig };
    var mA, mB;
    if (single) { mA = { text: phaseMove(sig, [g.phase.A[0], g.phase.A[1]], band) }; mB = { text: phaseMove(sig, [g.phase.A[1], g.phase.B[1]], band) }; }
    else { mA = groupMove(sig, g.A, band, g.rule); mB = groupMove(sig, g.B, band, g.rule); }
    if (mA.text === mB.text) mB.text = 'also ' + mB.text;
    v.moveA = mA.text; v.moveB = mB.text;
    var msig = function (ids) { return ids.map(function (i) { var s = S[i]; return s.label + ': ' + fmt(s.first) + ' → ' + fmt(s.last) + ' · ' + STORYW[s.cls] + ' · size ' + ['tiny', 'small', 'medium', 'big'][s.deg] + ' (' + sizeWhy(sig, s) + ')' + (s.steady ? ' · steady pace' : ''); }).join(' | '); };
    var moveThink = { 6: 'Band 6: a core verb (rose, fell, stayed) and one size word: slightly (small), considerably (medium), sharply (big).', 7: 'Band 7: the size word must match the size of the change (slightly · considerably · dramatically); "gradually" or "steadily" only when every step goes the same way at a similar pace; a peak or a low point is named with its year.', 8: 'Band 8: say the shape and the size (climbed steadily, almost doubling · peaked in 2014 and then fell away). Lines that go opposite ways get a clause: X fell, while Y rose.' };
    why.moveA = { look: 'Where group A starts and where it ends, and the shape in between.', think: moveThink[band] + (mA.clause ? ' These lines go opposite ways, so one verb cannot be true of all of them: write a clause.' : ''), signal: single ? 'phase ' + x[g.phase.A[0]] + '–' + x[g.phase.A[1]] : msig(g.A), clause: !!mA.clause };
    why.moveB = { look: 'Where group B starts and where it ends, and the shape in between.', think: moveThink[band] + (mB.clause ? ' These lines go opposite ways: write a clause.' : ''), signal: single ? 'from ' + x[g.phase.A[1]] + ' to ' + x[g.phase.B[1]] : msig(g.B), clause: !!mB.clause };
    var f = featureOf(sig, band, g);
    v.feature = f.text;
    var fsig = [];
    sig.crossovers.forEach(function (c) { fsig.push(c.a.label + ' passes ' + c.b.label + ' ' + c.when + (c.projected ? ' (projected)' : '')); });
    if (sig.leader) fsig.push(sig.leader.label + ' highest at every point' + (sig.leaderFar ? ', far ahead' : ''));
    if (sig.collapse) fsig.push('collapse in ' + x[sig.collapse.at]);
    if (sig.projectedFrom) fsig.push('projections ' + sig.projectedFrom + '–' + sig.yLast);
    if (!fsig.length) fsig.push('highest at the end: ' + sig.endLeader.label);
    why.feature = { look: 'Places where lines cross, the line on top, a collapse or a peak, the dotted projection.', think: band === 6 ? 'Band 6: the simplest true big-picture fact (the highest line throughout, or at the end). No figures.' : band === 7 ? 'Band 7: the strongest feature, in this order: a change of leader · the leader far ahead · a peak or a collapse · another crossover you can see · the top line · the biggest change; a projection is added as a second clause. No figures.' : 'Band 8: the strongest feature plus what follows from it (overtook … and ended the period with the highest figure). No figures.', signal: fsig.join(' · '), kind: f.kind };
    var a1, a2, b1, b2;
    if (single) {
      a1 = figure(sig, S[0].i, g.phase.A[0], band).text; a2 = figure(sig, S[0].i, g.phase.A[1], band).text;
      b1 = figure(sig, S[0].i, g.phase.B[0], band).text; b2 = figure(sig, S[0].i, g.phase.B[1], band).text;
      v.figA1 = a1; v.figA2 = a2 + ' in ' + x[g.phase.A[1]]; v.figB1 = b1 + ' in ' + x[g.phase.B[0]]; v.figB2 = b2 + ' in ' + x[g.phase.B[1]];
    } else {
      v.figA1 = figsFor(sig, g.A, 0, band); v.figA2 = figsFor(sig, g.A, sig.iEnd, band) + ' in ' + sig.y2;
      v.figB1 = figsFor(sig, g.B, 0, band); v.figB2 = figsFor(sig, g.B, sig.iEnd, band) + ' in ' + sig.y2;
    }
    var readThink = !sig.step ? 'Every figure is printed on this ' + (p.type === 'pie' ? 'pie' : p.type) + ': copy it exactly, with its unit.' :
      (p.type === 'bar' && S.length <= 3 ? 'The bars carry printed values: copy them exactly, with the unit.' :
        'Only the last value of each line is printed. Read the others off the side axis to the nearest ' + fmt(readStep(sig)) + ' (a fifth of a gridline of ' + fmt(sig.step) + '): ' + (band === 8 ? 'off the mark, say "just over" or "just under".' : 'off the mark, say "about" or "around".') + ' Below the first mark: "less than …".');
    var unitThink = ' Unit: ' + (p.units || '') + (unitOf(p).mult === 1e3 ? ' → 420 on the axis = 420,000.' : unitOf(p).mult === 1e6 ? ' → write "million".' : '.');
    ['figA1', 'figA2', 'figB1', 'figB2'].forEach(function (k) { why[k] = { look: 'The side axis (and any printed value) at the ' + (/1$/.test(k) ? 'first' : 'last') + ' year, for group ' + k.charAt(3) + '.', think: readThink + unitThink + (single ? '' : (g[k.charAt(3)].length > 1 ? ' Two or more lines: give each figure in the order of the names, then "respectively".' : '')), signal: '' }; });
    var vals = function (ids, i) { return ids.map(function (si) { return S[si].label + ' ' + fmt(S[si].values[i]); }).join(', '); };
    if (single) {
      var s0 = S[0].i;
      why.figA1.signal = x[g.phase.A[0]] + ': ' + fmt(S[s0].values[g.phase.A[0]]); why.figA2.signal = x[g.phase.A[1]] + ': ' + fmt(S[s0].values[g.phase.A[1]]);
      why.figB1.signal = x[g.phase.B[0]] + ': ' + fmt(S[s0].values[g.phase.B[0]]); why.figB2.signal = x[g.phase.B[1]] + ': ' + fmt(S[s0].values[g.phase.B[1]]);
    } else {
      why.figA1.signal = sig.y1 + ': ' + vals(g.A, 0); why.figA2.signal = sig.y2 + ': ' + vals(g.A, sig.iEnd);
      why.figB1.signal = sig.y1 + ': ' + vals(g.B, 0); why.figB2.signal = sig.y2 + ': ' + vals(g.B, sig.iEnd);
    }
    var steps = O.VARS.map(function (d) { return { key: d.key, label: d.label, para: d.para, gate: d.gate, ask: d.ask, lookAt: d.look, look: why[d.key].look, think: why[d.key].think, signal: why[d.key].signal, value: v[d.key] }; });
    return { vars: v, steps: steps, groups: g, feature: f, sig: sig, band: band, clauseA: !!mA.clause, clauseB: !!mB.clause };
  };
  var STORYW = { up: 'rise', down: 'fall', flat: 'flat', low: 'stays very low', peak: 'peak then fall', trough: 'dip then recovery', fluct: 'up and down' };
  function sizeWhy(sig, s) {
    if (sig.type === 'pie') return fmt(round(Math.abs(s.delta), 1)) + ' percentage points';
    if (sig.type === 'table') return Math.round(Math.abs(s.rel) * 100) + '% of the first figure';
    return Math.round(s.share * 100) + '% of the scale';
  }
  /* The trend of a time phase. Phase B is worded from the turning point,
     so the big jump or drop between the phases is inside it. */
  function phaseMove(sig, ph, band) {
    var s = sig.series.filter(function (x) { return !x.residual; })[0], v = s.values, a = v[ph[0]], b = v[ph[1]];
    var d = b - a, deg = sizeOf(sig, s, a, b);
    var steady = steadyOf(v, ph[0], ph[1], 0.02 * sig.scale);
    var mn = Math.min.apply(null, v.slice(ph[0], ph[1] + 1)), mi = v.indexOf(mn, ph[0]);
    if (mi > ph[0] && mi < ph[1] && a - mn >= 0.1 * sig.scale && b - mn >= 0.1 * sig.scale) {
      var lowYrs = sig.x[mi - 1] !== undefined && v[mi - 1] <= 0.5 * a && mi - 1 > ph[0] ? sig.x[mi - 1] + ' and ' + sig.x[mi] : sig.x[mi];
      return band === 6 ? 'fell sharply and then recovered' : band === 7 ? 'collapsed in ' + lowYrs + ' before recovering strongly' : 'plunged in ' + lowYrs + ' before recovering strongly';
    }
    var o = { cls: Math.abs(d) < 0.03 * sig.scale ? 'flat' : d > 0 ? 'up' : 'down', deg: deg, steady: steady, first: a, visibleBase: false, growsFromLow: false, ratio: 1, range: Math.abs(d) / sig.scale, delta: d, last: b };
    return one(sig, o, band, true);
  }

  /* =========================================================== COMPILE
     The output: four paragraphs built from the 13 variables, plus a few
     extra signals for the middle sentences and the comparisons.
       P1  S1 visual + what + time frame (never the task's own time phrase)
       P2  S2 "Overall," trend A, contrast word, trend B · the key feature
       P3  group A: start figure (S3), the middle event (crossover, peak,
           low point), the end figure
       P4  group B the same way, then one S5/S6 comparison of the groups  */
  var SYN = { rose: 'climbed', increased: 'grew', fell: 'declined', decreased: 'dropped', declined: 'dropped', climbed: 'rose' };
  function timePhrase(p, y1, y2, band) {
    var sig = O.signals(p);
    if (p.type === 'pie') { var ys = sig.x.slice(0, sig.iEnd + 1); return 'in ' + list(ys.map(String)); }
    var fromTo = /\bbetween (18|19|20)\d\d and\b/i.test(p.rubric || '');
    if (band === 8) return 'over the period from ' + y1 + ' to ' + y2;
    return fromTo ? 'from ' + y1 + ' to ' + y2 : 'between ' + y1 + ' and ' + y2;
  }
  var P1VERB = { 6: ['shows', 'presents', 'gives information about'], 7: ['illustrates', 'compares', 'presents'], 8: ['charts', 'tracks', 'presents'] };
  function p1Verb(p, v, band) {
    var head = String(p.rubric || '').toLowerCase().split(/\s+/).slice(0, 6).join(' ');
    var list8 = /pie charts/.test(v.visual) ? (/breakdown/.test(v.what) ? ['give', 'compare'] : ['break down', 'compare']) : /table/.test(v.visual) ? ['sets out', 'compares'] : /bar/.test(v.visual) ? ['presents', 'compares'] : P1VERB[8];
    var opts = band === 8 ? list8 : P1VERB[band];
    if (/two|three/.test(v.visual)) opts = opts.map(function (w) { return w.replace(/^shows$/, 'show').replace(/^presents$/, 'present').replace(/^illustrates$/, 'illustrate').replace(/^compares$/, 'compare').replace(/^gives /, 'give ').replace(/^sets out$/, 'set out'); });
    for (var i = 0; i < opts.length; i++) if (head.indexOf(opts[i].split(' ')[0]) < 0) return opts[i];
    return opts[opts.length - 1];
  }
  O.compile = function (p, band, vars) {
    band = +band || 7;
    var D = O.derive(p, band), v = vars || D.vars, sig = D.sig, g = D.groups;
    sig.__ms = {};
    var single = g.rule === 'phases';
    var proj = sig.projectedFrom ? ', with projections to ' + sig.yLast : '';
    var P1 = 'The ' + v.visual + ' ' + p1Verb(p, v, band) + ' ' + v.what + (/,\s*(in (thousands|millions|per cent|percentage terms|US dollars)|measured in [^,]+|in micrograms[^,]*)$/.test(v.what) ? ',' : '') + ' ' + timePhrase(p, v.y1, v.y2, band) + proj + '.';
    var lead = band === 6 ? 'Also, ' : band === 7 ? 'It is also clear that ' : 'Notably, ';
    var subjA = single ? v.groupA : measure(p, v.groupA, g.A.length), subjB = single ? v.groupB : measure(p, v.groupB, g.B.length);
    var P2;
    if (D.clauseA) P2 = 'Overall, ' + v.moveA + '. ' + cap(subjB) + ', by contrast, ' + v.moveB + '.';
    else if (D.clauseB) P2 = 'Overall, ' + subjA + ' ' + v.moveA + '. By contrast, ' + v.moveB + '.';
    else P2 = 'Overall, ' + subjA + ' ' + v.moveA + (band === 6 ? ', while ' : ', whereas ') + subjB + ' ' + v.moveB + '.';
    P2 += ' ' + lead + v.feature + '.';
    var P3, P4, extras;
    if (single) { var ph = singlePara(sig, g, band, v); P3 = ph[0]; P4 = ph[1]; extras = ph[2]; }
    else {
      var pa = groupPara(sig, g.A, band, v, 'A', g), pb = groupPara(sig, g.B, band, v, 'B', g);
      P3 = pa.text; P4 = pb.text + residualSentence(sig, band) + ' ' + compareSentence(sig, g, band);
      extras = pa.extras.concat(pb.extras).sort(function (a, b) { return b.rank - a.rank; }).concat(extraSentences(sig, g, band, v));
      var hasAddOn = /, (which|when|overtaking|falling below) /.test(P3 + ' ' + P4);
      if (band === 8 && !hasAddOn) { var addOn = extras.filter(function (e) { return / which recorded /.test(e.text); })[0]; if (addOn) { extras.splice(extras.indexOf(addOn), 1); extras.unshift(addOn); addOn.must = true; } }
    }
    var paras = [P1, P2, P3, P4];
    var W = global.Writer;
    function count(ps) { var t = ps.map(tidy).join('\n\n'); return W ? W.words(t) : t.split(/\s+/).length; }
    for (var e = 0; e < extras.length && (count(paras) < 165 || extras[e].must); e++) {
      var trial = paras.slice(), ex = extras[e];
      var parts = sentencesOf(trial[ex.para]), at = -1;
      if (ex.anchor) for (var pi2 = 0; pi2 < parts.length; pi2++) if (parts[pi2].indexOf(ex.anchor) >= 0) { at = pi2; break; }
      if (ex.after != null && at < 0) at = Math.min(ex.after, parts.length - 1);
      if (ex.anchor && at < 0 && ex.after == null) continue;
      if (at >= 0) { parts.splice(ex.before ? at : at + 1, 0, ex.text); trial[ex.para] = parts.join(' '); } else trial[ex.para] += ' ' + ex.text;
      if (count(trial) <= 190 || (ex.must && count(trial) <= 200)) paras = trial;
    }
    /* over 190: take out the optional parts of P3–P4, smallest loss first */
    var NS = '(?:[^.]|\\.\\d)*';   /* "not a sentence end": a decimal point is not a full stop */
    var TRIM = [/, ending below (?:its|their) starting level/, /, (?:almost|about|more than|less than|roughly|around|little more than|a small fraction of)[^,.]*? (?:its|their) starting level/, / \([^)]*against[^)]*\)/, new RegExp(', a gap of ' + NS + '(?=\\.(?!\\d))'), /, close to (?:its|their) starting level/, new RegExp('(?:^|\\s)In \\d{4}, (?:it|they) (?:was|were) at ' + NS + '\\.(?!\\d)'), new RegExp('(?:^|\\s)This was a (?:rise|fall) of ' + NS + '\\.(?!\\d)'), new RegExp('(?:^|\\s)In \\d{4}, the figure for ' + NS + '\\.(?!\\d)'), new RegExp('(?:^|\\s)The gap between ' + NS + '\\.(?!\\d)')];
    for (var tr = 0; tr < TRIM.length && count(paras) > 190; tr++) {
      for (var guard = 0; guard < 6 && count(paras) > 190; guard++) {
        var hit = false;
        for (var pp = 3; pp >= 2 && !hit; pp--) if (TRIM[tr].test(paras[pp])) { paras[pp] = paras[pp].replace(TRIM[tr], ''); hit = true; }
        if (!hit) break;
      }
    }
    paras = paras.map(tidy);
    var text = paras.join('\n\n');
    return { paras: paras, text: text, words: count(paras), vars: v, derive: D };
  };
  function tidy(s) {
    s = String(s).replace(/\s+/g, ' ').replace(/\s+([,.])/g, '$1').replace(/\.\./g, '.').replace(/,,/g, ',').trim();
    return s.replace(/(^|[.!?]\s+)([a-z])/g, function (m, a, b) { return a + b.toUpperCase(); });
  }
  function second(word) {
    return String(word).replace(/^(both |all )?(\w+)/, function (m, pre, w) { return (pre || '') + (SYN[w] || w); });
  }
  function subjOf(p, s) { return cap(measure(p, s.name, 1)); }
  function startSentence(sig, ids, band, v, AB) {
    var p = sig.p, f1 = AB === 'A' ? v.figA1 : v.figB1, gName = measure(p, AB === 'A' ? v.groupA : v.groupB, ids.length);
    var pl = plSubj(p, AB === 'A' ? v.groupA : v.groupB, ids.length);
    if (/^0 /.test(f1)) f1 = 'zero';
    var open = AB === 'B' ? (band === 6 ? 'On the other hand, in ' : band === 7 ? 'By contrast, in ' : 'Meanwhile, in ') : 'In ';
    if (ids.length === 1 && band === 8 && AB === 'A') return cap(gName) + ' opened the period at ' + f1 + ' in ' + v.y1 + '.';
    return open + v.y1 + ', ' + gName + (band === 6 ? (pl ? ' were at ' : ' was at ') : ' stood at ') + f1 + '.';
  }
  /* A group paragraph: the start, then each line's move to its end figure.
     The middle events are extras, so the length control decides. */
  function groupPara(sig, ids, band, v, AB, g) {
    var S = sig.series, iEnd = sig.iEnd, out = [], extras = [], p = sig.p;
    var pi = AB === 'A' ? 2 : 3, flatSaid = 0;
    out.push(startSentence(sig, ids, band, v, AB));
    ids.forEach(function (i, k) {
      var s = S[i], endF = figure(sig, i, iEnd, band).text;
      var endCross = sig.crossovers.filter(function (c) { return !c.projected && c.k === iEnd && c.mover === s; })[0];
      var crossTail = endCross ? (endCross.mover === endCross.a ? ', overtaking ' + endCross.b.name : ', falling below ' + endCross.a.name) : '';
      var mid = midSentence(sig, s, band, ids.length === 1);
      var subj = k % 2 === 0 ? subjOf(p, s) : 'The figure for ' + s.name, pr = k % 2 === 0 ? plSubj(p, s.name, 1) : false, it = pr ? 'they' : 'it';
      if (ids.length === 1) {
        if (mid) out.push(mid.text.replace(/^It\b/, cap(it)).replace(/\bit (was|had|reached|recorded|became)\b/g, function (m0, w) { return it + ' ' + (pr && w === 'was' ? 'were' : w); }));
        if ((s.cls === 'flat' || s.cls === 'low') && band === 8 && s.first !== s.last) out.push(cap(it) + ' ' + (pr ? 'remained' : 'remained') + ' close to this level throughout, ending at ' + endF + ' in ' + v.y2 + '.');
        else if (s.cls === 'flat' || s.cls === 'low') out.push('In ' + v.y2 + ', ' + it + ' ' + (band === 7 ? 'stood' : pr ? 'were' : 'was') + ' ' + (s.first === s.last ? 'still at ' + endF : 'at ' + endF + (band === 6 ? '' : ', ' + (Math.abs(s.delta) / sig.scale < 0.05 ? 'close to ' + (pr ? 'their' : 'its') + ' starting level' : (s.delta > 0 ? 'slightly above' : 'slightly below') + ' where ' + it + ' began'))) + '.');
        else out.push('By ' + v.y2 + ', ' + it + ' had ' + (s.delta >= 0 ? 'reached ' : 'fallen to ') + endF + (band === 8 && !crossTail ? rel8(sig, s) : '') + crossTail + '.');
        return;
      }
      var mv = one(sig, s, band, true);
      var mvTxt = k === 0 ? mv : second(mv);
      sig.__ms = sig.__ms || {};
      var flatIds = ids.filter(function (j) { return S[j].cls === 'flat' || S[j].cls === 'low'; });
      if ((s.cls === 'flat' || s.cls === 'low') && flatIds.length >= 2) {
        if (flatIds[0] !== i) return;
        var fn = oxford(flatIds.map(function (j) { return S[j].name; }));
        out.push(cap(flatIds.length === ids.length ? (band === 6 ? 'they' : flatIds.length === 2 ? 'both of them' : 'all of them') : measure(p, fn, flatIds.length)) + ' ' + (band === 8 ? 'both ' : '') + one(sig, s, band, true) + ', at ' + figsFor(sig, flatIds, iEnd, band) + ' in ' + v.y2 + '.');
        out[out.length - 1] = out[out.length - 1].replace(/^(All|Both) of them both /, '$1 of them ').replace(/^They both /, 'They ');
        flatSaid++;
      }
      else if (s.cls === 'flat' || s.cls === 'low') { out.push(subj + ' ' + (flatSaid ? (band === 6 ? 'also stayed about the same' : 'also changed little') : mvTxt) + ', ' + (band === 6 ? 'ending at ' : 'finishing at ') + endF + ' in ' + v.y2 + '.'); flatSaid++; }
      else if (/peak|low in|dipped|fluctuat|then|recover|up and down|very low level/.test(mvTxt)) out.push(subj + ' ' + mvTxt + (/\bend/.test(mvTxt) ? ', finishing at ' : ', ending at ') + endF + ' in ' + v.y2 + crossTail + '.');
      else out.push(subj + ' ' + mvTxt + ' to ' + endF + ' in ' + v.y2 + (band === 8 && !crossTail ? rel8(sig, s) : '') + crossTail + '.');
      sig.__ms[i] = out[out.length - 1].slice(0, 40);
      if (mid) extras.push({ para: pi, anchor: out[out.length - 1].slice(0, 40), before: true, rank: mid.rank, text: mid.text.replace(/^It\b/, subj).replace(/^In (\d{4}), it\b/, 'In $1, ' + measure(p, s.name)).replace(/, it reached/, ', ' + (pr ? 'they' : 'it') + ' reached').replace(/\bit was overtaken\b/i, subj + ' ' + (pr ? 'were' : 'was') + ' overtaken') });
    });
    return { text: out.join(' '), extras: extras };
  }
  function rel8(sig, s) {
    if (!s.visibleBase || !(s.first > 0)) return '';
    var r = s.ratio, o = its(measure(sig.p, s.name)), t = s.delta > 0 ? timesOf(r) : shareOf(r);
    if (!t) return '';
    return ', ' + t + ' ' + o + ' starting level';
  }
  /* The middle event of one line: a crossover you can see, a peak, a low
     point, or (for a line alone in its group) the middle year. A crossover
     at the last point is said in the end sentence instead. */
  function midSentence(sig, s, band, alone) {
    var x = sig.x, iEnd = sig.iEnd, it = plSubj(sig.p, s.name, 1) ? 'they' : 'it', It = cap(it);
    var cr = sig.n > 2 ? sig.crossovers.filter(function (c) { return c.mover === s && !c.projected && c.k < iEnd; })[0] : null;
    if (cr) {
      var other = cr.mover === cr.a ? cr.b : cr.a, verb = cr.mover === cr.a ? 'overtook' : 'fell below';
      var f = figure(sig, s.i, cr.fig, band).text;
      var byWhen = /^between/.test(cr.when) ? ', and by ' + x[cr.fig] + ' ' + it + ' had ' + (cr.mover === cr.a ? 'reached ' : 'fallen to ') + f : ', when ' + it + ' ' + (cr.mover === cr.a ? 'reached ' : 'stood at ') + f;
      var oth = (it === 'they' ? 'those for ' : 'the figure for ') + other.name;
      if (band === 6) return { rank: 3, cross: true, text: It + ' ' + (cr.mover === cr.a ? 'rose above ' : 'fell below ') + oth + ' ' + cr.when + '.' };
      if (band === 7) return { rank: 3, cross: true, text: It + ' ' + verb + ' ' + oth + ' ' + cr.when + byWhen + '.' };
      return { rank: 3, cross: true, text: (cr.mover === cr.a ? 'Overtaking ' : 'Falling below ') + oth + ' ' + cr.when + ', ' + it + (/^between/.test(cr.when) ? ' had ' + (cr.mover === cr.a ? 'reached ' : 'fallen to ') + f + ' by ' + x[cr.fig] : ' ' + (cr.mover === cr.a ? 'reached ' : 'stood at ') + f + (cr.when.indexOf(String(x[cr.fig])) >= 0 ? '' : ' in ' + x[cr.fig])) + '.' };
    }
    if (s.cls === 'peak') return { rank: 2, text: (band === 8 ? It + ' peaked at ' : It + ' reached a high of ') + figure(sig, s.i, s.pk, band).text + ' in ' + x[s.pk] + '.' };
    if (s.cls === 'trough') return { rank: 2, text: (band === 8 ? It + ' dipped to ' : It + ' fell to a low of ') + figure(sig, s.i, s.tr, band).text + ' in ' + x[s.tr] + '.' };
    if (!alone) return null;
    var mid = Math.round(iEnd / 2);
    if (mid <= 0 || mid >= iEnd || s.first === s.last && s.cls === 'flat') return null;
    var f2 = figure(sig, s.i, mid, band).text;
    var wasAt = it === 'they' ? ' were at ' : ' was at ';
    if (s.cls === 'flat') return band === 6 ? { rank: 1, text: 'In ' + x[mid] + ', ' + it + wasAt + f2 + '.' } : null;
    return { rank: 1, text: band === 6 ? 'In ' + x[mid] + ', ' + it + wasAt + f2 + '.' : 'By ' + x[mid] + ', ' + it + ' had ' + (s.values[mid] > s.first ? 'climbed to ' : 'dropped to ') + f2 + '.' };
  }
  function residualSentence(sig, band) {
    if (!sig.residual || !sig.residual.length) return '';
    return sig.residual.map(function (s) {
      var a = figure(sig, s.i, 0, band).text, b = figure(sig, s.i, sig.iEnd, band).text;
      if (s.first === s.last) return ' ' + cap(measure(sig.p, s.name)) + ' ' + (band === 6 ? 'stayed at ' : 'remained unchanged at ') + b + '.';
      return ' ' + cap(measure(sig.p, s.name)) + ' ' + (s.delta > 0 ? (band === 6 ? 'rose' : 'increased') : (band === 6 ? 'fell' : 'decreased')) + ' from ' + a + ' to ' + b + '.';
    }).join('');
  }
  function compareSentence(sig, g, band) {
    var S = sig.series, iEnd = sig.iEnd, p = sig.p;
    var a = S[g.A[0]], b = S[g.B[0]];
    var fa = figure(sig, a.i, iEnd, band), fb = figure(sig, b.i, iEnd, band);
    var hiF = fa.read >= fb.read ? fa : fb, loF = hiF === fa ? fb : fa, hi = hiF === fa ? a : b, lo = hi === a ? b : a;
    var vh = hiF.read, vl = loF.read, ratio = vl > 0 ? vh / vl : Infinity;
    var nh = measure(p, hi.name), nl = lo.name;
    if (vh === vl) return 'In ' + sig.y2 + ', ' + nh + ' and ' + measure(p, lo.name) + ' were at about the same level, ' + hiF.text + '.';
    if (band === 6) return 'In ' + sig.y2 + ', ' + nh + ' ' + (plSubj(p, hi.name, 1) ? 'were' : 'was') + ' ' + (ratio >= 1.5 ? 'much ' : '') + 'higher than ' + (content(p).measure ? (plSubj(p, lo.name, 1) ? 'those ' : 'the figure ') + 'for ' : '') + nl + ', at ' + hiF.text + ' compared with ' + loF.text + '.';
    if (band === 7) return 'In ' + sig.y2 + ', the figure for ' + hi.name + ' was ' + (ratio >= 1.5 ? 'far ' : ratio < 1.15 ? 'slightly ' : '') + 'higher than that for ' + nl + ', at ' + hiF.text + ' and ' + loF.text + ' respectively.';
    var mult = ratio >= 1.4 ? timesOf(ratio) : '';
    if (mult) return 'By ' + sig.y2 + ', the figure for ' + hi.name + ' was ' + mult + ' that for ' + nl + ' (' + hiF.text + ' against ' + loF.text + ').';
    var gap = round(vh - vl, 2), unitGap = unitOf(p).pct ? fmt(gap) + ' percentage points' : figText(p, gap);
    return 'By ' + sig.y2 + ', the figure for ' + hi.name + ' was ahead of that for ' + nl + ', at ' + hiF.text + ' compared with ' + loF.text + ', a gap of ' + (hiF.exact && loF.exact ? '' : 'roughly ') + unitGap + '.';
  }
  /* Extra sentences for a multi-line chart, best first. */
  function extraSentences(sig, g, band, v) {
    var S = sig.series, x = sig.x, iEnd = sig.iEnd, out = [], p = sig.p;
    var mid = Math.round(iEnd / 2);
    var a0 = S[g.A[0]], b0 = S[g.B[0]];
    var fa0 = figure(sig, a0.i, 0, band), fb0 = figure(sig, b0.i, 0, band);
    /* P3: compare group A's first line with group B's at the start (S5), naming the line */
    if (fa0.text !== fb0.text) {
      var hiNow = fa0.read > fb0.read;
      out.push({ para: 2, after: 0, anchor: 'In ' + v.y1 + ', ', text: band === 8 ? 'At that point ' + (g.A.length > 1 ? measure(p, a0.name) + ' ' + (plSubj(p, a0.name, 1) ? 'were' : 'was') : (plSubj(p, a0.name, 1) ? 'they were' : 'it was')) + ' ' + (hiNow ? 'ahead of ' : 'behind ') + b0.name + ', which recorded ' + fb0.text + '.'
        : cap(measure(p, a0.name)) + ' ' + (plSubj(p, a0.name, 1) ? 'were' : 'was') + ' ' + (hiNow ? (band === 6 ? 'higher than' : 'above') : (band === 6 ? 'lower than' : 'below')) + ' the figure for ' + b0.name + ', which was ' + fb0.text + '.' });
    }
    if (band >= 7 && sig.lowest && v.feature.indexOf(sig.lowest.name) < 0) out.push({ para: 1, text: cap(sig.lowest.name) + ' ' + was(sig.lowest.name) + ' the lowest throughout.' });
    if (band >= 7 && sig.leader && v.feature.indexOf(sig.leader.name) < 0) out.push({ para: 1, text: cap(sig.leader.name) + ' had the highest figure throughout.' });
    if (band === 6) {
      var c = sig.crossovers.filter(function (c) { return !c.projected; }).sort(function (a, b) { return (b.a === sig.endLeader ? 2 : 0) + b.gap / sig.scale - (a.a === sig.endLeader ? 2 : 0) - a.gap / sig.scale; })[0];
      if (c && !/overt|fell below|became/.test(v.feature)) out.push({ para: 1, text: cap(c.mover.name) + (c.mover === c.a ? ' had a higher figure than ' + c.b.name : ' had a lower figure than ' + c.a.name) + ' ' + c.when + '.' });
    }
    /* the size of each change, with "by" (percentage points on a % chart) */
    if (sig.n <= 3) [g.A, g.B].forEach(function (ids, gi) {
      ids.forEach(function (i) {
        var s = S[i]; if (s.cls === 'flat') return;
        var f0 = figure(sig, i, 0, band), f1 = figure(sig, i, iEnd, band); if (f0.below || f1.below) return;
        var dd = Math.abs(f1.read - f0.read), unit = (f0.exact && f1.exact ? '' : 'about ') + (sig.unit.pct ? fmt(round(dd, 2)) + ' percentage points' : figText(p, round(dd, 2)));
        var anc = (sig.__ms || {})[i] || (ids.length === 1 ? 'By ' + v.y2 : null); if (!anc) return;
        out.push({ para: 2 + gi, anchor: anc, text: 'This was a ' + (s.delta > 0 ? 'rise' : 'fall') + ' of ' + unit + '.' });
      });
    });
    [g.A, g.B].forEach(function (ids, gi) {
      ids.forEach(function (i) {
        if (mid <= 0 || mid >= iEnd || sig.n <= 2 || ids.length < 2 || !(sig.__ms || {})[i]) return;
        var s = S[i]; if (s.cls === 'flat' && s.first === s.last) return;
        out.push({ para: 2 + gi, anchor: sig.__ms[i], before: true, text: 'In ' + x[mid] + ', the figure for ' + s.name + ' was ' + figure(sig, i, mid, band).text + '.' });
      });
    });
    [g.A, g.B].forEach(function (ids, gi) {
      if (ids.length !== 1 || sig.n <= 2) return;
      var s = S[ids[0]], bs = s.bigStep; if (!bs.d || s.cls === 'flat') return;
      var f0 = figure(sig, s.i, bs.at - 1, band), f1 = figure(sig, s.i, bs.at, band);
      var dd = Math.abs(f1.read - f0.read); if (!dd || f0.below || f1.below) return;
      out.push({ para: 2 + gi, anchor: 'By ' + v.y2, before: true, text: 'The biggest change came between ' + x[bs.at - 1] + ' and ' + x[bs.at] + ', when ' + (plSubj(p, s.name, 1) ? 'they ' : 'it ') + (bs.d > 0 ? 'rose' : 'fell') + ' by ' + (f0.exact && f1.exact ? '' : 'about ') + (sig.unit.pct ? fmt(round(dd, 2)) + ' percentage points' : figText(p, round(dd, 2))) + '.' });
    });
    var crossed = sig.crossovers.some(function (c) { return (c.a === a0 && c.b === b0) || (c.a === b0 && c.b === a0); });
    var ea = a0.values[iEnd], eb = b0.values[iEnd];
    if (!crossed && ea && eb && Math.abs(Math.abs(ea - eb) - Math.abs(a0.values[0] - b0.values[0])) > 0.1 * sig.scale) out.push({ para: 3, text: 'The gap between ' + a0.name + ' and ' + b0.name + ' ' + (Math.abs(ea - eb) > Math.abs(a0.values[0] - b0.values[0]) ? 'widened' : 'narrowed') + ' over the period.' });
    return out;
  }
  /* One line: two time phases. The program selects: the start, the turning
     point, the end and one comparison; analytic sentences (every year, the
     biggest step, the change "by") are extras; single points come last. */
  function singlePara(sig, g, band, v) {
    var s = sig.series[g.A[0]], x = sig.x, A = g.phase.A, B = g.phase.B, val = s.values, si = s.i;
    var F = function (i) { return figure(sig, si, i, band).text; };
    var subj = content(sig.p).subject || s.name, pl = isPl(subj) || /s$/.test(subj), they = pl ? 'they' : 'it', They = cap(they);
    var P3 = [], P4 = [], extras = [];
    P3.push(band === 8 ? cap(subj) + ' stood at ' + F(A[0]) + ' in ' + x[A[0]] + '.' : 'In ' + x[A[0]] + ', ' + subj + (band === 6 ? (pl ? ' were at ' : ' was at ') : ' stood at ') + F(A[0]) + '.');
    var NW = ['no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'];
    var yrs = x[A[1]] - x[A[0]];
    P3.push('Between ' + x[A[0]] + ' and ' + x[A[1]] + ', ' + subj + ' ' + phaseMove(sig, A, band) + ', reaching ' + F(A[1]) + '.');
    var stA = val[A[0]], enA = val[A[1]], rA = stA > 0 ? enA / stA : 1;
    var cmpA = rA >= 1.4 ? timesOf(rA) + ' the ' + x[A[0]] + ' figure' : rA >= 1.25 ? 'well above the ' + x[A[0]] + ' figure' : rA > 1.04 ? 'slightly above the ' + x[A[0]] + ' figure' : rA >= 0.96 ? 'close to the ' + x[A[0]] + ' figure' : rA > 0.8 ? 'slightly below the ' + x[A[0]] + ' figure' : 'well below the ' + x[A[0]] + ' figure';
    P3.push(band === 6 ? 'This was ' + (enA > stA ? 'higher' : enA < stA ? 'lower' : 'the same as') + (enA === stA ? ' in ' : ' than in ') + x[A[0]] + '.' : 'This was ' + cmpA + '.');
    var turnFall = val[B[0]] < val[A[1]];
    var lowI = -1, mn = Infinity; for (var i = B[0]; i <= B[1]; i++) if (val[i] < mn) { mn = val[i]; lowI = i; }
    P4.push((band === 6 ? 'In ' + x[B[0]] + ', the figure ' : band === 7 ? 'In ' + x[B[0]] + ', however, the figure ' : 'This pattern changed in ' + x[B[0]] + ', when the figure ') + (turnFall ? (band === 6 ? 'fell to ' : 'dropped to ') : (band === 6 ? 'rose to ' : 'jumped to ')) + F(B[0]) + '.');
    var said = {}; said[A[0]] = said[A[1]] = said[B[0]] = said[B[1]] = 1;
    if (lowI > B[0] && lowI < B[1]) { P4.push(band === 8 ? 'Having hit a low of ' + F(lowI) + ' in ' + x[lowI] + ', ' + subj + ' recovered strongly.' : 'The lowest point was ' + F(lowI) + ' in ' + x[lowI] + ', after which ' + subj + ' recovered.'); said[lowI] = 1; }
    P4.push((band === 6 ? 'In ' + x[B[1]] + ', the figure was ' : 'By ' + x[B[1]] + ', the figure had ' + (val[B[1]] >= val[B[0]] ? 'reached ' : 'fallen to ')) + F(B[1]) + '.');
    P4.push(endCompare(sig, A, B, band));
    /* extras: analytic first */
    var unitN = function (d) { return figText(sig.p, round(Math.abs(d), 2)); };
    var afterSaid = false, dA = enA - stA, dTot = val[B[1]] - val[A[1]];
    if (Math.abs(dA) > 0 && Math.abs(dTot) > 0 && !(lowI > B[0] && lowI < B[1])) {
      var vT = dTot > 0 ? 'rose' : 'fell', nA = dA > 0 ? 'a rise' : 'a fall', tm = timesOf(Math.abs(dTot) / Math.abs(dA));
      var afterSaid = true; extras.push({ para: 3, text: 'After ' + x[A[1]] + ', the figure ' + vT + ' by ' + unitN(dTot) + (band === 6 || !tm ? ', compared with ' + nA + ' of ' + unitN(dA) + ' before that.' : ', ' + tm + ' the size of the earlier ' + (dA > 0 ? 'rise' : 'fall') + ' (' + unitN(dA) + ').') });
    }
    if (s.monotone) extras.push({ para: 1, text: band === 6 ? cap(subj) + ' ' + (s.delta > 0 ? 'rose' : 'fell') + ' every year.' : band === 7 ? cap(subj) + ' ' + (s.delta > 0 ? 'grew' : 'fell') + ' in every single year.' : 'The ' + (s.delta > 0 ? 'growth' : 'decline') + ' was continuous, with ' + (s.delta > 0 ? 'a rise' : 'a fall') + ' in every year.' });
    var bs = s.bigStep, b0 = bs.at - 1, b1 = bs.at;
    extras.push({ para: b1 <= A[1] ? 2 : 3, anchor: b1 <= A[1] ? 'This was' : null, text: 'The largest ' + (band === 8 ? 'single ' : '') + (bs.d > 0 ? 'increase' : 'fall') + ' came between ' + x[b0] + ' and ' + x[b1] + ', when the figure ' + (bs.d > 0 ? 'rose' : 'fell') + ' by ' + unitN(bs.d) + '.' });
    extras.push({ para: 2, anchor: 'This was', text: 'Over this first phase, the figure ' + (enA >= stA ? 'rose' : 'fell') + ' by ' + unitN(enA - stA) + ' in total.' });
    var dB = val[B[1]] - val[B[0]], turn = val[B[0]] - val[A[1]], sameWay = (dB > 0) === (enA - stA > 0) && (turn > 0) === (dB > 0);
    var dAll = val[B[1]] - val[A[0]];
    if (afterSaid && Math.abs(dAll) > 0) extras.push({ para: 3, text: 'Across the whole period, the figure ' + (dAll > 0 ? 'rose' : 'fell') + ' by ' + unitN(dAll) + ' in total.' });
    if (!afterSaid) extras.push({ para: 3, text: 'Between ' + x[B[0]] + ' and ' + x[B[1]] + ', the figure ' + (dB >= 0 ? 'rose' : 'fell') + ' by ' + unitN(dB) + '.' });
    /* single points, in order, last of all */
    [[0, A[1], 'Between ' + x[A[0]] + ' and'], [B[0], B[1], (band === 6 ? 'In ' : 'By ') + x[B[1]]]].forEach(function (rg, pi) {
      var js = []; for (var j = rg[0]; j <= rg[1]; j++) if (!said[j]) js.push(j);
      if (!js.length) return;
      var t = js.length === 1 ? 'The figure for ' + x[js[0]] + ' was ' + F(js[0]) + '.' : 'The figures for ' + list(js.map(function (j) { return String(x[j]); })) + ' were ' + list(js.map(F)) + ' respectively.';
      extras.push({ para: 2 + pi, anchor: rg[2], before: true, text: t });
    });
    return [P3.join(' '), P4.filter(Boolean).join(' '), extras];
  }
  function endCompare(sig, A, B, band) {
    var s = sig.series.filter(function (x) { return !x.residual; })[0], x = sig.x, e = s.values[B[1]], pk = s.max, st = s.values[A[0]], pkX = x[s.pk];
    if (s.pk > 0 && s.pk < sig.iEnd && pk > e) {
      if (band === 6) return 'This was lower than the figure for ' + pkX + '.';
      if (band === 7) return 'This was ' + (e >= 0.85 * pk ? 'only slightly' : 'well') + ' below the ' + pkX + ' peak of ' + figText(sig.p, pk) + '.';
      var sh = shareOf(e / pk);
      return e >= 0.85 * pk ? 'This left the total only ' + figText(sig.p, round(pk - e, 1)) + ' short of the ' + pkX + ' peak.' : 'This was ' + (sh ? sh + ' the ' + pkX + ' peak' : 'well below the ' + pkX + ' peak') + '.';
    }
    if (st > 0) {
      var r = e / st, times = timesOf(r);
      if (band === 6) return 'This was much ' + (e > st ? 'higher' : 'lower') + ' than in ' + x[A[0]] + '.';
      if (times && e > st) return 'This was ' + times + ' the ' + x[A[0]] + ' figure.';
      var sh2 = e < st ? shareOf(r) : '';
      return 'This was ' + (sh2 ? sh2 + ' the ' + x[A[0]] + ' figure' : (e > st ? 'well above' : 'well below') + ' the ' + x[A[0]] + ' figure') + '.';
    }
    return '';
  }

  /* ========================================================= EXERCISE
     The steps a student works through, one variable at a time:
       ASK    the question (the card title)
       LOOK   where on the chart (lookAt: type · task · xaxis · yaxis ·
              legend · lines) — the app lights that part of the chart
       THINK  a decision step (multiple choice at every guidance level
              except Exam): which signal fires, which rule applies
       WRITE  the value: multiple choice at High, typed at Medium, Low
              and Exam (checked by rule)
     Every wrong option carries exactly one planned error and a hint that
     names the kind of error without giving the answer.               */
  var STORY = {
    up2: 'Rise · big', up1: 'Rise · small', down2: 'Fall · big', down1: 'Fall · small', up: 'Rise · one line faster than the other(s)', down: 'Fall · one line steeper than the other(s)', flat: 'Flat (barely moves)', low: 'Stays very low',
    peak: 'Rise, then fall (a peak)', trough: 'Fall, then recovery (a dip)', fluct: 'Up and down (fluctuates)', mixed: 'Mixed: the lines move in different ways'
  };
  function storyOf(sig, ids) {
    var S = ids.map(function (i) { return sig.series[i]; });
    function one1(s) { return s.cls === 'up' || s.cls === 'down' ? s.cls + (s.deg >= 2 ? '2' : '1') : s.cls; }
    var k = S.map(one1);
    if (k.every(function (x) { return x === k[0]; })) return k[0];
    var base = S.map(function (s) { return s.cls; });
    if (base.every(function (x) { return x === base[0]; }) && (base[0] === 'up' || base[0] === 'down')) {
      var dg = S.map(function (s) { return s.deg; }), lo = Math.min.apply(null, dg), hi = Math.max.apply(null, dg);
      return hi > lo ? base[0] : base[0] + (lo >= 2 ? '2' : '1');   /* same rule as groupMove: one size, or "one faster" */
    }
    return 'mixed';
  }
  function storyHint(sig, ids, key, right) {
    var S = ids.map(function (i) { return sig.series[i]; }), nm = list(S.map(function (s) { return s.name; }));
    if (right && /^(up|down)/.test(key) && key.slice(0, 2) === String(right).slice(0, 2)) return 'Right direction, wrong size: is the change more or less than about a sixth of the side axis (or a quarter of the starting figure)?';
    if (/^up/.test(key)) return 'Compare the first and the last point of ' + nm + ': is the end really higher?';
    if (/^down/.test(key)) return 'Compare the first and the last point of ' + nm + ': is the end really lower?';
    if (key === 'flat') return 'Does ' + nm + ' move by less than a tenth of the highest value on the chart, and by less than a fifth of its own start?';
    if (key === 'low') return 'Where does ' + nm + ' sit: near the bottom of the chart the whole time?';
    if (key === 'peak') return 'Is there a high point in the middle, with the line lower at both ends?';
    if (key === 'trough') return 'Is there a low point in the middle, with the line higher at both ends?';
    if (key === 'fluct') return 'Count the turns: does the line change direction three times or more?';
    return 'Do all these lines move the same way?';
  }
  function swapNum(t) {
    var N = ['two', 'three', 'four', 'five', 'six'];
    for (var i = 0; i < N.length; i++) { var re = new RegExp('\\b' + N[i] + '\\b'); if (re.test(t)) return t.replace(re, N[(i + 1) % N.length]); }
    return '';
  }
  function dropUnit(t) {
    var r = t.replace(/,\s*(?:in|measured in)\s+(?:millions? of |thousands? of )?[a-zA-Z$% ]+?(?:,|$)/, function (m) { return /,$/.test(m) ? ' ' : ''; }).replace(/\s+/g, ' ').trim();
    r = r.replace(/\s*\((?:in )?[^)]*\)/, '');
    return r !== t ? r : '';
  }
  function wrongUnit(t, p) {
    var u = unitOf(p);
    if (/thousands?/.test(t)) return t.replace(/thousands?/, 'millions');
    if (/millions?/.test(t)) return t.replace(/millions?/, 'thousands');
    if (/per cent|percentage|proportion|share/.test(t)) return t.replace(/per cent|percentage terms/, 'thousands').replace(/^the (percentage|proportion|share)/, 'the number');
    if (u.money) return t.replace(/US dollars|dollars/, 'baht');
    return '';
  }
  function copiedWhat(p) {
    return String(p.rubric || '').replace(/^the\s+[\w\s,-]*?\b(shows?|illustrates?|compares?|gives?|presents?)\s+/i, '').replace(/\.$/, '')
      .replace(/,? with projections.*$/i, '').replace(/\s+(between|from)\s+(18|19|20)\d\d\s+(and|to)\s+(18|19|20)\d\d.*$/i, '').replace(/\s+(in|each year between)\s+(18|19|20)\d\d(,\s*(18|19|20)\d\d)*(,?\s+and\s+(in\s+)?(18|19|20)\d\d)?.*$/i, '');
  }
  var FLIP = [[/\brose\b/, 'fell'], [/\bfell\b/, 'rose'], [/\bincreased\b/, 'decreased'], [/\bdecreased\b/, 'increased'], [/\bclimbed\b/, 'dropped'], [/\bdropped\b/, 'climbed'], [/\bgrew\b/, 'shrank'], [/\bdeclined\b/, 'rose'], [/\bedged up\b/, 'slipped'], [/\bslipped\b/, 'edged up'], [/\bsurged\b/, 'plunged'], [/\bstayed about the same\b/, 'rose sharply'], [/\bremained broadly stable\b/, 'rose dramatically'], [/\bremained virtually unchanged\b/, 'fell steeply'], [/\bsaw little change\b/, 'rose steeply'], [/\bpeaked\b/, 'hit a low'], [/\bdipped to a low\b/, 'peaked'], [/\bfell to a low\b/, 'rose to a peak'], [/\brose to a peak\b/, 'fell to a low']];
  function flipMove(t) { for (var i = 0; i < FLIP.length; i++) if (FLIP[i][0].test(t)) return t.replace(FLIP[i][0], FLIP[i][1]); return ''; }
  function degreeSwap(t) {
    var D = [[/\bsharply\b/, 'slightly'], [/\bdramatically\b/, 'slightly'], [/\bsteeply\b/, 'slightly'], [/\bslightly\b/, 'dramatically'], [/\bgradually\b/, 'dramatically'], [/\bsteadily\b/, 'slightly'], [/\bconsiderably\b/, 'marginally']];
    for (var i = 0; i < D.length; i++) if (D[i][0].test(t)) return t.replace(D[i][0], D[i][1]);
    return '';
  }
  function presentMove(t) {
    var r = t.replace(/\brose\b/, 'rises').replace(/\bfell\b/, 'falls').replace(/\bincreased\b/, 'increases').replace(/\bdecreased\b/, 'decreases').replace(/\bclimbed\b/, 'climbs').replace(/\bdeclined\b/, 'declines').replace(/\bstayed\b/, 'stays').replace(/\bremained\b/, 'remains').replace(/\bgrew\b/, 'grows').replace(/\bpeaked\b/, 'peaks').replace(/\bfluctuated\b/, 'fluctuates').replace(/\bdropped\b/, 'drops').replace(/\bdipped\b/, 'dips').replace(/\bsurged\b/, 'surges').replace(/\bslipped\b/, 'slips').replace(/\bedged\b/, 'edges').replace(/\bsaw\b/, 'sees').replace(/\bwent\b/, 'goes').replace(/\bmoved\b/, 'move').replace(/\bchanged\b/, 'change').replace(/\bunderwent\b/, 'undergo');
    return r !== t ? r : '';
  }
  function uniq(ok, cands) {
    var seen = {}; seen[String(ok).toLowerCase()] = 1;
    return cands.filter(function (c) { if (!c || !c[0]) return false; var k = String(c[0]).toLowerCase(); if (seen[k]) return false; seen[k] = 1; return true; });
  }
  O.exercise = function (p, band) {
    band = +band || 7;
    var D = O.derive(p, band), v = D.vars, sig = D.sig, g = D.groups, S = sig.series, x = sig.x, steps = [];
    var single = g.rule === 'phases';
    var other = [6, 7, 8].filter(function (b) { return b !== band; }).map(function (b) { return O.derive(p, b); });
    function bandTrue(key, b) { return 'True, but that is the Band ' + b + ' wording. Band ' + band + ': ' + O.BAND_INFO[band].note; }
    function otherBand(key) { var out = []; other.forEach(function (o) { if (o.band < band && o.vars[key] !== v[key]) out.push([o.vars[key], bandTrue(key, o.band)]); }); return out; }
    function add(st) { st.band = band; steps.push(st); }
    var LOOK = {}; D.steps.forEach(function (s) { LOOK[s.key] = s; });
    function base(key, kind) { var d = LOOK[key]; return { var: key, kind: kind, label: d.label, para: d.para, gate: d.gate, lookAt: d.lookAt, look: d.look, think: d.think, signal: d.signal, value: v[key] }; }

    /* 1 visual */
    var vis = ['line graph', 'bar chart', 'table', 'two pie charts', 'pie chart', 'process diagram', 'map'];
    var vHint = { 'line graph': 'Lines join points across the chart. Is that what you see?', 'bar chart': 'Bars are rectangles standing on an axis. Is that what you see?', 'table': 'A table has rows and columns of numbers and no axes.', 'two pie charts': 'Count the circles: how many pies are there?', 'pie chart': 'Count the circles: one pie or more than one? Two or more are named in the plural.', 'process diagram': 'A process diagram has stages joined by arrows.', 'map': 'A map shows places from above.', 'three pie charts': 'Count the circles.' };
    var vw = uniq(v.visual, vis.filter(function (t) { return t !== v.visual; }).sort(function (a, b) { return (/pie/.test(v.visual) && /pie/.test(a) ? -1 : 0) - (/pie/.test(v.visual) && /pie/.test(b) ? -1 : 0); }).map(function (t) { return [t, vHint[t]]; })).slice(0, 3);
    add(ext(base('visual', 'write'), { id: 'visual', ask: 'What kind of visual is it?', ok: v.visual, wrong: vw, shape: 'two or three words', tag: 'kn-triage-mode' }));

    /* 2 what */
    var wc = [];
    var cp = copiedWhat(p); if (cp && cp !== v.what) wc.push([cp, 'Eight or more words in a row are copied from the task sentence: copied words are not counted. Change the noun phrase.']);
    var du = dropUnit(v.what); if (du) wc.push([du, 'Which unit does the side axis (or the task sentence) give? The reader needs it to read your figures.']);
    var sn = swapNum(v.what); if (sn) wc.push([sn, 'Count the lines, bars, rows or slices in the legend again.']);
    var wu = wrongUnit(v.what, p); if (wu) wc.push([wu, 'Check the unit on the side axis or in the task sentence again.']);
    otherBand('what').forEach(function (w) { wc.push(w); });
    wc.push([v.what + ' ' + (/between/.test(p.rubric) ? 'from ' + v.y1 + ' to ' : 'between ' + v.y1 + ' and ') + v.y2, 'The years belong in the time phrase after this slot, not inside it.']);
    add(ext(base('what', 'write'), { id: 'what', ask: 'Rule P at Band ' + band + ': which [What It Shows] is right?', ok: v.what, wrong: uniq(v.what, wc).slice(0, 3), shape: 'a noun phrase with the unit, in new words', tag: 'lr-copied-rubric' }));

    /* 3–4 years */
    var yHint = function (y) { return x.indexOf(+y) < 0 ? y + ' is not on the bottom axis.' : +y > (sig.projectedFrom || 99999) ? y + ' is a projection (the dotted part): projections go in the overview, not in the time frame.' : 'Read the very first and the very last label on the bottom axis.'; };
    var gap = x[1] - x[0];
    var yw1 = uniq(v.y1, [String(x[1]), String(sig.yLast), String(sig.y1 - gap), String(sig.y1 - 2 * gap)].map(function (y) { return [y, yHint(y)]; })).slice(0, 3);
    add(ext(base('y1', 'write'), { id: 'y1', ask: 'What is the first year?', ok: v.y1, wrong: yw1, shape: 'a year', tag: 'kn-triage-units' }));
    var yw2 = uniq(v.y2, [String(sig.yLast), String(x[Math.max(0, sig.iEnd - 1)]), String(sig.y1), String(sig.y2 + gap), String(sig.y2 + 2 * gap)].map(function (y) { return [y, y === String(sig.y1) ? 'That is the first year. Which label closes the time frame?' : yHint(y)]; })).slice(0, 3);
    add(ext(base('y2', 'write'), { id: 'y2', ask: sig.projectedFrom ? 'What is the last real year (before the projection)?' : 'What is the last year?', ok: v.y2, wrong: yw2, shape: 'a year', tag: 'kn-triage-units' }));

    /* 5 groups: think (which question) + write A + write B */
    var Qs = { Q1: 'Q1 · one line only → two time phases', Q2: 'Q2 · one group far above the other → high and low', Q3: 'Q3 · some lines flat or back where they began → the movers and the rest', Q4: 'Q4 · lines go opposite ways → up and down', Q5: 'Q5 · all the same way → the high and the low lines' };
    var NS = S.filter(function (s) { return !s.residual; });
    var truth = { Q1: NS.length === 1, Q2: g.q === 'Q2', Q3: NS.some(function (s) { return s.cls === 'flat' || s.cls === 'low'; }) && NS.length > 1, Q4: NS.some(function (s) { return s.delta > 0; }) && NS.some(function (s) { return s.delta < 0; }), Q5: true };
    var order = ['Q1', 'Q2', 'Q3', 'Q4', 'Q5'];
    var qWrong = order.filter(function (q) { return q !== g.q; }).map(function (q) {
      var earlier = order.indexOf(q) > order.indexOf(g.q);
      var h = truth[q] && earlier ? 'True for this chart, but an earlier question already said YES. The tree stops at the first YES.' :
        q === 'Q1' ? 'Count the lines, bars or rows in the legend: is there only one?' : q === 'Q2' ? 'Is one group at least one and a half times the other at every point, with each group telling one story?' :
          q === 'Q3' ? 'Does any line barely move (less than a tenth of the highest value on the chart), or end where it began?' : q === 'Q4' ? 'Does any line end lower than it started, while another ends higher?' : 'Ask the questions in order: which is the first YES?';
      return [Qs[q], h];
    });
    add(ext(base('groupA', 'think'), { id: 'groups-q', label: 'Grouping rule', ask: 'Ask the grouping questions in order. Which one is the first YES for this chart?', ok: Qs[g.q], wrong: qWrong.slice(0, 3), tag: 'cc-grouping', think: g.why }));
    var nm = function (ids) { return list(ids.map(function (i) { return S[i].name; })); };
    var gw = [];
    if (single) {
      var A = g.phase.A, B = g.phase.B, subj = content(p).subject || S[0].name;
      [A[1] - 1, A[1] + 1, Math.floor(sig.iEnd / 2) === A[1] ? A[1] + 2 : Math.floor(sig.iEnd / 2)].forEach(function (t) {
        if (t >= 1 && t < sig.iEnd && t !== A[1]) gw.push([subj + ' between ' + x[0] + ' and ' + x[t], 'Split where the story changes: ' + (S[0].steady ? 'where the pace of the change becomes different.' : 'just before the biggest jump or drop.')]);
      });
    } else {
      var curated = (p.groupings || []).map(function (gg) { return gg.slice().sort().join('|'); });
      var labelsOf = function (ids) { return ids.map(function (i) { return S[i].label; }).sort().join('|'); };
      var tryAdd = function (ids, hint) { if (!ids.length || ids.length === NS.length) return; if (curated.indexOf(labelsOf(ids)) >= 0) return; if (labelsOf(ids) === labelsOf(g.A)) return; gw.push([nm(ids), hint]); };
      var b0 = g.B[0], a0 = g.A[g.A.length - 1];
      tryAdd(g.A.concat([b0]), cap(S[b0].name) + ' does not tell the same story as the others in this group: check its ' + (S[b0].cls === 'flat' ? 'flat line' : 'direction') + '.');
      if (g.A.length > 1) tryAdd(g.A.filter(function (i) { return i !== a0; }), 'One line that belongs to this story is missing: check ' + S[a0].name + '.');
      if (g.A.length > 1) tryAdd(g.A.filter(function (i) { return i !== a0; }).concat([b0]), 'This mixes the two stories: one line is swapped.');
      tryAdd(g.B.slice(0, Math.max(1, g.B.length)), 'That is the second story. Group A is the side with the bigger change (the headline).');
      tryAdd([b0], 'This line belongs to the other story.');
      tryAdd(NS.map(function (s) { return s.i; }).filter(function (i) { return g.A.indexOf(i) < 0 || i === g.A[0]; }).slice(0, Math.max(1, g.A.length)), 'Check the rule again: which lines share the story of the first one?');
    }
    if (!single) {
      if (NS.length === 2) gw.push([nm(g.B), 'That is group B. Group A is the line with the bigger change: the headline.']);
      gw.push([nm(NS.map(function (s) { return s.i; })), 'Two groups make the contrast: if every line is in group A, there is nothing to compare.']);
      gw.push([cap(content(p).subject || 'the figures') + ' between ' + x[0] + ' and ' + x[Math.floor(sig.iEnd / 2)], 'Time phases are only for a chart with one line. Group the lines by their story.']);
    } else gw.push([v.groupA.replace(/between (\d{4}) and (\d{4})$/, 'between ' + x[0] + ' and ' + x[sig.iEnd]), 'That is the whole period. Split it into two phases where the story changes.']);
    add(ext(base('groupA', 'write'), { id: 'groupA', ask: 'Which ' + (single ? 'phase' : 'lines') + ' make group A?', ok: v.groupA, wrong: uniq(v.groupA, gw).slice(0, 3), shape: single ? 'the first time phase' : 'names from the legend', tag: 'cc-grouping' }));
    var gbw = [];
    if (single) gbw = uniq(v.groupB, gw.map(function (w) { return [w[0].replace(/between (\d{4}) and (\d{4})$/, function (m, a, b) { var i = x.indexOf(+b); return 'between ' + x[Math.min(i + 1, sig.iEnd)] + ' and ' + x[sig.iEnd]; }), 'Group B starts where group A ends and runs to the last real year.']; }));
    else {
      if (g.B.length > 1) gbw.push([nm(g.B.slice(0, -1)), 'Every category must be in one of the two groups: one is missing.']);
      gbw.push([nm(g.B.concat([g.A[0]])), cap(S[g.A[0]].name) + ' is already in group A.']);
      gbw.push([nm(g.A), 'That is group A again.']);
      if (sig.residual.length) gbw.push([nm(g.B.concat([sig.residual[0].i])), cap(sig.residual[0].name) + ' is a left-over category: it gets one sentence of its own, not a place in a group.']);
    }
    if (!single) { gbw.push([nm(NS.map(function (s) { return s.i; })), 'Every line in group B? Group A\'s lines cannot be in both groups.']); gbw.push(['the remaining figures', 'Name the lines: the examiner checks that every category appears.']); }
    else gbw.push(['the rest of the years', 'Name the phase with its first and last year.']);
    add(ext(base('groupB', 'write'), { id: 'groupB', ask: 'Which ' + (single ? 'phase' : 'lines') + ' make group B?', ok: v.groupB, wrong: uniq(v.groupB, gbw).slice(0, 3), shape: single ? 'the second time phase' : 'names from the legend', tag: 'cc-grouping' }));

    /* 6 moves: think (story) + write, for A then B */
    ['A', 'B'].forEach(function (AB) {
      var key = 'move' + AB, ids = g[AB];
      if (!single) {
        var st = storyOf(sig, ids);
        var cands = ['up2', 'up1', 'down2', 'down1', 'flat', 'peak', 'trough', 'fluct', 'mixed', 'low'].filter(function (k) { return k !== st; });
        var pick = st === 'up2' ? ['up1', 'down2', 'flat'] : st === 'up1' ? ['up2', 'down1', 'flat'] : st === 'down2' ? ['down1', 'up2', 'flat'] : st === 'down1' ? ['down2', 'up1', 'flat'] : st === 'flat' ? ['up1', 'down1', 'fluct'] : st === 'low' ? ['flat', 'up2', 'down1'] : st === 'peak' ? ['up2', 'trough', 'fluct'] : st === 'trough' ? ['down2', 'peak', 'fluct'] : st === 'fluct' ? ['flat', 'peak', 'up1'] : ['up2', 'down2', 'flat'];
        if (st === 'up' || st === 'down') pick = [st + '2', st + '1', st === 'up' ? 'down2' : 'up2'];
        add(ext(base(key, 'think'), { id: key + '-story', label: 'Story ' + AB, ask: 'Signals for group ' + AB + ' (' + (AB === 'A' ? v.groupA : v.groupB) + '): what is its story?', ok: STORY[st], wrong: pick.map(function (k) { return [STORY[k], k === st + '2' || k === st + '1' ? 'The lines move the same way, but not by the same amount: compare the size of each change.' : storyHint(sig, ids, k, st)]; }), tag: 'lr-trend-vocab' }));
      }
      var ok = v[key], mw = otherBand(key);
      var fl = flipMove(ok.replace(/,\s.*$/, '')); if (fl) mw.push([fl, 'Wrong direction: compare the first and the last point of this group.']);
      var dg = degreeSwap(ok); if (dg) mw.push([dg, 'Right direction, wrong size: how big is the change on the chart\'s scale?']);
      var pr = presentMove(ok); if (pr && sig.tense !== 'future') mw.push([pr, 'Tense: the years are finished, so the past simple.']);
      var s0 = S[ids[0]] || S[0], i0f = single ? g.phase[AB][0] : 0, i1f = single ? g.phase[AB][1] : sig.iEnd;
      mw.push([ok + ', from ' + figure(sig, s0.i, i0f, band).text + ' to ' + figure(sig, s0.i, i1f, band).text, 'No figures here: this phrase goes into the overview first.']);
      if (/rose|increas|climb|grew|surged|edged up/.test(ok)) mw.push(['remained stable', 'This group moves: compare its first and last point.']);
      else mw.push(['rose steadily', 'Check the direction of each line in the group, first point against last point.']);
      var gDelta = ids.reduce(function (a, i) { return a + (S[i] ? S[i].delta : 0); }, 0);
      if (!(gDelta < 0)) mw.push(['fell sharply', 'Compare the first and the last point: is the end really much lower?']);
      if (!(gDelta > 0)) mw.push(['rose sharply', 'Compare the first and the last point: is the end really much higher?']);
      add(ext(base(key, 'write'), { id: key, ask: 'Which trend phrase for group ' + AB + ' fits Band ' + band + '?', ok: ok, wrong: uniq(ok, mw).slice(0, 3), shape: 'a verb phrase in the past simple, no figures', tag: 'lr-trend-vocab' }));
    });

    /* 7 feature: think (priority) + write */
    var KIND = { cross: 'A crossover (one line passes another)', 'proj-cross': 'A projected crossover', proj: 'A projection', 'cross+proj': 'A crossover and a projection', leader: 'The line on top the whole time', end: 'The highest figure at the end', collapse: 'A collapse and recovery', low: 'The lowest point', peak: 'A peak', pace: 'A change of pace', biggest: 'The biggest change' };
    var have = { cross: sig.crossovers.some(function (c) { return !c.projected; }), 'proj-cross': sig.crossovers.some(function (c) { return c.projected; }), proj: !!sig.projectedFrom, leader: !!sig.leader, end: true, collapse: !!sig.collapse, peak: single && S[0].pk > 0 && S[0].pk < sig.iEnd, biggest: !single, pace: single };
    var fk = D.feature.kind, fWrong = [];
    Object.keys(KIND).forEach(function (k) {
      if (k === fk || k === 'cross+proj' || k === 'low') return;
      if (KIND[k] === KIND[fk]) return;
      var h = have[k] ? 'This chart has one, but Band ' + band + ' picks another feature first (' + (band === 6 ? 'the simplest true fact' : band === 7 ? 'projection · crossover · top line · biggest change' : 'the strongest feature, plus what follows from it') + ').' : 'Look again: is there one on this chart?';
      fWrong.push([KIND[k], h]);
    });
    fWrong.sort(function (a, b) { return (/This chart has/.test(b[1]) ? 1 : 0) - (/This chart has/.test(a[1]) ? 1 : 0); });
    add(ext(base('feature', 'think'), { id: 'feature-kind', label: 'Feature rule', ask: 'Which key feature does the Band ' + band + ' rule choose for this chart?', ok: KIND[fk], wrong: fWrong.slice(0, 3), tag: 'ta-overview-vague' }));
    var fw = otherBand('feature');
    var anyFig = single ? figure(sig, 0, S[0].pk > 0 ? S[0].pk : sig.iEnd, band).text : figure(sig, sig.endLeader.i, sig.iEnd, band).text;
    fw.push([v.feature + ', at ' + anyFig, 'No figures in the overview: they wait for the detail paragraphs.']);
    fw.push([v.feature + ' because people changed their habits', 'No reasons: a report says what the chart shows, never why.']);
    var cr0 = sig.crossovers[0];
    if (cr0 && v.feature.indexOf(cr0.a.name) >= 0 && v.feature.indexOf(cr0.b.name) >= 0) fw.push([v.feature.replace(cr0.a.name, '#A#').replace(cr0.b.name, cr0.a.name).replace('#A#', cr0.b.name), 'Check who passed whom: which line was higher at the start?']);
    else if (S.length > 1) { var lowS = S.slice().sort(function (a, b) { return a.values[sig.iEnd] - b.values[sig.iEnd]; })[0]; fw.push([lowS.name + ' had the highest figure in ' + sig.y2, 'Check the chart: which line ends on top?']); }
    fw.push(['the figures changed a lot over the period', 'Too vague: name what changed, and how.']);
    add(ext(base('feature', 'write'), { id: 'feature', ask: 'Which key feature sentence fits Band ' + band + '?', ok: v.feature, wrong: uniq(v.feature, fw).slice(0, 3), shape: 'a clause with names (and years if needed), no figures', tag: 'ta-overview-vague' }));

    /* 8 figures */
    ['figA1', 'figA2', 'figB1', 'figB2'].forEach(function (key) {
      var AB = key.charAt(3), end = key.charAt(4) === '2', ok = v[key], fwr = [];
      if (single) {
        var ph = g.phase[AB], i0 = end ? ph[1] : ph[0], alt = end ? ph[0] : ph[1];
        var yr = end || AB === 'B' ? ' in ' + x[i0] : '';
        fwr.push([figure(sig, 0, alt, band).text + (yr ? ' in ' + x[alt] : ''), 'That is the figure for ' + x[alt] + '. Which year does this slot want?']);
        fwr.push([fmt(S[0].values[i0]) + yr, 'Say the unit: ' + (unitOf(p).pct ? 'add the % sign.' : 'thousand, million…')]);
        var other2 = g.phase[AB === 'A' ? 'B' : 'A'];
        fwr.push([figure(sig, 0, other2[1], band).text + ' in ' + x[other2[1]], 'That figure belongs to the other phase.']);
      } else {
        var ids = g[AB], idx = end ? sig.iEnd : 0, alt2 = end ? 0 : sig.iEnd, yr2 = end ? ' in ' + sig.y2 : '';
        fwr.push([figsFor(sig, ids, alt2, band) + (end ? ' in ' + sig.y1 : ''), 'Those are the ' + (end ? 'first-year' : 'last-year') + ' figures. Which year does this slot want?']);
        if (ids.length > 1) fwr.push([figsFor(sig, ids.slice().reverse(), idx, band) + yr2, 'Same figures in the wrong order: "respectively" follows the order of the names in the group.']);
        var oth = g[AB === 'A' ? 'B' : 'A'];
        fwr.push([figsFor(sig, oth.slice(0, ids.length), idx, band) + yr2, 'Those figures belong to the other group.']);
        var bareF = ids.map(function (i) { return fmt(S[i].values[idx]); });
        if (!unitOf(p).money) fwr.push([list(bareF) + (ids.length > 1 ? ' respectively' : '') + yr2, 'Say the unit: ' + (unitOf(p).pct ? 'add the % sign.' : unitOf(p).mult > 1 ? '"thousand" or "million" (look at the side axis).' : 'what do the numbers count?')]);
        if (band === 8 && /just over/.test(ok)) fwr.push([ok.replace('just over', 'just under'), 'Check the side of the gridline: is the point above or below the mark?']);
      }
      var ch = single ? null : g[AB][0];
      var dlt = single ? Math.abs(S[0].values[g.phase[AB][1]] - S[0].values[g.phase[AB][0]]) : Math.abs(S[ch].delta);
      fwr.push(['a ' + (single ? 'change' : (S[single ? 0 : ch].delta >= 0 ? 'rise' : 'fall')) + ' of ' + figText(p, round(dlt, 2)), 'This slot wants a figure at one year, not the size of the change.']);
      if (unitOf(p).mult > 1 && unitOf(p).noun) fwr.push([ok.replace(/(\d),000\b/g, '$1').replace(/(\d) million/g, '$1'), 'Read the unit again: the side axis is in ' + (unitOf(p).mult === 1e3 ? 'thousands' : 'millions') + '.']);
      add(ext(base(key, 'write'), { id: key, ask: LOOK[key].ask + ' (Band ' + band + ' style)', ok: ok, wrong: uniq(ok, fwr).slice(0, 3), shape: 'a figure with its unit' + (end ? ' (and the year)' : ''), tag: 'ta-no-data' }));
    });
    return { steps: steps, derive: D };
  };

  /* Medium / Low / Exam: check a typed value by rule. */
  O.checkValue = function (p, band, key, value, vars) {
    var D = O.derive(p, band), sig = D.sig, g = D.groups, v = String(value || '').trim();
    var TDd = TD(), LAB = global.LabContent;
    if (!v) return { status: 'none', note: 'Empty.' };
    var def = null; if (LAB) LAB.MODES.TREND.vars.forEach(function (d) { if (d.key === key) def = d; });
    var names = function (t) { return TDd ? TDd.namesIn(t, TDd.index(p)).map(function (l) { return l.name; }).sort().join('|') : ''; };
    if (key === 'groupA' || key === 'groupB') {
      if (g.rule === 'phases') { var r0 = TDd.check(def, v, p, { vars: vars }); return r0.status === 'bad' ? r0 : { status: /\b(18|19|20)\d\d\b.*\b(18|19|20)\d\d\b/.test(v) ? 'ok' : 'near', note: 'A time phase needs a first and a last year.' }; }
      var want = g[key.charAt(5)].map(function (i) { return sig.series[i].label; }).sort().join('|');
      var cur = (p.groupings || []).map(function (gg) { return gg.slice().sort().join('|'); });
      var got = names(v);
      if (got === want || cur.indexOf(got) >= 0) return { status: 'ok', note: got === want ? 'The same group as the program.' : 'A grouping the teacher\'s key also accepts.' };
      if (!got) return { status: 'bad', note: 'Use the names on the chart.' };
      return { status: 'bad', note: 'These lines do not tell one story. Ask the grouping questions again (first YES wins).' };
    }
    if (key === 'moveA' || key === 'moveB') {
      var gv = vars && vars['group' + key.charAt(4)];
      var ids = g[key.charAt(4)];
      if (gv && g.rule !== 'phases') { var mine = TDd.namesIn(gv, TDd.index(p)).map(function (l) { return l.name; }); var ix = sig.series.filter(function (s) { return mine.indexOf(s.label) >= 0; }).map(function (s) { return s.i; }); if (ix.length) ids = ix; }
      if (g.rule === 'phases') { var bad = /\d/.test(v.replace(/\b(18|19|20)\d\d\b/g, '')) ? 'No figures here.' : ''; return bad ? { status: 'bad', note: bad } : TDd.check(def, v, p, { vars: vars }); }
      return O.checkMove(p, ids, v, band);
    }
    if (key === 'feature') {
      var r = TDd.check(def, v, p, { vars: vars });
      if (r.status === 'bad') return r;
      var ixx = TDd.index(p), nn = TDd.namesIn(v, ixx);
      if (!nn.length && g.rule !== 'phases') return { status: 'near', note: 'Name at least one line from the chart.' };
      if (/overt[ao]o?k|passed|overtaken/i.test(v) && nn.length >= 2) {
        var first = nn.slice().sort(function (a, b) { return v.toLowerCase().indexOf(a.name.toLowerCase().split(' ')[0]) - v.toLowerCase().indexOf(b.name.toLowerCase().split(' ')[0]); });
        var ok2 = sig.crossovers.some(function (c) { return c.a.label === first[0].name && c.b.label === first[1].name; });
        if (!ok2 && !/overtaken|by /i.test(v)) return { status: 'bad', note: 'Check who passed whom on the chart.' };
      }
      if (/highest|most|largest|top/i.test(v) && nn.length === 1 && sig.series.length > 1) {
        var who = nn[0].name, ok3 = (sig.leader && sig.leader.label === who) || sig.endLeader.label === who || (sig.startLeader && sig.startLeader.label === who);
        if (!ok3) return { status: 'bad', note: 'Check which line is on top.' };
      }
      return { status: 'ok', note: 'General, no figures, and true of the chart.' };
    }
    if (key === 'what') {
      var r2 = TDd.check(def, v, p, { vars: vars });
      var run = TDd.longestRun ? TDd.longestRun(v, p.rubric) : 0;
      if (typeof run === 'object') run = run.n || run.len || 0;
      if (run >= 8) return { status: 'bad', note: run + ' words in a row from the task sentence: change the noun phrase (Rule P).' };
      return r2;
    }
    return TDd.check(def, v, p, { vars: vars });
  };

  global.Orrery = O;
})(typeof window !== 'undefined' ? window : this);
