/* ===========================================================================
   CHART CONTROL — writer.js
   The timed Task 1 editor and the rule-based "pre-flight" structural check.

   Writer.preflight(text, prompt)         → { rows:[{id,tag,status,label,note}], words, paras, summary }
   Writer.checkOverview(text, item)       → { ok, notes[] }        (module items)
   Writer.checkClaim(text, item)          → { ok, notes[] }
   Writer.checkPara(text, item, prompt)   → { ok, notes[] }
   Writer.mount(host, { prompt, mode:'guided'|'exam', minutes, cards, onSubmit, onQuit })
   Writer.markingPrompt(prompt, text, pre) → the text sent to the AI marker

   These are checks, not marks: every rule is a tolerant heuristic and is
   labelled as such on screen.
   =========================================================================== */
(function (global) {
  'use strict';

  var C = global.CONTENT;
  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function words(t) { var m = String(t || '').trim().match(/[A-Za-z0-9][A-Za-z0-9'’.,%$-]*/g); return m ? m.length : 0; }
  function sentences(t) { return String(t || '').split(/(?<=[.!?])\s+/).map(function (s) { return s.trim(); }).filter(Boolean); }
  function paragraphs(t) {
    var ps = String(t || '').replace(/\r/g, '').split(/\n\s*\n/).map(function (s) { return s.trim(); }).filter(Boolean);
    if (ps.length === 1) ps = String(t || '').split(/\n/).map(function (s) { return s.trim(); }).filter(Boolean);
    return ps;
  }
  function lower(t) { return String(t || '').toLowerCase(); }
  function hasDigit(s) { return /\d/.test(s.replace(/\b(19|20)\d\d\b/g, '')); }
  function hasAnyDigit(s) { return /\d|%/.test(s); }

  var OVERVIEW_START = /^(overall|in general|generally|it is clear that|it can be seen that|it is noticeable that|it is evident that)/i;
  var COMPARE_WORDS = /\b(than|whereas|while|compared (with|to)|respectively|twice|three times|four times|five times|double|doubled|half|halved|similar|in contrast|by contrast|however|the same|as (high|low|many|much|large|small|popular) as|the highest|the lowest|the largest|the smallest|the most|the least|both|far (higher|lower|more|less)|slightly (higher|lower|more|less))\b/gi;
  var SEQ_WORDS = /\b(first|firstly|at the first stage|next|then|after (that|this|which)|following (this|that)|once|subsequently|before being|finally|in the final stage|at the (second|third|fourth|fifth|following|next) stage|the process begins|the cycle)\b/gi;
  var TREND_PRESENT = /\b(rises|increases|grows|climbs|falls|drops|decreases|declines|fluctuates|peaks|remains|stays)\b/gi;
  var TREND_PAST_IN_PROCESS = /\b(was|were) (heated|collected|mixed|transported|sorted|crushed|melted|cut|dried|packaged|delivered|filtered|cooled|added|removed|placed|poured|laid|hatched)\b/gi;
  var BANNED = [
    { re: /\b(i think|in my opinion|i believe|personally|we can see|as we can see|you can see|as you can see|it is obvious that)\b/i, tag: 'lr-register', label: 'Personal or informal phrase', note: 'Keep it impersonal: no I / we / you, no "as we can see".' },
    { re: /\b(because|due to the fact|the reason|this is because|as a result of people)\b/i, tag: 'ta-opinion', label: 'Reason or explanation added', note: 'Report what the chart shows, not why. Reasons are irrelevant material.' },
    { re: /\b(in conclusion|to conclude|to sum up|in summary|all in all)\b/i, tag: 'ta-conclusion', label: 'Conclusion written', note: 'Task 1 has no conclusion — the overview does the summarising. Delete it or move it to paragraph two as an overview.' },
    { re: /\b(surprisingly|unfortunately|sadly|luckily|interestingly|good|bad|shocking|amazing)\b/i, tag: 'ta-opinion', label: 'Evaluative word', note: 'No judgement words in a factual report.' },
    { re: /\b(\w+n't|it's|there's|that's|they're|we're|isn't|aren't|doesn't|didn't)\b/i, tag: 'lr-register', label: 'Contraction', note: 'Write the full form: it is, did not, there was.' },
    { re: /!/, tag: 'lr-register', label: 'Exclamation mark', note: 'No exclamation marks in a report.' }
  ];

  /* Longest run of consecutive words shared with the rubric. */
  function overlap(text, rubric) {
    var a = lower(text).replace(/[^a-z0-9 ]/g, ' ').split(/\s+/).filter(Boolean);
    var b = lower(rubric).replace(/[^a-z0-9 ]/g, ' ').split(/\s+/).filter(Boolean);
    var best = 0;
    for (var i = 0; i < a.length; i++) {
      for (var j = 0; j < b.length; j++) {
        var k = 0;
        while (i + k < a.length && j + k < b.length && a[i + k] === b[j + k]) k++;
        if (k > best) best = k;
      }
    }
    return best;
  }
  function labelKey(l) {
    var w = lower(l).replace(/[^a-z0-9 –-]/g, ' ').split(/\s+/).filter(function (x) { return x.length > 2 && ['the', 'and', 'of', 'with', 'for'].indexOf(x) < 0; });
    return w.length ? w : [lower(l)];
  }
  var SYN = { wash: ['clean'], sort: ['separat'], crush: ['broken', 'fragment'], mould: ['mold', 'shape'], deliver: ['shops', 'distribut'], transport: ['lorry', 'truck', 'taken to'], incubation: ['warmed', 'incubat', 'days'], juveniles: ['young', 'juvenile'], hatchlings: ['hatch'], adults: ['adult', 'mature'], return: ['returns', 'comes back', 'back to'], eggs: ['egg'], legs: ['leg'], adult: ['mature', 'grown'], tadpole: ['tadpole'], froglet: ['froglet', 'young frog'] };
  function mentions(text, label) {
    var t = lower(text).replace(/[\u2013\u2014-]/g, ' ');
    var keys = labelKey(label.replace(/\+/, ' and over')).concat(SYN[lower(label)] || []);
    if (/\d/.test(label)) {
      var nums = label.match(/\d+/g) || [];
      if (nums.every(function (nn) { return t.indexOf(nn) >= 0; })) return true;
    }
    return keys.some(function (k) { return t.indexOf(k.replace(/s$/, '').replace(/[\u2013\u2014-]/g, ' ')) >= 0; });
  }
  function promptOf(x) { return typeof x === 'string' ? global.Charts.prompt(x) : x; }

  /* ----------------------------------------------------------- preflight */
  function preflight(text, promptOrId) {
    var p = promptOf(promptOrId) || {};
    var mode = p.mode || 'TREND';
    var rows = [];
    function add(id, tag, status, label, note) { rows.push({ id: id, tag: tag, status: status, label: label, note: note }); }

    var ps = paragraphs(text), n = words(text);

    /* length */
    add('length', 'struct-length', n < 150 ? 'bad' : n <= 200 ? 'ok' : 'warn', 'Length: ' + n + ' words',
      n < 150 ? 'Under 150 words loses marks. Add a comparison or a second group of figures.' : n <= 200 ? 'In the 150–200 target.' : 'Over 200 words costs time. Cut the least important figures.');

    /* paragraphs */
    add('paras', 'cc-paragraphing', ps.length >= 3 && ps.length <= 5 ? 'ok' : 'bad', 'Paragraphs: ' + ps.length,
      ps.length >= 3 && ps.length <= 5 ? 'Four paragraphs is the flight plan: intro, overview, detail A, detail B.' : ps.length < 3 ? 'Split the report into four paragraphs: intro, overview, detail A, detail B. Leave a blank line between them.' : 'Too many paragraphs — merge the details into two groups.');

    /* overview */
    var ovIdx = -1;
    ps.forEach(function (q, i) { if (ovIdx < 0 && OVERVIEW_START.test(q)) ovIdx = i; });
    if (ovIdx < 0) {
      add('overview', 'ta-no-overview', 'bad', 'No overview found', 'Start paragraph two with "Overall," and give two or three general truths. Without it TA is capped near Band 5.');
    } else {
      var ov = ps[ovIdx];
      var pos = ovIdx === 1 ? 'ok' : ovIdx === ps.length - 1 ? 'warn' : 'warn';
      add('overview', 'ta-no-overview', pos, 'Overview in paragraph ' + (ovIdx + 1), ovIdx === 1 ? 'Second paragraph — the safest place.' : 'An overview at the end is allowed, but paragraph two is safer if time runs out.');
      var ovClean = ov;
      (String(p.rubric || '') + ' ' + ((p.data && p.data.cols) || []).join(' ')).replace(/\d+/g, function (num) { ovClean = ovClean.split(num).join(''); });
      add('ov-figures', 'ta-overview-figures', hasDigit(ovClean) ? 'bad' : 'ok', hasDigit(ov) ? 'Figures in the overview' : 'Overview is general',
        hasDigit(ovClean) ? 'Move the numbers to the detail paragraphs. Dates and names are fine; figures are not.' : 'No figures — good. Names and dates only.');
      var ovw = words(ov);
      add('ov-length', 'ta-overview-vague', ovw >= 20 && ovw <= 70 ? 'ok' : 'warn', 'Overview length: ' + ovw + ' words',
        ovw < 20 ? 'Too short to cover two or three main features. One sentence is rarely enough.' : ovw > 70 ? 'Long for an overview — keep the general truths, cut the rest.' : 'Two or three sentences — right.');
      if (p.keyFeatures && p.keyFeatures.length) {
        var kf = p.keyFeatures.filter(function (f) {
          var keys = labelKey(f).filter(function (k) { return k.length > 4; });
          var hit = keys.filter(function (k) { return lower(ov).indexOf(k) >= 0; }).length;
          return keys.length && hit / keys.length >= 0.34;
        }).length;
        add('ov-content', 'ta-overview-vague', kf >= 2 ? 'ok' : kf === 1 ? 'warn' : 'warn', 'Main features named: about ' + kf,
          kf >= 2 ? 'The overview points at the big picture.' : 'Name the main trend or difference in words: what rose, what fell, what was largest, what stayed the same.');
      }
    }

    /* body paragraphs: data support */
    var body = ps.filter(function (q, i) { return i !== 0 && i !== ovIdx; });
    var bodySent = [];
    body.forEach(function (q) { bodySent = bodySent.concat(sentences(q)); });
    if (bodySent.length) {
      if (mode === 'TREND' || mode === 'COMPARE') {
        var withNum = bodySent.filter(hasAnyDigit).length, ratio = withNum / bodySent.length;
        add('data', 'ta-no-data', ratio >= 0.6 ? 'ok' : ratio >= 0.3 ? 'warn' : 'bad', 'Data in body sentences: ' + withNum + ' of ' + bodySent.length,
          ratio >= 0.6 ? 'Claims are supported with figures.' : 'Every detail sentence needs a figure, a date or a label from the chart. Without data the examiner reads opinions.');
      } else {
        var labs = p.labels || [];
        var withLab = bodySent.filter(function (s) { return labs.some(function (l) { return mentions(s, l); }); }).length;
        var r2 = withLab / bodySent.length;
        add('data', 'ta-no-data', r2 >= 0.5 ? 'ok' : r2 >= 0.3 ? 'warn' : 'bad', 'Body sentences naming a stage or feature: ' + withLab + ' of ' + bodySent.length,
          r2 >= 0.5 ? 'Each sentence is anchored to the diagram.' : 'Name the stage, place or feature in every sentence so the reader can follow the diagram.');
      }
    }

    /* comparison / sequencing */
    if (mode === 'SEQUENCE') {
      var sq = (String(text).match(SEQ_WORDS) || []).length;
      add('sequence', 'cc-sequencers', sq >= 3 ? 'ok' : sq >= 1 ? 'warn' : 'bad', 'Sequencers: ' + sq, sq >= 3 ? 'The reader can follow the order of stages.' : 'Use at the first stage / next / once … / after which / before being … / finally.');
    } else {
      var cm = (String(text).match(COMPARE_WORDS) || []).length;
      add('compare', 'ta-no-comparison', cm >= 2 ? 'ok' : cm === 1 ? 'warn' : 'bad', 'Comparisons: ' + cm, cm >= 2 ? 'Comparisons are present.' : 'Add comparisons: than, as … as, whereas, compared with, respectively, twice as many.');
    }

    /* rubric copying */
    if (p.rubric) {
      var ol = overlap(text, p.rubric), rl = words(p.rubric);
      var copied = ol >= Math.max(10, Math.round(rl * 0.8));
      add('rubric', 'lr-copied-rubric', copied ? 'bad' : ol >= 9 ? 'warn' : 'ok', 'Longest run copied from the task: ' + ol + ' words',
        copied ? 'Copied rubric is not counted. Paraphrase: shows → illustrates, the number of → how many, between … and → over the period from ….' : ol >= 9 ? 'Close to the rubric — change the verb and the shape of the sentence.' : 'Paraphrased — good.');
    }

    /* banned register */
    BANNED.forEach(function (b, i) {
      var m = String(text).match(b.re);
      if (m) add('ban' + i, b.tag, 'bad', b.label + ': "' + m[0] + '"', b.note);
    });

    /* coverage */
    if (p.labels && p.labels.length) {
      var missing = p.labels.filter(function (l) { return !mentions(text, l); });
      var soft = mode === 'SEQUENCE' || mode === 'SPACE';
      add('coverage', 'ta-missing-category', missing.length === 0 ? 'ok' : (soft && missing.length <= 2) || (missing.length <= 1 && p.labels.length > 4) ? 'warn' : 'bad',
        missing.length ? 'Not mentioned: ' + missing.slice(0, 4).join(', ') : 'Every category is mentioned',
        missing.length ? 'Mention every category or stage at least once. The examiner notices what is missing.' : 'Nothing missing.');
    }

    /* tense */
    if (mode === 'TREND' && !p.data.projectedFrom) {
      var pres = (String(text).match(TREND_PRESENT) || []).length;
      var xs = (p.data && (p.data.x || p.data.categories)) || [];
      var lastYear = xs.length ? parseInt(xs[xs.length - 1], 10) : 0;
      if (lastYear && lastYear < new Date().getFullYear() && pres >= 2) add('tense', 'gra-tense', 'warn', 'Present-tense trend verbs: ' + pres, 'The dates are in the past, so use the past simple: rose, fell, remained.');
    }
    if (mode === 'SEQUENCE') {
      var pastp = (String(text).match(TREND_PAST_IN_PROCESS) || []).length;
      if (pastp >= 2) add('tense', 'gra-tense', 'warn', 'Past tense in a process: ' + pastp, 'A process with no dates takes the present simple: is heated, are collected.');
    }

    /* number / amount */
    var na = String(text).match(/\bamount of (\w+s)\b/i);
    if (na && !/(minutes|hours|years|days|weeks)/i.test(na[1])) add('amount', 'lr-number-amount', 'warn', '"amount of ' + na[1] + '"', 'Countable nouns take "the number of"; "the amount of" is for money, energy, time, water.');
    var nu = String(text).match(/\bnumber of (money|energy|time|water|electricity|rice|oil|waste|rainfall|coffee|rent)\b/i);
    if (nu) add('number', 'lr-number-amount', 'warn', '"number of ' + nu[1] + '"', 'Uncountable nouns take "the amount of".');

    /* prepositions with figures */
    var pp = String(text).match(/\b(rose|increased|grew|climbed|fell|dropped|decreased|declined|peaked|stood) (at|in|of|on) (\d|about|around|approximately|just|roughly|nearly|almost)/i);
    if (pp && !/^(peaked|stood) at/i.test(pp[0])) add('prep', 'gra-prep-figure', 'warn', 'Preposition with a figure: "' + pp[0] + '"', 'rose TO (end point), rose BY (size of change), rose FROM … TO …, peaked AT, stood AT.');

    var bad = rows.filter(function (r) { return r.status === 'bad'; }).length;
    var warn = rows.filter(function (r) { return r.status === 'warn'; }).length;
    return { rows: rows, words: n, paras: ps.length, bad: bad, warn: warn,
      summary: bad === 0 && warn === 0 ? 'All green. Pre-flight perfect.' : bad === 0 ? 'No red rows — ' + warn + ' to look at.' : bad + ' red row' + (bad > 1 ? 's' : '') + ' to fix before you submit.' };
  }

  /* ------------------------------------------------ module free-text items */
  function checkOverview(text, item) {
    var notes = [], ok = true;
    var t = String(text || '').trim(), n = words(t);
    if (!OVERVIEW_START.test(t)) { ok = false; notes.push('Start with "Overall," (or "In general,").'); }
    if (hasDigit(t)) { ok = false; notes.push('No figures in the overview — dates and names only.'); }
    var min = item.minWords || 20, max = item.maxWords || 70;
    if (n < min) { ok = false; notes.push('Too short: ' + n + ' words. Aim for two or three sentences (' + min + '–' + max + ' words).'); }
    if (n > max) { ok = false; notes.push('Too long: ' + n + ' words. Keep the general truths, cut the rest.'); }
    var lt = lower(t);
    (item.must || []).forEach(function (group) {
      if (!group.some(function (k) { return lt.indexOf(k.toLowerCase()) >= 0; })) { ok = false; notes.push('Missing a main feature: mention ' + group[0] + '.'); }
    });
    var bans = BANNED.filter(function (b) { return b.re.test(t); });
    if (bans.length) { ok = false; notes.push(bans[0].note); }
    if (ok) notes.push('Starts with Overall, no figures, names the main features. That is an overview.');
    return { ok: ok, notes: notes };
  }
  function checkClaim(text, item) {
    var notes = [], ok = true, t = String(text || '').trim(), lt = lower(t);
    if (!hasAnyDigit(t)) { ok = false; notes.push('No figure. Every detail sentence carries a number, a percentage or a date.'); }
    if (!(item.labels || []).some(function (l) { return lt.indexOf(l.toLowerCase()) >= 0; })) { ok = false; notes.push('Name the category (' + (item.labels || []).slice(0, 3).join(' / ') + ').'); }
    if (!(item.verbs || []).some(function (v) { return lt.indexOf(v.toLowerCase()) >= 0; })) { ok = false; notes.push('Use a trend or comparison word: ' + (item.verbs || []).slice(0, 4).join(', ') + '.'); }
    if (words(t) < 6) { ok = false; notes.push('Write a full sentence.'); }
    if (sentences(t).length > 2) { ok = false; notes.push('One sentence only.'); }
    var bans = BANNED.filter(function (b) { return b.re.test(t); });
    if (bans.length) { ok = false; notes.push(bans[0].note); }
    if (ok) notes.push('Claim + number + category. Exactly what a detail sentence needs.');
    return { ok: ok, notes: notes };
  }
  function checkPara(text, item) {
    var p = promptOf(item.chart) || { mode: item.mode, labels: [] };
    var t = String(text || '').trim(), n = words(t), notes = [], ok = true;
    var min = item.minWords || 40, max = item.maxWords || 90;
    if (n < min) { ok = false; notes.push('Too short: ' + n + ' words (aim ' + min + '–' + max + ').'); }
    if (n > max) { ok = false; notes.push('Too long: ' + n + ' words (aim ' + min + '–' + max + ').'); }
    var ss = sentences(t), mode = item.mode || p.mode;
    if (mode === 'TREND' || mode === 'COMPARE') {
      var wn = ss.filter(hasAnyDigit).length;
      if (ss.length && wn / ss.length < 0.6) { ok = false; notes.push('Only ' + wn + ' of ' + ss.length + ' sentences carry a figure. Every detail sentence needs data.'); }
      var cm = (t.match(COMPARE_WORDS) || []).length;
      if (cm < 1) { ok = false; notes.push('Add at least one comparison (than, whereas, respectively, twice as …).'); }
    } else if (mode === 'SEQUENCE') {
      var sq = (t.match(SEQ_WORDS) || []).length;
      if (sq < 2) { ok = false; notes.push('Use sequencers: at the first stage, next, once …, after which, finally.'); }
      if (!/\b(is|are) \w+ed\b|\b(is|are) (\w+en|made|cut|put|fed|sent|kept|built)\b/i.test(t)) { ok = false; notes.push('Use the present simple passive for a man-made process: is heated, are collected.'); }
    } else if (mode === 'SPACE') {
      if (!/\b(north|south|east|west|centre|center|adjacent|opposite|next to|along)\b/i.test(t)) { ok = false; notes.push('Say where: to the north of, in the south-east, adjacent to.'); }
      if (!/\b(was|were|has been|have been|will be|is to be) (built|demolished|converted|extended|replaced|removed|added|relocated|constructed|pedestrianised|knocked|turned|redeveloped|expanded)\b/i.test(t)) { ok = false; notes.push('Use a change verb in the passive: was demolished, has been converted into, will be built.'); }
    }
    if (OVERVIEW_START.test(t)) { ok = false; notes.push('This is a detail paragraph, not the overview — do not start with "Overall".'); }
    var bans = BANNED.filter(function (b) { return b.re.test(t); });
    if (bans.length) { ok = false; notes.push(bans[0].note); }
    if (ok) notes.push('Grouped, supported and compared. A solid detail paragraph.');
    return { ok: ok, notes: notes };
  }

  /* ------------------------------------------------------- AI marking */
  function markingPrompt(p, text, pre) {
    var gates = [
      'Task Achievement gates: 5→6 overview attempted + details supported with figures; 6→7 overview clear, data categorised, main trends/differences identified, accurate; 7→8 key features skilfully selected and illustrated.',
      'Coherence & Cohesion: 5→6 clear overall progression; 6→7 logical organisation with flexible reference/substitution; 7→8 followed with ease, cohesion invisible, paragraphing apt.',
      'Lexical Resource: 5→6 adequate range; 6→7 some flexibility and precision, collocation awareness, some less common items; 7→8 wide, precise, skilful.',
      'Grammatical Range & Accuracy: 5→6 mix of simple and complex, errors do not impede; 6→7 variety of complex structures, error-free sentences frequent; 7→8 wide range, majority error-free, punctuation controlled.',
      'Deductions: opinion, reasons, conclusion, copied rubric or a missing category → −1 TA; under 150 words → cap TA at 5.'
    ];
    return 'You are an IELTS Academic Writing Task 1 examiner and a warm English teacher (T.Chris) at a Thai secondary school. ' +
      'Mark the student report below against the public band descriptors. Walk each criterion up its gates and stop at the first unmet gate.\n\n' +
      gates.join('\n') + '\n\nTHE TASK\n' + global.Charts.describe(p) + '\n\nSTRUCTURAL CHECK (rule-based, for reference)\n' +
      (pre ? pre.rows.map(function (r) { return '- [' + r.status + '] ' + r.label; }).join('\n') : '') +
      '\n\nSTUDENT REPORT (' + words(text) + ' words)\n' + text +
      '\n\nReturn ONLY JSON: {"ta":6.0,"cc":6.0,"lr":6.0,"gra":6.0,"overall":6.0,"cefr":"B2","errors":[{"quote":"…","tag":"gra-tense","fix":"…"}],"comment":"…"}. ' +
      'Bands in half steps. "errors": up to five, each quoting the student\'s words, a tag from this list [' + Object.keys(C.REMEDIATION).join(', ') + '] and a concrete fix. ' +
      '"comment": 100–150 words in T.Chris\'s voice: open with the student\'s nickname, a comma, then one specific praise ending with an exclamation mark; quote the student\'s own words in single quotes; state the level plainly ("Your writing is around B1 level"); name error types by grammatical label; give replacement words; pivot with "However," / "Just ensure" / "Also look at" / "Finally,"; frame improvement as the next gate; close warmly. No markdown.';
  }

  /* ---------------------------------------------------------------- UI */
  var CARDS = {
    intro: { t: 'P1 · Introduction (about 30 words)', b: 'The [line graph / bar chart / table / diagram / maps] [shows / illustrates / compares] [what] in [where] [between Y1 and Y2 / in YEAR]. [Units are given in ___.]' },
    overview: { t: 'P2 · Overview (about 45 words, no figures)', b: 'Overall, [the biggest general truth], while/whereas [a contrasting truth]. [A second sentence: what was largest / smallest / stayed the same / how many stages / how the area changed.]' },
    TREND: { t: 'P3/P4 · Details — TREND kit', b: '[A] rose/fell [sharply/steadily/slightly] from [X] in [Y1] to [Y] in [Y2]. · There was a [dramatic] rise in [A], from [X] to [Y]. · [A] peaked at [X] in [year] before falling to [Y]. · In contrast, [B] remained stable at around [X]. · [A] is projected to reach [X] by [year].' },
    COMPARE: { t: 'P3/P4 · Details — COMPARE kit', b: '[A] was far/slightly higher than [B], at [X] and [Y] respectively. · [A] was twice/three times as high as [B]. · [A] accounted for [just over a third] of the total. · At the other end of the scale, [D] recorded only [X]. · The only exception was ___.' },
    SEQUENCE: { t: 'P3/P4 · Details — SEQUENCE kit', b: 'At the first stage, [material] is [collected/heated/mixed] [in/by equipment]. · Next, it is [pp] before being [pp]. · Once [it] has been [pp], it passes into ___. · Finally, the [product] is [packaged/delivered], after which the cycle begins again.' },
    SPACE: { t: 'P3/P4 · Details — SPACE kit', b: 'In [Y1], the [feature] to the [north] of [landmark] was ___. · By [Y2] this had been [converted into / replaced by] ___. · A new [feature] was built [adjacent to] ___. · The [river/road] remains unchanged, although ___. · [A ___ will be constructed on the site of ___.]' }
  };

  function mmss(s) { var m = Math.floor(s / 60), x = s % 60; return m + ':' + (x < 10 ? '0' : '') + x; }

  function mount(host, cfg) {
    var p = promptOf(cfg.prompt);
    var guided = cfg.mode !== 'exam';
    var minutes = cfg.minutes || 20, total = minutes * 60;
    var state = { t0: Date.now(), left: total, done: false, picks: [], revision: 0, tick: null, submitted: null, phase: 0 };
    var PHASES = [['Triage', 30], ['Plan', 210], ['Write', 960], ['Check', 1200]];
    var html = '<div class="wr">' +
      '<div class="wr-top">' +
        '<button class="btn ghost sm" id="wr-quit">✕</button>' +
        '<div class="wr-phases" id="wr-phases">' + PHASES.map(function (ph, i) { return '<span data-i="' + i + '">' + ph[0] + '</span>'; }).join('') + '</div>' +
        '<span class="wr-words" id="wr-words">0 words</span>' +
        '<span class="wr-clock" id="wr-clock">' + mmss(total) + '</span>' +
      '</div>' +
      '<div class="wr-grid">' +
        '<div class="wr-left"><div id="wr-chart"></div>' +
          (guided ? '<div class="card wr-plan"><p class="kicker">Plan (not counted)</p>' +
            '<div class="wr-planrow"><label>Mode</label><span class="wr-mode">' + esc(p.mode) + '</span></div>' +
            '<div class="wr-planrow"><label for="wr-ga">Group A</label><input id="wr-ga" placeholder="e.g. the two that rose"></div>' +
            '<div class="wr-planrow"><label for="wr-gb">Group B</label><input id="wr-gb" placeholder="e.g. the one that fell"></div>' +
            '<p class="tiny">Tap values on the chart to collect the figures you will use.</p><ul class="wr-picks" id="wr-picks"></ul></div>' : '') +
        '</div>' +
        '<div class="wr-right">' +
          (guided
            ? ['intro', 'overview', 'a', 'b'].map(function (k, i) {
                var card = k === 'intro' ? CARDS.intro : k === 'overview' ? CARDS.overview : CARDS[p.mode] || CARDS.TREND;
                var label = k === 'intro' ? 'Introduction' : k === 'overview' ? 'Overview' : k === 'a' ? 'Detail A' : 'Detail B';
                var target = [30, 45, 60, 60][i];
                return '<div class="wr-box"><div class="wr-boxh"><b>' + label + '</b><span class="tiny">~' + target + ' words · <i id="wr-w' + i + '">0</i></span>' +
                  (cfg.cards !== false ? '<button class="linky" data-card="' + i + '">pattern</button>' : '') + '</div>' +
                  (cfg.cards !== false ? '<div class="wr-card hidden" id="wr-card' + i + '"><b>' + esc(card.t) + '</b><p>' + esc(card.b) + '</p></div>' : '') +
                  '<textarea id="wr-t' + i + '" rows="' + (i < 2 ? 3 : 5) + '" spellcheck="false" placeholder="' + (k === 'overview' ? 'Overall, …' : '') + '"></textarea></div>';
              }).join('')
            : '<div class="wr-box"><textarea id="wr-t0" rows="18" spellcheck="false" placeholder="Write your report here. Leave a blank line between paragraphs."></textarea></div>') +
          '<div class="qfoot"><span class="tiny" id="wr-note">Checks, not marks: the panel looks at structure only.</span><span class="grow"></span>' +
          '<button class="btn primary" id="wr-check">Pre-flight check →</button></div>' +
          '<div id="wr-panel"></div>' +
        '</div>' +
      '</div></div>';
    host.innerHTML = html;

    global.Charts.render(host.querySelector('#wr-chart'), p, { readout: true, onPick: function (t) {
      if (!guided) return;
      if (state.picks.indexOf(t) < 0) state.picks.push(t);
      host.querySelector('#wr-picks').innerHTML = state.picks.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('');
    } });

    var areas = Array.prototype.slice.call(host.querySelectorAll('textarea'));
    function text() {
      return guided ? areas.map(function (a) { return a.value.trim(); }).filter(Boolean).join('\n\n') : areas[0].value;
    }
    function count() {
      var n = words(text());
      host.querySelector('#wr-words').textContent = n + ' words';
      if (guided) areas.forEach(function (a, i) { host.querySelector('#wr-w' + i).textContent = words(a.value); });
    }
    areas.forEach(function (a) { a.addEventListener('input', count); });
    host.querySelectorAll('[data-card]').forEach(function (b) {
      b.addEventListener('click', function () { host.querySelector('#wr-card' + b.dataset.card).classList.toggle('hidden'); });
    });

    function paintPhase() {
      var el = (total - state.left);
      var idx = 0; PHASES.forEach(function (ph, i) { if (el >= (i ? PHASES[i - 1][1] : 0)) idx = i; });
      host.querySelectorAll('#wr-phases span').forEach(function (s, i) { s.classList.toggle('on', i === idx); s.classList.toggle('past', i < idx); });
    }
    state.tick = setInterval(function () {
      state.left = Math.max(0, total - Math.round((Date.now() - state.t0) / 1000));
      var c = host.querySelector('#wr-clock'); if (!c) { clearInterval(state.tick); return; }
      c.textContent = mmss(state.left);
      c.classList.toggle('low', state.left <= 120);
      paintPhase();
      if (state.left === 0 && !state.done) { finish(true); }
    }, 500);

    function stop() { clearInterval(state.tick); }
    host.querySelector('#wr-quit').addEventListener('click', function () {
      if (words(text()) > 20 && !confirm('Leave now? This report will not be saved.')) return;
      stop(); if (cfg.onQuit) cfg.onQuit();
    });

    function showPanel(pre, canRevise) {
      var pn = host.querySelector('#wr-panel');
      pn.innerHTML = '<div class="card preflight"><div class="pf-h"><b>Pre-flight check</b><span class="pill ' + (pre.bad ? 'bad' : pre.warn ? 'gold' : 'good') + '">' + esc(pre.summary) + '</span></div>' +
        pre.rows.map(function (r) {
          var rem = C.REMEDIATION[r.tag] || {};
          return '<div class="pf-row ' + r.status + '"><span class="pf-dot"></span><div><b>' + esc(r.label) + '</b><p>' + esc(r.note) + '</p></div></div>';
        }).join('') +
        '<div class="qfoot" style="margin-top:12px">' +
          (canRevise ? '<button class="btn" id="wr-revise">Revise once</button>' : '') +
          '<span class="grow"></span><button class="btn primary" id="wr-submit">Submit report</button></div></div>';
      pn.scrollIntoView({ behavior: 'smooth', block: 'start' });
      var rv = pn.querySelector('#wr-revise');
      if (rv) rv.addEventListener('click', function () { state.revision = 1; state.firstText = text(); state.firstPre = pre; pn.innerHTML = ''; areas[0].focus(); });
      pn.querySelector('#wr-submit').addEventListener('click', function () { finish(false, pre); });
    }
    host.querySelector('#wr-check').addEventListener('click', function () {
      var t = text();
      if (words(t) < 30) { host.querySelector('#wr-note').textContent = 'Write at least a few sentences first.'; return; }
      showPanel(preflight(t, p), state.revision === 0);
    });

    function finish(timedOut, pre) {
      if (state.done) return;
      state.done = true; stop();
      var t = text();
      pre = pre || preflight(t, p);
      areas.forEach(function (a) { a.disabled = true; });
      var secs = Math.min(total, Math.round((Date.now() - state.t0) / 1000));
      if (cfg.onSubmit) cfg.onSubmit({
        promptId: p.id, mode: cfg.mode, text: t, words: words(t), seconds: secs, timedOut: !!timedOut,
        preflight: pre, revision: state.revision, firstText: state.firstText || '', firstPreflight: state.firstPre || null,
        plan: guided ? { groupA: (host.querySelector('#wr-ga') || {}).value || '', groupB: (host.querySelector('#wr-gb') || {}).value || '', picks: state.picks } : null
      });
    }
    return { stop: stop, text: text };
  }

  global.Writer = { preflight: preflight, checkOverview: checkOverview, checkClaim: checkClaim, checkPara: checkPara, markingPrompt: markingPrompt, mount: mount, words: words, paragraphs: paragraphs, CARDS: CARDS };
})(window);
