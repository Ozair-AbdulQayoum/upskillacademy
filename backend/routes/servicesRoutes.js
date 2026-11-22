import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { randomUUID } from "crypto";

import {
  // HERO
  getServicesHero,
  updateServicesHero,

  // PROGRAMS
  getServicesPrograms,
  createServicesProgram,
  updateServicesProgram,
  deleteServicesProgram,
  seedDefaultServicesPrograms,

  // TECHNOLOGIES
  getServicesTechnologies,
  createServicesTechnology,
  updateServicesTechnology,
  deleteServicesTechnology,
  seedDefaultServicesTechnologies,

  // CLIENTS
  getServicesClients,
  createServicesClient,
  updateServicesClient,
  deleteServicesClient,

  // OUR VALUES
  getServicesValues,
  seedDefaultServicesValues,
  createServicesValue,
  updateServicesValue,
  deleteServicesValue,
} from "../controllers/servicesController.js";

const router = express.Router();

// =====================================
// REUSABLE IMAGE UPLOAD CONFIGURATION
// =====================================

const createImageUploader = (folderName) => {
  const uploadDirectory = path.join(process.cwd(), "uploads", folderName);

  fs.mkdirSync(uploadDirectory, { recursive: true });

  const storage = multer.diskStorage({
    destination: (req, file, callback) => {
      callback(null, uploadDirectory);
    },

    filename: (req, file, callback) => {
      const extension = path.extname(file.originalname).toLowerCase();

      callback(null, `${randomUUID()}${extension}`);
    },
  });

  const fileFilter = (req, file, callback) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];

    if (allowedTypes.includes(file.mimetype)) {
      return callback(null, true);
    }

    callback(new Error("Only JPG, PNG, WEBP, and GIF images are allowed."));
  };

  return multer({
    storage,
    fileFilter,
    limits: {
      fileSize: 5 * 1024 * 1024,
    },
  });
};

// =====================================
// IMAGE UPLOAD INSTANCES
// =====================================

const uploadClientLogo = createImageUploader("clients");
const uploadValueIcon = createImageUploader("values");

// =====================================
// HERO
// =====================================

router.get("/hero", getServicesHero);
router.put("/hero", updateServicesHero);

// =====================================
// PROGRAMS
// =====================================

router.get("/programs", getServicesPrograms);

router.post("/programs", createServicesProgram);

router.post("/programs/seed-defaults", seedDefaultServicesPrograms);

router.put("/programs/:id", updateServicesProgram);

router.delete("/programs/:id", deleteServicesProgram);

// =====================================
// TECHNOLOGIES
// =====================================

router.get("/technologies", getServicesTechnologies);

router.post("/technologies", createServicesTechnology);

router.post("/technologies/seed-defaults", seedDefaultServicesTechnologies);

router.put("/technologies/:id", updateServicesTechnology);

router.delete("/technologies/:id", deleteServicesTechnology);

// =====================================
// CLIENTS
// =====================================

router.get("/clients", getServicesClients);

router.post("/clients", uploadClientLogo.single("logo"), createServicesClient);

router.put(
  "/clients/:id",
  uploadClientLogo.single("logo"),
  updateServicesClient,
);

router.delete("/clients/:id", deleteServicesClient);

// =====================================
// OUR VALUES
// =====================================

// GET ALL VALUES
router.get("/values", getServicesValues);

// ONE-TIME MIGRATION OF ORIGINAL FOUR VALUES
router.post("/values/seed-defaults", seedDefaultServicesValues);

// CREATE VALUE
router.post("/values", uploadValueIcon.single("icon"), createServicesValue);

// UPDATE VALUE
router.put("/values/:id", uploadValueIcon.single("icon"), updateServicesValue);

// DELETE VALUE
router.delete("/values/:id", deleteServicesValue);

export default router;
