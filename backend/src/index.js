import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRoute from "./routes/userRoute.js";
import bookRoutes from "./routes/bookRoutes.js";
import alertRoutes from "./routes/alertRoutes.js";
import cron from "node-cron";
import { sendDueBookNotifications } from "./controllers/bookNotificationController.js";
import "dotenv/config";

const app = express();
const { FRONTEND_URL, PORT } = process.env;

async function startServer() {
  if (!PORT || !FRONTEND_URL) {
    console.error(
      "PORT and FRONTEND_URL values must not be empty for environment variables"
    );
  }
  app.use(express.json());
  app.use(cookieParser());
  app.use(express.urlencoded({ extended: true }));
  app.use(
    cors({
      origin: FRONTEND_URL,
      credentials: true,
    })
  );
  app.use("/user", userRoute);
  app.use("/books", bookRoutes);
  app.use("/alert", alertRoutes);
  app.use("/book-cover-pics", express.static("src/public/book_cover_pics"));

  cron.schedule("59 23 * * *", () => {
    console.log("⏰ Running daily book notification check at 11:59 PM...");
    sendDueBookNotifications();
  });

  app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
  });
}

startServer();
