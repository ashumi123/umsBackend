// server.js - Main Express application and MongoDB connection
import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import User from './models/User.js'; // Import the User model

import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

// --- Middleware ---
app.use(cors({
    origin: '*', // Allow all origins for simple testing (use specific URL in production)
    methods: ['GET', 'POST'],
}));
app.use(express.json()); // To parse incoming JSON payloads

// --- MongoDB Connection ---
mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB connected successfully!'))
    .catch(err => {
        console.error('MongoDB connection error:', err.message);
        process.exit(1); // Exit process if connection fails
    });

// --- API Routes ---



// --- Start Server ---
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
