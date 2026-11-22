import SiteSettings from "../models/SiteSettings.js";

// Get or create the main settings document
const getOrCreateSettings = async () => {
  let settings = await SiteSettings.findOne();

  if (!settings) {
    settings = await SiteSettings.create({});
  }

  return settings;
};

// ===============================
// NAVBAR
// ===============================

// GET Navbar
export const getNavbar = async (req, res) => {
  try {
    const settings = await getOrCreateSettings();

    return res.status(200).json({
      success: true,
      message: "Navbar data fetched successfully",
      data: settings.navbar,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch Navbar data",
      error: error.message,
    });
  }
};

// UPDATE Navbar
export const updateNavbar = async (req, res) => {
  try {
    if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Navbar data",
      });
    }

    const settings = await getOrCreateSettings();

    settings.navbar = req.body;
    await settings.save();

    return res.status(200).json({
      success: true,
      message: "Navbar updated successfully",
      data: settings.navbar,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update Navbar",
      error: error.message,
    });
  }
};

// ===============================
// FOOTER
// ===============================

// GET Footer
export const getFooter = async (req, res) => {
  try {
    const settings = await getOrCreateSettings();

    return res.status(200).json({
      success: true,
      message: "Footer data fetched successfully",
      data: settings.footer,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch Footer data",
      error: error.message,
    });
  }
};

// UPDATE Footer
export const updateFooter = async (req, res) => {
  try {
    if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Footer data",
      });
    }

    const settings = await getOrCreateSettings();

    settings.footer = req.body;
    await settings.save();

    return res.status(200).json({
      success: true,
      message: "Footer updated successfully",
      data: settings.footer,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update Footer",
      error: error.message,
    });
  }
};
