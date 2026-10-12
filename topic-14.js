/* CHART CONTROL — topic-14.js · Module 14 Exam Day */
(function () {
  var T = window.CONTENT.TOPICS;
  T.push({
    id: 'm14', n: 14, code: 'Module 14', name: 'Exam Day', art: 'clock',
    cefr: 'A2–B2',
    blurb: 'Twenty minutes, five phases, ten checks. What to do on paper, on screen and when time runs out.',
    levels: [{
      id: 'm14l1', n: 1, name: 'Exam Day', cefr: 'A2–B2', blurb: 'The protocol that turns everything you have learned into 180 words on the clock.',
      subs: [
        { id: 'm14s1', name: 'The 20-minute protocol', cefr: 'A2–B1',
          theory: {
            key: 'Four minutes to plan, thirteen to write, three to check. Overview straight after the introduction. Hard stop at twenty.',
            body: [
              '<p>Task 1 is a twenty-minute sprint, and the students who do best are the ones who do not start writing immediately. The protocol has five phases. <strong>0:00–0:30 Triage</strong>: visual type, mode, units, time span, number of visuals. <strong>0:30–2:30 Big picture</strong>: ask the headline questions for the mode and write two overview bullets in the margin. <strong>2:30–4:00 Group and select</strong>: name two groups and circle three to five figures for each.</p>',
              '<p><strong>4:00–17:00 Write</strong> the four paragraphs to the skeleton, roughly 30, 45, 60 and 60 words. Write the overview immediately after the introduction, never at the end: if time runs out, the paragraph that gates your Task Achievement band is already on the page. <strong>17:00–20:00 Check</strong> with the ten-point list, then stop. Do not add a conclusion.</p>',
              '<p>The hard rule is that Task 1 receives twenty minutes, never thirty. Task 2 is worth twice as much, so every extra minute spent polishing Task 1 costs more than it earns. Practise with a visible timer until the phases feel automatic; four minutes of planning makes the thirteen minutes of writing faster and cleaner.</p>'
            ],
            simple: [
              '<p>Plan for four minutes: what kind of chart, the big picture, two groups, the figures you will use.</p>',
              '<p>Write for thirteen minutes: introduction, overview, details, details. Overview second, always.</p>',
              '<p>Check for three minutes. Stop at twenty. Task 2 is worth twice as much.</p>'
            ],
            examples: [
              { s: '0:30 triage · 2:00 big picture · 1:30 group and select · 13:00 write · 3:00 check', g: 'The five phases and their lengths. Together they make twenty minutes.' },
              { s: 'Margin notes: TREND · thousands · 2010–2020 · Science up, others down · crossover 2014 · History lowest', g: 'What four minutes of planning looks like on the page.' },
              { s: '<s>Spent 30 minutes on Task 1 to make it perfect, then rushed Task 2.</s>', g: 'The most expensive mistake in the Writing test.' }
            ]
          },
          items: [
            { id: 'm14s1q1', type: 'order', tag: 'struct-time', level: 'A2',
              stem: 'Put the five phases of the 20-minute protocol in order.',
              items: [
                'Triage: type, mode, units, time span',
                'Big picture: two overview bullets in the margin',
                'Group and select: two group names, 3–5 figures each',
                'Write the four paragraphs',
                'Check with the 10-point list'
              ],
              why: 'Decide what the chart is, find the story, choose the groups and the evidence, then write, then check. Each phase makes the next one faster.' },
            { id: 'm14s1q2', type: 'choose', tag: 'struct-time', level: 'A2',
              stem: 'How long should you spend planning before you write a word?',
              options: ['About four minutes', 'No time; start writing immediately', 'About ten minutes', 'Half of the twenty minutes'], answer: 0,
              why: 'Triage, big picture and grouping take four minutes together. Skipping them produces narration; taking ten leaves too little time to write 150 words.' },
            { id: 'm14s1q3', type: 'choose', tag: 'kn-test-facts', level: 'A2',
              stem: 'How much of the sixty-minute Writing test should Task 1 take?',
              options: ['About thirty minutes', 'About forty minutes', 'About twenty minutes', 'About ten minutes'], answer: 2,
              why: 'Twenty minutes for Task 1 and forty for Task 2, because Task 2 carries twice the weight. The instructions say "about 20 minutes" for a reason.' },
            { id: 'm14s1q4', type: 'judge', tag: 'struct-time', level: 'B1',
              given: 'A student spends thirty minutes on Task 1 to make it perfect, leaving thirty minutes for Task 2.',
              stem: 'Is this a good use of the hour?',
              answer: 1,
              why: 'Task 2 is worth two-thirds of the Writing score. Ten extra minutes on Task 1 might add a few words; ten minutes lost on Task 2 can cost a whole band.' },
            { id: 'm14s1q5', type: 'choose', tag: 'struct-time', level: 'B1',
              stem: 'Which paragraph should you write immediately after the introduction, and why?',
              options: [
                'The overview, because it gates the Task Achievement band',
                'The first detail paragraph, because it contains all the numbers',
                'A conclusion, because it summarises the chart',
                'The second detail paragraph, because it is the hardest'
              ], answer: 0,
              why: 'Without an overview the report cannot score above Band 5 for Task Achievement. Writing it second guarantees it is on the page even if time runs out.' },
            { id: 'm14s1q6', type: 'choose', tag: 'struct-time', level: 'B1',
              stem: 'What happens at 17:00 on the phase timer?',
              options: ['You begin the overview paragraph', 'You add a conclusion', 'You start Task 2', 'You stop writing and check'], answer: 3,
              why: 'The last three minutes belong to the ten-point check. Errors found in those minutes are the cheapest marks you will ever recover.' },
            { id: 'm14s1q7', type: 'sort', tag: 'struct-time', level: 'B1',
              stem: 'Sort each action into the phase where it belongs.',
              bins: [
                { key: 'plan', label: 'Planning (first 4 minutes)', hint: 'Before any sentence' },
                { key: 'write', label: 'Writing (13 minutes)', hint: 'The four paragraphs' },
                { key: 'check', label: 'Checking (last 3 minutes)', hint: 'The ten-point list' }
              ],
              items: [
                { text: 'Read the units and the time span', bin: 'plan' },
                { text: 'Write two overview bullets in the margin', bin: 'plan' },
                { text: 'Circle three to five figures for each group', bin: 'plan' },
                { text: 'Write paragraph 3 with figures and a comparison', bin: 'write' },
                { text: 'Count the words', bin: 'check' },
                { text: 'Check every verb tense against the dates', bin: 'check' }
              ],
              why: 'Reading, deciding and selecting happen before the first sentence; counting and checking happen after the last one. Mixing the phases is what makes students run out of time.' }
          ] },
        { id: 'm14s2', name: 'The Ten Wards (the 10-point check)', cefr: 'B1–B2',
          theory: {
            key: 'Ten questions in three minutes. Every "no" is a mark you can still recover.',
            body: [
              '<p>The last three minutes are not for admiring the report. Run the <strong>ten-point check</strong>: (1) four paragraphs, overview begins <em>Overall</em>? (2) overview has no figures and states two or three general truths? (3) every detail sentence has a number, date or label? (4) at least two explicit comparisons? (5) tense matches the dates? (6) <em>number of</em> for countable, <em>amount of</em> for uncountable, plural -s in place? (7) prepositions: to / by / from … to / at? (8) no opinion, no reason, no conclusion, no <em>I</em>, no contractions? (9) rubric not copied, every category mentioned? (10) 150–190 words?</p>',
              '<p>Points 1, 2 and 8 are structural and take ten seconds each: look at the shape of the report. Points 3 to 7 need you to read each detail sentence once, checking the figure, the tense and the preposition. A conclusion found at point 8 is simply crossed out: the overview already does its job, and a conclusion is repetition at best and opinion at worst.</p>',
              '<p>Register is the check students forget. <em>As we can see</em>, <em>I think</em>, <em>isn\'t</em>, <em>a lot</em>, <em>really sad</em> and <em>basically</em> all belong to speech, and each one costs Lexical Resource. Read the report as an examiner would, hunting for the voice of a person, and replace it with the voice of a report.</p>'
            ],
            simple: [
              '<p>Ten checks: four paragraphs, Overall with no numbers, a number in every detail sentence, two comparisons, correct tense, number/amount, to/by/at, no opinion or conclusion, all categories, 150–190 words.</p>',
              '<p>If you find a conclusion, cross it out.</p>',
              '<p>No <em>I</em>, no <em>we</em>, no <em>isn\'t</em>, no <em>a lot</em>. Write like a report, not like a person talking.</p>'
            ],
            examples: [
              { s: 'Overall, arrivals rose to a peak in 2019, collapsed in 2020 and 2021, and then recovered strongly.', g: 'Passes check 2: years are allowed, figures are not.' },
              { s: '<s>As we can see, the number of tourists dropped a lot in 2020, which is really sad.</s>', g: 'Fails check 8 three times: <em>we</em>, <em>a lot</em>, an opinion.' },
              { s: '<s>In conclusion, the Science Museum became the most popular museum.</s>', g: 'Fails check 8. Cross it out; the overview already says this.' }
            ]
          },
          items: [
            { id: 'm14s2q1', type: 'judge', tag: 'ta-conclusion', level: 'B1', chart: 'p-line-museums',
              given: 'In conclusion, the Science Museum became the most popular museum, while the other two lost visitors.',
              stem: 'Would this final paragraph pass the Ten Wards (the 10-point check)?',
              answer: 1,
              why: 'The sentence is true, but it repeats the overview under a new name. Task 1 has no conclusion; cross it out and use the seconds for checking.' },
            { id: 'm14s2q2', type: 'judge', tag: 'lr-register', level: 'B1', chart: 'p-bar-tourists',
              given: 'As we can see, the number of tourists dropped a lot in 2020, which is really sad.',
              stem: 'Does this sentence pass check 8 (register)?',
              answer: 1,
              why: '<em>We</em>, <em>a lot</em> and <em>really sad</em> are all spoken, personal language, and the last one is an opinion. Write: <em>Arrivals fell sharply to 6.7 million in 2020.</em>' },
            { id: 'm14s2q3', type: 'judge', tag: 'struct-length', level: 'B1',
              given: 'A report of 138 words with four paragraphs and a clear overview.',
              stem: 'Does this report pass the length check?',
              answer: 1,
              why: 'Under 150 words is penalised whatever the quality. One more comparison sentence with two figures would take it past the line.' },
            { id: 'm14s2q4', type: 'judge', tag: 'lr-register', level: 'B2', chart: 'p-bar-screentime',
              given: 'I think the graph shows that streaming isn\'t very popular with older people.',
              stem: 'Does this sentence pass the Ten Wards (the 10-point check)?',
              answer: 1,
              why: '<em>I think</em> and <em>isn\'t</em> fail the register check, and the claim is also inaccurate: streaming was the leading activity for people aged 30 and over, at 12 and 13 hours.' },
            { id: 'm14s2q5', type: 'choose', tag: 'kn-test-facts', level: 'B1',
              stem: 'Which item is NOT on the ten-point check?',
              options: ['Every category mentioned at least once', 'At least two comparisons', 'Tense matches the dates', 'A conclusion that repeats the overview'], answer: 3,
              why: 'The check looks for the absence of a conclusion, not its presence. The other three are points 9, 4 and 5 of the list.' },
            { id: 'm14s2q6', type: 'choose', tag: 'struct-length', level: 'B2',
              stem: 'Your report is 230 words and there are two minutes left. What do you do?',
              options: ['Add a conclusion to use the time', 'Write a fifth paragraph with more figures', 'Stop writing and run the ten-point check', 'Rewrite the introduction more formally'], answer: 2,
              why: '230 words is already more than enough. Extra sentences add errors, not marks. The last two minutes are worth most when spent checking.' },
            { id: 'm14s2q7', type: 'spot', tag: 'lr-register', level: 'B2', chart: 'p-pie-budget',
              stem: 'Tap the chunk that fails the register check.',
              words: ['Food and drinks', 'accounted for 38%', 'of spending,', 'the largest share,', 'which I think is too much.'], answer: 4, fix: 'well over a third of the total.',
              why: '<em>I think</em> is personal and <em>too much</em> is an opinion. Replace the comment with a second way of stating the figure, which adds range without adding a view.' }
          ] },
        { id: 'm14s3', name: 'On paper and on computer', cefr: 'B1–B2',
          theory: {
            key: 'Know how you will count words, which task you will write first, and what you will do if the clock beats you.',
            body: [
              '<p>On <strong>paper</strong>, count the words on one full line, multiply by the number of lines, and write the estimate in the margin. Leave a blank line between paragraphs so the examiner sees four blocks. On <strong>computer</strong>, the screen shows a word count, so use it; type the four skeleton headings first and delete them as you fill each one; type the overview immediately after the introduction; and use cut and paste to fix the order of sentences instead of retyping. There is no spell checker, so the ten-point check matters just as much on screen.</p>',
              '<p><strong>Task order.</strong> Most writers do Task 1 first, with a hard stop at twenty minutes. A writer who keeps running over on Task 1 can write Task 2 first instead: it protects the task that counts twice, and it forces Task 1 into the twenty minutes that remain. Whichever order you choose, decide before the exam, not in the room.</p>',
              '<p><strong>If time runs out.</strong> Because the overview is already in paragraph two, the report can still score. Finish the sentence you are writing, then check the essentials: <em>Overall</em> present, a figure in each detail sentence, word count above 150. Never spend the last minute on a conclusion: it adds no marks, and a sentence with a comparison and a figure would. Aim for 160–190 words; under 150 caps Task Achievement; past 200, every extra sentence costs checking time, and past 250 it usually means too little selection.</p>'
            ],
            simple: [
              '<p>Paper: count one line, multiply by the lines. Computer: use the word counter and type the overview second.</p>',
              '<p>Write Task 1 first and stop at twenty minutes. If you always run over, write Task 2 first.</p>',
              '<p>No time left? Finish your sentence, check <em>Overall</em> and the word count. Do not write a conclusion.</p>'
            ],
            examples: [
              { s: '11 words per line × 15 lines = about 165 words.', g: 'A paper estimate in five seconds.' },
              { s: 'Skeleton typed first: Intro / Overall / Group A / Group B. Then filled, then the headings deleted.', g: 'The computer habit that keeps four paragraphs.' },
              { s: '<s>With one minute left: "In conclusion, the town changed a lot."</s>', g: 'Five words that earn nothing. A comparison with a figure would earn something.' }
            ]
          },
          items: [
            { id: 'm14s3q1', type: 'choose', tag: 'kn-test-facts', level: 'B1',
              stem: 'On the computer-delivered test, how do you know your report is long enough?',
              options: ['Count the lines by hand', 'Use the on-screen word counter', 'Guess from how full the screen looks', 'Compare its length with Task 2'], answer: 1,
              why: 'The computer test shows a live word count. Use it at the end of each paragraph, and stop adding words once you pass 160.' },
            { id: 'm14s3q2', type: 'choose', tag: 'struct-time', level: 'B2',
              stem: 'Some writers do Task 2 first. What is the reason?',
              options: ['Task 2 is easier to plan', 'The examiner reads Task 2 first and marks it more carefully', 'Task 1 does not need planning', 'It protects the task that counts twice'], answer: 3,
              why: 'Writing the double-weighted task first protects it, and the twenty minutes left for Task 1 cannot stretch to thirty. The order is a choice; the twenty-minute limit is not.' },
            { id: 'm14s3q3', type: 'judge', tag: 'kn-test-facts', level: 'B1',
              given: 'On paper, you can estimate the word count by counting the words on one line and multiplying by the number of lines.',
              stem: 'Is this a reliable way to check length in the exam?',
              answer: 0,
              why: 'It takes five seconds and is accurate to within about ten words. Counting every word takes a minute you need for the other checks.' },
            { id: 'm14s3q4', type: 'choose', tag: 'struct-time', level: 'B2',
              stem: 'Two minutes are left and paragraph 4 is half written. What do you do?',
              options: ['Finish the sentence and check the essentials', 'Cross out paragraph 4 and write a short conclusion instead', 'Keep writing until the invigilator stops you', 'Leave paragraph 4 and start Task 2'], answer: 0,
              why: 'A complete sentence, then <em>Overall</em>, figures and word count. The overview is already on the page, so the report can still reach its band. A conclusion earns nothing.' },
            { id: 'm14s3q5', type: 'choose', tag: 'struct-length', level: 'B1',
              stem: 'Which word count is the best target for Task 1?',
              options: ['120–140 words', '250–280 words', '160–190 words', 'As many as possible'], answer: 2,
              why: '150 is the minimum, so aim a little above it. Beyond about 190 the extra sentences add errors and take time from checking and from Task 2.' },
            { id: 'm14s3q6', type: 'judge', tag: 'ta-conclusion', level: 'B2', chart: 'p-map-riverside',
              given: 'With one minute left, a student adds "In conclusion, the town changed a lot" to reach 150 words.',
              stem: 'Is this a good way to use the last minute?',
              answer: 1,
              why: 'A conclusion adds repetition, not marks, and this one is vague as well. A sentence such as <em>The park was also extended eastwards</em> adds a feature and reaches 150 honestly.' },
            { id: 'm14s3q7', type: 'choose', tag: 'kn-test-facts', level: 'B2',
              stem: 'On the computer test, which habit helps most?',
              options: ['Relying on the spell checker', 'Typing the overview right after the introduction', 'Typing all four paragraphs as one continuous block of text', 'Writing the last paragraph first'], answer: 1,
              why: 'The overview gates the band, so it goes on screen early. There is no spell checker, and one block of text loses the paragraphing that Coherence and Cohesion rewards.' }
          ] }
      ],
      check: { id: 'm14ck', name: 'Systems Check', items: [
        { id: 'm14ckq1', type: 'order', tag: 'struct-time', level: 'B1',
          stem: 'Put the timings of the protocol in order.',
          items: [
            '0:00–0:30 Triage',
            '0:30–2:30 Big picture',
            '2:30–4:00 Group and select',
            '4:00–17:00 Write',
            '17:00–20:00 Check'
          ],
          why: 'Four minutes of planning, thirteen of writing, three of checking. The numbers matter less than the habit of doing all five in order.' },
        { id: 'm14ckq2', type: 'choose', tag: 'kn-test-facts', level: 'B1',
          stem: 'What is the minimum word count for Task 1?',
          options: ['100 words', '250 words', '200 words', '150 words'], answer: 3,
          why: 'At least 150 words; under that, the report is penalised. Aim for 160–190 so that a miscount cannot drop you below the line.' },
        { id: 'm14ckq3', type: 'judge', tag: 'lr-register', level: 'B1', chart: 'p-mixed-coffee',
          given: 'It\'s clear that Finland drinks the most coffee, which isn\'t surprising.',
          stem: 'Does this sentence pass the register check?',
          answer: 1,
          why: 'Two contractions and a personal reaction. Report the fact: <em>Finland consumed by far the most coffee, at 21 cups per person per week.</em>' },
        { id: 'm14ckq4', type: 'judge', tag: 'ta-conclusion', level: 'B2',
          given: 'A report has an introduction, an overview, two detail paragraphs and a conclusion.',
          stem: 'Does this structure pass the Ten Wards (the 10-point check)?',
          answer: 1,
          why: 'Four paragraphs, not five. The conclusion repeats the overview and sometimes adds an opinion, so it can only cost marks. Delete it.' },
        { id: 'm14ckq5', type: 'choose', tag: 'struct-length', level: 'B2',
          stem: 'A report is 240 words and has no errors. What is the risk?',
          options: ['It is under the minimum length', 'The examiner stops reading at 190 words', 'Time for checking and Task 2 was lost', 'Long reports automatically score lower'], answer: 2,
          why: 'There is no penalty for length itself, but 240 words takes minutes that Task 2 and the check needed. Length is evidence, not a target.' },
        { id: 'm14ckq6', type: 'choose', tag: 'struct-time', level: 'B2',
          stem: 'Which is the best reason to write the overview second?',
          options: ['It is the shortest paragraph', 'It is on the page even if time runs out', 'Examiners read only the first two paragraphs', 'It contains the most figures'], answer: 1,
          why: 'The overview decides whether Task Achievement can go above Band 5. Writing it second means the clock cannot take it away from you.' },
        { id: 'm14ckq7', type: 'spot', tag: 'lr-register', level: 'B2', chart: 'p-line-phones',
          stem: 'Tap the chunk that belongs to speech, not to a report.',
          words: ['Smartphone ownership', 'rose from 10%', 'to 95%,', 'so basically', 'every teenager', 'owned one', 'by 2025.'], answer: 3, fix: 'meaning that almost',
          why: '<em>Basically</em> is a spoken filler, and <em>every teenager</em> overstates 95%. <em>Meaning that almost every teenager</em> keeps the point and the accuracy.' },
        { id: 'm14ckq8', type: 'choose', tag: 'kn-test-facts', level: 'B2',
          stem: 'Task 1 is worth what share of the Writing score?',
          options: ['A quarter', 'A third', 'A half', 'Two thirds'], answer: 1,
          why: 'One third for Task 1, two thirds for Task 2. That weighting is why Task 1 gets twenty minutes and why overrunning is so expensive.' }
      ] }
    }]
  });
})();
