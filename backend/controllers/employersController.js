import EmployersPage from "../models/EmployersPage.js";

// ==================================================
// GET OR CREATE EMPLOYERS PAGE
// ==================================================

const getEmployersPage = async () => {
  let page = await EmployersPage.findOne();

  if (!page) {
    page = await EmployersPage.create({});
  }

  return page;
};

// ==================================================
// RESPONSE ERROR HANDLER
// ==================================================

const handleControllerError = (res, error, message) => {
  console.error(message, error);

  const isValidationError =
    error.name === "ValidationError" || error.name === "CastError";

  return res.status(isValidationError ? 400 : 500).json({
    success: false,
    message: isValidationError
      ? error.message
      : "Something went wrong. Please try again.",
  });
};

// ==================================================
// PARSE JSON BODY FIELDS
// ==================================================

const parseJSONField = (value, fieldName) => {
  if (typeof value !== "string") {
    return value;
  }

  try {
    return JSON.parse(value);
  } catch {
    const error = new Error(`Invalid ${fieldName} JSON data.`);
    error.statusCode = 400;
    throw error;
  }
};

// ==================================================
// GET EMPLOYERS HERO
// ==================================================

export const getEmployersHero = async (req, res) => {
  try {
    const page = await getEmployersPage();

    return res.status(200).json({
      success: true,
      hero: page.hero,
    });
  } catch (error) {
    return handleControllerError(res, error, "Get Employers Hero Error:");
  }
};

// ==================================================
// UPDATE EMPLOYERS HERO
// ==================================================

export const updateEmployersHero = async (req, res) => {
  try {
    const page = await getEmployersPage();
    const hero = page.hero;

    const allowedFields = [
      "label",
      "heading",
      "highlightedHeading",
      "description",
      "primaryButtonText",
      "primaryButtonLink",
      "secondaryButtonText",
      "secondaryButtonLink",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        hero[field] = req.body[field];
      }
    });

    // Update uploaded images.

    const imageFields = ["image1", "image2", "image3"];

    imageFields.forEach((field) => {
      const uploadedFile = req.files?.[field]?.[0];

      if (uploadedFile) {
        hero.images[field] = `/uploads/employers/${uploadedFile.filename}`;
      }
    });

    page.markModified("hero");

    await page.save();

    return res.status(200).json({
      success: true,
      message: "Employers hero updated successfully.",
      hero: page.hero,
    });
  } catch (error) {
    return handleControllerError(res, error, "Update Employers Hero Error:");
  }
};

// ==================================================
// TOGGLE EMPLOYERS HERO VISIBILITY
// ==================================================

export const toggleEmployersHeroVisibility = async (req, res) => {
  try {
    const { isVisible } = req.body;

    if (typeof isVisible !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "A valid visibility value is required.",
      });
    }

    const page = await getEmployersPage();

    page.hero.isVisible = isVisible;

    await page.save();

    return res.status(200).json({
      success: true,
      message: `Employers hero ${
        isVisible ? "published" : "hidden"
      } successfully.`,
      hero: page.hero,
    });
  } catch (error) {
    return handleControllerError(
      res,
      error,
      "Toggle Employers Hero Visibility Error:",
    );
  }
};

// ==================================================
// GET EMPLOYERS HOW IT WORKS
// ==================================================

export const getEmployersHowItWorks = async (req, res) => {
  try {
    const page = await getEmployersPage();

    return res.status(200).json({
      success: true,
      howItWorks: page.howItWorks,
    });
  } catch (error) {
    return handleControllerError(
      res,
      error,
      "Get Employers How It Works Error:",
    );
  }
};

// ==================================================
// UPDATE EMPLOYERS HOW IT WORKS
// ==================================================

