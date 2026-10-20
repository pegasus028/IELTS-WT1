/* CHART CONTROL — topic-00.js · Module 00 The Test */
(function () {
  var T = window.CONTENT.TOPICS;
  T.push({
    id: 'm00', n: 0, code: 'Module 00', name: 'The Test', art: 'chip', cefr: 'A2–B2',
    blurb: 'Twenty minutes, 150 words, four criteria. Know the rules before you fly.',
    levels: [{
      id: 'm00l1', n: 1, name: 'The Test', cefr: 'A2–B2', blurb: 'The facts, the four criteria, and what an examiner punishes.',
      subs: [
        /* ------------------------------------------------------------ s1 */
        { id: 'm00s1', name: 'The facts', cefr: 'A2',
          theory: {
            key: 'About 20 minutes, at least 150 words, and Task 2 counts twice as much.',
            body: [
              '<p>The Writing paper lasts <strong>60 minutes</strong> and has two tasks. The instructions for Task 1 say: <em>"You should spend about 20 minutes on this task"</em> and <em>"Write at least 150 words."</em> Task 2 contributes <strong>twice as much</strong> as Task 1 to your Writing score, so a report that takes 30 minutes steals time from the task that is worth more.</p>',
              '<p>The task sentence (the <u>rubric</u>) always asks the same thing: <em>"Summarise the information by selecting and reporting the main features, and make comparisons where relevant."</em> Three verbs matter: <strong>summarise</strong>, <strong>select</strong>, <strong>compare</strong>. Nowhere does it say explain, discuss or give your view.</p>',
              '<p>You will see one or more graphs, charts or tables, or a diagram of a process or a map. The answer must be full, connected sentences in a neutral, academic style: no notes, no bullet points, no letter-style opening.</p>',
              '<p>Under 150 words is a problem: the examiner cannot see enough language to give the higher bands. A safe target is <strong>160–190 words</strong> in <strong>four paragraphs</strong>.</p>'
            ],
            simple: [
              '<p>Task 1 = 20 minutes and 150 words or more. Task 2 is worth two times more, so do not give Task 1 extra time.</p>',
              '<p>The task asks you to <strong>summarise</strong>, <strong>select</strong> and <strong>compare</strong>. It does not ask why or what you think.</p>',
              '<p>Write real paragraphs, not a list. Aim for 160–190 words.</p>'
            ],
            examples: [
              { s: 'Summarise the information by selecting and reporting the main features, and make comparisons where relevant.', g: 'The rubric. Three verbs: summarise, select, compare.' },
              { s: 'Task 1: 20 minutes · 150+ words · one third of the Writing score.', g: 'The three numbers to remember.' },
              { s: '<s>• Coal 48%  • Gas 22%</s> → Coal accounted for 48% of electricity, while gas made up 22%.', g: 'Notes are not accepted; write connected sentences.' }
            ]
          },
          items: [
            { id: 'm00s1q1', type: 'choose', tag: 'kn-test-facts', level: 'A2',
              stem: 'How long should you spend on Task 1?',
              options: ['About 10 minutes', 'About 20 minutes', 'About 30 minutes', 'About 40 minutes'], answer: 1,
              hint: 'Think about how the 60-minute paper is shared between the two tasks, and which task is worth more.',
              why: 'The instructions say "about 20 minutes". The paper lasts 60 minutes and Task 2 needs the other 40, because it is worth twice as much.' },
            { id: 'm00s1q2', type: 'choose', tag: 'kn-test-facts', level: 'A2',
              stem: 'What is the minimum number of words for Task 1?',
              options: ['100', '120', '150', '200'], answer: 2,
              hint: 'Recall the exact words of the Task 1 instructions: "Write at least ...". The number is the same in every test.',
              why: '"Write at least 150 words." A shorter answer gives the examiner too little language to reward, so the higher bands become impossible.' },
            { id: 'm00s1q3', type: 'judge', tag: 'kn-test-facts', level: 'B1',
              given: 'Task 2 counts for more of the Writing score than Task 1, so Task 1 should get less of the 60 minutes.',
              stem: 'Is this statement true?', answer: 0,
              hint: 'Remember how the Writing score is shared between the two tasks, and what that means for the time you give each one.',
              why: 'True. Task 2 contributes twice as much as Task 1 to the Writing score. That is why Task 1 gets about 20 minutes and Task 2 gets the other 40.' },
            { id: 'm00s1q4', type: 'select', tag: 'kn-test-facts', level: 'B1',
              stem: 'Which three verbs does the Task 1 rubric use to tell you what to do?',
              options: ['summarise', 'explain', 'select', 'discuss', 'compare', 'argue'], answers: [0, 2, 4], k: 3,
              hint: 'Read the rubric sentence again. Choose only verbs that really appear in it, even in another form such as an -ing form.',
              why: '"Summarise the information by selecting and reporting the main features, and make comparisons where relevant." Explain, discuss and argue belong to Task 2.' },
            { id: 'm00s1q5', type: 'choose', tag: 'kn-criteria', level: 'A2',
              stem: 'How many criteria is Task 1 marked on, and how much is each worth?',
              options: ['Two, 50% each', 'Three, one third each', 'Four, Task Achievement counts double', 'Four, 25% each'], answer: 3,
              hint: 'Name the criteria from this lesson and count them. Then ask whether the examiner gives any one of them extra weight.',
              why: 'Four criteria, equally weighted: Task Achievement, Coherence and Cohesion, Lexical Resource, Grammatical Range and Accuracy. Each is 25% of the Task 1 band.' },
            { id: 'm00s1q6', type: 'order', tag: 'kn-test-facts', level: 'B1',
              stem: 'Put the five phases of the 20-minute plan in order.',
              items: ['Triage: type, mode, units, time span (30 seconds)', 'Big picture: note two overview ideas (2 minutes)', 'Group and select the figures (1.5 minutes)', 'Write the four paragraphs (13 minutes)', 'Check with the 10-point list (3 minutes)'],
              hint: 'Ask what each phase needs from the one before it, and how the 20 minutes are shared out as a whole.',
              why: 'Four minutes of planning before writing produces a better report than 20 minutes of writing. The check at the end catches the cheap errors.' },
            { id: 'm00s1q7', type: 'judge', tag: 'kn-test-facts', level: 'A2',
              given: 'Even when time is short, the report must be written in full sentences, not bullet points.',
              stem: 'Is this true?', answer: 0,
              hint: 'Recall what the lesson says about the form of the answer, and whether time pressure changes it.',
              why: 'True. The answer must be connected prose in full sentences. Notes and bullet points are penalised, and a note-style answer cannot show grammar range.' }
          ] },

        /* ------------------------------------------------------------ s2 */
        { id: 'm00s2', name: 'The four criteria', cefr: 'B1',
          theory: {
            key: 'Every piece of feedback belongs to one of four criteria, and each criterion is a ladder of gates.',
            body: [
              '<p><strong>Task Achievement (TA)</strong> asks: did you select and report the main features, with an overview and with data, and make comparisons? <strong>Coherence and Cohesion (CC)</strong> asks: is it organised in paragraphs that progress logically, with links that are not mechanical? <strong>Lexical Resource (LR)</strong> asks: is the vocabulary precise, with good collocation and few spelling errors? <strong>Grammatical Range and Accuracy (GRA)</strong> asks: are the sentences varied and mostly error-free?</p>',
              '<p>The examiner reads the descriptors as a ladder and stops at the first band whose positive features are not all met. For TA, the rungs are: Band 5 <em>"the recounting of detail is mainly mechanical … there may be no data"</em>; Band 6 <em>"a relevant overview is attempted … supported using figures"</em>; Band 7 <em>"a clear overview, the data are appropriately categorised, main trends or differences are identified"</em>; Band 8 <em>"key features are skilfully selected … and illustrated"</em>.</p>',
              '<p>So one missing ingredient pins a criterion. No overview means TA cannot pass Band 5. No figures means the same. For CC, Band 7 needs <em>"reference and substitution"</em> used flexibly, not just <em>Firstly, Secondly</em>. For GRA, Band 7 needs <em>"error-free sentences frequent"</em>. For LR, Band 7 needs <em>"precision"</em> and <em>"awareness of collocation"</em>, not rare words used wrongly.</p>',
              '<p>Knowing which criterion a mistake costs tells you the fix. "No comparisons" is TA. "Rises" about a past year is GRA. "The number of electricity" is LR. "Two groups mixed in one paragraph" is CC.</p>'
            ],
            simple: [
              '<p>TA = did you give the main features, an overview, numbers and comparisons? CC = paragraphs and links. LR = words. GRA = grammar.</p>',
              '<p>The examiner climbs a ladder. If one thing is missing (no overview, no numbers), the score stops at Band 5 for that criterion.</p>',
              '<p>When you get feedback, ask: which criterion is this? The criterion tells you the fix.</p>'
            ],
            examples: [
              { s: 'Band 6 TA: "A relevant overview is attempted … supported using figures."', g: 'The two things that lift TA from 5 to 6: an overview and numbers.' },
              { s: 'Band 7 TA: "a clear overview, the data are appropriately categorised, main trends or differences are identified."', g: 'The 6 → 7 gate: clear overview, grouped data, named trends.' },
              { s: 'Band 7 GRA: "error-free sentences are frequent."', g: 'Accuracy, not just complexity, moves grammar to 7.' }
            ]
          },
          items: [
            { id: 'm00s2q1', type: 'sort', tag: 'kn-criteria', level: 'B1',
              stem: 'Sort each teacher comment into the criterion it belongs to.',
              bins: [{ key: 'ta', label: 'Task Achievement', hint: 'overview, data, features' }, { key: 'cc', label: 'Coherence and Cohesion', hint: 'paragraphs, links' }, { key: 'lr', label: 'Lexical Resource', hint: 'words' }],
              items: [
                { text: 'No overview paragraph', bin: 'ta' },
                { text: 'Every sentence starts with Firstly, Secondly, Then', bin: 'cc' },
                { text: '"the amount of visitors" — wrong word', bin: 'lr' },
                { text: 'No figures to support the claims', bin: 'ta' },
                { text: 'One long block with no paragraphs', bin: 'cc' },
                { text: '"a high rise" — those words do not go together', bin: 'lr' }
              ],
              hint: 'For each comment, ask: is the problem the content, the organisation of the text, or the choice of a single word?',
              why: 'Overview and data are TA. Paragraphing and linking are CC. Word choice and collocation are LR. Naming the criterion names the fix.' },
            { id: 'm00s2q2', type: 'choose', tag: 'kn-criteria', level: 'B1',
              stem: 'A student writes "rose to 10%" when the chart shows a rise of 10 points. Which criterion does this cost?',
              options: ['Task Achievement', 'Coherence and Cohesion', 'Lexical Resource', 'Grammatical Range and Accuracy'], answer: 3,
              hint: 'Ask what kind of slip this is: wrong facts, weak organisation, a poor content word, or a grammar error. Then name the criterion.',
              why: 'Prepositions with figures are grammar. "To" gives an end point, "by" gives the size of a change, so the wrong one also changes the fact.' },
            { id: 'm00s2q3', type: 'judge', tag: 'ta-opinion', level: 'B1',
              given: 'Explaining why the numbers changed shows the examiner that you understand the chart.',
              stem: 'Is this good advice for Task 1?', answer: 1,
              hint: 'Think about what the official guidance says candidates are, and are not, asked to do with the data.',
              why: 'False. The official guidance says candidates are "not being asked to interpret the data or give their opinion". Reasons are irrelevant material and lower Task Achievement.' },
            { id: 'm00s2q4', type: 'choose', tag: 'kn-criteria', level: 'B2',
              stem: 'Band 5 TA says "there may be no data to support the description". What fixes this?',
              options: ['A figure in every detail sentence', 'A longer, more detailed introduction', 'More linking words', 'A short conclusion that sums up the main trends'], answer: 0,
              hint: 'Read the Band 5 words closely: what exactly is missing? Choose the change that supplies that missing thing.',
              why: 'Band 6 needs details "supported using figures". The habit is simple: every sentence in paragraphs 3 and 4 carries a number, a date or a label from the chart.' },
            { id: 'm00s2q5', type: 'choose', tag: 'kn-criteria', level: 'B2',
              stem: 'The examiner reads the descriptors from Band 5 upwards. Where does the score stop?',
              options: ['At the band of the best sentence', 'At Band 7, unless the writing is completely error-free', 'At the first band the script does not fully fit', 'At the band the word count allows'], answer: 2,
              hint: 'Recall the lesson rule about how the examiner reads the descriptor ladder, then test each option against it.',
              why: 'The rule is that a script "must fully fit the positive features" of a band. One missing feature, such as no overview, stops the climb for that criterion.' },
            { id: 'm00s2q6', type: 'choose', tag: 'kn-criteria', level: 'B2',
              stem: '"A range of cohesive devices including reference and substitution is used flexibly." Which CC band says this?',
              options: ['Band 5', 'Band 6', 'Band 7', 'Band 8'], answer: 2,
              hint: 'Reference words such as "the latter" are a step above simple linking words. Which band of the CC ladder adds that step?',
              why: 'This is the Band 7 sentence. Band 6 only says devices are used "to some good effect" but may be "mechanical". Reference words like "this figure" and "the latter" are the 6 to 7 step.' },
            { id: 'm00s2q7', type: 'judge', tag: 'kn-criteria', level: 'B2',
              given: 'Lexical Resource rewards using many rare words, even if some are used wrongly.',
              stem: 'Is this what the descriptors say?', answer: 1,
              hint: 'Look at what the Band 7 LR descriptor asks for, and what it says about writers who take risks with words.',
              why: 'False. Band 7 LR needs "precision" and "an awareness of style and collocation". The descriptor warns that a risk-taker gets a wider range but "higher degrees of inaccuracy". Precise beats rare.' }
          ] },

        /* ------------------------------------------------------------ s3 */
        { id: 'm00s3', name: 'What the examiner punishes', cefr: 'B2',
          theory: {
            key: 'Five things lose marks by being there: opinion, reasons, a conclusion, copied rubric, and a report with no data.',
            body: [
              '<p>Task 1 is a factual report. The official guidance says candidates are <em>"not being asked to interpret the data or give their opinion"</em>. So: no <em>I think</em>, no <em>surprisingly</em>, no <em>this is a good result</em>, and no reasons such as <em>because people became richer</em>. These are <em>"irrelevant material"</em> in the Band 5 descriptor and they pull Task Achievement down.</p>',
              '<p><strong>No conclusion.</strong> An official IELTS teacher article says plainly: <em>"No Conclusion is needed for Task 1."</em> The overview already summarises. A conclusion repeats it (costs Coherence and Cohesion), often adds an opinion (costs Task Achievement), and wastes minutes you need for checking.</p>',
              '<p><strong>Do not copy the rubric.</strong> The descriptors say <em>"any copied rubric must be discounted"</em>: copied words are removed from your word count and do not count as evidence of your English. Paraphrase the task sentence instead.</p>',
              '<p><strong>No data, no band.</strong> The Band 5 descriptor says <em>"there may be no data to support the description"</em>. The official comment on a Band 5 script was that it "would have been greatly improved if the candidate had included some reference to the figures". Numbers are not decoration; they are the evidence.</p>'
            ],
            simple: [
              '<p>Do not say why something happened and do not say what you think about it. Only report what the chart shows.</p>',
              '<p>Do not write a conclusion. The overview already does that job.</p>',
              '<p>Do not copy the task sentence. Copied words are not counted. And always give numbers.</p>'
            ],
            examples: [
              { s: 'Bicycle sales rose from 20,000 to 35,000, <s>probably because petrol became more expensive</s>.', g: 'The reason is a guess. Stop at the figure.' },
              { s: '<s>To sum up, the figures changed a great deal over the period.</s>', g: 'A conclusion adds nothing, whatever its first words. Delete it.' },
              { s: '<s>As we can see, it is clear that</s> Thai teachers earned far less, at $9,000.', g: 'No "we", no comment. The figure is the evidence.' }
            ]
          },
          items: [
            { id: 'm00s3q1', type: 'spot', tag: 'ta-opinion', level: 'B1', chart: 'p-mixed-coffee',
              stem: 'Tap the part of the sentence that does not belong in a Task 1 report.',
              words: ['Coffee consumption', 'in Finland', 'was by far', 'the highest,', 'at 21 cups', 'a week,', 'which is surprising.'], answer: 6,
              fix: 'Delete "which is surprising" — the sentence ends at "a week".',
              hint: 'Read each part of the sentence and ask: could you check this part against the bar chart?',
              why: '"Surprising" is your opinion. The chart does not show surprise. The rest of the sentence is a perfect claim with a figure: Finland, 21 cups, the highest.' },
            { id: 'm00s3q2', type: 'choose', tag: 'ta-conclusion', level: 'B1', chart: 'p-pie-energy',
              stem: 'Which sentence should NOT appear anywhere in a report on these pie charts?',
              options: ['Overall, coal fell while gas rose.', 'In conclusion, the charts show many changes.', 'Coal fell from 48% to 18%.', 'Natural gas had become the largest source by 2020.'], answer: 1,
              hint: 'Decide the job of each sentence: overview, detail, or something else. Then check each claim against the two pies.',
              why: 'Task 1 needs no conclusion, and this one says nothing. The other three are an overview claim, a detail with figures, and a true comparison: gas at 30% was the biggest slice in 2020.' },
            { id: 'm00s3q3', type: 'judge', tag: 'ta-conclusion', level: 'B2', chart: 'p-line-museums',
              given: 'In conclusion, the Science Museum rose strongly while the other two museums declined.',
              stem: 'This is the last paragraph of a report. Is a final paragraph like this needed?', answer: 1,
              hint: 'Recall the flight plan: how many paragraphs it has, and the job of each one.',
              why: 'False. The sentence is true, but it belongs in the overview (paragraph 2), not in a conclusion. Repeating the overview at the end costs Coherence and adds no new information.' },
            { id: 'm00s3q4', type: 'sort', tag: 'ta-opinion', level: 'B1', chart: 'p-pie-energy',
              stem: 'Sort the sentences: report it, or leave it out?',
              bins: [{ key: 'in', label: 'Report it', hint: 'fact from the chart' }, { key: 'out', label: 'Leave it out', hint: 'opinion, reason, conclusion' }],
              items: [
                { text: 'Coal fell to 18% in 2020.', bin: 'in' },
                { text: 'This shows that the country cares about the environment.', bin: 'out' },
                { text: 'The government probably built more wind farms.', bin: 'out' },
                { text: 'Wind and solar rose from 5% to 27%.', bin: 'in' },
                { text: 'In conclusion, energy changed a lot.', bin: 'out' },
                { text: 'Nuclear stayed almost unchanged, at 15% and then 14%.', bin: 'in' }
              ],
              hint: 'Ask of each sentence: can I point to it on the pie charts? If not, it is the writer speaking.',
              why: 'A report states what the chart shows, with figures. "Cares about", "probably" and "in conclusion" are opinion, guess and repetition: all three are irrelevant material.' },
            { id: 'm00s3q5', type: 'choose', tag: 'kn-test-facts', level: 'B2',
              stem: 'Your introduction copies the task sentence word for word. What happens?',
              options: ['The examiner gives Band 4 automatically', 'Nothing, because the introduction is not marked', 'The whole report is treated as plagiarism', 'The copied words are not counted'], answer: 3,
              hint: 'Recall the one descriptor sentence about copied rubric in this lesson, and test each option against its key verb.',
              why: 'The descriptors say "any copied rubric must be discounted". Those words vanish from your word count and cannot show your vocabulary, so a copied intro leaves you with a shorter report.' },
            { id: 'm00s3q6', type: 'choose', tag: 'ta-conclusion', level: 'B2',
              stem: 'A report has an overview in paragraph 2 and a conclusion in paragraph 5. What should the writer do?',
              options: ['Delete the conclusion', 'Delete the overview', 'Keep both but make the conclusion shorter', 'Move the conclusion above the overview'], answer: 0,
              hint: 'Recall the flight plan and the job of each paragraph in it. Then test each option against that plan.',
              why: 'The overview is the band-gating paragraph; the conclusion only repeats it. Deleting the conclusion loses nothing and saves time for checking.' },
            { id: 'm00s3q7', type: 'select', tag: 'ta-opinion', level: 'B2',
              stem: 'Tick the three things Task 1 asks you NOT to do.',
              options: ['Compare figures', 'Give your opinion', 'Summarise the information', 'Explain the causes', 'Write a conclusion', 'Select the main features', 'Mention every category'], answers: [1, 3, 4], k: 3,
              hint: 'Compare each action with the rubric sentence. Three of them add something the chart cannot show or the task does not need.',
              why: 'Opinion and causes are interpretation, which the test says it does not ask for. A conclusion is not needed. Comparing, summarising, selecting and covering every category are all required.' }
          ] }
      ],

      /* ------------------------------------------------------------ check */
      check: { id: 'm00ck', name: 'Systems Check', items: [
        { id: 'm00ckq1', type: 'choose', tag: 'kn-test-facts', level: 'A2',
          stem: 'Which pair of numbers is correct for Task 1?',
          options: ['20 minutes, 150 words', '30 minutes, 150 words', '20 minutes, 250 words', '40 minutes, 250 words'], answer: 0,
          hint: 'Recall the Task 1 instructions: the time they suggest and the minimum length they set. Do not mix them up with Task 2.',
              why: 'About 20 minutes and at least 150 words. The 250-word minimum and the 40 minutes belong to Task 2.' },
        { id: 'm00ckq2', type: 'judge', tag: 'kn-criteria', level: 'A2',
          given: 'The four criteria are worth 25% each.',
          stem: 'True or false?', answer: 0,
          hint: 'Think about how the four marks are combined into one band. Is any criterion weighted more than the others?',
              why: 'True. Task Achievement, Coherence and Cohesion, Lexical Resource and Grammatical Range and Accuracy are equally weighted.' },
        { id: 'm00ckq3', type: 'spot', tag: 'ta-opinion', level: 'B1', chart: 'p-bar-tourists',
          stem: 'Tap the chunk that breaks the rules of a Task 1 report.',
          words: ['Overall,', 'arrivals', 'rose to a peak', 'in 2019', 'and, I think,', 'fell sharply', 'in 2020.'], answer: 4,
          fix: '"and then" — no personal voice.',
          hint: 'Check the facts against the bar chart first. If they are right, look at who is speaking in each part of the sentence.',
              why: '"I think" is personal opinion. A report is impersonal: no I, we or you. The facts here are right: the peak was in 2019 and the collapse in 2020.' },
        { id: 'm00ckq4', type: 'choose', tag: 'kn-criteria', level: 'B1',
          stem: 'Which criterion is most directly damaged by a missing overview?',
          options: ['Task Achievement', 'Coherence and Cohesion', 'Lexical Resource', 'Grammatical Range and Accuracy'], answer: 0,
          hint: 'Recall the Band 6 and Band 7 descriptors that mention an overview. Which criterion do they belong to?',
              why: 'The overview appears in the TA descriptors: Band 6 "a relevant overview is attempted", Band 7 "a clear overview". Without one, TA stays at Band 5.' },
        { id: 'm00ckq5', type: 'order', tag: 'kn-criteria', level: 'B2',
          stem: 'Put the Task Achievement ladder in order, from Band 5 up to Band 8.',
          items: ['Details are mechanical; there may be no data', 'An overview is attempted; details are supported with figures', 'A clear overview; data categorised; main trends identified', 'Key features skilfully selected and illustrated'],
          hint: 'Start with the weakest description and add one new ingredient at each step up the ladder.',
              why: 'Each band adds one thing: figures and an overview (6), then grouping and clarity (7), then skilful selection (8). Climb one rung at a time.' },
        { id: 'm00ckq6', type: 'judge', tag: 'ta-conclusion', level: 'B1',
          given: 'A Task 1 report should end with a short conclusion that repeats the main point.',
          stem: 'True or false?', answer: 1,
          hint: 'Recall the four paragraphs of the flight plan and the job of each one before you decide.',
              why: 'False. "No Conclusion is needed for Task 1." The overview does the summarising, and repetition costs Coherence and Cohesion.' },
        { id: 'm00ckq7', type: 'choose', tag: 'ta-conclusion', level: 'B2', chart: 'p-table-rice',
          stem: 'Which is the best final sentence of a report on this table?',
          options: ['In conclusion, rice production changed a great deal in these years.', 'To sum up, the data is very interesting.', 'Thailand\'s output fell from 36 to 30 million tonnes after 2010.', 'Overall, the table is clear.'], answer: 2,
          hint: 'Decide what a Task 1 report should end with. Then check each option against the figures in the table.',
              why: 'The report simply ends with its last detail, a claim with figures. Thailand really did fall from 36 to 30 million tonnes. The other three are conclusions or comments that add nothing.' },
        { id: 'm00ckq8', type: 'choose', tag: 'ta-opinion', level: 'B2', chart: 'p-bar-screentime',
          stem: 'Which sentence gives a reason and must be cut?',
          options: ['Gaming fell with age, from 12 hours to just 1.', 'Streaming was similar across all four groups, at 12 to 15 hours.', 'Social media was highest among teenagers, at 21 hours.', 'Older people gamed less because they were busier with work.'], answer: 3,
          hint: 'Look for the sentence that tries to explain why something happened. The chart shows hours, not causes.',
              why: '"Because they were busier" is a guess about causes; the chart shows no such thing. The other three report figures that are true of the chart.' }
      ] }
    }]
  });
})();
