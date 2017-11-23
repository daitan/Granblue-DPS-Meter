(function() {
  var initialized    = false;
  var url            = '';
  var jQueryCache    = {};
  var isJST          = true;
  var times          = {};
  var timeZone       = '';
  var filter         = 'all';
  var search         = '';
  var sortedSupplies = [];
  var imageURL       = '../../assets/images/';
  var themeName      = '';
  
  $('.tooltip-down').tooltip();
  
  $('#time-zone').click(function() {
    isJST = !isJST;
    if (isJST) {
      $(this).text('JST');
    } else {
      $(this).text(timeZone);
    }
    toggleTimes();
  });

  var backgroundPageConnection = chrome.runtime.connect({
    name: 'panel'
  });
  backgroundPageConnection.postMessage({
    connect: -1
  });
  

  backgroundPageConnection.onMessage.addListener(function (message, sender) {
    if (message.pageLoad) {
      if (!initialized && message.pageLoad.indexOf('#mypage') !== -1) {
        initialized = true;
        url = message.pageLoad.substring(0, message.pageLoad.indexOf('#mypage'));
        Message.Post({initialize: true});
      }
    }
    if (message.initialize) {
      for (var i = 0; i < message.initialize.length; i++) {
        var msg = message.initialize[i];
        if (msg != undefined) {

          if (msg.setText) {
            setText(msg.setText.id, msg.setText.value);
          } else if (msg.setImage) {
            setImage(msg.setImage.id, msg.setImage.value);
          } else if (msg.setHeight) {
            setHeight(msg.setHeight.id, msg.setHeight.value);
          } else if (msg.setBar) {
            setBar(msg.setBar.id, msg.setBar.value);
          } else if (msg.setColor) {
            setColor(msg.setColor.id, msg.setColor.value);
          } else if (msg.setTime) {
            setTime(msg.setTime.id, msg.setTime.jst, msg.setTime.normal);
          } else if (msg.addItem) {
            addItem(msg.addItem.id, msg.addItem.category, msg.addItem.number, msg.addItem.name, msg.addItem.sequence, msg.addItem.tooltip);
          } else if (msg.hideObject) {
            hideObject(msg.hideObject.id, msg.hideObject.value);
          } else if (msg.addQuest) {
            addQuest(msg.addQuest.id, msg.addQuest.url, msg.addQuest.name, msg.addQuest.amount, msg.addQuest.max, msg.addQuest.animeIDs, msg.addQuest.animeAmounts);
          } else if (msg.addDistinction) {
            addDistinction(msg.addDistinction.id, msg.addDistinction.amount, msg.addDistinction.max, msg.addDistinction.isEnabled);
          } else if (msg.collapsePanel) {
            collapsePanel(msg.collapsePanel.id, msg.collapsePanel.value);
          } else if (msg.appendObject) {
            appendObject(msg.appendObject.id, msg.appendObject.target);
          } else if (msg.beforeObject) {
            beforeObject(msg.beforeObject.id, msg.beforeObject.target);
          } else if (msg.addQuestCharacter) {
            addQuestCharacter(msg.addQuestCharacter.index);
          } else if (msg.addQuestEneetmy) {
            addQuestEnemy(msg.addQuestEnemy.index);
          } else if (msg.setOpacity) {
            setOpacity(msg.setOpacity.id, msg.setOpacity.value);
          } else if (msg.setClick) {
            setClick(msg.setClick.id, msg.setClick.value);
          } else if (msg.setTheme) {
            setTheme(msg.setTheme);
          } else if (msg.setMessage) {
            setMessage(msg.setMessage);
          } else if (msg.generatePlanner) {
            generatePlanner(msg.generatePlanner);
          } else if (msg.setPlannerItemAmount) {
            setPlannerItemAmount(msg.setPlannerItemAmount.id, msg.setPlannerItemAmount.sequence, msg.setPlannerItemAmount.current);
          } else if (msg.setPlannerDropdowns) {
            setPlannerDropdowns(msg.setPlannerDropdowns.type, msg.setPlannerDropdowns.build);
          } else if (msg.setTooltip) {
            setTooltip(msg.setTooltip.id, msg.setTooltip.text);
          }
        }
      }
      $('#wait').hide();
      if (themeName !== 'Vira' && themeName !== 'Narumaya') {
        $('#contents').show();
      }
    }
    if (message.setText) {
      setText(message.setText.id, message.setText.value);
      return;
    }
    if (message.setImage) {
      setImage(message.setImage.id, message.setImage.value);
      return;
    }
    if (message.setHeight) {
      setHeight(message.setHeight.id, message.setHeight.value);
      return;
    }
    if (message.setBar) {
      setBar(message.setBar.id, message.setBar.value);
      return;
    }
    if (message.setColor) {
      setColor(message.setColor.id, message.setColor.value);
      return;
    }
    if (message.setTime) {
      setTime(message.setTime.id, message.setTime.jst, message.setTime.normal);
      return;
    }
    if (message.setTimeZone) {
      timeZone = message.setTimeZone;
      return;
    }
    if (message.addItem) {
      addItem(message.addItem.id, message.addItem.category, message.addItem.number, message.addItem.name, message.addItem.sequence, message.addItem.tooltip);
      return;
    }
    if (message.hideObject) {
      hideObject(message.hideObject.id, message.hideObject.value);
      return;
    }
    if (message.addQuest) {
      addQuest(message.addQuest.id, message.addQuest.url, message.addQuest.name, message.addQuest.amount, message.addQuest.max, message.addQuest.animeIDs, message.addQuest.animeAmounts);
      return;
    }
    if (message.addDistinction) {
      addDistinction(message.addDistinction.id, message.addDistinction.amount, message.addDistinction.max, message.addDistinction.isEnabled);
      return;
    }
    if (message.collapsePanel) {
      collapsePanel(message.collapsePanel.id, message.collapsePanel.value);
    }
    if (message.appendObject) {
      appendObject(message.appendObject.id, message.appendObject.target);
    }
    if (message.beforeObject) {
      beforeObject(message.beforeObject.id, message.beforeObject.target);
    }
    if (message.setOpacity) {
      setOpacity(message.setOpacity.id, message.setOpacity.value);
    }
    if (message.setClick) {
      setClick(message.setClick.id, message.setClick.value);
    }
    if (message.openURL) {
      Message.Post({'openURL': url + message.openURL});
    }
    if (message.setTheme) {
      setTheme(message.setTheme);
    }
    if (message.setMessage) {
      setMessage(message.setMessage);
    }
    if (message.generatePlanner) {
      generatePlanner(message.generatePlanner);
    }
    if (message.setPlannerItemAmount) {
      setPlannerItemAmount(message.setPlannerItemAmount.id, message.setPlannerItemAmount.sequence, message.setPlannerItemAmount.current);
    }
    if (message.setPlannerDropdowns) {
      setPlannerDropdowns(message.setPlannerDropdowns.type, message.setPlannerDropdowns.build);
    }
    if (message.setTooltip) {
      setTooltip(message.setTooltip.id, message.setTooltip.text);
    }
  });

  var setText = function(id, value) {
    if (jQueryCache[id] === undefined) {
      jQueryCache[id] = $(id);
    }
    jQueryCache[id].text(value);
  };
  var setImage = function(id, value) {
    if (jQueryCache[id] === undefined) {
      jQueryCache[id] = $(id);
    }
    jQueryCache[id].attr('src', value);
  };
  var setHeight = function(id, value) {
    if (jQueryCache[id] === undefined) {
      jQueryCache[id] = $(id);
    }
    jQueryCache[id].height(value);
  };
  var setOpacity = function(id, value) {
    if (jQueryCache[id] === undefined) {
      jQueryCache[id] = $(id);
    }
    jQueryCache[id].fadeTo('fast', value);
  };
  var hideObject = function(id, value) {
    if (jQueryCache[id] === undefined) {
      jQueryCache[id] = $(id);
    }
    if (value) {
      jQueryCache[id].hide();
    } else {
      jQueryCache[id].show();
    }
  };
  var setBar = function(id, value) {
    if (jQueryCache[id] === undefined) {
      jQueryCache[id] = $(id);
    }
    jQueryCache[id].css('width', value);
  };
  var setColor = function(id, value) {
    if (jQueryCache[id] === undefined) {
      jQueryCache[id] = $(id);
    }
    jQueryCache[id].css('background-color', value);
  };
  var setTime = function(id, jstTime, normalTime) {
    if (jQueryCache[id] === undefined) {
      jQueryCache[id] = $(id);
    }
    times[id] = {
      'jst':    jstTime,
      'normal': normalTime
    };
    if (isJST) {
      jQueryCache[id].text(jstTime);
    } else {
      jQueryCache[id].text(normalTime);
    }
  };
  var collapsePanel = function(id, value) {
    if (jQueryCache[id] === undefined) {
      jQueryCache[id] = $(id);
    }

    if (value && jQueryCache[id].hasClass('collapse in')) {
      jQueryCache[id].collapse('hide');
    } else if (!value && !jQueryCache[id].hasClass('collapse in')) {
      jQueryCache[id].collapse('show');
    }
  };
  var appendObject = function(id, targetID) {
    if (jQueryCache[id] === undefined) {
      jQueryCache[id] = $(id);
    }
    if (jQueryCache[targetID] === undefined) {
      jQueryCache[targetID] = $(targetID);
    }

    jQueryCache[targetID].append(jQueryCache[id]);
  };
  var setClick = function(id, value) {
    if (jQueryCache[id] === undefined) {
      jQueryCache[id] = $(id);
    }
    jQueryCache[id].data('url', value);
    if (value !== '') {
      jQueryCache[id].addClass('open-url');
    } else {
      jQueryCache[id].removeClass('open-url');
    }
  };
  var setTooltip = function(id, text) {
    if (jQueryCache[id] === undefined) {
      jQueryCache[id] = $(id);
    }
    jQueryCache[id].attr('title', text).tooltip('fixTitle');
    if ($('.tooltip').length > 0 && $('.tooltip').prev().prop('id') == id.substring(1)) {
      jQueryCache[id].tooltip('show');
    }
  };
  var beforeObject = function(id, targetID) {
    if (jQueryCache[id] === undefined) {
      jQueryCache[id] = $(id);
    }
    if (jQueryCache[targetID] === undefined) {
      jQueryCache[targetID] = $(targetID);
    }
    jQueryCache[targetID].before(jQueryCache[id]);
  };

  var truncateNumber = function(value) {
    if (value >= 1000000) {
      return Math.round(value / 100000) + 'M';
    } else if (value >= 10000) {
      return Math.round(value / 1000) + 'k';
    }
    return value;
  };

  var addQuest = function(id, imgUrl, name, amount, max, animeIDs, animeAmounts) {
    var newRaid;
    if (animeIDs !== null && animeIDs.length > 1) {
      newRaid = $dailyRaidBig.clone();
      newRaid.find('.open-url').each(function(i) {
        $(this).click(function() {
          Message.Post({'openURL': url + '#quest/supporter/' + id + '/1/0/' + animeIDs[i]});
        });
      });
    } else {
      newRaid = $dailyRaid.clone();
      var raidUrl = url + '#quest/supporter/' + id + '/1';
      if (animeIDs !== null) {
        raidUrl += '/0/' + animeIDs[0];
      }
      newRaid.click(function() {
        Message.Post({'openURL': raidUrl});
      });
    }
    newRaid.data('id', id);
    newRaid.attr('id', 'daily-raid-' + id);
    newRaid.find('.quest-img').first().attr('src', imgUrl);
    newRaid.find('.quest-name').first().text(name);
    newRaid.find('.quest-count').first().attr('id', 'remaining-' + id);
    newRaid.find('.quest-count').first().data('id', id);
    newRaid.find('.quest-count').first().text(amount + '/' + max);
    if (animeIDs !== null) {
      newRaid.find('.item-img').each(function(i) {
        $(this).attr('src', imageURL + 'items/' + animeIDs[i] + '.jpg');
      });
      newRaid.find('.item-count').each(function(i) {
        $(this).text(animeAmounts[i]);
        $(this).addClass('anime-count-' + animeIDs[i]);
      });
    } else {
      newRaid.children('.quest-item').first().remove();
    }
    $dailyRaidList.append(newRaid);
  };
  var addDistinction = function(id, amount, max, isEnabled) {
    var newDistinction = $dailyDistinction.clone();
    newDistinction.data('id', id);
    newDistinction.attr('id', 'distinctions-body-' + id);
    newDistinction.find('.item-img').first().attr('src', imageURL + 'items/' + id + '.jpg');
    newDistinction.find('.item-count').first().attr('id', 'dailies-distinctions-' + id);

    $dailyDistinctionList.append(newDistinction);
    if (!isEnabled) {
      newDistinction.hide();
    }
  };

  var addQuestCharacter = function(index) {
    var newCharacter = $questCharacter.clone();
    newCharacter.attr('id', 'quest-character-' + index);
    newCharacter.find('.quest-character-image').attr('id', 'quest-character-image-' + index);
    newCharacter.find('.quest-skill').each(function(i) {
      $(this).attr('id', 'quest-skill-' + index + '-' + i);
      $(this).find('.quest-skill-image').attr('id', 'quest-skill-image-' + index + '-' + i);
      $(this).find('.quest-skill-text').attr('id', 'quest-skill-text-' + index + '-' + i);
    });
    newCharacter.find('.quest-character-buffs').attr('id', 'quest-character-buffs-' + index);
    $questCharactersPanel.append(newCharacter);
  };

  var addQuestEnemy = function(index) {
    var newEnemy = $questEnemy.clone();
    newEnemy.attr('id', 'quest-enemy-' + index);
    newEnemy.find('.quest-enemy-image').attr('id', 'quest-enemy-image-' + index);
    newEnemy.find('.quest-enemy-buffs').attr('id', 'quest-enemy-buffs-' + index);
    $questEnemiesPanel.append(newEnemy);
  };

  var filterSupplies = function(category) {
    filter = category;
    $supplyList.children().each(function(index) {
      if (category === $(this).data('category') || category === 'all') {
        $(this).show();
      } else {
        $(this).hide();
      }
    });
  };

  var setTheme = function(theme) {
    Message.Post({'consoleLog': theme});
    var sheetURL = '../../stylesheets/';
    var $bars = $('.progress-bar');
    if (theme === 'Tiamat Night') {
      sheetURL += 'night';
      if ($bars.hasClass('progress-bar-danger')) {
        $bars.removeClass('progress-bar-danger').addClass('progress-bar-custom');
      }
      $('rect[id=\'mask-fill\']').css('fill', '#2a2a2a');
    }
    else if (theme === 'Vira') {
      sheetURL += 'garbage1';
    }
    else if (theme === 'Narumaya') {
      sheetURL += 'garbage2';
    }
    else {
      sheetURL += 'default';
      if ($bars.hasClass('progress-bar-custom')) {
        $bars.removeClass('progress-bar-custom').addClass('progress-bar-danger');
      }
      $('rect[id=\'mask-fill\']').css('fill', '#f5f5f5');
    }
    if (theme === 'Vira' || theme === 'Narumaya') {
      //$('#contents').hide();
      $('#wait').hide();
      $('#garbage').show();
    } else {
      $('#garbage').hide();
      if (initialized) {
        $('#contents').show();
        $('#wait').hide();
      } else {
        //$('#contents').hide();
        $('#wait').show();
      }
    }
    sheetURL += '.css';
    document.getElementById('pagestyle').setAttribute('href', sheetURL);
    themeName = theme;
  };

  
  window.Message = {
    Post: function(message) {
      //message.id = chrome.devtools.inspectedWindow.tabId;
      backgroundPageConnection.postMessage(message);
    },
    Copy: function(str) {
      copy(str);
    }
  };

  Message.Post({ 'devAwake': true });

  $(document).ready(function () {
    $('#contents > ul > li > a').eq(0).addClass("selected");
    $('#contents > div > div').eq(0).css('display', 'block');

    $('#contents > ul').click(function (e) {
      if ($(e.target).is("a")) {
        $('#contents > ul > li > a').removeClass("selected");
        $(e.target).addClass("selected");
        
        var clicked_index = $("a", this).index(e.target);
        $('#contents > div > .battle-data').css('display', 'none');
        $('#contents > div > .battle-data').eq(clicked_index).fadeIn();
      }

      $(this).blur();
      return false;
    });

    $(".parser-drawer-heading").click(function () {

      $(".battle-data").hide();
      var d_activeTab = $(this).attr("rel");
      $("#" + d_activeTab).fadeIn();

      $(".parser-drawer-heading").removeClass("d_active");
      $(this).addClass("d_active");

      $("ul.history li a").removeClass("selected");
      $("ul.history li a[rel^='" + d_activeTab + "']").addClass("selected");
    });
  });

})();
