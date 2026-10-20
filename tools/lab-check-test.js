/* Unit tests for the Spellbook data checker (template.js → Template.Data).
   Every variable a student fills on a real chart is checked against the
   chart's data; these cases pin the tricky rules down.
   node tools/lab-check-test.js                                             */
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.join(__dirname, '..');
const ctx = { window: {}, console };
ctx.window.window = ctx.window; ctx.window.CONTENT = { PROMPTS: [], MODELS: [] };
vm.createContext(ctx);
['prompts.js', 'prompts-2.js', 'prompts-3.js', 'template.js'].forEach(function (f) {
  const p = path.join(ROOT, f); if (fs.existsSync(p)) vm.runInContext(fs.readFileSync(p, 'utf8'), ctx, { filename: f });
});
const D = ctx.window.Template.Data;
const P = {}; ctx.window.CONTENT.PROMPTS.forEach(function (p) { P[p.id] = p; });

let n = 0, fails = 0;
function t(name, promptId, check, value, want, vars, noteRe) {
  n++;
  const r = D.check({ key: 'x', check: check }, value, P[promptId], { vars: vars || {} });
  const ok = r.status === want && (!noteRe || noteRe.test(r.note));
  if (!ok) { fails++; console.log('  ✕ ' + name + '\n      "' + value + '" → ' + r.status + ' (want ' + want + ')  ' + r.note); }
}
const FIG = function (cat, at) { return { type: 'figure', cat: cat, at: at }; };

/* ---------- figures: exact, units, context ------------------------------ */
const mus = 'p-line-museums', SM = { g: 'the Science Museum', y: '2010' };
t('exact figure with thousand', mus, FIG('g', 'y'), '420 thousand', 'ok', SM);
t('exact figure written in full', mus, FIG('g', 'y'), '420,000 visitors', 'ok', SM);
t('unit omitted (thousands chart)', mus, FIG('g', 'y'), '420', 'near', SM, /thousand/);
t('right figure, wrong year', mus, FIG('g', 'y'), '760 thousand', 'bad', SM, /not the figure for 2010/);
t('right figure, wrong category', mus, FIG('g', 'y'), '610 thousand', 'bad', SM, /Art Gallery/);
t('figure not on the chart', mus, FIG('g', 'y'), '999 thousand', 'bad', SM);
t('year inside the value sets the context', mus, FIG('g'), 'a peak of 760 thousand in 2020', 'ok', SM);
t('year outside the range inside a figure', mus, FIG('g'), '760 thousand in 2030', 'bad', SM, /outside/);

/* ---------- approximation words (gridline step 200 → tolerance 100) ---- */
const AG = { g: 'the Art Gallery', y: '2010' };
t('around + within half a gridline', mus, FIG('g', 'y'), 'around 600 thousand', 'ok', AG);
t('just over: right side', mus, FIG('g', 'y'), 'just over 600 thousand', 'ok', AG);
t('just under: wrong side', mus, FIG('g', 'y'), 'just under 600 thousand', 'near', AG, /check the word/);
t('close but no approximation word', mus, FIG('g', 'y'), '600 thousand', 'near', AG, /about|around/);
t('approximation word, too far', mus, FIG('g', 'y'), 'about 800 thousand', 'bad', AG);
t('nearly = just under', 'p-line-internet', FIG('g', 'y'), 'nearly 100%', 'ok', { g: 'Sweden', y: '2025' });

/* ---------- percentages vs percentage points ---------------------------- */
const net = 'p-line-internet', SW = { g: 'Sweden' };
t('percentage value', net, FIG('g'), '85% in 2010', 'ok', SW);
t('% sign missing on a % chart', net, FIG('g'), '85 in 2010', 'near', SW, /% sign/);
t('change in percentage points', net, FIG('g'), 'a rise of 15 percentage points', 'ok', SW);
t('change written as % on a % chart', net, FIG('g'), 'rose by 15%', 'near', SW, /percentage points/);
t('percentage points on a non-% chart', mus, FIG('g'), 'rose by 50 percentage points', 'bad', SM);
t('relative % change on a non-% chart', 'p-bar-tourists', FIG('g'), 'rose by about 19% between 2015 and 2017', 'ok', { g: 'arrivals' });
t('% on a chart that is not in per cent', mus, FIG('g', 'y'), '42%', 'bad', SM);

