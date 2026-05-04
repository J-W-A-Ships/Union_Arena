window.runDeckSenseiAnalysis = function(deck, allCards, setName) {
    let colors = new Set();
    let zeroCostChars = 0, triggersCount = 0, specialCount = 0, colorCount = 0, finalCount = 0, raidCount = 0;
    let oneTwoCostChars = 0, pureOneTwoCostChars = 0, threeCostChars = 0, fourPlusCostChars = 0;
    let siteCount = 0, eventCount = 0;
    let hasTriggerExemption = false;
    
    let lowCostDrawCount = 0;
    let midCostSearchCount = 0;
    let twoGenCount = 0;
    let highestCost = 0;

    for (let uid in deck) {
        const qty = deck[uid];
        const card = allCards.find(c => c.uid === uid);
        if (!card) continue;
        
        const baseCode = getBaseCode(card);
        if (card.color) colors.add(card.color);
        
        if (baseCode.includes("EVA-1-081") || baseCode.includes("EVA-1-082") || baseCode.includes("NIK-1-043")) hasTriggerExemption = true;

        const cTrigger = cleanTrigger(card.trigger);
        if (cTrigger !== "None") {
            triggersCount += qty;
            if (cTrigger === "Special") specialCount += qty;
            if (cTrigger === "Color") colorCount += qty;
            if (cTrigger === "Final") finalCount += qty;
            if (cTrigger === "Raid") raidCount += qty;
        }

        let e = getEffEnergy(card), t = getEffType(card);
        let isDual = isDualCost(baseCode);
        let effectText = (card.effect || "").toLowerCase();

        if (card.genEnergy === 2) twoGenCount += qty;

        if (t === "Character") {
            if (e > highestCost) highestCost = e;
            
            if (e === 0 || isDual) zeroCostChars += qty;
            
            if (e === 1 || e === 2 || isDual) {
                oneTwoCostChars += qty; 
                if (!isDual) pureOneTwoCostChars += qty; 
            }
            
            if (e === 3) threeCostChars += qty;
            if (e >= 4) fourPlusCostChars += qty;

            if (baseCode.includes("RNK-1-088")) {
                fourPlusCostChars += qty;
            }
            
            if (e === 0 && (effectText.includes("draw") || effectText.includes("look") || effectText.includes("search"))) {
                lowCostDrawCount += qty;
            }
            if (e > 0 && effectText.includes("look")) {
                midCostSearchCount += qty;
            }
        } else if (t === "Site") {
            siteCount += qty;
        } else if (t === "Event") {
            eventCount += qty;
        }
    }

    let errors = [], warnings = [], successes = [];

    // --- COLORS ---
    if (colors.size > 1) errors.push("Decks should only include cards from one energy color.");
    else successes.push("Deck uses a single energy color.");

    // --- ZERO COSTS ---
    if (zeroCostChars < 10) errors.push("Your deck might not have enough zero-cost characters to start games consistently. Consider adding a few more.");
    else if (zeroCostChars === 10) warnings.push("Double check your zero-cost characters to ensure a consistent early game.");
    else if (zeroCostChars >= 11 && zeroCostChars <= 13) successes.push("Solid foundation of zero-cost characters!");
    else warnings.push("Make sure you aren’t running too many low cost characters.");

    // --- TRIGGERS ---
    if (hasTriggerExemption) successes.push("Deck runs specific non-trigger synergy cards!");
    else if (triggersCount >= 42) successes.push("Excellent overall trigger density!");
    else if (triggersCount >= 38) warnings.push("Your trigger count is running a bit low. Double check your defensive options.");
    else errors.push("Your trigger count is dangerously low, leaving you highly vulnerable defensively. Consider adding more!");

    if (specialCount !== 4 || colorCount !== 4 || finalCount !== 4) warnings.push("Double check your unique triggers. Most optimal builds balance their Special, Color, and Final triggers more evenly.");
    else successes.push("Perfectly balanced Special, Color, and Final triggers!");

    if (raidCount > 12) errors.push("Your deck features a very high number of Raid triggers. This can lead to bricked hands. Consider reducing them.");
    else successes.push("Safe number of Raid triggers!");

    // --- CURVE ---
    if (oneTwoCostChars < 6) errors.push("Your deck lacks mid-game bridge characters. Consider adding more 1 or 2 energy cost cards.");
    else if (pureOneTwoCostChars > 10) warnings.push("You have an unusually high number of 1 and 2 energy cost characters. Make sure you aren't sacrificing late-game power.");
    else successes.push("Great mid-game bridge with your 1 and 2 energy characters!");

    if (threeCostChars < 4) warnings.push("Your deck has very few 3-cost characters. Most strong decks run at least four to maintain mid-game tempo. Double check your curve.");
    else successes.push("Solid presence of 3-cost characters!");

    if (fourPlusCostChars < 8) errors.push("Your deck lacks enough main high BP attackers to close out games. Consider adding more heavy hitters.");
    else if (fourPlusCostChars >= 8 && fourPlusCostChars <= 11) warnings.push(`Deck has only ${fourPlusCostChars} main high BP attackers. Consider more for an optimal build.`);
    else if (fourPlusCostChars === 16) warnings.push("Too many high cost characters (16) can make your deck inconsistent and prone to bricking.");
    else if (fourPlusCostChars > 16) errors.push("Way too many high cost characters (17+). This will make your deck highly inconsistent and prone to bricking.");
    else successes.push("Strong, reliable core of main high BP attackers!");

    // --- SEMANTIC MECHANICS ---
    if (lowCostDrawCount > 0) successes.push("Bonus points for including low-cost draw character!");
    else warnings.push("Make sure you aren't sacrificing low-cost draw support.");

    if (midCostSearchCount >= 4) successes.push("Solid amount of characters with search/look effects.");
    else if (midCostSearchCount === 0) warnings.push("Make sure you have enough characters with search effects to ensure you find the cards you need.");
    
    // --- ENERGY GENERATION ---
    if (highestCost <= 4) {
        if (twoGenCount >= 6 && twoGenCount <= 8) successes.push("Perfect energy generation for a low-curve deck.");
        else if (twoGenCount >= 4) warnings.push("Consider adding a couple more 2-energy generators to smooth out your plays.");
        else errors.push("Your deck lacks enough 2-energy generators to consistently build your board.");
    } else if (highestCost === 5) {
        if (twoGenCount >= 8) successes.push("Solid energy base to support your 5-cost hitters.");
        else warnings.push("You may struggle to drop your 5-cost characters. Consider bumping up your 2-energy generators.");
    } else if (highestCost === 6) {
        if (twoGenCount >= 10) successes.push("Great energy generation to reliably play your heavy 6-cost cards.");
        else warnings.push("You run the risk of stalling before playing your 6-cost characters. Try fitting in more 2-energy generators.");
    } else if (highestCost > 6) {
        if (twoGenCount > 12) successes.push("Outstanding energy base to drop your massive boss monsters.");
        else if (twoGenCount >= 10) warnings.push("For ultra-heavy decks, more energy is always better. Consider finding room for extra 2-energy generators.");
        else errors.push("You simply don't have enough 2-energy generation to play your massive characters. You need a lot more.");
    }

    // --- SITES & EVENTS ---
    const isBlueDemonSlayer = setName === "Demon Slayer" && colors.has("Blue");
    if (siteCount > 4 && !isBlueDemonSlayer) warnings.push(`Your deck runs ${siteCount} site cards. Most decks don't run more than four. Outside of specific builds, consider reducing your field count to avoid dead hands.`);
    else if (siteCount > 0) successes.push("Optimal number of site cards!");

    if (eventCount > 12) warnings.push(`Your deck runs a high number of events (over 12). Consider swapping some out for characters to maintain strong board presence.`);
    else if (eventCount > 0) successes.push("Safe number of event cards!");

    return { errors, warnings, successes };
};
