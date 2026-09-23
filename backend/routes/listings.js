const express = require('express');
const router = express.Router();
const Listing = require('../models/listing');

// Create a new crop listing (Farmer only action)
router.post('/create', async (req, res) => {
    try {
        const { farmerId, cropType, quantity, priceInEth } = req.body;
        
        const newListing = new Listing({ farmer: farmerId, cropType, quantity, priceInEth });
        await newListing.save();
        
        res.status(201).json({ message: 'Crop listing created!', listing: newListing });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all available crop listings
router.get('/', async (req, res) => {
    try {
        const listings = await Listing.find({ status: 'Available' }).populate('farmer', 'name walletAddress');
        res.json(listings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
