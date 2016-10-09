var connect = require('connect');


function restrict(req, res, next){
	console.log(req.headers);
	var authorization = req.headers.authorization;
	if(!authorization) return next(new Error('Unauthorized'));

	console.log('444444444444');
	var parts = authorization.split(' ');
	var scheme = parts[0];
	var auth = new Buffer(parts[1], 'base64').toString().split(':');
	var user = auth[0];
	var pass = auth[1];

	authenticateWithDatabase(user, pass, function(err){
		if(err) return next(err);
		console.log('5555555555555');
		next();
	});
}


function admin(req, res, next){
	switch(req.url){
		case '/':
			console.log('11111111111');
			res.end('try/users');
			break;
		case '/users':
			console.log('22222222222');
			res.setHeader('Content-Type', 'appliation/json');
			res.end(JSON.stringify(['tobi', 'loki', 'jane']));
			break;
		default:
			res.setHeader('Content-Type', 'text/plain');
			res.end('Unknown page.');
			break;
	}
}


function logger(req, res, next){
	console.log('%s %s', req.method, req.url);
	next();
}

function hello(req, res){
	res.setHeader('Content-Type', 'text/plain');
	res.end('hello world');
}


//当use()的第一个参数是字符串时,
//只有URL前缀与之匹配时,
//connect才会调用后面的中间件.
connect()
	.use(logger)
	.use('/admin', restrict)
	.use('/admin', admin)
	.use(hello)
	.listen(3000);