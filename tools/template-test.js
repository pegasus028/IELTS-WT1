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
console.log(fails ? fails + ' check(s) FAILED' : 'All template.js checks passed');
process.exit(fails ? 1 : 0);
