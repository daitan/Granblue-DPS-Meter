import React, {Component} from 'react';
import {connect} from 'react-redux';
var $ = require('jQuery');

class App extends Component
{
    constructor(props)
    {
        super(props);
        this.parseURL = this.parseURL.bind(this);
        this.parseData = this.parseData.bind(this);
    }

    parseURL(request)
    {
        var parser = document.createElement('a'),
            params = null,
            isValid = false;

        parser.href = request.request.url;
        if (parser.hostname.split('.')[1] == "granbluefantasy") {
            params = parser.pathname.split('/');
            //console.log(params);
            // TODO: add handler for retire.json
            for (var i = 0; i < params.length; i++)
            {
                if ((params[i] == "ability_result.json")
                    || (params[i] == "normal_attack_result.json")
                    || (params[i] == "summon_result.json")
                    || (params[i] == "start.json"))
                {
                    isValid = true;
                    break;
                }
            }

            if (isValid)
            {
                request.getContent(this.parseData);
            }
        }
    }

    parseData(body)
    {
        var data = JSON.parse(body),
            i = 0,
            hasParsedAttack = false,
            isDamage = false,
            isFromPlayer = false,
            isSummon = false,
            isAttack = false;

        if (data) {
            if (typeof data === "undefined") {
                return;
            }

            // parse combat data
            if (data.scenario) {
                for (var i = 0; i < data.scenario.length; i++) {
                    //ignore enemy data
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
                                        //dmg_last_turn += data.scenario[i].damage[j][k].value;
                                        this.props.dispatch({
                                            type: 'INCREMENT_TDMG',
                                            payload: data.scenario[i].damage[j][k].value
                                        });
                                    }
                                }
                                isAttack = true;
                                isDamage = true;
                                //start_timer();
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
                                    //dmg_last_turn += data.scenario[i].list[j].damage[0].value;
                                    this.props.dispatch({
                                        type: 'INCREMENT_TDMG',
                                        payload: data.scenario[i].list[j].damage[0].value
                                    });
                                }
                                isDamage = true;
                                if (isSummon == false) {
                                    isAttack = true;
                                    //start_timer();
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
                                    //dmg_last_turn += data.scenario[i].list[j].value;
                                    this.props.dispatch({
                                        type: 'INCREMENT_TDMG',
                                        payload: data.scenario[i].list[j].value
                                    });
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

                //if (isDamage == true) {
                //    total_dpt = total_dmg / (total_turns + 1);
                //    if (isAttack == true) {
                //        if (dmg_last_turn > highest_turn_dmg) {
                //            highest_turn_dmg = dmg_last_turn;
                //        }

                //        // reset counters
                //        dmg_last_turn = 0;

                //        total_turns++;
                //    }
                //}
            }
        }
    }

    componentDidMount()
    {
        chrome.devtools.network.onRequestFinished.addListener(this.parseURL);
    }

    render() {
        return (
            <div>
                <div>
                    Total damage: {this.props.tDmg}
                </div>
                <div>
                    <Timer updateInterval={1000} />
                </div>
            </div>
        );
    }
}

function startTimer(baseTime = 0) {
    return {
        type: "START",
        tSecs: baseTime,
        now: new Date().getTime()
    };
}

function stopTimer() {
    return {
        type: "STOP",
        now: new Date().getTime()
    };
}

function resetTimer() {
    return {
        type: "RESET",
        now: new Date().getTime()
    }
}

// Helper function that takes store state
// and returns the current elapsed time
function getElapsedTime(baseTime, startedAt, stoppedAt = new Date().getTime()) {
    if (!startedAt) {
        return 0;
    } else {
        console.log(stoppedAt - startedAt + baseTime)
        return stoppedAt - startedAt + baseTime;
    }
}

class Timer extends React.Component {
    componentDidMount() {
        this.interval = setInterval(this.forceUpdate.bind(this), this.props.updateInterval);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    render() {
        console.log(this.props);
        const { tSecs, timeStart, timeStop } = this.props;
        const elapsed = getElapsedTime(tSecs, timeStart, timeStop);

        console.log(this.props);
        return (
            <div>
                <div>Time: {elapsed}</div>
                <div>
                    <button onClick={() => this.props.startTimer(elapsed)}>Start</button>
                    <button onClick={() => this.props.stopTimer()}>Stop</button>
                    <button onClick={() => this.props.resetTimer()}>Reset</button>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        tDmg: state.tDmg,
        tDps: state.tDps,
        tTurns: state.tTurns,
        tDpt: state.tDpt,
        hTurnDmg: state.hTurnDmg,
        dmgLastTurn: state.dmgLastTurn,
        avgTurnTime: state.avgTurnTime,
        tSecs: state.tSecs,
        timeStart: state.timeStart,
        timeStop: state.timeStop
    };
};

export default connect(mapStateToProps, { startTimer, stopTimer, resetTimer })(Timer);
export default connect(mapStateToProps)(App);
