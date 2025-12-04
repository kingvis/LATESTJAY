const mongoose = require('mongoose');
const User = require('./models/User');
const Student = require('./models/Student');
const Teacher = require('./models/Teacher');
const Course = require('./models/Course');
const Payment = require('./models/Payment');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connected for seeding'))
    .catch(err => console.log('MongoDB connection error:', err));

const seedData = async () => {
    try {
        // Clear existing data
        await User.deleteMany({});
        await Student.deleteMany({});
        await Teacher.deleteMany({});
        await Course.deleteMany({});
        await Payment.deleteMany({});

        console.log('Cleared existing data...');

        // 1. Create Users (Admin, Teachers, Students)
        const adminUser = await User.create({
            name: 'Admin Staff',
            email: 'admin@jaymusic.com',
            password: 'password123',
            role: 'admin'
        });

        const teacher1User = await User.create({
            name: 'Sarah Vocalist',
            email: 'sarah@jaymusic.com',
            password: 'password123',
            role: 'teacher'
        });

        const teacher2User = await User.create({
            name: 'Mike Pianist',
            email: 'mike@jaymusic.com',
            password: 'password123',
            role: 'teacher'
        });

        const student1User = await User.create({
            name: 'John Doe',
            email: 'john@student.com',
            password: 'password123',
            role: 'student'
        });

        const student2User = await User.create({
            name: 'Jane Smith',
            email: 'jane@student.com',
            password: 'password123',
            role: 'student'
        });

        console.log('Created Users...');

        // 2. Create Courses
        const course1 = await Course.create({
            title: 'Vocal Mastery 101',
            description: 'Learn the basics of singing.',
            instructor: teacher1User._id,
            price: 199,
            duration: '8 weeks',
            level: 'Beginner'
        });

        const course2 = await Course.create({
            title: 'Advanced Piano Techniques',
            description: 'Master complex compositions.',
            instructor: teacher2User._id,
            price: 299,
            duration: '12 weeks',
            level: 'Advanced'
        });

        console.log('Created Courses...');

        // 3. Create Teacher Profiles
        await Teacher.create({
            user: teacher1User._id,
            specialization: ['Vocals', 'Choir'],
            studentsAssigned: [student1User._id],
            averageRating: 4.8,
            performanceMetrics: {
                studentCompletionRate: 95,
                classesConducted: 120
            },
            earnings: {
                totalEarned: 5000,
                pendingPayout: 500
            }
        });

        await Teacher.create({
            user: teacher2User._id,
            specialization: ['Piano', 'Music Theory'],
            studentsAssigned: [student2User._id],
            averageRating: 4.5,
            performanceMetrics: {
                studentCompletionRate: 88,
                classesConducted: 90
            },
            earnings: {
                totalEarned: 4500,
                pendingPayout: 0
            }
        });

        console.log('Created Teacher Profiles...');

        // 4. Create Student Profiles
        await Student.create({
            user: student1User._id,
            enrolledCourses: [{
                course: course1._id,
                progress: 45,
                status: 'active',
                taggedTeacher: teacher1User._id
            }],
            subscription: {
                plan: 'monthly',
                isActive: true,
                startDate: new Date(),
                expiryDate: new Date(new Date().setMonth(new Date().getMonth() + 1))
            },
            feePaymentStatus: 'paid',
            performanceMetrics: {
                averageScore: 85,
                assignmentsCompleted: 12
            }
        });

        await Student.create({
            user: student2User._id,
            enrolledCourses: [{
                course: course2._id,
                progress: 100,
                status: 'completed',
                taggedTeacher: teacher2User._id,
                completionDate: new Date()
            }],
            subscription: {
                plan: 'yearly',
                isActive: true,
                startDate: new Date(),
                expiryDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
            },
            feePaymentStatus: 'paid',
            performanceMetrics: {
                averageScore: 92,
                assignmentsCompleted: 20
            }
        });

        console.log('Created Student Profiles...');

        // 5. Create Payments (Financial Data)
        await Payment.create({
            user: student1User._id,
            amount: 29,
            type: 'subscription',
            status: 'success',
            transactionId: 'pay_123456'
        });

        await Payment.create({
            user: student2User._id,
            amount: 290,
            type: 'subscription',
            status: 'success',
            transactionId: 'pay_789012'
        });

        console.log('Created Payments...');
        console.log('Database Seeded Successfully!');
        process.exit();

    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedData();
