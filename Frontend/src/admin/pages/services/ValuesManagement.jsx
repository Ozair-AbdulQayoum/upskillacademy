import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/api/services/values";
const SERVER_URL = "http://localhost:5000";

export default function ValuesManagement() {
  const [values, setValues] = useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState(null);
  const [preview, setPreview] = useState("");

  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // =====================================
  // FETCH VALUES
  // =====================================

  const fetchValues = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(API_URL);

      setValues(response.data.data || []);
    } catch (err) {
      console.error("Fetch Values:", err);

      setError(err.response?.data?.message || "Failed to load values.");
    } finally {
      setLoading(false);
    }
  };

  // =====================================
  // AUTOMATIC ONE-TIME MIGRATION
  // =====================================

  const initializeValues = async () => {
    try {
      setLoading(true);
      setError("");

      // Migrate original static values.
      // Backend prevents duplicate migration.
      const migrationResponse = await axios.post(`${API_URL}/seed-defaults`);

      if (
        migrationResponse.data.message ===
        "Four original values migrated successfully."
      ) {
        setSuccess("Your four original values were migrated successfully.");
      }

      // Fetch values after migration.
      const response = await axios.get(API_URL);

      setValues(response.data.data || []);
    } catch (err) {
      console.error("Initialize Values:", err);

      setError(
        err.response?.data?.message ||
          "Failed to initialize values. Check your backend and SVG icons.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initializeValues();
  }, []);

  // =====================================
  // ICON PREVIEW
  // =====================================

  useEffect(() => {
    if (!icon) return;

    const objectUrl = URL.createObjectURL(icon);

    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [icon]);

  // =====================================
  // HANDLE ICON SELECTION
  // =====================================

  const handleIconChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];

    if (!allowedTypes.includes(file.type)) {
      setError("Only JPG, PNG, WEBP, and GIF icons are allowed.");
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Icon size must be less than 5 MB.");
      e.target.value = "";
      return;
    }

    setError("");
    setSuccess("");
    setIcon(file);
  };

  // =====================================
  // RESET FORM
  // =====================================

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setIcon(null);
    setPreview("");
    setEditingId(null);
    setError("");

    const fileInput = document.getElementById("value-icon");

    if (fileInput) {
      fileInput.value = "";
    }
  };

  // =====================================
  // EDIT VALUE
  // =====================================

  const handleEdit = (value) => {
    setEditingId(value._id);
    setTitle(value.title);
    setDescription(value.description);
    setIcon(null);

    setPreview(
      value.icon.startsWith("http") ? value.icon : `${SERVER_URL}${value.icon}`,
    );

    setError("");
    setSuccess("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =====================================
  // CREATE / UPDATE VALUE
  // =====================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!title.trim()) {
      setError("Please enter a value title.");
      return;
    }

    if (!description.trim()) {
      setError("Please enter a value description.");
      return;
    }

    if (!editingId && !icon) {
      setError("Please select an icon.");
      return;
    }

    try {
      setSaving(true);

      const formData = new FormData();

      formData.append("title", title.trim());
      formData.append("description", description.trim());

      if (icon) {
        formData.append("icon", icon);
      }

      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, formData);

        setSuccess("Value updated successfully.");
      } else {
        await axios.post(API_URL, formData);

        setSuccess("Value added successfully.");
      }

      resetForm();

      const response = await axios.get(API_URL);
      setValues(response.data.data || []);
    } catch (err) {
      console.error("Save Value:", err);

      setError(err.response?.data?.message || "Failed to save value.");
    } finally {
      setSaving(false);
    }
  };

  // =====================================
  // DELETE VALUE
  // =====================================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this value?",
    );

    if (!confirmed) return;

    setError("");
    setSuccess("");

    try {
      await axios.delete(`${API_URL}/${id}`);

      setSuccess("Value deleted successfully.");

      if (editingId === id) {
        resetForm();
      }

      const response = await axios.get(API_URL);
      setValues(response.data.data || []);
    } catch (err) {
      console.error("Delete Value:", err);

      setError(err.response?.data?.message || "Failed to delete value.");
    }
  };

  // =====================================
  // REFRESH
  // =====================================

  const handleRefresh = async () => {
    setSuccess("");
    await fetchValues();
  };

  // =====================================
  // COMPONENT UI
  // =====================================

  return (
    <div className="w-full min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Our Values
          </h1>

          <p className="text-sm text-gray-500 mt-2">
            Manage the values displayed on your Services page.
          </p>
        </div>

        <button
          type="button"
          onClick={handleRefresh}
          disabled={loading}
          className="px-5 py-3 rounded-xl border border-gray-200 bg-white
          text-gray-700 font-semibold hover:bg-gray-100
          transition disabled:opacity-50"
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* NOTIFICATIONS */}
      {error && (
        <div className="mb-5 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-5 p-4 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm">
          {success}
        </div>
      )}

      {/* FORM */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 md:p-7 mb-8 shadow-sm">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            {editingId ? "Edit Value" : "Add New Value"}
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Enter the value information and upload its icon.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* TITLE */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Value Title
            </label>

            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Ship & Iterate"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl
              outline-none focus:border-[#009BF5] focus:ring-2
              focus:ring-[#009BF5]/10 transition"
            />
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description
            </label>

            <textarea
              rows="4"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Write a short description..."
              className="w-full px-4 py-3 border border-gray-200 rounded-xl
              outline-none focus:border-[#009BF5] focus:ring-2
              focus:ring-[#009BF5]/10 transition resize-y"
            />
          </div>

          {/* ICON */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Value Icon
            </label>

            <div className="flex flex-col sm:flex-row sm:items-center gap-5">
              <div className="w-20 h-20 rounded-xl border border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden">
                {preview ? (
                  <img
                    src={preview}
                    alt="Value icon preview"
                    className="w-12 h-12 object-contain"
                  />
                ) : (
                  <span className="text-xs text-gray-400">No icon</span>
                )}
              </div>

              <div className="flex-1">
                <input
                  id="value-icon"
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp,.gif,image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleIconChange}
                  className="block w-full text-sm text-gray-600
                  file:mr-4 file:py-2.5 file:px-4 file:rounded-lg
                  file:border-0 file:bg-blue-50 file:text-blue-700
                  file:font-semibold hover:file:bg-blue-100"
                />

                <p className="text-xs text-gray-400 mt-2">
                  JPG, PNG, WEBP, or GIF. Maximum size: 5 MB.
                  {editingId && " Leave empty to keep the current icon."}
                </p>
              </div>
            </div>
          </div>

          {/* BUTTONS */}
          <div className="flex flex-wrap gap-3 pt-3">
            <button
              type="submit"
              disabled={saving || loading}
              className="px-6 py-3 rounded-xl bg-[#009BF5] text-white
              font-semibold hover:bg-blue-600 transition
              disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? "Saving..." : editingId ? "Update Value" : "Add Value"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-3 rounded-xl border border-gray-200
                text-gray-700 font-semibold hover:bg-gray-100 transition"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* VALUES LIST */}
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Existing Values</h2>

          <p className="text-sm text-gray-500 mt-1">
            {values.length} {values.length === 1 ? "value" : "values"} available
          </p>
        </div>
      </div>

      {/* LOADING / EMPTY / VALUES */}
      {loading ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center text-gray-500">
          Loading values...
        </div>
      ) : values.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center">
          <div className="text-4xl mb-3">✦</div>

          <h3 className="text-lg font-semibold text-gray-800">
            No values found
          </h3>

          <p className="text-sm text-gray-500 mt-2">
            Add your first value using the form above.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {values.map((value) => (
            <div
              key={value._id}
              className="bg-white border border-gray-200 rounded-2xl
              p-6 shadow-sm hover:shadow-md transition"
            >
              {/* ICON */}
              <div
                className="w-16 h-16 rounded-xl bg-[#009BF5]/10
              flex items-center justify-center mb-5"
              >
                <img
                  src={
                    value.icon.startsWith("http")
                      ? value.icon
                      : `${SERVER_URL}${value.icon}`
                  }
                  alt={`${value.title} icon`}
                  className="w-10 h-10 object-contain"
                />
              </div>

              {/* CONTENT */}
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {value.title}
              </h3>

              <p className="text-sm text-gray-500 leading-7 min-h-20">
                {value.description}
              </p>

              {/* ACTIONS */}
              <div className="flex items-center gap-3 mt-6 pt-5 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => handleEdit(value)}
                  className="flex-1 px-4 py-2.5 rounded-lg
                  bg-blue-50 text-blue-700 font-semibold
                  text-sm hover:bg-blue-100 transition"
                >
                  Edit
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(value._id)}
                  className="flex-1 px-4 py-2.5 rounded-lg
                  bg-red-50 text-red-600 font-semibold
                  text-sm hover:bg-red-100 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
