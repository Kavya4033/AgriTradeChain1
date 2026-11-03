const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret_agritradechain_jwt_key_2026';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

const generateToken = (user) => {
    const payload = {
        id: user._id ? user._id.toString() : user.id,
        email: user.email?.toLowerCase(),
        role: user.role,
        name: user.name,
        walletAddress: user.walletAddress
    };

    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

const verifyTokenString = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (err) {
        return null;
    }
};

module.exports = {
    generateToken,
    verifyTokenString,
    JWT_SECRET
};
