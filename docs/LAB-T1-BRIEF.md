# Brief: the Task 1 Spellbook (My Spellbook + Spellbook Workshop) — owner Opus B

Read `QUILLMOOR-T1-SPEC.md` first (binding). Then study the Task 2 originals you are porting:
`/root/work/IELTS-WT2/template.js`, `lab.js`, `lab-content.js`, `lab-scenario.js`, `lab-examples.js`, `lab.css`, `Lab.gs`,
`Code.gs` (helpers Lab.gs relies on, the LAB-HOOK), `README.md` sections "Spellbook Workshop", `tools/lab-*.js`, `tools/gs-test.js`.
Canonical Task 1 rules: `/mnt/skills/plugins/ielts-writing-task-1/SKILL.md` and its `references/` (especially
`course-en31208.md` §3 — the four class template assignments A1–A4 with 13 variables each, `chart-type-playbook.md`,
`language-bank.md`, `band-descriptors.md`, `test-technique.md`). The Task 2 method notes on templates (shares 60/50/40/30,
personalisation, population, Wray & Pegg) are in `/mnt/skills/plugins/ielts-writing-task-2/SKILL.md` "Templates in this method".

## Why this matters
T.Chris's method: every student builds a **personalised template** — her own frame sentences, in her own words, with
variables as slots — memorises it, and **populates the variables with prompt-specific content in the exam**. For Task 1 the
spellbook has **four pages, one per mode** (TREND, COMPARE, SEQUENCE, SPACE). Personalisation + correct population (figures
that match the chart, tense by mode, every category, grouped, compared) are what keep it from reading as memorised.
Task 1 has a big advantage over Task 2: the app **knows the data** of every prompt (`window.CONTENT.PROMPTS`, rendered by
`Charts.render`), so variable fills can be checked against the chart by rule, offline, for free.

## What to build (Task 1 versions of the WT2 features)
1. **`lab-content.js`** — `window.LabContent`: for each mode a blueprint skeleton: four paragraphs (P1 intro ≈30 words,
   P2 overview ≈45, P3 group A ≈60, P4 group B ≈60; total 160–190; no conclusion), ~10–14 lines each with id, paragraph, job,
   criterion served, tip, the slots it must contain, and 3 example lines per tier (B1, B2, C1) in the S1–S8 patterns.
   Variables per mode: 11–13, compatible with A1–A4 (`course-en31208.md` §3) but general enough to populate for **every**
   bank prompt of that mode (the bank has line/bar/pie/table/mixed for TREND and COMPARE, process for SEQUENCE, map for SPACE;
   check each prompt's `data`, `groupings`, `keyFeatures`). Each variable: id, label, job, shape (noun phrase / figure+unit /
   year / past-participle phrase / clause), where it appears, whether a data check applies (figure / year / label / none).
   Overview lines must contain **no figure slots**. Shares 60 / 50 / 40 / 30 % and their word budgets per line; target level
   B1/B2/C1. Option to **start from the class template** (A1–A4 text) as a draft that is above 60 % and must be trimmed.
