const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    type: { type: String, enum: ['course_fee', 'subscription', 'teacher_payout'], required: true },
    status: { type: String, enum: ['success', 'failed', 'pending'], default: 'pending' },
    transactionId: String, // Razorpay Order/Payment ID
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Payment', paymentSchema);
