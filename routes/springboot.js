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
        res.render('movies', { movies: response.data, keyword: name, error: null });
    } catch (error) {
        console.error('Erreur lors de la récupération des films:', error.message);

        // En cas d'erreur, transmettre un message d'erreur à la vue
        res.render('movies', { movies: [], keyword: name, error: 'Erreur lors de la récupération des données ou aucun film trouvé.' });
    }
});

module.exports = router;