/* ---------- millions / thousands / money -------------------------------- */
const cities = 'p-line-cities', LG = { g: 'Lagos', y: '1990' };
t('decimal million', cities, FIG('g', 'y'), '4.8 million', 'ok', LG);
t('million written in full', cities, FIG('g', 'y'), '4,800,000 people', 'ok', LG);
t('million unit missing', cities, FIG('g', 'y'), '4.8', 'near', LG);
const sal = 'p-table-salaries', DE = { g: 'Germany' };
t('dollar sign', sal, FIG('g'), '$62,000', 'ok', DE);
t('thousand dollars', sal, FIG('g'), '62 thousand dollars', 'ok', DE);
t('table approximation (5%)', sal, FIG('g'), 'around 60,000 dollars', 'ok', DE);
t('table: off by more than 5%', sal, FIG('g'), '$55,000', 'bad', DE, /Japan/);
t('label with a number is not a figure', 'p-table-phones', { type: 'labelfig' }, 'the Alpha 12, at $1,100', 'ok');
t('age-group label is not a figure', 'p-bar-screentime', FIG('g'), '21 hours a week', 'ok', { g: 'the 13–17 age group' });

/* ---------- fractions on pie charts ------------------------------------- */
t('a fifth of spending', 'p-pie-budget', FIG('g'), 'about a fifth', 'ok', { g: 'transport' });
t('fraction too far from the slice', 'p-pie-budget', FIG('g'), 'just over a third', 'bad', { g: 'food and drinks' });
t('two pies: the year picks the pie', 'p-pie-energy', FIG('g'), '48% in 2000', 'ok', { g: 'coal' });
t('two pies: wrong year for the value', 'p-pie-energy', FIG('g', 'y'), '48%', 'bad', { g: 'coal', y: '2020' });

/* ---------- projections and tense --------------------------------------- */
t('projection with "is projected to"', cities, FIG('g'), 'is projected to reach 24 million in 2040', 'ok', { g: 'Lagos' });
t('projection in the past simple', cities, FIG('g'), 'reached 24 million in 2040', 'bad', { g: 'Lagos' }, /projection/);
t('past dates, present tense', mus, { type: 'move', cat: 'g' }, 'rises steadily', 'bad', SM, /past simple/);

/* ---------- years -------------------------------------------------------- */
t('first year', mus, { type: 'year', role: 'first' }, '2010', 'ok');
t('year before the chart', mus, { type: 'year', role: 'first' }, '2009', 'bad', null, /outside/);
t('last year: not the end', mus, { type: 'year', role: 'last' }, '2018', 'near');
t('last year with projections', cities, { type: 'year', role: 'last' }, '2040', 'ok');
t('year between two axis points', mus, { type: 'year' }, '2011', 'near', null, /not a point/);
t('year missing', mus, { type: 'year', role: 'first' }, 'the start', 'bad');

/* ---------- labels: plural, article, case -------------------------------- */
t('group, plural and article', mus, { type: 'group' }, 'the science museums', 'ok');
t('group of two', net, { type: 'group' }, 'Sweden and Japan', 'ok');
t('group as a time phase', 'p-bar-tourists', { type: 'group' }, 'arrivals between 2015 and 2019', 'ok');
t('group with a vague name', net, { type: 'group' }, 'the two richer countries', 'near');
t('singular vs plural label', 'p-pie-budget', { type: 'label' }, 'food and drink', 'ok');
t('top category', 'p-pie-budget', { type: 'label', role: 'top' }, 'Food and drinks', 'ok');
t('not the top category', 'p-pie-budget', { type: 'label', role: 'top' }, 'clothes', 'near');
t('bottom category', 'p-pie-budget', { type: 'label', role: 'bottom' }, 'savings', 'ok');
t('label not on the chart', 'p-pie-budget', { type: 'label' }, 'books', 'bad');
t('age group with +', 'p-mixed-gym', { type: 'label' }, 'members aged 60+', 'ok');

