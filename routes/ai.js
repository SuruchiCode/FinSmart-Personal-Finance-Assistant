const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { isAuthenticated, isNotAuthenticated } = require('../middleware/auth');
const { generateOTP, storeOTP, verifyOTP } = require('../utils/otp');
const { sendOTPEmail } = require('../utils/email');

// Login page
router.get('/login', isNotAuthenticated, (req, res) => {
  res.render('pages/auth/login', {
    title: 'Login',
    user: null
  });
});

// Register page
router.get('/register', isNotAuthenticated, (req, res) => {
  res.render('pages/auth/register', {
    title: 'Register',
    user: null
  });
});

// Verify OTP page
router.get('/verify-otp', isNotAuthenticated, (req, res) => {
  const { email } = req.query;
  
  if (!email) {
    req.flash('error_msg', 'Email is required');
    return res.redirect('/auth/register');
  }
  
  res.render('pages/auth/verify-otp', {
    title: 'Verify OTP',
    email,
    user: null
  });
});

// Register user
router.post('/register', isNotAuthenticated, async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;
    
    // Validate input
    if (!name || !email || !password || !confirmPassword) {
      req.flash('error_msg', 'All fields are required');
      return res.redirect('/auth/register');
    }
    
    if (password !== confirmPassword) {
      req.flash('error_msg', 'Passwords do not match');
      return res.redirect('/auth/register');
    }
    
    if (password.length < 6) {
      req.flash('error_msg', 'Password must be at least 6 characters');
      return res.redirect('/auth/register');
    }
    
    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      req.flash('error_msg', 'Email is already registered');
      return res.redirect('/auth/register');
    }
    
    // Generate OTP
    const otp = await generateOTP();
    
    // Store OTP
    await storeOTP(email, otp);
    
    // Create user (not verified yet)
    const user = new User({
      name,
      email,
      password,
      isVerified: false
    });
    
    // Save user
    await user.save();
    
    // Send OTP email
    const emailResult = await sendOTPEmail(email, otp);
    
    if (emailResult.success) {
      // For development, show the OTP in the flash message
      if (process.env.NODE_ENV !== 'production') {
        req.flash('success_msg', `Registration successful! Please check your email for the OTP. (For testing: ${otp})`);
      } else {
        req.flash('success_msg', 'Registration successful! Please check your email for the OTP.');
      }
      
      // Redirect to verify OTP page
      return res.redirect(`/auth/verify-otp?email=${encodeURIComponent(email)}`);
    } else {
      // If email sending fails, delete the user and show error
      await User.findOneAndDelete({ email });
      req.flash('error_msg', 'Failed to send OTP email. Please try again.');
      return res.redirect('/auth/register');
    }
  } catch (error) {
    console.error('Registration error:', error);
    req.flash('error_msg', 'An error occurred during registration');
    res.redirect('/auth/register');
  }
});

// Verify OTP
router.post('/verify-otp', isNotAuthenticated, async (req, res) => {
  try {
    const { email, otp } = req.body;
    
    // Validate input
    if (!email || !otp) {
      req.flash('error_msg', 'Email and OTP are required');
      return res.redirect(`/auth/verify-otp?email=${encodeURIComponent(email)}`);
    }
    
    // Verify OTP
    const isValid = await verifyOTP(email, otp);
    if (!isValid) {
      req.flash('error_msg', 'Invalid or expired OTP');
      return res.redirect(`/auth/verify-otp?email=${encodeURIComponent(email)}`);
    }
    
    // Update user to verified
    const user = await User.findOneAndUpdate(
      { email },
      { isVerified: true },
      { new: true }
    );
    
    if (!user) {
      req.flash('error_msg', 'User not found');
      return res.redirect('/auth/register');
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
    
    // Set token in cookie
    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      secure: process.env.NODE_ENV === 'production'
    });
    
    // Set user in session
    req.session.user = {
      id: user._id,
      name: user.name,
      email: user.email
    };
    
    req.flash('success_msg', 'Email verified successfully! You are now logged in.');
    res.redirect('/dashboard');
  } catch (error) {
    console.error('OTP verification error:', error);
    req.flash('error_msg', 'An error occurred during OTP verification');
    res.redirect('/auth/login');
  }
});

// Login user
router.post('/login', isNotAuthenticated, async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validate input
    if (!email || !password) {
      req.flash('error_msg', 'Email and password are required');
      return res.redirect('/auth/login');
    }
    
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      req.flash('error_msg', 'Invalid email or password');
      return res.redirect('/auth/login');
    }
    
    // Check if user is verified
    if (!user.isVerified) {
      // Generate new OTP
      const otp = await generateOTP();
      
      // Store OTP
      await storeOTP(email, otp);
      
      // Send OTP email
      await sendOTPEmail(email, otp);
      
      req.flash('error_msg', 'Please verify your email first');
      return res.redirect(`/auth/verify-otp?email=${encodeURIComponent(email)}`);
    }
    
    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      req.flash('error_msg', 'Invalid email or password');
      return res.redirect('/auth/login');
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
    
    // Set token in cookie
    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      secure: process.env.NODE_ENV === 'production'
    });
    
    // Set user in session
    req.session.user = {
      id: user._id,
      name: user.name,
      email: user.email
    };
    
    req.flash('success_msg', 'You are now logged in');
    res.redirect('/dashboard');
  } catch (error) {
    console.error('Login error:', error);
    req.flash('error_msg', 'An error occurred during login');
    res.redirect('/auth/login');
  }
});

// Logout user
router.get('/logout', isAuthenticated, (req, res) => {
  // Clear cookie
  res.clearCookie('token');
  
  // Clear session
  req.session.destroy();
  
  res.redirect('/auth/login');
});

// Resend OTP
router.get('/resend-otp', isNotAuthenticated, async (req, res) => {
  try {
    const { email } = req.query;
    
    if (!email) {
      req.flash('error_msg', 'Email is required');
      return res.redirect('/auth/register');
    }
    
    // Generate new OTP
    const otp = await generateOTP();
    
    // Store OTP
    await storeOTP(email, otp);
    
    // Send OTP email
    const emailResult = await sendOTPEmail(email, otp);
    
    if (emailResult.success) {
      // For development, show the OTP in the flash message
      if (process.env.NODE_ENV !== 'production') {
        req.flash('success_msg', `New OTP sent! Please check your email. (For testing: ${otp})`);
      } else {
        req.flash('success_msg', 'New OTP sent! Please check your email.');
      }
      
      return res.redirect(`/auth/verify-otp?email=${encodeURIComponent(email)}`);
    } else {
      req.flash('error_msg', 'Failed to send OTP email. Please try again.');
      return res.redirect(`/auth/verify-otp?email=${encodeURIComponent(email)}`);
    }
  } catch (error) {
    console.error('Resend OTP error:', error);
    req.flash('error_msg', 'An error occurred while resending OTP');
    res.redirect('/auth/register');
  }
});

module.exports = router;
