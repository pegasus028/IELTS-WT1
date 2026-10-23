/* ===========================================================================
   QUILLMOOR ACADEMY · THE OBSERVATORY — companion-engine.js   (WS-J, Oct 2026)
   The Grammar Wing: three companion classes imported from T.Chris's grammar
   apps, which run on the same Mission Control engine family —
     Departure Board  (comparatives & superlatives)  → Module 15 "Comparing"
     Postcards & Plans (tense & aspect)              → Module 16 "Tense by the Dates"
     Voice Control    (the passive)                  → Module 17 "Active or Passive"
   This file EXTENDS the Observatory engine without changing any existing id
   or behaviour. It is loaded after engine.js and lesson-levels.js.

   What it adds
   · Renderers the Observatory lacked, ported from the three engines:
       pick   {shop, items:[{name,price,note}], stem, answer}   choose one card
       gap    {lines, accept:[]}  the TYPED dialogue gap (an MCQ gap with
              options[] already renders in engine.js and is left alone)
       spot   with `also` — other chunks that point at the same mistake and
              are marked right too (Postcards & Plans)
     equiv / table / cloze / gap-with-options already exist in engine.js as
     MCQ views, so they are not re-implemented.
   · TYPE_LABEL entries for the new types.
   · A small registry (window.Companion) the student view, the tests and the
     Staff Room can ask: which modules are companion classes, which source
     app each came from, and whether an item renders here.
   Everything is ES5 (no arrows, let/const, template literals).
   =========================================================================== */
