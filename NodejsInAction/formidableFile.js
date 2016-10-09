var formidable = require("formidable");
var http = require("http");
var sys = require("sys");

http.createServer(function(req, res){
	if(req.url === "/upload" && req.method.toLowerCase() === "post"){
		//parse a file upload
		var form = new formidable.IncomingForm();
		form.parse(req, function(err, fields, files){
			res.writeHead(200, {"content-type":"text/plain"});
			res.write("received upload: \n\n");
			res.end(sys.inspect({fields: fields, files: files}));
		});
		return;
	}

	res.writeHead(200, {"content-type":"text/plain"});
});