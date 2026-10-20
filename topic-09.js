/* CHART CONTROL — topic-09.js · Module 09 SPACE mode */
(function () {
  var T = window.CONTENT.TOPICS;
  T.push({
    id: 'm09', n: 9, code: 'Module 09', name: 'SPACE mode', art: 'grid',
    cefr: 'A2–B2',
    blurb: 'Maps: compass points, change verbs in the passive, and an overview of what changed and what stayed.',
    levels: [{
      id: 'm09l1', n: 1, name: 'SPACE mode', cefr: 'A2–B2', blurb: 'A map is a chart of places. Describe position, then change.',
      subs: [
        { id: 'm09s1', name: 'Compass and position', cefr: 'A2–B1',
          theory: {
            key: 'Say where things are with compass points and position phrases, never <em>left</em> and <em>right</em>.',
            body: [
              '<p>A map task asks you to compare two pictures of the same place. Before you can say what changed, you need to say <strong>where</strong> things are. The examiner reads the map with north at the top, so use the compass: <em>in the north</em>, <em>to the south of the river</em>, <em>in the south-west corner</em>, <em>along the eastern edge</em>. Words like <em>left</em>, <em>right</em>, <em>above</em> and <em>below</em> describe the paper, not the town, and they sound like a child giving directions.</p>',
              '<p>Add the position phrases that fix one feature against another: <em>adjacent to</em> (right next to), <em>opposite</em> (facing, across a road or river), <em>next to</em>, <em>along</em> (following a line, such as a road), <em>between</em>, <em>in the centre of</em>, <em>on the site of</em>. Verbs for position are simple: <em>was located</em>, <em>was situated</em>, <em>stood</em>, <em>occupied</em>, <em>ran</em> (for roads and rivers).</p>',
              '<p>On the Riverside maps, the river runs along the northern edge and the main road runs north to south through the centre. In 1995 the factory occupied the east, the car park and bus station were in the west, and the park was in the south-west corner. Practise reading a map aloud in these words before you write a sentence.</p>'
            ],
            simple: [
              '<p>North is at the top. Say <em>in the north</em>, <em>to the east of</em>, <em>in the south-west</em>. Do not say <em>left</em> or <em>right</em>.</p>',
              '<p>Useful phrases: <em>next to</em>, <em>adjacent to</em>, <em>opposite</em>, <em>along the road</em>, <em>in the centre</em>.</p>',
              '<p>Verbs: <em>was located</em>, <em>stood</em>, <em>ran</em> (a road or river runs).</p>'
            ],
            examples: [
              { s: 'In 1995 the factory was located to the east of the main road, opposite the cinema.', g: 'Compass point plus a position phrase fixes the factory exactly.' },
              { s: 'The river runs along the northern edge of the town centre, and a bridge carries the main road across it.', g: '<em>Runs along</em> for a river; <em>across</em> for a bridge.' },
              { s: '<s>The park is on the left at the bottom of the map.</s>', g: 'Paper directions. Say <em>in the south-west corner</em>.' }
            ]
          },
          items: [
            { id: 'm09s1q1', type: 'choose', tag: 'lr-map-vocab', level: 'A2', chart: 'p-map-riverside',
              stem: 'In 1995, where was the factory?',
              options: ['To the west of the main road', 'To the east of the main road', 'To the north of the river', 'In the south-west corner'], answer: 1,
              why: 'The main road runs north to south through the centre, and the factory sits on its eastern side. Compass points are read with north at the top.' },
            { id: 'm09s1q2', type: 'choose', tag: 'lr-map-vocab', level: 'A2',
              stem: 'Which phrase should you avoid when describing position on a map?',
              options: ['in the south-west corner of', 'adjacent to', 'on the left-hand side', 'opposite'], answer: 2,
              why: '<em>Left</em> and <em>right</em> describe the page, not the place. Use compass points and phrases like <em>adjacent to</em> or <em>opposite</em>, which describe the town itself.' },
            { id: 'm09s1q3', type: 'spot', tag: 'lr-map-vocab', level: 'B1', chart: 'p-map-riverside',
              stem: 'Tap the wrong chunk in this sentence about the 1995 map.',
              words: ['In 1995', 'the bus station', 'was located', 'to the north of', 'the car park,', 'in the west', 'of the town.'], answer: 3, fix: 'to the south of',
              why: 'The car park is nearer the river; the bus station sits directly below it on the map, which means <em>to the south of</em> it. Check the compass before you write the phrase.' },
            { id: 'm09s1q4', type: 'judge', tag: 'lr-map-vocab', level: 'A2', chart: 'p-map-riverside',
              given: 'The river runs along the northern edge of the town centre.',
              stem: 'Is this sentence true of the maps?',
              answer: 0,
              why: 'The river crosses the whole top of both maps, so it forms the northern edge. <em>Runs along</em> is the natural verb for a river or a road.' },
            { id: 'm09s1q5', type: 'choose', tag: 'lr-map-vocab', level: 'B1', chart: 'p-map-school',
              stem: 'On the current campus map, where is the car park in relation to the main building?',
              options: ['To the east of it', 'To the south of it', 'To the west of it', 'In the centre of the campus'], answer: 0,
              why: 'The main building and the car park share the northern strip, with the car park on the eastern side. When two features are side by side, name the compass direction between them.' },
            { id: 'm09s1q6', type: 'sort', tag: 'cc-grouping', level: 'B1', chart: 'p-map-school',
              stem: 'Sort the features of the planned campus by where they will be.',
              bins: [
                { key: 'n', label: 'North', hint: 'Top strip' },
                { key: 'c', label: 'Centre', hint: 'Middle strip' },
                { key: 's', label: 'South', hint: 'Bottom strip' }
              ],
              items: [
                { text: 'Main building', bin: 'n' },
                { text: 'Garden', bin: 'n' },
                { text: 'Extended canteen', bin: 'c' },
                { text: 'New car park', bin: 'c' },
                { text: 'New library', bin: 's' },
                { text: 'Reduced sports field', bin: 's' }
              ],
              why: 'Grouping by area (north, centre, south) is one of the two ways to organise a map report. Once the groups are named, each becomes a paragraph or part of one.' },
            { id: 'm09s1q7', type: 'build', tag: 'lr-map-vocab', level: 'B1', chart: 'p-map-riverside',
              stem: 'Build a sentence about the position of the park in 1995.',
              tiles: ['In 1995,', 'the park', 'was situated', 'in the south-west', 'of the town,', 'to the south of', 'the bus station.'],
              solution: 'In 1995, the park was situated in the south-west of the town, to the south of the bus station.',
              alt: [],
              why: 'Time phrase, feature, position verb, compass point, then a second phrase that fixes it against a neighbour. That is the full position sentence for a map.' }
          ] },
        { id: 'm09s2', name: 'Change verbs and tenses', cefr: 'B1–B2',
          theory: {
            key: 'Map changes are written in the passive: <em>was demolished</em>, <em>has been converted into</em>, <em>will be built</em>. The tense follows the two dates.',
            body: [
              '<p>Nobody on a map does anything, so the natural voice is the <strong>passive</strong>: <em>the factory was demolished</em>, <em>the car park was converted into a shopping mall</em>, <em>a ring road was built</em>. The change verbs form a small kit: <em>built, constructed, added, demolished, knocked down, removed, converted into, turned into, redeveloped as, extended, expanded, replaced by, relocated to, pedestrianised, cleared, planted</em>. Learn them as past participles.</p>',
              '<p>The tense comes from the titles of the two maps. Two past dates (1995 and 2025): past simple, <em>was demolished</em>. A past map and a map of <em>now</em> or <em>today</em>: present perfect for the change, <em>has been converted</em>, and present simple for what is there now, <em>a mall now occupies the site</em>. A map of now and a <em>plan</em> or <em>proposal</em>: future passive, <em>will be built</em>, <em>is to be relocated</em>. Writing <em>has been moved</em> about a plan tells the examiner the change already happened, which is inaccurate.</p>',
              '<p>Two useful shapes. First, <em>X was replaced by Y</em> and <em>X was converted into Y</em> say old and new in one sentence. Second, <em>Y was built on the site of X</em> and <em>X was demolished to make way for Y</em> do the same from the other side. Use both so that the paragraph does not repeat one pattern.</p>'
            ],
            simple: [
              '<p>Use the passive: <em>was built</em>, <em>was demolished</em>, <em>was converted into</em>, <em>was extended</em>.</p>',
              '<p>Two past dates: <em>was</em>. Past and now: <em>has been</em>. Now and a plan: <em>will be</em>.</p>',
              '<p>Say old and new together: <em>The factory was replaced by apartment blocks.</em></p>'
            ],
            examples: [
              { s: 'The factory in the east was demolished and replaced by a group of apartment blocks.', g: 'Two past dates, so past simple passive. Old and new in one sentence.' },
              { s: 'A new library will be built in the south of the campus, on part of the sports field.', g: 'A plan, so future passive.' },
              { s: '<s>The council demolished the cinema and built a square.</s>', g: 'The map does not show who did it. Use the passive: <em>the cinema was demolished</em>.' }
            ]
          },
          items: [
            { id: 'm09s2q1', type: 'choose', tag: 'gra-passive', level: 'B1', chart: 'p-map-riverside',
              stem: 'The factory ___ and replaced by apartment blocks.',
              options: ['was demolishing', 'was demolished', 'has demolished', 'demolished'], answer: 1,
              why: 'The factory did not do anything; something was done to it. Past simple passive, <em>was demolished</em>, because both maps are dated in the past.' },
            { id: 'm09s2q2', type: 'choose', tag: 'gra-tense', level: 'B1', chart: 'p-map-school',
              stem: 'According to the plan, a new library ___ in the south of the campus.',
              options: ['was built', 'has been built', 'is building', 'will be built'], answer: 3,
              why: 'The second map is a plan, not a record. Future passive, <em>will be built</em> or <em>is to be built</em>, tells the examiner that the change has not happened yet.' },
            { id: 'm09s2q3', type: 'spot', tag: 'gra-passive', level: 'B2', chart: 'p-map-riverside',
              stem: 'Tap the wrong chunk.',
              words: ['Between 1995 and 2025', 'the car park', 'in the west', 'has converted', 'into a', 'shopping mall.'], answer: 3, fix: 'was converted',
              why: 'A car park cannot convert itself. The passive needs <em>be</em> plus the past participle: <em>was converted</em> (two past dates) or <em>has been converted</em> (up to now).' },
            { id: 'm09s2q4', type: 'choose', tag: 'lr-map-vocab', level: 'B1', chart: 'p-map-riverside',
              stem: 'The park in the south-west was ___ eastwards, so it now stretches further east.',
              options: ['extended', 'relocated', 'demolished', 'pedestrianised'], answer: 0,
              why: 'The park stayed where it was and grew, which is <em>extended</em> or <em>expanded</em>. <em>Relocated</em> would mean it moved to a new site.' },
            { id: 'm09s2q5', type: 'judge', tag: 'gra-tense', level: 'B2', chart: 'p-map-school',
              given: 'The car park has been moved from the north-east to the centre of the campus.',
              stem: 'Is this tense correct for the school maps, which show the present and a plan?',
              answer: 1,
              why: '<em>Has been moved</em> says the change has already happened. The second map is a plan, so write <em>will be moved</em> or <em>is to be relocated</em>. Tense errors on maps count as inaccurate content.' },
            { id: 'm09s2q6', type: 'build', tag: 'gra-passive', level: 'B2', chart: 'p-map-riverside',
              stem: 'Build a sentence about the cinema.',
              tiles: ['The cinema', 'in the centre', 'was knocked down', 'to make way for', 'a pedestrian square', 'with cafés.'],
              solution: 'The cinema in the centre was knocked down to make way for a pedestrian square with cafés.',
              alt: [],
              why: '<em>Was knocked down to make way for</em> gives the old feature, the change and the new feature in one passive sentence. It is a good alternative to <em>was replaced by</em>.' },
            { id: 'm09s2q7', type: 'choose', tag: 'lr-map-vocab', level: 'B2', chart: 'p-map-riverside',
              stem: 'The main road south of the bridge was ___, so cars can no longer use it.',
              options: ['relocated', 'partly reconstructed', 'pedestrianised', 'widened'], answer: 2,
              why: '<em>Pedestrianised</em> means closed to traffic and given to people on foot. The road is still there on the 2025 map; only its use changed.' }
          ] },
        { id: 'm09s3', name: 'The overview of a map', cefr: 'B2',
          theory: {
            key: 'The map overview says what kind of change happened overall and names what stayed the same.',
            body: [
              '<p>A map report needs an overview just as much as a line graph does, and students forget it more often because there are no trends to summarise. Ask the SPACE headline questions: what is the <strong>overall character</strong> of the change (more residential, more commercial, more green, more built-up, more tourist-oriented)? What was <strong>removed</strong>, what was <strong>added</strong>, and what was <strong>kept</strong>? Two or three sentences, beginning <em>Overall</em>, no measurements.</p>',
              '<p>For Riverside: <em>Overall, the town centre was transformed from a mixed industrial and commercial area into a largely residential and leisure-oriented one, and traffic was moved out of the centre, although the river, bridge and bus station remained in place.</em> Note that what stayed the same is a legitimate key feature. An examiner expects you to notice the bus station that did not move.</p>',
              '<p>Then group the changes for the two detail paragraphs. Either by <strong>area</strong> (the east, then the west and centre; or north of the road, then south) or by <strong>type of change</strong> (sites that were redeveloped; transport and open space). Do not walk through the map feature by feature, and do not describe the whole 1995 map and then the whole 2025 map, because that leaves the comparison to the reader.</p>'
            ],
            simple: [
              '<p>Start with <em>Overall</em>. Say what kind of place it became: more houses, more shops, more tourism, more green space.</p>',
              '<p>Say what was removed, what was added, and what stayed the same.</p>',
              '<p>Then group the changes: by area (east / west) or by type (buildings / roads and parks).</p>'
            ],
            examples: [
              { s: 'Overall, the centre changed from industrial and commercial use to housing and leisure, and traffic was moved out, although the river, bridge and bus station remained.', g: 'Character of change, what moved, what stayed. No measurements.' },
              { s: 'Overall, the village was transformed from a fishing community into a tourist resort, while the temple and the beach were unchanged.', g: 'The coastal village in one sentence: the headline and the exception.' },
              { s: '<s>Overall, there were many changes to the town between 1995 and 2025.</s>', g: 'Too vague. Name the kind of change.' }
            ]
          },
          items: [
            { id: 'm09s3q1', type: 'choose', tag: 'ta-no-overview', level: 'B1', chart: 'p-map-riverside',
              stem: 'Which is the best overview sentence for the Riverside maps?',
              options: [
                'Overall, the factory became apartments and the car park became a shopping mall.',
                'Overall, there were many changes to the town centre, although several things stayed the same.',
                'Overall, the town became a much nicer place, with more places to relax.',
                'Overall, the centre changed from industry to housing and leisure, and traffic was moved out.'
              ], answer: 3,
              why: 'Option D gives the character of the change. Option A lists two details, option B is too vague to be a key feature, and option C is an opinion.' },
            { id: 'm09s3q2', type: 'judge', tag: 'ta-no-overview', level: 'B2', chart: 'p-map-riverside',
              given: 'Overall, the river, the bridge and the bus station remained in place.',
              stem: 'True or false: this sentence belongs in the overview.',
              answer: 0,
              why: 'What stayed the same is a key feature of a map. Naming it shows the examiner you compared both maps fully, not just the parts that changed.' },
            { id: 'm09s3q3', type: 'judge', tag: 'ta-no-overview', level: 'B2', chart: 'p-map-riverside',
              given: 'Overall, the centre was redeveloped because the factory closed and the council wanted more housing.',
              stem: 'True or false: this is an acceptable overview sentence.',
              answer: 1,
              why: 'The maps show what changed, never why. Reasons are invented material and cost Task Achievement marks. Report the change: <em>the factory was replaced by housing</em>.' },
            { id: 'm09s3q4', type: 'sort', tag: 'cc-grouping', level: 'B2', chart: 'p-map-riverside',
              stem: 'Sort the 2025 changes into the two detail paragraphs.',
              bins: [
                { key: 'sites', label: 'Paragraph 3: sites redeveloped', hint: 'Old building, new building' },
                { key: 'move', label: 'Paragraph 4: traffic and open space', hint: 'Roads and the park' }
              ],
              items: [
                { text: 'The factory was replaced by apartment blocks.', bin: 'sites' },
                { text: 'The main road was pedestrianised south of the bridge.', bin: 'move' },
                { text: 'The car park was converted into a shopping mall.', bin: 'sites' },
                { text: 'The park was extended eastwards.', bin: 'move' },
                { text: 'The cinema and shops became a pedestrian square.', bin: 'sites' },
                { text: 'A ring road was built around the south of the town.', bin: 'move' }
              ],
              why: 'Grouping by type of change gives two clear paragraphs: buildings that were redeveloped, then traffic and green space. Either grouping works as long as it is decided before you write.' },
            { id: 'm09s3q5', type: 'choose', tag: 'cc-grouping', level: 'B2', chart: 'p-map-beach',
              stem: 'Which plan for the two detail paragraphs works best for the coastal village?',
              options: [
                'One paragraph per building, in the order they appear on the map',
                'The seafront changes, then the changes inland',
                'Everything on the 2000 map, then everything on the 2025 map',
                'The sea and the beach, then the temple'
              ], answer: 1,
              why: 'Grouping by area (seafront, then inland) keeps each paragraph about one part of the village. Describing each map separately leaves the comparison to the reader, which is what "mechanical" means.' },
            { id: 'm09s3q6', type: 'choose', tag: 'ta-no-overview', level: 'B2', chart: 'p-map-lake',
              stem: 'Which overview sentence is true of the lakeside maps?',
              options: [
                'Overall, the lake was drained and the whole village was moved further to the north.',
                'Overall, the entire forest was cleared to make way for a golf course and hotel.',
                'Overall, farmland and forest gave way to housing and leisure; the lake and village stayed.',
                'Overall, the whole area became a protected nature reserve and farming continued exactly as before.'
              ], answer: 2,
              why: 'Only half of the forest became a golf course, the lake is still there, and farmland shrank rather than continuing as before. Check each general claim against both maps before you write it.' },
            { id: 'm09s3q7', type: 'overview', tag: 'ta-no-overview', level: 'B2', chart: 'p-map-riverside',
              stem: 'Write the overview for the Riverside maps: the character of the change, what happened to traffic, and what stayed the same.',
              must: [
                ['industrial', 'factory', 'residential', 'housing', 'apartment', 'apartments', 'leisure', 'shopping'],
                ['traffic', 'road', 'pedestrian', 'pedestrianised', 'cars'],
                ['remain', 'remained', 'remains', 'unchanged', 'same', 'stayed', 'kept', 'still']
              ],
              minWords: 20, maxWords: 70,
              why: 'A strong map overview says what kind of place the centre became, mentions the move of traffic out of the centre, and names one thing that did not change.' }
          ] }
      ],
      check: { id: 'm09ck', name: 'Systems Check', items: [
        { id: 'm09ckq1', type: 'choose', tag: 'lr-map-vocab', level: 'A2', chart: 'p-map-riverside',
          stem: 'In 2025, the shopping mall is ___ the bus station.',
          options: ['to the south of', 'to the north of', 'to the east of', 'opposite'], answer: 1,
          why: 'The mall sits on the old car park site, nearer the river; the bus station is directly below it. Nearer the top of the map means further north.' },
        { id: 'm09ckq2', type: 'spot', tag: 'gra-passive', level: 'B1', chart: 'p-map-riverside',
          stem: 'Tap the wrong chunk.',
          words: ['In 1995', 'a factory', 'occupied the east,', 'but by 2025', 'it had replaced', 'by apartment blocks.'], answer: 4, fix: 'it had been replaced',
          why: 'The factory was the thing replaced, so the verb must be passive: <em>had been replaced by</em>. Without <em>been</em>, the sentence says the factory replaced something.' },
        { id: 'm09ckq3', type: 'choose', tag: 'gra-tense', level: 'B1', chart: 'p-map-school',
          stem: 'Which sentence is correct about the planned change to the sports field?',
          options: ['The sports field was reduced in size.', 'The sports field has been reduced in size.', 'The sports field is reducing in size.', 'The sports field will be reduced in size.'], answer: 3,
          why: 'The second map is a plan, so the change lies in the future: <em>will be reduced</em>. Past and present perfect would both claim that it has already happened.' },
        { id: 'm09ckq4', type: 'judge', tag: 'ta-no-overview', level: 'B2', chart: 'p-map-riverside',
          given: 'Overall, the most significant change was in the east, where the factory was replaced by apartment blocks.',
          stem: 'True or false: an overview may name the single biggest change like this.',
          answer: 0,
          why: 'Naming the most significant change, without measurements, is exactly what an overview does. Add the overall character of the change and what stayed the same, and the overview is complete.' },
        { id: 'm09ckq5', type: 'sort', tag: 'cc-grouping', level: 'B2', chart: 'p-map-beach',
          stem: 'Sort the features of the coastal village.',
          bins: [
            { key: 'chg', label: 'Replaced or changed', hint: 'Different in 2025' },
            { key: 'same', label: 'Stayed the same', hint: 'Identical on both maps' }
          ],
          items: [
            { text: 'Fishermen\'s houses', bin: 'chg' },
            { text: 'Temple', bin: 'same' },
            { text: 'Market', bin: 'chg' },
            { text: 'Beach', bin: 'same' },
            { text: 'Open ground', bin: 'chg' },
            { text: 'Sea', bin: 'same' }
          ],
          why: 'The houses became a hotel, the market became restaurants and shops, and the open ground became a car park. The temple, beach and sea did not change, and one sentence about them belongs in the overview.' },
        { id: 'm09ckq6', type: 'build', tag: 'gra-passive', level: 'B2', chart: 'p-map-beach',
          stem: 'Build a sentence about the coconut plantation.',
          tiles: ['Most of', 'the coconut plantation', 'in the south', 'was cleared', 'to make room for', 'resort villas.'],
          solution: 'Most of the coconut plantation in the south was cleared to make room for resort villas.',
          alt: [],
          why: '<em>Most of</em> is accurate because part of the plantation survives in the south-east. <em>Was cleared to make room for</em> gives the old use, the change and the new use.' },
        { id: 'm09ckq7', type: 'choose', tag: 'lr-map-vocab', level: 'B2',
          stem: 'Which phrase describes a road that cars can no longer use?',
          options: ['was pedestrianised', 'was completely rebuilt', 'was relocated', 'was extended'], answer: 0,
          why: '<em>Pedestrianised</em> is the one map verb that means closed to traffic. The other three describe a road that still carries cars.' },
        { id: 'm09ckq8', type: 'choose', tag: 'ta-no-overview', level: 'B2', chart: 'p-map-lake',
          stem: 'Which feature of the lakeside maps belongs in the overview?',
          options: ['The exact size of the golf course', 'The reason the hotel was built next to the lake', 'The shift from farming to housing and leisure', 'The name of the village'], answer: 2,
          why: 'The overview states the character of the change. Sizes are measurements, reasons are not shown, and names are not features.' }
      ] }
    }]
  });
})();
