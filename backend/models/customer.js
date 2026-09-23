const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'Customer' }, // Automatically sets the role to Customer
    walletAddress: { type: String, required: true }
}, { timestamps: true });

// This creates the separate "customers" collection in your database
module.exports = mongoose.model('Customer', CustomerSchema);
