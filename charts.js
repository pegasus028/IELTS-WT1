/* ===========================================================================
   CHART CONTROL — charts.js
   Dependency-free SVG renderers for the prompt bank: line, bar, pie, table,
   process, map and mixed. Every chart is drawn from the data in prompts.js,
   so it prints, projects, re-colours itself in dark mode and can be read back
   value by value (tap a mark → readout) by the Writer.

   Charts.render(host, promptOrChart, opts)   draws into a DOM element
     opts.onPick(text)   called when a student taps a value (Writer planning strip)
     opts.compact        smaller height for question cards
   Charts.describe(prompt)   plain-text data summary for the AI marker / alt text
   =========================================================================== */
(function (global) {
  'use strict';

  /* Validated categorical palette (light / dark), fixed order, never cycled. */
  var LIGHT = ['#2a78d6', '#eb6834', '#1baf7a', '#eda100', '#e87ba4', '#008300', '#4a3aa7', '#e34948'];
  var DARK = ['#3987e5', '#d95926', '#199e70', '#c98500', '#d55181', '#008300', '#9085e9', '#e66767'];
  var KIND_FILL = {
    building: { l: '#c9d3e6', d: '#3a4560' }, housing: { l: '#f2d0a8', d: '#7a5a34' },
    shop: { l: '#f7c9d9', d: '#7a3e56' }, green: { l: '#bfe3b4', d: '#2f5a2a' },
    water: { l: '#b9d9f2', d: '#274b6b' }, road: { l: '#9aa3b2', d: '#6b7382' },
    open: { l: '#ece6cf', d: '#5a5440' }, industry: { l: '#d9c4e8', d: '#4f3a66' },
    leisure: { l: '#ffe3a3', d: '#7a5f1e' }
  };

  function isDark() {
    var t = document.documentElement.getAttribute('data-theme');
    if (t === 'dark') return true;
    if (t === 'light') return false;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  function pal() { return isDark() ? DARK : LIGHT; }
  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function fmt(v) {
    if (v == null || v === '') return '';
    if (typeof v !== 'number') return String(v);
    if (Math.abs(v) >= 1000) return v.toLocaleString('en-US');
    return String(Math.round(v * 100) / 100);
  }
  function niceMax(m) {
    if (m <= 0) return 1;
    var p = Math.pow(10, Math.floor(Math.log10(m)));
    var f = m / p;
    var n = f <= 1 ? 1 : f <= 2 ? 2 : f <= 2.5 ? 2.5 : f <= 5 ? 5 : 10;
    return n * p;
  }
  function ticks(max, n) {
    var out = [], step = max / n;
    for (var i = 0; i <= n; i++) out.push(Math.round(step * i * 1000) / 1000);
    return out;
  }
  function svgOpen(w, h, cls) {
    return '<svg class="cc-chart ' + (cls || '') + '" viewBox="0 0 ' + w + ' ' + h + '" role="img" preserveAspectRatio="xMidYMid meet">';
  }

  /* ------------------------------------------------------------- legend */
  function legend(names, colors, x, y, w) {
    var html = '<g class="legend" transform="translate(' + x + ',' + y + ')">';
    var cx = 0, row = 0, perRow = 0;
    names.forEach(function (n, i) {
      var wEst = 22 + n.length * 6.6;
      if (cx + wEst > w && perRow > 0) { row++; cx = 0; perRow = 0; }
      html += '<g transform="translate(' + cx + ',' + (row * 18) + ')">' +
        '<rect x="0" y="-8" width="12" height="12" rx="3" fill="' + colors[i] + '"/>' +
        '<text x="17" y="2" class="lg">' + esc(n) + '</text></g>';
      cx += wEst; perRow++;
    });
    return { html: html + '</g>', rows: row + 1 };
  }

  /* ---------------------------------------------------------------- line */
  function lineChart(p, d, opts) {
    var colors = pal();
    var W = 640, H = opts.compact ? 300 : 360, padL = 58, padR = 24, padT = 16, padB = 44;
    var names = d.series.map(function (s) { return s.name; });
    var lg = legend(names, colors, padL, H - 8, W - padL - padR);
    H += (lg.rows - 1) * 18;
    var plotW = W - padL - padR, plotH = H - padT - padB - (lg.rows - 1) * 18;
    var allV = []; d.series.forEach(function (s) { allV = allV.concat(s.values); });
    var vmax = niceMax(Math.max.apply(null, allV) * 1.08), vmin = 0;
    var mn = Math.min.apply(null, allV); if (mn < 0) vmin = -niceMax(-mn);
    var xs = d.x;
    function X(i) { return padL + (xs.length === 1 ? plotW / 2 : plotW * i / (xs.length - 1)); }
    function Y(v) { return padT + plotH - (v - vmin) / (vmax - vmin) * plotH; }
    var html = svgOpen(W, H, 'line');
    ticks(vmax - vmin, 5).forEach(function (t) {
      var v = vmin + t, y = Y(v);
      html += '<line x1="' + padL + '" x2="' + (W - padR) + '" y1="' + y + '" y2="' + y + '" class="grid"/>' +
        '<text x="' + (padL - 8) + '" y="' + (y + 4) + '" class="ax" text-anchor="end">' + fmt(v) + '</text>';
    });
    xs.forEach(function (x, i) {
      html += '<text x="' + X(i) + '" y="' + (padT + plotH + 18) + '" class="ax" text-anchor="middle">' + esc(x) + '</text>';
    });
    if (p.units) html += '<text x="' + padL + '" y="' + (padT - 4) + '" class="unit">' + esc(p.units) + '</text>';
    var projIdx = d.projectedFrom != null ? xs.indexOf(d.projectedFrom) : -1;
    if (projIdx >= 0) {
      html += '<rect x="' + X(projIdx) + '" y="' + padT + '" width="' + (W - padR - X(projIdx)) + '" height="' + plotH + '" class="proj"/>' +
        '<text x="' + (X(projIdx) + 6) + '" y="' + (padT + 12) + '" class="unit">projected</text>';
    }
    d.series.forEach(function (s, si) {
      var c = colors[si % colors.length];
      var solid = '', dashed = '';
      s.values.forEach(function (v, i) {
        var pt = (i ? 'L' : 'M') + X(i) + ' ' + Y(v);
        if (projIdx >= 0 && i >= projIdx) { dashed += (dashed ? 'L' : 'M') + X(i) + ' ' + Y(v); }
        if (projIdx < 0 || i <= projIdx) solid += pt;
      });
      html += '<path d="' + solid + '" fill="none" stroke="' + c + '" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>';
      if (dashed) html += '<path d="' + dashed + '" fill="none" stroke="' + c + '" stroke-width="2.5" stroke-dasharray="6 5" stroke-linecap="round"/>';
      s.values.forEach(function (v, i) {
        html += '<circle cx="' + X(i) + '" cy="' + Y(v) + '" r="4.5" fill="' + c + '" class="mark" data-pick="' + esc(s.name + ' · ' + xs[i] + ': ' + fmt(v) + (p.units ? ' ' + p.units : '')) + '"><title>' + esc(s.name + ', ' + xs[i] + ': ' + fmt(v)) + '</title></circle>';
      });
      /* direct label at the line end */
      var last = s.values.length - 1;
      html += '<text x="' + (X(last) + 8) + '" y="' + (Y(s.values[last]) + 4) + '" class="dl" fill="' + c + '">' + esc(fmt(s.values[last])) + '</text>';
    });
    html += lg.html + '</svg>';
    return html;
  }

  /* ----------------------------------------------------------------- bar */
  function barChart(p, d, opts) {
    var colors = pal();
    var W = 640, H = opts.compact ? 300 : 360, padL = 58, padR = 24, padT = 16, padB = 44;
    var names = d.series.map(function (s) { return s.name; });
    var multi = d.series.length > 1;
    var lg = multi ? legend(names, colors, padL, H - 8, W - padL - padR) : { html: '', rows: 1 };
    if (multi) H += (lg.rows - 1) * 18;
    var plotW = W - padL - padR, plotH = H - padT - padB - (multi ? (lg.rows - 1) * 18 : 0);
    var allV = []; d.series.forEach(function (s) { allV = allV.concat(s.values); });
    var vmax = niceMax(Math.max.apply(null, allV) * 1.08);
    var cats = d.categories, n = cats.length, ns = d.series.length;
    var group = plotW / n, inner = group * 0.72, bw = (inner - (ns - 1) * 3) / ns;
    function Y(v) { return padT + plotH - v / vmax * plotH; }
    var html = svgOpen(W, H, 'bar');
    ticks(vmax, 5).forEach(function (v) {
      var y = Y(v);
      html += '<line x1="' + padL + '" x2="' + (W - padR) + '" y1="' + y + '" y2="' + y + '" class="grid"/>' +
        '<text x="' + (padL - 8) + '" y="' + (y + 4) + '" class="ax" text-anchor="end">' + fmt(v) + '</text>';
    });
    if (p.units) html += '<text x="' + padL + '" y="' + (padT - 4) + '" class="unit">' + esc(p.units) + '</text>';
    cats.forEach(function (c, i) {
      var gx = padL + group * i + (group - inner) / 2;
      html += '<text x="' + (gx + inner / 2) + '" y="' + (padT + plotH + 18) + '" class="ax" text-anchor="middle">' + esc(c) + '</text>';
      d.series.forEach(function (s, si) {
        var v = s.values[i], x = gx + si * (bw + 3), y = Y(v), h = padT + plotH - y;
        var col = multi ? colors[si % colors.length] : colors[0];
        html += '<rect x="' + x + '" y="' + y + '" width="' + bw + '" height="' + Math.max(0, h) + '" rx="3" fill="' + col + '" class="mark" data-pick="' + esc((multi ? s.name + ' · ' : '') + c + ': ' + fmt(v) + (p.units ? ' ' + p.units : '')) + '"><title>' + esc((multi ? s.name + ', ' : '') + c + ': ' + fmt(v)) + '</title></rect>';
        if (!multi || ns <= 3) html += '<text x="' + (x + bw / 2) + '" y="' + (y - 4) + '" class="dl" text-anchor="middle">' + esc(fmt(v)) + '</text>';
      });
    });
    html += lg.html + '</svg>';
    return html;
  }

  /* ----------------------------------------------------------------- pie */
  function pieChart(p, d, opts) {
    var colors = pal();
    var charts = d.charts, n = charts.length;
    var W = 640, r = n === 1 ? 110 : n === 2 ? 95 : 78, H = (opts.compact ? 250 : 290) + 0;
    var names = [];
    charts.forEach(function (c) { c.slices.forEach(function (s) { if (names.indexOf(s.name) < 0) names.push(s.name); }); });
    var lg = legend(names, colors, 20, H - 8, W - 40);
    H += (lg.rows - 1) * 18;
    var html = svgOpen(W, H, 'pie');
    charts.forEach(function (c, ci) {
      var cx = W / (n + 1) * (ci + 1), cy = 20 + r + 8;
      var total = c.slices.reduce(function (a, s) { return a + s.value; }, 0) || 1;
      var a0 = -Math.PI / 2;
      c.slices.forEach(function (s) {
        var a1 = a0 + s.value / total * Math.PI * 2;
        var x0 = cx + r * Math.cos(a0), y0 = cy + r * Math.sin(a0), x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
        var large = a1 - a0 > Math.PI ? 1 : 0;
        var col = colors[names.indexOf(s.name) % colors.length];
        html += '<path d="M' + cx + ' ' + cy + ' L' + x0 + ' ' + y0 + ' A' + r + ' ' + r + ' 0 ' + large + ' 1 ' + x1 + ' ' + y1 + ' Z" fill="' + col + '" stroke="var(--surface)" stroke-width="2" class="mark" data-pick="' + esc(s.name + (n > 1 ? ' (' + c.title + ')' : '') + ': ' + fmt(s.value) + '%') + '"><title>' + esc(s.name + ': ' + s.value + '%') + '</title></path>';
        var am = (a0 + a1) / 2, lr = r * 0.66;
        if (s.value / total >= 0.06) html += '<text x="' + (cx + lr * Math.cos(am)) + '" y="' + (cy + lr * Math.sin(am) + 4) + '" class="pl" text-anchor="middle">' + esc(s.value + '%') + '</text>';
        a0 = a1;
      });
      html += '<text x="' + cx + '" y="' + (cy + r + 20) + '" class="ax" text-anchor="middle" font-weight="600">' + esc(c.title) + '</text>';
    });
    html += lg.html + '</svg>';
    return html;
  }

  /* --------------------------------------------------------------- table */
  function tableChart(p, d) {
    var html = '<div class="tbl-scroll"><table class="tbl cc-table"><thead><tr>';
    d.cols.forEach(function (c) { html += '<th>' + esc(c) + '</th>'; });
    html += '</tr></thead><tbody>';
    d.rows.forEach(function (r) {
      html += '<tr>';
      r.forEach(function (cell, i) {
        html += '<td class="' + (i ? 'num' : '') + '"' + (i ? ' data-pick="' + esc(r[0] + ' · ' + d.cols[i] + ': ' + fmt(cell)) + '"' : '') + '>' + esc(fmt(cell)) + '</td>';
      });
      html += '</tr>';
    });
    html += '</tbody></table></div>' + (p.units ? '<p class="cc-units">Units: ' + esc(p.units) + '</p>' : '');
    return html;
  }

  /* ------------------------------------------------------------- process */
  function processChart(p, d, opts) {
    var st = d.stages, n = st.length;
    var cols = n <= 4 ? n : Math.ceil(n / 2), rows = Math.ceil(n / cols);
    var bw = 140, bh = 66, gx = 34, gy = 46;
    var W = cols * bw + (cols - 1) * gx + 40, H = rows * bh + (rows - 1) * gy + 40;
    var html = svgOpen(W, H, 'process');
    html += '<defs><marker id="arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" fill="var(--ink-2)"/></marker></defs>';
    var pos = [];
    st.forEach(function (s, i) {
      var r = Math.floor(i / cols), c = i % cols;
      if (r % 2 === 1) c = cols - 1 - c;           /* snake so arrows stay short */
      var x = 20 + c * (bw + gx), y = 20 + r * (bh + gy);
      pos.push({ x: x, y: y, r: r, c: c });
    });
    for (var i = 0; i < n - 1; i++) {
      var a = pos[i], b = pos[i + 1];
      var x1, y1, x2, y2;
      if (a.r === b.r) { var dir = b.c > a.c ? 1 : -1; x1 = a.x + (dir > 0 ? bw : 0); y1 = a.y + bh / 2; x2 = b.x + (dir > 0 ? 0 : bw); y2 = y1; }
      else { x1 = a.x + bw / 2; y1 = a.y + bh; x2 = b.x + bw / 2; y2 = b.y; }
      html += '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="var(--ink-2)" stroke-width="2" marker-end="url(#arr)"/>';
    }
    if (d.shape === 'cyclical' && n > 1) {
      var f = pos[0], l = pos[n - 1];
      var path = 'M' + (l.x + (l.c === 0 ? 0 : bw / 2)) + ' ' + (l.y + (l.c === 0 ? bh / 2 : bh)) + ' ';
      var yOut = H - 10;
      path += 'L' + (l.c === 0 ? l.x - 14 : l.x + bw / 2) + ' ' + (l.c === 0 ? l.y + bh / 2 : yOut) + ' ';
      path += 'L' + (f.x - 14) + ' ' + (l.c === 0 ? l.y + bh / 2 : yOut) + ' L' + (f.x - 14) + ' ' + (f.y + bh / 2) + ' L' + (f.x - 2) + ' ' + (f.y + bh / 2);
      html += '<path d="' + path + '" fill="none" stroke="var(--gold)" stroke-width="2" stroke-dasharray="5 4" marker-end="url(#arr)"/>';
    }
    st.forEach(function (s, i) {
      var q = pos[i];
      html += '<g class="mark" data-pick="' + esc('Stage ' + s.n + ': ' + s.label + (s.detail ? ' — ' + s.detail : '')) + '">' +
        '<rect x="' + q.x + '" y="' + q.y + '" width="' + bw + '" height="' + bh + '" rx="8" fill="var(--surface-2)" stroke="var(--accent-line)" stroke-width="1.5"/>' +
        '<circle cx="' + (q.x + 16) + '" cy="' + (q.y + 16) + '" r="10" fill="var(--accent)"/>' +
        '<text x="' + (q.x + 16) + '" y="' + (q.y + 20) + '" class="stn" text-anchor="middle">' + s.n + '</text>' +
        '<text x="' + (q.x + 32) + '" y="' + (q.y + 21) + '" class="stl">' + esc(s.label) + '</text>' +
        wrapText(s.detail || '', q.x + 10, q.y + 38, bw - 20, 'std') + '</g>';
    });
    html += '</svg>';
    return html;
  }
  function wrapText(t, x, y, w, cls) {
    if (!t) return '';
    var words = t.split(' '), lines = [], cur = '';
    words.forEach(function (wd) {
      if ((cur + ' ' + wd).trim().length * 5.6 > w && cur) { lines.push(cur); cur = wd; } else cur = (cur + ' ' + wd).trim();
    });
    if (cur) lines.push(cur);
    return lines.slice(0, 2).map(function (l, i) { return '<text x="' + x + '" y="' + (y + i * 12) + '" class="' + cls + '">' + esc(l) + '</text>'; }).join('');
  }

  /* ----------------------------------------------------------------- map */
  function mapChart(p, d, opts) {
    var panels = d.panels, n = panels.length;
    var cell = 44, W = 0, H = 0, gap = 24;
    panels.forEach(function (pn) { W += pn.w * cell; H = Math.max(H, pn.h * cell); });
    W += (n - 1) * gap + 20; H += 48;
    var html = svgOpen(W, H, 'map');
    var ox = 10;
    panels.forEach(function (pn, pi) {
      var oy = 30;
      html += '<text x="' + ox + '" y="18" class="ax" font-weight="700">' + esc(pn.title) + '</text>';
      html += '<rect x="' + ox + '" y="' + oy + '" width="' + (pn.w * cell) + '" height="' + (pn.h * cell) + '" fill="var(--surface)" stroke="var(--rule)"/>';
      pn.features.forEach(function (f) {
        var fill = KIND_FILL[f.kind] || KIND_FILL.building;
        var col = isDark() ? fill.d : fill.l;
        var x = ox + f.x * cell, y = oy + f.y * cell, w = f.w * cell, h = f.h * cell;
        html += '<g class="mark" data-pick="' + esc(pn.title + ': ' + f.name + (f.note ? ' (' + f.note + ')' : '')) + '">' +
          '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" fill="' + col + '" stroke="var(--ink-3)" stroke-width="0.8" rx="' + (f.kind === 'road' || f.kind === 'water' ? 0 : 3) + '"/>';
        if (w >= 40 && h >= 18) html += wrapText(f.name, x + 4, y + 13, w - 8, 'mpl');
        html += '</g>';
      });
      /* compass in the first panel */
      if (pi === 0) {
        var cx = ox + pn.w * cell - 18, cy = oy + 20;
        html += '<g><circle cx="' + cx + '" cy="' + cy + '" r="12" fill="var(--surface)" stroke="var(--ink-3)"/><path d="M' + cx + ' ' + (cy - 9) + ' L' + (cx + 4) + ' ' + (cy + 5) + ' L' + cx + ' ' + (cy + 2) + ' L' + (cx - 4) + ' ' + (cy + 5) + ' Z" fill="var(--no)"/><text x="' + cx + '" y="' + (cy - 14) + '" class="mpl" text-anchor="middle">N</text></g>';
      }
      ox += pn.w * cell + gap;
    });
    html += '</svg>';
    return html;
  }

  /* --------------------------------------------------------------- mixed */
  function mixedChart(p, d, opts) {
    return d.parts.map(function (part) {
      var sub = { units: part.units || '', title: part.title };
      return '<div class="cc-part"><p class="cc-part-t">' + esc(part.title) + '</p>' + draw(sub, part.type, part.data, opts) + '</div>';
    }).join('');
  }

  function draw(p, type, data, opts) {
    opts = opts || {};
    switch (type) {
      case 'line': return lineChart(p, data, opts);
      case 'bar': return barChart(p, data, opts);
      case 'pie': return pieChart(p, data, opts);
      case 'table': return tableChart(p, data, opts);
      case 'process': return processChart(p, data, opts);
      case 'map': return mapChart(p, data, opts);
      case 'mixed': return mixedChart(p, data, opts);
    }
    return '<p>Unknown chart type ' + esc(type) + '</p>';
  }

  var CSS = '.cc-fig{background:var(--surface);border:1px solid var(--rule-soft);border-radius:var(--r-m);padding:12px 12px 8px;margin-bottom:14px}' +
    '.cc-fig .cc-rubric{font-size:.95rem;line-height:1.5;margin-bottom:8px}' +
    '.cc-fig .cc-title{font-family:var(--f-mono);font-size:9.5px;letter-spacing:.12em;text-transform:uppercase;color:var(--ink-3);margin-bottom:6px}' +
    '.cc-chart{width:100%;height:auto;display:block;max-height:420px}' +
    '.cc-chart .grid{stroke:var(--rule-soft);stroke-width:1}' +
    '.cc-chart .ax{font:11px var(--f-mono);fill:var(--ink-2)}' +
    '.cc-chart .unit{font:10px var(--f-mono);fill:var(--ink-3);letter-spacing:.06em}' +
    '.cc-chart .lg{font:11px var(--f-ui);fill:var(--ink)}' +
    '.cc-chart .dl{font:10.5px var(--f-mono);fill:var(--ink-2)}' +
    '.cc-chart .pl{font:11px var(--f-mono);fill:#fff;font-weight:600;paint-order:stroke;stroke:rgba(0,0,0,.25);stroke-width:2px}' +
    '.cc-chart .proj{fill:var(--gold-soft)}' +
    '.cc-chart .stn{font:11px var(--f-mono);fill:var(--accent-ink);font-weight:700}' +
    '.cc-chart .stl{font:12px var(--f-ui);fill:var(--ink);font-weight:600}' +
    '.cc-chart .std{font:10px var(--f-ui);fill:var(--ink-2)}' +
    '.cc-chart .mpl{font:10px var(--f-ui);fill:var(--ink);font-weight:600}' +
    '.cc-chart .mark{cursor:pointer}.cc-chart .mark:hover{opacity:.8}' +
    '.cc-chart .mark.picked{stroke:var(--gold);stroke-width:3}' +
    '.cc-part{margin-bottom:10px}.cc-part-t{font-family:var(--f-mono);font-size:10px;letter-spacing:.08em;text-transform:uppercase;color:var(--ink-2);margin:4px 0 4px}' +
    '.cc-table td[data-pick]{cursor:pointer}.cc-table td.picked{background:var(--gold-soft)}' +
    '.cc-units{font-family:var(--f-mono);font-size:10px;color:var(--ink-3);margin-top:6px}' +
    '.cc-readout{font-family:var(--f-mono);font-size:11px;color:var(--gold);min-height:16px;margin-top:6px}';
  function injectCss() {
    if (document.getElementById('cc-chart-css')) return;
    var s = document.createElement('style'); s.id = 'cc-chart-css'; s.textContent = CSS; document.head.appendChild(s);
  }

  function promptById(id) {
    var P = (global.CONTENT && global.CONTENT.PROMPTS) || [];
    for (var i = 0; i < P.length; i++) if (P[i].id === id) return P[i];
    return null;
  }

  /* Draw a prompt (or an inline chart object) into host. */
  function render(host, promptOrId, opts) {
    injectCss();
    opts = opts || {};
    var p = typeof promptOrId === 'string' ? promptById(promptOrId) : promptOrId;
    if (!p) { host.innerHTML = '<p class="tiny">Chart not found.</p>'; return; }
    var html = '<div class="cc-fig">' +
      (opts.showRubric !== false && p.rubric ? '<p class="cc-rubric">' + esc(p.rubric) + '</p>' : '') +
      (p.title && opts.showTitle !== false ? '<p class="cc-title">' + esc(p.title) + (p.units ? ' · ' + esc(p.units) : '') + '</p>' : '') +
      draw(p, p.type, p.data, opts) +
      (opts.readout ? '<div class="cc-readout" id="cc-readout">Tap a bar, point, slice or cell to read its value.</div>' : '') +
      '</div>';
    host.innerHTML = html;
    var out = host.querySelector('#cc-readout');
    host.querySelectorAll('[data-pick]').forEach(function (m) {
      m.addEventListener('click', function () {
        var t = m.getAttribute('data-pick');
        if (out) out.textContent = t;
        host.querySelectorAll('.picked').forEach(function (x) { x.classList.remove('picked'); });
        m.classList.add('picked');
        if (opts.onPick) opts.onPick(t);
      });
    });
  }

  /* Plain-text description of the data, for AI marking and for the teacher. */
  function describe(p) {
    var d = p.data, out = [p.rubric];
    if (p.units) out.push('Units: ' + p.units);
    if (p.type === 'line' || p.type === 'bar') {
      var xs = d.x || d.categories;
      d.series.forEach(function (s) { out.push(s.name + ': ' + xs.map(function (x, i) { return x + '=' + s.values[i]; }).join(', ')); });
    } else if (p.type === 'pie') {
      d.charts.forEach(function (c) { out.push(c.title + ': ' + c.slices.map(function (s) { return s.name + ' ' + s.value + '%'; }).join(', ')); });
    } else if (p.type === 'table') {
      out.push(d.cols.join(' | '));
      d.rows.forEach(function (r) { out.push(r.join(' | ')); });
    } else if (p.type === 'process') {
      out.push((d.shape || 'linear') + ' process, ' + d.stages.length + ' stages: ' + d.stages.map(function (s) { return s.n + '. ' + s.label + (s.detail ? ' (' + s.detail + ')' : ''); }).join('; '));
    } else if (p.type === 'map') {
      d.panels.forEach(function (pn) { out.push(pn.title + ': ' + pn.features.map(function (f) { return f.name + ' [' + f.kind + ' at x' + f.x + ',y' + f.y + ']'; }).join('; ')); });
    } else if (p.type === 'mixed') {
      d.parts.forEach(function (part) { out.push(describe({ rubric: part.title, units: part.units, type: part.type, data: part.data })); });
    }
    return out.join('\n');
  }

  global.Charts = { render: render, draw: draw, describe: describe, prompt: promptById, palette: pal };
})(window);
