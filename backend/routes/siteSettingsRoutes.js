import express from "express";

import {
  getNavbar,
  updateNavbar,
  getFooter,
  updateFooter,
} from "../controllers/siteSettingsController.js";

const router = express.Router();

// Navbar
router.get("/navbar", getNavbar);
router.put("/navbar", updateNavbar);

// Footer
router.get("/footer", getFooter);
router.put("/footer", updateFooter);

export default router;
