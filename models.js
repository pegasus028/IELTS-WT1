/* ===========================================================================
   CHART CONTROL — models.js
   Original Band 8+ model answers (160–190 words) for prompts in the bank,
   plus one Band 6 contrast version. Every model is ours; none reproduces a
   published answer. More models (one for every other prompt, including the
   prompts-3.js batch) live in models-2.js. Check them all with
   `node tools/models-check.js`.

   SHAPE
   { id, promptId, band:'8+', words, title,
     paragraphs:[{role:'intro'|'overview'|'detail', text}],   // P1–P4: intro, overview, detail A, detail B
     patterns:['S1',…],          // which of the eight sentence patterns S1–S8 appear
     notes:['…'],                // 3–5 short teacher notes on why it scores
     contrast:{ band:'6', words, paragraphs:[…], faults:[{tag, note}] } }   // optional;
                                 // only a contrast may use role 'conclusion'

   NAMING: S1–S8 are sentence patterns, P1–P4 are paragraphs (never mixed).
     S1 intro (The [visual] shows [what] in [where] between [Y1] and [Y2])
     S2 overview (Overall, [general claim], while/whereas [contrast])
     S3 change verb (rose/fell [adverb] from X to Y)
     S4 change noun (There was a [adjective] rise/fall in …, from X to Y)
     S5 compare (A was far/slightly higher than B, at X and Y respectively)
     S6 multiple/share (twice as high as / accounted for [fraction] of)
     S7 sequence (At the [nth] stage, … is [pp] … before being [pp])
     S8 space (was demolished / converted into / extended to the [direction] of)
   word counts use Writer.words on the paragraphs joined by blank lines.
   =========================================================================== */
