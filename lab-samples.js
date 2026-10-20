/* ===========================================================================
   QUILLMOOR ACADEMY · THE OBSERVATORY (Chart Control, Task 1) — lab-samples.js
   One whole, filled-in sample line for every Design line, at A2 and at B1
   (WP18). Each set is one bank chart (prompts*.js) with a full set of slot
   values and a short frame per line; lab.js fills the frame with the values
   and shows the result under "Show an example" on the line card, with the
   slot words highlighted and the note "From another chart: copy the shape,
   not the words."

   Rules (SKILL.md §5): S1 intro paraphrases the task · the overview starts
   "Overall," and carries no data values · every detail sentence carries a
   figure, date or label · TREND past simple · COMPARE no trend verbs ·
   SEQUENCE present simple (passive for man-made, active for natural) ·
   SPACE compass points + passive change verbs. Every figure, year, name
   and stage is checked against its chart by tools/lab-validate.js (section
   6) with the same rules the app uses on a cast (Template.Data.check).

   The frames are NOT the line examples in lab-content.js (the quick check
   would flag a copy): they are plain sentences a student at that level could
   write. Plain ES5.
   =========================================================================== */
window.LabSamples = {
  note: 'From another chart: copy the shape, not the words.',

  TREND: {
    /* A2 · p-line-phones: smartphone 10% → 95%, basic phone 80% → 5%, 2010–2025 */
    A2: { chart: 'p-line-phones',
      vars: {
        visual: 'line graph',
        what: 'how many teenagers in one country had a smartphone or a basic phone, in per cent',
        y1: '2010', y2: '2025',
        groupA: 'the smartphone figure', groupB: 'the basic phone figure',
        moveA: { text: 'rose a lot', text2: 'went up' }, moveB: { text: 'fell a lot', text2: 'dropped' },
        feature: 'the two lines crossed between 2013 and 2016',
        figA1: '10%', figA2: '95% in 2025', figB1: '80%', figB2: 'only 5% in 2025'
      },
      lines: {
        't-what': 'The {visual} shows {what}.',
        't-when': 'The years are from {y1} to {y2}.',
        't-ov-a': 'Overall, {groupA} {moveA}.',
        't-ov-b': 'But {groupB} {moveB}.',
        't-ov-key': 'Also, {feature}.',
        't-a-start': 'In {y1}, {groupA} was {figA1}.',
        't-a-end': 'Then it {moveA} to {figA2}.',
        't-b-start': '{groupB} started higher than that, at {figB1}.',
        't-b-end': 'It {moveB} to {figB2}.'
      } },
    /* B1 · p-bar-languages: Chinese 40 → 110 thousand, French 50 → 25 thousand, 2010–2025 */
    B1: { chart: 'p-bar-languages',
      vars: {
        visual: 'bar chart',
        what: 'how many secondary students, in thousands, studied three foreign languages in one country',
        y1: '2010', y2: '2025',
        groupA: 'Chinese', groupB: 'French',
        moveA: { text: 'grew strongly', text2: 'climbed' }, moveB: { text: 'declined steadily', text2: 'fell' },
        feature: 'Chinese overtook Japanese as the most studied language after 2015',
        figA1: '40 thousand students', figA2: '110 thousand in 2025', figB1: '50 thousand', figB2: 'just 25 thousand by 2025'
      },
      lines: {
        't-what': 'The {visual} gives information about {what}.',
        't-when': 'The figures cover the years {y1} to {y2}.',
        't-ov-a': 'Overall, the number studying {groupA} {moveA}.',
        't-ov-b': 'In contrast, {groupB} {moveB}.',
        't-ov-key': 'It is also clear that {feature}.',
        't-a-start': 'In {y1}, {groupA} was studied by {figA1}.',
        't-a-end': 'The figure then {moveA} to {figA2}.',
        't-b-start': '{groupB}, on the other hand, began at {figB1}.',
        't-b-end': 'From there it {moveB} to {figB2}.'
      } }
  },

  COMPARE: {
    /* A2 · p-bar-activities (2024): Sport boys 60 / girls 45 · Music 25 / 50 · Coding 40 / 20 */
    A2: { chart: 'p-bar-activities',
      vars: {
        visual: 'bar chart',
        what: 'how many boys and girls at one school picked three activities after school in 2024',
        top: 'sport', bottom: 'coding',
        groupA: 'boys', groupB: 'girls',
        contrast: 'more boys than girls chose sport and coding, but music was more popular with girls',
        topFig: '60 boys and 45 girls', bottomFig: 'only 20 girls',
        figA: '40 chose coding, compared with 20 girls', figB: '50 chose music',
        exception: 'music, which 50 girls chose but only 25 boys'
      },
      lines: {
        'c-what': 'The {visual} shows {what}.',
        'c-ov-ext': 'Overall, {top} was the most popular and {bottom} was the least popular.',
        'c-ov-diff': 'Also, {contrast}.',
        'c-top': '{top} was the top choice, with {topFig}.',
        'c-a': 'Among {groupA}, {figA}.',
        'c-bottom': '{bottom} had the lowest number: {bottomFig}.',
        'c-b': 'For {groupB}, {figB}.',
        'c-exc': 'One exception was {exception}.'
      } },
    /* B1 · p-pie-waste (2023): Food 42 · Plastic 21 · Paper 14 · Other 12 · Glass 7 · Metal 4 (%) */
    B1: { chart: 'p-pie-waste',
      vars: {
        visual: 'pie chart',
        what: 'what kinds of waste the households of one city threw away in 2023, as percentages',
        top: 'food', bottom: 'metal',
        groupA: 'food and plastic', groupB: 'paper, glass, metal and other waste',
        contrast: 'food and plastic together made up most of the waste, while glass and metal were tiny shares',
        topFig: '42%', bottomFig: 'just 4%',
        figA: '21% for plastic', figB: '14% for paper and 12% for other waste',
        exception: 'glass, at only 7%'
      },
      lines: {
        'c-what': 'The {visual} gives a breakdown of {what}.',
        'c-ov-ext': 'Overall, {top} was by far the largest category, whereas {bottom} was the smallest.',
        'c-ov-diff': 'In general, {contrast}.',
        'c-top': '{top} waste made up the largest share, at {topFig}.',
        'c-a': 'Of {groupA}, the smaller share was {figA}.',
        'c-bottom': 'At the bottom of the scale, {bottom} accounted for {bottomFig}.',
        'c-b': 'The figures for {groupB} were small: {figB}.',
        'c-exc': 'The only other category below a tenth was {exception}.'
      } }
  },

  SEQUENCE: {
    /* A2 · p-proc-frog: 5 stages, cyclical — eggs · tadpole · tadpole with legs · froglet · adult frog */
    A2: { chart: 'p-proc-frog',
      vars: {
        visual: 'diagram',
        product: 'how a frog grows from an egg into an adult',
        count: 'five', shape: 'cyclical',
        start: 'the eggs in the water', end: 'the adult frog',
        st1: 'the eggs are laid in the water',
        st2: 'a tadpole hatches from each egg after about ten days',
        st3: 'the tadpole grows back legs and then front legs',
        mid: 'the froglet',
        st4: 'develops lungs and its tail gets shorter',
        st5: 'it becomes an adult frog that lives on land and in water',
        st6: 'the adult frog lays eggs and the cycle starts again'
      },
      lines: {
        's-what': 'The {visual} shows {product}.',
        's-ov-count': 'Overall, this process has {count} steps and is {shape}.',
        's-ov-ends': 'The first step is {start} and the last step is {end}.',
        's-1': 'First, {st1}.',
        's-2': 'Next, {st2}.',
        's-3': 'After that, {st3}.',
        's-4': 'In the second half, {mid} {st4}.',
        's-5': 'Then {st5}.',
        's-6': 'Finally, {st6}.'
      } },
    /* B1 · p-proc-noodles: 7 stages, linear — mixing · rolling · cutting · steaming · frying · cooling · packaging */
    B1: { chart: 'p-proc-noodles',
      vars: {
        visual: 'diagram',
        product: 'the way instant noodles are made in a factory',
        count: 'seven', shape: 'linear',
        start: 'the mixing of flour, water and salt', end: 'the packaging of the finished noodles',
        st1: 'flour, water and salt are mixed into a dough',
        st2: 'the dough is pressed into thin sheets by rollers',
        st3: 'the sheets are cut into wavy strands',
        mid: 'the noodle strands',
        st4: 'are steamed for two minutes',
        st5: 'the noodle blocks are fried in hot oil, and this frying removes the water',
        st6: 'the blocks are cooled by fans before packaging, when a seasoning sachet is added and the packet is sealed'
      },
      lines: {
        's-what': 'The {visual} explains {product}.',
        's-ov-count': 'Overall, making noodles is a {shape} process of {count} stages.',
        's-ov-ends': 'The sequence runs from {start} to {end}.',
        's-1': 'At the first stage, {st1}.',
        's-2': 'After this, {st2}.',
        's-3': 'To complete the first phase, {st3}.',
        's-4': 'In the second phase, {mid} {st4}.',
        's-5': 'Following this, {st5}.',
        's-6': 'In the final stage, {st6}.'
      } }
  },

  SPACE: {
    /* A2 · p-map-thai-town, 2005 → 2025 */
    A2: { chart: 'p-map-thai-town',
      vars: {
        place: 'the centre of a small town in the north-east of Thailand',
        y1: 'in 2005', y2: 'in 2025',
        change: 'became much more modern and built-up',
        same: 'the temple', gone: 'the wooden houses', where1: 'south-west',
        newA: 'townhouses', newB: 'a hospital', where2: 'south-east',
        extended: 'the main road was widened to four lanes',
        converted: 'the open field', into: 'a car park'
      },
      lines: {
        'm-what': 'Here are two maps of {place}, {y1} and {y2}.',
        'm-ov-change': 'Overall, the town {change}.',
        'm-ov-same': 'Only {same} stayed the same.',
        'm-gone': 'In the {where1}, {gone} were knocked down.',
        'm-newA': '{newA} were built there instead.',
        'm-newB': 'The {where2} also got {newB}.',
        'm-ext': 'Another change is that {extended}.',
        'm-conv': '{converted} was turned into {into}.'
      } },
    /* B1 · p-map-beach, 2000 → 2025 */
    B1: { chart: 'p-map-beach',
      vars: {
        place: 'a small village on the coast of southern Thailand',
        y1: 'in 2000', y2: 'in 2025',
        change: 'was transformed from a fishing village into a tourist resort',
        same: 'the temple', gone: 'the fishermen\'s houses', where1: 'west',
        newA: 'a hotel', newB: 'a car park', where2: 'east',
        extended: 'the coconut plantation was reduced to make room for resort villas',
        converted: 'the market', into: 'restaurants and shops'
      },
      lines: {
        'm-what': 'The maps compare {place} {y1} and {y2}.',
        'm-ov-change': 'Overall, the village {change}.',
        'm-ov-same': 'However, {same} was left unchanged.',
        'm-gone': 'In the {where1} of the village, {gone} were demolished.',
        'm-newA': 'They were replaced by {newA}.',
        'm-newB': 'To the {where2}, {newB} was laid out.',
        'm-ext': 'Elsewhere, {extended}.',
        'm-conv': 'Meanwhile, {converted} was converted into {into}.'
      } }
  }
};
