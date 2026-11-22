import React, { useEffect, useState } from "react";

import {
  Save,
  RefreshCw,
  Eye,
  EyeOff,
  ExternalLink,
  MessageSquare,
  Type,
  Link as LinkIcon,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";

// ==================================================
// API CONFIGURATION
// ==================================================

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// ==================================================
// DEFAULT CTA DATA
// ==================================================

const defaultCTA = {
  heading: "Have an internship or job to fill?",
  description:
    "Tell us about the role and we'll send you a short list of students who could do it.",
  buttonText: "Contact our team",
  buttonLink: "/contact",
  isVisible: true,
};

// ==================================================
// MAIN COMPONENT
// ==================================================

export default function EmployersCTAManagement() {
  const [cta, setCTA] = useState(defaultCTA);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [visibilityLoading, setVisibilityLoading] = useState(false);

  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

  // ==================================================
  // HANDLE FIELD CHANGES
  // ==================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setCTA((prev) => ({
      ...prev,
      [name]: value,
    }));

    setMessage({ type: "", text: "" });
  };

  // ==================================================
  // FETCH CTA DATA
  // ==================================================

  const fetchCTA = async () => {
    try {
      setLoading(true);
      setMessage({ type: "", text: "" });

      const response = await fetch(`${API_BASE}/employers/cta`);

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to load CTA content.");
      }

      const section = result.cta || result.data?.cta || result.data;

      if (!section || typeof section !== "object") {
        throw new Error("Invalid CTA response from server.");
      }

      setCTA({
        ...defaultCTA,
        ...section,
      });
    } catch (error) {
      console.error("Fetch CTA Error:", error);

      setMessage({
        type: "error",
        text: error.message || "Unable to load CTA content.",
      });
    } finally {
      setLoading(false);
    }
  };

  // ==================================================
  // INITIAL FETCH
  // ==================================================

  useEffect(() => {
    fetchCTA();
  }, []);

  // ==================================================
  // SAVE CTA CONTENT
  // ==================================================

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setMessage({ type: "", text: "" });

      const payload = {
        heading: cta.heading,
        description: cta.description,
        buttonText: cta.buttonText,
        buttonLink: cta.buttonLink,
      };

      const response = await fetch(`${API_BASE}/employers/cta`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to update CTA.");
      }

      const updatedCTA = result.cta || result.data?.cta || result.data;

      if (updatedCTA) {
        setCTA((prev) => ({
          ...prev,
          ...updatedCTA,
        }));
      }

      setMessage({
        type: "success",
        text: result.message || "CTA updated successfully.",
      });
    } catch (error) {
      console.error("Save CTA Error:", error);

      setMessage({
        type: "error",
        text: error.message || "Unable to save CTA content.",
      });
    } finally {
      setSaving(false);
    }
  };

  // ==================================================
  // TOGGLE VISIBILITY
  // ==================================================

  const handleVisibility = async () => {
    try {
      setVisibilityLoading(true);
      setMessage({ type: "", text: "" });

      const newVisibility = !cta.isVisible;

      const response = await fetch(`${API_BASE}/employers/cta/visibility`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isVisible: newVisibility,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to update CTA visibility.");
      }

      const updatedCTA = result.cta || result.data?.cta || result.data;

      setCTA((prev) => ({
        ...prev,
        ...(updatedCTA || {}),
        isVisible: newVisibility,
      }));

      setMessage({
        type: "success",
        text:
          result.message ||
          `CTA ${newVisibility ? "published" : "hidden"} successfully.`,
      });
    } catch (error) {
      console.error("CTA Visibility Error:", error);

      setMessage({
        type: "error",
        text: error.message || "Unable to update CTA visibility.",
      });
    } finally {
      setVisibilityLoading(false);
    }
  };

  // ==================================================
  // LOADING SCREEN
  // ==================================================

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-sm font-medium text-gray-500">
            Loading CTA content...
          </p>
        </div>
      </div>
    );
  }

  // ==================================================
  // REUSABLE FORM FIELD
  // ==================================================

  const inputClass =
    "mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10";

  // ==================================================
  // RENDER
  // ==================================================

  return (
    <div className="w-full space-y-6 pb-10">
      {/* PAGE HEADER */}

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-blue-600">
            <MessageSquare size={17} />
            Employers Page
          </div>

          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            CTA Management
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Manage the call-to-action section displayed on your Employers page.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={fetchCTA}
            disabled={loading || saving}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw size={16} />
            Refresh
          </button>

          <button
            type="button"
            onClick={handleVisibility}
            disabled={visibilityLoading}
            className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition disabled:opacity-50 ${
              cta.isVisible
                ? "bg-green-50 text-green-700 hover:bg-green-100"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {visibilityLoading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : cta.isVisible ? (
              <Eye size={16} />
            ) : (
              <EyeOff size={16} />
            )}

            {cta.isVisible ? "Published" : "Hidden"}
          </button>
        </div>
      </div>

      {/* SUCCESS / ERROR MESSAGE */}

      {message.text && (
        <div
          className={`flex items-start gap-3 rounded-xl border p-4 ${
            message.type === "success"
              ? "border-green-200 bg-green-50 text-green-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 size={19} className="mt-0.5 shrink-0" />
          ) : (
            <AlertCircle size={19} className="mt-0.5 shrink-0" />
          )}

          <p className="text-sm font-medium">{message.text}</p>
        </div>
      )}

      {/* MAIN CONTENT */}

      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-5">
        {/* EDIT FORM */}

        <div className="space-y-6 xl:col-span-3">
          <form
            onSubmit={handleSave}
            className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
          >
            {/* FORM HEADER */}

            <div className="border-b border-gray-100 px-5 py-5 sm:px-6">
              <h2 className="text-lg font-bold text-gray-900">CTA Content</h2>

              <p className="mt-1 text-sm text-gray-500">
                Edit the text and button displayed in the public section.
              </p>
            </div>

            {/* FORM FIELDS */}

            <div className="space-y-5 p-5 sm:p-6">
              {/* HEADING */}

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <Type size={16} className="text-blue-600" />
                  Heading
                </label>

                <input
                  type="text"
                  name="heading"
                  value={cta.heading}
                  onChange={handleChange}
                  placeholder="Enter CTA heading"
                  className={inputClass}
                  required
                />
              </div>

              {/* DESCRIPTION */}

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <MessageSquare size={16} className="text-blue-600" />
                  Description
                </label>

                <textarea
                  name="description"
                  value={cta.description}
                  onChange={handleChange}
                  placeholder="Enter CTA description"
                  rows={4}
                  className={`${inputClass} resize-y`}
                  required
                />

                <p className="mt-1.5 text-xs text-gray-400">
                  Keep the description clear and concise.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {/* BUTTON TEXT */}

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <Type size={16} className="text-blue-600" />
                    Button Text
                  </label>

                  <input
                    type="text"
                    name="buttonText"
                    value={cta.buttonText}
                    onChange={handleChange}
                    placeholder="Contact our team"
                    className={inputClass}
                    required
                  />
                </div>

                {/* BUTTON LINK */}

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <LinkIcon size={16} className="text-blue-600" />
                    Button Link
                  </label>

                  <input
                    type="text"
                    name="buttonLink"
                    value={cta.buttonLink}
                    onChange={handleChange}
                    placeholder="/contact"
                    className={inputClass}
                    required
                  />

                  <p className="mt-1.5 text-xs text-gray-400">
                    Example: /contact
                  </p>
                </div>
              </div>
            </div>

            {/* FORM FOOTER */}

            <div className="flex flex-col justify-between gap-3 border-t border-gray-100 bg-gray-50 px-5 py-4 sm:flex-row sm:items-center sm:px-6">
              <p className="text-xs text-gray-500">
                Changes are saved to your database.
              </p>

              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? (
                  <>
                    <Loader2 size={17} className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={17} />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* LIVE PREVIEW */}

        <div className="space-y-4 xl:col-span-2">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Live Preview</h2>

            <p className="mt-1 text-sm text-gray-500">
              Preview how your CTA section will look on the website.
            </p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Employers Page CTA
              </span>

              <span
                className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                  cta.isVisible
                    ? "bg-green-50 text-green-700"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {cta.isVisible ? "Visible" : "Hidden"}
              </span>
            </div>

            {/* PREVIEW SECTION */}

            <div className="rounded-2xl bg-[#009FF6] px-5 py-9 text-center shadow-lg shadow-blue-500/20">
              <h3 className="text-2xl font-bold leading-tight text-white">
                {cta.heading || "Your CTA heading"}
              </h3>

              <p className="mt-4 text-sm leading-7 text-white/90">
                {cta.description || "Your CTA description"}
              </p>

              <div className="mt-7">
                <span className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-[#009FF6] shadow-sm">
                  {cta.buttonText || "Button text"}
                  <ExternalLink size={15} />
                </span>
              </div>
            </div>

            <p className="mt-4 break-all text-xs text-gray-500">
              Button destination:{" "}
              <span className="font-semibold text-gray-700">
                {cta.buttonLink || "Not specified"}
              </span>
            </p>
          </div>

          {/* VISIBILITY INFORMATION */}

          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
            <div className="flex items-start gap-3">
              {cta.isVisible ? (
                <Eye size={19} className="mt-0.5 text-green-600" />
              ) : (
                <EyeOff size={19} className="mt-0.5 text-gray-500" />
              )}

              <div>
                <h3 className="text-sm font-semibold text-gray-800">
                  {cta.isVisible ? "Section is published" : "Section is hidden"}
                </h3>

                <p className="mt-1 text-xs leading-5 text-gray-500">
                  {cta.isVisible
                    ? "The CTA section can be displayed on the public Employers page."
                    : "The CTA section should not be displayed on the public Employers page."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
