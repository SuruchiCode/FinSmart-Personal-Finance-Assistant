const express = require('express');
const router = express.Router();

// GET contact page
router.get('/', (req, res) => {
  res.render('pages/contact', {
    title: 'Contact Us',
    user: req.session.user
  });
});

// POST contact form
router.post('/', (req, res) => {
  const { name, email, subject, message } = req.body;
  
  // Check if request is AJAX
  const isAjax = req.xhr || req.headers['x-requested-with'] === 'XMLHttpRequest';
  
  // In a real app, you would send an email or save to database here
  console.log('Contact form submission:', { name, email, subject, message });
  
  // For AJAX requests, return JSON
  if (isAjax) {
    return res.json({
      success: true,
      message: 'Thank you for your message! We will get back to you soon.'
    });
  }
  
  // For regular form submissions, redirect with flash message
  req.flash('success_msg', 'Thank you for your message! We will get back to you soon.');
  res.redirect('/contact');
});

module.exports = router;
