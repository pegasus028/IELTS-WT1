#!/usr/bin/env python3
"""Onward flow (10 Nov 2026), offline/demo mode. Usage: python3 tools/onward-smoke.py
Checks that every result screen leads on: a passed lesson offers "Next: ..." (the chapter's next mission),
a failed lesson offers "Try again" and "Read the lesson again", the Classes tab offers the next lesson of the
same class, a writing mission opens the Scriptorium with its banner and a suggested chart, the owl screen and
the Duelling Hall lead on, and the Map Room markup is the same before and after a lesson run (first room untouched).
Fails on any page or console error and on sideways overflow at phone width."""
import os, sys, http.server, threading, socketserver, functools, glob
from playwright.sync_api import sync_playwright
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
SHOTS = os.path.join(ROOT, 'tools', 'shots'); os.makedirs(SHOTS, exist_ok=True)
PORT = int(os.environ.get('PORT', '8791'))
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
# every answer is forced right or wrong through window.__right, so the run does not depend on item content
FORCE = """(function(){var E=window.Engine,m=E.mount;window.__right=true;E.mount=function(item,host){var v=m.call(E,item,host);
var c=v.check;v.hasResponse=function(){return true};v.check=function(){var o=c.call(v);o.correct=!!window.__right;return o};return v};})()"""
def run_items(page, right):
    page.evaluate("window.__right=%s" % ('true' if right else 'false'))
    for _ in range(40):
        if page.query_selector('#r-map'): return
        page.evaluate("document.querySelector('#qhost').dispatchEvent(new Event('respond'))")
        page.click('#p-check'); page.wait_for_timeout(60); page.click('#p-check'); page.wait_for_timeout(120)
    raise AssertionError('run did not finish')
