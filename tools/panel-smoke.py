#!/usr/bin/env python3
"""The examiners' panel UI (12 Nov 2026, docs/AI-PANEL-MARKING.md §5 and §6), offline/demo mode.
Usage: python3 tools/panel-smoke.py   (Playwright + the Chromium under /opt/pw-browsers; PORT overrides 8793).

Seeds the browser's local class data with reports shaped exactly as contract §2 (a v2 rep.ai with a third
examiner, a v1 rep.ai with a second pass, a report still waiting, one the examiners could not mark, one hidden
from the student), then checks:
  Staff Room  the list status texts; the 30-second re-read (shortened here) repaints the list and never the
              detail pane while a field is changed; the panel table and the sentence on how the final was
              reached; the form pre-filled from rep.ai; editing a band and the text, then "Return to student",
              sends a markReport whose teacher object has the §3 shape with the edits; a v1 report still
              renders; "Mark again" asks first and is gone once released; release works with empty criterion
              text; the CSV export still works.
  Report Card criteria cards, strengths and improvements for the released v2 mark; nothing from rep.ai when
              aiVisible is off; an old teacher mark (no criteria) as before; no sideways scroll at 390 px.
Every piece of text is escaped (an <img onerror> in a comment, a quote and an examiner's reason creates no
element), and the run fails on any console or page error."""
import os, sys, json, glob, http.server, threading, socketserver, functools
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

def chrome():
    exe = os.environ.get('CHROME')
    if exe and os.path.exists(exe): return exe
    hits = sorted(glob.glob('/opt/pw-browsers/chromium-*/chrome-linux*/chrome'))
    return hits[-1] if hits else None
def step(m): print('·', m)
fails = []
def check(cond, msg):
    if not cond: fails.append(msg); print('  FAIL', msg)

XSS = '<img src=x onerror=alert(1)>'
TEST_PIN = 'panel-ui-test'      # a PIN for this throwaway browser profile only (seeded below)
TEXT = ("The line graph shows how many people visited three museums between 2010 and 2020.\n\n"
        "Overall, the Science Museum became the most popular, while the other two declined.\n\n"
        "In 2010 the Science Museum had around 420,000 visitors. It rised to 760,000 in 2020.\n\n"
        "The Art Gallery fell from 610,000 to 520,000, and the History Museum dropped to 260,000.")

def crit(band, nxt, tag):
    return {'band': band, 'met': 'MET-' + tag + ": you wrote 'rose strongly'.", 'notMet': 'NOTMET-' + tag + ' in paragraph 3.',
            'toNext': 'TONEXT-' + tag + ': compare two figures in one sentence.', 'next': nxt}

def ai_v2(secret, third=True):
    ex = [
        {'id': 'A', 'bands': {'ta': 6, 'cc': 6, 'lr': 5.5, 'gra': 5}, 'why': {'ta': 'Clear overview. ' + XSS, 'cc': 'Paragraphs work.', 'lr': 'Some range.', 'gra': 'Tense errors.'}, 'model': 'model-a'},
        {'id': 'B', 'bands': {'ta': 7, 'cc': 6, 'lr': 5.5, 'gra': 6}, 'why': {'ta': 'Key features covered.', 'cc': 'Logical.', 'lr': 'Adequate.', 'gra': 'Mostly accurate.'}, 'model': 'model-b'}]
    for e in ex: e['bands']['overall'] = round((e['bands']['ta'] + e['bands']['cc'] + e['bands']['lr'] + e['bands']['gra']) / 4 * 2) / 2
    if third: ex.append({'id': 'C', 'bands': {'ta': 6, 'cc': 6, 'lr': 5.5, 'gra': 5.5, 'overall': 6}, 'why': {'ta': 'Overview present, details thin.', 'cc': 'OK.', 'lr': 'OK.', 'gra': 'Some errors.'}, 'model': 'model-c'})
    return {
        'v': 2, 'bands': {'ta': 6, 'cc': 6, 'lr': 5.5, 'gra': 5.5, 'overall': 6}, 'cefr': 'B2',
        'ceilings': ['TA capped at 6: details not always supported by figures.'],
        'criteria': {'ta': crit(6, 7, 'ta'), 'cc': crit(6, 7, 'cc'), 'lr': crit(5.5, 6, 'lr'), 'gra': crit(5.5, 6, 'gra')},
        'strengths': [{'point': 'A clear overview.', 'quote': 'the Science Museum became the most popular'}, {'point': 'Accurate figures.', 'quote': '420,000 visitors'}],
        'improvements': [{'point': 'Group the declines.', 'quote': 'The Art Gallery fell', 'fix': 'Both the Art Gallery and the History Museum fell.'}, {'point': 'Use a comparison.', 'quote': 'dropped to 260,000', 'fix': 'the lowest figure of the three'}],
        'errors': [{'quote': 'It rised', 'tag': 'gra-tense', 'fix': 'It rose'}, {'quote': 'had around 420,000 visitors', 'tag': 'gra-tense', 'fix': 'received around 420,000 visitors'}, {'quote': 'the other two declined', 'tag': 'gra-tense', 'fix': 'the other two both declined'}],
        'nextGate': 'NEXTGATE: support every detail with a figure.',
        'comment': secret + ' Proud, a strong start! ' + XSS,
        'panel': {'examiners': ex, 'disagreed': ['ta', 'gra'] if third else [], 'third': third, 'method': 'median' if third else 'lower', 'spread': 1.0 if third else 0.5, 'single': False},
        'quotesDropped': 1, 'model': 'panel', 'at': '2026-11-12T03:00:00Z'}

