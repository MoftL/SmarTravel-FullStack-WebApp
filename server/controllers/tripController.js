// server/controllers/tripController.js

const Trip = require('../models/Trip');
const User = require('../models/User');

// Create a new trip
const createTrip = async (req, res) => {
    try {
        const {
            startPoint,
            destination,
            startCoordinates,
            destinationCoordinates,
            distance,
            estimatedDuration,
            fuelConsumption,
            fuelCost
        } = req.body;

        // Create trip
        const trip = await Trip.create({
            user: req.user.id,
            startPoint,
            destination,
            startCoordinates,
            destinationCoordinates,
            distance,
            estimatedDuration,
            fuelConsumption: fuelConsumption || req.user.defaultFuelConsumption,
            fuelCost
        });

        res.status(201).json({
            message: 'Trip created successfully',
            trip
        });

    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
};

// Start a trip
const startTrip = async (req, res) => {
    try {
        const trip = await Trip.findById(req.params.id);

        if (!trip) {
            return res.status(404).json({
                message: 'Trip not found'
            });
        }

        if (trip.user.toString() !== req.user.id) {
            return res.status(403).json({
                message: 'Access denied'
            });
        }

        await trip.startTrip();

        res.json({
            message: 'Trip started',
            trip
        });

    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
};

// Complete a trip
const completeTrip = async (req, res) => {
    try {
        const trip = await Trip.findById(req.params.id);

        if (!trip) {
            return res.status(404).json({
                message: 'Trip not found'
            });
        }

        if (trip.user.toString() !== req.user.id) {
            return res.status(403).json({
                message: 'Access denied'
            });
        }

        await trip.completeTrip();

        // Update user stats
        await req.user.updateTripStats(trip.distance, trip.fuelCost);

        res.json({
            message: 'Trip completed',
            trip
        });

    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
};

// Get user's trips
const getMyTrips = async (req, res) => {
    try {
        const trips = await Trip.find({ user: req.user.id })
            .sort({ createdAt: -1 });

        res.json({
            trips
        });

    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
};

// Get trip by ID
const getTripById = async (req, res) => {
    try {
        const trip = await Trip.findById(req.params.id);

        if (!trip) {
            return res.status(404).json({
                message: 'Trip not found'
            });
        }

        if (trip.user.toString() !== req.user.id) {
            return res.status(403).json({
                message: 'Access denied'
            });
        }

        res.json({
            trip
        });

    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
};

// Delete trip
const deleteTrip = async (req, res) => {
    try {
        const trip = await Trip.findById(req.params.id);

        if (!trip) {
            return res.status(404).json({
                message: 'Trip not found'
            });
        }

        if (trip.user.toString() !== req.user.id) {
            return res.status(403).json({
                message: 'Access denied'
            });
        }

        await Trip.findByIdAndDelete(req.params.id);

        res.json({
            message: 'Trip deleted successfully'
        });

    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
};

module.exports = {
    createTrip,
    startTrip,
    completeTrip,
    getMyTrips,
    getTripById,
    deleteTrip
};