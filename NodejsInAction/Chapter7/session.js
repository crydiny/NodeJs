var connect = require('connect');
var cookieParser = require('cookie-parser');
var session = require('session');

// var hour = 360000;
// var sessionOpts = {
// 	key: 'myapp_sid',
// 	cookie: {maxAge: hour*24, secure: true}
// };

var app = connect()
	.use(cookieParser('keyboard cat'))
	//.use(session(sessionOpts))
	.use(session())
	.use(function(req, res, next){
		var sess = req.session;
		if(sess.views){
			res.setHeader('Content-Type', 'text/html');
			res.write('<p>views: ' + sess.views + '</p>');
			res.end();
			sess.views++;
		}else{
			sess.views = 1;
			res.end('Welcome to the session demo. refresh!');
		}
	});

app.listen(3000);