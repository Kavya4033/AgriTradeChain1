const express = require('express');
const router = express.Router();
const ListingItem = require('../models/listing'); // 👈 Updated model name

// Create a new crop listing (Farmer action)
router.post('/create', async (req, res) => {
    try {
        const { farmerId, cropType, quantity, priceInEth } = req.body;
        
        // Maps fields to the ListingItem collection schema
        const newListing = new ListingItem({ farmer: farmerId, cropType, quantity, priceInEth });
        await newListing.save();
        
        res.status(201).json({ message: 'Crop listing created!', listing: newListing });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all available crop listings (Browsed by Customers)
router.get('/', async (req, res) => {
    try {
        // Populates name details from the corresponding "Farmer" collection
        const listings = await ListingItem.find({ status: 'Available' }).populate('farmer', 'name walletAddress');
        res.json(listings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
