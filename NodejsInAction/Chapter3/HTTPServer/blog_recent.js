var http = require('http');
var fs = require('fs');


// http.createServer(function(req, res){
// 	if(req.url === '/'){
// 		fs.readFile('./titles.json', function(err, data){
// 			if(err){
// 				console.error(err);
// 				res.end('Server Error');
// 			}else{
// 				var titles = JSON.parse(data.toString());
// 				fs.readFile('./template.html', function(err, data){
// 					if(err){
// 						console.error(err);
// 						res.endI('Server Error2.');
// 					}else{
// 						var tmpl = data.toString();
// 						var html = tmpl.replace('%', titles.join('</li><li>'));
// 						res.writeHead(200, {'Content-Type': 'text/html'});
// 						res.end(html);
// 					}
// 				});
// 			}
// 		});
// 	}
// }).listen(3001, "127.0.0.1");


var server = http.createServer(function(req, res){
	getTitles(res);
}).listen(3001, "127.0.0.1");

function getTitles(res){
	fs.readFile('./titles.json', function(err, data){
		if(err){
			hadError(err, res);
		}else{
			getTemplate(JSON.parse(data.toString()), res);
		}
	});
}

function getTemplate(titles, res){
	fs.readFile('./template.html', function(err, data){
		if(err){
			hadError(err, res);
		}else{
			formatHtml(titles, data.toString(), res);
		}
	});
}

function formatHtml(titles, data, res){
	var html = data.replace('%', titles.join('</li><li>'));
	res.writeHead(200, {'Content-Type': 'text/html'});
	res.end(html);
}

function hadError(err, res){
	console.error(err);
	res.end('Server Error');
}