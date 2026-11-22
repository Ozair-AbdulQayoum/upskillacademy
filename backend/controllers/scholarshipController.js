import ScholarshipPage from "../models/ScholarshipPage.js";
import fs from "fs/promises";
import path from "path";

// ==================================================
// HELPER FUNCTIONS
// ==================================================

const getScholarshipPage = async () => {
  let page = await ScholarshipPage.findOne();

  if (!page) {
    page = await ScholarshipPage.create({});
  }

  return page;
};

const validGalleryImage = (imageKey) =>
  ["image1", "image2", "image3", "image4"].includes(imageKey);

const getGallerySlot = (page, imageKey) => {
  return (
    page.faqGallery?.[imageKey] || {
      url: "",
      isVisible: true,
    }
  );
};

// Safely remove an uploaded FAQ gallery image.
const removeFAQGalleryFile = async (imageUrl) => {
  if (!imageUrl || typeof imageUrl !== "string") return;

  const prefix = "/uploads/scholarship/faq/";

  if (!imageUrl.startsWith(prefix)) return;

  const filename = path.basename(imageUrl);

  if (!filename || filename === "." || filename === "..") return;

  const uploadDirectory = path.resolve(
    process.cwd(),
    "uploads",
    "scholarship",
    "faq",
  );

  const filePath = path.resolve(uploadDirectory, filename);

  if (path.dirname(filePath) !== uploadDirectory) return;

  try {
    await fs.unlink(filePath);
  } catch (error) {
    if (error.code !== "ENOENT") {
      console.error("FAQ Gallery File Removal Error:", error);
    }
  }
};

// ==================================================
// SCHOLARSHIP HERO
// ==================================================

export const getScholarshipHero = async (req, res) => {
  try {
    const page = await getScholarshipPage();

    return res.status(200).json({
      success: true,
      hero: page.hero,
    });
  } catch (error) {
    console.error("Get Scholarship Hero Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load scholarship hero.",
      error: error.message,
    });
  }
};

export const updateScholarshipHero = async (req, res) => {
  try {
    const page = await getScholarshipPage();

    const editableFields = [
      "heading",
      "paragraph1",
      "paragraph2",
      "buttonText",
      "buttonLink",
      "bannerTitle",
      "videoLink",
    ];

    editableFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        page.hero[field] = req.body[field];
      }
    });

    for (let i = 1; i <= 8; i++) {
      const imageName = `image${i}`;
      const uploadedFile = req.files?.[imageName]?.[0];

      if (uploadedFile) {
        page.hero.images[imageName] =
          `/uploads/scholarship/hero/${uploadedFile.filename}`;
      }
    }

    await page.save();

    return res.status(200).json({
      success: true,
      message: "Scholarship hero updated successfully.",
      hero: page.hero,
    });
  } catch (error) {
    console.error("Update Scholarship Hero Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update scholarship hero.",
      error: error.message,
    });
  }
};

export const toggleScholarshipHero = async (req, res) => {
  try {
    const { isVisible } = req.body;

    if (typeof isVisible !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "isVisible must be true or false.",
      });
    }

    const page = await getScholarshipPage();

    page.hero.isVisible = isVisible;

    await page.save();

    return res.status(200).json({
      success: true,
      message: isVisible
        ? "Scholarship hero restored successfully."
        : "Scholarship hero hidden successfully.",
      hero: page.hero,
    });
  } catch (error) {
    console.error("Toggle Scholarship Hero Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to change scholarship hero visibility.",
      error: error.message,
    });
  }
};

// ==================================================
// SCHOLARSHIP APPLICATIONS
// ==================================================

