const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({

    fullname: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true   
    }

    });


const User = mongoose.model('ajo_users', userSchema);

module.exports = User;
