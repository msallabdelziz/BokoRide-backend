const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('./models/userModel'); // Assurez-vous que le chemin est correct

// Connexion à MongoDB
mongoose.connect('mongodb://localhost:27017/bokoride')
  .then(() => {
    console.log("Connected to MongoDB");
    hashPasswords();
  })
  .catch((err) => {
    console.error("Could not connect to MongoDB", err);
  });

async function hashPasswords() {
  const users = await User.find(); // Récupère tous les utilisateurs

  for (const user of users) {
    if (user.password) {
      // Hachage du mot de passe
      const hashedPassword = await bcrypt.hash(user.password, 12);
      user.password = hashedPassword;
      await user.save();
      console.log(`Password for ${user.name} hashed successfully.`);
    }
  }

  console.log("All passwords have been hashed.");
  mongoose.disconnect(); // Déconnexion une fois que tout est terminé
}
