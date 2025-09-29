const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
    // Reference to the user
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    // Trip Locations
    startPoint: {
        type: String,
        required: [true, 'Start point is required'],
        trim: true
    },
    destination: {
        type: String,
        required: [true, 'Destination is required'],
        trim: true
    },

    //GPS Coordinates
    startCoordinates: {
        lat:{
            type: Number,
            required: true,
            min: [-90, 'Latitude must be between -90 and 90'],
            max: [90, 'Latitude must be between -90 and 90']
        },
        lon:{
            type: Number,
            required: true,
            min: [-180, 'Longitude must be between -180 and 180'],
            max: [180, 'Longitude must be between -180 and 180']
        }
    },

    destinationCoordinates: {
        lat:{
            type: Number,
            required: true,
            min: [-90, 'Latitude must be between -90 and 90'],
            max: [90, 'Latitude must be between -90 and 90']
        },
        lon:{
            type: Number,
            required: true,
            min: [-180, 'Longitude must be between -180 and 180'],
            max: [180, 'Longitude must be between -180 and 180']
        }
    },

    // Trip Metrics
    distance: {
        type: Number,
        required: [true, 'Distance is required'],
        min: [0, 'Distance cannot be negative'] //in kilometers
    },

    estimatedDuration: {
        type: Number,
        required: [true, 'Estimated duration is required'],
        min: [0, 'Duration cannot be negative'] //in minutes
    },

    actualDuration: {
        type: Number,
        default: null,
        min: [0, 'Duration cannot be negative'] //in minutes
    },

    fuelConsumption: {
        type: Number,
        required: [true, 'Fuel consumption is required'],
        min: [1, 'Fuel consumption cannot be negative'], //in liters
        max: [50, 'Fuel consumption seems too high'],
    },

    fuelCost: {
        type: Number,
        required: [true, 'Fuel cost is required'],
        min: [0, 'Fuel cost cannot be negative'] //in currency
    },
    
    // Trip Timing
    startTime: {
        type: Date,
        default: null
    },

    endTime: {
        type: Date,
        default: null
    },

    //Trip Status
    status: {
        type: String,
        enum: ['planned', 'active', 'completed', 'cancelled'],
        default: 'planned'
    },

    //Route coordinates
    routeCoordinates: [{
        lat: Number,
        lon: Number
    }],

    notes: {
        type: String,
        maxlength: [500, 'Notes cannot exceed 500 characters'],
        trim: true,
    }
}, {
    timestamps: true
});

//Database index to optimize queries by user and creation date
tripSchema.index({ user: 1, createdAt: -1 });

//Index for finding active trips quickly
tripSchema.index({  status: 1 });

//Calculate hoe many liters of fuel were consumed 
tripSchema.virtual('fuelEfficiency').get(function() {
    return (this.distance * this.fuelConsumption) / 100; //liters per 100km
});

// Format duration in hours and minutes
tripSchema.virtual('durationFormatted').get(function() {
    const duration = this.actualDuration || this.estimatedDureation;
    if(duration>= 60) {
        const hours = Math.floor(duration / 60);
        const minutes = duration % 60;
        return minutes===0 ? `${hours}h` : `${hours}h ${minutes}m`;
    }
    return `${duration}m`;
});

// Method to complete a trip
tripSchema.methods.completeTrip = function() {
    this.status = 'completed';
    this.endTime = new Date();

    //Calculate actual duration if startTime is set
    if(this.startTime) {
        this.actualDuration = Math.round((this.endTime - this.startTime) / 60000); //in minutes
    }
    return this.save();
};

// Method to start a trip
tripSchema.methods.startTrip = function() {
    this.status = 'active';
    this.startTime = new Date();
    return this.save();
};

//Get statistics for a user
tripSchema.statics.getUserStats = async function(userId) {
    const stats = await this.aggregate([
        // Match trips by userId
        { $match: { user: userId, status: 'completed' } },
        // Calculate total trips, distance, fuel cost
        { $group: {
            _id: null,
            totalTrips: { $sum: 1 },
            totalDistance: { $sum: '$distance' },
            totalFuelCost: { $sum: '$fuelCost' },
            averageDistance: { $avg: '$distance' },
            averageFuelCost: { $avg: '$fuelCost' }
        }}
    ]);
    
    // Return stats or default values
    return stats[0] || {
        totalTrips: 0,
        totalDistance: 0,
        totalFuelCost: 0,
        averageDistance: 0,
        averageFuelCost: 0
    };
};

//Get recent trips for a user
tripSchema.statics.getRecentTrips = function(userId, limit = 10) {
    return this.find({ user: userId })
        .sort({ createdAt: -1 })
        .limit(limit)
        .select('startPoint destination distance fuelCost status createdAt');
};

/**
 * CREATE THE MODEL
 * 
 * This creates the actual Trip model that your controllers will use
 */ 

module.exports = mongoose.model('Trip', tripSchema);

/**
 * HOW THIS CONNECTS TO YOUR SMARTRAVEL APP:
 * 
 * 1. USER SEARCHES ROUTE:
 *    - App calculates distance, duration, fuel cost
 *    - Creates trip with status 'planned'
 * 
 * 2. USER STARTS ROUTE:
 *    - App calls trip.startTrip()
 *    - Status becomes 'active', startTime is recorded
 * 
 * 3. USER COMPLETES TRIP:
 *    - App calls trip.completeTrip()
 *    - Status becomes 'completed', endTime recorded, actualDuration calculated
 * 
 * 4. USER VIEWS HISTORY:
 *    - App calls Trip.getRecentTrips(userId) to show past trips
 *    - App calls Trip.getUserStats(userId) to show total distance, costs, etc.
 * 
 * EXAMPLE USAGE:
 * 
 * // Create a new trip
 * const trip = await Trip.create({
 *   user: "64f8a1b2c3d4e5f6a7b8c9d0",
 *   startPoint: "Bucharest, Romania",
 *   destination: "Cluj-Napoca, Romania",
 *   startCoordinates: { lat: 44.4268, lon: 26.1025 },
 *   destinationCoordinates: { lat: 46.7712, lon: 23.6236 },
 *   distance: 445.7,
 *   estimatedDuration: 270,
 *   fuelConsumption: 7.5,
 *   fuelPrice: 6.85,
 *   fuelCost: 228.73
 * });
 * 
 * // Start the trip
 * await trip.startTrip();
 * 
 * // Complete the trip
 * await trip.completeTrip();
 * 
 * // Get user's statistics
 * const stats = await Trip.getUserStats(userId);
 * // Returns: { totalTrips: 15, totalDistance: 4567.8, totalFuelCost: 2834.67, ... }
 */

        