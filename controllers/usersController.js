
const User = require('../models/users');

// Controller for creating a new user
async function createUserAccount(req, res) {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ error: '(username, email, password) are required fields' })
    }
    const user = new User({ username, email });
    await user.save();
    // console.log('HERE NOW', req.body);
    res.status(201).json({ message: "new user created", user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}



async function getAllUsers(req, res) {
  try {
    const users = await User.find()
    res.json(users)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}


module.exports = {
  createUserAccount,
  getAllUsers
};
