/* QB rooms — story, lessons, gates, mending, models, record (IELTS-WT1 · Quillmoor · The Observatory).
   Drives the real UI: the Map Room (story.js paintMap), the story viewer, the Sorting Lantern,
   the lesson/gate runner (student.js renderQ + engine.js mount) and the Mending Room.
   Reads app state (Engine.Bank, Story, PCHost.p, STORY, SORTING, CONTENT) only to decide what to click.
   Persona text for the free-text items comes from QB.data.items[itemId] (personas/parts/<lv>-items.json). */
(function () {
  'use strict';
  const Q = window.QB;
  const $ = Q.$, $$ = Q.$$;
  const per = () => Q.persona || {};
  const rnd = (a, b) => a + Q.rand() * (b - a);
  const pick = (arr) => arr[Math.floor(Q.rand() * arr.length)];
  const vis = (el) => !!el && !el.closest('.hidden') && el.offsetParent !== null;
  const txt = (el) => (el ? String(el.textContent || '') : '').replace(/\s+/g, ' ').trim();
  /* a button's own text without its numbering span (.opt-k, .seg-n, .rank-n) */
  const btnText = (el) => { if (!el) return ''; const c = el.cloneNode(true); $$('.opt-k, .seg-n, .rank-n', c).forEach(x => x.remove()); return txt(c); };
  const htmlText = (s) => { const d = document.createElement('div'); d.innerHTML = String(s == null ? '' : s); return txt(d); };
  const nrm = (s) => String(s || '').toLowerCase().replace(/[’']/g, "'").replace(/[.,!?;:"“”]/g, '').replace(/\s+/g, ' ').trim();
  const wordsOf = (s) => String(s || '').trim().split(/\s+/).filter(Boolean).length;
  const readSecs = (words) => Math.max(3, Math.round(words / (per().readWpm || 120) * 60));
  Q.stats.extra = Q.stats.extra || {};
  const bump = (k, n) => { Q.stats.extra[k] = (Q.stats.extra[k] || 0) + (n == null ? 1 : n); };
  const note = (s) => { Q.stats.extra.notes = Q.stats.extra.notes || []; if (Q.stats.extra.notes.indexOf(s) < 0) Q.stats.extra.notes.push(s); Q.logLine('NOTE ' + s); };

  /* ------------------------------------------------------------- helpers */
  Q.closeModals = async function () {
    for (let i = 0; i < 4; i++) {
      const m = $('#modal-slot .modal'); if (!m) return;
      const b = m.querySelector('[data-close]');
      if (b) { b.click(); } else { $('#modal-slot').innerHTML = ''; }
      await Q.wait(60);
    }
  };
  /* SVG nodes (the map) have no .click(): dispatch a real mouse event. */
  async function clickAny(el, label) {
    if (typeof el === 'string') el = await Q.waitFor(() => $(el), 8000);
    if (!el) throw new Error('clickAny: missing ' + label);
    if (Q.stopNow) throw new Error('STOP');
    try { el.scrollIntoView && el.scrollIntoView({ block: 'center' }); } catch (e) {}
    if (typeof el.click === 'function') el.click(); else el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    await Q.wait(60);
  }
  /* A room on the nav bar: click its tab (open More first if it is in the overflow); fall back to PCHost.show. */
  async function goView(v) {
    await Q.closeModals();
    const b = $('.nav button[data-view="' + v + '"]');
    if (b && !b.classList.contains('hidden')) {
      if (b.classList.contains('nav-overflow')) { const more = $('.nav .nav-more'); if (more && !more.classList.contains('hidden') && !$('.nav').classList.contains('open')) await Q.click(more, 'More'); }
      await Q.click(b, 'nav ' + v);
    } else {
      if (b) note('nav tab "' + v + '" hidden on the bar (view not opened by the story yet): used PCHost.show');
      await Q.show(v);
    }
    await Q.waitFor(() => !$('#view-' + v).classList.contains('hidden'), 4000);
    await Q.wait(120);
  }
  function chapterOf(pred) { const ST = window.STORY; return ST ? ST.chapters.filter(c => (c.missions || []).some(pred))[0] : null; }
  function storyEl() { return $('#view-story'); }
  function onPage() { return !!$('#view-story #pg-next') && !$('#view-story').classList.contains('hidden'); }
  function onChapter() { return !!$('#view-story #ch-read') && !$('#view-story').classList.contains('hidden'); }

  /* Open chapter n's screen (missions and the gate) through the Map Room. */
  async function openChapterScreen(n) {
    const p = Q.p(), ST = Q.ST();
    if (!ST.reached(p, n)) throw new Error('chapter ' + n + ' not reached (reachedTo ' + ST.reachedTo(p) + ')');
    if (onChapter() && Number((txt($('#view-story .chapter-head .kicker')).match(/Chapter (\d+)/) || [])[1]) === n) return;
    await goView('plan');
    const direct = $('#view-plan [data-open-ch="' + n + '"]');
    if (direct) await Q.click(direct, 'open chapter ' + n);
    else {
      const node = $('#view-plan .mnode.open[data-ch="' + n + '"]');
      if (node) await clickAny(node, 'map node ' + n); else { note('no map node for chapter ' + n + ' on the Map Room; used Story.open'); window.Story.open(n, 'chapter'); }
    }
    await Q.waitFor(() => !storyEl().classList.contains('hidden'), 4000);
    await Q.wait(100);
    if (onPage()) {
      /* the map node opens the first unseen page; read on to the chapter screen */
      await readPages();
    }
    if (!onChapter()) { window.Story.open(n, 'chapter'); await Q.wait(150); }
    await Q.waitFor(onChapter, 4000);
  }

  /* Read the page on screen, tap the rare word now and then, then Next — until the chapter screen. */
  async function readPages(opts) {
    opts = opts || {};
    let pages = 0, words = 0, cards = 0;
    for (let guard = 0; guard < 40; guard++) {
      if (!onPage()) break;
      const el = storyEl(), body = $('.story-text', el), ev = $('[data-ev]', el), choice = $$('.choice', el);
      const w = wordsOf(txt(body)); words += w; pages++;
      Q.spend(readSecs(w), 'reading');
      const rare = $('.rare-open', el);
      if (rare && Q.chance(opts.rareP != null ? opts.rareP : 0.6)) {
        await Q.click(rare, 'rare word');
        await Q.wait(80);
        const card = $('#modal-slot .modal');
        if (card) { Q.spend(readSecs(Math.min(60, wordsOf(txt(card)))) + 4, 'word card'); cards++; bump('wordCards'); }
        await Q.closeModals();
      }
      if (choice.length) { await Q.click(pick(choice), 'story choice'); Q.spend(5, 'choice'); await Q.wait(100); }
      if (ev && opts.events) { /* the plan runs events as their own rooms */ }
      const next = $('#pg-next', el);
      const last = /missions/i.test(txt(next));
      await Q.click(next, 'page next');
      await Q.wait(90);
      if (last) break;
    }
    return { pages, words, cards };
  }

  /* ============================================================ STORY */
  Q.rooms.storyStart = async function () {
    const p = Q.p(), ST = Q.ST();
    await goView('plan');
    /* the Map Room */
    Q.spend(readSecs(wordsOf(txt($('#view-plan .map-head')))) + 20, 'map room');
    const read = $('#view-plan [data-read-ch="1"]');
    let r = { pages: 0, words: 0, cards: 0 };
    if (read) {
      await Q.click(read, 'Read chapter 1');
      await Q.waitFor(onPage, 4000);
      r = await readPages();
    } else note('Map Room: no "Read chapter 1" button for a fresh student (#view-plan [data-read-ch="1"])');
    if (onChapter()) Q.spend(readSecs(wordsOf(txt($('#view-story .missions')))) + 10, 'missions list');
    /* Your Trunk: explanation level and track */
    await goView('settings');
    Q.spend(25, 'settings');
    const lvl = per().explainLevel || 'B1', tier = per().tier || 'B2';
    const lb = $('#view-settings [data-lvl-set="' + lvl + '"]'); if (lb) await Q.click(lb, 'explain level'); else note('Your Trunk: no [data-lvl-set=' + lvl + ']');
    await Q.wait(80);
    const tb = $('#view-settings [data-tier-set="' + tier + '"]'); if (tb) await Q.click(tb, 'track'); else note('Your Trunk: no [data-tier-set=' + tier + ']');
    await Q.wait(80);
    Q.logLine('trunk: explain ' + (p.explainLevel || '?') + ' track ' + p.tier);
    await goView('plan');
    return { pages: r.pages, words: r.words, cards: r.cards, explain: p.explainLevel, tier: p.tier, returning: ST.returning(p) };
  };

  Q.rooms.storyChapter = async function (a) {
    const n = a.n, p = Q.p(), ST = Q.ST();
    if (!ST.reached(p, n)) { Q.logLine('chapter ' + n + ' not on the map yet'); return { n, pages: 0, words: 0, skipped: 'not reached' }; }
    await goView('plan');
    const direct = $('#view-plan [data-read-ch="' + n + '"]');
    if (direct) await Q.click(direct, 'read chapter ' + n);
    else {
      const node = $('#view-plan .mnode.open[data-ch="' + n + '"]');
      if (node) await clickAny(node, 'map node ' + n); else { note('chapter ' + n + ': no map node'); window.Story.open(n); }
    }
    await Q.waitFor(() => !storyEl().classList.contains('hidden'), 4000);
    await Q.wait(100);
    let r = { pages: 0, words: 0, cards: 0 };
    if (onPage()) r = await readPages();
    else if (onChapter()) {
      /* all pages seen already: look at the missions list */
      Q.spend(readSecs(wordsOf(txt($('#view-story .missions')))), 'missions list');
    }
    bump('storyPages', r.pages);
    return { n, pages: r.pages, words: r.words, cards: r.cards };
  };

  /* The Sorting Lantern (12 items, sorting.js) and the tournament pages. */
  Q.rooms.storyEvent = async function (a) {
    const ev = a.event, p = Q.p(), ST = Q.ST();
    if (ev === 'sorting' || ev === 'house') {
      const s = ST.ensure(p);
      if (s.house) { Q.logLine('already sorted: ' + s.house); return { event: ev, pages: 0, house: s.house }; }
      const chN = a.chapter || 1;
      await openChapterScreen(chN);
      const ms = ST.missions(p, ST.chapterN(chN)), m = ms.filter(x => x.kind === 'event' && (x.event === 'sorting' || x.event === 'house'))[0];
      const row = m ? $('#view-story [data-mi="' + m._i + '"]') : null;
      if (row) await Q.click(row, 'sorting mission'); else { note('chapter ' + chN + ': no sorting mission row; using the house bar'); await goView('plan'); await Q.click('#hb-sort', 'house bar'); }
      if (ev === 'house' || $('#house-sort')) { const hs = $('#house-sort'); if (hs) await Q.click(hs, 'take the twelve questions'); }
      await Q.waitFor(() => $('#sort-go') || $('#sort-done'), 5000);
      if ($('#sort-done')) { await Q.click('#sort-done'); return { event: ev, pages: 0, house: s.house }; }
      Q.spend(readSecs(wordsOf(txt($('#view-story .sorting')))), 'lantern intro');
      await Q.click('#sort-go', 'walk up');
      const items = (window.SORTING && window.SORTING.items) || [];
      let right = 0;
      for (let i = 0; i < items.length; i++) {
        await Q.waitFor(() => { const r = txt($('#view-story .story-right')); return r.indexOf((i + 1) + ' /') === 0 && $$('#view-story .opt:not(:disabled)').length; }, 6000);
        const it = items[i], ok = Q.willAnswerRight({ id: 'sort-' + it.id, level: it.cefr || 'B1' });
        Q.spend(Math.round((per().secPerItem || 35) * rnd(0.6, 1.2)), 'sorting item');
        const k = ok ? it.answer : pick(it.options.map((o, j) => j).filter(j => j !== it.answer));
        if (ok) right++;
        await Q.click($('#view-story .opt[data-k="' + k + '"]'), 'sorting option');
        await Q.wait(520);
      }
      await Q.waitFor(() => $('.tie') || $('#sort-done'), 6000);
      if ($$('.tie').length && !$('#sort-done')) { Q.spend(12, 'tie'); await Q.click(pick($$('.tie')), 'tie pick'); await Q.waitFor(() => $('#sort-done'), 5000); }
      Q.spend(readSecs(wordsOf(txt($('#view-story .sorting.result')))) + 10, 'house result');
      await Q.click('#sort-done', 'continue');
      await Q.closeModals();
      bump('sortRight', right);
      Q.logLine('sorted into ' + s.house + ' (' + right + '/12)');
      return { event: ev, pages: items.length, house: s.house, right };
    }
    if (ev === 'tournament') {
      await goView('plan');
      const b = $('#view-plan [data-open-ev="tournament"]');
      if (!b) { Q.logLine('tournament card not on the map (chapter 5 not cleared)'); return { event: ev, pages: 0, skipped: 'not open' }; }
      await Q.click(b, 'enter tournament');
      await Q.waitFor(() => !storyEl().classList.contains('hidden') && ($('#pg-next') || $('[data-task]')), 4000);
      let pages = 0, words = 0;
      for (let g = 0; g < 10 && $('#view-story #pg-next'); g++) {
        const w = wordsOf(txt($('#view-story .story-text'))); words += w; pages++;
        Q.spend(readSecs(w), 'tournament page');
        await Q.click('#view-story #pg-next', 'next'); await Q.wait(90);
      }
      Q.spend(readSecs(wordsOf(txt($('#view-story .missions')))), 'tasks list');
      const tasks = $$('#view-story [data-task]').length;
      await Q.click('#view-story #st-back', 'back');
      return { event: ev, pages, words, tasks };
    }
    return { event: ev, pages: 0, skipped: 'unknown event' };
  };

  Q.rooms.storyGate = async function (a) {
    const n = a.n, p = Q.p(), ST = Q.ST(), ch = ST.chapterN(n);
    if (!ch) return { n, keepsake: false, skipped: 'no chapter' };
    if (!ST.reached(p, n)) return { n, keepsake: false, skipped: 'not reached' };
    await openChapterScreen(n);
    const g = ST.gateStatus(p, ch);
    if (!g.ok) { const miss = g.items.filter(x => !x.ok).map(x => x.id); Q.logLine('gate ' + n + ' shut: ' + miss.join(', ')); return { n, keepsake: ST.ensure(p).keepsakes.indexOf(ch.keepsake.id) >= 0, blocked: miss }; }
    const had = ST.ensure(p).keepsakes.indexOf(ch.keepsake.id) >= 0;
    const gb = $('#view-story #ch-gate');
    if (!gb) { note('chapter ' + n + ': gate ok but no #ch-gate button'); return { n, keepsake: had, bug: 'no #ch-gate' }; }
    await Q.click(gb, 'pass the gate');
    await Q.waitFor(() => $('#end-claim'), 4000);
    const w = wordsOf(txt($('#view-story .story-page')));
    Q.spend(readSecs(w) + 5, 'ending');
    const rare = $('#view-story .rare-open'); if (rare && Q.chance(0.6)) { await Q.click(rare, 'rare'); Q.spend(12, 'word card'); await Q.closeModals(); }
    await Q.click('#end-claim', 'claim keepsake');
    await Q.wait(150);
    Q.spend(8, 'keepsake');
    await Q.closeModals();
    await Q.wait(150);
    const got = ST.ensure(p).keepsakes.indexOf(ch.keepsake.id) >= 0;
    if (!got) note('chapter ' + n + ': keepsake not recorded after #end-claim');
    return { n, keepsake: got, words: w };
  };

  /* ===================================================== ITEM RUNNER */
  const FREE = { overview: 1, claimnum: 1, para: 1 };
  function domSig() {
    const h = $('#qhost'); if (!h) return null;
    const s = { type: h.dataset.type, stem: nrm(txt($('.stem', h))), given: nrm(txt($('.given-t', h))), passage: nrm(txt($('.passage', h))) };
    s.list = $$('.opts .opt, .segs .seg, .tiles .tile, .rank-pool .rank, .sort-pool .chip-i', h).map(e => nrm(btnText(e))).sort().join('|');
    return s;
  }
  function itemSig(it) {
    const s = { type: it.type, stem: nrm(htmlText(it.stem)), given: nrm(htmlText(it.given)), passage: nrm(htmlText(it.passage)) };
    let list = [];
    if (it.type === 'judge') list = ['true', 'false', "can't tell"];
    else if (it.options) list = it.options.map(htmlText);
    else if (it.words) list = it.words.map(htmlText);
    else if (it.tiles) list = it.tiles.slice();
    else if (it.type === 'order') list = it.items.slice();
    else if (it.type === 'sort') list = it.items.map(x => htmlText(x.text));
    s.list = list.map(nrm).sort().join('|');
    return s;
  }
  function identify(cands) {
    const d = domSig(); if (!d) throw new Error('identify: no #qhost');
    const same = (a, b) => a.type === b.type && a.stem === b.stem && a.given === b.given && a.passage === b.passage;
    let hits = cands.filter(it => { const s = itemSig(it); return same(s, d) && s.list === d.list; });
    if (hits.length === 1) return hits[0];
    if (hits.length > 1) { note('ambiguous items (same text): ' + hits.map(h => h.id).join(',')); return hits[0]; }
    hits = cands.filter(it => same(itemSig(it), d));
    if (hits.length) { note('item matched on stem only (' + hits[0].id + '): list mismatch ' + d.list.slice(0, 80)); return hits[0]; }
    /* last resort: the whole bank */
    const all = Object.values(Q.E().Bank.all()).filter(it => { const s = itemSig(it); return same(s, d) && s.list === d.list; });
    if (all.length) { note('item ' + all[0].id + ' not among expected candidates'); return all[0]; }
    throw new Error('identify: no item matches ' + JSON.stringify(d).slice(0, 300));
  }
  function btnByText(sel, text, used) {
    const want = nrm(text);
    return $$(sel, $('#qhost')).filter(b => !b.disabled && (!used || used.indexOf(b) < 0) && nrm(btnText(b)) === want)[0] || null;
  }
  /* Tile order that spells the solution (DFS on normalised prefixes). */
  function buildOrder(it) {
    const tiles = it.tiles.map(nrm);
    const sols = [it.solution].concat(it.alt || []).map(nrm);
    for (const sol of sols) {
      const dfs = (rem, used) => {
        if (!rem) return used.length === tiles.length ? [] : null;
        for (let i = 0; i < tiles.length; i++) {
          if (used.indexOf(i) >= 0) continue;
          const t = tiles[i];
          if (rem === t || rem.indexOf(t + ' ') === 0) { const r = dfs(rem.slice(t.length).trim(), used.concat(i)); if (r) return [i].concat(r); }
        }
        return null;
      };
      const r = dfs(sol, []); if (r) return r;
    }
    return null;
  }
  function swapTwo(order) {
    const o = order.slice(); if (o.length < 2) return o;
    const i = Math.floor(Q.rand() * (o.length - 1)); const t = o[i]; o[i] = o[i + 1]; o[i + 1] = t; return o;
  }
  async function tap(el, label) { if (!el) throw new Error('tap: missing ' + label); await Q.click(el, label); await Q.wait(30); }

  /* Put the persona's answer (right or wrong) into the item on screen. */
  async function answer(item, right) {
    const h = $('#qhost'), t = item.type;
    if (t === 'choose' || t === 'equiv' || t === 'cloze' || t === 'read' || t === 'table' || t === 'gap' || t === 'judge') {
      const opts = $$('.opts .opt', h), n = opts.length;
      const k = right ? item.answer : pick(opts.map((o, j) => j).filter(j => j !== item.answer));
      if (k >= n) throw new Error('mcq: answer index ' + k + ' of ' + n + ' for ' + item.id);
      await tap(opts[k], 'option');
      return;
    }
    if (t === 'select') {
      const opts = $$('.opts .opt', h);
      let set = item.answers.slice();
      if (!right) { const wrongs = opts.map((o, j) => j).filter(j => set.indexOf(j) < 0); if (wrongs.length) set[Math.floor(Q.rand() * set.length)] = pick(wrongs); }
      for (const k of set) await tap(opts[k], 'select option');
      return;
    }
    if (t === 'spot') {
      const segs = $$('.segs .seg', h);
      const k = right ? item.answer : pick(segs.map((o, j) => j).filter(j => j !== item.answer));
      await tap(segs[k], 'segment');
      return;
    }
    if (t === 'sort') {
      const bins = $$('.sort-bins .sort-bin', h), keys = item.bins.map(b => b.key);
      const target = item.items.map(x => x.bin);
      if (!right) { const n = Q.chance(0.5) ? 1 : 2; for (let z = 0; z < n; z++) { const i = Math.floor(Q.rand() * target.length); target[i] = pick(keys.filter(k => k !== item.items[i].bin)); } }
      const used = [];
      for (let i = 0; i < item.items.length; i++) {
        const chip = btnByText('.sort-pool .chip-i', htmlText(item.items[i].text), used);
        if (!chip) throw new Error('sort: chip not found "' + htmlText(item.items[i].text) + '" in ' + item.id);
        used.push(chip);
        await tap(chip, 'chip');
        await tap(bins[keys.indexOf(target[i])], 'bin');
      }
      return;
    }
    if (t === 'build') {
      let order = buildOrder(item);
      if (!order) throw new Error('build: no tile order spells the solution for ' + item.id);
      if (!right) order = swapTwo(order);
      const used = [];
      for (const idx of order) { const b = btnByText('.tiles .tile', item.tiles[idx], used); if (!b) throw new Error('build: tile missing ' + item.tiles[idx]); used.push(b); await tap(b, 'tile'); }
      return;
    }
    if (t === 'order') {
      let order = item.items.map((x, i) => i);
      if (!right) order = swapTwo(order);
      const used = [];
      for (const idx of order) { const b = btnByText('.rank-pool .rank', item.items[idx], used); if (!b) throw new Error('order: sentence missing ' + item.items[idx]); used.push(b); await tap(b, 'rank'); }
      return;
    }
    if (FREE[t]) {
      const ta = $('textarea.ftext', h);
      const text = ((Q.data || {}).items || {})[item.id];
      if (!text) { note('no persona text for free-text item ' + item.id); }
      const body = text || (t === 'claimnum' ? 'The number go up a lot in the chart in 2020.' : 'Overall the chart show the number go up and some go down. It is more and it is less in the end of the year.');
      Q.spend(Math.round(rnd(25, 60)), 'thinking');
      await Q.type(ta, body, 'free text');
      await Q.wait(80);
      if ($('#p-check').disabled) {
        note('free-text ' + item.id + ': Check stays disabled after ' + wordsOf(body) + ' words (hasResponse needs 12/4 words; nothing tells the student)');
        await Q.type(ta, body + ' It is the same in the end of the time.', 'padding');
      }
      return;
    }
    throw new Error('answer: unknown type ' + t);
  }

  /* Run the questions on screen (module / check / faults) to the result screen. */
  async function runItems(kind, cands, opts) {
    opts = opts || {};
    const results = []; let hints = 0;
    for (let guard = 0; guard < 60; guard++) {
      await Q.waitFor(() => ($('#qhost') && $('#qhost').children.length && $('#p-check')) || $('#view-play .result .score-ring'), 8000);
      if ($('#view-play .result .score-ring')) break;
      const item = identify(cands);
      const right = FREE[item.type] ? true : Q.willAnswerRight(item);
      let hinted = false;
      if (!right && opts.hints && $('#p-hint') && Q.chance(per().hintP || 0)) { await Q.click('#p-hint', 'hint'); hinted = true; hints++; Q.spend(Math.round(rnd(6, 14)), 'hint'); }
      if (!FREE[item.type]) Q.spend(Math.round((per().secPerItem || 35) * rnd(0.7, 1.3) * (item.chart ? 1.3 : 1)), 'item');
      await answer(item, right);
      await Q.waitFor(() => !$('#p-check').disabled, 4000);
      await Q.click('#p-check', 'check');
      await Q.waitFor(() => $('#feedback .verdict'), 4000);
      const ok = !!$('#feedback .verdict.ok');
      if (!FREE[item.type] && ok !== right) note('answer mapping: expected ' + (right ? 'right' : 'wrong') + ' got ' + (ok ? 'right' : 'wrong') + ' on ' + item.id + ' (' + item.type + ')');
      if (FREE[item.type]) { Q.stats.extra.freeText = Q.stats.extra.freeText || {}; Q.stats.extra.freeText[item.id] = ok; }
      results.push({ id: item.id, type: item.type, ok, hinted });
      Q.spend(Math.round(ok ? rnd(8, 14) : rnd(12, 20)), 'feedback');
      const btn = $('#p-check'), last = /result/i.test(txt(btn));
      await Q.click(btn, 'next');
      await Q.wait(80);
      if (last) { await Q.waitFor(() => $('#view-play .result .score-ring'), 5000); break; }
    }
    const correct = results.filter(r => r.ok).length;
    const score = results.length ? correct / results.length : 0;
    const ring = parseInt(txt($('#view-play .result .score-ring i')), 10);
    if (!isNaN(ring) && Math.round(score * 100) !== ring) note('result ring ' + ring + '% differs from counted ' + Math.round(score * 100) + '%');
    Q.spend(Math.round(rnd(10, 25)), 'result');
    return { results, correct, score, hints, n: results.length };
  }

  async function openLesson(subId) {
    const E = Q.E(), ST = Q.ST(), p = Q.p(), sub = E.Bank.sub(subId);
    if (!sub) throw new Error('no sub ' + subId);
    await Q.closeModals();
    const ch = chapterOf(m => m.kind === 'sub' && m.id === subId);
    let opened = false;
    if (ch && ST.reached(p, ch.n)) {
      try {
        await openChapterScreen(ch.n);
        const m = ST.missions(p, ch).filter(x => x.kind === 'sub' && x.id === subId)[0];
        const row = m ? $('#view-story [data-mi="' + m._i + '"]') : null;
        if (row && !row.disabled) {
          await Q.click(row, 'mission ' + subId); await Q.wait(150);
          /* story.js:830 looks the row up in the FILTERED mission list by the UNFILTERED index, so a row can open the wrong mission */
          const h3 = txt($('#view-play .theory h3'));
          if ($('#view-play #p-start') && h3 === htmlText(sub.name)) opened = true;
          else {
            note('BUG story.js:830 chapter ' + ch.n + ' row [data-mi=' + m._i + '] "' + sub.name + '" opened "' + (h3 || ($('#qhost') ? 'a question run' : 'nothing')) + '" — went via Classes instead');
            if ($('#view-play #p-back')) await Q.click('#view-play #p-back', 'back'); else if ($('#view-play #p-quit')) await Q.click('#view-play #p-quit', 'quit');
            await Q.wait(120);
          }
        }
      } catch (e) { Q.logLine('chapter route failed: ' + e.message); }
    }
    if (!opened) {
      await goView('map');
      if (!$('#view-map [data-sub="' + subId + '"]')) await Q.click($('#view-map [data-sys="' + sub.topicId + '"]'), 'class ' + sub.topicId);
      await Q.click(await Q.waitFor(() => $('#view-map [data-sub="' + subId + '"]'), 4000), 'classes row ' + subId);
    }
    await Q.waitFor(() => $('#view-play #p-start'), 5000);
  }

  Q.rooms.lesson = async function (a) {
    const subId = a.subId, E = Q.E(), p = Q.p(), sub = E.Bank.sub(subId);
    await openLesson(subId);
    /* the explanation at her level */
    const want = per().explainLevel || 'C1';
    const cur = $('#view-play .prose') && $('#view-play .prose').dataset.explainLevel;
    if (cur && cur !== want && $('#view-play [data-lvl="' + want + '"]')) { await Q.click($('#view-play [data-lvl="' + want + '"]'), 'level ' + want); await Q.wait(120); }
    const lvlShown = $('#view-play .prose') && $('#view-play .prose').dataset.explainLevel;
    if (lvlShown !== want) note('lesson ' + subId + ': explanation shown at ' + lvlShown + ' though ' + want + ' was chosen');
    const theory = $('#view-play .theory');
    Q.spend(readSecs(wordsOf(txt(theory))), 'explanation');
    let tries = 0, hints = 0, score = 0, passed = false;
    await Q.click('#p-start', 'start questions');
    for (;;) {
      tries++;
      const r = await runItems('module', sub.items, { hints: true });
      hints += r.hints; score = r.score; passed = score >= E.PASS_SUB;
      Q.logLine('lesson ' + subId + ' try ' + tries + ': ' + r.correct + '/' + r.n + (passed ? ' passed' : ' failed') + (r.hints ? ' hints ' + r.hints : ''));
      if (passed || tries >= (a.maxTries || 4)) break;
      await Q.closeModals();
      const again = $('#r-again'); if (!again) { note('result screen without #r-again'); break; }
      await Q.click(again, 'try again');
      Q.spend(Math.round(rnd(20, 60)), 'reread before retry');
    }
    await Q.closeModals();
    const back = $('#r-map'); if (back) await Q.click(back, 'back');
    await Q.wait(100); await Q.closeModals();
    bump('lessonTries', tries); bump('hints', hints);
    const rec = p.subs[subId] || {};
    return { subId, score: Math.round(score * 100) / 100, passed, tries, hints, best: rec.best };
  };

  Q.rooms.gate = async function (a) {
    const levelId = a.levelId, E = Q.E(), ST = Q.ST(), p = Q.p(), lv = E.Bank.level(levelId);
    if (!lv) throw new Error('no level ' + levelId);
    await Q.closeModals();
    if (!E.Progress.checkUnlocked(p, lv)) { Q.logLine('gate ' + levelId + ' locked: lessons not passed'); return { levelId, score: 0, passed: false, tries: 0, locked: true }; }
    const ch = chapterOf(m => m.kind === 'check' && m.id === levelId);
    let opened = false;
    if (ch && ST.reached(p, ch.n)) {
      try {
        await openChapterScreen(ch.n);
        const m = ST.missions(p, ch).filter(x => x.kind === 'check' && x.id === levelId)[0];
        const row = m ? $('#view-story [data-mi="' + m._i + '"]') : null;
        if (row && !row.disabled) {
          await Q.click(row, 'gate mission ' + levelId); await Q.wait(150);
          /* story.js:830 index bug (see openLesson): make sure a gate of THIS level is on screen before answering */
          let okRun = false;
          if ($('#qhost') && !$('#view-play #p-start') && new RegExp('/ ' + lv.check.items.length + '$').test(txt($('#view-play .qcount')))) {
            try { const it = identify(lv.check.items); okRun = lv.check.items.indexOf(it) >= 0; } catch (e) {}
          }
          if (okRun) opened = true;
          else {
            note('BUG story.js:830 chapter ' + ch.n + ' gate row [data-mi=' + m._i + '] ' + levelId + ' opened ' + ($('#view-play #p-start') ? '"' + txt($('#view-play .theory h3')) + '"' : 'another run') + ' — went via Classes instead');
            if ($('#view-play #p-back')) await Q.click('#view-play #p-back', 'back'); else if ($('#view-play #p-quit')) await Q.click('#view-play #p-quit', 'quit');
            await Q.wait(120);
          }
        } else if (row) note('gate row for ' + levelId + ' disabled although checkUnlocked is true');
      } catch (e) { Q.logLine('chapter route failed: ' + e.message); }
    }
    if (!opened) {
      await goView('map');
      if (!$('#view-map [data-check="' + levelId + '"]')) await Q.click($('#view-map [data-sys="' + lv.topicId + '"]'), 'class ' + lv.topicId);
      const row = await Q.waitFor(() => $('#view-map [data-check="' + levelId + '"]'), 4000);
      if (row.disabled) throw new Error('gate row disabled ' + levelId);
      await Q.click(row, 'classes gate ' + levelId);
    }
    let tries = 0, score = 0, passed = false;
    for (;;) {
      tries++;
      const r = await runItems('check', lv.check.items, { hints: false });
      score = r.score; passed = score >= E.PASS_CHECK;
      if (r.hints) note('a hint button appeared in a gate');
      Q.logLine('gate ' + levelId + ' try ' + tries + ': ' + r.correct + '/' + r.n + (passed ? ' passed' : ' failed'));
      if (passed || tries >= (a.maxTries || 5)) break;
      await Q.closeModals();
      const again = $('#r-again'); if (!again) { note('gate result without #r-again'); break; }
      await Q.click(again, 'try again');
      Q.spend(Math.round(rnd(30, 90)), 'rest before retry');
    }
    await Q.closeModals();
    const back = $('#r-map'); if (back) await Q.click(back, 'back');
    await Q.wait(100); await Q.closeModals();
    bump('gateTries', tries);
    return { levelId, score: Math.round(score * 100) / 100, passed, tries };
  };

  /* ======================================================= MENDING ROOM */
  Q.rooms.mend = async function (a) {
    const target = a.target || 0, E = Q.E(), p = Q.p();
    let mended = 0, runs = 0;
    await goView('faults');
    Q.spend(readSecs(Math.min(120, wordsOf(txt($('#view-faults'))))), 'mending room');
    for (let guard = 0; guard < 8; guard++) {
      const due = E.Progress.dueReview(p);
      const go = $('#view-faults #fx-go');
      if (!go || due.length <= target) break;
      const cands = due.map(E.Bank.item).filter(Boolean);
      await Q.click(go, 'mend now');
      const r = await runItems('faults', cands, { hints: true });
      runs++; mended += r.correct;
      Q.logLine('mend run ' + runs + ': ' + r.correct + '/' + r.n);
      await Q.closeModals();
      const back = $('#r-map'); if (back) await Q.click(back, 'back to the mending room');
      await Q.wait(120); await Q.closeModals();
      if (!$('#view-faults') || $('#view-faults').classList.contains('hidden')) await goView('faults');
    }
    bump('mendRuns', runs);
    return { mended, due: E.Progress.dueReview(p).length, runs, reclaimed: p.reclaimed || 0 };
  };

  /* ===================================================== EXEMPLAR ARCHIVE */
  Q.rooms.models = async function () {
    const C = window.CONTENT, p = Q.p();
    await goView('models');
    Q.spend(readSecs(wordsOf(txt($('#view-models .sect-h')))), 'archive intro');
    const cards = $$('#view-models [data-m]');
    if (!cards.length) { note('Exemplar Archive: no model cards'); return { opened: 0 }; }
    const card = pick(cards.slice(0, 6)), mid = card.dataset.m;
    await Q.click(card, 'model ' + mid);
    await Q.waitFor(() => $('#view-models #m-back'), 4000);
    const model = (C.MODELS || []).filter(m => m.id === mid)[0];
    Q.spend(readSecs(wordsOf(txt($('#view-models .model')))) + 20, 'read model');
    /* dissect: tap the role of each paragraph */
    const dis = $('#view-models [data-mm="dissect"]');
    let right = 0, taps = 0;
    if (dis && model) {
      await Q.click(dis, 'dissect');
      await Q.waitFor(() => $$('#view-models .mpara.hide').length, 3000);
      const roles = ['intro', 'overview', 'detail'];
      for (let i = 0; i < model.paragraphs.length; i++) {
        const want = model.paragraphs[i].role;
        Q.spend(Math.round(rnd(10, 25)), 'dissect');
        let ok = Q.chance((per().acc || {}).B2 != null ? per().acc.B2 : 0.6);
        let role = ok ? want : pick(roles.filter(r => r !== want));
        const b = $('#view-models [data-role="' + role + '"][data-i="' + i + '"]'); if (!b) break;
        await Q.click(b, 'role'); taps++;
        if (!ok) { Q.spend(6, 'second tap'); const b2 = $('#view-models [data-role="' + want + '"][data-i="' + i + '"]'); if (b2) { await Q.click(b2, 'role again'); taps++; } }
        right++;
      }
      Q.logLine('dissect: ' + txt($('#m-score')));
    } else note('Exemplar Archive: no Dissect mode button');
    await Q.click('#view-models #m-back', 'back to archive');
    return { opened: 1, model: mid, dissectTaps: taps, visited: !!Q.ST().ensure(p).visited.models };
  };

  /* ========================================================= REPORT CARD */
  Q.rooms.record = async function () {
    await goView('record');
    await Q.wait(400);
    try { await Q.waitFor(() => !/Loading/.test(txt($('#rec-list'))), 4000); } catch (e) { note('Report Card: report list still "Loading…" after 4 s'); }
    Q.spend(60, 'report card');
    const reports = $$('#view-record .rep').length;
    const keeps = $$('#view-record .keep.got').length, awards = $$('#view-record .award.got').length;
    return { reports, keepsakes: keeps, awards };
  };

  /* =========================================================== SMOKE */
  Q.smokeArgs = { lesson: { subId: 'm00s1' }, gate: { levelId: 'm00l1' }, storyChapter: { n: 1 }, storyEvent: { event: 'sorting', chapter: 1 }, mend: { target: 0 }, models: {}, record: {}, storyStart: {}, storyGate: { n: 1 } };
  /* the three lessons, then the gate */
  Q.rooms.smokeGate = async function () {
    const out = [];
    for (const s of ['m00s1', 'm00s2', 'm00s3']) out.push(await Q.rooms.lesson({ subId: s }));
    out.push(await Q.rooms.gate({ levelId: 'm00l1' }));
    return { steps: out.map(r => (r.subId || r.levelId) + ':' + Math.round(r.score * 100) + (r.passed ? '✓' : '✕')) };
  };
  /* chapter 1 end to end: start, sorting, m00 + m01, the gate and the keepsake */
  Q.rooms.smokeStoryGate = async function () {
    const out = [];
    out.push(await Q.rooms.storyStart({}));
    out.push(await Q.rooms.storyEvent({ event: 'sorting', chapter: 1 }));
    for (const m of ['m00', 'm01']) {
      for (const k of ['s1', 's2', 's3']) out.push(await Q.rooms.lesson({ subId: m + k }));
      out.push(await Q.rooms.gate({ levelId: m + 'l1' }));
    }
    out.push(await Q.rooms.storyGate({ n: 1 }));
    return { steps: out.length, keepsake: out[out.length - 1].keepsake, gates: out.filter(r => r.levelId).map(r => r.levelId + ':' + r.score + (r.passed ? '✓' : '✕')) };
  };
  /* lessons until faults exist, sleep to the next day, then mend */
  Q.rooms.smokeMend = async function () {
    const E = Q.E(), p = Q.p();
    for (const s of ['m00s1', 'm00s2', 'm00s3', 'm01s1']) { await Q.rooms.lesson({ subId: s }); if (Object.keys(p.review).length >= 5) break; }
    const d0 = Q.dayN; while (Q.dayN === d0) Q.spend(600, 'home');
    await goView('plan');
    const due = E.Progress.dueReview(p).length;
    const r = await Q.rooms.mend({ target: 0 });
    return Object.assign({ dueBefore: due }, r);
  };
  /* Every lesson and every gate in the app, through the Classes list; asserts the DOM→answer mapping. */
  Q.rooms.itemsAudit = async function (a) {
    a = Object.assign({}, a || {}, (Q.data && Q.data.audit) || {});
    const E = Q.E(), C = window.CONTENT, out = [], bad = [];
    if (a.force) { Q.willAnswerRight = () => true; Q.logLine('audit: every answer forced right (the 0.97 cap is off)'); }
    const topics = a && a.topics ? C.TOPICS.filter(t => a.topics.indexOf(t.id) >= 0) : C.TOPICS;
    for (const t of topics) {
      const lv = t.levels[0];
      for (const s of lv.subs) {
        const r = await Q.rooms.lesson({ subId: s.id, maxTries: a && a.maxTries || 4 });
        out.push(s.id + ':' + Math.round(r.score * 100)); if (a && a.expect === 1 && r.score < 1) bad.push(s.id + ':' + r.score);
      }
      const g = await Q.rooms.gate({ levelId: lv.id, maxTries: a && a.maxTries || 5 });
      out.push(lv.id + ':' + Math.round(g.score * 100) + (g.locked ? 'L' : '')); if (a && a.expect === 1 && g.score < 1) bad.push(lv.id + ':' + g.score);
    }
    Q.stats.extra.audit = out; Q.stats.extra.auditBad = bad;
    if (bad.length) throw new Error('itemsAudit: not 100%: ' + bad.join(' '));
    return { runs: out.length, bad: bad.length, out: out.join(' ') };
  };
  Q.smokeArgs.smokeGate = {}; Q.smokeArgs.smokeStoryGate = {}; Q.smokeArgs.smokeMend = {}; Q.smokeArgs.itemsAudit = { expect: 0 };
})();
