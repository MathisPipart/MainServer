const express = require('express');
const axios = require('axios');
const router = express.Router();

// URL de base de l'API Spring Boot
const SPRING_BOOT_API = 'http://localhost:8082';

// Route pour récupérer les films par mot-clé
router.get('/findByKeyword', async (req, res) => {
    const { name } = req.query; // Récupération du mot-clé depuis la requête

    try {
        // Appel à l'API Spring Boot
        const response = await axios.get(`${SPRING_BOOT_API}/movies/findByKeyword`, {
            params: { name },
        });

        // Rendu de la vue avec les données des films
        res.render('pages/resultResearch', { title: 'Résultats de recherche', movies: response.data, keyword: name, error: null });
    } catch (error) {
        console.error('Erreur lors de la récupération des films:', error.message);

        // En cas d'erreur, transmettre un message d'erreur à la vue
        res.render('pages/resultResearch', { title: 'Search Error', movies: [], keyword: name, error: 'Erreur lors de la récupération des données ou aucun film trouvé.' });
    }
});


// Route pour récupérer les films par genre
router.get('/genres', async (req, res) => {
    const { genre } = req.query; // Récupération du genre depuis la requête

    try {
        // Appel à l'API Spring Boot
        const response = await axios.get(`${SPRING_BOOT_API}/movies/findByGenre`, {
            params: { genre },
        });

        // Rendu de la vue avec les données des films
        res.render('pages/genres', {
            title: `Films pour le genre : ${genre}`,
            movies: response.data,
            genre: genre,
            error: null
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des films par genre:', error.message);

        // En cas d'erreur, transmettre un message d'erreur à la vue
        res.render('pages/genres', {
            title: 'Erreur de recherche',
            movies: [],
            genre: genre,
            error: 'Erreur lors de la récupération des données ou aucun film trouvé.'
        });
    }
});

// Route pour récupérer les films par date
router.get('/releases', async (req, res) => {
    const { date } = req.query;

    try {
        // Validation de la date au format YYYY
        if (!/^\d{4}$/.test(date)) {
            return res.render('pages/releases', {
                title: 'Recherche par Date',
                movies: [],
                date,
                error: 'La date saisie est invalide. Format attendu : YYYY.'
            });
        }

        // Appel à l'API Spring Boot
        const response = await axios.get(`${SPRING_BOOT_API}/movies/findByDate`, { params: { date } });

        // Rendu de la vue avec les résultats
        res.render('pages/releases', {
            title: `Films de l'année ${date}`,
            movies: response.data,
            date,
            error: null
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des films par date :', error.message);

        // Rendu en cas d'erreur
        res.render('pages/dateResults', {
            title: 'Erreur de recherche',
            movies: [],
            date,
            error: 'Erreur lors de la récupération des données ou aucun film trouvé.'
        });
    }
});


// Route principale pour afficher la page et gérer la recherche
router.get('/languages', async (req, res) => {
    const { selectedLanguage, selectedType } = req.query;

    try {
        // Récupération des langues et types pour le formulaire
        const languagesResponse = await axios.get(`${SPRING_BOOT_API}/languages/distinctLanguages`);
        const typesResponse = await axios.get(`${SPRING_BOOT_API}/languages/distinctTypes`);

        const languages = languagesResponse.data;
        const types = typesResponse.data;

        let movies = null;

        // Si une recherche est effectuée
        if (selectedLanguage || selectedType) {
            try {
                const moviesResponse = await axios.get(`${SPRING_BOOT_API}/movies/findMoviesByLanguageAndType`, {
                    params: { selectedLanguage, selectedType },
                });

                // Regrouper les résultats par movie_id
                movies = groupMoviesById(moviesResponse.data);
            } catch (searchError) {
                console.error('Erreur lors de la recherche des films :', searchError.message);
                movies = []; // Pas de films trouvés ou erreur
            }
        }

        // Rendre la vue avec les données, même en cas d'erreur
        res.render('pages/languages', {
            title: 'Sélectionnez une langue et un type',
            languages,
            types,
            selectedLanguage,
            selectedType,
            movies,
            error: null, // Pas d'erreur globale
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des langues ou types :', error.message);

        // Rendre la vue avec une erreur, mais permettre de continuer
        res.render('pages/languages', {
            title: 'Erreur',
            languages: [],
            types: [],
            selectedLanguage: null,
            selectedType: null,
            movies: null,
            error: 'Erreur lors de la récupération des données nécessaires.',
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