2. **`lab.js` + `lab.css`** — `window.Lab = { mount(el, host), leave(), designed(p, mode) }` with three tabs like WT2:
   - **Design** (Blueprint Studio): pick mode, share, target level; write each line with slot buttons; quick checks (slots
     present, budget, copied-from-example, register bans: I/we/you, opinions/reasons, conclusion words, contractions; overview
     line has no figure slot); **Test Drive**: live preview of her page filled with a Thai-context scenario for that mode
     (`lab-scenario.js`: use/extend the A1–A4 data sets — Lamphun visitors, Chiang Rai transport, coconut sugar, Ban Khlong — and
     show the chart with `Charts.draw`/`render` from a prompt-shaped object); AI coaching via `lab.coach` (optional; works
     without). Versions saved; points for improvement only.
   - **Cast it on a chart** (Assembly Line): pick a saved page → prompts of that mode from the bank (render the chart) →
     fill each variable; timing: untimed / 20 minutes / 1 minute per variable. **Rule-based data check per variable**: a figure
     must match a value in the prompt data (exact, or with an approximation word — around / about / just over / just under /
     nearly / roughly — within half of the chart's gridline step; percentages vs percentage points); a year must be in the
     prompt's time range; a category/stage/feature must match a label (case-insensitive, allow plural/article differences);
     tense check by mode (TREND past dates → past simple; SEQUENCE → present simple passive; SPACE → past simple/present perfect
     passive). Show ✓ / ≈ / ✗ with a short reason. Then the assembled report with her words highlighted, word count, actual
     template share, and `Writer.preflight(text, prompt)` (the Task 1 Ten Wards; it exists in writer.js — read its signature).
     AI rating via `lab.rate` optional. Buttons: **Open in the Scriptorium** (hand the text and prompt to the Writer: call
     `host.openWriter(promptId, text)` — the orchestrator will add it to PCHost) and **Compare with the model** if the prompt has
     a `modelId`.
   - **Spellbook record** (Scorecard): runs by mode and share, best/average band, data-check accuracy %, time, history, chart.
   - **Examples** tab: AI-simulated worked examples (label them so): personas **Nam** (B1, target Band 5.5–6) and **Fah** (B2,
     target Band 6.5–7) — at least one page per mode for each (8), Nam at 60 % and Fah at 40 %, each cast on one bank prompt,
     with the assembled report verified against the data and passing the pre-flight with no red rows. Build into
     `lab-examples.js` from `examples-t1/*.json`.
   Points (like WT2), a quarter to Merits (`p.xp`), Workshop ranks, a few keepsakes (badges with `test` functions; engine
   supports `BADGES[i].test`). Summary on `p.lab` per the spec (`modesDesigned` etc.).
3. **`template.js`** — `window.Template`: **My Spellbook** view (`Template.mount(el, host)`: her four pages side by side, fade
   levels guided / skeleton / exam, print view, "go to the Workshop") and the Scriptorium API
   `Template.framesFor(p, mode)` → `{ mode, paragraphs:[ 'text with {slot} tokens', … ], slots:[{id,label,shape}] } | null`
   and `Template.fill(frames, values)` → text. If she has no saved page for the mode, return null (the Writer then shows the
   generic flight-plan guide it has today).
4. **`Lab.gs`** — Task 1 version of WT2's Lab.gs, same action names (`lab.list`, `lab.saveTemplate`, `lab.saveAttempt`,
   `lab.deleteTemplate`, `lab.deleteAttempt`, `lab.coach`, `lab.rate`), sheets `LabTemplates` / `LabAttempts`, quotas, models
   from script properties with WT2's defaults. Coaching/rating prompts apply the Task 1 rules: gate ladder and **ceilings**
   (no overview → TA ≤ 5; figures in the overview are a fault; opinion/conclusion → TA ≤ 6 or ≤ 5; one category missing TA ≤ 6,
   two → ≤ 5; copied rubric discounted; length tiers), approximation tolerance, half-band rule, task band = mean rounded to the
   nearest half, CEFR official mapping only (5.5–6.5 ≈ B2, 7–8 ≈ C1, 4–5 ≈ B1). The variable coach receives the prompt data so
   it can check accuracy. It relies on helpers that will exist in this repo's Code.gs (ported from WT2's: `findStudent`,
   `sheet`, `rows`, `append`, `parse`, `prop`, the token check) — mirror WT2's dependencies exactly; do not edit Code.gs.
5. **Tests** — `tools/lab-validate.js` (content: every mode's variables can be populated for every bank prompt of that mode —
   write the populations as data in `examples-t1/populations.json` or derive them; budgets; example lines pass the quick
   checks; examples' figures match data), `tools/lab-gs-test.js` (Lab.gs in Node with a fake sheet + fake Claude, using a copy
   of WT2's Code.gs helpers as a stand-in), `tools/lab-smoke.py` (Playwright, offline mode `cc.apiUrl='off'`: design a TREND page,
   cast it on a prompt, check the data marks, open the record). Chromium is pre-installed (PLAYWRIGHT_BROWSERS_PATH set).

## How to work
- Make a sandbox copy for running the app end-to-end: `cp -r /root/work/IELTS-WT1 /root/work/lab-sandbox` and wire it there
  however you need (index.html script tags, a `view-lab` / `view-template` section, a minimal `window.PCHost` in student.js —
  WT2's student.js shows the real one). Deliver only your owned files into `/root/work/IELTS-WT1`, plus `docs/LAB-T1.md`
  with: the exact `index.html` markup and script tags, CSS links, PCHost members you rely on, Code.gs LAB-HOOK line, the
  story-gate helper (`Lab.designed(p, mode)`), and test commands. The orchestrator is porting WT2's student.js/index.html at
  the same time; keep your view self-contained (renders inside the element it is given).
- ES5 in all browser files. UK spelling. Student-facing text at B1–B2, short sentences. Quillmoor labels (Design · Cast it on
  a chart · Spellbook record · My Spellbook). T.Chris's six-point check applies to any multiple-choice you write.
- Storage keys `cc.*` only (never `pc.*`). The API base URL is `API.url` (api.js), token in `localStorage['cc.token']`.
- Do not `git commit`/`push`. Final message: what you built, test results, integration steps, open issues.
