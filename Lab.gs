/* ===========================================================================
   QUILLMOOR ACADEMY · THE OBSERVATORY (Chart Control, Task 1) — Lab.gs
   Back end of the Spellbook Workshop (lab.js). Add this as a SECOND script
   file in the same Apps Script project as Code.gs (File → + → Script → "Lab").
   Task 1 version of the Task 2 app's Lab.gs: same actions, same sheets and
   quotas, Task 1 coaching and rating (gate ladder with ceilings, figures
   checked against the chart data the app sends).

   SET-UP (once)
   1. Paste this file as Lab.gs.
   2. In Code.gs, inside doPost, add ONE line straight after the JSON parse
      (before the lock) — the LAB-HOOK:
        if (String(req.action || '').indexOf('lab.') === 0) return out(LAB_handle(req.action, req.payload || {}));
      It sends every action that starts with "lab." here, outside the global
      lock, so a class of thirty waiting for AI coaching does not queue the
      rest of the app. Lab.gs uses findStudent() and log() from Code.gs.
   3. Project Settings → Script properties:
        ANTHROPIC_API_KEY     your Claude API key (required for AI coaching)
        LAB_COACH_MODELS      optional, models tried left to right (defaults below)
        LAB_RATE_MODELS       optional, models tried left to right
        LAB_STUDENT_DAILY     optional, AI calls per student per day, default 250
        LAB_DAILY             optional, AI calls for the whole class per day, default 4000
   4. Deploy → Manage deployments → pencil → New version → Deploy.
      Saving alone does not update the live /exec endpoint.

   Sheets created on first use: LabTemplates, LabAttempts (one row per saved
   page version / cast version, full JSON in the last column). Coaching and
   rating come back as JSON through Claude's tool use, so the answer always
   has the fields lab.js expects. Without a key every action except
   lab.coach / lab.rate still works, and the app runs its offline checks.
   =========================================================================== */

var LAB_SHEETS = {
  LabTemplates: ['id', 'studentId', 'ts', 'name', 'version', 'pct', 'level', 'status', 'score', 'frameWords', 'mode', 'json'],
  LabAttempts: ['id', 'studentId', 'ts', 'templateId', 'pct', 'level', 'promptId', 'timing', 'version', 'words', 'share', 'overall', 'points', 'seconds', 'status', 'mode', 'accuracy', 'json']
};
var LAB_DEFAULTS = {
  /* Tried in order: if a model is retired or busy, the next one answers. */
  LAB_COACH_MODELS: 'claude-haiku-5-5,claude-sonnet-5-5,claude-haiku-4-5-20251001,claude-sonnet-4-6',
  LAB_RATE_MODELS: 'claude-sonnet-5-5,claude-sonnet-4-6,claude-haiku-5-5,claude-haiku-4-5-20251001',
  LAB_STUDENT_DAILY: '250',
  LAB_DAILY: '4000'
};
var LAB_CELL_MAX = 48000;

/* ------------------------------------------------------------- router */
function LAB_handle(action, p) {
  try {
    if (action === 'lab.status') return { ok: true, ai: !!LAB_key_(), task: 1, models: { coach: LAB_prop_('LAB_COACH_MODELS'), rate: LAB_prop_('LAB_RATE_MODELS') } };
    var s = LAB_auth_(p);
    if (!s) return { ok: false, error: 'Not signed in. Log out and in again.' };
    var sid = String(s.id).toLowerCase();
    switch (action) {
      case 'lab.list': return LAB_list_(sid);
      case 'lab.saveTemplate': return LAB_save_('LabTemplates', sid, p.template);
      case 'lab.saveAttempt': return LAB_save_('LabAttempts', sid, p.attempt);
      case 'lab.deleteTemplate': return LAB_delete_('LabTemplates', sid, p.id);
      case 'lab.deleteAttempt': return LAB_delete_('LabAttempts', sid, p.id);
      case 'lab.coach': LAB_quota_(sid); return { ok: true, coach: p.kind === 'variable' ? LAB_coachVariable_(p) : LAB_coachFrame_(p) };
      case 'lab.rate': LAB_quota_(sid); return { ok: true, rating: LAB_rate_(p) };
    }
    return { ok: false, error: 'Unknown action ' + action };
  } catch (err) {
    try { log('LAB ' + action + ' ' + err); } catch (e) {}
    return { ok: false, error: String(err && err.message || err) };
  }
}

