import Student from '../models/Student.js';
import mongoose from 'mongoose';
import Course from '../models/Course.js'

/**
 * CORE MARK CALCULATION ALGORITHM
 * * This universal function processes the raw marks data stored in the Student model
 * and calculates the final metrics (CGPA, Percentage, Result).
 * * @param {object} student - The Mongoose student document.
 * @returns {object} - Calculated performance metrics: { finalCGPA, overallPercentage, result }.
 */
// const calculateStudentPerformance = (student) => {
//     let totalCreditPoint = 0;
//     let totalEarnedCredit = 0;
//     let totalMaxMarks = 0;
//     let totalMarksObtained = 0;

//     // --- Configuration based on B.Com example ---
//     // We assume total max marks per subject is 100 for consistency 
//     // (e.g., 40 Internal + 60 External, regardless of the course like BCA, BA, or BCom).
//     const SUBJECT_MAX_MARKS = 100; 

//     // Iterate through all semesters stored in the marks Map
//     if (student.marks) {
//         // Mongoose Map iteration: Array.from(map.entries())
//         Array.from(student.marks.entries()).forEach(([, semesterData]) => {
//             if (semesterData && semesterData.subjects) {
//                 semesterData.subjects.forEach(subject => {
//                     // Ensure the subject has valid data (credit, GP, and marks obtained)
//                     if (subject.credit && subject.gp && subject.totalMarks) {
//                         // 1. Calculate Grade Point Total (Credit * GP)
//                         totalCreditPoint += subject.credit * subject.gp;
                        
//                         // 2. Accumulate Earned Credit
//                         // Earned credit is crucial for CGPA calculation. It should be 0 if the student failed.
//                         totalEarnedCredit += subject.earnedCredit || 0; 
                        
//                         // 3. Accumulate Marks
//                         totalMarksObtained += subject.totalMarks;
//                         totalMaxMarks += SUBJECT_MAX_MARKS;
//                     }
//                 });
//             }
//         });
//     }

//     // --- Final Metrics Calculation ---
//     const overallCGPA = totalEarnedCredit > 0 ? (totalCreditPoint / totalEarnedCredit) : 0;
//     const overallPercentage = totalMaxMarks > 0 ? (totalMarksObtained / totalMaxMarks) * 100 : 0;
    
//     return {
//         // Round to two decimal places
//         finalCGPA: parseFloat(overallCGPA.toFixed(2)),
//         overallPercentage: parseFloat(overallPercentage.toFixed(2)),
//         // Universal Pass Rule: Assuming a CGPA of 5.0 or higher is required for 'Passed'
//         result: overallCGPA >= 5.0 ? 'Passed' : 'Failed', 
//     };
// };

// // @route   GET /api/v1/marks/students
// // @desc    Get all students with calculated marks for the Admin marks table
// export const getStudentsWithMarks = async (req, res) => {
//     try {
//         const students = await Student.find({ status: 'Active' })
//             .select('nameCandidate enrollmentNo program batch isApproved marks finalCGPA overallPercentage result');
        
//         // Apply the calculation algorithm before sending to the frontend
//         const studentsWithPerformance = students.map(student => {
//             const performance = calculateStudentPerformance(student);
//             return {
//                 ...student.toObject(),
//                 finalCGPA: performance.finalCGPA,
//                 overallPercentage: performance.overallPercentage,
//                 result: performance.result
//             };
//         });

//         res.status(200).json({ success: true, data: studentsWithPerformance });
//     } catch (error) {
//         console.error('Error fetching students with marks:', error);
//         res.status(500).json({ success: false, message: 'Server error fetching student marks data.' });
//     }
// };

// const calculateStudentPerformance = (student) => {
//     let totalCreditPoint = 0;
//     let totalEarnedCredit = 0;
//     let totalMaxMarks = 0;
//     let totalMarksObtained = 0;

//     // Iterate through all semesters stored in the marks Map
//     if (student.marks) {
//         // Mongoose Map iteration: Array.from(map.entries())
//         Array.from(student.marks.entries()).forEach(([, semesterData]) => {
            
//             // Use optional chaining and nullish coalescing to safely access subjects.
//             // If semesterData or subjects is missing/null, subjectsToProcess will be an empty array.
//             const subjectsToProcess = semesterData?.subjects ?? [];
            
