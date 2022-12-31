function dimShiftDisplay(){
	var shiftRequirement = getShiftRequirement(0);
	var isShift = player.resets < (inNC(4) || player.currentChallenge == "postc1" || player.pSac !== undefined ? 2 : 4)
	el("resetLabel").textContent = 'Dimension ' + (isShift ? "Shift" : player.resets < getSupersonicStart() ? "Boost" : "Supersonic") + ' ('+ getFullExpansion(Math.ceil(player.resets)) +'): requires ' + getFullExpansion(Math.ceil(shiftRequirement.amount)) + " " + DISPLAY_NAMES[shiftRequirement.tier] + " Dimensions"
	el("softReset").textContent = "Reset the game for a " + (isShift ? "new Dimension" : "Boost")
}

function tickspeedBoostDisplay(){
	if (isTickspeedBoostPossible()) {
		var tickReq = getTickspeedBoostRequirement()
		el("tickReset").style.display = ""
		el("tickResetLabel").textContent = "Tickspeed Boost (" + getFullExpansion(player.tickspeedBoosts) + "): requires " + getFullExpansion(tickReq.amount) + " " + DISPLAY_NAMES[tickReq.tier] + " Dimensions"
		el("tickResetBtn").className = getAmount(tickReq.tier) < tickReq.amount ? "unavailablebtn" : "storebtn"
	} else el("tickReset").style.display = "none"
}

function galaxyReqDisplay(){
	var nextGal = getGalaxyRequirement(0, true)
	var totalReplGalaxies = getTotalRG()
	var totalTypes = tmp.aeg ? 4 : player.dilation.freeGalaxies ? 3 : totalReplGalaxies ? 2 : 1
	el("secondResetLabel").innerHTML = getGalaxyScaleName(nextGal.scaling) + (nextGal.scaling <= 3 ? "Antimatter " : "") + ' Galaxies ('+ getFullExpansion(player.galaxies) + (totalTypes > 1 ? ' + ' + getFullExpansion(totalReplGalaxies) : '') + (totalTypes > 2 ? ' + ' + getFullExpansion(Math.round(player.dilation.freeGalaxies)) : '') + (totalTypes > 3 ? ' + ' + getFullExpansion(tmp.aeg) : '') +'): requires ' + getFullExpansion(nextGal.amount) + ' '+DISPLAY_NAMES[inNC(4) || player.pSac != undefined ? 6 : 8]+' Dimensions'
}

var galaxyScalings = ["", "Distant ", "Farther ", "Remote ", "Obscure ", "Dark ", "Spectre ", "Ethereal ", "Ethereal++ ", "Ethereal IV ", "Ethereal V "]
function getGalaxyScaleName(x) {
	return galaxyScalings[x]
}

function intergalacticDisplay(){
	if (hasAch("ng3p27") && getShiftRequirement(0).tier == 8) {
		el("intergalacticLabel").parentElement.style.display = ""
		let nanopart = 1
		if (isNanoEffectUsed("dil_effect_exp")) nanopart = tmp.nf.effects["dil_effect_exp"] || 1
		el("intergalacticLabel").innerHTML = 
			getGalaxyScaleName(tmp.igs) + 'Intergalactic Boost ' + 
			(player.dilation.active || player.galacticSacrifice != undefined ? " (estimated)" : "") +
			" (" + getFullExpansion(player.galaxies) + (Math.floor(tmp.igg - player.galaxies) > 0 ? " + " + 
			getFullExpansion(Math.floor(tmp.igg - player.galaxies)) : "") + "): " + 
			shorten(dilates(tmp.ig).pow(player.dilation.active ? nanopart : 1)) + 
			'x to Eighth Dimensions'
	} else el("intergalacticLabel").parentElement.style.display = "none"
}

function dimensionTabDisplay(){
	var shown
	for (let tier = 8; tier > 0; tier--) {
		shown = shown || canBuyDimension(tier)
		var name = TIER_NAMES[tier];
		if (shown) {
			el(tier + "Row").style.display = ""
			el("D" + tier).childNodes[0].nodeValue = DISPLAY_NAMES[tier] + " Dimension x" + formatValue(player.options.notation, getDimensionFinalMultiplier(tier), 2, 1)
			el("A" + tier).textContent = getDimensionDescription(tier)
		}
	}
	setAndMaybeShow("mp10d", aarMod.newGameMult, "'Multiplier per 10 Dimensions: '+shorten(getDimensionPowerMultiplier(\"non-random\"))+'x'")
	dimShiftDisplay()
	tickspeedBoostDisplay()
	galaxyReqDisplay()
	intergalacticDisplay()
}

function tickspeedDisplay(){
	if (canBuyDimension(3) || player.currentEternityChall == "eterc9") {
		var tickmult = tmp.tsReduce
		var tickmultNum = tickmult.toNumber()
		var ticklabel
		var e = Math.floor(Math.log10(Math.round(1/tickmultNum)))
		if (isNaN(tickmultNum)) ticklabel = 'Break the tick interval by Infinite';
		else if (e >= 9) ticklabel = "Divide the tick interval by " + shortenDimensions(Decimal.recip(tickmult))
		else if (tickmultNum > .9) ticklabel = 'Reduce the tick interval by ' + shorten((1 - tickmultNum) * 100) + '%'
		else ticklabel = 'Reduce the tick interval by ' + ((1 - tickmultNum) * 100).toFixed(e) + '%'
		let ic3mult=getPostC3Mult()
		if (player.galacticSacrifice || player.currentChallenge == "postc3" || isIC3Trapped()) el("tickLabel").innerHTML = ((isIC3Trapped() || player.currentChallenge == "postc3") && player.currentChallenge != "postcngmm_3" && !player.challenges.includes("postcngmm_3") && !tmp.be ? "M" : ticklabel + '<br>and m') + 'ultiply all dimensions by ' + (ic3mult > 999.95 ? shorten(ic3mult) : E(ic3mult).toNumber().toPrecision(4)) + '.'
		else el("tickLabel").textContent = ticklabel + '.'

		el("tickSpeed").style.visibility = "visible";
		el("tickSpeedMax").style.visibility = "visible";
		el("tickLabel").style.visibility = "visible";
		el("tickSpeedAmount").style.visibility = "visible";
	} else {
		el("tickSpeed").style.visibility = "hidden";
		el("tickSpeedMax").style.visibility = "hidden";
		el("tickLabel").style.visibility = "hidden";
		el("tickSpeedAmount").style.visibility = "hidden";
	}
}

function paradoxDimDisplay(){
	el("pPow").textContent = shortenMoney(player.pSac.dims.power)
	el("pPowProduction").textContent = "You are getting " + shortenDimensions(getPDProduction(1).div(getEC12Mult())) + " Paradox Power per second."
	el("pPowEffect").textContent = getFullExpansion(Math.floor(getExtraTime() * getEC12Mult()))
	var shown
	for (let t = 8; t > 0; t--) {
		shown = shown || isDimUnlocked(t)
		el("pR"+t).style.display = shown ? "" : "none"
		if (shown) {
			el("pD"+t).textContent = DISPLAY_NAMES[t] + " Paradox Dimension x" + shortenMoney(getPDPower(t))
			el("pB"+t).textContent = "Cost: " + shortenDimensions(player.pSac.dims[t].cost) + " Px"
			el("pB"+t).className = (player.pSac.px.gte(player.pSac.dims[t].cost) ? "stor" : "unavailabl") + "ebtn"
			el("pA"+t).textContent = getPDDesc(t)
		}
	}
}

function mainStatsDisplay(){
	el("totalmoney").textContent = 'You have made a total of ' + shortenMoney(player.totalmoney) + ' antimatter.'
	el("totalresets").textContent = 'You have performed ' + getFullExpansion(player.resets) + ' Dimension Boosts/Shifts.'
	setAndMaybeShow("lostResets", player.pSac && player.pSac.lostResets, '"You have lost a total of " + getFullExpansion(player.pSac.lostResets) + " Dimension Boosts/Shifts after matter resets."')
	el("tdboosts").textContent = aarMod.ngmX > 3 ? 'You have performed ' + getFullExpansion(player.tdBoosts) + ' Time Dimension Boosts/Shifts.':""
	var showBoosts=isTickspeedBoostPossible()
	el("boosts").style.display = showBoosts ? '' : 'none'
	if (showBoosts) el("boosts").textContent = 'You have performed '+getFullExpansion(player.tickspeedBoosts)+' Tickspeed Boosts.'
	el("galaxies").textContent = 'You have ' + getFullExpansion(player.galaxies) + ' Antimatter Galaxies.'
	var showCancer = player.spreadingCancer > 0 && player.galacticSacrifice
	el("spreadingCancer").style.display = showCancer ? '' : 'none'
	if (showCancer) el("spreadingCancer").textContent = 'You have made '+getFullExpansion(player.spreadingCancer)+' total galaxies while using Cancer notation.'
	el("totalTime").textContent = "You have played for " + timeDisplay(player.totalTimePlayed) + "."
}

function paradoxSacDisplay(){
	if (player.pSac && player.pSac.times) {
		el("psStatistics").style.display = ""
		el("pSacrificedNormal").textContent = "You have Paradox Sacrificed " + getFullExpansion(player.pSac.normalTimes) + " times."
		el("pSacrificedForced").textContent = "You have been forced to do a Paradox Sacrifice " + getFullExpansion(player.pSac.forcedTimes) + " times."
		el("pSacrificed").textContent = "You have Paradox Sacrificed a total of " + getFullExpansion(player.pSac.times) + " times."
		el("thisPSac").textContent = "You have spent " + timeDisplay(player.pSac.time) + " in this Paradox Sacrifice."
	} else el("psStatistics").style.display = "none"
}

