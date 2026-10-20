/* Dry run of the persona bot on a scratch copy of IELTS-WT1 against the mock backend.
   usage: node dryrun.js <persona-data.json> [planName|'all'] [--port 8800] [--keep] [--headed] [--steps N]
   - spawns mock-server.js on its own port/state file (APPDIR copied fresh from app-src unless --keep)
   - opens index.html, registers the persona through the UI (test server only),
     injects bot/bot-core.js + bot/rooms-*.js + data, builds the plan (bot/plan.js), runs it,
     polls QB until done/err, writes out/<persona>-summary.json and -log.txt.               */
'use strict';
const fs = require('fs'), path = require('path'), cp = require('child_process');
const { chromium } = require('playwright');
const H = __dirname, SRC = process.env.APPSRC || '/home/claude/wt1-harness/app-src';
const args = process.argv.slice(2), dataFile = args[0], planName = args[1] && !args[1].startsWith('--') ? args[1] : 'all';
const opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const PORT = +opt('--port', 8800), keep = args.includes('--keep'), headed = args.includes('--headed'), maxSteps = +opt('--steps', 0);
const data = JSON.parse(fs.readFileSync(dataFile, 'utf8')); const pid = data.persona.id;
const APPDIR = path.join(H, 'run-' + PORT), STATE = path.join(H, 'out', 'state-' + pid + '-' + PORT + '.json');
fs.mkdirSync(path.join(H, 'out'), { recursive: true });
if (!keep) { fs.rmSync(APPDIR, { recursive: true, force: true }); cp.execSync(`mkdir -p ${APPDIR} && (cd ${SRC} && tar cf - .) | (cd ${APPDIR} && tar xf -)`); try { fs.rmSync(STATE); } catch (e) {} }
const srv = cp.spawn('node', [path.join(H, 'mock-server.js')], { env: Object.assign({}, process.env, { APPDIR, STATEFILE: STATE, PORT: String(PORT), MOCK_AI: data.persona.noAI ? '0' : '1' }), stdio: ['ignore', 'pipe', 'pipe'] });
srv.stdout.on('data', d => process.stdout.write('[mock] ' + d)); srv.stderr.on('data', d => process.stdout.write('[mock!] ' + d));
const BOT = process.env.BUNDLE ? [fs.readFileSync(process.env.BUNDLE,'utf8')] : ['bot-core.js'].concat(fs.readdirSync(path.join(H, 'bot')).filter(f => /^rooms-.*\.js$/.test(f)).sort()).concat(['plan.js']).map(f => fs.readFileSync(path.join(H, 'bot', f), 'utf8'));
(async () => {
  await new Promise(r => setTimeout(r, 1200));
  const b = await chromium.launch({ headless: !headed, executablePath: process.env.CHROME || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await b.newPage({ viewport: { width: 1100, height: 900 } });
  const errors = [];
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', e => errors.push(String(e)));
  await page.goto(`http://127.0.0.1:${PORT}/index.html`); await page.waitForTimeout(600);
  // register through the UI (mock server only)
  await page.click('#tab-new'); await page.fill('#f-id', pid); await page.fill('#f-name', data.persona.name); await page.fill('#f-pw', 'pw1234'); await page.click('#btn-go');
  try { await page.waitForSelector('#screen-app:not(.hidden)', { timeout: 10000 }); } catch (e) { console.log('login failed:', await page.innerText('#login-msg')); }
  await page.waitForTimeout(500);
  for (const code of BOT) await page.evaluate(code);
  await page.evaluate((d) => { QB.init(d); }, data);
  await page.evaluate((pn) => { QB.plan = QB.buildPlan(pn); }, planName);
  if (maxSteps) await page.evaluate((n) => { QB.plan = QB.plan.slice(0, n); }, maxSteps);
  const n = await page.evaluate(() => QB.plan.length); console.log('plan steps:', n);
  page.evaluate(() => QB.run()).catch(() => {});
  let last = 0;
  for (;;) {
    await page.waitForTimeout(2000);
    const st = await page.evaluate(() => ({ done: QB.done, err: QB.err, at: QB.at, day: QB.dayN, logLen: QB.log.length, tail: QB.log.slice(-6) }));
    if (st.logLen !== last) { st.tail.forEach(l => console.log('  ' + l)); last = st.logLen; }
    if (st.done || st.err) break;
  }
  const sum = await page.evaluate(() => QB.summary()); const log = await page.evaluate(() => QB.log);
  fs.writeFileSync(path.join(H, 'out', pid + '-' + planName + '-summary.json'), JSON.stringify(sum, null, 1));
  fs.writeFileSync(path.join(H, 'out', pid + '-' + planName + '-log.txt'), log.join('\n'));
  console.log('\nSUMMARY', JSON.stringify({ hours: sum.hours, days: sum.days, lessons: sum.lessons, gates: sum.gates, reports: sum.reports, words: sum.reportWords, mocks: sum.mocks, duels: sum.duels, story: sum.story, byRoom: sum.byRoom }));
  if (errors.length) console.log('CONSOLE ERRORS', errors.slice(0, 10));
  const err = await page.evaluate(() => QB.err); if (err) console.log('BOT ERROR', err);
  await page.screenshot({ path: path.join(H, 'out', pid + '-final.png'), fullPage: true });
  await b.close(); srv.kill(); process.exit(err ? 1 : 0);
})();
