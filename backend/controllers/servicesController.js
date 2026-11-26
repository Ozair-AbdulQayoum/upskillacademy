import ServicesPage from "../models/ServicesPage.js";
import fs from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { toFile } from "@imagekit/nodejs";
import imagekit from "../config/imagekit.js";

// =====================================
// GET OR CREATE SERVICES DOCUMENT
// =====================================

const getOrCreateServices = async () => {
  let services = await ServicesPage.findOne();

  if (!services) {
    services = await ServicesPage.create({
      hero: {},
      programs: [],
      technologies: [],
      clients: [],
      values: [],
      valuesSeeded: false,
    });
  }

  return services;
};

// =====================================
// IMAGEKIT UPLOAD HELPERS
// =====================================

const uploadImageToImageKit = async (file, folder) => {
  if (!file?.buffer) {
    throw new Error("Image file is missing.");
  }

  if (!process.env.IMAGEKIT_PRIVATE_KEY) {
    throw new Error("ImageKit private key is not configured.");
  }

  const extension = path.extname(file.originalname || "").toLowerCase();
  const fileName = `${randomUUID()}${extension}`;

  const uploadedFile = await imagekit.files.upload({
    file: await toFile(file.buffer, fileName),
    fileName,
    folder: `/upskillacademy/${folder}`,
    useUniqueFileName: true,
  });

  if (!uploadedFile?.url || !uploadedFile?.fileId) {
    throw new Error("ImageKit upload failed.");
  }

  return {
    url: uploadedFile.url,
    fileId: uploadedFile.fileId,
  };
};

const deleteImageFromImageKit = async (fileId) => {
  if (!fileId) return;

  try {
    await imagekit.files.delete(fileId);
  } catch (error) {
    console.error("ImageKit delete error:", error.message);
  }
};

// =====================================
// HERO
// =====================================

// GET HERO
export const getServicesHero = async (req, res) => {
  try {
    const services = await getOrCreateServices();

    return res.status(200).json({
      success: true,
      message: "Hero fetched successfully",
      data: services.hero,
    });
  } catch (error) {
    console.error("Get Services Hero:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch Hero",
      error: error.message,
    });
  }
};

// UPDATE HERO
export const updateServicesHero = async (req, res) => {
  try {
    const { badge, headingPart1, headingPart2, description } = req.body;

    const services = await getOrCreateServices();

    services.hero = {
      badge: badge ?? services.hero.badge,
      headingPart1: headingPart1 ?? services.hero.headingPart1,
      headingPart2: headingPart2 ?? services.hero.headingPart2,
      description: description ?? services.hero.description,
    };

    await services.save();

    return res.status(200).json({
      success: true,
      message: "Hero updated successfully",
      data: services.hero,
    });
  } catch (error) {
    console.error("Update Services Hero:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update Hero",
      error: error.message,
    });
  }
};

// =====================================
// PROGRAMS
// =====================================

// GET ALL PROGRAMS
export const getServicesPrograms = async (req, res) => {
  try {
    const services = await getOrCreateServices();

    return res.status(200).json({
      success: true,
      message: "Programs fetched successfully",
      data: services.programs,
    });
  } catch (error) {
    console.error("Get Services Programs:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch programs",
      error: error.message,
    });
  }
};

// CREATE PROGRAM
export const createServicesProgram = async (req, res) => {
  try {
    const { title, icon, description, features, technologies } = req.body;

    if (typeof title !== "string" || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Program title is required",
      });
    }

    if (typeof description !== "string" || !description.trim()) {
      return res.status(400).json({
        success: false,
        message: "Program description is required",
      });
    }

    if (features !== undefined && !Array.isArray(features)) {
      return res.status(400).json({
        success: false,
        message: "Features must be an array",
      });
    }

    if (technologies !== undefined && !Array.isArray(technologies)) {
      return res.status(400).json({
        success: false,
        message: "Technologies must be an array",
      });
    }

    const services = await getOrCreateServices();

    services.programs.push({
      title: title.trim(),
      icon: icon || "web",
      description: description.trim(),
      features: features || [],
      technologies: technologies || [],
    });

    await services.save();

    const newProgram = services.programs[services.programs.length - 1];

    return res.status(201).json({
      success: true,
      message: "Program created successfully",
      data: newProgram,
    });
  } catch (error) {
    console.error("Create Services Program:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create program",
      error: error.message,
    });
  }
};

