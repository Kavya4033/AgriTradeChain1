
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/user');

async function createAdmin() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/agritradechain');

        const name = process.env.ADMIN_NAME;
        const email = process.env.ADMIN_EMAIL?.toLowerCase();
        const password = process.env.ADMIN_PASSWORD;
        const walletAddress = process.env.ADMIN_WALLET;

        if (!name || !email || !password || !walletAddress) {
            throw new Error('Please provide all Admin details using environment variables');
        }

        const existingAdmin = await User.findOne({
            email,
            role: 'Admin'
        });

        if (existingAdmin) {
            console.log('Admin account already exists');
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const admin = new User({
            name,
            email,
            password: hashedPassword,
            role: 'Admin',
            walletAddress
        });

        await admin.save();

        console.log('Admin account created successfully');
    } catch (error) {
        console.log('Error:', error.message);
    } finally {
        await mongoose.disconnect();
    }
}

createAdmin();
