/* ===========================================================================
   QUILLMOOR ACADEMY · THE OBSERVATORY (Chart Control) — writer.js
   The Scriptorium: the timed Task 1 editor, the rule-based structural check
   (the Ten Wards, formerly the pre-flight check), the Plan Wards and the
   Landing Check. Oct 2026: thresholds re-synced with the ielts-writing-task-1
   rules (length tiers, paragraph ceilings, rubric warn at 8 words, overview
   label numbers, coverage 1 vs 2+ missing, 4:00 / 17:00 phases), a Spellbook
   mode that opens the student's own page for the chart's mode, and no regex
   lookbehind (old iPads cannot run it). Upgrade round 1 (20 Oct 2026, after the
   A1 dry run): Plan Ward reasons (WP8), "Show an example" under every plan box
   and paragraph box from ANOTHER prompt of the same mode (WP9, example-levels.js
   + C.MODELS), the Send lock explained (#wr-lockmsg, WP7), exam-mode button
   labels (WP10), the prep ward ignoring years (WP11), the discounted word count
   in the header (WP12), plain-word rise / fall synonyms in the module overview
   check (WP13) and the compare ward naming its accepted words (WP15).

   Writer.preflight(text, prompt, opts?)  → { rows:[{id,tag,status,label,note}], words, paras, summary }
                                            opts.page = spellbook frame text (COMPARE coverage, item 3)
   Writer.checkOverview(text, item)       → { ok, notes[] }        (module items)
   Writer.checkClaim(text, item)          → { ok, notes[] }
   Writer.checkPara(text, item, prompt)   → { ok, notes[] }
   Writer.mount(host, { prompt, mode:'spellbook'|'guided'|'exam', minutes, cards, frames, text, faultTags, onSubmit, onQuit })
   Writer.markingPrompt(prompt, text, pre) → the text sent to the AI marker
   Writer.examples(key, level, prompt)    → [{ text, from, title, level }] from OTHER prompts of the mode
   Writer.planWards(plan, prompt)         → { ok:{id:bool}, why:{id:reason} }

   These are checks, not marks: every rule is a tolerant heuristic and is
   labelled as such on screen.
   =========================================================================== */
