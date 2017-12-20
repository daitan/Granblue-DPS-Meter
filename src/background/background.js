(function() {
  var currTabID  = -1;
  var currURL    = '';
  var pageLoaded = true;

  var CURRENT_VERSION = '1.0.0';
  var BASE_VERSION    = '1.0.0';
  var patchNotes = {
    '1.0.0': {
      'index': 0,
      'notes': ['-Initial release']
    }
  };
  var patchNoteList = [
    '1.0.0'
  ];
  var currentVersion = undefined;

  chrome.browserAction.onClicked.addListener(function() {
    //chrome.runtime.openOptionsPage();
    chrome.tabs.create({ 'url': chrome.extension.getURL('src/pages/parser/parser.html') });
  });

  Storage.GetMultiple(['version'], function(response) {
    currentVersion = response['version'];
    if (!currentVersion) {
      currentVersion = CURRENT_VERSION;
      Storage.Set('version', CURRENT_VERSION);
    }
  });

  var generateNote = function(id) {
    if (patchNotes[id]) {
      var note = 'Version ' +id + ':\n';
      for (var i = 0; i < patchNotes[id].notes.length; i++) {
        note += patchNotes[id].notes[i] + '\n';
      }
      return note;
    }
  };

  Options.Initialize(function () {
      Quest.Initialize();
  });

  var responseList = {};
  chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.setOption) {
      Options.Set(message.setOption.id, message.setOption.value);
    }
    if (message.getOption) {
      var id = message.getOption;
      sendResponse({
        'id': id,
        'value': Options.Get(id)
      });
    }

    if (message.consoleLog) {
      console.log(message.consoleLog.sender + ': ' + message.consoleLog.message);
    }
  });

  chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (tab.url.indexOf('gbf.game.mbga.jp') !== -1) {
      if (currURL !== tab.url) {
        pageLoaded = false;
        currURL = tab.url;
      }
      if (currURL === tab.url && pageLoaded) {
        chrome.tabs.sendMessage(tabId, {pageUpdate: tab.url});
      }
    }
  });

  var connections = {};

  chrome.runtime.onConnect.addListener(function (port) {
    var extensionListener = function (message, sender) {
      if (message.id === undefined) {
        if (sender.sender.tab !== undefined) {
          message.id = sender.sender.tab.id;
          //Message.Post(message.id, { 'setTabId': message.id });
        }
      }
      if (message.connect) {
        if (message.connect == -1) {
          connections[message.id] = port;
        } else {
          connections[message.connect] = port;
        }
        return;
      }
      if (message.initialize) {
        var response = [];
        response[0] = {
          'setTheme': Options.Get('windowTheme')
        };
        response = response.concat(Buffs.InitializeDev());
        response = response.concat(Quest.InitializeDev());
        connections[message.id].postMessage({initialize: response});
        return;
      }
      if (message.pageLoad) {
        pageLoaded = true;
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
          if (tabs.length > 0) {
            chrome.tabs.sendMessage(tabs[0].id, {pageLoad: tabs[0].url});
            connections[message.id].postMessage({pageLoad: tabs[0].url});
          }
        });
        return;
      }
      if (message.openURL) {
        chrome.tabs.update(message.id, {'url': message.openURL});
        return;
      }
      if (message.refresh) {
        chrome.tabs.reload(message.id);
        return;
      }
      if (message.devAwake) {
        if (currentVersion !== CURRENT_VERSION) {
          var note = '';
          if (patchNotes[currentVersion] === undefined) {
            currentVersion = BASE_VERSION;
            note += generateNote(currentVersion);
          }
          var index = patchNotes[currentVersion].index + 1;
          for (var i = index; i < patchNoteList.length; i++) {
            currentVersion = patchNoteList[i];
            note += generateNote(currentVersion);
          }
          Message.Post(message.id, {'setMessage': note});
          currentVersion = CURRENT_VERSION;
          Storage.Set('version', CURRENT_VERSION);
        }
        Message.Post(message.id, {'setTheme': Options.Get('windowTheme', function(id, value) {
          Message.PostAll({
            'setTheme': value
          });
          Time.UpdateAlertColor();
        })});
      }
      if (message.consoleLog) {
        console.log(message.consoleLog);
      }
      if (message.startParse) {
        Quest.StartParse();
      }
      if (message.stopParse) {
        Quest.StopParse();
      }
      if (message.request) {
        //start quest -> ACTUALLY ENTER THE QUEST
        if (message.request.url.indexOf('/quest/create_quest?') !== -1) {
          //Quest.CreateQuest(message.request.response);
        }

        //join raid
        if (message.request.url.indexOf('/quest/raid_deck_data_create') !== -1) {
          //Quest.CreateQuest(message.request.response);
        }
        if (message.request.url.indexOf('retire.json') !== -1) {
          Quest.StopParse();
        }

        //if (message.request.url.indexOf('/shop_exchange/activate_personal_support?_=') !== -1) {
        //  Buffs.StartBuff(message.request.response, message.request.payload);
        //}
        if (message.request.url.indexOf('/raid/start.json?_=') !== -1 || message.request.url.indexOf('/multiraid/start.json?_=') !== -1) {
          Quest.CreateQuest(message.request.response);
        }
        if (message.request.url.indexOf('/normal_attack_result.json?_=') !== -1) {
          Quest.BattleAction(message.request.response, message.request.payload);
        }
        if (message.request.url.indexOf('/ability_result.json?_=') !== -1) {
          Quest.BattleAction(message.request.response, message.request.payload);
        }
        if (message.request.url.indexOf('/summon_result.json?_=') !== -1) {
          Quest.BattleAction(message.request.response, message.request.payload);
        }
        //if (message.request.url.indexOf('/quest/init_list') !== -1) {
        //  Quest.SetCurrentQuest(message.request.response);
        //}
        //if (message.request.url.indexOf('/quest/assist_list') !== -1) {
        //  Quest.CheckJoinedRaids(message.request.response);
        //}
      }
    };
    port.onMessage.addListener(extensionListener);

    port.onDisconnect.addListener(function(port) {
      port.onMessage.removeListener(extensionListener);

      var tabs = Object.keys(connections);
      for (var i = 0, len = tabs.length; i < len; i++) {
        if (connections[tabs[i]] == port) {
          delete connections[tabs[i]];
          break;
        }
      }
    });
  });

  window.Message = {
    PostAll: function(message) {
      Object.keys(connections).forEach(function(key) {
        if (message !== undefined) {
          connections[key].postMessage(message);
        }
      });
    },

    Post: function(id, message) {
      if (connections[id] !== undefined) {
        if (message !== undefined) {
          connections[id].postMessage(message);
        }
        return true;
      } else {
        return false;
      }
    },

    OpenURL: function(url, devID) {
      chrome.runtime.sendMessage({openURL: {
        url: url
      }});

    },

    MessageBackground: function(message, sendResponse) {
    },

    MessageTabs: function(message, sendResponse) {
      chrome.runtime.sendMessage({tabs: message}, function(response) {
        sendResponse(response);
      });
    },

    ConsoleLog: function(sender, message) {
      chrome.runtime.sendMessage({consoleLog: {
        sender: sender,
        message: message
      }});
    }
  };

})();
