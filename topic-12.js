/* CHART CONTROL — topic-12.js · Module 12 Cohesion */
(function () {
  var T = window.CONTENT.TOPICS;
  T.push({
    id: 'm12', n: 12, code: 'Module 12', name: 'Cohesion', art: 'chip',
    cefr: 'B1–C1',
    blurb: 'Refer back instead of repeating, link with meaning instead of connectors, and join sentences with a clause.',
    levels: [{
      id: 'm12l1', n: 1, name: 'Cohesion', cefr: 'B1–C1', blurb: 'The invisible links that make a report easy to read.',
      subs: [
        { id: 'm12s1', name: 'Reference and substitution', cefr: 'B1–B2',
          theory: {
            key: 'Refer back instead of repeating: <em>this figure</em>, <em>the former / the latter</em>, <em>both</em>, <em>respectively</em>, <em>over the same period</em>.',
            body: [
              '<p>The Band 6 report repeats the category name in every sentence: <em>The zoo had 300,000 visitors. The zoo fell to 280,000. The zoo …</em> The Band 7 descriptor for Coherence and Cohesion asks for a "flexible" use of <strong>reference and substitution</strong>, which simply means pointing back to something already named instead of naming it again.</p>',
              '<p>Four tools cover almost every case. <em>It / its</em> and <em>this figure / this number</em> point back to the last thing named. <em>The former / the latter</em> pick the first and second of two items just mentioned. <em>Both</em> and <em>the two</em> gather a pair. <em>Respectively</em> matches two figures to two names in the same order, so one sentence does the work of two: <em>Peru and Chile exported 2.1 and 1.8 million tonnes respectively.</em></p>',
              '<p>Time and place can be referred back too: <em>over the same period</em>, <em>in the same year</em>, <em>in each country</em>, <em>in this group</em>. Aim for at least two reference tools in every report, and check that each one points clearly at one thing. A reference that could mean two things is worse than repeating the noun.</p>'
            ],
            simple: [
              '<p>Do not write the same name in every sentence. Point back with <em>it</em>, <em>this figure</em>, <em>the former / the latter</em>, <em>both</em>.</p>',
              '<p><em>Respectively</em> matches two numbers to two names in order: <em>A and B were 10 and 20 respectively.</em></p>',
              '<p>Time links: <em>over the same period</em>, <em>in the same year</em>.</p>'
            ],
            examples: [
              { s: 'The aquarium received 300,000 visitors in 2015, and this figure had risen to 450,000 by 2025.', g: '<em>This figure</em> points back to 300,000 without repeating it.' },
              { s: 'North School and South School had similar numbers of students in 2015; however, the former grew to 900 by 2025 and the latter fell to 600.', g: '<em>The former</em> = North School, <em>the latter</em> = South School, in the order they were named.' },
              { s: '<s>The library had 80,000 visitors in 2010, but the library fell to 55,000 by 2020.</s>', g: 'Repeated name. Write <em>but it fell</em>.' }
            ]
          },
          items: [
            { id: 'm12s1q1', type: 'choose', tag: 'cc-reference', level: 'A2', chart: 'p-line-museums',
              stem: 'Which word replaces the repeated name? "The Art Gallery began at 610,000, but the Art Gallery fell to 520,000."',
              options: ['they', 'it', 'this', 'which'], answer: 1,
              hint: 'How many galleries are being referred to? Choose the word that can stand alone as the subject of fell.',
              why: '<em>It</em> points back to the Art Gallery, a single thing. Repeating the full name in every sentence is the clearest sign of Band 6 cohesion.' },
            { id: 'm12s1q2', type: 'choose', tag: 'cc-reference', level: 'B1', chart: 'p-table-salaries',
              stem: 'Korea and Japan had similar starting salaries; however, ___ worked 43 hours a week and ___ 54.',
              options: ['the latter … the former', 'both of them … each of them', 'the former … the latter', 'one … the other'], answer: 2,
              hint: 'Which country is named first in the sentence, and which one worked 43 hours? Match them.',
              why: 'Korea was named first, so it is <em>the former</em> (43 hours); Japan, named second, is <em>the latter</em> (54 hours). The order of naming decides.' },
            { id: 'm12s1q3', type: 'build', tag: 'cc-reference', level: 'B1', chart: 'p-bar-screentime',
              stem: 'Build a sentence that uses <em>respectively</em>.',
              tiles: ['Teenagers and', 'people aged 50 and over', 'spent 21 and', 'six hours a week', 'on social media', 'respectively.'],
              solution: 'Teenagers and people aged 50 and over spent 21 and six hours a week on social media respectively.',
              alt: [],
              hint: 'Sort the tiles into names, figures and the activity. Where does the reference word go in a sentence like this?',
              why: 'Two names, then two figures in the same order, then <em>respectively</em>. One sentence carries a comparison and two figures.' },
            { id: 'm12s1q4', type: 'choose', tag: 'cc-reference', level: 'B1', chart: 'p-pie-energy',
              stem: 'Coal fell from 48% to 18%, while natural gas rose from 22% to 30% ___.',
              options: ['over the same period', 'in the same year', 'at the same rate', 'for exactly the same reason'], answer: 0,
              hint: 'Look at the time frame of both changes. Which phrase refers back to that time frame correctly?',
              why: 'Both changes happened between 2000 and 2020, so <em>over the same period</em> refers back to the time frame without repeating the years.' },
            { id: 'm12s1q5', type: 'spot', tag: 'cc-reference', level: 'B2', chart: 'p-line-internet',
              stem: 'Tap the chunk that points at the wrong country.',
              words: ['Sweden and Japan', 'were both', 'above 90%', 'by 2020,', 'and the former,', 'Japan,', 'reached 95%', 'in 2025.'], answer: 4, fix: 'and the latter,',
              hint: 'Note the order in which Sweden and Japan are named. Then check which reference word should point at each one.',
              why: 'Japan was named second, so it is <em>the latter</em>. A reference word that points at the wrong item confuses the reader more than repeating the name would.' },
            { id: 'm12s1q6', type: 'spot', tag: 'gra-punctuation', level: 'B1', chart: 'p-table-salaries',
              stem: 'The reference words are right. Tap the chunk with the punctuation error.',
              words: ['Korea and Japan', 'had similar', 'starting salaries.', 'However the former', 'worked 43 hours', 'and the latter 54.'], answer: 3, fix: 'However, the former',
              hint: 'Korea really did come first. Read each sentence from its first word and check the punctuation wherever a new part begins.',
              why: 'A connector that opens a sentence takes a comma: <em>However, the former …</em>. The reference words are right: Korea was named first, so it is <em>the former</em>.' },
            { id: 'm12s1q7', type: 'choose', tag: 'cc-reference', level: 'B2', chart: 'p-line-museums',
              stem: 'The Science Museum received 420,000 visitors in 2010; ___ had risen to 760,000 by 2020.',
              options: ['these figures', 'this museum', 'this figure', 'those visitors'], answer: 2,
              hint: 'Read the sentence with each option in the blank. Which one makes sense as the subject of had risen to 760,000?',
              why: '<em>This figure</em> points back to 420,000, and it is the figure, not the museum, that nearly doubled. Choose the reference word that matches what actually changed.' }
          ] },
        { id: 'm12s2', name: 'Fewer connectors, better links', cefr: 'B1–B2',
          theory: {
            key: 'A connector on every sentence is "mechanical". Link with meaning: contrast, time and reference words.',
            body: [
              '<p>Students are often taught that more linking words mean better cohesion. The opposite is true. The Band 6 descriptor says cohesion may be "faulty or mechanical" because of "overuse", and a paragraph that goes <em>Firstly … Secondly … Moreover … In addition … Finally</em> is the classic example. The connectors are counting sentences, not linking ideas.</p>',
              '<p>Good links carry meaning. For contrast: <em>in contrast</em>, <em>by contrast</em>, <em>however</em>, <em>whereas</em>, <em>while</em>. For time: <em>the following year</em>, <em>over the next decade</em>, <em>by 2020</em>. For reference: <em>this figure</em>, <em>the same period</em>, <em>the latter</em>. Use a connector only when the relationship between two sentences needs naming, and choose the one that names it correctly: <em>moreover</em> adds a similar point, so it cannot introduce a contrast.</p>',
              '<p>Punctuate connectors carefully. A connector that opens a sentence takes a comma: <em>However, tea fell.</em> A full sentence cannot be joined to another with only a comma: <em>Rice rose, however, tea fell</em> is a comma splice. Use a full stop or a semicolon before <em>however</em>, or join the sentences with <em>whereas</em> or <em>while</em> instead.</p>'
            ],
            simple: [
              '<p>Do not start every sentence with <em>Firstly</em>, <em>Moreover</em>, <em>In addition</em>. That is mechanical.</p>',
              '<p>Use links that mean something: <em>In contrast</em>, <em>The following year</em>, <em>Over the same period</em>.</p>',
              '<p><em>However</em> starts a new sentence and takes a comma. Do not join two sentences with only a comma.</p>'
            ],
            examples: [
              { s: 'Sales peaked at 50,000 in 2018. The following year, however, the figure fell to 32,000.', g: 'A time phrase does the linking; <em>however</em> sits inside the sentence.' },
              { s: 'Bus use fell from 40% to 25%. In contrast, cycling rose from 5% to 15% over the same period.', g: 'The connector names the relationship: contrast.' },
              { s: '<s>Firstly, coal fell. Secondly, gas rose. Thirdly, wind and solar rose. Finally, nuclear stayed the same.</s>', g: 'Counting words, not linking words.' }
            ]
          },
          items: [
            { id: 'm12s2q1', type: 'choose', tag: 'cc-linking-overuse', level: 'B1',
              stem: 'Which set of sentence openers sounds mechanical?',
              options: [
                'Firstly … Secondly … Thirdly … Finally …',
                'In 2010 … By 2020 … Over the same period …',
                'The Science Museum … Its numbers … In contrast, the Art Gallery …',
                'Coal, which … Natural gas, meanwhile, …'
              ], answer: 0,
              hint: 'Think about what each set of openers tells the reader about the link between one sentence and the next.',
              why: 'Numbering sentences links nothing. The other openers carry time, reference or contrast, which is what the Band 7 descriptor means by cohesive devices used "flexibly".' },
            { id: 'm12s2q2', type: 'spot', tag: 'cc-linking-overuse', level: 'B1', chart: 'p-pie-energy',
              stem: 'Tap the connector that names the wrong relationship.',
              words: ['Coal fell', 'from 48% to 18%.', 'Moreover,', 'natural gas rose', 'from 22% to 30%', 'over the same period.'], answer: 2, fix: 'In contrast,',
              hint: 'Compare what happened to coal and to gas in the two pies. Then read each chunk of the sentence again.',
              why: '<em>Moreover</em> adds a point in the same direction. A fall followed by a rise is a contrast, so the connector must say so: <em>In contrast</em> or <em>By contrast</em>.' },
            { id: 'm12s2q3', type: 'choose', tag: 'cc-linking-overuse', level: 'B1', chart: 'p-line-museums',
              stem: 'The Science Museum rose from 420,000 to 760,000. ___ the Art Gallery fell from 610,000 to 520,000. Best link?',
              options: ['Secondly,', 'By contrast,', 'In the same way,', 'As a result,'], answer: 1,
              hint: 'Compare the direction of the two museum lines. Then think about what each link would tell the reader.',
              why: 'One line rose and the other fell, so the relationship is contrast. <em>As a result</em> would invent a cause the graph does not show.' },
            { id: 'm12s2q4', type: 'choose', tag: 'gra-punctuation', level: 'B2', chart: 'p-pie-energy',
              stem: 'Which sentence is punctuated correctly?',
              options: ['Coal fell sharply, however, natural gas rose.', 'Coal fell sharply, however gas rose.', 'Coal fell sharply however, gas rose.', 'Coal fell sharply. However, gas rose.'], answer: 3,
              hint: 'Count the full sentences in each option. How can two full sentences be separated or joined correctly?',
              why: '<em>However</em> cannot join two full sentences with a comma; that is a comma splice. Start a new sentence (or use a semicolon) and put a comma after <em>However</em>.' },
            { id: 'm12s2q5', type: 'judge', tag: 'cc-linking-overuse', level: 'B2', chart: 'p-line-cities',
              given: 'Lagos grew fastest and is projected to reach 24 million by 2040. Osaka, by contrast, peaked in 2010 and is projected to keep declining slightly. Bangkok, meanwhile, rose steadily from 7.4 to 11.1 million between 1990 and 2025.',
              stem: 'True or false: this paragraph shows good cohesion.',
              answer: 0,
              hint: 'Find each linking phrase in the paragraph and name the relationship it shows. Does each one match the city lines?',
              why: 'True. Each link carries meaning: <em>by contrast</em> marks the change of direction, and <em>meanwhile</em> moves to a third city over the same time. No counting words such as <em>Firstly</em> or <em>Secondly</em> are needed.' },
            { id: 'm12s2q6', type: 'choose', tag: 'cc-linking-overuse', level: 'B2', chart: 'p-table-salaries',
              stem: 'Thai teachers started on $9,000. ___ German teachers started on $62,000, nearly seven times as much.',
              options: ['In addition,', 'Furthermore,', 'For this reason,', 'In contrast,'], answer: 3,
              hint: 'Compare the Thai and German salaries, then think about what each connector would tell the reader.',
              why: 'The lowest and highest salaries stand in contrast. <em>In addition</em> and <em>furthermore</em> add similar points; <em>for this reason</em> claims a cause.' },
            { id: 'm12s2q7', type: 'order', tag: 'cc-linking-overuse', level: 'B2', chart: 'p-bar-tourists',
              stem: 'Put the sentences in order. Notice that time phrases, not numbering words, carry the reader forward.',
              items: [
                'Arrivals rose steadily from 29.9 million in 2015 to a peak of 39.9 million in 2019.',
                'The following year, however, the figure collapsed to 6.7 million, and in 2021 it fell to just 0.4 million.',
                'A strong recovery then followed, with 28.2 million arrivals in 2023.',
                'By 2025 the total had reached 36.5 million, close to the 2019 peak.'
              ],
              hint: 'Follow the years and the time phrases. Which sentence sets the scene, and which phrases signal what comes next?',
              why: '<em>The following year</em>, <em>then</em> and <em>by 2025</em> move the reader through time. No <em>Firstly</em> is needed because the order is already clear.' }
          ] },
        { id: 'm12s3', name: 'Relative and participle clauses', cefr: 'B2–C1',
          theory: {
            key: 'Join two simple sentences with <em>which</em>, <em>where</em>, a participle clause or <em>with + noun + -ing</em>. One per paragraph, always accurate.',
            body: [
              '<p>Relative clauses, participle clauses and <em>with + noun + -ing</em> are what lift a Band 7 report towards Band 8, where Grammatical Range asks for "a wide range of structures" used flexibly and accurately. The cheapest way to add one is to join two simple sentences that share a subject. <strong>Relative clause</strong>: <em>The zoo opened a new aquarium in 2015. It reached 900,000 visitors in 2020</em> becomes <em>The zoo, which opened a new aquarium in 2015, reached 900,000 visitors in 2020.</em> Non-defining clauses like this take commas on both sides and never use <em>that</em>. <em>Where</em> introduces a place or a stage: <em>the furnace, where the glass is melted</em>.</p>',
              '<p><strong>Participle clauses</strong> drop the subject and use <em>-ing</em> or <em>having + past participle</em>: <em>Having peaked at 40 tonnes in 2012, tea sales fell to 25 tonnes by 2020.</em> The subject of the participle must be the subject of the main clause; <em>Having peaked in 2012, the fall in tea sales …</em> is wrong because the fall did not peak. Three other faults are common: dropping <em>having</em>, making the verb passive (<em>having been peaked</em>) and leaving the sentence without a main verb.</p>',
              '<p>A third shape, <em>with + noun + -ing</em>, adds a detail to a general statement: <em>Food prices rose in every region, with the north showing the sharpest increase.</em> One of these structures per paragraph is enough. A faulty complex sentence scores below a correct simple one, so check the commas and the subject every time.</p>'
            ],
            simple: [
              '<p>Join two sentences with <em>, which …,</em>: <em>Coal, which had dominated in 2000, fell to 18%.</em> Use commas. Do not use <em>that</em>.</p>',
              '<p><em>Having peaked in 2010, Osaka then declined.</em> The person or thing that peaked must be the subject of the next part.</p>',
              '<p><em>With Thailand showing the biggest rise</em> adds a detail. One of these per paragraph is enough.</p>'
            ],
            examples: [
              { s: 'Rice, which had been the main crop in 1990, covered only a quarter of the farmland by 2020.', g: 'Non-defining relative clause, commas both sides.' },
              { s: 'Having peaked at 8.2 million in 2015, the number of landline users is projected to fall to 3 million by 2035.', g: 'Participle clause; <em>the number of landline users</em> is the subject of both parts.' },
              { s: '<s>Cycling, that grew the fastest, reached 15% by 2020.</s>', g: '<em>That</em> cannot follow a comma. Use <em>which</em>.' }
            ]
          },
          items: [
            { id: 'm12s3q1', type: 'build', tag: 'gra-complex', level: 'B1', chart: 'p-line-museums',
              stem: 'Join the sentences with a relative clause: "The Science Museum overtook the Art Gallery in 2014. It reached 760,000 in 2020."',
              tiles: ['The Science Museum,', 'which overtook', 'the Art Gallery in 2014,', 'reached 760,000', 'in 2020.'],
              solution: 'The Science Museum, which overtook the Art Gallery in 2014, reached 760,000 in 2020.',
              alt: [],
              hint: 'The second sentence keeps its main verb. Where does the information from the first sentence go, and what marks it off?',
              why: 'The second sentence keeps its verb; the first becomes a <em>which</em> clause inside commas. Two facts, one accurate complex sentence.' },
            { id: 'm12s3q2', type: 'build', tag: 'gra-complex', level: 'B2', chart: 'p-line-cities',
              stem: 'Join with a participle clause: "Osaka peaked at 19.3 million in 2010. It is projected to fall to 17.8 million by 2040."',
              tiles: ['Having peaked', 'at 19.3 million', 'in 2010,', 'Osaka is projected', 'to fall to', '17.8 million', 'by 2040.'],
              solution: 'Having peaked at 19.3 million in 2010, Osaka is projected to fall to 17.8 million by 2040.',
              alt: [],
              hint: 'A participle clause and a main clause share one subject. Decide which tiles form each clause before you join them.',
              why: '<em>Having peaked</em> puts the earlier event first, and Osaka is the subject of both halves. This is one of the structures that lift a Band 7 report towards Band 8.' },
            { id: 'm12s3q3', type: 'choose', tag: 'gra-complex', level: 'B2', chart: 'p-pie-energy',
              stem: 'Coal, ___ had dominated in 2000, lost more than half of its share.',
              options: ['that', 'which', 'where', 'what'], answer: 1,
              hint: 'Look at the commas around the clause. What kind of relative clause is this, and what words can open it?',
              why: 'A clause between commas that adds information is non-defining, and only <em>which</em> (or <em>who</em> for people) can introduce it. <em>That</em> is for defining clauses without commas.' },
            { id: 'm12s3q4', type: 'spot', tag: 'gra-punctuation', level: 'B2', chart: 'p-table-rice',
              stem: 'Tap the chunk with the punctuation error.',
              words: ['India which', 'showed', 'the largest increase,', 'produced', '178 million tonnes', 'in 2020.'], answer: 0, fix: 'India, which',
              hint: 'The facts about India are right. Read the whole sentence for punctuation, checking every clause.',
              why: 'A non-defining relative clause needs a comma on both sides. The closing comma is there; the opening one is missing. Half-punctuated clauses are a common Band 6 fault.' },
            { id: 'm12s3q5', type: 'choose', tag: 'gra-complex', level: 'C1', chart: 'p-line-internet',
              stem: 'Which sentence uses <em>with + noun + -ing</em> correctly?',
              options: [
                'Internet access rose everywhere, with Thailand was the biggest rise.',
                'Internet access rose everywhere, with Thailand it showed the biggest rise.',
                'Internet access rose everywhere, with Thailand showing the biggest rise.',
                'Internet access rose everywhere with Thailand to show the biggest rise.'
              ], answer: 2,
              hint: 'Check the verb form after Thailand in each option, and the punctuation before with.',
              why: 'The pattern is <em>with</em> + noun + <em>-ing</em> form, after a comma. It attaches a specific example to a general claim without a new sentence.' },
            { id: 'm12s3q6', type: 'build', tag: 'gra-complex', level: 'C1', chart: 'p-map-riverside',
              stem: 'Join with a relative clause: "The main road ran through the centre. It was pedestrianised south of the bridge."',
              tiles: ['The main road,', 'which previously ran', 'through the centre,', 'was pedestrianised', 'south of the bridge.'],
              solution: 'The main road, which previously ran through the centre, was pedestrianised south of the bridge.',
              alt: [],
              hint: 'Decide which tiles give the road\'s old position and which give the change. The relative word joins them.',
              why: 'The relative clause holds the old state and the main clause holds the change. <em>Previously</em> makes the time order clear inside one sentence.' },
            { id: 'm12s3q7', type: 'judge', tag: 'gra-complex', level: 'B2', chart: 'p-line-internet',
              given: 'Thailand, that showed the biggest rise, reached 88% by 2025.',
              stem: 'Is this complex sentence accurate?',
              answer: 1,
              hint: 'Check the fact against the graph first. Then check the word that opens the clause between the commas.',
              why: 'The fact is right, but <em>that</em> cannot introduce a clause between commas. Write <em>Thailand, which showed the biggest rise, …</em>. A faulty complex sentence scores below a correct simple one.' }
          ] }
      ],
      check: { id: 'm12ck', name: 'Systems Check', items: [
        { id: 'm12ckq1', type: 'choose', tag: 'cc-reference', level: 'B1', chart: 'p-bar-activities',
          stem: 'Sport attracted 60 boys and 45 girls, and ___ was the most popular activity overall.',
          options: ['it', 'they', 'that', 'those'], answer: 0,
          hint: 'How many activities does the blank point back to? Choose the word that can stand alone as the subject of was.',
              why: '<em>It</em> refers back to sport, a single activity. With 105 students in total, sport was ahead of music (75) and coding (60).' },
        { id: 'm12ckq2', type: 'spot', tag: 'cc-linking-overuse', level: 'B1', chart: 'p-line-phones',
          stem: 'Tap the connector that names the wrong relationship.',
          words: ['Smartphone ownership', 'rose from 10%', 'to 95%.', 'Similarly,', 'basic phone ownership', 'fell from 80%', 'to 5%.'], answer: 3, fix: 'In contrast,',
          hint: 'Compare the two lines on the phone graph. Then read each chunk of the sentence again.',
              why: 'One line rose and the other fell, which is a contrast, not a similarity. The connector must match the relationship between the two facts.' },
        { id: 'm12ckq3', type: 'build', tag: 'gra-complex', level: 'B2', chart: 'p-line-clubs',
          stem: 'Join with a relative clause: "The esports club had no members in 2016. It had become the largest club by 2024."',
          tiles: ['The esports club,', 'which had no members', 'in 2016,', 'had become', 'the largest club', 'by 2024.'],
          solution: 'The esports club, which had no members in 2016, had become the largest club by 2024.',
          alt: [],
          hint: 'Pick out the tiles that state the 2016 fact and the tiles that state the 2024 result, then join them around the subject.',
              why: 'Start and end of the story in one sentence: the <em>which</em> clause gives the starting point and the main clause gives the result.' },
        { id: 'm12ckq4', type: 'choose', tag: 'gra-punctuation', level: 'B2', chart: 'p-table-rent',
          stem: 'Which sentence is a comma splice?',
          options: [
            'Rents in Tokyo barely changed, whereas Singapore rose sharply.',
            'Rents in Tokyo barely changed, Singapore rose sharply.',
            'Rents in Tokyo barely changed; Singapore rose sharply.',
            'Rents in Tokyo barely changed. Singapore rose sharply.'
          ], answer: 1,
          hint: 'Find where the two clauses meet in each option. Which ways of joining two full sentences are correct?',
              why: 'Two full sentences joined by a comma alone is a comma splice. A semicolon, a full stop or a linking word such as <em>whereas</em> all fix it.' },
        { id: 'm12ckq5', type: 'choose', tag: 'cc-reference', level: 'B2', chart: 'p-pie-holidays',
          stem: 'Japan and China moved in opposite directions: ___ almost tripled its share, while ___ lost most of its share.',
          options: ['the latter … the former', 'both … each', 'the former … the latter', 'one … another'], answer: 2,
          hint: 'Note the order of the two names. Then check which one rose and which one fell in the pies.',
              why: 'Japan was named first and rose from 12% to 34%, so it is <em>the former</em>; China, named second, fell from 28% to 10% and is <em>the latter</em>.' },
        { id: 'm12ckq6', type: 'judge', tag: 'cc-linking-overuse', level: 'B2', chart: 'p-pie-school-travel',
          given: 'Overall, walking fell sharply. Furthermore, motorbike use rose. Moreover, car use rose. In addition, most students used a vehicle by 2025.',
          stem: 'True or false: the connectors here help the reader.',
          answer: 1,
          hint: 'Read the four sentences against the two pies. Think about what each connector tells the reader.',
              why: 'Three adding connectors in a row is overuse, and <em>furthermore</em> after a fall wrongly suggests another fall. Try: <em>Overall, walking fell sharply, while both motorbike and car use rose, so that most students used a vehicle by 2025.</em>' },
        { id: 'm12ckq7', type: 'choose', tag: 'gra-complex', level: 'C1', chart: 'p-bar-bags',
          stem: 'Which sentence is correct?',
          options: [
            'Having peaked at 97 million in 2018, the collapse of bag use to 35 million.',
            'Peaked at 97 million in 2018, bag use collapsed to 35 million by 2020.',
            'Having been peaked at 97 million in 2018, bag use collapsed to 35 million by 2020.',
            'Having peaked at 97 million in 2018, bag use collapsed to 35 million by 2020.'
          ], answer: 3,
          hint: 'A participle clause needs a full main clause whose subject did the peaking. Check each option for both.',
              why: '<em>Having peaked</em> needs a main clause whose subject did the peaking: bag use. Option A has no main verb, B lacks <em>having</em>, and C wrongly makes the peak passive.' },
        { id: 'm12ckq8', type: 'order', tag: 'cc-reference', level: 'B2', chart: 'p-table-salaries',
          stem: 'Put the sentences in order so that each reference word points back clearly.',
          items: [
            'Germany offered the highest starting salary, at $62,000.',
            'This figure was well above the $44,000 paid in the USA.',
            'Korea and Japan followed, at $33,000 and $31,000 respectively.',
            'Thailand, at just $9,000, was far behind all of the others.'
          ],
          hint: 'Look for reference words such as this figure, followed and the others. What must each one come after?',
              why: '<em>This figure</em> must follow the figure it refers to, <em>followed</em> needs the leaders before it, and <em>all of the others</em> works only once the others have been named.' }
      ] }
    }]
  });
})();
