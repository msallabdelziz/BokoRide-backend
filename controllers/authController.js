// controllers/authController.js
// authController.js : Ce fichier est principalement dédié à la gestion de l'authentification,
// c'est-à-dire l'inscription et la connexion des utilisateurs, ainsi que la génération de tokens JWT.


const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel'); // Importation du modèle utilisateur

// Fonction d'inscription
const registerUser = async (req, res) => {
    const { name, forename, email, password, phoneNumber, vehicleInfo, role,} = req.body;

    try {
        // Vérifier que tous les champs sont remplis
        if (!name || !forename || !password || !phoneNumber) {
            return res.status(400).json({ message: 'Please provide all fields including phone number' });
        }

        // Vérifier si un utilisateur existe déjà
        const existingUser = await User.findOne({ $or: [{ email }, { phoneNumber }] });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email or phone number already exists' });
        }
        
        // Définir le rôle par défaut à "user"
        let userRole = role || 'user'
        
        // Si les informations du véhicule sont fournies, modifier le rôle en "chauffeur"
        if (vehicleInfo) {
            userRole = 'chauffeur';
        }

        // Hashage du mot de passe
        const hashedPassword = await bcrypt.hash(password, 12);

        // Création d'un nouvel utilisateur
        const newUser = new User({
            name,
            forename,
            email,
            password: hashedPassword,
            phoneNumber,
            role: userRole,
            vehicleInfo: vehicleInfo || {}, // Assigner les informations du véhicule, si elles existent
        });

        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
// Fin de la fonction d'inscription

// Fonction de connexion
const loginUser = async (req, res) => {
    const { emailOrPhone, password } = req.body; // Changer le champ à emailOrPhone

    try {
        console.log("Login request body:", req.body);

        // Vérification de l'utilisateur avec l'email ou le numéro de téléphone
        const user = await User.findOne({
            $or: [
                { email: emailOrPhone },
                { phoneNumber: emailOrPhone }
            ] // Rechercher par email ou numéro de téléphone
        });

        console.log("User found:", user);
        if (!user) {
            return res.status(400).json({ message: 'Invalid email/phone number or password' });
        }

        // Vérification du mot de passe
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email/phone number or password' });
        }

        // Génération du token JWT
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        console.log("JWT Token:", token);

        res.json({ token });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: 'Server error' });
    }
};


// Fonction pour compléter les informations du véhicule
const completeVehicleInfo = async (req, res) => {
    const { vehicleInfo } = req.body; // Récupérer les informations du véhicule du corps de la requête

    try {
        // Recherche de l'utilisateur dans la base de données à l'aide de son ID
        const user = await User.findById(req.user.userId);
        
        // Vérification si les informations du véhicule ont été fournies
        if (!vehicleInfo) {
            return res.status(400).json({ message: 'Vehicle information is required' });
        }

        // Vérification des informations nécessaires sur le véhicule
        if (!vehicleInfo.model || !vehicleInfo.licensePlate) {
            return res.status(400).json({ message: 'Model and license plate are required' });
        }

        // Mise à jour des informations sur le véhicule de l'utilisateur
        user.vehicleInfo = vehicleInfo; // Assigner les informations du véhicule à l'utilisateur
        user.role = 'chauffeur'; // Changer le rôle en chauffeur

        await user.save(); // Sauvegarde des modifications
        res.status(200).json({ message: 'Vehicle information saved and role updated to chauffeur' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' }); // Gérer les erreurs serveur
    }
};



module.exports = {
    loginUser, // Exportation de la fonction 
    registerUser, // La fonction d'inscription
    completeVehicleInfo, // Fonction pour les chauffeurs complétent les informations du véhicule
};
