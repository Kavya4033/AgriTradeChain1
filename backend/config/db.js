const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Replace with your local MongoDB string or MongoDB Atlas URI string
        const mongoURI = 'mongodb://localhost:27017/agritradechain'; 
        
        await mongoose.connect(mongoURI);
        console.log('MongoDB Connected Successfully...');
    } catch (err) {
        console.error('Database connection failed:', err.message);
        process.exit(1);
    }
};

module.exports = connectDB;
