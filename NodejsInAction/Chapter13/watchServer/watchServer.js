var fs = require('fs');
var url = require('url');
var http = require('http');
var path = require('path');
var express = require('express');
var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);
var root = __dirname;

app.use(function(req, res, next){
	var file = url.parse(req.url).pathname;
	console.log(file);
	var mode = 'stylesheet';
	if(file[file.length-1] === '/'){
		file += 'index.html';
		mode = 'reload';
	}
	createWatcher(file, mode);
	console.log(9);
	next();
});

app.use(express.static(root));
var watchers = {};

function createWatcher(file, event){
	console.log(1);
	var absolute = path.join(root, file);
	if(watchers[absolute]){
		console.log(3);
		return;
	}
	fs.watchFile(absolute, function(curr, prev){
		console.log(4);
		if(curr.mtime !== prev.mtime){
			console.log(5);
			io.sockets.emit(event, file);
		}
	});
	console.log(6);
	watchers[absolute] = true;
}

server.listen(3000);
