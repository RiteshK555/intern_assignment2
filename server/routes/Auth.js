const express = require('express');
const router = express.Router();
const User = require('../models/User'); 
const jwt = require('jsonwebtoken');
const config = require('../config');

router.post('/login/', async (req, res) => {
  const { username } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({success: false,  message: 'Authentication failed' });
    }

    const token = jwt.sign({ userId: user._id }, config.jwtSecret, { expiresIn: '1h' });

    res.json({ success: true, token: token });
  } catch (err) {
    console.error(err);
    res.status(500).json({success: false, message: 'Server error' });
  }
});

module.exports = router;