const express = require('express');
const axios = require('axios');
const router = express.Router();

// Base URL for the Spring Boot API
const SPRING_BOOT_API = 'http://localhost:8082';

// Route to retrieve movies by keyword
router.get('/findByKeyword', async (req, res) => {
    const { name } = req.query; // Retrieve the keyword from the request

    try {
        // Call the Spring Boot API
        const response = await axios.get(`${SPRING_BOOT_API}/movies/findByKeyword`, {
            params: { name },
        });

        // Render the view with the movie data
        res.render('pages/resultResearch', { title: 'Search Results', movies: response.data, keyword: name, error: null });
    } catch (error) {
        console.error('Error while retrieving movies:', error.message);

        // In case of an error, pass an error message to the view
        res.render('pages/resultResearch', { title: 'Search Error', movies: [], keyword: name, error: 'Error retrieving data or no movies found.' });
    }
});


// Route to retrieve movies by genre
router.get('/genres', async (req, res) => {
    const { genre } = req.query; // Retrieve the genre from the request

    try {
        // Call the Spring Boot API
        const response = await axios.get(`${SPRING_BOOT_API}/movies/findByGenre`, {
            params: { genre },
        });

        // Render the view with the movie data
        res.render('pages/genres', {
            title: `Movies for Genre: ${genre}`,
            movies: response.data,
            genre: genre,
            error: null
        });
    } catch (error) {
        console.error('Error while retrieving movies by genre:', error.message);

        // In case of an error, pass an error message to the view
        res.render('pages/genres', {
            title: 'Search Error',
            movies: [],
            genre: genre,
            error: 'Error retrieving data or no movies found.'
        });
    }
});

// Route to retrieve movies by date
router.get('/releases', async (req, res) => {
    const { date } = req.query;

    try {
        // Validate the date format (YYYY)
        if (!/^\d{4}$/.test(date)) {
            return res.render('pages/releases', {
                title: 'Search by Date',
                movies: [],
                date,
                error: 'Invalid date format. Expected format: YYYY.'
            });
        }

        // Call the Spring Boot API
        const response = await axios.get(`${SPRING_BOOT_API}/movies/findByDate`, { params: { date } });

        // Render the view with the results
        res.render('pages/releases', {
            title: `Movies from ${date}`,
            movies: response.data,
            date,
            error: null
        });
    } catch (error) {
        console.error('Error while retrieving movies by date:', error.message);

        // Render the view in case of an error
        res.render('pages/dateResults', {
            title: 'Search Error',
            movies: [],
            date,
            error: 'Error retrieving data or no movies found.'
        });
    }
});

// Main route to display the page and handle the search
router.get('/languages', async (req, res) => {
    const { selectedLanguage, selectedType } = req.query;

    try {
        // Retrieve languages and types for the form
        const languagesResponse = await axios.get(`${SPRING_BOOT_API}/languages/distinctLanguages`);
        const typesResponse = await axios.get(`${SPRING_BOOT_API}/languages/distinctTypes`);

        const languages = languagesResponse.data;
        const types = typesResponse.data;

        let movies = null;

        // If a search is performed
        if (selectedLanguage || selectedType) {
            try {
                const moviesResponse = await axios.get(`${SPRING_BOOT_API}/movies/findMoviesByLanguageAndType`, {
                    params: { selectedLanguage, selectedType },
                });

                // Group results by movie_id
                movies = groupMoviesById(moviesResponse.data);
            } catch (searchError) {
                console.error('Error while searching for movies:', searchError.message);
                movies = []; // No movies found or error
            }
        }

        // Render the view with the data, even in case of an error
        res.render('pages/languages', {
            title: 'Select a Language and Type',
            languages,
            types,
            selectedLanguage,
            selectedType,
            movies,
            error: null, // No global error
        });
    } catch (error) {
        console.error('Error while retrieving languages or types:', error.message);

        // Render the view with an error, but allow continuation
        res.render('pages/languages', {
            title: 'Error',
            languages: [],
            types: [],
            selectedLanguage: null,
            selectedType: null,
            movies: null,
            error: 'Error retrieving necessary data.',
        });
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
