#!/usr/bin/env python3
"""End-to-end test of the Spellbook Workshop and My Spellbook (Playwright + Chromium).

  python3 tools/lab-smoke.py           offline (cc.apiUrl = 'off'): quick checks + data checks
  python3 tools/lab-smoke.py --mock    cloud mode against a mocked Apps Script answering lab.*

Runs on the stand-alone harness page (tools/lab-harness.py), so it does not depend
on student.js. Designs a TREND page line by line, saves it, casts it on the
museums line graph (a wrong year and a wrong figure first: the data check must
mark them, then the fixes must pass), assembles the report, checks the Ten Wards
and the data-check table, opens the Spellbook record, the Examples tab and My
Spellbook (all three fade levels and the memory check), times a 1-minute card
out, then repeats the main screens at 390 px phone width and checks that nothing
overflows sideways. Screenshots: tools/shots/lab-*.png
"""
import os, sys, json, importlib.util
from playwright.sync_api import sync_playwright

HERE = os.path.dirname(os.path.abspath(__file__))
spec = importlib.util.spec_from_file_location('lab_harness', os.path.join(HERE, 'lab-harness.py'))
H = importlib.util.module_from_spec(spec); spec.loader.exec_module(H)
SHOTS = os.path.join(HERE, 'shots'); os.makedirs(SHOTS, exist_ok=True)
MOCK = '--mock' in sys.argv
MOCK_URL = 'https://mock.lab.test/exec'

LINES = [
    'This [Visual] sets out [What It Shows].',
    'Its time frame stretches from [First Year] to [Last Year].',
    'Overall, [Group A] [Trend A] across the years shown.',
    '[Group B], however, [Trend B].',
    'A further point is that [Key Feature].',
    '[Group A] started out at [Start Figure A] in [First Year].',
    'Later, it [Trend A] to [End Figure A].',
    '[Group B] opened with [Start Figure B].',
    'Afterwards, these [Trend B] to [End Figure B].',
]
VALUES = {
    'Visual': ('line graph', ''), 'What It Shows': ('how many people, in thousands, visited three museums in one European city each year', ''),
    'First Year': ('2010', ''), 'Last Year': ('2020', ''), 'Group A': ('the Science Museum', ''),
    'Group B': ('the Art Gallery and the History Museum', ''), 'Trend A': ('climbed steadily throughout the period', 'rose'), 'Trend B': ('declined gradually over the whole period', 'fell'),
    'Key Feature': ('the Science Museum overtook the Art Gallery in 2014 and stayed the most visited museum until the end, while the History Museum remained the least visited throughout', ''),
    'Start Figure A': ('420 thousand, well below the Art Gallery', ''), 'End Figure A': ('760 thousand in 2020, almost double its starting figure', ''),
    'Start Figure B': ('610 thousand and 380 thousand respectively, so the Art Gallery led at first', ''), 'End Figure B': ('520 thousand and 260 thousand respectively, the lowest figures for both', ''),
}
FIRST_TRY = {'First Year': ('2009', 'bad'), 'Start Figure A': ('610 thousand', 'bad')}

errors = []
def shot(page, name): page.screenshot(path=os.path.join(SHOTS, 'lab-' + name + '.png'), full_page=True)
def step(msg): print('·', msg, flush=True)
def check(cond, msg):
    if not cond: errors.append(msg); print('  ✕', msg, flush=True)

