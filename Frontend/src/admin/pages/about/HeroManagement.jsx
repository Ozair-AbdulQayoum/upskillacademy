import React, { useEffect, useState } from "react";
import {
  Image as ImageIcon,
  Save,
  RefreshCw,
  Eye,
  Type,
  Link,
  CheckCircle2,
  AlertCircle,
  LoaderCircle,
} from "lucide-react";

import api from "../../../services/api";

const initialData = {
  subtitle: "",
  title: "",
  backgroundImage: "",
  imageAlt: "",
};

export default function HeroManagement() {
  const [formData, setFormData] = useState(initialData);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [imageError, setImageError] = useState(false);

  // =====================================
  // FETCH HERO CONTENT
  // =====================================
  const fetchHero = async () => {
    try {
      setLoading(true);
      setError("");
      setMessage("");
      setImageError(false);

      const response = await api.get("/about/hero");
      const hero = response.data.data || response.data;

      setFormData({
        ...initialData,
        ...hero,
      });
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to load Hero Section content.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHero();
  }, []);

  // =====================================
  // HANDLE INPUT CHANGES
  // =====================================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "backgroundImage") {
      setImageError(false);
    }

    setMessage("");
    setError("");
  };

  // =====================================
  // SAVE HERO CONTENT
  // =====================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (saving) return;

    if (!formData.title.trim()) {
      setError("Please enter the main title.");
      return;
    }

    if (
      formData.backgroundImage &&
      !/^https?:\/\/.+/i.test(formData.backgroundImage.trim())
    ) {
      setError("Please enter a valid image URL.");
      return;
    }

    try {
      setSaving(true);
      setMessage("");
      setError("");

      const response = await api.put("/about/hero", {
        subtitle: formData.subtitle.trim(),
        title: formData.title.trim(),
        backgroundImage: formData.backgroundImage.trim(),
        imageAlt: formData.imageAlt.trim(),
      });

      if (response.data.success === false) {
        throw new Error(
          response.data.message || "Failed to update Hero Section.",
        );
      }

      setMessage("Hero Section updated successfully!");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to update Hero Section.",
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================
  // LOADING STATE
  // =====================================
  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <LoaderCircle className="animate-spin text-[#009FF6]" size={32} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* PAGE HEADER */}
      <div>
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
          <span>Dashboard</span>
          <span>/</span>
          <span>About Page</span>
          <span>/</span>
          <span className="text-[#009FF6] font-medium">Hero Section</span>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-[#101828]">
          Hero Section
        </h1>

        <p className="text-gray-500 mt-2">
          Manage the main heading, subtitle and background image of your About
          page.
        </p>
      </div>

      {/* STATUS MESSAGES */}
      {message && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-green-50 border border-green-200 text-green-700">
          <CheckCircle2 size={20} />
          <p className="text-sm font-medium">{message}</p>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700">
          <AlertCircle size={20} />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* MAIN CONTENT */}
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
          {/* FORM */}
          <div className="xl:col-span-3 bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8">
            <div className="flex items-center gap-3 pb-5 border-b border-gray-100">
              <div className="w-11 h-11 rounded-xl bg-[#EAF6FF] text-[#009FF6] flex items-center justify-center">
                <Type size={22} />
              </div>

              <div>
                <h2 className="font-bold text-[#101828]">Hero Content</h2>
                <p className="text-xs text-gray-500 mt-1">
                  Update your page text.
                </p>
              </div>
            </div>

            <div className="space-y-6 mt-6">
              {/* SUBTITLE */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Subtitle
                </label>

                <input
                  type="text"
                  name="subtitle"
                  value={formData.subtitle}
                  onChange={handleChange}
                  placeholder="Enter hero subtitle"
                  maxLength={150}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-[#009FF6] focus:ring-2 focus:ring-[#009FF6]/10 transition"
                />
              </div>

              {/* TITLE */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Main Title
                </label>

                <textarea
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  rows={3}
                  maxLength={300}
                  placeholder="Enter your main heading"
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-[#009FF6] focus:ring-2 focus:ring-[#009FF6]/10 transition resize-y"
                />
              </div>

              {/* BACKGROUND IMAGE URL */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Background Image URL
                </label>

                <div className="relative">
                  <Link
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="url"
                    name="backgroundImage"
                    value={formData.backgroundImage}
                    onChange={handleChange}
                    placeholder="https://example.com/image.jpg"
                    className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-[#009FF6] focus:ring-2 focus:ring-[#009FF6]/10 transition"
                  />
                </div>

                <p className="text-xs text-gray-400 mt-2">
                  Enter a publicly accessible image URL.
                </p>
              </div>

              {/* IMAGE ALT TEXT */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Image Alt Text
                </label>

                <input
                  type="text"
                  name="imageAlt"
                  value={formData.imageAlt}
                  onChange={handleChange}
                  placeholder="Describe the background image"
                  maxLength={200}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-[#009FF6] focus:ring-2 focus:ring-[#009FF6]/10 transition"
                />
              </div>
            </div>
          </div>

          {/* LIVE PREVIEW */}
          <div className="xl:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-[#EAF6FF] text-[#009FF6] flex items-center justify-center">
                <Eye size={21} />
              </div>

              <div>
                <h2 className="font-bold text-[#101828]">Live Preview</h2>
                <p className="text-xs text-gray-500 mt-1">
                  Preview your current edits.
                </p>
              </div>
            </div>

            <div className="relative min-h-[280px] rounded-xl overflow-hidden bg-[#101828] flex items-center justify-center p-6">
              {formData.backgroundImage && !imageError && (
                <img
                  src={formData.backgroundImage}
                  alt={formData.imageAlt || "Hero background preview"}
                  onError={() => setImageError(true)}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              )}

              <div className="absolute inset-0 bg-black/60"></div>

              <div className="relative z-10 text-center text-white">
                <p className="text-sm text-[#55C3FF] font-semibold mb-3">
                  {formData.subtitle || "Your subtitle"}
                </p>

                <h3 className="text-2xl font-bold leading-tight">
                  {formData.title || "Your main heading"}
                </h3>
              </div>
            </div>

            {imageError && (
              <p className="text-xs text-red-500 mt-3">
                Unable to load this image. Please check the URL.
              </p>
            )}

            <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
              <ImageIcon size={15} />
              Preview updates as you edit.
            </div>
          </div>
        </div>

        {/* SAVE ACTIONS */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <button
            type="button"
            onClick={fetchHero}
            disabled={saving || loading}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition disabled:opacity-50"
          >
            <RefreshCw size={17} />
            Reload Content
          </button>

          <button
            type="submit"
            disabled={saving}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#009FF6] text-white font-semibold hover:bg-[#0088D1] transition disabled:opacity-60"
          >
            {saving ? (
              <>
                <LoaderCircle size={18} className="animate-spin" />
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
