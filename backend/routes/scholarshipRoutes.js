import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

import {
  getScholarshipHero,
  updateScholarshipHero,
  toggleScholarshipHero,
  createScholarshipApplication,
  getScholarshipApplications,
  updateScholarshipApplicationStatus,
  getScholarshipFAQs,
  getAllScholarshipFAQs,
  createScholarshipFAQ,
  updateScholarshipFAQ,
  deleteScholarshipFAQ,
  toggleScholarshipFAQVisibility,
  getScholarshipFAQGallery,
  getAllScholarshipFAQGallery,
  updateScholarshipFAQGalleryImage,
  deleteScholarshipFAQGalleryImage,
  toggleScholarshipFAQGalleryVisibility,
} from "../controllers/scholarshipController.js";

const router = express.Router();

// ==================================================
// DIRECTORY CONFIGURATION
// ==================================================

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const heroUploadDir = path.resolve(__dirname, "../uploads/scholarship/hero");

const faqUploadDir = path.resolve(__dirname, "../uploads/scholarship/faq");

// Create upload directories if they do not exist.
fs.mkdirSync(heroUploadDir, { recursive: true });
fs.mkdirSync(faqUploadDir, { recursive: true });

// ==================================================
// IMAGE VALIDATION
// ==================================================

const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];

const fileFilter = (req, file, cb) => {
  if (allowedTypes.includes(file.mimetype)) {
    return cb(null, true);
  }

  return cb(new Error("Only JPG, PNG, WEBP and GIF images are allowed."));
};

// ==================================================
// REUSABLE MULTER STORAGE
// ==================================================

const createStorage = (destinationDir) => {
  return multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, destinationDir);
    },

    filename: (req, file, cb) => {
      const extension = path.extname(file.originalname).toLowerCase();

      const filename = `${Date.now()}-${Math.round(
        Math.random() * 1e9,
      )}${extension}`;

      cb(null, filename);
    },
  });
};

// ==================================================
// HERO IMAGE UPLOAD CONFIGURATION
// ==================================================

const heroUpload = multer({
  storage: createStorage(heroUploadDir),
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 8,
  },
});

// ==================================================
// FAQ GALLERY IMAGE UPLOAD CONFIGURATION
// ==================================================

const faqGalleryUpload = multer({
  storage: createStorage(faqUploadDir),
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1,
  },
});

// ==================================================
// SCHOLARSHIP HERO ROUTES
// ==================================================

// Get hero content
router.get("/hero", getScholarshipHero);

// Update hero content and images
router.put(
  "/hero",
  heroUpload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 },
    { name: "image5", maxCount: 1 },
    { name: "image6", maxCount: 1 },
    { name: "image7", maxCount: 1 },
    { name: "image8", maxCount: 1 },
  ]),
  updateScholarshipHero,
);

// Toggle hero visibility
router.patch("/hero/visibility", toggleScholarshipHero);

// ==================================================
// SCHOLARSHIP APPLICATION ROUTES
// ==================================================

// Submit application
router.post("/applications", createScholarshipApplication);

// Get all applications
router.get("/applications", getScholarshipApplications);

// Update application status
router.patch("/applications/:id/status", updateScholarshipApplicationStatus);

// ==================================================
// SCHOLARSHIP FAQ ROUTES
// ==================================================

// Get visible FAQs (public)
router.get("/faqs", getScholarshipFAQs);

// Get all FAQs (admin)
router.get("/faqs/admin", getAllScholarshipFAQs);

// Create FAQ
router.post("/faqs", createScholarshipFAQ);

// Update FAQ
router.put("/faqs/:id", updateScholarshipFAQ);

// Delete FAQ
router.delete("/faqs/:id", deleteScholarshipFAQ);

// Toggle FAQ visibility
router.patch("/faqs/:id/visibility", toggleScholarshipFAQVisibility);

// ==================================================
// SCHOLARSHIP FAQ GALLERY ROUTES
// ==================================================

// Get visible gallery images (public)
router.get("/faqs/gallery", getScholarshipFAQGallery);

// Get all gallery images (admin)
router.get("/faqs/gallery/admin", getAllScholarshipFAQGallery);

// Upload or replace gallery image
// Allowed keys: image1, image2, image3, image4
// FormData field name: image

router.put(
  "/faqs/gallery/:imageKey",
  faqGalleryUpload.single("image"),
  updateScholarshipFAQGalleryImage,
);

// Delete gallery image
router.delete("/faqs/gallery/:imageKey", deleteScholarshipFAQGalleryImage);

// Toggle gallery image visibility
router.patch(
  "/faqs/gallery/:imageKey/visibility",
  toggleScholarshipFAQGalleryVisibility,
);

// ==================================================
// MULTER ERROR HANDLING
// ==================================================

router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    let message = error.message;

    if (error.code === "LIMIT_FILE_SIZE") {
      message = "Image size must not exceed 5MB.";
    }

    if (error.code === "LIMIT_FILE_COUNT") {
      message = "Too many images uploaded.";
    }

    if (error.code === "LIMIT_UNEXPECTED_FILE") {
      message = "Unexpected image field name.";
    }

    return res.status(400).json({
      success: false,
      message,
    });
  }

  if (error.message?.includes("images are allowed")) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }

  next(error);
});

// ==================================================
// EXPORT ROUTER
// ==================================================

export default router;
