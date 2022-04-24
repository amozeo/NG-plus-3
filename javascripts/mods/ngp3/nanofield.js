// OLD
function getNanospeedText(){
	s = getNanofieldSpeedText()
	if (!shiftDown) s = ghostified || nanospeed != 1 ? "Your Nanofield speed is currently " + (nanospeed == 1 ? "" : shorten(tmp.ns) + " * " + shorten(nanospeed) + " = ") + shorten(getNanofieldFinalSpeed()) + "x (hold shift for details)" : ""
	return s
}

function updateNanoverseTab(){
	var rewards = nfSave.rewards
	var free = tmp.nanofield_free_rewards
	var total = rewards + free
	el("quarksNanofield").textContent = shortenDimensions(quSave.replicants.quarks)		
	el("quarkCharge").textContent = shortenMoney(nfSave.charge)
	el("quarkChargeRate").textContent = shortenDimensions(getQuarkChargeProduction())
	el("quarkLoss").textContent = shortenDimensions(getQuarkLossProduction())
	el("preonEnergy").textContent = shortenMoney(nfSave.energy)
	el("quarkEnergyRate").textContent = shortenMoney(getQuarkEnergyProduction())
	el("quarkPower").textContent = getFullExpansion(nfSave.power)
	el("quarkPowerThreshold").textContent = shortenMoney(nfSave.powerThreshold)
	el("quarkAntienergy").textContent = shortenMoney(nfSave.antienergy)
	el("quarkAntienergyRate").textContent = shortenMoney(getQuarkAntienergyProduction())
	el("quarkChargeProductionCap").textContent = shortenMoney(getQuarkChargeProductionCap())
	el("rewards").textContent = getFullExpansion(rewards)+(free>=1?" + "+getFullExpansion(free):"")

	for (var reward = 1; reward < 9; reward++) {
		el("nfReward" + reward).className = reward > total ? "nfRewardlocked" : "nfReward"
		el("nfReward" + reward).textContent = wordizeList(nanoRewards.effectsUsed[reward].map(x => nanoRewards.effectDisplays[x](tmp.nf.effects[x])), true) + "."
		el("nfRewardHeader" + reward).textContent = (total % 8 + 1 == reward ? "Next" : DISPLAY_NAMES[reward]) + " reward"
		el("nfRewardTier" + reward).textContent = "Tier " + getFullExpansion(Math.ceil((total + 1 - reward) / 8)) + " / Power: " + tmp.nf.powers[reward].toFixed(1)
	}
	el("nfReward5").textContent = (tmp.nf.powers[5] > 15 ? nanoRewards.effectDisplays.light_threshold_speed(tmp.nf.effects.light_threshold_speed) : nanoRewards.effectDisplays.dil_effect_exp(tmp.nf.effects.dil_effect_exp)) + "."
	el("ns").textContent = getNanospeedText()
}

function updateNanofieldAntipreon(){
	var rewards = nfSave.rewards
	el("rewards_AP").textContent = getFullExpansion(rewards)
	el("rewards_wake").textContent = getFullExpansion(tmp.apgw)
	el("sleepy").style.display = nfSave.apgWoke ? "none" : ""
	el("woke").style.display = nfSave.apgWoke ? "" : "none"
}

function getQuarkChargeProduction(noSpeed) {
	let ret = E(1)
	if (isNanoEffectUsed("preon_charge")) ret = tmp.nf.effects.preon_charge
	if (hasNU(3)) ret = ret.times(tmp.nu[1])
	if (hasNU(7)) ret = ret.times(tmp.nu[3])
	if (nfSave.power > tmp.apgw) ret = ret.div(pow2((nfSave.power - tmp.apgw) / 2))
	if (!noSpeed) ret = ret.times(getNanofieldFinalSpeed())
	return ret
}

function startProduceQuarkCharge() {
	nfSave.producingCharge = !nfSave.producingCharge
	el("produceQuarkCharge").innerHTML = (nfSave.producingCharge ? "Stop" : "Start") + " production of preon charge." + (nfSave.producingCharge ? "" : "<br>(You will not get preons when you do this.)")
}

function getQuarkLossProduction() {
	let ret = getQuarkChargeProduction(true)
	let retCube = ret.pow(3)
	if (retCube.gte("1e180")) retCube = retCube.pow(Math.pow(180 / retCube.log10(), 2 / 3))
	ret = ret.times(retCube).times(4e25)
	if (hasNU(3)) ret = ret.div(10)
	if (nfSave.power > tmp.apgw) ret = ret.pow((nfSave.power - tmp.apgw) / 5 + 1)
	ret = ret.times(getNanofieldFinalSpeed())
	return ret
}

