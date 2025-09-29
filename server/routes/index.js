const express = require('express');
const router = express.Router();

// Import controllers - UPDATE THIS LINE
const { register, login, logout, getMe } = require('../controllers/authController');
const { createTrip, startTrip, completeTrip, getMyTrips, getTripById, deleteTrip } = require('../controllers/tripController');

// Import middleware
const { protect } = require('../middleware/auth');

// AUTH ROUTES (Public - no authentication needed)
router.post('/api/auth/register', register);
router.post('/api/auth/login', login);
router.post('/api/auth/logout', logout);

// Protected auth route
router.get('/api/auth/me', protect, getMe);

// TRIP ROUTES (Protected - authentication required)
router.post('/api/trips', protect, createTrip);
router.get('/api/trips/my-trips', protect, getMyTrips);
router.get('/api/trips/:id', protect, getTripById);
router.put('/api/trips/:id/start', protect, startTrip);
router.put('/api/trips/:id/complete', protect, completeTrip);
router.delete('/api/trips/:id', protect, deleteTrip);

module.exports = router;