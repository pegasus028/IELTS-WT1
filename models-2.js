/* ===========================================================================
   CHART CONTROL — models-2.js
   Band 8+ model answers for every prompt in prompts.js, prompts-2.js and
   prompts-3.js that has no model in models.js (one model per prompt).
   Same shape as models.js; patterns are S1–S8 (sentence patterns), roles
   are the four paragraphs P1–P4. All writing is original and every figure
   has been checked against the prompt data with tools/models-check.js.
   Load after models.js.
   =========================================================================== */
(function () {
  var M = window.CONTENT.MODELS;

  M.push({
    id: 'm-line-internet', promptId: 'p-line-internet', band: '8+', words: 184, title: 'Households with internet access',
    paragraphs: [
      { role: 'intro', text: 'The line graph illustrates what proportion of homes in Sweden, Japan, Thailand and Kenya were connected to the internet over the twenty years from 2005 to 2025.' },
      { role: 'overview', text: 'Overall, internet access increased in all four countries. Sweden and Japan had high levels of access from the start and ended the period very close together, whereas Thailand and Kenya began from a much lower base but grew far more quickly, although Kenya remained well behind the others.' },
      { role: 'detail', text: 'In 2005, 70% of Swedish households were already online, compared with 60% in Japan. Both figures rose steadily, and the gap between the two countries narrowed from ten percentage points to just two, with Sweden reaching 97% in 2025 and Japan 95%.' },
      { role: 'detail', text: 'Thailand saw the most dramatic growth, a rise of 76 percentage points. Only 12% of Thai homes had internet access in 2005, but this figure more than quadrupled to 52% by 2015 and reached 88% in 2025. Kenya\'s figure also climbed rapidly, from just 2% to 52%, yet it was still the lowest of the four at the end of the period, 36 percentage points below Thailand.' } ],
    patterns: ['S1', 'S2', 'S3', 'S5', 'S6'],
    notes: [
      'Four lines are grouped into two pairs (high starters vs low starters), so each detail paragraph compares two countries instead of listing four.',
      'The overview names the shared trend (all rose) and the contrast (fast growth from a low base), with no figures.',
      'Percentage points are used for gaps between percentages ("narrowed from ten percentage points to just two").',
      '"more than quadrupled" and "36 percentage points below" turn raw numbers into comparisons; a "with + noun + -ing" clause adds the end points.' ]
  });

  M.push({
    id: 'm-line-cities', promptId: 'p-line-cities', band: '8+', words: 186, title: 'City populations with projections',
    paragraphs: [
      { role: 'intro', text: 'The line graph compares the populations of Lagos, Osaka and Bangkok from 1990 to 2025, with forecasts up to 2040.' },
      { role: 'overview', text: 'Overall, Lagos grew far faster than the other two cities and is expected to overtake Osaka by 2030, while Osaka, the largest city for most of the period, is forecast to shrink slightly. Bangkok grew steadily throughout and is projected to keep growing.' },
      { role: 'detail', text: 'Lagos had only 4.8 million inhabitants in 1990, but its population tripled to 14.4 million by 2020 and reached 16.5 million in 2025. It is projected to climb to 24 million by 2040, five times its 1990 figure. Bangkok, which began with 7.4 million people, grew far more gradually, reaching 11.1 million in 2025, and is predicted to rise to 12.6 million by 2040.' },
      { role: 'detail', text: 'Osaka, by contrast, was the largest of the three cities from 1990 to 2025, although its population barely changed, rising from 18.3 million to a peak of 19.3 million in 2010 before slipping to 19.0 million. Forecasts suggest a gradual decline to 17.8 million by 2040, by which time Lagos is expected to have over 6 million more inhabitants.' } ],
    patterns: ['S1', 'S2', 'S3', 'S6'],
    notes: [
      'Tense follows the time frame: past simple up to 2025, then "is projected to / is expected to / is forecast to" for the dashed part of the graph.',
      'The overview flags the projected crossover in words; the figures for it appear only in the detail paragraphs.',
      'The two growing cities share a paragraph; the flat-then-falling city gets its own, so each paragraph has one story.',
      '"tripled" and "five times its 1990 figure" are checked against the data (4.8 × 3 = 14.4; 4.8 × 5 = 24).',
      'A relative clause ("which began the period with 7.4 million people") and "by which time" add range without errors.' ]
  });

  M.push({
    id: 'm-line-phones', promptId: 'p-line-phones', band: '8+', words: 182, title: 'Teenagers\' phones',
    paragraphs: [
      { role: 'intro', text: 'The line graph compares the proportions of teenagers in one country who had a smartphone and who had a basic mobile phone over the fifteen years from 2010 to 2025.' },
      { role: 'overview', text: 'Overall, smartphone ownership rose dramatically over the period, whereas ownership of basic phones fell almost as sharply, so the two trends were close to mirror images. Basic phones were far more common at the start, but smartphones overtook them between 2013 and 2016 and became almost universal.' },
      { role: 'detail', text: 'Only 10% of teenagers owned a smartphone in 2010. This figure tripled to 30% by 2013 and then doubled to 60% three years later, overtaking basic phones. Growth slowed after 2019, when ownership stood at 80%, but it still reached 95% in 2025, almost ten times the starting level.' },
      { role: 'detail', text: 'Basic phones followed the opposite path. In 2010, 80% of teenagers owned one, eight times the proportion with a smartphone. Ownership then fell steeply, halving to 40% in 2016 and again to 20% in 2019, and by 2025 only 5% of teenagers still had a basic phone, a drop of 75 percentage points over the period.' } ],
    patterns: ['S1', 'S2', 'S3', 'S6'],
    notes: [
      'With only two lines, each line gets its own paragraph, and the crossover links them.',
      'Multiples ("tripled", "doubled", "halving", "eight times") describe the speed of change more precisely than "rose a lot".',
      'The overview gives the mirror-image pattern and the crossover period using years only, never a percentage.',
      'A participle clause ("overtaking basic phones") and a "when" clause carry extra detail inside one accurate sentence.' ]
  });

  M.push({
    id: 'm-line-air', promptId: 'p-line-air', band: '8+', words: 185, title: 'Air pollution in three cities',
    paragraphs: [
      { role: 'intro', text: 'The line graph illustrates how the concentration of PM2.5 fine dust in the air of Beijing, Bangkok and Tokyo changed from 2012 to 2024, in micrograms per cubic metre.' },
      { role: 'overview', text: 'Overall, air quality improved dramatically in Beijing and gradually in Tokyo, whereas pollution in Bangkok fluctuated and ended slightly higher than it began. Tokyo had the cleanest air throughout, and by the end of the period Beijing was no longer the most polluted city.' },
      { role: 'detail', text: 'Beijing\'s fine dust level fell from 92 micrograms per cubic metre in 2012 to 27 in 2024, less than a third of its original figure. The steepest decline came between 2016 and 2018, when the level dropped by 22 micrograms. Tokyo\'s air, which was already much cleaner, improved gradually, with the figure falling from 15 to 10 micrograms.' },
      { role: 'detail', text: 'In contrast, Bangkok showed no clear trend. Its level rose from 24 to 29 micrograms between 2012 and 2018, dipped to 23 in 2020 and then climbed to a high of 30 in 2024. In that year, Bangkok, rather than Beijing, recorded the highest level, although the gap between them was only 3 micrograms.' } ],
    patterns: ['S1', 'S2', 'S3', 'S6'],
    notes: [
      'Grouping is by direction: the two improving cities together, the fluctuating city alone.',
      'The unit is given once in full in the introduction and the first detail sentence, then shortened to "micrograms".',
      '"less than a third of its original figure" and "the steepest decline" select the key movement instead of listing seven years.',
      'The crossover at the end is reported as a fact with a figure ("the gap between them was only 3 micrograms"), not explained.' ]
  });

  M.push({
    id: 'm-line-music', promptId: 'p-line-music', band: '8+', words: 190, title: 'Music sales by format',
    paragraphs: [
      { role: 'intro', text: 'The line graph illustrates how much one country earned from four formats of recorded music from 2010 to 2022, with forecasts to 2030.' },
      { role: 'overview', text: 'Overall, streaming grew from almost nothing into the dominant format, while CDs and downloads both lost most of their revenue. Vinyl was the only physical format to grow, and both streaming and vinyl are expected to keep rising until 2030.' },
      { role: 'detail', text: 'Streaming revenue rose from just $20 million in 2010 to $400 million in 2018, overtaking CDs, and reached $620 million in 2022. It is projected to climb to $780 million by 2030. Vinyl earned far less but grew steadily, from $5 million to $60 million, and is forecast to reach $95 million in 2030, more than three times the expected figure for CDs.' },
      { role: 'detail', text: 'CDs, in contrast, led the market in 2010 with $520 million, but their revenue fell to $80 million in 2022 and is predicted to reach just $30 million by 2030. Downloads rose from $180 million to a peak of $250 million in 2014 before falling to $60 million in 2022, the same as vinyl, and are expected to earn just $10 million by 2030.' } ],
    patterns: ['S1', 'S2', 'S3', 'S6'],
    notes: [
      'The two growing formats (streaming, vinyl) and the two shrinking ones (CDs, downloads) form the two groups.',
      'Past simple for 2010–2022, future forms ("is projected to", "are forecast to", "is predicted to") for the dashed projection.',
      'The peak of downloads is named with "to a peak of … before declining", the classic shape for a rise-and-fall line.',
      'Comparisons cross the groups: streaming "overtaking CDs", vinyl "more than three times the expected figure for CDs".' ]
  });

  M.push({
    id: 'm-line-ev', promptId: 'p-line-ev', band: '8+', words: 189, title: 'Electric car sales',
    paragraphs: [
      { role: 'intro', text: 'The line graph compares the proportion of new cars sold in five countries that were fully electric over the decade from 2015 to 2025.' },
      { role: 'overview', text: 'Overall, Norway was far ahead of the others throughout, with electric cars coming to dominate its market. China and Thailand saw low sales until 2021 but then a steep rise, whereas Japan and India remained very low, so the gap between the two groups widened considerably.' },
      { role: 'detail', text: 'In Norway, the share rose steadily from 22.4% in 2015 to 55.9% in 2021 and reached 88.1% in 2025. China and Thailand, by contrast, started at only 1.0% and 0.1% respectively and were still in single figures in 2021. After that, both surged: China\'s share rose to 47.9% by 2025, almost eight times its 2021 level, while Thailand\'s reached 18.5%.' },
      { role: 'detail', text: 'Japan and India showed only modest growth. Japan\'s figure hovered around 1% between 2017 and 2021 and rose to just 3.6% in 2025, while India\'s increased from 0.1% to 2.5%. By the end of the period, electric cars accounted for less than 4% of new car sales in these two countries, compared with almost nine in ten in Norway.' } ],
    patterns: ['S1', 'S2', 'S3', 'S5', 'S6'],
    notes: [
      'Five lines are reduced to two groups: the three that took off and the two that stayed low.',
      'The overview states the widening gap between the groups, which is the real story of the graph.',
      'Decimal figures are copied exactly ("88.1%", "47.9%") because they are printed in the data; "around 1%" is used only for a range of values.',
      '"respectively", "almost eight times" and "compared with almost nine in ten" give three different kinds of comparison.',
      'A fronted phrase ("After that, both surged:") marks the turning point without a chain of connectors.' ]
  });

  M.push({
    id: 'm-bar-tourists', promptId: 'p-bar-tourists', band: '8+', words: 165, title: 'International tourist arrivals in Thailand',
    paragraphs: [
      { role: 'intro', text: 'The bar chart illustrates how many international tourists arrived in Thailand in selected years from 2015 to 2025, with figures given in millions.' },
      { role: 'overview', text: 'Overall, arrivals grew steadily to a peak in 2019, collapsed almost completely over the next two years and then recovered strongly. By the end of the period, the number of foreign visitors was close to its earlier high.' },
      { role: 'detail', text: 'In 2015, Thailand welcomed 29.9 million foreign visitors. This figure rose to 35.6 million two years later and reached a high of 39.9 million in 2019, 10 million more than in 2015, which represented growth of about a third.' },
      { role: 'detail', text: 'There was then a dramatic fall in arrivals, to just 6.7 million in 2020, roughly a sixth of the previous year\'s total, and numbers dropped even further in 2021, to only 0.4 million. However, arrivals rebounded to 28.2 million in 2023, almost back to the 2015 level, with the total climbing again to 36.5 million in 2025, only 3.4 million lower than the 2019 peak.' } ],
    patterns: ['S1', 'S2', 'S3', 'S4', 'S6'],
    notes: [
      'A single-series bar chart with years is TREND mode: the bars are described as a line would be.',
      'The data falls into two stories, growth to 2019 and collapse-and-recovery after it, so each gets a paragraph.',
      'S4 ("There was then a dramatic fall in arrivals") varies the sentence shapes after two S3 sentences.',
      'Comparisons with earlier years ("10 million more than in 2015", "only 3.4 million lower than the 2019 peak") replace a list of values.',
      'No reason is given for the collapse: the chart shows numbers, not causes.' ]
  });

  M.push({
    id: 'm-bar-homework', promptId: 'p-bar-homework', band: '8+', words: 180, title: 'Homework hours per week',
    paragraphs: [
      { role: 'intro', text: 'The bar chart compares how much homework students in M3, M4 and M5 at one school typically do each week in English, Maths, Science and Thai.' },
      { role: 'overview', text: 'Overall, older students generally do more homework, and the oldest year group does the most in every subject. Maths and Science involve the heaviest workload, whereas Thai is the subject with the least homework in all three year groups.' },
      { role: 'detail', text: 'Maths is the most demanding subject for the two younger year groups, at 3 hours a week in M3 and 4 hours in M4. In M5, however, Science matches Maths at 5 hours a week, compared with just 2 hours in M3, so the time spent on Science more than doubles between these two year groups.' },
      { role: 'detail', text: 'English homework follows a similar pattern: M3 students do 2 hours a week, M4 students 3 hours and M5 students 4 hours, twice as much as the youngest group. Thai, by contrast, requires only 1 hour a week in both M3 and M4, rising to 2 hours in M5, which is still the lowest figure in that year group.' } ],
    patterns: ['S1', 'S2', 'S6'],
    notes: [
      'The chart has no date, so the report is in the present simple.',
      'The grouping is by subject (the two heavy subjects, the two lighter ones), not by year group, so each paragraph can compare.',
      'The overview says "generally" because Thai homework does not rise between M3 and M4; precision protects Task Achievement.',
      '"more than doubles" and "twice as much as" are checked against the bars (2 → 5 hours; 2 → 4 hours).' ]
  });

  M.push({
    id: 'm-bar-activities', promptId: 'p-bar-activities', band: '8+', words: 166, title: 'After-school activities',
    paragraphs: [
      { role: 'intro', text: 'The bar chart compares the numbers of male and female students at one school who took part in sport, music and coding after school in 2024.' },
      { role: 'overview', text: 'Overall, sport was the most popular activity in total, and boys outnumbered girls in both sport and coding. Music, on the other hand, was the only activity that attracted more girls than boys.' },
      { role: 'detail', text: 'Sport attracted 105 students in total, the highest number for any activity, and was the first choice of boys, with 60 taking part, compared with 45 girls. The difference between boys and girls was proportionally even larger in coding, where 40 boys took part, exactly twice the number of girls, at 20.' },
      { role: 'detail', text: 'Music showed the opposite pattern. It was the most popular choice among girls, with 50 of them taking part, which was twice as many as the 25 boys who chose it. In total, music had 75 participants, 30 fewer than sport but 15 more than coding, which attracted the fewest students of the three activities.' } ],
    patterns: ['S1', 'S2', 'S6'],
    notes: [
      'The data is grouped by the story, not by the axis: the two activities boys led (sport, coding) and the one girls led (music).',
      'Totals (105, 75 and 60 students) are added by the writer to support the overview claim that sport was the most popular.',
      '"twice the number of" and "twice as many as" are both accurate (40/20, 50/25), and "proportionally" keeps the coding comparison true.',
      'Past simple throughout, because the chart is dated 2024.' ]
  });

  M.push({
    id: 'm-bar-costs', promptId: 'p-bar-costs', band: '8+', words: 188, title: 'Student living costs in six cities',
    paragraphs: [
      { role: 'intro', text: 'The bar chart compares how much university students in six Asian cities spent each month on accommodation, food and transport in 2024.' },
      { role: 'overview', text: 'Overall, rent was the largest expense in every city and also varied far more than food or transport. Students in Singapore, Tokyo and Seoul faced much higher costs than those in the South-East Asian cities, with Singapore the most expensive and Hanoi the cheapest on every measure.' },
      { role: 'detail', text: 'Singapore stood out for rent, at $1,150 a month, almost half as much again as in Tokyo ($780) and nearly double the figure for Seoul ($620). Food costs in these three cities were closer together, ranging from $360 to $420. Transport was the smallest item, and Tokyo, not Singapore, had the highest figure, at $95.' },
      { role: 'detail', text: 'In Kuala Lumpur, Bangkok and Hanoi, monthly rent was between $240 and $310, only a fifth to just over a quarter of the Singapore figure. Food cost between $170 and $210, while transport ranged from just $30 in Hanoi to $55 in Kuala Lumpur. Hanoi was the cheapest city in total, at $440 a month, roughly a quarter of the $1,655 spent in Singapore.' } ],
    patterns: ['S1', 'S2', 'S6'],
    notes: [
      'Eighteen bars are organised as two groups of three cities, the expensive group and the South-East Asian group.',
      'Ranges ("between $240 and $310", "from $360 to $420") summarise several bars in one accurate phrase.',
      'The exception (Tokyo, not Singapore, for transport) is a key feature and gets its own sentence.',
      'Totals are calculated from the bars ($1,150 + $420 + $85 = $1,655) and used for one final comparison.',
      'Fractions are checked: $240–$310 is between 21% and 27% of $1,150, so "a fifth to just over a quarter" is true.' ]
  });

  M.push({
    id: 'm-bar-emoto', promptId: 'p-bar-emoto', band: '8+', words: 167, title: 'Electric motorbike sales',
    paragraphs: [
      { role: 'intro', text: 'The bar chart illustrates how many electric motorbikes were sold in one city each year from 2019 to 2025, with figures given in thousands.' },
      { role: 'overview', text: 'Overall, sales of electric motorbikes rose in every year shown. Growth was gradual at first but accelerated sharply from 2023 onwards, and the biggest annual increase came in the final year.' },
      { role: 'detail', text: 'In 2019, only 2,000 electric motorbikes were sold in the city. Sales rose slowly over the next two years, to 3,000 in 2020 and 5,000 in 2021, before almost doubling to 9,000 in 2022. Even so, the total for 2022 was lower than the figure for any of the following years, and it was exactly a fifth of the final total.' },
      { role: 'detail', text: 'From 2023, sales grew much more rapidly. They reached 16,000 in that year and 28,000 in 2024, an increase of 12,000. The largest rise came in 2025, when sales jumped by 17,000 to 45,000, more than twenty times the 2019 figure and 43,000 higher than at the start of the period.' } ],
    patterns: ['S1', 'S2', 'S3', 'S6'],
    notes: [
      'The seven bars split at the point where growth speeds up: four slow years and three fast ones.',
      'Figures in thousands are written in full (2,000, 45,000) so the unit is never lost.',
      'Both kinds of preposition are used correctly: "jumped BY 17,000 TO 45,000".',
      'Multiples and fractions ("almost doubling", "less than a fifth", "more than twenty times") keep the paragraphs comparative, not a list of years.' ]
  });

  M.push({
    id: 'm-bar-bags', promptId: 'p-bar-bags', band: '8+', words: 187, title: 'Plastic bags used by a supermarket chain',
    paragraphs: [
      { role: 'intro', text: 'The bar chart illustrates how many single-use plastic bags, in millions, a supermarket chain gave its shoppers each year from 2016 to 2024.' },
      { role: 'overview', text: 'Overall, the number of bags rose slightly in the first three years before falling dramatically, and the decline then continued at a much slower pace until the end of the period. By 2024, the chain was handing out only a small fraction of the bags it had given out at the peak.' },
      { role: 'detail', text: 'Between 2016 and 2018, the chain\'s bag use was high and rising gently. It stood at 92 million in 2016, edged up to 95 million the following year and peaked at 97 million in 2018, only 5 million more than in 2016.' },
      { role: 'detail', text: 'There was then a sharp fall of 37 million bags in 2019, to 60 million, and the figure dropped again to 35 million in 2020, little more than a third of the 2018 peak. After that, the decline slowed considerably: the total fell by only 15 million over the next four years, far less than in 2019 alone, reaching 20 million in 2024, roughly a fifth of the peak level.' } ],
    patterns: ['S1', 'S2', 'S3', 'S4', 'S6'],
    notes: [
      'The overview describes three phases (slight rise, collapse, slow decline) without a single figure.',
      'The detail paragraphs follow the prompt\'s grouping: the high years, then the fall and its slower continuation.',
      '"fell by only 15 million over the next four years" summarises four bars in one sentence; it is not year-by-year listing.',
      'Fractions of the peak ("little more than a third", "roughly a fifth") are checked: 35/97 ≈ 0.36, 20/97 ≈ 0.21.' ]
  });

  M.push({
    id: 'm-bar-languages', promptId: 'p-bar-languages', band: '8+', words: 170, title: 'Foreign languages studied at secondary school',
    paragraphs: [
      { role: 'intro', text: 'The bar chart illustrates how many secondary school students in one country were learning Chinese, Japanese and French at five-year intervals between 2010 and 2025.' },
      { role: 'overview', text: 'Overall, Chinese grew strongly and became by far the most widely studied of the three languages, while Japanese remained remarkably stable. French, in contrast, steadily lost students and was the least popular language by the end of the period.' },
      { role: 'detail', text: 'In 2010, Chinese was the least studied language, with 40,000 students, compared with 60,000 for Japanese. Its numbers then rose steadily, overtaking those for Japanese between 2015 and 2020, and reached 110,000 in 2025, almost three times the original figure and 47,000 more than Japanese.' },
      { role: 'detail', text: 'Japanese hardly changed throughout the period, fluctuating only between 60,000 and 65,000 students and finishing at 63,000, just 3,000 above its 2010 figure. French moved in the opposite direction to Chinese: it attracted 50,000 students in 2010, more than Chinese at the time, but this number fell in every subsequent year to just 25,000 in 2025, exactly half its initial level.' } ],
    patterns: ['S1', 'S2', 'S3', 'S6'],
    notes: [
      'A grouped bar chart over time is TREND mode, organised by language (series), not by year.',
      'The riser gets one paragraph; the flat language and the faller share the other, with a comparison back to Chinese.',
      'The crossover is placed between two years ("between 2015 and 2020") because the bars do not show the exact moment.',
      'A participle clause ("overtaking those for Japanese") and "exactly half its initial level" add precision.' ]
  });

  M.push({
    id: 'm-pie-budget', promptId: 'p-pie-budget', band: '8+', words: 166, title: 'A student\'s weekly spending',
    paragraphs: [
      { role: 'intro', text: 'The pie chart illustrates how the weekly money of an average secondary student in one city was divided between six categories of spending in 2024.' },
      { role: 'overview', text: 'Overall, food and drinks took the largest share of students\' spending, and together with transport they made up more than half of the total. By contrast, savings represented by far the smallest proportion, while the other three categories were broadly similar in size.' },
      { role: 'detail', text: 'Food and drinks alone accounted for 38% of weekly spending, well over a third, and transport was the second largest item, at 22%, a little under a quarter. Combined, these two categories made up 60% of the budget, three fifths of all the money spent.' },
      { role: 'detail', text: 'The remaining 40% was spread across four categories. Phone and internet costs represented 15%, slightly more than clothes at 12%, while entertainment accounted for 9%, less than a quarter of the share for food. Savings came last at only 4%, which was roughly a tenth of the amount spent on food and drinks.' } ],
    patterns: ['S1', 'S2', 'S5', 'S6'],
    notes: [
      'A single pie is COMPARE mode: largest, smallest, combined shares and near-equals.',
      'The six slices are grouped into two large ones and four small ones, the natural break in the chart.',
      'Proportion language is varied: "accounted for", "made up", "represented", "the remaining 40%".',
      'The overview may say "more than half" only because it is a general truth about two slices; the exact 60% is kept for the detail.' ]
  });

  M.push({
    id: 'm-pie-waste', promptId: 'p-pie-waste', band: '8+', words: 165, title: 'Household waste',
    paragraphs: [
      { role: 'intro', text: 'The pie chart breaks down the household waste that one city collected in 2023 into six categories.' },
      { role: 'overview', text: 'Overall, food made up by far the largest proportion of household waste, and together with plastic it accounted for the clear majority of everything collected. Glass and metal, by contrast, were the smallest categories.' },
      { role: 'detail', text: 'Food waste alone represented 42% of the total, just over two fifths and exactly twice the share of plastic, which was the second largest category at 21%. Combined, these two types of waste made up 63% of all the rubbish that the city collected, almost two thirds of the total.' },
      { role: 'detail', text: 'The remaining 37% was shared among four categories. Paper accounted for 14%, twice as much as glass at 7%, while miscellaneous waste in the \'other\' category made up 12%, slightly less than paper. Metal was the smallest category of all, at just 4%, which was less than a tenth of the figure for food and less than a third of the share of paper.' } ],
    patterns: ['S1', 'S2', 'S5', 'S6'],
    notes: [
      'The two dominant slices are grouped against the four small ones.',
      'Every comparison is exact: 42 is twice 21, 14 is twice 7, and 4 is less than a tenth of 42.',
      'The figures for the small slices are given in one sentence each, joined by "while" and "twice as much as", not listed.',
      'Past simple because the chart is dated 2023.' ]
  });

  M.push({
    id: 'm-pie-school-travel', promptId: 'p-pie-school-travel', band: '8+', words: 161, title: 'How students travel to school',
    paragraphs: [
      { role: 'intro', text: 'The two pie charts compare the ways in which students at a Thai school got to school in 2005 and 2025.' },
      { role: 'overview', text: 'Overall, walking, which was the most common way of getting to school in 2005, declined sharply over the two decades. Motorbikes became the most popular form of transport by 2025, and travel by car also increased considerably.' },
      { role: 'detail', text: 'In 2005, 50% of students walked to school, exactly half of the total and as many as the motorbike and car users combined. Twenty years later, however, the proportion of walkers had dropped by 30 percentage points to just 20%, two fifths of its original level.' },
      { role: 'detail', text: 'Motorbikes, by contrast, carried 30% of students in 2005 and 45% in 2025, overtaking walking to become the leading method. The share travelling by car rose by 15 percentage points, from 20% to 35%. By 2025, therefore, four out of five students used a motorbike or a car to reach school, compared with only half in 2005.' } ],
    patterns: ['S1', 'S2', 'S3', 'S6'],
    notes: [
      'Two pies for two years are TREND mode: the report describes how each slice changed, not one pie after the other.',
      'Walking (the only faller) and the two vehicles (the risers) are the two groups.',
      '"percentage points" is used for the change in a share (50% to 20% = 30 percentage points).',
      'The final sentence combines two slices from the same pie (45% + 35% = 80%, "four out of five"), which is allowed because they measure the same thing.' ]
  });

  M.push({
    id: 'm-pie-university', promptId: 'p-pie-university', band: '8+', words: 184, title: 'Sources of a university\'s income',
    paragraphs: [
      { role: 'intro', text: 'The three pie charts illustrate how the income of a public university was made up in 2000, 2012 and 2024.' },
      { role: 'overview', text: 'Overall, the university became much less reliant on government funding, which lost its position as the main source of income to tuition fees. The three smaller sources all grew gradually, so income became far more evenly spread.' },
      { role: 'detail', text: 'In 2000, government funding provided 62% of the university\'s income, more than three times the share from tuition fees (20%). By 2012, the gap had narrowed considerably, with the government contributing 48% and students 29%. Over the following twelve years, government funding fell to 31%, half its original share, while fees rose to 38%, making them the largest source.' },
      { role: 'detail', text: 'The other three sources were much smaller, together accounting for only 18% of income in 2000, but each of them grew. Research grants increased from 10% to 14% and donations from 5% to 9%, while other income, which had changed little by 2012, doubled from 4% to 8% in the final period. Together, these three sources provided 31% of income in 2024, the same proportion as government funding.' } ],
    patterns: ['S1', 'S2', 'S3', 'S6'],
    notes: [
      'Three pies are read across time, slice by slice: the two big sources in one paragraph, the three small ones in the other.',
      'The middle pie (2012) is used once, to show that the gap was closing; the paragraph does not describe each pie in turn.',
      'Sums are checked against the data: 10 + 5 + 3 = 18 in 2000 and 14 + 9 + 8 = 31 in 2024.',
      'Past perfect ("By 2012, the gap had narrowed") and a relative clause ("which had changed little by 2012") give the 7→8 range.' ]
  });

  M.push({
    id: 'm-table-rice', promptId: 'p-table-rice', band: '8+', words: 167, title: 'Rice production',
    paragraphs: [
      { role: 'intro', text: 'The table compares the amount of rice produced by China, India, Vietnam and Thailand at ten-year intervals between 2000 and 2020, measured in millions of tonnes.' },
      { role: 'overview', text: 'Overall, China was by far the largest producer in all three years, and both it and India increased their output considerably. Vietnam and Thailand produced far smaller quantities, and Thailand was the only country whose production fell in the second decade.' },
      { role: 'detail', text: 'China\'s rice production rose from 188 million tonnes in 2000 to 212 million in 2020, an increase of 24 million tonnes. India, the second largest producer, recorded the biggest rise, with its output climbing by 51 million tonnes to 178 million, although this was still 34 million tonnes below China\'s figure.' },
      { role: 'detail', text: 'Vietnam\'s harvest grew steadily, from 32 million to 43 million tonnes over the two decades. Thailand, which produced 26 million tonnes in 2000, saw a sharp increase to 36 million in 2010, but its output then dropped back to 30 million in 2020, 13 million tonnes less than Vietnam\'s.' } ],
    patterns: ['S1', 'S2', 'S3', 'S5'],
    notes: [
      'A table with years in the columns is TREND mode: each row is described like a line on a graph.',
      'The two big producers and the two small ones form the groups, so each paragraph compares like with like.',
      'Differences are calculated and checked (212 − 188 = 24; 178 − 127 = 51; 212 − 178 = 34; 43 − 30 = 13).',
      '"with its output climbing by 51 million tonnes" uses the "with + noun + -ing" add-on and the preposition "by" for the size of a change.' ]
  });

  M.push({
    id: 'm-table-phones', promptId: 'p-table-phones', band: '8+', words: 185, title: 'Five smartphones compared',
    paragraphs: [
      { role: 'intro', text: 'The table compares five smartphones on sale in 2024 by cost, battery life, screen size and weight.' },
      { role: 'overview', text: 'Overall, the most expensive phones did not necessarily offer the longest battery life, and the model with the largest screen was also the heaviest. The cheapest phone was the smallest and lightest, but it also had the shortest battery life.' },
      { role: 'detail', text: 'The Alpha 12 was the most expensive phone at $1,100, yet its battery lasted only 22 hours, the second shortest in the table. The Orbit Max, which cost $940, offered by far the longest battery life, at 34 hours, and the largest screen, at 6.9 inches, but at 238 grams it was also the heaviest. The Nova S was cheaper again at $850 and had a 6.1-inch screen.' },
      { role: 'detail', text: 'The Pixelite 4 cost only $620 but had the second longest battery life, at 30 hours. The Zen Lite was by far the cheapest at only $260, less than a quarter of the price of the Alpha 12, and also the lightest, at 165 grams. However, it had the smallest screen (6.0 inches) and the shortest battery life (18 hours).' } ],
    patterns: ['S1', 'S2', 'S6'],
    notes: [
      'The overview avoids model names that contain numbers, so it stays free of digits, and names the relationships between columns instead.',
      'Rows are grouped by price (three dearer models, two cheaper ones), and each row is compared across columns.',
      'Superlatives and ordinals ("the second shortest", "by far the longest") rank the phones without listing every cell.',
      '"less than a quarter of the price" is checked: $260 is about 24% of $1,100.' ]
  });

  M.push({
    id: 'm-table-sleep', promptId: 'p-table-sleep', band: '8+', words: 188, title: 'Sleep and study habits of 15-year-olds',
    paragraphs: [
      { role: 'intro', text: 'The table compares the sleep, homework, phone use and tiredness of 15-year-old students in five countries in 2023.' },
      { role: 'overview', text: 'Overall, students who slept less were more likely to feel tired every day: Korean and Japanese teenagers slept the least and were the most tired, whereas their Finnish and Australian peers slept the longest and were the least tired. Thailand stood out for phones in the bedroom.' },
      { role: 'detail', text: 'Korean students slept just 6.1 hours, the lowest figure, but did the most homework, at 3.4 hours. Japanese students slept only slightly longer, at 6.3 hours, and 71% and 64% of Korean and Japanese students respectively felt tired every day. Thai students, who slept for 7.2 hours, had the highest rate of phones in the bedroom, at 91%, while 52% felt tired daily.' },
      { role: 'detail', text: 'Australian and Finnish students showed the opposite pattern, sleeping for 8.1 and 8.4 hours respectively and doing the least homework, at only 1.5 and 1.2 hours. Just 33% of them in Australia and 29% in Finland felt tired every day, less than half the Korean rate, and around 70% kept a phone in the bedroom, a lower share than elsewhere.' } ],
    patterns: ['S1', 'S2', 'S5', 'S6'],
    notes: [
      'The overview states the relationship between two columns (less sleep, more tiredness) as a pattern, never as a cause.',
      'Rows are grouped into the low-sleep countries and the high-sleep countries; Thailand is placed with the first group and its exception is named.',
      '"respectively" is used twice with two items each, the safe limit.',
      '"around 70%" covers two close cells (68% and 72%) honestly; every other figure is exact.' ]
  });

  M.push({
    id: 'm-table-schools', promptId: 'p-table-schools', band: '8+', words: 165, title: 'Students at three schools',
    paragraphs: [
      { role: 'intro', text: 'The table illustrates how student numbers changed at three secondary schools in the same town between 2010 and 2025, at five-year intervals.' },
      { role: 'overview', text: 'Overall, Riverside School grew steadily, whereas Lakeside School shrank considerably, so that by the end of the period their positions had been reversed. Hilltop School, in contrast, stayed exactly the same size throughout.' },
      { role: 'detail', text: 'In 2010, Lakeside was the largest school, with 1,200 students, compared with 800 at Riverside. Riverside then gained 100 students every five years, while Lakeside lost 100 between 2010 and 2015 and a further 200 in each of the following periods. Riverside overtook Lakeside between 2015 and 2020, and by 2025 it had 1,100 students, 400 more than Lakeside, which was left with only 700.' },
      { role: 'detail', text: 'Hilltop School, the only school whose size did not change, had exactly 600 students in every year shown. Although it remained the smallest of the three schools throughout, the gap between Hilltop and Lakeside narrowed from 600 students in 2010 to just 100 in 2025.' } ],
    patterns: ['S1', 'S2', 'S3', 'S5'],
    notes: [
      'The two schools that changed (in opposite directions) share a paragraph; the unchanged school gets the other.',
      'The crossover is dated correctly: Riverside (1,000) was already ahead of Lakeside (900) in 2020.',
      'A regular change is summarised once ("gained 100 students every five years") instead of four times.',
      'A completely flat row is still a key feature, so Hilltop is reported with a figure and a comparison.' ]
  });

  M.push({
    id: 'm-mixed-park', promptId: 'p-mixed-park', band: '8+', words: 176, title: 'Visitors to a national park',
    paragraphs: [
      { role: 'intro', text: 'The line graph compares the numbers of domestic and international visitors to a national park from 2015 to 2025, while the pie chart breaks down the international visitors in 2025 by region of origin.' },
      { role: 'overview', text: 'Overall, the number of Thai visitors doubled over the period, while foreign visitor numbers collapsed in 2021 before recovering almost to their earlier level. In 2025, China and Europe were the main sources of foreign visitors.' },
      { role: 'detail', text: 'Thai visitors increased from 120,000 in 2015 to 150,000 in 2019 and then jumped to 210,000 in 2021, overtaking foreign visitors. Their number reached 240,000 by 2025, twice its starting level. Foreign visitors, by contrast, rose from 180,000 to 240,000 between 2015 and 2019 but plunged to just 20,000 in 2021, before recovering to 220,000 in 2025.' },
      { role: 'detail', text: 'Of the foreign visitors in 2025, the largest group came from China (32%), followed by Europe (26%) and other parts of Asia (24%). Together, these three regions accounted for 82% of the total, while visitors from the Americas and all other places made up only 10% and 8% respectively.' } ],
    patterns: ['S1', 'S2', 'S3', 'S5', 'S6'],
    notes: [
      'One introduction and one overview cover both visuals; each visual then gets its own detail paragraph.',
      'Figures from the two visuals are never combined: the pie gives shares of foreign visitors only.',
      'The line graph is TREND (past simple, change verbs); the pie is COMPARE (shares, "followed by", "respectively").',
      'A participle clause ("overtaking foreign visitors") marks the crossover inside the sentence that gives its figure.' ]
  });

  M.push({
    id: 'm-mixed-gym', promptId: 'p-mixed-gym', band: '8+', words: 189, title: 'Fitness club members by age',
    paragraphs: [
      { role: 'intro', text: 'The bar chart illustrates how many members a fitness club chain had in each of five age groups in 2024, while the table gives each group\'s average monthly visits and fees.' },
      { role: 'overview', text: 'Overall, the two younger adult groups made up the clear majority of members, but they were not the most frequent users. The oldest group was the smallest yet visited most often, and the youngest and oldest members paid the lowest fees.' },
      { role: 'detail', text: 'The 18–29 age group was the largest, with 58,000 members, followed by those aged 30–44, at 46,000. Together, these two groups accounted for 104,000 of the chain\'s 150,000 members, more than two thirds of the total. Membership was much lower among people aged 45–59 (25,000), and the under-18s and over-60s were the smallest groups, at 12,000 and 9,000 respectively.' },
      { role: 'detail', text: 'The pattern of use was quite different: members aged 60 and over visited 14 times a month on average, more than twice as often as 18-to-29-year-olds, who went only 6 times. Fees were highest for the 30–44 group, at $38 a month, and lowest for the under-18s and over-60s, at $18 and $20 respectively.' } ],
    patterns: ['S1', 'S2', 'S5', 'S6'],
    notes: [
      'The bar chart and the table each get one detail paragraph; the overview has one headline for each and a link between them.',
      'The overview avoids age-group numbers ("the two younger adult groups") so that it contains no digits.',
      'The total (150,000) is calculated from the bars and used once, for the "more than two thirds" comparison.',
      'Comparisons between visuals are made only for the same age group (the 18–29 group is largest but visits least).' ]
  });

  M.push({
    id: 'm-mixed-plastic', promptId: 'p-mixed-plastic', band: '8+', words: 188, title: 'Plastic bottle recycling',
    paragraphs: [
      { role: 'intro', text: 'The bar chart illustrates the tonnage of plastic bottles gathered for recycling in one country from 2016 to 2024, while the pie chart shows how the 2024 collection was used.' },
      { role: 'overview', text: 'Overall, the quantity of plastic bottles collected more than doubled over the period, rising every year except 2020 and growing faster afterwards. Most of the plastic collected in 2024 was made into new products, although a minority was exported, sent to landfill or burned.' },
      { role: 'detail', text: 'In 2016, 42,000 tonnes of plastic bottles were collected, and this figure rose steadily to 61,000 tonnes in 2019. After a slight dip to 58,000 tonnes in 2020, collection accelerated, increasing by between 9,000 and 13,000 tonnes a year and reaching 104,000 tonnes in 2024, almost two and a half times the 2016 level.' },
      { role: 'detail', text: 'New bottles were the main use of the collected plastic, accounting for 38%, while textiles took a further 27%; together, these two uses absorbed almost two thirds of the total. Of the remainder, 19% was exported, 11% went to landfill and 5% was burned for energy, so around one sixth of the plastic was landfilled or burned rather than recycled.' } ],
    patterns: ['S1', 'S2', 'S3', 'S6'],
    notes: [
      'The time-series bars (TREND) and the single pie (COMPARE) each have their own paragraph and their own verbs.',
      'The one dip (2020) is a key feature and is named in both the overview and the detail.',
      'A range of yearly increases ("between 9,000 and 13,000 tonnes a year") is accurate where a single figure would not be.',
      'Shares from the pie are combined only with each other (38% + 27%; 11% + 5%), never with the tonnes in the bar chart.' ]
  });

  M.push({
    id: 'm-proc-frog', promptId: 'p-proc-frog', band: '8+', words: 169, title: 'The life cycle of a frog',
    paragraphs: [
      { role: 'intro', text: 'The diagram illustrates the main stages in the development of a frog, from the egg to the fully grown animal.' },
      { role: 'overview', text: 'Overall, the frog goes through five distinct stages in a natural cycle that begins with eggs in water and ends with an adult frog that lays eggs of its own. The greatest changes happen in the middle of the cycle, as the young animal gradually develops legs and lungs while its tail shrinks.' },
      { role: 'detail', text: 'At the first stage, the eggs, which are known as frogspawn, are laid in water. After about 10 days, they hatch into tadpoles, which breathe through gills and have a tail. Next, at around 6 to 9 weeks, each tadpole grows back legs, followed by front legs.' },
      { role: 'detail', text: 'By the age of 12 weeks, the tadpole has become a froglet: its lungs develop and its tail shrinks. Finally, it grows into an adult frog, which is able to live both on land and in water. The cycle then begins again when the adult lays its own eggs.' } ],
    patterns: ['S1', 'S2', 'S7'],
    notes: [
      'A natural cycle is written mainly in the active voice ("they hatch", "each tadpole grows"); the passive appears only for the eggs, where the frog is the unknown agent.',
      'The overview counts the stages, names the start and end, and states that the process is a cycle.',
      'Every stage is named, and every time figure in the diagram (10 days, 6–9 weeks, 12 weeks) is used once.',
      'Sequencers vary: "At the first stage", "After about 10 days", "Next", "By the age of 12 weeks", "Finally".' ]
  });

  M.push({
    id: 'm-proc-noodles', promptId: 'p-proc-noodles', band: '8+', words: 165, title: 'Making instant noodles',
    paragraphs: [
      { role: 'intro', text: 'The diagram illustrates the stages involved in producing instant noodles in a factory, from the raw ingredients to the finished packets.' },
      { role: 'overview', text: 'Overall, the manufacture of instant noodles is a linear process with seven stages, starting with three basic ingredients and ending with sealed packets. The first three stages turn the ingredients into raw noodles, while the last four cook, cool and package them, with heat being used twice.' },
      { role: 'detail', text: 'At the first stage, flour, water and salt are mixed together to form a dough. This dough is then pressed by a series of rollers into thin sheets. At the third stage, the sheets are cut into wavy strands.' },
      { role: 'detail', text: 'Next, the strands are cooked with steam for 2 minutes before being fried in blocks in oil at 150 °C to remove the water. After frying, the noodle blocks are cooled by fans as they move along a conveyor belt. Finally, a sachet of seasoning is added to each block, and the noodles are packaged in sealed packets.' } ],
    patterns: ['S1', 'S2', 'S7'],
    notes: [
      'A man-made process takes the present simple passive throughout ("are mixed", "is pressed", "are sealed").',
      'The overview gives the stage count, the start and the end, and the two phases (shaping, then cooking and finishing).',
      'S7 appears in its full form: "the strands are cooked with steam for 2 minutes before being fried".',
      'The two figures in the diagram (2 minutes, 150 °C) are both reported; nothing is explained or evaluated.' ]
  });

  M.push({
    id: 'm-map-school', promptId: 'p-map-school', band: '8+', words: 189, title: 'A school campus: now and planned',
    paragraphs: [
      { role: 'intro', text: 'The two maps illustrate the present layout of a secondary school campus and the changes that are planned for it.' },
      { role: 'overview', text: 'Overall, the plan will add more indoor space and a new green area, mainly at the expense of the sports field, which will be cut in half. Several facilities will be moved, while the main building and the road along the western edge of the campus will stay as they are.' },
      { role: 'detail', text: 'In the north-east corner, the car park will be removed and replaced by a garden, while a new car park will be built on the open ground in the east of the campus. The library on the western side of the centre will be demolished, and the canteen next to it will be extended westwards onto its site, doubling in size.' },
      { role: 'detail', text: 'The biggest change will take place in the south, where a new library, much larger than the current one, will be constructed on the western half of the sports field, directly south of the extended canteen. The field itself, which currently stretches across the whole southern part of the campus, will be reduced to the south-eastern half.' } ],
    patterns: ['S1', 'S2', 'S8'],
    notes: [
      'A plan takes the future passive ("will be removed", "will be extended", "will be constructed") and the present for what is there now.',
      'Details are grouped by area: the north and centre first, then the south, where the largest change is.',
      'Compass points and landmarks ("in the north-east corner", "directly south of the extended canteen") replace left and right.',
      'What stays the same (the main building, the road) is a key feature and is named in both the overview and the detail.' ]
  });

  M.push({
    id: 'm-map-beach', promptId: 'p-map-beach', band: '8+', words: 180, title: 'A coastal village, 2000 and 2025',
    paragraphs: [
      { role: 'intro', text: 'The maps illustrate how a seaside village in the south of Thailand developed between 2000 and 2025.' },
      { role: 'overview', text: 'Overall, the village was transformed from a small fishing community into a tourist resort, with most of its original buildings and much of its farmland replaced by tourist facilities. Only the temple, the beach and the route of the road remained unchanged.' },
      { role: 'detail', text: 'Along the seafront, the fishermen\'s houses in the west were demolished to make way for a hotel, and the market in the centre was replaced by restaurants and shops. The open ground between the market and the temple was turned into a car park, while the wooden fishing pier was rebuilt as a concrete jetty for tour boats.' },
      { role: 'detail', text: 'Further south, the dirt road running from east to west through the village was paved, and the coconut plantation behind it was largely cleared. Resort villas now occupy its western part, which covers more than half of the original plantation, leaving only a smaller area of coconut trees in the south-east. The temple in the east was the only building that survived unchanged.' } ],
    patterns: ['S1', 'S2', 'S8'],
    notes: [
      'A past-to-present map uses the past simple passive for each change and the present simple for what is there now ("now occupy").',
      'The groups are the seafront strip and the area south of the road, so each paragraph follows one part of the map.',
      'S8 appears in several forms: "were demolished to make way for", "was turned into", "was rebuilt as".',
      'The overview states both the character of the change (fishing to tourism) and what stayed the same.' ]
  });

  M.push({
    id: 'm-map-lake', promptId: 'p-map-lake', band: '8+', words: 182, title: 'A lakeside area, 1980 and 2020',
    paragraphs: [
      { role: 'intro', text: 'The two maps compare the area surrounding a lake in 1980 and 2020.' },
      { role: 'overview', text: 'Overall, the area changed from a largely rural landscape of farmland and forest into one used mainly for housing and leisure. Farmland and forest shrank considerably, whereas the lake and the village remained, and the marsh was protected rather than developed.' },
      { role: 'detail', text: 'The most extensive development took place on the farmland on either side of the lake. To the west, a housing estate was built on nearly three quarters of the fields, leaving only a narrow strip of farmland in the south-west. To the east, a hotel replaced roughly the northern third of the farmland, so more of the eastern fields survived than the western ones.' },
      { role: 'detail', text: 'In the north, the eastern half of the forest was cut down to make way for a golf course, while the marsh between the forest and the lake was turned into a nature reserve. South of the lake, a footpath was created along the shore, the village was expanded, and the unpaved track along the southern edge was upgraded to a paved main road.' } ],
    patterns: ['S1', 'S2', 'S8'],
    notes: [
      'The overview gives the overall character of the change (rural to housing and leisure) and names the exception (the protected marsh).',
      'Fractions describe how much land changed use ("nearly three quarters", "roughly the northern third", "the eastern half").',
      'Details are grouped by area: the farmland east and west of the lake, then the north and the south.',
      'A comparison inside a map report ("more of the eastern fields survived than the western ones") keeps the paragraph analytical.' ]
  });

  M.push({
    id: 'm-proc-silkworm', promptId: 'p-proc-silkworm', band: '8+', words: 188, title: 'The life cycle of the silk moth',
    paragraphs: [
      { role: 'intro', text: 'The diagram illustrates the stages in the life of a silk moth, from egg to adult, including the stage at which the silk is produced.' },
      { role: 'overview', text: 'Overall, the silk moth\'s life cycle is a natural process with six stages, beginning when tiny eggs hatch and ending when an adult female lays a new batch of eggs. The silk itself is produced in the middle of the cycle, when the silkworm spins its cocoon.' },
      { role: 'detail', text: 'At the first stage, the eggs hatch after about 10 days, and a small silkworm comes out of each one. The silkworm then feeds on mulberry leaves for about 4 weeks, the longest period shown in the diagram. After that, it spins a cocoon around itself from a single silk thread about 900 metres long, a task that takes only 3 days.' },
      { role: 'detail', text: 'Next, inside the cocoon, the silkworm becomes a pupa and slowly changes shape for around 2 weeks. An adult moth then breaks out of the cocoon, although it is unable to fly or to eat. Finally, the female moth lays between 300 and 500 eggs and dies shortly afterwards, and the cycle begins again.' } ],
    patterns: ['S1', 'S2', 'S7'],
    notes: [
      'A natural life cycle is described in the active voice: "the eggs hatch", "it spins", "the moth breaks out".',
      'The overview counts the six stages, names the start and the end, and says where the silk comes from.',
      'Every figure in the diagram (10 days, 4 weeks, 900 metres, 3 days, 2 weeks, 300–500 eggs) is used once.',
      'Sequencers change in every sentence: "At the first stage", "then", "After that", "Next", "Finally".',
      'Comparisons inside a process report are time comparisons: "the longest stage in the cycle", "only 3 days".' ]
  });

  M.push({
    id: 'm-proc-coconut-sugar', promptId: 'p-proc-coconut-sugar', band: '8+', words: 180, title: 'Making coconut sugar in Thailand',
    paragraphs: [
      { role: 'intro', text: 'The diagram illustrates the stages involved in producing coconut sugar in Thailand, starting from the sap of the coconut palm.' },
      { role: 'overview', text: 'Overall, making coconut sugar is a linear, man-made process with seven stages, beginning with the collection of sap from the palm and ending with blocks of sugar being packed. The first three stages gather and clean the sap, while the last four turn it into solid sugar.' },
      { role: 'detail', text: 'At the first stage, the coconut palm is tapped: its flower stalk is cut so that the sap drips into a tube. These tubes are collected twice a day, yielding about 10 litres of sap per tree. The sap is then filtered through a cloth to remove any dirt.' },
      { role: 'detail', text: 'Next, the sap is boiled in a wok over a fire for 3 to 4 hours until it becomes a thick syrup. This syrup is beaten as it cools, after which it is poured into moulds, where it sets in 30 minutes. Finally, the blocks of sugar are wrapped and packed; around 10 litres of sap are needed to produce 1.5 kg of sugar.' } ],
    patterns: ['S1', 'S2', 'S7'],
    notes: [
      'A man-made process uses the present simple passive: "is cut", "are collected", "is poured", "are wrapped".',
      'The seven stages split into two clear phases: gathering the sap (stages 1–3) and turning it into sugar (stages 4–7).',
      '"after which" and "where it sets" join two stages in one sentence without losing either.',
      'The yield figure (10 litres of sap for 1.5 kg of sugar) is reported at the end as a fact from the diagram, not as a comment.' ]
  });

  M.push({
    id: 'm-proc-rubber', promptId: 'p-proc-rubber', band: '8+', words: 187, title: 'From rubber tree to rubber products',
    paragraphs: [
      { role: 'intro', text: 'The diagram illustrates how latex from rubber trees in the south of Thailand is made into two products: concentrated latex for gloves and smoked rubber sheets for tyres.' },
      { role: 'overview', text: 'Overall, the process is man-made and has eight stages. After two shared stages in which the latex is gathered, it divides into two separate routes: a short one producing liquid latex for gloves and a much longer one producing dry sheets for tyres.' },
      { role: 'detail', text: 'At the first stage, the trees are tapped at night: the bark is cut, and latex drips out for 3 to 4 hours. The latex is then collected in buckets and filtered. On the first route, it is spun in a centrifuge, which doubles its rubber content from 30% to 60%, before moulds are dipped into it to make gloves.' },
      { role: 'detail', text: 'On the second route, acid is added so that the latex coagulates, and it sets in trays overnight. The solid rubber is then rolled into sheets 3 mm thick, after which these are smoked and dried at 60 °C for 4 days. Finally, the dried sheets are packed into 110 kg bales for use in tyres.' } ],
    patterns: ['S1', 'S2', 'S7'],
    notes: [
      'A branching process is reported trunk first, then one route per paragraph, so the reader never loses track of which product is being made.',
      'The overview counts the stages and describes the shape of the process (two shared stages, then two routes of different length).',
      'Present simple passive throughout, with "On the first route" / "On the second route" as signposts.',
      'A relative clause ("which doubles its rubber content from 30% to 60%") turns a stage detail into a precise comparison.' ]
  });

  M.push({
    id: 'm-proc-pineapple', promptId: 'p-proc-pineapple', band: '8+', words: 178, title: 'Canning pineapple',
    paragraphs: [
      { role: 'intro', text: 'The diagram illustrates how fresh pineapples are turned into canned fruit at a factory in Thailand.' },
      { role: 'overview', text: 'Overall, canning pineapple is a linear, industrial process consisting of ten stages, from the arrival of fresh fruit at the factory to the dispatch of labelled cans for export. The first six stages prepare the fruit, whereas the final four fill, seal, heat and pack the cans.' },
      { role: 'detail', text: 'Once harvested, the pineapples reach the factory within 24 hours, where they are graded by size and any damaged fruit is removed. After being washed with clean water, they are peeled and cored by a machine at a rate of 120 fruits a minute. Any remaining eyes are then trimmed off by hand before the fruit is sliced into 1 cm rings or chunks.' },
      { role: 'detail', text: 'At the seventh stage, cans are filled with the fruit and a light syrup, after which the air is removed and the lids are sealed. The sealed cans are then sterilised by being heated at 100 °C for 20 minutes. Finally, they are cooled, labelled and packed in boxes for export.' } ],
    patterns: ['S1', 'S2', 'S7'],
    notes: [
      'Ten stages are covered in eight sentences by joining stages with "where", "after being", "before" and "after which", so none is missed.',
      'The overview counts the stages and splits them into fruit preparation (1–6) and canning (7–10).',
      'A fronted participle ("Once harvested,") and a passive gerund ("After being washed") give range at C1 level.',
      'All four figures in the diagram (24 hours, 120 a minute, 1 cm, 100 °C for 20 minutes) are reported exactly.' ]
  });

  M.push({
    id: 'm-map-thai-town', promptId: 'p-map-thai-town', band: '8+', words: 181, title: 'A town in north-eastern Thailand, 2005 and 2025',
    paragraphs: [
      { role: 'intro', text: 'The two maps illustrate the changes that took place in the heart of a small north-eastern Thai town between 2005 and 2025.' },
      { role: 'overview', text: 'Overall, the town centre became more modern and more built-up, with most of the old buildings replaced on the same sites and part of the farmland developed. Transport links also improved, while the temple and the river remained unchanged.' },
      { role: 'detail', text: 'North of the main road, the wet market in the north-west was rebuilt as a covered market, and the open field next to it was converted into a car park. The temple in the north-east was left as it was. The main road itself, which runs from east to west through the centre, was widened.' },
      { role: 'detail', text: 'The area south of the road changed even more. The wooden houses in the south-west were demolished and replaced by townhouses, and a hospital was built on most of the rice fields to the east of them, leaving only a small area of fields in the south-east corner. On the western edge of the town, the ferry across the river was replaced by a bridge.' } ],
    patterns: ['S1', 'S2', 'S8'],
    notes: [
      'The main road divides the map, so the two detail paragraphs cover the north and the south of it.',
      'Past simple passive for each change: "was rebuilt as", "was converted into", "were demolished and replaced by".',
      'Unchanged features (the temple, the river) are part of the overview and are named again in the detail.',
      'A participle clause ("leaving only a small area of fields in the south-east corner") shows how much of the farmland survived.' ]
  });

  M.push({
    id: 'm-map-port-plan', promptId: 'p-map-port-plan', band: '8+', words: 180, title: 'A riverside warehouse district: now and planned',
    paragraphs: [
      { role: 'intro', text: 'The two maps compare the current layout of a former warehouse district on a riverbank with the proposed redevelopment of the area.' },
      { role: 'overview', text: 'Overall, the plan will transform the district from an industrial port area into a place for living, culture and leisure. Every industrial use will disappear and access will improve considerably, while Riverside Road and the row of shophouses will remain unchanged.' },
      { role: 'detail', text: 'Along the river, the old wooden pier will be replaced by a ferry terminal, and a public walkway will be built along the riverbank. The warehouses to the south of the river will not be demolished but converted into an arts centre and restaurants, whereas the container yard to the east of them will make way for an apartment complex.' },
      { role: 'detail', text: 'To the south of Riverside Road, which will remain unchanged, the freight railway will be converted into a light rail line for passengers, with a new station in the centre of the district. The empty land in the south-east will be developed as a school and a park, while the shophouses in the south-west will be kept.' } ],
    patterns: ['S1', 'S2', 'S8'],
    notes: [
      'A plan for the future takes the future passive throughout: "will be replaced by", "will be converted into", "will be developed as".',
      'The road divides the district, so the riverside changes and the southern changes form the two groups.',
      'The difference between conversion and demolition is reported exactly ("will not be demolished but converted into").',
      'A relative clause ("which will remain unchanged") names an unchanged feature without a separate sentence.' ]
  });

  M.push({
    id: 'm-map-island', promptId: 'p-map-island', band: '8+', words: 185, title: 'The east coast of an island, 1985, 2005 and 2025',
    paragraphs: [
      { role: 'intro', text: 'The three maps illustrate how the eastern shore of a Gulf of Thailand island developed between 1985 and 2025.' },
      { role: 'overview', text: 'Overall, the coast was transformed from a quiet fishing and farming area into a busy tourist resort in two waves, with small-scale tourism arriving by 2005 and large-scale development following by 2025. Only the beach and the sea never changed.' },
      { role: 'detail', text: 'In 1985, there was a boatyard in the north, a coconut plantation in the centre and a fishing village in the south, with forest to the west and a short wooden jetty. By 2005, the boatyard had been replaced by a bungalow resort, a road had been built along the southern edge, and the jetty had become a longer concrete pier, but the other features were unchanged.' },
      { role: 'detail', text: 'The second wave, between 2005 and 2025, was far more extensive: the bungalows gave way to a large hotel, villas were built on the plantation, and the fishing village was redeveloped as shops and restaurants. The pier was replaced by a marina, while roughly half of the forest was cleared for an airstrip, which runs from north to south.' } ],
    patterns: ['S1', 'S2', 'S8'],
    notes: [
      'Three maps are grouped by period (1985–2005, then 2005–2025), so each detail paragraph describes one wave of change.',
      'The first map is described once, briefly, as the starting point; after that, only changes are reported.',
      'Past perfect passive ("By 2005, the boatyard had been replaced") marks changes completed before a map date.',
      'The overview states the character of the change and its two-stage shape, and names what never changed.' ]
  });

  M.push({
    id: 'm-map-park', promptId: 'p-map-park', band: '8+', words: 181, title: 'Lotus Park: layout',
    paragraphs: [
      { role: 'intro', text: 'The map illustrates how Lotus Park, a public open space in a city in Thailand, is laid out.' },
      { role: 'overview', text: 'Overall, the park is organised around a large lake in its centre, with sports and play facilities near the edges. The entrance and the parking area are in the south, beside the main road, while the western side is mostly taken up by a flower garden.' },
      { role: 'detail', text: 'Visitors enter the park through the main gate, which is in the middle of the southern boundary, on the main road. A short footpath leads north from the gate to the lake. The car park lies in the south-west corner, while the playground occupies the south-east corner.' },
      { role: 'detail', text: 'The lake lies at the heart of the park, with a café and, next to the café, the toilets on its eastern side. A football field stretches across most of the northern part of the park, directly north of the lake, and the flower garden fills most of the western side, between the car park and the northern edge. The garden and the field are both larger than the lake.' } ],
    patterns: ['S1', 'S2', 'S8'],
    notes: [
      'A single plan with no change is SPACE + COMPARE: present simple throughout and location language instead of change verbs.',
      'The S8 location slot ("to the east of", "directly north of", "in the south-west corner") carries every sentence; no left or right.',
      'The overview gives the organising idea (everything around a central lake) and the main zones.',
      'Details are grouped by area: the southern entrance zone first, then the centre, north and west.' ]
  });
})();

/* Every prompt now has a model: give each prompt its modelId (the app also finds models by promptId). */
(function () {
  var C = window.CONTENT; if (!C || !C.PROMPTS || !C.MODELS) return;
  C.PROMPTS.forEach(function (p) {
    if (p.modelId) return;
    var m = C.MODELS.filter(function (x) { return x.promptId === p.id; })[0];
    if (m) p.modelId = m.id;
  });
})();
