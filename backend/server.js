// backend/server.js

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const listingRoutes = require('./routes/listingRoutes'); // Make sure this path is correct
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// It's good practice to log before you use a variable if you're debugging its import
console.log("BACKEND server.js: About to mount routes. typeof listingRoutes:", typeof listingRoutes); // MOVED LOG & ADDED TYPEOF

app.use('/api/users', userRoutes);

// Check if listingRoutes is valid before using it
if (listingRoutes && typeof listingRoutes === 'function') { // Express router is a function
    app.use('/api/listings', listingRoutes);
    console.log("BACKEND server.js: Successfully mounted listingRoutes at /api/listings."); // LOG WHEN SUCCESSFUL
} else {
    console.error("BACKEND server.js: ERROR - listingRoutes is not a valid router or is undefined. Cannot mount at /api/listings.");
    console.error("BACKEND server.js: Actual typeof listingRoutes is:", typeof listingRoutes);
}


app.get('/', (req, res) => {
    res.send('API is running...');
});


app.use(notFound);
app.use(errorHandler);

// THIS LOG WAS MISPLACED - it would print regardless of whether listingRoutes was successfully mounted or not.
// console.log("BACKEND server.js: Mounted listingRoutes at /api/listings"); // REMOVE FROM HERE

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); // Changed to callback for cleaner log