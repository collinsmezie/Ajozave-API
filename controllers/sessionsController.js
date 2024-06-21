const User = require('../models/users');
const Session = require('../models/sessions');

// Create New Ajo Session
async function createNewSession(req, res) {
    try {
        const { session_title, payout_limit, userId } = req.body;

        if (!userId) {
            return res.status(400).json({ error: 'userId is required' })
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(400).json({ error: 'user not found' })
        }

        if (user.role !== 'admin') {
            return res.status(400).json({ error: 'user is not an admin' })
        }

        if (!session_title || !payout_limit) {
            return res.status(400).json({ error: '( session title, payout limit) are required fields' })
        }
        const session = new Session({
            session_title: session_title,
            payout_limit: payout_limit
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

        // Add user id to participants array if not already present
        if (!session.participants.includes(userId)) {
            session.participants.push(userId);
            await session.save();

        } else {
            return res.json({ message: `User ${user.full_name} already joined ${session.session_title}` });
        }

        // Return success response
        return res.json({
            message: `User - ${user.full_name} joined ${session.session_title} successfully`,
            user: user.full_name,
            session
        });

    } catch (error) {
        console.error('Error in joining session:', error);
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
    exitSession,
};


