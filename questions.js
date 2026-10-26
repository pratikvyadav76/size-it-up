// size: guess the target's measured dimension (metres) against a reference. price: guess in INR (usd items converted at RATE in server.js).
// Figures are approximate public numbers (price list is roughly 2025-26) - skim before the event.
const O = {
  human: ['Adult human', 'human', 1.7], giraffe: ['Giraffe', 'giraffe', 5.5], elephant: ['Indian elephant (shoulder)', 'elephant', 2.75], whale: ['Blue whale', 'whale', 25],
  rickshaw: ['Auto-rickshaw', 'rickshaw', 2.6], bus: ['Indian city bus', 'bus', 12], alto: ['Maruti Alto K10', 'car', 3.53], nano: ['Tata Nano', 'car', 3.1], swift: ['Maruti Swift', 'car', 3.86],
  re: ['Royal Enfield Classic 350', 'bike', 2.145], bat: ['Cricket bat', 'bat', 0.96], pitch: ['Cricket pitch', 'pitch', 20.12], football: ['Football pitch', 'football', 105],
  a320: ['Airbus A320', 'airliner', 37.6], b747: ['Boeing 747', 'jumbo', 70.7], lvm3: ['ISRO LVM3 rocket', 'lvm3', 43.5], pslv: ['ISRO PSLV rocket', 'pslv', 44.4], saturn: ['Saturn V rocket', 'saturn', 110.6],
  liberty: ['Statue of Liberty + pedestal', 'liberty', 93], eiffel: ['Eiffel Tower', 'eiffel', 330], burj: ['Burj Khalifa', 'burj', 828], empire: ['Empire State Building', 'empire', 443],
  needle: ['Space Needle, Seattle', 'needle', 184], washington: ['Washington Monument', 'washington', 169], qutub: ['Qutub Minar, Delhi', 'qutub', 72.5], taj: ['Taj Mahal', 'taj', 73],
  gateway: ['Gateway of India, Mumbai', 'gateway', 26], indiagate: ['India Gate, Delhi', 'indiagate', 42], charminar: ['Charminar, Hyderabad', 'charminar', 56], hawa: ['Hawa Mahal, Jaipur', 'hawa', 15],
  unity: ['Statue of Unity, Gujarat', 'unity', 182], brihad: ['Brihadeeswarar Temple, Thanjavur', 'brihad', 66], lotus: ['Lotus Temple, Delhi', 'lotus', 34.3], victoria: ['Victoria Memorial, Kolkata', 'victoria', 56],
  antilia: ['Antilia, Mumbai', 'antilia', 173], konark: ['Konark Sun Temple wheel', 'konark', 2.96, 'diameter'], tree: ['Hyperion, tallest tree', 'tree', 115.9], chenab: ['Chenab rail bridge, J&K', 'chenab', 359],
  everest: ['Mount Everest', 'everest', 8849], kanch: ['Kangchenjunga', 'kanch', 8586], howrah: ['Howrah Bridge, Kolkata', 'howrah', 705], goldengate: ['Golden Gate Bridge', 'goldengate', 2737],
  bwsl: ['Bandra-Worli Sea Link', 'bwsl', 5600], atalsetu: ['Atal Setu (MTHL), Mumbai', 'atalsetu', 21800],
};
const dimOf = { human: 'h', giraffe: 'h', elephant: 'h', bat: 'h', lvm3: 'h', pslv: 'h', saturn: 'h', liberty: 'h', eiffel: 'h', burj: 'h', empire: 'h', needle: 'h', washington: 'h', qutub: 'h', taj: 'h', gateway: 'h', indiagate: 'h', charminar: 'h', hawa: 'h', unity: 'h', brihad: 'h', lotus: 'h', victoria: 'h', antilia: 'h', konark: 'h', tree: 'h', chenab: 'h', everest: 'h', kanch: 'h' };
const obj = id => { const [n, s, m, w] = O[id]; return { id, s, name: `${n} (${w || (dimOf[id] ? 'height' : 'length')})`, m }; };
const PAIRS = [
  'human elephant', 'human giraffe', 'human pitch', 'rickshaw hawa', 'bus gateway', 'giraffe qutub', 'liberty taj', 'eiffel howrah', 'goldengate bwsl', 'bus charminar',
  'whale lvm3', 'qutub empire', 'human unity', 'liberty indiagate', 'bus lotus', 'giraffe brihad', 'qutub victoria', 'eiffel burj', 'empire antilia', 'human re',
  'pitch a320', 'a320 b747', 'football eiffel', 'giraffe whale', 'human konark', 'human tree', 'bus needle', 'qutub washington', 'eiffel chenab', 'burj everest',
  'everest kanch', 'goldengate atalsetu', 'football howrah', 'lvm3 pslv', 'lvm3 saturn', 'rickshaw alto', 'rickshaw nano', 'human bat', 'eiffel unity', 'taj charminar',
  'empire burj', 'indiagate qutub', 'lotus brihad', 'rickshaw gateway', 'bus taj', 'elephant unity', 'liberty charminar', 'qutub antilia', 'bus swift', 'human hawa',
].map(p => p.split(' '));

