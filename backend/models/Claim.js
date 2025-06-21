// models/Claim.js

const mongoose = require('mongoose');

const ClaimSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
    match: [/^\d{10,15}$/, 'Please enter a valid phone number'],
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/.+@.+\..+/, 'Please enter a valid email address'],
  },
  place:{
    type:String,
    required:true


  },
  description: {
    type: String,
    required: true,
  },
  hospital:{
    type:String,
    required:true
    },
  hospitalLocation:{
    type:String,
    required:true
  },

  claimStatus: {
    type: String,
    enum: ['pending', 'processing','failed','approved'],
    default: 'pending',
  },
  date: {
    type: Date,
    default: Date.now,
  },
  file: {
    type: String, // file URL or path
    required: false,
  },
  

},{
  timestamps:true
});

module.exports = mongoose.model('Claim', ClaimSchema);
