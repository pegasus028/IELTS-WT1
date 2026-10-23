# WS-J — The Grammar Wing (Modules 15–17): contracts for other workstreams

Written 23 Oct 2026. Branch WS-J from main 49ddfcf. No Code.gs / Lab.gs change: every item uses existing REMEDIATION tag ids (gra-article, gra-plural, gra-pattern, gra-tense, gra-passive, gra-agreement, lr-compare-vocab, lr-degree, lr-number-amount, lr-proportion, lr-trend-vocab, ta-no-data, kn-triage-mode), so the Code.gs TAGS mirror is unchanged and no redeploy is needed.

## Module ids (for WS-C's participation ledger)
| Module | id | level id | check id | sub ids | source app |
|---|---|---|---|---|---|
| 15 Comparing | `m15` | `m15l1` | `m15ck` | `m15s1` `m15s2` `m15s3` | Departure Board |
| 16 Tense by the Dates | `m16` | `m16l1` | `m16ck` | `m16s1` `m16s2` `m16s3` | Postcards & Plans |
| 17 Active or Passive | `m17` | `m17l1` | `m17ck` | `m17s1` `m17s2` `m17s3` | Voice Control |

`CONTENT.TOPICS` now has 18 entries (the three are appended after m14; ranks unchanged). `Progress.checksCleared(p)` and `C.TOPICS.length` therefore read n/18. Module mastery for the ledger: `p.subs[subId].best >= Engine.PASS_SUB (0.6)` and `p.checks[checkId].best >= Engine.PASS_CHECK (0.75)`, exactly as for m00–m14. Each module object also carries `wing: 'grammar'` and `source: {app, id}`; `window.Companion.isCompanion(moduleId)` says whether a module is a companion class, if the ledger wants to show the Grammar Wing separately.

## Item ids (for WS-D's tickets)
Lesson items `m15s1q1 … m15s3q8`, `m16s1q1 … m16s3q8`, `m17s1q1 … m17s3q7`; gate items `m15ckq1 … m15ckq8`, `m16ckq1 … m16ckq8`, `m17ckq1 … m17ckq8` (91 in all; the exact list prints from `node tools/companion-test.js --static` or `Object.keys(Engine.Bank.all()).filter(id => /^m1[5-7]/.test(id))`). Every item has `src` = `<app>:<source item id>` (e.g. `departure-board:s3l2-02`, `postcards-plans:s7l2-01`, `voice-control:t2l3s2-1`); two Task-1 judge items are `ws-j:new (...)`. Item shapes are the Observatory's; three extra shapes are rendered by companion-engine.js: `pick {shop, items[{name,price,note}], answer}`, typed `gap {lines, accept[]}`, and `spot` with `also[]`. Attempt rows post with the normal `itemId`, `topic` = m15/m16/m17 and the item's tag, so the Staff Room heat map and WS-C's tag counts pick them up without a change.

## Story
Nine `{kind:'sub', optional:true, wing:true}` missions in story-content.js: chapter 4 (TREND) m16s1, m16s2, m17s2 · chapter 5 (COMPARE) m15s1, m15s2, m15s3 · chapter 6 m16s3, m17s1, m17s3. They are mission rows only — no `gate.checks` or `gate.extra` line was added — so every chapter's keepsake is earned exactly as before; story.js ignores `optional` (it renders them like any lesson mission). If WS-I/WS-C want them excluded from the chapter ring, filter on `m.optional` in `Story.missions`.

## Script order and files (for WS-I's merge)
index.html: `topic-15.js`, `topic-16.js`, `topic-17.js` after topic-14; `companion-levels.js` after lesson-levels.js; `companion-engine.js` immediately after engine.js (it wraps `Engine.mount`, so it must load before student.js); `companion.css` after writer.css. teacher.html: the three topic files and companion-engine.js. All new tags `?v=20261027a`; content.js, media.js, story-content.js, student.js, teacher.js tags bumped to `20261027a`. podcasts.html (not owned by WS-J) still has `media.js?v=20261013b` — bump it on merge. Tools changed: validate.js, fairness.js, writer-test.js, examples-check.js, build-lesson-audio.py load every `topic-NN.js`; smoke.py has a Grammar Wing pass; new tools/companion-test.js. 45 new clips under audio/lessons/ and a rebuilt index.js.
