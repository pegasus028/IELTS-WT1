# QA log — Quillmoor Task 1 build (October 2026)

An independent review (Opus) of the integrated build found 1 blocker and 6 major issues plus minor nits. All were fixed and re-tested.

| Severity | Finding | Fix |
|---|---|---|
| Blocker | A failed login could fall back to a blank local account and then overwrite the student's cloud progress | `lostServer()` blocks the blank fallback when a server URL is set; `Code.gs save()` refuses a save 200+ XP below the stored copy (`stale: true`) and the client loads the server copy |
| Major | Expired token caused silent save/report failures | "Not signed in." prompts a re-login modal |
| Major | Reports written offline never reached the sheet | Report queue `cc.repbox.v1`, flushed every 15 s and on start |
| Major | AI estimates could award the final seal | Only teacher-released marks count (`absorbMarks`) |
| Major | Offline teacher PIN fallback leaked the demo PIN | Fallback refused when a URL is set; error text no longer shows the PIN |
| Major | Ten Wards too lax | Copied rubric of 10+ words is red and not counted; a missing category is red (amber for one in SEQUENCE/SPACE); unfilled `[Slot]` is red |
| Major | Story report gates accepted short or wrong-mode texts | Gates check mode, 150+ words, 300–1200 s, exam/mock/weekly as needed |
| Minor | Sentence splitter used regex lookbehind (old iPads) | Rewritten without lookbehind; validator guards against it |
| Minor | Exam mode showed Wards before submit | Hidden until submit; no revise in exam mode |
| Minor | Map titles for returning readers, `labDesigned` fallback, story and sorting wording | Fixed |

## Still open (teacher decisions)
- Resolved: Donut is a tutee only (removed from M4.1). Soda is a boy; story text is gender-neutral.
- Some storybook pictures show a girl heroine, which does not fit Soda.
- Thai glosses in the word cards need a native-speaker check; Reading Room `[check]` items (`docs/READING-ROOM-T1.md`).
- Picture wishes (`artWish` in `story-content.js`: ch1 p9, ch4 p1, ch5 p1, ch7 p4).
- Narration audio not built (network blocked edge-tts); browser voice is used.
- The Task 2 house cannot be imported from the cloud; returning students pick it once.
- Apps Script: replace `Code.gs`, add `Lab.gs`, deploy a New version.
