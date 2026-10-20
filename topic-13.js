/* CHART CONTROL — topic-13.js · Module 13 Selection */
(function () {
  var T = window.CONTENT.TOPICS;
  T.push({
    id: 'm13', n: 13, code: 'Module 13', name: 'Selection', art: 'scope',
    cefr: 'B1–C1',
    blurb: 'The gate between 7 and 8: choose the three or four features that matter and illustrate them.',
    levels: [{
      id: 'm13l1', n: 1, name: 'Selection', cefr: 'B1–C1', blurb: 'Fewer figures, better chosen.',
      subs: [
        { id: 'm13s1', name: 'What is a key feature?', cefr: 'B1',
          theory: {
            key: 'A key feature is a general truth about the whole chart: the direction, the extremes, the biggest change or gap, the crossover, the exception.',
            body: [
              '<p>The rubric says <em>select and report the main features</em>. The Band 7 descriptor talks about "key features", and Band 8 says they are "skilfully selected". So what counts? A key feature is something a newspaper would report about the chart: <strong>the overall direction</strong> (sales rose in one channel and fell in the other two), <strong>the largest and smallest</strong> (phone sales were the lowest throughout), <strong>the biggest change or gap</strong>, <strong>a crossover</strong> (online sales overtook store sales around 2018), or <strong>an exception</strong> (Peru was the only country whose exports fell).</p>',
              '<p>What is not a key feature: a single data point (<em>store sales were $5 million in 2016</em>), a count of categories (<em>seven types are shown</em>), a small wobble (<em>phone sales recovered slightly in 2019</em>), an obvious fact (<em>all three channels made some sales</em>), and anything that gives a reason or an opinion. Data points are evidence for a feature; they are not features.</p>',
              '<p>Two more tests. A key feature must be <strong>general</strong> enough to sit in the overview, so <em>the figures varied</em> fails because it says nothing. And it must be <strong>true</strong>: <em>store sales led throughout</em> sounds like a feature, but online sales passed them in 2018. Check every feature against the numbers before it goes on your list.</p>'
            ],
            simple: [
              '<p>A key feature is a big, general truth: what went up, what went down, the biggest, the smallest, where lines cross, the odd one out.</p>',
              '<p>Not a key feature: one number, how many categories there are, a tiny change, a reason, an opinion.</p>',
              '<p>Check it is true. Check it is general enough for the overview.</p>'
            ],
            examples: [
              { s: 'Online sales climbed steadily from the first year to the last.', g: 'Direction of one line for the whole period: key.' },
              { s: '<s>Store sales were $5 million in 2016.</s>', g: 'One data point: evidence, not a feature.' },
              { s: '<s>The figures changed in different ways over the years.</s>', g: 'Too vague to be a feature. What changed, and how?' }
            ]
          },
          items: [
            { id: 'm13s1q1', type: 'judge', tag: 'ta-selection', level: 'A2', chart: 'p-line-museums',
              given: 'The Science Museum rose strongly over the whole period.',
              stem: 'Is this a key feature of the graph?',
              answer: 0,
              hint: 'Check the claim against the Science Museum line. Then think about the difference between a key feature and evidence.',
              why: 'It describes the direction of a whole line from 420,000 to 760,000. Direction over the full period is the first thing an examiner expects you to notice.' },
            { id: 'm13s1q2', type: 'judge', tag: 'ta-selection', level: 'A2', chart: 'p-line-museums',
              given: 'The Art Gallery was the most visited museum until the Science Museum passed it around 2014.',
              stem: 'Is this a key feature of the graph?',
              answer: 0,
              hint: 'Compare the Science Museum and Art Gallery lines year by year. Do they change places, and when?',
              why: 'True. A crossover is a key feature: the Art Gallery led in 2010 and 2012, but by 2014 the Science Museum (570,000) had moved ahead of it (560,000). A single reading such as 590,000 in 2012 would only be evidence.' },
            { id: 'm13s1q3', type: 'judge', tag: 'ta-selection', level: 'B1', chart: 'p-pie-energy',
              given: 'Wind and solar rose from the smallest source in 2000 to the second largest in 2020.',
              stem: 'Is this a key feature of the pie charts?',
              answer: 0,
              hint: 'Find wind and solar in each pie, then rank all five slices in both years.',
              why: 'True. A change of rank is a key feature: wind and solar went from 5%, the smallest slice, to 27%, behind only natural gas (30%). Simply counting the slices would not be a feature.' },
            { id: 'm13s1q4', type: 'judge', tag: 'ta-inaccurate', level: 'B1', chart: 'p-bar-screentime',
              given: 'Social media time fell sharply with age, but streaming video hardly changed.',
              stem: 'Could this be one of your key features?',
              answer: 0,
              hint: 'Check both parts against the bars: follow social media across the age groups, then streaming video.',
              why: 'True. Social media fell from 21 hours to six, while streaming stayed between 12 and 15 hours in every group. Both halves hold when checked against the bars, so this pattern and its exception make a strong feature.' },
            { id: 'm13s1q5', type: 'choose', tag: 'ta-selection', level: 'B1', chart: 'p-table-rice',
              stem: 'Which of these is a key feature of the table?',
              options: ['Vietnam produced 40 million tonnes of rice in 2010', 'Three years are shown', 'Thailand alone fell between 2010 and 2020', 'Rice is grown in all four countries'], answer: 2,
              hint: 'Check each option against the rice table. Which one would a newspaper report about these figures?',
              why: 'The one country that moved against the others is an exception, and exceptions are key features. A single cell, a count of columns and an obvious fact are not.' },
            { id: 'm13s1q6', type: 'judge', tag: 'ta-overview-vague', level: 'B1', chart: 'p-line-museums',
              given: 'There were some differences between the three museums.',
              stem: 'Is this a usable key feature?',
              answer: 1,
              hint: 'Compare this sentence with what you can see in the museum graph. What exactly does it tell the reader?',
              why: 'It is true of every chart ever drawn. Name the difference: one museum rose while two declined, and the smallest stayed smallest. Band 7 needs a "clear" overview, not a vague one.' },
            { id: 'm13s1q7', type: 'sort', tag: 'ta-selection', level: 'B1', chart: 'p-line-internet',
              stem: 'Sort the statements about the graph.',
              bins: [
                { key: 'key', label: 'Key feature', hint: 'General and true' },
                { key: 'no', label: 'Trivial or false', hint: 'One point, a count, or wrong' }
              ],
              items: [
                { text: 'Internet access rose in all four countries', bin: 'key' },
                { text: 'Japan had 78% in 2010', bin: 'no' },
                { text: 'Thailand showed the biggest rise', bin: 'key' },
                { text: 'Kenya fell in 2015', bin: 'no' },
                { text: 'Kenya remained the lowest despite strong growth', bin: 'key' },
                { text: 'Four countries are shown', bin: 'no' }
              ],
              hint: 'For each statement, ask: is it general, and is it true? Check every claim against the four lines.',
              why: 'Direction, fastest change and the lowest line are features. One reading, a count of lines and a false claim (Kenya rose every year) are not.' }
          ] },
        { id: 'm13s2', name: 'Choose four', cefr: 'B1–B2',
          theory: {
            key: 'Before writing, tick the three or four features that best summarise the chart and leave the rest out on purpose.',
            body: [
              '<p>Every chart offers more facts than a 180-word report can hold. The Band 8 writer does not try to fit them all in; they choose <strong>three or four</strong> and give each one the figures that prove it. The four usually come from the same list: overall direction, largest and smallest, biggest change or gap, crossover or exception. Two of them go in the overview as general statements; all of them get evidence in the detail paragraphs.</p>',
              '<p>The trap is the plausible distractor: a true fact that is too small (<em>one country rose by 2% in the last five years</em>), a claim that is false (<em>online sales fell in 2016</em>, when in fact they rose every year), a reason (<em>the fall was caused by higher prices</em>), or a count (<em>seven regions are shown</em>). These feel safe because they are easy to write, and they fill the report with sentences that earn nothing.</p>',
              '<p>Make the choice visible. Write four short bullets in the margin before you write a sentence. If you cannot fit a fact under one of the four, it does not go in. This is what "skilfully selected" means, and it is the difference between Band 7 and Band 8 in Task Achievement.</p>'
            ],
            simple: [
              '<p>Choose three or four big features. Leave the rest out.</p>',
              '<p>Do not choose: a small change, a false claim, a reason, or "four countries are shown".</p>',
              '<p>Write your four features as bullets before you start the report.</p>'
            ],
            examples: [
              { s: 'Online sales up; store and phone sales down; crossover 2018; phone sales lowest throughout.', g: 'Four margin bullets for a sales graph.' },
              { s: 'Rail halved; cycling became major; buses now lead; walking and taxis flat.', g: 'Four bullets for two transport pies.' },
              { s: '<s>The fall in store sales was caused by higher rents.</s>', g: 'A reason. It is not on the chart and it is not a feature.' }
            ]
          },
          items: [
            { id: 'm13s2q1', type: 'select', tag: 'ta-selection', level: 'B1', chart: 'p-line-museums',
              stem: 'Tick the four key features of the graph.',
              options: [
                'The Science Museum overtook the Art Gallery around 2014',
                'The Art Gallery had 590,000 visitors in 2012',
                'All three museums had visitors',
                'The Art Gallery and the History Museum both declined',
                'The History Museum was the least visited throughout',
                'The Science Museum rose by 50,000 between 2010 and 2012',
                'The Science Museum rose strongly over the whole period',
                'The History Museum recovered slightly in 2018'
              ], answers: [0, 3, 4, 6], k: 4,
              hint: 'Use the list of key feature types from lesson 1. Check each option against the whole decade on the graph.',
              why: 'Direction of each line, the crossover and the lowest line are the story. A single reading, a two-year step, a small wobble and an obvious fact are not.' },
            { id: 'm13s2q2', type: 'select', tag: 'ta-selection', level: 'B1', chart: 'p-bar-screentime',
              stem: 'Tick the four key features of the bar chart.',
              options: [
                'People aged 18–29 spent 15 hours streaming',
                'Social media and gaming fell sharply with age',
                'The youngest group spent the most time on social media and gaming',
                'Three activities are shown',
                'Older people do not use social media',
                'Streaming was the leading activity for people aged 30 and over',
                'Gaming was 8 hours for 18–29',
                'Streaming video was similar across all age groups'
              ], answers: [1, 2, 5, 7], k: 4,
              hint: 'Follow each activity across the four age groups, and check every option against the bars.',
              why: 'The pattern with age, the exception (streaming) and who led are features. Single bars are evidence, and "older people do not use social media" is false: they spent six hours a week.' },
            { id: 'm13s2q3', type: 'select', tag: 'ta-selection', level: 'B1', chart: 'p-pie-energy',
              stem: 'Tick the four key features of the two pie charts.',
              options: [
                'Hydro was 10% in 2000',
                'Natural gas became the leading source by 2020',
                'The country cares about the environment',
                'Coal lost more than half of its share',
                'Five sources are shown',
                'Nuclear and hydro stayed almost unchanged',
                'Wind and solar grew from a minor source to one of the largest',
                'Nuclear fell by 1%'
              ], answers: [1, 3, 5, 6], k: 4,
              hint: 'Put the two pies side by side and compare each source. Which options would still matter in a short overview?',
              why: 'Two pies ask what grew, what shrank, what now leads and what stayed the same. A one-point change, a single slice, a count and an opinion do not summarise anything.' },
            { id: 'm13s2q4', type: 'select', tag: 'ta-selection', level: 'B2', chart: 'p-table-salaries',
              stem: 'Tick the four key features of the table.',
              options: [
                'Thai teachers earned far less than all the others',
                'Korea\'s starting salary was $33,000',
                'Japanese teachers worked the longest hours',
                'Teachers deserve more money',
                'Five countries are compared',
                'German teachers were the best paid at both stages and worked the shortest week',
                'Salaries after 15 years were much higher than starting salaries in every country',
                'Teachers in the USA worked 46 hours'
              ], answers: [0, 2, 5, 6], k: 4,
              hint: 'Scan each column for the highest and lowest values, and look for a pattern that is true of every row.',
              why: 'For a table, look for the biggest and smallest in each column and a pattern across all rows. Single cells are evidence; an opinion and a count are nothing.' },
            { id: 'm13s2q5', type: 'select', tag: 'ta-selection', level: 'B2', chart: 'p-bar-tourists',
              stem: 'Tick the three key features of the bar chart.',
              options: [
                'There were 35.6 million arrivals in 2017',
                'Numbers collapsed in 2020 and 2021',
                'The fall in 2020 was because of the pandemic',
                '2015 was the first year',
                'Arrivals rose steadily to a peak in 2019',
                'Tourists like Thailand',
                'A strong recovery followed from 2023'
              ], answers: [1, 4, 6], k: 3,
              hint: 'Follow the bars from 2015 to 2025 and tell the story in a few big steps.',
              why: 'Rise, collapse, recovery: three phases, three features. The reason for the fall is not on the chart, and a reason in a report is irrelevant material.' },
            { id: 'm13s2q6', type: 'select', tag: 'ta-selection', level: 'B2', chart: 'p-map-riverside',
              stem: 'Tick the four key features of the maps.',
              options: [
                'The river is in the north',
                'The factory in the east was replaced by apartment blocks',
                'Traffic was moved out of the centre: the road was pedestrianised and a ring road built',
                'The bus station has buses',
                'The centre changed from industrial and commercial to residential and leisure use',
                'The bridge is old',
                'The town is nice now',
                'The car park became a shopping mall and the cinema and shops became a pedestrian square'
              ], answers: [1, 2, 4, 7], k: 4,
              hint: 'Put the two maps side by side. Which options tell the main story of how the town centre developed?',
              why: 'For a map, the features are the overall character of the change and the main things removed, added and rerouted. Where the river is and how the town feels are not changes.' },
            { id: 'm13s2q7', type: 'select', tag: 'ta-inaccurate', level: 'B2', chart: 'p-line-cities',
              stem: 'Tick the four key features. One option is false and others are true but too small, so check them against the graph.',
              options: [
                'Bangkok grew steadily throughout',
                'Osaka had 18.7 million in 2000',
                'Osaka was largest until the late 2020s but is projected to decline slightly',
                'Lagos fell in 2010',
                'Three cities are compared',
                'Lagos grew fastest and is projected to overtake Osaka by 2040',
                'All figures after 2025 are projections',
                'Bangkok rose by 1 million between 1990 and 2000'
              ], answers: [0, 2, 5, 6], k: 4,
              hint: 'Check every claim against the lines and the projections. Also ask whether a true change is big enough to matter.',
              why: 'Lagos never fell, and Bangkok rose by exactly 1 million in the 1990s, which is true but tiny. The projection itself is a feature because it changes the tense of half the report.' }
          ] },
        { id: 'm13s3', name: 'Illustrate, don\'t list', cefr: 'B2–C1',
          theory: {
            key: 'For each feature, give the one or two figures that prove it. Do not give every figure.',
            body: [
              '<p>Band 8 Task Achievement says key features are "skilfully selected and clearly presented, highlighted and <strong>illustrated</strong>". To illustrate is to choose the figures that make the feature visible: for a rise, the start and end values; for a gap, the two extremes; for a crossover, the year and the two values that changed places. <em>Online sales climbed from $2 million in 2012 to $9 million in 2022, passing store sales in 2018</em> illustrates two features with three figures.</p>',
              '<p>To list is to report every value in order: <em>Online sales were $2 million in 2012, $3 million in 2014, $4.5 million in 2016 …</em> The examiner\'s word for this is "mechanical". It uses more figures and says less, because the reader has to work out the feature alone. The Band 6 museum report in our model set uses eighteen figures and no comparison; the Band 8 version uses seven figures and compares four times.</p>',
              '<p>Accuracy still rules. An illustration is only an illustration if the figure is right: <em>by 2022 visitor numbers had recovered to 48,000, close to the 2018 peak of 50,000</em> is correct, but <em>slightly above the 2018 peak</em> is not. Read the value from the axis for every figure you keep, and use <em>approximately</em> or <em>just under</em> when the gridline is unclear.</p>'
            ],
            simple: [
              '<p>For each feature, give one or two numbers that prove it: start and end, highest and lowest, or the crossover year.</p>',
              '<p>Do not write every number in order. That is a list, and the examiner calls it mechanical.</p>',
              '<p>Every number you keep must be correct. Use <em>approximately</em> if you cannot read it exactly.</p>'
            ],
            examples: [
              { s: 'Online sales climbed from $2 million in 2012 to $9 million in 2022, passing store sales in 2018.', g: 'Two features, three figures.' },
              { s: '<s>Online sales were $2 million in 2012, $3 million in 2014, $4.5 million in 2016 and $6 million in 2018.</s>', g: 'Four figures, no feature.' },
              { s: 'The cheapest ticket, at $12, cost less than a fifth of the most expensive, at $65.', g: 'The gap illustrated with its two ends and a fraction.' }
            ]
          },
          items: [
            { id: 'm13s3q1', type: 'choose', tag: 'ta-mechanical', level: 'B1', chart: 'p-line-museums',
              stem: 'Which sentence illustrates the Science Museum feature rather than listing figures?',
              options: [
                'In 2010 it had 420,000, in 2012 470,000, in 2014 570,000 and in 2016 630,000 visitors.',
                'It rose from 420,000 in 2010 to 760,000 in 2020, passing the Art Gallery in 2014.',
                'The Science Museum rose, the Art Gallery fell and the History Museum fell.',
                'The Science Museum grew because science became interesting for young people.'
              ], answer: 1,
              hint: 'Compare how many figures each option uses, and what those figures show about the Science Museum.',
              why: 'Start, end and the crossover: three figures that prove the rise. Option A lists, option C has no data, and option D invents a reason.' },
            { id: 'm13s3q2', type: 'choose', tag: 'ta-selection', level: 'B1', chart: 'p-bar-screentime',
              stem: 'Feature: social media time fell sharply with age. Which pair of figures illustrates it best?',
              options: [
                '18 hours for 18–29 and 11 hours for 30–49',
                '14 hours streaming and 12 hours gaming for 13–17',
                '15 hours streaming for 18–29 and 13 for 50+',
                '21 hours for 13–17 and six hours for 50+'
              ], answer: 3,
              hint: 'Check which activity and which age groups each pair of figures comes from.',
              why: 'The two ends of the range show the fall most clearly: 21 down to six. The middle pair shows only part of it, and the other options are about different activities.' },
            { id: 'm13s3q3', type: 'choose', tag: 'ta-selection', level: 'B2', chart: 'p-pie-energy',
              stem: 'Feature: wind and solar grew from a minor source into a major one. Which figures illustrate it?',
              options: [
                '15% nuclear in 2000 and 14% in 2020',
                '10% hydro in 2000 and 11% in 2020',
                '22% gas in 2000 and 30% in 2020',
                '5% in 2000 and 27% in 2020'
              ], answer: 3,
              hint: 'Read both pies and check which pair of figures really shows a minor source becoming a major one.',
              why: 'The feature is about wind and solar, so the evidence must be their two shares. From 5% to 27% is more than five times, and that multiple is worth stating.' },
            { id: 'm13s3q4', type: 'judge', tag: 'ta-mechanical', level: 'B2', chart: 'p-table-rice',
              given: 'China produced 188, 197 and 212 million tonnes; India 127, 144 and 178; Vietnam 32, 40 and 43; Thailand 26, 36 and 30.',
              stem: 'True or false: this sentence illustrates the key features of the table.',
              answer: 1,
              hint: 'Compare this sentence with the rice table. Then think about what illustrating a feature means.',
              why: 'It copies all twelve cells and states no feature. Illustrate instead: <em>China led throughout, rising from 188 to 212 million tonnes, while Thailand alone fell after 2010, from 36 to 30.</em>' },
            { id: 'm13s3q5', type: 'choose', tag: 'ta-mechanical', level: 'B2', chart: 'p-table-salaries',
              stem: 'Feature: Thai teachers earned far less than all the others. Which sentence illustrates it best?',
              options: [
                'Thailand\'s starting salary of $9,000 was less than a sixth of Germany\'s $62,000.',
                'Thai teachers earned $9,000, then $17,000, and worked 45 hours a week.',
                'Thailand earned $9,000 and $17,000; Germany $62,000 and $81,000; Japan $31,000 and $55,000.',
                'Thai teachers earned very little compared with teachers in the other countries.'
              ], answer: 0,
              hint: 'Picture the gap between Thailand and the other countries. Which option lets a reader see that gap most quickly?',
              why: 'Two figures and a fraction make the gap visible. Option B lists Thailand\'s row, option C lists three rows, and option D has no data at all.' },
            { id: 'm13s3q6', type: 'judge', tag: 'ta-inaccurate', level: 'B2', chart: 'p-bar-tourists',
              given: 'By 2025 arrivals had recovered to 36.5 million, slightly above the 2019 peak.',
              stem: 'Is this an accurate illustration of the recovery?',
              answer: 1,
              hint: 'Find the 2019 and 2025 bars and compare them. Then read the whole sentence again, word by word.',
              why: 'The figure is right but the comparison is wrong: 36.5 million is below the 39.9 million peak, not above it. Write <em>close to</em> or <em>just under</em> the 2019 peak.' },
            { id: 'm13s3q7', type: 'choose', tag: 'ta-selection', level: 'C1', chart: 'p-line-cities',
              stem: 'Feature: Lagos is projected to overtake Osaka. Which figures illustrate the crossover?',
              options: [
                'Osaka 19.3 million in 2010 and 18.6 million in 2030',
                'Lagos 4.8 million in 1990 and Bangkok 7.4 million',
                'Lagos 19.0 million and Osaka 18.6 million in 2030',
                'Bangkok 12.6 million in 2040'
              ], answer: 2,
              hint: 'Find where the Lagos and Osaka lines cross. Then check which figures in the options really show that moment.',
              why: 'A crossover is illustrated by the year the lines change places and both values in that year. In 2030 Lagos is projected to pass Osaka for the first time.' }
          ] }
      ],
      check: { id: 'm13ck', name: 'Systems Check', items: [
        { id: 'm13ckq1', type: 'judge', tag: 'ta-selection', level: 'B1', chart: 'p-bar-homework',
          given: 'Thai had the least homework in all three year groups.',
          stem: 'Is this a key feature of the chart?',
          answer: 0,
          hint: 'Look at the Thai bars in every year group. Does the pattern hold in all three groups?',
              why: 'The smallest category, true across every group, is a feature. Thai never rose above two hours while every other subject was at least two.' },
        { id: 'm13ckq2', type: 'judge', tag: 'ta-selection', level: 'B1', chart: 'p-bar-homework',
          given: 'M4 students did three hours of English homework.',
          stem: 'Is this a key feature of the chart?',
          answer: 1,
          hint: 'Find this bar on the chart. Then think about the difference between a key feature and evidence for one.',
              why: 'One bar. It could illustrate a feature about English, but on its own it summarises nothing.' },
        { id: 'm13ckq3', type: 'select', tag: 'ta-selection', level: 'B2', chart: 'p-pie-budget',
          stem: 'Tick the four key features of the pie chart.',
          options: [
            'Clothes was 12%',
            'Savings was by far the smallest share',
            'Food and drinks was the largest category, at 38%',
            'Students should save more',
            'Phone, clothes and entertainment were each between 9% and 15%',
            'Six categories are shown',
            'Transport was 22%',
            'Food and transport together made up over half'
          ], answers: [1, 2, 4, 7], k: 4,
          hint: 'Look at the whole pie: the biggest slices, the smallest and any groups. Which options describe those?',
              why: 'Largest, smallest, the combined share of the top two and the middle group: that is a whole pie chart in four features. Single slices, a count and an opinion are not features.' },
        { id: 'm13ckq4', type: 'select', tag: 'ta-selection', level: 'B2', chart: 'p-proc-glass',
          stem: 'Tick the four key features of the process.',
          options: [
            'It begins with collection of used bottles and ends with new bottles delivered to shops',
            'Lorries are used',
            'The furnace is hot',
            'The process is cyclical and man-made, with eight stages',
            'Bottles are round',
            'The glass is melted at 600–800 °C with new raw materials',
            'The stages fall into two phases: preparing the waste glass and making the new product',
            'Green glass is prettier'
          ], answers: [0, 3, 5, 6], k: 4,
          hint: 'Think about the four things a process overview names, and whether any condition on the diagram is important enough to report.',
              why: 'For a process the features are shape, number of stages, start and end, the main phases and any key condition such as the temperature. Small details and opinions are not.' },
        { id: 'm13ckq5', type: 'choose', tag: 'ta-mechanical', level: 'B2', chart: 'p-line-internet',
          stem: 'Which sentence lists instead of illustrating?',
          options: [
            'Sweden had 70% in 2005, 85% in 2010, 92% in 2015 and 97% in 2025.',
            'Sweden rose from 70% in 2005 to 97% in 2025, remaining the highest of the four.',
            'Sweden and Japan both passed 90% by 2020 and ended almost level.',
            'Thailand climbed from just 12% to 88%, the biggest rise of the four.'
          ], answer: 0,
          hint: 'Read each sentence and ask what the reader learns about the countries from it.',
              why: 'Four readings and no feature. The other three each state a feature and prove it with two figures.' },
        { id: 'm13ckq6', type: 'judge', tag: 'ta-overview-vague', level: 'B2', chart: 'p-table-rice',
          given: 'Overall, the table shows some changes in the amount of rice produced in the four countries.',
          stem: 'Is this a clear statement of a key feature?',
          answer: 1,
          hint: 'Compare the sentence with the rice table. What exactly does it tell the reader about the four countries?',
              why: 'It could be written without looking at the table. Say what changed: China led throughout, India grew most, and Thailand alone fell after 2010.' },
        { id: 'm13ckq7', type: 'choose', tag: 'ta-inaccurate', level: 'B2', chart: 'p-pie-holidays',
          stem: 'Which statement about the pie charts is accurate?',
          options: [
            'South-East Asia rose from 22% to 31%',
            'Korea nearly doubled, from 9% to 17%',
            'Europe grew slightly, from 11% to 14%',
            'China\'s share stayed the same at 6%'
          ], answer: 1,
          hint: 'Check the direction of each change: which number belongs to 2010 and which to 2024?',
              why: 'South-East Asia and Europe both fell, and it was the "other" slice, not China, that stayed at 6%. A well-chosen feature is worthless if the direction is wrong.' },
        { id: 'm13ckq8', type: 'choose', tag: 'ta-selection', level: 'B2', chart: 'p-line-clubs',
          stem: 'Feature: esports overtook football. Which figures illustrate it?',
          options: ['Football 120 in 2016 and 120 in 2024', 'Badminton 40 in 2020 and 85 in 2024', 'Esports 130 and football 124 in 2023', 'Esports 150 in 2024 and football 120 in 2016'], answer: 2,
          hint: 'A crossover needs the right year and both values. Read the esports and football lines year by year where they meet.',
              why: 'A crossover needs the year and both values. In 2022 esports still trailed football (110 to 121); in 2023 it moved ahead, 130 to 124.' }
      ] }
    }]
  });
})();
