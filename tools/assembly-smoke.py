#!/usr/bin/env python3
"""WS-B · Assembly v2 smoke test (demo mode, Playwright + Chromium).
Usage: python3 tools/assembly-smoke.py      (CHROME=/path/to/chrome to pick a binary; no `playwright install`)

Runs the Staff Room projector and a student console side by side in one browser context
(same origin, so the local Projector store is shared) through the six phase-1 games:
Mode Sort (choice, two cards answered, end early, reveal, close, post points), Overview or Not
(judge), Number Hunt (data-checked post, pattern point), Paraphrase Relay (copied-run and
element checks), Twice As Much (bid, reveal), Examiner's Chair (checklist vs key).
Checks the student page at 390 px and 780 px and the teacher page at 780 px and 1100 px for
sideways overflow, and fails on any page error or console error. Screenshots in tools/shots/asm-*."""
import os, sys, json, time, http.server, threading, socketserver, functools
from playwright.sync_api import sync_playwright

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
SHOTS = os.path.join(ROOT, 'tools', 'shots'); os.makedirs(SHOTS, exist_ok=True)
PORT = 8769
class Quiet(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a): pass
socketserver.TCPServer.allow_reuse_address = True
httpd = socketserver.TCPServer(('127.0.0.1', PORT), functools.partial(Quiet, directory=ROOT))
threading.Thread(target=httpd.serve_forever, daemon=True).start()
BASE = 'http://127.0.0.1:%d/' % PORT

errors, missing = [], []
def step(m): print('·', m)
def shot(page, name): page.screenshot(path=os.path.join(SHOTS, 'asm-' + name + '.png'), full_page=True)
def overflow(page): return page.evaluate("document.documentElement.scrollWidth - document.documentElement.clientWidth")
def no_overflow(page, label):
    o = overflow(page); assert o <= 0, '%s: sideways overflow %d px' % (label, o)
def wire(page):
    page.on('console', lambda m: errors.append(m.text) if m.type == 'error' and ((m.location or {}).get('url', '') or BASE).startswith(BASE) else None)
    page.on('pageerror', lambda e: errors.append(str(e)))
    page.on('response', lambda r: missing.append(r.url.replace(BASE, '')) if r.status == 404 and r.url.startswith(BASE) else None)

def login_student(page, name='Proud'):
    page.goto(BASE + 'index.html'); page.wait_for_timeout(500)
    page.evaluate("localStorage.setItem('cc.apiUrl','off')"); page.reload(); page.wait_for_timeout(700)
    page.click('#tab-m41'); page.wait_for_timeout(150)
    val = page.evaluate("Array.from(document.querySelectorAll('#f-pick option')).filter(o=>o.dataset.name===%r)[0].value" % name)
    page.select_option('#f-pick', val); page.fill('#f-pw', 'test1234'); page.click('#btn-go')
    page.wait_for_selector('#screen-app:not(.hidden)', timeout=8000); page.wait_for_timeout(400)

def login_teacher(page):
    page.goto(BASE + 'teacher.html'); page.wait_for_timeout(600)
    page.evaluate("localStorage.setItem('cc.apiUrl','off')"); page.reload(); page.wait_for_timeout(600)
    page.fill('#pin', '1234'); page.click('#gate-go'); page.wait_for_timeout(900)
    page.click('.tnav button[data-view="projector"]'); page.wait_for_timeout(300)

def open_round(tp, game, ri=0, flash=None, answer=None, minutes=None):
    tp.click('.tnav button[data-view="projector"]'); tp.wait_for_timeout(200)
    tp.select_option('#pj-game', game); tp.wait_for_timeout(100)
    tp.select_option('#pj-round', str(ri)); tp.wait_for_timeout(100)
    if flash: tp.fill('#pj-flash', str(flash)); tp.fill('#pj-answer', str(answer))
    if minutes: tp.fill('#pj-min', str(minutes))
    tp.click('#pj-go'); tp.wait_for_timeout(600)
    code = tp.inner_text('#projector .projcode').strip()
    assert len(code) == 5, code
    return code

