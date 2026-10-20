/* QUILLMOOR ACADEMY — THE OBSERVATORY · SECOND YEAR — story-content.js
   The story layer of the Quillmoor Observatory app (IELTS Academic Writing Task 1).
   Second year at Quillmoor: the Observatory, where chartwrights write factual
   reports on charts, tables, processes and maps. Original world; the plot
   follows the SHAPE of a second-year school-of-magic mystery only (IP level C:
   no canon names, spells, objects, creatures or crests in the app;
   canon scenes are discussed only in class, see docs/READING-ROOM-T1.md).
   Two cohorts: new readers (M4.1) and returning readers (the Tutoring group,
   who finished the first year in the Task 2 app). Pages may carry only:'new'
   or only:'returning'; pages without it are shown to both.
   Story text is B1: present tense, "you" (gender-neutral), short sentences,
   UK spelling. Keywords: [[word|short English gloss|Thai gloss]]. Each page,
   ending, tournament page and the finale also carries one rare (C1) word,
   marked [[word|gloss|Thai|C1]] and described in its rare field; prompt
   is the illustrator's scene line (see docs/ART-BIBLE-Y2.md).
   New cast: Professor Bartholomew Quist (the vain Master of Reports), Ploy
   Saengkaew (a first-year) and the Blank Almanac. Year mystery: the Frost that
   blanks every figure. (Answer, ch8: the Reflector, a brass copying-mirror in
   the Sealed Archive under the Tide Clock, woken by the Blank Almanac, the
   1976 record of Orrin Vane, fed on copied sentences.)
   Story bible: docs/STORY-BIBLE-Y2.md. Schema: QUILLMOOR-T1-SPEC.md and
   docs/SECOND-YEAR-BRIEF.md. ES5 only. */
