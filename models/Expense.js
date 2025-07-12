const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0, 'Amount must be a positive number']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  date: {
    type: Date,
    required: [true, 'Date is required'],
    default: Date.now
  },
  type: {
    type: String,
    enum: ['need', 'want'],
    required: [true, 'Type is required']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Expense', ExpenseSchema);
