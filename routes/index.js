var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('pages/index', { title: 'Home' });
});

router.get('/releases', function(req, res, next) {
  res.render('pages/releases', { title: 'Releases', release:'2010'});
});

router.get('/chat', function(req, res, next) {
  res.render('pages/chat', { title: 'Chat' });
});

module.exports = router;
