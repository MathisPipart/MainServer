const express = require('express');
const axios = require('axios');
const router = express.Router();

// Route pour sauvegarder un message dans MongoDB
router.post('/save', async (req, res) => {
    const { room, userId, message } = req.body;
    console.log(`[Main Server - ChatRoutes] Envoi du message à MongoDB Server : Room: ${room}, User: ${userId}, Message: ${message}`);

    try {
        const response = await axios.post('http://localhost:3001/chat/save', { room, userId, message });
        console.log('[Main Server - ChatRoutes] Message sauvegardé avec succès dans MongoDB.');
        res.status(response.status).json(response.data);
    } catch (error) {
        console.error('[Main Server - ChatRoutes] Erreur lors de la sauvegarde du message :', error.message);
        res.status(500).json({ error: 'Failed to save chat message' });
    }
});

// Route pour récupérer l'historique d'une room depuis MongoDB
router.get('/history/:room', async (req, res) => {
    const { room } = req.params;
    console.log(`[Main Server - ChatRoutes] Récupération de l'historique pour la room : ${room}`);

    try {
        const response = await axios.get(`http://localhost:3001/chat/history/${room}`);
        console.log('[Main Server - ChatRoutes] Historique récupéré avec succès depuis MongoDB :', response.data);
        res.status(response.status).json(response.data);
    } catch (error) {
        console.error('[Main Server - ChatRoutes] Erreur lors de la récupération de l\'historique :', error.message);
        res.status(500).json({ error: 'Failed to fetch chat history' });
    }
});

module.exports = router;
