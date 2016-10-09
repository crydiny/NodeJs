/*
Jacky
2016.9.25
*/
var photo = require('../models/photo');
var path = require('path');
var fs = require('fs');
var join = path.join;

var photos = [];

photos.push({
	name: 'Node.js Logo',
	path: 'http://nodejs.org/images/logos/nodejs-green.png'
});

photos.push({
	name: 'Ryan speaking',
	path: 'http://nodejs.org/images/ryan-speaker.jpg'
});

// exports.list = function(req, res){
// 	res.render('photos', {
// 		title: 'Photos',
// 		photos: photos
// 	});
// };


//渲染./views/photos/upload.ejs
exports.form = function(req, res){
	res.render('photos/upload', {
		title: 'Photo upload'
	});
};


exports.submit = function(dir){
	return function(req, res, next){
		var img = req.files.photo.image;
		var name = req.body.photo.name || img.name;
		var path = join(dir, img.name);

		fs.rename(img.path, path, function(err){
			if(err) return next(err);
			photo.create({
				name: name,
				path: img.name
			}, function(err){
				if(err) return next(err);
				res.redirect('/');
			});
		});
	};
};


exports.list = function(req, res, next){
	photo.find({}, function(err, photos){
		if(err) return next(err);
		res.render('photos', {
			title: 'Photos',
			photos: photos
		});
	});
};
