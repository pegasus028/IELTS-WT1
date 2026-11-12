# Findings in the existing model answers and prompts (13 Nov 2026)

Found while writing and reviewing the 47 new High / Medium guidance scripts (each script was checked figure by figure against its chart, then reviewed by a second model). **Nothing below has been changed**: the Exemplar Archive models (`models.js`, `models-2.js`) and the prompts (`prompts*.js`) are as they were. The new scripts already avoid every item. For T.Chris to decide; each fix is one or two lines, then `node tools/models-check.js` and the audio / example checks.

## A. Breaks a house rule

| Where | What it says | Why | Suggested |
|---|---|---|---|
| `m-bar-homework` (COMPARE), paragraph 3 | "…so the time spent on Science **more than doubles between these two year groups**." | A trend verb across year groups (COMPARE rule, 27 Oct 2026) | "…so M5 students spend two and a half times as long on Science as M3 students." |
| `m-bar-homework`, paragraph 4 | "Thai … only 1 hour a week in both M3 and M4, **rising to 2 hours in M5**…" | The same | "…and 2 hours in M5…" (its notes repeat "does not rise", "more than doubles") |
| `m-table-salaries` (COMPARE) | "Japanese and Korean salaries **had risen** by more than three quarters" | A trend verb between two career stages measured in one year | "were more than three quarters higher after 15 years" |
| `m-mixed-coffee` | "almost twice the Brazilian figure of 12" | 21 ÷ 12 = 1.75; "almost double" needs about 1.8–1.99 | "three quarters more than the Brazilian figure of 12" |
| `m-line-clubs` | "around 30 more than football" | An approximation word on an exact gap (150 − 120 = 30) | "30 more than football" |
| `m-proc-silkworm` | "about 900 metres long"; "for around 2 weeks" | Both boxes give exact values | "900 metres long"; "for 2 weeks" |
| `m-proc-coconut-sugar` | "around 10 litres of sap are needed to produce 1.5 kg" | Box 7 is exact (the prompt's own keyFeatures also say "About … roughly"; align both) | "10 litres of sap are needed to make 1.5 kg" |

## B. Not true of the chart, or overstated

| Where | What it says | The data | Suggested |
|---|---|---|---|
| `m-table-phones` (text and note) | the Orbit Max had "**by far** the longest battery life" | 34 h against 30 h | "the longest battery life" |
| `m-table-rent`; `p-table-rent` keyFeatures | "The two South-East Asian cities" (Bangkok, Ho Chi Minh City) | Singapore, on the same table, is in South-East Asia | "The other two cities" |
| `p-table-rent` keyFeatures | rents there "roughly doubled or more" | Bangkok $320 → $540 is ×1.69 | "rose strongly, and those in Ho Chi Minh City more than doubled" |
| `p-bar-costs` keyFeatures; `m-bar-costs` overview and note | "the (three) South-East Asian cities" for Kuala Lumpur, Bangkok, Hanoi | Singapore again | "the other three cities" |
| `m-bar-costs` overview | "Singapore the most expensive and Hanoi the cheapest on every measure" | Tokyo has the highest transport cost ($95 against $85) | give "on every measure" to Hanoi only |
| `m-bar-screentime` | "The gap was even wider for gaming" | wider only as a multiple (12 against 1); the gap in hours is smaller (11 against 15) | "For gaming, the youngest group's figure was twelve times the oldest group's" |
| `m-bar-languages` | "almost three times the original figure"; French "fell in every subsequent year" | 110 ÷ 40 = 2.75; the data is five-yearly | "more than two and a half times"; "fell in each five-year period" |
| `m-table-rice` | "Vietnam's harvest grew steadily"; China "by far the largest producer in all three years" | +8 then +3; in 2020 China is 19% above India | "rose in both decades, though more slowly after 2010"; "the largest producer" |
| `m-pie-university` | the small sources "all grew gradually" | Other income went 3 → 4 → 8 | "all kept growing" |
| `m-line-music` | streaming rose "overtaking CDs"; vinyl "the only physical format" | it overtook downloads too; "physical" is outside knowledge | "overtaking CDs and downloads"; drop the second |
| `m-line-music` | vinyl's 2030 figure is "more than three times the expected figure for CDs" before the CD figures are given | a forward reference | move the comparison after the CD forecast ("less than a third of the vinyl forecast") |
| `m-bar-tourists` | "10 million more than in 2015, which represented growth of about a third" | true but clumsy | "…exactly 10 million more than in 2015, a rise of about a third in four years." |
| `m-line-clubs` | "over the nine years from 2016 to 2024" | eight years (nine yearly figures) | "in every year from 2016 to 2024" |
| `m-map-thai-town` | the hospital took "most of the rice fields" | about 58% | "the western part of the rice fields" |
| `m-map-port-plan` | "a former warehouse district" | on the Now map it is still working | "an old riverside warehouse district" |
| `m-bar-emoto` notes | "less than a fifth" | its own text says exactly a fifth (9 of 45) | fix the note |

## C. Adds what the visual does not show

| Where | Added |
|---|---|
| `m-proc-glass` | "placed in bottle banks by the public"; "to remove any labels and residue"; "filled with drinks" |
| `m-proc-noodles` | "in a factory" |
| `m-mixed-plastic` | "burned for energy" for the label "Energy recovery" |

## D. Prompt data

| Where | What |
|---|---|
| `p-map-lake`, 2020 panel | the south-east corner (east of the enlarged village, south of the reduced eastern farmland) has no feature at all; it was farmland in 1980. Extend "Farmland (east, reduced)" or leave it blank on purpose. |
| `p-map-school` keyFeatures | the car park is "relocated from the north-east to the centre"; on the plan it is on the open ground in the east. |
| `p-line-clubs` | `groupings` is esports + badminton / football; its model answer groups football + esports / badminton. The script, the Spellbook and the Duelling Hall follow `groupings`. |
| `p-map-park`, charts.js | the compass is drawn on the top-right corner of the football field (cosmetic). |

## E. Teaching decisions the new scripts made (reverse any of them in a line or two)

1. **"By + year" takes the past perfect** in every right option ("By 2020, coal's share had fallen"). "By 2025 most students used …" is also correct English and stays accepted in Medium overview clauses.
2. **"five less than in 2016"** (bare number) is accepted in Medium; only "less + plural noun" ("less members") is a wrong option.
3. **Hyphens in compass words**: "north-west" is the right form; "northwest" is sent back in Medium.
4. **Map fractions** (lake): "about three quarters", "roughly the northern third", estimated by eye; "most of the farmland" is accepted in Medium.
5. **Units in a two-visual introduction** (national park, gym): not stated in P1 ("how many people" / "how many members"); every detail figure carries "thousand".
6. **Coconut sugar**: "These tubes are collected twice a day" follows the model; box 2 says the sap is collected.
7. **Three reports are exactly 190 words** (smartphones, university income, recorded music): at the top of the range.
8. **Air quality**: Bangkok's 24 → 30 is called "slightly higher" (as in the prompt's key features); "somewhat higher" is the alternative.
9. **Plastic bags**: "and reached a peak" is sent back in Medium at the step before the preposition, because the next step supplies "at".
