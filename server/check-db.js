const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.log('Connection error:', err));

const checkData = async () => {
    try {
        const users = await User.find({});
        console.log('--- Users in Database ---');
        users.forEach(user => {
            console.log(`Name: ${user.name}, Email: ${user.email}, Role: ${user.role}`);
        });
        console.log('-------------------------');
        process.exit();
    } catch (error) {
        console.error('Error fetching data:', error);
        process.exit(1);
    }
};

checkData();
