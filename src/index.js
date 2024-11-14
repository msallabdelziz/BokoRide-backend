// src/index.js
require('dotenv').config();

const express = require('express');
const http = require('http'); // Importer le module http
const mongoose = require('mongoose');
const userRoutes = require('../routes/userRoutes'); // Assurez-vous que le chemin est correct
const rideRoutes = require('../routes/rideRoutes'); // Assurez-vous que le chemin est correct
const ratingRoutes = require('../routes/ratingRoutes');
const chatRoutes = require('../routes/chatRoutes'); // Importer les routes de chat
const locationRoutes = require('../routes/locationRoutes');
const initializeSocket = require('./socket'); // Importer la configuration de Socket.IO


const app = express();
const port = process.env.PORT || 3000;

// Vérification de MONGODB_URI
// console.log('MONGODB_URI:', process.env.MONGODB_URI); //

// Middleware pour servir les fichiers statiques
app.use(express.static('public')); // Serve le dossier public
// Middleware pour parser le JSON
app.use(express.json());

// Routes
app.use('/api/users', userRoutes); // Utiliser les routes des utilisateurs
app.use('/api/rides', rideRoutes); // Utiliser les routes des trajets
app.use('/api/ratings', ratingRoutes);// Ajout des routes de notation
app.use('/api/chat', chatRoutes); // Ajouter les routes de chat
app.use('/api/locations', locationRoutes); //Routes de géolocalisation


// Route par défaut
app.get('/', (req, res) => {
    res.send('Welcome to the BokoRIDE\'s API!'); // Message d'accueil
});

// Connexion à la base de données
mongoose.connect(process.env.MONGODB_URI)
.then(() => {
    console.log('Connected to MongoDB');
})
.catch(err => {
    console.error('Could not connect to MongoDB', err);
});

// Création du serveur HTTP
const server = http.createServer(app);
// Initialiser Socket.IO
initializeSocket(server);


// Démarrer le serveur
server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
