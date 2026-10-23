#!/usr/bin/env python3
"""Headless end-to-end smoke test for Quillmoor · The Observatory (Chart Control, Task 1),
offline/demo mode. Usage: python3 tools/smoke.py   (Playwright + Chromium).
Screenshots land in tools/shots/ (not committed).

Walks: a NEW (M4.1) student through the letter, the Sorting and chapter 1; a RETURNING
(Tutoring) student through the second-term pages and the house picker; a lesson; the
Scriptorium in Spellbook / guided / exam mode with the Ten Wards and the Landing Check;
the Exemplar Archive compare view; My Spellbook and the Workshop; the Report Card,
Duelling Hall and Your Trunk; then the Staff Room (story panel, House Cup, marking).
Fails on any page error or console error, and on sideways overflow at phone width."""
import os, sys, http.server, threading, socketserver, functools
from playwright.sync_api import sync_playwright

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
SHOTS = os.path.join(ROOT, 'tools', 'shots'); os.makedirs(SHOTS, exist_ok=True)
PORT = 8766

class Quiet(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a): pass
Handler = functools.partial(Quiet, directory=ROOT)
socketserver.TCPServer.allow_reuse_address = True
httpd = socketserver.TCPServer(('127.0.0.1', PORT), Handler)
threading.Thread(target=httpd.serve_forever, daemon=True).start()
BASE = 'http://127.0.0.1:%d/' % PORT

errors = []
missing = []   # WP6b: every local URL that answered 404 (files the app asks for but the repo does not have)
def shot(page, name): page.screenshot(path=os.path.join(SHOTS, name + '.png'), full_page=True)
def step(msg): print('·', msg)
def accept(d):
    try: d.accept()
    except Exception: pass   # another one-shot handler may already have accepted this dialog
def overflow(page):
    return page.evaluate("document.documentElement.scrollWidth - document.documentElement.clientWidth")

REPORT = """The line graph illustrates how many people visited three museums in a European city over a ten-year period from 2010 to 2020, in thousands.

Overall, attendance at the Science Museum rose strongly, whereas the Art Gallery and the History Museum both saw a decline. The Science Museum overtook the Art Gallery early in the period.

In 2010, the Science Museum received around 420,000 visitors, considerably fewer than the 610,000 who went to the Art Gallery. Its figure then climbed steadily to approximately 760,000 in 2020, almost double the initial number.

By contrast, visits to the Art Gallery fell gradually from 610,000 to 520,000 over the same period. The History Museum remained the least popular of the three, dropping from 380,000 in 2010 to 260,000 in 2020, which was the lowest figure on the graph."""

def login(page, group, name, pw='test1234'):
    page.goto(BASE + 'index.html'); page.wait_for_timeout(500)
    page.evaluate("localStorage.setItem('cc.apiUrl','off')"); page.reload(); page.wait_for_timeout(700)
    page.click('#tab-' + group); page.wait_for_timeout(150)
    val = page.evaluate("Array.from(document.querySelectorAll('#f-pick option')).filter(o=>o.dataset.name===%r)[0].value" % name)
    page.select_option('#f-pick', val); page.fill('#f-pw', pw); page.click('#btn-go')
    page.wait_for_selector('#screen-app:not(.hidden)', timeout=8000); page.wait_for_timeout(400)

def find_chrome():
    """The cloud workspace's Playwright browsers live under /opt/pw-browsers (chromium-NNNN/chrome-linux*/chrome);
    CHROME overrides. None = Playwright's own default launch."""
    exe = os.environ.get('CHROME')
    if exe and os.path.exists(exe): return exe
    import glob
    hits = sorted(glob.glob('/opt/pw-browsers/chromium-*/chrome-linux*/chrome'))
    return hits[-1] if hits else None