// UPDATE PROGRAM
export const updateServicesProgram = async (req, res) => {
  try {
    const services = await getOrCreateServices();
    const program = services.programs.id(req.params.id);

    if (!program) {
      return res.status(404).json({
        success: false,
        message: "Program not found",
      });
    }

    const { title, icon, description, features, technologies } = req.body;

    if (title !== undefined) {
      if (typeof title !== "string" || !title.trim()) {
        return res.status(400).json({
          success: false,
          message: "Program title cannot be empty",
        });
      }

      program.title = title.trim();
    }

    if (icon !== undefined) {
      program.icon = icon;
    }

    if (description !== undefined) {
      if (typeof description !== "string" || !description.trim()) {
        return res.status(400).json({
          success: false,
          message: "Program description cannot be empty",
        });
      }

      program.description = description.trim();
    }

    if (features !== undefined) {
      if (!Array.isArray(features)) {
        return res.status(400).json({
          success: false,
          message: "Features must be an array",
        });
      }

      program.features = features;
    }

    if (technologies !== undefined) {
      if (!Array.isArray(technologies)) {
        return res.status(400).json({
          success: false,
          message: "Technologies must be an array",
        });
      }

      program.technologies = technologies;
    }

    await services.save();

    return res.status(200).json({
      success: true,
      message: "Program updated successfully",
      data: program,
    });
  } catch (error) {
    console.error("Update Services Program:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update program",
      error: error.message,
    });
  }
};

// DELETE PROGRAM
export const deleteServicesProgram = async (req, res) => {
  try {
    const services = await getOrCreateServices();
    const program = services.programs.id(req.params.id);

    if (!program) {
      return res.status(404).json({
        success: false,
        message: "Program not found",
      });
    }

    services.programs.pull(req.params.id);
    await services.save();

    return res.status(200).json({
      success: true,
      message: "Program deleted successfully",
    });
  } catch (error) {
    console.error("Delete Services Program:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete program",
      error: error.message,
    });
  }
};

// SEED DEFAULT SIX PROGRAMS
export const seedDefaultServicesPrograms = async (req, res) => {
  try {
    const services = await getOrCreateServices();

    if (services.programs.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Programs already exist. No changes made.",
        data: services.programs,
      });
    }

    const defaultPrograms = [
      {
        title: "Web Development",
        icon: "web",
        description:
          "Modern, scalable web applications using Next.js, React, and cutting-edge technologies.",
        features: [
          "Custom web application development",
          "Progressive Web Apps (PWA)",
          "API integration & development",
          "E-commerce solutions",
          "Content Management Systems",
        ],
        technologies: [
          "React",
          "Next.js",
          "TypeScript",
          "Node.js",
          "Tailwind CSS",
        ],
      },
      {
        title: "UI/UX Design",
        icon: "uiux",
        description:
          "Beautiful, intuitive interfaces that users love, backed by solid UX research.",
        features: [
          "User research & testing",
          "Wireframing & prototyping",
          "Design systems",
          "Interaction design",
          "Accessibility compliance",
        ],
        technologies: [
          "Figma",
          "Adobe XD",
          "Sketch",
          "Illustrator",
          "Photoshop",
        ],
      },
      {
        title: "Graphic Design",
        icon: "graphic",
        description:
          "Creative visual design for brands, campaigns, and digital products.",
        features: [
          "Logo & brand identity design",
          "Social media creative assets",
          "Marketing collateral & brochures",
          "Presentation & pitch deck design",
          "Print-ready production files",
        ],
        technologies: [
          "Illustrator",
          "Photoshop",
          "InDesign",
          "Canva",
          "After Effects",
        ],
      },
      {
        title: "Digital Marketing",
        icon: "digital",
        description:
          "Performance-focused marketing strategies to drive traffic, leads, and conversions.",
        features: [
          "Search Engine Optimization (SEO)",
          "Google & Meta ad campaigns",
          "Social media marketing",
          "Email marketing automation",
          "Analytics tracking & reporting",
        ],
        technologies: [
          "Google Ads",
          "Meta Ads",
          "GA4",
          "Search Console",
          "Mailchimp",
        ],
      },
      {
        title: "AI & Machine Learning",
        icon: "ai",
        description:
          "Intelligent systems and AI integrations to automate and enhance your business.",
        features: [
          "AI model development",
          "Natural Language Processing",
          "Computer Vision solutions",
          "Predictive analytics",
          "Chatbot development",
        ],
        technologies: [
          "TensorFlow",
          "PyTorch",
          "OpenAI",
          "Hugging Face",
          "Python",
        ],
      },
      {
        title: "Mobile App Development",
        icon: "mobile",
        description:
          "Native and cross-platform mobile apps with Flutter and React Native for iOS and Android.",
        features: [
          "iOS & Android app development",
          "Cross-platform solutions",
          "App Store & Play Store deployment",
          "Mobile UI/UX design",
          "App maintenance & updates",
        ],
        technologies: [
          "Flutter",
          "React Native",
          "Swift",
          "Kotlin",
          "Firebase",
        ],
      },
    ];

    services.programs.push(...defaultPrograms);
    await services.save();

    return res.status(201).json({
      success: true,
      message: "Six default programs inserted successfully.",
      data: services.programs,
    });
  } catch (error) {
    console.error("Seed Services Programs:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to seed programs",
      error: error.message,
    });
  }
};

