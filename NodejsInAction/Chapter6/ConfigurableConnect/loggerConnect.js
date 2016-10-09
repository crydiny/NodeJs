//setup函数可以用不同的配置调用多次
function setup(format){
	//匹配请求属性
	var regexp = /:(\w+)/g;
	//Connect使用的真是logger组件.
	return function logger(req, res, next){
		var str = format.replace(regexp, function(match, property){
			return req[property];
		});
		console.log(str);
		next();
	};
}

module.exports = setup;