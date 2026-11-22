import mongoose from "mongoose";

// ==================================================
// FAQ SCHEMA
// ==================================================

const scholarshipFaqSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
      trim: true,
    },
    answer: {
      type: String,
      required: true,
      trim: true,
    },
    isVisible: {
      type: Boolean,
      default: true,
    },
  },
  {
    _id: true,
    timestamps: true,
  },
);

// ==================================================
// FAQ GALLERY IMAGE SCHEMA
// ==================================================

const faqGalleryImageSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      default: "",
      trim: true,
    },
    isVisible: {
      type: Boolean,
      default: true,
    },
  },
  {
    _id: false,
  },
);

// ==================================================
// APPLICATION SCHEMA
// ==================================================

const scholarshipApplicationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  gender: {
    type: String,
    required: true,
    enum: ["Male", "Female"],
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  whatsapp: {
    type: String,
    required: true,
    trim: true,
  },
  city: {
    type: String,
    required: true,
    trim: true,
  },
  program: {
    type: String,
    default: "",
    trim: true,
  },
  experience: {
    type: String,
    required: true,
    enum: ["Yes", "No"],
  },
  scholarshipReason: {
    type: String,
    required: true,
    trim: true,
  },
  careerGoal: {
    type: String,
    required: true,
    trim: true,
  },
  source: {
    type: String,
    required: true,
    trim: true,
  },
  status: {
    type: String,
    enum: ["Pending", "Reviewed", "Approved", "Rejected"],
    default: "Pending",
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
});

// ==================================================
// DEFAULT SCHOLARSHIP FAQs
// ==================================================

const defaultFAQs = [
  {
    question: "What is this scholarship program?",
    answer:
      "This is a special opportunity to join our professional training courses with limited scholarship seats available.",
  },
  {
    question: "Who can apply for the scholarship?",
    answer:
      "Anyone who is motivated to learn and build their career can apply. Students, university learners, and job seekers are welcome.",
  },
  {
    question: "How many scholarships are available?",
    answer: "We are offering 300 scholarships for this program.",
  },
  {
    question: "How will I be notified?",
    answer:
      "We contact applicants through the email or WhatsApp number you provide.",
  },
  {
    question: "Can I change my program after applying?",
    answer: "Yes, you can request a change by contacting our support team.",
  },
  {
    question: "Is there a deadline to apply?",
    answer:
      "Yes. Seats are limited, and registration will close once all 300 scholarships are filled.",
  },
  {
    question: "What courses are included in the scholarship?",
    answer:
      "The scholarship covers selected professional skill-based courses designed to help you grow in your career.",
  },
  {
    question: "How will I know if I am selected?",
    answer:
      "Our team will contact shortlisted applicants after reviewing applications.",
  },
];

// ==================================================
// SCHOLARSHIP PAGE SCHEMA
// ==================================================

const scholarshipPageSchema = new mongoose.Schema(
  {
    // ==================================================
    // HERO SECTION
    // ==================================================

    hero: {
      heading: {
        type: String,
        default: "Upskill Digital Skills Scholarships",
      },
      paragraph1: {
        type: String,
        default:
          "Unlock your potential with Upskill Scholarships! Gain access to practical digital skills training, expert mentorship, and clear career pathways.",
      },
      paragraph2: {
        type: String,
        default:
          "Our scholarships empower learners to develop real-world skills in web development, graphic design, digital marketing, and more. Apply now to start your journey toward a successful career.",
      },
      buttonText: {
        type: String,
        default: "Apply Now",
      },
      buttonLink: {
        type: String,
        default: "/ApplicationForm",
      },
      bannerTitle: {
        type: String,
        default: "Upskill Scholarships – Learn, Grow, Succeed",
      },
      videoLink: {
        type: String,
        default: "https://www.upskillacademy.tech/scholarship-applications",
      },

      images: {
        image1: { type: String, default: "" },
        image2: { type: String, default: "" },
        image3: { type: String, default: "" },
        image4: { type: String, default: "" },
        image5: { type: String, default: "" },
        image6: { type: String, default: "" },
        image7: { type: String, default: "" },
        image8: { type: String, default: "" },
      },

      isVisible: {
        type: Boolean,
        default: true,
      },
    },

    // ==================================================
    // SCHOLARSHIP FAQs
    // ==================================================

    faqs: {
      type: [scholarshipFaqSchema],
      default: () => defaultFAQs.map((faq) => ({ ...faq })),
    },

    // ==================================================
    // FAQ GALLERY IMAGES
    // ==================================================

    faqGallery: {
      image1: {
        type: faqGalleryImageSchema,
        default: () => ({
          url: "",
          isVisible: true,
        }),
      },
      image2: {
        type: faqGalleryImageSchema,
        default: () => ({
          url: "",
          isVisible: true,
        }),
      },
      image3: {
        type: faqGalleryImageSchema,
        default: () => ({
          url: "",
          isVisible: true,
        }),
      },
      image4: {
        type: faqGalleryImageSchema,
        default: () => ({
          url: "",
          isVisible: true,
        }),
      },
    },

    // ==================================================
    // SCHOLARSHIP APPLICATIONS
    // ==================================================

    applications: {
      type: [scholarshipApplicationSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

// ==================================================
// EXPORT MODEL
// ==================================================

const ScholarshipPage =
  mongoose.models.ScholarshipPage ||
  mongoose.model("ScholarshipPage", scholarshipPageSchema);

export default ScholarshipPage;
