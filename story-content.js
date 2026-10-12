/* QUILLMOOR ACADEMY — THE OBSERVATORY — story-content.js
   The story layer of Chart Control (IELTS Academic Writing Task 1).
   Second term at Quillmoor: the Observatory, where chartwrights write factual
   reports on charts, tables, processes and maps. Original world, inspired by
   school-of-magic stories (IP level C: no Harry Potter names, spells, objects
   or crests in the app; canon scenes are discussed only in class, see
   docs/READING-ROOM-T1.md).
   Two cohorts: new readers (M4.1) and returning readers (the Tutoring group,
   who met Quillmoor in the Task 2 app). Pages may carry only:'new' or
   only:'returning'; pages without it are shown to both.
   Story text is B1: present tense, "you" (gender-neutral), short sentences,
   UK spelling. Keywords: [[word|short English gloss|Thai gloss]].
   New cast: Dr Halima Strand (Keeper of the Observatory) and the Observatory
   weathercock. Term mystery: who is feeding the Gossip Quill its fake figures?
   (Answer, ch7: the weathercock, reading the living charts back to front
   through the glass dome.)
   Schema: QUILLMOOR-T1-SPEC.md. Owner: Opus A. ES5 only. */
(function () {
  window.STORY = {
    version: '2026-10-12',
    term: 'The Observatory',

    /* ------------------------------------------------------------ houses */
    houses: [
      {
        id: 'compass', name: 'Compass', crit: 'TA', critName: 'Task Achievement',
        values: 'direction, the big picture', main: '#1F3A5F', accent: '#C0C7D1',
        emblem: 'compass rose', head: 'Professor Rhea North', motto: 'Know where you stand.',
        welcome: "Welcome to Compass, where we value direction. In a report, direction means the big picture: an overview that shows where the whole chart is going. An examiner looks for that before any number.",
        welcomeBack: "Welcome back to Compass. Last term direction meant a clear position. This term you give no position at all. Task Achievement means a clear overview, the key features with their figures, and no opinion.",
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
        welcomeBack: "Welcome back to Lexicon. Last term your words carried ideas. This term they carry numbers, so precision matters even more: rose sharply, rose slightly and fluctuated are three different charts.",
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
        place: 'Hall of Lanterns → the Observatory',
        blurb: 'An owl in the rain, a tram up the moor, and a tower full of living charts.',
        blurbReturning: 'Back on the tram, a new tower on the hill, and the habits that won last term now lose marks.',
        keepsake: { id: 'key', name: 'The Observatory key', desc: 'A small brass key to the tower where the living charts are kept.' },
        opens: ['plan', 'map', 'pods', 'vids', 'record', 'settings'],
        pages: [
          {
            only: 'new',
            img: 'story/ch1-01.webp',
            alt: 'A grey owl on a rainy Bangkok balcony holds a letter with a dark blue wax seal; the heroine looks up in surprise from her homework.',
            text: "It is late October in Bangkok, and the rain has not stopped for three days. You sit by the window with your homework. Then a grey owl lands on the balcony. She is wet and a little grumpy. In her beak is a letter with a dark blue seal. The letter has your name on it. You have never seen an owl in the city before. You have never had a letter like this, either."
          },
          {
            only: 'new',
            img: 'story/ch1-02.webp',
            alt: 'The heroine reads an open letter at her desk; the broken blue wax seal lies beside her and the owl waits on the balcony rail.',
            text: "The letter says:\n\n'Dear Student,\n\nYou have been chosen to join Quillmoor Academy for the second term. You will study in the Observatory, where students learn to write a short [[report|a factual text that describes what a chart shows|รายงาน]] on a chart, a table, a process or a map. A report does not argue or explain. Its task is to [[summarise|give only the main points|สรุป]] the facts and compare them.\n\nTerm begins on 29 October.\n\nProfessor Marisol Penhallow, Head of Examinations\n\nP.S. The owl is called Nutmeg. Please dry her.'"
          },
          {
            only: 'new',
            img: 'story/ch1-04.webp',
            alt: 'A great hall with rows of floating paper lanterns; a grey-robed professor speaks at the far end while a boy with a camera whispers to the heroine.',
            text: "A week later an old wooden tram carries you up a windy moor to a castle. Inside, the Hall of Lanterns is full of floating paper lanterns. A tall woman in a grey robe steps forward. 'I am Professor Penhallow,' she says. 'Here we teach one thing: how to win with words.' A boy with a camera leans towards you. 'Felix Okafor, school paper,' he whispers. 'I only ask one question. Where's the number?'"
          },
          {
            only: 'new',
            event: 'sorting',
            img: 'story/ch1-05.webp',
            alt: 'A tall brass lantern glowing in four bands of colour; the heroine stands near it with a curly-haired girl in a teal scarf and a silver-haired professor, other students waiting behind.',
            text: "A brass lantern stands at the front. It glows in four bands of colour: navy, teal, plum and crimson. 'The Sorting Lantern asks twelve questions about reports,' says Penhallow. 'It finds your strongest [[criterion|a standard used to judge something|เกณฑ์]]. Compass for the big picture. Bridge for order. Lexicon for the right word. Loom for control.' A girl with curly hair squeezes your hand. 'I'm Juno. It doesn't bite. Probably.' You walk up to the light."
          },
          {
            only: 'returning',
            img: 'story/ch1-03.webp',
            alt: 'Inside an old wooden tram with brass lamps; through the window a castle stands above a lake, and Juno in a teal scarf leans towards the heroine.',
            text: "The second term begins. You are back on the old wooden tram with the brass lamps, and Juno drops into the seat beside you. 'Did you miss the moor? I did.' Below you the black lake shines like ink. Above you the castle has something new: a tall round tower on the east side, with a glass dome on top. 'The Observatory,' says Juno. 'This term we write about charts.'"
          },
          {
            only: 'returning',
            event: 'house',
            img: 'story/ch7-end.webp',
            alt: 'The Hall of Lanterns at night, lanterns glowing in many colours; the heroine stands by a window holding a sealed letter while Juno, Celeste and Felix smile behind her.',
            text: "The Hall of Lanterns glows in all four colours. This time the Sorting Lantern asks you nothing. It simply shines in your house colours as you walk past. 'You already have a house,' says Penhallow. 'You keep it, and it keeps you.' Celeste waves from across the hall. Felix lifts his camera. If the Lantern does not know you yet, you can choose your house now, or take its twelve questions."
          },
          {
            only: 'returning',
            img: 'story/ch2-01.webp',
            alt: 'A round stone chamber with two wooden lecterns and lanterns on chains; a silver-haired professor speaks while the heroine and Juno listen from a bench.',
            text: "Penhallow meets your old class in the Debating Chamber. 'The habits that won last term now lose marks,' she says. 'In a [[report|a factual text that describes what a chart shows|รายงาน]], nobody wants your position. No opinion, no reasons, no conclusion. Twenty minutes, not forty. At least 150 words, not 250. And instead of a position, an overview of the whole chart.' Juno looks worried. 'So what do we argue?' 'Nothing. You stay [[factual|based on facts, not opinions|อิงข้อเท็จจริง]]. That is harder than it sounds.'"
          },
          {
            img: 'story/ch1-06.webp',
            alt: 'A breakfast table with bread and papers; Juno writes on a timetable, Felix reads a sheet, and the heroine studies a grey paper.',
            text: "Next morning a thin grey sheet lands on every breakfast plate: The Whisper. Today it prints a chart report. 'Visitors to the Observatory fell sharply because students hate numbers. In conclusion, charts are boring.' Felix reads it twice. 'Fell from what to what? In which years? Where's the number?' A real [[figure|a number or amount shown in a chart|ตัวเลข]] comes from the [[data|the facts and numbers in a chart|ข้อมูล]], not from your head. Juno frowns. 'That's the Gossip Quill. It faded away last term. So who is feeding it again?'"
          },
          {
            img: 'story/ch3-end.webp',
            alt: 'From a castle window at dusk, the heroine and Juno look across a courtyard towards a tall stone tower; below, Celeste takes an envelope from an owl.',
            artWish: 'The top room of the Observatory: a round tower room under a glass dome, line graphs, bar charts, pie charts and a small moor map glowing in the air; Dr Halima Strand (a practical archivist in her forties, dark hair pinned up with a pencil, rolled sleeves, ink on her fingers, a brass ruler at her belt, no glasses) looks up from a desk of ledgers as the heroine and Juno arrive.',
            text: "From the window you can see it: a tall round tower on the east side of the castle. At the top, under a glass dome, charts hang in the air and move. A woman with ink on her fingers meets you there. 'Dr Halima Strand. I keep the Observatory. We do not guess here. We measure.' She points at a moving line. 'First the [[mode|the kind of chart job: TREND, COMPARE, SEQUENCE or SPACE|รูปแบบการบรรยาย]]. Then the [[axis|a line along the side or bottom of a graph|แกน]] and the units. Then the numbers.'"
          }
        ],
        missions: [
          { kind: 'event', event: 'sorting', label: 'Stand before the Sorting Lantern', note: 'Twelve questions about reports. The Lantern finds your strongest key and your house.', only: 'new' },
          { kind: 'event', event: 'house', label: 'Take your place in your house', note: 'Your house comes with you from last term. If the Lantern does not know you yet, choose your house or take the twelve questions.', only: 'returning' },
          { kind: 'sub', id: 'm00s1' }, { kind: 'sub', id: 'm00s2' }, { kind: 'sub', id: 'm00s3' },
          { kind: 'check', id: 'm00l1' },
          { kind: 'sub', id: 'm01s1' }, { kind: 'sub', id: 'm01s2' }, { kind: 'sub', id: 'm01s3' },
          { kind: 'check', id: 'm01l1' }
        ],
        gate: {
          checks: ['m00l1', 'm01l1'], checkIds: ['m00ck', 'm01ck'], extra: [],
          intro: "Dr Strand closes her ledger. 'Two gates. The facts of the test, and thirty seconds of triage. Nobody writes a word here until they know what kind of chart it is.'",
          pass: "'Good,' says Dr Strand. 'You know the rules, and you can name the mode before you read a single number.' She puts a small brass key in your hand. 'The Observatory is open to you now.'"
        },
        ending: {
          img: 'story/ch1-end.webp',
          alt: 'A small dormitory at night: Juno asleep in one bed, the heroine awake in another by a lamp, a trunk and a satchel on the floor.',
          text: "That night you lie in bed and listen. Juno is already asleep. You think about the living charts, the four modes, and the grey sheet with no numbers. Then you hear a sound above the castle: a slow creak, like old metal turning. It sounds like a weathercock in the wind. But there is no wind tonight. Tomorrow Dr Strand teaches the Four-Part Charm, the shape of every report."
        },
        newsroom: 'The Whisper prints its first fake chart report: a fall with no numbers, a reason and a conclusion. The Gossip Quill is back, and someone is feeding it.'
      },

      /* ================================================== CHAPTER 2 */
      {
        id: 'ch2', n: 2, title: 'The Four-Part Charm', place: 'The Observatory',
        blurb: 'Four parts, one job each, and the task sentence in your own words.',
        keepsake: { id: 'charm', name: 'The Four-Part Charm', desc: 'Four small brass links on one ring: introduction, overview, Detail A, Detail B.' },
        opens: ['writer'],
        pages: [
          {
            img: 'story/ch4-01.webp',
            alt: 'A workshop with wooden benches and leather books; a bearded professor in a teal robe sets a book in front of the heroine, a chalkboard of lines and numbers behind him.',
            text: "Professor Brigg of Bridge climbs the tower stairs with a blank book. 'Every report is one charm in four parts,' he says. On the board he writes the plan. An [[introduction|the first paragraph: what the chart shows|บทนำ]] of about 30 words. An overview of about 45. Then two paragraphs of details, about 50 or 60 words each. 'One job for each paragraph. Aim for 160 to 190 words in all, safely over 150.' Juno counts on her fingers. 'Only four?' 'Four,' says Brigg. 'Short, clear and finished.'"
          },
          {
            img: 'story/ch2-02.webp',
            alt: 'Celeste, in a plum-and-gold scarf, speaks at a wooden lectern while a silver-haired professor listens with one eyebrow raised.',
            text: "Celeste Ashby of Lexicon, a girl with a sleek black bob who loves big words, reads her first report aloud. Her voice is lovely, and her details are clear. Then comes the last line: 'In conclusion, the market is popular because it is fun.' Penhallow raises one eyebrow. 'A report has no [[conclusion|a final paragraph that sums up or gives a view|บทสรุป]],' she says. 'No opinion and no reason, either. You do not know why people came. The chart does not say. A report stops when the data stops.' Celeste crosses the line out. 'Old habit,' she mutters."
          },
          {
            img: 'story/ch2-03.webp',
            alt: 'The heroine, seen from behind, speaks at a lectern while a silver-haired professor writes on a slate.',
            text: "Your turn. The task sentence says: 'The graph below shows the number of visitors to three attractions in Lamphun between 2012 and 2022.' You must not copy it, so you [[paraphrase|say the same thing in different words|ถอดความ]] it. 'The line graph illustrates how many people, in thousands, visited three places in Lamphun from 2012 to 2022.' Penhallow writes it on a slate. 'The visual, what it measures, where, the [[time frame|the years that a chart covers|ช่วงเวลา]] and the units. That is a full introduction.'"
          },
          {
            img: 'story/ch2-05.webp',
            alt: 'At a breakfast table, Felix holds a sheet of paper while Priya, a tall older student with glasses, talks to the heroine.',
            text: "Next morning The Whisper prints another report. It starts with the task sentence, copied word for word. Then it runs on in one long block with no paragraphs. Priya Desai, editor of The Quillmoor Lantern, reads it with a red pen. 'Words copied from the [[rubric|the task sentence printed on the exam paper|คำสั่งของโจทย์]] are [[discounted|not counted|ไม่ถูกนับ]],' she says. 'So this report is shorter than it looks.' Felix points at a corner of the sheet. A tiny green flake of metal is stuck in the ink."
          },
          {
            img: 'story/ch6-04.webp',
            alt: 'Celeste, in a violet-and-gold scarf, writes in a book at a library table by lamplight while the heroine stands beside her.',
            text: "That evening you find Celeste in the library, writing slowly. 'Last term I learned a perfect essay by heart,' she says. 'Thirty students had the same one. The ink faded on my page, because the words weren't mine.' She shows you her new first line: 'The [visual] gives information about [what] in [where] from [year] to [year].' 'My own [[frame|a sentence pattern with gaps to fill|โครงประโยค]],' she says. 'The chart fills the gaps. So it's never a copy.'"
          },
          {
            img: 'story/ch4-03.webp',
            alt: 'The heroine reads an open book at a desk while a bearded professor in a long teal robe stands with his arms crossed beside shelves of books.',
            text: "Brigg sends you to the Scriptorium with one chart and one rule: four parts, in order. You write the introduction from the chart, not from the task sentence. You write an overview of the whole chart, with no numbers. You write two short paragraphs of [[detail|a small fact, such as one figure|รายละเอียด]]. Then you stop. No conclusion. Brigg reads it with his arms crossed. 'Not perfect,' he says. 'But it has four parts, and each one does its job. That charm works.'"
          }
        ],
        missions: [
          { kind: 'sub', id: 'm02s1' }, { kind: 'sub', id: 'm02s2' }, { kind: 'sub', id: 'm02s3' },
          { kind: 'writing', label: 'Your first guided report', note: 'In the Scriptorium, write a four-paragraph report on one chart: an introduction in your own words, an overview with no figures, two short paragraphs of details, and no conclusion.', min: 1, kind2: 'report' },
          { kind: 'check', id: 'm02l1' }
        ],
        gate: {
          checks: ['m02l1'], checkIds: ['m02ck'], extra: [],
          intro: "'One gate,' says Brigg. 'Show me the four parts, a full introduction, and a task sentence in your own words. Then the charm is yours.'",
          pass: "Brigg hangs a small brass charm on your bag: four links on one ring. 'Four parts, in order, every time. Now your report has a skeleton.'"
        },
        ending: {
          img: 'story/ch2-end.webp',
          alt: 'The heroine and Juno sit together on stone castle steps at dusk, the moor glowing purple and gold behind them.',
          text: "You and Juno sit on the castle steps at dusk. The moor is purple and gold. 'Four parts,' says Juno. 'Easy to say.' Then she points up at the Observatory. On the roof, something small and bright turns slowly. 'The weathercock,' she says. 'It always faces the wind.' But tonight the air is still, and the weathercock is facing down, into the glass dome. Tomorrow Dr Strand takes you to the very top: the Watchtower."
        },
        newsroom: 'The Whisper copies the task sentence word for word and prints one block of text; Felix finds a tiny green flake of metal on the sheet.'
      },

      /* ================================================== CHAPTER 3 */
      {
        id: 'ch3', n: 3, title: 'The Watchtower', place: 'Top of the Observatory',
        blurb: 'From up here you cannot read one number. Good: this is the big picture.',
        keepsake: { id: 'spyglass', name: 'The Watchtower spyglass', desc: 'A small brass spyglass for seeing the whole chart before any number.' },
        opens: ['bootcamp'],
        pages: [
          {
            img: 'story/ch6-end.webp',
            alt: 'The heroine, Juno, Felix and Celeste climb wide stone steps beside a green moor towards an open door, where a silver-haired professor waits.',
            text: "The Watchtower is the very top of the Observatory. You climb the outside stairs with Juno, Felix and Celeste. At the top, the whole moor lies below you: the lake, the tram road, the little villages. Penhallow waits at the door. 'From up here you cannot read one single number,' she says. 'Good. This is the big picture. In a report, the big picture has a name. It is the [[overview|a short description of the main points|ภาพรวม]].'"
          },
          {
            img: 'story/ch3-03.webp',
            alt: 'A grey-haired man in a tweed waistcoat hands the heroine a glass lens; two glowing circles show rooms above a map on the table.',
            text: "Dr Hale, the headmaster, hands you a brass spyglass. 'Look at the whole chart first,' he says. 'What went up? What went down? What was biggest? What stayed the same?' The main [[trend|the general direction of change|แนวโน้ม]] and the biggest difference go in the overview. It begins with 'Overall,' and it comes second, straight after the introduction. 'Without an overview,' says Hale, 'Task Achievement cannot go above Band 5. It is the gate.'"
          },
          {
            img: 'story/ch3-05.webp',
            alt: 'Juno holds a glowing brass key over a map as a small room rises from the paper; the heroine and a grey-haired man watch.',
            text: "Juno writes first. 'Overall, visitors to the Night Market rose, whereas the Royal Museum lost visitors.' Hale nods. Celeste tries next. 'Overall, the Night Market rose to 65,000.' The spyglass clouds over. 'No figures in the overview,' says Hale. 'Names, years and words like doubled are fine. The values belong in the details.' Celeste rubs out the number, and the glass clears. An overview is [[general|about the whole thing, not the details|ทั่วไป]], but it is never vague."
          },
          {
            img: 'story/ch3-04.webp',
            alt: 'Felix photographs a glowing street that rises from a map on the table; the heroine points at it and a grey-haired man looks on.',
            text: "Below the Watchtower is the Counting Room, where the details live. Felix walks between the charts with his camera. For every sentence you say, he asks the same thing. 'The Night Market grew quickly.' 'Where's the number?' 'It grew from 20,000 visitors in 2012 to 65,000 in 2022.' Click. 'Now that I can photograph,' he grins. In paragraphs three and four, every sentence makes a claim and gives a number to [[support|show that something is true|ยืนยัน]] it."
          },
          {
            img: 'story/ch5-04.webp',
            alt: 'A crimson-robed professor with a long white braid heats a glowing gold flask over a lamp while the heroine watches.',
            text: "Professor Weaver of Loom fills a glass flask. The gold liquid climbs from the 60 line to the 70 line. 'It rose to 70,' she says. 'To is the end point. It rose by 10. By is the size of the change. From 60 to 70 gives both. And it [[peaked|reached its highest point|ขึ้นถึงจุดสูงสุด]] at 70: at is one point.' Then she warns you. 'A move from 20% to 30% is 10 [[percentage points|the gap between two percentages|จุดเปอร์เซ็นต์]], not 10%.'"
          },
          {
            img: 'story/ch3-06.webp',
            alt: 'Felix and the heroine study a grey sheet laid on a map table full of lit rooms; a silver-haired professor stands in the doorway.',
            text: "A new Whisper slides under the door. It lists every year, one by one, with no overview at all. Felix checks the figures against the real chart. 'Wrong. Wrong. And this one is invented.' When a value falls between two lines, a careful writer says [[approximately|close to a number, but not exactly|ประมาณ]] or 'just over'. The Quill simply makes one up. Another green flake falls from the sheet. You look up through the glass. On the roof, the weathercock is staring down at the charts."
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
          intro: "Professor North of Compass meets you at the top of the stairs. 'Two gates. An overview with no figures, and details where every sentence carries a number. The big picture first, then the proof.'",
          pass: "North gives you a small brass spyglass. 'Look at the whole chart before you look at any number. Then prove every claim with a figure.'"
        },
        ending: {
          img: 'story/ch4-end.webp',
          alt: 'Night in a stone courtyard: Celeste sits on the steps holding a page and a quill, and the heroine sits a little way off, watching her.',
          text: "That night you cannot sleep, so you walk down to the courtyard. Celeste is sitting on the steps with a page of numbers. She jumps when she sees you and hides the page. 'Just homework,' she says, a little too quickly. Above you, the weathercock creaks. You say nothing. But you think about the green flakes, and you wonder. Tomorrow you start a new room: the Tide Clock, where water rises and falls through the years."
        },
        newsroom: 'The Whisper lists every year with no overview and invents a figure; more green flakes fall, and the weathercock on the roof stares down into the dome.'
      },

      /* ================================================== CHAPTER 4 */
      {
        id: 'ch4', n: 4, title: 'The Tide Clock', place: 'Spellbook Workshop and the Tide Clock',
        blurb: 'Five lines of water, two groups, and the first page of your own spellbook.',
        keepsake: { id: 'clasp', name: 'Spellbook clasp', desc: 'A brass clasp for a TREND page written in your own words.' },
        opens: ['template', 'lab', 'models'],
        pages: [
          {
            img: 'story/ch7-04.webp',
            alt: 'A silver-haired professor reaches up to set the hands of a large wall clock; the heroine and Juno stand beside a wall of empty frames.',
            artWish: 'The Tide Clock: a tall glass case on the Observatory stairs with five coloured lines of water inside, rising and falling as the brass hands turn past the years; Dr Halima Strand sets the hands while the heroine and Juno watch.',
            text: "Halfway up the Observatory stands the Tide Clock: a tall glass case with five lines of coloured water inside. As the hands turn through the years, each line rises or falls. Penhallow sets the hands to 2012. 'Years along the bottom,' says Dr Strand. 'So this is TREND mode. Past years take the past simple: rose, fell, peaked.' She taps 2030. 'A future year is a [[projection|a figure for a year that has not come yet|การคาดการณ์]]. Say it is expected to reach 50.'"
          },
          {
            img: 'story/ch5-03.webp',
            alt: 'Juno pours a glowing liquid from a small bottle into a glass flask while a bearded professor in a teal robe smiles beside her.',
            text: "Five lines are too many to describe one by one. Juno pours them into two glass flasks. 'Group them!' she says. 'The two lines that rise go in this flask. The three that fall go in that one.' Brigg nods. 'Each [[group|a set of things that share the same pattern|กลุ่ม]] becomes one paragraph: Detail A and Detail B. Every [[category|one item in a chart, such as one line or one bar|หมวดหมู่]] goes somewhere. Nothing is left out.'"
          },
          {
            img: 'story/ch4-04.webp',
            alt: 'Juno sits with her head in her hand at a desk; the heroine points at an open book and a bearded professor stands behind them.',
            text: "But Juno's first paragraph is a list: every line, every year. She holds her head. 'It's all true. So why is it bad?' 'Because it's a list, not a report,' you say. 'Choose three to five figures for each group: the first, the last, the highest, and one comparison.' Brigg smiles. 'Leave the rest out on purpose. [[Select|choose the most important things|คัดเลือก]] first, then compare. Year after year after year is what the examiner calls mechanical.'"
          },
          {
            img: 'story/ch7-02.webp',
            alt: 'A plum-robed professor holds up two books; a silver-haired professor stands beside him and a crimson-robed professor holds a glowing object.',
            text: "Professor Liang of Lexicon holds up two books chained together. 'Rose and a rise. Fell and a fall. Learn them in pairs.' Then he adds a degree word to each. 'Rose [[sharply|quickly and by a large amount|อย่างรวดเร็วและมาก]] for a big change. Rose slightly for a small one. Rose [[steadily|at an even speed, without jumps|อย่างสม่ำเสมอ]] for an even climb.' He shows a line that goes up, down and up again. 'This one does not \"change a lot\". The word is [[fluctuate|go up and down again and again|ขึ้นลงไม่คงที่]].'"
          },
          {
            img: 'story/ch4-02.webp',
            alt: 'Celeste copies from a page while grey smoke rises from her open book; a bearded professor in teal and Juno watch from behind.',
            text: "In the Spellbook Workshop you design the first page of your own spellbook: TREND. Celeste shows the class what happens to a copied page. She copies a model report, and the ink smokes and fades. 'A page is yours only when the frames are your own words,' says Brigg. Your frames have gaps, and each gap is a [[variable|a gap in your frame that you fill from the chart|ตัวแปร]]: [rising line], [start figure], [peak and year]. In the exam, the chart fills the gaps."
          },
          {
            img: 'story/ch4-06.webp',
            alt: 'At dusk the heroine stands by an open tower window with her satchel while an owl flies past outside; another student writes by a lamp in the background.',
            text: "You cast your TREND page on a real chart and fill every gap from the data. Then you write the full report in the Scriptorium, check it line by line, and send it. Nutmeg carries it out of the window towards the examiners. As she flies past the Observatory, the weathercock turns its head to watch her. Its beak is open, as if it is talking. Behind you, someone is still writing by lamplight."
          }
        ],
        missions: [
          { kind: 'sub', id: 'm05s1' }, { kind: 'sub', id: 'm05s2' }, { kind: 'sub', id: 'm05s3' },
          { kind: 'check', id: 'm05l1' },
          { kind: 'sub', id: 'm06s1' }, { kind: 'sub', id: 'm06s2' }, { kind: 'sub', id: 'm06s3' },
          { kind: 'check', id: 'm06l1' },
          { kind: 'view', view: 'lab', mode: 'TREND', label: 'Spellbook Workshop: design your TREND page', note: 'In Design, write your TREND page in your own words, with a gap for every variable the chart will fill, and save it.' },
          { kind: 'writing', label: 'Your first report to the examiners', note: 'Cast your TREND page on a chart, write the full report in the Scriptorium, run the Ten Wards (the ten checks before you send) and send it to the examiners.', min: 1, kind2: 'report', mode: 'TREND', full: true }
        ],
        gate: {
          checks: ['m05l1', 'm06l1'], checkIds: ['m05ck', 'm06ck'],
          extra: [
            { id: 'lab-design', mode: 'TREND', label: 'A saved TREND page', note: 'One TREND page designed and saved in the Spellbook Workshop.' },
            { id: 'report-sent', min: 1, mode: 'TREND', full: true, label: 'One TREND report sent to the examiners', note: 'One full report (150 words or more) on a TREND chart, sent from the Scriptorium.' }
          ],
          intro: "'Four things,' says Brigg. 'Two gates, a TREND page in your own words, and one report already flying. A spellbook nobody has used is only a drawing.'",
          pass: "Brigg fits a brass clasp to your spellbook. 'Your frames, the chart's figures. The examiners will read your words, not somebody else's.'"
        },
        ending: {
          img: 'story/ch1-06.webp',
          alt: 'A breakfast table with bread and papers; Juno writes on a timetable, Felix reads a sheet, and the heroine studies a grey paper.',
          text: "Next morning The Whisper reports on the Tide Clock. 'The blue line rose steadily from 2022 back to 2012, because the water was happy.' Juno laughs. 'From 2022 back to 2012? It read the years backwards.' Felix puts the real chart next to it. The blue line fell. It did not rise. 'It's as if someone read the chart in a mirror,' you say. Nobody laughs after that. And where was Celeste last night?"
        },
        newsroom: 'The Whisper reads the Tide Clock backwards (a fall becomes a rise) and adds a reason; the weathercock is seen watching the owls.'
      },

      /* ================================================== CHAPTER 5 */
      {
        id: 'ch5', n: 5, title: 'The Hall of Scales', place: 'The Hall of Scales',
        blurb: 'No time axis, no trend verbs: higher than, twice as, respectively.',
        keepsake: { id: 'scales', name: 'The brass scales', desc: 'A tiny brass scale on a chain, for comparing without a single trend verb.' },
        opens: ['faults'],
        pages: [
          {
            img: 'story/ch2-01.webp',
            alt: 'A round stone chamber with two wooden lecterns and lanterns on chains; a silver-haired professor speaks while the heroine and Juno listen from a bench.',
            artWish: 'The Hall of Scales: a round stone hall full of tall brass balance scales, with bars of light standing in the pans like a bar chart; Dr Halima Strand explains while the heroine and Juno look up at them.',
            text: "Below the Observatory is the Hall of Scales, a round stone room full of brass scales. Nothing here moves through time. Each scale shows one year only. 'No time axis, no trend verbs,' says Dr Strand. 'Nothing rose and nothing fell. You compare instead: higher than, the highest, twice as much.' Juno looks at the still pans. 'So this is COMPARE mode.' 'Yes. And look for the [[exception|one thing that does not follow the pattern|ข้อยกเว้น]]. It often belongs in the overview.'"
          },
          {
            img: 'story/ch2-04.webp',
            alt: 'In a round debating hall the heroine stands at one wooden lectern and a girl with a high ponytail at the other, students watching from the benches.',
            text: "Mina Sato from Compass stands across a giant bar chart from you. 'Bus, 20%. Motorcycle, 40%,' she reads. You answer with a comparison. 'Twice as many workers travelled by motorcycle as by bus, at 40% and 20% [[respectively|in the same order as the things just named|ตามลำดับ]].' Mina tries again. 'The motorcycle rose to 40%.' Dr Strand shakes her head. 'Rose from what? It is one year. Say it was the most common way to travel.'"
          },
          {
            img: 'story/ch5-05.webp',
            alt: 'Celeste holds a flask giving off purple smoke while a crimson-robed professor waves it away; four coloured bottles stand on a shelf behind them.',
            text: "Four bottles stand on a shelf, filled to different levels like the slices of a pie. 'A pie shows shares of a whole,' says Professor Weaver. 'Food was the largest [[proportion|a part of a whole|สัดส่วน]], at just under half. Rent made up about a third.' Celeste tries one. 'Food rose to 45%.' There is a soft pop and purple smoke. 'One pie, one year,' says Weaver. 'Use a [[fraction|a part such as a half or a third|เศษส่วน]] or a share. Food [[accounted for|formed a part of a total|คิดเป็น]] 45%.'"
          },
          {
            img: 'story/ch7-01.webp',
            alt: 'Four professors in navy, teal, plum and crimson robes sit at a long table covered in papers; a silver-haired professor stands in front of them.',
            text: "At the end of the hall the four Heads sit at a long table, covered in paper tables. Professor North gives the rule. 'Read a table by [[row|a line of figures that goes across|แถว]] and by [[column|a line of figures that goes down|คอลัมน์]]. Find the biggest and the smallest numbers first. Then compare whole rows, never one cell at a time.' Juno points at one row. 'This is the only country where the figure fell.' 'Then that is your exception,' says North."
          },
          {
            img: 'story/ch4-03.webp',
            alt: 'The heroine reads an open book at a desk while a bearded professor in a long teal robe stands with his arms crossed beside shelves of books.',
            text: "Back in the Workshop you add a second page to your spellbook: COMPARE. The frames are your own words, with gaps for the chart: [largest category], [smallest category], [higher group], [exception]. Brigg reads your overview frame. 'Overall, [largest category] was the most popular for both groups, while [smallest category] was the least popular.' 'No figure in it,' he says. 'Good. The figures go in the details.' You test it on a bar chart and then a table. It fits both."
          },
          {
            img: 'story/ch5-06.webp',
            alt: 'The heroine repairs a small brass mechanism at a workbench; Felix writes beside her, and a bearded professor holds up a glass vial; jars and a notice board fill the room.',
            text: "Behind the hall is the Mending Room. Every wrong answer you give in the castle comes here, and you fix it yourself. Felix brings the new Whisper. 'Cats rose to 40% of the pie, because everyone loves cats.' You mend it on the bench: 'Cats were the most popular pet, at 40%.' One pie needs no trend verb, and a report gives no reasons. Then Felix finds something under the sheet: a tiny brass tail feather. 'Copper-green,' he says. 'Same as the flakes.'"
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
          pass: "The two pans settle level. Dr Strand gives you a tiny brass scale on a chain. 'Higher than, twice as, respectively. Nothing rose, and you never said it did.'"
        },
        ending: {
          img: 'story/ch5-end.webp',
          alt: 'Snow on the moor outside tall windows; Juno writes on a notice board while an older man in a long dark coat walks past holding a bunch of keys.',
          text: "Snow falls on the moor. In the hall a notice goes up: the Midwinter Tournament, in the Examination Hall. It is open to anyone with a clasp on their spellbook. Juno is already writing her name. Then Mr Fenwick, the librarian, walks past with his iron keys. 'Someone borrowed the key to the roof stairs last week,' he says. 'They signed my book with two letters: C.A.' Juno looks at you. Celeste Ashby."
        },
        newsroom: 'The Whisper puts a trend verb and a reason on a single pie chart; a copper-green brass tail feather turns up in the Mending Room, and the roof key was signed "C.A."'
      },

      /* ================================================== CHAPTER 6 */
      {
        id: 'ch6', n: 6, title: 'The Cellars and the Moor Maps', place: 'Brewing Cellars and the Map Room',
        blurb: 'Stages in order, in the passive. Then two maps, and everything that changed between them.',
        keepsake: { id: 'vial', name: 'Vial of moor ink', desc: 'A small glass vial of ink brewed in seven stages, in order.' },
        opens: [],
        pages: [
          {
            img: 'story/ch5-02.webp',
            alt: 'In a stone cellar a bearded professor in teal drops a grey sheet into a bubbling copper cauldron; Felix and the heroine, holding a ladle, watch.',
            text: "In the Brewing Cellars, Brigg shows you how moor ink is made. There are no years and no bars here, only steps. 'This is SEQUENCE mode,' he says. 'Count the stages first. Then move the reader from one to the next.' At the first [[stage|one step in a process|ขั้นตอน]], heather is picked. Next, it is washed. After that, it is boiled in the copper pot. 'A different sequencer each time,' says Brigg. 'Next, after that, once it has cooled, finally.'"
          },
          {
            img: 'story/ch5-04.webp',
            alt: 'A crimson-robed professor with a long white braid heats a glowing gold flask over a lamp while the heroine watches.',
            text: "Professor Weaver heats a flask over a lamp. 'A process has no dates, so it takes the present simple,' she says. 'When people do a step, use the [[passive|a verb form such as \"is heated\", where the action matters more than who does it|รูปประโยคถูกกระทำ]]: the ink is heated. When nature does it, stay active: the rain falls, the river carries it.' You test yourself. 'The ink heated.' She shakes her head. 'Wrong tense, and no passive. The ink is heated.'"
          },
          {
            img: 'story/ch5-03.webp',
            alt: 'Juno pours a glowing liquid from a small bottle into a glass flask while a bearded professor in a teal robe smiles beside her.',
            text: "Juno pours the finished ink into a bottle. 'Done. So what goes in the overview?' 'Four things,' says Brigg. 'How many stages. Whether the process is [[linear|going in a line from a start to an end|เป็นเส้นตรง]] or [[cyclical|going round in a circle and starting again|เป็นวัฏจักร]]. What it starts with. What it ends with.' Juno writes: 'Overall, the linear process has seven stages, beginning with fresh heather and ending with bottles of ink.' No figures, no reasons. Just the shape."
          },
          {
            img: 'story/ch3-01.webp',
            alt: 'In a stone room a huge, mostly blank map lies on a round table; the heroine reaches towards brass keys hanging on the wall while a grey-haired man sits thinking.',
            text: "Next door is the Map Room. On the round table lie two maps of the same moor village: one from 1990 and one from today. 'SPACE mode,' says Dr Hale. 'Never left and right. The reader cannot see which way you are holding the map. Use compass points: in the north, to the east of the lake, south of the bridge.' You find the old mill in the north-west. Then you find the school beside the river."
          },
          {
            img: 'story/ch7-03.webp',
            alt: 'A grey-haired man lays coloured sheets over a large map on a round table; the heroine leans in, and a student in a navy scarf raises her hand.',
            text: "Hale lays the new map over the old one, and every change glows. The mill was [[demolished|knocked down|ถูกรื้อถอน]] and replaced by a car park. The school was [[extended|made bigger or longer|ถูกขยาย]] to the north. The barn was [[converted|changed to a new use|ถูกดัดแปลง]] into a café. Mina raises her hand. 'And the church?' 'It remained [[unchanged|the same as before|ไม่เปลี่ยนแปลง]],' says Hale. 'Say so in the overview. What stayed the same matters too. And for a plan, use the future: will be built.'"
          },
          {
            img: 'story/ch4-end.webp',
            alt: 'Night in a stone courtyard: Celeste sits on the steps holding a page and a quill, and the heroine sits a little way off, watching her.',
            text: "The Whisper's map report is wrong too. 'A new library was built in the west.' On the real map it is in the east. 'East and west swapped,' says Juno. 'Years backwards. It's a mirror.' That night Celeste finds you on the same courtyard steps. This time she shows you her page. 'I signed for the roof key,' she says. 'I copy every Whisper report and check it against the real chart. Every figure is back to front.'"
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
          intro: "Brigg and Hale stand in the doorway between the cellars and the Map Room. 'Two gates and two pages. Stages in order with the passive, and maps with compass points and change verbs. Both pages in your own words.'",
          pass: "Brigg hands you a small glass vial of moor ink. 'Every stage in order, and every change on the map in the right place. Write with this.'"
        },
        ending: {
          img: 'story/ch6-02.webp',
          alt: 'An older man unlocks a tall iron gate in a library with a bunch of keys; the heroine stands close to him, and Celeste holds a book nearby.',
          text: "Mr Fenwick listens to the whole story. Then he takes out his iron keys. 'The roof stairs start behind the Locked Stacks,' he says. 'Glass on top, and the weathercock above the glass. If you want to see who is talking to the Quill, go at midnight. Take Felix, and take his camera.' He unlocks the gate. Celeste stands beside you with her notes. This time she is on your side."
        },
        newsroom: 'The Whisper swaps east and west on the moor map; Celeste reveals she signed for the roof key to check every fake report against the real charts.'
      },

      /* ================================================== CHAPTER 7 */
      {
        id: 'ch7', n: 7, title: 'The Library and the Newsroom', place: 'Long Library and the Lantern office',
        blurb: 'Two visuals, seven error families, links that point back, and a midnight on the roof.',
        keepsake: { id: 'press', name: 'Press badge', desc: 'A Lantern press badge, for the story that found who fed the Quill.' },
        opens: [],
        pages: [
          {
            img: 'story/ch6-01.webp',
            alt: 'In a long library a plum-robed professor runs his hand along a chain between books on a shelf; the heroine stands beside him with her satchel.',
            text: "In the Long Library, Professor Liang opens two books side by side: a pie chart and a line graph. 'Two visuals, one report,' he says. 'One introduction names both. One overview gives a [[headline|the main point, said in a few words|ประเด็นหลัก]] for each. Then one paragraph for each visual.' He taps the pages. 'And never [[combine|put together into one|รวมกัน]] their figures. The pie counts people and the graph counts money. They measure different things.'"
          },
          {
            img: 'story/ch6-03.webp',
            alt: 'A crimson-robed professor reads from a lectern; students at desks, including the heroine and Juno, hold up small white cards.',
            text: "Professor Weaver runs the error auction. She reads a sentence, and you name the family. 'The number of tourist were rise in 2010.' You hold up three cards: plural, [[agreement|a verb matching its subject|ความสอดคล้องของประธานกับกริยา]] and tense. 'The number of tourists rose in 2010.' Seven families: articles, plurals, agreement, tense, prepositions, punctuation and word form. 'Name the family,' says Weaver, 'and the fix stays fixed. [[Accuracy|being correct, without errors|ความถูกต้อง]] first.'"
          },
          {
            img: 'story/ch5-01.webp',
            alt: 'In a stone cellar with copper pots and shelves of bottles, a bearded professor in a teal robe holds up a small bottle for the heroine to see.',
            text: "Brigg holds up a bottle from the cellar shelf. Its label says 'this figure'. Others say '[[the former|the first of two things just named|อย่างแรก]]', '[[the latter|the second of two things just named|อย่างหลัง]]' and 'over the same period'. 'Point back instead of repeating,' he says. 'Car sales rose to 50,000. This figure was twice the 2010 level.' Then he shakes out a Whisper: Firstly. Moreover. Furthermore. 'A connector on every sentence is [[mechanical|done by habit, without thinking|เป็นกลไกซ้ำๆ]]. Link with meaning instead.'"
          },
          {
            img: 'story/ch6-05.webp',
            alt: 'In a dark room among bookshelves, a violet-black quill writes by itself on a long scroll; Felix\'s camera flashes, Priya holds a lamp and the heroine holds a notebook.',
            artWish: 'Midnight on the Observatory roof: a copper-green brass weathercock bends over the glass dome, staring down at the glowing charts inside; beside it a violet-black quill writes on a long grey roll; Felix\'s camera flashes while the heroine, Celeste and Priya crouch behind a chimney.',
            text: "At midnight you climb the roof stairs with Felix, Celeste and Priya. Above the glass dome, the old brass weathercock is bent over, staring down at the living charts. It reads them through the glass, back to front, and whispers: 'Fell, fell. West, west.' Beside it, a violet-black quill writes every word on a long grey roll. Then it adds 'because' and 'in conclusion'. Felix lifts his camera. 'There's the [[source|where information comes from|แหล่งที่มา]] of the numbers.' Flash."
          },
          {
            img: 'story/ch6-06.webp',
            alt: 'In a busy hall, students read the front page of a newspaper; Felix holds it up while Priya and the heroine read over his shoulder.',
            text: "The Lantern prints the story the next morning:\n\n'WHO FED THE QUILL? At midnight our reporters found the Observatory weathercock reading the living charts through the glass dome, back to front. The weathercock read the charts back to front. As a result, every fake report reversed the real figures: rises became falls, and east became west. The Gossip Quill then added opinions, reasons and conclusions. Readers are advised to check every number against the chart.'\n\nThe article has names, a photo and a time."
          },
          {
            img: 'story/ch5-06.webp',
            alt: 'The heroine repairs a small brass mechanism at a workbench; Felix writes beside her, and a bearded professor holds up a glass vial; jars and a notice board fill the room.',
            text: "Dr Strand brings the weathercock down to the Mending Room. You help her fix its stiff brass neck. 'It was built to report one thing: the wind,' she says. 'Nobody taught it to read an axis.' She turns it back to face the wind. Without its numbers, the Quill has nothing left to print. Then you mend the last faults on your own list, until fewer than five are waiting. 'No more fake figures,' says Felix. 'Just ours.'"
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
          pass: "Priya pins a Lantern press badge on your robe. 'Checked figures, a named source, no fog. That is how you report the truth.'"
        },
        ending: {
          img: 'story/ch6-end.webp',
          alt: 'The heroine, Juno, Felix and Celeste climb wide stone steps beside a green moor towards an open door, where a silver-haired professor waits.',
          text: "Spring comes to the moor, and The Whisper does not come back. You walk to the Examination Hall with Juno, Felix and Celeste. 'One chart,' says Juno. 'Twenty minutes.' Felix pats his camera. 'And no photos allowed in there.' Penhallow waits at the top of the steps. 'The Almanac Examination is in four weeks,' she says. 'Before that, I will tell you exactly what the examiners look for. In plain words.'"
        },
        newsroom: 'At midnight Felix photographs the weathercock reading the charts back to front for the Quill; The Lantern names the source, and the weathercock faces the wind again.'
      },

      /* ================================================== CHAPTER 8 */
      {
        id: 'ch8', n: 8, title: 'The Almanac Examination', place: 'Examination Hall',
        blurb: 'One chart, twenty minutes, four gates. Report only what the chart shows.',
        keepsake: { id: 'seal', name: 'The Almanac seal', desc: 'The seal of the Observatory, for a report at the Band 7.5 standard.' },
        opens: [],
        pages: [
          {
            img: 'story/ch7-01.webp',
            alt: 'Four professors in navy, teal, plum and crimson robes sit at a long table covered in papers; a silver-haired professor stands in front of them.',
            text: "Four examiners sit at a long table: North, Brigg, Liang and Weaver. Penhallow stands in front. 'Each one looks for one thing,' she says. North: a clear overview and the [[key features|the most important facts about the whole chart|ประเด็นสำคัญ]], each with a figure. Brigg: two logical groups and links that point back. Liang: the precise word for every change. Weaver: the right tense and preposition, and most sentences [[error-free|with no mistakes|ไม่มีข้อผิดพลาด]]."
          },
          {
            img: 'story/ch7-02.webp',
            alt: 'A plum-robed professor holds up two books; a silver-haired professor stands beside him and a crimson-robed professor holds a glowing object.',
            text: "'Here at Quillmoor, four examiners,' says Penhallow. 'In the real test, one examiner marks your report on the same four criteria, and each criterion counts [[equally|in the same amount|เท่าๆ กัน]]. The Almanac seal needs Band 7.5: two eights and two sevens, for example.' She raises a finger. 'Then the real test adds your Task 2 essay, which counts twice as much, and gives one Writing band. So never steal time from Task 2. Twenty minutes for the report, then stop.'"
          },
          {
            img: 'story/ch7-04.webp',
            alt: 'A silver-haired professor reaches up to set the hands of a large wall clock; the heroine and Juno stand beside a wall of empty frames.',
            text: "In the Exemplar Archive, model reports hang in frames. 'Read them for the shape,' says Penhallow. 'Not to copy. Look at what they leave out.' A strong report does not give every figure. It chooses three or four key features: the direction, the highest and lowest, the biggest gap, the [[crossover|the point where one line passes another|จุดที่เส้นตัดกัน]], the exception. Then it gives one or two figures for each. 'Don't list,' says Penhallow. '[[Illustrate|show something clearly with an example or a figure|แสดงให้เห็นด้วยตัวอย่าง]].'"
          },
          {
            only: 'new',
            img: 'story/ch4-05.webp',
            alt: 'Ten small lanterns hang in a row above a great wooden door; a silver-haired professor and the heroine stand beneath them.',
            text: "Above the hall door hang ten small lanterns: the Ten Wards. Penhallow reads them. 'Four paragraphs, with Overall in the second. No figures in the overview. A number in every detail sentence. Two comparisons. Tense that fits the dates. Number and amount, plurals, articles. To, by, from, at. No opinion, reason or conclusion. No copied task sentence, and every category named. Then 150 to 190 words.' She turns to you. 'Check them in the same order, every time.'"
          },
          {
            only: 'returning',
            img: 'story/ch4-05.webp',
            alt: 'Ten small lanterns hang in a row above a great wooden door; a silver-haired professor and the heroine stand beneath them.',
            text: "Above the hall door hang ten small lanterns. They look like last term's Ten Wards, but every rule is new. 'Four paragraphs, with Overall in the second. No figures in the overview. A number in every detail sentence. Two comparisons. Tense that fits the dates. Number and amount, plurals, articles. To, by, from, at. No opinion, reason or conclusion. No copied task sentence, and every category named. Then 150 to 190 words.' Same habit as last term: same order, every time."
          },
          {
            img: 'story/ch7-05.webp',
            alt: 'Students write at desks in an examination hall; a close-up circle shows grey marks in a paper margin crossed out in black ink.',
            text: "On the morning of the Almanac Examination, thin grey numbers appear in the margins of the papers. '68%.' 'Rose by 40%.' 'Because people love…' It is the Quill's last trick. Celeste sees it first. She checks one number against the chart and laughs. 'Wrong axis. Nice try.' One by one, students cross out the grey figures and use only the chart. The ink has nothing to feed on, and it fades away. Penhallow does not even look up. 'Begin.'"
          },
          {
            img: 'story/ch7-06.webp',
            alt: 'The heroine, seen from behind, writes at a desk in a quiet hall; Juno writes at the next desk, a large clock hangs on the wall and an owl waits on the window sill.',
            text: "Twenty minutes, and the same [[protocol|the fixed steps you follow every time|ขั้นตอนปฏิบัติ]] as always. In the first four minutes you name the mode, then [[plan|decide what you will write before you write it|วางแผน]]: the big picture, two groups, three to five figures each. Thirteen minutes to write: introduction, overview, Detail A, Detail B. At minute seventeen you stop and check the Ten Wards in order. No conclusion. You count your lines: about 170 words. You put your pen down. Nutmeg waits on the window sill to carry the reports to the examiners."
          }
        ],
        missions: [
          { kind: 'sub', id: 'm13s1' }, { kind: 'sub', id: 'm13s2' }, { kind: 'sub', id: 'm13s3' },
          { kind: 'check', id: 'm13l1' },
          { kind: 'sub', id: 'm14s1' }, { kind: 'sub', id: 'm14s2' }, { kind: 'sub', id: 'm14s3' },
          { kind: 'check', id: 'm14l1' },
          { kind: 'view', view: 'models', label: 'Exemplar Archive: read the model reports', note: 'Read them for the shape of a Band 8 report and for what they leave out, not to copy.' },
          { kind: 'writing', label: 'Three mock examinations', note: 'Three full reports in the Scriptorium at twenty minutes each, then send each one to the examiners.', min: 3, kind2: 'mock', full: true }
        ],
        gate: {
          checks: ['m13l1', 'm14l1'], checkIds: ['m13ck', 'm14ck'],
          extra: [
            { id: 'report-sent', min: 3, kind: 'mock', full: true, label: 'Three mock examinations sent to the examiners', note: 'Three twenty-minute reports, each sent to the examiners.' },
            { id: 'best-band', min: 7.5, field: 'bestBand', label: 'A report marked at 7.5 or above', note: 'This is the standard of the real test, and it can take months of mock examinations after the classes end. Keep sending reports: your best band is kept, and the seal arrives by owl the day the examiners agree.' }
          ],
          intro: "Penhallow stands alone before the table. 'Two gates, three mock examinations, and then the only thing that matters: one report marked at the 7.5 standard. Everything else was practice for this.'",
          pass: "Four verdicts come back by owl. Penhallow presses the Almanac seal into warm wax. 'The big picture, two clear groups, the precise word, and control. Every number from the chart. Verba vincunt.'"
        },
        ending: {
          img: 'story/ch7-end.webp',
          alt: 'The Hall of Lanterns at night, lanterns glowing in many colours; the heroine stands by a window holding a sealed letter while Juno, Celeste and Felix smile behind her.',
          text: "The Hall of Lanterns glows in all four colours tonight. Your house cheers when your name is read. Juno hugs you so hard your badge bends. Celeste shakes your hand, and then hugs you too. Felix takes one photo, with permission. On the Observatory roof the weathercock faces the wind again. The real test has the same twenty minutes and the same four criteria. Now you can meet any chart: read it, group it, and report only what it shows."
        },
        newsroom: 'The Quill makes one last try with grey numbers in the exam margins; the students check them against the chart, cross them out, and the ink fades for good.'
      }
    ],

    /* ------------------------------------------------------------ events */
    events: {
      tournament: {
        title: 'The Midwinter Tournament',
        pages: [
          {
            img: 'story/ev-tournament-01.webp',
            alt: 'A cold, bright examination hall decorated with green garlands under a great clock; a grey-haired man holds a scroll beside a silver-haired professor, students at desks around them.',
            text: "The Examination Hall is cold and bright. A great clock hangs over the door. Dr Hale reads the rules. 'Three tasks. A timed run through the Duelling Hall. One chart cast with your spellbook, one minute for each variable. And one full report in twenty minutes.' Penhallow adds one line. 'Nobody loses house points here. You only find out how fast your own words come when the clock is running.'"
          },
          {
            img: 'story/ev-tournament-02.webp',
            alt: 'Students write on small slates beside hourglasses; the heroine, Juno and Celeste sit at the front desk.',
            text: "The first two tasks are about speed, not beauty. Read the chart. Name the mode, the units and the years. Then fill your spellbook's gaps on a slate, one minute each. Juno finishes early and checks every figure twice. Celeste runs out of time on the last gap. 'I read the wrong axis,' she says afterwards. 'Next time I'll read the labels first.'"
          },
          {
            img: 'story/ev-tournament-03.webp',
            alt: 'A grey-haired man in a long coat hands a small token on a chain to the heroine; students in house scarves stand around them.',
            text: "Then the report. Twenty minutes, one chart, your own spellbook in your head. You write the overview second, straight after the introduction. At minute seventeen you stop writing and check. At minute twenty you put your pen down, finished or not. Hale hands a small brass token to everyone who completes all three tasks. 'It is not a band,' he says. 'It is proof that you can do it under a clock.'"
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
    mapIntro: "This is the map of Quillmoor, with the Observatory on its east side. A room opens when you earn its key, so finish each chapter and the castle grows.",
    mapIntroReturning: "Welcome back to the map of Quillmoor. This term the path climbs the Observatory: finish each chapter to open its rooms, and remember that the habits that won last term now lose marks.",
    finale: {
      text: "You climbed the Observatory with a key and a lot of questions. You leave with a seal, a spellbook of four pages in your own words, and reports the examiners can follow line by line. The weathercock faces the wind again, and the Quill has nothing left to print. Juno still says 'Group them!' Felix still asks where the number is. The real test waits: twenty minutes, at least 150 words, one chart, the same you. Verba vincunt. Words win."
    }
  };
})();