/* ---------- overview: direction, no figures ------------------------------ */
t('right direction', mus, { type: 'move', cat: 'g' }, 'rose steadily', 'ok', SM);
t('wrong direction', mus, { type: 'move', cat: 'g' }, 'fell sharply', 'bad', SM, /Wrong direction/);
t('figure in the overview', mus, { type: 'move', cat: 'g' }, 'rose to 760 thousand', 'bad', SM, /No figures/);
t('mixed group', net, { type: 'move', cat: 'g' }, 'rose', 'ok', { g: 'Thailand and Kenya' });
t('phase direction (single series)', 'p-bar-bags', { type: 'move', cat: 'g' }, 'fell sharply', 'ok', { g: 'plastic bags from 2018 to 2024' });
t('stable', 'p-line-clubs', { type: 'move', cat: 'g' }, 'remained fairly stable', 'ok', { g: 'football' });
t('trend verbs with no time axis', 'p-bar-screentime', { type: 'nofig' }, 'social media use rose with age', 'near');

/* ---------- visual type -------------------------------------------------- */
t('visual right', mus, { type: 'visual' }, 'line graph', 'ok');
t('visual wrong', mus, { type: 'visual' }, 'bar chart', 'bad');
t('two pies need the plural', 'p-pie-energy', { type: 'visual' }, 'pie chart', 'near');
t('two visuals named', 'p-mixed-coffee', { type: 'visual' }, 'bar chart and table', 'ok');
t('copied task sentence', mus, { type: 'what' }, 'the number of visitors (in thousands) to three museums in a European city', 'near', null, /copied/);
t('unit missing in the measure', mus, { type: 'what' }, 'how many people visited three museums in one city', 'near', null, /unit/);

/* ---------- process stages ----------------------------------------------- */
const glass = 'p-proc-glass';
t('stage in order', glass, { type: 'stage', slot: 1, of: 6 }, 'used bottles are collected in bottle banks', 'ok');
t('stage out of order', glass, { type: 'stage', slot: 1, of: 6 }, 'the molten glass is moulded into new bottles', 'near', null, /order/);
t('stage paraphrase with the diagram words', glass, { type: 'stage', slot: 3, of: 6 }, 'the bottles are sorted by colour', 'ok');
t('stage with no diagram words', glass, { type: 'stage', slot: 3, of: 6 }, 'something happens to them', 'near');
t('stage in the past tense', glass, { type: 'stage', slot: 2, of: 6 }, 'the bottles were washed with water', 'bad', null, /present simple/);
t('first stage as a label', 'p-proc-frog', { type: 'stage', role: 'first' }, 'the eggs', 'ok');
t('last stage', 'p-proc-noodles', { type: 'stage', role: 'last' }, 'the packaging stage', 'ok');
t('count right (word)', 'p-proc-frog', { type: 'count' }, 'five', 'ok');
t('count wrong', 'p-proc-frog', { type: 'count' }, 'six', 'bad');
t('shape right', 'p-proc-frog', { type: 'shape' }, 'cyclical', 'ok');
t('shape wrong', 'p-proc-noodles', { type: 'shape' }, 'circular', 'bad');

/* ---------- maps --------------------------------------------------------- */
const rv = 'p-map-riverside';
t('unchanged feature', rv, { type: 'feature', role: 'same' }, 'the bus station', 'ok');
t('feature only on the first map is not unchanged', rv, { type: 'feature', role: 'same' }, 'the factory', 'bad');
t('feature that changed (extended)', rv, { type: 'feature', role: 'same' }, 'the park', 'near');
t('removed feature', rv, { type: 'feature', role: 'gone' }, 'the old factory', 'ok');
t('new feature', rv, { type: 'feature', role: 'new' }, 'a block of apartments', 'ok');
t('new feature: plural/singular', rv, { type: 'feature', role: 'new' }, 'apartment block', 'ok');
t('not new', rv, { type: 'feature', role: 'new' }, 'the cinema', 'bad');
t('feature name with brackets', 'p-map-lake', { type: 'feature', role: 'new' }, 'a golf course', 'ok');
t('apostrophe in a feature name', 'p-map-beach', { type: 'feature', role: 'gone' }, "the fishermen's houses", 'ok');
t('compass right', rv, { type: 'compass', of: 'g', panel: 'first' }, 'in the east', 'ok', { g: 'the factory' });
t('compass wrong', rv, { type: 'compass', of: 'g', panel: 'first' }, 'in the west', 'bad', { g: 'the factory' });
t('place word but no compass point', rv, { type: 'compass', of: 'g', panel: 'first' }, 'next to the main road', 'near', { g: 'the factory' });
t('extended', rv, { type: 'clause' }, 'the park was extended to the east', 'ok');
t('extended but it was reduced', 'p-map-school', { type: 'clause' }, 'the sports field will be extended', 'bad', null, /reduced/);
t('plan map needs the future', 'p-map-school', { type: 'clause' }, 'the canteen was extended', 'bad', null, /plan/);
t('past maps reject the future', rv, { type: 'clause' }, 'the park will be extended', 'bad');
t('map title as a year', rv, { type: 'panel', role: 'first' }, '1995', 'ok');
t('map title: Now / Plan', 'p-map-school', { type: 'panel', role: 'last' }, 'in the future plan', 'ok');
t('map title: not a title', rv, { type: 'panel', role: 'last' }, '2020', 'bad');

