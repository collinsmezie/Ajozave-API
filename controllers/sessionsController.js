const User = require('../models/users');
const Session = require('../models/sessions');

// Create New Ajo Session
async function createNewSession(req, res) {
    try {
        const { session_title, payout_limit, maximum_participants, userId } = req.body;

        if (!userId) {
            return res.status(400).json({ error: 'userId is required' })
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(400).json({ error: 'user not found' })
        }

        if (user.role !== 'admin') {
            return res.status(400).json({ error: 'user is not an admin - cannot create session' })
        }

        if (!session_title || !payout_limit) {
            return res.status(400).json({ error: '( session title, payout limit) are required fields' })
        }
        const session = new Session({
            session_title,
            payout_limit,
            maximum_participants,
            next_recipient: null,
            turns: [...Array(maximum_participants).keys()].map(i => i + 1)
        })

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
        if (session.participants.length === session.maximum_participants) {
            return res.status(403).json({
                message: `${session.session_title} is no longer accepting members`,
                session
            })
        }

        // Add user id to participants array if not already present
        if (!session.participants.includes(userId)) {
            session.participants.push(userId);
            // Check if the first participant is the user
            // console.log("HERE",session.participants[0].toString(), userId)
            if (session.participants[0].toString() === userId) {
                // session.next_recipient = userId;
                await session.save();
                return res.json({
                    message: `User - ${user.full_name} joined ${session.session_title} successfully,
                    Please Select Your Preferred Turn: ${session.turns.join(', ')}`,
                    user: user.full_name,
                    session
                })
            }

            await session.save();

            // Retrieve next recipient from users db
            const next_recipient = session.participants[0];
            const recipient_user = await User.findById(next_recipient);
            if (!recipient_user) {
                return res.status(400).json({ error: 'Next recipient user not found' });
            }

            return res.json({
                message: `User - ${user.full_name} joined ${session.session_title} successfully -
                Waiting for ${recipient_user.full_name} to pick a turn...`,
                user: user.full_name,
                session
            })


        } else {
            return res.json({
                message: `User ${user.full_name} already joined ${session.session_title} - 
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
        if (session.turns.includes(userId)) {
            return res.status(400).json({ error: `User - ${user.full_name} already picked a turn` });
        }



        // check if user is eligible to pick a turn
        if (session.participants[0].toString() === userId) {

            //check if selected turn is within range of available turns
            if (!session.turns.includes(turn)) {
                return res.status(400).json({
                    error: `Pick a number from ${session.turns.filter(item => !isNaN(item))}`
                });
            }

            //remove user from participants array
            session.participants.splice(session.participants.indexOf(userId), 1);
            //find turn in session turns and replace with user id
            session.turns[session.turns.indexOf(turn)] = userId;

            await session.save();
            return res.json({
                message: `User - ${user.full_name} picked a turn - ${turn}`,
                user: user.full_name,
                session
            })

        } else {
            // Retrieve next recipient from users db
            const next_recipient = session.participants[0];
            const recipient_user = await User.findById(next_recipient);
            if (!recipient_user) {
                return res.status(400).json({ error: 'Next recipient user not found' });
            }

            return res.json({
                message: `Waiting for ${recipient_user.full_name} to pick a turn...`,
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

        if (!session.participants.includes(userId)) {

            return res.status(400).json({ error: `User - ${user.full_name} not found in ${session.session_title}` });

        } else {

            // Remove user id from participants array
            session.participants.splice(session.participants.indexOf(userId), 1);
            await session.save()
            return res.json({
                message: `User - ${user.full_name} removed from ${session.session_title} successfully`,
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
    createNewSession,
    joinSession,
    pickTurn,
    exitSession,
};


