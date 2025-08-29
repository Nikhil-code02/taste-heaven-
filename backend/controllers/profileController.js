const User = require('../models/User');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/profile-pictures/';
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter for images only
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

exports.updateProfile = async (req, res) => {
  try {
    const { name, email, phone, location, dietPlan } = req.body;
    const userId = req.user.id;

    // Find user
    let user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Handle file upload if present
    if (req.file) {
      // Delete old profile picture if it exists and is not the default
      if (user.profilePicture && !user.profilePicture.startsWith('http')) {
        const oldImagePath = user.profilePicture;
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      user.profilePicture = req.file.path;
    } else if (req.body.profilePicture !== undefined) {
      // Handle profile picture from JSON (could be a URL or data URI)
      user.profilePicture = req.body.profilePicture;
    }

    // Update other fields
    if (name !== undefined) user.name = name;
    if (email !== undefined) user.email = email;
    if (phone !== undefined) user.phone = phone;
    if (location !== undefined) user.location = location;
    if (dietPlan !== undefined) user.dietPlan = dietPlan;

    await user.save();

    // Return updated user data (excluding password)
    const userResponse = {
      id: user._id,
      username: user.username,
      email: user.email,
      name: user.name,
      phone: user.phone,
      location: user.location,
      profilePicture: user.profilePicture,
      dietPlan: user.dietPlan
    };

    res.json({ user: userResponse });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Middleware for single file upload - only process if content-type is multipart
exports.uploadProfilePicture = (req, res, next) => {
  // Only use multer if the content-type is multipart/form-data
  if (req.headers['content-type'] && req.headers['content-type'].startsWith('multipart/form-data')) {
    upload.single('profilePicture')(req, res, (err) => {
      if (err) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ msg: 'File too large. Maximum size is 5MB.' });
        }
        if (err.message === 'Only image files are allowed!') {
          return res.status(400).json({ msg: 'Only image files are allowed!' });
        }
        return res.status(400).json({ msg: 'File upload error' });
      }
      next();
    });
  } else {
    // Skip file processing for JSON requests
    next();
  }
};
