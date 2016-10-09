var fs = require('fs');
var http = require('http');

function getEntries(){
	var entries = [];
	var entriesRaw = fs.readFileSync('./entries.txt', 'utf8');

	entriesRaw = entriesRaw.split('---');
	entriesRaw.map(function(entryRaw){
		var entry = {};
		var lines = entryRaw.split('\n');

		lines.map(function(line){
			if(line.indexOf('title: ') === 0){
				entry.title = line.replace('title: ', '');
			}else if(line.indexOf('date: ') === 0){
				entry.date = line.replace('date: ', '');
			}else{
				entry.body = entry.body || '';
				entry.body += line;
			}
		});
		entries.push(entry);
	});
	return entries;
}

var entries1 = getEntries();
//console.log(entries);


var server = http.createServer(function(req, res){
	var output = blogPage(entries1);
	res.writeHead(200, {'Content-Type': 'text/html'});
	res.end(output);
});
server.listen(3000);

var ejs = require('ejs');
var template = fs.readFileSync('./template/blog_page.ejs', 'utf8');

function blogPage(entries1){
	var values = {entries: entries1};
	return ejs.render(template, {locals: values});
}

