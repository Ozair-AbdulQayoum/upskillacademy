import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

import {
  getCorporateTrainingHero,
  updateCorporateTrainingHero,
  toggleCorporateTrainingHeroVisibility,
  getCorporateTrainingTopics,
  updateCorporateTrainingTopics,
  toggleCorporateTrainingTopicsVisibility,
} from "../controllers/corporateTrainingController.js";

const router = express.Router();

// ==============================
// UPLOAD DIRECTORY
// ==============================

const uploadDir = path.join(process.cwd(), "uploads/corporate-training");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// ==============================
// MULTER STORAGE
// ==============================

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname).toLowerCase();

    cb(null, uniqueName);
  },
});

// ==============================
// FILE FILTER
// ==============================

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/gif",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPG, PNG, WEBP, and GIF images are allowed."));
  }
};

// ==============================
// MULTER CONFIGURATION
// ==============================

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 3,
  },
});

// ==============================
// HERO ROUTES
// ==============================

// GET Hero
router.get("/hero", getCorporateTrainingHero);

// UPDATE Hero with 3 images
router.put(
  "/hero",
  upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
  ]),
  updateCorporateTrainingHero,
);

// UPDATE Hero visibility
router.patch("/hero/visibility", toggleCorporateTrainingHeroVisibility);

// ==============================
// TOPICS ROUTES
// ==============================

// GET Topics
router.get("/topics", getCorporateTrainingTopics);

// UPDATE Topics with 1 image
router.put("/topics", upload.single("image"), updateCorporateTrainingTopics);

// UPDATE Topics visibility
router.patch("/topics/visibility", toggleCorporateTrainingTopicsVisibility);

// ==============================
// MULTER ERROR HANDLER
// ==============================

router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  if (err) {
    return res.status(400).json({
      success: false,
      message: err.message || "Image upload failed.",
    });
  }

  next();
});

// ==============================
// EXPORT ROUTER
// ==============================

export default router;