function getQuarkEnergyProduction() {
	let ret = nfSave.charge.mul(5).sqrt()
	if (player.masterystudies.includes("t411")) ret = ret.times(getMTSMult(411))
	if (player.masterystudies.includes("t421")) ret = ret.times(getMTSMult(421))
	if (isNanoEffectUsed("preon_energy")) ret = ret.times(tmp.nf.effects.preon_energy)
	ret = ret.times(getNanofieldFinalSpeed())
	return ret
}

function getQuarkAntienergyProduction() {
	let ret = nfSave.charge.sqrt()
	if (player.masterystudies.includes("t401")) ret = ret.div(getMTSMult(401))
	if (nfSave.power > tmp.apgw) ret = ret.times(pow2((nfSave.power - tmp.apgw) / 2))
	ret = ret.times(getNanofieldFinalSpeed())
	return ret
}

function getQuarkChargeProductionCap() {
	return nfSave.charge.times(2500).sqrt()
}

var nanoRewards = {
	effects: {
		hatch_speed: function(x) {
			return E_pow(30, x)
		},
		ma_effect_exp: function(x) {
			return x * 6.8
		},
		dil_gal_gain: function(x) {
			x = Math.pow(x, 0.83) * 0.039
			if (x > 1/3) x = (Math.log10(x * 3) + 1) / 3
			return x + 1
		},
		dt_to_ma_exp: function(x) {
			return Math.sqrt(x) * 0.021 + 1
		},
		dil_effect_exp: function(x) {
			if (x > 15) tier = Math.log10(x - 5) * 15
			return x * 0.36 + 1
		},
		meta_boost_power: function(x) {
			let y = 2
			if (tmp.ngp3l) y = 3
			else if (player.dilation.upgrades.includes("ngpp4")) y = getDil15Bonus()
			return x * 1.34 + y
		},
		remote_start: function(x) {
			return x * 2150
		},
		preon_charge: function(x) {
			return E_pow(2.6, x)
		},
		per_10_power: function(x) {
			return x * 0.76
		},
		preon_energy: function(x) {
			if (tmp.ngp3l) return x > 0 ? 2.5 : 1
			return E_pow(2.5, Math.sqrt(x))
		},
		supersonic_start: function(x) {
			return Math.floor(Math.max(x - 3.5, 0) * 75e5)
		},
		neutrinos: function(x) {
			return pow10(x * 10)
		},
		light_threshold_speed: function(x) {
			return Math.max(Math.sqrt(x + 1) / 4, 1)
		}
	},
	effectDisplays: {
		hatch_speed: function(x) {
			return "eggons hatch " + shorten(x) + "x faster"
		},
		ma_effect_exp: function(x) {
			return "meta-antimatter effect is buffed to ^" + x.toFixed(2)
		},
		dil_gal_gain: function(x) {
			return "you gain " + (x * 100 - 100).toFixed(2) + "% more free galaxies"
		},
		dt_to_ma_exp: function(x) {
			return "dilated time gives ^" + x.toFixed(3) + " boost to all Meta Dimensions"
		},
		dil_effect_exp: function(x) {
			return "in dilation, Normal Dimension multipliers and Tickspeed are raised by ^" + x.toFixed(2)
		},
		meta_boost_power: function(x) {
			return "each meta-Dimension Boost gives " + x.toFixed(2) + "x boost"
		},
		remote_start: function(x) {
			return "Remote Antimatter Galaxies scaling starts " + getFullExpansion(Math.floor(x)) + " later"
		},
		preon_charge: function(x) {
			return "you produce " + shorten(x) + "x faster preon charge"
		},
		per_10_power: function(x) {
			return "multiplier per ten dimensions is increased by " + x.toFixed(2) + "x before the electrons effect"
		},
		preon_energy: function(x) {
			return "you produce " + shorten(x) + "x faster preon energy"
		},
		supersonic_start: function(x) {
			return "Dimension Supersonic scaling starts " + getFullExpansion(Math.floor(x)) + " later"
		},
		neutrinos: function(x) {
			return "you gain " + shorten(x) + "x more neutrinos"
		},
		light_threshold_speed: function(x) {
			return "Light threshold increases " + x.toFixed(2) + "x slower"
		}
	},
	effectsUsed: {
		1: ["hatch_speed"],
		2: ["ma_effect_exp"],
		3: ["dil_gal_gain"],
		4: ["dt_to_ma_exp"],
		5: ["dil_effect_exp"],
		6: ["meta_boost_power"],
		7: ["remote_start", "preon_charge"],
		8: ["per_10_power", "preon_energy"],
	},
	effectToReward: {}
}

function isNanoEffectUsed(x) {
	return tmp.nf !== undefined && tmp.nf.rewardsUsed !== undefined && tmp.nf.rewardsUsed.includes(x) && tmp.nf.effects !== undefined
}

