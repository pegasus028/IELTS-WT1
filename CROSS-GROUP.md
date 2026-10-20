# Cross-group needs from builder C (Group C: lab.js, lab-content.js, template.js, lab.css, lab-examples.js, lab-samples.js)

## For the integrator (index.html — not edited by C)
1. **New script file `lab-samples.js`** (WP18). Add, straight after `lab-examples.js` and before `lab-scenario.js`:
   ```html
   <script src="lab-samples.js?v=<bump>"></script>
   ```
   lab.js degrades gracefully without it (no "Show an example" on Design lines), but the WP is only live with the tag. teacher.html does not need it.
2. `?v=` bump on: lab.js, lab-content.js, template.js, lab.css (and the new lab-samples.js tag). tools/lab-harness.py already loads lab-samples.js.

## For builder A (student.js) — nothing to change
- `PCHost.labMode(mode)` → `window.LAB_START_MODE` is now read and cleared by `Lab.mount` (WP16). The existing call in the mission row (`PCHost.labMode(it.mode || null); show('lab')`) is all that is needed.
- `defaultLevel()` in lab.js also reads `p.explainLevel` (A1/A2 on the B1 track → the new A2 setup level). No new PCHost member.

## For the harness bot (tools/walkthrough/bot/rooms-spellbook.js) — new or changed steps
- **Timed cast (`timing: '1min'`)**: after clicking the prompt card, press `#lab-rstart` (Start card) before `#lab-val` appears.
- **Design offline**: `#lab-coach` reads "Check line →"; after it, a clean line has already moved on (`Lab._state.build.idx` incremented, `#lab-fb` shows `.lab-fb-prev`); only click `#lab-next` when `build.idx` is unchanged. `build.fb` is still set (it carries `fromLine`).
- **Memory check text** now reads "NN% of your page words recalled, MM% in the right order: …" — `parseInt` still gives the words figure.
- `LAB_START_MODE`: `openLab()` calls `labMode(null)` before `show('lab')`, so the bot never triggers the mission landing; if it stops doing that, the setup opens preselected (`#lab-startbuild` present, `#lab-cancel` goes home).
