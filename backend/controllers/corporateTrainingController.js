import CorporateTrainingPage from "../models/CorporateTrainingPage.js";

// ==============================
// GET OR CREATE PAGE
// ==============================

const getOrCreateCorporateTrainingPage = async () => {
  let page = await CorporateTrainingPage.findOne();

  if (!page) {
    page = await CorporateTrainingPage.create({});
  }

  // Initialize missing sections for older documents
  if (!page.hero) {
    page.hero = {};
  }

  if (!page.topics) {
    page.topics = {};
  }

  return page;
};

// ==============================
// GET HERO
// ==============================

export const getCorporateTrainingHero = async (req, res) => {
  try {
    const page = await getOrCreateCorporateTrainingPage();

    return res.status(200).json({
      success: true,
      hero: page.hero,
    });
  } catch (error) {
    console.error("Get Corporate Training Hero Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch Corporate Training Hero.",
    });
  }
};

// ==============================
// UPDATE HERO
// ==============================

export const updateCorporateTrainingHero = async (req, res) => {
  try {
    const page = await getOrCreateCorporateTrainingPage();

    const {
      label,
      heading,
      highlightedHeading,
      description,
      buttonText,
      buttonLink,
    } = req.body;

    // Update text fields
    if (label !== undefined) page.hero.label = label;
    if (heading !== undefined) page.hero.heading = heading;

    if (highlightedHeading !== undefined) {
      page.hero.highlightedHeading = highlightedHeading;
    }

    if (description !== undefined) {
      page.hero.description = description;
    }

    if (buttonText !== undefined) {
      page.hero.buttonText = buttonText;
    }

    if (buttonLink !== undefined) {
      page.hero.buttonLink = buttonLink;
    }

    // Update uploaded images
    if (req.files?.image1?.[0]) {
      page.hero.image1 = `/uploads/corporate-training/${req.files.image1[0].filename}`;
    }

    if (req.files?.image2?.[0]) {
      page.hero.image2 = `/uploads/corporate-training/${req.files.image2[0].filename}`;
    }

    if (req.files?.image3?.[0]) {
      page.hero.image3 = `/uploads/corporate-training/${req.files.image3[0].filename}`;
    }

    page.markModified("hero");
    await page.save();

    return res.status(200).json({
      success: true,
      message: "Corporate Training Hero updated successfully.",
      hero: page.hero,
    });
  } catch (error) {
    console.error("Update Corporate Training Hero Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update Corporate Training Hero.",
      error: error.message,
    });
  }
};

// ==============================
// TOGGLE HERO VISIBILITY
// ==============================

export const toggleCorporateTrainingHeroVisibility = async (req, res) => {
  try {
    const { isVisible } = req.body;

    if (typeof isVisible !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "isVisible must be true or false.",
      });
    }

    const page = await getOrCreateCorporateTrainingPage();

    page.hero.isVisible = isVisible;

    page.markModified("hero");
    await page.save();

    return res.status(200).json({
      success: true,
      message: "Hero visibility updated successfully.",
      hero: page.hero,
    });
  } catch (error) {
    console.error("Toggle Corporate Training Hero Visibility Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update Hero visibility.",
    });
  }
};

// ==================================================
// GET CORPORATE TRAINING TOPICS
// ==================================================

export const getCorporateTrainingTopics = async (req, res) => {
  try {
    const page = await getOrCreateCorporateTrainingPage();

    return res.status(200).json({
      success: true,
      topics: page.topics,
    });
  } catch (error) {
    console.error("Get Corporate Training Topics Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch Corporate Training Topics.",
    });
  }
};

// ==================================================
// UPDATE CORPORATE TRAINING TOPICS
// ==================================================

export const updateCorporateTrainingTopics = async (req, res) => {
  try {
    const page = await getOrCreateCorporateTrainingPage();

    const {
      sectionLabel,
      sectionHeading,
      topics,
      howItWorksLabel,
      howItWorksHeading,
      steps,
      buttonText,
      buttonLink,
    } = req.body;

    // Update section headings
    if (sectionLabel !== undefined) {
      page.topics.sectionLabel = sectionLabel;
    }

    if (sectionHeading !== undefined) {
      page.topics.sectionHeading = sectionHeading;
    }

    // Update topic cards
    if (topics !== undefined) {
      const parsedTopics =
        typeof topics === "string" ? JSON.parse(topics) : topics;

      if (!Array.isArray(parsedTopics)) {
        return res.status(400).json({
          success: false,
          message: "Topics must be an array.",
        });
      }

      page.topics.topics = parsedTopics.map((topic) => ({
        title: topic.title,
        icon: topic.icon || "Globe",
      }));
    }

    // Update How It Works headings
    if (howItWorksLabel !== undefined) {
      page.topics.howItWorksLabel = howItWorksLabel;
    }

    if (howItWorksHeading !== undefined) {
      page.topics.howItWorksHeading = howItWorksHeading;
    }

    // Update steps
    if (steps !== undefined) {
      const parsedSteps = typeof steps === "string" ? JSON.parse(steps) : steps;

      if (!Array.isArray(parsedSteps)) {
        return res.status(400).json({
          success: false,
          message: "Steps must be an array.",
        });
      }

      page.topics.steps = parsedSteps;
    }

    // Update button
    if (buttonText !== undefined) {
      page.topics.buttonText = buttonText;
    }

    if (buttonLink !== undefined) {
      page.topics.buttonLink = buttonLink;
    }

    // Update uploaded image
    if (req.file) {
      page.topics.image = `/uploads/corporate-training/${req.file.filename}`;
    }

    page.markModified("topics");
    await page.save();

    return res.status(200).json({
      success: true,
      message: "Corporate Training Topics updated successfully.",
      topics: page.topics,
    });
  } catch (error) {
    console.error("Update Corporate Training Topics Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update Corporate Training Topics.",
      error: error.message,
    });
  }
};

// ==================================================
// TOGGLE TOPICS VISIBILITY
// ==================================================

export const toggleCorporateTrainingTopicsVisibility = async (req, res) => {
  try {
    const { isVisible } = req.body;

    if (typeof isVisible !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "isVisible must be true or false.",
      });
    }

    const page = await getOrCreateCorporateTrainingPage();

    page.topics.isVisible = isVisible;

    page.markModified("topics");
    await page.save();

    return res.status(200).json({
      success: true,
      message: "Topics visibility updated successfully.",
      topics: page.topics,
    });
  } catch (error) {
    console.error("Toggle Corporate Training Topics Visibility Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update Topics visibility.",
    });
  }
};
