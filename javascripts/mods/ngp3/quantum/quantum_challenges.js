var quantumChallenges = {
	costs:[0, 16750, 19100, 21500,  24050,  25900,  28900, 31300, 33600],
	goals:[0, 6.65e9, 7.68e10, 4.525e10, 5.325e10, 1.344e10, 5.61e8, 6.254e10, 2.925e10]
}

var assigned = []
var pcFocus = 0
function updateQuantumChallenges() {
	if (!tmp.ngp3 || !player.masterystudies.includes("d8")) {
		el("qctabbtn").style.display = "none"
		el("pctabbtn").style.display = "none"
		return
	} else el("qctabbtn").style.display = ""
	var assigned = []
	var assignedNums = {}
	el("pctabbtn").style.display = player.masterystudies.includes("d9") ? "" : "none"
	el("respecPC").style.display = player.masterystudies.includes("d9") ? "" : "none"
	for (var pc = 1; pc <= 4; pc++) {
		var subChalls = quSave.pairedChallenges.order[pc]
		if (subChalls) for (var sc=0; sc < 2; sc++) {
			var subChall = subChalls[sc]
			if (subChall) {
				assigned.push(subChall)
				assignedNums[subChall] = pc
			}
		}
		if (player.masterystudies.includes("d9")) {
			var property = "pc" + pc
			var sc1 = quSave.pairedChallenges.order[pc] ? quSave.pairedChallenges.order[pc][0] : 0
			var sc2 = (sc1 ? quSave.pairedChallenges.order[pc].length > 1 : false) ? quSave.pairedChallenges.order[pc][1] : 0
			el(property+"desc").textContent = "Paired Challenge "+pc+": Both Quantum Challenge " + (sc1 ? sc1 : "?") + " and " + (sc2 ? sc2 : "?") + " are applied."
			el(property+"cost").textContent = "Cost: " + (sc2 ? getFullExpansion(getQCCost(pc + 8)) : "???") + " electrons"
			el(property+"goal").textContent = "Goal: " + (sc2 ? shortenCosts(pow10(getQCGoal(pc + 8))) : "???") + " antimatter"
			el(property).textContent = pcFocus == pc ? "Cancel" : (quSave.pairedChallenges.order[pc] ? quSave.pairedChallenges.order[pc].length < 2 : true) ? "Assign" : quSave.pairedChallenges.completed >= pc ? "Completed" : quSave.pairedChallenges.completed + 1 < pc ? "Locked" : quSave.pairedChallenges.current == pc ? "Running" : "Start"
			el(property).className = pcFocus == pc || (quSave.pairedChallenges.order[pc] ? quSave.pairedChallenges.order[pc].length < 2 : true) ? "challengesbtn" : quSave.pairedChallenges.completed >= pc ? "completedchallengesbtn" : quSave.pairedChallenges.completed + 1 <pc ? "lockedchallengesbtn" : quSave.pairedChallenges.current == pc ? "onchallengebtn" : "challengesbtn"

			var sc1t = Math.min(sc1, sc2)
			var sc2t = Math.max(sc1, sc2)
			if (player.masterystudies.includes("d14")) {
				el(property + "br").style.display = ""
				el(property + "br").textContent = sc1t != 6 || sc2t != 8 ? "QC6 & 8" : brSave.active ? "Big Ripped" : quSave.pairedChallenges.completed + 1 < pc ? "Locked" : "Big Rip"
				el(property + "br").className = sc1t != 6 || sc2t != 8 ? "lockedchallengesbtn" : brSave.active ? "onchallengebtn" : quSave.pairedChallenges.completed + 1 < pc ? "lockedchallengesbtn" : "bigripbtn"
			} else el(property + "br").style.display = "none"
		}
	}
	for (var qc = 1; qc <= 8; qc++) {
		var property = "qc" + qc
		el(property + "div").style.display = (qc < 2 || QCIntensity(qc - 1)) ? "inline-block" : "none"
		el(property).textContent = ((!assigned.includes(qc) && pcFocus) ? "Choose" : inQC(qc) ? "Running" : QCIntensity(qc) ? (assigned.includes(qc) ? "Assigned" : "Completed") : "Start") + (assigned.includes(qc) ? " (PC" + assignedNums[qc] + ")" : "")
		el(property).className = (!assigned.includes(qc) && pcFocus) ? "challengesbtn" : inQC(qc) ? "onchallengebtn" : QCIntensity(qc) ? "completedchallengesbtn" : "challengesbtn"
		el(property + "cost").textContent = "Cost: " + getFullExpansion(quantumChallenges.costs[qc]) + " electrons"
		el(property + "goal").textContent = "Goal: " + shortenCosts(pow10(getQCGoal(qc))) + " antimatter"
	}
	updateQCDisplaysSpecifics()
}

