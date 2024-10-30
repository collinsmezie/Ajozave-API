const User = require('../models/users');
const Session = require('../models/sessions');
const Admin = require('../models/admins');


/// Get All Ajo Sessions
async function getAllSessions(req, res) {
  try {

    console.log("Inside Get all sessions")

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



/// Create New Ajo Session
async function createSession(req, res) {
  try {

    // Use the current authenticated admin from the token
    const admin = req.user;
    console.log("Adminaa", admin)

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

    res.status(201).json({ message: "New session created", session });
  } catch (error) {
    res.status(500).json({ error: error.message });
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















// Update a book using mongoose ORM methods
async function updateBook(req, res) {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.json(book);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// Delete a book using mongoose ORM methods
async function deleteBook(req, res) {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}




module.exports = {
  getAllSessions,
  createSession,
  joinSession,
  pickTurn,
  exitSession,
};


