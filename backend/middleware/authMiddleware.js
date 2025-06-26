const jwt = require('jsonwebtoken');
const User = require('../models/UserModel'); // Ensure UserModel.js path is correct
const asyncHandler = require('express-async-handler');

const protect = asyncHandler(async (req, res, next) => { // 'protect' is defined here
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            // Make sure User model is correctly required and used
            req.user = await User.findById(decoded.id).select('-password'); 
            
            if (!req.user) { // Added this check
                res.status(401);
                throw new Error('Not authorized, user for token not found');
            }
            next();
        } catch (error) {
            console.error('Auth Middleware Error:', error.message); // Log specific auth error
            res.status(401);
            throw new Error('Not authorized, token failed');
        }
    }

    if (!token) {
        res.status(401);
        throw new Error('Not authorized, no token');
    }
});

// THIS IS THE CRUCIAL PART
module.exports = { protect }; // Make sure 'protect' is inside the curly braces