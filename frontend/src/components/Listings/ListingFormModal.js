import React, { useState, useEffect } from 'react';
// import './ListingFormModal.css';

function ListingFormModal({ onClose, onSave, listingToEdit, currentUser }) {
    const [formData, setFormData] = useState({
        title: '',
        location: '',
        price: '',
        bedrooms: '1',
        bathrooms: '1',
        area: '',
        type: 'Apartment',
        furnishedStatus: 'Unfurnished',
        listedBy: 'Owner', // Default, can be selected
        imageUrl: '',
        description: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (listingToEdit) {
            setFormData({
                title: listingToEdit.title || '',
                location: listingToEdit.location || '',
                price: listingToEdit.price || '',
                bedrooms: listingToEdit.bedrooms || '1',
                bathrooms: listingToEdit.bathrooms || '1',
                area: listingToEdit.area || '',
                type: listingToEdit.type || 'Apartment',
                furnishedStatus: listingToEdit.furnishedStatus || 'Unfurnished',
                listedBy: listingToEdit.listedBy || 'Owner',
                imageUrl: listingToEdit.imageUrl || '',
                description: listingToEdit.description || ''
            });
        } else {
             // Reset form for new listing
            setFormData({
                title: '', location: '', price: '', bedrooms: '1', bathrooms: '1',
                area: '', type: 'Apartment', furnishedStatus: 'Unfurnished',
                listedBy: 'Owner', imageUrl: '', description: ''
            });
        }
    }, [listingToEdit]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            // Ensure numeric fields are numbers
            const dataToSave = {
                ...formData,
                price: Number(formData.price),
                bedrooms: Number(formData.bedrooms),
                bathrooms: Number(formData.bathrooms),
                area: Number(formData.area),
                // user field will be added by backend based on token
            };
            await onSave(dataToSave);
        } catch (err) {
             // Error handling is now in App.js for save, but can add specific form errors here if needed
            setError(err.message || "Failed to save listing. Check console for details.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div id="listing-modal" className="modal" style={{ display: 'block' }}>
            <div className="modal-content">
                <span className="close-button" onClick={onClose}>×</span>
                <h2 id="modal-title">{listingToEdit ? 'Edit Listing' : 'Add New Listing'}</h2>
                <form id="listing-form" onSubmit={handleSubmit}>
                    {/* Title */}
                    <label htmlFor="modal-title-input">Title:</label>
                    <input type="text" id="modal-title-input" name="title" value={formData.title} onChange={handleChange} required />

                    {/* Location */}
                    <label htmlFor="modal-location">Location:</label>
                    <input type="text" id="modal-location" name="location" value={formData.location} onChange={handleChange} required />
                    
                    {/* Price */}
                    <label htmlFor="modal-price">Price (₹/month):</label>
                    <input type="number" id="modal-price" name="price" value={formData.price} onChange={handleChange} required />

                    {/* Bedrooms */}
                    <label htmlFor="modal-bedrooms">Bedrooms (BHK):</label>
                    <select id="modal-bedrooms" name="bedrooms" value={formData.bedrooms} onChange={handleChange} required>
                        <option value="0">Studio</option>
                        <option value="1">1 BHK</option>
                        <option value="2">2 BHK</option>
                        <option value="3">3 BHK</option>
                        <option value="4">4+ BHK</option>
                    </select>

                    {/* Bathrooms */}
                    <label htmlFor="modal-bathrooms">Bathrooms:</label>
                    <input type="number" id="modal-bathrooms" name="bathrooms" value={formData.bathrooms} min="1" onChange={handleChange} required />

                    {/* Area */}
                    <label htmlFor="modal-area">Area (sq ft):</label>
                    <input type="number" id="modal-area" name="area" value={formData.area} onChange={handleChange} required />

                    {/* Property Type */}
                    <label htmlFor="modal-property-type">Property Type:</label>
                    <select id="modal-property-type" name="type" value={formData.type} onChange={handleChange} required>
                        <option value="Apartment">Apartment</option>
                        <option value="House">House/Villa</option>
                        <option value="Condo">Builder Floor</option>
                        <option value="Townhouse">Farm House</option>
                    </select>

                    {/* Furnished Status */}
                    <label htmlFor="modal-furnished-status">Furnished Status:</label>
                    <select id="modal-furnished-status" name="furnishedStatus" value={formData.furnishedStatus} onChange={handleChange} required>
                        <option value="Unfurnished">Unfurnished</option>
                        <option value="Semi-Furnished">Semi-Furnished</option>
                        <option value="Furnished">Furnished</option>
                    </select>

                    {/* Listed By */}
                    <label htmlFor="modal-listed-by">Listed By:</label>
                     <select id="modal-listed-by" name="listedBy" value={formData.listedBy} onChange={handleChange} required>
                        <option value="Owner">Owner</option>
                        <option value="Dealer">Dealer</option>
                        <option value="Builder">Builder</option>
                    </select>

                    {/* Image URL */}
                    <label htmlFor="modal-image-url">Image URL:</label>
                    <input type="url" id="modal-image-url" name="imageUrl" value={formData.imageUrl} onChange={handleChange} placeholder="https://example.com/image.jpg" />
                    <small>Use placeholder like: https://via.placeholder.com/300x200</small>

                    {/* Description */}
                    <label htmlFor="modal-description">Description:</label>
                    <textarea id="modal-description" name="description" rows="4" value={formData.description} onChange={handleChange} required></textarea>
                    
                    {error && <p className="auth-message error">{error}</p>}
                    <button type="submit" id="save-listing-btn" disabled={loading}>
                        {loading ? 'Saving...' : (listingToEdit ? 'Update Listing' : 'Save Listing')}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ListingFormModal;