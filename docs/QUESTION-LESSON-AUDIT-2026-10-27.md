# Question ↔ lesson consistency audit, 27 October 2026

Full reports of the six audit groups (brief: every question must test something its lesson, an earlier lesson or a podcast teaches; lesson gaps between the C1 text and the A1–B2 levels closed in the lesson). Summary and coordinator fixes are in QA-REPORT.md.

---

## G1 consistency audit: m00, m01, m02

Auditor G1, 26–27 Oct 2026. I checked every lesson item and every Systems Check item against the C1 body, the A1–B2 level texts, earlier lessons and the podcast briefings (m00–m02). Every chart figure was checked against `prompts.js` data. Only topic-00.js and topic-02.js were edited.

## Module 00 · The Test
29 items checked: 23 OK, 6 fixed (4 HINT-POINTER, 1 LEVEL-GAP, 1 CONTRADICTION).

| Item | Verdict | Concept | What I did |
|---|---|---|---|
| m00s1q5 (id kept) | HINT-POINTER | four criteria, 25% each | The C1 body of s1 never names the criteria. The A1–B2 texts and the m00 podcast do, so the item is OK. The hint said "Name the criteria from this lesson", which is false at C1. New hint: "Name the marking criteria and count them. Then ask whether the examiner gives any one of them extra weight." |
| m00s3q3 (id kept) | HINT-POINTER | a final summary paragraph is not needed; the overview is paragraph 2 | The hint said "Recall the flight plan". That term is first taught in Module 02, which comes later. The concept itself is covered by m00s1 C1 (four paragraphs), m00s3 (no conclusion) and the m00 podcast (intro, overview, two details). New hint: "Recall the report shape this module recommends: how many paragraphs it has, and the job of each one." |
| m00s3q6 (id kept) | HINT-POINTER | same concept | Same problem. The hint now points to "the report shape this module recommends". |
| m00ckq6 (id kept) | HINT-POINTER | same concept | Same problem. New hint: "Recall how many paragraphs this module recommends and the job of each one before you decide." |
| m00s3q7 (id kept) | LEVEL-GAP | "Mention every category" is required, so a student must not tick it | All four A1–B2 levels say "mention/cover every category". The C1 body did not, and neither do earlier lessons or the m00 podcast. A C1 reader could take "select the main features" to mean "skip some categories". I added one sentence to the end of C1 body ¶4: "What Task 1 does require is the opposite list: summarise, select the main features, make comparisons and mention every category." |
| m00ckq8 (id kept) | CONTRADICTION | trend verbs on a COMPARE chart | Distractor A, "Gaming fell with age, from 12 hours to just 1.", was offered as an acceptable report sentence. The m01 lesson and podcast ("Gaming increased from the over-fifties to the teenagers is wrong") and the m07 lesson say a trend verb on a chart with no time is an error. New option A: "Teenagers gamed far more than the over-50s, at 12 hours against 1." The figures were checked against p-bar-screentime. The key and the why are unchanged. |

## Module 01 · Triage
29 items checked: 29 OK, 0 fixed.
- m01s2q6 (Lagos "had" in 2040): the C1 body of m01s2 does not mention projections, though the A1–B2 texts do. The m01 podcast teaches this exact sentence, so the item is OK.
- All chart figures were verified: museums, screen time, tourists, riverside map, pie-energy, salaries, cities, coffee, rice, glass, internet and pie-budget.

## Module 02 · Flight Plan
29 items checked: 26 OK, 3 fixed (2 CONTRADICTION, 1 LEVEL-GAP).

