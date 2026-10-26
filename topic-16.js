/* QUILLMOOR · THE OBSERVATORY — topic-16.js · Module 16 Tense by the Dates  (The Grammar Wing, WS-J Oct 2026)
   Imported from T.Chris's "Postcards & Plans" app (tense and aspect):
   Leg 2.1 (past simple: a finished event in finished time), Leg 3.1–3.2 (the
   present perfect; open and closed time), Leg 7.2–7.3 (future perfect; be due
   to and the arrangement ladder) and Leg 1.2 (the present simple is not about
   now — habits, facts, timetables → processes). One item from Leg 4.1 (the
   step backwards) sits in lesson 1; the rest of Leg 4 is phase 2.
   Rule wording is the app's; items are re-set on the Observatory's own charts
   with figures checked against prompts.js. `src` names the source item. */
(function () {
  var T = window.CONTENT.TOPICS;
  T.push({
    id: 'm16', n: 16, code: 'Module 16', name: 'Tense by the Dates', art: 'clock', cefr: 'A2–B2', wing: 'grammar',
    source: { app: 'Postcards & Plans', id: 'postcards-plans' },
    blurb: 'Past dates take the past simple, open time takes the present perfect, projections look back from the future, and processes have no date at all.',
    levels: [{
      id: 'm16l1', n: 1, name: 'Tense by the Dates', cefr: 'A2–B2', blurb: 'Read the dates on the chart; they choose the tense for you.',
      subs: [
        /* ------------------------------------------------------------ s1 · Leg 2.1 (+ one from Leg 4.1) */
        { id: 'm16s1', name: 'Past simple: a finished event in finished time', cefr: 'A2–B1',
          theory: {
            key: 'A whole event, inside a time that is over.',
            body: [
              '<p>This is the backbone of every TREND report you will ever write. <em>Arrivals rose. Production fell. The figure peaked in 2019.</em> Each one is complete, and each one sits in a time that has closed. The time is usually stated — <em>in 2019, between 2010 and 2020, over the decade</em> — and on a chart it is printed on the axis, so you never have to guess.</p>',
              '<p>Two mechanical things cost students more marks than anything else here. First, the irregular forms; there are about a hundred common ones and no shortcut exists (<em>rise → rose, fall → fell, grow → grew</em>). Second, and more fixable: in questions and negatives the tense moves onto <strong>did</strong>, and the main verb goes back to its base form. <em>Did arrivals recover?</em> — not <em>did arrivals recovered</em>. <em>They did not recover until 2023</em> — not <em>did not recovered</em>. English marks tense once per verb phrase. When <em>did</em> takes the job, the main verb is released.</p>',
              '<p>In a plain past-simple narrative, English makes a promise to the reader: the order of the sentences is the order of the events. The past perfect is how you break that promise on purpose — <em>By 2021 arrivals <strong>had fallen</strong> to 0.4 million</em> tells the reader this happened before the point you are standing at. Use it for the step backwards, once, and then drop back to the past simple.</p>'
            ],
            simple: [
              '<p>Use the past simple for finished events in finished time: <em>arrivals rose, production fell, the figure peaked</em>. The dates are on the chart.</p>',
              '<p>In questions and negatives, <strong>did</strong> takes the tense: <em>Did it recover?</em> not <em>Did it recovered?</em> Mark the tense <strong>once</strong> in each verb phrase, never twice.</p>',
              '<p><em>By 2021 arrivals <strong>had fallen</strong></em> = a step backwards in the story. Use <em>had</em> once, then go back to the past simple.</p>'
            ],
            examples: [
              { s: 'Arrivals <strong>fell</strong> to 6.7 million in 2020.', g: 'FINISHED EVENT, FINISHED TIME' },
              { s: '<s>Did arrivals recovered after 2021?</s> → <strong>Did</strong> arrivals <strong>recover</strong> after 2021?', g: 'DID CARRIES THE TENSE — RECOVER GOES BACK TO BASE' },
              { s: 'By 2021 arrivals <strong>had fallen</strong> to just 0.4 million.', g: 'THE STEP BACKWARDS — "HAD" IS THE SIGNAL' }
            ]
          },
          items: [
            { id: 'm16s1q1', type: 'spot', tag: 'gra-tense', level: 'A2', chart: 'p-line-museums', src: 'postcards-plans:s2l1-01',
              stem: 'Tap the chunk that is wrong.',
              words: ['Between 2010 and 2020', 'the Art Gallery', 'lose', 'about 90,000', 'visitors.'],
              answer: 2, fix: 'lost',
              hint: 'Look at the dates. Is the period open or closed? The verb must agree with the time.',
              why: 'The dates are closed time, so the verb takes the past simple — and <em>lose</em> is irregular. 610,000 fell to 520,000: a loss of about 90,000.' },
            { id: 'm16s1q2', type: 'gap', tag: 'gra-tense', level: 'A2', chart: 'p-bar-tourists', src: 'postcards-plans:s2l1-02',
              lines: [
                { who: 'Mint', text: 'How was 2020 for tourism?' },
                { who: 'Beam', text: 'Terrible. Arrivals ___ to 6.7 million that year.' }
              ],
              options: ['fall', 'fell', 'have fallen', 'were falling'],
              answer: 1,
              hint: 'A single finished event inside a closed year. Which form is the plain default for that?',
              why: 'A single finished event, inside a closed time (<em>that year</em> = 2020). The plain past simple is the default of any report about past dates.' },
            { id: 'm16s1q3', type: 'choose', tag: 'gra-pattern', level: 'B1', chart: 'p-bar-tourists', src: 'postcards-plans:s2l1-03',
              stem: 'Which sentence is correct?',
              options: ['Arrivals did not recovered until 2023.', 'Arrivals did not recover until 2023.', 'Arrivals not recovered until 2023.', 'Arrivals did not recovering until 2023.'],
              answer: 1,
              hint: 'English marks tense once per verb phrase. When "did" is there, what happens to the main verb?',
              why: '<em>Did</em> is marked for past, so <em>recover</em> stays in its base form. Marking both is the commonest A2 error in the whole topic. The recovery came in 2023 (28.2 million).' },
            { id: 'm16s1q4', type: 'order', tag: 'gra-tense', level: 'B1', chart: 'p-bar-tourists', src: 'postcards-plans:s2l1-04',
              stem: 'Put this trend story into the order it happened.',
              items: ['Arrivals rose steadily to a peak of 39.9 million in 2019.', 'In 2020 they collapsed to 6.7 million.', 'In 2021 they fell further, to just 0.4 million.', 'By 2025 they had climbed back to 36.5 million.'],
              hint: 'In a plain past-simple narrative the order of the sentences is the order of the events. Follow the years.',
              why: 'In a plain past-simple narrative, the order of the sentences IS the order of the events. That is the contract English makes with the reader — and the last sentence shows the one way to break it on purpose.' },
            { id: 'm16s1q5', type: 'build', tag: 'gra-tense', level: 'B1', chart: 'p-table-rice', src: 'postcards-plans:s2l1-05',
              stem: 'Report Thailand\'s change between 2000 and 2010 in one sentence.',
              tiles: ['Thai', 'rice', 'production', 'rose', 'from 26', 'to 36 million tonnes', 'between 2000 and 2010.'],
              solution: 'Thai rice production rose from 26 to 36 million tonnes between 2000 and 2010.',
              alt: ['between 2000 and 2010. Thai rice production rose from 26 to 36 million tonnes'],
              hint: 'Subject, past-simple verb, then the from … to figures, then the closed time.',
              why: 'A finished change in a closed period: past simple <em>rose</em>, with <em>from … to</em> carrying the figures and the dates at the end (or the front).' },
            { id: 'm16s1q6', type: 'choose', tag: 'gra-tense', level: 'B1', chart: 'p-table-rice', src: 'postcards-plans:s2l1-06',
              stem: 'Which sentence reports Thailand\'s 2010–2020 change most naturally?',
              options: ['Thai production has fallen from 36 to 30 million tonnes in 2020.', 'Thai production was falling from 36 to 30 million tonnes between 2010 and 2020.', 'Thai production falls from 36 to 30 million tonnes between 2010 and 2020.', 'Thai production fell from 36 to 30 million tonnes between 2010 and 2020.'],
              answer: 3,
              hint: 'A completed change on named past dates. One option turns the table into a timetable; one turns it into unfinished background.',
              why: 'A completed event in a closed period, so the past simple. The present perfect cannot take a finished time like <em>in 2020</em>; the progressive turns the change into background with no event landing in it; and the present simple turns the table into a timetable.' },
            { id: 'm16s1q7', type: 'judge', tag: 'gra-tense', level: 'B1', chart: 'p-line-museums', src: 'ws-j:new (postcards-plans:s2l1)',
              given: 'This chart ends in 2020, so the sentences about the figures take the past simple by default — but the introduction, "The graph shows …", stays in the present.',
              stem: 'Is this a sound rule for this chart?',
              answer: 0,
              hint: 'Ask whether the time on the chart is still running or has closed, and which one verb in a report describes the chart itself rather than the data.',
              why: 'Yes. 2010–2020 is closed time, so the data sentences default to the past simple (a past perfect is still fine for one step backwards); the introduction describes the chart you are looking at now, so <em>shows</em> stays present.' },
            { id: 'm16s1q8', type: 'gap', tag: 'gra-tense', level: 'B1', chart: 'p-bar-tourists', src: 'postcards-plans:s4l1-04',
              lines: [
                { who: 'Kan', text: 'Why does the 2021 bar look so empty?' },
                { who: 'Ploy', text: 'By 2021 arrivals ___ to just 0.4 million.' }
              ],
              options: ['fell', 'had fallen', 'have fallen', 'were falling'],
              answer: 1,
              hint: '"By" + a past year sets a reference point and asks what was already true before it.',
              why: '<em>By 2021</em> sets a past reference point and asks what was already true before it. That is precisely the past perfect\'s job: the step backwards.' }
          ] },

        /* ------------------------------------------------------------ s2 · Leg 3.1–3.2 */
        { id: 'm16s2', name: 'Open time and closed time', cefr: 'B1',
          theory: {
            key: 'The present perfect is a PRESENT tense. It cannot be pinned to a time that is over.',
            body: [
              '<p>Look at the form before the meaning. <em>Arrivals <strong>have</strong> risen.</em> The tense-carrying word is <em>have</em> — present. Every present perfect in English is grammatically a present tense. It answers the question <strong>"what is the situation now?"</strong> using something that happened earlier. <em>Arrivals rose</em> — an event in past time. <em>Arrivals have risen</em> — a statement about this moment. On a chart, that means one thing: the time axis runs <strong>up to now</strong> (<em>since 2015</em>, <em>over the past decade</em>, <em>so far this century</em>).</p>',
              '<p><em>I have been to Japan last year</em> is one of the most common errors at B1, and once you see why it fails you will never make it again. A present perfect claims relevance to <strong>now</strong>. A definite past-time expression closes the door on now. You cannot do both in one sentence, so English refuses the combination outright. The test is simple: does the time frame <strong>include this moment</strong>? <em>since 2015, this year, so far, recently, ever, never</em> — all still open, all fine with the present perfect. <em>in 2019, between 2010 and 2020, last year, a decade ago</em> — all closed, all take the past simple.</p>',
              '<p>Then the four small adverbs that live with this tense. <strong>Just</strong> — a moment ago: <em>arrivals have just passed 36 million</em>. <strong>Already</strong> — sooner than expected: <em>by 2023 arrivals had already recovered</em>. <strong>Yet</strong> — expected but missing, in questions and negatives: <em>they have not reached the 2019 peak yet</em>. <strong>Still</strong> with a negative — impatience. A note for the exam room: American English allows <em>I just landed</em>; British and international exam English wants the present perfect. Write for your marker.</p>'
            ],
            simple: [
              '<p>The present perfect is about <strong>now</strong>. On a chart, use it only when the time runs up to now: <em>since 2015</em>, <em>over the past decade</em>.</p>',
              '<p>Do not use it with a <strong>finished</strong> time: <s>Arrivals have peaked in 2019</s>. Closed time (<em>in 2019, between 2010 and 2020</em>) → past simple.</p>',
              '<p><em>just</em> = a moment ago · <em>already</em> = sooner than expected · <em>yet</em> = expected, not here.</p>'
            ],
            examples: [
              { s: 'Arrivals <strong>have risen</strong> steadily <strong>since 2015</strong>.', g: 'THE PERIOD IS STILL RUNNING' },
              { s: 'Arrivals <strong>rose</strong> steadily <strong>between 2015 and 2019</strong>.', g: 'THE PERIOD IS CLOSED' },
              { s: '<s>Arrivals have reached 39.9 million in 2019.</s> → Arrivals <strong>reached</strong> 39.9 million in 2019.', g: 'A DATE SHUTS THE DOOR ON NOW' }
            ]
          },
          items: [
            { id: 'm16s2q1', type: 'spot', tag: 'gra-tense', level: 'B1', chart: 'p-bar-tourists', src: 'postcards-plans:s3l2-01',
              stem: 'Tap a chunk that cannot stay in this sentence as it is.',
              words: ['Arrivals', 'have', 'reached', '39.9 million', 'in 2019.'],
              answer: 4, fix: 'delete "in 2019", or change "have reached" to "reached"', also: [1],
              hint: 'A present perfect claims relevance to now; a closed date closes the door on now. The two cannot share a sentence.',
              why: '<em>In 2019</em> is closed time, and <em>have reached</em> claims relevance to now — the two cannot share a sentence. Drop the time phrase, or use the past simple.' },
            { id: 'm16s2q2', type: 'sort', tag: 'gra-tense', level: 'B1', src: 'postcards-plans:s3l2-02',
              stem: 'Does the time frame include this moment?',
              bins: [{ key: 'open', label: 'Still open → present perfect', hint: 'includes now' }, { key: 'shut', label: 'Closed → past simple', hint: 'over and done' }],
              items: [{ text: 'since 2015', bin: 'open' }, { text: 'over the past decade', bin: 'open' }, { text: 'so far this century', bin: 'open' }, { text: 'in 2019', bin: 'shut' }, { text: 'between 2010 and 2020', bin: 'shut' }, { text: 'a decade ago', bin: 'shut' }],
              hint: 'It is not about how long ago. Ask whether the period reaches this second.',
              why: 'Nothing here is about how long ago it was. <em>Since 2015</em> reaches back years and still includes this second; <em>a decade ago</em> names a point that is shut.' },
            { id: 'm16s2q3', type: 'gap', tag: 'gra-tense', level: 'B1', src: 'postcards-plans:s3l1-02',
              lines: [
                { who: 'Examiner', text: 'Does this chart run up to now?' },
                { who: 'Student', text: 'Yes — the axis says "since 2015". So arrivals ___ steadily since 2015.' }
              ],
              options: ['rose', 'have risen', 'were rising', 'rise'],
              answer: 1,
              hint: 'The period starts in the past and is still running. Which tense reports a past change as the situation now?',
              why: 'An open period that reaches now takes the present perfect. The past simple would close the period; the present simple would make it a habit.' },
            { id: 'm16s2q4', type: 'choose', tag: 'gra-tense', level: 'B1', chart: 'p-line-museums', src: 'postcards-plans:s3l2-04',
              stem: 'The graph is dated 2010–2020 and we are reading it years later. Which sentence is correct?',
              options: ['The Science Museum has gained 340,000 visitors between 2010 and 2020.', 'The Science Museum gained 340,000 visitors between 2010 and 2020.', 'The Science Museum gains 340,000 visitors between 2010 and 2020.', 'The Science Museum is gaining 340,000 visitors between 2010 and 2020.'],
              answer: 1,
              hint: 'By now the period on the chart is over. Does the time frame still include this moment?',
              why: 'The period is closed, so it is closed time. If the chart ran "since 2010", <em>has gained</em> would be the natural one — the grammar follows the dates, not the verb.' },
            { id: 'm16s2q5', type: 'equiv', tag: 'gra-tense', level: 'B1', chart: 'p-bar-tourists', src: 'postcards-plans:s3l2-05',
              given: 'By 2023 arrivals had already recovered to 28.2 million.',
              stem: 'What does "already" add?',
              options: ['That it happened a very long time ago.', 'That it happened sooner than the writer expected.', 'That it has not happened yet but is still expected.', 'That it happens every year.'],
              answer: 1,
              hint: 'Think about expectation, not timing. Its opposite in this system is "yet".',
              why: '<em>Already</em> is about expectation, not timing. Its opposite in this system is <em>yet</em>: expected but still missing.' },
            { id: 'm16s2q6', type: 'build', tag: 'gra-tense', level: 'B1', chart: 'p-line-cities', src: 'postcards-plans:s3l2-06',
              stem: 'Osaka: 19.3 million in 2010, 19.0 million in 2025 (the latest measured year). Report the change up to now.',
              tiles: ['Osaka\'s', 'population', 'has', 'fallen', 'slightly', 'since', '2010.'],
              solution: 'Osaka\'s population has fallen slightly since 2010.',
              hint: 'The period starts at a past year and runs to the present. Choose the tense that says so, and the word that marks a starting point.',
              why: '<em>Since</em> + a starting point, running up to now: the present perfect. A small fall (0.3 million) earns <em>slightly</em>.' },
            { id: 'm16s2q7', type: 'judge', tag: 'gra-tense', level: 'B1', chart: 'p-line-museums', src: 'postcards-plans:s3l2-01',
              given: 'In 2010 the Science Museum has had 420,000 visitors.',
              stem: 'Is this tense acceptable in exam English?',
              answer: 1,
              hint: 'Find the time phrase. Does it include this moment, or is it shut?',
              why: 'No. <em>In 2010</em> is closed time, so the present perfect cannot stand next to it: <em>In 2010 the Science Museum had 420,000 visitors.</em>' }
          ] },

        /* ------------------------------------------------------------ s3 · Leg 7.2–7.3 + Leg 1.2 */
        { id: 'm16s3', name: 'Projections and processes: the tenses without a past date', cefr: 'B2',
          theory: {
            key: 'Stand at a future point and report what is already finished when you get there. A process has no date, so it takes the present simple.',
            body: [
              '<p>The future perfect needs a <strong>vantage point</strong>, and it must be stated or the tense has nothing to hang on. That is why <em>by</em> appears in almost every example: <em>by 2040, by the end of the decade</em>. <em>By 2030 Lagos <strong>will have overtaken</strong> Osaka.</em> Put yourself in 2030. The overtaking is behind you. That is all the tense is doing. The same time-clause rule applies: <em>by the time Lagos <strong>overtakes</strong> Osaka</em>, never <em>by the time Lagos will overtake</em>. The anchor clause never takes <em>will</em> — and nor does any other time clause, such as one with <em>when</em>, <em>before</em> or <em>after</em>: <em>when Lagos <strong>passes</strong> 20 million</em>, never <em>when Lagos will pass</em>.</p>',
              '<p>Beyond <em>will</em> sits a ladder of semi-modals, and the honest one is <strong>be due to</strong> / <strong>be expected to</strong> / <strong>be projected to</strong>: it reports what the forecast says without promising it will happen. <em>Bangkok <strong>is projected to</strong> reach 12.6 million by 2040.</em> When a chart marks figures as projections (a dotted line, a note), this is the register the examiner wants. <em>Be set to</em> is near-certain and journalistic; <em>be likely to</em> is a genuine hedge. Never report a projected figure as a past fact.</p>',
              '<p>Now the opposite case: a diagram with no dates at all. The present simple views an event as a <strong>complete whole</strong>, which is why it means habit, fact or timetable, never "right now". A process is exactly that: a whole event that happens every time. <em>The sand <strong>is heated</strong> in a furnace. The eggs <strong>hatch</strong> into tadpoles.</em> Present simple throughout, passive where people do the step, active where nature does.</p>'
            ],
            simple: [
              '<p>Future perfect: <em>will have</em> + past participle. Always set the point first: <em><strong>By 2030</strong>, Lagos will have overtaken Osaka.</em> After <em>by the time</em>, no <em>will</em>.</p>',
              '<p>Figures marked as projections: <em>is projected to</em>, <em>is expected to</em>, <em>is due to</em>. These say "the forecast says so" without promising it.</p>',
              '<p>A process has no dates, so every stage takes the present simple: <em>the sand is heated</em>, <em>the eggs hatch</em>.</p>'
            ],
            examples: [
              { s: 'By 2030 Lagos <strong>will have overtaken</strong> Osaka.', g: 'A VANTAGE POINT IN THE FUTURE, LOOKING BACK' },
              { s: 'Bangkok <strong>is projected to</strong> reach 12.6 million by 2040.', g: 'THE FORECAST SAYS SO — AND POSSIBLY NOT' },
              { s: 'At the first stage, the sand <strong>is heated</strong> in a furnace.', g: 'NO DATES → PRESENT SIMPLE' }
            ]
          },
          items: [
            { id: 'm16s3q1', type: 'choose', tag: 'gra-tense', level: 'B2', chart: 'p-line-cities', src: 'postcards-plans:s7l3-01',
              stem: 'The graph marks figures after 2025 as projections. Which sentence reports Lagos in 2040 correctly?',
              options: ['Lagos reached 24 million in 2040.', 'Lagos has already reached 24 million by 2040.', 'Lagos is projected to reach 24 million.', 'Lagos reaches 24 million inhabitants in 2040.'],
              answer: 2,
              hint: 'A dotted line is a forecast, not a measurement. Which wording reports a forecast without promising it?',
              why: '<em>Is projected to</em> reports the forecast without guaranteeing it. The past simple and the present perfect both report 2040 as a fact that has happened; the present simple makes it a timetable.' },
            { id: 'm16s3q2', type: 'gap', tag: 'gra-tense', level: 'B2', chart: 'p-line-cities', src: 'postcards-plans:s7l2-01',
              lines: [
                { who: 'Ann', text: 'Osaka is 19.0 million in 2025 and 17.8 million in the 2040 projection.' },
                { who: 'Sim', text: 'So by 2040 Osaka ___ by over a million.' }
              ],
              options: ['will shrink', 'will have shrunk', 'has shrunk', 'is going to be shrinking'],
              answer: 1,
              hint: '"By 2040" is a vantage point in the future. Which form looks back from that point at a change already complete?',
              why: 'A change complete at a future vantage point, so <em>will have</em> + past participle. 19.0 to 17.8 is a fall of 1.2 million.' },
            { id: 'm16s3q3', type: 'spot', tag: 'gra-tense', level: 'B2', chart: 'p-line-cities', src: 'postcards-plans:s7l2-03',
              stem: 'Tap the word that should not be there.',
              words: ['By the time', 'Lagos', 'will', 'overtake', 'Osaka,', 'both cities', 'will have passed', '18 million.'],
              answer: 2, fix: 'delete "will"',
              hint: '"By the time" opens a time clause. Time clauses keep a present form; only the main clause carries the future.',
              why: '<em>By the time</em> is a time conjunction, so the anchoring clause stays in a present form. The main clause keeps its future perfect. (Lagos 19.0 and Osaka 18.6 million in 2030.)' },
            { id: 'm16s3q4', type: 'sort', tag: 'gra-tense', level: 'B2', chart: 'p-line-cities', src: 'postcards-plans:s7l3-03',
              stem: 'Which tense does each report line need? Read the clue in brackets.',
              bins: [{ key: 'proj', label: 'Projection', hint: 'is projected / expected to' }, { key: 'past', label: 'Past simple', hint: 'a measured year' }, { key: 'proc', label: 'Present simple', hint: 'a process stage, no date' }],
              items: [{ text: 'Bangkok … 12.6 million in 2040 (dotted line)', bin: 'proj' }, { text: 'Lagos … Osaka by 2030 (dotted line)', bin: 'proj' }, { text: 'Lagos … from 4.8 to 7.2 million, 1990–2000', bin: 'past' }, { text: 'Osaka … at 19.3 million in 2010', bin: 'past' }, { text: 'the sand … in a furnace (diagram, no dates)', bin: 'proc' }, { text: 'the eggs … into tadpoles (diagram, no dates)', bin: 'proc' }],
              hint: 'A measured year is closed time; a dotted line is a forecast; a diagram with no dates happens every time.',
              why: 'Three registers, three jobs. Measured years are closed time (past simple); dotted lines are forecasts (<em>is projected to</em>); a diagram with no dates describes what happens every time (present simple).' },
            { id: 'm16s3q5', type: 'choose', tag: 'gra-tense', level: 'B1', src: 'postcards-plans:s1l2-07',
              stem: 'Which sentence belongs in a report on a process diagram with no dates?',
              options: ['First, the sand was heated in a furnace.', 'First, the sand has been heated in a furnace.', 'First, the sand is heated in a furnace.', 'First, the sand will be heated in a furnace.'],
              answer: 2,
              hint: 'A process is a whole event that happens every time, like a timetable or a fact. Which tense does English give to those?',
              why: 'A process has no date: it happens every time, like a habit or a timetable. That is the present simple\'s home ground — here in the passive, because people do the heating.' },
            { id: 'm16s3q6', type: 'equiv', tag: 'gra-tense', level: 'B2', chart: 'p-line-cities', src: 'postcards-plans:s7l3-05',
              given: 'Bangkok is expected to reach 12.6 million by 2040.',
              stem: 'What is the writer claiming?',
              options: ['That Bangkok has already reached 12.6 million.', 'That the figure is a forecast, not a measured fact.', 'That Bangkok reached 12.6 million in 2040.', 'That Bangkok will certainly reach exactly 12.6 million.'],
              answer: 1,
              hint: '"Expected to" reports what the projection says. Does it promise anything?',
              why: '<em>Is expected to</em> reports the projection and quietly declines to guarantee it. That gap is exactly why the examiner rewards it on a chart with a dotted line.' },
            { id: 'm16s3q7', type: 'build', tag: 'gra-tense', level: 'B2', chart: 'p-line-cities', src: 'postcards-plans:s7l2-05',
              stem: 'Lagos is projected at 19.0 million in 2030, Osaka at 18.6. Say what will be true by then.',
              tiles: ['By', '2030', 'Lagos', 'will', 'have', 'overtaken', 'Osaka.'],
              solution: 'By 2030 Lagos will have overtaken Osaka.',
              hint: 'Set the vantage point first, then the form that looks back from it.',
              why: 'A milestone seen from a future vantage point: <em>by</em> + the year, then <em>will have</em> + past participle.' },
            { id: 'm16s3q8', type: 'judge', tag: 'kn-triage-mode', level: 'B1', src: 'ws-j:new (postcards-plans:s1l2)',
              given: 'A process diagram takes the present simple because its stages happen every time, not at one date.',
              stem: 'Is this the reason SEQUENCE reports use the present simple?',
              answer: 0,
              hint: 'Think about what the present simple is for: habits, facts and timetables — whole events that repeat.',
              why: 'Yes. The present simple views an event as a complete whole that repeats, which is exactly what a process stage is. Dates would pull the report into the past simple; a process has none.' }
          ] }
      ],
      check: { id: 'm16ck', name: 'The examiner\'s gate', items: [
        { id: 'm16ckq1', type: 'spot', tag: 'gra-pattern', level: 'A2', chart: 'p-bar-tourists', src: 'postcards-plans:s2ch-1',
          stem: 'Tap the word that is wrong.',
          words: ['Did', 'arrivals', 'recovered', 'after', '2021?'],
          answer: 2, fix: 'recover',
          hint: 'One word already carries the past. What happens to the main verb then?',
          why: '<em>Did</em> carries the past, so the main verb returns to its base form.' },
        { id: 'm16ckq2', type: 'gap', tag: 'gra-tense', level: 'B1', chart: 'p-bar-tourists', src: 'postcards-plans:s3ch-2',
          lines: [
            { who: 'Staff', text: 'Any update on the 2025 figure?' },
            { who: 'Analyst', text: 'Yes — arrivals ___ 36.5 million this year, close to the 2019 peak.' }
          ],
          options: ['reached', 'have reached', 'were reaching', 'had reached'],
          answer: 1,
          hint: '"This year" is still running. Which tense gives news about the situation now?',
          why: 'News about the present situation inside an open period (<em>this year</em>). The past simple would close the year; the past perfect needs an earlier reference point.' },
        { id: 'm16ckq3', type: 'choose', tag: 'gra-tense', level: 'B1', chart: 'p-table-rice', src: 'postcards-plans:s3l2-04',
          stem: 'The table covers 2000, 2010 and 2020. Which sentence is correct?',
          options: ['India\'s output rose from 127 to 178 million tonnes over the period.', 'India\'s output has risen from 127 to 178 million tonnes over the period.', 'India\'s output rises from 127 to 178 million tonnes over the period.', 'India\'s output is rising from 127 to 178 million tonnes over the period.'],
          answer: 0,
          hint: 'Three measured years, the last of them in the past. Is the period open or closed?',
          why: '2000–2020 is closed time, so the past simple. The present perfect would need the period to reach now; the present forms turn a measured change into a habit or a scene.' },
        { id: 'm16ckq4', type: 'sort', tag: 'gra-tense', level: 'B1', src: 'postcards-plans:s3ch-5',
          stem: 'Does the time frame still include this moment?',
          bins: [{ key: 'open', label: 'Open → present perfect', hint: 'includes now' }, { key: 'shut', label: 'Closed → past simple', hint: 'over' }],
          items: [{ text: 'since 2000', bin: 'open' }, { text: 'so far', bin: 'open' }, { text: 'over the last decade', bin: 'open' }, { text: 'in 2019', bin: 'shut' }, { text: 'between 2015 and 2019', bin: 'shut' }, { text: 'a decade ago', bin: 'shut' }],
          hint: 'Not how long ago — whether the period reaches this second.',
          why: 'It is not about how long ago. <em>Since 2000</em> reaches across a quarter of a century and still includes this second; <em>in 2019</em> is shut.' },
        { id: 'm16ckq5', type: 'equiv', tag: 'gra-tense', level: 'B2', chart: 'p-line-cities', src: 'postcards-plans:s7l2-04',
          given: 'Osaka is projected to fall to 17.8 million by 2040.',
          stem: 'Which reading is right?',
          options: ['Osaka had 17.8 million people in 2040.', 'Osaka\'s population is falling right now by 17.8 million.', 'The 2040 figure is a forecast; today\'s figure is higher.', 'Osaka will certainly have 17.8 million people in 2040.'],
          answer: 2,
          hint: '"Projected to" names a forecast and a direction. Compare it with the latest measured year.',
          why: '<em>Is projected to fall</em> reports a forecast and a direction: from 19.0 million in 2025 down to 17.8. It promises nothing about certainty.' },
        { id: 'm16ckq6', type: 'spot', tag: 'gra-tense', level: 'B2', src: 'postcards-plans:s7l2-03',
          stem: 'Tap the word that should not be there.',
          words: ['When', 'the next survey', 'will', 'come out,', 'the figure', 'will have changed.'],
          answer: 2, fix: 'delete "will"',
          hint: 'The first clause is a time clause. Time clauses do not carry the future themselves.',
          why: 'A time clause (<em>when …</em>) stays in a present form; only the main clause carries the future: <em>When the next survey comes out, the figure will have changed.</em>' },
        { id: 'm16ckq7', type: 'build', tag: 'gra-tense', level: 'B1', chart: 'p-line-museums', src: 'postcards-plans:s2ch-8',
          stem: 'The Art Gallery: 610,000 visitors in 2010, 520,000 in 2020. One sentence.',
          tiles: ['The', 'Art', 'Gallery', 'lost', '90,000', 'visitors', 'between', '2010', 'and', '2020.'],
          solution: 'The Art Gallery lost 90,000 visitors between 2010 and 2020.',
          alt: ['between 2010 and 2020. The Art Gallery lost 90,000 visitors'],
          hint: 'A finished change in a closed period: subject, past-simple verb, figure, dates.',
          why: 'A finished event in finished time: the past simple, with the figure and the closed period around it.' },
        { id: 'm16ckq8', type: 'choose', tag: 'gra-tense', level: 'B1', chart: 'p-bar-tourists', src: 'postcards-plans:s3ch-1',
          stem: 'Which sentence uses the tense the dates demand?',
          options: ['Arrivals have peaked at 39.9 million in 2019.', 'Arrivals peak at 39.9 million in 2019.', 'Arrivals were peaking at 39.9 million in 2019.', 'Arrivals peaked at 39.9 million in 2019.'],
          answer: 3,
          hint: '"In 2019" is a closed date. A peak is a single whole event.',
          why: 'A closed date and a single whole event: past simple. The present perfect cannot sit next to <em>in 2019</em>; the progressive makes a peak into background; the present simple makes it a timetable.' }
      ] }
    }]
  });
})();
