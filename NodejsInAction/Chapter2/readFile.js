var fs = require('fs');
var stream = fs.createReadStream('../nodejsdevelopment.pdf');
stream.on('data', function(chunk){
	console.log(chunk);
});

stream.on('end', function(chunk){
	console.log('finished');
});