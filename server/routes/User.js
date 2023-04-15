const express = require('express');
const router = express.Router();
const User = require('../models/User'); 

router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
    console.log("users");
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', getUser, (req, res) => {
  res.json(res.user);
});

router.post('/', async (req, res) => {
  console.log(req.body);
  const user = new User({
    name: req.body.name,
  });
  try {
    const newUser = await user.save();
    res.status(201).json({success: true, user: newUser});
  } catch (err) {
    res.status(400).json({success:false ,message: err.message });
  }
});


async function getUser(req, res, next) {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.user = user;
    next();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

module.exports = router;
