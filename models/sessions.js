const mongoose = require('mongoose');


const sessionSchema = new mongoose.Schema({

    session_title: {
        type: String,
        required: true
    },

    payout_limit: {
        type: Number,
        required: true
    },

    participants: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    ],

    next_payout: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User',
    },

    defected_participants: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User',
    }
});

// sessionSchema.methods.create = function (title, payout_limit) {
//     const session = new Session({
//         title: title,
//         payout_limit: payout_limit
//     });
//     return session;
// }



const Session = mongoose.model('ajo_sessions', sessionSchema);

module.exports = Session;
