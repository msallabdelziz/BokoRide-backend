
// routes/locationRoutes.js
const express = require('express');
const { getLocation, setLocation } = require('../controllers/locationController');
const authenticate = require('../middlewares/authMiddleware');
const authorizeRoles = require('../middlewares/roleMiddleware');

const router = express.Router();

// Route pour envoyer la localisation d'un utilisateur
router.post('/set-location', authenticate, setLocation);

// Route pour récupérer la localisation d'un utilisateur
router.get('/get-location/:userId', authenticate, authorizeRoles('admin', 'superadmin'), getLocation);

module.exports = router;
