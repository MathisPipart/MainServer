const express = require('express');
const axios = require('axios');
const router = express.Router();

/**
 * @swagger
 * /chat/save:
 *   post:
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
 *                 description: The ID of the chat room.
 *                 example: "1000864"
 *               userId:
 *                 type: string
 *                 description: The ID of the user sending the message.
 *                 example: "Mathis"
 *               message:
 *                 type: string
 *                 description: The content of the chat message.
 *                 example: "Hello, this film is amazing"
 *     responses:
 *       201:
 *         description: Message saved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Message saved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     room:
 *                       type: string
 *                       example: "1000864"
 *                     userId:
 *                       type: string
 *                       example: "Mathis"
 *                     message:
 *                       type: string
 *                       example: "Hello, this film is amazing"
 *                     timestamp:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-01-08T15:23:45.123Z"
 *       500:
 *         description: Failed to save the message.
 */
router.post('/save', async (req, res) => {
    const { room, userId, message } = req.body;
    console.log(`[Main Server - ChatRoutes] Sending message to MongoDB Server: Room: ${room}, User: ${userId}, Message: ${message}`);
    try {
        const response = await axios.post('http://localhost:3001/chat/save', { room, userId, message });
        res.status(response.status).json(response.data);
    } catch (error) {
        console.error('[Main Server - ChatRoutes] Error while saving the message:', error.message);
        res.status(500).json({ error: 'Failed to save chat message' });
    }
});

/**
 * @swagger
 * /chat/history/{room}:
 *   get:
 *     summary: Retrieve chat history
 *     description: Fetch chat history via the Main Server, which proxies the request to the MongoDB Server.
 *     parameters:
 *       - in: path
 *         name: room
 *         required: true
 *         schema:
 *           type: string
 *           example: "1000864"
 *           description: The ID of the chat room.
 *     responses:
 *       200:
 *         description: Successfully retrieved chat history.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   room:
 *                     type: string
 *                     example: "1000864"
 *                   userId:
 *                     type: string
 *                     example: "Mathis"
 *                   message:
 *                     type: string
 *                     example: "Hello, this film is amazing"
 *                   timestamp:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-01-08T15:23:45.123Z"
 *       500:
 *         description: Failed to retrieve chat history.
 */
router.get('/history/:room', async (req, res) => {
    const { room } = req.params;
    console.log(`[Main Server - ChatRoutes] Fetching history for room: ${room}`);

    try {
        const response = await axios.get(`http://localhost:3001/chat/history/${room}`);
        res.status(response.status).json(response.data);
    } catch (error) {
        console.error('[Main Server - ChatRoutes] Error while fetching history:', error.message);
        res.status(500).json({ error: 'Failed to fetch chat history' });
    }
});

module.exports = router;