export const createScholarshipApplication = async (req, res) => {
  try {
    const {
      name,
      email,
      gender,
      phone,
      whatsapp,
      city,
      program,
      experience,
      scholarshipReason,
      careerGoal,
      source,
    } = req.body;

    const requiredFields = {
      name,
      email,
      gender,
      phone,
      whatsapp,
      city,
      experience,
      scholarshipReason,
      careerGoal,
      source,
    };

    const missingField = Object.entries(requiredFields).find(
      ([, value]) => typeof value !== "string" || !value.trim(),
    );

    if (missingField) {
      return res.status(400).json({
        success: false,
        message: `${missingField[0]} is required.`,
      });
    }

    const page = await getScholarshipPage();

    page.applications.push({
      name: name.trim(),
      email: email.trim(),
      gender,
      phone,
      whatsapp,
      city,
      program: program || "",
      experience,
      scholarshipReason,
      careerGoal,
      source,
    });

    await page.save();

    const application = page.applications[page.applications.length - 1];

    return res.status(201).json({
      success: true,
      message: "Scholarship application submitted successfully.",
      application,
    });
  } catch (error) {
    console.error("Submit Scholarship Application Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to submit scholarship application.",
      error: error.message,
    });
  }
};

export const getScholarshipApplications = async (req, res) => {
  try {
    const page = await ScholarshipPage.findOne();

    const applications = page
      ? [...page.applications].sort(
          (a, b) => new Date(b.submittedAt) - new Date(a.submittedAt),
        )
      : [];

    return res.status(200).json({
      success: true,
      total: applications.length,
      applications,
    });
  } catch (error) {
    console.error("Get Scholarship Applications Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load scholarship applications.",
      error: error.message,
    });
  }
};

export const updateScholarshipApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = ["Pending", "Reviewed", "Approved", "Rejected"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid application status.",
      });
    }

    const page = await ScholarshipPage.findOne({
      "applications._id": req.params.id,
    });

    if (!page) {
      return res.status(404).json({
        success: false,
        message: "Application not found.",
      });
    }

    const application = page.applications.id(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found.",
      });
    }

    application.status = status;

    await page.save();

    return res.status(200).json({
      success: true,
      message: "Application status updated successfully.",
      application,
    });
  } catch (error) {
    console.error("Update Application Status Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update application status.",
      error: error.message,
    });
  }
};

// ==================================================
// SCHOLARSHIP FAQ MANAGEMENT
// ==================================================

// GET PUBLIC FAQs

export const getScholarshipFAQs = async (req, res) => {
  try {
    const page = await ScholarshipPage.findOne();

    const faqs = page ? page.faqs.filter((faq) => faq.isVisible === true) : [];

    return res.status(200).json({
      success: true,
      total: faqs.length,
      faqs,
    });
  } catch (error) {
    console.error("Get Scholarship FAQs Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load scholarship FAQs.",
      error: error.message,
    });
  }
};

// GET ALL FAQs FOR ADMIN

export const getAllScholarshipFAQs = async (req, res) => {
  try {
    const page = await getScholarshipPage();

    return res.status(200).json({
      success: true,
      total: page.faqs.length,
      faqs: page.faqs,
    });
  } catch (error) {
    console.error("Get All Scholarship FAQs Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load FAQs.",
      error: error.message,
    });
  }
};

// CREATE FAQ

export const createScholarshipFAQ = async (req, res) => {
  try {
    const { question, answer } = req.body;

    if (
      typeof question !== "string" ||
      !question.trim() ||
      typeof answer !== "string" ||
      !answer.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Both question and answer are required.",
      });
    }

    const page = await getScholarshipPage();

    page.faqs.push({
      question: question.trim(),
      answer: answer.trim(),
      isVisible: true,
    });

    await page.save();

    const faq = page.faqs[page.faqs.length - 1];

    return res.status(201).json({
      success: true,
      message: "FAQ added successfully.",
      faq,
    });
  } catch (error) {
    console.error("Create Scholarship FAQ Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to add FAQ.",
      error: error.message,
    });
  }
};

// UPDATE FAQ

