const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/auth');
const Expense = require('../models/Expense');
const { classifyExpense } = require('../utils/ai');

// Expenses page
router.get('/', isAuthenticated, async (req, res) => {
  try {
    // Get user ID
    const userId = req.user._id;
    
    // Get query parameters
    const { category, type, period } = req.query;
    
    // Build query
    const query = { userId };
    
    if (category) {
      query.category = category;
    }
    
    if (type) {
      query.type = type;
    }
    
    // Handle period filter
    if (period) {
      const now = new Date();
      let startDate = new Date();
      
      switch (period) {
        case 'this-month':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        case 'last-month':
          startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
          const endDate = new Date(now.getFullYear(), now.getMonth(), 0);
          query.date = { $gte: startDate, $lte: endDate };
          break;
        case 'last-3-months':
          startDate = new Date(now.getFullYear(), now.getMonth() - 3, 1);
          query.date = { $gte: startDate };
          break;
        case 'last-6-months':
          startDate = new Date(now.getFullYear(), now.getMonth() - 6, 1);
          query.date = { $gte: startDate };
          break;
        case 'this-year':
          startDate = new Date(now.getFullYear(), 0, 1);
          query.date = { $gte: startDate };
          break;
        default:
          // No date filter
          break;
      }
      
      if (!query.date && period === 'this-month') {
        query.date = { $gte: startDate };
      }
    }
    
    // Get expenses
    const expenses = await Expense.find(query).sort({ date: -1 });
    
    // Get all categories for filter
    const categories = await Expense.distinct('category', { userId });
    
    res.render('pages/expenses', {
      title: 'Expenses',
      user: req.user,
      expenses,
      categories,
      filters: {
        category: category || '',
        type: type || '',
        period: period || 'this-month'
      }
    });
  } catch (error) {
    console.error('Expenses error:', error);
    req.flash('error_msg', 'An error occurred while loading expenses');
    res.redirect('/dashboard');
  }
});

// Add expense page
router.get('/add', isAuthenticated, (req, res) => {
  res.render('pages/expenses/add', {
    title: 'Add Expense',
    user: req.user
  });
});

// Add expense
router.post('/add', isAuthenticated, async (req, res) => {
  try {
    // Get user ID
    const userId = req.user._id;
    
    // Get form data
    const { amount, category, description, date } = req.body;
    
    // Validate input
    if (!amount || !category || !date) {
      req.flash('error_msg', 'Amount, category, and date are required');
      return res.redirect('/expenses/add');
    }
    
    // Classify expense as need or want
    const type = classifyExpense({ category, amount: parseFloat(amount) });
    
    // Create expense
    const expense = new Expense({
      userId,
      amount: parseFloat(amount),
      category,
      description: description || '',
      date: new Date(date),
      type
    });
    
    // Save expense
    await expense.save();
    
    req.flash('success_msg', 'Expense added successfully');
    res.redirect('/expenses');
  } catch (error) {
    console.error('Add expense error:', error);
    req.flash('error_msg', 'An error occurred while adding expense');
    res.redirect('/expenses/add');
  }
});

// Edit expense page
router.get('/edit/:id', isAuthenticated, async (req, res) => {
  try {
    // Get expense ID
    const { id } = req.params;
    
    // Get expense
    const expense = await Expense.findOne({
      _id: id,
      userId: req.user._id
    });
    
    if (!expense) {
      req.flash('error_msg', 'Expense not found');
      return res.redirect('/expenses');
    }
    
    res.render('pages/expenses/edit', {
      title: 'Edit Expense',
      user: req.user,
      expense
    });
  } catch (error) {
    console.error('Edit expense error:', error);
    req.flash('error_msg', 'An error occurred while loading expense');
    res.redirect('/expenses');
  }
});

// Update expense
router.post('/edit/:id', isAuthenticated, async (req, res) => {
  try {
    // Get expense ID
    const { id } = req.params;
    
    // Get form data
    const { amount, category, description, date, type } = req.body;
    
    // Validate input
    if (!amount || !category || !date || !type) {
      req.flash('error_msg', 'Amount, category, date, and type are required');
      return res.redirect(`/expenses/edit/${id}`);
    }
    
    // Update expense
    const expense = await Expense.findOneAndUpdate(
      {
        _id: id,
        userId: req.user._id
      },
      {
        amount: parseFloat(amount),
        category,
        description: description || '',
        date: new Date(date),
        type
      },
      { new: true }
    );
    
    if (!expense) {
      req.flash('error_msg', 'Expense not found');
      return res.redirect('/expenses');
    }
    
    req.flash('success_msg', 'Expense updated successfully');
    res.redirect('/expenses');
  } catch (error) {
    console.error('Update expense error:', error);
    req.flash('error_msg', 'An error occurred while updating expense');
    res.redirect('/expenses');
  }
});

// Delete expense
router.post('/delete/:id', isAuthenticated, async (req, res) => {
  try {
    // Get expense ID
    const { id } = req.params;
    
    // Delete expense
    const expense = await Expense.findOneAndDelete({
      _id: id,
      userId: req.user._id
    });
    
    if (!expense) {
      req.flash('error_msg', 'Expense not found');
      return res.redirect('/expenses');
    }
    
    req.flash('success_msg', 'Expense deleted successfully');
    res.redirect('/expenses');
  } catch (error) {
    console.error('Delete expense error:', error);
    req.flash('error_msg', 'An error occurred while deleting expense');
    res.redirect('/expenses');
  }
});

module.exports = router;
