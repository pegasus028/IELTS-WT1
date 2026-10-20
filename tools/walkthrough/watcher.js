/* Auto-start watcher for the live page: polls for a signed-in persona id with stored data, then evals the bot and runs the plan. */
(function(){
  if (window.__qbWatch) return 'already';
  function b64d(s){ return decodeURIComponent(Array.prototype.map.call(atob(s), function(c){ return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2); }).join('')); }
  window.__qbWatch = setInterval(function(){
    try {
      var p = window.PCHost && window.PCHost.p; if (!p || !p.studentId) return;
      var lv = String(p.studentId).toLowerCase().replace('-student','');
      var data = localStorage.getItem('qb.data-' + lv), code = localStorage.getItem('qb.bundle');
      if (!data || !code) return;
      clearInterval(window.__qbWatch); window.__qbWatch = null;
      (0, eval)(b64d(code));
      var d = JSON.parse(b64d(data));
      QB.init(d); QB.plan = QB.buildPlan('all'); QB.logLine('LIVE run start ' + p.studentId + ' plan ' + QB.plan.length + ' steps');
      QB.run().catch(function(e){ console.error('QB error', e); });
    } catch (e) { console.error('watcher', e); }
  }, 1500);
  return 'armed';
})();
