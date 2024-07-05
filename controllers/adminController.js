const Admin = require('../models/admins');

// Controller for creating a new admin
async function createAdmin(req, res) {
  try {
    const { fullname, email} = req.body;
    if(!fullname || !email) {
      return res.status(400).json({ error: '(fullname, email) are required fields'})
    }
    const admin = new Admin({ fullname, email});
    await admin.save();
    res.status(201).json({ message: "new admin created", admin});
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}


// Controller to get all books of an author
async function getAllBooksByAuthor(req, res) {
  try {
    const authorId = req.params.authorId;

    // Find the author by ID
    const author = await Author.findById(authorId);

    // Check if the author exists
    if (!author) {
      return res.status(404).json({ error: 'Author not found' });
    }

    // Find all books in the author's books array
    const books = await Book.find({ _id: { $in: author.books } });

    res.json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


module.exports = {
  createAdmin,
  getAllBooksByAuthor,  
};
