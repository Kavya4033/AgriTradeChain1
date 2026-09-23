const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { 
        type: String, 
        required: true, 
        enum: ['Farmer', 'Buyer', 'Logistics'] // Restricts input to only these 3 roles
    },
    walletAddress: { type: String, required: true } // Stores their blockchain wallet public key
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
