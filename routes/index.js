var express = require('express');
const axios = require('axios');
var router = express.Router();

// Base URL for the Spring Boot API
const SPRING_BOOT_API = 'http://localhost:8082';

// GET home page
router.get('/', async function (req, res) {
  const page = parseInt(req.query.page) || 0;

  try {
    const response = await axios.get(`${SPRING_BOOT_API}/movies/topRated`, {
      params: { page, size: 20 },
    });

    res.render('pages/index', {
      title: 'Rotten Ketchup',
      movies: response.data,
      currentPage: page,
      error: null,
    });
  } catch (error) {
    console.error('Error fetching top-rated movies:', error.message);

    res.render('pages/index', {
      title: 'Rotten Ketchup',
      movies: [],
      currentPage: page,
      error: 'Failed to fetch top-rated movies.',
    });
  }
});

router.get('/releases', function(req, res, next) {
  res.render('pages/releases', { title: 'Releases', release:'2010'});
});

router.get('/chat', function(req, res, next) {
  res.render('pages/chat', { title: 'Chat' });
});


module.exports = router;