//             subjectsToProcess.forEach(subject => {
                    
//                     // Basic check for minimum required fields
//                     if (subject.credit && subject.gp && subject.totalMarks !== undefined) {
                        
//                         // 1. Calculate Grade Point Total (Credit * GP)
//                         totalCreditPoint += subject.credit * subject.gp;
                        
//                         // 2. Accumulate Earned Credit
//                         // This is the correct denominator for CGPA calculation.
//                         totalEarnedCredit += subject.earnedCredit || 0; 
                        
//                         // 3. Accumulate Marks Obtained
//                         totalMarksObtained += subject.totalMarks;
                        
//                         // 4. *** MODIFICATION: Dynamically calculate Total Max Marks ***
//                         // Use the new internalMax and externalMax fields for accurate percentage.
//                         const subjectMaxMarks = (subject.internalMax || 40) + (subject.externalMax || 60);
//                         totalMaxMarks += subjectMaxMarks;
//                     }
//                 });
//         });
//     }

//     // --- Final Metrics Calculation ---
//     // CGPA is calculated as Total Credit Points / Total Earned Credit
//     const overallCGPA = totalEarnedCredit > 0 ? (totalCreditPoint / totalEarnedCredit) : 0;
    
//     // Percentage is calculated as Total Marks Obtained / Total Max Marks
//     const overallPercentage = totalMaxMarks > 0 ? (totalMarksObtained / totalMaxMarks) * 100 : 0;
    
//     return {
//         // Round to two decimal places
//         finalCGPA: parseFloat(overallCGPA.toFixed(2)),
//         overallPercentage: parseFloat(overallPercentage.toFixed(2)),
//         // Universal Pass Rule: Assuming a CGPA of 5.0 or higher is required for 'Passed'
//         result: overallCGPA >= 5.0 ? 'Passed' : 'Failed', 
//     };
// };

// /**
//  * @route   GET /api/v1/marks/students
//  * @desc    Get all students with calculated marks for the Admin marks table
//  * @returns {object} - Success response with student data including calculated performance.
//  */
// export const getStudentsWithMarks = async (req, res) => {
//     try {
//         const students = await Student.find({ status: 'Active' })
//             .select('nameCandidate enrollmentNo program batch isApproved marks finalCGPA overallPercentage result');
        
//         // Apply the calculation algorithm before sending to the frontend
//         const studentsWithPerformance = students.map(student => {
//             const performance = calculateStudentPerformance(student);
//             return {
//                 // Using .toObject() is good practice for Mongoose objects
//                 ...student.toObject(),
//                 finalCGPA: performance.finalCGPA,
//                 overallPercentage: performance.overallPercentage,
//                 result: performance.result,
//                 subjects:[]
//             };
//         });

//         res.status(200).json({ success: true, data: studentsWithPerformance });
//     } catch (error) {
//         console.error('Error fetching students with marks:', error);
//         res.status(500).json({ success: false, message: 'Server error fetching student marks data.' });
//     }
// };




// Assuming Student and Course models are imported here in a real application
// import Student from '../models/studentModel.js';
// import Course from '../models/courseModel.js'; 

// --- Mock Model Definitions for Completeness ---
// In a real application, these would be imported from model files.




// --- END Mock Model Definitions ---


/**
 * @function mergeAndCalculatePerformance
 * @desc Merges student's obtained marks with course subject definitions to
 * calculate overall CGPA and Percentage.
 * @param {Map<String, Object>} studentMarksMap - Student's marks map (key: semesterName).
 * @param {Array<Object>} courseSubjects - Subject definitions from the Course model.
 * @returns {Object} {finalCGPA, overallPercentage, result, detailedSubjects}
 */