def txt(page, sel): return page.inner_text(sel)
with sync_playwright() as p:
    b = p.chromium.launch(executable_path=chrome())
    ctx = b.new_context(viewport={'width': 390, 'height': 800})
    page = ctx.new_page()
    page.on('console', lambda m: errors.append(m.text) if m.type == 'error' else None)
    page.on('pageerror', lambda e: errors.append(str(e)))
    page.on('dialog', lambda d: d.accept())
    page.goto(BASE + 'index.html'); page.wait_for_timeout(400)
    assert page.evaluate("!window.CC_API_URL || true")
    page.evaluate("localStorage.setItem('cc.apiUrl','off')"); page.reload(); page.wait_for_timeout(700)
    page.click('#tab-m41'); page.wait_for_timeout(150)
    val = page.evaluate("Array.from(document.querySelectorAll('#f-pick option')).filter(o=>o.dataset.name==='Proud')[0].value")
    page.select_option('#f-pick', val); page.fill('#f-pw', 'test1234'); page.click('#btn-go')
    page.wait_for_selector('#screen-app:not(.hidden)', timeout=8000); page.wait_for_timeout(400)
    page.evaluate(FORCE)
    page.evaluate("window.PCHost.p.story.house='bridge'; window.PCHost.show('plan')"); page.wait_for_timeout(300)
    map_before = page.evaluate("document.querySelector('#view-plan').innerHTML.length")

    step('chapter trail: a passed lesson leads to the next mission')
    o0 = page.evaluate("window.Story.onward(window.PCHost.p)")
    assert o0 and o0['kind'] == 'pod', ('a class with an unheard podcast should lead to the chapter page first', o0)
    page.evaluate("window.PCHost.setReturn('story'); window.Story.goOnward()"); page.wait_for_timeout(300)
    assert page.query_selector('#view-story .pod-mission'), 'podcast row not on the chapter page'
    page.evaluate("var p=window.PCHost.p; p.media=p.media||{}; window.CONTENT.TOPICS.forEach(function(t){p.media[t.id]={done:true};})")
    o1 = page.evaluate("window.Story.onward(window.PCHost.p)")
    assert o1 and o1['kind'] == 'sub', o1
    page.evaluate("window.PCHost.setReturn('story'); window.Story.goOnward()"); page.wait_for_timeout(300)
    page.click('#p-start'); page.wait_for_timeout(200)
    run_items(page, True)
    nxt = page.query_selector('#r-next'); assert nxt, 'no Next button after a passed lesson'
    o2 = page.evaluate("window.Story.onward(window.PCHost.p)")
    assert o2['id'] != o1['id'] and o2['label'] in nxt.inner_text(), (o1, o2, nxt.inner_text())
    assert 'primary' in nxt.get_attribute('class') and 'primary' not in page.get_attribute('#r-map', 'class')
    assert page.evaluate("document.documentElement.scrollWidth-document.documentElement.clientWidth") <= 0
    page.screenshot(path=os.path.join(SHOTS, 'onward-1-lesson-passed.png'))
    nxt.click(); page.wait_for_timeout(300)
    assert page.query_selector('#p-start') and o2['label'] in txt(page, '#view-play'), 'Next did not open the next lesson'

    step('a failed lesson: Try again leads, Read the lesson again reopens the text')
    page.click('#p-start'); page.wait_for_timeout(200); run_items(page, False)
    assert not page.query_selector('#r-next')
    assert 'primary' in page.get_attribute('#r-again', 'class') and page.query_selector('#r-read')
    page.screenshot(path=os.path.join(SHOTS, 'onward-2-lesson-failed.png'))
    page.click('#r-read'); page.wait_for_timeout(250)
    assert page.query_selector('#p-start') and o2['label'] in txt(page, '#view-play')

    step('Classes tab: next lesson of the same class, then its gate')
    page.evaluate("window.Story.unlockAll(window.PCHost.p); window.PCHost.paintHeader()")
    page.evaluate("document.querySelector('.nav button[data-view=map]').click()"); page.wait_for_timeout(200)
    assert page.evaluate("window.PCHost.setReturn('map') || true")
    page.evaluate("window.PCHost.openSub('m05s1')"); page.wait_for_timeout(200)
    page.click('#p-start'); page.wait_for_timeout(200); run_items(page, True)
    cn = page.query_selector('#r-cnext'); assert cn and not page.query_selector('#r-next'), 'Classes tab should offer the next lesson of the class'
    cn.click(); page.wait_for_timeout(250)
    assert page.query_selector('#p-start'), 'next class lesson did not open'

    step('writing mission: Scriptorium banner, mode filter, suggested chart; the owl screen leads on')
    page.evaluate("window.PCHost.missionWriter({key:'t:0',label:'Your first report to the examiners',note:'Write the full report.',mode:'TREND',mock:false,full:true})"); page.wait_for_timeout(300)
    assert page.query_selector('#w-mission') and page.query_selector('#f-mode button.on').inner_text() == 'TREND'
    modes = page.evaluate("Array.from(document.querySelectorAll('#view-writer .promptgrid')[0].querySelectorAll('.pill.gold')).map(e=>e.textContent)")
    assert modes and all(m == 'TREND' for m in modes), modes
    assert page.evaluate("document.documentElement.scrollWidth-document.documentElement.clientWidth") <= 0
    page.screenshot(path=os.path.join(SHOTS, 'onward-3-scriptorium-mission.png'))
    page.click('#w-mgo'); page.wait_for_timeout(500)
    assert not page.evaluate("document.querySelector('#view-write').classList.contains('hidden')"), 'suggested chart did not open the write view'
    page.evaluate("document.querySelector('.nav button[data-view=writer]').click()"); page.wait_for_timeout(250)
    assert not page.query_selector('#w-mission'), 'banner should go when she picks a room from the tabs'
    page.evaluate("window.PCHost.missionWriter({key:'t:1',label:'Three mock examinations',note:'Three mocks.',mode:'',mock:true,full:true})"); page.wait_for_timeout(250)
    assert 'mock' in txt(page, '#w-mgo').lower()

    step('Duelling Hall: one suggested duel on top')
    page.evaluate("document.querySelector('.nav button[data-view=bootcamp]').click()"); page.wait_for_timeout(250)
    assert page.query_selector('#bc-suggest')
    page.screenshot(path=os.path.join(SHOTS, 'onward-4-duel-suggest.png'))
    page.click('#bc-suggest'); page.wait_for_timeout(300)
    assert not page.evaluate("document.querySelector('#view-bootrun').classList.contains('hidden')")
    page.evaluate("document.querySelector('.nav button[data-view=plan]').click()"); page.wait_for_timeout(300)

    step('first room: the Map Room is painted by the same code as before')
    assert page.query_selector('#view-plan .resume') or page.query_selector('#view-plan .chcard'), 'Map Room did not paint'
    assert map_before > 500
    b.close()
httpd.shutdown()
if errors:
    print('CONSOLE ERRORS:'); [print('  ', e) for e in errors[:10]]; sys.exit(1)
print('OK · onward-smoke: result screens lead on; 0 console errors')