def join(sp, code, team='Team 2'):
    sp.evaluate("window.PCHost.show('live')"); sp.wait_for_timeout(300)
    if sp.query_selector('#lv-leave'): sp.click('#lv-leave'); sp.wait_for_timeout(200)
    sp.fill('#lv-code', code); sp.select_option('#lv-team', team); sp.click('#lv-join'); sp.wait_for_timeout(700)
    assert sp.query_selector('#lv-stage'), 'student did not join'

with sync_playwright() as p:
    exe = os.environ.get('CHROME') or '/opt/pw-browsers/chromium-1243/chrome-linux64/chrome'
    b = p.chromium.launch(executable_path=exe if os.path.exists(exe) else None)
    ctx = b.new_context(viewport={'width': 1100, 'height': 900})
    tp = ctx.new_page(); wire(tp)
    sp = ctx.new_page(); sp.set_viewport_size({'width': 390, 'height': 844}); wire(sp)

    step('sign in: Staff Room (demo PIN) and a student (Proud, M4.1)')
    login_teacher(tp); login_student(sp)
    assert tp.query_selector('#pj-game option[value="mode-sort"]'), 'Assembly home did not take over the projector tab'
    games = tp.evaluate("Array.from(document.querySelectorAll('#pj-game option')).map(o=>o.value)")
    for g in ['mode-sort', 'paraphrase-relay', 'overview-or-not', 'number-hunt', 'group-them', 'twice-as-much', 'slice-it', 'table-detective', 'examiners-chair']: assert g in games, g
    shot(tp, '00-home')

    # ---------------------------------------------------------------- Mode Sort (choice)
    step('Mode Sort: open (flash 2 s · answer 4 s), student joins at 390 px')
    code = open_round(tp, 'mode-sort', 0, flash=2, answer=4)
    assert tp.inner_text('#pj-phase').strip().lower() == 'lobby'
    join(sp, code, 'Team 2')
    assert 'Waiting' in sp.inner_text('#lv-stage')
    no_overflow(sp, 'live lobby 390'); shot(sp, '01-live-lobby-390')
    tp.click('#pj-start'); tp.wait_for_timeout(900)
    # the student polls the lobby every 4 s; wait for the run state
    sp.wait_for_selector('.asm-opt', timeout=9000)
    assert 'Card' in tp.inner_text('#pj-stage'), tp.inner_text('#pj-stage')[:200]   # LOOK (chart) or ANSWER (hidden) phase
    shot(tp, '02-proj-modesort-flash')
    # answer card 1 (or whichever is current) quickly: right mode, right unit
    cur = sp.evaluate("(function(){var L=window.Assembly.live();var ca=window.Assembly.cardAt(L.rd,L.state.t0,Date.now());return {n:ca.card.n, mode:ca.card.qs[0].accept[0], unit:ca.card.qs[1].accept[0], flashing:ca.flashing};})()")
    sp.click('.asm-opt[data-q="mode"][data-o="%s"]' % cur['mode'])
    sp.click('.asm-opt[data-q="unit"][data-o="%s"]' % cur['unit'].replace('"', '\\"'))
    sp.wait_for_timeout(300)
    assert 'Sent' in sp.inner_text('#lv-cardmsg'), sp.inner_text('#lv-cardmsg')
    no_overflow(sp, 'live choice 390'); shot(sp, '03-live-choice-390')
    # next card: wrong mode on purpose
    sp.wait_for_timeout(6500)
    cur2 = sp.evaluate("(function(){var L=window.Assembly.live();var ca=window.Assembly.cardAt(L.rd,L.state.t0,Date.now());return {n:ca.card.n, mode:ca.card.qs[0].accept[0], unit:ca.card.qs[1].accept[0]};})()")
    assert cur2['n'] != cur['n'], 'card did not advance'
    wrong = [m for m in ['TREND', 'COMPARE', 'SEQUENCE', 'SPACE'] if m != cur2['mode'] and m not in sp.evaluate("window.Assembly.live().rd.cards[%d].qs[0].accept" % (cur2['n'] - 1))][0]
    sp.click('.asm-opt[data-q="mode"][data-o="%s"]' % wrong); sp.click('.asm-opt[data-q="unit"][data-o="%s"]' % cur2['unit'].replace('"', '\\"')); sp.wait_for_timeout(400)
    tp.wait_for_timeout(3500)   # teacher polls every 3 s
    cells = tp.evaluate("Array.from(document.querySelectorAll('.asm-matrix td')).map(td=>td.textContent)")
    assert 'Team 2' in cells, cells
    step('Mode Sort: end early → reveal shows the traps; close → bank; post points (local store)')
    tp.click('#pj-reveal'); tp.wait_for_timeout(500)
    assert 'TRAP' in tp.inner_text('#pj-stage') or 'years' in tp.inner_text('#pj-stage').lower(), tp.inner_text('#pj-stage')[:300]
    team2 = tp.evaluate("(function(){var s=window.Assembly.projector();var sc=window.Assembly.scoreRound(s.rd,s.posts,{},{});return sc.teams['Team 2'];})()")
    assert team2 and team2['total'] >= 2, team2   # card 1 right (3, or 2 if late) + card 2 wrong mode (1, 0 or -1)
    shot(tp, '04-proj-modesort-reveal')
    tp.click('#pj-closer'); tp.wait_for_timeout(300)
    tp.click('#pj-points'); tp.wait_for_timeout(600)
    assert 'Points posted' in tp.inner_text('#projector'), 'points were not posted'
    pts = json.loads(tp.evaluate("localStorage.getItem('cc.asm.v1')"))['points']
    assert len(pts) >= 5 and all(r['team'] == 'Team 2' for r in pts) and any(r['studentId'] == 'm41-proud' for r in pts), pts
    sp.wait_for_timeout(1500)
    marks = sp.inner_text('#lv-mine')
    assert 'Team total' in marks, marks
    shot(sp, '05-live-choice-done-390')

    # ---------------------------------------------------------------- Overview or Not (judge)
    step('Overview or Not: card text on both screens, five labels, one tap sends')
    tp.click('#pj-next'); tp.wait_for_timeout(300)
    code = open_round(tp, 'overview-or-not', 0)
    join(sp, code, 'Team 2'); tp.click('#pj-start'); tp.wait_for_timeout(600)
    sp.wait_for_selector('.asm-opt', timeout=9000)
    assert sp.evaluate("document.querySelectorAll('.asm-opt').length") == 5
    assert 'Overall' in tp.inner_text('#pj-stage') and 'Overall' in sp.inner_text('#lv-stage')
    sp.click('.asm-opt[data-o="good"]'); sp.wait_for_timeout(300)
    assert 'Sent' in sp.inner_text('#lv-cardmsg')
    no_overflow(sp, 'live judge 390'); shot(sp, '06-live-judge-390')
    tp.click('#pj-reveal'); tp.wait_for_timeout(300); tp.click('#pj-closer'); tp.wait_for_timeout(300)

    # ---------------------------------------------------------------- Number Hunt (datapost)
    step('Number Hunt: a green sentence and a wrong figure; pattern point; reveal shows samples')
    tp.click('#pj-next'); tp.wait_for_timeout(300)
    code = open_round(tp, 'number-hunt', 0)
    assert tp.inner_text('#pj-phase').strip().lower() == 'run', 'post rounds start running at once'
    join(sp, code, 'Team 3')
    sp.fill('#lv-text', 'Chinese rose steadily from 60 students in 2016 to 140 in 2024.'); sp.click('#lv-post'); sp.wait_for_timeout(500)
    sp.fill('#lv-text', 'German fell to 99 in 2024.'); sp.click('#lv-post'); sp.wait_for_timeout(500)
    mine = sp.inner_text('#lv-mine')
    assert '✓ 60' in mine and '✓ 140' in mine and '✗ 99' in mine and '+1' in mine, mine
    no_overflow(sp, 'live datapost 390'); shot(sp, '07-live-numberhunt-390')
    tp.wait_for_timeout(3500)
    posts = tp.inner_text('#pj-posts')
    assert '✗ 99' in posts and '✓ 140' in posts, posts
    tp.click('.asm-post [data-k="pattern"] >> nth=-1'); tp.wait_for_timeout(300)   # the oldest post (Chinese…) is last in the list
    t3 = tp.evaluate("(function(){var s=window.Assembly.projector();var m={};for(var k in s.marks)m[k]=s.marks[k];return window.Assembly.scoreRound(s.rd,s.posts,m,{}).teams['Team 3'];})()")
    assert t3['auto'] == 0 and t3['teacher'] == 1, t3    # +1 green −1 cross +1 pattern
    tp.click('#pj-reveal'); tp.wait_for_timeout(300)
    assert 'Sample sentences' in tp.inner_text('#pj-stage')
    shot(tp, '08-proj-numberhunt-reveal')
    sp.wait_for_timeout(8500)   # student polls every 8 s while running
    assert '+1 pattern' in sp.inner_text('#lv-mine'), sp.inner_text('#lv-mine')
    tp.click('#pj-closer'); tp.wait_for_timeout(300)

    # ---------------------------------------------------------------- Paraphrase Relay (post + relay checks)
    step('Paraphrase Relay: copied task sentence red, a clean P1 complete')
    tp.click('#pj-next'); tp.wait_for_timeout(300)
    code = open_round(tp, 'paraphrase-relay', 0)
    join(sp, code, 'Team 4')
    task = sp.evaluate("window.Assembly.live().rd.relay.taskSentence")
    sp.fill('#lv-text', task); sp.click('#lv-post'); sp.wait_for_timeout(500)
    assert 'copied run' in sp.inner_text('#lv-mine') and '✗' in sp.inner_text('#lv-mine')
    sp.fill('#lv-text', 'The line graph illustrates how many students joined three different clubs at a secondary school in each year from 2016 to 2024.'); sp.click('#lv-post'); sp.wait_for_timeout(500)
    assert 'Team total this round: 1' in sp.inner_text('#lv-mine'), sp.inner_text('#lv-mine')   # +2 −1
    shot(sp, '09-live-relay-390')
    tp.click('#pj-reveal'); tp.wait_for_timeout(300); tp.click('#pj-closer'); tp.wait_for_timeout(300)

    # ---------------------------------------------------------------- Twice As Much (bid)
    step('Twice As Much: bid 2, S5 sentence, pattern ticked, reveal → win 2')
    tp.click('#pj-next'); tp.wait_for_timeout(300)
    code = open_round(tp, 'twice-as-much', 0)
    join(sp, code, 'Team 5'); tp.click('#pj-start'); tp.wait_for_timeout(600)
    sp.wait_for_selector('[data-bid]', timeout=9000)
    sp.click('[data-bid="2"]'); sp.wait_for_timeout(500)
    assert 'Bid: 2' in sp.inner_text('#lv-stage') or 'Bid:' in sp.inner_text('#lv-stage'), sp.inner_text('#lv-stage')[:200]
    sp.fill('#lv-text', 'Finland was far higher than Thailand, at 24 and 6 books respectively.'); sp.click('#lv-post'); sp.wait_for_timeout(500)
    assert 'Waiting for the reveal' in sp.inner_text('#lv-mine')
    tp.wait_for_timeout(3500)
    assert 'Bid 2' in tp.inner_text('#pj-posts')
    tp.click('.asm-post [data-k="pattern"]'); tp.wait_for_timeout(300)
    tp.click('#pj-reveal'); tp.wait_for_timeout(500)
    assert 'wins 2' in tp.inner_text('#pj-posts') and 'Model sentences' in tp.inner_text('#pj-stage'), tp.inner_text('#pj-posts')
    shot(tp, '10-proj-bid-reveal')
    sp.wait_for_timeout(8500)
    assert 'You win 2' in sp.inner_text('#lv-mine'), sp.inner_text('#lv-mine')
    shot(sp, '11-live-bid-390')
    tp.click('#pj-closer'); tp.wait_for_timeout(300)

    # ---------------------------------------------------------------- Examiner's Chair (checklist)
    step("Examiner's Chair: ten ticks per the key → 10 matches, +3; reveal shows the key and the ceiling")
    tp.click('#pj-next'); tp.wait_for_timeout(300)
    code = open_round(tp, 'examiners-chair', 0)
    join(sp, code, 'Team 6'); tp.click('#pj-start'); tp.wait_for_timeout(600)
    sp.wait_for_selector('#lv-submit', timeout=9000)
    key = sp.evaluate("window.Assembly.live().rd.script.key")
    for i, k in enumerate(key):
        if k: sp.check('.asm-check input[data-i="%d"]' % i)
    no_overflow(sp, 'live checklist 390'); shot(sp, '12-live-checklist-390')
    sp.click('#lv-submit'); sp.wait_for_timeout(500)
    assert 'Submitted' in sp.inner_text('#lv-stage')
    tp.wait_for_timeout(3500)
    assert '10 / 10 match' in tp.inner_text('#pj-posts'), tp.inner_text('#pj-posts')
    tp.click('#pj-reveal'); tp.wait_for_timeout(400)
    assert 'The key' in tp.inner_text('#pj-stage') and 'TA ≤ 5' in tp.inner_text('#pj-stage')
    shot(tp, '13-proj-checklist-reveal')
    sp.wait_for_timeout(8500)
    assert '10 of 10 match the key → +3' in sp.inner_text('#lv-mine'), sp.inner_text('#lv-mine')
    tp.click('#pj-closer'); tp.wait_for_timeout(300)
    board = tp.inner_text('#pj-board')
    assert 'Team 6' in board and '3' in board, board   # a session (board) is per game

    # ---------------------------------------------------------------- widths
    step('widths: student 780 px (iPad) and teacher 780 / 1100 px, no sideways overflow')
    sp.set_viewport_size({'width': 780, 'height': 1024}); sp.wait_for_timeout(500)
    no_overflow(sp, 'live checklist 780'); shot(sp, '14-live-checklist-780')
    sp.click('#lv-leave'); sp.wait_for_timeout(300); no_overflow(sp, 'live join 780')
    tp.set_viewport_size({'width': 780, 'height': 1024}); tp.wait_for_timeout(600)
    no_overflow(tp, 'projector 780'); shot(tp, '15-proj-780')
    tp.set_viewport_size({'width': 390, 'height': 844}); tp.wait_for_timeout(600)
    no_overflow(tp, 'projector 390'); shot(tp, '16-proj-390')
    tp.set_viewport_size({'width': 1100, 'height': 900}); tp.wait_for_timeout(400)
    tp.click('#pj-close'); tp.wait_for_timeout(300)
    assert tp.evaluate("document.getElementById('projector').classList.contains('hidden')")
    no_overflow(tp, 'staff room 1100')
    # House Cup line under the cup (local mode: silent)
    tp.click('.tnav button[data-view="class"]'); tp.wait_for_timeout(400)
    cup = tp.inner_text('#housecup')
    assert ('No students yet' in cup) or tp.query_selector('#asm-cup') is not None, cup[:200]

    # the student's tally after the posted points
    sp.set_viewport_size({'width': 390, 'height': 844})
    sp.evaluate("window.PCHost.show('plan')"); sp.wait_for_timeout(200); sp.evaluate("window.PCHost.show('live')"); sp.wait_for_timeout(600)
    tally = sp.inner_text('#lv-tally')
    assert 'team-mission points' in tally and tally.strip()[-1:].isdigit() and not tally.strip().endswith(' 0'), tally

    b.close()

print('errors:', errors); print('404s:', sorted(set(missing)))
assert not errors, errors
assert not missing, missing
print('assembly-smoke: all green')
