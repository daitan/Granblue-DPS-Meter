class Damage {
	constructor(value, type, crit) {
		this.value = value;
		this.type = type;
		this.crit = crit;
	}
}

class Ability {
	constructor(id, name, img, type, description) {
		this.id = id;
		this.name = name;
		this.img = img;
		this.type = type;
		this.description = description;
		this.dmg_history = [];
		this.total_use = 0;
		this.total_dmg = 0;
		this.total_crits = 0;
		this.dmg_last_use = 0;
		this.highest_dmg = 0;
	}
	
	function logDmg(dmg, turn) {
		this.dmg_last_use = dmg.value;
		this.total_dmg += dmg.value;
		this.total_use++;
		this.dmg_history.push({"turn":turn,"damage":dmg});
		if (dmg.crit) {
			total_crits++;
		}
		if (dmg.value > this.highest_dmg) {
			this.highest_dmg = dmg.value;
		}
	}
	
	function getAvgDmg() {
		return this.total_dmg / this.total_use;
	}
	
	function getAvgCrit() {
		return this.total_use / ths.total_crits;
	}
}

class Character { 
	constructor(name, pid, hp, hpmax, alive, cjs, img) {
		this.name = name;
		this.pid = pid;
		this.currhp = hp;
		this.maxhp = hpmax;
		this.isAlive = alive;
		this.cjs = cjs; //no idea what this is
		this.img = img;
		this.abilities = [];
		this.atk_history = [];
		this.total_dmg = 0;
		this.dmg_last_turn = 0;
		this.highest_turn_dmg = 0;
		this.total_atks = 0;
		this.total_crits = 0;
	}
	
	function checkAbility(id) {
		if (typeof this.abilities[id] === "undefined") {
			return false;
		} else {
			return true;
		}
	}
		
	function logAbility(id, dmg) {
		this.abilites[id].logDmg(dmg);
		this.dmg_last_turn += dmg.value;
		if (dmg.crit) {
			total_crits++;
		}
	}
	
	function logAttack(dmg, turn) {
		this.
	}
}

class Raid {
	constructor(chars, id, quest_id, formation) {
		this.chars = chars;
		this.id = id;
		this.quest_id = quest_id;
		this.total_dmg = 0;
		this.total_dps = 0;
		this.total_turns = 0;
		this.total_dpt = 0;
		this.highest_turn_dmg = 0;
		this.last_turn_dmg = 0;
		this.avg_turn_time = 0;
		this.total_secs = 0;
	}
}

