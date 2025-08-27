
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getActivities, addActivity, deleteActivity } = require('../controllers/activityController');

router.get('/', auth, getActivities);
router.post('/', auth, addActivity);
router.delete('/:id', auth, deleteActivity);

module.exports = router;
