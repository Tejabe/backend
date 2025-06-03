const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Middleware to log incoming request body and headers
router.use((req, res, next) => {
  console.log('Incoming request body:', req.body);
  console.log('Headers:', req.headers);
  next();
});

// Get all users (for debug/testing purposes)
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({});
    console.log('All users:', users);
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// REGISTER route
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Let Mongoose pre-save hook handle the hashing
    const user = new User({ name, email, password });
    await user.save();

    res.json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Register Error:', err.message);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});


// LOGIN route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({ email: normalizedEmail });
    console.log('Found user:', user);

    if (!user) {
      return res.status(401).json({
        message: 'Invalid credentials',
        suggestion: 'Please check your email or register first'
      });
    }

    const isMatch = await user.matchPassword(password);
    console.log('Password match result:', isMatch);

    if (!isMatch) {
      return res.status(401).json({
        message: 'Invalid credentials',
        suggestion: 'Please check your password'
      });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      message: 'Login failed',
      error: error.message
    });
  }
});

module.exports = router;
