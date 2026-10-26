/* QUILLMOOR · THE OBSERVATORY — topic-15.js · Module 15 Comparing  (The Grammar Wing, WS-J Oct 2026)
   Imported from T.Chris's "Departure Board" app (comparatives & superlatives):
   Gate 2 (Booking Desk), Gate 3 (Price Comparison), Gate 4 (Timetable) and
   Gate 8 Lesson 3 (Writing the comparison paragraph). Rule wording and lesson
   names are the app's; items are re-set in chart contexts where that was cheap
   (the Observatory's own prompts, or an inline table with original figures).
   Every item carries `src` = the Departure Board item it came from. */
(function () {
  var T = window.CONTENT.TOPICS;
  T.push({
    id: 'm15', n: 15, code: 'Module 15', name: 'Comparing', art: 'lexicon', cefr: 'B1–B2', wing: 'grammar',
    source: { app: 'Departure Board', id: 'departure-board' },
    blurb: 'Superlatives, as … as, twice as much, less and fewer, and the slot that says how much.',
    levels: [{
      id: 'm15l1', n: 1, name: 'Comparing', cefr: 'B1–B2', blurb: 'The grammar every COMPARE paragraph runs on.',
      subs: [
        /* ------------------------------------------------------------ s1 · Gate 2 */
        { id: 'm15s1', name: 'the + -est / most, and naming the group', cefr: 'B1',
          theory: {
            key: 'A superlative names the ONE winner in a group — and that is why it needs the. It says nothing until you say WHICH GROUP it wins in.',
            body: [
              '<p>A comparative puts one thing against one other. A superlative puts one thing against a whole <strong>set</strong> and says it is the maximum. Because there can only be one maximum, the thing is unique — and <em>the</em> is exactly how English marks a unique thing. So <em>the</em> is not decoration; it is the meaning. <em>*a cheapest hotel</em> is not just unusual, it is incoherent.</p>',
              '<p>The form follows the same rule as the comparative: single-piece words take <em>-est</em>, derived words take <em>most</em>. <em>the highest, the lowest, the busiest</em> / <em>the most popular, the most expensive</em>. One thing can replace <em>the</em> — a possessive, because it already makes the noun definite: <em>Japan\'s busiest station</em>, <em>the chart\'s largest category</em>.</p>',
              '<p>"The busiest airport" — busiest where? English names the group three ways, and the choice is not free. <strong>in</strong> for places and organisations: <em>the busiest airport <u>in</u> Asia</em>. <strong>of</strong> for groups of things and periods of time: <em>the largest <u>of</u> the six categories</em>, <em>the worst year <u>of</u> the decade</em>. <strong>A relative clause</strong>, very often with the present perfect: <em>the worst delay I <u>have ever</u> seen</em>.</p>',
              '<p>Two patterns cause most of the errors here. <em>one of the</em> selects a member from a plural set, so the noun must be <strong>plural</strong>: <em>one of the largest producer<u>s</u></em>. And ordinals stack in front: <em>the second largest</em>, <em>the third most popular</em>. In a Task 1 report the set is nearly always the chart itself: <em>of the five countries</em>, <em>of the three museums</em>, <em>in the 13–17 group</em>.</p>'
            ],
            simple: [
              '<p>Two things → comparative (<em>higher</em>). Three or more → superlative (<em>the highest</em>).</p>',
              '<p>Always use <strong>the</strong> before a superlative. <em>the highest figure</em>, not <em>a highest figure</em>. Short word → <em>-est</em>. Long or built word → <em>most</em>.</p>',
              '<p>Say which group: <em>of the five countries</em>, <em>in Asia</em>. Places → <strong>in</strong>. Groups and time periods → <strong>of</strong>.</p>',
              '<p><em>One of the largest producer<strong>s</strong></em> — always plural after <em>one of the</em>. You can count down: <em>the second largest</em>.</p>'
            ],
            examples: [
              { s: 'Germany had <strong>the highest</strong> starting salary of the five countries.', g: 'ONE WINNER OUT OF MANY — AND THE SET IS NAMED WITH "OF"' },
              { s: 'Thailand is one of the largest rice producer<strong>s</strong> in Asia.', g: '"ONE OF THE" + PLURAL, THEN "IN" FOR A PLACE' },
              { s: '<s>Savings was a smallest share.</s> → Savings was <strong>the</strong> smallest share.', g: 'A SUPERLATIVE MARKS A UNIQUE WINNER — "A" CANNOT DO THAT JOB' }
            ]
          },
          items: [
            { id: 'm15s1q1', type: 'spot', tag: 'gra-article', level: 'B1', chart: 'p-table-salaries', src: 'departure-board:s2l1-01',
              stem: 'Tap the word that is wrong.',
              words: ['Thailand', 'had', 'a', 'lowest', 'starting', 'salary', 'of', 'the', 'five', 'countries.'],
              answer: 2, fix: 'the',
              hint: 'A superlative picks one unique winner from its set. Which article marks something unique?',
              why: 'A superlative picks the unique maximum (or minimum), and uniqueness is what <em>the</em> encodes. <em>A</em> cannot do that job.' },
            { id: 'm15s1q2', type: 'choose', tag: 'lr-compare-vocab', level: 'B1', chart: 'p-table-salaries', src: 'departure-board:s2l1-02',
              stem: 'Complete: "Germany had ___ starting salary of the five."',
              options: ['the higher', 'a highest', 'the highest', 'most highest'],
              answer: 2,
              hint: 'Five countries make a set, not a pair. Which form names the winner of a whole set, and what goes in front of it?',
              why: 'Five options means a set, so a superlative — and a superlative takes <em>the</em>. <em>Higher</em> only compares two things, and <em>most highest</em> marks the form twice.' },
            { id: 'm15s1q3', type: 'gap', tag: 'gra-article', level: 'B1', chart: 'p-bar-screentime', src: 'departure-board:s2l1-03',
              lines: [
                { who: 'Mai', text: 'Four age groups, and the examiner wants the extreme first.' },
                { who: 'Pim', text: 'Easy. The 13–17 group spent ___ time on social media of all four.' }
              ],
              options: ['more', 'the most', 'most', 'a most'],
              answer: 1,
              hint: '"Of all four" names a set. Check both the form and the little word in front of it.',
              why: '<em>Of all four</em> names a set, so a superlative with <em>the</em>: 21 hours against 18, 11 and 6. Dropping <em>the</em> is only possible in a special case this lesson does not need.' },
            { id: 'm15s1q4', type: 'equiv', tag: 'lr-compare-vocab', level: 'B1', chart: 'p-line-museums', src: 'departure-board:s2l1-04',
              given: 'The Science Museum was the most visited of the three in 2020.',
              stem: 'Is the Science Museum the only museum being considered?',
              options: ['Yes — a superlative always means there is only one.', 'Yes, because "the" means only one.', 'We cannot tell from the sentence.', 'No — it is compared with the other museums.'],
              answer: 3,
              hint: 'A superlative needs rivals. Ask what "the" is marking: the winner, or the size of the group?',
              why: 'This is the point of a superlative: it needs a set of rivals. <em>The</em> marks the winner as unique, not the group as empty — 760,000 visitors against 520,000 and 260,000.' },
            { id: 'm15s1q5', type: 'build', tag: 'gra-pattern', level: 'B1', chart: 'p-table-salaries', src: 'departure-board:s2l1-05',
              stem: 'Five countries; Germany paid the most at both career stages. Say so in one sentence.',
              tiles: ['Germany', 'had', 'the', 'highest', 'salaries', 'of', 'the', 'five', 'countries.'],
              solution: 'Germany had the highest salaries of the five countries.',
              hint: 'Article, then the superlative, then the word that introduces a group of things.',
              why: '<em>The</em> + <em>-est</em> for a single-piece word, then <em>of</em> because the set is a group of things, not a place.' },
            { id: 'm15s1q6', type: 'spot', tag: 'gra-plural', level: 'B1', chart: 'p-table-rice', src: 'departure-board:s2l2-01',
              stem: 'Tap the word that is wrong.',
              words: ['India', 'was', 'one', 'of', 'the', 'biggest', 'rice', 'producer', 'in', 'the table.'],
              answer: 7, fix: 'producers',
              hint: '"One of the" picks a member out of a group. How many members does a group have?',
              why: '<em>One of the</em> picks a member out of a plural group, so the noun must be plural.' },
            { id: 'm15s1q7', type: 'choose', tag: 'gra-pattern', level: 'B1', chart: 'p-pie-budget', src: 'departure-board:s2l2-02',
              stem: 'Which preposition fits? "Savings was the smallest share ___ the six categories."',
              options: ['in', 'of', 'at', 'from'],
              answer: 1,
              hint: 'Is "the six categories" a place, or a group of things? The set decides the preposition.',
              why: 'A group of things takes <em>of</em>. <em>In</em> is for places and organisations: <em>the busiest airport in Asia</em>. Savings, at 4%, is indeed the smallest of the six.' }
          ] },

        /* ------------------------------------------------------------ s2 · Gate 3 */
        { id: 'm15s2', name: 'as … as, twice as much, less and fewer', cefr: 'B1–B2',
          theory: {
            key: '"as high as" means AT LEAST as high. Multipliers need the as … as frame, never than. Count them → fewer; measure them → less.',
            body: [
              '<p>Everyone is taught that <em>as cheap as</em> means "the same price". It does not. It means <strong>at least as cheap as</strong>. That is why this is not a contradiction: <em>Streaming was as popular with the 18–29 group as with teenagers — more popular, actually.</em> The "exactly equal" reading is a guess the listener makes, and a guess can be cancelled. The frame is fixed: <strong>as + adjective + as</strong>. Crossing it is the classic slip — <em>*as high than</em>, <em>*higher as</em>. Under a negative, <em>so</em> becomes possible and sounds more formal: <em>not so crowded as it used to be</em>.</p>',
              '<p><em>twice</em>, <em>half</em>, <em>three times</em> and <em>a third</em> all express a <strong>ratio</strong> — and only the equative frame can carry a ratio. So: <em>twice <u>as</u> high <u>as</u></em>, not <em>*twice higher than</em>. You will hear <em>three times longer than</em> in speech, but it is genuinely ambiguous: three times the length, or four? In a report, use <em>three times as many as</em> or <em>three times the number of</em>. The other precise pattern is a plain noun phrase: <em>twice the price of</em>, <em>half the share of</em>.</p>',
              '<p>Going down the scale, English splits by countability where going up does not. <em>More</em> covers everything; <em>fewer</em> and <em>less</em> divide the work. <strong>fewer</strong> + countable: <em>fewer visitors, fewer countries, fewer categories</em>. <strong>less</strong> + uncountable: <em>less traffic, less money, less interest</em>. Now the exception that even strict editors keep: <strong>measurements take <em>less</em></strong>, even when the noun is countable, because a measurement is an amount rather than a count: <em>less than 20 minutes</em>, <em>less than 5 km</em>, <em>less than $30</em>. The superlatives are <em>the least</em> and <em>the fewest</em>.</p>'
            ],
            simple: [
              '<p><em>as high as</em> = at least as high. Maybe higher. The frame never changes: <strong>as + word + as</strong>. <em>as high than</em> ✗ &nbsp; <em>higher as</em> ✗</p>',
              '<p>Ratio words (<em>twice, half, three times</em>) need <strong>as … as</strong>: <em>twice as much as</em> ✓ &nbsp; <em>twice more than</em> ✗. Or use a noun: <em>twice the number of</em>.</p>',
              '<p>Can you count them? → <strong>fewer</strong> (<em>fewer visitors</em>). Is it a mass? → <strong>less</strong> (<em>less money</em>). Money, time, distance → always <strong>less</strong>: <em>less than 20 minutes</em>.</p>'
            ],
            examples: [
              { s: 'Streaming was <strong>as popular as</strong> social media among the over-50s — more popular, in fact.', g: 'NOT A CONTRADICTION: THE EQUATIVE SETS A FLOOR' },
              { s: 'The taxi cost <strong>twice as much as</strong> the airport bus.', g: 'RATIO → EQUATIVE FRAME, NEVER "THAN"' },
              { s: 'There were <strong>fewer</strong> visitors and <strong>less</strong> interest in 2020.', g: 'COUNT / MASS IN ONE SENTENCE' }
            ]
          },
          items: [
            { id: 'm15s2q1', type: 'judge', tag: 'lr-compare-vocab', level: 'B2', chart: 'p-bar-screentime', src: 'departure-board:s3l1-01',
              given: 'Streaming video was as popular with the 18–29 group as with teenagers — more popular, in fact.',
              stem: 'Has the writer contradicted herself?',
              answer: 1,
              hint: 'Decide what "as … as" promises: an equals sign, or a floor that can be raised?',
              why: 'No. <em>As popular as</em> means "at least as popular", so adding "more popular" refines the claim rather than reversing it: 15 hours against 14.' },
            { id: 'm15s2q2', type: 'spot', tag: 'gra-pattern', level: 'B1', chart: 'p-bar-screentime', src: 'departure-board:s3l1-02',
              stem: 'Tap the word that is wrong.',
              words: ['Gaming', 'was', 'almost', 'as', 'popular', 'than', 'streaming', 'among', 'teenagers.'],
              answer: 5, fix: 'as',
              hint: 'The equative frame has two halves that match. Which word belongs only with -er and more?',
              why: 'The equative frame is <em>as … as</em>. <em>Than</em> belongs only with <em>-er</em> and <em>more</em>. (12 hours against 14 — "almost as popular" is true of the chart.)' },
            { id: 'm15s2q3', type: 'gap', tag: 'gra-pattern', level: 'B1', chart: 'p-bar-screentime', src: 'departure-board:s3l1-03',
              lines: [
                { who: 'Ploy', text: 'Is the 50+ group still the smallest for gaming?' },
                { who: 'Jun', text: 'Yes. Gaming was ___ among the over-50s as among teenagers.' }
              ],
              options: ['not nearly as common', 'not nearly so common than', 'not common as', 'no common as'],
              answer: 0,
              hint: 'A negative equative keeps the frame whole. Check that both halves of the frame are there and match.',
              why: 'Negative equative: <em>not as … as</em>. (<em>Not so common as</em> is also correct and sounds more formal; <em>than</em> never belongs in the frame.) One hour against twelve.' },
            { id: 'm15s2q4', type: 'equiv', tag: 'lr-compare-vocab', level: 'B2', chart: 'p-table-salaries', src: 'departure-board:s3l1-04',
              given: 'Thai teachers did not earn as much as Korean teachers.',
              stem: 'Which sentence means the same?',
              options: ['Thai and Korean teachers earned the same.', 'Korean teachers earned more than Thai teachers.', 'Thai teachers earned slightly more than Korean teachers.', 'Nobody knows which group earned more.'],
              answer: 1,
              hint: 'A negated equative points in one direction. Work out which side is below the floor.',
              why: 'A negated equative reverses the direction: <em>not as much as X</em> = less than X. In the table, $9,000 against $33,000.' },
            { id: 'm15s2q5', type: 'choose', tag: 'gra-pattern', level: 'B1', src: 'departure-board:s3l2-02',
              table: { cols: ['Transport', 'Fare (baht)', 'Time'], rows: [['Airport train', '45', '26 min'], ['Taxi', '450', '55 min'], ['Airport bus', '90', '70 min']] },
              stem: 'Complete: "The airport bus cost ___ the train."',
              options: ['twice more than', 'twice as much as', 'two times more as', 'twice than'],
              answer: 1,
              hint: '90 against 45 is a ratio. Only one frame can carry a ratio — which one?',
              why: '฿90 is exactly double ฿45 — a ratio, so the equative frame. <em>Twice more than</em> is the classic slip.' },
            { id: 'm15s2q6', type: 'choose', tag: 'lr-number-amount', level: 'B2', chart: 'p-line-museums', src: 'departure-board:s3l3-03',
              stem: 'Which pair is correct? "By 2020 there were ___ visitors to the History Museum and ___ interest in its exhibitions."',
              options: ['less / less', 'less / fewer', 'fewer / fewer', 'fewer / less'],
              answer: 3,
              hint: 'Ask of each noun: can you count it, or is it a mass?',
              why: 'Visitors are counted (<em>fewer</em>); interest is a mass (<em>less</em>). The History Museum fell from 380,000 to 260,000.' },
            { id: 'm15s2q7', type: 'sort', tag: 'lr-number-amount', level: 'B2', src: 'departure-board:s3l3-08',
              stem: 'Six nouns from Task 1 reports. Which word goes in front of each?',
              bins: [{ key: 'fewer', label: 'fewer', hint: 'you can count them' }, { key: 'less', label: 'less', hint: 'a mass or an amount' }],
              items: [{ text: 'visitors', bin: 'fewer' }, { text: 'countries', bin: 'fewer' }, { text: 'categories', bin: 'fewer' }, { text: 'traffic', bin: 'less' }, { text: 'money', bin: 'less' }, { text: 'than 20 minutes', bin: 'less' }],
              hint: 'One card looks countable but is a measured amount. Money, time and distance behave as amounts.',
              why: 'The last one is the trap. Minutes look countable, but a stretch of time is a measured <em>amount</em>, so it takes <em>less</em> — as do money and distance.' }
          ] },

        /* ------------------------------------------------------------ s3 · Gate 4 */
        { id: 'm15s3', name: 'How much more? The differential slot', cefr: 'B2',
          theory: {
            key: 'In front of every comparative there is a slot for the size of the gap. Fill it. very intensifies a POINT; much and far measure a GAP.',
            body: [
              '<p><em>The Science Museum was busier.</em> Busier by a thousand visitors, or by half a million? A bare comparative carries almost no information, and filling the slot in front of it is the single fastest upgrade from B2 to C1 writing. Four kinds of filler: <strong>a measure phrase</strong> — <em>15 hours higher</em>, <em>$18,000 more</em>, <em>two stops further</em>; <strong>a large vague degree</strong> — <em>much, far, a lot, considerably, substantially, significantly</em>; <strong>a small vague degree</strong> — <em>slightly, a little, marginally, somewhat</em>; <strong>zero</strong> — <em>no higher than</em>, <em>not any cheaper</em>. The order is fixed: the differential always comes <u>first</u>, before the adjective. <em>15 hours higher</em>, never <em>*higher 15 hours</em>.</p>',
              '<p><em>very</em> intensifies a <strong>position</strong> on a scale: <em>very high</em> = far along the scale. A comparative does not name a position. It names a <strong>difference</strong> between two positions — and a difference is measured, not intensified. So it takes <em>much, far, a lot, considerably</em>. <em>very high</em> ✓ &nbsp; <em>*very higher</em> ✗ &nbsp; <em>much higher</em> ✓ &nbsp; <em>*much high</em> ✗. One apparent exception proves the rule: <em>the very highest figure</em> is fine, but there <em>very</em> means <strong>precisely that one</strong>, not "to a high degree".</p>',
              '<p>Superlatives have their own intensifier family in the same slot: <em>by far the largest</em>, <em>easily the cheapest</em>, <em>comfortably the best</em>. And <em>no + comparative</em> means "equal or worse", with a hint of disappointment: <em>no busier than before</em>. In a Task 1 report the rule is simple: a figure beats a graded adverb, and a graded adverb beats a bare comparative. <em>Rail journeys rose by 41% while car journeys fell by 6%</em> says more than <em>rail travel got better</em>.</p>'
            ],
            simple: [
              '<p>Always say <strong>how much</strong>: <em>15 hours higher</em>, <em>$18,000 more</em>. Big gap: <em>much, far, considerably</em>. Small gap: <em>slightly, a little, marginally</em>. No gap: <em>no higher</em>. The amount goes <strong>before</strong> the adjective.</p>',
              '<p><em>very</em> + normal adjective: <em>very high</em>. <em>much / far</em> + comparative: <em>much higher</em>. Never <em>very higher</em>. Never <em>much high</em>.</p>',
              '<p>With superlatives: <em>by far the largest</em>, <em>easily the smallest</em>. In a report, a number beats a vague word: <em>rose by 41%</em> beats <em>rose a lot</em>.</p>'
            ],
            examples: [
              { s: 'Teenagers spent <strong>15 hours</strong> more a week on social media than the over-50s.', g: 'A MEASURE PHRASE — A CHECKABLE CLAIM' },
              { s: 'Social media use was <strong>very</strong> high among teenagers and <strong>far</strong> higher than among adults.', g: 'POINT, THEN GAP' },
              { s: 'Food and drinks was <strong>by far</strong> the largest category.', g: 'SUPERLATIVE INTENSIFIER' }
            ]
          },
          items: [
            { id: 'm15s3q1', type: 'spot', tag: 'gra-pattern', level: 'B2', chart: 'p-bar-screentime', src: 'departure-board:s4l1-01',
              stem: 'Tap the chunk that is in the wrong position.',
              words: ['Social media use', 'was', 'higher', '15 hours', 'among teenagers', 'than', 'among the over-50s.'],
              answer: 2, fix: '15 hours higher',
              hint: 'The size of the gap and the comparative sit next to each other, in a fixed order. Which comes first?',
              why: 'The differential always precedes the comparative: <em>15 hours higher among teenagers than among the over-50s</em> (21 against 6).' },
            { id: 'm15s3q2', type: 'choose', tag: 'lr-degree', level: 'B2', chart: 'p-table-salaries', src: 'departure-board:s4l1-02',
              stem: 'Complete: "German teachers started on ___ than Americans."',
              options: ['$18,000 more', 'much more', 'slightly more', 'no more'],
              answer: 0,
              hint: 'You have both starting salaries. When the table gives you the figure, which kind of filler does a report prefer?',
              why: '$62,000 against $44,000: the gap is exactly $18,000, so use the measure phrase, not a vague one. The figure is what the examiner can check.' },
            { id: 'm15s3q3', type: 'gap', tag: 'lr-degree', level: 'B2', chart: 'p-bar-screentime', src: 'departure-board:s4l1-03',
              lines: [
                { who: 'Ben', text: 'Streaming: 14 hours a week for teenagers, 13 for the over-50s.' },
                { who: 'Pim', text: 'So teenagers streamed ___ more — about an hour a week.' }
              ],
              options: ['much', 'far', 'a little', 'considerably'],
              answer: 2,
              hint: 'An hour out of fourteen is a tiny gap. Match the size of the word to the size of the gap.',
              why: 'A one-hour gap is small, so the filler must be a small-degree one. <em>Much</em> or <em>far</em> would misrepresent the data.' },
            { id: 'm15s3q9', type: 'order', tag: 'lr-degree', level: 'B2', src: 'ws-j:new (departure-board:s4l1-04)',
              stem: 'No figure to hand. Order these from the SMALLEST gap to the LARGEST.',
              items: ['no higher than', 'slightly higher than', 'far higher than'],
              hint: 'Without a figure, the word in front of the comparative is all the reader has. Ask of each one: how big a gap does it promise?',
              why: 'The vague fillers have three sizes: <em>no</em> + comparative means no gap at all (equal or lower), <em>slightly</em> is a small gap, and <em>far</em> is a large one. When you do have the figure, a measure phrase beats all three.' },
            { id: 'm15s3q5', type: 'choose', tag: 'ta-no-data', level: 'B2', chart: 'p-line-museums', src: 'departure-board:s4l1-06',
              stem: 'Which sentence would score highest in a Task 1 report on this chart?',
              options: ['Science Museum visits got better.', 'The Science Museum was much more popular than the Art Gallery and the History Museum.', 'Science Museum visits rose considerably while Art Gallery visits fell.', 'Science Museum visits rose by 340,000 while Art Gallery visits fell by 90,000.'],
              answer: 3,
              hint: 'Rank the four by how much a reader could check against the chart.',
              why: 'The differential slot is where the data lives. A figure beats a graded adverb, and a graded adverb beats a bare comparative. 420 → 760 thousand and 610 → 520 thousand.' },
            { id: 'm15s3q6', type: 'spot', tag: 'lr-degree', level: 'B2', chart: 'p-bar-screentime', src: 'departure-board:s4l2-01',
              stem: 'Tap the word that is wrong.',
              words: ['Gaming', 'was', 'very', 'more', 'popular', 'among', 'teenagers', 'than', 'among adults.'],
              answer: 2, fix: 'far / much',
              hint: 'One word intensifies a point on a scale; a comparative names a gap. Gaps are measured, not intensified.',
              why: '<em>Very</em> intensifies a point on a scale; a comparative names a gap, and gaps take <em>much</em> or <em>far</em>: 12 hours against 3 and 1.' },
            { id: 'm15s3q7', type: 'judge', tag: 'lr-degree', level: 'B2', chart: 'p-pie-budget', src: 'departure-board:s4l3-04',
              given: 'Food and drinks was by far the largest category, at 38%.',
              stem: 'Does "by far" fit these figures?',
              answer: 0,
              hint: '"By far" claims a wide gap in front of a superlative. Compare the top share with the next one down.',
              why: 'Yes — <em>by far</em> is a superlative intensifier, and 38% against the next share of 22% is a wide enough gap to earn it.' },
            /* Gate 8 Lesson 3 (the comparison paragraph): the one rule from it that Task 1 cannot do without */
            { id: 'm15s3q8', type: 'choose', tag: 'lr-proportion', level: 'C1', src: 'departure-board:s8l3-01',
              stem: 'A share of journeys rose from 20% to 30%. Which description is correct?',
              options: ['It rose by ten percent.', 'It rose by 50 percentage points.', 'It rose by ten percentage points — a 50% increase.', 'It rose by 30 percent.'],
              answer: 2,
              hint: 'Two different questions: how wide is the gap between the two figures, and how big is that gap compared with where you started?',
              why: 'Count the gap between the two figures: 30 − 20 = ten <strong>percentage points</strong>. Then ask how big that gap is compared with the start: ten out of twenty is half again, so a <strong>50% increase</strong>. Two questions, two answers.' }
          ] },
      ],
      check: { id: 'm15ck', name: 'The examiner\'s gate', items: [
        { id: 'm15ckq1', type: 'spot', tag: 'gra-article', level: 'B1', chart: 'p-table-rice', src: 'departure-board:s2ch-1',
          stem: 'Tap the word that is wrong.',
          words: ['Thailand', 'had', 'a', 'lowest', 'production', 'of', 'the', 'four', 'in 2020.'],
          answer: 2, fix: 'the',
          hint: 'A superlative names one unique winner. Check its article.',
          why: 'A superlative marks a unique winner, and <em>the</em> is what encodes uniqueness. Thailand, at 30 million tonnes, was lowest in 2020.' },
        { id: 'm15ckq2', type: 'choose', tag: 'gra-pattern', level: 'B1', src: 'departure-board:s3ch-3',
          stem: 'The taxi cost ฿450 and the airport train ฿45. Complete: "The taxi cost ___ the train."',
          options: ['ten times more than', 'ten times as much as', 'ten times than', 'ten times as much than'],
          answer: 1,
          hint: 'A multiplier expresses a ratio. Only one frame carries a ratio, and both halves of it must match.',
          why: 'A multiplier expresses a ratio, and only the equative frame carries a ratio: <em>as much as</em>, with no <em>than</em> anywhere.' },
        { id: 'm15ckq3', type: 'choose', tag: 'lr-degree', level: 'B2', chart: 'p-table-salaries', src: 'departure-board:s4ch-2',
          stem: 'Which claim matches the data most precisely?',
          options: ['Japanese teachers worked much longer hours than German teachers did.', 'Japanese teachers worked slightly longer hours than Germans.', 'Japanese teachers worked 14 hours a week longer than Germans.', 'Japanese teachers worked no longer hours than Germans.'],
          answer: 2,
          hint: 'Read the hours column for both countries before you judge the size of the gap.',
          why: '54 hours against 40. When you have the figure, use the figure: the measure phrase is the claim an examiner can check.' },
        { id: 'm15ckq4', type: 'equiv', tag: 'lr-degree', level: 'B2', chart: 'p-line-museums', src: 'departure-board:s4ch-5',
          given: 'In 2020 the History Museum was no busier than it had been in 2018.',
          stem: 'What does "no busier" imply?',
          options: ['Visits rose a little between the two years.', 'Equal or lower — and a rise was perhaps expected.', 'Visits were much higher in 2020.', 'The writer cannot say anything about 2018 from the chart.'],
          answer: 1,
          hint: '"No + comparative" rules out one direction and carries an attitude. "Not busier" would be the neutral version.',
          why: '<em>No + comparative</em> means "equal or worse" and carries disappointment; <em>not busier</em> would be neutral. The chart shows 300,000 falling to 260,000.' },
        { id: 'm15ckq5', type: 'choose', tag: 'lr-degree', level: 'B2', src: 'departure-board:s4l2-02',
          stem: 'Which pair is correct?',
          options: ['very crowded / much more crowded', 'much crowded / much more crowded', 'very crowded / very more crowded', 'much crowded / very more crowded'],
          answer: 0,
          hint: 'Each modifier has exactly one home: one lives with the plain adjective, the other with the comparative.',
          why: 'Plain adjective takes <em>very</em>; comparative takes <em>much</em>. Each modifier has exactly one home.' },
        { id: 'm15ckq6', type: 'gap', tag: 'lr-compare-vocab', level: 'B1', chart: 'p-line-museums', src: 'departure-board:s3ch-7',
          lines: [
            { who: 'Mai', text: 'In 2020 the Science Museum had 760,000 visitors; the History Museum had 260,000.' },
            { who: 'Ben', text: 'So the Science Museum had almost ___ the History Museum.' }
          ],
          options: ['three times as many visitors as', 'three times more visitors than it', 'three times visitors than', 'the most visitors of'],
          answer: 0,
          hint: '760 against 260 is a ratio. Ratios need the frame that avoids the 3× / 4× ambiguity.',
          why: 'An exact ratio (2.9), so the equative frame — and it removes the "three times or four times?" ambiguity that <em>three times more than</em> carries.' },
        { id: 'm15ckq7', type: 'build', tag: 'gra-pattern', level: 'B2', chart: 'p-table-salaries', src: 'departure-board:s4ch-7',
          stem: 'Germany 40 hours a week, Japan 54. Make a claim a reader could check against the table.',
          tiles: ['German', 'teachers', 'worked', '14', 'hours', 'a', 'week', 'less', 'than', 'Japanese', 'teachers.'],
          solution: 'German teachers worked 14 hours a week less than Japanese teachers.',
          hint: 'Subject, verb, then the measured gap in front of the comparative word, then the standard.',
          why: 'Differential, comparative, <em>than</em>, standard. All four slots filled — and <em>less</em>, because hours here are a measured amount.' },
        { id: 'm15ckq8', type: 'pick', tag: 'ta-no-data', level: 'B2', chart: 'p-table-salaries', src: 'departure-board:s3ch-9',
          shop: 'Four claims about the salary table',
          stem: 'Which claim fills the differential slot with something a reader could check?',
          items: [
            { name: 'Germany paid much more than Thailand.', price: '', note: '' },
            { name: 'Germany paid $53,000 more than Thailand at the start.', price: '', note: '' },
            { name: 'Germany paid far more than everyone else.', price: '', note: '' },
            { name: 'Thailand paid a bit less than the others.', price: '', note: '' }
          ],
          answer: 1,
          hint: 'The slot in front of a comparative can hold a vague word or a measure. Which one lets a reader open the table and check?',
          why: '$62,000 against $9,000 is a gap of $53,000. A measure phrase makes a claim the examiner can verify; <em>much</em>, <em>far</em> and <em>a bit</em> only gesture at it.' }
      ] }
    }]
  });
})();
