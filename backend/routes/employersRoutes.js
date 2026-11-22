import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

import {
  getEmployersHero,
  updateEmployersHero,
  toggleEmployersHeroVisibility,
  getEmployersHowItWorks,
  updateEmployersHowItWorks,
  toggleEmployersHowItWorksVisibility,
  getEmployersCTA,
  updateEmployersCTA,
  toggleEmployersCTAVisibility,
} from "../controllers/employersController.js";

// ==================================================
// ROUTER CONFIGURATION
// ==================================================

const router = express.Router();

// ==================================================
// DIRECTORY CONFIGURATION
// ==================================================

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.resolve(__dirname, "../uploads/employers");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// ==================================================
// IMAGE VALIDATION
// ==================================================

const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];

const fileFilter = (req, file, cb) => {
  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new Error("Only JPG, PNG, WEBP and GIF images are allowed."));
  }

  cb(null, true);
};

// ==================================================
// MULTER STORAGE
// ==================================================

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase();

    const filename = `${Date.now()}-${Math.round(
      Math.random() * 1e9,
    )}${extension}`;

    cb(null, filename);
  },
});

// ==================================================
// MULTER CONFIGURATION
// ==================================================

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 3,
  },
});

// ==================================================
// HERO IMAGE UPLOAD
// ==================================================

const uploadEmployersHero = upload.fields([
  { name: "image1", maxCount: 1 },
  { name: "image2", maxCount: 1 },
  { name: "image3", maxCount: 1 },
]);

// ==================================================
// HOW IT WORKS IMAGE UPLOAD
// ==================================================

const uploadEmployersHowItWorks = upload.single("image");

// ==================================================
// EMPLOYERS HERO ROUTES
// ==================================================

router.get("/hero", getEmployersHero);

router.put("/hero", uploadEmployersHero, updateEmployersHero);

router.patch("/hero/visibility", express.json(), toggleEmployersHeroVisibility);

// ==================================================
// EMPLOYERS HOW IT WORKS ROUTES
// ==================================================

router.get("/how-it-works", getEmployersHowItWorks);

router.put(
  "/how-it-works",
  uploadEmployersHowItWorks,
  updateEmployersHowItWorks,
);

router.patch(
  "/how-it-works/visibility",
  express.json(),
  toggleEmployersHowItWorksVisibility,
);

// ==================================================
// EMPLOYERS CTA ROUTES
// ==================================================

router.get("/cta", getEmployersCTA);

router.put("/cta", express.json(), updateEmployersCTA);

router.patch("/cta/visibility", express.json(), toggleEmployersCTAVisibility);

// ==================================================
// MULTER ERROR HANDLING
// ==================================================

router.use((error, req, res, next) => {
  console.error("Employers Routes Error:", error);

  if (error instanceof multer.MulterError) {
    const messages = {
      LIMIT_FILE_SIZE: "Image size must not exceed 5MB.",
      LIMIT_FILE_COUNT: "Maximum 3 images are allowed.",
      LIMIT_UNEXPECTED_FILE: "Unexpected image field name.",
      LIMIT_FIELD_COUNT: "Too many form fields.",
    };

    return res.status(400).json({
      success: false,
      message: messages[error.code] || error.message,
    });
  }

  if (
    error.message?.includes("Only JPG, PNG, WEBP and GIF images are allowed.")
  ) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }

  next(error);
});

// ==================================================
// DEFAULT EXPORT
// ==================================================

export default router;
