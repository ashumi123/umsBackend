// models/Center.js
import mongoose from 'mongoose';

const centerSchema = new mongoose.Schema({
  centerCode: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobile: { type: String },
  city: { type: String, required: true },
  address: { type: String },
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  studentsEnrolled: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

const Center = mongoose.model('Center', centerSchema);
export default Center;