/* ------------------------------------------------------------ helpers */
function LAB_prop_(k) { return PropertiesService.getScriptProperties().getProperty(k) || LAB_DEFAULTS[k] || ''; }
function LAB_key_() { var sp = PropertiesService.getScriptProperties(); return sp.getProperty('ANTHROPIC_API_KEY') || sp.getProperty('CLAUDE_API_KEY') || ''; }
/* Same rule as Code.gs: the student must exist and send her own token. */
function LAB_auth_(p) {
  if (!p || !p.studentId) return null;
  var s = findStudent(p.studentId);
  if (!s) return null;
  if (!p.token || !s.token || String(p.token) !== String(s.token)) return null;
  return s;
}
function LAB_sheet_(name) {
  var ss = SpreadsheetApp.getActive(), sh = ss.getSheetByName(name);
  if (!sh) { sh = ss.insertSheet(name); sh.appendRow(LAB_SHEETS[name]); sh.setFrozenRows(1); }
  return sh;
}
function LAB_findRow_(sh, id) {
  if (sh.getLastRow() < 2) return 0;
  var hit = sh.getRange(2, 1, sh.getLastRow() - 1, 1).createTextFinder(String(id)).matchEntireCell(true).findNext();
  return hit ? hit.getRow() : 0;
}
function LAB_round_(x) { var n = Number(x); return isNaN(n) ? '' : Math.round(n * 1000) / 1000; }

/* Keep a row's JSON under the 50,000-character cell limit by shedding the
   bulkiest coaching detail first. */
function LAB_fit_(obj) {
  var j = JSON.stringify(obj);
  if (j.length <= LAB_CELL_MAX) return j;
  var o = JSON.parse(j);
  function strip(fb) { if (fb) { delete fb.rows; delete fb.issues; if (fb.errorList) fb.errorList = fb.errorList.slice(0, 2); } }
  Object.keys(o.lines || {}).forEach(function (k) { strip(o.lines[k].last); });
  Object.keys(o.vars || {}).forEach(function (k) { strip(o.vars[k].last); });
  j = JSON.stringify(o);
  if (j.length <= LAB_CELL_MAX) return j;
  delete o.parasHtml; if (o.accuracy) delete o.accuracy.rows; if (o.wards) delete o.wards.rows;
  Object.keys(o.lines || {}).forEach(function (k) { if (o.lines[k].last) o.lines[k].last = { points: o.lines[k].last.points, errors: o.lines[k].last.errors, cefr: o.lines[k].last.cefr, fnv: o.lines[k].last.fnv }; });
  Object.keys(o.vars || {}).forEach(function (k) { if (o.vars[k].last) o.vars[k].last = { points: o.vars[k].last.points, errors: o.vars[k].last.errors, cefr: o.vars[k].last.cefr, fnv: o.vars[k].last.fnv, data: o.vars[k].last.data ? { status: o.vars[k].last.data.status } : null }; });
  j = JSON.stringify(o);
  if (j.length <= LAB_CELL_MAX) return j;
  /* Last resort: keep the record and the report, drop the per-slot detail. */
  var keep = {};
  ['id', 'studentId', 'name', 'mode', 'templateId', 'templateName', 'templateVersion', 'pct', 'level', 'promptId', 'promptTitle', 'type', 'timing', 'version', 'parentId', 'rootId',
   'status', 'words', 'frameWords', 'share', 'rating', 'points', 'compare', 'seconds', 'accuracy', 'wards', 'full', 'createdAt', 'updatedAt', 'completedAt'].forEach(function (k) { if (o[k] !== undefined) keep[k] = o[k]; });
  keep.report = String(o.report || '').slice(0, 20000); keep.vars = {}; keep.lines = {}; keep.truncated = true;
  return JSON.stringify(keep);
}

