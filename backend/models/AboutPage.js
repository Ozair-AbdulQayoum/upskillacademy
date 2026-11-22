import mongoose from "mongoose";

// SOCIAL LINKS
const socialLinkSchema = new mongoose.Schema(
  {
    name: { type: String, default: "" },
    url: { type: String, default: "" },
  },
  { _id: true },
);

// STATISTICS
const statisticSchema = new mongoose.Schema(
  {
    value: { type: Number, default: 0 },
    suffix: { type: String, default: "" },
    title: { type: String, default: "" },
    description: { type: String, default: "" },
  },
  { _id: false },
);

// ETHOS FEATURES
const featureSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    icon: {
      type: String,
      enum: ["book", "globe", "users", "lightbulb"],
      default: "book",
    },
  },
  { _id: true },
);

// GUIDANCE EXPERTS
const expertSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, default: "" },
  },
  { _id: true },
);

// FAQ QUESTIONS
const questionSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
  },
  { _id: true },
);

// CONTACT ITEMS
const contactItemSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    value: { type: String, required: true },
    href: { type: String, required: true },
    icon: {
      type: String,
      enum: ["location", "email", "phone"],
      default: "location",
    },
  },
  { _id: true },
);

// VISITOR FEEDBACK SUBMISSIONS
const submissionSchema = new mongoose.Schema(
  {
    fullName: {
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
    message: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["New", "Read", "Replied"],
      default: "New",
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true },
);

// MAIN ABOUT PAGE SCHEMA
const aboutPageSchema = new mongoose.Schema(
  {
    // HERO SECTION
    hero: {
      subtitle: {
        type: String,
        default: "About Upskill",
      },
      title: {
        type: String,
        default: "Our Story",
      },
      backgroundImage: {
        type: String,
        default: "/uploads/about-hero.jpg",
      },
      imageAlt: {
        type: String,
        default: "About Upskill",
      },
    },

    // GALLERY SECTION
    gallery: {
      description: {
        type: String,
        default:
          "At Upskill Academy, We are passionate about turning curiosity into real digital skills that elevate lives and open doors to global opportunities.",
      },
      images: {
        type: [String],
        default: [
          "Story-img-1.jpg",
          "Story-img-2.jpg",
          "Story-img-3.jpg",
          "Story-img-4.jpg",
          "Story-img-5.jpg",
          "Story-img-6.jpg",
          "Story-img-7.jpg",
        ],
      },
    },

    // ABOUT SECTION
    aboutSection: {
      badge: {
        type: String,
        default: "About",
      },
      title: {
        type: String,
        default: "Unveiling Our Vision and Mission",
      },
      description: {
        type: String,
        default:
          "Explore our vision and mission, as we connect local talent with global opportunities through free, practical learning.",
      },

      // ABOUT SECTION IMAGES
      images: {
        first: {
          type: String,
          default: "",
        },
        second: {
          type: String,
          default: "",
        },
      },

      // SOCIAL LINKS
      socialLinks: {
        type: [socialLinkSchema],
        default: [
          { name: "Facebook", url: "#" },
          { name: "Instagram", url: "#" },
          { name: "LinkedIn", url: "#" },
          {
            name: "Email",
            url: "mailto:info@upskillacademy.af",
          },
        ],
      },

      // STATISTICS
      statistics: {
        students: {
          type: statisticSchema,
          default: () => ({
            value: 1350,
            title: "Students",
            description:
              "Learners growing with our community in Kabul and online.",
          }),
        },

        teamMembers: {
          type: statisticSchema,
          default: () => ({
            value: 7,
            title: "Team Members",
            description:
              "Our dedicated mentors and instructors guiding every learner.",
          }),
        },

        freeLearning: {
          type: statisticSchema,
          default: () => ({
            value: 100,
            suffix: "%",
            title: "Free Learning",
            description:
              "Every course is free, so talent — not money — decides who gets to learn.",
          }),
        },

        mission: {
          type: statisticSchema,
          default: () => ({
            value: 1,
            title: "Mission",
            description:
              "United by one goal: empower youth with digital skills for real impact.",
          }),
        },

        courses: {
          type: statisticSchema,
          default: () => ({
            value: 7,
            title: "Courses",
            description: "Practical tracks in code, design and digital skills.",
          }),
        },
      },
    },

    // OUR ETHOS / VALUES & MISSION
    ourEthos: {
      valuesBadge: {
        type: String,
        default: "Our Values",
      },
      valuesTitle: {
        type: String,
        default: "Curiosity & Inclusion",
      },
      valuesParagraphs: {
        type: [String],
        default: [
          "We believe curiosity is where every skill begins. Our courses are built around practical projects, real tools and the skills employers actually look for, so learners grow by doing.",
          "Education should be open to everyone, regardless of background. That is why our programs are free and our community welcomes learners at every level.",
        ],
      },

      missionBadge: {
        type: String,
        default: "Our Mission",
      },
      missionTitle: {
        type: String,
        default: "Leading the Way in Digital Skills",
      },
      missionDescription: {
        type: String,
        default:
          "Our mission is to empower Afghanistan’s youth with digital skills that spark innovation, creativity and real-world impact — connecting local talent with global opportunities.",
      },

      // ETHOS IMAGES
      images: {
        type: [String],
        default: [],
      },

      // FEATURES
      features: {
        type: [featureSchema],
        default: [
          {
            title: "Practical Learning",
            description:
              "Learn by building real projects and using industry tools.",
            icon: "book",
          },
          {
            title: "Global Reach",
            description: "Connecting local talent with global opportunities.",
            icon: "globe",
          },
          {
            title: "Community Driven",
            description: "Growing together through collaboration and support.",
            icon: "users",
          },
          {
            title: "Innovation Focused",
            description: "Encouraging creativity, ideas and new possibilities.",
            icon: "lightbulb",
          },
        ],
      },
    },

    // GUIDANCE SECTION
    guidance: {
      title: {
        type: String,
        default: "We Bring Expertise and Guidance for Talent",
      },
      description: {
        type: String,
        default:
          "Led by experts working daily in technology, AI, and leadership — bringing real-world experience to every program.",
      },

      experts: {
        type: [expertSchema],
        default: [
          {
            name: "Khalil Rahman Noori",
            description:
              "An experienced Finance Officer and Chief Financial Officer (CFO) specializing in financial management, budgeting, reporting, and financial strategy.",
            image: "",
          },
          {
            name: "Gula Khan Hamdard",
            description:
              "A passionate web developer and educator at Upskill Learning Center who loves sharing knowledge, life lessons, and practical experience.",
            image: "",
          },
          {
            name: "Khalid Danishyar",
            description:
              "A Full Stack Web Developer and WordPress Expert with seven years of commercial experience and a Master of Computer Science from Bakhtar University.",
            image: "",
          },
          {
            name: "Noman Sahar",
            description:
              "A businessman and Amazon professional with experience in online business and e-commerce operations.",
            image: "",
          },
          {
            name: "Farhad Faizi",
            description:
              "A Graphic Designer and Design Instructor with over 12 years of hands-on experience in branding, advertising, and digital design.",
            image: "",
          },
        ],
      },
    },

    // FAQ SECTION
    faq: {
      title: {
        type: String,
        default: "Frequently Asked Questions",
      },
      description: {
        type: String,
        default: "Everything you need to know about Upskill Academy",
      },

      questions: {
        type: [questionSchema],
        default: [
          {
            question: "How long do the courses take to complete?",
            answer:
              "Courses are self-paced. You can study anytime and finish at your own speed. Some courses take a few hours, while others may take several weeks.",
          },
          {
            question: "How do I enroll in a course?",
            answer:
              "Enrolling is simple: browse our course catalog, select your course, and start learning immediately. At Upskill Online Academy, we are on a mission to empower Afghanistan’s next generation by providing the skills that shape the future.",
          },
          {
            question: "Who can join Upskill Online Academy?",
            answer:
              "Anyone in Afghanistan can join! Whether you are a student, working professional, or someone looking to learn new skills, our platform is open to everyone.",
          },
          {
            question: "What is Upskill Online Academy?",
            answer:
              "Upskill Online Academy is an online learning platform dedicated to helping learners improve their digital and professional skills. Our courses are designed for beginners, students, and professionals who want to upskill, gain practical knowledge, or advance their careers.",
          },
          {
            question: "Are the courses free or paid?",
            answer:
              "All courses at Upskill Online Academy are completely free. We aim to make high-quality learning accessible to anyone across Afghanistan.",
          },
        ],
      },
    },

    // FEEDBACK FORM SECTION
    feedback: {
      title: {
        type: String,
        default: "Get in Touch",
      },
      description: {
        type: String,
        default:
          "Have questions, feedback, or want to collaborate? Fill out the form — we’d love to hear from you.",
      },
      formTitle: {
        type: String,
        default: "Send Us a Message",
      },
      formDescription: {
        type: String,
        default: "Fill in the details below and we'll get back to you.",
      },

      // CONTACT INFORMATION
      contactItems: {
        type: [contactItemSchema],
        default: [
          {
            label: "Location",
            value: "Karta-e-Chahar, Kabul, Afghanistan",
            href: "https://www.google.com/maps?q=Upskill+Bootcamps,+G44R%2BP4R,+Kabul+1005,+Afghanistan",
            icon: "location",
          },
          {
            label: "Email Address",
            value: "info@upskillacademy.tech",
            href: "mailto:info@upskillacademy.tech",
            icon: "email",
          },
          {
            label: "Phone Number",
            value: "+93 78 176 5151",
            href: "tel:+93781765151",
            icon: "phone",
          },
        ],
      },

      // VISITOR SUBMISSIONS
      submissions: {
        type: [submissionSchema],
        default: [],
      },
    },
  },
  {
    timestamps: true,
  },
);

const AboutPage = mongoose.model("AboutPage", aboutPageSchema);

export default AboutPage;