function galaxySacDisplay(){
	if (player.galacticSacrifice ? player.galacticSacrifice.times < 1 : true) el("gsStatistics").style.display = "none"
	else {
		el("gsStatistics").style.display = ""
		el("sacrificed").textContent = "You have Galactic Sacrificed "+getFullExpansion(player.galacticSacrifice.times) + " times."
		el("thisSacrifice").textContent = "You have spent " + timeDisplay(player.galacticSacrifice.time) + " in this Galactic Sacrifice."
	}
}

function bestInfinityDisplay(){
	el("infinityStatistics").style.display = "none"
	if (player.bestInfinityTime >= 9999999999) {
		el("bestInfinity").textContent = ""
		el("thisInfinity").textContent = ""
		el("infinitied").textContent = ""
	} else {
		el("infinityStatistics").style.display = ""
		el("bestInfinity").textContent = "Your fastest Infinity is in " + timeDisplay(player.bestInfinityTime) + "."
		el("thisInfinity").textContent = "You have spent " + timeDisplay(player.thisInfinityTime) + " in this Infinity."
		el("infinitied").textContent = "You have Infinitied " + getFullExpansion(player.infinitied) + " time" + (player.infinitied == 1 ? "" : "s") + (player.eternities!==0||player.eternitiesBank>0 ? " this Eternity." : ".")
	}
	if (player.infinitiedBank>0) el("infinityStatistics").style.display = ""
}

function bestEternityDisplay(){
	el("eternityStatistics").style.display = "none"
	if (player.eternities == 0) {
		el("besteternity").textContent = ""
		el("thiseternity").textContent = ""
		el("eternitied").textContent = ""
	} else {
		el("eternityStatistics").style.display = "inline-block"
		if (player.bestEternity >= 9999999999) {
			el("besteternity").textContent = ""
		} else el("besteternity").textContent = "Your fastest Eternity is in "+timeDisplay(player.bestEternity)+"."
		el("thiseternity").textContent = "You have spent " + timeDisplay(player.thisEternity) + " in this Eternity."
		el("eternitied").textContent = "You have Eternitied " + getFullExpansion(player.eternities) + " time" + (player.eternities == 1 ? "" : "s") + (quantumed ? " this Quantum." : ".")
	}
	if (player.eternitiesBank > 0) el("eternityStatistics").style.display = ""
}

function bestQuantumDisplay(){
	if (!quantumed) el("quantumStatistics").style.display = "none"
	else {
		el("quantumStatistics").style.display = ""
		el("quantumed").textContent = "You have gone Quantum " + getFullExpansion(quSave.times) + " times."
		el("thisQuantum").textContent = "You have spent " + timeDisplay(quSave.time) + " in this Quantum."
		el("bestQuantum").textContent = "Your fastest Quantum is in " + timeDisplay(quSave.best) + "."
	}
}

function bestGhostifyDisplay(){
	if (!ghostified) el("ghostifyStatistics").style.display = "none"
	else {
		el("ghostifyStatistics").style.display = ""
		el("ghostified").textContent = "You fundamented universes " + getFullExpansion(ghSave.times) + " times."
		el("thisGhostify").textContent = "You have spent " + timeDisplay(ghSave.time) + " in this Fundament."
		el("bestGhostify").textContent = "Your fastest Fundament is in " + timeDisplay(ghSave.best) + "."
		el("bTicks").textContent = ghSave.wzb.unl ? "You have played Bosonic Lab for " + timeDisplay(ghSave.bl.ticks.mul(10).toNumber()) + ". (x" + shorten(getBosonicFinalSpeed()) + ")" : ""
	}
}

function ng3p51Display(){
	if (!hasAch("ng3p51"))  el("bigRipStatistics").style.display = "none"
	else {
		el("bigRipStatistics").style.display = ""
		setAndMaybeShow("bigRipped", brSave.times, '"You have big ripped the universe " + getFullExpansion(brSave.times) + " times."')
		setAndMaybeShow("bestmoneythisrip", brSave.active, "'Your best antimatter for this Big Rip is ' + shortenMoney(brSave.bestThisRun) + '.'")
		el("totalmoneybigrip").textContent = 'You have made a total of ' + shortenMoney(brSave.totalAntimatter) + ' antimatter in all big rips.'
		el("bestgalsbigrip").textContent = 'Your best amount of normal galaxies for all Big Rips is ' + getFullExpansion(brSave.bestGals) + "."
	}
}

function dilationStatsDisplay(){
	if (player.dilation.times) el("dilated").textContent = "You have succesfully dilated "+getFullExpansion(player.dilation.times)+" times."
	else el("dilated").textContent = ""

	if (player.exdilation == undefined ? false : player.exdilation.times > 1) el("exdilated").textContent = "You have reversed Dilation " + getFullExpansion(player.exdilation.times) + " times."
	else el("exdilated").textContent = ""
}

function scienceNumberDisplay(){
	var scale1 = [2.82e-45,1e-42,7.23e-30,5e-21,9e-17,6.2e-11,5e-8,3.555e-6,7.5e-4,1,2.5e3,2.6006e6,3.3e8,5e12,4.5e17,1.08e21,1.53e24,1.41e27,5e32,8e36,1.7e45,1.7e48,3.3e55,3.3e61,5e68,1e73,3.4e80,1e113,Number.MAX_VALUE,E("1e65000")];
	var scale2 = [" protons."," nucleui."," Hydrogen atoms."," viruses."," red blood cells."," grains of sand."," grains of rice."," teaspoons."," wine bottles."," fridge-freezers."," Olympic-sized swimming pools."," Great Pyramids of Giza."," Great Walls of China."," large asteroids.",
		      " dwarf planets."," Earths."," Jupiters."," Suns."," red giants."," hypergiant stars."," nebulas."," Oort clouds."," Local Bubbles."," galaxies."," Local Groups."," Sculptor Voids."," observable universes."," Dimensions.", " Infinity Dimensions.", " Time Dimensions."];
	var id = 0;
	if (player.money.times(4.22419).gt(2.82e60)) {
		if (player.money.times(4.22419e-105).gt(scale1[scale1.length - 1])) id = scale1.length - 1;
		else {
			while (player.money.times(4.22419e-105).gt(scale1[id])) id++;
			if (id > 0) id--;
		}
		if (id >= 7 && id < 11) el("infoScale").textContent = "If every antimatter were a planck volume, you would have enough to fill " + formatValue(player.options.notation, player.money * 4.22419e-105 / scale1[id], 2, 1) + scale2[id];
		else el("infoScale").textContent = "If every antimatter were a planck volume, you would have enough to make " + formatValue(player.options.notation, player.money.times(4.22419e-105).dividedBy(scale1[id]), 2, 1) + scale2[id];
	} else { //does this part work correctly? i doubt it does
		if (player.money.lt(2.82e9)) el("infoScale").textContent = "If every antimatter were " + formatValue(player.options.notation, 2.82e9 / player.money, 2, 1) + " attometers cubed, you would have enough to make a proton."
		else if (player.money.lt(2.82e18)) el("infoScale").textContent = "If every antimatter were " + formatValue(player.options.notation, 2.82e18 / player.money, 2, 1) + " zeptometers cubed, you would have enough to make a proton."
		else if (player.money.lt(2.82e27)) el("infoScale").textContent = "If every antimatter were " + formatValue(player.options.notation, 2.82e27 / player.money, 2, 1) + " yoctometers cubed, you would have enough to make a proton."
		else el("infoScale").textContent = "If every antimatter were " + formatValue(player.options.notation, (2.82e-45 / 4.22419e-105 / player.money), 2, 1) + " planck volumes, you would have enough to make a proton."
	}
}

function infinityRespecedInfinityDisplay(){
	if (setUnlocks.length > player.setsUnlocked) el("nextset").textContent = "Next set unlocks at " + formatValue(player.options.notation, setUnlocks[player.setsUnlocked], 2, 0, true) + "."
	el("infi1pow").textContent = getFullExpansion(player.infinityUpgradesRespecced[1] * 10)
	el("infi1cost").textContent = shortenCosts(pow10(player.infinityUpgradesRespecced[1]))
	el("infi1").className = player.infinityPoints.lt(pow10(player.infinityUpgradesRespecced[1])) ? "infinistorebtnlocked" : "infinimultbtn"
	el("infi3pow").textContent = formatValue(player.options.notation, getLimit(), 2, 0, true)
	el("infi3cost").textContent = shortenCosts(pow10(player.infinityUpgradesRespecced[3]))
	el("infi3").className = player.infinityPoints.lt(pow10(player.infinityUpgradesRespecced[3])) ? "infinistorebtnlocked" : "infinimultbtn"
}

