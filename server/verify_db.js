const mongoose = require('mongoose');
const User = require('./models/User');
const Payment = require('./models/Payment');
const AnalyticsReport = require('./models/AnalyticsReport');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log('MongoDB connection error:', err));

const verify = async () => {
    try {
        const userCount = await User.countDocuments();
        const paymentCount = await Payment.countDocuments();
        const reportCount = await AnalyticsReport.countDocuments();
        const latestReport = await AnalyticsReport.findOne().sort({ reportDate: -1 });

        console.log('--- Database Verification Results ---');
        console.log(`Total Users: ${userCount}`);
        console.log(`Total Payments: ${paymentCount}`);
        console.log(`Total Analytics Reports: ${reportCount}`);

        if (latestReport) {
            console.log('Latest Report Date:', latestReport.reportDate);
            console.log('Latest Report Financials:', latestReport.financials);
        } else {
            console.log('No Analytics Reports found.');
        }

        process.exit();
    } catch (error) {
        console.error('Verification Error:', error);
        process.exit(1);
    }
};

verify();
