const mongoose = require('mongoose');

const FarmerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'Farmer' }, // Automatically sets the role to Farmer
    walletAddress: { type: String, required: true },
    location: { type: String } // Farmers might have farm location details
}, { timestamps: true });

// This creates the separate "farmers" collection in your database
module.exports = mongoose.model('Farmer', FarmerSchema);
