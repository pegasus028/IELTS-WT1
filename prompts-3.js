/* ===========================================================================
   CHART CONTROL — prompts-3.js
   Third batch of the Task 1 prompt bank: 8 original prompts that give the
   SEQUENCE and SPACE modes more practice material (4 process, 4 map).
   Same shapes as prompts.js. Load after prompts-2.js. Models: models-2.js.

     p-proc-silkworm      A2  natural cycle, active voice, 6 stages
     p-proc-coconut-sugar B1  Thai man-made process, linear, 7 stages
     p-proc-rubber        B2  branching process: 2 shared stages, then two
                              routes in parallel (stages carry `branch`)
     p-proc-pineapple     C1  industrial process, linear, 10 stages
     p-map-thai-town      B1  Thai town centre, 2005 and 2025
     p-map-port-plan      B2  plan: warehouse district now and planned (future passive)
     p-map-island         C1  three maps over time: 1985, 2005, 2025
     p-map-park           A2  single plan: the layout of a city park

   Process stages with `branch: 'A' | 'B'` belong to one of two parallel
   routes that both start after the last stage without a branch;
   data.branches names the routes. Map panels for three maps are 8 × 6 so
   the three fit side by side.
   =========================================================================== */
(function () {
  var P = window.CONTENT.PROMPTS;

  /* --------------------------------------------------------- process */
  P.push({
    id: 'p-proc-silkworm', type: 'process', mode: 'SEQUENCE', level: 'A2',
    title: 'The life cycle of the silk moth', units: '',
    rubric: 'The diagram shows the life cycle of the silk moth, the insect that produces silk.',
    data: { shape: 'cyclical', stages: [
      { n: 1, label: 'Eggs', detail: 'tiny eggs hatch after about 10 days' },
      { n: 2, label: 'Silkworm', detail: 'eats mulberry leaves for about 4 weeks' },
      { n: 3, label: 'Spinning', detail: 'spins a 900-metre thread in 3 days' },
      { n: 4, label: 'Pupa', detail: 'changes inside the cocoon for 2 weeks' },
      { n: 5, label: 'Moth', detail: 'breaks out; cannot fly or eat' },
      { n: 6, label: 'Laying eggs', detail: 'female lays 300–500 eggs, then dies' } ] },
    labels: ['eggs', 'silkworm', 'spin', 'cocoon', 'pupa', 'moth', 'lay'],
    keyFeatures: ['The cycle is natural and has six stages', 'It begins with eggs and ends with a female moth laying eggs again', 'The longest stage with a time given is the silkworm stage, when it feeds for about 4 weeks', 'The cocoon is spun in the middle of the cycle, in only 3 days'],
    distractorFeatures: ['The eggs hatch after about 10 days', 'Silk is used to make traditional Thai clothes', 'The silkworm sheds its skin as it grows', 'Moths are more beautiful than silkworms'],
    groupings: [['1', '2', '3'], ['4', '5', '6']],
    modelId: 'm-proc-silkworm', tags: ['cyclical', 'natural']
  });

  P.push({
    id: 'p-proc-coconut-sugar', type: 'process', mode: 'SEQUENCE', level: 'B1',
    title: 'Making coconut sugar in Thailand', units: '',
    rubric: 'The diagram shows how coconut sugar is made from the sap of coconut palms in Thailand.',
    data: { shape: 'linear', stages: [
      { n: 1, label: 'Tapping', detail: 'flower stalk cut; sap drips into a tube' },
      { n: 2, label: 'Collecting', detail: 'twice a day; about 10 litres per tree' },
      { n: 3, label: 'Filtering', detail: 'poured through cloth to remove dirt' },
      { n: 4, label: 'Boiling', detail: 'heated in a wok over a fire for 3–4 hours' },
      { n: 5, label: 'Beating', detail: 'thick syrup beaten as it cools' },
      { n: 6, label: 'Moulding', detail: 'poured into moulds; sets in 30 minutes' },
      { n: 7, label: 'Packing', detail: 'wrapped; 10 litres of sap → 1.5 kg' } ] },
    labels: ['tap', 'collect', 'filter', 'boil', 'beat', 'mould', 'pack'],
    keyFeatures: ['The process is linear and man-made, with seven stages', 'It begins with tapping sap from the coconut palm and ends with blocks of sugar being packed', 'The stages fall into two phases: collecting the sap on the farm and turning it into sugar with heat', 'About 10 litres of sap produce roughly 1.5 kg of sugar'],
    distractorFeatures: ['The sap is boiled for 3–4 hours', 'Coconut sugar is healthier than white sugar', 'Bamboo tubes are used', 'Farmers collect the sap because it is their main income'],
    groupings: [['1', '2', '3'], ['4', '5', '6', '7']],
    modelId: 'm-proc-coconut-sugar', tags: ['linear', 'man-made', 'thailand']
  });

  P.push({
    id: 'p-proc-rubber', type: 'process', mode: 'SEQUENCE', level: 'B2',
    title: 'From rubber tree to rubber products', units: '',
    rubric: 'The diagram shows how latex from rubber trees in southern Thailand is turned into two different products.',
    data: { shape: 'linear', branches: { A: 'Route A: concentrated latex', B: 'Route B: smoked rubber sheets' }, stages: [
      { n: 1, label: 'Tapping', detail: 'bark cut at night; latex drips 3–4 hours' },
      { n: 2, label: 'Collection', detail: 'latex poured into buckets and filtered' },
      { n: '3A', label: 'Centrifuge', detail: 'spun: rubber content 30% → 60%', branch: 'A' },
      { n: '4A', label: 'Dipping', detail: 'moulds dipped to make gloves', branch: 'A' },
      { n: '3B', label: 'Coagulation', detail: 'acid added; sets in trays overnight', branch: 'B' },
      { n: '4B', label: 'Rolling', detail: 'pressed into sheets 3 mm thick', branch: 'B' },
      { n: '5B', label: 'Smoking', detail: 'dried at 60 °C for 4 days', branch: 'B' },
      { n: '6B', label: 'Baling', detail: 'packed in 110 kg bales for tyres', branch: 'B' } ] },
    labels: ['tap', 'collect', 'centrifuge', 'dip', 'coagulat', 'roll', 'smok', 'bale'],
    keyFeatures: ['The process is man-made and has eight stages, two shared and six on two separate routes', 'After the latex is collected, the process divides into two routes that produce different products', 'One short route concentrates the liquid latex for gloves, while a longer route turns it into dry sheets for tyres', 'The rubber content of the latex is doubled from 30% to 60% in the centrifuge'],
    distractorFeatures: ['The sheets are dried at 60 °C', 'Rubber gloves are more useful than tyres', 'Tapping is done at night because it is cooler', 'The trays are made of metal'],
    groupings: [['1', '2', '3A', '4A'], ['3B', '4B', '5B', '6B']],
    modelId: 'm-proc-rubber', tags: ['branching', 'man-made', 'thailand']
  });

  P.push({
    id: 'p-proc-pineapple', type: 'process', mode: 'SEQUENCE', level: 'C1',
    title: 'Canning pineapple', units: '',
    rubric: 'The diagram shows the stages in the production of canned pineapple at a factory in Thailand.',
    data: { shape: 'linear', stages: [
      { n: 1, label: 'Harvesting', detail: 'reaches the factory within 24 hours' },
      { n: 2, label: 'Grading', detail: 'sorted by size; damaged fruit removed' },
      { n: 3, label: 'Washing', detail: 'sprayed with clean water' },
      { n: 4, label: 'Peeling', detail: 'machine peels and cores 120 a minute' },
      { n: 5, label: 'Trimming', detail: 'remaining eyes cut out by hand' },
      { n: 6, label: 'Slicing', detail: 'cut into 1 cm rings or chunks' },
      { n: 7, label: 'Filling', detail: 'fruit and light syrup put in cans' },
      { n: 8, label: 'Sealing', detail: 'air removed; lids sealed on' },
      { n: 9, label: 'Sterilising', detail: 'heated at 100 °C for 20 minutes' },
      { n: 10, label: 'Packing', detail: 'cooled, labelled and boxed for export' } ] },
    labels: ['harvest', 'grade', 'wash', 'peel', 'trim', 'slice', 'fill', 'seal', 'sterilis', 'pack'],
    keyFeatures: ['The process is linear and industrial, with ten stages', 'It begins with fresh fruit arriving from the farm and ends with labelled cans ready for export', 'The first six stages prepare the fruit, and the last four fill, seal, heat and pack the cans', 'Heat is applied only once, when the sealed cans are sterilised at 100 °C'],
    distractorFeatures: ['A machine peels and cores 120 pineapples a minute', 'Canned fruit is less healthy than fresh fruit', 'Workers wear gloves when they trim the fruit', 'Thailand exports pineapple because its climate is hot'],
    groupings: [['1', '2', '3', '4', '5', '6'], ['7', '8', '9', '10']],
    modelId: 'm-proc-pineapple', tags: ['linear', 'man-made', 'industrial', 'ten-stages']
  });

  /* ------------------------------------------------------------- map */
  P.push({
    id: 'p-map-thai-town', type: 'map', mode: 'SPACE', level: 'B1',
    title: 'A town in north-eastern Thailand, 2005 and 2025', units: '',
    rubric: 'The maps show the centre of a small town in north-eastern Thailand in 2005 and in 2025.',
    data: { panels: [
      { title: '2005', w: 12, h: 8, features: [
        { name: 'River', x: 0, y: 0, w: 1.2, h: 8, kind: 'water' },
        { name: 'Main road', x: 1.2, y: 3.6, w: 10.8, h: 0.6, kind: 'road' },
        { name: 'Ferry crossing', x: 0, y: 5.6, w: 1.2, h: 0.5, kind: 'road', note: 'small boat ferry' },
        { name: 'Wet market', x: 1.8, y: 0.8, w: 3.2, h: 2.2, kind: 'shop' },
        { name: 'Open field', x: 5.4, y: 0.8, w: 2.6, h: 2.2, kind: 'open' },
        { name: 'Temple', x: 8.4, y: 0.8, w: 3.2, h: 2.2, kind: 'building' },
        { name: 'Wooden houses', x: 1.8, y: 4.8, w: 4.2, h: 2.6, kind: 'housing' },
        { name: 'Rice fields', x: 6.4, y: 4.8, w: 5.2, h: 2.6, kind: 'green' } ] },
      { title: '2025', w: 12, h: 8, features: [
        { name: 'River', x: 0, y: 0, w: 1.2, h: 8, kind: 'water' },
        { name: 'Main road (widened)', x: 1.2, y: 3.5, w: 10.8, h: 0.8, kind: 'road', note: 'four lanes' },
        { name: 'Bridge', x: 0, y: 5.6, w: 1.2, h: 0.5, kind: 'road', note: 'road bridge' },
        { name: 'Covered market', x: 1.8, y: 0.8, w: 3.2, h: 2.2, kind: 'shop' },
        { name: 'Car park', x: 5.4, y: 0.8, w: 2.6, h: 2.2, kind: 'open' },
        { name: 'Temple', x: 8.4, y: 0.8, w: 3.2, h: 2.2, kind: 'building' },
        { name: 'Townhouses', x: 1.8, y: 4.8, w: 4.2, h: 2.6, kind: 'housing' },
        { name: 'Hospital', x: 6.4, y: 4.8, w: 3, h: 2.6, kind: 'building' },
        { name: 'Rice fields (reduced)', x: 9.6, y: 4.8, w: 2, h: 2.6, kind: 'green' } ] } ] },
    labels: ['river', 'road', 'ferry', 'bridge', 'market', 'open field', 'car park', 'temple', 'wooden houses', 'townhouses', 'rice', 'hospital'],
    keyFeatures: ['The town centre became more modern and built-up, while the temple and the river stayed the same', 'Most old buildings were replaced on the same sites: the market was rebuilt and the wooden houses became townhouses', 'A hospital was built on most of the rice fields in the south-east', 'Transport improved: the main road was widened and a bridge replaced the ferry'],
    distractorFeatures: ['The temple is in the north-east', 'The town is more beautiful now', 'The hospital was built because the population grew', 'The rice fields disappeared completely'],
    groupings: [['Wet market', 'Open field', 'Temple', 'Main road'], ['Wooden houses', 'Rice fields', 'Ferry crossing']],
    modelId: 'm-map-thai-town', tags: ['past-present', 'thailand', 'redevelopment']
  });

  P.push({
    id: 'p-map-port-plan', type: 'map', mode: 'SPACE', level: 'B2',
    title: 'A riverside warehouse district: now and planned', units: '',
    rubric: 'The maps show an old warehouse district beside a river as it is today and the planned redevelopment of the area.',
    data: { panels: [
      { title: 'Now', w: 12, h: 8, features: [
        { name: 'River', x: 0, y: 0, w: 12, h: 1.2, kind: 'water' },
        { name: 'Wooden pier', x: 1.6, y: 0, w: 1.0, h: 1.7, kind: 'road', note: 'old cargo pier' },
        { name: 'Container yard', x: 6, y: 1.8, w: 5.5, h: 2.2, kind: 'open' },
        { name: 'Warehouses', x: 0.5, y: 1.8, w: 5, h: 2.2, kind: 'industry' },
        { name: 'Riverside Road', x: 0, y: 4.4, w: 12, h: 0.6, kind: 'road' },
        { name: 'Freight railway', x: 0, y: 5.35, w: 12, h: 0.45, kind: 'road', note: 'goods trains' },
        { name: 'Shophouses', x: 0.5, y: 6.2, w: 4, h: 1.4, kind: 'shop' },
        { name: 'Empty land', x: 5, y: 6.2, w: 6.5, h: 1.4, kind: 'open' } ] },
      { title: 'Plan', w: 12, h: 8, features: [
        { name: 'River', x: 0, y: 0, w: 12, h: 1.2, kind: 'water' },
        { name: 'Ferry terminal', x: 1.3, y: 0.1, w: 1.6, h: 1.1, kind: 'building', note: 'replaces the pier' },
        { name: 'Riverside walkway', x: 0, y: 1.2, w: 12, h: 0.45, kind: 'open', note: 'public walkway' },
        { name: 'Apartment complex', x: 6, y: 1.8, w: 5.5, h: 2.2, kind: 'housing' },
        { name: 'Arts centre and restaurants', x: 0.5, y: 1.8, w: 5, h: 2.2, kind: 'leisure', note: 'in the converted warehouses' },
        { name: 'Riverside Road', x: 0, y: 4.4, w: 12, h: 0.6, kind: 'road' },
        { name: 'Light rail line', x: 0, y: 5.35, w: 12, h: 0.45, kind: 'road', note: 'passenger trains' },
        { name: 'Light rail station', x: 5.2, y: 5.05, w: 1.6, h: 1.0, kind: 'building' },
        { name: 'Shophouses', x: 0.5, y: 6.2, w: 4, h: 1.4, kind: 'shop' },
        { name: 'School', x: 5, y: 6.2, w: 2.2, h: 1.4, kind: 'building' },
        { name: 'Park', x: 7.4, y: 6.2, w: 4.1, h: 1.4, kind: 'green' } ] } ] },
    labels: ['river', 'pier', 'ferry', 'walkway', 'warehouses', 'arts centre', 'container yard', 'apartment', 'road', 'railway', 'light rail', 'station', 'shophouses', 'empty land', 'school', 'park'],
    keyFeatures: ['The district will change from an industrial port area into a residential, cultural and leisure area', 'All industrial uses will go: the warehouses will be converted and the container yard will be replaced by apartments', 'Access will improve, with a ferry terminal, a riverside walkway and a light rail station', 'Riverside Road and the shophouses will remain unchanged'],
    distractorFeatures: ['The river is to the north of the district', 'The new apartments will be too expensive for local people', 'The plan will reduce air pollution', 'The warehouses will be demolished'],
    groupings: [['Wooden pier', 'Warehouses', 'Container yard'], ['Freight railway', 'Empty land', 'Shophouses', 'Riverside Road']],
    modelId: 'm-map-port-plan', tags: ['present-plan', 'redevelopment']
  });

  P.push({
    id: 'p-map-island', type: 'map', mode: 'SPACE', level: 'C1',
    title: 'The east coast of an island, 1985, 2005 and 2025', units: '',
    rubric: 'The three maps show the east coast of an island in the Gulf of Thailand in 1985, 2005 and 2025.',
    data: { panels: [
      { title: '1985', w: 8, h: 6, features: [
        { name: 'Sea', x: 6.6, y: 0, w: 1.4, h: 6, kind: 'water' },
        { name: 'Beach', x: 5.65, y: 0, w: 0.95, h: 6, kind: 'open', note: 'sand' },
        { name: 'Forest', x: 0, y: 0, w: 2.6, h: 6, kind: 'green' },
        { name: 'Boatyard', x: 2.8, y: 0.3, w: 2.8, h: 1.4, kind: 'industry' },
        { name: 'Coconut plantation', x: 2.8, y: 1.9, w: 2.8, h: 1.5, kind: 'green' },
        { name: 'Fishing village', x: 2.8, y: 3.6, w: 2.8, h: 1.8, kind: 'housing' },
        { name: 'Jetty', x: 6.6, y: 4.1, w: 1.0, h: 0.45, kind: 'road', note: 'short wooden jetty' } ] },
      { title: '2005', w: 8, h: 6, features: [
        { name: 'Sea', x: 6.6, y: 0, w: 1.4, h: 6, kind: 'water' },
        { name: 'Beach', x: 5.65, y: 0, w: 0.95, h: 6, kind: 'open', note: 'sand' },
        { name: 'Forest', x: 0, y: 0, w: 2.6, h: 5.4, kind: 'green' },
        { name: 'Road', x: 0, y: 5.5, w: 5.65, h: 0.45, kind: 'road', note: 'new road to the beach' },
        { name: 'Bungalow resort', x: 2.8, y: 0.3, w: 2.8, h: 1.4, kind: 'leisure' },
        { name: 'Coconut plantation', x: 2.8, y: 1.9, w: 2.8, h: 1.5, kind: 'green' },
        { name: 'Fishing village', x: 2.8, y: 3.6, w: 2.8, h: 1.8, kind: 'housing' },
        { name: 'Pier', x: 6.6, y: 4.1, w: 1.4, h: 0.45, kind: 'road', note: 'longer concrete pier' } ] },
      { title: '2025', w: 8, h: 6, features: [
        { name: 'Sea', x: 6.6, y: 0, w: 1.4, h: 6, kind: 'water' },
        { name: 'Beach', x: 5.65, y: 0, w: 0.95, h: 6, kind: 'open', note: 'sand' },
        { name: 'Airstrip', x: 0.15, y: 0.3, w: 0.95, h: 4.9, kind: 'road', note: 'runway' },
        { name: 'Forest (reduced)', x: 1.2, y: 0, w: 1.4, h: 5.4, kind: 'green' },
        { name: 'Road', x: 0, y: 5.5, w: 5.65, h: 0.45, kind: 'road' },
        { name: 'Hotel', x: 2.8, y: 0.3, w: 2.8, h: 1.4, kind: 'building', note: 'large resort hotel' },
        { name: 'Villas', x: 2.8, y: 1.9, w: 2.8, h: 1.5, kind: 'housing' },
        { name: 'Shops and restaurants', x: 2.8, y: 3.6, w: 2.8, h: 1.8, kind: 'shop' },
        { name: 'Marina', x: 6.6, y: 3.8, w: 1.4, h: 1.2, kind: 'leisure', note: 'replaces the pier' } ] } ] },
    labels: ['sea', 'beach', 'forest', 'boatyard', 'plantation', 'village', 'jetty', 'resort', 'road', 'pier', 'airstrip', 'hotel', 'villas', 'shops', 'marina'],
    keyFeatures: ['The coast changed from a quiet fishing and farming area into a busy tourist resort', 'Development came in two waves: small-scale tourism by 2005 and large-scale tourism by 2025', 'The boatyard, the coconut plantation and the fishing village all disappeared, and around half of the forest was cleared for an airstrip', 'The beach and the sea were unchanged, and the road built by 2005 stayed in place'],
    distractorFeatures: ['The sea is to the east', 'Tourists prefer hotels to bungalows', 'The airstrip was built because the island became popular', 'The fishing village grew between 1985 and 2005'],
    groupings: [['Boatyard', 'Bungalow resort', 'Road', 'Jetty'], ['Coconut plantation', 'Fishing village', 'Forest', 'Airstrip']],
    modelId: 'm-map-island', tags: ['three-maps', 'tourism', 'thailand']
  });

  P.push({
    id: 'p-map-park', type: 'map', mode: 'SPACE', level: 'A2',
    title: 'Lotus Park: layout', units: '',
    rubric: 'The map shows the layout of Lotus Park, a public park in a Thai city.',
    data: { panels: [
      { title: 'Lotus Park', w: 12, h: 8, features: [
        { name: 'Main road', x: 0, y: 7.4, w: 12, h: 0.6, kind: 'road' },
        { name: 'Main gate', x: 5.2, y: 6.7, w: 1.6, h: 0.7, kind: 'building' },
        { name: 'Footpath', x: 5.7, y: 5.4, w: 0.6, h: 1.3, kind: 'open' },
        { name: 'Car park', x: 0.4, y: 5.4, w: 3.4, h: 1.8, kind: 'open' },
        { name: 'Playground', x: 8.4, y: 5.4, w: 3.2, h: 1.8, kind: 'leisure' },
        { name: 'Lake', x: 4.2, y: 2.4, w: 3.6, h: 3, kind: 'water' },
        { name: 'Café', x: 8.4, y: 2.6, w: 1.8, h: 1.4, kind: 'shop' },
        { name: 'Toilets', x: 10.4, y: 2.6, w: 1.2, h: 1.4, kind: 'building' },
        { name: 'Flower garden', x: 0.4, y: 1.2, w: 3.4, h: 3.6, kind: 'green' },
        { name: 'Football field', x: 4.2, y: 0.3, w: 7.4, h: 1.7, kind: 'green' } ] } ] },
    labels: ['road', 'gate', 'footpath', 'car park', 'playground', 'lake', 'café', 'toilets', 'flower garden', 'football'],
    keyFeatures: ['The park is arranged around a large lake in the centre', 'Sports and play areas are at the edges, with the football field in the north and the playground in the south-east', 'Visitors enter from the main road in the south, where the main gate and the car park are', 'The west of the park is a quiet flower garden'],
    distractorFeatures: ['The toilets are next to the café', 'The park is a pleasant place for families', 'The lake is the most popular area', 'The football field is larger than the lake'],
    groupings: [['Main gate', 'Footpath', 'Car park', 'Playground'], ['Lake', 'Café', 'Toilets', 'Flower garden', 'Football field']],
    modelId: 'm-map-park', tags: ['single-map', 'layout']
  });
})();
