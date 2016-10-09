var net = require('net');
var host = process.argv[2];
var port = Number(process.argv[3]);

console.log(process);

var socket = net.connect({host: host, port: port});
//var socket = net.connect(host, 22);
socket.setEncoding('utf8');

socket.on('connect', function(){
	process.stdin.pipe(socket);
	socket.pipe(process.stdout);
	process.stdin.resume();
});

socket.on('end', function(){
	process.stdin.pause();
});

// socket.once('data', function(chunk){
// 	console.log('SSH server version: %j', chunk.trim());
// 	socket.end();
// });