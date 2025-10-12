// routes/studentRoutes.js - ADDED PUT route for approval
import express from 'express';
import { 
    getAllStudents, 
    getStudentEnrollmentData,
    getCourseDistribution,
    registerNewStudent,
    approveStudent // <-- NEW IMPORT
} from '../controllers/studentController.js';
import { 
    getStudentsWithMarks, 
    approveCertificate, 
    getCertificateData, 
    getStudentsWithMarksPreview
} from '../controllers/marksController.js';
const router = express.Router();

router.route('/')
    .get(getAllStudents)
    .post(registerNewStudent); 

router.put('/approve/:id', approveStudent); // <-- NEW ROUTE FOR ADMIN ACTION

router.get('/enrollment-data', getStudentEnrollmentData);
router.get('/course-distribution', getCourseDistribution);

router.get('/studentsMarks', getStudentsWithMarks);
router.post('/studentsMarksById', getStudentsWithMarksPreview);

// PATCH approve/unapprove the certificate
router.patch('/approve/:enrollmentNo', approveCertificate);

// GET single student data for certificate download
router.get('/certificate/:enrollmentNo', getCertificateData);

export default router;