/* --------------------------------------------------------------- store */
function LAB_rowFor_(name, sid, o) {
  var ts = o.updatedAt || new Date().toISOString();
  if (name === 'LabTemplates') return { id: o.id, studentId: sid, ts: ts, name: String(o.name || '').slice(0, 80), version: o.version || 1, pct: o.pct, level: o.level, status: o.status, score: o.score || '', frameWords: o.frameWords || '', mode: o.mode || '', json: LAB_fit_(o) };
  var acc = o.accuracy && o.accuracy.n ? LAB_round_(o.accuracy.ok / o.accuracy.n) : '';
  return { id: o.id, studentId: sid, ts: ts, templateId: o.templateId, pct: o.pct, level: o.level, promptId: o.promptId, timing: o.timing, version: o.version || 1, words: o.words || '',
    share: LAB_round_(o.share), overall: o.rating && o.rating.overall != null ? o.rating.overall : '', points: o.points ? o.points.total : '', seconds: o.seconds || '', status: o.status,
    mode: o.mode || '', accuracy: acc, json: LAB_fit_(o) };
}
function LAB_save_(name, sid, o) {
  if (!o || !o.id) return { ok: false, error: 'Nothing to save' };
  o.studentId = sid;
  var head = LAB_SHEETS[name], row = LAB_rowFor_(name, sid, o), vals = head.map(function (h) { return row[h] == null ? '' : row[h]; });
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var sh = LAB_sheet_(name), r = LAB_findRow_(sh, o.id);
    if (r) {
      var owner = String(sh.getRange(r, 2).getValue()).toLowerCase();
      if (owner !== sid) return { ok: false, error: 'That item belongs to another student.' };
      sh.getRange(r, 1, 1, head.length).setValues([vals]);
    } else sh.appendRow(vals);
  } finally { lock.releaseLock(); }
  return { ok: true, id: o.id };
}
function LAB_delete_(name, sid, id) {
  if (!id) return { ok: false, error: 'No id' };
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var sh = LAB_sheet_(name), r = LAB_findRow_(sh, id);
    if (!r) return { ok: true };
    if (String(sh.getRange(r, 2).getValue()).toLowerCase() !== sid) return { ok: false, error: 'That item belongs to another student.' };
    sh.deleteRow(r);
  } finally { lock.releaseLock(); }
  return { ok: true };
}
function LAB_list_(sid) {
  function pull(name, limit) {
    var sh = LAB_sheet_(name), n = sh.getLastRow(), head = LAB_SHEETS[name];
    if (n < 2) return [];
    var data = sh.getRange(2, 1, n - 1, head.length).getValues(), iSid = head.indexOf('studentId'), iJson = head.indexOf('json'), out = [];
    data.forEach(function (r) { if (String(r[iSid]).toLowerCase() === sid) { try { out.push(JSON.parse(r[iJson])); } catch (e) {} } });
    return out.slice(-limit);
  }
  return { ok: true, templates: pull('LabTemplates', 60), attempts: pull('LabAttempts', 200) };
}

/* --------------------------------------------------------------- quota */
function LAB_quota_(sid) {
  if (!LAB_key_()) throw new Error('No AI key on the class server');
  var cache = CacheService.getScriptCache(), day = Utilities.formatDate(new Date(), 'Asia/Bangkok', 'yyyyMMdd');
  var ks = 'labq:' + day + ':' + sid, kc = 'labq:' + day + ':all';
  var ns = Number(cache.get(ks) || 0), nc = Number(cache.get(kc) || 0);
  if (ns >= Number(LAB_prop_('LAB_STUDENT_DAILY'))) throw new Error('You have used today\'s AI coaching. Quick checks and data checks still work; the coach is back tomorrow.');
  if (nc >= Number(LAB_prop_('LAB_DAILY'))) throw new Error('The class has used today\'s AI coaching. Quick checks and data checks still work.');
  cache.put(ks, String(ns + 1), 21600); cache.put(kc, String(nc + 1), 21600);
}