(function (global) {
  'use strict';

  var C = global.CONTENT;
  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function words(t) { var m = String(t || '').trim().match(/[A-Za-z0-9][A-Za-z0-9'’.,%$-]*/g); return m ? m.length : 0; }
  /* Sentence split without lookbehind: a full stop, ! or ? followed by space ends a sentence, except inside a number (2.5) or after a single capital (U.K.). */
  function sentences(t) {
    var out = [], cur = '', str = String(t || '');
    for (var i = 0; i < str.length; i++) {
      var ch = str.charAt(i); cur += ch;
      if ((ch === '.' || ch === '!' || ch === '?') && /\s/.test(str.charAt(i + 1) || ' ') && !/[A-Z]\.[A-Z]\.$/.test(cur.slice(-4))) { if (cur.trim()) out.push(cur.trim()); cur = ''; }
    }
    if (cur.trim()) out.push(cur.trim());
    return out;
  }
  function paragraphs(t) {
    var ps = String(t || '').replace(/\r/g, '').split(/\n\s*\n/).map(function (s) { return s.trim(); }).filter(Boolean);
    if (ps.length === 1) ps = String(t || '').split(/\n/).map(function (s) { return s.trim(); }).filter(Boolean);
    return ps;
  }
  function lower(t) { return String(t || '').toLowerCase(); }
  function hasDigit(s) { return /\d/.test(String(s).replace(/\b(19|20)\d\d\b/g, '')); }
  function hasAnyDigit(s) { return /\d|%/.test(s); }

  var OVERVIEW_START = /^(overall|in general|generally|it is clear that|it can be seen that|it is noticeable that|it is evident that)/i;
  var COMPARE_WORDS = /\b(than|whereas|while|compared (with|to)|respectively|twice|three times|four times|five times|double|doubled|half|halved|similar|in contrast|by contrast|however|the same|as (high|low|many|much|large|small|popular) as|the highest|the lowest|the largest|the smallest|the most|the least|both|far (higher|lower|more|less)|slightly (higher|lower|more|less))\b/gi;
  var COMPARE_SAY = 'than · as … as · whereas · while · compared with · respectively · twice / three times · double / half · similar · in contrast / by contrast · however · the same · the highest / lowest / largest / smallest / most / least · both · far / slightly higher or lower';
  /* WP13: the plain words an A1–B1 student uses for a rise or a fall count for the module overview check. */
  var RISE_WORDS = ['rose', 'increased', 'grew', 'climbed', 'rise', 'growth', 'went up', 'go up', 'goes up', 'going up', 'gone up', 'an increase', 'increase', 'higher', 'upward', 'gained', 'improved', 'more and more'];
  var FALL_WORDS = ['fell', 'declined', 'decreased', 'dropped', 'fall', 'decline', 'drop', 'went down', 'go down', 'goes down', 'going down', 'gone down', 'a decrease', 'decrease', 'lower', 'downward', 'lost', 'shrank', 'less and less'];
  var NUM_WORDS = { one: '1', two: '2', three: '3', four: '4', five: '5', six: '6', seven: '7', eight: '8', nine: '9', ten: '10', eleven: '11', twelve: '12' };
  /* Counts of categories or stages ("8 stages", "a 20-year period") are allowed in an overview (skill §5). */
  var COUNT_NOUNS = /\b\d{1,2}(?:-| )(?:year|years|stages?|steps?|phases?|museums?|countries|categories|groups?|subjects?|activities|charts?|maps?|panels?|year groups?|age groups?|cities|sources?|types?|items?|regions?|places?|companies|sectors?|languages?|products?|slices?|parts?|visuals?)\b/gi;
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
  /* Numbers that belong to labels, not data: in the rubric, column heads, categories, x labels, series and chart names. */
  function labelNumbers(p) {
    var d = (p && p.data) || {}, bits = [String(p.rubric || '')].concat(d.cols || [], d.categories || [], (p.labels || []));
    (d.series || []).forEach(function (s) { bits.push(s.name); });
    (d.charts || []).forEach(function (c) { bits.push(c.title); (c.slices || []).forEach(function (sl) { bits.push(sl.name); }); });
    (d.rows || []).forEach(function (r) { if (r && r.length) bits.push(String(r[0])); });
    (d.panels || []).forEach(function (pn) { bits.push(pn.title); (pn.features || []).forEach(function (f) { bits.push(f.name); }); });
    (d.stages || []).forEach(function (st) { bits.push(st.label); });
    (d.parts || []).forEach(function (pt) { bits.push(pt.title || ''); var dd = pt.data || {}; (dd.categories || []).forEach(function (c) { bits.push(c); }); (dd.series || []).forEach(function (s) { bits.push(s.name); }); });
    var out = {};
    bits.join(' ').replace(/\d+(?:\.\d+)?/g, function (num) { out[num] = 1; return num; });
    return Object.keys(out).sort(function (a, b) { return b.length - a.length; });
  }

  /* ----------------------------------------------------------- preflight */
  /* opts.page (item 3): the frame text of the student's spellbook page when
     the report was built from it. On a COMPARE chart, a category the page has
     no slot for (Template.Data.reach → free) that is still missing turns the
     coverage row amber, not red (the row carries capped:true, tag unchanged),
     and the note says to add a phrase for it: the cap on Task Achievement is
     still stated. A category the page COULD name (a group slot, the real
     largest / smallest, or one [Exception] could hold) stays red. */
  function preflight(text, promptOrId, opts) {
    var p = promptOf(promptOrId) || {};
    opts = opts || {};
    var mode = p.mode || 'TREND';
    var rows = [];
    function add(id, tag, status, label, note) { rows.push({ id: id, tag: tag, status: status, label: label, note: note }); }

    var ps = paragraphs(text), n = words(text);
    /* copied rubric (10+ identical consecutive words) is discounted from the word count, as the examiner does */
    var olRun = p.rubric ? overlap(text, p.rubric) : 0, copiedRun = olRun >= 10 ? olRun : 0;
    n = Math.max(0, n - copiedRun);

    /* length */
    add('length', 'struct-length', n < 150 ? 'bad' : n <= 200 ? 'ok' : 'warn', 'Length: ' + n + ' words' + (copiedRun ? ' (after taking off ' + copiedRun + ' copied words)' : ''),
      n <= 20 ? '20 words or fewer is marked as Band 1. Write the four paragraphs.' :
      n < 100 ? 'Under 100 words caps Task Achievement at 4. Write all four paragraphs.' :
      n < 150 ? 'Under 150 words caps Task Achievement at 5, and there is little language to reward. Add a comparison or a second group of figures.' :
      n <= 200 ? 'In the 150–200 range (aim for 160–190).' :
      n <= 250 ? 'Over 200 words costs time you need for checking and for Task 2. Cut the least important figures.' :
      'Over 250 words usually means too many details were chosen. Keep the key features; cut the rest.');

    /* paragraphs */
    var pst = ps.length === 4 || ps.length === 3 ? 'ok' : ps.length === 5 ? 'warn' : 'bad';
    add('paras', 'cc-paragraphing', pst, 'Paragraphs: ' + ps.length,
      ps.length === 4 ? 'Four paragraphs: introduction, overview, detail A, detail B.' :
      ps.length === 3 ? 'Three paragraphs can work if the overview is easy to find; four is safer.' :
      ps.length === 5 ? 'Five paragraphs: is the last one a conclusion? Task 1 has none. Merge the details into two groups.' :
      ps.length === 2 ? 'Two paragraphs caps Coherence and Cohesion at 6. Split it: introduction, overview, detail A, detail B.' :
      ps.length === 1 ? 'One block of text caps Coherence and Cohesion at 5. Leave a blank line between four paragraphs.' :
      'Too many paragraphs: merge the details into two groups.');

    /* overview */
    var ovIdx = -1;
    ps.forEach(function (q, i) { if (ovIdx < 0 && OVERVIEW_START.test(q)) ovIdx = i; });
    if (ovIdx < 0) {
      add('overview', 'ta-no-overview', 'bad', 'No overview found', 'Start paragraph two with "Overall," and give two or three general truths. Without an overview, Task Achievement is capped at 5.');
    } else {
      var ov = ps[ovIdx];
      var pos = ovIdx === 1 ? 'ok' : ovIdx === ps.length - 1 ? 'warn' : 'warn';
      add('overview', 'ta-no-overview', pos, 'Overview in paragraph ' + (ovIdx + 1), ovIdx === 1 ? 'Second paragraph — the safest place.' : 'An overview at the end is allowed, but paragraph two is safer if time runs out.');
      /* Years, and numbers that are part of a label (the 15–24 age group, PM2.5, Line 3), are allowed: strip them as whole tokens. */
      var ovClean = String(ov).replace(/\b(19|20)\d\d(s)?\b/g, ' ').replace(COUNT_NOUNS, ' ');
      labelNumbers(p).forEach(function (num) { ovClean = ovClean.replace(new RegExp('(^|[^0-9.])' + num.replace(/\./g, '\\.') + '(?![0-9])', 'g'), '$1 '); });
      add('ov-figures', 'ta-overview-figures', hasDigit(ovClean) ? 'bad' : 'ok', hasDigit(ovClean) ? 'Figures in the overview' : 'Overview is general',
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
      add('compare', 'ta-no-comparison', cm >= 2 ? 'ok' : cm === 1 ? 'warn' : 'bad', 'Comparisons: ' + cm, cm >= 2 ? 'Comparisons are present.' : (cm === 1 ? 'One comparison found; the examiner wants at least two. ' : 'No comparison word found. ') + 'Words that count: ' + COMPARE_SAY + '.');
    }

    /* rubric copying */
    if (p.rubric) {
      var ol = overlap(text, p.rubric), rl = words(p.rubric);
      var copied = ol >= 10;
      add('rubric', 'lr-copied-rubric', copied ? 'bad' : ol >= 8 ? 'warn' : 'ok', 'Longest run copied from the task: ' + ol + ' words',
        copied ? 'Ten or more words copied in a row from the task are not counted, as evidence or as words (they were taken off your word count above). Paraphrase: shows → illustrates, the number of → how many, between … and → over the period from ….' : ol >= 8 ? 'Close to the task sentence: change the verb and the shape of the sentence.' : 'Paraphrased. Good.');
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
      var covStatus = missing.length === 0 ? 'ok' : soft && missing.length === 1 ? 'warn' : 'bad';
      var capNote = missing.length === 1 ? 'One category or stage left out caps Task Achievement at 6.' : 'Two or more categories or stages left out caps Task Achievement at 5.';
      var noSlot = [];
      if (missing.length && opts.page && mode === 'COMPARE' && global.Template && global.Template.Data && global.Template.Data.reach) {
        var rc = global.Template.Data.reach(p, opts.page), free = rc.free || [], could = rc.could || [];
        /* a category [Exception] could have held is not "no slot" */
        noSlot = missing.filter(function (l) { return free.indexOf(l) >= 0 && could.indexOf(l) < 0; });
        if (noSlot.length === missing.length) covStatus = 'warn';
      }
      add('coverage', 'ta-missing-category', covStatus,
        missing.length ? 'Not mentioned: ' + missing.slice(0, 4).join(', ') : 'Every category is mentioned',
        missing.length === 0 ? 'Nothing missing.' :
        noSlot.length ? capNote + ' Your spellbook page has no slot for ' + noSlot.slice(0, 4).join(', ') + ': add a short phrase that names ' + (noSlot.length > 1 ? 'them' : 'it') + ', for example after a figure.' + (noSlot.length < missing.length ? ' Your page does have a place for the others: fill it.' : '') :
        missing.length === 1 ? capNote + ' Mention it, even in a short phrase.' : capNote + ' Mention every one at least once.' + (soft ? ' (The app matches stage and feature names loosely: check by eye.)' : ''));
      /* amber under the page rule still caps Task Achievement: the Staff Room counts it */
      if (mode === 'COMPARE' && covStatus === 'warn' && missing.length) rows[rows.length - 1].capped = true;
    }

    /* tense */
    if (mode === 'TREND' && !(p.data && p.data.projectedFrom)) {
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
    /* WP11: "rose in 2010" (a year follows), "stood / remained at roughly the same level" and "peaked at" are not faults. */
    var ppRe = /\b(rose|increased|grew|climbed|fell|dropped|decreased|declined|peaked|stood|remained|stayed) (at|in|of|on) ((?:about|around|approximately|just|roughly|nearly|almost|only|exactly|some) )?(\d[\d,.]*%?|the same)/gi, ppm, pp = null;
    while ((ppm = ppRe.exec(String(text)))) {
      if (/^(peaked|stood|remained|stayed)$/i.test(ppm[1]) && /^at$/i.test(ppm[2])) continue;
      if (/^(19|20)\d\d$/.test(ppm[4].replace(/[,.]+$/, ''))) continue;
      if (/^the same$/i.test(ppm[4])) continue;
      pp = ppm[0]; break;
    }
    if (pp) add('prep', 'gra-prep-figure', 'warn', 'Preposition with a figure: "' + pp + '"', 'rose TO (end point), rose BY (size of change), rose FROM … TO …, peaked AT, stood AT.');

    /* spellbook slots left unfilled */
    var slotLeft = String(text).match(/\[[A-Z][^\]\n]{1,40}\]/g);
    if (slotLeft) add('slots', 'ta-inaccurate', 'bad', 'Unfilled slots: ' + slotLeft.length, 'Replace ' + slotLeft.slice(0, 3).join(', ') + (slotLeft.length > 3 ? ' …' : '') + ' with words and figures from this chart.');

    var bad = rows.filter(function (r) { return r.status === 'bad'; }).length;
    var warn = rows.filter(function (r) { return r.status === 'warn'; }).length;
    return { rows: rows, words: n, paras: ps.length, bad: bad, warn: warn,
      summary: bad === 0 && warn === 0 ? 'All ten wards green (structure only).' : bad === 0 ? 'No red rows: ' + warn + ' to look at.' : bad + ' red row' + (bad > 1 ? 's' : '') + ' to fix before you submit.' };
  }

  /* ------------------------------------------------ module free-text items */
  /* WP13: a must-group that names a rise (or a fall) also accepts the plain forms; a number word also accepts its digit. */
  function mustGroup(group) {
    var words = group.map(function (k) { return String(k).toLowerCase(); }), kind = '';
    if (words.some(function (k) { return RISE_WORDS.indexOf(k) >= 0; })) { kind = 'rise'; words = words.concat(RISE_WORDS); }
    else if (words.some(function (k) { return FALL_WORDS.indexOf(k) >= 0; })) { kind = 'fall'; words = words.concat(FALL_WORDS); }
    words.forEach(function (k) { if (NUM_WORDS[k]) words.push(NUM_WORDS[k] + ' '); });
    return { kind: kind, words: words.filter(function (k, i, a) { return a.indexOf(k) === i; }) };
  }
  function checkOverview(text, item) {
    var notes = [], ok = true;
    var t = String(text || '').trim(), n = words(t);
    if (!OVERVIEW_START.test(t)) { ok = false; notes.push('Start with "Overall," (or "In general,").'); }
    var tc = t, cp = item.chart ? promptOf(item.chart) : null;
    if (cp) labelNumbers(cp).forEach(function (num) { tc = tc.replace(new RegExp('(^|[^0-9.])' + num.replace(/\./g, '\\.') + '(?![0-9])', 'g'), '$1 '); });
    tc = tc.replace(COUNT_NOUNS, ' ');
    if (hasDigit(tc)) { ok = false; notes.push('No figures in the overview: years and names only.'); }
    var min = item.minWords || 20, max = item.maxWords || 70;
    if (n < min) { ok = false; notes.push('Too short: ' + n + ' words. Aim for two or three sentences (' + min + '–' + max + ' words).'); }
    if (n > max) { ok = false; notes.push('Too long: ' + n + ' words. Keep the general truths, cut the rest.'); }
    var lt = lower(t).replace(/\s+/g, ' ');
    (item.must || []).forEach(function (group) {
      var g = mustGroup(group);
      if (!g.words.some(function (k) { k = String(k).trim(); return k && new RegExp('(^|[^a-z])' + k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).test(lt); })) {
        ok = false;
        notes.push('Missing a main feature: ' + (g.kind === 'rise' ? 'say what rose (went up, increased).' : g.kind === 'fall' ? 'say what fell (went down, decreased).' : 'mention "' + group[0] + '"' + (group.length > 1 ? ' (or "' + group[1] + '")' : '') + '.'));
      }
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
      if (!/\b(is|are) \w+ed\b|\b(is|are) (\w+en|made|cut|put|fed|sent|kept|built|laid|known|grown|born|spun|sold|left|held|shown|hatched)\b/i.test(t)) { ok = false; notes.push('Use the present simple passive for a man-made process: is heated, are collected.'); }
    } else if (mode === 'SPACE') {
      if (!/\b(north|south|east|west|centre|center|adjacent|opposite|next to|along)\b/i.test(t)) { ok = false; notes.push('Say where: to the north of, in the south-east, adjacent to.'); }
      var single = p.data && p.data.panels && p.data.panels.length < 2;
      if (single) { if (!/\b(is|are|lies|lie|stands|stand|sits|sit|located|situated|occupies|occupy|there is|there are|runs|run|stretches|leads|fills|surrounded|flanked|borders)\b/i.test(t)) { ok = false; notes.push('Say where each feature is: lies in the centre, occupies the corner, stands next to.'); } }
      else if (!/\b(was|were|has been|have been|will be|is to be|are to be) (\w+ )?(built|demolished|converted|extended|replaced|removed|added|relocated|constructed|pedestrianised|knocked|turned|redeveloped|expanded|reduced|transformed|moved|enlarged|halved)\b/i.test(t)) { ok = false; notes.push('Use a change verb in the passive: was demolished, has been converted into, will be built.'); }
    }
    if (OVERVIEW_START.test(t)) { ok = false; notes.push('This is a detail paragraph, not the overview — do not start with "Overall".'); }
    var bans = BANNED.filter(function (b) { return b.re.test(t); });
    if (bans.length) { ok = false; notes.push(bans[0].note); }
    if (ok) notes.push('Grouped, supported and compared. A solid detail paragraph.');
    return { ok: ok, notes: notes };
  }

  /* ------------------------------------------------------- AI marking */
  /* Kept word for word in step with markingPrompt(rep) in Code.gs (the server copy marks in the background);
     here it is used by the Staff Room's "Copy AI prompt" button. Rules: the ielts-writing-task-1 skill §4. */
  var GATES = [
    'Walk each criterion up its gates (5→6→7→8) and stop at the first band whose positive features are not ALL present. Award x.5 only when band x is fully met and about half of band x+1 is present.',
    'Task Achievement: 5→6 an overview is attempted and most body sentences are supported with figures/data; 6→7 a clear overview with the main trends or differences, data appropriately categorised (grouped, not listed), accurate; 7→8 key features skilfully selected and illustrated, occasional lapses at most.',
    'Coherence & Cohesion: 5→6 clear overall progression, some paragraphing, devices used; 6→7 logical organisation, paragraphing generally effective (four paragraphs, or three with a findable overview), reference and substitution used; 7→8 followed with ease, cohesion well managed, paragraphing sufficient and appropriate.',
    'Lexical Resource: 5→6 adequate range, meaning clear; 6→7 some flexibility and precision, less common items, awareness of collocation; 7→8 wide resource used precisely, skilful use of uncommon items, occasional slips only.',
    'Grammatical Range & Accuracy: 5→6 mix of simple and complex sentences, errors rarely impede; 6→7 a variety of complex structures, error-free sentences are frequent (more than half); 7→8 a wide range, the majority of sentences error-free (about three quarters), punctuation well managed.',
    'CEILINGS (the lowest applicable one wins; they never stack and never cross criteria; there are no "-1" deductions): no overview → TA max 5; a vague or wrong overview → TA max 6; data values (figures) inside the overview are a fault to name but not a ceiling by themselves; fewer than 30% of body sentences with data → TA max 5; opinion, reasons or a conclusion in a detail paragraph → TA max 6, in the overview or dominating → TA max 5; one category, stage or feature missing → TA max 6, two or more → TA max 5; a factual error in a main trend → TA max 6, several → TA max 5 (one minor slip still allows 7); bullet points or notes → TA max 5; letter-style opening → TA max 7; one block of text → CC max 5; two paragraphs → CC max 6; memorised chunks that do not fit → LR max 4.',
    'COPIED RUBRIC: 10 or more identical consecutive words from the task sentence are discounted from the evidence and the word count (not a band subtraction). LENGTH: 20 words or fewer = Band 1; 21-99 → TA max 4; 100-149 → TA max 5 and say the language evidence is thin.',
    'ACCURACY: values between gridlines may use approximation words (around, just over, nearly); an exact figure off by more than half a gridline interval is a factual error. Years, category labels that contain numbers, counts of categories and multiples written as words are allowed in the overview.',
    'OVERALL = the mean of the four bands rounded to the nearest half band (.25 rounds up to .5, .75 rounds up to the next whole band). CEFR (official ielts.org alignment only): 4.0-5.0 = B1, 5.5-6.5 = B2, 7.0-8.0 = C1, 8.5-9.0 = C2, below 4.0 = "below B1".'];
  function markingPrompt(p, text, pre, name) {
    p = promptOf(p) || {};
    return 'You are an IELTS Academic Writing Task 1 examiner and a warm English teacher (T.Chris) at a Thai secondary school. Mark the student report below against the public band descriptors (May 2023).\n\n' +
      GATES.join('\n') + '\n\nTHE TASK AND ITS DATA\n' + global.Charts.describe(p) + '\n\nSTRUCTURAL CHECK (rule-based, for reference only)\n' +
      (pre ? pre.rows.map(function (r) { return '- [' + r.status + '] ' + r.label; }).join('\n') : '') +
      '\n\nSTUDENT REPORT (' + words(text) + ' words, written by ' + (name || 'the student') + ')\n' + text +
      '\n\nReturn ONLY JSON: {"ta":6.0,"cc":6.0,"lr":6.0,"gra":6.0,"overall":6.0,"cefr":"B2","ceilings":["…"],"errors":[{"quote":"…","tag":"gra-tense","fix":"…"}],"nextGate":"…","comment":"…"}. Bands in half steps. "ceilings": the ceilings you applied, in descriptor words (empty if none). ' +
      '"errors": 3 to 5, each quoting the student\'s words, a tag from [' + Object.keys(C.REMEDIATION).join(', ') + '] and a concrete fix. "nextGate": the ONE change that unlocks the next band. ' +
      '"comment": 100-150 words in T.Chris\'s voice: open with the student\'s nickname (' + (name || 'the student') + '), a comma, then one specific praise ending with an exclamation mark; quote the student\'s own words in single quotes; state the level plainly in its own sentence ("Your writing is around B1 level."); name error types by grammatical label; give replacement words; pivot with "However," / "Just ensure" / "Also look at" / "Finally,"; frame improvement as the next band; at most three fixes; close warmly. No markdown.';
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

  /* ------------------------------------------------ the Plan Wards (Oct 2026)
     Eight planning checks for the four minutes before writing. The app ticks
     the lines it can judge from the plan card; the rest are her own ticks. */
  var PLAN_WARDS = [
    { id: 'mode', text: 'I named the mode (TREND, COMPARE, SEQUENCE or SPACE) before reading a single number.' },
    { id: 'units', text: 'I know the units and the time frame (or that there are no dates), so I know the tense.', manual: true },
    { id: 'big', text: 'I wrote two or three general truths for the overview, with no figures.' },
    { id: 'groups', text: 'I split the data into two groups, one for each body paragraph.' },
    { id: 'figures', text: 'I picked the figures I will use: first, last, highest or lowest, and one to compare.' },
    { id: 'all', text: 'Every category, stage or feature is in one of my two groups.', manual: true },
    { id: 'budget', text: 'Budget: about 30 / 45 / 60 / 60 words, and no conclusion.', manual: true },
    { id: 'clock', text: 'I will start writing by 4:00 and stop writing at 17:00 to check.', manual: true }
  ];
  /* WP8: every auto line comes with a one-line reason while it is unticked. */
  function planWards(plan, p) {
    var ok = {}, why = {}, hasDigitsIn = function (x) { return /\d/.test(String(x || '').replace(/\b(1[89]|20)\d\d\b/g, '')); };
    var bw = words(plan.big), noPicks = p.mode === 'SEQUENCE' || p.mode === 'SPACE';
    ok.mode = !!plan.mode && plan.mode === p.mode;
    why.mode = !plan.mode ? 'Choose the mode in the Mode box first.' : 'That mode does not match this chart: look again at the axis, the headings or the labels (years → TREND, names only → COMPARE, stages → SEQUENCE, a map → SPACE).';
    ok.big = bw >= 8 && !hasDigitsIn(plan.big);
    why.big = !bw ? 'Big picture needs 8+ words and no figures: what rose, what fell, what was largest, what stayed the same.' : bw < 8 ? 'Big picture needs 8 or more words (you have ' + bw + '): two or three general truths.' : 'Big picture has a figure in it. Names and dates only; the numbers wait for the detail paragraphs.';
    ok.groups = words(plan.groupA) >= 1 && words(plan.groupB) >= 1;
    why.groups = words(plan.groupA) < 1 && words(plan.groupB) < 1 ? 'Write something in Group A and in Group B: the categories (or stages, or parts of the map) that share a story.' : words(plan.groupA) < 1 ? 'Group A is empty: name the categories for paragraph three.' : 'Group B is empty: name the categories for paragraph four.';
    ok.figures = (plan.picks || []).length >= 4 || noPicks;
    why.figures = 'Tap at least four values on the chart (you have ' + (plan.picks || []).length + '): first, last, highest or lowest, and one to compare.';
    return { ok: ok, why: why };
  }
  /* The Landing Check: the 10-point check of the skill (§8), in the same order as the Duelling Hall's.
     `rows` lines tick themselves from the Ten Wards; the others are hers. */
  var LANDING = [
    { id: 'paras', text: 'Four paragraphs, and paragraph two begins "Overall,".', rows: ['paras', 'overview'] },
    { id: 'general', text: 'The overview is general: no data values.', rows: ['ov-figures'] },
    { id: 'data', text: 'Every body sentence has a number, a date or a label.', rows: ['data'] },
    { id: 'compare', text: 'At least two comparisons (a process: three sequencers).', rows: ['compare', 'sequence'] },
    { id: 'tense', text: 'The tense matches the dates or the mode.', rows: ['tense'] },
    { id: 'nouns', text: 'Number vs amount, plurals and articles checked, one noun at a time.', manual: true },
    { id: 'preps', text: 'Prepositions with figures checked: rose to / by / from … to, peaked at.', manual: true },
    { id: 'register', text: 'No opinion, no reason, no conclusion, no "I", no contractions.', rows: ['ban0', 'ban1', 'ban2', 'ban3', 'ban4', 'ban5'] },
    { id: 'paraphrase', text: 'The task sentence is paraphrased and every category or stage is mentioned.', rows: ['rubric', 'coverage'] },
    { id: 'length', text: '150 to 190 words (no fewer than 150).', rows: ['length'] }
  ];
  function landingAuto(pre) {
    var byId = {}; (pre.rows || []).forEach(function (r) { byId[r.id] = r.status; });
    var out = {};
    LANDING.forEach(function (l) { if (l.rows) out[l.id] = l.rows.every(function (id) { return !byId[id] || byId[id] === 'ok'; }); });
    return out;
  }
  function wardList(cls, items, st, auto, why) {
    why = why || {};
    return '<ul class="wards ' + cls + '">' + items.map(function (w) {
      var ok = w.manual ? !!st[w.id] : !!auto[w.id];
      return '<li class="' + (ok ? 'ok' : '') + (w.manual ? ' manual' : ' auto') + '"><label><input type="checkbox" data-ward="' + w.id + '"' + (ok ? ' checked' : '') + (w.manual ? '' : ' disabled') + '><span>' + esc(w.text) +
        (!ok && !w.manual && why[w.id] ? '<em class="ward-why">' + esc(why[w.id]) + '</em>' : '') + '</span></label></li>';
    }).join('') + '</ul>';
  }
  /* Short names for the Landing Check lines she must tick herself (the Send lock message, WP7). */
  var LAND_SHORT = { paras: 'paragraphs', general: 'a general overview', data: 'data in every sentence', compare: 'comparisons', tense: 'tense', nouns: 'nouns', preps: 'prepositions', register: 'register', paraphrase: 'paraphrase and coverage', length: 'length' };

  /* ------------------------------------------------ "Show an example" (WP9)
     examples(key, level, p) → [{ text, from, title, level }] for one box of the
     plan (big / groupA / groupB) or one paragraph box (intro / overview /
     detailA / detailB), ALWAYS from another prompt of the same mode: the
     hand-written levelled lines in example-levels.js first (A2 / B1 / B2, and
     C1 for the plan boxes), then, at C1 (or when nothing else exists), the
     paragraphs of the other prompts' model answers in C.MODELS, and for the
     groups the other prompts' own `groupings`. Never this prompt's own words. */
  var EX_LEVELS = ['A2', 'B1', 'B2', 'C1'], PARA_KEYS = ['intro', 'overview', 'detailA', 'detailB'];
  function exLevel(l) { return l === 'A1' || l === 'A2' ? 'A2' : l === 'B1' || l === 'B2' || l === 'C1' ? l : 'B2'; }
  /* The student's lesson-explanation level (Settings), else her track, else B2. */
  function defaultExLevel() {
    var lv = '';
    try { var H = global.PCHost, pp = H && H.p; if (pp) lv = pp.explainLevel || pp.tier || ''; if (!lv && H && typeof H.tier === 'function') lv = H.tier(); } catch (e) {}
    if (!lv) { try { lv = localStorage.getItem('cc.explain.lvl') || ''; } catch (e2) {} }
    return exLevel(lv);
  }
  function hashStr(x) { var h = 7; x = String(x); for (var i = 0; i < x.length; i++) h = (h * 31 + x.charCodeAt(i)) % 1000003; return h; }
  function promptById(id) { var P = C.PROMPTS || []; for (var i = 0; i < P.length; i++) if (P[i].id === id) return P[i]; return null; }
  function exHelp(key) {
    return '<div class="wr-help"><button type="button" class="wr-exbtn" data-ex="' + key + '" aria-expanded="false" aria-controls="wr-ex-' + key + '">Show an example</button></div><div class="wr-ex hidden" id="wr-ex-' + key + '"></div>';
  }
  var SHAPE_SAY = {
    big: ['two or three general truths', 'A plan note, not a paragraph: what rose, what fell, what was largest or smallest, what stayed the same. Names and dates only, no figures.'],
    groupA: ['a group with a shared story', 'The categories (or stages, or parts of the map) that go into paragraph three, and the story they share: "the two that rose", "the big slices", "stages 1–3", "the south of the map".'],
    groupB: ['the other group', 'What is left for paragraph four, and its story: "the one that fell", "the small slices", "the last stages", "what stayed the same".'],
    intro: ['S1, one paraphrased sentence', 'The [visual] shows / illustrates / compares [what] in [where] [when], in new words. Ten copied words in a row are not counted.'],
    overview: ['S2, "Overall," plus two or three general truths', 'Overall, [the biggest general truth], while / whereas [a contrasting truth]. No data values; years and names are fine.'],
    TREND: ['S3 / S4, a change verb or a change noun with figures', '[A] rose / fell [adverb] from [X] in [Y1] to [Y] in [Y2]. Every sentence carries a figure or a date, and at least one sentence compares.'],
    COMPARE: ['S5 / S6, a comparison with figures', '[A] was far / slightly higher than [B], at [X] and [Y] respectively. Superlatives and multiples; no trend verbs, because nothing changes over time.'],
    SEQUENCE: ['S7, a sequencer plus the present passive', 'At the [nth] stage, [material] is [past participle] in / by [equipment] before being [past participle]. Name the stage in every sentence.'],
    SPACE: ['S8, a compass point plus a change verb', '[Feature] was demolished / converted into [X] / extended to the [direction] of [landmark]. Never left and right; always north, south, east, west.']
  };
  function shapeSay(key, mode) { return SHAPE_SAY[key] || SHAPE_SAY[mode] || SHAPE_SAY.TREND; }
  function roleText(m, key) {
    var ps = m.paragraphs || [], det = ps.filter(function (q) { return q.role === 'detail'; });
    if (key === 'intro') return (ps.filter(function (q) { return q.role === 'intro'; })[0] || {}).text || '';
    if (key === 'overview' || key === 'big') return (ps.filter(function (q) { return q.role === 'overview'; })[0] || {}).text || '';
    if (key === 'detailA') return (det[0] || {}).text || '';
    if (key === 'detailB') return (det[1] || {}).text || '';
    return '';
  }
  function groupLine(q, key) {
    var g = q.groupings; if (!g || g.length !== 2 || !g[0] || !g[0].length) return '';
    var side = key === 'groupA' ? g[0] : g[1]; if (!side || !side.length) return '';
    var isStage = q.type === 'process' && side.every(function (x) { return /^\d+$/.test(String(x)); });
    return (key === 'groupA' ? 'Group A: ' : 'Group B: ') + (isStage ? 'stages ' + side.join(', ') : side.join(' and '));
  }
  function examples(key, level, promptOrId) {
    var p = promptOf(promptOrId) || {}, lv = exLevel(level), mode = p.mode || 'TREND', out = [], seen = {};
    var byMode = (global.EXAMPLE_LEVELS || {})[mode] || {};
    function push(text, from) {
      text = String(text || '').trim(); if (!text || from === p.id || seen[lower(text)]) return;
      seen[lower(text)] = 1; var q = promptById(from);
      out.push({ text: text, from: from, title: q ? q.title : from, level: lv, hand: !!hand });
    }
    var hand = true;
    Object.keys(byMode).forEach(function (pid) { var b = byMode[pid] && byMode[pid][key]; if (b && b[lv]) push(b[lv], pid); });
    hand = false;
    var isPara = PARA_KEYS.indexOf(key) >= 0;
    if ((isPara || key === 'big') && (lv === 'C1' || !out.length)) {
      (C.MODELS || []).forEach(function (m) {
        var q = promptById(m.promptId); if (!q || q.mode !== mode || q.id === p.id) return;
        var t = roleText(m, key); if (!t) return;
        if (key === 'big') t = t.replace(/^Overall,\s*/, '').replace(/\b\d[\d,.]*%?/g, '[figure]');   /* the model overview carries no data values; belt and braces */
        push(t, q.id);
      });
    }
    if ((key === 'groupA' || key === 'groupB') && out.length < 3) {
      (C.PROMPTS || []).forEach(function (q) { if (q.mode !== mode || q.id === p.id) return; var t = groupLine(q, key); if (t) push(t, q.id); });
    }
    return out;
  }

  function mount(host, cfg) {
    var p = promptOf(cfg.prompt);
    var frames = cfg.mode === 'spellbook' && cfg.frames && cfg.frames.paragraphs ? cfg.frames : null;
    var exam = cfg.mode === 'exam', guided = !exam;
    /* item 3: the Ten Wards know which categories the spellbook page has no slot for */
    var pageOpts = frames ? { page: frames.paragraphs.join(' ') } : null;
    var minutes = cfg.minutes || 20, total = minutes * 60, k = total / 1200;
    var state = { t0: Date.now(), left: total, done: false, picks: [], revision: 0, tick: null, submitted: null, phase: 0, planTicks: {}, landTicks: {}, exLvl: defaultExLevel(), exIdx: {}, exCache: {}, exOpened: {} };
    /* 0:30 triage · plan to 4:00 · write to 17:00 · check to 20:00 (scaled when the clock is not twenty minutes) */
    var PHASES = [['Triage', Math.round(30 * k)], ['Plan', Math.round(240 * k)], ['Write', Math.round(1020 * k)], ['Check', total]];
    var slotTip = frames ? '<p class="tiny">Your spellbook page for <b>' + esc(frames.mode) + '</b>' + (frames.name ? ' (' + esc(frames.name) + ')' : '') + ' is in the boxes. Replace every <b>[Label]</b> with words and figures from this chart. Change a frame word if the chart needs it: the page is yours.</p>' : '';
    var BOX = ['Introduction', 'Overview', 'Detail A', 'Detail B'];
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
            '<div class="wr-planrow"><label for="wr-mode">Mode</label><select id="wr-mode"><option value="">Choose…</option><option>TREND</option><option>COMPARE</option><option>SEQUENCE</option><option>SPACE</option></select></div>' +
            '<div class="wr-planrow"><label for="wr-big">Big picture</label><input id="wr-big" placeholder="two or three general truths, no figures"></div>' + exHelp('big') +
            '<div class="wr-planrow"><label for="wr-ga">Group A</label><input id="wr-ga" placeholder="e.g. the two that rose"></div>' + exHelp('groupA') +
            '<div class="wr-planrow"><label for="wr-gb">Group B</label><input id="wr-gb" placeholder="e.g. the one that fell"></div>' + exHelp('groupB') +
            '<p class="tiny">Tap values on the chart to collect the figures you will use.</p><ul class="wr-picks" id="wr-picks"></ul></div>' +
            '<div class="card wr-wards"><div class="wr-boxh"><b>The Plan Wards</b><span class="tiny" id="wr-planscore"></span></div><p class="tiny">Grey lines tick themselves from your plan. The others are yours to tick honestly.</p><div id="wr-planlist"></div></div>' : '') +
        '</div>' +
        '<div class="wr-right">' + slotTip +
          (guided
            ? [0, 1, 2, 3].map(function (i) {
                var card = i === 0 ? CARDS.intro : i === 1 ? CARDS.overview : CARDS[p.mode] || CARDS.TREND;
                var target = [30, 45, 60, 60][i];
                var pre = frames ? (frames.paragraphs[i] ? fillLabels(frames, i) : '') : '';
                return '<div class="wr-box"><div class="wr-boxh"><b>' + BOX[i] + '</b><span class="tiny">~' + target + ' words · <i id="wr-w' + i + '">0</i></span>' +
                  (cfg.cards !== false ? '<button class="linky" data-card="' + i + '">pattern</button>' : '') + '</div>' +
                  (cfg.cards !== false ? '<div class="wr-card hidden" id="wr-card' + i + '"><b>' + esc(card.t) + '</b><p>' + esc(card.b) + '</p></div>' : '') +
                  '<textarea id="wr-t' + i + '" rows="' + (frames ? 5 : i < 2 ? 3 : 5) + '" spellcheck="false" placeholder="' + (i === 1 ? 'Overall, …' : '') + '">' + esc(pre) + '</textarea>' + exHelp(PARA_KEYS[i]) + '</div>';
              }).join('')
            : '<div class="wr-box"><textarea id="wr-t0" rows="18" spellcheck="false" placeholder="Write your report here. Leave a blank line between paragraphs."></textarea></div>') +
          '<div class="qfoot"><span class="tiny" id="wr-note">Checks, not marks: the Wards look at structure only.</span><span class="grow"></span>' +
          '<button class="btn primary" id="wr-check">' + (exam ? 'Check and send →' : 'The Ten Wards →') + '</button></div>' +
          '<div id="wr-panel"></div>' +
        '</div>' +
      '</div></div>';
    host.innerHTML = html;

    global.Charts.render(host.querySelector('#wr-chart'), p, { readout: true, onPick: function (t) {
      if (!guided) return;
      if (state.picks.indexOf(t) < 0) state.picks.push(t);
      host.querySelector('#wr-picks').innerHTML = state.picks.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('');
      paintPlan();
    } });

    var areas = Array.prototype.slice.call(host.querySelectorAll('textarea'));
    /* a report handed over from the Spellbook Workshop: one paragraph per box */
    if (cfg.text) {
      if (guided) { var tp = paragraphs(cfg.text); areas.forEach(function (a, i) { a.value = i < 3 ? (tp[i] || '') : tp.slice(3).join('\n\n'); }); }
      else areas[0].value = cfg.text;
    }
    function text() {
      return guided ? areas.map(function (a) { return a.value.trim(); }).filter(Boolean).join('\n\n') : areas[0].value;
    }
    function count() {
      var t = text(), n = words(t);
      /* WP12: a copied task sentence (10+ words in a row) is taken off the count the examiner uses */
      var run = p.rubric && n >= 10 ? overlap(t, p.rubric) : 0, copied = run >= 10 ? run : 0;
      host.querySelector('#wr-words').textContent = n + ' words' + (copied ? ' · ' + (n - copied) + ' count (' + copied + ' copied)' : '');
      if (guided) areas.forEach(function (a, i) { host.querySelector('#wr-w' + i).textContent = words(a.value); });
    }
    areas.forEach(function (a) { a.addEventListener('input', count); });
    count();
    host.querySelectorAll('[data-card]').forEach(function (b) {
      b.addEventListener('click', function () { host.querySelector('#wr-card' + b.dataset.card).classList.toggle('hidden'); });
    });
    function planNow() {
      var g = function (id) { var el = host.querySelector(id); return el ? el.value : ''; };
      return { mode: g('#wr-mode'), big: g('#wr-big'), groupA: g('#wr-ga'), groupB: g('#wr-gb'), picks: state.picks };
    }
    function paintPlan() {
      var box = host.querySelector('#wr-planlist'); if (!box) return;
      var pw = planWards(planNow(), p), a = pw.ok, n = PLAN_WARDS.filter(function (w) { return w.manual ? !!state.planTicks[w.id] : !!a[w.id]; }).length;
      box.innerHTML = wardList('plan', PLAN_WARDS, state.planTicks, a, pw.why);
      host.querySelector('#wr-planscore').textContent = n + ' of ' + PLAN_WARDS.length;
      box.querySelectorAll('[data-ward]').forEach(function (cb) { cb.addEventListener('change', function () { state.planTicks[cb.dataset.ward] = cb.checked; paintPlan(); }); });
      var ms = host.querySelector('#wr-mode');
      if (ms) ms.classList.toggle('bad', !!ms.value && ms.value !== p.mode);
    }
    ['#wr-mode', '#wr-big', '#wr-ga', '#wr-gb'].forEach(function (id) { var el = host.querySelector(id); if (el) el.addEventListener(id === '#wr-mode' ? 'change' : 'input', paintPlan); });
    paintPlan();

    /* --- WP9: "Show an example" under every plan box and paragraph box (guided and spellbook) */
    function exList(key) {
      var ck = key + ':' + state.exLvl;
      if (!state.exCache[ck]) state.exCache[ck] = examples(key, state.exLvl, p);
      return state.exCache[ck];
    }
    function paintEx(key) {
      var box = host.querySelector('#wr-ex-' + key); if (!box) return;
      var list = exList(key), say = shapeSay(key, p.mode);
      if (state.exIdx[key] == null) { var nh = list.filter(function (x) { return x.hand; }).length || list.length; state.exIdx[key] = nh ? hashStr(p.id + key) % nh : 0; }
      var i = list.length ? state.exIdx[key] % list.length : 0, e = list[i];
      box.innerHTML = '<p class="wr-ex-shape"><b>Shape: ' + esc(say[0]) + '.</b> ' + esc(say[1]) + '</p>' +
        (e ? '<p class="wr-ex-line">“' + esc(e.text) + '”</p><p class="tiny wr-ex-from">From another chart, not this one: <i>' + esc(e.title) + '</i> · ' + e.level + ' · ' + (i + 1) + ' of ' + list.length + '. Copy the shape, not the words.</p>'
          : '<p class="tiny">No example at this level yet. Try another level.</p>') +
        '<div class="wr-ex-ctl">' + (list.length > 1 ? '<button type="button" class="btn sm" data-exnext="' + key + '">Another example</button>' : '') +
        '<span class="wr-ex-lv" role="group" aria-label="Level of the example">' + EX_LEVELS.map(function (l) { return '<button type="button" class="lvl-btn' + (l === state.exLvl ? ' on' : '') + '" data-exlvl="' + l + '" data-exkey="' + key + '" aria-pressed="' + (l === state.exLvl) + '">' + l + '</button>'; }).join('') + '</span></div>';
    }
    host.querySelector('.wr').addEventListener('click', function (ev) {
      var b = ev.target && ev.target.closest ? ev.target.closest('button') : null; if (!b) return;
      var d = b.dataset;
      if (d.ex) {
        var bx = host.querySelector('#wr-ex-' + d.ex), show = bx.classList.contains('hidden');
        if (show) { paintEx(d.ex); state.exOpened[d.ex] = (state.exOpened[d.ex] || 0) + 1; }
        bx.classList.toggle('hidden', !show); b.setAttribute('aria-expanded', String(show)); b.textContent = show ? 'Hide the example' : 'Show an example';
      } else if (d.exnext) { state.exIdx[d.exnext] = (state.exIdx[d.exnext] || 0) + 1; paintEx(d.exnext); }
      else if (d.exlvl) { state.exLvl = d.exlvl; state.exIdx = {}; paintEx(d.exkey); }
      else if (d.lockgo) { var first = host.querySelector('#wr-landlist li:not(.ok) input[data-ward]:not([disabled])'); if (first) { first.scrollIntoView({ behavior: 'smooth', block: 'center' }); first.focus(); } }
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
      pn.innerHTML = '<div class="card preflight">' + (exam ? '<div class="pf-h"><b>Before you send it</b><span class="pill">Exam mode: the Wards report after you send</span></div>' : '<div class="pf-h"><b>The Ten Wards</b><span class="pill ' + (pre.bad ? 'bad' : pre.warn ? 'gold' : 'good') + '">' + esc(pre.summary) + '</span></div>' +
        pre.rows.map(function (r) { return '<div class="pf-row ' + r.status + '"><span class="pf-dot"></span><div><b>' + esc(r.label) + '</b><p>' + esc(r.note) + '</p></div></div>'; }).join('')) +
        '<div class="wr-wards" style="margin-top:14px"><div class="wr-boxh"><b>The Landing Check</b><span class="tiny" id="wr-landscore"></span></div><p class="tiny">' + (exam ? 'Which of these did you do in the last three minutes? Tick honestly: the app compares your ticks with the Wards.' : 'Grey lines come from the Wards. Tick the rest yourself before you submit' + (cfg.faultTags && cfg.faultTags.length ? ' (your top faults: ' + esc(cfg.faultTags.slice(0, 5).join(', ')) + ')' : '') + '.') + '</p><div id="wr-landlist"></div></div>' +
        '<div class="qfoot" style="margin-top:12px">' + (canRevise ? '<button class="btn" id="wr-revise">Revise once</button>' : '') + '<span class="grow"></span><span class="wr-subwrap" data-lockgo="1"><button class="btn primary" id="wr-submit">Send the report</button></span></div>' +
        '<p class="wr-lockmsg hidden" id="wr-lockmsg" role="status"></p></div>';
      var auto = landingAuto(pre), items = exam ? LANDING.map(function (l) { return { id: l.id, text: l.text, manual: true }; }) : LANDING;
      function paintLanding() {
        var box = pn.querySelector('#wr-landlist'), n = items.filter(function (l) { return l.manual ? !!state.landTicks[l.id] : !!auto[l.id]; }).length;
        box.innerHTML = wardList('landing', items, state.landTicks, auto);
        pn.querySelector('#wr-landscore').textContent = n + ' of ' + items.length;
        box.querySelectorAll('[data-ward]').forEach(function (cb) { cb.addEventListener('change', function () { state.landTicks[cb.dataset.ward] = cb.checked; paintLanding(); }); });
        var sub = pn.querySelector('#wr-submit'), left = items.filter(function (l) { return l.manual && !state.landTicks[l.id]; }), manualDone = !left.length;
        var lm = pn.querySelector('#wr-lockmsg');
        if (!exam) {
          sub.disabled = !manualDone; sub.title = manualDone ? '' : 'Tick every line of the Landing Check first.';
          /* WP7: the reason, under the button, with a jump to the first unticked line */
          if (lm) {
            lm.classList.toggle('hidden', manualDone);
            lm.innerHTML = manualDone ? '' : '<b>Send is locked.</b> <span class="wr-lockline">Tick the ' + (left.length === 1 ? 'line' : left.length + ' lines') + ' you must check yourself: ' + esc(left.map(function (l) { return LAND_SHORT[l.id] || l.id; }).join(', ')) + '.</span> <button type="button" class="linky" data-lockgo="1">Take me to the first one</button>';
          }
        } else if (lm) { lm.classList.add('hidden'); }
      }
      paintLanding();
      pn.scrollIntoView({ behavior: 'smooth', block: 'start' });
      var rv = pn.querySelector('#wr-revise');
      if (rv) rv.addEventListener('click', function () {
        state.revision = 1; state.firstText = text(); state.firstPre = pre; pn.innerHTML = ''; areas[0].focus();
        /* WP10: one revision only — the next check is the last */
        var ck = host.querySelector('#wr-check'); if (ck) ck.textContent = 'Final check →';
        var nt = host.querySelector('#wr-note'); if (nt) nt.textContent = 'You have used your revision. The next check is the final one: it opens the Landing Check, and then the report is sent.';
      });
      /* the wrapper catches the tap when the button is disabled (pointer-events:none in writer.css) */
      pn.querySelector('.wr-subwrap').addEventListener('click', function (ev) { if (ev.target !== this) return; var lm2 = pn.querySelector('#wr-lockmsg'); if (lm2) lm2.classList.remove('hidden'); });
      pn.querySelector('#wr-submit').addEventListener('click', function () { if (this.disabled) return; finish(false, pre); });
    }
    host.querySelector('#wr-check').addEventListener('click', function () {
      var t = text();
      if (words(t) < 30) { host.querySelector('#wr-note').textContent = 'Write at least a few sentences first.'; return; }
      showPanel(preflight(t, p, pageOpts), state.revision === 0 && !exam);
    });

    /* how well her own ticks match the Wards: agreements over the lines the app can judge */
    function calibration(pre0) {
      var auto = landingAuto(pre0), keys = Object.keys(auto); if (!keys.length) return null;
      var agree = keys.filter(function (kk) { return !!state.landTicks[kk] === !!auto[kk]; }).length;
      return { agree: agree, of: keys.length };
    }
    function finish(timedOut, pre) {
      if (state.done) return;
      state.done = true; stop();
      var t = text();
      pre = pre || preflight(t, p, pageOpts);
      areas.forEach(function (a) { a.disabled = true; });
      var secs = Math.min(total, Math.round((Date.now() - state.t0) / 1000));
      var plan = guided ? planNow() : {};
      plan.planWards = state.planTicks; plan.landing = state.landTicks; plan.calibration = calibration(pre);
      if (frames) { plan.spellbook = { templateId: frames.templateId || '', mode: frames.mode, version: frames.version || 0 }; }
      if (cfg.onSubmit) cfg.onSubmit({
        promptId: p.id, mode: cfg.mode, text: t, words: words(t), seconds: secs, timedOut: !!timedOut,
        preflight: pre, revision: state.revision, firstText: state.firstText || '', firstPreflight: state.firstPre || null,
        plan: plan, landing: { ticks: state.landTicks, calibration: plan.calibration }
      });
    }
    return { stop: stop, text: text };
  }
  /* One spellbook paragraph with every {slot} shown as [Label] for her to replace. */
  function fillLabels(frames, i) {
    var labels = {}; (frames.slots || []).forEach(function (sl) { labels[sl.id] = sl.label; });
    if (global.Template && typeof global.Template.fill === 'function') {
      try { var one = { mode: frames.mode, paragraphs: [frames.paragraphs[i]], slots: frames.slots }; var out = global.Template.fill(one, {}); if (typeof out === 'string' && out) return out.trim(); } catch (e) {}
    }
    return String(frames.paragraphs[i] || '').replace(/\{(\w+)\}/g, function (m, id) { return '[' + (labels[id] || id) + ']'; });
  }

  global.Writer = { preflight: preflight, checkOverview: checkOverview, checkClaim: checkClaim, checkPara: checkPara, markingPrompt: markingPrompt, mount: mount, words: words, sentences: sentences, paragraphs: paragraphs, CARDS: CARDS, PLAN_WARDS: PLAN_WARDS, LANDING: LANDING,
    examples: examples, planWards: planWards, shapeSay: shapeSay, COMPARE_SAY: COMPARE_SAY };
})(window);
