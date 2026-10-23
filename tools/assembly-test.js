/* WS-B · Assembly v2 unit tests: content → rounds, the five round types, scoring,
   and the data check on sample posts for the phase-1 games (Number Hunt, Slice It,
   Table Detective, Twice As Much). Runs the browser files in a vm (no DOM needed
   for the engine; the UI functions are only checked to exist).
   node tools/assembly-test.js                                                */
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.join(__dirname, '..');
const ctx = { window: {}, console, localStorage: { getItem() { return null; }, setItem() {}, removeItem() {} } };
ctx.window.window = ctx.window; ctx.window.localStorage = ctx.localStorage; ctx.window.CONTENT = { PROMPTS: [], MODELS: [] };
vm.createContext(ctx);
['content.js', 'prompts.js', 'prompts-2.js', 'prompts-3.js', 'vw2-prompts.js', 'template.js', 'lab-content.js', 'writer.js', 'assembly-content.js', 'assembly.js'].forEach(function (f) {
  const p = path.join(ROOT, f); if (fs.existsSync(p)) vm.runInContext(fs.readFileSync(p, 'utf8'), ctx, { filename: f });
});
const A = ctx.window.Assembly, AC = ctx.window.ASSEMBLY_CONTENT;
let n = 0, fails = 0;
function t(name, cond, extra) { n++; if (!cond) { fails++; console.log('  ✕ ' + name + (extra !== undefined ? '  ' + JSON.stringify(extra) : '')); } }
function P(id) { return ctx.window.CONTENT.PROMPTS.filter(function (p) { return p.id === id; })[0]; }

/* ---------- content and rounds ------------------------------------------ */
t('content loaded', AC && Object.keys(AC.games).length >= 9, Object.keys(AC.games || {}));
t('six teams of five', AC.teams.length === 6 && AC.teams.every(function (x) { return x.ids.length === 5; }));
['p-vw2-line-electives', 'p-vw2-bar-books', 'p-vw2-pie-freetime', 'p-vw2-table-cafes', 'p-vw2-line-bookshops'].forEach(function (id) { t('prompt ' + id + ' loaded', !!P(id)); });
const EXPECT = { 'mode-sort': ['choice'], 'overview-or-not': ['choice'], 'paraphrase-relay': ['post', 'post', 'post'], 'number-hunt': ['datapost'], 'group-them': ['post'], 'twice-as-much': ['bid', 'bid'], 'slice-it': ['datapost'], 'table-detective': ['datapost'], 'examiners-chair': ['checklist', 'checklist'] };
Object.keys(EXPECT).forEach(function (g) {
  const rs = A.rounds(g);
  t(g + ' rounds ' + EXPECT[g].join('/'), rs.map(function (r) { return r.type; }).join('/') === EXPECT[g].join('/'), rs.map(function (r) { return r.type; }));
  rs.forEach(function (r) { t(g + ' round ' + r.ri + ' has seconds', r.seconds > 0); if (r.promptId && r.type !== 'choice') t(g + ' prompt exists', !!P(r.promptId), r.promptId); });
});
t('data-dictation (paper) is not a game', !A.games().some(function (g) { return g.gameId === 'data-dictation'; }));
t('legacy free rounds listed', A.games().some(function (g) { return g.gameId === 'free-post'; }) && A.games().some(function (g) { return g.gameId === 'fix-band6'; }));
const MS = A.rounds('mode-sort')[0];
t('Mode Sort: 12 cards, every prompt exists', MS.cards.length === 12 && MS.cards.every(function (c) { return !!P(c.promptId); }));
t('Mode Sort: 3 per mode', ['TREND', 'COMPARE', 'SEQUENCE', 'SPACE'].every(function (m) { return MS.cards.filter(function (c) { return c.qs[0].accept[0] === m; }).length === 3; }));
t('Mode Sort card 3 accepts TREND or COMPARE', MS.cards[2].qs[0].accept.indexOf('TREND') >= 0 && MS.cards[2].qs[0].accept.indexOf('COMPARE') >= 0);
t('Mode Sort: unit options shuffled but the right one kept', MS.cards.every(function (c) { return c.qs[1].options.length === 4 && c.qs[1].options.indexOf(c.qs[1].accept[0]) >= 0; }));
t('Mode Sort: the right unit is not always first', MS.cards.filter(function (c) { return c.qs[1].options[0] === c.qs[1].accept[0]; }).length <= 6);
t('Mode Sort: 12 × 15 s', MS.seconds === 180);
const ON = A.rounds('overview-or-not')[0];
t('Overview or Not: 12 cards, five labels, 20 s, no late penalty', ON.cards.length === 12 && ON.cards[0].qs[0].options.length === 5 && ON.answer === 20 && ON.cards[0].late === 0);
t('Overview or Not: six borderline cards', ON.cards.filter(function (c) { return c.borderline; }).length === 6);

