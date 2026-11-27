#!/usr/bin/env python3
"""Smoke test for the Orrery room (orrery.js), offline/demo mode.
   python3 tools/orrery-smoke.py            (Playwright + Chromium; screenshots in tools/shots/)
Walks one chart at every guidance level and band:
  High   Band 8, museums: a wrong option first on some steps (greyed + hint, no move), then right
  Medium Band 7, internet: typed WRITE steps get the program's value (accepted), one wrong first
  Low    Band 6, tourists: the sheet, a wrong run, then a full run, then Finish
  Exam   Band 7, rent: one run
Checks: the room is on the map once the Scriptorium is, 13 register cells, the LOOK attribute,
four options per step, merits once, the finish table, band tabs change the report, no console
errors, no sideways overflow at 390 px."""
import os, sys, http.server, threading, socketserver, functools, glob
from playwright.sync_api import sync_playwright
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
SHOTS = os.path.join(ROOT, 'tools', 'shots'); os.makedirs(SHOTS, exist_ok=True)
PORT = int(os.environ.get('PORT', '8797'))
class Quiet(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a): pass
socketserver.TCPServer.allow_reuse_address = True
httpd = socketserver.TCPServer(('127.0.0.1', PORT), functools.partial(Quiet, directory=ROOT))
threading.Thread(target=httpd.serve_forever, daemon=True).start()
BASE = 'http://127.0.0.1:%d/' % PORT
errors = []
def step(m): print('·', m)
def chrome():
    exe = os.environ.get('CHROME')
    if exe and os.path.exists(exe): return exe
    hits = sorted(glob.glob('/opt/pw-browsers/chromium-*/chrome-linux*/chrome'))
    return hits[-1] if hits else None
def overflow(page): return page.evaluate("document.documentElement.scrollWidth-document.documentElement.clientWidth")
def login(page):
    page.goto(BASE + 'index.html'); page.wait_for_timeout(400)
    page.evaluate("localStorage.setItem('cc.apiUrl','off')"); page.reload(); page.wait_for_timeout(700)
    page.click('#tab-m41'); page.wait_for_timeout(150)
    val = page.evaluate("Array.from(document.querySelectorAll('#f-pick option')).filter(o=>o.dataset.name==='Proud')[0].value")
    page.select_option('#f-pick', val); page.fill('#f-pw', 'test1234'); page.click('#btn-go')
    page.wait_for_selector('#screen-app:not(.hidden)', timeout=8000); page.wait_for_timeout(400)
    page.evaluate("window.PCHost.p.story.house='bridge'")
def open_orrery(page, pid, band, level):
    page.evaluate("window.PCHost.show('orrery')"); page.wait_for_timeout(250)
    if page.query_selector('#orr-leave'): page.click('#orr-leave'); page.wait_for_timeout(200)
    page.click('.orr-chart[data-pid="%s"]' % pid)
    page.check('input[name=orr-band][value="%d"]' % band); page.check('input[name=orr-level][value=%s]' % level)
    page.click('#orr-start'); page.wait_for_timeout(300)
def steps(page, pid, band):
    return page.evaluate("(function(){var p=CONTENT.PROMPTS.filter(function(x){return x.id==='%s'})[0];return Orrery.exercise(p,%d).steps.map(function(s){return {id:s.id,kind:s.kind,var:s.var,ok:s.ok,wrong:s.wrong.map(function(w){return w[0]}),look:s.lookAt}})})()" % (pid, band))

