var http = require('http');
var formidable = require('formidable');
var uploadPercent = 0;

var server = http.createServer(function(req, res){
	switch(req.method){
		case 'GET':
			show(req, res);
			break;
		case 'POST':
			upload(req, res);
			break;
	}
});


function show(req, res){
	var html = ''
		+ '<form method="POST" action="/" enctype="multipart/form-data">'
		+ '<p><input type="text" name="name" /></p>'
		+ '<p><input type="file" name="file" /></p>'
		+ '<p><input type="submit" name="Upload" /></p>'
		+ '<h5>'
		+ uploadPercent
		+ '</h5>'
		+ '</form>';
	res.setHeader('Content-Type', 'text/html');
	res.setHeader('Content-Length', Buffer.byteLength(html));
	res.end(html);
}


function upload(req, res){
	if(!isFormData(req)){
		res.statusCode = 400;
		res.end('Bad request: expecting multipart/form-data');
		return;
	}

	//确定是一个文件上传请求后, 需要初始化一个新的
	//formidable.IncomingForm表单. 调用form.parse(),
	//然后formidable就可以访问请求的data事件进行解析了.
	var form = new formidable.IncomingForm();
	// form.on('field', function(field, value){
	// 	console.log(field);
	// 	console.log(value);
	// });
	// //文件上传完成后发出file事件.
	// form.on('file', function(name, file){
	// 	console.log(name);
	// 	console.log(file);
	// });
	// form.on('end', function(){
	// 	res.end('upload complete!');
	// });

	// form.parse(req);

	form.on('progress', function(bytesReceived, bytesExpected){
		var percent = Math.floor(bytesReceived / bytesExpected * 100);
		console.log(percent);
	});

	//利用formidable的高级API
	form.parse(req, function(err, fields, files){
		console.log(fields);
		console.log(files);
		res.end('Upload completed!');
	});
}


function isFormData(req){
	var type = req.headers['content-type'] || '';
	return 0 === type.indexOf('multipart/form-data');
}


server.listen(3000);