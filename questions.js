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

module.exports = {
  size: PAIRS.map(([r, t]) => ({ ref: obj(r), t: obj(t) })),
  price: [
    // India
    ['🥙', 'Vada pav', 'Mumbai street stall', 20], ['🍵', 'Cutting chai', 'Roadside stall', 15], ['🍜', 'Maggi 70 g pack', 'MRP', 14], ['🧈', 'Amul butter 500 g', 'MRP', 305],
    ['💧', 'Bisleri 1 litre bottle', 'MRP', 20], ['🍪', 'Parle-G small pack', 'MRP', 5], ['🥔', "Lay's Classic small pack", 'MRP', 20], ['🧂', 'Tata Salt 1 kg', 'MRP', 28],
    ['🚗', 'Maruti Alto K10', 'Base, ex-showroom', 400000], ['🚙', 'Tata Nexon', 'Base, ex-showroom', 730000], ['🚘', 'Hyundai Creta', 'Base, ex-showroom', 1100000], ['🛻', 'Toyota Fortuner', 'Base, ex-showroom', 3400000],
    ['⚡', 'Tesla Model Y in India', 'Launch price', 5989000], ['🏍️', 'Royal Enfield Classic 350', 'Base, ex-showroom', 190000], ['🏍️', 'Hero Splendor+', 'Ex-showroom', 76000], ['🛵', 'Honda Activa', 'Ex-showroom', 78000],
    ['🏍️', 'Royal Enfield Himalayan 450', 'Ex-showroom', 285000], ['🚗', 'Tata Nano at launch (2009)', 'Famous "1 lakh car"', 100000], ['🚙', 'Kia Seltos', 'Base, ex-showroom', 1100000], ['🏍️', 'Hero HF Deluxe', 'Ex-showroom', 60000],
    ['📱', 'iPhone 17 (256 GB) in India', 'Launch price', 82900], ['📱', 'iPhone 17 Pro Max in India', '256 GB launch price', 149900], ['💻', 'MacBook Air M4 in India', '13-inch, base', 99900], ['🎧', 'AirPods Pro 3 in India', 'Launch price', 25900],
    ['📱', 'Samsung Galaxy S25 Ultra', 'India launch price', 129999], ['📱', 'Google Pixel 10', 'India launch price', 79999],
    ['🔥', 'LPG cylinder 14.2 kg', 'Delhi, domestic', 853], ['⛽', 'Petrol, 1 litre', 'Delhi', 95], ['🛢️', 'Diesel, 1 litre', 'Delhi', 88],
    ['🕌', 'Taj Mahal ticket (Indian citizen)', 'Entry + main mausoleum', 250], ['🏰', 'Red Fort entry ticket', 'Indian citizen', 35], ['🗼', 'Qutub Minar entry ticket', 'Indian citizen', 40],
    ['📘', 'Passport fresh issue', '36 pages, normal', 1500], ['🎬', 'Netflix Basic plan in India', 'Per month', 199], ['🎵', 'Spotify Premium Individual', 'India, per month', 139], ['▶️', 'YouTube Premium Individual', 'India, per month', 149],
    ['📦', 'Amazon Prime annual plan', 'India', 1499], ['✉️', 'Indian postcard', 'India Post', 0.5], ['🚇', 'Delhi Metro minimum fare', 'Per trip', 10], ['🍫', 'Kurkure small pack', 'MRP', 20],
    // USA
    ['🍔', 'Big Mac', 'USA average', null, 6], ['☕', 'Starbucks Grande Latte', 'USA average', null, 5], ['🎧', 'AirPods Pro 3', 'USA price', null, 249], ['🚗', 'Tesla Model 3', 'USA base price', null, 37000],
    ['📱', 'iPhone 17 (256 GB) in USA', 'Launch price', null, 799], ['🏈', '30-second Super Bowl ad', 'USA', null, 8000000], ['⛽', 'Gallon of gas', 'USA average', null, 3.1], ['🌭', 'Costco hot dog + soda combo', 'USA', null, 1.5],
    ['✉️', 'US first-class Forever stamp', 'USA', null, 0.78], ['🚇', 'NYC subway ride', 'Per trip', null, 3],
  ].map(([e, name, note, inr, usd]) => (usd ? { e, name, note, usd } : { e, name, note, inr })),
};
