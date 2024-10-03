const mongoose = require('mongoose');


const paymentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
});

const Payment = mongoose.model('ajo_payments', paymentSchema);

module.exports = Payment;