/* ---------- choice marks -------------------------------------------------- */
let cm = A.choiceMark(MS.cards[0], { mode: 'TREND', unit: '% of households' }, false);
t('choice: right mode + unit = 3', cm.points === 3, cm);
cm = A.choiceMark(MS.cards[0], { mode: 'TREND', unit: 'hours per week' }, true);
t('choice: right mode, wrong unit, late = 1', cm.points === 1 && cm.late, cm);
cm = A.choiceMark(MS.cards[2], { mode: 'COMPARE', unit: '%' }, false);
t('choice: acceptAlso honoured (two pies → COMPARE ok)', cm.points === 3, cm);
cm = A.choiceMark(MS.cards[1], { mode: 'COMPARE', unit: 'million tonnes' }, false);
t('choice: trap table with years → COMPARE wrong = 1', cm.points === 1, cm);
cm = A.choiceMark(ON.cards[4], { label: 'figure' }, true);
t('judge: around 80% is a figure; late costs nothing', cm.points === 1, cm);
cm = A.choiceMark(ON.cards[0], { label: 'figure' }, false);
t('judge: years are not a figure → 0', cm.points === 0, cm);

/* ---------- cardAt timing ------------------------------------------------ */
let ca = A.cardAt(MS, 1000, 1000 + 3000);
t('cardAt: 3 s in = card 1 flashing', ca.i === 0 && ca.flashing, ca);
ca = A.cardAt(MS, 1000, 1000 + 7000);
t('cardAt: 7 s in = card 1 answering', ca.i === 0 && !ca.flashing, ca);
ca = A.cardAt(MS, 1000, 1000 + 16000);
t('cardAt: 16 s in = card 2', ca.i === 1 && ca.flashing, ca);
ca = A.cardAt(MS, 1000, 1000 + 181000);
t('cardAt: after the end = done', ca.done);

