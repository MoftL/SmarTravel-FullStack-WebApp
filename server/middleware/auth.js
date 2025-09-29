// server/middleware/auth.js

const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Check if user is authenticated
const protect = async (req, res, next) => {
    try {
        let token;

        // Get token from header
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        // Check if token exists
        if (!token) {
            return res.status(401).json({
                message: 'Access denied. Please log in.'
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Get user from database
        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(401).json({
                message: 'User not found. Please log in again.'
            });
        }

        // Add user to request object
        req.user = user;

        // Continue to next function
        next();

    } catch (error) {
        res.status(401).json({
            message: 'Invalid token. Please log in again.'
        });
    }
};

module.exports = { protect };