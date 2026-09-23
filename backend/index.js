const express = require('express');
const connectDB = require('./config/db');

const app = express();
connectDB();

app.use(express.json());

// Main App Route Bindings
app.use('/api/auth', require('./routes/auth'));       // Handles customer & farmer registration
app.use('/api/listings', require('./routes/listings')); // Handles listing management

const PORT = 5000;
app.listen(PORT, () => console.log(`AgriTradeChain server executing on port ${PORT}`));
