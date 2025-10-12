// seeder.js
import Center from './models/Center.js';
import Student from './models/Student.js';
import Transaction from './models/Transaction.js';
import mongoose from 'mongoose'; // Required for connecting if run standalone

// Mock Data consistent with the frontend prototypes
const centers = [
  { centerCode: 'AMC001', name: 'Delhi Main Campus', city: 'New Delhi', email: 'delhi@ums.edu', mobile: '9876543210', status: 'Active', studentsEnrolled: 320 },
  { centerCode: 'BHC002', name: 'Bangalore Tech Hub', city: 'Bangalore', email: 'banga@ums.edu', mobile: '9988776655', status: 'Active', studentsEnrolled: 450 },
  { centerCode: 'MUC003', name: 'Mumbai Learning Satellite', city: 'Mumbai', email: 'mumbai@ums.edu', mobile: '9000111222', status: 'Inactive', studentsEnrolled: 100 },
];

const students = [
  { regNo: 'STU1001', name: 'Alia Khan', course: 'MBA', centerCode: 'AMC001', status: 'Active', feesPaid: 50000 },
  { regNo: 'STU1002', name: 'Ravi Sharma', course: 'BCA', centerCode: 'BHC002', status: 'Active', feesPaid: 30000 },
  { regNo: 'STU1003', name: 'Priya Verma', course: 'MCA', centerCode: 'AMC001', status: 'Registered', feesPaid: 10000 },
  { regNo: 'STU1004', name: 'David Lee', course: 'BBA', centerCode: 'BHC002', status: 'Active', feesPaid: 45000 },
];

// Simple transactions
const transactions = [
    { txnId: 'TXN1001', type: 'Deposit', center: 'AMC001', amount: 500000, reason: 'Q3 Fee Collection' },
    { txnId: 'TXN1002', type: 'Usage', center: 'BHC002', amount: 50000, reason: 'Infrastructure Maintenance' },
    { txnId: 'TXN1003', type: 'Deposit', center: 'BHC002', amount: 200000, reason: 'Fresh Batch Enrollment' },
];


export const seedDatabase = async () => {
  try {
    await Center.deleteMany();
    await Student.deleteMany();
    await Transaction.deleteMany();

    await Center.insertMany(centers);
    await Student.insertMany(students);
    await Transaction.insertMany(transactions);

    console.log('Database Seeder: Data Imported!');
  } catch (error) {
    console.error('Database Seeder: Error importing data', error);
    // process.exit(1); // Exit with error code if run standalone
  }
};

// Uncomment to run seeder standalone (outside of server.js startup)
/* if (process.argv[2] === '-d') {
  mongoose.connect(process.env.MONGO_URI)
    .then(() => seedDatabase())
    .then(() => mongoose.connection.close());
}
*/