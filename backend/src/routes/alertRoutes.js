import express from "express";
import { sendDueBookNotifications } from "../controllers/bookNotificationController.js";

const router = express.Router();

// Run this API daily (or set up a cron job)
router.get("/send-notifications", sendDueBookNotifications);

export default router;
