
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    profilePicture: {
        type: String,
        default: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMSIgaGVpZ2h0PSIxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjwvc3ZnPg=='
    },
    dietPlan: {
        type: String,
        default: ''
    },
    name: {
        type: String,
        default: ''
    },
    phone: {
        type: String,
        default: ''
    },
    location: {
        type: String,
        default: ''
    }
});

module.exports = mongoose.model('User', UserSchema);
