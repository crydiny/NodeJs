var connect = require('connect');
var app = connect();

//中间件
function logger(req, res, next){
	console.log('%s %s', req.method, req.url);
	next();
}

function hello(req, res){
	res.setHeader('Content-Type', 'text/plain');
	res.end('hello world');
}

//用use函数把中间件函数传进来.
//按顺序执行, 用next传递到下一个函数.
app.use(logger).use(hello);

app.listen(3000);