var connect = require('connect');
var errorHandler = require('error-handler');

var app = connect()
	.use(function(req, res, next){
		setTimeout(function(){
			next(new Error('something broke!'));
		}, 500);
	})
	.use(errorHandler())	//???
	.listen(3000);