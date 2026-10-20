# Findings from harness build (before live runs), 20 Oct 2026
## From items agent
1. BUG story.js:830 data-mi unfiltered index vs filtered list → chapter-1 rows open wrong mission; last row TypeError. (P0 for M4.1)
2. engine.js:778 free-text Check disabled under 12 words (claimnum 4) with no message.
3. writer.js:256 checker rise/fall groups miss "went up / go down / an increase / drop" → A1/A2 correct overviews fail ("Missing a main feature: mention rose").
4. Missing images story/y2-ev-tournament-01..03.webp, story/y2-finale.webp.
5. Mending Room / Exemplar Archive hidden from nav until ch5/ch4.
## From writing agent
1. writer.js:507 Send disabled silently in guided until manual Landing lines ticked (tooltip only).
2. Plan Wards auto lines give no reason when unticked.
3. writer.js:427 exam mode button says "The Ten Wards →" though Wards hidden.
4. writer.js:231 prep ward false positive ("fell at almost the same rate", "rose in 2016").
5. Two word counts on screen after rubric discount.
6. student.js:937 spellbook fallback sticky toast; radio contradicts.
7. Revise once: no signal that the second check is final.
8. bootcamp.js:33 70% pass line unreachable for A2 (second choice 5/10) — story mission blocks.
9. bootcamp.js:290 #bc-next disabled with no message.
10. B1 timing: 170 words at 13 wpm ≈ 13.5 min; little room for Wards+revision.
11. compare ward does not count "but/less/bigger"; note could list accepted words.
## From spellbook agent
1. student.js:108 LAB_START_MODE never read by lab.js → mission lands on Design home; 5 setup steps though mode/tier known.
2. lab.js:703 Design tab shows stale summary after casting; must find "← All pages".
3. lab.js:1220 cast variable card never shows VAR.eg/eg2 (missing "Show an example").
4. 1-min cast clock starts on first paint; intro paraphrase slot times out for A2–B2.
5. template.js:646 category label in value makes wrong-series figure ✓.
6. template.js:223 numbers() digits only ("one hour" ✗).
7. template.js:365 near-miss note names same series on both sides.
8. template.js:386 correct change statement rejected in end-figure slot.
9. Workshop levels start at B1; A1/A2 pushed to 60% longest frames.
10. Workshop card text B2-level; no whole-line sample at her level.
11. Nam/Fah examples only on 4th tab; nothing points there; no A1/A2 example student.
12. Memory check bag-of-words; exam fade shows slot list.
13. A1 design ~55 min vs promised 25–35; Coach me → Next two clicks per line even offline.
14. One 404 after login every run (TBD which asset).