function infinityUpgradesDisplay(){
	if (player.infinityUpgrades.includes("timeMult")) el("infi11").className = "infinistorebtnbought"
	else if (player.infinityPoints.gte(1)) el("infi11").className = "infinistorebtn1"
	else el("infi11").className = "infinistorebtnlocked"
	if (player.infinityUpgrades.includes("dimMult")) el("infi21").className = "infinistorebtnbought"
	else if (player.infinityPoints.gte(1)) el("infi21").className = "infinistorebtn2"
	else el("infi21").className = "infinistorebtnlocked"
	if (player.infinityUpgrades.includes("18Mult")) el("infi12").className = "infinistorebtnbought"
	else if (player.infinityPoints.gte(1)&&player.infinityUpgrades.includes("timeMult")) el("infi12").className = "infinistorebtn1"
	else el("infi12").className = "infinistorebtnlocked"
	if (player.infinityUpgrades.includes("27Mult")) el("infi22").className = "infinistorebtnbought"
	else if (player.infinityPoints.gte(1)&&player.infinityUpgrades.includes("dimMult")) el("infi22").className = "infinistorebtn2"
	else el("infi22").className = "infinistorebtnlocked"
	if (player.infinityUpgrades.includes("36Mult")) el("infi13").className = "infinistorebtnbought"
	else if (player.infinityPoints.gte(1)&&player.infinityUpgrades.includes("18Mult")) el("infi13").className = "infinistorebtn1"
	else el("infi13").className = "infinistorebtnlocked"
	if (player.infinityUpgrades.includes("45Mult")) el("infi23").className = "infinistorebtnbought"
	else if (player.infinityPoints.gte(1)&&player.infinityUpgrades.includes("27Mult")) el("infi23").className = "infinistorebtn2"
	else el("infi23").className = "infinistorebtnlocked"
	if (player.infinityUpgrades.includes("resetBoost")) el("infi14").className = "infinistorebtnbought"
	else if (player.infinityPoints.gte(1)&&player.infinityUpgrades.includes("36Mult")) el("infi14").className = "infinistorebtn1"
	else el("infi14").className = "infinistorebtnlocked"
	if (player.infinityUpgrades.includes("galaxyBoost")) el("infi24").className = "infinistorebtnbought"
	else if (player.infinityPoints.gte(2)&&player.infinityUpgrades.includes("45Mult")) el("infi24").className = "infinistorebtn2"
	else el("infi24").className = "infinistorebtnlocked"
	if (player.infinityUpgrades.includes("timeMult2")) el("infi31").className = "infinistorebtnbought"
	else if (player.infinityPoints.gte(3)) el("infi31").className = "infinistorebtn3"
	else el("infi31").className = "infinistorebtnlocked"
	if (player.infinityUpgrades.includes("unspentBonus")) el("infi32").className = "infinistorebtnbought"
	else if (player.infinityUpgrades.includes("timeMult2") && player.infinityPoints.gte(5)) el("infi32").className = "infinistorebtn3"
	else el("infi32").className = "infinistorebtnlocked"
	if (player.infinityUpgrades.includes("resetMult")) el("infi33").className = "infinistorebtnbought"
	else if (player.infinityUpgrades.includes("unspentBonus") && player.infinityPoints.gte(7)) el("infi33").className = "infinistorebtn3"
	else el("infi33").className = "infinistorebtnlocked"
	if (player.infinityUpgrades.includes("passiveGen")) el("infi34").className = "infinistorebtnbought"
	else if (player.infinityUpgrades.includes("resetMult") && player.infinityPoints.gte(10)) el("infi34").className = "infinistorebtn3"
	else el("infi34").className = "infinistorebtnlocked"
	if (player.infinityUpgrades.includes("skipReset1")) el("infi41").className = "infinistorebtnbought"
	else if (player.infinityPoints.gte(20)) el("infi41").className = "infinistorebtn4"
	else el("infi41").className = "infinistorebtnlocked"
	if (player.infinityUpgrades.includes("skipReset2")) el("infi42").className = "infinistorebtnbought"
	else if (player.infinityUpgrades.includes("skipReset1") && player.infinityPoints.gte(40)) el("infi42").className = "infinistorebtn4"
	else el("infi42").className = "infinistorebtnlocked"
	if (player.infinityUpgrades.includes("skipReset3")) el("infi43").className = "infinistorebtnbought"
	else if (player.infinityUpgrades.includes("skipReset2") && player.infinityPoints.gte(80)) el("infi43").className = "infinistorebtn4"
	else el("infi43").className = "infinistorebtnlocked"
	if (player.infinityUpgrades.includes("skipResetGalaxy")) el("infi44").className = "infinistorebtnbought"
	else if (player.infinityUpgrades.includes("skipReset3") && player.infinityPoints.gte(500)) el("infi44").className = "infinistorebtn4"
	else el("infi44").className = "infinistorebtnlocked"
	el("infi11").innerHTML = "Normal Dimensions gain a multiplier based on time played <br>Currently: " + (infUpg11Pow()).toFixed(2) + "x<br>Cost: 1 IP"
	el("infi12").innerHTML = "First and Eighth Dimensions gain a multiplier based on your Infinities<br>Currently: " + formatValue(player.options.notation, dimMults(), 1, 1) + "x<br>Cost: 1 IP"
	el("infi13").innerHTML = "Third and Sixth Dimensions gain a multiplier based on your Infinities<br>Currently: " + formatValue(player.options.notation, dimMults(), 1, 1) + "x<br>Cost: 1 IP"
	el("infi22").innerHTML = "Second and Seventh Dimensions gain a multiplier based on your Infinities<br>Currently: " + formatValue(player.options.notation, dimMults(), 1, 1) + "x<br>Cost: 1 IP"
	el("infi23").innerHTML = "Fourth and Fifth Dimensions gain a multiplier based on your Infinities<br>Currently: " + formatValue(player.options.notation, dimMults(), 1, 1) + "x<br>Cost: 1 IP"
	el("infi31").innerHTML = "Normal Dimensions gain a multiplier based on time spent in this Infinity<br>Currently: " + shorten(infUpg13Pow()) + "x<br>Cost: 3 IP"
	var infi32middle = player.infinityPoints.lt(pow10(1e10)) ? " <br> Currently: " + formatValue(player.options.notation, getUnspentBonus(), 2, 2) + "x" : ""
	el("infi32").innerHTML = "1st Dimension gets a multiplier based on unspent IP " + infi32middle + "<br>Cost: 5 IP"
}

function preBreakUpgradeDisplay(){
	if (canBuyIPMult()) el("infiMult").className = "infinimultbtn"
	else el("infiMult").className = "infinistorebtnlocked"
	var infiMultEnding = player.infinityPoints.lt(pow10(1e10)) ? "<br>Currently: " + shorten(getIPMult()) + "x<br>Cost: " + shortenCosts(player.infMultCost) + " IP" : ""
	el("infiMult").innerHTML = "You get " + (Math.round(getIPMultPower() * 100) / 100) + "x more IP." + infiMultEnding
	el("nextset").textContent = ""
	if (player.infinityUpgradesRespecced != undefined) {
		infinityRespecedInfinityDisplay()
	} else {
		infinityUpgradesDisplay()
		if (player.galacticSacrifice) {
			var base = player.tickspeedBoosts == undefined ? 2 : 1
			if (aarMod.newGameExpVersion) base *= 10
			el("infi21").innerHTML = "Increase the multiplier for buying 10 Dimensions based on Infinities<br>"+base+"x -> "+(infUpg12Pow()*base).toPrecision(4)+"x<br>Cost: 1 IP"
			el("infi33").innerHTML = "Dimension Boosts are stronger based on Infinity Points<br>Currently: " + (1.2 + 0.05 * player.infinityPoints.max(1).log(10)).toFixed(2) + "x<br>Cost: 7 IP"
		}
		var infi34Middle = player.infinityPoints.lt(pow10(1e10)) ? "<br>Currently: " + shortenDimensions(getIPMult()) + " every " + timeDisplay(player.bestInfinityTime * 10) : ""
		el("infi34").innerHTML = "Generate IP based on your fastest Infinity " + infi34Middle + "<br>Cost: 10 IP"
	}
	el("lockedset1").style.display = "none"
	if (player.setsUnlocked > 0) {
		el("lockedset1").style.display = ""
		for (let u = 4; u < 7; u++) {
			el("infi" + u + "pow").textContent = u == 5 ? getInfUpgPow(5).toFixed(2) : getFullExpansion(getInfUpgPow(u))
			el("infi" + u + "cost").textContent = shortenCosts(pow10(player.infinityUpgradesRespecced[u] + powAdds[u]))
			el("infi" + u).className = player.infinityPoints.lt(pow10(player.infinityUpgradesRespecced[u] + powAdds[u])) ? "infinistorebtnlocked" : "infinimultbtn"
		}	
	}
}

function eventsTimeDisplay(years, thisYear){
	var bc = years - thisYear + 1
	var since
	var sinceYears
	var dates = [5.332e6, 3.5e6,  2.58e6, 7.81e5, 3.15e5, 
		     2.5e5,   1.95e5, 1.6e5,  1.25e5, 7e4, 
		     6.7e4,   5e4,   4.5e4,  4e4,   3.5e4, 
		     3.3e4,   3.1e4,  2.9e4,  2.8e4,  2e4, 
		     1.6e4,   1.5e4,  1.4e4,  11600, 1e4,
		     8e3,    6e3,   5e3,   4e3,   3200,
		     3000,   2600,  2500,  2300,  1800,
		     1400,   1175,  800,   753,   653,
		     539,    356,   200,   4,     0]
	var events = ["start of Pliocene epoch", "birthdate of Lucy (typical Australopithicus afarensis female)", "Quaternary period", "Calabrian age", "Homo sapiens",
		      "Homo neanderthalensis", "emergence of anatomically modern humans", "Homo sapiens idaltu", "peak of Eemian interglacial period", "earliest abstract/symbolic art",
		      "Upper Paleolithic", "Late Stone Age", "European early modern humans", "first human settlement", "oldest known figurative art",
		      "oldest known domesticated dog", "Last Glacial Maximum", "oldest ovens", "oldest known twisted rope", "oldest human permanent settlement (hamlet considering built of rocks and of mammoth bones)",
		      "rise of Kerberan culture", "colonization of North America", "domestication of the pig", "prehistoric warfare", "Holocene",
		      "death of other human breeds", "agricultural revolution", "farmers arrived in Europe", "first metal tools", "first horse",
		      "Sumerian cuneiform writing system", "union of Egypt", "rise of Maya", "extinct of mammoths", "rise of Akkadian Empire",
		      "first alphabetic writing", "rise of Olmec civilization", "end of bronze age", "rise of Greek city-states", "rise of Rome",
		      "rise of Persian Empire", "fall of Babylonian Empire", "birth of Alexander the Great", "first paper", "birth of Jesus Christ"]
	/*
	"the homo sapiens" is weird, as is "the homo neanderthaliensis" and "the homo sapiens idaltu"
	*/
	var index = 0
	for (var i = 0; i < dates.length; i++){
		if (bc > dates[i]) {
			index = i
			break
		}
	} // dates[index] < bc <= dates[index-1] 
	if (index > 0) { //bc is less than or equal to 5.332e6 (5332e3)
		since = events[index - 1]
		sinceYears = bc - dates[index]
	}
	var message = "<br>If you wanted to finish writing out your full antimatter amount at a rate of 3 digits per second, you would need to start it in " 
	message += getFullExpansion(Math.floor(bc)) + " BC." + (since ? "<br>This is around " + getFullExpansion(Math.ceil(sinceYears)) + " years before the " + since + "." : "")
	el("infoScale").innerHTML = message
}

