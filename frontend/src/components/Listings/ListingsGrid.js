import React from 'react';
import ListingCard from './ListingCard';
// import './ListingsGrid.css';

function ListingsGrid({ listings, loading, error, currentUser, onEdit, onDelete }) {
    if (loading) {
        return <p className="status-message">Loading listings...</p>;
    }
    if (error) {
        return <p className="status-message error-message">Error: {error}</p>;
    }
    if (!listings || listings.length === 0) {
        return <p id="no-results">No homes found matching your criteria.</p>;
    }

    return (
        <section className="listings-container">
            <h2>Available Rentals</h2>
            <div id="listings-grid">
                {listings.map((listing) => (
                    <ListingCard
                        key={listing._id}
                        listing={listing}
                        currentUser={currentUser}
                        onEdit={onEdit}
                        onDelete={onDelete}
                    />
                ))}
            </div>
        </section>
    );
}

export default ListingsGrid;