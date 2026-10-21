const $ = s => document.querySelector(s);
const fmtM = m => (m >= 1000 ? (m / 1000).toFixed(2) + ' km' : m >= 10 ? Math.round(m) + ' m' : m.toFixed(1) + ' m');
const inr = n => '₹' + Math.round(n).toLocaleString('en-IN');
const usd = n => '$' + (n < 100 ? n.toFixed(2) : Math.round(n).toLocaleString('en-US'));
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
// items: [{e, m, cls, label, x}] drawn at pxPerM; huge sizes use transform so they clip instead of breaking.
function scene(el, items, pxPerM) {
  el.querySelectorAll('.obj,.lbl,.refline,.reftag').forEach(n => n.remove());
  const r = items[0], rh = r.m * pxPerM;  // dashed line at the reference's top so the gap to the target is easy to judge
  if (rh < 340) {
    const l = document.createElement('div'); l.className = 'refline'; l.style.bottom = 40 + rh + 'px'; el.appendChild(l);
    const t = document.createElement('div'); t.className = 'reftag'; t.style.bottom = 44 + rh + 'px'; t.textContent = fmtM(r.m); el.appendChild(t);
  }
  items.forEach(it => {
    const o = document.createElement('div'); o.className = 'obj'; o.textContent = it.e;
    o.style.left = it.x + '%'; o.style.transform = `scale(${(it.m * pxPerM) / 100})`;
    const s = (it.m * pxPerM) / 100; o.style.textShadow = `0 0 0 ${it.color}, 0 0 ${(10 / s).toFixed(2)}px ${it.color}`; el.appendChild(o);
    const l = document.createElement('div'); l.className = 'lbl'; l.style.left = it.x + '%'; l.style.color = it.color; l.textContent = it.label; el.appendChild(l);
  });
}
function board(teams, meId) {
  const rows = [...teams].sort((a, b) => b.score - a.score);
  return '<table><tr><th>#</th><th>Team</th><th>Round</th><th>Total</th></tr>' + rows.map((t, i) => {
    const best = Math.max(...teams.map(x => (x.last ? x.last.pts : 0)));
    return `<tr class="${t.id === meId ? 'me' : ''} ${t.last && t.last.pts === best && best > 0 ? 'win' : ''}"><td>${i + 1}</td><td>${t.name}</td><td>${t.last ? '+' + t.last.pts : ''}</td><td><b>${t.score}</b></td></tr>`;
  }).join('') + '</table>';
}
