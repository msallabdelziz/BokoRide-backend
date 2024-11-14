// route/rideRoutes.js
const express = require('express');
const router = express.Router();
const { createRide, getRides, updateRide, deleteRide } = require('../controllers/rideController');
const authenticate = require('../middlewares/authMiddleware'); // Import du middleware
const authorizeRoles = require('../middlewares/roleMiddleware'); // Import du middleware d'autorisation

// Route pour créer un trajet, protégée par l'authentification et accessible aux chauffeurs, superadmins et admins
router.post('/create', authenticate, authorizeRoles('chauffeur', 'admin', 'superadmin'), createRide);

// Route pour obtenir tous les trajets, protégée par l'authentification
router.get('/', authenticate, getRides);

// Route pour mettre à jour un trajet, protégée par l'authentification et réservée aux chauffeurs, superadmins et admins
router.put('/update/:rideId', authenticate, authorizeRoles('chauffeur', 'admin', 'superadmin'), updateRide);

// Route pour supprimer un trajet, protégée par l'authentification et réservée aux chauffeurs, superadmins et admins
router.delete('/delete/:rideId', authenticate, authorizeRoles('chauffeur', 'admin', 'superadmin'), deleteRide);

module.exports = router;
