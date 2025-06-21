require('dotenv').config()
const express = require("express");
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();
const logger = require('./utils/logger');
const fs = require('fs');
const path = require('path');
const morgan = require('morgan');
const connectDB = require("./config/db"); 
const userRoutes = require('./routes/userRoutes');
const claimRoutes = require('./routes/claimRoutes');

connectDB();

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true,
}));
app.use(express.json({ limit: '50mb' })); // Increased limit for base64 images
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());

// Serve static files from uploads directory
app.use('/uploads', express.static('uploads'));

// Morgan logs to console and file
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'logs/access.log'), { flags: 'a' });
app.use(morgan('combined', { stream: accessLogStream }));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/claims', claimRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
