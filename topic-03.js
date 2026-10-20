/* CHART CONTROL — topic-03.js · Module 03 The Overview */
(function () {
  var T = window.CONTENT.TOPICS;
  T.push({
    id: 'm03', n: 3, code: 'Module 03', name: 'The Overview', art: 'signal', cefr: 'A2–B2',
    blurb: 'The most valuable forty words in the test.',
    levels: [{
      id: 'm03l1', n: 1, name: 'The Overview', cefr: 'A2–B2', blurb: 'What an overview is, what spoils one, and how to write it every time.',
      subs: [
        /* ------------------------------------------------------------ s1 */
        { id: 'm03s1', name: 'What an overview is', cefr: 'A2',
          theory: {
            key: 'Overall, plus the two or three biggest general truths, in paragraph two, with no figures.',
            body: [
              '<p>The overview is a short paragraph, usually two or three sentences, that begins <strong>Overall,</strong> and states the biggest general truths of the chart: what rose, what fell, what was largest, what stayed the same. It is the headline of the report. If the chart were a news story, the overview is the title, not the article.</p>',
              '<p>It goes in <strong>paragraph two</strong>, straight after the introduction. Writers who leave it for the end usually never write it, and a report with no overview cannot score above <strong>Band 5</strong> for Task Achievement. Band 6 says <em>"a relevant overview is attempted"</em>; Band 7 says <em>"a clear overview"</em>. Nothing else in the test is worth so much for so few words.</p>',
              '<p>An overview is <u>general</u>. It uses dates and category names freely (<em>the Science Museum, by 2020, coal</em>) but it does not carry numbers, percentages or amounts. Those belong in paragraphs 3 and 4. And it usually contains a <strong>comparison</strong>: one thing rose <em>whereas</em> another fell; one group was largest <em>while</em> another was smallest.</p>',
              '<p>The test of a good overview: cover the numbers on the chart. Does the paragraph still say something true and useful? If yes, it is an overview. If it needs the numbers to mean anything, it is a detail paragraph in disguise.</p>'
            ],
            simple: [
              '<p>The overview is paragraph 2. It starts with <em>Overall,</em> and gives the two or three biggest ideas of the chart.</p>',
              '<p>No numbers in the overview. Names and years are fine. Numbers go in paragraphs 3 and 4.</p>',
              '<p>Without an overview, Task Achievement stops at Band 5. It is the cheapest band in the test.</p>'
            ],
            examples: [
              { s: 'Overall, bus travel rose steadily over the decade, whereas car and train travel both declined.', g: 'Two general truths and a contrast. No figures.' },
              { s: 'Overall, oil lost its leading position, while gas and solar power became major sources.', g: 'Headline of the two pie charts: what fell, what rose.' },
              { s: '<s>Overall, bus journeys rose from 40 million to 65 million.</s>', g: 'True, but it is a detail sentence. The figures make it paragraph 3, not paragraph 2.' }
            ]
          },
          items: [
            { id: 'm03s1q1', type: 'choose', tag: 'ta-no-overview', level: 'A2',
              stem: 'Which word usually begins the overview paragraph?',
              options: ['Overall,', 'Firstly,', 'In conclusion,', 'However,'], answer: 0,
              hint: 'Think about the job of the overview. Which opening word tells the reader what kind of paragraph is coming?',
              why: '"Overall," tells the examiner that the overview has arrived. "Firstly" starts a list, "However" needs something to contrast with, and "In conclusion" belongs to a paragraph Task 1 does not have.' },
            { id: 'm03s1q2', type: 'choose', tag: 'ta-no-overview', level: 'A2',
              stem: 'Where does the overview go?',
              options: ['At the very start, before the introduction', 'Paragraph two, after the introduction', 'At the end, as the last paragraph', 'Anywhere, as long as it is somewhere in the report'], answer: 1,
              hint: 'Recall the flight plan from Module 02 and the place of each paragraph in it.',
              why: 'Paragraph two. Written early, it is on the page even if time runs out, and the examiner sees the big picture before the details.' },
            { id: 'm03s1q3', type: 'judge', tag: 'ta-no-overview', level: 'B1',
              given: 'Without an overview, the Task Achievement score cannot go above Band 5.',
              stem: 'True or false?', answer: 0,
              hint: 'Recall the Band 6 Task Achievement descriptor and the ladder rule from Module 00, then decide.',
              why: 'True. Band 6 requires that "a relevant overview is attempted". A script must fully fit a band to receive it, so a missing overview pins Task Achievement at Band 5.' },
            { id: 'm03s1q4', type: 'select', tag: 'ta-overview-vague', level: 'B1', chart: 'p-line-museums',
              stem: 'Tick the two general truths that belong in the overview of this graph.',
              options: ['The Science Museum rose throughout the period', 'The Art Gallery had 590,000 visitors in 2012', 'The other two museums both declined', 'The History Museum recovered slightly in 2018', 'There were three museums', 'The Science Museum rose by 50,000 between 2010 and 2012'], answers: [0, 2], k: 2,
              hint: 'Cover the numbers on the graph. Which statements about the museums are still the big story?',
              why: 'The overview names the big movements: one museum up, two down. Single figures and small bumps are details, and "there were three museums" is the introduction, not a finding.' },
            { id: 'm03s1q5', type: 'choose', tag: 'ta-overview-figures', level: 'B1',
              stem: 'What does a good overview contain?',
              options: ['Every figure from the chart', 'Your opinion of the results', 'The reasons behind the changes', 'Two or three general truths'], answer: 3,
              hint: 'Remember the overview is a headline, not the article. What goes into a headline?',
              why: 'General truths, without figures: what rose, what fell, what was largest. Figures go in the details; opinion and reasons go nowhere in Task 1.' },
            { id: 'm03s1q6', type: 'judge', tag: 'ta-no-comparison', level: 'A2', chart: 'p-pie-energy',
              given: 'Overall, the share of coal fell sharply, whereas wind and solar grew strongly.',
              stem: 'Is this a good overview sentence for these pie charts?', answer: 0,
              hint: 'Check three things: does it start correctly, does it compare, and does it avoid figures? Then check it against the pies.',
              why: 'True. Two general truths, joined by "whereas" so that they compare, and no figures. Coal did fall (48% to 18%) and wind and solar did grow (5% to 27%), but the numbers stay in paragraph 3.' },
            { id: 'm03s1q7', type: 'choose', tag: 'ta-no-overview', level: 'B1',
              stem: 'Why write the overview as paragraph two rather than at the end?',
              options: ['Because the examiner reads only the first two paragraphs', 'Because the detail paragraphs must be short', 'So that it is on the page even if time runs out', 'Because it must come before the introduction'], answer: 2,
              hint: 'Check each reason: is it really true of the test and the flight plan?',
              why: 'Writers who leave the overview for the end often run out of time and lose a whole band. Writing it second makes it impossible to forget.' }
          ] },

        /* ------------------------------------------------------------ s2 */
        { id: 'm03s2', name: 'Good, vague, figures, opinion', cefr: 'B1',
          theory: {
            key: 'Three things spoil an overview: it says nothing, it carries figures, or it gives an opinion.',
            body: [
              '<p><strong>Vague.</strong> <em>"Overall, there were some differences between the groups"</em> is true of every chart ever drawn, so it tells the examiner nothing. Band 7 needs <em>"a clear overview"</em> in which <em>"main trends or differences are identified"</em>. Name the content: what rose, what fell, what was largest, what stayed the same. Every overview needs at least two content words such as <em>rose, fell, largest, smallest, doubled, remained stable</em>.</p>',
              '<p><strong>Figures.</strong> <em>"Overall, coal fell from 48% to 18%"</em> is a detail sentence wearing an overview\'s first word. Numbers, percentages and amounts belong in paragraphs 3 and 4. Years and category names are fine, because the overview must still say <em>when</em> and <em>what</em>.</p>',
              '<p><strong>Opinion.</strong> <em>"Overall, shoppers should spend less"</em> or <em>"Overall, this is a positive change"</em> is not in the chart. The overview reports; it does not judge or explain.</p>',
              '<p>A good overview usually contains a <strong>comparison</strong> or a contrast: <em>while, whereas, in contrast, the former … the latter</em>. Two general truths joined by <em>whereas</em> is the classic shape, and it satisfies the rubric\'s demand to "make comparisons where relevant" in the first forty words.</p>'
            ],
            simple: [
              '<p>Bad overview 1: too vague. "There were differences" says nothing. Say what rose, fell, was biggest.</p>',
              '<p>Bad overview 2: has numbers. Move the numbers to paragraphs 3 and 4. Years and names can stay.</p>',
              '<p>Bad overview 3: opinion. Do not say what is good, bad or should happen. Just report.</p>'
            ],
            examples: [
              { s: '<s>Overall, sales varied between the five shops.</s>', g: 'Vague. Every chart has differences. Which ones?' },
              { s: 'Overall, the two city-centre shops sold far more than the suburban ones, while tea sales varied little from shop to shop.', g: 'Clear: two content claims and a contrast.' },
              { s: '<s>Overall, the main shop sold 450 cups of coffee a day.</s>', g: 'A figure. This is a detail sentence for paragraph 3.' },
              { s: '<s>Overall, young people should spend less time online.</s>', g: 'Opinion. Not in the chart, not in the report.' }
            ]
          },
          items: [
            { id: 'm03s2q1', type: 'sort', tag: 'ta-overview-vague', level: 'B1', chart: 'p-bar-screentime',
              stem: 'Sort the candidate overview sentences.',
              bins: [{ key: 'good', label: 'Good overview', hint: 'general, clear, no figures' }, { key: 'vague', label: 'Too vague', hint: 'says nothing' }, { key: 'fig', label: 'Has figures', hint: 'belongs in the details' }],
              items: [
                { text: 'Overall, the youngest group spent the most time on social media and gaming.', bin: 'good' },
                { text: 'Overall, teenagers spent 21 hours a week on social media.', bin: 'fig' },
                { text: 'Overall, there were some differences between the age groups.', bin: 'vague' },
                { text: 'Overall, social media and gaming fell with age, while streaming stayed similar.', bin: 'good' },
                { text: 'Overall, the chart shows a lot of information about screen time.', bin: 'vague' },
                { text: 'Overall, gaming fell from 12 hours to just 1 hour.', bin: 'fig' }
              ],
              hint: 'For each sentence, ask: does it name a real trend, hide behind a vague phrase, or carry a number?',
              why: 'A good overview names a trend or a difference without numbers. "Some differences" and "a lot of information" name nothing; the 21-hour and 12-to-1 sentences are true details that belong in paragraph 3.' },
            { id: 'm03s2q2', type: 'judge', tag: 'ta-overview-figures', level: 'B1', chart: 'p-table-rice',
              given: 'Overall, China produced 212 million tonnes of rice in 2020, more than any other country.',
              stem: 'Does this sentence belong in the overview?', answer: 1,
              hint: 'Recall the three things that spoil an overview, then read the sentence for each one.',
              why: 'False. The figure makes it a detail sentence. The general truth behind it, "China produced by far the most rice in every year", is what the overview should say.' },
            { id: 'm03s2q3', type: 'judge', tag: 'ta-overview-vague', level: 'B2', chart: 'p-line-internet',
              given: 'Overall, internet access changed in all four countries over the period.',
              stem: 'Is this a clear overview sentence?', answer: 1,
              hint: 'Read the four lines, then ask whether this sentence would tell a reader the main story of the graph.',
              why: 'False. "Changed" hides the direction. The chart shows a rise in all four countries, with Sweden and Japan high throughout and Kenya lowest. Say "rose", not "changed".' },
            { id: 'm03s2q4', type: 'choose', tag: 'ta-overview-vague', level: 'B2', chart: 'p-pie-budget',
              stem: 'Which is the best overview sentence for this pie chart?',
              options: ['Overall, the student spent money on six things.', 'Overall, food and drinks accounted for 38% of spending and savings for only 4%.', 'Overall, food and drinks was the largest share and savings the smallest.', 'Overall, the student should have saved more money.'], answer: 2,
              hint: 'Test each option against the three things that spoil an overview in this lesson.',
              why: 'Largest and smallest, no figures, no opinion. "Six things" is the introduction, the 38% sentence is a detail, and "should have saved" is a judgement the chart cannot support.' },
            { id: 'm03s2q5', type: 'judge', tag: 'ta-no-comparison', level: 'B2', chart: 'p-bar-tourists',
              given: 'Overall, arrivals rose to a peak in 2019, collapsed in 2020 and 2021, and then recovered strongly.',
              stem: 'Does this overview describe the main trend without using figures?', answer: 0,
              hint: 'Read the sentence for anything an overview must not contain. Then check each movement against the bars.',
              why: 'True. Years are allowed in an overview; numbers are not. Rise, collapse and recovery are the three general truths of this chart, and they are all correct.' },
            { id: 'm03s2q6', type: 'choose', tag: 'ta-overview-figures', level: 'B1',
              stem: 'Which of these is allowed in an overview?',
              options: ['Percentages', 'Exact totals', 'Your own explanation of causes', 'Years and category names'], answer: 3,
              hint: 'Recall the lesson list of what an overview may contain and what spoils it, then check each option.',
              why: 'The overview must still say what and when, so names and years are fine. Numbers of any kind belong in the detail paragraphs, and explanations belong nowhere in Task 1.' },
            { id: 'm03s2q7', type: 'choose', tag: 'ta-no-comparison', level: 'B2', chart: 'p-line-cities',
              stem: 'Which overview compares the cities?',
              options: ['Overall, Lagos grew fast and is expected to overtake Osaka, which is projected to shrink.', 'Overall, Lagos grew from 4.8 million in 1990 to 16.5 million in 2025 and is expected to reach 24 million.', 'Overall, the three cities had different populations.', 'Overall, Osaka was a large city throughout the period.'], answer: 0,
              hint: 'For each option, ask what a reader learns about how the cities differ. Check it against the three lines.',
              why: 'It puts two cities in one sentence and names the direction of each. The second is full of figures, the third is vague, and the fourth describes one city and compares nothing.' }
          ] },

        /* ------------------------------------------------------------ s3 */
        { id: 'm03s3', name: 'Write the overview', cefr: 'B2',
          theory: {
            key: 'Find the headline, then write: Overall, [general claim], whereas [contrasting general claim].',
            body: [
              '<p><strong>The headline method.</strong> Before writing, ask: if this chart were a news story, what would the headline be? <em>Bus travel up, cars down. Oil loses its crown to gas and solar. City-centre shops lead on every product.</em> A headline is short, general and has no figures, which is exactly what an overview is. Find one or two headlines and you have your paragraph.</p>',
              '<p><strong>The P2 pattern.</strong> <em>Overall, [general claim], whereas / while [contrasting general claim].</em> The first claim is the biggest movement or the biggest difference; the second is the contrast or the exception. A second sentence can add a third truth: who was largest throughout, what stayed the same, or that all figures after a date are projections.</p>',
              '<p>Openers that the checker accepts: <em>Overall,</em> <em>In general,</em> <em>It is clear that</em>. Choose one. Then two or three general sentences, 20 to 70 words. Years, category names and numbers inside labels (<em>the 15–24 age group</em>) are allowed; data values are not, not even rounded ones. Include a comparison word: <em>whereas, while, in contrast, the former, the latter, both</em>.</p>',
              '<p>Check your overview by covering the numbers on the chart. If a reader with no numbers could still learn the story of the chart from your paragraph, it is doing its job.</p>'
            ],
            simple: [
              '<p>Ask: what is the headline of this chart? Write it as a sentence after "Overall,".</p>',
              '<p>Pattern: Overall, [one big thing], whereas [a different big thing]. Then one more general sentence if you want.</p>',
              '<p>No numbers. Names and years are OK. Use "whereas" or "while" to compare.</p>'
            ],
            examples: [
              { s: 'Overall, bus travel grew strongly over the decade, whereas car and train journeys both declined. Cars remained the most common way to travel throughout.', g: 'Two headlines in the P2 pattern, plus a third truth. No figures.' },
              { s: 'Overall, the share of oil roughly halved, while gas and solar power expanded to become the leading sources. Nuclear and hydro barely changed.', g: 'The two pies: big movers first, the stable slices second.' },
              { s: 'In general, coffee was the best seller in every shop, whereas juice sold the least everywhere.', g: '"In general" works as well as "Overall".' }
            ]
          },
          items: [
            { id: 'm03s3q1', type: 'choose', tag: 'ta-no-overview', level: 'B2', chart: 'p-line-museums',
              stem: 'If this graph were a news story, which is the headline?',
              options: ['Art Gallery had 590,000 visitors in the year 2012', 'Science Museum visitors up, other museums down', 'Three museums in a European city', 'Museums are popular in Europe'], answer: 1,
              hint: 'Cover the numbers and look at the direction of each line. Which option would teach a reader the most?',
              why: 'A headline is the biggest general truth: one museum rose while two fell. The first is a single figure, the third is the introduction, and the fourth is an opinion the graph does not support.' },
            { id: 'm03s3q2', type: 'build', tag: 'ta-no-comparison', level: 'B2', chart: 'p-pie-energy',
              stem: 'Build the overview sentence using the P2 pattern.',
              tiles: ['Overall,', 'coal lost', 'more than half', 'of its share,', 'whereas', 'wind and solar', 'became', 'a major source.'],
              solution: 'Overall, coal lost more than half of its share, whereas wind and solar became a major source.',
              alt: [],
              hint: 'Check the pies first: which source shrank and which grew? Then use the P2 pattern from the lesson.',
              why: 'Overall + claim + whereas + contrasting claim. Coal went from 48% to 18%, so "more than half" is true, and wind and solar reached 27%, the second-largest slice in 2020.' },
            { id: 'm03s3q3', type: 'build', tag: 'ta-no-comparison', level: 'B2', chart: 'p-bar-screentime',
              stem: 'Build the overview sentence for this bar chart.',
              tiles: ['Overall,', 'the youngest group', 'spent the most time', 'on social media and gaming,', 'while', 'streaming', 'varied little', 'with age.'],
              solution: 'Overall, the youngest group spent the most time on social media and gaming, while streaming varied little with age.',
              alt: [],
              hint: 'Check the bars first: which group leads, and which activity hardly changes with age? Then use the P2 pattern.',
              why: 'The 13–17 group leads in social media (21) and gaming (12), while streaming stays between 12 and 15 for every group (the 18–29 group streams slightly more, at 15). Two general truths, one contrast, no figures.' },
            { id: 'm03s3q4', type: 'overview', tag: 'ta-no-overview', level: 'B2', chart: 'p-line-museums',
              stem: 'Write the overview paragraph for this line graph. Start with "Overall", compare, and use no figures.',
              must: [['science'], ['art', 'history', 'other two', 'others', 'two museums', 'remaining'], ['rose', 'increased', 'grew', 'climbed', 'rise', 'growth', 'upward', 'gained'], ['fell', 'declined', 'decreased', 'dropped', 'fall', 'decline', 'downward', 'lost']],
              minWords: 20, maxWords: 70,
              hint: 'First find the headline: which museum moved one way and which moved the other. Then join the two claims with a contrast word.',
              why: 'The headline is one museum up, two down. Name the Science Museum, name the other two, say rose and fell, and let "whereas" or "while" carry the comparison. No numbers: 420,000 and 760,000 wait for paragraph 3.' },
            { id: 'm03s3q5', type: 'overview', tag: 'ta-no-overview', level: 'B2', chart: 'p-pie-energy',
              stem: 'Write the overview for the two pie charts. Start with "Overall", contrast what fell with what rose, and use no figures.',
              must: [['coal'], ['wind', 'solar', 'renewable', 'gas'], ['fell', 'declined', 'decreased', 'dropped', 'halved', 'lost', 'shrank', 'fall', 'decline'], ['rose', 'increased', 'grew', 'became', 'climbed', 'rise', 'growth', 'overtook', 'gained']],
              minWords: 20, maxWords: 70,
              hint: 'Cover the numbers and compare the two pies: which slice shrank most and which grew most? Write two contrasting claims.',
              why: 'Coal fell from the leading source to third place; gas became the largest source and wind and solar grew from minor to major. A third sentence can add that nuclear and hydro barely changed. Years are allowed, percentages are not.' },
            { id: 'm03s3q6', type: 'spot', tag: 'ta-overview-figures', level: 'B2', chart: 'p-bar-tourists',
              stem: 'Tap the chunk that does not belong in an overview.',
              words: ['Overall,', 'arrivals', 'rose steadily', 'to 39.9 million', 'in 2019,', 'collapsed', 'and then recovered.'], answer: 3,
              fix: 'to a peak',
              hint: 'Read the sentence chunk by chunk, and recall what an overview may and may not contain.',
              why: '"39.9 million" is a figure, so it belongs in paragraph 3. "Rose steadily to a peak in 2019" keeps the year, which is allowed, and the general truth.' },
            { id: 'm03s3q7', type: 'judge', tag: 'ta-overview-vague', level: 'B2', chart: 'p-table-salaries',
              given: 'Overall, German teachers were the best paid and worked the shortest week, whereas Thai teachers earned far less than the rest.',
              stem: 'Is this a clear, accurate overview of the table?', answer: 0,
              hint: 'Check each claim against the table: top pay in both salary columns, the shortest week, and the lowest pay.',
              why: 'True. Germany leads both salary columns and has the shortest week (40 hours); Thailand is far below every other country. Two named truths, a contrast, and not one figure.' }
          ] }
      ],

      /* ------------------------------------------------------------ check */
      check: { id: 'm03ck', name: 'Systems Check', items: [
        { id: 'm03ckq1', type: 'choose', tag: 'ta-no-overview', level: 'A2',
          stem: 'Which paragraph of the report is the overview?',
          options: ['The first', 'The second', 'The third', 'The last'], answer: 1,
          hint: 'Recall the four paragraphs of the flight plan in order, and find the overview among them.',
              why: 'The second, straight after the introduction. It is written early so that it is never forgotten, and the examiner reads the big picture before the details.' },
        { id: 'm03ckq2', type: 'judge', tag: 'ta-overview-figures', level: 'B1', chart: 'p-line-internet',
          given: 'Overall, Kenya rose from 2% to 52% over the period.',
          stem: 'Is this sentence suitable for the overview?', answer: 1,
          hint: 'Cover the numbers on the graph. Could this sentence still be written as a big-picture statement?',
              why: 'False. Two percentages make it a detail sentence. The general truth is "Kenya remained the lowest despite strong growth", and the 2% and 52% go in paragraph 4.' },
        { id: 'm03ckq3', type: 'sort', tag: 'ta-overview-vague', level: 'B1', chart: 'p-table-rice',
          stem: 'Sort the sentences: is each one a good overview sentence, or not?',
          bins: [{ key: 'good', label: 'Good overview', hint: 'general, clear, true' }, { key: 'no', label: 'Not an overview', hint: 'figures, vague or opinion' }],
          items: [
            { text: 'Overall, China produced by far the most rice in every year.', bin: 'good' },
            { text: 'Overall, Vietnam produced 43 million tonnes in 2020.', bin: 'no' },
            { text: 'Overall, production rose in every country, although Thailand fell back after 2010.', bin: 'good' },
            { text: 'Overall, the table shows some rice figures.', bin: 'no' },
            { text: 'Overall, India showed the largest increase.', bin: 'good' },
            { text: 'Overall, rice is very important in Asia.', bin: 'no' }
          ],
          hint: 'For each sentence, cover the numbers in the table. Does it still say something general, true and useful?',
              why: 'The good ones name a general truth that is true of the table: China largest, India the biggest rise, Thailand the exception. A figure, a vague "some figures" and an opinion about Asia are not overview material.' },
        { id: 'm03ckq4', type: 'choose', tag: 'ta-no-comparison', level: 'B2',
          stem: 'Which word joins the two claims in the P2 pattern "Overall, …, ___ …"?',
          options: ['because', 'therefore', 'whereas', 'moreover'], answer: 2,
          hint: 'Recall the P2 pattern from this module. Think about what the second claim does to the first one.',
              why: '"Whereas" (or "while") sets one general truth against another, which is a comparison. "Because" and "therefore" explain causes, which Task 1 forbids, and "moreover" only adds.' },
        { id: 'm03ckq5', type: 'spot', tag: 'ta-overview-vague', level: 'B2', chart: 'p-bar-homework',
          stem: 'Tap the chunk that makes this overview vague.',
          words: ['Overall,', 'homework', 'increased', 'with each year group,', 'and', 'there were differences', 'between subjects.'], answer: 5,
          fix: 'Maths had the most and Thai the least',
          hint: 'Check each part of the sentence against the homework bars. Does every part say something specific?',
              why: '"There were differences" is true of every chart. Name the difference: Maths had the most homework in every year group (Science equalled it only in M5), and Thai had the least.' },
        { id: 'm03ckq6', type: 'judge', tag: 'ta-no-overview', level: 'B2', chart: 'p-mixed-coffee',
          given: 'Overall, Finland drank by far the most coffee and also paid the highest price, while Thailand drank the least.',
          stem: 'Is this a good overview for the two visuals?', answer: 0,
          hint: 'Check that it covers both visuals, names the top and the bottom correctly, and uses no figures.',
              why: 'True. It covers both visuals (cups and price), names the top and bottom, contrasts them with "while", and uses no figures. Finland: 21 cups, $3.90; Thailand: 5 cups.' },
        { id: 'm03ckq7', type: 'choose', tag: 'ta-overview-figures', level: 'B2', chart: 'p-pie-budget',
          stem: 'Which sentence must move from the overview to a detail paragraph?',
          options: ['Food and drinks was the biggest category.', 'Savings was the smallest share.', 'The three middle categories were fairly similar in size.', 'Transport came second, at 22%.'], answer: 3,
          hint: 'Recall what an overview must not contain, then read each option for it.',
              why: '"At 22%" is a figure. The other three are general truths: food largest (38%), savings smallest (4%), and phone, clothes and entertainment close together at 15%, 12% and 9%.' },
        { id: 'm03ckq8', type: 'overview', tag: 'ta-no-overview', level: 'B2', chart: 'p-bar-screentime',
          stem: 'Write the overview for this bar chart. Name the group that led, contrast two activities, and use no figures.',
          must: [['young', 'teenag'], ['social media', 'gaming', 'games'], ['streaming', 'video'], ['most', 'highest', 'more', 'least', 'lowest', 'less']],
          minWords: 20, maxWords: 70,
          hint: 'First find the leading group and the activity that hardly changes with age. Then join two claims with a contrast word, no numbers.',
              why: 'The headline: the youngest group spent the most time on social media and gaming, both of which fell with age, while streaming hardly changed. Say it in words; the hours wait for paragraph 3.' }
      ] }
    }]
  });
})();