/* ------------------------------------------------------------- Claude */
var LAB_SYSTEM = 'You are an experienced IELTS Writing examiner and a warm, exact writing coach for Thai secondary-school students (CEFR B1 to C1) ' +
  'who are building and using their own reusable template ("spellbook page") for IELTS Academic Writing Task 1: a factual report of at least 150 words ' +
  '(aim 160 to 190) on a chart, table, process diagram or map, written in 20 minutes. You judge against the public IELTS Writing Task 1 band ' +
  'descriptors (updated May 2023): Task Achievement, Coherence and Cohesion, Lexical Resource, Grammatical Range and Accuracy, equally weighted. ' +
  'A Task 1 report has four paragraphs (introduction, overview, two detail paragraphs), an overview with no figures, a figure, date or label in every ' +
  'detail sentence, at least two comparisons, and NO opinion, reason, conclusion, I/we/you or contractions. Tense follows the mode: past simple for ' +
  'past dates, "is projected to" for projections, present simple (passive for a man-made process, active for a natural cycle) for processes, past ' +
  'simple or present perfect passive for maps (future passive for a plan). You never write the student\'s answer for her: you point to the exact ' +
  'problem and give one concrete next step. Write every comment in plain B1-level English, in short sentences, addressed to the student as "you". ' +
  'Be honest: do not inflate levels or bands, do not invent errors, and use only the chart data you are given. Report only by calling the tool.';

function LAB_claude_(modelsProp, user, tool, maxTokens) {
  var key = LAB_key_(); if (!key) throw new Error('No AI key on the class server');
  var models = LAB_prop_(modelsProp).split(',').map(function (m) { return m.trim(); }).filter(String), last = '';
  for (var i = 0; i < models.length; i++) {
    for (var attempt = 0; attempt < 2; attempt++) {
      var res = UrlFetchApp.fetch('https://api.anthropic.com/v1/messages', {
        method: 'post', contentType: 'application/json', muteHttpExceptions: true,
        headers: { 'x-api-key': key, 'anthropic-version': '2023-06-01' },
        payload: JSON.stringify({ model: models[i], max_tokens: maxTokens, system: LAB_SYSTEM, tools: [tool], tool_choice: { type: 'tool', name: tool.name },
          messages: [{ role: 'user', content: user }] })
      });
      var code = res.getResponseCode(), text = res.getContentText();
      if (code === 200) {
        var j = JSON.parse(text), blk = (j.content || []).filter(function (c) { return c.type === 'tool_use'; })[0];
        if (blk && blk.input) return blk.input;
        last = 'no tool output'; break;
      }
      last = 'HTTP ' + code + ' ' + text.slice(0, 180);
      if (code === 429 || code === 529 || code >= 500) { Utilities.sleep(1200 * (attempt + 1)); continue; }
      break;
    }
  }
  throw new Error('The AI coach is unavailable (' + last + ')');
}

/* Shared pieces of the tool schemas. */
var LAB_ERR = { type: 'array', description: 'Every real error. Empty if none.', items: { type: 'object', properties: {
  original: { type: 'string', description: 'the exact words as written' }, correction: { type: 'string' },
  type: { type: 'string', enum: ['spelling', 'grammar', 'punctuation', 'word choice', 'collocation', 'register', 'accuracy'] },
  explain: { type: 'string', description: 'one short sentence' } }, required: ['original', 'correction', 'type', 'explain'] } };
