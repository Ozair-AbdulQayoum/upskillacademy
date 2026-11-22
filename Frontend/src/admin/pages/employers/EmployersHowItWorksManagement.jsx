import React, { useCallback, useEffect, useRef, useState } from "react";

import {
  Search,
  Send,
  CalendarCheck,
  BriefcaseBusiness,
  FolderCheck,
  BadgeCheck,
  Eye,
  EyeOff,
  Save,
  RefreshCw,
  Upload,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  X,
} from "lucide-react";

// ==================================================
// API CONFIGURATION
// ==================================================

const API_BASE = (
  import.meta.env.VITE_API_URL || "http://localhost:5000/api"
).replace(/\/+$/, "");

const SERVER_BASE = API_BASE.replace(/\/api\/?$/, "");

// ==================================================
// DEFAULT DATA
// ==================================================

const defaultData = {
  label: "How it works",
  heading: "From first look to first interview in three steps",

  steps: [
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

  noFees: {
    title: "No fees for companies. Hiring through Upskill is free.",
    description:
      "No fees and no account. You pick the student, we arrange the rest.",
    icon: "BriefcaseBusiness",
  },

  features: [
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

  image: "",
  isVisible: true,
};

// ==================================================
// ICON OPTIONS
// ==================================================

const stepIconOptions = {
  Search,
  Send,
  CalendarCheck,
};

const featureIconOptions = {
  FolderCheck,
  BadgeCheck,
};

const noFeesIconOptions = {
  BriefcaseBusiness,
};

// ==================================================
// API RESPONSE HANDLER
// Supports different controller response structures
// ==================================================

const extractSection = (response) => {
  if (!response) return null;

  const candidates = [
    response.howItWorks,
    response.data?.howItWorks,
    response.data,
    response.result?.howItWorks,
    response.result,
  ];

  return (
    candidates.find(
      (item) =>
        item &&
        typeof item === "object" &&
        !Array.isArray(item) &&
        ("steps" in item ||
          "heading" in item ||
          "noFees" in item ||
          "isVisible" in item),
    ) || null
  );
};

// ==================================================
// API REQUEST HELPER
// ==================================================

const apiRequest = async (url, options = {}) => {
  const response = await fetch(url, options);

  const result = await response.json().catch(() => ({}));

  if (!response.ok || result.success === false) {
    throw new Error(result.message || `Request failed (${response.status})`);
  }

  return result;
};

// ==================================================
// NORMALIZE DATA
// ==================================================

const normalizeData = (data = {}) => ({
  ...defaultData,
  ...data,

  steps: defaultData.steps.map((defaultStep, index) => ({
    ...defaultStep,
    ...(data.steps?.[index] || {}),
  })),

  noFees: {
    ...defaultData.noFees,
    ...(data.noFees || {}),
  },

  features: defaultData.features.map((defaultFeature, index) => ({
    ...defaultFeature,
    ...(data.features?.[index] || {}),
  })),

  image: data.image || "",
  isVisible: data.isVisible ?? true,
});

// ==================================================
// IMAGE URL
// ==================================================

const getImageUrl = (image) => {
  if (!image) return "";

  if (
    image.startsWith("http://") ||
    image.startsWith("https://") ||
    image.startsWith("blob:")
  ) {
    return image;
  }

  return `${SERVER_BASE}/${image.replace(/^\/+/, "")}`;
};

// ==================================================
// REUSABLE FORM FIELD
// ==================================================

function FormField({
  label,
  value,
  onChange,
  placeholder,
  multiline = false,
  rows = 3,
}) {
  const inputClass =
    "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-50";

  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-gray-700">
        {label}
      </label>

      {multiline ? (
        <textarea
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          className={`${inputClass} resize-y`}
        />
      ) : (
        <input
          type="text"
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={inputClass}
        />
      )}
    </div>
  );
}

// ==================================================
// ICON SELECT
// ==================================================

function IconSelect({ label, value, options, onChange }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-gray-700">
        {label}
      </label>

      <select
        value={value || Object.keys(options)[0]}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
      >
        {Object.keys(options).map((iconName) => (
          <option key={iconName} value={iconName}>
            {iconName}
          </option>
        ))}
      </select>
    </div>
  );
}

// ==================================================
// MAIN COMPONENT
// ==================================================

