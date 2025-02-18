const mongoose = require('mongoose');
const Session = require('../models/sessions');


class SessionManager {
  constructor(adminId) {
    if (!mongoose.Types.ObjectId.isValid(adminId)) {
      throw new Error("Invalid admin ID");
    }
    this.adminId = adminId; // Store admin/collector ID
  }

  static async getAllSessions() {
    const sessions = await Session.find();
    if (!sessions.length) throw new Error("No sessions found");
    // return sessions;

    //reformat the response to include only select fields
    const formattedSessions = sessions.map((session) => {
      return {
        _id: session._id,
        title: session.sessionName,
        description: session.description,
        amount: session.contributionAmount,
        members: session.numberOfMembers,
      };
    });

    return formattedSessions;
  }

  //Static method to get any session by ID
  static async getAnySessionById(sessionId) {
    if (!mongoose.Types.ObjectId.isValid(sessionId)) {
      throw new Error("Invalid session ID format");
    }

    const session = await Session.findOne({
      _id: sessionId,
    }).populate({
      path: "members.member",
      model: "ajo_users",
      select: "username email",
    });      

    if (!session) throw new Error("Session not found");
    return session;
  }


  // Get all sessions for this admin
  async getAllSessionsByAdmin() {
    const sessions = await Session.find({ createdBy: this.adminId });
    if (!sessions.length) throw new Error("No sessions found for this admin");
    return sessions;
  }

  // Get a single session by ID (owned by this admin)
  async getSessionById(sessionId) {
    if (!mongoose.Types.ObjectId.isValid(sessionId)) {
      throw new Error("Invalid session ID format");
    }

    const session = await Session.findOne({
      _id: sessionId,
      createdBy: this.adminId
    }).populate({
      path: "members.member",
      model: "ajo_users",
      select: "username email",
    });

    if (!session) throw new Error("Session not found");
    return session;
  }

  // Get interested members for a session owned by this admin
  async getInterestedMembers(sessionId) {
    if (!mongoose.Types.ObjectId.isValid(sessionId)) {
      throw new Error("Invalid session ID format");
    }

    const session = await Session.findOne({
      _id: sessionId,
      createdBy: this.adminId
    }).populate({
      path: "interestedMembers",
      model: "ajo_users",
      select: "username email",
    });

    if (!session) throw new Error("Session not found");
    return session.interestedMembers;
  }


  // Create a new session for this admin
  async createSession(sessionData) {
    const session = new Session({
      ...sessionData,
      createdBy: this.adminId, // Associate session with this admin
    });

    await session.save();
    return session;
  }

  // Add members to a session owned by this admin
  async addMembersToSession(sessionId, memberIds) {
    if (!mongoose.Types.ObjectId.isValid(sessionId) || !Array.isArray(memberIds)) {
      throw new Error("Invalid session ID or member IDs format");
    }

    const session = await Session.findOne({
      _id: sessionId,
      createdBy: this.adminId
    });

    if (!session) throw new Error("Session not found");

    const existingMemberIds = session.members.map(obj => obj.member.toString());
    const incomingMemberIds = memberIds.map(id => id.toString());
    const uniqueMemberIds = new Set([...existingMemberIds, ...incomingMemberIds]);

    if (uniqueMemberIds.size > session.numberOfMembers) {
      throw new Error(`Adding these members exceeds the session capacity of ${session.numberOfMembers}`);
    }

    // Update the members array
    session.members = Array.from(uniqueMemberIds).map(memberId => ({
      member: new mongoose.Types.ObjectId(memberId),
    }));

    // Remove added members from the interestedMembers array
    session.interestedMembers = session.interestedMembers.filter(
      (id) => !incomingMemberIds.includes(id.toString())
    );

    await session.save();
    // return session;

    //return only the populated version oof the members array as a response
    const populatedSession = await this.getSessionById(sessionId);
    return populatedSession.members;
    
  }


  // Remove a member from a session owned by this admin
  async deleteMemberFromSession(sessionId, memberId) {
    if (!mongoose.Types.ObjectId.isValid(sessionId) || !mongoose.Types.ObjectId.isValid(memberId)) {
      throw new Error("Invalid session ID or member ID format");
    }

    const session = await Session.findOne({ _id: sessionId, createdBy: this.adminId });
    if (!session) throw new Error("Session not found");

    const memberIndex = session.members.findIndex(obj => obj.member.toString() === memberId);
    if (memberIndex === -1) throw new Error("Member not found in session");

    // Remove the member from the session
    const [removedMember] = session.members.splice(memberIndex, 1);

    // Add the removed member to the interestedMembers array if not already present
    if (!session.interestedMembers.some(obj => obj.toString() === memberId)) {
      session.interestedMembers.push(removedMember.member);
    }

    await session.save();

    // Populate the interestedMembers array with getInterestedMembers method
    const populatedSession = await this.getInterestedMembers(sessionId);

    return populatedSession;

    // return session;
  }


  // Edit a session owned by this admin
  async editSession(sessionId, updateData) {
    const session = await Session.findOneAndUpdate(
      { _id: sessionId, createdBy: this.adminId }, // Ensure session belongs to this admin
      { $set: updateData }, // Update the provided fields
      { new: true, runValidators: true } // Return the updated document and run validations
    );

    if (!session) throw new Error("Session not found or unauthorized access");
    return session;
  }

