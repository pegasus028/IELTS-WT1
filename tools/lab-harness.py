#!/usr/bin/env python3
"""Serves the repo with a stand-alone page that mounts the Spellbook Workshop
(lab.js) and My Spellbook (template.js) with a minimal PCHost, so they can be
tested before (and independently of) student.js.

  python3 tools/lab-harness.py            serve on http://127.0.0.1:8777/__lab.html
  (imported by tools/lab-smoke.py)

The page takes the <style> blocks of index.html, theme.css and lab.css, loads
the app scripts in the order of QUILLMOOR-T1-SPEC.md (skipping any that do not
exist yet) and sets cc.apiUrl = 'off' unless ?cloud=<url> is given.
"""
import os, re, sys, http.server, socketserver, functools, threading

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
ORDER = ['roster.js', 'content.js', 'partners.js', 'prompts.js', 'prompts-2.js', 'prompts-3.js', 'template.js', 'lab-content.js', 'lab-examples.js',
         'lab-scenario.js', 'models.js', 'models-2.js', 'mocks.js'] + ['topic-%02d.js' % i for i in range(15)] + ['media.js', 'charts.js', 'writer.js', 'bootcamp.js', 'engine.js', 'api.js', 'lab.js']


def page():
    idx = open(os.path.join(ROOT, 'index.html'), encoding='utf-8').read()
    styles = '\n'.join(re.findall(r'<style>.*?</style>', idx, re.S))
    links = ''.join('<link rel="stylesheet" href="%s">' % f for f in ('theme.css', 'lab.css', 'story.css') if os.path.exists(os.path.join(ROOT, f)))
    scripts = ''.join('<script src="%s"></script>\n' % f for f in ORDER if os.path.exists(os.path.join(ROOT, f)))
    return """<!doctype html><html lang="en-GB"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Spellbook Workshop harness</title>%s%s
<style>.harness-nav{display:flex;gap:8px;flex-wrap:wrap;margin:10px 0}.harness-nav button{font:inherit}</style>
<script>
(function(){var q=location.search.match(/cloud=([^&]+)/);try{localStorage.setItem('cc.apiUrl', q?decodeURIComponent(q[1]):'off');if(q)localStorage.setItem('cc.token','tok123');}catch(e){}})();
</script></head><body>
<header class="bar"><div class="bar-in"><div class="bar-id"><span class="bar-name" id="hdr-name">Harness</span> <span class="bar-rank" id="hdr-xp">0 Merits</span></div></div></header>
<main class="main" style="max-width:1080px;margin:0 auto;padding:12px 16px 60px">
<nav class="harness-nav filters"><button data-v="lab" class="on">Spellbook Workshop</button><button data-v="template">My Spellbook</button></nav>
<section id="view-lab"></section><section id="view-template" class="hidden"></section>
</main><div id="toast-slot"></div><div id="modal-slot"></div>
%s
<script>
(function(){
  var E = window.Engine, p = E && E.Progress ? E.Progress.blank('smoke-1', 'Smoke') : { studentId: 'smoke-1', displayName: 'Smoke', xp: 0, badges: [] };
  p.cohort = 'M4.1';
  window.__toasts = []; window.__opened = []; window.__celebrated = [];
  function show(v) {
    document.querySelectorAll('.harness-nav button').forEach(function (b) { b.classList.toggle('on', b.dataset.v === v); });
    ['lab', 'template'].forEach(function (x) { document.getElementById('view-' + x).classList.toggle('hidden', x !== v); });
    if (v !== 'lab' && window.Lab) Lab.leave();
    if (v === 'lab') Lab.mount(document.getElementById('view-lab'), window.PCHost);
    if (v === 'template') Template.mount(document.getElementById('view-template'), window.PCHost);
  }
  window.PCHost = {
    get p() { return p; },
    toast: function (m) { window.__toasts.push(m); var s = document.getElementById('toast-slot'); s.innerHTML = '<div class="toast">' + m.replace(/</g, '&lt;') + '</div>'; clearTimeout(window.__tt); window.__tt = setTimeout(function () { s.innerHTML = ''; }, 2500); },
    modal: function (html) { document.getElementById('modal-slot').innerHTML = '<div class="modal-back"><div class="modal card">' + html + '</div></div>'; var c = document.querySelector('#modal-slot [data-close]'); if (c) c.addEventListener('click', function () { document.getElementById('modal-slot').innerHTML = ''; }); },
    sync: function () {}, syncSoon: function () {},
    celebrate: function (b, rest) { window.__celebrated.push(b.id); (rest || []).forEach(function (x) { window.__celebrated.push(x.id); }); },
    paintHeader: function () { document.getElementById('hdr-xp').textContent = (p.xp || 0) + ' Merits'; },
    show: show,
    openWriter: function (promptId, text) { window.__opened.push({ promptId: promptId, text: text }); }
  };
  document.querySelectorAll('.harness-nav button').forEach(function (b) { b.addEventListener('click', function () { show(b.dataset.v); }); });
  window.__show = show;
  show(location.hash === '#template' ? 'template' : 'lab');
})();
</script></body></html>""" % (styles, links, scripts)


class Handler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a): pass
    def do_GET(self):
        if self.path.split('?')[0] == '/__lab.html':
            body = page().encode('utf-8')
            self.send_response(200); self.send_header('Content-Type', 'text/html; charset=utf-8'); self.send_header('Content-Length', str(len(body))); self.end_headers()
            self.wfile.write(body); return
        return super().do_GET()


def serve(port=8777):
    socketserver.TCPServer.allow_reuse_address = True
    httpd = socketserver.TCPServer(('127.0.0.1', port), functools.partial(Handler, directory=ROOT))
    threading.Thread(target=httpd.serve_forever, daemon=True).start()
    return httpd, 'http://127.0.0.1:%d/__lab.html' % port


if __name__ == '__main__':
    httpd, url = serve(int(sys.argv[1]) if len(sys.argv) > 1 else 8777)
    print('Serving', url)
    try:
        threading.Event().wait()
    except KeyboardInterrupt:
        pass
