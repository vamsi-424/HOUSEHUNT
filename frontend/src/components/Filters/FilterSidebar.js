import React, { useState } from 'react';
// import './FilterSidebar.css';

function FilterSidebar({ onSearch, onReset, onAddNew, currentUser }) {
    const [location, setLocation] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [bedrooms, setBedrooms] = useState('');
    const [propertyType, setPropertyType] = useState('');
    const [furnishedStatus, setFurnishedStatus] = useState('');
    const [listedBy, setListedBy] = useState('');


    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch({ location, minPrice, maxPrice, bedrooms, propertyType, furnishedStatus, listedBy });
    };

    const handleReset = () => {
        setLocation('');
        setMinPrice('');
        setMaxPrice('');
        setBedrooms('');
        setPropertyType('');
        setFurnishedStatus('');
        setListedBy('');
        onReset();
    };

    return (
        <aside className="filters">
            <h2>Find Your Home</h2>
            <form onSubmit={handleSubmit}>
                <div className="filter-group">
                    <label htmlFor="location">Location:</label>
                    <input type="text" id="location" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g., Mumbai, Delhi" />
                </div>
                <div className="filter-group">
                    <label htmlFor="min-price">Min Price (₹/month):</label>
                    <input type="number" id="min-price" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} placeholder="0" />
                </div>
                <div className="filter-group">
                    <label htmlFor="max-price">Max Price (₹/month):</label>
                    <input type="number" id="max-price" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} placeholder="Any" />
                </div>
                <div className="filter-group">
                    <label htmlFor="bedrooms">Bedrooms (BHK):</label>
                    <select id="bedrooms" value={bedrooms} onChange={(e) => setBedrooms(e.target.value)}>
                        <option value="">Any</option>
                        <option value="1">1 BHK</option>
                        <option value="2">2 BHK</option>
                        <option value="3">3 BHK</option>
                        <option value="4">4+ BHK</option>
                    </select>
                </div>
                <div className="filter-group">
                    <label htmlFor="property-type">Property Type:</label>
                    <select id="property-type" value={propertyType} onChange={(e) => setPropertyType(e.target.value)}>
                        <option value="">Any</option>
                        <option value="Apartment">Apartment</option>
                        <option value="House">House/Villa</option>
                        <option value="Condo">Builder Floor</option>
                        <option value="Townhouse">Farm House</option>
                    </select>
                </div>
                <div className="filter-group">
                    <label htmlFor="furnished-status">Furnished Status:</label>
                    <select id="furnished-status" value={furnishedStatus} onChange={(e) => setFurnishedStatus(e.target.value)}>
                        <option value="">Any</option>
                        <option value="Furnished">Furnished</option>
                        <option value="Semi-Furnished">Semi-Furnished</option>
                        <option value="Unfurnished">Unfurnished</option>
                    </select>
                </div>
                <div className="filter-group">
                    <label htmlFor="listed-by">Listed By:</label>
                     <select id="listed-by" value={listedBy} onChange={(e) => setListedBy(e.target.value)}>
                        <option value="">Any</option>
                        <option value="Owner">Owner</option>
                        <option value="Dealer">Dealer</option>
                        <option value="Builder">Builder</option>
                    </select>
                </div>
                <button type="submit">Search Homes</button>
                <button type="button" onClick={handleReset} id="reset-button">Reset Filters</button>
            </form>
            <hr />
            {currentUser && <button onClick={onAddNew} className="add-button">Post New Ad</button>}
        </aside>
    );
}

export default FilterSidebar;