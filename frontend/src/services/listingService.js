import axios from 'axios';
import authService from './authService';

const API_URL = '/api/listings/';

// Create axios instance for authenticated requests
const authAxios = axios.create();

authAxios.interceptors.request.use(
    (config) => {
        const token = authService.getToken();
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


// Get all listings (with filters)
// const getListings = async (filters = {}) => {
//     // Construct query parameters from filters object
//     const params = new URLSearchParams();
//     for (const key in filters) {
//         if (filters[key]) { // Only add if value is present
//              params.append(key, filters[key]);
//         }
//     }
//     const response = await axios.get(API_URL + `?${params.toString()}`);
//     return response.data;
// };
const getListings = async (filters = {}) => {
    const params = new URLSearchParams();
    for (const key in filters) {
        if (filters[key]) {
             params.append(key, filters[key]);
        }
    }
    // Construct the final URL
    const requestUrl = API_URL + (params.toString() ? `?${params.toString()}` : '');
    console.log('FRONTEND listingService: Requesting URL:', requestUrl); // CRUCIAL LOG

    try {
        const response = await axios.get(requestUrl); // Make sure API_URL is used correctly
        return response.data;
    } catch (error) {
        console.error("Error in listingService.getListings:", error.response || error);
        throw error; // Re-throw so App.js can catch it
    }
};
// Create new listing
const createListing = async (listingData) => {
    const response = await authAxios.post(API_URL, listingData);
    return response.data;
};

// Update listing
const updateListing = async (id, listingData) => {
    const response = await authAxios.put(API_URL + id, listingData);
    return response.data;
};

// Delete listing
const deleteListing = async (id) => {
    const response = await authAxios.delete(API_URL + id);
    return response.data;
};


const listingService = {
    getListings,
    createListing,
    updateListing,
    deleteListing,
};
export default listingService;