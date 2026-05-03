require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Route files
const authRoutes = require('./routes/authRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const tweetRoutes = require('./routes/tweetRoutes');

const app = express();

// Connect Database
connectDB();
const sendEmail = require("./services/emailService");


// Init Middleware
app.use(express.json({ extended: true }));
app.use(cors());

// Define Routes
app.use('/api/auth', authRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/tweet', tweetRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