/* ---------- data check: Number Hunt (electives, gridline 20 → tol 10) ------ */
const EL = 'p-vw2-line-electives';
function dc(text, pid) { return A.dataCheck(text, pid || EL); }
function stat(text, pid) { return dc(text, pid).sentences[0].figures.map(function (f) { return f.status; }).join(' '); }
AC.games['number-hunt'].sampleSentences.forEach(function (s) {
  const r = dc(s.text); t('sample all green: ' + s.text, r.greens === 1 && r.crosses === 0, r.sentences[0].figures);
});
t('S3 exact: Chinese rose from 60 in 2016 to 140 in 2024 → +1', dc('Chinese rose steadily from 60 students in 2016 to 140 in 2024.').points === 1);
let r = dc('Chinese rose from 60 in 2016 to 120 in 2024.');
t('wrong end figure (120 is 2022) → ✗', r.crosses === 1 && r.points === -1, r.sentences[0].figures);
r = dc('French fell from 70 to 35.');
t('35 for French is exactly German 2020 → ✗ (the Lab reads an exact value of another line as a wrong line)', r.crosses === 1 && /German/.test(r.sentences[0].figures[1].note), r.sentences[0].figures);
r = dc('French fell from 70 to 33.');
t('33 for French is near 30 → ≈ not green, no ✗', r.near === 1 && r.crosses === 0 && r.greens === 0, r.sentences[0].figures);
r = dc('French fell to about 35.');
t('about 35 → approximated ✓', r.near === 0 && r.bad === 0, r.sentences[0].figures);
r = dc('German dropped to 20 in 2026.');
t('year outside the chart → ✗', r.crosses >= 1, r.sentences[0].figures);
r = dc('Japanese rose by 70 students between 2016 and 2024.');
t('difference 110−40 = 70 ✓', r.greens === 1, r.sentences[0].figures);
r = dc('The number of students rose.');
t('no figure → no point, no cross', r.points === 0 && r.sentences[0].noFigure);
r = dc('In 2020, 100 students chose it.');
t('figure with no category named → amber, not green', r.greens === 0 && r.crosses === 0 && r.sentences[0].noLabel, r.sentences[0]);
r = dc('Chinese rose from 60 to 140. French fell from 70 to 30. German fell to 25.');
t('three sentences: +2 greens, 25 is ≈ (near 20/30) → points 2', r.greens === 2 && r.points === 2, r.sentences.map(function (s) { return s.figures; }));
r = dc('Chinese rose from 60 to 140. German reached 99 in 2024.');
t('two sentences: +1 −1 = 0', r.greens === 1 && r.crosses === 1 && r.points === 0, r.sentences[1].figures);
r = dc('In 2016, French had 70 students, 20 more than Chinese.');
t('"20 more than" (70−50? no: 70−60=10) → ✗', r.crosses === 1, r.sentences[0].figures);
r = dc('In 2016, French had 70 students, 10 more than Chinese.');
t('"10 more than Chinese" difference ✓', r.crosses === 0 && r.greens === 1, r.sentences[0].figures);

/* ---------- data check: Slice It (pie, %) --------------------------------- */
const PF = 'p-vw2-pie-freetime';
AC.games['slice-it'].key.models.forEach(function (m) { const rr = dc(m, PF); t('Slice It model green: ' + m, rr.crosses === 0 && rr.near === 0, rr.sentences[0].figures); });
r = dc('Social media was the largest, at 30%, while reading was the smallest, at 7%.', PF);
t('pie: 30% and 7% ✓', r.greens === 1, r.sentences[0].figures);
r = dc('Social media and gaming together made up 50%.', PF);
t('pie: a sum of two slices ✓', r.crosses === 0 && r.bad === 0, r.sentences[0].figures);
r = dc('Reading was the smallest at 10%.', PF);
t('pie: 10% for reading is Other\'s value → ✗', r.crosses === 1, r.sentences[0].figures);
r = dc('Social media was 30 of free time.', PF);
t('pie: 30 without % → ≈ (add the % sign)', r.near === 1 && r.crosses === 0, r.sentences[0].figures);

/* ---------- data check: Table Detective (table, various units) ------------ */
const TC = 'p-vw2-table-cafes';
AC.games['table-detective'].key.models.forEach(function (m) { const rr = dc(m, TC); t('Table Detective model has no ✗: ' + m, rr.crosses === 0, rr.sentences[0].figures); });
r = dc('Mall Espresso had 80 seats and 520 customers a day but a rating of 3.9.', TC);
t('table: three cells of one row ✓', r.greens === 1, r.sentences[0].figures);
r = dc('Corner Cup charged 65 baht for a coffee.', TC);
t('table: 65 is Bean Bar\'s price → ✗', r.crosses === 1, r.sentences[0].figures);