export const mergeAndCalculatePerformance = (studentMarksMap, courseSubjects) => {
    let totalCreditPoint = 0; // Σ (Credit * GP)
    let totalEarnedCredit = 0; // Σ Earned Credit
    let totalMaxMarks = 0; // Σ Max Total Marks
    let totalMarksObtained = 0; // Σ Total Marks Obtained
    const detailedSubjects = [];
    
    // Create a quick lookup map for subject definitions (Code -> Def)
    const subjectDefMap = new Map();
    courseSubjects.forEach(def => {
        // Ensure both max marks fields exist for a valid definition
        if (def.internalMax !== undefined && def.externalMax !== undefined) {
            subjectDefMap.set(def.subjectCode, {
                ...def,
                maxTotalMarks: def.internalMax + def.externalMax // Pre-calculate total max
            });
        }
    });

    // Iterate through all semesters recorded for the student
    Array.from(studentMarksMap.entries()).forEach(([semesterName, semesterData]) => {
        const subjectResults = semesterData?.subjects ?? [];
        
        subjectResults.forEach(result => {
            console.log('result===>',result);

            const subjectDef = subjectDefMap.get(result.subjectCode);
            console.log('subjectDef===>',subjectDef);
            // Check for valid definition and valid result data (GP and Earned Credit must be defined)
            // if (subjectDef && result.credit !== undefined ) {
            //     console.log('subjectDef.subjectName',subjectDef);
            //     // 1. Accumulate Credit Point Total (Credit * GP)
            //     // Note: We use subjectDef.credit (max credit) for CGPA calculation
            //     totalCreditPoint += subjectDef.credit * 1;
                
            //     // 2. Accumulate Earned Credit (The credit the student actually earned, typically equals subjectDef.credit on pass)
            //     totalEarnedCredit += result.earnedCredit; 
                
            //     // 3. Accumulate Marks Obtained and Total Max Marks
            //     totalMarksObtained += result.totalMarks;
            //     totalMaxMarks += subjectDef.maxTotalMarks;

            //     // Build a detailed subject record for the client
            //     detailedSubjects.push({
            //         semester: semesterName,
            //         subjectName: subjectDef.subjectName,
            //         subjectCode: subjectDef.subjectCode,
            //         credit: subjectDef.credit, // Max Credit
            //         maxMarks: subjectDef.maxTotalMarks,
            //         internalMax: subjectDef.internalMax,
            //         externalMax: subjectDef.externalMax,
            //         internalMarksObtained: result.internalMarks, // New field for clarity
            //         externalMarksObtained: result.externalMarks, // New field for clarity
            //         totalMarksObtained: result.totalMarks,
            //         gp: result?.gp,
            //         earnedCredit: result.earnedCredit,
            //     });
            // } 
            if (subjectDef ) {
                // Determine maxTotalMarks from the internal and external max marks
                // This accounts for subjectDef being a Mongoose subdocument or a plain object.
                const maxTotalMarks = subjectDef._doc.internalMax + subjectDef._doc.externalMax;
            
                console.log('subjectDef.subjectName', subjectDef?._doc?.subjectName);
            
                // 1. Accumulate Credit Point Total (Credit * GP)
                // Note: We use subjectDef.credit (max credit) for CGPA calculation.
                // Assuming GP is 1 for totalCreditPoint calculation (as in original code), 
                // but this is often Credit * GradePoint, so check your original GP calculation logic.
                // Sticking to original: totalCreditPoint += subjectDef.credit * 1;
                totalCreditPoint += [subjectDef?._doc?.credit?subjectDef?._doc?.credit:1] * (result.gp !== undefined ? result.gp : 1); // Use GP if available, otherwise 1 (as per original logic's intent, but safer to use GP)
            
                // 2. Accumulate Earned Credit (The credit the student actually earned, typically equals subjectDef.credit on pass)
                totalEarnedCredit += result.earnedCredit;
            
                // 3. Accumulate Marks Obtained and Total Max Marks
                totalMarksObtained += result.totalMarks;
                totalMaxMarks += maxTotalMarks; // Use the explicitly calculated value
            
                // Build a detailed subject record for the client
                detailedSubjects.push({
                    semester: semesterName,
                    subjectName: subjectDef?._doc?.subjectName,
                    subjectCode: subjectDef?._doc.subjectCode,
                    credit: subjectDef?._doc.credit?subjectDef?._doc.credit:1, // Max Credit
                    maxMarks: maxTotalMarks, // Use the explicitly calculated value
                    internalMax: subjectDef?._doc.internalMax,
                    externalMax: subjectDef?._doc.externalMax,
                    internalMarks: result.internalObtain?result.internalObtain:50, // New field for clarity
                    externalMarks: result.externalObtain?result.externalObtain:50, // New field for clarity
                    totalMarksObtained: result.totalMarks,
                    gp: result?.gp,
                    earnedCredit: result.earnedCredit,
                });
            }
            
            else {
                console.warn(`[Performance Calc] Subject ${result.subjectCode} in ${semesterName} is missing definition or result data. Skipping.`);
            }
        });
    });

    // --- Final Metrics Calculation ---
    // CGPA Calculation: Total Credit Points divided by Total Credits attempted (or Total Earned Credit, depending on institutional rule).
    // Using totalEarnedCredit here, as it better reflects the 'successful' academic load.
    const overallCGPA = totalEarnedCredit > 0 ? (totalCreditPoint / totalEarnedCredit) : 0;
    
    const overallPercentage = totalMaxMarks > 0 ? (totalMarksObtained / totalMaxMarks) * 100 : 0;
    
    return {
        // Round to two decimal places
        finalCGPA: parseFloat(overallCGPA.toFixed(2)),
        overallPercentage: parseFloat(overallPercentage.toFixed(2)),
        // Assuming a passing CGPA threshold of 5.0
        result: overallCGPA >= 5.0 ? 'Passed' : 'Failed',
        detailedSubjects: detailedSubjects,
    };
};


