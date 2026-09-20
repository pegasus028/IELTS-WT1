/* CHART CONTROL — topic-01.js · Module 01 Triage */
(function () {
  var T = window.CONTENT.TOPICS;
  T.push({
    id: 'm01', n: 1, code: 'Module 01', name: 'Triage', art: 'scope', cefr: 'A2–B2',
    blurb: 'Thirty seconds to decide the mode, the units and the tense — before you read a single number.',
    levels: [{
      id: 'm01l1', n: 1, name: 'Triage', cefr: 'A2–B2', blurb: 'TREND, COMPARE, SEQUENCE or SPACE; units and labels; time frame and tense.',
      subs: [
        /* ------------------------------------------------------------ s1 */
        { id: 'm01s1', name: 'Four operating modes', cefr: 'A2',
          theory: {
            key: 'Time axis or two dates = TREND. No time = COMPARE. Stages = SEQUENCE. Map = SPACE.',
            body: [
              '<p>Before you read any numbers, ask four questions. <strong>Is there a time axis, or two or more dates?</strong> Yes: <u>TREND</u> mode. No: <u>COMPARE</u> mode. <strong>Is it a diagram of stages?</strong> <u>SEQUENCE</u> mode. <strong>Is it a map or a plan?</strong> <u>SPACE</u> mode. <strong>How many visuals?</strong> One is standard; two need one paragraph each.</p>',
              '<p>The mode decides your tense, your verbs and your connectors. TREND uses change verbs (<em>rose, fell, peaked at</em>) and the past simple. COMPARE uses comparison language (<em>higher than, twice as many as, accounted for</em>). SEQUENCE uses the present simple and the passive with sequencers. SPACE uses compass points and change-of-use verbs (<em>was demolished, converted into</em>).</p>',
              '<p>The shape of the visual does not decide the mode; the <em>time</em> does. A bar chart with years along the bottom is TREND. A bar chart with age groups is COMPARE. Two pie charts dated 2000 and 2020 are TREND. A table with years in the columns is TREND; a table with countries and one year is COMPARE.</p>',
              '<p>The classic error is writing <em>increased</em> about a chart where nothing changes over time. That is not a small slip: it tells the examiner you have not looked at the axes, and it counts as inaccurate content.</p>'
            ],
            simple: [
              '<p>Look for time first. Years or dates = TREND. No years = COMPARE. A diagram with steps = SEQUENCE. A map = SPACE.</p>',
              '<p>The mode tells you which words to use. TREND: rose, fell. COMPARE: higher than, twice as many. SEQUENCE: is heated, then. SPACE: to the north of, was built.</p>',
              '<p>A bar chart can be TREND (years) or COMPARE (groups). Check the labels, not the shape.</p>'
            ],
            examples: [
              { s: 'Line graph, 2010–2020 → TREND: "The Science Museum rose from 420,000 to 760,000."', g: 'Time axis, so change verbs in the past simple.' },
              { s: 'Bar chart of four age groups in 2023 → COMPARE: "Teenagers spent far more time on social media than the over-50s."', g: 'One year only, so nothing rises or falls.' },
              { s: '<s>Gaming increased from the 50+ group to the 13–17 group.</s>', g: 'Wrong mode. Age groups are categories, not time.' }
            ]
          },
          items: [
            { id: 'm01s1q1', type: 'choose', tag: 'kn-triage-mode', level: 'A2', chart: 'p-line-museums',
              stem: 'Which operating mode is this chart?',
              options: ['TREND', 'COMPARE', 'SEQUENCE', 'SPACE'], answer: 0,
              why: 'There is a time axis (2010 to 2020), so this is TREND mode: change verbs in the past simple, from … to …, peaked at.' },
            { id: 'm01s1q2', type: 'choose', tag: 'kn-triage-mode', level: 'A2', chart: 'p-bar-screentime',
              stem: 'The categories are age groups and there is only one year. Which mode?',
              options: ['TREND', 'COMPARE', 'SEQUENCE', 'SPACE'], answer: 1,
              why: 'No time axis, just categories. COMPARE mode: higher than, twice as many as, the highest. Nothing rises or falls here.' },
            { id: 'm01s1q3', type: 'sort', tag: 'kn-triage-mode', level: 'A2',
              stem: 'Sort each visual into its mode.',
              bins: [{ key: 'trend', label: 'TREND', hint: 'time axis or two dates' }, { key: 'compare', label: 'COMPARE', hint: 'no time, just categories' }, { key: 'seq', label: 'SEQUENCE', hint: 'stages' }],
              items: [
                { text: 'A line graph of rice exports, 2000–2020', bin: 'trend' },
                { text: 'A pie chart of one year\'s spending', bin: 'compare' },
                { text: 'A diagram of how paper is made', bin: 'seq' },
                { text: 'A table of salaries in five countries in 2022', bin: 'compare' },
                { text: 'Two pie charts, one for 2000 and one for 2020', bin: 'trend' },
                { text: 'The life cycle of a butterfly', bin: 'seq' }
              ],
              why: 'Dates make TREND, even for pie charts. One year makes COMPARE, even for a table. Stages make SEQUENCE, whether natural or man-made.' },
            { id: 'm01s1q4', type: 'judge', tag: 'kn-triage-mode', level: 'B1', chart: 'p-bar-tourists',
              given: 'This is a bar chart, so it is in COMPARE mode.',
              stem: 'Is this reasoning correct?', answer: 1,
              why: 'False. The bars are years, from 2015 to 2025, so time runs along the axis. That makes it TREND mode: arrivals rose, collapsed and recovered. Shape never decides the mode.' },
            { id: 'm01s1q5', type: 'choose', tag: 'kn-triage-mode', level: 'A2', chart: 'p-map-riverside',
              stem: 'Which mode is this?',
              options: ['COMPARE', 'TREND', 'SPACE', 'SEQUENCE'], answer: 2,
              why: 'A map is SPACE mode: compass points and change verbs such as "was demolished" and "was converted into". The two dates add a TREND flavour to the tenses.' },
            { id: 'm01s1q6', type: 'choose', tag: 'kn-triage-mode', level: 'B1', chart: 'p-pie-energy',
              stem: 'Two pie charts, dated 2000 and 2020. Which mode leads?',
              options: ['COMPARE only, because pies show shares', 'TREND, because there are two dates', 'SEQUENCE, because 2000 comes before 2020', 'SPACE, because the pies sit side by side'], answer: 1,
              why: 'Two dates mean change over time: the share of coal fell, the share of wind and solar rose. You still compare slices, but the headline is the change.' },
            { id: 'm01s1q7', type: 'choose', tag: 'kn-triage-mode', level: 'B1', chart: 'p-bar-screentime',
              stem: 'A student writes "gaming increased" about this chart. What went wrong?',
              options: ['The figure is wrong', 'The word "gaming" needs "the"', 'The tense should be present perfect, not past', 'There is no time axis, so nothing "increased"'], answer: 3,
              why: 'The chart shows four age groups in one year. Gaming is higher for younger groups; it did not increase. A trend verb on a COMPARE chart is an accuracy error.' }
          ] },

        /* ------------------------------------------------------------ s2 */
        { id: 'm01s2', name: 'Units, axes and labels', cefr: 'B1',
          theory: {
            key: 'Read the title, both axes, the units and the legend before anything else. The unit changes every sentence.',
            body: [
              '<p>Most "inaccurate data" marks come from a <strong>unit misread</strong>, not a number misread. A line at 760 on an axis labelled <em>thousand visitors</em> means <strong>760,000 visitors</strong>, not 760. A bar at 39.9 on an axis labelled <em>millions</em> means 39.9 million people. A pie slice of 48 means <strong>48%</strong>, a share, not a quantity.</p>',
              '<p>So, in the first thirty seconds, say aloud: what is <u>measured</u> (visitors, hours, dollars, tonnes), in what <u>unit</u> (thousands, millions, %, per person per week), for which <u>categories</u> (the legend or the rows), over what <u>range</u> (the years). Only then look for the big picture.</p>',
              '<p>Watch the small words in the title. <em>Average hours per week</em> is not total hours. <em>Per person</em> means one person, not the whole country. <em>Percentage of households</em> is a share of households, so the number cannot be more than 100. A table can mix units in different columns: dollars in two columns and hours in the third.</p>',
              '<p>Write the unit into your sentences: "760,000 visitors", "39.9 million arrivals", "48% of electricity", "21 hours a week". The examiner checks the figure and the unit together.</p>'
            ],
            simple: [
              '<p>Look at the axis label. "Thousands" means 760 = 760,000. "Millions" means 39.9 = 39.9 million. A pie number is a percentage.</p>',
              '<p>Read the title carefully: "average", "per person", "per week" change the meaning.</p>',
              '<p>Always write the unit with the number: 21 hours a week, 48% of electricity.</p>'
            ],
            examples: [
              { s: 'The Science Museum received <s>760</s> 760,000 visitors in 2020.', g: 'The axis says "thousand visitors".' },
              { s: 'Arrivals peaked at 39.9 million in 2019.', g: 'The axis says "millions"; write the word.' },
              { s: 'Teenagers spent an average of 21 hours a week on social media.', g: 'The title says average hours per week: one person, one week.' }
            ]
          },
          items: [
            { id: 'm01s2q1', type: 'choose', tag: 'kn-triage-units', level: 'A2', chart: 'p-line-museums',
              stem: 'What does the vertical axis of this graph measure?',
              options: ['Visitors per day', 'Millions of visitors', 'Percentage of visitors', 'Thousands of visitors'], answer: 3,
              why: 'The unit is "thousand visitors". Every value you read must be multiplied by a thousand: 420 on the axis is 420,000 people.' },
            { id: 'm01s2q2', type: 'spot', tag: 'kn-triage-units', level: 'B1', chart: 'p-line-museums',
              stem: 'Tap the chunk that misreads the unit.',
              words: ['In 2020,', 'the Science Museum', 'received', '760', 'visitors,', 'the highest figure', 'of the period.'], answer: 3,
              fix: '760,000 (the axis is in thousands)',
              why: 'The axis label is "thousand visitors", so 760 means 760,000. Everything else is right: 760,000 was the highest value on the whole graph.' },
            { id: 'm01s2q3', type: 'judge', tag: 'kn-triage-units', level: 'B1', chart: 'p-bar-screentime',
              given: 'The chart shows the total number of hours that all the people in each age group spent online.',
              stem: 'Is this a correct reading of the chart?', answer: 1,
              why: 'False. The title says "average number of hours per week": one typical person, one week. Not a total, and not the whole group.' },
            { id: 'm01s2q4', type: 'choose', tag: 'kn-triage-units', level: 'B1', chart: 'p-table-salaries',
              stem: 'The table has three columns of numbers. Which one is NOT in dollars?',
              options: ['Starting salary', 'Salary after 15 years', 'Hours per week'], answer: 2,
              why: 'Tables can mix units. Two columns are salaries in US dollars; the third is working hours. Writing "$54" for Japan\'s hours would be a unit error.' },
            { id: 'm01s2q5', type: 'choose', tag: 'kn-triage-units', level: 'B1', chart: 'p-pie-energy',
              stem: 'What do the numbers on these pie charts mean?',
              options: ['Millions of tonnes of coal burned', 'The share (%) of electricity from each source', 'The number of power stations', 'The amount of money spent on each energy source'], answer: 1,
              why: 'A pie chart shows shares of a whole, and the unit here is %. Coal at 48 means 48% of all electricity, so say "accounted for 48%", not "48 tonnes".' },
            { id: 'm01s2q6', type: 'judge', tag: 'gra-tense', level: 'B1', chart: 'p-line-cities',
              given: 'Lagos had 24 million people in 2040.',
              stem: 'Is this sentence an accurate report of the graph?', answer: 1,
              why: 'False. The dotted part of the line after 2025 is a projection. Lagos "is expected to reach" 24 million by 2040; "had" reports it as a past fact.' },
            { id: 'm01s2q7', type: 'choose', tag: 'kn-triage-units', level: 'B2', chart: 'p-mixed-coffee',
              stem: 'Which sentence reads both units correctly?',
              options: ['Finns drank 21 litres a week and paid 3.9 baht per cup.', 'Finns drank 21 cups a day and paid $39 per cup.', 'Finns drank 21 cups a week and paid $3.90 per cup.', 'Finns drank 21% more coffee and paid $3.90 per cup.'], answer: 2,
              why: 'The bar chart is cups per person per week; the table is US dollars per cup. Finland: 21 cups and $3.90. Litres, days and percentages are not in either visual.' }
          ] },

        /* ------------------------------------------------------------ s3 */
        { id: 'm01s3', name: 'Time frame and tense', cefr: 'B2',
          theory: {
            key: 'Past dates → past simple. Future years → is expected to. No dates → present simple.',
            body: [
              '<p>Tense follows the time frame, and the time frame is decided in triage. If all the dates are in the past (<em>2010–2020</em>), use the <strong>past simple</strong>: <em>rose, fell, was, accounted for</em>. Keep it simple: <em>was increasing</em>, <em>has increased</em> and <em>was increased</em> are usually wrong for trend verbs.</p>',
              '<p>If the graph runs into the future (a dotted line, or years after today), those values are <strong>projections</strong>: <em>is expected to reach, is projected to fall, will rise</em>. Never report a projection as a fact: "Lagos <em>had</em> 24 million in 2040" is an error.</p>',
              '<p>If there are <strong>no dates</strong> at all (a process diagram, a single pie with no year), use the <strong>present simple</strong>: <em>the bottles are collected, the tadpole hatches, food accounts for</em>. A chart with one past year (2023) takes the past simple.</p>',
              '<p>Maps with two dates mix tenses on purpose: past simple or present perfect for what changed (<em>the factory was demolished; the park has been extended</em>), present simple for what is there now, and <em>will be built</em> for a planned map.</p>'
            ],
            simple: [
              '<p>Years in the past = past simple: rose, fell, was.</p>',
              '<p>Years in the future = is expected to / will. No years = present simple: is heated, accounts for.</p>',
              '<p>Maps: was demolished (past), has been extended (up to now), will be built (plan).</p>'
            ],
            examples: [
              { s: 'Between 2010 and 2020 the Science Museum <s>rises</s> rose from 420,000 to 760,000.', g: 'All dates in the past: past simple.' },
              { s: 'Lagos <s>reached</s> is expected to reach 24 million by 2040.', g: 'After 2025 the line is a projection.' },
              { s: 'The used bottles <s>were</s> are collected at a bottle bank.', g: 'A process has no dates: present simple.' }
            ]
          },
          items: [
            { id: 'm01s3q1', type: 'choose', tag: 'gra-tense', level: 'B1', chart: 'p-line-museums',
              stem: 'All the dates are between 2010 and 2020. Which verb form fits "The Science Museum ___ strongly"?',
              options: ['rises', 'rose', 'has risen', 'will rise'], answer: 1,
              why: 'Every date is in the past, so the past simple is the safe, correct choice. "Has risen" would need a period that continues to now.' },
            { id: 'm01s3q2', type: 'choose', tag: 'gra-tense', level: 'B2', chart: 'p-line-cities',
              stem: 'Choose the form: "Lagos ___ 24 million by 2040."',
              options: ['reached', 'has reached', 'is expected to reach', 'was reaching'], answer: 2,
              why: 'The values after 2025 are projections, shown by the dotted line. Report them as expectations: is expected to, is projected to, will.' },
            { id: 'm01s3q3', type: 'spot', tag: 'gra-tense', level: 'B1', chart: 'p-pie-energy',
              stem: 'Tap the verb with the wrong tense.',
              words: ['In 2000,', 'coal', 'accounts for', 'almost half', 'of electricity,', 'at 48%.'], answer: 2,
              fix: 'accounted for',
              why: 'The year 2000 is in the past, so the verb must be past simple. The rest is accurate: 48% is just under half.' },
            { id: 'm01s3q4', type: 'judge', tag: 'gra-tense', level: 'B1',
              given: 'A process diagram has no dates, so it is described in the present simple.',
              stem: 'True or false?', answer: 0,
              why: 'True. With no time frame, the present simple describes how the process works: the glass is crushed, the eggs hatch.' },
            { id: 'm01s3q5', type: 'choose', tag: 'gra-tense', level: 'B2', chart: 'p-map-riverside',
              stem: 'The factory of 1995 is gone by 2025. Which sentence uses the tenses correctly?',
              options: ['The factory is demolished and apartments are built.', 'The factory will be demolished and apartment blocks will be built.', 'The factory demolished and apartment blocks built.', 'The factory was demolished and apartments were built.'], answer: 3,
              why: 'The change happened between 1995 and 2025, so past forms: was demolished, were built (or "has been replaced"). "Will be" is for a planned map; the present simple is for what stands there now.' },
            { id: 'm01s3q6', type: 'spot', tag: 'gra-tense', level: 'B2', chart: 'p-table-rice',
              stem: 'Tap the wrong word.',
              words: ['Rice production', 'in India', 'increases', 'from 127', 'to 178 million tonnes', 'between 2000 and 2020.'], answer: 2,
              fix: 'increased',
              why: 'The columns are 2000, 2010 and 2020: all past. A present-tense verb about past dates shows the writer has not looked at the time frame.' },
            { id: 'm01s3q7', type: 'sort', tag: 'gra-tense', level: 'B2',
              stem: 'Sort each visual into the tense you would mainly use.',
              bins: [{ key: 'past', label: 'Past simple', hint: 'dates in the past' }, { key: 'pres', label: 'Present simple', hint: 'no dates' }, { key: 'fut', label: 'Future form', hint: 'projections, plans' }],
              items: [
                { text: 'A line graph of populations, 1990–2020', bin: 'past' },
                { text: 'One pie chart with no year given', bin: 'pres' },
                { text: 'The planned buildings on a map of the future', bin: 'fut' },
                { text: 'A diagram of how bread is made', bin: 'pres' },
                { text: 'A bar chart of arrivals, 2015–2025', bin: 'past' },
                { text: 'City populations projected to 2040', bin: 'fut' }
              ],
              why: 'The dates decide the tense. Past years take the past simple; no dates take the present simple; projections and plans take "is expected to" or "will be".' }
          ] }
      ],

      /* ------------------------------------------------------------ check */
      check: { id: 'm01ck', name: 'Systems Check', items: [
        { id: 'm01ckq1', type: 'choose', tag: 'kn-triage-mode', level: 'A2', chart: 'p-table-salaries',
          stem: 'Five countries, one year. Which mode?',
          options: ['TREND', 'SEQUENCE', 'COMPARE', 'SPACE'], answer: 2,
          why: 'There is no time axis, only categories (countries) and one year. COMPARE mode: higher than, the highest, respectively.' },
        { id: 'm01ckq2', type: 'choose', tag: 'kn-triage-units', level: 'B1', chart: 'p-bar-tourists',
          stem: 'The unit is millions. How many arrivals were there in 2019?',
          options: ['39.9 million', '39.9 thousand', '39,900', '3.99 million'], answer: 0,
          why: 'The bar reads 39.9 and the axis says millions: 39.9 million arrivals. Always carry the unit into the sentence.' },
        { id: 'm01ckq3', type: 'judge', tag: 'gra-tense', level: 'B1', chart: 'p-proc-glass',
          given: 'The bottles were crushed and then melted in a furnace.',
          stem: 'Is the tense right for this process diagram?', answer: 1,
          why: 'False. A process has no dates, so it takes the present simple: the bottles are crushed and then melted. The stages themselves are in the right order.' },
        { id: 'm01ckq4', type: 'spot', tag: 'kn-triage-units', level: 'B1', chart: 'p-line-internet',
          stem: 'Tap the chunk that misreads the unit.',
          words: ['In 2025,', '97 households', 'in Sweden', 'had internet access,', 'the highest', 'of the four countries.'], answer: 1,
          fix: '97% of households',
          why: 'The axis is "% of households", so 97 is a percentage, not a count of houses. Sweden at 97% really was the highest in 2025.' },
        { id: 'm01ckq5', type: 'sort', tag: 'kn-triage-mode', level: 'B1',
          stem: 'TREND or COMPARE? Sort the visuals.',
          bins: [{ key: 'trend', label: 'TREND', hint: 'time' }, { key: 'compare', label: 'COMPARE', hint: 'no time' }],
          items: [
            { text: 'Bar chart: tourist arrivals by year', bin: 'trend' },
            { text: 'Bar chart: screen time by age group', bin: 'compare' },
            { text: 'Table: salaries in five countries, 2022', bin: 'compare' },
            { text: 'Two pie charts, 2000 and 2020', bin: 'trend' },
            { text: 'Table: rice production in 2000, 2010 and 2020', bin: 'trend' },
            { text: 'One pie chart of weekly spending', bin: 'compare' }
          ],
          why: 'Same shape, different mode. Years anywhere on the visual make it TREND; a single year or no year makes it COMPARE.' },
        { id: 'm01ckq6', type: 'choose', tag: 'gra-tense', level: 'B2', chart: 'p-line-cities',
          stem: 'Which sentence about Osaka is correct?',
          options: ['Osaka is projected to fall to 17.8 million by 2040.', 'Osaka has fallen gradually to 17.8 million by 2040.', 'Osaka fell slightly to 17.8 million in 2040.', 'Osaka falls slightly to 17.8 million in 2040.'], answer: 0,
          why: '2040 is a projection year, so the fall is expected, not finished. Osaka\'s line does slope down slightly after 2025, to 17.8 million.' },
        { id: 'm01ckq7', type: 'choose', tag: 'kn-triage-units', level: 'A2', chart: 'p-pie-budget',
          stem: 'What is measured in this pie chart?',
          options: ['Baht spent each week', 'Share of weekly money (%)', 'Number of items bought each week', 'Hours spent shopping'], answer: 1,
          why: 'The unit is %. Each slice is a share of the student\'s weekly money, so food and drinks "accounted for 38%", not "38 baht".' },
        { id: 'm01ckq8', type: 'judge', tag: 'gra-tense', level: 'B2', chart: 'p-map-riverside',
          given: 'The maps show 1995 and 2025, so the changes are described with past forms such as "was demolished".',
          stem: 'True or false?', answer: 0,
          why: 'True. Both dates are behind us, so the changes are complete: the factory was demolished, the car park was replaced by a shopping mall. Present forms describe what stands there now.' }
      ] }
    }]
  });
})();
