var connect = require('connect');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

function edit(req, res, next){
	if('GET' != req.method) return next();
	res.setHeader('Content-Type', 'text/html');
	res.write('<form method="post">');
	res.write('<input type="hidden" name="_method" value="PUT" />');
	res.write('<input type="text" name="user[name]" value="Tobi" />');
	res.write('<input type="submit" value="Update" />');
	res.write('</form>');
	res.end();
}


function update(req, res, next){
	console.log(req.body);
	console.log(req.method);
	if('PUT' != req.method) return next();
	//if('PUT' != req.body._method) return next();
	res.end('Update name to ' + req.body.user.name);
}

var app = connect()
	.use(bodyParser.urlencoded(
		{extended: true}))
	//不知道為什麼沒用...
	.use(methodOverride())
	.use(edit)
	.use(update)
	.listen(3000);
