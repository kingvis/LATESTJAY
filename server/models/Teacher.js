const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    specialization: [String], // e.g., ["Piano", "Music Theory"]
    studentsAssigned: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // List of Student Users
    ratings: [{
        student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        score: { type: Number, min: 1, max: 5 },
        review: String,
        date: { type: Date, default: Date.now }
    }],
    averageRating: { type: Number, default: 0 },
    performanceMetrics: {
        studentCompletionRate: { type: Number, default: 0 }, // Percentage
        classesConducted: { type: Number, default: 0 }
    },
    earnings: {
        totalEarned: { type: Number, default: 0 },
        pendingPayout: { type: Number, default: 0 }
    }
});

module.exports = mongoose.model('Teacher', teacherSchema);
