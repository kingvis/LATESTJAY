const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Teacher
    price: Number,
    duration: String, // e.g., "12 weeks"
    level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'] },
    thumbnail: String, // URL to image
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Course', courseSchema);
