// models/transactionModel.js

const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true }, // Montant de la transaction
  transactionId: { type: String, required: true }, // ID unique de la transaction
  status: { type: String, enum: ['pending', 'completed', 'failed'], required: true }, // Statut de la transaction
  paymentMethod: { type: String, required: true }, // Méthode de paiement (par exemple : PayTech)
  timestamp: { type: Date, default: Date.now }, // Date et heure de la transaction
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
