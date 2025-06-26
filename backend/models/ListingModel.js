const mongoose = require('mongoose');

const listingSchema = mongoose.Schema(
    {
        user: { // Renamed from posterId to user, referencing the User model
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User', // Reference to the User model
        },
        title: { type: String, required: true },
        location: { type: String, required: true },
        price: { type: Number, required: true },
        bedrooms: { type: Number, required: true },
        bathrooms: { type: Number, required: true },
        area: { type: Number, required: true }, // sq ft
        type: { type: String, required: true }, // Apartment, House, etc.
        furnishedStatus: { type: String, required: true }, // Furnished, Semi, Unfurnished
        listedBy: { type: String, required: true }, // Owner, Dealer, Builder (user input for the ad)
        imageUrl: { type: String, default: 'https://via.placeholder.com/300x200/cccccc/000000?text=No+Image' },
        description: { type: String, required: true },
    },
    {
        timestamps: true,
    }
);

const Listing = mongoose.model('Listing', listingSchema);
module.exports = Listing;