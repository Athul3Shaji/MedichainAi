require('dotenv').config()
const express = require("express");
const app = express();
const cors = require('cors');
app.use(cors());
app.use(express.json());
const logger = require('./utils/logger');
const fs = require('fs');
const path = require('path');
const morgan = require('morgan');
const connectDB = require("./config/db"); 
const userRoutes = require('./routes/userRoutes');
connectDB();

// Morgan logs to console and file
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'logs/access.log'), { flags: 'a' });
app.use(morgan('combined', { stream: accessLogStream }));

// Routes
app.use('/api/users', userRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
