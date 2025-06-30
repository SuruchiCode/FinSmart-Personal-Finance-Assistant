const mongoose = require('mongoose');

const OTPSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true
  },
  otp: {
    type: String,
    required: [true, 'OTP is required']
  },
  expiresAt: {
    type: Date,
    required: [true, 'Expiry date is required'],
    index: { expires: 0 } // This will automatically delete the document when expiresAt is reached
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('OTP', OTPSchema);
