#!/usr/bin/env node
/* WS-C · tickets-build.js — turns WS-D's content bank into tickets-content.js (ES5 browser global).
   node tools/tickets-build.js [path/to/vw2-items.json] [path/to/vw2-prompts.js]
   Defaults: /home/claude/vw2/out/WS-D/content/{vw2-items.json, vw2-prompts.js}.
   Output: tickets-content.js at the repo root — window.TICKETS_CONTENT = { version, sets, items, prompts, teams }.
   - sets: { "E01": [item ids], "Q02": [...] } exactly as WS-D wrote them (ids may be existing bank items).
   - items: WS-D's new items (vw2-*), same shape as topic-NN.js items.
   - prompts: only the WS-D prompts that a ticket item's `chart` needs and that prompts*.js does not already hold;
     tickets.js pushes them onto CONTENT.PROMPTS at load if (and only if) the id is still missing, so a later
     vw2-prompts.js tag (WS-B / WS-I) never duplicates a chart.
   - teams: the six fixed Assembly teams (Groups tab of the lesson plan, 23 Oct 2026) by nickname; the ledger
     matches nicknames to roster display names until WS-B's Teams sheet carries member rows. */
'use strict';
var fs = require('fs'), path = require('path'), vm = require('vm');
var ROOT = path.join(__dirname, '..');
var ITEMS = process.argv[2] || '/home/claude/vw2/out/WS-D/content/vw2-items.json';
var PROMPTS = process.argv[3] || '/home/claude/vw2/out/WS-D/content/vw2-prompts.js';

var bank = JSON.parse(fs.readFileSync(ITEMS, 'utf8'));
var have = {};
['prompts.js', 'prompts-2.js', 'prompts-3.js'].forEach(function (f) {
  var src = fs.readFileSync(path.join(ROOT, f), 'utf8'), m, re = /id:\s*'([^']+)'/g;
  while ((m = re.exec(src))) have[m[1]] = 1;
});
var extra = [];
if (fs.existsSync(PROMPTS)) {
  var ctx = { window: {} }; ctx.window.CONTENT = { PROMPTS: [] };
  vm.createContext(ctx); vm.runInContext(fs.readFileSync(PROMPTS, 'utf8'), ctx, { filename: 'vw2-prompts.js' });
  extra = ctx.window.CONTENT.PROMPTS;
}
var need = {};
bank.items.forEach(function (it) { if (it.chart && !have[it.chart]) need[it.chart] = 1; });
var prompts = extra.filter(function (p) { return need[p.id]; });
Object.keys(need).forEach(function (id) { if (!prompts.some(function (p) { return p.id === id; })) { console.error('chart ' + id + ' is neither in prompts*.js nor in ' + PROMPTS); process.exit(1); } });

var TEAMS = [
  { team: 'Team 1', members: ['Donut', 'Lookchin', 'Baiplu', 'Sun', 'Mint'] },
  { team: 'Team 2', members: ['Proud', 'Airin', 'Oly', 'Noyny', 'Ob-oon'] },
  { team: 'Team 3', members: ['Pasta', 'Premier', 'Nicha', 'Nene', 'Punnee'] },
  { team: 'Team 4', members: ['Vernier', 'Rak', 'Min', 'Panghom', 'Carrot'] },
  { team: 'Team 5', members: ['Chicha', 'Wongree', 'Moquette', 'Pin', 'Lilil'] },
  { team: 'Team 6', members: ['Thinn', 'Ren', 'Khaofang', 'Gam', 'Mon'] }
];

var out = '/* QUILLMOOR ACADEMY · THE OBSERVATORY — tickets-content.js (WS-C, generated)\n' +
  '   Launch-quiz and exit-ticket sets for EN31208 Variety of Writing 2, from WS-D\'s vw2-items.json\n' +
  '   (version ' + bank.version + '). Do not edit by hand: run  node tools/tickets-build.js  after WS-D updates the bank.\n' +
  '   Item shape = topic-NN.js items; set ids may name existing bank items (resolved from CONTENT.TOPICS at run time).\n' +
  '   ES5. Loaded on index.html and teacher.html before tickets.js. */\n' +
  'window.TICKETS_CONTENT = ' + JSON.stringify({ version: bank.version, built: new Date().toISOString().slice(0, 10), sets: bank.sets, items: bank.items, prompts: prompts, teams: TEAMS }, null, 1).replace(/\u2028|\u2029/g, '') + ';\n';
fs.writeFileSync(path.join(ROOT, 'tickets-content.js'), out);
var n = 0; Object.keys(bank.sets).forEach(function (k) { n += bank.sets[k].length; });
console.log('tickets-content.js: ' + Object.keys(bank.sets).length + ' sets (' + Object.keys(bank.sets).join(' ') + '), ' + n + ' set slots, ' + bank.items.length + ' new items, ' + prompts.length + ' extra prompts (' + prompts.map(function (p) { return p.id; }).join(', ') + ')');
