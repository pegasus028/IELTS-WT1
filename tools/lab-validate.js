/* Checks the Spellbook Workshop's content and data before deploying.
     node tools/lab-validate.js            check everything
     node tools/lab-validate.js --write    also write examples-t1/populations.json

   1. lab-content.js  every mode: slots, examples (3 per tier, own slots only,
      register rules), overview lines with no figure slots, budgets, class drafts
   2. lab-scenario.js every Test Drive fill is true to its chart (data checker)
   3. populations     every variable of a mode can be filled for EVERY bank
      prompt of that mode (whatever prompts-*.js are loaded): an automatic fill
      (Template.Data.derive) must pass the data check with no ✗
   4. lab-examples.js every example: own-words page, every variable ✓ against
      its chart, 150–200 words, no red rows on the Ten Wards (writer.js).
      A2 examples (Ploy, WP30): every line inside the A2 page-word budget,
      120–145 words, the length row may be red (nothing else), every
      second mention true to the chart, every detail sentence with a
      figure, a year or a chart label
      All examples: no digit and no figure slot in an overview frame       
   5. keepsakes, ranks; ES5 syntax and UK spelling of the browser files
   6. lab-samples.js sample lines
   7. COMPARE category reach: the Design warning (item 3)                       */
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.join(__dirname, '..');
const WRITE = process.argv.indexOf('--write') >= 0;

const store = {};
const win = { CONTENT: { PROMPTS: [], MODELS: [], BADGES: [] }, addEventListener: function () {}, localStorage: { getItem: function (k) { return store[k] || null; }, setItem: function (k, v) { store[k] = String(v); } } };
win.window = win;
const ctx = { window: win, localStorage: win.localStorage, console: console, document: { getElementById: function () { return null; } } };
vm.createContext(ctx);
function load(f, optional) {
  const p = path.join(ROOT, f);
  if (!fs.existsSync(p)) { if (!optional) throw new Error('missing ' + f); return false; }
  vm.runInContext(fs.readFileSync(p, 'utf8'), ctx, { filename: f }); return true;
}
['prompts.js', 'prompts-2.js'].forEach(function (f) { load(f); });
const extraPrompts = fs.readdirSync(ROOT).filter(function (f) { return /^prompts-\d+\.js$/.test(f) && f !== 'prompts-2.js'; });
extraPrompts.forEach(function (f) { load(f); });
load('models.js', true); load('models-2.js', true);
['template.js', 'lab-content.js', 'lab-scenario.js', 'charts.js', 'writer.js'].forEach(function (f) { load(f); });
const hasExamples = load('lab-examples.js', true);
load('lab.js');
const L = win.LabContent, D = win.Template.Data, S = win.LabScenario, W = win.Writer, Lab = win.Lab, E = win.LabExamples;

let errors = 0, warnings = 0;
function bad(m) { console.log('  ✕ ' + m); errors++; }
function warn(m) { console.log('  · ' + m); warnings++; }
function section(t) { console.log('\n' + t); }
const FIGURE_TYPES = { figure: 1, labelfig: 1 };

