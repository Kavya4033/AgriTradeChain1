
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const Customer = require('../models/customer');
const Listing = require('../models/listing');
const Order = require('../models/order');

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
        console.error('Customer registration error:', err);
        res.status(500).json({ error: err.message });
    }
});

// CUSTOMER LOGIN
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: 'Email and password are required'
            });
        }

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
        console.error('Customer login error:', err);
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
        console.error('Fetch listings error:', err);
        res.status(500).json({ error: err.message });
    }
});

// MAKE ORDER
router.post('/order', async (req, res) => {
    try {
        const { customerId, itemId, transactionHash } = req.body;

        if (!customerId || !itemId || !transactionHash) {
            return res.status(400).json({
                message: 'Customer ID, Item ID and Transaction Hash are required'
            });
        }

        const customer = await Customer.findById(customerId);

        if (!customer) {
            return res.status(404).json({
                message: 'Customer not found'
            });
        }

        // Only one request can purchase an available listing.
        const listing = await Listing.findOneAndUpdate(
            {
                _id: itemId,
                status: 'Available'
            },
            {
                $set: { status: 'Sold' }
            },
            {
                new: true
            }
        );

        if (!listing) {
            return res.status(400).json({
                message: 'Listing is unavailable or already sold'
            });
        }

        try {
            const newOrder = new Order({
                customer: customer._id,
                item: listing._id,
                farmer: listing.farmer,
                transactionHash,
                status: 'Delivered'
            });

            await newOrder.save();

            const savedOrder = await Order.findById(newOrder._id)
                .populate('customer', 'name email walletAddress')
                .populate('farmer', 'name email walletAddress')
                .populate('item');

            return res.status(201).json({
                message: 'Order logged successfully!',
                order: savedOrder
            });

        } catch (orderError) {
            // Restore listing if order creation fails.
            await Listing.findOneAndUpdate(
                {
                    _id: listing._id,
                    status: 'Sold'
                },
                {
                    $set: { status: 'Available' }
                }
            );

            throw orderError;
        }

    } catch (err) {
        console.error('Create order error:', err);
        res.status(500).json({
            message: 'Failed to create order',
            error: err.message
        });
    }
});

// VIEW CUSTOMER ORDERS
router.get('/orders/:customerId', async (req, res) => {
    try {
        const completedOrders = await Order.find({
            customer: req.params.customerId
        })
            .populate('customer', 'name email')
            .populate('farmer', 'name email walletAddress')
            .populate('item')
            .sort({ createdAt: -1 });

        res.json(completedOrders);

    } catch (err) {
        console.error('Fetch customer orders error:', err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
