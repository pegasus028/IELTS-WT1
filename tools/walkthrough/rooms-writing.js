/* QB rooms — writing: the Duelling Hall (duel), the Scriptorium (report) and the Mock examinations (mock).
   Drives the REAL UI only. Persona text comes from QB.data.writing (personas/parts/<lv>-writing.json). */
(function () {
  'use strict';
  const QB = window.QB, $ = QB.$, $$ = QB.$$;
  const LV = ['A1', 'A2', 'B1', 'B2', 'C1'];
  const lvIdx = (l) => Math.max(0, LV.indexOf(l || 'B1'));
  const rnd = (a, b) => a + Math.floor(QB.rand() * (b - a + 1));
  const W = () => (QB.data && QB.data.writing) || { reports: {}, mocks: {} };
  const ex = (k, v) => { QB.stats.extra = QB.stats.extra || {}; (QB.stats.extra[k] = QB.stats.extra[k] || []).push(v); };

  QB.closeModals = QB.closeModals || async function () {
    for (let i = 0; i < 4; i++) {
      const m = $('#modal-slot .modal'); if (!m) return;
      const b = m.querySelector('[data-close]') || m.querySelector('button');
      if (b) { b.click(); await QB.wait(60); } else { $('#modal-slot').innerHTML = ''; }
    }
  };
  function svgClick(el) { el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window })); }
  function words(t) { const m = String(t || '').trim().match(/[A-Za-z0-9][A-Za-z0-9'’.,%$-]*/g); return m ? m.length : 0; }
  function sents(t) { return String(t || '').split(/(?<=[.!?])\s+/).map(s => s.trim()).filter(Boolean); }
  function paras(t) { return String(t || '').replace(/\r/g, '').split(/\n\s*\n/).map(s => s.trim()).filter(Boolean); }

  /* ======================================================================= DUEL */
  function duelAcc(prompt) {
    const per = QB.persona, d = lvIdx(prompt.level) - lvIdx(per.level);
    let acc = per.duelAcc || 0.6;
    if (d > 0) acc -= 0.08; else if (d < 0) acc += 0.05;   /* chart above / below the persona's level */
    return Math.max(0.15, Math.min(0.97, acc));
  }
  /* the duel key: Bootcamp.build is deterministic per prompt id, so a fresh build reproduces the mounted mission */
  function duelKey(prompt) { return window.Bootcamp.build(prompt); }
  function optText(o) { return String(o.textContent || '').replace(/\s*[✓✕]\s*$/, '').trim(); }
  function plain(s) { return String(s).replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').trim(); }

  async function playDuelOnce(prompt, firstDuel) {
    const mission = duelKey(prompt), acc = duelAcc(prompt), per = QB.persona;
    let right = 0, first = 0, asked = 0, hints = 0, mismatches = 0;
    const host = () => $('#view-bootrun');
    for (let si = 0; si < mission.steps.length; si++) {
      const step = mission.steps[si];
      await QB.waitFor(() => host().querySelector('.bc-q') && $$('#view-bootrun .wr-phases span.on').length && +$$('#view-bootrun .wr-phases span.on')[0].textContent === si + 1, 6000);
      QB.spend(firstDuel && si === 0 ? 40 : rnd(10, 20), 'duel: read step brief');
      for (const q of step.questions) {
        const qsel = () => host().querySelector('[data-q="' + q.id + '"] .bc-sel');
        const sel = await QB.waitFor(qsel, 4000);
        /* verify the key maps onto the DOM (options rotate per the Oct-20 fairness fix) */
        const domOpts = Array.from(sel.options).slice(1).map(optText);
        const keyIdx = domOpts.findIndex(t => t === plain(q.options[q.answer]));
        if (keyIdx < 0 || keyIdx !== q.answer) { mismatches++; QB.logLine('duel: key mismatch on ' + q.id + ' (build says ' + q.answer + ', DOM ' + keyIdx + ')'); }
        const answer = keyIdx >= 0 ? keyIdx : q.answer;
        const nOpt = domOpts.length;
        asked++;
        QB.spend(rnd(20, 45), 'duel: think');
        const willRight = QB.chance(acc);
        const wrongPick = (exclude) => { const c = []; for (let i = 0; i < nOpt; i++) if (i !== answer && exclude.indexOf(i) < 0) c.push(i); return c[Math.floor(QB.rand() * c.length)]; };
        if (willRight) {
          QB.select(qsel(), String(answer)); await QB.click(host().querySelector('[data-check="' + q.id + '"]'), 'check');
          right++; first++;
        } else {
          if (QB.chance(per.hintP || 0.3)) { const hb = host().querySelector('[data-hint="' + q.id + '"]'); if (hb) { await QB.click(hb, 'hint'); hints++; QB.spend(rnd(8, 15), 'duel: read hint'); } }
          const w1 = wrongPick([]);
          QB.select(qsel(), String(w1)); await QB.click(host().querySelector('[data-check="' + q.id + '"]'), 'check');
          await QB.wait(40);
          /* second choice offered */
          const again = host().querySelector('[data-check="' + q.id + '"]');
          if (again) {
            QB.spend(rnd(10, 25), 'duel: second choice');
            const secondRight = QB.chance(Math.min(0.95, acc + 0.25));
            const pick = secondRight ? answer : wrongPick([w1]);
            QB.select(qsel(), String(pick)); await QB.click(host().querySelector('[data-check="' + q.id + '"]'), 'check2');
            if (secondRight) right++;
          }
        }
        QB.spend(10, 'duel: read feedback');
        QB.logLine('duel q ' + q.id + ' ' + (host().querySelector('[data-q="' + q.id + '"]').classList.contains('ok') ? '✓' : '✕'));
      }
      const next = await QB.waitFor(() => { const b = host().querySelector('#bc-next'); return b && !b.disabled ? b : null; }, 4000);
      await QB.click(next, 'next');
      await QB.wait(60);
    }
    await QB.waitFor(() => $('#bc-back'), 6000);
    const ring = $('#view-bootrun .score-ring i'), pct = parseInt(ring ? ring.textContent : '0', 10) || 0;
    const m = (($('#view-bootrun h3') || {}).textContent) || '';
    const ptm = String(($('#view-bootrun .result p') || {}).textContent || '').match(/(\d+) of (\d+) points/);
    QB.spend(rnd(25, 50), 'duel: read result');
    return { pct, passed: /won/i.test(m), points: ptm ? +ptm[1] : 0, total: ptm ? +ptm[2] : 0, asked, right, first, hints, mismatches };
  }

  QB.rooms.duel = async function (args) {
    const pid = args.promptId, prompt = window.Charts.prompt(pid);
    if (!prompt) throw new Error('duel: unknown prompt ' + pid);
    await QB.closeModals(); await QB.show('bootcamp');
    if (args.firstDuel) QB.spend(60, 'duel: read the Hall intro and the Ten Wards');
    const card = await QB.waitFor(() => $('[data-bc="' + pid + '"]'), 6000);
    await QB.click(card, 'duel card');
    let res, attempts = 0, totalPoints = 0;
    for (;;) {
      res = await playDuelOnce(prompt, args.firstDuel && attempts === 0);
      attempts++; totalPoints += res.points;
      QB.logLine('duel ' + pid + ' attempt ' + attempts + ': ' + res.pct + '% ' + (res.passed ? 'won' : 'lost') + ' (' + res.first + ' first-choice + ' + (res.right - res.first) + ' second-choice of ' + res.asked + ', hints ' + res.hints + (res.mismatches ? ', KEY MISMATCHES ' + res.mismatches : '') + ')');
      const appAttempts = (((QB.p().bootcamp || {}).missions || {})[pid] || {}).attempts || attempts;
      if (!res.passed && appAttempts < 3 && attempts < 3) { await QB.click('#bc-again', 'duel again'); await QB.wait(80); continue; }
      break;
    }
    await QB.closeModals();
    await QB.click('#bc-back', 'back to hall');
    ex('duels', { promptId: pid, pct: res.pct, attempts, acc: duelAcc(prompt) });
    return { promptId: pid, pct: res.pct, passed: res.passed, points: totalPoints, attempts };
  };

  /* ================================================================== WRITING */
  const BUDGET = 1130; /* seconds: stay under the 20:00 clock (the Writer reads Date.now(), i.e. the virtual clock) */
  function writeSession() {
    const t0 = QB.virtualNow();
    const used = () => Math.round((QB.virtualNow() - t0) / 1000);
    return { t0, used, spend(sec, why) { const left = BUDGET - used(); if (left <= 0) return; QB.spend(Math.min(sec, left), why); } };
  }
  function detectMode(mode) {
    const v = $('#view-write'); if (!v) return 'exam';
    if (!v.querySelector('#wr-mode')) return 'exam';
    const tip = v.querySelector('.wr-right > p.tiny');
    return tip && /spellbook page/i.test(tip.textContent) ? 'spellbook' : 'guided';
  }
  async function fillPlan(prompt, part, S) {
    const per = QB.persona, lv = lvIdx(per.level);
    const ms = $('#wr-mode');
    if (ms) {
      const modes = ['TREND', 'COMPARE', 'SEQUENCE', 'SPACE'];
      const ok = QB.chance((per.acc || {}).B1 != null ? per.acc.B1 : 0.7);
      const pick = ok ? prompt.mode : modes.filter(m => m !== prompt.mode)[rnd(0, 2)];
      S.spend(rnd(8, 20), 'plan: mode'); QB.select(ms, pick);
      if (!ok && QB.chance(0.7)) { S.spend(10, 'plan: notice the red mode box'); QB.select(ms, prompt.mode); }
    }
    const plan = (part && part.plan) || {};
    const note = async (sel, txt, why) => { const el = $(sel); if (!el || !txt) return; S.spend(Math.round(words(txt) / ((per.wpm || 12) * 3) * 60) + 4, why); QB.setVal(el, txt); await QB.wait(15); };
    await note('#wr-big', plan.big, 'plan: big picture'); await note('#wr-ga', plan.ga, 'plan: group A'); await note('#wr-gb', plan.gb, 'plan: group B');
    /* tap four or five values on the chart */
    const marks = $$('#wr-chart [data-pick]');
    if (marks.length) {
      const n = Math.min(marks.length, lv <= 1 ? rnd(2, 4) : rnd(4, 6)), seen = {};
      for (let i = 0; i < n; i++) { let k; do { k = Math.floor(QB.rand() * marks.length); } while (seen[k] && Object.keys(seen).length < marks.length); seen[k] = 1; svgClick(marks[k]); S.spend(rnd(3, 6), 'plan: tap a value'); await QB.wait(20); }
    }
    /* the manual Plan Wards: lower levels tick what they think they did */
    const ids = $$('#wr-planlist input[data-ward]:not([disabled])').map(cb => cb.dataset.ward);
    for (const id of ids) { const cb = $('#wr-planlist input[data-ward="' + id + '"]'); const p = lv <= 1 ? 0.75 : 0.95; S.spend(2, 'plan: ward'); if (cb && QB.chance(p) && !cb.checked) { cb.click(); await QB.wait(10); } }
    QB.logLine('plan filled: wards ' + (($('#wr-planscore') || {}).textContent || '?') + ', picks ' + $$('#wr-picks li').length);
  }
  function panelCounts() { return { bad: $$('#wr-panel .pf-row.bad').length, warn: $$('#wr-panel .pf-row.warn').length, rows: $$('#wr-panel .pf-row').length }; }
  async function tickLanding(S, exam) {
    const per = QB.persona, lv = lvIdx(per.level);
    const ids = $$('#wr-landlist input[data-ward]:not([disabled])').map(cb => cb.dataset.ward);
    for (const id of ids) {
      S.spend(rnd(3, 6), 'landing: check a line');
      let tick = true;
      if (exam) { /* honesty by level: weak writers over-tick; strong ones tick what the Wards would agree with */
        tick = QB.chance([0.8, 0.8, 0.85, 0.9, 0.95][lv]);
      }
      const cb = $('#wr-landlist input[data-ward="' + id + '"]');
      if (cb && tick && !cb.checked) { cb.click(); await QB.wait(10); }
    }
  }
  async function typeParagraphs(areas, ps, S, why) {
    if (areas.length === 1) { const txt = ps.join('\n\n'); const n = words(txt); S.spend(Math.round(n / (QB.persona.wpm || 12) * 60), why); QB.setVal(areas[0], txt); await QB.wait(30); return; }
    for (let i = 0; i < 4; i++) {
      const txt = i < 3 ? (ps[i] || '') : ps.slice(3).join('\n\n');
      const n = words(txt); S.spend(Math.round(n / (QB.persona.wpm || 12) * 60), why); QB.setVal(areas[i], txt); await QB.wait(20);
      S.spend(rnd(3, 6), 'write: reread the paragraph');
    }
  }
  /* The common body of a write: plan, type, Ten Wards, revise, Landing Check, submit, result, model. */
  async function doWrite(prompt, cfg) {
    const per = QB.persona, lv = lvIdx(per.level), S = writeSession();
    const part = (W().reports || {})[prompt.id] || {};
    const actual = detectMode();
    const exam = actual === 'exam';
    let text = cfg.text, slotsUsed = false, unfilled = 0;
    /* spellbook: fill the student's own frames from her slot values */
    if (actual === 'spellbook' && part.slots && window.Template && Template.framesFor) {
      try {
        const frames = Template.framesFor(QB.p(), prompt.mode);
        if (frames && frames.paragraphs) {
          const filled = Template.fill(frames, part.slots);
          if (filled && words(filled) > 60) { text = filled; slotsUsed = true; unfilled = (filled.match(/\[[A-Z][^\]\n]{1,40}\]/g) || []).length; }
        }
      } catch (e) { QB.logLine('spellbook fill failed: ' + e); }
    }
    const ps = paras(text);
    S.spend(Math.round(rnd(60, 85) * (lv <= 1 ? 1.05 : lv >= 4 ? 0.8 : 0.9)), 'write: read the chart');
    if (!exam) await fillPlan(prompt, part, S);
    const areas = $$('#view-write textarea');
    if (!areas.length) throw new Error('writer: no textareas');
    await typeParagraphs(areas, ps, S, 'write: type the report');
    if (slotsUsed) QB.logLine('spellbook: frames filled from slots (' + words(text) + ' words, unfilled slots ' + unfilled + ')');
    /* the Ten Wards */
    await QB.click('#wr-check', 'ten wards'); await QB.wait(80);
    let pc = panelCounts(); let revised = false;
    S.spend(exam ? 30 : Math.round(pc.rows * (lv <= 1 ? 5 : lv >= 4 ? 3 : 3.5)), 'check: read the wards');
    QB.logLine(exam ? 'exam mode: Wards hidden until sent' : 'wards: ' + pc.bad + ' red, ' + pc.warn + ' amber (' + actual + ')');
    const editCost = (a, b) => { const sa = sents(a), sb = sents(b); const changed = sb.filter(x => sa.indexOf(x) < 0); const n = changed.reduce((t, x) => t + words(x), 0) || 8; return Math.round(n / ((per.wpm || 12) * 1.5) * 60) + 10; };
    const canRev = !exam && lv >= 2 && pc.bad > 0 && !!part.revised && part.revised !== text && !!$('#wr-revise');
    if (canRev) QB.logLine('revise? cost ' + editCost(text, part.revised) + ' s, used ' + S.used() + ' s');
    if (canRev && QB.chance(0.85) && S.used() + editCost(text, part.revised) < BUDGET - 45) {
      await QB.click('#wr-revise', 'revise once'); await QB.wait(60);
      if (slotsUsed) QB.logLine('revise: the filled spellbook page is thin, so she rewrites from her own full text');
      const rp = paras(part.revised), cur = paras(text);
      const areas2 = $$('#view-write textarea');
      if (areas2.length === 1) { S.spend(editCost(text, part.revised), 'revise: edit the sentence'); QB.setVal(areas2[0], part.revised); }
      else for (let i = 0; i < 4; i++) {
        const want = i < 3 ? rp[i] || '' : rp.slice(3).join('\n\n'), have = i < 3 ? cur[i] || '' : cur.slice(3).join('\n\n');
        if (want !== have) { S.spend(editCost(have, want), 'revise: edit paragraph ' + (i + 1)); QB.setVal(areas2[i], want); await QB.wait(20); }
      }
      revised = true;
      await QB.click('#wr-check', 'ten wards again'); await QB.wait(80);
      pc = panelCounts(); S.spend(rnd(20, 40), 'check: reread the wards');
      QB.logLine('wards after revise: ' + pc.bad + ' red, ' + pc.warn + ' amber');
    }
    await tickLanding(S, exam);
    const sub = await QB.waitFor(() => { const b = $('#wr-submit'); return b && !b.disabled ? b : null; }, 4000);
    const usedBefore = S.used();
    await QB.click(sub, 'send the report');
    await QB.waitFor(() => $('#w-another'), 8000);
    QB.spend(40, 'result: read the owl screen');
    const reps = QB.p().reports || [], rep = reps[reps.length - 1] || {};
    let modelOpened = false;
    if ($('#w-model')) {
      await QB.click('#w-model', 'compare with the model');
      await QB.waitFor(() => $('#m-back'), 6000);
      QB.spend(lv <= 1 ? 110 : 90, 'model: compare'); modelOpened = true;
      await QB.closeModals();
      await QB.click('#m-back', 'back from the model'); await QB.wait(60);
    }
    await QB.closeModals();
    await QB.show('writer');
    const out = { promptId: prompt.id, words: rep.words, seconds: rep.seconds, bad: rep.bad, warn: rep.warn, kind: cfg.kind, uiMode: actual, revised, simMinutes: Math.round(usedBefore / 6) / 10, modelOpened, slotsUsed, unfilled, timedOut: !!rep.timedOut };
    ex('writes', out);
    QB.logLine('write done: ' + JSON.stringify(out));
    return out;
  }

  QB.rooms.report = async function (args) {
    const pid = args.promptId, prompt = window.Charts.prompt(pid), uiMode = args.uiMode || 'guided';
    if (!prompt) throw new Error('report: unknown prompt ' + pid);
    const part = (W().reports || {})[pid];
    if (!part || !part.text) throw new Error('report: no persona text for ' + pid);
    const text = args.short && part.short ? part.short : part.text;
    await QB.closeModals(); await QB.show('writer');
    const radio = await QB.waitFor(() => $('#view-writer input[name=uim][value="' + uiMode + '"]'), 6000);
    await QB.click(radio, 'ui mode'); QB.spend(rnd(5, 12), 'writer: choose the mode');
    const card = await QB.waitFor(() => $('#view-writer [data-p="' + pid + '"]'), 6000);
    await QB.click(card, 'prompt card');
    await QB.waitFor(() => $('#view-write textarea'), 6000);
    const toast = $('#toast-slot .toast'); if (toast && /spellbook page yet/i.test(toast.textContent)) QB.logLine('toast: ' + toast.textContent.trim());
    const res = await doWrite(prompt, { text, kind: args.kind || 'practice', uiMode });
    res.requested = uiMode; res.short = !!args.short;
    return res;
  };

  QB.rooms.reportSpellbook = QB.rooms.reportShort = QB.rooms.reportExam = (a) => QB.rooms.report(a);
  QB.rooms.mock = async function (args) {
    const mk = (window.CONTENT.MOCKS || []).find(m => m.id === args.mockId);
    if (!mk) throw new Error('mock: unknown ' + args.mockId);
    const prompt = window.Charts.prompt(mk.promptId);
    const text = (W().mocks || {})[mk.id];
    if (!text) throw new Error('mock: no persona text for ' + mk.id);
    await QB.closeModals(); await QB.show('writer');
    const card = await QB.waitFor(() => $('#view-writer [data-mock="' + mk.id + '"]'), 6000);
    await QB.click(card, 'mock card');
    const start = await QB.waitFor(() => $('#mock-start'), 4000);
    QB.spend(rnd(10, 20), 'mock: read the start card');
    await QB.click(start, 'start the clock');
    await QB.waitFor(() => $('#view-write textarea'), 6000);
    const res = await doWrite(prompt, { text, kind: 'mock', uiMode: 'exam' });
    res.mockId = mk.id;
    return res;
  };

  QB.smokeArgs = Object.assign(QB.smokeArgs || {}, {
    duel: { promptId: 'p-line-museums' },
    report: { promptId: 'p-line-museums', mode: 'TREND', uiMode: 'guided', kind: 'practice' },
    reportSpellbook: { promptId: 'p-line-museums', mode: 'TREND', uiMode: 'spellbook', kind: 'practice' },
    reportShort: { promptId: 'p-line-museums', mode: 'TREND', uiMode: 'guided', kind: 'practice', short: true },
    reportExam: { promptId: 'p-line-phones', mode: 'TREND', uiMode: 'exam', kind: 'practice' },
    mock: { mockId: 'mock1', promptId: 'p-line-internet' }
  });
})();
