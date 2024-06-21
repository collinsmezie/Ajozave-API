const mongoose = require('mongoose');

require('dotenv').config()



const connectDB = async () => {
    try {
        await mongoose.connect(process.env.URI);
        console.log('Connected to MongoDB Successfully');
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error.message);
        process.exit(1);
    }
};

module.exports = connectDB;

//  standalone reusable database connection code file that connects to a mongodb instance and exports the connection object.