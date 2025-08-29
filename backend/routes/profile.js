const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { updateProfile, uploadProfilePicture } = require('../controllers/profileController');

// PUT /api/profile - Update user profile (including profile picture and diet plan)
router.put('/', auth, uploadProfilePicture, updateProfile);

module.exports = router;