def rep(id, sid, name, ts, **kw):
    r = {'id': id, 'studentId': sid, 'name': name, 'cohort': 'M4.1', 'ts': ts, 'promptId': 'p-line-museums', 'type': 'line', 'mode': 'TREND',
         'kind': 'practice', 'uiMode': 'guided', 'text': TEXT, 'words': 62, 'seconds': 900,
         'preflight': {'bad': 0, 'warn': 1, 'rows': [{'id': 'w1', 'status': 'ok', 'label': 'Overview'}, {'id': 'w2', 'status': 'warn', 'label': 'Figures'}]},
         'status': 'submitted', 'released': False}
    r.update(kw); return r

V1 = {'bands': {'tr': 5.5, 'cc': 5.5, 'lr': 5, 'gra': 5, 'overall': 5.5}, 'comment': 'V1-COMMENT', 'nextGate': 'V1-GATE',
      'errors': [{'quote': 'It rised', 'tag': 'gra-tense', 'fix': 'It rose'}], 'second': {'overall': 6.5}, 'ceilings': ['v1 ceiling']}
REPORTS = [
    rep('R-v2', 'm41-proud', 'Proud', '2026-11-12T02:00:00Z', ai=ai_v2('AI-SECRET-V2'), status='ai', aiVisible=False),
    rep('R-v1', 'tut-aeh', 'Aeh', '2026-11-11T02:00:00Z', ai=V1, status='ai'),
    rep('R-wait', 'm41-mint', 'Mint', '2026-11-12T01:00:00Z'),
    rep('R-fail', 'm41-sun', 'Sun', '2026-11-10T02:00:00Z', aiFailed=2),
    rep('R-hidden', 'm41-proud', 'Proud', '2026-11-09T02:00:00Z', ai=ai_v2('AI-SECRET-HIDDEN', third=False), status='ai', aiVisible=False),
    rep('R-old', 'm41-proud', 'Proud', '2026-11-08T02:00:00Z', status='released', released=True,
        teacher={'bands': {'ta': 5, 'cc': 5.5, 'lr': 5, 'gra': 5, 'overall': 5}, 'cefr': 'B1', 'comment': 'OLD-TEACHER-COMMENT', 'at': '2026-11-08T05:00:00Z'}),
]
SEED = {'students': {}, 'attempts': [], 'sessions': [], 'mocks': [], 'reports': REPORTS, 'assignments': [], 'projector': [], 'teacherPin': TEST_PIN}

# the 30-second re-read runs every 400 ms here; markReport calls are recorded
INIT = """(function(){var st=window.setTimeout;window.setTimeout=function(f,ms){if(ms===30000)ms=400;return st.call(window,f,ms);};
window.__mk=[];var t=setInterval(function(){if(window.API&&window.API.markReport&&!window.API.__w){var o=window.API.markReport;
window.API.markReport=function(id,m){window.__mk.push(JSON.parse(JSON.stringify({id:id,m:m})));return o.apply(this,arguments);};window.API.__w=1;clearInterval(t);}},5);})();"""