// =====================================
// TECHNOLOGIES
// =====================================

// GET ALL TECHNOLOGIES
export const getServicesTechnologies = async (req, res) => {
  try {
    const services = await getOrCreateServices();

    return res.status(200).json({
      success: true,
      message: "Technologies fetched successfully",
      data: services.technologies,
    });
  } catch (error) {
    console.error("Get Services Technologies:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch technologies",
      error: error.message,
    });
  }
};

// CREATE TECHNOLOGY
export const createServicesTechnology = async (req, res) => {
  try {
    const { name, icon } = req.body;

    if (typeof name !== "string" || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Technology name is required",
      });
    }

    if (typeof icon !== "string" || !icon.trim()) {
      return res.status(400).json({
        success: false,
        message: "Technology icon is required",
      });
    }

    const services = await getOrCreateServices();

    services.technologies.push({
      name: name.trim(),
      icon: icon.trim(),
    });

    await services.save();

    const newTechnology =
      services.technologies[services.technologies.length - 1];

    return res.status(201).json({
      success: true,
      message: "Technology created successfully",
      data: newTechnology,
    });
  } catch (error) {
    console.error("Create Services Technology:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create technology",
      error: error.message,
    });
  }
};

// UPDATE TECHNOLOGY
export const updateServicesTechnology = async (req, res) => {
  try {
    const services = await getOrCreateServices();
    const technology = services.technologies.id(req.params.id);

    if (!technology) {
      return res.status(404).json({
        success: false,
        message: "Technology not found",
      });
    }

    const { name, icon } = req.body;

    if (name !== undefined) {
      if (typeof name !== "string" || !name.trim()) {
        return res.status(400).json({
          success: false,
          message: "Technology name cannot be empty",
        });
      }

      technology.name = name.trim();
    }

    if (icon !== undefined) {
      if (typeof icon !== "string" || !icon.trim()) {
        return res.status(400).json({
          success: false,
          message: "Technology icon cannot be empty",
        });
      }

      technology.icon = icon.trim();
    }

    await services.save();

    return res.status(200).json({
      success: true,
      message: "Technology updated successfully",
      data: technology,
    });
  } catch (error) {
    console.error("Update Services Technology:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update technology",
      error: error.message,
    });
  }
};

// DELETE TECHNOLOGY
export const deleteServicesTechnology = async (req, res) => {
  try {
    const services = await getOrCreateServices();
    const technology = services.technologies.id(req.params.id);

    if (!technology) {
      return res.status(404).json({
        success: false,
        message: "Technology not found",
      });
    }

    services.technologies.pull(req.params.id);
    await services.save();

    return res.status(200).json({
      success: true,
      message: "Technology deleted successfully",
    });
  } catch (error) {
    console.error("Delete Services Technology:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete technology",
      error: error.message,
    });
  }
};

// SEED DEFAULT 23 TECHNOLOGIES
export const seedDefaultServicesTechnologies = async (req, res) => {
  try {
    const services = await getOrCreateServices();

    if (services.technologies.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Technologies already exist. No changes made.",
        data: services.technologies,
      });
    }

    const defaultTechnologies = [
      { name: "MySQL", icon: "mysql" },
      { name: "PostgreSQL", icon: "postgresql" },
      { name: "MongoDB", icon: "mongodb" },
      { name: "Vue.js", icon: "vuejs" },
      { name: "React", icon: "react" },
      { name: "Bootstrap", icon: "bootstrap" },
      { name: "Tailwind CSS", icon: "tailwindcss" },
      { name: "Svelte", icon: "svelte" },
      { name: "Angular", icon: "angular" },
      { name: "Firebase", icon: "firebase" },
      { name: "JavaScript", icon: "javascript" },
      { name: "TypeScript", icon: "typescript" },
      { name: "Next.js", icon: "nextjs" },
      { name: "Laravel", icon: "laravel" },
      { name: "GitLab", icon: "gitlab" },
      { name: "GitHub", icon: "github" },
      { name: "DigitalOcean", icon: "digitalocean" },
      { name: "Hostinger", icon: "hostinger" },
      { name: "Docker", icon: "docker" },
      { name: "Kubernetes", icon: "kubernetes" },
      { name: "PHP", icon: "php" },
      { name: "Node.js", icon: "nodejs" },
      { name: "Express.js", icon: "express" },
    ];

    services.technologies.push(...defaultTechnologies);
    await services.save();

    return res.status(201).json({
      success: true,
      message: "23 default technologies inserted successfully.",
      data: services.technologies,
    });
  } catch (error) {
    console.error("Seed Services Technologies:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to seed technologies",
      error: error.message,
    });
  }
};