with sync_playwright() as pw:
    b = pw.chromium.launch(executable_path=chrome())
    ctx = b.new_context(viewport={'width': 1280, 'height': 860})
    page = ctx.new_page()
    page.on('console', lambda m: errors.append(m.text) if m.type == 'error' else None)
    page.on('pageerror', lambda e: errors.append(str(e)))
    page.on('dialog', lambda d: d.accept())
    login(page)

    step('the room is hidden before the Scriptorium opens, and on the map once it does')
    vis0 = page.evaluate("!document.querySelector('.nav button[data-view=orrery]').classList.contains('hidden')")
    page.evaluate("Story.unlockAll(window.PCHost.p); window.PCHost.paintHeader()"); page.wait_for_timeout(200)
    page.evaluate("window.PCHost.show('plan')"); page.wait_for_timeout(200)
    vis1 = page.evaluate("!document.querySelector('.nav button[data-view=orrery]').classList.contains('hidden')")
    assert vis1, 'the Orrery tab should show once the Scriptorium is open'
    print('   before unlock visible:', vis0, '· after:', vis1)
    page.evaluate("window.PCHost.show('orrery')"); page.wait_for_timeout(300)
    n = page.evaluate("document.querySelectorAll('.orr-chart').length"); assert n == 19, n
    page.screenshot(path=os.path.join(SHOTS, 'orrery-0-landing.png'), full_page=True)

    step('High guidance, Band 8, museums')
    xp0 = page.evaluate("window.PCHost.p.xp||0")
    open_orrery(page, 'p-line-museums', 8, 'high')
    assert page.evaluate("document.querySelectorAll('#orr-reg .orr-cell').length") == 13
    flat = steps(page, 'p-line-museums', 8)
    for i, st in enumerate(flat):
        page.wait_for_selector('#orr-q .gd-opt')
        assert page.get_attribute('#orr-fig', 'data-look') == (st['look'] or ''), (st['id'], page.get_attribute('#orr-fig', 'data-look'))
        btns = page.query_selector_all('#orr-q .gd-opt'); assert len(btns) == 4, (st['id'], len(btns))
        labels = [x.inner_text() for x in btns]
        assert sorted(labels) == sorted([st['ok']] + st['wrong']), (st['id'], labels)
        if i % 3 == 0:
            w = [x for x in btns if x.inner_text() != st['ok']][0]; w.click(); page.wait_for_timeout(40)
            assert w.is_disabled(), st['id']
            hint = page.inner_text('#orr-hint'); assert len(hint) > 15 and st['ok'].lower() not in hint.lower(), (st['id'], hint)
        if i == 9: page.screenshot(path=os.path.join(SHOTS, 'orrery-1-high.png'), full_page=True)
        [x for x in page.query_selector_all('#orr-q .gd-opt') if x.inner_text() == st['ok']][0].click()
        page.wait_for_timeout(720)
    page.wait_for_selector('.orr-res'); page.wait_for_timeout(200)
    txt = page.inner_text('.orr-res'); assert 'decisions right first time' in txt, txt
    xp1 = page.evaluate("window.PCHost.p.xp||0"); assert xp1 - xp0 == 25, (xp0, xp1)
    r8 = page.inner_text('#orr-rep'); page.click('.orr-bands button[data-b="6"]'); page.wait_for_timeout(100); r6 = page.inner_text('#orr-rep')
    assert r6 != r8 and 'Overall,' in r6
    page.screenshot(path=os.path.join(SHOTS, 'orrery-2-finish.png'), full_page=True)

    step('Medium guidance, Band 7, internet: typed values')
    open_orrery(page, 'p-line-internet', 7, 'medium')
    flat = steps(page, 'p-line-internet', 7)
    for i, st in enumerate(flat):
        if st['kind'] == 'think':
            page.wait_for_selector('#orr-q .gd-opt')
            [x for x in page.query_selector_all('#orr-q .gd-opt') if x.inner_text() == st['ok']][0].click(); page.wait_for_timeout(720); continue
        page.wait_for_selector('#orr-in')
        if i == 1:
            page.fill('#orr-in', 'nothing useful 999'); page.click('#orr-commit'); page.wait_for_timeout(80)
            assert 'hidden' not in (page.get_attribute('#orr-hint', 'class') or ''), 'a wrong typed value shows a hint'
            page.screenshot(path=os.path.join(SHOTS, 'orrery-3-medium.png'), full_page=True)
        page.fill('#orr-in', st['ok']); page.click('#orr-commit'); page.wait_for_timeout(1000)
    page.wait_for_selector('.orr-res')

    step('Low guidance, Band 6, tourists: sheet, a wrong run, then all right')
    open_orrery(page, 'p-bar-tourists', 6, 'low')
    assert page.evaluate("document.querySelectorAll('.orr-sheet .slot input').length") == 13
    page.click('#orr-run'); page.wait_for_timeout(150)
    assert page.evaluate("document.querySelectorAll('.orr-cell.bad').length") == 13
    vals = page.evaluate("(function(){var p=CONTENT.PROMPTS.filter(function(x){return x.id==='p-bar-tourists'})[0];return Orrery.derive(p,6).vars})()")
    for k, v in vals.items(): page.fill('#orr-in-' + k, v)
    page.click('#orr-run'); page.wait_for_timeout(150)
    okc = page.evaluate("document.querySelectorAll('.orr-cell.ok').length"); assert okc == 13, okc
    page.screenshot(path=os.path.join(SHOTS, 'orrery-4-low.png'), full_page=True)
    page.click('#orr-fin'); page.wait_for_selector('.orr-res')

    step('Exam, Band 7, rent: one run')
    open_orrery(page, 'p-table-rent', 7, 'exam')
    assert page.evaluate("!document.querySelector('.orr-mini')"), 'Exam shows no signals'
    vals = page.evaluate("(function(){var p=CONTENT.PROMPTS.filter(function(x){return x.id==='p-table-rent'})[0];return Orrery.derive(p,7).vars})()")
    for k, v in vals.items(): page.fill('#orr-in-' + k, v)
    page.click('#orr-run'); page.wait_for_selector('.orr-res'); page.wait_for_timeout(100)
    assert '13 of 13' in page.inner_text('.orr-res'), page.inner_text('.orr-res')

    step('phone: 390 px, no sideways overflow on landing, run and finish')
    ctx2 = b.new_context(viewport={'width': 390, 'height': 844}, device_scale_factor=2, is_mobile=True)
    ph = ctx2.new_page(); ph.on('console', lambda m: errors.append(m.text) if m.type == 'error' else None); ph.on('pageerror', lambda e: errors.append(str(e))); ph.on('dialog', lambda d: d.accept())
    login(ph); ph.evaluate("Story.unlockAll(window.PCHost.p)")
    ph.evaluate("window.PCHost.show('orrery')"); ph.wait_for_timeout(300)
    assert overflow(ph) <= 0, ('landing', overflow(ph)); ph.screenshot(path=os.path.join(SHOTS, 'orrery-5-phone-landing.png'), full_page=True)
    open_orrery(ph, 'p-line-cities', 8, 'high'); ph.wait_for_timeout(300)
    assert overflow(ph) <= 0, ('run', overflow(ph)); ph.screenshot(path=os.path.join(SHOTS, 'orrery-6-phone-run.png'), full_page=True)
    open_orrery(ph, 'p-pie-energy', 7, 'low'); ph.wait_for_timeout(300)
    assert overflow(ph) <= 0, ('low', overflow(ph)); ph.screenshot(path=os.path.join(SHOTS, 'orrery-7-phone-low.png'), full_page=True)
    b.close()
httpd.shutdown()
bad = [e for e in errors if 'favicon' not in e]
if bad: print('CONSOLE ERRORS:'); [print('  ', e) for e in bad]; sys.exit(1)
print('orrery-smoke: ok')