function universesTimeDisplay(years){
	var message = "<br>The time needed to finish writing your full antimatter amount at a rate of 3 digits per second would span "
	let unis = years / 13.78e9 
	// 13.78 Billion years as measured by the CMB (cosmic microwave background) and various models, feel free to change if more accurate data comes along
	let timebit 
	let end = "% of another."
	if (unis < 1) timebit = (unis * 100).toFixed(3) + "% of a universe."
	else if (unis < 2) timebit = "1 universe and " + (unis * 100 - 100).toFixed(3) + end
	else timebit = getFullExpansion(Math.floor(unis)) + " universes and " + (unis * 100 - 100 * Math.floor(unis)).toFixed(3) + end
	el("infoScale").innerHTML = message + timebit
}

function lifetimeTimeDisplay(years){
	var message = "<br>If you wrote 3 digits of your full antimatter amount every second since you were born as an American,<br> you would "
	if (years > 79.3) message += "be a ghost for " + ((years - 79.3) / years * 100).toFixed(3) + "% of the session."
	else message += "waste " + (years / 0.793).toFixed(3) + "% of your projected average lifespan."
	el("infoScale").innerHTML = message
}

function infoScaleDisplay(){
	if (aarMod.hideRepresentation) el("infoScale").textContent=""
	else if (player.money.gt(pow10(3 * 86400 * 365.2425 * 79.3 / 10))) {
		var years = player.money.log10() / 3 / 86400 / 365.2425
		var thisYear = new Date().getFullYear() || 2020
		if (years >= 1e13){
			el("infoScale").innerHTML = "<br>The time needed to finish writing your full antimatter amount at a rate of 3 digits per second would span " + Decimal.div(years, 1e12).toFixed(2) + " trillion years."
		} else if (years >= 1e9) {
			universesTimeDisplay(years)
		} else if (years > 1e7) {
			el("infoScale").innerHTML = "<br>The time needed to finish writing your full antimatter amount at a rate of 3 digits per second would span " + Decimal.div(years, 1e6).toFixed(2) + " million years."
		} else if (years >= thisYear) { 
			eventsTimeDisplay(years, thisYear)
		} else {
			lifetimeTimeDisplay(years)
		}
	}
	else if (player.money.log10() > 1e5) el("infoScale").innerHTML = "<br>If you wrote 3 numbers a second, it would take you <br>" + timeDisplay(player.money.log10() * 10 / 3) + "<br> to write down your antimatter amount."
	else scienceNumberDisplay()
}

function STATSDisplay(){
	mainStatsDisplay()
	paradoxSacDisplay()
	galaxySacDisplay()
	bestInfinityDisplay()
	bestEternityDisplay()
	bestQuantumDisplay()
	bestGhostifyDisplay()
	ng3p51Display()
	dilationStatsDisplay()
	infoScaleDisplay()
}

function breakInfinityUpgradeDisplay(){
	if (player.infinityUpgrades.includes("totalMult")) el("postinfi11").className = "infinistorebtnbought"
	else if (player.infinityPoints.gte(1e4)) el("postinfi11").className = "infinistorebtn1"
	else el("postinfi11").className = "infinistorebtnlocked"
	if (player.infinityUpgrades.includes("currentMult")) el("postinfi21").className = "infinistorebtnbought"
	else if (player.infinityPoints.gte(5e4)) el("postinfi21").className = "infinistorebtn1"
	else el("postinfi21").className = "infinistorebtnlocked"
	if (player.tickSpeedMultDecrease <= 2) el("postinfi31").className = "infinistorebtnbought"
	else if (player.infinityPoints.gte(player.tickSpeedMultDecreaseCost)) el("postinfi31").className = "infinimultbtn"
	else el("postinfi31").className = "infinistorebtnlocked"
	if (player.infinityUpgrades.includes("achievementMult")) el("postinfi22").className = "infinistorebtnbought"
	else if (player.infinityPoints.gte(1e6)) el("postinfi22").className = "infinistorebtn1"
	else el("postinfi22").className = "infinistorebtnlocked"
	if (player.infinityUpgrades.includes("infinitiedMult")) el("postinfi12").className = "infinistorebtnbought"
	else if (player.infinityPoints.gte(1e5)) el("postinfi12").className = "infinistorebtn1"
	else el("postinfi12").className = "infinistorebtnlocked"
	if (player.infinityUpgrades.includes("postGalaxy")) el("postinfi41").className = "infinistorebtnbought"
	else if (player.infinityPoints.gte(5e11)) el("postinfi41").className = "infinistorebtn1"
	else el("postinfi41").className = "infinistorebtnlocked"
	if (player.infinityUpgrades.includes("challengeMult")) el("postinfi32").className = "infinistorebtnbought"
	else if (player.infinityPoints.gte(1e7)) el("postinfi32").className = "infinistorebtn1"
	else el("postinfi32").className = "infinistorebtnlocked"
	if (player.dimensionMultDecrease <= 3) el("postinfi42").className = "infinistorebtnbought"
	else if (player.infinityPoints.gte(player.dimensionMultDecreaseCost)) el("postinfi42").className = "infinimultbtn"
	else el("postinfi42").className = "infinistorebtnlocked"
	if (player.offlineProd == 50) el("offlineProd").className = "infinistorebtnbought"
	else if (player.infinityPoints.gte(player.offlineProdCost)) el("offlineProd").className = "infinimultbtn"
	else el("offlineProd").className = "infinistorebtnlocked"
	if (player.infinityUpgrades.includes("infinitiedGeneration")) el("postinfi13").className = "infinistorebtnbought"
	else if (player.infinityPoints.gte(20e6)) el("postinfi13").className = "infinistorebtn1"
	else el("postinfi13").className = "infinistorebtnlocked"
	if (player.infinityUpgrades.includes("bulkBoost")) el("postinfi23").className = "infinistorebtnbought"
	else if (player.infinityPoints.gte(player.tickspeedBoosts!=undefined?2e4:player.galacticSacrifice?5e6:5e9)) el("postinfi23").className = "infinistorebtn1"
	else el("postinfi23").className = "infinistorebtnlocked"
	if (player.infinityUpgrades.includes("autoBuyerUpgrade")) el("postinfi33").className = "infinistorebtnbought"
	else if (player.infinityPoints.gte(1e15)) el("postinfi33").className = "infinistorebtn1"
	else el("postinfi33").className = "infinistorebtnlocked"
	el("postinfi11").innerHTML = "Normal Dimensions gain a multiplier based on total antimatter produced<br>Currently: " + shorten(tmp.postinfi11) + "x<br>Cost: "+shortenCosts(1e4)+" IP"
	el("postinfi21").innerHTML = "Normal Dimensions gain a multiplier based on current antimatter<br>Currently: " + shorten(tmp.postinfi21) + "x<br>Cost: "+shortenCosts(5e4)+" IP"
	if (player.tickSpeedMultDecrease > 2) el("postinfi31").innerHTML = "Tickspeed cost multiplier increase <br>" + player.tickSpeedMultDecrease+"x -> "+(player.tickSpeedMultDecrease-1)+"x<br>Cost: "+shortenDimensions(player.tickSpeedMultDecreaseCost) +" IP"
	else el("postinfi31").innerHTML = "Decrease the Tickspeed cost multiplier increase post-e308<br> " + player.tickSpeedMultDecrease.toFixed(player.tickSpeedMultDecrease < 2 ? 2 : 0)+"x"
	el("postinfi22").innerHTML = "Normal Dimensions gain a multiplier based on achievements " + (aarMod.ngmX >= 4 ? "and purchased GP upgrades " : "") + "<br>Currently: " + shorten(achievementMult) + "x<br>Cost: " + shortenCosts(1e6) + " IP"
	el("postinfi12").innerHTML = "Normal Dimensions gain a multiplier based on your Infinities <br>Currently: "+shorten(getInfinitiedMult())+"x<br>Cost: " + shortenCosts(1e5) + " IP"
	el("postinfi41").innerHTML = "Galaxies are " + Math.round(getPostGalaxyEff() * 100 - 100) + "% stronger <br>Cost: "+shortenCosts(5e11)+" IP"
	el("postinfi32").innerHTML = "Normal Dimensions gain a multiplier based on your slowest Normal Challenge time<br>Currently: "+shorten(worstChallengeBonus)+"x<br>Cost: " + shortenCosts(1e7) + " IP"
	el("postinfi13").innerHTML = "You generate Infinities based on your fastest Infinity.<br>1 Infinity every " + timeDisplay(player.bestInfinityTime * 5) + " <br>Cost: " + shortenCosts(2e7) + " IP"
	el("postinfi23").innerHTML = "Unlock the option to bulk buy Dimension" + (player.tickspeedBoosts == undefined ? "" : " and Tickspeed") + " Boosts <br>Cost: " + shortenCosts(player.tickspeedBoosts != undefined ? 2e4 : player.galacticSacrifice ? 5e6 : 5e9) + " IP"
	el("postinfi33").innerHTML = "Autobuyers work twice as fast <br>Cost: " + shortenCosts(1e15) + " IP"
	if (player.dimensionMultDecrease > 3) el("postinfi42").innerHTML = "Decrease the Dimension cost multiplier increase post-e308<br>" + player.dimensionMultDecrease + "x -> " + (player.dimensionMultDecrease - 1) + "x<br>Cost: " + shortenCosts(player.dimensionMultDecreaseCost) +" IP"
	else el("postinfi42").innerHTML = "Dimension cost multiplier increase<br>"+player.dimensionMultDecrease.toFixed(ECComps("eterc6") % 5 > 0 ? 1 : 0) + "x"
	el("offlineProd").innerHTML = "Generate " + player.offlineProd + "% > " + Math.max(Math.max(5, player.offlineProd + 5), Math.min(50, player.offlineProd + 5)) + "% of your best IP/min from the last 10 Infinities, works offline<br>Currently: " + shortenMoney(bestRunIppm.times(player.offlineProd / 100)) + "IP/min<br> Cost: " + shortenCosts(player.offlineProdCost) + " IP"
	if (player.offlineProd == 50) el("offlineProd").innerHTML = "Generate " + player.offlineProd + "% of your best IP/min from the last 10 Infinities, works offline<br>Currently: " + shortenMoney(bestRunIppm.times(player.offlineProd / 100)) + " IP/min"
}

