// // const mongoose = require('mongoose');
// import mongoose from "mongoose";
// // Schema for the individual fee components
// const FeeStructureSchema = new mongoose.Schema({
//     registrationFee: { type: Number, required: true, default: 0 },
//     admissionFee: { type: Number, required: true, default: 0 },
//     tuitionFee: { type: Number, required: true, default: 0 },
//     enrollmentFee: { type: Number, required: true, default: 0 },
// }, { _id: false }); // We don't need an ID for this nested subdocument

// // Main Course Schema
// const CourseSchema = new mongoose.Schema({
//     // Full name of the course
//     name: { 
//         type: String, 
//         required: [true, 'Course name is required.'], 
//         trim: true 
//     },
//     // Short code (e.g., BCA, MBA) - must be unique
//     value: { 
//         type: String, 
//         required: [true, 'Course code is required.'], 
//         unique: true, 
//         uppercase: true 
//     },
//     // Nested fee structure
//     feeStructure: { 
//         type: FeeStructureSchema, 
//         required: true 
//     },
// }, { 
//     timestamps: true 
// });

// const Course = mongoose.model('Course', CourseSchema);
// export default Course;

import mongoose from "mongoose";

// Schema for the individual fee components
const FeeStructureSchema = new mongoose.Schema({
    registrationFee: { type: Number, required: true, default: 0 },
    admissionFee: { type: Number, required: true, default: 0 },
    tuitionFee: { type: Number, required: true, default: 0 },
    enrollmentFee: { type: Number, required: true, default: 0 },
}, { _id: false }); // We don't need an ID for this nested subdocument

// --- NEW SUBJECT SCHEMA ---
const SubjectSchema = new mongoose.Schema({
    subjectName: { 
        type: String, 
        required: [true, 'Subject name is required.'], 
        trim: true 
    },
    subjectCode: { 
        type: String, 
        required: [true, 'Subject code is required.'], 
        // Note: Subject code uniqueness is typically enforced per course, 
        // but often across the system for simplicity. Keep unique for now.
        uppercase: true 
    },
    credit: { // Credit points for the subject
        type: Number,
        required: [true, 'Subject credit is required.'],
    },
    internalMax: { // Max marks for internal assessment (e.g., 40)
        type: Number,
        required: [true, 'Internal maximum marks are required.'],
    },
    externalMax: { // Max marks for external assessment (e.g., 60)
        type: Number,
        required: [true, 'External maximum marks are required.'],
    },
    // The total max marks is derived from internalMax + externalMax
}, { _id: false }); 


// Main Course Schema
const CourseSchema = new mongoose.Schema({
    // Full name of the course
    name: { 
        type: String, 
        required: [true, 'Course name is required.'], 
        trim: true 
    },
    // Short code (e.g., BCA, MBA) - must be unique
    value: { 
        type: String, 
        required: [true, 'Course code is required.'], 
        unique: true, 
        uppercase: true 
    },
    // Nested fee structure
    feeStructure: { 
        type: FeeStructureSchema, 
        required: true 
    },
    // Array of subjects under this course
    subjects: {
        type: [SubjectSchema],
        default: [],
    },
    school:{
        type: String, 
        required: [true, 'School is required.'], 
    },
    department:{
        type: String, 
        required: [true, 'School is required.'], 
    }
}, { 
    timestamps: true 
});

const Course = mongoose.model('Course', CourseSchema);
export default Course;
