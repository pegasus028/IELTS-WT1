# VERIFY — checks before every deployment

1. `node tools/validate.js` prints `OK — no errors` (ids unique, tags valid, answers in range, charts exist, build tiles match solutions).
2. `node tools/test-preflight.js`: every Band 8+ model is "All green" or amber only; the Band 6 contrast shows red rows for no overview, no comparison, reason, conclusion.
3. `python3 tools/smoke.py` (needs Playwright + Chromium): signs in, clears a module, writes and submits a report, dissects a model, marks and releases on the Flight Deck, sets an assignment, runs a projector round, joins it as a student. Prints `console errors: 0`. Screenshots land in `tools/shots/`.
4. Open `index.html` on a phone (≤ 380 px): the Writer is usable, charts scale, nothing overflows.
5. Toggle dark theme in Settings: charts, maps and process diagrams remain legible.
6. `Code.gs`: after any change, deploy a **new version**; open the Flight Deck and confirm the toast says "Connected to <sheet name>".
7. Content rule: no item, prompt or model may reproduce a real IELTS paper, Cambridge book task or a published model answer. Prompts are original and data-generated.
8. Students see quartiles or their own bands only — never a class rank. Teacher marks stay hidden until released; AI estimates stay hidden unless the teacher ticks "let the student see this".
