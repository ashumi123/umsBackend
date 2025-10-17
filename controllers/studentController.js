// controllers/studentController.js
import Student from '../models/Student.js';
import mongoose from 'mongoose';
import Course from '../models/Course.js';


const CounterSchema = new mongoose.Schema({
    _id: { type: String, required: true }, // Identifier for the counter (e.g., 'enrollment_seq')
    sequence_value: { type: Number, default: 0 } // The current sequence number
});

const Counter = mongoose.model('Counter', CounterSchema);
// @route   GET /api/v1/students
// @desc    Get all students with filtering based on status
export const getAllStudents = async (req, res) => {
    try {
        const { status } = req.query;
        let query = {};

        // Filter by student status if provided (e.g., 'Active', 'Registered', 'Graduated')
        if (status && status !== 'All Students') {
            query.status = status;
        }

        // Fetch students and sort by registration number
        const students = await Student.find(query).sort({ regNo: 1 });

        // Map the results to match the frontend DataTable columns exactly
        const formattedStudents = students.map(s => ({
            _id: s._id,
            regNo: s.regNo,
            name: s.name,
            nameCandidate: s.nameCandidate,
            course: s.course,
            centerCode: s.centerCode,
            status: s.status,
            regDate: s.regDate.toISOString().split('T')[0], // Format date as YYYY-MM-DD
            approvalStatus: s.approvalStatus,
            paymentStatus: s.paymentStatus
            // If you need actions like 'Edit', you'd include the _id here
        }));

        res.status(200).json({ success: true, data: formattedStudents });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @route   GET /api/v1/students/enrollment-data
// @desc    Get data for the Monthly Enrollment Dashboard chart
export const getStudentEnrollmentData = async (req, res) => {
    try {
        // --- Mock Aggregation Logic for Dashboard Chart ---
        // In a real application, you'd use MongoDB aggregation ($group by month/year)

        const enrollmentData = [
            { name: 'Jan', Students: 400 }, { name: 'Feb', Students: 300 }, { name: 'Mar', Students: 600 },
            { name: 'Apr', Students: 450 }, { name: 'May', Students: 700 }, { name: 'Jun', Students: 500 },
            { name: 'Jul', Students: 800 }, { name: 'Aug', Students: 950 }, { name: 'Sep', Students: 1000 },
            { name: 'Oct', Students: 1200 }, { name: 'Nov', Students: 1100 }, { name: 'Dec', Students: 1300 },
        ];

        res.status(200).json({ success: true, data: enrollmentData });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @route   GET /api/v1/students/course-distribution
// @desc    Get data for the Course Distribution Pie Chart
export const getCourseDistribution = async (req, res) => {
    try {
        // --- Mock Aggregation Logic for Dashboard Chart ---
        // Real logic would be: Student.aggregate([ { $group: { _id: "$course", count: { $sum: 1 } } } ])

        const distributionData = [
            { name: 'MBA', value: 400 },
            { name: 'BBA', value: 300 },
            { name: 'MCA', value: 300 },
            { name: 'M.Com', value: 200 },
            { name: 'BCA', value: 150 },
        ];

        res.status(200).json({ success: true, data: distributionData });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


/**
 * Helper function to generate a unique Registration Number
 * In a real system, this would be a sequence based on Center/Year/Course
 */





const generateRegNo = async (centerCode) => {
    // Find the count of existing students to create the next number
    const count = await Student.countDocuments({ centerCode: centerCode });
    const nextNumber = (count + 1).toString().padStart(4, '0');
    return `REG-${centerCode}-${new Date().getFullYear()}-${nextNumber}`;
};


const generateEnrollmentNo = async (centerCode, batch) => {
    // 1. Define the counter ID for the current center/batch combination
    // This allows sequences to restart (or be managed) per center/batch.
    const counterId = `enrollment_${centerCode}_${batch}`;

    // 2. Find and atomically increment the sequence value
    const counter = await Counter.findByIdAndUpdate(
        counterId,
        { $inc: { sequence_value: 1 } },
        { new: true, upsert: true } // Creates if it doesn't exist, returns the updated doc
    );

    // 3. Format the sequence number to be 4 digits (e.g., 1 -> '0001')
    const sequence = String(counter.sequence_value).padStart(4, '0');

    // 4. Extract the last two digits of the batch year (e.g., '2023' -> '23')
    const yearDigits = String(batch).slice(-2);

    // 5. Construct the final enrollment number
    // Using a 'T' prefix like your example, followed by the center code, year, and sequence
    const enrollmentNo = `T${centerCode}${yearDigits}${sequence}`;

    // Example format using the structure T3515210198 from the document:
    // If we assume '5' is a program ID, you'd need to fetch or calculate it here. 
    // For simplicity, we stick to inputs: T[CenterCode][Year][Sequence]

    return enrollmentNo;
};

// @route   POST /api/v1/students
// @desc    Register a new student from the detailed form
// export const registerNewStudent = async (req, res) => {
//     try {
//         const studentData = req.body;
//         // NOTE: In a real app, 'req.user.id' would come from auth middleware
//         const userId = 'CenterUser123'; // MOCK USER ID for now. Replace with actual auth data.

//         if (!studentData.nameCandidate || !studentData.emailAddress || !studentData.course || !studentData.centerCode) {
//             return res.status(400).json({ success: false, message: 'Missing required fields: Name, Email, Course, and Center Code are mandatory.' });
//         }
//         const enRolemntNumber= await generateEnrollmentNo(studentData.centerCode,studentData.academicSession)

//         const newRegNo = await generateRegNo(studentData.centerCode);
//         const { course, ...rest } = studentData;
//         console.log('course',course);
//         // When a center user registers a student, the status is PENDING APPROVAL.
//         const newStudent = new Student({
//             regNo: newRegNo,
//             ...studentData,
//             program: course, // Map the incoming 'course' field to the schema's 'programCode'

//             registeredBy: userId, // Track who registered the student
//             // The student is registered, payment is assumed to be handled by the center, 
//             // but final approval is pending from Admin.
//             paymentStatus: studentData?.totalFeesPaid > 0 ? 'Paid' : 'Pending', // Assuming payment is made by the center during registration
//             approvalStatus: 'Pending', 
//             status: 'Registered', 
//             regDate: Date.now(),
//             previousQualifications: studentData.previousQualifications || [],
//             enrollmentNo:enRolemntNumber
//         });

//         const student = await newStudent.save();

//         res.status(201).json({ 
//             success: true, 
//             message: 'Student registration submitted for Admin approval.',
//             data: student 
//         });

//     } catch (error) {
//         if (error.code === 11000) {
//             const field = Object.keys(error.keyValue)[0];
//             return res.status(400).json({ success: false, message: `Duplicate entry for ${field}: ${error.keyValue[field]} already exists.` });
//         }
//         console.error('Registration Error:', error);
//         res.status(500).json({ success: false, message: 'Server error during student registration.', error: error.message });
//     }
// };

export const registerNewStudent = async (req, res) => {

    // NOTE: In a real app, 'req.user.id' would come from auth middleware
    const userId = 'CenterUser123';
    const studentData = req.body;

    // Check mandatory fields for core data and enrollment generation
    if (!studentData.nameCandidate || !studentData.emailAddress || !studentData.programCode || !studentData.centerCode || !studentData.batch) {
        return res.status(400).json({ success: false, message: 'Missing required fields: Name, Email, Program Code, Center Code, and Batch are mandatory.' });
    }

    try {
        // --- 1. GENERATE UNIQUE IDENTIFIERS ---
        // const enrollmentNo = await generateEnrollmentNo(studentData.centerCode, studentData.batch);
        const newRegNo = await generateRegNo(studentData.centerCode);

        // --- 2. PREPARE DATA ---

        const qualifications = studentData.previousQualifications || [];
        const paymentStatus = studentData.totalFeesPaid > 0 ? 'Paid' : 'Pending';

        // --- 3. CREATE AND SAVE STUDENT RECORD ---
        const newStudent = new Student({
            ...studentData,
            regNo: newRegNo,
            course: studentData.programCode,
            enrollmentNo: studentData.enrollmentNo,
            programCode: studentData.programCode,
            batch: studentData.batch,
            previousQualifications: qualifications, // Save the dynamic qualifications array including the documentPath

            registeredBy: userId,
            paymentStatus: paymentStatus,
            approvalStatus: 'Pending',
            status: 'Registered',
            regDate: Date.now(),
        });

        const student = await newStudent.save();

        res.status(201).json({
            success: true,
            message: 'Student registration submitted for Admin approval with auto-generated IDs.',
            data: student
        });

    } catch (error) {
        console.log('error',error);
        if (error.code === 11000) {
            const field = Object.keys(error.keyValue)[0];
            return res.status(400).json({ success: false, message: `Duplicate entry for ${field}: ${error.keyValue[field]} already exists.` });
        }
        console.error('Registration Error:', error);
        res.status(500).json({ success: false, message: 'Server error during student registration.', error: error.message });
    }
};

// @route   PUT /api/v1/students/approve/:id
// @desc    Admin approves or rejects a student registration
export const approveStudent = async (req, res) => {
    try {
        const { id } = req.params;
        const { action } = req.body; // 'approve' or 'reject'

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: 'Invalid Student ID.' });
        }

        let updateFields = {};
        let responseMessage = '';

        if (action === 'approve') {
            updateFields = {
                approvalStatus: 'Approved',
                status: 'Active',
                paymentStatus: 'Paid' // Final confirmation of full payment
            };
            responseMessage = 'Student registration and payment approved.';
        } else if (action === 'reject') {
            updateFields = {
                approvalStatus: 'Rejected',
                status: 'Hold',
                paymentStatus: 'Pending' // Reject means payment is not recognized as complete/valid
            };
            responseMessage = 'Student registration and payment rejected.';
        } else {
            return res.status(400).json({ success: false, message: 'Invalid action specified. Must be "approve" or "reject".' });
        }

        const student = await Student.findByIdAndUpdate(id, updateFields, { new: true });

        if (!student) {
            return res.status(404).json({ success: false, message: 'Student not found.' });
        }

        res.status(200).json({
            success: true,
            message: responseMessage,
            data: student
        });

    } catch (error) {
        console.error('Approval Error:', error);
        res.status(500).json({ success: false, message: 'Server error during student approval.', error: error.message });
    }
};

