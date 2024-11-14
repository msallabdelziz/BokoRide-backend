const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('./models/userModel'); // Assurez-vous d'avoir le bon chemin pour ton modèle

// Connexion à MongoDB
mongoose.connect('mongodb://localhost:27017/bokoride')
  .then(() => {
    console.log('Connected to MongoDB');
    createSuperAdmin();
  })
  .catch(err => {
    console.error('Could not connect to MongoDB', err);
  });

async function createSuperAdmin() {
  try {
    // Vérifier si un superadmin existe déjà
    const existingSuperAdmin = await User.findOne({ role: 'superadmin' });
    if (existingSuperAdmin) {
      console.log('Superadmin already exists.');
      return;
    }

    // Hashage du mot de passe
    const hashedPassword = await bcrypt.hash('superadminPassword123', 12);

    // Création du superadmin
    const superAdmin = new User({
      name: 'AZIZ',
      forename: 'Msall',
      email: 'msall.abdelaziz@gmail.com',
      password: 'BokoRide@6725',
      phoneNumber: '0758368844',
      role: 'superadmin'
    });

    

    await superAdmin.save();
    console.log('SuperAdmin created successfully!');
    mongoose.connection.close(); // Fermer la connexion à la DB
  } catch (error) {
    console.error('Error creating superadmin:', error);
    mongoose.connection.close(); // Fermer la connexion à la DB en cas d'erreur
  }
}
