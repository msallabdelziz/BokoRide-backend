// models/rideModel.js
const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema({
    driver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    departure: { type: String, required: true },
    destination: { type: String, required: true },
    departureTime: { type: Date, required: true },
    availableSeats: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
    // Ajoute d'autres champs si nécessaire
}, { timestamps: true });

module.exports = mongoose.model('Ride', rideSchema);