function roundedDBCostIncrease(a){
	return shorten(getDimboostCostIncrease() + a)
}

function breakNGm2UpgradeColumnDisplay(){
	if (player.infinityUpgrades.includes("galPointMult")) el("postinfi01").className = "infinistorebtnbought"
	else if (player.infinityPoints.gte(player.tickspeedBoosts == undefined ? 1e3 : 1e4)) el("postinfi01").className = "infinistorebtn1"
	else el("postinfi01").className = "infinistorebtnlocked"
	if (player.infinityUpgrades.includes("dimboostCost")) el("postinfi02").className = "infinistorebtnbought"
	else if (player.infinityPoints.gte(player.tickspeedBoosts == undefined ? 2e4 : 1e5)) el("postinfi02").className = "infinistorebtn1"
	else el("postinfi02").className = "infinistorebtnlocked"
	if (player.infinityUpgrades.includes("galCost")) el("postinfi03").className = "infinistorebtnbought"
	else if (player.infinityPoints.gte(5e5)) el("postinfi03").className = "infinistorebtn1"
	else el("postinfi03").className = "infinistorebtnlocked"
	if (player.extraDimPowerIncrease >= 40) el("postinfi04").className = "infinistorebtnbought"
	else if (player.infinityPoints.gte(player.dimPowerIncreaseCost)) el("postinfi04").className = "infinimultbtn"
	else el("postinfi04").className = "infinistorebtnlocked"
	el("postinfi01").innerHTML = "Multiplier to Galaxy points based on infinities<br>Currently: "+shorten(getPost01Mult())+"x<br>Cost: "+shortenCosts(player.tickspeedBoosts==undefined?1e3:1e4)+" IP"
	el("postinfi02").innerHTML = "Dimension Boost cost increases by 1 less<br>Currently: " + roundedDBCostIncrease(0) + (player.infinityUpgrades.includes("dimboostCost") ? "" : " -> " + (roundedDBCostIncrease(-1))) + "<br>Cost: " + shortenCosts(player.tickspeedBoosts == undefined ? 2e4 : 1e5) + " IP"
	el("postinfi03").innerHTML = "Galaxy cost increases by 5 less<br>Currently: " + Math.round(getGalaxyReqMultiplier() * 10) / 10 + (player.infinityUpgrades.includes("galCost") ? "" : " -> " + Math.round(getGalaxyReqMultiplier() * 10 - 50) / 10 + "<br>Cost: " + shortenCosts(5e5) + " IP")
	el("postinfi04").innerHTML = "Further increase all dimension multipliers<br>x^" + galMults.u31().toFixed(2) + (player.extraDimPowerIncrease < 40 ? " -> x^" + ((galMults.u31() + 0.02).toFixed(2)) + "<br>Cost: " + shorten(player.dimPowerIncreaseCost) + " IP" : "")
}

function breakNGm2UpgradeRow5Display(){
	el("postinfir5").style.display = ""
	if (player.infinityUpgrades.includes("postinfi50")) el("postinfi50").className = "infinistorebtnbought"
	else if (player.infinityPoints.gte(player.tickspeedBoosts == undefined ? 1e25 : 1e18)) el("postinfi50").className = "infinistorebtn1"
	else el("postinfi50").className = "infinistorebtnlocked"
	if (player.infinityUpgrades.includes("postinfi51")) el("postinfi51").className = "infinistorebtnbought"
	else if (player.infinityPoints.gte(player.tickspeedBoosts == undefined ? 1e29 : 1e20)) el("postinfi51").className = "infinistorebtn1"
	else el("postinfi51").className = "infinistorebtnlocked"
	if (player.infinityUpgrades.includes("postinfi52")) el("postinfi52").className = "infinistorebtnbought"
	else if (player.infinityPoints.gte(player.tickspeedBoosts == undefined ? 1e33 : 1e25)) el("postinfi52").className = "infinistorebtn1"
	else el("postinfi52").className = "infinistorebtnlocked"
	if (player.infinityUpgrades.includes("postinfi53")) el("postinfi53").className = "infinistorebtnbought"
	else if (player.infinityPoints.gte(player.tickspeedBoosts == undefined ? 1e37 : 1e29)) el("postinfi53").className = "infinistorebtn1"
	else el("postinfi53").className = "infinistorebtnlocked"
	el("postinfi50").innerHTML = "Dimension Boost cost increases by 0.5 less.<br>Currently: " + getDimboostCostIncrease() + (player.infinityUpgrades.includes("postinfi50") ? "" : " -> " + (getDimboostCostIncrease() - 0.5)) + "<br>Cost: " + shortenCosts(player.tickspeedBoosts==undefined ? 1e25 : 1e18) + " IP"
	el("postinfi51").innerHTML = "Galaxies are " + (player.tickspeedBoosts ? 15 : 20) + "% more stronger.<br>Cost: " + shortenCosts(player.tickspeedBoosts == undefined ? 1e29 : 1e20) + " IP"
	let inf52text = ''
	if (player.tickspeedBoosts == undefined){
		inf52text = "Galaxy cost increases by 3 less.<br>Currently: " + Math.round(getGalaxyReqMultiplier() * 10) / 10 + (player.infinityUpgrades.includes("postinfi52") ? "" : " -> " + Math.round(getGalaxyReqMultiplier() * 10 - 30) / 10) + "<br>Cost: " + shortenCosts(1e33) + " IP"
	} else inf52text = "Decrease tickspeed boost cost multiplier to 3.<br>Cost: " + shortenCosts(1e25) + " IP"
	el("postinfi52").innerHTML = inf52text
	el("postinfi53").innerHTML = "Divide all Infinity Dimension cost multipliers by 50.<br>Cost: "+shortenCosts(player.tickspeedBoosts == undefined ? 1e37 : 1e29) + " IP"
}

function breakNGm2UpgradeRow6Display(){
	el("postinfir6").style.display = ""
	if (player.infinityUpgrades.includes("postinfi60")) el("postinfi60").className = "infinistorebtnbought"
	else if (player.infinityPoints.gte(1e50)) el("postinfi60").className = "infinistorebtn1"
	else el("postinfi60").className = "infinistorebtnlocked"
	if (player.infinityUpgrades.includes("postinfi61")) el("postinfi61").className = "infinistorebtnbought"
	else if (player.infinityPoints.gte("1e450")) el("postinfi61").className = "infinistorebtn1"
	else el("postinfi61").className = "infinistorebtnlocked"
	if (player.infinityUpgrades.includes("postinfi62")) el("postinfi62").className = "infinistorebtnbought"
	else if (player.infinityPoints.gte("1e700")) el("postinfi62").className = "infinistorebtn1"
	else el("postinfi62").className = "infinistorebtnlocked"
	if (player.infinityUpgrades.includes("postinfi63")) el("postinfi63").className = "infinistorebtnbought"
	else if (player.infinityPoints.gte("1e2000")) el("postinfi63").className = "infinistorebtn1"
	else el("postinfi63").className = "infinistorebtnlocked"
	el("postinfi60").innerHTML = "You gain more " + (player.tickspeedBoosts ? "Galaxy Points" : tmp.ngp3l ? "Infinity Points" : "antimatter") + " based on your galaxies." + (player.tickspeedBoosts ? "" : "<br>Currently: " + shorten(getNewB60Mult()) + "x") + "<br>Cost: " + shortenCosts(1e50) + " IP"
	el("postinfi61").innerHTML = "g11 formula is better.<br>Cost: " + shortenCosts(E("1e450")) + " IP"
	el("postinfi62").innerHTML = "Dimension Boosts make g13 stronger.<br>Cost: " + shortenCosts(E("1e700")) + " IP"
	el("postinfi63").innerHTML = "Unlock 2 new rows of Galaxy Point upgrades.<br>Cost: " + shortenCosts(E("1e2000")) + " IP"
}