def mock_handler(route):
    req = route.request
    try: body = json.loads(req.post_data or '{}')
    except Exception: body = {}
    a, p = body.get('action'), body.get('payload') or {}
    out = {'ok': True}
    if a == 'lab.status': out.update({'ai': True})
    elif a == 'lab.list': out.update({'templates': [], 'attempts': []})
    elif a == 'lab.coach':
        if p.get('token') != 'tok123': out = {'ok': False, 'error': 'token missing'}
        elif p.get('kind') == 'frame':
            out['coach'] = {'errors': [], 'fn': {'verdict': 'meets', 'comment': 'The line does its job.'}, 'generic': {'ok': True, 'note': ''}, 'slotForm': '', 'cefr': 'B2', 'band': 6.5, 'praise': 'Clear.', 'tip': 'Keep it short.'}
        else:
            assert p.get('prompt', {}).get('data'), 'chart data missing on lab.coach'
            out['coach'] = {'errors': [], 'fn': {'verdict': 'meets', 'comment': 'Accurate.'}, 'accuracy': {'ok': True, 'note': ''}, 'fit': {'ok': True, 'note': ''}, 'cefr': 'B2', 'band': 6.5, 'praise': 'Good.', 'tip': 'Next.'}
    elif a == 'lab.rate':
        out['rating'] = {'ta': 7, 'cc': 7, 'lr': 6, 'gra': 7, 'overall': 7, 'cefr': 'C1', 'summary': 'Mock rating.', 'ceilings': [], 'strengths': ['a', 'b'], 'priorities': [{'crit': 'LR', 'text': 'More precise verbs.'}], 'frameNote': 'Fine.'}
    route.fulfill(status=200, content_type='application/json', body=json.dumps(out))

def no_overflow(page, where):
    w = page.evaluate('[document.documentElement.scrollWidth, window.innerWidth]')
    check(w[0] <= w[1] + 1, '%s: page is %dpx wide at a %dpx screen (sideways scroll)' % (where, w[0], w[1]))

