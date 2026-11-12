#!/usr/bin/env python3
"""Scriptorium guidance levels (12 Nov 2026), offline/demo mode. Usage: python3 tools/guide-smoke.py
High guidance on Museum visitors: every step is answered wrong first (the option greys out, a hint appears that does
not contain the answer, the option cannot be chosen again), then right; the four panes build the expected essay; the
Ten Wards are all green; the report is sent with uiMode 'high'. A half-finished run is restored after a reload.
Medium guidance: a known slip gets a hint, 'keep my answer' overrides, the AI check (stubbed) accepts and revises,
the panes become editable at the end, the report is sent with uiMode 'medium'.
Low guidance: the introduction notes are in the plan and saved with it. A chart without a script opens at Low.
Phone width (390 px): no sideways overflow. Fails on any page or console error."""
import os, sys, http.server, threading, socketserver, functools, glob, json
from playwright.sync_api import sync_playwright
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
SHOTS = os.path.join(ROOT, 'tools', 'shots'); os.makedirs(SHOTS, exist_ok=True)
PORT = int(os.environ.get('PORT', '8793'))
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
PID = 'p-line-museums'
def overflow(page): return page.evaluate("document.documentElement.scrollWidth-document.documentElement.clientWidth")
def login(page):
    page.goto(BASE + 'index.html'); page.wait_for_timeout(400)
    page.evaluate("localStorage.setItem('cc.apiUrl','off')"); page.reload(); page.wait_for_timeout(700)
    page.click('#tab-m41'); page.wait_for_timeout(150)
    val = page.evaluate("Array.from(document.querySelectorAll('#f-pick option')).filter(o=>o.dataset.name==='Proud')[0].value")
    page.select_option('#f-pick', val); page.fill('#f-pw', 'test1234'); page.click('#btn-go')
    page.wait_for_selector('#screen-app:not(.hidden)', timeout=8000); page.wait_for_timeout(400)
    page.evaluate("window.PCHost.p.story.house='bridge'")
def open_writer(page, mode, pid=PID):
    page.evaluate("window.PCHost.show('writer')"); page.wait_for_timeout(250)
    page.check('input[name=uim][value=%s]' % mode)
    page.click('[data-p="%s"]' % pid); page.wait_for_timeout(700)
