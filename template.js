/* ===========================================================================
   QUILLMOOR ACADEMY · THE OBSERVATORY (Chart Control, Task 1) — template.js
   "My Spellbook": a student's own Task 1 template, one page per mode
   (TREND · COMPARE · SEQUENCE · SPACE), built in the Spellbook Workshop
   (lab.js) and used here, in the Scriptorium (writer) and in the story.

   Template.mount(el, host)          My Spellbook view (four pages, fade
                                     levels guided / skeleton / exam, print)
   Template.framesFor(p, mode)       → { mode, name, pct, level, templateId,
                                         paragraphs:['text with {slot} tokens', …],
                                         slots:[{id,label,shape}] } | null
   Template.fill(frames, values)     → the report text (also accepts a frame
                                         string: fill('… {visual} …', values))
   Template.tokens(text) / tidy(text) / labels(mode)
   Template.load(studentId) / save(studentId, data)   the Workshop's local store
                                     (localStorage 'cc.lab.v1.<lower-case id>')
   Template.Data                     the rule-based data checker (offline, free):
     .index(prompt)                  cells, labels, years, tolerances
     .check(varDef, value, prompt, ctx) → { status:'ok'|'near'|'bad'|'none', note, … }
     .numbers(text, prompt)          figures found in a value
     .derive(prompt, mode)           an automatic population of every variable
                                     (used by the validator and the test drive)

   Plain ES5: this file runs on old school iPads.
   =========================================================================== */
