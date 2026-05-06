window.evaluateUnionArenaHand = function(handCards) {
  let zeroCostChars = 0;
  let oneCostChars = 0;
  let twoCostChars = 0;
  let threeCostChars = 0;
  let threePlusCostCards = 0;

  handCards.forEach(card => {
    if (!card) return;
    
    // We use the global helper functions established in the main builder
    let effectiveEnergy = window.getEffEnergy(card);
    let effectiveType = window.getEffType(card);

    if (window.isDualCost(window.getBaseCode(card))) {
        effectiveEnergy = 0;
        effectiveType = "Character";
    }

    if (effectiveType === "Event" || effectiveType === "Site" || effectiveType === "Action Point") {
      if (effectiveEnergy >= 3) threePlusCostCards++;
    } else if (effectiveType === "Character") {
      if (effectiveEnergy === 0) zeroCostChars++;
      else if (effectiveEnergy === 1) oneCostChars++;
      else if (effectiveEnergy === 2) twoCostChars++;
      
      if (effectiveEnergy === 3) threeCostChars++; 
      if (effectiveEnergy >= 3) threePlusCostCards++;
    }
  });

  let earlyDrops = zeroCostChars + oneCostChars + twoCostChars;

  // 1. Red Rules (Absolute Mulligans)
  if (zeroCostChars === 0) return 'Red';
  if (zeroCostChars === 1 && threePlusCostCards >= 6) return 'Red';

  // 2. Green Rules (The Energy Bridge)
  if (earlyDrops >= 3) return 'Green';
  if ((zeroCostChars + oneCostChars) >= 2 && threeCostChars >= 1) return 'Green';

  // 3. Yellow Rules (Risky Hands)
  return 'Yellow';
};