/* ---------- comparisons inside a value, names inside numbers ------------ */
t('comparison figure of another category', 'p-bar-activities', FIG('g'), '45 girls chose sport, compared with 60 boys', 'ok', { g: 'girls' });
t('difference: fewer than', 'p-bar-activities', FIG('g'), '45 girls chose sport, 15 fewer than boys', 'ok', { g: 'girls' });
t('"after 15 years" from the task is not a figure', sal, FIG('g'), '$62,000 at the start and $81,000 after 15 years', 'ok', DE);
t('two directions in one phrase', cities, { type: 'move', cat: 'g' }, 'stayed almost flat and is expected to shrink slightly', 'ok', { g: 'Osaka' });
t('extended + reduced in one clause', 'p-map-lake', { type: 'clause' }, 'the village was expanded, while the forest was reduced', 'ok');
t('two features named: the new one counts', 'p-map-lake', { type: 'feature', role: 'new' }, 'a paved main road, and a path along the lake', 'ok');
t('a total of two slices', 'p-pie-holidays', FIG('g'), 'together, 59% of trips in 2010', 'ok', { g: 'South-East Asia and China' });
t('"car park" is not "park"', rv, { type: 'feature', role: 'gone' }, 'the car park', 'ok');

/* ---------- WP20: labels in values, word numbers, near-miss note, change statements */
const SLOT = function (cat, at, label) { return { label: label, check: { type: 'figure', cat: cat, at: at } }; };
function tl(name, promptId, def, value, want, vars, noteRe) {
  n++;
  const r = D.check(def, value, P[promptId], { vars: vars || {} });
  const ok = r.status === want && (!noteRe || noteRe.test(r.note));
  if (!ok) { fails++; console.log('  ✕ ' + name + '\n      "' + value + '" → ' + r.status + ' (want ' + want + ')  ' + r.note); }
}
/* a label named in another clause does not switch the series */
t('label in value: other series named after a comma', mus, FIG('g', 'y'), '610 thousand, the same as the Art Gallery', 'bad', SM, /Art Gallery.*not to Science Museum/);
t('label in value: other series named with a dash clause', mus, FIG('g', 'y'), '610 thousand, well above the History Museum', 'bad', SM, /not to Science Museum/);
t('label in value: the slot group itself named', mus, FIG('g', 'y'), 'the Science Museum stood at 420 thousand', 'ok', SM);
t('label in value: comparison clause keeps its own label', 'p-bar-activities', FIG('g'), '45 girls chose sport, compared with 60 boys', 'ok', { g: 'girls' });
t('label in value: "than" lends the next label to a difference', 'p-bar-activities', FIG('g'), '45 girls chose sport, 15 fewer than boys', 'ok', { g: 'girls' });
t('label in value: other series after "while"', 'p-bar-activities', FIG('g'), '60 chose sport, while boys chose music less', 'bad', { g: 'girls' }, /Boys/);
/* word numbers before a unit are figures; counts of categories are not */
t('word number + chart unit', 'p-bar-screentime', FIG('g'), 'one hour', 'ok', { g: 'gaming' });
t('word number + unit phrase', 'p-bar-screentime', FIG('g'), 'three hours a week', 'ok', { g: 'gaming' });
t('word number + million', 'p-table-rice', FIG('g'), 'thirty million tonnes', 'bad', { g: 'Thailand' });
t('word number + per cent', 'p-pie-budget', FIG('g'), 'four per cent', 'ok', { g: 'savings' });
t('word number, close value is "near" and the note keeps the word', 'p-bar-screentime', FIG('g'), 'two hours', 'near', { g: 'gaming' }, /"two" is close/);
t('count of categories is not a figure (overview)', mus, { type: 'move', cat: 'g' }, 'rose in all three museums', 'ok', SM);
t('"one hour" in an overview is a figure', 'p-bar-screentime', { type: 'nofig' }, 'gaming took one hour for the oldest group', 'bad');
/* near-miss note: same series, another year → a year slip, not "belongs to X, not to X" */
t('near miss: same series another year names the year, not the series twice', mus, FIG('g', 'y'), '610 thousand and 350 thousand', 'bad', { g: 'the Art Gallery and the History Museum', y: '2010' }, /not the figure for 2010/);
tl('near miss: no "not to History Museum" for a History Museum value', mus, SLOT('g', 'y', 'Start Figure B'), '350 thousand', 'bad', { g: 'the History Museum', y: '2010' }, /^(?!.*not to History Museum).*2012/);
/* change statements in START / END figure slots: rejected, with the clear message */
tl('change statement in the end slot', mus, SLOT('g', 'y', 'End Figure A'), 'rose by 340 thousand to 760 thousand', 'bad', { g: 'the Science Museum', y: '2020' }, /This slot wants the END figure \(the 2020 value\), not the change/);
tl('from–to statement in the end slot', mus, SLOT('g', 'y', 'End Figure A'), 'rose from 420 thousand to 760 thousand', 'bad', { g: 'the Science Museum', y: '2020' }, /This slot wants the END figure/);
tl('percentage-point change in the end slot', net, SLOT('g', 'y', 'End Figure A'), 'rose by 15 percentage points to 90%', 'bad', { g: 'Sweden', y: '2025' }, /END figure \(the 2025 value\), not the change/);
tl('change statement in the start slot', mus, SLOT('g', 'y', 'Start Figure A'), '420 thousand, rising to 760 thousand', 'bad', { g: 'the Science Museum', y: '2010' }, /This slot wants the START figure/);
tl('a plain wrong-year figure keeps the short note', mus, SLOT('g', 'y', 'Start Figure A'), '760 thousand', 'bad', { g: 'the Science Museum', y: '2010' }, /^"760 thousand" is Science Museum, 2020/);
tl('the right end figure is still fine', mus, SLOT('g', 'y', 'End Figure A'), '760 thousand in 2020', 'ok', { g: 'the Science Museum', y: '2020' });

