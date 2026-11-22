import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import connectDB from "./config/db.js";

// ==================================================
// ROUTES
// ==================================================

import siteSettingsRoutes from "./routes/siteSettingsRoutes.js";
import aboutRoutes from "./routes/aboutRoutes.js";
import servicesRoutes from "./routes/servicesRoutes.js";
import scholarshipRoutes from "./routes/scholarshipRoutes.js";
import employersRoutes from "./routes/employersRoutes.js";
import corporateTrainingRoutes from "./routes/corporateTrainingRoutes.js";

// ==================================================
// MIDDLEWARE
// ==================================================

import notFoundMiddleware from "./middleware/notFoundMiddleware.js";
import errorMiddleware from "./middleware/errorMiddleware.js";

// ==================================================
// ENVIRONMENT CONFIGURATION
// ==================================================

dotenv.config();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ==================================================
// CORS CONFIGURATION
// ==================================================

const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(",").map((url) => url.trim())
  : [];

app.use(
  cors({
    origin: (origin, callback) => {
      if (
        !origin ||
        process.env.NODE_ENV !== "production" ||
        allowedOrigins.includes(origin)
      ) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS."));
    },
  }),
);

// ==================================================
// BODY PARSING MIDDLEWARE
// ==================================================

app.use(express.json({ limit: "1mb" }));

app.use(
  express.urlencoded({
    extended: true,
  }),
);

// ==================================================
// STATIC FILES
// ==================================================

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ==================================================
// API ROUTES
// ==================================================

app.use("/api/site-settings", siteSettingsRoutes);

app.use("/api/about", aboutRoutes);

app.use("/api/services", servicesRoutes);

app.use("/api/scholarship", scholarshipRoutes);

app.use("/api/employers", employersRoutes);

app.use("/api/corporate-training", corporateTrainingRoutes);

// ==================================================
// ROOT ROUTE
// ==================================================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Upskill Academy API is running",
  });
});

// ==================================================
// ERROR HANDLING
// ==================================================

app.use(notFoundMiddleware);

app.use(errorMiddleware);

// ==================================================
// START SERVER AFTER DATABASE CONNECTION
// ==================================================

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log("-----------------------------------");
      console.log("Upskill Academy Backend Started");
      console.log(`Server: http://localhost:${PORT}`);
      console.log(`API: http://localhost:${PORT}/api`);
      console.log(`Scholarship API: http://localhost:${PORT}/api/scholarship`);
      console.log(`Employers API: http://localhost:${PORT}/api/employers`);
      console.log(
        `Corporate Training API: http://localhost:${PORT}/api/corporate-training`,
      );
      console.log("-----------------------------------");
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();

export default app;
