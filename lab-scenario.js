/* ===========================================================================
   QUILLMOOR ACADEMY · THE OBSERVATORY (Chart Control, Task 1) — lab-scenario.js
   The Test Drive charts for the Spellbook Workshop: one Thai-context chart
   per mode, built from the data sets of the EN31208 class assignments
   A1–A4 (Lamphun visitors, Chiang Rai transport to work, coconut sugar,
   Ban Khlong). Each is prompt-shaped, so Charts.render draws it and the
   data checker (Template.Data) can read it like a bank prompt.

   While a student writes a line, the Workshop fills her slots with these
   values so she can see her own frame carrying real data. `fills` are the
   B2 wording; `B1` and `C1` override some values with simpler or more
   precise words. A stage value may come in three shapes, chosen by the
   words just before the slot in her line:
     clause  "the sap is collected …"     after "First," / "Next,"
     pp      "collected …"                after "is" / "are" / "being"
     vp      "is collected …"             straight after another slot
   The data are invented for teaching [not from a real source]. Plain ES5.
   =========================================================================== */
(function (global) {
  'use strict';

  var S = { title: 'Thai charts from your class assignments', bandFor: { B1: 'B1', B2: 'B2', C1: 'C1' } };

  S.charts = {
    TREND: {
      id: 'scn-trend-lamphun', type: 'line', mode: 'TREND', level: 'B1', scenario: true,
      title: 'Visitors to three attractions in Lamphun', units: 'thousand visitors',
      rubric: 'The line graph below shows the number of visitors to three tourist attractions in Lamphun, Thailand, between 2012 and 2022.',
      data: { x: [2012, 2014, 2016, 2018, 2020, 2022], series: [
        { name: 'Night Market', values: [20, 28, 36, 45, 55, 65] },
        { name: 'Royal Museum', values: [50, 46, 42, 38, 34, 30] },
        { name: 'Botanical Garden', values: [35, 38, 42, 40, 33, 36] } ] },
      labels: ['Night Market', 'Royal Museum', 'Botanical Garden'],
      keyFeatures: ['The Night Market rose strongly and became the most visited', 'The Royal Museum fell steadily', 'The Botanical Garden changed little overall', 'The Night Market overtook the Royal Museum between 2016 and 2018'],
      groupings: [['Night Market'], ['Royal Museum', 'Botanical Garden']],
      source: 'Class assignment A1 (EN31208)',
      fills: {
        visual: 'line graph', what: 'how many people, in thousands, visited three attractions in Lamphun', y1: '2012', y2: '2022',
        groupA: 'the Night Market', groupB: 'the Royal Museum', moveA: 'rose steadily', moveA2: 'climbed', moveB: 'fell gradually', moveB2: 'declined',
        feature: 'the Night Market overtook the Royal Museum between 2016 and 2018, while the Botanical Garden changed little',
        figA1: '20 thousand visitors', figA2: '65 thousand in 2022', figB1: '50 thousand, far more than the Night Market', figB2: '30 thousand by 2022'
      },
      B1: { what: 'the number of visitors to three places in Lamphun, in thousands', moveA: 'went up', moveA2: 'went up', moveB: 'went down', moveB2: 'went down', feature: 'the Night Market had the most visitors at the end' },
      C1: { what: 'visitor numbers, in thousands, at three of Lamphun\'s attractions', moveA: 'grew strongly', moveA2: 'climbed steadily', moveB: 'declined steadily', moveB2: 'slid', feature: 'the Night Market overtook the Royal Museum between 2016 and 2018 to end the period as the clear leader, with the Botanical Garden broadly stable' }
    },
    COMPARE: {
      id: 'scn-compare-chiangrai', type: 'bar', mode: 'COMPARE', level: 'B1', scenario: true,
      title: 'Transport to work in Chiang Rai, 2024', units: '% of workers',
      rubric: 'The bar chart below shows the percentage of men and women in Chiang Rai who used five types of transport to travel to work in 2024.',
      data: { categories: ['Motorbike', 'Car', 'Bus', 'Walking', 'Bicycle'], series: [
        { name: 'Men', values: [46, 25, 12, 12, 5] },
        { name: 'Women', values: [38, 20, 27, 11, 4] } ] },
      labels: ['Motorbike', 'Car', 'Bus', 'Walking', 'Bicycle', 'Men', 'Women'],
      keyFeatures: ['The motorbike was the most common way to travel for both', 'The bicycle was the least common for both', 'Men used most kinds of transport more than women', 'Women used the bus far more than men'],
      groupings: [['Motorbike', 'Car', 'Walking'], ['Bus', 'Bicycle']],
      source: 'Class assignment A2 (EN31208)',
      fills: {
        visual: 'bar chart', what: 'the share of male and female workers in Chiang Rai using five forms of transport to reach their jobs in 2024',
        top: 'the motorbike', bottom: 'the bicycle', groupA: 'the car', groupB: 'walking',
        contrast: 'men used most forms of transport more than women, with the bus as the clear exception',
        topFig: '46% of men and 38% of women', bottomFig: '5% and 4% respectively',
        figA: '25% of men, compared with 20% of women', figB: '12% of men and 11% of women',
        exception: 'the bus, which 27% of women used compared with only 12% of men'
      },
      B1: { what: 'how men and women in Chiang Rai went to work in 2024, in per cent', contrast: 'men used most kinds of transport more than women' },
      C1: { what: 'the share of male and female commuters in Chiang Rai using five modes of transport in 2024', contrast: 'men outnumbered women on almost every mode of transport, the bus being the one clear reversal' }
    },
    SEQUENCE: {
      id: 'scn-seq-coconut', type: 'process', mode: 'SEQUENCE', level: 'B1', scenario: true,
      title: 'Making coconut sugar', units: '',
      rubric: 'The diagram below shows how coconut sugar is produced.',
      data: { shape: 'linear', stages: [
        { n: 1, label: 'Collection', detail: 'sap collected from coconut flowers' },
        { n: 2, label: 'Filtering', detail: 'sap filtered through a cloth' },
        { n: 3, label: 'Boiling', detail: 'boiled in a large pan over a fire' },
        { n: 4, label: 'Stirring', detail: 'stirred until thick' },
        { n: 5, label: 'Moulding', detail: 'thick syrup poured into moulds' },
        { n: 6, label: 'Cooling', detail: 'left to cool and harden' },
        { n: 7, label: 'Packing', detail: 'packed and taken to market' } ] },
      labels: ['collect', 'filter', 'boil', 'stir', 'mould', 'cool', 'pack'],
      keyFeatures: ['Seven stages', 'A linear process', 'It begins with sap from coconut flowers and ends with packed sugar'],
      groupings: [['1', '2', '3', '4'], ['5', '6', '7']],
      source: 'Class assignment A3 (EN31208)',
      fills: {
        visual: 'diagram', product: 'how coconut sugar is produced from the sap of the coconut palm', count: 'seven', shape: 'linear',
        start: 'the collection of sap from coconut flowers', end: 'blocks of sugar packed for the market',
        st1: { clause: 'sap is collected from the flowers of the coconut palm', pp: 'collected from the flowers of the coconut palm', vp: 'is collected from the flowers of the coconut palm' },
        st2: { clause: 'the sap is filtered through a cloth to remove any dirt', pp: 'filtered through a cloth to remove any dirt', vp: 'is filtered through a cloth to remove any dirt' },
        st3: { clause: 'it is boiled in a large pan and stirred until it becomes thick', pp: 'boiled in a large pan and stirred until it becomes thick', vp: 'is boiled in a large pan and stirred until it becomes thick' },
        mid: 'the thick syrup',
        st4: { clause: 'the syrup is poured into small round moulds', pp: 'poured into small round moulds', vp: 'is poured into small round moulds' },
        st5: { clause: 'the syrup is left to cool and harden', pp: 'left to cool and harden', vp: 'is left to cool and harden' },
        st6: { clause: 'the blocks of sugar are packed and taken to local markets', pp: 'packed and taken to local markets', vp: 'are packed and taken to local markets' }
      },
      B1: { product: 'how people make coconut sugar' },
      C1: { product: 'the production of coconut sugar from palm sap', start: 'the harvesting of sap from coconut blossoms' }
    },
    SPACE: {
      id: 'scn-space-banklong', type: 'map', mode: 'SPACE', level: 'B1', scenario: true,
      title: 'Ban Khlong, 1995 and 2020', units: '',
      rubric: 'The maps below show the village of Ban Khlong in 1995 and 2020.',
      data: { panels: [
        { title: '1995', w: 12, h: 8, features: [
          { name: 'Rice fields', x: 0, y: 0, w: 4, h: 4.5, kind: 'green' },
          { name: 'Empty land', x: 4.5, y: 0.3, w: 5.5, h: 2.2, kind: 'open' },
          { name: 'River', x: 11, y: 0, w: 1, h: 8, kind: 'water' },
          { name: 'Temple', x: 5, y: 3, w: 2, h: 1.5, kind: 'building' },
          { name: 'Village houses', x: 7.5, y: 3, w: 2.5, h: 1.5, kind: 'housing' },
          { name: 'Main road', x: 0, y: 4.8, w: 8, h: 0.4, kind: 'road' },
          { name: 'Fishing huts', x: 1, y: 6.1, w: 4, h: 0.8, kind: 'housing' },
          { name: 'Beach', x: 0, y: 6, w: 11, h: 1, kind: 'open' },
          { name: 'Sea', x: 0, y: 7, w: 11, h: 1, kind: 'water' } ] },
        { title: '2020', w: 12, h: 8, features: [
          { name: 'Housing estate', x: 0, y: 0, w: 4, h: 4.5, kind: 'housing' },
          { name: 'Car park', x: 4.5, y: 0.3, w: 5.5, h: 2.2, kind: 'open' },
          { name: 'River', x: 11, y: 0, w: 1, h: 8, kind: 'water' },
          { name: 'Temple', x: 5, y: 3, w: 2, h: 1.5, kind: 'building' },
          { name: 'Village houses', x: 7.5, y: 3, w: 2.5, h: 1.5, kind: 'housing' },
          { name: 'Main road (extended)', x: 0, y: 4.8, w: 11, h: 0.4, kind: 'road' },
          { name: 'Hotel', x: 1, y: 6.1, w: 4, h: 0.8, kind: 'building' },
          { name: 'Beach', x: 0, y: 6, w: 11, h: 1, kind: 'open' },
          { name: 'Sea', x: 0, y: 7, w: 11, h: 1, kind: 'water' } ] } ] },
      labels: ['rice fields', 'housing estate', 'car park', 'temple', 'road', 'huts', 'hotel', 'beach', 'river'],
      keyFeatures: ['The village became a tourist resort', 'The temple and the village houses did not change', 'The fishing huts were replaced by a hotel', 'The rice fields became a housing estate'],
      groupings: [['Fishing huts', 'Hotel', 'Car park'], ['Main road', 'Rice fields', 'Temple']],
      source: 'Class assignment A4 (EN31208)',
      fills: {
        place: 'the seaside village of Ban Khlong', y1: 'in 1995', y2: 'in 2020', change: 'changed from a small fishing village into a busy tourist resort',
        same: 'the temple in the centre', gone: 'a row of fishing huts', where1: 'south, along the beach', newA: 'a large hotel', newB: 'a car park', where2: 'north of the village',
        extended: 'the main road was extended east as far as the river', converted: 'the rice fields in the west', into: 'a housing estate'
      },
      B1: { change: 'became much bigger and busier' },
      C1: { change: 'was transformed from a quiet fishing community into a busy resort', extended: 'the main road was extended eastwards as far as the river' }
    }
  };

  /* The value for one slot, in the shape the student's line needs. */
  S.value = function (mode, key, tier, shape, second) {
    var ch = S.charts[mode]; if (!ch) return '';
    var over = ch[tier] || {}, k2 = key + '2';
    var v = second && (over[k2] || ch.fills[k2]) ? (over[k2] || ch.fills[k2]) : (over[key] != null ? over[key] : ch.fills[key]);
    if (v && typeof v === 'object') v = v[shape] || v.clause || v.pp || v.vp;
    return v || '';
  };

  global.LabScenario = S;
})(window);
