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
 *         description: The page number for pagination (default is 0).
 *         example: 0
 *     responses:
 *       200:
 *         description: Successfully retrieved top-rated movies.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 movies:
 *                   type: array
 *                   description: A list of top-rated movies.
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: The unique ID of the movie.
 *                         example: 1000002
 *                       name:
 *                         type: string
 *                         description: The title of the movie.
 *                         example: "Barbie"
 *                       date:
 *                         type: integer
 *                         description: The year of the movie.
 *                         example: 2023
 *                       tagline:
 *                         type: string
 *                         description: The tagline of the movie.
 *                         example: "She's everything. He's just Ken."
 *                       description:
 *                         type: string
 *                         description: A brief description of the movie.
 *                         example: "Barbie and Ken are having the time of their lives in Barbie Land."
 *                       minute:
 *                         type: integer
 *                         description: The duration of the movie in minutes.
 *                         example: 114
 *                       rating:
 *                         type: number
 *                         format: float
 *                         description: The movie rating.
 *                         example: 3.86
 *                       link:
 *                         type: string
 *                         description: The link to the movie poster or trailer.
 *                         example: "https://example.com/barbie-poster.jpg"
 *       500:
 *         description: Internal server error while fetching top-rated movies.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message.
 *                   example: "Failed to fetch top-rated movies."
 */
router.get('/', async function (req, res) {
  const page = parseInt(req.query.page) || 0;

  try {
    const response = await axios.get(`${SPRING_BOOT_API}/movies/topRated`, {
      params: { page, size: 20 },
    });

    if (req.headers['accept'] === 'application/json') {
      return res.status(200).json({
        movies: response.data,
      });
    }

    res.render('pages/index', {
      title: 'Rotten Ketchup',
      movies: response.data,
      currentPage: page,
      error: null,
    });
  } catch (error) {
    console.error('Error fetching top-rated movies:', error.message);

    if (req.headers['accept'] === 'application/json') {
      return res.status(500).json({
        error: 'Failed to fetch top-rated movies.',
      });
    }

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
