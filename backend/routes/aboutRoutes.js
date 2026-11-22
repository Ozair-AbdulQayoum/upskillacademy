import express from "express";

import {
  // HERO
  getAboutHero,
  updateAboutHero,

  // GALLERY
  getGallery,
  updateGallery,

  // ABOUT SECTION
  getAboutSection,
  updateAboutSection,

  // OUR ETHOS
  getOurEthos,
  updateOurEthos,

  // GUIDANCE
  getGuidance,
  updateGuidance,

  // FAQ
  getFaq,
  updateFaq,

  // FEEDBACK
  getFeedback,
  updateFeedback,
  submitFeedback,
  getFeedbackSubmissions,
  updateFeedbackStatus,
  deleteFeedbackSubmission,

  // GENERIC CRUD
  getSectionItems,
  createSectionItem,
  updateSectionItem,
  deleteSectionItem,
} from "../controllers/aboutController.js";

const router = express.Router();

// =====================================
// HERO SECTION
// =====================================
router.get("/hero", getAboutHero);
router.put("/hero", updateAboutHero);

// =====================================
// GALLERY SECTION
// =====================================
router.get("/gallery", getGallery);
router.put("/gallery", updateGallery);

// =====================================
// ABOUT SECTION
// =====================================
router.get("/section", getAboutSection);
router.put("/section", updateAboutSection);

// =====================================
// OUR ETHOS SECTION
// =====================================
router.get("/ethos", getOurEthos);
router.put("/ethos", updateOurEthos);

// =====================================
// GUIDANCE SECTION
// =====================================
router.get("/guidance", getGuidance);
router.put("/guidance", updateGuidance);

// =====================================
// FAQ SECTION
// =====================================
router.get("/faq", getFaq);
router.put("/faq", updateFaq);

// =====================================
// FEEDBACK FORM
// =====================================

// Public feedback form content
router.get("/feedback", getFeedback);
router.put("/feedback", updateFeedback);

// Public visitor submission
router.post("/feedback/submit", submitFeedback);

// =====================================
// ADMIN MESSAGE MANAGEMENT
// =====================================

// Get all visitor messages
router.get("/admin/messages", getFeedbackSubmissions);

// Update message status
router.patch("/admin/messages/:id/status", updateFeedbackStatus);

// Delete visitor message
router.delete("/admin/messages/:id", deleteFeedbackSubmission);

// Keep the previous status URL working
router.patch("/feedback/submissions/:id/status", updateFeedbackStatus);

// =====================================
// GENERIC CRUD FOR SECTION ITEMS
// =====================================

// READ
router.get("/content/:section/:collection", getSectionItems);

// CREATE
router.post("/content/:section/:collection", createSectionItem);

// UPDATE
router.patch("/content/:section/:collection/:itemId", updateSectionItem);

// DELETE
router.delete("/content/:section/:collection/:itemId", deleteSectionItem);

export default router;
