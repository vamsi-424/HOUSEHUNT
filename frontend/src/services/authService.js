import axios from 'axios';

const API_URL = '/api/users/'; // Proxied to backend

// Register user
const register = async (userData) => {
    const response = await axios.post(API_URL + 'register', userData);
    if (response.data && response.data.token) {
        localStorage.setItem('userToken', response.data.token); // Store token
        localStorage.setItem('userInfo', JSON.stringify(response.data)); // Store user info
    }
    return response.data;
};

// Login user
const login = async (userData) => {
    const response = await axios.post(API_URL + 'login', userData);
    if (response.data && response.data.token) {
        localStorage.setItem('userToken', response.data.token);
        localStorage.setItem('userInfo', JSON.stringify(response.data));
    }
    return response.data;
};

// Logout user
const logout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userInfo');
};

// Get current user (can be expanded to verify token with backend)
const getCurrentUser = () => {
    const userInfo = localStorage.getItem('userInfo');
    return userInfo ? JSON.parse(userInfo) : null;
};
const getToken = () => {
    return localStorage.getItem('userToken');
}

const authService = {
    register,
    login,
    logout,
    getCurrentUser,
    getToken,
};

export default authService;