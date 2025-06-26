const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

console.log('In userRoutes.js, typeof registerUser:', typeof registerUser);

console.log('registerUser is:', typeof registerUser); // Should be 'function'
console.log('loginUser is:', typeof loginUser);       // Should be 'function'
console.log('protect is:', typeof protect); 

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile); // Example protected route

module.exports = router;