(function () {
  window.STORY = {
    version: '2026-10-15',
    term: 'The Observatory · Second Year',

    /* ------------------------------------------------------------ houses */
    houses: [
      {
        id: 'compass', name: 'Compass', crit: 'TA', critName: 'Task Achievement',
        values: 'direction, the big picture', main: '#1F3A5F', accent: '#C0C7D1',
        emblem: 'compass rose', head: 'Professor Rhea North', motto: 'Know where you stand.',
        welcome: "Welcome to Compass, where we value direction. In a report, direction means the big picture: an overview that shows where the whole chart is going. An examiner looks for that before any number.",
        welcomeBack: "Welcome back to Compass. Last year direction meant a clear position. This year you give no position at all. Task Achievement means a clear overview, the key features with their figures, and no opinion.",
        challengeLine: "The big picture is your weakest key for now, so Professor North will read your overview first, every time."
      },
      {
        id: 'bridge', name: 'Bridge', crit: 'CC', critName: 'Coherence and Cohesion',
        values: 'order, groups that carry meaning', main: '#1F6F6B', accent: '#B8733A',
        emblem: 'stone arch', head: 'Professor Tomás Brigg', motto: 'Every stone carries the next.',
        welcome: "Welcome to Bridge, where we value order. Four paragraphs, two groups of data, and each sentence hands the reader to the next. A good report is one the reader never has to read twice.",
        welcomeBack: "Welcome back to Bridge. Order still matters, but the plan is new: an introduction, an overview and two groups of details, with no conclusion. Group the data first, then link it.",
        challengeLine: "Order is your weakest key for now, so Professor Brigg will check how you group the data and how each sentence points back."
      },
      {
        id: 'lexicon', name: 'Lexicon', crit: 'LR', critName: 'Lexical Resource',
        values: 'precision, the right word', main: '#5B2A5E', accent: '#C9A227',
        emblem: 'open book with a key', head: 'Professor Wen Liang', motto: 'The right word, not the rare word.',
        welcome: "Welcome to Lexicon, where we value precision. A sharp rise and a slight rise are two different facts. You will learn the exact word for every change, and its partner.",
        welcomeBack: "Welcome back to Lexicon. Last year your words carried ideas. This year they carry numbers, so precision matters even more: rose sharply, rose slightly and fluctuated are three different charts.",
        challengeLine: "Precision is your weakest key for now, so Professor Liang will check that every word fits the size of the change."
      },
      {
        id: 'loom', name: 'Loom', crit: 'GRA', critName: 'Grammatical Range and Accuracy',
        values: 'control, sentences without flaws', main: '#8E1B2C', accent: '#F1E6CC',
        emblem: "weaver's shuttle", head: 'Professor Ada Weaver', motto: 'No loose threads.',
        welcome: "Welcome to Loom, where we value control. A correct simple sentence beats a faulty clever one, every time. You will drill a few sentence patterns until you get them right nearly every time.",
        welcomeBack: "Welcome back to Loom. Control still comes first, but the threads are new: the past simple for past years, the passive for a process, and to, by and at in front of every number.",
        challengeLine: "Control is your weakest key for now, so Professor Weaver will check the tense and the preposition in every sentence with a number."
      }
    ],

    /* ---------------------------------------------------------- chapters */
    chapters: [

      /* ================================================== CHAPTER 1 */
      {
        id: 'ch1', n: 1, title: 'The Letter', titleReturning: 'A New Term',
        place: 'The moor road and the black lake → Hall of Lanterns → the Observatory',
        blurb: 'An owl with two letters, a broken tram, a boat across the black lake, and a tower full of living charts.',
        blurbReturning: 'A year older: a warning in grey ink, a broken tram, a new teacher who loves big numbers, and habits that now lose marks.',
        keepsake: { id: 'key', name: 'The Observatory key', desc: 'A small brass key to the tower where the living charts are kept. Second-years wear it on the satchel strap.' },
        opens: ['plan', 'map', 'pods', 'vids', 'record', 'settings'],
        pages: [
          {
            only: 'new',
            img: 'story/y2-ch1-01.webp',
            alt: 'On a rainy Bangkok balcony at dusk, a wet grey-brown owl holds a letter with a dark blue wax seal and a torn yellowed page; the heroine looks up from her homework, surprised.',
            text: "It is mid-October in Bangkok, and the rain has not stopped for three days. You sit by the window with your homework. Then a grey-brown owl lands on the balcony. She is wet and a little grumpy. She carries two things. One is a letter with a dark blue seal and your name on it. The other is a torn page from a very old book. Most of it is [[illegible|impossible to read|อ่านไม่ออก|C1]]. But one line is clear, in cold grey ink: 'Do not open the Sealed Archive.'",
            rare: { w: 'illegible', g: 'impossible to read', t: 'อ่านไม่ออก', pos: 'adjective', ex: 'Two labels on the old chart were illegible, so the student checked the key instead.' },
            prompt: "A rainy Bangkok apartment balcony at dusk in mid-October, city lights blurred by heavy rain. Nutmeg, a wet grey-brown owl, perches on the balcony rail with a letter sealed in dark blue wax and a torn, yellowed old page in her beak. The heroine sits at a desk by the open window with her homework and looks up in surprise. Cool blue rain light outside, a warm desk lamp inside, a quiet mood of mystery."
          },
          {
            only: 'new',
            img: 'story/y2-ch1-02.webp',
            alt: 'The heroine reads an open letter at her desk by lamplight; the broken blue wax seal and a torn old page lie beside her, and the owl dries herself on a towel.',
            text: "The letter says:\n\n'Dear Student,\n\nYou have been chosen to join the second-year class at Quillmoor Academy. You will study in the Observatory, where students write a [[report|a factual text that describes what a chart shows|รายงาน]] on a chart, a table, a process or a map. A report does not argue. Its task is to [[summarise|give only the main points|สรุป]] the facts and compare them, with no opinions. You have twenty minutes to write at least 150 words, so a good report is [[succinct|short and clear, with no extra words|กระชับ|C1]].\n\nTerm begins on 29 October.\n\nProfessor Marisol Penhallow, Head of Examinations\n\nP.S. The owl is called Nutmeg. Please dry her.'",
            rare: { w: 'succinct', g: 'short and clear, with no extra words', t: 'กระชับ', pos: 'adjective', ex: 'A succinct overview names the two main trends in two sentences.' },
            prompt: "A small bedroom desk at night under a warm lamp. The heroine reads an unfolded letter with no readable writing; a broken dark blue wax seal and a torn yellowed page lie on the desk beside her. Nutmeg, the grey-brown owl, sits on a folded towel at the edge of the desk, fluffing her damp feathers. Cosy, curious mood, rain still streaking the window behind."
          },
          {
            only: 'returning',
            img: 'story/y2-ch1-03.webp',
            alt: 'A year later, the heroine, a little taller with a longer braid, takes a torn grey-inked page from an older grey-brown owl on her Bangkok balcony; a brass second-year pin and last year\'s brown spellbook lie on the desk.',
            text: "A year has passed since your first letter from Quillmoor. It is October in Bangkok again, and Nutmeg lands on the balcony. She is older now, with paler feathers round her eyes. Your second-year pin shines on the desk beside last year's spellbook. But this time Nutmeg brings no letter. She carries a torn page from an old almanac. One line is written in cold grey ink: 'Do not open the Sealed Archive.' Nobody signed it, and its [[provenance|where something comes from|ที่มา|C1]] is a mystery.",
            rare: { w: 'provenance', g: 'where something comes from', t: 'ที่มา', pos: 'noun', ex: 'Before you trust a figure, check its provenance: which chart, which year, which unit?' },
            prompt: "A Bangkok balcony on a grey October afternoon, one year after the first letter. Nutmeg, an older grey-brown owl with paler feathers round her eyes, offers a torn yellowed almanac page to the heroine, who is a little taller now, with a longer braid. On the desk behind her lie a small round brass second-year pin and a worn brown leather spellbook. Soft overcast light, an uneasy, puzzled mood."
          },
          {
            only: 'new',
            img: 'story/y2-ch1-04.webp',
            alt: 'At dusk an older man in a long dark coat rows a small boat across a black lake towards a castle on a hill; the heroine sits in the boat with a curly-haired girl and a boy holding a brass camera.',
            text: "A week later an old wooden tram carries you up a windy moor. Halfway up, it stops with a bang. Two students share your bench. 'Juno Marlowe,' says a girl with curly hair and a copper ribbon. 'Felix Okafor,' says a boy with a brass camera. 'I run The Lantern, the school paper. One question for you: where's the number?' You walk to the black lake, where Mr Fenwick, the librarian, waits in a rowing boat. The castle lights come [[imperceptibly|so slowly that you can hardly notice it|อย่างแทบสังเกตไม่ได้|C1]] closer.",
            rare: { w: 'imperceptibly', g: 'so slowly or slightly that you can hardly notice it', t: 'อย่างแทบสังเกตไม่ได้', pos: 'adverb', ex: 'The price rose imperceptibly, from 4.0 to 4.1 dollars over ten years.' },
            prompt: "Dusk over a wide black lake below a castle on a windy moor; a broken-down wooden tram with brass lamps stands far behind on the hill road. Mr Fenwick, an older man in a long dark coat with iron keys at his belt, rows a small wooden boat across the still water. In the boat sit the heroine, Juno Marlowe with her teal-and-copper scarf, and Felix Okafor holding his brass camera. Purple and gold sky reflected in the water, quiet wonder."
          },
          {
            only: 'returning',
            img: 'story/y2-ch1-05.webp',
            alt: 'On the moor road beside a stopped wooden tram, Juno with a copper ribbon and Felix with a press badge greet the heroine; below them an older man waits in a rowing boat on the black lake.',
            text: "On the moor road the old wooden tram stops with a bang. Juno drops onto the bench beside you. Her curly hair is tied with a new copper ribbon. 'Second year!' she grins. Felix waves a press badge. 'Priya has graduated. I run The Lantern now.' The tram will not move, so you walk down to the black lake. Mr Fenwick waits there in a rowing boat. 'In a hundred years that tram has never broken down,' he says. 'It is [[unprecedented|never having happened before|ไม่เคยเกิดขึ้นมาก่อน|C1]].'",
            rare: { w: 'unprecedented', g: 'never having happened before', t: 'ไม่เคยเกิดขึ้นมาก่อน', pos: 'adjective', ex: 'Exports reached an unprecedented level in 2020, higher than in any earlier year.' },
            prompt: "Late afternoon on a windswept moor road; an old wooden tram with brass lamps has stopped with steam curling from its wheels. Juno Marlowe, hair in two curly puffs tied with a copper ribbon, laughs beside the heroine, while Felix Okafor lifts a press badge on a cord with his brass camera at his chest. Down the slope, Mr Fenwick waits in a rowing boat on the black lake. Golden low sun, a warm reunion mood with a hint of trouble."
          },
          {
            only: 'new',
            event: 'sorting',
            img: 'story/y2-ch1-06.webp',
            alt: 'In a great hall of floating paper lanterns, a tall brass lantern glows in navy, teal, plum and crimson bands; a silver-haired professor in a charcoal robe gestures as the heroine steps towards it.',
            text: "Inside the castle, the Hall of Lanterns is full of floating paper lanterns. A tall woman with a silver bob steps forward. 'I am Professor Penhallow. Here we teach one thing: how to win with words.' A brass lantern at the front glows navy, teal, plum and crimson. 'The Sorting Lantern asks twelve questions about reports,' she says. 'It finds your [[predominant|strongest or most important; largest|โดดเด่นที่สุด|C1]] strength, your strongest [[criterion|a standard used to judge something|เกณฑ์]]. Compass for the big picture. Bridge for order. Lexicon for the right word. Loom for control.' You walk up to the light.",
            rare: { w: 'predominant', g: 'strongest, largest or most important', t: 'โดดเด่นที่สุด', pos: 'adjective', ex: 'Coal was the predominant source of electricity until 2015.' },
            prompt: "A great stone hall filled with hundreds of floating paper lanterns. At the front stands the Sorting Lantern, a tall brass lantern glowing in four horizontal bands of navy, teal, plum and crimson light. Professor Penhallow, tall with a silver bob, a charcoal robe and brass spectacles on a chain, gestures towards it as the heroine steps forward alone. Warm lantern glow, a hush of anticipation."
          },
          {
            only: 'returning',
            event: 'house',
            img: 'story/y2-ch1-07.webp',
            alt: 'The Hall of Lanterns glows in four colours; the brass Sorting Lantern shines as the heroine walks past, and Celeste, with a chin-length black bob and a silver clip, waves her over to a seat.',
            text: "The Hall of Lanterns glows in all four colours. This time the Sorting Lantern asks you nothing. It simply shines in your house colours as you walk past. 'You keep your house, and it keeps you,' says Penhallow. Then Celeste Ashby waves you over. Her black bob has grown to her chin, and last year's rival saves you a seat. The change in her is [[conspicuous|very easy to notice|เห็นได้ชัด|C1]]. If the Lantern does not know you yet, choose your house now, or take its twelve questions.",
            rare: { w: 'conspicuous', g: 'very easy to notice', t: 'เห็นได้ชัด', pos: 'adjective', ex: 'The most conspicuous feature of the graph is the sudden drop in 2009.' },
            prompt: "The Hall of Lanterns at night, paper lanterns floating overhead. The tall brass Sorting Lantern glows in its four colour bands as the heroine walks past it without stopping. At a long table, Celeste Ashby, with a sleek chin-length black bob, a silver clip and a violet-purple-and-gold scarf, smiles and waves her over to an empty seat beside her. Warm, welcoming light."
          },
          {
            img: 'story/y2-ch1-08.webp',
            alt: 'At a feast table, a vain professor in a mustard-yellow waistcoat and monocle poses on a small stage beside a stack of his own books; a small first-year girl with copper-beaded pigtails hugs a brown almanac, and a woman with a pencil in her hair writes quietly.',
            text: "At the feast, a man in a mustard-yellow waistcoat leaps onto the stage. 'Professor Bartholomew Quist, Master of Reports! Author of Quist's Quick Charts!' His face smiles from every copy on the tables. 'My reports are never boring! Sales skyrocketed by a staggering 200%, because people adored them!' His speech is pure [[hyperbole|saying that something is much bigger or better than it is|การพูดเกินจริง|C1]]. Beside you, a small first-year hugs a brown almanac. 'He's wonderful,' whispers Ploy Saengkaew. At the end of the table, a woman with ink on her fingers writes one quiet word: 'Source?'",
            rare: { w: 'hyperbole', g: 'saying that something is much bigger or better than it is', t: 'การพูดเกินจริง', pos: 'noun', ex: '"Sales exploded" is hyperbole; "sales rose sharply" is a report.' },
            prompt: "A long feast table in a lantern-lit hall. Professor Bartholomew Quist, tanned, with swept-back wavy chestnut hair, a trimmed beard, a mustard-yellow waistcoat under a long brown coat and a monocle on a chain, strikes a grand pose on a low stage beside a tall stack of books showing his own portrait on the covers. In the foreground, Ploy Saengkaew, a small first-year with two short pigtails and copper beads, hugs a brown leather almanac and gazes up at him; at the far end, Dr Halima Strand quietly writes in a ledger. Bright, comic, slightly too-golden light."
          },
          {
            only: 'returning',
            img: 'story/y2-ch1-09.webp',
            alt: 'In a round stone chamber after the feast, a silver-haired professor in a charcoal robe speaks to a small group; the heroine, Juno and Celeste sit on a bench listening.',
            text: "After the feast, Penhallow speaks to your old class. 'The habits that won last year now lose marks,' she says. 'In a [[report|a factual text that describes what a chart shows|รายงาน]], nobody wants your position. No opinion, no reasons, no conclusion. Twenty minutes, not forty. At least 150 words, not 250. Instead of a thesis, you write an overview of the whole chart.' Juno looks worried. 'So what do we argue?' 'Nothing. You stay [[factual|based on facts, not opinions|อิงข้อเท็จจริง]]. Every claim must be [[verifiable|able to be checked and shown to be true|ตรวจสอบได้|C1]] on the chart.'",
            rare: { w: 'verifiable', g: 'able to be checked and shown to be true', t: 'ตรวจสอบได้', pos: 'adjective', ex: 'Every figure in a report must be verifiable on the chart.' },
            prompt: "A round stone debating chamber lit by lanterns on chains, quiet after the feast. Professor Penhallow, silver bob, charcoal robe, brass spectacles on a chain, stands between two wooden lecterns and speaks seriously. On a bench facing her sit the heroine, Juno Marlowe looking worried, and Celeste Ashby listening closely with her own brown spellbook on her knees. Calm amber light, a thoughtful mood."
          },
          {
            img: 'story/y2-ch1-10.webp',
            alt: 'Under a glass dome at the top of a round tower, glowing line graphs, bar charts and pie charts float in the air; a woman with rolled sleeves and a pencil in her pinned-up hair points at a line graph while the heroine and Juno look up.',
            text: "After dinner, the woman with inky fingers takes you up the Observatory. 'Dr Halima Strand, Keeper of the Observatory,' she says. On the stairs you pass the old Tide Clock, a tall glass case of coloured water. At the top, living charts hang in the air under a glass dome. 'We are [[meticulous|very careful about every small detail|พิถีพิถัน|C1]] here,' she says. 'Thirty seconds of [[triage|a quick first check of a chart before you write|การคัดแยกเบื้องต้น]] first. What is the [[mode|the kind of chart job: TREND, COMPARE, SEQUENCE or SPACE|รูปแบบการบรรยาย]]? What is on each [[axis|a line along the side or bottom of a graph|แกน]]? What are the [[units|what the numbers measure, such as %, tonnes or thousands|หน่วย]]? Which years?'",
            rare: { w: 'meticulous', g: 'very careful about every small detail', t: 'พิถีพิถัน', pos: 'adjective', ex: 'A meticulous writer checks every figure against the chart before sending the report.' },
            prompt: "The top room of the Observatory, a round stone tower room under a great glass dome at night. Glowing living charts float in the air: a line graph, a bar chart, a pie chart and a small moor map, made of soft light with no readable numbers. Dr Halima Strand, dark hair pinned up with a pencil, sleeves rolled, ink on her fingers and a brass ruler at her belt, points at the line graph; the heroine and Juno Marlowe look up in wonder. Deep blue night through the dome, warm chart glow."
          }
        ],
        missions: [
          { kind: 'event', event: 'sorting', label: 'Stand before the Sorting Lantern', note: 'Twelve questions about reports. The Lantern finds your strongest key and your house.', only: 'new' },
          { kind: 'event', event: 'house', label: 'Take your place in your house', note: 'Your house comes with you from last year. If the Lantern does not know you yet, choose your house or take the twelve questions.', only: 'returning' },
          { kind: 'sub', id: 'm00s1' }, { kind: 'sub', id: 'm00s2' }, { kind: 'sub', id: 'm00s3' },
          { kind: 'check', id: 'm00l1' },
          { kind: 'sub', id: 'm01s1' }, { kind: 'sub', id: 'm01s2' }, { kind: 'sub', id: 'm01s3' },
          { kind: 'check', id: 'm01l1' }
        ],
        gate: {
          checks: ['m00l1', 'm01l1'], checkIds: ['m00ck', 'm01ck'], extra: [],
          intro: "Dr Strand closes her ledger. 'Two gates. The facts of the test, and thirty seconds of triage. Professor Quist may start with adjectives. Here nobody writes a word until they know what kind of chart it is.'",
          pass: "'Good,' says Dr Strand. 'You know the rules, and you can name the mode before you read a single number.' She hangs a small brass key on your satchel strap. 'The Observatory is open to you now. Use the stairs in daylight.'"
        },
        ending: {
          img: 'story/y2-ch1-end.webp',
          alt: 'At night on a spiral stone staircase, the heroine presses her ear to an old copper pipe beside a tall glass clock case full of coloured water; a sleepy Juno in a dressing gown stands on the step above.',
          text: "That night you cannot sleep, so you walk back to the Observatory stairs. The Tide Clock ticks in the dark. Then you hear it, inside the old pipes: a cold, thin whisper. 'Fell… fell… west… west…' It sounds like someone reading numbers back to front. You fetch Juno, but she hears nothing. 'Just the water,' she yawns. Then the whisper stops, as [[abruptly|suddenly and unexpectedly|อย่างกะทันหัน|C1]] as it began. The torn page in your pocket feels very cold.",
          rare: { w: 'abruptly', g: 'suddenly and unexpectedly', t: 'อย่างกะทันหัน', pos: 'adverb', ex: 'Sales rose for five years and then fell abruptly in 2008.' },
          prompt: "A narrow spiral stone staircase inside the Observatory at night, lit by one small lantern. The heroine presses her ear to an old copper pipe running up the wall beside the Tide Clock, a tall glass case with five lines of coloured water inside. On the step above, Juno Marlowe in a dressing gown and her teal-and-copper scarf yawns and rubs her eyes. Cold blue shadows, a faint grey mist near the pipe, an eerie hushed mood."
        },
        newsroom: 'A torn almanac page warns: "Do not open the Sealed Archive." Professor Quist arrives with his Quick Charts, and only you hear a whisper in the Observatory pipes.'
      },

      /* ================================================== CHAPTER 2 */
      {
        id: 'ch2', n: 2, title: 'The Four-Part Charm', place: "The Observatory and Professor Quist's classroom",
        blurb: 'A famous teacher with a perfect report to learn by heart, four parts that really work, and grey writing on the wall.',
        keepsake: { id: 'charm', name: 'The Four-Part Charm', desc: 'Four small brass links on one ring: introduction, overview, Detail A, Detail B.' },
        opens: ['writer', 'models'],
        pages: [
          {
            img: 'story/y2-ch2-01.webp',
            alt: 'A classroom whose walls are covered in smiling portraits of the same bearded man; Professor Quist hands out copies of his book while the heroine, Juno and Celeste sit at desks.',
            text: "Professor Quist's classroom has forty portraits on its walls. Every one of them is Professor Quist. He hands out copies of Quist's Quick Charts. 'Page one: my Perfect Report!' he beams. 'It fits every chart in the world. Learn it [[verbatim|in exactly the same words|คำต่อคำ|C1]], and you will never need to think again.' The report starts with the task sentence, copied word for word. Juno reads it and frowns. 'It says nothing about our chart,' she whispers. 'It doesn't even have a number.'",
            rare: { w: 'verbatim', g: 'in exactly the same words', t: 'คำต่อคำ', pos: 'adverb', ex: 'Never copy the task sentence verbatim; paraphrase it in your own words.' },
            prompt: "A bright classroom high in the Observatory whose stone walls are crowded with framed portraits of the same smiling bearded man. Professor Bartholomew Quist, in his mustard-yellow waistcoat and monocle, sweeps between the desks handing out books with his own face on the covers. The heroine and Celeste Ashby sit at wooden desks beside Juno Marlowe, who frowns at the open page. Warm, slightly over-gilded light, a comic mood."
          },
          {
            img: 'story/y2-ch2-02.webp',
            alt: 'Professor Quist reads dramatically from his own book with one hand raised; Celeste, in a violet-and-gold scarf, raises her hand with a doubtful face.',
            text: "Quist reads his Perfect Report aloud, with feeling. The last paragraph begins, 'In [[conclusion|a final paragraph that sums up or gives a view|บทสรุป]], tourism is wonderful, because everybody loves holidays!' Celeste Ashby, a second-year with a sleek black bob and her own brown spellbook, raises her hand. 'Sir, a report has no conclusion. No opinion and no reason, either. The chart never says why people travelled.' Quist waves his monocle. 'Details, dear girl!' But Celeste is right. In a Task 1 report a conclusion is [[superfluous|not needed; more than is wanted|เกินความจำเป็น|C1]]. The report stops when the data stops.",
            rare: { w: 'superfluous', g: 'not needed; more than is wanted', t: 'เกินความจำเป็น', pos: 'adjective', ex: 'A conclusion is superfluous in Task 1: the overview has already given the main points.' },
            prompt: "Professor Quist stands at the front of his portrait-lined classroom, reading from his own book with one hand raised dramatically and his monocle swinging on its chain. In the second row, Celeste Ashby, chin-length black bob with a silver clip and a violet-purple-and-gold scarf, raises her hand with a calm, doubtful expression. Late-morning sun through tall windows, light comedy."
          },
          {
            img: 'story/y2-ch2-03.webp',
            alt: 'In the Observatory, Dr Strand draws four stacked boxes of different heights on a blackboard while the heroine and Juno copy them into notebooks; a living chart glows above.',
            text: "That afternoon Dr Strand draws four boxes on the board. 'This is the Four-Part Charm,' she says. 'An [[introduction|the first paragraph: what the chart shows|บทนำ]] of about 30 words. An overview of about 45. Then two paragraphs of [[detail|a small fact, such as one figure|รายละเอียด]], about 55 words each.' The boxes are not all the same size. 'Keep the parts [[proportionate|the right size compared with the other parts|ได้สัดส่วน|C1]] to their jobs,' she says. 'Aim for 160 to 190 words, safely over 150. And write one tonight in the Scriptorium.'",
            rare: { w: 'proportionate', g: 'the right size compared with something else', t: 'ได้สัดส่วน', pos: 'adjective', ex: 'Keep your paragraphs proportionate: a short introduction and two longer detail paragraphs.' },
            prompt: "The Observatory classroom under the glass dome in afternoon light. Dr Halima Strand, dark hair pinned up with a pencil and sleeves rolled, chalks four stacked rectangles of different heights on a blackboard, with no writing inside them. The heroine and Juno Marlowe copy the shapes into notebooks at a long wooden bench, while a softly glowing line graph floats above them. Calm, focused, practical mood."
          },
          {
            img: 'story/y2-ch2-04.webp',
            alt: 'The heroine stands at a slate and writes a sentence while Dr Strand holds up a printed task card; a small brass balance on the desk weighs two piles of paper.',
            text: "Dr Strand holds up a task card. 'The graph below shows the number of visitors to three attractions in Lamphun between 2012 and 2022.' You must not copy it, so you [[paraphrase|say the same thing in different words|ถอดความ]] it: 'The line graph illustrates how many people, in thousands, visited three places in Lamphun from 2012 to 2022.' She nods. 'Words copied from the [[rubric|the task sentence printed on the exam paper|คำสั่งของโจทย์]] are [[discounted|not counted|ไม่ถูกนับ]]. So Quist's report is [[ostensibly|as it seems, but perhaps not really|ดูเหมือนว่า|C1]] 200 words. Really, it is shorter. The copied words earn nothing.'",
            rare: { w: 'ostensibly', g: 'as it seems, but perhaps not really', t: 'ดูเหมือนว่า', pos: 'adverb', ex: 'The report is ostensibly 170 words, but 25 of them are copied from the task.' },
            prompt: "A corner of the Observatory classroom with a small brass balance on the teacher's desk, one pan heavy with paper, the other light. The heroine stands at a slate holding chalk mid-sentence, with no readable letters. Dr Halima Strand holds up a blank printed task card beside her and watches with an approving half-smile. Soft daylight, a sense of a small victory."
          },
          {
            img: 'story/y2-ch2-05.webp',
            alt: 'At breakfast, Felix holds up a thin grey newspaper sheet covered in one solid block of text; a violet-black quill hovers faintly above the table, and other students point at the heroine.',
            text: "Next morning The Whisper lands on every plate. It is the gossip sheet of the Gossip Quill, a violet-black quill that writes by itself. Today it prints a chart report in one block of text. It starts with the task sentence, copied. Its numbers are [[fabricated|invented and presented as true|ปั้นขึ้นมา|C1]]: 'Visitors rose by a staggering 300%.' Felix checks the real chart. 'They rose from 20,000 to 30,000. That's 50%. Where's the number from?' At the next table, someone mutters your name.",
            rare: { w: 'fabricated', g: 'invented and presented as true', t: 'ปั้นขึ้นมา', pos: 'adjective', ex: 'An examiner can spot a fabricated figure that is not on the chart.' },
            prompt: "Long breakfast tables with toast and teapots in the Hall of Lanterns by morning light. Felix Okafor, a press badge on a cord round his neck and his brass camera at his chest, holds up a thin grey newspaper sheet filled with one dense, unreadable block of print. A faint violet-black quill hovers in the air above the table, half transparent. Two background students at the next table glance and point towards the heroine, who looks up, uneasy. Pale morning light with a cold undertone."
          },
          {
            only: 'returning',
            img: 'story/y2-ch2-06.webp',
            alt: 'In a quiet corner of the library, the heroine and Celeste sit together; Celeste opens last year\'s faded grey page beside a fresh grey Whisper sheet.',
            text: "In the library, Celeste lays two pages side by side. One is last year's Whisper, its ink long faded. The other is today's. 'We beat the Quill last year,' she says. 'We wrote our own words, and it had nothing left to eat. So why is it back?' This [[resurgence|a return after a period of being weak or gone|การกลับมาอีกครั้ง|C1]] worries you. Last year the Quill fed on copied essays. This year, someone is feeding it copied reports and invented figures. But who?",
            rare: { w: 'resurgence', g: 'a return after a period of being weak or gone', t: 'การกลับมาอีกครั้ง', pos: 'noun', ex: 'After a fall in the 1990s, cinema visits saw a resurgence from 2005.' },
            prompt: "A quiet lamplit corner of the Long Library. The heroine sits at a small table beside Celeste Ashby, who lays a faded, almost blank grey sheet next to a fresh grey newspaper sheet with unreadable print; both lean in, worried. Tall shelves fade into shadow behind them. Warm lamp glow, a conspiratorial mood."
          },
          {
            img: 'story/y2-ch2-07.webp',
            alt: 'In the Scriptorium at night, the heroine writes at a desk while Celeste shows her own brown spellbook; Professor Quist leans in over their shoulders, smiling for an imaginary painter.',
            text: "In the Scriptorium you write your first guided report. Celeste shows you her own spellbook. 'Quist's report is [[generic|general, not made for one particular case|ทั่วไปเกินไป ไม่เฉพาะเจาะจง|C1]],' she says. 'It fits every chart, so it fits none. My [[frame|a sentence pattern with gaps to fill|โครงประโยค]] has gaps, and the chart fills them.' You write four parts and stop. No conclusion. Quist leans over your shoulder. 'Splendid! Exactly my method!' he cries. It isn't. But by breakfast, he tells the whole hall he taught you.",
            rare: { w: 'generic', g: 'general, not made for one particular case', t: 'ทั่วไปเกินไป ไม่เฉพาะเจาะจง', pos: 'adjective', ex: 'A generic overview such as "There are many changes" earns little credit.' },
            prompt: "The Scriptorium at night, rows of writing desks lit by small oil lamps. The heroine writes in a notebook while Celeste Ashby holds open her own worn brown spellbook beside her. Professor Quist leans in over their shoulders with a broad grin, his monocle glinting, one hand on his chest as if posing for a portrait. Warm lamplight with deep shadows, gentle comedy."
          }
        ],
        missions: [
          { kind: 'sub', id: 'm02s1' }, { kind: 'sub', id: 'm02s2' }, { kind: 'sub', id: 'm02s3' },
          { kind: 'writing', label: 'Your first guided report', note: 'In the Scriptorium, write a four-paragraph report on one chart: an introduction in your own words, an overview with no figures, two short paragraphs of details, and no conclusion.', min: 1, kind2: 'report' },
          { kind: 'check', id: 'm02l1' }
        ],
        gate: {
          checks: ['m02l1'], checkIds: ['m02ck'], extra: [],
          intro: "Dr Strand puts Quist's Perfect Report to one side. 'One gate. Show me the four parts, a full introduction, and a task sentence in your own words. Then the charm is yours.'",
          pass: "Dr Strand hangs a small brass charm on your bag: four links on one ring. 'Four parts, in order, every time. Now your report has a skeleton, and it is your own.'"
        },
        ending: {
          img: 'story/y2-ch2-end.webp',
          alt: 'On the dark Observatory stairs, a grey-brown tabby cat stands frozen and frosted grey beside the tall glass Tide Clock; grey writing glistens on the wall above; the heroine stands alone as Professor Quist and students arrive with lanterns.',
          text: "At midnight the whisper in the pipes comes back: 'Fell… fell… west…' You follow it down the Observatory stairs. Beside the Tide Clock, Marmalade, Mr Fenwick's grey-brown cat, stands stiff and grey with frost. Above the clock, grey ink shines on the wall: 'THE ARCHIVE IS AWAKE. EVERY OVERVIEW WILL FADE.' Footsteps. Lanterns. Students crowd the stairs, and they all stare at you. Professor Quist arrives last. 'Aha!' he says. The silence that follows is [[ominous|suggesting that something bad will happen|เป็นลางร้าย|C1]].",
          rare: { w: 'ominous', g: 'suggesting that something bad will happen', t: 'เป็นลางร้าย', pos: 'adjective', ex: 'Ominous grey clouds gathered over the moor before the storm.' },
          prompt: "The Observatory spiral stairs at midnight beside the Tide Clock, a tall glass case with five lines of coloured water. Marmalade, a grey-brown tabby cat, stands frozen mid-step, coated in grey frost. Large streaks of glistening grey ink cover the stone wall above the clock with no readable letters. The heroine stands alone in the middle, startled, as background students with lanterns crowd the stairs below and Professor Quist pushes forward with his monocle raised. Cold silver-grey light against warm lanterns, a chilling cliff-hanger mood."
        },
        newsroom: 'The Whisper prints a fake report with copied task words and a "staggering 300%". At midnight Marmalade is found frozen grey by the Tide Clock, under grey writing: "THE ARCHIVE IS AWAKE."'
      },

      /* ================================================== CHAPTER 3 */
      {
        id: 'ch3', n: 3, title: 'The Watchtower', place: 'Top of the Observatory and the Counting Room',
        blurb: 'Whispers in the corridors, an overview with no numbers, and a teacher who puts all his numbers in the wrong place.',
        keepsake: { id: 'spyglass', name: 'The Watchtower spyglass', desc: 'A small brass spyglass for seeing the whole chart before any number.' },
        opens: ['bootcamp'],
        pages: [
          {
            img: 'story/y2-ch3-01.webp',
            alt: 'In a crowded stone corridor, students whisper behind their hands as the heroine walks past; Juno walks close beside her, chin up, and a small first-year with pigtails watches from a doorway.',
            text: "By morning the whole castle knows. 'That second-year was by the clock.' 'Did you see the cat?' Students step aside when you walk past. A rumour grows [[exponentially|faster and faster as it grows|แบบทวีคูณ|C1]]: by lunch, you are feeding the Gossip Quill. Juno walks beside you with her chin up. 'Ignore them. They have no evidence.' In a doorway, little Ploy Saengkaew hugs her brown almanac and watches you. She looks pale and tired, as if she has not slept.",
            rare: { w: 'exponentially', g: 'faster and faster as it grows', t: 'แบบทวีคูณ', pos: 'adverb', ex: 'Online sales grew exponentially, doubling every two years.' },
            prompt: "A crowded stone corridor of the castle in grey morning light. Background students in black robes with house scarves in navy-silver, teal-copper, violet-gold and crimson-cream whisper behind their hands as the heroine walks past, head slightly lowered. Juno Marlowe walks close beside her, chin up, protective. In a side doorway, Ploy Saengkaew, a small pale first-year with two short pigtails and copper beads, hugs a brown leather almanac and watches. Cool, tense atmosphere."
          },
          {
            img: 'story/y2-ch3-02.webp',
            alt: 'On a windy open platform at the top of the Observatory, the heroine, Juno, Felix and Celeste look out over a wide moor, a lake and small villages; Professor Penhallow points at the view.',
            text: "Professor Penhallow takes your class up to the Watchtower, the very top of the Observatory. The whole moor lies below you: the lake, the tram road, the little villages. 'From up here you cannot read a single number,' she says. 'Good. This is the big picture. In a report, the big picture has a name. It is the [[overview|a short description of the main points|ภาพรวม]]. It comes second, straight after the introduction, and it starts with \"Overall\". Without one, Task Achievement cannot go above Band 5. The overview is [[indispensable|absolutely necessary|ขาดไม่ได้|C1]].'",
            rare: { w: 'indispensable', g: 'absolutely necessary', t: 'ขาดไม่ได้', pos: 'adjective', ex: 'An overview is indispensable: without it, Task Achievement stays at Band 5 or below.' },
            prompt: "A windy open stone platform at the very top of the Observatory tower, high above a wide green-and-purple moor with a black lake, a winding tram road and tiny villages far below. Professor Penhallow, her charcoal robe blowing, points out over the view. The heroine, Juno Marlowe, Felix Okafor and Celeste Ashby stand at the parapet, hair and scarves whipping in the wind. Bright clear sky, a sense of height and space."
          },
          {
            img: 'story/y2-ch3-03.webp',
            alt: 'Professor Quist proudly unrolls a long scroll covered in numbers at the top of the tower; Penhallow, with spectacles on a chain, raises one eyebrow while Juno hides a smile.',
            text: "Professor Quist bursts through the door. 'My overview!' he announces. 'Overall, the Night Market rose by exactly 45,000 to 65,000, the museum fell to 12,000 and the temple reached 31,500!' Penhallow raises one eyebrow. 'Bartholomew, that is a list of details. An overview has no figures.' Juno writes hers. 'Overall, visitors to the Night Market rose, whereas the museum lost visitors.' 'Names, years and words like doubled are fine,' says Penhallow. 'Values belong in the details.' Quist's face turns a [[distinctly|clearly; in a way that is easy to notice|อย่างชัดเจน|C1]] pinker shade.",
            rare: { w: 'distinctly', g: 'clearly; in a way that is easy to notice', t: 'อย่างชัดเจน', pos: 'adverb', ex: 'Rail travel was distinctly more popular than air travel in both years.' },
            prompt: "The windy top of the Observatory. Professor Quist proudly unrolls a very long scroll that tumbles to his feet, covered in tiny unreadable figures. Professor Penhallow, silver bob and brass spectacles on a chain, looks at it with one eyebrow raised. Behind her, Juno Marlowe covers a smile with her notebook. Bright windy daylight, a comic moment."
          },
          {
            img: 'story/y2-ch3-04.webp',
            alt: 'Below the tower, in a room full of floating bar charts, Felix photographs a glowing bar with his brass camera while the heroine points at its height.',
            text: "Below the Watchtower is the Counting Room, where the details live. Felix walks between the floating bars with his camera. Each time you speak, he asks the same question. 'The Night Market grew quickly.' 'Where's the number?' 'It grew from 20,000 visitors in 2012 to 65,000 in 2022.' Click. 'Now that I can print.' In paragraphs three and four, every sentence makes a claim and gives a figure to [[support|show that something is true|ยืนยัน]] it. A claim with no figure is [[unsubstantiated|not supported by facts or figures|ไม่มีหลักฐานรองรับ|C1]].",
            rare: { w: 'unsubstantiated', g: 'not supported by facts or figures', t: 'ไม่มีหลักฐานรองรับ', pos: 'adjective', ex: 'An unsubstantiated detail sentence such as "Sales grew a lot" needs a figure.' },
            prompt: "The Counting Room, a long vaulted room below the Watchtower filled with tall floating bars of soft coloured light like a giant bar chart, no numbers visible. Felix Okafor raises his brass camera to photograph the top of one glowing bar, his press badge swinging. The heroine stands beside the bar and points at its top edge. Warm amber light from the bars, an energetic working mood."
          },
          {
            img: 'story/y2-ch3-05.webp',
            alt: 'Professor Weaver, in a crimson robe with a long white braid, holds a tall glass flask of gold liquid against marked lines while the heroine watches the level closely.',
            text: "Professor Weaver of Loom fills a tall glass flask. The gold liquid climbs from the 60 line to the 70 line. 'It rose to 70,' she says. 'To is the end point. It rose by 10. By is the size of the change. From 60 to 70 gives both. And it [[peaked|reached its highest point|ขึ้นถึงจุดสูงสุด]] at 70: at is one point.' Then she warns you. 'A move from 20% to 30% is a rise of 10 [[percentage points|the gap between two percentages|จุดเปอร์เซ็นต์]], not 10%. The difference is not [[trivial|small and not important|เล็กน้อยไม่สำคัญ|C1]].'",
            rare: { w: 'trivial', g: 'small and not important', t: 'เล็กน้อยไม่สำคัญ', pos: 'adjective', ex: 'The gap between 10% and 10 percentage points is not trivial: it changes the meaning.' },
            prompt: "A stone workroom with shelves of glassware. Professor Ada Weaver, in a crimson robe with a long white braid, holds up a tall glass flask with evenly spaced etched lines; glowing gold liquid rises inside it. The heroine leans close to watch the level, notebook in hand. Warm gold glow on their faces, a precise, attentive mood."
          },
          {
            only: 'returning',
            img: 'story/y2-ch3-06.webp',
            alt: 'In the Counting Room, Celeste shows the heroine a brown spellbook open to a page of frames; behind them a floating line graph glows between two gridlines.',
            text: "Celeste opens her spellbook to last year's page. 'Remember? My thesis frame?' She crosses it out with one line. 'Here, there's no thesis. This is my new overview frame: \"Overall, [main trend], while [biggest difference].\" No gap for a number.' Then she points at a line between two gridlines. 'And when a value falls between the lines, I don't guess. I write \"[[approximately|close to a number, but not exactly|ประมาณ]] 45\" or \"just over 40\".' Her new page is [[concise|giving the information in few words|กระชับรัดกุม|C1]] and exact.",
            rare: { w: 'concise', g: 'giving information clearly in few words', t: 'กระชับรัดกุม', pos: 'adjective', ex: 'A concise introduction needs only about 30 words.' },
            prompt: "A quiet corner of the Counting Room, with a glowing line graph floating behind two figures, its line passing between two faint gridlines. Celeste Ashby holds her worn brown spellbook open, one blank page with a single crossed-out line and a fresh page of neat frames with no readable words. The heroine leans in, interested. Soft amber light, a friendly mood."
          },
          {
            img: 'story/y2-ch3-07.webp',
            alt: 'A grey newspaper sheet lies on a table beside a glowing line graph; Felix compares them with a pencil while the heroine looks up at a copper pipe in the wall, and a faint grey frost creeps along the edge of the sheet.',
            text: "A new Whisper slides under the Counting Room door. It lists every year, one by one, with no overview at all. Felix checks it against the real chart. 'Wrong. Wrong. And this one is invented.' When a value lies between two gridlines, a careful writer says [[approximately|close to a number, but not exactly|ประมาณ]] or 'just over'. The Quill simply makes one up. Then the pipe in the wall whispers again: 'Fell… fell…' You turn. Nobody else heard it. Today's errors are [[systematic|following a fixed pattern; not random|เป็นระบบ|C1]]: every rise is printed as a fall.",
            rare: { w: 'systematic', g: 'following a fixed pattern; not random', t: 'เป็นระบบ', pos: 'adjective', ex: 'A systematic check of each figure catches errors before you send the report.' },
            prompt: "The Counting Room table at dusk. A thin grey newspaper sheet with unreadable print lies beside a small floating line graph; a faint grey frost creeps along the sheet's edge. Felix Okafor compares them with a pencil, frowning. The heroine has turned away from the table to stare at an old copper pipe in the stone wall, listening. Cooling blue light, a creeping unease."
          }
        ],
        missions: [
          { kind: 'sub', id: 'm03s1' }, { kind: 'sub', id: 'm03s2' }, { kind: 'sub', id: 'm03s3' },
          { kind: 'check', id: 'm03l1' },
          { kind: 'sub', id: 'm04s1' }, { kind: 'sub', id: 'm04s2' }, { kind: 'sub', id: 'm04s3' },
          { kind: 'check', id: 'm04l1' },
          { kind: 'view', view: 'bootcamp', label: 'Duelling Hall: your first duel', note: 'Open the Duelling Hall and take one chart through every step. Steps 1–4 (time, triage, the big picture, group and select) are this chapter\'s skills; the rest come later, so guess and learn.' }
        ],
        gate: {
          checks: ['m03l1', 'm04l1'], checkIds: ['m03ck', 'm04ck'], extra: [],
          intro: "Professor North of Compass meets you at the top of the stairs. 'Two gates. An overview with no figures, and details where every sentence carries a number. Whatever the corridors say about you, the big picture comes first, then the proof.'",
          pass: "North gives you a small brass spyglass. 'Look at the whole chart before you look at any number. Then prove every claim with a figure. That is also how you answer a rumour.'"
        },
        ending: {
          img: 'story/y2-ch3-end.webp',
          alt: 'At night in a dormitory corridor, a small first-year sits on a window seat writing in a brown almanac by moonlight; the heroine watches from behind a pillar as faint grey writing appears on the page by itself.',
          text: "Late that night you pass the first-years' corridor. Ploy is sitting on a window seat in the moonlight, writing in her brown almanac. She writes a sentence, and then she waits. Slowly, neat grey handwriting appears on the page by itself, answering her. Ploy smiles, and she looks [[enthralled|so interested that you cannot look away|หลงใหล|C1]]. You step closer, and a board creaks. She snaps the almanac shut. 'It's just my notebook,' she says. Tomorrow the Tide Clock opens for lessons. And the whisper is getting louder.",
          rare: { w: 'enthralled', g: 'so interested that you cannot look away', t: 'หลงใหล', pos: 'adjective', ex: 'The class was enthralled by the living chart as its lines moved.' },
          prompt: "A dim castle corridor at night with a tall arched window. Ploy Saengkaew, a small first-year with two short pigtails and copper beads, sits on the moonlit window seat with a brown leather almanac open on her knees; faint grey handwriting with no readable letters seems to rise from the page by itself. The heroine watches from behind a stone pillar in the foreground, half in shadow. Silver moonlight and deep shadows, a secretive, eerie mood."
        },
        newsroom: 'The castle whispers that you are feeding the Quill. Quist puts every figure in his overview, The Whisper lists every year with no overview, and Ploy writes to an almanac that writes back.'
      },

      /* ================================================== CHAPTER 4 */
      {
        id: 'ch4', n: 4, title: 'The Tide Clock', place: 'Spellbook Workshop and the Tide Clock',
        blurb: 'Five lines of water, two groups, the first page of your own spellbook, and a camera that turns grey.',
        keepsake: { id: 'clasp', name: 'Spellbook clasp', desc: 'A brass clasp for a TREND page written in your own words.' },
        opens: ['template', 'lab'],
        pages: [
          {
            img: 'story/y2-ch4-01.webp',
            alt: 'Dr Strand turns the brass hands of the tall glass Tide Clock on the Observatory stairs; five coloured lines of water rise and fall inside it while the heroine and Juno watch; a faint grey frost mark remains on the floor.',
            text: "The Tide Clock is open again, but a grey frost mark still lies on the floor. Inside the glass case, five lines of coloured water rise and fall as Dr Strand turns the hands through the years. 'Years along the bottom,' she says. 'So this is TREND mode. Past years take the past simple: rose, fell, peaked.' She taps 2030. 'A future year is a [[projection|a figure for a year that has not come yet|การคาดการณ์]]. Say \"is expected to reach 50\". Follow each line's [[trajectory|the path something follows as it moves|เส้นทางการเคลื่อนที่|C1]] from start to end.'",
            rare: { w: 'trajectory', g: 'the path something follows as it moves or changes', t: 'เส้นทางการเคลื่อนที่', pos: 'noun', ex: 'The trajectory of car sales was upward until 2015, then flat.' },
            prompt: "The Tide Clock on the Observatory stairs: a tall glass case with brass hands on a round face with no numerals, and five lines of coloured water inside, each at a different height like lines on a graph. Dr Halima Strand reaches up to turn the hands. The heroine and Juno Marlowe watch closely; a pale grey frost mark still stains the stone floor at their feet. Cool daylight from a narrow window, a careful, slightly haunted mood."
          },
          {
            img: 'story/y2-ch4-02.webp',
            alt: 'Professor Quist dramatically mimes a rocket shooting upwards in front of a line graph, while Professor Liang in a plum robe holds up two small books joined by a chain and the heroine laughs quietly.',
            text: "Professor Quist demonstrates his favourite verbs. 'Skyrocketed! Plummeted! A staggering explosion!' The line behind him goes from 50 to 52. Professor Liang of Lexicon coughs. 'That line rose [[slightly|by a small amount|เล็กน้อย]], Bartholomew.' He holds up two chained books. 'Rose and a rise, fell and a fall. Learn them in pairs. Rose [[sharply|quickly and by a large amount|อย่างรวดเร็วและมาก]] for a big change. Rose [[steadily|at an even speed, without jumps|อย่างสม่ำเสมอ]] for an even climb.' The word must be [[commensurate|matching in size or degree|เหมาะสมกับขนาด|C1]] with the change.",
            rare: { w: 'commensurate', g: 'matching in size or degree', t: 'เหมาะสมกับขนาด', pos: 'adjective', ex: 'Choose an adverb commensurate with the change: slightly for 2%, sharply for 40%.' },
            prompt: "A classroom in the Observatory with a glowing line graph floating behind the speakers, its line rising only a tiny amount. Professor Quist mimes a rocket shooting upwards, arms flung high and monocle flying on its chain. Beside him, Professor Wen Liang in a plum robe calmly holds up two small books linked by a short chain. The heroine, at a desk, hides a laugh behind her hand. Bright, comic daylight."
          },
          {
            img: 'story/y2-ch4-03.webp',
            alt: 'Juno pours coloured water from the Tide Clock into two glass flasks, one with two rising lines and one with three falling lines, while Professor Brigg, bearded in a teal robe, nods.',
            text: "Five lines are too many to describe one by one. Juno pours them into two glass flasks. 'Group them!' she says. 'The two lines that rise go in this flask. The three that fall go in that one.' Professor Brigg of Bridge nods. 'Each [[group|a set of things that share the same pattern|กลุ่ม]] becomes one paragraph: Detail A and Detail B. Every [[category|one item in a chart, such as one line or one bar|หมวดหมู่]] goes somewhere. Nothing is left out.' The two rising lines climb [[in tandem|together, at the same time|ไปพร้อมกัน|C1]], so they belong together.",
            rare: { w: 'in tandem', g: 'together, at the same time', t: 'ไปพร้อมกัน', pos: 'phrase', ex: 'Prices and wages rose in tandem between 2000 and 2010.' },
            prompt: "A workbench beside the Tide Clock. Juno Marlowe carefully pours coloured water into two tall glass flasks: one holds two bright rising ribbons of colour, the other three ribbons sinking downward. Professor Tomás Brigg, bearded, in a teal robe, stands beside her and nods with approval. Warm workshop light, a satisfied 'aha' mood."
          },
          {
            img: 'story/y2-ch4-04.webp',
            alt: 'Juno sits with her head in her hand at a desk covered in a very long list of numbers; the heroine points at three circled figures in an open notebook.',
            text: "But Juno's first paragraph is a list: every line, every year. She holds her head. 'It's all true. So why is it bad?' 'Because it's a list, not a report,' you say. 'Choose three to five figures for each group: the first, the last, the highest, and one comparison.' Brigg smiles. 'Leave the rest out on purpose. [[Select|choose the most important things|คัดเลือก]] first, then compare.' An [[exhaustive|including every single part or detail|ครบถ้วนทุกรายละเอียด|C1]] list of years is what the examiner calls [[mechanical|done by habit, without thinking|เป็นกลไกซ้ำๆ]].",
            rare: { w: 'exhaustive', g: 'including every single part or detail', t: 'ครบถ้วนทุกรายละเอียด', pos: 'adjective', ex: 'An exhaustive list of every year is not a report; select the key figures.' },
            prompt: "A study table by a narrow tower window. Juno Marlowe rests her head in one hand, a long paper scroll of tiny unreadable figures spilling over the desk and onto the floor. The heroine leans in and points at three circled marks in an open notebook. Late-afternoon light, a gently humorous, encouraging mood."
          },
          {
            img: 'story/y2-ch4-05.webp',
            alt: 'In the Spellbook Workshop, a background student copies from Quist\'s book and the ink on his page turns grey and blank; the heroine writes her own page with gaps while Celeste watches approvingly.',
            text: "In the Spellbook Workshop you design the first page of your own spellbook: TREND. Quist sells copies of his Perfect Report at the door. One boy copies it into his book, and the ink goes grey and blank. 'A page is yours only when the frames are your own words,' says Brigg. Your frames have gaps, and each gap is a [[variable|a gap in your frame that you fill from the chart|ตัวแปร]]: [rising group], [start figure], [peak and year]. Your page is [[bespoke|made for one particular person|ทำขึ้นเฉพาะบุคคล|C1]]. In the exam, the chart fills the gaps.",
            rare: { w: 'bespoke', g: 'made specially for one person or purpose', t: 'ทำขึ้นเฉพาะบุคคล', pos: 'adjective', ex: 'A bespoke spellbook page uses your own frames, not a memorised model.' },
            prompt: "The Spellbook Workshop: a long room with wooden benches, blank leather books and inkwells. In the background a student copies from a book with Quist's portrait on the cover, and the ink on his page turns grey and blank. In the foreground, the heroine writes her own page in a brown leather book, with short lines and empty gaps but no readable words, while Celeste Ashby looks over her shoulder approvingly. Warm lamplight, a quiet sense of ownership."
          },
          {
            only: 'returning',
            img: 'story/y2-ch4-06.webp',
            alt: 'The heroine opens last year\'s brown spellbook beside a new one; Celeste points from the old pages to the new, and the second-year pin on the heroine\'s robe catches the lamplight.',
            text: "You open last year's spellbook beside the new one. Last year your gaps held a position, a reason and an example. This year they hold a category, a figure and a year. 'The two pages are [[analogous|similar in some way|คล้ายคลึงกัน|C1]],' says Celeste. 'Your own frames, filled from the task. Only the filling has changed. Last year the gaps wanted ideas. This year they want numbers, and the numbers come only from the chart.' You smile. A year ago you would never have believed Celeste could help you.",
            rare: { w: 'analogous', g: 'similar in some way', t: 'คล้ายคลึงกัน', pos: 'adjective', ex: 'A TREND page is analogous to a COMPARE page: both have an overview frame with no figures.' },
            prompt: "A lamplit table in the Spellbook Workshop. Two leather spellbooks lie open side by side: one older and worn, one new, both with neat lines and gaps but no readable words. The heroine, wearing a small brass second-year pin on her robe, looks from one to the other while Celeste Ashby points between them. Warm golden light, a friendly, reflective mood."
          },
          {
            img: 'story/y2-ch4-07.webp',
            alt: 'At dusk on a tower balcony, the heroine sends a sealed report away with the grey-brown owl; Felix stands beside her, holding up his brass camera towards the stairwell door with a determined face.',
            text: "You cast your TREND page on a real chart and fill every gap from the data. Then you write the full report in the Scriptorium, check it line by line, and give it to Nutmeg. She flies off towards the examiners. Felix watches with you. 'Half the castle thinks you're behind the Frost,' he says. 'So tonight I'm taking my camera to the Tide Clock. One photo of whatever whispers in those pipes, and you're [[vindicated|proved to be right or innocent|ได้รับการพิสูจน์ว่าถูกต้องหรือบริสุทธิ์|C1]].' He sounds brave. He looks a little scared.",
            rare: { w: 'vindicated', g: 'proved to be right or innocent', t: 'ได้รับการพิสูจน์ว่าถูกต้องหรือบริสุทธิ์', pos: 'adjective', ex: 'Her careful estimate was vindicated when the final figures came out.' },
            prompt: "A small stone balcony on the Observatory at dusk, purple sky over the moor. Nutmeg, the grey-brown owl, flies away with a sealed paper. The heroine watches her go, a brown spellbook under her arm. Felix Okafor stands beside her, lifting his brass camera towards a dark stairwell doorway with a determined but nervous face. Warm sunset light fading into cold shadow."
          }
        ],
        missions: [
          { kind: 'sub', id: 'm05s1' }, { kind: 'sub', id: 'm05s2' }, { kind: 'sub', id: 'm05s3' },
          { kind: 'check', id: 'm05l1' },
          { kind: 'sub', id: 'm06s1' }, { kind: 'sub', id: 'm06s2' }, { kind: 'sub', id: 'm06s3' },
          { kind: 'check', id: 'm06l1' },
          { kind: 'view', view: 'lab', mode: 'TREND', label: 'Spellbook Workshop: design your TREND page', note: 'In Design, write your TREND page in your own words, with a gap for every variable the chart will fill, and save it.' },
          { kind: 'writing', label: 'Your first report to the examiners', note: 'Cast your TREND page on a chart, write the full report (150 words or more) in the Scriptorium, run the Ten Wards (the ten checks before you send) and send it to the examiners.', min: 1, kind2: 'report', mode: 'TREND', full: true }
        ],
        gate: {
          checks: ['m05l1', 'm06l1'], checkIds: ['m05ck', 'm06ck'],
          extra: [
            { id: 'lab-design', mode: 'TREND', label: 'A saved TREND page', note: 'One TREND page designed and saved in the Spellbook Workshop.' },
            { id: 'report-sent', min: 1, mode: 'TREND', full: true, label: 'One TREND report sent to the examiners', note: 'One full report (150 words or more) on a TREND chart, sent from the Scriptorium.' }
          ],
          intro: "'Four things,' says Brigg. 'Two gates, a TREND page in your own words, and one report already flying. A spellbook nobody has used is only a drawing. And a copied one goes grey.'",
          pass: "Brigg fits a brass clasp to your spellbook. 'Your frames, the chart's figures. The examiners will read your words, not Professor Quist's.'"
        },
        ending: {
          img: 'story/y2-ch4-end.webp',
          alt: 'At dawn on the Observatory stairs beside the Tide Clock, Felix stands frozen and frosted grey with his brass camera raised; the heroine and Juno kneel beside him, and Dr Strand hurries down the steps.',
          text: "At dawn Juno shakes you awake. 'It's Felix.' You run to the Tide Clock. Felix stands on the stairs, still and grey with frost, his camera raised. The camera is grey too. Its last photo shows nothing but a blank grey mirror-shape. He is cold, [[inert|not moving, without life or action|นิ่งไม่เคลื่อนไหว|C1]], but he is breathing. Dr Strand kneels beside him. 'The same Frost as the cat,' she says quietly. Behind you, a student hisses, 'That second-year was here last night too.'",
          rare: { w: 'inert', g: 'not moving; without action', t: 'นิ่งไม่เคลื่อนไหว', pos: 'adjective', ex: 'The market stayed inert for a decade, with sales flat at about 2 million.' },
          prompt: "Dawn on the Observatory stairs beside the Tide Clock. Felix Okafor stands frozen mid-step, his brass camera raised to his eye, his whole figure and the camera coated in pale grey frost. The heroine and Juno Marlowe kneel beside him in shock, and Dr Halima Strand hurries down the steps towards them. Pale cold dawn light, grey mist curling from the pipes, a dramatic cliff-hanger mood."
        },
        newsroom: 'Quist calls a two-point rise "a staggering explosion". The Whisper prints every rising Tide Clock line as a fall. At dawn Felix and his camera are found frozen grey on the Observatory stairs.'
      },

      /* ================================================== CHAPTER 5 */
      {
        id: 'ch5', n: 5, title: 'The Hall of Scales', place: 'The Hall of Scales and the Mending Room',
        blurb: 'No time axis, no trend verbs. Then a brown almanac in the scrap bin, and a memory from 1976.',
        keepsake: { id: 'scales', name: 'The brass scales', desc: 'A tiny brass scale on a chain, for comparing without a single trend verb.' },
        opens: ['faults'],
        pages: [
          {
            img: 'story/y2-ch5-01.webp',
            alt: 'A round stone hall full of tall brass balance scales with bars of light standing in their pans like a bar chart; Dr Strand explains while the heroine and Juno look up.',
            text: "Below the Observatory is the Hall of Scales, a round stone room full of brass scales. Bars of light stand in their pans. Nothing here moves through time: each scale shows one year only. 'No time axis, no trend verbs,' says Dr Strand. 'Nothing rose and nothing fell. You compare instead: higher than, the highest, twice as much.' Juno nods. 'So this is COMPARE mode.' 'Yes. Look for the [[disparity|a large difference between two things|ความแตกต่างอย่างมาก|C1]] between the biggest and the smallest. And look for the [[exception|one thing that does not follow the pattern|ข้อยกเว้น]]. Both belong in the overview.'",
            rare: { w: 'disparity', g: 'a large difference between two things', t: 'ความแตกต่างอย่างมาก', pos: 'noun', ex: 'There was a wide disparity between urban and rural internet use.' },
            prompt: "The Hall of Scales: a round stone hall under a low dome, filled with tall brass balance scales whose pans hold upright bars of soft coloured light of different heights, like a bar chart. Dr Halima Strand stands among them explaining, one hand on a scale. The heroine and Juno Marlowe look up at the bars. Still, golden light, a calm sense of balance."
          },
          {
            img: 'story/y2-ch5-02.webp',
            alt: 'In the Hall of Scales the heroine faces a girl with a high black ponytail across a giant glowing bar chart; Professor Quist stands between them, pointing at a bar with a confident smile.',
            text: "Mina Sato from Compass stands across a giant bar chart from you. 'Bus, 20%. Motorcycle, 40%,' she reads. You answer with a comparison. 'Twice as many workers travelled by motorcycle as by bus, at 40% and 20% [[respectively|in the same order as the things just named|ตามลำดับ]].' Professor Quist claps. 'And the motorcycle rose to 40%!' Dr Strand shakes her head. 'Rose from what, Bartholomew? It is one year.' The motorcycle simply had the larger share. Quist looks [[nonplussed|so surprised that you do not know what to do|งงงวย|C1]].",
            rare: { w: 'nonplussed', g: 'so surprised that you do not know what to say or do', t: 'งงงวย', pos: 'adjective', ex: 'Students are often nonplussed by a chart with no time axis until they name its mode.' },
            prompt: "In the Hall of Scales, the heroine faces Mina Sato, who has a high black ponytail and a navy-and-silver scarf, across a giant glowing bar chart with two tall bars and no numbers. Professor Quist stands between them pointing grandly at a bar, smiling with total confidence, while Dr Halima Strand in the background shakes her head. Warm golden light, light comedy."
          },
          {
            img: 'story/y2-ch5-03.webp',
            alt: 'Professor Weaver stands beside a large round glowing pie chart divided into slices of different sizes; Celeste lifts a small flask that gives off a puff of purple smoke.',
            text: "In the middle of the hall hangs a glowing pie. 'A pie shows shares of one whole,' says Professor Weaver. 'Food was the largest [[proportion|a part of a whole|สัดส่วน]], at a little under half. Rent made up about a third.' Celeste tries one. 'Food rose to 45%.' There is a soft pop and purple smoke. 'One pie, one year,' says Weaver. 'Use a [[fraction|a part such as a half or a third|เศษส่วน]] or a share. Food [[accounted for|formed a part of a total|คิดเป็น]] 45%.' A slice of 2% is [[negligible|so small that it hardly matters|น้อยมากจนไม่สำคัญ|C1]], but you still name it.",
            rare: { w: 'negligible', g: 'so small that it hardly matters', t: 'น้อยมากจนไม่สำคัญ', pos: 'adjective', ex: 'Spending on transport was negligible, at just 2% of the total.' },
            prompt: "The centre of the Hall of Scales, where a large round glowing pie chart floats in the air, divided into slices of different sizes in muted colours, with no labels. Professor Ada Weaver, crimson robe and long white braid, gestures at the biggest slice. Beside her, Celeste Ashby holds a small glass flask that gives off a comic puff of purple smoke. Soft warm glow, playful mood."
          },
          {
            img: 'story/y2-ch5-04.webp',
            alt: 'Four professors in navy, teal, plum and crimson robes sit at a long table covered in printed tables; Juno points at one row while Professor North, in navy, nods.',
            text: "At the end of the hall the four Heads sit at a long table covered in paper tables. Professor North gives the rule. 'Read a table by [[row|a line of figures that goes across|แถว]] and by [[column|a line of figures that goes down|คอลัมน์]]. Find the biggest and the smallest numbers first. Then compare whole rows, never one cell at a time.' Juno points. 'This is the only country where buses beat cars.' 'Then that is your exception,' says North. 'In every other row, cars lead [[uniformly|in the same way in every case|อย่างสม่ำเสมอเหมือนกัน|C1]]. One line says so.'",
            rare: { w: 'uniformly', g: 'in the same way in every case', t: 'อย่างสม่ำเสมอเหมือนกัน', pos: 'adverb', ex: 'Prices rose uniformly across all five cities, by about 10%.' },
            prompt: "A long oak table at the end of the Hall of Scales, covered in large printed tables with rows and columns of unreadable marks. Four professors sit behind it: Professor Rhea North in navy, Professor Tomás Brigg in teal and bearded, Professor Wen Liang in plum, Professor Ada Weaver in crimson with a long white braid. Juno Marlowe leans over and points at one row while the professor in navy nods. Even, formal light."
          },
          {
            img: 'story/y2-ch5-05.webp',
            alt: 'In the Mending Room, the heroine fixes a sentence on a slate at a workbench; behind her, a small first-year with copper-beaded pigtails pushes a brown almanac deep into a scrap bin and hurries away.',
            text: "Back in the Workshop you design your COMPARE page. It has gaps for [largest category], [smallest category] and [exception]. Its overview frame has no figure gaps. Then you visit the Mending Room. Every wrong answer you give comes here, and you fix it yourself. You mend a Whisper line: 'Cats rose to 40% of the pie, because everyone loves cats.' It becomes: 'Cats were the most popular pet, at 40%.' Behind you, Ploy pushes her brown almanac into the scrap bin and runs out. She looks [[distraught|very upset and worried|ทุกข์ใจอย่างมาก|C1]].",
            rare: { w: 'distraught', g: 'very upset and worried', t: 'ทุกข์ใจอย่างมาก', pos: 'adjective', ex: 'The distraught student had forgotten to write an overview.' },
            prompt: "The Mending Room: a small workshop with a workbench, jars of brass parts and a notice board with no readable words. The heroine works at a slate on the bench, mending a sentence. Behind her, Ploy Saengkaew, small with copper-beaded pigtails and red eyes, pushes a brown leather almanac deep into a metal scrap bin and turns to run out. Warm lamplight in front, a cold draught from the open door behind."
          },
          {
            img: 'story/y2-ch5-06.webp',
            alt: 'At night in a dormitory, the heroine writes in a brown almanac by lamplight; neat grey handwriting rises from the page to answer her, and a faint grey-blue glow spills out of it.',
            text: "That night you open the almanac from the scrap bin. Every page is blank. You write, 'Who are you?' Your ink sinks into the paper. Then neat grey handwriting appears. 'A friend. Why write your own reports? Copy mine, and you will never be wrong.' Its voice is [[ingratiating|trying too hard to please someone|ประจบประแจง|C1]]. You write, 'What is the Sealed Archive?' The page answers, 'Let me show you.' The handwriting spins into a picture, and the picture pulls you in.",
            rare: { w: 'ingratiating', g: 'trying too hard to please someone', t: 'ประจบประแจง', pos: 'adjective', ex: 'An ingratiating line such as "I hope you enjoy my report" does not belong in a report.' },
            prompt: "A small dormitory at night, lit by a single lamp. The heroine sits on her bed with a brown leather almanac open on her knees, quill in hand. Neat grey handwriting with no readable letters rises off the blank page like smoke, and a faint grey-blue glow spills over her face. Deep shadows, a hypnotic, slightly dangerous mood."
          },
          {
            only: 'returning',
            img: 'story/y2-ch5-07.webp',
            alt: 'The heroine sits on her dormitory bed between two open books, a brown almanac with grey handwriting and her own spellbook; she frowns at the almanac and keeps her hand on her spellbook.',
            text: "Before you fall into the picture, you think of last year. The Gossip Quill also loved copied words. It grew fat on memorised essays and faded when people wrote their own. The almanac is [[reminiscent|making you think of something else|ชวนให้นึกถึง|C1]] of the Quill: the same sweet voice, the same hunger for copies. You keep one hand on your own spellbook, just in case. Then the grey handwriting pulls, and the room spins away.",
            rare: { w: 'reminiscent', g: 'making you think of something similar', t: 'ชวนให้นึกถึง', pos: 'adjective', ex: 'The 2020 figures are reminiscent of the peak in 2008.' },
            prompt: "The heroine sits on her dormitory bed at night between two open books: on her left a brown leather almanac with grey handwriting curling off its page, on her right her own worn spellbook, which she presses down firmly with one hand. She frowns at the almanac, wary. Lamplight on one side, grey-blue glow on the other, a tense, divided mood."
          }
        ],
        missions: [
          { kind: 'sub', id: 'm07s1' }, { kind: 'sub', id: 'm07s2' }, { kind: 'sub', id: 'm07s3' },
          { kind: 'check', id: 'm07l1' },
          { kind: 'view', view: 'lab', mode: 'COMPARE', label: 'Spellbook Workshop: design your COMPARE page', note: 'In Design, write your COMPARE page in your own words: an overview frame with no figure gaps, and detail frames with gaps for the largest, the smallest and the exception.' },
          { kind: 'view', view: 'faults', label: 'Mending Room: fix what you broke', note: 'Open the Mending Room and mend the faults waiting there.' }
        ],
        gate: {
          checks: ['m07l1'], checkIds: ['m07ck'],
          extra: [
            { id: 'lab-design', mode: 'COMPARE', label: 'A saved COMPARE page', note: 'One COMPARE page designed and saved in the Spellbook Workshop.' }
          ],
          intro: "Dr Strand sets a brass scale in front of you. 'One gate and one page. Compare bars, slices and rows without a single trend verb, and design your COMPARE page in your own words.'",
          pass: "The two pans settle level. Dr Strand gives you a tiny brass scale on a chain. 'Higher than, twice as, respectively. Nothing rose, and you never said it did. Unlike some people.'"
        },
        ending: {
          img: 'story/y2-ch5-end.webp',
          alt: 'A grey memory scene from long ago: a tall student in an old-fashioned robe stands beside the open Tide Clock case and points at a young man holding a ring of iron keys; a frosty brass glint shows through the open case.',
          text: "You stand on the Observatory stairs, but everything is grey and old. A brass plate says 1976. A tall student with a cold smile stands by the open Tide Clock. Behind the case, a brass shape glints. 'Orrin Vane, top of the year,' the almanac whispers. Teachers run up the stairs. Orrin points at a young man holding iron keys. 'He opened it, sir. They're his keys.' The young man is pale and frightened. His face is [[unmistakable|impossible to confuse with anyone else|ชัดเจนจนไม่มีทางเข้าใจผิด|C1]]. It is Mr Fenwick.",
          rare: { w: 'unmistakable', g: 'impossible to confuse with anything else', t: 'ชัดเจนจนไม่มีทางเข้าใจผิด', pos: 'adjective', ex: 'The upward trend in solar power is unmistakable.' },
          prompt: "A memory scene drawn in faded grey-sepia tones: the Observatory stairs in 1976. A tall teenage student in an old-fashioned black robe, with a cold, polished smile, stands beside the Tide Clock, whose glass case swings open to reveal a glint of brass behind it. He points at a frightened young man in a dark coat holding a ring of iron keys, recognisably a young Mr Fenwick. Shadowy teachers hurry up the stairs. The heroine stands at the edge, coloured and solid among the grey figures. Dreamlike, shocking cliff-hanger mood."
        },
        newsroom: 'Quist says a single-year motorcycle bar "rose". Ploy throws her almanac away, and it shows you 1976: Orrin Vane blames a young keyholder for opening the Archive. The young man is Mr Fenwick.'
      },

      /* ================================================== CHAPTER 6 */
      {
        id: 'ch6', n: 6, title: 'The Cellars and the Moor Maps', place: 'Brewing Cellars and the Map Room',
        blurb: 'Stages in order, in the passive. A friend sent away. Two maps of the Observatory, and a door that is not where it should be.',
        keepsake: { id: 'vial', name: 'Vial of moor ink', desc: 'A small glass vial of ink brewed in seven stages, in order. Keep it: real ink may be needed.' },
        opens: [],
        pages: [
          {
            img: 'story/y2-ch6-01.webp',
            alt: 'In a stone cellar with a bubbling copper pot, Professor Brigg counts on his fingers beside seven glass jars standing in a row; the heroine whispers to Juno and Celeste.',
            text: "Next morning the almanac is gone from your trunk. Someone has taken it. You whisper the 1976 memory to Juno and Celeste in the Brewing Cellars, where Brigg shows you how moor ink is made. 'This is SEQUENCE mode,' he says. 'No years and no bars, only steps. Count the stages first.' At the first [[stage|one step in a process|ขั้นตอน]], heather is picked. Next, it is washed. After that, it is boiled. 'Seven [[successive|following one after another|ต่อเนื่องกัน|C1]] stages,' says Brigg. 'And a different sequencer each time: next, after that, once it has cooled, finally.'",
            rare: { w: 'successive', g: 'following one after another', t: 'ต่อเนื่องกัน', pos: 'adjective', ex: 'Exports fell for three successive years before recovering in 2015.' },
            prompt: "The Brewing Cellars: a vaulted stone cellar with a large bubbling copper pot and seven glass jars standing in a neat row on a bench, each holding a different stage of dark ink, from green heather to black. Professor Tomás Brigg, bearded, in a teal robe, counts on his fingers beside the jars. In the foreground, the heroine whispers urgently to Juno Marlowe and Celeste Ashby. Warm firelight and steam, a secretive mood."
          },
          {
            img: 'story/y2-ch6-02.webp',
            alt: 'Professor Weaver heats a glass flask of dark ink over a lamp; Professor Quist leans in to sniff it with his eyes closed, and the heroine writes in a notebook.',
            text: "Professor Weaver heats a flask over a lamp. 'A process has no dates, so it takes the present simple,' she says. 'When people do a step, use the [[passive|a verb form such as \"is heated\", where the action matters more than who does it|รูปประโยคถูกกระทำ]]: the ink is heated. When nature does it, stay active: the rain falls.' Quist sniffs the flask. 'Then I lovingly heated it, because I adore ink!' 'Wrong tense, and a reason,' says Weaver. 'The ink is heated. Who loves it is [[extraneous|not belonging to the subject; not relevant|ไม่เกี่ยวข้อง|C1]].'",
            rare: { w: 'extraneous', g: 'not relevant to the subject', t: 'ไม่เกี่ยวข้อง', pos: 'adjective', ex: 'Reasons are extraneous in a process report: describe only the stages.' },
            prompt: "A corner of the Brewing Cellars. Professor Ada Weaver, crimson robe and long white braid, heats a glass flask of dark ink over a small brass lamp. Professor Quist leans in to sniff it dramatically with his eyes closed, monocle dangling. The heroine writes in a notebook beside them, trying not to smile. Warm lamp glow, gentle comedy."
          },
          {
            img: 'story/y2-ch6-03.webp',
            alt: 'Juno pours finished ink into a small glass vial at the end of a row of seven jars; a circular brass wheel diagram glows on the wall behind her next to a straight arrow of seven steps.',
            text: "Juno pours the finished ink into small vials. 'So what goes in the overview?' 'Four things,' says Brigg. 'How many stages. Whether the process is [[linear|going in a line from a start to an end|เป็นเส้นตรง]] or [[cyclical|going round in a circle and starting again|เป็นวัฏจักร]]. What it starts with. What it ends with.' Juno writes: 'Overall, the linear process has seven stages, beginning with fresh heather and ending with bottles of ink.' No figures, no reasons. Just the shape. Brigg likes it. 'For a formal touch, use [[commence|begin; start (formal)|เริ่มต้น|C1]]: the process commences with heather.' Brigg gives everyone a vial. 'Keep it,' he says. 'Real ink matters.'",
            rare: { w: 'commence', g: 'begin; start (formal)', t: 'เริ่มต้น', pos: 'verb', ex: 'The process commences with the collection of raw clay.' },
            prompt: "The end of the ink-making bench in the Brewing Cellars. Juno Marlowe carefully pours finished black ink into a small glass vial at the end of a row of seven jars. On the stone wall behind her glow two simple light diagrams with no words: a straight arrow of seven steps and a circular wheel of arrows. Professor Brigg hands out small vials. Warm, satisfied mood."
          },
          {
            img: 'story/y2-ch6-04.webp',
            alt: 'In the castle entrance hall, two stern governors in dark coats lead Mr Fenwick away; he hands his iron keys to Professor Penhallow and looks back at the heroine; Professor Quist poses beside them.',
            text: "That afternoon the governors arrive and pin a notice in the hall: 'As Mr Fenwick's keys opened the Archive in 1976, he is suspended. Furthermore, Dr Hale is suspended as headmaster.' Juno reads it twice. 'Keys aren't evidence. Where's the proof?' The claim is [[unfounded|not based on facts|ไม่มีมูลความจริง|C1]]. Mr Fenwick gives his keys to Penhallow. As he passes you, he whispers, 'Look at the old maps.' Quist strikes a pose. 'Fear not! I shall solve the mystery myself!'",
            rare: { w: 'unfounded', g: 'not based on facts', t: 'ไม่มีมูลความจริง', pos: 'adjective', ex: 'A claim that "people love parks" is unfounded if the chart shows only visitor numbers.' },
            prompt: "The castle entrance hall in grey afternoon light. Two stern governors in long dark coats lead Mr Fenwick, an older man in a long dark coat, towards the great doors. He places a ring of iron keys in Professor Penhallow's hand and glances back at the heroine. On a notice board behind them hangs a blank notice. Professor Quist poses heroically to one side, chin raised. Cold, unjust, sad mood."
          },
          {
            img: 'story/y2-ch6-05.webp',
            alt: 'In the Map Room, two large maps of the Observatory grounds lie side by side on a round table, one old and yellow, one new; Dr Strand points with her brass ruler while the heroine leans in.',
            text: "Dr Strand takes the class to the Map Room. Two maps of the Observatory grounds lie on the round table: one from 1976 and one from today. 'SPACE mode,' she says. 'Never left and right. The reader cannot see which way you are holding the map. Use compass points: in the north, to the east of the lake.' You find the Tide Clock. On the old map, a staircase lies [[adjacent|next to; beside|อยู่ติดกัน|C1]] to it, to the north. On the new map, the staircase is gone.",
            rare: { w: 'adjacent', g: 'next to; beside', t: 'อยู่ติดกัน', pos: 'adjective', ex: 'A car park was built on the land adjacent to the station.' },
            prompt: "The Map Room: a round stone room with a big round table. Two large maps of the Observatory grounds lie side by side on it, one old and yellowed, one fresh, with drawn paths, trees and buildings but no readable words; a small compass rose marks each corner. Dr Halima Strand points at a spot with the brass ruler from her belt, and the heroine leans in closely. Bright lamplight, a mood of discovery."
          },
          {
            img: 'story/y2-ch6-06.webp',
            alt: 'Dr Strand lays a sheet of glass over the old map so that the changes glow; the heroine traces a glowing line, and Mina Sato raises her hand.',
            text: "Dr Strand lays the new map over the old, and every change glows. The boathouse was [[demolished|knocked down|ถูกรื้อถอน]]. The library was [[extended|made bigger or longer|ถูกขยาย]] to the west. The stable was [[converted|changed to a new use|ถูกดัดแปลง]] into the Map Room. Mina raises her hand. 'And the chapel?' 'It remained [[unchanged|the same as before|ไม่เปลี่ยนแปลง]],' says Strand. 'Say so in the overview. For a plan, use the future: will be built.' You stare. After 1976 the north staircase was [[repurposed|given a new use|นำไปใช้ในจุดประสงค์ใหม่|C1]]. It became the back of the Tide Clock case.",
            rare: { w: 'repurposed', g: 'given a new use', t: 'นำไปใช้ในจุดประสงค์ใหม่', pos: 'verb (past participle)', ex: 'The old factory was repurposed as a museum in 2005.' },
            prompt: "The round table in the Map Room. Dr Halima Strand lays a large clear sheet of glass over the old map, and several shapes glow softly where buildings changed. The heroine traces one glowing line near a small clock symbol with her finger, eyes wide. Mina Sato, with her high black ponytail and navy-and-silver scarf, raises her hand across the table. Warm lamplight with glowing highlights, a sudden realisation."
          },
          {
            only: 'returning',
            img: 'story/y2-ch6-07.webp',
            alt: 'The heroine and Celeste stand at the Map Room wall where last year\'s brass keys still hang on hooks; they hold the two Observatory maps up side by side.',
            text: "Last year this room held the living map and its brass keys. The keys still hang on the wall, and Celeste touches one. 'We opened rooms of argument with these,' she says. Now you [[juxtapose|place side by side to compare|นำมาวางเทียบกัน|C1]] two maps instead. Same room, a new job. 'Last year a map was a story,' says Celeste. 'This year it's evidence.' You hold the two maps up to the lamp. The old staircase and the clock case fit together perfectly, like a key in a lock.",
            rare: { w: 'juxtapose', g: 'place side by side to compare', t: 'นำมาวางเทียบกัน', pos: 'verb', ex: 'Juxtapose the two maps and list what was added, removed and kept.' },
            prompt: "A wall of the Map Room where a row of old brass keys hangs on iron hooks. Celeste Ashby touches one brass key with her free hand while she and the heroine hold two large maps up to a lamp side by side, so the light shines through both. Soft golden lamplight, a nostalgic yet determined mood."
          }
        ],
        missions: [
          { kind: 'sub', id: 'm08s1' }, { kind: 'sub', id: 'm08s2' }, { kind: 'sub', id: 'm08s3' },
          { kind: 'check', id: 'm08l1' },
          { kind: 'sub', id: 'm09s1' }, { kind: 'sub', id: 'm09s2' }, { kind: 'sub', id: 'm09s3' },
          { kind: 'check', id: 'm09l1' },
          { kind: 'view', view: 'lab', mode: 'SEQUENCE', label: 'Spellbook Workshop: design your SEQUENCE page', note: 'In Design, write your SEQUENCE page in your own words: an overview frame for the number of stages, the start and the end, and passive frames for the stages.' },
          { kind: 'view', view: 'lab', mode: 'SPACE', label: 'Spellbook Workshop: design your SPACE page', note: 'In Design, write your SPACE page in your own words: compass points, change verbs in the passive, and an overview frame for what changed and what stayed the same.' }
        ],
        gate: {
          checks: ['m08l1', 'm09l1'], checkIds: ['m08ck', 'm09ck'],
          extra: [
            { id: 'lab-design', mode: 'SEQUENCE', label: 'A saved SEQUENCE page', note: 'One SEQUENCE page designed and saved in the Spellbook Workshop.' },
            { id: 'lab-design', mode: 'SPACE', label: 'A saved SPACE page', note: 'One SPACE page designed and saved in the Spellbook Workshop.' }
          ],
          intro: "Brigg and Dr Strand stand in the doorway between the cellars and the Map Room. 'Two gates and two pages. Stages in order with the passive, and maps with compass points and change verbs. Both pages in your own words.'",
          pass: "Brigg closes your hand round the vial of moor ink. 'Every stage in order, and every change on the map in the right place. Keep this ink close. You may need it soon.'"
        },
        ending: {
          img: 'story/y2-ch6-end.webp',
          alt: 'Late at night in the Long Library, Juno stands frozen and frosted grey beside a reading desk, a torn scrap of paper clutched in her hand; Celeste and the heroine find her by lantern light.',
          text: "That evening Juno grabs her bag. 'Labels first!' she cries. 'I think I understand the whisper. I need the library.' She runs. An hour later she has not come back. You and Celeste find her between the shelves of the Long Library. Juno is grey with frost, as still as stone. Her eyes are open. In her hand she holds a torn scrap of paper. The castle feels [[desolate|empty, sad and lonely|อ้างว้าง|C1]] without her voice. What did she find?",
          rare: { w: 'desolate', g: 'empty, sad and lonely', t: 'อ้างว้าง', pos: 'adjective', ex: 'By 2020 the old harbour area on the map was desolate, with every warehouse demolished.' },
          prompt: "The Long Library late at night, tall shelves of books disappearing into darkness, one reading desk with an open book. Juno Marlowe stands frozen beside it, coated in grey frost, eyes open, one hand clutching a small torn scrap of paper. The heroine and Celeste Ashby arrive holding a lantern, horrified. Cold grey-blue frost light against the warm lantern, a heartbreaking cliff-hanger mood."
        },
        newsroom: 'Mr Fenwick is sent away by the governors and Dr Hale is suspended; Quist says he will solve everything. The old map shows a staircase beside the Tide Clock that is gone today. Juno is found frozen in the library.'
      },

      /* ================================================== CHAPTER 7 */
      {
        id: 'ch7', n: 7, title: 'The Library and the Newsroom', place: 'Long Library, the Locked Stacks and the Lantern office',
        blurb: "Juno's last clue, two visuals in one report, seven error families, a famous book that was copied, and a door behind a clock.",
        keepsake: { id: 'press', name: 'Press badge', desc: "A Lantern press badge, lent by Felix's empty desk, for the story that showed whose words were whose." },
        opens: [],
        pages: [
          {
            img: 'story/y2-ch7-01.webp',
            alt: 'In the Long Library the heroine and Celeste smooth out a torn scrap of paper beside an old open book showing a drawing of a great curved mirror on a clockwork arm.',
            text: "You open Juno's hand gently. The scrap says: 'LABELS FIRST · MIRROR'. Next to her lies an old library book, open at 1976. 'The Reflector,' you read. 'A brass mirror on a clockwork arm, built to copy charts. Sealed away after an accident.' Celeste gasps. 'A mirror copies everything back to front. Rises become falls. East becomes west.' Now the [[discrepancy|a difference between things that should be the same|ความไม่ตรงกัน|C1]] in every Whisper report makes sense. And the whisper in the pipes: 'Fell, fell, west, west.' It is the Reflector, reading.",
            rare: { w: 'discrepancy', g: 'a difference between things that should be the same', t: 'ความไม่ตรงกัน', pos: 'noun', ex: 'Check for any discrepancy between your figures and the chart.' },
            prompt: "A quiet corner of the Long Library by lantern light. The heroine and Celeste Ashby kneel by a reading desk, smoothing out a small torn scrap of paper with two short lines of unreadable letters. Beside it, an old book lies open at a detailed ink drawing of a great curved brass mirror on a jointed clockwork arm. Warm lantern glow against deep shadow, a tense moment of discovery."
          },
          {
            img: 'story/y2-ch7-02.webp',
            alt: 'Professor Liang in a plum robe opens two books side by side, one showing a pie chart and one a line graph, both glowing softly; the heroine and Celeste take notes.',
            text: "Lessons continue, because Penhallow insists. In the Long Library, Professor Liang opens two books side by side: a pie chart and a line graph. 'Two visuals, one report,' he says. 'One introduction names both. One overview gives a [[headline|the main point, said in a few words|ประเด็นหลัก]] for each. Then one paragraph for each visual.' He taps the pages. 'And never [[combine|put together into one|รวมกัน]] their figures. The pie counts people and the graph counts money. They are [[disparate|completely different; not able to be compared directly|แตกต่างกันโดยสิ้นเชิง|C1]] measures.'",
            rare: { w: 'disparate', g: 'completely different; not able to be compared directly', t: 'แตกต่างกันโดยสิ้นเชิง', pos: 'adjective', ex: 'The two charts use disparate units, tonnes and dollars, so never add them together.' },
            prompt: "A long table in the Long Library. Professor Wen Liang, in a plum robe, holds two open books side by side; from one rises a softly glowing pie chart, from the other a glowing line graph, both without numbers. The heroine and Celeste Ashby, her violet-purple-and-gold scarf bright in the lamplight, take notes across the table. Calm, scholarly light, a sombre undertone."
          },
          {
            img: 'story/y2-ch7-03.webp',
            alt: 'Professor Weaver reads from a lectern while students, including the heroine, hold up small white cards; one empty chair has a teal-and-copper scarf draped over it.',
            text: "Professor Weaver runs the error auction. She reads a sentence, and you name the family. 'The number of tourist were rise in 2010.' You hold up three cards: plural, [[agreement|a verb matching its subject|ความสอดคล้องของประธานกับกริยา]] and tense. 'The number of tourists rose in 2010.' Seven families: articles, plurals, agreement, tense, prepositions, punctuation and word form. 'Name the family,' says Weaver, 'and the fix stays fixed.' An [[erroneous|wrong; containing a mistake|ผิดพลาด|C1]] sentence costs [[accuracy|being correct, without errors|ความถูกต้อง]]. Juno's chair stays empty, her scarf on its back.",
            rare: { w: 'erroneous', g: 'wrong; containing a mistake', t: 'ผิดพลาด', pos: 'adjective', ex: 'An erroneous preposition, "rose to 10" for "rose by 10", changes the figure.' },
            prompt: "A classroom with rows of desks. Professor Ada Weaver, crimson robe and long white braid, reads from a wooden lectern. The heroine and a few background students hold up small blank white cards. In the front row, one empty chair has a teal-and-copper scarf draped over its back. Soft daylight, focused but melancholy mood."
          },
          {
            img: 'story/y2-ch7-04.webp',
            alt: 'Professor Brigg holds up a small labelled bottle in one hand and a crumpled page torn from a book in the other, with a frown; the heroine and Celeste watch from a bench.',
            text: "Brigg holds up a bottle from the cellar shelf. Its label says 'this figure'. Others say '[[the former|the first of two things just named|อย่างแรก]]', '[[the latter|the second of two things just named|อย่างหลัง]]' and 'over the same period'. 'Point back instead of repeating,' he says. 'Car sales rose to 50,000. This figure was twice the 2010 level.' Then he shakes out a Quick Charts page: Firstly. Moreover. Furthermore. 'A connector on every sentence is [[redundant|not needed because it adds nothing|ซ้ำซ้อนไม่จำเป็น|C1]],' he says. 'Link with meaning instead.'",
            rare: { w: 'redundant', g: 'not needed because it adds nothing', t: 'ซ้ำซ้อนไม่จำเป็น', pos: 'adjective', ex: '"Firstly" before every paragraph is redundant; link with "this figure" instead.' },
            prompt: "The Brewing Cellars' shelves of small glass bottles. Professor Tomás Brigg, bearded, teal robe, holds up one small bottle with a blank paper label in one hand and a crumpled book page in the other, frowning at the page. The heroine and Celeste Ashby watch from a wooden bench. Warm firelight, a wry, teaching mood."
          },
          {
            img: 'story/y2-ch7-05.webp',
            alt: 'Behind an iron gate in the Locked Stacks, the heroine and Celeste compare an old handwritten ledger with a shiny book bearing Quist\'s portrait; the pages match line for line.',
            text: "Penhallow lends you Mr Fenwick's keys, and you open the Locked Stacks. On a high shelf sit Dr Strand's old ledgers from twenty years ago. Celeste opens one beside Quist's Quick Charts. The sentences are the same, line by line. Even Strand's small spelling slip is there, copied. 'His whole book is [[plagiarised|copied from someone else\'s work and called your own|ลอกเลียนผลงาน|C1]],' Celeste breathes. 'He never wrote a single report.' Downstairs, Quist is telling first-years how he invented the overview.",
            rare: { w: 'plagiarised', g: "copied from someone else's work and called your own", t: 'ลอกเลียนผลงาน', pos: 'adjective', ex: 'A plagiarised model answer does not show your own English and earns no credit.' },
            prompt: "The Locked Stacks behind a tall iron gate in the Long Library, dusty shelves of old ledgers. The heroine holds a lantern while Celeste Ashby lays an old handwritten leather ledger open beside a glossy book with a smiling bearded man's portrait on its cover; both pages show matching lines of unreadable text. Golden dust in the lantern light, a gasp of discovery."
          },
          {
            img: 'story/y2-ch7-06.webp',
            alt: 'In the Lantern office among printing presses, the heroine and Celeste hold up a freshly printed front page; Felix\'s empty desk with his spare press badge is in the foreground.',
            text: "With Felix frozen, you and Celeste write The Lantern yourselves:\n\n'QUICK CHARTS, SLOW TRUTH. Professor Quist's famous book was copied from Dr Strand's ledgers. The two texts match line by line; consequently, the book cannot be the professor's own work. Furthermore, a 1976 library record describes a copying mirror, the Reflector, which reads charts back to front. The errors in The Whisper [[corroborate|support or confirm with evidence|ยืนยันด้วยหลักฐาน|C1]] this record: every rise is printed as a fall. Readers are advised to check every figure against its chart.'",
            rare: { w: 'corroborate', g: 'support or confirm with evidence', t: 'ยืนยันด้วยหลักฐาน', pos: 'verb', ex: 'The figures in the table corroborate the trend shown in the line graph.' },
            prompt: "The Lantern office: a cluttered room inside a tower of old printing presses, sheets drying on lines overhead. The heroine and Celeste Ashby hold up a freshly printed front page with an unreadable headline and a photo block, ink on their fingers. In the foreground stands Felix Okafor's empty desk with a spare press badge on a cord lying on it. Warm gaslight and paper dust, a proud but bittersweet mood."
          },
          {
            only: 'returning',
            img: 'story/y2-ch7-07.webp',
            alt: 'Celeste and the heroine sit at the Lantern editor\'s desk; a framed photo of an older student with rectangular glasses hangs on the wall, and a brass camera case sits empty.',
            text: "Celeste looks round the Lantern office. Last year Priya ran this paper. This year it is Felix's. Tonight, it is yours. 'We're only the [[interim|for a short time, until something else happens|ชั่วคราว|C1]] editors,' she says, 'until Felix wakes up.' A year ago she wrote memorised essays and laughed at your mistakes. Now she checks your facts and you check hers. 'Remember the Quill last year?' she asks. 'It fed on copies. Quist has been feeding the whole castle copies for months.'",
            rare: { w: 'interim', g: 'for a short time, until something else happens', t: 'ชั่วคราว', pos: 'adjective', ex: 'The interim figures for 2025 are expected to change when the full data arrive.' },
            prompt: "The editor's desk in the Lantern office at night. Celeste Ashby and the heroine sit together over proofs. On the wall hangs a framed photograph of an older student with thin rectangular glasses, and on the desk sits an empty brass camera case. Soft lamplight, a warm, reflective mood."
          }
        ],
        missions: [
          { kind: 'sub', id: 'm10s1' }, { kind: 'sub', id: 'm10s2' }, { kind: 'sub', id: 'm10s3' },
          { kind: 'check', id: 'm10l1' },
          { kind: 'sub', id: 'm11s1' }, { kind: 'sub', id: 'm11s2' }, { kind: 'sub', id: 'm11s3' },
          { kind: 'check', id: 'm11l1' },
          { kind: 'sub', id: 'm12s1' }, { kind: 'sub', id: 'm12s2' }, { kind: 'sub', id: 'm12s3' },
          { kind: 'check', id: 'm12l1' },
          { kind: 'view', view: 'faults', label: 'Mending Room: fewer than five faults due', note: 'Mend your faults until fewer than five are waiting.' }
        ],
        gate: {
          checks: ['m10l1', 'm11l1', 'm12l1'], checkIds: ['m10ck', 'm11ck', 'm12ck'],
          extra: [{ id: 'faults-under-5', label: 'Fewer than five faults due', note: 'The Mending Room has fewer than five faults waiting.' }],
          intro: "Liang, Weaver and Brigg stand together. 'Three gates and a tidy Mending Room. Two visuals in one report, the seven error families named on sight, and links that point back.'",
          pass: "Celeste pins Felix's spare press badge on your robe. 'Checked figures, a named source, no fog. He'd want you to wear it until he can.'"
        },
        ending: {
          img: 'story/y2-ch7-end.webp',
          alt: 'On the Observatory stairs at night, the tall glass Tide Clock case swings open to reveal a dark stairway going steeply down; the heroine and Celeste hold Professor Quist, who clutches a suitcase, by the sleeves; grey writing glistens on the wall.',
          text: "That night new grey writing shines above the Tide Clock: 'THE FIRST-YEAR IS BELOW. HER WORDS BELONG TO THE MIRROR NOW.' Ploy is missing. The teachers turn to Quist. 'You said you would solve it, Bartholomew.' You find him packing his portraits. 'A small holiday,' he squeaks. You and Celeste march him to the clock. You read the labels first: the brass hands are back to front. You turn them the right way. The glass case swings open, and stairs drop [[precipitously|very steeply and suddenly|อย่างดิ่งชัน|C1]] into the dark.",
          rare: { w: 'precipitously', g: 'very steeply and suddenly', t: 'อย่างดิ่งชัน', pos: 'adverb', ex: 'Sales fell precipitously in 2009, from 80,000 to 20,000.' },
          prompt: "The Observatory stairs at night. The tall glass Tide Clock case has swung open like a door, revealing narrow stone steps dropping steeply into darkness, with a faint grey frost glow rising from below. The heroine and Celeste Ashby each hold Professor Quist by a sleeve; he clutches a bulging suitcase with picture frames poking out, terrified. Glistening grey streaks cover the wall above the clock with no readable letters. Cold blue-grey light, a thrilling cliff-hanger mood."
        },
        newsroom: "The Lantern shows Quist's book was copied from Dr Strand's ledgers and names the Reflector. Ploy disappears; grey writing says she is below, and the Tide Clock opens."
      },

      /* ================================================== CHAPTER 8 */
      {
        id: 'ch8', n: 8, title: 'The Almanac Examination', place: 'The Sealed Archive, then the Examination Hall',
        blurb: 'Down into the Archive, a mirror that copies everything, your own words against it. Then one chart, twenty minutes, four gates.',
        keepsake: { id: 'seal', name: 'The Almanac seal', desc: 'The seal of the Observatory, for a report at the Band 7.5 standard.' },
        opens: [],
        pages: [
          {
            img: 'story/y2-ch8-01.webp',
            alt: 'In a frosty stone tunnel lit by a lantern, Professor Quist stands reciting from his book with his arms spread wide while grey frost swirls round his head; Celeste holds him by the arm and the heroine goes on alone down the steps.',
            text: "The stairs end in a cold stone tunnel. Quist pulls out his book. 'Stand back! My Perfect Report will save us!' He recites it loudly into the dark. From deep below, a grey frost rolls up the tunnel and wraps round his head. His words come back to him in a whisper, back to front. Then they [[evaporate|disappear slowly into nothing|ระเหยหายไป|C1]]. Quist blinks. 'My Perfect Report! I can't remember a single line!' Celeste holds his arm. 'Go,' she tells you. 'I'll keep him here. Be quick.'",
            rare: { w: 'evaporate', g: 'disappear slowly into nothing', t: 'ระเหยหายไป', pos: 'verb', ex: 'Support for the plan evaporated after 2015, falling to almost zero.' },
            prompt: "A narrow frosty stone tunnel below the Observatory, lit by one lantern on the floor. Professor Quist stands with his book held high and arms spread wide, mouth open mid-recital, while swirls of grey frost wrap round his head and his face goes blank and dreamy. Celeste Ashby grips his arm firmly. In the background the heroine walks on alone down more stone steps into the dark. Cold grey-blue light, a mix of comedy and dread."
          },
          {
            img: 'story/y2-ch8-02.webp',
            alt: 'A vast round underground chamber with a huge curved brass mirror on a clockwork arm in the centre, breathing grey frost; a small girl with pigtails lies cold on the floor beside a brown almanac, and the heroine runs towards her.',
            text: "The Sealed Archive is a vast round chamber. In the middle hangs the Reflector: a great curved brass mirror on a clockwork arm. Grey frost breathes from its surface. Shelves of blank, grey reports line the walls. On the floor lies Ploy, cold and still, beside her brown almanac. You run to her. Above you, the clockwork arm begins to turn. Gears grind. The mirror begins to [[pivot|turn on a fixed point|หมุนรอบแกน|C1]] towards you, slowly, like a great bright eye.",
            rare: { w: 'pivot', g: 'turn on a fixed point', t: 'หมุนรอบแกน', pos: 'verb', ex: 'At stage four, the drum pivots and the grain is tipped into a hopper.' },
            prompt: "The Sealed Archive: a vast round underground stone chamber with walls of shelves holding grey blank papers. In the centre hangs the Reflector, a huge curved brass mirror on a great jointed clockwork arm with visible gears, breathing grey frost. On the frosty floor below lies Ploy Saengkaew, small and still, beside a brown leather almanac. The heroine runs towards her from the entrance. Cold silver light from the mirror, deep shadows, a tense, awe-filled mood."
          },
          {
            img: 'story/y2-ch8-03.webp',
            alt: 'Grey handwriting rises from an open brown almanac and forms the misty shape of a tall young man in an old-fashioned robe, smiling coldly; the heroine kneels by the small girl and glares up at him.',
            text: "Grey handwriting rises from the almanac and forms a shape: a tall young man in an old robe. 'Orrin Vane,' he smiles. 'I wrote this almanac in 1976. My words still live in its pages, and they feed my mirror.' He points at Ploy. 'She wanted perfect reports. So she copied my sentences every night. She even took me back from your trunk. Every copy made the Frost stronger.' His voice grows [[insidious|harmful in a slow, hidden way|ร้ายกาจอย่างแนบเนียน|C1]] and sweet. 'Why write your own words? Copy mine. Never be wrong again.'",
            rare: { w: 'insidious', g: 'harmful in a slow, hidden way', t: 'ร้ายกาจอย่างแนบเนียน', pos: 'adjective', ex: 'Copying is an insidious habit: each copied line makes the next one easier.' },
            prompt: "Inside the Sealed Archive near the great brass mirror. Grey handwriting with no readable letters rises in ribbons from an open brown almanac on the floor and forms the misty, semi-transparent shape of a tall teenage boy in an old-fashioned black robe with a cold smile. The heroine kneels protectively beside the still body of Ploy Saengkaew and glares up at him. Cold grey glow, a menacing mood."
          },
          {
            img: 'story/y2-ch8-04.webp',
            alt: 'In the dark chamber, a grey-brown owl swoops down through the frost with a long brass ruler in her talons; the heroine reaches up to catch it as the brass mirror turns towards her.',
            text: "The mirror's frost reaches your feet. Your fingers go numb. Then you hear wings. Nutmeg swoops down through the dark. She brings Dr Strand's brass ruler, the one true scale, from the Sorting Lantern, where Dr Strand left it for safe keeping. She drops it into your hands. Its marks are clear and even. You remember Dr Strand's words: 'We are meticulous here.' The Frost cannot blank what is measured. You hold up the ruler, and the frost round you starts to [[recede|move back; become smaller|ถอยกลับ|C1]], one step at a time.",
            rare: { w: 'recede', g: 'move back; become smaller or weaker', t: 'ถอยกลับ', pos: 'verb', ex: 'Floodwater receded steadily after the peak in March.' },
            prompt: "The dark Sealed Archive with grey frost swirling over the floor. Nutmeg, a grey-brown owl, swoops down from high above with a long brass ruler in her talons, lit by a warm beam of light. The heroine reaches up to catch it, while behind her the huge brass mirror on its clockwork arm turns towards her. A single warm golden beam cutting through cold grey, a hopeful turning-point mood."
          },
          {
            img: 'story/y2-ch8-05.webp',
            alt: 'The heroine holds her own open spellbook up to face the great brass mirror; the mirror shows only a blank, clouded surface and cracks of light run across it, while the misty young man fades.',
            text: "You open your own spellbook to your TREND page. Every frame is in your words, with the real figures from the Tide Clock written in the gaps. You turn the page to face the Reflector. The mirror tries to copy it. It cannot. Your words are not copied, so there is nothing to reflect. Its glass clouds over, and its clockwork arm shudders. 'No!' cries Orrin. His shape grows thin. Your page is [[inimitable|impossible to copy|ไม่มีใครลอกเลียนได้|C1]], and the mirror has no answer.",
            rare: { w: 'inimitable', g: 'impossible to copy', t: 'ไม่มีใครลอกเลียนได้', pos: 'adjective', ex: 'A report built from your own frames and the real figures is inimitable: no model answer can copy it.' },
            prompt: "The climax in the Sealed Archive. The heroine stands firm, holding her open brown spellbook up with both hands so its page faces the huge curved brass mirror; the page has neat lines with gaps but no readable words, and Dr Strand's brass ruler is tucked into her satchel strap. The mirror's surface has clouded over, with bright cracks of light spreading across it, and its clockwork arm shudders. The misty young man in the old robe stretches thin and fades. Brilliant light against cold grey, a triumphant mood."
          },
          {
            img: 'story/y2-ch8-06.webp',
            alt: 'The heroine kneels and writes in the brown almanac with a quill dipped in a small vial of black ink; grey handwriting drains off the pages like water, and the small girl beside her opens her eyes.',
            text: "One thing is left: the almanac. You uncork Brigg's vial of moor ink. On the first page you write a short, true report: the real Tide Clock figures, an overview with no numbers, two groups. The grey handwriting begins to drain away, like water out of a sink. The pages turn white, then empty, then still. The Frost lifts from the chamber. Ploy opens her eyes and starts to cry. 'I only wanted to be perfect,' she sobs. You hug her. 'Nobody's words are [[impeccable|perfect, with no mistakes at all|ไร้ที่ติ|C1]] at first. Your own words are enough. Mistakes are how you learn.'",
            rare: { w: 'impeccable', g: 'perfect, with no mistakes at all', t: 'ไร้ที่ติ', pos: 'adjective', ex: 'Impeccable grammar is rare even at Band 8; aim for most sentences to be error-free.' },
            prompt: "The Sealed Archive, its frost melting into mist. The heroine kneels on the stone floor, writing in the brown leather almanac with a quill dipped into a small glass vial of black ink. Grey handwriting drains off the edges of the pages like water. Beside her, Ploy Saengkaew, small with copper-beaded pigtails, opens her eyes, tearful. The cracked brass mirror hangs still and dark above them. Warm returning light, a tender, relieved mood."
          },
          {
            img: 'story/y2-ch8-07.webp',
            alt: 'In a bright hospital wing, Juno and Felix sit up in beds and laugh with the heroine; through the window an old wooden tram leaves down the moor road carrying a man in a mustard waistcoat and a pile of portraits; an older man with iron keys stands in the doorway.',
            text: "In the hospital wing Juno and Felix sit up, warm again. 'Group them!' Juno shouts, and hugs you. Felix checks his camera. 'Where's the number? Oh, it's back!' Through the window, the morning tram rattles down the moor. Professor Quist sits in it with his forty portraits, still trying to remember a single line of his Perfect Report. The governors now [[exonerate|officially show to be not guilty|ทำให้พ้นผิด|C1]] Mr Fenwick. He stands in the doorway with Marmalade in his arms and his keys at his belt. Dr Hale is back too.",
            rare: { w: 'exonerate', g: 'officially show that someone is not guilty', t: 'ทำให้พ้นผิด', pos: 'verb', ex: 'The new data exonerated the factory: pollution came from another source.' },
            prompt: "A bright hospital wing with white beds and tall windows in morning sun. Juno Marlowe, her copper ribbon back in her hair, and Felix Okafor, his brass camera in his hands, sit up in their beds laughing as the heroine sits between them. Through the window, an old wooden tram rattles down the moor road carrying Professor Quist and a pile of framed portraits. In the doorway stands Mr Fenwick in his long dark coat with iron keys at his belt, holding Marmalade, a grey-brown tabby cat. Warm golden light, joyful mood."
          },
          {
            img: 'story/y2-ch8-08.webp',
            alt: 'In the Examination Hall, Professor Penhallow stands before four professors in navy, teal, plum and crimson at a long table; the heroine, Juno, Felix and Celeste listen from the front row.',
            text: "With the Archive closed, the Almanac Examination goes ahead. 'Here at Quillmoor, four examiners,' says Penhallow, pointing at the four Heads. 'In the real test, one examiner marks your report on four criteria: Task Achievement, Coherence and Cohesion, Lexical Resource, and Grammatical Range and Accuracy. Each counts [[equally|in the same amount|เท่าๆ กัน]]. The Almanac seal needs Band 7.5: two eights and two sevens, for example. Then your Task 2 essay counts twice as much, so never steal its time.' The [[criteria|standards used to judge something|เกณฑ์ (พหูพจน์)]] are [[transparent|clear and easy to understand; nothing hidden|โปร่งใส|C1]]. Everyone can read them.",
            rare: { w: 'transparent', g: 'clear and easy to understand; nothing hidden', t: 'โปร่งใส', pos: 'adjective', ex: 'The marking criteria are transparent: anyone can read the public band descriptors.' },
            prompt: "The Examination Hall, bright and formal, with tall windows. Professor Penhallow, silver bob, charcoal robe, brass spectacles on a chain, stands before a long table where four professors sit: Professor Rhea North in navy, Professor Tomás Brigg in teal, Professor Wen Liang in plum and Professor Ada Weaver in crimson. In the front row, the heroine, Juno Marlowe, Felix Okafor and Celeste Ashby listen closely. Clear, calm daylight, a serious but hopeful mood."
          },
          {
            only: 'new',
            img: 'story/y2-ch8-09.webp',
            alt: 'Ten small lanterns hang in a row above a great wooden door; Professor Penhallow points up at them while the heroine stands beneath, reading them in order.',
            text: "Above the hall door hang ten small lanterns: the Ten Wards. Penhallow reads them in order. 'Four paragraphs, with Overall in the second. No figures in the overview. A number in every detail sentence. Two comparisons. Tense that fits the dates. Number and amount, plurals, articles. To, by, from, at. No opinion, reason or conclusion. No copied task sentence, and every category named. Then 150 to 190 words.' Check them in the same [[invariable|never changing|ไม่เปลี่ยนแปลง (ตายตัว)|C1]] order, every time.",
            rare: { w: 'invariable', g: 'never changing', t: 'ไม่เปลี่ยนแปลง (ตายตัว)', pos: 'adjective', ex: 'Follow an invariable checking order so that nothing is missed.' },
            prompt: "A great carved wooden door at the end of the Examination Hall, with ten small glowing lanterns hanging in a neat row above it, no writing on them. Professor Penhallow points up at the lanterns one by one, and the heroine stands beneath, looking up and counting on her fingers. Warm lantern glow against stone, a ritual, focused mood."
          },
          {
            only: 'returning',
            img: 'story/y2-ch8-10.webp',
            alt: 'Ten small lanterns hang above the Examination Hall door; the heroine, wearing her second-year pin, stands beneath them with Celeste, comparing them with a faded list in an old spellbook.',
            text: "Above the hall door hang ten small lanterns. They look like last year's Ten Wards, but every rule is new. 'Four paragraphs, with Overall in the second. No figures in the overview. A number in every detail sentence. Two comparisons. Tense that fits the dates. Number and amount, plurals, articles. To, by, from, at. No opinion, reason or conclusion. No copied task sentence, and every category named. Then 150 to 190 words.' Celeste smiles. 'Same habit as last year. Same order, every time, [[scrupulously|very carefully and honestly|อย่างละเอียดรอบคอบ|C1]].'",
            rare: { w: 'scrupulously', g: 'very carefully and honestly', t: 'อย่างละเอียดรอบคอบ', pos: 'adverb', ex: 'Check every figure scrupulously against the chart before you send the report.' },
            prompt: "The great wooden door of the Examination Hall with ten small glowing lanterns in a row above it, no writing on them. The heroine, a brass second-year pin on her robe, stands beneath them with Celeste Ashby, who holds an old worn spellbook open at a faded page; both look up and compare. Warm, nostalgic glow."
          },
          {
            img: 'story/y2-ch8-11.webp',
            alt: 'The Sealed Archive, now bright and warm, has become a gallery of framed model reports; Dr Strand hangs a frame while the heroine and Ploy study one closely; the cracked brass mirror is covered with a cloth.',
            text: "Dr Strand turns the Sealed Archive into the Exemplar Archive. Now model reports hang in frames where the grey copies stood. 'Read them for the shape,' she says. 'Not to copy. Look at what they leave out.' A strong report does not give every figure. It chooses three or four [[key features|the most important facts about the whole chart|ประเด็นสำคัญ]]: the direction, the highest and lowest, the biggest gap, the [[crossover|the point where one line passes another|จุดที่เส้นตัดกัน]], the exception. Ploy studies one. 'So it's [[selective|choosing carefully what to include|คัดสรรอย่างรอบคอบ|C1]] on purpose.' 'Exactly,' says Strand. 'Don't list. [[Illustrate|show something clearly with an example or a figure|แสดงให้เห็นด้วยตัวอย่าง]].'",
            rare: { w: 'selective', g: 'choosing carefully what to include', t: 'คัดสรรอย่างรอบคอบ', pos: 'adjective', ex: 'Be selective: three to five figures per group are enough.' },
            prompt: "The former Sealed Archive, now warm and bright, its round walls hung with neat framed pages with no readable writing. Dr Halima Strand hangs a new frame on the wall. The heroine and Ploy Saengkaew, who now looks healthy and curious, study one frame closely. In the centre, the cracked brass mirror on its clockwork arm is draped in a large cloth. Golden light, a peaceful, studious mood."
          },
          {
            img: 'story/y2-ch8-12.webp',
            alt: 'The heroine, seen from behind, writes at a desk in a quiet examination hall; Juno writes at the next desk, a large clock with no numerals hangs on the wall and a grey-brown owl waits on the window sill.',
            text: "Twenty minutes, and the same [[protocol|the fixed steps you follow every time|ขั้นตอนปฏิบัติ]] as always. In the first four minutes you name the mode, then [[plan|decide what you will write before you write it|วางแผน]]: the big picture, two groups, three to five figures each. Thirteen minutes to write: introduction, overview, Detail A, Detail B. At minute seventeen you stop and check the Ten Wards. No conclusion. About 170 words. You stay [[steadfast|firm and not changing|มั่นคง|C1]]: no panic and no copying. Nutmeg waits on the window sill to carry the reports to the examiners.",
            rare: { w: 'steadfast', g: 'firm and not changing', t: 'มั่นคง', pos: 'adjective', ex: 'Stay steadfast in your plan: four paragraphs, with the overview second, every time.' },
            prompt: "A quiet examination hall in morning light, rows of wooden desks. The heroine, seen from behind, writes steadily at her desk; Juno Marlowe writes at the next desk. A large wall clock with no numerals hangs above, and Nutmeg, the grey-brown owl, waits on the window sill. Calm, bright, confident mood."
          }
        ],
        missions: [
          { kind: 'sub', id: 'm13s1' }, { kind: 'sub', id: 'm13s2' }, { kind: 'sub', id: 'm13s3' },
          { kind: 'check', id: 'm13l1' },
          { kind: 'sub', id: 'm14s1' }, { kind: 'sub', id: 'm14s2' }, { kind: 'sub', id: 'm14s3' },
          { kind: 'check', id: 'm14l1' },
          { kind: 'view', view: 'models', label: 'Exemplar Archive: read the model reports', note: 'Read them for the shape of a Band 8 report and for what they leave out, not to copy.' },
          { kind: 'writing', label: 'Three mock examinations', note: 'Three full reports (150 words or more) in the Scriptorium at twenty minutes each, then send each one to the examiners.', min: 3, kind2: 'mock', full: true }
        ],
        gate: {
          checks: ['m13l1', 'm14l1'], checkIds: ['m13ck', 'm14ck'],
          extra: [
            { id: 'report-sent', min: 3, kind: 'mock', full: true, label: 'Three mock examinations sent to the examiners', note: 'Three twenty-minute reports of 150 words or more, each sent to the examiners.' },
            { id: 'best-band', min: 7.5, field: 'bestBand', label: 'A report marked at 7.5 or above', note: 'This is the standard of the real test, and it can take months of mock examinations after the classes end. Keep sending reports: your best band is kept, and the seal arrives by owl the day the examiners agree.' }
          ],
          intro: "Penhallow stands alone before the table. 'Two gates, three mock examinations, and then the only thing that matters: one report marked at the 7.5 standard. Everything else was practice for this.'",
          pass: "Four verdicts come back by owl. Penhallow presses the Almanac seal into warm wax. 'The big picture, two clear groups, the precise word, and control. Every number from the chart, every word your own. Verba vincunt.'"
        },
        ending: {
          img: 'story/y2-ch8-end.webp',
          alt: 'The Hall of Lanterns at night glows in four colours; the heroine stands holding a sealed letter while Juno, Felix, Celeste and Ploy cheer around her, and Mr Fenwick and Dr Strand clap at the side.',
          text: "The Hall of Lanterns glows in all four colours. Your house cheers when your name is read. Juno hugs you so hard your pin bends. Felix takes one photo, with permission. Celeste shakes your hand, then hugs you too. Ploy waves a short report in her own handwriting, with three mistakes and a [[palpable|so strong you can almost touch it|จับต้องได้|C1]] pride. Mr Fenwick jingles his keys. The real test has the same twenty minutes and the same four criteria. Now you can meet any chart: read it, group it, and report only what it shows.",
          rare: { w: 'palpable', g: 'so strong that you can almost touch it', t: 'จับต้องได้', pos: 'adjective', ex: 'The tension in the hall was palpable as the clock reached minute seventeen.' },
          prompt: "The Hall of Lanterns at night, hundreds of floating paper lanterns glowing navy, teal, plum and crimson. The heroine stands in the centre holding a letter sealed with brass wax, smiling. Around her cheer Juno Marlowe, Felix Okafor with his brass camera, Celeste Ashby and Ploy Saengkaew waving a single handwritten page. At the side, Mr Fenwick and Dr Halima Strand clap. Background students wear only navy-silver, teal-copper, violet-gold and crimson-cream scarves. Warm festive light, a joyful finale."
        },
        newsroom: "The Frost wipes Quist's memorised report from his head; you face the Reflector with your own page and drain the Blank Almanac with moor ink. Ploy, Juno and Felix wake, Quist leaves by tram, Fenwick returns, and the examination goes ahead."
      }
    ],

    /* ------------------------------------------------------------ events */
    events: {
      tournament: {
        title: 'The Midwinter Tournament',
        pages: [
          {
            img: 'story/y2-ev-tournament-01.webp',
            alt: 'A cold, bright examination hall with green garlands and a great clock with no numerals; Dr Hale reads from a scroll beside Professor Penhallow while students sit at desks, one desk empty with a brass camera on it.',
            text: "Snow covers the moor, and the Examination Hall is cold and bright. Felix's desk is empty, his frozen camera placed on it like a promise. Dr Hale reads the rules. 'Three tasks. A timed run through the Duelling Hall. One chart cast with your spellbook, one minute for each variable. And one full report in twenty minutes.' Penhallow adds one line. 'Nobody loses house points here. This is a [[benchmark|a standard used to measure progress|เกณฑ์มาตรฐานสำหรับเปรียบเทียบ|C1]]: you find out how fast your own words come under a clock.'",
            rare: { w: 'benchmark', g: 'a standard used to measure progress', t: 'เกณฑ์มาตรฐานสำหรับเปรียบเทียบ', pos: 'noun', ex: 'Use your first mock as a benchmark and compare each later report with it.' },
            prompt: "A cold, bright examination hall decorated with green garlands under a great clock with no numerals, snow visible through tall windows. Dr Osric Hale, clean-shaven with grey hair and a tweed waistcoat, reads from a scroll beside Professor Penhallow. Background students sit at desks; one empty desk in the front row holds a grey, frosted brass camera. Crisp winter light, an expectant mood."
          },
          {
            img: 'story/y2-ev-tournament-02.webp',
            alt: 'Students write on small slates beside hourglasses; the heroine, Juno and Celeste sit at the front desk, Juno checking figures with her pencil.',
            text: "The first two tasks are about speed, not beauty. Read the chart. Name the mode, the units and the years. Then fill your spellbook's gaps on a slate, one minute each. Juno finishes early and checks every figure twice. Celeste runs out of time on the last gap. 'I read the wrong axis,' she says afterwards. 'Next time I'll read the labels first.' Juno grins. 'It's [[cumulative|growing bit by bit as more is added|สะสมเพิ่มขึ้น|C1]]. Every chart makes the next one faster.'",
            rare: { w: 'cumulative', g: 'growing bit by bit as more is added', t: 'สะสมเพิ่มขึ้น', pos: 'adjective', ex: 'The graph shows cumulative sales, so the line can never fall.' },
            prompt: "Rows of desks in the winter Examination Hall, each with a small slate and a sand hourglass. At the front desk sit the heroine, Celeste Ashby and Juno Marlowe, who taps her pencil on a figure to double-check; all three write quickly on their slates with no readable marks. Bright cold light, a focused, racing mood."
          },
          {
            img: 'story/y2-ev-tournament-03.webp',
            alt: 'Dr Hale hands a small brass token on a chain to the heroine; Juno and Celeste stand beside her, and Professor Quist in the background complains that he was not asked to judge.',
            text: "Then the report. Twenty minutes, one chart, your own spellbook in your head. You write the overview second, straight after the introduction. At minute seventeen you stop writing and check. At minute twenty you put your pen down, finished or not. Hale hands a small brass token to everyone who completes all three tasks. Quist complains loudly that nobody asked him to judge. 'It is not a band,' says Hale. 'It is proof that you can do it under a clock.' It feels [[auspicious|showing signs of future success|เป็นมงคล|C1]].",
            rare: { w: 'auspicious', g: 'showing signs of future success', t: 'เป็นมงคล', pos: 'adjective', ex: 'An auspicious start: sales doubled in the first month.' },
            prompt: "The front of the winter Examination Hall. Dr Osric Hale hands a small brass token on a chain to the heroine, while Juno Marlowe and Celeste Ashby stand beside her holding their own tokens. In the background, Professor Quist waves his arms in protest, monocle swinging. Background students wear only navy-silver, teal-copper, violet-gold and crimson-cream scarves. Warm light against snowy windows, a proud, lightly comic mood."
          }
        ],
        tasks: [
          { id: 'tour-duel', label: 'A Duelling Hall run in one sitting', view: 'bootcamp', note: 'Take a new chart through all eight steps of the Duelling Hall without stopping.' },
          { id: 'tour-cast', label: 'Cast one chart at one minute per variable', view: 'lab', note: 'In the Spellbook Workshop, cast one of your pages on a chart and fill every variable in one minute each.' },
          { id: 'tour-report', label: 'A twenty-minute report', view: 'writer', note: 'A full report (150 words or more) in the Scriptorium in Exam mode, inside twenty minutes, then send it to the examiners.' }
        ]
      }
    },

    /* ------------------------------------------------------- map and end */
    mapIntro: "This is the map of Quillmoor, with the Observatory on its east side. A room opens when you earn its key, so finish each chapter and the castle grows. Keep away from the Tide Clock after dark.",
    mapIntroReturning: "Welcome back to the map of Quillmoor, one year on. This year the path climbs the Observatory: finish each chapter to open its rooms, and remember that the habits that won last year now lose marks.",
    finale: {
      img: 'story/y2-finale.webp',
      alt: 'Morning on the castle steps above the black lake: the heroine, Juno, Felix, Celeste and Ploy sit together; the Observatory tower rises behind them and Nutmeg flies overhead.',
      text: "You climbed the Observatory with a key and a torn warning. You leave with a seal, a spellbook of four pages in your own words, and reports any examiner can follow line by line. The Reflector is covered, the almanac is blank, and Quist is somewhere on the moor, trying to remember his Perfect Report. Juno still says 'Group them!' Felix still asks where the number is. Ploy writes her own reports now, mistakes and all. The real test waits: twenty minutes, at least 150 words, one task, the same you. Your words are [[irreplaceable|too special to be replaced by anything else|ไม่มีสิ่งใดแทนที่ได้|C1]]. Verba vincunt. Words win.",
      rare: { w: 'irreplaceable', g: 'too special or important to be replaced', t: 'ไม่มีสิ่งใดแทนที่ได้', pos: 'adjective', ex: 'Your own frames are irreplaceable: no memorised report can fit every chart.' },
      prompt: "Early morning on the wide stone steps of the castle above the black lake, mist lifting off the moor. The heroine, Juno Marlowe, Felix Okafor with his brass camera, Celeste Ashby and Ploy Saengkaew sit together on the steps, laughing. The tall round Observatory tower with its glass dome rises behind them in golden sunlight, and Nutmeg, the grey-brown owl, flies overhead. Fresh, golden, hopeful mood."
    }
  };
})();
