/* CHART CONTROL — topic-10.js · Module 10 Two Visuals */
(function () {
  var T = window.CONTENT.TOPICS;
  T.push({
    id: 'm10', n: 10, code: 'Module 10', name: 'Two Visuals', art: 'layers', cefr: 'B1–B2',
    blurb: 'One introduction, one overview, one paragraph for each visual.',
    levels: [{
      id: 'm10l1', n: 1, name: 'Two Visuals', cefr: 'B1–B2', blurb: 'Two charts, still four paragraphs.',
      subs: [
        { id: 'm10s1', name: 'One intro for two', cefr: 'B1',
          theory: {
            key: 'Two visuals get one introduction: name both, join them with <em>while</em> or <em>and</em>.',
            body: [
              '<p>Sometimes the task gives you two visuals: a bar chart and a table, a line graph and a pie chart. Students often panic and write two separate reports. Do not. The report still has <strong>four paragraphs</strong>. The only thing that changes is that the introduction names both visuals and each detail paragraph takes one of them.</p>',
              '<p>The introduction pattern is: <em>The [bar chart] shows [what A], while the [table] gives information about [what B], [in place, year].</em> Name the type of each visual, say what each one measures, and add the units if the rubric gives them (cups per week, US dollars).</p>',
              '<p>Use a small reference word to link the two halves instead of repeating the categories: <em>in each country</em>, <em>for the same five countries</em>, <em>over the same period</em>. This tells the examiner that you have seen how the visuals connect.</p>'
            ],
            simple: [
              '<p>Two charts do not need two reports. You still write four paragraphs.</p>',
              '<p>The first sentence names both charts: <em>The bar chart shows …, while the table shows …</em></p>',
              '<p>Use words like <em>each country</em> or <em>the same period</em> to connect them.</p>'
            ],
            examples: [
              { s: 'The bar chart shows how many cups of coffee people drank per week in five countries in 2024, while the table gives the average price of a cup in each country.', g: 'One sentence, both visuals named, linked with <em>while</em> and <em>each country</em>.' },
              { s: '<s>The bar chart shows coffee consumption. The table shows coffee prices.</s>', g: 'Two short sentences that copy the rubric and do not connect the visuals.' },
              { s: 'The line graph illustrates changes in car ownership between 2000 and 2020, and the pie chart shows the types of car sold in 2020.', g: '<em>and</em> also works when the visuals are not in contrast.' }
            ]
          },
          items: [
            { id: 'm10s1q1', type: 'choose', tag: 'cc-paragraphing', level: 'A2', chart: 'p-mixed-coffee',
              stem: 'Which is the best first sentence for this bar chart and table?',
              options: ['The bar chart shows cups of coffee and the table shows prices, and both of the visuals are about coffee drinking in 2024.', 'The bar chart shows weekly coffee consumption in five countries, while the table gives the price per cup.', 'The bar chart and the table show coffee in 2024.', 'Finland drank 21 cups a week and paid $3.90 a cup, more than any other country.'], answer: 1,
              hint: 'An introduction names both visuals and what each one measures. Which option does this in one linked sentence, without figures or vague words?',
              why: 'One sentence names both visuals, says what each one measures and joins them with <em>while</em>. Option D is a detail sentence, not an introduction.' },
            { id: 'm10s1q2', type: 'build', tag: 'cc-paragraphing', level: 'A2', chart: 'p-mixed-coffee',
              stem: 'Build the introduction for the two visuals.',
              tiles: ['The bar chart shows', 'the number of cups of coffee', 'drunk per person per week', 'in five countries,', 'while the table', 'gives the average price', 'of a cup', 'in each country.'],
              solution: 'The bar chart shows the number of cups of coffee drunk per person per week in five countries, while the table gives the average price of a cup in each country.',
              alt: [],
              hint: 'Two visuals, one sentence: think about which tile introduces each visual and which small phrase links the table back to the bar chart.',
              why: 'The pattern is <em>The [visual A] shows …, while the [visual B] gives …</em>. <em>In each country</em> links the table back to the five countries.' },
            { id: 'm10s1q3', type: 'judge', tag: 'ta-mechanical', level: 'B1',
              given: 'The bar chart shows coffee consumption. The table shows coffee prices.',
              stem: 'True or false: this is an effective introduction for a two-visual task.',
              answer: 1,
              hint: 'Count the sentences and check whether the two visuals are linked. Are the place, the year and the units given?',
              why: 'Two separate sentences treat the visuals as two separate tasks. Join them in one sentence and add place, year and units so the examiner sees one report.' },
            { id: 'm10s1q4', type: 'choose', tag: 'cc-paragraphing', level: 'B1',
              stem: 'Which word joins the two halves of a double introduction?',
              options: ['because', 'until', 'while', 'so'], answer: 2,
              hint: 'The two visuals do not cause each other. Choose the word that simply puts two facts side by side.',
              why: '<em>While</em> (or <em>and</em>) simply places the two visuals side by side. <em>Because</em> and <em>so</em> would invent a cause, which the visuals do not show.' },
            { id: 'm10s1q5', type: 'build', tag: 'cc-paragraphing', level: 'B1',
              stem: 'Build an introduction for a line graph and a pie chart.',
              tiles: ['The line graph illustrates', 'changes in car ownership', 'in one country', 'between 2000 and 2020,', 'and the pie chart', 'shows the types of car', 'sold in 2020.'],
              solution: 'The line graph illustrates changes in car ownership in one country between 2000 and 2020, and the pie chart shows the types of car sold in 2020.',
              alt: [],
              hint: 'Each visual has its own verb and its own time frame. Which tiles belong to the line graph, and which to the pie chart?',
              why: 'Each visual gets its own verb (<em>illustrates</em>, <em>shows</em>) and its own time frame. The line graph covers twenty years; the pie chart is one year only.' },
            { id: 'm10s1q6', type: 'choose', tag: 'cc-reference', level: 'B1', chart: 'p-mixed-coffee',
              stem: 'In "the table gives the price of a cup in each country", what does "each country" refer to?',
              options: ['The five countries in the bar chart', 'Every coffee-producing country', 'The country where the survey took place', 'Thailand and Japan only'], answer: 0,
              hint: 'Reference words point back to something already named. What has the reader already seen before the table is mentioned?',
              why: '<em>Each country</em> points back to the five countries already named for the bar chart. This is reference: it links the visuals without repeating the list.' },
            { id: 'm10s1q7', type: 'choose', tag: 'cc-paragraphing', level: 'B1', chart: 'p-mixed-coffee',
              stem: 'The table gives prices. Which detail about it belongs in the introduction?',
              options: ['The most expensive country', 'The currency of the prices', 'Why prices are different', 'The exact price in Finland'], answer: 1,
              hint: 'Think about what an introduction must tell the reader before any figures appear. Which option is information about the data, not the data itself?',
              why: 'The introduction says what is measured and in what units (here, US dollars). Figures and rankings wait for the detail paragraph; reasons never appear.' }
          ] },
        { id: 'm10s2', name: 'One overview, two headlines', cefr: 'B1–B2',
          theory: {
            key: 'One overview, beginning <em>Overall</em>, with the headline of each visual and one link if you can see one.',
            body: [
              '<p>With two visuals the overview still comes second and still has no figures. The difference is that it must <strong>mention both visuals</strong>. Give one headline for the first and one for the second: <em>Overall, Finland consumed by far the most coffee and Thailand the least, while prices were highest in Finland and Japan and lowest in Brazil and Italy.</em></p>',
              '<p>If the same categories appear in both visuals, look for a link and state it in one sentence. In the coffee task, the country that drank the most also paid the most, but the two big consumers after it, Italy and Brazil, paid the least. That is a true general statement and it earns the "clear overview" of Band 7.</p>',
              '<p>Two traps. First, writing one overview per visual, which produces two mini-reports. Second, inventing a link that the data do not support: "the more people drink, the cheaper the coffee" is false here because Finland leads on both measures.</p>'
            ],
            simple: [
              '<p>The overview is one paragraph for both charts. Start with <em>Overall</em>. No numbers.</p>',
              '<p>Say the big idea of chart 1, then the big idea of chart 2.</p>',
              '<p>If the two charts connect, say so in one sentence. Only if it is really true.</p>'
            ],
            examples: [
              { s: 'Overall, Finland consumed by far the most coffee and Thailand the least, while prices were highest in Finland and Japan and lowest in Brazil and Italy.', g: 'Two headlines, one for each visual, no figures.' },
              { s: 'Finland was the leader on both measures, whereas Italy and Brazil combined high consumption with low prices.', g: 'A true link between the visuals, stated generally.' },
              { s: '<s>Overall, Finnish people drank 21 cups a week and paid $3.90 a cup.</s>', g: 'Figures belong in the detail paragraphs. This is not an overview.' }
            ]
          },
          items: [
            { id: 'm10s2q1', type: 'judge', tag: 'ta-no-overview', level: 'B1', chart: 'p-mixed-coffee',
              given: 'Overall, Finland consumed by far the most coffee, while Thailand consumed the least.',
              stem: 'Is this headline for the bar chart true?',
              answer: 0,
              hint: 'Find the highest and the lowest bars in the cups chart. Do the two countries named sit at those two ends?',
              why: 'Finland is at 21 cups and Thailand at 5, the two ends of the chart. A headline names the extremes without giving the figures.' },
            { id: 'm10s2q2', type: 'judge', tag: 'ta-no-overview', level: 'B1', chart: 'p-mixed-coffee',
              given: 'Overall, Finnish people drank 21 cups a week and paid $3.90 a cup.',
              stem: 'Is this a good overview sentence?',
              answer: 1,
              hint: 'Cover the numbers in this sentence. What general idea is left? Think about what an overview must not contain.',
              why: 'The numbers are correct, but an overview is general. Cover the figures and nothing is left. Say <em>Finland led on both measures</em> and save 21 and $3.90 for the details.' },
            { id: 'm10s2q3', type: 'choose', tag: 'cc-paragraphing', level: 'B1', chart: 'p-mixed-coffee',
              stem: 'Which overview covers both visuals?',
              options: ['Overall, Finland drank far more coffee than any other country.', 'Overall, prices ranged from cheap in Brazil and Italy to expensive in Finland and Japan, with Thailand in between.', 'Overall, Finland drank the most coffee and Thailand the least, while prices were highest in Finland and Japan.', 'Overall, coffee is popular in Europe, Asia and South America, and people everywhere drink it every day.'], answer: 2,
              hint: 'Check each option: does it mention cups, prices, or both? An overview for two visuals needs a headline from each one.',
              why: 'Options A and B each describe only one visual. Option D is a guess, not a feature. A two-visual overview needs a headline for the chart and a headline for the table.' },
            { id: 'm10s2q4', type: 'judge', tag: 'ta-no-overview', level: 'B2', chart: 'p-mixed-coffee',
              given: 'Overall, the countries that drank the most coffee also paid the highest prices.',
              stem: 'Is this link between the two visuals true?',
              answer: 1,
              hint: 'Test the link on every country, not just the first one. Look at Italy and Brazil in both the bar chart and the table.',
              why: 'Finland fits, but Italy and Brazil drank a lot (14 and 12 cups) and paid the least ($1.40 and $1.10). Check a link against every category before you write it.' },
            { id: 'm10s2q5', type: 'judge', tag: 'ta-no-overview', level: 'B2', chart: 'p-mixed-coffee',
              given: 'Overall, prices were highest in Finland and Japan and lowest in Brazil and Italy.',
              stem: 'Is this headline for the table true?',
              answer: 0,
              hint: 'Read the price column and find the two highest and the two lowest prices. Do they match the countries named?',
              why: 'Finland ($3.90) and Japan ($3.60) sit at the top; Brazil ($1.10) and Italy ($1.40) at the bottom. Naming the top pair and the bottom pair is a strong headline.' },
            { id: 'm10s2q6', type: 'choose', tag: 'ta-no-overview', level: 'B2', chart: 'p-mixed-coffee',
              stem: 'Which link between the two visuals is true and belongs in the overview?',
              options: [
                'Cheaper coffee always meant more cups per week.',
                'Japan drank the most because coffee was expensive there.',
                'Brazil was the leader on both consumption and price.',
                'Finland led on both consumption and price.'
              ], answer: 3,
              hint: 'Check each claim against both visuals, country by country. Also ask whether an option explains why, which a report never does.',
              why: 'Finland is first in both visuals. Option A fails because Thailand had a mid-range price and the lowest consumption; option B gives a reason and is also false; option C is false.' },
            { id: 'm10s2q7', type: 'choose', tag: 'cc-paragraphing', level: 'B2',
              stem: 'A student writes one overview for the bar chart and another for the table. What is the problem?',
              options: [
                'There should be one overview that covers both visuals',
                'Overviews should describe tables only',
                'The second overview needs more figures',
                'Each visual also needs its own introduction and its own conclusion'
              ], answer: 0,
              hint: 'Remember the four-paragraph shape of every report. Does adding a second visual change that shape?',
              why: 'Two overviews means two mini-reports. Keep the four-paragraph shape: one introduction, one overview with two headlines, then one detail paragraph per visual.' }
          ] },
        { id: 'm10s3', name: 'One paragraph each', cefr: 'B2',
          theory: {
            key: 'Paragraph 3 belongs to the first visual, paragraph 4 to the second. Never mix them.',
            body: [
              '<p>The detail paragraphs are the easy part of a two-visual task because the grouping is done for you: <strong>one visual, one paragraph</strong>. Paragraph 3 reports the bar chart with figures and at least one comparison. Paragraph 4 does the same for the table. Each paragraph starts with a topic sentence that names what it is about.</p>',
              '<p>Do not put a price figure in the consumption paragraph or a cups figure in the price paragraph. If the two visuals share the same categories, you may refer back briefly: <em>Italy and Brazil, the two big consumers after Finland, paid the least</em>. That is reference, not mixing, because the figures in the sentence all come from the table.</p>',
              '<p>Select as you would for one visual: the highest, the lowest, one comparison, one interesting pair. Five countries do not need five sentences. Use <em>respectively</em>, <em>the former / the latter</em> and <em>the same country</em> to avoid repeating names.</p>'
            ],
            simple: [
              '<p>Paragraph 3 = chart 1 with numbers. Paragraph 4 = chart 2 with numbers.</p>',
              '<p>Do not put numbers from chart 2 in paragraph 3.</p>',
              '<p>Choose the biggest, the smallest and one comparison. Not every number.</p>'
            ],
            examples: [
              { s: 'Finland was far ahead, at 21 cups per person per week, while Italy and Brazil followed with 14 and 12 cups respectively.', g: 'Paragraph 3: cups only, one comparison, <em>respectively</em>.' },
              { s: 'A cup in Finland cost $3.90, more than three times the Brazilian price of $1.10.', g: 'Paragraph 4: prices only, with a multiple.' },
              { s: '<s>Brazil, at 12 cups, also paid the lowest price of $1.10.</s>', g: 'A cups figure and a price figure in one sentence mixes the visuals.' }
            ]
          },
          items: [
            { id: 'm10s3q1', type: 'sort', tag: 'cc-paragraphing', level: 'B1', chart: 'p-mixed-coffee',
              stem: 'Sort each sentence into the paragraph where it belongs.',
              bins: [
                { key: 'p3', label: 'Paragraph 3: cups per week', hint: 'Figures from the bar chart' },
                { key: 'p4', label: 'Paragraph 4: price per cup', hint: 'Figures from the table' }
              ],
              items: [
                { text: 'Finland led with 21 cups per person per week.', bin: 'p3' },
                { text: 'Coffee was cheapest in Brazil, at $1.10 a cup.', bin: 'p4' },
                { text: 'Italy and Brazil followed, at 14 and 12 cups respectively.', bin: 'p3' },
                { text: 'A cup in Finland cost $3.90, over three times the Brazilian price.', bin: 'p4' },
                { text: 'Thailand consumed the fewest cups, just five a week.', bin: 'p3' },
                { text: 'Japan\'s price of $3.60 was the second highest.', bin: 'p4' }
              ],
              hint: 'Look at the unit in each sentence. Which visual gives cups, and which gives dollars?',
              why: 'Cups sentences go with the bar chart, price sentences with the table. The unit in the figure ($ or cups) tells you the paragraph.' },
            { id: 'm10s3q2', type: 'order', tag: 'cc-paragraphing', level: 'B2', chart: 'p-mixed-coffee',
              stem: 'Put the sentences of paragraph 3 in the best order.',
              items: [
                'Consumption varied widely across the five countries.',
                'Finland was far ahead, at 21 cups per person per week.',
                'Italy and Brazil came next, with 14 and 12 cups respectively.',
                'Japan and Thailand drank far less, at eight and five cups.'
              ],
              hint: 'Which sentence introduces the topic without figures? For the rest, think about how the bars are arranged from one end to the other.',
              why: 'Topic sentence first, then the leader, then the middle pair, then the bottom pair. The reader moves down the ranking without effort.' },
            { id: 'm10s3q3', type: 'choose', tag: 'cc-paragraphing', level: 'B2', chart: 'p-mixed-coffee',
              stem: 'Which sentence wrongly mixes the two visuals in paragraph 3?',
              options: [
                'Finland drank 21 cups, whereas Thailand drank only five.',
                'Italy, at 14 cups, drank almost three times as many as Thailand.',
                'Brazil, at 12 cups, also paid the lowest price of $1.10.',
                'Japan drank eight cups, fewer than half the Finnish figure.'
              ], answer: 2,
              hint: 'Paragraph 3 reports the bar chart only. Check the unit of every figure in each option.',
              why: 'The price of $1.10 comes from the table, so it belongs in paragraph 4. The other three sentences use cups figures only and each contains a comparison.' },
            { id: 'm10s3q4', type: 'choose', tag: 'cc-reference', level: 'B2', chart: 'p-mixed-coffee',
              stem: 'Finland drank the most and Thailand the least; ___ paid $3.90 a cup, ___ $2.20. Which pair fits?',
              options: ['the latter … the former', 'the former … the latter', 'this … that', 'one … another'], answer: 1,
              hint: 'These words point back to the two countries just named. Which country came first in the sentence, and which price belongs to it?',
              why: '<em>The former</em> is the first item named (Finland, $3.90) and <em>the latter</em> the second (Thailand, $2.20). Reference like this is a Band 7 cohesion tool.' },
            { id: 'm10s3q5', type: 'judge', tag: 'cc-reference', level: 'B2', chart: 'p-mixed-coffee',
              given: 'Italy and Brazil, the two big consumers after Finland, paid the least: $1.40 and $1.10 respectively.',
              stem: 'Is this sentence acceptable in the price paragraph?',
              answer: 0,
              hint: 'Check the unit of every figure in the sentence. Which visual does each figure come from, and which paragraph is this?',
              why: 'Every figure is a price, so the sentence stays in paragraph 4. The phrase <em>the two big consumers after Finland</em> refers back to the bar chart without borrowing its numbers.' },
            { id: 'm10s3q6', type: 'choose', tag: 'ta-mechanical', level: 'B2', chart: 'p-mixed-coffee',
              stem: 'Which plan for paragraph 4 is mechanical?',
              options: [
                'Finland, Italy, Brazil, Japan, Thailand: one price sentence each, in chart order',
                'The two expensive countries, then the two cheap ones, with one comparison between the pairs',
                'The highest and lowest prices, then the gap between them',
                'The expensive pair contrasted with the cheap pair'
              ], answer: 0,
              hint: 'Think about what Band 5 mechanical reporting looks like. Which plan groups the prices, and which does not?',
              why: 'Going down the list one sentence at a time is the "mechanical" reporting of Band 5. Group the prices into high and low and compare across the groups.' },
            { id: 'm10s3q7', type: 'para', tag: 'cc-paragraphing', level: 'B2', chart: 'p-mixed-coffee', mode: 'COMPARE',
              stem: 'Write paragraph 3 for the bar chart only: cups per week, with figures and at least one comparison.',
              minWords: 40, maxWords: 90,
              hint: 'Plan before you write: the leader, the lowest and one pair. Use cups figures only, and add a comparison word.',
              why: 'A good paragraph 3 names the leader, the lowest and one pair, uses cups figures only, and compares at least twice.' }
          ] }
      ],
      check: { id: 'm10ck', name: 'Systems Check', items: [
        { id: 'm10ckq1', type: 'choose', tag: 'cc-paragraphing', level: 'B1',
          stem: 'How many detail paragraphs does a two-visual report have?',
          options: ['One long paragraph covering both', 'Two, one for each visual', 'Four, two for each visual', 'Three: one each and one comparing them'], answer: 1,
          hint: 'Think about the four-paragraph skeleton, and where any link between the two visuals goes.',
              why: 'The skeleton does not change: introduction, overview, then one detail paragraph per visual. Any link between the visuals goes in the overview.' },
        { id: 'm10ckq2', type: 'build', tag: 'cc-paragraphing', level: 'B1',
          stem: 'Build an introduction for a pie chart and a table.',
          tiles: ['The pie chart shows', 'how electricity was produced', 'in one country', 'in 2020,', 'while the table', 'gives the cost', 'of each source.'],
          solution: 'The pie chart shows how electricity was produced in one country in 2020, while the table gives the cost of each source.',
          alt: [],
          hint: 'Keep the pie chart\'s place and year together, and find the small phrase that links the table back to the pie chart.',
              why: 'Both visuals are named in one sentence, joined by <em>while</em>, and <em>each source</em> links the table back to the pie chart.' },
        { id: 'm10ckq3', type: 'judge', tag: 'ta-no-overview', level: 'B1', chart: 'p-mixed-coffee',
          given: 'Overall, Japan drank little coffee but paid a high price for it.',
          stem: 'Is this statement true of the two visuals?',
          answer: 0,
          hint: 'Find Japan in both visuals. Where does it rank for cups, and where for price?',
              why: 'Japan is second lowest for cups (8) and second highest for price ($3.60). A general statement that is true of both visuals makes a strong overview link.' },
        { id: 'm10ckq4', type: 'judge', tag: 'ta-no-overview', level: 'B2', chart: 'p-mixed-coffee',
          given: 'Overall, Thailand had both the lowest price and the lowest consumption.',
          stem: 'Is this statement true of the two visuals?',
          answer: 1,
          hint: 'Check Thailand\'s position in the bar chart and in the table separately before you accept the link.',
              why: 'Thailand did drink the least, but its price ($2.20) was in the middle; Brazil ($1.10) was cheapest. Read the second visual before you claim a link.' },
        { id: 'm10ckq5', type: 'sort', tag: 'cc-paragraphing', level: 'B2', chart: 'p-mixed-coffee',
          stem: 'Sort each sentence into the paragraph where it belongs.',
          bins: [
            { key: 'ov', label: 'Overview', hint: 'General, no figures' },
            { key: 'bar', label: 'Paragraph 3: bar chart', hint: 'Cups figures' },
            { key: 'tab', label: 'Paragraph 4: table', hint: 'Price figures' }
          ],
          items: [
            { text: 'Overall, Finland led on both measures.', bin: 'ov' },
            { text: 'Brazil charged the least, at $1.10.', bin: 'tab' },
            { text: 'Finland drank 21 cups, more than four times the Thai figure.', bin: 'bar' },
            { text: 'Consumption ranged from five cups in Thailand to 21 in Finland.', bin: 'bar' },
            { text: 'Overall, cheap coffee was found in the big-consuming countries of Italy and Brazil.', bin: 'ov' },
            { text: 'Japan paid $3.60, just below Finland.', bin: 'tab' }
          ],
          hint: 'Look for a figure in each sentence. If there is one, check its unit; if there is none, think about which paragraph is general.',
              why: 'General claims without figures are overview; cups figures belong to the bar chart paragraph; dollar figures to the table paragraph.' },
        { id: 'm10ckq6', type: 'choose', tag: 'cc-reference', level: 'B2', chart: 'p-mixed-coffee',
          stem: 'Finland and Japan had the highest prices, at $3.90 and $3.60 ___.',
          options: ['relatively', 'correspondingly', 'respectively', 'separately'], answer: 2,
          hint: 'Two names, then two figures in the same sentence. Recall the reference word from lesson 3 that links them in order.',
              why: '<em>Respectively</em> matches two figures to two names in the same order. It saves a whole sentence and shows reference control.' },
        { id: 'm10ckq7', type: 'choose', tag: 'ta-mechanical', level: 'B2',
          stem: 'A student reports all five prices, then all five cups figures, one by one. What is the problem?',
          options: [
            'The table should always be described before the bar chart, whatever the rubric says',
            'The paragraphs are too short',
            'The figures are in the wrong currency',
            'Every figure is listed without selection or comparison'
          ], answer: 3,
          hint: 'Ten sentences of \'X was Y\' in a row. What is missing that Band 7 asks for?',
              why: 'Ten sentences of "X was Y" is listing. Band 7 needs the main features selected and compared: the leader, the lowest, the gap, one pair.' },
        { id: 'm10ckq8', type: 'order', tag: 'cc-paragraphing', level: 'B2',
          stem: 'Put the four paragraphs of a two-visual report in order.',
          items: [
            'Introduction naming both visuals in one sentence',
            'Overview with a headline for each visual',
            'Details of the first visual with figures',
            'Details of the second visual with figures'
          ],
          hint: 'Use the flight plan from earlier modules. Two visuals do not change it; they only change what each detail paragraph covers.',
              why: 'The order never changes: introduce both, summarise both, then one paragraph each. No conclusion.' }
      ] }
    }]
  });
})();
