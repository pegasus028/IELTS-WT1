/* QUILLMOOR ACADEMY — THE OBSERVATORY — sorting.js
   The Sorting Lantern, Task 1 edition: twelve questions, three per criterion
   (TA Compass, CC Bridge, LR Lexicon, GRA Loom). Each item tests real IELTS
   Academic Writing Task 1 English; the castle frame is only in the intro.
   Mixed B1/B2 (six each). UK spelling. ES5. Schema: QUILLMOOR-T1-SPEC.md.
   Key positions scripted before writing:
     s01 0 · s02 2 · s03 1 · s04 3 · s05 3 · s06 1 · s07 0 · s08 2 · s09 1 · s10 3 · s11 2 · s12 0
     → position 0: s01 s07 s12 · 1: s03 s06 s09 · 2: s02 s08 s11 · 3: s04 s05 s10 (3/3/3/3)
   Every stem with data is internally consistent (checked by /tmp/story-check.js).
   Owner: Opus A. */
(function () {
  window.SORTING = {
    intro: "The Lantern asks twelve questions about reports. Each one tests one of four keys: the big picture, order, the right word, or control. Answer honestly, because the Lantern only wants to know where you are strong.",
    introReturning: "You have stood here before, and the Lantern remembers you. But this time the twelve questions are about reports, not essays, so your strongest key may have changed. Answer honestly.",
    tieLine: "Two bands glow equally bright. The Lantern cannot choose, so the choice is yours. Whichever you pick, you carry both strengths.",
    results: {
      compass: "The navy band burns brightest, so Compass it is: you see the big picture before the numbers.",
      bridge: "The teal band burns brightest, so Bridge it is: you put the data in order and carry the reader across.",
      lexicon: "The plum band burns brightest, so Lexicon it is: you find the exact word for every change.",
      loom: "The crimson band burns brightest, so Loom it is: your sentences with numbers have no loose threads."
    },
    items: [
      /* ---------------------------------------------------- s01 TA B1 */
      {
        id: 's01', crit: 'TA', cefr: 'B1',
        stem: "A line graph shows visitors to two museums from 2000 to 2020. The City Museum grew from 20,000 to 60,000 visitors, and the Art Museum fell from 50,000 to 30,000. Which sentence is the best overview?",
        options: [
          "Overall, visitor numbers at the City Museum rose, whereas those at the Art Museum fell.",
          "Overall, the City Museum rose from 20,000 to 60,000 visitors, while the Art Museum fell to 30,000.",
          "Overall, the Art Museum lost visitors because people preferred the newer City Museum.",
          "In 2000, the Art Museum had 50,000 visitors, which was more than the City Museum."
        ],
        answer: 0,
        why: "An overview gives the general direction with no figures. Putting values in it, giving a reason, or describing one year in detail are all things an overview must not do."
      },
      /* ---------------------------------------------------- s02 CC B2 */
      {
        id: 's02', crit: 'CC', cefr: 'B2',
        stem: "Fill the gap with the phrase that points back clearly: 'In 2020, 45% of students walked to school and 30% took the bus. ___ was fifteen percentage points lower.'",
        options: [
          "It",
          "The former figure",
          "The latter figure",
          "Both of the figures"
        ],
        answer: 2,
        why: "'The latter figure' points to the second figure named, 30%, which is fifteen points lower. 'The former' is 45%, the higher one; 'it' could mean either, and 'both figures' cannot be fifteen points lower."
      },
      /* ---------------------------------------------------- s03 LR B1 */
      {
        id: 's03', crit: 'LR', cefr: 'B1',
        stem: "Choose the correct word: 'There was a ___ rise in the price of rice, from 20 to 35 baht per kilo between 2015 and 2020.'",
        options: [
          "sharply",
          "sharp",
          "sharpness",
          "sharpen"
        ],
        answer: 1,
        why: "'Rise' is a noun here, so it needs an adjective: a sharp rise. 'Sharply' is the adverb, used with the verb: the price rose sharply."
      },
      /* --------------------------------------------------- s04 GRA B2 */
      {
        id: 's04', crit: 'GRA', cefr: 'B2',
        stem: "A diagram shows how glass bottles are recycled. Which sentence describes stage three correctly?",
        options: [
          "At the third stage, the glass crushes into small pieces.",
          "At the third stage, the glass was crushed into small pieces.",
          "At the third stage, the glass is crushing into small pieces.",
          "At the third stage, the glass is crushed into small pieces."
        ],
        answer: 3,
        why: "A process has no dates, so it takes the present simple. People crush the glass, so the passive is used: is crushed. The past tense and the active forms are wrong here."
      },
      /* ---------------------------------------------------- s05 TA B2 */
      {
        id: 's05', crit: 'TA', cefr: 'B2',
        stem: "A bar chart shows the hours a week that students in four countries spent on homework in 2024. Which sentence belongs in the report?",
        options: [
          "In conclusion, students in Korea work too hard and should rest more.",
          "Homework in Korea rose sharply over the year, reaching 12 hours a week.",
          "In my opinion, the figures prove that homework leads to success.",
          "Korean students spent the most time on homework, at 12 hours a week."
        ],
        answer: 3,
        why: "Report only what the chart shows, with a figure. One year means no trend verbs like 'rose'; a conclusion or an opinion adds what the chart does not say."
      },
      /* ---------------------------------------------------- s06 CC B1 */
      {
        id: 's06', crit: 'CC', cefr: 'B1',
        stem: "Which paragraph order does the four-part plan for a Task 1 report use?",
        options: [
          "Introduction, Group A, Group B, overview",
          "Introduction, overview, Group A, Group B",
          "Overview, introduction, Group A, Group B",
          "Introduction, overview, Group A, conclusion"
        ],
        answer: 1,
        why: "The overview comes second, straight after the introduction, so the examiner finds it at once. Then two groups of details, and no conclusion."
      },
      /* ---------------------------------------------------- s07 LR B2 */
      {
        id: 's07', crit: 'LR', cefr: 'B2',
        stem: "The share of homes with internet rose from 40% in 2010 to 60% in 2020. Which description is accurate?",
        options: [
          "It rose by 20 percentage points.",
          "It rose by 20%.",
          "It rose to 20 percentage points.",
          "It rose at 20%."
        ],
        answer: 0,
        why: "The gap between two percentages is measured in percentage points. 'By 20%' would mean a rise of a fifth, to 48%, and 'to' and 'at' give the wrong level."
      },
      /* --------------------------------------------------- s08 GRA B1 */
      {
        id: 's08', crit: 'GRA', cefr: 'B1',
        stem: "A line graph shows the number of cars in Chiang Mai from 1990 to 2010. Choose the verb: 'The number of cars ___ steadily over the period.'",
        options: [
          "increases",
          "has increased",
          "increased",
          "will increase"
        ],
        answer: 2,
        why: "The period ended in 2010, so it takes the past simple. The present perfect is only for a period that runs up to now, and the present and future do not fit past dates."
      },
      /* ---------------------------------------------------- s09 TA B1 */
      {
        id: 's09', crit: 'TA', cefr: 'B1',
        stem: "A pie chart shows how a family spends its money: food 40%, rent 30%, transport 20% and other costs 10%. A report describes food, rent and transport only. What is the problem?",
        options: [
          "It gives the categories in a different order from the chart.",
          "It leaves out one category of the chart.",
          "It does not give an opinion about the spending.",
          "It needs a conclusion that sums up the spending."
        ],
        answer: 1,
        why: "Every category must be mentioned at least once, even 'other costs'. The order is the writer's choice, and a report needs no opinion and no conclusion."
      },
      /* ---------------------------------------------------- s10 CC B2 */
      {
        id: 's10', crit: 'CC', cefr: 'B2',
        stem: "A line graph shows coffee sales in five cities from 2010 to 2020. Sales in Hanoi and Bangkok rose; sales in Paris, Rome and Vienna fell. How should the two detail paragraphs be organised?",
        options: [
          "One for 2010 and one for 2020, each with all five cities",
          "One for Hanoi, and one for the other four cities together",
          "One for the three European cities, then one for Bangkok",
          "One for the two cities that rose, one for the three that fell"
        ],
        answer: 3,
        why: "Group the data by the story it shares: rising cities in one paragraph, falling cities in the other. Dividing by year lists data, and the other plans split or drop a group."
      },
      /* ---------------------------------------------------- s11 LR B1 */
      {
        id: 's11', crit: 'LR', cefr: 'B1',
        stem: "Which phrase fits a formal report? 'The number of tourists ___ in 2019.'",
        options: [
          "went up a lot",
          "shot through the roof",
          "rose significantly",
          "rose up significantly"
        ],
        answer: 2,
        why: "'Rose significantly' is formal and precise. 'Went up a lot' and 'shot through the roof' are too informal, and 'rose up' repeats itself: 'rose' already means 'went up'."
      },
      /* --------------------------------------------------- s12 GRA B2 */
      {
        id: 's12', crit: 'GRA', cefr: 'B2',
        stem: "Choose the correct words: 'Unemployment fell ___ 8% ___ 5%, a drop ___ three percentage points.'",
        options: [
          "from … to … of",
          "from … at … by",
          "by … to … of",
          "from … to … by"
        ],
        answer: 0,
        why: "'From … to' gives the start and end points. After the noun 'a drop', the size takes 'of'; 'by' follows the verb: it fell by three points."
      }
    ]
  };
})();