| Item | Verdict | Concept | What I did |
|---|---|---|---|
| m02s1q6 (id kept) | CONTRADICTION | the detail block should be two paragraphs | The why called a three-paragraph report (intro, overview, one detail block) "the Band 5 signature for Coherence". The canonical skill puts the CC ≤5 ceiling only on a single block with no paragraphs, and says three paragraphs with a findable overview carry no paragraphing ceiling. The m02 podcast does not give this shape a band either. New why: "The skeleton has two detail paragraphs, one group of features each. A single 110-word block mixes the two groups and weakens Coherence; split it, and the word budget of 60 / 60 falls into place." The stem, options and key are unchanged. |
| m02s2q3 (id kept) | CONTRADICTION | P1 fills every slot | The why says the key "fills every slot", but the key left out the [where] slot ("in one country", which is in the rubric). Key B is now "The chart compares weekly hours on three screen activities across four age groups in one country in 2023." Distractor D now ends "…than older people did in 2023." so that the key (105 characters) is still not the longest option (112). The answer position (1), the why and the hint are unchanged. |
| m02s2q7 (id kept) | LEVEL-GAP | "over a twenty-year period": the article, the hyphen and singular year | All A1–B2 levels of m02s2 teach this. The C1 body did not. The only other place is m02s3, which comes later, and the m02 podcast only says "over a ten-year period" in passing, without the form rule. I added to the end of C1 body ¶4: "The same care applies when you rephrase the dates: <em>over a fifteen-year period</em> needs the article <em>a</em>, a hyphen and a singular <em>year</em>, because <em>fifteen-year</em> works as an adjective." |

I grepped every id I touched across the repo (*.js, *.json, *.gs). Nothing outside the topic files refers to them, but every fix was made in place anyway, so every id is unchanged and no item was replaced.

## Checks
- `node tools/validate.js`: OK (18 modules, 526 items).
- `node tools/fairness.js`: no item, hint or level errors. It now reports "no Sonia recording" for **m00s3 C1** and **m02s2 C1**. This is expected, because their C1 bodies changed and the audio must be rebuilt (see c1-changes.json). The other Sonia errors (m03, m05, m07, m08) belong to other groups.
- level-patches.json is `[]`, because the A1–B2 texts already contained both concepts I added to C1.

## For T.Chris
1. **Lesson-text error, not changed:** the m02s1 **B2** level text (lesson-levels.js, body ¶2) says "A single long block of details is the Band 5 signature for Coherence". This is the same overstatement I fixed in the m02s1q6 why. By the canonical skill, an intro, an overview and one detail block make three paragraphs, which carry no CC ceiling. The A2 ("a Coherence problem") and B1 ("a weak sign for Coherence") wording is fine. Suggested B2 wording: "A single long block of details mixes two groups and weakens Coherence, so split it into two groups."
2. **"fell with age" on a COMPARE chart: the sources disagree.** The canonical skill's examples.md (screen-time model) allows "fell sharply with age" in COMPARE. The app's m01 lesson and podcast and the m07 lesson call a trend verb on a no-time chart an error. Other modules still use the pattern as correct, for example topic-13 ("Social media time fell sharply with age…" as a given) and topic-11 m11 ("sharp fall in gaming time with age"). I made m00 match the app's lessons. Please decide which rule wins and tell groups G4 and G5 (or the coordinator).
3. **Concepts that the C1 lesson text leaves out and only the podcast teaches.** These items pass the rule, but a C1 reader who skipped the podcast meets them cold:
   - The 25% equal weighting of the four criteria (m00s1q5, m00ckq2): the s1/s2 C1 bodies never state it.
   - A wrong preposition with a figure counts as GRA (m00s2q2).
   - Projections and the dotted line in m01s2 (q6).
   - number of / amount of in m02s1 (q7).
   - The units belong in the introduction, in m02s1 (q5). The A2 level text leaves this out too.

   If you want each lesson to stand alone at C1, I can draft one sentence for each.
4. The A1–B2 texts of m00s1 still teach the five-phase plan (30 s / 2 min / 1.5 min / 13 min / 3 min), but the C1 body does not. Since m00s1q6 was replaced by q6b, no item tests the plan, so this is a difference in content between the levels, not a gap. It also agrees with the podcast's clock (0:30 / 4:00 / 17:00 / 20:00). Keep it or remove it from A1–B2, as you prefer. m00s1q6b itself is OK.

---

