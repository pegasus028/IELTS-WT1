# Quillmoor Academy · Second Year — story rebuild brief (15 Oct 2026)

Orchestrator: Fable 5.1. Writer: Opus 5.5. Repo: /tmp/IELTS-WT1 (Task 1 app, https://pegasus028.github.io/IELTS-WT1/).
Reference sibling (first year, Task 2): /tmp/IELTS-WT2.

## What T.Chris asked for
Rebuild the story layer of the Task 1 app so that it is (1) a medium for the main IELTS Writing Task 1 lessons,
(2) modelled on the SECOND Harry Potter book/film (Chamber of Secrets = second year at school), (3) right for two cohorts:
- **returning** readers: 6 tutees who finished the Task 2 app (first year at Quillmoor) and need a continuation —
  they must *see* that the characters are a year older and that the story moves on;
- **new** readers: 30 M4.1 girls who never saw the first year — the story must stand on its own, like reading book 2 first.
Every page highlights at least one C1 / rarely used word as the page's vocabulary card. All ~60 pictures will be newly
generated (Gemini) from a per-page prompt, so every page needs a `prompt`. Narration is pre-recorded (Sonia voice).

## Hard rules (unchanged from QUILLMOOR-T1-SPEC.md — read it, and read /mnt/skills/plugins/harry-potter/SKILL.md §1, §7, §8, §9 and
/mnt/skills/plugins/ielts-writing-task-1/SKILL.md)
1. IP level C: NO Harry Potter names, spells, objects, crests, creatures (no basilisk, phoenix, house-elf, Polyjuice, diary
   named Riddle, Parseltongue, Hogwarts anything). Chamber of Secrets supplies the *shape of the plot only*; every element is
   an original Quillmoor equivalent. Mixed cast; no Thai school uniform; original academy uniform (§9).
2. Truth: every claim about IELTS Task 1 literally true (one examiner, four criteria TA/CC/LR/GRA equal, 20 min, 150+ words
   aim 160–190, overview gate, no opinion/reason/conclusion, two groups, ≥2 comparisons, modes TREND/COMPARE/SEQUENCE/SPACE,
   S1–S8 patterns, E1–E7 error families, Ten Wards). Story devices ("four examiners", "Almanac seal") stay framed as story.
3. ES5 only in story-content.js. UK spelling. Story text B1: present tense, second person, ≤15 words/sentence on average,
   40–90 words per page (a page may run to ~100 when it carries a letter or an article). "you" stays gender-neutral.
4. **Do not change** mission ids, gate checks/checkIds/extra, `opens`, keepsake ids, chapter ids/count (8 + event
   `tournament`), event ids (`sorting`, `house`), tournament task ids, houses' ids/crit/colours/heads. You may change every
   title, place, blurb, keepsake name/desc, page text, ending, newsroom, gate intro/pass, mapIntro, finale, house welcome
   lines (keep their facts). Returning readers keep the same gates.
5. Spoken lines use spoken connectors; formal connectors only in written things (letters, The Whisper, The Lantern, exam).

