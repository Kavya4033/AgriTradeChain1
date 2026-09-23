const express = require('express');
const connectDB = require('./config/db');

const app = express();

// Connect to MongoDB Database
connectDB();

// Middleware to parse incoming JSON payloads
app.use(express.json());

// Set up App Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/listings', require('./routes/listings'));

const PORT = 5000;
app.listen(PORT, () => console.log(`AgriTradeChain server running on port ${PORT}`));
