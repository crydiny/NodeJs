function Watcher(watchDir, processDir){
	this.watchDir = watchDir;
	this.processDir = processDir;
}


var events = require('events');
var util = require('util');

util.inherits(Watcher, events.EventEmitter);
//和这条代码等价
//Watcher.prototype = new events.EventEmitter();

var fs = require('fs');
var watchDir = './watch';
var processDir = './done';

//扩展EventEmitter,添加处理文件的方法
Watcher.prototype.watch = function(){
	//保存对Watcher对象的引用, 以便在回调函数readdir中使用.
	var watcher = this;
	fs.readdir(this.watchDir, function(err, files){
		if(err) throw err;
		for(var index in files){
			//处理watch目录中的所有文件.
			watcher.emit('process', files[index]);
		}
	});
};

Watcher.prototype.start = function(){
	var watcher = this;
	fs.watchFile(watchDir, function(){
		watcher.watch();
	});
};


var watcher = new Watcher(watchDir, processDir);

watcher.on('process', function(file){
	var watchFile = this.watchDir + '/' + file;
	var processedFile = this.processDir + '/' + file.toLowerCase();
	fs.rename(watchFile, processedFile, function(err){
		if(err) throw err;
	});
});

watcher.start();
