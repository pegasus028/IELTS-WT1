/* ===========================================================================
   CHART CONTROL — prompts.js
   The Task 1 prompt bank, seed set. Every prompt is ORIGINAL and defined as
   data so charts.js can draw it, the Writer can read values back, and the
   pre-flight checker knows which labels must appear.

   SHAPE
   {
     id:'p-line-museums', type:'line', mode:'TREND', level:'B1',
     title:'Museum visitors', units:'thousand visitors',
     rubric:'The line graph shows …',                     // the task sentence
     data:{ … see per-type shapes below … },
     labels:['Science Museum','Art Gallery','History Museum'],   // must all be mentioned
     keyFeatures:['…','…','…'],                           // 3–4, used by Selection + hints
     distractorFeatures:['…'],                            // trivial/false features for select items
     groupings:[['Science Museum'],['Art Gallery','History Museum']],
     modelId:'m-line-museums', tags:['crossover']
   }

   DATA SHAPES
     line    { x:[2010,…], series:[{name, values:[…]}], projectedFrom:2025 (optional) }
     bar     { categories:[…], series:[{name, values:[…]}] }   1 series = simple bars,
             2+ = grouped; categories of years + mode TREND = time-series bars
     pie     { charts:[{title, slices:[{name, value}]}] }      1–3 pies, values in %
     table   { cols:['Country','Starting salary',…], rows:[['Germany',62000,…],…] }
     process { shape:'linear'|'cyclical', stages:[{n, label, detail}] }
     map     { panels:[{title, w:12, h:8, features:[{name, x, y, w, h, kind, note}]}] }
             kind: building | housing | shop | green | water | road | open | industry | leisure
     mixed   { parts:[ {type, title, data:{…}}, {type, title, data:{…}} ] }
   =========================================================================== */
