
// controllers/locationController.js
const Location = require('../models/locationModel');

const setLocation = async (req, res) => {
    const { coordinates } = req.body; // Récupérer les coordonnées (longitude, latitude)

    try {
        const location = new Location({
            userId: req.user.userId, // L'ID de l'utilisateur authentifié
            coordinates
        });

        await location.save();
        res.status(201).json({ message: 'Location saved successfully', data: location });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Récupérer la localisation pour un utilisateur
const getLocation = async (req, res) => {
    const { userId } = req.params; // ID de l'utilisateur pour lequel on souhaite récupérer les données

    try {
        // Si l'utilisateur est un admin ou superadmin, on récupère la localisation de l'utilisateur spécifique
        if (req.user.role !== 'admin' && req.user.role !== 'superadmin' && req.user.userId !== userId) {
            return res.status(403).json({ message: 'Access denied.' });
        }

        const location = await Location.find({ userId }).sort({ timestamp: -1 }); // Récupérer la dernière localisation de l'utilisateur
        if (!location) {
            return res.status(404).json({ message: 'Location not found' });
        }

        res.json(location);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    setLocation,
    getLocation
};