// =====================================
// CLIENTS
// =====================================

// GET ALL CLIENTS
export const getServicesClients = async (req, res) => {
  try {
    const services = await getOrCreateServices();

    return res.status(200).json({
      success: true,
      message: "Clients fetched successfully",
      data: services.clients,
    });
  } catch (error) {
    console.error("Get Services Clients:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch clients",
      error: error.message,
    });
  }
};

// CREATE CLIENT
export const createServicesClient = async (req, res) => {
  let uploadedImage;

  try {
    const { name } = req.body;

    if (typeof name !== "string" || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Client name is required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Client logo is required",
      });
    }

    uploadedImage = await uploadImageToImageKit(req.file, "clients");

    const services = await getOrCreateServices();

    services.clients.push({
      name: name.trim(),
      logo: uploadedImage.url,
      logoFileId: uploadedImage.fileId,
    });

    await services.save();

    return res.status(201).json({
      success: true,
      message: "Client created successfully",
      data: services.clients[services.clients.length - 1],
    });
  } catch (error) {
    if (uploadedImage?.fileId) {
      await deleteImageFromImageKit(uploadedImage.fileId);
    }

    console.error("Create Services Client:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create client",
      error: error.message,
    });
  }
};

// UPDATE CLIENT
export const updateServicesClient = async (req, res) => {
  let uploadedImage;

  try {
    const services = await getOrCreateServices();
    const client = services.clients.id(req.params.id);

    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found",
      });
    }

    const { name } = req.body;

    if (name !== undefined) {
      if (typeof name !== "string" || !name.trim()) {
        return res.status(400).json({
          success: false,
          message: "Client name cannot be empty",
        });
      }

      client.name = name.trim();
    }

    const oldFileId = client.logoFileId;

    if (req.file) {
      uploadedImage = await uploadImageToImageKit(req.file, "clients");

      client.logo = uploadedImage.url;
      client.logoFileId = uploadedImage.fileId;
    }

    await services.save();

    if (uploadedImage && oldFileId) {
      await deleteImageFromImageKit(oldFileId);
    }

    return res.status(200).json({
      success: true,
      message: "Client updated successfully",
      data: client,
    });
  } catch (error) {
    if (uploadedImage?.fileId) {
      await deleteImageFromImageKit(uploadedImage.fileId);
    }

    console.error("Update Services Client:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update client",
      error: error.message,
    });
  }
};

// DELETE CLIENT
export const deleteServicesClient = async (req, res) => {
  try {
    const services = await getOrCreateServices();
    const client = services.clients.id(req.params.id);

    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found",
      });
    }

    const fileId = client.logoFileId;

    services.clients.pull(req.params.id);
    await services.save();

    await deleteImageFromImageKit(fileId);

    return res.status(200).json({
      success: true,
      message: "Client deleted successfully",
    });
  } catch (error) {
    console.error("Delete Services Client:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete client",
      error: error.message,
    });
  }
};

// =====================================
// OUR VALUES
// =====================================

