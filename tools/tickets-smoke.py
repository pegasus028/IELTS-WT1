#!/usr/bin/env python3
"""WS-C smoke: the Tickets room and the Staff Room's Tickets · Participation panel, offline (demo) mode.
python3 tools/tickets-smoke.py      CHROME=/opt/pw-browsers/chromium-1243/chrome-linux64/chrome
Screenshots in tools/shots/tk-*.png. Fails on page/console errors, a local 404, or sideways overflow at 390 / 780 px.

Walk: Staff Room opens E01 → a M4.1 student enters E01 → first answer wrong → hint + second try → the rest →
result card; p.tickets.E01 saved; attempt rows mode 'ticket' / itemId vw2-… in the outbox; a closed code is
refused; a second sitting is refused; Q02 with the clock forced to 0 → time-out result (rows for unanswered
items); Staff Room: set table shows 1/N done, live grid for E01, heat map by tag, ledger with modules set,
override checkbox, CSV button; template-kind owl post; phone and tablet widths."""
import os, sys, http.server, threading, socketserver, functools, json
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
def shot(page, name): page.screenshot(path=os.path.join(SHOTS, name + '.png'), full_page=True)
def step(msg): print('·', msg)
def overflow(page): return page.evaluate("document.documentElement.scrollWidth - document.documentElement.clientWidth")
def accept(d):
    try: d.accept()
    except Exception: pass

def login(page, group, name, pw='test1234'):
    page.goto(BASE + 'index.html'); page.wait_for_timeout(400)
    page.evaluate("localStorage.setItem('cc.apiUrl','off')"); page.reload(); page.wait_for_timeout(700)
    page.click('#tab-' + group); page.wait_for_timeout(150)
    val = page.evaluate("Array.from(document.querySelectorAll('#f-pick option')).filter(o=>o.dataset.name===%r)[0].value" % name)
    page.select_option('#f-pick', val); page.fill('#f-pw', pw); page.click('#btn-go')
    page.wait_for_selector('#screen-app:not(.hidden)', timeout=8000); page.wait_for_timeout(400)

def staff(page):
    page.goto(BASE + 'teacher.html'); page.wait_for_timeout(500)
    page.evaluate("localStorage.setItem('cc.apiUrl','off')"); page.reload(); page.wait_for_timeout(500)
    page.fill('#pin', '1234'); page.click('#gate-go'); page.wait_for_timeout(900)
    page.click('.tnav button[data-view=tickets]'); page.wait_for_timeout(600)

def answer_item(page, want_correct):
    """Answer the current ticket item. Returns True if the item was answered correctly."""
    # read the right answer from the item through the module: the item is resolvable by the code's set
    info = page.evaluate("""(function(){
      var txt=document.querySelector('.tk-code-line').textContent.trim().split(' ')[0];
      var set=window.Tickets.setOf(txt); var n=parseInt(document.querySelector('.qcount').textContent,10)-1;
      var it=set.items[n]; return {type:it.type, answer:it.answer, nopt:(it.options||[]).length, nwords:(it.words||[]).length};
    })()""")
    if info['type'] == 'spot':
        idx = info['answer'] if want_correct else (info['answer'] + 1) % info['nwords']
        page.query_selector_all('#tk-host .seg')[idx].click()
    else:
        nopt = 3 if info['type'] == 'judge' else info['nopt']
        idx = info['answer'] if want_correct else (info['answer'] + 1) % nopt
        page.query_selector_all('#tk-host .opt')[idx].click()
    page.wait_for_timeout(80); page.click('#tk-check'); page.wait_for_timeout(200)
    return want_correct

