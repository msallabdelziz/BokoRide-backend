// routes/ratingRoutes.js

const express = require('express');
const router = express.Router();
const { submitRating, getRatingsByDriver } = require('../controllers/ratingController');
const authenticate = require('../middlewares/authMiddleware'); // Authentification requise

// Route pour soumettre une évaluation
router.post('/submit', authenticate, submitRating);

// Route pour obtenir les évaluations d'un chauffeur
router.get('/:driverId', authenticate, getRatingsByDriver);

module.exports = router;