function getNanofieldSpeedText(){
	text = ""
	if (ghostified) text += "Ghostify Bonus: " + shorten(nfSave.rewards >= 16 ? 1 : (ghSave.milestone >= 1 ? 6 : 3)) + "x, "
	if (hasAch("ng3p78")) text += "'Aren't you already dead' reward: " +shorten(Math.sqrt(getTreeUpgradeLevel(8) * tmp.tue + 1)) + "x, "
	if (hasNU(15)) text += "Neutrino upgrade 15: " + shorten(tmp.nu[6]) + "x, "
	if (text == "") return "No multipliers currently"
	return text.slice(0, text.length-2)
}

function getNanofieldSpeed() {
	let x = 1
	if (ghostified) x *= nfSave.rewards >= 16 ? 1 : (ghSave.milestone >= 1 ? 6 : 3)
	if (hasAch("ng3p78")) x *= Math.sqrt(getTreeUpgradeLevel(8) * tmp.tue + 1)
	if (hasNU(15)) x = tmp.nu[6].times(x)
	return x
}

function getNanofieldFinalSpeed() {
	return Decimal.times(tmp.ns, nanospeed)
}

function getNanoRewardPower(reward, rewards) {
	let x = Math.ceil((rewards - reward + 1) / 8)
	let apgw = tmp.apgw
	if (rewards >= apgw) {
		let sbsc = Math.ceil((apgw - reward + 1) / 8)
		x = Math.sqrt((x / 2 + sbsc / 2) * sbsc)
		if (reward == (rewards - 1) % 8 + 1) x += 0.5
	}
	return x * tmp.nf.powerEff
}

function getNanoRewardPowerEff() {
	let x = 1
	if (hasBosonicUpg(31)) x *= tmp.blu[31]
	return x
}

function getNanoRewardReq(additional){
	return getNanoRewardReqFixed(additional - 1 + nfSave.power)
}

function getActiveNanoScalings(){
	ret = [true, true]
	//there are two total scalings and they all start active
	if (hasAch("ng3p82")) ret[2] = false 
	return ret
}

function getNanoScalingsStart(){
	ret = [0, 15]
	return ret
}

function getNanoRewardReqFixed(n){
	let x = E(50)
	let a = getActiveNanoScalings()
	let s = getNanoScalingsStart()
	if (n >= s[0] && a[0]) x = x.times(E_pow(4.0, (n - s[0])))
	if (n >= s[1] && a[1]) x = x.times(E_pow(2.0, (n - s[1]) * (n - s[1] + 3)))
	if (!ghSave.ghostlyPhotons.unl) return x
	return x.pow(tmp.ppti || 1)
}

function updateNextPreonEnergyThreshold(){
	let en = nfSave.energy
	let increment = 0.5
	let toSkip = 0
	var check = 0
	while (en.gte(getNanoRewardReq(increment * 2))) {
		increment *= 2
	}
	while (increment >= 1) {
		check = toSkip + increment
		if (en.gte(getNanoRewardReq(check))) toSkip += increment
		increment /= 2
	}
	nfSave.power += toSkip
	nfSave.powerThreshold = getNanoRewardReq(1)
}

// NEW | DIFFICULTY : MEDIUM
let NF = {
	setup() {
		return {
			reduce: 0,
			charges: [ E(0), E(0), E(0), E(0), E(0), E(0), E(0), E(0), E(0) ],
			directs: {}
		}
	},
	shown() {
		el("nanofieldtabbtn").style.display=player.masterystudies.includes("d12")?"":"none"
		el("nftabbtn").style.display=player.masterystudies.includes("d12")?"":"none"
	},

	rows() {
		let r = 3
		return r
	},
	data: {
		1: {
			eff: (x) => 1,
			desc: (x) => "Meta Dimension Boosts scale 0.00 slower.",
		},
		2: {
			eff: (x) => 1,
			desc: (x) => "Preons boost all color powers by 1.00x.",
		},
		3: {
			eff: (x) => 1,
			desc: (x) => "Dilated time gives ^1.00 boost to Meta Dimensions.",
		},
		4: {
			eff: (x) => 1,
			desc: (x) => "Electron softcap starts 0 later.",
		},
		5: {
			eff: (x) => 1,
			desc: (x) => "Emperor Dimensions produce 1.00x faster.",
		},
		6: {
			eff: (x) => 1,
			desc: (x) => "3x TP upgrade scales ^1.00 slower.",
		},
		7: {
			eff: (x) => 1,
			desc: (x) => "TP formula upgrade scales ^1.00 slower.",
		},
		8: {
			eff: (x) => 1,
			desc: (x) => "Replicantis boost dilated time by 1.00x.",
		},
		9: {
			eff: (x) => 1,
			desc: (x) => "Color power effects are 1.00x effective.",
		},
	}
}
let NANOFIELD = NF