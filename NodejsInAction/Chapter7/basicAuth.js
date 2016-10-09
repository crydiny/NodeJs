var connect = require('connect');
var basicAuth = require('basic-auth');

var users = {
	tobi: 'foo',
	loki: 'bar',
	john: 'secret'
};

var app = connect()
	.use(function(req, res){
		var credentials = basicAuth(req);
		if (!credentials || credentials.name !== 'john' || credentials.pass !== 's2ecret') {
			res.statusCode = 401;
			res.setHeader('WWW-Authenticate', 'Basic realm="example"');
			res.end('Access denied');
		}else{
			res.end('Access granted');
		}
	});

app.listen(3000);