/**
 * @route   GET /api/v1/marks/students
 * @desc    Get all students with calculated marks for the Admin marks table.
 * @returns {object} - Success response with student data including calculated performance.
 */
export const getStudentsWithMarks = async (req, res) => {
    try {
        // 1. Fetch all active students
        const students = await Student.find({ status: 'Active' })
            .select('nameCandidate enrollmentNo program batch marks isApproved');
        
        // 2. Fetch all Course definitions for efficient lookup
        const courses = await Course.find().select('value subjects name');
        const courseMap = new Map();
        courses.forEach(course => {
            // Map: 'BCOM' -> [SubjectDefinition1, SubjectDefinition2, ...]
            courseMap.set(course.name, course.subjects);
        });
        console.log('courses',courses);
        console.log('courseMap',courseMap);
        
        // 3. Process each student
        const studentsWithPerformance = students.map(student => {
            const studentObject = student.toObject();
            
            // Find the subject definitions for the student's program
            const courseSubjects = courseMap.get(studentObject.program);
            console.log('courseSubjects', courseSubjects)
            let performance;

            if (courseSubjects && studentObject.marks) {
                // Calculate performance using student's marks and course definitions
                performance = mergeAndCalculatePerformance(studentObject.marks, student.programSubjects);
            } else {
                // Handle missing data scenario
                performance = { 
                    finalCGPA: 0.00, 
                    overallPercentage: 0.00, 
                    result: 'Data Missing', 
                    detailedSubjects: [] 
                };
            }

            // Return student data merged with calculated performance
            return {
                ...studentObject,
                finalCGPA: performance.finalCGPA,
                overallPercentage: performance.overallPercentage,
                result: performance.result,
                // Include detailed subjects if the client needs them for drill-down
                subjects: student.programSubjects, 
            };
        });

        res.status(200).json({ success: true, data: studentsWithPerformance });
    } catch (error) {
        console.error('Error fetching students with marks:', error);
        res.status(500).json({ success: false, message: 'Server error fetching student marks data.' });
    }
};


