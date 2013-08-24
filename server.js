var WebSocketServer = require('websocket').server;
var http = require('http');
var url = require('url');

Array.prototype.deleteElement = function(obj) {
    var index = this.indexOf(obj);
    if (index > -1) {
        this.splice(index, 1);
    }
}

var connections = [];

var server = http.createServer(function(request, response) {
    var urlpath = url.parse(request.url).pathname;

    console.log((new Date()) + ' Received request for ' + urlpath);
    if ('/send' == urlpath) {
        connections.forEach(function(des) {
            des.sendUTF(request.url);
        });
        response.writeHeader(200, {
            'Content-Type': 'text/plain'
        });
        response.end("{'result':1}");
    } else{
        response.writeHeader(200, {
            'Content-Type': 'text/plain'
        });
        response.end(urlpath);

    }

});
server.listen(8765, function() {
    console.log((new Date()) + ' Server is listening on port 8765');
});

wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: false
});

wsServer.on('request', function(request) {
    var connection = request.accept('', request.origin);
    connections.push(connection);
    connection.sendUTF(connections.length);

    connection.on('close', function(reasonCode, description) {
        connections.deleteElement(connection);
    });

    connection.on('message',function(message){
        connections.forEach(function(des) {
            des.sendUTF(message.utf8Data);
        });
    });

});

