/* ===========================================================================
   QUILLMOOR ACADEMY · THE OBSERVATORY — example-levels.js
   Levelled example lines for the Scriptorium's "Show an example" buttons
   (writer.js, WP9, 20 Oct 2026). Four modes × two source prompts × seven
   boxes: the three plan boxes (big picture, Group A, Group B) at A2 / B1 / B2 /
   C1 and the four paragraph boxes (introduction, overview, detail A, detail B)
   at A2 / B1 / B2. The C1 paragraphs come from the model answers in C.MODELS
   at run time, so they are not repeated here.

   Writer.examples(key, level, prompt) shows these lines only for a prompt that
   is NOT the source prompt, so every student sees the shape on a different
   chart from the one she is writing about. Two sources per mode guarantee
   that at least one is always another chart.

   Rules (skill ielts-writing-task-1 §5): the overview and the big picture
   carry no data values; every detail sentence carries a figure, a date or a
   label; every figure below is read from the ORIGINAL chart data in
   prompts*.js and checked by tools/writer-test.js (figures, "Overall,", word
   counts, the Scriptorium's own paragraph checks, no copied rubric).
   ES5 only (old iPads).
   =========================================================================== */
(function (global) {
  'use strict';
  global.EXAMPLE_LEVELS = {

    /* ================================================================ TREND */
    TREND: {
      /* Households with internet access, four countries 2005–2025 (% of households):
         Sweden 70 85 92 95 97 · Japan 60 78 88 93 95 · Thailand 12 28 52 78 88 · Kenya 2 8 18 35 52 */
      'p-line-internet': {
        big: {
          A2: 'All four countries went up. Sweden and Japan were high all the time. Thailand and Kenya started low and rose fast. Kenya was the lowest.',
          B1: 'Internet access rose in all four countries. Sweden and Japan were high from the start and ended close together; Thailand and Kenya began low but grew much faster, with Kenya still the lowest.',
          B2: 'Upward trend everywhere; two groups: high and stable (Sweden, Japan) versus a low start and a steep rise (Thailand, Kenya); Thailand the biggest rise; Kenya lowest throughout.',
          C1: 'Universal growth from two very different starting points: the high-access pair converged near the top, while the low-access pair closed much of the gap, Thailand most dramatically; Kenya remained last despite the steepest proportional rise.'
        },
        groupA: {
          A2: 'Sweden and Japan — the two high countries',
          B1: 'Sweden and Japan: high from the start, close together at the end',
          B2: 'The high-access pair, Sweden and Japan: already high in 2005 and converging by 2025',
          C1: 'The early adopters, Sweden and Japan, whose already high figures edged upwards and converged'
        },
        groupB: {
          A2: 'Thailand and Kenya — the two low countries that rose fast',
          B1: 'Thailand and Kenya: a low start and a big rise, Kenya still the lowest',
          B2: 'The low-access pair, Thailand and Kenya: steep growth from a low base, Kenya last throughout',
          C1: 'The late starters, Thailand and Kenya, whose steep climbs narrowed but did not close the gap'
        },
        intro: {
          A2: 'The line graph shows how many homes in four countries had the internet from 2005 to 2025.',
          B1: 'The line graph shows the proportion of homes with an internet connection in Sweden, Japan, Thailand and Kenya over a twenty-year period from 2005 to 2025.',
          B2: 'The line graph compares the share of households connected to the internet in four countries, Sweden, Japan, Thailand and Kenya, over the two decades from 2005 to 2025.'
        },
        overview: {
          A2: 'Overall, internet access went up in all four countries. Sweden and Japan were high from the start, but Thailand and Kenya started low and rose much faster. Kenya was still the lowest at the end.',
          B1: 'Overall, internet access rose in all four countries. Sweden and Japan had high figures from the start and finished very close together, whereas Thailand and Kenya began much lower but grew far more quickly, although Kenya remained the lowest throughout.',
          B2: 'Overall, household internet access increased in every country shown, but from two very different starting points. Sweden and Japan were high throughout and converged by the end of the period, whereas Thailand and Kenya started from a low base and climbed steeply, with Thailand recording the largest rise and Kenya remaining the least connected.'
        },
        detailA: {
          A2: 'In 2005, 70% of homes in Sweden had the internet, and 60% in Japan. Both went up every five years. In 2025, Sweden reached 97% and Japan 95%, so Japan was only a little lower than Sweden.',
          B1: 'Sweden had the highest figure at the start, with 70% of households online in 2005, compared with 60% in Japan. Both countries rose steadily over the period, and by 2025 Sweden had reached 97% while Japan was close behind at 95%. The gap between the two countries was therefore much smaller at the end than at the beginning.',
          B2: 'Sweden and Japan were already well connected in 2005, at 70% and 60% respectively. Both figures rose steadily throughout the period, with Sweden reaching 92% in 2015 and Japan 88%. By 2025 the two countries had almost converged, at 97% and 95%, so the difference between them had narrowed considerably over the twenty years.'
        },
        detailB: {
          A2: 'Thailand started very low: only 12% of homes had the internet in 2005, but this rose to 52% in 2015 and 88% in 2025. Kenya was the lowest country, going up from 2% in 2005 to 52% in 2025, the same as Thailand ten years earlier.',
          B1: 'Thailand showed the biggest rise of the four countries. In 2005 only 12% of Thai households were online, but the figure climbed to 52% in 2015 and reached 88% by 2025. Kenya followed a similar path from an even lower start, rising from just 2% to 52%, although it was still the lowest of the four at the end.',
          B2: 'Thailand recorded the most dramatic growth, rising from just 12% in 2005 to 52% in 2015 and 88% in 2025, more than seven times its starting level. Kenya, which began with only 2% of households connected, also climbed rapidly, to 35% in 2020 and 52% in 2025, yet it remained the least connected country throughout, and its final figure was the same as Thailand\'s a decade earlier.'
        }
      },
      /* International tourist arrivals in Thailand (millions): 2015 29.9 · 2017 35.6 · 2019 39.9 · 2020 6.7 · 2021 0.4 · 2023 28.2 · 2025 36.5 */
      'p-bar-tourists': {
        big: {
          A2: 'Arrivals went up to 2019, then fell very low in 2020 and 2021, then went up again. In 2025 the number was almost back to 2019.',
          B1: 'Arrivals rose steadily to a peak in 2019, collapsed in 2020 and 2021, and then recovered strongly, ending close to the earlier peak.',
          B2: 'A steady climb to a 2019 peak, a near-total collapse over the next two years, and a strong recovery that left arrivals just short of the peak by 2025.',
          C1: 'Three phases rather than one trend: sustained growth to a 2019 high, an almost complete collapse in 2020 and 2021, and a recovery that by 2025 had all but restored the earlier peak.'
        },
        groupA: {
          A2: '2015, 2017 and 2019 — the years that went up',
          B1: 'The rise: 2015 to 2019, up to the peak',
          B2: 'The growth years, 2015 to 2019, ending at the peak',
          C1: 'The pre-2020 climb: 2015, 2017 and 2019, culminating in the peak'
        },
        groupB: {
          A2: '2020, 2021, 2023 and 2025 — the fall and the recovery',
          B1: 'The collapse (2020 and 2021) and the recovery (2023 and 2025)',
          B2: 'The collapse of 2020 and 2021 and the rebound of 2023 and 2025',
          C1: 'The shock and the rebound: the 2020 and 2021 collapse set against the 2023 and 2025 recovery'
        },
        intro: {
          A2: 'The bar chart shows how many tourists from other countries came to Thailand in some years from 2015 to 2025, in millions.',
          B1: 'The bar chart illustrates how many foreign tourists visited Thailand in selected years between 2015 and 2025, with the figures given in millions.',
          B2: 'The bar chart gives information about international visitor numbers for Thailand, in millions, across seven selected years from 2015 to 2025.'
        },
        overview: {
          A2: 'Overall, the number of tourists went up until 2019, and then it fell very sharply in 2020 and 2021. After that, arrivals went up again, and in 2025 they were almost as high as in 2019.',
          B1: 'Overall, arrivals rose steadily to a peak in 2019 before collapsing almost completely over the next two years. A strong recovery followed, and by 2025 the number of visitors was close to its earlier high.',
          B2: 'Overall, tourist arrivals followed three clear phases: steady growth up to a peak in 2019, a dramatic collapse in 2020 and 2021, and a strong recovery from 2023. By the end of the period the figure had almost returned to its level before the collapse.'
        },
        detailA: {
          A2: 'In 2015, 29.9 million tourists came to Thailand. The number rose to 35.6 million in 2017 and then to 39.9 million in 2019. This was the highest figure in the whole period, and it was much higher than the 2015 number.',
          B1: 'Arrivals grew steadily in the first part of the period. In 2015 Thailand received 29.9 million international visitors, and this figure rose to 35.6 million two years later. The peak came in 2019, when 39.9 million tourists arrived, about ten million more than in 2015.',
          B2: 'The first three bars, for 2015, 2017 and 2019, show uninterrupted growth. From 29.9 million in 2015, arrivals climbed to 35.6 million in 2017 and reached a high of 39.9 million in 2019, roughly a third more than at the start of the period. No other year in the chart matched the 2019 peak.'
        },
        detailB: {
          A2: 'In 2020 the number fell to only 6.7 million, and in 2021 it was just 0.4 million, the lowest figure in the chart. Then tourists came back: 28.2 million arrived in 2023 and 36.5 million in 2025. The 2025 number was a little lower than the 2019 peak.',
          B1: 'Arrivals then collapsed, falling to 6.7 million in 2020 and to a low of just 0.4 million in 2021. However, the recovery was rapid: 28.2 million tourists visited in 2023, almost as many as in 2015, and the total climbed again to 36.5 million in 2025, only slightly below the 2019 peak.',
          B2: 'The following two years saw a dramatic fall, with arrivals dropping to 6.7 million in 2020, around a sixth of the previous year\'s total, and to a mere 0.4 million in 2021, far lower than in any other year. Numbers then rebounded strongly, reaching 28.2 million in 2023 and 36.5 million in 2025, which left the final figure just short of the 2019 high.'
        }
      }
    },

    /* ============================================================== COMPARE */
    COMPARE: {
      /* Homework hours per week, one school: English M3 2 / M4 3 / M5 4 · Maths 3 / 4 / 5 · Science 2 / 3 / 5 · Thai 1 / 1 / 2 */
      'p-bar-homework': {
        big: {
          A2: 'Older students do more homework in every subject. Maths has the most. Thai has the least.',
          B1: 'Homework rises from M3 to M5 in every subject; Maths (and Science in M5) has the most, while Thai has the least in every year group.',
          B2: 'Workload grows with age in all four subjects; Maths and Science carry the heaviest load, Thai by far the lightest; M5 does roughly double M3.',
          C1: 'A consistent age gradient across every subject, with Maths and Science at the top of each year group\'s workload and Thai a distant last; the oldest students do roughly twice what the youngest do.'
        },
        groupA: {
          A2: 'Maths and Science — the big subjects',
          B1: 'Maths and Science: the heaviest homework',
          B2: 'The heavy subjects, Maths and Science, which top every year group',
          C1: 'The high-workload pair, Maths and Science, where the age gradient is steepest'
        },
        groupB: {
          A2: 'English and Thai — the small subjects',
          B1: 'English and Thai: less homework, Thai the least',
          B2: 'The lighter subjects, English and Thai, with Thai the lowest in every year',
          C1: 'The low-workload pair, English and Thai, the latter barely moving across the three year groups'
        },
        intro: {
          A2: 'The bar chart shows how many hours of homework students in three year groups do each week in four subjects at one school.',
          B1: 'The bar chart compares the weekly homework hours of M3, M4 and M5 students at one school in English, Maths, Science and Thai.',
          B2: 'The bar chart compares the average weekly homework load, in hours, that students in three year groups at a single school carry in four subjects: English, Maths, Science and Thai.'
        },
        overview: {
          A2: 'Overall, older students do more homework in every subject, and M5 students do the most. Maths has the most homework and Thai has the least in all three year groups.',
          B1: 'Overall, the amount of homework rises with age in every subject, and the oldest students do the most. Maths, joined by Science in M5, involves the heaviest workload, whereas Thai requires the least time in every year group.',
          B2: 'Overall, homework increases steadily from M3 to M5 in all four subjects, so that the oldest students do roughly twice as much as the youngest. Maths and Science are the most demanding subjects, while Thai is consistently the lightest, taking the least time in each of the three year groups.'
        },
        detailA: {
          A2: 'Maths has the most homework for M3 and M4 students, at 3 hours and 4 hours a week. In M5 it is 5 hours. Science is lower in M3, at only 2 hours, but it also reaches 5 hours in M5, the same as Maths.',
          B1: 'Maths is the most demanding subject for the two younger year groups, with 3 hours a week in M3 and 4 hours in M4, rising to 5 hours in M5. Science starts lower, at 2 hours in M3 and 3 in M4, but in M5 it matches Maths at 5 hours, so Science homework more than doubles between M3 and M5.',
          B2: 'Maths carries the heaviest load in the two younger year groups, at 3 hours a week in M3 and 4 in M4, and it rises further to 5 hours in M5. Science follows the same pattern from a lower base: M3 students spend just 2 hours on it, compared with 3 hours in M4 and 5 in M5, where it equals Maths as the most time-consuming subject.'
        },
        detailB: {
          A2: 'English homework is 2 hours a week in M3, 3 hours in M4 and 4 hours in M5, so M5 students do twice as much as M3 students. Thai has the least homework: only 1 hour in M3 and M4, and 2 hours in M5.',
          B1: 'English follows the same pattern as the heavier subjects: 2 hours a week in M3, 3 in M4 and 4 in M5, which is twice the figure for the youngest group. Thai, by contrast, takes only 1 hour a week in both M3 and M4 and 2 hours in M5, the lowest figure in every year group.',
          B2: 'English homework doubles across the three year groups, from 2 hours a week in M3 to 3 in M4 and 4 in M5. Thai involves far less work than any other subject: M3 and M4 students spend just 1 hour a week on it, and even M5 students spend only 2 hours, half the time they give to English.'
        }
      },
      /* Weekly spending of a secondary student, 2024 (%): food and drinks 38 · transport 22 · phone and internet 15 · clothes 12 · entertainment 9 · savings 4 */
      'p-pie-budget': {
        big: {
          A2: 'Food and drinks is the biggest part. Savings is the smallest. Food and transport together are more than half.',
          B1: 'Food and drinks takes the largest share, and with transport it makes up over half; savings is by far the smallest slice; the other three are similar in size.',
          B2: 'Two large slices (food and drinks, transport) make up more than half; three medium slices are broadly similar; savings is a tiny fraction.',
          C1: 'Spending is dominated by two categories, food and drinks and transport, which together exceed half of the total; three mid-sized categories are of a similar order, and savings is almost negligible.'
        },
        groupA: {
          A2: 'Food and drinks, and transport — the two big slices',
          B1: 'The two largest slices: food and drinks, transport',
          B2: 'The two dominant categories, food and drinks and transport, over half of the total together',
          C1: 'The two largest items, food and drinks and transport, which jointly account for the bulk of the budget'
        },
        groupB: {
          A2: 'Phone and internet, clothes, entertainment, savings — the four small slices',
          B1: 'The four smaller slices: phone and internet, clothes, entertainment and savings',
          B2: 'The remaining four categories, from phone and internet down to savings, the smallest',
          C1: 'The four minor categories: phone and internet, clothes and entertainment clustered together, with savings a distant last'
        },
        intro: {
          A2: 'The pie chart shows how a secondary school student in one city used their money each week in 2024.',
          B1: 'The pie chart illustrates the way an average secondary student in one city divided their weekly spending between six categories in 2024.',
          B2: 'The pie chart breaks down the weekly expenditure of a typical secondary school pupil in one city in 2024 into six categories, from food to savings.'
        },
        overview: {
          A2: 'Overall, food and drinks was the biggest part of the student\'s spending, and food and transport together were more than half of the total. Savings was the smallest part by far, and the other three categories were quite similar.',
          B1: 'Overall, food and drinks took the largest share of the weekly budget, and together with transport it accounted for more than half of all spending. By contrast, savings was by far the smallest category, while phone and internet, clothes and entertainment were similar in size.',
          B2: 'Overall, the budget was dominated by two categories, food and drinks and transport, which between them made up well over half of the total. The three mid-sized categories, phone and internet, clothes and entertainment, were broadly similar, whereas savings represented only a tiny fraction of the student\'s money.'
        },
        detailA: {
          A2: 'Food and drinks was the largest category, at 38% of the weekly money. Transport was second, at 22%. Together, these two categories were more than half of all the student\'s spending.',
          B1: 'Food and drinks accounted for the largest share of spending, at 38%, which was well over a third of the total. Transport came second at 22%, a little under a quarter, so these two categories together made up more than half of the student\'s weekly money.',
          B2: 'Food and drinks alone represented 38% of the weekly budget, considerably more than any other category, while transport was the second largest item at 22%. Combined, these two essentials, at 38% and 22%, took up more than half of the money spent, leaving less than two fifths for everything else.'
        },
        detailB: {
          A2: 'Phone and internet was 15% of the spending, and clothes was a little lower, at 12%. Entertainment was 9%. Savings was the smallest part, at only 4%, which was much less than food and drinks.',
          B1: 'The remaining money was spread across four smaller categories. Phone and internet took 15%, slightly more than clothes at 12%, while entertainment accounted for 9%. Savings came last at just 4%, roughly a third of the amount spent on clothes.',
          B2: 'Phone and internet costs represented 15% of the total, marginally ahead of clothes at 12%, whereas entertainment, at 9%, received less than a tenth of the budget. Savings was by far the smallest category at only 4%, which was roughly a tenth of the share taken by food and drinks.'
        }
      }
    },

    /* ============================================================= SEQUENCE */
    SEQUENCE: {
      /* Life cycle of a frog, 5 stages: 1 eggs (frogspawn, laid in water) · 2 tadpole (hatches after about 10 days; gills, tail) ·
         3 tadpole with legs (back legs then front legs; 6–9 weeks) · 4 froglet (lungs develop, tail shrinks; 12 weeks) · 5 adult frog (land and water; lays eggs) */
      'p-proc-frog': {
        big: {
          A2: 'A natural cycle with five stages. It starts with eggs in water and ends with an adult frog that lays eggs again.',
          B1: 'A natural life cycle of five stages, from eggs in water to an adult frog that lays new eggs; the biggest changes happen in the middle, when the tadpole grows legs and lungs and loses its tail.',
          B2: 'Five-stage natural cycle; begins with eggs and ends with an adult laying eggs; the middle stages carry the transformation (legs, lungs, tail shrinking); egg to froglet takes about three months.',
          C1: 'A closed natural cycle of five stages, bookended by eggs: the transformation is concentrated in the middle, where the tadpole acquires legs and lungs and loses its tail, and the whole journey from egg to froglet takes roughly three months.'
        },
        groupA: {
          A2: 'Stages 1 and 2 — eggs and tadpole, in the water',
          B1: 'Stages 1–2: the eggs and the tadpole, both fully in water',
          B2: 'The early stages (1–2): eggs and the newly hatched tadpole, before any legs appear',
          C1: 'The aquatic beginning, stages 1–2: frogspawn and the gilled tadpole'
        },
        groupB: {
          A2: 'Stages 3, 4 and 5 — legs, froglet, adult frog',
          B1: 'Stages 3–5: the tadpole with legs, the froglet and the adult',
          B2: 'The transformation stages (3–5): legs, then froglet, then the adult that closes the cycle',
          C1: 'The metamorphosis and the return, stages 3–5: from limbed tadpole to egg-laying adult'
        },
        intro: {
          A2: 'The diagram shows how a frog grows, from an egg to an adult frog.',
          B1: 'The diagram illustrates the stages in the life cycle of a frog, from the eggs in the water to the fully grown adult.',
          B2: 'The diagram illustrates the five stages through which a frog develops, beginning with eggs laid in water and ending with an adult capable of breeding.'
        },
        overview: {
          A2: 'Overall, the frog has five stages in its life, and the cycle is natural. It begins with eggs in the water and ends with an adult frog, which lays eggs again. In the middle, the tadpole grows legs and loses its tail.',
          B1: 'Overall, the life cycle of a frog is a natural process with five stages, which begins with eggs in water and ends with an adult frog that lays its own eggs. The biggest changes take place in the middle, when the tadpole develops legs and lungs and gradually loses its tail.',
          B2: 'Overall, the diagram shows a natural, repeating cycle of five stages that starts with frogspawn in water and returns to the same point when the adult frog lays eggs. The most dramatic transformation occurs in the middle stages, as the tadpole grows legs and lungs while its tail shrinks away.'
        },
        detailA: {
          A2: 'At the first stage, the eggs are laid in the water. They are called frogspawn. After about 10 days, the eggs hatch and a tadpole comes out. Next, the tadpole lives in the water, breathes with gills and has a long tail.',
          B1: 'At the first stage, the adult female lays her eggs in water, where they are known as frogspawn. Next, after about 10 days, the eggs hatch into tadpoles. At this point each tadpole is surrounded by water all the time: it breathes through gills and swims with a long tail.',
          B2: 'The cycle begins when the eggs, which are called frogspawn collectively, are laid in still water. After about 10 days they hatch, and at the second stage the young tadpole emerges with gills for breathing and a tail for swimming, entirely dependent on the water around it.'
        },
        detailB: {
          A2: 'Next, after 6 to 9 weeks, the tadpole grows back legs and then front legs. At 12 weeks it becomes a froglet: its lungs develop and its tail is reduced. Finally, it becomes an adult frog, which lives on land and in water. The adult lays eggs, and the cycle starts again.',
          B1: 'At the third stage, between 6 and 9 weeks, back legs appear, followed by front legs. By 12 weeks the tadpole has turned into a froglet, whose lungs are developed and whose tail is almost gone. Finally, it grows into an adult frog that can live both on land and in water, and once it lays its own eggs the cycle begins again.',
          B2: 'At the third stage, after roughly 6 to 9 weeks, the tadpole sprouts back legs and then front legs. By the age of 12 weeks it has become a froglet: lungs are formed for breathing air and the tail is gradually absorbed. Finally, the animal matures into an adult that lives both on land and in water, after which it lays eggs of its own and the cycle is repeated.'
        }
      },
      /* Life cycle of the silk moth, 6 stages: 1 eggs (hatch after about 10 days) · 2 silkworm (mulberry leaves, about 4 weeks) · 3 spinning (900-metre thread, 3 days) ·
         4 pupa (inside the cocoon, 2 weeks) · 5 moth (breaks out; cannot fly or eat) · 6 laying eggs (300–500 eggs, then dies) */
      'p-proc-silkworm': {
        big: {
          A2: 'A natural cycle with six stages. It starts with eggs and ends with a moth laying eggs. The silk is made in the middle, when the silkworm spins a cocoon.',
          B1: 'A natural life cycle of six stages, from eggs to a female moth laying eggs again; the silk is produced in the middle, when the silkworm spins its cocoon; the feeding stage is the longest.',
          B2: 'Six-stage natural cycle, egg to egg; silk production sits at the midpoint (the cocoon); the silkworm\'s feeding stage is the longest timed stage, the spinning the shortest.',
          C1: 'A six-stage closed cycle whose commercial moment, the spinning of the cocoon, falls at its midpoint; the feeding stage dominates the timeline, while the adult moth exists only to reproduce.'
        },
        groupA: {
          A2: 'Stages 1, 2 and 3 — eggs, silkworm, spinning',
          B1: 'Stages 1–3: the eggs, the feeding silkworm and the spinning of the cocoon',
          B2: 'The first half (stages 1–3): hatching, feeding and spinning, ending with the finished cocoon',
          C1: 'The growth half, stages 1–3: from hatching through four weeks of feeding to the spun cocoon'
        },
        groupB: {
          A2: 'Stages 4, 5 and 6 — pupa, moth, laying eggs',
          B1: 'Stages 4–6: the pupa inside the cocoon, the moth and the laying of new eggs',
          B2: 'The second half (stages 4–6): transformation inside the cocoon, emergence and egg-laying',
          C1: 'The reproductive half, stages 4–6: pupation, the short-lived adult and the eggs that restart the cycle'
        },
        intro: {
          A2: 'The diagram shows the stages in the life of a silk moth, the insect that makes silk.',
          B1: 'The diagram illustrates how a silk moth develops from an egg into an adult, including the stage at which it makes the silk thread.',
          B2: 'The diagram illustrates the six stages in the life cycle of the silk moth, the insect whose cocoon is the source of silk.'
        },
        overview: {
          A2: 'Overall, the silk moth has six stages in its life, and the cycle is natural. It starts with tiny eggs and ends when the female moth lays new eggs. The silk is made in the middle, when the silkworm spins a cocoon.',
          B1: 'Overall, the life cycle of the silk moth is a natural process with six stages, beginning with the eggs and ending when the adult female lays a new batch of eggs. The silk itself is produced in the middle of the cycle, when the silkworm spins its cocoon, and the feeding stage is the longest.',
          B2: 'Overall, the diagram shows a natural six-stage cycle that begins and ends with eggs. The commercially valuable moment, the spinning of the cocoon, comes at the midpoint, after the longest stage, in which the silkworm feeds, and before the short transformation into a moth that lives only to reproduce.'
        },
        detailA: {
          A2: 'At the first stage, the eggs hatch after about 10 days, and a small silkworm comes out of each egg. Next, the silkworm eats mulberry leaves for about 4 weeks. Then it spins a cocoon from one long thread, which is 900 metres long. This stage is finished in 3 days.',
          B1: 'At the first stage, tiny eggs hatch after about 10 days and a silkworm emerges from each one. Next, the silkworm feeds on mulberry leaves for about 4 weeks, which is the longest stage shown. After that, a cocoon is spun around its body from a single thread of silk about 900 metres long, a task that is completed in only 3 days.',
          B2: 'The cycle begins when the tiny eggs hatch, after about 10 days, releasing a silkworm from each one. The larva then feeds on mulberry leaves for roughly 4 weeks, the longest period in the diagram, before the cocoon is spun: a single thread around 900 metres long is produced in just 3 days.'
        },
        detailB: {
          A2: 'Next, inside the cocoon, the silkworm becomes a pupa. It changes for about 2 weeks. Then the moth breaks out and the cocoon is opened, but the moth cannot fly or eat. Finally, the female moth lays 300 to 500 eggs and then dies, and the cycle starts again.',
          B1: 'At the fourth stage, the silkworm turns into a pupa inside the cocoon and slowly changes for around 2 weeks. Next, an adult moth breaks out, although it is unable to fly or to eat, and the empty cocoon is discarded. Finally, the female lays between 300 and 500 eggs and dies soon afterwards, so the cycle begins again.',
          B2: 'Inside the cocoon, at the fourth stage, the silkworm is transformed into a pupa over a period of about 2 weeks. The adult moth then breaks free, but it is unable to fly or feed, since its only purpose is reproduction. Finally, the female lays between 300 and 500 eggs before dying, after which the cycle is repeated.'
        }
      }
    },

    /* ================================================================ SPACE */
    SPACE: {
      /* Lotus Park, one map: main road along the south; main gate in the middle of the south side; footpath north from the gate to the lake; car park south-west;
         playground south-east; lake in the centre; café east of the lake with the toilets next to it; flower garden in the west; football field across the north */
      'p-map-park': {
        big: {
          A2: 'The lake is in the centre. Sports and play areas are at the edges. The gate and car park are in the south, next to the main road. The flower garden is in the west.',
          B1: 'The park is arranged around a central lake; the football field is in the north and the playground in the south-east; visitors enter from the main road in the south, where the gate and car park are; the west is a flower garden.',
          B2: 'A central lake with the active areas pushed to the edges (football field north, playground south-east); entrance, gate and parking along the southern road; a quiet flower garden filling the west.',
          C1: 'A layout organised around a central lake: the energetic uses sit at the perimeter, access is concentrated along the southern road, and the western third is given over to a quiet flower garden.'
        },
        groupA: {
          A2: 'Main gate, footpath, car park, playground — the south of the park',
          B1: 'The southern part: the main gate, the footpath, the car park and the playground',
          B2: 'The entrance zone along the main road: gate, footpath, car park and playground',
          C1: 'The southern access strip, gate and footpath flanked by the car park and the playground'
        },
        groupB: {
          A2: 'Lake, café, toilets, flower garden, football field — the centre, east, west and north',
          B1: 'The centre and the far side: the lake with the café and toilets, the flower garden and the football field',
          B2: 'The interior and the northern half: lake, café and toilets, flower garden, football field',
          C1: 'The heart and the perimeter beyond it: the lake, its lakeside café and toilets, the western garden and the northern field'
        },
        intro: {
          A2: 'The map shows how Lotus Park, a city park in Thailand, is arranged.',
          B1: 'The map illustrates the layout of Lotus Park, a public green space in a Thai city, with its lake, gardens and sports areas.',
          B2: 'The map illustrates how the different facilities of Lotus Park, a public park in a city in Thailand, are arranged around its central lake.'
        },
        overview: {
          A2: 'Overall, the park is built around a big lake in the centre, with the sports and play areas at the edges. The main gate and the car park are in the south, next to the main road, and the west of the park is a flower garden.',
          B1: 'Overall, the park is organised around a large lake in its centre, while the sports and play facilities lie near the edges, with the football field in the north and the playground in the south-east. Visitors enter from the main road in the south, and the western side is mostly a quiet flower garden.',
          B2: 'Overall, Lotus Park is laid out around a central lake, with the more energetic uses, the football field and the playground, pushed to its northern and south-eastern edges. Access is concentrated along the southern boundary, where the main gate and the car park face the main road, whereas the western side is given over to a flower garden.'
        },
        detailA: {
          A2: 'The main road runs along the south of the park. The main gate is in the middle of this side, and a short footpath goes north from the gate to the lake. The car park is in the south-west corner, and the playground is in the south-east corner, on the other side of the gate.',
          B1: 'Visitors enter the park through the main gate, which stands in the middle of the southern boundary on the main road. From the gate, a short footpath leads north to the lake. The car park occupies the south-west corner, west of the entrance, while the playground is located in the south-east corner, so the two are separated by the gate and the footpath.',
          B2: 'Access is from the main road, which runs along the southern edge of the park, through the main gate at the midpoint of that boundary. A short footpath leads directly north from the gate to the lake. The gate is flanked by the car park, which occupies the south-west corner, and the playground, which fills the south-east corner.'
        },
        detailB: {
          A2: 'The lake is in the centre of the park. The café is on the east side of the lake, and the toilets are next to the café. The football field is in the north of the park, directly north of the lake, and the flower garden is in the west. The garden and the field are both bigger than the lake.',
          B1: 'The lake lies at the heart of the park. On its eastern side there is a café, with the toilets immediately next to it. A football field stretches across most of the northern part of the park, directly north of the lake, while the flower garden fills the western side between the car park and the northern edge. Both the garden and the field are larger than the lake.',
          B2: 'At the centre of the park lies the lake, with a café on its eastern shore and the toilets adjacent to the café. The football field occupies most of the northern strip, immediately north of the lake, whereas the flower garden takes up the greater part of the western side, running from the car park to the northern boundary. Both of these areas are larger than the lake itself.'
        }
      },
      /* School campus, now and plan: road along the west; main building north-west (unchanged); car park north-east → garden; library (centre-west) demolished, canteen extended west onto its site;
         new car park on the open ground in the east; new library in the south-west on the western half of the sports field; sports field reduced to the south-east */
      'p-map-school': {
        big: {
          A2: 'The plan adds buildings and a garden, and the sports field gets smaller. The library and the car park will move. The main building and the road stay the same.',
          B1: 'The plan adds more indoor space and a garden at the expense of the sports field, which will be halved; the library and the car park will move; the main building and the road will not change.',
          B2: 'More built and green space, paid for by the sports field; two relocations (library to the south, car park to the centre); a garden on the old car park; main building and road unchanged.',
          C1: 'A reorganisation that trades half the sports field for a larger library and an extended canteen, relocates the car park to the centre and greens its old site, while the main building and the western road remain fixed points.'
        },
        groupA: {
          A2: 'Library, canteen, sports field — the things that move or change size',
          B1: 'Library, canteen and sports field: the buildings that move or change size',
          B2: 'The reshuffle in the west and south: library relocated, canteen extended, sports field halved',
          C1: 'The centre-and-south changes, where the library, the canteen and the sports field trade space'
        },
        groupB: {
          A2: 'Car park, garden, main building — the north-east and what stays the same',
          B1: 'Car park and garden (the swap in the north-east) and the main building, which stays',
          B2: 'The north-east swap, car park out and garden in, plus the unchanged main building and road',
          C1: 'The north-eastern exchange of car park for garden, set against the fixed main building and road'
        },
        intro: {
          A2: 'The two maps show a secondary school now and how it will look after the planned changes.',
          B1: 'The two maps illustrate the current layout of a secondary school campus and the changes that are planned for the future.',
          B2: 'The two maps compare the present arrangement of a secondary school campus with the layout proposed in the plan for its redevelopment.'
        },
        overview: {
          A2: 'Overall, the plan will add more buildings and a new garden, but the sports field will become much smaller. The library and the car park will move to new places, while the main building and the road will stay the same.',
          B1: 'Overall, the plan will provide more indoor space and a new green area, mainly at the expense of the sports field, which will be cut in half. The library and the car park will be moved, whereas the main building and the road along the western edge will remain as they are.',
          B2: 'Overall, the proposed campus will gain a larger library, an extended canteen and a garden, but the sports field will lose roughly half of its area to make room for them. Two facilities will be relocated, while the main building in the north-west and the road along the western boundary will stay unchanged.'
        },
        detailA: {
          A2: 'The library is now in the west of the centre, next to the canteen. In the plan, it will be demolished, and the canteen will be extended to the west onto this site. A new library will be built in the south-west, on the western half of the sports field, so the sports field will be reduced to the south-east part only.',
          B1: 'At present the library stands in the western half of the centre, with the canteen beside it. Under the plan, the library will be demolished and the canteen will be extended westwards onto its site, roughly doubling in size. A new, much larger library will be constructed in the south-west, on the western half of the sports field, which will therefore be reduced to its south-eastern half.',
          B2: 'The biggest changes affect the western and southern parts of the campus. The existing library, in the west of the central strip, will be knocked down so that the canteen next to it can be extended westwards across the whole site. A far larger library will then be constructed in the south-west, directly south of the enlarged canteen, on land taken from the sports field, which will shrink to the south-eastern half of its present area.'
        },
        detailB: {
          A2: 'The car park is now in the north-east corner, next to the main building. In the plan, it will be removed, and a garden will be built on the same site. A new car park will be made on the open ground in the east of the campus. The main building in the north-west and the road in the west will stay the same.',
          B1: 'In the north-east corner, the current car park will be removed and replaced by a garden. A new car park will be built in its place on the open ground in the east of the campus, directly south of the garden. The main building in the north-west corner and the road along the western edge will not be changed.',
          B2: 'The north-eastern corner will also be transformed: the existing car park there will be replaced by a garden, while parking will be relocated to the open ground in the centre-east, directly south of the new garden. In contrast, the main building in the north-west and the road running along the western boundary are to be left exactly as they are.'
        }
      }
    }
  };
})(window);