(function (global) {
  'use strict';
  var E = global.Engine;
  var C = global.CONTENT || {};

  /* ---------------------------------------------------------- registry */
  var MODULES = {
    m15: { source: 'departure-board', app: 'Departure Board', url: 'https://pegasus028.github.io/Comparatives/', what: 'comparatives and superlatives' },
    m16: { source: 'postcards-plans', app: 'Postcards & Plans', url: 'https://pegasus028.github.io/Tenses/', what: 'tense and aspect' },
    m17: { source: 'voice-control', app: 'Voice Control', url: 'https://pegasus028.github.io/Passive/', what: 'the passive' }
  };
  var TYPES = ['pick', 'gap', 'spot'];
  function isCompanion(moduleId) { return !!MODULES[moduleId]; }
  function moduleOfItem(itemId) { var m = /^(m1[5-7])/.exec(String(itemId || '')); return m ? m[1] : ''; }

  if (!E) {
    /* Loaded without the engine (a test harness): expose the registry only. */
    global.Companion = { MODULES: MODULES, TYPES: TYPES, isCompanion: isCompanion, moduleOfItem: moduleOfItem, wrapped: false };
    return;
  }

  var el = E.el, esc = E.esc, shuffle = E.shuffle, norm = E.norm;
  function respond(host) { host.dispatchEvent(new CustomEvent('respond', { bubbles: true })); }

  /* The stem block, the same way engine.js draws it: chart, given, dialogue
     lines, table, then the stem. engine.js keeps renderStem private, so this
     mirrors the parts the companion items use. */
  function renderStem(host, item) {
    if (item.chart) {
      var ch = el('div', 'qchart');
      host.appendChild(ch);
      try { global.Charts.render(ch, item.chart, { compact: true, showRubric: true }); } catch (e) { ch.innerHTML = ''; }
    }
    if (item.given) {
      var g = el('div', 'given');
      g.innerHTML = '<span class="given-k">Given</span><span class="given-t">' + item.given + '</span>';
      host.appendChild(g);
    }
    if (item.lines) {
      var d = el('div', 'dialogue');
      item.lines.forEach(function (l) {
        var row = el('div', 'dline');
        row.appendChild(el('span', 'who', esc(l.who)));
        row.appendChild(el('span', 'said', esc(String(l.text)).replace(/___/g, '<span class="blank">?</span>')));
        d.appendChild(row);
      });
      host.appendChild(d);
    }
    if (item.table) {
      var sc = el('div', 'tbl-scroll'), t = el('table', 'tbl'), thead = el('thead'), hr = el('tr');
      item.table.cols.forEach(function (c) { hr.appendChild(el('th', null, esc(c))); });
      thead.appendChild(hr); t.appendChild(thead);
      var tb = el('tbody');
      item.table.rows.forEach(function (row) {
        var tr = el('tr');
        row.forEach(function (cell, i) { tr.appendChild(el('td', i ? 'num' : null, esc(cell))); });
        tb.appendChild(tr);
      });
      t.appendChild(tb); sc.appendChild(t); host.appendChild(sc);
    }
    if (item.shop) host.appendChild(el('div', 'shop-head', esc(item.shop)));
    if (item.stem) host.appendChild(el('p', 'stem', item.stem));
  }

  var RENDER = {
    /* Departure Board / Postcards & Plans: a shelf of cards; tap the one the
       instruction points at. Cards are shuffled on screen; the answer index
       refers to the authored order. */
    pick: function (host, item) {
      renderStem(host, item);
      var chosen = -1, cards = [];
      var grid = el('div', 'shelf');
      shuffle(item.items.map(function (p, i) { return i; })).forEach(function (i) {
        var p = item.items[i];
        var c = el('button', 'goods');
        c.type = 'button';
        c.setAttribute('data-i', String(i));
        c.innerHTML = '<span class="goods-n">' + esc(p.name) + '</span>' +
          (p.price ? '<span class="goods-p">' + esc(p.price) + '</span>' : '') +
          (p.note ? '<span class="goods-x">' + esc(p.note) + '</span>' : '');
        c.addEventListener('click', function () {
          if (grid.dataset.locked) return;
          chosen = i;
          cards.forEach(function (x, j) { x.classList.toggle('sel', j === i); });
          respond(host);
        });
        cards[i] = c; grid.appendChild(c);
      });
      host.appendChild(grid);
      return {
        response: function () { return chosen; },
        hasResponse: function () { return chosen >= 0; },
        check: function () {
          return { correct: chosen === item.answer, givenText: chosen >= 0 ? item.items[chosen].name : '(no answer)', expectedText: item.items[item.answer].name };
        },
        lock: function (opts) {
          var hide = !!(opts && opts.hideKey);
          grid.dataset.locked = '1';
          cards.forEach(function (c, i) {
            c.disabled = true;
            if (i === item.answer && (!hide || i === chosen)) c.classList.add('right');
            else if (i === chosen) c.classList.add('wrong');
          });
        }
      };
    },

    /* A typed gap: {lines, accept:[]} — the student types the missing words.
       Marked against every accepted answer after the engine's norm(). */
    gapTyped: function (host, item) {
      renderStem(host, item);
      var inp = el('input', 'typed');
      inp.type = 'text'; inp.autocomplete = 'off'; inp.autocapitalize = 'off'; inp.spellcheck = false;
      inp.placeholder = 'Type your answer';
      inp.id = 'gap-' + item.id;
      inp.setAttribute('aria-label', 'Your answer');
      host.appendChild(inp);
      inp.addEventListener('input', function () { respond(host); });
      return {
        response: function () { return inp.value; },
        hasResponse: function () { return inp.value.trim().length > 0; },
        check: function () {
          var ok = (item.accept || []).some(function (a) { return norm(a) === norm(inp.value); });
          return { correct: ok, givenText: inp.value || '(no answer)', expectedText: (item.accept || [])[0] || '' };
        },
        lock: function (opts) {
          var hide = !!(opts && opts.hideKey);
          inp.disabled = true;
          var ok = (item.accept || []).some(function (a) { return norm(a) === norm(inp.value); });
          inp.classList.add(ok ? 'right' : 'wrong');
          if (!hide && !ok) host.appendChild(el('div', 'fixnote', '<strong>Answer:</strong> ' + esc((item.accept || [])[0] || '')));
        }
      };
    },

    /* spot with `also`: the authored answer and any index in item.also are
       both right (e.g. "have" or "last summer" in "have stayed … last summer").
       Behaviour for items without `also` is unchanged (they never reach here). */
    spotAlso: function (host, item) {
      renderStem(host, item);
      var chosen = -1, toks = [];
      var line = el('div', 'segs');
      function ok(i) { return i === item.answer || (item.also || []).indexOf(i) >= 0; }
      item.words.forEach(function (w, i) {
        var b = el('button', 'seg');
        b.type = 'button';
        b.innerHTML = '<span class="seg-n">' + (i + 1) + '</span>' + esc(w);
        b.addEventListener('click', function () {
          if (line.dataset.locked) return;
          chosen = i;
          toks.forEach(function (x, j) { x.classList.toggle('sel', j === i); });
          respond(host);
        });
        toks.push(b); line.appendChild(b);
      });
      host.appendChild(line);
      return {
        response: function () { return chosen; },
        hasResponse: function () { return chosen >= 0; },
        check: function () {
          return {
            correct: ok(chosen),
            givenText: chosen >= 0 ? '(' + (chosen + 1) + ') ' + item.words[chosen] : '(no answer)',
            expectedText: '(' + (item.answer + 1) + ') ' + item.words[item.answer] + ' → ' + item.fix
          };
        },
        lock: function (opts) {
          var hide = !!(opts && opts.hideKey);
          line.dataset.locked = '1';
          toks.forEach(function (b, i) {
            b.disabled = true;
            if (ok(i) && (!hide || i === chosen)) b.classList.add('right');
            else if (i === chosen) b.classList.add('wrong');
          });
          if (hide && !ok(chosen)) return;
          host.appendChild(el('div', 'fixnote', '<strong>(' + (item.answer + 1) + ')</strong> ' + esc(item.words[item.answer]) + ' &nbsp;→&nbsp; ' + esc(item.fix)));
        }
      };
    }
  };

  /* Which companion renderer handles this item, or null to let engine.js do it. */
  function handler(item) {
    if (!item) return null;
    if (item.type === 'pick') return RENDER.pick;
    if (item.type === 'gap' && !item.options && item.accept) return RENDER.gapTyped;
    if (item.type === 'spot' && item.also && item.also.length) return RENDER.spotAlso;
    return null;
  }

  /* Wrap Engine.mount: companion items first, everything else exactly as before. */
  var origMount = E.mount;
  E.mount = function (item, host) {
    var fn = handler(item);
    if (!fn) return origMount(item, host);
    host.innerHTML = '';
    host.dataset.type = item.type;
    return fn(host, item);
  };

  E.TYPE_LABEL.pick = E.TYPE_LABEL.pick || 'Follow the instruction';
  E.TYPE_LABEL.gap = E.TYPE_LABEL.gap || 'Fill the gap in the conversation';
  E.TYPE_LABEL.equiv = E.TYPE_LABEL.equiv || 'Choose the closest meaning';
  E.TYPE_LABEL.table = E.TYPE_LABEL.table || 'Read the table';
  E.TYPE_LABEL.cloze = E.TYPE_LABEL.cloze || 'Fill the gap in the text';

  global.Companion = {
    MODULES: MODULES, TYPES: TYPES, isCompanion: isCompanion, moduleOfItem: moduleOfItem,
    handles: function (item) { return !!handler(item); },
    /* every companion module present in the bank, in order */
    modules: function () { return (C.TOPICS || []).filter(function (t) { return isCompanion(t.id); }); },
    wrapped: true
  };
})(window);
