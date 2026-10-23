# Cross-group contracts from WS-G (app hardening + roster), 23 Oct 2026

Branch `WS-G` from main 49ddfcf. Everything another workstream or WS-I depends on is listed here.

## 1. Code.gs — additive changes that need a redeploy

### 1a. New in WS-G (23 Oct): `resetPassword` — needs a New version even though the 21 Oct Code.gs is deployed
| Change | Kind | Live effect until redeploy |
|---|---|---|
| action `resetPassword {tt, id}` → `{ok, id}` (teacher token): sets the Students row's `pw` to `''`, retires the `token`, clears `lock:pw:<id>`, writes "password reset <id>" to Log | new action, no new column | the Staff Room's "Reset password" button answers "Unknown action" |
| `login()`: when `s.pw === ''` (reset state) any password of 4+ characters is accepted, its v2 hash stored, the sign-in continues; shorter → "Your password was reset. Choose a new password of at least 4 characters."; Log line "password set after reset <id>" | changed body of `login`, additive behaviour (a non-empty pw behaves exactly as before) | — |

Client side: `api.resetPassword(id)` (api.js, next to `archiveStudent`; offline fallback empties the local pw); teacher.js "Reset password" button (`#d-reset`) beside "Archive this student" with confirm + toast "Reset. Next time she signs in, the password she types becomes her new one." First use: m41-ai (Airin). The front end works with the old backend except for that one button, so deploy order does not matter.

### 1b. 21 Oct changes (handover items 1, 2, 5) — T.Chris redeployed these on 23 Oct

| Change | Kind | Live effect until redeploy |
|---|---|---|
| `saveAttempts` writes each Attempts row once per `ts + studentId + itemId + given` (CacheService hashes, 6 h; one scan of the last 3000 rows on a cold cache); `save` answers `{ok:true, added:n}` | changed body, same action and sheet columns; `ts` and `given` written as plain text | a resent outbox row (item 1 keeps rows until the server says ok) is written twice; the Staff Room still keeps the best, so harmless but untidy |
| `dedupeAttempts()` — one-off clean-up, run from the Apps Script editor (takes the lock, copies to "Attempts backup <date>", removes repeats, logs a line) | new function, not an action | — |
| Students sheet header gains column 8 `archived` (`ensureHeader('Students')` adds it on first use; nothing moves) | additive column | the Archive button answers "Unknown action" |
| action `archiveStudent {tt, id, archived:true|false}` → `{ok, id, archived:'YYYY-MM-DD'|''}` (teacher token) | new action | as above |
| `roster` rows carry `archived`; `houses` skips archived students | additive field | the House Cup counts the test accounts until the redeploy |

**T.Chris: Deploy → Manage deployments → pencil → New version** (for 1a). Order: the pages work with the old backend except the Reset button, so deploy any time; nothing breaks between.

## 2. Roster (roster.js) — for WS-B, WS-C and WS-I

- `ROSTER_GROUPS[0]` (key `m41`, cohort `M4.1`) now has **30** students in the order of `roster/M4-1-Roster.xlsx` (class register). New id: `m41-donut` ("Donut"). Display names changed, ids unchanged: `m41-ai` → "Airin", `m41-lillil` → "Lilil".
- `tut-donut` (Tutoring) is unchanged: Donut has two separate accounts, one per programme. Do not merge them.
- student.js `fillRoster` no longer sorts alphabetically; the Fast Access `<select>` follows roster order. Anything (team lists in WS-B/WS-C, the Groups tab) that needs the roster should read `ROSTER` / `ROSTER_GROUPS` from roster.js rather than copy the names.
- Code.gs needs **no** roster action: accounts are created on first Fast Access sign-in (`register`), with the cohort stamped from `fastGroup.cohort`. Students who already created accounts under `m41-ai` / `m41-lillil` keep them; the Staff Room shows `progress.displayName` (what the student set) first and the roster name second.
- `tools/ws-g-test.js` pins the 30 names and the two ids; `tools/smoke.py` asserts the Fast Access list.

## 3. Cache versions

`?v=20261027a` on `roster.js` and `api.js` (index.html + teacher.html), `student.js`, `example-real.js` (index.html), `teacher.js` (teacher.html). WS-I: when merging, take either side of a `?v=` conflict and set one fresh version on every changed file.

## 4. Test harness

- `tools/smoke.py` and `tools/lab-smoke.py` find the chromium binary with a glob over `/opt/pw-browsers/chromium-*/chrome-linux*/chrome` (currently chromium-1243); `CHROME=` still overrides. No `playwright install` needed.
- `tools/ws-g-test.js` is the WS-G suite; add it to the test line after `save-order-test.js`.
