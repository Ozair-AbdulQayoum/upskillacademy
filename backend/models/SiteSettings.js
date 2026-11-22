import mongoose from "mongoose";

// Reusable footer link
const footerLinkSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    path: { type: String, required: true },
    order: { type: Number, default: 0 },
    isVisible: { type: Boolean, default: true },
  },
  { _id: true },
);

// Footer column
const footerColumnSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    links: { type: [footerLinkSchema], default: [] },
  },
  { _id: false },
);

// Social media
const socialLinkSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    url: { type: String, default: "" },
    isVisible: { type: Boolean, default: true },
  },
  { _id: false },
);

// Navbar links
const navLinkSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    path: { type: String, required: true },
    order: { type: Number, default: 0 },
    isVisible: { type: Boolean, default: true },
  },
  { _id: true },
);

const languageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    code: { type: String, required: true },
    isVisible: { type: Boolean, default: true },
  },
  { _id: false },
);

const buttonSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    path: { type: String, required: true },
    isVisible: { type: Boolean, default: true },
  },
  { _id: false },
);

// Navbar
const navbarSchema = new mongoose.Schema(
  {
    logo: {
      image: { type: String, default: "/uploads/logo.png" },
      alt: { type: String, default: "Upskill Academy" },
      link: { type: String, default: "/" },
    },
    navLinks: { type: [navLinkSchema], default: [] },
    languages: { type: [languageSchema], default: [] },
    loginButton: {
      type: buttonSchema,
      default: () => ({
        label: "Log in",
        path: "/login",
        isVisible: true,
      }),
    },
    startLearningButton: {
      type: buttonSchema,
      default: () => ({
        label: "Start Learning",
        path: "/register",
        isVisible: true,
      }),
    },
  },
  { _id: false },
);

// Footer
const footerSchema = new mongoose.Schema(
  {
    brandName: { type: String, default: "Upskill" },
    description: {
      type: String,
      default: "Empowering Afghan Youth with Skills for a Digital Future",
    },
    poweredByText: { type: String, default: "Powered by Upskill" },

    socialLinks: {
      type: [socialLinkSchema],
      default: [],
    },

    qrCode: {
      type: String,
      default: "/uploads/connect-icon.png",
    },

    columns: {
      type: [footerColumnSchema],
      default: [],
    },

    location: { type: String, default: "Kabul, Afghanistan" },
    phone: { type: String, default: "+93 78 176 5151" },
    phoneLink: { type: String, default: "tel:+93781765151" },

    copyrightText: {
      type: String,
      default: "© 2026 Upskill Academy. All rights reserved.",
    },

    bottomLinks: {
      type: [footerLinkSchema],
      default: [],
    },
  },
  { _id: false },
);

// Main Site Settings
const siteSettingsSchema = new mongoose.Schema(
  {
    navbar: {
      type: navbarSchema,
      default: () => ({}),
    },
    footer: {
      type: footerSchema,
      default: () => ({}),
    },
  },
  { timestamps: true },
);

const SiteSettings = mongoose.model("SiteSettings", siteSettingsSchema);

export default SiteSettings;
