import React, { useEffect, useState } from "react";
import {
  Keyboard,
  Calculator,
  Palette,
  Globe,
  Monitor,
  Code,
  Database,
  FileText,
  Briefcase,
  ChartNoAxesCombined,
  Image as ImageIcon,
  Plus,
  Trash2,
  Save,
  RefreshCw,
  Eye,
  EyeOff,
  Upload,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";

// ==============================
// API CONFIGURATION
// ==============================

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const SERVER_URL = API_BASE.replace(/\/api\/?$/, "");

// ==============================
// ICON OPTIONS
// ==============================

const iconOptions = [
  { name: "Keyboard", icon: Keyboard },
  { name: "Calculator", icon: Calculator },
  { name: "Palette", icon: Palette },
  { name: "Globe", icon: Globe },
  { name: "Monitor", icon: Monitor },
  { name: "Code", icon: Code },
  { name: "Database", icon: Database },
  { name: "FileText", icon: FileText },
  { name: "Briefcase", icon: Briefcase },
  { name: "ChartNoAxesCombined", icon: ChartNoAxesCombined },
  { name: "Image", icon: ImageIcon },
];

// ==============================
// DEFAULT CONTENT
// ==============================

const defaultContent = {
  sectionLabel: "Topics",
  sectionHeading: "Topics we can teach",

  topics: [
    { title: "Typing and office skills", icon: "Keyboard" },
    { title: "Accounting and QuickBooks", icon: "Calculator" },
    { title: "Graphic design", icon: "Palette" },
    { title: "Websites and WordPress", icon: "Globe" },
  ],

  howItWorksLabel: "How it works",
  howItWorksHeading: "Three simple steps",

  steps: [
    "Tell us about your team and what they need to learn.",
    "We propose a plan, schedule and price.",
    "We deliver the training online or in person.",
  ],

  buttonText: "Request a training plan",
  buttonLink: "/contact",
  image: "",
  isVisible: true,
};

// ==============================
// IMAGE URL HANDLER
// ==============================

const getImageUrl = (image) => {
  if (!image) return "";

  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }

  return `${SERVER_URL}${image.startsWith("/") ? "" : "/"}${image}`;
};

// ==============================
// REUSABLE INPUT COMPONENT
// ==============================

function FormField({ label, value, onChange, placeholder, type = "text" }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-gray-700">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-[#009FF6] focus:ring-2 focus:ring-blue-100"
      />
    </div>
  );
}

// ==============================
// MAIN COMPONENT
// ==============================

