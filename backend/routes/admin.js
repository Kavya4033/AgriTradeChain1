
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const User = require('../models/user');
const Customer = require('../models/customer');
const Farmer = require('../models/farmer');
const Listing = require('../models/listing');
const Order = require('../models/order');

// ADMIN LOGIN
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: 'Email and password are required'
            });
        }

        const admin = await User.findOne({
            email: email.toLowerCase(),
            role: 'Admin'
        });

        if (!admin) {
            return res.status(401).json({
                message: 'Invalid Admin credentials'
            });
        }

        const isMatch = await bcrypt.compare(
            password,
            admin.password
        );

        if (!isMatch) {
            return res.status(401).json({
                message: 'Invalid Admin credentials'
            });
        }

        res.json({
            message: 'Admin login successful',
            adminId: admin._id,
            role: admin.role
        });

    } catch (err) {
        console.error('Admin login error:', err.message);
        res.status(500).json({ error: err.message });
    }
});

// ADMIN DASHBOARD STATISTICS
router.get('/dashboard', async (req, res) => {
    try {
        const totalCustomers = await Customer.countDocuments();
        const totalFarmers = await Farmer.countDocuments();

        const activeMarketplaceItems =
            await Listing.countDocuments({ status: 'Available' });

        const blockchainSettlements =
            await Order.countDocuments({ status: 'Completed' });

        res.json({
            totalCustomers,
            totalFarmers,
            activeMarketplaceItems,
            blockchainSettlements
        });

    } catch (err) {
        console.error('Admin metrics error:', err.message);
        res.status(500).json({ error: err.message });
    }
});

// GET ALL REGISTERED FARMERS
router.get('/farmers', async (req, res) => {
    try {
        const farmers = await Farmer.find()
            .select('-password')
            .sort({ createdAt: -1 });

        res.status(200).json(farmers);
    } catch (err) {
        console.error('Error fetching farmers:', err.message);
        res.status(500).json({
            message: 'Unable to fetch farmers'
        });
    }
});

module.exports = router;
