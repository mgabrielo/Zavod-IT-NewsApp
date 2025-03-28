import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { booksDBPool } from "../dbConfig/get-db.js";

dotenv.config();

// 📌 Nodemailer Configuration
const transporter = nodemailer.createTransport({
  service: "gmail", // Use your email provider
  auth: {
    user: process.env.EMAIL_USER, // Your email
    pass: process.env.EMAIL_PASS, // Your email app password
  },
});

// 📌 Function to send email
const sendEmail = async (to, subject, text) => {
  try {
    await transporter.sendMail({
      from: `"Library Admin" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    });
    console.log(`📧 Email sent to ${to}`);
  } catch (error) {
    console.error("❌ Error sending email:", error);
  }
};

// 📌 API to check overdue books and send notifications
export const sendDueBookNotifications = async (req, res) => {
  const client = await booksDBPool.connect();
  try {
    await client.query("BEGIN");

    // 1️⃣ Notify readers **2 days before expected check-in date**
    const readerQuery = `
      SELECT bc.id, b.title, u.email, bc.expected_check_in_date
      FROM checkout_books bc
      JOIN books b ON bc.book_id = b.id
      JOIN users u ON bc.reader_id = u.id
      WHERE bc.is_checked_in = false
      AND bc.expected_check_in_date = (NOW() + INTERVAL '2 days')::date;
    `;

    const readerResults = await client.query(readerQuery);
    for (const record of readerResults.rows) {
      await sendEmail(
        record.email,
        `Reminder: Return "${record.title}" Soon!`,
        `Dear Reader, please return "${record.title}" by ${record.expected_check_in_date} to avoid penalties.`
      );
    }

    // 2️⃣ Notify librarian **if books are overdue**
    const librarianQuery = `
      SELECT bc.id, b.title, u.username AS reader_name, u.email AS reader_email, bc.expected_check_in_date
      FROM checkout_books bc
      JOIN books b ON bc.book_id = b.id
      JOIN users u ON bc.reader_id = u.id
      WHERE bc.is_checked_in = false
      AND bc.expected_check_in_date < NOW()::date;
    `;

    const librarianResults = await client.query(librarianQuery);
    if (librarianResults.rows.length > 0) {
      const librarianEmail = process.env.LIBRARIAN_EMAIL; // Set librarian's email in .env
      let overdueList = librarianResults.rows
        .map(
          (record) =>
            `📖 "${record.title}" (Reader: ${record.reader_name}, Email: ${record.reader_email}) - Expected: ${record.expected_check_in_date}`
        )
        .join("\n");

      await sendEmail(
        librarianEmail,
        "Overdue Books Alert!",
        `The following books have not been returned on time:\n\n${overdueList}`
      );
    }

    await client.query("COMMIT");
    res.status(200).json({ message: "Notifications sent successfully." });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("❌ Error sending notifications:", error);
    res.status(500).json({ message: "Server Error" });
  } finally {
    client.release();
  }
};
