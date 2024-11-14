//  controllers/ratingController.js

const Rating = require('../models/ratingModel');

// Fonction pour soumettre une évaluation
const submitRating = async (req, res) => {
    const { driverId, rating, comment } = req.body; // Récupération des données

    try {
        // Vérification que toutes les informations nécessaires sont présentes
        if (!driverId || !rating) {
            return res.status(400).json({ message: 'Driver ID and rating are required.' });
        }

        // Création d'une nouvelle évaluation
        const newRating = new Rating({
            driverId,
            userId: req.user.userId, // Récupération de l'ID de l'utilisateur connecté
            rating,
            comment
        });

        await newRating.save(); // Sauvegarde de l'évaluation
        res.status(201).json({ message: 'Rating submitted successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Fonction pour obtenir les évaluations d'un chauffeur
const getRatingsByDriver = async (req, res) => {
    const { driverId } = req.params;

    try {
        const ratings = await Rating.find({ driverId }).populate('userId', 'name'); // Récupération des évaluations avec les noms des utilisateurs
        res.json(ratings); // Retourner les évaluations
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    submitRating,
    getRatingsByDriver
};
