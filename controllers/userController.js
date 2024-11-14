// controllers/userController.js
//userController.js : Ce fichier est utilisé pour gérer d'autres opérations liées aux utilisateurs, 
//  telles que la mise à jour, la suppression, et éventuellement la récupération des profils utilisateurs.


const User = require('../models/userModel'); // Assurez-vous d'avoir le bon modèle
const bcrypt = require('bcrypt'); // Pour la gestion des mots de passe

// Fonction pour mettre à jour un utilisateur
const updateUser = async (req, res) => {
    const { name, forename, phoneNumber } = req.body;

    try {
        // Vérification que les champs ne sont pas vides
        if (!name && !forename && !phoneNumber) {
            return res.status(400).json({ message: 'Please provide at least one field to update.' });
        }

        const updatedUser = await User.findByIdAndUpdate(req.user.userId, { name, forename, phoneNumber }, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Fonction pour supprimer un utilisateur ou Chauffeur
const deleteUser = async (req, res) => {
    const { userId } = req.params; // Récupérer l'ID de l'utilisateur à supprimer depuis les paramètres

    try {
        // Vérifier si l'utilisateur à supprimer est un Admin ou un Super Admin
        const userToDelete = await User.findById(userId);
        if (!userToDelete) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (userToDelete.role === 'admin' || userToDelete.role === 'superadmin') {
            return res.status(403).json({ message: 'Cannot delete an admin or superadmin' });
        }

        const deletedUser = await User.findByIdAndDelete(userId);
        res.status(204).send(); // Pas de contenu, juste une confirmation de la suppression
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Fonction pour supprimer un admin ou superadmin
const deleteAdmin = async (req, res) => {
    const { userId } = req.params; // Récupérer l'ID de l'utilisateur à supprimer depuis les paramètres

    try {
        // Vérifier si l'utilisateur à supprimer existe
        const userToDelete = await User.findById(userId);
        if (!userToDelete) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Supprimer l'utilisateur
        await User.findByIdAndDelete(userId);
        res.status(204).send(); // Pas de contenu, juste une confirmation de la suppression
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};



// Fonction pour récupérer le profil utilisateur
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-password'); // Exclure le mot de passe pour des raisons de sécurité
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user); // Retourner les informations de l'utilisateur
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Fonction pour supprimer son propre compte
const deleteOwnAccount = async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.user.userId);
        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(204).send(); // Pas de contenu, juste une confirmation de la suppression
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


// Fonction pour créer un utilisateur avec le rôle spécifié
const createAdminUser = async (req, res) => {
    const { name, forename, email, password, phoneNumber, role } = req.body;

    try {
        console.log('Request body:', req.body);  // Ajouter un log pour voir les données envoyées

        // Vérifier que tous les champs sont remplis
        if (!name || !forename || !email || !password || !phoneNumber || !role) {
            return res.status(400).json({ message: 'Please provide all fields' });
        }

        // Vérifier si un utilisateur existe déjà avec cet email ou numéro de téléphone
        const existingUser = await User.findOne({ $or: [{ email }, { phoneNumber }] });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email or phone number already exists' });
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
            role // Assigner le rôle spécifié
        });

        await newUser.save();
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error('Error creating admin:', error); // Log de l'erreur
        res.status(500).json({ message: 'Server error' });
    }
};

// Fonction pour obtenir tous les utilisateurs
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password'); // Exclure les mots de passe
        res.json(users); // Retourner la liste des utilisateurs
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { 
    updateUser, 
    deleteUser,
    deleteAdmin,
    getUserProfile,
    deleteOwnAccount,
    createAdminUser,
    getAllUsers // Exporter la fonction pour l'utiliser dans les routes
};