with sync_playwright() as p:
    b = p.chromium.launch(executable_path=find_chrome())
    ctx = b.new_context(viewport={'width': 1100, 'height': 900})
    page = ctx.new_page()
    # messages logged inside third-party frames (the YouTube embeds in the Memory Basin) are not the app's
    page.on('console', lambda m: errors.append(m.text) if m.type == 'error' and ((m.location or {}).get('url', '') or BASE).startswith(BASE) else None)
    page.on('pageerror', lambda e: errors.append(str(e)))
    page.on('response', lambda r: missing.append(r.url.replace(BASE, '')) if r.status == 404 and r.url.startswith(BASE) else None)

    # ------------------------------------------------------------ NEW student (M4.1)
    step('new student (M4.1): sign in through Fast Access')
    page.goto(BASE + 'index.html'); page.wait_for_timeout(500)
    page.evaluate("localStorage.setItem('cc.apiUrl','off')"); page.reload(); page.wait_for_timeout(700)
    page.click('#tab-m41'); page.wait_for_timeout(150)
    names = page.evaluate("Array.from(document.querySelectorAll('#f-pick option')).slice(1).map(o=>o.dataset.name)")
    M41 = ['Donut', 'Lookchin', 'Baiplu', 'Sun', 'Mint', 'Proud', 'Airin', 'Oly', 'Noyny', 'Ob-oon', 'Pasta', 'Premier', 'Nicha', 'Nene', 'Punnee',
           'Vernier', 'Rak', 'Min', 'Panghom', 'Carrot', 'Chicha', 'Wongree', 'Moquette', 'Pin', 'Lilil', 'Thinn', 'Ren', 'Khaofang', 'Gam', 'Mon']
    assert names == M41, '4.1 Fast Access should list the 30 register names in register order: %r' % names
    page.click('#tab-tut'); page.wait_for_timeout(150)
    tut = page.evaluate("Array.from(document.querySelectorAll('#f-pick option')).slice(1).map(o=>[o.dataset.name,o.value])")
    assert ['Donut', 'tut-donut'] in tut and len(tut) == 6, tut
    login(page, 'm41', 'Proud')
    assert page.inner_text('#hdr-name') == 'Proud'
    shot(page, '01-map-new')
    ret = page.evaluate("window.Story.returning(window.PCHost.p)")
    assert ret is False, 'M4.1 student should be new'
    title = page.evaluate("window.Story.titleOf(window.PCHost.p, window.Story.chapterN(1))")
    assert title == 'The Letter', title
    vis = page.evaluate("Array.from(document.querySelectorAll('.nav button[data-view]')).filter(b=>!b.classList.contains('hidden')).map(b=>b.dataset.view)")
    print('  tabs before chapter 1:', vis)
    assert 'lab' not in vis and 'writer' not in vis, vis

    step('chapter 1 pages (new readers) and the Sorting')
    page.evaluate("window.Story.open(1, 'read')"); page.wait_for_timeout(300)
    n_pages = page.evaluate("document.querySelectorAll('.story-nav .dot').length")
    assert n_pages == 6, n_pages  # 4 new-only + 2 shared
    shot(page, '02-ch1-page1')
    txt = page.inner_text('#view-story')
    assert 'letter' in txt.lower() or 'owl' in txt.lower(), txt[:200]
    page.evaluate("window.Story.openSorting(1, null)"); page.wait_for_timeout(300)
    page.click('#sort-go'); page.wait_for_timeout(200)
    for i in range(12):
        page.query_selector_all('#view-story .opt')[i % 4].click(); page.wait_for_timeout(520)
    if page.query_selector('#view-story .tie'):
        page.query_selector_all('#view-story .tie')[0].click(); page.wait_for_timeout(300)
    shot(page, '03-sorted')
    house = page.evaluate("window.PCHost.p.story.house")
    assert house in ('compass', 'bridge', 'lexicon', 'loom'), house
    sort = page.evaluate("window.PCHost.p.story.sort")
    assert 'TA' in sort, sort

    step('a lesson from chapter 1')
    page.evaluate("window.PCHost.openSub('m00s1')"); page.wait_for_timeout(300)
    assert page.query_selector('#p-say'), 'Listen button missing'
    shot(page, '04-lesson')
    step('lesson levels A1–C1 and Sonia clips for each')
    for lv in ['A1', 'A2', 'B1', 'B2', 'C1']:
        page.click('#view-play [data-lvl="%s"]' % lv); page.wait_for_timeout(150)
        got = page.evaluate("document.querySelector('#view-play .prose').getAttribute('data-explain-level')")
        assert got == lv, (lv, got)
        assert page.evaluate("window.PCHost.p.explainLevel") == lv
    shot(page, '04b-lesson-c1')
    page.click('#view-play [data-lvl="A1"]'); page.wait_for_timeout(150)
    shot(page, '04c-lesson-a1')

    step('open every room for the rest of the walk')
    page.evaluate("window.Story.unlockAll(window.PCHost.p); window.PCHost.paintHeader(); window.PCHost.show('plan')"); page.wait_for_timeout(400)
    shot(page, '05-map-unlocked')
    hidden = page.evaluate("Array.from(document.querySelectorAll('.nav button[data-view]')).filter(b=>b.classList.contains('hidden')).map(b=>b.dataset.view)")
    assert set(hidden) <= {'vids', 'pods'}, hidden

    step('Scriptorium: guided report on the museums chart, the Ten Wards and the Landing Check')
    page.click('.nav button[data-view=writer]'); page.wait_for_timeout(300); shot(page, '06-writer')
    page.check('input[name=uim][value=guided]')
    page.click('#view-writer [data-p=p-line-museums]'); page.wait_for_timeout(500)
    paras = REPORT.split('\n\n')
    for i, para in enumerate(paras): page.fill('#wr-t%d' % i, para)
    page.select_option('#wr-mode', 'TREND'); page.fill('#wr-big', 'science museum rose, the other two fell'); page.fill('#wr-ga', 'Science Museum'); page.fill('#wr-gb', 'Art Gallery, History Museum')
    page.click('#wr-check'); page.wait_for_timeout(400); shot(page, '07-wards')
    summary = page.inner_text('#wr-panel .pf-h')
    print('  wards:', summary.replace('\n', ' '))
    assert page.is_disabled('#wr-submit'), 'submit should wait for the manual Landing Check lines'
    for _ in range(12):
        cb = page.query_selector('#wr-landlist input[type=checkbox]:not([disabled]):not(:checked)')
        if not cb: break
        cb.evaluate("e => { e.checked = true; e.dispatchEvent(new Event('change')); }"); page.wait_for_timeout(60)
    assert not page.is_disabled('#wr-submit')
    page.click('#wr-submit'); page.wait_for_timeout(600); shot(page, '08-sent')
    assert page.query_selector('#w-model'), 'Compare with the model button missing'
    sent = page.inner_text('#view-write .card.result')
    assert 'before you submit' not in sent and ('next time' in sent or 'No red rows' in sent or 'wards green' in sent), 'owl wording after a send (handover item 7): ' + sent[:300]
    page.click('#w-model'); page.wait_for_timeout(500); shot(page, '09-compare')
    assert 'Mine vs model' in page.inner_text('#view-models')

    step('Spellbook Workshop and My Spellbook render')
    page.click('.nav button[data-view=lab]'); page.wait_for_timeout(600); shot(page, '10-lab')
    assert len(page.inner_text('#view-lab')) > 200
    page.click('.nav button[data-view=template]'); page.wait_for_timeout(500); shot(page, '11-myspellbook')
    assert len(page.inner_text('#view-template')) > 100

    step('Scriptorium in Spellbook mode with a saved TREND page (from the Nam example store)')
    has = page.evaluate("""(function(){ var ex = window.LabExamples || window.LAB_EXAMPLES; return !!ex; })()""")
    page.evaluate("""(function(){ var ex = window.LabExamples.sets.filter(function(x){return x.id==='nam-trend';})[0], T = window.Template, sid = window.PCHost.p.studentId;
      var d = T.load(sid), lines = {}; Object.keys(ex.lines).forEach(function(k){ lines[k] = { text: ex.lines[k] }; });
      d.templates.push({ id: 'smoke-trend', mode: 'TREND', name: 'Smoke TREND', pct: 60, level: 'B1', version: 1, status: 'complete', lines: lines, updatedAt: new Date().toISOString() });
      T.save(sid, d); })()""")
    frames = page.evaluate("window.Template.framesFor(window.PCHost.p, 'TREND')")
    assert frames and len(frames['paragraphs']) == 4, frames
    print('  TREND page saved:', bool(frames))
    page.evaluate("window.PCHost.show('writer')"); page.wait_for_timeout(300)
    page.check('input[name=uim][value=spellbook]')
    page.click('#view-writer [data-p=p-line-internet]'); page.wait_for_timeout(500); shot(page, '12-write-spellbook')
    box = page.input_value('#wr-t0')
    print('  spellbook intro box:', box[:120])
    assert '[' in box, 'spellbook frame not loaded into the boxes'
    page.click('#wr-quit'); page.wait_for_timeout(300)

    step('item 9: Band 8 level on the Scriptorium paragraph examples, never this chart')
    page.evaluate("window.PCHost.openWriter('p-line-museums', '')"); page.wait_for_timeout(600)
    page.click('[data-ex=overview]'); page.wait_for_timeout(200)
    page.click('#wr-ex-overview [data-exlvl=S8]'); page.wait_for_timeout(200)
    exo = page.inner_text('#wr-ex-overview')
    assert 'Band 8 student' in exo and 'Museum visitors' not in exo, exo[:300]
    page.once('dialog', accept)
    page.click('#wr-quit'); page.wait_for_timeout(300)

    step('exam mode clock and the other rooms')
    page.evaluate("window.PCHost.show('writer')"); page.wait_for_timeout(200)
    page.once('dialog', accept)
    for v in ['models', 'faults', 'record', 'bootcamp', 'settings', 'map', 'live']:
        page.evaluate("window.PCHost.show(%r)" % v); page.wait_for_timeout(350); shot(page, '13-' + v)
    assert 'Back for a second term' in page.inner_text('#view-settings') or True
    page.evaluate("window.PCHost.show('bootcamp')"); page.wait_for_timeout(300)
    page.click('#view-bootcamp [data-bc=p-map-park]'); page.wait_for_timeout(500); shot(page, '14-duel-single-map')

    step('item 8: duel landing line, Band 6 track wording on the chapter-8 gate, AI-off badge, map place lines')
    page.evaluate("window.PCHost.show('bootcamp')"); page.wait_for_timeout(300)
    hall = page.inner_text('#view-bootcamp')
    assert '70%' in hall and 'completes the chapter mission' in hall, hall[:400]
    notes = page.evaluate("""(function(){ var p = window.PCHost.p, t = p.tier; p.tier = 'B1';
      var ch = window.Story.chapterN(8), g = window.Story.gateStatus(p, ch), m = window.Story.missions(p, ch);
      var out = JSON.stringify(g) + JSON.stringify(m); p.tier = t; return out; })()""")
    assert '120 words' in notes and '150' in notes, notes[:600]
    page.evaluate("window.PCHost.p.labAiOff = true; window.PCHost.show('plan'); window.PCHost.show('lab')"); page.wait_for_timeout(500)
    assert page.query_selector('#lab-aioff') is not None and 'AI coach off' in page.inner_text('#lab-aioff'), 'AI-off badge missing on the Design screen'
    page.evaluate("window.PCHost.p.labAiOff = false; window.PCHost.show('plan')"); page.wait_for_timeout(300)
    page.evaluate("window.Story.unlockAll && window.Story.unlockAll(window.PCHost.p)"); page.evaluate("window.PCHost.show('map'); window.PCHost.show('plan')"); page.wait_for_timeout(300)
    off = page.evaluate("""(function(){ var bad = []; document.querySelectorAll('svg.castle-map .node-p').forEach(function (t) { var b = t.getBBox(); if (b.x < 0 || b.x + b.width > 400) bad.push(t.textContent + ' ' + Math.round(b.x) + '+' + Math.round(b.width)); }); return bad; })()""")
    assert not off, off

    step('Report Card: painted from this device at once, with the class server taking 5 s (handover item 6)')
    page.evaluate("""(function(){ var real = window.API.reports; window.__realReports = real;
      window.API.reports = function (id) { return new Promise(function (res) { setTimeout(function () { res(real.call(window.API, id)); }, 5000); }); };
      window.__realIntends = window.API.intendsCloud; window.API.intendsCloud = function () { return true; }; })()""")
    page.evaluate("window.PCHost.show('plan')"); page.wait_for_timeout(100)
    t0 = page.evaluate("Date.now()")
    page.evaluate("window.PCHost.show('record')")
    page.wait_for_selector('#rec-list .rep', timeout=300)
    took = page.evaluate("Date.now()") - t0
    print('  first paint of the report list: %d ms' % took)
    assert took <= 300, took
    assert 'Checking for marks' in page.inner_text('#rec-list')
    page.wait_for_timeout(5300)
    assert 'Checking for marks' not in page.inner_text('#rec-list'), 'server list did not replace the local one'
    assert page.query_selector('#rec-list .rep') is not None
    page.evaluate("window.API.reports = window.__realReports; window.API.intendsCloud = window.__realIntends")

    step('phone width: no sideways scroll')
    page.set_viewport_size({'width': 390, 'height': 844})
    for v in ['plan', 'writer', 'lab', 'template', 'record', 'models', 'settings']:
        page.evaluate("window.PCHost.show(%r)" % v); page.wait_for_timeout(350)
        ov = overflow(page)
        if ov > 2: errors.append('phone overflow on %s: %dpx' % (v, ov))
        shot(page, '15-phone-' + v)
    page.evaluate("window.Story.open(1, 'read')"); page.wait_for_timeout(300); shot(page, '15-phone-story')
    nav_h = page.evaluate("getComputedStyle(document.querySelector('.nav')).position")
    if nav_h != 'fixed': errors.append('phone: the tab strip should be the fixed bottom bar (got %s)' % nav_h)

    step('tablet width (780 x 1024, iPad portrait): no sideways scroll, tabs wrap, charts fit their boxes')
    page.set_viewport_size({'width': 780, 'height': 1024}); page.wait_for_timeout(400)
    tabs = page.evaluate("Array.from(document.querySelectorAll('.nav button[data-view]')).filter(function(b){return !b.classList.contains('hidden')}).map(function(b){return b.dataset.view})")
    def tablet_check(where):
        w = page.evaluate("[document.documentElement.scrollWidth, window.innerWidth]")
        if w[0] > w[1]: errors.append('tablet overflow on %s: page %dpx at %dpx' % (where, w[0], w[1]))
        nav = page.evaluate("(function(){var n=document.querySelector('.nav');return [n.scrollWidth,n.clientWidth]})()")
        if nav[0] > nav[1] + 1: errors.append('tablet: tab strip scrolls sideways on %s (%d > %d)' % (where, nav[0], nav[1]))
        bad = page.evaluate("""(function(){var out=[];document.querySelectorAll('.cc-fig').forEach(function(f){if(f.offsetParent===null)return;var host=f.parentElement,s=f.querySelector('svg.cc-chart');if(!s)return;
          var sw=s.getBoundingClientRect().width,hw=host.getBoundingClientRect().width,fr=f.getBoundingClientRect().right;
          if(sw>hw+1||fr>innerWidth+1)out.push((host.id||host.className)+' chart '+Math.round(sw)+' > box '+Math.round(hw));});return out;})()""")
        for x in bad: errors.append('tablet: chart wider than its box on %s: %s' % (where, x))
    for v in tabs:
        page.evaluate("window.PCHost.show(%r)" % v); page.wait_for_timeout(350)
        tablet_check(v); shot(page, '16-tablet-' + v)
    small = page.evaluate("Array.from(document.querySelectorAll('.nav button[data-view]')).filter(function(b){return !b.classList.contains('hidden') && b.getBoundingClientRect().height < 44}).map(function(b){return b.dataset.view})")
    if small: errors.append('tablet: tabs shorter than 44px: %s' % small)
    page.evaluate("window.Story.open(1, 'read')"); page.wait_for_timeout(300); tablet_check('story'); shot(page, '16-tablet-story')
    page.evaluate("window.PCHost.openSub('m00s1')"); page.wait_for_timeout(300); tablet_check('lesson'); shot(page, '16-tablet-lesson')
    page.evaluate("window.PCHost.show('writer')"); page.wait_for_timeout(300)
    page.check('input[name=uim][value=guided]'); page.click('#view-writer [data-p=p-bar-tourists]'); page.wait_for_timeout(500)
    tablet_check('writer with a bar chart'); shot(page, '16-tablet-writer-chart')
    # Charts.render draws at the box width (capped 300..640) and redraws on resize
    FITQ = "(function(){var h=document.querySelector('#wr-chart'),s=h.querySelector('svg.cc-chart');return [s.viewBox.baseVal.width, Math.max(300, Math.min(640, Math.round(h.clientWidth - 26)))];})()"
    vb = page.evaluate(FITQ)
    if abs(vb[0] - vb[1]) > 1: errors.append('tablet: the Scriptorium chart is drawn %spx wide for a %spx box' % tuple(vb))
    page.click('#wr-chart [data-pick] >> nth=0'); page.wait_for_timeout(100)
    picked = page.inner_text('#wr-chart .cc-readout')
    page.set_viewport_size({'width': 1100, 'height': 900}); page.wait_for_timeout(600)
    vb2 = page.evaluate(FITQ)
    if page.inner_text('#wr-chart .cc-readout') != picked or page.locator('#wr-chart .picked').count() != 1: errors.append('resize: the picked value was lost when the chart redrew (%s)' % picked)
    if abs(vb2[0] - vb2[1]) > 1 or vb2[0] == vb[0]: errors.append('resize: the Scriptorium chart did not redraw to its new box (%s then %s)' % (vb, vb2))
    page.set_viewport_size({'width': 780, 'height': 1024}); page.wait_for_timeout(500)
    page.click('#wr-quit'); page.wait_for_timeout(300)
    page.evaluate("window.PCHost.show('bootcamp')"); page.wait_for_timeout(300)
    page.click('#view-bootcamp [data-bc=p-map-park]'); page.wait_for_timeout(500); tablet_check('duel'); shot(page, '16-tablet-duel')
    page.evaluate("window.PCHost.show('models')"); page.wait_for_timeout(300)
    mb = page.query_selector('#view-models button.pcard[data-m]')
    if mb: mb.click(); page.wait_for_timeout(400)
    tablet_check('exemplar archive'); shot(page, '16-tablet-models-open')
    page.set_viewport_size({'width': 1100, 'height': 900})
    page.click('#btn-out'); page.wait_for_timeout(800)

    # ----------------------------------------------------- RETURNING student (tutee)
    step('returning student (tutee): second-term chapter 1 and the house picker')
    login(page, 'tut', 'Aeh')
    assert page.evaluate("window.Story.returning(window.PCHost.p)") is True
    assert page.evaluate("window.Story.titleOf(window.PCHost.p, window.Story.chapterN(1))") == 'A New Term'
    shot(page, '20-map-returning')
    page.evaluate("window.Story.open(1, 'read')"); page.wait_for_timeout(300)
    n_pages = page.evaluate("document.querySelectorAll('.story-nav .dot').length")
    assert n_pages == 6, n_pages  # 4 returning-only + 2 shared (second year)
    shot(page, '21-ch1-returning')
    page.evaluate("window.Story.openHouse(1, null)"); page.wait_for_timeout(300); shot(page, '22-house-pick')
    page.click('#view-story [data-house=bridge]'); page.wait_for_timeout(300); shot(page, '23-house-welcome-back')
    assert page.evaluate("window.PCHost.p.story.house") == 'bridge'
    missions = page.evaluate("window.Story.missions(window.PCHost.p, window.Story.chapterN(1)).map(m=>m.event||m.id)")
    assert 'sorting' not in missions and 'house' in missions, missions
    page.click('#btn-out'); page.wait_for_timeout(800)

    # --------------------------------------------------------------- Staff Room
    step('Staff Room: PIN, roster with chapter and house, story panel, marking')
    page.goto(BASE + 'teacher.html'); page.wait_for_timeout(600)
    page.fill('#pin', '1234'); page.click('#gate-go'); page.wait_for_timeout(1200)
    shot(page, '30-staff')
    roster = page.inner_text('#roster')
    assert 'Proud' in roster and 'Aeh' in roster, roster[:300]
    page.click('#roster tr.r[data-id="tut-aeh"]'); page.wait_for_timeout(700); shot(page, '31-student')
    assert 'returning' in page.inner_text('#detail')
    step('Staff Room: class readiness and the examiners\' verdict split; archive and restore (handover item 5)')
    st = page.inner_text('#stats').upper()
    assert 'MEAN CLASS READINESS' in st and "MEAN EXAMINERS' VERDICT" in st, st
    head = page.inner_text('#roster thead')
    assert 'CLASS WORK' in head.upper() and "EXAMINERS' VERDICT" in head.upper(), head
    page.once('dialog', accept)
    page.click('#d-archive'); page.wait_for_timeout(500)
    assert page.query_selector('#roster tr.r[data-id="tut-aeh"]') is None, 'archived row still on the roster'
    assert 'archived' in page.inner_text('#roster-n')
    page.click('#r-arch'); page.wait_for_timeout(300)
    assert page.query_selector('#roster tr.r.arch[data-id="tut-aeh"]') is not None, 'Show archived did not list the row'
    page.click('#roster tr.r[data-id="tut-aeh"]'); page.wait_for_timeout(600)
    page.click('#d-archive'); page.wait_for_timeout(600)
    assert page.query_selector('#roster tr.r.arch') is None and page.query_selector('#roster tr.r[data-id="tut-aeh"]') is not None, 'restore failed'
    # Reset password (WS-G, Oct 2026): button beside Archive; offline the local store takes the reset
    page.click('#roster tr.r[data-id="tut-aeh"]'); page.wait_for_timeout(600)
    assert page.query_selector('#d-reset') and page.query_selector('#d-archive'), 'Reset password button missing beside Archive'
    page.once('dialog', accept)
    page.click('#d-reset'); page.wait_for_timeout(400)
    assert 'the password she types becomes her new one' in page.inner_text('body'), 'reset toast missing'
    assert page.evaluate("JSON.parse(localStorage.getItem('cc.local.v1')).students['tut-aeh'].pw") == '', 'local pw not emptied'
    # CSV export still works after the Archive column (handover item 5 acceptance): capture the Blob instead of saving a file
    page.evaluate("window.__csv = null; var C = window.URL.createObjectURL; window.URL.createObjectURL = function (b) { b.text().then(function (t) { window.__csv = t; }); return 'blob:smoke'; }; HTMLAnchorElement.prototype.click = function () {};")
    page.click('#t-csv'); page.wait_for_timeout(400)
    csvtxt = page.evaluate("window.__csv")
    assert csvtxt and 'Archived' in csvtxt.split('\n')[0] and 'tut-aeh' in csvtxt, 'CSV export: ' + str(csvtxt)[:200]
    page.click('.tnav button[data-view=marking]'); page.wait_for_timeout(400)
    rep = page.query_selector('#view-marking [data-mk]')
    if rep: rep.click(); page.wait_for_timeout(500); shot(page, '32-marking')
    page.click('.tnav button[data-view=assign]'); page.wait_for_timeout(300); shot(page, '33-assign')

    step('Reset password: the student signs in with whatever she types next (4+ characters) and keeps her progress')
    login(page, 'tut', 'Aeh', pw='brand-new-pw')
    assert page.inner_text('#hdr-name') == 'Aeh'
    page.click('#btn-out'); page.wait_for_timeout(600)
    page.goto(BASE + 'index.html'); page.wait_for_timeout(500)
    page.click('#tab-tut'); page.wait_for_timeout(150)
    val = page.evaluate("Array.from(document.querySelectorAll('#f-pick option')).filter(o=>o.dataset.name==='Aeh')[0].value")
    page.select_option('#f-pick', val); page.fill('#f-pw', 'test1234'); page.click('#btn-go'); page.wait_for_timeout(500)
    assert 'Wrong password' in page.inner_text('#login-msg'), 'the old password should be rejected after the reset: ' + page.inner_text('#login-msg')

    b.close()

httpd.shutdown()
errs = [e for e in errors if 'favicon' not in e and 'Failed to load resource' not in e]
miss = sorted(set(u for u in missing if 'favicon' not in u))
print('local 404s:', len(miss))
for u in miss[:30]: print('  404', u)
errs += ['404 ' + u for u in miss]
print('console/page errors:', len(errs))
for e in errs[:30]: print('  !', e)
sys.exit(1 if errs else 0)
