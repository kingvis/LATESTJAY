const mongoose = require('mongoose');
const User = require('../models/User');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const Payment = require('../models/Payment');
const AnalyticsReport = require('../models/AnalyticsReport');

const generateAnalyticsReport = async () => {
    try {
        console.log('Generating Analytics Report...');

        // 1. Financials
        const payments = await Payment.find({ status: 'success' });
        const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);
        const totalTransactionCount = payments.length;

        // 2. Teacher Performance
        const teachers = await Teacher.find({}).populate('user');
        const teacherPerformance = teachers.map(t => ({
            teacherName: t.user ? t.user.name : 'Unknown',
            teacherId: t.user ? t.user._id : null,
            averageRating: t.averageRating || 0,
            totalStudents: t.studentsAssigned.length,
            completionRate: t.performanceMetrics ? t.performanceMetrics.studentCompletionRate : 0
        }));

        // 3. Student Metrics
        const students = await Student.find({});
        const totalStudents = students.length;
        const activeCount = students.filter(s => s.subscription && s.subscription.isActive).length;
        // Assuming 'dropped' status exists in enrolledCourses or we infer it. 
        // For now, let's count students with ANY 'dropped' course as dropped, or just use a placeholder logic if status isn't on student root.
        // The schema has 'status' inside 'enrolledCourses'. Let's count students who have completed at least one course.
        const completedCount = students.filter(s => s.enrolledCourses.some(c => c.status === 'completed')).length;
        const droppedCount = students.filter(s => s.enrolledCourses.some(c => c.status === 'dropped')).length;

        // 4. Create and Save Report
        const report = new AnalyticsReport({
            financials: {
                totalRevenue,
                totalTransactionCount
            },
            teacherPerformance,
            studentMetrics: {
                totalStudents,
                activeCount,
                droppedCount,
                completedCount
            }
        });

        await report.save();
        console.log('Analytics Report Generated and Saved:', report._id);
        return report;

    } catch (error) {
        console.error('Error generating analytics report:', error);
        throw error;
    }
};

module.exports = generateAnalyticsReport;
