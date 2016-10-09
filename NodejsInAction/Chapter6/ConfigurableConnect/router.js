var parse = require('url').parse;

var router = function route(obj){
	return function(req, res, next){
		//检查确保req.method定义了
		if(!obj[req.method]){
			next();
			return;
		}

		//查找req.method对应的路径
		var routes = obj[req.method];
		var url = parse(req.url);
		var paths = Object.keys(routes);

		for(var i = 0; i<paths.length; i++){
			var path = paths[i];
			var fn = routes[path];
			path = path
				.replace(/\//g, '\\/')
				.replace(/:(\w+)/g, '([^\\/]+)');
			var re = new ReqExp('^' + path + '$');
			var captures = url.pathname.match(re);
			//尝试跟pathname匹配
			if(captures){
				//传递被捕获的分组
				var args = [req, res].concat(captures.slice(1));
				fn.apply(null, args);
				return;
			}
		}
		next();
	};
};

module.exports = router;