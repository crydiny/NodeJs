//var exec = require("child_process").exec;
var queryString = require("querystring");

function start(response, postData){
	console.log("Request handler 'start' was called.");

	// function sleep(milliSeconds){
	// 	var startTime = new Date().getTime();
	// 	while(new Date().getTime() < startTime+milliSeconds);
	// }
	// sleep(3000);

	// exec("dir c:\\", {timeout: 10000, maxBuffer: 20000*1024}, function(error, stdout, stderr){
	// 	response.writeHead(200, {"Content-Type": "text/plain"});
	// 	response.write(stdout);
	// 	response.end();
	// });

	var body = "<html>" +
		"<head>"+
		"<meta http-equiv='Content-Type' content='text/html;'" +
		"charset='UTF-8' />" +
		"</head>" +
		"<form action='upload' method='post'>" +
		"<textarea name='text' rows='20' cols='60'></textarea>" +
		"<input type='submit' value='Submit text' />" +
		"</form>" +
		"</body>" +
		"</html>";

	response.writeHead(200, {"Content-Type": "text/plain"});
	response.write(body);
	response.end();
}

function upload(response, postData){
	console.log("Request handler 'upload' was called.");
	response.writeHead(200, {"Content-Type": "text/plain"});
	response.write("You've sent the text: " + 
		queryString.parse(postData).text);
	response.end();
}

exports.start = start;
exports.upload = upload;