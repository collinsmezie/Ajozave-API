const mongoose = require('mongoose');
const Session = require('../models/sessions');

class SessionManager {
  constructor(adminId) {
    if (!mongoose.Types.ObjectId.isValid(adminId)) {
      throw new Error("Invalid admin ID");
    }
    this.adminId = adminId; // Store admin/collector ID
  }

  // Get all sessions for this admin
  async getAllSessions() {
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

    session.members = Array.from(uniqueMemberIds).map(memberId => ({
      member: new mongoose.Types.ObjectId(memberId),
    }));

    await session.save();
    return session;
  }

  // Remove a member from a session owned by this admin
  async deleteMemberFromSession(sessionId, memberId) {
    const session = await Session.findOne({ 
      _id: sessionId, 
      createdBy: this.adminId 
    });
    if (!session) throw new Error("Session not found");

    const memberExists = session.members.some(obj => obj.member.toString() === memberId);
    if (!memberExists) throw new Error("Member not found in session");

    session.members = session.members.filter(obj => obj.member.toString() !== memberId);
    await session.save();

    return session;
  }
}

module.exports = SessionManager;
