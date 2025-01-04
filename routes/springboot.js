const express = require('express');
const axios = require('axios');
const router = express.Router();

// Base URL for the Spring Boot API
const SPRING_BOOT_API = 'http://localhost:8082';


router.get('/movieDetails', async (req, res) => {
    const movieId = req.query.id;

    try {
        const response = await axios.get(`${SPRING_BOOT_API}/detailsMovies/findById/${movieId}`);

        res.render('pages/movieDetails', {
            title: 'Movie Details',
            movie: response.data,
            error: null,
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des détails du film :', error.message, error.response?.data);
        res.render('pages/movieDetails', {
            title: 'Movie Details',
            movie: null,
            error: `Erreur : ${error.message} - ${error.response?.data || 'Aucune donnée reçue'}`,
        });
    }
});

// Route to retrieve movies by keyword
router.get('/findByKeyword', async (req, res) => {
    const { name, page } = req.query; // Récupérer le mot-clé et la page
    const currentPage = parseInt(page) || 0;

    try {
        const response = await axios.get(`${SPRING_BOOT_API}/movies/findByKeyword`, {
            params: { name, page: currentPage, size: 20 },
        });

        res.render('pages/resultResearch', {
            title: 'Search Results',
            movies: response.data,
            query: name,
            currentPage: currentPage,
            error: null
        });
    } catch (error) {
        console.error('Error while retrieving movies:', error.message);

        res.render('pages/resultResearch', {
            title: 'Search Error',
            movies: [],
            query: name,
            currentPage: currentPage,
            error: 'Error retrieving data or no movies found.'
        });
    }
});

// Route to retrieve movies by genre
router.get('/genres', async (req, res) => {
    const { genre, page } = req.query; // Récupérez le genre et la page
    const currentPage = parseInt(page) || 0;

    try {
        // Appel à l'API Spring Boot
        const response = await axios.get(`${SPRING_BOOT_API}/movies/findByGenre`, {
            params: { genre, page: currentPage, size: 20 },
        });

        // Rendre la vue avec les données paginées
        res.render('pages/genres', {
            title: `Movies for Genre: ${genre}`,
            movies: response.data,
            genre,
            currentPage,
            error: null,
        });
    } catch (error) {
        console.error('Error while retrieving movies by genre:', error.message);

        res.render('pages/genres', {
            title: 'Search Error',
            movies: [],
            genre,
            currentPage,
            error: 'Error retrieving data or no movies found.',
        });
    }
});


// Route to retrieve movies by date
router.get('/releases', async (req, res) => {
    const { date, page } = req.query;
    const currentPage = parseInt(page) || 0;

    try {
        // Validate the date format (YYYY)
        if (!/^\d{4}$/.test(date)) {
            return res.render('pages/releases', {
                title: 'Search by Date',
                movies: [],
                date,
                currentPage,
                error: 'Invalid date format. Expected format: YYYY.'
            });
        }

        // Call the Spring Boot API
        const response = await axios.get(`${SPRING_BOOT_API}/movies/findByDate`, {
            params: { date, page: currentPage, size: 20 }
        });

        res.render('pages/releases', {
            title: `Movies from ${date}`,
            movies: response.data,
            date,
            currentPage,
            error: null
        });
    } catch (error) {
        console.error('Error while retrieving movies by date:', error.message);

        res.render('pages/releases', {
            title: 'Search Error',
            movies: [],
            date,
            currentPage,
            error: 'Error retrieving data or no movies found.'
        });
    }
});

// Main route to display the page and handle the search
router.get('/languages', async (req, res) => {
    const { selectedLanguage, selectedType, page } = req.query;
    const currentPage = parseInt(page) || 0;

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
                    params: { selectedLanguage, selectedType, page: currentPage, size: 20 },
                });

                movies = groupMoviesById(moviesResponse.data);
            } catch (searchError) {
                console.error('Error while searching for movies:', searchError.message);
                movies = []; // No movies found or error
            }
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
