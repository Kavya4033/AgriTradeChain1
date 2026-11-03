
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        enum: ['Farmer', 'Buyer', 'Customer', 'Logistics', 'Admin']
    },
    walletAddress: {
        type: String,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
