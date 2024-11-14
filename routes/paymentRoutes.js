//  routes/paymentRoutes.js 

const express = require('express');
const { createPayment, paymentWebhook } = require('../controllers/paymentController');
const authenticate = require('../middlewares/authMiddleware');
const authorizeRoles = require('../middlewares/roleMiddleware');

const router = express.Router();

// Route pour créer une transaction
router.post('/create-payment', authenticate, createPayment);

// Webhook pour mettre à jour le statut de la transaction
router.post('/payment-webhook', paymentWebhook);

// Route pour obtenir l'historique des transactions d'un utilisateur
router.get('/transactions', authenticate, async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user.userId })
      .select('-userId')  // Ne pas retourner les IDs des utilisateurs
      .sort({ timestamp: -1 }); // Tri par date de la plus récente à la plus ancienne

    res.json(transactions);
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching transactions',
      error: error.message,
    });
  }
});

module.exports = router;
