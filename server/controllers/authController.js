const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Helper function to generate JWT token
const generateToken = (userId) => {
    return jwt.sign(
        { userId },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );
};

// Helper function to send response with token
const sendTokenResponse = (user, statusCode, res) => {
    const token = generateToken(user._id);
    
    const options = {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
    };

    res
        .status(statusCode)
        .cookie('token', token, options)
        .json({
            success: true,
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                defaultFuelConsumption: user.defaultFuelConsumption,
                totalTrips: user.totalTrips,
                totalDistance: user.totalDistance,
                totalFuelCost: user.totalFuelCost
            }
        });
};

// Register function
const register = async (req, res) => {
    try {
        const { username, email, password, defaultFuelConsumption } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide username, email and password'
            });
        }

        const existingUser = await User.findOne({
            $or: [{ email: email.toLowerCase() }, { username }]
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User with this email or username already exists'
            });
        }

        const user = await User.create({
            username,
            email,
            password,
            defaultFuelConsumption: defaultFuelConsumption || 7.5
        });

        sendTokenResponse(user, 201, res);

    } catch (error) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: messages.join(', ')
            });
        }

        res.status(500).json({
            success: false,
            message: 'Server error during registration'
        });
    }
};

// Login function
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password'
            });
        }

        const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        sendTokenResponse(user, 200, res);

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error during login'
        });
    }
};

// Logout function
const logout = async (req, res) => {
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });

    res.status(200).json({
        success: true,
        message: 'User logged out successfully'
    });
};

// Get current user function
const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        
        // Calculate actual stats from completed trips
        const Trip = require('../models/Trip'); // Add this import
        const completedTrips = await Trip.find({ 
            user: req.user.id, 
            status: 'completed' 
        });
        
        const actualStats = {
            totalTrips: completedTrips.length,
            totalDistance: completedTrips.reduce((sum, trip) => sum + trip.distance, 0),
            totalFuelCost: completedTrips.reduce((sum, trip) => sum + trip.fuelCost, 0)
        };
        
        // Update user stats in database
        user.totalTrips = actualStats.totalTrips;
        user.totalDistance = actualStats.totalDistance;
        user.totalFuelCost = actualStats.totalFuelCost;
        await user.save();

        res.status(200).json({
            success: true,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                defaultFuelConsumption: user.defaultFuelConsumption,
                totalTrips: user.totalTrips,
                totalDistance: user.totalDistance,
                totalFuelCost: user.totalFuelCost,
                createdAt: user.createdAt
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// Export all functions - MAKE SURE ALL FUNCTIONS ARE DEFINED ABOVE THIS LINE
module.exports = {
    register,
    login,
    logout,
    getMe
};