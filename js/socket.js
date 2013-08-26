(function(w) {
	var websocket = new WebSocket('ws://58.215.179.23:8765');
	websocket.onopen = function(evt) {
		console.log("Connected to WebSocket server.");
	};
	websocket.onclose = function(evt) {
		console.log("Disconnected");
	};
	websocket.onmessage = function(evt) {
		var data = JSON.parse(evt.data);
		if(typeof data === 'number'){
			if(data === 1){
				game.id = data;
				game.init();
				game.start();
				console.log('game start');
			}else{
				gameClient.id = data
				gameClient.init();
				gameClient.start();
			}
		}else{
			if(game.id === 2){
				game.updateData(data);
			}else{
				gameClient.updateData(data);	
			}
		}
	};

	websocket.onerror = function(evt) {
		console.log('Error occured: ' + evt.data);
	};

	w.websocket = websocket;

})(window,game,gameClient)