  // Delete a session owned by this admin
  async deleteSession(sessionId) {
    const session = await Session.findOneAndDelete({
      _id: sessionId,
      createdBy: this.adminId
    });

    if (!session) throw new Error("Session not found or unauthorized access");
    return { message: "Session deleted successfully" };
  }
}

module.exports = SessionManager;

















// const mongoose = require('mongoose');
// const Session = require('../models/sessions');

// class SessionManager {
//   constructor(adminId) {
//     if (!mongoose.Types.ObjectId.isValid(adminId)) {
//       throw new Error("Invalid admin ID");
//     }
//     this.adminId = adminId; // Store admin/collector ID
//   }

//   // Get all sessions for this admin
//   async getAllSessions() {
//     try {
//       const sessions = await Session.find({ createdBy: this.adminId });
//       if (!sessions.length) throw new Error("No sessions found for this admin");
//       return sessions;
//     } catch (error) {
//       throw new Error(`Error retrieving sessions: ${error.message}`);
//     }
//   }

//   // Get a single session by ID (owned by this admin)
//   async getSessionById(sessionId) {
//     try {
//       if (!mongoose.Types.ObjectId.isValid(sessionId)) {
//         throw new Error("Invalid session ID format");
//       }

//       const session = await Session.findOne({
//         _id: sessionId,
//         createdBy: this.adminId
//       }).populate({
//         path: "members.member",
//         model: "ajo_users",
//         select: "username email",
//       });

//       if (!session) throw new Error("Session not found");
//       return session;
//     } catch (error) {
//       throw new Error(`Error retrieving session: ${error.message}`);
//     }
//   }

//   // Create a new session for this admin
//   async createSession(sessionData) {
//     try {
//       const session = new Session({
//         ...sessionData,
//         createdBy: this.adminId, // Associate session with this admin
//       });

//       await session.save();
//       return session;
//     } catch (error) {
//       throw new Error(`Error creating session: ${error.message}`);
//     }
//   }

//   // Add members to a session owned by this admin
//   async addMembersToSession(sessionId, memberIds) {
//     try {
//       if (!mongoose.Types.ObjectId.isValid(sessionId)) {
//         throw new Error("Invalid session ID format");
//       }

//       const session = await Session.findOne({
//         _id: sessionId,
//         createdBy: this.adminId
//       });

//       if (!session) throw new Error("Session not found");

//       const existingMemberIds = session.members.map(obj => obj.member.toString());
//       const incomingMemberIds = memberIds.map(id => id.toString());
//       const uniqueMemberIds = new Set([...existingMemberIds, ...incomingMemberIds]);

//       if (uniqueMemberIds.size > session.numberOfMembers) {
//         throw new Error(`Adding these members exceeds the session capacity of ${session.numberOfMembers}`);
//       }

//       session.members = Array.from(uniqueMemberIds).map(memberId => ({
//         member: new mongoose.Types.ObjectId(memberId),
//       }));

//       await session.save();
//       return session;
//     } catch (error) {
//       throw new Error(`Error adding members: ${error.message}`);
//     }
//   }

//   // Remove a member from a session owned by this admin
//   async deleteMemberFromSession(sessionId, memberId) {
//     try {
//       if (!mongoose.Types.ObjectId.isValid(sessionId) || !mongoose.Types.ObjectId.isValid(memberId)) {
//         throw new Error("Invalid session ID or member ID format");
//       }

//       const session = await Session.findOne({
//         _id: sessionId,
//         createdBy: this.adminId
//       });

//       if (!session) throw new Error("Session not found");

//       const memberExists = session.members.some(obj => obj.member.toString() === memberId);
//       if (!memberExists) throw new Error("Member not found in session");

//       session.members = session.members.filter(obj => obj.member.toString() !== memberId);
//       await session.save();

//       return session;
//     } catch (error) {
//       throw new Error(`Error removing member: ${error.message}`);
//     }
//   }

//   // Edit a session owned by this admin
//   async editSession(sessionId, updateData) {
//     try {
//       if (!mongoose.Types.ObjectId.isValid(sessionId)) {
//         throw new Error("Invalid session ID format");
//       }

//       const session = await Session.findOneAndUpdate(
//         { _id: sessionId, createdBy: this.adminId }, // Ensure session belongs to this admin
//         { $set: updateData }, // Update the provided fields
//         { new: true, runValidators: true } // Return the updated document and run validations
//       );

//       if (!session) throw new Error("Session not found or unauthorized access");
//       return session;
//     } catch (error) {
//       throw new Error(`Error editing session: ${error.message}`);
//     }
//   }

//   // Delete a session owned by this admin
//   async deleteSession(sessionId) {
//     try {
//       if (!mongoose.Types.ObjectId.isValid(sessionId)) {
//         throw new Error("Invalid session ID format");
//       }

//       const session = await Session.findOneAndDelete({
//         _id: sessionId,
//         createdBy: this.adminId
//       });

//       if (!session) throw new Error("Session not found or unauthorized access");
//       return { message: "Session deleted successfully" };
//     } catch (error) {
//       throw new Error(`Error deleting session: ${error.message}`);
//     }
//   }
// }

// module.exports = SessionManager;
