const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const Farmer = require('../models/farmer');
const Listing = require('../models/listing');

// 1. FARMER REGISTER
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, walletAddress, location } = req.body;
        let existing = await Farmer.findOne({ email });
        if (existing) return res.status(400).json({ message: 'Farmer already exists' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newFarmer = new Farmer({ name, email, password: hashedPassword, walletAddress, location });
        await newFarmer.save();
        res.status(201).json({ message: 'Farmer registered successfully!' });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// 2. FARMER LOGIN
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const farmer = await Farmer.findOne({ email });
        if (!farmer) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, farmer.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        res.json({ message: 'Login successful', farmerId: farmer._id });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// 3. ADD ITEM (Create Crop Listing) - FIXED WITH EXPLICIT DEFAULT STATUS
router.post('/items/add', async (req, res) => {
    try {
        const { farmerId, cropType, quantity, priceInEth } = req.body;

        const newListing = new Listing({
            farmer: farmerId, 
            cropType,
            quantity,
            priceInEth,
            status: 'Available' // Enforces explicit state string for UI integration
        });

        await newListing.save();
        res.status(201).json({ message: 'Crop listing added successfully!', item: newListing });
    } catch (err) {
        console.error("Database Save Error:", err.message);
        res.status(500).json({ error: err.message });
    }
});

// 4. UPDATE ITEM
router.put('/items/update/:id', async (req, res) => {
    try {
        const updatedItem = await Listing.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json({ message: 'Crop listing updated!', item: updatedItem });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// 5. REMOVE ITEM
router.delete('/items/remove/:id', async (req, res) => {
    try {
        await Listing.findByIdAndDelete(req.params.id);
        res.json({ message: 'Crop listing deleted successfully!' });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// 6. VIEW OWN LISTINGS (For Dashboard)
router.get('/items/:farmerId', async (req, res) => {
    try {
        const myItems = await Listing.find({ farmer: req.params.farmerId });
        res.json(myItems);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
