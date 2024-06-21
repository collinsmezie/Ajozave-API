
const User = require('../models/users');

// Controller for creating a new user
async function createUser(req, res) {
  try {
    const { full_name, email, role = "user"} = req.body;
    if(!full_name || !email) {
      return res.status(400).json({ error: '(full_name, email) are required fields'})
    }
    const user = new User({ full_name, email, role});
    await user.save();
    console.log('HERE NOW', req.body);
    res.status(201).json({ message: "new user created", user});
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}


//Get an author and their books by id using mongoose ORM methods
async function getAuthorById(req, res) {
    try {
        const authorInfo = await Author.findById(req.params.id);
        if (!authorInfo) {
            return res.status(404).json({ error: 'Author not found' });
        }
        // Find all books in the author's books array
        const books = await Book.find({ _id: { $in: authorInfo.books } });
        //check if books array is empty
        if (books.length === 0) {
            return res.json({ authorInfo });
        }
        const author = { 
            firstName: authorInfo.firstName,
            lastName: authorInfo.lastName,
            dob: authorInfo.dob,
            country: authorInfo.country
        }
        
        res.json({ author, books });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}



// Update an author using mongoose ORM methods
async function updateAuthor(req, res) {
    try {
     const author = await Author.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!author) {
            return res.status(404).json({ error: 'Author not found' });
        }
        res.json(author);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}



// Controller for creating a new book
async function createBookByAuthor(req, res) {
  try {
    // extract the authorId from the request parameters
    const authorId = req.params.authorId;
    const newBook = new Book(req.body);
    if (!newBook) {
      return res.status(400).json({ error: 'Bad request' });
    }
    await newBook.save();

    // Update the author's books array
    const author = await Author.findByIdAndUpdate(authorId, { $push: { books: newBook._id } }, { new: true });

    res.status(201).json({ book: newBook, author });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}



// Controller for getting all authors
async function getAllAuthors(req, res) {
  try {
    const authors = await Author.find();
    res.json(authors);
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

    // Find all books with the author's ID
    const books = await Book.find({ authorId: authorId });

    res.json({ author, books });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Controller to update an author's book
async function updateAuthorBook(req, res) {
  try {
    const authorId = req.params.authorId;
    const bookId = req.params.bookId;

    // Find the author by ID
    const author = await Author.findById(authorId);

    // Check if the author exists
    if (!author) {
      return res.status(404).json({ error: 'Author not found' });
    }

    // Check if the author has the book
    if (!author.books.includes(bookId)) {
      return res.status(404).json({ error: "You don't have this book" });
    }

    // Find the book by ID
    const book = await Book.findById(bookId);

    // Check if the book exists
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    // Update the book
    const updatedBook = await Book.findByIdAndUpdate(bookId, req.body, { new: true });

    res.json({ message: 'Book updated successfully', updatedBook });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

  // Controller to delete One book by authorId
  async function deleteOneBook(req, res) {
    try {
      const authorId = req.params.authorId;
      const bookId = req.params.bookId;

      // Find the author by ID
      const author = await Author.findById(authorId);

      // Check if the author exists
      if (!author) {
        return res.status(404).json({ error: 'Author not found' });
      }

      // Find the book by ID
      const book = await Book.findById(bookId);

      // Check if the book exists
      if (!book) {
        return res.status(404).json({ error: 'Book not found' });
      }

      // Delete the book
      await book.deleteOne();

      // Remove the book from the author's books array
      await Author.findByIdAndUpdate(authorId, { $pull: { books: bookId } });

      res.json({ message: 'Book deleted successfully', book });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Controller to delete all books by author
  async function deleteAllBooksByAuthor(req, res) {
    try {
      const authorId = req.params.authorId;

      // Find the author by ID
      const author = await Author.findById(authorId);

      // Check if the author exists
      if (!author) {
        return res.status(404).json({ error: 'Author not found' });
      }

      // Find and delete all books in the author's books array by book ID
      const deletedBooks = await Book.deleteMany({ _id: { $in: author.books } });

      // Remove all books from the author's books array
      await Author.findByIdAndUpdate(authorId, { $set: { books: [] } });

      res.json({ message: 'All books deleted successfully', deletedBooks });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }



  // Controller to delete an author and their books
  async function deleteAuthorAndBooks(req, res) {
    try {
      const authorId = req.params.authorId;

      // Find the author by ID
      const author = await Author.findById(authorId);

      // Check if the author exists
      if (!author) {
        return res.status(404).json({ error: 'Author not found' });
      }

      // Find and delete all books in the author's books array by book ID
      const deletedBooks = await Book.deleteMany({ _id: { $in: author.books } });

      // Delete the author
      await author.deleteOne();

      res.json({ message: 'Author and associated books deleted successfully', deletedBooks });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }




  module.exports = {
    createUser,
    getAuthorById,
    updateAuthor,
    getAllAuthors,
    getAllBooksByAuthor,
  };
