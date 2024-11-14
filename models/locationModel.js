
// models/locationModel.js
const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // L'ID de l'utilisateur
    coordinates: {
        type: [Number],  // [longitude, latitude]
        index: '2dsphere', // Index géospatial pour optimisations
        required: true
    },
    timestamp: { type: Date, default: Date.now }, // Date et heure de la mise à jour de la position
});

const Location = mongoose.model('Location', locationSchema);

module.exports = Location;
