
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const Customer = require('../models/customer');
const Listing = require('../models/listing');

// CUSTOMER REGISTER
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, walletAddress } = req.body;

        if (!name || !email || !password || !walletAddress) {
            return res.status(400).json({
                message: 'All fields are required'
            });
        }

        const existingCustomer = await Customer.findOne({
            email: email.toLowerCase()
        });

        if (existingCustomer) {
            return res.status(400).json({
                message: 'Customer already exists'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newCustomer = new Customer({
            name,
            email: email.toLowerCase(),
            password: hashedPassword,
            walletAddress
        });

        await newCustomer.save();

        res.status(201).json({
            message: 'Customer registered successfully!'
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// CUSTOMER LOGIN
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const customer = await Customer.findOne({
            email: email.toLowerCase()
        });

        if (!customer) {
            return res.status(400).json({
                message: 'Invalid credentials'
            });
        }

        const isMatch = await bcrypt.compare(
            password,
            customer.password
        );

        if (!isMatch) {
            return res.status(400).json({
                message: 'Invalid credentials'
            });
        }

        res.json({
            message: 'Login successful',
            customerId: customer._id,
            role: customer.role
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET ALL AVAILABLE LISTINGS
router.get('/listings', async (req, res) => {
    try {
        const listings = await Listing.find({
            status: 'Available'
        });

        res.json(listings);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// MAKE ORDER
router.post('/order', async (req, res) => {
    try {
        const { customerId, itemId, transactionHash } = req.body;

        await Listing.findByIdAndUpdate(
            itemId,
            { status: 'Sold' }
        );

        res.status(201).json({
            message: 'Order logged successfully!',
            order: {
                customerId,
                itemId,
                transactionHash,
                status: 'Completed'
            }
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// VIEW ORDERS
router.get('/orders/:customerId', async (req, res) => {
    try {
        const completedOrders = await Listing.find({
            status: 'Sold'
        });

        res.json(completedOrders);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
