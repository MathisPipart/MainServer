const express = require('express');
const axios = require('axios');
const router = express.Router();

// URL de base de l'API Spring Boot
const SPRING_BOOT_API = 'http://localhost:8082/movies';

// Route pour récupérer les films par mot-clé
router.get('/findByKeyword', async (req, res) => {
    const { name } = req.query; // Récupération du mot-clé depuis la requête

    try {
        // Appel à l'API Spring Boot
        const response = await axios.get(`${SPRING_BOOT_API}/findByKeyword`, {
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
        const response = await axios.get(`${SPRING_BOOT_API}/findByGenre`, {
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
        const response = await axios.get(`${SPRING_BOOT_API}/findByDate`, { params: { date } });

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


module.exports = router;
