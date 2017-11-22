(function() {
  var nextQuest = null;
  var nextCoop  = null;
  var currCoop  = null;
  var nextRaids = null;
  var nextRaids = {};
  var currRaids = [];
  var imageURL  = '../../assets/images/';
  var greyIcon  = '../../assets/images/icons/6201763.png';
  var blankIcon = '../../assets/images/icons/handtinytrans.gif';
  var eyeIcon   = '../../assets/images/icons/5100123.png';
  var dogeIcon  = '../../assets/images/icons/1300023.png';

  var raidImageURL = 'http://gbf.game-a1.mbga.jp/assets_en/img/sp/assets/summon/qm/';
  var isHL = false;

  var currRaidID = null;
  var currCoopID = null;

  //var mainCharacterImageURL = "http://gbf.game-a1.mbga.jp/assets_en/img/sp/assets/leader/raid_normal/";
  //var characterImageURL = "http://gbf.game-a1.mbga.jp/assets_en/img/sp/assets/npc/raid_normal/";
  var mainCharacterImageURL = 'http://gbf.game-a1.mbga.jp/assets_en/img/sp/assets/leader/quest/';
  var characterImageURL     = 'http://gbf.game-a1.mbga.jp/assets_en/img/sp/assets/npc/quest/';
  var enemyImageURL         = 'http://gbf.game-a1.mbga.jp/assets_en/img/sp/assets/enemy/s/';
  var skillImageURL         = 'http://gbf.game-a.mbga.jp/assets_en/img/sp/ui/icon/ability/m/';
  var skillImageClosingURL  = '.png?1458197995';
  var buffImageURL          = 'http://gbf.game-a1.mbga.jp/assets_en/img/sp/ui/icon/status/x64/';
  var summonImageURL        = 'http://gbf.game-a.mbga.jp/assets_en/img/sp/assets/summon/m/';

  var tweetHash = {
    'Lvl 20 Griffin': 'Lv20 グリフォン',
    'Lvl 30 Griffin': 'Lv30 グリフォン',
    'Lvl 30 Tiamat': 'Lv30 ティアマト',
    'Lvl 50 Tiamat': 'Lv50 ティアマト',
    'Lvl 50 Tiamat Omega': 'Lv50 ティアマト・マグナ',
    'Lvl 100 Nezha': 'Lv100 ナタク',
    'Lvl 100 Garuda': 'Lv100 ガルーダ',
    'Lvl 100 Tiamat Omega Ayr': 'Lv100 ティアマト・マグナ＝エア',
    'Lvl 120 Nezha': 'Lv120 ナタク',

    'Lvl 20 Zarchnal Flame': 'Lv20 ザリチュナルフレイム',
    'Lvl 30 Zarchnal Flame': 'Lv30 ザリチュナルフレイム',
    'Lvl 30 Colossus': 'Lv30 コロッサス',
    'Lvl 50 Colossus': 'Lv50 コロッサス',
    'Lvl 70 Colossus Omega': 'Lv70 コロッサス・マグナ',
    'Lvl 100 Twin Elements': 'Lv100 フラム＝グラス',
    'Lvl 100 Athena': 'Lv100 アテナ',
    'Lvl 100 Colossus Omega': 'Lv100 コロッサス・マグナ',
    'Lvl 120 Twin Elements': 'Lv120 フラム＝グラス',

    'Lvl 20 Imperial Guard': 'Lv20 インペリアルガード',
    'Lvl 30 Imperial Guard': 'Lv30 インペリアルガード',
    'Lvl 30 Leviathan': 'Lv30 リヴァイアサン',
    'Lvl 50 Leviathan': 'Lv50 リヴァイアサン',
    'Lvl 60 Leviathan Omega': 'Lv60 リヴァイアサン・マグナ',
    'Lvl 100 Macula Marius': 'Lv100 マキュラ・マリウス',
    'Lvl 100 Grani': 'Lv100 グラニ',
    'Lvl 100 Leviathan Omega': 'Lv100 リヴァイアサン・マグナ',
    'Lvl 120 Macula Marius': 'Lv120 マキュラ・マリウス',

    'Lvl 30 Ancient Dragon': 'Lv30 エンシェントドラゴン',
    'Lvl 30 Yggdrasil': 'Lv30 ユグドラシル',
    'Lvl 50 Yggdrasil': 'Lv50 ユグドラシル',
    'Lvl 60 Yggdrasil Omega': 'Lv60 ユグドラシル・マグナ',
    'Lvl 100 Medusa': 'Lv100 メドゥーサ',
    'Lvl 100 Baal': 'Lv100 バアル',
    'Lvl 100 Yggdrasil Omega': 'Lv100 ユグドラシル・マグナ',
    'Lvl 120 Medusa': 'Lv120 メドゥーサ',

    'Lvl 30 Will-o\'-Wisp': 'Lv30 ウィル･オ･ウィスプ',
    'Lvl 30 Adversa': 'Lv30 アドウェルサ',
    'Lvl 50 Adversa': 'Lv50 アドウェルサ',
    'Lvl 75 Luminiera Omega': 'Lv75 シュヴァリエ・マグナ',
    'Lvl 100 Apollo': 'Lv100 アポロン',
    'Lvl 100 Odin': 'Lv100 オーディン',
    'Lvl 100 Luminiera Omega': 'Lv100 シュヴァリエ・マグナ',
    'Lvl 120 Apollo': 'Lv120 アポロン',

    'Lvl 30 Evil Eye': 'Lv30 イービルアイ',
    'Lvl 30 Celeste': 'Lv30 セレスト',
    'Lvl 50 Celeste': 'Lv50 セレスト',
    'Lvl 75 Celeste Omega': 'Lv75 セレスト・マグナ',
    'Lvl 100 Dark Angel Olivia': 'Lv100 Dエンジェル・オリヴィエ',
    'Lvl 100 Lich': 'Lv100 リッチ',
    'Lvl 100 Celeste Omega': 'Lv100 セレスト・マグナ',
    'Lvl 120 Dark Angel Olivia': 'Lv120 Dエンジェル・オリヴィエ',

    'Lvl 100 Proto Bahamut': 'Lv100 プロトバハムート',
    'Lvl 100 Grand Order': 'Lv100 ジ・オーダー・グランデ',
    'Lvl 110 Rose Queen': 'Lv110 ローズクイーン',
    'Lvl 150 Proto Bahamut': 'Lv150 プロトバハムート',

    'Lvl 120 Morrigna': 'Lv120 バイヴカハ',
    'Lvl 120 Prometheus': 'Lv120 プロメテウス',
    'Lvl 120 Ca Ong': 'Lv120 カー・オン',
    'Lvl 120 Gilgamesh': 'Lv120 ギルガメッシュ',
    'Lvl 120 Hector': 'Lv120 ヘクトル',
    'Lvl 120 Anubis': 'Lv120 アヌビス',

    'Lvl 60 Zhuque': 'Lv60 朱雀',
    'Lvl 60 Xuanwu': 'Lv60 玄武',
    'Lvl 60 Baihu': 'Lv60 白虎',
    'Lvl 60 Qinglong': 'Lv60 青竜',

    'Lvl 90 Agni': 'Lv90 アグニス',
    'Lvl 90 Neptune': 'Lv90 ネプチューン',
    'Lvl 90 Titan': 'Lv90 ティターン',
    'Lvl 90 Zephyrus': 'Lv90 ゼピュロス',

    'Lvl 100 Huanglong': 'Lv100 黄龍',
    'Lvl 100 Qilin': 'Lv100 黒麒麟',

    'Lvl 100 Xeno Ifrit': 'Lv100 ゼノ・イフリート',
    'Lvl 100 Xeno Vohu Manah': 'Lv100 ゼノ・ウォフマナフ',
    'Lvl 100 Xeno Cocytus': 'Lv100 ゼノ・コキュートス',
    'Lvl 100 Xeno Sagittarius': 'Lv100 ゼノ・サジタリウス',
    'Lvl 100 Xeno Diablo': 'Lv100 ゼノ・ディアボロス',
    'Lvl 100 Xeno Corow': 'Lv100 ゼノ・コロゥ',

    'Lvl 100 Raphael': 'Lv100 ラファエル',
    'Lvl 100 Gabriel': 'Lv100 ガブリエル',
    'Lvl 100 Uriel': 'Lv100 ウリエル',
    'Lvl 100 Michael': 'Lv100 ミカエル'
  };

  var sortByElement = function(a, b) {
    return raidInfo[a].sequence - raidInfo[b].sequence;
  };

  var sortByDifficulty = function(a, b) {
    return raidInfo[a].sequence2 - raidInfo[b].sequence2;
  };

  var quest      = null;
  var raids      = {};
  var raidTimers = {};

  var createQuest = function(id, devID) {
    var devIDs = [];
    if (devID !== undefined) {
      devIDs.push(devID);
    }
    return {
      id:          id,
      image:       greyIcon,
      characters:  [null, null, null, null, null, null],
      formation:   [],
      buffs:       [],
      enemies:     [null, null, null],
      summons:     [null, null, null, null, null, null],
      devIDs:      devIDs,
      ttlDmg:      0,
      ttlDps:      0,
      ttlDpt:      0,
      ttlTurns:    0,
      maxTurnDmg:  0,
      prevTurnDmg: 0,
      avgTurnTime: 0,
      time:        0,
      stTime:      null,
      spTime:      null
    };
  };

  var createCharacter = function(image, currHP, maxHP, currCharge, maxCharge) {
    return {
      image:      image,
      currHP:     currHP,
      maxHP:      maxHP,
      currCharge: currCharge,
      maxCharge:  maxCharge,
      skills:     [null, null, null, null],
      buffs:      []
    };
  };
  var createSkill = function(name, image, cooldown, turns, time) {
    return {
      name:     name,
      image:    image,
      cooldown: cooldown,
      turns:    turns,
      time:     time,
    };
  };
  var createBuff = function(owner, image, turns) {
    return {
      owner: owner,
      image: image,
      turns: turns
    };
  };

    //var enemies = [null, null, null];

  var createEnemy = function(image, currHP, maxHP, currCharge, maxCharge, mode) {
    return {
      image:      image,
      currHP:     currHP,
      maxHP:      maxHP,
      currCharge: currCharge,
      maxCharge:  maxCharge,
      mode:       mode,
      debuffs:    []
    };
  };

  var createDebuff = function(owner, image, time) {
    return {
      owner: owner,
      image: image,
      time:  time
    };
  };
  var createSummon = function(image, cooldown) {
    return {
      image:    image,
      cooldown: cooldown
    };
  };

  var questImageURLs = {};
  var events = [];
  
  var tryParseJson = function (str) {
    var tempStr = str;
    try {
      str = JSON.parse(str);
    } catch (e) {
      return tempStr;
    }
    return str;
  };

  window.Quest = {
    Initialize: function(callback) {
      Storage.GetMultiple(['quests'], function(response) {
        if (response['quests'] !== undefined) {
          var modified = false;
          if (response['quests']['301061'] == undefined) {
            for (var key in remainingQuests) {
              if (response['quests'][key] == undefined) {
                if (!Options.Get('isMagFest')) {
                  response['quests'][key] = raidInfo[key].max;
                } else {
                  response['quests'][key] = raidInfo[key].max + raidInfo[key].magDelta;
                }
              }
            }
            modified = true;
          }

          for (var i = 0; i < raidList.length; i++) {
            setRemainingRaids(raidList[i], response['quests'][raidList[i]]);
          }

          if (modified) {
            saveRemainingRaids();
          }
        }
        if (callback !== undefined) {
          callback();
        }
      });
    },

    InitializeDev: function() {
      var response = [];
      for (var i = 0; i < raidList.length; i++) {
        var raid = raidInfo[raidList[i]];
        var animeAmounts = null;
        if (raid.animeIDs !== null) {
          animeAmounts = [];
          for (var j = 0; j < raid.animeIDs.length; j++) {
            animeAmounts[j] = Supplies.Get(raid.animeIDs[j], raid.animeTypes[j]);
          }
        }

        var max = raid.max;
        if (Options.Get('isMagFest')) {
          max += raid.magDelta;
        }

        response.push({'addQuest': {
          'id': raidList[i],
          'name': raid.name,
          'amount': remainingQuests[raidList[i]],
          'max': max,
          'animeIDs': raid.animeIDs,
          'animeAmounts': animeAmounts
        }});
      }

      for (var i = 0; i < completedRaidList.length; i++) {
        response.push({'appendObject': {
          'id': '#daily-raid-' + completedRaidList[i],
          'target': '#completed-raid-list'
        }});
      }

      for (var i = 0; i < 4; i++) {
        response.push({'addQuestCharacter': {
          'index': i
        }});
      }

      for (var i = 0; i < 3; i++) {
        response.push({'addQuestEnemy': {
          'index': i
        }});
      }

      for (var i = 0; i < events.length; i++) {
        response.push({'setText': {
          'id': '#event-item-' + i,
          'value': Supplies.Get(events[i].currency1, 'event')
        }});
        for (var j = 0; j < events[i].bosses.length; j++) {
          response.push({'setClick': {
            'id': '#event-image-' + j,
            'value': events[i].bosses[j].url
          }});
        }
      }

      for (var i = 0; i < raidList.length; i++) {
        response.push({'hideObject': {
          'id': '#daily-raid-' + raidList[i],
          'value': !Options.Get(raidList[i])
        }});
      }
      return response;
    },

    Reset: function() {
      
    },

    CreateQuest: function(json, devID) {
      if (json.result !== false && json.is_host === false) {
        var id = '' + json.raid_id;
        if (raids[id] !== undefined) {
          return;
        }
        raids[id] = createQuest(id, devID);
        setQuestsJQuery();
      }
    },

    StartBattle: function (json, devID) {
      json = tryParseJson(json);
      var id = '' + json.raid_id;
      var currQuest;
      if (json.twitter !== undefined && json.twitter.battle_id !== undefined) {
        // do nothing for now
      }

      var exists = false;
      var image = enemyImageURL + json.boss.param[0].cjs.substring(json.boss.param[0].cjs.lastIndexOf('_') + 1) + '.png';
      if (raids[id] === undefined) {
        raids[id] = createQuest(id, devID);
      }
        currQuest = raids[id];
        currQuest.image = image;
      
      if (currQuest.devIDs.indexOf(devID) === -1) {
        currQuest.devIDs.push(devID);
      }
      setQuestsJQuery();
    },

    BattleAction: function(json, payload, devID) {
      json = tryParseJson(json);
      if (json.popup !== undefined) {
        return;
      }
      var id = '' + payload.raid_id;
      var currQuest;
      if (raids[id] !== undefined) {
        currQuest = raids[id];
      } else {
        // TODO: tell user they fucked up - quest doesn't exist
        console.log("quest (" + id + ") doesn't exist");
        return;
      }
      if (currQuest.devIDs.indexOf(devID) === -1) {
        currQuest.devIDs.push(devID);
      }

      if (json.scenario) {
        var hasParsedAttack = false;
        var isDamage        = false;
        var isFromPlayer    = false;
        var isSummon        = false;
        var isAttack        = false;

        for (var i = 0; i < json.scenario.length; i++) {
          //ignore enemy json
          isFromPlayer = false;
          if ((json.scenario[i].to == "boss") || (json.scenario[i].from == "player") || (json.scenario[i].target == "boss")) {
            isFromPlayer = true;
          }

          switch (json.scenario[i].cmd) {
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
            case "win":
              break;
            // attack handler
            case "attack":
              if (isFromPlayer == false) {
                break;
              }
              if (typeof json.scenario[i].damage != "undefined") {
                for (var j = 0; j < json.scenario[i].damage.length; j++) {
                  for (var k = 0; k < json.scenario[i].damage[j].length; k++) {
                    if (isNaN(json.scenario[i].damage[j][k].value)) {
                      continue;
                    }
                    currQuest.prevTurnDmg += json.scenario[i].damage[j][k].value;
                    currQuest.ttlDmg      += json.scenario[i].damage[j][k].value;
                  }
                }
                isAttack = true;
                isDamage = true;
                //start_timer();
              } else {
                //console.log("Undefined damage variable in attack scenario: \n" + json.scenario[i]);
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
              if (typeof json.scenario[i].list != "undefined") {
                if (json.scenario[i].list[0].damage.length === 0) {
                  break;
                }
                for (var j = 0; j < json.scenario[i].list.length; j++) {
                  if (isNaN(json.scenario[i].list[j].damage[0].value)) {
                    continue;
                  }
                  currQuest.prevTurnDmg += json.scenario[i].list[j].damage[0].value;
                  currQuest.ttlDmg      += json.scenario[i].list[j].damage[0].value;
                }
                isDamage = true;
                if (isSummon == false) {
                  isAttack = true;
                  //start_timer();
                }
              } else {
                //console.log("Undefined damage variable in ougi scenario: \n" + json.scenario[i]);
              }
              break;
            // ability and other damage handler
            case "damage":
              if (isFromPlayer == false) {
                break;
              }
              if (typeof json.scenario[i].list != "undefined") {
                for (var j = 0; j < json.scenario[i].list.length; j++) {
                  if (isNaN(json.scenario[i].list[j].value)) {
                    continue;
                  }
                  currQuest.prevTurnDmg += json.scenario[i].list[j].value;
                  currQuest.ttlDmg      += json.scenario[i].list[j].value;
                }
                isDamage = true;
              } else {
                //console.log("Undefined damage variable in scenario: \n" + json.scenario[i]);
              }
              break;
            default:
              //console.log("Unhandled scenario command: " + json.scenario[i].cmd);
              break;
          }
        }

        if (isDamage == true) {
          currQuest.ttlDpt = currQuest.ttlDmg / (currQuest.ttlTurns + 1);
          if (isAttack == true) {
            if (currQuest.prevTurnDmg > currQuest.maxTurnDmg) {
              currQuest.maxTurnDmg = currQuest.prevTurnDmg;
            }
            
            currQuest.ttlTurns++;
          }
        }

        startRaidTimer(id);
        setBattleJQuery(currQuest);
        if (isAttack) {
          currQuest.prevTurnDmg = 0;
        }
      }
    },

    UseSummon: function(json) {
    },

    Attack: function(json) {
    },

    //CopyTweet: function(json) {
    //  if (Options.Get('copyJapaneseName') && json.tweet_mode === 0 && json.twitter.forced_message !== undefined) {
    //    var start = json.twitter.forced_message.indexOf('\n');
    //    var end   = json.twitter.forced_message.lastIndexOf('\n');
    //    if (start !== -1 && end !== -1) {
    //      var english = json.twitter.forced_message.substring(start + 1, end);
    //      console.log(english);
    //      if (tweetHash[english] !== undefined) {
    //        copy(tweetHash[english]);
    //      }
    //    }
    //  }
    //}
  };

  var processTime = function (id) {
    if (raids[id] === undefined || raids[id].spTime !== null) {
      clearInterval(raidTimers[id]);
      return;
    }
    var isStart = false;
    if (raids[id].stTime === null) {
      raids[id].stTime = new Date().getTime();
      isStart = true;
    }
    if (!isStart) {
      raids[id].time += 100;
      var secs = raids[id].time / 1000.0;
      if (raids[id].time > 0) {
        raids[id].ttlDps = raids[id].ttlDmg / secs;
        Message.PostAll({
          'setText': {
            'id': '#total-dps',
            'value': 'Total dps: ' + raids[id].ttlDps
          }
        });
        var minutes = secs / 60 | 0;
        secs = ((secs * 1000) % 60000) / 1000;
        Message.PostAll({
          'setText': {
            'id': '#total-time',
            'value': 'Time: ' + minutes + ":" + secs
          }
        });
      }
    }
    startRaidTimer(id);
  };

  var startRaidTimer = function (id) {
    if (raids[id].stTime !== null) {
      return;
    }
    raidTimers[id] = setInterval(processTime, 100, id);
  };

  var setQuestsJQuery = function() {
    var image;
    if (quest !== null) {
      image = quest.image;
    } else {
      image = blankIcon;
    }

    Message.PostAll({'setImage': {
      'id':    '#quest-image-curr',
      'value': image
    }});

    //for (var i = 0; i < 4; i++) {
    //  if (i < raids.length) {
    //    image = raids[i].image;
    //  } else {
    //    image = blankIcon;
    //  }
    //  Message.PostAll({'setImage': {
    //    'id': '#quest-image-' + i,
    //    'value': image
    //  }});
    //}
  };
  
  var setBattleJQuery = function(currQuest) {
    console.log(currQuest);
    if (currQuest.stTime === null) {
      Message.PostAll({
        'setText': {
          'id': '#total-time',
          'value': 'Time: 0.0'
        }
      });
    }
    if (currQuest.ttlTurns !== null) {
      Message.PostAll({'setText': {
          'id': '#total-turns',
          'value': 'Turns: ' + currQuest.ttlTurns
        }});
    } else {
      Message.PostAll({'setText': {
          'id': '#total-turns',
          'value': 'Turns: 0'
        }
      });
    }
    if (currQuest.ttlTurns !== null) {
      Message.PostAll({'setText': {
          'id': '#total-turns',
          'value': 'Turns: ' + currQuest.ttlTurns
        }});
    } else {
      Message.PostAll({'setText': {
          'id': '#total-turns',
          'value': 'Turns: 0'
        }
      });
    }
    if (currQuest.ttlDmg !== null) {
      Message.PostAll({'setText': {
          'id': '#total-damage',
          'value': 'Total damage: ' + currQuest.ttlDmg
        }
      });
    } else {
      Message.PostAll({'setText': {
          'id': '#total-damage',
          'value': 'Total damage: 0'
        }
      });
    }
    if (currQuest.ttlDps !== null) {
      Message.PostAll({'setText': {
          'id': '#total-dps',
          'value': 'Total dps: ' + currQuest.ttlDps
        }
      });
    } else {
      Message.PostAll({'setText': {
          'id': '#total-dps',
          'value': 'Total dps: 0'
        }
      });
    }
    if (currQuest.ttlDpt !== null) {
      Message.PostAll({'setText': {
          'id': '#total-dpt',
          'value': 'Total dpt: ' + currQuest.ttlDpt
        }
      });
    } else {
      Message.PostAll({'setText': {
          'id': '#total-dpt',
          'value': 'Total dpt: 0'
        }
      });
    }
    if (currQuest.prevTurnDmg !== null) {
      Message.PostAll({'setText': {
          'id': '#avg-turn-dmg',
          'value': 'Previous turn damage: ' + currQuest.prevTurnDmg
        }
      });
    } else {
      Message.PostAll({'setText': {
          'id': '#avg-turn-dmg',
          'value': 'Previous turn damage: 0'
        }
      });
    }
    if (currQuest.maxTurnDmg !== null) {
      Message.PostAll({'setText': {
          'id': '#highest-turn-dmg',
          'value': 'Highest turn damage: ' + currQuest.maxTurnDmg
        }
      });
    } else {
      Message.PostAll({'setText': {
          'id': '#highest-turn-dmg',
          'value': 'Highest turn damage: 0'
        }
      });
    }

    //for (var i = 0; i < 4; i++) {
    //  if (currQuest.characters[pos] !== null && i < currQuest.formation.length) {
    //    var pos = currQuest.formation[i];
    //    Message.Post(devID, {'hideObject': {
    //      'id': '#quest-character-' + i,
    //      'value': false
    //    }});
    //    Message.Post(devID, {'setImage': {
    //      'id': '#quest-character-image-' + i,
    //      'value': currQuest.characters[pos].image
    //    }});
    //    for (var j = 0; j < currQuest.characters[pos].skills.length; j++) {
    //      if (currQuest.characters[pos].skills[j] !== null) {
    //        Message.Post(devID, {'hideObject': {
    //          'id': '#quest-skill-' + i + '-' + j,
    //          'value': false
    //        }});
    //        Message.Post(devID, {'setImage': {
    //          'id': '#quest-skill-image-' + i + '-' + j,
    //          'value': currQuest.characters[pos].skills[j].image
    //        }});
    //        if (currQuest.characters[pos].skills[j].cooldown === 0) {
    //          Message.Post(devID, {'setText': {
    //            'id': '#quest-skill-text-' + i + '-' + j,
    //            'value': ''
    //          }});
    //          Message.Post(devID, {'setOpacity': {
    //            'id': '#quest-skill-image-' + i + '-' + j,
    //            'value': 1
    //          }});
    //        } else {
    //          Message.Post(devID, {'setText': {
    //            'id': '#quest-skill-text-' + i + '-' + j,
    //            'value': currQuest.characters[pos].skills[j].cooldown
    //          }});
    //          Message.Post(devID, {'setOpacity': {
    //            'id': '#quest-skill-image-' + i + '-' + j,
    //            'value': .4
    //          }});
    //        }
    //      } else {
    //        Message.Post(devID, {'hideObject': {
    //          'id': '#quest-skill-' + i + '-' + j,
    //          'value': true
    //        }});
    //      }
    //    }
    //  } else {
    //    Message.Post(devID, {'hideObject': {
    //      'id': '#quest-character-' + i,
    //      'value': true
    //    }});
    //  }
    //}
    //for (var i = 0; i < currQuest.enemies.length; i++) {
    //  if (currQuest.enemies[i] !== null) {
    //    Message.Post(devID, {'hideObject': {
    //      'id': '#quest-enemy-' + i,
    //      'value': false
    //    }});
    //    Message.Post(devID, {'setImage': {
    //      'id': '#quest-enemy-image-' + i,
    //      'value': currQuest.enemies[i].image
    //    }});
    //  } else {
    //    Message.Post(devID, {'hideObject': {
    //      'id': '#quest-enemy-' + i,
    //      'value': true
    //    }});
    //  }
    //}
    //for (var i = 0; i < currQuest.summons.length; i++) {
    //  if (currQuest.summons[i] !== null) {
    //    Message.Post(devID, {'setImage': {
    //      'id':    '#quest-summon-image-' + i,
    //      'value': currQuest.summons[i].image
    //    }});
    //    if (currQuest.summons[i].cooldown === 0) {
    //      Message.Post(devID, {'setText': {
    //        'id':    '#quest-summon-text-' + i,
    //        'value': ''
    //      }});
    //      Message.Post(devID, {'setOpacity': {
    //        'id': '#quest-summon-image-' + i,
    //        'value': 1
    //      }});
    //    } else {
    //      Message.Post(devID, {'setText': {
    //        'id':   '#quest-summon-text-' + i,
    //        'value': currQuest.summons[i].cooldown
    //      }});
    //      Message.Post(devID, {'setOpacity': {
    //        'id':    '#quest-summon-image-' + i,
    //        'value': .6
    //      }});
    //    }
    //  } else {
    //    Message.Post(devID, {'setImage': {
    //      'id':    '#quest-summon-image-' + i,
    //      'value': blankIcon
    //    }});
    //    Message.Post(devID, {'setText': {
    //      'id':    '#quest-summon-text-' + i,
    //      'value': ''
    //    }});
    //  }
    //}
  };

  var parseQuestID = function(url) {
    return url.substring(url.indexOf('data/') + 5, url.lastIndexOf('/'));
  };

  var copy =  function(str) {
    var input = document.createElement('textarea');
    document.body.appendChild(input);
    input.value = str;
    input.focus();
    input.select();
    document.execCommand('Copy');
    input.remove();
  };

})();
