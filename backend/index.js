const express = require('express');
const cors = require('cors'); // 1. Import cors at the top
const connectDB = require('./config/db');

const app = express();
connectDB();

app.use(cors()); // 2. Enable CORS for all incoming frontend requests
app.use(express.json());

// Main App Route Bindings
app.use('/api/customer', require('./routes/customer'));   
app.use('/api/farmer', require('./routes/farmer'));       
app.use('/api/admin', require('./routes/admin'));         

const PORT = 5000;
app.listen(PORT, () => console.log(`AgriTradeChain server executing on port ${PORT}`));
