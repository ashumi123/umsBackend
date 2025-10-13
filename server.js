// server.js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import JWT from 'jsonwebtoken';

import centerRoutes from './routes/centerRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import accountRoutes from './routes/accountRoutes.js';

import { seedDatabase } from './seeder.js'; // Import the seeder
import bcrypt from 'bcrypt';
import User from './models/Users.js'; // Import the User model

dotenv.config();
const JWT_SECRET="y7v8212EDEGS"

const app = express();
const allowedOrigins = [
  'https://umsfrontuniversit.netlify.app',
  'https://umsfrontuniversit.netlify.app/dashboard',
  'http://localhost:5000' // Add any development domains here
];

const corsOptions = {
  // Check if the request origin is in the allowed list
  origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) === -1) {
          const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
          return callback(new Error(msg), false);
      }
      return callback(null, true);
  },
  // If your front-end sends cookies or authentication headers
  // credentials: true
};
app.use(cors(corsOptions));
const PORT = process.env.PORT || 5000;

// Middleware
// app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected successfully!');
    // OPTIONAL: Run seeder function to populate initial data
    // seedDatabase();
  })
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.get('/', (req, res) => {
  res.send('UMS API is running...');
});

app.use('/api/v1/centers', centerRoutes);
app.use('/api/v1/students', studentRoutes);
app.use('/api/v1/courses', courseRoutes);
app.use('/api/v1/accounts', accountRoutes);

const generateToken = payload => JWT.sign(payload, JWT_SECRET);


// 1. Registration Route (Saves dynamic data to MongoDB)
app.post('/api/v1/register', async (req, res) => {
  try {
      const { username, password } = req.body;

      // Simple validation
      if (!username || !password) {
          return res.status(400).json({ message: 'Username and password are required.' });
      }

      // Check if user already exists
      const existingUser = await User.findOne({ username });
      if (existingUser) {
          return res.status(409).json({ message: 'Username already taken.' });
      }

      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create and save new user
      const newUser = new User({
          username,
          password: hashedPassword, // Store the hashed password
      });

      await newUser.save();
      res.status(201).json({ message: 'User registered successfully!' });

  } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ message: 'Server error during registration.' });
  }
});

// app.use(cors({
//   origin: 'https://umsfrontuniversit.netlify.app/', // or specify your frontend origin for better security
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   // allowedHeaders: ['Content-Type', 'Authorization'],
//   optionsSuccessStatus: 200 // For legacy browser support

// }));


// app.use(cors({
//   // **CRITICAL FIX: Removed the trailing slash**
//   origin: 'https://umsfrontuniversit.netlify.app', 
  
//   // These are good to keep for handling preflight requests (OPTIONS)
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  
//   // Include if your frontend is sending headers like Authorization (for JWTs) or custom headers
//   allowedHeaders: ['Content-Type', 'Authorization'],
  
//   // Include this if you need to pass cookies or session information
//   credentials: true, 
  
//   optionsSuccessStatus: 200 
// }));

// 2. Login Route (Validates dynamic data against MongoDB)
app.post('/api/v1/login', async (req, res) => {
  try {
      const { username, password } = req.body;

      // Find the user by username
      const user = await User.findOne({ username });
      if (!user) {
          return res.status(401).json({ message: 'Invalid credentials.' });
      }

      // Compare the provided password with the stored hash
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
          return res.status(401).json({ message: 'Invalid credentials.' });
      }
      const token = await generateToken({
        _id: user._id,
        password: user.password,
        email:user.username
    })
      // Success!
      // In a real app, you would generate a JWT token here.
      res.status(200).json({ 
          message: 'Login successful!',
          user: { id: user._id, username: user.username,type:user.adminType,accessToken:token }
      });

  } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Server error during login.' });
  }
});


// Global Error Handler
app.use((err, req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://umsfrontuniversit.netlify.app");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  console.error(err.stack);
  res.status(500).send({ message: 'Something broke!', error: err.message });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