/* ------------------------------------------------------------ 1. content */
section('1. lab-content.js');
const TIERS = ['B1', 'B2', 'C1'];
L.MODE_ORDER.forEach(function (mode) {
  const M = L.MODES[mode], keys = {}, lineIds = {};
  if (!M) return bad('no mode ' + mode);
  if (M.vars.length < 11 || M.vars.length > 13) bad(mode + ': ' + M.vars.length + ' variables (want 11–13)');
  M.vars.forEach(function (v) {
    if (keys[v.key]) bad(mode + ': duplicate variable ' + v.key); keys[v.key] = 1;
    ['label', 'job', 'shape', 'tip'].forEach(function (f) { if (!v[f]) bad(mode + ' ' + v.key + ': no ' + f); });
    if (!v.check || !v.check.type) bad(mode + ' ' + v.key + ': no data check');
    if (!M.lines.some(function (c) { return c.slots.indexOf(v.key) >= 0; })) bad(mode + ': no line carries ' + v.key);
    if (v.check && v.check.cat && !keys[v.check.cat] && !M.vars.some(function (x) { return x.key === v.check.cat; })) bad(mode + ' ' + v.key + ': check refers to unknown ' + v.check.cat);
  });
  M.lines.forEach(function (c) {
    if (lineIds[c.id]) bad(mode + ': duplicate line ' + c.id); lineIds[c.id] = 1;
    if (!L.PARAS.some(function (p) { return p.key === c.para; })) bad(c.id + ': unknown paragraph ' + c.para);
    c.slots.forEach(function (k) { if (!keys[k]) bad(c.id + ': unknown slot ' + k); });
    if (c.para === 'overview') c.slots.forEach(function (k) { const v = M.VAR[k]; if (v && FIGURE_TYPES[v.check.type]) bad(c.id + ': overview line carries the figure slot ' + k); });
    TIERS.forEach(function (t) {
      const ex = (c.examples || {})[t] || [];
      if (ex.length !== 3) bad(c.id + ': needs 3 ' + t + ' examples (has ' + ex.length + ')');
      ex.forEach(function (e) {
        const toks = (e.match(/\{(\w+)\}/g) || []).map(function (x) { return x.slice(1, -1); });
        c.slots.forEach(function (k) { const n = toks.filter(function (x) { return x === k; }).length; if (n !== 1) bad(c.id + ' ' + t + ': {' + k + '} appears ' + n + '× in "' + e + '"'); });
        toks.forEach(function (k) { if (c.slots.indexOf(k) < 0) bad(c.id + ' ' + t + ': stray {' + k + '} in "' + e + '"'); });
        if (!/[.]$/.test(e.trim())) bad(c.id + ' ' + t + ': should end with a full stop: "' + e + '"');
        const q = Lab._quickFrame(mode, c, Lab._toLabels(mode, e), 50);
        q.blocking.forEach(function (b) { bad(c.id + ' ' + t + ': ' + b + ' — "' + e + '"'); });
        q.errors.forEach(function (x) { bad(c.id + ' ' + t + ': ' + x.type + ' "' + x.original + '" (' + x.explain + ') — "' + e + '"'); });
        q.issues.filter(function (i) { return i.kind === 'warn' && !/budget|Too close/.test(i.msg); }).forEach(function (i) { bad(c.id + ' ' + t + ': ' + i.msg + ' — "' + e + '"'); });
      });
    });
  });
  /* class draft (A1–A4): one per line, its own slots, longer than 60% */
  M.lines.forEach(function (c) {
    const d = (M.classDraft || {})[c.id];
    if (!d) return bad(mode + ': no class draft for ' + c.id);
    const tok = Lab._toTokens(mode, d);
    if (tok.unknown.length) bad(c.id + ' class draft: unknown slot ' + tok.unknown.join(', '));
    c.slots.forEach(function (k) { if (tok.text.indexOf('{' + k + '}') < 0) bad(c.id + ' class draft: missing [' + M.SLOT_LABEL[k] + ']'); });
  });
  if (S && S.charts[mode]) {
    const tpl = { mode: mode, lines: {} };
    M.lines.forEach(function (c) { tpl.lines[c.id] = { text: Lab._toTokens(mode, M.classDraft[c.id]).text }; });
    const r = Lab._assemble(mode, tpl, {}, { fillWith: function (k, n, shape) { return S.value(mode, k, 'B2', shape, n > 0); } });
    if (r.share < 0.6) bad(mode + ': class draft carries only ' + Math.round(r.share * 100) + '% of its report (the setup says it is over 60%)');
    console.log('  ' + mode + ': ' + M.vars.length + ' variables, ' + M.lines.length + ' lines; class draft ' + M.classId + ' = ' + Math.round(r.share * 100) + '% of a ' + r.words + '-word report');
  }
  L.PCTS.forEach(function (o) {
    const F = Math.round(L.REPORT_WORDS * o.pct / 100), sum = M.lines.reduce(function (s, c) { return s + Lab._compBudget(mode, o.pct, c.id).target; }, 0);
    if (Math.abs(sum - F) > 8) bad(mode + ' ' + o.pct + '%: line targets sum to ' + sum + ', frame budget ' + F);
  });
});

