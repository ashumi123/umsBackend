// import express from 'express';
// // const Course = require('../models/Course'); // Import the Mongoose model
// import Course from '../models/Course.js'
// const router = express.Router();

// // GET /api/v1/courses - Get all courses
// router.get('/', async (req, res) => {
//     try {
//         // Fetch all courses from the MongoDB collection
//         const courses = await Course.find({});
//         console.log(`[GET] /api/v1/courses - Returning ${courses.length} courses.`);
//         res.status(200).json(courses);
//     } catch (error) {
//         console.error('Error fetching courses:', error);
//         res.status(500).json({ message: 'Failed to fetch courses.', error: error.message });
//     }
// });

// // POST /api/v1/courses - Add a new course
// router.post('/', async (req, res) => {
//     try {
//         const courseData = req.body;

//         // Mongoose handles validation and checks for required fields
//         const newCourse = new Course(courseData);
        
//         // Save the new course document to MongoDB
//         await newCourse.save();
        
//         console.log(`[POST] /api/v1/courses - Added new course: ${newCourse.name}`);

//         // Respond with the newly created course object
//         res.status(201).json(newCourse);
//     } catch (error) {
//         console.error('Error saving course:', error);
        
//         // Handle specific MongoDB errors (e.g., duplicate key for 'value' field)
//         if (error.code === 11000) {
//             return res.status(409).json({ message: 'Course code already exists. Please use a unique code.' });
//         }
        
//         // Handle validation errors (e.g., required fields missing)
//         if (error.name === 'ValidationError') {
//             const messages = Object.values(error.errors).map(val => val.message);
//             return res.status(400).json({ message: messages.join(' ') });
//         }

//         res.status(500).json({ message: 'Failed to save course.', error: error.message });
//     }
// });

// export default router;

// routes/courseRoutes.js - Handles Course CRUD operations

import express from 'express';
import Course from '../models/Course.js'
const router = express.Router();

// GET /api/v1/courses - Get all courses
router.get('/', async (req, res) => {
    try {
        // Fetch all courses from the MongoDB collection
        const courses = await Course.find({});
        console.log(`[GET] /api/v1/courses - Returning ${courses.length} courses.`);
        res.status(200).json(courses);
    } catch (error) {
        console.error('Error fetching courses:', error);
        res.status(500).json({ message: 'Failed to fetch courses.', error: error.message });
    }
});

// POST /api/v1/courses - Add a new course (now supports subjects in req.body)
router.post('/', async (req, res) => {
    try {
        const courseData = req.body;

        // Mongoose handles validation for CourseSchema, FeeStructureSchema, and the new SubjectSchema
        const newCourse = new Course(courseData);
        
        // Save the new course document to MongoDB
        await newCourse.save();
        
        console.log(`[POST] /api/v1/courses - Added new course: ${newCourse.name}`);

        // Respond with the newly created course object
        res.status(201).json(newCourse);
    } catch (error) {
        console.error('Error saving course:', error);
        
        // Handle specific MongoDB errors (e.g., duplicate key for 'value' field or subjectCode)
        if (error.code === 11000) {
            const field = Object.keys(error.keyValue)[0];
            return res.status(409).json({ message: `${field} already exists. Please use a unique code.` });
        }
        
        // Handle validation errors (e.g., required fields missing in Course or Subject)
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ message: `Validation Error: ${messages.join(' ')}` });
        }

        res.status(500).json({ message: 'Failed to save course.', error: error.message });
    }
});

export default router;