with sync_playwright() as p:
    exe = os.environ.get('CHROME') or '/opt/pw-browsers/chromium-1243/chrome-linux64/chrome'
    b = p.chromium.launch(executable_path=exe if os.path.exists(exe) else None)
    ctx = b.new_context(viewport={'width': 1100, 'height': 900})
    page = ctx.new_page()
    page.on('console', lambda m: errors.append(m.text) if m.type == 'error' and ((m.location or {}).get('url', '') or BASE).startswith(BASE) else None)
    page.on('pageerror', lambda e: errors.append(str(e)))
    page.on('response', lambda r: missing.append(r.url.replace(BASE, '')) if r.status == 404 and r.url.startswith(BASE) else None)
    page.on('dialog', accept)

    step('Staff Room: Tickets panel loads; open E01')
    staff(page)
    txt = page.inner_text('#view-tickets')
    assert 'E01' in txt and 'Q02' in txt and 'Participation ledger' in txt, txt[:300]
    assert 'not opened' in txt
    page.click('[data-tk-toggle="E01"]'); page.wait_for_timeout(400)
    assert 'open' in page.inner_text('#view-tickets tr.sel'), page.inner_text('#view-tickets tr.sel')
    shot(page, 'tk-01-staff-open')

    step('student: the Tickets tab is on the map before chapter 1; a closed code is refused')
    login(page, 'm41', 'Proud')
    vis = page.evaluate("Array.from(document.querySelectorAll('.nav button[data-view]')).filter(b=>!b.classList.contains('hidden')).map(b=>b.dataset.view)")
    assert 'tickets' in vis, vis
    page.click('.nav button[data-view=tickets]'); page.wait_for_timeout(300)
    shot(page, 'tk-02-entry')
    page.fill('#tk-code', 'q02'); page.click('#tk-go'); page.wait_for_timeout(400)
    assert 'not open' in page.inner_text('#tk-msg') or 'closed' in page.inner_text('#tk-msg'), page.inner_text('#tk-msg')
    page.fill('#tk-code', 'zz'); page.click('#tk-go'); page.wait_for_timeout(200)
    assert 'one letter and two digits' in page.inner_text('#tk-msg')

    step('student: E01 — wrong first answer → hint + second try; then the rest; result card')
    page.fill('#tk-code', 'E01'); page.click('#tk-go'); page.wait_for_timeout(500)
    assert page.query_selector('#tk-clock'), 'no clock'
    assert '3:0' in page.inner_text('#tk-clock') or '2:5' in page.inner_text('#tk-clock')
    shot(page, 'tk-03-q1')
    answer_item(page, False)
    fb = page.inner_text('#tk-fb'); assert 'Hint' in fb and 'one more try' in fb, fb
    assert page.is_disabled('#tk-check'), 'Check should wait for the second answer'
    answer_item(page, True)
    fb = page.inner_text('#tk-fb'); assert 'Correct' in fb and 'second try' in fb, fb
    shot(page, 'tk-04-second-try')
    page.click('#tk-check'); page.wait_for_timeout(200)
    answer_item(page, True); page.click('#tk-check'); page.wait_for_timeout(200)
    answer_item(page, False)   # wrong twice: verdict with answer + why
    fb = page.inner_text('#tk-fb'); assert 'Hint' in fb
    answer_item(page, False)
    fb = page.inner_text('#tk-fb'); assert 'Not quite' in fb and 'Answer:' in fb, fb
    page.click('#tk-check'); page.wait_for_timeout(200)
    answer_item(page, True); page.click('#tk-check'); page.wait_for_timeout(200)
    answer_item(page, True)
    assert 'See your result' in page.inner_text('#tk-check')
    page.click('#tk-check'); page.wait_for_timeout(500)
    res = page.inner_text('#view-tickets')
    assert '4/5' in res and 'E01' in res, res[:300]
    shot(page, 'tk-05-result')
    rec = page.evaluate("window.PCHost.p.tickets.E01")
    assert rec['score'] == 4 and rec['n'] == 5 and rec['hinted'] == 2, rec
    rows = page.evaluate("JSON.parse(localStorage.getItem('cc.local.v1')).attempts.concat(JSON.parse(localStorage.getItem('cc.outbox.v1')||'[]')).filter(a=>a.mode==='ticket')")
    assert len(rows) == 5, len(rows)
    assert all(r['itemId'].startswith('vw2-') and r['topic'] == 'E01' and r['level'] == 'L1' for r in rows), rows[0]
    assert sum(r['correct'] for r in rows) == 4 and sum(r['hinted'] for r in rows) == 2
    byTag = page.evaluate("window.PCHost.p.stats.byTag")
    assert sum(v['a'] for v in byTag.values()) == 5, byTag
    assert page.evaluate("Object.keys(window.PCHost.p.review).filter(k=>k.indexOf('vw2-')===0).length") == 0, 'vw2 ids must not enter the Mending Room'
    page.click('#tk-more'); page.wait_for_timeout(200)
    assert 'Your tickets' in page.inner_text('#view-tickets')
    page.fill('#tk-code', 'E01'); page.click('#tk-go'); page.wait_for_timeout(400)
    assert 'One sitting' in page.inner_text('#tk-msg'), page.inner_text('#tk-msg')

    step('student: Q02 (opened locally) with the clock run down → time-out result')
    page.evaluate("(function(){var d=JSON.parse(localStorage.getItem('cc.tickets.v1'));d.sets.Q02={code:'Q02',state:'open',openedAt:new Date().toISOString()};localStorage.setItem('cc.tickets.v1',JSON.stringify(d));})()")
    page.fill('#tk-code', 'Q02'); page.click('#tk-go'); page.wait_for_timeout(500)
    assert '4:0' in page.inner_text('#tk-clock') or '3:5' in page.inner_text('#tk-clock'), page.inner_text('#tk-clock')
    answer_item(page, True); page.click('#tk-check'); page.wait_for_timeout(200)
    # run the clock down without waiting four minutes: the clock reads Date.now, so advance it by five minutes
    page.evaluate("(function(){window.__realNow=Date.now; Date.now=function(){return window.__realNow()+5*60*1000;};})()")
    page.wait_for_timeout(700)
    res = page.inner_text('#view-tickets')
    assert 'Time is up' in res, res[:200]
    shot(page, 'tk-06-timeout')
    rec = page.evaluate("window.PCHost.p.tickets.Q02")
    assert rec['n'] == 8 and rec['timeUp'] is True and rec['score'] == 1, rec
    rows = page.evaluate("JSON.parse(localStorage.getItem('cc.local.v1')).attempts.concat(JSON.parse(localStorage.getItem('cc.outbox.v1')||'[]')).filter(a=>a.mode==='ticket'&&a.topic==='Q02')")
    assert len(rows) == 8 and sum(1 for r in rows if 'time out' in r['given']) == 7, len(rows)
    page.evaluate("Date.now=window.__realNow")

    step('student: a template-kind owl post opens the Workshop on its mode when no page is designed')
    page.evaluate("""(function(){var d=JSON.parse(localStorage.getItem('cc.local.v1'));d.assignments=d.assignments||[];
      d.assignments.push({id:'A-tmpl',ts:new Date().toISOString(),cohort:'all',studentId:'',promptId:'p-line-museums',kind:'template',mode:'TREND',uiMode:'spellbook',timed:false,minutes:0,due:'2026-12-06',title:'A1 TREND: Spellbook page + report',note:''});
      localStorage.setItem('cc.local.v1',JSON.stringify(d));})()""")
    page.evaluate("window.Story.unlockAll(window.PCHost.p); window.PCHost.paintHeader()")
    page.click('.nav button[data-view=plan]'); page.wait_for_timeout(900)
    assert page.query_selector('[data-assign="A-tmpl"]'), 'owl letter missing'
    page.click('[data-assign="A-tmpl"]'); page.wait_for_timeout(800)
    assert not page.query_selector('#view-lab').evaluate("e=>e.classList.contains('hidden')"), 'Workshop should open'
    assert 'TREND' in page.inner_text('#view-lab'), page.inner_text('#view-lab')[:200]
    shot(page, 'tk-07-owl-template')
    page.click('#btn-out'); page.wait_for_timeout(600)

    step('Staff Room: completion, live grid, heat map, ledger, override, CSV, template kind in Assignments')
    staff(page)
    tbl = page.inner_text('#view-tickets table.tk-sets')
    assert '1/' in tbl and '80%' in tbl, tbl[:400]          # E01 done by 1 student, mean 80 %
    page.click('[data-tk-view="E01"]'); page.wait_for_timeout(600)
    live = page.inner_text('#tk-live')
    assert 'Proud' in live and 'Most missed' in live and 'Heat map by tag' in live and '4/5' in live, live[:400]
    cells = page.evaluate("Array.from(document.querySelectorAll('#tk-live tr')).filter(tr=>tr.textContent.indexOf('Proud')>=0)[0].textContent")
    assert '✓h' in cells and '✕' in cells, cells
    shot(page, 'tk-08-live')
    led = page.inner_text('#tk-ledger')
    assert 'Half' in led and 'Modules set to date' in led and 'Proud' in led and 'Team 2' in led, led[:400]
    # module override: tick Module 15's slot? only 15 modules here: tick m14 for H1 and see the denominator grow
    page.click('#tk-ledger details summary'); page.wait_for_timeout(200)
    n_before = page.evaluate("document.querySelectorAll('#tk-ledger [data-tk-mod]:checked').length")
    page.check('[data-tk-mod="m14"]'); page.wait_for_timeout(400)
    n_after = page.evaluate("document.querySelectorAll('#tk-ledger [data-tk-mod]:checked').length")
    assert n_after == n_before + 1, (n_before, n_after)
    cfg = page.evaluate("JSON.parse(localStorage.getItem('cc.ledger.cfg.v1'))")
    assert 'm14' in cfg[list(k for k in cfg if cfg[k]['on'])[0]]['on'], cfg
    page.click('#tk-ledger details summary'); page.wait_for_timeout(100)
    page.uncheck('[data-tk-mod="m14"]'); page.wait_for_timeout(300)
    assert page.evaluate("document.querySelectorAll('#tk-ledger [data-tk-mod]:checked').length") == n_before
    page.click('[data-tk-half="H2"]'); page.wait_for_timeout(300)
    assert 'Half 2' in page.inner_text('#tk-ledger .filters button.on')
    page.click('[data-tk-half="H1"]'); page.wait_for_timeout(300)
    page.click('#tk-ledger tr.r[data-tk-stu="m41-proud"]'); page.wait_for_timeout(300)
    assert 'Exit tickets done' in page.inner_text('#tk-ledger')
    with page.expect_download() as dl:
        page.click('#tk-csv')
    csv = open(dl.value.path(), encoding='utf8').read()
    assert 'Participation /15' in csv and 'm41-proud' in csv and 'E01,m41-proud,4,5' in csv, csv[:400]
    shot(page, 'tk-09-ledger')
    page.click('.tnav button[data-view=assign]'); page.wait_for_timeout(400)
    assert page.query_selector('#a-kind') and page.query_selector('#a-tmode'), 'template kind controls missing'
    page.select_option('#a-kind', 'template'); page.select_option('#a-tmode', 'COMPARE'); page.select_option('#a-prompt', 'p-bar-screentime'); page.fill('#a-due', '2026-12-13')
    page.click('#a-set'); page.wait_for_timeout(500)
    al = page.inner_text('#a-list'); assert 'Spellbook page (COMPARE) + report' in al and 'spellbook' in al, al
    shot(page, 'tk-10-assign-template')

    step('phone width 390: Tickets room and Staff panel without sideways scroll')
    page.set_viewport_size({'width': 390, 'height': 844}); page.wait_for_timeout(400)
    page.click('.tnav button[data-view=tickets]'); page.wait_for_timeout(600)
    page.click('[data-tk-view="E01"]'); page.wait_for_timeout(500)
    assert overflow(page) <= 0, 'staff overflow at 390: %d' % overflow(page)
    shot(page, 'tk-11-staff-390')
    login(page, 'm41', 'Mint')
    page.click('.nav button[data-view=tickets]') if page.evaluate("!document.querySelector('.nav button[data-view=tickets]').classList.contains('nav-overflow')") else page.evaluate("window.PCHost.show('tickets')")
    page.wait_for_timeout(300)
    assert overflow(page) <= 0, 'entry overflow at 390: %d' % overflow(page)
    page.fill('#tk-code', 'E01'); page.click('#tk-go'); page.wait_for_timeout(500)
    assert page.query_selector('#tk-clock'), 'no clock at 390'
    assert overflow(page) <= 0, 'question overflow at 390: %d' % overflow(page)
    shot(page, 'tk-12-student-390')
    answer_item(page, True); page.click('#tk-check'); page.wait_for_timeout(200)
    assert overflow(page) <= 0, 'q2 overflow at 390: %d' % overflow(page)

    step('tablet width 780')
    page.set_viewport_size({'width': 780, 'height': 1024}); page.wait_for_timeout(400)
    assert overflow(page) <= 0, 'question overflow at 780: %d' % overflow(page)
    shot(page, 'tk-13-student-780')
    page.evaluate("window.Tickets.leave(); window.PCHost.show('tickets')"); page.wait_for_timeout(200)
    assert overflow(page) <= 0
    page.click('#btn-out'); page.wait_for_timeout(500)
    staff(page); page.click('[data-tk-view="E01"]'); page.wait_for_timeout(500)
    assert overflow(page) <= 0, 'staff overflow at 780: %d' % overflow(page)
    shot(page, 'tk-14-staff-780')
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
