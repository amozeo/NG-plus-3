function getGSAmount() {
	let galaxies = player.galaxies + player.replicanti.galaxies + player.dilation.freeGalaxies;
	let ret = new Decimal(Math.pow(Math.max(galaxies, 0), 1.5) * Math.max(player.resets - (player.currentChallenge=="challenge4"?2:4), 0));
	ret = ret.times(player.eightAmount.toNumber()/50+1)
	if (player.galacticSacrifice.upgrades.includes(32)) {
		return ret.times(galUpgrade32()).floor();
	} else {
		return ret.floor();
	}
}

function galacticSacrifice() {
	if (getGSAmount().eq(0)) return
	if (player.options.sacrificeConfirmation) if (!confirm("Galactic Sacrifice will do a galaxy reset, and then remove all of your galaxies, in exchange of galaxy points which can be use to buy many overpowered upgrades, but it will take a lot of time to recover, are you sure you wanna do this?")) return
	player.galacticSacrifice.galaxyPoints = player.galacticSacrifice.galaxyPoints.plus(getGSAmount())
	player.galaxies = -1
	player.galacticSacrifice.times++
	player.galacticSacrifice.time = 0
	GPminpeak = new Decimal(0)
	galaxyReset()
}

function resetGalacticSacrifice() {
	return player.galacticSacrifice ? {
		galaxyPoints: new Decimal(0),
		time: 0,
		times: 0,
		upgrades: []
	} : undefined
}

function isIC3Trapped() {
	return (!player.challenges.includes("postc3") && player.aarexModifications.newGameMinusMinusVersion !== undefined) || player.currentEternityChall === "eterc14"
}

//v1.2

let galUpgradeCosts = {
	11: 1,
	12: 3,
	13: 20,
	21: 1,
	22: 5,
	23: 100,
	31: 2,
	32: 8,
	33: 1000
}

function buyGalaxyUpgrade(i) {
	if (player.galacticSacrifice.upgrades.includes(i) || player.galacticSacrifice.galaxyPoints.lt(galUpgradeCosts[i])) return
	player.galacticSacrifice.upgrades.push(i)
	player.galacticSacrifice.galaxyPoints = player.galacticSacrifice.galaxyPoints.sub(galUpgradeCosts[i])
	if (i==11) for (d=1;d<8;d++) {
		var name = TIER_NAMES[d]
		player[name+"Cost"] = player[name+"Cost"].div(100)
	}
}

let galUpgrade12 = function () {
	return 2 * Math.pow(1 + player.galacticSacrifice.time / 600, 0.5);
}
let galUpgrade13 = function () {
	return player.galacticSacrifice.galaxyPoints.div(5).plus(1).pow(3)
}
let galUpgrade23 = function () {
	return Math.min(1+player.galacticSacrifice.galaxyPoints.max(1).log10()*0.75,5)
}
let galUpgrade32 = function () {
	return player.totalmoney.pow(0.003).add(1);
}
let galUpgrade33 = function () {
	return player.galacticSacrifice.galaxyPoints.max(1).log10()/4+1
}

function galacticUpgradeSpanDisplay () {
	document.getElementById('galspan12').innerHTML = formatValue(player.options.notation, galUpgrade12(), 1, 1)
	document.getElementById('galspan13').innerHTML = shorten(galUpgrade13())
	document.getElementById('galspan23').innerHTML = shortenMoney(getDimensionBoostPower().times(player.galacticSacrifice.upgrades.includes(23)?1:galUpgrade23()))
	document.getElementById('galspan32').innerHTML = formatValue(player.options.notation, galUpgrade32(), 1, 1)
	document.getElementById('galspan33').innerHTML = shorten(getDimensionPowerMultiplier(true)*(player.galacticSacrifice.upgrades.includes(23)?1:galUpgrade33()))
	document.getElementById('galcost33').innerHTML = shortenCosts(1e3)
}

function galacticUpgradeButtonTypeDisplay () {
	for (let i = 1; i <= 3; i++) {
		for (let j = 1; j <= 3; j++) {
			let e = document.getElementById('galaxy' + i + j);
			if (player.galacticSacrifice.upgrades.includes(+(i + '' + j))) {
				e.className = 'infinistorebtnbought'
			} else if (player.galacticSacrifice.galaxyPoints.gte(galUpgradeCosts[i + '' + j]) && (i === 1 || player.galacticSacrifice.upgrades.includes(+((i - 1) + '' + j)))) {
				e.className = 'infinistorebtn' + j;
			} else {
				e.className = 'infinistorebtnlocked'
			}
		}
	}
}