def run():
    httpd, url = H.serve(8790)
    if MOCK: url += '?cloud=' + MOCK_URL
    with sync_playwright() as pw:
        exe = os.environ.get('CHROME') or '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'
        b = pw.chromium.launch(executable_path=exe if os.path.exists(exe) else None)
        page = b.new_page(viewport={'width': 1200, 'height': 900})
        cons = []
        page.on('console', lambda m: cons.append(m.text + ' @ ' + str((m.location or {}).get('url', ''))) if m.type == 'error' else None)
        page.on('pageerror', lambda e: cons.append(str(e)))
        page.on('response', lambda r: cons.append('404 ' + r.url) if r.status == 404 else None)
        if MOCK: page.route(MOCK_URL + '*', mock_handler)
        page.goto(url); page.wait_for_selector('#lab-new')
        page.evaluate('localStorage.removeItem("cc.lab.v1.smoke-1")')
        page.reload(); page.wait_for_selector('#lab-new')
        shot(page, 'home')

        step('Design: a TREND page at 40%')
        page.click('#lab-new'); page.click('[data-md=TREND]')
        page.click('label.lab-pct:has(input[value="40"])'); page.click('[data-lv=B2]'); page.click('[data-st=blank]')
        shot(page, 'setup')
        page.click('#lab-startbuild')
        advanced = 0
        for i, line in enumerate(LINES):
            page.wait_for_selector('#lab-line')
            page.fill('#lab-line', line)
            if not MOCK: check(page.inner_text('#lab-coach').startswith('Check line'), 'offline: the coach button reads "Check line" (got %s)' % page.inner_text('#lab-coach'))
            page.click('#lab-coach')
            page.wait_for_selector('#lab-fb .lab-fb:not(.bad)', timeout=15000)
            fb = page.inner_text('#lab-fb')
            check('Fix this first' not in fb, 'line %d blocked: %s' % (i + 1, fb[:200]))
            if i == 2: shot(page, 'build-line3')
            if i < len(LINES) - 1:
                # WP23: offline, a clean line has already moved on ("Check line →"); otherwise press Next
                if page.evaluate('Lab._state.build.idx') == i: page.click('#lab-next')
                else: advanced += 1
            else: page.click('#lab-finishbp')
        if not MOCK: check(advanced >= 1, 'offline: at least one clean line moved on in one click (advanced %d)' % advanced)
        page.wait_for_selector('#lab-save')
        page.click('#lab-dchart'); page.wait_for_timeout(200)
        shot(page, 'summary')
        check(page.locator('#lab-drivefull .preflight').count() == 1, 'test drive shows the Ten Wards')
        page.click('#lab-save'); page.wait_for_timeout(300)
        check(page.evaluate('Lab.designed(PCHost.p, "TREND")'), 'Lab.designed(p, "TREND") is true after saving')
        check(not page.evaluate('Lab.designed(PCHost.p, "SPACE")'), 'Lab.designed(p, "SPACE") stays false')
        check('lab-first' in page.evaluate('PCHost.p.badges'), 'keepsake lab-first awarded')
        frames = page.evaluate('Template.framesFor(PCHost.p, "TREND")')
        check(frames and len(frames['paragraphs']) == 4 and len(frames['slots']) == 13, 'Template.framesFor returns 4 paragraphs and 13 slots')
        filled = page.evaluate('Template.fill(Template.framesFor(PCHost.p, "TREND"), {visual: "line graph", y1: "2010"})')
        check('This line graph sets out' in filled and '[What It Shows]' in filled, 'Template.fill fills given slots and labels the rest')

        step('Cast it on a chart: museums')
        page.click('#lab-suse'); page.wait_for_selector('[data-pp="p-line-museums"]')
        shot(page, 'cast-home')
        page.click('[data-pp="p-line-museums"]')
        n = 0
        while True:
            page.wait_for_selector('#lab-val')
            label = page.inner_text('.lab-comp h3').strip()
            val, val2 = VALUES[label]
            if label in FIRST_TRY:
                wrong, want = FIRST_TRY[label]
                page.fill('#lab-val', wrong); page.click('#lab-vcheck')
                page.wait_for_selector('#lab-fb .lab-data', timeout=15000)
                cls = page.get_attribute('#lab-fb .lab-data', 'class')
                check(want in cls, '%s "%s" should be marked %s, got %s' % (label, wrong, want, cls))
                if label == 'Start Figure A': shot(page, 'cast-near')
                page.click('#lab-vretry'); page.wait_for_selector('#lab-val')
            page.fill('#lab-val', val)
            if val2 and page.locator('#lab-val2').count(): page.fill('#lab-val2', val2)
            page.click('#lab-vcheck')
            page.wait_for_selector('#lab-fb .lab-data', timeout=15000)
            cls = page.get_attribute('#lab-fb .lab-data', 'class')
            check(' ok' in ' ' + cls, '%s "%s" should be true to the chart, got %s: %s' % (label, val, cls, page.inner_text('#lab-fb .lab-data')[:160]))
            n += 1
            if n == 6: shot(page, 'cast-card')
            if page.locator('#lab-vnext').count(): page.click('#lab-vnext')
            else: page.click('#lab-vfinish'); break
        page.wait_for_selector('.lab-acc', timeout=20000)
        shot(page, 'cast-report')
        acc = page.inner_text('.lab-acc .pill')
        check('13 of 13' in acc.lower(), 'data check table: %s' % acc)
        wards = page.inner_text('.lab-wards .pill')
        check('red' not in wards.lower(), 'Ten Wards on the cast report: %s' % wards)
        if MOCK: check(page.locator('.lab-rating').count() == 1, 'mock rating shown')
        page.click('#lab-writer')
        check(page.evaluate('window.__opened.length') == 1 and page.evaluate('window.__opened[0].promptId') == 'p-line-museums', 'Open in the Scriptorium calls host.openWriter(promptId, text)')
        model = page.locator('#lab-modelbox')
        check(model.count() == 1, 'Compare with the model offered (museums has a model)')
        page.click('#lab-again')

        step('1 minute per variable: the card checks itself at 0:00')
        page.click('label.lab-timing:has(input[value="1min"])')
        page.click('[data-pp="p-line-internet"]'); page.wait_for_selector('#lab-rstart')
        check(page.locator('#lab-val').count() == 0, 'timed cast: no card before Start (chart study is free)')
        page.click('#lab-rstart'); page.wait_for_selector('#lab-val')
        page.fill('#lab-val', 'line graph')
        page.evaluate('Lab._state.run.cardElapsed = 59.5')
        page.wait_for_selector('#lab-fb .lab-data', timeout=8000)
        check(page.locator('#lab-vretry').count() == 0, 'no retry after a timed-out card')
        page.click('#lab-rquit')

        step('Spellbook record')
        page.click('[data-ltab=score]'); page.wait_for_timeout(200)
        shot(page, 'record')
        check('TREND' in page.inner_text('#lab-body'), 'record lists TREND')

        step('Examples')
        page.click('[data-ltab=examples]'); page.wait_for_timeout(200)
        for st in ('nam', 'fah'):
            page.click('[data-exst=%s]' % st)
            for mode in ('TREND', 'COMPARE', 'SEQUENCE', 'SPACE'):
                page.click('[data-exmode=%s]' % mode); page.wait_for_timeout(120)
                check(page.locator('#lab-body .lab-data.bad, #lab-body .lab-data.near').count() == 0, 'example %s %s: every variable true to the chart' % (st, mode))
                check(page.locator('.lab-wards .pf-row.bad').count() == 0, 'example %s %s: no red rows' % (st, mode))
                if (st, mode) in (('nam', 'TREND'), ('fah', 'SPACE')): shot(page, 'examples-%s-%s' % (st, mode.lower()))

        step('My Spellbook')
        page.evaluate('__show("template")'); page.wait_for_selector('.tpl-page')
        shot(page, 'spellbook-guided')
        page.click('[data-fade=skeleton]'); shot(page, 'spellbook-skeleton')
        page.click('[data-fade=exam]')
        page.fill('#tpl-rc-TREND', ' '.join(l for l in LINES))
        page.click('[data-rcheck=TREND]')
        rs = page.inner_text('#tpl-rs-TREND')
        check(rs.startswith('100%'), 'memory check of the whole page: %s' % rs)
        shot(page, 'spellbook-exam')
        page.click('[data-fade=guided]')

        step('Phone width (390 px)')
        page.set_viewport_size({'width': 390, 'height': 844})
        page.evaluate('__show("template")'); page.wait_for_timeout(200); no_overflow(page, 'My Spellbook'); shot(page, 'phone-spellbook')
        page.evaluate('__show("lab")'); page.wait_for_timeout(200)
        page.click('[data-ltab=studio]'); page.wait_for_timeout(150); no_overflow(page, 'Design home'); shot(page, 'phone-home')
        page.click('[data-topen]'); page.wait_for_timeout(200); no_overflow(page, 'page summary'); shot(page, 'phone-summary')
        page.click('#lab-shome'); page.click('[data-tver]'); page.wait_for_selector('#lab-line'); no_overflow(page, 'line builder'); shot(page, 'phone-build')
        page.click('#lab-bhome')
        page.click('[data-ltab=assembly]'); page.wait_for_timeout(150); no_overflow(page, 'cast home')
        page.click('label.lab-timing:has(input[value="none"])')
        page.click('[data-pp="p-bar-tourists"]'); page.wait_for_selector('#lab-val'); page.wait_for_timeout(150)
        no_overflow(page, 'cast card'); shot(page, 'phone-cast')
        page.click('#lab-rquit')
        page.click('[data-ltab=score]'); page.wait_for_timeout(150); no_overflow(page, 'record'); shot(page, 'phone-record')
        page.click('[data-rev]'); page.wait_for_timeout(200); no_overflow(page, 'cast report'); shot(page, 'phone-report')
        page.click('[data-ltab=examples]'); page.wait_for_timeout(150); no_overflow(page, 'examples'); shot(page, 'phone-examples')

        cons = [c for c in cons if 'favicon' not in c]
        check(not cons, 'console errors: %s' % cons[:5])
        b.close()
    httpd.shutdown()

run()
print('\n' + ('✓ Spellbook Workshop smoke test passed' if not errors else '✕ %d problem(s)' % len(errors)) + (' (mock cloud)' if MOCK else ' (offline)'))
print('Screenshots in', SHOTS)
sys.exit(1 if errors else 0)