function INFINITYUPGRADESDisplay(){
	if (el("preinf").style.display == "block") {
		preBreakUpgradeDisplay()
	} else if (el("postinf").style.display == "block" && el("breaktable").style.display == "inline-block") {
		breakInfinityUpgradeDisplay()
		if (player.galacticSacrifice) breakNGm2UpgradeColumnDisplay()
		if (player.galacticSacrifice && (player.infinityDimension3.amount.gt(0) || player.eternities > (aarMod.newGameMinusVersion? -20 : 0) || quantumed)) {
			breakNGm2UpgradeRow5Display()
		} else el("postinfir5").style.display = "none"
		if (player.galacticSacrifice && (player.infinityDimension4.amount.gt(0) || player.eternities > (aarMod.newGameMinusVersion ? -20 : 0) || quantumed)) {
			breakNGm2UpgradeRow6Display()
		} else el("postinfir6").style.display = "none"
	} else if (el("singularity").style.display == "block" && el("singularitydiv").style.display == "") {
		el("darkMatter").textContent = shortenMoney(player.singularity.darkMatter)
		el("darkMatterMult").textContent = shortenMoney(getDarkMatterMult())
	} else if (el("dimtechs").style.display == "block" && el("dimtechsdiv").style.display == "") {
		el("darkMatterDT").textContent = shortenMoney(player.singularity.darkMatter)
		el("nextDiscounts").textContent = shortenMoney(getNextDiscounts())
		el("discounts").textContent = "You have gained a total of " + getFullExpansion(player.dimtechs.discounts) + " discount upgrades."
	}
}

function eternityUpgradesDisplay(){
	var eu2formula = "(x/200) ^ log4(2x)"
	if (player.boughtDims !== undefined) eu2formula = "x ^ log4(2x)"
	else if (hasAch("ngpp15")) eu2formula = "x ^ log10(x) ^ 3.75"
	el("eter1").innerHTML = "Infinity Dimension multiplier based on unspent EP (x + 1)<br>Currently: "+shortenMoney(player.eternityPoints.plus(1))+"x<br>Cost: 5 EP"
	el("eter2").innerHTML = "Infinity Dimension multiplier based on Eternities (" + eu2formula + ")<br>Currently: "+shortenMoney(getEU2Mult())+"x<br>Cost: 10 EP"
	el("eter3").innerHTML = "Infinity Dimension multiplier based on "+(player.boughtDims ? "Time Shards (x/"+shortenCosts(1e12)+"+1)":"sum of Infinity Challenge times")+"<br>Currently: "+shortenMoney(getEU3Mult())+"x<br>Cost: "+shortenCosts(50e3)+" EP"
	el("eter4").innerHTML = "Your achievement bonus affects Time Dimensions"+"<br>Cost: "+shortenCosts(1e16)+" EP"
	el("eter5").innerHTML = "Time Dimensions gain a multiplier based on your unspent Time Theorems"+"<br>Cost: "+shortenCosts(1e40)+" EP"
	el("eter6").innerHTML = "Time Dimensions gain a multiplier based on days played"+"<br>Cost: "+shortenCosts(1e50)+" EP"
	if (player.exdilation != undefined && player.dilation.studies.includes(1)) {
		el("eter7").innerHTML = "Dilated time gain is boosted by antimatter<br>Currently: "+(1 + Math.log10(Math.max(1, player.money.log(10))) / 40).toFixed(3)+"x<br>Cost: "+shortenCosts(E("1e1500"))+" EP"
		el("eter8").innerHTML = "Dilated time gain is boosted by Infinity Points<br>Currently: "+(1 + Math.log10(Math.max(1, player.infinityPoints.log(10))) / 20).toFixed(3)+"x<br>Cost: "+shortenCosts(E("1e2000"))+" EP"
		el("eter9").innerHTML = "Dilated time gain is boosted by Eternity Points<br>Currently: "+(1 + Math.log10(Math.max(1, player.eternityPoints.log(10))) / 10).toFixed(3)+"x<br>Cost: "+shortenCosts(E("1e3000"))+" EP"
	}
}

function uponDilationDisplay(){
	let gain = getDilGain()
	let msg = "Disable dilation"
	if (player.infinityPoints.lt(Number.MAX_VALUE)||inQCModifier("ad")) {}
	else if (player.dilation.totalTachyonParticles.gt(gain)) msg += ".<br>Reach " + shortenMoney(getReqForTPGain()) + " antimatter to gain more Tachyon particles"
	else msg += " for " + shortenMoney(gain.sub(player.dilation.totalTachyonParticles)) + " Tachyon particles"
	el("enabledilation").innerHTML = msg + "."
}

function exdilationDisplay(){
	el("reversedilationdiv").style.display = ""
	if (canReverseDilation()) {
		el("reversedilation").className = "dilationbtn"
		el("reversedilation").innerHTML = "Reverse dilation."+(player.exdilation.times>0||quantumed?"<br>Gain "+shortenDimensions(getExDilationGain())+" ex-dilation":"")
	} else {
		let req = getExdilationReq()
		el("reversedilation").className = "eternityupbtnlocked"
		el("reversedilation").textContent = "Get "+(player.eternityPoints.lt(req.ep)?shortenCosts(E(req.ep))+" EP and ":"")+shortenCosts(req.dt)+" dilated time to reverse dilation."
	}
}

function mainDilationDisplay(){
	if (player.dilation.active) uponDilationDisplay()
	else el("enabledilation").textContent = "Dilate time."+((player.eternityBuyer.isOn&&player.eternityBuyer.dilationMode?!isNaN(player.eternityBuyer.statBeforeDilation):false) ? " "+player.eternityBuyer.statBeforeDilation+ " left before dilation." : "")
	if (player.exdilation==undefined||aarMod.ngudpV?false:player.blackhole.unl) {
		exdilationDisplay()
	} else el("reversedilationdiv").style.display = "none"

	var fgm = getFreeGalaxyGainMult()
	el('freeGalaxyMult').textContent = fgm == 1 ? "Tachyonic Galaxy" : Math.round(fgm * 10) / 10 + " Tachyonic Galaxies"
}

function ETERNITYSTOREDisplay(){
	if (el("TTbuttons").style.display == "block") updateTheoremButtons()
	if (el("timestudies").style.display == "block" || el("ers_timestudies").style.display == "block") updateTimeStudyButtons()
	if (el("masterystudies").style.display == "block") updateMasteryStudyButtons()
	if (el("eternityupgrades").style.display == "block") eternityUpgradesDisplay()
	if (el("dilation").style.display == "block") mainDilationDisplay()
	if (el("blackhole").style.display == "block") {
		if (el("blackholediv").style.display == "inline-block") updateBlackhole()
		if (el("blackholeunlock").style.display == "inline-block") {
			el("blackholeunlock").innerHTML = "Unlock the black hole<br>Cost: " + shortenCosts(E('1e4000')) + " EP"
			el("blackholeunlock").className = (player.eternityPoints.gte("1e4000")) ? "storebtn" : "unavailablebtn"
		}
	}
}

function updateDimensionsDisplay() {
	if (el("dimensions").style.display == "block") {
		if (el("antimatterdimensions").style.display == "block") dimensionTabDisplay()
		if (el("infinitydimensions").style.display == "block") updateInfinityDimensions()
		if (el("timedimensions").style.display == "block") updateTimeDimensions()
		if (el("pdims").style.display == "block") paradoxDimDisplay()
		if (el("metadimensions").style.display == "block") updateMetaDimensions()
	}
	tickspeedDisplay()
	if (el("stats").style.display == "block" && el("statistics").style.display == "block") STATSDisplay()
	if (el("infinity").style.display == "block") INFINITYUPGRADESDisplay()
	if (el("eternitystore").style.display == "block") ETERNITYSTOREDisplay()
	if (el("quantumtab").style.display == "block") updateQuantumTabs()
	if (el("replicants").style.display == "block") updateReplicantsTab()
	if (el("ghostify").style.display == "block") updateGhostifyTabs()
	if (el("bltab").style.display == "block") updateBosonicLabTab()
}

