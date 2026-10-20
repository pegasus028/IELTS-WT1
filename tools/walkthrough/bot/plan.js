/* Builds the plan from the current progress so a run can resume. Plan names: 'all', or a room name to run a single room smoke (e.g. 'lesson', 'duel'). */
(function () {
  const Q = window.QB;
  Q.PROMPTS = { TREND: 'p-line-museums', COMPARE: 'p-bar-screentime', SEQUENCE: 'p-proc-glass', SPACE: 'p-map-thai-town' };
  Q.TOUR_PROMPT = 'p-line-phones';
  Q.buildPlan = function (name) {
    const C = window.CONTENT, p = Q.p(), ST = window.STORY, chapters = ST ? ST.chapters : [];
    const plan = [];
    const push = (room, args, skipIf) => plan.push({ room, args, skipIf });
    if (name && name !== 'all') { const a = (Q.smokeArgs || {})[name] || {}; push(name, a); return plan; }
    push('storyStart', {});
    chapters.forEach(ch => {
      push('storyChapter', { n: ch.n });
      ch.missions.forEach(m => {
        if (m.only && ((m.only === 'new') !== !(p.story && p.story.returning))) return;
        if (m.kind === 'event') push('storyEvent', { event: m.event, chapter: ch.n });
        else if (m.kind === 'sub') push('lesson', { subId: m.id }, () => { const r = Q.p().subs[m.id]; return r && r.best >= Q.E().PASS_SUB; });
        else if (m.kind === 'check') push('gate', { levelId: m.id }, () => { const lv = Q.E().Bank.level(m.id), r = Q.p().checks[lv.check.id]; return r && r.best >= Q.E().PASS_CHECK; });
        else if (m.kind === 'view' && m.view === 'bootcamp') push('duel', { promptId: Q.PROMPTS.TREND, firstDuel: true });
        else if (m.kind === 'view' && m.view === 'lab') { push('spellbookDesign', { mode: m.mode }); push('cast', { mode: m.mode, promptId: Q.PROMPTS[m.mode] }); if (m.mode !== 'TREND') { push('duel', { promptId: Q.PROMPTS[m.mode] }); push('report', { promptId: Q.PROMPTS[m.mode], mode: m.mode, uiMode: 'spellbook', kind: 'practice' }); } }
        else if (m.kind === 'view' && m.view === 'faults') push('mend', { target: ch.n === 7 ? 4 : 0 });
        else if (m.kind === 'view' && m.view === 'models') push('models', {});
        else if (m.kind === 'writing' && m.kind2 === 'report' && !m.full) push('report', { promptId: Q.PROMPTS.TREND, mode: 'TREND', uiMode: 'guided', kind: 'practice', short: true });
        else if (m.kind === 'writing' && m.kind2 === 'report' && m.full) push('report', { promptId: Q.PROMPTS.TREND, mode: 'TREND', uiMode: 'spellbook', kind: 'practice' });
        else if (m.kind === 'writing' && m.kind2 === 'mock') C.MOCKS.forEach(mk => push('mock', { mockId: mk.id, promptId: mk.promptId }, () => !!(Q.p().mocks || {})[mk.id]));
      });
      push('storyGate', { n: ch.n });
      if (ch.n === 7) { push('mend', { target: 4 }); push('storyGate', { n: 7 }); }
      if (ch.n === 5) { push('storyEvent', { event: 'tournament', chapter: 5 }); push('duel', { promptId: Q.TOUR_PROMPT }); push('cast', { mode: 'TREND', promptId: Q.TOUR_PROMPT, timing: '1min' }); push('report', { promptId: Q.TOUR_PROMPT, mode: 'TREND', uiMode: 'exam', kind: 'practice' }); }
    });
    push('mend', { target: 0 });
    push('record', {});
    return plan;
  };
})();