export const updateScholarshipFAQ = async (req, res) => {
  try {
    const { question, answer } = req.body;
    const { id } = req.params;

    if (
      typeof question !== "string" ||
      !question.trim() ||
      typeof answer !== "string" ||
      !answer.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Both question and answer are required.",
      });
    }

    // Find the parent document containing this FAQ.
    const page = await ScholarshipPage.findOne({
      "faqs._id": id,
    });

    if (!page) {
      return res.status(404).json({
        success: false,
        message: "FAQ not found.",
      });
    }

    // Find the exact FAQ subdocument.
    const faq = page.faqs.id(id);

    if (!faq) {
      return res.status(404).json({
        success: false,
        message: "FAQ not found.",
      });
    }

    // Update the existing FAQ.
    faq.set({
      question: question.trim(),
      answer: answer.trim(),
    });

    // Explicitly mark the FAQ array as modified.
    page.markModified("faqs");

    // Save changes to MongoDB.
    await page.save();

    return res.status(200).json({
      success: true,
      message: "FAQ updated successfully.",
      faq,
    });
  } catch (error) {
    console.error("Update Scholarship FAQ Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update FAQ.",
      error: error.message,
    });
  }
};

// DELETE FAQ

export const deleteScholarshipFAQ = async (req, res) => {
  try {
    const page = await ScholarshipPage.findOne({
      "faqs._id": req.params.id,
    });

    if (!page) {
      return res.status(404).json({
        success: false,
        message: "FAQ not found.",
      });
    }

    const faq = page.faqs.id(req.params.id);

    if (!faq) {
      return res.status(404).json({
        success: false,
        message: "FAQ not found.",
      });
    }

    faq.deleteOne();

    page.markModified("faqs");

    await page.save();

    return res.status(200).json({
      success: true,
      message: "FAQ deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Scholarship FAQ Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete FAQ.",
      error: error.message,
    });
  }
};

// TOGGLE FAQ VISIBILITY

export const toggleScholarshipFAQVisibility = async (req, res) => {
  try {
    const { isVisible } = req.body;

    if (typeof isVisible !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "isVisible must be true or false.",
      });
    }

    const page = await ScholarshipPage.findOne({
      "faqs._id": req.params.id,
    });

    if (!page) {
      return res.status(404).json({
        success: false,
        message: "FAQ not found.",
      });
    }

    const faq = page.faqs.id(req.params.id);

    if (!faq) {
      return res.status(404).json({
        success: false,
        message: "FAQ not found.",
      });
    }

    faq.isVisible = isVisible;

    page.markModified("faqs");

    await page.save();

    return res.status(200).json({
      success: true,
      message: isVisible ? "FAQ is now visible." : "FAQ has been hidden.",
      faq,
    });
  } catch (error) {
    console.error("Toggle Scholarship FAQ Visibility Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to change FAQ visibility.",
      error: error.message,
    });
  }
};

// ==================================================
// SCHOLARSHIP FAQ GALLERY MANAGEMENT
// ==================================================

// GET PUBLIC FAQ GALLERY
// IMPORTANT: Return ALL four slots, including hidden images.
// The frontend needs isVisible to distinguish hidden images
// from empty slots and avoid displaying static fallbacks.

export const getScholarshipFAQGallery = async (req, res) => {
  try {
    const page = await getScholarshipPage();

    const gallery = {};

    for (let i = 1; i <= 4; i++) {
      const imageKey = `image${i}`;
      const image = getGallerySlot(page, imageKey);

      gallery[imageKey] = {
        url: image.url || "",
        isVisible: image.isVisible !== false,
      };
    }

    return res.status(200).json({
      success: true,
      total: Object.values(gallery).filter(
        (image) => image.url && image.isVisible,
      ).length,
      gallery,
    });
  } catch (error) {
    console.error("Get Scholarship FAQ Gallery Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load FAQ gallery.",
      error: error.message,
    });
  }
};

// GET ALL GALLERY IMAGES FOR ADMIN

export const getAllScholarshipFAQGallery = async (req, res) => {
  try {
    const page = await getScholarshipPage();

    const gallery = {};

    for (let i = 1; i <= 4; i++) {
      const imageKey = `image${i}`;
      const image = getGallerySlot(page, imageKey);

      gallery[imageKey] = {
        url: image.url || "",
        isVisible: image.isVisible !== false,
      };
    }

    return res.status(200).json({
      success: true,
      gallery,
    });
  } catch (error) {
    console.error("Get All Scholarship FAQ Gallery Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load FAQ gallery images.",
      error: error.message,
    });
  }
};

