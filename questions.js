// size: guess target's longest dimension (metres) against the reference. price: guess in INR (usd items converted at RATE).
// Figures are approximate public numbers - skim before the event.
module.exports = {
  size: [
    { ref: { e: '🧍', name: 'Adult human (height)', m: 1.7 }, t: { e: '🗿', name: 'Statue of Unity, Gujarat (height)', m: 182 } },
    { ref: { e: '🦒', name: 'Giraffe (height)', m: 5.5 }, t: { e: '🗼', name: 'Qutub Minar, Delhi (height)', m: 72.5 } },
    { ref: { e: '🚌', name: 'Indian city bus (length)', m: 12 }, t: { e: '🏛️', name: 'Gateway of India, Mumbai (height)', m: 26 } },
    { ref: { e: '🗽', name: 'Statue of Liberty with pedestal (height)', m: 93 }, t: { e: '🕌', name: 'Taj Mahal (height to finial)', m: 73 } },
    { ref: { e: '🗼', name: 'Eiffel Tower (height)', m: 330 }, t: { e: '🌉', name: 'Howrah Bridge, Kolkata (length)', m: 705 } },
    { ref: { e: '🌉', name: 'Golden Gate Bridge (length)', m: 2737 }, t: { e: '🌉', name: 'Bandra-Worli Sea Link (length)', m: 5600 } },
    { ref: { e: '🧍', name: 'Adult human (height)', m: 1.7 }, t: { e: '🐘', name: 'Indian elephant (shoulder height)', m: 2.75 } },
    { ref: { e: '🧍', name: 'Adult human (height)', m: 1.7 }, t: { e: '🏏', name: 'Cricket pitch (length)', m: 20.12 } },
    { ref: { e: '🛺', name: 'Auto-rickshaw (length)', m: 2.6 }, t: { e: '🏯', name: 'Hawa Mahal, Jaipur (height)', m: 15 } },
    { ref: { e: '🚌', name: 'Indian city bus (length)', m: 12 }, t: { e: '🕌', name: 'Charminar, Hyderabad (height)', m: 56 } },
    { ref: { e: '🐋', name: 'Blue whale (length)', m: 25 }, t: { e: '🚀', name: 'ISRO LVM3 rocket (height)', m: 43.5 } },
    { ref: { e: '🗼', name: 'Qutub Minar (height)', m: 72.5 }, t: { e: '🏙️', name: 'Empire State Building, NYC (to tip)', m: 443 } },
  ],
  price: [
    { e: '🥙', name: 'Vada pav', note: 'Mumbai street stall', inr: 20 },
    { e: '🧈', name: 'Amul butter 500 g', note: 'MRP', inr: 300 },
    { e: '🚗', name: 'Maruti Alto K10', note: 'Base, ex-showroom', inr: 400000 },
    { e: '🏍️', name: 'Royal Enfield Classic 350', note: 'Base, ex-showroom', inr: 190000 },
    { e: '📱', name: 'iPhone 17 (256 GB) in India', note: 'Launch price', inr: 82900 },
    { e: '⛽', name: 'Petrol, 1 litre', note: 'Delhi', inr: 95 },
    { e: '🍜', name: 'Maggi 70 g pack', note: 'MRP', inr: 14 },
    { e: '🚙', name: 'Tata Nexon', note: 'Base, ex-showroom', inr: 730000 },
    { e: '🍔', name: 'Big Mac', note: 'USA average', usd: 6 },
    { e: '⚡', name: 'Tesla Model 3', note: 'USA base price', usd: 37000 },
    { e: '🎧', name: 'AirPods Pro 3', note: 'USA price', usd: 249 },
    { e: '☕', name: 'Starbucks Grande Latte', note: 'USA average', usd: 5 },
  ],
};
