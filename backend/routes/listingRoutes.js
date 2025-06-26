// backend/routes/listingRoutes.js
const express = require('express');
const router = express.Router(); // Ensure router is created
const {
    getListings,
    getListingById,
    createListing,
    updateListing,
    deleteListing,
} = require('../controllers/listingController');
const { protect } = require('../middleware/authMiddleware');

console.log("BACKEND listingRoutes.js: File loaded."); // LOG 4
console.log("BACKEND listingRoutes.js: typeof getListings is:", typeof getListings); // LOG 5

if (typeof getListings === 'function') {
    router.route('/').get(getListings).post(protect, createListing);
    console.log("BACKEND listingRoutes.js: Configured GET and POST on '/' route."); // LOG 6
} else {
    console.error("BACKEND listingRoutes.js: ERROR - getListings is NOT a function. Cannot configure GET '/' route."); // LOG 7
}

// For other routes, ensure controllers are functions too
if (typeof getListingById === 'function' && typeof updateListing === 'function' && typeof deleteListing === 'function') {
     router
         .route('/:id')
         .get(getListingById)
         .put(protect, updateListing)
         .delete(protect, deleteListing);
     console.log("BACKEND listingRoutes.js: Configured GET, PUT, DELETE on '/:id' route."); // LOG 8
} else {
    console.error("BACKEND listingRoutes.js: ERROR - One or more controllers for '/:id' route is not a function.");
}


console.log("BACKEND listingRoutes.js: About to export router."); // LOG 9
module.exports = router; // Ensure router is exported