(function() {

    var total_dmg = 0,
        $total_dmg = $(".totaldmg"),
        total_dps = 0,
        $total_dps = $(".totaldps"),
        total_turns = 0,
        $total_turns = $(".totalturns"),
        total_dpt = 0,
        $total_dpt = $(".totaldpt"),
        highest_turn_dmg = 0,
        $highest_turn_dmg = $(".highstturndmg"),
        dmg_last_turn = 0,
        $dmg_last_turn = $(".dmglastturn"),
		avg_turn_time = 0.0,
		$avg_turn_time = $(".avgturntime"),
        $timer = $(".timer"),
        $t_start = $("#start"),
        $t_stop = $("#stop"),
        $t_reset = $("#reset"),
        total_secs = 0.0,
        seconds = 0.0,
        minutes = 0,
        interval = 0.1,
        interval_ms = interval * 1000,

        isTimerRunning = false,
		
		raids = [],
		
		ports = [];

        chrome.runtime.onConnect.addListener(function(port) {
			if (port.name !== "gbfdpsmeter") {
				return;
			}
			ports.push(port);
			
			port.onDisconnect.addListener(function() {
				var i = ports.indexOf(port);
				if (i !== -1) ports.splice(i, 1);
			});
			
            var params = null,
                data = null,
                i = 0,
                hasParsedAttack = false,
                isDamage = false,
				isFromPlayer = false,
				isSummon = false,
				isAttack = false;

            port.onMessage.addListener(function(data) {
				if (typeof data === "undefined" || !data) {
					return;
				}
				
				// parse quest info
				if (data.source == "start.json") {
					if (data.raid_id) {
						// parse characters
						if (data.player && data.player.param) {
							var chars = [],
								img = "";
							for (var i = 0; i < data.player.param.length; i++) {
								if (data.player.param[i].leader) {
									img = "http://game-a1.granbluefantasy.jp/assets_en/img_mid/sp/assets/leader/quest/" + data.player.param[i].pid + ".jpg";
								} else {
									img = "http://game-a1.granbluefantasy.jp/assets_en/img_mid/sp/assets/npc/quest/" + data.player.param[i].pid_image + ".jpg";
								}
								chars[i] = new Character(data.player.param[i].name,
														 data.player.param[i].pid, 
														 data.player.param[i].hp, 
														 data.player.param[i].hpmax, 
														 data.player.param[i].alive, 
														 data.player.param[i].cjs, 
														 img);
							}
						} else {
							console.log("No valid player data found.");
						}
						
						raids[data.raid_id] = new Raid(chars, data.raid_id, data.quest_id, data.formation);
						console.log(raids);
					}
				}
				
				// parse combat data
				if (data.scenario) {
					for (var i = 0; i < data.scenario.length; i++) {
						//ignore enemy data
						isFromPlayer = false;
						if ((data.scenario[i].to == "boss") || (data.scenario[i].from == "player") || (data.scenario[i].target == "boss")) {
							isFromPlayer = true;
						}
						
						switch (data.scenario[i].cmd) {
							// ignore these cases for the time being
							case "heal":
							case "ability":
							case "condition":
							case "recast":
							case "effect":
							case "battlelog":
							case "turn":
							case "bgm":
							case "boss_gauge":
							case "formchange":
							case "windoweffect":
							case "message":
							case "wait":
							case "contribution":
								break;
							// attack handler
							case "attack":
								if (isFromPlayer == false) {
									break;
								}
								if (typeof data.scenario[i].damage != "undefined") {
									for (var j = 0; j < data.scenario[i].damage.length; j++) {
										for (var k = 0; k < data.scenario[i].damage[j].length; k++) {
											if (isNaN(data.scenario[i].damage[j][k].value)) {
												continue;
											}
											dmg_last_turn += data.scenario[i].damage[j][k].value;
											total_dmg += data.scenario[i].damage[j][k].value;
										}
									}
									isAttack = true;
									isDamage = true;
									start_timer();
								} else {
									console.log("Undefined damage variable in attack scenario: \n" + data.scenario[i]);
								}
								break;
							// ougi and summon handler
							case "summon":
								isFromPlayer = true;
								isSummon = true;
							case "special":
							case "special_npc":
								if (isFromPlayer == false) {
									break;
								}
								if (typeof data.scenario[i].list != "undefined") {
									if (data.scenario[i].list[0].damage.length === 0) {
										break;
									}
									for (var j = 0; j < data.scenario[i].list.length; j++) {
										if (isNaN(data.scenario[i].list[j].damage[0].value)) {
											continue;
										}
										dmg_last_turn += data.scenario[i].list[j].damage[0].value;
										total_dmg += data.scenario[i].list[j].damage[0].value;
									}
									isDamage = true;
									if (isSummon == false) {
										isAttack = true;
										start_timer();
									}
								} else {
									console.log("Undefined damage variable in ougi scenario: \n" + data.scenario[i]);
								}
								break;
							// ability and other damage handler
							case "damage":
								if (isFromPlayer == false) {
									break;
								}
								if (typeof data.scenario[i].list != "undefined") {
									for (var j = 0; j < data.scenario[i].list.length; j++) {
										if (isNaN(data.scenario[i].list[j].value)) {
											continue;
										}
										dmg_last_turn += data.scenario[i].list[j].value;
										total_dmg += data.scenario[i].list[j].value;
									}
									isDamage = true;
								} else {
									console.log("Undefined damage variable in scenario: \n" + data.scenario[i]);
								}
								break;
							default:
								console.log("Unhandled scenario command: " + data.scenario[i].cmd);
								break;
						}
					}
					
					if (isDamage == true) {
						$total_dmg.text(total_dmg);
						total_dpt = total_dmg / (total_turns + 1);
						$total_dpt.text(parseInt(total_dpt));
						if (isAttack == true) {
							if (dmg_last_turn > highest_turn_dmg) { 
								highest_turn_dmg = dmg_last_turn;
								$highest_turn_dmg.text(highest_turn_dmg);
							}
							$dmg_last_turn.text(dmg_last_turn);
							
							// reset counters
							dmg_last_turn = 0;
							
							total_turns++;
							$total_turns.text(parseInt(total_turns));
						}
					}
				}
            });
        });

    function add() {
        seconds += interval;
        total_secs += interval;

        if (total_secs > 0) {
            total_dps = total_dmg / total_secs;
            $total_dps.text(parseInt(total_dps));
        }

        if (seconds >= 60.0) {
            seconds = 0.0;
            minutes++;
        }

        $timer.text(minutes + " mins " + seconds.toFixed(1) + " secs ");

        stopwatch();
    }

    function stopwatch() {
        t = setTimeout(add, interval_ms);
    }

    function start_timer() {
        if (isTimerRunning == true) {
            return;
        }
        isTimerRunning = true;
        stopwatch();
    }

    function start() {

        /* Start button */
        $t_start.click(start_timer);

        /* Stop button */
        $t_stop.click(function() {
            isTimerRunning = false;
            clearTimeout(t);
        });

        /* Reset button */
        $t_reset.click(function() {
			$total_dps.text("0");
			$total_dmg.text("0");
			$total_dpt.text("0");
			$total_turns.text("0");
			$highest_turn_dmg.text("0");
			$dmg_last_turn.text("0");
            $timer.text("0 mins 0.0 secs");
            total_secs = 0.0;
			total_dps = 0;
			total_dmg = 0;
			total_dpt = 0;
			total_turns = 0;
			highest_turn_dmg = 0;
			dmg_last_turn = 0;
            seconds = 0.0;
            minutes = 0;
        });
    }

    start();

})();