export const updateEmployersHowItWorks = async (req, res) => {
  try {
    const page = await getEmployersPage();
    const section = page.howItWorks;

    // UPDATE SECTION HEADER

    const allowedFields = ["label", "heading"];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        section[field] = req.body[field];
      }
    });

    // UPDATE THREE STEPS

    if (req.body.steps !== undefined) {
      const steps = parseJSONField(req.body.steps, "steps");

      if (!Array.isArray(steps) || steps.length !== 3) {
        return res.status(400).json({
          success: false,
          message: "Exactly three steps are required.",
        });
      }

      section.steps = steps;
    }

    // UPDATE NO FEES CARD

    if (req.body.noFees !== undefined) {
      const noFees = parseJSONField(req.body.noFees, "no-fees card");

      if (!noFees || typeof noFees !== "object" || Array.isArray(noFees)) {
        return res.status(400).json({
          success: false,
          message: "Invalid no-fees card data.",
        });
      }

      section.noFees = {
        ...section.noFees.toObject(),
        ...noFees,
      };
    }

    // UPDATE FEATURE CARDS

    if (req.body.features !== undefined) {
      const features = parseJSONField(req.body.features, "features");

      if (!Array.isArray(features) || features.length !== 2) {
        return res.status(400).json({
          success: false,
          message: "Exactly two feature cards are required.",
        });
      }

      section.features = features;
    }

    // UPDATE SECTION IMAGE

    if (req.file) {
      section.image = `/uploads/employers/${req.file.filename}`;
    }

    page.markModified("howItWorks");

    await page.save();

    return res.status(200).json({
      success: true,
      message: "How It Works section updated successfully.",
      howItWorks: page.howItWorks,
    });
  } catch (error) {
    if (error.statusCode === 400) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    return handleControllerError(
      res,
      error,
      "Update Employers How It Works Error:",
    );
  }
};

// ==================================================
// TOGGLE HOW IT WORKS VISIBILITY
// ==================================================

export const toggleEmployersHowItWorksVisibility = async (req, res) => {
  try {
    const { isVisible } = req.body;

    if (typeof isVisible !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "A valid visibility value is required.",
      });
    }

    const page = await getEmployersPage();

    page.howItWorks.isVisible = isVisible;

    await page.save();

    return res.status(200).json({
      success: true,
      message: `How It Works section ${
        isVisible ? "published" : "hidden"
      } successfully.`,
      howItWorks: page.howItWorks,
    });
  } catch (error) {
    return handleControllerError(
      res,
      error,
      "Toggle How It Works Visibility Error:",
    );
  }
};

// ==================================================
// GET EMPLOYERS CTA
// ==================================================

export const getEmployersCTA = async (req, res) => {
  try {
    const page = await getEmployersPage();

    return res.status(200).json({
      success: true,
      cta: page.cta,
    });
  } catch (error) {
    return handleControllerError(res, error, "Get Employers CTA Error:");
  }
};

// ==================================================
// UPDATE EMPLOYERS CTA
// ==================================================

export const updateEmployersCTA = async (req, res) => {
  try {
    const page = await getEmployersPage();

    const cta = page.cta;

    const allowedFields = [
      "heading",
      "description",
      "buttonText",
      "buttonLink",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        cta[field] = req.body[field];
      }
    });

    page.markModified("cta");

    await page.save();

    return res.status(200).json({
      success: true,
      message: "Employers CTA updated successfully.",
      cta: page.cta,
    });
  } catch (error) {
    return handleControllerError(res, error, "Update Employers CTA Error:");
  }
};

// ==================================================
// TOGGLE EMPLOYERS CTA VISIBILITY
// ==================================================

export const toggleEmployersCTAVisibility = async (req, res) => {
  try {
    const { isVisible } = req.body;

    if (typeof isVisible !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "A valid visibility value is required.",
      });
    }

    const page = await getEmployersPage();

    page.cta.isVisible = isVisible;

    page.markModified("cta");

    await page.save();

    return res.status(200).json({
      success: true,
      message: `Employers CTA ${
        isVisible ? "published" : "hidden"
      } successfully.`,
      cta: page.cta,
    });
  } catch (error) {
    return handleControllerError(
      res,
      error,
      "Toggle Employers CTA Visibility Error:",
    );
  }
};
