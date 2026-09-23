const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    item: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing', required: true }, // 👈 References the lowercase listing table name
    farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'Farmer', required: true },
    transactionHash: { type: String, required: true }, 
    status: { type: String, enum: ['Pending', 'Delivered'], default: 'Pending' }
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);