/* ----------------------------------------------------------- 2. scenario */
section('2. lab-scenario.js (Test Drive charts)');
L.MODE_ORDER.forEach(function (mode) {
  const ch = S.charts[mode], M = L.MODES[mode];
  if (!ch) return bad('no scenario chart for ' + mode);
  if (ch.mode !== mode) bad(ch.id + ': mode ' + ch.mode);
  TIERS.forEach(function (t) {
    const vars = {};
    M.vars.forEach(function (d) { vars[d.key] = S.value(mode, d.key, t, 'clause'); if (!vars[d.key]) bad(ch.id + ' ' + t + ': no fill for ' + d.key); });
    M.vars.forEach(function (d) {
      ['clause', 'pp', 'vp'].forEach(function (shape) {
        const v = S.value(mode, d.key, t, shape), r = D.check(d, v, ch, { vars: vars });
        if (r.status === 'bad' || r.status === 'near') bad(ch.id + ' ' + t + ' ' + d.key + ' (' + shape + '): "' + v + '" → ' + r.status + ' ' + r.note);
      });
    });
    /* the tier's first example line for every slot + these fills: the Ten Wards */
    const tpl = { mode: mode, lines: {} };
    M.lines.forEach(function (c) { tpl.lines[c.id] = { text: c.examples[t][0] }; });
    const rep = Lab._assemble(mode, tpl, {}, { fillWith: function (k, n, shape) { return S.value(mode, k, t, shape, n > 0); } });
    /* length depends on the share, so only the other red rows count here */
    const pre = W.preflight(rep.report, ch), red = pre.rows.filter(function (r) { return r.status === 'bad' && r.id !== 'length'; });
    if (red.length) (t === 'B1' ? warn : bad)(ch.id + ' with the ' + t + ' example lines: ' + red.map(function (r) { return r.label; }).join('; '));
  });
  console.log('  ' + ch.id + ': fills checked at B1, B2, C1');
});

/* -------------------------------------------------------- 3. populations */
section('3. Every variable, every bank prompt (' + win.CONTENT.PROMPTS.length + ' prompts' + (extraPrompts.length ? ', incl. ' + extraPrompts.join(', ') : '') + ')');
const pops = {}, byMode = {};
win.CONTENT.PROMPTS.forEach(function (p) {
  const M = L.MODES[p.mode]; if (!M) return bad(p.id + ': unknown mode ' + p.mode);
  const fit = D.fits(p, p.mode);
  if (!fit.ok) { warn(p.id + ': not offered for casting — ' + fit.why); return; }
  let v;
  try { v = D.derive(p, p.mode); } catch (e) { return bad(p.id + ': derive failed: ' + e.message); }
  const res = {};
  M.vars.forEach(function (d) {
    if (!String(v[d.key] || '').trim()) { bad(p.id + ' ' + d.key + ': no value could be derived'); return; }
    const r = D.check(d, v[d.key], p, { vars: v });
    res[d.key] = { value: v[d.key], status: r.status };
    if (r.status === 'bad') bad(p.id + ' ' + d.key + ': "' + v[d.key] + '" → ' + r.note);
  });
  pops[p.id] = { mode: p.mode, vars: res };
  byMode[p.mode] = (byMode[p.mode] || 0) + 1;
});
console.log('  populated: ' + Object.keys(byMode).map(function (m) { return m + ' ' + byMode[m]; }).join(' · '));
if (WRITE) { fs.writeFileSync(path.join(ROOT, 'examples-t1', 'populations.json'), JSON.stringify(pops, null, 1)); console.log('  wrote examples-t1/populations.json'); }

