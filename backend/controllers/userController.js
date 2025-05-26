const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');


const registerUser = async (req, res) => {
    try {
        const { username, email, password, profileImage } = req.body;
    
        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'User already exists' });
    
        // Create and save user
        const user = new User({ username, email, password, profileImage });
        await user.save();
    
        res.status(201).json({ message: 'User registered successfully' });
        logger.info(`User ${user.username} registered`);
      } catch (err) {
        logger.error('Registration Error:', err);
        res.status(500).json({ message: 'Server error' });
      }
}


const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
    
        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    
        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
    
        // Create JWT token
        const token = jwt.sign(
          { id: user._id },
          process.env.JWT_SECRET || 'yoursecretkey',
          { expiresIn: '1d' }
        );
    
        res.status(200).json({
          message: 'Login successful',
          token,
          user: {
            id: user._id,
            username: user.username,
            email: user.email,
            profileImage: user.profileImage,
          }
        });
        logger.info(`User ${user.username} logged in`);
    
      } catch (err) {
        logger.error('Login Error:', err);
        res.status(500).json({ message: 'Server error' });
      }
}

const get_user = async (req, res) => {
    try {
      const { id } = req.params;
      const user = await User.findById(id);
      if (!user) return res.status(404).json({ message: 'User not found' });
      res.status(200).json(user);
      logger.info(`User ${user.username} fetched`);
    } catch (error) {
      logger.error('Get User Error:', error);
      res.status(500).json({ message: 'Server error' });
    }
}

const update_user = async (req, res) => {
    try {
        const { id } = req.params;
        const { username, email, profileImage } = req.body;
        const user = await User.findByIdAndUpdate(id, { username, email, profileImage }, { new: true });
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(user);
        logger.info(`User ${user.username} updated`);
    } catch (error) {
        logger.error('Update User Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
} 
module.exports = { registerUser, loginUser, get_user, update_user };