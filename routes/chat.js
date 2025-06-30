const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/auth');
const ChatMessage = require('../models/ChatMessage');
const { generateChatResponse, classifyExpense } = require('../utils/ai');

// Get chat messages
router.get('/chat', isAuthenticated, async (req, res) => {
  try {
    // Get user ID
    const userId = req.user._id;
    
    // Get chat messages
    const messages = await ChatMessage.find({ userId })
      .sort({ createdAt: 1 })
      .limit(50);
    
    res.json({ success: true, messages });
  } catch (error) {
    console.error('Get chat messages error:', error);
    res.status(500).json({ success: false, error: 'An error occurred while getting chat messages' });
  }
});

// Send chat message
router.post('/chat', isAuthenticated, async (req, res) => {
  try {
    // Get user ID
    const userId = req.user._id;
    
    // Get message content
    const { content } = req.body;
    
    if (!content) {
      return res.status(400).json({ success: false, error: 'Message content is required' });
    }
    
    // Create user message
    const userMessage = new ChatMessage({
      userId,
      content,
      sender: 'user'
    });
    
    // Save user message
    await userMessage.save();
    
    // Generate AI response
    const aiResponse = generateChatResponse(content);
    
    // Create AI message
    const aiMessage = new ChatMessage({
      userId,
      content: aiResponse,
      sender: 'assistant'
    });
    
    // Save AI message
    await aiMessage.save();
    
    res.json({
      success: true,
      userMessage,
      aiMessage
    });
  } catch (error) {
    console.error('Send chat message error:', error);
    res.status(500).json({ success: false, error: 'An error occurred while sending chat message' });
  }
});

// Classify expense
router.post('/classify-expense', isAuthenticated, (req, res) => {
  try {
    const { category, amount, description } = req.body;
    
    if (!category) {
      return res.status(400).json({ success: false, error: 'Category is required' });
    }
    
    const type = classifyExpense({
      category,
      amount: parseFloat(amount || 0),
      description: description || ''
    });
    
    res.json({ success: true, type });
  } catch (error) {
    console.error('Classify expense error:', error);
    res.status(500).json({ success: false, error: 'An error occurred while classifying expense' });
  }
});

module.exports = router;
