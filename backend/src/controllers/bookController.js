import { booksDBPool } from "../dbConfig/get-db.js";
import {
  insertBookQuery,
  insertNewCheckInQuery,
  updateBookQuery,
} from "../queries/bookQueries.js";

export const getAllBooks = async (req, res) => {
  const client = await booksDBPool.connect();

  try {
    // Query to get all books that are checked in
    const allBooksQuery = `SELECT * FROM books;`;
    const { rows } = await client.query(allBooksQuery);

    res.status(200).json({
      message: "All checked-in books retrieved successfully.",
      books: rows,
    });
  } catch (error) {
    console.error("❌ Error retrieving checked-in books:", error);
    res.status(500).json({ message: "Server Error" });
  } finally {
    client.release();
  }
};

export const uploadBook = async (req, res) => {
  const userId = req.userId;
  const {
    title,
    isbn,
    revision_number: book_revision_number,
    authors: bookAuthors,
    genre,
    description,
    published_date: date_published,
    publisher,
  } = req.body;
  console.log({
    title,
    isbn,
    revision_number: book_revision_number,
    authors: bookAuthors,
    genre,
    description,
    publisher,
  });
  const client = await booksDBPool.connect();
  try {
    await client.query("BEGIN");
    if (!userId) {
      res.status(404).json({ message: "User Id Not Found" });
    }
    const book_cover_image = req.file ? req.file.filename : null;
    const allAuthors = JSON.parse(bookAuthors);
    const authors = JSON.stringify(allAuthors);
    const revision_number = parseInt(book_revision_number);
    const published_date = new Date(date_published);
    let cover_page_image = book_cover_image;
    const bookResult = await client.query(insertBookQuery, [
      cover_page_image,
      title,
      isbn,
      revision_number,
      published_date,
      publisher,
      authors,
      genre,
      description,
    ]);
    const book = bookResult.rows[0];

    await client.query("COMMIT"); // Commit transaction
    res.status(201).json({
      message: "Book added successfully",
      book,
    });
  } catch (error) {
    await client.query("ROLLBACK"); // Rollback on error
    console.error("Error adding book:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const updateBook = async (req, res) => {
  const bookId = req.params.id; // Get book ID from request params
  const userId = req.userId; // Assuming authentication middleware sets userId
  console.log({ userId, bookId });

  const {
    title,
    isbn,
    revision_number: book_revision_number,
    authors: bookAuthors,
    genre,
    description,
    published_date,
  } = req.body;

  const client = await booksDBPool.connect();

  try {
    await client.query("BEGIN"); // Start transaction

    if (!userId) {
      return res.status(404).json({ message: "User ID Not Found" });
    }

    // Check if the book exists
    const bookExists = await client.query("SELECT * FROM books WHERE id = $1", [
      bookId,
    ]);

    if (bookExists.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Book not found" });
    }

    // Parse and stringify authors if provided
    const authors = bookAuthors
      ? JSON.stringify(JSON.parse(bookAuthors))
      : null;

    // Handle optional file upload
    const book_cover_image = req.file
      ? req.file.filename
      : bookExists.rows[0].cover_page_image;

    const updated_at = new Date();
    const revision_number = book_revision_number
      ? parseInt(book_revision_number)
      : bookExists.rows[0].revision_number;

    const updatedBook = await client.query(updateBookQuery, [
      book_cover_image,
      title,
      isbn,
      revision_number,
      published_date,
      authors,
      genre,
      description,
      updated_at,
      bookId,
    ]);

    await client.query("COMMIT"); // Commit transaction
    res.status(200).json({
      message: "Book updated successfully",
      book: updatedBook.rows[0],
    });
  } catch (error) {
    await client.query("ROLLBACK"); // Rollback transaction on error
    console.error("❌ Error updating book:", error);
    res.status(500).json({ message: "Server Error" });
  } finally {
    client.release(); // Release connection back to pool
  }
};

export const checkoutSelectedBook = async (req, res) => {
  const { book_id, days_to_borrow } = req.body;
  const userId = req.userId;

  const client = await booksDBPool.connect();
  console.log({ book_id, days_to_borrow });
  try {
    await client.query("BEGIN");
    if (!userId) {
      res.status(401).json({ message: "Not Authorized Access" });
    }
    const reader_id = userId;
    // Validate if the book exists
    const bookExists = await client.query("SELECT * FROM books WHERE id = $1", [
      book_id,
    ]);
    if (bookExists.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Book not found" });
    }

    // Validate if the user exists
    const userExists = await client.query("SELECT * FROM users WHERE id = $1", [
      reader_id,
    ]);
    if (userExists.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Reader not found" });
    }

    // Check if the book is already checked out
    const activeCheckout = await client.query(
      "SELECT * FROM books WHERE id = $1 AND is_checked_in = false",
      [book_id]
    );

    if (activeCheckout.rows.length > 0) {
      await client.query("ROLLBACK");
      return res.status(400).json({ message: "Book is already checked out" });
    }

    const checked_out_date = new Date();
    const expected_check_in_date = new Date();
    expected_check_in_date.setDate(
      checked_out_date.getDate() + parseInt(days_to_borrow)
    );

    // Insert checkout record
    const checkoutQuery = `
      UPDATE books
      SET reader_id = $1,
          checked_out_date = $2,
          expected_check_in_date = $3,
          is_checked_in = false
      WHERE id = $4
      RETURNING *;
    `;

    const checkoutResult = await client.query(checkoutQuery, [
      reader_id,
      checked_out_date,
      expected_check_in_date,
      book_id,
    ]);

    await client.query("COMMIT");
    res.status(201).json({
      message: "Book checked out successfully",
      checkout: checkoutResult.rows[0],
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("❌ Error checking out book:", error);
    res.status(500).json({ message: "Server Error" });
  } finally {
    client.release();
  }
};

export const searchBooks = async (req, res) => {
  const client = await booksDBPool.connect();

  try {
    const { title, publisher } = req.query;
    console.log(title, publisher);

    let query = `SELECT * FROM books WHERE 1=1`; // Base query
    let values = [];
    let index = 1;

    if (title) {
      query += ` AND LOWER(title) LIKE $${index}`;
      values.push(`%${title.toLowerCase()}%`);
      index++;
    }

    if (publisher) {
      query += ` AND LOWER(publisher) LIKE $${index}`;
      values.push(`%${publisher.toLowerCase()}%`);
      index++;
    }

    const result = await client.query(query, values);

    res.status(200).json({ books: result.rows });
  } catch (error) {
    console.error("❌ Error searching for books:", error);
    res.status(500).json({ message: "Server Error" });
  } finally {
    client.release();
  }
};

export const checkInBook = async (req, res) => {
  const client = await booksDBPool.connect();
  const { bookId } = req.params; // Book ID from request
  const userId = req.userId; // Logged-in user's ID
  console.log({ bookId });
  try {
    await client.query("BEGIN");

    if (!userId) {
      res.status(401).json({ message: "Not Authorized Access" });
    }

    // Check if the book is borrowed by the current user and is not checked in
    const checkBookQuery = `
      SELECT * FROM books
      WHERE id = $1 AND reader_id = $2 AND is_checked_in = false;
    `;
    const { rows } = await client.query(checkBookQuery, [bookId, userId]);

    if (rows.length === 0) {
      await client.query("ROLLBACK");
      return res
        .status(404)
        .json({ message: "No checked-out book found for this user." });
    }

    // Update book to mark it as checked in
    const checkInQuery = `
      UPDATE books
      SET is_checked_in = true, updated_at = NOW()
      WHERE id = $1 AND reader_id = $2 AND is_checked_in = false
      RETURNING *;
    `;
    const checkedInBook = await client.query(checkInQuery, [bookId, userId]);

    await client.query("COMMIT");
    res.status(200).json({
      message: "Book successfully checked in.",
      checkedInBook: checkedInBook.rows[0],
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("❌ Error checking in book:", error);
    res.status(500).json({ message: "Server Error" });
  } finally {
    client.release();
  }
};