var LAB_FN = { type: 'object', properties: { verdict: { type: 'string', enum: ['meets', 'partly', 'missing'] }, comment: { type: 'string', description: 'one or two sentences' } }, required: ['verdict', 'comment'] };
var LAB_OKNOTE = { type: 'object', properties: { ok: { type: 'boolean' }, note: { type: 'string', description: 'one sentence; empty if ok' } }, required: ['ok', 'note'] };
var LAB_LEVEL = { cefr: { type: 'string', enum: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] }, band: { type: 'number', description: 'IELTS band this language typically corresponds to, 4 to 9 in steps of 0.5' },
  praise: { type: 'string', description: 'one specific thing done well, quoting the words' }, tip: { type: 'string', description: 'the single most useful next step, one sentence' } };

function LAB_clean_(o) {
  o = o || {};
  var errs = (o.errors || []).filter(function (e) { return e && e.original && e.correction && String(e.original).trim() !== String(e.correction).trim(); }).slice(0, 10);
  var band = Number(o.band); band = isNaN(band) ? null : Math.max(1, Math.min(9, Math.round(band * 2) / 2));
  var fn = o.fn && /^(meets|partly|missing)$/.test(o.fn.verdict) ? o.fn : { verdict: 'partly', comment: '' };
  var out = { errors: errs, fn: fn, cefr: /^(A1|A2|B1|B2|C1|C2)$/.test(o.cefr) ? o.cefr : '', band: band, praise: String(o.praise || ''), tip: String(o.tip || '') };
  ['generic', 'accuracy', 'fit'].forEach(function (k) { if (o[k] && typeof o[k].ok === 'boolean') out[k] = { ok: o[k].ok, note: String(o[k].note || '') }; });
  if (o.slotForm) out.slotForm = String(o.slotForm);
  return out;
}
function LAB_q_(s, n) { return '"""' + String(s == null ? '' : s).slice(0, n) + '"""'; }

/* ---------------------------------------------------------- one page line */
function LAB_coachFrame_(p) {
  var c = p.component || {}, mode = String(p.mode || '');
  var user = [
    'TASK: Coach ONE line of a student\'s personal IELTS Academic Writing Task 1 template ("spellbook page") for the ' + mode + ' mode.',
    'The page is reusable scaffolding for ANY ' + mode + ' chart. Words in [square brackets] are slots the student fills later with data from the chart in front of her. The slots are not errors; do not judge what might go in them.',
    'Modes: TREND = a time axis (past simple; "is projected to" for projections); COMPARE = categories, no time (comparatives, no trend verbs); SEQUENCE = a process (present simple, passive for man-made, sequencers); SPACE = maps (compass points, past simple or present perfect passive, future passive for a plan).',
    '',
    'Target level: ' + p.level + ' (IELTS Band ' + p.band + '). Template share chosen: ' + p.pct + '% of a 175-word report.',
    'Line: "' + c.name + '" (paragraph: ' + c.paragraph + ')',
    'Its job: ' + c.fn,
    'Why it scores: ' + c.why,
    'Required slot(s): ' + (c.slots || []).join('; '),
    'Word budget for the fixed words: ' + (p.budget || {}).lo + ' to ' + (p.budget || {}).hi + ' (the student wrote ' + p.words + ').',
    (p.context && p.context.length ? 'Other lines already written in this paragraph (context only):\n- ' + p.context.join('\n- ') : ''),
    '',
    'STUDENT\'S LINE:',
    LAB_q_(p.line, 600),
    '',
    'Report:',
    '1. errors: every real spelling, grammar, punctuation, word-choice, collocation or register error in the fixed words (ignore the slot labels).',
    '2. fn: does the line do its job? meets / partly / missing, with a short comment.',
    '3. generic: is the fixed wording reusable for ANY ' + mode + ' chart? It must NOT contain: a figure; a direction or size claim that will be false for some charts ("rose", "the highest", "much higher" in a fixed TREND or COMPARE frame); topic words ("visitors", "salary", "the sun"); an opinion, a reason ("because"), a conclusion or I/we/you; memorised-sounding cliches ("as is shown in the graph above"). Say which in the note.',
    '4. slotForm: one short sentence on the grammatical form the slot filler must take for the finished sentence to be correct, with a two-word example (e.g. "After is, start Stage 2 with a past participle: filtered through"; "A plural group needs were, not was").',
    '5. cefr and band: the level of the fixed wording.',
    '6. praise and tip.'
  ].join('\n');
  var tool = { name: 'coach_line', description: 'Coaching for one template line', input_schema: { type: 'object', properties: {
    errors: LAB_ERR, fn: LAB_FN, generic: LAB_OKNOTE, slotForm: { type: 'string' },
    cefr: LAB_LEVEL.cefr, band: LAB_LEVEL.band, praise: LAB_LEVEL.praise, tip: LAB_LEVEL.tip }, required: ['errors', 'fn', 'generic', 'slotForm', 'cefr', 'band', 'praise', 'tip'] } };
  return LAB_clean_(LAB_claude_('LAB_COACH_MODELS', user, tool, 900));
}

