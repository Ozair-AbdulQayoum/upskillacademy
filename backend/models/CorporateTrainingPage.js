import mongoose from "mongoose";

// ==============================
// CORPORATE TRAINING HERO SCHEMA
// ==============================

const corporateTrainingHeroSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      trim: true,
      default: "For teams",
    },

    heading: {
      type: String,
      trim: true,
      default: "Corporate training",
    },

    highlightedHeading: {
      type: String,
      trim: true,
      default: "Skills your staff can use.",
    },

    description: {
      type: String,
      trim: true,
      default:
        "Practical digital skills training for your staff, planned around your work.",
    },

    buttonText: {
      type: String,
      trim: true,
      default: "Request a training plan",
    },

    buttonLink: {
      type: String,
      trim: true,
      default: "/contact",
    },

    image1: {
      type: String,
      default: "",
    },

    image2: {
      type: String,
      default: "",
    },

    image3: {
      type: String,
      default: "",
    },

    isVisible: {
      type: Boolean,
      default: true,
    },
  },
  { _id: false },
);

// ==============================
// CORPORATE TRAINING TOPIC ITEM
// ==============================

const corporateTrainingTopicSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true,
    },

    icon: {
      type: String,
      trim: true,
      default: "Globe",
    },
  },
  { _id: true },
);

// ==============================
// CORPORATE TRAINING TOPICS SCHEMA
// ==============================

const corporateTrainingTopicsSchema = new mongoose.Schema(
  {
    sectionLabel: {
      type: String,
      trim: true,
      default: "Topics",
    },

    sectionHeading: {
      type: String,
      trim: true,
      default: "Topics we can teach",
    },

    topics: {
      type: [corporateTrainingTopicSchema],
      default: [
        {
          title: "Typing and office skills",
          icon: "Keyboard",
        },
        {
          title: "Accounting and QuickBooks",
          icon: "Calculator",
        },
        {
          title: "Graphic design",
          icon: "Palette",
        },
        {
          title: "Websites and WordPress",
          icon: "Globe",
        },
      ],
    },

    howItWorksLabel: {
      type: String,
      trim: true,
      default: "How it works",
    },

    howItWorksHeading: {
      type: String,
      trim: true,
      default: "Three simple steps",
    },

    steps: {
      type: [String],
      default: [
        "Tell us about your team and what they need to learn.",
        "We propose a plan, schedule and price.",
        "We deliver the training online or in person.",
      ],
    },

    buttonText: {
      type: String,
      trim: true,
      default: "Request a training plan",
    },

    buttonLink: {
      type: String,
      trim: true,
      default: "/contact",
    },

    image: {
      type: String,
      default: "",
    },

    isVisible: {
      type: Boolean,
      default: true,
    },
  },
  { _id: false },
);

// ==============================
// CORPORATE TRAINING PAGE SCHEMA
// ==============================

const corporateTrainingPageSchema = new mongoose.Schema(
  {
    hero: {
      type: corporateTrainingHeroSchema,
      default: () => ({}),
    },

    topics: {
      type: corporateTrainingTopicsSchema,
      default: () => ({}),
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// ==============================
// MODEL EXPORT
// ==============================

const CorporateTrainingPage =
  mongoose.models.CorporateTrainingPage ||
  mongoose.model("CorporateTrainingPage", corporateTrainingPageSchema);

export default CorporateTrainingPage;