with sync_playwright() as pw:
    b = pw.chromium.launch(executable_path=chrome())
    ctx = b.new_context(viewport={'width': 1180, 'height': 860}, device_scale_factor=1)
    page = ctx.new_page()
    page.on('console', lambda m: errors.append(m.text) if m.type == 'error' else None)
    page.on('pageerror', lambda e: errors.append(str(e)))
    page.on('dialog', lambda d: d.accept())
    login(page)
    assert page.evaluate("Guide.has('%s') && !Guide.ready('%s')" % (PID, PID)), 'the script should be listed but not loaded before it is needed'
    page.evaluate("new Promise(function(r){Guide.load('%s', r)})" % PID)
    expected = page.evaluate("(function(){var sc=Guide.script('%s');return Guide.essay(sc,Guide.key(sc));})()" % PID)
    flat = page.evaluate("Guide.steps(Guide.script('%s')).map(function(x){return {id:x.step.id, ok:x.step.ok, wrong:x.step.wrong.map(function(w){return w[0]})}})" % PID)

    step('the Scriptorium offers four guidance levels and no Spellbook option')
    page.evaluate("window.PCHost.show('writer')"); page.wait_for_timeout(250)
    vals = page.evaluate("Array.from(document.querySelectorAll('input[name=uim]')).map(function(r){return r.value})")
    assert vals == ['high', 'medium', 'low', 'exam'], vals
    assert 'Spellbook —' not in page.inner_text('.modechoice')
    page.screenshot(path=os.path.join(SHOTS, 'guide-0-levels.png'))

    step('High guidance: wrong first on every step, then right')
    open_writer(page, 'high')
    assert page.query_selector('.gd.gd-high') and not page.query_selector('#gd-in')
    for n, st in enumerate(flat):
        kick = page.inner_text('#gd-q .kicker')
        btns = page.query_selector_all('#gd-q .gd-opt'); assert len(btns) == 4, (st['id'], len(btns))
        labels = [x.inner_text() for x in btns]
        assert sorted(labels) == sorted([st['ok']] + st['wrong']), (st['id'], labels)
        wrong = [x for x in btns if x.inner_text() != st['ok']]
        tries = 3 if n % 9 == 0 else 1          # sometimes every wrong option, so the right one is the only one left
        for wbtn in wrong[:tries]:
            wbtn.click(); page.wait_for_timeout(40)
            assert wbtn.is_disabled() and 'off' in wbtn.get_attribute('class'), st['id']
            hint = page.inner_text('#gd-hint')
            assert len(hint) > 25 and (len(st['ok']) < 5 or st['ok'].lower() not in hint.lower()), (st['id'], hint)
            assert page.inner_text('#gd-q .kicker') == kick, 'a wrong answer moved on'
        if n == 12: page.screenshot(path=os.path.join(SHOTS, 'guide-1-high-hint.png'))
        if tries == 3: assert len([x for x in page.query_selector_all('#gd-q .gd-opt') if not x.is_disabled()]) == 1
        [x for x in page.query_selector_all('#gd-q .gd-opt') if x.inner_text() == st['ok']][0].click()
        page.wait_for_timeout(460)
        if n == 20:
            step('  a reload half-way: the run comes back at the same step')
            page.screenshot(path=os.path.join(SHOTS, 'guide-2-high-midway.png'))
            nxt = flat[n + 1]; wb = [x for x in page.query_selector_all('#gd-q .gd-opt') if x.inner_text() == nxt['wrong'][0]][0]; wb.click(); page.wait_for_timeout(60)
            page.reload(); page.wait_for_timeout(800)
            page.fill('#f-pw', 'test1234') if page.query_selector('#screen-app.hidden') and page.query_selector('#f-pw') else None
            if page.query_selector('#screen-app.hidden'):
                page.click('#tab-m41'); val = page.evaluate("Array.from(document.querySelectorAll('#f-pick option')).filter(o=>o.dataset.name==='Proud')[0].value")
                page.select_option('#f-pick', val); page.fill('#f-pw', 'test1234'); page.click('#btn-go'); page.wait_for_selector('#screen-app:not(.hidden)', timeout=8000)
            page.wait_for_timeout(300); open_writer(page, 'high')
            wb = [x for x in page.query_selector_all('#gd-q .gd-opt') if x.inner_text() == nxt['wrong'][0]][0]
            assert wb.is_disabled() and len(page.inner_text('#gd-hint')) > 20, 'a greyed option came back after the reload'
            assert ('step %d of' % (n + 2)) in page.inner_text('#gd-q .gd-foot').lower().replace('step', 'step'), page.inner_text('#gd-q .gd-foot')
    assert 'Your report is built' in page.inner_text('#gd-q')
    panes = [page.inner_text('#gd-p%d' % i) for i in range(4)]
    assert panes == expected['panes'], json.dumps(panes, indent=1)
    assert not page.query_selector('.gd-ta'), 'High guidance panes must stay read-only'
    page.click('#gd-wards'); page.wait_for_timeout(300)
    rows = page.evaluate("Array.from(document.querySelectorAll('#wr-panel .pf-row')).map(function(r){return r.className})")
    assert rows and all('ok' in r for r in rows), rows
    page.screenshot(path=os.path.join(SHOTS, 'guide-3-high-done.png'), full_page=True)
    xp0 = page.evaluate('window.PCHost.p.xp')
    page.click('#wr-submit'); page.wait_for_timeout(500)
    assert page.evaluate('window.PCHost.p.xp') - xp0 == 75, ('a High-guidance report earns half merits (75)', page.evaluate('window.PCHost.p.xp') - xp0)
    rep = page.evaluate("(function(){var r=window.PCHost.p.reports; return r[r.length-1]})()")
    assert rep['uiMode'] == 'high' and rep['words'] >= 160 and rep['bad'] == 0, rep
    assert 'do not give it a band' in page.inner_text('#view-write')
    assert page.evaluate("Object.keys(localStorage).filter(function(k){return k.indexOf('cc.guide.v1.')===0}).length") == 0, 'saved run not cleared after sending'

    step('Medium guidance: rule check, hints, keep my answer, AI check (stubbed)')
    calls = []
    page.evaluate("""window.__gc=[]; window.API.guideCheck=function(p){window.__gc.push(p);
      if(/zzz/.test(p.entry)) return Promise.resolve({ok:true,verdict:'revise',hint:'Check the word order.',source:'ai'});
      if(/leak/.test(p.entry)) return Promise.resolve({ok:true,verdict:'revise',hint:'Write: '+Guide.steps(Guide.script(p.promptId)).filter(function(x){return x.step.id===p.stepId})[0].step.ok,source:'ai'});
      if(/down/.test(p.entry)) return Promise.resolve({ok:false,error:'budget'});
      return Promise.resolve({ok:true,verdict:'accept',hint:'',source:'ai'});}; 0""")
    open_writer(page, 'medium')
    assert page.query_selector('.gd.gd-medium #gd-in') and not page.query_selector('.gd-opt')
    def commit(t): page.fill('#gd-in', t); page.click('#gd-commit'); page.wait_for_timeout(120)
    def cur(): return page.inner_text('#gd-q .kicker')
    # t-mode: empty, a wrong answer the rules do not know (AI stub accepts everything but zzz, so use zzz), then right
    k = cur(); page.click('#gd-commit'); page.wait_for_timeout(60); assert 'Write your answer first' in page.inner_text('#gd-hint')
    commit('zzz compare'); assert cur() == k and 'word order' in page.inner_text('#gd-hint') and page.query_selector('#gd-keep')
    commit('leak'); h = page.inner_text('#gd-hint'); assert 'TREND' not in h, 'the AI hint leaked the answer: ' + h
    commit('down'); assert cur() == k, 'no AI and no rule match must not be accepted'
    commit('trend'); assert cur() != k
    # t-tense: a known slip gets its own hint without the AI
    n0 = page.evaluate("window.__gc.length"); commit('present perfect'); assert 'different tense' in page.inner_text('#gd-hint') and page.evaluate("window.__gc.length") == n0
    commit('past simple')
    commit('420 thousand visitors'); commit('the Science Museum'); commit('the Art Gallery and the History Museum')
    # t-exception is an AI step: the rules are satisfied and the AI still reads it
    n0 = page.evaluate("window.__gc.length"); commit('the Art Gallery rose a little in 2016'); assert page.evaluate("window.__gc.length") == n0 + 1
    pay = page.evaluate("window.__gc[window.__gc.length-1]"); assert pay['stepId'] == 't-exception' and pay['expect'] and pay['ask'] and pay['promptId'] == PID, pay
    assert 'Introduction' in cur(), cur()
    commit('the line graph'); commit('compares')
    assert page.inner_text('#gd-p0') == 'The line graph compares', page.inner_text('#gd-p0')
    # keep my answer: an override goes into the pane as typed
    commit('the number of visitors to three museums'); assert 'own phrase' in page.inner_text('#gd-hint')
    page.screenshot(path=os.path.join(SHOTS, 'guide-4-medium-hint.png'))
    page.click('#gd-keep'); page.wait_for_timeout(120)
    assert page.inner_text('#gd-p0').endswith('the number of visitors to three museums'), page.inner_text('#gd-p0')
    # the rest: the right option typed in lower case with stray punctuation
    left = page.evaluate("Guide.steps(Guide.script('%s')).map(function(x){return x.step}).slice(9).map(function(s){return {id:s.id, ok:s.ok}})" % PID)
    for n2, s in enumerate(left):
        if s['id'] == 'a-subject':
            commit('the science museum'); assert 'capital letters' in page.inner_text('#gd-hint')
        commit(s['ok'][0].lower() + s['ok'][1:] + (',' if s['id'] in ('o-open', 'a-time') else '.' if n2 % 4 == 0 else ''))
    assert 'Your report is built' in page.inner_text('#gd-q'), cur()
    tas = page.query_selector_all('.gd-ta'); assert len(tas) == 4, 'Medium panes must open for polishing'
    got = [t.input_value() for t in tas]
    assert got[1:] == expected['panes'][1:], json.dumps(got, indent=1)
    assert got[0].startswith('The line graph compares the number of visitors to three museums in a European city'), got[0]
    step('  polished text and greyed options survive leaving and coming back')
    page.fill('#gd-ta2', expected['panes'][2] + ' POLISHED'); page.wait_for_timeout(80)
    page.click('#wr-quit'); page.wait_for_timeout(250); open_writer(page, 'medium')
    assert page.input_value('#gd-ta2').endswith('POLISHED'), page.input_value('#gd-ta2')
    page.fill('#gd-ta0', expected['panes'][0]); page.fill('#gd-ta1', expected['panes'][1]); page.fill('#gd-ta2', expected['panes'][2]); page.fill('#gd-ta3', expected['panes'][3])
    page.click('#gd-wards'); page.wait_for_timeout(300)
    page.screenshot(path=os.path.join(SHOTS, 'guide-5-medium-done.png'), full_page=True)
    xp0 = page.evaluate('window.PCHost.p.xp')
    page.click('#wr-submit'); page.wait_for_timeout(500)
    assert page.evaluate('window.PCHost.p.xp') - xp0 == 150, 'a Medium report earns full merits'
    rep = page.evaluate("(function(){var r=window.PCHost.p.reports; return r[r.length-1]})()")
    assert rep['uiMode'] == 'medium', rep
    assert 'examiners are marking' in page.inner_text('#view-write')

    step('Low guidance: the introduction notes are in the plan')
    open_writer(page, 'low')
    assert not page.query_selector('.gd') and page.query_selector('#wr-i-visual') and page.query_selector('#wr-i-when') and page.query_selector('#wr-big')
    assert len(page.query_selector_all('.wr-intro .wr-planrow')) == 6
    page.select_option('#wr-i-visual', 'line graph'); page.fill('#wr-i-verb', 'illustrates')
    assert len(page.query_selector_all('.wr-box textarea')) == 4
    page.screenshot(path=os.path.join(SHOTS, 'guide-6-low.png'), full_page=True)
    page.click('#wr-quit'); page.wait_for_timeout(200)

    step('a chart without a script opens at Low guidance, with a note')
    other = page.evaluate("(window.CONTENT.PROMPTS.filter(function(p){return !Guide.has(p.id)})[0]||{}).id||''")
    if other:
        open_writer(page, 'high', other)
        assert not page.query_selector('.gd') and page.query_selector('#wr-big'), 'fallback to Low failed'
        page.click('#wr-quit'); page.wait_for_timeout(200)
    else: print('  (every chart has a script)')
    step('every script in guide-index.js loads on demand and opens at High guidance')
    for gid in page.evaluate("window.GUIDE_INDEX"):
        if gid == PID: continue
        open_writer(page, 'high', gid); page.wait_for_selector('.gd.gd-high .gd-opt', timeout=8000)
        assert len(page.query_selector_all('#gd-q .gd-opt')) == 4, gid
        page.click('#wr-quit'); page.wait_for_timeout(150)
    step('Exam mode is unchanged: one page, no plan')
    open_writer(page, 'exam')
    assert len(page.query_selector_all('#view-write textarea')) == 1 and not page.query_selector('#wr-big')
    page.click('#wr-quit'); page.wait_for_timeout(200)

    step('phone width (390 px): High and Medium fit')
    ph = b.new_context(viewport={'width': 390, 'height': 800}); p2 = ph.new_page()
    p2.on('console', lambda m: errors.append(m.text) if m.type == 'error' else None); p2.on('pageerror', lambda e: errors.append(str(e))); p2.on('dialog', lambda d: d.accept())
    login(p2)
    for mode in ('high', 'medium'):
        open_writer(p2, mode); assert overflow(p2) <= 0, (mode, overflow(p2))
        if mode == 'high':
            for st in flat[:8]:
                [x for x in p2.query_selector_all('#gd-q .gd-opt') if x.inner_text() != st['ok']][0].click(); p2.wait_for_timeout(40)
                [x for x in p2.query_selector_all('#gd-q .gd-opt') if x.inner_text() == st['ok']][0].click(); p2.wait_for_timeout(460)
            assert overflow(p2) <= 0
        p2.screenshot(path=os.path.join(SHOTS, 'guide-7-phone-%s.png' % mode), full_page=True)
        p2.click('#wr-quit'); p2.wait_for_timeout(200)
    b.close()
httpd.shutdown()
if errors:
    print('CONSOLE / PAGE ERRORS:'); [print('  ', e) for e in errors[:20]]; sys.exit(1)
print('guide-smoke: OK')