export default function CorporateTrainingTopicsManagement() {
  const [content, setContent] = useState(defaultContent);

  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [visibilityLoading, setVisibilityLoading] = useState(false);

  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

  // ==============================
  // FETCH TOPICS
  // ==============================

  const fetchTopics = async () => {
    try {
      setLoading(true);
      setMessage({ type: "", text: "" });

      const response = await fetch(`${API_BASE}/corporate-training/topics`);

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to fetch Topics.");
      }

      setContent({
        ...defaultContent,
        ...(result.topics || {}),
        topics: Array.isArray(result.topics?.topics)
          ? result.topics.topics
          : defaultContent.topics,
        steps: Array.isArray(result.topics?.steps)
          ? result.topics.steps
          : defaultContent.steps,
      });

      setSelectedImage(null);
    } catch (error) {
      console.error("Fetch Corporate Training Topics Error:", error);

      setMessage({
        type: "error",
        text: error.message || "Failed to load Topics.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopics();
  }, []);

  // ==============================
  // IMAGE PREVIEW
  // ==============================

  useEffect(() => {
    if (!selectedImage) {
      setImagePreview("");
      return;
    }

    const objectUrl = URL.createObjectURL(selectedImage);
    setImagePreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedImage]);

  const currentImage = imagePreview || getImageUrl(content.image);

  // ==============================
  // HANDLE TEXT CHANGES
  // ==============================

  const handleChange = (field, value) => {
    setContent((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // ==============================
  // TOPIC MANAGEMENT
  // ==============================

  const handleTopicChange = (index, field, value) => {
    setContent((prev) => ({
      ...prev,
      topics: prev.topics.map((topic, i) =>
        i === index ? { ...topic, [field]: value } : topic,
      ),
    }));
  };

  const addTopic = () => {
    setContent((prev) => ({
      ...prev,
      topics: [
        ...prev.topics,
        {
          title: "",
          icon: "Globe",
        },
      ],
    }));
  };

  const removeTopic = (index) => {
    setContent((prev) => ({
      ...prev,
      topics: prev.topics.filter((_, i) => i !== index),
    }));
  };

  // ==============================
  // STEP MANAGEMENT
  // ==============================

  const handleStepChange = (index, value) => {
    setContent((prev) => ({
      ...prev,
      steps: prev.steps.map((step, i) => (i === index ? value : step)),
    }));
  };

  const addStep = () => {
    setContent((prev) => ({
      ...prev,
      steps: [...prev.steps, ""],
    }));
  };

  const removeStep = (index) => {
    setContent((prev) => ({
      ...prev,
      steps: prev.steps.filter((_, i) => i !== index),
    }));
  };

  // ==============================
  // HANDLE IMAGE UPLOAD
  // ==============================

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];

    if (!allowedTypes.includes(file.type)) {
      setMessage({
        type: "error",
        text: "Only JPG, PNG, WEBP, and GIF images are allowed.",
      });

      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage({
        type: "error",
        text: "Image size must be less than 5 MB.",
      });

      event.target.value = "";
      return;
    }

    setSelectedImage(file);
    setMessage({ type: "", text: "" });
  };

  // ==============================
  // SAVE TOPICS
  // ==============================

  const handleSave = async (event) => {
    event.preventDefault();

    const hasEmptyTopic = content.topics.some((topic) => !topic.title.trim());

    const hasEmptyStep = content.steps.some((step) => !step.trim());

    if (hasEmptyTopic) {
      setMessage({
        type: "error",
        text: "Please enter a title for every topic.",
      });
      return;
    }

    if (hasEmptyStep) {
      setMessage({
        type: "error",
        text: "Please complete every step.",
      });
      return;
    }

    try {
      setSaving(true);
      setMessage({ type: "", text: "" });

      const formData = new FormData();

      formData.append("sectionLabel", content.sectionLabel);
      formData.append("sectionHeading", content.sectionHeading);

      formData.append("topics", JSON.stringify(content.topics));

      formData.append("howItWorksLabel", content.howItWorksLabel);
      formData.append("howItWorksHeading", content.howItWorksHeading);

      formData.append("steps", JSON.stringify(content.steps));

      formData.append("buttonText", content.buttonText);
      formData.append("buttonLink", content.buttonLink);

      if (selectedImage) {
        formData.append("image", selectedImage);
      }

      const response = await fetch(`${API_BASE}/corporate-training/topics`, {
        method: "PUT",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to save Topics.");
      }

      setContent((prev) => ({
        ...prev,
        ...result.topics,
      }));

      setSelectedImage(null);

      setMessage({
        type: "success",
        text: result.message || "Topics updated successfully.",
      });
    } catch (error) {
      console.error("Save Corporate Training Topics Error:", error);

      setMessage({
        type: "error",
        text: error.message || "Failed to save Topics.",
      });
    } finally {
      setSaving(false);
    }
  };

  // ==============================
  // TOGGLE VISIBILITY
  // ==============================

  const handleVisibility = async () => {
    try {
      setVisibilityLoading(true);
      setMessage({ type: "", text: "" });

      const newVisibility = !content.isVisible;

      const response = await fetch(
        `${API_BASE}/corporate-training/topics/visibility`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            isVisible: newVisibility,
          }),
        },
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to update visibility.");
      }

      setContent((prev) => ({
        ...prev,
        isVisible: result.topics.isVisible,
      }));

      setMessage({
        type: "success",
        text: result.message || "Visibility updated successfully.",
      });
    } catch (error) {
      console.error("Topics Visibility Error:", error);

      setMessage({
        type: "error",
        text: error.message || "Failed to update visibility.",
      });
    } finally {
      setVisibilityLoading(false);
    }
  };

  // ==============================
  // LOADING SCREEN
  // ==============================

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex items-center gap-3 text-gray-500">
          <Loader2 className="animate-spin" size={24} />
          <span className="font-medium">Loading Topics...</span>
        </div>
      </div>
    );
  }

  // ==============================
  // MAIN UI
  // ==============================

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* PAGE HEADER */}
        <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-[#009FF6]">
              <Briefcase size={17} />
              Corporate Training
            </div>

            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Topics Management
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Manage training topics and the How It Works section.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="/corporate-training"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
            >
              <ExternalLink size={17} />
              Preview Page
            </a>

            <button
              type="button"
              onClick={fetchTopics}
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
            >
              <RefreshCw size={17} />
              Reload
            </button>
          </div>
        </div>

        {/* ALERT MESSAGE */}
        {message.text && (
          <div
            className={`mb-6 flex items-center gap-3 rounded-xl border p-4 text-sm font-medium ${
              message.type === "success"
                ? "border-green-200 bg-green-50 text-green-700"
                : "border-red-200 bg-red-50 text-red-700"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle size={19} />
            ) : (
              <AlertCircle size={19} />
            )}

            {message.text}
          </div>
        )}

        {/* VISIBILITY CONTROL */}
        <div className="mb-7 flex flex-col justify-between gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center">
          <div>
            <h2 className="font-bold text-gray-900">
              Topics Section Visibility
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Control whether this section appears on your public website.
            </p>
          </div>

          <button
            type="button"
            onClick={handleVisibility}
            disabled={visibilityLoading}
            className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${
              content.isVisible
                ? "bg-green-50 text-green-700 hover:bg-green-100"
                : "bg-red-50 text-red-700 hover:bg-red-100"
            }`}
          >
            {visibilityLoading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : content.isVisible ? (
              <Eye size={18} />
            ) : (
              <EyeOff size={18} />
            )}

            {content.isVisible ? "Section Visible" : "Section Hidden"}
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-7">
          {/* ================================= */}
          {/* TOPICS SECTION SETTINGS */}
          {/* ================================= */}

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-6 border-b border-gray-100 pb-5">
              <h2 className="text-lg font-bold text-gray-900">
                Training Topics Header
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Edit the heading displayed above the topic cards.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <FormField
                label="Section Label"
                value={content.sectionLabel}
                onChange={(e) => handleChange("sectionLabel", e.target.value)}
                placeholder="Topics"
              />

              <FormField
                label="Section Heading"
                value={content.sectionHeading}
                onChange={(e) => handleChange("sectionHeading", e.target.value)}
                placeholder="Topics we can teach"
              />
            </div>
          </div>

          {/* ================================= */}
          {/* TOPIC CARDS MANAGEMENT */}
          {/* ================================= */}

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-6 flex flex-col justify-between gap-4 border-b border-gray-100 pb-5 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Training Topic Cards
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Add, edit, remove and select icons for your topics.
                </p>
              </div>

              <button
                type="button"
                onClick={addTopic}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-50 px-4 py-3 text-sm font-semibold text-[#009FF6] transition hover:bg-blue-100"
              >
                <Plus size={18} />
                Add Topic
              </button>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {content.topics.map((topic, index) => {
                const selectedIcon =
                  iconOptions.find((item) => item.name === topic.icon)?.icon ||
                  Globe;

                const PreviewIcon = selectedIcon;

                return (
                  <div
                    key={index}
                    className="rounded-2xl border border-gray-200 bg-gray-50 p-5"
                  >
                    <div className="mb-5 flex items-center justify-between">
                      <h3 className="font-bold text-gray-800">
                        Topic {index + 1}
                      </h3>

                      <button
                        type="button"
                        onClick={() => removeTopic(index)}
                        className="rounded-lg p-2 text-red-500 transition hover:bg-red-50"
                        title="Remove topic"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    {/* ICON PREVIEW */}
                    <div className="mb-5 flex items-center gap-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-50 text-[#009FF6]">
                        <PreviewIcon size={27} />
                      </div>

                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                          Icon Preview
                        </p>

                        <p className="mt-1 font-semibold text-gray-700">
                          {topic.icon}
                        </p>
                      </div>
                    </div>

                    {/* TOPIC TITLE */}
                    <div className="mb-4">
                      <label className="mb-2 block text-sm font-semibold text-gray-700">
                        Topic Title
                      </label>

                      <input
                        type="text"
                        value={topic.title}
                        onChange={(e) =>
                          handleTopicChange(index, "title", e.target.value)
                        }
                        placeholder="Enter topic title"
                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#009FF6] focus:ring-2 focus:ring-blue-100"
                      />
                    </div>

                    {/* ICON SELECT */}
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-gray-700">
                        Select Icon
                      </label>

                      <select
                        value={topic.icon}
                        onChange={(e) =>
                          handleTopicChange(index, "icon", e.target.value)
                        }
                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#009FF6] focus:ring-2 focus:ring-blue-100"
                      >
                        {iconOptions.map((item) => (
                          <option key={item.name} value={item.name}>
                            {item.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                );
              })}
            </div>

            {content.topics.length === 0 && (
              <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center">
                <p className="text-sm text-gray-500">
                  No topics added yet. Click Add Topic to create one.
                </p>
              </div>
            )}
          </div>

          {/* ================================= */}
          {/* HOW IT WORKS SETTINGS */}
          {/* ================================= */}

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-6 border-b border-gray-100 pb-5">
              <h2 className="text-lg font-bold text-gray-900">
                How It Works Section
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Manage the heading and training process steps.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <FormField
                label="Section Label"
                value={content.howItWorksLabel}
                onChange={(e) =>
                  handleChange("howItWorksLabel", e.target.value)
                }
                placeholder="How it works"
              />

              <FormField
                label="Section Heading"
                value={content.howItWorksHeading}
                onChange={(e) =>
                  handleChange("howItWorksHeading", e.target.value)
                }
                placeholder="Three simple steps"
              />
            </div>

            {/* STEPS */}
            <div className="mt-7">
              <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <h3 className="font-bold text-gray-800">Training Steps</h3>

                <button
                  type="button"
                  onClick={addStep}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-50 px-4 py-2.5 text-sm font-semibold text-[#009FF6] transition hover:bg-blue-100"
                >
                  <Plus size={17} />
                  Add Step
                </button>
              </div>

              <div className="space-y-4">
                {content.steps.map((step, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 font-bold text-[#009FF6]">
                      {index + 1}
                    </div>

                    <textarea
                      rows={2}
                      value={step}
                      onChange={(e) => handleStepChange(index, e.target.value)}
                      placeholder={`Enter step ${index + 1}`}
                      className="min-h-10 flex-1 resize-y rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm leading-6 outline-none transition focus:border-[#009FF6] focus:ring-2 focus:ring-blue-100"
                    />

                    <button
                      type="button"
                      onClick={() => removeStep(index)}
                      className="rounded-lg p-2 text-red-500 transition hover:bg-red-50"
                      title="Remove step"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ================================= */}
          {/* BUTTON SETTINGS */}
          {/* ================================= */}

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-6 border-b border-gray-100 pb-5">
              <h2 className="text-lg font-bold text-gray-900">
                Call To Action Button
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Customize the button displayed in How It Works.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <FormField
                label="Button Text"
                value={content.buttonText}
                onChange={(e) => handleChange("buttonText", e.target.value)}
                placeholder="Request a training plan"
              />

              <FormField
                label="Button Link"
                value={content.buttonLink}
                onChange={(e) => handleChange("buttonLink", e.target.value)}
                placeholder="/contact"
              />
            </div>
          </div>

          {/* ================================= */}
          {/* IMAGE MANAGEMENT */}
          {/* ================================= */}

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-6 border-b border-gray-100 pb-5">
              <h2 className="text-lg font-bold text-gray-900">
                How It Works Image
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Upload the image displayed on the right side of this section.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* IMAGE PREVIEW */}
              <div className="overflow-hidden rounded-2xl border border-gray-200 bg-gray-50">
                {currentImage ? (
                  <img
                    src={currentImage}
                    alt="Corporate training preview"
                    className="h-64 w-full object-cover"
                  />
                ) : (
                  <div className="flex h-64 flex-col items-center justify-center text-gray-400">
                    <ImageIcon size={42} />
                    <p className="mt-3 text-sm">No image uploaded</p>
                  </div>
                )}
              </div>

              {/* UPLOAD */}
              <div className="flex flex-col justify-center">
                <label className="mb-3 block text-sm font-semibold text-gray-700">
                  Upload Image
                </label>

                <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 p-8 text-center transition hover:border-[#009FF6] hover:bg-blue-50">
                  <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-xl bg-blue-100 text-[#009FF6]">
                    <Upload size={25} />
                  </div>

                  <span className="font-semibold text-gray-800">
                    Click to upload image
                  </span>

                  <span className="mt-2 text-xs text-gray-500">
                    JPG, PNG, WEBP or GIF · Maximum 5 MB
                  </span>

                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>

                {selectedImage && (
                  <div className="mt-4 flex items-center justify-between gap-3 rounded-xl bg-blue-50 p-3">
                    <p className="truncate text-sm font-medium text-blue-700">
                      {selectedImage.name}
                    </p>

                    <button
                      type="button"
                      onClick={() => setSelectedImage(null)}
                      className="shrink-0 text-sm font-semibold text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ================================= */}
          {/* SAVE BUTTON */}
          {/* ================================= */}

          <div className="flex flex-col justify-between gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:p-6">
            <div>
              <h3 className="font-bold text-gray-900">Save Topics Changes</h3>

              <p className="mt-1 text-sm text-gray-500">
                Your changes will appear on the public Corporate Training page.
              </p>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#009FF6] px-7 py-3.5 font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:-translate-y-0.5 hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <>
                  <Loader2 size={19} className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={19} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