/* ----------------------------------------------------------- 4. examples */
section('4. lab-examples.js');
if (!hasExamples || !E) bad('lab-examples.js missing: run node tools/lab-build-examples.js');
else {
  ['ploy', 'nam', 'fah'].forEach(function (st) { L.MODE_ORDER.forEach(function (mode) { if (!E.sets.some(function (s) { return s.student === st && s.mode === mode; })) bad('no example for ' + st + ' ' + mode); }); });
  E.sets.forEach(function (set) {
    const M = L.MODES[set.mode], p = win.CONTENT.PROMPTS.filter(function (x) { return x.id === set.promptId; })[0];
    if (!p) return bad(set.id + ': prompt ' + set.promptId + ' not in the bank');
    if (p.mode !== set.mode) bad(set.id + ': prompt is ' + p.mode);
    const tpl = { mode: set.mode, lines: {} }, A2 = set.level === 'A2';
    if (A2 && !L.LEVELS.some(function (l) { return l.id === 'A2'; })) bad(set.id + ': no A2 level in LabContent.LEVELS');
    let pageWords = 0;
    M.lines.forEach(function (c) {
      const t = set.lines[c.id]; if (!t) return bad(set.id + ': no line ' + c.id);
      tpl.lines[c.id] = { text: t };
      /* A2 pages are measured against the A2 level's tighter budget (LEVELS[].budgetScale) */
      const q = Lab._quickFrame(set.mode, c, Lab._toLabels(set.mode, t), set.pct, A2 ? 'A2' : undefined);
      q.blocking.forEach(function (b) { bad(set.id + ' ' + c.id + ': ' + b); });
      q.errors.forEach(function (x) { bad(set.id + ' ' + c.id + ': ' + x.type + ' "' + x.original + '"'); });
      if (q.copied) bad(set.id + ' ' + c.id + ': copied from an example: "' + t + '"');
      if (c.para === 'overview') {
        if (/\d/.test(t.replace(/\{\w+\}/g, ''))) bad(set.id + ' ' + c.id + ': a number in an overview frame');
        c.slots.forEach(function (k) { if (FIGURE_TYPES[(M.VAR[k].check || {}).type]) bad(set.id + ' ' + c.id + ': figure slot [' + M.SLOT_LABEL[k] + '] in an overview line'); });
      }
      if (A2) {
        pageWords += q.words;
        if (q.words > q.budget.hi) bad(set.id + ' ' + c.id + ': ' + q.words + ' page words, over the A2 budget ' + q.budget.lo + '–' + q.budget.hi + ' at ' + set.pct + '%');
        if (c.para === 'intro' && q.words > 12) bad(set.id + ' ' + c.id + ': ' + q.words + ' page words in an A2 intro line (12 at most)');
      }
    });
    if (A2) {
      const lv = L.LEVELS.filter(function (l) { return l.id === 'A2'; })[0] || {}, cap = Math.round(L.REPORT_WORDS * set.pct / 100 * (lv.budgetScale || 1) * ((lv.budgetSpread || [0, 1.15])[1]));
      if (pageWords > cap) bad(set.id + ': ' + pageWords + ' page words, over the A2 ' + set.pct + '% page (' + cap + ')');
    }
    const vars = {}; Object.keys(set.vars).forEach(function (k) { vars[k] = set.vars[k].text; });
    M.vars.forEach(function (d) {
      if (!vars[d.key]) return bad(set.id + ': no value for ' + d.key);
      const r = D.check(d, vars[d.key], p, { vars: vars });
      if (r.status !== 'ok') bad(set.id + ' ' + d.key + ': "' + vars[d.key] + '" → ' + r.status + ' ' + r.note);
      const q = Lab._quickVar(set.mode, d.key, vars[d.key], (set.vars[d.key] || {}).text2, { tpl: tpl, prompt: p, vars: set.vars, needs2: false });
      q.errors.forEach(function (x) { bad(set.id + ' ' + d.key + ': ' + x.type + ' — ' + x.explain); });
      const v2 = (set.vars[d.key] || {}).text2;
      if (A2 && v2) { const r2 = D.check(d, v2, p, { vars: vars }); if (r2.status !== 'ok') bad(set.id + ' ' + d.key + ' (2nd): "' + v2 + '" → ' + r2.status + ' ' + r2.note); }
    });
    const r = Lab._assemble(set.mode, tpl, set.vars, {});
    const wantWords = A2 ? [120, 145] : [150, 200];
    if (r.words < wantWords[0] || r.words > wantWords[1]) bad(set.id + ': ' + r.words + ' words (want ' + wantWords[0] + '–' + wantWords[1] + ')');
    if (A2) {
      /* every detail sentence carries a figure, a year or a chart label (SKILL §5) */
      const labs = (p.labels || []).map(function (x) { return String(x).toLowerCase(); });
      r.paras.filter(function (pg) { return pg.key === 'groupA' || pg.key === 'groupB'; }).forEach(function (pg) {
        pg.text.split(/(?<=[.!?])\s+/).filter(Boolean).forEach(function (sen) {
          const low = sen.toLowerCase();
          if (!/\d/.test(sen) && !labs.some(function (lb) { return low.indexOf(lb) >= 0; })) bad(set.id + ': detail sentence with no figure, year or label: "' + sen + '"');
        });
      });
    }
    if (Math.abs(r.share * 100 - set.pct) > 20) bad(set.id + ': actual share ' + Math.round(r.share * 100) + '% is far from the ' + set.pct + '% page');
    const pre = W.preflight(r.report, p), red = pre.rows.filter(function (x) { return x.status === 'bad'; }), amber = pre.rows.filter(function (x) { return x.status === 'warn'; });
    /* an A2 report is 120–145 words: its length row is red by design (TA capped at 5) */
    red.forEach(function (x) { if (A2 && x.id === 'length') return; bad(set.id + ' Ten Wards: ' + x.label + ' — ' + x.note); });
    if (set.rating) {
      const b = set.rating, m = (b.ta + b.cc + b.lr + b.gra) / 4, ov = Math.floor(m * 2 + 0.5 + 1e-9) / 2;
      if (ov !== b.overall) bad(set.id + ': overall ' + b.overall + ' is not the rounded mean (' + ov + ')');
      const cefr = ov >= 8.5 ? 'C2' : ov >= 7 ? 'C1' : ov >= 5.5 ? 'B2' : ov >= 4 ? 'B1' : '';
      if (cefr && b.cefr !== cefr) bad(set.id + ': CEFR ' + b.cefr + ' does not match Band ' + ov + ' (official map: ' + cefr + ')');
    }
    console.log('  ' + set.id + ': ' + r.words + ' words · share ' + Math.round(r.share * 100) + '% (page ' + set.pct + '%) · data ✓ ' + M.vars.length + '/' + M.vars.length + ' · Wards: ' + pre.summary + (amber.length ? ' [' + amber.map(function (x) { return x.label; }).join('; ') + ']' : ''));
  });
}

