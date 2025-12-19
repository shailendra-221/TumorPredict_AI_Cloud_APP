const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Adjust the path as needed
const bcrypt = require('bcryptjs');

// Register route
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide all fields' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const newUser = new User({ name, email, password: hashedPassword });
    const savedUser = await newUser.save();

    res.status(201).json({ id: savedUser._id, name: savedUser.name, email: savedUser.email });
  } catch (error) {
    console.error('Error in /register:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
