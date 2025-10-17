// models/Student.js - UPDATED for full registration form fields and approval workflow
import mongoose from 'mongoose';

// const SubjectResultSchema = new mongoose.Schema({
//     subjectCode: String,
//     internalMarks: Number,
//     externalMarks: Number,
//     totalMarks: Number, // InternalMarks + ExternalMarks
//     gp: Number, // Grade Point (e.g., 7)
//     earnedCredit: Number, // Credit earned (e.g., 3)
// }, { _id: false });

// const SemesterMarksSchema = new mongoose.Schema({
//     semester: { type: String, required: true },
//     subjects: [SubjectResultSchema],
// }, { _id: false });


const SubjectResultSchema = new mongoose.Schema({
    subjectCode: { type: String, required: true },
    internalMarks: { type: Number, default: 0 }, // Marks Obtained (Internal)
    externalMarks: { type: Number, default: 0 }, // Marks Obtained (External)
    totalMarks: { type: Number, default: 0 }, // internalMarks + externalMarks
    gp: { type: Number, default: 0 }, // Grade Point (e.g., 7)
    earnedCredit: { type: Number, default: 0 }, // Credit earned (e.g., 3)
}, { _id: false });

// 2. Semester Marks Schema
const SemesterMarksSchema = new mongoose.Schema({
    semester: { type: String, required: true },
    subjects: [SubjectResultSchema],
}, { _id: false });


const SubjectSchema = new mongoose.Schema({
    subjectName: { 
        type: String, 
        
    },
    subjectCode: { 
        type: String, 
       
    },
    credit: { // Credit points for the subject
        type: Number,
    },
    internalMax: { // Max marks for internal assessment (e.g., 40)
        type: Number,
       
    },
    externalMax: { // Max marks for external assessment (e.g., 60)
        type: Number,
    },
    internalObtain:{
        type:Number,
        default:0
    },
    externalObtain:{
        type:Number,
        default:0
    }
    // The total max marks is derived from internalMax + externalMax
}, { _id: false }); 
const previousQualificationSchema = new mongoose.Schema({
    examination: { type: String },
    totalMarks: { type: String },
    boardUniversity: { type: String },
    percentageCGPA: { type: String },
    subjects: { type: String },
    documentPath: { type: String }, // NEW: Stores the path/URL to the qualification document
    documentStatus: { type: String, enum: ['Uploaded', 'Missing', 'Verified'], default: 'Uploaded' } 
}, { _id: false });

const studentSchema = new mongoose.Schema({
    // Core Identifier
    regNo: { type: String, required: true, unique: true },

    // 1. Personal Details
    nameCandidate: { type: String, required: true },
    nameFather: { type: String, required: true },
    nameMother: { type: String },
    dob: { type: Date },
    gender: { type: String, enum: ['Male', 'Female', 'Other'] },
    category: { type: String },
    aadharNumber: { type: String, unique: false, default:'' },
    designation: { type: String },
    photoPath: { type: String },

    // 2. Communication Details
    contactNumber: { type: String },
    emailAddress: { type: String, required: true, unique: true },
    fatherContact: { type: String },
    motherContact: { type: String },
    address: { type: String },
    city: { type: String },
    state: { type: String },
    pinCode: { type: String },

    // 3. Previous Qualifications
    previousQualifications: [previousQualificationSchema],
    programSubjects: [SubjectSchema],

    // 4. Programme Details
    course: { type: String, required: true },
    modeOfStudy: { type: String, enum: ['Regular', 'ODL', 'Online'] },
    admissionType: { type: String },
    academicSession: { type: String },

    // 5. Fee Details (Initial enrollment data)
    registrationFee: { type: Number, default: 0 },
    admissionFee: { type: Number, default: 0 },
    tuitionFee: { type: Number, default: 0 },
    totalFeesPaid: { type: Number, default: 0 },
    
    // 6. NEW FIELDS FOR WORKFLOW
    registeredBy: { type: String, required: true }, // ID of the Admin/Center user who created the record
    paymentStatus: { 
        type: String, 
        enum: ['Pending', 'Paid', 'Refunded'], 
        default: 'Pending' 
    },
    // Status now tracks the administrative approval required after registration/payment
    approvalStatus: { 
        type: String, 
        enum: ['Pending', 'Approved', 'Rejected'], 
        default: 'Pending' 
    },
    
    // Existing Application Status Fields
    centerCode: { type: String, required: true },
    status: { type: String, enum: ['Registered', 'Active', 'Graduated', 'Hold'], default: 'Registered' },
    regDate: { type: Date, default: Date.now },



    enrollmentNo: { type: String, unique: true },
    program: { type: String, required: true }, // Corresponds to Course.value
    batch: String,
    isApproved: Boolean,
    marks: { 
        type: Map,
        of: SemesterMarksSchema
    },
    // Final metrics are typically stored on the student model after calculation
    finalCGPA: Number,
    overallPercentage: Number,
    result: String,
}, { timestamps: true });


const Student = mongoose.model('Student', studentSchema);
export default Student;
