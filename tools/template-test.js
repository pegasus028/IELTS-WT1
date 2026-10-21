/* Tests the Scriptorium API of template.js (My Spellbook):
   Template.framesFor(p, mode), Template.fill(frames, values), the store, the
   memory check.            node tools/template-test.js                      */
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.join(__dirname, '..');
const store = {};
const win = { CONTENT: { PROMPTS: [] }, localStorage: { getItem: (k) => (k in store ? store[k] : null), setItem: (k, v) => { store[k] = String(v); } } };
win.window = win;
const ctx = { window: win, localStorage: win.localStorage }; vm.createContext(ctx);
['prompts.js', 'prompts-2.js', 'template.js', 'lab-content.js'].forEach((f) => vm.runInContext(fs.readFileSync(path.join(ROOT, f), 'utf8'), ctx));
const T = win.Template, L = win.LabContent;
let fails = 0;
function check(label, cond, extra) { console.log((cond ? '  ok   ' : '  FAIL ') + label + (cond ? '' : ' ' + JSON.stringify(extra))); if (!cond) fails++; }

const p = { studentId: 'M4-Ploy' };
check('no page → framesFor returns null', T.framesFor(p, 'TREND') === null);
const lines = {};
L.MODES.TREND.lines.forEach((c) => { lines[c.id] = { text: c.examples.B2[0] }; });
const page1 = { id: 'T1', mode: 'TREND', name: 'Old', version: 1, pct: 50, level: 'B2', status: 'complete', lines: lines, updatedAt: '2026-10-01T00:00:00Z' };
const page2 = JSON.parse(JSON.stringify(page1)); page2.id = 'T2'; page2.name = 'New'; page2.version = 2; page2.updatedAt = '2026-10-02T00:00:00Z';
const draft = JSON.parse(JSON.stringify(page1)); draft.id = 'T3'; draft.status = 'draft'; draft.updatedAt = '2026-10-03T00:00:00Z';
T.save(p.studentId, { templates: [page1, page2, draft], attempts: [], dirty: {}, inUse: {} });
check('store key is cc.lab.v1.<lower-case id>', 'cc.lab.v1.m4-ploy' in store);
let f = T.framesFor(p, 'TREND');
check('latest complete page is used, drafts ignored', f && f.templateId === 'T2', f && f.templateId);
check('four paragraphs with {slot} tokens', f.paragraphs.length === 4 && /\{visual\}/.test(f.paragraphs[0]) && f.paraKeys.join() === 'intro,overview,groupA,groupB', f.paragraphs);
check('13 slots with label and shape, in order of first use', f.slots.length === 13 && f.slots[0].id === 'visual' && f.slots[0].label === 'Visual' && !!f.slots[0].shape, f.slots.map((s) => s.id));
check('overview paragraph has no figure slots', !/\{fig/.test(f.paragraphs[1]));
const d = T.load(p.studentId); d.inUse.TREND = 'T1'; T.save(p.studentId, d);
check('the page "in use" wins', T.framesFor(p, 'TREND').templateId === 'T1');
check('other modes stay empty', T.framesFor(p, 'SPACE') === null);
const vals = { visual: 'line graph', what: 'how many people visited three museums, in thousands', y1: '2010', y2: '2020', groupA: 'the Science Museum', moveA: { text: 'rose steadily', text2: 'climbed' } };
const text = T.fill(f, vals);
check('fill joins four paragraphs', text.split('\n\n').length === 4, text);
check('fill puts values in and labels the empty slots', /The line graph illustrates how many people/.test(text) && /\[Group B\]/.test(text), text);
check('second mention uses text2', /Overall, it is clear that the Science Museum rose steadily/.test(text) && /It then climbed/.test(text), text);
check('a value that opens a sentence gets a capital', /^The Science Museum began|\. The Science Museum/.test(T.fill('{groupA} began.', vals)) || T.fill('{groupA} began.', vals) === 'The Science Museum began.', T.fill('{groupA} began.', vals));
check('fill(string) with html marks slots', /<span class="slot filled">line graph<\/span>/.test(T.fill('The {visual}.', vals, { html: true })));
check('tokens()', T.tokens('a {x} b {y}').join() === 'x,y');
check('labels(mode)', T.labels('SPACE').where1 === 'Location 1');
const full = L.MODES.TREND.lines.map((c) => c.examples.B2[0].replace(/\{\w+\}/g, '[x]')).join(' ');
check('memory check: whole page = 100%', Math.round(T._recallScore(page1, full, 'TREND') * 100) === 100);
check('memory check: half the page is about half', Math.abs(T._recallScore(page1, full.slice(0, full.length / 2), 'TREND') - 0.5) < 0.15);
/* WP22: order-aware */
const shuffled = (function (ws) { let seed = 7; for (let i = ws.length - 1; i > 0; i--) { seed = (seed * 9301 + 49297) % 233280; const j = Math.floor(seed / 233280 * (i + 1)); const t = ws[i]; ws[i] = ws[j]; ws[j] = t; } return ws.join(' '); })(full.split(' '));
const dS = T._recallDetail(page1, shuffled, 'TREND');
check('memory check: shuffled words = 100% words but few pairs in order', Math.round(dS.words * 100) === 100 && dS.order < 0.4, dS);
check('memory check: shuffled page is not "ready"', !/ready/.test(T._recallVerdict(dS)) && /not in order/.test(T._recallVerdict(dS)), T._recallVerdict(dS));
const dF = T._recallDetail(page1, full, 'TREND');
check('memory check: whole page in order is ready', dF.order === 1 && /ready/.test(T._recallVerdict(dF)), dF);
const gappy = full.split(' ').filter((w, i) => i % 7 !== 3).join(' ');
const dG = T._recallDetail(page1, gappy, 'TREND');
check('memory check: a few gaps keep the order above 60%', dG.order >= 0.6 && dG.order < 0.9 && /nearly there/.test(T._recallVerdict(dG)), dG);
check('memory check: slot labels in brackets are ignored on both sides', T._recallDetail(page1, full.replace(/\[x\]/g, '[Group A]'), 'TREND').order === 1);
check('memory check: empty text scores 0', T._recallDetail(page1, '', 'TREND').order === 0 && T._recallDetail(page1, '', 'TREND').words === 0);
/* ---- item 3: a Scriptorium report built from a shipped COMPARE page never
   gets a RED coverage ward for a category the page has no slot for. Every
   hand-written level page (B1/B2/C1 × 3 example sets, the class draft) is
   saved as the student's page, opened with framesFor, filled with the
   automatic values for each COMPARE prompt (Template.Data.derive) and run
   through Writer.preflight with the page (opts.page, as the Scriptorium
   does). The ward must stay honest: never green while a category is missing,
   amber with "no slot" when only slot-less categories are missing, red when
   the page could have named the missing one. */
(function () {
  const wctx = ctx; wctx.window.CONTENT.MODELS = wctx.window.CONTENT.MODELS || [];
  vm.runInContext(fs.readFileSync(path.join(ROOT, 'prompts-3.js'), 'utf8'), wctx);
  vm.runInContext(fs.readFileSync(path.join(ROOT, 'writer.js'), 'utf8'), wctx);
  const W = win.Writer, D = T.Data, M = L.MODES.COMPARE, sid = { studentId: 'M4-Item3' };
  const pages = [];
  ['B1', 'B2', 'C1'].forEach((tier) => [0, 1, 2].forEach((i) => { const ln = {}; M.lines.forEach((c) => { ln[c.id] = { text: c.examples[tier][i] }; }); pages.push([tier + '#' + (i + 1), ln]); }));
  const lab2key = {}; Object.keys(M.SLOT_LABEL).forEach((k) => { lab2key[M.SLOT_LABEL[k]] = k; });
  const dl = {}; M.lines.forEach((c) => { dl[c.id] = { text: M.classDraft[c.id].replace(/\[([^\]]+)\]/g, (a, lb) => (lab2key[lb] ? '{' + lab2key[lb] + '}' : a)) }; });
  pages.push(['class draft', dl]);
  const prompts = win.CONTENT.PROMPTS.filter((q) => q.mode === 'COMPARE');
  let n = 0, red = [], green = [], amber = 0;
  pages.forEach((pg) => {
    T.save(sid.studentId, { templates: [{ id: 'C-' + pg[0], mode: 'COMPARE', name: pg[0], version: 1, pct: 50, level: 'B2', status: 'complete', lines: pg[1], updatedAt: '2026-10-21T00:00:00Z' }], attempts: [], dirty: {}, inUse: {} });
    const fr = T.framesFor(sid, 'COMPARE');
    prompts.forEach((q) => {
      n++;
      const report = T.fill(fr, D.derive(q, 'COMPARE')), page = fr.paragraphs.join(' ');
      const cov = W.preflight(report, q, { page: page }).rows.filter((r) => r.id === 'coverage')[0];
      const free = D.reach(q, page).free, plain = W.preflight(report, q).rows.filter((r) => r.id === 'coverage')[0];
      if (cov.status === 'bad' && /no slot/.test(cov.note) === false && plain.status === 'bad' && free.length) {
        const onlyFree = (plain.label.replace(/^Not mentioned: /, '').split(', ')).every((l) => free.indexOf(l) >= 0);
        if (onlyFree) red.push(pg[0] + ' on ' + q.id + ': ' + cov.label);
      }
      if (plain.status !== 'ok' && cov.status === 'ok') green.push(pg[0] + ' on ' + q.id);
      if (cov.status === 'warn') { amber++; if (!/caps Task Achievement/.test(cov.note) || !/no slot/.test(cov.note)) red.push(pg[0] + ' on ' + q.id + ': the amber note must keep the cap and say "no slot": ' + cov.note); }
    });
  });
  check('COMPARE reports from ' + pages.length + ' shipped pages × ' + prompts.length + ' prompts (' + n + '): never red for a category the page has no slot for', red.length === 0, red.slice(0, 5));
  check('… and never green while a category is missing (' + amber + ' amber)', green.length === 0, green.slice(0, 5));
  check('… the screen-time chart is one of them: the age groups have no slot, so the row is amber', (function () {
    T.save(sid.studentId, { templates: [{ id: 'C-x', mode: 'COMPARE', name: 'x', version: 1, pct: 50, level: 'B2', status: 'complete', lines: pages[0][1], updatedAt: '2026-10-21T00:00:00Z' }], attempts: [], dirty: {}, inUse: {} });
    const fr = T.framesFor(sid, 'COMPARE'), q = win.CONTENT.PROMPTS.filter((x) => x.id === 'p-bar-screentime')[0];
    const cov = W.preflight(T.fill(fr, D.derive(q, 'COMPARE')), q, { page: fr.paragraphs.join(' ') }).rows.filter((r) => r.id === 'coverage')[0];
    return cov.status === 'warn' && /18–29/.test(cov.label);
  })());
  /* a category the page COULD name and the report leaves out stays red */
  const q2 = win.CONTENT.PROMPTS.filter((x) => x.id === 'p-pie-budget')[0];
  T.save(sid.studentId, { templates: [{ id: 'C-y', mode: 'COMPARE', name: 'y', version: 1, pct: 50, level: 'B2', status: 'complete', lines: pages[0][1], updatedAt: '2026-10-21T00:00:00Z' }], attempts: [], dirty: {}, inUse: {} });
  const fr2 = T.framesFor(sid, 'COMPARE'), v2 = D.derive(q2, 'COMPARE'); v2.groupA = 'food and drinks'; v2.contrast = 'food and drinks took more than any other category';
  const cov2 = W.preflight(T.fill(fr2, v2), q2, { page: fr2.paragraphs.join(' ') }).rows.filter((r) => r.id === 'coverage')[0];
  check('a category the page has a slot for (transport, in [Group A]) and the report misses stays red', cov2.status === 'bad' && /Transport/.test(cov2.label), cov2);
  /* without the page (guided / exam mode) nothing changes */
  const fr3 = T.framesFor(sid, 'COMPARE'), q3 = win.CONTENT.PROMPTS.filter((x) => x.id === 'p-bar-screentime')[0];
  check('without opts.page the coverage row is unchanged (red)', W.preflight(T.fill(fr3, D.derive(q3, 'COMPARE')), q3).rows.filter((r) => r.id === 'coverage')[0].status === 'bad');
})();
console.log(fails ? fails + ' check(s) FAILED' : 'All template.js checks passed');
process.exit(fails ? 1 : 0);
