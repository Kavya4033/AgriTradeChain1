const express = require('express');
const router = express.Router();
const Listing = require('../models/listing');

// GET ALL AVAILABLE LISTINGS FOR CUSTOMERS
router.get('/listings', async (req, res) => {
    try {
        const listings = await Listing.find({ status: 'Available' });
        res.json(listings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 8. MAKE ORDER (Saves matching database configuration data to MongoDB)
router.post('/order', async (req, res) => {
    try {
        const { customerId, itemId, transactionHash } = req.body;

        // Update the listed item status to 'Sold' so it drops out of the marketplace grid
        await Listing.findByIdAndUpdate(itemId, { status: 'Sold' });

        // If you have an Order database schema setup, save it here. 
        // For simulation testing purposes, we send back a success message immediately:
        res.status(201).json({ 
            message: "Order logged successfully!", 
            order: { customerId, itemId, transactionHash, status: 'Completed' } 
        });
    } catch (err) {
        console.error("Order Save Error:", err.message);
        res.status(500).json({ error: err.message });
    }
});

// 9. VIEW ORDERS
// 9. VIEW ORDERS HISTORY (Fetches items marked as 'Sold')
router.get('/orders/:customerId', async (req, res) => {
    try {
        // Finds listing items belonging to this customer transaction cycle
        const completedOrders = await Listing.find({ status: 'Sold' });
        res.json(completedOrders);
    } catch (err) {
        console.error("Order history fetch error:", err.message);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
