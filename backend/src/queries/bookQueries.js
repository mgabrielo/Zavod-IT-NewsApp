// Insert book into the books table
export const insertBookQuery = `
  INSERT INTO books 
  (cover_page_image, title, isbn, revision_number, published_date, publisher, authors, genre, description, created_at, updated_at) 
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW()) 
  RETURNING *;
    `;

// Update book details
export const updateBookQuery = `
      UPDATE books
      SET 
        cover_page_image = COALESCE($1, cover_page_image),
        title = COALESCE($2, title),
        isbn = COALESCE($3, isbn),
        revision_number = COALESCE($4, revision_number),
        published_date = COALESCE($5, published_date),
        authors = COALESCE($6, authors),
        genre = COALESCE($7, genre),
        description = COALESCE($8, description),
        updated_at = $9
      WHERE id = $10
      RETURNING *;
    `;

export const insertNewCheckInQuery = `
      INSERT INTO checkout_books (book_id, reader_id, checked_out_date, expected_check_in_date, is_checked_in)
      VALUES ($1, NULL, NOW(), NULL, true);
    `;
