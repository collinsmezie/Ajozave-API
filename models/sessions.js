const mongoose = require('mongoose');


const sessionSchema = new mongoose.Schema({

    sessionTitle: {
        type: String,
        required: true
    },

    payoutAmount: {
        type: Number,
        required: true
    },

    maximumParticipants: {
        type: Number,
        required: true
    },

    interestedMembers: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    ],

    payoutRecipient: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User',
        default: null
    },

    confirmedMembers : {
        type: [{ type: mongoose.Schema.Types.Mixed }],
        default: []
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
