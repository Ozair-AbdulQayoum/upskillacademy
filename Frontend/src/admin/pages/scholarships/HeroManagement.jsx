import React, { useEffect, useState } from "react";
import {
  Save,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Upload,
  Loader2,
  RefreshCw,
} from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const SERVER_BASE = API_BASE.replace(/\/api\/?$/, "");

const initialHero = {
  heading: "",
  paragraph1: "",
  paragraph2: "",
  buttonText: "",
  buttonLink: "",
  bannerTitle: "",
  videoLink: "",
  images: {},
  isVisible: true,
};

const imageFields = Array.from({ length: 8 }, (_, index) => ({
  name: `image${index + 1}`,
  label: `Image ${index + 1}`,
}));

export default function ScholarshipHeroManagement() {
  const [hero, setHero] = useState(initialHero);
  const [selectedFiles, setSelectedFiles] = useState({});
  const [previewUrls, setPreviewUrls] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [visibilityLoading, setVisibilityLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Load scholarship hero data
  const fetchHero = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_BASE}/scholarship/hero`);
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to load scholarship hero.");
      }

      setHero({
        ...initialHero,
        ...data.hero,
        images: data.hero.images || {},
      });
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHero();
  }, []);

  // Create image previews
  useEffect(() => {
    const urls = {};

    Object.entries(selectedFiles).forEach(([name, file]) => {
      if (file) {
        urls[name] = URL.createObjectURL(file);
      }
    });

    setPreviewUrls(urls);

    return () => {
      Object.values(urls).forEach((url) => URL.revokeObjectURL(url));
    };
  }, [selectedFiles]);

  // Update text fields
  const handleChange = (e) => {
    const { name, value } = e.target;

    setHero((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Select images
  const handleImageChange = (e, imageName) => {
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
    setSelectedFiles((prev) => ({
      ...prev,
      [imageName]: file,
    }));
  };

  // Save hero content and images
  const handleSave = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setMessage("");
      setError("");

      const formData = new FormData();

      const editableFields = [
        "heading",
        "paragraph1",
        "paragraph2",
        "buttonText",
        "buttonLink",
        "bannerTitle",
        "videoLink",
      ];

      editableFields.forEach((field) => {
        formData.append(field, hero[field] || "");
      });

      Object.entries(selectedFiles).forEach(([name, file]) => {
        formData.append(name, file);
      });

      const response = await fetch(`${API_BASE}/scholarship/hero`, {
        method: "PUT",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to save changes.");
      }

      setHero({
        ...initialHero,
        ...data.hero,
        images: data.hero.images || {},
      });

      setSelectedFiles({});
      setMessage("Scholarship hero updated successfully.");
    } catch (err) {
      setError(err.message || "Something went wrong while saving.");
    } finally {
      setSaving(false);
    }
  };

  // Hide or restore hero section
  const handleVisibility = async () => {
    try {
      setVisibilityLoading(true);
      setMessage("");
      setError("");

      const newVisibility = !hero.isVisible;

      const response = await fetch(`${API_BASE}/scholarship/hero/visibility`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isVisible: newVisibility,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to change visibility.");
      }

      setHero((prev) => ({
        ...prev,
        isVisible: data.hero.isVisible,
      }));

      setMessage(data.message);
    } catch (err) {
      setError(err.message || "Failed to change visibility.");
    } finally {
      setVisibilityLoading(false);
    }
  };

  // Get image preview URL
  const getImageUrl = (imageName) => {
    if (previewUrls[imageName]) {
      return previewUrls[imageName];
    }

    const savedImage = hero.images?.[imageName];

    if (!savedImage) return "";

    return savedImage.startsWith("http")
      ? savedImage
      : `${SERVER_BASE}${savedImage}`;
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <span className="ml-3 text-gray-600">Loading scholarship hero...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* PAGE HEADER */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Scholarship Hero Section
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage the scholarship page heading, content, banner and images.
          </p>
        </div>

        <button
          type="button"
          onClick={handleVisibility}
          disabled={visibilityLoading}
          className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
            hero.isVisible
              ? "bg-green-50 text-green-700 hover:bg-green-100"
              : "bg-red-50 text-red-700 hover:bg-red-100"
          }`}
        >
          {visibilityLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : hero.isVisible ? (
            <Eye className="h-4 w-4" />
          ) : (
            <EyeOff className="h-4 w-4" />
          )}

          {hero.isVisible ? "Visible on Website" : "Hidden on Website"}
        </button>
      </div>

      {/* STATUS MESSAGES */}
      {message && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
          {message}
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* TEXT CONTENT */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
              <ImageIcon size={20} />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">Hero Content</h2>
              <p className="text-sm text-gray-500">
                Edit the main scholarship page content.
              </p>
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Main Heading
              </label>
              <input
                type="text"
                name="heading"
                value={hero.heading}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                placeholder="Enter main heading"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Paragraph 1
              </label>
              <textarea
                name="paragraph1"
                value={hero.paragraph1}
                onChange={handleChange}
                rows={3}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                placeholder="Enter first paragraph"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Paragraph 2
              </label>
              <textarea
                name="paragraph2"
                value={hero.paragraph2}
                onChange={handleChange}
                rows={4}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                placeholder="Enter second paragraph"
              />
            </div>
          </div>
        </div>

        {/* BUTTON SETTINGS */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="mb-5 font-semibold text-gray-900">Button Settings</h2>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Button Text
              </label>
              <input
                type="text"
                name="buttonText"
                value={hero.buttonText}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                placeholder="Apply Now"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Button Link
              </label>
              <input
                type="text"
                name="buttonLink"
                value={hero.buttonLink}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                placeholder="/ApplicationForm"
              />
            </div>
          </div>
        </div>

        {/* BANNER SETTINGS */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="mb-5 font-semibold text-gray-900">
            Scholarship Banner
          </h2>

          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Banner Title
              </label>
              <input
                type="text"
                name="bannerTitle"
                value={hero.bannerTitle}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                placeholder="Enter banner title"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Video Link
              </label>
              <input
                type="url"
                name="videoLink"
                value={hero.videoLink}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                placeholder="https://example.com/video"
              />
            </div>
          </div>
        </div>

        {/* IMAGE MANAGEMENT */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-6">
            <h2 className="font-semibold text-gray-900">Scholarship Images</h2>
            <p className="mt-1 text-sm text-gray-500">
              Upload up to 8 images. JPG, PNG, WEBP and GIF are supported.
              Maximum size: 5MB per image.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {imageFields.map((image) => {
              const imageUrl = getImageUrl(image.name);

              return (
                <div
                  key={image.name}
                  className="overflow-hidden rounded-xl border border-gray-200"
                >
                  <div className="flex h-36 items-center justify-center bg-gray-50">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={image.label}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="text-center text-gray-400">
                        <ImageIcon className="mx-auto mb-2" size={30} />
                        <span className="text-xs">No image selected</span>
                      </div>
                    )}
                  </div>

                  <div className="p-3">
                    <p className="mb-2 text-sm font-semibold text-gray-700">
                      {image.label}
                    </p>

                    <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-medium text-blue-600 transition hover:bg-blue-100">
                      <Upload size={16} />
                      {selectedFiles[image.name]
                        ? "Change Image"
                        : "Upload Image"}

                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        className="hidden"
                        onChange={(e) => handleImageChange(e, image.name)}
                      />
                    </label>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* SAVE BUTTON */}
        <div className="flex flex-col-reverse justify-end gap-3 sm:flex-row">
          <button
            type="button"
            onClick={fetchHero}
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            <RefreshCw size={17} />
            Reload Data
          </button>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? (
              <>
                <Loader2 size={18} className="animate-spin" />
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
  );
}
