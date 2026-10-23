/* ===========================================================================
   QUILLMOOR ACADEMY · THE OBSERVATORY — assembly.js  (WS-B, Assembly v2)
   The in-class team games ("the Assembly"): one round engine shared by the
   Staff Room projector (teacher.html → Projector) and the student console
   (index.html#live). Content comes from assembly-content.js (generated from
   WS-D's vw2-games.json by tools/assembly-sync.js) and the prompt bank.

   ROUND TYPES (phase 1)                                     game(s)
     choice     timed cards, one pick per question per team   Mode Sort, Overview or Not (judge)
     post       free text, teacher-judged (+1 / −1)           Group Them!, Paraphrase Relay (+ relay checks)
     datapost   free text, every figure / year checked         Number Hunt, Slice It, Table Detective
                against the chart with the Workshop data check (✓ exact or approximated · ≈ close · ✗ wrong)
     bid        team wagers 1–3, posts one sentence, reveal    Twice As Much
     checklist  10 ticks per script vs the teacher's key       Examiner's Chair
   Phase-2 types (chain, variables, tournament, relay) plug into TYPES below.

   WIRE PROTOCOL — the existing `projector` action and Projector sheet, nothing new:
     kind 'round'  (teacher)  { round, game, promptId, minutes, asm:{ v:1, gameId, ri, type, promptId, seconds, flash, answer } }
     kind 'state'  (teacher)  { round, phase:'lobby'|'run'|'reveal'|'closed', t0, marks:{postId:{pattern,wrong}}, ts }  — latest wins
     kind 'post'   (student)  { id, round, team, studentId, text, ts }  — structured answers travel INSIDE text as
                              JSON '{"asm":"choice",…}' because Code.gs keeps only those fields for a student post.
   Team points → Assembly.gs (asm.points / asm.tally / asm.houses, sheet Teams) through ASM-HOOK; offline → cc.asm.v1.
   Browser file: ES5 only.
   =========================================================================== */
