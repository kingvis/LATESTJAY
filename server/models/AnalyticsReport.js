const mongoose = require('mongoose');

const analyticsReportSchema = new mongoose.Schema({
    reportDate: { type: Date, default: Date.now },
    financials: {
        totalRevenue: { type: Number, default: 0 },
        totalTransactionCount: { type: Number, default: 0 }
    },
    teacherPerformance: [{
        teacherName: String,
        teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        averageRating: { type: Number, default: 0 },
        totalStudents: { type: Number, default: 0 },
        completionRate: { type: Number, default: 0 } // Percentage
    }],
    studentMetrics: {
        totalStudents: { type: Number, default: 0 },
        activeCount: { type: Number, default: 0 },
        droppedCount: { type: Number, default: 0 },
        completedCount: { type: Number, default: 0 }
    }
});

module.exports = mongoose.model('AnalyticsReport', analyticsReportSchema);
