#!/usr/bin/env python3
"""Every script in guide-index.js, in the browser at High guidance (19 Nov 2026). Usage: python3 tools/guide-smoke-all.py [key ...]
key = <promptId> for the base level (C1), <promptId>.b1 / <promptId>.b2 for B1 / B2. With no key: every script (about 30 min
for all levels: run it in the background).
For each script: open the chart from the Scriptorium at High with the level radio ticked; the guide loads on demand; the bar
names the level; answer every step with its right option (the first wrong option on every fourth step first: it greys out,
the wrong count goes up and its hint does not contain the answer); the four panes equal Guide.essay; the Ten Wards are all
green; the run is not sent (nothing is written). Fails on any page or console error. The detailed flow (Medium, resume,
fallbacks) is tools/guide-smoke.py on p-line-museums."""
import os, sys, http.server, threading, socketserver, functools, glob, json
from playwright.sync_api import sync_playwright
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
PORT = int(os.environ.get('PORT', '8796'))
BASE_CEFR = 'C1'
class Quiet(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a): pass
socketserver.TCPServer.allow_reuse_address = True
httpd = socketserver.TCPServer(('127.0.0.1', PORT), functools.partial(Quiet, directory=ROOT))
threading.Thread(target=httpd.serve_forever, daemon=True).start()
URL = 'http://127.0.0.1:%d/' % PORT
errors = []
def chrome():
    exe = os.environ.get('CHROME')
    if exe and os.path.exists(exe): return exe
    hits = sorted(glob.glob('/opt/pw-browsers/chromium-*/chrome-linux*/chrome'))
    return hits[-1] if hits else None
with sync_playwright() as p:
    b = p.chromium.launch(executable_path=chrome())
    page = b.new_page(viewport={'width': 1180, 'height': 900})
    page.on('console', lambda m: errors.append(m.text) if m.type == 'error' else None)
    page.on('pageerror', lambda e: errors.append(str(e)))
    page.on('dialog', lambda d: d.accept())
    page.goto(URL + 'index.html'); page.wait_for_timeout(500)
    page.evaluate("localStorage.setItem('cc.apiUrl','off')"); page.reload(); page.wait_for_timeout(700)
    page.click('#tab-m41'); page.wait_for_timeout(150)
    val = page.evaluate("Array.from(document.querySelectorAll('#f-pick option')).filter(o=>o.dataset.name==='Proud')[0].value")
    page.select_option('#f-pick', val); page.fill('#f-pw', 'test1234'); page.click('#btn-go')
    page.wait_for_selector('#screen-app:not(.hidden)', timeout=8000); page.wait_for_timeout(400)
    page.evaluate("window.PCHost.p.story.house='bridge'")
    keys = sys.argv[1:] or page.evaluate('window.GUIDE_INDEX')
    for key in keys:
        pid, _, lv = key.partition('.'); cefr = (lv or BASE_CEFR).upper()
        page.evaluate("window.PCHost.show('writer')"); page.wait_for_timeout(200)
        page.check('input[name=uim][value=high]'); page.wait_for_timeout(80)
        page.check('input[name=cefr][value=%s]' % cefr); page.wait_for_timeout(250)
        assert page.evaluate("Guide.has('%s', '%s')" % (pid, cefr)), (key, 'not listed at this level')
        page.evaluate("document.querySelector('[data-p=\"%s\"]').click()" % pid)
        page.wait_for_selector('#gd-q .gd-opt', timeout=8000)
        meta = page.inner_text('#gd-prompt .gd-pmeta'); assert cefr in meta, (key, 'opened at the wrong level', meta)
        assert page.evaluate("getComputedStyle(document.querySelector('header.bar')).display") == 'none', (key, 'the app header shows while writing')
        steps = page.evaluate("window.Guide.steps(window.Guide.script('%s', '%s')).map(function(x){return {id:x.step.id, ok:x.step.ok, w:x.step.wrong[0][0]}})" % (pid, cefr))
        nwrong = 0
        for i, s in enumerate(steps):
            def click(t):
                n = page.evaluate("(function(t){var b=Array.prototype.filter.call(document.querySelectorAll('#gd-q .gd-opt'),function(x){return x.textContent===t&&!x.disabled})[0];if(b){b.click();return 1}return 0})(%s)" % json.dumps(t))
                assert n == 1, (key, s['id'], 'option not found', t)
            if i % 4 == 0:
                click(s['w']); page.wait_for_timeout(40); nwrong += 1
                h = page.inner_text('#gd-hint'); assert s['ok'].lower() not in h.lower(), (key, s['id'], h)
                assert page.inner_text('#gd-wrong-n') == str(nwrong), (key, 'wrong count', page.inner_text('#gd-wrong-n'), nwrong)
            click(s['ok']); page.wait_for_timeout(430)
        want = page.evaluate("(function(sc){return window.Guide.essay(sc, window.Guide.key(sc)).panes})(window.Guide.script('%s', '%s'))" % (pid, cefr))
        got = [page.inner_text('#gd-p%d' % i) for i in range(4)]
        assert got == want, (key, got, want)
        assert page.text_content('#gd-tphase-l') == 'Review', (key, 'phase clock', page.text_content('#gd-tphase-l'))
        page.click('#gd-wards'); page.wait_for_timeout(250)
        rows = page.evaluate("Array.from(document.querySelectorAll('#wr-panel .pf-row')).map(function(r){return r.className})")
        assert rows and all(r.endswith(' ok') for r in rows), (key, rows)
        print('·', key, len(steps), 'steps, panes = essay, every Ward green')
        page.click('#wr-quit'); page.wait_for_timeout(250)
        page.evaluate("Object.keys(localStorage).filter(function(k){return k.indexOf('cc.guide.')===0}).forEach(function(k){localStorage.removeItem(k)})")
    print('console errors:', len(errors))
    for e in errors: print('  ', e)
    assert not errors
    print('guide-smoke-all: %d script(s) passed' % len(keys))
