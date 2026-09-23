const mongoose = require('mongoose');

const ListingSchema = new mongoose.Schema({
    farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    cropType: { type: String, required: true }, // e.g., Wheat, Rice, Corn
    quantity: { type: Number, required: true }, // in kg or tons
    priceInEth: { type: Number, required: true }, // Price designated in Ethereum
    status: { 
        type: String, 
        enum: ['Available', 'Pending', 'Sold'], 
        default: 'Available' 
    }
}, { timestamps: true });

module.exports = mongoose.model('Listing', ListingSchema);