/* ------------------------------------------------------ 4b. lab-samples.js
   One filled sample per line at A2 and B1: every slot value true to its
   chart, every frame carrying exactly its line's slots, in its own words,
   no numbers in overview frames, inside the level's page-word budget.      */
section('6. lab-samples.js (WP18 sample lines)');
const hasSamples = load('lab-samples.js', true), SM = win.LabSamples;
if (!hasSamples || !SM) bad('lab-samples.js missing');
else L.MODE_ORDER.forEach(function (mode) {
  const M = L.MODES[mode], byLevel = SM[mode] || {};
  ['A2', 'B1'].forEach(function (lvl) {
    const set = byLevel[lvl];
    if (!set) return bad('no ' + mode + ' ' + lvl + ' samples');
    const p = win.CONTENT.PROMPTS.filter(function (x) { return x.id === set.chart; })[0];
    if (!p) return bad(mode + ' ' + lvl + ': chart ' + set.chart + ' not in the bank');
    if (p.mode !== mode) bad(mode + ' ' + lvl + ': chart ' + set.chart + ' is ' + p.mode);
    if (S && S.charts[mode] && S.charts[mode].id === set.chart) bad(mode + ' ' + lvl + ': sample chart is the test-drive chart');
    const vars = {}; Object.keys(set.vars || {}).forEach(function (k) { const v = set.vars[k]; vars[k] = v && typeof v === 'object' ? v.text : v; });
    M.vars.forEach(function (d) {
      if (!vars[d.key]) return bad(mode + ' ' + lvl + ': no sample value for ' + d.key);
      const r = D.check(d, vars[d.key], p, { vars: vars });
      if (r.status !== 'ok') bad(mode + ' ' + lvl + ' ' + d.key + ': "' + vars[d.key] + '" → ' + r.status + ' ' + r.note);
      const v2 = set.vars[d.key] && set.vars[d.key].text2;
      if (v2) { const r2 = D.check(d, v2, p, { vars: vars }); if (r2.status === 'bad') bad(mode + ' ' + lvl + ' ' + d.key + ' (2nd): "' + v2 + '" → ' + r2.note); }
    });
    let n = 0;
    M.lines.forEach(function (c) {
      const fr = (set.lines || {})[c.id];
      if (!fr) return bad(mode + ' ' + lvl + ': no sample line for ' + c.id);
      n++;
      const q = Lab._quickFrame(mode, c, Lab._toLabels(mode, fr), 60, lvl);
      q.blocking.forEach(function (b) { bad(mode + ' ' + lvl + ' ' + c.id + ': ' + b); });
      q.errors.forEach(function (x) { bad(mode + ' ' + lvl + ' ' + c.id + ': ' + x.type + ' "' + x.original + '" (' + x.explain + ')'); });
      if (q.copied) bad(mode + ' ' + lvl + ' ' + c.id + ': too close to a line example: "' + fr + '"');
      q.issues.filter(function (i) { return i.kind === 'warn' && !/budget|Too close/.test(i.msg); }).forEach(function (i) { bad(mode + ' ' + lvl + ' ' + c.id + ': ' + i.msg + ' — "' + fr + '"'); });
      if (q.words > q.budget.hi) (lvl === 'A2' ? bad : warn)(mode + ' ' + lvl + ' ' + c.id + ': ' + q.words + ' page words, over the ' + lvl + ' budget ' + q.budget.lo + '–' + q.budget.hi + ': "' + fr + '"');
      const filled = Lab._fillSample(mode, fr, set.vars, {});
      if (/\{\w+\}|\[[^\]]+\]/.test(filled)) bad(mode + ' ' + lvl + ' ' + c.id + ': unfilled slot in "' + filled + '"');
    });
    /* the whole set as a report: the Ten Wards (length not counted) */
    const tpl = { mode: mode, lines: {} }; M.lines.forEach(function (c) { tpl.lines[c.id] = { text: set.lines[c.id] || '' }; });
    const objVars = {}; Object.keys(set.vars || {}).forEach(function (k) { const v = set.vars[k]; objVars[k] = v && typeof v === 'object' ? v : { text: v }; });
    const rep = Lab._assemble(mode, tpl, objVars, {});
    /* thirteen short values cannot name every map feature: coverage is a note, the rest must be clean */
    const pre = W.preflight(rep.report, p), red = pre.rows.filter(function (r) { return r.status === 'bad' && r.id !== 'length'; });
    red.forEach(function (r) { (r.id === 'coverage' ? warn : bad)(mode + ' ' + lvl + ' samples as a report: ' + r.label + ' — ' + r.note); });
    console.log('  ' + mode + ' ' + lvl + ': ' + n + ' lines on ' + set.chart + ' · ' + rep.words + ' words · ' + M.vars.length + ' values checked · Wards: ' + pre.summary);
  });
});

