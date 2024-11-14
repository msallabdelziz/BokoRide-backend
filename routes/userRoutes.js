// routes/userRoutes.js

const express = require('express');
const {
    deleteUser,
    updateUser,
    deleteAdmin,
    getUserProfile,
    deleteOwnAccount,
    createAdminUser,
    getAllUsers,
} = require('../controllers/userController');

const {
    loginUser, 
    registerUser,
    completeVehicleInfo, 
} = require('../controllers/authController');

const authenticate = require('../middlewares/authMiddleware');
const authorizeRoles = require('../middlewares/roleMiddleware');

const router = express.Router();

// Route d'inscription (accessible par tout le monde)
router.post('/register', registerUser);

// Route pour que le superadmin puisse créer un utilisateur avec le rôle d'admin
router.post('/create-admin', authenticate, authorizeRoles('superadmin'), createAdminUser);

// Route pour supprimer un admin ou superadmin (accessible uniquement au superadmin)
router.delete('/delete-admin/:userId', authenticate, authorizeRoles('superadmin'), deleteAdmin);

// Route de connexion (accessible par tout le monde)
router.post('/login', loginUser);

// Route pour obtenir le profil d'un utilisateur (doit être authentifié)
router.get('/profile', authenticate, getUserProfile);

// Route pour permettre à un utilisateur de supprimer son propre compte
router.delete('/delete-me', authenticate, deleteOwnAccount);

// Route pour mettre à jour un utilisateur (doit être authentifié)
router.put('/update', authenticate, updateUser);

// Route pour supprimer un utilisateur ou un chauffeur (accessible uniquement aux admins)
router.delete('/delete/:userId', authenticate, authorizeRoles('admin', 'superadmin'), deleteUser);

// Route pour compléter les informations sur le véhicule (doit être authentifié)
router.post('/vehicle-info', authenticate, completeVehicleInfo);

// Route pour obtenir tous les utilisateurs (accessible uniquement aux admins)
router.get('/all-users', authenticate, authorizeRoles('admin', 'superadmin'), getAllUsers);

module.exports = router;
