// Run: PORT=8123 HOST_KEY=k node server.js  &  node test.js
const B = 'http://localhost:8123', key = 'k';
const call = async (u, b) => { const r = await fetch(B + u, b ? { method: 'POST', body: JSON.stringify(b) } : undefined); return [r.status, await r.json()]; };
const ok = (c, m) => { if (!c) { console.error('FAIL', m); process.exit(1); } };
(async () => {
  await call('/api/host/reset', { key });
  ok((await call('/api/host/setup', { key: 'bad', names: 'a,b', teams: 1 }))[0] === 403, 'host key enforced');
  const names = Array.from({ length: 23 }, (_, i) => 'P' + i).join('\n');
  ok((await call('/api/host/setup', { key, names, teams: 5 }))[0] === 200, 'setup');
  let [, s] = await call('/api/state?key=' + key);
  ok(s.R === 5 && s.teams.map(t => t.size).join() === '5,5,5,4,4', 'split ' + s.teams.map(t => t.size));
  const tok = {}; for (const t of s.teams) { tok[t.id] = 'tok' + t.id; await call('/api/claim', { team: t.id, token: tok[t.id] }); }
  ok((await call('/api/claim', { team: 't1', token: 'other' }))[0] === 409, 'double claim blocked');
  await call('/api/host/start', { key });
  for (let r = 0; r < 10; r++) {
    [, s] = await call('/api/state?team=t1');
    ok(s.stage === 'guess' && s.round === r && s.teams.every(t => t.score === undefined), 'no scores leaked in guess, r' + r);
    ok(!JSON.stringify(s.q).includes('answer'), 'no answer leaked');
    for (const t of s.teams.slice(0, 4)) { await call('/api/lock', { team: t.id, token: tok[t.id], value: 50 }); }
    [, s] = await call('/api/state?team=t1'); ok(s.stage === 'guess', '4/5 locked still guessing');
    await call('/api/lock', { team: 't5', token: tok.t5, value: 100 });
    [, s] = await call('/api/state?team=t1'); ok(s.stage === 'reveal' && s.q.answer > 0, 'auto reveal when all locked');
    await call('/api/host/next', { key });
  }
  [, s] = await call('/api/state'); ok(s.phase === 'final' && s.teams[0].score !== undefined, 'final');
  console.log('ALL OK', s.teams.map(t => t.score).join());
})();