let found = {}; try { found = require('./public/img/found.json'); } catch {}
module.exports = {
  size: PAIRS.map(([r, t]) => ({ ref: obj(r), t: obj(t) })),
  price: [
    // [emoji fallback, title, note, INR, USD-only price]
    ['🥇', '10 g of 24K gold', 'in India today', 143000], ['🥈', '1 kg of silver', 'in India', 220000], ['🏙️', 'One acre at Nariman Point, Mumbai', 'based on the RBI land deal', 8270000000],
    ['🏘️', 'One acre around Altamount Road, Mumbai', 'Mumbai land', 2430000000], ['⌚', 'Rolex Datejust 41', 'in India', 1136000], ['👜', 'Classic Hermès Birkin bag', 'in India', 2000000],
    ['📱', 'iPhone 17, 256 GB', 'bought in India', 99900], ['💻', 'MacBook Air, base model', 'in India', 99900], ['💇', 'Dyson Airwrap styling tool', 'in India', 49900],
    ['🏏', 'IPL match ticket, Wankhede Stadium VIP stand', 'Mumbai Indians home match (Garware Pavilion-type VIP stand)', 12000], ['🎮', 'PlayStation 5 Slim console', 'in India', 54990], ['📺', 'Sony Bravia 65-inch premium TV', 'in India', 140000],
    ['🧊', 'Pastel-colour Smeg refrigerator', 'in India', 250000], ['🍰', 'KitchenAid stand mixer', 'in India', 62000], ['🎮', 'GTA VI game', 'Standard Edition, India price', 5999],
    ['🚖', 'A cab fare from Navi Mumbai Airport to Andheri', 'Mumbai', 2500], ['🏍️', 'Royal Enfield Classic 350', 'starting price', 193000], ['🚙', 'Mahindra Thar Roxx', 'starting price', 1299000],
    ['⚡', 'Tata Harrier EV', 'starting price', 2149000], ['🚗', 'BMW 3 Series', 'starting price in India', 7590000], ['🛵', 'Honda Activa scooter', 'starting price', 80950],
    ['🚆', 'Mumbai local train ticket', 'Churchgate → Virar, second class, single journey', 20], ['💎', 'Swarovski crystal necklace', 'in India', 12000], ['🌸', 'Chanel No. 5 perfume, 100 ml', 'in India', 20000],
    ['💄', 'Dior Lip Glow lip balm', 'in India', 4000], ['🎨', 'Huda Beauty eyeshadow palette', 'in India', 6500], ['👠', 'Christian Louboutin red-sole heels', 'in India', 75000],
    ['👟', 'Nike Air Jordan 1 sneakers', 'in India', 16995], ['🕶️', 'Ray-Ban Wayfarer sunglasses', 'in India', 10990], ['👖', "Levi's premium jeans", 'in India', 3999],
    ['🧥', 'Zara blazer', 'in India', 7990], ['🥤', 'Stanley tumbler', 'bought in India', 3500], ['👜', 'Saint Laurent handbag', 'in India', 250000],
    ['⌚', 'Tissot PRX watch', 'in India', 42000], ['⌚', 'Rado watch', 'entry luxury range', 150000], ['🖋️', 'Montblanc pen', 'just to sign “Approved”', 50000],
    ['👜', 'Louis Vuitton Neverfull handbag', 'in India', 185000], ['🧱', 'LEGO Taj Mahal set', 'in India', 11999], ['🛥️', 'Private yacht rental in Goa', 'a few hours', 75000],
    ['✈️', 'Business-class Delhi–London return flight', 'in India', 250000], ['🏨', 'One night in a top Mumbai luxury hotel suite', 'Mumbai', 35000], ['👰', 'Designer bridal lehenga', 'in India', 350000],
    ['🪑', 'Gaming chair', 'for “serious productivity”', 45000], ['⌚', 'Apple Watch, standard model', 'in India', 49900], ['🎮', 'Newly released PlayStation game', 'in India', 4999],
    ['📖', 'Kindle Paperwhite', 'in India', 11999], ['💅', 'Full salon-style makeup kit', 'for one wedding event', 75000],
    ['🛩️', 'One B-2 Spirit stealth bomber', '🌍 Foreign wildcard', null, 2130000000], ['🌆', 'A penthouse apartment in Burj Khalifa', '🌍 Foreign wildcard', null, 823000], ['📱', 'iPhone 17, 256 GB', '🌍 Foreign wildcard — bought in the US', null, 899],
  ].map(([e, name, note, inr, usd], i) => ({ e, name, note, img: found[i + 1] ? '/img/' + found[i + 1] : undefined, ...(usd ? { usd } : { inr }) })),
};