/* ------------------------------------------------------- one variable */
function LAB_coachVariable_(p) {
  var v = p.variable || {}, pr = p.prompt || {}, dc = p.dataCheck || {};
  var user = [
    'TASK: Coach ONE variable. The student has written the words that fill one slot of her own Task 1 template, for the chart below.',
    '',
    'CHART (IELTS Academic Task 1, ' + (pr.type || '') + ', mode ' + (pr.mode || p.mode || '') + '). The task sentence and ALL the data:',
    LAB_q_(pr.data || pr.rubric, 2500),
    '',
    'Target level: ' + p.level + ' (IELTS Band ' + p.band + ').',
    'Variable: "' + v.label + '". Its job: ' + (v.does || '') + ' Expected form: ' + (v.form || ''),
    'Word budget: ' + (p.budget || {}).lo + ' to ' + (p.budget || {}).hi + ' (the student wrote ' + p.words + ').',
    'The app\'s rule-based data check said: ' + (dc.status || 'none') + (dc.note ? ' (' + String(dc.note).slice(0, 300) + ')' : '') + '. Confirm or correct it from the data above.',
    '',
    'STUDENT\'S WORDS FOR THE SLOT:',
    LAB_q_(p.value, 600),
    (p.value2 ? 'SECOND MENTION (later in the report): ' + LAB_q_(p.value2, 300) : ''),
    '',
    'WHERE THE WORDS APPEAR (her template with this slot filled; slots not yet written are in [brackets]):',
    LAB_q_((p.inContext || []).join('\n\n'), 2400),
    (p.filled && p.filled.length ? 'Other variables already written (context only):\n- ' + p.filled.join('\n- ').slice(0, 1600) : ''),
    '',
    'Accuracy rules: a figure must match the data exactly, or carry an approximation word (about, around, just over, nearly) and lie within half a gridline step; a change between two percentages is in "percentage points"; years must be inside the chart; names must be the chart\'s categories, stages or map features; an overview slot has NO figures; tense follows the mode.',
    'Report:',
    '1. errors: real errors in the student\'s words, AND any grammar error created where her words join the template sentence (subject-verb agreement such as "the huts was", a missing past participle after "is", a missing unit).',
    '2. fn: does this variable do its job for THIS chart (the right key feature, enough precision)? meets / partly / missing.',
    '3. accuracy: is every figure, year, name and direction true to the data above? ok true/false, with a one-sentence note naming the correct value if wrong.',
    '4. fit: does the filled sentence read naturally and grammatically?',
    '5. cefr and band: the level of the student\'s own words.',
    '6. praise and tip. Never write a full model answer for the slot.'
  ].join('\n');
  var tool = { name: 'coach_variable', description: 'Coaching for one filled variable', input_schema: { type: 'object', properties: {
    errors: LAB_ERR, fn: LAB_FN, accuracy: LAB_OKNOTE, fit: LAB_OKNOTE,
    cefr: LAB_LEVEL.cefr, band: LAB_LEVEL.band, praise: LAB_LEVEL.praise, tip: LAB_LEVEL.tip }, required: ['errors', 'fn', 'accuracy', 'fit', 'cefr', 'band', 'praise', 'tip'] } };
  return LAB_clean_(LAB_claude_('LAB_COACH_MODELS', user, tool, 900));
}

