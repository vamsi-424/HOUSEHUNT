import React from 'react';
// import './ListingCard.css';

function ListingCard({ listing, currentUser, onEdit, onDelete }) {
    const { _id, title, location, price, bedrooms, bathrooms, area, type, furnishedStatus, imageUrl, description, user, listedBy } = listing;
    const posterUsername = user ? user.username : 'Unknown User'; // Backend populates user object with username

    const canEditOrDelete = currentUser && user && currentUser._id === user._id;

    return (
        <div className="listing-card" data-id={_id}>
            <img src={imageUrl || 'https://via.placeholder.com/300x200/cccccc/000000?text=No+Image'} alt={title} />
            <h3>{title}</h3>
            <p className="location"><strong>Location:</strong> {location}</p>
            <p className="price">₹{price.toLocaleString('en-IN')}/month</p>
            <p className="details">
                {bedrooms > 0 ? `${bedrooms} BHK` : 'Studio'} |
                {bathrooms} Bath(s) |
                {area} sq ft
            </p>
            <p className="extra-details">
                <strong>Type:</strong> {type} |
                <strong>Furnished:</strong> {furnishedStatus}
            </p>
             <p className="poster-info">Posted by: {posterUsername} (Listed as: {listedBy})</p>
            <p className="description">
                {description ?
                    (description.length > 100 ? description.substring(0, 100) + '...' : description) :
                    'No description available.'}
            </p>
            {canEditOrDelete && (
                <div className="listing-card-actions">
                    <button className="edit-btn" onClick={() => onEdit(listing)}>Edit</button>
                    <button className="delete-btn" onClick={() => onDelete(_id)}>Delete</button>
                </div>
            )}
        </div>
    );
}

export default ListingCard;