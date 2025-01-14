const express = require('express');
const axios = require('axios');
const router = express.Router();

// Base URL for the Spring Boot API
const SPRING_BOOT_API = 'http://localhost:8082';


/**
 * @swagger
 * tags:
 *   name: SpringBoot
 *   description: Endpoints for SpringBoot Server
 */


/**
 * @swagger
 * /springboot/distinctGenres:
 *   get:
 *     summary: "MENU : Retrieve a list of distinct genre for the menu"
 *     description: Fetches a list of unique genres available in the database.
 *     tags:
 *       - SpringBoot
 *     responses:
 *       200:
 *         description: A list of distinct genres.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *                 example: Action
 *       500:
 *         description: Internal server error while retrieving genres.
 */
router.get('/distinctGenres', async (req, res) => {
    try {
        const response = await axios.get(`${SPRING_BOOT_API}/genres/distinctGenres`);
        res.status(200).json(response.data);
    } catch (error) {
        console.error('Error retrieving distinct types:', error.message);
        res.status(500).json({ error: 'Error retrieving types.' });
    }
});


/**
 * @swagger
 * /springboot/distinctDates:
 *   get:
 *     summary: "MENU : Retrieve distinct release dates for the menu"
 *     description: Fetches a list of unique release dates for movies, sorted in descending order.
 *     tags:
 *       - SpringBoot
 *     responses:
 *       200:
 *         description: A list of distinct release dates.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *                 example: 2020
 *       500:
 *         description: Internal server error while retrieving dates.
 */
router.get('/distinctDates', async (req, res) => {
    try {
        const response = await axios.get(`${SPRING_BOOT_API}/movies/distinctDates`);
        res.status(200).json(response.data);
    } catch (error) {
        console.error('Error retrieving distinct dates:', error.message);
        res.status(500).json({ error: 'Error retrieving distinct dates.' });
    }
});


/**
 * @swagger
 * /springboot/movieDetails:
 *   get:
 *     tags:
 *       - SpringBoot
 *     summary: Get detailed information about a movie
 *     description: Retrieve detailed information about a movie, including title, description, genres, actors, crew, languages, releases, and more.
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The unique ID of the movie.
 *         example: 1000002
 *     responses:
 *       200:
 *         description: Successfully retrieved movie details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: The unique ID of the movie.
 *                   example: 1000001
 *                 name:
 *                   type: string
 *                   description: The title of the movie.
 *                   example: "Barbie"
 *                 date:
 *                   type: integer
 *                   format: date
 *                   description: The release date of the movie.
 *                   example: 2023
 *                 description:
 *                   type: string
 *                   description: A brief description of the movie.
 *                   example: "Barbie suffers a crisis that leads her to question her world and her existence."
 *                 genres:
 *                   type: string
 *                   description: The genres of the movie.
 *                   example: "Comedy, Fantasy, Adventure"
 *                 tagline:
 *                   type: string
 *                   description: The tagline of the movie.
 *                   example: "She's everything. He's just Ken."
 *                 minute:
 *                   type: integer
 *                   description: The duration of the movie in minutes.
 *                   example: 114
 *                 rating:
 *                   type: number
 *                   format: float
 *                   description: The movie rating.
 *                   example: 3.86
 *                 link:
 *                   type: string
 *                   description: The link to the movie poster or trailer.
 *                   example: "https://example.com/barbie-poster.jpg"
 *                 languages:
 *                   type: string
 *                   description: The languages of the movie.
 *                   example: "English, French, Spanish"
 *                 countries:
 *                   type: string
 *                   description: The countries where the movie was produced.
 *                   example: "USA, UK"
 *                 themes:
 *                   type: string
 *                   description: The themes of the movie.
 *                   example: "Comedy, Adventure"
 *                 studios:
 *                   type: string
 *                   description: The studios involved in the production of the movie.
 *                   example: "Warner Bros., Mattel Films"
 *                 actors:
 *                   type: string
 *                   description: The actors and their roles in the movie.
 *                   example: "Margot Robbie (Barbie), Ryan Gosling (Ken)"
 *                 crew:
 *                   type: string
 *                   description: The crew members and their roles.
 *                   example: "Greta Gerwig (Director), Noah Baumbach (Writer)"
 *                 releases:
 *                   type: string
 *                   description: The release details of the movie.
 *                   example: "2023-07-21 in USA (Theatrical)"
 *       400:
 *         description: Invalid or missing movie ID.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message.
 *                   example: "Invalid movie ID."
 *       500:
 *         description: Failed to retrieve movie details due to a server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message.
 *                   example: "Error retrieving movie details."
 */