function updateQCDisplaysSpecifics(){
	el("qc2reward").textContent = Math.round(tmp.qcRewards[2] * 100 - 100)
	el("qc7desc").textContent = "Dimension and Tickspeed cost multiplier increases are " + shorten(Number.MAX_VALUE) + "x. Multiplier per ten Dimensions and meta-Antimatter boost to Dimension Boosts are disabled."
	el("qc7reward").textContent = (100 - tmp.qcRewards[7] * 100).toFixed(2)
	el("qc8reward").textContent = tmp.qcRewards[8]
}

function inQC(num) {
	return tmp.inQCs.includes(num)
}

function updateInQCs() {
	tmp.inQCs = [0]
	if (quSave !== undefined && quSave.challenge !== undefined) {
		data = quSave.challenge
		if (typeof(data) == "number") data = [data]
		else if (data.length == 0) data = [0]
		tmp.inQCs = data
	}
}

function getQCGoal(num, bigRip) {
	if (player.masterystudies == undefined) return 0
	var c1 = 0
	var c2 = 0
	var mult = 1
	if (hasAch("ng3p96") && !bigRip) mult *= 0.95
	if (num == undefined) {
		var data = tmp.inQCs
		if (data[0]) c1 = data[0]
		if (data[1]) c2 = data[1]
	} else if (num < 9) {
		c1 = num
	} else if (quSave.pairedChallenges.order[num - 8]) {
		c1 = quSave.pairedChallenges.order[num - 8][0]
		c2 = quSave.pairedChallenges.order[num - 8][1]
	}
	if (c1 == 0) return quantumChallenges.goals[0] * mult
	if (c2 == 0) return quantumChallenges.goals[c1] * mult
	var cs = [c1, c2]
	mult *= mult
	if (cs.includes(1) && cs.includes(3)) mult *= 1.6
	if (cs.includes(2) && cs.includes(6)) mult *= 1.7
	if (cs.includes(3) && cs.includes(7)) mult *= 2.68
	if (cs.includes(3) && cs.includes(6)) mult *= 3
	return quantumChallenges.goals[c1] * quantumChallenges.goals[c2] / 1e11 * mult
}

function QCIntensity(num) {
	if (tmp.ngp3 && quSave !== undefined && quSave.challenges !== undefined) return quSave.challenges[num] || 0
	return 0
}

function updateQCTimes() {
	el("qcsbtn").style.display = "none"
	if (!player.masterystudies) return
	var temp = 0
	var tempcounter = 0
	for (var i = 1; i < 9; i++) {
		setAndMaybeShow("qctime" + i, quSave.challengeRecords[i], '"Quantum Challenge ' + i + ' time record: "+timeDisplayShort(quSave.challengeRecords[' + i + '], false, 3)')
		if (quSave.challengeRecords[i]) {
			temp+=quSave.challengeRecords[i]
			tempcounter++
		}
	}
	if (tempcounter > 0) el("qcsbtn").style.display = "inline-block"
	setAndMaybeShow("qctimesum", tempcounter > 1, '"The sum of your completed Quantum Challenge time records is "+timeDisplayShort(' + temp + ', false, 3)')
}