errors, dialogs = [], []
with sync_playwright() as p:
    b = p.chromium.launch(executable_path=chrome())
    ctx = b.new_context(viewport={'width': 1280, 'height': 900})
    ctx.add_init_script(INIT)
    page = ctx.new_page()
    page.on('console', lambda m: errors.append(m.text) if m.type == 'error' and ((m.location or {}).get('url', '') or BASE).startswith(BASE) else None)
    page.on('pageerror', lambda e: errors.append(str(e)))
    def on_dialog(d):
        dialogs.append((d.type, d.message))
        try: d.accept()
        except Exception: pass
    page.on('dialog', on_dialog)

    page.goto(BASE + 'index.html'); page.wait_for_timeout(400)
    page.evaluate("localStorage.setItem('cc.apiUrl','off'); localStorage.setItem('cc.local.v1', %s)" % json.dumps(json.dumps(SEED)))

    # ------------------------------------------------------------------ Staff Room
    step('Staff Room: sign in (offline test PIN) and open Marking')
    page.goto(BASE + 'teacher.html'); page.wait_for_timeout(600)
    page.fill('#pin', TEST_PIN); page.click('#gate-go'); page.wait_for_timeout(900)
    page.click('.tnav button[data-view=marking]'); page.wait_for_timeout(300)
    check(page.inner_text('#mk-ai-all').strip() == 'Mark all waiting', '#mk-ai-all label: ' + page.inner_text('#mk-ai-all'))
    def status_of(rid):
        return page.evaluate("(function(){var b=document.querySelector('#mk-list [data-mk=\"%s\"] .mk-st');return b?b.textContent:null})()" % rid)
    check(status_of('R-v2') == 'AI report ready · third examiner', 'R-v2 status ' + str(status_of('R-v2')))
    check(status_of('R-v1') == 'AI report ready', 'R-v1 status ' + str(status_of('R-v1')))
    check(status_of('R-wait') == 'waiting for the examiners', 'R-wait status ' + str(status_of('R-wait')))
    check(status_of('R-fail') == 'examiners could not mark (Mark again)', 'R-fail status ' + str(status_of('R-fail')))

    step('v2 report with a third examiner: panel table and form pre-filled from rep.ai')
    page.click('#mk-list [data-mk="R-v2"]'); page.wait_for_timeout(400)
    page.screenshot(path=os.path.join(SHOTS, 'panel-staff-room.png'), full_page=True)
    heads = page.evaluate("Array.from(document.querySelectorAll('#mk-detail .pn-table thead th')).map(function(x){return x.textContent})")
    check(heads == ['', 'Examiner A', 'Examiner B', 'Examiner C', 'Final'], 'panel heads ' + repr(heads))
    rows = page.evaluate("Array.from(document.querySelectorAll('#mk-detail .pn-table tbody tr')).map(function(tr){return Array.from(tr.children).map(function(c){return c.textContent})})")
    check(len(rows) == 5 and rows[0][0].startswith('TA') and rows[0][1:] == ['6.0', '7.0', '6.0', '6.0'] and rows[4][0] == 'Overall', 'panel rows ' + repr(rows))
    check(page.evaluate("document.querySelectorAll('#mk-detail .pn-table tr.pn-dis').length") == 2, 'two disagreed rows')
    how = page.inner_text('#mk-detail .pn-how')
    check(how == 'The examiners disagreed on TA and GRA, so a third examiner (a different model, model-c) marked the report. Each final band is the middle of the three.', 'how sentence: ' + how)
    check(page.query_selector('#mk-detail .pn-block #mk-aivis') is not None, '#mk-aivis inside the panel block')
    vals = page.evaluate("['ta','cc','lr','gra'].map(function(k){return document.querySelector('#mk-'+k).value})")
    check(vals == ['6', '6', '5.5', '5.5'], 'band selects ' + repr(vals))
    check(page.input_value('#mk-ta-met') == crit(6, 7, 'ta')['met'], 'ta met prefill')
    check(page.input_value('#mk-lr-tonext') == crit(5.5, 6, 'lr')['toNext'], 'lr toNext prefill')
    check(page.inner_text('#mk-next-lr') == '6' and page.inner_text('#mk-next-ta') == '7', 'To reach Band N labels')
    check(page.input_value('#mk-nextgate') == 'NEXTGATE: support every detail with a figure.', 'next gate prefill')
    check(XSS in page.input_value('#mk-comment'), 'comment prefill')
    check(page.evaluate("document.querySelectorAll('#mk-strengths [data-row]').length") == 2 and page.evaluate("document.querySelectorAll('#mk-errors [data-row]').length") == 3, 'strength / error rows')
    check(page.evaluate("document.querySelectorAll('#mk-detail img,#mk-detail [onerror]').length") == 0, 'teacher pane: no element from the examiner text')
    for sel in ['#mk-save', '#mk-release', '#mk-remark', '#mk-copyprompt', '#mk-chart', '#mk-overall', '#mk-cefr']:
        check(page.query_selector(sel) is not None, 'missing ' + sel)
    check(page.query_selector('#mk-unrelease') is None, 'no Withdraw before release')
    order = page.evaluate("(function(){var d=document.querySelector('#mk-detail');var a=d.innerHTML;return [a.indexOf('mk-chart'),a.indexOf('mpara'),a.indexOf('pn-table'),a.indexOf('mk-ta-met'),a.indexOf('The Ten Wards')]})()")
    check(order == sorted(order) and -1 not in order, 'detail order ' + repr(order))

    step('edit a band and the text; the re-read repaints the list but not the edited pane')
    page.select_option('#mk-gra', '6.5'); page.wait_for_timeout(100)
    check(page.is_visible('#mk-note-gra'), 'band changed note shown')
    check(page.inner_text('#mk-next-gra') == '7', 'next follows the select')
    page.fill('#mk-cc-tonext', 'EDITED to next')
    page.fill('#mk-comment', 'EDITED comment ' + XSS)
    page.fill('#mk-strengths [data-row][data-i="0"] [data-f="quote"]', XSS)
    page.click('[data-add="improvements"]'); page.wait_for_timeout(100)
    page.fill('#mk-improvements [data-row][data-i="2"] [data-f="point"]', 'NEW improvement')
    page.click('#mk-errors [data-rm][data-i="1"]'); page.wait_for_timeout(100)
    # the waiting report gets its AI report on the "server"
    page.evaluate("var d=JSON.parse(localStorage.getItem('cc.local.v1'));d.reports.forEach(function(r){if(r.id==='R-wait'){r.ai=%s;r.status='ai';}});localStorage.setItem('cc.local.v1',JSON.stringify(d));" % json.dumps(ai_v2('W', third=False)))
    page.wait_for_timeout(1500)
    check(status_of('R-wait') == 'AI report ready', 'after the re-read R-wait shows ' + str(status_of('R-wait')))
    check(page.input_value('#mk-cc-tonext') == 'EDITED to next' and page.input_value('#mk-gra') == '6.5', 'edited pane kept through the re-read')
    check(page.evaluate("document.querySelectorAll('#mk-improvements [data-row]').length") == 3, 'added improvement row kept')

    step('Return to student: markReport carries the section 3 shape with the edits')
    n0 = page.evaluate("window.__mk.length")
    page.click('#mk-release'); page.wait_for_timeout(500)
    calls = page.evaluate("window.__mk")
    check(len(calls) == n0 + 1, 'one markReport call')
    c = calls[-1]; m = c['m']; t = m.get('teacher') or {}
    check(c['id'] == 'R-v2' and m.get('released') is True and m.get('status') == 'released' and m.get('aiVisible') is False, 'mark flags ' + json.dumps({k: m.get(k) for k in ('released', 'status', 'aiVisible')}))
    check(set(t.keys()) == {'bands', 'cefr', 'comment', 'at', 'criteria', 'strengths', 'improvements', 'errors', 'nextGate', 'fromAi'}, 'teacher keys ' + repr(sorted(t.keys())))
    check(t.get('bands') == {'ta': 6, 'cc': 6, 'lr': 5.5, 'gra': 6.5, 'overall': 6}, 'bands ' + repr(t.get('bands')))
    check(t.get('cefr') == 'B2' and t.get('fromAi') is True, 'cefr / fromAi')
    cr = t.get('criteria') or {}
    check(sorted(cr.keys()) == ['cc', 'gra', 'lr', 'ta'] and all(set(cr[k].keys()) == {'band', 'met', 'notMet', 'toNext', 'next'} for k in cr), 'criteria shape ' + repr(cr)[:200])
    check(cr.get('gra', {}).get('band') == 6.5 and cr['gra']['next'] == 7 and cr['ta']['next'] == 7 and cr['lr']['next'] == 6, 'criteria bands / next')
    check(cr.get('cc', {}).get('toNext') == 'EDITED to next' and cr['ta']['met'] == crit(6, 7, 'ta')['met'], 'criteria text')
    check(t.get('comment') == 'EDITED comment ' + XSS, 'comment edit')
    check(len(t.get('strengths', [])) == 2 and t['strengths'][0] == {'point': 'A clear overview.', 'quote': XSS}, 'strengths ' + repr(t.get('strengths')))
    check(len(t.get('improvements', [])) == 3 and t['improvements'][2] == {'point': 'NEW improvement', 'quote': '', 'fix': ''}, 'improvements ' + repr(t.get('improvements')))
    check([e['quote'] for e in t.get('errors', [])] == ['It rised', 'the other two declined'] and set(t['errors'][0].keys()) == {'quote', 'tag', 'fix'}, 'errors ' + repr(t.get('errors')))
    check(t.get('nextGate') == 'NEXTGATE: support every detail with a figure.', 'nextGate')
    check(status_of('R-v2') is None, 'returned report leaves the queue')

    step('v1 report renders the old estimate block; Mark again asks first')
    page.click('#mk-list [data-mk="R-v1"]'); page.wait_for_timeout(400)
    summ = page.inner_text('#mk-detail details.disc summary')
    check('AI estimate' in summ and 'second pass 6.5' in summ and 'TA 5.5' in summ, 'v1 summary ' + summ)
    check(page.query_selector('#mk-detail .pn-table') is None and page.query_selector('#mk-aivis') is not None, 'v1: no panel table, #mk-aivis kept')
    check(page.input_value('#mk-ta') == '5.5' and page.input_value('#mk-ta-met') == '' and page.input_value('#mk-comment') == 'V1-COMMENT', 'v1 prefill')
    nd = len(dialogs)
    page.click('#mk-remark'); page.wait_for_timeout(500)
    check(len(dialogs) == nd + 1 and dialogs[-1][0] == 'confirm', 'Mark again confirms first')
    last = page.evaluate("window.__mk[window.__mk.length-1]")
    check(last == {'id': 'R-v1', 'm': {'requestAi': True}}, 'Mark again call ' + repr(last))
    check(status_of('R-v1') == 'waiting for the examiners', 'R-v1 after Mark again: ' + str(status_of('R-v1')))

    step('release with empty criterion text (only the four bands)')
    page.click('#mk-list [data-mk="R-fail"]'); page.wait_for_timeout(300)
    for k, v in (('ta', '5'), ('cc', '5'), ('lr', '5'), ('gra', '5')): page.select_option('#mk-' + k, v)
    page.click('#mk-release'); page.wait_for_timeout(400)
    last = page.evaluate("window.__mk[window.__mk.length-1]")
    check(last['id'] == 'R-fail' and last['m']['released'] is True and last['m']['teacher']['criteria']['ta']['met'] == '' and last['m']['teacher']['fromAi'] is False, 'empty-text release ' + json.dumps(last)[:200])

    step('released report: Withdraw shown, Mark again gone, form from rep.teacher; CSV export')
    page.click('[data-mf="released"]'); page.wait_for_timeout(300)
    page.click('#mk-list [data-mk="R-v2"]'); page.wait_for_timeout(300)
    check(page.query_selector('#mk-unrelease') is not None and page.query_selector('#mk-remark') is None, 'released buttons')
    check(page.input_value('#mk-gra') == '6.5' and page.input_value('#mk-cc-tonext') == 'EDITED to next', 'prefill from rep.teacher')
    check(status_of('R-v2') == 'returned' and status_of('R-old') == 'returned', 'returned status')
    page.evaluate("window.__csv=null;window.URL.createObjectURL=function(b){b.text().then(function(t){window.__csv=t;});return 'blob:x';};HTMLAnchorElement.prototype.click=function(){};")
    page.click('#t-csv'); page.wait_for_timeout(400)
    csv = page.evaluate("window.__csv") or ''
    check('R-v2' in csv and 'EDITED comment' in csv, 'CSV export')
    check(not any(d[0] == 'alert' for d in dialogs), 'no alert dialog')

    # ------------------------------------------------------------------ Report Card
    step('Report Card at 390 px: the released v2 mark')
    page.set_viewport_size({'width': 390, 'height': 820})
    page.goto(BASE + 'index.html'); page.wait_for_timeout(600)
    page.click('#tab-m41'); page.wait_for_timeout(150)
    val = page.evaluate("Array.from(document.querySelectorAll('#f-pick option')).filter(function(o){return o.dataset.name==='Proud'})[0].value")
    page.select_option('#f-pick', val); page.fill('#f-pw', TEST_PIN); page.click('#btn-go')
    page.wait_for_selector('#screen-app:not(.hidden)', timeout=8000); page.wait_for_timeout(600)
    page.evaluate("window.PCHost.show('record')"); page.wait_for_timeout(800)
    page.wait_for_selector('#rec-list [data-r="R-v2"]', timeout=5000)
    page.click('#rec-list [data-r="R-v2"]'); page.wait_for_timeout(500)
    vr = page.inner_text('#view-record')
    check(page.evaluate("document.querySelectorAll('#view-record .fb-crit').length") == 4, 'four criterion cards')
    for s in ['Task Achievement', 'Grammatical Range and Accuracy', 'What you did', 'Why not Band 7 yet', 'To reach Band 7', 'To reach Band 6', 'EDITED to next', 'Your strengths', 'To improve', 'A clear overview.', 'NEW improvement', 'Try: Both the Art Gallery', 'It rised', 'NEXTGATE', 'EDITED comment ' + XSS, 'Marked by T.Chris']:
        check(s in vr, 'Report Card text missing: ' + s)
    check('AI-SECRET' not in vr, 'released mark shows rep.teacher, not rep.ai')
    check(page.evaluate("document.querySelectorAll('#view-record .err').length") == 2, 'quoted errors')
    check(page.evaluate("document.querySelectorAll('#view-record img[src=\"x\"],#view-record [onerror]').length") == 0, 'student pane: no element from the comment or quote')
    for sel in ['#rp-back', '#rp-model', '#rp-copy', '#rp-again']:
        check(page.query_selector(sel) is not None, 'missing ' + sel)
    ov = page.evaluate("document.documentElement.scrollWidth - document.documentElement.clientWidth")
    check(ov <= 0, 'sideways overflow at 390 px: %s' % ov)
    page.screenshot(path=os.path.join(SHOTS, 'panel-report-card.png'), full_page=True)

    step('Report Card: rep.ai hidden when aiVisible is off; an old teacher mark as before')
    page.click('#rp-back'); page.wait_for_timeout(800)
    page.wait_for_selector('#rec-list [data-r="R-hidden"]', timeout=5000)
    page.click('#rec-list [data-r="R-hidden"]'); page.wait_for_timeout(400)
    vr = page.inner_text('#view-record')
    check('AI-SECRET' not in vr and 'NEXTGATE' not in vr and 'MET-ta' not in vr and page.query_selector('#view-record .fb-crit') is None, 'hidden rep.ai leaked')
    check('has not released a mark' in vr, 'unreleased note')
    page.click('#rp-back'); page.wait_for_timeout(800)
    page.wait_for_selector('#rec-list [data-r="R-old"]', timeout=5000)
    page.click('#rec-list [data-r="R-old"]'); page.wait_for_timeout(400)
    vr = page.inner_text('#view-record')
    check('OLD-TEACHER-COMMENT' in vr and page.query_selector('#view-record .fb-crit') is None, 'old teacher mark render')
    ov = page.evaluate("document.documentElement.scrollWidth - document.documentElement.clientWidth")
    check(ov <= 0, 'sideways overflow (old mark): %s' % ov)
    check(not any(d[0] == 'alert' for d in dialogs), 'no alert dialog')
    b.close()

httpd.shutdown()
errs = [e for e in errors if 'favicon' not in e and 'Failed to load resource' not in e]
print('console/page errors:', len(errs))
for e in errs[:20]: print('  !', e)
print('failed checks:', len(fails))
sys.exit(1 if errs or fails else 0)
