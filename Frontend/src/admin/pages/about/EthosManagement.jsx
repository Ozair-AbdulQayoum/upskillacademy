import React, { useEffect, useState } from "react";
import {
  Target,
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
  BookOpen,
  Globe,
  Users,
  Lightbulb,
} from "lucide-react";

import api from "../../../services/api";

const initialData = {
  valuesBadge: "",
  valuesTitle: "",
  valuesParagraphs: [],
  missionBadge: "",
  missionTitle: "",
  missionDescription: "",
  images: [],
  features: [],
};

const iconOptions = [
  { value: "book", label: "Book", icon: BookOpen },
  { value: "globe", label: "Globe", icon: Globe },
  { value: "users", label: "Users", icon: Users },
  { value: "lightbulb", label: "Lightbulb", icon: Lightbulb },
];

export default function EthosManagement() {
  const [formData, setFormData] = useState(initialData);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [paragraphInput, setParagraphInput] = useState("");
  const [editingParagraphIndex, setEditingParagraphIndex] = useState(null);

  const [imageInput, setImageInput] = useState("");
  const [editingImageIndex, setEditingImageIndex] = useState(null);

  const [featureForm, setFeatureForm] = useState({
    title: "",
    description: "",
    icon: "book",
  });
  const [editingFeatureIndex, setEditingFeatureIndex] = useState(null);

  // =====================================
  // FETCH ETHOS CONTENT
  // =====================================
  const fetchEthos = async (showLoader = true) => {
    try {
      if (showLoader) setLoading(true);

      setError("");

      const response = await api.get("/about/ethos");
      const data = response.data?.data || response.data;

      setFormData({
        ...initialData,
        ...data,
        valuesParagraphs: Array.isArray(data.valuesParagraphs)
          ? data.valuesParagraphs
          : [],
        images: Array.isArray(data.images) ? data.images : [],
        features: Array.isArray(data.features) ? data.features : [],
      });
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to load Our Ethos content.",
      );
    } finally {
      if (showLoader) setLoading(false);
    }
  };

  useEffect(() => {
    fetchEthos();
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
  // SAVE MAIN ETHOS CONTENT
  // =====================================
  const saveEthos = async (e) => {
    e.preventDefault();

    if (saving) return;

    try {
      setSaving(true);
      setError("");
      setMessage("");

      await api.put("/about/ethos", {
        valuesBadge: formData.valuesBadge,
        valuesTitle: formData.valuesTitle,
        missionBadge: formData.missionBadge,
        missionTitle: formData.missionTitle,
        missionDescription: formData.missionDescription,
      });

      setMessage("Our Ethos content updated successfully!");
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to update Our Ethos content.",
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================
  // VALUES PARAGRAPHS
  // =====================================
  const saveParagraph = async (e) => {
    e.preventDefault();

    if (saving) return;

    const value = paragraphInput.trim();

    if (!value) {
      setError("Please enter a paragraph.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setMessage("");

      if (editingParagraphIndex !== null) {
        await api.patch(
          `/about/content/ourEthos/valuesParagraphs/${editingParagraphIndex}`,
          { value },
        );

        setMessage("Paragraph updated successfully.");
      } else {
        await api.post("/about/content/ourEthos/valuesParagraphs", { value });

        setMessage("Paragraph added successfully.");
      }

      setParagraphInput("");
      setEditingParagraphIndex(null);

      await fetchEthos(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save paragraph.");
    } finally {
      setSaving(false);
    }
  };

  const editParagraph = (index) => {
    setEditingParagraphIndex(index);
    setParagraphInput(formData.valuesParagraphs[index]);
    setError("");
    setMessage("");
  };

  const deleteParagraph = async (index) => {
    if (saving) return;

    if (!window.confirm("Delete this values paragraph?")) return;

    try {
      setSaving(true);
      setError("");
      setMessage("");

      await api.delete(`/about/content/ourEthos/valuesParagraphs/${index}`);

      if (editingParagraphIndex === index) {
        setEditingParagraphIndex(null);
        setParagraphInput("");
      } else if (
        editingParagraphIndex !== null &&
        editingParagraphIndex > index
      ) {
        setEditingParagraphIndex((prev) => prev - 1);
      }

      setMessage("Paragraph deleted successfully.");

      await fetchEthos(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete paragraph.");
    } finally {
      setSaving(false);
    }
  };

  const cancelParagraphEdit = () => {
    setEditingParagraphIndex(null);
    setParagraphInput("");
  };

  // =====================================
  // MISSION IMAGES
  // =====================================
  const saveImage = async (e) => {
    e.preventDefault();

    if (saving) return;

    const value = imageInput.trim();

    if (!value) {
      setError("Please enter an image URL.");
      return;
    }

    try {
      const url = new URL(value);

      if (!["http:", "https:"].includes(url.protocol)) {
        throw new Error("Invalid protocol");
      }
    } catch {
      setError("Please enter a valid image URL.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setMessage("");

      if (editingImageIndex !== null) {
        await api.patch(`/about/content/ourEthos/images/${editingImageIndex}`, {
          value,
        });

        setMessage("Mission image updated successfully.");
      } else {
        await api.post("/about/content/ourEthos/images", { value });

        setMessage("Mission image added successfully.");
      }

      setImageInput("");
      setEditingImageIndex(null);

      await fetchEthos(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save mission image.");
    } finally {
      setSaving(false);
    }
  };

  const editImage = (index) => {
    setEditingImageIndex(index);
    setImageInput(formData.images[index]);
    setError("");
    setMessage("");
  };

  const deleteImage = async (index) => {
    if (saving) return;

    if (!window.confirm("Delete this mission image?")) return;

    try {
      setSaving(true);
      setError("");
      setMessage("");

      await api.delete(`/about/content/ourEthos/images/${index}`);

      if (editingImageIndex === index) {
        setEditingImageIndex(null);
        setImageInput("");
      } else if (editingImageIndex !== null && editingImageIndex > index) {
        setEditingImageIndex((prev) => prev - 1);
      }

      setMessage("Mission image deleted successfully.");

      await fetchEthos(false);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to delete mission image.",
      );
    } finally {
      setSaving(false);
    }
  };

  const cancelImageEdit = () => {
    setEditingImageIndex(null);
    setImageInput("");
  };

  // =====================================
  // FEATURES
  // =====================================
  const saveFeature = async (e) => {
    e.preventDefault();

    if (saving) return;

    const payload = {
      title: featureForm.title.trim(),
      description: featureForm.description.trim(),
      icon: featureForm.icon,
    };

    if (!payload.title || !payload.description) {
      setError("Please complete the feature title and description.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setMessage("");

      if (editingFeatureIndex !== null) {
        await api.patch(
          `/about/content/ourEthos/features/${editingFeatureIndex}`,
          payload,
        );

        setMessage("Feature updated successfully.");
      } else {
        await api.post("/about/content/ourEthos/features", payload);

        setMessage("Feature added successfully.");
      }

      setFeatureForm({
        title: "",
        description: "",
        icon: "book",
      });

      setEditingFeatureIndex(null);

      await fetchEthos(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save feature.");
    } finally {
      setSaving(false);
    }
  };

  const editFeature = (index) => {
    const feature = formData.features[index];

    setEditingFeatureIndex(index);

    setFeatureForm({
      title: feature.title || "",
      description: feature.description || "",
      icon: feature.icon || "book",
    });

    setError("");
    setMessage("");
  };

  const deleteFeature = async (index) => {
    if (saving) return;

    if (!window.confirm("Delete this feature?")) return;

    try {
      setSaving(true);
      setError("");
      setMessage("");

      await api.delete(`/about/content/ourEthos/features/${index}`);

      if (editingFeatureIndex === index) {
        setEditingFeatureIndex(null);
        setFeatureForm({
          title: "",
          description: "",
          icon: "book",
        });
      } else if (editingFeatureIndex !== null && editingFeatureIndex > index) {
        setEditingFeatureIndex((prev) => prev - 1);
      }

      setMessage("Feature deleted successfully.");

      await fetchEthos(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete feature.");
    } finally {
      setSaving(false);
    }
  };

  const cancelFeatureEdit = () => {
    setEditingFeatureIndex(null);
    setFeatureForm({
      title: "",
      description: "",
      icon: "book",
    });
  };

  // =====================================
  // LOADING
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
      {/* HEADER */}
      <div>
        <div className="mb-2 flex items-center gap-2 text-sm text-gray-400">
          <span>Dashboard</span>
          <span>/</span>
          <span>About Page</span>
          <span>/</span>
          <span className="font-medium text-[#009FF6]">Our Ethos</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#EAF6FF] text-[#009FF6]">
            <Target size={24} />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-[#101828]">
              Our Ethos Management
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage values, mission, images and features.
            </p>
          </div>
        </div>
      </div>

      {/* MESSAGES */}
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

      {/* MAIN CONTENT */}
      <form onSubmit={saveEthos} className="space-y-6">
        {/* VALUES */}
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-5 border-b border-gray-100 pb-4 font-bold text-[#101828]">
            Our Values Content
          </h2>

          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Values Badge
              </label>

              <input
                name="valuesBadge"
                value={formData.valuesBadge}
                onChange={handleChange}
                placeholder="Our Values"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#009FF6]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Values Title
              </label>

              <input
                name="valuesTitle"
                value={formData.valuesTitle}
                onChange={handleChange}
                placeholder="Enter values title"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#009FF6]"
              />
            </div>
          </div>
        </section>

        {/* MISSION CONTENT */}
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-5 border-b border-gray-100 pb-4 font-bold text-[#101828]">
            Our Mission Content
          </h2>

          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Mission Badge
              </label>

              <input
                name="missionBadge"
                value={formData.missionBadge}
                onChange={handleChange}
                placeholder="Our Mission"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#009FF6]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Mission Title
              </label>

              <input
                name="missionTitle"
                value={formData.missionTitle}
                onChange={handleChange}
                placeholder="Enter mission title"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#009FF6]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Mission Description
              </label>

              <textarea
                name="missionDescription"
                value={formData.missionDescription}
                onChange={handleChange}
                rows={5}
                placeholder="Enter mission description..."
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#009FF6] resize-y"
              />
            </div>
          </div>
        </section>

        <div className="flex justify-end rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
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
            Save Ethos Content
          </button>
        </div>
      </form>

      {/* VALUES PARAGRAPHS */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-5 font-bold text-[#101828]">Values Paragraphs</h2>

        <form
          onSubmit={saveParagraph}
          className="flex flex-col gap-3 sm:flex-row"
        >
          <textarea
            value={paragraphInput}
            onChange={(e) => setParagraphInput(e.target.value)}
            rows={2}
            placeholder="Enter values paragraph..."
            className="min-w-0 flex-1 rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#009FF6]"
          />

          <button
            type="submit"
            disabled={saving}
            className="flex items-center justify-center gap-2 rounded-xl bg-[#009FF6] px-5 py-3 font-medium text-white disabled:opacity-50"
          >
            {saving ? (
              <LoaderCircle size={17} className="animate-spin" />
            ) : editingParagraphIndex !== null ? (
              <Save size={17} />
            ) : (
              <Plus size={17} />
            )}
            {editingParagraphIndex !== null ? "Update" : "Add"}
          </button>

          {editingParagraphIndex !== null && (
            <button
              type="button"
              onClick={cancelParagraphEdit}
              disabled={saving}
              className="rounded-xl border px-4 py-3 hover:bg-gray-50"
            >
              <X size={17} />
            </button>
          )}
        </form>

        <div className="mt-5 space-y-3">
          {formData.valuesParagraphs.length === 0 ? (
            <p className="rounded-xl border border-dashed p-6 text-center text-sm text-gray-500">
              No values paragraphs added yet.
            </p>
          ) : (
            formData.valuesParagraphs.map((paragraph, index) => (
              <div
                key={`${index}-${paragraph}`}
                className="flex items-start justify-between gap-3 rounded-xl border border-gray-200 p-4"
              >
                <p className="flex-1 text-sm leading-7 text-gray-600">
                  {paragraph}
                </p>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => editParagraph(index)}
                    disabled={saving}
                    className="rounded-lg bg-blue-50 p-2 text-blue-600 hover:bg-blue-100 disabled:opacity-50"
                  >
                    <Pencil size={16} />
                  </button>

                  <button
                    type="button"
                    onClick={() => deleteParagraph(index)}
                    disabled={saving}
                    className="rounded-lg bg-red-50 p-2 text-red-600 hover:bg-red-100 disabled:opacity-50"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* MISSION IMAGES */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center gap-3">
          <ImageIcon className="text-[#009FF6]" size={22} />

          <h2 className="font-bold text-[#101828]">Mission Images</h2>
        </div>

        <form
          onSubmit={saveImage}
          className="mb-6 flex flex-col gap-3 sm:flex-row"
        >
          <input
            type="url"
            value={imageInput}
            onChange={(e) => setImageInput(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="min-w-0 flex-1 rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#009FF6]"
            required
          />

          <button
            type="submit"
            disabled={saving}
            className="flex items-center justify-center gap-2 rounded-xl bg-[#009FF6] px-5 py-3 font-medium text-white disabled:opacity-50"
          >
            {saving ? (
              <LoaderCircle size={17} className="animate-spin" />
            ) : editingImageIndex !== null ? (
              <Save size={17} />
            ) : (
              <Plus size={17} />
            )}
            {editingImageIndex !== null ? "Update Image" : "Add Image"}
          </button>

          {editingImageIndex !== null && (
            <button
              type="button"
              onClick={cancelImageEdit}
              disabled={saving}
              className="rounded-xl border px-4 py-3 hover:bg-gray-50"
            >
              <X size={17} />
            </button>
          )}
        </form>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {formData.images.map((image, index) => (
            <div
              key={`${index}-${image}`}
              className="overflow-hidden rounded-xl border"
            >
              <img
                src={image}
                alt={`Mission image ${index + 1}`}
                className="h-48 w-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.opacity = "0.3";
                }}
              />

              <div className="flex items-center justify-between p-3">
                <span className="text-sm font-medium text-gray-700">
                  Image {index + 1}
                </span>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => editImage(index)}
                    disabled={saving}
                    className="rounded-lg bg-blue-50 p-2 text-blue-600 hover:bg-blue-100 disabled:opacity-50"
                  >
                    <Pencil size={16} />
                  </button>

                  <button
                    type="button"
                    onClick={() => deleteImage(index)}
                    disabled={saving}
                    className="rounded-lg bg-red-50 p-2 text-red-600 hover:bg-red-100 disabled:opacity-50"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {formData.images.length === 0 && (
            <div className="col-span-full rounded-xl border border-dashed p-8 text-center text-gray-500">
              No mission images added yet.
            </div>
          )}
        </div>
      </section>

      {/* FEATURES */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-5 font-bold text-[#101828]">Features Management</h2>

        <form
          onSubmit={saveFeature}
          className="mb-6 space-y-4 rounded-xl bg-gray-50 p-5"
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <input
              type="text"
              value={featureForm.title}
              onChange={(e) =>
                setFeatureForm((prev) => ({
                  ...prev,
                  title: e.target.value,
                }))
              }
              placeholder="Feature title"
              className="rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-[#009FF6]"
              required
            />

            <select
              value={featureForm.icon}
              onChange={(e) =>
                setFeatureForm((prev) => ({
                  ...prev,
                  icon: e.target.value,
                }))
              }
              className="rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-[#009FF6]"
            >
              {iconOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <textarea
            value={featureForm.description}
            onChange={(e) =>
              setFeatureForm((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
            rows={3}
            placeholder="Feature description..."
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-[#009FF6]"
            required
          />

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 rounded-xl bg-[#009FF6] px-5 py-3 font-medium text-white disabled:opacity-50"
            >
              {saving ? (
                <LoaderCircle size={17} className="animate-spin" />
              ) : editingFeatureIndex !== null ? (
                <Save size={17} />
              ) : (
                <Plus size={17} />
              )}
              {editingFeatureIndex !== null ? "Update Feature" : "Add Feature"}
            </button>

            {editingFeatureIndex !== null && (
              <button
                type="button"
                onClick={cancelFeatureEdit}
                disabled={saving}
                className="flex items-center gap-2 rounded-xl border bg-white px-4 py-3 hover:bg-gray-50"
              >
                <X size={17} />
                Cancel
              </button>
            )}
          </div>
        </form>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {formData.features.map((feature, index) => {
            const Icon =
              iconOptions.find((item) => item.value === feature.icon)?.icon ||
              BookOpen;

            return (
              <div
                key={feature._id || `${feature.title}-${index}`}
                className="rounded-xl border border-gray-200 p-5"
              >
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF6FF] text-[#009FF6]">
                    <Icon size={21} />
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => editFeature(index)}
                      disabled={saving}
                      className="rounded-lg bg-blue-50 p-2 text-blue-600 hover:bg-blue-100 disabled:opacity-50"
                    >
                      <Pencil size={16} />
                    </button>

                    <button
                      type="button"
                      onClick={() => deleteFeature(index)}
                      disabled={saving}
                      className="rounded-lg bg-red-50 p-2 text-red-600 hover:bg-red-100 disabled:opacity-50"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <h3 className="mb-2 font-semibold text-gray-900">
                  {feature.title}
                </h3>

                <p className="text-sm leading-6 text-gray-500">
                  {feature.description}
                </p>
              </div>
            );
          })}

          {formData.features.length === 0 && (
            <div className="col-span-full rounded-xl border border-dashed p-8 text-center text-gray-500">
              No features added yet.
            </div>
          )}
        </div>
      </section>

      {/* RELOAD */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => fetchEthos()}
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
