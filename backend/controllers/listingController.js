// backend/controllers/listingController.js

const asyncHandler = require('express-async-handler');
const Listing = require('../models/ListingModel');
// User model is not directly used in every function here, but it's fine to keep if
// you plan to expand or for consistency if other controllers use it.
// const User = require('../models/UserModel');

// @desc    Get all listings
// @route   GET /api/listings
// @access  Public
const getListings = asyncHandler(async (req, res) => {
    console.log('--- BACKEND listingController: getListings CALLED ---');
    console.log('--- BACKEND listingController: req.originalUrl:', req.originalUrl);
    console.log('--- BACKEND listingController: req.query:', req.query);

    try {
        const filter = {};
        if (req.query.location) {
            filter.location = { $regex: req.query.location, $options: 'i' };
        }
        if (req.query.minPrice) {
            filter.price = { ...filter.price, $gte: Number(req.query.minPrice) };
        }
        if (req.query.maxPrice) {
            filter.price = { ...filter.price, $lte: Number(req.query.maxPrice) };
        }
        if (req.query.bedrooms) {
            if (req.query.bedrooms === '4') { // 4+ BHK
                filter.bedrooms = { $gte: Number(req.query.bedrooms) };
            } else if (Number(req.query.bedrooms) >= 0) { // Also handle "Studio" (0 bedrooms)
                filter.bedrooms = Number(req.query.bedrooms);
            }
        }
        if (req.query.propertyType) {
            filter.type = req.query.propertyType;
        }
        if (req.query.furnishedStatus) {
            filter.furnishedStatus = req.query.furnishedStatus;
        }
        if (req.query.listedBy) {
            filter.listedBy = req.query.listedBy;
        }

        const listings = await Listing.find(filter)
            .populate('user', 'username') // Populate user's username
            .sort({ createdAt: -1 });

        res.json(listings);
    } catch (error) {
        console.error("--- BACKEND listingController: ERROR in getListings DB operation:", error);
        // Ensure status is set before throwing for express-async-handler, or send response directly
        if (!res.headersSent) {
            res.status(500).json({ message: "Server error while fetching listings." });
        }
    }
});

// @desc    Get single listing by ID
// @route   GET /api/listings/:id
// @access  Public
const getListingById = asyncHandler(async (req, res) => {
    console.log('--- BACKEND listingController: getListingById CALLED for ID:', req.params.id);
    try {
        const listing = await Listing.findById(req.params.id).populate('user', 'username');

        if (listing) {
            res.json(listing);
        } else {
            res.status(404); // Set status for express-async-handler to use
            throw new Error('Listing not found');
        }
    } catch (error) {
        console.error(`--- BACKEND listingController: ERROR in getListingById for ID ${req.params.id}:`, error);
        // If it's not the "Listing not found" error we threw, and headers aren't sent, send 500
        if (error.message !== 'Listing not found' && !res.headersSent) {
            res.status(500).json({ message: "Server error while fetching listing." });
        } else if (!res.headersSent) {
            // For "Listing not found" or other errors where status might already be set by us
            // let the global error handler manage the response based on the thrown error
             throw error; // Re-throw for global error handler
        }
    }
});

