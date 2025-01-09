var express = require('express');
const axios = require('axios');
var router = express.Router();

const SPRING_BOOT_API = 'http://localhost:8082';


/**
 * @swagger
 * /:
 *   get:
 *     summary: "Home Page : Retrieve the top-rated movies"
 *     description: Fetches a paginated list of top-rated movies.
 *     tags:
 *       - SpringBoot
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 0
 *         description: The page number to retrieve (pagination).
 *     responses:
 *       200:
 *         description: A paginated list of top-rated movies.
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               example: "<html>Rendered page content</html>"
 *       500:
 *         description: Internal server error while fetching top-rated movies.
 */
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


router.get('/chat', function(req, res, next) {
  res.render('pages/chat', { title: 'Chat' });
});


module.exports = router;
