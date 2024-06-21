const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({

    full_name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true   
    },

    role: {
        type: String,
        required: true,
        default: "user",
    }

    });


const User = mongoose.model('ajo_users', userSchema);

module.exports = User;
