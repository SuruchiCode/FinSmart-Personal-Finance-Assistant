const express = require('express');
const router = express.Router();

// Home page
router.get('/', (req, res) => {
  res.render('pages/index', {
    title:'FinSmart - Finance Tracker & Chat Assistant',
    user: req.session.user
  });
});

// About page
router.get('/about', (req, res) => {
  res.render('pages/about', {
    title: 'About FinSmart',
    user: req.session.user
  });
});

// Contact page
router.get('/contact', (req, res) => {
  res.render('pages/contact', {
    title: 'Contact Us',
    user: req.session.user
  });
});

module.exports = router;
