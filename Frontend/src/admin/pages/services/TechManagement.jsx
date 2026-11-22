import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Save,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Loader2,
  Database,
} from "lucide-react";

const API_URL = "http://localhost:5000/api/services/technologies";

const technologyOptions = [
  { name: "MySQL", icon: "mysql" },
  { name: "PostgreSQL", icon: "postgresql" },
  { name: "MongoDB", icon: "mongodb" },
  { name: "Vue.js", icon: "vuejs" },
  { name: "React", icon: "react" },
  { name: "Bootstrap", icon: "bootstrap" },
  { name: "Tailwind CSS", icon: "tailwindcss" },
  { name: "Svelte", icon: "svelte" },
  { name: "Angular", icon: "angular" },
  { name: "Firebase", icon: "firebase" },
  { name: "JavaScript", icon: "javascript" },
  { name: "TypeScript", icon: "typescript" },
  { name: "Next.js", icon: "nextjs" },
  { name: "Laravel", icon: "laravel" },
  { name: "GitLab", icon: "gitlab" },
  { name: "GitHub", icon: "github" },
  { name: "DigitalOcean", icon: "digitalocean" },
  { name: "Hostinger", icon: "hostinger" },
  { name: "Docker", icon: "docker" },
  { name: "Kubernetes", icon: "kubernetes" },
  { name: "PHP", icon: "php" },
  { name: "Node.js", icon: "nodejs" },
  { name: "Express.js", icon: "express" },
];

const emptyForm = { name: "", icon: "" };

export default function TechManagement() {
  const [technologies, setTechnologies] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchTechnologies = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(API_URL, {
        params: { _refresh: Date.now() },
      });

      const records = response.data?.data;

      setTechnologies(Array.isArray(records) ? records : []);
    } catch (err) {
      console.error("Fetch Technologies:", err);
      setError(
        err.response?.data?.message ||
          "Unable to load technologies. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTechnologies();
  }, [fetchTechnologies]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({ ...emptyForm });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.icon.trim()) {
      setError("Please enter a name and select an icon.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const payload = {
        name: formData.name.trim(),
        icon: formData.icon.trim(),
      };

      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, payload);
        setSuccess("Technology updated successfully.");
      } else {
        await axios.post(API_URL, payload);
        setSuccess("Technology added successfully.");
      }

      resetForm();
      await fetchTechnologies();
    } catch (err) {
      console.error("Save Technology:", err);
      setError(
        err.response?.data?.message ||
          "Unable to save technology. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (technology) => {
    setEditingId(technology._id);
    setFormData({
      name: technology.name || "",
      icon: technology.icon || "",
    });
    setError("");
    setSuccess("");

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this technology?")) {
      return;
    }

    try {
      setDeletingId(id);
      setError("");
      setSuccess("");

      await axios.delete(`${API_URL}/${id}`);

      setTechnologies((prev) => prev.filter((item) => item._id !== id));

      if (editingId === id) resetForm();

      setSuccess("Technology deleted successfully.");
    } catch (err) {
      console.error("Delete Technology:", err);
      setError(
        err.response?.data?.message ||
          "Unable to delete technology. Please try again.",
      );
    } finally {
      setDeletingId(null);
    }
  };

  const handleSeedDefaults = async () => {
    if (!window.confirm("Import the original 23 technologies?")) return;

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      await axios.post(`${API_URL}/seed-defaults`);

      setSuccess("Original technologies imported successfully.");
      await fetchTechnologies();
    } catch (err) {
      console.error("Seed Technologies:", err);
      setError(err.response?.data?.message || "Unable to import technologies.");
      await fetchTechnologies();
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Technology Management
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage technologies displayed on your Services page.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-lg">
            <Database size={18} />
            <span className="text-sm font-semibold">
              {technologies.length} Technologies
            </span>
          </div>

          <button
            type="button"
            onClick={fetchTechnologies}
            disabled={loading}
            className="p-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
            title="Refresh"
          >
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* MESSAGES */}
      {success && (
        <div className="flex items-center gap-2 p-4 rounded-lg bg-green-50 border border-green-200 text-green-700">
          <CheckCircle size={18} />
          <p className="text-sm font-medium">{success}</p>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700">
          <AlertCircle size={18} />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {/* FORM */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 md:p-6 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              {editingId ? "Edit Technology" : "Add New Technology"}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Enter the technology name and choose its matching icon.
            </p>
          </div>

          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-600"
            >
              <X size={17} />
              Cancel
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Technology Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. React"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Technology Icon
              </label>
              <select
                name="icon"
                value={formData.icon}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-white"
                required
              >
                <option value="">Select an icon</option>
                {technologyOptions.map((option) => (
                  <option key={option.icon} value={option.icon}>
                    {option.name} ({option.icon})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mt-6">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center justify-center gap-2 bg-[#009BF5] hover:bg-blue-600 text-white px-5 py-3 rounded-lg font-semibold transition disabled:opacity-60"
            >
              {saving ? (
                <Loader2 size={18} className="animate-spin" />
              ) : editingId ? (
                <Save size={18} />
              ) : (
                <Plus size={18} />
              )}

              {saving
                ? "Saving..."
                : editingId
                  ? "Update Technology"
                  : "Add Technology"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="px-5 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* TECHNOLOGIES */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 md:p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900">All Technologies</h2>
          <p className="text-sm text-gray-500 mt-1">
            These technologies appear on your public Services page.
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 size={32} className="animate-spin text-blue-500" />
            <p className="text-sm text-gray-500 mt-3">
              Loading technologies...
            </p>
          </div>
        ) : technologies.length === 0 ? (
          <div className="text-center py-14">
            <div className="w-14 h-14 mx-auto rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
              <Database size={26} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mt-4">
              No Technologies Found
            </h3>
            <p className="text-sm text-gray-500 mt-2 mb-6">
              Import the original 23 technologies or add your first technology.
            </p>
            <button
              type="button"
              onClick={handleSeedDefaults}
              className="inline-flex items-center gap-2 bg-[#009BF5] hover:bg-blue-600 text-white px-5 py-3 rounded-lg font-semibold transition"
            >
              <Database size={18} />
              Import Original 23 Technologies
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {technologies.map((technology) => (
              <div
                key={technology._id}
                className="flex items-center justify-between gap-3 border border-gray-200 rounded-xl p-4 hover:border-blue-300 hover:shadow-sm transition"
              >
                <div className="min-w-0">
                  <h3 className="font-semibold text-gray-800 truncate">
                    {technology.name}
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">
                    Icon: {technology.icon}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleEdit(technology)}
                    className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
                    title="Edit technology"
                  >
                    <Pencil size={17} />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(technology._id)}
                    disabled={deletingId === technology._id}
                    className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition disabled:opacity-50"
                    title="Delete technology"
                  >
                    {deletingId === technology._id ? (
                      <Loader2 size={17} className="animate-spin" />
                    ) : (
                      <Trash2 size={17} />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