(function () {
  var P = window.CONTENT.PROMPTS;

  /* ------------------------------------------------------------ line */
  P.push({
    id: 'p-line-museums', type: 'line', mode: 'TREND', level: 'B1',
    title: 'Museum visitors', units: 'thousand visitors',
    rubric: 'The line graph shows the number of visitors (in thousands) to three museums in a European city between 2010 and 2020.',
    data: { x: [2010, 2012, 2014, 2016, 2018, 2020], series: [
      { name: 'Science Museum', values: [420, 470, 570, 630, 710, 760] },
      { name: 'Art Gallery', values: [610, 590, 560, 570, 540, 520] },
      { name: 'History Museum', values: [380, 350, 330, 290, 300, 260] } ] },
    labels: ['Science Museum', 'Art Gallery', 'History Museum'],
    keyFeatures: ['The Science Museum rose strongly over the whole period', 'The Art Gallery and the History Museum both declined',
      'The Science Museum overtook the Art Gallery around 2014', 'The History Museum was the least visited throughout'],
    distractorFeatures: ['The Art Gallery had 590,000 visitors in 2012', 'All three museums had visitors', 'The Science Museum rose by 50,000 between 2010 and 2012', 'The History Museum recovered slightly in 2018'],
    groupings: [['Science Museum'], ['Art Gallery', 'History Museum']],
    modelId: 'm-line-museums', tags: ['crossover', 'rise-and-fall']
  });

  P.push({
    id: 'p-line-internet', type: 'line', mode: 'TREND', level: 'A2',
    title: 'Households with internet access', units: '% of households',
    rubric: 'The line graph shows the percentage of households with internet access in four countries between 2005 and 2025.',
    data: { x: [2005, 2010, 2015, 2020, 2025], series: [
      { name: 'Sweden', values: [70, 85, 92, 95, 97] },
      { name: 'Japan', values: [60, 78, 88, 93, 95] },
      { name: 'Thailand', values: [12, 28, 52, 78, 88] },
      { name: 'Kenya', values: [2, 8, 18, 35, 52] } ] },
    labels: ['Sweden', 'Japan', 'Thailand', 'Kenya'],
    keyFeatures: ['Internet access rose in all four countries', 'Sweden and Japan were high throughout and converged near 95%',
      'Thailand showed the fastest growth', 'Kenya remained the lowest despite strong growth'],
    distractorFeatures: ['Japan had 78% in 2010', 'Sweden rose by 2% between 2020 and 2025', 'Kenya fell in 2015', 'Four countries are shown'],
    groupings: [['Sweden', 'Japan'], ['Thailand', 'Kenya']],
    tags: ['converge', 'all-rise']
  });

  P.push({
    id: 'p-line-cities', type: 'line', mode: 'TREND', level: 'B2',
    title: 'City populations with projections', units: 'millions',
    rubric: 'The line graph shows the population of three cities between 1990 and 2025, with projections to 2040.',
    data: { x: [1990, 2000, 2010, 2020, 2025, 2030, 2040], projectedFrom: 2025, series: [
      { name: 'Lagos', values: [4.8, 7.2, 10.4, 14.4, 16.5, 19.0, 24.0] },
      { name: 'Osaka', values: [18.3, 18.7, 19.3, 19.2, 19.0, 18.6, 17.8] },
      { name: 'Bangkok', values: [7.4, 8.4, 9.4, 10.6, 11.1, 11.7, 12.6] } ] },
    labels: ['Lagos', 'Osaka', 'Bangkok'],
    keyFeatures: ['Lagos grew fastest and is projected to overtake Osaka by 2030', 'Osaka was largest until the 2020s but is projected to decline slightly',
      'Bangkok grew steadily throughout', 'All figures after 2025 are projections'],
    distractorFeatures: ['Osaka had 18.7 million in 2000', 'Bangkok rose by 1 million between 1990 and 2000', 'Lagos fell in 2010', 'Three cities are compared'],
    groupings: [['Lagos', 'Bangkok'], ['Osaka']],
    tags: ['projection', 'crossover']
  });

  /* ------------------------------------------------------------- bar */
  P.push({
    id: 'p-bar-screentime', type: 'bar', mode: 'COMPARE', level: 'B1',
    title: 'Weekly screen time by age', units: 'hours per week',
    rubric: 'The bar chart shows the average number of hours per week that people in four age groups in one country spent on three activities in 2023.',
    data: { categories: ['13–17', '18–29', '30–49', '50+'], series: [
      { name: 'Social media', values: [21, 18, 11, 6] },
      { name: 'Streaming video', values: [14, 15, 12, 13] },
      { name: 'Gaming', values: [12, 8, 3, 1] } ] },
    labels: ['Social media', 'Streaming video', 'Gaming', '13–17', '18–29', '30–49', '50+'],
    keyFeatures: ['The youngest group spent the most time on social media and gaming', 'Social media and gaming fell sharply with age',
      'Streaming video was similar across all age groups', 'Streaming was the leading activity for people aged 30 and over'],
    distractorFeatures: ['People aged 18–29 spent 15 hours streaming', 'Gaming was 8 hours for 18–29', 'Older people do not use social media', 'Three activities are shown'],
    groupings: [['Social media', 'Gaming'], ['Streaming video']],
    modelId: 'm-bar-screentime', tags: ['grouped', 'static']
  });

  P.push({
    id: 'p-bar-tourists', type: 'bar', mode: 'TREND', level: 'B1',
    title: 'International tourist arrivals in Thailand', units: 'millions',
    rubric: 'The bar chart shows the number of international tourist arrivals in Thailand between 2015 and 2025.',
    data: { categories: [2015, 2017, 2019, 2020, 2021, 2023, 2025], series: [
      { name: 'Arrivals', values: [29.9, 35.6, 39.9, 6.7, 0.4, 28.2, 36.5] } ] },
    labels: ['arrivals'],
    keyFeatures: ['Arrivals rose steadily to a peak in 2019', 'Numbers collapsed in 2020 and 2021', 'A strong recovery followed from 2023', 'By 2025 arrivals were close to the 2019 peak'],
    distractorFeatures: ['There were 35.6 million arrivals in 2017', 'Tourists like Thailand', 'The fall in 2020 was because of the pandemic', '2015 was the first year'],
    groupings: [['2015', '2017', '2019'], ['2020', '2021', '2023', '2025']],
    tags: ['collapse', 'recovery', 'single-series']
  });

  P.push({
    id: 'p-bar-homework', type: 'bar', mode: 'COMPARE', level: 'A2',
    title: 'Homework hours per week', units: 'hours per week',
    rubric: 'The bar chart shows the average number of hours of homework per week in four subjects for students in three year groups at one school.',
    data: { categories: ['English', 'Maths', 'Science', 'Thai'], series: [
      { name: 'M3', values: [2, 3, 2, 1] },
      { name: 'M4', values: [3, 4, 3, 1] },
      { name: 'M5', values: [4, 5, 5, 2] } ] },
    labels: ['English', 'Maths', 'Science', 'Thai', 'M3', 'M4', 'M5'],
    keyFeatures: ['Homework rose from M3 to M5 in every subject', 'Maths always had the most homework, joined by Science in M5', 'Thai had the least homework in all three year groups', 'M5 students did roughly twice as much as M3 students'],
    distractorFeatures: ['M4 did 3 hours of English', 'Students do homework', 'Maths is harder than Thai', 'Four subjects are shown'],
    groupings: [['Maths', 'Science'], ['English', 'Thai']],
    tags: ['grouped', 'static']
  });

  /* ------------------------------------------------------------- pie */
  P.push({
    id: 'p-pie-energy', type: 'pie', mode: 'TREND', level: 'B1',
    title: 'Sources of electricity', units: '%',
    rubric: 'The pie charts show the sources of electricity generated in one country in 2000 and 2020.',
    data: { charts: [
      { title: '2000', slices: [{ name: 'Coal', value: 48 }, { name: 'Natural gas', value: 22 }, { name: 'Nuclear', value: 15 }, { name: 'Hydro', value: 10 }, { name: 'Wind and solar', value: 5 }] },
      { title: '2020', slices: [{ name: 'Coal', value: 18 }, { name: 'Natural gas', value: 30 }, { name: 'Nuclear', value: 14 }, { name: 'Hydro', value: 11 }, { name: 'Wind and solar', value: 27 }] } ] },
    labels: ['Coal', 'Natural gas', 'Nuclear', 'Hydro', 'Wind and solar'],
    keyFeatures: ['Coal lost more than half of its share', 'Wind and solar grew from a minor source to one of the largest', 'Natural gas became the leading source by 2020', 'Nuclear and hydro stayed almost unchanged'],
    distractorFeatures: ['Hydro was 10% in 2000', 'Nuclear fell by 1%', 'The country cares about the environment', 'Five sources are shown'],
    groupings: [['Coal', 'Wind and solar', 'Natural gas'], ['Nuclear', 'Hydro']],
    modelId: 'm-pie-energy', tags: ['two-pies', 'change']
  });

  P.push({
    id: 'p-pie-budget', type: 'pie', mode: 'COMPARE', level: 'A2',
    title: 'A student\'s weekly spending', units: '%',
    rubric: 'The pie chart shows how a typical secondary school student in one city spent their weekly money in 2024.',
    data: { charts: [
      { title: 'Weekly spending', slices: [{ name: 'Food and drinks', value: 38 }, { name: 'Transport', value: 22 }, { name: 'Phone and internet', value: 15 }, { name: 'Clothes', value: 12 }, { name: 'Entertainment', value: 9 }, { name: 'Savings', value: 4 }] } ] },
    labels: ['Food and drinks', 'Transport', 'Phone and internet', 'Clothes', 'Entertainment', 'Savings'],
    keyFeatures: ['Food and drinks was the largest category, well over a third', 'Food and transport together made up over half', 'Savings was by far the smallest share', 'Phone, clothes and entertainment were each between 9% and 15%'],
    distractorFeatures: ['Clothes was 12%', 'Students should save more', 'Transport was 22%', 'Six categories are shown'],
    groupings: [['Food and drinks', 'Transport'], ['Phone and internet', 'Clothes', 'Entertainment', 'Savings']],
    tags: ['single-pie', 'static']
  });

  /* ----------------------------------------------------------- table */
  P.push({
    id: 'p-table-salaries', type: 'table', mode: 'COMPARE', level: 'B2',
    title: 'Secondary school teachers\' salaries', units: 'US dollars',
    rubric: 'The table shows the starting salary, the salary after 15 years and the number of working hours per week for secondary school teachers in five countries in 2022.',
    data: { cols: ['Country', 'Starting salary ($)', 'Salary after 15 years ($)', 'Hours per week'], rows: [
      ['Germany', 62000, 81000, 40], ['Japan', 31000, 55000, 54], ['Korea', 33000, 58000, 43], ['Thailand', 9000, 17000, 45], ['USA', 44000, 66000, 46] ] },
    labels: ['Germany', 'Japan', 'Korea', 'Thailand', 'USA'],
    keyFeatures: ['German teachers were the best paid at both stages and worked the shortest week', 'Thai teachers earned far less than all the others', 'Salaries after 15 years were much higher than starting salaries in every country', 'Japanese teachers worked the longest hours'],
    distractorFeatures: ['Korea\'s starting salary was $33,000', 'Teachers in the USA worked 46 hours', 'Teachers deserve more money', 'Five countries are compared'],
    groupings: [['Germany', 'USA'], ['Japan', 'Korea', 'Thailand']],
    modelId: 'm-table-salaries', tags: ['static', 'multi-column']
  });

  P.push({
    id: 'p-table-rice', type: 'table', mode: 'TREND', level: 'B1',
    title: 'Rice production', units: 'million tonnes',
    rubric: 'The table shows rice production in four countries in 2000, 2010 and 2020 (in million tonnes).',
    data: { cols: ['Country', '2000', '2010', '2020'], rows: [
      ['China', 188, 197, 212], ['India', 127, 144, 178], ['Vietnam', 32, 40, 43], ['Thailand', 26, 36, 30] ] },
    labels: ['China', 'India', 'Vietnam', 'Thailand'],
    keyFeatures: ['China produced the most rice in every year', 'India showed the largest increase', 'Thailand was the only country whose production fell between 2010 and 2020', 'Vietnam and Thailand produced far less than China and India'],
    distractorFeatures: ['Vietnam produced 40 million tonnes in 2010', 'China is a big country', 'Rice is popular in Asia', 'Three years are shown'],
    groupings: [['China', 'India'], ['Vietnam', 'Thailand']],
    tags: ['years-in-columns']
  });

  /* --------------------------------------------------------- process */
  P.push({
    id: 'p-proc-glass', type: 'process', mode: 'SEQUENCE', level: 'B1',
    title: 'Recycling glass bottles', units: '',
    rubric: 'The diagram shows how glass bottles are recycled.',
    data: { shape: 'cyclical', stages: [
      { n: 1, label: 'Bottle bank', detail: 'used bottles collected' },
      { n: 2, label: 'Transport', detail: 'lorry to recycling plant' },
      { n: 3, label: 'Washing', detail: 'high-pressure water' },
      { n: 4, label: 'Sorting', detail: 'by colour: clear, green, brown' },
      { n: 5, label: 'Crushing', detail: 'small pieces (cullet)' },
      { n: 6, label: 'Furnace', detail: 'melted at 600–800 °C + new raw materials' },
      { n: 7, label: 'Moulding', detail: 'molten glass → new bottles' },
      { n: 8, label: 'Filling and delivery', detail: 'to shops' } ] },
    labels: ['bottle bank', 'transport', 'wash', 'sort', 'crush', 'furnace', 'mould', 'deliver'],
    keyFeatures: ['The process is cyclical and man-made, with eight stages', 'It begins with collection of used bottles and ends with new bottles delivered to shops', 'The stages fall into two phases: preparing the waste glass and making the new product', 'The glass is melted at 600–800 °C with new raw materials'],
    distractorFeatures: ['Lorries are used', 'Green glass is prettier', 'The furnace is hot', 'Bottles are round'],
    groupings: [['1', '2', '3', '4'], ['5', '6', '7', '8']],
    modelId: 'm-proc-glass', tags: ['cyclical', 'man-made']
  });

  P.push({
    id: 'p-proc-frog', type: 'process', mode: 'SEQUENCE', level: 'A2',
    title: 'The life cycle of a frog', units: '',
    rubric: 'The diagram shows the life cycle of a frog.',
    data: { shape: 'cyclical', stages: [
      { n: 1, label: 'Eggs', detail: 'laid in water (frogspawn)' },
      { n: 2, label: 'Tadpole', detail: 'hatches after about 10 days; gills, tail' },
      { n: 3, label: 'Tadpole with legs', detail: 'back legs then front legs; 6–9 weeks' },
      { n: 4, label: 'Froglet', detail: 'lungs develop, tail shrinks; 12 weeks' },
      { n: 5, label: 'Adult frog', detail: 'lives on land and in water; lays eggs' } ] },
    labels: ['eggs', 'tadpole', 'legs', 'froglet', 'adult'],
    keyFeatures: ['The cycle is natural and has five stages', 'It begins with eggs in water and ends with an adult that lays eggs again', 'The tadpole gradually develops legs and lungs and loses its tail', 'The whole cycle from egg to froglet takes about 12 weeks'],
    distractorFeatures: ['Frogs are green', 'Tadpoles are cute', 'Eggs are laid', 'Frogs eat insects'],
    groupings: [['1', '2'], ['3', '4', '5']],
    tags: ['cyclical', 'natural']
  });

  /* ------------------------------------------------------------- map */
  P.push({
    id: 'p-map-riverside', type: 'map', mode: 'SPACE', level: 'B2',
    title: 'Riverside town centre, 1995 and 2025', units: '',
    rubric: 'The maps show the centre of the town of Riverside in 1995 and in 2025.',
    data: { panels: [
      { title: '1995', w: 12, h: 8, features: [
        { name: 'River', x: 0, y: 0, w: 12, h: 1.2, kind: 'water' },
        { name: 'Main road', x: 5.6, y: 0, w: 0.8, h: 8, kind: 'road' },
        { name: 'Bridge', x: 5.4, y: 0, w: 1.2, h: 1.2, kind: 'road', note: 'bridge' },
        { name: 'Car park', x: 0.5, y: 2, w: 2.5, h: 2, kind: 'open' },
        { name: 'Bus station', x: 0.5, y: 4.5, w: 2.5, h: 1.5, kind: 'building' },
        { name: 'Cinema', x: 3.5, y: 2, w: 1.8, h: 1.5, kind: 'leisure' },
        { name: 'Small shops', x: 3.5, y: 3.8, w: 1.8, h: 2.2, kind: 'shop' },
        { name: 'Factory', x: 7, y: 2, w: 4.5, h: 3, kind: 'industry' },
        { name: 'Park', x: 0.5, y: 6.3, w: 3, h: 1.5, kind: 'green' } ] },
      { title: '2025', w: 12, h: 8, features: [
        { name: 'River', x: 0, y: 0, w: 12, h: 1.2, kind: 'water' },
        { name: 'Main road (north)', x: 5.6, y: 0, w: 0.8, h: 1.4, kind: 'road' },
        { name: 'Bridge', x: 5.4, y: 0, w: 1.2, h: 1.2, kind: 'road', note: 'bridge' },
        { name: 'Pedestrian street', x: 5.6, y: 1.4, w: 0.8, h: 5.4, kind: 'open', note: 'pedestrianised' },
        { name: 'Ring road', x: 0, y: 7.4, w: 12, h: 0.6, kind: 'road' },
        { name: 'Shopping mall', x: 0.5, y: 2, w: 2.5, h: 2, kind: 'shop' },
        { name: 'Bus station', x: 0.5, y: 4.5, w: 2.5, h: 1.5, kind: 'building' },
        { name: 'Pedestrian square with cafés', x: 3.5, y: 2, w: 1.8, h: 4, kind: 'open' },
        { name: 'Apartment blocks', x: 7, y: 2, w: 4.5, h: 3, kind: 'housing' },
        { name: 'Park (extended)', x: 0.5, y: 6.3, w: 5, h: 1.0, kind: 'green' } ] } ] },
    labels: ['factory', 'apartment', 'car park', 'shopping mall', 'bus station', 'cinema', 'square', 'park', 'road', 'river'],
    keyFeatures: ['The centre changed from industrial and commercial to residential and leisure use', 'The factory in the east was replaced by apartment blocks', 'The car park became a shopping mall and the cinema and shops became a pedestrian square', 'Traffic was moved out of the centre: the main road was pedestrianised and a ring road was built'],
    distractorFeatures: ['The river is in the north', 'The town is nice now', 'The bus station has buses', 'The bridge is old'],
    groupings: [['Factory', 'Car park', 'Cinema'], ['Park', 'Main road', 'Ring road']],
    modelId: 'm-map-riverside', tags: ['past-present', 'redevelopment']
  });

  /* ----------------------------------------------------------- mixed */
  P.push({
    id: 'p-mixed-coffee', type: 'mixed', mode: 'COMPARE', level: 'B2',
    title: 'Coffee consumption and price', units: '',
    rubric: 'The bar chart shows the average number of cups of coffee consumed per person per week in five countries in 2024, and the table shows the average price of a cup of coffee in each country.',
    data: { parts: [
      { type: 'bar', title: 'Cups per person per week', units: 'cups', data: { categories: ['Finland', 'Italy', 'Brazil', 'Japan', 'Thailand'], series: [{ name: 'Cups per week', values: [21, 14, 12, 8, 5] }] } },
      { type: 'table', title: 'Average price per cup (US$)', units: 'US$', data: { cols: ['Country', 'Price per cup ($)'], rows: [['Finland', 3.9], ['Italy', 1.4], ['Brazil', 1.1], ['Japan', 3.6], ['Thailand', 2.2]] } } ] },
    labels: ['Finland', 'Italy', 'Brazil', 'Japan', 'Thailand'],
    keyFeatures: ['Finland consumed by far the most coffee and also had the highest price', 'Thailand consumed the least', 'Italy and Brazil combined high consumption with low prices', 'Japan had a high price but low consumption'],
    distractorFeatures: ['Coffee in Brazil cost $1.10', 'Finnish people love coffee', 'Japan drank 8 cups', 'Two visuals are shown'],
    groupings: [['Finland', 'Italy', 'Brazil'], ['Japan', 'Thailand']],
    tags: ['two-visuals']
  });
})();
