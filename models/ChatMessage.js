const mongoose = require('mongoose');

const ChatMessageSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
    trim: true
  },
  sender: {
    type: String,
    enum: ['user', 'assistant'],
    required: [true, 'Sender is required']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('ChatMessage', ChatMessageSchema);