/* --------------------------------------- 7. COMPARE category reach (item 3)
   The Design screen warns when a COMPARE page cannot name every category of
   the Test-Drive chart (Template.Data.reach, lab.js reachWarn). A page that
   reaches every category (or says "the remaining …") passes; C1-Student's
   page from the walkthrough warns on the grouped Chiang Rai chart.         */
section('7. COMPARE category reach (Design warning)');
(function () {
  const M = L.MODES.COMPARE, ch = S.charts.COMPARE;
  function tplOf(lines) { const t = { mode: 'COMPARE', lines: {} }; M.lines.forEach(function (c) { t.lines[c.id] = { text: Lab._toTokens('COMPARE', lines[c.id] || '').text }; }); return t; }
  let c1 = null;
  try { c1 = JSON.parse(fs.readFileSync(path.join(ROOT, 'tools', 'walkthrough', 'personas', 'c1.json'), 'utf8')).spellbook.design.COMPARE; } catch (e) { bad('tools/walkthrough/personas/c1.json: no COMPARE design lines'); }
  if (c1) {
    const w = Lab._reachWarn('COMPARE', tplOf(c1), ch);
    if (!/^This page names at most 5 of the 7 categories — add a slot or a 'the remaining …' line\./.test(w)) bad('C1-Student\'s COMPARE page should warn "at most 5 of the 7" on ' + ch.id + ', got: "' + w + '"');
    if (!/Men, Women/.test(w)) bad('the warning should name the categories no slot can hold (Men, Women): "' + w + '"');
    const screen = D.reach(P_('p-bar-screentime'), Lab._toTokens('COMPARE', M.lines.map(function (c) { return c1[c.id]; }).join(' ')).text);
    if (!(screen.warn && screen.slots === 3 && screen.total === 7)) bad('C1-Student\'s page on p-bar-screentime should reach 3 of 7, got ' + JSON.stringify(screen));
    const fixed = JSON.parse(JSON.stringify(c1));
    fixed['c-b'] = '[Group B] reached [Figure B], with all four age groups shown in the chart.';
    if (Lab._reachWarn('COMPARE', tplOf(fixed), ch)) bad('a "the remaining …"-type line ("all four age groups") should answer the warning');
  }
  /* the class draft says "every one of the categories": no warning on any chart */
  const draft = tplOf(M.classDraft);
  win.CONTENT.PROMPTS.filter(function (p) { return p.mode === 'COMPARE'; }).concat([ch]).forEach(function (p) { if (Lab._reachWarn('COMPARE', draft, p)) bad('the class draft should reach every category of ' + p.id); });
  /* a page that can name every category passes: single-axis charts with both group slots */
  ['p-pie-budget', 'p-table-salaries', 'p-mixed-coffee', 'p-pie-waste', 'p-table-phones', 'p-table-sleep', 'p-mixed-gym'].forEach(function (id) {
    const r = D.reach(P_(id), M.lines.map(function (c) { return c.examples.B1[0]; }).join(' '));
    if (r.warn || r.slots !== r.total) bad(id + ': a page with [Group A] and [Group B] should reach all ' + r.total + ' categories, got ' + r.slots);
  });
  /* a page with no group slot at all names at most [Largest] + [Smallest] + [Exception] */
  const thin = D.reach(P_('p-pie-budget'), 'Overall, {top} led, while {bottom} came last. {exception}.');
  if (!(thin.warn && thin.slots === 3 && thin.total === 6)) bad('a page with only [Largest]/[Smallest]/[Exception] should reach 3 of 6 on p-pie-budget, got ' + JSON.stringify(thin));
  /* fix pass, finding 1: [Largest] / [Smallest] reach the chart's REAL largest
     and smallest, not the first labels; [Exception] counts but names nothing */
  const TB = 'Overall, {top} led, while {bottom} came last.';
  [['p-pie-budget', 'Food and drinks', 'Savings', ['Transport', 'Phone and internet', 'Clothes', 'Entertainment']],
   ['p-pie-waste', 'Food', 'Metal', ['Plastic', 'Paper', 'Glass', 'Other']],
   ['p-bar-screentime', 'Social media', 'Gaming', ['Streaming video', '13–17', '18–29', '30–49', '50+']],
   ['p-bar-homework', 'Maths', 'Thai', ['English', 'Science', 'M3', 'M4', 'M5']],
   ['p-table-salaries', 'Germany', 'Thailand', ['Japan', 'Korea', 'USA']],
   ['p-table-phones', 'Alpha 12', 'Zen Lite', ['Orbit Max', 'Nova S', 'Pixelite 4']],
   ['p-mixed-coffee', 'Finland', 'Thailand', ['Italy', 'Brazil', 'Japan']]].forEach(function (c) {
    const r = D.reach(P_(c[0]), TB);
    if (r.free.indexOf(c[1]) >= 0 || r.free.indexOf(c[2]) >= 0) bad(c[0] + ': {top}/{bottom} should reach ' + c[1] + ' and ' + c[2] + ', free = ' + r.free.join(', '));
    if (r.free.join('|') !== c[3].join('|')) bad(c[0] + ': with only {top}/{bottom} the free categories should be ' + c[3].join(', ') + ', got ' + r.free.join(', '));
    if (r.could.length) bad(c[0] + ': no [Exception] slot, so nothing "could" be held: ' + r.could.join(', '));
    const w = Lab._reachWarn('COMPARE', { mode: 'COMPARE', lines: { 'c-ov-ext': { text: TB } } }, P_(c[0]));
    if (w.indexOf(c[1]) >= 0 || w.indexOf(c[2]) >= 0) bad(c[0] + ': the Design warning must not list ' + c[1] + ' / ' + c[2] + ' as "no slot": ' + w);
  });
  const exW = Lab._reachWarn('COMPARE', { mode: 'COMPARE', lines: { 'c-ov-ext': { text: TB }, 'c-exc': { text: 'The exception was {exception}.' } } }, P_('p-pie-budget'));
  if (!/at most 3 of the 6/.test(exW) || !/\[Exception\] can hold one of them/.test(exW)) bad('p-pie-budget with [Exception]: the warning should say 3 of 6 and that [Exception] can hold one: ' + exW);
  const ex = D.reach(P_('p-pie-budget'), TB + ' {exception}.');
  if (!(ex.slots === 3 && ex.free.length === 4 && ex.could.join('|') === 'Transport|Phone and internet|Clothes|Entertainment')) bad('p-pie-budget: [Exception] counts one more but names none (could = the open slices): ' + JSON.stringify(ex));
  /* fix pass, finding 8: a [Group A] line must read for ONE category too */
  M.lines.filter(function (c) { return c.slots.indexOf('groupA') >= 0; }).forEach(function (c) { ['B1', 'B2', 'C1'].forEach(function (t) { c.examples[t].forEach(function (e) { if (/\{groupA\},? (?:for their part|were|have|are)\b/.test(e)) bad(c.id + ' ' + t + ': "' + e + '" breaks agreement when [Group A] is one category'); }); }); });
  console.log('  C1-Student\'s page warns on ' + ch.id + '; the class draft and full single-axis pages pass');
})();
function P_(id) { return win.CONTENT.PROMPTS.filter(function (x) { return x.id === id; })[0]; }

