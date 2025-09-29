// server/models/User.js

//import required packages
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define User schema
const userSchema = new mongoose.Schema({
    //username field
    username:{
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        trim: true, //remove whitespace
        minlength: [3, 'Username must be at least 3 characters long'],
        maxlength: [20, 'Username cannot exceed 20 characters']
    },

    //email field
    email:{
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        //regex for email validation
        match: [ /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email' ]
    },

    //password field
    password:{
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters long'],
        select: false //exclude password from query results by default
    },

    //fuel prefeerences 
    defaultFuelConsumption: {
        type: Number,
        default: 7.5, //default fuel consumption in liters per 100km
        min: [1, 'Fuel consumption must be at least 1 L/100km'],
        max: [530, 'Fuel consumption cannot exceed 30 L/100km']
    },

    //user statistics 
    totalTrips: {
        type: Number,
        default: 0
    },

    totalDistance: {
        type: Number,
        default: 0 //in kilometers
    },

    totalFuelCost: {
        type: Number,
        default: 0 //in currency
    }
}, {
    timestamps: true,

    toJSON: {
        transform: function(doc, ret) {
            delete ret.password; //remove password field when converting to JSON
            return ret;
        }
    }
}); //automatically manage createdAt and updatedAt fields

//Middleware to hash password before saving
userSchema.pre('save', async function(next) {
    //only hash the password if it has been modified or is new
    if(!this.isModified('password')) {
        return next();
    }
    try {
        //hash the password with a salt round of 12
        const salt = await bcrypt.genSalt(12);
        //hash the password
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});

//Method to compare entered password with hashed password
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

//Method to update user statistics after a trip
userSchema.methods.updateTripStats = function(distance, fuelCost) {
    this.totalTrips += 1;
    this.totalDistance += distance;
    this.totalFuelCost += fuelCost;
    return this.save();
};

//Export User model
module.exports = mongoose.model('User', userSchema);

/**
 * HOW THIS CONNECTS TO YOUR SMARTRAVEL APP:
 * 
 * 1. When someone registers on your app, this model creates a new user
 * 2. When they login, this model finds and validates their password
 * 3. When they complete a trip, this model updates their statistics
 * 4. The fuel consumption setting is saved here for their preferences
 * 
 * EXAMPLE USAGE (you'll use this in your controllers):
 * 
 * // Create a new user
 * const user = await User.create({
 *   username: 'john_doe',
 *   email: 'john@email.com',
 *   password: 'mypassword123'
 * });
 * 
 * // Check password during login
 * const isCorrect = await user.matchPassword('mypassword123'); // true
 * 
 * // Update stats after trip
 * await user.updateTripStats(150, 75.50); // 150km, 75.50 RON
 */