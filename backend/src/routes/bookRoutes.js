import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { authVerify } from "../middleware/verifyUser.js";
import {
  checkInBook,
  checkoutSelectedBook,
  getAllBooks,
  searchBooks,
  updateBook,
  uploadBook,
} from "../controllers/bookController.js";

const router = Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.join(__dirname, "../public/book_cover_pics");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure Multer for storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Store images in /uploads directory
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`); // Unique file name
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB size limit
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed!"), false);
    }
    cb(null, true);
  },
});

router.post(
  "/upload-book",
  authVerify,
  upload.single("book_cover_image"),
  uploadBook
);
router.patch(
  "/update-book/:id",
  upload.single("book_cover_image"),
  authVerify,
  updateBook
);
router.patch("/checkout-selected-book", authVerify, checkoutSelectedBook);
router.get("/all-books", getAllBooks);
router.get("/checkin-selected-book/:bookId", authVerify, checkInBook);
// router.get("/get-checkout-books", authVerify, getCheckedOutBooks);
router.get("/search-books", searchBooks);

export default router;