// @desc    Create a new listing
// @route   POST /api/listings
// @access  Private
const createListing = asyncHandler(async (req, res) => {
    console.log('--- BACKEND listingController: createListing CALLED ---');
    console.log('--- BACKEND listingController: createListing req.body:', req.body);
    console.log('--- BACKEND listingController: createListing req.user:', req.user); // User from protect middleware

    const { title, location, price, bedrooms, bathrooms, area, type, furnishedStatus, listedBy, imageUrl, description } = req.body;

    if (!title || !location || !price || bedrooms == null || bathrooms == null || !area || !type || !furnishedStatus || !listedBy || !description) {
        res.status(400);
        throw new Error('Please fill all required fields');
    }
    if (!req.user || !req.user._id) { // Should be caught by protect middleware, but good check
        res.status(401);
        throw new Error('User not authorized or user ID missing');
    }

    try {
        const listing = new Listing({
            user: req.user._id,
            title,
            location,
            price: Number(price),
            bedrooms: Number(bedrooms),
            bathrooms: Number(bathrooms),
            area: Number(area),
            type,
            furnishedStatus,
            listedBy,
            imageUrl: imageUrl || undefined, // Mongoose default will apply if undefined
            description,
        });

        const createdListing = await listing.save();
        res.status(201).json(createdListing);
    } catch (error) {
        console.error("--- BACKEND listingController: ERROR in createListing:", error);
        if (!res.headersSent) {
            // Check for Mongoose validation error
            if (error.name === 'ValidationError') {
                res.status(400).json({ message: error.message, errors: error.errors });
            } else {
                res.status(500).json({ message: "Server error while creating listing." });
            }
        }
    }
});

// @desc    Update a listing
// @route   PUT /api/listings/:id
// @access  Private
const updateListing = asyncHandler(async (req, res) => {
    console.log('--- BACKEND listingController: updateListing CALLED for ID:', req.params.id);
    console.log('--- BACKEND listingController: updateListing req.body:', req.body);

    try {
        const listing = await Listing.findById(req.params.id);

        if (!listing) {
            res.status(404);
            throw new Error('Listing not found');
        }

        if (!req.user || listing.user.toString() !== req.user._id.toString()) {
            res.status(401);
            throw new Error('User not authorized to update this listing');
        }

        // Update fields selectively
        const { title, location, price, bedrooms, bathrooms, area, type, furnishedStatus, listedBy, imageUrl, description } = req.body;

        if (title) listing.title = title;
        if (location) listing.location = location;
        if (price != null) listing.price = Number(price); // Check for null/undefined to allow 0
        if (bedrooms != null) listing.bedrooms = Number(bedrooms);
        if (bathrooms != null) listing.bathrooms = Number(bathrooms);
        if (area) listing.area = Number(area);
        if (type) listing.type = type;
        if (furnishedStatus) listing.furnishedStatus = furnishedStatus;
        if (listedBy) listing.listedBy = listedBy;
        if (imageUrl !== undefined) listing.imageUrl = imageUrl || listing.schema.paths.imageUrl.defaultValue; // Handle empty string to reset to default or keep
        if (description) listing.description = description;


        const updatedListing = await listing.save();
        res.json(updatedListing);
    } catch (error) {
        console.error(`--- BACKEND listingController: ERROR in updateListing for ID ${req.params.id}:`, error);
         if (error.message === 'Listing not found' || error.message.includes('User not authorized')) {
            throw error; // Let global handler manage already set status
        } else if (!res.headersSent) {
            if (error.name === 'ValidationError') {
                res.status(400).json({ message: error.message, errors: error.errors });
            } else {
                res.status(500).json({ message: "Server error while updating listing." });
            }
        }
    }
});

// @desc    Delete a listing
// @route   DELETE /api/listings/:id
// @access  Private
const deleteListing = asyncHandler(async (req, res) => {
    console.log('--- BACKEND listingController: deleteListing CALLED for ID:', req.params.id);
    try {
        const listing = await Listing.findById(req.params.id);

        if (!listing) {
            res.status(404);
            throw new Error('Listing not found');
        }

        if (!req.user || listing.user.toString() !== req.user._id.toString()) {
            res.status(401);
            throw new Error('User not authorized to delete this listing');
        }

        await listing.deleteOne();
        res.json({ message: 'Listing removed successfully' });
    } catch (error) {
        console.error(`--- BACKEND listingController: ERROR in deleteListing for ID ${req.params.id}:`, error);
        if (error.message === 'Listing not found' || error.message.includes('User not authorized')) {
            throw error; // Let global handler manage already set status
        } else if (!res.headersSent) {
             res.status(500).json({ message: "Server error while deleting listing." });
        }
    }
});

module.exports = {
    getListings,
    getListingById,
    createListing,
    updateListing,
    deleteListing,
};