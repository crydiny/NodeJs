var net = require('net');

net.createServer(function(socket){
	socket.setEncoding('utf8');
	console.log('socket connected.');
	socket.on('data', function(data){
		console.log('data event:', data);
	});
	socket.on('end', function(){
		console.log('end event');
	});
	socket.on('close', function(){
		console.log('close event');
	});
	socket.on('error', function(e){
		console.log('error event', e);
	});
	
	socket.pipe(socket);
	//socket.write('Hello world!\r\n');
	//socket.end();
}).listen(2016);

console.log('listening on port 2016');
