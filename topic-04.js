/* CHART CONTROL — topic-04.js · Module 04 Claim + Number */
(function () {
  var T = window.CONTENT.TOPICS;
  T.push({
    id: 'm04', n: 4, code: 'Module 04', name: 'Claim + Number', art: 'grid', cefr: 'A2–B2',
    blurb: 'A claim without a figure is an opinion. Every detail sentence carries a number.',
    levels: [{
      id: 'm04l1', n: 1, name: 'Claim + Number', cefr: 'A2–B2', blurb: 'Data in every sentence, the right preposition with every figure, and safe approximation.',
      subs: [
        /* ------------------------------------------------------------ s1 */
        { id: 'm04s1', name: 'Every sentence carries a figure', cefr: 'A2',
          theory: {
            key: 'In paragraphs 3 and 4, every sentence has a claim and a number from the chart.',
            body: [
              '<p>The Band 5 descriptor for Task Achievement says <em>"there may be no data to support the description"</em>. Band 6 says details are <em>"supported using figures/data"</em>. The difference between the two bands is a habit: in the detail paragraphs, <strong>every sentence carries a figure, a date or a label from the chart</strong>. <em>The Science Museum became much more popular</em> is a claim. <em>The Science Museum rose from 420,000 to 760,000 visitors</em> is a claim with evidence.</p>',
              '<p>The shape is always the same: <strong>claim + number</strong>. The claim says what happened or how two things compare (<em>rose, fell, was the largest, was twice as high</em>); the number proves it (<em>to 760,000; at 38%; 54 hours</em>). A sentence with only a number and no claim is a list; a sentence with only a claim and no number is an opinion.</p>',
              '<p>The number must be <u>true</u>. Read it from the axis or the table, not from memory. The Band 5 descriptor also punishes <em>"inaccurate material"</em>, so a wrong figure costs as much as a missing one. When you check your report, circle the figure in every detail sentence: no circle, no evidence; wrong circle, wrong evidence.</p>',
              '<p>Not every figure needs to appear. Three or four well-chosen numbers per paragraph, each attached to a claim, are worth more than ten numbers in a row.</p>'
            ],
            simple: [
              '<p>Paragraphs 3 and 4: every sentence needs a number, a year or a name from the chart.</p>',
              '<p>Claim + number. "Coal fell" is a claim. "Coal fell to 18%" is a claim with proof.</p>',
              '<p>Check the number on the chart. A wrong number is as bad as no number.</p>'
            ],
            examples: [
              { s: '<s>The Science Museum became much more popular.</s> → The Science Museum rose from 420,000 to 760,000 visitors.', g: 'Claim only becomes claim + number.' },
              { s: 'Japanese teachers worked the longest week, at 54 hours.', g: 'Claim (longest) + number (54). True of the table.' },
              { s: '<s>Korean teachers started on $31,000.</s> → Korean teachers started on $33,000.', g: 'A number that is wrong is worse than useless. Read the table again.' }
            ]
          },
          items: [
            { id: 'm04s1q1', type: 'judge', tag: 'ta-no-data', level: 'A2', chart: 'p-line-museums',
              given: 'The Science Museum became far more popular, with visitors climbing to 760,000 by 2020.',
              stem: 'Is this a complete detail sentence for paragraph 3?', answer: 0,
              hint: 'Check the sentence for two things, a claim and a figure. Then check the figure against the graph.',
              why: 'True. The claim (far more popular) is backed by a correct figure from the graph: 760,000 visitors in 2020. Claim + number is exactly what paragraph 3 needs.' },
            { id: 'm04s1q2', type: 'choose', tag: 'ta-no-data', level: 'A2', chart: 'p-pie-budget',
              stem: 'Which sentence carries a figure?',
              options: ['Food and drinks made up 38% of spending.', 'Food and drinks was the biggest part of spending.', 'The student spent most on food and drinks.', 'The student spent a great deal on food and drinks.'], answer: 0,
              hint: 'Recall what the examiner needs to see in a detail sentence besides a claim. Then read each option.',
              why: 'Only the first has data: 38%. The other three make the same claim without proof, and the examiner would mark them as "no data to support the description".' },
            { id: 'm04s1q3', type: 'spot', tag: 'ta-no-data', level: 'B1', chart: 'p-bar-tourists',
              stem: 'Tap the chunk that should be a figure.',
              words: ['Arrivals', 'peaked', 'at a high level', 'in 2019', 'before', 'collapsing', 'in 2020.'], answer: 2,
              fix: 'at 39.9 million',
              hint: 'Read the sentence and ask which part the examiner could not check against the bars.',
              why: '"A high level" is a claim without a number. The chart gives the peak: 39.9 million in 2019. Replace the vague phrase with the figure.' },
            { id: 'm04s1q4', type: 'judge', tag: 'ta-inaccurate', level: 'B1', chart: 'p-line-internet',
              given: 'In 2015, just over half of Thai households had internet access, at 52%.',
              stem: 'Is this sentence true of the graph?', answer: 0,
              hint: 'Find Thailand\'s line at 2015, then decide whether the approximation word points the right way.',
              why: 'True. Thailand\'s 2015 value is 52%, and "just over half" describes it honestly. A claim, an approximation and the exact figure all agree.' },
            { id: 'm04s1q5', type: 'judge', tag: 'ta-inaccurate', level: 'B1', chart: 'p-table-salaries',
              given: 'Korean teachers started on $31,000, slightly less than Japanese teachers.',
              stem: 'Is this sentence true of the table?', answer: 1,
              hint: 'Find the Korea and Japan rows in the starting salary column. Read them carefully.',
              why: 'False. The rows are swapped: Korea starts on $33,000 and Japan on $31,000, so Korean teachers started on slightly more. A wrong figure is "inaccurate material" and costs Task Achievement.' },
            { id: 'm04s1q6', type: 'choose', tag: 'ta-no-data', level: 'B1', chart: 'p-bar-homework',
              stem: 'Which is the best detail sentence about Maths homework?',
              options: ['M5 students did the most Maths homework of the three year groups.', 'M5 students did 5 hours of Maths, compared with 3 hours for M3.', 'M5 students had a great deal more Maths homework than the younger year groups.', 'Maths homework was heavier for the older students.'], answer: 1,
              hint: 'Every option is true. Think about what the examiner needs to see in a detail sentence, besides a claim.',
              why: 'It makes a claim and proves it with two figures that are true of the chart (M5: 5 hours, M3: 3 hours). The others are all true, but none of them has data.' },
            { id: 'm04s1q7', type: 'sort', tag: 'ta-no-data', level: 'B1', chart: 'p-pie-energy',
              stem: 'Sort the sentences: claim with a number, or claim only?',
              bins: [{ key: 'cn', label: 'Claim + number', hint: 'has evidence' }, { key: 'co', label: 'Claim only', hint: 'no figure' }],
              items: [
                { text: 'Coal fell from 48% to 18%.', bin: 'cn' },
                { text: 'Coal became much less important.', bin: 'co' },
                { text: 'Wind and solar rose to 27% in 2020.', bin: 'cn' },
                { text: 'Renewables grew a great deal.', bin: 'co' },
                { text: 'Nuclear stayed at around 15%.', bin: 'cn' },
                { text: 'Hydro hardly changed.', bin: 'co' }
              ],
              hint: 'For each sentence, ask: could the examiner check it against a value written in the sentence?',
              why: 'The three "claim only" sentences are true, but the examiner cannot see the evidence. Each one has a figure waiting on the chart: 18%, 27%, 10% to 11%.' }
          ] },

        /* ------------------------------------------------------------ s2 */
        { id: 'm04s2', name: 'Prepositions with figures', cefr: 'B1',
          theory: {
            key: 'rose TO the end point · rose BY the size of the change · rose FROM X TO Y · peaked AT · stood AT · a rise IN sales OF 5%.',
            body: [
              '<p>This is the highest-frequency grammar error in Task 1, and it changes the facts. <strong>Rose to 30%</strong> means the figure ended at 30%. <strong>Rose by 30 percentage points</strong> means the figure grew by that much. Coal fell <em>to</em> 18%; it fell <em>by</em> 30 percentage points. Gas rose <em>to</em> 30%; it rose <em>by</em> 8 points. Swap the preposition and the sentence is wrong.</p>',
              '<p>The safe full pattern is <strong>from X to Y</strong>: <em>The Science Museum rose from 420,000 to 760,000</em>. It gives both ends and avoids the by-trap completely. For a fixed point use <strong>at</strong>: <em>peaked at 39.9 million, stood at 22%, was highest in Japan, at 54 hours</em>. With the noun form use <strong>in … of</strong>: <em>a rise in gas of 8 percentage points</em>; <em>a fall in coal of 30 points</em>.</p>',
              '<p>Two more: <strong>accounted for</strong> a percentage (<em>coal accounted for 48%</em>), and <strong>in</strong> a year (<em>in 2020</em>). Numbers after <em>at, to, from</em> take no "the": <em>peaked at 760,000</em>, not <em>at the 760,000</em>.</p>',
              '<p>Percent versus percentage points: a change from 22% to 30% is a rise of 8 percentage points, not "8%". The simplest protection is to write <em>from 22% to 30%</em> and avoid the trap entirely.</p>'
            ],
            simple: [
              '<p>to = the end number. by = how much it changed. "Fell to 18%" and "fell by 30 points" are different facts.</p>',
              '<p>Safest: from X to Y. "Rose from 420,000 to 760,000." Both ends, no mistake.</p>',
              '<p>at = one fixed number: peaked at, stood at, at 54 hours. accounted for = a share: accounted for 27%.</p>'
            ],
            examples: [
              { s: 'Coal fell <strong>to</strong> 18% in 2020. · Coal fell <strong>by</strong> 30 percentage points.', g: 'Same chart, two true sentences, two different prepositions.' },
              { s: '<s>Coal fell by 18%.</s>', g: 'Wrong: 18% is the end point, so it must be "to".' },
              { s: 'Arrivals peaked <strong>at</strong> 39.9 million in 2019 before falling <strong>to</strong> 6.7 million in 2020.', g: 'at for the fixed point, to for the end of a change.' },
              { s: 'There was a rise <strong>in</strong> the share of gas <strong>of</strong> 8 percentage points.', g: 'The noun pattern: a rise in [thing] of [size].' }
            ]
          },
          items: [
            { id: 'm04s2q1', type: 'choose', tag: 'gra-prep-figure', level: 'B1', chart: 'p-line-museums',
              stem: 'Complete: "Science Museum visitors rose ___ 420,000 in 2010 ___ 760,000 in 2020."',
              options: ['from / to', 'by / to', 'from / by', 'at / up to'], answer: 0,
              hint: 'The sentence gives two values with two years. For each value, ask: is it a start, an end, or the size of a change?',
              why: '"From X to Y" names both ends of the change. "By" would need the size of the change (340,000), and "at" is for a single fixed point.' },
            { id: 'm04s2q2', type: 'choose', tag: 'gra-prep-figure', level: 'B1', chart: 'p-pie-energy',
              stem: 'Complete: "The share of coal fell ___ 30 percentage points between 2000 and 2020."',
              options: ['to', 'by', 'at', 'from'], answer: 1,
              hint: 'Is 30 percentage points where coal ended, or the size of the fall? Check the two pies.',
              why: 'Coal went from 48% to 18%, a change of 30 points, so the sentence gives the size of the change and needs "by". "Fell to 30" would be a false end point.' },
            { id: 'm04s2q3', type: 'spot', tag: 'gra-prep-figure', level: 'B2', chart: 'p-bar-tourists',
              stem: 'Tap the chunk with the wrong preposition.',
              words: ['Arrivals', 'peaked', 'in 39.9 million', 'in 2019', 'before falling', 'to 6.7 million', 'in 2020.'], answer: 2,
              fix: 'at 39.9 million',
              hint: 'Check the small word before each number in the sentence. Does each one fit what that number is?',
              why: 'A peak is a fixed point, so "peaked at". "In" is for the year. "Fell to 6.7 million" is correct: "to" marks the end point of the fall.' },
            { id: 'm04s2q4', type: 'choose', tag: 'gra-prep-figure', level: 'B2', chart: 'p-line-internet',
              stem: 'Complete: "The figure for Kenya rose ___ 52% in 2025."',
              options: ['by', 'at', 'to', 'in'], answer: 2,
              hint: 'Look at Kenya in 2025. Is 52% the size of the rise, or where the line ends?',
              why: '52% is where Kenya ended, so "rose to". "Rose by 52%" would claim a change of 52 points; the real change was 50 points, from 2% to 52%.' },
            { id: 'm04s2q5', type: 'judge', tag: 'gra-prep-figure', level: 'B2', chart: 'p-table-rice',
              given: 'India\'s rice production rose by 178 million tonnes between 2000 and 2020.',
              stem: 'Is this sentence correct?', answer: 1,
              hint: 'Find India\'s row and work out the size of the rise. Does the sentence state it correctly?',
              why: 'False. 178 million tonnes is the 2020 figure, the end point, so it needs "to". The rise itself was 51 million tonnes, from 127 to 178. One preposition, two different facts.' },
            { id: 'm04s2q6', type: 'spot', tag: 'gra-prep-figure', level: 'B2', chart: 'p-line-cities',
              stem: 'Tap the chunk with the wrong preposition.',
              words: ['Osaka\'s population', 'stood in', '18.3 million', 'in 1990', 'and is expected', 'to fall to', '17.8 million by 2040.'], answer: 1,
              fix: 'stood at',
              hint: 'Check the small word before each number and each year. Is each one the right partner for its verb?',
              why: '"Stood at" is the fixed-point pattern, like "peaked at". "To fall to 17.8 million" is right, and "by 2040" is correct for a projection deadline.' },
            { id: 'm04s2q7', type: 'choose', tag: 'gra-prep-figure', level: 'B2', chart: 'p-pie-energy',
              stem: 'Complete: "In 2020, wind and solar accounted ___ 27% of electricity."',
              options: ['to', 'with', 'of', 'for'], answer: 3,
              hint: 'This verb always takes the same small word when it means "made up a share". Think of the fixed pair.',
              why: '"Accounted for" is a fixed pair: it means "made up this share". It is the proportion verb for pie charts, and 27% is the 2020 figure for wind and solar.' }
          ] },

        /* ------------------------------------------------------------ s3 */
        { id: 'm04s3', name: 'Approximation and units', cefr: 'B2',
          theory: {
            key: 'When the exact value cannot be read, say around, just over, just under, roughly. Count with number, measure with amount.',
            body: [
              '<p>Many values sit between the gridlines. Guessing a precise figure risks <em>"inaccurate material"</em>; refusing to give one risks <em>"no data"</em>. The way out is <strong>approximation</strong>: <em>approximately, around, about, roughly, nearly, almost, just over, just under, close to</em>. <em>Coal accounted for almost half of electricity in 2000</em> (48%) is accurate, safe and shows lexical range.</p>',
              '<p>Approximation words carry meaning, so match them to the number. 48% is <em>almost half</em> or <em>just under half</em>, not <em>just over half</em>. 38% is <em>just over a third</em>. 16 cups against 5 cups is <em>just over three times as many</em>. <em>Nearly</em> and <em>just under</em> mean below; <em>just over</em> means above; <em>around</em> and <em>roughly</em> mean either side.</p>',
              '<p><strong>Number or amount.</strong> Things you can count take <em>the number of</em>: visitors, tourists, hours, cups, households. Things you cannot take <em>the amount of</em>: electricity, money, rice, time, energy. Either can take <em>the proportion of</em> or <em>the percentage of</em>. "The amount of visitors" is one of the seven high-frequency errors, and it is a Lexical Resource fault.</p>',
              '<p>Units travel with the figure. <em>760,000 visitors</em>, <em>39.9 million</em>, <em>54 hours a week</em>, <em>$9,000</em>, <em>178 million tonnes</em>. A bare number with no unit is only half a fact.</p>'
            ],
            simple: [
              '<p>If you cannot read the exact number, say "around", "just over", "just under" or "roughly". This is safe and sounds good.</p>',
              '<p>Match the word to the number: 48% = almost half. 38% = just over a third. Do not say "just over half" for 48%.</p>',
              '<p>Count things = the number of (visitors, hours). Cannot count = the amount of (money, electricity). Always add the unit.</p>'
            ],
            examples: [
              { s: 'Coal made up <strong>almost half</strong> of electricity in 2000, at 48%.', g: 'Approximation plus the figure: both accurate.' },
              { s: '<s>just over half</s> → just under half (48%)', g: 'The approximation word must point the right way.' },
              { s: '<s>the amount of hours</s> → the number of hours · <s>the number of electricity</s> → the amount of electricity', g: 'Hours are counted; electricity is measured.' },
              { s: 'Thai teachers started on <strong>$9,000</strong>, <strong>roughly a seventh</strong> of the German figure.', g: '9,000 against 62,000: a rough fraction is honest and adds range.' }
            ]
          },
          items: [
            { id: 'm04s3q1', type: 'choose', tag: 'lr-approx', level: 'B2', chart: 'p-pie-budget',
              stem: 'Complete: "Food and drinks made up ___ of the student\'s spending." (38%)',
              options: ['exactly a third', 'just over a third', 'nearly half', 'just under a third'], answer: 1,
              hint: 'Work out a third and a half as percentages, then place 38% between them.',
              why: 'A third is 33%, so 38% is just over a third. "Just under" points the wrong way, "nearly half" would need something in the mid-40s, and "exactly" is never true unless the number is exactly right.' },
            { id: 'm04s3q2', type: 'choose', tag: 'lr-approx', level: 'B2', chart: 'p-pie-energy',
              stem: 'Coal was 48% in 2000. Which phrase describes this accurately?',
              options: ['just over half', 'around a third', 'almost half', 'well over half'], answer: 2,
              hint: 'Is 48% above or below 50%? Choose the phrase that points the right way.',
              why: '48% sits just below 50%, so "almost half" or "just under half". "Just over half" points the wrong way, and the examiner reads it as an inaccurate figure.' },
            { id: 'm04s3q3', type: 'spot', tag: 'lr-number-amount', level: 'B2', chart: 'p-table-salaries',
              stem: 'Tap the chunk with the wrong word.',
              words: ['The amount of', 'hours', 'worked per week', 'was highest', 'in Japan,', 'at 54.'], answer: 0,
              fix: 'The number of',
              hint: 'Find the noun the table measures. Can it be counted one by one, and does the phrase before it fit?',
              why: 'Hours are counted (one hour, two hours), so "the number of hours". "The amount of time" would be correct, because time is uncountable, but the table counts hours.' },
            { id: 'm04s3q4', type: 'judge', tag: 'ta-inaccurate', level: 'B2', chart: 'p-line-cities',
              given: 'Bangkok\'s population is projected to reach roughly 12.5 million by 2040.',
              stem: 'Is this sentence accurate?', answer: 0,
              hint: 'Find Bangkok\'s 2040 value and check two things: the approximation and the verb for a future year.',
              why: 'True. The projection is 12.6 million, and "roughly 12.5 million" is an honest reading of a value near the gridline. Approximation protects accuracy.' },
            { id: 'm04s3q5', type: 'claimnum', tag: 'lr-approx', level: 'B2', chart: 'p-line-museums',
              stem: 'Write one sentence about the Science Museum with a figure and an approximation word (around, just over, nearly).',
              labels: ['science', 'museum'], verbs: ['rose', 'increased', 'grew', 'climbed', 'reached', 'peaked', 'overtook', 'higher', 'more', 'doubled', 'stood', 'ended', 'started', 'began'],
              hint: 'Pick one point on the Science Museum line, read it carefully, and choose an approximation word that points the right way.',
              why: 'Claim + number: "The Science Museum rose from around 420,000 visitors in 2010 to just over 750,000 in 2020." The verb makes the claim, the figure proves it, and "around" protects you between gridlines.' },
            { id: 'm04s3q6', type: 'claimnum', tag: 'ta-no-data', level: 'B2', chart: 'p-bar-screentime',
              stem: 'Write one sentence comparing two age groups on one activity, with at least one figure.',
              labels: ['social media', 'streaming', 'gaming', 'teenager', 'young', 'older', 'over', 'age'], verbs: ['spent', 'higher', 'lower', 'more', 'less', 'fewer', 'most', 'least', 'twice', 'times', 'compared', 'than', 'fell', 'dropped', 'similar', 'while', 'whereas'],
              hint: 'Choose one activity, compare its two most different age groups, and add the hours for at least one of them.',
              why: 'For example: "Teenagers spent 21 hours a week on social media, more than three times the figure for the over-50s, at 6." One activity, two groups, one comparison word, and the figures that prove it.' },
            { id: 'm04s3q7', type: 'choose', tag: 'lr-number-amount', level: 'B2',
              stem: 'Which phrase is correct?',
              options: ['the number of money', 'the amount of visitors', 'the number of time', 'the amount of energy'], answer: 3,
              hint: 'Ask which noun in each phrase can be counted one by one, then match number or amount to it.',
              why: 'Energy cannot be counted, so "the amount of energy". Money and time are also uncountable (amount), while visitors are counted (number).' }
          ] }
      ],

      /* ------------------------------------------------------------ check */
      check: { id: 'm04ck', name: 'Systems Check', items: [
        { id: 'm04ckq1', type: 'judge', tag: 'ta-no-data', level: 'A2', chart: 'p-bar-homework',
          given: 'Thai homework was light in all three year groups.',
          stem: 'Is this a complete detail sentence?', answer: 1,
          hint: 'Test the sentence with the claim + number habit, and test the claim against the Thai bars.',
              why: 'False. The claim is true, but there is no figure. "Thai homework was light in all three year groups, at just 1 to 2 hours a week" gives the evidence.' },
        { id: 'm04ckq2', type: 'choose', tag: 'gra-prep-figure', level: 'B1', chart: 'p-bar-tourists',
          stem: 'Complete: "Arrivals fell ___ 39.9 million in 2019 ___ just 0.4 million in 2021."',
          options: ['from / to', 'by / to', 'from / at', 'to / from'], answer: 0,
          hint: 'Look at the two values and their years. For each one, ask: is it a start, an end, or the size of a change?',
              why: '"From X to Y" gives both ends of the fall. "By" would need the size of the change, and "at" marks a single fixed point, not the end of a movement.' },
        { id: 'm04ckq3', type: 'choose', tag: 'lr-number-amount', level: 'B1', chart: 'p-pie-energy',
          stem: 'Complete: "The ___ of electricity generated from coal fell sharply."',
          options: ['number', 'count', 'amount', 'total'], answer: 2,
          hint: 'Decide whether electricity is countable, then recall which noun in this module goes with that kind of word.',
              why: 'Electricity is uncountable, so "the amount of electricity". "Number" is for things you can count one by one, such as visitors or hours.' },
        { id: 'm04ckq4', type: 'judge', tag: 'ta-inaccurate', level: 'B2', chart: 'p-line-internet',
          given: 'By 2025, Thailand had overtaken Japan in household internet access.',
          stem: 'Is this sentence true of the graph?', answer: 1,
          hint: 'Read the 2025 values for Thailand and Japan. Which line ends higher?',
              why: 'False. In 2025 Thailand stood at 88% and Japan at 95%. Thailand closed the gap dramatically, but it did not overtake. Read the end values before you write "overtook".' },
        { id: 'm04ckq5', type: 'choose', tag: 'lr-approx', level: 'B2', chart: 'p-mixed-coffee',
          stem: 'Complete: "Finland drank ___ four times as many cups as Thailand." (21 and 5 cups)',
          options: ['nearly', 'exactly', 'well under', 'just over'], answer: 3,
          hint: 'Divide 21 by 5. Is the answer above or below four, and by how much?',
              why: '21 divided by 5 is 4.2, so Finland drank just over four times as much. "Nearly" and "well under" point below four, and "exactly" is false.' },
        { id: 'm04ckq6', type: 'spot', tag: 'gra-prep-figure', level: 'B2', chart: 'p-pie-energy',
          stem: 'Tap the chunk with the wrong preposition.',
          words: ['The share of', 'natural gas', 'rose', 'by 30%', 'in 2020,', 'making it', 'the largest source.'], answer: 3,
          fix: 'to 30%',
          hint: 'Compare the gas slice in 2000 and 2020. Is 30% the size of the rise, or the end value?',
              why: 'Gas ended at 30%, so "rose to 30%". The change itself was 8 percentage points, from 22% to 30%. "By 30%" states a change that never happened.' },
        { id: 'm04ckq7', type: 'choose', tag: 'ta-no-data', level: 'B2', chart: 'p-table-salaries',
          stem: 'Which sentence is a claim supported by a number?',
          options: ['Thai teachers were paid very little compared with the other countries.', 'German teachers earned the most at both career stages.', 'Salaries rose a great deal after 15 years in every country.', 'Thai teachers started on just $9,000, far below the rest.'], answer: 3,
          hint: 'Every claim is true. Recall the Band 5 and Band 6 descriptor words about data, then test each option.',
              why: 'The claim ("far below the rest") is proved by the figure ($9,000). The other three are true, but without a figure they are what Band 5 calls "no data to support the description".' },
        { id: 'm04ckq8', type: 'claimnum', tag: 'lr-approx', level: 'B2', chart: 'p-pie-energy',
          stem: 'Write one sentence about one energy source, with a figure and the correct preposition.',
          labels: ['coal', 'gas', 'nuclear', 'hydro', 'wind', 'solar', 'renewable'], verbs: ['fell', 'dropped', 'declined', 'decreased', 'rose', 'increased', 'grew', 'accounted', 'made up', 'halved', 'doubled', 'overtook', 'higher', 'lower', 'largest', 'smallest', 'remained', 'stayed', 'stood'],
          hint: 'Choose one source, read its two values carefully, and decide whether you are giving an end point, a size of change, or both.',
              why: 'For example: "Coal fell from almost half of electricity in 2000 to 18% in 2020." Claim (fell), figures (48% and 18%), preposition (from … to), approximation (almost half). Four skills in one sentence.' }
      ] }
    }]
  });
})();
