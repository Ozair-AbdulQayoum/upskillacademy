import mongoose from "mongoose";

// ==============================
// SERVICES HERO
// ==============================

const servicesHeroSchema = new mongoose.Schema(
  {
    badge: {
      type: String,
      default: "Upskill Tech Services",
      trim: true,
    },
    headingPart1: {
      type: String,
      default: "Empowering Businesses",
      trim: true,
    },
    headingPart2: {
      type: String,
      default: "Inspiring Innovation",
      trim: true,
    },
    description: {
      type: String,
      default:
        "To empower businesses with cutting-edge technology solutions, unlocking their growth potential by connecting them with passionate and skilled engineers.",
      trim: true,
    },
  },
  { _id: false },
);

// ==============================
// PROGRAM ITEM
// ==============================

const programItemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    icon: {
      type: String,
      enum: ["web", "uiux", "graphic", "digital", "ai", "mobile"],
      default: "web",
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    features: {
      type: [String],
      default: [],
    },
    technologies: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true },
);

// ==============================
// TECHNOLOGY ITEM
// ==============================

const technologyItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    icon: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true },
);

// ==============================
// CLIENT ITEM
// ==============================

const clientItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    logo: {
      type: String,
      required: true,
      trim: true,
    },
    logoFileId: {
      type: String,
      default: null,
    },
  },
  { timestamps: true },
);

// ==============================
// VALUE ITEM
// ==============================

const valueItemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    icon: {
      type: String,
      required: true,
      trim: true,
    },
    iconFileId: {
      type: String,
      default: null,
    },
  },
  { timestamps: true },
);

// ==============================
// SERVICES PAGE
// ==============================

const servicesPageSchema = new mongoose.Schema(
  {
    hero: {
      type: servicesHeroSchema,
      default: () => ({}),
    },

    programs: {
      type: [programItemSchema],
      default: [],
    },

    technologies: {
      type: [technologyItemSchema],
      default: [],
    },

    clients: {
      type: [clientItemSchema],
      default: [],
    },

    values: {
      type: [valueItemSchema],
      default: [],
    },

    valuesSeeded: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

// ==============================
// EXPORT MODEL
// ==============================

const ServicesPage = mongoose.model("ServicesPage", servicesPageSchema);

export default ServicesPage;
