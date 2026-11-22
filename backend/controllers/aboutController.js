import AboutPage from "../models/AboutPage.js";

// =====================================
// HELPER: FIND OR CREATE ABOUT PAGE
// =====================================
const getOrCreateAboutPage = async () => {
  let about = await AboutPage.findOne();

  if (!about) {
    about = await AboutPage.create({});
  }

  return about;
};

// =====================================
// HELPER: SEND ERROR RESPONSE
// =====================================
const sendError = (res, error, status = 400) => {
  res.status(status).json({
    success: false,
    message: error.message || "Something went wrong.",
  });
};

// =====================================
// HELPER: SECTION UPDATE ALLOWLIST
// =====================================
const allowedSectionFields = {
  hero: ["subtitle", "title", "backgroundImage", "imageAlt"],

  gallery: ["description", "images"],

  aboutSection: [
    "badge",
    "title",
    "description",
    "images",
    "socialLinks",
    "statistics",
  ],

  ourEthos: [
    "valuesBadge",
    "valuesTitle",
    "valuesParagraphs",
    "missionBadge",
    "missionTitle",
    "missionDescription",
    "images",
    "features",
  ],

  guidance: ["title", "description", "experts"],

  faq: ["title", "description", "questions"],

  feedback: [
    "title",
    "description",
    "formTitle",
    "formDescription",
    "contactItems",
  ],
};

// =====================================
// HELPER: UPDATE SECTION SAFELY
// =====================================
const updateSection = async (about, section, body) => {
  const allowedFields = allowedSectionFields[section];

  if (!allowedFields) {
    throw new Error("Invalid section.");
  }

  for (const key of allowedFields) {
    if (Object.prototype.hasOwnProperty.call(body, key)) {
      about.set(`${section}.${key}`, body[key]);
    }
  }

  await about.save();
};

// =====================================
// HERO SECTION
// =====================================
export const getAboutHero = async (req, res) => {
  try {
    const about = await getOrCreateAboutPage();

    res.status(200).json({
      success: true,
      data: about.hero,
    });
  } catch (error) {
    sendError(res, error, 500);
  }
};

export const updateAboutHero = async (req, res) => {
  try {
    const about = await getOrCreateAboutPage();

    await updateSection(about, "hero", req.body);

    res.status(200).json({
      success: true,
      message: "Hero section updated successfully.",
      data: about.hero,
    });
  } catch (error) {
    sendError(res, error);
  }
};

// =====================================
// GALLERY SECTION
// =====================================
export const getGallery = async (req, res) => {
  try {
    const about = await getOrCreateAboutPage();

    res.status(200).json({
      success: true,
      data: about.gallery,
    });
  } catch (error) {
    sendError(res, error, 500);
  }
};

export const updateGallery = async (req, res) => {
  try {
    const about = await getOrCreateAboutPage();

    await updateSection(about, "gallery", req.body);

    res.status(200).json({
      success: true,
      message: "Gallery updated successfully.",
      data: about.gallery,
    });
  } catch (error) {
    sendError(res, error);
  }
};

// =====================================
// ABOUT SECTION
// =====================================
export const getAboutSection = async (req, res) => {
  try {
    const about = await getOrCreateAboutPage();

    res.status(200).json({
      success: true,
      data: about.aboutSection,
    });
  } catch (error) {
    sendError(res, error, 500);
  }
};

export const updateAboutSection = async (req, res) => {
  try {
    const about = await getOrCreateAboutPage();

    await updateSection(about, "aboutSection", req.body);

    res.status(200).json({
      success: true,
      message: "About section updated successfully.",
      data: about.aboutSection,
    });
  } catch (error) {
    sendError(res, error);
  }
};

// =====================================
// OUR ETHOS SECTION
// =====================================
export const getOurEthos = async (req, res) => {
  try {
    const about = await getOrCreateAboutPage();

    res.status(200).json({
      success: true,
      data: about.ourEthos,
    });
  } catch (error) {
    sendError(res, error, 500);
  }
};

export const updateOurEthos = async (req, res) => {
  try {
    const about = await getOrCreateAboutPage();

    await updateSection(about, "ourEthos", req.body);

    res.status(200).json({
      success: true,
      message: "Our Ethos updated successfully.",
      data: about.ourEthos,
    });
  } catch (error) {
    sendError(res, error);
  }
};

// =====================================
// GUIDANCE SECTION
// =====================================
export const getGuidance = async (req, res) => {
  try {
    const about = await getOrCreateAboutPage();

    res.status(200).json({
      success: true,
      data: about.guidance,
    });
  } catch (error) {
    sendError(res, error, 500);
  }
};

export const updateGuidance = async (req, res) => {
  try {
    const about = await getOrCreateAboutPage();

    await updateSection(about, "guidance", req.body);

    res.status(200).json({
      success: true,
      message: "Guidance updated successfully.",
      data: about.guidance,
    });
  } catch (error) {
    sendError(res, error);
  }
};