/* ---------- data check: Twice As Much (bar, books per student) ------------ */
const BB = 'p-vw2-bar-books';
AC.games['twice-as-much'].rounds[0].models.forEach(function (m) { const rr = dc(m, BB); t('S5 model green: ' + m, rr.crosses === 0 && rr.near === 0, rr.sentences[0].figures); });
r = dc('Finland was far higher than Thailand, at 24 and 8 books respectively.', BB);
t('bar: 8 for Thailand (6) → ≈ (within half a gridline), not green', r.near === 1 && r.greens === 0, r.sentences[0].figures);
r = dc('Finland was far higher than Thailand, at 24 and 12 books respectively.', BB);
t('bar: 12 for Thailand is the UK\'s value → ✗', r.crosses === 1, r.sentences[0].figures);
r = dc('Finland was far higher than Thailand, at 24 books.', BB);
t('bar: single figure after "than Thailand" is the subject\'s (24 = Finland) ✓', r.greens === 1, r.sentences[0].figures);
let br = A.bidResolve(3, dc('Finland was far higher than Thailand, at 24 and 6 books respectively.', BB), true);
t('bid: green + pattern → +3', br.points === 3 && br.win, br);
br = A.bidResolve(2, dc('Finland was far higher than Thailand, at 24 and 6 books respectively.', BB), false);
t('bid: green, no pattern → −2', br.points === -2, br);
br = A.bidResolve(5, dc('Finland was twice as high as the UK.', BB), true);
t('bid: no figure in the sentence → not green → loses; bid clamped to 3', br.points === -3, br);

/* ---------- relay check --------------------------------------------------- */
const PR = A.rounds('paraphrase-relay');
r = A.relayCheck(PR[0].relay.modelP1, { taskSentence: PR[0].relay.taskSentence, elementKeywords: PR[0].relay.elementKeywords, key: PR[0].key });
t('relay: the model P1 is clean and complete (+2)', r.clean && r.points === 2 && r.missing.length === 0 && r.run < 8, r);
r = A.relayCheck(PR[0].relay.taskSentence, { taskSentence: PR[0].relay.taskSentence, elementKeywords: PR[0].relay.elementKeywords, key: PR[0].key });
t('relay: the task sentence copied → red run, −1', r.copied && r.points === -1, r);
r = A.relayCheck('The line graph illustrates how many students joined three clubs from 2016 to 2024.', { taskSentence: PR[0].relay.taskSentence, elementKeywords: PR[0].relay.elementKeywords, key: PR[0].key });
t('relay: missing "where" → amber, no points', r.missing.indexOf('where') >= 0 && r.points === 0, r);
PR.forEach(function (rd) { const rr = A.relayCheck(rd.relay.modelP1, { taskSentence: rd.relay.taskSentence, elementKeywords: rd.relay.elementKeywords, key: rd.key }); t('relay model ' + rd.ri + ' clean', rr.clean, rr); });

/* ---------- checklist ----------------------------------------------------- */
const EC = A.rounds('examiners-chair');
let ck = A.checklistMark(EC[0].script, EC[0].script.key);
t('checklist: perfect match = 10, +3', ck.matches === 10 && ck.points === 3, ck);
ck = A.checklistMark(EC[0].script, EC[0].script.key.map(function (k, i) { return i < 3 ? !k : k; }));
t('checklist: 7 matches → 0 points', ck.matches === 7 && ck.points === 0, ck);
ck = A.checklistMark(EC[1].script, [true, true, true, true, true, true, true, true, true, true]);
t('checklist: all ticked on script B = 9 matches → +2', ck.matches === 9 && ck.points === 2, ck);
t('script A hits the overview ceiling', /TA ≤ 5/.test(EC[0].script.ceiling));

