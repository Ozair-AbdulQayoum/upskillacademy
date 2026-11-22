import mongoose from "mongoose";

// ==================================================
// REUSABLE STEP SCHEMA
// ==================================================

const employersStepSchema = new mongoose.Schema(
  {
    number: {
      type: String,
      required: true,
      trim: true,
      default: "01",
    },
    title: {
      type: String,
      required: true,
      trim: true,
      default: "",
    },
    description: {
      type: String,
      required: true,
      trim: true,
      default: "",
    },
    icon: {
      type: String,
      enum: ["Search", "Send", "CalendarCheck"],
      default: "Search",
    },
  },
  { _id: false },
);

// ==================================================
// NO FEES CARD SCHEMA
// ==================================================

const employersNoFeesSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      default: "No fees for companies. Hiring through Upskill is free.",
    },
    description: {
      type: String,
      trim: true,
      default:
        "No fees and no account. You pick the student, we arrange the rest.",
    },
    icon: {
      type: String,
      enum: ["BriefcaseBusiness"],
      default: "BriefcaseBusiness",
    },
  },
  { _id: false },
);

// ==================================================
// FEATURE CARD SCHEMA
// ==================================================

const employersFeatureSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      default: "",
    },
    description: {
      type: String,
      required: true,
      trim: true,
      default: "",
    },
    icon: {
      type: String,
      enum: ["FolderCheck", "BadgeCheck"],
      default: "FolderCheck",
    },
  },
  { _id: false },
);

// ==================================================
// EMPLOYERS HERO SCHEMA
// ==================================================

const employersHeroSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      trim: true,
      default: "For employers",
    },
    heading: {
      type: String,
      trim: true,
      default: "Hire trained junior talent.",
    },
    highlightedHeading: {
      type: String,
      trim: true,
      default: "See the work first.",
    },
    description: {
      type: String,
      trim: true,
      default:
        "See real projects first, then ask us for an interview. There is no recruitment fee.",
    },
    primaryButtonText: {
      type: String,
      trim: true,
      default: "Browse talent",
    },
    primaryButtonLink: {
      type: String,
      trim: true,
      default: "/student-projects",
    },
    secondaryButtonText: {
      type: String,
      trim: true,
      default: "Corporate training",
    },
    secondaryButtonLink: {
      type: String,
      trim: true,
      default: "/corporate-training",
    },
    images: {
      image1: {
        type: String,
        default: "",
        trim: true,
      },
      image2: {
        type: String,
        default: "",
        trim: true,
      },
      image3: {
        type: String,
        default: "",
        trim: true,
      },
    },
    isVisible: {
      type: Boolean,
      default: true,
    },
  },
  { _id: false },
);

// ==================================================
// EMPLOYERS HOW IT WORKS SCHEMA
// ==================================================

const employersHowItWorksSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      trim: true,
      default: "How it works",
    },
    heading: {
      type: String,
      trim: true,
      default: "From first look to first interview in three steps",
    },

    // THREE STEPS

    steps: {
      type: [employersStepSchema],
      default: () => [
        {
          number: "01",
          title: "Browse portfolios",
          description:
            "Every public profile is reviewed by our team before it goes live.",
          icon: "Search",
        },
        {
          number: "02",
          title: "Send one request",
          description:
            "Choose a student, or describe the role and let us suggest people.",
          icon: "Send",
        },
        {
          number: "03",
          title: "We arrange the interview",
          description: "We check availability and reply within 48 hours.",
          icon: "CalendarCheck",
        },
      ],
      validate: {
        validator: (steps) => steps.length === 3,
        message: "Exactly three steps are required.",
      },
    },

    // NO FEES CARD

    noFees: {
      type: employersNoFeesSchema,
      default: () => ({}),
    },

    // FEATURE CARDS

    features: {
      type: [employersFeatureSchema],
      default: () => [
        {
          title: "Project-based learning",
          description: "Every profile shows real work, not just a certificate.",
          icon: "FolderCheck",
        },
        {
          title: "Checked by our team",
          description:
            "Profiles are reviewed by Upskill before they go live, so you know who you're looking at.",
          icon: "BadgeCheck",
        },
      ],
      validate: {
        validator: (features) => features.length === 2,
        message: "Exactly two feature cards are required.",
      },
    },

    // SECTION IMAGE

    image: {
      type: String,
      trim: true,
      default: "",
    },

    // VISIBILITY

    isVisible: {
      type: Boolean,
      default: true,
    },
  },
  { _id: false },
);

// ==================================================
// EMPLOYERS CTA SCHEMA
// ==================================================

const employersCTASchema = new mongoose.Schema(
  {
    heading: {
      type: String,
      trim: true,
      default: "Have an internship or job to fill?",
    },
    description: {
      type: String,
      trim: true,
      default:
        "Tell us about the role and we'll send you a short list of students who could do it.",
    },
    buttonText: {
      type: String,
      trim: true,
      default: "Contact our team",
    },
    buttonLink: {
      type: String,
      trim: true,
      default: "/contact",
    },
    isVisible: {
      type: Boolean,
      default: true,
    },
  },
  { _id: false },
);

// ==================================================
// EMPLOYERS PAGE SCHEMA
// ==================================================

const employersPageSchema = new mongoose.Schema(
  {
    hero: {
      type: employersHeroSchema,
      default: () => ({}),
    },

    howItWorks: {
      type: employersHowItWorksSchema,
      default: () => ({}),
    },

    // CTA SECTION

    cta: {
      type: employersCTASchema,
      default: () => ({}),
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// ==================================================
// MODEL EXPORT
// ==================================================

const EmployersPage =
  mongoose.models.EmployersPage ||
  mongoose.model("EmployersPage", employersPageSchema);

export default EmployersPage;
