const User = require('../models/users');
const Session = require('../models/sessions');
const Admin = require('../models/admins');
const mongoose = require('mongoose');



/// Get All Ajo Sessions
async function getAllSessions(req, res) {
  try {

    // Retrieve all sessions from the database
    const sessions = await Session.find();

    // If no sessions are found, return a 404 status
    if (sessions.length === 0) {
      return res.status(404).json({ message: "No sessions found" });
    }

    // Return the list of sessions with a 200 status code
    res.status(200).json({ message: "Sessions retrieved successfully", sessions });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

/// Get Ajo Session by ID
async function getSessionById(req, res) {
  try {
    const { sessionId } = req.params;


    console.log("Here now", req.params)
    // Attempt to retrieve the session and populate member information
    const session = await Session.findById(sessionId).populate({
      path: "members.member",
      model: "ajo_users",
      select: "username email"
    });

    // If no session is found, return a 404 status
    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    // Return the session details with a 200 status code
    res.status(200).json({ message: "Session retrieved successfully", session });
  } catch (error) {
    console.error("Error fetching session by ID:", error);

    // Check if error is related to MongoDB or server issues
    if (error.name === "CastError" && error.kind === "ObjectId") {
      return res.status(400).json({ error: "Invalid session ID format" });
    }

    res.status(500).json({ error: "An error occurred while retrieving the session" });
  }
}


/// Create New Ajo Session
async function createSession(req, res) {
  try {

    // Use the current authenticated admin from the token
    const admin = req.user;

    if (!admin) {
      return res.status(400).json({ error: 'Admin not found' });
    }

    const session = new Session({
      sessionName: req.body.sessionName,
      contributionAmount: req.body.contributionAmount,
      duration: req.body.duration,
      numberOfMembers: req.body.numberOfMembers,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
    });


    await session.save();
    console.log("session created")

    res.status(201).json({ message: "New session created", session });
  } catch (error) {
    console.log("Error creating session")

    res.status(500).json({ error: error.message });
  }
}


// Add Members to Ajo Session
async function addMembersToSession(req, res) {
  try {

    const { id, members } = req.body;

    // Attempt to find and update the session
    const session = await Session.findById(id);

    // Check if session exists
    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    // Update the session's members array with the provided memberIds
    session.members = members.map(id => ({ member: new mongoose.Types.ObjectId(id) }));

    // Save the updated session document
    await session.save();

    // Return the updated session
    res.status(200).json({
      message: "Members added to session successfully",
      session,
    });
  } catch (error) {
    console.error("Error adding members to session:", error);

    res.status(500).json({ error: "An error occurred while adding members to the session" });
  }
}


// Delete Member from Ajo Session
async function deleteMemberFromSession(req, res) {
  try {
    const { sessionId, memberId } = req.params;

    // Attempt to find the session by ID
    const session = await Session.findById(sessionId);

    // Check if the session exists
    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    // Filter out the member from the session's members array
    const memberExists = session.members.some((member) => member.member.toString() === memberId);
    
    if (!memberExists) {

      return res.status(404).json({ error: "Member not found in session" });
    }

    session.members = session.members.filter((member) => member.member.toString() !== memberId);

    // Save the updated session document
    await session.save();

    // Return the updated session
    res.status(200).json({
      message: "Member removed from session successfully",
      session,
    });
  } catch (error) {
    console.error("Error removing member from session:", error);
    res.status(500).json({ error: "An error occurred while removing the member from the session" });
  }
}







//Join a Session 
async function joinSession(req, res) {
  try {
    const { userId, sessionId } = req.body;

    // Validate input
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    // Check user role
    if (user.role !== 'user') {
      return res.status(400).json({ error: 'Cannot join a session as admin' });
    }

    // Find the session
    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(400).json({ error: 'Session not found' });
    }


    // Check if session is fully filled
    if (session.interestedParticipants.length === session.maximumParticipants) {
      return res.status(403).json({
        message: `${session.sessionTitle} is no longer accepting members`,
        session
      })
    }

    // Add user id to participants array if not already present
    if (!session.interestedParticipants.includes(userId)) {
      session.interestedParticipants.push(userId);
      // Check if the first participant is the user
      // console.log("HERE",session.participants[0].toString(), userId)
      if (session.interestedParticipants[0].toString() === userId) {
        // session.next_recipient = userId;
        await session.save();
        return res.json({
          message: `User - ${user.fullname} joined ${session.sessionTitle} successfully,
                    Please Select Your Preferred Turn: ${session.confirmedMembers.join(', ')}`,
          user: user.fullname,
          session
        })
      }

      await session.save();

      // Retrieve next recipient from users db
      const recipient = session.interestedParticipants[0];
      const recipientUser = await User.findById(recipient);
      if (!recipientUser) {
        return res.status(400).json({ error: 'Next recipient user not found' });
      }

      return res.json({
        message: `User - ${user.fullname} joined ${session.sessionTitle} successfully -
                Waiting for ${recipientUser.fullname} to pick a turn...`,
        user: user.fullname,
        session
      })


    } else {
      return res.json({
        message: `User ${user.fullname} already joined ${session.sessionTitle} - 
            Kindly Check If You're Eligible to Pick A Turn` });
    }

  } catch (error) {
    console.error('Error in joining session:', error);
    return res.status(500).json({ error: 'Server error' });
  }
}


// Pick a turn
async function pickTurn(req, res) {
  try {
    const { userId, sessionId, turn } = req.body;

    //validate input
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    if (!turn) {
      return res.status(400).json({ error: 'turn is required' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(400).json({ error: 'Session not found' });
    }


    //check if the user has already picked a turn
    if (session.confirmedMembers.includes(userId)) {
      return res.status(400).json({ error: `User - ${user.fullname} already picked a turn` });
    }



    // check if user is eligible to pick a turn
    if (session.interestedParticipants[0].toString() === userId) {

      //check if selected turn is within range of available turns
      if (!session.confirmedMembers.includes(turn)) {
        return res.status(400).json({
          error: `Pick a number from ${session.confirmedMembers.filter(item => !isNaN(item))}`
        });
      }

      //remove user from participants array
      session.interestedParticipants.splice(session.interestedParticipants.indexOf(userId), 1);
      //find turn in session turns and replace with user id
      session.confirmedMembers[session.confirmedMembers.indexOf(turn)] = userId;

      await session.save();
      return res.json({
        message: `User - ${user.fullname} picked a turn - ${turn}`,
        user: user.fullname,
        session
      })

    } else {
      // Retrieve next recipient from users db
      const recipient = session.interestedParticipants[0];
      const recipientUser = await User.findById(recipient);
      if (!recipientUser) {
        return res.status(400).json({ error: 'Next recipient user not found' });
      }

      return res.json({
        message: `Waiting for ${recipientUser.fullname} to pick a turn...`,
      })
    }

  } catch (error) {
    console.error('Error in picking turn:', error);
    return res.status(500).json({ error: 'Server error' });
  }
}



// Remove a participant from session
async function exitSession(req, res) {
  try {
    const { userId, sessionId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' })
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({ error: 'user not found' })
    }

    const session = await Session.findById(sessionId);

    if (!session) {
      return res.status(400).json({ error: 'session not found' })
    }

    if (!session.interestedParticipants.includes(userId)) {

      return res.status(400).json({ error: `User - ${user.fullname} not found in ${session.sessionTitle}` });

    } else {

      // Remove user id from participants array
      session.interestedParticipants.splice(session.interestedParticipants.indexOf(userId), 1);
      await session.save()
      return res.json({
        message: `User - ${user.fullname} removed from ${session.sessionTitle} successfully`,
        session
      });
    }

  } catch (error) {

    res.status(400).json({ error: error.message, status: 'error' });
  }

}




module.exports = {
  getAllSessions,
  getSessionById,
  createSession,
  addMembersToSession,
  deleteMemberFromSession,

  joinSession,
  pickTurn,
  exitSession,
};


