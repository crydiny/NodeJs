var connect = require('connect');
var bodyParser = require('body-parser');

var app = connect()
	.use(bodyParser.urlencoded(
		{extended: true}))
	.use(bodyParser.json())
	.use(function(req, res){
		res.end('Registered: ' + req.body.username);
	}).listen(3000);