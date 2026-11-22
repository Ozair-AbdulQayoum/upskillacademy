import React, { useEffect, useState } from "react";
import {
  Building2,
  Save,
  Eye,
  EyeOff,
  Upload,
  Image as ImageIcon,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  ExternalLink,
} from "lucide-react";

// ==============================
// API CONFIGURATION
// ==============================

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const SERVER_URL = API_BASE.replace(/\/api\/?$/, "");

// ==============================
// DEFAULT HERO DATA
// ==============================

const defaultHero = {
  label: "For teams",
  heading: "Corporate training",
  highlightedHeading: "Skills your staff can use.",
  description:
    "Practical digital skills training for your staff, planned around your work.",
  buttonText: "Request a training plan",
  buttonLink: "/contact",
  image1: "",
  image2: "",
  image3: "",
  isVisible: true,
};

// ==============================
// COMPONENT
// ==============================

export default function CorporateTrainingHeroManagement() {
  const [hero, setHero] = useState(defaultHero);

  const [images, setImages] = useState({
    image1: null,
    image2: null,
    image3: null,
  });

  const [previews, setPreviews] = useState({
    image1: "",
    image2: "",
    image3: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [visibilityLoading, setVisibilityLoading] = useState(false);

  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

  // ==============================
  // IMAGE URL
  // ==============================

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "";

    if (
      imagePath.startsWith("http://") ||
      imagePath.startsWith("https://") ||
      imagePath.startsWith("blob:")
    ) {
      return imagePath;
    }

    return `${SERVER_URL}${imagePath.startsWith("/") ? "" : "/"}${imagePath}`;
  };

  // ==============================
  // FETCH HERO DATA
  // ==============================

  const fetchHero = async () => {
    try {
      setLoading(true);
      setMessage({ type: "", text: "" });

      const response = await fetch(`${API_BASE}/corporate-training/hero`);

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to load Corporate Training Hero.",
        );
      }

      const data = result.hero || result.data?.hero || {};

      setHero({
        ...defaultHero,
        ...data,
      });

      setPreviews({
        image1: getImageUrl(data.image1),
        image2: getImageUrl(data.image2),
        image3: getImageUrl(data.image3),
      });
    } catch (error) {
      console.error("Fetch Hero Error:", error);

      setMessage({
        type: "error",
        text: error.message || "Unable to load Hero content.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHero();
  }, []);

  // ==============================
  // HANDLE TEXT INPUTS
  // ==============================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setHero((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==============================
  // HANDLE IMAGE UPLOAD
  // ==============================

  const handleImageChange = (e, field) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];

    if (!allowedTypes.includes(file.type)) {
      setMessage({
        type: "error",
        text: "Please upload a JPG, PNG, WEBP, or GIF image.",
      });
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage({
        type: "error",
        text: "Image size must be less than 5MB.",
      });
      e.target.value = "";
      return;
    }

    const previewUrl = URL.createObjectURL(file);

    setImages((prev) => ({
      ...prev,
      [field]: file,
    }));

    setPreviews((prev) => {
      if (prev[field]?.startsWith("blob:")) {
        URL.revokeObjectURL(prev[field]);
      }

      return {
        ...prev,
        [field]: previewUrl,
      };
    });

    setMessage({ type: "", text: "" });
  };

  // ==============================
  // SAVE HERO
  // ==============================

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setMessage({ type: "", text: "" });

      const formData = new FormData();

      formData.append("label", hero.label);
      formData.append("heading", hero.heading);
      formData.append("highlightedHeading", hero.highlightedHeading);
      formData.append("description", hero.description);
      formData.append("buttonText", hero.buttonText);
      formData.append("buttonLink", hero.buttonLink);

      if (images.image1) {
        formData.append("image1", images.image1);
      }

      if (images.image2) {
        formData.append("image2", images.image2);
      }

      if (images.image3) {
        formData.append("image3", images.image3);
      }

      const response = await fetch(`${API_BASE}/corporate-training/hero`, {
        method: "PUT",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to update Hero section.");
      }

      const updatedHero = result.hero || hero;

      setHero({
        ...defaultHero,
        ...updatedHero,
      });

      setPreviews({
        image1: getImageUrl(updatedHero.image1),
        image2: getImageUrl(updatedHero.image2),
        image3: getImageUrl(updatedHero.image3),
      });

      setImages({
        image1: null,
        image2: null,
        image3: null,
      });

      setMessage({
        type: "success",
        text: result.message || "Hero section updated successfully!",
      });
    } catch (error) {
      console.error("Save Hero Error:", error);

      setMessage({
        type: "error",
        text: error.message || "Something went wrong while saving.",
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

      const newVisibility = !hero.isVisible;

      const response = await fetch(
        `${API_BASE}/corporate-training/hero/visibility`,
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
        throw new Error(result.message || "Failed to update Hero visibility.");
      }

      setHero((prev) => ({
        ...prev,
        isVisible: newVisibility,
      }));

      setMessage({
        type: "success",
        text: newVisibility
          ? "Hero section is now visible."
          : "Hero section has been hidden.",
      });
    } catch (error) {
      console.error("Visibility Error:", error);

      setMessage({
        type: "error",
        text: error.message || "Unable to change visibility.",
      });
    } finally {
      setVisibilityLoading(false);
    }
  };

  // ==============================
  // IMAGE UPLOAD FIELD
  // ==============================

  const ImageUploadField = ({ field, title }) => (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
        <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
        <ImageIcon size={17} className="text-gray-400" />
      </div>

      <div className="p-4">
        <div className="relative flex h-48 items-center justify-center overflow-hidden rounded-lg bg-gray-50">
          {previews[field] ? (
            <img
              src={previews[field]}
              alt={title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center gap-2 text-gray-400">
              <ImageIcon size={35} />
              <span className="text-sm">No image selected</span>
            </div>
          )}
        </div>

        <label className="mt-4 flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:border-[#009FF6] hover:text-[#009FF6]">
          <Upload size={17} />
          Upload Image
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            onChange={(e) => handleImageChange(e, field)}
          />
        </label>

        <p className="mt-2 text-xs text-gray-400">
          JPG, PNG, WEBP or GIF. Maximum 5MB.
        </p>
      </div>
    </div>
  );

  // ==============================
  // LOADING STATE
  // ==============================

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex items-center gap-3 text-gray-500">
          <RefreshCw className="animate-spin" size={22} />
          Loading Corporate Training Hero...
        </div>
      </div>
    );
  }

  // ==============================
  // MAIN UI
  // ==============================

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* HEADER */}

        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2 text-sm font-medium text-[#009FF6]">
              <Building2 size={18} />
              Corporate Training
            </div>

            <h1 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl">
              Hero Management
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Manage your Corporate Training page hero section.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleVisibility}
              disabled={visibilityLoading}
              className={`inline-flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold transition disabled:opacity-60 ${
                hero.isVisible
                  ? "bg-green-50 text-green-700 hover:bg-green-100"
                  : "bg-red-50 text-red-600 hover:bg-red-100"
              }`}
            >
              {visibilityLoading ? (
                <RefreshCw size={17} className="animate-spin" />
              ) : hero.isVisible ? (
                <Eye size={17} />
              ) : (
                <EyeOff size={17} />
              )}

              {hero.isVisible ? "Visible" : "Hidden"}
            </button>

            <a
              href="/corporate-training"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
            >
              <ExternalLink size={16} />
              Preview Page
            </a>
          </div>
        </div>

        {/* ALERT MESSAGE */}

        {message.text && (
          <div
            className={`flex items-center gap-3 rounded-xl border p-4 text-sm ${
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

        <form onSubmit={handleSave} className="space-y-6">
          {/* TEXT MANAGEMENT */}

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-6">
              <h2 className="text-lg font-bold text-gray-900">Hero Content</h2>
              <p className="mt-1 text-sm text-gray-500">
                Edit the text displayed on the left side of your Hero section.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {/* LABEL */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Small Label
                </label>
                <input
                  type="text"
                  name="label"
                  value={hero.label}
                  onChange={handleChange}
                  placeholder="For teams"
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#009FF6] focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* HEADING */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Main Heading
                </label>
                <input
                  type="text"
                  name="heading"
                  value={hero.heading}
                  onChange={handleChange}
                  placeholder="Corporate training"
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#009FF6] focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* HIGHLIGHTED HEADING */}

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Highlighted Heading
                </label>
                <input
                  type="text"
                  name="highlightedHeading"
                  value={hero.highlightedHeading}
                  onChange={handleChange}
                  placeholder="Skills your staff can use."
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#009FF6] focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* DESCRIPTION */}

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Description
                </label>
                <textarea
                  name="description"
                  rows={4}
                  value={hero.description}
                  onChange={handleChange}
                  placeholder="Enter Hero description..."
                  className="w-full resize-y rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#009FF6] focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* BUTTON TEXT */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Button Text
                </label>
                <input
                  type="text"
                  name="buttonText"
                  value={hero.buttonText}
                  onChange={handleChange}
                  placeholder="Request a training plan"
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#009FF6] focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* BUTTON LINK */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Button Link
                </label>
                <input
                  type="text"
                  name="buttonLink"
                  value={hero.buttonLink}
                  onChange={handleChange}
                  placeholder="/contact"
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#009FF6] focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>
          </div>

          {/* IMAGE MANAGEMENT */}

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-6">
              <h2 className="text-lg font-bold text-gray-900">Hero Images</h2>
              <p className="mt-1 text-sm text-gray-500">
                Upload or replace the three images displayed on the right side.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              <ImageUploadField field="image1" title="Image 1" />
              <ImageUploadField field="image2" title="Image 2" />
              <ImageUploadField field="image3" title="Image 3" />
            </div>
          </div>

          {/* LIVE PREVIEW */}

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-5">
              <h2 className="text-lg font-bold text-gray-900">
                Content Preview
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Preview your updated Hero text before saving.
              </p>
            </div>

            <div className="grid grid-cols-1 items-center gap-8 rounded-xl bg-gray-50 p-5 sm:p-7 lg:grid-cols-2">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-[#009FF6]">
                  <Building2 size={17} />
                  {hero.label || "For teams"}
                </div>

                <h3 className="mt-5 text-3xl font-bold leading-tight text-gray-900">
                  {hero.heading || "Corporate training"}

                  <span className="mt-1 block text-[#009FF6]">
                    {hero.highlightedHeading || "Skills your staff can use."}
                  </span>
                </h3>

                <p className="mt-4 text-base leading-7 text-gray-600">
                  {hero.description}
                </p>

                <div className="mt-6 inline-flex items-center gap-3 rounded-xl bg-[#009FF6] px-6 py-3 font-semibold text-white">
                  {hero.buttonText || "Request a training plan"}
                  <span className="text-xl">→</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  {[previews.image1, previews.image2].map((src, index) => (
                    <div
                      key={index}
                      className="h-32 overflow-hidden rounded-xl bg-gray-200 sm:h-40"
                    >
                      {src && (
                        <img
                          src={src}
                          alt={`Hero preview ${index + 1}`}
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>
                  ))}
                </div>

                <div className="h-36 overflow-hidden rounded-xl bg-gray-200 sm:h-40">
                  {previews.image3 && (
                    <img
                      src={previews.image3}
                      alt="Hero preview 3"
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* SAVE BUTTON */}

          <div className="flex flex-col-reverse justify-end gap-3 sm:flex-row">
            <button
              type="button"
              onClick={fetchHero}
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 disabled:opacity-50"
            >
              <RefreshCw size={17} />
              Reload
            </button>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#009FF6] px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <>
                  <RefreshCw size={18} className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={18} />
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
