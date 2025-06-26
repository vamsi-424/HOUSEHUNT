import React, { useState, useEffect, useCallback } from 'react';
import './App.css'; // Your main stylesheet
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import FilterSidebar from './components/Filters/FilterSidebar';
import ListingsGrid from './components/Listings/ListingsGrid';
import LoginModal from './components/Auth/LoginModal';
import RegisterModal from './components/Auth/RegisterModal';
import ListingFormModal from './components/Listings/ListingFormModal';

import authService from './services/authService';
import listingService from './services/listingService';

function App() {
    const [currentUser, setCurrentUser] = useState(authService.getCurrentUser());
    const [listings, setListings] = useState([]);
    const [filteredListings, setFilteredListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Modal states
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [showListingFormModal, setShowListingFormModal] = useState(false);
    
    // For editing
    const [editingListing, setEditingListing] = useState(null); 

    const fetchListings = useCallback(async (filters = {}) => {
        setLoading(true);
        setError(null);
        console.log('FRONTEND: Fetching listings with filters:', filters);
        try {
            const data = await listingService.getListings(filters);
            setListings(data);
            setFilteredListings(data); // Initially, all fetched listings are displayed
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch listings');
            console.error("Fetch listings error:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchListings(); // Fetch all listings on initial load
    }, [fetchListings]);

    const handleLogin = (user) => {
        setCurrentUser(user);
        setShowLoginModal(false);
        fetchListings(); // Re-fetch or re-filter listings if needed after login
    };

    const handleRegister = () => { // After successful registration, prompt to login
        setShowRegisterModal(false);
        setShowLoginModal(true); // Or automatically log them in if backend returns token on register
    };

    const handleLogout = () => {
        authService.logout();
        setCurrentUser(null);
        fetchListings(); // Re-fetch or re-filter
    };

    const handleSearch = (filters) => {
        // Option 1: Client-side filtering (if all data is already fetched)
        // let tempFiltered = listings.filter(l => /* your complex filter logic here */);
        // setFilteredListings(tempFiltered);

        // Option 2: Server-side filtering (preferred for larger datasets)
        fetchListings(filters);
    };
    
    const handleResetFilters = () => {
        fetchListings(); // Fetch all listings again
    };

    const openListingFormForAdd = () => {
        if (!currentUser) {
            alert("Please login to post an ad.");
            setShowLoginModal(true);
            return;
        }
        setEditingListing(null);
        setShowListingFormModal(true);
    };

    const openListingFormForEdit = (listing) => {
        if (!currentUser || currentUser._id !== listing.user._id) {
             alert("You can only edit your own listings.");
            return;
        }
        setEditingListing(listing);
        setShowListingFormModal(true);
    };
    
    const handleSaveListing = async (listingData) => {
        setLoading(true);
        try {
            if (editingListing) {
                await listingService.updateListing(editingListing._id, listingData);
            } else {
                await listingService.createListing(listingData);
            }
            setShowListingFormModal(false);
            setEditingListing(null);
            fetchListings(); // Refresh listings
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save listing');
            console.error("Save listing error:", err);
            // Optionally keep modal open or show error in modal
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteListing = async (listingId) => {
        if (!currentUser) return; // Should not happen if delete button is shown correctly

        const listingToDelete = listings.find(l => l._id === listingId);
        if (!listingToDelete || currentUser._id !== listingToDelete.user._id) {
             alert("You can only delete your own listings.");
            return;
        }

        if (window.confirm('Are you sure you want to delete this listing?')) {
            setLoading(true);
            try {
                await listingService.deleteListing(listingId);
                fetchListings(); // Refresh listings
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to delete listing');
                console.error("Delete listing error:", err);
            } finally {
                setLoading(false);
            }
        }
    };


    return (
        <div className="App">
            <Header
                currentUser={currentUser}
                onLogout={handleLogout}
                onShowLogin={() => setShowLoginModal(true)}
                onShowRegister={() => setShowRegisterModal(true)}
            />
            <main>
                <FilterSidebar onSearch={handleSearch} onReset={handleResetFilters} onAddNew={openListingFormForAdd} currentUser={currentUser} />
                <ListingsGrid
                    listings={filteredListings} // Display filtered listings
                    loading={loading}
                    error={error}
                    currentUser={currentUser}
                    onEdit={openListingFormForEdit}
                    onDelete={handleDeleteListing}
                />
            </main>
            <Footer />

            {showLoginModal && (
                <LoginModal
                    onClose={() => setShowLoginModal(false)}
                    onLoginSuccess={handleLogin}
                    onSwitchToRegister={() => { setShowLoginModal(false); setShowRegisterModal(true); }}
                />
            )}
            {showRegisterModal && (
                <RegisterModal
                    onClose={() => setShowRegisterModal(false)}
                    onRegisterSuccess={handleRegister}
                    onSwitchToLogin={() => { setShowRegisterModal(false); setShowLoginModal(true); }}
                />
            )}
            {showListingFormModal && (
                <ListingFormModal
                    onClose={() => { setShowListingFormModal(false); setEditingListing(null);}}
                    onSave={handleSaveListing}
                    listingToEdit={editingListing}
                    currentUser={currentUser}
                />
            )}
        </div>
    );
}

export default App;