var ranking=0
function updatePCCompletions() {
	var shownormal = false
	el("pccompletionsbtn").style.display = "none"
	if (!player.masterystudies) return
	var r = 0
	tmp.pcc = {} // PC Completion counters
	for (var c1 = 2; c1 < 9; c1++) for (var c2 = 1; c2 < c1; c2++) {
		var rankingPart = 0
		if (quSave.pairedChallenges.completions[c2 * 10 + c1]) {
			rankingPart = 5 - quSave.pairedChallenges.completions[c2 * 10 + c1]
			tmp.pcc.normal = (tmp.pcc.normal || 0) + 1
		} else if (c2 * 10 + c1 == 68 && ghostified) {
			rankingPart = 0.5
			tmp.pcc.normal = (tmp.pcc.normal || 0) + 1
		}
		if (quSave.qcsNoDil["pc" + (c2 * 10 + c1)]) {
			rankingPart += 5 - quSave.qcsNoDil["pc" + ( c2 * 10 + c1)]
			tmp.pcc.noDil = (tmp.pcc.noDil || 0) + 1
		}
		for (var m = 0; m < qcm.modifiers.length; m++) {
			var id = qcm.modifiers[m]
			var data = quSave.qcsMods[id]
			if (data && data["pc" + (c2 * 10 + c1)]) {
				rankingPart += 5 - data["pc" + (c2 * 10 + c1)]
				tmp.pcc[id] = (tmp.pcc[id] || 0) + 1
				shownormal = true
			}
		}
		r += Math.sqrt(rankingPart)
	}
	r *= 100 / 56
	if (r) el("pccompletionsbtn").style.display = "inline-block"
	el("pccranking").textContent = r.toFixed(1)
	el("pccrankingMax").textContent = Math.sqrt(1e4 * (2 + qcm.modifiers.length)).toFixed(1)
	updatePCTable()
	for (var m = 0; m < qcm.modifiers.length; m++) {
		var id = qcm.modifiers[m]
		var shownormal = quSave.qcsMods[id] !== undefined || shownormal
		el("qcms_" + id).style.display = quSave.qcsMods[id] !== undefined ? "" : "none"
	}
	el("qcms_normal").style.display = shownormal ? "" : "none"
	if (r >= 75) {
		el("modifiersdiv").style.display = ""
		for (var m = 0; m < qcm.modifiers.length; m++) {
			var id = qcm.modifiers[m]
			if (r >= qcm.reqs[id] || !qcm.reqs[id]) {
				el("qcm_" + id).className = qcm.on.includes(id) ? "chosenbtn" : "storebtn"
				el("qcm_" + id).setAttribute('ach-tooltip', qcm.descs[id] || "???")
			} else {
				el("qcm_" + id).className = "unavailablebtn"
				el("qcm_" + id).setAttribute('ach-tooltip', 'Get ' + qcm.reqs[id] + ' Paired Challenges ranking to unlock this modifier. Ranking: ' + ranking.toFixed(1))
			}
		}
	} else el("modifiersdiv").style.display = "none"
	
	ranking = r // its global
}

let qcRewards = {
	effects: {
		1: function(comps) {
			if (comps == 0) return 1
			let base = getDimensionFinalMultiplier(1).times(getDimensionFinalMultiplier(2)).max(1).log10()
			let exp = 0.225 + comps * .025
			return pow10(Math.pow(base, exp) / 200)
		},
		2: function(comps) {
			if (comps == 0) return 1
			return 1.2 + comps * 0.2
		},
		3: function(comps) {
			if (comps == 0) return 1
			let ipow = player.infinityPower.plus(1).log10()
			let log = Math.sqrt(ipow / 2e8) 
			if (comps >= 2) log += Math.pow(ipow / 1e9, 4/9 + comps/9)
			
			log = softcap(log, "qc3reward")
			return pow10(log)
		},
		4: function(comps) {
			if (comps == 0) return 1
			let mult = player.meta[2].amount.times(player.meta[4].amount).times(player.meta[6].amount).times(player.meta[8].amount).max(1)
			if (comps <= 1) return E_pow(10 * comps, Math.sqrt(mult.log10()) / 10)
			return mult.pow(comps / 150)
			
		},
		5: function(comps) {
			if (comps == 0) return 0
			return Math.log10(1 + player.resets) * Math.pow(comps, 0.4)
		},
		6: function(comps) {
			if (comps == 0) return 1
			return player.achPow.pow(comps * 2 - 1)
		},
		7: function(comps) {
			if (comps == 0) return 1
			return Math.pow(0.975, comps)
		},
		8: function(comps) {
			if (comps == 0) return 1
			return comps + 2
		}
	}
}

function updateQCRewardsTemp() {
	tmp.qcRewards = {}
	for (var c = 1; c <= 8; c++) tmp.qcRewards[c] = qcRewards.effects[c](QCIntensity(c))
}

function getQCCost(num) {
	if (hasAch("ng3p55")) return 0
	if (num > 8) return quantumChallenges.costs[quSave.pairedChallenges.order[num - 8][0]] + quantumChallenges.costs[quSave.pairedChallenges.order[num - 8][1]]
	return quantumChallenges.costs[num]
}

function showQCModifierStats(id) {
	tmp.pct = id
	updatePCTable()
}

