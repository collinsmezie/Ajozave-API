const Admin = require('../models/admins');

// Controller for creating a new admin
async function createAdminAccount(req, res) {
  try {
    const { fullName, email, password} = req.body;
    if(!fullName || !email || !password) {
      return res.status(400).json({ error: '(full name, email and password) are required fields'})
    }
    const admin = new Admin({ fullName, email, password});
    await admin.save();
    res.status(201).json({ message: "New Admin Account created", admin});
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}


module.exports = {
  createAdminAccount,  
};
