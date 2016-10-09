var express = require('express');
var photos = require('./photos');
var router = express.Router();

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

//Jacky 2016.09.25
router.get('/', photos.list);

module.exports = router;
