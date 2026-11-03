const User = require('../models/user');
const Farmer = require('../models/farmer');
const Customer = require('../models/customer');

/**
 * Safely ensures that an account exists across identity collections without
 * overwriting or deleting any existing record.
 */
const syncIdentity = async (identityDoc, role) => {
    try {
        const email = identityDoc.email.toLowerCase().trim();
        const roleNormalized = role === 'Farmer' ? 'Farmer' : (role === 'Customer' ? 'Customer' : 'User');

        // Check if exists in User collection
        let userRecord = await User.findOne({ email });

        if (!userRecord) {
            // Create user mirror with matching _id so that ref: 'User' works seamlessly
            userRecord = new User({
                _id: identityDoc._id,
                name: identityDoc.name,
                email: email,
                password: identityDoc.password,
                role: roleNormalized,
                walletAddress: identityDoc.walletAddress
            });
            await userRecord.save();
        }

        // If it's a Farmer, ensure it exists in Farmer collection
        if (roleNormalized === 'Farmer') {
            const farmerRecord = await Farmer.findOne({ email });
            if (!farmerRecord) {
                const newFarmer = new Farmer({
                    _id: userRecord._id,
                    name: identityDoc.name,
                    email: email,
                    password: identityDoc.password,
                    role: 'Farmer',
                    walletAddress: identityDoc.walletAddress,
                    location: identityDoc.location || 'Local Farm'
                });
                await newFarmer.save();
            }
        }

        // If it's a Customer, ensure it exists in Customer collection
        if (roleNormalized === 'Customer') {
            const customerRecord = await Customer.findOne({ email });
            if (!customerRecord) {
                const newCust = new Customer({
                    _id: userRecord._id,
                    name: identityDoc.name,
                    email: email,
                    password: identityDoc.password,
                    role: 'Customer',
                    walletAddress: identityDoc.walletAddress
                });
                await newCust.save();
            }
        }

        return userRecord;
    } catch (err) {
        // Non-blocking sync error
        console.error('Non-critical syncIdentity error:', err.message);
        return null;
    }
};

module.exports = {
    syncIdentity
};