## The plot shape (Chamber of Secrets → Quillmoor second year). Use these beats; invent the words.
| Book 2 beat | Quillmoor equivalent (fixed) |
|---|---|
| Warning before term | A torn page from an old almanac arrives with Nutmeg: "Do not open the Sealed Archive." (new readers also get the acceptance letter) |
| Missing the train | The tram breaks down on the moor road; the heroine, Juno and Felix finish the climb in Mr Fenwick's rowing boat across the black lake at dusk |
| The celebrity fraud teacher | **Professor Bartholomew Quist**, author of *Quist's Quick Charts* (his face on every cover), the new Master of Reports. He teaches by memorised model reports, invented figures, hyperbole ("skyrocketed", "a staggering 200%"), opinions and reasons, no overview. Comic, vain, never cruel. Every Quist line is a trap the student learns to spot; Dr Halima Strand (Keeper of the Observatory, practical archivist) quietly teaches the truth. Quist takes credit for others' work; exposed in ch7; leaves in ch8 |
| The voice in the walls | Only the heroine hears a whisper in the Observatory pipes: "fell… fell… west… west" — numbers read back to front. Others begin to suspect the heroine is feeding the Gossip Quill |
| Petrifications | **The Frost**: reports turn grey and every figure in them goes blank. First Mr Fenwick's library cat (Marmalade, grey-brown tabby), then Felix's camera and Felix (ch4), then Juno (ch6/7) — found holding a clue (a torn scrap: "LABELS FIRST · MIRROR") |
| The message on the wall | Grey ink above the Tide Clock: "THE ARCHIVE IS OPEN. ENEMIES OF THE OVERVIEW, BEWARE." |
| The diary | **The Blank Almanac**: a leather almanac with empty pages that answers in neat handwriting when you write to it. It flatters copiers and feeds on copied sentences and invented numbers. A first-year, **Ploy Saengkaew** (12, Thai girl, Compass), writes to it every night; it is the hand behind the Frost and the Quill. It shows the heroine a memory of 1976: a student, Orrin Vane, opening the Archive |
| Hagrid framed | Mr Fenwick is blamed (his keys open the Archive) and sent away by the governors in ch6; Dr Hale is suspended; Quist boasts he will solve it |
| The monster | **The Reflector**: in the Sealed Archive under the Observatory, a great curved brass mirror on a clockwork arm, built in 1976 to copy charts; it copies them back to front and breathes grey frost that blanks figures. Not alive, not a snake. Defeated when the heroine turns her own spellbook page, written in her own words with the real figures, to face it: the mirror cannot copy what is not copied |
| The way in | Behind the old Tide Clock case on the Observatory stairs, where the Frost first appeared |
| Fawkes / the Hat's sword | Nutmeg brings the Sorting Lantern's brass ruler (Dr Strand's ruler, the one true scale) at the darkest moment |
| Ginny saved / diary destroyed | Ploy is found cold beside the Reflector; the heroine writes the real figures into the Blank Almanac with moor ink and its handwriting drains away; the Frost lifts, Juno and Felix wake |
| Dobby freed | Quist's books are shown to be copied from Dr Strand's old ledgers; he leaves on the morning tram with his portraits |
| End-of-year | The Almanac Examination goes ahead (the real test is the point); Fenwick returns with his keys; the Hall of Lanterns |

Cohort variants: chapter 1 is the only chapter with heavy `only:` splitting (new: letter, warning, tram, lake, Hall of Lanterns,
Sorting Lantern; returning: warning at home, tram, lake, house kept, Penhallow's "habits that won last term now lose marks").
Chapters 2–8: shared text with 1–2 `only:'returning'` nods per chapter ("Celeste's spellbook last term", "the Quill you faded",
"Priya has graduated, Felix runs The Lantern now"). Returning readers must notice: a year has passed (second-year pins,
Priya gone, Celeste now a friend, Nutmeg older), and the plot is new.

## Lessons per chapter (keep each chapter's modules; the story must *show* these points — see the current story-content.js for
how they were taught, keep what is true, drop the weathercock plot entirely)
1 The Letter / A New Term: what Task 1 is (report, 20 min, 150+, facts only, no opinion), triage: mode, axis, units, years.
2 The Four-Part Charm: 4 paragraphs (intro ≈30 / overview ≈45 / Detail A ≈55 / Detail B ≈55; 160–190), paraphrase the rubric,
  copied rubric is discounted, no conclusion.
3 The Watchtower: the overview (second, "Overall", no figures, names/years/doubled ok; TA ≤5 without it), every detail
  sentence carries a figure, to/by/from/at, percentage points, approximately/just over.
4 The Tide Clock: TREND mode, past simple for past years, projection "is expected to", group the categories into two, select
  3–5 figures per group, degree words (sharply/slightly/steadily/fluctuated), the personal spellbook page with variables.
5 The Hall of Scales: COMPARE mode (no time axis → no trend verbs), respectively, twice as… as, pie shares/fractions/accounted
  for, tables by row and column, the exception, Mending Room.
6 The Cellars and the Moor Maps: SEQUENCE (count stages, sequencers, present simple, passive for human steps, overview = stages
  / linear or cyclical / start / end); SPACE (compass points, demolished/extended/converted/remained unchanged, future for plans).
7 The Library and the Newsroom: two visuals in one report (never combine their figures), E1–E7 error families, reference
  (the former/the latter/this figure) over mechanical linkers.
8 The Almanac Examination: one examiner, four equal criteria, Task 2 counts twice, Ten Wards in order, exemplar reading for
  shape and for what is left out, 20-minute protocol (4 plan / 13 write / 3 check).
Midwinter Tournament event (after ch5): three timed tasks, unchanged.

## Page schema (story-content.js) — add two fields
```js
{ img:'story/ch3-02.webp', alt:'…what the NEW picture will show…', text:'… [[overview|…|ภาพรวม]] … [[ubiquitous|found everywhere|มีอยู่ทุกหนแห่ง|C1]] …',
  rare:{ w:'ubiquitous', g:'found everywhere', t:'มีอยู่ทุกหนแห่ง', pos:'adjective', ex:'Grey sheets were ubiquitous at breakfast.' },
  prompt:'…the Gemini scene line (see below)…', only:'new' /*optional*/ }
```
- Keyword markup keeps `[[word|gloss|thai]]`; the page's rare word is ALSO marked in the text with a fourth segment `|C1`.
- Exactly one `rare` per page, ending page and tournament page (the finale too). Rare = C1 or genuinely uncommon (e.g.
  ubiquitous, precipitous, negligible, commensurate, plateau (v.), surpass, dwindle, stagnate, marginal, disparity,
  threefold, hitherto, in tandem, ostensibly, verbatim, spurious, meticulous). Prefer words that are *useful in a Task 1
  report or in checking one*; no two pages share a rare word; the word must be used naturally in the page text with its
  meaning clear from context (B1 sentence around a C1 word).
- `prompt`: 2–4 sentences describing the scene for the illustrator: who is present (use the fixed character names; the
  heroine is "the heroine"), where, what each is doing, light and mood. No text in the picture. Each named character once.
  Include the Task 1 object in view where there is one (living chart, Tide Clock, scales, map). Variety of composition.
- `alt` describes that prompt's picture (what will be drawn).
- Image file names: `story/y2-ch1-01.webp` … (chapter-page), endings `story/y2-ch1-end.webp`, tournament
  `story/y2-ev-tournament-01.webp`, finale `story/y2-finale.webp`. Pages that exist only for one cohort still get their own picture.

## Fixed cast and visible ageing (for both text and prompts; art bible is in docs/ART-BIBLE-Y2.md — write it too)
- The heroine ("you", ~16–17 now; drawn only ever as "the heroine"): light warm fair skin, gentle oval face, dark brown eyes,
  no glasses, no scar/mole, one long glossy black braid over one shoulder with a midnight-blue ribbon bow, side-swept bangs,
  tan leather satchel with brass buckles, navy-and-silver scarf. Second-year markers: taller, braid longer, a small brass
  Observatory key on the satchel strap, a brass second-year pin on the robe.
- Juno Marlowe (Bridge): Black British, dark curly hair in two puffs, now tied with a copper ribbon; teal-and-copper scarf.
- Felix Okafor: Nigerian-British boy, short hair, brass camera on a strap; now editor of The Lantern, a press badge on a cord.
- Celeste Ashby (Lexicon): sleek black bob grown to the chin, silver clip; violet-purple-and-gold scarf; carries her own
  brown spellbook. Now a friend.
- Ploy Saengkaew (new, 12, first-year, Compass): small Thai girl, two short pigtails with copper beads, navy-and-silver scarf,
  hugs a brown leather almanac.
- Professor Bartholomew Quist (new): 40s, tanned, wavy chestnut hair swept back, trimmed beard, mustard-yellow waistcoat
  under a long brown coat, a monocle on a chain, a stack of his own books (his portrait on the cover, no readable text).
- Dr Halima Strand: 40s, dark hair pinned up with a pencil, rolled sleeves, ink on her fingers, a brass ruler at her belt, no glasses.
- Professor Marisol Penhallow (Head of Examinations): 50s, silver bob, charcoal robe, brass spectacles on a chain.
- Dr Osric Hale (headmaster): clean-shaven, grey hair, tweed waistcoat. Mr Alder Fenwick (librarian): older man, long dark
  coat, iron keys; his cat Marmalade (grey-brown tabby, NOT orange, NOT a kneazle-like creature). Mina Sato (Compass): high
  black ponytail. Heads of house: North (navy), Brigg (teal, bearded), Liang (plum), Weaver (crimson, long white braid).
- The Gossip Quill: violet-black. The Blank Almanac: brown leather, blank pages, writes back. The Reflector: brass mirror,
  clockwork arm, grey frost. Nutmeg: grey-brown owl.
- Allowed scarf pairs only: navy-silver, teal-copper, plum/violet-gold, crimson-cream.

## Deliverables (write all four; do not git commit)
1. `docs/STORY-BIBLE-Y2.md` — chapter-by-chapter synopsis (new and returning), the beat table above filled with page numbers,
   the lesson each page carries, the rare-word list, the cast ageing notes.
2. `story-content.js` — complete replacement (ES5), same top-level shape, ~7 pages per chapter (ch1 up to 10 counting both
   variants), endings, tournament, finale, with `rare` and `prompt` on every page. Keep `version: '2026-10-15'`,
   `term: 'The Observatory · Second Year'`.
3. `tools/words/cards-y2.json` — a card for every rare word and every new keyword not already in cards.json/cards-t1.json
   (same shape: word, pos, level, gloss, thai, example, icon (Lucide name), syn[3]{w,lv}, ant[3]{w,lv}, antNote optional).
   Check against `tools/words/cards.json` and `cards-t1.json` for duplicates.
4. `docs/ART-BIBLE-Y2.md` — the character blocks (one paragraph each, fixed wording to paste into every image prompt), the
   style line ("clean modern anime storybook, soft painterly light"), the reference-sheet prompts (one per main character:
   front and three-quarter view, neutral background, the ageing markers), and the list of every picture key → prompt.

Validation before you finish: `node -e "require('vm')"` style load of story-content.js (`node tools/story-validate.js` if it
exists, else write a quick checker): ES5 only, every page has img/alt/text/rare/prompt, rare word appears in text with `|C1`,
no duplicate rare words, page word counts 40–100, no banned HP names (grep the list in QUILLMOOR-T1-SPEC.md rule 1), every
keyword `[[..]]` has 3 or 4 segments. Report counts (pages, pictures, rare words, new cards) in your final message.