// UPLOAD / REPLACE GALLERY IMAGE

export const updateScholarshipFAQGalleryImage = async (req, res) => {
  try {
    const { imageKey } = req.params;

    if (!validGalleryImage(imageKey)) {
      return res.status(400).json({
        success: false,
        message: "Invalid image slot. Use image1, image2, image3, or image4.",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please select an image to upload.",
      });
    }

    const page = await getScholarshipPage();

    const oldImageUrl = getGallerySlot(page, imageKey).url || "";

    const newImageUrl = `/uploads/scholarship/faq/${req.file.filename}`;

    page.faqGallery[imageKey].url = newImageUrl;
    page.faqGallery[imageKey].isVisible = true;

    // Ensure nested gallery changes are saved.
    page.markModified("faqGallery");

    await page.save();

    // Delete the previous uploaded file only after saving succeeds.
    if (oldImageUrl && oldImageUrl !== newImageUrl) {
      await removeFAQGalleryFile(oldImageUrl);
    }

    return res.status(200).json({
      success: true,
      message: "FAQ gallery image uploaded successfully.",
      imageKey,
      image: page.faqGallery[imageKey],
      gallery: page.faqGallery,
    });
  } catch (error) {
    console.error("Update FAQ Gallery Image Error:", error);

    if (req.file?.filename) {
      await removeFAQGalleryFile(
        `/uploads/scholarship/faq/${req.file.filename}`,
      );
    }

    return res.status(500).json({
      success: false,
      message: "Failed to upload FAQ gallery image.",
      error: error.message,
    });
  }
};

// DELETE GALLERY IMAGE

export const deleteScholarshipFAQGalleryImage = async (req, res) => {
  try {
    const { imageKey } = req.params;

    if (!validGalleryImage(imageKey)) {
      return res.status(400).json({
        success: false,
        message: "Invalid gallery image.",
      });
    }

    const page = await getScholarshipPage();

    const image = getGallerySlot(page, imageKey);
    const oldImageUrl = image.url || "";

    if (!oldImageUrl) {
      return res.status(404).json({
        success: false,
        message: "No image exists in this gallery slot.",
      });
    }

    page.faqGallery[imageKey].url = "";
    page.faqGallery[imageKey].isVisible = true;

    page.markModified("faqGallery");

    await page.save();

    await removeFAQGalleryFile(oldImageUrl);

    return res.status(200).json({
      success: true,
      message: "FAQ gallery image deleted successfully.",
      imageKey,
      gallery: page.faqGallery,
    });
  } catch (error) {
    console.error("Delete FAQ Gallery Image Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete FAQ gallery image.",
      error: error.message,
    });
  }
};

// TOGGLE GALLERY IMAGE VISIBILITY

export const toggleScholarshipFAQGalleryVisibility = async (req, res) => {
  try {
    const { imageKey } = req.params;
    const { isVisible } = req.body;

    if (!validGalleryImage(imageKey)) {
      return res.status(400).json({
        success: false,
        message: "Invalid gallery image.",
      });
    }

    if (typeof isVisible !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "isVisible must be true or false.",
      });
    }

    const page = await getScholarshipPage();

    const image = getGallerySlot(page, imageKey);

    if (!image.url) {
      return res.status(404).json({
        success: false,
        message: "No image exists in this gallery slot.",
      });
    }

    page.faqGallery[imageKey].isVisible = isVisible;

    page.markModified("faqGallery");

    await page.save();

    return res.status(200).json({
      success: true,
      message: isVisible
        ? "FAQ gallery image published successfully."
        : "FAQ gallery image hidden successfully.",
      imageKey,
      image: page.faqGallery[imageKey],
    });
  } catch (error) {
    console.error("Toggle FAQ Gallery Visibility Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to change gallery visibility.",
      error: error.message,
    });
  }
};
