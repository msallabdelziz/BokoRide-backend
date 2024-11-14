// controllers/rideController.js
// Creation de controller pour les trajets

const { body, validationResult } = require('express-validator');
const Ride = require('../models/rideModel');

// Créer un trajet
const createRide = [
    // Validation des champs
    body('departure')
        .notEmpty()
        .withMessage('Departure is required'),
    body('destination')
        .notEmpty()
        .withMessage('Destination is required'),
    body('departureTime')
        .isISO8601()
        .toDate()
        .withMessage('Valid departure time is required'),
    body('availableSeats')
        .isInt({ gt: 0 })
        .withMessage('Available seats must be a positive integer'),

    // Fonction de création
    async (req, res) => {
        // Vérification des erreurs de validation
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // Vérification du rôle de l'utilisateur
        if (req.user.role !== 'chauffeur') {
            return res.status(403).json({ message: 'Only chauffeurs can create rides.' });
        }

        const { destination, departureTime, departure, availableSeats } = req.body;
        // Vérification que tous les champs nécessaires sont présents
        if (!destination || !departure || !departureTime || !availableSeats) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        try {
            const newRide = new Ride({
                driver: req.user.userId, // S'assurer que req.user.userId est bien défini dans votre middleware d'authentification
                departure,  
                destination,
                departureTime,
                availableSeats
            });

            await newRide.save();
            res.status(201).json(newRide);
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    }
];


// Obtenir tous les trajets
const getRides = async (req, res) => {
    try {
        const rides = await Ride.find().populate('driver'); // Populer pour obtenir les informations du conducteur
        res.json(rides);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};


// Mettre à jour un trajet avec validation
const updateRide = [
    // Validation des champs
    body('departure')
        .optional()
        .notEmpty()
        .withMessage('Departure is required if provided'),
    body('destination')
        .optional()
        .notEmpty()
        .withMessage('Destination is required if provided'),
    body('departureTime')
        .optional()
        .isISO8601()
        .toDate()
        .withMessage('Valid departure time is required if provided'),
    body('availableSeats')
        .optional()
        .isInt({ gt: 0 })
        .withMessage('Available seats must be a positive integer if provided'),

    // Fonction de mise à jour
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { rideId } = req.params; // Récupérer l'ID du trajet depuis les paramètres

        try {
            const updatedRide = await Ride.findByIdAndUpdate(rideId, req.body, { new: true });
            if (!updatedRide) {
                return res.status(404).json({ message: 'Ride not found' });
            }
            res.json(updatedRide);
        } catch (error) {
            res.status(500).json({ message: 'Server error' });
        }
    } 
];

// Supprimer un trajet
const deleteRide = async (req, res) => {
    const { rideId } = req.params; // Récupérer l'ID du trajet depuis les paramètres

    try {
        const deletedRide = await Ride.findByIdAndDelete(rideId);
        if (!deletedRide) {
            return res.status(404).json({ message: 'Ride not found' });
        }
        res.status(204).send(); // Pas de contenu
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { createRide, getRides, updateRide, deleteRide };