## G2 consistency audit: m03, m04, m05

Files edited: `topic-03.js`, `topic-05.js` (`topic-04.js` needed no change). No ids were replaced. Every fix was made in place, so ids and types stay the same.

## Module 03 · The Overview
29 checked (21 lesson + 8 check). 24 OK · 3 CONTRADICTION fixed · 1 LEVEL-GAP fixed (C1) · 1 HINT/WORDING fix inside a CONTRADICTION item.

| id | verdict | concept | what was done |
|---|---|---|---|
| m03s2q1 | CONTRADICTION | COMPARE chart: no trend verbs across categories (m01s1 C1 example "Pocket money increased from the youngest class…" marked wrong; m01 podcast "Gaming increased from the over-fifties…" wrong; m07 lesson and podcast) | Good-bin card "social media and gaming fell with age, while streaming stayed similar" → "social media and gaming were far more popular with the young, while streaming was similar for all ages". Fig-bin card "gaming fell from 12 hours to just 1 hour" → "teenagers gamed for 12 hours, against just 1 hour for the over-50s". `why` updated to match. |
| m03s3q3 | CONTRADICTION (hint only) | same | The hint "which activity hardly changes with age" → "which activity is similar in every age group". |
| m03ckq5 | CONTRADICTION | same (p-bar-homework is COMPARE) | The presented "otherwise good" chunks were "homework increased with each year group". They are now "homework was heaviest for the oldest year group". The target chunk (index 5), the fix and the why are unchanged. Checked against the data: M5 is highest in every subject. |
| m03ckq6 | LEVEL-GAP (C1) | With two visuals, the overview covers both. A1–B2 of m03s3 teach it; C1 did not; no podcast or earlier lesson does. | One sentence added to the end of m03s3 C1 body ¶3: "When the task has two visuals, the overview must cover both, ideally with one headline from each." |
| m03ckq8 | CONTRADICTION (why) | same trend-verb rule | why "both of which fell with age, while streaming hardly changed" → "both far lower among older people, while streaming was similar in every group"; hint "hardly changes with age" → "is similar in every age group". **This id is referenced in tools/walkthrough/personas/*.json and tools/walkthrough/live/example-bank.json, so the id and type are kept and only the why and hint text changed.** |

## Module 04 · Claim + Number
29 checked. 29 OK, no changes.
Items that pass only through 2b–2d (none need fixing): m04s1q4 "just over half" (C1 s1 does not have it; the m04 podcast §3 does), m04ckq4 "overtook" (the m03 podcast, "Thailand overtook Japan"), m04s2q6 "by 2040" (m01s3 C1 "is expected to reach … by 2035"). Every chart figure was checked against prompts.js.

## Module 05 · Grouping
29 checked. 23 OK · 2 CONTRADICTION fixed · 2 HINT-POINTER fixed · 1 LEVEL-GAP fixed (C1).

| id | verdict | concept | what was done |
|---|---|---|---|
| m05s1q4 | CONTRADICTION | trend verb on the COMPARE screen-time chart | Correct option "Activities that fall with age / the one that stays level" → "Highest among the young / similar at every age". It is still at index 3 and is not the longest option (46 chars vs 58/51). The why is reworded with the same figures. |
| m05s1q7 | HINT-POINTER | The hint sent the student to "the museum example in this lesson". There is no museum example in m05s1 at any level (it is in the podcast). | → "Compare the statement with the drinks-sales example in this lesson." |
| m05s3q5 | HINT-POINTER | Band 5 "mechanical" is not in m05s3 C1 (it is in m05s1 and m00s2) | → "Recall the Band 8 descriptor in this lesson and the Band 5 "mechanical" descriptor from the first lesson of this module…" |
| m05s3q7 | CONTRADICTION | trend verb on the COMPARE chart | Stem "social media and gaming fall with age, streaming stays level" → "social media and gaming are far higher among the young, while streaming is similar in every group". The why is reworded. |
| m05ckq3 | LEVEL-GAP (C1) | Map paragraph order: the old map first, then what it became, then the next area. In m05s2 A1–B2 only; no podcast or earlier lesson has it. | One sentence added to m05s2 C1 body ¶2: "For a map, describe what the old map showed, then what it became, and only then move to the next area." |

Items that pass only through 2b–2d: m05s2q2 (the subject rule, from the m05 podcast), m05ckq2 (two pies, group by change: s1 C1 example), m05s3q6/q7 (exception and range are given in the stem; range is in the m05 podcast), m05ckq4 (the "totals" option: the stem names the doubling, and the data checks out at 8 vs 16).

## Outputs
- level-patches.json: `[]`. Every gap was at C1 only; A1–B2 already had each concept.
- c1-changes.json: `["m03s3", "m05s2"]`. Their lesson audio needs rebuilding. fairness.js now reports "no Sonia recording" for these two subs, which is expected.
- validate.js: OK (526 items). fairness.js: no other m03–m05 errors. The remaining errors come from other groups' C1 edits.

## For T.Chris
1. **The "fell with age" rule disagrees between the canonical skill and the app.** The skill's `references/examples.md` screen-time model, and its note, *allow* "fell sharply with age" in COMPARE. So do `models.js` (m-bar-screentime overview) and `prompts.js` keyFeatures ("Social media and gaming fell sharply with age"). The m01 and m07 lessons and the m07 podcast call that exact sentence "the classic mistake". I made m03/m05 follow the lessons. You need to choose one rule. Other groups' files still use "fell sharply with age" as correct: topic-13.js (q at lines ~50, 121, 232) and topic-11.js line ~70. The model answer and the keyFeatures will also need changing if the lessons' rule stands.
2. m03s1q4 rejects "There were three museums" as introduction material. That fits the A1–B2 texts, but the m03 podcast says counts ("all three museums") are *allowed* in an overview. These are not strictly in conflict (allowed wording vs not a finding), so I left the item as it is.
3. Three items rely on A1–B2-only content that C1 lacks, and they pass only through the podcast or an earlier lesson: the subject rule, approximation in m04s1 and "overtook". If you want C1 to be self-sufficient, add those sentences to the C1 bodies.

---

## G3 consistency audit: m06 TREND, m07 COMPARE, m08 SEQUENCE

Auditor G3, 26–27 Oct 2026. Files edited: topic-07.js, topic-08.js (topic-06.js needed no changes). I checked every item's concept against the C1 body and the A1–B2 level texts of its own lesson, the earlier lessons (m00–m05 and the earlier lessons of the same module) and the podcast briefings for m00–m08. I also read every hint and every why.

## Counts
- **m06 TREND**: 29 checked (21 lesson + 8 check). 29 OK, 0 fixed.
- **m07 COMPARE**: 29 checked. 27 OK, 2 fixed (1 LEVEL-GAP, 1 HINT-POINTER).
- **m08 SEQUENCE**: 29 checked. 28 OK, 1 fixed (1 LEVEL-GAP).
- **Total**: 87 checked, 84 OK, 3 fixed. No item was replaced, so no ids changed. There are no level patches and 2 C1 lessons were changed.

## Non-OK items
| id → new id | verdict | concept | where missing / what was done |
|---|---|---|---|
| m07s2q4 → m07s2q4 (unchanged) | HINT-POINTER | The S6 share pattern ("A accounted for a share of the total") | S6 is defined in the C1 body of m07s1 (bar charts), not in m07s2. The A1–B2 texts of m07s2 do name S6. Old hint: "Recall the S6 share pattern from this lesson." New hint: "Recall the S6 share pattern from the bar-chart lesson and this lesson's example about rent." The superlative + "at" + figure part comes from this lesson's C1 example 0, so the new hint is true at every level. |
| m07s3q2 → m07s3q2 (unchanged) | LEVEL-GAP (C1) | "Fewest" takes a plural countable noun (the fewest hours) | A1, A2, B1 and B2 all teach it. The C1 body did not, and no earlier lesson or podcast does. Added to the C1 body of m07s3, paragraph 4: "<em>Fewest</em> goes with a plural countable noun: <em>the fewest days</em>." The item is unchanged. |
| m08s3q4 → m08s3q4 (unchanged) | LEVEL-GAP (C1) | Raw material = the input; end product = the output | A1–B2 define both terms. The C1 body only listed them as vocabulary, and the podcast uses "raw materials" without defining it. Added to the C1 body of m08s3, paragraph 4: "The <strong>raw material</strong> is what goes in at the start; the <strong>end product</strong> is what comes out at the end." The item is unchanged. |

## Checked and OK only through an earlier source (for the record)
- **m06s1q3** (plummeted): not in the C1 body of m06s1 (A1–B2 have it). It is covered by podcast 06 §1.
- **m06s1q6** (adjective, not adverb, before the noun in "a steady rise"): covered by podcast 06 §2 and m06s2.
- **m06s2q7, m06ckq3, m06ckq8** (by = size of the change, to = end point): covered by m04s2.
- **m06s3q1** (peaked at): the hint points to Module 04, which is correct (m04s2 teaches peaked at / stood at).
- **m06s3q7** (crossover): covered by m05s2.
- **m07s3q5** ("with + noun" for the runner-up): only in A1–B2. It is a build item with given tiles, so no concept beyond "ranged from … in second place" is needed, and the C1 body has that.

## For T.Chris
- **Lesson audio**: c1-changes.json lists m07s3 and m08s3. fairness.js now reports "no Sonia recording in the manifest" for m07s3 C1 and m08s3 C1. That is expected until the coordinator rebuilds the lesson audio.
- **Judgement call (m08s3q4)**: a strong C1 reader could probably infer the two terms from "what goes in at the start / what comes out at the end" plus the vocabulary list. I added the explicit definition anyway, because the item tests exactly that distinction.
- **Mismatch between levels, not changed**: for m06s1, A1–B2 teach plummeted, collapsed, dipped and recovered, but the C1 body does not (the podcast covers plummeted). The same happens for "with + noun" in m07s3 and the continuous ("is drying = right now") in m08s1. No item depends on these points through C1 alone, so I left them. You may want the C1 bodies to mention them too.
- **No lesson errors found**: none of the hints or whys contradict the lessons, the podcasts or the chart data. I checked every chart figure quoted in a why against prompts.js.

---

## G4 consistency audit: m09, m10, m11

Checked every lesson item (3 × 7 per module) and every Systems Check item (8 per module) against C1 and the A1–B2 level texts, earlier lessons and modules, and podcast briefings m00–m11. Chart facts were checked against the prompt data in prompts.js and prompts-2.js.

## m09 SPACE mode: 29 checked · 29 OK · 0 fixed
No changes. Notes:
- m09s2q4 (*extended* vs *relocated*), m09s2q7 and m09ckq7 (*pedestrianised*): C1 only lists these verbs and does not define them. The definitions are in A1–B2 and in the m09 podcast (§2), so they pass under 2d.
- m09s1q6 (group by area): not in the m09s1 C1 text, but m05s1 and the m05 podcast teach it ("on a map, north versus south"), so it is OK.
- m09s3q3 (reasons) and m09s3q1 (opinion): taught in m00, m03 and the m09 podcast.
- m09ckq4 (naming the single biggest change): A1–B2 teach it. For C1, m03 "biggest general truths" covers it.

## m10 Two Visuals: 29 checked · 28 OK · 1 fixed (LEVEL-GAP 1)
| Item | Verdict | Concept | Fix |
|---|---|---|---|
| m10s3q4 (id kept) | LEVEL-GAP (C1) | *the former* = the first of two items named, *the latter* = the second | m03 only lists *the former / the latter* as comparison words and never defines them. The definition is in m10s3 A1–B2 but not in C1. Added one sentence to the end of the third C1 body paragraph: "*The former* refers to the first of two items just named and *the latter* to the second, so the order of naming decides which is which." |

Notes: m10s1q4 (*because/so* invent a cause) is missing from C1 but taught in m03 and the m10 podcast. m10s1q5 (each visual has its own verb and time frame) is not a separate concept. m10ckq6's hint, "reference word from lesson 3", correctly points at m10s3.

## m11 Accuracy: 29 checked · 24 OK · 5 fixed (LEVEL-GAP 2 · CONTRADICTION 3)
| Item | Verdict | Concept | Fix |
|---|---|---|---|
| m11s1q3 (id kept) | LEVEL-GAP (C1) | an uncountable noun never takes *a*; *the electricity* when it means the amount shown in the chart | A1–B2 have this; C1 did not. m02s2 only teaches "uncountable nouns used generally take no article". Added one sentence at the end of the C1 Articles paragraph (see next row). |
| m11ckq8 (id kept) | LEVEL-GAP (C1) | energy sources named in general take no article (*nuclear*, *coal*) | Fixed by the same sentence: "An uncountable noun never takes *a*: energy sources named in general take no article (*coal*, *nuclear*, *hydro*), while *the electricity* or *the water* is right when it means the specific amount shown in the chart." |
| m11s1q7 → m11s1q7b | CONTRADICTION (coordinator ruling) | pattern S4 takes *a* | The old sentence was "There was sharp fall in gaming time with age, from 12 hours to just one" (p-bar-screentime). It used a TREND noun across age groups and presented it as correct, which m07s1 calls an error. Now: "There was / steep rise / in household internet access / in Thailand, / from 12% in 2005 / to 88% in 2025." (p-line-internet; answer stays 1, fix *a steep rise*). The hint now points at "pattern S4 from Module 06", not "the kit". The figures are checked: 12 → 88 is the steepest rise on the graph. Nothing else referenced the old id. |
| m11ckq3 (id kept) | CONTRADICTION (hint) | tense follows the chart's date | The hint said to check "the chart title", but the title (Weekly screen time by age) has no year. 2023 is only in the rubric sentence shown above the chart. The hint now says "the task sentence above the chart and the bars". |
| m11ckq6 (id kept) | CONTRADICTION (tag) | subject–verb agreement (*The factory … was replaced*) | It was tagged `gra-plural`, so the fault list sent students to m11s1 (plurals) and the remediation card called it "Plurals". Retagged `gra-agreement`, which routes to m11s2 where the head-noun rule is taught. The content is unchanged. |

Coordinator ruling sweep: no other item in m09–m11 uses a trend verb across categories with no time. The coffee, map and screen-time items already use COMPARE wording.

## For T.Chris
- **m11s1 audio and m10s3 audio** need rebuilding (C1 body changed). fairness.js now reports "no Sonia recording" for both. That is expected.
- **m09 C1 verb list** (m09s2): *extended, relocated, pedestrianised* are listed but not defined in C1. Students on C1 rely on the podcast for their meanings. I left this as is, because the brief counts the podcast. You may want a clause in C1 anyway, as A1–B2 already have one.
- **m11ckq6 retag** changes which lesson the fault list sends a student to, and the remediation label shown. Please confirm.
- No lesson errors found in m09–m11. All chart facts in items and whys match the prompt data.

---

## G5 consistency audit: m12 Cohesion · m13 Selection · m14 Exam Day
(Saved by the coordinator from G5's hand-back; G5 could not write .md files.)

Checked each lesson and Systems Check item against C1 + A1–B2, earlier lessons m00–m11, podcasts m00–m14 and the ielts-writing-task-1 skill. Every chart figure checked against prompt data. No item replaced; no id or answer key changed.

## Counts
- m12: 29 checked · 26 OK · 1 CONTRADICTION, 1 HINT-POINTER (in a why), 1 LEVEL-GAP (C1 body)
- m13: 29 checked · 23 OK · 5 CONTRADICTION (4 under the "trend verb across categories" ruling, 1 percent vs percentage points), 1 LEVEL-GAP (C1 body)
- m14: 29 checked · 29 OK
- C1 bodies changed: m12s3, m13s2

## Non-OK items
| id | verdict | what was done |
|---|---|---|
| m12s2q1 | CONTRADICTION | why gave Band 6 "to good effect" as Band 7; now "flexibly" |
| m12s3q2 | HINT-POINTER (why) | "grammar ladder / add-ons" (taught nowhere) → "one of the structures that lift a Band 7 report towards Band 8" |
| m12ckq7 | LEVEL-GAP | C1 m12s3 ¶2 now names the three participle faults (dropping *having*, *having been peaked*, no main verb) |
| m13s1q4 | CONTRADICTION (ruling) | given → "far higher among teenagers than among the over-50s … hardly differed between the age groups"; answer still True |
| m13s2q2 | CONTRADICTION (ruling) | correct option → "Older groups spent far less time on social media and gaming" (index 1, not longest) |
| m13s3q2 | CONTRADICTION (ruling) | stem → "social media time was far higher among younger groups"; why → "the gap … 21 hours against six" |
| m13ckq1 | CONTRADICTION (ruling) | why "Thai never rose above two hours" → "Thai was never more than two hours" |
| m13s2q3 | CONTRADICTION | distractor "Nuclear fell by 1%" → "by one percentage point" (15% → 14%) |
| m13ckq4 | LEVEL-GAP | C1 m13s2 ¶1 now lists the process features incl. a key condition such as a temperature |

## For T.Chris
1. m13s1 B1/B2 level text ("stayed level while the others fell/declined") and the screen-time model overview ("fell sharply with age") conflicted with the m07s1 ruling — fixed by the coordinator.
2. Judgement call: *meanwhile* (m12s2q5) and *similarly* (m12ckq2) treated as general English.
3. m13s1q3's why says "a change of rank is a key feature"; left, as the item also works as "the biggest change".

---

## G6 · Grammar Wing (m15–m17) consistency audit, 27 Oct 2026
(Saved by the coordinator from G6's hand-back.)

91 checked · 79 OK · 1 NOT-INTRODUCED (replaced) · 3 CONTRADICTION · 8 LEVEL-GAP (12 A1–B2 patches in companion-levels.js; C1 body changed: m16s3).

| Item | Verdict | What was done |
|---|---|---|
| m15s3q4 → m15s3q9 | NOT-INTRODUCED | "vastly" and marginally-vs-slightly ranking never taught; replaced with an order item: no / slightly / far higher than |
| m15ckq4 | LEVEL-GAP | no + comparative = equal or worse added at A1, A2 |
| m16s1q7 | CONTRADICTION | given said "every" figure sentence takes past simple; now "by default", why allows one past-perfect step back |
| m16s2q2, m16ckq4 | LEVEL-GAP | over the past decade / a decade ago added at A1, A2 |
| m16ckq2 | LEVEL-GAP | "this year" = open time added at A2 |
| m16ckq6 | LEVEL-GAP (C1 too) | no will after when/before/after added to C1 body[0] and A1–B2 |
| m16s3q3 | LEVEL-GAP | by the time + no will at A1 (same patch) |
| m17s3q2 | CONTRADICTION | chart link to closed p-line-museums removed (present perfect keyed) |
| m17s3q1 | CONTRADICTION (why) | why quotes the option exactly |
| m17ckq6, m17s3q7 | LEVEL-GAP | "exist" has no passive; risk + being + V3 added at A1 |

## For T.Chris
1. Boys' names in Grammar Wing items (Ben, Jun, Sim, Kan, Ton) — left as they were.
2. m15s1q6 "Thailand is one of the biggest rice producers in Asia" on p-table-rice, where Thailand is the smallest of the four.
3. m17s3 analogy reuses the closed museum chart with "has increased since 2010" (free-standing sentence, left).
4. theory.simple in topic-15..17 is never shown to students and is out of step in two places.
5. m15s3, m16s1, m17s2 have 8 items (already so).
