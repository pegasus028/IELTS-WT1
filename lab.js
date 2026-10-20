/* ===========================================================================
   QUILLMOOR ACADEMY · THE OBSERVATORY (Chart Control, Task 1) — lab.js
   The Spellbook Workshop: a student builds her own Task 1 spellbook, one
   page per mode (TREND · COMPARE · SEQUENCE · SPACE), line by line in her
   own words (Design), fills its variables from real charts in the bank and
   has every figure, year and name checked against the chart's data (Cast it
   on a chart), and follows her results by mode and template share
   (Spellbook record). The Examples tab shows two AI-simulated students.

   The data check is rule-based and runs offline (template.js
   Template.Data). AI coaching and the band estimate come from Lab.gs
   (Claude through Apps Script) when the class server has a key; without
   it the quick checks still run and the work is kept on this device.

   Mounted by student.js:  Lab.mount(sectionElement, window.PCHost)
   Story gates:            Lab.designed(p, 'TREND') → true once a complete
                           TREND page is saved.
   Plain ES5, like the rest of the app.
   =========================================================================== */
(function (global) {
  'use strict';

  var L = global.LabContent, C = global.CONTENT, T = global.Template, D = global.Template.Data, S = global.LabScenario || null;
  var host = null, root = null;

  /* Register the Workshop keepsakes with the app's badge list once. */
  if (C && C.BADGES) L.BADGES.forEach(function (b) {
    if (!C.BADGES.some(function (x) { return x.id === b.id; })) C.BADGES.push(b);
  });

  var MAX_TRIES = 3;
  var TIMEOUT_COACH = 45000, TIMEOUT_RATE = 60000, TIMEOUT_SAVE = 20000;
  var MODE_NAME = { TREND: 'TREND', COMPARE: 'COMPARE', SEQUENCE: 'SEQUENCE', SPACE: 'SPACE' };

  /* ================================================================ state */
  var st = {
    tab: 'studio', view: 'home',
    sid: null, data: null, synced: false,
    ai: null, aiNote: '',
    setup: null, build: null, run: null, review: null,
    asmTemplate: null, asmTiming: 'none', asmPrompt: null,
    showOtherTier: false, showSample: false, showVarEg: false, highlightFrame: true,
    drive: { open: true, src: 'scenario', chart: false },
    ex: { student: 'nam', mode: 'TREND' }
  };

  /* ============================================================== helpers */
  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function $(sel) { return root ? root.querySelector(sel) : null; }
  function $$(sel) { return root ? Array.prototype.slice.call(root.querySelectorAll(sel)) : []; }
  function uid(pre) { return pre + Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }
  function nowIso() { return new Date().toISOString(); }
  function clone(o) { return JSON.parse(JSON.stringify(o)); }
  function extend(a, b) { Object.keys(b || {}).forEach(function (k) { a[k] = b[k]; }); return a; }
  function fmtDate(iso) { try { var d = new Date(iso); return d.toLocaleDateString(undefined, { day: 'numeric', month: 'short' }) + ' ' + d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }); } catch (e) { return ''; } }
  function mmss(sec) { sec = Math.max(0, Math.round(sec)); var m = Math.floor(sec / 60), s = sec % 60; return m + ':' + (s < 10 ? '0' : '') + s; }
  function fmtBand(b) { return (b == null || isNaN(b)) ? '—' : (Math.round(b * 2) / 2).toFixed(1); }
  function pctStr(x) { return Math.round((x || 0) * 100) + '%'; }
  function levelInfo(id) { var f = function (x) { return L.LEVELS.filter(function (l) { return l.id === x; })[0]; }; return f(id) || f('B2') || L.LEVELS[0]; }
  function cefrIdx(c) { return L.CEFR_ORDER.indexOf(String(c || '').toUpperCase().replace(/[^ABC12]/g, '').slice(0, 2)); }
  function sign(n, digits) { var v = digits ? n.toFixed(digits) : String(Math.round(n)); return (n > 0 ? '+' : n < 0 ? '−' : '±') + v.replace('-', ''); }
  function M(mode) { return L.MODES[mode] || L.MODES.TREND; }
  function lineById(mode, id) { return M(mode).lines.filter(function (c) { return c.id === id; })[0]; }
  function paraName(key) { return (L.PARAS.filter(function (p) { return p.key === key; })[0] || {}).name || key; }
  /* IELTS rounding: the mean of the four criteria to the nearest half band, .25 and .75 rounding up. */
  function overallBand(b) {
    var v = [b.ta, b.cc, b.lr, b.gra].map(Number);
    if (v.some(function (x) { return isNaN(x); })) return null;
    var m = (v[0] + v[1] + v[2] + v[3]) / 4;
    return Math.floor(m * 2 + 0.5 + 1e-9) / 2;
  }
  function promptById(id) { return (global.Charts && global.Charts.prompt) ? global.Charts.prompt(id) : (C.PROMPTS || []).filter(function (p) { return p.id === id; })[0] || null; }
  function promptsOf(mode) { return (C.PROMPTS || []).filter(function (p) { return p.mode === mode; }); }
  function typeName(t) { return { line: 'Line graph', bar: 'Bar chart', pie: 'Pie chart', table: 'Table', process: 'Process', map: 'Map', mixed: 'Two visuals' }[t] || t; }

  /* ---------------------------------------------------------- word maths */
  function words(s) { var m = String(s || '').match(/[A-Za-z0-9À-ɏ$£%]+(?:[.,'’\-–][A-Za-z0-9À-ɏ%]+)*/g); return m ? m.length : 0; }
  function frameText(line) { return String(line || '').replace(/\{\w+\}/g, ' '); }
  function frameWords(line) { return words(frameText(line)); }
  function normWords(s) { return String(s || '').toLowerCase().replace(/’/g, "'").replace(/[^a-z0-9' ]+/g, ' ').split(/\s+/).filter(Boolean); }
  function zeros(n) { var a = []; for (var i = 0; i < n; i++) a.push(0); return a; }
  function longestRun(a, b) {
    var x = normWords(a), y = normWords(b), best = 0, prev = zeros(y.length + 1);
    for (var i = 1; i <= x.length; i++) {
      var cur = zeros(y.length + 1);
      for (var j = 1; j <= y.length; j++) if (x[i - 1] === y[j - 1]) { cur[j] = prev[j - 1] + 1; if (cur[j] > best) best = cur[j]; }
      prev = cur;
    }
    return best;
  }
  /* Longest shared run, counted in real words (the slot placeholders do not count). */
  function realRun(a, b) {
    var x = normWords(a), y = normWords(b), best = 0, prev = zeros(y.length + 1), prevR = zeros(y.length + 1);
    for (var i = 1; i <= x.length; i++) {
      var cur = zeros(y.length + 1), curR = zeros(y.length + 1);
      for (var j = 1; j <= y.length; j++) if (x[i - 1] === y[j - 1]) {
        cur[j] = prev[j - 1] + 1; curR[j] = prevR[j - 1] + (x[i - 1] === 'slotx' ? 0 : 1);
        if (curR[j] > best) best = curR[j];
      }
      prev = cur; prevR = curR;
    }
    return best;
  }
  function trigramOverlap(a, b, skipSlots) {
    function grams(s) { var w = normWords(s), g = {}; for (var i = 0; i + 2 < w.length; i++) { if (skipSlots && (w[i] === 'slotx') + (w[i + 1] === 'slotx') + (w[i + 2] === 'slotx') > 1) continue; g[w[i] + ' ' + w[i + 1] + ' ' + w[i + 2]] = 1; } return g; }
    var ga = grams(a), gb = grams(b), ka = Object.keys(ga); if (!ka.length) return 0;
    return ka.filter(function (k) { return gb[k]; }).length / ka.length;
  }
  function similarity(a, b) {
    var x = normWords(a), y = normWords(b); if (!x.length || !y.length) return 0;
    var sy = {}; y.forEach(function (w) { sy[w] = 1; });
    return x.filter(function (w) { return sy[w]; }).length / Math.max(x.length, y.length);
  }

  /* -------------------------------------------- [Slot Label] <-> {token} */
  function toTokens(mode, text) {
    var m = M(mode), unknown = [];
    var out = String(text || '').replace(/\[([^\]\n]{1,40})\]/g, function (all, name) {
      var k = m.SLOT_ALIASES[name.trim().toLowerCase().replace(/\s+/g, ' ')];
      if (k) return '{' + k + '}';
      unknown.push(name); return all;
    });
    out = out.replace(/\{(\w+)\}/g, function (all, k) { return m.SLOT_LABEL[k] ? all : (unknown.push(k), all); });
    return { text: out, unknown: unknown };
  }
  function toLabels(mode, tokText) { var m = M(mode); return String(tokText || '').replace(/\{(\w+)\}/g, function (all, k) { return m.SLOT_LABEL[k] ? '[' + m.SLOT_LABEL[k] + ']' : all; }); }
  function tokensIn(tokText) { var m = String(tokText || '').match(/\{(\w+)\}/g) || []; return m.map(function (x) { return x.slice(1, -1); }); }
  function slotChips(mode, tokText) {
    var lab = M(mode).SLOT_LABEL;
    return esc(tokText).replace(/\{(\w+)\}/g, function (all, k) { return '<span class="slot">[' + esc(lab[k] || k) + ']</span>'; });
  }

  /* Fit a value into its place: trim end punctuation, fix the first letter. */
  var LOWER_OK = /^(the|a|an|this|these|that|those|its|their|both|all|each|every|more|most|less|fewer|some|many|much|one|two|three|four|five|six|seven|eight|nine|ten|just|only|about|around|nearly|almost|over|under|roughly|approximately|how|what|which|men|women|boys|girls|people|students|teenagers|households|visitors|workers|it|they|there|in|on|at|by|from|between|rose|fell|grew|increased|decreased|declined|dropped|climbed|remained|stayed|went|changed|became|was|were|is|are|south|north|east|west|central|sap|syrup|used|collected|filtered|boiled|poured|left|packed|cars|walking|cycling)$/i;
  function fitValue(v, startsSentence) {
    v = String(v || '').trim().replace(/[.;:,]+$/, '').replace(/^["“]|["”]$/g, '');
    if (!v) return v;
    var first = v.split(/\s+/)[0].replace(/[^A-Za-z'’-]/g, '');
    if (startsSentence) return v.charAt(0).toUpperCase() + v.slice(1);
    if (/^[A-Z][a-z]/.test(first) && (LOWER_OK.test(first) || /(ing|ly|ed)$/.test(first))) return v.charAt(0).toLowerCase() + v.slice(1);
    return v;
  }
  function tidy(s) { return T.tidy(s).replace(/\s+'s\b/g, "'s"); }

  /* ------------------------------------------------- sample lines (WP18)
     lab-samples.js: one filled sample per line at A2 and B1. fillSample puts
     the values into a frame (second mention → text2), fixing the first
     letter; opts.mark highlights the slot words.                            */
  function fillSample(mode, frame, vars, opts) {
    opts = opts || {};
    var m = M(mode), seen = {}, out = '', re = /\{(\w+)\}/g, last = 0, mm;
    frame = String(frame || '');
    while ((mm = re.exec(frame))) {
      var before = frame.slice(last, mm.index); out += opts.mark ? esc(before) : before;
      var k = mm[1], n = seen[k] || 0, v = (vars || {})[k]; seen[k] = n + 1;
      var val = v && typeof v === 'object' ? (n > 0 && v.text2 ? v.text2 : v.text) : v;
      var sofar = (opts.mark ? out.replace(/<[^>]+>/g, '') : out).replace(/\s+$/, ''), starts = !sofar || /[.!?]$/.test(sofar);
      var filled = val ? fitValue(val, starts) : '[' + (m.SLOT_LABEL[k] || k) + ']';
      out += opts.mark ? '<b class="lab-own" title="' + esc('[' + (m.SLOT_LABEL[k] || k) + ']') + '">' + esc(filled) + '</b>' : filled;
      last = re.lastIndex;
    }
    var tail = frame.slice(last); out += opts.mark ? esc(tail) : tail;
    return opts.mark ? out : tidy(out);
  }
  /* The sample for one line at the student's level: A2 → A2, everyone else →
     B1 (the only levels written); never the chart named in opts.avoid. */
  function sampleFor(mode, lineId, level, avoid) {
    var SM = global.LabSamples, by = SM && SM[mode]; if (!by) return null;
    var order = level === 'A2' ? ['A2', 'B1'] : ['B1', 'A2'];
    for (var i = 0; i < order.length; i++) {
      var set = by[order[i]]; if (!set || !set.lines || !set.lines[lineId]) continue;
      if (avoid && set.chart === avoid) continue;
      var pr = promptById(set.chart);
      return { level: order[i], chart: set.chart, title: pr ? pr.title : set.chart, type: pr ? typeName(pr.type) : '', frame: set.lines[lineId], vars: set.vars,
        html: fillSample(mode, set.lines[lineId], set.vars, { mark: true }), text: fillSample(mode, set.lines[lineId], set.vars, {}) };
    }
    return null;
  }
  function sampleHtml(sm, levelAsked) {
    if (!sm) return '';
    return '<div class="lab-sample" id="lab-sample"><p class="lab-sample-t">' + sm.html + '</p>' +
      '<p class="tiny"><b>From another chart</b> (' + esc(sm.title) + (sm.type ? ' · ' + esc(sm.type) : '') + ', ' + esc(sm.level) + (levelAsked && levelAsked !== sm.level ? ' sample' : '') + '): copy the shape, not the words. The highlighted words are the slot values; in the exam they come from the chart in front of you.</p></div>';
  }

  /* Which shape a stage value needs, read off the words before the slot. */
  function shapeAt(before, prevWasSlot) {
    if (prevWasSlot) return 'vp';
    if (/\b(is|are|be|been|being|was|were)\s*$/i.test(String(before || ''))) return 'pp';
    return 'clause';
  }

  /* Assemble a report from a page and its values. vars: { key: {text, text2} }.
     opts.mark wraps the student's words in <b class="lab-own">; opts.fillWith(key,
     n, shape) supplies values (test drive); opts.gaps marks unwritten lines;
     opts.cur marks one line. */
  function assemble(mode, tpl, vars, opts) {
    opts = opts || {};
    var m = M(mode), seen = {}, paras = [], frameCount = 0, ownCount = 0;
    L.PARAS.forEach(function (pg) {
      var plain = '', html = '';
      m.lines.filter(function (c) { return c.para === pg.key; }).forEach(function (c) {
        var ln = (tpl.lines || {})[c.id] || {};
        var text = ln.text != null ? ln.text : '';
        if (opts.useDrafts && !text && ln.draft) text = toTokens(mode, ln.draft).text;
        if (opts.override && opts.override.id === c.id) text = opts.override.text;
        if (!String(text).trim()) { if (opts.gaps) html += ' <span class="lab-drive-gap">line ' + c.n + ' · not written yet</span> '; return; }
        if (plain && !/\s$/.test(plain)) plain += ' ';
        var lh = '', re = /\{(\w+)\}/g, last = 0, mm, prevSlotEnd = -1;
        while ((mm = re.exec(text))) {
          var before = text.slice(last, mm.index);
          plain += before; lh += esc(before); frameCount += words(before);
          var k = mm[1], n = seen[k] || 0; seen[k] = n + 1;
          var val;
          if (opts.fillWith) val = opts.fillWith(k, n, shapeAt(plain, prevSlotEnd === mm.index - before.length && !before.trim()));
          else { var v = vars[k] || {}; val = (n > 0 && v.text2 && String(v.text2).trim()) ? v.text2 : (v.text || ''); }
          var sofar = plain.replace(/\s+$/, ''), startsSentence = !sofar || /[.!?]$/.test(sofar);
          var filled = val ? fitValue(val, startsSentence) : '';
          if (filled) {
            ownCount += words(filled); plain += filled;
            lh += (opts.mark ? '<b class="lab-own" title="' + esc('[' + m.SLOT_LABEL[k] + ']') + '">' + esc(filled) + '</b>' : esc(filled));
          } else {
            var lab = '[' + (m.SLOT_LABEL[k] || k) + ']';
            plain += lab; lh += '<span class="slot">' + esc(lab) + '</span>';
          }
          last = re.lastIndex; prevSlotEnd = last;
        }
        var tail = text.slice(last); plain += tail; lh += esc(tail); frameCount += words(tail);
        html += ' <span class="lab-line' + (opts.cur === c.id ? ' cur' : '') + '" data-dc="' + c.id + '">' + lh.trim() + '</span>';
      });
      paras.push({ key: pg.key, text: tidy(plain), html: html.replace(/\s+/g, ' ').trim() });
    });
    var report = paras.map(function (p) { return p.text; }).filter(Boolean).join('\n\n');
    var total = words(report);
    return { paras: paras, report: report, words: total, frameWords: frameCount, ownWords: ownCount, share: total ? frameCount / total : 0 };
  }

  /* ------------------------------------------------------------- budgets */
  function frameBudget(pct, level) { var lv = level ? levelInfo(level) : null; return Math.round(L.REPORT_WORDS * pct / 100 * (lv && lv.budgetScale ? lv.budgetScale : 1)); }
  /* Page words for one line. level (optional, WP21): the A2 setup level scales
     the target down and keeps the range tight (LEVELS[].budgetScale/Spread). */
  function compBudget(mode, pct, compId, level) {
    var ls = M(mode).lines, total = ls.reduce(function (s, c) { return s + c.weight; }, 0), c = lineById(mode, compId);
    var lv = level ? levelInfo(level) : null, scale = lv && lv.budgetScale ? lv.budgetScale : 1, spread = lv && lv.budgetSpread ? lv.budgetSpread : [0.7, 1.3];
    var t = Math.max(2, Math.round(frameBudget(pct) * c.weight / total * scale));
    return { target: t, lo: Math.max(1, Math.round(t * spread[0])), hi: Math.round(t * spread[1]) + (scale === 1 ? 1 : 0) };
  }
  function occurrences(mode, tpl) {
    var occ = {};
    M(mode).lines.forEach(function (c) { tokensIn(((tpl.lines || {})[c.id] || {}).text || '').forEach(function (k) { occ[k] = (occ[k] || 0) + 1; }); });
    return occ;
  }
  function templateFrameWords(mode, tpl) { return M(mode).lines.reduce(function (s, c) { return s + frameWords(((tpl.lines || {})[c.id] || {}).text || ''); }, 0); }
  function varBudget(mode, tpl, key) {
    var m = M(mode), occ = occurrences(mode, tpl), fw = templateFrameWords(mode, tpl);
    var left = Math.max(50, L.REPORT_WORDS - fw);
    var units = 0; Object.keys(occ).forEach(function (k) { units += (m.VAR[k] ? m.VAR[k].weight : 1) * occ[k]; });
    var t = Math.max(1, Math.round(left * (m.VAR[key] ? m.VAR[key].weight : 1) / (units || 1)));
    return { target: t, lo: Math.max(1, Math.round(t * 0.25)), hi: Math.round(t * 2) + 3 };
  }
  /* What grammar a slot needs, read off the words just before it. */
  function slotFormHint(mode, tpl, key) {
    var hints = [], m = M(mode);
    m.lines.forEach(function (c) {
      var t = ((tpl.lines || {})[c.id] || {}).text || '', re = new RegExp('([A-Za-z\']+)[\\s,;:]*\\{' + key + '\\}', 'g'), mm;
      while ((mm = re.exec(t))) {
        var w = mm[1].toLowerCase();
        if (/^(is|are|being|be|been)$/.test(w)) hints.push('After "' + w + '", start with a past participle: collected…, heated…, built….');
        else if (/^(that|when|while|as|whereas|once)$/.test(w)) hints.push('After "' + w + '", write a full clause with its own subject and verb.');
        else if (/^(at|to|of|from|with|by|reaching|recorded|registered)$/.test(w) && /fig|Fig|Figure/.test(m.SLOT_LABEL[key])) hints.push('After "' + w + '", write the figure and its unit.');
      }
      if (t.trim().indexOf('{' + key + '}') === 0) hints.push('This slot opens a sentence, so it is the subject: a name or a noun phrase.');
      var prevSlot = new RegExp('\\}\\s*\\{' + key + '\\}').test(t);
      if (prevSlot) hints.push('It follows another slot directly, so it starts with a verb: "is poured into moulds", "rose steadily".');
    });
    var coached = (tpl.slotNotes || {})[key];
    if (coached) hints.unshift(coached);
    return hints.filter(function (h, i) { return hints.indexOf(h) === i; }).slice(0, 2);
  }

  /* =========================================================== TEST DRIVE
     Drops the student's lines into a real report: the Thai chart of her
     mode (lab-scenario.js, from the class assignments) or any bank chart of
     that mode with an automatic fill (Template.Data.derive). The frame is
     always hers; the chart only fills the slots.                          */
  function driveOk(mode) { return !!(S && S.charts && S.charts[mode]); }
  function driveChart(mode) {
    if (st.drive.src && st.drive.src !== 'scenario') { var p = promptById(st.drive.src); if (p && p.mode === mode) return p; }
    return S.charts[mode];
  }
  function driveTier(t) { return levelInfo(t.level).tier; }
  function driveValues(mode, chart, tier) {
    if (chart.scenario) return function (k, n, shape) { return S.value(mode, k, tier, shape, n > 0); };
    var d = D.derive(chart, mode);
    return function (k) { return d[k] || ''; };
  }
  function driveTpl(t, overrideId, overrideTok) {
    var x = { lines: {} };
    M(t.mode).lines.forEach(function (c) {
      var ln = t.lines[c.id] || {};
      var txt = ln.text || (ln.draft ? toTokens(t.mode, ln.draft).text : '');
      if (c.id === overrideId) txt = overrideTok;
      x.lines[c.id] = { text: txt || '' };
    });
    return x;
  }
  function driveRender(t, opts) {
    opts = opts || {};
    var chart = driveChart(t.mode);
    return assemble(t.mode, driveTpl(t, opts.cur, opts.tok), {}, { mark: true, gaps: opts.gaps, cur: opts.cur, fillWith: driveValues(t.mode, chart, driveTier(t)) });
  }
  function driveControls(t) {
    var list = promptsOf(t.mode).filter(function (p) { return D.fits(p, t.mode).ok; });
    return '<div class="lab-drive-ctl"><label class="tiny" for="lab-dsrc">Chart</label><select id="lab-dsrc" class="lab-select">' +
      '<option value="scenario"' + (st.drive.src === 'scenario' ? ' selected' : '') + '>' + esc(S.charts[t.mode].title) + ' (class data)</option>' +
      list.map(function (p) { return '<option value="' + esc(p.id) + '"' + (st.drive.src === p.id ? ' selected' : '') + '>' + esc(p.title) + ' · ' + esc(typeName(p.type)) + ' (automatic fill)</option>'; }).join('') +
      '</select><button class="btn sm ghost" id="lab-dchart">' + (st.drive.chart ? 'Hide the chart' : 'Show the chart') + '</button></div>';
  }
  function bindDriveControls(t, repaint) {
    var sel = $('#lab-dsrc'); if (sel) sel.addEventListener('change', function () { st.drive.src = sel.value; repaint(); });
    var ch = $('#lab-dchart'); if (ch) ch.addEventListener('click', function () { st.drive.chart = !st.drive.chart; repaint(); });
    var box = $('#lab-dfig'); if (box && st.drive.chart && global.Charts) global.Charts.render(box, driveChart(t.mode), { compact: true });
  }
  function driveNote(t) {
    var ch = driveChart(t.mode);
    return ch.scenario ? 'Highlighted words come from the chart (' + esc(ch.source) + '): in the exam you write them yourself.'
      : 'Automatic fill: the highlighted words are machine-made and plain. Read your frame around them: does every line still fit this chart?';
  }
  function paintDriveBuild(t, comp, overrideTok) {
    var box = $('#lab-drive'); if (!box || !driveOk(t.mode)) return;
    if (!st.drive.open) {
      box.innerHTML = '<button class="linky" id="lab-dtog">Show the test drive: your line on a real chart</button>';
      $('#lab-dtog').addEventListener('click', function () { st.drive.open = true; paintDriveBuild(t, comp, currentTok(t)); });
      return;
    }
    box.innerHTML = '<div class="lab-drive">' +
      '<div class="lab-drive-h"><div><p class="kicker">Test drive</p><b>Your line, carrying real data</b></div><button class="linky" id="lab-dtog">Hide</button></div>' +
      driveControls(t) + '<div id="lab-dfig"></div>' +
      '<div class="lab-essay hl lab-drive-para" id="lab-drive-para"></div>' +
      '<p class="tiny lab-drive-key"><span class="lab-drive-sw"></span> ' + driveNote(t) + '</p>' +
      '<ul class="lab-notes" id="lab-drive-notes"></ul>' +
    '</div>';
    $('#lab-dtog').addEventListener('click', function () { st.drive.open = false; paintDriveBuild(t, comp, currentTok(t)); });
    bindDriveControls(t, function () { paintDriveBuild(t, comp, currentTok(t)); });
    refreshDrive(t, comp, overrideTok);
  }
  function refreshDrive(t, comp, tok) {
    var pEl = $('#lab-drive-para'), nEl = $('#lab-drive-notes'); if (!pEl || !driveOk(t.mode)) return;
    var r = driveRender(t, { cur: comp.id, tok: tok, gaps: true });
    var para = r.paras.filter(function (p) { return p.key === comp.para; })[0];
    pEl.innerHTML = '<p>' + (para && para.html ? para.html : '<span class="tiny">Write your line above to see it here.</span>') + '</p>';
    var notes = [];
    if (comp.slots.length && !comp.slots.some(function (k) { return String(tok || '').indexOf('{' + k + '}') >= 0; })) notes.push({ kind: 'warn', msg: 'Your line has no slot yet, so no data can go in. Add ' + comp.slots.map(function (k) { return '[' + M(t.mode).SLOT_LABEL[k] + ']'; }).join(' and ') + '.' });
    if (comp.para === 'overview' && /\d/.test(frameText(tok))) notes.push({ kind: 'warn', msg: 'A number in an overview line: the overview has no figures.' });
    nEl.innerHTML = notes.map(function (n) { return '<li class="' + n.kind + '">' + esc(n.msg) + '</li>'; }).join('');
    nEl.style.display = notes.length ? '' : 'none';
  }
  function currentTok(t) { var ta = $('#lab-line'); return ta ? toTokens(t.mode, ta.value).text : ''; }
  function wardsMini(report, prompt, opts) {
    opts = opts || {};
    if (!global.Writer || !global.Writer.preflight || !report) return '';
    var pre = global.Writer.preflight(report, prompt), probs = pre.rows.filter(function (r) { return r.status !== 'ok'; });
    if (opts.drive) {
      /* in a test drive the slot words are the chart's short sample fills, so length is not the page's fault */
      probs = probs.filter(function (r) { return r.id !== 'length'; });
      pre = { bad: probs.filter(function (r) { return r.status === 'bad'; }).length, warn: probs.filter(function (r) { return r.status === 'warn'; }).length };
      pre.summary = pre.bad ? pre.bad + ' red row' + (pre.bad > 1 ? 's' : '') + ' (length not counted in a test drive)' : pre.warn ? 'No red rows — ' + pre.warn + ' to look at.' : 'All green (length not counted in a test drive).';
      if (!probs.length) return '<div class="card preflight lab-wards"><div class="pf-h"><b>The Ten Wards</b><span class="pill good">' + esc(pre.summary) + '</span></div></div>';
    }
    return '<div class="card preflight lab-wards"><div class="pf-h"><b>The Ten Wards</b><span class="pill ' + (pre.bad ? 'bad' : pre.warn ? 'gold' : 'good') + '">' + esc(pre.summary) + '</span></div>' +
      (probs.length ? probs : pre.rows.slice(0, 2)).map(function (r) { return '<div class="pf-row ' + r.status + '"><span class="pf-dot"></span><div><b>' + esc(r.label) + '</b><p>' + esc(r.note) + '</p></div></div>'; }).join('') + '</div>';
  }
  function driveFullHtml(t) {
    var r = driveRender(t, { gaps: true }), ch = driveChart(t.mode);
    var share = r.share, over = share * 100 > t.pct + 6;
    var gaps = M(t.mode).lines.filter(function (c) { return !((t.lines[c.id] || {}).text); }).length;
    return '<div class="card lab-pad lab-drive-full" id="lab-drivefull"><p class="kicker">Test drive</p><h3>Your page on a real chart</h3>' +
      '<p class="tiny">Your lines are the frame; the chart fills the slots. Switch the chart to see whether every line still works on another ' + esc(t.mode) + ' chart.</p>' +
      driveControls(t) + '<div id="lab-dfig"></div>' +
      '<div class="lab-kpis">' +
        kpi(r.words, 'Words', 'aim for 160–190') +
        kpi(pctStr(share), 'Page share', 'target ' + t.pct + '%' + (over ? ' · over' : '')) +
        kpi(pctStr(1 - share), 'Data and your words', 'what you write fresh') +
      '</div>' +
      '<div class="lab-ex-h"><span class="tiny"><span class="lab-drive-sw"></span> ' + driveNote(t) + '</span><label class="tiny"><input type="checkbox" id="lab-dhl"' + (st.highlightFrame ? ' checked' : '') + '> highlight</label></div>' +
      '<div class="lab-essay' + (st.highlightFrame ? ' hl' : '') + '" id="lab-drive-essay">' + r.paras.map(function (p) { return '<p>' + (p.html || '') + '</p>'; }).join('') + '</div>' +
      (gaps ? '' : wardsMini(r.report, ch, { drive: true })) +
      (r.words < 150 ? '<p class="tiny">This test drive has ' + r.words + ' words because the sample fills are short. In the exam your own slot words make up the rest: about ' + (L.REPORT_WORDS - templateFrameWords(t.mode, t)) + ' words at your ' + t.pct + '% page.</p>' : '') +
      '<ul class="lab-notes">' +
        '<li class="tip">Read it aloud. A sentence that sounds wrong shows a line that is not reusable yet: press <b>edit</b> next to that line below.</li>' +
        (over ? '<li class="warn">At ' + pctStr(share) + ', your page carries more of this report than the ' + t.pct + '% you chose. Trim words that carry no meaning.</li>' : '') +
        (gaps ? '<li class="warn">' + gaps + ' line' + (gaps > 1 ? 's are' : ' is') + ' not written yet.</li>' : '') +
      '</ul></div>';
  }
  function bindDriveFull(t, repaint) {
    bindDriveControls(t, repaint);
    var hl = $('#lab-dhl'); if (hl) hl.addEventListener('change', function () { st.highlightFrame = hl.checked; $('#lab-drive-essay').classList.toggle('hl', hl.checked); });
  }

  /* ============================================================== storage */
  function storeKey() { return 'cc.lab.v1.' + String(st.sid || 'anon').toLowerCase(); }
  function loadLocal() {
    try { var d = JSON.parse(localStorage.getItem(storeKey())); if (d && d.templates) { d.dirty = d.dirty || {}; d.attempts = d.attempts || []; d.inUse = d.inUse || {}; return d; } } catch (e) {}
    return { templates: [], attempts: [], dirty: {}, inUse: {} };
  }
  function persist() { try { localStorage.setItem(storeKey(), JSON.stringify(st.data)); } catch (e) { toast('This device is full: older Workshop runs may not be kept offline.'); } }
  function upsert(list, obj) { for (var i = 0; i < list.length; i++) if (list[i].id === obj.id) { list[i] = obj; return; } list.push(obj); }
  function mergeServer(r) {
    var changed = false;
    [['templates', r.templates || []], ['attempts', r.attempts || []]].forEach(function (pair) {
      var list = st.data[pair[0]];
      pair[1].forEach(function (s) {
        if (!s || !s.id) return;
        var mine = list.filter(function (x) { return x.id === s.id; })[0];
        if (!mine || (String(s.updatedAt || '') > String(mine.updatedAt || '') && !st.data.dirty[s.id])) { upsert(list, s); changed = true; }
      });
    });
    if (changed) persist();
    return changed;
  }
  function saveItem(kind, obj) {
    obj.updatedAt = nowIso();
    if (kind === 'template' && obj.pct) { try { localStorage.setItem('cc.share.' + st.sid, String(obj.pct)); } catch (e) {} }
    upsert(st.data[kind === 'template' ? 'templates' : 'attempts'], obj);
    if (!(global.API && global.API.url)) { persist(); return Promise.resolve(true); }
    st.data.dirty[obj.id] = kind;
    persist();
    return pushItem(kind, obj);
  }
  function pushItem(kind, obj) {
    return server(kind === 'template' ? 'lab.saveTemplate' : 'lab.saveAttempt', kind === 'template' ? { template: obj } : { attempt: obj }, TIMEOUT_SAVE)
      .then(function () { delete st.data.dirty[obj.id]; persist(); return true; })
      .catch(function () { return false; });
  }
  function savedMsg(ok, what) {
    if (!(global.API && global.API.url)) return what + ' on this device (offline mode).';
    return ok ? what + ' to your ID.' : what + ' on this device; it will reach your ID when the class server is back.';
  }
  function pushDirty() {
    Object.keys(st.data.dirty || {}).forEach(function (id) {
      var kind = st.data.dirty[id], list = kind === 'template' ? st.data.templates : st.data.attempts;
      var obj = list.filter(function (x) { return x.id === id; })[0];
      if (obj) pushItem(kind, obj); else delete st.data.dirty[id];
    });
  }

  /* =============================================================== server */
  function online() { var api = global.API; return !!(api && api.url && api.mode === 'cloud'); }
  function server(action, payload, ms) {
    var api = global.API;
    if (!api || !api.url) return Promise.reject(new Error('offline'));
    if (api.mode !== 'cloud' && api.retryCloud) api.retryCloud();
    if (api.mode !== 'cloud') return Promise.reject(new Error('offline'));
    payload = payload || {};
    payload.studentId = st.sid;
    try { payload.token = localStorage.getItem('cc.token') || ''; } catch (e) {}
    var ctrl = typeof AbortController !== 'undefined' ? new AbortController() : null, timer;
    var req = fetch(api.url, {
      method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ action: action, payload: payload }), redirect: 'follow', signal: ctrl ? ctrl.signal : undefined
    }).then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); });
    var guard = new Promise(function (_, reject) { timer = setTimeout(function () { if (ctrl) { try { ctrl.abort(); } catch (e) {} } reject(new Error('The coach took too long to answer.')); }, ms || TIMEOUT_COACH); });
    return Promise.race([req, guard]).then(function (j) {
      clearTimeout(timer);
      if (!j || !j.ok) throw new Error((j && j.error) || 'Server error');
      return j;
    }, function (e) { clearTimeout(timer); throw e; });
  }
  function checkStatus() {
    if (!online()) { st.ai = false; st.aiNote = 'Offline: quick checks and data checks only. Your work is kept on this device.'; return Promise.resolve(); }
    return server('lab.status', {}, 15000).then(function (r) {
      st.ai = !!r.ai; st.aiNote = r.ai ? 'AI coach online' : 'The class server has no AI key yet: quick checks and data checks only.';
    }).catch(function (e) {
      st.ai = false;
      var msg = String(e && e.message || e);
      st.aiNote = /Unknown action/.test(msg) ? 'The class server has not been updated for the Workshop yet: quick checks only.'
        : /JSON|Unexpected token|not valid/i.test(msg) ? 'The class server is missing the Workshop script (Lab.gs): quick checks only.'
        : 'Could not reach the AI coach: quick checks and data checks only.';
    });
  }

  /* ========================================================= quick checks */
  var CONTRACTION = /\b(\w+n't|it's|there's|that's|they're|we're|i'm|you're|let's)\b/i;
  var INFORMAL = /\b(kids?|stuff|a lot of|lots of|gonna|wanna|okay|ok|super|awesome|guys|huge|tons of)\b/i;
  var FULL = { "can't": 'cannot', "won't": 'will not', "it's": 'it is', "there's": 'there is', "that's": 'that is', "they're": 'they are', "we're": 'we are', "i'm": 'I am', "you're": 'you are', "let's": 'let us' };
  var DIRECTION = /\b(rose|risen|increased|grew|climbed|fell|fallen|decreased|declined|dropped|went up|went down)\b/i;
  var OVERVIEW_OPEN = /^(overall|in general|generally|it is clear that|it can be seen that|it is noticeable that|it is evident that)/i;
  function spellErrors(text) {
    var out = [];
    normWords(text).forEach(function (w) {
      if (L.MISSPELL[w]) out.push({ original: w, correction: L.MISSPELL[w], type: 'spelling', explain: 'Spelling.' });
      else if (L.UNCOUNTABLE[w]) out.push({ original: w, correction: L.UNCOUNTABLE[w], type: 'grammar', explain: 'Usually uncountable: no -s.' });
    });
    var m = String(text).match(/\b(\w+)\s+\1\b/i);
    if (m && !/^(that|had)$/i.test(m[1])) out.push({ original: m[0], correction: m[1], type: 'grammar', explain: 'The same word twice.' });
    var an = String(text).match(/\b[aA]\s+([aeiouAEIOU]\w+)/);
    if (an && !/^(uni|use|usu|eu|one|once)/i.test(an[1])) out.push({ original: an[0], correction: 'an ' + an[1], type: 'grammar', explain: 'Use "an" before a vowel sound.' });
    var pc = String(text).match(/\b(\d+)\s+percents?\b/i);
    if (pc) out.push({ original: pc[0], correction: pc[1] + ' per cent', type: 'spelling', explain: 'Write "per cent" (or %), never "percents".' });
    return out;
  }
  function contractionErrors(text) {
    var out = [], re = new RegExp(CONTRACTION.source, 'gi'), m;
    while ((m = re.exec(String(text)))) {
      var w = m[0], low = w.toLowerCase().replace(/’/g, "'");
      out.push({ original: w, correction: FULL[low] || low.replace(/n't$/, ' not'), type: 'register', explain: 'Contraction: write the full form in a report.' });
    }
    return out;
  }
  function registerErrors(text) {
    var out = [];
    L.REGISTER.forEach(function (r) { var m = String(text).match(r.re); if (m && !out.some(function (x) { return x.original === m[0]; })) out.push({ original: m[0], correction: '(delete or rephrase)', type: 'register', explain: r.msg }); });
    return out;
  }
  function styleIssues(text) {
    var out = [];
    L.CLICHE.forEach(function (re) { var m = String(text).match(re); if (m) out.push({ kind: 'warn', msg: '"' + m[0] + '" reads as memorised. Say it your own way.' }); });
    if (INFORMAL.test(text)) out.push({ kind: 'warn', msg: 'Informal word: "' + String(text).match(INFORMAL)[0] + '". Choose a formal one.' });
    if (/\s{2,}/.test(text)) out.push({ kind: 'tip', msg: 'Double space.' });
    return out;
  }

  /* One page line. */
  function quickFrame(mode, comp, rawText, pct, level) {
    var m = M(mode), conv = toTokens(mode, rawText), text = conv.text.trim();
    var res = { text: text, blocking: [], issues: [], errors: [], budget: compBudget(mode, pct, comp.id, level) };
    if (!text) { res.blocking.push('Write the line first.'); return res; }
    conv.unknown.forEach(function (u) { res.blocking.push('[' + u + '] is not a slot on this page. Use the slot buttons above the box.'); });
    var toks = tokensIn(text);
    comp.slots.forEach(function (k) {
      var n = toks.filter(function (x) { return x === k; }).length;
      if (n === 0) res.blocking.push('This line must contain [' + m.SLOT_LABEL[k] + '].');
      if (n > 1) res.blocking.push('[' + m.SLOT_LABEL[k] + '] appears ' + n + ' times; use it once.');
    });
    toks.forEach(function (k) { if (comp.slots.indexOf(k) < 0) res.issues.push({ kind: 'warn', msg: '[' + m.SLOT_LABEL[k] + '] belongs to another line. Keep each line to its own slots so the report stays in order.' }); });
    res.words = frameWords(text);
    res.budget.ok = res.words >= res.budget.lo && res.words <= res.budget.hi;
    if (res.words > res.budget.hi) res.issues.push({ kind: 'warn', msg: res.words + ' page words: over the ' + res.budget.lo + '–' + res.budget.hi + ' budget for a ' + pct + '% page. Trim words that carry no meaning.' });
    if (res.words < res.budget.lo) res.issues.push({ kind: 'tip', msg: res.words + ' page words: under the ' + res.budget.lo + '–' + res.budget.hi + ' budget. Fine if the line still does its job.' });
    var ex = [], worst = 0, worstEx = '';
    ['B1', 'B2', 'C1'].forEach(function (t) { ex = ex.concat(comp.examples[t] || []); });
    var fwN = frameWords(text);
    ex.forEach(function (e) {
      var a = text.replace(/\{\w+\}/g, ' slotx '), b = e.replace(/\{\w+\}/g, ' slotx ');
      var run = realRun(a, b), tri = fwN >= 5 ? trigramOverlap(a, b, true) : 0, score = Math.max(run >= 5 ? 1 : 0, tri);
      if (score > worst) { worst = score; worstEx = e; }
    });
    res.copied = worst >= 0.6 && fwN > 2;
    if (res.copied) res.issues.push({ kind: 'warn', msg: 'Too close to an example ("' + toLabels(mode, worstEx) + '"). Your page must be in your own words.' });
    var fr = frameText(text);
    if (/\d/.test(fr)) res.issues.push({ kind: 'warn', msg: 'A number in your frame: numbers change with every chart, so they belong in a slot.' });
    if (mode === 'TREND' && DIRECTION.test(fr)) res.issues.push({ kind: 'warn', msg: '"' + fr.match(DIRECTION)[0] + '" in your frame is wrong for a chart that moves the other way. Put the direction in [Trend A] or [Trend B].' });
    var firstOv = m.lines.filter(function (c) { return c.para === 'overview'; })[0];
    if (firstOv && firstOv.id === comp.id && !OVERVIEW_OPEN.test(text.replace(/^\{\w+\}\s*/, ''))) res.issues.push({ kind: 'warn', msg: 'Start the overview with "Overall," (or "In general,"). The Ten Wards look for it.' });
    if (/^[a-z]/.test(text)) res.errors.push({ original: text.split(/\s+/)[0], correction: text.charAt(0).toUpperCase() + text.split(/\s+/)[0].slice(1), type: 'punctuation', explain: 'A sentence starts with a capital letter.' });
    if (!/[.!?:;]$/.test(text) && !/\}$/.test(text)) res.errors.push({ original: text.slice(-12), correction: text.slice(-12) + '.', type: 'punctuation', explain: 'End the line with a full stop.' });
    if (/\}$/.test(text)) res.issues.push({ kind: 'tip', msg: 'Add the full stop after the slot: "…[' + m.SLOT_LABEL[toks[toks.length - 1]] + ']."' });
    res.errors = res.errors.concat(spellErrors(text.replace(/\{\w+\}/g, ' slotx ')).filter(function (e) { return !/slotx/.test(e.original); }), contractionErrors(fr), registerErrors(fr));
    res.issues = res.issues.concat(styleIssues(text.replace(/\{\w+\}/g, 'slotx')));
    return res;
  }

  /* One variable, in the context of its chart. */
  function quickVar(mode, key, value, value2, ctx) {
    var m = M(mode), def = m.VAR[key], res = { blocking: [], issues: [], errors: [], budget: varBudget(mode, ctx.tpl, key) };
    value = String(value || '').trim();
    if (!value) { res.blocking.push('Write something in the slot first.'); return res; }
    if (/\[[^\]]+\]|\{\w+\}/.test(value)) res.blocking.push('Remove the brackets: write the words that go into the slot.');
    res.words = words(value);
    res.budget.ok = res.words >= res.budget.lo && res.words <= res.budget.hi;
    if (res.words > res.budget.hi) res.issues.push({ kind: 'warn', msg: res.words + ' words: longer than the ' + res.budget.lo + '–' + res.budget.hi + ' this slot needs. Keep it precise.' });
    var pr = ctx.prompt, run = longestRun(value, pr.rubric || '');
    res.copied = run >= 8;
    if (res.copied) res.issues.push({ kind: 'warn', msg: run + ' words in a row are copied from the task sentence. Copied words are not counted: paraphrase.' });
    var vars = {}; Object.keys(ctx.vars || {}).forEach(function (k) { vars[k] = ctx.vars[k].text || ''; }); vars[key] = value;
    res.data = D.check(def, value, pr, { vars: vars });
    slotFormHint(mode, ctx.tpl, key).forEach(function (h) {
      if (/past participle/.test(h) && !/^\s*(\w+ed|\w+en|made|cut|put|laid|sent|kept|built|sold|fed|held|left|taken|given|brought|set|spread|shut|split|ground|bought|caught|dug|found|hung|lit|paid|read|run|said|sewn|shown|spun|stuck|swept|thrown|torn|worn|wound|done|grown|known|drawn)\b/i.test(value))
        res.issues.push({ kind: 'warn', msg: h });
    });
    agreement(mode, ctx.tpl, key, value).forEach(function (msg) { res.issues.push({ kind: 'warn', msg: msg }); res.errors.push({ original: value.split(/\s+/).slice(-2).join(' ') + ' …', correction: '(check the verb after it)', type: 'grammar', explain: msg }); });
    if (ctx.needs2) {
      value2 = String(value2 || '').trim();
      res.hasSecond = !!value2;
      if (value2) {
        res.reworded = similarity(value, value2) <= 0.7;
        if (!res.reworded) res.issues.push({ kind: 'tip', msg: 'The second mention repeats the same words. A pronoun, a shorter name or a synonym reads better.' });
        var d2 = D.check(def, value2, pr, { vars: vars });
        if (d2.status === 'bad' && !/^(it|they|this|these|the latter|the former|the figure|this figure)\b/i.test(value2)) res.issues.push({ kind: 'warn', msg: 'Second mention: ' + d2.note });
      }
    }
    var all = value + (value2 ? ' ' + value2 : '');
    res.errors = spellErrors(all).concat(contractionErrors(all), registerErrors(all));
    res.issues = res.issues.concat(styleIssues(value));
    return res;
  }

  /* Subject–verb agreement where a value meets the frame: a plural value
     before "was" / "is" / "has", or a singular one before "were" / "are". */
  var PLURAL_OK = /(ss|us|is|news|series|species)$/i;
  function looksPlural(v) {
    v = String(v || '').trim().replace(/[.,;:]+$/, '');
    if (/^(a|an|one|each|every|this|that)\b/i.test(v)) return false;
    if (/\s(and|as well as)\s/i.test(v.replace(/\b(food and drinks?|wind and solar|phone and internet|filling and delivery|restaurants and shops)\b/gi, 'x'))) return true;
    var head = v.split(/,|\b(which|where|that|with|in|on|at|of|to|along|near|from)\b/i)[0].trim().split(/\s+/).pop() || '';
    return /s$/i.test(head) && !PLURAL_OK.test(head) && head.length > 3;
  }
  function agreement(mode, tpl, key, value) {
    var out = [], plural = looksPlural(value);
    M(mode).lines.forEach(function (c) {
      var t = (tpl.lines[c.id] || {}).text || '', re = new RegExp('\\{' + key + '\\}\\s+(\\w+)', 'g'), m;
      while ((m = re.exec(t))) {
        var w = m[1].toLowerCase();
        if (plural && /^(was|is|has)$/.test(w)) out.push('Agreement: "' + value + '" is plural, but your line goes on with "' + w + '". Write a singular phrase here, or the verb must be ' + { was: 'were', is: 'are', has: 'have' }[w] + '.');
        if (!plural && /^(were|are|have)$/.test(w) && /^(a|an|the|this)\s/i.test(value) && !/\s(and)\s/i.test(value)) out.push('Agreement: "' + value + '" is singular, but your line goes on with "' + w + '".');
      }
    });
    return out.filter(function (x, i) { return out.indexOf(x) === i; }).slice(0, 1);
  }

  /* ============================================================== scoring */
  function scoreOf(q, ai, opts) {
    opts = opts || {};
    var P = L.POINTS, rows = [];
    rows.push(['Submitted', P.submit]);
    if (q.data && q.data.status !== 'none') rows.push([q.data.status === 'ok' ? 'True to the chart' : q.data.status === 'near' ? 'Nearly right for the chart' : 'Does not match the chart', q.data.status === 'ok' ? P.dataOk : q.data.status === 'near' ? P.dataNear : 0]);
    var fn = ai && ai.fn ? ai.fn.verdict : null;
    if (fn === 'meets') rows.push(['Does its job', P.functionMet]);
    else if (fn === 'partly') rows.push(['Partly does its job', P.functionPartly]);
    else if (!ai) rows.push(['Job not checked (offline)', q.issues.some(function (i) { return i.kind === 'warn'; }) || (q.data && q.data.status === 'bad') ? 0 : P.functionPartly]);
    else rows.push(['Does not do its job yet', 0]);
    var errs = mergedErrors(q, ai).length;
    if (ai) rows.push([errs === 0 ? 'No errors' : errs === 1 ? 'One error' : errs + ' errors', errs === 0 ? P.errorFree : errs === 1 ? P.oneError : 0]);
    else rows.push([errs === 0 ? 'No errors found (quick check)' : errs + ' error(s) found', errs === 0 ? Math.round(P.errorFree / 2) : 0]);
    rows.push([q.budget.ok ? 'On word budget' : 'Off word budget', q.budget.ok ? P.budget : 0]);
    rows.push([q.copied ? 'Copied wording' : 'Your own words', q.copied ? 0 : P.ownWords]);
    if (ai && ai.cefr) {
      var ok = cefrIdx(ai.cefr) >= cefrIdx(opts.level);
      rows.push([ok ? 'At your target level (' + ai.cefr + ')' : 'Below target level (' + ai.cefr + ')', ok ? P.level : 0]);
    }
    if (opts.needs2 && q.hasSecond) rows.push([q.reworded ? 'Second mention reworded' : 'Second mention repeated', q.reworded ? P.reworded : 0]);
    if (opts.speed) rows.push(['Speed bonus', opts.speed]);
    return { rows: rows, total: rows.reduce(function (s, r) { return s + r[1]; }, 0) };
  }
  function mergedErrors(q, ai) {
    var list = (ai && ai.errors ? ai.errors : []).slice();
    (q.errors || []).forEach(function (e) {
      var dup = list.some(function (x) { return String(x.original || '').toLowerCase().indexOf(String(e.original).toLowerCase()) >= 0; });
      if (!dup && (!ai || e.type === 'spelling' || e.type === 'register')) list.push(e);
    });
    return list;
  }

  /* ========================================================= lab summary */
  function labSummary() { var p = host.p; if (!p.lab) p.lab = { points: 0 }; return p.lab; }
  function recompute() {
    var s = labSummary(), byShare = {}, byMode = {}, full = {};
    var done = st.data.templates.filter(function (t) { return t.status === 'complete'; });
    s.templatesComplete = done.length;
    s.modesDesigned = { TREND: false, COMPARE: false, SEQUENCE: false, SPACE: false };
    done.forEach(function (t) { s.modesDesigned[t.mode] = true; });
    s.cleanTemplates = done.filter(function (t) { return M(t.mode).lines.every(function (c) { var b = (t.lines[c.id] || {}).last; return b && b.errors === 0; }); }).length;
    var runs = st.data.attempts.filter(function (a) { return a.status === 'complete'; });
    var accN = 0, accOk = 0;
    runs.forEach(function (a) {
      var k = String(a.pct), x = byShare[k] || (byShare[k] = { n: 0, best: null, sum: 0, rated: 0, acc: 0 });
      var y = byMode[a.mode] || (byMode[a.mode] = { n: 0, best: null, acc: 0 });
      x.n++; y.n++;
      if (a.full) full[k] = (full[k] || 0) + 1;
      if (a.accuracy && a.accuracy.n) { x.acc += a.accuracy.ok / a.accuracy.n; y.acc += a.accuracy.ok / a.accuracy.n; accN += a.accuracy.n; accOk += a.accuracy.ok; }
      if (a.rating && a.rating.overall != null) {
        x.rated++; x.sum += a.rating.overall;
        if (x.best == null || a.rating.overall > x.best) x.best = a.rating.overall;
        if (y.best == null || a.rating.overall > y.best) y.best = a.rating.overall;
      }
    });
    Object.keys(byShare).forEach(function (k) { byShare[k].acc = Math.round(byShare[k].acc / byShare[k].n * 100) / 100; });
    Object.keys(byMode).forEach(function (k) { byMode[k].acc = Math.round(byMode[k].acc / byMode[k].n * 100) / 100; });
    s.byShare = byShare; s.byMode = byMode; s.fullPcts = full;
    s.runs = runs.length;
    s.accuracy = accN ? Math.round(accOk / accN * 100) / 100 : null;
    s.perfectCasts = runs.filter(function (a) { return a.accuracy && a.accuracy.n >= 6 && a.accuracy.ok === a.accuracy.n; }).length;
    s.cleanCasts = runs.filter(function (a) { return a.wards && a.wards.bad === 0 && a.full; }).length;
    s.timedCasts = runs.filter(function (a) { return a.timing === '1min' && a.full; }).length;
    s.maxVersion = st.data.attempts.reduce(function (m, a) { return Math.max(m, a.version || 1); }, 0);
    var best = null; runs.forEach(function (a) { if (a.rating && a.rating.overall != null && (best == null || a.rating.overall > best)) best = a.rating.overall; });
    s.bestBand = best;
    return s;
  }
  function labRank(points) {
    var r = L.RANKS[0], next = null;
    L.RANKS.forEach(function (x, i) { if (points >= x.min) { r = x; next = L.RANKS[i + 1] || null; } });
    return { rank: r, next: next };
  }
  /* Points go to the Workshop tally and a quarter of them to Merits (p.xp). */
  function award(points) {
    if (!points) return;
    var s = labSummary(), p = host.p;
    s.points = (s.points || 0) + points;
    p.xp = (p.xp || 0) + Math.round(points / 4);
    floatPoints(points);
    paintChip();
    if (host.paintHeader) host.paintHeader();
    if (host.syncSoon) host.syncSoon();
  }
  function afterMilestone() {
    recompute();
    var p = host.p, earned = [];
    try { if (global.Engine && global.Engine.Progress && global.Engine.Progress.checkBadges) earned = global.Engine.Progress.checkBadges(p) || []; } catch (e) {}
    /* the engine may not run BADGES[i].test yet: check the Workshop keepsakes here too */
    if (!p.badges) p.badges = [];
    L.BADGES.forEach(function (b) { if (p.badges.indexOf(b.id) < 0 && b.test(p)) { p.badges.push(b.id); earned.push(b); } });
    if (host.sync) host.sync();
    if (earned.length && host.celebrate) setTimeout(function () { host.celebrate(earned[0], earned.slice(1)); }, 700);
  }
  function toast(msg) { if (host && host.toast) host.toast(msg); }
  function floatPoints(n) {
    var chip = $('#lab-chip-pts'); if (!chip) return;
    var f = document.createElement('span'); f.className = 'lab-float'; f.textContent = '+' + n;
    chip.parentNode.appendChild(f); setTimeout(function () { if (f.parentNode) f.parentNode.removeChild(f); }, 1300);
  }
  function paintChip() {
    var s = labSummary(), r = labRank(s.points || 0);
    var a = $('#lab-chip-pts'), b = $('#lab-chip-rank');
    if (a) a.textContent = s.points || 0;
    if (b) b.textContent = r.rank.name;
  }

  /* ================================================================ shell */
  function paint() {
    if (!root) return;
    var s = labSummary(), r = labRank(s.points || 0);
    var aiCls = st.ai == null ? '' : st.ai ? ' good' : ' bad';
    var aiTxt = st.ai == null ? 'Checking the coach…' : st.aiNote;
    root.innerHTML =
      '<div class="lab">' +
      '<div class="sect-h"><div><h2>Spellbook Workshop</h2><p>Build your own Task 1 spellbook in your own words: one page for each mode. Then cast it on real charts: every figure, year and name is checked against the chart.</p></div></div>' +
      '<div class="lab-top"><div class="tabs lab-tabs" role="tablist">' +
        [['studio', 'Design'], ['assembly', 'Cast it on a chart'], ['score', 'Spellbook record']].concat(global.LabExamples ? [['examples', 'Examples']] : []).map(function (t) { return '<button class="tab' + (st.tab === t[0] ? ' on' : '') + '" role="tab" aria-selected="' + (st.tab === t[0]) + '" data-ltab="' + t[0] + '">' + t[1] + '</button>'; }).join('') +
      '</div><div class="lab-chips"><div class="chip lab-chipwrap"><b id="lab-chip-pts" class="lab-num">' + (s.points || 0) + '</b><span>Workshop points</span></div><div class="chip"><b id="lab-chip-rank">' + esc(r.rank.name) + '</b><span>Workshop rank</span></div></div></div>' +
      '<p class="lab-ai"><span class="pill' + aiCls + '">' + esc(aiTxt) + '</span>' + (Object.keys(st.data.dirty || {}).length ? ' <span class="pill gold">' + Object.keys(st.data.dirty).length + ' waiting to sync</span>' : '') + '</p>' +
      '<div id="lab-body"></div></div>';
    $$('[data-ltab]').forEach(function (b) {
      b.addEventListener('click', function () {
        if (st.run && !st.run.done) pauseClock();
        st.tab = b.dataset.ltab;
        /* WP17: the Design tab shows the mode cards unless a design is in progress
           (setup, a line being built, or the review of an unsaved page). A saved
           page's summary is not "in progress": back to home. */
        if (st.tab === 'studio' && !designInProgress()) { st.view = 'home'; st.build = null; }
        if (st.tab === 'score') { st.view = 'home'; st.review = null; }
        paint();
      });
    });
    paintBody();
  }
  function body() { return $('#lab-body'); }
  function designInProgress() {
    if (st.view === 'setup' && st.setup) return true;
    if (st.view === 'build' && st.build) return true;
    if (st.view === 'summary' && st.build && st.build.tpl && st.build.tpl.status !== 'complete') return true;
    return false;
  }
  function paintBody() {
    var el = body(); if (!el) return;
    if (st.tab === 'studio') {
      if (st.view === 'setup') return paintSetup(el);
      if (st.view === 'build' && st.build) return paintBuild(el);
      if (st.view === 'summary' && st.build) return paintSummary(el);
      return paintStudio(el);
    }
    if (st.tab === 'assembly') {
      if (st.run && !st.run.done) return paintRun(el);
      if (st.run && st.run.done) return paintFinish(el);
      return paintAsmHome(el);
    }
    if (st.tab === 'examples') return paintExamples(el);
    if (st.review) return paintReview(el);
    return paintScore(el);
  }
  function scrollTop() { try { root.scrollIntoView({ block: 'start' }); window.scrollBy(0, -80); } catch (e) {} }
  function kpi(v, label, sub) { return '<div class="lab-kpi"><b class="lab-num">' + v + '</b><span>' + esc(label) + '</span>' + (sub ? '<small>' + sub + '</small>' : '') + '</div>'; }

  /* ======================================================= DESIGN (studio) */
  function lineMax(mode) { return M(mode).lines.length * L.POINTS.lineMax; }
  function tplScore(t) { return M(t.mode).lines.reduce(function (s, c) { var ln = t.lines[c.id]; return s + (ln && ln.last ? ln.last.points : 0); }, 0); }
  function tplDone(t) { return M(t.mode).lines.filter(function (c) { var ln = t.lines[c.id]; return ln && ln.text && ln.last; }).length; }
  function completeTemplates(mode) { return st.data.templates.filter(function (t) { return t.status === 'complete' && (!mode || t.mode === mode); }).sort(function (a, b) { return String(b.updatedAt).localeCompare(String(a.updatedAt)); }); }
  function getTpl(id) { return st.data.templates.filter(function (t) { return t.id === id; })[0]; }
  function inUseId(mode) { var id = (st.data.inUse || {})[mode], t = id && getTpl(id); return t && t.status === 'complete' ? id : ((completeTemplates(mode)[0] || {}).id || ''); }

  function modeStrip() {
    return '<div class="lab-modes">' + L.MODE_ORDER.map(function (mode) {
      var m = M(mode), done = completeTemplates(mode), drafts = st.data.templates.filter(function (t) { return t.mode === mode && t.status !== 'complete'; });
      var use = done.length ? getTpl(inUseId(mode)) : null;
      return '<div class="card lab-mode' + (done.length ? ' done' : '') + '"><div class="lab-mode-h"><b>' + esc(mode) + '</b>' + (done.length ? '<span class="pill good">page ready</span>' : drafts.length ? '<span class="pill gold">draft</span>' : '<span class="pill">no page yet</span>') + '</div>' +
        '<p class="tiny">' + esc(m.blurb) + '</p>' +
        (use ? '<p class="tiny"><b>' + esc(use.name) + '</b> · v' + (use.version || 1) + ' · ' + use.pct + '%</p>' : '') +
        '<div class="lab-acts">' + (done.length ? '<button class="btn sm" data-mcast="' + mode + '">Cast it on a chart</button>' : '') +
        '<button class="btn sm' + (done.length ? ' ghost' : ' primary') + '" data-mnew="' + mode + '">' + (done.length ? 'New page' : 'Design this page') + '</button></div></div>';
    }).join('') + '</div>';
  }
  function paintStudio(el) {
    var list = st.data.templates.slice().sort(function (a, b) { return String(b.updatedAt).localeCompare(String(a.updatedAt)); });
    var html = '<div class="lab-hero card"><div><p class="kicker">Design</p><h3>Four pages, in your words</h3>' +
      '<ol class="lab-steps"><li><b>Choose a mode</b>: TREND, COMPARE, SEQUENCE or SPACE. One page each.</li><li><b>Choose the share</b> your page carries (60, 50, 40 or 30%) and your target level.</li><li><b>Write each line</b> in your own words, with its [slots]. A <b>test drive</b> puts every line on a real chart while you write.</li><li><b>Save it</b>, then cast it on charts from the bank.</li></ol>' + examplesPointer('hero') + '</div>' +
      '<button class="btn primary" id="lab-new">New page →</button></div>';
    html += modeStrip();
    if (!list.length) html += '<p class="tiny lab-empty">No pages yet. Your first page takes about 25–35 minutes: eight or nine short lines, each coached.</p>';
    else html += '<p class="kicker lab-listh">All your pages</p><div class="lab-grid">' + list.map(function (t) {
      var lv = levelInfo(t.level), done = tplDone(t), score = tplScore(t), n = M(t.mode).lines.length;
      return '<div class="card lab-tcard' + (t.status === 'complete' ? ' done' : '') + '">' +
        '<div class="lab-tcard-h"><b>' + esc(t.name) + '</b><span class="pill">v' + (t.version || 1) + '</span></div>' +
        '<div class="lab-pills"><span class="pill on">' + esc(t.mode) + '</span><span class="pill gold">' + t.pct + '%</span><span class="pill">' + esc(lv.id) + '</span>' +
        (t.status === 'complete' ? '<span class="pill good">Complete · ' + Math.round(score / lineMax(t.mode) * 100) + '%</span>' : '<span class="pill">Draft · ' + done + '/' + n + ' lines</span>') +
        (t.status === 'complete' && inUseId(t.mode) === t.id ? '<span class="pill good">in My Spellbook</span>' : '') + '</div>' +
        '<p class="tiny">' + templateFrameWords(t.mode, t) + ' page words · updated ' + esc(fmtDate(t.updatedAt)) + '</p>' +
        '<div class="lab-acts">' + (t.status === 'complete'
          ? '<button class="btn sm" data-topen="' + t.id + '">View</button><button class="btn sm" data-tver="' + t.id + '">New version</button><button class="btn sm" data-tcopy="' + t.id + '">Copy at another share</button><button class="btn sm" data-tuse="' + t.id + '">Cast it →</button>' + (inUseId(t.mode) !== t.id ? '<button class="btn sm ghost" data-tbook="' + t.id + '">Put in My Spellbook</button>' : '')
          : '<button class="btn sm primary" data-tcont="' + t.id + '">Continue</button><button class="btn sm ghost" data-tdel="' + t.id + '">Delete draft</button>') + '</div></div>';
    }).join('') + '</div>';
    el.innerHTML = html;
    bindExamplesPointer('');
    function newSetup(mode) { var lv = defaultLevel(); st.setup = { mode: mode || '', pct: defaultPct(lv), level: lv, start: 'blank', name: '' }; st.view = 'setup'; paintBody(); scrollTop(); }
    $('#lab-new').addEventListener('click', function () { newSetup(''); });
    $$('[data-mnew]').forEach(function (b) { b.addEventListener('click', function () { newSetup(b.dataset.mnew); }); });
    $$('[data-mcast]').forEach(function (b) { b.addEventListener('click', function () { st.asmTemplate = inUseId(b.dataset.mcast); st.tab = 'assembly'; st.run = null; paint(); scrollTop(); }); });
    $$('[data-tcopy]').forEach(function (b) { b.addEventListener('click', function () {
      var src = getTpl(b.dataset.tcopy), next = [60, 50, 40, 30].filter(function (x) { return x < src.pct; })[0] || [60, 50, 40, 30].filter(function (x) { return x !== src.pct; })[0];
      st.setup = { mode: src.mode, pct: next, level: src.level, start: 'copy', from: src.id, name: '' }; st.view = 'setup'; paintBody(); scrollTop();
    }); });
    $$('[data-tcont]').forEach(function (b) { b.addEventListener('click', function () { openBuild(getTpl(b.dataset.tcont)); }); });
    $$('[data-topen]').forEach(function (b) { b.addEventListener('click', function () { st.build = { tpl: getTpl(b.dataset.topen), idx: 0, readOnly: true }; st.view = 'summary'; paintBody(); scrollTop(); }); });
    $$('[data-tver]').forEach(function (b) { b.addEventListener('click', function () { newVersion(getTpl(b.dataset.tver)); }); });
    $$('[data-tuse]').forEach(function (b) { b.addEventListener('click', function () { st.asmTemplate = b.dataset.tuse; st.tab = 'assembly'; st.run = null; paint(); scrollTop(); }); });
    $$('[data-tbook]').forEach(function (b) { b.addEventListener('click', function () { useInBook(getTpl(b.dataset.tbook)); paintBody(); }); });
    $$('[data-tdel]').forEach(function (b) { b.addEventListener('click', function () {
      if (!confirm('Delete this draft page? This cannot be undone.')) return;
      st.data.templates = st.data.templates.filter(function (t) { return t.id !== b.dataset.tdel; });
      delete st.data.dirty[b.dataset.tdel]; persist();
      server('lab.deleteTemplate', { id: b.dataset.tdel }, TIMEOUT_SAVE).catch(function () {});
      paintBody();
    }); });
  }
  /* WP21: a pointer to the Examples tab (Nam, B1 · Fah, B2) from the Design hero
     and from the setup's "Start from". data-exgo carries the mode to open. */
  function examplesPointer(where) {
    if (!global.LabExamples) return '';
    return '<p class="tiny lab-expoint"><button class="linky" data-exgo="' + where + '">See how Nam (B1) and Fah (B2) built theirs →</button>' +
      (where === 'setup' ? ' <span>One page each, cast on a real chart, every figure checked.</span>' : '') + '</p>';
  }
  function bindExamplesPointer(mode) {
    $$('[data-exgo]').forEach(function (b) { b.addEventListener('click', function () {
      if (mode && L.MODES[mode]) st.ex.mode = mode;
      st.tab = 'examples'; paint(); scrollTop();
    }); });
  }
  /* The student's track (PCHost.tier: B1 | B2 | C1) sets the level; a B1-track
     student who reads her lessons at A1/A2 starts at the A2 setup level. */
  function defaultLevel() {
    var p = host && host.p, t = host && host.tier ? host.tier() : (p && (p.tier || p.cefr || p.level)) || '';
    var ex = String((p && p.explainLevel) || '');
    if (/C1|C2/.test(t)) return 'C1';
    if (/B1|A2|A1/.test(t)) return /^A[12]$/.test(ex) ? 'A2' : 'B1';
    return 'B2';
  }
  /* Share by level: A2/B1 60, B2 50, C1 40 (the brief's track → share rule). */
  function defaultPct(level) { return level === 'C1' ? 40 : level === 'B2' ? 50 : 60; }
  /* WP16: land a chapter mission ("Design your TREND page") one tap from the
     first line. A complete page → home (the mission is done); an unfinished
     draft → straight into its next line; otherwise the setup with mode, share
     and level already chosen. Returns true when it painted. */
  function startFromMission(mode) {
    if (!L.MODES[mode]) return false;
    st.tab = 'studio'; st.review = null;
    if (st.run && !st.run.done) pauseClock();
    if (completeTemplates(mode).length) { st.view = 'home'; st.build = null; paint(); return true; }
    var draft = st.data.templates.filter(function (t) { return t.mode === mode && t.status !== 'complete'; })
      .sort(function (a, b) { return String(b.updatedAt).localeCompare(String(a.updatedAt)); })[0];
    if (draft) { openBuild(draft); return true; }
    var lv = defaultLevel();
    st.setup = { mode: mode, pct: defaultPct(lv), level: lv, start: 'blank', name: '', mission: true };
    st.view = 'setup'; st.build = null;
    paint(); scrollTop();
    return true;
  }
  function useInBook(t) {
    if (!t) return;
    st.data.inUse = st.data.inUse || {}; st.data.inUse[t.mode] = t.id; persist();
    toast('"' + t.name + '" is now your ' + t.mode + ' page in My Spellbook and the Scriptorium.');
  }

  function paintSetup(el) {
    var s = st.setup, lv = levelInfo(s.level), src = s.from ? getTpl(s.from) : null;
    var fw = frameBudget(s.pct, s.level), own = L.REPORT_WORDS - fw, m = s.mode ? M(s.mode) : null;
    var defName = (s.mode || 'Page') + ' · ' + s.pct + '% · ' + lv.id;
    var html = '<div class="lab-back"><button class="btn sm ghost" id="lab-cancel">← All pages</button></div>' +
      (src ? '<div class="card lab-pad lab-copynote"><p class="kicker">Copy at another share</p><p>Your ' + src.pct + '% lines from <b>' + esc(src.name) + '</b> come in as drafts. Trim each one to the new budget in your own way, then coach it again.</p></div>' : '') +
      (s.mission && m ? '<div class="card lab-pad lab-copynote" id="lab-missionnote"><p class="kicker">Your mission</p><p>A <b>' + esc(m.id) + '</b> page, set up from your track: <b>' + s.pct + '%</b> share at <b>' + esc(lv.id) + '</b>. Change anything below, or press <b>Start building</b>.</p></div>' : '') +
      '<div class="card lab-pad"><p class="kicker">Step 1 · Mode</p><h3>Which page are you writing?</h3><div class="lab-types">' + L.MODE_ORDER.map(function (mode) {
        var mm = M(mode);
        return '<button class="lab-type' + (s.mode === mode ? ' on' : '') + '" data-md="' + mode + '"' + (src ? ' disabled' : '') + '><b>' + mode + '</b><span class="tiny">' + esc(mm.page) + ' · class assignment ' + mm.classId + '</span><span>' + esc(mm.blurb) + '</span></button>';
      }).join('') + '</div>' + (m ? '<p class="tiny"><b>Tense:</b> ' + esc(m.tense) + '<br><b>Groups:</b> ' + esc(m.grouping) + '</p>' : '') + '</div>' +
      '<div class="card lab-pad"><p class="kicker">Step 2 · Share</p><h3>How much of the report should your page carry?</h3>' +
      '<div class="lab-pcts">' + L.PCTS.map(function (o) {
        return '<label class="lab-pct' + (s.pct === o.pct ? ' on' : '') + '"><input type="radio" name="lab-pct" value="' + o.pct + '"' + (s.pct === o.pct ? ' checked' : '') + '>' +
          '<span class="lab-pct-n">' + o.pct + '%</span><span class="lab-pct-t"><b>' + esc(o.name) + '</b><span>' + esc(o.blurb) + '</span><span class="tiny">' + esc(o.research) + '</span><span class="pill">' + esc(o.suits) + '</span></span></label>';
      }).join('') + '</div>' +
      '<div class="lab-split"><div class="lab-split-bar"><span class="f" style="width:' + s.pct + '%"></span><span class="o" style="width:' + (100 - s.pct) + '%"></span></div>' +
      '<p class="tiny"><b>' + fw + '</b> page words + <b>' + own + '</b> words of data and your own language ≈ a ' + L.REPORT_WORDS + '-word report (the target is 160–190).' + (lv.budgetScale ? ' At ' + esc(lv.id) + ' every line is kept short, so the page carries a little less than ' + s.pct + '%: that is fine.' : '') + '</p></div></div>' +
      '<div class="card lab-pad"><p class="kicker">Step 3 · Target level</p><h3>Which level are you writing at?</h3><p class="tiny">On the official IELTS scale, Bands 4–5 are around B1, 5.5–6.5 around B2 and 7–8 around C1. Your page and your variables should sound like the same writer.</p>' +
      '<div class="filters lab-levels">' + L.LEVELS.map(function (l) { return '<button data-lv="' + l.id + '"' + (s.level === l.id ? ' class="on"' : '') + '>' + esc(l.name) + '</button>'; }).join('') + '</div><p class="tiny">' + esc(lv.note) + '</p></div>' +
      (src ? '' : '<div class="card lab-pad"><p class="kicker">Step 4 · Start from</p><div class="lab-types">' +
        '<button class="lab-type' + (s.start === 'blank' ? ' on' : '') + '" data-st="blank"><b>A blank page</b><span>Write every line yourself from the examples. Best for a personal page.</span></button>' +
        '<button class="lab-type' + (s.start === 'class' ? ' on' : '') + '" data-st="class"' + (m ? '' : ' disabled') + '><b>My class template' + (m ? ' (' + m.classId + ')' : '') + '</b><span>The class assignment\'s sentences as a draft. It is long (over 60%): trim every line into your own words.</span></button>' +
      '</div>' + examplesPointer('setup') + '</div>') +
      '<div class="card lab-pad"><p class="kicker">Step ' + (src ? 4 : 5) + ' · Name</p><div class="field"><label for="lab-name">Page name</label><input type="text" id="lab-name" maxlength="48" value="' + esc(s.name || defName) + '"></div></div>' +
      '<p class="lab-cta"><button class="btn primary" id="lab-startbuild"' + (s.mode ? '' : ' disabled title="Choose a mode first"') + '>Start building' + (m ? ': ' + m.lines.length + ' lines' : '') + ' →</button></p>';
    el.innerHTML = html;
    $('#lab-cancel').addEventListener('click', function () { st.view = 'home'; paintBody(); });
    bindExamplesPointer(s.mode);
    $$('[data-md]').forEach(function (b) { b.addEventListener('click', function () { s.mode = b.dataset.md; s.name = ''; paintSetup(el); }); });
    $$('input[name=lab-pct]').forEach(function (r) { r.addEventListener('change', function () { s.pct = +r.value; s.name = ''; paintSetup(el); }); });
    $$('[data-lv]').forEach(function (b) { b.addEventListener('click', function () { s.level = b.dataset.lv; s.name = ''; paintSetup(el); }); });
    $$('[data-st]').forEach(function (b) { b.addEventListener('click', function () { s.start = b.dataset.st; paintSetup(el); }); });
    $('#lab-name').addEventListener('input', function () { s.name = this.value; });
    $('#lab-startbuild').addEventListener('click', function () {
      if (!s.mode) return;
      var t = { id: uid('T'), studentId: st.sid, mode: s.mode, name: (s.name || $('#lab-name').value || 'My page').trim(), version: 1, parentId: '', rootId: '',
        pct: s.pct, level: s.level, status: 'draft', start: s.start || 'blank', lines: {}, slotNotes: {}, createdAt: nowIso(), updatedAt: nowIso() };
      t.rootId = t.id;
      if (src) {
        t.copiedFrom = src.id;
        M(src.mode).lines.forEach(function (c) { var l = src.lines[c.id]; if (l && l.text) t.lines[c.id] = { draft: toLabels(src.mode, l.text) }; });
        Object.keys(src.slotNotes || {}).forEach(function (k) { t.slotNotes[k] = src.slotNotes[k]; });
      } else if (s.start === 'class') {
        var cd = M(s.mode).classDraft || {};
        Object.keys(cd).forEach(function (id) { t.lines[id] = { draft: cd[id], fromClass: true }; });
      }
      saveItem('template', t);
      openBuild(t);
    });
  }

  function openBuild(t, idx) {
    var ls = M(t.mode).lines;
    if (idx == null) { idx = 0; for (var i = 0; i < ls.length; i++) { var ln = t.lines[ls[i].id]; if (!ln || !ln.last) { idx = i; break; } if (i === ls.length - 1) idx = i; } }
    st.build = { tpl: t, idx: idx, fb: null, busy: false };
    st.tab = 'studio'; st.view = 'build';
    paint(); scrollTop();
  }
  function newVersion(src) {
    var t = clone(src);
    t.id = uid('T'); t.version = (src.version || 1) + 1; t.parentId = src.id; t.rootId = src.rootId || src.id;
    t.status = 'draft'; t.createdAt = nowIso(); t.updatedAt = nowIso(); t.completedAt = '';
    M(t.mode).lines.forEach(function (c) { var ln = t.lines[c.id]; if (ln) { ln.base = ln.last ? ln.last.points : 0; ln.tries = 0; ln.bestPts = ln.base; } });
    saveItem('template', t);
    toast('Version ' + t.version + ' started. Points come from improving on version ' + src.version + '.');
    openBuild(t, 0);
  }

  /* ------------------------------------------------------------- builder */
  function paintBuild(el) {
    var b = st.build, t = b.tpl, m = M(t.mode), comp = m.lines[b.idx], ln = t.lines[comp.id] || {}, lv = levelInfo(t.level), tier = lv.tier;
    var budget = compBudget(t.mode, t.pct, comp.id, t.level), para = L.PARAS.filter(function (p) { return p.key === comp.para; })[0];
    var draft = ln.draft != null ? ln.draft : toLabels(t.mode, ln.text || '');
    var others = ['B1', 'B2', 'C1'].filter(function (x) { return x !== tier; });
    var sample = sampleFor(t.mode, comp.id, t.level, st.drive.src !== 'scenario' ? st.drive.src : null), offline = st.ai === false;
    var html = '<div class="lab-back"><button class="btn sm ghost" id="lab-bhome">← All pages</button><span class="tiny">' + esc(t.name) + ' · v' + (t.version || 1) + ' · ' + esc(t.mode) + ' · ' + t.pct + '% · ' + esc(lv.id) + '</span></div>';
    html += '<div class="lab-rail">' + L.PARAS.map(function (pg) {
      return '<div class="lab-rail-g"><span class="kicker">' + esc(pg.short) + '</span><div>' + m.lines.filter(function (c) { return c.para === pg.key; }).map(function (c) {
        var l = t.lines[c.id], cls = c.n - 1 === b.idx ? ' cur' : (l && l.last ? (l.last.errors === 0 && (l.last.fnv === 'meets' || !l.last.ai) ? ' ok' : ' done') : '');
        return '<button class="lab-dot' + cls + '" data-go="' + (c.n - 1) + '" title="' + esc(c.n + '. ' + c.name) + '" aria-label="Line ' + c.n + ': ' + esc(c.name) + '">' + c.n + '</button>';
      }).join('') + '</div></div>';
    }).join('') + '</div>';
    html += '<div class="card lab-comp">' +
      '<p class="kicker">' + esc(para.name) + ' · line ' + comp.n + ' of ' + m.lines.length + '</p>' +
      '<h3>' + esc(comp.name) + '</h3>' +
      '<p class="lab-fn">' + esc(comp.fn) + '</p>' +
      (ln.fromClass && !ln.last ? '<p class="lab-typenote">This draft is your class template (' + esc(m.classId) + '). It is longer than your budget: cut the words that carry no meaning and say the rest your way.</p>' : '') +
      '<div class="lab-why"><div class="lab-pills">' + comp.crit.map(function (k) { return '<span class="pill on">' + k + '</span>'; }).join('') + '<span class="pill gold">≈ ' + budget.target + ' page words (' + budget.lo + '–' + budget.hi + ')</span></div><p>' + esc(comp.why) + '</p><p class="tiny"><b>Watch out:</b> ' + esc(comp.tip) + '</p></div>' +
      '<div class="lab-ex"><div class="lab-ex-h"><b>Study these, then write your own' + (lv.id !== tier ? ' <span class="tiny">(' + esc(tier) + ' examples: at ' + esc(lv.id) + ', keep yours shorter)</span>' : '') + '</b><button class="linky" id="lab-othertier">' + (st.showOtherTier ? 'Hide' : 'Show') + ' the ' + others.join(' and ') + ' versions</button></div>' +
        comp.examples[tier].map(function (e) { return '<div class="lab-exrow">' + slotChips(t.mode, e) + '</div>'; }).join('') +
        (st.showOtherTier ? others.map(function (o) { return '<p class="kicker" style="margin-top:8px">' + o + '</p>' + comp.examples[o].map(function (e) { return '<div class="lab-exrow alt">' + slotChips(t.mode, e) + '</div>'; }).join(''); }).join('') : '') +
        (sample ? '<div class="lab-sample-wrap"><button class="linky" id="lab-bsample" aria-expanded="' + (st.showSample ? 'true' : 'false') + '">' + (st.showSample ? 'Hide the example' : 'Show an example: one whole line, filled in') + '</button>' + (st.showSample ? sampleHtml(sample, t.level) : '') + '</div>' : '') +
      '</div>' +
      '<div class="lab-write"><div class="lab-slotbtns"><span class="tiny">Insert:</span>' + comp.slots.map(function (k) { return '<button class="lab-slotbtn" data-ins="' + k + '" title="' + esc(m.VAR[k].job) + '">[' + esc(m.SLOT_LABEL[k]) + ']</button>'; }).join('') + '</div>' +
        '<ul class="lab-slotjobs">' + comp.slots.map(function (k) { return '<li><b>[' + esc(m.SLOT_LABEL[k]) + ']</b> ' + esc(m.VAR[k].job) + ' <span class="tiny">' + esc(m.VAR[k].shape) + '</span></li>'; }).join('') + '</ul>' +
        '<label class="sr" for="lab-line">Your line</label><textarea id="lab-line" rows="3" spellcheck="true" placeholder="Write the line in your own words and include ' + comp.slots.map(function (k) { return '[' + m.SLOT_LABEL[k] + ']'; }).join(' and ') + '">' + esc(draft) + '</textarea>' +
        '<div class="lab-meter"><span id="lab-wc" class="lab-num">0 words</span><div class="bar-line thin"><span id="lab-wbar"></span></div></div>' +
        '<div class="lab-preview" id="lab-preview"></div>' +
      '</div>' +
      (driveOk(t.mode) ? '<div id="lab-drive"></div>' : '') +
      '<div class="lab-acts"><button class="btn primary" id="lab-coach"' + (b.busy ? ' disabled' : '') + '>' + (offline ? (ln.tries ? 'Check line again' : 'Check line') + (b.idx < m.lines.length - 1 ? ' →' : '') : (ln.tries ? 'Coach me again' : 'Coach me')) + '</button><span class="tiny" id="lab-tries">' + (ln.tries ? 'Try ' + (ln.tries + 1) + ' · best so far ' + (ln.bestPts || 0) + ' pts' : (offline ? 'Quick check only (no AI coach): a clean line goes straight on to the next one.' : '')) + '</span></div>' +
      '<div id="lab-fb">' + (b.fb && b.fb.fromLine && b.fb.fromLine !== comp.n ? '<div class="lab-fb lab-fb-prev"><p class="lab-ok">Line ' + b.fb.fromLine + ' checked: ' + b.fb.points + ' pts, no errors found' + (b.fb.gain ? ' (+' + b.fb.gain + ' Workshop points)' : '') + '. Now line ' + comp.n + '.</p></div>'
        : b.fb ? renderFeedback(b.fb, { kind: 'frame' }) : (ln.last ? '<p class="kicker">Last coaching</p>' + renderFeedback(ln.last, { kind: 'frame', stored: true }) : '')) + '</div>' +
    '</div>';
    html += '<div class="lab-nav"><button class="btn" id="lab-prev"' + (b.idx === 0 ? ' disabled' : '') + '>← Previous line</button><button class="btn ghost" id="lab-savedraft">Save draft</button>' +
      (b.idx < m.lines.length - 1 ? '<button class="btn primary" id="lab-next"' + (ln.last ? '' : ' disabled title="Get coaching on this line first"') + '>Next line →</button>'
        : '<button class="btn primary" id="lab-finishbp"' + (tplDone(t) === m.lines.length ? '' : ' disabled title="Every line needs coaching first"') + '>Review the page →</button>') + '</div>';
    el.innerHTML = html;

    var ta = $('#lab-line');
    function live() {
      var conv = toTokens(t.mode, ta.value), n = frameWords(conv.text);
      $('#lab-wc').textContent = n + ' page word' + (n === 1 ? '' : 's') + ' · target ' + budget.lo + '–' + budget.hi;
      $('#lab-wbar').style.width = Math.min(100, Math.round(n / budget.hi * 100)) + '%';
      $('#lab-wbar').parentNode.className = 'bar-line thin' + (n > budget.hi ? ' over' : n >= budget.lo ? '' : ' gold');
      $('#lab-preview').innerHTML = ta.value.trim() ? slotChips(t.mode, conv.text) : '<span class="tiny">Your line will appear here with its slots highlighted.</span>';
      ln.draft = ta.value;
      if (st.drive.open) refreshDrive(t, comp, conv.text);
    }
    paintDriveBuild(t, comp, toTokens(t.mode, ta.value).text);
    ta.addEventListener('input', live); live();
    $$('[data-ins]').forEach(function (btn) { btn.addEventListener('click', function () { insertAtCursor(ta, '[' + m.SLOT_LABEL[btn.dataset.ins] + ']'); live(); }); });
    $('#lab-othertier').addEventListener('click', function () { st.showOtherTier = !st.showOtherTier; keepDraft(); paintBuild(el); });
    var bs = $('#lab-bsample'); if (bs) bs.addEventListener('click', function () { st.showSample = !st.showSample; keepDraft(); paintBuild(el); });
    $('#lab-bhome').addEventListener('click', function () { keepDraft(); st.view = 'home'; st.build = null; paintBody(); });
    $$('[data-go]').forEach(function (d) { d.addEventListener('click', function () { keepDraft(); b.idx = +d.dataset.go; b.fb = null; paintBuild(el); }); });
    $('#lab-prev').addEventListener('click', function () { keepDraft(); b.idx--; b.fb = null; paintBuild(el); scrollTop(); });
    var nx = $('#lab-next'); if (nx) nx.addEventListener('click', function () { keepDraft(); b.idx++; b.fb = null; paintBuild(el); scrollTop(); });
    var fin = $('#lab-finishbp'); if (fin) fin.addEventListener('click', function () { keepDraft(); st.view = 'summary'; paintBody(); scrollTop(); });
    $('#lab-savedraft').addEventListener('click', function () { keepDraft(); saveItem('template', t).then(function (ok) { toast(savedMsg(ok, 'Draft saved')); }); });
    $('#lab-coach').addEventListener('click', function () { coachLine(); });
    function keepDraft() { ln.draft = ta.value; t.lines[comp.id] = ln; persist(); }
  }
  function insertAtCursor(ta, txt) {
    var s = ta.selectionStart || 0, e = ta.selectionEnd || 0, v = ta.value;
    var pre = v.slice(0, s), post = v.slice(e);
    if (pre && !/\s$/.test(pre)) txt = ' ' + txt;
    if (post && !/^[\s.,;:]/.test(post)) txt = txt + ' ';
    ta.value = pre + txt + post;
    var pos = (pre + txt).length; ta.focus(); try { ta.setSelectionRange(pos, pos); } catch (err) {}
  }

  function coachLine() {
    var b = st.build, t = b.tpl, m = M(t.mode), comp = m.lines[b.idx], ln = t.lines[comp.id] || (t.lines[comp.id] = {});
    var raw = $('#lab-line').value, q = quickFrame(t.mode, comp, raw, t.pct, t.level);
    if (q.blocking.length) { b.fb = { blocking: q.blocking }; $('#lab-fb').innerHTML = renderFeedback(b.fb, { kind: 'frame' }); return; }
    b.busy = true; $('#lab-coach').disabled = true; $('#lab-fb').innerHTML = coachWaiting();
    var lv = levelInfo(t.level);
    var ask = st.ai === false ? Promise.reject(new Error('offline')) : server('lab.coach', {
      kind: 'frame', task: 1, mode: t.mode, level: lv.id, band: lv.band, pct: t.pct,
      component: { id: comp.id, name: comp.name, fn: comp.fn, why: comp.why, slots: comp.slots.map(function (k) { return m.SLOT_LABEL[k] + ' (' + m.VAR[k].job + ')'; }), paragraph: paraName(comp.para) },
      line: toLabels(t.mode, q.text), words: q.words, budget: { lo: q.budget.lo, hi: q.budget.hi },
      context: m.lines.filter(function (c) { return c.para === comp.para && c.id !== comp.id && t.lines[c.id] && t.lines[c.id].text; }).map(function (c) { return toLabels(t.mode, t.lines[c.id].text); })
    }, TIMEOUT_COACH).then(function (r) { return r.coach; });
    ask.catch(function (e) { st.lastAiError = String(e && e.message || e); return null; }).then(function (ai) {
      b.busy = false;
      var sc = scoreOf(q, ai, { level: lv.id });
      var fb = compactFb(q, ai, sc);
      ln.text = q.text; ln.draft = toLabels(t.mode, q.text); ln.tries = (ln.tries || 0) + 1; ln.last = fb;
      var floor = Math.max(ln.bestPts || 0, ln.base || 0), gain = Math.max(0, sc.total - floor);
      fb.gain = gain; fb.improved = ln.tries > 1 && sc.total > (ln.bestPts || 0);
      ln.bestPts = Math.max(ln.bestPts || 0, sc.total);
      if (ai && ai.slotForm && comp.slots.length === 1) t.slotNotes[comp.slots[0]] = String(ai.slotForm).slice(0, 180);
      t.lines[comp.id] = ln;
      b.fb = fb;
      saveItem('template', t);
      award(gain);
      if (st.build === b && st.view === 'build') {
        /* WP23: offline ("Check line →") a clean line moves straight on; the
           feedback stays in the rail dot and the line's "Last coaching" */
        var clean = !ai && st.ai === false && fb.errors === 0 && !(fb.issues || []).some(function (i) { return i.kind === 'warn'; }) && !q.blocking.length;
        if (clean && b.idx < m.lines.length - 1) {
          b.idx++; fb.fromLine = comp.n; b.fb = fb;
          paintBuild(body()); scrollTop();
          toast('Line ' + comp.n + ' checked: ' + sc.total + ' pts, no errors found. On to line ' + (comp.n + 1) + '.');
          return;
        }
        paintBuild(body());
        var fbEl = $('#lab-fb'); if (fbEl) try { fbEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); } catch (e2) {}
      }
    });
  }
  function coachWaiting() { return '<div class="lab-wait"><span class="lab-spin"></span> The coach is reading…</div>'; }

  /* Keep feedback small enough to store with the page / cast. */
  function compactFb(q, ai, sc) {
    var errs = mergedErrors(q, ai).slice(0, 8).map(function (e) { return { original: String(e.original || '').slice(0, 80), correction: String(e.correction || '').slice(0, 80), type: e.type || '', explain: String(e.explain || '').slice(0, 160) }; });
    return {
      ai: !!ai, points: sc.total, rows: sc.rows, errors: errs.length, errorList: errs,
      fnv: ai && ai.fn ? ai.fn.verdict : '', fnc: ai && ai.fn ? String(ai.fn.comment || '').slice(0, 300) : '',
      cefr: ai ? ai.cefr || '' : '', band: ai && ai.band != null ? ai.band : null,
      tip: ai ? String(ai.tip || '').slice(0, 300) : '', praise: ai ? String(ai.praise || '').slice(0, 240) : '',
      generic: ai && ai.generic ? { ok: !!ai.generic.ok, note: String(ai.generic.note || '').slice(0, 200) } : null,
      accuracy: ai && ai.accuracy ? { ok: !!ai.accuracy.ok, note: String(ai.accuracy.note || '').slice(0, 200) } : null,
      fit: ai && ai.fit ? { ok: !!ai.fit.ok, note: String(ai.fit.note || '').slice(0, 200) } : null,
      slotForm: ai && ai.slotForm ? String(ai.slotForm).slice(0, 180) : '',
      data: q.data ? { status: q.data.status, note: String(q.data.note || '').slice(0, 260) } : null,
      words: q.words, budget: { lo: q.budget.lo, hi: q.budget.hi, ok: q.budget.ok }, copied: !!q.copied,
      issues: (q.issues || []).map(function (i) { return { kind: i.kind, msg: String(i.msg).slice(0, 240) }; }).slice(0, 8),
      offlineWhy: ai ? '' : (st.ai === false ? st.aiNote : 'The coach could not be reached this time, so only the quick check ran.'),
      ts: nowIso()
    };
  }
  var MARK = { ok: '✓', near: '≈', bad: '✗', none: '·' };
  function dataBadge(d) {
    if (!d || d.status === 'none') return '';
    return '<div class="lab-data ' + d.status + '"><span class="lab-data-m" aria-hidden="true">' + MARK[d.status] + '</span><div><b>' + (d.status === 'ok' ? 'True to the chart' : d.status === 'near' ? 'Nearly: check this' : 'Not what the chart shows') + '</b><p>' + esc(d.note) + '</p></div></div>';
  }
  function renderFeedback(fb, opts) {
    opts = opts || {};
    if (fb.blocking) return '<div class="lab-fb bad"><b>Fix this first</b><ul>' + fb.blocking.map(function (m) { return '<li>' + esc(m) + '</li>'; }).join('') + '</ul></div>';
    var target = opts.level ? cefrIdx(opts.level) : -1;
    var html = '<div class="lab-fb">';
    html += '<div class="lab-fb-top"><div class="lab-score"><b class="lab-num">' + fb.points + '</b><span>pts</span></div><div class="lab-fb-rows">' +
      (fb.rows || []).map(function (r) { return '<span class="lab-row' + (r[1] > 0 ? ' plus' : '') + '">' + esc(r[0]) + ' <i>' + (r[1] > 0 ? '+' + r[1] : '0') + '</i></span>'; }).join('') + '</div></div>';
    if (!opts.stored && fb.gain != null) html += '<p class="lab-gain">' + (fb.gain > 0 ? '+' + fb.gain + ' Workshop points' + (fb.improved ? ': better than your last try' : '') : 'No new points: beat your best on this ' + (opts.kind === 'frame' ? 'line' : 'slot') + ' to earn more.') + '</p>';
    html += dataBadge(fb.data);
    if (!fb.ai) html += '<p class="lab-offline">Quick check only. ' + esc(fb.offlineWhy || '') + '</p>';
    var chips = [];
    if (fb.cefr) chips.push('<span class="pill ' + (target >= 0 && cefrIdx(fb.cefr) < target ? 'bad' : 'good') + '">CEFR ' + esc(fb.cefr) + '</span>');
    if (fb.band != null) chips.push('<span class="pill">≈ Band ' + fmtBand(fb.band) + ' language</span>');
    if (fb.budget) chips.push('<span class="pill ' + (fb.budget.ok ? 'good' : 'gold') + '">' + fb.words + ' ' + (opts.kind === 'frame' ? 'page ' : '') + 'words · target ' + fb.budget.lo + '–' + fb.budget.hi + '</span>');
    if (fb.fnv) chips.push('<span class="pill ' + (fb.fnv === 'meets' ? 'good' : fb.fnv === 'partly' ? 'gold' : 'bad') + '">Job: ' + (fb.fnv === 'meets' ? 'done' : fb.fnv === 'partly' ? 'partly done' : 'not yet') + '</span>');
    html += '<div class="lab-pills">' + chips.join('') + '</div>';
    if (fb.fnc) html += '<p class="lab-fn-c"><b>Does it do its job?</b> ' + esc(fb.fnc) + '</p>';
    if (fb.errorList && fb.errorList.length) html += '<div class="lab-errs"><b>' + fb.errorList.length + ' to fix</b>' + fb.errorList.map(function (e) {
      return '<div class="lab-err"><span class="pill bad">' + esc(e.type || 'error') + '</span> <s>' + esc(e.original) + '</s> → <b>' + esc(e.correction) + '</b>' + (e.explain ? '<span class="tiny"> ' + esc(e.explain) + '</span>' : '') + '</div>';
    }).join('') + '</div>';
    else html += '<p class="lab-ok">' + (fb.ai ? 'No spelling, grammar or punctuation errors.' : 'No errors found by the quick check.') + '</p>';
    var notes = [];
    if (fb.generic && !fb.generic.ok) notes.push({ kind: 'warn', msg: 'Not reusable yet: ' + fb.generic.note });
    if (fb.accuracy && !fb.accuracy.ok) notes.push({ kind: 'warn', msg: 'Accuracy: ' + fb.accuracy.note });
    if (fb.fit && !fb.fit.ok) notes.push({ kind: 'warn', msg: 'Fit with your frame: ' + fb.fit.note });
    notes = notes.concat(fb.issues || []);
    if (fb.slotForm) notes.push({ kind: 'tip', msg: (opts.kind === 'frame' ? 'When you fill it: ' : '') + fb.slotForm });
    if (notes.length) html += '<ul class="lab-notes">' + notes.map(function (n) { return '<li class="' + n.kind + '">' + esc(n.msg) + '</li>'; }).join('') + '</ul>';
    if (fb.praise) html += '<p class="lab-praise"><b>Well done:</b> ' + esc(fb.praise) + '</p>';
    if (fb.tip) html += '<p class="lab-tip"><b>Next step:</b> ' + esc(fb.tip) + '</p>';
    return html + '</div>';
  }

  /* ------------------------------------------------------------ summary */
  function paintSummary(el) {
    var b = st.build, t = b.tpl, m = M(t.mode), lv = levelInfo(t.level), score = tplScore(t), max = lineMax(t.mode), n = m.lines.length;
    var fw = templateFrameWords(t.mode, t), clean = m.lines.filter(function (c) { var l = t.lines[c.id]; return l && l.last && l.last.errors === 0; }).length;
    var html = '<div class="lab-back"><button class="btn sm ghost" id="lab-shome">← All pages</button></div>';
    html += '<div class="card lab-pad"><p class="kicker">' + (t.status === 'complete' ? 'Spellbook page' : 'Review before saving') + ' · v' + (t.version || 1) + ' · ' + esc(t.mode) + '</p><h3>' + esc(t.name) + '</h3>' +
      '<div class="lab-kpis">' +
        kpi(Math.round(score / max * 100) + '%', 'Page score', score + ' / ' + max + ' pts') +
        kpi(fw, 'Page words', 'budget ≈ ' + frameBudget(t.pct, t.level)) +
        kpi(pctStr(fw / L.REPORT_WORDS), 'Predicted share', 'in a ' + L.REPORT_WORDS + '-word report (target ' + t.pct + '%)') +
        kpi(clean + '/' + n, 'Error-free lines', esc(lv.id)) +
      '</div></div>';
    if (driveOk(t.mode)) html += driveFullHtml(t);
    html += L.PARAS.map(function (pg) {
      return '<div class="card lab-para"><p class="kicker">' + esc(pg.name) + '</p>' + m.lines.filter(function (c) { return c.para === pg.key; }).map(function (c) {
        var l = t.lines[c.id] || {}, f = l.last;
        return '<div class="lab-sline"><div class="lab-sline-t">' + (l.text ? slotChips(t.mode, l.text) : '<span class="tiny">(empty)</span>') + '</div><div class="lab-sline-m"><span class="tiny">' + c.n + '. ' + esc(c.name) + '</span>' +
          (f ? '<span class="pill ' + (f.errors === 0 ? 'good' : 'bad') + '">' + (f.errors === 0 ? 'no errors' : f.errors + ' error' + (f.errors > 1 ? 's' : '')) + '</span>' + (f.cefr ? '<span class="pill">' + esc(f.cefr) + '</span>' : '') + '<span class="pill gold">' + f.points + ' pts</span>' : '') +
          (!b.readOnly ? '<button class="linky" data-edit="' + (c.n - 1) + '">edit</button>' : '') + '</div></div>';
      }).join('') + '</div>';
    }).join('');
    if (t.status === 'complete') html += '<div class="lab-nav"><button class="btn" id="lab-sver">New version</button>' + (inUseId(t.mode) !== t.id ? '<button class="btn ghost" id="lab-sbook">Put in My Spellbook</button>' : '<span class="pill good">in My Spellbook</span>') + '<button class="btn primary" id="lab-suse">Cast it on a chart →</button></div>';
    else html += '<div class="lab-nav"><button class="btn" id="lab-sback">← Back to line ' + n + '</button><button class="btn primary" id="lab-save"' + (tplDone(t) === n ? '' : ' disabled') + '>Save the page (+' + L.POINTS.blueprint + ')</button></div>';
    el.innerHTML = html;
    if (driveOk(t.mode)) bindDriveFull(t, function repaintDrive() {
      var box = $('#lab-drivefull'); if (!box) return;
      var tmp = document.createElement('div'); tmp.innerHTML = driveFullHtml(t);
      box.parentNode.replaceChild(tmp.firstChild, box);
      bindDriveFull(t, repaintDrive);
    });
    $('#lab-shome').addEventListener('click', function () { st.view = 'home'; st.build = null; paintBody(); });
    $$('[data-edit]').forEach(function (x) { x.addEventListener('click', function () { openBuild(t, +x.dataset.edit); }); });
    var sv = $('#lab-save');
    if (sv) sv.addEventListener('click', function () {
      t.status = 'complete'; t.completedAt = nowIso(); t.score = tplScore(t); t.frameWords = templateFrameWords(t.mode, t);
      var parent = t.parentId ? getTpl(t.parentId) : null;
      var bonus = !parent || t.score > (parent.score || tplScore(parent)) ? L.POINTS.blueprint : 0;
      st.data.inUse = st.data.inUse || {}; st.data.inUse[t.mode] = t.id;
      saveItem('template', t).then(function (ok) { toast(savedMsg(ok, 'Page saved')); });
      award(bonus);
      if (parent && !bonus) toast('Saved. No bonus this time: a new version earns it by scoring higher than version ' + parent.version + '.');
      afterMilestone();
      st.build.readOnly = true;
      paintSummary(el);
    });
    var sb = $('#lab-sback'); if (sb) sb.addEventListener('click', function () { openBuild(t, n - 1); });
    var vr = $('#lab-sver'); if (vr) vr.addEventListener('click', function () { newVersion(t); });
    var bk = $('#lab-sbook'); if (bk) bk.addEventListener('click', function () { useInBook(t); paintSummary(el); });
    var us = $('#lab-suse'); if (us) us.addEventListener('click', function () { st.asmTemplate = t.id; st.tab = 'assembly'; st.run = null; paint(); scrollTop(); });
  }

  /* ================================================== CAST IT ON A CHART */
  function slotOrder(mode, tpl) {
    var order = [];
    M(mode).lines.forEach(function (c) { tokensIn((tpl.lines[c.id] || {}).text || '').forEach(function (k) { if (order.indexOf(k) < 0) order.push(k); }); });
    return order;
  }
  function paintAsmHome(el) {
    var tpls = completeTemplates();
    if (!tpls.length) {
      el.innerHTML = '<div class="card lab-pad lab-emptycard"><p class="kicker">Cast it on a chart</p><h3>Design a page first</h3><p>Casting fills your own page with the data of a real chart. Save a complete page in Design, then come back.</p><button class="btn primary" id="lab-gostudio">Open Design →</button></div>' + draftRunsHtml();
      $('#lab-gostudio').addEventListener('click', function () { st.tab = 'studio'; st.view = 'home'; paint(); });
      bindDraftRuns();
      return;
    }
    if (!st.asmTemplate || !getTpl(st.asmTemplate) || getTpl(st.asmTemplate).status !== 'complete') st.asmTemplate = tpls[0].id;
    var t = getTpl(st.asmTemplate);
    var done = {}; st.data.attempts.forEach(function (a) { if (a.status === 'complete') done[a.promptId] = (done[a.promptId] || 0) + 1; });
    var all = promptsOf(t.mode), list = all.filter(function (pr) { return D.fits(pr, t.mode).ok; }), skipped = all.filter(function (pr) { return !D.fits(pr, t.mode).ok; });
    var html = draftRunsHtml();
    html += '<div class="card lab-pad"><p class="kicker">Step 1 · Your page</p><div class="lab-row2"><label class="sr" for="lab-tsel">Page</label><select id="lab-tsel" class="lab-select">' + tpls.map(function (x) {
      return '<option value="' + x.id + '"' + (x.id === t.id ? ' selected' : '') + '>' + esc(x.mode) + ' · ' + esc(x.name) + ' · v' + (x.version || 1) + ' · ' + x.pct + '% · ' + esc(x.level) + '</option>';
    }).join('') + '</select><span class="pill on">' + esc(t.mode) + '</span><span class="pill gold">' + t.pct + '%</span></div>' +
      '<p class="tiny">Only ' + esc(t.mode) + ' charts fit this page. ' + esc(M(t.mode).tense) + '</p></div>';
    html += '<div class="card lab-pad"><p class="kicker">Step 2 · Timing</p><div class="lab-timings">' + L.TIMINGS.map(function (o) {
      return '<label class="lab-timing' + (st.asmTiming === o.id ? ' on' : '') + '"><input type="radio" name="lab-timing" value="' + o.id + '"' + (st.asmTiming === o.id ? ' checked' : '') + '><b>' + esc(o.name) + '</b><span class="tiny">' + esc(o.blurb) + '</span></label>';
    }).join('') + '</div><p class="tiny">The clock pauses while the coach is reading and while you read the feedback.</p></div>';
    html += '<div class="card lab-pad"><p class="kicker">Step 3 · Chart</p><p class="lab-cta" style="margin:0 0 10px"><button class="btn sm" id="lab-random">Random ' + esc(t.mode) + ' chart</button></p>' +
      '<div class="promptgrid lab-prompts">' + list.map(function (pr) {
        return '<button class="pcard' + (done[pr.id] ? ' done' : '') + '" data-pp="' + pr.id + '"><span class="pcard-t">' + esc(pr.title) + '</span><span class="pcard-m"><span class="pill gold">' + esc(typeName(pr.type)) + '</span><span class="pill">' + esc(pr.level || '') + '</span>' + (done[pr.id] ? '<span class="pill good">done ' + done[pr.id] + '×</span>' : '') + '</span><span class="pcard-r">' + esc(pr.rubric) + '</span></button>';
      }).join('') + '</div>' + (skipped.length ? '<p class="tiny">Not here: ' + skipped.map(function (pr) { return esc(pr.title); }).join(', ') + '. ' + esc(D.fits(skipped[0], t.mode).why) + '</p>' : '') + '</div>';
    el.innerHTML = html;
    bindDraftRuns();
    $('#lab-tsel').addEventListener('change', function () { st.asmTemplate = this.value; paintAsmHome(el); });
    $$('input[name=lab-timing]').forEach(function (r) { r.addEventListener('change', function () { st.asmTiming = r.value; $$('.lab-timing').forEach(function (x) { x.classList.toggle('on', x.querySelector('input').checked); }); }); });
    $('#lab-random').addEventListener('click', function () { startRun(t, list[Math.floor(Math.random() * list.length)], st.asmTiming); });
    $$('[data-pp]').forEach(function (b) { b.addEventListener('click', function () { startRun(t, promptById(b.dataset.pp), st.asmTiming); }); });
  }
  function draftRunsHtml() {
    var drafts = st.data.attempts.filter(function (a) { return a.status === 'draft'; });
    if (!drafts.length) return '';
    return '<div class="card lab-pad lab-drafts"><p class="kicker">Unfinished casts</p>' + drafts.map(function (a) {
      var filled = Object.keys(a.vars || {}).filter(function (k) { return a.vars[k].last; }).length;
      return '<div class="lab-draftrow"><span><b>' + esc(a.promptTitle) + '</b> <span class="tiny">' + esc(a.mode) + ' · ' + a.pct + '% · ' + filled + ' variables done · ' + esc(fmtDate(a.updatedAt)) + '</span></span><span><button class="btn sm" data-resume="' + a.id + '">Continue</button> <button class="btn sm ghost" data-drop="' + a.id + '">Discard</button></span></div>';
    }).join('') + '</div>';
  }
  function bindDraftRuns() {
    $$('[data-resume]').forEach(function (b) { b.addEventListener('click', function () { resumeRun(st.data.attempts.filter(function (a) { return a.id === b.dataset.resume; })[0]); }); });
    $$('[data-drop]').forEach(function (b) { b.addEventListener('click', function () {
      if (!confirm('Discard this unfinished cast?')) return;
      st.data.attempts = st.data.attempts.filter(function (a) { return a.id !== b.dataset.drop; });
      delete st.data.dirty[b.dataset.drop]; persist();
      server('lab.deleteAttempt', { id: b.dataset.drop }, TIMEOUT_SAVE).catch(function () {});
      paintBody();
    }); });
  }

  /* ------------------------------------------------------------ run state */
  function startRun(tpl, pr, timing, parent) {
    if (!pr) return;
    var a = {
      id: uid('A'), studentId: st.sid, templateId: tpl.id, templateName: tpl.name, templateVersion: tpl.version || 1, mode: tpl.mode,
      pct: tpl.pct, level: tpl.level, promptId: pr.id, promptTitle: pr.title, type: pr.type, timing: parent ? 'none' : timing,
      version: parent ? (maxVersion(parent.rootId || parent.id) + 1) : 1, parentId: parent ? parent.id : '', rootId: parent ? (parent.rootId || parent.id) : '',
      status: 'draft', vars: {}, clock: { elapsed: 0 }, createdAt: nowIso(), updatedAt: nowIso()
    };
    if (!a.rootId) a.rootId = a.id;
    if (parent) Object.keys(parent.vars || {}).forEach(function (k) { var v = parent.vars[k]; a.vars[k] = { text: v.text || '', text2: v.text2 || '', base: v.last ? v.last.points : 0 }; });
    saveItem('attempt', a);
    resumeRun(a, tpl, pr);
  }
  function maxVersion(rootId) { return st.data.attempts.reduce(function (m, x) { return (x.rootId === rootId || x.id === rootId) ? Math.max(m, x.version || 1) : m; }, 1); }
  function resumeRun(a, tpl, pr) {
    tpl = tpl || getTpl(a.templateId); pr = pr || promptById(a.promptId);
    if (!tpl || !pr) { toast('That cast\'s page or chart is no longer available.'); return; }
    var order = slotOrder(tpl.mode, tpl), occ = occurrences(tpl.mode, tpl), idx = 0;
    for (var i = 0; i < order.length; i++) { if (!(a.vars[order[i]] && a.vars[order[i]].last)) { idx = i; break; } if (i === order.length - 1) idx = i; }
    st.run = { a: a, tpl: tpl, pr: pr, mode: tpl.mode, order: order, occ: occ, idx: idx,
      elapsed: (a.clock && a.clock.elapsed) || 0, cardElapsed: 0, running: false, last: 0, phase: 'edit', fb: null, busy: false, done: false, showModel: false, autos: 0, overtime: false,
      chartOpen: true };
    var v0 = a.vars[order[idx]]; if (v0 && v0.last) { st.run.phase = 'feedback'; st.run.fb = v0.last; }
    /* WP19: a timed cast opens on a Start card, so the chart can be studied
       before the first minute begins (resumed casts carry on where they were) */
    if (a.timing === '1min' && st.run.phase === 'edit' && !order.some(function (k) { return a.vars[k] && a.vars[k].last; })) st.run.phase = 'start';
    st.tab = 'assembly';
    paint(); scrollTop();
  }

  /* --------------------------------------------------------------- clock */
  /* Seconds per card in a 1-minute cast: 60, or 90 for the intro paraphrase
     slot (check type 'what': What It Shows / What It Compares / Place). */
  function perCard(key) {
    var r = st.run; if (!r) return 60;
    var g = M(r.mode).VAR[key || r.order[r.idx]];
    return g && g.check && g.check.type === 'what' ? 90 : 60;
  }
  function startClock() { var r = st.run; if (!r || r.running || r.done) return; r.running = true; r.last = Date.now(); ensureTick(); }
  function pauseClock() {
    var r = st.run; if (!r || !r.running) return;
    var d = (Date.now() - r.last) / 1000; r.elapsed += d; r.cardElapsed += d; r.running = false;
    r.a.clock = { elapsed: Math.round(r.elapsed) };
  }
  function ensureTick() {
    if (st.tick) return;
    st.tick = setInterval(function () {
      var r = st.run;
      if (!r || r.done) { clearInterval(st.tick); st.tick = null; return; }
      if (!root || !document.body.contains(root) || (root.closest && root.closest('.hidden'))) { pauseClock(); return; }
      if (!r.running) return;
      var now = Date.now(), d = (now - r.last) / 1000; r.last = now; r.elapsed += d; r.cardElapsed += d;
      paintClock();
      if (r.a.timing === '20' && !r.overtime && r.elapsed >= 1200) timeUp();
      if (r.a.timing === '1min' && r.phase === 'edit' && r.cardElapsed >= perCard() && !r.busy) { r.busy = true; checkVar(true); }
    }, 250);
  }
  function paintClock() {
    var r = st.run, el = $('#lab-clock'); if (!el || !r) return;
    var t;
    if (r.a.timing === '20' && r.elapsed > 1200) { el.textContent = '+' + mmss(r.elapsed - 1200); el.classList.add('low'); return; }
    if (r.a.timing === '20') t = 1200 - r.elapsed;
    else if (r.a.timing === '1min') t = perCard() - r.cardElapsed;
    else t = r.elapsed;
    el.textContent = mmss(Math.max(0, t));
    el.classList.toggle('low', r.a.timing !== 'none' && t <= (r.a.timing === '20' ? 180 : 10));
    var ring = $('#lab-ring'); if (ring && r.a.timing === '1min') ring.style.setProperty('--p', Math.max(0, Math.min(100, (perCard() - r.cardElapsed) / perCard() * 100)));
  }
  function timeUp() {
    var r = st.run; pauseClock(); r.overtime = true;
    if (host.modal) {
      host.modal('<div class="seal">⏱</div><p class="kicker">20 minutes</p><h3>Time is up</h3><p style="color:var(--ink-2)">In the exam you would stop here. Finish now to see your report, or keep going without the on-time bonus.</p><button class="btn primary wide" id="lab-tu-finish">Finish now</button><button class="btn wide" data-close>Keep going</button>');
      var f = document.getElementById('lab-tu-finish');
      if (f) f.addEventListener('click', function () { var slot = document.getElementById('modal-slot'); if (slot) slot.innerHTML = ''; finishRun(); });
      var k = document.querySelector('#modal-slot [data-close]');
      if (k) k.addEventListener('click', function () { if (st.run === r && r.phase === 'edit') startClock(); });
    }
  }

  /* ----------------------------------------------------------- run card */
  function paintRun(el) {
    var r = st.run, a = r.a, m = M(r.mode), key = r.order[r.idx], g = m.VAR[key] || {}, v = a.vars[key] || (a.vars[key] = { text: '', text2: '' });
    var pr = r.pr, needs2 = (r.occ[key] || 0) > 1, budget = varBudget(r.mode, r.tpl, key);
    var tries = v.tries || 0, maxT = a.timing === '1min' ? 1 : MAX_TRIES, canRetry = tries < maxT;
    var runPts = Object.keys(a.vars).reduce(function (s, k) { return s + (a.vars[k].gained || 0); }, 0);
    var html = '<div class="lab-runbar"><div class="lab-runbar-l"><b class="lab-runt">' + esc(pr.title) + '</b><span class="tiny">' + esc(r.mode) + ' · ' + esc(typeName(pr.type)) + ' · ' + a.pct + '%' + (a.version > 1 ? ' · version ' + a.version : '') + '</span></div>' +
      '<div class="lab-runbar-r"><span class="tiny">' + (r.idx + 1) + '/' + r.order.length + '</span><span class="combo">' + runPts + ' pts</span>' +
      (a.timing === '1min' ? '<span class="lab-ring" id="lab-ring"><b id="lab-clock" class="wr-clock">' + mmss(perCard(key)) + '</b></span>' : '<b id="lab-clock" class="wr-clock">' + (a.timing === '20' ? '20:00' : '0:00') + '</b>') + '</div></div>';
    html += '<details class="card lab-chartbox"' + (r.chartOpen ? ' open' : '') + ' id="lab-chartbox"><summary><b>The chart</b> <span class="tiny">tap a bar, point or cell to read its value</span></summary><div id="lab-chart"></div></details>';
    html += '<div class="lab-prog">' + r.order.map(function (k, i) { var x = a.vars[k]; var dst = x && x.last && x.last.data ? x.last.data.status : ''; return '<span class="lab-pdot' + (i === r.idx ? ' cur' : x && x.last ? (dst === 'ok' ? ' ok' : dst === 'bad' ? ' bad' : ' done') : '') + '" title="' + esc(m.SLOT_LABEL[k]) + '"></span>'; }).join('') + '</div>';
    if (r.phase === 'start') {
      /* WP19: study the chart first; the clock starts on Start */
      var longKeys = r.order.filter(function (k) { return perCard(k) > 60; }).map(function (k) { return '[' + m.SLOT_LABEL[k] + ']'; });
      html += '<div class="card lab-comp lab-start" id="lab-startcard"><p class="kicker">1 minute per variable</p><h3>Read the chart first</h3>' +
        '<p>Take your time with the chart above: the clock is not running yet. When you press <b>Start</b>, each variable gets <b>60 seconds</b>' + (longKeys.length ? ' (' + longKeys.join(', ') + ': 90 seconds)' : '') + ', one try each, and the card checks itself at 0:00. Time left earns a speed bonus.</p>' +
        '<p class="tiny">' + r.order.length + ' variables in this cast: ' + r.order.map(function (k) { return m.SLOT_LABEL[k]; }).join(' · ') + '.</p>' +
        '<p class="lab-cta"><button class="btn primary" id="lab-rstart">Start the clock →</button></p></div>';
      html += '<div class="lab-nav lab-runwrap"><button class="btn ghost" id="lab-rquit">Leave without starting</button></div>';
      el.innerHTML = html;
      var cb0 = $('#lab-chart'); if (cb0 && global.Charts) global.Charts.render(cb0, pr, { compact: true, readout: true });
      var box0 = $('#lab-chartbox'); if (box0) box0.addEventListener('toggle', function () { r.chartOpen = box0.open; });
      $('#lab-rstart').addEventListener('click', function () { r.phase = 'edit'; r.cardElapsed = 0; r.elapsed = 0; paintRun(el); });
      $('#lab-rquit').addEventListener('click', function () { saveItem('attempt', a); st.run = null; toast('Cast saved. Continue it from Cast it on a chart.'); paintBody(); });
      stickRunbar(); paintClock();
      return;
    }
    html += '<div class="card lab-comp">' +
      '<p class="kicker">Variable ' + (r.idx + 1) + ' of ' + r.order.length + '</p>' +
      '<h3>' + esc(m.SLOT_LABEL[key]) + '</h3>' +
      '<p class="lab-fn">' + esc(g.job || '') + '</p>' +
      '<div class="lab-why"><div class="lab-pills"><span class="pill gold">≈ ' + budget.target + ' words (' + budget.lo + '–' + budget.hi + ')</span>' + (needs2 ? '<span class="pill">appears ' + r.occ[key] + '×</span>' : '') + '<span class="pill">' + checkName(g.check) + '</span></div>' +
        '<p><b>Shape:</b> ' + esc(slotFormHint(r.mode, r.tpl, key)[0] || g.shape || '') + '</p><p class="tiny"><b>Tip:</b> ' + esc(g.tip || '') + '</p>' +
        (g.eg ? '<div class="lab-sample-wrap"><button class="linky" id="lab-veg" aria-expanded="' + (st.showVarEg ? 'true' : 'false') + '">' + (st.showVarEg ? 'Hide the example' : 'Show an example') + '</button>' +
          (st.showVarEg ? '<div class="lab-sample" id="lab-vegbox"><p class="lab-sample-t"><b class="lab-own">' + esc(g.eg) + '</b>' + (g.eg2 && needs2 ? ' <span class="tiny">· second mention: </span><b class="lab-own">' + esc(g.eg2) + '</b>' : '') + '</p>' +
            '<p class="tiny"><b>From another chart</b> (' + esc(S && S.charts[r.mode] ? S.charts[r.mode].title : 'the class chart') + '): copy the shape, not the words. Your value comes from the chart above.</p></div>' : '') + '</div>' : '') +
        '</div>' +
      '<div class="lab-where"><b>Where it goes in your report</b>' + whereLines(key, true) + '</div>' +
      '<div class="lab-write"><label class="lab-lbl" for="lab-val">' + esc(m.SLOT_LABEL[key]) + (needs2 ? ' · first mention' : '') + '</label>' +
        '<textarea id="lab-val" rows="2" spellcheck="true"' + (r.phase !== 'edit' ? ' readonly' : '') + ' placeholder="Words from the chart that go into the slot">' + esc(v.text || '') + '</textarea>' +
        (needs2 ? '<label class="lab-lbl" for="lab-val2">Second mention (optional, +' + L.POINTS.reworded + ')</label><textarea id="lab-val2" rows="1" spellcheck="true"' + (r.phase !== 'edit' ? ' readonly' : '') + ' placeholder="A shorter name, a pronoun or a synonym: it, the museum, climbed">' + esc(v.text2 || '') + '</textarea>' : '') +
        '<div class="lab-meter"><span id="lab-wc" class="lab-num"></span><div class="bar-line thin"><span id="lab-wbar"></span></div></div>' +
      '</div>';
    if (r.phase === 'edit') html += '<div class="lab-acts"><button class="btn primary" id="lab-vcheck"' + (r.busy ? ' disabled' : '') + '>' + (tries ? 'Check again' : 'Check it') + '</button><span class="tiny">' + (a.timing === '1min' ? 'One try: the card checks itself at 0:00.' : 'Try ' + (tries + 1) + ' of ' + maxT + '.') + '</span></div>';
    html += '<div id="lab-fb">' + (r.busy ? coachWaiting() : r.fb ? renderFeedback(r.fb, { kind: 'var', level: a.level }) : '') + '</div>';
    if (r.phase === 'feedback') {
      html += '<div class="lab-acts">' + (canRetry && !v.auto ? '<button class="btn" id="lab-vretry">Revise and check again</button>' : '') +
        (r.idx < r.order.length - 1 ? '<button class="btn primary" id="lab-vnext">Next variable →</button>' : '<button class="btn primary" id="lab-vfinish">Assemble my report →</button>') + '</div>';
    }
    html += '</div>';
    html += '<div class="lab-nav lab-runwrap"><button class="btn ghost" id="lab-rquit">Save and leave</button>' + (r.idx > 0 ? '<button class="btn ghost" id="lab-rprev">← Previous variable</button>' : '') +
      (r.order.every(function (k) { return a.vars[k] && a.vars[k].last; }) && r.idx < r.order.length - 1 ? '<button class="btn" id="lab-rfinish">Assemble now</button>' : '') + '</div>';
    el.innerHTML = html;
    var cb = $('#lab-chart'); if (cb && global.Charts) global.Charts.render(cb, pr, { compact: true, readout: true });
    var box = $('#lab-chartbox'); if (box) box.addEventListener('toggle', function () { r.chartOpen = box.open; });

    var ta = $('#lab-val'), ta2 = $('#lab-val2');
    function live() {
      v.text = ta.value; if (ta2) v.text2 = ta2.value;
      var n = words(ta.value);
      $('#lab-wc').textContent = n + ' word' + (n === 1 ? '' : 's') + ' · target ' + budget.lo + '–' + budget.hi;
      $('#lab-wbar').style.width = Math.min(100, Math.round(n / budget.hi * 100)) + '%';
      $('#lab-wbar').parentNode.className = 'bar-line thin' + (n > budget.hi ? ' over' : n >= budget.lo ? '' : ' gold');
      var wl = $('#lab-wherelines'); if (wl) wl.innerHTML = whereLines(key, false);
    }
    ta.addEventListener('input', live); if (ta2) ta2.addEventListener('input', live); live();
    var c = $('#lab-vcheck'); if (c) c.addEventListener('click', function () { checkVar(false); });
    var veg = $('#lab-veg'); if (veg) veg.addEventListener('click', function () {
      /* a toggle, not a repaint: the clock and the typed value stay as they are */
      st.showVarEg = !st.showVarEg; v.text = ta.value; if (ta2) v.text2 = ta2.value;
      paintRun(el); var ta3 = $('#lab-val'); if (ta3 && r.phase === 'edit') try { ta3.focus({ preventScroll: true }); } catch (e) {}
    });
    var rt = $('#lab-vretry'); if (rt) rt.addEventListener('click', function () { r.phase = 'edit'; r.fb = null; r.cardElapsed = a.timing === '1min' ? r.cardElapsed : 0; paintRun(el); startClock(); ta = $('#lab-val'); if (ta) ta.focus(); });
    var nx = $('#lab-vnext'); if (nx) nx.addEventListener('click', function () { gotoVar(r.idx + 1); });
    var fi = $('#lab-vfinish'); if (fi) fi.addEventListener('click', function () { finishRun(); });
    var rf = $('#lab-rfinish'); if (rf) rf.addEventListener('click', function () { finishRun(); });
    var pv = $('#lab-rprev'); if (pv) pv.addEventListener('click', function () { gotoVar(r.idx - 1); });
    $('#lab-rquit').addEventListener('click', function () { pauseClock(); saveItem('attempt', a); st.run = null; toast('Cast saved. Continue it from Cast it on a chart.'); paintBody(); });
    stickRunbar();
    paintClock();
    if (r.phase === 'edit' && !r.busy) { startClock(); if (!ta.value) try { ta.focus({ preventScroll: true }); } catch (e) {} }
  }
  function checkName(c) {
    var t = (c || {}).type;
    return { figure: 'checked: figure', labelfig: 'checked: name + figure', year: 'checked: year', panel: 'checked: map title', group: 'checked: names', label: 'checked: name',
      move: 'checked: direction, no figures', nofig: 'checked: no figures', visual: 'checked: kind of visual', what: 'checked: paraphrase + unit', count: 'checked: number of stages',
      shape: 'checked: linear / cyclical', stage: 'checked: stage', feature: 'checked: map feature', compass: 'checked: compass point', clause: 'checked: change on the map' }[t] || 'not checked';
  }
  function stickRunbar() {
    var bar = document.querySelector('.bar'), rb = $('.lab-runbar'); if (!bar || !rb) return;
    var rh = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--ribbon-h')) || 0;
    rb.style.top = (rh + bar.offsetHeight + 6) + 'px';
  }
  function gotoVar(i) {
    var r = st.run; pauseClock();
    r.idx = Math.max(0, Math.min(r.order.length - 1, i)); r.cardElapsed = 0; r.fb = null;
    var v = r.a.vars[r.order[r.idx]];
    r.phase = v && v.last ? 'feedback' : 'edit';
    if (r.phase === 'feedback') r.fb = v.last;
    saveItem('attempt', r.a);
    paintRun(body()); scrollTop();
  }
  /* Every line of the page that holds the slot, filled with what is written so far. */
  function whereLines(key, wrap) {
    var r = st.run, a = r.a, m = M(r.mode), out = [], seen = 0;
    m.lines.forEach(function (c) {
      var t = (r.tpl.lines[c.id] || {}).text || ''; if (t.indexOf('{' + key + '}') < 0) return;
      var html = esc(t).replace(/\{(\w+)\}/g, function (all, k, off, whole) {
        var v = a.vars[k] || {}, val, starts = !whole.slice(0, off).trim() || /[.!?]\s*$/.test(whole.slice(0, off));
        if (k === key) { val = seen > 0 && v.text2 ? v.text2 : v.text; seen++; return '<span class="slot' + (val ? ' filled' : '') + ' lab-cur">' + esc(val ? fitValue(val, starts) : '[' + m.SLOT_LABEL[k] + ']') + '</span>'; }
        val = v.text; return val ? '<span class="slot filled">' + esc(fitValue(val, starts)) + '</span>' : '<span class="slot">[' + esc(m.SLOT_LABEL[k]) + ']</span>';
      });
      out.push('<div class="lab-whereline"><span class="tiny">' + esc(paraName(c.para)) + ' · ' + esc(c.name) + '</span><p>' + html + '</p></div>');
    });
    return wrap ? '<div id="lab-wherelines">' + out.join('') + '</div>' : out.join('');
  }
  function varsText(a) { var o = {}; Object.keys(a.vars).forEach(function (k) { o[k] = { text: a.vars[k].text || '' }; }); return o; }

  function checkVar(auto) {
    var r = st.run, a = r.a, m = M(r.mode), key = r.order[r.idx], v = a.vars[key] || (a.vars[key] = {});
    var ta = $('#lab-val'), ta2 = $('#lab-val2');
    if (ta) v.text = ta.value; if (ta2) v.text2 = ta2.value;
    pauseClock();
    var needs2 = (r.occ[key] || 0) > 1, lv = levelInfo(a.level);
    if (auto && !String(v.text || '').trim()) {
      v.auto = true; v.tries = (v.tries || 0) + 1; r.autos++;
      v.last = { ai: false, points: 0, rows: [['Timed out: empty', 0]], errors: 0, errorList: [], words: 0, budget: varBudget(r.mode, r.tpl, key), issues: [{ kind: 'warn', msg: 'Time ran out before anything was written.' }], data: { status: 'bad', note: 'Nothing written.' }, ts: nowIso() };
      r.fb = v.last; r.phase = 'feedback'; r.busy = false; saveItem('attempt', a); paintRun(body()); return;
    }
    var q = quickVar(r.mode, key, v.text, v.text2, { tpl: r.tpl, prompt: r.pr, needs2: needs2, vars: varsText(a) });
    if (q.blocking.length && !auto) { r.busy = false; r.fb = { blocking: q.blocking }; $('#lab-fb').innerHTML = renderFeedback(r.fb, {}); startClock(); return; }
    if (auto) { v.auto = true; r.autos++; }
    r.busy = true; r.phase = 'wait';
    var fbEl = $('#lab-fb'); if (fbEl) fbEl.innerHTML = coachWaiting();
    var vc = $('#lab-vcheck'); if (vc) vc.disabled = true;
    var speed = a.timing === '1min' && !auto ? Math.min(L.POINTS.speedMax, Math.floor(Math.max(0, perCard() - r.cardElapsed) / 10) * L.POINTS.speedPer10s) : 0;
    var built = assemble(r.mode, r.tpl, a.vars, {});
    var paraKeys = m.lines.filter(function (c) { return ((r.tpl.lines[c.id] || {}).text || '').indexOf('{' + key + '}') >= 0; }).map(function (c) { return c.para; });
    var paraText = built.paras.filter(function (p) { return paraKeys.indexOf(p.key) >= 0; }).map(function (p) { return p.text; });
    var ask = st.ai === false ? Promise.reject(new Error('offline')) : server('lab.coach', {
      kind: 'variable', task: 1, mode: r.mode, level: lv.id, band: lv.band, pct: a.pct,
      prompt: { id: r.pr.id, rubric: r.pr.rubric, type: r.pr.type, mode: r.pr.mode, data: global.Charts && global.Charts.describe ? global.Charts.describe(r.pr) : '' },
      variable: { key: key, label: m.SLOT_LABEL[key], does: (m.VAR[key] || {}).job, form: slotFormHint(r.mode, r.tpl, key)[0] || (m.VAR[key] || {}).shape },
      value: v.text, value2: needs2 ? (v.text2 || '') : null, words: q.words, budget: { lo: q.budget.lo, hi: q.budget.hi },
      dataCheck: q.data, inContext: paraText,
      filled: r.order.filter(function (k) { return k !== key && a.vars[k] && a.vars[k].text; }).map(function (k) { return m.SLOT_LABEL[k] + ': ' + a.vars[k].text; })
    }, TIMEOUT_COACH).then(function (res) { return res.coach; });
    ask.catch(function () { return null; }).then(function (ai) {
      var sc = scoreOf(q, ai, { level: lv.id, needs2: needs2, speed: speed });
      var fb = compactFb(q, ai, sc);
      v.tries = (v.tries || 0) + 1; v.last = fb; v.secs = Math.round((v.secs || 0) + r.cardElapsed);
      var floor = Math.max(v.best || 0, v.base || 0), gain = Math.max(0, sc.total - floor);
      fb.gain = gain; fb.improved = v.tries > 1 && sc.total > (v.best || 0);
      v.best = Math.max(v.best || 0, sc.total); v.gained = (v.gained || 0) + gain;
      r.fb = fb; r.phase = 'feedback'; r.busy = false; r.cardElapsed = a.timing === '1min' ? r.cardElapsed : 0;
      a.clock = { elapsed: Math.round(r.elapsed) };
      saveItem('attempt', a);
      award(gain);
      if (st.tab === 'assembly' && st.run === r) { paintRun(body()); var f2 = $('#lab-fb'); if (f2) try { f2.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); } catch (e) {} }
    });
  }

  /* ------------------------------------------------------------- finish */
  function accuracyOf(a, mode, pr) {
    var m = M(mode), out = { ok: 0, near: 0, bad: 0, n: 0, rows: [] }, vars = {};
    Object.keys(a.vars).forEach(function (k) { vars[k] = a.vars[k].text || ''; });
    Object.keys(a.vars).forEach(function (k) {
      var def = m.VAR[k]; if (!def || !String(vars[k] || '').trim()) return;
      var d = D.check(def, vars[k], pr, { vars: vars });
      if (d.status === 'none') return;
      out.n++; out[d.status]++;
      out.rows.push({ key: k, status: d.status, note: String(d.note || '').slice(0, 220) });
    });
    return out;
  }
  function finishRun() {
    var r = st.run, a = r.a; pauseClock();
    var built = assemble(r.mode, r.tpl, a.vars, {}), marked = assemble(r.mode, r.tpl, a.vars, { mark: true });
    a.report = built.report; a.words = built.words; a.frameWords = built.frameWords; a.share = Math.round(built.share * 1000) / 1000;
    a.seconds = Math.round(r.elapsed); a.autos = r.autos; a.overtime = !!r.overtime;
    a.full = r.order.every(function (k) { return a.vars[k] && String(a.vars[k].text || '').trim(); });
    a.parasHtml = marked.paras.map(function (p) { return p.html; });
    a.accuracy = accuracyOf(a, r.mode, r.pr);
    if (global.Writer && global.Writer.preflight) {
      var pre = global.Writer.preflight(a.report, r.pr);
      a.wards = { bad: pre.bad, warn: pre.warn, summary: pre.summary, rows: pre.rows.map(function (x) { return { id: x.id, status: x.status, label: x.label, tag: x.tag }; }) };
    }
    r.done = true; r.rating = 'wait';
    st.tab = 'assembly'; paint(); scrollTop();
    rateAttempt(a, r.tpl, r.pr).then(function () { settleRun(a, r); });
  }
  function rateAttempt(a, tpl, pr) {
    var lv = levelInfo(a.level);
    if (st.ai === false) return Promise.resolve(null);
    var m = M(a.mode);
    return server('lab.rate', {
      task: 1, mode: a.mode, level: lv.id, band: lv.band, pct: a.pct,
      prompt: { id: pr.id, rubric: pr.rubric, type: pr.type, mode: pr.mode, data: global.Charts && global.Charts.describe ? global.Charts.describe(pr) : '', keyFeatures: pr.keyFeatures || [] },
      report: a.report, words: a.words, share: a.share,
      wards: a.wards ? a.wards.rows.filter(function (x) { return x.status !== 'ok'; }).map(function (x) { return x.status + ': ' + x.label; }) : [],
      dataChecks: a.accuracy ? a.accuracy.rows.filter(function (x) { return x.status !== 'ok'; }).map(function (x) { return m.SLOT_LABEL[x.key] + ': ' + x.note; }) : [],
      frame: L.PARAS.map(function (pg) { return m.lines.filter(function (c) { return c.para === pg.key; }).map(function (c) { return toLabels(a.mode, (tpl.lines[c.id] || {}).text || ''); }).join(' '); })
    }, TIMEOUT_RATE).then(function (res) {
      var g = res.rating || {};
      var bands = { ta: +g.ta, cc: +g.cc, lr: +g.lr, gra: +g.gra };
      a.rating = { ta: bands.ta, cc: bands.cc, lr: bands.lr, gra: bands.gra, overall: g.overall != null ? +g.overall : overallBand(bands), cefr: g.cefr || '', summary: String(g.summary || '').slice(0, 600),
        ceilings: (g.ceilings || []).slice(0, 3).map(function (x) { return String(x).slice(0, 200); }),
        strengths: (g.strengths || []).slice(0, 3).map(function (x) { return String(x).slice(0, 240); }),
        priorities: (g.priorities || []).slice(0, 3).map(function (x) { return { crit: String(x.crit || x.criterion || '').slice(0, 8), text: String(x.text || x.action || x).slice(0, 280) }; }),
        frameNote: String(g.frameNote || '').slice(0, 300), ts: nowIso() };
      if (a.rating.overall == null || isNaN(a.rating.overall)) a.rating.overall = overallBand(bands);
      return a.rating;
    }).catch(function (e) { st.lastAiError = String(e && e.message || e); return null; });
  }
  /* Points, comparisons, awards and the save: once per finished cast. */
  function settleRun(a, r) {
    var P = L.POINTS, s = labSummary(), pts = { vars: 0, onTime: 0, complete: 0, wards: 0, band: 0, beat: 0, revision: 0 };
    Object.keys(a.vars).forEach(function (k) { pts.vars += a.vars[k].gained || 0; });
    var prev = st.data.attempts.filter(function (x) { return x.id !== a.id && x.status === 'complete' && x.pct === a.pct && x.rating && x.rating.overall != null; });
    var bestPrev = prev.reduce(function (m, x) { return Math.max(m, x.rating.overall); }, -1);
    var parent = a.parentId ? st.data.attempts.filter(function (x) { return x.id === a.parentId; })[0] : null;
    if (parent) {
      pts.complete = P.revisionComplete;
      if (a.rating && parent.rating && a.rating.overall > parent.rating.overall) pts.revision = Math.round((a.rating.overall - parent.rating.overall) * 2) * P.revisionBandPerHalf;
    } else {
      pts.complete = a.full ? P.complete : 0;
      if (a.timing === '20' && !a.overtime && a.full) pts.onTime = P.onTime20;
      if (a.wards && a.wards.bad === 0 && a.full) pts.wards = P.wardsClean;
      if (a.rating && a.rating.overall != null) pts.band = Math.round(a.rating.overall * P.bandMultiplier);
    }
    if (a.rating && a.rating.overall != null && bestPrev >= 0 && a.rating.overall > bestPrev) { pts.beat = P.beatBest; s.beatBest = (s.beatBest || 0) + 1; a.beatBest = true; }
    if (a.timing === '1min' && !a.autos && a.full) s.clockClean = (s.clockClean || 0) + 1;
    var extra = pts.onTime + pts.complete + pts.wards + pts.band + pts.beat + pts.revision;
    pts.total = pts.vars + extra;
    a.points = pts; a.status = 'complete'; a.completedAt = nowIso();
    a.compare = { prevBand: prev.length ? prev.sort(function (x, y) { return String(y.completedAt || y.updatedAt).localeCompare(String(x.completedAt || x.updatedAt)); })[0].rating.overall : null, bestBand: bestPrev >= 0 ? bestPrev : null,
      parentBand: parent && parent.rating ? parent.rating.overall : null, prevAcc: prevAccFor(a) };
    saveItem('attempt', a).then(function (ok) { if (!ok) toast(savedMsg(false, 'Cast saved')); });
    award(extra);
    afterMilestone();
    if (st.run === r) { r.rating = a.rating ? 'done' : 'none'; if (st.tab === 'assembly') paintBody(); }
  }
  function prevAccFor(a) {
    var list = st.data.attempts.filter(function (x) { return x.id !== a.id && x.status === 'complete' && x.mode === a.mode && x.accuracy && x.accuracy.n; });
    if (!list.length) return null;
    list.sort(function (x, y) { return String(y.completedAt || y.updatedAt).localeCompare(String(x.completedAt || x.updatedAt)); });
    return list[0].accuracy.ok / list[0].accuracy.n;
  }

  function paintFinish(el) {
    var r = st.run, a = r.a;
    el.innerHTML = attemptReportHtml(a, { live: true, waiting: r.rating === 'wait' });
    bindReport(a, el, true);
  }
  function timingName(id) { return (L.TIMINGS.filter(function (t) { return t.id === id; })[0] || {}).name || ''; }
  function pointsLine(p) {
    var parts = ['variables ' + p.vars];
    if (p.onTime) parts.push('on time +' + p.onTime);
    if (p.complete) parts.push('complete +' + p.complete);
    if (p.wards) parts.push('clean wards +' + p.wards);
    if (p.band) parts.push('band +' + p.band);
    if (p.beat) parts.push('best +' + p.beat);
    if (p.revision) parts.push('revision +' + p.revision);
    return parts.join(' · ');
  }
  function ratingHtml(rt, crit) {
    return '<div class="lab-rating"><div class="score-ring" style="--p:' + Math.round((rt.overall || 0) / 9 * 100) + '"><i>' + fmtBand(rt.overall) + '</i></div><div><p class="kicker">Estimated band · not an official IELTS score</p><h3>Band ' + fmtBand(rt.overall) + (rt.cefr ? ' · ' + esc(rt.cefr) : '') + '</h3>' +
      '<div class="lab-crit">' + [['TA', 'ta', 'Task Achievement'], ['CC', 'cc', 'Coherence & Cohesion'], ['LR', 'lr', 'Lexical Resource'], ['GRA', 'gra', 'Grammatical Range & Accuracy']].map(function (c) {
        return '<div class="lab-critrow"><span title="' + c[2] + '">' + c[0] + '</span><div class="bar-line"><span style="width:' + Math.round((rt[c[1]] || 0) / 9 * 100) + '%"></span></div><b class="lab-num">' + fmtBand(rt[c[1]]) + '</b></div>';
      }).join('') + '</div></div></div>';
  }
  function accuracyHtml(a, mode) {
    var acc = a.accuracy; if (!acc || !acc.n) return '';
    var m = M(mode);
    return '<div class="card lab-pad lab-acc"><div class="lab-ex-h"><p class="kicker">Data check · every variable against the chart</p><span class="pill ' + (acc.bad ? 'bad' : acc.near ? 'gold' : 'good') + '">' + acc.ok + ' of ' + acc.n + ' true to the chart</span></div>' +
      '<div class="lab-acc-rows">' + acc.rows.map(function (x) {
        return '<div class="lab-data ' + x.status + '"><span class="lab-data-m" aria-hidden="true">' + MARK[x.status] + '</span><div><b>' + esc(m.SLOT_LABEL[x.key] || x.key) + '</b> <span class="lab-varval">' + esc((a.vars[x.key] || {}).text || '') + '</span><p>' + esc(x.note) + '</p></div></div>';
      }).join('') + '</div><p class="tiny">✓ matches the chart · ≈ nearly (an approximation word, a unit or the wrong year) · ✗ not what the chart shows. Rule-based checks: read the note, then look at the chart yourself.</p></div>';
  }
  function modelFor(pr) {
    var ms = (C.MODELS || []).filter(function (x) { return x.promptId === pr.id || x.id === pr.modelId; });
    return ms[0] || null;
  }
  function attemptReportHtml(a, opts) {
    opts = opts || {};
    var lv = levelInfo(a.level), pr = promptById(a.promptId) || { title: a.promptTitle, rubric: '' }, rt = a.rating;
    var html = '<div class="lab-back"><button class="btn sm ghost" id="lab-rback">' + (opts.live ? '← Cast it on a chart' : '← Spellbook record') + '</button><span class="tiny">' + esc(a.templateName) + ' v' + (a.templateVersion || 1) + ' · ' + esc(a.mode) + ' · ' + a.pct + '% · ' + esc(lv.id) + ' · ' + esc(timingName(a.timing)) + (a.version > 1 ? ' · version ' + a.version : '') + '</span></div>';
    html += '<div class="card lab-pad lab-result">';
    if (opts.waiting) html += '<div class="lab-wait big"><span class="lab-spin"></span> The examiner-coach is reading your report…</div>';
    else if (rt) {
      html += ratingHtml(rt);
      if (rt.summary) html += '<p class="lab-sum">' + esc(rt.summary) + '</p>';
      if (rt.ceilings && rt.ceilings.length) html += '<div class="lab-list"><b>What holds the band down</b><ul>' + rt.ceilings.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul></div>';
      if (rt.strengths && rt.strengths.length) html += '<div class="lab-list ok"><b>What worked</b><ul>' + rt.strengths.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul></div>';
      if (rt.priorities && rt.priorities.length) html += '<div class="lab-list"><b>To reach the next half band</b><ul>' + rt.priorities.map(function (x) { return '<li>' + (x.crit ? '<span class="pill on">' + esc(x.crit) + '</span> ' : '') + esc(x.text) + '</li>'; }).join('') + '</ul></div>';
      if (rt.frameNote) html += '<p class="tiny lab-framenote"><b>Your page:</b> ' + esc(rt.frameNote) + '</p>';
    } else html += '<div class="lab-offline">No band estimate: ' + esc(st.ai === false ? st.aiNote : 'the coach could not be reached.') + ' The data check and the Ten Wards below still work offline.' + (online() ? ' <button class="btn sm" id="lab-ratenow">Rate it now</button>' : '') + '</div>';
    var acc = a.accuracy || { ok: 0, n: 0 };
    html += '<div class="lab-kpis">' +
      kpi(a.words, 'Words', a.words >= 150 ? (a.words <= 200 ? 'in the 150–200 target ✓' : 'over 200: cut') : 'under 150') +
      kpi(acc.n ? acc.ok + '/' + acc.n : '—', 'True to the chart', acc.n ? Math.round(acc.ok / acc.n * 100) + '% of the variables' : '') +
      kpi(pctStr(a.share), 'Page share', 'target ' + a.pct + '% · yours ' + pctStr(1 - a.share)) +
      kpi(mmss(a.seconds || 0), 'Time', a.timing === '20' ? (a.overtime ? 'over 20 min' : 'inside 20 min') : timingName(a.timing)) +
      kpi(a.points ? a.points.total : '…', 'Points', a.points ? pointsLine(a.points) : '') +
    '</div>';
    if (a.compare && !opts.waiting) html += compareHtml(a);
    html += '</div>';
    if (a.report && !opts.waiting) html += wardsMini(a.report, pr.id ? pr : a.promptId);
    html += '<div class="card lab-pad"><div class="lab-ex-h"><p class="kicker">Your report</p><label class="tiny"><input type="checkbox" id="lab-hl"' + (st.highlightFrame ? ' checked' : '') + '> highlight your own words</label></div><div class="lab-essay' + (st.highlightFrame ? ' hl' : '') + '" id="lab-essay">' + (a.parasHtml || []).map(function (h) { return '<p>' + h + '</p>'; }).join('') + '</div>' +
      '<details class="lab-chartbox2"><summary class="tiny">Show the chart</summary><div id="lab-rchart"></div></details></div>';
    if (!opts.waiting) html += accuracyHtml(a, a.mode);
    var model = modelFor(pr);
    if (model) html += '<details class="card lab-pad lab-modelbox" id="lab-modelbox"><summary><b>Compare with the model</b> <span class="tiny">a Band ' + esc(model.band) + ' report on the same chart</span></summary>' + model.paragraphs.map(function (p) { return '<p class="lab-modelp"><span class="tiny">' + esc(p.role) + '</span><br>' + esc(p.text) + '</p>'; }).join('') + (model.notes && model.notes.length ? '<ul class="lab-notes">' + model.notes.map(function (n) { return '<li class="tip">' + esc(n) + '</li>'; }).join('') + '</ul>' : '') + '</details>';
    html += '<details class="card lab-pad lab-varlist"><summary><b>Coaching for each variable</b></summary>' + Object.keys(a.vars).map(function (k) {
      var v = a.vars[k]; if (!v.last) return '';
      return '<div class="lab-varrow"><div class="lab-varrow-h"><b>' + esc(M(a.mode).SLOT_LABEL[k] || k) + '</b><span class="pill gold">' + v.last.points + ' pts</span>' + (v.last.cefr ? '<span class="pill">' + esc(v.last.cefr) + '</span>' : '') + (v.auto ? '<span class="pill bad">timed out</span>' : '') + '</div><p class="lab-varval">' + esc(v.text || '') + (v.text2 ? '<br><span class="tiny">2nd: </span>' + esc(v.text2) : '') + '</p>' + renderFeedback(v.last, { kind: 'var', level: a.level, stored: true }) + '</div>';
    }).join('') + '</details>';
    html += '<div class="lab-nav">' + (a.status === 'complete' ? '<button class="btn" id="lab-revise">Revise as version ' + (maxVersion(a.rootId || a.id) + 1) + '</button>' : '') +
      '<button class="btn ghost" id="lab-copy">Copy report</button><button class="btn" id="lab-writer">Open in the Scriptorium</button>' +
      (opts.live ? '<button class="btn primary" id="lab-again">New cast →</button>' : '') + '</div>';
    return html;
  }
  function compareHtml(a) {
    var c = a.compare, rows = [], ov = a.rating ? a.rating.overall : null, acc = a.accuracy && a.accuracy.n ? a.accuracy.ok / a.accuracy.n : null;
    if (a.parentId && c.parentBand != null && ov != null) rows.push(['vs version ' + (a.version - 1), sign(ov - c.parentBand, 1) + ' band']);
    if (c.prevBand != null && ov != null) rows.push(['vs your last ' + a.pct + '% cast', sign(ov - c.prevBand, 1) + ' band']);
    if (c.bestBand != null && ov != null) rows.push([a.beatBest ? 'New personal best at ' + a.pct + '%' : 'vs your best at ' + a.pct + '%', sign(ov - c.bestBand, 1) + ' band']);
    if (c.prevAcc != null && acc != null) rows.push(['Data accuracy vs your last ' + a.mode + ' cast', sign(Math.round((acc - c.prevAcc) * 100)) + ' points']);
    if (!rows.length) return '<p class="tiny lab-firstrun">Your first ' + esc(a.mode) + ' cast at ' + a.pct + '%: it sets the record your next casts are compared with.</p>';
    return '<div class="lab-compare">' + rows.map(function (x) { var up = /^\+/.test(x[1]), down = /^−/.test(x[1]); return '<div class="lab-cmp' + (up ? ' up' : down ? ' down' : '') + '"><span>' + esc(x[0]) + '</span><b class="lab-num">' + esc(x[1]) + '</b></div>'; }).join('') + '</div>';
  }
  function bindReport(a, el, live) {
    var back = $('#lab-rback'); if (back) back.addEventListener('click', function () { if (live) st.run = null; else st.review = null; paintBody(); scrollTop(); });
    var hl = $('#lab-hl'); if (hl) hl.addEventListener('change', function () { st.highlightFrame = hl.checked; $('#lab-essay').classList.toggle('hl', hl.checked); });
    var cp = $('#lab-copy'); if (cp) cp.addEventListener('click', function () { try { navigator.clipboard.writeText(a.report || ''); toast('Report copied.'); } catch (e) { global.prompt('Copy your report', a.report || ''); } });
    var wr = $('#lab-writer'); if (wr) wr.addEventListener('click', function () {
      if (host.openWriter) host.openWriter(a.promptId, a.report || '');
      else { try { navigator.clipboard.writeText(a.report || ''); } catch (e) {} toast('Report copied: paste it into the Scriptorium.'); }
    });
    var rc = root.querySelector('.lab-chartbox2'); if (rc) rc.addEventListener('toggle', function () { if (rc.open && global.Charts) global.Charts.render($('#lab-rchart'), promptById(a.promptId), { compact: true }); });
    var ag = $('#lab-again'); if (ag) ag.addEventListener('click', function () { st.run = null; paintBody(); scrollTop(); });
    var rv = $('#lab-revise'); if (rv) rv.addEventListener('click', function () {
      var tpl = getTpl(a.templateId), pr = promptById(a.promptId);
      if (!tpl || !pr) { toast('The page for this cast is not on this device.'); return; }
      st.review = null; startRun(tpl, pr, 'none', a);
    });
    var rn = $('#lab-ratenow'); if (rn) rn.addEventListener('click', function () {
      rn.disabled = true; rn.textContent = 'Rating…';
      var tpl = getTpl(a.templateId), pr = promptById(a.promptId);
      st.ai = null;
      rateAttempt(a, tpl || { lines: {} }, pr).then(function (rt) {
        if (!rt) { toast('The coach could not be reached. Try again later.'); rn.disabled = false; rn.textContent = 'Rate it now'; return; }
        if (!a.points) a.points = { vars: 0, total: 0 };
        var bonus = Math.round(rt.overall * L.POINTS.bandMultiplier); a.points.band = (a.points.band || 0) + bonus; a.points.total += bonus;
        saveItem('attempt', a); award(bonus); afterMilestone(); paintBody();
      });
    });
  }

  /* ======================================================= SPELLBOOK RECORD */
  var SERIES = [
    { pct: 60, color: 'var(--lab-s60)', shape: 'circle' },
    { pct: 50, color: 'var(--lab-s50)', shape: 'square' },
    { pct: 40, color: 'var(--lab-s40)', shape: 'triangle' },
    { pct: 30, color: 'var(--lab-s30)', shape: 'diamond' }
  ];
  function doneRuns() {
    return st.data.attempts.filter(function (a) { return a.status === 'complete'; })
      .sort(function (x, y) { return String(x.completedAt || x.updatedAt).localeCompare(String(y.completedAt || y.updatedAt)); });
  }
  function avg(arr, f) { var a = arr.filter(function (x) { return f(x) != null; }); return a.length ? a.reduce(function (m, x) { return m + f(x); }, 0) / a.length : null; }
  function accOf(a) { return a.accuracy && a.accuracy.n ? a.accuracy.ok / a.accuracy.n : null; }
  function paintScore(el) {
    var s = recompute(), rk = labRank(s.points || 0), runs = doneRuns(), rated = runs.filter(function (a) { return a.rating && a.rating.overall != null; });
    var toNext = rk.next ? Math.round(((s.points || 0) - rk.rank.min) / (rk.next.min - rk.rank.min) * 100) : 100;
    var html = '<div class="lab-kpis lab-kpis-top">' +
      '<div class="lab-kpi"><b class="lab-num">' + (s.points || 0) + '</b><span>Workshop points</span><small>' + esc(rk.rank.name) + (rk.next ? ' · ' + (rk.next.min - (s.points || 0)) + ' to ' + esc(rk.next.name) : ' · top rank') + '</small><div class="bar-line thin gold"><span style="width:' + toNext + '%"></span></div></div>' +
      kpi(runs.length, 'Casts', rated.length + ' with a band estimate') +
      kpi(s.accuracy == null ? '—' : Math.round(s.accuracy * 100) + '%', 'True to the chart', 'all your variables') +
      kpi(fmtBand(s.bestBand), 'Best band', 'estimated by the coach') +
      kpi(completeTemplates().length, 'Pages', L.MODE_ORDER.filter(function (m) { return s.modesDesigned && s.modesDesigned[m]; }).join(' · ') || 'none yet') +
      '</div>';
    /* by mode */
    html += '<div class="card lab-pad"><p class="kicker">By mode</p><div class="tbl-scroll"><table class="tbl lab-tbl"><thead><tr><th>Mode</th><th>Page</th><th>Casts</th><th>True to the chart</th><th>Best band</th><th>Average time</th></tr></thead><tbody>' +
      L.MODE_ORDER.map(function (mode) {
        var list = runs.filter(function (a) { return a.mode === mode; }), rt = list.filter(function (a) { return a.rating && a.rating.overall != null; });
        var acc = avg(list, accOf), sec = avg(list, function (a) { return a.seconds || 0; });
        return '<tr><td><b>' + mode + '</b></td><td>' + (s.modesDesigned && s.modesDesigned[mode] ? '<span class="pill good">ready</span>' : '<span class="pill">—</span>') + '</td><td class="lab-num">' + list.length + '</td><td class="lab-num">' + (acc == null ? '—' : Math.round(acc * 100) + '%') + '</td><td class="lab-num">' + (rt.length ? fmtBand(Math.max.apply(null, rt.map(function (a) { return a.rating.overall; }))) : '—') + '</td><td class="lab-num">' + (sec == null ? '—' : mmss(sec)) + '</td></tr>';
      }).join('') + '</tbody></table></div></div>';
    /* by share */
    var rowsByPct = L.PCTS.map(function (o) {
      var list = runs.filter(function (a) { return a.pct === o.pct; }), rt = list.filter(function (a) { return a.rating && a.rating.overall != null; });
      return { o: o, n: list.length, avgBand: avg(rt, function (a) { return a.rating.overall; }), best: rt.length ? Math.max.apply(null, rt.map(function (a) { return a.rating.overall; })) : null,
        acc: avg(list, accOf), avgShare: avg(list, function (a) { return a.share || 0; }), avgSec: avg(list, function (a) { return a.seconds || 0; }) };
    });
    var strongest = null; rowsByPct.forEach(function (r) { if (r.avgBand != null && (strongest == null || r.avgBand > strongest.avgBand)) strongest = r; });
    html += '<div class="card lab-pad"><p class="kicker">Page share vs your results</p><h3>Which share works for you?</h3>' +
      '<div class="tbl-scroll"><table class="tbl lab-tbl"><thead><tr><th>Share</th><th>Casts</th><th>Average band</th><th>Best band</th><th>True to the chart</th><th>Actual share</th><th>Average time</th></tr></thead><tbody>' +
      rowsByPct.map(function (r) {
        return '<tr' + (strongest === r ? ' class="best"' : '') + '><td><span class="lab-key" style="--c:' + SERIES.filter(function (x) { return x.pct === r.o.pct; })[0].color + '"></span><b>' + r.o.pct + '%</b> <span class="tiny">' + esc(r.o.name) + '</span>' + (strongest === r ? ' <span class="pill good">strongest</span>' : '') + '</td>' +
          '<td class="lab-num">' + r.n + '</td><td class="lab-num">' + fmtBand(r.avgBand) + '</td><td class="lab-num">' + fmtBand(r.best) + '</td><td class="lab-num">' + (r.acc == null ? '—' : Math.round(r.acc * 100) + '%') + '</td><td class="lab-num">' + (r.avgShare == null ? '—' : pctStr(r.avgShare)) + '</td><td class="lab-num">' + (r.avgSec == null ? '—' : mmss(r.avgSec)) + '</td></tr>';
      }).join('') + '</tbody></table></div></div>';
    html += '<div class="card lab-pad"><p class="kicker">' + (rated.length >= 2 ? 'Band by cast, for each share' : 'True to the chart, cast by cast') + '</p>' +
      (rated.length >= 2 ? chartHtml(rated, function (a) { return a.rating.overall; }, Math.min(4, Math.floor(Math.min.apply(null, rated.map(function (a) { return a.rating.overall; })))), 9, 1, function (y) { return fmtBand(y); }, 'Cast number at that share')
        : runs.filter(accOf).length >= 2 ? chartHtml(runs.filter(function (a) { return accOf(a) != null; }), function (a) { return Math.round(accOf(a) * 100); }, 0, 100, 20, function (y) { return y + '%'; }, 'Cast number at that share')
        : '<p class="tiny">Finish two casts to see your trend. Each line follows one share.</p>') + '</div>';
    html += '<div class="card lab-pad"><p class="kicker">Cast history</p>' + (runs.length ? '<div class="lab-hist">' + runs.slice().reverse().map(function (a) {
      var acc = accOf(a);
      return '<button class="lab-histrow" data-rev="' + a.id + '"><span class="lab-hist-d tiny">' + esc(fmtDate(a.completedAt || a.updatedAt)) + '</span><span class="lab-hist-t"><b>' + esc(a.promptTitle) + '</b><span class="lab-pills"><span class="pill on">' + esc(a.mode) + '</span><span class="pill gold">' + a.pct + '%</span><span class="pill">' + esc(timingName(a.timing)) + '</span>' + (a.version > 1 ? '<span class="pill">v' + a.version + '</span>' : '') + '</span></span>' +
        '<span class="lab-hist-b lab-num">' + (a.rating ? 'Band ' + fmtBand(a.rating.overall) : acc != null ? Math.round(acc * 100) + '% true' : '—') + '</span><span class="lab-hist-p lab-num">' + (a.points ? a.points.total : 0) + ' pts</span></button>';
    }).join('') + '</div>' : '<p class="tiny">No finished casts yet. Cast a page on a chart.</p>') + '</div>';
    var tpls = st.data.templates.slice().sort(function (a, b) { return String(b.updatedAt).localeCompare(String(a.updatedAt)); });
    if (tpls.length) html += '<div class="card lab-pad"><p class="kicker">Pages</p><div class="tbl-scroll"><table class="tbl lab-tbl"><thead><tr><th>Page</th><th>Mode</th><th>Share</th><th>Level</th><th>Page score</th><th>Casts</th></tr></thead><tbody>' + tpls.map(function (t) {
      var rs = runs.filter(function (a) { return a.templateId === t.id; });
      return '<tr><td><b>' + esc(t.name) + '</b> <span class="tiny">v' + (t.version || 1) + (t.status !== 'complete' ? ' · draft' : '') + '</span></td><td>' + esc(t.mode) + '</td><td class="lab-num">' + t.pct + '%</td><td>' + esc(t.level) + '</td><td class="lab-num">' + Math.round(tplScore(t) / lineMax(t.mode) * 100) + '%</td><td class="lab-num">' + rs.length + '</td></tr>';
    }).join('') + '</tbody></table></div></div>';
    el.innerHTML = html;
    $$('[data-rev]').forEach(function (b) { b.addEventListener('click', function () { st.review = b.dataset.rev; paintBody(); scrollTop(); }); });
    bindChart();
  }
  function chartHtml(list, yOf, yMin, yMax, yStep, yFmt, xLabel) {
    var series = SERIES.map(function (sr) {
      var pts = list.filter(function (a) { return a.pct === sr.pct; }).map(function (a, i) { return { x: i + 1, y: yOf(a), a: a }; });
      return extend({ pts: pts }, sr);
    }).filter(function (sr) { return sr.pts.length; });
    var W0 = 760, H0 = 250, ml = 44, mr = 64, mt = 14, mb = 34;
    var xMax = Math.max(2, Math.max.apply(null, series.map(function (s) { return s.pts.length; })));
    function X(x) { return ml + (x - 1) / (xMax - 1) * (W0 - ml - mr); }
    function Y(y) { return mt + (yMax - y) / (yMax - yMin) * (H0 - mt - mb); }
    var g = '';
    for (var yv = yMin; yv <= yMax + 1e-9; yv += yStep) g += '<line class="lab-gridline" x1="' + ml + '" x2="' + (W0 - mr) + '" y1="' + Y(yv) + '" y2="' + Y(yv) + '"/><text class="lab-axis" x="' + (ml - 8) + '" y="' + (Y(yv) + 4) + '" text-anchor="end">' + yFmt(yv) + '</text>';
    var step = xMax > 12 ? Math.ceil(xMax / 10) : 1;
    for (var xv = 1; xv <= xMax; xv += step) g += '<text class="lab-axis" x="' + X(xv) + '" y="' + (H0 - mb + 18) + '" text-anchor="middle">' + xv + '</text>';
    g += '<text class="lab-axis" x="' + ((ml + W0 - mr) / 2) + '" y="' + (H0 - 4) + '" text-anchor="middle">' + esc(xLabel) + '</text>';
    var marks = '', hits = '', labels = [];
    series.forEach(function (sr) {
      if (sr.pts.length > 1) marks += '<polyline class="lab-line" style="stroke:' + sr.color + '" points="' + sr.pts.map(function (p) { return X(p.x) + ',' + Y(p.y); }).join(' ') + '"/>';
      sr.pts.forEach(function (p) {
        marks += shape(sr.shape, X(p.x), Y(p.y), sr.color);
        hits += '<circle class="lab-hit" tabindex="0" cx="' + X(p.x) + '" cy="' + Y(p.y) + '" r="13" data-tip="' + esc(sr.pct + '% page · cast ' + p.x + ' · ' + yFmt(p.y) + ' · ' + p.a.promptTitle + ' · ' + fmtDate(p.a.completedAt || p.a.updatedAt)) + '" data-rev="' + p.a.id + '"/>';
      });
      var lp = sr.pts[sr.pts.length - 1];
      labels.push({ y: Y(lp.y), x: X(lp.x), text: sr.pct + '%' });
    });
    labels.sort(function (a, b) { return a.y - b.y; });
    for (var i = 1; i < labels.length; i++) if (labels[i].y - (labels[i - 1].ly || labels[i - 1].y) < 14) labels[i].ly = (labels[i - 1].ly || labels[i - 1].y) + 14;
    var lab = labels.map(function (l) {
      var ly = l.ly || l.y, lx = W0 - mr + 12;
      return (Math.abs(ly - l.y) > 1 || lx - l.x > 20 ? '<line class="lab-leader" x1="' + (l.x + 7) + '" y1="' + l.y + '" x2="' + (lx - 3) + '" y2="' + ly + '"/>' : '') + '<text class="lab-dlabel" x="' + lx + '" y="' + (ly + 4) + '">' + l.text + '</text>';
    }).join('');
    var legend = '<div class="lab-legend">' + series.map(function (sr) { return '<span><svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">' + shape(sr.shape, 7, 7, sr.color) + '</svg>' + sr.pct + '% page</span>'; }).join('') + '</div>';
    return legend + '<div class="lab-chart"><svg viewBox="0 0 ' + W0 + ' ' + H0 + '" role="img" aria-label="Results for each cast, one line per page share">' + g + marks + lab + hits + '</svg><div class="lab-tipbox hidden" id="lab-tipbox"></div></div>';
  }
  function shape(kind, x, y, color) {
    var st0 = 'fill:' + color;
    if (kind === 'square') return '<rect class="lab-mark" x="' + (x - 4.5) + '" y="' + (y - 4.5) + '" width="9" height="9" rx="1.5" style="' + st0 + '"/>';
    if (kind === 'triangle') return '<path class="lab-mark" d="M' + x + ' ' + (y - 5.5) + ' L' + (x + 5.5) + ' ' + (y + 4.5) + ' L' + (x - 5.5) + ' ' + (y + 4.5) + ' Z" style="' + st0 + '"/>';
    if (kind === 'diamond') return '<path class="lab-mark" d="M' + x + ' ' + (y - 6) + ' L' + (x + 6) + ' ' + y + ' L' + x + ' ' + (y + 6) + ' L' + (x - 6) + ' ' + y + ' Z" style="' + st0 + '"/>';
    return '<circle class="lab-mark" cx="' + x + '" cy="' + y + '" r="5" style="' + st0 + '"/>';
  }
  function bindChart() {
    var box = $('#lab-tipbox'), wrap = box ? box.parentNode : null; if (!box) return;
    $$('.lab-hit').forEach(function (h) {
      function showTip() {
        box.textContent = h.getAttribute('data-tip'); box.classList.remove('hidden');
        var rb = wrap.getBoundingClientRect(), hb = h.getBoundingClientRect();
        var left = hb.left - rb.left + hb.width / 2, top = hb.top - rb.top;
        box.style.left = Math.max(4, Math.min(rb.width - box.offsetWidth - 4, left - box.offsetWidth / 2)) + 'px';
        box.style.top = Math.max(0, top - box.offsetHeight - 6) + 'px';
      }
      h.addEventListener('mouseenter', showTip); h.addEventListener('focus', showTip);
      h.addEventListener('mouseleave', function () { box.classList.add('hidden'); });
      h.addEventListener('blur', function () { box.classList.add('hidden'); });
      h.addEventListener('click', function () { st.review = h.getAttribute('data-rev'); paintBody(); scrollTop(); });
    });
  }
  function paintReview(el) {
    var a = st.data.attempts.filter(function (x) { return x.id === st.review; })[0];
    if (!a) { st.review = null; return paintScore(el); }
    if (!a.parasHtml && a.report) a.parasHtml = String(a.report).split(/\n\n/).map(function (p) { return esc(p); });
    el.innerHTML = attemptReportHtml(a, {});
    bindReport(a, el, false);
  }

  /* ============================================================= EXAMPLES
     Worked examples (lab-examples.js): two AI-simulated students, one page
     per mode each, cast on one bank chart. The data check and the Ten Wards
     run live on the stored report, so what you see is what the app checks. */
  function exSet() { var E = global.LabExamples; return E.sets.filter(function (x) { return x.student === st.ex.student && x.mode === st.ex.mode; })[0] || E.sets[0]; }
  function exTpl(set) { var lines = {}; Object.keys(set.lines || {}).forEach(function (id) { lines[id] = { text: set.lines[id] }; }); return { id: set.id, mode: set.mode, pct: set.pct, level: set.level, lines: lines, slotNotes: {} }; }
  function paintExamples(el) {
    var E = global.LabExamples, x = st.ex, set = exSet(), stu = E.students[set.student], pr = promptById(set.promptId) || { title: '', rubric: '' };
    var t = exTpl(set), built = assemble(set.mode, t, set.vars, { mark: true }), plain = assemble(set.mode, t, set.vars, {});
    var a = { vars: set.vars }, acc = accuracyOf(a, set.mode, pr);
    var html = '<div class="card lab-pad lab-exhero"><p class="kicker">Worked examples <span class="pill">AI-simulated</span></p><h3>Two AI-simulated students, one page for each mode</h3><p class="tiny">' + esc(E.note) + '</p>' +
      '<div class="lab-exstu">' + Object.keys(E.students).map(function (k) { var s0 = E.students[k]; return '<button class="lab-type' + (x.student === k ? ' on' : '') + '" data-exst="' + k + '"><b>' + esc(s0.name) + ' · ' + esc(s0.level) + '</b><span class="tiny">' + esc(s0.target) + ' · ' + s0.pct + '% pages</span><span>' + esc(s0.blurb) + '</span></button>'; }).join('') + '</div>' +
      '<div class="filters" style="margin-top:12px">' + L.MODE_ORDER.map(function (mm) { return '<button data-exmode="' + mm + '"' + (mm === set.mode ? ' class="on"' : '') + '>' + mm + '</button>'; }).join('') + '</div></div>';
    html += '<div class="card lab-pad lab-result"><p class="kicker">' + esc(stu.name) + ' · ' + esc(set.mode) + ' page · ' + set.pct + '% share</p>' + (set.rating ? ratingHtml(set.rating) + '<p class="lab-sum">' + esc(set.rating.summary) + '</p><div class="lab-list ok"><b>What worked</b><ul><li>' + esc(set.rating.strength) + '</li></ul></div>' + (set.rating.priority ? '<div class="lab-list"><b>To reach the next half band</b><ul><li><span class="pill on">' + esc(set.rating.priority.crit) + '</span> ' + esc(set.rating.priority.text) + '</li></ul></div>' : '') : '') +
      '<div class="lab-kpis">' + kpi(plain.words, 'Words', plain.words >= 150 && plain.words <= 200 ? 'in the 150–200 target ✓' : '') + kpi(pctStr(plain.share), 'Page share', 'target ' + set.pct + '%') + kpi(acc.ok + '/' + acc.n, 'True to the chart', 'checked live') + kpi(templateFrameWords(set.mode, t), 'Page words', M(set.mode).lines.length + ' lines') + '</div>' +
      '<p class="tiny">Estimated bands from the public descriptors by an AI reviewer: not official IELTS scores.</p></div>';
    html += '<div class="card lab-pad"><p class="kicker">The chart</p><div id="lab-exchart"></div></div>';
    html += '<div class="card lab-pad"><p class="kicker">Step 1 · ' + esc(stu.name) + '\'s page (Design)</p>' + L.PARAS.map(function (pg) {
      return '<div class="lab-para"><p class="kicker">' + esc(pg.name) + '</p>' + M(set.mode).lines.filter(function (c) { return c.para === pg.key; }).map(function (c) {
        return '<div class="lab-sline"><div class="lab-sline-t">' + slotChips(set.mode, (t.lines[c.id] || {}).text || '') + '</div><div class="lab-sline-m"><span class="tiny">' + c.n + '. ' + esc(c.name) + '</span><span class="pill">' + frameWords((t.lines[c.id] || {}).text || '') + ' words</span></div></div>';
      }).join('') + '</div>';
    }).join('') + '</div>';
    var co = set.coaching || [];
    if (co.length) html += '<div class="card lab-pad"><p class="kicker">How the coach changed the page</p>' + co.map(function (c) {
      var comp = lineById(set.mode, c.line) || { name: c.line };
      return '<div class="lab-coachstory"><p class="tiny"><b>' + esc(comp.name) + '</b></p><p><s>' + esc(c.first) + '</s></p><p class="lab-offline">' + esc(c.flagged) + '</p><p><b>' + esc(c.fixed) + '</b></p></div>';
    }).join('') + '</div>';
    html += '<div class="card lab-pad"><p class="kicker">Step 2 · The variables for this chart (Cast it on a chart)</p><div class="lab-acc-rows">' + acc.rows.map(function (r0) {
      var v = set.vars[r0.key] || {};
      return '<div class="lab-data ' + r0.status + '"><span class="lab-data-m" aria-hidden="true">' + MARK[r0.status] + '</span><div><b>' + esc(M(set.mode).SLOT_LABEL[r0.key]) + '</b> <span class="lab-varval">' + esc(v.text) + (v.text2 ? ' <span class="tiny">· 2nd: ' + esc(v.text2) + '</span>' : '') + '</span><p>' + esc(r0.note) + '</p></div></div>';
    }).join('') + '</div></div>';
    html += '<div class="card lab-pad"><div class="lab-ex-h"><p class="kicker">Step 3 · The assembled report</p><label class="tiny"><input type="checkbox" id="lab-exhl"' + (st.highlightFrame ? ' checked' : '') + '> highlight the variables</label></div><div class="lab-essay' + (st.highlightFrame ? ' hl' : '') + '" id="lab-exessay">' + built.paras.map(function (p) { return '<p>' + p.html + '</p>'; }).join('') + '</div></div>';
    html += wardsMini(plain.report, pr);
    el.innerHTML = html;
    var exc = $('#lab-exchart'); if (exc && global.Charts) global.Charts.render(exc, pr, { compact: true });
    $$('[data-exst]').forEach(function (b) { b.addEventListener('click', function () { x.student = b.dataset.exst; paintBody(); }); });
    $$('[data-exmode]').forEach(function (b) { b.addEventListener('click', function () { x.mode = b.dataset.exmode; paintBody(); }); });
    var hl = $('#lab-exhl'); if (hl) hl.addEventListener('change', function () { st.highlightFrame = hl.checked; $('#lab-exessay').classList.toggle('hl', hl.checked); });
  }

  /* ============================================================== mount */
  function mount(el, h) {
    host = h; root = el;
    var p = host.p; if (!p) return;
    if (st.sid !== p.studentId) {
      st.sid = p.studentId; st.data = loadLocal(); st.synced = false; st.ai = null;
      st.build = null; st.run = null; st.review = null; st.view = 'home'; st.tab = 'studio';
    }
    recompute();
    /* WP16: a chapter mission arrives with window.LAB_START_MODE (PCHost.labMode):
       open Design for that mode straight away, share and level set from the
       student's track, and clear the flag so the next visit is normal. */
    var startMode = global.LAB_START_MODE || null;
    if (startMode) { try { global.LAB_START_MODE = null; } catch (e) {} }
    if (!(startMode && startFromMission(String(startMode).toUpperCase()))) paint();
    if (!st.synced) {
      st.synced = true;
      pushDirty();
      server('lab.list', {}, 20000).then(function (r) {
        if (mergeServer(r) && root && !st.run && !st.build) { recompute(); paint(); }
      }).catch(function () {});
    }
    if (st.ai !== true) checkStatus().then(function () { if (root && document.body.contains(root)) { var pill = root.querySelector('.lab-ai .pill'); if (pill) { pill.className = 'pill ' + (st.ai ? 'good' : 'bad'); pill.textContent = st.aiNote; } } });
  }
  function leave() {
    if (st.run && !st.run.done) { pauseClock(); saveItem('attempt', st.run.a); }
    if (st.build && st.view === 'build' && root) { var ta = root.querySelector('#lab-line'); var comp = M(st.build.tpl.mode).lines[st.build.idx]; if (ta && comp) { var ln = st.build.tpl.lines[comp.id] || (st.build.tpl.lines[comp.id] = {}); ln.draft = ta.value; persist(); } }
  }
  /* Story gate helper: a complete page for this mode exists. */
  function designed(p, mode) {
    if (p && p.lab && p.lab.modesDesigned && p.lab.modesDesigned[mode]) return true;
    var sid = p && p.studentId; if (!sid) return false;
    try {
      var d = JSON.parse(localStorage.getItem('cc.lab.v1.' + String(sid).toLowerCase()) || 'null');
      return !!(d && d.templates && d.templates.some(function (t) { return t.mode === mode && t.status === 'complete'; }));
    } catch (e) { return false; }
  }
  /* How many casts match (for the tournament task 'tour-cast'). */
  function casts(p, opts) {
    opts = opts || {};
    var sid = p && p.studentId; if (!sid) return 0;
    var d = sid === st.sid && st.data ? st.data : null;
    if (!d) try { d = JSON.parse(localStorage.getItem('cc.lab.v1.' + String(sid).toLowerCase()) || 'null'); } catch (e) {}
    if (!d || !d.attempts) return (p.lab && (opts.timing === '1min' ? p.lab.timedCasts : p.lab.runs)) || 0;
    return d.attempts.filter(function (a) { return a.status === 'complete' && (!opts.timing || a.timing === opts.timing) && (!opts.mode || a.mode === opts.mode) && (!opts.full || a.full) && (!opts.since || String(a.completedAt) >= opts.since); }).length;
  }
  global.addEventListener('pagehide', function () { try { leave(); } catch (e) {} });
  global.addEventListener('resize', function () { if (st.run && !st.run.done && root) stickRunbar(); });

  global.Lab = {
    mount: mount, leave: leave, designed: designed, casts: casts,
    busy: function () { return !!(st.run && !st.run.done && st.run.busy); },
    /* for tests and the teacher console */
    _state: st, _quickFrame: quickFrame, _quickVar: quickVar, _assemble: assemble, _overallBand: overallBand, _toTokens: toTokens, _toLabels: toLabels,
    _compBudget: compBudget, _varBudget: varBudget, _fillSample: fillSample, _sampleFor: sampleFor, _occurrences: occurrences, _frameWords: templateFrameWords, _driveRender: driveRender, _accuracy: accuracyOf, _shapeAt: shapeAt
  };
})(window);
