var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('pages/index', { title: 'My Chat' });
});

router.get('/movies', function(req, res, next) {
  res.render('pages/movies', { title: 'Movie' });
});

module.exports = router;