function replicantiDisplay() {
	if (player.replicanti.unl) {
		let replGalOver = getMaxRG() - player.replicanti.gal
		let chance = Decimal.times(tmp.rep.chance, 100)
		el("replicantiamount").textContent = shortenDimensions(player.replicanti.amount)
		el("replicantimult").textContent = shorten(getIDReplMult())
		
		var chanceDisplayEnding = (isChanceAffordable() && player.infinityPoints.lt(pow10(1e10)) ? "<br>+1% Cost: " + shortenCosts(player.replicanti.chanceCost) + " IP" : "")
		el("replicantichance").innerHTML = "Replicate "+(tmp.rep.freq?"amount: "+shorten(tmp.rep.freq)+"x":"chance: "+getFullExpansion(chance.gt(1e12)?chance:Math.round(chance.toNumber()))+"%") + chanceDisplayEnding
		el("replicantiinterval").innerHTML = "Interval: "+timeDisplayShort(Decimal.div(tmp.rep.interval, 100), true, 3) + (isIntervalAffordable() ? "<br>-> "+timeDisplayShort(Decimal.times(tmp.rep.interval, 9e-3), true, 3)+" Cost: "+shortenCosts(player.replicanti.intervalCost)+" IP" : "")
		var replGalName = player.replicanti.gal < 3e3 ? "Max Replicanti Galaxies" : (player.replicanti.gal < 58200 ? "Distant" : "Farther") + " Replicanti Galaxies"
		var replGalCostPortion = player.infinityPoints.lt(pow10(1e10)) ? "<br>+1 Cost: " + shortenCosts(getRGCost()) + " IP" : ""
		el("replicantimax").innerHTML = replGalName + ": " + getFullExpansion(player.replicanti.gal) + (replGalOver > 1 ? "+" + getFullExpansion(replGalOver) : "") + replGalCostPortion
		el("replicantireset").innerHTML = (hasAch("ng3p67") ? "Get " : hasAch("ngpp16") ? "Divide replicanti by " + shorten(Number.MAX_VALUE) + " for" : "Reset replicanti amount for") + " 1 galaxy.<br>" + getFullExpansion(player.replicanti.galaxies) + (extraReplGalaxies ? "+" + getFullExpansion(extraReplGalaxies) : "") + " replicanti galax" + (getTotalRG() == 1 ? "y" : "ies") + " created."
		el("replicantiapprox").innerHTML = tmp.ngp3 && player.dilation.upgrades.includes("ngpp1") && player.timestudy.studies.includes(192) && player.replicanti.amount.gte(Number.MAX_VALUE) && (!aarMod.nguspV || aarMod.nguepV) ? 
			"Replicanti increases by " + (tmp.rep.est < Math.log10(2) ? "x2.00 per " + timeDisplayShort(Math.log10(2) / tmp.rep.est * 10) : (tmp.rep.est.gte(1e4) ? shorten(tmp.rep.est) + " OoMs" : "x" + shorten(pow10(tmp.rep.est.toNumber()))) + " per second") + ".<br>" +
			"Replicate interval slows down by " + tmp.rep.speeds.inc.toFixed(3) + "x per " + getFullExpansion(Math.floor(tmp.rep.speeds.exp)) + " OoMs.<br>" +
			"(2x slower per " + getFullExpansion(Math.floor(tmp.rep.speeds.exp * Math.log10(2) / Math.log10(tmp.rep.speeds.inc))) + " OoMs)" :
			"Approximately "+ timeDisplay(Math.max((Math.log(Number.MAX_VALUE) - tmp.rep.ln) / tmp.rep.est.toNumber(), 0) * 10) + " Until Infinite Replicanti"

		el("replicantichance").className = (player.infinityPoints.gte(player.replicanti.chanceCost) && isChanceAffordable()) ? "storebtn" : "unavailablebtn"
		el("replicantiinterval").className = (player.infinityPoints.gte(player.replicanti.intervalCost) && isIntervalAffordable()) ? "storebtn" : "unavailablebtn"
		el("replicantimax").className = (player.infinityPoints.gte(getRGCost())) ? "storebtn" : "unavailablebtn"
		el("replicantireset").className = (canGetReplicatedGalaxy()) ? "storebtn" : "unavailablebtn"
		el("replicantireset").style.height = (hasAch("ngpp16") && (tmp.ngp3l || !hasAch("ng3p67")) ? 90 : 70) + "px"
	} else {
		el("replicantiunlock").innerHTML = "Unlock Replicantis<br>Cost: " + shortenCosts(player.galacticSacrifice != undefined && player.tickspeedBoosts == undefined ? 1e80 : 1e140) + " IP"
		el("replicantiunlock").className = (player.infinityPoints.gte(player.galacticSacrifice != undefined && player.tickspeedBoosts == undefined ? 1e80 : 1e140)) ? "storebtn" : "unavailablebtn"
	}
}

function initialTimeStudyDisplay(){
	el("11desc").textContent = "Currently: " + shortenMoney(tsMults[11]()) + "x"
	el("32desc").textContent = "You gain " + getFullExpansion(tsMults[32]()) + "x more Infinities (based on Dimension Boosts)"
	el("51desc").textContent = "You gain " + shortenCosts(aarMod.newGameExpVersion ? 1e30 : 1e15) + "x more IP"
	el("71desc").textContent = "Currently: " + shortenMoney(tmp.sacPow.pow(0.25).max(1).min("1e210000")) + "x"
	el("72desc").textContent = "Currently: " + shortenMoney(tmp.sacPow.pow(0.04).max(1).min("1e30000")) + "x"
	el("73desc").textContent = "Currently: " + shortenMoney(tmp.sacPow.pow(0.005).max(1).min("1e1300")) + "x"
	el("82desc").textContent = "Currently: " + shortenMoney(E_pow(1.0000109, E_pow(player.resets, 2)).min(player.meta==undefined?1/0:'1e80000')) + "x"
	el("91desc").textContent = "Currently: " + shortenMoney(pow10(Math.min(player.thisEternity, 18000)/60)) + "x"
	el("92desc").textContent = "Currently: " + shortenMoney(pow2(600/Math.max(player.bestEternity, 20))) + "x"
	el("93desc").textContent = "Currently: " +  shortenMoney(E_pow(player.totalTickGained, 0.25).max(1)) + "x"
	el("121desc").textContent = "Currently: " + ((253 - averageEp.dividedBy(player.epmult).dividedBy(10).min(248).max(3))/5).toFixed(1) + "x"
	el("123desc").textContent = "Currently: " + Math.sqrt(1.39*player.thisEternity/10).toFixed(1) + "x"
	el("141desc").textContent = "Currently: " + shortenMoney(E(1e45).dividedBy(E_pow(15, Math.log(player.thisInfinityTime)*Math.pow(player.thisInfinityTime, 0.125))).max(1)) + "x"
	el("142desc").textContent = "You gain " + shortenCosts(1e25) + "x more IP"
	el("143desc").textContent = "Currently: " + shortenMoney(E_pow(15, Math.log(player.thisInfinityTime)*Math.pow(player.thisInfinityTime, 0.125))) + "x"
	el("151desc").textContent = shortenCosts(1e4) + "x multiplier on all Time Dimensions"
	el("161desc").textContent = shortenCosts(pow10((player.galacticSacrifice ? 6660 : 616) *  ( aarMod.newGameExpVersion ? 5 : 1))) + "x multiplier on all normal dimensions"
	el("162desc").textContent = shortenCosts(pow10((player.galacticSacrifice ? 234 : 11) * (aarMod.newGameExpVersion ? 5 : 1))) + "x multiplier on all Infinity dimensions"
	el("192desc").textContent = "You can get beyond " + shortenMoney(Number.MAX_VALUE) + " replicantis, but the interval is increased the more you have"
	el("193desc").textContent = "Currently: " + shortenMoney(E_pow(1.03, Decimal.min(1e7, getEternitied())).min("1e13000")) + "x"
	el("212desc").textContent = "Currently: " + ((tsMults[212]() - 1) * 100).toFixed(2) + "%"
	el("214desc").textContent = "Currently: " + shortenMoney(((tmp.sacPow.pow(8)).min("1e46000").times(tmp.sacPow.pow(1.1)).div(tmp.sacPow)).max(1).min(E("1e125000"))) + "x"
	el("metaCost").textContent = shortenCosts(getMetaUnlCost());
}

