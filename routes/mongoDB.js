const express = require('express');
const axios = require('axios');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: MongoDB
 *   description: Endpoints for MongoDB
 */

/**
 * @swagger
 * /chat/save:
 *   post:
 *     tags:
 *       - MongoDB
 *     summary: Save a new chat message
 *     description: Save a chat message via the Main Server, which proxies the request to the MongoDB Server.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               room:
 *                 type: string
 *                 example: "1000864"
 *               userId:
 *                 type: string
 *                 example: "Mathis"
 *               message:
 *                 type: string
 *                 example: "Hello, this film is amazing"
 *     responses:
 *       201:
 *         description: Message saved successfully.
 *       500:
 *         description: Failed to save the message.
 */
router.post('/save', async (req, res) => {
    const { room, userId, message } = req.body;
    try {
        const response = await axios.post('http://localhost:3001/chat/save', { room, userId, message });
        res.status(response.status).json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to save chat message' });
    }
});

/**
 * @swagger
 * /chat/history/{room}:
 *   get:
 *     tags:
 *       - MongoDB
 *     summary: Retrieve chat history
 *     description: Fetch the chat history of a specific room via the Main Server.
 *     parameters:
 *       - in: path
 *         name: room
 *         required: true
 *         schema:
 *           type: string
 *           example: "1000864"
 *     responses:
 *       200:
 *         description: Successfully retrieved chat history.
 *       500:
 *         description: Failed to retrieve chat history.
 */
router.get('/history/:room', async (req, res) => {
    const { room } = req.params;
    try {
        const response = await axios.get(`http://localhost:3001/chat/history/${room}`);
        res.status(response.status).json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch chat history' });
    }
});

module.exports = router;
