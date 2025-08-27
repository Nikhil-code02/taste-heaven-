
const Activity = require('../models/Activity');

exports.getActivities = async (req, res) => {
    try {
        const activities = await Activity.find({ user: req.user.id });
        res.json(activities);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.addActivity = async (req, res) => {
    const { activityType, duration } = req.body;

    try {
        const newActivity = new Activity({
            user: req.user.id,
            activityType,
            duration,
        });

        const activity = await newActivity.save();
        res.json(activity);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.deleteActivity = async (req, res) => {
    try {
        let activity = await Activity.findById(req.params.id);

        if (!activity) {
            return res.status(404).json({ msg: 'Activity not found' });
        }

        if (activity.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        await activity.remove();

        res.json({ msg: 'Activity removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