(function (global) {
  'use strict';

  var E = global.Engine, CH = global.Charts, W = global.Writer;
  var esc = function (s) { return E && E.esc ? E.esc(s) : String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  function $(s, root) { return (root || document).querySelector(s); }
  function $$(s, root) { return Array.prototype.slice.call((root || document).querySelectorAll(s)); }
  function uid(pre) { return (pre || 'A') + Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }
  function mmss(sec) { sec = Math.max(0, Math.round(sec)); var m = Math.floor(sec / 60), s = sec % 60; return m + ':' + (s < 10 ? '0' : '') + s; }
  function lower(s) { return String(s || '').toLowerCase(); }
  function shuffled(arr, seed) {
    var a = arr.slice(), s = (seed || 7) >>> 0;
    for (var i = a.length - 1; i > 0; i--) { s = (s * 1103515245 + 12345) >>> 0; var j = s % (i + 1), t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }
  function content() { return global.ASSEMBLY_CONTENT || { version: '', games: {}, teams: [] }; }
  function promptOf(id) { if (!id) return null; if (typeof id === 'object') return id; return (CH && CH.prompt && CH.prompt(id)) || ((global.CONTENT && global.CONTENT.PROMPTS) || []).filter(function (p) { return p.id === id; })[0] || null; }
  function teams() { return content().teams || []; }
  function teamOf(name) { var k = lower(name).replace(/\s+/g, ' ').trim(); return teams().filter(function (t) { return lower(t.name) === k || String(t.n) === k || 'team' + t.n === k.replace(/\s/g, ''); })[0] || null; }
  function normTeam(name) { var t = teamOf(name); return t ? t.name : String(name || '').trim().slice(0, 40); }

  /* ====================================================================
     1. CONTENT → ROUNDS
     A game is one or more rounds. rounds(gameId) → [{ ri, type, title, seconds, promptId, … }]
     ==================================================================== */
  var LEGACY = [
    { gameId: 'free-post', name: 'Free post round', roundType: 'post', rules: 'Any chart, any task you set aloud. Teams post; you judge with +1 / −1.' },
    { gameId: 'free-datapost', name: 'Free data-checked round', roundType: 'post-datacheck', rules: 'Any chart. Every figure and year in a post is checked against the data: ✓ ≈ ✗.' },
    { gameId: 'fix-band6', name: 'Fix the Band 6', roundType: 'post', rules: 'Shows the Band 6 contrast script; teams post the upgraded overview, then the upgraded detail paragraph.', script: 'contrast' }
  ];
  function gameList() {
    var g = content().games, out = [];
    Object.keys(g).forEach(function (k) { if (g[k].roundType !== 'paper') out.push(g[k]); });
    LEGACY.forEach(function (l) { out.push(l); });
    return out;
  }
  function game(id) { return content().games[id] || LEGACY.filter(function (l) { return l.gameId === id; })[0] || null; }
  var MODES = ['TREND', 'COMPARE', 'SEQUENCE', 'SPACE'];
  var DEF_SEC = { choice: 0, post: 180, datapost: 240, bid: 120, checklist: 180 };
  function rounds(gameId) {
    var g = game(gameId); if (!g) return [];
    var base = { gameId: g.gameId, game: g.name, lesson: g.lesson || '', tags: g.tags || [] };
    function mk(o) { for (var k in base) if (base.hasOwnProperty(k) && o[k] == null) o[k] = base[k]; return o; }
    switch (g.roundType) {
      case 'choice': {
        var flash = g.flashSeconds || 5, answer = 10;
        var cards = (g.cards || []).map(function (c, i) {
          return { n: c.n || i + 1, promptId: c.promptId, chart: true, flash: flash, answer: answer, late: -1, note: c.note || '', trap: !!c.trap, trapNote: c.trapNote || '', tense: c.tense || '',
            qs: [{ key: 'mode', label: 'Mode', options: MODES, accept: [c.mode].concat(c.acceptAlso || []), pts: 2 },
                 { key: 'unit', label: 'Unit', options: shuffled(c.unitOptions || [c.unit], 31 + i), accept: [c.unit], pts: 1 }] };
        });
        return [mk({ ri: 0, type: 'choice', title: g.name, cards: cards, seconds: cards.length * (flash + answer), flash: flash, answer: answer, debrief: (g.key || {}).debrief || '', promptId: cards.length ? cards[0].promptId : '' })];
      }
      case 'judge': {
        var sec = g.cardSeconds || 20, labels = g.labels || [], thai = g.labelsThai || {};
        var jc = (g.cards || []).map(function (c, i) {
          return { n: c.n || i + 1, text: c.text, chart: false, flash: 0, answer: sec, late: 0, why: c.why || '', borderline: !!c.borderline, promptId: c.chart || '',
            qs: [{ key: 'label', label: 'Your verdict', options: labels, notes: thai, accept: [c.label], pts: 1 }] };
        });
        return [mk({ ri: 0, type: 'choice', title: g.name, cards: jc, seconds: jc.length * sec, flash: 0, answer: sec, debrief: (g.key || {}).rule || '', promptId: '' })];
      }
      case 'post': {
        if (g.rounds) return g.rounds.map(function (r, i) {
          return mk({ ri: i, type: 'post', check: 'relay', title: g.name + ' · Round ' + (r.n || i + 1) + ' · ' + (r.visual || ''), seconds: g.roundSeconds || DEF_SEC.post, promptId: r.promptId, relay: r, key: g.key || {}, task: 'Write the whole P1 (about 30 words) in your own words: visual + what + where + when + units.' + (r.c1Twist ? ' C1: ' + r.c1Twist : '') });
        });
        return [mk({ ri: 0, type: 'post', title: g.name, seconds: g.roundSeconds || DEF_SEC.post, promptId: g.promptId || '', key: g.key || {}, script: g.script || '', task: g.gameId === 'group-them' ? 'Post the two groups for P3 and P4, and one sentence on why.' : '' })];
      }
      case 'post-datacheck':
        return [mk({ ri: 0, type: 'datapost', title: g.name, seconds: g.roundSeconds || DEF_SEC.datapost, promptId: g.promptId || '', key: g.key || {}, samples: g.sampleSentences || [],
          task: g.gameId === 'number-hunt' ? 'As many correct claim + number sentences as you can. Every figure is checked.' : g.gameId === 'slice-it' ? 'One post: the largest slice, the smallest slice, and the top two combined — with figures.' : g.gameId === 'table-detective' ? 'One post: the biggest figure in each column, and the exception (who breaks the pattern?).' : '' })];
      case 'bid':
        return (g.rounds || []).map(function (r, i) {
          return mk({ ri: i, type: 'bid', title: g.name + ' · Round ' + (r.n || i + 1) + ' · ' + r.pattern, seconds: g.roundSeconds || DEF_SEC.bid, promptId: g.promptId || '', pattern: r.pattern, frame: r.frame || '', rule: r.rule || '', models: r.models || [], key: g.key || {}, task: 'Bid 1–3 points, then post ONE ' + r.pattern + ' sentence. ' + (r.frame || '') });
        });
      case 'checklist':
        return (g.scripts || []).map(function (s, i) {
          return mk({ ri: i, type: 'checklist', title: g.name + ' · ' + (s.label || 'Script ' + (i + 1)), seconds: g.scriptSeconds || DEF_SEC.checklist, promptId: g.promptId || '', script: s, check: g.check || [], target: (g.key || {}).agreementTarget || 8, task: 'Read the script. Tick each of the ten checks it passes, then Submit.' });
        });
    }
    return [];
  }

  /* ====================================================================
     2. CHECKS
     ==================================================================== */
  function D() { return global.Template && global.Template.Data; }
  function sentencesOf(t) { return W && W.sentences ? W.sentences(t) : [String(t || '')]; }
  function wordsOf(t) { return W && W.words ? W.words(t) : String(t || '').split(/\s+/).filter(Boolean).length; }

  /* Clauses, as the Workshop splits them (template.js segmentsOf). */
  function segments(v) {
    var out = [], re = /,|;|:|\bcompared (?:with|to)\b|\bthan\b|\bwhile\b|\bwhereas\b|\bbut\b|\bversus\b|\bvs\.?|\bagainst\b|[()]/gi, last = 0, m;
    while ((m = re.exec(v))) { out.push({ from: last, to: m.index, text: v.slice(last, m.index), compareAfter: /than|compared|versus|vs|against/i.test(m[0]) }); last = m.index + m[0].length; }
    out.push({ from: last, to: v.length, text: v.slice(last), compareAfter: false });
    return out;
  }
  function nearestLabelBefore(s, pos, ix) {
    var best = null, ls = lower(s);
    function scan(kinds) {
      ix.labels.forEach(function (l) {
        if (kinds.indexOf(l.kind) < 0) return;
        var at = ls.lastIndexOf(lower(l.name), pos);
        if (at >= 0 && (!best || at > best.at)) best = { at: at, l: l };
      });
    }
    scan(['series', 'row', 'slice', 'category', 'stage', 'feature']);   /* the thing a figure belongs to… */
    if (!best) scan(['column']);                                          /* …before a table's column head */
    return best ? [best.l] : [];
  }
  /* Every figure and year of ONE sentence against the chart.
     → { figures:[{raw,status,note,year?}], n, ok, near, bad, allGreen, noFigure, noLabel } */
  function checkSentence(s, p) {
    var d = D(), out = { figures: [], n: 0, ok: 0, near: 0, bad: 0, allGreen: false, noFigure: false, noLabel: false, text: s };
    if (!d || !p) return out;
    var ix = d.index(p), nums = d.numbers(s, p);
    var years = [], figs = [], cursor = 0;
    nums.forEach(function (o) {
      var pos = s.indexOf(o.raw, cursor); if (pos < 0) pos = s.indexOf(o.raw); if (pos >= 0) cursor = pos + o.raw.length;
      o.pos = pos < 0 ? 0 : pos;
      if (o.year) years.push(o); else if (!o.frac) figs.push(o);
    });
    years.forEach(function (y) {
      if (ix.yearMin != null && (y.year < ix.yearMin || y.year > ix.yearMax)) out.figures.push({ raw: y.raw, status: 'bad', year: true, note: y.year + ' is outside the chart (' + ix.yearMin + '–' + ix.yearMax + ').' });
      else if (ix.years.length && ix.years.indexOf(y.year) < 0 && ix.yearMin != null) out.figures.push({ raw: y.raw, status: 'near', year: true, note: y.year + ' is not a point on the chart (' + ix.years.join(', ') + ').' });
      else out.figures.push({ raw: y.raw, status: 'ok', year: true, note: y.year + ' is on the chart.' });
    });
    /* A table's column heads never narrow the pool (one clause often carries several columns of one row);
       the row, series, slice or category names do. */
    function entity(list) { var e = list.filter(function (l) { return l.kind !== 'column' && l.kind !== 'label'; }); return e.length ? e : list; }
    var all = entity(d.namesIn(s, ix)), segs = segments(s);
    function firstLabel() { var best = null, ls = lower(s); all.forEach(function (l) { var at = ls.indexOf(lower(l.name)); if (at >= 0 && (!best || at < best.at)) best = { at: at, l: l }; }); return best ? [best.l] : []; }
    /* other figures, years and a table's column heads are blanked out of the words around a figure */
    var colNames = ix.labels.filter(function (l) { return l.kind === 'column'; }).map(function (l) { return l.name; });
    function blank(t) {
      t = t.replace(/\b(18|19|20)\d\d\b/g, ' ').replace(/[\d,.]*\d+%?/g, ' ');
      colNames.forEach(function (nm) { t = t.replace(new RegExp(nm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'), ' '); var w = nm.split(/\s+/)[0]; if (w.length >= 4) t = t.replace(new RegExp('\\b' + w + 's?\\b', 'gi'), ' '); });
      return t.replace(/\s+/g, ' ');
    }
    function union(a, b) { var out = a.slice(); b.forEach(function (l) { if (!out.some(function (x) { return x.key === l.key; })) out.push(l); }); return out; }
    figs.forEach(function (o) {
      var si = -1; segs.forEach(function (sg, i) { if (si < 0 && o.pos >= sg.from && o.pos < sg.to) si = i; });
      var seg = si >= 0 ? segs[si] : null, cats = seg ? entity(d.namesIn(seg.text, ix)) : [];
      var inClause = seg ? figs.filter(function (f) { return f.pos >= seg.from && f.pos < seg.to; }).length : 1;
      if (seg && seg.compareAfter && segs[si + 1]) cats = union(cats, entity(d.namesIn(segs[si + 1].text, ix)));
      /* a difference ("10 more than Chinese", "rose by 70") spans two cells: the subject joins the pool */
      if (o.diff) cats = union(cats, nearestLabelBefore(s, o.pos, ix));
      if (!cats.length) {
        /* "…, at 7%" takes the label just before it; after "than Thailand, at 24" the figure is the subject's */
        var nb = nearestLabelBefore(s, o.pos, ix), nbAt = nb.length ? lower(s).lastIndexOf(lower(nb[0].name), o.pos) : -1;
        var objectOfThan = nbAt > 0 && /\b(than|compared (?:with|to)|versus|vs\.?|against|unlike)\s*$/i.test(s.slice(Math.max(0, nbAt - 24), nbAt));
        cats = inClause >= 2 ? all : objectOfThan ? firstLabel() : nb;
      }
      if (!cats.length) cats = all;
      /* the year this figure belongs to: the first year after it in the same clause, else the last year before it;
         a change ("by 70 between 2016 and 2024") is not pinned to one year, a gap ("10 more than") is */
      var rawAfter = s.slice(o.pos + o.raw.length, o.pos + o.raw.length + 20);
      var yr = null, gap = /^\s*(?:[a-z]+\s+)?(more|less|fewer|higher|lower)\b/i.test(rawAfter);
      if (!o.diff || gap) {
        years.forEach(function (y) { if (yr == null && y.pos > o.pos && seg && y.pos < seg.to) yr = y.year; });
        if (yr == null) years.forEach(function (y) { if (y.pos < o.pos) yr = y.year; });
        if (yr == null && years.length === 1) yr = years[0].year;
      }
      /* a few words either side carry "about", "by", "to", "more than"; other figures and years are blanked */
      var before = blank(s.slice(Math.max(0, o.pos - 48), o.pos)), after = blank(s.slice(o.pos + o.raw.length, o.pos + o.raw.length + 40));
      var prefix = before.trim().split(' ').slice(-4).join(' '), suffix = after.trim().split(' ').slice(0, 3).join(' ');
      var value = (prefix ? prefix + ' ' : '') + o.raw + (suffix ? ' ' + suffix : '');
      var r = d.check({ key: 'f', check: { type: 'figure', cat: 'c', at: 'y' } }, value, p, { vars: { c: cats.map(function (l) { return l.name; }).join(' and '), y: yr != null ? String(yr) : '' } });
      var st = r.status === 'ok' ? 'ok' : r.status === 'near' ? 'near' : 'bad';
      out.figures.push({ raw: o.raw, status: st, note: r.note || '' });
    });
    out.n = figs.length;
    out.figures.forEach(function (f) { out[f.status]++; });
    out.noFigure = !figs.length;
    out.noLabel = !!figs.length && !all.length;
    out.allGreen = !!figs.length && out.bad === 0 && out.near === 0 && !out.noLabel;
    return out;
  }
  /* A whole post (one or more sentences) → { sentences:[…], n, ok, near, bad, greens, crosses, points } */
  function dataCheck(text, promptOrId) {
    var p = promptOf(promptOrId), out = { sentences: [], n: 0, ok: 0, near: 0, bad: 0, greens: 0, crosses: 0, points: 0 };
    sentencesOf(text).forEach(function (s) {
      var r = checkSentence(s, p); out.sentences.push(r);
      out.n += r.n; out.ok += r.ok; out.near += r.near; out.bad += r.bad;
      if (r.allGreen) out.greens++;
      out.crosses += r.bad;
    });
    /* A08: +1 per all-green sentence, −1 per ✗ (a ✗ year counts too) */
    out.points = out.greens - out.crosses;
    return out;
  }

  /* Paraphrase Relay: copied run (A05: 8+ words red) and the five P1 elements (missing = amber). */
  function relayCheck(text, rd) {
    var d = D(), t = String(text || ''), run = d ? d.longestRun(t, rd.taskSentence || '') : 0;
    var red = (rd.key && rd.key.copiedRunRed) || 8;
    var lt = ' ' + lower(t).replace(/[^a-z0-9%$]+/g, ' ') + ' ';
    var missing = [], kw = rd.elementKeywords || {};
    Object.keys(kw).forEach(function (k) {
      var hit = (kw[k] || []).some(function (w) { w = lower(w).replace(/[^a-z0-9%$]+/g, ' ').trim(); return w && (lt.indexOf(' ' + w + ' ') >= 0 || lt.indexOf(' ' + w) >= 0 && w.length >= 5); });
      if (!hit) missing.push(k);
    });
    var words = wordsOf(t), copied = run >= red;
    return { run: run, copied: copied, missing: missing, words: words, clean: !copied && !missing.length && words >= 15, points: (!copied && !missing.length && words >= 15 ? 2 : 0) + (copied ? -1 : 0) };
  }

  /* Choice card: picks {key: option} → { qs:[{key, pick, ok, pts}], late, points } */
  function choiceMark(card, picks, late) {
    var pts = 0, qs = (card.qs || []).map(function (q) {
      var pick = picks ? picks[q.key] : null, ok = pick != null && q.accept.some(function (a) { return lower(a) === lower(pick); });
      if (ok) pts += q.pts; return { key: q.key, label: q.label, pick: pick, ok: ok, pts: ok ? q.pts : 0 };
    });
    var lateP = late && card.late ? card.late : 0;
    return { qs: qs, late: !!late, latePts: lateP, points: pts + lateP, answered: !!picks };
  }
  /* Checklist: ticks[10] vs script.key → matches and the A11 points (+1 per matching tick above 7). */
  function checklistMark(script, ticks) {
    var key = script.key || [], per = key.map(function (k, i) { var t = !!(ticks && ticks[i]); return { i: i, key: !!k, tick: t, match: t === !!k }; });
    var matches = per.filter(function (x) { return x.match; }).length;
    return { per: per, matches: matches, total: key.length, points: Math.max(0, matches - 7) };
  }
  /* Bid: all figures green AND the pattern ticked → +bid, otherwise −bid. */
  function bidResolve(bid, dc, pattern) {
    bid = Math.max(1, Math.min(3, parseInt(bid, 10) || 1));
    var green = dc && dc.n > 0 && dc.bad === 0 && dc.near === 0;
    var win = green && !!pattern;
    return { bid: bid, green: green, pattern: !!pattern, win: win, points: win ? bid : -bid };
  }

  /* ====================================================================
     3. POSTS: encode / decode / score
     ==================================================================== */
  function encode(o) { return JSON.stringify(o); }
  function decode(post) {
    var t = String((post && post.text) || '');
    if (t.charAt(0) === '{' && t.indexOf('"asm"') > 0) { try { var o = JSON.parse(t); if (o && o.asm) return o; } catch (e) {} }
    return { asm: 'text', text: t };
  }
  function byTeam(posts) { var m = {}; posts.forEach(function (p) { (m[p.team] || (m[p.team] = [])).push(p); }); return m; }
  function sortTs(a, b) { return String(a.ts).localeCompare(String(b.ts)); }

  /* marks: { postId: { pattern: n, wrong: n } } set by the teacher. adj: { team: n }.
     → { teams: { name: { auto, teacher, total, lines:[] } }, posts: { id: markInfo } } */
  function scoreRound(rd, posts, marks, adj) {
    marks = marks || {}; adj = adj || {};
    var teamsOut = {}, info = {}, T = TYPES[rd.type];
    function team(n) { return teamsOut[n] || (teamsOut[n] = { auto: 0, teacher: 0, total: 0, lines: [] }); }
    var groups = byTeam(posts.filter(function (p) { return p.kind === 'post'; }).sort(sortTs));
    Object.keys(groups).forEach(function (tn) { T.score(rd, groups[tn], marks, team(tn), info); });
    Object.keys(adj).forEach(function (tn) { if (adj[tn]) { team(tn).teacher += adj[tn]; team(tn).lines.push('Adjustment ' + (adj[tn] > 0 ? '+' : '') + adj[tn]); } });
    Object.keys(teamsOut).forEach(function (tn) { teamsOut[tn].total = teamsOut[tn].auto + teamsOut[tn].teacher; });
    return { teams: teamsOut, posts: info };
  }
  function teacherPts(marks, id) { var m = marks[id] || {}; return (m.pattern || 0) - (m.wrong || 0); }

  /* ====================================================================
     4. ROUND TYPES (extensible registry)
     Each: mark(rd, post, ctx) → info for one post; score(rd, teamPosts, marks, team, info); student UI; projector panels.
     ==================================================================== */
  var TYPES = {};
  TYPES.post = {
    label: 'Post round (teacher-judged)',
    mark: function (rd, post) {
      var o = decode(post), info = { kind: 'text', text: o.text || '' };
      if (rd.check === 'relay' && rd.relay) info.relay = relayCheck(info.text, { taskSentence: rd.relay.taskSentence, elementKeywords: rd.relay.elementKeywords, key: rd.key });
      return info;
    },
    score: function (rd, list, marks, team, info) {
      list.forEach(function (p) {
        var m = TYPES.post.mark(rd, p); info[p.id] = m;
        var tp = teacherPts(marks, p.id);
        if (m.relay) { team.auto += m.relay.points; if (m.relay.points) team.lines.push((m.relay.points > 0 ? '+' : '') + m.relay.points + ' ' + (m.relay.clean ? 'complete and clean' : 'copied run')); }
        team.teacher += tp; if (tp) team.lines.push((tp > 0 ? '+' : '') + tp + ' from T.Chris');
      });
    }
  };
  TYPES.datapost = {
    label: 'Data-checked post round',
    mark: function (rd, post) { var o = decode(post); return { kind: 'text', text: o.text || '', dc: dataCheck(o.text || '', rd.promptId) }; },
    score: function (rd, list, marks, team, info) {
      list.forEach(function (p) {
        var m = TYPES.datapost.mark(rd, p); info[p.id] = m;
        team.auto += m.dc.points;
        if (m.dc.greens) team.lines.push('+' + m.dc.greens + ' all-green sentence' + (m.dc.greens > 1 ? 's' : ''));
        if (m.dc.crosses) team.lines.push('−' + m.dc.crosses + ' wrong figure' + (m.dc.crosses > 1 ? 's' : ''));
        var tp = teacherPts(marks, p.id); team.teacher += tp; if (tp) team.lines.push((tp > 0 ? '+' : '') + tp + ' pattern');
      });
    }
  };
  TYPES.choice = {
    label: 'Choice round (timed cards, auto-scored)',
    mark: function (rd, post) {
      var o = decode(post); if (o.asm !== 'choice') return { kind: 'ignore' };
      var card = (rd.cards || []).filter(function (c) { return c.n === o.card; })[0]; if (!card) return { kind: 'ignore' };
      return { kind: 'choice', card: card.n, cm: choiceMark(card, o.picks, o.late) };
    },
    score: function (rd, list, marks, team, info) {
      var seen = {};
      list.forEach(function (p) {
        var m = TYPES.choice.mark(rd, p); info[p.id] = m;
        if (m.kind !== 'choice') return;
        if (seen[m.card]) { m.dup = true; return; }   /* the first answer of a team counts */
        seen[m.card] = 1; team.auto += m.cm.points; team.byCard = team.byCard || {}; team.byCard[m.card] = m.cm;
      });
      var cards = Object.keys(seen).length; if (cards) team.lines.push(cards + ' card' + (cards > 1 ? 's' : '') + ' answered');
    }
  };
  TYPES.bid = {
    label: 'Bid round (wager, post, reveal)',
    mark: function (rd, post) { var o = decode(post); if (o.asm === 'bid') return { kind: 'bid', bid: o.bid }; return { kind: 'text', text: o.text || '', dc: dataCheck(o.text || '', rd.promptId) }; },
    /* resolved only when the teacher has revealed (marks.__reveal); before that the wager is pending */
    score: function (rd, list, marks, team, info) {
      var bid = null, sent = null;
      list.forEach(function (p) { var m = TYPES.bid.mark(rd, p); info[p.id] = m; if (m.kind === 'bid') bid = m.bid; else sent = { post: p, m: m }; });
      team.bid = bid; team.sentence = sent;
      if (!marks.__reveal) { team.lines.push(bid ? 'Bid ' + bid + (sent ? ' · posted' : ' · waiting for the sentence') : 'No bid yet'); return; }
      if (!sent) { team.lines.push('No sentence posted'); return; }
      var r = bidResolve(bid || 1, sent.m.dc, (marks[sent.post.id] || {}).pattern); team.result = r; sent.m.result = r;
      team.auto += r.points; team.lines.push((r.points > 0 ? '+' : '') + r.points + ' (bid ' + r.bid + ': figures ' + (r.green ? '✓' : '✗') + ', pattern ' + (r.pattern ? '✓' : '✗') + ')');
    }
  };
  TYPES.checklist = {
    label: 'Checklist round (10 ticks vs the key)',
    mark: function (rd, post) { var o = decode(post); if (o.asm !== 'check') return { kind: 'ignore' }; return { kind: 'check', ticks: o.ticks || [], cm: checklistMark(rd.script || {}, o.ticks || []) }; },
    score: function (rd, list, marks, team, info) {
      var last = null;
      list.forEach(function (p) { var m = TYPES.checklist.mark(rd, p); info[p.id] = m; if (m.kind === 'check') last = m; });
      if (!last) return;
      team.check = last; team.auto += last.cm.points; team.lines.push(last.cm.matches + ' of ' + last.cm.total + ' match' + (last.cm.points ? ' → +' + last.cm.points : ''));
    }
  };

  /* ====================================================================
     5. SERVER — asm.* through the ASM-HOOK, local store when offline
     ==================================================================== */
  var LS_ASM = 'cc.asm.v1', teacherToken = null;
  function localAsm() { try { return JSON.parse(localStorage.getItem(LS_ASM)) || { points: [] }; } catch (e) { return { points: [] }; } }
  function saveAsm(d) { try { localStorage.setItem(LS_ASM, JSON.stringify(d)); } catch (e) {} }
  function summarise(rows, studentId) {
    var byStudent = {}, byTeam = {}, total = 0;
    rows.forEach(function (r) { var pts = Number(r.points) || 0; byStudent[r.studentId] = (byStudent[r.studentId] || 0) + pts; byTeam[r.team] = (byTeam[r.team] || 0) + pts; total += pts; });
    return { ok: true, rows: studentId ? rows.filter(function (r) { return lower(r.studentId) === lower(studentId); }) : rows, byStudent: byStudent, byTeam: byTeam, total: total, mine: studentId ? byStudent[studentId] || 0 : null };
  }
  function localCall(action, payload) {
    var d = localAsm();
    if (action === 'asm.points') { (payload.rows || []).forEach(function (r) { d.points.push(r); }); saveAsm(d); return { ok: true, n: (payload.rows || []).length, local: true }; }
    if (action === 'asm.tally') { var s = summarise(d.points, payload.studentId); s.local = true; return s; }
    if (action === 'asm.houses') return { ok: true, totals: {}, local: true };
    return { ok: false, error: 'Unknown ' + action };
  }
  function server(action, payload) {
    var api = global.API; payload = payload || {};
    if (!api || !api.url || api.mode !== 'cloud') return Promise.resolve(localCall(action, payload));
    if (teacherToken) payload.tt = teacherToken;
    try { payload.token = localStorage.getItem('cc.token') || ''; } catch (e) {}
    return fetch(api.url, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify({ action: action, payload: payload }), redirect: 'follow' })
      .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .then(function (j) { if (j && j.ok === false && /Unknown action/i.test(j.error || '')) { j.hook = false; } return j; })
      .catch(function (e) { return { ok: false, error: String(e.message || e), offline: true }; });
  }

  /* ====================================================================
     6. TEACHER — the projector
     ==================================================================== */
  var PJ = null;   /* { host, api, rd, round, posts, marks, adj, phase, t0, tick, session }  */
  function projApi() { return PJ && PJ.api ? PJ.api : global.API; }
  function roundRow(rd, code, promptId, minutes) {
    return { kind: 'round', round: code, game: rd.gameId, promptId: promptId, minutes: minutes, ts: new Date().toISOString(),
      asm: { v: 1, gameId: rd.gameId, ri: rd.ri, type: rd.type, promptId: promptId, seconds: Math.round(minutes * 60), flash: rd.flash || 0, answer: rd.answer || 0, title: rd.title } };
  }
  function postState(extra) {
    if (!PJ || !PJ.round) return Promise.resolve();
    var st = { kind: 'state', round: PJ.round.round, phase: PJ.phase, t0: PJ.t0 || 0, ts: new Date().toISOString(), marks: PJ.marks, adj: PJ.adj };
    for (var k in (extra || {})) if (extra.hasOwnProperty(k)) st[k] = extra[k];
    return projApi().projector('post', st);
  }
  /* Staff Room → Projector home. Replaces teacher.js paintProjectorHome. */
  function paintHome(host, opts) {
    opts = opts || {};
    var gs = gameList(), prompts = (global.CONTENT && global.CONTENT.PROMPTS) || [];
    var tn = function (t) { return { line: 'Line graph', bar: 'Bar chart', pie: 'Pie chart', table: 'Table', process: 'Process', map: 'Map', mixed: 'Two visuals' }[t] || t; };
    host.innerHTML = '<div class="panel-h"><h2>Projector mode · the Assembly</h2><span class="tiny">Full screen for the classroom. One device per team (the Writer\'s) opens <b>index.html#live</b>, enters the round code and the team name.</span></div>' +
      '<div class="card panel form asm-home"><div class="row"><div><label>Game</label><select id="pj-game">' + gs.map(function (g) { return '<option value="' + esc(g.gameId) + '">' + esc((g.lesson ? g.lesson + ' · ' : '') + g.name) + '</option>'; }).join('') + '</select></div>' +
      '<div><label>Round</label><select id="pj-round"></select></div>' +
      '<div><label>Chart</label><select id="pj-prompt">' + prompts.map(function (p) { return '<option value="' + esc(p.id) + '">' + esc(p.title) + ' · ' + tn(p.type) + ' · ' + p.mode + '</option>'; }).join('') + '</select></div>' +
      '<div><label>Minutes</label><input type="number" id="pj-min" value="3" min="0.5" step="0.5" max="20" style="width:80px"></div>' +
      '<div id="pj-flashbox" class="hidden"><label>Flash s · answer s</label><input type="number" id="pj-flash" value="5" min="2" max="30" style="width:60px"> <input type="number" id="pj-answer" value="10" min="3" max="60" style="width:60px"></div></div>' +
      '<p class="tiny" id="pj-rules"></p><div><button class="btn primary" id="pj-go">Open projector</button> <span class="tiny" id="pj-session"></span></div>' +
      '<div class="asm-gamelist">' + gs.map(function (g) { return '<div class="tiny"><b>' + esc(g.name) + '</b>' + (g.lesson ? ' <span class="pill">' + esc(g.lesson) + '</span>' : '') + ' — ' + esc(g.rules || '') + '</div>'; }).join('') + '</div>' +
      '<p class="tiny">Content version ' + esc(content().version || '—') + ' · teams: ' + teams().map(function (t) { return esc(t.name); }).join(', ') + '. Points posted from a round go to the Teams sheet (team-mission tally) and the House Cup.</p></div>';
    var gSel = $('#pj-game', host), rSel = $('#pj-round', host), pSel = $('#pj-prompt', host);
    function fillRounds() {
      var rs = rounds(gSel.value), g = game(gSel.value);
      rSel.innerHTML = rs.map(function (r) { return '<option value="' + r.ri + '">' + esc(r.title) + '</option>'; }).join('') || '<option value="0">—</option>';
      $('#pj-rules', host).textContent = g ? g.rules || '' : '';
      fillRound();
    }
    function fillRound() {
      var rd = rounds(gSel.value)[parseInt(rSel.value, 10) || 0]; if (!rd) return;
      if (rd.promptId && pSel.querySelector('option[value="' + rd.promptId + '"]')) pSel.value = rd.promptId;
      pSel.disabled = rd.type === 'choice';
      $('#pj-min', host).value = String(Math.round(rd.seconds / 30) / 2 || 3);
      $('#pj-flashbox', host).classList.toggle('hidden', !(rd.type === 'choice' && rd.flash));
      if (rd.type === 'choice') { $('#pj-flash', host).value = rd.flash || 5; $('#pj-answer', host).value = rd.answer || 10; }
    }
    gSel.addEventListener('change', fillRounds); rSel.addEventListener('change', fillRound);
    fillRounds();
    if (PJ && PJ.session) $('#pj-session', host).textContent = 'Session: ' + PJ.session.game + ' · ' + Object.keys(PJ.session.totals).length + ' teams on the board.';
    $('#pj-go', host).addEventListener('click', function () {
      var rd = rounds(gSel.value)[parseInt(rSel.value, 10) || 0]; if (!rd) return;
      if (rd.type === 'choice' && rd.flash) {
        var fl = parseInt($('#pj-flash', host).value, 10) || 5, an = parseInt($('#pj-answer', host).value, 10) || 10;
        rd.flash = fl; rd.answer = an; rd.cards.forEach(function (c) { c.flash = fl; c.answer = an; }); rd.seconds = rd.cards.length * (fl + an);
      }
      var min = rd.type === 'choice' ? rd.seconds / 60 : parseFloat($('#pj-min', host).value) || rd.seconds / 60;
      openProjector(rd, rd.type === 'choice' ? rd.promptId : pSel.value, min, opts);
    });
  }

  function openProjector(rd, promptId, minutes, opts) {
    opts = opts || {};
    var api = opts.api || global.API, host = opts.host || $('#projector');
    var code = 'L' + Math.random().toString(36).slice(2, 6).toUpperCase();
    var session = PJ && PJ.session && PJ.session.gameId === rd.gameId ? PJ.session : { gameId: rd.gameId, game: rd.game, lesson: rd.lesson, totals: {}, rounds: [], members: {} };
    if (PJ && PJ.tick) clearInterval(PJ.tick);
    PJ = { host: host, api: api, rd: rd, promptId: promptId, minutes: minutes, round: roundRow(rd, code, promptId, minutes), posts: [], marks: {}, adj: {}, phase: rd.type === 'post' || rd.type === 'datapost' ? 'run' : 'lobby', t0: 0, tick: null, session: session, revealed: {}, posted: false, pollAt: 0 };
    if (PJ.phase === 'run') PJ.t0 = Date.now();
    PJ.round.asm.t0 = PJ.t0; PJ.round.asm.phase = PJ.phase;
    api.projector('clear', {}).then(function () { return api.projector('post', PJ.round); }).then(function () { return postState(); });
    host.classList.remove('hidden');
    paintProjector();
    PJ.say = opts.say || null;
    PJ.tick = setInterval(function () { if (!PJ || !PJ.round) return; tickProjector(); }, 500);
  }
  function closeProjector() { if (!PJ || !PJ.round) return; clearInterval(PJ.tick); PJ.host.classList.add('hidden'); PJ.host.innerHTML = ''; var s = PJ.session; PJ = { session: s }; }
  function leftSeconds() {
    if (!PJ || !PJ.round) return 0;
    if (!PJ.t0) return PJ.minutes * 60;
    return Math.max(0, (PJ.t0 + PJ.minutes * 60000 - Date.now()) / 1000);
  }
  function cardAt(rd, t0, now) {
    if (!rd.cards || !t0) return null;
    var el = (now - t0) / 1000, acc = 0;
    for (var i = 0; i < rd.cards.length; i++) {
      var c = rd.cards[i], len = (c.flash || 0) + (c.answer || 0);
      if (el < acc + len) return { i: i, card: c, into: el - acc, flashing: el - acc < (c.flash || 0), left: acc + len - el };
      acc += len;
    }
    return { i: rd.cards.length, card: null, done: true };
  }
  function tickProjector() {
    var left = leftSeconds(), c = $('#pj-clock', PJ.host);
    if (c) { c.textContent = mmss(left); c.classList.toggle('low', left <= 30 && PJ.phase === 'run'); }
    if (PJ.rd.type === 'choice' && PJ.phase === 'run') {
      var ca = cardAt(PJ.rd, PJ.t0, Date.now());
      if (ca && (ca.i !== PJ.cardI || ca.flashing !== PJ.cardFlash)) { PJ.cardI = ca.i; PJ.cardFlash = ca.flashing; paintStage(); }
      if (ca && ca.done && PJ.phase === 'run') { PJ.phase = 'reveal'; postState(); paintProjector(); }
    }
    if (Date.now() - PJ.pollAt > 3000) { PJ.pollAt = Date.now(); pollPosts(); }
  }
  function pollPosts() {
    if (!PJ || !PJ.round) return;
    var code = PJ.round.round;
    projApi().projector('list', { round: code }).then(function (r) {
      if (!PJ || !PJ.round || PJ.round.round !== code) return;
      var posts = ((r && r.posts) || []).filter(function (p) { return p.kind === 'post' && p.round === code; });
      var seen = {}; PJ.posts.forEach(function (p) { seen[p.id] = 1; });
      var fresh = 0; posts.forEach(function (p) { if (!seen[p.id]) { p.team = normTeam(p.team); PJ.posts.push(p); fresh++; } });
      if (fresh) { paintPosts(); paintBoard(); }
    });
  }
  function scoreNow() { var m = {}; for (var k in PJ.marks) if (PJ.marks.hasOwnProperty(k)) m[k] = PJ.marks[k]; if (PJ.phase === 'reveal' || PJ.phase === 'closed') m.__reveal = 1; return scoreRound(PJ.rd, PJ.posts, m, PJ.adj); }

  function paintProjector() {
    var rd = PJ.rd, pr = promptOf(PJ.promptId), h = PJ.host;
    var ctl = '';
    if (PJ.phase === 'lobby') ctl += '<button class="btn primary" id="pj-start">Start ▶</button>';
    if (PJ.phase === 'run' && rd.type !== 'choice') ctl += '<button class="btn" id="pj-reveal">Reveal</button>';
    if (PJ.phase === 'run' && rd.type === 'choice') ctl += '<button class="btn ghost" id="pj-reveal">End early</button>';
    if (PJ.phase === 'reveal') ctl += '<button class="btn" id="pj-closer">Close round</button>';
    if (PJ.phase === 'closed') ctl += (PJ.posted ? '<span class="pill good">Points posted</span>' : '<button class="btn primary" id="pj-points">Post points → House Cup</button>');
    ctl += '<button class="btn ghost" id="pj-next">Next round</button><button class="btn ghost" id="pj-close">Close</button>';
    h.innerHTML = '<div class="proj-top asm-top"><div><h1>' + esc(rd.game) + '</h1><div class="tiny">' + esc(rd.title) + (rd.lesson ? ' · ' + esc(rd.lesson) : '') + '</div></div><span class="projcode" title="Students enter this code">' + PJ.round.round + '</span>' +
      '<span class="asm-phase pill" id="pj-phase">' + esc(PJ.phase) + '</span><span class="proj-clock" id="pj-clock">' + mmss(leftSeconds()) + '</span><div class="asm-ctl">' + ctl + '</div></div>' +
      (rd.task ? '<p class="asm-task">' + esc(rd.task) + '</p>' : '') +
      '<div class="proj-grid asm-grid"><div><div id="pj-stage"></div><div class="card panel"><h2 style="font-size:1rem;margin-bottom:8px">Scoreboard <span class="tiny">this round · session</span></h2><ul class="board" id="pj-board"></ul><div id="pj-adj" class="asm-adj"></div></div></div>' +
      '<div><h2 style="font-size:1rem;margin-bottom:8px" id="pj-posts-h">Posts <span class="tiny" id="pj-n"></span></h2><div class="proj-posts" id="pj-posts"><div class="empty">Waiting for teams…</div></div></div></div>';
    var start = $('#pj-start', h); if (start) start.addEventListener('click', function () { PJ.phase = 'run'; PJ.t0 = Date.now(); PJ.cardI = -1; postState(); paintProjector(); });
    var rv = $('#pj-reveal', h); if (rv) rv.addEventListener('click', function () { PJ.phase = 'reveal'; postState(); paintProjector(); });
    var cl = $('#pj-closer', h); if (cl) cl.addEventListener('click', function () { PJ.phase = 'closed'; bankRound(); postState(); paintProjector(); });
    var pp = $('#pj-points', h); if (pp) pp.addEventListener('click', postPoints);
    $('#pj-next', h).addEventListener('click', function () { var s = PJ.session; clearInterval(PJ.tick); PJ.host.classList.add('hidden'); PJ = { session: s }; var home = $('#view-projector'); if (home) paintHome(home, {}); });
    $('#pj-close', h).addEventListener('click', closeProjector);
    paintStage(); paintPosts(); paintBoard();
  }
  function paintStage() {
    var rd = PJ.rd, st = $('#pj-stage', PJ.host); if (!st) return;
    var pr = promptOf(PJ.promptId);
    if (rd.type === 'choice') {
      var ca = PJ.phase === 'run' ? cardAt(rd, PJ.t0, Date.now()) : null, html = '';
      if (PJ.phase === 'lobby') html = '<div class="card panel asm-card"><p class="kicker">' + rd.cards.length + ' cards</p><p>' + (rd.flash ? 'Each chart shows for ' + rd.flash + ' s, then ' + rd.answer + ' s to answer (an answer after the flash is late: −1).' : 'Each card stays ' + rd.answer + ' s.') + ' Teams: join with the code, then press Start.</p>' + (rd.cards[0].qs ? '<p class="tiny">Options: ' + rd.cards[0].qs.map(function (q) { return q.label + ' — ' + q.options.join(' / '); }).join(' · ') + '</p>' : '') + '</div>';
      else if (ca && ca.card) {
        var c = ca.card;
        html = '<div class="card panel asm-card"><div class="asm-card-h"><span class="kicker">Card ' + c.n + ' of ' + rd.cards.length + '</span><span class="pill ' + (ca.flashing ? 'gold' : '') + '">' + (ca.flashing ? 'LOOK · ' + Math.ceil(c.flash - ca.into) + ' s' : 'ANSWER · ' + Math.ceil(ca.left) + ' s') + '</span></div>' +
          (c.text ? '<p class="asm-cardtext">' + esc(c.text) + '</p>' : '') + (c.chart && ca.flashing ? '<div id="pj-chart"></div>' : c.chart ? '<div class="asm-hidden">Chart hidden — answer now</div>' : '') + '</div>';
      } else {
        html = '<div class="card panel asm-card"><p class="kicker">Reveal</p>' + rd.cards.map(function (c) {
          var p2 = c.promptId ? promptOf(c.promptId) : null;
          return '<div class="asm-rev' + (c.trap || c.borderline ? ' trap' : '') + '"><b>' + c.n + '.</b> ' + (c.text ? esc(c.text) : esc(p2 ? p2.title : c.promptId)) + ' → <b>' + c.qs.map(function (q) { return esc(q.accept[0]); }).join(' · ') + '</b>' + (c.trapNote || c.why ? '<span class="tiny"> — ' + esc(c.trapNote || c.why) + '</span>' : '') + (c.tense ? '<span class="tiny"> · tense: ' + esc(c.tense) + '</span>' : '') + '</div>';
        }).join('') + (rd.debrief ? '<p class="asm-debrief">' + esc(rd.debrief) + '</p>' : '') + '</div>';
      }
      st.innerHTML = html;
      var chartHost = $('#pj-chart', st); if (chartHost && ca && ca.card && CH) CH.render(chartHost, promptOf(ca.card.promptId), { compact: false, showRubric: false });
      return;
    }
    var html2 = '<div id="pj-chart"></div>';
    if (rd.type === 'checklist' && rd.script) html2 += '<div class="card panel asm-script"><p class="kicker">' + esc(rd.script.label || 'Script') + (PJ.phase === 'reveal' || PJ.phase === 'closed' ? ' · ' + esc(rd.script.shape || '') : '') + '</p>' + (rd.script.paragraphs || []).map(function (pg) { return '<div class="mpara">' + esc(pg) + '</div>'; }).join('') +
      ((PJ.phase === 'reveal' || PJ.phase === 'closed') ? '<div class="asm-key"><p class="kicker">The key</p>' + (rd.check || []).map(function (q, i) { return '<div class="asm-keyrow ' + (rd.script.key[i] ? 'ok' : 'no') + '"><b>' + (rd.script.key[i] ? '✓' : '✗') + '</b> ' + esc(q) + '<span class="tiny"> ' + esc((rd.script.keyNotes || [])[i] || '') + '</span></div>'; }).join('') + '<p class="asm-debrief">Ceiling: ' + esc(rd.script.ceiling || 'none') + '</p><p class="tiny">Next gate: ' + esc(rd.script.nextGate || '') + '</p></div>' : '') + '</div>';
    if (rd.type === 'bid') html2 += '<div class="card panel asm-script"><p class="kicker">' + esc(rd.pattern) + '</p><p>' + esc(rd.frame) + '</p>' + (rd.rule ? '<p class="tiny">' + esc(rd.rule) + '</p>' : '') + ((PJ.phase === 'reveal' || PJ.phase === 'closed') && rd.models.length ? '<p class="kicker">Model sentences</p>' + rd.models.map(function (m) { return '<div class="mpara">' + esc(m) + '</div>'; }).join('') : '') + '</div>';
    if (rd.type === 'post' && rd.relay) html2 += '<div class="card panel asm-script"><p class="kicker">The task sentence</p><p class="asm-cardtext">' + esc(rd.relay.taskSentence) + '</p><p class="tiny">Five elements: visual · what · where · when · units. An 8-word copied run is red; a missing element is amber.</p>' + ((PJ.phase === 'reveal' || PJ.phase === 'closed') && rd.relay.modelP1 ? '<p class="kicker">A model P1</p><div class="mpara">' + esc(rd.relay.modelP1) + '</div>' : '') + '</div>';
    if (rd.type === 'post' && rd.script === 'contrast') { var M = (global.CONTENT && global.CONTENT.MODELS) || [], mm = M.filter(function (x) { return x.contrast && x.promptId === PJ.promptId; })[0] || M.filter(function (x) { return x.contrast; })[0]; if (mm) html2 += '<div class="card panel asm-script"><p class="kicker">The Band ' + esc(mm.contrast.band) + ' script</p>' + mm.contrast.paragraphs.map(function (pg) { return '<div class="mpara">' + esc(pg.text) + '</div>'; }).join('') + '</div>'; }
    if ((PJ.phase === 'reveal' || PJ.phase === 'closed') && rd.key && (rd.gameId === 'group-them' || rd.gameId === 'slice-it' || rd.gameId === 'table-detective')) html2 += '<div class="card panel asm-script"><p class="kicker">The key</p><pre class="asm-pre">' + esc(keyText(rd)) + '</pre></div>';
    if ((PJ.phase === 'reveal' || PJ.phase === 'closed') && rd.samples && rd.samples.length) html2 += '<div class="card panel asm-script"><p class="kicker">Sample sentences by pattern</p>' + rd.samples.map(function (s) { return '<div class="mpara"><b class="tiny">' + esc(s.pattern) + '</b> ' + esc(s.text) + '</div>'; }).join('') + '</div>';
    st.innerHTML = html2;
    if (pr && CH) CH.render($('#pj-chart', st), pr, { compact: false });
  }
  function keyText(rd) {
    var k = rd.key || {};
    if (rd.gameId === 'group-them') return 'Groups: ' + (k.groups || []).map(function (g) { return g.join(' + '); }).join('  vs  ') + '\n' + (k.why || '') + (k.alsoAcceptableWhy ? '\nAlso acceptable: ' + k.alsoAcceptableWhy : '') + (k.reject ? '\nReject: ' + k.reject : '');
    if (rd.gameId === 'slice-it') return 'Largest: ' + (k.largest || []).join(' ') + '%\nSmallest: ' + (k.smallest || []).join(' ') + '%\nTop two combined: ' + ((k.topTwoCombined || [[]])[0] || []).join(' + ') + ' = ' + (k.topTwoCombined || [])[1] + '%\n' + (k.models || []).join('\n');
    if (rd.gameId === 'table-detective') return 'Biggest in each column:\n' + Object.keys(k.columnMax || {}).map(function (c) { return '  ' + c + ': ' + k.columnMax[c].join(' ') ; }).join('\n') + '\nException: ' + (k.exception || []).join(' — ') + '\nPattern: ' + (k.pattern || '');
    return JSON.stringify(k, null, 1);
  }
  function markChips(dc) {
    return dc.sentences.map(function (s) {
      if (s.noFigure) return '<span class="asm-sent none">no figure</span>';
      return s.figures.map(function (f) { return '<span class="asm-fig ' + f.status + '" title="' + esc(f.note) + '">' + (f.status === 'ok' ? '✓' : f.status === 'near' ? '≈' : '✗') + ' ' + esc(f.raw) + '</span>'; }).join('') + (s.noLabel ? '<span class="asm-fig near" title="Name the category from the chart">? label</span>' : '') + (s.allGreen ? '<span class="asm-sent ok">+1</span>' : '');
    }).join('<span class="asm-sep">|</span>');
  }
  function paintPosts() {
    var host = $('#pj-posts', PJ.host); if (!host) return;
    var rd = PJ.rd, sc = scoreNow(), posts = PJ.posts.slice().sort(sortTs), reveal = PJ.phase === 'reveal' || PJ.phase === 'closed';
    var nEl = $('#pj-n', PJ.host); if (nEl) nEl.textContent = posts.length ? posts.length + ' posted' : '';
    if (rd.type === 'choice') {
      $('#pj-posts-h', PJ.host).innerHTML = 'Answers <span class="tiny">first answer per team per card counts · <span id="pj-n">' + posts.length + ' posted</span></span>';
      var tnames = Object.keys(sc.teams).sort(), ca = PJ.phase === 'run' ? cardAt(rd, PJ.t0, Date.now()) : null;
      var showTo = ca && ca.card ? ca.i - 1 : rd.cards.length - 1;   /* a card is shown once it has closed */
      host.innerHTML = tnames.length ? '<table class="asm-matrix"><thead><tr><th>Team</th>' + rd.cards.map(function (c) { return '<th>' + c.n + '</th>'; }).join('') + '<th>Σ</th></tr></thead><tbody>' + tnames.map(function (tn) {
        var t = sc.teams[tn]; return '<tr><td>' + esc(tn) + '</td>' + rd.cards.map(function (c, i) {
          var cm = t.byCard && t.byCard[c.n]; if (!cm) return '<td class="dim">' + (i <= showTo ? '—' : '') + '</td>';
          if (i > showTo && !reveal) return '<td class="dim">·</td>';
          return '<td class="' + (cm.points > 0 ? 'ok' : cm.points < 0 ? 'no' : 'dim') + '" title="' + esc(cm.qs.map(function (q) { return q.label + ': ' + q.pick + (q.ok ? ' ✓' : ' ✗'); }).join(' · ') + (cm.late ? ' · late' : '')) + '">' + (cm.points > 0 ? '+' : '') + cm.points + (cm.late ? '<i>L</i>' : '') + '</td>';
        }).join('') + '<td><b>' + t.total + '</b></td></tr>';
      }).join('') + '</tbody></table>' : '<div class="empty">Waiting for teams…</div>';
      return;
    }
    host.innerHTML = posts.length ? posts.slice().reverse().map(function (p, i) {
      var m = sc.posts[p.id] || {}, n = posts.length - i, body = '', auto = '';
      if (m.kind === 'bid') { body = '<span class="asm-bidchip">Bid ' + m.bid + '</span>'; }
      else if (m.kind === 'check') { body = '<span class="asm-bidchip">' + m.cm.matches + ' / ' + m.cm.total + ' match' + (reveal ? ' → +' + m.cm.points : '') + '</span> <span class="tiny">' + m.ticks.map(function (t, j) { return (t ? '☑' : '☐') + (j + 1); }).join(' ') + '</span>'; }
      else if (m.kind === 'ignore') { body = '<span class="tiny">' + esc(p.text.slice(0, 80)) + '</span>'; }
      else {
        body = esc(m.text);
        if (m.dc) auto = '<div class="asm-marks">' + markChips(m.dc) + (m.result ? '<span class="asm-sent ' + (m.result.win ? 'ok' : 'no') + '">' + (m.result.win ? 'wins' : 'loses') + ' ' + m.result.bid + '</span>' : '') + '</div>';
        if (m.relay) auto = '<div class="asm-marks"><span class="asm-fig ' + (m.relay.copied ? 'bad' : m.relay.run >= 6 ? 'near' : 'ok') + '">run ' + m.relay.run + '</span>' + ['visual', 'what', 'where', 'when', 'units'].map(function (k) { return '<span class="asm-fig ' + (m.relay.missing.indexOf(k) >= 0 ? 'near' : 'ok') + '">' + k + '</span>'; }).join('') + '<span class="asm-fig ' + (m.relay.words >= 20 && m.relay.words <= 45 ? 'ok' : 'near') + '">' + m.relay.words + ' w</span>' + (m.relay.points ? '<span class="asm-sent ' + (m.relay.points > 0 ? 'ok' : 'no') + '">' + (m.relay.points > 0 ? '+' : '') + m.relay.points + '</span>' : '') + '</div>';
      }
      var mk = PJ.marks[p.id] || {}, votes = m.kind === 'text' ? '<span class="vote"><button class="btn sm' + (mk.pattern ? ' primary' : '') + '" data-pt="' + esc(p.id) + '" data-k="pattern" title="+1 pattern (S1–S8)">+1 ' + (mk.pattern ? '✓' : 'pattern') + '</button><button class="btn sm ghost" data-pt="' + esc(p.id) + '" data-k="wrong" title="−1 wrong figure">−1' + (mk.wrong ? ' ×' + mk.wrong : '') + '</button><button class="btn sm ghost" data-rv="' + esc(p.id) + '">' + (PJ.revealed[p.id] ? esc(p.team) : 'who?') + '</button></span>' : '<span class="vote"><button class="btn sm ghost" data-rv="' + esc(p.id) + '">' + (PJ.revealed[p.id] ? esc(p.team) : 'who?') + '</button></span>';
      return '<div class="post asm-post' + (mk.pattern ? ' win' : '') + '"><span class="pn">#' + n + '</span><span class="grow">' + body + auto + '</span>' + votes + '</div>';
    }).join('') : '<div class="empty">Waiting for teams…</div>';
    $$('[data-pt]', host).forEach(function (b) { b.addEventListener('click', function () {
      var id = b.getAttribute('data-pt'), k = b.getAttribute('data-k'), m = PJ.marks[id] || (PJ.marks[id] = { pattern: 0, wrong: 0 });
      if (k === 'pattern') m.pattern = m.pattern ? 0 : 1; else m.wrong = (m.wrong || 0) + 1;
      paintPosts(); paintBoard(); if (PJ.phase === 'reveal') postState();
    }); });
    $$('[data-rv]', host).forEach(function (b) { b.addEventListener('click', function () { PJ.revealed[b.getAttribute('data-rv')] = 1; paintPosts(); }); });
  }
  function paintBoard() {
    var b = $('#pj-board', PJ.host); if (!b) return;
    var sc = scoreNow(), ses = PJ.session.totals, names = {};
    Object.keys(sc.teams).forEach(function (t) { names[t] = 1; }); Object.keys(ses).forEach(function (t) { names[t] = 1; });
    var list = Object.keys(names).map(function (t) { var r = sc.teams[t] || { total: 0, lines: [] }; return { t: t, now: r.total, ses: (ses[t] || 0) + (PJ.phase === 'closed' ? 0 : r.total), lines: r.lines }; });
    list.sort(function (x, y) { return y.ses - x.ses || y.now - x.now; });
    b.innerHTML = list.length ? list.map(function (r, i) { return '<li><span>' + (i + 1) + '. ' + esc(r.t) + '<span class="tiny asm-lines"> ' + esc(r.lines.slice(0, 3).join(' · ')) + '</span></span><b>' + (PJ.phase === 'closed' ? '' : (r.now > 0 ? '+' : '') + r.now + ' · ') + r.ses + '</b></li>'; }).join('') : '<li class="tiny">No points yet.</li>';
    var adj = $('#pj-adj', PJ.host);
    if (adj) adj.innerHTML = '<span class="tiny">Adjust:</span> ' + teams().map(function (t) { return '<span class="asm-adjt">' + esc(t.name.replace('Team ', 'T')) + ' <button class="btn sm ghost" data-adj="' + esc(t.name) + '" data-v="1">+</button><button class="btn sm ghost" data-adj="' + esc(t.name) + '" data-v="-1">−</button></span>'; }).join('');
    $$('[data-adj]', b.parentNode).forEach(function (x) { x.addEventListener('click', function () { var t = x.getAttribute('data-adj'); PJ.adj[t] = (PJ.adj[t] || 0) + parseInt(x.getAttribute('data-v'), 10); paintBoard(); }); });
  }
  /* The round's totals move into the session when it closes. */
  function bankRound() {
    if (PJ.banked) return; PJ.banked = true;
    var sc = scoreNow();
    Object.keys(sc.teams).forEach(function (t) { PJ.session.totals[t] = (PJ.session.totals[t] || 0) + sc.teams[t].total; });
    PJ.posts.forEach(function (p) { (PJ.session.members[p.team] || (PJ.session.members[p.team] = {}))[p.studentId] = 1; });
    PJ.session.rounds.push({ title: PJ.rd.title, teams: sc.teams, round: PJ.round.round });
  }
  /* Post the round's team points to the Teams sheet: every member of the team (Groups tab) plus anyone who posted for it. */
  function postPoints() {
    var sc = scoreNow(), rows = [], ts = new Date().toISOString();
    Object.keys(sc.teams).forEach(function (tn) {
      var pts = sc.teams[tn].total; if (!pts) return;
      var ids = {}, t = teamOf(tn); if (t) t.ids.forEach(function (id) { ids[id] = 1; });
      Object.keys((PJ.session.members || {})[tn] || {}).forEach(function (id) { ids[id] = 1; });
      PJ.posts.forEach(function (p) { if (p.team === tn && p.studentId) ids[p.studentId] = 1; });
      Object.keys(ids).forEach(function (id) { rows.push({ ts: ts, round: PJ.round.round, game: PJ.rd.gameId, lesson: PJ.rd.lesson, team: tn, studentId: id, points: pts, by: 'teacher' }); });
    });
    if (!rows.length) { say('No points to post.'); return; }
    var btn = $('#pj-points', PJ.host); if (btn) { btn.disabled = true; btn.textContent = 'Posting…'; }
    server('asm.points', { rows: rows }).then(function (r) {
      if (r && r.ok) { PJ.posted = true; say((r.local ? 'Kept on this device (offline): ' : 'Posted: ') + rows.length + ' student rows.'); paintProjector(); }
      else { if (btn) { btn.disabled = false; btn.textContent = 'Post points → House Cup'; } say(r && r.hook === false ? 'Assembly.gs is not wired yet (ASM-HOOK in Code.gs): points not posted. ' : 'Not posted: ' + ((r && r.error) || 'try again')); }
    });
  }
  function say(m) { if (global.PCHost && global.PCHost.toast) global.PCHost.toast(m); else if (PJ && PJ.say) PJ.say(m); else try { console.log(m); } catch (e) {} }

  /* ====================================================================
     7. STUDENT — index.html#live
     ==================================================================== */
  var LV = { round: null, rd: null, team: '', state: null, posts: [], mine: {}, tick: null, pollAt: 0, host: null, pc: null, api: null, tally: null, cardSent: {}, bid: null, ticks: [] };
  function lvApi() { return LV.api || global.API; }
  function studentId() { return LV.pc && LV.pc.p ? LV.pc.p.studentId : ''; }
  function mountLive(host, pc, opts) {
    opts = opts || {}; LV.host = host; LV.pc = pc; LV.api = opts.api || global.API; LV.toast = opts.toast;
    if (LV.tick) clearInterval(LV.tick);
    LV.tick = setInterval(liveTick, 500);
    server('asm.tally', { studentId: studentId() }).then(function (r) { if (r && r.ok) { LV.tally = r.mine || 0; var el = $('#lv-tally', host); if (el) el.textContent = 'Your team-mission points this term: ' + LV.tally; } });
    paintLive();
  }
  function unmountLive() { if (LV.tick) clearInterval(LV.tick); LV.tick = null; }
  function lvToast(m) { if (LV.toast) LV.toast(m); else if (LV.pc && LV.pc.toast) LV.pc.toast(m); }
  function paintLive() {
    var host = LV.host; if (!host || host.classList.contains('hidden')) return;
    /* WS-I: preselect the student's own team (Groups tab ids in assembly-content.js) so nobody has to hunt for it in class */
    if (!LV.team && !LV.round) { var sid = lower(studentId()), mt = teams().filter(function (t) { return (t.ids || []).indexOf(sid) >= 0; })[0]; if (mt) LV.team = mt.name; }
    var head = '<div class="sect-h"><div><h2>Assembly</h2><p>T.Chris shows a chart and a round code on the projector. One device per team is enough — the Writer\'s. Enter the code and your team.</p><p class="tiny" id="lv-tally">' + (LV.tally != null ? 'Your team-mission points this term: ' + LV.tally : '') + '</p></div></div>';
    if (!LV.round) {
      host.innerHTML = head + '<div class="card settings asm-join"><div class="field"><label for="lv-code">Round code</label><input id="lv-code" type="text" placeholder="e.g. L7K2Q" spellcheck="false" autocapitalize="characters" style="text-transform:uppercase"></div>' +
        '<div class="field"><label for="lv-team">Team</label><select id="lv-team">' + teams().map(function (t) { return '<option value="' + esc(t.name) + '"' + (t.name === LV.team ? ' selected' : '') + '>' + esc(t.name) + '</option>'; }).join('') + '<option value="__other"' + (LV.team && !teamOf(LV.team) ? ' selected' : '') + '>Another team name…</option></select><input id="lv-team2" type="text" placeholder="Team name" class="' + (LV.team && !teamOf(LV.team) ? '' : 'hidden') + '" value="' + esc(LV.team && !teamOf(LV.team) ? LV.team : '') + '"></div>' +
        '<div id="lv-msg" class="msg bad hidden"></div><button class="btn primary" id="lv-join">Join</button></div>';
      var sel = $('#lv-team', host); sel.addEventListener('change', function () { $('#lv-team2', host).classList.toggle('hidden', sel.value !== '__other'); });
      $('#lv-join', host).addEventListener('click', join);
      $('#lv-code', host).addEventListener('keydown', function (e) { if (e.key === 'Enter') join(); });
      return;
    }
    var rd = LV.rd, pr = promptOf(LV.round.promptId), phase = LV.state ? LV.state.phase : 'lobby';
    host.innerHTML = head + '<div class="card settings asm-live"><div class="asm-live-h"><span class="kicker">Round ' + esc(LV.round.round) + ' · ' + esc(LV.team) + '</span><span class="asm-clock" id="lv-clock"></span></div><h3 class="asm-title">' + esc(rd ? rd.title : LV.round.game) + '</h3>' + (rd && rd.task ? '<p class="asm-task">' + esc(rd.task) + '</p>' : '') +
      '<div id="lv-stage"></div><div id="lv-mine"></div><p class="tiny" id="lv-n"></p><div class="asm-row"><button class="btn ghost sm" id="lv-leave">Leave</button></div></div>';
    $('#lv-leave', host).addEventListener('click', function () { LV.round = null; LV.rd = null; LV.state = null; LV.posts = []; LV.cardSent = {}; LV.bid = null; paintLive(); });
    paintLvStage(); paintMine();
  }
  function join() {
    var host = LV.host, code = $('#lv-code', host).value.trim().toUpperCase(), sel = $('#lv-team', host), team = sel.value === '__other' ? $('#lv-team2', host).value.trim() : sel.value, msg = $('#lv-msg', host);
    if (!code || !team) { msg.classList.remove('hidden'); msg.textContent = 'Enter the code and choose your team.'; return; }
    msg.classList.add('hidden');
    lvApi().projector('list', { round: code }).then(function (r) {
      var rows = (r && r.posts) || [], rdRow = rows.filter(function (x) { return x.kind === 'round' && x.round === code; })[0];
      if (!rdRow) { msg.classList.remove('hidden'); msg.textContent = 'No live round with that code. Check the projector.'; return; }
      LV.round = rdRow; LV.team = normTeam(team); LV.posts = []; LV.cardSent = {}; LV.bid = null; LV.ticks = []; LV.lastCard = -1;
      LV.rd = rdRow.asm ? rounds(rdRow.asm.gameId)[rdRow.asm.ri || 0] || null : null;
      if (LV.rd && rdRow.asm) { if (rdRow.asm.flash && LV.rd.cards) { LV.rd.cards.forEach(function (c) { c.flash = rdRow.asm.flash; c.answer = rdRow.asm.answer; }); } if (rdRow.asm.promptId) LV.rd.promptId = rdRow.asm.promptId; }
      if (!LV.rd) LV.rd = { type: 'post', title: rdRow.game, promptId: rdRow.promptId, seconds: (rdRow.minutes || 3) * 60, gameId: rdRow.game };
      absorb(rows); paintLive();
    });
  }
  function absorb(rows) {
    var st = null;
    rows.forEach(function (x) {
      if (x.kind === 'state' && x.round === LV.round.round && (!st || String(x.ts) > String(st.ts))) st = x;
      if (x.kind === 'post' && x.round === LV.round.round && !LV.posts.some(function (p) { return p.id === x.id; })) { x.team = normTeam(x.team); LV.posts.push(x); }
    });
    var was = LV.state ? LV.state.phase : null;
    if (st) LV.state = st; else if (LV.round.asm && !LV.state) LV.state = { phase: LV.round.asm.phase || 'lobby', t0: LV.round.asm.t0 || 0, marks: {} };
    if (LV.state && LV.state.phase !== was) { paintLvStage(); paintMine(); }
  }
  function liveTick() {
    if (!LV.round || !LV.host || LV.host.classList.contains('hidden')) return;
    var st = LV.state || {}, rd = LV.rd, c = $('#lv-clock', LV.host);
    if (c) { var secs = (LV.round.asm && LV.round.asm.seconds) || rd.seconds || 180, left = st.t0 ? Math.max(0, (st.t0 + secs * 1000 - Date.now()) / 1000) : secs; c.textContent = st.phase === 'run' ? mmss(left) : (st.phase || 'lobby'); c.classList.toggle('low', st.phase === 'run' && left <= 30); }
    if (rd && rd.type === 'choice' && st.phase === 'run') { var ca = cardAt(rd, st.t0, Date.now()); var key = ca ? ca.i + (ca.flashing ? 'f' : 'a') : ''; if (key !== LV.lastCard) { LV.lastCard = key; paintLvStage(); if (ca && !ca.flashing) paintMine(); } }
    var every = st.phase === 'closed' ? 30000 : st.phase === 'lobby' ? 4000 : 8000;
    if (Date.now() - LV.pollAt > every) { LV.pollAt = Date.now(); lvApi().projector('list', { round: LV.round.round }).then(function (r) { if (LV.round) absorb((r && r.posts) || []); }); }
  }
  function sendPost(obj, done) {
    var api = lvApi(), row = { kind: 'post', id: uid('P'), round: LV.round.round, team: LV.team, studentId: studentId(), text: (typeof obj === 'string' ? obj : encode(obj)).slice(0, 900), ts: new Date().toISOString() };
    api.projector('post', row).then(function (res) {
      if (res && res.ok === false) { lvToast('Not posted: ' + (res.error || 'try again')); if (done) done(false); return; }
      LV.posts.push(row); if (done) done(true); paintMine();
    });
  }
  function paintLvStage() {
    var host = LV.host, st = $('#lv-stage', host); if (!st || !LV.rd) return;
    var rd = LV.rd, ph = LV.state ? LV.state.phase : 'lobby', pr = promptOf(rd.promptId);
    if (rd.type === 'choice') {
      if (ph === 'lobby') { st.innerHTML = '<div class="asm-wait">Waiting for T.Chris to start… ' + rd.cards.length + ' cards.' + (rd.flash ? ' Each chart shows ' + rd.flash + ' s; answer fast — after the flash is late (−1).' : '') + '</div>'; return; }
      if (ph !== 'run') { st.innerHTML = '<div class="asm-wait">Round over. Look at the projector for the reveal.</div>'; return; }
      var ca = cardAt(rd, LV.state.t0, Date.now());
      if (!ca || !ca.card) { st.innerHTML = '<div class="asm-wait">All cards done.</div>'; return; }
      var c = ca.card, sent = LV.cardSent[c.n] || {}, done = !!sent.posted;
      st.innerHTML = '<div class="asm-card-h"><span class="kicker">Card ' + c.n + ' / ' + rd.cards.length + '</span><span class="pill ' + (ca.flashing ? 'gold' : '') + '" id="lv-cardt">' + (ca.flashing ? 'LOOK' : 'ANSWER') + '</span></div>' +
        (c.text ? '<p class="asm-cardtext">' + esc(c.text) + '</p>' : '') + (c.chart && ca.flashing ? '<div id="lv-chart"></div>' : '') +
        c.qs.map(function (q) { return '<p class="tiny asm-qlabel">' + esc(q.label) + '</p><div class="asm-opts n' + q.options.length + '">' + q.options.map(function (o) { return '<button class="btn asm-opt' + (sent[q.key] === o ? ' on' : '') + '" data-q="' + esc(q.key) + '" data-o="' + esc(o) + '"' + (done ? ' disabled' : '') + '>' + esc(o) + (q.notes && q.notes[o] ? '<small>' + esc(q.notes[o]) + '</small>' : '') + '</button>'; }).join('') + '</div>'; }).join('') +
        '<p class="tiny" id="lv-cardmsg">' + (done ? 'Sent' + (sent.late ? ' (late)' : '') + '. Result when the card closes.' : 'Tap ' + (c.qs.length > 1 ? 'one option in each row' : 'one option') + ' — it sends by itself.') + '</p>';
      var chartHost = $('#lv-chart', st); if (chartHost && CH) CH.render(chartHost, promptOf(c.promptId), { compact: true, showRubric: false });
      $$('.asm-opt', st).forEach(function (b) { b.addEventListener('click', function () {
        var cur = LV.cardSent[c.n] || (LV.cardSent[c.n] = {}); if (cur.posted) return;
        cur[b.getAttribute('data-q')] = b.getAttribute('data-o');
        $$('.asm-opt[data-q="' + b.getAttribute('data-q') + '"]', st).forEach(function (x) { x.classList.toggle('on', x === b); });
        if (c.qs.every(function (q) { return cur[q.key]; })) {
          var now = cardAt(rd, LV.state.t0, Date.now()), late = !now || now.i !== ca.i || !now.flashing;
          if (c.flash === 0) late = false;
          cur.posted = true; cur.late = late; var picks = {}; c.qs.forEach(function (q) { picks[q.key] = cur[q.key]; });
          $$('.asm-opt', st).forEach(function (x) { x.disabled = true; });
          $('#lv-cardmsg', st).textContent = 'Sent' + (late ? ' (after the flash: late −1)' : '') + '. Result when the card closes.';
          sendPost({ asm: 'choice', card: c.n, picks: picks, late: late, ms: Math.round((now ? now.into : 0) * 1000) });
        }
      }); });
      return;
    }
    var html = pr && CH ? '<div id="lv-chart"></div>' : '';
    if (rd.type === 'checklist' && rd.script) {
      var revealed = ph === 'reveal' || ph === 'closed', sub = LV.posts.filter(function (p) { return p.team === LV.team && decode(p).asm === 'check'; }).pop(), ticks = sub ? decode(sub).ticks : LV.ticks;
      html += '<div class="asm-script"><p class="kicker">' + esc(rd.script.label || 'Script') + '</p>' + (rd.script.paragraphs || []).map(function (pg) { return '<div class="mpara">' + esc(pg) + '</div>'; }).join('') + '</div>' +
        '<div class="asm-check">' + (rd.check || []).map(function (q, i) { var k = rd.script.key[i], t = !!ticks[i]; return '<label class="asm-tick' + (revealed ? (t === !!k ? ' match' : ' miss') : '') + '"><input type="checkbox" data-i="' + i + '"' + (t ? ' checked' : '') + (sub || ph !== 'run' ? ' disabled' : '') + '><span><b>' + (i + 1) + '</b> ' + esc(q) + (revealed ? ' <em>' + (k ? 'key ✓' : 'key ✗') + '</em>' : '') + '</span></label>'; }).join('') + '</div>' +
        (sub ? '<p class="tiny">Submitted. ' + (revealed ? '' : 'Your matches show when T.Chris reveals the key.') + '</p>' : ph === 'run' ? '<button class="btn primary" id="lv-submit">Submit the ten ticks</button>' : '<p class="tiny">' + (ph === 'lobby' ? 'Waiting for T.Chris to start.' : 'Round over.') + '</p>');
    } else if (rd.type === 'bid') {
      var myBid = LV.posts.filter(function (p) { return p.team === LV.team && decode(p).asm === 'bid'; }).pop();
      html += '<div class="asm-script"><p class="kicker">' + esc(rd.pattern) + '</p><p>' + esc(rd.frame) + '</p>' + (rd.rule ? '<p class="tiny">' + esc(rd.rule) + '</p>' : '') + '</div>';
      if (ph === 'lobby') html += '<p class="tiny">Waiting for T.Chris to start.</p>';
      else if (!myBid && ph === 'run') html += '<p class="tiny asm-qlabel">Your bid</p><div class="asm-opts n3">' + [1, 2, 3].map(function (b) { return '<button class="btn asm-opt" data-bid="' + b + '">' + b + '</button>'; }).join('') + '</div><p class="tiny">All figures green + the pattern → you win the bid. Otherwise you lose it.</p>';
      else if (myBid) html += '<p class="asm-bidline">Bid: <b>' + decode(myBid).bid + '</b></p>' + (ph === 'run' ? '<div class="field"><label for="lv-text">Your ONE ' + esc(rd.pattern) + ' sentence</label><textarea id="lv-text" class="ftext" rows="3" spellcheck="false"></textarea></div><button class="btn primary" id="lv-post">Post</button>' : '');
      if (ph !== 'run' && ph !== 'lobby') html += '<p class="tiny">Round over — see the result below and the models on the projector.</p>';
    } else {
      if (rd.relay) html += '<div class="asm-script"><p class="kicker">The task sentence</p><p class="asm-cardtext">' + esc(rd.relay.taskSentence) + '</p></div>';
      html += ph === 'run' || !LV.round.asm ? '<div class="field"><label for="lv-text">Your sentence(s)</label><textarea id="lv-text" class="ftext" rows="4" spellcheck="false"></textarea></div><button class="btn primary" id="lv-post">Post to the projector</button>' : '<p class="tiny">' + (ph === 'lobby' ? 'Waiting for T.Chris to start.' : 'Round over.') + '</p>';
    }
    st.innerHTML = html;
    if (pr && CH && $('#lv-chart', st)) CH.render($('#lv-chart', st), pr, { compact: true });
    var pb = $('#lv-post', st); if (pb) pb.addEventListener('click', function () {
      var t = $('#lv-text', st).value.trim(); if (!t) return; pb.disabled = true;
      sendPost(t, function (ok) { pb.disabled = false; if (ok) { $('#lv-text', st).value = ''; lvToast('Posted.'); if (rd.type === 'bid') paintLvStage(); } });
    });
    $$('[data-bid]', st).forEach(function (b) { b.addEventListener('click', function () { $$('[data-bid]', st).forEach(function (x) { x.disabled = true; }); sendPost({ asm: 'bid', bid: parseInt(b.getAttribute('data-bid'), 10) }, function () { paintLvStage(); }); }); });
    $$('.asm-check input', st).forEach(function (cb) { cb.addEventListener('change', function () { LV.ticks[parseInt(cb.getAttribute('data-i'), 10)] = cb.checked; }); });
    var sb = $('#lv-submit', st); if (sb) sb.addEventListener('click', function () { var ticks = (rd.check || []).map(function (q, i) { return !!LV.ticks[i]; }); sb.disabled = true; sendPost({ asm: 'check', script: rd.script.n, ticks: ticks }, function () { paintLvStage(); }); });
  }
  /* The team's own posts with their auto-marks (never other teams'). */
  function paintMine() {
    var host = LV.host, box = $('#lv-mine', host); if (!box || !LV.rd) return;
    var rd = LV.rd, ph = LV.state ? LV.state.phase : 'lobby', marks = (LV.state && LV.state.marks) || {}, mine = LV.posts.filter(function (p) { return p.team === LV.team; }).sort(sortTs);
    var m = {}; for (var k in marks) if (marks.hasOwnProperty(k)) m[k] = marks[k]; if (ph === 'reveal' || ph === 'closed') m.__reveal = 1;
    var sc = scoreRound(rd, mine, m, {}), t = sc.teams[LV.team] || { total: 0, lines: [] };
    var html = '';
    if (rd.type === 'choice') {
      var ca = ph === 'run' ? cardAt(rd, LV.state.t0, Date.now()) : null, upto = ca && ca.card ? ca.i - 1 : rd.cards.length - 1;
      html = rd.cards.map(function (c, i) { var cm = t.byCard && t.byCard[c.n]; if (i > upto) return ''; if (!cm) return '<span class="asm-fig none">' + c.n + ' —</span>'; return '<span class="asm-fig ' + (cm.points > 0 ? 'ok' : cm.points < 0 ? 'bad' : 'near') + '" title="' + esc(cm.qs.map(function (q) { return q.label + ' ' + (q.ok ? '✓' : '✗'); }).join(' · ')) + '">' + c.n + ' ' + (cm.points > 0 ? '+' : '') + cm.points + '</span>'; }).join('');
      box.innerHTML = html ? '<div class="asm-marks">' + html + '</div><p class="asm-total">Team total so far: <b>' + t.total + '</b></p>' : '';
      return;
    }
    mine.slice().reverse().forEach(function (p) {
      var info = sc.posts[p.id] || {};
      if (info.kind === 'bid') return;
      if (info.kind === 'check') { html += '<div class="asm-mypost"><span class="asm-bidchip">' + (ph === 'reveal' || ph === 'closed' ? info.cm.matches + ' of ' + info.cm.total + ' match the key → +' + info.cm.points : 'Ticks sent') + '</span></div>'; return; }
      if (info.kind === 'ignore') return;
      var auto = info.dc ? markChips(info.dc) : '';
      if (info.relay) auto = '<span class="asm-fig ' + (info.relay.copied ? 'bad' : 'ok') + '" title="longest run of words copied from the task sentence">copied run ' + info.relay.run + (info.relay.copied ? ' ✗' : ' ✓') + '</span>' + ['visual', 'what', 'where', 'when', 'units'].map(function (k) { return '<span class="asm-fig ' + (info.relay.missing.indexOf(k) >= 0 ? 'near' : 'ok') + '">' + k + (info.relay.missing.indexOf(k) >= 0 ? ' ?' : ' ✓') + '</span>'; }).join('') + '<span class="asm-fig none">' + info.relay.words + ' words</span>';
      var mk = marks[p.id] || {};
      html += '<div class="asm-mypost"><div>' + esc(info.text) + '</div><div class="asm-marks">' + auto + (mk.pattern ? '<span class="asm-sent ok">+1 pattern</span>' : '') + (mk.wrong ? '<span class="asm-sent no">−' + mk.wrong + '</span>' : '') + (info.result ? '<span class="asm-sent ' + (info.result.win ? 'ok' : 'no') + '">' + (info.result.win ? 'You win ' : 'You lose ') + info.result.bid + '</span>' : '') + '</div></div>';
    });
    box.innerHTML = (html ? '<p class="kicker">Your posts</p>' + html : '') + (mine.length ? '<p class="asm-total">' + (rd.type === 'bid' && !m.__reveal ? 'Waiting for the reveal.' : 'Team total this round: <b>' + t.total + '</b>' + (t.lines.length ? ' <span class="tiny">' + esc(t.lines.join(' · ')) + '</span>' : '')) + '</p>' : '');
    var n = $('#lv-n', host); if (n) n.textContent = mine.length ? mine.length + ' posted.' : '';
  }

  /* ====================================================================
     8. EXPORTS
     ==================================================================== */
  global.Assembly = {
    version: function () { return content().version; },
    games: gameList, game: game, rounds: rounds, teams: teams, teamOf: teamOf, normTeam: normTeam, TYPES: TYPES,
    dataCheck: dataCheck, checkSentence: checkSentence, relayCheck: relayCheck, choiceMark: choiceMark, checklistMark: checklistMark, bidResolve: bidResolve,
    encode: encode, decode: decode, scoreRound: scoreRound, cardAt: cardAt,
    server: server, setTeacherToken: function (t) { teacherToken = t || null; },
    paintHome: paintHome, openProjector: openProjector, closeProjector: closeProjector, projector: function () { return PJ; },
    mountLive: mountLive, unmountLive: unmountLive, live: function () { return LV; }
  };
})(typeof window !== 'undefined' ? window : this);
