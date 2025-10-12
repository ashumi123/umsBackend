// controllers/centerController.js
import Center from '../models/Center.js';
import Student from '../models/Student.js';
import bcrypt from 'bcrypt';
import User from '../models/Users.js';

// @route   GET /api/v1/centers
// @desc    Get all centers with optional filtering
export const getAllCenters = async (req, res) => {
    try {
        const { status } = req.query;
        let query = {};
        if (status && status !== 'All Centers') {
            query.status = status;
        }

        // 1. Fetch all centers based on status filter
        const centers = await Center.find(query).sort({ centerCode: 1 }).lean(); // Use .lean() for plain JS objects

        // 2. Get student count for all centers in one go (more efficient than looping)
        const studentCounts = await Student.aggregate([
            { $group: { _id: '$centerCode', studentsEnrolled: { $sum: 1 } } }
        ]);

        const countMap = new Map();
        studentCounts.forEach(item => {
            countMap.set(item._id, item.studentsEnrolled);
        });

        // 3. Map studentsEnrolled count into the center data
        const finalCenters = centers.map(center => ({
            ...center,
            // Ensure the key name 'studentsEnrolled' matches the frontend column key
            studentsEnrolled: countMap.get(center.centerCode) || 0,
        }));

        res.status(200).json({ success: true, data: finalCenters });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @route   POST /api/v1/centers
// @desc    Create a new center
export const createCenter = async (req, res) => {
    try {
        const existingUser = await User.findOne({ username:req.body.email });
        if (existingUser) {
            return res.status(409).json({ message: 'Username already taken.' });
        }
        const center = await Center.create(req.body);
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.centerCode, salt);
  
        
        // Create and save new user
        const newUser = new User({
            username:req.body.email,
            password: hashedPassword, // Store the hashed password
            adminType:'Center'
        });
  
        await newUser.save();
        res.status(201).json({ success: true, data: center });

    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @route   GET /api/v1/centers/summary
// @desc    Get dashboard summary statistics
export const getCenterSummary = async (req, res) => {
    try {
        const totalCenters = await Center.countDocuments();
        const activeCenters = await Center.countDocuments({ status: 'Active' });
        
        // You would typically calculate this by aggregating students per center,
        // but we'll use a direct count for simplicity here.
        const totalStudents = await Student.countDocuments();
        
        res.status(200).json({
            success: true,
            data: {
                totalCenters,
                activeCenters,
                totalStudents,
                // Wallet balance and course count would come from other controllers/models
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};