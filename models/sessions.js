const { required } = require('joi');
const mongoose = require('mongoose');


const sessionSchema = new mongoose.Schema({

  sessionName: {
    type: String,
    required: true
  },

  contributionAmount: {
    type: Number,
    required: true
  },


  duration: {
    type: Number,
    required: true
  },

  numberOfMembers: {
    type: Number,
    required: true
  },

  startDate: {
    type: Date,
    required: true,
    default: Date.now
  },

  members: [
    {
      memberId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      hasPaid: {
        type: Boolean,
        default: false
      },
      paymentDate: {
        type: Date
      }
    }
  ],

  status: {
    type: String,
    enum: ['active', 'inactive', 'completed'],
    default: 'inactive'
  },

  endDate: {
    type: Date,
    required: true
  }


  // interestedMembers: [
  //     { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  // ],

  // payoutRecipient: {
  //     type: mongoose.Schema.Types.ObjectId, ref: 'User',
  //     default: null
  // },

  // confirmedMembers : {
  //     type: [{ type: mongoose.Schema.Types.Mixed }],
  //     default: []
  // }
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
