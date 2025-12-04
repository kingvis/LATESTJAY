const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./models/User'); // Import User model
const Student = require('./models/Student');
const Teacher = require('./models/Teacher');
const Payment = require('./models/Payment');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log('MongoDB connection error:', err));

// Routes
app.get('/', (req, res) => {
    res.send('Jay Music Academy Server is running');
});

// Sign Up Route
app.post('/signup', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create new user
        const newUser = new User({
            name,
            email,
            password, // In production, hash this password!
            role: email.endsWith('@jay.com') ? 'admin' : (role || 'student')
        });

        await newUser.save();

        // Create associated role document
        if (newUser.role === 'student') {
            await new Student({ user: newUser._id }).save();
        } else if (newUser.role === 'teacher') {
            await new Teacher({ user: newUser._id }).save();
        }

        res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Sign In Route
app.post('/signin', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check password (simple comparison for now)
        if (user.password !== password) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Auto-promote to admin if email matches domain
        if (user.email.endsWith('@jay.com') && user.role !== 'admin') {
            user.role = 'admin';
            user.role = 'admin';
            await user.save();
        }

        // Ensure role document exists (Backfill)
        if (user.role === 'student') {
            const studentDoc = await Student.findOne({ user: user._id });
            if (!studentDoc) await new Student({ user: user._id }).save();
        } else if (user.role === 'teacher') {
            const teacherDoc = await Teacher.findOne({ user: user._id });
            if (!teacherDoc) await new Teacher({ user: user._id }).save();
        }

        // Return user info (excluding password)
        res.json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Signin error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

const SystemConfig = require('./models/SystemConfig');

// --- Config Routes ---

// Get Config
app.get('/config/:key', async (req, res) => {
    try {
        const config = await SystemConfig.findOne({ key: req.params.key });
        res.json(config ? config.value : null);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch config' });
    }
});

// Update Config (Admin only - simplified for now, should add auth middleware)
app.post('/config/:key', async (req, res) => {
    try {
        const config = await SystemConfig.findOneAndUpdate(
            { key: req.params.key },
            { value: req.body, updatedAt: Date.now() },
            { upsert: true, new: true }
        );
        res.json(config);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update config' });
    }
});

// --- Payment Routes ---
app.post('/payments/manual', async (req, res) => {
    try {
        const { userId, amount, type } = req.body;

        const newPayment = new Payment({
            user: userId,
            amount,
            type,
            status: 'pending',
            transactionId: 'MANUAL_' + Date.now()
        });

        await newPayment.save();
        res.status(201).json({ message: 'Payment recorded successfully', payment: newPayment });
    } catch (error) {
        console.error('Payment recording error:', error);
        res.status(500).json({ message: 'Failed to record payment' });
    }
});

// --- Analytics Routes ---
app.post('/generate-report', async (req, res) => {
    try {
        const generateAnalyticsReport = require('./utils/analyticsGenerator');
        const report = await generateAnalyticsReport();
        res.status(201).json({ message: 'Report generated successfully', report });
    } catch (error) {
        console.error('Error generating report:', error);
        res.status(500).json({ message: 'Failed to generate report' });
    }
});

app.get('/analytics/latest', async (req, res) => {
    try {
        const AnalyticsReport = require('./models/AnalyticsReport');
        const report = await AnalyticsReport.findOne().sort({ reportDate: -1 });
        if (!report) {
            return res.status(404).json({ message: 'No reports found' });
        }
        res.json(report);
    } catch (error) {
        console.error('Error fetching report:', error);
        res.status(500).json({ message: 'Failed to fetch report' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