// =====================================
// FAQ SECTION
// =====================================
export const getFaq = async (req, res) => {
  try {
    const about = await getOrCreateAboutPage();

    res.status(200).json({
      success: true,
      data: about.faq,
    });
  } catch (error) {
    sendError(res, error, 500);
  }
};

export const updateFaq = async (req, res) => {
  try {
    const about = await getOrCreateAboutPage();

    await updateSection(about, "faq", req.body);

    res.status(200).json({
      success: true,
      message: "FAQ updated successfully.",
      data: about.faq,
    });
  } catch (error) {
    sendError(res, error);
  }
};

// =====================================
// FEEDBACK FORM SECTION
// =====================================
export const getFeedback = async (req, res) => {
  try {
    const about = await getOrCreateAboutPage();

    // Return only public fields.
    // Never expose visitor submissions here.
    const feedback = about.feedback.toObject();

    delete feedback.submissions;
    delete feedback._id;

    res.status(200).json({
      success: true,
      data: feedback,
    });
  } catch (error) {
    sendError(res, error, 500);
  }
};

export const updateFeedback = async (req, res) => {
  try {
    const about = await getOrCreateAboutPage();

    await updateSection(about, "feedback", req.body);

    const feedback = about.feedback.toObject();

    delete feedback.submissions;
    delete feedback._id;

    res.status(200).json({
      success: true,
      message: "Feedback form updated successfully.",
      data: feedback,
    });
  } catch (error) {
    sendError(res, error);
  }
};

// =====================================
// SUBMIT VISITOR FEEDBACK
// =====================================
export const submitFeedback = async (req, res) => {
  try {
    const { fullName, email, message } = req.body;

    if (
      typeof fullName !== "string" ||
      typeof email !== "string" ||
      typeof message !== "string" ||
      !fullName.trim() ||
      !email.trim() ||
      !message.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Full name, email and message are required.",
      });
    }

    if (fullName.length > 100 || email.length > 254 || message.length > 5000) {
      return res.status(400).json({
        success: false,
        message: "One or more fields exceed the allowed length.",
      });
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email.trim())) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address.",
      });
    }

    const about = await getOrCreateAboutPage();

    about.feedback.submissions.push({
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      message: message.trim(),
      status: "New",
    });

    await about.save();

    res.status(201).json({
      success: true,
      message: "Your message was submitted successfully.",
    });
  } catch (error) {
    sendError(res, error);
  }
};

// =====================================
// GET VISITOR FEEDBACK SUBMISSIONS
// ADMIN ONLY - PROTECT WITH AUTHENTICATION
// =====================================
export const getFeedbackSubmissions = async (req, res) => {
  try {
    const about = await AboutPage.findOne();

    if (!about) {
      return res.status(404).json({
        success: false,
        message: "About page not found.",
      });
    }

    const submissions = [...about.feedback.submissions].sort(
      (a, b) => new Date(b.submittedAt) - new Date(a.submittedAt),
    );

    res.status(200).json({
      success: true,
      count: submissions.length,
      data: submissions,
    });
  } catch (error) {
    sendError(res, error, 500);
  }
};

// =====================================
// UPDATE FEEDBACK MESSAGE STATUS
// ADMIN ONLY - PROTECT WITH AUTHENTICATION
// =====================================
export const updateFeedbackStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = ["New", "Read", "Replied"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid message status.",
      });
    }

    const about = await AboutPage.findOne();

    if (!about) {
      return res.status(404).json({
        success: false,
        message: "About page not found.",
      });
    }

    const submission = about.feedback.submissions.id(id);

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: "Message not found.",
      });
    }

    submission.status = status;

    await about.save();

    res.status(200).json({
      success: true,
      message: "Message status updated successfully.",
      data: submission,
    });
  } catch (error) {
    sendError(res, error);
  }
};

// =====================================
// DELETE FEEDBACK MESSAGE
// ADMIN ONLY - PROTECT WITH AUTHENTICATION
// =====================================
export const deleteFeedbackSubmission = async (req, res) => {
  try {
    const { id } = req.params;

    const about = await AboutPage.findOne();

    if (!about) {
      return res.status(404).json({
        success: false,
        message: "About page not found.",
      });
    }

    const submission = about.feedback.submissions.id(id);

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: "Message not found.",
      });
    }

    about.feedback.submissions.pull(id);

    await about.save();

    res.status(200).json({
      success: true,
      message: "Message deleted successfully.",
    });
  } catch (error) {
    sendError(res, error);
  }
};

