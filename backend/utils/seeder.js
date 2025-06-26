// backend/utils/seeder.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/UserModel');        // Path is now ../models/UserModel
const Listing = require('../models/ListingModel');  // Path is now ../models/ListingModel
const connectDB = require('../config/db');        // Path is now ../config/db

// Load .env variables from the root of the backend folder (one level up from utils)
dotenv.config({ path: '../.env' }); // Adjusted path for .env

connectDB(); // Establish database connection

// --- Dummy Data ---
const usersToCreate = [
    { username: "rajeshK", password: "passwordRajesh" },
    { username: "priyaS", password: "passwordPriya" },
    { username: "amitV", password: "passwordAmit" },
    { username: "sunitaM", password: "passwordSunita" }
];

const importData = async () => {
    try {
        console.log('Attempting to clear existing data...');
        // Clear existing data (BE CAREFUL with this in a non-dev environment)
        await User.deleteMany({});
        await Listing.deleteMany({});
        console.log('Existing data cleared.');

        console.log('Inserting users...');
        // Insert users. The pre-save hook in UserModel will hash passwords.
        const createdUsers = await User.insertMany(usersToCreate);
        console.log(`${createdUsers.length} Users Imported and Passwords Hashed!`);

        // Map usernames to their new _id for easy lookup
        const userMap = {};
        createdUsers.forEach(user => {
            userMap[user.username] = user._id;
            console.log(`User: ${user.username}, ID: ${user._id}`);
        });

        // Prepare listings data, referencing the new user _ids
        const listingsToCreate = [
            {
                user: userMap["rajeshK"],
                title: "Spacious 3 BHK in Koramangala",
                location: "Bangalore", price: 65000, bedrooms: 3, bathrooms: 3, area: 1800,
                type: "Apartment", furnishedStatus: "Semi-Furnished", listedBy: "Owner",
                imageUrl: "https://img.freepik.com/free-photo/photorealistic-house-with-wooden-architecture-timber-structure_23-2151302742.jpg?semt=ais_hybrid",
                description: "Well-ventilated 3 BHK apartment with modern amenities, car parking, and close to tech parks. Ideal for families or working professionals."
            },
            {
                user: userMap["priyaS"],
                title: "Cozy 1 BHK Studio, Andheri West",
                location: "Mumbai", price: 32000, bedrooms: 1, bathrooms: 1, area: 650,
                type: "Apartment", furnishedStatus: "Furnished", listedBy: "Owner",
                imageUrl: "https://img.freepik.com/premium-photo/wood-cottage-with-warm-welcoming-house-ai-generative_724548-36379.jpg",
                description: "Fully furnished studio apartment perfect for singles. Walking distance to Andheri station. Includes AC, bed, wardrobe."
            },
            {
                user: userMap["amitV"],
                title: "Independent House, Jubilee Hills",
                location: "Hyderabad", price: 90000, bedrooms: 4, bathrooms: 4, area: 3200,
                type: "House", furnishedStatus: "Unfurnished", listedBy: "Owner",
                imageUrl: "https://th.bing.com/th/id/OIP.ia5CcYvxeClx8VmDzGxMOwHaFP?r=0&w=500&h=354&rs=1&pid=ImgDetMain&cb=idpwebp2&o=7&rm=3",
                description: "Large independent house with a beautiful private garden and ample parking. Prime, peaceful locality."
            },
            {
                user: userMap["rajeshK"],
                title: "Modern 2 BHK, Powai Lake View",
                location: "Mumbai", price: 72000, bedrooms: 2, bathrooms: 2, area: 1150,
                type: "Apartment", furnishedStatus: "Furnished", listedBy: "Dealer",
                imageUrl: "https://th.bing.com/th/id/OIP.HYm-GfgO-8ZhAVV6pj3qjAHaEK?r=0&w=500&h=281&rs=1&pid=ImgDetMain&cb=idpwebp2&o=7&rm=3",
                description: "Luxurious 2 BHK in a premium complex with lake view. Includes modular kitchen and society amenities."
            },
            {
                user: userMap["sunitaM"],
                title: "Builder Floor 3BHK, GK-1",
                location: "Delhi", price: 58000, bedrooms: 3, bathrooms: 2, area: 1600,
                type: "Condo", furnishedStatus: "Semi-Furnished", listedBy: "Builder",
                imageUrl: "https://uploads-ssl.webflow.com/5f22d189a16bc89db91674a4/60f204a581d3a5899ec0d701_log%20home-4.3-p-1080.jpeg",
                description: "Newly constructed builder floor with lift and stilt parking. Spacious rooms and good quality fittings."
            }
        ];

        console.log('Inserting listings...');
        const createdListings = await Listing.insertMany(listingsToCreate);
        console.log(`${createdListings.length} Listings Imported!`);

        console.log('Data Import Success!');
        process.exit(0); // Success
    } catch (error) {
        console.error(`Data Import Error: ${error.message}`);
        console.error(error.stack);
        process.exit(1); // Failure
    }
};

const destroyData = async () => {
    try {
        console.log('Attempting to destroy all data...');
        await User.deleteMany({});
        await Listing.deleteMany({});
        console.log('All Data Destroyed!');
        process.exit(0);
    } catch (error) {
        console.error(`Data Destroy Error: ${error.message}`);
        process.exit(1);
    }
};

// Process command line arguments
if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}