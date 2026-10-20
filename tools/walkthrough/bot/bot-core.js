/* QB — the student persona bot for Quillmoor · The Observatory (IELTS-WT1).
   Runs inside the app page. Drives the REAL UI only (clicks, inputs, the app's
   own buttons); reads app state (window.PCHost.p, Engine, Story, Writer …) to
   decide what to do, never to write progress directly.
   Rooms live in rooms-*.js and register as QB.rooms.<name> = function (args) -> Promise.
   Everything is modern JS (runs in Chromium), not ES5. */
(function () {
  'use strict';
  if (window.QB && window.QB._core) return;
  const RealDate = window.Date;
  const QB = window.QB = {
    _core: true, log: [], at: '', err: null, done: false, stopNow: false, data: null, persona: null, plan: null,
    rooms: {}, stats: {}, timeline: [], offsetMs: 0, dayMinutes: 0, DAY_CAP_MIN: 60, dayN: 1, opens: 0, rand: null
  };
  /* ------------------------------------------------------------ virtual clock */
  function VDate(...a) { if (!a.length) return new RealDate(RealDate.now() + QB.offsetMs); return new RealDate(...a); }
  VDate.prototype = RealDate.prototype; VDate.now = () => RealDate.now() + QB.offsetMs; VDate.UTC = RealDate.UTC; VDate.parse = RealDate.parse;
  window.Date = VDate;
  QB.realNow = () => RealDate.now();
  QB.virtualNow = () => RealDate.now() + QB.offsetMs;
  /* Spend simulated seconds. Every 60 simulated minutes (DAY_CAP_MIN) the calendar moves to the next day. */
  QB.spend = function (sec, why) {
    sec = Math.max(0, Math.round(sec));
    QB.offsetMs += sec * 1000; QB.dayMinutes += sec / 60; QB.stats.seconds = (QB.stats.seconds || 0) + sec;
    const act = QB.at || 'other'; QB.stats.byRoom = QB.stats.byRoom || {}; QB.stats.byRoom[act] = (QB.stats.byRoom[act] || 0) + sec;
    /* the calendar only moves between plan steps (QB.run), never inside a timed room */
  };
  QB.newDay = function () {
    const d = new VDate(); const next = RealDate.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + 1, 2, 0, 0); // 09:00 Bangkok next day
    QB.offsetMs += next - VDate.now(); QB.dayMinutes = 0; QB.dayN++;
    try { const P = window.Engine.Progress, p = window.PCHost.p; if (p && P.touchDay) P.touchDay(p); } catch (e) {}
    QB.logLine('— day ' + QB.dayN + ' (' + window.Engine.today() + ') —');
  };
  QB.day = () => QB.dayN;
  /* ------------------------------------------------------------------ hooks */
  window.confirm = () => true; window.alert = () => {}; window.prompt = () => '';
  QB.windowOpens = []; const realOpen = window.open; window.open = function (u) { QB.windowOpens.push(String(u)); QB.opens++; return { focus() {}, close() {} }; };
  /* ------------------------------------------------------------------ utils */
  const $ = (s, root) => (root || document).querySelector(s), $$ = (s, root) => Array.from((root || document).querySelectorAll(s));
  QB.$ = $; QB.$$ = $$;
  QB.wait = (ms) => new Promise(r => setTimeout(r, ms));                     // real wait (for DOM/timers)
  QB.waitFor = async function (fn, ms = 8000, step = 60) { const t0 = RealDate.now(); for (;;) { let v; try { v = fn(); } catch (e) {} if (v) return v; if (RealDate.now() - t0 > ms) throw new Error('waitFor timeout: ' + (fn.name || fn.toString().slice(0, 80))); await QB.wait(step); } };
  QB.click = async function (el, label) { if (typeof el === 'string') el = await QB.waitFor(() => $(el), 8000); if (!el) throw new Error('click: missing ' + label); if (QB.stopNow) throw new Error('STOP'); el.scrollIntoView && el.scrollIntoView({ block: 'center' }); el.click(); await QB.wait(40); return el; };
  QB.setVal = function (el, text) { if (typeof el === 'string') el = $(el); if (!el) throw new Error('setVal: missing'); const proto = el.tagName === 'TEXTAREA' ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype; const set = Object.getOwnPropertyDescriptor(proto, 'value').set; set.call(el, text); el.dispatchEvent(new Event('input', { bubbles: true })); el.dispatchEvent(new Event('change', { bubbles: true })); };
  QB.select = function (el, value) { if (typeof el === 'string') el = $(el); el.value = value; el.dispatchEvent(new Event('change', { bubbles: true })); el.dispatchEvent(new Event('input', { bubbles: true })); };
  /* Type like a student: spend simulated seconds per word (persona.wpm), then set the value. */
  QB.type = async function (el, text, why) { const words = String(text).trim().split(/\s+/).filter(Boolean).length; const wpm = QB.persona.wpm || 12; QB.spend(Math.round(words / wpm * 60), why || 'typing'); QB.setVal(el, text); await QB.wait(30); };
  QB.logLine = function (s) { const line = '[' + fmtT(QB.virtualNow()) + ' d' + QB.dayN + '] ' + s; QB.log.push(line); if (QB.log.length > 5000) QB.log.splice(0, 500); try { localStorage.setItem('qb.log.' + (QB.persona && QB.persona.id), JSON.stringify(QB.log.slice(-800))); } catch (e) {} };
  function fmtT(ms) { const d = new RealDate(ms + 7 * 3600000); return d.toISOString().slice(5, 16).replace('T', ' '); }
  /* Seeded RNG so a run is reproducible. */
  QB.seed = function (s) { let x = 0; for (let i = 0; i < s.length; i++) x = (x * 31 + s.charCodeAt(i)) >>> 0; QB.rand = () => { x = (x * 1664525 + 1013904223) >>> 0; return x / 4294967296; }; };
  QB.chance = (p) => QB.rand() < p;
  /* Accuracy model: persona.acc = { A1, A2, B1, B2, C1 } = P(correct) on an item of that level;
     each earlier sighting of the same item adds persona.memGain (capped at 0.97). */
  QB.seen = {};
  QB.willAnswerRight = function (item) {
    const lv = (item && item.level) || 'B1', per = QB.persona || {}, acc = (per.acc || {})[lv] != null ? per.acc[lv] : 0.6;
    const n = QB.seen[item && item.id] || 0; QB.seen[item && item.id] = n + 1;
    const p = Math.min(0.97, acc + n * (per.memGain || 0.15));
    return QB.chance(p);
  };
  /* The app, read-only. */
  QB.p = () => window.PCHost && window.PCHost.p;
  QB.E = () => window.Engine; QB.ST = () => window.Story;
  QB.view = () => (location.hash || '').replace('#', '');
  QB.show = async (v) => { window.PCHost.show(v); await QB.wait(120); };
  /* ------------------------------------------------------------------- runner */
  QB.init = function (data) { QB.data = data; QB.persona = data.persona; QB.seed(data.persona.id + ':' + (data.seed || 1)); QB.logLine('init ' + data.persona.id + ' level ' + data.persona.level); };
  QB.run = async function (plan) {
    plan = plan || QB.plan; QB.done = false; QB.err = null;
    try {
      for (let i = 0; i < plan.length; i++) {
        const step = plan[i]; if (QB.stopNow) throw new Error('STOP');
        if (step.skipIf && step.skipIf()) { QB.logLine('skip ' + step.room + ' ' + JSON.stringify(step.args || {})); continue; }
        if (QB.dayMinutes >= QB.DAY_CAP_MIN) QB.newDay();
        QB.at = step.room; const t0 = QB.virtualNow();
        QB.logLine('▶ ' + step.room + ' ' + JSON.stringify(step.args || {}));
        const fn = QB.rooms[step.room]; if (!fn) throw new Error('no room driver: ' + step.room);
        const res = await fn(step.args || {});
        QB.timeline.push({ room: step.room, args: step.args, res: res, secs: Math.round((QB.virtualNow() - t0) / 1000), day: QB.dayN });
        QB.logLine('✓ ' + step.room + ' ' + (res ? JSON.stringify(res).slice(0, 160) : '') + ' · ' + Math.round((QB.virtualNow() - t0) / 60) / 1000 + ' min');
        await QB.wait(150);
      }
      QB.done = true; QB.at = 'done'; QB.logLine('DONE total ' + Math.round((QB.stats.seconds || 0) / 360) / 10 + ' h over ' + QB.dayN + ' days');
    } catch (e) { QB.err = String(e && e.stack || e); QB.logLine('✕ ERROR ' + QB.err.slice(0, 300)); throw e; }
    finally { try { localStorage.setItem('qb.summary.' + QB.persona.id, JSON.stringify(QB.summary())); } catch (e) {} }
  };
  QB.summary = function () {
    const p = QB.p() || {}, E = QB.E();
    const subs = Object.keys(p.subs || {}).length, checks = Object.keys(p.checks || {}).filter(k => (p.checks[k].best || 0) >= (E ? E.PASS_CHECK : .75)).length;
    const reps = (p.reports || []);
    return { persona: QB.persona && QB.persona.id, hours: Math.round((QB.stats.seconds || 0) / 360) / 10, days: QB.dayN, byRoom: QB.stats.byRoom, lessons: subs, gates: checks,
      xp: p.xp, streak: p.streak, badges: (p.badges || []).length, reports: reps.length, reportWords: reps.map(r => r.words), mocks: Object.keys(p.mocks || {}), duels: p.bootcamp && Object.keys(p.bootcamp.missions || {}).length, duelPoints: p.bootcamp && p.bootcamp.points,
      story: p.story && { unlockedTo: p.story.unlockedTo, chapter: p.story.chapter, keepsakes: p.story.keepsakes }, rank: p._rank, readiness: p._gates, timeline: QB.timeline, extra: QB.stats.extra || {} };
  };
})();
