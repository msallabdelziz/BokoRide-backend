// routes/chatRoutes.js

const express = require('express');
const { sendMessage, getMessages } = require('../controllers/chatController');
const authenticate = require('../middlewares/authMiddleware');

const router = express.Router();

// Route pour envoyer un message
router.post('/send', authenticate, sendMessage);

// Route pour obtenir les messages d'un utilisateur
router.get('/:userId', authenticate, getMessages);

module.exports = router;