/* CHART CONTROL — topic-02.js · Module 02 Flight Plan */
(function () {
  var T = window.CONTENT.TOPICS;
  T.push({
    id: 'm02', n: 2, code: 'Module 02', name: 'Flight Plan', art: 'layers', cefr: 'A2–B2',
    blurb: 'Four paragraphs, one job each. The skeleton that works for every chart.',
    levels: [{
      id: 'm02l1', n: 1, name: 'Flight Plan', cefr: 'A2–B2', blurb: 'The four-paragraph skeleton, the introduction pattern, and how to paraphrase the task sentence.',
      subs: [
        /* ------------------------------------------------------------ s1 */
        { id: 'm02s1', name: 'Four paragraphs', cefr: 'A2',
          theory: {
            key: 'Introduction, overview, detail A, detail B. Four paragraphs, about 30 / 45 / 60 / 60 words, and no conclusion.',
            body: [
              '<p>Every Task 1 report, whatever the chart, uses the same skeleton. <strong>Paragraph 1</strong> is the introduction: one or two sentences that say what the visual shows, where and when. <strong>Paragraph 2</strong> is the overview: it begins <em>Overall,</em> and gives the two or three biggest general truths, with no figures. <strong>Paragraphs 3 and 4</strong> are the detail paragraphs: one group of features each, and every sentence carries a figure, a date or a label.</p>',
              '<p>The word budget is roughly <strong>30 / 45 / 60 / 60</strong>. That adds up to about 195 words at the most; in practice, aim for <strong>160–190</strong>, comfortably above the 150 minimum and short enough to leave three minutes for checking. The introduction is the smallest paragraph; the detail paragraphs are the largest, because that is where the evidence lives.</p>',
              '<p>The order matters. The overview goes <u>second</u>, straight after the introduction, so that it is already on the page if time runs out. A report with no overview cannot score above Band 5 for Task Achievement, so the cheapest paragraph in the report is also the most valuable.</p>',
              '<p>There is <strong>no fifth paragraph</strong>. Task 1 has no conclusion: the overview already summarises, and a conclusion repeats it, which costs Coherence and Cohesion. The report simply ends with the last detail sentence.</p>'
            ],
            simple: [
              '<p>Four paragraphs, always: 1 introduction, 2 overview, 3 details, 4 more details.</p>',
              '<p>Word plan: about 30, 45, 60 and 60 words. Paragraph 2 starts with <em>Overall,</em> and has no numbers. Paragraphs 3 and 4 are full of numbers.</p>',
              '<p>Do not write a conclusion. Stop after paragraph 4.</p>'
            ],
            examples: [
              { s: 'P1 · The line graph illustrates how many people visited three museums in a European city from 2010 to 2020.', g: 'Introduction: what, where, when. About 20 words.' },
              { s: 'P2 · Overall, the Science Museum grew strongly over the decade, whereas the other two museums lost visitors.', g: 'Overview: Overall + two general truths, no figures.' },
              { s: 'P3 · The Science Museum rose from 420,000 visitors in 2010 to 760,000 in 2020, overtaking the Art Gallery around 2014.', g: 'Detail: a claim with figures. Paragraph 4 does the same for the second group.' },
              { s: '<s>P5 · In conclusion, the museums changed a lot.</s>', g: 'No conclusion. The report ends after paragraph 4.' }
            ]
          },
          items: [
            { id: 'm02s1q1', type: 'choose', tag: 'cc-paragraphing', level: 'A2',
              stem: 'Which paragraph comes second in a Task 1 report?',
              options: ['The overview', 'The introduction', 'The first detail paragraph', 'A short conclusion'], answer: 0,
              hint: 'Remember the flight plan. Which paragraph must be on the page early in case time runs out?',
              why: 'Introduction first, then the overview. Putting the overview second means it is on the page even if you run out of time, and it is the paragraph that unlocks Task Achievement Band 6 and above.' },
            { id: 'm02s1q2', type: 'order', tag: 'cc-paragraphing', level: 'B1',
              stem: 'Put the four paragraphs of a Task 1 report in order.',
              items: ['Introduction: paraphrase the task sentence (what, where, when)', 'Overview: Overall + two or three general truths, no figures', 'Detail A: the first group of features, every sentence with a figure', 'Detail B: the second group of features, every sentence with a figure'],
              hint: 'Think about each paragraph\'s job, and ask which one a reader needs before the others make sense.',
              why: 'The skeleton is fixed: intro, overview, detail, detail. One group of features per detail paragraph is what the descriptors call "logically organised".' },
            { id: 'm02s1q3', type: 'choose', tag: 'cc-paragraphing', level: 'A2',
              stem: 'About how many words should the overview paragraph have?',
              options: ['15', '30', '45', '90'], answer: 2,
              hint: 'Recall the word budget for the four paragraphs. The whole report is about 195 words.',
              why: 'The budget is 30 / 45 / 60 / 60. Forty-five words is enough for "Overall," plus two or three general sentences. Ninety words would mean figures have crept in.' },
            { id: 'm02s1q4', type: 'judge', tag: 'cc-paragraphing', level: 'A2',
              given: 'A Task 1 report is complete after four paragraphs; it does not need a fifth one to finish properly.',
              stem: 'True or false?', answer: 0,
              hint: 'Think about how many paragraphs the flight plan has, and which paragraph already does the summarising.',
              why: 'True. The overview already summarises the chart. A conclusion would only repeat it, which costs Coherence and Cohesion, and it often adds an opinion, which costs Task Achievement.' },
            { id: 'm02s1q5', type: 'sort', tag: 'cc-paragraphing', level: 'B1', chart: 'p-line-museums',
              stem: 'Sort each sentence into the paragraph where it belongs.',
              bins: [{ key: 'intro', label: 'Introduction', hint: 'what, where, when' }, { key: 'over', label: 'Overview', hint: 'general truths, no figures' }, { key: 'detail', label: 'Detail', hint: 'claim + figure' }],
              items: [
                { text: 'The line graph illustrates how many people visited three museums in a European city from 2010 to 2020.', bin: 'intro' },
                { text: 'Overall, the Science Museum grew strongly while the other two museums declined.', bin: 'over' },
                { text: 'The Science Museum rose from 420,000 visitors to 760,000.', bin: 'detail' },
                { text: 'The figures are given in thousands of visitors.', bin: 'intro' },
                { text: 'The History Museum had the fewest visitors throughout the period.', bin: 'over' },
                { text: 'Art Gallery numbers fell from 610,000 in 2010 to 520,000 in 2020.', bin: 'detail' }
              ],
              hint: 'Ask of each sentence: does it describe the chart, give a big general truth, or give a figure?',
              why: 'The introduction says what is measured and in what units. The overview gives general truths without numbers. Every detail sentence carries a figure. Each sentence has one home.' },
            { id: 'm02s1q6', type: 'choose', tag: 'cc-paragraphing', level: 'B1',
              stem: 'A report has a 30-word intro, a 40-word overview and one 110-word block of details. What is wrong?',
              options: ['The introduction is far too long for the budget', 'The detail block should be two paragraphs', 'The overview needs more words than the introduction', 'The report needs a conclusion of about 30 words'], answer: 1,
              hint: 'Compare this report with the flight plan: check the number of paragraphs and the word budget of each one.',
              why: 'One long block of details is the Band 5 signature for Coherence. Split it into two paragraphs, one group of features each, and the word budget of 60 / 60 falls into place.' },
            { id: 'm02s1q7', type: 'choose', tag: 'lr-number-amount', level: 'B1', chart: 'p-line-museums',
              stem: 'Complete the introduction: "The line graph shows the ___ of visitors to three museums."',
              options: ['amount', 'level', 'size', 'number'], answer: 3,
              hint: 'Think about countable and uncountable nouns. Which kind are visitors, and which word goes with that kind?',
              why: 'Visitors can be counted, so it is "the number of visitors". "The amount of" is for things you cannot count, such as money, energy or time.' }
          ] },

        /* ------------------------------------------------------------ s2 */
        { id: 'm02s2', name: 'P1: the introduction', cefr: 'B1',
          theory: {
            key: 'The [visual] shows [what] in [where] between [Y1] and [Y2]. Fill every slot from the chart, and mention the units.',
            body: [
              '<p>The introduction is one sentence built from a fixed pattern (P1): <strong>The [visual] shows / illustrates / compares [what is measured] in [where] between [year] and [year].</strong> Every slot in brackets comes from the chart itself: the title, the axis labels and the legend. If the chart has no dates, drop the time slot and use the present tense.</p>',
              '<p>Get the <em>visual</em> word right: line graph, bar chart, pie chart(s), table, diagram, maps. Get the <em>what</em> right: <em>the number of</em> for things you can count (visitors, cars, tourists), <em>the amount of</em> for things you cannot (electricity, money, rice), <em>the percentage / proportion of</em> when the axis shows %.</p>',
              '<p>The <strong>units</strong> belong in the introduction too, either inside the sentence (<em>the number of visitors, in thousands</em>) or as a short second sentence (<em>The figures are given in millions.</em>). A reader who does not know the units cannot understand a single figure in paragraphs 3 and 4.</p>',
              '<p>Articles are part of the pattern: <strong>the</strong> line graph, <strong>the</strong> number of, <strong>the</strong> percentage of. Country names take no article (Thailand, Japan), except the fixed ones (the UK, the USA). Uncountable nouns used generally take no article: <em>electricity</em>, not <em>the electricity</em>.</p>'
            ],
            simple: [
              '<p>Introduction = one sentence: The [chart] shows [what] in [where] between [year] and [year].</p>',
              '<p>Use <em>the number of</em> for things you can count, <em>the amount of</em> for things you cannot, and <em>the percentage of</em> when the chart shows %.</p>',
              '<p>Say the units (thousands, millions, %, hours per week). Use "the" before "line graph" and "number of".</p>'
            ],
            examples: [
              { s: 'The line graph shows the percentage of households with internet access in four countries between 2005 and 2025.', g: 'P1 with every slot filled: visual, what, where, when.' },
              { s: 'The table compares rice production in four Asian countries in 2000, 2010 and 2020. The figures are in million tonnes.', g: 'A second short sentence carries the units.' },
              { s: '<s>Line graph shows number of visitors…</s> → The line graph shows the number of visitors…', g: 'Two missing articles. "The" is part of the pattern.' },
              { s: 'The bar chart shows <s>that teenagers spent the most time on social media</s>.', g: 'No findings in the introduction. Say what is measured, not what you found.' }
            ]
          },
          items: [
            { id: 'm02s2q1', type: 'build', tag: 'lr-copied-rubric', level: 'B1', chart: 'p-line-internet',
              stem: 'Build the introduction for this line graph.',
              tiles: ['The line graph', 'illustrates', 'the proportion of homes', 'with an internet connection', 'in four countries', 'over a twenty-year period', 'from 2005 to 2025.'],
              solution: 'The line graph illustrates the proportion of homes with an internet connection in four countries over a twenty-year period from 2005 to 2025.',
              alt: [],
              hint: 'Use the P1 slot pattern from the lesson and fill each slot from the graph title. The time phrase has two tiles.',
              why: 'Visual, what, where, when. Notice the swaps: shows → illustrates, percentage → proportion, households → homes, between … and → over a twenty-year period.' },
            { id: 'm02s2q2', type: 'spot', tag: 'gra-article', level: 'B1', chart: 'p-table-rice',
              stem: 'Tap the chunk with the missing article.',
              words: ['Table', 'shows', 'how much rice', 'was produced', 'in four countries', 'in three years', 'between 2000 and 2020.'], answer: 0,
              fix: 'The table',
              hint: 'Check every noun that names the visual on the page. Does each one have the article it needs?',
              why: 'The visual is a specific one, the one on the page, so it takes "the": the table, the line graph, the pie charts. This is a fixed part of the introduction pattern.' },
            { id: 'm02s2q3', type: 'choose', tag: 'lr-copied-rubric', level: 'B2', chart: 'p-bar-screentime',
              stem: 'Which introduction is best for this bar chart?',
              options: ['The bar chart shows screen time.', 'The chart compares weekly hours on three screen activities across four age groups in 2023.', 'The bar chart shows the average number of hours per week spent on three activities.', 'The bar chart shows that teenagers spent far more time on social media and gaming than older people.'], answer: 1,
              hint: 'Check each option: every slot filled, no copied words, no finding, and the age groups included.',
              why: 'It fills every slot and paraphrases. The first is too short to be an introduction, the third copies the task sentence word for word and drops the age groups, and the fourth puts a finding into paragraph 1.' },
            { id: 'm02s2q4', type: 'judge', tag: 'cc-paragraphing', level: 'B1',
              given: 'The introduction should also state your main finding, for example "…and shows that coal fell sharply".',
              stem: 'Is this good advice?', answer: 1,
              hint: 'Think about the job of paragraph 1 and the job of paragraph 2. Where do findings go?',
              why: 'False. The introduction says what is measured, where and when. Findings belong in the overview, paragraph 2, which begins "Overall,". Mixing the two makes both paragraphs weaker.' },
            { id: 'm02s2q5', type: 'choose', tag: 'lr-number-amount', level: 'B1', chart: 'p-bar-tourists',
              stem: 'Complete: "The bar chart shows the ___ of international tourists arriving in Thailand between 2015 and 2025."',
              options: ['amount', 'quantity', 'number', 'total'], answer: 2,
              hint: 'Think about whether tourists are countable, and which noun normally goes with countable people in "the ___ of".',
              why: 'Tourists are countable, so "the number of tourists". "Amount" goes with uncountable nouns (money, energy), and "quantity" and "total" do not collocate with people in this pattern.' },
            { id: 'm02s2q6', type: 'spot', tag: 'gra-article', level: 'B2', chart: 'p-pie-energy',
              stem: 'Tap the chunk with the article error.',
              words: ['The pie charts', 'illustrate', 'how', 'the electricity', 'was generated', 'in one country', 'in 2000 and 2020.'], answer: 3,
              fix: 'electricity',
              hint: 'Check each "the" in the sentence. Is each one pointing at something specific, or at a thing in general?',
              why: 'Electricity here means electricity in general, an uncountable noun with no article. "The" is for a specific thing already known: the pie charts, the country in the title.' },
            { id: 'm02s2q7', type: 'choose', tag: 'lr-copied-rubric', level: 'B2', chart: 'p-line-internet',
              stem: 'Which time phrase correctly replaces "between 2005 and 2025"?',
              options: ['over a twenty-years period', 'over twenty years period', 'during twenty-year period', 'over a twenty-year period'], answer: 3,
              hint: 'Think of "a five-star hotel". When a number and a noun describe another noun, what happens to the article, hyphen and plural?',
              why: '"A twenty-year period": the article "a", a hyphen, and a singular "year" because it works as an adjective. This swap is one of the safest ways to avoid copying the task sentence.' }
          ] },

        /* ------------------------------------------------------------ s3 */
        { id: 'm02s3', name: 'Paraphrase, don\'t copy', cefr: 'B2',
          theory: {
            key: 'Copied rubric is discounted. Change the verb, change the noun phrase, change the time phrase.',
            body: [
              '<p>The descriptors say that <em>"any copied rubric must be discounted"</em>. Words copied from the task sentence are removed from your word count and do not count as evidence of your English. A 20-word copied introduction leaves a 150-word report at 130 words. So the introduction must be a <strong>paraphrase</strong>: the same facts in different words.</p>',
              '<p>Three swaps are enough. <strong>The verb:</strong> shows → illustrates / compares / gives information about / presents. <strong>The noun phrase:</strong> the number of visitors → how many people visited; the percentage of households → the proportion of homes; the sources of electricity → how electricity was generated. <strong>The time phrase:</strong> between 2010 and 2020 → over a ten-year period from 2010 to 2020 / from 2010 to 2020.</p>',
              '<p>A paraphrase must keep the meaning. <em>In a European city</em> cannot become <em>in Europe</em>; <em>the number of</em> cannot become <em>the amount of</em>; <em>shows</em> cannot become <em>proves</em>. And some words have no synonym: 2010 stays 2010, Thailand stays Thailand, and <em>coal</em> stays <em>coal</em>. Keep those and change the rest.</p>',
              '<p>Reporting verbs are neutral and academic: <em>shows, illustrates, compares, presents, gives information about</em>. Not <em>talks about</em>, <em>tells us</em> or <em>proves</em>.</p>'
            ],
            simple: [
              '<p>If you copy the task sentence, the examiner does not count those words. Write it again in your own words.</p>',
              '<p>Three easy changes: shows → illustrates; the number of visitors → how many people visited; between 2010 and 2020 → from 2010 to 2020.</p>',
              '<p>Keep the meaning the same. Years, country names and category names do not change.</p>'
            ],
            examples: [
              { s: 'shows → illustrates · the number of visitors → how many people visited · between 2010 and 2020 → over a ten-year period', g: 'The three swaps that rewrite almost any task sentence.' },
              { s: 'The pie charts illustrate how electricity was generated in one country in 2000 and 2020.', g: 'Rubric: "the sources of electricity generated". Same meaning, new shape.' },
              { s: 'The line graph <s>talks about</s> shows the number of visitors…', g: '"Talks about" is spoken register. Use shows, illustrates, compares.' },
              { s: '<s>in Europe</s> → in a European city', g: 'A paraphrase that changes the facts is an error, not a paraphrase.' }
            ]
          },
          items: [
            { id: 'm02s3q1', type: 'sort', tag: 'lr-copied-rubric', level: 'B1',
              stem: 'Sort the swaps: a good paraphrase, or a change of meaning?',
              bins: [{ key: 'good', label: 'Good swap', hint: 'same meaning, new words' }, { key: 'bad', label: 'Changes the meaning', hint: 'or wrong word' }],
              items: [
                { text: 'shows → illustrates', bin: 'good' },
                { text: 'the number of visitors → how many people visited', bin: 'good' },
                { text: 'shows → proves', bin: 'bad' },
                { text: 'between 2010 and 2020 → over a ten-year period', bin: 'good' },
                { text: 'the number of visitors → the amount of visitors', bin: 'bad' },
                { text: 'in a European city → in Europe', bin: 'bad' }
              ],
              hint: 'For each swap, ask: would the facts change? Check countable nouns and places carefully.',
              why: 'A paraphrase keeps the facts and changes the words. "Proves" adds a claim the chart does not make, "amount" is wrong for countable visitors, and "Europe" is not the same place as one European city.' },
            { id: 'm02s3q2', type: 'build', tag: 'lr-copied-rubric', level: 'B2', chart: 'p-line-museums',
              stem: 'Build a paraphrased introduction for this line graph.',
              tiles: ['The line graph', 'illustrates', 'how many people', 'visited', 'three museums', 'in a European city', 'over a ten-year period', 'from 2010 to 2020.'],
              solution: 'The line graph illustrates how many people visited three museums in a European city over a ten-year period from 2010 to 2020.',
              alt: [],
              hint: 'Swap the verb, the noun phrase and the time phrase, but keep the city and the years exactly.',
              why: 'All three swaps at once: illustrates for shows, "how many people visited" for "the number of visitors", and "over a ten-year period" for "between … and". The facts are unchanged.' },
            { id: 'm02s3q3', type: 'choose', tag: 'lr-copied-rubric', level: 'B2',
              stem: 'Which reporting verb does NOT belong in a Task 1 introduction?',
              options: ['talks about', 'illustrates', 'compares', 'gives information about'], answer: 0,
              hint: 'Imagine saying each verb about a chart in an exam. Which one is spoken English, not academic English?',
              why: '"Talks about" is spoken, informal register and a chart cannot talk. Illustrates, compares and gives information about are the neutral academic verbs the examiner expects.' },
            { id: 'm02s3q4', type: 'build', tag: 'lr-copied-rubric', level: 'B2', chart: 'p-pie-budget',
              stem: 'Build a paraphrased introduction for this pie chart.',
              tiles: ['The pie chart', 'illustrates', 'how a typical', 'secondary school student', 'in one city', 'divided their', 'weekly spending', 'in 2024.'],
              solution: 'The pie chart illustrates how a typical secondary school student in one city divided their weekly spending in 2024.',
              alt: [],
              hint: 'Keep the student, the city and the year. Look for the tiles that say "spent their weekly money" in new words.',
              why: 'The rubric says "spent their weekly money"; the paraphrase says "divided their weekly spending". A single pie with one year keeps the year but needs no "between … and".' },
            { id: 'm02s3q5', type: 'spot', tag: 'lr-number-amount', level: 'B2', chart: 'p-mixed-coffee',
              stem: 'Tap the chunk with the wrong word.',
              words: ['The bar chart', 'compares', 'the amount of', 'cups of coffee', 'drunk per person', 'each week', 'in five countries.'], answer: 2,
              fix: 'the number of',
              hint: 'Look at what the chart counts. Is that noun countable or uncountable?',
              why: 'Cups are countable, so "the number of cups". "The amount of coffee" would be correct, because coffee itself is uncountable, but the chart counts cups.' },
            { id: 'm02s3q6', type: 'judge', tag: 'lr-copied-rubric', level: 'B2', chart: 'p-table-salaries',
              given: 'The table gives information about the pay and working hours of secondary school teachers in five countries in 2022.',
              stem: 'Is this an acceptable paraphrase of the task sentence?', answer: 0,
              hint: 'Compare the sentence with the task sentence. Are all three columns, the countries and the year still there?',
              why: 'True. "Shows" became "gives information about", "salary" became "pay", and the three columns are covered by "pay and working hours". The facts (five countries, 2022) are unchanged.' },
            { id: 'm02s3q7', type: 'spot', tag: 'gra-article', level: 'B2', chart: 'p-bar-tourists',
              stem: 'Tap the chunk with the article error.',
              words: ['The bar chart', 'illustrates', 'changes in', 'the number of', 'foreign visitors', 'arriving in the Thailand', 'between 2015 and 2025.'], answer: 5,
              fix: 'arriving in Thailand',
              hint: 'Check every article in the sentence. Which names of countries take "the", and which do not?',
              why: 'Most country names take no article: Thailand, Japan, Kenya. The exceptions are the fixed ones such as the UK, the USA and the Netherlands.' }
          ] }
      ],

      /* ------------------------------------------------------------ check */
      check: { id: 'm02ck', name: 'Systems Check', items: [
        { id: 'm02ckq1', type: 'choose', tag: 'cc-paragraphing', level: 'A2',
          stem: 'How many paragraphs does a Task 1 report have?',
          options: ['Three', 'Four', 'Five', 'Six'], answer: 1,
          hint: 'Count the jobs in the flight plan, and remember that Task 1 does not need a conclusion.',
              why: 'Four: introduction, overview, detail A, detail B. Three means the details are one block; five means a conclusion has been added, and Task 1 needs none.' },
        { id: 'm02ckq2', type: 'judge', tag: 'lr-copied-rubric', level: 'B1',
          given: 'Copying the task sentence as your introduction is safe, because the words are guaranteed to be correct.',
          stem: 'True or false?', answer: 1,
          hint: 'Recall what the descriptors say happens to copied rubric, and to your word count.',
              why: 'False. "Any copied rubric must be discounted." The words are removed from your word count and show the examiner nothing about your English. Paraphrase instead.' },
        { id: 'm02ckq3', type: 'build', tag: 'lr-copied-rubric', level: 'B1', chart: 'p-bar-homework',
          stem: 'Build the introduction for this bar chart.',
          tiles: ['The bar chart', 'compares', 'the weekly homework hours', 'in four subjects', 'for three year groups', 'at one school.'],
          solution: 'The bar chart compares the weekly homework hours in four subjects for three year groups at one school.',
          alt: [],
          hint: 'Fill the P1 slots from the chart title. This chart has no years, so there is no time slot.',
              why: '"Compares" is a natural verb for a bar chart with no time axis. Subjects, year groups and the school fill the what and where slots; there is no when, so the sentence stops.' },
        { id: 'm02ckq4', type: 'spot', tag: 'lr-number-amount', level: 'B1', chart: 'p-line-internet',
          stem: 'Tap the chunk with the wrong word.',
          words: ['The line graph', 'shows', 'the amount of', 'households', 'with internet access', 'in four countries', 'from 2005 to 2025.'], answer: 2,
          fix: 'the percentage of',
          hint: 'Look at the unit on the vertical axis. Does the phrase in the sentence match it?',
              why: 'Households are countable, so "amount" is wrong. And because the axis shows %, the precise phrase is "the percentage of households", not even "the number of".' },
        { id: 'm02ckq5', type: 'choose', tag: 'cc-paragraphing', level: 'B2',
          stem: 'Which word budget matches the four paragraphs in order?',
          options: ['60 / 60 / 45 / 30', '45 / 30 / 60 / 60', '30 / 30 / 70 / 70', '30 / 45 / 60 / 60'], answer: 3,
          hint: 'Recall the order of the four paragraphs, which one is the smallest, and which ones carry the most evidence.',
              why: 'Short introduction, medium overview, two full detail paragraphs. The details are largest because that is where the figures and comparisons go.' },
        { id: 'm02ckq6', type: 'choose', tag: 'gra-article', level: 'B2', chart: 'p-line-cities',
          stem: 'Which introduction has the articles right?',
          options: ['The line graph shows the population of three cities.', 'Line graph shows the population of three cities.', 'The line graph shows population of the three cities.', 'The line graph shows a population of three cities.'], answer: 0,
          hint: 'Check the article before each noun: is the visual a specific one, and is the population a specific figure?',
              why: '"The line graph" (the one on the page) and "the population of" (a specific figure). "A population" suggests one of many, and dropping "the" before "line graph" is the classic missing article.' },
        { id: 'm02ckq7', type: 'order', tag: 'cc-paragraphing', level: 'B1', chart: 'p-pie-energy',
          stem: 'Put these four sentences in report order: introduction, overview, detail A, detail B.',
          items: ['The pie charts illustrate how electricity was generated in one country in 2000 and 2020.', 'Overall, coal lost its leading position, while natural gas and renewables grew.', 'Coal fell from 48% to 18%, whereas wind and solar rose from 5% to 27%.', 'Nuclear and hydro, by contrast, barely changed, at around 15% and 10%.'],
          hint: 'Decide each sentence\'s job first. Then ask which group of sources a reader would expect to meet first.',
              why: 'Intro (what, where, when), overview (Overall + general truths, no figures), then the two groups of details: the big movers first, the stable sources second.' },
        { id: 'm02ckq8', type: 'choose', tag: 'lr-copied-rubric', level: 'B2', chart: 'p-line-cities',
          stem: 'Which introduction paraphrases the task sentence best?',
          options: ['The line graph shows the population of three cities between 1990 and 2025.', 'The line graph shows three cities.', 'The graph illustrates three cities\' populations from 1990 to 2025, with forecasts to 2040.', 'The line graph proves that Lagos will have a far bigger population than Osaka by the year 2040.'], answer: 2,
          hint: 'Check each option: does it keep every fact, including the projections, and does it change the words?',
              why: 'It keeps every fact and changes the words: illustrates, from … to, forecasts. The first copies the rubric and forgets the projections, the second drops the facts, and the fourth puts a finding (and "proves") in the introduction.' }
      ] }
    }]
  });
})();
