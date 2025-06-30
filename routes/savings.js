const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/auth');
const SavingsGoal = require('../models/SavingsGoal');

// Savings goals page
router.get('/', isAuthenticated, async (req, res) => {
  try {
    // Get user ID
    const userId = req.user._id;
    
    // Get savings goals
    const savingsGoals = await SavingsGoal.find({ userId }).sort({ deadline: 1 });
    
    res.render('pages/savings', {
      title: 'Savings Goals',
      user: req.user,
      savingsGoals
    });
  } catch (error) {
    console.error('Savings goals error:', error);
    req.flash('error_msg', 'An error occurred while loading savings goals');
    res.redirect('/dashboard');
  }
});

// Add savings goal page
router.get('/add', isAuthenticated, (req, res) => {
  res.render('pages/savings/add', {
    title: 'Add Savings Goal',
    user: req.user
  });
});

// Add savings goal
router.post('/add', isAuthenticated, async (req, res) => {
  try {
    // Get user ID
    const userId = req.user._id;
    
    // Get form data
    const { name, targetAmount, currentAmount, deadline } = req.body;
    
    // Validate input
    if (!name || !targetAmount || !deadline) {
      req.flash('error_msg', 'Name, target amount, and deadline are required');
      return res.redirect('/savings/add');
    }
    
    // Create savings goal
    const savingsGoal = new SavingsGoal({
      userId,
      name,
      targetAmount: parseFloat(targetAmount),
      currentAmount: parseFloat(currentAmount || 0),
      deadline: new Date(deadline)
    });
    
    // Save savings goal
    await savingsGoal.save();
    
    req.flash('success_msg', 'Savings goal added successfully');
    res.redirect('/savings');
  } catch (error) {
    console.error('Add savings goal error:', error);
    req.flash('error_msg', 'An error occurred while adding savings goal');
    res.redirect('/savings/add');
  }
});

// Edit savings goal page
router.get('/edit/:id', isAuthenticated, async (req, res) => {
  try {
    // Get savings goal ID
    const { id } = req.params;
    
    // Get savings goal
    const savingsGoal = await SavingsGoal.findOne({
      _id: id,
      userId: req.user._id
    });
    
    if (!savingsGoal) {
      req.flash('error_msg', 'Savings goal not found');
      return res.redirect('/savings');
    }
    
    res.render('pages/savings/edit', {
      title: 'Edit Savings Goal',
      user: req.user,
      savingsGoal
    });
  } catch (error) {
    console.error('Edit savings goal error:', error);
    req.flash('error_msg', 'An error occurred while loading savings goal');
    res.redirect('/savings');
  }
});

// Update savings goal
router.post('/edit/:id', isAuthenticated, async (req, res) => {
  try {
    // Get savings goal ID
    const { id } = req.params;
    
    // Get form data
    const { name, targetAmount, currentAmount, deadline } = req.body;
    
    // Validate input
    if (!name || !targetAmount || !deadline) {
      req.flash('error_msg', 'Name, target amount, and deadline are required');
      return res.redirect(`/savings/edit/${id}`);
    }
    
    // Update savings goal
    const savingsGoal = await SavingsGoal.findOneAndUpdate(
      {
        _id: id,
        userId: req.user._id
      },
      {
        name,
        targetAmount: parseFloat(targetAmount),
        currentAmount: parseFloat(currentAmount || 0),
        deadline: new Date(deadline)
      },
      { new: true }
    );
    
    if (!savingsGoal) {
      req.flash('error_msg', 'Savings goal not found');
      return res.redirect('/savings');
    }
    
    req.flash('success_msg', 'Savings goal updated successfully');
    res.redirect('/savings');
  } catch (error) {
    console.error('Update savings goal error:', error);
    req.flash('error_msg', 'An error occurred while updating savings goal');
    res.redirect('/savings');
  }
});

// Delete savings goal
router.post('/delete/:id', isAuthenticated, async (req, res) => {
  try {
    // Get savings goal ID
    const { id } = req.params;
    
    // Delete savings goal
    const savingsGoal = await SavingsGoal.findOneAndDelete({
      _id: id,
      userId: req.user._id
    });
    
    if (!savingsGoal) {
      req.flash('error_msg', 'Savings goal not found');
      return res.redirect('/savings');
    }
    
    req.flash('success_msg', 'Savings goal deleted successfully');
    res.redirect('/savings');
  } catch (error) {
    console.error('Delete savings goal error:', error);
    req.flash('error_msg', 'An error occurred while deleting savings goal');
    res.redirect('/savings');
  }
});

module.exports = router;
