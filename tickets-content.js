/* QUILLMOOR ACADEMY · THE OBSERVATORY — tickets-content.js (WS-C, generated)
   Launch-quiz and exit-ticket sets for EN31208 Variety of Writing 2, from WS-D's vw2-items.json
   (version 2026-10-23). Do not edit by hand: run  node tools/tickets-build.js  after WS-D updates the bank.
   Item shape = topic-NN.js items; set ids may name existing bank items (resolved from CONTENT.TOPICS at run time).
   ES5. Loaded on index.html and teacher.html before tickets.js. */
window.TICKETS_CONTENT = {
 "version": "2026-10-23",
 "built": "2026-10-23",
 "sets": {
  "E01": [
   "vw2-e01-01",
   "vw2-e01-02",
   "vw2-e01-03",
   "vw2-e01-04",
   "vw2-e01-05"
  ],
  "Q02": [
   "vw2-q02-01",
   "vw2-q02-02",
   "vw2-q02-03",
   "vw2-q02-04",
   "vw2-q02-05",
   "vw2-q02-06",
   "vw2-q02-07",
   "vw2-q02-08"
  ],
  "E02": [
   "vw2-e02-01",
   "vw2-e02-02",
   "vw2-e02-03",
   "vw2-e02-04",
   "vw2-e02-05"
  ],
  "Q03": [
   "vw2-q03-01",
   "vw2-q03-02",
   "vw2-q03-03",
   "vw2-q03-04",
   "vw2-q03-05",
   "vw2-q03-06",
   "vw2-q03-07",
   "vw2-q03-08"
  ],
  "E03": [
   "vw2-e03-01",
   "vw2-e03-02",
   "vw2-e03-03",
   "vw2-e03-04",
   "vw2-e03-05"
  ],
  "Q04": [
   "vw2-q04-01",
   "vw2-q04-02",
   "vw2-q04-03",
   "vw2-q04-04",
   "vw2-q04-05",
   "vw2-q04-06",
   "vw2-q04-07",
   "vw2-q04-08"
  ],
  "E04": [
   "vw2-e04-01",
   "vw2-e04-02",
   "vw2-e04-03",
   "vw2-e04-04",
   "vw2-e04-05"
  ]
 },
 "items": [
  {
   "id": "vw2-e01-01",
   "type": "choose",
   "tag": "kn-triage-mode",
   "level": "A2",
   "stem": "This line graph has years along the bottom. Which mode is it?",
   "options": [
    "COMPARE",
    "TREND",
    "SEQUENCE",
    "SPACE"
   ],
   "answer": 1,
   "why": "A time axis means TREND: things rise, fall or stay the same over the years. Categories with no time would be COMPARE.",
   "hint": "Look at the horizontal axis first. What kind of labels are on it?",
   "chart": "p-line-internet"
  },
  {
   "id": "vw2-e01-02",
   "type": "choose",
   "tag": "kn-triage-mode",
   "level": "A2",
   "stem": "This diagram shows stages with arrows. Which mode is it?",
   "options": [
    "SPACE",
    "TREND",
    "SEQUENCE",
    "COMPARE"
   ],
   "answer": 2,
   "why": "Stages joined by arrows make a process: SEQUENCE mode. The report follows the stages in order, in the present simple.",
   "hint": "Ask the triage questions in order: time axis? categories only? stages? a map?",
   "chart": "p-proc-frog"
  },
  {
   "id": "vw2-e01-03",
   "type": "choose",
   "tag": "kn-test-facts",
   "level": "A2",
   "stem": "How many words must a Task 1 report have, at least?",
   "options": [
    "150",
    "250",
    "100",
    "200"
   ],
   "answer": 0,
   "why": "The rubric says \"Write at least 150 words\". Under 150 costs you; the house target is 160–190 words in 20 minutes.",
   "hint": "The rubric prints the number. It is the smaller of the two Writing minimums."
  },
  {
   "id": "vw2-e01-04",
   "type": "judge",
   "tag": "kn-criteria",
   "level": "B1",
   "given": "Task 1 is a factual report: the examiner does not want your opinion about the data.",
   "stem": "True or false?",
   "answer": 0,
   "why": "True. Task Achievement rewards reporting the main features with figures. Opinions, reasons and conclusions are irrelevant material and cap the score.",
   "hint": "Think about the difference between Task 1 (a report) and Task 2 (an essay). Which one asks what you think?"
  },
  {
   "id": "vw2-e01-05",
   "type": "choose",
   "tag": "kn-triage-units",
   "level": "A2",
   "stem": "Which word names the box that tells you which colour is which series?",
   "options": [
    "axis",
    "unit",
    "category",
    "legend"
   ],
   "answer": 3,
   "why": "The legend (or key) matches colours to series names. The axis is a line with a scale, the unit says what is measured, a category is one item on the chart.",
   "hint": "Three of the words name parts of the data itself. One names the little box that explains the colours.",
   "chart": "p-line-museums"
  },
  {
   "id": "vw2-q02-01",
   "type": "choose",
   "tag": "kn-triage-mode",
   "level": "B1",
   "stem": "This table has years in its columns. Which mode is it?",
   "options": [
    "TREND",
    "COMPARE",
    "SEQUENCE",
    "SPACE"
   ],
   "answer": 0,
   "why": "Years in the columns mean change over time, so a table can be TREND. Read the rows across the years: rose, fell, stayed the same.",
   "hint": "Ignore the shape of the visual. Read the column headings and ask whether they are dates.",
   "chart": "p-table-rice"
  },
  {
   "id": "vw2-q02-02",
   "type": "choose",
   "tag": "kn-triage-mode",
   "level": "B1",
   "stem": "Two pie charts, one for 2000 and one for 2020. Which mode?",
   "options": [
    "SEQUENCE and SPACE",
    "COMPARE only",
    "TREND and COMPARE",
    "SPACE only"
   ],
   "answer": 2,
   "why": "Two pies for two years are both: the slices are compared (COMPARE) and each slice changes between the dates (TREND). Organise the report slice by slice.",
   "hint": "There are two dates and there are categories. Does one mode word cover both facts?",
   "chart": "p-pie-energy"
  },
  {
   "id": "vw2-q02-03",
   "type": "choose",
   "tag": "kn-triage-units",
   "level": "A2",
   "stem": "What is the unit of this bar chart?",
   "options": [
    "per cent",
    "hours per week",
    "thousand people",
    "minutes per day"
   ],
   "answer": 1,
   "why": "The axis says hours per week. Read the unit before you write a single figure; \"21 hours a week\" and \"21%\" are different claims.",
   "hint": "Find the axis label with the measure in it. It is not a percentage.",
   "chart": "p-bar-screentime"
  },
  {
   "id": "vw2-q02-04",
   "type": "choose",
   "tag": "kn-triage-mode",
   "level": "A2",
   "stem": "Two maps of the same town in 2005 and 2025. Which mode?",
   "options": [
    "TREND",
    "SEQUENCE",
    "COMPARE",
    "SPACE"
   ],
   "answer": 3,
   "why": "A map or plan is SPACE mode, even with two dates: you describe what was added, removed or converted, by compass point.",
   "hint": "The two dates are a distraction. What kind of visual is it?",
   "chart": "p-map-thai-town"
  },
  {
   "id": "vw2-q02-05",
   "type": "judge",
   "tag": "kn-test-facts",
   "level": "B1",
   "given": "You have about 20 minutes for Task 1 because Task 2 counts for twice as much of the Writing score.",
   "stem": "True or false?",
   "answer": 0,
   "why": "True. Task 2 contributes twice as much as Task 1, so the official advice is 20 minutes for Task 1 and 40 for Task 2.",
   "hint": "Recall how the 60 minutes of Writing are shared and why the share is unequal."
  },
  {
   "id": "vw2-q02-06",
   "type": "choose",
   "tag": "kn-criteria",
   "level": "B1",
   "stem": "Which criterion checks that you reported the main features and gave an overview?",
   "options": [
    "Coherence and Cohesion",
    "Lexical Resource",
    "Grammatical Range and Accuracy",
    "Task Achievement"
   ],
   "answer": 3,
   "why": "Task Achievement is about doing the task: main features, figures and a clear overview. Coherence is organisation, Lexical Resource is vocabulary, Grammatical Range and Accuracy is grammar.",
   "hint": "Which of the four names contains the word for \"the job you were asked to do\"?"
  },
  {
   "id": "vw2-q02-07",
   "type": "choose",
   "tag": "kn-triage-units",
   "level": "A2",
   "stem": "A chart divided into slices that add up to 100%. What is it called?",
   "options": [
    "a bar chart",
    "a line graph",
    "a pie chart",
    "a table"
   ],
   "answer": 2,
   "why": "A pie chart shows shares of a whole, so the slices add up to 100%. Bars compare amounts, lines show change over time, tables list figures.",
   "hint": "Which chart is round?"
  },
  {
   "id": "vw2-q02-08",
   "type": "choose",
   "tag": "kn-triage-mode",
   "level": "B1",
   "stem": "Flashed chart: coconut sap becomes sugar in six steps. Which mode?",
   "options": [
    "SEQUENCE",
    "TREND",
    "SPACE",
    "COMPARE"
   ],
   "answer": 0,
   "why": "Steps from a raw material to an end product are a process: SEQUENCE. Present simple, mostly passive, with sequencers (first, next, finally).",
   "hint": "Is there a start material and an end product? That tells you the mode.",
   "chart": "p-proc-coconut-sugar"
  },
  {
   "id": "vw2-e02-01",
   "type": "choose",
   "tag": "ta-no-overview",
   "level": "A2",
   "stem": "Which paragraph of the flight plan holds the overview?",
   "options": [
    "P3",
    "P1",
    "P4",
    "P2"
   ],
   "answer": 3,
   "why": "P2 is the overview: \"Overall,\" plus two or three general truths. P1 is the introduction, P3 and P4 are the two detail groups.",
   "hint": "The overview comes straight after the introduction, before any figures."
  },
  {
   "id": "vw2-e02-02",
   "type": "spot",
   "tag": "ta-overview-figures",
   "level": "B1",
   "stem": "Tap the part that must not be in an overview.",
   "words": [
    "Overall,",
    "the Science Museum",
    "gained visitors,",
    "reaching 760,000,",
    "while the other two",
    "declined."
   ],
   "answer": 3,
   "fix": "Delete \"reaching 760,000\" — keep the sentence general.",
   "why": "760,000 is a data value. The overview says what rose and what fell; the figures wait for P3 and P4. Everything else in the sentence is fine.",
   "hint": "Years and names are allowed in P2. Look for a number that measures something.",
   "chart": "p-line-museums"
  },
  {
   "id": "vw2-e02-03",
   "type": "choose",
   "tag": "lr-copied-rubric",
   "level": "B1",
   "stem": "Which S1 intro is a good paraphrase of this task sentence?",
   "options": [
    "The line graph shows the number of visitors (in thousands) to three museums in a European city between 2010 and 2020.",
    "The graph illustrates how many people visited three museums in one European city from 2010 to 2020.",
    "The line graph is about museums and shows some information about them.",
    "This graph talks about three museums in Europe and I will describe it."
   ],
   "answer": 1,
   "why": "Option 2 keeps all five elements (visual, what, where, when, units are in the data) in new words. Option 1 copies the rubric word for word (discounted), option 3 is vague, option 4 uses \"talks about\" and \"I\".",
   "hint": "Count the five elements, then check that no eight words in a row are copied.",
   "chart": "p-line-museums"
  },
  {
   "id": "vw2-e02-04",
   "type": "judge",
   "tag": "ta-overview-figures",
   "level": "B1",
   "given": "Overall, attendance almost doubled over the period.",
   "stem": "Is this allowed in an overview?",
   "answer": 0,
   "why": "Yes. \"Almost doubled\" is a multiple in words, not a data value. It tells the reader the size of the change without a figure.",
   "hint": "Is there a number that measures something here, or only a describing word?"
  },
  {
   "id": "vw2-e02-05",
   "type": "choose",
   "tag": "kn-triage-units",
   "level": "A2",
   "stem": "What do we call the lines a line graph is measured against?",
   "options": [
    "the slices",
    "the stages",
    "the axes",
    "the legend"
   ],
   "answer": 2,
   "why": "A line graph has two axes: the horizontal x-axis (usually years) and the vertical y-axis (the measure and its unit). Slices belong to pies, stages to processes.",
   "hint": "One is horizontal, one is vertical. There are two of them."
  },
  {
   "id": "vw2-q03-01",
   "type": "choose",
   "tag": "gra-pattern",
   "level": "B1",
   "stem": "Complete the S1 frame: \"The bar chart ___ the weekly screen time of four age groups.\"",
   "options": [
    "tells",
    "talks about",
    "compares",
    "is about"
   ],
   "answer": 2,
   "why": "\"Compares\" (or shows / illustrates) is the reporting verb of the S1 frame. \"Tells\", \"talks about\" and \"is about\" are spoken, not report, register.",
   "hint": "Which verb would you find in an academic report rather than in conversation?",
   "chart": "p-bar-screentime"
  },
  {
   "id": "vw2-q03-02",
   "type": "choose",
   "tag": "ta-overview-figures",
   "level": "B1",
   "stem": "Which sentence can go in the overview (P2)?",
   "options": [
    "Overall, Esports grew to 150 members by 2024, while Football barely changed.",
    "Overall, Badminton fell to 40 members in 2020 and then recovered strongly by 2024.",
    "Overall, Esports grew from nothing to the largest club, while Football barely changed.",
    "Overall, Football had around 120 members in every single year."
   ],
   "answer": 2,
   "why": "Option 3 gives two general truths with no data value. The others each carry a figure (150, 40, 120), which belongs in P3 or P4.",
   "hint": "Cover the numbers. Which sentence still works?",
   "chart": "p-line-clubs"
  },
  {
   "id": "vw2-q03-03",
   "type": "choose",
   "tag": "gra-pattern",
   "level": "A2",
   "stem": "Which word starts the S2 overview frame?",
   "options": [
    "Finally,",
    "Overall,",
    "Firstly,",
    "In conclusion,"
   ],
   "answer": 1,
   "why": "\"Overall,\" signals the overview. \"Firstly\" begins a list, \"Finally\" ends one, and \"In conclusion\" belongs to an essay, not a Task 1 report.",
   "hint": "The frame is \"___, [general claim], while [contrast]\"."
  },
  {
   "id": "vw2-q03-04",
   "type": "judge",
   "tag": "lr-copied-rubric",
   "level": "B1",
   "given": "Copying the task sentence word for word into P1 is safe because it is always correct English.",
   "stem": "True or false?",
   "answer": 1,
   "why": "False. Copied rubric is discounted: it does not count as your words or towards the word count, and 10+ copied words in a row are flagged. Paraphrase: shows → illustrates, information → data, between…and → from…to.",
   "hint": "Think about what the examiner does with words that were already on the question paper."
  },
  {
   "id": "vw2-q03-05",
   "type": "choose",
   "tag": "gra-tense",
   "level": "B1",
   "stem": "The graph covers 2016–2024, all past. Complete: \"Esports ___ to 150.\"",
   "options": [
    "has risen",
    "rose",
    "rises",
    "is rising"
   ],
   "answer": 1,
   "why": "Closed time (over): in 2019, last year, between 2016 and 2024 → past simple. A present perfect cannot be pinned to a time that is over, so \"has risen … in 2024\" is wrong; \"rose\" is right.",
   "hint": "Is the time on the chart open (still now) or closed (over)?",
   "chart": "p-line-clubs",
   "source": "postcards-plans:s3l2"
  },
  {
   "id": "vw2-q03-06",
   "type": "choose",
   "tag": "kn-criteria",
   "level": "B1",
   "stem": "A report with no overview cannot score above which band for Task Achievement?",
   "options": [
    "Band 6",
    "Band 4",
    "Band 5",
    "Band 7"
   ],
   "answer": 2,
   "why": "Band 6 says \"a relevant overview is attempted\". Without one, the script fits the Band 5 description, so Task Achievement stops at 5.",
   "hint": "Band 6 is the first band that mentions an overview. So without one you stop just below it."
  },
  {
   "id": "vw2-q03-07",
   "type": "choose",
   "tag": "lr-proportion",
   "level": "A2",
   "stem": "Which phrase goes with a pie chart slice?",
   "options": [
    "the number of",
    "the proportion of",
    "the comparison of",
    "the height of"
   ],
   "answer": 1,
   "why": "Pie slices are shares, so \"the proportion of\" (or the percentage of / the share of) fits. \"The number of\" counts things; \"the stage of\" belongs to a process.",
   "hint": "A slice is a part of 100%. Which phrase means \"part of\"?"
  },
  {
   "id": "vw2-q03-08",
   "type": "choose",
   "tag": "kn-triage-mode",
   "level": "A2",
   "stem": "Flashed chart: a plan of a school campus now and as planned. Which mode?",
   "options": [
    "SPACE",
    "TREND",
    "COMPARE",
    "SEQUENCE"
   ],
   "answer": 0,
   "why": "A plan or map is SPACE mode. \"Now and planned\" means present simple for what is there and future passive (will be built) for the plan.",
   "hint": "What kind of visual is a campus plan?",
   "chart": "p-map-school"
  },
  {
   "id": "vw2-e03-01",
   "type": "choose",
   "tag": "gra-prep-figure",
   "level": "B1",
   "stem": "Choose the preposition: \"The figure for Chinese rose ___ 140 students in 2024.\"",
   "options": [
    "by",
    "at",
    "in",
    "to"
   ],
   "answer": 3,
   "why": "\"Rose to 140\" gives the end point. \"By\" gives the size of the change, \"at\" follows peaked / stood, \"in\" goes with the year.",
   "hint": "Is 140 the end point or the size of the change? Check the chart.",
   "chart": "p-vw2-line-electives"
  },
  {
   "id": "vw2-e03-02",
   "type": "spot",
   "tag": "gra-tense",
   "level": "B1",
   "stem": "Tap the wrong word in this S3 sentence.",
   "words": [
    "The number of students",
    "taking French",
    "fall",
    "steadily",
    "from 70 in 2016",
    "to 30 in 2024."
   ],
   "answer": 2,
   "fix": "\"fall\" → \"fell\": past dates take the past simple.",
   "why": "Use the past simple for finished events in finished time: a whole event, inside a time that is over. 2016 to 2024 is finished time, so \"fell\". The rest of the S3 frame is correct: adverb, from X in Y1, to Y in Y2.",
   "hint": "Look at the years, then at the verb. Do they agree?",
   "chart": "p-vw2-line-electives",
   "source": "postcards-plans:s2l1"
  },
  {
   "id": "vw2-e03-03",
   "type": "spot",
   "tag": "gra-passive",
   "level": "B1",
   "stem": "Tap the wrong part of this trend sentence.",
   "words": [
    "The number of students",
    "taking Chinese",
    "was risen",
    "by 80",
    "between 2016 and 2024."
   ],
   "answer": 2,
   "fix": "\"was risen\" → \"rose\": rise has no object, so it has no passive.",
   "why": "Numbers that just change → active: prices rose, sales fell. Rise and fall never take an object, so they have no passive; \"was risen\" is impossible. And \"by 80\" is an amount, not a doer, so it does not make the verb passive.",
   "hint": "Can anything \"rise something\"? If a verb has no object, it has no passive.",
   "chart": "p-vw2-line-electives",
   "source": "voice-control:t2l3s2"
  },
  {
   "id": "vw2-e03-04",
   "type": "judge",
   "tag": "ta-overview-figures",
   "level": "B1",
   "given": "Overall, around 80% of energy came from fossil fuels.",
   "stem": "Is this allowed in an overview?",
   "answer": 1,
   "why": "No. An approximated value is still a value. \"Around 80%\" belongs in P3; the overview would say \"fossil fuels provided the large majority of energy\".",
   "hint": "Does \"around\" change what kind of word 80% is?"
  },
  {
   "id": "vw2-e03-05",
   "type": "choose",
   "tag": "lr-trend-vocab",
   "level": "A2",
   "stem": "A line that goes up and down many times is said to ___.",
   "options": [
    "peak at",
    "fluctuate",
    "level off",
    "decline sharply"
   ],
   "answer": 1,
   "why": "\"Fluctuate\" means to rise and fall repeatedly. \"Peak\" is the highest point, \"level off\" means to stop changing, \"decline\" means to fall.",
   "hint": "Think of a wavy line, not a line with one direction."
  },
  {
   "id": "vw2-q04-01",
   "type": "choose",
   "tag": "gra-prep-figure",
   "level": "B1",
   "stem": "Share of coal fell from 48% to 18%. Complete: \"Coal fell ___ 30 percentage points.\"",
   "options": [
    "to",
    "by",
    "at",
    "from"
   ],
   "answer": 1,
   "why": "\"By\" gives the size of the change: 48 to 18 is a fall of 30 percentage points. \"To\" would give the end point (fell to 18%).",
   "hint": "30 is not where the line ended. What kind of number is it?",
   "chart": "p-pie-energy"
  },
  {
   "id": "vw2-q04-02",
   "type": "choose",
   "tag": "lr-degree",
   "level": "B1",
   "stem": "Which S4 sentence uses the degree word correctly?",
   "options": [
    "There was a sharply fall in French.",
    "French fell sharp over the period.",
    "There was a sharp fall in French.",
    "There was a fall sharp in French."
   ],
   "answer": 2,
   "why": "S4 is a noun pattern, so the size word is an adjective before the noun: a sharp fall. After a verb it becomes an adverb: fell sharply.",
   "hint": "Is \"fall\" a noun or a verb here? Adjective before a noun, adverb after a verb.",
   "chart": "p-vw2-line-electives"
  },
  {
   "id": "vw2-q04-03",
   "type": "choose",
   "tag": "gra-tense",
   "level": "B1",
   "stem": "A graph runs from 2015 to the present year. \"Since 2015, sales ___ by 40%.\"",
   "options": [
    "rose",
    "were rising",
    "have risen",
    "had risen"
   ],
   "answer": 2,
   "why": "Open time (still now): since 2015, so far, this year → present perfect. The present perfect is a present tense: it uses a past change to say something about right now. \"Since\" marks the start point of a period that is still open.",
   "hint": "Does the period on the chart end in the past, or does it run to now?",
   "source": "postcards-plans:s3l3"
  },
  {
   "id": "vw2-q04-04",
   "type": "choose",
   "tag": "gra-tense",
   "level": "B2",
   "stem": "The graph runs to 2040 with projections. Which verb fits for 2040?",
   "options": [
    "reached",
    "is projected to reach",
    "has reached",
    "will have been reaching"
   ],
   "answer": 1,
   "why": "Future years take a projection form: is projected / expected to reach, will reach, or the semi-modals \"is set to rise\" (almost certain) and \"is due to\" (the schedule says so). Past simple and present perfect are for dates that have already happened.",
   "hint": "Has 2040 happened yet?",
   "chart": "p-line-cities",
   "source": "postcards-plans:s7l3"
  },
  {
   "id": "vw2-q04-05",
   "type": "choose",
   "tag": "lr-number-amount",
   "level": "B1",
   "stem": "Complete: \"In 2024, German had ___ students than French, at 20 and 30.\"",
   "options": [
    "less",
    "fewer",
    "least",
    "lesser"
   ],
   "answer": 1,
   "why": "Count them → fewer. Measure them → less. Students are counted, so \"fewer students\". \"Less\" is for a mass (less time, less money) and for measurements (less than 20 minutes).",
   "hint": "Can you count students one by one?",
   "chart": "p-vw2-line-electives",
   "source": "departure-board:s3l3"
  },
  {
   "id": "vw2-q04-06",
   "type": "choose",
   "tag": "lr-degree",
   "level": "B1",
   "stem": "Complete: \"In 2024, Chinese was ___ higher than French, at 140 and 30.\"",
   "options": [
    "very",
    "far",
    "most",
    "too"
   ],
   "answer": 1,
   "why": "very intensifies a POINT (very high). much and far measure a GAP, which is what a comparative names. So \"far higher\", never \"very higher\". The gap here, 140 against 30, is a large one.",
   "hint": "A comparative names a difference between two things. Which word measures a difference?",
   "chart": "p-vw2-line-electives",
   "source": "departure-board:s4l2"
  },
  {
   "id": "vw2-q04-07",
   "type": "choose",
   "tag": "gra-passive",
   "level": "B2",
   "stem": "Which sentence describes the chart correctly?",
   "options": [
    "The figure for Esports was increased to 150.",
    "The figure for Esports increased to 150.",
    "The figure for Esports was risen to 150.",
    "The figure for Esports was grown to 150."
   ],
   "answer": 1,
   "why": "For changes in numbers, use active trend verbs; use the passive only when someone deliberately made the change. The chart names no decision-maker, so \"increased\". \"Was risen\" and \"was grown\" are impossible: rise and grow have no object here.",
   "hint": "Did somebody decide to make the number 150, or did it just change?",
   "chart": "p-line-clubs",
   "source": "voice-control:t2l3s2"
  },
  {
   "id": "vw2-q04-08",
   "type": "choose",
   "tag": "kn-triage-mode",
   "level": "B1",
   "stem": "Flashed chart: six countries, books borrowed per student in 2023. Which mode?",
   "options": [
    "TREND",
    "SEQUENCE",
    "SPACE",
    "COMPARE"
   ],
   "answer": 3,
   "why": "One year, six categories, no time axis: COMPARE. Use comparatives, superlatives and multiples; no rise or fall verbs.",
   "hint": "Is there a time axis or two dates? If not, it is not TREND.",
   "chart": "p-vw2-bar-books"
  },
  {
   "id": "vw2-e04-01",
   "type": "choose",
   "tag": "lr-compare-vocab",
   "level": "B1",
   "stem": "Finland 24 books, UK 12. Complete: \"Finland's figure was ___ the UK's.\"",
   "options": [
    "twice as high as",
    "twice higher than",
    "twice more than",
    "two times higher as"
   ],
   "answer": 0,
   "why": "Multipliers need the as … as frame, never than. twice, half and three times express a ratio, and only the equative frame can carry a ratio: \"twice as high as\", or the noun version \"twice the figure for the UK\". \"Twice higher than\" is not possible.",
   "hint": "24 is 2 × 12, a ratio. Which frame carries a ratio?",
   "chart": "p-vw2-bar-books",
   "source": "departure-board:s3l2"
  },
  {
   "id": "vw2-e04-02",
   "type": "spot",
   "tag": "gra-article",
   "level": "B1",
   "stem": "Tap the mistake in this sentence.",
   "words": [
    "Finland had",
    "a highest",
    "figure",
    "of the six countries,",
    "at 24 books",
    "per student."
   ],
   "answer": 1,
   "fix": "\"a highest\" → \"the highest\": a superlative names the one winner in a set.",
   "why": "A superlative names the ONE winner in a group, and that is why it needs the. \"A highest figure\" is incoherent: there can only be one maximum. \"Of the six countries\" correctly names the set.",
   "hint": "How many countries can have the highest figure? Which article marks a unique thing?",
   "chart": "p-vw2-bar-books",
   "source": "departure-board:s2l1"
  },
  {
   "id": "vw2-e04-03",
   "type": "choose",
   "tag": "lr-compare-vocab",
   "level": "B2",
   "stem": "Repair: \"The figure for Japan was higher than ___ Thailand, at 18 and 6 respectively.\"",
   "options": [
    "those in",
    "than",
    "it of",
    "that for"
   ],
   "answer": 3,
   "why": "The thing after than must be the SAME TYPE as the thing before it. \"Higher than Thailand\" compares a figure with a country. \"The figure for Japan\" is singular, so the pro-form is \"that\": higher than that for Thailand.",
   "hint": "Say the full sentence: \"the figure for Japan was higher than [what] for Thailand\". Singular or plural?",
   "chart": "p-vw2-bar-books",
   "source": "departure-board:s5l1"
  },
  {
   "id": "vw2-e04-04",
   "type": "judge",
   "tag": "ta-overview-vague",
   "level": "B1",
   "given": "Overall, the six countries borrowed different numbers of books.",
   "stem": "Is this a clear overview?",
   "answer": 1,
   "why": "No. It is true of every bar chart ever drawn and names no main feature. A clear overview says who borrowed most, who borrowed least, and how big the gap was, with no figures.",
   "hint": "Would this sentence tell a reader anything about this particular chart?",
   "chart": "p-vw2-bar-books"
  },
  {
   "id": "vw2-e04-05",
   "type": "choose",
   "tag": "lr-compare-vocab",
   "level": "A2",
   "stem": "In a table, \"the exception\" means the figure that ___.",
   "options": [
    "is the largest",
    "appears in the first row of the table",
    "does not follow the pattern",
    "has no unit"
   ],
   "answer": 2,
   "why": "The exception is the one cell that breaks the pattern of its row or column, such as the smallest café having the highest rating. Reports name it in P4.",
   "hint": "The other three describe a position or a size, not a pattern.",
   "chart": "p-vw2-table-cafes"
  }
 ],
 "prompts": [
  {
   "id": "p-vw2-line-electives",
   "type": "line",
   "mode": "TREND",
   "level": "B1",
   "title": "Students choosing four language electives",
   "units": "students",
   "rubric": "The line graph shows the number of students at one secondary school who chose each of four foreign-language electives between 2016 and 2024.",
   "data": {
    "x": [
     2016,
     2018,
     2020,
     2022,
     2024
    ],
    "series": [
     {
      "name": "Chinese",
      "values": [
       60,
       80,
       100,
       120,
       140
      ]
     },
     {
      "name": "Japanese",
      "values": [
       40,
       55,
       70,
       90,
       110
      ]
     },
     {
      "name": "French",
      "values": [
       70,
       60,
       50,
       40,
       30
      ]
     },
     {
      "name": "German",
      "values": [
       50,
       45,
       35,
       30,
       20
      ]
     }
    ]
   },
   "labels": [
    "Chinese",
    "Japanese",
    "French",
    "German"
   ],
   "keyFeatures": [
    "Chinese and Japanese both rose steadily over the period",
    "French and German both declined",
    "Chinese was the most popular elective in every year",
    "French was the second most popular in 2016 but the second least popular by 2024"
   ],
   "distractorFeatures": [
    "Japanese had 55 students in 2018",
    "Students like Chinese because it is useful",
    "Four languages are shown",
    "German rose in 2022"
   ],
   "groupings": [
    [
     "Chinese",
     "Japanese"
    ],
    [
     "French",
     "German"
    ]
   ],
   "tags": [
    "all-steady",
    "two-up-two-down",
    "vw2"
   ]
  },
  {
   "id": "p-vw2-bar-books",
   "type": "bar",
   "mode": "COMPARE",
   "level": "B1",
   "title": "Library books borrowed per student",
   "units": "books per student per year",
   "rubric": "The bar chart shows the average number of library books borrowed per secondary school student in six countries in 2023.",
   "data": {
    "categories": [
     "Finland",
     "Japan",
     "Korea",
     "UK",
     "Brazil",
     "Thailand"
    ],
    "series": [
     {
      "name": "Books per student",
      "values": [
       24,
       18,
       15,
       12,
       9,
       6
      ]
     }
    ]
   },
   "labels": [
    "Finland",
    "Japan",
    "Korea",
    "UK",
    "Brazil",
    "Thailand"
   ],
   "keyFeatures": [
    "Finland had by far the highest figure, four times that of Thailand",
    "Finland borrowed twice as many books per student as the UK",
    "Japan and Korea formed a middle group",
    "Thailand had the lowest figure, a quarter of Finland's"
   ],
   "distractorFeatures": [
    "Korea borrowed 15 books",
    "Reading is important for students",
    "Six countries are compared",
    "Brazil borrowed more than the UK"
   ],
   "groupings": [
    [
     "Finland",
     "Japan",
     "Korea"
    ],
    [
     "UK",
     "Brazil",
     "Thailand"
    ]
   ],
   "tags": [
    "single-series",
    "ranked",
    "vw2"
   ]
  },
  {
   "id": "p-vw2-table-cafes",
   "type": "table",
   "mode": "COMPARE",
   "level": "B1",
   "title": "Four cafés in one shopping street",
   "units": "various",
   "rubric": "The table gives information about four cafés on one shopping street in Bangkok in 2024.",
   "data": {
    "cols": [
     "Café",
     "Price of a coffee (baht)",
     "Seats",
     "Customers per day",
     "Customer rating (out of 5)"
    ],
    "rows": [
     [
      "Bean Bar",
      65,
      40,
      320,
      4.1
     ],
     [
      "Riverside Café",
      95,
      60,
      410,
      4.3
     ],
     [
      "Corner Cup",
      55,
      20,
      150,
      4.7
     ],
     [
      "Mall Espresso",
      85,
      80,
      520,
      3.9
     ]
    ]
   },
   "labels": [
    "Bean Bar",
    "Riverside Café",
    "Corner Cup",
    "Mall Espresso"
   ],
   "keyFeatures": [
    "Mall Espresso was the largest and busiest café but had the lowest rating",
    "Corner Cup was the smallest and cheapest yet had the highest rating (the exception)",
    "Riverside Café charged the most for a coffee",
    "More seats generally meant more customers per day"
   ],
   "distractorFeatures": [
    "Bean Bar had 40 seats",
    "Corner Cup is the best café",
    "Four cafés are compared",
    "Riverside Café was the busiest"
   ],
   "groupings": [
    [
     "Mall Espresso",
     "Riverside Café"
    ],
    [
     "Bean Bar",
     "Corner Cup"
    ]
   ],
   "tags": [
    "static",
    "multi-column",
    "exception",
    "vw2"
   ]
  }
 ],
 "teams": [
  {
   "team": "Team 1",
   "members": [
    "Donut",
    "Lookchin",
    "Baiplu",
    "Sun",
    "Mint"
   ]
  },
  {
   "team": "Team 2",
   "members": [
    "Proud",
    "Airin",
    "Oly",
    "Noyny",
    "Ob-oon"
   ]
  },
  {
   "team": "Team 3",
   "members": [
    "Pasta",
    "Premier",
    "Nicha",
    "Nene",
    "Punnee"
   ]
  },
  {
   "team": "Team 4",
   "members": [
    "Vernier",
    "Rak",
    "Min",
    "Panghom",
    "Carrot"
   ]
  },
  {
   "team": "Team 5",
   "members": [
    "Chicha",
    "Wongree",
    "Moquette",
    "Pin",
    "Lilil"
   ]
  },
  {
   "team": "Team 6",
   "members": [
    "Thinn",
    "Ren",
    "Khaofang",
    "Gam",
    "Mon"
   ]
  }
 ]
};