(function () {
  var M = window.CONTENT.MODELS;

  /* ---------------------------------------------------- line: museums */
  M.push({
    id: 'm-line-museums', promptId: 'p-line-museums', band: '8+', words: 168, title: 'Museum visitors',
    paragraphs: [
      { role: 'intro', text: 'The line graph shows how many people visited three museums in a European city over a ten-year period from 2010 to 2020, with figures given in thousands.' },
      { role: 'overview', text: 'Overall, attendance at the Science Museum rose strongly throughout the period, whereas both the Art Gallery and the History Museum saw a decline. Although the Art Gallery was the most visited museum at the start, the Science Museum had overtaken it by the middle of the decade.' },
      { role: 'detail', text: 'In 2010, the Science Museum received around 420,000 visitors, considerably fewer than the Art Gallery\'s 610,000. Its numbers then climbed steadily, passing the Art Gallery in 2014 and reaching approximately 760,000 in 2020, almost double the initial figure.' },
      { role: 'detail', text: 'By contrast, visits to the Art Gallery fell gradually from 610,000 to 520,000 over the same period, despite a slight recovery in 2016. The History Museum remained the least popular of the three: it began the decade at 380,000 and, apart from a small rise in 2018, dropped to a low of roughly 260,000 by 2020.' } ],
    patterns: ['S1', 'S2', 'S3', 'S5'],
    notes: [
      'The overview gives two general truths (one rises, two fall) plus the crossover, with no figures.',
      'Paragraphs are grouped by story (rising vs falling), not by museum or by year.',
      'Only first, last, crossover and extreme figures are used; the rest of the data is deliberately left out.',
      'Every detail sentence carries a number, and "considerably fewer than", "almost double" and "the least popular" are comparisons.',
      'The rubric is paraphrased ("how many people visited", "a ten-year period"), not copied.' ],
    contrast: {
      band: '6', words: 165,
      paragraphs: [
        { role: 'intro', text: 'The graph shows the number of visitors to three museums from 2010 to 2020. There is a Science Museum, an Art Gallery and a History Museum.' },
        { role: 'detail', text: 'In 2010 the Science Museum had 420 thousand visitors. In 2012 it had 470 thousand. In 2014 it had 570 thousand visitors and in 2016 it increased to 630 thousand. In 2018 it was 710 thousand and in 2020 it reached 760 thousand.' },
        { role: 'detail', text: 'The Art Gallery had 610 thousand visitors in 2010. It decreased to 590 thousand in 2012 and 560 thousand in 2014. In 2016 it increased a little to 570 thousand, but in 2018 it was 540 thousand and in 2020 it was 520 thousand.' },
        { role: 'detail', text: 'The History Museum had 380 thousand in 2010 and then it decreased to 350, 330 and 290 thousand. In 2018 it was 300 thousand and in 2020 it was 260 thousand.' },
        { role: 'conclusion', text: 'In conclusion, the Science Museum became more popular because science is interesting for young people, but the other museums lost visitors.' } ],
      faults: [
        { tag: 'ta-no-overview', note: 'There is no overview sentence at all, so Task Achievement is capped at Band 5.' },
        { tag: 'ta-mechanical', note: 'Every year is reported for every museum in order: narration, not selection, and no comparison between lines.' },
        { tag: 'gra-pattern', note: 'Almost every sentence has the same shape ("In YEAR it was X"), which the descriptors call a limited range of structures.' },
        { tag: 'ta-conclusion', note: 'The final paragraph adds an invented reason; Task 1 has no conclusion and no explanations.' } ] }
  });

  /* ------------------------------------------------- bar: screen time */
  M.push({
    id: 'm-bar-screentime', promptId: 'p-bar-screentime', band: '8+', words: 173, title: 'Weekly screen time',
    paragraphs: [
      { role: 'intro', text: 'The bar chart compares the average weekly time, in hours, that four age groups in one country devoted to social media, streaming video and gaming in 2023.' },
      { role: 'overview', text: 'Overall, the youngest group spent the most time on all three activities, and time spent on social media and gaming fell sharply with age. Streaming video, however, was used for a broadly similar number of hours by every group.' },
      { role: 'detail', text: 'Social media was the most time-consuming activity for the two younger groups: teenagers aged 13 to 17 spent 21 hours a week on it, and 18-to-29-year-olds 18 hours. The teenage figure was almost double that of the 30–49 group, at 11 hours, and more than three times the six hours recorded by people aged 50 and over.' },
      { role: 'detail', text: 'Gaming showed an even steeper decline, from 12 hours a week among teenagers to just one hour for the oldest group. In contrast, streaming video ranged only between 12 and 15 hours across all four groups, and it was actually the leading activity for those aged 30 and above.' } ],
    patterns: ['S1', 'S2', 'S5', 'S6'],
    notes: [
      'A grouped bar chart is organised by the series (activity), not by the age groups on the axis.',
      'The overview names the exception (streaming is flat) as well as the main pattern.',
      'Multiples ("almost double", "more than three times") replace lists of every bar.',
      '"However" and "in contrast" mark the exception without a chain of connectors.' ]
  });

  /* ------------------------------------------------------ pie: energy */
  M.push({
    id: 'm-pie-energy', promptId: 'p-pie-energy', band: '8+', words: 169, title: 'Sources of electricity',
    paragraphs: [
      { role: 'intro', text: 'The two pie charts illustrate how the electricity produced in one country was divided among five sources in 2000 and in 2020.' },
      { role: 'overview', text: 'Overall, the country\'s electricity mix changed substantially over the two decades. Coal, which had dominated in 2000, lost more than half of its share, while wind and solar power expanded from a minor source into one of the largest. The contributions of nuclear and hydro power stayed almost unchanged.' },
      { role: 'detail', text: 'In 2000, coal accounted for nearly half of all electricity, at 48%, more than twice the share of natural gas (22%). Nuclear and hydro power supplied 15% and 10% respectively, and wind and solar together made up only 5%.' },
      { role: 'detail', text: 'By 2020, coal\'s share had fallen to 18%, placing it third. Natural gas rose to 30% to become the leading source, but the most striking change was in renewables: wind and solar generated 27% of electricity, more than five times their earlier proportion. Nuclear power slipped marginally to 14%, while hydro edged up by one percentage point to 11%.' } ],
    patterns: ['S1', 'S2', 'S3', 'S6'],
    notes: [
      'Two pies are treated as a change over time: the second detail paragraph describes change, not a second static list.',
      'Proportion language varies: "accounted for", "share", "supplied", "made up", "generated".',
      'The flat categories (nuclear, hydro) are a legitimate key feature and get one sentence, not none.',
      '"Percentage point" is used correctly for a one-point change.' ]
  });

  /* --------------------------------------------------- table: salaries */
  M.push({
    id: 'm-table-salaries', promptId: 'p-table-salaries', band: '8+', words: 182, title: 'Teachers\' salaries',
    paragraphs: [
      { role: 'intro', text: 'The table gives information about secondary school teachers\' pay at two career points, together with their weekly working hours, in five countries in 2022.' },
      { role: 'overview', text: 'Overall, German teachers were by far the best paid at both stages and also worked the shortest week, whereas Thai teachers earned dramatically less than all the others. In every country, salaries after 15 years were considerably higher than starting salaries, and Japanese teachers worked the longest hours.' },
      { role: 'detail', text: 'Starting salaries in Germany stood at $62,000, well above the $44,000 offered in the USA and roughly double the figures for Korea and Japan, at $33,000 and $31,000 respectively. Thailand\'s starting salary of $9,000 was less than a sixth of Germany\'s. The same ranking held after 15 years, when German pay reached $81,000 and Thai pay only $17,000, although Japanese and Korean salaries had risen by more than three quarters, to $55,000 and $58,000 respectively.' },
      { role: 'detail', text: 'Working hours showed a different pattern: Germany had the lightest load at 40 hours and Japan the heaviest at 54, while the other three countries fell in a narrow band between 43 and 46 hours.' } ],
    patterns: ['S1', 'S2', 'S5', 'S6'],
    notes: [
      'The story is found in the columns: salary columns share a ranking, the hours column does not, so they get separate paragraphs.',
      'Whole rows are compared ("the same ranking held"), never cell by cell.',
      'Fractions and multiples ("roughly double", "less than a sixth", "more than three quarters") turn raw numbers into comparisons.',
      'A five-country table is covered without listing all fifteen cells.' ]
  });

  /* ------------------------------------------------- process: glass */
  M.push({
    id: 'm-proc-glass', promptId: 'p-proc-glass', band: '8+', words: 182, title: 'Recycling glass bottles',
    paragraphs: [
      { role: 'intro', text: 'The diagram illustrates the process by which used glass bottles are recycled into new ones.' },
      { role: 'overview', text: 'Overall, this is a cyclical, man-made process consisting of eight main stages. It begins with the collection of empty bottles and ends with new bottles being delivered to shops, from where they eventually re-enter the cycle. The stages fall into two broad phases: preparing the waste glass, and manufacturing the new product.' },
      { role: 'detail', text: 'At the first stage, used bottles are placed in bottle banks by the public and are then transported by lorry to a recycling plant. There, they are cleaned with high-pressure water in order to remove any labels and residue, after which they are sorted by colour into clear, green and brown glass.' },
      { role: 'detail', text: 'Once sorted, the glass is crushed into small fragments known as cullet. This is fed into a furnace, where it is melted at a temperature of between 600 and 800 degrees Celsius together with a quantity of new raw materials. The molten glass is subsequently moulded into bottles, which are finally filled with drinks and delivered to shops, ready to be used again.' } ],
    patterns: ['S1', 'S2', 'S7'],
    notes: [
      'The overview of a process states the number of stages, the start and end, and whether it is cyclical or linear.',
      'Present simple passive throughout for a man-made process; every stage is named, none is skipped.',
      'Sequencers vary: "at the first stage", "then", "there", "after which", "once sorted", "subsequently", "finally".',
      'The eight stages split into two paragraphs at the natural midpoint (waste preparation vs manufacturing).' ]
  });

  /* ------------------------------------------------------- map: riverside */
  M.push({
    id: 'm-map-riverside', promptId: 'p-map-riverside', band: '8+', words: 188, title: 'Riverside town centre',
    paragraphs: [
      { role: 'intro', text: 'The two maps show how the centre of the town of Riverside changed between 1995 and 2025.' },
      { role: 'overview', text: 'Overall, the town centre was transformed from a mixed industrial and commercial area into a largely residential and leisure-oriented one. Industry disappeared entirely, several sites were redeveloped for shopping, housing and recreation, and traffic was moved out of the centre, although the river, bridge and bus station remained in place.' },
      { role: 'detail', text: 'The most significant change occurred in the east, where the factory was demolished and replaced by a group of apartment blocks. In the west, the car park next to the bus station was converted into a shopping mall, while the bus station itself was left unchanged. In the centre, the cinema and the small shops around it were knocked down to make way for a pedestrian square lined with cafés.' },
      { role: 'detail', text: 'The southern part of the town also changed considerably, with the park in the south-west extended eastwards. The main road, which previously ran straight through the centre, was pedestrianised south of the bridge. To carry the traffic, a new ring road was built around the southern edge of the town.' } ],
    patterns: ['S1', 'S2', 'S8'],
    notes: [
      'The overview states the overall character of the change and names what stayed the same.',
      'Compass points and landmarks ("in the east", "next to the bus station", "south of the bridge") locate every feature; no left/right.',
      'Past simple passive for what happened ("was demolished", "was converted into"); a relative clause adds the earlier state.',
      'Details are grouped by area (east, west, centre, then south), not listed feature by feature.' ]
  });

  /* ------------------------------------------------------ mixed: coffee */
  M.push({
    id: 'm-mixed-coffee', promptId: 'p-mixed-coffee', band: '8+', words: 181, title: 'Coffee consumption and price',
    paragraphs: [
      { role: 'intro', text: 'The bar chart illustrates how many cups of coffee people in five countries drank each week in 2024, while the table gives the typical price of a cup in each of them.' },
      { role: 'overview', text: 'Overall, Finland stood out as both the heaviest consumer and the most expensive place to buy coffee, whereas Thailand drank the least. There was no simple link between price and consumption, since two of the cheaper countries also had relatively high figures.' },
      { role: 'detail', text: 'In terms of consumption, Finns drank 21 cups a week, half as many again as Italians, at 14, and almost twice the Brazilian figure of 12. Japan and Thailand trailed well behind, at eight and five cups respectively, so the average Finn drank more than four times as much coffee as the average Thai.' },
      { role: 'detail', text: 'Prices showed a different ranking: a cup cost $3.90 in Finland and $3.60 in Japan, whereas in Italy and Brazil it was far cheaper, at $1.40 and $1.10 respectively. Thailand, at $2.20, lay between the two groups, meaning that the country with the lowest consumption was neither the cheapest nor the most expensive.' } ],
    patterns: ['S1', 'S2', 'S5', 'S6'],
    notes: [
      'One introduction covers both visuals, and the overview gives one headline for each plus a link between them.',
      'Each visual gets its own detail paragraph; the two are never mixed in one paragraph.',
      'Multiples ("half as many again", "almost twice", "more than four times") do the comparing.',
      'The final sentence links the two visuals through Thailand without adding an opinion or a reason.' ]
  });

  /* ------------------------------------------------------ line: clubs */
  M.push({
    id: 'm-line-clubs', promptId: 'p-line-clubs', band: '8+', words: 164, title: 'School club membership',
    paragraphs: [
      { role: 'intro', text: 'The line graph illustrates membership of three clubs at a secondary school over the nine years from 2016 to 2024.' },
      { role: 'overview', text: 'Overall, the esports club grew from nothing into the largest of the three, while football membership remained almost flat. Badminton followed a very different course, falling sharply until 2020 and then recovering most of its earlier numbers.' },
      { role: 'detail', text: 'The football club was the biggest for most of the period, with membership fluctuating only between 115 and 125 students throughout. The esports club, which did not exist in 2016 or 2017, attracted 15 members in 2018 and then expanded rapidly, passing 100 in 2022 and overtaking football the following year. By 2024 it had 150 members, around 30 more than football.' },
      { role: 'detail', text: 'In contrast, badminton membership dropped steadily from 90 students in 2016 to a low of just 40 in 2020, less than half its original level. Numbers then rose in every subsequent year, reaching 85 in 2024, although this was still slightly below the starting figure.' } ],
    patterns: ['S1', 'S2', 'S3', 'S5'],
    notes: [
      'Nine years of data are reduced to start, low point, crossover and end figures.',
      'The flat line gets one sentence with a range ("between 115 and 125"), not nine numbers.',
      'The crossover is described with "overtaking football the following year" and a comparison ("around 30 more").',
      '"With + noun + -ing" and a relative clause ("which did not exist…") add complexity without losing accuracy.' ]
  });

  /* ---------------------------------------------------- pie: holidays */
  M.push({
    id: 'm-pie-holidays', promptId: 'p-pie-holidays', band: '8+', words: 181, title: 'Overseas holiday destinations',
    paragraphs: [
      { role: 'intro', text: 'The two pie charts compare the destinations chosen by residents of one Asian country for overseas trips in 2010 and in 2024.' },
      { role: 'overview', text: 'Overall, there was a marked shift in where people travelled. Japan and Korea became far more popular, while China lost most of its share and trips to South-East Asia and Europe also declined. The proportion going to other destinations was unchanged.' },
      { role: 'detail', text: 'In 2010, South-East Asia was the leading destination, accounting for just under a third of trips at 31%, with China close behind on 28%. Together, these two regions attracted 59% of travellers, well over half of the total. Europe and Japan received 14% and 12% respectively, whereas Korea, at 9%, and other destinations, at 6%, were the least visited.' },
      { role: 'detail', text: 'By 2024, Japan had almost tripled its share to 34%, making it the most popular destination by a clear margin. Korea nearly doubled to 17%, overtaking Europe, which slipped to 11%. In contrast, South-East Asia\'s share fell to 22%, and the most dramatic decline was in China, which dropped to just 10%, roughly a third of its earlier figure.' } ],
    patterns: ['S1', 'S2', 'S3', 'S6'],
    notes: [
      'The overview groups the six slices into risers, fallers and the one that stayed the same, with no figures.',
      'Paragraph 3 ranks the 2010 chart; paragraph 4 describes change, so the two paragraphs do different jobs.',
      'Fractions ("just under a third", "well over half", "roughly a third") sit beside the percentages, not instead of them.',
      'Past perfect ("had almost tripled") marks change completed by 2024.' ]
  });

  /* ------------------------------------------------------- table: rent */
  M.push({
    id: 'm-table-rent', promptId: 'p-table-rent', band: '8+', words: 179, title: 'Apartment rents in four Asian cities',
    paragraphs: [
      { role: 'intro', text: 'The table compares what a one-room apartment cost to rent each month, in US dollars, in four Asian cities at five-year intervals from 2010 to 2025.' },
      { role: 'overview', text: 'Overall, rents rose in three of the four cities, most dramatically in Ho Chi Minh City, which overtook Bangkok by the end of the period. Singapore was by far the most expensive city throughout, whereas Tokyo was the only city where rents barely changed.' },
      { role: 'detail', text: 'Singapore\'s rent was already the highest in 2010, at $1,450, and it climbed steadily to $2,350 in 2025, a rise of around 60%. Tokyo, the second most expensive city, saw almost no movement: rents fluctuated between $960 and $1,010, finishing the period only $30 higher than they began.' },
      { role: 'detail', text: 'The two South-East Asian cities were much cheaper but grew faster: Bangkok\'s rent rose from $320 to $520 between 2010 and 2020, then levelled off at $540. Ho Chi Minh City, which had the lowest figure in 2010 at just $210, more than doubled its rent to $560 by 2025, making it slightly more expensive than Bangkok for the first time.' } ],
    patterns: ['S1', 'S2', 'S3', 'S5'],
    notes: [
      'A table with years in columns is TREND mode: rows are described as lines, with trend verbs and start/end figures.',
      'The four rows are split into an expensive pair and a cheap pair, so each paragraph has a comparison inside it.',
      'The flat row (Tokyo) is described with a range and "barely changed", which is a key feature, not a gap.',
      'The crossover between Bangkok and Ho Chi Minh City appears in both the overview (no figures) and the detail (with figures).' ]
  });

  /* -------------------------------------------------- process: turtle */
  M.push({
    id: 'm-proc-turtle', promptId: 'p-proc-turtle', band: '8+', words: 186, title: 'The life cycle of a sea turtle',
    paragraphs: [
      { role: 'intro', text: 'The diagram illustrates the stages in a sea turtle\'s life, from the laying of eggs to the return of the adult female to the beach.' },
      { role: 'overview', text: 'Overall, this is a natural, cyclical process with seven main stages, which take place partly on land and mostly at sea. It begins when eggs are buried on a beach and ends when a mature female comes back to the same beach to nest, after which the cycle repeats.' },
      { role: 'detail', text: 'The cycle starts when a female digs a nest in the sand and lays around 100 eggs. These are warmed by the sun for approximately 60 days, and the hatchlings then emerge at night and crawl straight to the sea. Once in the water, the young turtles drift in the open ocean for between five and ten years, feeding on small animals.' },
      { role: 'detail', text: 'Later, as sub-adults, they move to shallow coastal waters, where they feed on seagrass and jellyfish. The turtles reach maturity at 20 to 30 years of age and mate offshore. Finally, the female returns to the beach where she was born, lays her own eggs and the process begins again.' } ],
    patterns: ['S1', 'S2', 'S7'],
    notes: [
      'A natural cycle is written mainly in the present simple active ("the hatchlings emerge", "they drift"); the passive appears only where the turtle is not the agent ("are warmed by the sun").',
      'The overview gives the stage count, the start and end, and the land/sea split, with no detail.',
      'The seven stages split at the move from land to sea, so each detail paragraph has a clear theme.',
      'The figures in the diagram (100 eggs, 60 days, 5–10 years, 20–30 years) are all used once.' ]
  });
})();
