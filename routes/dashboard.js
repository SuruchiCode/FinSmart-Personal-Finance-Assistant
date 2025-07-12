const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/auth');
const Expense = require('../models/Expense');
const SavingsGoal = require('../models/SavingsGoal');
const { generateSpendingInsights } = require('../utils/ai');

// Dashboard page
router.get('/', isAuthenticated, async (req, res) => {
  try {
    // Get user ID
    const userId = req.user._id;
    
    // Get recent expenses (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const expenses = await Expense.find({
      userId,
      date: { $gte: thirtyDaysAgo }
    }).sort({ date: -1 });
    
    // Get savings goals
    const savingsGoals = await SavingsGoal.find({ userId }).sort({ deadline: 1 });
    
    // Generate AI insights
    const insights = generateSpendingInsights(expenses, savingsGoals);
    
    // Calculate total expenses
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    
    // Calculate needs vs wants
    const needsExpenses = expenses
      .filter(expense => expense.type === 'need')
      .reduce((sum, expense) => sum + expense.amount, 0);
    
    const wantsExpenses = expenses
      .filter(expense => expense.type === 'want')
      .reduce((sum, expense) => sum + expense.amount, 0);
    
    const needsPercentage = totalExpenses > 0 ? Math.round((needsExpenses / totalExpenses) * 100) : 0;
    const wantsPercentage = totalExpenses > 0 ? Math.round((wantsExpenses / totalExpenses) * 100) : 0;
    
    // Group expenses by category
    const expensesByCategory = {};
    expenses.forEach(expense => {
      if (!expensesByCategory[expense.category]) {
        expensesByCategory[expense.category] = 0;
      }
      expensesByCategory[expense.category] += expense.amount;
    });
    
    // Sort categories by amount
    const sortedCategories = Object.entries(expensesByCategory)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5); // Top 5 categories
    
    // Generate notifications
    const notifications = [];
    
    // Check for recent expenses
    const recentExpenses = expenses.filter(exp => {
      const expDate = new Date(exp.date);
      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
      return expDate >= threeDaysAgo;
    });
    
    if (recentExpenses.length > 0) {
      const recentTotal = recentExpenses.reduce((sum, exp) => sum + exp.amount, 0);
      notifications.push({
        type: 'alert',
        message: `You've spent ₹${recentTotal.toFixed(2)} in the last 3 days.`
      });
    }
    
    // Check for approaching savings goals
    const approachingGoals = savingsGoals.filter(goal => {
      const deadline = new Date(goal.deadline);
      const oneWeekFromNow = new Date();
      oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7);
      return deadline <= oneWeekFromNow && goal.currentAmount < goal.targetAmount;
    });
    
    if (approachingGoals.length > 0) {
      notifications.push({
        type: 'tip',
        message: `You have ${approachingGoals.length} savings goal(s) approaching deadline soon.`
      });
    }
    
    // Check for high spending categories
    if (sortedCategories.length > 0) {
      const [highestCategory, highestAmount] = sortedCategories[0];
      notifications.push({
        type: 'alert',
        message: `Your highest spending category is ${highestCategory} at ₹${highestAmount.toFixed(2)}.`
      });
    }
    
    res.render('pages/dashboard', {
      title: 'Dashboard',
      user: req.user,
      expenses,
      savingsGoals,
      insights,
      totalExpenses,
      needsExpenses,
      wantsExpenses,
      needsPercentage,
      wantsPercentage,
      sortedCategories,
      notifications
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    req.flash('error_msg', 'An error occurred while loading the dashboard');
    res.redirect('/');
  }
});

module.exports = router;