/* --------------------------------------------------- 5. awards and files */
section('5. Keepsakes, ranks, ES5, UK spelling');
const bid = {};
L.BADGES.forEach(function (b) { if (bid[b.id]) bad('duplicate keepsake ' + b.id); bid[b.id] = 1; if (typeof b.test !== 'function') bad(b.id + ': no test'); if (b.test({}) !== false) bad(b.id + ': test should be false for a new student'); });
L.RANKS.forEach(function (r, i) { if (i && r.min <= L.RANKS[i - 1].min) bad('ranks not ascending at ' + r.name); });
let acorn = null;
['acorn', '/opt/node-tools/node_modules/acorn', '/opt/npm-tools/node_modules/acorn'].some(function (m) { try { acorn = require(m); return true; } catch (e) { return false; } });
const US = /\b(color|colors|center|centers|centered|favorite|favorites|behavior|organize|organized|organizing|analyze|analyzed|labeled|labeling|traveled|traveling|meter|meters|liter|program me|gray|catalog|practicing|license|defense|modeling|modeled|totaled|leveled|canceled|fulfill|enroll|aluminum)\b/i;
['template.js', 'lab.js', 'lab-content.js', 'lab-scenario.js', 'lab-examples.js', 'lab-samples.js'].forEach(function (f) {
  const src = fs.readFileSync(path.join(ROOT, f), 'utf8');
  if (acorn) {
    try { acorn.parse(src, { ecmaVersion: 5 }); } catch (e) { bad(f + ': not ES5 — ' + e.message); }
    try {
      for (const tok of acorn.tokenizer(src, { ecmaVersion: 2020 })) {
        if (tok.type.label === 'string' && US.test(String(tok.value).replace(/<[^>]*>/g, ' ')) && !/^\\b|\(\?|\|/.test(tok.value)) warn(f + ': US spelling in "' + String(tok.value).slice(0, 80) + '"');
      }
    } catch (e) { /* tokenizer stops on the first problem; the ES5 parse above reports it */ }
  } else if (/=>|\blet\s|\bconst\s|`/.test(src)) bad(f + ': ES6 syntax (no acorn to parse it properly)');
});
console.log('  ' + L.BADGES.length + ' keepsakes, ' + L.RANKS.length + ' ranks; ES5 parse ' + (acorn ? 'with acorn' : 'by pattern'));

console.log('\n' + (errors ? '✕ ' + errors + ' problem(s)' : '✓ Spellbook Workshop content and data are consistent') + (warnings ? ' · ' + warnings + ' note(s)' : ''));
process.exit(errors ? 1 : 0);