console.log((fails ? fails + ' of ' : 'All ') + n + ' data-check cases ' + (fails ? 'FAILED' : 'passed'));

/* ---------- the model answers' figures (models.js), as a sanity corpus --- */
const mctx = { window: { CONTENT: { PROMPTS: ctx.window.CONTENT.PROMPTS, MODELS: [] } } };
mctx.window.window = mctx.window; vm.createContext(mctx);
vm.runInContext(fs.readFileSync(path.join(ROOT, 'models.js'), 'utf8'), mctx);
let mfig = 0, mmiss = [];
mctx.window.CONTENT.MODELS.forEach(function (m) {
  const p = P[m.promptId]; if (!p) return;
  m.paragraphs.filter(function (x) { return x.role === 'detail'; }).forEach(function (para) {
    String(para.text).split(/(?<=[.;])\s+/).forEach(function (s) {
      D.numbers(s, p).filter(function (o) { return !o.year && !o.frac; }).forEach(function (o) {
        mfig++;
        const r = D.check({ check: { type: 'figure' } }, o.raw + (/\b(by|of)\b/.test(s.slice(Math.max(0, s.indexOf(o.raw) - 12), s.indexOf(o.raw))) ? '' : ''), p, {});
        if (r.status === 'bad' && !o.diff) mmiss.push(m.id + ': "' + o.raw + '" in "' + s.slice(0, 90) + '…"');
      });
    });
  });
});
console.log('models corpus: ' + mfig + ' figures read; ' + mmiss.length + ' not found as a single value' + (mmiss.length ? ' (differences, totals or multiples):' : ''));
mmiss.slice(0, 12).forEach(function (x) { console.log('   · ' + x); });
process.exit(fails ? 1 : 0);
