import React, { useEffect, useState } from "react";
import {
  Info,
  Save,
  RefreshCw,
  LoaderCircle,
  AlertCircle,
  CheckCircle2,
  Image as ImageIcon,
  Plus,
  Trash2,
  Pencil,
  X,
  Link as LinkIcon,
  BarChart3,
} from "lucide-react";

import api from "../../../services/api";

const initialData = {
  badge: "",
  title: "",
  description: "",
  images: {
    first: "",
    second: "",
  },
  statistics: {
    students: { value: "", title: "", description: "" },
    teamMembers: { value: "", title: "", description: "" },
    freeLearning: {
      value: "",
      title: "",
      description: "",
      suffix: "",
    },
    mission: { value: "", title: "", description: "" },
    courses: { value: "", title: "", description: "" },
  },
  socialLinks: [],
};

const statisticLabels = {
  students: "Students",
  teamMembers: "Team Members",
  freeLearning: "Free Learning",
  mission: "Mission",
  courses: "Courses",
};

export default function AboutSectionManagement() {
  const [formData, setFormData] = useState(initialData);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [editingLinkIndex, setEditingLinkIndex] = useState(null);
  const [linkForm, setLinkForm] = useState({
    name: "",
    url: "",
  });

  // =====================================
  // FETCH ABOUT SECTION
  // =====================================
  const fetchAboutSection = async () => {
    try {
      setLoading(true);
      setError("");
      setMessage("");

      const response = await api.get("/about/section");

      const data = response.data?.data || response.data;

      setFormData({
        ...initialData,
        ...data,
        images: {
          ...initialData.images,
          ...(data.images || {}),
        },
        statistics: Object.fromEntries(
          Object.entries(initialData.statistics).map(([key, defaultValue]) => [
            key,
            {
              ...defaultValue,
              ...(data.statistics?.[key] || {}),
            },
          ]),
        ),
        socialLinks: Array.isArray(data.socialLinks) ? data.socialLinks : [],
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load About Section.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAboutSection();
  }, []);

  // =====================================
  // HANDLE MAIN INPUTS
  // =====================================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setMessage("");
    setError("");
  };

  // =====================================
  // HANDLE IMAGE INPUTS
  // =====================================
  const handleImageChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      images: {
        ...prev.images,
        [name]: value,
      },
    }));

    setMessage("");
    setError("");
  };

  // =====================================
  // HANDLE STATISTICS
  // =====================================
  const handleStatisticChange = (key, field, value) => {
    setFormData((prev) => ({
      ...prev,
      statistics: {
        ...prev.statistics,
        [key]: {
          ...prev.statistics[key],
          [field]: value,
        },
      },
    }));

    setMessage("");
    setError("");
  };

  // =====================================
  // SAVE ABOUT SECTION
  // =====================================
  const saveAboutSection = async (e) => {
    e.preventDefault();

    if (saving) return;

    try {
      setSaving(true);
      setError("");
      setMessage("");

      await api.put("/about/section", formData);

      setMessage("About Section updated successfully!");
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to update About Section.",
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================
  // ADD SOCIAL LINK
  // =====================================
  const addSocialLink = async (e) => {
    e.preventDefault();

    if (saving) return;

    const name = linkForm.name.trim();
    const url = linkForm.url.trim();

    if (!name || !url) {
      setError("Please enter both social platform and URL.");
      return;
    }

    try {
      new URL(url);
    } catch {
      setError("Please enter a valid social link URL.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setMessage("");

      await api.post("/about/content/aboutSection/socialLinks", {
        name,
        url,
      });

      setLinkForm({ name: "", url: "" });

      setMessage("Social link added successfully!");

      await fetchAboutSection();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add social link.");
    } finally {
      setSaving(false);
    }
  };

  // =====================================
  // START SOCIAL LINK EDIT
  // =====================================
  const startEditLink = (index) => {
    setEditingLinkIndex(index);

    setLinkForm({
      name: formData.socialLinks[index].name || "",
      url: formData.socialLinks[index].url || "",
    });

    setMessage("");
    setError("");
  };

  // =====================================
  // UPDATE SOCIAL LINK
  // =====================================
  const updateSocialLink = async (e) => {
    e.preventDefault();

    if (saving || editingLinkIndex === null) return;

    const name = linkForm.name.trim();
    const url = linkForm.url.trim();

    if (!name || !url) {
      setError("Please enter both social platform and URL.");
      return;
    }

    try {
      new URL(url);
    } catch {
      setError("Please enter a valid social link URL.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setMessage("");

      await api.patch(
        `/about/content/aboutSection/socialLinks/${editingLinkIndex}`,
        { name, url },
      );

      setEditingLinkIndex(null);
      setLinkForm({ name: "", url: "" });

      setMessage("Social link updated successfully!");

      await fetchAboutSection();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update social link.");
    } finally {
      setSaving(false);
    }
  };

  // =====================================
  // DELETE SOCIAL LINK
  // =====================================
  const deleteSocialLink = async (index) => {
    if (saving) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this social link?",
    );

    if (!confirmed) return;

    try {
      setSaving(true);
      setError("");
      setMessage("");

      await api.delete(`/about/content/aboutSection/socialLinks/${index}`);

      if (editingLinkIndex === index) {
        setEditingLinkIndex(null);
        setLinkForm({ name: "", url: "" });
      } else if (editingLinkIndex !== null && editingLinkIndex > index) {
        setEditingLinkIndex((prev) => prev - 1);
      }

      setMessage("Social link deleted successfully!");

      await fetchAboutSection();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete social link.");
    } finally {
      setSaving(false);
    }
  };

  // =====================================
  // CANCEL SOCIAL LINK EDIT
  // =====================================
  const cancelLinkEdit = () => {
    setEditingLinkIndex(null);
    setLinkForm({ name: "", url: "" });
    setError("");
    setMessage("");
  };

  // =====================================
  // LOADING STATE
  // =====================================
  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
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
          <span className="text-[#009FF6] font-medium">About Section</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#EAF6FF] text-[#009FF6] flex items-center justify-center">
            <Info size={24} />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-[#101828]">
              About Section Management
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              Manage descriptions, images, statistics and social links.
            </p>
          </div>
        </div>
      </div>

      {/* STATUS MESSAGES */}
      {message && (
        <div className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
          <CheckCircle2 size={18} />
          {message}
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      <form onSubmit={saveAboutSection} className="space-y-6">
        {/* BASIC CONTENT */}
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-3 border-b border-gray-100 pb-5">
            <Info className="text-[#009FF6]" size={22} />

            <div>
              <h2 className="font-bold text-[#101828]">About Content</h2>

              <p className="text-xs text-gray-500 mt-1">
                Manage the main About section text.
              </p>
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Badge
              </label>

              <input
                type="text"
                name="badge"
                value={formData.badge}
                onChange={handleChange}
                placeholder="About Us"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#009FF6]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Section Title
              </label>

              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter section title"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#009FF6]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Description
              </label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={5}
                placeholder="Enter About section description..."
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#009FF6] resize-y"
              />
            </div>
          </div>
        </section>

        {/* ABOUT IMAGES */}
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-3 border-b border-gray-100 pb-5">
            <ImageIcon className="text-[#009FF6]" size={22} />

            <div>
              <h2 className="font-bold text-[#101828]">About Images</h2>

              <p className="text-xs text-gray-500 mt-1">
                Update the two images displayed in the About section.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {["first", "second"].map((imageKey) => (
              <div key={imageKey}>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  {imageKey === "first"
                    ? "First Image URL"
                    : "Second Image URL"}
                </label>

                <input
                  type="url"
                  value={formData.images[imageKey]}
                  onChange={(e) => handleImageChange(imageKey, e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#009FF6]"
                />

                {formData.images[imageKey] && (
                  <img
                    src={formData.images[imageKey]}
                    alt={`${imageKey} About preview`}
                    className="mt-3 h-48 w-full rounded-xl border object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </section>

        {/* STATISTICS */}
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-3 border-b border-gray-100 pb-5">
            <BarChart3 className="text-[#009FF6]" size={22} />

            <div>
              <h2 className="font-bold text-[#101828]">
                Statistics Management
              </h2>

              <p className="text-xs text-gray-500 mt-1">
                Update the five statistics displayed on your website.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {Object.entries(statisticLabels).map(([key, label]) => (
              <div key={key} className="rounded-xl border border-gray-200 p-5">
                <h3 className="mb-4 font-semibold text-gray-800">{label}</h3>

                <div className="space-y-3">
                  <input
                    type="text"
                    value={formData.statistics[key].value}
                    onChange={(e) =>
                      handleStatisticChange(key, "value", e.target.value)
                    }
                    placeholder="Value"
                    className="w-full rounded-lg border border-gray-200 px-3 py-2.5 outline-none focus:border-[#009FF6]"
                  />

                  <input
                    type="text"
                    value={formData.statistics[key].title}
                    onChange={(e) =>
                      handleStatisticChange(key, "title", e.target.value)
                    }
                    placeholder="Title"
                    className="w-full rounded-lg border border-gray-200 px-3 py-2.5 outline-none focus:border-[#009FF6]"
                  />

                  <textarea
                    value={formData.statistics[key].description}
                    onChange={(e) =>
                      handleStatisticChange(key, "description", e.target.value)
                    }
                    rows={2}
                    placeholder="Description"
                    className="w-full rounded-lg border border-gray-200 px-3 py-2.5 outline-none focus:border-[#009FF6] resize-y"
                  />

                  {key === "freeLearning" && (
                    <input
                      type="text"
                      value={formData.statistics[key].suffix || ""}
                      onChange={(e) =>
                        handleStatisticChange(key, "suffix", e.target.value)
                      }
                      placeholder="Suffix (e.g. +)"
                      className="w-full rounded-lg border border-gray-200 px-3 py-2.5 outline-none focus:border-[#009FF6]"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SAVE MAIN CONTENT */}
        <div className="flex justify-end rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center justify-center gap-2 rounded-xl bg-[#009FF6] px-6 py-3 font-semibold text-white transition hover:bg-[#0088D1] disabled:opacity-60"
          >
            {saving ? (
              <>
                <LoaderCircle size={18} className="animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save size={18} />
                Save About Content
              </>
            )}
          </button>
        </div>
      </form>

      {/* SOCIAL LINKS */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-3 border-b border-gray-100 pb-5">
          <LinkIcon className="text-[#009FF6]" size={22} />

          <div>
            <h2 className="font-bold text-[#101828]">
              Social Links Management
            </h2>

            <p className="text-xs text-gray-500 mt-1">
              Add, edit or remove your social media links.
            </p>
          </div>
        </div>

        {/* ADD / EDIT FORM */}
        <form
          onSubmit={
            editingLinkIndex !== null ? updateSocialLink : addSocialLink
          }
          className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-3"
        >
          <input
            type="text"
            value={linkForm.name}
            onChange={(e) =>
              setLinkForm((prev) => ({
                ...prev,
                name: e.target.value,
              }))
            }
            placeholder="Platform (Facebook, LinkedIn...)"
            className="rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#009FF6]"
            required
          />

          <input
            type="url"
            value={linkForm.url}
            onChange={(e) =>
              setLinkForm((prev) => ({
                ...prev,
                url: e.target.value,
              }))
            }
            placeholder="https://..."
            className="rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#009FF6]"
            required
          />

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={saving}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#009FF6] px-4 py-3 font-medium text-white hover:bg-[#0088D1] disabled:opacity-50"
            >
              {saving ? (
                <LoaderCircle size={17} className="animate-spin" />
              ) : editingLinkIndex !== null ? (
                <Save size={17} />
              ) : (
                <Plus size={17} />
              )}

              {editingLinkIndex !== null ? "Update" : "Add Link"}
            </button>

            {editingLinkIndex !== null && (
              <button
                type="button"
                onClick={cancelLinkEdit}
                disabled={saving}
                className="rounded-xl border px-3 hover:bg-gray-50"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </form>

        {/* SOCIAL LINKS LIST */}
        {formData.socialLinks.length === 0 ? (
          <div className="rounded-xl border border-dashed p-8 text-center text-gray-500">
            No social links added yet.
          </div>
        ) : (
          <div className="space-y-3">
            {formData.socialLinks.map((link, index) => (
              <div
                key={link._id || `${link.name}-${index}`}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-200 p-4"
              >
                <div className="min-w-0">
                  <h3 className="font-semibold text-gray-800">{link.name}</h3>

                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="break-all text-sm text-blue-600 hover:underline"
                  >
                    {link.url}
                  </a>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => startEditLink(index)}
                    disabled={saving}
                    title="Edit social link"
                    className="rounded-lg bg-blue-50 p-2 text-blue-600 hover:bg-blue-100 disabled:opacity-50"
                  >
                    <Pencil size={16} />
                  </button>

                  <button
                    type="button"
                    onClick={() => deleteSocialLink(index)}
                    disabled={saving}
                    title="Delete social link"
                    className="rounded-lg bg-red-50 p-2 text-red-600 hover:bg-red-100 disabled:opacity-50"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* REFRESH */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={fetchAboutSection}
          disabled={saving}
          className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50"
        >
          <RefreshCw size={17} />
          Reload All Content
        </button>
      </div>
    </div>
  );
}
