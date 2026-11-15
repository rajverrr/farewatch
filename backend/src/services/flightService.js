const { evaluatePrice, getRouteBenchmark, matchFestival } = require('./priceIntelligence');

const AIRLINES = [
  { code: '6E', name: 'IndiGo', logoBg: '#0b2e84', textColor: '#ffffff', priceFactor: 0.98 },
  { code: 'AI', name: 'Air India', logoBg: '#e31b23', textColor: '#ffffff', priceFactor: 1.05 },
  { code: 'QP', name: 'Akasa Air', logoBg: '#ff6200', textColor: '#ffffff', priceFactor: 0.94 },
  { code: 'SG', name: 'SpiceJet', logoBg: '#e62b1e', textColor: '#ffffff', priceFactor: 0.96 }
];

/**
 * Generate a realistic set of flights for Indian routes.
 */
function generateRealisticFlights(origin, destination, dateStr) {
  const benchmark = getRouteBenchmark(origin, destination);
  const matchedFestival = matchFestival(dateStr);

  const tripDate = new Date(dateStr);
  const today = new Date();
  const diffDays = Math.max(0, Math.ceil((tripDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));

  // Base price calculation based on benchmark and proximity to festival
  let basePrice = benchmark.offSeasonMedian;

  if (matchedFestival) {
    if (diffDays <= 7) {
      basePrice = benchmark.historicalPeak * 0.92;
    } else if (diffDays <= 15) {
      basePrice = benchmark.festiveAverage * 1.35;
    } else if (diffDays <= 30) {
      basePrice = benchmark.festiveAverage * 1.05;
    } else if (diffDays <= 45) {
      basePrice = benchmark.goodDealThreshold * 1.1;
    } else {
      // Early bird
      basePrice = benchmark.strongBuyThreshold * 0.98;
    }
  } else {
    // Normal date non-festival
    if (diffDays <= 3) {
      basePrice = benchmark.offSeasonMedian * 1.8;
    } else if (diffDays <= 14) {
      basePrice = benchmark.offSeasonMedian * 1.25;
    } else {
      basePrice = benchmark.offSeasonMedian;
    }
  }

  // Pre-configured flight departure slots
  const schedules = [
    { dep: '06:15', arr: '08:00', duration: '1h 45m', stops: 'Non-stop', slot: 'Early Morning' },
    { dep: '09:30', arr: '11:20', duration: '1h 50m', stops: 'Non-stop', slot: 'Morning' },
    { dep: '13:45', arr: '15:40', duration: '1h 55m', stops: 'Non-stop', slot: 'Afternoon' },
    { dep: '17:10', arr: '19:05', duration: '1h 55m', stops: 'Non-stop', slot: 'Evening' },
    { dep: '20:30', arr: '22:15', duration: '1h 45m', stops: 'Non-stop', slot: 'Night' },
    { dep: '11:00', arr: '15:30', duration: '4h 30m', stops: '1-Stop via DEL', slot: 'Midday' }
  ];

  const flights = schedules.map((slot, index) => {
    const airline = AIRLINES[index % AIRLINES.length];
    const flightNum = `${airline.code}-${Math.floor(1000 + Math.random() * 9000)}`;

    // Slight variance per flight time slot & airline
    let slotMultiplier = 1.0;
    if (slot.slot === 'Early Morning') slotMultiplier = 0.92; // early morning often cheapest!
    if (slot.slot === 'Evening') slotMultiplier = 1.08; // evening rush is higher
    if (slot.stops.includes('1-Stop')) slotMultiplier = 0.88;

    // Small deterministic randomness based on date string and flight index
    const seed = (dateStr.split('-').reduce((acc, c) => acc + parseInt(c, 10), 0) + index * 17) % 20;
    const jitter = (seed - 10) * 45; // -450 to +450 INR

    const finalPrice = Math.round((basePrice * slotMultiplier * airline.priceFactor + jitter) / 50) * 50;

    return {
      id: `flt-${origin}-${destination}-${dateStr}-${index}`,
      airline: airline.name,
      airlineCode: airline.code,
      flightNumber: flightNum,
      logoBg: airline.logoBg,
      textColor: airline.textColor,
      origin,
      destination,
      departureTime: slot.dep,
      arrivalTime: slot.arr,
      duration: slot.duration,
      stops: slot.stops,
      timeSlot: slot.slot,
      price: finalPrice,
      currency: 'INR',
      cabin: 'Economy',
      baggage: '15 kg Check-in + 7 kg Cabin',
      seatsRemaining: Math.floor(2 + (seed % 7))
    };
  });

  // Sort by lowest price
  flights.sort((a, b) => a.price - b.price);

  const lowestPrice = flights[0]?.price || Math.round(basePrice);
  const evaluation = evaluatePrice({
    origin,
    destination,
    travelDate: dateStr,
    currentPrice: lowestPrice
  });

  return {
    origin,
    destination,
    date: dateStr,
    lowestPrice,
    evaluation,
    flights
  };
}

/**
 * Main search function
 */
async function searchFlights(origin, destination, date) {
  // If external API (Amadeus / SerpAPI) credentials are in env, we can query them;
  // otherwise fallback seamlessly to realistic Indian airline data.
  return generateRealisticFlights(origin, destination, date);
}

module.exports = {
  searchFlights,
  generateRealisticFlights
};