/* ---------- posts: encode / decode / scoring ------------------------------ */
function post(id, team, text, ts) { return { kind: 'post', id: id, round: 'LX', team: team, studentId: 's-' + id, text: text, ts: ts || new Date(2026, 9, 30, 10, 0, 0, +id.replace(/\D/g, '') || 0).toISOString() }; }
t('decode plain text', A.decode(post('p1', 'Team 1', 'Hello')).asm === 'text');
t('decode choice', A.decode(post('p1', 'Team 1', A.encode({ asm: 'choice', card: 1, picks: { mode: 'TREND' } }))).card === 1);
t('decode guards against JSON-looking prose', A.decode(post('p1', 'Team 1', '{not json "asm"')).asm === 'text');
let posts = [
  post('p1', 'Team 1', A.encode({ asm: 'choice', card: 1, picks: { mode: 'TREND', unit: '% of households' }, late: false })),
  post('p2', 'Team 1', A.encode({ asm: 'choice', card: 1, picks: { mode: 'SPACE', unit: '% of households' }, late: false })),   /* second answer ignored */
  post('p3', 'Team 2', A.encode({ asm: 'choice', card: 1, picks: { mode: 'TREND', unit: 'million people' }, late: true })),
  post('p4', 'Team 2', A.encode({ asm: 'choice', card: 3, picks: { mode: 'COMPARE', unit: '%' }, late: false }))
];
let sc = A.scoreRound(MS, posts, {}, {});
t('choice scoring: Team 1 = 3 (first answer counts)', sc.teams['Team 1'].total === 3, sc.teams['Team 1']);
t('choice scoring: Team 2 = (2−1) + 3 = 4', sc.teams['Team 2'].total === 4, sc.teams['Team 2']);
const NH = A.rounds('number-hunt')[0];
posts = [post('q1', 'Team 3', 'Chinese rose from 60 in 2016 to 140 in 2024. German fell to 99.'), post('q2', 'Team 4', 'French fell from 70 to 30.')];
sc = A.scoreRound(NH, posts, { q2: { pattern: 1 } }, { 'Team 3': 1 });
t('datapost scoring: Team 3 = +1 −1 +1 adj = 1', sc.teams['Team 3'].total === 1, sc.teams['Team 3']);
t('datapost scoring: Team 4 = +1 green +1 pattern = 2', sc.teams['Team 4'].total === 2, sc.teams['Team 4']);
const TA = A.rounds('twice-as-much')[0];
posts = [post('b1', 'Team 5', A.encode({ asm: 'bid', bid: 3 })), post('b2', 'Team 5', 'Finland was far higher than Thailand, at 24 and 6 books respectively.'), post('b3', 'Team 6', A.encode({ asm: 'bid', bid: 2 })), post('b4', 'Team 6', 'Finland was far higher than Thailand, at 24 and 8 books respectively.')];
sc = A.scoreRound(TA, posts, { b2: { pattern: 1 }, b4: { pattern: 1 } }, {});
t('bid before reveal: pending, 0 points', sc.teams['Team 5'].total === 0 && /Bid 3/.test(sc.teams['Team 5'].lines[0]), sc.teams['Team 5']);
sc = A.scoreRound(TA, posts, { b2: { pattern: 1 }, b4: { pattern: 1 }, __reveal: 1 }, {});
t('bid after reveal: Team 5 +3, Team 6 −2', sc.teams['Team 5'].total === 3 && sc.teams['Team 6'].total === -2, [sc.teams['Team 5'], sc.teams['Team 6']]);
posts = [post('c1', 'Team 1', A.encode({ asm: 'check', script: 1, ticks: EC[0].script.key })), post('c2', 'Team 2', A.encode({ asm: 'check', script: 1, ticks: EC[0].script.key.map(function (k, i) { return i === 0 ? !k : k; }) }))];
sc = A.scoreRound(EC[0], posts, {}, {});
t('checklist scoring: 10/10 → +3, 9/10 → +2', sc.teams['Team 1'].total === 3 && sc.teams['Team 2'].total === 2, sc.teams);
posts = [post('r1', 'Team 1', PR[0].relay.modelP1), post('r2', 'Team 2', PR[0].relay.taskSentence)];
sc = A.scoreRound(PR[0], posts, { r1: { pattern: 1 } }, {});
t('relay scoring: clean +2 +1 pattern = 3; copied −1', sc.teams['Team 1'].total === 3 && sc.teams['Team 2'].total === -1, sc.teams);
t('teamOf normalises "team 2" / "2"', A.normTeam('team 2') === 'Team 2' && A.normTeam('2') === 'Team 2' && A.normTeam('The Owls') === 'The Owls');
t('UI entry points exist', typeof A.paintHome === 'function' && typeof A.openProjector === 'function' && typeof A.mountLive === 'function');

console.log('assembly-test: ' + (n - fails) + ' of ' + n + ' passed' + (fails ? ' — ' + fails + ' FAILED' : ''));
process.exit(fails ? 1 : 0);
