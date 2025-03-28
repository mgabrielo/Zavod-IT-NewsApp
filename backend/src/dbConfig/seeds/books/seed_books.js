import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { booksDBPool } from "../../get-db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const imageDirectory = path.join(__dirname, "../../../public/book_cover_pics");
const getImages = () => {
  return fs
    .readdirSync(imageDirectory)
    .filter((file) => /\.(jpg|jpeg|png|gif)$/i.test(file)); // Only include images
};

export const seed = async function (knex) {
  try {
    // Clear existing data
    await knex("books").del();

    const adminUsersRes = await booksDBPool.query(
      "SELECT id,username FROM users WHERE role = $1",
      ["admin"]
    );
    const adminUsers = adminUsersRes.rows;

    if (adminUsers.length === 0) {
      throw new Error(
        "No admin users found. Ensure there are admin users in the database."
      );
    }

    // Sample news data
    let booksData = [];
    const images = getImages();

    for (let i = 0; i <= 11; i++) {
      const imageIndex = i % images.length;
      for (const adminUser of adminUsers) {
        const techBookData = {
          title: `Tech House ${i + 1}`,
          isbn: `978-3-16-148410-${i + 1}`,
          cover_page_image: images[imageIndex],
          revision_number: 1,
          published_date: new Date().toISOString().split("T")[0],
          publisher: adminUser.username,
          authors: JSON.stringify(["Author A", "Author B"]),
          genre: "Technology",
          description: `A book about Tech ${i + 1}`,
        };
        const politicsBookData = {
          title: `Politics House ${i + 1}`,
          isbn: `978-3-16-148420-${i + 1}`,
          cover_page_image: images[imageIndex],
          revision_number: 1,
          published_date: new Date().toISOString().split("T")[0],
          publisher: adminUser.username,
          authors: JSON.stringify(["Author C", "Author D"]),
          genre: "Politics",
          description: `A book about Politics ${i + 1}`,
        };
        const financBookData = {
          title: `Finance House ${i + 1}`,
          isbn: `978-3-16-148430-${i + 1}`,
          cover_page_image: images[imageIndex],
          revision_number: 1,
          published_date: new Date().toISOString().split("T")[0],
          publisher: adminUser.username,
          authors: JSON.stringify(["Author E", "Author F"]),
          genre: "Finance",
          description: `A book about Finance ${i + 1}`,
        };
        booksData.push(techBookData, politicsBookData, financBookData);
      }
    }

    for (const book of booksData) {
      const [{ id: bookId }] = await knex("books")
        .insert({
          title: book.title,
          isbn: book.isbn,
          cover_page_image: book.cover_page_image,
          revision_number: book.revision_number,
          publisher: book.publisher,
          published_date: book.published_date,
          authors: book.authors,
          genre: book.genre,
          description: book.description,
          reader_id: null, // No reader yet
          checked_out_date: null, // Not checked out yet
          expected_check_in_date: null, // No return date
          is_checked_in: true, // Mark as available
        })
        .returning("id");
    }
    console.log("✅ Books Database seeding complete!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
  }
};
