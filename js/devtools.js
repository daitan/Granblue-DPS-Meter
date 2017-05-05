(function() {

    var port = chrome.runtime.connect({name: 'gbfdpsmeter'});

    function bindRequest() {
	
        chrome.devtools.network.onRequestFinished.addListener(function(request) {

            var parser = document.createElement('a'),
                params = null;

            parser.href = request.request.url;
            if (parser.hostname.split('.')[1] == "granbluefantasy") {
                params = parser.pathname.split('/');
				//console.log(params);
				// TODO: check entire URL for results
				// TODO: add handler for retire.json
				if ((params[3] != "ability_result.json") 
					&& (params[3] != "normal_attack_result.json") 
					&& (params[3] != "summon_result.json") 
					&& (params[3] != "start.json")) {
					return;
				}
				
                request.getContent(function(body) {
                    parsed = JSON.parse(body);

                    if (parsed) {
                        if (typeof parsed === "undefined") {
                            return;
                        }
						
						var msg = $.extend(parsed, {"source":params[3]});
						
						port.postMessage(msg);
                    }
                });
            }
        });

    }
	bindRequest();
})();