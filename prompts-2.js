/* ===========================================================================
   CHART CONTROL — prompts-2.js
   Second batch of the Task 1 prompt bank (26 original prompts). Same shapes
   as prompts.js. Together the bank holds 8 line, 8 bar, 6 pie, 6 table,
   4 mixed, 4 process and 4 map prompts.
   =========================================================================== */
(function () {
  var P = window.CONTENT.PROMPTS;

  /* ------------------------------------------------------------ line */
  P.push({
    id: 'p-line-phones', type: 'line', mode: 'TREND', level: 'A2',
    title: 'Teenagers\' phones', units: '% of teenagers',
    rubric: 'The line graph shows the percentage of teenagers in one country who owned a smartphone and the percentage who owned a basic mobile phone between 2010 and 2025.',
    data: { x: [2010, 2013, 2016, 2019, 2022, 2025], series: [
      { name: 'Smartphone', values: [10, 30, 60, 80, 90, 95] },
      { name: 'Basic phone', values: [80, 65, 40, 20, 10, 5] } ] },
    labels: ['Smartphone', 'Basic phone'],
    keyFeatures: ['Smartphone ownership rose sharply while basic phone ownership fell', 'The two lines crossed between 2013 and 2016', 'By 2025 almost every teenager owned a smartphone and very few owned a basic phone', 'The two trends were almost mirror images of each other'],
    distractorFeatures: ['Basic phone ownership was 65% in 2013', 'Smartphones are better than basic phones', 'Teenagers bought smartphones because they became cheaper', 'Smartphone ownership fell slightly in 2022'],
    groupings: [['Smartphone'], ['Basic phone']],
    tags: ['crossover', 'mirror', 'two-lines']
  });

  P.push({
    id: 'p-line-clubs', type: 'line', mode: 'TREND', level: 'B1',
    title: 'School club membership', units: 'members',
    rubric: 'The line graph shows the number of students who belonged to three clubs at one secondary school each year between 2016 and 2024.',
    data: { x: [2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024], series: [
      { name: 'Football', values: [120, 125, 118, 122, 120, 115, 121, 124, 120] },
      { name: 'Badminton', values: [90, 85, 70, 55, 40, 45, 60, 75, 85] },
      { name: 'Esports', values: [0, 0, 15, 40, 70, 95, 110, 130, 150] } ] },
    labels: ['Football', 'Badminton', 'Esports'],
    keyFeatures: ['Football membership stayed almost flat throughout', 'The esports club grew from nothing to become the largest club', 'Esports overtook football in 2023', 'Badminton fell to a low in 2020 and then recovered most of its members'],
    distractorFeatures: ['Badminton had 55 members in 2019', 'Esports is more exciting than football', 'Badminton fell because the courts were closed', 'Football membership doubled over the period'],
    groupings: [['Esports', 'Badminton'], ['Football']],
    modelId: 'm-line-clubs', tags: ['crossover', 'collapse', 'recovery', 'flat']
  });

  P.push({
    id: 'p-line-air', type: 'line', mode: 'TREND', level: 'B2',
    title: 'Air pollution in three cities', units: 'micrograms per cubic metre',
    rubric: 'The line graph shows the average annual level of fine dust (PM2.5) in the air in three Asian cities between 2012 and 2024.',
    data: { x: [2012, 2014, 2016, 2018, 2020, 2022, 2024], series: [
      { name: 'Beijing', values: [92, 85, 73, 51, 38, 31, 27] },
      { name: 'Bangkok', values: [24, 26, 25, 29, 23, 28, 30] },
      { name: 'Tokyo', values: [15, 14, 13, 12, 11, 10, 10] } ] },
    labels: ['Beijing', 'Bangkok', 'Tokyo'],
    keyFeatures: ['Beijing\'s pollution fell dramatically to less than a third of its 2012 level', 'Bangkok fluctuated but ended slightly higher than it began', 'Tokyo was the cleanest city throughout and declined gently', 'By 2024 Beijing had fallen below Bangkok for the first time'],
    distractorFeatures: ['Bangkok recorded 29 micrograms in 2018', 'Beijing improved because factories were closed', 'Tokyo is a pleasant city to live in', 'Bangkok\'s air quality improved steadily'],
    groupings: [['Beijing', 'Tokyo'], ['Bangkok']],
    tags: ['collapse', 'crossover', 'fluctuate']
  });

  P.push({
    id: 'p-line-music', type: 'line', mode: 'TREND', level: 'B2',
    title: 'Music sales by format', units: 'million dollars',
    rubric: 'The line graph shows the revenue from recorded music in one country by format between 2010 and 2022, with projections to 2030.',
    data: { x: [2010, 2014, 2018, 2022, 2026, 2030], projectedFrom: 2022, series: [
      { name: 'Streaming', values: [20, 120, 400, 620, 720, 780] },
      { name: 'CDs', values: [520, 340, 170, 80, 45, 30] },
      { name: 'Downloads', values: [180, 250, 150, 60, 25, 10] },
      { name: 'Vinyl', values: [5, 15, 35, 60, 80, 95] } ] },
    labels: ['Streaming', 'CDs', 'Downloads', 'Vinyl'],
    keyFeatures: ['Streaming grew from almost nothing to dominate the market', 'CD revenue collapsed and is projected to keep falling', 'Downloads rose to a peak in 2014 and then declined', 'Vinyl was the only physical format that grew, and is expected to overtake CDs and downloads'],
    distractorFeatures: ['Downloads earned $250 million in 2014', 'Streaming is more convenient than CDs', 'Vinyl became fashionable among young people', 'CD sales recovered after 2022'],
    groupings: [['Streaming', 'Vinyl'], ['CDs', 'Downloads']],
    tags: ['projection', 'crossover', 'peak']
  });

  P.push({
    id: 'p-line-ev', type: 'line', mode: 'TREND', level: 'C1',
    title: 'Electric car sales', units: '% of new cars sold',
    rubric: 'The line graph shows the percentage of new cars sold that were fully electric in five countries between 2015 and 2025.',
    data: { x: [2015, 2017, 2019, 2021, 2023, 2025], series: [
      { name: 'Norway', values: [22.4, 29.1, 39.2, 55.9, 74.8, 88.1] },
      { name: 'China', values: [1.0, 2.2, 4.7, 6.2, 25.6, 47.9] },
      { name: 'Thailand', values: [0.1, 0.2, 0.4, 1.1, 9.8, 18.5] },
      { name: 'Japan', values: [0.6, 1.0, 0.9, 1.0, 1.7, 3.6] },
      { name: 'India', values: [0.1, 0.1, 0.2, 0.4, 1.3, 2.5] } ] },
    labels: ['Norway', 'China', 'Thailand', 'Japan', 'India'],
    keyFeatures: ['Norway was far ahead of the others throughout and approached 90% by 2025', 'China and Thailand stayed low until 2021 and then rose steeply', 'Japan and India stayed below 4% for the whole period', 'The gap between the leading three and the other two widened sharply after 2021'],
    distractorFeatures: ['Thailand reached 9.8% in 2023', 'Norway has cold winters', 'Electric cars became popular because of government subsidies', 'Japan\'s figure fell steadily'],
    groupings: [['Norway', 'China', 'Thailand'], ['Japan', 'India']],
    tags: ['five-lines', 'late-surge', 'flat']
  });

  /* ------------------------------------------------------------- bar */
  P.push({
    id: 'p-bar-activities', type: 'bar', mode: 'COMPARE', level: 'A2',
    title: 'After-school activities', units: 'students',
    rubric: 'The bar chart shows the number of boys and girls at one school who chose three after-school activities in 2024.',
    data: { categories: ['Sport', 'Music', 'Coding'], series: [
      { name: 'Boys', values: [60, 25, 40] },
      { name: 'Girls', values: [45, 50, 20] } ] },
    labels: ['Sport', 'Music', 'Coding', 'Boys', 'Girls'],
    keyFeatures: ['Sport was the most popular activity overall and the top choice for boys', 'Music was the top choice for girls', 'Twice as many boys as girls chose coding', 'Girls outnumbered boys only in music'],
    distractorFeatures: ['25 boys chose music', 'Girls prefer music because it is relaxing', 'Boys are better at coding', 'Three activities are shown'],
    groupings: [['Sport', 'Coding'], ['Music']],
    tags: ['grouped', 'static']
  });

  P.push({
    id: 'p-bar-costs', type: 'bar', mode: 'COMPARE', level: 'C1',
    title: 'Student living costs in six cities', units: 'US dollars per month',
    rubric: 'The bar chart shows the average monthly amount that university students spent on rent, food and transport in six Asian cities in 2024.',
    data: { categories: ['Singapore', 'Tokyo', 'Seoul', 'Kuala Lumpur', 'Bangkok', 'Hanoi'], series: [
      { name: 'Rent', values: [1150, 780, 620, 290, 310, 240] },
      { name: 'Food', values: [420, 390, 360, 190, 210, 170] },
      { name: 'Transport', values: [85, 95, 60, 55, 45, 30] } ] },
    labels: ['Rent', 'Food', 'Transport', 'Singapore', 'Tokyo', 'Seoul', 'Kuala Lumpur', 'Bangkok', 'Hanoi'],
    keyFeatures: ['Rent was the largest cost in every city and varied far more than the other two', 'Singapore was the most expensive city for rent and food, while Hanoi was the cheapest on all three measures', 'The three South-East Asian cities were much cheaper than Singapore, Tokyo and Seoul', 'Tokyo, not Singapore, had the highest transport costs'],
    distractorFeatures: ['Students in Seoul spent $360 on food', 'Singapore is expensive because it is a small island', 'Students should cook at home to save money', 'Transport cost more than food in Tokyo'],
    groupings: [['Singapore', 'Tokyo', 'Seoul'], ['Kuala Lumpur', 'Bangkok', 'Hanoi']],
    tags: ['grouped', 'static', 'exception']
  });

  P.push({
    id: 'p-bar-emoto', type: 'bar', mode: 'TREND', level: 'A2',
    title: 'Electric motorbike sales', units: 'thousand motorbikes',
    rubric: 'The bar chart shows the number of electric motorbikes sold in one city between 2019 and 2025.',
    data: { categories: [2019, 2020, 2021, 2022, 2023, 2024, 2025], series: [
      { name: 'Electric motorbikes sold', values: [2, 3, 5, 9, 16, 28, 45] } ] },
    labels: ['electric motorbikes'],
    keyFeatures: ['Sales rose every single year', 'Growth was slow at first and then accelerated', 'Sales in 2025 were more than twenty times the 2019 figure', 'The largest increase came in the final year'],
    distractorFeatures: ['Nine thousand motorbikes were sold in 2022', 'Electric motorbikes are quieter than petrol ones', 'Sales rose because petrol became expensive', 'Sales fell in 2021'],
    groupings: [['2019', '2020', '2021', '2022'], ['2023', '2024', '2025']],
    tags: ['single-series', 'accelerating', 'all-rise']
  });

  P.push({
    id: 'p-bar-bags', type: 'bar', mode: 'TREND', level: 'B1',
    title: 'Plastic bags used by a supermarket chain', units: 'million bags',
    rubric: 'The bar chart shows the number of single-use plastic bags given to customers by one supermarket chain each year between 2016 and 2024.',
    data: { categories: [2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024], series: [
      { name: 'Plastic bags', values: [92, 95, 97, 60, 35, 28, 25, 22, 20] } ] },
    labels: ['plastic bags'],
    keyFeatures: ['Bag use was high and rising slightly until 2018', 'There was a dramatic collapse between 2018 and 2020', 'After 2020 the decline continued but much more slowly', 'By 2024 the figure was roughly a fifth of the 2018 peak'],
    distractorFeatures: ['The chain gave out 35 million bags in 2020', 'The fall was caused by a government ban', 'Plastic bags are bad for the sea', 'Bag use rose again in 2023'],
    groupings: [['2016', '2017', '2018'], ['2019', '2020', '2021', '2022', '2023', '2024']],
    tags: ['single-series', 'collapse', 'level-off']
  });

  P.push({
    id: 'p-bar-languages', type: 'bar', mode: 'TREND', level: 'B2',
    title: 'Foreign languages studied at secondary school', units: 'thousand students',
    rubric: 'The bar chart shows the number of secondary school students studying three foreign languages in one country in 2010, 2015, 2020 and 2025.',
    data: { categories: [2010, 2015, 2020, 2025], series: [
      { name: 'Chinese', values: [40, 60, 85, 110] },
      { name: 'Japanese', values: [60, 62, 65, 63] },
      { name: 'French', values: [50, 42, 32, 25] } ] },
    labels: ['Chinese', 'Japanese', 'French'],
    keyFeatures: ['Chinese grew strongly and became the most studied language', 'Japanese remained almost unchanged throughout', 'French lost half of its students', 'Chinese overtook Japanese between 2015 and 2020'],
    distractorFeatures: ['65,000 students studied Japanese in 2020', 'Chinese is useful for business', 'French is difficult to pronounce', 'Japanese fell sharply after 2020'],
    groupings: [['Chinese'], ['Japanese', 'French']],
    tags: ['grouped', 'time-series', 'crossover', 'flat']
  });

  /* ------------------------------------------------------------- pie */
  P.push({
    id: 'p-pie-waste', type: 'pie', mode: 'COMPARE', level: 'B1',
    title: 'Household waste', units: '%',
    rubric: 'The pie chart shows the composition of household waste collected in one city in 2023.',
    data: { charts: [
      { title: 'Household waste, 2023', slices: [{ name: 'Food', value: 42 }, { name: 'Plastic', value: 21 }, { name: 'Paper', value: 14 }, { name: 'Glass', value: 7 }, { name: 'Metal', value: 4 }, { name: 'Other', value: 12 }] } ] },
    labels: ['Food', 'Plastic', 'Paper', 'Glass', 'Metal', 'Other'],
    keyFeatures: ['Food was by far the largest category, at over two fifths', 'Food and plastic together made up almost two thirds of all waste', 'Glass and metal were the smallest categories', 'Paper was exactly twice the share of glass'],
    distractorFeatures: ['Paper was 14%', 'People waste too much food', 'Plastic should be recycled', 'Six categories are shown'],
    groupings: [['Food', 'Plastic'], ['Paper', 'Glass', 'Metal', 'Other']],
    tags: ['single-pie', 'static']
  });

  P.push({
    id: 'p-pie-school-travel', type: 'pie', mode: 'TREND', level: 'A2',
    title: 'How students travel to school', units: '%',
    rubric: 'The pie charts show how students at one school in Thailand travelled to school in 2005 and in 2025.',
    data: { charts: [
      { title: '2005', slices: [{ name: 'Walking', value: 50 }, { name: 'Motorbike', value: 30 }, { name: 'Car', value: 20 }] },
      { title: '2025', slices: [{ name: 'Walking', value: 20 }, { name: 'Motorbike', value: 45 }, { name: 'Car', value: 35 }] } ] },
    labels: ['Walking', 'Motorbike', 'Car'],
    keyFeatures: ['Walking fell from half of students to a fifth', 'Motorbike became the most common way to travel', 'Car travel rose considerably', 'By 2025 four out of five students used a vehicle'],
    distractorFeatures: ['Car was 20% in 2005', 'Students are lazier than before', 'Walking is healthy', 'Three ways of travelling are shown'],
    groupings: [['Walking'], ['Motorbike', 'Car']],
    tags: ['two-pies', 'change']
  });

  P.push({
    id: 'p-pie-holidays', type: 'pie', mode: 'TREND', level: 'B2',
    title: 'Overseas holiday destinations', units: '%',
    rubric: 'The pie charts show the destinations of overseas trips made by residents of one Asian country in 2010 and in 2024.',
    data: { charts: [
      { title: '2010', slices: [{ name: 'South-East Asia', value: 31 }, { name: 'China', value: 28 }, { name: 'Europe', value: 14 }, { name: 'Japan', value: 12 }, { name: 'Korea', value: 9 }, { name: 'Other', value: 6 }] },
      { title: '2024', slices: [{ name: 'South-East Asia', value: 22 }, { name: 'China', value: 10 }, { name: 'Europe', value: 11 }, { name: 'Japan', value: 34 }, { name: 'Korea', value: 17 }, { name: 'Other', value: 6 }] } ] },
    labels: ['South-East Asia', 'China', 'Europe', 'Japan', 'Korea', 'Other'],
    keyFeatures: ['Japan almost tripled its share and became the leading destination', 'China lost nearly two thirds of its share', 'Korea nearly doubled while South-East Asia and Europe declined', 'The share for other destinations did not change'],
    distractorFeatures: ['Europe was 14% in 2010', 'Japan became popular because of social media', 'Korea has good food', 'Six destinations are shown'],
    groupings: [['Japan', 'Korea'], ['South-East Asia', 'China', 'Europe']],
    modelId: 'm-pie-holidays', tags: ['two-pies', 'change', 'crossover']
  });

  P.push({
    id: 'p-pie-university', type: 'pie', mode: 'TREND', level: 'C1',
    title: 'Sources of a university\'s income', units: '%',
    rubric: 'The pie charts show the sources of income of one public university in 2000, 2012 and 2024.',
    data: { charts: [
      { title: '2000', slices: [{ name: 'Government funding', value: 62 }, { name: 'Tuition fees', value: 20 }, { name: 'Research grants', value: 10 }, { name: 'Donations', value: 5 }, { name: 'Other', value: 3 }] },
      { title: '2012', slices: [{ name: 'Government funding', value: 48 }, { name: 'Tuition fees', value: 29 }, { name: 'Research grants', value: 12 }, { name: 'Donations', value: 7 }, { name: 'Other', value: 4 }] },
      { title: '2024', slices: [{ name: 'Government funding', value: 31 }, { name: 'Tuition fees', value: 38 }, { name: 'Research grants', value: 14 }, { name: 'Donations', value: 9 }, { name: 'Other', value: 8 }] } ] },
    labels: ['Government funding', 'Tuition fees', 'Research grants', 'Donations', 'Other'],
    keyFeatures: ['Government funding halved and lost its position as the main source', 'Tuition fees nearly doubled and overtook government funding by 2024', 'Research grants, donations and other income all grew slowly', 'The university became far less dependent on a single source'],
    distractorFeatures: ['Donations were 7% in 2012', 'The government should fund universities properly', 'Tuition fees rose because the government cut its budget', 'Research grants fell after 2012'],
    groupings: [['Government funding', 'Tuition fees'], ['Research grants', 'Donations', 'Other']],
    tags: ['three-pies', 'change', 'crossover']
  });

  /* ----------------------------------------------------------- table */
  P.push({
    id: 'p-table-phones', type: 'table', mode: 'COMPARE', level: 'B1',
    title: 'Five smartphones compared', units: 'various',
    rubric: 'The table shows the price, battery life, screen size and weight of five smartphone models on sale in 2024.',
    data: { cols: ['Model', 'Price ($)', 'Battery life (hours)', 'Screen size (inches)', 'Weight (g)'], rows: [
      ['Alpha 12', 1100, 22, 6.7, 221], ['Orbit Max', 940, 34, 6.9, 238], ['Nova S', 850, 26, 6.1, 172], ['Pixelite 4', 620, 30, 6.4, 188], ['Zen Lite', 260, 18, 6.0, 165] ] },
    labels: ['Alpha 12', 'Orbit Max', 'Nova S', 'Pixelite 4', 'Zen Lite'],
    keyFeatures: ['The Alpha 12 was the most expensive but had the second shortest battery life', 'The Zen Lite was the cheapest and lightest but had the shortest battery life', 'The Orbit Max had the longest battery and the largest screen but was also the heaviest', 'Larger screens generally meant heavier phones'],
    distractorFeatures: ['The Nova S weighed 172 grams', 'The Orbit Max is the best phone', 'Expensive phones have better cameras', 'The Pixelite 4 had the largest screen'],
    groupings: [['Alpha 12', 'Orbit Max', 'Nova S'], ['Pixelite 4', 'Zen Lite']],
    tags: ['static', 'multi-column']
  });

  P.push({
    id: 'p-table-sleep', type: 'table', mode: 'COMPARE', level: 'C1',
    title: 'Sleep and study habits of 15-year-olds', units: 'various',
    rubric: 'The table shows the average sleep and homework time on school nights, the percentage of students who keep a phone in the bedroom, and the percentage who feel tired every day, for 15-year-olds in five countries in 2023.',
    data: { cols: ['Country', 'Sleep (hours)', 'Homework (hours)', 'Phone in bedroom (%)', 'Tired every day (%)'], rows: [
      ['Korea', 6.1, 3.4, 88, 71], ['Japan', 6.3, 2.1, 79, 64], ['Thailand', 7.2, 2.6, 91, 52], ['Australia', 8.1, 1.5, 68, 33], ['Finland', 8.4, 1.2, 72, 29] ] },
    labels: ['Korea', 'Japan', 'Thailand', 'Australia', 'Finland'],
    keyFeatures: ['Students who slept least were the most likely to feel tired every day', 'Korean students slept the least and did the most homework', 'Finnish and Australian students slept over eight hours and were the least tired', 'Thai students had the highest rate of phones in the bedroom but only a middling level of tiredness'],
    distractorFeatures: ['Japanese students did 2.1 hours of homework', 'Korean schools give too much homework', 'Phones in bedrooms cause poor sleep', 'Finnish students did the most homework'],
    groupings: [['Korea', 'Japan', 'Thailand'], ['Australia', 'Finland']],
    tags: ['static', 'multi-column', 'exception']
  });

  P.push({
    id: 'p-table-schools', type: 'table', mode: 'TREND', level: 'A2',
    title: 'Students at three schools', units: 'students',
    rubric: 'The table shows the number of students at three secondary schools in one town in 2010, 2015, 2020 and 2025.',
    data: { cols: ['School', '2010', '2015', '2020', '2025'], rows: [
      ['Riverside School', 800, 900, 1000, 1100], ['Hilltop School', 600, 600, 600, 600], ['Lakeside School', 1200, 1100, 900, 700] ] },
    labels: ['Riverside School', 'Hilltop School', 'Lakeside School'],
    keyFeatures: ['Riverside grew steadily while Lakeside shrank', 'Hilltop stayed exactly the same size', 'Riverside overtook Lakeside between 2015 and 2020', 'Lakeside lost over two fifths of its students'],
    distractorFeatures: ['Riverside had 900 students in 2015', 'Lakeside is a bad school', 'Riverside grew because it built new classrooms', 'Hilltop grew slowly'],
    groupings: [['Riverside School', 'Lakeside School'], ['Hilltop School']],
    tags: ['years-in-columns', 'crossover', 'flat']
  });

  P.push({
    id: 'p-table-rent', type: 'table', mode: 'TREND', level: 'B2',
    title: 'Apartment rents in four Asian cities', units: 'US dollars per month',
    rubric: 'The table shows the average monthly rent for a one-room apartment in four Asian cities in 2010, 2015, 2020 and 2025 (in US dollars).',
    data: { cols: ['City', '2010', '2015', '2020', '2025'], rows: [
      ['Singapore', 1450, 1700, 1900, 2350], ['Tokyo', 980, 960, 990, 1010], ['Bangkok', 320, 410, 520, 540], ['Ho Chi Minh City', 210, 290, 430, 560] ] },
    labels: ['Singapore', 'Tokyo', 'Bangkok', 'Ho Chi Minh City'],
    keyFeatures: ['Singapore was by far the most expensive city throughout', 'Rents in Tokyo barely changed', 'Ho Chi Minh City had the lowest rent in 2010 but overtook Bangkok by 2025', 'Rents in the two South-East Asian cities roughly doubled or more'],
    distractorFeatures: ['Bangkok\'s rent was $410 in 2015', 'Singapore is expensive because land is limited', 'Tokyo rents fell every year', 'Four cities are compared'],
    groupings: [['Singapore', 'Tokyo'], ['Bangkok', 'Ho Chi Minh City']],
    modelId: 'm-table-rent', tags: ['years-in-columns', 'crossover', 'flat']
  });

  /* ----------------------------------------------------------- mixed */
  P.push({
    id: 'p-mixed-park', type: 'mixed', mode: 'TREND', level: 'B1',
    title: 'Visitors to a national park', units: '',
    rubric: 'The line graph shows the number of Thai and foreign visitors to one national park between 2015 and 2025, and the pie chart shows where the foreign visitors came from in 2025.',
    data: { parts: [
      { type: 'line', title: 'Visitors (thousands)', units: 'thousand visitors', data: { x: [2015, 2017, 2019, 2021, 2023, 2025], series: [
        { name: 'Thai visitors', values: [120, 140, 150, 210, 230, 240] },
        { name: 'Foreign visitors', values: [180, 210, 240, 20, 150, 220] } ] } },
      { type: 'pie', title: 'Origin of foreign visitors, 2025', units: '%', data: { charts: [
        { title: '2025', slices: [{ name: 'China', value: 32 }, { name: 'Europe', value: 26 }, { name: 'Other Asia', value: 24 }, { name: 'Americas', value: 10 }, { name: 'Other', value: 8 }] } ] } } ] },
    labels: ['Thai visitors', 'Foreign visitors', 'China', 'Europe', 'Other Asia', 'Americas', 'Other'],
    keyFeatures: ['Thai visitor numbers doubled over the period', 'Foreign visitors collapsed in 2021 and then recovered almost to their 2019 level', 'Thai visitors overtook foreign visitors in 2021 and stayed ahead', 'In 2025 China and Europe supplied well over half of foreign visitors'],
    distractorFeatures: ['There were 150,000 foreign visitors in 2023', 'Foreign visitors fell because of the pandemic', 'The park is beautiful', 'Europe was 26%'],
    groupings: [['Thai visitors', 'Foreign visitors'], ['China', 'Europe', 'Other Asia', 'Americas', 'Other']],
    tags: ['two-visuals', 'collapse', 'recovery']
  });

  P.push({
    id: 'p-mixed-gym', type: 'mixed', mode: 'COMPARE', level: 'B2',
    title: 'Fitness club members by age', units: '',
    rubric: 'The bar chart shows the number of members of a fitness club chain in one country by age group in 2024, and the table shows the average number of visits per month and the average monthly fee paid by each age group.',
    data: { parts: [
      { type: 'bar', title: 'Members (thousands)', units: 'thousand members', data: { categories: ['Under 18', '18–29', '30–44', '45–59', '60+'], series: [{ name: 'Members', values: [12, 58, 46, 25, 9] }] } },
      { type: 'table', title: 'Visits and fees', units: '', data: { cols: ['Age group', 'Visits per month', 'Monthly fee ($)'], rows: [['Under 18', 9, 18], ['18–29', 6, 32], ['30–44', 8, 38], ['45–59', 11, 35], ['60+', 14, 20]] } } ] },
    labels: ['Under 18', '18–29', '30–44', '45–59', '60+'],
    keyFeatures: ['People aged 18 to 44 made up over two thirds of members', 'The over-60s were the smallest group but visited most often', 'The largest group, 18–29, visited least often', 'The youngest and oldest groups paid the lowest fees'],
    distractorFeatures: ['There were 25,000 members aged 45–59', 'Older people have more free time', 'Young people are too busy to exercise', 'Five age groups are shown'],
    groupings: [['18–29', '30–44'], ['Under 18', '45–59', '60+']],
    tags: ['two-visuals', 'exception']
  });

  P.push({
    id: 'p-mixed-plastic', type: 'mixed', mode: 'TREND', level: 'C1',
    title: 'Plastic bottle recycling', units: '',
    rubric: 'The bar chart shows the amount of plastic bottles collected for recycling in one country between 2016 and 2024, and the pie chart shows what happened to the collected plastic in 2024.',
    data: { parts: [
      { type: 'bar', title: 'Bottles collected (thousand tonnes)', units: 'thousand tonnes', data: { categories: [2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024], series: [{ name: 'Collected', values: [42, 48, 55, 61, 58, 70, 83, 95, 104] }] } },
      { type: 'pie', title: 'Use of collected plastic, 2024', units: '%', data: { charts: [
        { title: '2024', slices: [{ name: 'New bottles', value: 38 }, { name: 'Textiles', value: 27 }, { name: 'Exported', value: 19 }, { name: 'Landfill', value: 11 }, { name: 'Energy recovery', value: 5 }] } ] } } ] },
    labels: ['collected', 'New bottles', 'Textiles', 'Exported', 'Landfill', 'Energy recovery'],
    keyFeatures: ['The amount collected rose in every year except 2020 and more than doubled overall', 'Growth accelerated after 2020', 'Almost two thirds of the collected plastic was turned into new bottles or textiles', 'Around one sixth of the collected plastic was not recycled but went to landfill or was burned'],
    distractorFeatures: ['83,000 tonnes were collected in 2022', 'Recycling is good for the environment', 'Collection fell in 2020 because of lockdowns', 'Exported plastic was 19%'],
    groupings: [['collected'], ['New bottles', 'Textiles', 'Exported', 'Landfill', 'Energy recovery']],
    tags: ['two-visuals', 'dip', 'all-rise']
  });

  /* --------------------------------------------------------- process */
  P.push({
    id: 'p-proc-noodles', type: 'process', mode: 'SEQUENCE', level: 'B1',
    title: 'Making instant noodles', units: '',
    rubric: 'The diagram shows how instant noodles are manufactured.',
    data: { shape: 'linear', stages: [
      { n: 1, label: 'Mixing', detail: 'flour, water and salt mixed into dough' },
      { n: 2, label: 'Rolling', detail: 'dough pressed into thin sheets by rollers' },
      { n: 3, label: 'Cutting', detail: 'sheets cut into wavy strands' },
      { n: 4, label: 'Steaming', detail: 'strands cooked with steam for 2 minutes' },
      { n: 5, label: 'Frying', detail: 'noodle blocks fried in oil at 150 °C to remove water' },
      { n: 6, label: 'Cooling', detail: 'blocks cooled by fans on a conveyor belt' },
      { n: 7, label: 'Packaging', detail: 'seasoning sachet added; sealed in packets' } ] },
    labels: ['mix', 'roll', 'cut', 'steam', 'fry', 'cool', 'package'],
    keyFeatures: ['The process is linear and man-made, with seven stages', 'It begins with simple raw ingredients and ends with sealed packets', 'The stages can be divided into shaping the dough and cooking and finishing the noodles', 'Heat is used twice: steaming and then frying'],
    distractorFeatures: ['Instant noodles are tasty', 'Rollers are used', 'Frying is unhealthy', 'The dough is white'],
    groupings: [['1', '2', '3'], ['4', '5', '6', '7']],
    tags: ['linear', 'man-made']
  });

  P.push({
    id: 'p-proc-turtle', type: 'process', mode: 'SEQUENCE', level: 'B2',
    title: 'The life cycle of a sea turtle', units: '',
    rubric: 'The diagram shows the life cycle of a sea turtle.',
    data: { shape: 'cyclical', stages: [
      { n: 1, label: 'Eggs', detail: 'female digs nest in sand and lays about 100 eggs' },
      { n: 2, label: 'Incubation', detail: 'eggs warmed by the sun for about 60 days' },
      { n: 3, label: 'Hatchlings', detail: 'emerge at night and crawl to the sea' },
      { n: 4, label: 'Juveniles', detail: 'drift in the open ocean for 5–10 years, feeding on small animals' },
      { n: 5, label: 'Sub-adults', detail: 'move to shallow coastal waters; eat seagrass and jellyfish' },
      { n: 6, label: 'Adults', detail: 'mature at 20–30 years; mate offshore' },
      { n: 7, label: 'Return', detail: 'female returns to the beach where she hatched to lay eggs' } ] },
    labels: ['eggs', 'incubation', 'hatchlings', 'juveniles', 'sub-adults', 'adults', 'return'],
    keyFeatures: ['The cycle is natural and has seven stages', 'It begins with eggs buried on a beach and ends when the adult female returns to the same beach', 'Most of the cycle happens at sea; only the eggs, incubation, hatchlings and the female\'s return are on the beach', 'The full cycle takes at least 20 years'],
    distractorFeatures: ['Turtles are slow', 'Sea turtles are endangered', 'Jellyfish are eaten', 'Beaches should be protected'],
    groupings: [['1', '2', '3'], ['4', '5', '6', '7']],
    modelId: 'm-proc-turtle', tags: ['cyclical', 'natural']
  });

  /* ------------------------------------------------------------- map */
  P.push({
    id: 'p-map-school', type: 'map', mode: 'SPACE', level: 'B1',
    title: 'A school campus: now and planned', units: '',
    rubric: 'The maps show the campus of a secondary school as it is now and the planned changes.',
    data: { panels: [
      { title: 'Now', w: 12, h: 8, features: [
        { name: 'Road', x: 0, y: 0, w: 0.8, h: 8, kind: 'road' },
        { name: 'Main building', x: 1.5, y: 0.5, w: 4.5, h: 2, kind: 'building' },
        { name: 'Car park', x: 6.5, y: 0.5, w: 5, h: 2, kind: 'open' },
        { name: 'Library', x: 1.5, y: 3, w: 2, h: 1.5, kind: 'building' },
        { name: 'Canteen', x: 4, y: 3, w: 2.5, h: 1.5, kind: 'building' },
        { name: 'Open ground', x: 7, y: 3, w: 4.5, h: 1.5, kind: 'open' },
        { name: 'Sports field', x: 1.5, y: 5, w: 10, h: 2.5, kind: 'green' } ] },
      { title: 'Plan', w: 12, h: 8, features: [
        { name: 'Road', x: 0, y: 0, w: 0.8, h: 8, kind: 'road' },
        { name: 'Main building', x: 1.5, y: 0.5, w: 4.5, h: 2, kind: 'building' },
        { name: 'Garden', x: 6.5, y: 0.5, w: 5, h: 2, kind: 'green', note: 'on the site of the car park' },
        { name: 'Canteen (extended)', x: 1.5, y: 3, w: 5, h: 1.5, kind: 'building' },
        { name: 'Car park (new)', x: 7, y: 3, w: 4.5, h: 1.5, kind: 'open' },
        { name: 'New library', x: 1.5, y: 5, w: 4.5, h: 2.5, kind: 'building' },
        { name: 'Sports field (reduced)', x: 6.5, y: 5, w: 5, h: 2.5, kind: 'green' } ] } ] },
    labels: ['main building', 'car park', 'library', 'canteen', 'sports field', 'garden', 'road'],
    keyFeatures: ['The plan adds more buildings and green space at the expense of the sports field', 'The library will move from the centre to the south and the canteen will expand into its old site', 'The car park will be relocated from the north-east to the centre and its old site will become a garden', 'The main building and the road will stay the same'],
    distractorFeatures: ['The school is next to a road', 'The new library will be modern', 'Students need a bigger canteen', 'The main building will be demolished'],
    groupings: [['Library', 'Canteen', 'Sports field'], ['Car park', 'Garden', 'Main building']],
    tags: ['present-plan', 'campus']
  });

  P.push({
    id: 'p-map-beach', type: 'map', mode: 'SPACE', level: 'B2',
    title: 'A coastal village, 2000 and 2025', units: '',
    rubric: 'The maps show a coastal village in southern Thailand in 2000 and in 2025.',
    data: { panels: [
      { title: '2000', w: 12, h: 8, features: [
        { name: 'Sea', x: 0, y: 0, w: 12, h: 1.5, kind: 'water' },
        { name: 'Beach', x: 0, y: 1.5, w: 12, h: 1, kind: 'open', note: 'sand' },
        { name: 'Fishing pier', x: 5.7, y: 0, w: 0.6, h: 2.2, kind: 'road', note: 'wooden pier' },
        { name: 'Fishermen\'s houses', x: 1, y: 3, w: 3.5, h: 1.5, kind: 'housing' },
        { name: 'Market', x: 5, y: 3, w: 2.5, h: 1.5, kind: 'shop' },
        { name: 'Open ground', x: 7.5, y: 3, w: 2, h: 1.5, kind: 'open' },
        { name: 'Temple', x: 9.5, y: 3, w: 2, h: 1.5, kind: 'building' },
        { name: 'Dirt road', x: 0, y: 4.8, w: 12, h: 0.4, kind: 'road' },
        { name: 'Coconut plantation', x: 1, y: 5.5, w: 10, h: 2.3, kind: 'green' } ] },
      { title: '2025', w: 12, h: 8, features: [
        { name: 'Sea', x: 0, y: 0, w: 12, h: 1.5, kind: 'water' },
        { name: 'Beach', x: 0, y: 1.5, w: 12, h: 1, kind: 'open', note: 'sand' },
        { name: 'Tour-boat jetty', x: 5.7, y: 0, w: 0.6, h: 2.2, kind: 'road', note: 'concrete jetty' },
        { name: 'Hotel', x: 1, y: 3, w: 3.5, h: 1.5, kind: 'building' },
        { name: 'Restaurants and shops', x: 5, y: 3, w: 2.5, h: 1.5, kind: 'shop' },
        { name: 'Car park', x: 7.5, y: 3, w: 2, h: 1.5, kind: 'open' },
        { name: 'Temple', x: 9.5, y: 3, w: 2, h: 1.5, kind: 'building' },
        { name: 'Paved road', x: 0, y: 4.8, w: 12, h: 0.4, kind: 'road' },
        { name: 'Resort villas', x: 1, y: 5.5, w: 6, h: 2.3, kind: 'housing' },
        { name: 'Coconut plantation (reduced)', x: 7.5, y: 5.5, w: 3.5, h: 2.3, kind: 'green' } ] } ] },
    labels: ['sea', 'beach', 'pier', 'jetty', 'houses', 'hotel', 'market', 'restaurants', 'car park', 'temple', 'road', 'plantation', 'villas'],
    keyFeatures: ['The village changed from a fishing community into a tourist resort', 'The fishermen\'s houses and market on the seafront were replaced by a hotel and restaurants', 'Most of the coconut plantation in the south was cleared for resort villas', 'The temple, the beach and the position of the road were unchanged, although the road was paved and the pier was rebuilt as a jetty'],
    distractorFeatures: ['The sea is to the north', 'Tourism brings money to the village', 'The temple is beautiful', 'The plantation was completely removed'],
    groupings: [['Fishermen\'s houses', 'Market', 'Coconut plantation'], ['Temple', 'Beach', 'Dirt road', 'Fishing pier']],
    tags: ['past-present', 'tourism']
  });

  P.push({
    id: 'p-map-lake', type: 'map', mode: 'SPACE', level: 'C1',
    title: 'A lakeside area, 1980 and 2020', units: '',
    rubric: 'The maps show the area around a lake in 1980 and in 2020.',
    data: { panels: [
      { title: '1980', w: 12, h: 8, features: [
        { name: 'Forest', x: 0, y: 0, w: 12, h: 2, kind: 'green' },
        { name: 'Marsh', x: 4, y: 2, w: 4, h: 0.5, kind: 'water', note: 'marsh' },
        { name: 'Lake', x: 4, y: 2.5, w: 4, h: 3, kind: 'water' },
        { name: 'Farmland (west)', x: 0, y: 2, w: 4, h: 5.5, kind: 'open' },
        { name: 'Farmland (east)', x: 8, y: 2, w: 4, h: 5.5, kind: 'open' },
        { name: 'Village', x: 4, y: 5.8, w: 4, h: 1.5, kind: 'housing' },
        { name: 'Track', x: 0, y: 7.5, w: 12, h: 0.5, kind: 'road', note: 'unpaved' } ] },
      { title: '2020', w: 12, h: 8, features: [
        { name: 'Forest (reduced)', x: 0, y: 0, w: 6, h: 2, kind: 'green' },
        { name: 'Golf course', x: 6, y: 0, w: 6, h: 2, kind: 'leisure' },
        { name: 'Nature reserve', x: 4, y: 2, w: 4, h: 0.5, kind: 'green', note: 'protected marsh' },
        { name: 'Lake', x: 4, y: 2.5, w: 4, h: 3, kind: 'water' },
        { name: 'Housing estate', x: 0, y: 2, w: 4, h: 4, kind: 'housing' },
        { name: 'Farmland (west, reduced)', x: 0, y: 6, w: 4, h: 1.5, kind: 'open' },
        { name: 'Hotel', x: 8, y: 2, w: 4, h: 2, kind: 'building' },
        { name: 'Farmland (east, reduced)', x: 8, y: 4, w: 4, h: 1.8, kind: 'open' },
        { name: 'Lakeside path', x: 4, y: 5.5, w: 4, h: 0.3, kind: 'open', note: 'walking path' },
        { name: 'Village (expanded)', x: 4, y: 5.8, w: 6, h: 1.7, kind: 'housing' },
        { name: 'Main road', x: 0, y: 7.5, w: 12, h: 0.5, kind: 'road', note: 'paved' } ] } ] },
    labels: ['forest', 'marsh', 'lake', 'farmland', 'village', 'track', 'road', 'golf course', 'nature reserve', 'housing estate', 'hotel', 'path'],
    keyFeatures: ['The area changed from farmland and forest to housing and leisure use', 'Farmland on both sides of the lake shrank considerably', 'Half of the forest became a golf course, whereas the marsh was protected as a nature reserve', 'The lake and the village remained, although the village expanded and the track became a paved road'],
    distractorFeatures: ['The lake is in the middle', 'Golf is popular with tourists', 'The area is more crowded now', 'The forest was completely cut down'],
    groupings: [['Forest', 'Farmland (west)', 'Farmland (east)'], ['Lake', 'Marsh', 'Village', 'Track']],
    tags: ['past-present', 'rural', 'exception']
  });
})();