function updatePCTable() {
	var data=quSave.qcsMods[tmp.pct]
	for (r = 1; r < 9; r++) for (c = 1; c < 9; c++) {
		if (r != c) {
			var divid = "pc" + (r * 10 + c)
			var pcid = r * 10 + c
			if (r > c) pcid = c * 10  +r
			if (tmp.pct == "") {
				var comp = quSave.pairedChallenges.completions[pcid]
				if (comp !== undefined) {
					el(divid).textContent = "PC" + comp
					el(divid).className = (quSave.qcsNoDil["pc" + pcid] ? "nd" : "pc" + comp) + "completed"
					var achTooltip = 'Fastest time: ' + (quSave.pairedChallenges.fastest[pcid] ? timeDisplayShort(quSave.pairedChallenges.fastest[pcid]) : "N/A")
					if (quSave.qcsNoDil["pc" + pcid]) achTooltip += ", No dilation: PC" + quSave.qcsNoDil["pc" + pcid]
					el(divid).setAttribute('ach-tooltip', achTooltip)
					if (divid=="pc38") giveAchievement("Hardly marked")
					if (divid=="pc68") giveAchievement("Big Rip isn't enough")
				} else if (pcid == 68 && ghostified) {
					el(divid).textContent = "BR"
					el(divid).className = "brCompleted"
					el(divid).removeAttribute('ach-tooltip')
					el(divid).setAttribute('ach-tooltip', 'Fastest time from start of Ghostify: ' + timeDisplayShort(ghSave.best))
				} else {
					el(divid).textContent = ""
					el(divid).className = ""
					el(divid).removeAttribute('ach-tooltip')
				}
			} else if (data&&data["pc" + pcid]) {
				var comp = data["pc" + pcid]
				el(divid).textContent = "PC" + comp
				el(divid).className = "pc" + comp + "completed"
				el(divid).removeAttribute('ach-tooltip')
			} else {
				el(divid).textContent = ""
				el(divid).className = ""
				el(divid).removeAttribute('ach-tooltip')
			}
		} else { // r == c
			var divid = "qcC" + r
			if (tmp.pct == "" || (data && data["qc" + r])) {
				el(divid).textContent = "QC"+r
				if (quSave.qcsNoDil["qc" + r] && tmp.pct == "") {
					el(divid).className = "ndcompleted"
					el(divid).setAttribute('ach-tooltip', "No dilation achieved!")
				} else {
					el(divid).className = "pc1completed"
					el(divid).removeAttribute('ach-tooltip')
				}
			} else {
				el(divid).textContent = ""
				el(divid).className = ""
				el(divid).removeAttribute('ach-tooltip')
			}
		}
	}
	el("upcc").textContent = (tmp.pct == "" ? "Unique PC completions" : (qcm.names[tmp.pct] || "???")) + ": " + (tmp.pcc.normal || 0) + " / 28"
	el("udcc").style.display = tmp.pct == "" ? "block" : "none"
	el("udcc").textContent="No dilation: " + (tmp.pcc.noDil || 0) + " / 28"
}

var qcm={
	modifiers:["ad", "sm"],
	names:{
		ad: "Anti-Dilation",
		sm: "Supermastery"
	},
	reqs:{
		ad: 100,
		sm: 165
	},
	descs:{
		ad: "You always have no Tachyon particles. You can dilate time, but you can't gain Tachyon particles.",
		sm: "You can't have normal Time Studies, and can't have more than 20 normal Mastery Studies."
	},
	on: []
}

function toggleQCModifier(id) {
	if (!(ranking >= qcm.reqs[id]) && qcm.reqs[id]) return
	if (qcm.on.includes(id)) {
		let data = []
		for (var m = 0; m < qcm.on.length; m++) if (qcm.on[m] != id) data.push(qcm.on[m])
		qcm.on = data
	} else qcm.on.push(id)
	el("qcm_" + id).className=qcm.on.includes(id) ? "chosenbtn" : "storebtn"
}

function inQCModifier(id) {
	if (player.masterystudies == undefined) return
	return quSave.qcsMods.current.includes(id)
}

function recordModifiedQC(id, num, mod) {
	var data = quSave.qcsMods[mod]
	if (data === undefined) {
		data = {}
		quSave.qcsMods[mod] = data
	}
	if (data[id] === undefined) data[id] = num
	else data[id] = Math.min(num, data[id])
}