/* QB rooms — the Spellbook: Spellbook Workshop (Design, Cast it on a chart) and
   My Spellbook. Drives the real UI (lab.js, template.js) with the persona's
   own lines and values from QB.data.spellbook; reads Lab._state / Template
   only to decide what to click next.
   Rooms: spellbookDesign {mode} · cast {mode, promptId, timing} · spellbook {} */
(function () {
  'use strict';
  const QB = window.QB;
  const SHARE = { A1: 60, A2: 60, B1: 60, B2: 50, C1: 40 };
  const LVL = { A1: 0, A2: 1, B1: 2, B2: 3, C1: 4 };

  /* ------------------------------------------------------------------ helpers */
  const $ = QB.$, $$ = QB.$$;
  const SB = () => (QB.data && QB.data.spellbook) || {};
  const lvl = () => LVL[QB.persona.level] || 0;
  const L = () => window.LabContent;
  const LS = () => window.Lab && window.Lab._state;
  const readSec = (words) => Math.round(words / (QB.persona.readWpm || 100) * 60);
  const think = (f) => Math.round((QB.persona.secPerItem || 30) * (f == null ? 1 : f));
  const vtext = (v) => (v && typeof v === 'object') ? (v.text || '') : (v || '');
  const vtext2 = (v) => (v && typeof v === 'object') ? (v.text2 || '') : '';

  async function closeModals() {
    let n = 0;
    for (let i = 0; i < 6; i++) {
      const m = document.querySelector('#modal-slot .modal'); if (!m) break;
      const b = m.querySelector('[data-close]');
      const title = (m.querySelector('h3') || {}).textContent || '';
      if (b) { b.click(); n++; QB.logLine('  closed modal: ' + title.trim()); }
      else { const slot = document.getElementById('modal-slot'); if (slot) slot.innerHTML = ''; n++; }
      await QB.wait(120);
    }
    return n;
  }
  QB.closeModals = QB.closeModals || closeModals;
  /* waitFor that also clears celebrations popping up in the middle of a step */
  async function waitUI(fn, ms, label) {
    const t0 = QB.realNow();
    for (;;) {
      await closeModals();
      let v; try { v = fn(); } catch (e) {}
      if (v) return v;
      if (QB.stopNow) throw new Error('STOP');
      if (QB.realNow() - t0 > (ms || 8000)) throw new Error('waitUI timeout: ' + (label || fn.toString().slice(0, 80)));
      await QB.wait(60);
    }
  }
  /* AI call counter: counts lab.coach / lab.rate requests the page sends (read-only tap). */
  if (!QB._fetchTap) {
    QB._fetchTap = { coach: 0, rate: 0, other: 0 };
    const realFetch = window.fetch;
    window.fetch = function (url, opts) {
      try { const b = opts && typeof opts.body === 'string' ? JSON.parse(opts.body) : null; if (b && b.action === 'lab.coach') QB._fetchTap.coach++; else if (b && b.action === 'lab.rate') QB._fetchTap.rate++; } catch (e) {}
      return realFetch.apply(this, arguments);
    };
  }
  /* A design or a cast is one sitting: if the study day cannot hold it, she comes back tomorrow
     (otherwise the Workshop's own cast clock would count the overnight jump). */
  function freshSitting(estMin, what) {
    if (QB.dayMinutes + estMin > QB.DAY_CAP_MIN && QB.dayMinutes > 5) { QB.logLine('  (' + what + ' needs ~' + estMin + ' min; ' + Math.round(QB.DAY_CAP_MIN - QB.dayMinutes) + ' left today, so it starts tomorrow)'); QB.newDay(); }
  }
  async function openLab(tab) {
    if (window.PCHost && window.PCHost.labMode) window.PCHost.labMode(null);
    await QB.show('lab');
    await waitUI(() => $('#view-lab .lab'), 8000, 'lab mount');
    /* the coach status pill decides online/offline coaching: wait for it (lab.status) */
    try { await waitUI(() => LS() && LS().ai !== null, 6000, 'lab.status'); } catch (e) { QB.logLine('  lab.status did not settle; coaching path = ' + (LS() && LS().ai)); }
    if (tab) { await QB.click('[data-ltab="' + tab + '"]', 'tab ' + tab); await QB.wait(80); }
  }
  function completeTpl(mode) {
    const st = LS(); if (!st || !st.data) return null;
    const list = st.data.templates.filter(t => t.mode === mode && t.status === 'complete').sort((a, b) => String(b.updatedAt).localeCompare(String(a.updatedAt)));
    const use = (st.data.inUse || {})[mode];
    return list.filter(t => t.id === use)[0] || list[0] || null;
  }

  /* =========================================================== DESIGN */
  QB.rooms.spellbookDesign = async function (args) {
    const mode = args.mode || 'TREND', sb = SB(), lines = (sb.design || {})[mode] || {};
    const pct = sb.pct || SHARE[QB.persona.level] || 60, level = QB.persona.tier || 'B1';
    const ai0 = Object.assign({}, QB._fetchTap), s0 = QB.stats.seconds || 0;
    freshSitting(35, 'a page design');
    if (window.PCHost && window.PCHost.labMode) window.PCHost.labMode(mode);   // what the chapter mission does before show('lab')
    await openLab('studio');
    /* Design remembers the last page's summary / builder: "← All pages" takes her back to the mode cards */
    const back = $('#lab-shome') || $('#lab-bhome') || $('#lab-cancel');
    if (back) { await QB.click(back, 'All pages'); await waitUI(() => $('[data-mnew]'), 4000, 'studio home'); }
    if (window.Template.framesFor(QB.p(), mode)) {
      QB.logLine('spellbookDesign ' + mode + ': a complete page already exists, nothing to design');
      return { mode, saved: true, skipped: true, lines: 0, aiCalls: 0 };
    }
    const ai = LS().ai;
    QB.logLine('Workshop · coach pill: "' + LS().aiNote + '" (ai=' + ai + ', persona.noAI=' + !!QB.persona.noAI + ')');
    if (ai && QB.persona.noAI) QB.logLine('  NOTE: the server offers AI but this persona must not use it; the Workshop has no switch to decline coaching, so the lines are still sent to lab.coach');
    QB.spend(readSec(90), 'reading the Design intro and the four mode cards');
    /* an unfinished draft of this mode? the student continues it; otherwise "Design this page" */
    const cont = $$('[data-tcont]').filter(b => { const t = LS().data.templates.filter(x => x.id === b.dataset.tcont)[0]; return t && t.mode === mode; })[0];
    if (cont) { await QB.click(cont, 'continue draft'); QB.logLine('  continuing an unfinished ' + mode + ' draft'); }
    else {
      await QB.click('[data-mnew="' + mode + '"]', 'Design this page ' + mode);
      await waitUI(() => $('#lab-startbuild'), 5000, 'setup view');
      QB.spend(readSec(140) + think(0.5), 'reading the setup: mode, share, level');
      const r = $('input[name=lab-pct][value="' + pct + '"]'); if (r) await QB.click(r, 'share ' + pct); else QB.logLine('  BUG? share radio ' + pct + ' not found');
      await waitUI(() => $('#lab-startbuild'), 3000, 'setup repaint');
      const lv = $('[data-lv="' + level + '"]'); if (lv) await QB.click(lv, 'level ' + level);
      await waitUI(() => $('#lab-startbuild'), 3000, 'setup repaint 2');
      const name = $('#lab-name'); if (name) QB.logLine('  page name kept: "' + name.value + '"');
      QB.logLine('  setup: ' + mode + ' · ' + pct + '% · ' + level + ' · blank page');
      await QB.click('#lab-startbuild', 'Start building');
    }
    await waitUI(() => $('#lab-line'), 6000, 'builder');
    const M = L().MODES[mode], n = M.lines.length;
    let typed = 0, coachCalls = 0, offline = 0, retyped = 0, drive = 0, otherTier = false;
    for (let guard = 0; guard < n * 3; guard++) {
      const b = LS().build; if (!b || LS().view !== 'build') break;
      const comp = M.lines[b.idx], ln = b.tpl.lines[comp.id] || {};
      if (ln.last && ln.text) {                                    // already coached (resumed draft)
        if (b.idx < n - 1) { await QB.click('#lab-next', 'next'); await waitUI(() => $('#lab-line'), 4000); continue; }
        break;
      }
      const text = lines[comp.id];
      if (!text) throw new Error('persona part has no line for ' + mode + ' ' + comp.id);
      /* read the card: job, why, tip, the three examples of her tier */
      QB.spend(readSec(70 + comp.examples[level === 'C1' ? 'C1' : level === 'B2' ? 'B2' : 'B1'].join(' ').split(/\s+/).length) + think(1), 'reading line ' + comp.n + ' card and examples');
      if (!otherTier && lvl() >= 3 && $('#lab-othertier')) { await QB.click('#lab-othertier', 'show other tiers'); otherTier = true; QB.spend(readSec(60), 'reading the other tiers\' examples'); await waitUI(() => $('#lab-line'), 3000); }
      const ta = $('#lab-line');
      await QB.type(ta, text, 'writing line ' + comp.n); typed++;
      /* the live test drive under the box: glance at it */
      if ($('#lab-drive-para')) { drive++; QB.spend(readSec(30), 'glancing at the test drive'); }
      QB.logLine('  line ' + comp.n + ' ' + comp.id + ': "' + text + '"');
      const idxBefore = b.idx;
      await QB.click('#lab-coach', 'Coach me');
      const fbRes = await waitUI(() => { const bb = LS().build; return bb && !bb.busy && bb.fb ? bb.fb : null; }, 60000, 'coach feedback line ' + comp.n);
      if (fbRes.blocking) {
        /* the quick check refused the line (a slot missing or unknown); a real student fixes the slot */
        QB.logLine('  ✕ quick check blocked line ' + comp.n + ': ' + fbRes.blocking.join(' | '));
        QB.stats.extra = QB.stats.extra || {}; QB.stats.extra.designBlocked = (QB.stats.extra.designBlocked || 0) + 1;
        const missing = comp.slots.filter(k => text.indexOf('[' + M.SLOT_LABEL[k] + ']') < 0).map(k => '[' + M.SLOT_LABEL[k] + ']');
        const fixed = text.replace(/[.!?]?\s*$/, '') + (missing.length ? ' ' + missing.join(' ') : '') + '.';
        QB.spend(think(1), 'fixing the slot'); await QB.type($('#lab-line'), fixed, 'retyping line'); retyped++;
        await QB.click('#lab-coach', 'Coach me again');
        const fb2 = await waitUI(() => { const bb = LS().build; return bb && !bb.busy && bb.fb && !bb.fb.blocking ? bb.fb : null; }, 60000, 'coach feedback (retry)');
        if (!fb2) throw new Error('line still blocked');
      }
      const fb = LS().build.fb;
      coachCalls++; if (!fb.ai) offline++;
      QB.logLine('  ← ' + (fb.ai ? 'AI coach' : 'quick check only') + ': ' + fb.points + ' pts, ' + fb.errors + ' error(s)' + (fb.cefr ? ', ' + fb.cefr : '') + (fb.issues && fb.issues.length ? ' · ' + fb.issues.map(i => i.msg.slice(0, 70)).join(' / ') : ''));
      QB.spend(readSec(60) + think(0.3), 'reading the coaching');
      await closeModals();
      if (LS().build && LS().build.idx !== idxBefore) { QB.logLine('  (Check line moved on by itself)'); if (LS().build.idx >= n) { await QB.click(await waitUI(() => { const x = $('#lab-finishbp'); return x && !x.disabled ? x : null; }, 4000, 'review enabled'), 'Review the page'); break; } await waitUI(() => $('#lab-line'), 4000, 'next line'); continue; }
      if (b.idx < n - 1) { await QB.click(await waitUI(() => { const x = $('#lab-next'); return x && !x.disabled ? x : null; }, 4000, 'next enabled'), 'Next line'); await waitUI(() => $('#lab-line'), 4000, 'next line'); }
      else { await QB.click(await waitUI(() => { const x = $('#lab-finishbp'); return x && !x.disabled ? x : null; }, 4000, 'review enabled'), 'Review the page'); break; }
    }
    /* summary: read the page, run the full test drive on a bank chart, save */
    await waitUI(() => $('#lab-save') || $('#lab-suse'), 6000, 'summary');
    QB.spend(readSec(220), 'reading the page summary');
    const sel = $('#lab-dsrc');
    if (sel && lvl() >= 2) {
      const opt = Array.from(sel.options).filter(o => o.value !== 'scenario')[Math.floor(QB.rand() * Math.max(1, sel.options.length - 1))];
      if (opt) { QB.select(sel, opt.value); drive++; QB.spend(readSec(200), 'test drive on "' + opt.textContent.slice(0, 40) + '"'); QB.logLine('  test drive on another chart: ' + opt.textContent.slice(0, 60)); }
    } else if (sel) { drive++; QB.spend(readSec(200), 'reading the test drive (class data)'); }
    const save = await waitUI(() => { const x = $('#lab-save'); return x && !x.disabled ? x : null; }, 4000, 'save enabled');
    await QB.click(save, 'Save the page');
    await QB.wait(1200);
    { const slot = document.getElementById('modal-slot'); QB.logLine('  after save: modal-slot ' + (slot && slot.querySelector('.modal') ? 'shows "' + ((slot.querySelector('h3') || {}).textContent || '').trim() + '"' : 'empty') + ' · badges ' + JSON.stringify(QB.p().badges)); }
    await closeModals();
    const ok = !!window.Lab.designed(QB.p(), mode), frames = window.Template.framesFor(QB.p(), mode);
    if (!ok || !frames) throw new Error('page saved but Lab.designed/framesFor false for ' + mode);
    const aiCalls = QB._fetchTap.coach - ai0.coach;
    QB.logLine('saved ' + mode + ' page: ' + frames.name + ' · ' + frames.pct + '% · ' + frames.level + ' · ' + frames.slots.length + ' slots · coach calls ' + coachCalls + ' (AI requests ' + aiCalls + ', offline ' + offline + ')');
    QB.stats.extra = QB.stats.extra || {}; QB.stats.extra.designs = (QB.stats.extra.designs || 0) + 1; QB.stats.extra.coachAI = (QB.stats.extra.coachAI || 0) + aiCalls;
    return { mode, saved: true, lines: typed, aiCalls, offline, retyped, drive, minutes: Math.round(((QB.stats.seconds || 0) - s0) / 60) };
  };

  /* ============================================================ CAST */
  /* Type a value word by word so a 1-minute card can run out while she types. */
  async function typeProgressive(el, text, why, stillEditing) {
    const words = String(text).trim().split(/\s+/).filter(Boolean), wpm = QB.persona.wpm || 12;
    let acc = [];
    for (let i = 0; i < words.length; i += 3) {
      const chunk = words.slice(i, i + 3); acc = acc.concat(chunk);
      QB.spend(Math.round(chunk.length / wpm * 60), why || 'typing');
      if (!document.body.contains(el)) return false;
      QB.setVal(el, acc.join(' '));
      await QB.wait(320);                                          // let the cast clock tick catch up
      if (stillEditing && !stillEditing()) return false;
    }
    return true;
  }
  QB.rooms.cast = async function (args) {
    const mode = args.mode || 'TREND', pid = args.promptId || QB.PROMPTS[mode], timing = args.timing || 'none';
    const sb = SB(), vals = (sb.cast || {})[pid] || {}, fixes = ((sb.fix || {})[pid]) || {};
    const ai0 = Object.assign({}, QB._fetchTap), s0 = QB.stats.seconds || 0;
    freshSitting(25, 'a cast');
    await openLab('assembly');
    if (!window.Template.framesFor(QB.p(), mode)) {
      QB.logLine('cast: no saved ' + mode + ' page yet, designing one first');
      await QB.rooms.spellbookDesign({ mode }); await openLab('assembly');
    }
    if ($('#lab-val') && LS().run && !LS().run.done) { await QB.click('#lab-rquit', 'Save and leave old cast'); await QB.wait(200); }
    const tpl = completeTpl(mode); if (!tpl) throw new Error('no complete template for ' + mode);
    await waitUI(() => $('#lab-tsel'), 5000, 'cast home');
    QB.spend(readSec(120), 'reading Cast it on a chart');
    if ($('#lab-tsel').value !== tpl.id) { QB.select('#lab-tsel', tpl.id); await waitUI(() => $('#lab-tsel') && $('#lab-tsel').value === tpl.id, 3000, 'page select'); }
    const tr = $('input[name=lab-timing][value="' + timing + '"]'); if (!tr) throw new Error('timing option ' + timing + ' missing'); await QB.click(tr, 'timing ' + timing);
    const card = $('[data-pp="' + pid + '"]'); if (!card) throw new Error('prompt card ' + pid + ' not listed for a ' + mode + ' page');
    QB.logLine('cast ' + pid + ' with "' + tpl.name + '" (' + tpl.pct + '%), timing ' + timing);
    await QB.click(card, 'prompt ' + pid);
    await waitUI(() => ($('#lab-val') && LS().run) || $('#lab-rstart'), 6000, 'run card or start card');
    if ($('#lab-rstart')) { QB.spend(readSec(40) + think(1), 'studying the chart before Start'); await QB.click('#lab-rstart', 'Start the cast'); await waitUI(() => $('#lab-val') && LS().run, 6000, 'run card'); }
    const run = LS().run, M = L().MODES[mode];
    const timed = timing !== 'none';
    QB.spend(timed ? readSec(20) + think(0.5) : readSec(40) + think(1.5), 'studying the chart' + (timed ? ' (clock already running)' : ''));
    let fixedOnce = false, checks = 0, autos = 0, fixed = 0;
    for (let guard = 0; guard < run.order.length * 4; guard++) {
      const r = LS().run; if (!r || r.done) break;
      const key = r.order[r.idx], v = r.a.vars[key] || {};
      if (r.phase === 'edit') {
        const raw = vals[key];
        if (raw == null) throw new Error('persona part has no cast value for ' + pid + ' ' + key);
        const text = vtext(raw), text2 = vtext2(raw);
        QB.spend(timed ? think(0.15) : think(0.5) + readSec(25), 'reading the variable card ' + M.SLOT_LABEL[key]);
        const editing = () => { const x = LS().run; return x && x.phase === 'edit' && x.order[x.idx] === key; };
        const done1 = await typeProgressive($('#lab-val'), text, 'typing ' + key, editing);
        if (done1 && text2 && $('#lab-val2')) await typeProgressive($('#lab-val2'), text2, 'typing 2nd mention', editing);
        if (editing()) { await QB.click('#lab-vcheck', 'Check it'); }
        else { autos++; QB.logLine('  ⏱ card ' + key + ' timed out while typing (auto-checked with what was written)'); }
        const fb = await waitUI(() => { const x = LS().run; return x && x.phase === 'feedback' && x.fb ? x.fb : (x && x.fb && x.fb.blocking ? x.fb : null); }, 60000, 'variable feedback ' + key);
        if (fb.blocking) { QB.logLine('  ✕ check refused ' + key + ': ' + fb.blocking.join(' | ')); throw new Error('cast value blocked for ' + key); }
        checks++;
        const d = fb.data || {}, got = (LS().run.a.vars[key] || {}).text || '', got2 = (LS().run.a.vars[key] || {}).text2 || '';
        QB.logLine('  ' + M.SLOT_LABEL[key] + ' = "' + got + '"' + (got2 ? ' / "' + got2 + '"' : '') + (got !== text ? ' (cut short)' : '') + ' → ' + (d.status === 'ok' ? '✓' : d.status === 'near' ? '≈' : d.status === 'bad' ? '✗' : '·') + ' ' + String(d.note || '').slice(0, 90) + ' · ' + fb.points + ' pts' + (fb.ai ? ' (AI)' : ''));
        QB.spend(timed ? readSec(25) : readSec(50) + think(0.3), 'reading the check');
        if (d.status === 'bad' && lvl() >= 2 && !fixedOnce && fixes[key] && $('#lab-vretry')) {
          fixedOnce = true; fixed++;
          await QB.click('#lab-vretry', 'Revise and check again');
          await waitUI(() => { const x = LS().run; return x && x.phase === 'edit' && $('#lab-val'); }, 3000, 'retry edit');
          QB.spend(think(1), 'looking at the chart again');
          await typeProgressive($('#lab-val'), fixes[key], 'retyping ' + key, editing);
          if (editing()) await QB.click('#lab-vcheck', 'Check again');
          const fb2 = await waitUI(() => { const x = LS().run; return x && x.phase === 'feedback' && x.fb ? x.fb : null; }, 60000, 'retry feedback');
          checks++;
          QB.logLine('  fixed ' + M.SLOT_LABEL[key] + ' → "' + fixes[key] + '" → ' + ((fb2.data || {}).status) + ' ' + String((fb2.data || {}).note || '').slice(0, 80));
          QB.spend(readSec(40), 'reading the second check');
        }
        continue;
      }
      if (r.phase === 'feedback') {
        await closeModals();
        if (r.idx < r.order.length - 1) { await QB.click('#lab-vnext', 'Next variable'); await waitUI(() => { const x = LS().run; return x && x.order[x.idx] !== key || (x && x.done); }, 4000, 'next variable'); }
        else { await QB.click('#lab-vfinish', 'Assemble my report'); break; }
        continue;
      }
      await QB.wait(100);
    }
    /* the assembled report: wait for the rating (AI) or the offline note, then the settle */
    await waitUI(() => { const x = LS().run; return x && x.done && x.rating !== 'wait' && x.a.status === 'complete'; }, 90000, 'cast settled');
    const a = LS().run.a, acc = a.accuracy || { ok: 0, near: 0, bad: 0, n: 0 };
    QB.spend(readSec(a.words || 150) + readSec(120), 'reading the assembled report, the data check and the wards');
    await closeModals();
    QB.logLine('cast done: ' + a.words + ' words · share ' + Math.round((a.share || 0) * 100) + '% · ✓' + acc.ok + ' ≈' + acc.near + ' ✗' + acc.bad + ' of ' + acc.n + ' · wards bad ' + (a.wards ? a.wards.bad : '?') + ' · band ' + (a.rating ? a.rating.overall : 'none (offline)') + ' · points ' + (a.points ? a.points.total : 0) + ' · full=' + a.full + ' timing=' + a.timing + ' autos=' + a.autos);
    if (window.Lab.casts && timing === '1min') QB.logLine('  Lab.casts 1min full = ' + window.Lab.casts(QB.p(), { timing: '1min', full: true }));
    /* "Open in the Scriptorium" is deliberately NOT taken here: the report room writes. Back to the cast list. */
    const again = $('#lab-again'); if (again) await QB.click(again, 'New cast (back to the list)');
    QB.stats.extra = QB.stats.extra || {}; QB.stats.extra.casts = (QB.stats.extra.casts || 0) + 1; QB.stats.extra.castAI = (QB.stats.extra.castAI || 0) + (QB._fetchTap.coach - ai0.coach) + (QB._fetchTap.rate - ai0.rate);
    return { promptId: pid, mode, ok: acc.ok, approx: acc.near, bad: acc.bad, timing, words: a.words, band: a.rating ? a.rating.overall : null, fixed, autos: a.autos || autos, aiCalls: (QB._fetchTap.coach - ai0.coach) + (QB._fetchTap.rate - ai0.rate), minutes: Math.round(((QB.stats.seconds || 0) - s0) / 60) };
  };

  /* ====================================================== MY SPELLBOOK */
  QB.rooms.spellbook = async function () {
    const sb = SB(), mem = sb.memory || {};
    /* single-room smoke on a fresh student: give her one page to read first */
    if (QB.plan && QB.plan.length === 1 && !window.Template.framesFor(QB.p(), 'TREND')) await QB.rooms.spellbookDesign({ mode: 'TREND' });
    await QB.show('template');
    await waitUI(() => $('#view-template .tpl-book'), 6000, 'My Spellbook');
    const pages = $$('#view-template .tpl-page:not(.empty)').map(s => s.dataset.mode);
    QB.logLine('My Spellbook: pages ' + (pages.join(', ') || 'none'));
    QB.spend(readSec(60), 'reading the My Spellbook intro');
    pages.forEach(m => QB.spend(60, 'reading the ' + m + ' page'));
    const memory = {};
    if (pages.length) {
      await QB.click('[data-fade="skeleton"]', 'Skeleton');
      await waitUI(() => $('#view-template .tpl-gap') || $('#view-template .tpl-page'), 3000);
      pages.forEach(m => QB.spend(30, 'saying the ' + m + ' page from its skeleton'));
      await QB.click('[data-fade="exam"]', 'Exam');
      for (const m of pages) {
        const ta = await waitUI(() => $('#tpl-rc-' + m), 3000, 'recall box ' + m);
        if (!mem[m]) { QB.logLine('  no memory text for ' + m + ' in the persona part'); continue; }
        await QB.type(ta, mem[m], 'writing the ' + m + ' page from memory');
        await QB.click('[data-rcheck="' + m + '"]', 'Check my memory ' + m);
        const txt = await waitUI(() => { const e = $('#tpl-rs-' + m); return e && e.textContent ? e.textContent : null; }, 3000, 'memory result');
        const pct = parseInt(txt, 10); memory[m] = isNaN(pct) ? txt : pct;
        QB.logLine('  memory check ' + m + ': ' + txt.trim());
        QB.spend(readSec(120), 'comparing with the real page');
      }
      await QB.click('[data-fade="guided"]', 'Guided');
    }
    QB.stats.extra = QB.stats.extra || {}; QB.stats.extra.spellbookMemory = memory;
    return { pages, memory };
  };

  /* test-only: every mode designed and cast, the tournament cast, then My Spellbook */
  QB.rooms.spellbookAll = async function () {
    const out = { designs: [], casts: [] };
    for (const mode of ['TREND', 'COMPARE', 'SEQUENCE', 'SPACE']) {
      out.designs.push(await QB.rooms.spellbookDesign({ mode }));
      out.casts.push(await QB.rooms.cast({ mode, promptId: QB.PROMPTS[mode] }));
    }
    out.casts.push(await QB.rooms.cast({ mode: 'TREND', promptId: QB.TOUR_PROMPT, timing: '1min' }));
    out.spellbook = await QB.rooms.spellbook({});
    return out;
  };
  /* test-only alias: the tournament's timed cast (one minute per variable) */
  QB.rooms.castTimed = (a) => QB.rooms.cast(Object.assign({ mode: 'TREND', promptId: QB.TOUR_PROMPT || 'p-line-phones', timing: '1min' }, a || {}));
  QB.smokeArgs = Object.assign(QB.smokeArgs || {}, {
    spellbookDesign: { mode: 'TREND' },
    cast: { mode: 'TREND', promptId: 'p-line-museums' },
    castTimed: {},
    spellbookAll: {},
    spellbook: {}
  });
})();