// =====================================
// GENERIC CRUD CONFIGURATION
// =====================================
const allowedCollections = {
  gallery: ["images"],

  aboutSection: ["socialLinks"],

  ourEthos: ["valuesParagraphs", "images", "features"],

  guidance: ["experts"],

  faq: ["questions"],

  feedback: ["contactItems"],
};

const stringCollections = [
  "gallery.images",
  "ourEthos.valuesParagraphs",
  "ourEthos.images",
];

const allowedItemFields = {
  "aboutSection.socialLinks": ["name", "url"],

  "ourEthos.features": ["title", "description", "icon"],

  "guidance.experts": ["name", "description", "image"],

  "faq.questions": ["question", "answer"],

  "feedback.contactItems": ["label", "value", "href", "icon"],
};

// =====================================
// HELPER: GET COLLECTION
// =====================================
const getCollection = (about, section, collection) => {
  if (!allowedCollections[section]?.includes(collection)) {
    throw new Error("Invalid section or collection.");
  }

  const items = about.get(`${section}.${collection}`);

  if (!Array.isArray(items)) {
    throw new Error("Collection not found.");
  }

  return items;
};

// =====================================
// HELPER: FIND ITEM INDEX
// =====================================
const findItemIndex = (items, itemId) => {
  if (/^\d+$/.test(itemId)) {
    const index = Number(itemId);

    return index >= 0 && index < items.length ? index : -1;
  }

  return items.findIndex((item) => item?._id?.toString() === itemId);
};

// =====================================
// HELPER: VALIDATE COLLECTION ITEM
// =====================================
const validateItem = (section, collection, body) => {
  const key = `${section}.${collection}`;
  const allowedFields = allowedItemFields[key];

  if (!allowedFields) {
    throw new Error("Invalid collection.");
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    throw new Error("A valid item object is required.");
  }

  const item = {};

  for (const field of allowedFields) {
    if (body[field] !== undefined) {
      item[field] = body[field];
    }
  }

  if (Object.keys(item).length === 0) {
    throw new Error("No valid item fields provided.");
  }

  return item;
};

// =====================================
// READ COLLECTION ITEMS
// =====================================
export const getSectionItems = async (req, res) => {
  try {
    const { section, collection } = req.params;

    const about = await getOrCreateAboutPage();
    const items = getCollection(about, section, collection);

    res.status(200).json({
      success: true,
      count: items.length,
      data: items,
    });
  } catch (error) {
    sendError(res, error);
  }
};

// =====================================
// CREATE COLLECTION ITEM
// =====================================
export const createSectionItem = async (req, res) => {
  try {
    const { section, collection } = req.params;

    const about = await getOrCreateAboutPage();
    const items = getCollection(about, section, collection);

    if (stringCollections.includes(`${section}.${collection}`)) {
      const { value } = req.body;

      if (typeof value !== "string" || !value.trim()) {
        return res.status(400).json({
          success: false,
          message: "A non-empty string value is required.",
        });
      }

      items.push(value.trim());
    } else {
      const item = validateItem(section, collection, req.body);

      items.push(item);
    }

    await about.save();

    res.status(201).json({
      success: true,
      message: "Item created successfully.",
      data: items[items.length - 1],
    });
  } catch (error) {
    sendError(res, error);
  }
};

// =====================================
// UPDATE COLLECTION ITEM
// =====================================
export const updateSectionItem = async (req, res) => {
  try {
    const { section, collection, itemId } = req.params;

    const about = await AboutPage.findOne();

    if (!about) {
      return res.status(404).json({
        success: false,
        message: "About page not found.",
      });
    }

    const items = getCollection(about, section, collection);
    const index = findItemIndex(items, itemId);

    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: "Item not found.",
      });
    }

    if (stringCollections.includes(`${section}.${collection}`)) {
      const { value } = req.body;

      if (typeof value !== "string" || !value.trim()) {
        return res.status(400).json({
          success: false,
          message: "A non-empty string value is required.",
        });
      }

      items.set(index, value.trim());
    } else {
      const updates = validateItem(section, collection, req.body);

      Object.assign(items[index], updates);
    }

    await about.save();

    res.status(200).json({
      success: true,
      message: "Item updated successfully.",
      data: items[index],
    });
  } catch (error) {
    sendError(res, error);
  }
};

// =====================================
// DELETE COLLECTION ITEM
// =====================================
export const deleteSectionItem = async (req, res) => {
  try {
    const { section, collection, itemId } = req.params;

    const about = await AboutPage.findOne();

    if (!about) {
      return res.status(404).json({
        success: false,
        message: "About page not found.",
      });
    }

    const items = getCollection(about, section, collection);
    const index = findItemIndex(items, itemId);

    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: "Item not found.",
      });
    }

    items.splice(index, 1);

    await about.save();

    res.status(200).json({
      success: true,
      message: "Item deleted successfully.",
    });
  } catch (error) {
    sendError(res, error);
  }
};