router.get('/movieDetails', async (req, res) => {
    const movieId = req.query.id;

    try {
        const response = await axios.get(`${SPRING_BOOT_API}/detailsMovies/findById/${movieId}`);

        if (req.headers['accept'] === 'application/json') {
            return res.status(200).json(response.data);
        }

        res.render('pages/movieDetails', {
            title: 'Movie Details',
            movie: response.data,
            error: null,
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des détails du film :', error.message, error.response?.data);

        if (req.headers['accept'] === 'application/json') {
            return res.status(500).json({
                error: `Erreur : ${error.message} - ${error.response?.data || 'Aucune donnée reçue'}`,
            });
        }

        res.render('pages/movieDetails', {
            title: 'Movie Details',
            movie: null,
            error: `Erreur : ${error.message} - ${error.response?.data || 'Aucune donnée reçue'}`,
        });
    }
});


/**
 * @swagger
 * /springboot/findByKeyword:
 *   get:
 *     tags:
 *       - SpringBoot
 *     summary: Search for movies by keyword (search bar)
 *     description: Retrieve a paginated list of movies that match a specific keyword.
 *     parameters:
 *       - in: query
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: The keyword to search for movies.
 *         example: "Monster"
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           default: 0
 *         description: The page number for pagination (default is 0).
 *         example: 1
 *     responses:
 *       200:
 *         description: Successfully retrieved movies matching the keyword.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 movies:
 *                   type: array
 *                   description: A list of movies matching the keyword.
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
 *                         format: date
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
 *       400:
 *         description: Invalid or missing query parameters.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message.
 *                   example: "Invalid keyword or page number."
 *       500:
 *         description: Failed to retrieve movies due to a server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message.
 *                   example: "Error retrieving movies."
 */
router.get('/findByKeyword', async (req, res) => {
    const { name, page } = req.query;
    const currentPage = parseInt(page) || 0;

    try {
        const response = await axios.get(`${SPRING_BOOT_API}/movies/findByKeyword`, {
            params: { name, page: currentPage, size: 20 },
        });

        if (req.headers['accept'] === 'application/json') {
            return res.status(200).json(response.data);
        }

        res.render('pages/resultResearch', {
            title: 'Search Results',
            movies: response.data,
            query: name,
            currentPage: currentPage,
            error: null
        });
    } catch (error) {
        console.error('Error while retrieving movies:', error.message);

        if (req.headers['accept'] === 'application/json') {
            return res.status(500).json({
                error: `Error retrieving movies: ${error.message}`,
            });
        }

        res.render('pages/resultResearch', {
            title: 'Search Error',
            movies: [],
            query: name,
            currentPage: currentPage,
            error: 'Error retrieving data or no movies found.'
        });
    }
});


/**
 * @swagger
 * /springboot/genres:
 *   get:
 *     tags:
 *       - SpringBoot
 *     summary: Get movies by genre
 *     description: Retrieve a paginated list of movies that belong to a specific genre.
 *     parameters:
 *       - in: query
 *         name: genre
 *         required: true
 *         schema:
 *           type: string
 *         description: The genre of the movies.
 *         example: "Comedy"
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           default: 0
 *         description: The page number for pagination (default is 0).
 *         example: 1
 *     responses:
 *       200:
 *         description: Successfully retrieved movies by genre.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 movies:
 *                   type: array
 *                   description: A list of movies that match the genre.
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: The unique ID of the movie.
 *                         example: 1000001
 *                       name:
 *                         type: string
 *                         description: The title of the movie.
 *                         example: "Barbie"
 *                       date:
 *                         type: integer
 *                         format: date
 *                         description: The year of the movie.
 *                         example: 2023
 *                       genre:
 *                          type: string
 *                          description: The genre of the movies.
 *                          example: "Comedy, Adventure"
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
 *       400:
 *         description: Invalid or missing query parameters.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message.
 *                   example: "Invalid genre or page number."
 *       500:
 *         description: Failed to retrieve movies due to a server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message.
 *                   example: "Error retrieving movies."
 */
router.get('/genres', async (req, res) => {
    const { genre, page } = req.query;
    const currentPage = parseInt(page) || 0;

    try {
        const response = await axios.get(`${SPRING_BOOT_API}/movies/findByGenre`, {
            params: { genre, page: currentPage, size: 20 },
        });

        if (req.headers['accept'] === 'application/json') {
            return res.status(200).json(response.data);
        }

        res.render('pages/genres', {
            title: `Movies for Genre: ${genre}`,
            movies: response.data,
            genre,
            currentPage,
            error: null,
        });
    } catch (error) {
        console.error('Error while retrieving movies by genre:', error.message);

        if (req.headers['accept'] === 'application/json') {
            return res.status(500).json({
                error: `Error retrieving movies: ${error.message}`,
            });
        }

        res.render('pages/genres', {
            title: 'Search Error',
            movies: [],
            genre,
            currentPage,
            error: 'Error retrieving data or no movies found.',
        });
    }
});


/**
 * @swagger
 * /springboot/releases:
 *   get:
 *     tags:
 *       - SpringBoot
 *     summary: Get movies released in a specific year
 *     description: Retrieve a paginated list of movies that were released in a specific year.
 *     parameters:
 *       - in: query
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *         description: "The year of the movie release (format: YYYY)."
 *         example: "2023"
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           default: 0
 *         description: The page number for pagination (default is 0).
 *         example: 1
 *     responses:
 *       200:
 *         description: Successfully retrieved movies released in the given year.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 movies:
 *                   type: array
 *                   description: A list of movies released in the given year.
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
 *                         format: date
 *                         description: The release year of the movie.
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
 *       400:
 *         description: Invalid or missing query parameters (e.g., invalid date format).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message.
 *                   example: "Invalid date format. Expected format: YYYY."
 *       500:
 *         description: Failed to retrieve movies due to a server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message.
 *                   example: "Error retrieving movies."
 */
router.get('/releases', async (req, res) => {
    const { date, page } = req.query;
    const currentPage = parseInt(page) || 0;

    try {
        if (!/^\d{4}$/.test(date)) {
            if (req.headers['accept'] === 'application/json') {
                return res.status(400).json({
                    error: 'Invalid date format. Expected format: YYYY.'
                });
            }

            return res.render('pages/releases', {
                title: 'Search by Date',
                movies: [],
                date,
                currentPage,
                error: 'Invalid date format. Expected format: YYYY.'
            });
        }

        const response = await axios.get(`${SPRING_BOOT_API}/movies/findByDate`, {
            params: { date, page: currentPage, size: 20 }
        });

        if (req.headers['accept'] === 'application/json') {
            return res.status(200).json(response.data); // Renvoie uniquement les données JSON
        }

        res.render('pages/releases', {
            title: `Movies from ${date}`,
            movies: response.data,
            date,
            currentPage,
            error: null
        });
    } catch (error) {
        console.error('Error while retrieving movies by date:', error.message);

        if (req.headers['accept'] === 'application/json') {
            return res.status(500).json({
                error: `Error retrieving movies: ${error.message}`,
            });
        }

        res.render('pages/releases', {
            title: 'Search Error',
            movies: [],
            date,
            currentPage,
            error: 'Error retrieving data or no movies found.'
        });
    }
});


/**
 * @swagger
 * /springboot/languages:
 *   get:
 *     tags:
 *       - SpringBoot
 *     summary: Retrieve available languages, types, and movies based on filters
 *     description: >
 *       This endpoint fetches a list of available languages and types from the Spring Boot API
 *       using the following endpoints:
 *       - `/languages/distinctLanguages` for distinct languages.
 *       - `/languages/distinctTypes` for distinct types.
 *       It fetches movies filtered by language and type.
 *     parameters:
 *       - in: query
 *         name: selectedLanguage
 *         required: false
 *         schema:
 *           type: string
 *         description: Filter movies by language.
 *         example: "English"
 *       - in: query
 *         name: selectedType
 *         required: false
 *         schema:
 *           type: string
 *         description: Filter movies by type.
 *         example: "Spoken language"
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           default: 0
 *         description: The page number for pagination (default is 0).
 *         example: 1
 *     responses:
 *       200:
 *         description: Successfully retrieved languages, types, and movies (if filtered).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 languages:
 *                   type: array
 *                   description: List of distinct languages available.
 *                   items:
 *                     type: string
 *                     example: "English"
 *                 types:
 *                   type: array
 *                   description: List of distinct types available.
 *                   items:
 *                     type: string
 *                     example: "Language"
 *                 movies:
 *                   type: array
 *                   description: Filtered list of movies based on language and type.
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
 *                         format: date
 *                         description: The release year of the movie.
 *                         example: 2023
 *                       description:
 *                         type: string
 *                         description: A brief description of the movie.
 *                         example: "Barbie and Ken are having the time of their lives in Barbie Land."
 *                       duration:
 *                         type: integer
 *                         description: The duration of the movie in minutes.
 *                         example: 114
 *                       rating:
 *                         type: number
 *                         format: float
 *                         description: The movie rating.
 *                         example: 3.86
 *                       tagline:
 *                         type: string
 *                         description: The tagline of the movie.
 *                         example: "She's everything. He's just Ken."
 *                       link:
 *                         type: string
 *                         description: The link to the movie poster or trailer.
 *                         example: "https://example.com/barbie-poster.jpg"
 *                       languages:
 *                         type: array
 *                         description: List of languages for the movie.
 *                         items:
 *                           type: object
 *                           properties:
 *                             type:
 *                               type: string
 *                               description: The type of language.
 *                               example: "Language"
 *                             language:
 *                               type: string
 *                               description: The language name.
 *                               example: "English"
 *       500:
 *         description: Failed to retrieve data due to a server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message.
 *                   example: "Error retrieving necessary data."
 */
router.get('/languages', async (req, res) => {
    const { selectedLanguage, selectedType, page } = req.query;
    const currentPage = parseInt(page) || 0;

    try {
        const languagesResponse = await axios.get('http://localhost:3000/springboot/languages/distinctLanguages');
        const typesResponse = await axios.get('http://localhost:3000/springboot/languages/distinctTypes');

        const languages = languagesResponse.data;
        const types = typesResponse.data;

        let movies = null;

        if (selectedLanguage || selectedType) {
            try {
                const moviesResponse = await axios.get(`${SPRING_BOOT_API}/movies/findMoviesByLanguageAndType`, {
                    params: { selectedLanguage, selectedType, page: currentPage, size: 20 },
                });

                movies = groupMoviesById(moviesResponse.data);
            } catch (searchError) {
                console.error('Error while searching for movies:', searchError.message);
                movies = [];
            }
        }

        if (req.headers['accept'] === 'application/json') {
            return res.status(200).json({
                languages,
                types,
                movies,
            });
        }

        res.render('pages/languages', {
            title: 'Select a Language and Type',
            languages,
            types,
            selectedLanguage,
            selectedType,
            currentPage,
            movies,
            error: null,
        });
    } catch (error) {
        console.error('Error while retrieving languages or types:', error.message);

        if (req.headers['accept'] === 'application/json') {
            return res.status(500).json({
                error: 'Error retrieving necessary data.',
            });
        }

        res.render('pages/languages', {
            title: 'Error',
            languages: [],
            types: [],
            selectedLanguage: null,
            selectedType: null,
            currentPage: 0,
            movies: null,
            error: 'Error retrieving necessary data.',
        });
    }
});


/**
 * @swagger
 * /springboot/languages/distinctLanguages:
 *   get:
 *     tags:
 *       - SpringBoot
 *     summary: Retrieve a list of distinct languages
 *     description: Fetch all distinct languages available for movies in the database.
 *     responses:
 *       200:
 *         description: Successfully retrieved the list of languages.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               description: A list of distinct languages.
 *               items:
 *                 type: string
 *                 example: "English"
 *       500:
 *         description: Failed to retrieve the list of languages due to a server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message.
 *                   example: "Error retrieving languages."
 */
router.get('/languages/distinctLanguages', async (req, res) => {
    try {
        const response = await axios.get(`${SPRING_BOOT_API}/languages/distinctLanguages`);
        res.status(200).json(response.data);
    } catch (error) {
        console.error('Error retrieving distinct languages:', error.message);
        res.status(500).json({ error: 'Error retrieving languages.' });
    }
});

/**
 * @swagger
 * /springboot/languages/distinctTypes:
 *   get:
 *     tags:
 *       - SpringBoot
 *     summary: Retrieve a list of distinct types
 *     description: Fetch all distinct types of movies in the database.
 *     responses:
 *       200:
 *         description: Successfully retrieved the list of types.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               description: A list of distinct types.
 *               items:
 *                 type: string
 *                 example: "Spoken language"
 *       500:
 *         description: Failed to retrieve the list of types due to a server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message.
 *                   example: "Error retrieving types."
 */
router.get('/languages/distinctTypes', async (req, res) => {
    try {
        const response = await axios.get(`${SPRING_BOOT_API}/languages/distinctTypes`);
        res.status(200).json(response.data);
    } catch (error) {
        console.error('Error retrieving distinct types:', error.message);
        res.status(500).json({ error: 'Error retrieving types.' });
    }
});



function groupMoviesById(data) {
    const movies = {};
    data.forEach(row => {
        const movieId = row[0]; // movie_id
        if (!movies[movieId]) {
            movies[movieId] = {
                id: movieId,
                name: row[1],
                date: row[2],
                description: row[3],
                duration: row[4],
                rating: row[5],
                tagline: row[6],
                link: row[10],
                languages: [],
            };
        }
        if (row[8] && row[9]) {
            movies[movieId].languages.push({
                type: row[8],
                language: row[9],
            });
        }
    });
    return Object.values(movies);
}



module.exports = router;
