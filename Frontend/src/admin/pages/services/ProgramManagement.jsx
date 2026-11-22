import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Save,
  RefreshCw,
  Code,
  Image,
  AlertCircle,
} from "lucide-react";

const API_URL = "http://localhost:5000/api/services/programs";

const emptyForm = {
  title: "",
  icon: "web",
  description: "",
  features: [""],
  technologies: [""],
};

const iconOptions = [
  { value: "web", label: "Web Development" },
  { value: "uiux", label: "UI/UX Design" },
  { value: "graphic", label: "Graphic Design" },
  { value: "digital", label: "Digital Marketing" },
  { value: "ai", label: "AI & Machine Learning" },
  { value: "mobile", label: "Mobile App Development" },
];

export default function ProgramManagement() {
  const [programs, setPrograms] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // FETCH PROGRAMS
  const fetchPrograms = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(API_URL);
      const fetchedPrograms = response.data?.data;

      if (!Array.isArray(fetchedPrograms)) {
        throw new Error("Invalid programs response from server.");
      }

      setPrograms(fetchedPrograms);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to fetch programs.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  // INPUT CHANGE
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // FEATURE / TECHNOLOGY CHANGE
  const handleListChange = (field, index, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }));
  };

  // ADD FEATURE / TECHNOLOGY
  const addListItem = (field) => {
    setForm((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }));
  };

  // REMOVE FEATURE / TECHNOLOGY
  const removeListItem = (field, index) => {
    setForm((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  // RESET FORM
  const resetForm = () => {
    setForm({
      ...emptyForm,
      features: [""],
      technologies: [""],
    });

    setEditingId(null);
  };

  // CREATE / UPDATE PROGRAM
  const handleSubmit = async (e) => {
    e.preventDefault();

    const cleanedForm = {
      ...form,
      title: form.title.trim(),
      description: form.description.trim(),
      features: form.features.map((item) => item.trim()).filter(Boolean),
      technologies: form.technologies
        .map((item) => item.trim())
        .filter(Boolean),
    };

    if (!cleanedForm.title) {
      setError("Program title is required.");
      return;
    }

    if (!cleanedForm.description) {
      setError("Program description is required.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, cleanedForm);
        setSuccess("Program updated successfully.");
      } else {
        await axios.post(API_URL, cleanedForm);
        setSuccess("New program created successfully.");
      }

      resetForm();
      await fetchPrograms();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save program.");
    } finally {
      setSaving(false);
    }
  };

  // EDIT PROGRAM
  const handleEdit = (program) => {
    setEditingId(program._id);

    setForm({
      title: program.title || "",
      icon: program.icon || "web",
      description: program.description || "",
      features: program.features?.length ? [...program.features] : [""],
      technologies: program.technologies?.length
        ? [...program.technologies]
        : [""],
    });

    setError("");
    setSuccess("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // DELETE PROGRAM
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this program?",
    );

    if (!confirmed) return;

    try {
      setError("");
      setSuccess("");

      await axios.delete(`${API_URL}/${id}`);

      setPrograms((prev) => prev.filter((program) => program._id !== id));

      if (editingId === id) {
        resetForm();
      }

      setSuccess("Program deleted successfully.");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete program.");
    }
  };

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#009FF6]/10 text-[#009FF6] flex items-center justify-center">
            <Code size={25} />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Program Management
            </h1>
            <p className="text-sm text-gray-500">
              Manage your public Services program cards.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={fetchPrograms}
          disabled={loading}
          className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition disabled:opacity-50"
        >
          <RefreshCw size={17} />
          Refresh
        </button>
      </div>

      {/* NOTIFICATIONS */}
      {error && (
        <div className="flex items-center gap-2 p-4 rounded-xl bg-red-50 text-red-600 text-sm">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 rounded-xl bg-green-50 text-green-700 text-sm">
          {success}
        </div>
      )}

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 space-y-6"
      >
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              {editingId ? "Edit Program" : "Add New Program"}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Update the content displayed on your public Services page.
            </p>
          </div>

          {editingId && (
            <span className="text-xs font-semibold px-3 py-2 rounded-lg bg-blue-50 text-blue-600">
              Editing
            </span>
          )}
        </div>

        {/* TITLE AND ICON */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Program Title *
            </label>

            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Web Development"
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-[#009FF6]"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Program Icon *
            </label>

            <select
              name="icon"
              value={form.icon}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-[#009FF6] bg-white"
            >
              {iconOptions.map((icon) => (
                <option key={icon.value} value={icon.value}>
                  {icon.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* DESCRIPTION */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Description *
          </label>

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            required
            placeholder="Write program description..."
            className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-[#009FF6] resize-y"
          />
        </div>

        {/* FEATURES */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-semibold text-gray-700">
              Key Features
            </label>

            <button
              type="button"
              onClick={() => addListItem("features")}
              className="flex items-center gap-1 text-sm font-semibold text-[#009FF6]"
            >
              <Plus size={16} />
              Add Feature
            </button>
          </div>

          <div className="space-y-3">
            {form.features.map((feature, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={feature}
                  onChange={(e) =>
                    handleListChange("features", index, e.target.value)
                  }
                  placeholder={`Feature ${index + 1}`}
                  className="flex-1 min-w-0 px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-[#009FF6]"
                />

                <button
                  type="button"
                  onClick={() => removeListItem("features", index)}
                  disabled={form.features.length === 1}
                  className="p-3 rounded-xl text-red-500 hover:bg-red-50 disabled:opacity-30"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* TECHNOLOGIES */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-semibold text-gray-700">
              Technologies
            </label>

            <button
              type="button"
              onClick={() => addListItem("technologies")}
              className="flex items-center gap-1 text-sm font-semibold text-[#009FF6]"
            >
              <Plus size={16} />
              Add Technology
            </button>
          </div>

          <div className="space-y-3">
            {form.technologies.map((technology, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={technology}
                  onChange={(e) =>
                    handleListChange("technologies", index, e.target.value)
                  }
                  placeholder={`Technology ${index + 1}`}
                  className="flex-1 min-w-0 px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-[#009FF6]"
                />

                <button
                  type="button"
                  onClick={() => removeListItem("technologies", index)}
                  disabled={form.technologies.length === 1}
                  className="p-3 rounded-xl text-red-500 hover:bg-red-50 disabled:opacity-30"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex flex-wrap justify-end gap-3 pt-5 border-t border-gray-100">
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="flex items-center gap-2 px-5 py-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50"
            >
              <X size={17} />
              Cancel
            </button>
          )}

          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#009FF6] text-white font-semibold hover:bg-blue-600 disabled:opacity-60 transition"
          >
            <Save size={17} />
            {saving
              ? "Saving..."
              : editingId
                ? "Update Program"
                : "Create Program"}
          </button>
        </div>
      </form>

      {/* EXISTING PROGRAMS */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Existing Programs</h2>
          <p className="text-sm text-gray-500">
            {programs.length} program(s) available
          </p>
        </div>

        {loading ? (
          <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center text-gray-500">
            Loading programs...
          </div>
        ) : programs.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center">
            <Image size={35} className="mx-auto text-gray-300 mb-3" />

            <h3 className="font-semibold text-gray-700">No programs found</h3>

            <p className="text-sm text-gray-400 mt-1">
              Add a new program using the form above.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {programs.map((program) => (
              <div
                key={program._id}
                className="bg-white border border-gray-200 rounded-2xl p-6"
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">
                      {program.title}
                    </h3>

                    <p className="text-xs text-[#009FF6] mt-1">
                      Icon: {program.icon}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleEdit(program)}
                      className="p-2.5 rounded-lg text-blue-600 bg-blue-50 hover:bg-blue-100"
                      aria-label="Edit program"
                    >
                      <Pencil size={17} />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(program._id)}
                      className="p-2.5 rounded-lg text-red-600 bg-red-50 hover:bg-red-100"
                      aria-label="Delete program"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </div>

                <p className="text-sm text-gray-500 leading-6 mb-5">
                  {program.description}
                </p>

                <div className="mb-4">
                  <h4 className="text-sm font-bold text-gray-800 mb-2">
                    Features ({program.features?.length || 0})
                  </h4>

                  <ul className="space-y-1.5">
                    {program.features?.map((feature, index) => (
                      <li
                        key={index}
                        className="text-sm text-gray-500 flex gap-2"
                      >
                        <span className="text-[#009FF6]">•</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border-t border-gray-100 pt-4">
                  <h4 className="text-sm font-bold text-gray-800 mb-3">
                    Technologies
                  </h4>

                  <div className="flex flex-wrap gap-2">
                    {program.technologies?.map((tech, index) => (
                      <span
                        key={index}
                        className="px-3 py-1.5 rounded-md bg-gray-100 text-gray-600 text-xs font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
