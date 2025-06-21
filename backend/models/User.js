const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  profileImage: {
    type: String,
    default: null,  // Changed to null to indicate no image
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  }
}, {
  timestamps: true // Adds createdAt and updatedAt fields
});


userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});



module.exports = mongoose.model('User', userSchema);
