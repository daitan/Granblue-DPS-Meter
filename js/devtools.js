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
        $timer = $(".timer"),
        $t_start = $("#start"),
        $t_stop = $("#stop"),
        $t_reset = $("#reset"),
        total_secs = 0.0,
        seconds = 0.0,
        minutes = 0,
        interval = 0.1,
        interval_ms = interval * 1000,

        isTimerRunning = false;

    function bindRequest() {

        chrome.devtools.network.onRequestFinished.addListener(function(request) {

            var parser = document.createElement('a'),
                params = null,
                data = null,
                i = 0,
                hasParsedAttack = false,
                isDamage = false,
				isFromPlayer = false,
				isSummon = false,
				isAttack = false;

            parser.href = request.request.url;
            if (parser.hostname.split('.')[1] == "granbluefantasy") {
                params = parser.pathname.split('/');
				if ((params[2] != "ability_result.json") && (params[2] != "normal_attack_result.json") && (params[2] != "summon_result.json")) {
					return;
				}
                request.getContent(function(body) {
                    parsed = JSON.parse(body);

                    if (parsed) {
                        if (typeof parsed !== "undefined") {
                            data = parsed;
                        }

                        if (data.scenario) {
                            for (var i = 0, len_i = data.scenario.length; i < len_i; i++) {
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
										break;
									// attack handler
									case "attack":
										if (isFromPlayer == false) {
											break;
										}
										if (typeof data.scenario[i].damage != "undefined") {
											for (var j = 0, len_j = data.scenario[i].damage.length; j < len_j; j++) {
												for (var k = 0, len_k = data.scenario[i].damage[j].length; k < len_k; k++) {
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
											for (var j = 0, len_j = data.scenario[i].list.length; j < len_j; j++) {
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
											for (var j = 0, len_j = data.scenario[i].list.length; j < len_j; j++) {
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

                    }
                });
            }
        });

    }

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
        bindRequest();
    }

    start();

})();