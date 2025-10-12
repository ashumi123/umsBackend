// models/Transaction.js
import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  txnId: { type: String, required: true, unique: true },
  date: { type: Date, default: Date.now },
  type: { type: String, enum: ['Deposit', 'Usage'], required: true },
  center: { type: String, required: true }, // Center Code
  amount: { type: Number, required: true },
  reason: { type: String },
  relatedStudent: { type: String } // Optional: for fee transactions
});

const Transaction = mongoose.model('Transaction', transactionSchema);
export default Transaction;