export const getStudentsWithMarksPreview = async (req, res) => {
    try {
        // MOCK DATA for a single student (Semester I)
        const students = await Student.findOne({ _id: req.body._id })
        const courses = await Course.findOne({name:students.course})
            // .select('nameCandidate enrollmentNo program batch marks isApproved');
        const mockStudent = {
            id: students._id,
            nameCandidate: students.nameCandidate,
            programSubjects:students.programSubjects,
            enrollmentNo: students.enrollmentNo,
            programCode: students.program, // Assuming the program field is now programCode
            // Student's marks: Key is Semester Name, Value is SemesterMarksSchema object
            marks: new Map([
                [courses.name, {
                    semester: courses.name,
                    subjects: 
                        courses.subjects
                        // { subjectCode: 'BCOMM 101', internalMarks: 24, externalMarks: 34, totalMarks: 58, gp: 6, earnedCredit: 3 },
                        // { subjectCode: 'BCOMM 102', internalMarks: 25, externalMarks: 40, totalMarks: 65, gp: 7, earnedCredit: 3 },
                        // ... other subjects
                    
                }],
            ]),
        };

        console.log('mockStudent',mockStudent.marks);
        
        // MOCK Course Subjects (Max Marks and Credit from the image)
        // const mockCourseSubjects = [
        //     { subjectCode: 'BCOMM 101', subjectName: 'English Language-I', credit: 3, internalMax: 40, externalMax: 60 },
        //     { subjectCode: 'BCOMM 102', subjectName: 'Hindi', credit: 3, internalMax: 40, externalMax: 60 },
        //     { subjectCode: 'BCOMM 103', subjectName: 'Business Mathematics', credit: 4, internalMax: 40, externalMax: 60 },
        //     // ... and so on for the rest of the course subjects
        // ];
        
        // Simulating the course map lookup
        const courseMap = mockStudent.marks

        const studentObject = mockStudent; // Use mock student
        const courseSubjects = courseMap.get(studentObject.programCode); 
        console.log('courseSubjectscourseSubjectscourseSubjects',courseSubjects);
        
        let performance = { finalCGPA: 0.00, overallPercentage: 0.00, result: 'Data Missing', detailedSubjects: [] };

        if (courseSubjects && studentObject.marks) {
            performance = mergeAndCalculatePerformance(studentObject.marks, studentObject.programSubjects);
        }

        const studentsWithPerformance = [{
            ...studentObject,
            finalCGPA: performance.finalCGPA,
            overallPercentage: performance.overallPercentage,
            result: performance.result,
            subjects: performance.detailedSubjects, 
        }];

        // In a real controller, you would use:
        res.status(200).json({ success: true, data: studentsWithPerformance });
        
        console.log('--- MOCK CALCULATION RESULT ---');
        console.log('CGPA:', performance.finalCGPA); // Should be approx 6.66 for Semester I
        console.log('Percentage:', performance.overallPercentage); // Should be approx 62.83% for Semester I
        console.log('Result:', performance.result);
        return studentsWithPerformance;

    } catch (error) {
        console.error('Error fetching students with marks:', error);
        res.status(500).json({ success: false, message: 'Server error fetching student marks data.' });
    }
};



// @route   PATCH /api/v1/marks/approve/:enrollmentNo
// @desc    Admin approves or unapproves the marks/certificate for a student
export const approveCertificate = async (req, res) => {
    try {
        const { enrollmentNo } = req.params;
        const { isApproved } = req.body;
        
        const student = await Student.findOne({ enrollmentNo: enrollmentNo });

        if (!student) {
            return res.status(404).json({ success: false, message: 'Student not found.' });
        }

        // --- Update Approval Status ---
        student.isApproved = isApproved;
        
        if (isApproved) {
            // Recalculate and permanently store final results in the DB on approval
            const performance = calculateStudentPerformance(student);
            student.finalCGPA = performance.finalCGPA;
            student.overallPercentage = performance.overallPercentage;
            student.result = performance.result;
            student.dateOfIssue = new Date(); // Set date of issue
        } else {
            student.dateOfIssue = null;
        }

        await student.save();
        res.status(200).json({ success: true, message: `Certificate status set to ${isApproved ? 'Approved' : 'Pending'}`, data: student });
    } catch (error) {
        console.error('Approval Error:', error);
        res.status(500).json({ success: false, message: 'Server error during certificate approval.' });
    }
};

// @route   GET /api/v1/marks/certificate/:enrollmentNo
// @desc    Fetches a single student's complete record for certificate generation.
export const getCertificateData = async (req, res) => {
    try {
        const { enrollmentNo } = req.params;
        const student = await Student.findOne({ enrollmentNo: enrollmentNo });
        
        if (!student) {
            return res.status(404).json({ success: false, message: 'Student not found.' });
        }
        
        // Recalculate and embed performance results for absolute accuracy on certificate
        const performance = calculateStudentPerformance(student);
        
        const studentData = {
            ...student.toObject(),
            ...performance, // Overwrite final CGPA/Percentage with real-time calculated values
        };

        res.status(200).json({ success: true, data: studentData });
    } catch (error) {
        console.error('Error fetching certificate data:', error);
        res.status(500).json({ success: false, message: 'Server error fetching certificate data.' });
    }
};
