const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    enrolledCourses: [{
        course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
        progress: { type: Number, default: 0 }, // 0 to 100
        status: { type: String, enum: ['active', 'completed', 'dropped'], default: 'active' },
        taggedTeacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        completionDate: Date
    }],
    subscription: {
        plan: { type: String, enum: ['monthly', 'yearly', 'none'], default: 'none' },
        startDate: Date,
        expiryDate: Date,
        isActive: { type: Boolean, default: false }
    },
    feePaymentStatus: { type: String, enum: ['paid', 'overdue', 'partial'], default: 'paid' },
    attendance: [{
        date: { type: Date, default: Date.now },
        status: { type: String, enum: ['present', 'absent'], default: 'present' }
    }],
    performanceMetrics: {
        averageScore: { type: Number, default: 0 },
        assignmentsCompleted: { type: Number, default: 0 }
    }
});

module.exports = mongoose.model('Student', studentSchema);
