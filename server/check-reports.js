const mongoose = require('mongoose');
const AnalyticsReport = require('./models/AnalyticsReport');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.log('Connection error:', err));

const checkReports = async () => {
    try {
        const reports = await AnalyticsReport.find({}).sort({ reportDate: -1 });
        console.log(`Found ${reports.length} reports.`);
        if (reports.length > 0) {
            console.log('--- Latest Report ---');
            console.log(JSON.stringify(reports[0], null, 2));
            console.log('---------------------');
        }
        process.exit();
    } catch (error) {
        console.error('Error fetching reports:', error);
        process.exit(1);
    }
};

checkReports();
