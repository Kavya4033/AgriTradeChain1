const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const Customer = require('../models/customer'); 
const Farmer = require('../models/farmer');    

// Unified Registration Route
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, role, walletAddress } = req.body;

        const existingCustomer = await Customer.findOne({ email });
        const existingFarmer = await Farmer.findOne({ email });
        if (existingCustomer || existingFarmer) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        if (role === 'Farmer') {
            const newFarmer = new Farmer({ name, email, password: hashedPassword, walletAddress });
            await newFarmer.save();
            return res.status(201).json({ message: 'Farmer registered successfully!' });
        } else if (role === 'Customer') {
            const newCustomer = new Customer({ name, email, password: hashedPassword, walletAddress });
            await newCustomer.save();
            return res.status(201).json({ message: 'Customer registered successfully!' });
        } else {
            return res.status(400).json({ message: 'Invalid role specified' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