/* ---------------------------------------------------------- the report */
var LAB_LADDER = [
  'Walk each criterion up the ladder and stop at the first band whose positive features are not all present (a script must fully fit the positive features of a band):',
  'TA: 5->6 an overview is attempted and most detail sentences carry data; 6->7 the overview is clear and correct, data are grouped not listed, accurate; 7->8 key features are skilfully selected and illustrated.',
  'CC: 5->6 clear overall progression, some paragraphing; 6->7 logical organisation, effective paragraphing, reference and substitution; 7->8 followed with ease, cohesion unobtrusive.',
  'LR: 5->6 adequate range, meaning clear; 6->7 some flexibility and precision, less common items, awareness of collocation; 7->8 wide, precise, skilful use of uncommon items, occasional slips only.',
  'GRA: 5->6 a mix of simple and complex forms, errors rarely impede; 6->7 a variety of complex structures, error-free sentences frequent; 7->8 a wide range, the majority of sentences error-free.',
  'CEILINGS (the lowest wins; they never stack; no arithmetic deductions): no overview -> TA max 5; vague or wrong overview -> TA max 6; fewer than 30% of detail sentences with data -> TA max 5; an opinion, reason or conclusion in a detail paragraph -> TA max 6, in the overview or dominating -> TA max 5; one category, stage or feature missing -> TA max 6, two or more -> TA max 5; a factual error in a main trend -> TA max 6, several -> TA max 5; bullet points -> TA max 5; one block of text -> CC max 5, two paragraphs -> CC max 6; memorised wording that does not fit the chart counts against LR; copied task wording (8+ words in a row) is discounted from the evidence and the word count; 100-149 words -> TA max 5; 21-99 words -> TA max 4.',
  'Approximation: values between gridlines take "about / just over"; an exact figure more than half a gridline away from the data is a factual error.'
].join('\n');
function LAB_rate_(p) {
  var pr = p.prompt || {};
  var user = [
    'TASK: Rate this IELTS Academic Writing Task 1 report against the public band descriptors (updated May 2023): one whole band per criterion, 1 to 9.',
    LAB_LADDER,
    'The student assembled the report from her own template (fixed wording listed below) plus words she wrote for this chart. Do not penalise the template for existing; judge whether it reads as memorised or mechanical, fits this chart and carries the right tense.',
    '',
    'Student target: ' + p.level + ' (Band ' + p.band + '). Template share: ' + Math.round((Number(p.share) || 0) * 100) + '% of the words (chosen ' + p.pct + '%).',
    '',
    'CHART (' + (pr.type || '') + ', mode ' + (pr.mode || p.mode || '') + '). Task sentence and ALL the data:',
    LAB_q_(pr.data || pr.rubric, 2500),
    (pr.keyFeatures && pr.keyFeatures.length ? 'Teacher key features: ' + pr.keyFeatures.join('; ') : ''),
    '',
    'REPORT (' + p.words + ' words):',
    LAB_q_(p.report, 5000),
    '',
    'App checks (rule-based, for your information): Ten Wards rows not green: ' + ((p.wards || []).join('; ') || 'none') + '. Data checks not green: ' + ((p.dataChecks || []).join('; ') || 'none') + '.',
    'HER TEMPLATE, paragraph by paragraph ([slots] were filled by her):',
    (p.frame || []).map(function (f, i) { return 'P' + (i + 1) + '. ' + f; }).join('\n').slice(0, 2400),
    '',
    'Report ta, cc, lr, gra (whole bands); ceilings (each ceiling you applied, in plain words, e.g. "No overview, so Task Achievement stops at 5"; empty if none); cefr for the report as a whole; summary (two sentences to the student); strengths (two, each quoting the report); priorities (two or three, each with the criterion TA, CC, LR or GRA and one concrete action that would raise it by half a band); frameNote (one sentence on how her template helps or shows).'
  ].join('\n');
  var band = { type: 'integer', description: 'whole band, 1 to 9' };
  var tool = { name: 'rate_report', description: 'Band estimate for one Task 1 report', input_schema: { type: 'object', properties: {
    ta: band, cc: band, lr: band, gra: band, ceilings: { type: 'array', items: { type: 'string' } }, cefr: LAB_LEVEL.cefr, summary: { type: 'string' },
    strengths: { type: 'array', items: { type: 'string' } },
    priorities: { type: 'array', items: { type: 'object', properties: { crit: { type: 'string', enum: ['TA', 'CC', 'LR', 'GRA'] }, text: { type: 'string' } }, required: ['crit', 'text'] } },
    frameNote: { type: 'string' } }, required: ['ta', 'cc', 'lr', 'gra', 'ceilings', 'cefr', 'summary', 'strengths', 'priorities', 'frameNote'] } };
  var r = LAB_claude_('LAB_RATE_MODELS', user, tool, 1400);
  ['ta', 'cc', 'lr', 'gra'].forEach(function (k) { var n = Number(r[k]); r[k] = isNaN(n) ? null : Math.max(1, Math.min(9, Math.round(n))); });
  /* task band = mean of the four, to the nearest half (.25 and .75 round up) */
  r.overall = [r.ta, r.cc, r.lr, r.gra].some(function (x) { return x == null; }) ? null : Math.floor((r.ta + r.cc + r.lr + r.gra) / 4 * 2 + 0.5 + 1e-9) / 2;
  /* CEFR from the official IELTS alignment only: 4–5 B1, 5.5–6.5 B2, 7–8 C1, 8.5–9 C2 */
  r.cefr = r.overall == null ? '' : r.overall >= 8.5 ? 'C2' : r.overall >= 7 ? 'C1' : r.overall >= 5.5 ? 'B2' : r.overall >= 4 ? 'B1' : '';
  r.ceilings = (r.ceilings || []).slice(0, 3); r.strengths = (r.strengths || []).slice(0, 3); r.priorities = (r.priorities || []).slice(0, 3);
  return r;
}

