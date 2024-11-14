// models/userModel.js

const mongoose = require('mongoose');
const ROLES = require('../config/roles'); // Assurez-vous que le chemin est correct
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: { type: String, required: true },
    forename:{ type: String, required: false },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phoneNumber: { type: String, required: true, unique: true }, // Numéro unique
    role: { type: String, required: true, default: ROLES.USER }, //Rôle par défaut en utilisant la constante

    vehicleInfo: {
        model: { type: String, required: function() { return this.role === ROLES.CHAUFFEUR; } }, // Requis pour les chauffeurs
        licensePlate: { type: String, required: function() { return this.role === ROLES.CHAUFFEUR; } }, // Requis pour les chauffeurs
        insurance: { type: String, required: function() { return this.role === ROLES.CHAUFFEUR; } }, // Document d'assurance
        registration: { type: String, required: function() { return this.role === ROLES.CHAUFFEUR; } }, // Carte grise
        technicalCheck: { type: String, required: function() { return this.role === ROLES.CHAUFFEUR; } }, // Contrôle technique
        images: {
            front: { type: String },  // URL ou chemin vers l'image avant
            back: { type: String },   // URL ou chemin vers l'image arrière
            side: { type: String },   // URL ou chemin vers l'image latérale
            interior: { type: String } // URL ou chemin vers l'image intérieure
        },
        verified: { type: Boolean, default: false }
    }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;