function eternityChallengeUnlockDisplay(){
	var ec1Mult=aarMod.newGameExpVersion?1e3:2e4
	if (player.etercreq !== 1) el("ec1unl").innerHTML = "Eternity Challenge 1<span>Requirement: "+(ECComps("eterc1")+1)*ec1Mult+" Eternities<span>Cost: 30 Time Theorems"
	else el("ec1unl").innerHTML = "Eternity Challenge 1<span>Cost: 30 Time Theorems"
	if (player.etercreq !== 2) el("ec2unl").innerHTML = "Eternity Challenge 2<span>Requirement: "+(1300+(ECComps("eterc2")*150))+" Tickspeed upgrades gained from time dimensions<span>Cost: 35 Time Theorems"
	else el("ec2unl").innerHTML = "Eternity Challenge 2<span>Cost: 35 Time Theorems"
	if (player.etercreq !== 3) el("ec3unl").innerHTML = "Eternity Challenge 3<span>Requirement: "+(17300+(ECComps("eterc3")*1250))+" 8th dimensions<span>Cost: 40 Time Theorems"
	else el("ec3unl").innerHTML = "Eternity Challenge 3<span>Cost: 40 Time Theorems"
	if (player.etercreq !== 4) el("ec4unl").innerHTML = "Eternity Challenge 4<span>Requirement: "+(1e8 + (ECComps("eterc4")*5e7)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+" infinities<span>Cost: 70 Time Theorems"
	else el("ec4unl").innerHTML = "Eternity Challenge 4<span>Cost: 70 Time Theorems"
	if (player.etercreq !== 5) el("ec5unl").innerHTML = "Eternity Challenge 5<span>Requirement: "+(160+(ECComps("eterc5")*14))+" galaxies<span>Cost: 130 Time Theorems"
	else el("ec5unl").innerHTML = "Eternity Challenge 5<span>Cost: 130 Time Theorems"
	if (player.etercreq !== 6) el("ec6unl").innerHTML = "Eternity Challenge 6<span>Requirement: "+(40+(ECComps("eterc6")*5))+" replicanti galaxies<span>Cost: 85 Time Theorems"
	else el("ec6unl").innerHTML = "Eternity Challenge 6<span>Cost: 85 Time Theorems"
	if (player.etercreq !== 7) el("ec7unl").innerHTML = "Eternity Challenge 7<span>Requirement: "+shortenCosts(E("1e500000").times(E("1e300000").pow(ECComps("eterc7"))))+" antimatter <span>Cost: 115 Time Theorems"
	else el("ec7unl").innerHTML = "Eternity Challenge 7<span>Cost: 115 Time Theorems"
	if (player.etercreq !== 8) el("ec8unl").innerHTML = "Eternity Challenge 8<span>Requirement: "+shortenCosts(E("1e4000").times(E("1e1000").pow(ECComps("eterc8"))))+" IP <span>Cost: 115 Time Theorems"
	else el("ec8unl").innerHTML = "Eternity Challenge 8<span>Cost: 115 Time Theorems"
	if (player.etercreq !== 9) el("ec9unl").innerHTML = "Eternity Challenge 9<span>Requirement: "+shortenCosts(E("1e17500").times(E("1e2000").pow(ECComps("eterc9"))))+" infinity power<span>Cost: 415 Time Theorems"
	else el("ec9unl").innerHTML = "Eternity Challenge 9<span>Cost: 415 Time Theorems"
	if (player.etercreq !== 10) el("ec10unl").innerHTML = "Eternity Challenge 10<span>Requirement: "+shortenCosts(E("1e100").times(E("1e20").pow(ECComps("eterc10"))))+" EP<span>Cost: 550 Time Theorems"
	else el("ec10unl").innerHTML = "Eternity Challenge 10<span>Cost: 550 Time Theorems"

	el("ec11unl").innerHTML = "Eternity Challenge 11<span>Requirement: Use only the Normal Dimension path<span>Cost: 1 Time Theorem"
	el("ec12unl").innerHTML = "Eternity Challenge 12<span>Requirement: Use only the Time Dimension path<span>Cost: 1 Time Theorem"
}

function mainTimeStudyDisplay(){
	initialTimeStudyDisplay()
	eternityChallengeUnlockDisplay()
	el("dilstudy1").innerHTML = "Unlock time dilation" + (player.dilation.studies.includes(1) ? "" : "<span>Requirement: 5 EC11 and EC12 completions and " + getFullExpansion(getDilationTotalTTReq()) + " total theorems")+"<span>Cost: " + getFullExpansion(5e3) + " Time Theorems"
	if (tmp.ngp3) {
		var ts232display = tmp.ts232 * 100 - 100
		el("221desc").textContent = "Currently: "+shorten(E_pow(1.0025, player.resets))+"x"
		el("227desc").textContent = "Currently: "+shorten(Math.pow(tmp.sacPow.max(10).log10(), 10))+"x"
		el("231desc").textContent = "Currently: "+shorten(E_pow(Math.max(player.resets, 1), 0.3))+"x more power"
		el("232desc").textContent = "Currently: "+(ts232display>=999.95?getFullExpansion(Math.floor(ts232display)):ts232display.toFixed(1))+"%"
	}
}

function ABTypeDisplay(){
	if (getEternitied() > 4) el("togglecrunchmode").style.display = "inline-block"
	else el("togglecrunchmode").style.display = "none"
	if (getEternitied() > 8 || player.autobuyers[10].bulkBought) el("galaxybulk").style.display = "inline-block"
	else el("galaxybulk").style.display = "none"
	if (getEternitied() > 99 && player.meta) el("toggleautoetermode").style.display = "inline-block"
	else el("toggleautoetermode").style.display = "none"
}

function infPoints2Display(){
	if (player.infinitied > 0 || player.infinityPoints.gt(0) || player.infinityUpgrades.length > 0 || getEternitied() > 0 || quantumed) el("infinityPoints2").style.display = "inline-block"
	else el("infinityPoints2").style.display = "none"
}

function updateChallTabDisplay(){
	if (player.postChallUnlocked > 0 || Object.keys(player.eternityChalls).length > 0 || player.eternityChallUnlocked !== 0 || quantumed) el("challTabButtons").style.display = "table"
}

function eterPoints2Display(){
	el("eternityPoints2").innerHTML = "You have <span class=\"EPAmount2\">"+shortenDimensions(player.eternityPoints)+"</span> Eternity points."
}

function dimboostABTypeDisplay(){
	if (getEternitied() > 9 || player.autobuyers[9].bulkBought) el("bulklabel").textContent = "Buy max dimboosts every X seconds:"
	else el("bulklabel").textContent = "Bulk DimBoost Amount:"
}

function IDABDisplayCorrection(){
	if (getEternitied() > 10) {
		for (var i=1;i<getEternitied()-9 && i < 9; i++) {
			el("infauto"+i).style.visibility = "visible"
		}
		el("toggleallinfdims").style.visibility = "visible"
	} else {
		for (var i=1; i<9; i++) {
			el("infauto"+i).style.visibility = "hidden"
		}
		el("toggleallinfdims").style.visibility = "hidden"
	}
}

function replicantiShopABDisplay(){
	if (getEternitied() >= 40) el("replauto1").style.visibility = "visible"
	else el("replauto1").style.visibility = "hidden"
	if (getEternitied() >= 60) el("replauto2").style.visibility = "visible"
	else el("replauto2").style.visibility = "hidden"
	if (getEternitied() >= 80) el("replauto3").style.visibility = "visible"
	else el("replauto3").style.visibility = "hidden"
}

function primaryStatsDisplayResetLayers(){
	if (getEternitied() == 0 && !quantumed) el("pasteternities").style.display = "none"
	else el("pasteternities").style.display = "inline-block"
	if (quantumed) el("pastquantums").style.display = "inline-block"
	else el("pastquantums").style.display = "none"
	if (ghostified) el("pastghostifies").style.display = "inline-block"
	else el("pastghostifies").style.display = "none"
	el("pastinfs").style.display = player.infinitied > 0 || getEternitied() > 0 || quantumed ? "" : "none"
	var showStats = player.challenges.length > 1 || player.infinitied > 0 || getEternitied() > 0 || quantumed ? "" : "none"
	el("brfilter").style.display = showStats
	el("statstabs").style.display = showStats
	var display = aarMod.hideSecretAchs?"none":""
	el("achTabButtons").style.display=display
	el("secretachsbtn").style.display=display
}

function ECCompletionsDisplay(){
	el("eterc1completed").textContent = "Completed "+ECComps("eterc1")+" times."
	el("eterc2completed").textContent = "Completed "+ECComps("eterc2")+" times."
	el("eterc3completed").textContent = "Completed "+ECComps("eterc3")+" times."
	el("eterc4completed").textContent = "Completed "+ECComps("eterc4")+" times."
	el("eterc5completed").textContent = "Completed "+ECComps("eterc5")+" times."
	el("eterc6completed").textContent = "Completed "+ECComps("eterc6")+" times."
	el("eterc7completed").textContent = "Completed "+ECComps("eterc7")+" times."
	el("eterc8completed").textContent = "Completed "+ECComps("eterc8")+" times."
	el("eterc9completed").textContent = "Completed "+ECComps("eterc9")+" times."
	el("eterc10completed").textContent = "Completed "+ECComps("eterc10")+" times."
	el("eterc11completed").textContent = "Completed "+ECComps("eterc11")+" times."
	el("eterc12completed").textContent = "Completed "+ECComps("eterc12")+" times."
	el("eterc13completed").textContent = "Completed "+ECComps("eterc13")+" times."
	el("eterc14completed").textContent = "Completed "+ECComps("eterc14")+" times."
}

function ECchallengePortionDisplay(){
	let ec12TimeLimit = Math.round(getEC12TimeLimit() * 10) / 100
	for (var c=1;c<15;c++) el("eterc"+c+"goal").textContent = "Goal: "+shortenCosts(getECGoal("eterc"+c))+" IP"+(c==12?" in "+ec12TimeLimit+" second"+(ec12TimeLimit==1?"":"s")+" or less.":c==4?" in "+Math.max((16-(ECComps("eterc4")*4)),0)+" infinities or less.":"")
}

function EC8PurchasesDisplay(){
	if (player.currentEternityChall == "eterc8") {
		el("eterc8repl").style.display = "block"
		el("eterc8ids").style.display = "block"
		el("eterc8repl").textContent = "You have "+player.eterc8repl+" purchases left."
		el("eterc8ids").textContent = "You have "+player.eterc8ids+" purchases left."
	} else {
		el("eterc8repl").style.display = "none"
		el("eterc8ids").style.display = "none"
	}
}

function bankedInfinityDisplay(){
	el("infinitiedBank").style.display = (player.infinitiedBank > 0) ? "block" : "none"
	el("infinitiedBank").textContent = "You have " + getFullExpansion(player.infinitiedBank) + " banked infinities."
	var bankedInfGain=gainBankedInf()
	el("bankedInfGain").style.display = bankedInfGain>0 ? "block" : "none"
	el("bankedInfGain").textContent = "You will gain " + getFullExpansion(bankedInfGain) + " banked infinities on next Eternity."
	if (hasAch("ng3p73")) updateBankedEter(true)
}

function updateHeaders() {
	//Show Header
	let header = !isEmptiness
	el("main_header").style.display = header ? "" : "none"
	el("tab_header").style.display = header ? "" : "none"

	//Blocks
	var haveBlock = (player.galacticSacrifice!=undefined&&postBreak)||(player.pSac!=undefined&&player.infinitied>0)||quantumed||isQuantumReached()
	var haveBlock2 = player.pSac!==undefined&&(ghostified||hasAch("ng3p51")||canBigRip)

	el("bigcrunch").parentElement.style.top = haveBlock2 ? "259px" : haveBlock ? "139px" : "19px"
	el("quantumBlock").style.display = haveBlock ? "" : "none"
	el("quantumBlock").style.height = haveBlock2 ? "240px" : "120px"
	if (!header) return

	//Variables
	let funda = ghostified
	let quan = quantumed
	let eter = player.eternities !== 0 || quan
	let inf = player.infinitied > 0 || player.infinityPoints.gt(0) || eter
	let chal = player.challenges.includes("challenge1") || inf

	//NG-X Hell
	el("automationbtn").style.display = aarMod.ngmX > 3 && chal ? "inline-block" : "none"

	//Layers
	el("challengesbtn").style.display = chal ? "inline-block" : "none"
	el("infinitybtn").style.display = inf ? "inline-block" : "none"
	el("eternitystorebtn").style.display = eter ? "inline-block" : "none"
	el("quantumtabbtn").style.display = quan ? "inline-block" : "none"
	el("fundatabbtn").style.display = funda ? "inline-block" : "none"

	//Side-Tabs
	el("anttabbtn").style.display = quan && player.masterystudies.includes("d10") ? "inline-block" : "none"
	el("bltabbtn").style.display = funda && ghSave.wzb.unl ? "inline-block" : "none"
	el("tab_break").style.display = funda ? "" : "none"
}