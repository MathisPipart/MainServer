var express = require('express');
const axios = require('axios');
var router = express.Router();

// Base URL for the Spring Boot API
const SPRING_BOOT_API = 'http://localhost:8082';
// GET home page
router.get('/', async function (req, res) {
  try {
    // Fetch the top 50 rated movies from the API
    const response = await axios.get(`${SPRING_BOOT_API}/movies/topRated`);

    // Render the home page with the fetched movies
    res.render('pages/index', {
      title: 'Rotten Ketchup',
      movies: response.data,
      error: null
    });
  }
  catch (error) {
    console.error('Error fetching top-rated movies:', error.message);

    // Render the home page with an error message if the API call fails
    res.render('pages/index', {
      title: 'Rotten Ketchup',
      movies: [],
      error: 'Failed to fetch top-rated movies.'
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
