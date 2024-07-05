const mongoose = require('mongoose');


const adminSchema = new mongoose.Schema({

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


const Admin = mongoose.model('ajo_admins', adminSchema);

module.exports = Admin;