(function (global) {
  'use strict';

  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function L() { return global.LabContent || null; }
  function C() { return global.CONTENT || {}; }

  /* ===================================================================
     DATA CHECKER
     Every bank prompt is data (prompts.js), so a variable filled for a
     chart can be checked against the chart by rule:
       figure  must match a value (exactly, or within half a gridline with
               an approximation word); "by" = a difference; percentage
               points vs per cent; thousands / millions units
       year    inside the chart's time range
       label   a category / stage / map feature (case, article and plural
               differences allowed)
       tense   by mode (TREND past → past simple, SEQUENCE → present simple,
               SPACE → past simple / present perfect, or future for a plan)
     =================================================================== */
  var Data = (function () {
    var WORDNUM = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16, seventeen: 17, eighteen: 18, nineteen: 19, twenty: 20 };
    var FRACTION = [
      { re: /\b(about |around |roughly |nearly |almost |just over |just under |over |under |more than |less than )?(a|one)[ -]half\b|\bhalf\b/i, v: 50 },
      { re: /\b(about |around |roughly |nearly |almost |just over |just under |over |under |more than |less than )?(a|one)[ -]third\b/i, v: 33.3 },
      { re: /\btwo[ -]thirds\b/i, v: 66.7 },
      { re: /\b(about |around |roughly |nearly |almost |just over |just under |over |under |more than |less than )?(a|one)[ -]quarter\b/i, v: 25 },
      { re: /\bthree[ -]quarters\b/i, v: 75 },
      { re: /\b(a|one)[ -]fifth\b/i, v: 20 },
      { re: /\b(a|one)[ -]tenth\b/i, v: 10 }
    ];
    /* Approximation words, and which side of the true value they allow. */
    var APPROX = [
      { re: /(just|slightly|a little) (over|above|more than)\s*$/i, side: 'over' },
      { re: /(just|slightly|a little) (under|below|less than)\s*$/i, side: 'under' },
      { re: /(well|far) (over|above|more than)\s*$/i, side: 'wellover' },
      { re: /(well|far) (under|below|less than)\s*$/i, side: 'wellunder' },
      { re: /(nearly|almost|close to|approaching)\s*$/i, side: 'under' },
      { re: /(over|above|more than|in excess of)\s*$/i, side: 'over' },
      { re: /(under|below|less than|fewer than)\s*$/i, side: 'under' },
      { re: /(about|around|approximately|roughly|some|an estimated|circa|approx\.?|just about)\s*$/i, side: 'any' }
    ];
    var MULT = { thousand: 1e3, k: 1e3, million: 1e6, m: 1e6, mn: 1e6, billion: 1e9, bn: 1e9 };

    function lower(s) { return String(s == null ? '' : s).toLowerCase(); }
    function normText(s) {
      return lower(s).replace(/[\u2018\u2019']/g, '').replace(/[\u2013\u2014\-\/]/g, ' ').replace(/&/g, ' and ')
        .replace(/[^a-z0-9%. ]+/g, ' ').replace(/\.(?!\d)/g, ' ').replace(/\s+/g, ' ').trim();
    }
    function singular(w) {
      if (w.length <= 3 || /(ss|us|is|ics)$/.test(w)) return w;
      if (/ies$/.test(w)) return w.slice(0, -3) + 'y';
      if (/(sses|shes|ches|xes|zes)$/.test(w)) return w.slice(0, -2);
      if (/men$/.test(w)) return w.slice(0, -3) + 'man';
      if (/s$/.test(w)) return w.slice(0, -1);
      return w;
    }
    var ARTICLE = { the: 1, a: 1, an: 1 };
    function keyWords(s) { return normText(s).split(' ').filter(function (w) { return w && !ARTICLE[w]; }).map(singular); }
    function baseName(name) { return String(name || '').replace(/\([^)]*\)/g, ' ').replace(/\s+/g, ' ').trim(); }
    function labelKey(name) { return keyWords(baseName(name)).join(' '); }
    function hasRun(hay, needle) {
      if (!needle.length) return false;
      for (var i = 0; i + needle.length <= hay.length; i++) {
        var ok = true;
        for (var j = 0; j < needle.length; j++) if (hay[i + j] !== needle[j]) { ok = false; break; }
        if (ok) return true;
      }
      return false;
    }
    function isYear(v) { var n = +v; return /^\d{4}$/.test(String(v).trim()) && n >= 1800 && n <= 2100; }
    function niceMax(m) {
      if (m <= 0) return 1;
      var p = Math.pow(10, Math.floor(Math.log(m) / Math.LN10)), f = m / p;
      var n = f <= 1 ? 1 : f <= 2 ? 2 : f <= 2.5 ? 2.5 : f <= 5 ? 5 : 10;
      return n * p;
    }
    function unitInfo(u) {
      u = lower(u);
      var mult = /\bbillion/.test(u) ? 1e9 : /\bmillion/.test(u) ? 1e6 : /\bthousand/.test(u) ? 1e3 : 1;
      return { mult: mult, pct: /%|per ?cent|percentage/.test(u), text: u };
    }
    function colUnit(head, fallback) {
      var m = String(head || '').match(/\(([^)]+)\)/), u = m ? m[1] : '';
      if (u === '$' || /dollar|us\$/i.test(u)) return { mult: 1, pct: false, text: 'dollars', money: true };
      if (u) return unitInfo(u);
      return fallback;
    }

    /* ------------------------------------------------------------ index */
    function index(p) {
      if (!p) return null;
      if (p.__labIndex) return p.__labIndex;
      var ix = { cells: [], labels: [], years: [], panels: [], stages: [], features: [], type: p.type, mode: p.mode, p: p, pct: false, parts: [] };
      var labelSeen = {};
      function addLabel(name, kind) {
        var k = labelKey(name);
        if (!k || isYear(name) || labelSeen[k + '|' + kind]) return;
        labelSeen[k + '|' + kind] = 1;
        ix.labels.push({ name: String(name), key: k, words: k.split(' '), kind: kind });
      }
      function addYear(y) { y = +y; if (ix.years.indexOf(y) < 0) ix.years.push(y); }
      function chartPart(type, d, units, partNo) {
        var u = unitInfo(units || p.units || ''), part = { type: type, unit: u, n: partNo, cells: [] };
        ix.parts.push(part);
        if (u.pct) ix.pct = true;
        function cell(s, x, v, unit, tol) {
          if (typeof v !== 'number' || isNaN(v)) return;
          var c = { s: String(s), x: x, v: v, abs: v * (unit.mult || 1), unit: unit, tol: tol, part: partNo, type: type };
          ix.cells.push(c); part.cells.push(c);
        }
        if (type === 'line' || type === 'bar') {
          var xs = d.x || d.categories || [], all = [];
          d.series.forEach(function (s) { all = all.concat(s.values); });
          var step = niceMax(Math.max.apply(null, all) * 1.08) / 5;
          var tol = step / 2 * u.mult;
          part.step = step;
          d.series.forEach(function (s) {
            addLabel(s.name, 'series');
            s.values.forEach(function (v, i) { cell(s.name, xs[i], v, u, tol); });
          });
          xs.forEach(function (x) { if (isYear(x)) addYear(x); else addLabel(x, 'category'); });
          if (d.projectedFrom) ix.projectedFrom = d.projectedFrom;
        } else if (type === 'pie') {
          var pu = { mult: 1, pct: true, text: '%' }; ix.pct = true; part.unit = pu;
          d.charts.forEach(function (ch) {
            var t = String(ch.title || ''), ym = t.match(/\b(18|19|20)\d\d\b/);
            if (ym) addYear(ym[0]);
            ch.slices.forEach(function (sl) { addLabel(sl.name, 'slice'); cell(sl.name, ym ? +ym[0] : t, sl.value, pu, 2.5); });
          });
        } else if (type === 'table') {
          var cols = d.cols || [];
          cols.forEach(function (h, j) { if (j === 0) return; if (isYear(h)) addYear(h); else addLabel(baseName(h), 'column'); });
          d.rows.forEach(function (r) {
            addLabel(r[0], 'row');
            for (var j = 1; j < r.length; j++) {
              var cu = colUnit(cols[j], u), x = isYear(cols[j]) ? +cols[j] : cols[j];
              if (typeof r[j] === 'number') cell(r[0], x, r[j], cu, Math.max(Math.abs(r[j]) * 0.05, 0.05) * (cu.mult || 1));
            }
          });
        }
      }
      if (p.type === 'mixed') (p.data.parts || []).forEach(function (pt, i) { chartPart(pt.type, pt.data, pt.units, i); });
      else if (p.type === 'process') {
        (p.data.stages || []).forEach(function (s) { ix.stages.push(s); addLabel(s.label, 'stage'); });
      } else if (p.type === 'map') {
        (p.data.panels || []).forEach(function (pn, pi) {
          ix.panels.push(pn);
          if (isYear(pn.title)) addYear(pn.title);
          pn.features.forEach(function (f) { ix.features.push({ f: f, panel: pi, key: labelKey(f.name), w: pn.w, h: pn.h }); addLabel(f.name, 'feature'); });
        });
      } else chartPart(p.type, p.data, p.units, 0);
      (p.labels || []).forEach(function (l) { addLabel(l, 'label'); });
      ix.years.sort(function (a, b) { return a - b; });
      ix.yearMin = ix.years.length ? ix.years[0] : null;
      ix.yearMax = ix.years.length ? ix.years[ix.years.length - 1] : null;
      try { Object.defineProperty(p, '__labIndex', { value: ix, enumerable: false, configurable: true }); } catch (e) {}
      return ix;
    }

    /* Labels a value names. Strong = every word of the label in a row;
       weak = only the head noun (last word) of a longer label. */
    function labelsIn(text, ix, kinds) {
      var w = keyWords(text), out = [], weak = [];
      ix.labels.forEach(function (l) {
        if (kinds && kinds.indexOf(l.kind) < 0) return;
        if (hasRun(w, l.words)) out.push(l);
        else if (l.words.length > 1 && l.words[l.words.length - 1].length >= 4 && w.indexOf(l.words[l.words.length - 1]) >= 0) weak.push(l);
      });
      /* "Japan" inside "Japan and Korea" is fine; a shorter label inside a
         longer one that was also found ("Farmland" in "Farmland (west)") is
         the same thing. */
      var seen = {};
      out = out.filter(function (l) { if (seen[l.key]) return false; seen[l.key] = 1; return true; });
      weak = weak.filter(function (l) { return !seen[l.key]; });
      return { strong: out, weak: weak };
    }
    function namesIn(text, ix, kinds) {
      var r = labelsIn(text, ix, kinds);
      return r.strong.length ? r.strong : r.weak;
    }
    /* Text of a value with the label names taken out, so "the 18–29 group"
       or "Alpha 12" are not read as figures. */
    function stripLabels(text, ix) {
      var t = ' ' + String(text) + ' ';
      ix.labels.slice().sort(function (a, b) { return b.name.length - a.name.length; }).forEach(function (l) {
        if (!/\d/.test(l.name)) return;
        var nm = baseName(l.name).replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/[\u2013\u2014\-]/g, '[\\u2013\\u2014\\- ]');
        t = t.replace(new RegExp(nm, 'gi'), ' ');
      });
      return t.replace(/\b(18|19|20)\d\d\s*[\u2013\-]\s*(18|19|20)?\d\d\b/g, function (m) { return m; });
    }

    /* ---------------------------------------------------- the numbers
       Every figure in a value: { n, abs?, pct, points, diff, approx, mult,
       raw, year, frac }. Years (inside the chart's range ± 50) are kept
       apart from figures.                                               */
    /* "one hour", "three million", "two per cent": a number word (one–twelve)
       straight before a unit is read as a figure (WP20). Counts of categories
       ("three museums") stay words, so the overview rule is not tripped. */
    var SMALLNUM = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12 };
    var UNIT_WORDS = 'thousand|million|billion|per ?cent|percent|%|percentage points?|points?|hours?|hrs?|minutes?|mins?|seconds?|dollars?|baht|pounds?|euros?|kg|kilograms?|kilos?|grams?|tonnes?|tons?|litres?|liters?|cups?|degrees?';
    function wordNumbers(t, p) {
      var extra = String((p && p.units) || '').toLowerCase().match(/[a-z]{3,}/g) || [];
      extra = extra.filter(function (w) { return !/^(per|the|and|of|in|for|with|from|year|years)$/.test(w); }).map(function (w) { return w.replace(/s$/, '') + 's?'; });
      var re = new RegExp('\\b(one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve)(?=[\\s-]+(?:' + UNIT_WORDS + (extra.length ? '|' + extra.join('|') : '') + ')\\b)', 'gi');
      var reps = {};
      /* same-length replacement keeps every offset; reps remembers the word for the note */
      var t2 = t.replace(re, function (w, g1, off) { var d = String(SMALLNUM[w.toLowerCase()]); reps[off] = w; while (d.length < w.length) d += ' '; return d; });
      return { t: t2, reps: reps };
    }
    function numbers(text, p) {
      var ix = index(p) || { labels: [], yearMin: null, yearMax: null };
      var wn = wordNumbers(stripLabels(text, ix), ix.p || p), t = wn.t, out = [];
      var re = /(US\$|\$|฿|£|€)?\s?(\d{1,3}(?:,\d{3})+(?:\.\d+)?|\d+(?:\.\d+)?)\s*(thousand|million|billion|bn|mn|k|m)?\b\s*(percentage points?|points?|pp|%|per ?cent)?/gi;
      var m;
      while ((m = re.exec(t))) {
        var raw = m[0], cur = m[1] || '', numS = m[2], mw = (m[3] || '').toLowerCase(), unit = (m[4] || '').toLowerCase();
        var n = parseFloat(numS.replace(/,/g, ''));
        Object.keys(wn.reps).forEach(function (k) { if (+k >= m.index && +k < m.index + raw.length) raw = raw.replace(/\d+\s*/, wn.reps[k] + ' ').replace(/\s+/g, ' ').trim(); });
        if (isNaN(n)) continue;
        var before = t.slice(Math.max(0, m.index - 40), m.index);
        var after = t.slice(m.index + raw.length, m.index + raw.length + 30);
        /* "m" only counts as million straight after a number with a currency or decimal ("$4.5m") */
        if ((mw === 'm' || mw === 'k') && !(cur || /\./.test(numS))) { if (!/^\s*(\W|$)/.test(after)) mw = ''; }
        var isYr = !cur && !mw && !unit && /^\d{4}$/.test(numS) && +numS >= 1800 && +numS <= 2100 &&
          (ix.yearMin == null || (+numS >= ix.yearMin - 60 && +numS <= ix.yearMax + 60));
        if (isYr) { out.push({ year: +numS, raw: raw.trim(), at: m.index }); continue; }
        /* "after 15 years" when the task sentence says "after 15 years": part of a name, not a figure */
        var nextW = (after.match(/^\s*([A-Za-z]+)/) || [])[1];
        if (!cur && !mw && !unit && nextW && ix.p && new RegExp('\\b' + numS + '\\s+' + nextW + '\\b', 'i').test(String(ix.p.rubric || '') + ' ' + ix.labels.map(function (l) { return l.name; }).join(' '))) continue;
        /* ordinal leftovers like "1st" are not figures; °C is a detail, not data */
        if (/^(st|nd|rd|th)\b/i.test(after) || /^\s*°/.test(after)) continue;
        var o = { n: n, raw: raw.trim(), cur: !!cur, at: m.index };
        if (MULT[mw]) { o.mult = MULT[mw]; o.abs = n * o.mult; }
        if (/^percentage points?$|^points?$|^pp$/.test(unit)) { o.points = true; o.pct = true; }
        else if (unit) o.pct = true;
        APPROX.forEach(function (a) { if (!o.approx && a.re.test(before)) o.approx = a.side; });
        var bcore = before.replace(/(just|slightly|a little|well|far)?\s*(over|above|under|below|more than|less than|about|around|approximately|roughly|nearly|almost|some|close to)\s*$/i, '');
        if (/\b(by|of)\s*$/i.test(bcore) && /\b(rise|rose|risen|increase\w*|fell|fall\w*|drop\w*|decrease\w*|decline\w*|grew|grow\w*|climb\w*|jump\w*|gain\w*|loss|change\w*|went (up|down)|up|down|difference|gap)\b[^.]{0,30}\b(by|of)\s*$/i.test(bcore)) o.diff = true;
        if (/\b(a|an) (\w+ )?(rise|increase|fall|drop|decrease|decline|growth|gain|jump) of\s*$/i.test(bcore)) o.diff = true;
        if (/^\s*(more|less|fewer|higher|lower)\b/i.test(after) && !/\bthan\s*$/.test(before)) o.diff = true;
        if (o.points) o.diff = true;
        out.push(o);
      }
      if (ix.pct) FRACTION.forEach(function (f) {
        var fm = String(text).match(f.re);
        if (fm && !/\b(twice|times|as much|as many)\b/i.test(text)) out.push({ n: f.v, frac: fm[0].trim(), pct: true, approx: /just over|over|more than/i.test(fm[0]) ? 'over' : /just under|under|less than|nearly|almost/i.test(fm[0]) ? 'under' : 'any', raw: fm[0].trim() });
      });
      return out;
    }

    function fmtNum(v) {
      if (Math.abs(v) >= 1000) return String(Math.round(v * 100) / 100).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      return String(Math.round(v * 100) / 100);
    }
    function cellText(c) {
      var u = c.unit || {};
      var unit = u.pct ? '%' : u.mult === 1e3 ? ' thousand' : u.mult === 1e6 ? ' million' : u.mult === 1e9 ? ' billion' : u.money ? ' dollars' : '';
      return c.s + (c.x != null && c.x !== '' && String(c.x) !== c.s ? ', ' + c.x : '') + ': ' + fmtNum(c.v) + unit;
    }
    function decimals(s) { var m = String(s).replace(/,/g, '').match(/\.(\d+)/); return m ? m[1].length : 0; }

    /* Compare one figure with one cell. → 'exact' | 'approx' | 'near' (needs an
       approximation word) | 'side' (wrong side of "just over") | 'unit' (unit
       missing) | null */
    function matchCell(o, c) {
      var vals = [], u = c.unit || {};
      if (o.pct && !u.pct && !o.diff) return null;
      if (o.abs != null) vals.push({ v: o.abs, scale: o.mult || 1 });
      else {
        vals.push({ v: o.n, scale: 1 });
        /* a bare "420" on a chart in thousands: right number, unit missing */
        if ((u.mult || 1) > 1) vals.push({ v: o.n * u.mult, scale: u.mult, noUnit: true });
      }
      var best = null;
      vals.forEach(function (x) {
        var target = c.abs, diff = Math.abs(x.v - target), res = null;
        var dec = decimals(o.raw.replace(/^\D+/, '')), exactTol = 0.5 * Math.pow(10, -dec) * x.scale + 1e-9;
        if (diff <= exactTol) res = o.approx && o.approx !== 'any' ? (sideOk(o.approx, x.v, target, c.tol) ? 'approx' : 'side') : 'exact';
        else if (diff <= c.tol + 1e-9) res = o.approx ? (sideOk(o.approx, x.v, target, c.tol) ? 'approx' : 'side') : 'near';
        else if (o.approx && /^well/.test(o.approx) && sideOk(o.approx, x.v, target, c.tol * 4)) res = 'approx';
        if (res && x.noUnit && !(o.pct && u.pct)) res = 'unit';
        if (res && !!o.pct !== !!u.pct && !o.diff && !o.frac) res = o.pct ? null : 'nopct';
        if (res && o.points && !u.pct) res = null;
        if (res && (!best || rank(res) < rank(best))) best = res;
      });
      return best;
    }
    function rank(r) { return { exact: 0, approx: 1, near: 2, nopct: 3, unit: 4, side: 5 }[r]; }
    function sideOk(side, said, actual, tol) {
      if (side === 'over') return actual >= said - 1e-9 && actual - said <= tol + 1e-9;
      if (side === 'under') return actual <= said + 1e-9 && said - actual <= tol + 1e-9;
      if (side === 'wellover') return actual > said;
      if (side === 'wellunder') return actual < said;
      return Math.abs(actual - said) <= tol + 1e-9;
    }
    /* Differences between two cells of the same series (or the same x). */
    function diffCells(pool) {
      var out = [];
      for (var i = 0; i < pool.length; i++) for (var j = i + 1; j < pool.length; j++) {
        var a = pool[i], b = pool[j];
        if (a.part !== b.part) continue;
        if (a.s !== b.s && String(a.x) !== String(b.x)) continue;
        if ((a.unit || {}).text !== (b.unit || {}).text) continue;
        var d = Math.abs(a.v - b.v);
        out.push({ s: a.s === b.s ? a.s : a.s + ' / ' + b.s, x: a.s === b.s ? a.x + '–' + b.x : a.x, v: d, abs: d * (a.unit.mult || 1), unit: a.unit, tol: a.tol, part: a.part, diffOf: [a, b],
          rel: Math.min(a.v, b.v) > 0 ? d / (a.s === b.s && typeof a.x === 'number' && typeof b.x === 'number' && a.x > b.x ? b.v : a.v) * 100 : null });
      }
      return out;
    }

    /* Pools of cells for the context of a figure variable. */
    function pools(ix, ctx) {
      ctx = ctx || {};
      var all = ix.cells, cats = ctx.cats || [], at = ctx.at || [];
      /* WP20: a series/row/slice name narrows the cell's line, a category/column
         name its column; naming one of each means the one cell where they meet,
         so "60 chose sport" with the girls' slot does not read the boys' bar */
      var sAxis = cats.filter(function (l) { return l.kind === 'series' || l.kind === 'row' || l.kind === 'slice'; });
      var xAxis = cats.filter(function (l) { return l.kind === 'category' || l.kind === 'column'; });
      var other = cats.filter(function (l) { return sAxis.indexOf(l) < 0 && xAxis.indexOf(l) < 0; });
      function catOk(c) {
        var ks = labelKey(c.s), kx = labelKey(String(c.x));
        var sOk = !sAxis.length || sAxis.some(function (l) { return ks === l.key; });
        var xOk = !xAxis.length || xAxis.some(function (l) { return kx === l.key; });
        var oOk = other.some(function (l) { return ks === l.key || kx === l.key; });
        if (!sAxis.length && !xAxis.length) return oOk;
        return sOk && xOk;
      }
      function atOk(c) { return at.some(function (y) { return String(c.x) === String(y) || (typeof c.x === 'string' && c.x.indexOf(String(y)) >= 0); }); }
      var p2 = cats.length ? all.filter(catOk) : [];
      var p1 = cats.length && at.length ? p2.filter(atOk) : at.length && !cats.length ? all.filter(atOk) : [];
      return { exact: p1, cat: p2, all: all };
    }

    function checkFigure(o, ix, ctx) {
      var P = pools(ix, ctx), tries = [['exact', P.exact], ['cat', P.cat], ['all', P.all]];
      var hit = null, hasCtx = !!((ctx && ctx.cats && ctx.cats.length) || (ctx && ctx.at && ctx.at.length));
      /* pass 1: a clean match (exact, or approximated with the right word) in
         the narrowest pool; pass 2: anything close */
      for (var i = 0; i < tries.length && !hit; i++) [['exact', 'approx'], null].forEach(function (accept) {
          if (hit) return;
          var pool = tries[i][1]; if (!pool.length) return;
          var cand = o.diff ? diffCells(pool) : pool, best = null, bestCell = null;
          cand.forEach(function (c) {
            var r = matchCell(o, c);
            if (o.diff && !r && !o.points && o.pct && c.rel != null && !(c.unit || {}).pct) {
              /* "rose by 25%" on a chart that is not in per cent: a relative change */
              if (Math.abs(c.rel - o.n) <= (o.approx ? 3 : 1)) r = 'exact';
            }
            if (r && accept && accept.indexOf(r) < 0) r = null;
            if (r && (!best || rank(r) < rank(best))) { best = r; bestCell = c; }
          });
          if (best) hit = { level: tries[i][0], res: best, cell: bestCell };
      });
      /* a total of two values ("together, 59%"): same pie, same year or same series */
      if (!hit && !o.diff) {
        var pool2 = P.cat.length ? P.cat : P.all, sums = [];
        for (var a1 = 0; a1 < pool2.length; a1++) for (var b1 = a1 + 1; b1 < pool2.length; b1++) {
          var ca = pool2[a1], cb = pool2[b1];
          if (ca.part !== cb.part || (ca.s !== cb.s && String(ca.x) !== String(cb.x)) || (ca.unit || {}).text !== (cb.unit || {}).text) continue;
          sums.push({ s: ca.s + ' + ' + cb.s, x: ca.s === cb.s ? ca.x + ' + ' + cb.x : ca.x, v: ca.v + cb.v, abs: ca.abs + cb.abs, unit: ca.unit, tol: ca.tol, part: ca.part, sumOf: [ca, cb] });
        }
        sums.forEach(function (c) { var r = matchCell(o, c); if (r && (r === 'exact' || r === 'approx') && !hit) hit = { level: 'sum', res: r, cell: c }; });
      }
      /* close to the right line, but exactly the value of another one: say so */
      if (hit && hit.res !== 'exact' && hit.res !== 'approx' && hit.level !== 'all') {
        var ex = null;
        (o.diff ? diffCells(P.all) : P.all).forEach(function (c) { if (!ex && matchCell(o, c) === 'exact') ex = c; });
        /* WP20: the exact value of the SAME series in another year is a year
           slip ('cat'), not a wrong line ('all'): the note must not name the
           same series on both sides */
        if (ex) {
          var sameSeries = (ctx && ctx.cats || []).some(function (l) { return labelKey(ex.s) === l.key || labelKey(String(ex.x)) === l.key; });
          hit = { level: sameSeries ? 'cat' : 'all', res: 'exact', cell: ex };
        }
      }
      /* a figure that is only roughly like a value of ANOTHER category is wrong */
      if (hit && hit.level === 'all' && hasCtx && hit.res !== 'exact' && !(ctx.cats && !ctx.cats.length)) return null;
      return hit;
    }

    function describeHit(o, hit, ctx) {
      var c = hit.cell, where = c.diffOf ? 'the change for ' + c.s + ' (' + fmtNum(c.diffOf[0].v) + ' → ' + fmtNum(c.diffOf[1].v) + ')' : c.sumOf ? 'the total of ' + cellText(c.sumOf[0]) + ' and ' + cellText(c.sumOf[1]) : cellText(c);
      var ctxName = ctx && ctx.cats && ctx.cats.length ? ctx.cats.map(function (l) { return l.name; }).join(' / ') : '';
      var atName = ctx && ctx.at && ctx.at.length ? ctx.at.join(' / ') : '';
      var pctPoints = o.diff && !o.points && o.pct && (c.unit || {}).pct;
      if (hit.res === 'unit') return { status: 'near', note: '"' + o.raw + '" matches ' + where + ', but say the unit: ' + fmtNum(o.n) + ' ' + ((c.unit.mult === 1e3) ? 'thousand' : c.unit.mult === 1e6 ? 'million' : 'billion') + '.' };
      if (hit.res === 'nopct') return { status: 'near', note: '"' + o.raw + '" matches ' + where + '. Add the % sign: the chart is in percentages.' };
      if (hit.res === 'side') return { status: 'near', note: '"' + o.raw + '" is close, but check the word before it: the real figure is ' + where + '.' };
      if (hit.res === 'near') return { status: 'near', note: '"' + o.raw + '" is close to ' + where + '. Write the exact figure, or add "about" / "around".' };
      var base = { status: 'ok', note: '"' + o.raw + '" matches ' + where + (hit.res === 'approx' ? ' (approximated)' : '') + '.' };
      if (pctPoints) return { status: 'near', note: '"' + o.raw + '" is a change between two percentages (' + where + '). Say "' + fmtNum(o.n) + ' percentage points", not "' + fmtNum(o.n) + '%".' };
      if (hit.level === 'cat' && ctx.at && ctx.at.length) return { status: 'bad', kind: c.diffOf ? 'diff' : 'year', raw: o.raw, note: '"' + o.raw + '" is ' + where + ', not the figure for ' + atName + '. Check the year or column.' };
      if (hit.level === 'all' && ctxName) return { status: 'bad', kind: c.diffOf ? 'diff' : 'series', raw: o.raw, note: '"' + o.raw + '" belongs to ' + where + ', not to ' + ctxName + '. Check which line, bar or row you read.' };
      return base;
    }

    var PAST_TREND = /\b(rose|fell|grew|increased|decreased|declined|dropped|climbed|peaked|remained|stayed|reached|stood|fluctuated|doubled|halved|recovered|plunged|plummeted|soared|levelled off|leveled off|went up|went down|overtook|surpassed|dipped|jumped|collapsed)\b/i;
    var PRESENT_TREND = /\b(rises|falls|grows|increases|decreases|declines|drops|climbs|peaks|remains|stays|reaches|stands|fluctuates|doubles|recovers|overtakes|is rising|is falling|are rising|are falling|has risen|have risen|has fallen|have fallen)\b/i;
    var PROJ = /\b(projected|expected|predicted|forecast|will|is set to|are set to|is likely to|are likely to)\b/i;
    var UP = /\b(rose|rise[sn]?|rising|increas\w*|grew|grow\w*|climb\w*|went up|doubl\w*|tripl\w*|soar\w*|surg\w*|jump\w*|upward|gain\w*|recover\w*|higher|more than doubled)\b/i;
    var DOWN = /\b(fell|fall\w*|declin\w*|decreas\w*|dropp?\w*|went down|halv\w*|plummet\w*|plung\w*|shr[aiu]nk\w*|downward|collaps\w*|dipp?\w*|lower|los[st]\w*)\b/i;
    var FLAT = /\b(stable|steady|unchanged|constant|remained|stayed|fluctuat\w*|little change|changed little|level|flat|the same)\b/i;
    var CHANGE_VERB = /\b(built|constructed|added|demolished|knocked down|removed|replaced|converted|turned into|transformed|extended|expanded|enlarged|widened|lengthened|reduced|shrunk|made smaller|relocated|moved|pedestrianised|pedestrianized|paved|cleared|planted|developed|redeveloped|opened|closed|cut down)\b/i;
    var COMPASS = /\b(north|south|east|west|northern|southern|eastern|western|north[\s-]?east|north[\s-]?west|south[\s-]?east|south[\s-]?west|centre|center|central|middle)\b/gi;
    var RELATIVE_PLACE = /\b(next to|beside|opposite|along|near|behind|in front of|between|across|around|by the|on the edge|on the site of|where|corner|side)\b/i;

    function yearsIn(text, ix) { return numbers(text, ix.p).filter(function (o) { return o.year; }).map(function (o) { return o.year; }); }
    function noFigures(text, ix) { return numbers(text, ix.p).filter(function (o) { return !o.year; }); }

    function ctxFor(def, ix, ctx) {
      var out = { cats: [], at: [] };
      var vars = (ctx && ctx.vars) || {};
      var c = def.check || {};
      if (c.cat) {
        var cv = vars[c.cat];
        if (cv) {
          out.cats = namesIn(cv, ix);
          if (!out.cats.length) { var ys = yearsIn(cv, ix); if (ys.length) out.at = ys; }
        }
      }
      if (c.at && vars[c.at]) out.at = out.at.concat(yearsIn(vars[c.at], ix));
      if (c.at === 'first' && ix.yearMin != null) out.at.push(ix.yearMin);
      if (c.at === 'last' && ix.yearMax != null) out.at.push(ix.yearMax);
      /* a group given as a time phase ("arrivals between 2015 and 2019") */
      if (c.cat && vars[c.cat] && out.cats.length) {
        var phase = yearsIn(vars[c.cat], ix);
        if (phase.length >= 2) out.phase = [Math.min.apply(null, phase), Math.max.apply(null, phase)];
      }
      return out;
    }

    function worst(list) {
      var order = { bad: 0, near: 1, ok: 2, none: 3 };
      var w = null; list.forEach(function (r) { if (!w || order[r.status] < order[w.status]) w = r; }); return w;
    }

    /* Direction of a group of labels over time: 'up' | 'down' | 'flat' | 'mixed' | null */
    function direction(ix, cats, phase) {
      var dirs = [], info = [];
      cats.forEach(function (l) {
        var cs = ix.cells.filter(function (c) { return labelKey(c.s) === l.key && (typeof c.x === 'number' || isYear(c.x)); });
        if (phase) cs = cs.filter(function (c) { return +c.x >= phase[0] && +c.x <= phase[1]; });
        if (ix.projectedFrom) { var hist = cs.filter(function (c) { return +c.x <= ix.projectedFrom; }); if (hist.length >= 2) cs = hist; }
        cs.sort(function (a, b) { return +a.x - +b.x; });
        if (cs.length < 2) return;
        var a = cs[0].v, b = cs[cs.length - 1].v, ch = (b - a) / Math.max(Math.abs(a), 1e-9);
        var d = ch > 0.08 ? 'up' : ch < -0.08 ? 'down' : 'flat';
        dirs.push(d); info.push(l.name + ' ' + fmtNum(a) + ' → ' + fmtNum(b) + ' (' + cs[0].x + '–' + cs[cs.length - 1].x + ')');
      });
      if (!dirs.length) return null;
      var u = dirs.filter(function (d) { return d === dirs[0]; }).length === dirs.length ? dirs[0] : 'mixed';
      return { dir: u, info: info.join('; ') };
    }

    function visualWords(type) {
      return { line: /\bline (graph|chart)s?\b|\bgraphs?\b/i, bar: /\bbar (chart|graph)s?\b|\bcolumn (chart|graph)s?\b/i, pie: /\bpie (chart|graph)s?\b/i,
        table: /\btables?\b/i, process: /\b(diagram|flow ?chart|process chart|illustration)s?\b/i, map: /\b(maps?|plans?)\b/i }[type];
    }

    /* ------------------------------------------------------------ check */
    function check(def, value, p, ctx) {
      var c = (def && def.check) || {}, type = c.type || 'none', v = String(value || '').trim();
      ctx = ctx || {};
      if (!v) return { status: 'none', note: '' };
      if (type === 'none' || !p) return { status: 'none', note: '' };
      var ix = index(p), mode = p.mode;
      var plan = mode === 'SPACE' && ix.panels.length > 1 && !isYear(ix.panels[ix.panels.length - 1].title) && /plan|future|propos/i.test(ix.panels[ix.panels.length - 1].title);
      var res;
      switch (type) {
        case 'visual': res = checkVisual(v, p); break;
        case 'what': res = checkWhat(v, p, ix); break;
        case 'year': res = checkYear(v, ix, c.role); break;
        case 'panel': res = checkPanel(v, ix, c.role); break;
        case 'group': res = checkGroup(v, ix); break;
        case 'label': res = checkLabel(v, ix, c.role); break;
        case 'move': res = checkMove(v, ix, ctxFor(def, ix, ctx), mode); break;
        case 'nofig': res = checkNoFig(v, ix, mode, c); break;
        case 'figure': res = checkFigures(v, ix, ctxFor(def, ix, ctx), mode, c, def.label); break;
        case 'labelfig': {
          var names = namesIn(v, ix);
          if (!names.length) { res = { status: 'bad', note: 'Name the category this figure belongs to.' }; break; }
          res = checkFigures(v, ix, { cats: names, at: yearsIn(v, ix) }, mode, c);
          if (res.status !== 'bad') res.note = names.map(function (l) { return l.name; }).join(', ') + ': ' + res.note;
          break;
        }
        case 'count': res = checkCount(v, ix); break;
        case 'shape': res = checkShape(v, ix); break;
        case 'stage': res = checkStage(v, ix, c, mode); break;
        case 'feature': res = checkFeature(v, ix, c.role); break;
        case 'compass': res = checkCompass(v, ix, def, ctx); break;
        case 'clause': res = checkClause(v, ix, plan); break;
        default: res = { status: 'none', note: '' };
      }
      /* tense by mode, on any value that carries a verb */
      var t = tenseIssue(v, ix, mode, plan, type);
      if (t) res = worst([res, t]) === t ? t : { status: res.status, note: res.note + ' ' + t.note, tense: true };
      return res;
    }

    function tenseIssue(v, ix, mode, plan, type) {
      if (mode === 'TREND' && PRESENT_TREND.test(v) && !PROJ.test(v)) {
        var ys = yearsIn(v, ix), cur = new Date().getFullYear();
        if (!ix.projectedFrom || ys.every(function (y) { return y <= ix.projectedFrom; }))
          return { status: 'bad', note: 'Tense: the years are in the past, so use the past simple ("' + v.match(PRESENT_TREND)[0] + '" → rose / fell / remained).' };
      }
      if (mode === 'TREND' && ix.projectedFrom && PAST_TREND.test(v) && !PROJ.test(v)) {
        var yy = yearsIn(v, ix).filter(function (y) { return y > ix.projectedFrom; });
        if (yy.length) return { status: 'bad', note: 'Tense: ' + yy[0] + ' is a projection. Use "is projected to …" or "is expected to …", not "' + v.match(PAST_TREND)[0] + '".' };
      }
      if (mode === 'SEQUENCE' && /\b(was|were|had been)\b/i.test(v)) return { status: 'bad', note: 'Tense: a process happens every time, so use the present simple (is / are …), not "' + v.match(/\b(was|were|had been)\b/i)[0] + '".' };
      if (mode === 'SPACE' && (type === 'clause' || type === 'nofig')) {
        if (plan && /\b(was|were|has been|have been)\b/i.test(v)) return { status: 'bad', note: 'Tense: the second map is a plan, so the changes have not happened yet. Use "will be …".' };
        if (!plan && /\bwill (be|become)\b/i.test(v)) return { status: 'bad', note: 'Tense: both maps show the past, so use the past simple or the present perfect ("was built", "has been converted").' };
      }
      return null;
    }

    function checkVisual(v, p) {
      var types = p.type === 'mixed' ? p.data.parts.map(function (x) { return x.type; }) : [p.type];
      var said = ['line', 'bar', 'pie', 'table', 'process', 'map'].filter(function (t) { return visualWords(t).test(v); });
      var wrong = said.filter(function (t) { return types.indexOf(t) < 0 && !(t === 'line' && /\bgraph\b/i.test(v) && types.indexOf('bar') >= 0 && !/\bline\b/i.test(v)); });
      if (wrong.length) return { status: 'bad', note: 'This chart is ' + types.map(nameOfType).join(' + ') + ', not a ' + nameOfType(wrong[0]) + '.' };
      var missing = types.filter(function (t) { return said.indexOf(t) < 0; });
      if (missing.length === types.length) return { status: 'near', note: 'Name the kind of visual: ' + types.map(nameOfType).join(' and ') + '.' };
      if (missing.length) return { status: 'near', note: 'There are two visuals: name both (' + types.map(nameOfType).join(' and ') + ').' };
      if (p.type === 'pie' && p.data.charts.length > 1 && !/\bpie (chart|graph)s\b|\b(two|three) pie\b/i.test(v)) return { status: 'near', note: 'There are ' + p.data.charts.length + ' pie charts: use the plural.' };
      if (p.type === 'map' && p.data.panels.length > 1 && !/\bmaps\b|\bplans\b|\btwo\b/i.test(v)) return { status: 'near', note: 'There are two maps: use the plural.' };
      return { status: 'ok', note: 'Right kind of visual.' };
    }
    function nameOfType(t) { return { line: 'a line graph', bar: 'a bar chart', pie: 'a pie chart', table: 'a table', process: 'a diagram', map: 'a map' }[t] || t; }

    function longestRun(a, b) {
      var x = normText(a).split(' '), y = normText(b).split(' '), best = 0;
      for (var i = 0; i < x.length; i++) for (var j = 0; j < y.length; j++) { var k = 0; while (i + k < x.length && j + k < y.length && x[i + k] === y[j + k]) k++; if (k > best) best = k; }
      return best;
    }
    function checkWhat(v, p, ix) {
      var run = longestRun(v, p.rubric || '');
      if (run >= 8) return { status: 'near', note: run + ' words in a row are copied from the task sentence. Copied words are not counted: change the words and the order.' };
      var u = lower(p.units || '');
      if (p.type === 'mixed') u = (p.data.parts || []).map(function (x) { return lower(x.units || ''); }).join(' ');
      var needs = [];
      if (/thousand/.test(u)) needs.push(/thousand|000/i);
      if (/million/.test(u)) needs.push(/million/i);
      if (/%/.test(u) || ix.pct) needs.push(/%|per ?cent|percentage|proportion|share|fraction/i);
      if (needs.length && !needs.some(function (re) { return re.test(v); })) return { status: 'near', note: 'Say the unit here: ' + (p.units || 'per cent') + '. The reader needs it to read your figures.' };
      return { status: 'ok', note: 'Paraphrased, with the unit.' };
    }
    function checkYear(v, ix, role) {
      var ys = yearsIn(v, ix);
      if (!ys.length) {
        if (/\b(now|today|at present|currently)\b/i.test(v) && ix.panels.length) return checkPanel(v, ix, role);
        return { status: 'bad', note: 'Write the year (' + (ix.yearMin != null ? ix.yearMin + '–' + ix.yearMax : 'from the chart') + ').' };
      }
      if (ix.yearMin == null) return { status: 'near', note: 'This chart has no years: describe the categories instead.' };
      var y = ys[0];
      if (y < ix.yearMin || y > ix.yearMax) return { status: 'bad', note: y + ' is outside the chart: it runs from ' + ix.yearMin + ' to ' + ix.yearMax + '.' };
      if (role === 'first' && y !== ix.yearMin) return { status: 'near', note: 'The chart starts in ' + ix.yearMin + ', not ' + y + '.' };
      if (role === 'last' && y !== ix.yearMax && !(ix.projectedFrom && y === ix.projectedFrom)) return { status: 'near', note: 'The chart ends in ' + ix.yearMax + (ix.projectedFrom ? ' (projections after ' + ix.projectedFrom + ')' : '') + ', not ' + y + '.' };
      if (ix.years.indexOf(y) < 0) return { status: 'near', note: y + ' is not a point on the chart. The points are ' + ix.years.join(', ') + '.' };
      return { status: 'ok', note: y + ' is on the chart.' };
    }
    function panelMatches(v, title) {
      if (isYear(title)) return yearsInRaw(v).indexOf(+title) >= 0;
      if (/now|present|current/i.test(title)) return /\b(now|today|at present|currently|present|current|existing)\b/i.test(v);
      if (/plan|future|propos/i.test(title)) return /\b(plan|planned|future|proposed|proposal|will|after)\b/i.test(v);
      return keyWords(v).join(' ').indexOf(labelKey(title)) >= 0;
    }
    function yearsInRaw(v) { return (String(v).match(/\b(18|19|20)\d\d\b/g) || []).map(Number); }
    function checkPanel(v, ix, role) {
      if (!ix.panels.length) return checkYear(v, ix, role);
      var titles = ix.panels.map(function (pn) { return pn.title; }), i = role === 'first' ? 0 : role === 'last' ? titles.length - 1 : -1;
      if (i >= 0 && panelMatches(v, titles[i])) return { status: 'ok', note: 'Matches the map titled "' + titles[i] + '".' };
      var other = titles.filter(function (t) { return panelMatches(v, t); });
      if (other.length) return { status: 'near', note: 'That is the ' + (role === 'first' ? 'second' : 'first') + ' map ("' + other[0] + '"). This slot is the ' + (role === 'first' ? 'first' : 'second') + ' one ("' + titles[i] + '").' };
      var ys = yearsInRaw(v);
      if (ys.length) return { status: 'bad', note: ys[0] + ' is not a map title. The maps are "' + titles.join('" and "') + '".' };
      return { status: 'bad', note: 'Use the map title: "' + titles.join('" and "') + '".' };
    }
    function checkGroup(v, ix) {
      var r = labelsIn(v, ix);
      if (r.strong.length) return { status: 'ok', note: 'Names ' + r.strong.map(function (l) { return l.name; }).join(', ') + '.' };
      var ys = yearsIn(v, ix);
      if (ys.length) {
        var out = ys.filter(function (y) { return ix.yearMin != null && (y < ix.yearMin || y > ix.yearMax); });
        if (out.length) return { status: 'bad', note: out[0] + ' is outside the chart (' + ix.yearMin + '–' + ix.yearMax + ').' };
        return { status: 'ok', note: 'A time phase: ' + ys.join('–') + '.' };
      }
      if (r.weak.length) return { status: 'near', note: 'Do you mean ' + r.weak.map(function (l) { return l.name; }).join(' / ') + '? Use the name on the chart.' };
      return { status: 'near', note: 'Name the categories in this group, as the chart names them (' + ix.labels.filter(function (l) { return l.kind !== 'label'; }).slice(0, 4).map(function (l) { return l.name; }).join(', ') + '…).' };
    }
    function checkLabel(v, ix, role) {
      var kinds = ix.type === 'process' ? ['stage', 'label'] : ix.type === 'map' ? ['feature', 'label'] : null;
      var names = namesIn(v, ix, kinds);
      if (!names.length) return { status: 'bad', note: 'This is not a name on the chart. Use one of: ' + ix.labels.filter(function (l) { return l.kind !== 'label'; }).slice(0, 6).map(function (l) { return l.name; }).join(', ') + '.' };
      if (role === 'top' || role === 'bottom') {
        var ext = extremes(ix, role), hitN = names.filter(function (l) { return ext.keys[l.key]; });
        if (hitN.length) return { status: 'ok', note: hitN[0].name + ' is the ' + (role === 'top' ? 'highest' : 'lowest') + ' ' + ext.keys[hitN[0].key] + '.' };
        return { status: 'near', note: names[0].name + ' is on the chart, but is it the ' + (role === 'top' ? 'largest' : 'smallest') + '? Look again: ' + ext.overall + '.' };
      }
      return { status: 'ok', note: 'Matches ' + names.map(function (l) { return l.name; }).join(', ') + '.' };
    }
    /* Which labels are the highest / lowest anywhere: overall, per series,
       per x, per table column, per pie. */
    function extremes(ix, role) {
      var keys = {}, groups = {}, best = null;
      ix.cells.forEach(function (c) {
        [['s', c.s, 'x', c.x], ['x', String(c.x), 's', c.s]].forEach(function (g) {
          var gk = c.part + '|' + g[0] + '|' + g[1];
          var cur = groups[gk];
          if (!cur || (role === 'top' ? c.v > cur.v : c.v < cur.v)) groups[gk] = { v: c.v, label: g[3], within: g[1], c: c };
        });
        if (!best || (role === 'top' ? c.abs > best.abs : c.abs < best.abs)) { if ((c.unit || {}).text === ((ix.cells[0] || {}).unit || {}).text) best = c; }
      });
      Object.keys(groups).forEach(function (gk) {
        var g = groups[gk], k = labelKey(String(g.label));
        if (k && !keys[k]) keys[k] = 'in ' + g.within + ' (' + fmtNum(g.v) + ')';
      });
      return { keys: keys, overall: best ? 'the highest single figure is ' + cellText(best) : '' };
    }
    function checkMove(v, ix, cx, mode) {
      var figs = noFigures(v, ix);
      if (figs.length) return { status: 'bad', note: 'No figures here: this goes in the overview. Move "' + figs[0].raw + '" to the detail paragraphs.' };
      var up = UP.test(v), down = DOWN.test(v), flat = FLAT.test(v.replace(/\bsteadily\b|\bsteady (rise|fall|increase|decrease|decline|growth)\b/gi, ' '));
      if (!(up || down || flat)) return { status: 'near', note: 'Use a trend word: rose, fell, remained stable, fluctuated…' };
      if (!cx.cats.length && !cx.phase) return { status: 'ok', note: 'A clear trend word. (Fill the group first to check the direction.)' };
      var d = direction(ix, cx.cats.length ? cx.cats : [], cx.phase);
      if (!d && cx.phase) {
        var allSeries = ix.labels.filter(function (l) { return l.kind === 'series'; });
        d = direction(ix, allSeries, cx.phase);
      }
      if (!d) return { status: 'ok', note: 'A clear trend word.' };
      var said = (up ? 1 : 0) + (down ? 1 : 0) + (flat ? 1 : 0) > 1 ? 'mixed' : up ? 'up' : down ? 'down' : 'flat';
      if (d.dir === 'mixed') return { status: 'near', note: 'Your group moves in different directions (' + d.info + '). Put lines that move the same way in one group.' };
      if (said === 'mixed') return { status: /fluctuat|then|before|after|but|and|while|although|until/i.test(v) ? 'ok' : 'near', note: 'Two movements in one phrase. The overall change: ' + d.info + '.' };
      if (said === d.dir || (said === 'flat' && /fluctuat/i.test(v))) return { status: 'ok', note: 'Right direction: ' + d.info + '.' };
      return { status: 'bad', note: 'Wrong direction. The chart shows ' + d.info + '.' };
    }
    function checkNoFig(v, ix, mode, c) {
      var figs = noFigures(v, ix);
      if (figs.length) return { status: 'bad', note: 'No figures here: "' + figs[0].raw + '" belongs in a detail paragraph.' };
      if (mode === 'COMPARE' && ix.years.length < 2 && PAST_TREND.test(v) && /\b(rose|fell|grew|increased|decreased|declined|dropped|climbed)\b/i.test(v)) return { status: 'near', note: 'No time axis here: compare (higher than, the largest) instead of trend verbs like "' + v.match(/\b(rose|fell|grew|increased|decreased|declined|dropped|climbed)\b/i)[0] + '".' };
      if (c.needsLabel && !namesIn(v, ix).length) return { status: 'near', note: 'Name at least one category from the chart.' };
      return { status: 'ok', note: 'General, with no figures.' };
    }
    function checkFigures(v, ix, cx, mode, c, label) {
      var figs = noFigures(v, ix);
      if (!figs.length) return { status: 'bad', note: 'Write the figure from the chart' + (ix.pct ? ' (with %)' : ix.parts[0] && ix.parts[0].unit.mult > 1 ? ' (with "thousand" or "million")' : '') + '.' };
      var yrs = yearsIn(v, ix);
      var bad = yrs.filter(function (y) { return ix.yearMin != null && (y < ix.yearMin || y > ix.yearMax); });
      if (bad.length) return { status: 'bad', note: bad[0] + ' is outside the chart (' + ix.yearMin + '–' + ix.yearMax + ').' };
      /* WP20: a label named in the value only counts for the figures in its own
         clause (or the clause before a comparison word), so "610 thousand, the
         same as the Art Gallery" is still checked against the slot's own group;
         "45 girls, compared with 60 boys" still reads 60 as the boys' figure. */
      var own = namesIn(v, ix), segs = segmentsOf(v), cursor = 0, atCtx = yrs.length ? yrs : cx.at;
      var results = figs.map(function (o) {
        if (o.frac && !ix.pct) return { status: 'none', note: '' };
        var cats = cx.cats.slice(), pos = v.indexOf(o.raw, cursor), add = own;
        if (pos >= 0) cursor = pos + o.raw.length;
        if (cx.cats.length && pos >= 0) {
          var si = -1; segs.forEach(function (sg, i) { if (si < 0 && pos >= sg.from && pos < sg.to) si = i; });
          if (si >= 0) { add = namesIn(segs[si].text, ix); if (segs[si].compareAfter && segs[si + 1]) add = add.concat(namesIn(segs[si + 1].text, ix)); }
        }
        add.forEach(function (l) { if (!cats.some(function (x) { return x.key === l.key; })) cats.push(l); });
        var cxo = { cats: cats, at: atCtx, phase: cx.phase };
        var hit = checkFigure(o, ix, cxo);
        if (!hit) {
          var unitHint = '';
          if (o.pct && !ix.pct) unitHint = ' This chart is not in percentages.';
          else if (o.points && !ix.pct) unitHint = ' Percentage points are only for figures that are percentages.';
          return { status: 'bad', kind: o.diff ? 'diff' : 'none', raw: o.raw, note: '"' + o.raw + '" is not on the chart' + (o.diff ? ' as a difference between two figures' : '') + '.' + unitHint + (o.approx ? ' Even with "' + o.approx.replace('any', 'about') + '", it is too far from any value.' : '') };
        }
        return describeHit(o, hit, cxo);
      });
      var w = worst(results.filter(function (r) { return r.status !== 'none'; })) || { status: 'ok', note: '' };
      if (w.status === 'ok' && results.length > 1) w = { status: 'ok', note: results.map(function (r) { return r.note; }).join(' ') };
      /* WP20: a change statement ("rose by 15 points to 90%", "from 420 to 760")
         in a START / END figure slot stays wrong, but says what the slot wants */
      var slotEnd = !c.at ? '' : /start|first|begin|open/i.test(label || '') ? 'START' : /end|last|final|clos/i.test(label || '') ? 'END' : 'single';
      var isChange = w.kind === 'diff' || (w.kind === 'year' && figs.length > 1);
      if (slotEnd && w.status === 'bad' && isChange && cx.at.length) {
        var want = pools(ix, { cats: cx.cats, at: cx.at }).exact[0], eg = want ? unitWords(want) : '';
        w = { status: 'bad', kind: w.kind, note: 'This slot wants the ' + (slotEnd === 'single' ? 'figure for ' + cx.at.join(' / ') : slotEnd + ' figure') + (eg ? ' (e.g. ' + eg + ')' : '') + ', not ' + (w.kind === 'diff' ? 'the change' : 'another year\'s figure') + ': ' + w.note + (w.kind === 'diff' ? ' The size of the change belongs in your frame or the trend slot.' : '') };
      }
      return w;
    }
    /* Clauses of a value, split at punctuation and contrast words; a clause that
       ends in a comparison word (than / compared with) lends its figures the
       labels of the next clause. */
    function segmentsOf(v) {
      var out = [], re = /,|;|:|\bcompared (?:with|to)\b|\bthan\b|\bwhile\b|\bwhereas\b|\bbut\b|\bversus\b|\bvs\.?|\bagainst\b|[()]/gi, last = 0, m;
      while ((m = re.exec(v))) { out.push({ from: last, to: m.index, text: v.slice(last, m.index), compareAfter: /than|compared|versus|vs|against/i.test(m[0]) }); last = m.index + m[0].length; }
      out.push({ from: last, to: v.length, text: v.slice(last), compareAfter: false });
      return out;
    }
    function checkCount(v, ix) {
      var n = ix.stages.length, said = null;
      var m = String(v).match(/\b(\d+)\b/); if (m) said = +m[1];
      else Object.keys(WORDNUM).forEach(function (w) { if (said == null && new RegExp('\\b' + w + '\\b', 'i').test(v)) said = WORDNUM[w]; });
      if (said == null) return { status: 'bad', note: 'Write the number of stages.' };
      if (said !== n) return { status: 'bad', note: 'Count again: the diagram has ' + n + ' stages, not ' + said + '.' };
      return { status: 'ok', note: 'Yes: ' + n + ' stages.' };
    }
    function checkShape(v, ix) {
      var shape = (ix.p.data && ix.p.data.shape) || 'linear';
      var said = /\b(cycl\w*|circular|loop|continuous|cycle)\b/i.test(v) ? 'cyclical' : /\b(linear|straight|one[- ]way|step[- ]by[- ]step)\b/i.test(v) ? 'linear' : null;
      if (!said) return { status: 'near', note: 'Say whether the process is linear (one way) or cyclical (it starts again).' };
      if (said !== shape) return { status: 'bad', note: 'Look again: this process is ' + shape + (shape === 'cyclical' ? ' (the last stage leads back to the first).' : ' (it has a clear start and end).') };
      return { status: 'ok', note: 'Yes: a ' + shape + ' process.' };
    }
    function stem(w) { return w.length >= 5 ? w.slice(0, 5) : w; }
    var STOPW = { with: 1, from: 1, into: 1, then: 1, they: 1, them: 1, their: 1, this: 1, that: 1, which: 1, after: 1, about: 1, where: 1, while: 1, before: 1, until: 1, each: 1, used: 0, stage: 1, stages: 1, process: 1, finally: 1, next: 1, first: 1, the: 1, and: 1 };
    function contentStems(s) { return keyWords(s).filter(function (w) { return w.length >= 4 && !STOPW[w] && !/^\d/.test(w); }).map(stem); }
    function bestStages(v, ix) {
      var vs = contentStems(v), vk = keyWords(v);
      return ix.stages.map(function (s, i) {
        var score = 0, ls = keyWords(baseName(s.label));
        if (hasRun(vk, ls)) score += 3;
        var st = contentStems(s.label + ' ' + (s.detail || ''));
        var seen = {};
        vs.forEach(function (w) { if (st.indexOf(w) >= 0 && !seen[w]) { seen[w] = 1; score += 1; } });
        return { i: i, s: s, score: score };
      }).filter(function (x) { return x.score > 0; }).sort(function (a, b) { return b.score - a.score || a.i - b.i; });
    }
    function checkStage(v, ix, c, mode) {
      if (!ix.stages.length) return { status: 'none', note: '' };
      var S = ix.stages.length, cand = bestStages(v, ix), exp = null;
      if (c.role === 'first') exp = 0; else if (c.role === 'last') exp = S - 1;
      else if (c.role === 'mid') exp = Math.floor((S - 1) / 2);
      else if (c.slot) exp = Math.round((c.slot - 1) * (S - 1) / Math.max(1, (c.of || 6) - 1));
      if (!cand.length) return { status: 'near', note: 'Which stage is this? Use the words on the diagram, e.g. "' + ix.stages[exp == null ? 0 : exp].label + '".' };
      var top = cand[0], spread = c.role ? 1 : Math.max(1.5, S / 5);
      if (exp != null && Math.abs(top.i - exp) > spread && !cand.some(function (x) { return x.score === top.score && Math.abs(x.i - exp) <= spread; }))
        return { status: 'near', note: 'This sounds like stage ' + (top.i + 1) + ' ("' + top.s.label + '"), but this slot is near stage ' + (exp + 1) + ' ("' + ix.stages[exp].label + '"). Keep the stages in order.' };
      return { status: 'ok', note: 'Stage ' + (top.i + 1) + ': ' + top.s.label + '.' };
    }
    function featuresNamed(v, ix) {
      var vk = keyWords(v), out = [];
      ix.features.forEach(function (fe) {
        var words = fe.key.split(' ');
        var strong = hasRun(vk, words), weak = !strong && words.length > 1 && words[words.length - 1].length >= 4 && vk.indexOf(words[words.length - 1]) >= 0;
        if (strong || weak) out.push({ fe: fe, strong: strong });
      });
      var anyStrong = out.some(function (x) { return x.strong; });
      out = anyStrong ? out.filter(function (x) { return x.strong; }) : out;
      /* "car park" also contains "park": keep the longer name */
      return out.filter(function (x) {
        var w = x.fe.key.split(' ');
        return !out.some(function (y) { var yw = y.fe.key.split(' '); return yw.length > w.length && hasRun(yw, w); });
      });
    }
    function sameSpot(a, b) {
      var ax = a.f.x + a.f.w / 2, ay = a.f.y + a.f.h / 2, bx = b.f.x + b.f.w / 2, by = b.f.y + b.f.h / 2;
      return Math.abs(ax - bx) <= 1.5 && Math.abs(ay - by) <= 1.5;
    }
    function checkFeature(v, ix, role, inner) {
      var named = featuresNamed(v, ix);
      if (!named.length) return { status: 'bad', note: 'This is not a feature on the maps. Use the map labels: ' + ix.features.slice(0, 6).map(function (x) { return baseName(x.f.name); }).filter(function (n, i, a) { return a.indexOf(n) === i; }).join(', ') + '…' };
      /* several features named ("a road, and a path was added"): the best one counts */
      var bases = [];
      named.forEach(function (x) { var b = baseName(x.fe.f.name).toLowerCase(); if (bases.indexOf(b) < 0) bases.push(b); });
      if (bases.length > 1 && !inner) {
        var order = { ok: 0, near: 1, bad: 2 }, best = null;
        bases.forEach(function (b) {
          var r = checkFeature(b, ix, role, true);
          if (!best || order[r.status] < order[best.status]) best = r;
        });
        return best;
      }
      var p1 = named.filter(function (x) { return x.fe.panel === 0; }), p2 = named.filter(function (x) { return x.fe.panel === ix.panels.length - 1; });
      var nm = baseName(named[0].fe.f.name);
      function changed(x) { return /\((extended|expanded|reduced|new|enlarged|smaller)/i.test(x.fe.f.name) || /pedestrian|protected|paved/i.test(x.fe.f.note || ''); }
      if (role === 'same') {
        if (p1.length && p2.length) {
          var moved = !p1.some(function (a) { return p2.some(function (b) { return sameSpot(a.fe, b.fe); }); });
          if (moved) return { status: 'near', note: nm + ' is on both maps, but it moved. Choose a feature that stayed in the same place.' };
          if (p2.some(changed)) return { status: 'near', note: nm + ' changed: "' + p2.filter(changed)[0].fe.f.name + '". Choose one that stayed the same.' };
          return { status: 'ok', note: nm + ' is on both maps, in the same place.' };
        }
        return { status: 'bad', note: nm + ' is only on the ' + (p1.length ? 'first' : 'second') + ' map, so it did not stay the same.' };
      }
      if (role === 'gone' || role === 'old') {
        if (!p1.length) return { status: 'bad', note: nm + ' is not on the first map (' + ix.panels[0].title + '), so it cannot have been ' + (role === 'gone' ? 'removed' : 'converted') + '.' };
        if (role === 'gone' && p2.length && p1.some(function (a) { return p2.some(function (b) { return sameSpot(a.fe, b.fe) && !changed(b); }); })) return { status: 'near', note: nm + ' is still there on the second map.' };
        return { status: 'ok', note: nm + ' is on the first map' + (role === 'gone' && !p2.length ? ' and gone from the second.' : '.') };
      }
      if (role === 'new') {
        if (!p2.length) return { status: 'bad', note: nm + ' is not on the second map (' + ix.panels[ix.panels.length - 1].title + ').' };
        if (p1.length && p1.some(function (a) { return p2.some(function (b) { return sameSpot(a.fe, b.fe) && !changed(b); }); })) return { status: 'near', note: nm + ' was already there on the first map.' };
        return { status: 'ok', note: nm + ' is new on the second map.' };
      }
      return { status: 'ok', note: 'Matches ' + nm + '.' };
    }
    function regionOf(fe) {
      var f = fe.f, cx = (f.x + f.w / 2) / fe.w, cy = (f.y + f.h / 2) / fe.h, r = {};
      if (cy < 0.4) r.north = 1; if (cy > 0.6) r.south = 1; if (cx < 0.4) r.west = 1; if (cx > 0.6) r.east = 1;
      if (cx >= 0.25 && cx <= 0.75 && cy >= 0.25 && cy <= 0.75) r.centre = 1;
      if (f.w / fe.w > 0.8) { delete r.west; delete r.east; r.wide = 1; }
      if (f.h / fe.h > 0.8) { delete r.north; delete r.south; r.tall = 1; }
      return r;
    }
    function dirsSaid(v) {
      var out = {}, m, re = new RegExp(COMPASS.source, 'gi');
      while ((m = re.exec(v))) {
        var w = m[0].toLowerCase().replace(/[\s-]/g, '');
        if (/^(centre|center|central|middle)$/.test(w)) out.centre = 1;
        ['north', 'south', 'east', 'west'].forEach(function (d) { if (w.indexOf(d) >= 0) out[d] = 1; });
      }
      return out;
    }
    function checkCompass(v, ix, def, ctx) {
      var said = dirsSaid(v), keys = Object.keys(said);
      if (!keys.length) return RELATIVE_PLACE.test(v) ? { status: 'near', note: 'Good, a place word. Add a compass point too: in the north, to the south-east of …' } : { status: 'bad', note: 'Say where on the map: north, south, east, west or the centre.' };
      var c = def.check || {}, fv = ctx && ctx.vars && c.of ? ctx.vars[c.of] : '';
      if (!fv) return { status: 'ok', note: 'A compass point.' };
      var named = featuresNamed(fv, ix), panel = c.panel === 'first' ? 0 : ix.panels.length - 1;
      var fe = (named.filter(function (x) { return x.fe.panel === panel; })[0] || named[0] || {}).fe;
      if (!fe) return { status: 'ok', note: 'A compass point.' };
      var r = regionOf(fe), nm = baseName(fe.f.name);
      var wrong = keys.filter(function (d) { return !r[d]; });
      var where = Object.keys(r).filter(function (k) { return k !== 'wide' && k !== 'tall'; });
      if (!wrong.length) return { status: 'ok', note: nm + ' is in the ' + keys.join('-') + ' of the map.' };
      var opp = { north: 'south', south: 'north', east: 'west', west: 'east' };
      if (wrong.some(function (d) { return r[opp[d]]; }) || (wrong.length === keys.length && where.length && !(said.centre && r.centre))) return { status: 'bad', note: 'Look at the compass: ' + nm + ' is in the ' + (where.join('-').replace('north-west', 'north-west') || 'middle') + ' of the map, not the ' + keys.join('-') + '.' };
      return { status: 'near', note: nm + ' is ' + (where.length ? 'in the ' + where.join(' / ') : 'across the map') + '. Check the compass point.' };
    }
    function checkClause(v, ix, plan) {
      var named = featuresNamed(v, ix);
      var verb = String(v).match(CHANGE_VERB);
      if (!named.length) return { status: 'bad', note: 'Name the map feature that changed.' };
      if (!verb) return { status: 'near', note: 'Use a change verb: was extended, was demolished, was converted into…' };
      var nm = baseName(named[0].fe.f.name);
      var p2 = named.filter(function (x) { return x.fe.panel === ix.panels.length - 1; });
      var grew = p2.filter(function (x) { return /\((extended|expanded|enlarged)/i.test(x.fe.f.name); }), shrank = p2.filter(function (x) { return /\((reduced|smaller)/i.test(x.fe.f.name); });
      if (/extend|expand|enlarg|widen|lengthen/i.test(verb[0]) && !grew.length && shrank.length) return { status: 'bad', note: baseName(shrank[0].fe.f.name) + ' was reduced on the second map, not extended.' };
      if (/reduc|shr|smaller|cut down/i.test(verb[0]) && !shrank.length && grew.length) return { status: 'bad', note: baseName(grew[0].fe.f.name) + ' was made bigger on the second map, not smaller.' };
      if (!/\b(was|were|has been|have been|had been|will be|is to be|are to be|is planned|are planned)\b/i.test(v)) return { status: 'near', note: 'Use the passive for a change on a map: "was extended", "has been built", "will be converted".' };
      return { status: 'ok', note: nm + ': "' + verb[0] + '".' };
    }

    /* ===================================================== DERIVE
       An automatic population for every variable of a mode, built only
       from the prompt's data. It proves each variable can be filled for
       every chart in the bank (tools/lab-validate.js) and feeds the "try
       another chart" test drive. The wording is plain on purpose.       */
    function article(name) {
      var n = String(name), k = lower(n);
      if (/^(the|a|an)\b/.test(k) || /^\d/.test(n) || /^(under|over)\b/i.test(n)) return n;
      if (/^[A-Z]/.test(n) && !/\b(museum|gallery|school|market|garden|park|station|club)\b/i.test(n)) return n;
      return 'the ' + (/^[A-Z][a-z]/.test(n) && !/\b(Museum|Gallery|School)\b/.test(n) ? n.charAt(0).toLowerCase() + n.slice(1) : n);
    }
    function joinNames(names) {
      names = names.map(article);
      if (names.length <= 1) return names.join('');
      return names.slice(0, -1).join(', ') + ' and ' + names[names.length - 1];
    }
    function unitWords(c) {
      var u = c.unit || {}, v = c.v;
      if (u.pct) return fmtNum(v) + '%';
      if (u.money) return '$' + fmtNum(v);
      if (u.mult === 1e3) return fmtNum(v) + ' thousand';
      if (u.mult === 1e6) return fmtNum(v) + ' million';
      if (u.mult === 1e9) return fmtNum(v) + ' billion';
      return fmtNum(v);
    }
    function visualName(p) {
      function one(t, d) { return t === 'pie' ? (d && d.charts && d.charts.length > 1 ? 'pie charts' : 'pie chart') : t === 'line' ? 'line graph' : t === 'bar' ? 'bar chart' : t === 'table' ? 'table' : t === 'process' ? 'diagram' : 'maps'; }
      if (p.type === 'mixed') return p.data.parts.map(function (x) { return one(x.type, x.data); }).join(' and ');
      return one(p.type, p.data);
    }
    function whatOf(p) {
      var r = String(p.rubric || '').replace(/^the\s+[\w\s,-]*?\b(shows?|illustrates?|compares?|gives?|presents?)\s+/i, '').replace(/\.$/, '');
      r = r.replace(/,? and the [\w\s]+? shows?.*$/i, '').replace(/\s+(between|from)\s+(18|19|20)\d\d\s+(and|to)\s+(18|19|20)\d\d.*$/i, '').replace(/,? with projections.*$/i, '').replace(/\s+in\s+(18|19|20)\d\d(\s+and\s+(in\s+)?(18|19|20)\d\d)?$/i, '');
      r = r.replace(/^how\b/i, 'the way').replace(/^the number of\b/i, 'how many').replace(/^the percentage of\b/i, 'the proportion of');
      if (p.units && !/%|thousand|million|dollar|hours|tonnes|cups/i.test(r)) r += ' (' + p.units + ')';
      if (/thousand/i.test(p.units || '') && !/thousand/i.test(r)) r += ', in thousands';
      return r;
    }
    function groupNames(p, gi) {
      var g = (p.groupings || [])[gi] || [];
      var ix = index(p);
      if (g.length && g.every(isYear)) {
        var s = ix.labels.filter(function (l) { return l.kind === 'series'; })[0];
        return (s ? article(s.name) + ' ' : 'the figures ') + 'between ' + g[0] + ' and ' + g[g.length - 1];
      }
      if (p.type === 'process') return '';
      return joinNames(g);
    }
    function cellFor(p, names, x) {
      var ix = index(p), keys = namesIn(names, ix).map(function (l) { return l.key; });
      var cs = ix.cells.filter(function (c) { return keys.indexOf(labelKey(c.s)) >= 0 || keys.indexOf(labelKey(String(c.x))) >= 0; });
      if (!cs.length) {
        var ys = yearsIn(names, ix);
        if (ys.length >= 2) cs = ix.cells.filter(function (c) { return +c.x >= Math.min.apply(null, ys) && +c.x <= Math.max.apply(null, ys); });
      }
      if (x != null) { var at = cs.filter(function (c) { return String(c.x) === String(x); }); if (at.length) cs = at; }
      return cs[0] || ix.cells[0];
    }
    function moveWord(p, names, projected) {
      var ix = index(p), cats = namesIn(names, ix), ys = yearsIn(names, ix);
      var d = direction(ix, cats, ys.length >= 2 && !cats.filter(function (l) { return l.kind !== 'series'; }).length ? [Math.min.apply(null, ys), Math.max.apply(null, ys)] : null);
      if (!d) return 'changed over the period';
      return d.dir === 'up' ? 'rose over the period' : d.dir === 'down' ? 'fell over the period' : d.dir === 'flat' ? 'stayed fairly stable' : 'moved in different directions';
    }
    function derive(p, mode) {
      var ix = index(p), v = {}, g = p.groupings || [];
      mode = mode || p.mode;
      if (mode === 'TREND') {
        var y1 = ix.yearMin, y2 = ix.projectedFrom || ix.yearMax;
        v.visual = visualName(p); v.what = whatOf(p); v.y1 = String(y1); v.y2 = String(y2);
        v.groupA = groupNames(p, 0); v.groupB = groupNames(p, 1);
        v.moveA = moveWord(p, v.groupA); v.moveB = moveWord(p, v.groupB);
        var last = ix.cells.filter(function (c) { return String(c.x) === String(y2); }).sort(function (a, b) { return b.abs - a.abs; })[0];
        v.feature = last ? article(last.s) + ' had the highest figure in ' + y2 : 'the two groups moved in different ways';
        var a1 = cellFor(p, v.groupA, y1), a2 = cellFor(p, v.groupA, y2), b1 = cellFor(p, v.groupB, y1), b2 = cellFor(p, v.groupB, y2);
        v.figA1 = unitWords(a1) + (isYear(a1.x) && String(a1.x) !== String(y1) ? ' in ' + a1.x : ''); v.figA2 = unitWords(a2) + ' in ' + a2.x; v.figB1 = unitWords(b1) + (isYear(b1.x) && String(b1.x) !== String(y1) ? ' in ' + b1.x : ''); v.figB2 = unitWords(b2) + ' in ' + b2.x;
        if (!isYear(a2.x)) v.figA2 = unitWords(a2); if (!isYear(b2.x)) v.figB2 = unitWords(b2);
      } else if (mode === 'COMPARE') {
        var part = ix.parts[0], cells = part.cells.filter(function (c) { return (c.unit || {}).text === (part.cells[0].unit || {}).text; });
        var firstS = cells[0].s, firstX = cells[0].x;
        var byS = cells.filter(function (c) { return c.s === firstS; }), byX = cells.filter(function (c) { return String(c.x) === String(firstX); });
        var line = byS.length >= byX.length ? byS : byX, key = line === byS ? 'x' : 's';
        line = line.slice().sort(function (a, b) { return b.v - a.v; });
        var top = line[0], bot = line[line.length - 1];
        v.visual = visualName(p); v.what = whatOf(p);
        v.top = article(String(top[key])); v.bottom = article(String(bot[key]));
        v.groupA = groupNames(p, 0); v.groupB = groupNames(p, 1);
        v.contrast = 'the figures for ' + v.groupA + ' were generally higher than those for ' + v.groupB;
        v.topFig = unitWords(top) + (key === 'x' && byS.length > 1 && ix.cells.length > byS.length ? ' for ' + article(top.s) : ''); v.bottomFig = unitWords(bot);
        var fa = cellFor(p, v.groupA), fb = cellFor(p, v.groupB);
        v.figA = unitWords(fa); v.figB = unitWords(fb);
        var ex = cellFor(p, joinNames([g[1] ? g[1][g[1].length - 1] : String(bot[key])]));
        v.exception = article(String(g[1] ? g[1][g[1].length - 1] : bot[key])) + ', at ' + unitWords(ex);
        /* keep the group's mean order honest: swap the contrast when B is higher */
        var mean = function (names) { var cs = ix.cells.filter(function (c) { var ks = namesIn(names, ix).map(function (l) { return l.key; }); return ks.indexOf(labelKey(c.s)) >= 0 || ks.indexOf(labelKey(String(c.x))) >= 0; }); return cs.reduce(function (s, c) { return s + c.abs; }, 0) / Math.max(1, cs.length); };
        if (mean(v.groupB) > mean(v.groupA)) v.contrast = 'the figures for ' + v.groupB + ' were generally higher than those for ' + v.groupA;
      } else if (mode === 'SEQUENCE') {
        var st = ix.stages, S = st.length;
        v.visual = 'diagram'; v.product = String(p.rubric || '').replace(/^the diagram (shows|illustrates)\s+/i, '').replace(/\.$/, '');
        v.count = String(S); v.shape = (p.data.shape || 'linear');
        v.start = article(st[0].label.toLowerCase()); v.end = article(st[S - 1].label.toLowerCase());
        v.mid = article(st[Math.floor((S - 1) / 2)].label.toLowerCase());
        for (var k = 1; k <= 6; k++) {
          var i = Math.round((k - 1) * (S - 1) / 5);
          v['st' + k] = 'the ' + st[i].label.toLowerCase() + ' stage follows: ' + String(st[i].detail || st[i].label).replace(/[;→]/g, ',');
        }
      } else if (mode === 'SPACE') {
        var pn = ix.panels, A = 0, B = pn.length - 1;
        var f1 = ix.features.filter(function (x) { return x.panel === A; }), f2 = ix.features.filter(function (x) { return x.panel === B; });
        var keys2 = f2.map(function (x) { return x.key; }), keys1 = f1.map(function (x) { return x.key; });
        var same = f1.filter(function (a) { return f2.some(function (b) { return b.key === a.key && sameSpot(a, b) && !/\(/.test(b.f.name); }); })[0];
        var gone = f1.filter(function (a) { return keys2.indexOf(a.key) < 0; });
        var fresh = f2.filter(function (b) { return keys1.indexOf(b.key) < 0; });
        var grown = f2.filter(function (b) { return /\((extended|expanded)/i.test(b.f.name); })[0] || f2.filter(function (b) { return /\(reduced/i.test(b.f.name); })[0];
        var conv = null;
        gone.forEach(function (a) { if (conv) return; var b = fresh.filter(function (b) { return sameSpot(a, b); })[0]; if (b) conv = [a, b]; });
        var plan = !isYear(pn[B].title) && /plan/i.test(pn[B].title);
        function nm(x) { return article(baseName(x.f.name).toLowerCase()); }
        v.place = whatOf(p).replace(/^the way\b/, 'how'); v.y1 = isYear(pn[A].title) ? pn[A].title : 'now'; v.y2 = isYear(pn[B].title) ? pn[B].title : 'in the future plan';
        v.change = plan ? 'will become more developed' : 'became much more developed';
        v.same = same ? nm(same) : nm(f1[0]);
        var goneOne = gone.filter(function (a) { return !conv || a !== conv[0]; })[0] || gone[0];
        v.gone = goneOne ? nm(goneOne) : nm(f1[0]);
        var r1 = goneOne ? regionOf(goneOne) : {};
        v.where1 = Object.keys(r1).filter(function (k) { return /north|south|east|west|centre/.test(k); }).join('-') || 'centre';
        var newOnes = fresh.filter(function (b) { return !conv || b !== conv[1]; });
        v.newA = newOnes[0] ? nm(newOnes[0]) : nm(f2[0]); v.newB = newOnes[1] ? nm(newOnes[1]) : v.newA;
        var r2 = newOnes[1] ? regionOf(newOnes[1]) : newOnes[0] ? regionOf(newOnes[0]) : {};
        v.where2 = Object.keys(r2).filter(function (k) { return /north|south|east|west|centre/.test(k); }).join('-') || 'centre';
        v.extended = grown ? nm(grown).replace(/^./, function (c) { return c.toUpperCase(); }) + (plan ? ' will be ' : ' was ') + (/reduced/i.test(grown.f.name) ? 'reduced in size' : 'extended') : nm(f2[0]) + (plan ? ' will be' : ' was') + ' added';
        v.converted = conv ? nm(conv[0]) : v.gone; v.into = conv ? nm(conv[1]) : v.newA;
      }
      return v;
    }

    /* Can a page of this mode be cast on this chart? A single plan (one map)
       shows a layout, not changes, so a SPACE change page does not fit it. */
    function fits(p, mode) {
      mode = mode || (p && p.mode);
      if (!p || p.mode !== mode) return { ok: false, why: 'This chart is ' + (p ? p.mode : '?') + ', not ' + mode + '.' };
      if (mode === 'SPACE' && p.type === 'map' && (p.data.panels || []).length < 2) return { ok: false, why: 'One map only: it shows a layout, not changes, so a change page does not fit. Describe it in the Scriptorium (zones, compass points, what is next to what).' };
      return { ok: true, why: '' };
    }
    return { index: index, check: check, numbers: numbers, derive: derive, fits: fits, labelsIn: labelsIn, namesIn: namesIn, labelKey: labelKey, keyWords: keyWords,
      direction: direction, longestRun: longestRun, fmtNum: fmtNum, cellText: cellText, baseName: baseName, regionOf: regionOf, isYear: isYear };
  })();

  /* ===================================================================
     THE SPELLBOOK STORE (written by the Workshop, lab.js)
     =================================================================== */
  function storeKey(id) { return 'cc.lab.v1.' + String(id || 'anon').toLowerCase(); }
  function load(studentId) {
    try { var d = JSON.parse(localStorage.getItem(storeKey(studentId))); if (d && d.templates) { d.attempts = d.attempts || []; d.dirty = d.dirty || {}; d.inUse = d.inUse || {}; return d; } } catch (e) {}
    return { templates: [], attempts: [], dirty: {}, inUse: {} };
  }
  function save(studentId, data) { try { localStorage.setItem(storeKey(studentId), JSON.stringify(data)); } catch (e) {} }
  function pageFor(data, mode) {
    var done = (data.templates || []).filter(function (t) { return t.mode === mode && t.status === 'complete'; })
      .sort(function (a, b) { return String(b.updatedAt).localeCompare(String(a.updatedAt)); });
    var use = (data.inUse || {})[mode];
    return done.filter(function (t) { return t.id === use; })[0] || done[0] || null;
  }

  function tokens(text) { var m = String(text || '').match(/\{(\w+)\}/g) || []; return m.map(function (x) { return x.slice(1, -1); }); }
  function tidy(s) { return String(s).replace(/\.\s*\./g, '.').replace(/,\s*,/g, ',').replace(/[ \t]+/g, ' ').replace(/\s+([.,;:])/g, '$1').replace(/ *\n */g, '\n').trim(); }
  function labels(mode) { var LC = L(); return LC && LC.MODES[mode] ? LC.MODES[mode].SLOT_LABEL : {}; }

  /* The frames of a student's page for one mode, for the Scriptorium. */
  function framesFor(p, mode) {
    var LC = L(); if (!p || !LC || !LC.MODES[mode]) return null;
    var t = pageFor(load(p.studentId), mode); if (!t) return null;
    var m = LC.MODES[mode], seen = {}, slots = [];
    var paragraphs = LC.PARAS.map(function (pg) {
      return m.lines.filter(function (c) { return c.para === pg.key; }).map(function (c) { return ((t.lines[c.id] || {}).text || '').trim(); }).filter(Boolean).join(' ');
    });
    paragraphs.forEach(function (tx) { tokens(tx).forEach(function (k) { if (!seen[k] && m.VAR[k]) { seen[k] = 1; slots.push({ id: k, label: m.SLOT_LABEL[k], shape: m.VAR[k].shape, job: m.VAR[k].job }); } }); });
    return { mode: mode, name: t.name, pct: t.pct, level: t.level, version: t.version || 1, templateId: t.id, paraKeys: LC.PARAS.map(function (pg) { return pg.key; }), paragraphs: paragraphs, slots: slots };
  }
  /* Fill frames with values. fill(frames, {key: 'text' | {text, text2}}) → report
     text; fill('frame text', values, {html:true, labels}) → one filled string. */
  function fillText(text, values, opts, seen) {
    opts = opts || {}; values = values || {}; seen = seen || {};
    var lab = opts.labels || {};
    return String(text || '').replace(/\{(\w+)\}/g, function (m, k, offset, whole) {
      var v = values[k], n = seen[k] || 0; seen[k] = n + 1;
      if (v && typeof v === 'object') v = n > 0 && v.text2 ? v.text2 : v.text;
      if (v) {
        v = String(v).trim().replace(/[.;:,]+$/, '');
        var before = whole.slice(0, offset).replace(/\s+$/, '');
        var starts = !before || /[.!?]$/.test(before);
        if (starts && /^[a-z]/.test(v)) v = v.charAt(0).toUpperCase() + v.slice(1);
        if (!starts && /^(The|A|An|It|They|This|These)\s/.test(v)) v = v.charAt(0).toLowerCase() + v.slice(1);
        return opts.html ? '<span class="slot filled">' + esc(v) + '</span>' : v;
      }
      return opts.html ? '<span class="slot">[' + esc(lab[k] || k) + ']</span>' : '[' + (lab[k] || k) + ']';
    });
  }
  function fill(frames, values, opts) {
    if (typeof frames === 'string') return fillText(frames, values, opts);
    if (!frames || !frames.paragraphs) return '';
    var seen = {};
    return frames.paragraphs.map(function (tx) { return tidy(fillText(tx, values, extend2({ labels: labels(frames.mode) }, opts), seen)); }).filter(Boolean).join('\n\n');
  }
  function extend2(a, b) { Object.keys(b || {}).forEach(function (k) { a[k] = b[k]; }); return a; }

  /* ===================================================================
     MY SPELLBOOK — the student's four pages
     =================================================================== */
  var FADE = [
    { id: 'guided', name: 'Guided', blurb: 'Your whole page, with its slots.' },
    { id: 'skeleton', name: 'Skeleton', blurb: 'Only the slots and how many words go around them. Can you say each line?' },
    { id: 'exam', name: 'Exam', blurb: 'A blank page. Write it from memory, then check.' }
  ];
  var view = { fade: 'guided', recall: {} };
  function words(s) { var m = String(s || '').match(/[A-Za-z0-9]+(?:['’\-][A-Za-z0-9]+)*/g); return m ? m.length : 0; }
  function chips(mode, tok) { var lab = labels(mode); return esc(tok).replace(/\{(\w+)\}/g, function (m, k) { return '<span class="slot">[' + esc(lab[k] || k) + ']</span>'; }); }
  function skeleton(mode, tok) {
    var lab = labels(mode), parts = String(tok).split(/(\{\w+\})/), out = [];
    parts.forEach(function (part) {
      var k = part.match(/^\{(\w+)\}$/);
      if (k) out.push('<span class="slot">[' + esc(lab[k[1]] || k[1]) + ']</span>');
      else { var n = words(part); if (n) out.push('<span class="tpl-gap" title="' + n + ' words">' + new Array(Math.min(n, 12) + 1).join('▁ ') + '</span>'); }
    });
    return out.join(' ');
  }
  function recallScore(page, typed, mode) {
    var LC = L(), m = LC.MODES[mode];
    var want = m.lines.map(function (c) { return ((page.lines[c.id] || {}).text || '').replace(/\{\w+\}/g, ' '); }).join(' ');
    var w = String(want).toLowerCase().match(/[a-z']+/g) || [], got = String(typed).toLowerCase().replace(/\[[^\]]*\]/g, ' ').match(/[a-z']+/g) || [];
    var bag = {}; got.forEach(function (x) { bag[x] = (bag[x] || 0) + 1; });
    var hit = 0; w.forEach(function (x) { if (bag[x]) { bag[x]--; hit++; } });
    return w.length ? hit / w.length : 0;
  }
  function mount(el, host) {
    var LC = L(), p = host && host.p;
    if (!el) return;
    if (!LC || !p) { el.innerHTML = '<p class="tiny">My Spellbook is not available.</p>'; return; }
    var data = load(p.studentId);
    var html = '<div class="tpl-book"><div class="sect-h"><div><h2>My Spellbook</h2><p>Your four pages, one for each mode. Learn them by heart: in the exam you write your page from memory and fill every [slot] from the chart. Build or change a page in the Spellbook Workshop.</p></div></div>' +
      '<div class="tpl-bar"><div class="filters" role="group" aria-label="How much of the page to show">' + FADE.map(function (f) { return '<button data-fade="' + f.id + '"' + (view.fade === f.id ? ' class="on"' : '') + '>' + f.name + '</button>'; }).join('') + '</div>' +
      '<div class="tpl-acts"><button class="btn sm" id="tpl-print">Print my spellbook</button><button class="btn sm primary" id="tpl-lab">Spellbook Workshop →</button></div></div>' +
      '<p class="tiny tpl-fadenote">' + esc(FADE.filter(function (f) { return f.id === view.fade; })[0].blurb) + '</p><div class="tpl-pages">';
    LC.MODE_ORDER.forEach(function (mode) {
      var m = LC.MODES[mode], page = pageFor(data, mode);
      var all = (data.templates || []).filter(function (t) { return t.mode === mode && t.status === 'complete'; });
      html += '<section class="card tpl-page' + (page ? '' : ' empty') + '" data-mode="' + mode + '"><div class="tpl-page-h"><span class="pill on">' + mode + '</span><b>' + esc(page ? page.name : m.page) + '</b>' +
        (page ? '<span class="tiny">v' + (page.version || 1) + ' · ' + page.pct + '% · ' + esc(page.level) + '</span>' : '') + '</div>';
      if (!page) {
        html += '<p class="tiny">' + esc(m.blurb) + '</p><p>No ' + mode + ' page yet.</p><button class="btn sm" data-design="' + mode + '">Design it in the Workshop</button>';
      } else {
        if (all.length > 1) html += '<label class="tiny tpl-pick">Page in use <select data-inuse="' + mode + '">' + all.map(function (t) { return '<option value="' + t.id + '"' + (t.id === page.id ? ' selected' : '') + '>' + esc(t.name) + ' · v' + (t.version || 1) + ' · ' + t.pct + '%</option>'; }).join('') + '</select></label>';
        if (view.fade === 'exam') {
          html += '<p class="tiny">' + LC.PARAS.map(function (pg) { return pg.short; }).join(' · ') + ' · slots: ' + m.vars.map(function (v) { return '[' + esc(v.label) + ']'; }).join(' ') + '</p>' +
            '<label class="sr" for="tpl-rc-' + mode + '">Write your ' + mode + ' page from memory</label><textarea class="tpl-recall" id="tpl-rc-' + mode + '" rows="7" placeholder="Write your ' + mode + ' page from memory, with the [slots]…">' + esc(view.recall[mode] || '') + '</textarea>' +
            '<div class="lab-acts"><button class="btn sm" data-rcheck="' + mode + '">Check my memory</button><span class="tiny" id="tpl-rs-' + mode + '"></span></div><div class="tpl-reveal" id="tpl-rv-' + mode + '"></div>';
        } else {
          html += LC.PARAS.map(function (pg) {
            var ls = m.lines.filter(function (c) { return c.para === pg.key; }).map(function (c) { return ((page.lines[c.id] || {}).text || ''); }).filter(Boolean);
            return '<div class="tpl-para"><span class="kicker">' + esc(pg.name) + '</span><p>' + ls.map(function (tx) { return view.fade === 'skeleton' ? skeleton(mode, tx) : chips(mode, tx); }).join(' ') + '</p></div>';
          }).join('');
        }
      }
      html += '</section>';
    });
    html += '</div><p class="tiny tpl-foot">A page is scaffolding, not an answer: every slot is filled from the chart in front of you, and the overview never carries a figure.</p></div>';
    el.innerHTML = html;
    function $q(s) { return el.querySelector(s); }
    Array.prototype.forEach.call(el.querySelectorAll('[data-fade]'), function (b) { b.addEventListener('click', function () { view.fade = b.getAttribute('data-fade'); mount(el, host); }); });
    Array.prototype.forEach.call(el.querySelectorAll('[data-design]'), function (b) { b.addEventListener('click', function () { if (host.show) host.show('lab'); }); });
    Array.prototype.forEach.call(el.querySelectorAll('[data-inuse]'), function (sel) { sel.addEventListener('change', function () { var d = load(p.studentId); d.inUse[sel.getAttribute('data-inuse')] = sel.value; save(p.studentId, d); mount(el, host); }); });
    Array.prototype.forEach.call(el.querySelectorAll('.tpl-recall'), function (ta) { ta.addEventListener('input', function () { view.recall[ta.id.replace('tpl-rc-', '')] = ta.value; }); });
    Array.prototype.forEach.call(el.querySelectorAll('[data-rcheck]'), function (b) { b.addEventListener('click', function () {
      var mode = b.getAttribute('data-rcheck'), page = pageFor(load(p.studentId), mode), ta = $q('#tpl-rc-' + mode);
      var sc = recallScore(page, ta.value, mode), m = LC.MODES[mode];
      $q('#tpl-rs-' + mode).textContent = Math.round(sc * 100) + '% of your page words recalled' + (sc >= 0.9 ? ': ready for the exam.' : sc >= 0.6 ? ': nearly there.' : ': read it again, then try.');
      $q('#tpl-rv-' + mode).innerHTML = LC.PARAS.map(function (pg) { return '<p><span class="kicker">' + esc(pg.short) + '</span> ' + m.lines.filter(function (c) { return c.para === pg.key; }).map(function (c) { return chips(mode, (page.lines[c.id] || {}).text || ''); }).join(' ') + '</p>'; }).join('');
    }); });
    var pr = $q('#tpl-print'); if (pr) pr.addEventListener('click', function () { var old = view.fade; if (old === 'exam') { view.fade = 'guided'; mount(el, host); } document.body.classList.add('tpl-printing'); try { window.print(); } catch (e) {} document.body.classList.remove('tpl-printing'); if (old === 'exam') { view.fade = old; mount(el, host); } });
    var lb = $q('#tpl-lab'); if (lb) lb.addEventListener('click', function () { if (host.show) host.show('lab'); });
  }

  global.Template = { Data: Data, mount: mount, framesFor: framesFor, fill: fill, tokens: tokens, tidy: tidy, labels: labels, load: load, save: save, pageFor: pageFor, FADE: FADE, esc: esc, _recallScore: recallScore };
})(window);
