const Admin = require('../models/admins');

// Controller for creating a new admin
async function createAdminAccount(req, res) {
  try {
    const { fullname, email, password} = req.body;
    if(!fullname || !email || !password) {
      return res.status(400).json({ error: '(fullname, email and password) are required fields'})
    }
    const admin = new Admin({ fullname, email, password});
    await admin.save();
    res.status(201).json({ message: "New Admin Acoount created", admin});
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}


module.exports = {
  createAdminAccount,  
};
