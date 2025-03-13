import { Router } from 'express'
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { createNews, deleteNews, getAllNewsDetails, updateNewsLikes } from '../controllers/newsController.js';
import { authVerify } from '../middleware/verifyUser.js';

const router = Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.join(__dirname, "../dbConfig/seeds/news/images");
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

router.post('/add', upload.single("picture"), createNews)
router.patch("/reaction/:newsId/:type", authVerify, updateNewsLikes);
router.get('/all', getAllNewsDetails)
router.delete('/delete/:newsId', deleteNews)

export default router;