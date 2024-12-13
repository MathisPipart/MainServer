var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('pages/index', { title: 'Home' });
});

router.get('/genres', function(req, res, next) {
  res.render('pages/genres', { title: 'Genres' });
});

router.get('/releases', function(req, res, next) {
  res.render('pages/releases', { title: 'Releases' });
});

router.get('/languages', function(req, res, next) {
  res.render('pages/languages', { title: 'Languages' });
});


router.get('/chat', function(req, res, next) {
  res.render('pages/chat', { title: 'Chat' });
});

module.exports = router;
