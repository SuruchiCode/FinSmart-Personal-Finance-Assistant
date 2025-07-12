const mongoose = require('mongoose');

const SavingsGoalSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  targetAmount: {
    type: Number,
    required: [true, 'Target amount is required'],
    min: [0, 'Target amount must be a positive number']
  },
  currentAmount: {
    type: Number,
    default: 0,
    min: [0, 'Current amount must be a positive number']
  },
  deadline: {
    type: Date,
    required: [true, 'Deadline is required']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('SavingsGoal', SavingsGoalSchema);
