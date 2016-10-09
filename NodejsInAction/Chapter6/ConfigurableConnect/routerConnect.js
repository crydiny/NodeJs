var connect = require('connect');
var router = require('./middleware/router');

var router = {
	GET: {
		'/users': function(req, res){
			res.end('tobi, loki, ferret');
		},
		'/user/:id': function(req, res, id){
			res.end('user ' + id);
		}
	},
	DELETE: {
		'/user/:id': function(req, res, id){
			res.end('deleted user ' + id);
		}
	}
};


function errorHandler(){
	var env = process.evn.NODE_ENV || 'development';
	return function(err, req, res, next){
		res.status = 500;
		switch(env){
			case 'development':
				res.setHeader('Content-Type', 'application/json');
				res.end(JSON.stringify(err));
				break;
			default:
				res.end('Server error');
				break;
		}
	};
}


// connect()
// 	.use(router(routes))
// 	.listen(3000);

connect()
	.use(router(require('./routes/user')))
	.use(router(require('./routes/admin')))
	.use(errorHandler())
	.listen(3000);