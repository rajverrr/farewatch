const historicalBenchmarks = require('../data/historicalBenchmarks.json');
const festivals = require('../data/festivals.json');

/**
 * Get route benchmark info or construct a reliable default.
 */
function getRouteBenchmark(origin, destination) {
  const routeKey = `${origin.toUpperCase()}-${destination.toUpperCase()}`;
  const reverseKey = `${destination.toUpperCase()}-${origin.toUpperCase()}`;

  if (historicalBenchmarks.routes[routeKey]) {
    return { ...historicalBenchmarks.routes[routeKey], key: routeKey };
  }
  if (historicalBenchmarks.routes[reverseKey]) {
    return { ...historicalBenchmarks.routes[reverseKey], key: reverseKey };
  }

  // Fallback heuristic based on generic domestic Indian flight distance
  return {
    key: routeKey,
    offSeasonMedian: historicalBenchmarks.defaultBenchmark.offSeasonMedian,
    festiveAverage: historicalBenchmarks.defaultBenchmark.festiveAverage,
    historicalPeak: historicalBenchmarks.defaultBenchmark.historicalPeak,
    strongBuyThreshold: historicalBenchmarks.defaultBenchmark.strongBuyThreshold,
    goodDealThreshold: historicalBenchmarks.defaultBenchmark.goodDealThreshold,
    typicalDuration: '2h 00m'
  };
}

/**
 * Match a travel date with an active festival if any.
 */
function matchFestival(dateStr) {
  const targetDate = new Date(dateStr);
  if (isNaN(targetDate)) return null;

  for (const fest of festivals) {
    const start = new Date(fest.rushStartDate);
    const end = new Date(fest.rushEndDate);
    // Include 5 days buffer before rush start
    const bufferStart = new Date(start);
    bufferStart.setDate(bufferStart.getDate() - 5);

    if (targetDate >= bufferStart && targetDate <= end) {
      return fest;
    }
  }
  return null;
}

/**
 * Evaluate a given price against historical baseline & festive timing.
 */
function evaluatePrice({ origin, destination, travelDate, currentPrice }) {
  const benchmark = getRouteBenchmark(origin, destination);
  const matchedFestival = matchFestival(travelDate);

  const today = new Date();
  const tripDate = new Date(travelDate);
  const diffTime = tripDate.getTime() - today.getTime();
  const daysUntilTrip = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  const { offSeasonMedian, festiveAverage, historicalPeak, strongBuyThreshold, goodDealThreshold } = benchmark;

  // Calculate Deal Score (0 - 100)
  // If price <= strongBuyThreshold, score is 90-100
  // If price == goodDealThreshold, score is ~75
  // If price == festiveAverage, score is ~50
  // If price >= historicalPeak, score is <= 20
  let dealScore = 50;
  if (currentPrice <= offSeasonMedian) {
    dealScore = 98;
  } else if (currentPrice <= strongBuyThreshold) {
    const ratio = (currentPrice - offSeasonMedian) / (strongBuyThreshold - offSeasonMedian || 1);
    dealScore = Math.round(98 - ratio * 10); // 88 - 98
  } else if (currentPrice <= goodDealThreshold) {
    const ratio = (currentPrice - strongBuyThreshold) / (goodDealThreshold - strongBuyThreshold || 1);
    dealScore = Math.round(88 - ratio * 15); // 73 - 88
  } else if (currentPrice <= festiveAverage) {
    const ratio = (currentPrice - goodDealThreshold) / (festiveAverage - goodDealThreshold || 1);
    dealScore = Math.round(73 - ratio * 23); // 50 - 73
  } else {
    const ratio = Math.min(1, (currentPrice - festiveAverage) / (historicalPeak - festiveAverage || 1));
    dealScore = Math.max(10, Math.round(50 - ratio * 40)); // 10 - 50
  }

  // Determine Verdict & Advice
  let verdict = 'FAIR_PRICE';
  let badgeText = 'Fair Price';
  let badgeColor = 'amber';
  let actionAdvice = '';

  if (currentPrice <= strongBuyThreshold) {
    verdict = 'STRONG_BUY';
    badgeText = '🔥 All-Time Festive Low';
    badgeColor = 'emerald';
    actionAdvice = `Fare is in the lowest 15% historical bracket for ${origin} ➔ ${destination}. Book immediately before seats in this fare bucket sell out.`;
  } else if (currentPrice <= goodDealThreshold) {
    verdict = 'GOOD_DEAL';
    badgeText = '✅ Good Deal';
    badgeColor = 'green';
    actionAdvice = `Solid price for festive travel. Saves you significantly compared to the average festive surge. Recommended to lock in.`;
  } else if (daysUntilTrip <= 20) {
    // Within 20 days of festival travel, prices almost never drop in India!
    verdict = 'URGENT_BOOKING_RUSH';
    badgeText = '⚠️ Late Booking Surge Active';
    badgeColor = 'rose';
    actionAdvice = `Only ${daysUntilTrip} days left. Historical data shows fares do NOT decrease from here—they usually escalate to peak levels. Book now to avoid further surge.`;
  } else if (currentPrice <= festiveAverage) {
    verdict = 'FAIR_PRICE';
    badgeText = '⚖️ Average Festive Rate';
    badgeColor = 'amber';
    actionAdvice = `Near typical festive average. If you are ${daysUntilTrip} days away, set a target price alert to see if a promotional airline flash sale occurs.`;
  } else {
    verdict = 'EXPENSIVE';
    badgeText = '🛑 Surge Pricing High';
    badgeColor = 'rose';
    actionAdvice = `Current price is near historical peak. If your travel dates are flexible (+/- 1 day), consider early morning or late night flights.`;
  }

  const savingsVsPeak = Math.max(0, historicalPeak - currentPrice);
  const savingsPercentVsPeak = Math.round((savingsVsPeak / historicalPeak) * 100);

  // Generate projected surge timeline for UI graph
  const surgeTimeline = historicalBenchmarks.defaultBenchmark.surgeTimelineDays.map(item => {
    const projectedPrice = Math.round(offSeasonMedian * item.multiplier);
    return {
      daysOut: item.daysOut,
      projectedPrice,
      label: `T-${item.daysOut}d`,
      note: item.note
    };
  });

  return {
    route: `${origin}-${destination}`,
    travelDate,
    daysUntilTrip,
    currentPrice,
    dealScore,
    verdict,
    badgeText,
    badgeColor,
    actionAdvice,
    matchedFestival: matchedFestival ? {
      id: matchedFestival.id,
      name: matchedFestival.name,
      icon: matchedFestival.icon,
      badge: matchedFestival.badge,
      peakDate: matchedFestival.peakDate
    } : null,
    benchmark: {
      offSeasonMedian,
      festiveAverage,
      historicalPeak,
      strongBuyThreshold,
      goodDealThreshold,
      savingsVsPeak,
      savingsPercentVsPeak
    },
    surgeTimeline
  };
}

module.exports = {
  getRouteBenchmark,
  matchFestival,
  evaluatePrice
};
