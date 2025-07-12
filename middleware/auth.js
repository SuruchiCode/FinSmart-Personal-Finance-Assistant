const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to check if user is authenticated
exports.isAuthenticated = async (req, res, next) => {
  try {
    // Check if token exists in cookies
    const token = req.cookies.token;
    
    if (!token) {
      req.flash('error_msg', 'Please log in to access this page');
      return res.redirect('/auth/login');
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user by ID
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      req.flash('error_msg', 'User not found');
      return res.redirect('/auth/login');
    }
    
    // Set user in request and session
    req.user = user;
    req.session.user = user;
    
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    req.flash('error_msg', 'Authentication failed');
    res.redirect('/auth/login');
  }
};

// Middleware to check if user is not authenticated
exports.isNotAuthenticated = (req, res, next) => {
  if (req.cookies.token) {
    return res.redirect('/dashboard');
  }
  next();
};