// MIGRATE ORIGINAL FOUR VALUES ONCE
export const seedDefaultServicesValues = async (req, res) => {
  try {
    const services = await getOrCreateServices();

    if (services.valuesSeeded === true || services.values.length > 0) {
      services.valuesSeeded = true;
      await services.save();

      return res.status(200).json({
        success: true,
        message: "Values have already been migrated.",
        data: services.values,
      });
    }

    const valuesFolder = path.join(process.cwd(), "uploads", "values");

    const defaultValues = [
      {
        title: "Ship & Iterate",
        description:
          "We move swiftly, refining our approach with every step to maintain a leading edge.",
        icon: "/uploads/values/ship-icon.svg",
      },
      {
        title: "Trusted Pair of Hands",
        description:
          "Dependable and steadfast, we are always there when it matters most.",
        icon: "/uploads/values/trusted-icon.svg",
      },
      {
        title: "Overdeliver on the Promise",
        description:
          "Exceeding expectations is our standard, going beyond what's assured.",
        icon: "/uploads/values/promise-icon.svg",
      },
      {
        title: "Clear is Kind",
        description:
          "Transparent, honest communication keeps everyone on the same page.",
        icon: "/uploads/values/clear-icon.svg",
      },
    ];

    for (const value of defaultValues) {
      const filename = path.basename(value.icon);
      await fs.access(path.join(valuesFolder, filename));
    }

    services.values.push(...defaultValues);
    services.valuesSeeded = true;

    await services.save();

    return res.status(201).json({
      success: true,
      message: "Four original values migrated successfully.",
      data: services.values,
    });
  } catch (error) {
    console.error("Seed Services Values:", error);

    return res.status(500).json({
      success: false,
      message:
        "Failed to migrate values. Check that all four SVG icons exist in uploads/values.",
      error: error.message,
    });
  }
};

// GET ALL VALUES
export const getServicesValues = async (req, res) => {
  try {
    const services = await getOrCreateServices();

    return res.status(200).json({
      success: true,
      message: "Values fetched successfully",
      data: services.values,
    });
  } catch (error) {
    console.error("Get Services Values:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch values",
      error: error.message,
    });
  }
};

// CREATE VALUE
export const createServicesValue = async (req, res) => {
  let uploadedImage;

  try {
    const { title, description } = req.body;

    if (typeof title !== "string" || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Value title is required",
      });
    }

    if (typeof description !== "string" || !description.trim()) {
      return res.status(400).json({
        success: false,
        message: "Value description is required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Value icon is required",
      });
    }

    uploadedImage = await uploadImageToImageKit(req.file, "values");

    const services = await getOrCreateServices();

    services.values.push({
      title: title.trim(),
      description: description.trim(),
      icon: uploadedImage.url,
      iconFileId: uploadedImage.fileId,
    });

    await services.save();

    return res.status(201).json({
      success: true,
      message: "Value created successfully",
      data: services.values[services.values.length - 1],
    });
  } catch (error) {
    if (uploadedImage?.fileId) {
      await deleteImageFromImageKit(uploadedImage.fileId);
    }

    console.error("Create Services Value:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create value",
      error: error.message,
    });
  }
};

// UPDATE VALUE
export const updateServicesValue = async (req, res) => {
  let uploadedImage;

  try {
    const services = await getOrCreateServices();
    const value = services.values.id(req.params.id);

    if (!value) {
      return res.status(404).json({
        success: false,
        message: "Value not found",
      });
    }

    const { title, description } = req.body;

    if (title !== undefined) {
      if (typeof title !== "string" || !title.trim()) {
        return res.status(400).json({
          success: false,
          message: "Value title cannot be empty",
        });
      }

      value.title = title.trim();
    }

    if (description !== undefined) {
      if (typeof description !== "string" || !description.trim()) {
        return res.status(400).json({
          success: false,
          message: "Value description cannot be empty",
        });
      }

      value.description = description.trim();
    }

    const oldFileId = value.iconFileId;

    if (req.file) {
      uploadedImage = await uploadImageToImageKit(req.file, "values");

      value.icon = uploadedImage.url;
      value.iconFileId = uploadedImage.fileId;
    }

    await services.save();

    if (uploadedImage && oldFileId) {
      await deleteImageFromImageKit(oldFileId);
    }

    return res.status(200).json({
      success: true,
      message: "Value updated successfully",
      data: value,
    });
  } catch (error) {
    if (uploadedImage?.fileId) {
      await deleteImageFromImageKit(uploadedImage.fileId);
    }

    console.error("Update Services Value:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update value",
      error: error.message,
    });
  }
};

// DELETE VALUE
export const deleteServicesValue = async (req, res) => {
  try {
    const services = await getOrCreateServices();
    const value = services.values.id(req.params.id);

    if (!value) {
      return res.status(404).json({
        success: false,
        message: "Value not found",
      });
    }

    const fileId = value.iconFileId;

    services.values.pull(req.params.id);
    await services.save();

    await deleteImageFromImageKit(fileId);

    return res.status(200).json({
      success: true,
      message: "Value deleted successfully",
    });
  } catch (error) {
    console.error("Delete Services Value:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete value",
      error: error.message,
    });
  }
};
