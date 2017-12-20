(function () {
  var tryParseJson = function (str) {
    var tempStr = str;
    try {
      JSON.parse(str);
    } catch (e) {
      return tempStr;
    }
    return str;
  };

  var backgroundPageConnection = chrome.runtime.connect({
    name: 'panel'
  });
  backgroundPageConnection.postMessage({
    connect: chrome.devtools.inspectedWindow.tabId
  });

  window.Message = {
    Post: function (message) {
      message.id = chrome.devtools.inspectedWindow.tabId;
      backgroundPageConnection.postMessage(message);
    },
    Copy: function (str) {
      copy(str);
    }
  };

  chrome.devtools.network.onRequestFinished.addListener(function(request) {
    if (request.request.url.indexOf('.css') !== -1 &&
        request.request.url.indexOf('/css/common/index.css') === -1) {
      Message.Post({pageLoad : true});
    }
    if (request.request.url.indexOf('http://gbf.game.mbga.jp/') !== -1 ||
        request.request.url.indexOf('http://game.granbluefantasy.jp/') !== -1) {
        request.getContent(function(responseBody) {
          var jsonData = tryParseJson(responseBody);
          console.log(jsonData);
          if (request.request.postData !== undefined) {
          Message.Post({'request': {
            url:      request.request.url,
            response: jsonData,
            payload:  JSON.parse(request.request.postData.text)
          }});
        } else {
          Message.Post({'request': {
            url:      request.request.url,
            response: jsonData,
            payload:  undefined
          }});
        }
      });
    }
  });

  $("#open-parser").click(function () {
    chrome.tabs.create({ 'url': chrome.extension.getURL('src/pages/parser/parser.html') });
  });
})();