export default function EmployersHowItWorksManagement() {
  const [formData, setFormData] = useState(() => normalizeData(defaultData));

  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [visibilityLoading, setVisibilityLoading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fileInputRef = useRef(null);

  // ==================================================
  // FETCH DATA
  // ==================================================

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await apiRequest(`${API_BASE}/employers/how-it-works`);

      const section = extractSection(response);

      if (!section) {
        throw new Error("How It Works data was not found in the API response.");
      }

      setFormData(normalizeData(section));
      setSelectedImage(null);
      setImagePreview("");

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      console.error("FETCH ERROR:", err);
      setError(err.message || "Unable to load How It Works data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ==================================================
  // IMAGE PREVIEW
  // ==================================================

  useEffect(() => {
    if (!selectedImage) {
      setImagePreview("");
      return;
    }

    const objectUrl = URL.createObjectURL(selectedImage);

    setImagePreview(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [selectedImage]);

  // ==================================================
  // UPDATE FIELDS
  // ==================================================

  const updateField = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const updateStep = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      steps: prev.steps.map((step, i) =>
        i === index ? { ...step, [field]: value } : step,
      ),
    }));
  };

  const updateNoFees = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      noFees: {
        ...prev.noFees,
        [field]: value,
      },
    }));
  };

  const updateFeature = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.map((feature, i) =>
        i === index ? { ...feature, [field]: value } : feature,
      ),
    }));
  };

  // ==================================================
  // IMAGE UPLOAD
  // ==================================================

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];

    if (!allowedTypes.includes(file.type)) {
      setError("Only JPG, PNG, WEBP and GIF images are allowed.");
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must not exceed 5MB.");
      e.target.value = "";
      return;
    }

    setError("");
    setSuccess("");
    setSelectedImage(file);
  };

  const cancelImage = () => {
    setSelectedImage(null);
    setImagePreview("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // ==================================================
  // SAVE DATA
  // ==================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const form = new FormData();

      form.append("label", formData.label);
      form.append("heading", formData.heading);

      form.append("steps", JSON.stringify(formData.steps));
      form.append("noFees", JSON.stringify(formData.noFees));
      form.append("features", JSON.stringify(formData.features));

      if (selectedImage) {
        form.append("image", selectedImage);
      }

      const response = await apiRequest(`${API_BASE}/employers/how-it-works`, {
        method: "PUT",
        body: form,
      });

      const updatedSection = extractSection(response);

      if (updatedSection) {
        setFormData(normalizeData(updatedSection));
      }

      setSelectedImage(null);
      setImagePreview("");

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      setSuccess("How It Works section updated successfully.");
    } catch (err) {
      console.error("SAVE ERROR:", err);
      setError(err.message || "Unable to save changes.");
    } finally {
      setSaving(false);
    }
  };

  // ==================================================
  // VISIBILITY TOGGLE
  // ==================================================

  const handleVisibility = async () => {
    setVisibilityLoading(true);
    setError("");
    setSuccess("");

    try {
      const newVisibility = !formData.isVisible;

      const response = await apiRequest(
        `${API_BASE}/employers/how-it-works/visibility`,
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

      const updatedSection = extractSection(response);

      setFormData((prev) => ({
        ...prev,
        isVisible: updatedSection?.isVisible ?? newVisibility,
      }));

      setSuccess(
        newVisibility
          ? "Section published successfully."
          : "Section hidden successfully.",
      );
    } catch (err) {
      console.error("VISIBILITY ERROR:", err);
      setError(err.message || "Unable to update visibility.");
    } finally {
      setVisibilityLoading(false);
    }
  };

  // ==================================================
  // LOADING SCREEN
  // ==================================================

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <RefreshCw
            size={32}
            className="mx-auto animate-spin text-[#009FF6]"
          />
          <p className="mt-4 text-sm font-medium text-gray-500">
            Loading How It Works...
          </p>
        </div>
      </div>
    );
  }

  // ==================================================
  // MAIN UI
  // ==================================================

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* HEADER */}

        <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#009FF6]">
              <BriefcaseBusiness size={18} />
              Employers Management
            </div>

            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              How It Works Section
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Manage the steps, information cards and image displayed on your
              Employers page.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={fetchData}
              disabled={saving || visibilityLoading}
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-100 disabled:opacity-50"
            >
              <RefreshCw size={17} />
              Refresh
            </button>

            <button
              type="button"
              onClick={handleVisibility}
              disabled={visibilityLoading || saving}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold disabled:opacity-50 ${
                formData.isVisible
                  ? "bg-green-50 text-green-700 hover:bg-green-100"
                  : "bg-red-50 text-red-700 hover:bg-red-100"
              }`}
            >
              {formData.isVisible ? <Eye size={17} /> : <EyeOff size={17} />}

              {visibilityLoading
                ? "Updating..."
                : formData.isVisible
                  ? "Published"
                  : "Hidden"}
            </button>
          </div>
        </div>

        {/* SUCCESS MESSAGE */}

        {success && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm font-medium text-green-700">
            <CheckCircle size={19} />
            {success}
          </div>
        )}

        {/* ERROR MESSAGE */}

        {error && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
            <AlertCircle size={19} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 items-start gap-8 xl:grid-cols-3">
            {/* LEFT SIDE */}

            <div className="space-y-6 xl:col-span-2">
              {/* SECTION HEADER */}

              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
                <h2 className="mb-6 text-lg font-bold text-gray-900">
                  Section Header
                </h2>

                <div className="space-y-5">
                  <FormField
                    label="Section Label"
                    value={formData.label}
                    onChange={(value) => updateField("label", value)}
                  />

                  <FormField
                    label="Section Heading"
                    value={formData.heading}
                    onChange={(value) => updateField("heading", value)}
                    multiline
                    rows={3}
                  />
                </div>
              </div>

              {/* THREE STEPS */}

              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
                <h2 className="mb-2 text-lg font-bold text-gray-900">
                  Three Steps
                </h2>

                <p className="mb-6 text-sm text-gray-500">
                  Manage the three steps displayed on the Employers page.
                </p>

                <div className="space-y-6">
                  {formData.steps.map((step, index) => (
                    <div
                      key={index}
                      className="rounded-xl border border-gray-200 bg-gray-50 p-5"
                    >
                      <div className="mb-5 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 font-bold text-[#009FF6]">
                          {step.number}
                        </div>

                        <h3 className="font-bold text-gray-800">
                          Step {index + 1}
                        </h3>
                      </div>

                      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                        <FormField
                          label="Step Number"
                          value={step.number}
                          onChange={(value) =>
                            updateStep(index, "number", value)
                          }
                        />

                        <IconSelect
                          label="Step Icon"
                          value={step.icon}
                          options={stepIconOptions}
                          onChange={(value) => updateStep(index, "icon", value)}
                        />

                        <div className="sm:col-span-2">
                          <FormField
                            label="Step Title"
                            value={step.title}
                            onChange={(value) =>
                              updateStep(index, "title", value)
                            }
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <FormField
                            label="Step Description"
                            value={step.description}
                            onChange={(value) =>
                              updateStep(index, "description", value)
                            }
                            multiline
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* NO FEES CARD */}

              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
                <h2 className="mb-6 text-lg font-bold text-gray-900">
                  No Fees Card
                </h2>

                <div className="space-y-5">
                  <FormField
                    label="Card Title"
                    value={formData.noFees.title}
                    onChange={(value) => updateNoFees("title", value)}
                    multiline
                  />

                  <FormField
                    label="Card Description"
                    value={formData.noFees.description}
                    onChange={(value) => updateNoFees("description", value)}
                    multiline
                  />

                  <IconSelect
                    label="Card Icon"
                    value={formData.noFees.icon}
                    options={noFeesIconOptions}
                    onChange={(value) => updateNoFees("icon", value)}
                  />
                </div>
              </div>

              {/* FEATURE CARDS */}

              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
                <h2 className="mb-6 text-lg font-bold text-gray-900">
                  Feature Cards
                </h2>

                <div className="space-y-6">
                  {formData.features.map((feature, index) => (
                    <div
                      key={index}
                      className="rounded-xl border border-gray-200 bg-gray-50 p-5"
                    >
                      <h3 className="mb-5 font-bold text-gray-800">
                        Feature {index + 1}
                      </h3>

                      <div className="space-y-5">
                        <FormField
                          label="Feature Title"
                          value={feature.title}
                          onChange={(value) =>
                            updateFeature(index, "title", value)
                          }
                        />

                        <FormField
                          label="Feature Description"
                          value={feature.description}
                          onChange={(value) =>
                            updateFeature(index, "description", value)
                          }
                          multiline
                        />

                        <IconSelect
                          label="Feature Icon"
                          value={feature.icon}
                          options={featureIconOptions}
                          onChange={(value) =>
                            updateFeature(index, "icon", value)
                          }
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION IMAGE */}

              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
                <h2 className="mb-2 text-lg font-bold text-gray-900">
                  Section Image
                </h2>

                <p className="mb-6 text-sm text-gray-500">
                  Upload an image for the public Employers page.
                </p>

                <label
                  htmlFor="how-it-works-image"
                  className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 p-8 text-center transition hover:border-[#009FF6] hover:bg-blue-50"
                >
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-blue-100 text-[#009FF6]">
                    <Upload size={26} />
                  </div>

                  <span className="font-semibold text-gray-800">
                    Click to upload an image
                  </span>

                  <span className="mt-2 text-xs text-gray-500">
                    JPG, PNG, WEBP or GIF · Maximum 5MB
                  </span>

                  <input
                    ref={fileInputRef}
                    id="how-it-works-image"
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>

                {(imagePreview || formData.image) && (
                  <div className="mt-5 overflow-hidden rounded-xl border border-gray-200">
                    <div className="flex items-center justify-between bg-gray-50 px-4 py-3">
                      <span className="text-sm font-semibold text-gray-700">
                        Image Preview
                      </span>

                      {selectedImage && (
                        <button
                          type="button"
                          onClick={cancelImage}
                          className="flex items-center gap-1 text-xs font-semibold text-red-600"
                        >
                          <X size={15} />
                          Cancel upload
                        </button>
                      )}
                    </div>

                    <img
                      src={imagePreview || getImageUrl(formData.image)}
                      alt="How It Works"
                      className="h-64 w-full object-cover"
                    />
                  </div>
                )}
              </div>

              {/* SAVE BUTTON */}

              <div className="flex flex-col justify-between gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:p-6">
                <div>
                  <h3 className="font-bold text-gray-900">Save your changes</h3>

                  <p className="mt-1 text-sm text-gray-500">
                    Save your updates to the database.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={saving || visibilityLoading}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#009FF6] px-7 py-3.5 font-semibold text-white shadow-lg transition hover:bg-blue-600 disabled:opacity-50"
                >
                  {saving ? (
                    <RefreshCw size={18} className="animate-spin" />
                  ) : (
                    <Save size={18} />
                  )}

                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>

            {/* RIGHT SIDE - LIVE PREVIEW */}

            <div className="xl:sticky xl:top-6">
              <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-gray-200 p-5">
                  <div>
                    <h2 className="font-bold text-gray-900">Live Preview</h2>

                    <p className="mt-1 text-xs text-gray-500">
                      Preview of your current edits
                    </p>
                  </div>

                  <Eye size={19} className="text-[#009FF6]" />
                </div>

                <div className="space-y-5 p-5">
                  {/* HEADER */}

                  <div className="text-center">
                    <span className="inline-flex rounded-full bg-blue-50 px-4 py-2 text-xs font-semibold text-[#009FF6]">
                      {formData.label}
                    </span>

                    <h3 className="mt-4 text-xl font-bold leading-tight text-gray-900">
                      {formData.heading}
                    </h3>
                  </div>

                  {/* STEPS */}

                  <div className="space-y-3">
                    {formData.steps.map((step, index) => {
                      const Icon = stepIconOptions[step.icon] || Search;

                      return (
                        <div
                          key={index}
                          className="rounded-xl border border-gray-200 p-4"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-2xl font-bold text-blue-100">
                              {step.number}
                            </span>

                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-[#009FF6]">
                              <Icon size={21} />
                            </div>
                          </div>

                          <h4 className="mt-3 font-bold text-gray-900">
                            {step.title}
                          </h4>

                          <p className="mt-2 text-xs leading-6 text-gray-500">
                            {step.description}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  {/* NO FEES */}

                  <div className="rounded-xl bg-[#011340] p-5 text-white">
                    {(() => {
                      const Icon =
                        noFeesIconOptions[formData.noFees.icon] ||
                        BriefcaseBusiness;

                      return (
                        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-white/10 text-[#009FF6]">
                          <Icon size={23} />
                        </div>
                      );
                    })()}

                    <h4 className="font-bold leading-6">
                      {formData.noFees.title}
                    </h4>

                    <p className="mt-3 text-xs leading-6 text-blue-100/80">
                      {formData.noFees.description}
                    </p>
                  </div>

                  {/* FEATURES */}

                  <div className="space-y-3">
                    {formData.features.map((feature, index) => {
                      const Icon =
                        featureIconOptions[feature.icon] ||
                        (index === 0 ? FolderCheck : BadgeCheck);

                      return (
                        <div
                          key={index}
                          className="rounded-xl border border-gray-200 p-4"
                        >
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-[#009FF6]">
                            <Icon size={21} />
                          </div>

                          <h4 className="mt-3 font-bold text-gray-900">
                            {feature.title}
                          </h4>

                          <p className="mt-2 text-xs leading-6 text-gray-500">
                            {feature.description}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  {/* IMAGE */}

                  {(imagePreview || formData.image) && (
                    <img
                      src={imagePreview || getImageUrl(formData.image)}
                      alt="Section preview"
                      className="h-40 w-full rounded-xl object-cover"
                    />
                  )}

                  {/* VISIBILITY STATUS */}

                  <div
                    className={`flex items-center gap-2 rounded-xl p-3 text-xs font-semibold ${
                      formData.isVisible
                        ? "bg-green-50 text-green-700"
                        : "bg-red-50 text-red-700"
                    }`}
                  >
                    {formData.isVisible ? (
                      <Eye size={16} />
                    ) : (
                      <EyeOff size={16} />
                    )}

                    {formData.isVisible
                      ? "Visible publicly"
                      : "Hidden publicly"}
                  </div>
                </div>
              </div>

              <a
                href="/employers"
                target="_blank"
                rel="noreferrer"
                className="mt-4 flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white p-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
              >
                View Employers Page
                <ExternalLink size={16} />
              </a>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
