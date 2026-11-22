import React, { useEffect, useState } from "react";
import {
  Users,
  Save,
  RefreshCw,
  LoaderCircle,
  AlertCircle,
  CheckCircle2,
  Plus,
  Pencil,
  Trash2,
  X,
  Image as ImageIcon,
} from "lucide-react";

import api from "../../../services/api";

const initialData = {
  title: "",
  description: "",
  experts: [],
};

const initialExpert = {
  name: "",
  description: "",
  image: "",
};

export default function GuidanceManagement() {
  const [formData, setFormData] = useState(initialData);
  const [expertForm, setExpertForm] = useState(initialExpert);

  const [editingIndex, setEditingIndex] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // =====================================
  // FETCH GUIDANCE CONTENT
  // =====================================
  const fetchGuidance = async (showLoader = true) => {
    try {
      if (showLoader) setLoading(true);

      setError("");

      const response = await api.get("/about/guidance");
      const data = response.data?.data || response.data;

      setFormData({
        ...initialData,
        ...data,
        experts: Array.isArray(data.experts) ? data.experts : [],
      });
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to load guidance content.",
      );
    } finally {
      if (showLoader) setLoading(false);
    }
  };

  useEffect(() => {
    fetchGuidance();
  }, []);

  // =====================================
  // HANDLE SECTION INPUTS
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
  // HANDLE EXPERT INPUTS
  // =====================================
  const handleExpertChange = (e) => {
    const { name, value } = e.target;

    setExpertForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setMessage("");
    setError("");
  };

  // =====================================
  // SAVE SECTION CONTENT
  // =====================================
  const saveGuidanceContent = async (e) => {
    e.preventDefault();

    if (saving) return;

    try {
      setSaving(true);
      setError("");
      setMessage("");

      await api.put("/about/guidance", {
        title: formData.title,
        description: formData.description,
      });

      setMessage("Guidance section updated successfully!");
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to update guidance section.",
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================
  // RESET EXPERT FORM
  // =====================================
  const resetExpertForm = () => {
    setExpertForm(initialExpert);
    setEditingIndex(null);
  };

  // =====================================
  // ADD / UPDATE EXPERT
  // =====================================
  const saveExpert = async (e) => {
    e.preventDefault();

    if (saving) return;

    const payload = {
      name: expertForm.name.trim(),
      description: expertForm.description.trim(),
      image: expertForm.image.trim(),
    };

    if (!payload.name || !payload.description) {
      setError("Please enter the expert name and description.");
      return;
    }

    if (payload.image) {
      try {
        const url = new URL(payload.image);

        if (!["http:", "https:"].includes(url.protocol)) {
          throw new Error("Invalid URL protocol");
        }
      } catch {
        setError("Please enter a valid HTTP or HTTPS image URL.");
        return;
      }
    }

    try {
      setSaving(true);
      setError("");
      setMessage("");

      if (editingIndex !== null) {
        await api.patch(
          `/about/content/guidance/experts/${editingIndex}`,
          payload,
        );

        setMessage("Expert updated successfully!");
      } else {
        await api.post("/about/content/guidance/experts", payload);

        setMessage("Expert added successfully!");
      }

      resetExpertForm();

      await fetchGuidance(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save expert.");
    } finally {
      setSaving(false);
    }
  };

  // =====================================
  // START EXPERT EDIT
  // =====================================
  const editExpert = (index) => {
    const expert = formData.experts[index];

    setEditingIndex(index);

    setExpertForm({
      name: expert.name || "",
      description: expert.description || "",
      image: expert.image || "",
    });

    setError("");
    setMessage("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =====================================
  // DELETE EXPERT
  // =====================================
  const deleteExpert = async (index) => {
    if (saving) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete ${formData.experts[index].name}?`,
    );

    if (!confirmed) return;

    try {
      setSaving(true);
      setError("");
      setMessage("");

      await api.delete(`/about/content/guidance/experts/${index}`);

      if (editingIndex === index) {
        resetExpertForm();
      } else if (editingIndex !== null && editingIndex > index) {
        setEditingIndex((prev) => prev - 1);
      }

      setMessage("Expert deleted successfully!");

      await fetchGuidance(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete expert.");
    } finally {
      setSaving(false);
    }
  };

  // =====================================
  // LOADING STATE
  // =====================================
  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <LoaderCircle size={32} className="animate-spin text-[#009FF6]" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* PAGE HEADER */}
      <div>
        <div className="mb-2 flex items-center gap-2 text-sm text-gray-400">
          <span>Dashboard</span>
          <span>/</span>
          <span>About Page</span>
          <span>/</span>
          <span className="font-medium text-[#009FF6]">Guidance</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#EAF6FF] text-[#009FF6]">
            <Users size={24} />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-[#101828]">
              Guidance Management
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Manage experts and guidance information.
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

      {/* SECTION CONTENT */}
      <form
        onSubmit={saveGuidanceContent}
        className="space-y-5 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
      >
        <h2 className="border-b border-gray-100 pb-4 font-bold text-[#101828]">
          Guidance Section Content
        </h2>

        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Section Title
          </label>

          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter guidance section title"
            className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#009FF6]"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Section Description
          </label>

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            placeholder="Enter guidance description..."
            className="w-full resize-y rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#009FF6]"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-[#009FF6] px-6 py-3 font-semibold text-white hover:bg-[#0088D1] disabled:opacity-50"
          >
            {saving ? (
              <LoaderCircle size={18} className="animate-spin" />
            ) : (
              <Save size={18} />
            )}
            Save Section Content
          </button>
        </div>
      </form>

      {/* ADD / EDIT EXPERT */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-5 font-bold text-[#101828]">
          {editingIndex !== null ? "Edit Expert" : "Add New Expert"}
        </h2>

        <form onSubmit={saveExpert} className="space-y-5">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {/* EXPERT NAME */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Expert Name
              </label>

              <input
                type="text"
                name="name"
                value={expertForm.name}
                onChange={handleExpertChange}
                placeholder="Enter expert name"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#009FF6]"
                required
              />
            </div>

            {/* IMAGE URL */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Expert Image URL
              </label>

              <div className="relative">
                <ImageIcon
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="url"
                  name="image"
                  value={expertForm.image}
                  onChange={handleExpertChange}
                  placeholder="https://example.com/expert.jpg"
                  className="w-full rounded-xl border border-gray-200 py-3 pl-11 pr-4 outline-none focus:border-[#009FF6]"
                />
              </div>
            </div>
          </div>

          {/* IMAGE PREVIEW */}
          {expertForm.image && (
            <div className="flex items-center gap-4 rounded-xl border border-gray-200 p-3">
              <img
                src={expertForm.image}
                alt="Expert preview"
                className="h-20 w-20 rounded-lg object-cover"
                onError={(e) => {
                  e.currentTarget.style.opacity = "0.3";
                }}
              />

              <p className="text-sm text-gray-500">Expert image preview</p>
            </div>
          )}

          {/* DESCRIPTION */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Expert Description
            </label>

            <textarea
              name="description"
              value={expertForm.description}
              onChange={handleExpertChange}
              rows={4}
              placeholder="Enter expert information..."
              className="w-full resize-y rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#009FF6]"
              required
            />
          </div>

          {/* FORM BUTTONS */}
          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 rounded-xl bg-[#009FF6] px-6 py-3 font-semibold text-white hover:bg-[#0088D1] disabled:opacity-50"
            >
              {saving ? (
                <LoaderCircle size={18} className="animate-spin" />
              ) : editingIndex !== null ? (
                <Save size={18} />
              ) : (
                <Plus size={18} />
              )}

              {editingIndex !== null ? "Update Expert" : "Add Expert"}
            </button>

            {editingIndex !== null && (
              <button
                type="button"
                onClick={() => {
                  resetExpertForm();
                  setError("");
                  setMessage("");
                }}
                disabled={saving}
                className="flex items-center gap-2 rounded-xl border border-gray-200 px-5 py-3 font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50"
              >
                <X size={18} />
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      {/* EXPERTS LIST */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-bold text-[#101828]">Experts</h2>

          <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
            {formData.experts.length} Experts
          </span>
        </div>

        {formData.experts.length === 0 ? (
          <div className="rounded-xl border border-dashed p-10 text-center text-gray-500">
            No experts added yet. Add your first expert above.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {formData.experts.map((expert, index) => (
              <div
                key={expert._id || `${expert.name}-${index}`}
                className="overflow-hidden rounded-xl border border-gray-200"
              >
                {expert.image ? (
                  <img
                    src={expert.image}
                    alt={expert.name}
                    className="h-56 w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.opacity = "0.3";
                    }}
                  />
                ) : (
                  <div className="flex h-56 items-center justify-center bg-gray-100 text-gray-400">
                    <Users size={45} />
                  </div>
                )}

                <div className="space-y-3 p-4">
                  <div>
                    <h3 className="font-bold text-gray-900">{expert.name}</h3>

                    <p className="mt-2 line-clamp-4 text-sm leading-6 text-gray-500">
                      {expert.description}
                    </p>
                  </div>

                  <div className="flex gap-2 border-t border-gray-100 pt-3">
                    <button
                      type="button"
                      onClick={() => editExpert(index)}
                      disabled={saving}
                      className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-100 disabled:opacity-50"
                    >
                      <Pencil size={15} />
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => deleteExpert(index)}
                      disabled={saving}
                      className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-100 disabled:opacity-50"
                    >
                      <Trash2 size={15} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* RELOAD */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => fetchGuidance()}
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
