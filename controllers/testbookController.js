const Book = require('../models/testbook');
const Author = require('../models/authors');


// Controller for getting all books
async function getAllBooks(req, res) {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
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
  getAllBooks,
  getAllBooksByAuthor,  
};
