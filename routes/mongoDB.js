const express = require('express');
const axios = require('axios');
const router = express.Router();

// Route to save a message in MongoDB
router.post('/save', async (req, res) => {
    const { room, userId, message } = req.body;
    console.log(`[Main Server - ChatRoutes] Sending message to MongoDB Server: Room: ${room}, User: ${userId}, Message: ${message}`);
    try {
        const response = await axios.post('http://localhost:3001/chat/save', { room, userId, message });
        console.log('[Main Server - ChatRoutes] Message successfully saved in MongoDB.');
        res.status(response.status).json(response.data);
    } catch (error) {
        console.error('[Main Server - ChatRoutes] Error while saving the message:', error.message);
        res.status(500).json({ error: 'Failed to save chat message' });
    }
});

// Route to retrieve the chat history of a room from MongoDB
router.get('/history/:room', async (req, res) => {
    const { room } = req.params;
    console.log(`[Main Server - ChatRoutes] Fetching history for room: ${room}`);

    try {
        const response = await axios.get(`http://localhost:3001/chat/history/${room}`);
        console.log('[Main Server - ChatRoutes] History successfully retrieved from MongoDB:', response.data);
        res.status(response.status).json(response.data);
    } catch (error) {
        console.error('[Main Server - ChatRoutes] Error while fetching history:', error.message);
        res.status(500).json({ error: 'Failed to fetch chat history' });
    }
});

module.exports = router;