/* ------------------------------------------------------ setup check
   In the Apps Script editor: choose testLabAI in the function menu next
   to Run, press Run, then open the Execution log. It says whether the key
   is set and which model answered. Costs one tiny AI call.            */
function testLabAI() {
  var key = LAB_key_();
  if (!key) { Logger.log('NO KEY: add the Script property ANTHROPIC_API_KEY (Project Settings > Script properties).'); return; }
  Logger.log('Key found (' + key.slice(0, 7) + '...' + key.slice(-4) + '). Asking the coach models in turn...');
  var models = LAB_prop_('LAB_COACH_MODELS').split(',').map(function (m) { return m.trim(); }).filter(String);
  for (var i = 0; i < models.length; i++) {
    var res = UrlFetchApp.fetch('https://api.anthropic.com/v1/messages', {
      method: 'post', contentType: 'application/json', muteHttpExceptions: true,
      headers: { 'x-api-key': key, 'anthropic-version': '2023-06-01' },
      payload: JSON.stringify({ model: models[i], max_tokens: 20, messages: [{ role: 'user', content: 'Reply with the word OK.' }] })
    });
    Logger.log(models[i] + ': HTTP ' + res.getResponseCode() + (res.getResponseCode() === 200 ? '  <- working' : '  ' + res.getContentText().slice(0, 160)));
    if (res.getResponseCode() === 200) { Logger.log('AI coaching is ready. Remember: Deploy > Manage deployments > pencil > Version: New version > Deploy.'); return; }
  }
  Logger.log('No model answered. HTTP 401 = wrong key; 400 with "credit" = no API credit; 404 = model name not available to this key.');
}
