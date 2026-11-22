import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Save,
  RefreshCw,
  Type,
  Sparkles,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

const API_URL = "http://localhost:5000/api/services/hero";

const initialData = {
  badge: "",
  headingPart1: "",
  headingPart2: "",
  description: "",
};

export default function HeroManagement() {
  const [hero, setHero] = useState(initialData);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // FETCH HERO DATA
  const fetchHero = async () => {
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await axios.get(API_URL, {
        timeout: 8000,
      });

      if (!response.data?.success || !response.data?.data) {
        throw new Error("Invalid Hero API response.");
      }

      setHero({
        ...initialData,
        ...response.data.data,
      });
    } catch (err) {
      console.error("Hero Fetch Error:", err);

      setError(
        err.code === "ECONNABORTED"
          ? "Request timed out. Check your backend server."
          : err.response?.data?.message ||
              err.message ||
              "Failed to load Hero data.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHero();
  }, []);

  // HANDLE INPUT
  const handleChange = (e) => {
    const { name, value } = e.target;

    setHero((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // UPDATE HERO
  const handleSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);
    setError("");
    setMessage("");

    try {
      const response = await axios.put(API_URL, hero, {
        timeout: 8000,
      });

      if (!response.data?.success) {
        throw new Error(response.data?.message || "Update failed.");
      }

      setHero({
        ...initialData,
        ...response.data.data,
      });

      setMessage("Hero section updated successfully!");
    } catch (err) {
      console.error("Hero Update Error:", err);

      setError(
        err.code === "ECONNABORTED"
          ? "Save request timed out."
          : err.response?.data?.message ||
              err.message ||
              "Failed to update Hero.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-7">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#009FF6] mb-2">
            <Sparkles size={20} />
            <span className="text-sm font-semibold">Services Management</span>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Hero Section Management
          </h1>

          <p className="text-gray-500 mt-2">
            Manage your public Services page hero content.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchHero}
          disabled={loading || saving}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50"
        >
          <RefreshCw size={17} className={loading ? "animate-spin" : ""} />
          Reload Data
        </button>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="flex items-center justify-center min-h-[250px]">
          <RefreshCw className="animate-spin text-[#009FF6]" size={30} />
          <span className="ml-3 text-gray-500">Loading Hero data...</span>
        </div>
      )}

      {/* ERROR */}
      {!loading && error && (
        <div className="p-5 rounded-xl bg-red-50 border border-red-100 text-red-600">
          <div className="flex items-center gap-2 font-semibold">
            <AlertCircle size={20} />
            Something went wrong
          </div>

          <p className="mt-2">{error}</p>

          <button
            type="button"
            onClick={fetchHero}
            className="mt-4 px-4 py-2 rounded-lg bg-red-600 text-white"
          >
            Try Again
          </button>
        </div>
      )}

      {/* SUCCESS */}
      {message && (
        <div className="flex items-center gap-2 p-4 rounded-xl bg-green-50 text-green-700 border border-green-100">
          <CheckCircle size={19} />
          {message}
        </div>
      )}

      {/* FORM */}
      {!loading && !error && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 md:p-7 space-y-6">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
              <div className="w-11 h-11 rounded-xl bg-blue-50 text-[#009FF6] flex items-center justify-center">
                <Type size={22} />
              </div>

              <div>
                <h2 className="font-bold text-gray-900">Hero Content</h2>
                <p className="text-sm text-gray-500">
                  Edit the heading and badge displayed on your website.
                </p>
              </div>
            </div>

            {/* BADGE */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Badge Text
              </label>

              <input
                type="text"
                name="badge"
                value={hero.badge}
                onChange={handleChange}
                placeholder="Enter badge text"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-[#009FF6] focus:ring-2 focus:ring-[#009FF6]/10"
                required
              />
            </div>

            {/* HEADING PART 1 */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Heading Part 1
              </label>

              <input
                type="text"
                name="headingPart1"
                value={hero.headingPart1}
                onChange={handleChange}
                placeholder="Enter first heading"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-[#009FF6] focus:ring-2 focus:ring-[#009FF6]/10"
                required
              />

              <p className="text-xs text-gray-400 mt-2">
                Displayed in blue color.
              </p>
            </div>

            {/* HEADING PART 2 */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Heading Part 2
              </label>

              <input
                type="text"
                name="headingPart2"
                value={hero.headingPart2}
                onChange={handleChange}
                placeholder="Enter second heading"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-[#009FF6] focus:ring-2 focus:ring-[#009FF6]/10"
                required
              />

              <p className="text-xs text-gray-400 mt-2">
                Displayed in dark gray color.
              </p>
            </div>

            {/* DESCRIPTION */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description
              </label>

              <textarea
                name="description"
                value={hero.description}
                onChange={handleChange}
                rows={5}
                placeholder="Enter hero description"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none resize-y focus:border-[#009FF6] focus:ring-2 focus:ring-[#009FF6]/10"
                required
              />

              <p className="text-xs text-gray-400 mt-2">
                Keep your description clear and concise.
              </p>
            </div>
          </div>

          {/* PREVIEW */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 md:p-7">
            <h2 className="font-bold text-gray-900 mb-5">Hero Preview</h2>

            <div className="text-center bg-gray-50 rounded-xl px-5 py-10">
              <span className="inline-block px-4 py-2 mb-6 rounded-full bg-[#009FF6]/10 text-[#009FF6] text-sm font-semibold">
                {hero.badge || "Your Badge"}
              </span>

              <h2 className="text-2xl md:text-4xl font-bold leading-tight mb-5">
                <span className="text-[#009FF6]">
                  {hero.headingPart1 || "Heading Part 1"}
                </span>{" "}
                <span className="text-gray-900">
                  {hero.headingPart2 || "Heading Part 2"}
                </span>
              </h2>

              <p className="max-w-2xl mx-auto text-gray-500 leading-relaxed">
                {hero.description || "Your description will appear here."}
              </p>
            </div>
          </div>

          {/* SAVE */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-[#009FF6] text-white font-semibold hover:bg-[#0088D4] disabled:opacity-60 transition shadow-sm"
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
      )}
    </div>
  );
}
