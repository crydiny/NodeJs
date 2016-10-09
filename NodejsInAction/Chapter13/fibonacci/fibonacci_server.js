var http = require('http');
var cp = require('child_process');

var server = http.createServer(function(req, res){
	var child = cp.fork(__filename, [req.url.substring(1)]);
	child.on('message', function(m){
		res.end(m.result + '\n');
	});
});

server.listen(3000);