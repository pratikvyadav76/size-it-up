const http = require('http'), fs = require('fs'), path = require('path'), os = require('os'), crypto = require('crypto');
const Q = require('./questions.js');
const PORT = +process.env.PORT || 8000, RATE = 88, DEFAULT_SECS = 30, SAVE = path.join(__dirname, 'state.json');
const KEY = process.env.HOST_KEY || crypto.randomBytes(3).toString('hex');
const MAXR = Math.min(Q.size.length, Q.price.length);

const fresh = () => ({ phase: 'setup', teams: [], R: 0, round: 0, stage: 'guess', endsAt: 0, secs: DEFAULT_SECS, roundSecs: DEFAULT_SECS, order: { size: [], price: [] } });
let S = (() => { try { return JSON.parse(fs.readFileSync(SAVE)); } catch { return fresh(); } })();
const save = () => fs.writeFileSync(SAVE, JSON.stringify(S));

const shuffle = a => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = crypto.randomInt(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const game = () => (S.round < S.R ? 'size' : 'price');
const question = () => Q[game()][S.order[game()][S.round % S.R]];
const answer = q => (game() === 'size' ? q.t.m : q.inr ?? q.usd * RATE);
const points = (g, a) => (g > 0 ? Math.round(100 * Math.max(0, 1 - Math.abs(Math.log(g / a)) / Math.log(4))) : 0);

function startRound() {
  S.stage = 'guess'; S.roundSecs = S.secs; S.endsAt = Date.now() + S.secs * 1000;
  S.teams.forEach(t => { t.guess = null; t.locked = false; });
}
function reveal() {
  if (S.stage !== 'guess') return;
  const a = answer(question());
  S.teams.forEach(t => { const pts = points(t.guess, a); t.score += pts; t.last = { guess: t.guess, pts }; });
  S.stage = 'reveal'; save();
}
function checkAllLocked() {
  const joined = S.teams.filter(t => t.token);
  if (S.phase === 'game' && S.stage === 'guess' && joined.length && joined.every(t => t.locked)) reveal();
}
setInterval(() => { if (S.phase === 'game' && S.stage === 'guess' && Date.now() >= S.endsAt) reveal(); }, 300);

function view(teamId, host, token) {
  const reveal = S.stage === 'reveal', showScores = S.phase === 'final' || (S.phase === 'game' && reveal);
  const v = { phase: S.phase, R: S.R, round: S.round, total: S.R * 2, stage: S.stage, rate: RATE, ms: Math.max(0, S.endsAt - Date.now()), secs: S.roundSecs, cfgSecs: S.secs, expect: S.phase === 'game' ? S.round + '-' + S.stage : S.phase, maxR: MAXR,
    teams: S.teams.map(t => ({ id: t.id, name: t.name, size: t.size, members: host ? t.members : undefined, claimed: !!t.token, locked: t.locked, online: host ? !!t.seen && Date.now() - t.seen.at < 4000 : undefined, seen: host && t.seen ? t.seen.r : undefined,
      score: showScores ? t.score : undefined, last: showScores && S.phase === 'game' ? t.last : undefined })) };
  if (S.phase === 'game') {
    v.game = game(); const q = question();
    v.q = reveal ? { ...q, answer: answer(q) } : game() === 'size' ? { ref: q.ref, t: { id: q.t.id, s: q.t.s, name: q.t.name } } : { e: q.e, name: q.name, note: q.note, usd: q.usd !== undefined };
    if (reveal && v.game === 'price') v.q.usd = q.usd !== undefined;
    const me = S.teams.find(t => t.id === teamId);
    if (me) { v.myGuess = me.guess; v.myLocked = me.locked; }
  }
  const mine = S.teams.find(t => t.id === teamId);
  if (mine && token) v.mine = mine.token === token;
  return v;
}

function post(url, b) {
  const host = b.key === KEY, team = S.teams.find(t => t.id === b.team);
  const authed = team && team.token && team.token === b.token;
  if (url.startsWith('/api/host/') && !host) return [403, { error: 'bad host key' }];
  switch (url) {
    case '/api/host/setup': {
      const names = String(b.names || '').split(/[\n,]+/).map(s => s.trim()).filter(Boolean), n = +b.teams;
      if (!(n >= 1) || names.length < n) return [400, { error: 'Need at least as many names as teams' }];
      const pool = shuffle(names), teams = Array.from({ length: n }, (_, i) => ({ id: 't' + (i + 1), name: 'Team ' + (i + 1), members: [], score: 0, token: null, guess: null, locked: false }));
      pool.forEach((nm, i) => teams[i % n].members.push(nm));
      teams.forEach(t => (t.size = t.members.length));
      const R = Math.min(MAXR, Math.max(...teams.map(t => t.size)));
      S = { ...fresh(), phase: 'lobby', teams, R, order: { size: shuffle([...Q.size.keys()]), price: shuffle([...Q.price.keys()]) } };
      break;
    }
    case '/api/host/start': if (S.phase !== 'lobby') return [400, { error: 'not in lobby' }]; S.phase = 'game'; S.round = 0; startRound(); break;
    case '/api/host/done': reveal(); break;
    case '/api/host/config': {  // rounds only before the game starts; seconds apply from the next round
      const secs = Math.round(+b.secs), rounds = Math.round(+b.rounds);
      if (secs >= 5 && secs <= 300) S.secs = secs;
      if (S.phase === 'lobby' && rounds >= 1 && rounds <= MAXR) S.R = rounds;
      break;
    }
    case '/api/host/extend':  // +/- seconds on the round in progress
      if (S.phase !== 'game' || S.stage !== 'guess') return [400, { error: 'no round running' }];
      { const d = Math.max(-S.roundSecs + 5, Math.min(120, Math.round(+b.secs))) ; S.roundSecs += d; S.endsAt += d * 1000; if (S.endsAt < Date.now() + 2000) S.endsAt = Date.now() + 2000; }
      break;
    case '/api/host/restart':  // fresh timer + cleared guesses, only before reveal so scores stay consistent
      if (S.phase !== 'game' || S.stage !== 'guess') return [400, { error: 'only while guessing' }];
      startRound(); break;
    case '/api/host/end': if (S.phase === 'game') S.phase = 'final'; break;
    case '/api/host/next':
      if (S.phase !== 'game' || S.stage !== 'reveal') return [400, { error: 'not in reveal' }];
      if (++S.round >= S.R * 2) S.phase = 'final'; else startRound();
      break;
    case '/api/host/release': if (team) team.token = null; break;
    case '/api/host/reset': S = fresh(); break;
    case '/api/claim':
      if (!team) return [400, { error: 'no such team' }];
      if (team.token && team.token !== b.token) return [409, { error: 'Team already taken by another laptop' }];
      team.token = b.token; break;
    case '/api/guess': case '/api/lock':
      if (!authed || S.phase !== 'game' || S.stage !== 'guess') return [400, { error: 'not allowed' }];
      if (team.locked) break;
      if (b.value > 0 && isFinite(b.value)) team.guess = +b.value;
      if (url === '/api/lock') { if (team.guess == null) return [400, { error: 'no guess' }]; team.locked = true; }
      break;
    default: return [404, { error: 'nope' }];
  }
  save(); if (url === '/api/lock') checkAllLocked();
  return [200, { ok: true }];
}

const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript' };
http.createServer((req, res) => {
  const u = new URL(req.url, 'http://x'), send = (c, o) => { res.writeHead(c, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }); res.end(JSON.stringify(o)); };
  if (req.method === 'GET' && u.pathname === '/api/state') { const t = S.teams.find(x => x.id === u.searchParams.get('team')); if (t && t.token && t.token === u.searchParams.get('token')) t.seen = { at: Date.now(), r: u.searchParams.get('r') || '' }; }
  if (req.method === 'GET' && u.pathname === '/api/state') return send(200, view(u.searchParams.get('team'), u.searchParams.get('key') === KEY, u.searchParams.get('token')));
  if (req.method === 'POST') {
    let d = ''; req.on('data', c => (d += c)); req.on('end', () => { try { const [c, o] = post(u.pathname, JSON.parse(d || '{}')); send(c, o); } catch (e) { send(400, { error: String(e) }); } });
    return;
  }
  const f = u.pathname === '/' ? 'team.html' : u.pathname === '/host' ? 'host.html' : u.pathname.slice(1);
  const p = path.join(__dirname, 'public', f);
  if (!p.startsWith(path.join(__dirname, 'public')) || !fs.existsSync(p)) { res.writeHead(404); return res.end('not found'); }
  res.writeHead(200, { 'Content-Type': types[path.extname(p)] || 'text/plain', 'Cache-Control': 'no-store' }); res.end(fs.readFileSync(p));
}).listen(PORT, '0.0.0.0', () => {
  const ips = Object.values(os.networkInterfaces()).flat().filter(i => i.family === 'IPv4' && !i.internal).map(i => i.address);
  console.log('\nSIZE IT UP is running.\n');
  ips.forEach(ip => console.log(`  Team link (share this):  http://${ip}:${PORT}`));
  console.log(`  YOUR host link:          http://localhost:${PORT}/host?k=${KEY}\n`);
});
