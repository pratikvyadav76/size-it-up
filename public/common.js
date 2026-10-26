const $ = s => document.querySelector(s);
const fmtM = m => (m >= 1000 ? (m / 1000).toFixed(2) + ' km' : m >= 10 ? Math.round(m) + ' m' : m.toFixed(1) + ' m');
const tr = x => String(+x.toFixed(2));
const inr = n => '₹' + (n >= 1e7 ? tr(n / 1e7) + ' crore' : n >= 1e5 ? tr(n / 1e5) + ' lakh' : n < 10 ? tr(n) : Math.round(n).toLocaleString('en-IN'));
const usd = n => '$' + (n >= 1e9 ? tr(n / 1e9) + ' billion' : n >= 1e6 ? tr(n / 1e6) + ' million' : n < 100 ? n.toFixed(2).replace(/.00$/, '') : Math.round(n).toLocaleString('en-US'));
// "1.4 lakh", "827 cr", "20k", "2 million", "1,43,000" -> number
function parseMoney(s) {
  const m = String(s).toLowerCase().replace(/[,₹$s]/g, '').match(/^(d*.?d+)(k|l|lac|lakh|lakhs|cr|crore|crores|m|mn|million|b|bn|billion)?$/);
  if (!m) return 0; const mult = { k: 1e3, l: 1e5, lac: 1e5, lakh: 1e5, lakhs: 1e5, cr: 1e7, crore: 1e7, crores: 1e7, m: 1e6, mn: 1e6, million: 1e6, b: 1e9, bn: 1e9, billion: 1e9 }[m[2]] || 1;
  return +m[1] * mult;
}
const both = (i, rate) => `${inr(i)} / ${usd(i / rate)}`;
async function api(url, body) {
  const r = await fetch(url, body ? { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) } : undefined);
  const j = await r.json(); if (!r.ok) throw new Error(j.error || r.status); return j;
}
// Countdown bar; remaining ms comes from server so laptop clocks don't matter.
let _end = 0;
function setTimer(ms) { _end = performance.now() + ms; }
function tickTimer(total, active) {
  const left = active ? Math.max(0, _end - performance.now()) : 0;
  $('#tleft').textContent = active ? Math.ceil(left / 1000) + 's' : '';
  $('#tbar').style.width = (active ? (left / (total * 1000)) * 100 : 0) + '%';
}
setInterval(() => window.tick && tick(), 200);
// items: [{s: silhouette id, m: metres, color, label}] drawn left to right at pxPerM; silhouettes are vectors scaled by transform so any size stays crisp.
const dimsM = it => { const s = SIL[it.s]; return { hm: s.dim === 'h' ? it.m : it.m / s.a, wm: s.dim === 'w' ? it.m : it.m * s.a }; };
const GAP = 46, SCENE_H = 380;
function fitPpm(items, W, zoom = 1) {
  const d = items.map(dimsM), hm = Math.max(...d.map(x => x.hm)), wm = d.reduce((a, x) => a + x.wm, 0);
  return Math.min((SCENE_H - 100) / hm, (W - 40 - GAP * (items.length - 1)) / wm) * zoom;
}
function scene(el, items, ppm) {
  el.querySelectorAll('.sil,.lbl,.refline,.reftag').forEach(n => n.remove());
  let x = 20;
  items.forEach((it, i) => {
    const s = SIL[it.s], sc = (it.m * ppm) / 100, w0 = s.dim === 'h' ? 100 * s.a : 100, h0 = s.dim === 'h' ? 100 : 100 / s.a, wPx = w0 * sc;
    const o = document.createElement('div'); o.className = 'sil'; o.innerHTML = SIL.html(it.s, h0);
    Object.assign(o.style, { left: x + 'px', width: w0 + 'px', height: h0 + 'px', transform: `scale(${sc})`, color: it.color, filter: `drop-shadow(0 0 ${(9 / sc).toFixed(2)}px ${it.color})` });
    el.appendChild(o);
    const l = document.createElement('div'); l.className = 'lbl'; l.textContent = it.label; Object.assign(l.style, { left: x + Math.min(wPx, 400) / 2 + 'px', color: it.color, fontSize: '12px' }); el.appendChild(l);
    if (i === 0) {  // dashed reference marker: top edge for tall things, right edge for long things
      const line = document.createElement('div'), tag = document.createElement('div'); tag.className = 'reftag'; tag.textContent = fmtM(it.m);
      if (s.dim === 'h') { line.className = 'refline'; line.style.bottom = 40 + it.m * ppm + 'px'; tag.style.bottom = 44 + it.m * ppm + 'px'; tag.style.right = '10px'; }
      else { line.className = 'refline v'; line.style.left = x + wPx + 'px'; tag.style.top = '10px'; tag.style.left = x + wPx + 6 + 'px'; }
      el.append(line, tag);
    }
    x += wPx + GAP;
  });
}
function board(teams, meId) {
  const rows = [...teams].sort((a, b) => b.score - a.score);
  return '<table><tr><th>#</th><th>Team</th><th>Round</th><th>Total</th></tr>' + rows.map((t, i) => {
    const best = Math.max(...teams.map(x => (x.last ? x.last.pts : 0)));
    return `<tr class="${t.id === meId ? 'me' : ''} ${t.last && t.last.pts === best && best > 0 ? 'win' : ''}"><td>${i + 1}</td><td>${t.name}</td><td>${t.last ? '+' + t.last.pts : ''}</td><td><b>${t.score}</b></td></tr>`;
  }).join('') + '</table>';
}
