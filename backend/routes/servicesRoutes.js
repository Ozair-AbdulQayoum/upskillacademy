import express from "express";
import multer from "multer";

// =====================================
// SERVICES CONTROLLERS
// =====================================

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
// IMAGE UPLOAD CONFIGURATION
// =====================================

const imageUpload = multer({
  storage: multer.memoryStorage(),

  fileFilter: (req, file, callback) => {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
      "image/svg+xml",
    ];

    if (!allowedTypes.includes(file.mimetype)) {
      return callback(
        new Error("Only JPG, PNG, WEBP, GIF, and SVG images are allowed."),
      );
    }

    callback(null, true);
  },

  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

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

router.post("/clients", imageUpload.single("logo"), createServicesClient);

router.put("/clients/:id", imageUpload.single("logo"), updateServicesClient);

router.delete("/clients/:id", deleteServicesClient);

// =====================================
// OUR VALUES
// =====================================

router.get("/values", getServicesValues);

router.post("/values/seed-defaults", seedDefaultServicesValues);

router.post("/values", imageUpload.single("icon"), createServicesValue);

router.put("/values/:id", imageUpload.single("icon"), updateServicesValue);

router.delete("/values/:id", deleteServicesValue);

export default router;
