const express = require('express');
const router = express.Router();
const Customer = require('../models/customer');
const Farmer = require('../models/farmer');
const Listing = require('../models/listing');
const Order = require('../models/order');

// GET ALL STATISTICS FOR ADMIN DASHBOARD
router.get('/dashboard', async (req, res) => {
    try {
        // 1. Fetch total counts using your clean separate models
        const totalCustomers = await Customer.countDocuments();
        const totalFarmers = await Farmer.countDocuments();
        
        // 2. Fetch specific filtered counts matching the target criteria
        const activeMarketplaceItems = await Listing.countDocuments({ status: 'Available' });
        const blockchainSettlements = await Order.countDocuments({ status: 'Completed' }); // Or 'Sold' depending on your Order schema

        // 3. Return the response using the naming conventions expected by the admin frontend
        res.json({
            totalCustomers: totalCustomers || 0,
            totalFarmers: totalFarmers || 0,
            activeMarketplaceItems: activeMarketplaceItems || 0,
            blockchainSettlements: blockchainSettlements || 0
        });
    } catch (err) { 
        console.error("Admin metrics compilation error:", err.message);
        res.status(500).json({ error: err.message }); 
    }
});

module.exports = router;
