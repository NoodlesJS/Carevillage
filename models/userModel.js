const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

userSchema.methods.serialize = function() {
    return {
        name: this.name,
        email: this.email
    };
};

module.exports = mongoose.model('cv_users', userSchema);