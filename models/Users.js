// models/User.js - Defines the Mongoose schema for user data

import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true, // Ensures no two users have the same username
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true, // This will store the bcrypt hash
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    adminType:{
        type: String,
        required: true, // This will store the bcrypt hash
    }
});

const User = mongoose.model('User', UserSchema);

export default User;
