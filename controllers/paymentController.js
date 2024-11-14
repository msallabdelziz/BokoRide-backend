const Transaction = require('../models/transactionModel');
const axios = require('axios');

const createPayment = async (req, res) => {
  const { amount, email, phoneNumber } = req.body;

  try {
    const response = await axios.post(
      'https://api.paytech.sn/v1/transactions', 
      {
        amount,
        email,
        phoneNumber,
        currency: 'XOF',
        callbackUrl: 'https://your-callback-url.com',
        redirectUrl: 'https://your-redirect-url.com',
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.PAYTECH_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const transaction = new Transaction({
      userId: req.user.userId, // ID de l'utilisateur connecté
      amount,
      transactionId: response.data.transaction_id, // ID de la transaction retourné par PayTech
      status: 'pending', // Initialement, la transaction est en attente
      paymentMethod: 'PayTech',
    });

    await transaction.save(); // Sauvegarde de la transaction dans la base de données
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({
      message: 'Erreur lors de la création de la transaction',
      error: error.message,
    });
  }
};

// Webhook pour traiter les notifications de statut de paiement
const paymentWebhook = async (req, res) => {
  const { transactionId, status } = req.body;

  try {
    const transaction = await Transaction.findOne({ transactionId });

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    // Mise à jour du statut de la transaction
    transaction.status = status;
    await transaction.save();

    res.status(200).send('Transaction status updated');
  } catch (error) {
    res.status(500).json({
      message: 'Error processing webhook',
      error: error.message,
    });
  }
};

module.exports = {
  createPayment,
  paymentWebhook,
};
